const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const { db } = require('../dbConnect');

const router = express.Router();

// @route   POST  api/users
// @desc    Register a user
// @access  Public
router.post(
  '/',
  [
    check('name', 'Please provide a name').not().isEmpty(),
    check('email', 'Please enter a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 8 or more characters'
    ).isLength({ min: 8 })
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;

    try {
      let user = await db.select('*').from('users').where('email', '=', email);

      if (user.length !== 0) {
        return res
          .status(400)
          .json({ msg: 'User already exists, Please try with a new email' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const promisify = (fn) => new Promise((resolve) => fn(resolve));
      const trx = await promisify(db.transaction.bind(db));
      try {
        const loginEmail = await trx
          .insert({
            id: uuidv4(),
            hash: hashedPassword,
            email: email
          })
          .into('login')
          .returning('email');

        user = await trx('users').returning('*').insert({
          id: uuidv4(),
          email: loginEmail[0],
          name: name,
          joined: new Date()
        });

        await trx.commit();
      } catch (err) {
        console.log(err);
        await trx.rollback();
      }

      const payload = {
        id: user[0].id
      };

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN
        },
        (err, token) => {
          if (err) throw err;
          res.status(200).json({ token });
        }
      );
    } catch (err) {
      console.log(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;

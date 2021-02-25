const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authO = require('../middleware/authO');
const { db } = require('../dbConnect');

const router = express.Router();

// @route   GET  api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', authO, async (req, res) => {
  try {
    const user = await db
      .select('*')
      .from('users')
      .where('id', '=', req.user.id);

    res.status(200).json({ user: user[0] });
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST  api/auth
// @desc    Authorize user and get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Please enter a password to log in').exists()
  ],
  async (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const checkUser = await db
        .select('email', 'hash')
        .from('login')
        .where('email', '=', email);

      if (checkUser.length === 0) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, checkUser[0].hash);

      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid Credentials' });
      }

      const user = await db
        .select('*')
        .from('users')
        .where('email', '=', email);

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
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;

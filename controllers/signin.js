/* eslint-disable no-unused-vars */
const auth = require('./auth');
//const jwt = require('jsonwebtoken');

const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json('Please provide email and password to sign in!');
  }
  db.select('email', 'hash')
    .from('login')
    .where('email', '=', email)
    .then((data) => {
      //console.log(data);
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (!isValid) {
        return res
          .status(400)
          .json('Please provide a valid email and password to sign in!');
      }
      db.select('*')
        .from('users')
        .where('email', '=', email)
        .then((user) => {
          //const tokenJWT = await token(user[0].id);
          // const token = (id) => {
          //   return jwt.sign({ id: id }, process.env.JWT_SECRET, {
          //     expiresIn: process.env.JWT_EXPIRES_IN
          //   });
          // };
          const tokenJWT = auth.createToken(user[0].id);
          res.status(200).json({
            data: user[0],
            tokenJWT
          });
        })
        .catch((err) => res.status(400).json(err));
    })
    .catch((err) =>
      res
        .status(400)
        .json('Please provide a valid email and password to sign in!')
    );
};

module.exports = {
  handleSignin
};

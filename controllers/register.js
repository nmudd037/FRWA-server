/* eslint-disable no-unused-vars */
const auth = require('./auth');

const handleRegister = (db, bcrypt, uuidv4) => (req, res) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password) {
    return res
      .status(400)
      .json('Please provide required credentials to register!');
  }
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);
  db.transaction((trx) => {
    trx
      .insert({
        id: uuidv4(),
        hash: hash,
        email: email
      })
      .into('login')
      .returning('email')
      .then((loginEmail) => {
        return trx('users')
          .returning('*')
          .insert({
            id: uuidv4(),
            email: loginEmail[0],
            name: name,
            joined: new Date()
          })
          .then((user) => {
            const tokenJWT = auth.createToken(user[0].id);
            res.json({
              data: user[0],
              tokenJWT
            });
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => {
    if (err.detail.includes('email')) {
      return res.status(400).json('Provided email is already in use');
    }

    return res
      .status(400)
      .json('Something went wrong while registering, Please try again later!');
  });
};

module.exports = {
  handleRegister
};

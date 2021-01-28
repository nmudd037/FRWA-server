/* eslint-disable no-unused-vars */
const auth = require('./auth');

const handleProfile = (req, res, db) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  const decoded = auth.decodeToken(token);

  if (
    Object.prototype.toString.call(decoded) === '[object String]' &&
    decoded.includes('invalid')
  ) {
    return res.json('Token expired or invalid');
  }

  const userId = decoded.id;
  db.select('*')
    .from('users')
    .where('id', '=', userId)
    .then((user) => {
      res.json(user[0]);
    })
    .catch((err) => res.status(400).json('Error Getting User'));
};

module.exports = {
  handleProfile
};

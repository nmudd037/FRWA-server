const jwt = require('jsonwebtoken');

const createToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const decodeToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return 'JWT expired or invalid';
    return decoded;
  });
};
module.exports = {
  createToken,
  decodeToken
};

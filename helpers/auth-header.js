const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../config/key')

exports.getId = (authHeader, callback) => {
  if (!authHeader) return callback(new Error('authorization header not found'));

  // Get the last part from a authorization header string like "bearer token-value"
  const token = authHeader.split(' ')[1];

  // Decode the token using a secret key-phrase
  return jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      return callback(err);
    }

    return callback(null, decoded._id);
  });
};

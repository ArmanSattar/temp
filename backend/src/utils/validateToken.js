const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const validateToken = (token) => {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = validateToken; 
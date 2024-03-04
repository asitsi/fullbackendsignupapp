const jwt = require('jsonwebtoken');

const context = ({ req }) => {
  const token = req.headers.authorization || '';
  try {
    const user = jwt.verify(token, process.env.YOUR_SECRET_KEY);
    return { user };
  } catch (error) {
    return {};
  }
};

module.exports = { context };

// Import necessary modules
const jwt = require('jsonwebtoken');
const config = require('../config'); // Import your configuration file where you store secret key and other configurations

// Authentication middleware
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
  
    if (!token) {
      return res.send({
        status: 401,
        message: "Access denied. Token missing.",
      });
    }
  
    try {
      const decoded = jwt.verify(token.replace('Bearer ', ''), config.jwtSecret);
      req.user = decoded;
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.send({
        status: 401,
        message: "Access denied invalid token.",
        error:error.message
      });
    }
  };
  

module.exports = authMiddleware;

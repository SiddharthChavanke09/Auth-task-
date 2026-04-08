const express = require('express');
const {
  register,
  login,
  refreshToken,
  logout,
} = require('../controllers/authController');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/refresh-token', refreshToken);

// Protected routes
router.post('/logout', authenticateToken, logout);

module.exports = router;

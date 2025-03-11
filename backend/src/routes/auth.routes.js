const express = require('express');
const router = express.Router();
const { login, getCurrentUser, signup } = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// public routelar
router.post('/login', login);
router.post('/signup', signup);

// private route
router.get('/me', authenticate, getCurrentUser);

module.exports = router; 
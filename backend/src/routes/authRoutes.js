const express = require('express');
const { register, login, logout, getProfile } = require('../controllers/authController');
const router = express.Router();

router.get('/profile', getProfile);
router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

module.exports = router;

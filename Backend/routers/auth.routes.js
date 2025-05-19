const express = require('express')
const { register, login, logout, resetPassword, resetPass, verifyToken } = require('../controllers/auth.controller');
const { validateRegister } = require('../middlewares/register.middleware');
const { validateLogin } = require('../middlewares/login.middleware');
const { verifyEmail } = require('../controllers/verifyEmail.controller');
const { changePassword } = require('../controllers/changePass.controller');
const { googleLogin, googleCallback } = require('../controllers/auth.controller');

const router = express.Router()

// Register
router.post('/register', validateRegister, register);

// Login
router.post('/login', validateLogin, login);

// Google OAuth login
router.get('/google', googleLogin);

// Google OAuth callback
router.get('/google/callback', googleCallback);

// Logout
router.post('/logout', logout);

// verify email account
router.get('/verify-email', verifyEmail);

// Reset password
router.post('/reset-password', resetPassword);

// resetPass another logic
router.post('/reset-pass', resetPass)

// Verify token
router.post('/verify-token', verifyToken);

// Change password
router.post('/change-password', changePassword);

module.exports = router;
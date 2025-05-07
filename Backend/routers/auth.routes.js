const express = require('express')
const { register, login, logout, resetPassword } = require('../controllers/auth.controller');
const { validateRegister } = require('../middlewares/register.middleware');
const { validateLogin } = require('../middlewares/login.middleware');
const { verifyEmail } = require('../controllers/verify.controller');
const { changePassword } = require('../controllers/changePass.controller');

const router = express.Router()

// Register
router.post('/register', validateRegister, register);

// Login
router.post('/login', validateLogin, login);

// Logout
router.post('/logout', logout);

// verify email account
router.get('/verify-email', verifyEmail);

// Reset Password
router.post('/reset-password', resetPassword);

// Change Password
router.post('/change-password', changePassword);


module.exports = router;
const express = require('express');
const router = express.Router();
const { searchUser } = require('../controllers/user.controller');
const verifyToken = require('../middlewares/verifyToken.middleware');


router.get("/search", searchUser);

// check those routes are protected
console.log('Do not forget user Routes');
// router.get('/me', verifyToken, getUser);

router.get('/verify-token', verifyToken, (req, res) => {
    res.status(200).json({ success: true, message: 'Token is valid', data: req.user });
});

module.exports = router;
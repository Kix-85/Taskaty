const express = require('express');
const router = express.Router();
const { getMyProfile, updateProfile, getUser, updateUser, deleteUser, searchUser } = require('../controllers/user.controller');
const verifyToken = require('../middlewares/verifyToken.middleware');
const upload = require('../middlewares/upload.middleware');
const path = require('path');

router.use(verifyToken);

// Serve uploaded files
router.use('/uploads', express.static(path.join(__dirname, '../uploads')));

router.get('/verify-token', (req, res) => {
    res.status(200).json({ success: true, message: 'Token is valid', data: req.user });
});

router.get('/me', getMyProfile);
router.put('/me', upload.single('profileImage'), updateProfile);
router.get('/:userID', getUser);
router.put('/:userID', updateUser);
router.delete('/:userID', deleteUser);
router.get("/search", searchUser);
// Admin routes
// router.get('/admin/users', getAllUsers);

module.exports = router;
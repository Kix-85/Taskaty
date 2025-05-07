const User = require('../models/user.model.js')

module.exports.validateRegister = async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;

    // Check for missing fields
    if (!name || !email || !password || !confirmPassword) {
        return res.status(400).json({ success: false, message: 'Missing Details' });
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    next();
};
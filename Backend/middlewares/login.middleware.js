const User = require('../models/user.model.js')
const bcrypt = require('bcrypt');

module.exports.validateLogin = async (req, res, next) => {
    console.log('From login middleware:', req.body)
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email and Password are required' });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log('User not found:', user);
            return res.status(401).json({ success: false, message: 'Email does not exist. Please register first!' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('Password does not match:', isMatch);
            return res.status(401).json({ success: false, message: 'Invalid email or password' });
        }

        if (!user.isAccountVerified) {
            console.log('User is not verified:', user.isAccountVerified);
            return res.status(401).json({ success: false, message: 'Please verify your email address' });
        }

        // Attach user to request object for use in controller
        req.user = user;
        next();
    } catch (error) {
        console.log('Login validation error:', error.message);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

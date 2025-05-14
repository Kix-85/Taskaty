const User = require('../models/user.model.js')

module.exports.validateRegister = async (req, res, next) => {
    console.log('reguest from validdateRegister:', req.body)
    const { name, email, password, confirmPassword } = req.body;

    // Check for missing fields
    if (!name || !email || !password || !confirmPassword) {
        console.log('Error: empty')
        return res.status(400).json({ success: false, message: 'Missing Details' });
    }

    const existedUser = await User.findOne({ email });
    if (existedUser) {
        console.log("error: existed")
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    if (password !== confirmPassword) {
        console.log('error: confirm');
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    next();
};
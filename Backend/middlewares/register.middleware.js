const User = require('../models/user.model.js')

module.exports.validateRegister = async (req, res, next) => {
    console.log('reguest from validateRegister:', req.body)
    const { name, email, username, password, confirmPassword } = req.body;

    // Check for missing fields
    if (!name || !email || !username || !password || !confirmPassword) {
        console.log('Error: empty')
        return res.status(400).json({ success: false, message: 'Missing Details' });
    }

    const existedUserEmail = await User.findOne({ email });
    if (existedUserEmail) {
        console.log("error: existed email")
        return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const existedUserName = await User.findOne({ username });
    if (existedUserName) {
        console.log("error: existed username")
        return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    if (password !== confirmPassword) {
        console.log('error: confirm');
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    next();
};
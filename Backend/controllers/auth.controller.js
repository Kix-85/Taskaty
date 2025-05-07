const User = require('../models/user.model.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { verificationEmailTemplate } = require('../utils/templates/verifyEmail.template');  // Correct the import here
const { resetPasswordTemplate } = require('../utils/templates/resetPass.template.js');
const { sendEmail } = require('../utils/sendEmail.js');

// register controller
module.exports.register = async (req, res) => {
    const { username, name, email, password, birthDate } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(User);
        const user = await User.create({ username, name, email, password: hashedPassword, birthDate });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Send verification email
        const subject = 'Verify your email address';
        console.log(verificationEmailTemplate);
        const template = verificationEmailTemplate(`${process.env.VERIFICATIONLINK}?token=${token}`, user.name);
        await sendEmail(user.email, subject, template);

        console.log('Verification email sent to:', user.email, ' successfully!');
        return res.status(201).json({ success: true, message: 'We have sent Email verification, please check your Email to verify your account' });
    } catch (error) {
        console.log('Error from register controller: ', error.message);
        return res.status(500).json({ success: false, message: 'Something went wrong (register controller)' });
    }
};

// login controller
module.exports.login = async (req, res) => {
    const user = req.user;

    try {
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.log('Error:', error.message);
        return res.status(500).json({ success: false, message: 'Something went wrong' });
    }
};

// reset password controller
module.exports.resetPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if(!user) {
        return res.status(404).json({success: false, message: "User not found"});
    }

    try {
        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })
    
        // send email with reset password link
        const resetPasswordLink = `${process.env.RESET_PASS_LINK}?token=${token}`;
        const template = resetPasswordTemplate(resetPasswordLink, user.name);
        const subject = 'Reset your password';
        await sendEmail(user.email, subject, template);

        console.log('Reset password email sent to:', user.email, ' successfully!');
        return res.status(200).json({success: true, message: "check your email to reset your password"});
    } catch (error) {
        console.log('Error from resetPassword controller: ', error.message);
        return res.status(500).json({ success: false, message: 'Something went wrong (resetPassword controller)' });
    }
}

// logout controller
module.exports.logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict'
        })
        return res.status(200).json({ success: true, message: 'User Logged out successfully' })
    } catch (error) {
        console.log("Error: ", error.message);
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}
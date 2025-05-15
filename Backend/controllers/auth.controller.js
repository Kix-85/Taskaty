const User = require('../models/user.model.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { verificationEmailTemplate } = require('../utils/templates/verifyEmail.template');  // Correct the import here
const { resetPasswordTemplate } = require('../utils/templates/resetPass.template.js');
const { sendEmail } = require('../utils/sendEmail.js');
const passport = require('../config/passport'); 
const { generateTokenService, setJwtCookie } = require('../services/jwtService.js');

// Start Google OAuth flow
exports.googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

// Handle Google OAuth callback
exports.googleCallback = async (req, res, next) => {
    try {
        // Passport authentication callback
        passport.authenticate('google', async (err, user, info) => {
            if (err) {
                console.error('Error during Google authentication:', err);
                return res.redirect(`${process.env.FRONTEND_URL}/auth`);
            }

            if (!user) {
                console.log('User not found in database');
                return res.redirect(`${process.env.FRONTEND_URL}/auth`);
            }

            // Generate JWT after successful login
            const payload = {
                userId: user._id,
                name: user.name,
                email: user.email,
            };
            console.log('User found:', user, "\nUser payload:", payload);
            // Generate JWT token and set it in the cookie
            const token = generateTokenService(payload, '1h');
            setJwtCookie(res, token);

            res.redirect(`${process.env.FRONTEND_URL}/dashboard`);

            // Redirect to dashboard after successful login
        })(req, res, next);
    } catch (error) {
        console.error('Error during Google authentication:', error);
        console.error(error);
        res.redirect(`${process.env.FRONTEND_URL}/auth`); // On failure, redirect to auth
    }
};


// register controller
module.exports.register = async (req, res) => {
    console.log('request from register');
    const { username, name, email, password, birthDate } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(User);
        const user = await User.create({ username, name, email, password: hashedPassword, birthDate });

        // Generate JWT token and set it in the cookie
        const token = generateTokenService({id: user._id}, process.env.JWT_EXPIRES_IN);
        // setJwtCookie(res, token);
        console.log("Token generated and set in cookie:", token);
        // Send verification email
        const subject = 'Verify your email address';
        console.log(verificationEmailTemplate);
        const template = verificationEmailTemplate(`${process.env.VERIFICATIONLINK}?token=${token}`, user.name);
        await sendEmail(user.email, subject, template);

        console.log('Verification email sent to:', user.email, ' successfully!');
        return res.status(201).json({ success: true, message: 'We have sent Email verification, please check your Email to verify your account' });
    } catch (error) {
        console.log('Error from register controller: ', error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
};

// login controller
module.exports.login = async (req, res) => {
    console.log('From login:', req.body);
    const user = req.user;

    try {
        const token = generateTokenService({id: user._id}, process.env.JWT_EXPIRES_IN);
        setJwtCookie(res, token);

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            user: { id: user._id, name: user.name, email: user.email },
        });
    } catch (error) {
        console.log('Error:', error.message);
        return res.status(500).json({ success: false, message: 'Something went wrong' + error.message });
    }
};

// reset password controller
module.exports.resetPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
    }

    try {
        const token = generateTokenService({ id: user._id }, process.env.JWT_EXPIRES_IN);

        // send email with reset password link
        const resetPasswordLink = `${process.env.RESET_PASS_LINK}?token=${token}`;
        const template = resetPasswordTemplate(resetPasswordLink, user.name);
        const subject = 'Reset your password';
        await sendEmail(user.email, subject, template);

        console.log('Reset password email sent to:', user.email, ' successfully!');
        return res.status(200).json({ success: true, message: "check your email to reset your password" });
    } catch (error) {
        console.log('Error from resetPassword controller: ', error.message);
        return res.status(500).json({ success: false, message: 'Something went wrong (resetPassword controller)' + error.message });
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
        return res.status(500).json({ success: false, message: 'Something went wrong' + error.message })
    }
}
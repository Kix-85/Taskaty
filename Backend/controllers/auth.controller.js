const User = require('../models/user.model.js')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const { verificationEmailTemplate } = require('../utils/templates/verifyEmail.template');
const { resetPasswordTemplate } = require('../utils/templates/resetPass.template.js');
const { sendEmail } = require('../utils/sendEmail.js');
const passport = require('../config/passport');
const { generateTokenService, setJwtCookie } = require('../services/jwtService.js');

// Login handler
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate payload
        const payload = {
            id: user._id,
            name: user.name,
            email: user.email
        };

        // Generate token
        const token = generateTokenService(payload, '1d');
        
        // Set token in cookie
        setJwtCookie(res, token);

        // Also send token in response for client-side storage
        res.status(200).json({
            message: 'Login successful',
            user: payload,
            token
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

// Start Google OAuth flow
exports.googleLogin = passport.authenticate('google', { scope: ['profile', 'email'] });

// Handle Google OAuth callback
exports.googleCallback = async (req, res, next) => {
    try {
        // Passport authentication callback
        passport.authenticate('google', async (err, user, info) => {
            if (err) {
                console.error('Error during Google authentication:', err);
                return res.redirect(`${process.env.FRONTEND_URL}/auth?error=auth_failed`);
            }

            if (!user) {
                console.log('User not found in database');
                return res.redirect(`${process.env.FRONTEND_URL}/auth?error=user_not_found`);
            }

            // Generate JWT after successful login
            const payload = {
                id: user._id,
                name: user.name,
                email: user.email,
            };
            
            // Generate JWT token
            const token = generateTokenService(payload, '1d');
            
            // Set token in cookie with proper options
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                path: '/'
            });

            // Redirect to frontend with token
            const redirectUrl = new URL('/auth', process.env.FRONTEND_URL);
            redirectUrl.searchParams.append('token', token);
            
            console.log('Redirecting to:', redirectUrl.toString());
            res.redirect(redirectUrl.toString());
        })(req, res, next);
    } catch (error) {
        console.error('Error in Google callback:', error);
        res.redirect(`${process.env.FRONTEND_URL}/auth?error=server_error`);
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
        const token = generateTokenService({ id: user._id }, process.env.JWT_EXPIRES_IN);
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

// Reset password with current password
module.exports.resetPass = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        // Validate inputs
        if (!email || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'New password and confirm password do not match'
            });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // // Verify current password
        // const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        // if (!isPasswordValid) {
        //     return res.status(401).json({
        //         success: false,
        //         message: 'Current password is incorrect'
        //     });
        // }

        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        user.password = hashedNewPassword;
        await user.save();

        // Send email notification
        const subject = 'Password Changed Successfully';
        const template = `
            <h1>Password Changed</h1>
            <p>Dear ${user.name},</p>
            <p>Your password has been changed successfully.</p>
            <p>If you did not make this change, please contact support immediately.</p>
        `;
        await sendEmail(user.email, subject, template);

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        console.error('Error in resetPass:', error);
        return res.status(500).json({
            success: false,
            message: 'Error changing password: ' + error.message
        });
    }
};

// Verify token endpoint
exports.verifyToken = async (req, res) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(400).json({ message: 'Token is required' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Find user
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Generate new token
        const payload = {
            id: user._id,
            name: user.name,
            email: user.email,
        };
        
        const newToken = generateTokenService(payload, '1d');
        
        // Set new token in cookie
        res.cookie('token', newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            token: newToken
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};
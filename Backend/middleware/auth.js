const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const auth = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = req.cookies.token;
        console.log('Token from cookies:', token);

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Decoded token:', decoded);

        // Find user
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        // Add user to request
        req.user = user;
        next();
    } catch (error) {
        console.error('Error from verifyToken middleware:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = auth; 
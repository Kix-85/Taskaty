const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Get token from cookies
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token provided, authorization denied.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log(decoded)
        req.user = decoded;
        next(); 
    } catch (error) {
        console.log('Error from verifyToken middleware:', error.message);
        return res.status(403).json({ message: 'Invalid token, authorization denied.' });
    }
};

module.exports = verifyToken;

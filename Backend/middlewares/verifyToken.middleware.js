const jwt = require('jsonwebtoken');
const { verifyTokenService } = require('../services/jwtService');

const verifyToken = (req, res, next) => {
    // Get token from cookies or Authorization header
    const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    
    console.log('[Auth Middleware] Request path:', req.path);
    console.log('[Auth Middleware] Token present:', !!token);
    console.log('[Auth Middleware] Token source:', token ? (req.cookies.token ? 'cookie' : 'header') : 'none');

    if (!token) {
        console.error('[Auth Middleware] Authentication failed: No token provided', {
            path: req.path,
            cookies: !!req.cookies.token,
            authHeader: !!req.header('Authorization'),
            timestamp: new Date().toISOString()
        });
        return res.status(401).json({ 
            message: 'No token provided, authorization denied.',
            path: req.path,
            timestamp: new Date().toISOString()
        });
    }

    try {
        const decoded = verifyTokenService(token, process.env.JWT_SECRET);
        console.log('[Auth Middleware] Token decoded successfully:', {
            userId: decoded.id,
            email: decoded.email,
            exp: new Date(decoded.exp * 1000).toISOString(),
            timestamp: new Date().toISOString()
        });
        
        // Set the token in both cookie and header for subsequent requests
        if (!req.cookies.token) {
            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
                maxAge: 24 * 60 * 60 * 1000, // 1 day
                path: '/'
            });
        }
        
        req.user = decoded;
        next();
    } catch (error) {
        console.error('[Auth Middleware] Token verification failed:', {
            error: error.message,
            path: req.path,
            timestamp: new Date().toISOString(),
            stack: error.stack,
            tokenFragment: token ? `${token.slice(0, 10)}...` : 'none'
        });
        return res.status(403).json({ 
            message: 'Invalid token, authorization denied.',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
};

module.exports = verifyToken;

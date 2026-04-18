const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Get token from header
    // Usually sent as: Authorization: Bearer <token>
    const authHeader = req.header('Authorization');

    // 2. Check if no token is present
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    // 3. Verify token
    try {
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET || 'fallback_secret_key'
        );
        
        // Add the decoded user to the request object so subsequent routes can use it
        req.user = decoded;
        next(); // Move on to the actual route handler
    } catch (err) {
        res.status(401).json({ error: 'Token is not valid' });
    }
};

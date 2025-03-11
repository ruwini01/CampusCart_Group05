const jwt = require('jsonwebtoken');
const JWT_SECRET = '#campusCartGroup05*';

const adminAuth = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access Denied, No Token Provided' });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        
        if (verified.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'Access Denied, Admins Only' });
        }

        req.admin = verified;
        next();
    } catch (error) {
        return res.status(400).json({ success: false, message: 'Invalid Token' });
    }
};

module.exports = adminAuth;

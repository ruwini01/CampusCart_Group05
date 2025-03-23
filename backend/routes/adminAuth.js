const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const JWT_SECRET = '#campusCartGroup05*'; // Use the same secret as users

// Hardcoded Admin Credentials
const ADMIN_USERNAME = 'CCADMIN';
const ADMIN_PASSWORD = 'admin123';

// Admin login route
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    // Generate admin token
    const token = jwt.sign(
        { role: 'admin' }, 
        JWT_SECRET, 
        { expiresIn: '2h' } // Token expires in 2 hours
    );

    res.json({ success: true, token });
});

module.exports = router;

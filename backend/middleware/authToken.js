const jwt = require('jsonwebtoken')
const Users = require('../models/Users')

const JWT_SECRET = '#campusCartGroup05*';

const authToken = async (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader?.split(' ')[1]; // Correctly split on space
    if (!token) {
        return res.status(401).json({
            error: 'Access Denied, Token has not been provided'
        });
    }

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        const regno = verified.regno
        const user = await Users.findOne({regno:regno})
        req.user = user;
        next();
    } catch (error) {
        res.status(400).json({ error: 'Invalid Token' });
    }
};

module.exports = authToken;

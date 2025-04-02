const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Import Admin model
const bcrypt = require('bcryptjs'); // Import bcrypt for password comparison

const router = express.Router();
const JWT_SECRET = '#campusCartGroup05*'; // Use the same secret as users

// Hardcoded Admin Credentials
const ADMIN_USERNAME = 'CCADMIN';
const ADMIN_PASSWORD = 'admin123';

// Signup API for Admin
router.post('/signup', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check if the username already exists
        const existingAdmin = await Admin.findOne({ username });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new admin
        const newAdmin = new Admin({
            username,
            password: hashedPassword,
        });

        // Save the admin to the database
        await newAdmin.save();

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Admin login route
// Admin login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the admin exists in the database
        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        // Compare hashed password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        // Generate JWT token for authenticated admin
        const token = jwt.sign({ role: 'admin', id: admin._id }, JWT_SECRET, { expiresIn: '2h' });

        res.json({ success: true, token });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
module.exports = router;

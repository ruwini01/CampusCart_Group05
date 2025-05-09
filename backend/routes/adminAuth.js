const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin'); // Import Admin model
const bcrypt = require('bcryptjs'); // Import bcrypt for password comparison

const router = express.Router();
const JWT_SECRET = '#campusCartGroup05*'; // Use the same secret as users



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

// Change password route
router.put('/changepassword', async (req, res) => {
    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    // Validate input
    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if (newPassword !== confirmNewPassword) {
        return res.status(400).json({ message: 'New passwords do not match' });
    }

    try {
        // Retrieve admin from database
        const admin = await Admin.findById(req.admin.id);
        if (!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, admin.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(newPassword, salt);

        // Save updated admin
        await admin.save();

        res.status(200).json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        console.error('Change Password Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = router;





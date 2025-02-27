const express = require('express');
const router = express.Router();
const { default: mongoose, Model } = require('mongoose');
const Users = require('../models/Users');
const jwt = require('jsonwebtoken');

const JWT_SECRET = '#campusCartGroup05*';

router.post('/login', async (req, res) => {
    try {
        let user = await Users.findOne({ regno: req.body.regno });
        if (user) {
            const password = req.body.password === user.password;
            if (password) {
                const token = jwt.sign({ regno: user.regno }, JWT_SECRET);
                return res.status(200).json({
                    success: true,
                    token,
                    message: `User found with Registration Number ${req.body.regno}`
                });
            } else {
                return res.status(401).json({ success: false, errors: "Incorrect Password" });
            }
        } else {
            return res.status(404).json({ success: false, errors: "User Doesn't Exist" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, errors: "Server error" });
    }
});


router.post('/userdata', async (req, res) => {
    const { token } = req.body;
    try {
        const user = jwt.verify(token, JWT_SECRET);
        const userRegno = user.regno;
        const userData = await Users.findOne({ regno: userRegno });
        return res.status(200).json({
            success: true,
            data: userData
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            errors: "Server error"
        });
    }
});


router.post('/signup/regnocheck', async (req, res) => {
    try {
        let check = await Users.findOne({ regno: req.body.regno });
        if (check) {
            return res.status(400).json({
                success: false,
                errors: "Existing user found with same Registration Number"
            });
        }
        res.status(201).json({
            success: true,
            message: "No user found with same Registration Number"
        });


    } catch (error) {
        console.error("Regno checking error:", error);
        res.status(500).json({
            success: false,
            errors: "Internal server error"
        });
    }

})




router.post('/signup', async (req, res) => {
    try {
        const user = new Users({
            email: req.body.email,
            regno: req.body.regno,
            password: req.body.password,
        });

        //save user in the database
        await user.save();

        // Send success response
        res.status(201).json({
            success: true,
            message: "User created successfully"
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            success: false,
            errors: "Internal server error"
        });
    }
});



router.post('/updateuser', async (req, res) => {
    try {
        const { token, name, telephone, address, profilepic } = req.body;

        // Verify token
        const decodedToken = jwt.verify(token, JWT_SECRET);

        // Find user by regno since that's what we stored in token
        const user = await Users.findOne({ regno: decodedToken.regno });
        console.log(user);


        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Update user document using the found user's _id
        const updatedUser = await Users.findByIdAndUpdate(
            user._id,
            {
                $set: {
                    name: name,
                    telephone: telephone,
                    address: address,
                    profilepic: profilepic
                }
            },
            { new: true }
        );

        res.json({
            success: true,
            message: 'Profile updated successfully',
            data: updatedUser
        });

    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating profile',
            error: error.message
        });
    }
});


router.post('/deleteuser', async (req, res) => {
    try {
        const { token } = req.body;
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const user = await Users.findOne({ regno: decodedToken.regno });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        await Users.findByIdAndDelete(user._id);
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting user',
            error: error.message
        });
    }
});

router.post('/bookmark', async (req, res) => {
    try {
        const { token, postId } = req.body;
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await Users.findOne({ regno: decoded.regno });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if (!user.savedposts.includes(postId)) {
            user.savedposts.push(postId);
            await user.save();
        }

        res.status(200).json({ success: true, savedposts: user.savedposts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});


router.post('/unbookmark', async (req, res) => {
    try {
        const { token, postId } = req.body;
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await Users.findOne({ regno: decoded.regno });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.savedposts = user.savedposts.filter(id => id.toString() !== postId);
        await user.save();

        res.status(200).json({ success: true, savedposts: user.savedposts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
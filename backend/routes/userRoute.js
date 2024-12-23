const express = require('express');
const router = express.Router();
const {default: mongoose, Model} = require('mongoose');
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
            return res.status(404).json({ success: false, errors: "Incorrect Enrollment Number" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, errors: "Server error" });
    }
});


router.post('/userdata', async (req, res) => {
    const {token} = req.body;
    try{
        const user = jwt.verify(token, JWT_SECRET);
        const userRegno = user.regno;
        const userData = await Users.findOne({regno: userRegno});
        return res.status(200).json({
            success: true,
            data: userData
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success: false,
            errors: "Server error"
        });
    }
});


router.post('/signup/regnocheck', async(req, res)=>{
    try {
        let check = await Users.findOne({regno: req.body.regno});
        if(check) {
            return res.status(400).json({
                success: false, 
                errors: "Existing user found with same Registration Number"
            });
        }

        // Send success response
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
        // let check = await Users.findOne({regno: req.body.regno});
        // if(check) {
        //     return res.status(400).json({
        //         success: false, 
        //         errors: "Existing user found with same Registration Number"
        //     });
        // }

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


router.post('signupverify', async (req, res) => {
    
})




module.exports = router;
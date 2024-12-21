const express = require('express');
const router = express.Router();
const {default: mongoose, Model} = require('mongoose');
const Users = require('../models/Users');

router.post('/login', async(req, res)=>{

})


router.post('/signup', async (req, res) => {
    try {
        let check = await Users.findOne({regno: req.body.regno});
        if(check) {
            return res.status(400).json({
                success: false, 
                errors: "Existing user found with same Registration Number"
            });
        }

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
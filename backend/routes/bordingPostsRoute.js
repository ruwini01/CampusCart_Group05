const express = require('express');
const router = express.Router();
const {default: mongoose, Model} = require('mongoose');
const jwt = require('jsonwebtoken');
const BoardingPosts = require('../models/boardingPosts');
const Posts = require('../models/posts');
const Users = require('../models/Users');

const JWT_SECRET = '#campusCartGroup05*';

router.post('/addbordingpost', async(req, res)=>{
    try {
        const { token } = req.body;

        const boardingPostData = {
            location: req.body.location,
            facilities: req.body.facilities,
            capacity: req.body.capacity,
            distance: req.body.distance,
            description: req.body.description,
            rentprice: req.body.rentprice,
            negotiable: req.body.negotiable,
            images: req.body.images,
            contact: req.body.contact,
            hidephoneno: req.body.hidephoneno,
            status: 'available',
        };

        console.log("Received from frontend", boardingPostData);
        console.log("Token", token);

        const newBoardingPost = new BoardingPosts(boardingPostData);
        const savedBoardingPost = await newBoardingPost.save();

        const decodedToken = jwt.verify(token, JWT_SECRET);
        const user = await Users.findOne({ regno: decodedToken.regno });

        const postEntry = {
            userId: user._id,
            postId: savedBoardingPost._id,
            category: 'boarding',
        };

        const newPost = new Posts(postEntry);
        await newPost.save();

        res.status(201).json({
            success: true,
            message: 'Boarding post added successfully!',
            boardingPost: savedBoardingPost,
            postEntry: newPost,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the boarding post.' });
    }
})



router.get('/listbordingposts', async(req, res)=>{

})



router.delete('/removebordingpost', async(req, res)=>{

})


router.put('/editbordingpost', async(req, res)=>{

})


module.exports = router;

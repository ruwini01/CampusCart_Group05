const express = require('express');
const router = express.Router();
const {default: mongoose, Model} = require('mongoose');
const jwt = require('jsonwebtoken');
const BoardingPosts = require('../models/boardingPosts');
const Posts = require('../models/posts');
const Users = require('../models/Users');
const AuthToken = require('../middleware/authToken');

const JWT_SECRET = '#campusCartGroup05*';

router.post('/addbordingpost',AuthToken, async(req, res)=>{
    const user=req.user;

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


        try
        {
            const newBoardingPost = new BoardingPosts(boardingPostData);
            const savedBoardingPost = await newBoardingPost.save();
            try{
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
            }
            catch(error){
                await BoardingPosts.findByIdAndDelete(savedBoardingPost._id);
                res.status(500).json({ error: 'An error occurred while post entry.'+error });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while adding the boarding post.' });
        }
   
    //res.status(200).json({message:req.user})
})



router.get('/listbordingposts', async(req, res)=>{

})



router.delete('/removebordingpost', async(req, res)=>{

})


router.put('/editbordingpost', async(req, res)=>{

})


module.exports = router;

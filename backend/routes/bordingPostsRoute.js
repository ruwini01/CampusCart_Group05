const express = require('express');
const router = express.Router();
const {default: mongoose, Model} = require('mongoose');
const jwt = require('jsonwebtoken');
const BoardingPosts = require('../models/boardingPosts');
const Posts = require('../models/posts');
const Users = require('../models/Users');
const AuthToken = require('../middleware/authToken');
const adminAuth = require('../middleware/adminAuth');

const JWT_SECRET = '#campusCartGroup05*';

router.post('/addbordingpost',AuthToken, async(req, res)=>{
    const user=req.user;

        const boardingPostData = {
            category: req.body.category,
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
    try {
        const searchQuery = req.query.search || "";
        const boardingPosts = await BoardingPosts.find({
            category: { $regex: searchQuery, $options: "i" }
        });
        res.status(200).json({ success: true, data: boardingPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while retrieving boarding posts.' });
    }

})



router.delete('/removeboardingpost/:postId',AuthToken, async (req, res) => {
    try {
        const { postId } = req.params;

        const deletedPost = await BoardingPosts.findByIdAndDelete({_id:postId});
        if (!deletedPost) {
            return res.status(400).json({ success: false, message: 'Boarding post not found.' });
        }

        await Posts.findOneAndDelete({ postId, category: 'boarding' });

        res.status(200).json({ success: true, message: 'Boarding post removed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while removing the boarding post.'+error });
    }
});



router.delete('/removeboardingpost/:postId', adminAuth, async (req, res) => {
    try {
        const { postId } = req.params;

        const deletedPost = await BoardingPosts.findByIdAndDelete({ _id: postId });
        if (!deletedPost) {
            return res.status(400).json({ success: false, message: 'Boarding post not found.' });
        }

        await Posts.findOneAndDelete({ postId, category: 'boarding' });

        res.status(200).json({ success: true, message: 'Boarding post removed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'An error occurred while removing the post.' });
    }
});


router.put('/editbordingpost/:postId', AuthToken, async (req, res) => {
    const user = req.user; 
    const { postId } = req.params;
    const updates = req.body; 

    if (!postId) {
        return res.status(400).json({ error: 'Please enter a valid postId' });
    }

    try {
        const boardingPost = await BoardingPosts.findByIdAndUpdate(
            postId, 
            { $set: updates }, 
            { new: true, runValidators: true }
        );

        if (!boardingPost) {
            return res.status(404).json({ error: 'Boarding Post not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Successfully edited boarding post',
            boardingPost,
        });
    } catch (error) {
        console.error('Error while updating boarding post:', error);
        return res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});



module.exports = router;

const express = require('express');
const router = express.Router();
const {default: mongoose, Model} = require('mongoose');
const AuthToken = require('../middleware/authToken');
const Posts = require('../models/posts');
const SellPosts = require('../models/SellPosts');
const LostPosts = require('../models/lostPosts');
const FoundPosts = require('../models/foundPosts');
const BoardingPosts = require('../models/boardingPosts');
const Users = require('../models/Users');

router.get('/myposts', AuthToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const myPosts = await Posts.find({ userId: userId });

        res.status(200).json({
            success: true,
            posts: myPosts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching your posts.' });
    }
});


router.get('/userbypost/:postId', async (req, res) => {
    try {
        const { postId } = req.params;

        // First, find the post reference in the Posts collection
        const postReference = await Posts.findOne({ postId: postId }).populate('userId');

        if (!postReference || !postReference.userId) {
            return res.status(404).json({ message: 'Post or User not found' });
        }

        const user = postReference.userId;
        const userData = {
            name: user.name,
            telephone: user.telephone,
            profilepic: user.profilepic,
            regno: user.regno,
            email: user.email,
            address: user.address
        };

        res.json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});





router.get('/getAllPosts', AuthToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const allPosts = await Posts.find({ userId: userId });

        let detailedPosts = [];

        for (const post of allPosts) {
            let postDetails;

            switch (post.category) {
                case 'sell':
                    postDetails = await SellPosts.findById(post.postId);
                    break;
                case 'lost':
                    postDetails = await LostPosts.findById(post.postId);
                    break;
                case 'found':
                    postDetails = await FoundPosts.findById(post.postId);
                    break;
                case 'boarding':
                    postDetails = await BoardingPosts.findById(post.postId);
                    break;
                default:
                    continue;
            }

            if (postDetails) {
                
                detailedPosts.push({
                    _id: postDetails._id,
                    date: post.date,
                    ...postDetails.toObject(),
                });
            }
        }

        res.status(200).json({
            success: true,
            posts: detailedPosts
            
        });

    } catch (error) {
        console.error('Error fetching user posts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching user posts',
            error: error.message
        });
    }
});





module.exports = router;
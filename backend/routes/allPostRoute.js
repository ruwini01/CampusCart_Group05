const express = require('express');
const router = express.Router();
const {default: mongoose, Model} = require('mongoose');
const Posts = require('../models/posts');
const SellPosts = require('../models/SellPosts');
const LostPosts = require('../models/lostPosts');
const BoardingPosts = require('../models/boardingPosts');
const FoundPosts = require('../models/foundPosts');
const jwt = require('jsonwebtoken');

const JWT_SECRET = '#campusCartGroup05*';

router.get('/listposts', async(req, res)=>{
    try {
        const allPosts = await Posts.find();
        res.status(200).json({ success: true, allPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching all posts.' });
    }
});


router.get('/listposts/:id', async(req, res)=>{
    try {
        const allPosts = await Posts.find({postId: req.params.id});
        res.status(200).json({ success: true, allPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching all posts.' });
    }
})


router.get('/getAllPosts', AuthToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const allPosts = await Posts.find({ userId: userId });

        let detailedPosts = [];

        for (const post of allPosts) {
            let postDetails;
            let categoryName = '';

            switch (post.category) {
                case 'sell':
                    postDetails = await SellPosts.findById(post.postId);
                    categoryName = 'sell';
                    break;
                case 'lost':
                    postDetails = await LostPosts.findById(post.postId);
                    categoryName = 'lost';
                    break;
                case 'found':
                    postDetails = await FoundPosts.findById(post.postId);
                    categoryName = 'found';
                    break;
                case 'boarding':
                    postDetails = await BoardingPosts.findById(post.postId);
                    categoryName = 'boarding';
                    break;
                default:
                    continue;
            }

            if (postDetails) {
                
                detailedPosts.push({
                    _id: postDetails._id,
                    date: post.date,
                    cat: categoryName,
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



router.get('/getAllPosts/:id', async (req, res) => {
    try {
        const allPosts = await Posts.find({postId: req.params.id})
            .populate('postId')
            .sort({ date: -1 });

        let postDetails;

        for (const post of allPosts) {
            
            
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
        }

        res.status(200).json({
            success: true,
            post: postDetails
        });



    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching posts',
            error: error.message
        });
    }
});



router.delete('/removesellpost', async(req, res)=>{

})


router.put('/editsellpost', async(req, res)=>{

})


module.exports = router;
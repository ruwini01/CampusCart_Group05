const express = require('express');
const router = express.Router();
const {default: mongoose, Model} = require('mongoose');
const SellPosts = require('../models/SellPosts');
const Posts = require('../models/posts');
const Users = require('../models/Users');
const jwt = require('jsonwebtoken');
const AuthToken = require('../middleware/authToken');

const JWT_SECRET = '#campusCartGroup05*';

router.post('/addsellpost', async(req, res)=>{
    try {
        const {token} = req.body;

        const sellPostData = {
            category: req.body.category,
            location: req.body.location,
            itemname: req.body.itemname,
            condition: req.body.condition,
            brand: req.body.brand,
            description: req.body.description,
            price: req.body.price,
            originalprice: req.body.originalprice,
            isnagotiable: req.body.isnagotiable,
            images: req.body.images,
            contact: req.body.contact,
            hidephoneno: req.body.hidephoneno,
        };
        console.log("Recieved from frontend" , sellPostData);
        console.log("Token", token);
        
        

        const newSellPost = new SellPosts(sellPostData);
        const savedSellPost = await newSellPost.save();

        const decodedToken = jwt.verify(token, JWT_SECRET);
        const user = await Users.findOne({ regno: decodedToken.regno });

        const postEntry = {
            userId: user._id,
            postId: savedSellPost._id,
            category: 'sell',
        };

        const newPost = new Posts(postEntry);
        await newPost.save();

        res.status(201).json({
            success:true,
            message: 'Sell post added successfully!',
            sellPost: savedSellPost,
            postEntry: newPost,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the sell post.' });
    }
});




router.get('/listsellposts', async(req, res)=>{
    try {
        const sellPosts = await SellPosts.find();
        res.status(200).json({ success: true, sellPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching sell posts.' });
    }

})


router.get('/listsellposts/:id', async(req, res)=>{
    try {
        const sellPost = await SellPosts.findById(req.params.id);
        if (!sellPost) {
            return res.status(404).json({ success: false, message: 'Sell post not found.' });
        }
        res.status(200).json({ success: true, post: sellPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the sell post.' });
    }

})


router.delete('/removesellpost/:postId',AuthToken, async (req, res) => {
    try {
        const { postId } = req.params;

        const deletedPost = await SellPosts.findByIdAndDelete({_id:postId});
        if (!deletedPost) {
            return res.status(400).json({ success: false, message: 'Sell post not found.' });
        }

        await Posts.findOneAndDelete({ postId, category: 'found' });

        res.status(200).json({ success: true, message: 'Sell post removed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while removing the sell post.'+error });
    }
});

router.put('/editsellpost/:postId', AuthToken, async (req, res) => {
    const user = req.user; 
    const { postId } = req.params;
    const updates = req.body; 

    if (!postId) {
        return res.status(400).json({ error: 'Please enter a valid postId' });
    }

    try {
        const sellPost = await SellPosts.findByIdAndUpdate(
            postId, 
            { $set: updates }, 
            { new: true, runValidators: true }
        );

        if (!sellPost) {
            return res.status(404).json({ error: 'Sell Post not found' });
        }

        return res.status(200).json({
            success:true,
            message: 'Successfully edited sell post',
            sellPost,
        });
    } catch (error) {
        console.error('Error while updating sell post:', error);
        return res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});


module.exports = router;
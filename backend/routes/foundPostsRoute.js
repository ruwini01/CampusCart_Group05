const express = require('express');
const router = express.Router();
const {default: mongoose, Model} = require('mongoose');
const FoundPosts = require('../models/foundPosts');
const AuthToken = require('../middleware/authToken');
const Posts = require('../models/posts');

router.post('/addfoundpost',AuthToken, async(req, res)=>{
    const user=req.user;

        const foundPostData = {
            itemname: req.body.itemname,
            founddate: req.body.founddate,
            location: req.body.location,
            description: req.body.description,
            images: req.body.images,
            contact: req.body.contact,
            hidephoneno: req.body.hidephoneno,
            status: 'searching for owner',
        };

        try
        {
            const newfoundPost = new FoundPosts(foundPostData);
            const savedFoundPost = await newfoundPost.save();
            try{
                const postEntry = {
                    userId: user._id,
                    postId: savedFoundPost._id,
                    category: 'found',
                };
        
                const newPost = new Posts(postEntry);
                await newPost.save();

                res.status(201).json({
                    success: true,
                    message: 'found post added successfully!',
                    foundPost: savedFoundPost,
                    postEntry: newPost,
                });
            }
            catch(error){
                await FoundPosts.findByIdAndDelete(savedFoundPost._id);
                res.status(500).json({ error: 'An error occurred while post entry.'+error });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while adding the found post.' });
        }
})



router.get('/listfoundposts', async(req, res)=>{
    try {
        const foundPosts = await FoundPosts.find();
        res.status(200).json({ success: true, foundPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching found posts.' });
    }

})



router.delete('/removefoundpost', async(req, res)=>{
    try {
        const { postId } = req.params;

        const deletedPost = await FoundPosts.findByIdAndDelete({_id:postId});
        if (!deletedPost) {
            return res.status(400).json({ success: false, message: 'Found post not found.' });
        }

        await Posts.findOneAndDelete({ postId, category: 'found' });

        res.status(200).json({ success: true, message: 'Found post removed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while removing the found post.'+error });
    }

});


router.put('/editfoundpost', async(req, res)=>{
    const user = req.user; 
    const { postId } = req.params;
    const updates = req.body;
    

    if (!postId) {
        return res.status(400).json({ error: 'Please enter a valid postId' });
    }

    try {
        const foundPost = await FoundPosts.findByIdAndUpdate(
            postId, 
            { $set: updates }, 
            { new: true, runValidators: true }
        );

        if (!foundPost) {
            return res.status(404).json({ error: 'Found Post not found' });
        }

        console.log(foundPost);
        
        return res.status(200).json({
            success: true,
            message: 'Successfully edited found post',
            foundPost,
        });
    } catch (error) {
        console.error('Error while updating found post:', error);
        return res.status(500).json({ error: 'Internal server error: ' + error.message });
    }

});


module.exports = router;
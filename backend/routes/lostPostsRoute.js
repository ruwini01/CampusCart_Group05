const express = require('express');
const router = express.Router();
const {default: mongoose, Model} = require('mongoose');
const LostPosts = require('../models/lostPosts');
const AuthToken = require('../middleware/authToken');
const Posts = require('../models/posts');

router.post('/addlostpost',AuthToken, async(req, res)=>{
    const user=req.user;

        const lostPostData = {
            itemname: req.body.itemname,
            lostdate: req.body.lostdate,
            location: req.body.location,
            description: req.body.description,
            images: req.body.images,
            contact: req.body.contact,
            hidephoneno: req.body.hidephoneno,
            status: 'searching',
        };

        try
        {
            const newlostPost = new LostPosts(lostPostData);
            const savedLostPost = await newlostPost.save();
            try{
                const postEntry = {
                    userId: user._id,
                    postId: savedLostPost._id,
                    category: 'lost',
                };
        
                const newPost = new Posts(postEntry);
                await newPost.save();

                res.status(201).json({
                    success: true,
                    message: 'lost post added successfully!',
                    lostPost: savedLostPost,
                    postEntry: newPost,
                });
            }
            catch(error){
                await LostPosts.findByIdAndDelete(savedLostPost._id);
                res.status(500).json({ error: 'An error occurred while post entry.'+error });
            }
        }
        
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while adding the lost post.' });
        }
})




router.get('/listlostposts', async(req, res)=>{
    try {
        const lostPosts = await LostPosts.find();
        res.status(200).json({ success: true, lostPosts });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching lost posts.' });

    }

})



router.delete('/removelostpost', async(req, res)=>{
    try {
        const { postId } = req.params;

        const deletedPost = await LostPosts.findByIdAndDelete({_id:postId});
        if (!deletedPost) {
            return res.status(400).json({ success: false, message: 'Lost post not found.' });
        }

        await Posts.findOneAndDelete({ postId, category: 'found' });

        res.status(200).json({ success: true, message: 'Lost post removed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while removing the lost post.'+error });
    }

});


router.put('/editlostpost', async(req, res)=>{
    const user = req.user; 
    const { postId } = req.params;
    const updates = req.body; 

    if (!postId) {
        return res.status(400).json({ error: 'Please enter a valid postId' });
    }

    try {
        const lostPost = await LostPosts.findByIdAndUpdate(
            postId, 
            { $set: updates }, 
            { new: true, runValidators: true }
        );

        if (!lostPost) {
            return res.status(404).json({ error: 'Lost Post not found' });
        }

        return res.status(200).json({
            success:true,
            message: 'Successfully edited lost post',
            lostPost,
        });
    } catch (error) {
        console.error('Error while updating lost post:', error);
        return res.status(500).json({ error: 'Internal server error: ' + error.message });
    }

});


module.exports = router;
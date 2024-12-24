
const express = require('express');
const router = express.Router();
const SellPosts = require('../models/SellPosts');


router.post('/addsellpost', async (req, res) => {
    try {
        const newPost = new SellPosts(req.body);
        await newPost.save();
        res.status(201).json({ message: "Sell post added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to add post" });
    }
});




router.get('/list', async (req, res) => {
    try {
        const posts = await SellPosts.find();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch sell posts', error });
    }
});



router.delete('/remove/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const deletedPost = await SellPosts.findByIdAndDelete(id);
        if (!deletedPost) {
            return res.status(404).json({ message: 'Sell post not found' });
        }
        res.status(200).json({ message: 'Sell post removed successfully', deletedPost });
    } catch (error) {
        res.status(500).json({ message: 'Failed to remove post', error });
    }
});


router.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const updatedPost = await SellPosts.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!updatedPost) {
            return res.status(404).json({ message: 'Sell post not found' });
        }
        res.status(200).json({ message: 'Sell post updated successfully', updatedPost });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update sell post', error });
    }
});

module.exports = router;

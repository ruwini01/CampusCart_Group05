const express = require('express');
const router = express.Router();
const { default: mongoose, Model } = require('mongoose');
const AuthToken = require('../middleware/authToken');
const Posts = require('../models/posts');
const SellPosts = require('../models/SellPosts');
const LostPosts = require('../models/lostPosts');
const FoundPosts = require('../models/foundPosts');
const BoardingPosts = require('../models/boardingPosts');
const User = require('../models/Users');

router.get('/bookmarkedList', AuthToken, async (req, res) => {
    try {
        const userId = req.user._id;

        // Fetch the user and populate the savedposts
        const user = await User.findById(userId);

        if (!user || !user.savedposts || user.savedposts.length === 0) {
            return res.status(404).json({ message: 'No bookmarked posts found' });
        }

        // Add debug logging
        console.log("User's saved posts:", user.savedposts);

        // Direct query to each collection instead of going through Posts
        let detailedBookmarkedPosts = [];

        for (const postId of user.savedposts) {
            // Try finding the post in each collection
            let postDetails = null;
            let categoryName = '';

            // Check each collection
            const sellPost = await SellPosts.findById(postId);
            const lostPost = await LostPosts.findById(postId);
            const foundPost = await FoundPosts.findById(postId);
            const boardingPost = await BoardingPosts.findById(postId);

            if (sellPost) {
                postDetails = sellPost;
                categoryName = 'sell';
            } else if (lostPost) {
                postDetails = lostPost;
                categoryName = 'lost';
            } else if (foundPost) {
                postDetails = foundPost;
                categoryName = 'found';
            } else if (boardingPost) {
                postDetails = boardingPost;
                categoryName = 'boarding';
            }

            if (postDetails) {
                // Add the post to our results with its category
                const formattedPost = {
                    _id: postDetails._id,
                    date: postDetails.date || new Date(),
                    cat: categoryName,
                    ...postDetails.toObject()
                };
                detailedBookmarkedPosts.push(formattedPost);
            }

        }

        if (detailedBookmarkedPosts.length === 0) {
            return res.status(404).json({ message: 'No posts found for the saved post IDs' });
        }


        return res.status(200).json({
            success: true,
            bookmarkedPosts: detailedBookmarkedPosts,
        });

    } catch (error) {
        console.error('Error fetching bookmarked posts:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.delete('/removebookmark/:postId', AuthToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const postId = req.params.postId;

        // Find the user and update the savedposts array
        const user = await User.findByIdAndUpdate(
            userId,
            { $pull: { savedposts: postId } },
            { new: true } // Return the updated document
        );

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Post removed from bookmarks',
            updatedBookmarks: user.savedposts
        });

    } catch (error) {
        console.error('Error removing bookmarked post:', error);
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
});



module.exports = router;
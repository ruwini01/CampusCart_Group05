const express = require('express');
const router = express.Router();
const { default: mongoose, Model } = require('mongoose');
const LostPosts = require('../models/lostPosts');
const AuthToken = require('../middleware/authToken');
const Posts = require('../models/posts');
const adminAuth = require('../middleware/adminAuth');
const FoundPosts = require('../models/foundPosts');
const User = require('../models/Users');


router.post('/addlostpost', AuthToken, async (req, res) => {
    const user = req.user;

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

    try {
        const newlostPost = new LostPosts(lostPostData);
        const savedLostPost = await newlostPost.save();
        try {
            const postEntry = {
                userId: user._id,
                postId: savedLostPost._id,
                category: 'lost',
            };

            const newPost = new Posts(postEntry);
            await newPost.save();

            // Check for matching found items after successful save
            await checkForMatchingFoundItems(savedLostPost, user._id);

            res.status(201).json({
                success: true,
                message: 'lost post added successfully!',
                lostPost: savedLostPost,
                postEntry: newPost,
            });
        }
        catch (error) {
            await LostPosts.findByIdAndDelete(savedLostPost._id);
            res.status(500).json({ error: 'An error occurred while post entry.' + error });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the lost post.' });
    }
});



// Function to check for matching found items and send notifications
async function checkForMatchingFoundItems(lostPost, currentUserId) {
    try {
        // Find found items with similar names
        const matchingFoundItems = await FoundPosts.find({
            itemname: { $regex: new RegExp(lostPost.itemname, 'i') }, // Case-insensitive match
            status: 'searching for owner' // Only check active found items
        });

        if (matchingFoundItems.length === 0) return;

        // Use Posts collection to find user IDs for the matching found posts
        const postEntries = await Posts.find({
            postId: { $in: matchingFoundItems.map(item => item._id) },
            category: 'found'
        });

        // Get unique user IDs excluding the current user
        const userIds = [...new Set(
            postEntries.map(entry => entry.userId.toString())
        )].filter(id => id !== currentUserId.toString());

        if (userIds.length === 0) return;

        // Find users with their push tokens
        const users = await User.find({
            _id: { $in: userIds }
        });

        for (const user of users) {
            // Add notification to user's notifications array
            await User.findByIdAndUpdate(user._id, {
                $push: {
                    notifications: {
                        title: 'Matching Item Found!',
                        body: `Someone just reported a lost ${lostPost.itemname} that might match your found item.`,
                        date: new Date(),
                        postId: lostPost._id
                    }
                }
            });

        }
    } catch (error) {
        console.error('Error checking for matching items:', error);
    }
}



router.get('/listlostposts', async (req, res) => {
    try {
        const searchQuery = req.query.search || "";
        const lostPosts = await LostPosts.find({
            itemname: { $regex: searchQuery, $options: "i" }
        });

        res.status(200).json({ success: true, lostPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching lost posts.' });
    }
});


router.get('/listlostposts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const lostPost = await LostPosts.findById({ _id: id });

        if (!lostPost) {
            return res.status(404).json({ success: false, error: 'Lost post not found' });
        }

        res.status(200).json({ success: true, lostPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
});


router.delete('/removelostpost/:postId', AuthToken, async (req, res) => {
    try {
        const { postId } = req.params;

        const deletedPost = await LostPosts.findByIdAndDelete({ _id: postId });
        if (!deletedPost) {
            return res.status(400).json({ success: false, message: 'Lost post not found.' });
        }

        await Posts.findOneAndDelete({ postId, category: 'found' });

        res.status(200).json({ success: true, message: 'Lost post removed successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while removing the lost post.' + error });
    }
});



router.delete('/removelostpost/:postId',adminAuth, async (req, res) => {
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


router.put('/editlostpost/:postId', AuthToken, async (req, res) => {
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
            success: true,
            message: 'Successfully edited lost post',
            lostPost,
        });
    } catch (error) {
        console.error('Error while updating lost post:', error);
        return res.status(500).json({ error: 'Internal server error: ' + error.message });
    }
});



module.exports = router;
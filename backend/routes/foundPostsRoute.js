const express = require('express');
const router = express.Router();
const {default: mongoose, Model} = require('mongoose');
const FoundPosts = require('../models/foundPosts');
const AuthToken = require('../middleware/authToken');
const Posts = require('../models/posts');
const LostPosts = require('../models/lostPosts');
const Users = require('../models/Users');

const adminAuth = require('../middleware/adminAuth');

router.post('/addfoundpost', AuthToken, async(req, res) => {
    const user = req.user;

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

    try {
        const newfoundPost = new FoundPosts(foundPostData);
        const savedFoundPost = await newfoundPost.save();
        try {
            const postEntry = {
                userId: user._id,
                postId: savedFoundPost._id,
                category: 'found',
            };
    
            const newPost = new Posts(postEntry);
            await newPost.save();

            // Check for matching lost items after successful save
            await checkForMatchingLostItems(savedFoundPost, user._id);

            res.status(201).json({
                success: true,
                message: 'found post added successfully!',
                foundPost: savedFoundPost,
                postEntry: newPost,
            });
        }
        catch(error) {
            await FoundPosts.findByIdAndDelete(savedFoundPost._id);
            res.status(500).json({ error: 'An error occurred while post entry.'+error });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the found post.' });
    }
});

// Function to check for matching lost items and send notifications
async function checkForMatchingLostItems(foundPost, currentUserId) {
    try {
        // Find lost items with similar names
        const matchingLostItems = await LostPosts.find({
            itemname: { $regex: new RegExp(foundPost.itemname, 'i') }, // Case-insensitive match
            status: 'searching' // Only check active lost items
        });
        
        if (matchingLostItems.length === 0) return;
        
        // Use Posts collection to find user IDs for the matching lost posts
        const postEntries = await Posts.find({
            postId: { $in: matchingLostItems.map(item => item._id) },
            category: 'lost'
        });
        
        // Get unique user IDs excluding the current user
        const userIds = [...new Set(
            postEntries.map(entry => entry.userId.toString())
        )].filter(id => id !== currentUserId.toString());
        
        if (userIds.length === 0) return;
        
        // Find users with their push tokens
        const users = await Users.find({
            _id: { $in: userIds }
        });
        
        for (const user of users) {
            // Add notification to user's notifications array
            await Users.findByIdAndUpdate(user._id, {
                $push: {
                    notifications: {
                        title: 'Matching Item Found!',
                        body: `Someone just found a ${foundPost.itemname} that might match your lost item.`,
                        date: new Date(),
                        postId: foundPost._id
                    }
                }
            });
            
        }
    } catch (error) {
        console.error('Error checking for matching items:', error);
    }
}



router.get('/listfoundposts', async(req, res)=>{
    try {
        const searchQuery = req.query.search || "";
        const foundPosts = await FoundPosts.find({
            itemname: { $regex: searchQuery, $options: "i" } // Case-insensitive search
        });
        res.status(200).json({ success: true, foundPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching found posts.' });
    }

})


router.get('/listfoundposts/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const foundPost = await FoundPosts.findById({ _id: id });

        if (!foundPost) {
            return res.status(404).json({ success: false, error: 'Found post not found' });
        }

        res.status(200).json({ success: true, foundPost });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'An error occurred' });
    }
});


router.delete('/removefoundpost/:postId',AuthToken, async (req, res) => {
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



router.delete('/removefoundpost/:postId',adminAuth, async (req, res) => {
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



router.delete('/removefoundpost/:postId',adminAuth, async (req, res) => {
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


router.put('/editfoundpost/:postId', AuthToken, async (req, res) => {
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
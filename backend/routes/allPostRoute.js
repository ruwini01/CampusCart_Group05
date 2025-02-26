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
        const sellPosts = await Posts.find();
        res.status(200).json({ success: true, sellPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching sell posts.' });
    }

});


router.get('/getAllPosts', async (req, res) => {//
    try {
        const allPosts = await Posts.find();
        let recentPosts;
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
                // Combine post details with user info and category name
                const formattedPost = {
                    _id: postDetails._id,
                    date: post.date,
                    cat: categoryName, // Add category name
                    ...postDetails.toObject(), // Spread all other details from specific post
                };
                detailedPosts.push(formattedPost);
            }
        }

        recentPosts = detailedPosts.slice(-6).reverse();

        res.status(200).json({
            success: true,
            posts: detailedPosts,
            recentPosts: recentPosts
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

//--find similar posts 
router.get('/getAllPosts/:id', async (req, res) => {
    try {
        const currentPost = await Posts.findOne({ postId: req.params.id });
        if (!currentPost) {
            return res.status(404).json({
                success: false,
                message: 'Post not found'
            });
        }

        let postDetails;
        let similarItems = [];

        // Get current post details and find similar items
        switch (currentPost.category) {
            case 'sell':
                postDetails = await SellPosts.findById(currentPost.postId);
                similarItems = await findSimilarSellPosts(currentPost, postDetails);
                break;

            case 'boarding':
                postDetails = await BoardingPosts.findById(currentPost.postId);
                similarItems = await findSimilarBoardingPosts(currentPost, postDetails);
                break;

            case 'lost':
            case 'found':
                const postCollection = currentPost.category === 'lost' ? LostPosts : FoundPosts;
                postDetails = await postCollection.findById(currentPost.postId);
                similarItems = await findSimilarLostOrFoundPosts(currentPost, postDetails);
                break;

            default:
                return res.status(400).json({
                    success: false,
                    message: 'Invalid category'
                });
        }

        // If less than 6 similar items found, append the latest posts (from all categories if necessary)
        if (similarItems.length < 6) {
            const remainingSlots = 6 - similarItems.length;

            const latestPosts = await Posts.aggregate([
                {
                    $match: {
                        postId: {
                            $ne: new mongoose.Types.ObjectId(currentPost.postId), // Exclude the current post
                            $nin: similarItems.map(item => item.postId) // Exclude already included items
                        }
                    }
                },
                {
                    $lookup: {
                        from: `${currentPost.category}posts`, // Dynamically reference the appropriate collection
                        localField: 'postId',
                        foreignField: '_id',
                        as: 'details'
                    }
                },
                { $unwind: '$details' },
                { $sort: { date: -1 } }, // Sort by the latest date
                { $limit: remainingSlots } // Limit to fill remaining slots
            ]);

            // Append the latest posts to the similarItems array
            similarItems = [...similarItems, ...latestPosts];
        }

        // Ensure the total number of items is limited to 6
        similarItems = similarItems.slice(0, 6);

        res.status(200).json({
            success: true,
            post: postDetails,
            similarItems: similarItems.map(item => ({
                _id: item.postId,
                date: item.date,
                category: item.category,
                ...item.details
            }))
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


// Helper function to find similar sell posts
async function findSimilarSellPosts(currentPost, postDetails) {
    let similarItems = await Posts.aggregate([
        {
            $match: {
                category: 'sell',
                postId: { $ne: new mongoose.Types.ObjectId(currentPost.postId) }
            }
        },
        {
            $lookup: {
                from: 'sellposts',
                localField: 'postId',
                foreignField: '_id',
                as: 'details'
            }
        },
        { $unwind: '$details' },
        {
            $match: {
                'details.itemname': { $regex: new RegExp(postDetails.itemname, 'i') }
            }
        },
        { $limit: 6 }
    ]);

    if (similarItems.length < 6) {
        const priceRange = {
            min: postDetails.price * 0.8,
            max: postDetails.price * 1.2
        };

        const remainingItems = await Posts.aggregate([
            {
                $match: {
                    category: 'sell',
                    postId: {
                        $ne: new mongoose.Types.ObjectId(currentPost.postId),
                        $nin: similarItems.map(item => item.postId)
                    }
                }
            },
            {
                $lookup: {
                    from: 'sellposts',
                    localField: 'postId',
                    foreignField: '_id',
                    as: 'details'
                }
            },
            { $unwind: '$details' },
            {
                $match: {
                    'details.price': {
                        $gte: priceRange.min,
                        $lte: priceRange.max
                    }
                }
            },
            { $limit: 6 - similarItems.length }
        ]);

        similarItems = [...similarItems, ...remainingItems];
    }

    return similarItems;
}

// Helper function to find similar boarding posts
async function findSimilarBoardingPosts(currentPost, postDetails) {
    let similarItems = await Posts.aggregate([
        {
            $match: {
                category: 'boarding',
                postId: { $ne: new mongoose.Types.ObjectId(currentPost.postId) }
            }
        },
        {
            $lookup: {
                from: 'boardingposts',
                localField: 'postId',
                foreignField: '_id',
                as: 'details'
            }
        },
        { $unwind: '$details' },
        {
            $match: {
                'details.boardingCategory': postDetails.boardingCategory
            }
        },
        { $limit: 6 }
    ]);

    if (similarItems.length < 6) {
        const rentRange = {
            min: postDetails.rentprice * 0.8,
            max: postDetails.rentprice * 1.2
        };

        const remainingItems = await Posts.aggregate([
            {
                $match: {
                    category: 'boarding',
                    postId: {
                        $ne: new mongoose.Types.ObjectId(currentPost.postId),
                        $nin: similarItems.map(item => item.postId)
                    }
                }
            },
            {
                $lookup: {
                    from: 'boardingposts',
                    localField: 'postId',
                    foreignField: '_id',
                    as: 'details'
                }
            },
            { $unwind: '$details' },
            {
                $match: {
                    'details.rentprice': {
                        $gte: rentRange.min,
                        $lte: rentRange.max
                    }
                }
            },
            { $limit: 6 - similarItems.length }
        ]);

        similarItems = [...similarItems, ...remainingItems];
    }

    return similarItems;
}

// Helper function to find similar lost or found posts
async function findSimilarLostOrFoundPosts(currentPost, postDetails) {
    const commonColors = ['red', 'blue', 'green', 'yellow', 'black', 'white', 'brown', 'purple', 'pink', 'orange', 'grey', 'gray'];
    const descriptionWords = postDetails.description.toLowerCase().split(/\s+/);
    const colorInDescription = commonColors.find(color => descriptionWords.includes(color));

    let similarItems = await Posts.aggregate([
        {
            $match: {
                category: currentPost.category,
                postId: { $ne: new mongoose.Types.ObjectId(currentPost.postId) }
            }
        },
        {
            $lookup: {
                from: `${currentPost.category}posts`,
                localField: 'postId',
                foreignField: '_id',
                as: 'details'
            }
        },
        { $unwind: '$details' },
        {
            $match: {
                'details.itemname': { $regex: new RegExp(postDetails.itemname, 'i') }
            }
        },
        { $limit: 6 }
    ]);

    if (similarItems.length < 6 && colorInDescription) {
        const remainingItems = await Posts.aggregate([
            {
                $match: {
                    category: currentPost.category,
                    postId: {
                        $ne: new mongoose.Types.ObjectId(currentPost.postId),
                        $nin: similarItems.map(item => item.postId)
                    }
                }
            },
            {
                $lookup: {
                    from: `${currentPost.category}posts`,
                    localField: 'postId',
                    foreignField: '_id',
                    as: 'details'
                }
            },
            { $unwind: '$details' },
            {
                $match: {
                    'details.description': { $regex: new RegExp(colorInDescription, 'i') }
                }
            },
            { $limit: 6 - similarItems.length }
        ]);

        similarItems = [...similarItems, ...remainingItems];
    }

    return similarItems;
}

//--


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
const express = require('express');
const router = express.Router();
const {default: mongoose, Model} = require('mongoose');
const Posts = require('../models/posts');
const SellPosts = require('../models/SellPosts');
const LostPosts = require('../models/lostPosts');
const BoardingPosts = require('../models/boardingPosts');
const FoundPosts = require('../models/foundPosts');
const jwt = require('jsonwebtoken');
const axios = require("axios");

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


router.get('/getAllPosts', async (req, res) => {
    try {
        const searchQuery = req.query.search || ""; // Get search query from request
        const allPosts = await Posts.find();
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
                const formattedPost = {
                    _id: postDetails._id,
                    date: post.date,
                    cat: categoryName,
                    ...postDetails.toObject(),
                };
                detailedPosts.push(formattedPost);
            }
        }

        // Filter all posts based on searchQuery (match itemname or category)
        let filteredPosts = detailedPosts;
        if (searchQuery) {
            filteredPosts = detailedPosts.filter(post =>
                (post.itemname && post.itemname.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (post.category && post.category.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Limit to only 6 results
        const recentPosts = filteredPosts.slice(-6).reverse();

        // Return response with filtered results or message if no match
        if (recentPosts.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No matching items found in recent posts",
                posts: detailedPosts,
                recentPosts: []
            });
        }

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



router.get('/recentPosts', async (req, res) => {
    try {
        const searchQuery = req.query.search?.trim() || ""; 
        const limit = 6; 

        let detailedPosts = [];

        if (searchQuery) {
            // Fetch posts directly from each collection based on search query
            const categoryPromises = [
                SellPosts.find({ itemname: { $regex: searchQuery, $options: "i" } }).lean(),
                LostPosts.find({ itemname: { $regex: searchQuery, $options: "i" } }).lean(),
                FoundPosts.find({ itemname: { $regex: searchQuery, $options: "i" } }).lean(),
                BoardingPosts.find({ category: { $regex: searchQuery, $options: "i" } }).lean(),
            ];

            // Resolve all queries in parallel
            const categoryResults = await Promise.all(categoryPromises);

            // Combine all results and sort by date
            detailedPosts = categoryResults.flat().sort((a, b) => new Date(b.date) - new Date(a.date));

        } else {
            // Fetch recent posts (last 6) from `Posts` collection
            const recentPosts = await Posts.find().sort({ date: -1 }).limit(limit).lean();

            // If no posts found
            if (!recentPosts.length) {
                return res.status(200).json({
                    success: true,
                    message: "No recent posts found",
                    recentPosts: []
                });
            }

            // Map post IDs by category for efficient querying
            const postsByCategory = { sell: [], lost: [], found: [], boarding: [] };
            recentPosts.forEach(post => {
                if (postsByCategory[post.category]) {
                    postsByCategory[post.category].push(post.postId);
                }
            });

            // Fetch details for each category in parallel
            const categoryPromises = [
                postsByCategory.sell.length ? SellPosts.find({ _id: { $in: postsByCategory.sell } }).lean() : [],
                postsByCategory.lost.length ? LostPosts.find({ _id: { $in: postsByCategory.lost } }).lean() : [],
                postsByCategory.found.length ? FoundPosts.find({ _id: { $in: postsByCategory.found } }).lean() : [],
                postsByCategory.boarding.length ? BoardingPosts.find({ _id: { $in: postsByCategory.boarding } }).lean() : [],
            ];

            const categoryResults = await Promise.all(categoryPromises);

            // Create a map of all posts keyed by category and ID
            const allPostsMap = {};
            ['sell', 'lost', 'found', 'boarding'].forEach((category, index) => {
                allPostsMap[category] = (categoryResults[index] || []).reduce((map, post) => {
                    map[post._id.toString()] = post;
                    return map;
                }, {});
            });

            // Combine posts with their details
            recentPosts.forEach(post => {
                const postDetails = allPostsMap[post.category]?.[post.postId.toString()];
                if (postDetails) {
                    detailedPosts.push({
                        _id: postDetails._id,
                        date: post.date,
                        cat: post.category,
                        ...postDetails
                    });
                }
            });
        }

        // Return results (limit to 6)
        res.status(200).json({
            success: true,
            recentPosts: detailedPosts.slice(0, limit)
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



router.delete('/removesellpost', async(req, res)=>{

})


router.put('/editsellpost', async(req, res)=>{

})


module.exports = router;
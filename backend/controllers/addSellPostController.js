const SellPosts = require('../models/SellPosts'); // Adjust the path based on your folder structure

// Add a Sell Post
const addSellPost = async (req, res) => {
    try {
        const {
            category,
            location,
            itemname,
            condition,
            brand,
            description,
            price,
            originalprice,
            isnagotiable,
            images,
            contact,
            hidephoneno
        } = req.body;

        // Auto-generate postId
        const lastPost = await SellPosts.findOne().sort({ postId: -1 });
        const postId = lastPost ? lastPost.postId + 1 : 1;

        // Create a new Sell Post
        const newSellPost = new SellPosts({
            postId,
            category,
            location,
            itemname,
            condition,
            brand,
            description,
            price,
            originalprice,
            isnagotiable,
            images,
            contact,
            hidephoneno
        });

        await newSellPost.save();
        res.status(201).json({ message: 'Sell post added successfully!', sellPost: newSellPost });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add sell post', error: error.message });
    }
};

module.exports = addSellPost;

const SellPosts = require('../models/SellPosts'); 


const addBuyPost = async (req, res) => {
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

        
        const lastPost = await SellPosts.findOne().sort({ postId: -1 });
        const postId = lastPost ? lastPost.postId + 1 : 1;

        
        const newBuyPost = new SellPosts({
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

        await newBuyPost.save();
        res.status(201).json({ message: 'Buy post added successfully!', buyPost: newBuyPost });
    } catch (error) {
        res.status(500).json({ message: 'Failed to add buy post', error: error.message });
    }
};

module.exports = addBuyPost;

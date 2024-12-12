const SellPosts = require('../models/SellPosts'); 


const listSellPosts = async (req, res) => {
    try {
        const sellPosts = await SellPosts.find();
        res.status(200).json({
            message: 'Sell posts retrieved successfully!',
            sellPosts,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to retrieve sell posts',
            error: error.message,
        });
    }
};

module.exports = listSellPosts;

const BordingPosts = require('../models/bordingPosts');

// Add a boarding post
exports.addBoardingPost = async (req, res) => {
    try {
        const { postId, location, facilities, capacity, distance, description, rentprice, negotiable, contact, hidephoneno, status } = req.body;

        const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
        const newPost = new BordingPosts({
            postId,
            location,
            facilities,
            capacity,
            distance,
            description,
            rentprice,
            negotiable,
            images,
            contact: JSON.parse(contact),
            hidephoneno,
            status
        });

        await newPost.save();
        res.status(201).json({ success: true, post: newPost });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// List all boarding posts
exports.listBoardingPosts = async (req, res) => {
    try {
        const posts = await BordingPosts.find();
        //console.log(posts)
        res.json({ success: true, posts });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

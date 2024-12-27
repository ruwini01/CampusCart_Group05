const express = require('express');
const router = express.Router();
const {default: mongoose, Model} = require('mongoose');
const SellPosts = require('../models/SellPosts');
const Posts = require('../models/posts');
const Users = require('../models/Users');
const jwt = require('jsonwebtoken');

const JWT_SECRET = '#campusCartGroup05*';

router.post('/addsellpost', async(req, res)=>{
    try {
        const {token} = req.body;

        const sellPostData = {
            category: req.body.category,
            location: req.body.location,
            itemname: req.body.itemname,
            condition: req.body.condition,
            brand: req.body.brand,
            description: req.body.description,
            price: req.body.price,
            originalprice: req.body.originalprice,
            isnagotiable: req.body.isnagotiable,
            images: req.body.images,
            contact: req.body.contact,
            hidephoneno: req.body.hidephoneno,
        };
        console.log("Recieved from frontend" , sellPostData);
        console.log("Token", token);
        
        

        const newSellPost = new SellPosts(sellPostData);
        const savedSellPost = await newSellPost.save();

        const decodedToken = jwt.verify(token, JWT_SECRET);
        const user = await Users.findOne({ regno: decodedToken.regno });

        const postEntry = {
            userId: user._id,
            postId: savedSellPost._id,
            category: 'sell',
        };

        const newPost = new Posts(postEntry);
        await newPost.save();

        res.status(201).json({
            success:true,
            message: 'Sell post added successfully!',
            sellPost: savedSellPost,
            postEntry: newPost,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding the sell post.' });
    }
});




router.get('/listsellposts', async(req, res)=>{

})



router.delete('/removesellpost', async(req, res)=>{

})


router.put('/editsellpost', async(req, res)=>{

})


module.exports = router;
const express = require('express');
const router = express.Router();
const {default: mongoose, Model} = require('mongoose');

router.post('/addfoundpost',AuthToken, async(req, res)=>{
    const user=req.user;

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

        try
        {
            const newfoundPost = new FoundPosts(foundPostData);
            const savedFoundPost = await newfoundPost.save();
            try{
                const postEntry = {
                    userId: user._id,
                    postId: savedFoundPost._id,
                    category: 'found',
                };
        
                const newPost = new Posts(postEntry);
                await newPost.save();

                res.status(201).json({
                    success: true,
                    message: 'found post added successfully!',
                    foundPost: savedFoundPost,
                    postEntry: newPost,
                });
            }
            catch(error){
                await FoundPosts.findByIdAndDelete(savedFoundPost._id);
                res.status(500).json({ error: 'An error occurred while post entry.'+error });
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ error: 'An error occurred while adding the found post.' });
        }
})



router.get('/listfoundposts', async(req, res)=>{
    try {
        const foundPosts = await FoundPosts.find();
        res.status(200).json({ success: true, foundPosts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching found posts.' });
    }

})



router.delete('/removefoundpost', async(req, res)=>{

})


router.put('/editfoundpost', async(req, res)=>{

})


module.exports = router;
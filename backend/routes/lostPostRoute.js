const express = require('express')

const {
    getAllPosts,
    getSinglePost,
    createNewPost,
    updatePost,
    deletePost
} = require('../controllers/lostPostController')

const router = express.Router()



// get all posts
router.get('/', getAllPosts)

// get a single posts with it's ID
router.get('/:id', getSinglePost)

// create a new post
router.post('/', createNewPost)

// update a post
router.put('/:id', updatePost)

// delete post
router.delete('/:id', deletePost)

module.exports = router;
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const { addBoardingPost, listBoardingPosts } = require('../controllers/bordingPostsController');

// Multer configuration for image uploads
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

// Routes
router.post('/add', upload.array('images', 5), addBoardingPost);
router.get('/list', listBoardingPosts);

module.exports = router;

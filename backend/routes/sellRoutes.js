
const express = require('express');
const addSellPost = require('../controllers/addSellPostController');
const addBuyPost = require('../controllers/addBuyPostController');
const listSellPosts = require('../controllers/listSellPostsController');
const router = express.Router();


router.post('/sell', addSellPost);

router.post('/buy', addBuyPost);

router.get('/sell', listSellPosts);

module.exports = router;


const express = require('express');
const addSellPost = require('../controllers/addSellPostController');
const addBuyPost = require('../controllers/addBuyPostController');
const router = express.Router();


router.post('/sell', addSellPost);


router.post('/buy', addBuyPost);

module.exports = router;

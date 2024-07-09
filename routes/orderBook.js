const express = require('express');
const router = express.Router();
const axios = require('axios');
const { getToken, getOrderBook } = require('../services/upstoxService'); 
const checkAccessToken = require('../middleware/checkAccessToken');

router.get('/order-book', checkAccessToken, async (req, res) => {
    try {
        const orderBook = await getOrderBook();
        res.send(orderBook);
    } catch (error) {
        res.status(500).send('Failed to fetch orderBook');
    }
});

module.exports = router;

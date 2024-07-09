const express = require('express');
const router = express.Router();
const { getShortTermPositions } = require('../services/upstoxService');
const checkAccessToken = require('../middleware/checkAccessToken');

router.get('/short-term-positions', checkAccessToken, async (req, res) => {
    try {
        const positions = await getShortTermPositions();
        res.send(positions);
    } catch (error) {
        res.status(500).send('Failed to fetch short-term positions');
    }
});

module.exports = router;

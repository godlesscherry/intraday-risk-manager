const express = require('express');
const router = express.Router();
const { upstoxAuthUrl, getToken } = require('../services/upstoxService');
const config = require('../upstoxAPIConfig');

router.get('/login', (req, res) => {
    const authUrl = `${upstoxAuthUrl}?response_type=code&client_id=${config.apiKey}&redirect_uri=${config.redirectUri}&state=some_random_state`;
    res.redirect(authUrl);
});

router.get('/callback', async (req, res) => {
    const authCode = req.query.code;

    if (!authCode) {
        return res.status(400).send('Authentication failed');
    }

    try {
        await getToken(authCode);
        res.send('Authentication successful');
    } catch (error) {
        res.status(500).send('Error exchanging code for token');
    }
});

module.exports = router;

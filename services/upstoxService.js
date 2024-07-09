const axios = require('axios');
const config = require('../upstoxAPIConfig');

let tokens = {
    accessToken: null,
    expiryTime: null,
};

const upstoxAuthUrl = 'https://api.upstox.com/v2/login/authorization/dialog';

async function getToken(authCode) {
    const tokenResponse = await axios.post('https://api.upstox.com/v2/login/authorization/token', null, {
        params: {
            code: authCode,
            client_id: config.apiKey,
            client_secret: config.apiSecret,
            redirect_uri: config.redirectUri,
            grant_type: 'authorization_code'
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'accept': 'application/json'
        }
    });

    const { access_token, expires_in } = tokenResponse.data;
    tokens.accessToken = access_token;
    tokens.expiryTime = Date.now() + expires_in * 1000;
}



async function getOrderBook(){
    try {
        const orderBookResponse = await axios.get('https://api.upstox.com/v2/order/retrieve-all', {
            headers: {
                'Authorization': `Bearer ${tokens.accessToken}`,
                'Accept': 'application/json'
            }
        });
        return orderBookResponse.data;
    } catch (error) {
        console.error('Failed to fetch order book:', error);
        res.status(500).send('Failed to fetch order book');
    }
}

async function getShortTermPositions() {
    const positionsResponse = await axios.get('https://api.upstox.com/v2/portfolio/short-term-positions', {
        headers: {
            'Authorization': `Bearer ${tokens.accessToken}`,
            'Accept': 'application/json'
        }
    });

    return positionsResponse.data;
}

module.exports = {
    upstoxAuthUrl,
    getToken,
    getShortTermPositions,
    getOrderBook,
};

const { upstoxAuthUrl } = require('../services/upstoxService');

function checkAccessToken(req, res, next) {
    const { tokens } = require('../services/upstoxService');

    if (Date.now() >= tokens?.expiryTime) {
        return res.redirect('/login');
    }
    next();
}

module.exports = checkAccessToken;

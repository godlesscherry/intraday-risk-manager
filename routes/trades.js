const express = require('express');
const router = express.Router();
const { placeOrder } = require('../services/upstoxService');
const checkAccessToken = require('../middleware/checkAccessToken');
const config = require('../upstoxAPIConfig');
const { processAlerts } = require('../services/alertService');

let trades = {};
let totalDayLoss = 0;

router.post('/place-trade', checkAccessToken, async (req, res) => {
    const { symbol, quantity, price, stopLoss, targetPrice } = req.body;

    if (Object.values(trades).flat().length >= config.maxTradesPerDay) {
        return res.status(400).send("Max trades per day reached.");
    }

    if (trades[symbol] && trades[symbol].length >= config.maxTradesPerScrip) {
        return res.status(400).send(`Max trades for ${symbol} reached.`);
    }

    const potentialLoss = (price - stopLoss) * quantity;

    if (potentialLoss > config.maxTradeLoss) {
        return res.status(400).send("Trade loss exceeds max trade loss limit.");
    }

    const potentialDayLoss = totalDayLoss + potentialLoss;

    if (potentialDayLoss > config.maxDayLoss) {
        return res.status(400).send("Potential day loss exceeds max day loss limit.");
    }

    try {
        const orderDetails = {
            transaction_type: 'B',
            exchange: 'NSE',
            symbol: symbol,
            quantity: quantity,
            order_type: 'L',
            product: 'I',
            price: price,
            trigger_price: stopLoss,
            stop_loss: stopLoss,
            square_off: targetPrice
        };
        const order = await placeOrder(orderDetails);

        if (!trades[symbol]) {
            trades[symbol] = [];
        }
        trades[symbol].push({
            order_id: order.order_id,
            quantity: quantity,
            price: price,
            stopLoss: stopLoss,
            targetPrice: targetPrice,
            potentialLoss: potentialLoss
        });

        totalDayLoss += potentialLoss;

        // Process alerts
        processAlerts(trades, totalDayLoss);

        res.send(`Trade placed for ${symbol} at ${price} with SL ${stopLoss} and TP ${targetPrice}.`);
    } catch (error) {
        res.status(500).send('Failed to place trade');
    }
});

module.exports = router;

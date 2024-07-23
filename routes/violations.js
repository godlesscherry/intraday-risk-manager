const express = require('express');
const router = express.Router();
const { getShortTermPositions } = require('../services/upstoxService');
const { processPositionViolations, getViolations, getEstimatedCharges, getTotalTradesCount, getTotalTradedValue } = require('../services/alertService');

router.get('/violations', async (req, res) => {
    try {
        const positions = await getShortTermPositions();
        await processPositionViolations(positions.data); // Analyze positions for violations
        const violations = getViolations();
        res.json(violations);
    } catch (error) {
        console.error('Failed to fetch and process violations:', error);
        res.status(500).send('Failed to fetch and process violations');
    }
});

router.get('/estimated-charges', async (req, res) => {
    try {
      
        const estimatedCharges = getEstimatedCharges();
        res.json(estimatedCharges);
    } catch (error) {
        console.error('Failed to fetch estimated charges:', error);
        res.status(500).send('Failed to fetch estimated charges');
    }
});

// New endpoint for total trade count
router.get('/total-trade-count', async (req, res) => {
    try {
       
        const totalTradesCount = getTotalTradesCount();
        res.json(totalTradesCount);
    } catch (error) {
        console.error('Failed to fetch totalTradesCount:', error);
        res.status(500).send('Failed to fetch totalTradesCount');
    }
});

// New endpoint for total trade value
router.get('/total-trade-value', async (req, res) => {
    try {
        const totalTradedValue = getTotalTradedValue();
        console.log('Total traded value:' , totalTradedValue);
        res.json(totalTradedValue);
    } catch (error) {
        console.error('Failed to fetch totalTradedValue:', error);
        res.status(500).send('Failed to fetch totalTradedValue');
    }
});


module.exports = router;

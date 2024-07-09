const express = require('express');
const router = express.Router();
const { getShortTermPositions } = require('../services/upstoxService');
const { processPositionViolations, getViolations } = require('../services/alertService');

router.get('/violations', async (req, res) => {
    try {
        const positions = await getShortTermPositions();
        console.log(positions);
        processPositionViolations(positions.data); // Analyze positions for violations
        const violations = getViolations();
        res.json(violations);
    } catch (error) {
        console.error('Failed to fetch and process violations:', error);
        res.status(500).send('Failed to fetch and process violations');
    }
});

module.exports = router;

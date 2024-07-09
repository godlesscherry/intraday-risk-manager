const fs = require('fs');
const path = require('path');
const config = require('../upstoxAPIConfig');

const alertFilePath = path.join(__dirname, '../alerts.log');
let violations = [];



function processPositionViolations(positions) {
    violations = []; // Clear previous violations

    //Max loss per position is 5000
    positions.forEach(position => {
        if (position.realised < config.maxTradeLoss) { // Example rule: Realized loss exceeds 5000
            violations.push(`Realized loss for ${position.trading_symbol} exceeds threshold: ${position.realised}`);
        }
        if (position.unrealised < config.maxTradeLoss) { // Example rule: Unrealized loss exceeds 5000
            violations.push(`Unrealized loss for ${position.trading_symbol} exceeds threshold: ${position.unrealised}`);
        }
    });

    // Max loss per day is 15000
    const totalRealised = positions.reduce((total, position) => total + position.realised, 0);
    if (totalRealised < -15000) {
        violations.push(`Total realized loss for the day exceeds threshold: ${totalRealised}`);
    }
    // Optionally, log violations
    console.log('Violations:', violations);
    fs.appendFile(alertFilePath, `${new Date().toISOString()}: ${violations.join(', ')}\n`, error => {
        if (error) {
            console.error('Failed to log violations:', error);
        }
    });
}



module.exports = {
    processPositionViolations,
    getViolations: () => violations
};

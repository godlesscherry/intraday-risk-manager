const fs = require('fs');
const path = require('path');
const config = require('../upstoxAPIConfig');
const { getShortTermPositions, getOrderBook } = require('./upstoxService');

const alertFilePath = path.join(__dirname, '../alerts.log');
let violations = [];
let estimatedCharges = 0;
let totalTradesCount = 0;
let totalTradedValue = 0;

async function processPositionViolations() {
    violations = []; // Clear previous violations

    const positions = await getShortTermPositions();

    // Max loss per position is 5000
    positions.data.forEach(position => {
        if (position.realised < config.maxTradeLoss) { // Example rule: Realized loss exceeds 5000
            violations.push(`Realized loss for ${position.trading_symbol} exceeds threshold: ${position.realised}`);
        }
        if (position.unrealised < config.maxTradeLoss) { // Example rule: Unrealized loss exceeds 5000
            violations.push(`Unrealized loss for ${position.trading_symbol} exceeds threshold: ${position.unrealised}`);
        }
    });

    // Max loss per day is 15000
    const totalRealised = positions.data.reduce((total, position) => total + position.realised, 0);
    if (totalRealised < config.maxDayLoss) {
        violations.push(`Total realized loss for the day exceeds threshold: ${totalRealised}`);
    }

    // Max trades per scrip
    const tradesPerScrip = {};
    totalTradesCount = 0;

    positions.data.forEach(position => {
        const symbol = position.trading_symbol;
        if (!tradesPerScrip[symbol]) {
            tradesPerScrip[symbol] = 0;
        }
        tradesPerScrip[symbol] += 1;
        totalTradesCount += 1;
    });

    // Check for max trades per scrip violations
    for (const [symbol, trades] of Object.entries(tradesPerScrip)) {
        if (trades > config.maxTradesPerScrip) {
            violations.push(`Max trades per scrip exceeded for ${symbol}: ${trades} trades (max allowed: ${config.maxTradesPerScrip})`);
        }
    }

    // Check for max trades per day violation
    if (totalTradesCount > config.maxTradesPerDay) {
        violations.push(`Max trades per day exceeded: ${totalTradesCount} trades (max allowed: ${config.maxTradesPerDay})`);
    }

    // Calculate estimated charges and fees
    totalTradedValue = positions.data.reduce((total, position) => total + position.day_buy_value + position.day_sell_value, 0);
    estimatedCharges = Math.round((totalTradedValue / 4000000) * 1000);

    // Optionally, log violations
    fs.appendFile(alertFilePath, `${new Date().toISOString()}: ${violations.join(', ')}\n`, error => {
        if (error) {
            console.error('Failed to log violations:', error);
        }
    });
}

async function analyzeOrderbook(){
    
    const orderBook = await getOrderBook();

}

module.exports = {
    processPositionViolations,
    analyzeOrderbook,
    getViolations: () => violations,
    getEstimatedCharges: () => estimatedCharges,
    getTotalTradesCount: () => totalTradesCount,
    getTotalTradedValue: () => totalTradedValue
};

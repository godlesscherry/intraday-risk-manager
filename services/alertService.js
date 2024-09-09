const fs = require('fs');
const path = require('path');
const config = require('../upstoxAPIConfig');
const { getShortTermPositions, getOrderBook } = require('./upstoxService');

const alertFilePath = path.join(__dirname, '../alerts.log');
let violations = [];
let estimatedCharges = 0;
let totalTradesCount = 0;
let totalTradedValue = 0;

// Helper function to avoid duplicate violations
function addViolation(message) {
    if (!violations.includes(message)) {
        violations.push(message);
    }
}

// Process violations based on positions data
async function processPositionViolations() {
    const positions = await getShortTermPositions();

    // Max loss per position is 5000
    positions.data.forEach(position => {
        if (position.realised < config.maxTradeLoss) {
            addViolation(`Max loss per trade for ${position.trading_symbol} exceeds threshold: ${position.realised}`);
        }
        if (position.unrealised < config.maxTradeLoss) {
            addViolation(`Unrealized loss for ${position.trading_symbol} exceeds threshold: ${position.unrealised}`);
        }
    });

    // Max loss per day is 15000
    const totalRealised = positions.data.reduce((total, position) => total + position.realised, 0);
    if (totalRealised < config.maxDayLoss) {
        addViolation(`Total realized loss for the day exceeds threshold: ${totalRealised}`);
    }

    // Calculate estimated charges and fees
    totalTradedValue = positions.data.reduce((total, position) => total + position.day_buy_value + position.day_sell_value, 0);
    estimatedCharges = Math.round((totalTradedValue / 4000000) * 1000);

    // Enforce Charges limit of 2500 per day
    if (estimatedCharges > 2500) {
        addViolation(`Estimated charges for the day exceeds threshold: ${estimatedCharges}`);
    }

    // Optionally, log violations
    if (violations.length > 0) {
        fs.appendFile(alertFilePath, `${new Date().toISOString()}: ${violations.join(', ')}\n`, error => {
            if (error) {
                console.error('Failed to log violations:', error);
            }
        });
    }
}

// Enforce a 25-trade limit and max trades per scrip by analyzing the order book
async function analyzeOrderbookViolations() {
    try {
        const response = await getOrderBook(); // Fetch the order book data
        const orderBook = response.data; // Assuming the order book data is in response.data

        // Sort the order book chronologically by the order timestamp
        const sortedOrderBook = orderBook.sort((a, b) => {
            return new Date(a.order_timestamp) - new Date(b.order_timestamp);
        });

        // Create lists to track unpaired buy and sell orders
        let buyOrders = [];
        let sellOrders = [];
        let completedTrades = 0;
        let tradesPerScrip = {}; // Track the number of trades for each scrip

        // Iterate over the sorted order book to pair buy/sell orders as trades
        sortedOrderBook.forEach(trade => {
            const symbol = trade.tradingsymbol;
            const quantity = trade.filled_quantity;

            if (trade.status === 'complete' && quantity > 0) {
                // Initialize the scrip in the trade counter if it doesn't exist
                if (!tradesPerScrip[symbol]) {
                    tradesPerScrip[symbol] = 0;
                }

                if (trade.transaction_type === 'BUY') {
                    // Try to match the buy order with an existing sell order
                    let sellIndex = sellOrders.findIndex(sell => sell.tradingsymbol === symbol && sell.quantity === quantity);
                    if (sellIndex !== -1) {
                        completedTrades++;
                        tradesPerScrip[symbol]++; // Count this as a completed trade for the scrip
                        sellOrders.splice(sellIndex, 1); // Remove matched sell order
                    } else {
                        buyOrders.push({ tradingsymbol: symbol, quantity });
                    }
                } else if (trade.transaction_type === 'SELL') {
                    let buyIndex = buyOrders.findIndex(buy => buy.tradingsymbol === symbol && buy.quantity === quantity);
                    if (buyIndex !== -1) {
                        completedTrades++;
                        tradesPerScrip[symbol]++; // Count this as a completed trade for the scrip
                        buyOrders.splice(buyIndex, 1); // Remove matched buy order
                    } else {
                        sellOrders.push({ tradingsymbol: symbol, quantity });
                    }
                }

                // Enforce max trades per scrip
                if (tradesPerScrip[symbol] > config.maxTradesPerScrip) {
                    addViolation(`Max trades per scrip exceeded for ${symbol}: ${tradesPerScrip[symbol]} trades (max allowed: ${config.maxTradesPerScrip})`);
                }
            }
        });

        totalTradesCount += completedTrades; // Update the total trade count

        // Enforce max trades per day
        if (totalTradesCount >= 25) {
            addViolation(`Max trades per day limit reached: ${totalTradesCount} trades (max allowed: 25)`);
        } else {
            console.log(`Trades left before reaching the limit: ${25 - totalTradesCount}`);
        }

        // Optionally, log violations
        if (violations.length > 0) {
            fs.appendFile(alertFilePath, `${new Date().toISOString()}: ${violations.join(', ')}\n`, error => {
                if (error) {
                    console.error('Failed to log violations:', error);
                }
            });
        }

    } catch (error) {
        console.error('Error analyzing order book:', error);
    }
}

module.exports = {
    processPositionViolations,
    analyzeOrderbook: analyzeOrderbookViolations,
    getViolations: () => violations,
    getEstimatedCharges: () => estimatedCharges,
    getTotalTradesCount: () => totalTradesCount,
    getTotalTradedValue: () => totalTradedValue
};

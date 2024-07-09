const express = require('express');
const app = express();
const authRoutes = require('./routes/auth');
const tradeRoutes = require('./routes/trades');
const positionRoutes = require('./routes/positions');
const { getShortTermPositions } = require('./services/upstoxService');
const { processPositionViolations } = require('./services/alertService');
const violationsRoutes = require('./routes/violations');
const orderBookRoutes = require('./routes/orderBook'); 


app.use(express.json());
app.use(express.static('public'));
app.use(authRoutes);
app.use(tradeRoutes);
app.use(positionRoutes);
app.use(violationsRoutes);
app.use(orderBookRoutes); 

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    // Create a custom decorative banner for the console
    console.log('-------------------------------------------------------');
    console.log('-------------------------------------------------------');
    // Create a mosaic of the text "IRMA" with the following characters
    console.log('  _____ _____  __  __          _ ');
    console.log(' |_   _|  __ \\|  \\/  |   /\\   | |');
    console.log('   | | | |__) | \\  / |  /  \\  | |');
    console.log('   | | |  _  /| |\\/| | / /\\ \\ | |');
    console.log('  _| |_| | \\ \\| |  | |/ ____ \\|_|');
    console.log(' |_____|_|  \\_\\_|  |_/_/    \\_(_)');
    console.log('-------------------------------------------------------');
    console.log('-------------------------------------------------------');
    // Redirect to login page
    console.log('Open http://localhost:3000/login to login');
    // Redirect to order book page
    console.log('Open http://localhost:3000/order-book to view order book');
    // Redirect to violations page
    console.log('Open http://localhost:3000/ to view violations');
    // Redirect to short term positions page
    console.log('Open http://localhost:3000/short-term-positions to view short term positions');
    
    // Dynamically import the open module
    const open = (await import('open')).default;
    // Automatically open the login page in the default browser
    await open(`http://localhost:${PORT}/login`);
    
});

// Periodically fetch short-term positions and generate alerts
setInterval(async () => {
    try {
        const positions = await getShortTermPositions();
        processPositionViolations(positions.data); // Analyze positions for violations
    } catch (error) {
        console.error('Failed to fetch and process positions:', error);
    }
}, 30000); // Fetch every 30 seconds

# Intraday Risk Manager (IRMA)

## Introduction

Intraday Risk Manager (IRMA) is a Node.js application designed to help intraday traders manage their trading risk effectively. It integrates with the Upstox API to fetch trading data, positions, and order books while ensuring that predefined risk management rules are enforced.

## Features

- **Token Management**: Handles OAuth2 authentication with the Upstox API.
- **Risk Management**: Enforces predefined trading rules and violations.
- **Order Book**: Retrieves the list of orders placed for the current day.
- **Positions**: Retrieves current and short-term trading positions.
- **Alerts and Violations**: Generates alerts and displays risk management violations.
- **Customizable Rules**: Allows users to customize risk management rules.
- **Web Interface**: Provides a user-friendly web interface to interact with the application.
- **REST API**: Exposes REST endpoints to fetch trading data and risk management violations.
- **Periodic Updates**: Fetches data at regular intervals to keep the application up-to-date.
- **Summary Dashboard**: Displays a summary including estimated charges and fees, total traded value, and total trades count.
- **Rules Followed**: Displays the rules followed by the trader(un-violated rules).

## Setup Instructions

### Prerequisites

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- Upstox API credentials (API key and secret)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/intraday-risk-manager.git
   cd intraday-risk-manager

2. Install dependencies:
   ```bash
   npm install

3. Create the `upstoxAPIConfig.js` file with your Upstox API credentials, use the `upstoxAPIConfigSample.js` file as a template:

   ```bash
   cp upstoxAPIConfigSample.js upstoxAPIConfig.js
   ```
4. update the `upstoxAPIConfig.js` file with your Upstox API credentials.

5. Run the application:

   ```bash
   node app.js
   ```
## Endpoints to explore
- Login: http://localhost:3000/login
- Order Book: http://localhost:3000/order-book
- { HOME } Risk Management Violations: http://localhost:3000/
- Short-Term Positions: http://localhost:3000/short-term-positions

## Usage
### Login
To start using the application, navigate to the login page and authenticate using your Upstox credentials. This will generate an access token that is used for subsequent API requests.

### Monitoring Risk Management Violations
The main page provides a summary of risk management violations based on your trading rules. Ensure you review these violations to stay compliant with your trading strategy.

### Configuring Risk Management Rules
You can customize the risk management rules by updating the `upstoxAPIConfig.js` file. This file contains the predefined variables that are enforced by the application.

```javascript
module.exports = {
  // Maximum loss allowed per trade
  maxLossPerTrade: 1000,

  // Maximum loss allowed per day
  maxLossPerDay: 2000,

  // Maximum trades per scrip
   maxTradesPerScrip: 2,

  // Maximum number of trades allowed per day
  maxTradesPerDay: 5,
};

### Rules Followed
The application now includes a section that highlights the trading rules that were not violated. This provides traders with positive feedback and encourages adherence to trading strategies.

### Summary
The summary section includes:

Estimated Charges and Fees: Calculated as proportional to the total volume traded in the day. For example, 1000 INR for 20,00,000 traded value.
Total Traded Value: The total value of all trades executed during the trading day.
Total Trades Count: The total number of trades executed during the trading day.

These enhancements provide a comprehensive view of trading activity and help traders better understand their performance and costs.


```

## Contributing
Contributions are welcome! Please feel free to raise issues, fork the repository, and submit pull requests to help improve the application.



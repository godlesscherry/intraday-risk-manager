# Intraday Risk Manager (IRMA)

## Introduction

Intraday Risk Manager (IRMA) is a Node.js application designed to help intraday traders manage their trading risk effectively. It integrates with the Upstox API to fetch trading data, positions, and order books while ensuring that predefined risk management rules are enforced.

## Features

- **Token Management**: Handles OAuth2 authentication with the Upstox API.
- **Risk Management**: Enforces predefined trading rules and violations.
- **Order Book**: Retrieves and displays the list of orders placed for the current day.
- **Positions**: Retrieves and displays current and short-term trading positions.
- **Alerts and Violations**: Generates alerts and displays risk management violations.

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
- Risk Management Violations: http://localhost:3000/
- Positions: http://localhost:3000/positions
- Short-Term Positions: http://localhost:3000/short-term-positions

## Usage
### Login
To start using the application, navigate to the login page and authenticate using your Upstox credentials. This will generate an access token that is used for subsequent API requests.

### Viewing Order Book
Visit the order book page to view the list of orders placed for the current day, including details such as price, quantity, status, and transaction type.

### Monitoring Risk Management Violations
The main page provides a summary of risk management violations based on your trading rules. Ensure you review these violations to stay compliant with your trading strategy.

### Viewing Positions
Check your current and short-term trading positions to monitor your open trades and plan your next moves accordingly.

## Contributing
Contributions are welcome! Please feel free to raise issues, fork the repository, and submit pull requests to help improve the application.



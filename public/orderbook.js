document.addEventListener('DOMContentLoaded', function() {
    const orderContainer = document.getElementById('order-container');

    function fetchOrderBook() {
        fetch('/order-book')
            .then(response => response.json())
            .then(data => {
                orderContainer.innerHTML = '';
                if (data.length === 0) {
                    orderContainer.innerHTML = '<div class="order">No orders found</div>';
                } else {
                    data.forEach(order => {
                        const orderDiv = document.createElement('div');
                        orderDiv.className = 'order';
                        orderDiv.innerHTML = `
                            <div class="order-header">${order.trading_symbol}</div>
                            <div>Exchange: ${order.exchange}</div>
                            <div>Product: ${order.product}</div>
                            <div>Price: ${order.price}</div>
                            <div>Quantity: ${order.quantity}</div>
                            <div>Status: ${order.status}</div>
                            <div>Order Type: ${order.order_type}</div>
                            <div>Validity: ${order.validity}</div>
                            <div>Trigger Price: ${order.trigger_price}</div>
                            <div>Transaction Type: ${order.transaction_type}</div>
                            <div>Average Price: ${order.average_price}</div>
                            <div>Filled Quantity: ${order.filled_quantity}</div>
                            <div>Pending Quantity: ${order.pending_quantity}</div>
                            <div>Order Timestamp: ${order.order_timestamp}</div>
                        `;
                        orderContainer.appendChild(orderDiv);
                    });
                }
            })
            .catch(error => console.error('Error fetching order book:', error));
    }

    fetchOrderBook();
    setInterval(fetchOrderBook, 60000); // Refresh order book every 60 seconds
});

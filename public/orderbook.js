const { useState, useEffect } = React;

function OrderBook() {
    const [orders, setOrders] = useState([]);

    const fetchOrderBook = async () => {
        try {
            const res = await fetch('/order-book');
            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error('Error fetching order book:', err);
        }
    };

    useEffect(() => {
        fetchOrderBook();
        const i = setInterval(fetchOrderBook, 60000);
        return () => clearInterval(i);
    }, []);

    return (
        <>
            <div id="order-book">
                <h2>Order Book</h2>
                {orders.length === 0 ? (
                    <div className="order">No orders found</div>
                ) : (
                    orders.map((order, idx) => (
                        <div key={idx} className="order">
                            <div className="order-header">{order.trading_symbol}</div>
                            <div>Exchange: {order.exchange}</div>
                            <div>Product: {order.product}</div>
                            <div>Price: {order.price}</div>
                            <div>Quantity: {order.quantity}</div>
                            <div>Status: {order.status}</div>
                            <div>Order Type: {order.order_type}</div>
                            <div>Validity: {order.validity}</div>
                            <div>Trigger Price: {order.trigger_price}</div>
                            <div>Transaction Type: {order.transaction_type}</div>
                            <div>Average Price: {order.average_price}</div>
                            <div>Filled Quantity: {order.filled_quantity}</div>
                            <div>Pending Quantity: {order.pending_quantity}</div>
                            <div>Order Timestamp: {order.order_timestamp}</div>
                        </div>
                    ))
                )}
            </div>
            <a href="index.html">Back to Violations</a>
        </>
    );
}

ReactDOM.render(<OrderBook />, document.getElementById('root'));

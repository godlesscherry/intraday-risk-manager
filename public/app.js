const { useState, useEffect } = React;

function App() {
    const [violations, setViolations] = useState([]);
    const [rulesFollowed, setRulesFollowed] = useState([]);
    const [charges, setCharges] = useState(null);
    const [trades, setTrades] = useState(null);
    const [tradedValue, setTradedValue] = useState(null);

    const rules = {
        maxDayLoss: 'Total realized loss for the day',
        maxTradeLoss: 'Max loss per trade',
        maxTradesPerScrip: 'Max trades per scrip',
        maxTradesPerDay: 'Max trades per day'
    };

    const fetchViolations = async () => {
        try {
            const res = await fetch('/violations');
            const data = await res.json();
            setViolations(data);

            const followed = new Set(Object.keys(rules));
            data.forEach(v => {
                Object.entries(rules).forEach(([key, label]) => {
                    if (v.includes(label)) {
                        followed.delete(key);
                    }
                });
            });
            setRulesFollowed(Array.from(followed));
        } catch (err) {
            console.error('Error fetching violations:', err);
        }
    };

    const fetchEstimatedCharges = async () => {
        try {
            const res = await fetch('/estimated-charges');
            const data = await res.json();
            setCharges(Math.round(data));
        } catch (err) {
            console.error('Error fetching estimated charges:', err);
        }
    };

    const fetchTotalTradesCount = async () => {
        try {
            const res = await fetch('/total-trade-count');
            const data = await res.json();
            setTrades(data);
        } catch (err) {
            console.error('Error fetching Total Trades Count:', err);
        }
    };

    const fetchTotalTradedValue = async () => {
        try {
            const res = await fetch('/total-trade-value');
            const data = await res.json();
            setTradedValue(Math.round(data / 2));
        } catch (err) {
            console.error('Error fetching Total Traded Value:', err);
        }
    };

    useEffect(() => {
        fetchViolations();
        fetchEstimatedCharges();
        fetchTotalTradesCount();
        fetchTotalTradedValue();

        const v = setInterval(fetchViolations, 60000);
        const c = setInterval(fetchEstimatedCharges, 60000);
        const t = setInterval(fetchTotalTradesCount, 6000);
        const tv = setInterval(fetchTotalTradedValue, 6000);
        return () => {
            clearInterval(v);
            clearInterval(c);
            clearInterval(t);
            clearInterval(tv);
        };
    }, []);

    return (
        <>
            <header>
                <h1>IRMA</h1>
                <p>Intraday Risk Manager for Upstox</p>
            </header>
            <div id="container">
                <div className="column" id="violations">
                    <h2>Violations</h2>
                    {violations.length === 0 ? (
                        <div className="violation">No violations detected</div>
                    ) : (
                        violations.map((v, i) => (
                            <div key={i} className="violation">{v}</div>
                        ))
                    )}
                </div>
                <div className="column" id="rules-followed">
                    <h2>Rules Followed</h2>
                    {rulesFollowed.map(rule => (
                        <div key={rule} className="rule-followed">{rules[rule]} was not violated</div>
                    ))}
                </div>
                <div className="column" id="summary">
                    <h2>Trading Summary</h2>
                    <div id="charges-container" className="summary-item">
                        {charges !== null ? `Estimated charges: ${charges}` : ''}
                    </div>
                    <div id="total-trades-container" className="summary-item">
                        {trades !== null ? `Total Trades Count : ${trades}` : ''}
                    </div>
                    <div id="total-traded-value-container" className="summary-item">
                        {tradedValue !== null ? `Total Traded Value: ${tradedValue}` : ''}
                    </div>
                </div>
            </div>
            <footer>
                <h3>Exposed Endpoints</h3>
                <ul>
                    <li><a href="/login">Login</a></li>
                    <li><a href="/order-book">Order Book</a></li>
                    <li><a href="/short-term-positions">Short-Term Positions</a></li>
                </ul>
                <h4> Created by : Hari Charan, Cherukumilli</h4>
                <p><a href="mailto:haricharan.nitt@gmail.com">haricharan.nitt@gmail.com</a></p>
            </footer>
        </>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));

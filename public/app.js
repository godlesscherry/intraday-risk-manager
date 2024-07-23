document.addEventListener('DOMContentLoaded', function() {
    const violationContainer = document.getElementById('violation-container');
    const rulesFollowedContainer = document.getElementById('rules-followed-container');
    const chargesContainer = document.getElementById('charges-container');
    const totalTradesContainer = document.getElementById('total-trades-container');
    const totalTradedValueContainer =document.getElementById('total-traded-value-container');
    

    function fetchViolations() {
        fetch('/violations')
            .then(response => response.json())
            .then(data => {
                violationContainer.innerHTML = '';
                rulesFollowedContainer.innerHTML = '';
                

                const rules = {
                    maxDayLoss: 'Total realized loss for the day',
                    maxTradeLoss: 'Max loss per trade',
                    maxTradesPerScrip: 'Max trades per scrip',
                    maxTradesPerDay: 'Max trades per day'
                };

                const rulesFollowed = new Set(Object.keys(rules));

                if (data.length === 0) {
                    violationContainer.innerHTML = '<div class="violation">No violations detected</div>';
                } else {
                    data.forEach(violation => {
                        const violationDiv = document.createElement('div');
                        violationDiv.className = 'violation';
                        violationDiv.textContent = violation;
                        violationContainer.appendChild(violationDiv);

                        Object.keys(rules).forEach(rule => {
                            if (violation.includes(rules[rule])) {
                                rulesFollowed.delete(rule);
                            }
                        });
                    });
                }

                rulesFollowed.forEach(rule => {
                    const ruleDiv = document.createElement('div');
                    ruleDiv.className = 'rule-followed';
                    ruleDiv.textContent = `${rules[rule]} was not violated`;
                    rulesFollowedContainer.appendChild(ruleDiv);
                });


               

            })
            .catch(error => console.error('Error fetching violations:', error));
    }

    function fetchEstimatedCharges() {
        fetch('/estimated-charges')
            .then(response => response.json())
            .then(data => {
                chargesContainer.textContent = `Estimated charges: ${Math.round(data)}`;
            })
            .catch(error => console.error('Error fetching estimated charges:', error));
    }

    function fetchTotalTradesCount(){
        fetch('/total-trade-count')
            .then(response => response.json())
            .then(data => {
              totalTradesContainer.textContent = `Total Trades Count : ${data}`;
            })
            .catch(error => console.error('Error fetching Total Trades Count:', error));
    }

    function fetchTotalTradedValue() {
        fetch('/total-trade-value')
            .then(response => response.json())
            .then(data => {
                totalTradedValueContainer.textContent = `Total Traded Value: ${Math.round(data/2)}`;
            })
            .catch(error => console.error('Error fetching Total Traded Value:', error));
    }

    fetchViolations();
    fetchEstimatedCharges();
    fetchTotalTradesCount();
    fetchTotalTradedValue();
    setInterval(fetchViolations, 60000); // Refresh violations every 60 seconds
    setInterval(fetchEstimatedCharges, 60000); // Refresh estimated charges every 60 seconds
    setInterval(fetchTotalTradesCount, 6000); // Refresh summary every 60 secs
    setInterval(fetchTotalTradedValue, 6000);
});

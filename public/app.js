document.addEventListener('DOMContentLoaded', function() {
    const violationContainer = document.getElementById('violation-container');

    function fetchViolations() {
        fetch('/violations')
            .then(response => response.json())
            .then(data => {
                violationContainer.innerHTML = '';
                if (data.length === 0) {
                    violationContainer.innerHTML = '<div class="violation">No violations detected</div>';
                } else {
                    data.forEach(violation => {
                        const violationDiv = document.createElement('div');
                        violationDiv.className = 'violation';
                        violationDiv.textContent = violation;
                        violationContainer.appendChild(violationDiv);
                    });
                }
            })
            .catch(error => console.error('Error fetching violations:', error));
    }

    fetchViolations();
    setInterval(fetchViolations, 60000); // Refresh violations every 60 seconds
});

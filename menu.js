document.addEventListener('DOMContentLoaded', function() {
    const balance = document.getElementById('balance');

    function updateBalance() {
        fetch('balance.php')
            .then(response => response.json())
            .then(data => {
                balance.textContent = data.balance;
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    updateBalance();
    setInterval(updateBalance, 10000);
});

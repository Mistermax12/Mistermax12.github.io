document.addEventListener('DOMContentLoaded', function () {
    const telegramId = 123456789; // Замените на реальный Telegram ID пользователя

    fetch(`/user/${telegramId}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                console.error(data.error);
                return;
            }

            document.getElementById('user-id').textContent += data.id;
            document.getElementById('user-balance').textContent = data.balance;
        })
        .catch(error => console.error('Error fetching user data:', error));
});


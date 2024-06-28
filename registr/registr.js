document.addEventListener('DOMContentLoaded', function() {
    const nameInput = document.getElementById('nameInput');
    const continueButton = document.getElementById('continueButton');
    const error = document.getElementById('error');

    continueButton.addEventListener('click', function() {
        const name = nameInput.value.trim();

        if (name.length < 4 || name.length > 10) {
            error.textContent = 'Имя должно быть от 4 до 10 символов.';
            return;
        }

        fetch('register.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'menu.html';
                } else {
                    error.textContent = data.message;
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });
});

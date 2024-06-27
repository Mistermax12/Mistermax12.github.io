const incomePerHour = 60;
const incomePerSecond = incomePerHour / 3600;
let balance = 0;
let accumulatedCoins = 0;
let lastVisit = Date.now();
const userId = "your_user_id";  // Здесь должен быть реальный user_id

// Функция для обновления времени последнего визита
function updateLastVisit() {
  lastVisit = Date.now();
}

// Функция для обновления баланса на сервере
function sendBalanceToServer() {
  fetch('http://localhost:5000/update_balance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ user_id: userId, balance: balance })
  })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
}

// Обработчик кнопки "Claim"
document.querySelector('.claim-button').addEventListener('click', function() {
  balance += accumulatedCoins;
  accumulatedCoins = 0;
  updateBalanceDisplay();
  sendBalanceToServer();  // Отправляем обновленный баланс на сервер
  document.querySelector('.claim-popup').classList.remove('visible');
});

// Функция для обновления отображаемого баланса
function updateBalanceDisplay() {
  const balanceDisplay = document.querySelector('.balance-display');
  balanceDisplay.textContent = `${balance.toFixed(3)} coins`;
}

// Функция для отображения всплывающей таблички с накопленными монетами
function showClaimPopup() {
  const claimPopup = document.querySelector('.claim-popup');
  const claimMessage = document.querySelector('.claim-message');
  claimMessage.textContent = `You have accumulated ${accumulatedCoins.toFixed(3)} coins`;
  claimPopup.classList.add('visible');
}

// Функция для обновления дохода каждую секунду
function updateBalance() {
  const now = Date.now();
  const timeElapsed = (now - lastVisit) / 1000;
  accumulatedCoins += timeElapsed * incomePerSecond;
  updateLastVisit();
}

// Обновление дохода каждую секунду
setInterval(() => {
  updateBalance();
}, 1000);

// Инициализация
updateBalanceDisplay();
showClaimPopup();
updateLastVisit();

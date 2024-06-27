const incomePerHour = 60;
const incomePerSecond = incomePerHour / 3600;
let balance = parseFloat(localStorage.getItem('balance')) || 0;
let accumulatedCoins = parseFloat(localStorage.getItem('accumulatedCoins')) || 0;
let lastVisit = parseInt(localStorage.getItem('lastVisit')) || Date.now();
const userId = 12345;  // Замените на реальный user_id

// Обновление времени последнего визита
function updateLastVisit() {
  lastVisit = Date.now();
  localStorage.setItem('lastVisit', lastVisit);
}

// Обновление баланса
function updateBalance() {
  const now = Date.now();
  const timeElapsed = (now - lastVisit) / 1000;
  accumulatedCoins += timeElapsed * incomePerSecond;
  localStorage.setItem('accumulatedCoins', accumulatedCoins);
  updateLastVisit();
}

// Обновление отображаемого баланса
function updateBalanceDisplay() {
  const balanceDisplay = document.querySelector('.balance-display');
  balanceDisplay.textContent = `${balance.toFixed(3)} coins`;
}

// Отображение всплывающей таблички с накопленными монетами
function showClaimPopup() {
  const claimPopup = document.querySelector('.claim-popup');
  const claimMessage = document.querySelector('.claim-message');
  claimMessage.textContent = `You have accumulated ${accumulatedCoins.toFixed(3)} coins`;
  claimPopup.classList.add('visible');
}

// Обновление баланса на сервере
async function updateBalanceOnServer(userId, balance) {
  const response = await fetch('http://localhost:5000/update_balance', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user_id: userId,
      balance: balance
    })
  });

  const data = await response.json();
  console.log(data);
}

// Получение баланса с сервера
async function getBalanceFromServer(userId) {
  const response = await fetch(`http://localhost:5000/get_balance?user_id=${userId}`);
  const data = await response.json();
  if (data.error) {
    console.error(data.error);
  } else {
    balance = data.balance;
    localStorage.setItem('balance', balance);
    updateBalanceDisplay();
  }
}

// Обработчик кнопки "Claim"
document.querySelector('.claim-button').addEventListener('click', function() {
  balance += accumulatedCoins;
  accumulatedCoins = 0;
  localStorage.setItem('balance', balance);
  localStorage.setItem('accumulatedCoins', accumulatedCoins);
  updateBalanceDisplay();
  document.querySelector('.claim-popup').classList.remove('visible');

  // Обновление баланса на сервере
  updateBalanceOnServer(userId, balance);
});

// Обработчики для других кнопок
document.querySelectorAll('.circle-button').forEach(button => {
  button.addEventListener('click', function() {
    alert(`${button.textContent} button clicked!`);
  });
});

// Обновление дохода каждую секунду
setInterval(() => {
  updateBalance();
}, 1000);

// Инициализация
getBalanceFromServer(userId).then(() => {
  updateBalance();
  updateBalanceDisplay();
  showClaimPopup();  // Показываем окно claim после получения данных с сервера
  updateLastVisit();
});



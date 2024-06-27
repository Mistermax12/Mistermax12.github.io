const incomePerHour = 60;
const incomePerSecond = incomePerHour / 3600;
let balance = parseFloat(localStorage.getItem('balance')) || 0;
let accumulatedCoins = parseFloat(localStorage.getItem('accumulatedCoins')) || 0;
let lastVisit = parseInt(localStorage.getItem('lastVisit')) || Date.now();

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
  claimPopup.classList.remove('hidden');
  claimPopup.classList.add('visible');
}

// Обработчик кнопки "Claim"
document.querySelector('.claim-button').addEventListener('click', function() {
  balance += accumulatedCoins;
  accumulatedCoins = 0;
  localStorage.setItem('balance', balance);
  localStorage.setItem('accumulatedCoins', accumulatedCoins);
  updateBalanceDisplay();
  document.querySelector('.claim-popup').classList.remove('visible');
  document.querySelector('.claim-popup').classList.add('hidden');
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
  showClaimPopup();  // показываем popup каждую секунду (для демонстрации, можно изменить частоту)
}, 1000);

// Инициализация
updateBalance();
updateBalanceDisplay();
updateLastVisit();


const incomePerHour = 60;
const incomePerSecond = incomePerHour / 3600;
let balance = parseFloat(localStorage.getItem('balance')) || 0;
let accumulatedCoins = parseFloat(localStorage.getItem('accumulatedCoins')) || 0;
let lastVisit = parseInt(localStorage.getItem('lastVisit')) || Date.now();
let telegramUserId = localStorage.getItem('telegramUserId') || '';
const telegramBotToken = 'Ваш_токен_бота';
const chatId = 'ID_вашего_чата_с_ботом'; // Или можно использовать ID пользователя

// Функция для получения и отображения ID пользователя Telegram
function getTelegramUserId() {
  fetch(`https://api.telegram.org/bot${telegramBotToken}/getMe`)
    .then(response => response.json())
    .then(data => {
      telegramUserId = data.result.id;
      localStorage.setItem('telegramUserId', telegramUserId);
      updateTelegramUserIdDisplayBottomRight();
    })
    .catch(error => {
      console.error('Ошибка при получении данных с Telegram API:', error);
    });
}

// Функция для обновления отображаемого ID пользователя Telegram в правом нижнем углу
function updateTelegramUserIdDisplayBottomRight() {
  const telegramUserIdDisplay = document.querySelector('.telegram-user-id-bottom-right');
  telegramUserIdDisplay.textContent = `Telegram ID: ${telegramUserId}`;
}

// Функция для отправки сообщения в Telegram
function sendMessageToTelegram(message) {
  const url = `https://api.telegram.org/bot${telegramBotToken}/sendMessage`;
  const data = {
    chat_id: chatId,
    text: message
  };

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Ошибка HTTP: ' + response.status);
    }
    console.log('Сообщение успешно отправлено в Telegram');
  })
  .catch(error => {
    console.error('Произошла ошибка при отправке сообщения в Telegram:', error);
  });
}

// Функция для отправки баланса в Telegram
function sendBalanceToTelegram() {
  const message = `Ваш текущий баланс: ${balance.toFixed(3)} coins`;
  sendMessageToTelegram(message);
}

// Функция для обновления времени последнего визита
function updateLastVisit() {
  lastVisit = Date.now();
  localStorage.setItem('lastVisit', lastVisit);
}

// Функция для обновления баланса
function updateBalance() {
  const now = Date.now();
  const timeElapsed = (now - lastVisit) / 1000;
  accumulatedCoins += timeElapsed * incomePerSecond;
  localStorage.setItem('accumulatedCoins', accumulatedCoins);
  updateLastVisit();
  updateBalanceDisplay();
  
  // Отправляем баланс в Telegram после каждого обновления
  sendBalanceToTelegram();
}

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

// Обработчик кнопки "Claim"
document.querySelector('.claim-button').addEventListener('click', function() {
  balance += accumulatedCoins;
  accumulatedCoins = 0;
  localStorage.setItem('balance', balance);
  localStorage.setItem('accumulatedCoins', accumulatedCoins);
  updateBalanceDisplay();
  document.querySelector('.claim-popup').classList.remove('visible');
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
updateBalanceDisplay();
showClaimPopup();
updateLastVisit();
getTelegramUserId(); // Вызываем функцию для получения и отображения ID пользователя Telegram при загрузке страницы



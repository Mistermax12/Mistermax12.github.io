const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Создаем и подключаемся к базе данных
let db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Ошибка при подключении к базе данных', err.message);
    }
    console.log('Подключено к базе данных SQLite в оперативной памяти.');
});

// Создаем таблицу пользователей и добавляем пользователя с балансом 0
db.serialize(() => {
    db.run('CREATE TABLE user (id INTEGER PRIMARY KEY AUTOINCREMENT, balance INTEGER)');
    db.run('INSERT INTO user (balance) VALUES (0)');
});

// Указываем, где находятся статические файлы (наш HTML)
app.use(express.static('public'));

// API для получения баланса пользователя
app.get('/api/balance', (req, res) => {
    db.get('SELECT balance FROM user WHERE id = 1', (err, row) => {
        if (err) {
            console.error('Ошибка при запросе к базе данных', err.message);
            res.status(500).json({ error: 'Ошибка сервера' });
            return;
        }
        res.json({ balance: row.balance });
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});



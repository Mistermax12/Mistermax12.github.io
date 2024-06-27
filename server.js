const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

// Подключаемся к базе данных SQLite
let db = new sqlite3.Database('database.db'); // Измените на 'database.db' для хранения в файле

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS base_users (user_id TEXT PRIMARY KEY, balance INTEGER)");
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Маршрут для регистрации пользователей
app.post('/register', (req, res) => {
    const username = req.body.username.trim();
    const initialBalance = 1000;

    if (username.length < 4 || username.length > 13) {
        return res.status(400).json({ error: "Имя должно быть от 4 до 13 символов." });
    }

    db.get("SELECT user_id FROM base_users WHERE user_id = ?", [username], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (row) {
            return res.status(400).json({ error: "Это имя уже занято." });
        }

        db.run("INSERT INTO base_users (user_id, balance) VALUES (?, ?)", [username, initialBalance], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            return res.json({ message: "Пользователь зарегистрирован успешно.", balance: initialBalance });
        });
    });
});

app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});

const express     = require('express');
const path        = require('path');
const { PythonShell } = require('python-shell');

const app  = express();
const port = process.env.PORT || 3000;

// 1) Разбираем JSON и формы
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2) Раздаём статические файлы из папки static/
app.use(express.static(path.join(__dirname, 'static')));

// 3) Главная страница — отдаём готовый HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

// 4) API /predict — запускаем Python-скрипт и возвращаем JSON
app.post('/predict', (req, res) => {
  const text = req.body.text_input || '';
  PythonShell.run('predict.py', {
    args: [text],
    pythonOptions: ['-u'],
    scriptPath: __dirname
  }, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
    try {
      const output = JSON.parse(results.join(''));
      res.json(output);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Invalid model output' });
    }
  });
});

// 5) Старт сервера
app.listen(port, () => console.log(`Listening on http://localhost:${port}`));

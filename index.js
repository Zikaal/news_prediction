const express    = require('express');
const path       = require('path');
const { spawnSync } = require('child_process');

const app  = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

app.post('/predict', (req, res) => {
  const text = req.body.text_input || '';
  console.log('[/predict] received text:', text);

  // 1) Проверим, что файл есть
  const scriptFile = path.join(__dirname, 'predict.py');
  console.log('[/predict] script path:', scriptFile);
  console.log('[/predict] exists?', require('fs').existsSync(scriptFile));

  try {
    // 2) Запускаем Python синхронно
    const py = spawnSync(
      'python3',                // попробуй 'python' или полный путь, если нужно
      ['predict.py', text],
      {
        cwd: __dirname,
        encoding: 'utf-8',
        stdio: ['ignore', 'pipe', 'pipe']
      }
    );

    console.log('[/predict] python exit code:', py.status);
    console.log('[/predict] python stdout:', py.stdout);
    console.error('[/predict] python stderr:', py.stderr);

    if (py.error) {
      throw py.error;
    }
    if (py.status !== 0) {
      throw new Error(`Python exited with code ${py.status}`);
    }

    // 3) Парсим JSON из stdout
    const output = JSON.parse(py.stdout);
    return res.json(output);

  } catch (err) {
    console.error('[/predict] error in spawnSync:', err);
    return res.status(500).json({ error: err.toString() });
  }
});

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));

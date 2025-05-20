const express     = require('express');
const path        = require('path');
const fs          = require('fs');
const { PythonShell } = require('python-shell');

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

  // ---- ДИАГНОСТИКА ФАЙЛОВ ----
  const scriptFile = path.join(__dirname, 'predict.py');
  console.log('[/predict] looking for predict.py at:', scriptFile);
  console.log('[/predict] exists?', fs.existsSync(scriptFile));
  // -----------------------------

  PythonShell.run('predict.py', {
    args: [text],
    pythonOptions: ['-u'],
    scriptPath: __dirname
  }, (err, results) => {
    if (err) {
      console.error('[/predict] PythonShell error:', err);
      return res.status(500).json({ error: err.toString() });
    }
    console.log('[/predict] PythonShell output:', results);
    let output;
    try {
      output = JSON.parse(results.join(''));
    } catch (parseErr) {
      console.error('[/predict] JSON parse error:', parseErr);
      return res.status(500).json({ error: 'Cannot parse model output' });
    }
    res.json(output);
  });
});

app.listen(port, () => console.log(`Listening on http://localhost:${port}`));

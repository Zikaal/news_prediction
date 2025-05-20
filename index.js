const express = require('express');
const path = require('path');
const { PythonShell } = require('python-shell');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'templates')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'templates', 'index.html'));
});

app.post('/predict', (req, res) => {
  const text = req.body.text;
  PythonShell.run('app.py', {
    args: [text],
    pythonOptions: ['-u'],
    scriptPath: __dirname
  }, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    try {
      const output = JSON.parse(results.join(''));
      res.json(output);
    } catch {
      res.status(500).json({ error: 'Invalid model output' });
    }
  });
});

app.listen(port, () => console.log(`Listening on ${port}`));

const express = require('express');

const app = express();
const port = Number(process.env.PORT) || 3000;

const data = [
  { id: 1, name: 'one' },
  { id: 2, name: 'two' },
  { id: 3, name: 'three' },
];

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/data', (_request, response) => {
  response.json(data);
});

app.listen(port, () => {
  console.log(`API is listening on port ${port}`);
});

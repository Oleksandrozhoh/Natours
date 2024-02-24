const express = require('express');

const app = express();

const port = '3000';
const server = '127.0.0.1';

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hello from server side', app: 'Natours' });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

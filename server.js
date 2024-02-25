const app = require('./app');

////////////////////////////////////////////////////////////////
// starting the server
const port = '3000';
const server = '127.0.0.1';

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

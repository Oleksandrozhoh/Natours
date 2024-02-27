const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

////////////////////////////////////////////////////////////////
// starting the server
const port = process.env.PORT || '3000';

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

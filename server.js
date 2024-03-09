const mongoose = require('mongoose');
const dotenv = require('dotenv');
// load env variables from config file to node.js
dotenv.config({ path: './config.env' });
const app = require('./app');

// connection to MongoDB
const connectionString = process.env.DATABASE.replace('<PASSWORD>', process.env.PASSWORD);

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log('DB connection successful'));

////////////////////////////////////////////////////////////////
// starting the server
const port = process.env.PORT || '3000';

const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! Shutting down the server...');
  server.close(() => {
    process.exit(1);
  });
});

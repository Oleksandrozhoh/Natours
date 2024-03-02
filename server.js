const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

// load env variables from config file to node.js
dotenv.config({ path: './config.env' });

// connection to MongoDB
const connectionString = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);

mongoose.connect(connectionString, {
  useNewUrlParser: true, 
  useCreateIndex: true, 
  useUnifiedTopology: true,
  useFindAndModify: false
}).then(()=>console.log("DB connection successful"));

////////////////////////////////////////////////////////////////
// starting the server
const port = process.env.PORT || '3000';

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

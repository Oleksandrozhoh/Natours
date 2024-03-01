const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

const connectionString = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);
mongoose.connect(connectionString, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false}).then(con=>{console.log(con.connections), console.log(
  "DB connection successful"
)});

////////////////////////////////////////////////////////////////
// starting the server
const port = process.env.PORT || '3000';

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

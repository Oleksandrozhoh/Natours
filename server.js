const mongoose = require('mongoose');
const dotenv = require('dotenv');
const app = require('./app');

dotenv.config({ path: './config.env' });

// connection to MongoDB
const connectionString = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);
mongoose.connect(connectionString, {
  useNewUrlParser: true, 
  useCreateIndex: true, 
  useFindAndModify: false
}).then(()=>console.log("DB connection successful"));

//creating schema
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "A tour must have a name"],
    unique: true
  },
  rating: {
    type: Number,
    default: 4.5
  },
  price: {
    type: Number,
    require: [true, "A tour must have a price"]
  }
})
const Tour = mongoose.model('Tour', tourSchema);

const testTour = new Tour({name: "My test tour", rating: 5.0, price:500});
testTour.save().then(doc => {console.log(doc)}).catch(err => console.log("😒😒😒😒",err));

////////////////////////////////////////////////////////////////
// starting the server
const port = process.env.PORT || '3000';

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

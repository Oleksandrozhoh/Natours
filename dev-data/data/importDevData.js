const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const Tour = require('../../models/tourModel')

// load env variables from config file to node.js
dotenv.config({ path: './config.env' });

// connection to MongoDB
const connectionString = process.env.DATABASE.replace("<PASSWORD>", process.env.PASSWORD);
mongoose.connect(connectionString, {
  useNewUrlParser: true, 
  useCreateIndex: true, 
  useFindAndModify: false
}).then(()=>console.log("DB connection successful"));


// reading file 
const tours  = JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8'));

// import data into DB
const importData = async () =>
{
    try{
        await Tour.create(tours);
        console.log("Collection data was successfuly loaded")
        process.exit();
    }catch(err){
        console.log(err)
    }
}

// delete existing db data
const deleteData = async()=>
{
    try{
        await Tour.deleteMany({});
        console.log("Collection data was deleted")
        process.exit();
    }catch(err){
        console.log(err);
    }
}

console.log(process.argv);

if(process.argv[2] === '--import'){
    importData();
}else if( process.argv[2] === '--delete'){
    deleteData();
}



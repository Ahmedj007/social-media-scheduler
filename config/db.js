const mongoose = require('mongoose');

const connectDB = async () => {
    try{
        //local
        const conn = await mongoose.connect('mongodb://localhost:27017/socialMediaScheduler');
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch(err){
        console.error(`Error: ${err.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
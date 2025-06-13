const express = require('express');
const path = require('path');
require('./utils/scheduler')

const connectDB = require('./config/db');

connectDB();


const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false }));

//Set view engines
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.get('/',(req,res)=>{
    res.send(`API is running....`);
});

app.listen(3000,()=>{
    console.log('app is running on http://localhost:3000');
})

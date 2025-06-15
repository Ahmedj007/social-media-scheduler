const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
require('./utils/scheduler');

// Load environment variables
dotenv.config();

const connectDB = require('./config/db');

connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: false }));

// Set view engines
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

// Import routes
const authRoutes = require('./routes/authentication');
const postRoutes = require('./routes/posts');

// Routes
app.get('/',(req,res)=>{
    res.send(`API is running....`);
});

// Use routes
app.use('/api/users', authRoutes);
app.use('/api/posts', postRoutes);

// Set port from environment or default to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`App is running on http://localhost:${PORT}`);
});
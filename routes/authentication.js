const express = require('express');
 const router = express.Router();
 const {registerUser, loginUser, getUserProfile } = require('../controllers/authController');
 const { project } = require('../middleware/authMiddleware');

 //Register a new user
router,post('/register', registerUser);

//Login a user
router.post('/login', loginUser);

//Get user profile
router.get('/profile', protect, getUserProfile);

module.exports = router;

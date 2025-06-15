const User = require('../models/User');
const jwt = require('jsonwebtoken');

//generate JWT token

const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET || 'your_fallback_secret_key', {
        expiresIn: '30d' // Token valid for 30 days
    });
}
// Generate JWT token
// const generateToken = (id) => {
//     if (!process.env.JWT_SECRET) {
//         throw new Error('JWT_SECRET is not defined in environment variables');
//     }
//
//     return jwt.sign({ id }, process.env.JWT_SECRET, {
//         expiresIn: '30d'
//     });
// };

//Register user
exports.registerUser = async (req, res) => {
    try{
        const {username, email, password} = req.body;
        // Check if user already exists
        const userExists = await User.findOne({$or: [{email}, {username}] });

        if(userExists){
            return res.status(400).json({error: 'User already exists !'});
        }
        // Create new user
        const user = await User.create({
            username,
            email,
            password
        });

        if(user){
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        }
    } catch(error){
        res.status(500).json({error: error.message});
    }
};

//login user
exports.loginUser = async (req, res) => {
    try{
        const {email, password} = req.body;

        //check for user email
        const user = await User.findOne({email});

        if (!user) {
            return res.status(401).json({error: 'Invalid Credentials'});
        }

        // Use the instance method on the user object, not the model
        if (await user.comparePassword(password)){
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                token: generateToken(user._id)
            });
        } else {
            res.status(401).json({error: 'Invalid Credentials'});
        }
    } catch(error){
        res.status(500).json({error: error.message});
    }
};

//get user profile
exports.getUserProfile = async (req, res) => {
    try{
        const user = await User.findById(req.user._id).select('-password');
        if (user){
            res.json(user);
        } else {
            res.status(404).json({error: 'User not found'});
        }
    } catch(error){
        res.status(500).json({error: error.message});
    }
}
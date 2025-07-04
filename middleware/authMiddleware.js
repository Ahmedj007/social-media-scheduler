const jwt = require('jsonwebtoken')
const User = require('../models/User');

exports.protect = async (req,res,next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try{
            // Get token from header
            token =req.headers.authorization.split(' ')[1];
            // Verify token
            const decoded =jwt.verify(token, process.env.JWT_SECRET || 'your fallback_secret_key');
            // Get user from token
            req.user = await User.findById(decoded.id).select('-password');
            if(!req.user){
                return res.status(401).json({error: 'User not found'});
            }

            next();
        }catch (error) {
            console.error(error);
            res.status(401).json({error: 'Not authorized, token failed'});
        }
    }else{
        res.status(401).json({ error: 'Not authorized, token not found'});
    }
};
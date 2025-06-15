const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { protect } = require('../middleware/authMiddleware');

// Apply the protect middleware to all routes
router.use(protect);

// create a new post
router.post('/', async(req,res) => {
    try {
        // Add the user ID from the auth middleware to the post
        const postData = {
            ...req.body,
            user: req.user._id  // Associate the post with the authenticated user
        };
        const post = new Post(postData);
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

// get all scheduled posts
router.get('/', async(req,res) => {
    try {
        // Only return posts created by the authenticated user
        const posts = await Post.find({ user: req.user._id }).sort({scheduledDate: 1});
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

// get specific post by id
router.get('/:id', async(req,res) => {
    try{
        const post = await Post.findOne({
            _id: req.params.id,
            user: req.user._id  // Only return the post if it belongs to the authenticated user
        });
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

// update a post by id
router.put('/:id', async(req,res) => {
    try {
        const post = await Post.findOneAndUpdate(
            { _id: req.params.id, user: req.user._id },  // Only update if owned by this user
            req.body,
            { new: true }
        );
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

// delete a post by id
router.delete('/:id', async (req,res) => {
    try {
        const post = await Post.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id  // Only delete if owned by this user
        });
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json({ message: 'Post deleted successfully'});
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

module.exports = router;
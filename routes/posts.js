const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Bulk create posts
router.post('/bulk', async (req, res) => {
    try {
        // req.body should be an array of posts
        const posts = await Post.insertMany(req.body);
        res.status(201).json(posts);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Create a new post
router.post('/', async (req, res) => {
    try {
        const post = new Post(req.body);
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get all scheduled posts
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find().sort({ scheduledDate: 1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get specific post by id
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a post by id
router.put('/:id', async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPost) return res.status(404).json({ error: 'Post not found' });
        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a post by id
router.delete('/:id', async (req, res) => {
    try {
        const deletedPost = await Post.findByIdAndDelete(req.params.id);
        if (!deletedPost) return res.status(404).json({ error: 'Post not found' });
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
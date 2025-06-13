const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

//create a new post
router.post('/', async(req,res) => {
    try {
        const post = new Post(req.body);
        await post.save();
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

//get all scheduled posts
router.get('/', async(req,res) => {
    try {
        const posts = await Post.find().sort({scheduledDate: 1});
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

//get specific post by id
router.get('/:id', async(req,res) => {
    try{
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

//update a post by id

router.put('/:id', async(req,res) => {
    try {
        const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true});
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

//delete a post by id
router.delete('/:id', async (req,res) => {
    try {
        const post = await Post.findByIdAndDelete(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });
        res.json({ message: 'Post deleted successfully'});
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
});

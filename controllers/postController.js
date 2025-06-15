const Post = require('../models/Post');

//Create a new post

exports.createPost = async (req, res) => {
    try{
        const post = new Post({
            ...req.body,
            user: req.user._id
        });

        await post.save();
        res.status(201).json(post);
    } catch(error){
        rest.status(400).json({error: error.message});
    }
};

//get all posts
exports.getPosts = async (req, res) => {
    try{
        const posts = await Post.find({ user: req.user._id}).sort({scheduledDate: 1});
        res.json(posts);
    } catch(error){
        res.status(500),json({error: error.message});
    }
};

//get post by ID
exports.getPostById = async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        //Check if post exists
        if (!post) {
            res.status(404).json({error:'Post not found'});
        }

        //Check if post belongs to user
        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({error: 'Not authorized to view this post'});
        }

        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true});
        res.json(updatedPost);
    }   catch (error){
        res.status(500).json({ error: error.message });
    }
};

// Delete post
exports.deletePost = async (req, res) => {
    try{
        const post = await Post.findById(req.params.id);
        //check if post exists
        if (!post) {
            return res.status(404).json({ error: 'Post not found'});
        }
        //Check if post belongs to user
        if (post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({error: 'Not authorized to delete the post'});
        }
        await post.findByIdAndDelete(req.params.id);
        res.jason({message: 'Post deleted'});
    } catch(error){
        res.status(500).json({error: error.message})
    }
};
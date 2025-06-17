const Post = require('../models/Post');

// Platform video duration limits (in seconds)
const PLATFORM_VIDEO_LIMITS = {
    instagram: {
        story: 15,
        reel: 90,
        post: 60,
    },
    tiktok: {
        short: 60,
        post: 180,
    },
    x: {
        short: 140,
        media: 140,
        multiple_media: 140,
        text: null,
    },
};

// Helper to get the shortest video duration limit for selected platforms/contentType
function getShortestLimit(platforms, contentType) {
    let limits = platforms.map(platform => {
        const plat = PLATFORM_VIDEO_LIMITS[platform];
        if (plat && plat[contentType]) return plat[contentType];
        return null;
    }).filter(Boolean);
    return limits.length ? Math.min(...limits) : null;
}

// Bulk post endpoint
exports.bulkPost = async (req, res) => {
    try {
        const postsData = req.body; // Array of posts
        const results = [];
        for (let postData of postsData) {
            // Enforce video duration limit
            if (postData.videoDuration && postData.platforms && postData.contentType) {
                const limit = getShortestLimit(postData.platforms, postData.contentType);
                if (limit && postData.videoDuration > limit) {
                    return res.status(400).json({ error: `Video duration exceeds the shortest limit (${limit}s) for selected platforms.` });
                }
            }
            // Save post
            const post = new Post(postData);
            await post.save();
            // Log activity
            post.activityLog.push({
                action: 'scheduled',
                platform: postData.platforms.join(','),
                timestamp: new Date(),
                details: 'Bulk scheduled'
            });
            await post.save();
            // --- PLACEHOLDER: Integrate with real APIs here ---
            // For each platform, call your real API to schedule/post
            // Example:
            // if (postData.platforms.includes('instagram')) {
            //   // Call Instagram API here
            // }
            // if (postData.platforms.includes('tiktok')) {
            //   // Call TikTok API here
            // }
            // if (postData.platforms.includes('x')) {
            //   // Call X API here
            // }
            results.push(post);
        }
        res.status(201).json(results);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Create a new post
exports.createPost = async (req, res) => {
    try {
        // Enforce video duration limit
        if (req.body.videoDuration && req.body.platforms && req.body.contentType) {
            const limit = getShortestLimit(req.body.platforms, req.body.contentType);
            if (limit && req.body.videoDuration > limit) {
                return res.status(400).json({ error: `Video duration exceeds the shortest limit (${limit}s) for selected platforms.` });
            }
        }
        const post = new Post(req.body);
        await post.save();
        // Log activity
        post.activityLog.push({
            action: 'scheduled',
            platform: req.body.platforms.join(','),
            timestamp: new Date(),
            details: 'Scheduled'
        });
        await post.save();
        // --- PLACEHOLDER: Integrate with real APIs here ---
        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all posts
exports.getPosts = async (req, res) => {
    try {
        const posts = await Post.find().sort({ scheduledDate: 1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get post by ID
exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update a post by ID
exports.updatePost = async (req, res) => {
    try {
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedPost) return res.status(404).json({ error: 'Post not found' });
        // Log activity
        updatedPost.activityLog.push({
            action: 'updated',
            platform: updatedPost.platforms.join(','),
            timestamp: new Date(),
            details: 'Post updated'
        });
        await updatedPost.save();
        res.json(updatedPost);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a post by ID
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }
        // Log activity before deletion
        post.activityLog.push({
            action: 'deleted',
            platform: post.platforms.join(','),
            timestamp: new Date(),
            details: 'Post deleted'
        });
        await post.save();
        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
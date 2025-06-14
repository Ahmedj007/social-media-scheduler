const cron = require('node-cron');
const Post =require('../models/Post');

cron.schedule('* * * * *', async () => {
    const now = new Date();
    const posts = await Post.find({ status: 'scheduled', scheduleDate: {$lte: now}});
    for (const post of posts) {
        post.status = 'posted';
        await post.save();
        console.log(`post ${post._id} marked as posted.`);
    }
})
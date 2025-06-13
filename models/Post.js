const mongoose = require('mongoose');

const postSchema = new mongoose.schema({
    content: {
        type: String,
        required: true
    },

    scheduledDate:{
        type: Date,
        required: true
    },
    platform: {
        type: String,
        required: true,
        enum: ['instagram', 'facebook', 'tiktok', 'youtube', 'youtube_shorts', 'twitter']
    },
    status: {
        type: String,
        default: 'scheduled',
        enum: ['scheduled', 'posted', 'failed']
    },
    mediaUrl: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
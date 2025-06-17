const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    scheduledDate: {
        type: Date,
        required: true
    },
    platforms: [{
        type: String,
        enum: ['instagram', 'tiktok', 'x'],
        required: true
    }],
    contentType: {
        type: String,
        enum: ['story', 'post', 'reel', 'short', 'media', 'multiple_media', 'text'],
        required: true
    },
    status: {
        type: String,
        default: 'scheduled',
        enum: ['scheduled', 'posted', 'failed', 'deleted', 'updated']
    },
    mediaUrl: String,
    videoDuration: Number, // in seconds
    caption: String,
    activityLog: [
        {
            action: String, // posted, deleted, updated
            platform: String,
            timestamp: Date,
            details: String
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
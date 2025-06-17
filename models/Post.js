const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
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
        enum: ['instagram', 'tiktok', 'twitter']
    },
    status: {
        type: String,
        default: 'scheduled',
        enum: ['scheduled', 'posted', 'failed']
    },
    mediaUrl: {
        type: String,
        required: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Post', postSchema);
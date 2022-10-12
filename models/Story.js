const mongoose = require('mongoose')

const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    storybody: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: 'public',
        enum: ['public', 'private'],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    imageId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    imgname: {
        type: String,
    },
    markSafe: Boolean,
    spam: [{
        spamBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
    }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }]
}, { timestamps: true })

module.exports = mongoose.model('Story', StorySchema)
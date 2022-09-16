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
    createdAt: {
        type: Date,
        default: Date.now,
        // default: function() { return Date.now() }
    },
})

module.exports = mongoose.model('Story', StorySchema)
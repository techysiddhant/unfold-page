const mongoose = require('mongoose')
const { marked } = require('marked');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);
const StorySchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    storybody: {
        type: String,
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
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    markdown: {
        type: String,
        required: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
}, { timestamps: true })
StorySchema.pre('validate', function(next) {
    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked(this.markdown));
    }
    next();
})

module.exports = mongoose.model('Story', StorySchema)
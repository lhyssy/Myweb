import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    summary: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    url: {
        type: String,
        required: true,
        unique: true
    },
    readTime: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        enum: ['CSDN', 'GitHub', 'Personal', 'Other'],
        default: 'Personal'
    },
    author: {
        type: String,
        required: true
    },
    stats: {
        views: { type: Number, default: 0 },
        likes: { type: Number, default: 0 },
        collections: { type: Number, default: 0 }
    },
    isPublished: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Blog', blogSchema); 
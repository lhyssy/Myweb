import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    techStack: [{
        type: String,
        required: true
    }],
    achievements: [{
        type: String
    }],
    links: [{
        text: String,
        url: String
    }],
    order: {
        type: Number,
        default: 0
    },
    isVisible: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

export default mongoose.model('Project', projectSchema); 
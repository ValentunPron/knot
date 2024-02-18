import mongoose from "mongoose";
import moment from 'moment-timezone';

const postSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    image: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    community: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Community',
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }
    ],
    createdAt: {
        type: Date,
        default: moment.tz(Date.now(), 'Europe/Kyiv'),
    }, 
    parentId: {
        type: String,
    },
    children: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        }
    ]
});

const Post = mongoose.models.Post || mongoose.model('Post', postSchema);

export default Post;
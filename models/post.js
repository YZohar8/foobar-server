import mongoose from "mongoose";

const { Schema } = mongoose;

const commentSchema = new mongoose.Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' , required: true},
    text: { type: String, required: true },
    date : { type: Date, default: Date.now }
});

const postSchema = new mongoose.Schema({
    author: { type: Schema.Types.ObjectId, ref: 'User' , required: true},
    text: {type: String, required: true},
    image: {type: String, required: false},
    date: { type: Date, default: Date.now },
    comments: [commentSchema],
    likes: [{type: Schema.Types.ObjectId, ref: 'User'}]
});

const Post = mongoose.model('Post', postSchema, 'posts');

export default Post;
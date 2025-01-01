import Post from '../models/post.js'
import { ObjectId } from "mongodb";  


const updateLikes = async (userId, postId) => {
        const post = await Post.findById(postId);

        if (!post) {
            const error = new Error(`post not found`);
            error.code = 404;
            throw error;
        }
        const likeIndex  = post.likes.indexOf(userId);
        if (likeIndex === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(likeIndex, 1);
        }

        await post.save();
};

const checkUserLike = async (userId, postId) => {
    const post = await Post.findById(postId);

        if (!post) {
            const error = new Error(`post not found`);
            error.code = 404;
            throw error;
        }

        if (post.likes.length === 0) {
            return false;
        }

        const likeIndex = post.likes.findIndex(like => like.equals(new ObjectId(userId)));
        if (likeIndex === -1) {
            return false;
        } else {
            return true;
        }
};

export default {
    updateLikes, 
    checkUserLike
}


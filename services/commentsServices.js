import Post from "../models/post.js";
import { ObjectId } from "mongodb";  


const getComments = async (postId) => {
    const post = await Post.findById(postId).populate({
        path: 'comments.author',
        model: 'User',
        select: 'name image _id' 
    });

    if (!post) {
        const error = new Error(`post not found`);
        error.code = 404;
        throw error;
    }

    const commentsWithDetails = post.comments.sort((a, b) => b.date - a.date).map(comment => ({
        id: comment._id,
        text: comment.text,
        date: comment.date,
        postId: postId,
        author: {
            id: comment.author._id,
            name: comment.author.name,
            image: comment.author.image,
        }
    }));

    return commentsWithDetails;
}

const createComment = async (postId, userId, commentsText) => {
    const post = await Post.findById(postId);

    if (!post) {
        const error = new Error(`post not found`);
        error.code = 404;
        throw error;
    }

    if (!commentsText || commentsText === "") {
        const error = new Error(`comments text is empty`);
        error.code = 407;
        throw error;
    } 

    const newComment = {
        author: new ObjectId(userId),
        text: commentsText
    }

    post.comments.push(newComment);
    await post.save();
    return true;
}

const deleteComment  = async (postId, commentId, userId) => {
    const post = await Post.findById(postId);

    if (!post) {
        const error = new Error(`Post not found`);
        error.code = 404;
        throw error;
    }


    const commentIndex = post.comments.findIndex(comment => comment._id.equals(new ObjectId(commentId)));

    if (commentIndex === -1) {
        const error = new Error(`Comment not found`);
        error.code = 404;
        throw error;
    }

    post.comments.splice(commentIndex, 1);
    await post.save();
    return true;

}

const updateComment  = async (postId, commentId, commentText, userId) => {
    const post = await Post.findById(postId);

    if (!post) {
        const error = new Error(`Post not found`);
        error.code = 404;
        throw error;
    }


    const comment = post.comments.find(comment => comment._id.equals(new ObjectId(commentId)));

    if (!comment) {
        const error = new Error(`Comment not found`);
        error.code = 404;
        throw error;
    }

    if (!commentText || commentText.trim() === "") {
        const error = new Error(`Comment text cannot be empty`);
        error.code = 407;
        throw error;
    }

    comment.text = commentText.trim();
    await post.save(); 
    return true;
}



export default {
    getComments,
    createComment,
    deleteComment,
    updateComment
}
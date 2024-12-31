import Post from '../models/post.js'
import { ObjectId } from "mongodb";  


const isRealUser = async (req, res, next) => {
    const requestedUser = req.params.id;
    const userId = req.user.id;

    if (requestedUser === userId) {
        next();
    }
    else {
        res.status(401).json({ message: 'Unauthorized access' });
    }
}

const verifyReqUserIsUser = async (req, res, next) => {
    const postId = req.params.postId;
    const userId = req.user.id;
    let post;

    try {
        post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: 'Error fetching post', error });
    }
    
    const authorId = post.author._id.valueOf();


    if (authorId === userId) {
        next();
    }
    else {
        res.status(401).json({ message: 'Unauthorized access' });
    }
};

const userIsAuthorComments = async (req, res, next) => {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const userId = req.user.id;
    let post;


    try {
        post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'post not found' });
        }
        const comment = post.comments.find(comment => comment._id.equals(new ObjectId(commentId)));
        if (!comment) {
            return res.status(404).json({ message: 'comment not found' });

        }

        if (comment.author.equals(new ObjectId(userId))) {
            next();
        } else {
            return res.status(404).json({ message: `you don't the author` });
        }

    } catch (error) {
        console.error("Error fetching post:", error);
        res.status(500).json({ message: 'Error fetching post author', error });
    }
};

export default {
    isRealUser,
    verifyReqUserIsUser,
    userIsAuthorComments
};
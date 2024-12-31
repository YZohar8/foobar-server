import commentsServices from "../services/commentsServices.js";

const getComments = async (req, res) => {
    const { postId } = req.params;

    try {
        const result = await commentsServices.getComments(postId);
        return res.status(201).json({comments: result});
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
};

const createComment = async (req, res) => {
    const userId = req.user.id;
    const { postId } = req.params;
    const { commentText } = req.body;

    try {
        const result = await commentsServices.createComment(postId, userId, commentText);
        return res.status(201).json({result: result});
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
};

const deleteComment = async (req, res) => {
    const { postId, commentId } = req.params;
    const userId = req.user.id;


    try {
        const result = await commentsServices.deleteComment(postId, commentId, userId);
        return res.status(201).json({result: result});
    } catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }

}

const updateComment = async (req, res) => {
    const { postId, commentId } = req.params;
    const { commentText } = req.body;
    const userId = req.user.id;


    try {
        const result = await commentsServices.updateComment(postId, commentId, commentText, userId);
        return res.status(201).json({result: result});
    } catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }

}

export default {
    getComments,
    createComment,
    deleteComment,
    updateComment

}
import likesSevices from "../services/likesSevices.js";

const updateLikes = async (req, res) => {
    const userId = req.user.id;
    const { postId } = req.params;

    try {
        await likesSevices.updateLikes(userId, postId);
        return res.status(200).json({ message: 'update the like' });
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
};

const checkUserLike = async (req, res) => {
    const userId = req.user.id;
    const { postId } = req.params;

    try {
        const response = await likesSevices.checkUserLike(userId, postId);
        return res.status(200).json({ message: 'check the like', result: response });
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
};

export default {
    updateLikes,
    checkUserLike
}
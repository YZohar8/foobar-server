import postsServices from "../services/postsServices.js";

const createPost = async (req, res) => {
    const userId = req.user.id;
    try {
        const newPost = await postsServices.createPost(userId, req.body);
        return res.status(201).json(newPost);
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
}

const getPosts = async (req, res) => {
    const userId = req.user.id;

    try {
        const posts = await postsServices.getPosts(userId);
        return res.status(201).json(posts);
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
}

const getPostsForOneUser = async (req, res) => {
    const { id } = req.params;

    try {
        const posts = await postsServices.getPostsForOneUser(id);
        return res.status(201).json(posts);
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
}

const updatePost = async (req, res) => {
    try {
        await postsServices.updatePost(req.params.postId, req.body);
        return res.status(200).json({ message: 'Post updated' });
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
}

const deletePost = async (req, res) => {
    try {
        await postsServices.deletePost(req.params.postId);
        return res.status(200).json({ message: 'Post delete' });
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
}

const getPostsWithSerch = async (req, res) => {
    const userId = req.user.id;
    const { text } = req.body;

    try {
        const posts = await postsServices.getPostsWithSerch(userId, text);
        return res.status(201).json(posts.posts);
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
}

const getPostsForOneUserWithSearch = async (req, res) => {
    const { userId, text } = req.body;

    try {
        const posts = await postsServices.getPostsForOneUserWithSearch(userId, text);
        return res.status(201).json(posts);
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
}

export default {
    createPost,
    getPosts,
    updatePost,
    deletePost,
    getPostsForOneUser,
    getPostsWithSerch,
    getPostsForOneUserWithSearch
}
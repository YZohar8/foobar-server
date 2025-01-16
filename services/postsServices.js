import User from "../models/user.js";
import Post from "../models/post.js";
import {ObjectId} from "mongodb";

const getPosts = async (userId) => {
    try {
        const user = await User.findById(userId).populate('friends.friendId');
        if (!user) {
            return { posts: [] };
        }

        const approvedFriendsIds = user.friends
            .filter(friend => friend.status === 'approved')
            .map(friend => friend.friendId);


        const friendsPosts = await Post.find({
            author: { $in: approvedFriendsIds }
        })
            .sort({ date: -1 })
            .limit(20)
            .populate('author', 'name image _id date')
            .exec();

        const nonFriendsPosts = await Post.find({
            author: { 
                $nin: [...approvedFriendsIds, userId] 
            }
        })
            .sort({ date: -1 })
            .limit(5)
            .populate('author', 'name image _id date')
            .exec();

        const allPosts = [...friendsPosts, ...nonFriendsPosts];
        allPosts.sort((a, b) => b.date - a.date);

        if (allPosts.length > 0) {
            const posts = allPosts.map(post => ({
                id: post.id,
                text: post.text,
                image: post.image,
                date: post.date,
                author: {
                    name: post.author.name,
                    image: post.author.image,
                    id: post.author.id
                },
                likesCounter: post.likes.length? post.likes.length : 0,
                commentsCounter: post.comments.length? post.comments.length : 0 
            }));
            return { posts };
        }

        return { posts: [] };
    } catch (error) {
        console.error("Error fetching posts:", error);
        return { posts: [] };
    }
};


const getPostsForOneUser = async (userId) => {
    try {
        // Find posts of the user by userId, sorted by date (most recent first)
        const userPosts = await Post.find({ author: userId })
            .sort({ date: -1 })
            .populate('author', 'name image _id date')
            .exec();


        
        // If there are posts, format the result nicely
        if (userPosts.length > 0) {
            const posts = userPosts.map(post => ({
                id: post.id,
                text: post.text,
                image: post.image,
                date: post.date,
                author: {
                    name: post.author.name,
                    image: post.author.image,
                    id: post.author.id
                },
                likesCounter: post.likes.length? post.likes.length : 0,
                commentsCounter: post.comments.length? post.comments.length : 0 
            }));

            return { posts };
        }

        // If no posts are found, return an empty list
        return { posts: [] };
    } catch (error) {
        console.error("Error fetching posts:", error);
        return { posts: [] };
    }
};

const getPostsWithSerch = async (userId, text) => {
    try {
        const user = await User.findById(userId).populate('friends.friendId');
        if (!user) {
            return { posts: [] };
        }

        const approvedFriendsIds = user.friends
            .filter(friend => friend.status === 'approved')
            .map(friend => friend.friendId);

        // Query for friends' posts with optional text search
        let friendsQuery = { author: { $in: approvedFriendsIds } };
        if (text) {
            friendsQuery.text = { $regex: text, $options: 'i' }; // Search for text in the posts
        }

        const friendsPosts = await Post.find(friendsQuery)
            .sort({ date: -1 })
            .limit(20)
            .populate('author', 'name image _id date')
            .exec();

        // Query for non-friends' posts with optional text search
        let nonFriendsQuery = { author: { $nin: [...approvedFriendsIds, userId] } };
        if (text) {
            nonFriendsQuery.text = { $regex: text, $options: 'i' }; // Search for text in the posts
        }

        const nonFriendsPosts = await Post.find(nonFriendsQuery)
            .sort({ date: -1 })
            .limit(5)
            .populate('author', 'name image _id date')
            .exec();

        const allPosts = [...friendsPosts, ...nonFriendsPosts];
        allPosts.sort((a, b) => b.date - a.date);

        if (allPosts.length > 0) {
            const posts = allPosts.map(post => ({
                id: post.id,
                text: post.text,
                image: post.image,
                date: post.date,
                author: {
                    name: post.author.name,
                    image: post.author.image,
                    id: post.author.id
                },
                likesCounter: post.likes.length ? post.likes.length : 0,
                commentsCounter: post.comments.length? post.comments.length : 0 
            }));
            return { posts };
        }

        return { posts: [] };
    } catch (error) {
        console.error("Error fetching posts:", error);
        return { posts: [] };
    }
};

const getPostsForOneUserWithSearch = async (text, userId) => {
    try {

        const authorId = new ObjectId(userId);
        let query = { author: authorId };

        if (text) {
            query.text = { $regex: text, $options: 'i' }; 
        }

        const userPosts = await Post.find(query)
            .sort({ date: -1 })
            .populate('author', 'name image _id date')
            .exec();

        if (userPosts.length > 0) {
            const posts = userPosts.map(post => ({
                id: post.id,
                text: post.text,
                image: post.image,
                date: post.date,
                author: {
                    name: post.author.name,
                    image: post.author.image,
                    id: post.author.id
                },
                likesCounter: post.likes.length ? post.likes.length : 0,
                commentsCounter: post.comments.length? post.comments.length : 0 
            }));

            return { posts };
        }

        return { posts: [] };
    } catch (error) {
        console.error("Error fetching posts:", error);
        return { posts: [] };
    }
};


const createPost = async (userId, postData) => {

    const newPost = new Post({
        author: userId,
        text: postData.text,
        image: postData.image,
    });


    await newPost.save();

    const savedPost = await Post.findById(newPost._id)
        .populate('author', 'name image')
        .exec();

    const obj = savedPost.toObject();
    obj.commentsLength = 0;
    delete obj.comments;

    return obj;
};

const updatePost = async (postId, postData) => {
    let updateData = { ...postData };

    const updatedPost = await Post.findByIdAndUpdate(postId, updateData, { new: true });
    if (!updatedPost) {
        const error = new Error('Post not found');
        error.code = 404;
        throw error;
    }
}

const deletePost = async (postId) => {

    const deletedPost = await Post.deleteOne({ _id: postId });
    if (deletedPost.deletedCount === 0) {
        const error = new Error('Post not found');
        error.code = 404;
        throw error;
    }
}

export default {
    createPost,
    getPosts,
    updatePost,
    deletePost,
    getPostsForOneUser,
    getPostsForOneUserWithSearch,
    getPostsWithSerch
};
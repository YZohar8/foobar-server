import mongoose from "mongoose";
import User from "../models/user.js";
import Post from "../models/post.js";
import postsServices from './postsServices.js';
import friendsServices from "./friendsServices.js";
import commentsServices from './commentsServices.js';

const validateUserData = async (userData, isUpdate = false) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    const base64ImagePattern = /^data:image\/(jpeg|jpg|png);base64,/;


    if (userData.email && !emailPattern.test(userData.email)) {
        throw new Error('Invalid email format.');
    }

    if (userData.password && !passwordPattern.test(userData.password)) {
        throw new Error('Password must be at least 8 characters long and contain both numbers and letters.');
    }

    // For registration and unique email check during update
    if (!isUpdate || userData.email) {
        const existingUser = await User.findOne({ email: userData.email });
        if (existingUser) {
            throw new Error('Email in use.');
        }
    }

    if (userData.name.length > 16) {
        userData.name = userData.name.slice(0, 16); 
    }

    // Updated image file type validation for base64 strings
    if (userData.image && !base64ImagePattern.test(userData.image)) {
        throw new Error('Unsupported or invalid base64 image. Allowed types are .jpg, .jpeg, .png.');
    }
};

const registerUser = async (userData) => {
    await validateUserData(userData);

    const newUser = new User({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        image: userData.image,
        friends: []
    });

    await newUser.save();
};

const getUserByEmailOrId = async (req) => {
    const param = req.params.id;
    if (!param) {
        throw new Error('Parameter "id" is required.');
    }

    const queryConditions = [{ email: param }];

    if (mongoose.Types.ObjectId.isValid(param)) {
        queryConditions.push({ _id: param });
    }

    try {
        const user = await User.findOne({ $or: queryConditions }).select('_id email name image').exec();
        if (!user) {
            throw new Error('User not found.');
        }


        return {
            id: user._id,
            email: user.email,
            name: user.name,
            image: user.image,
        };
    } catch (err) {
        throw new Error('Failed to fetch user. Please try again later.');
    }
};

const deleteUser = async (userId) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error(`user not found`);
        error.code = 404;
        throw error;
    }

    const posts = await postsServices.getPostsForOneUser(userId);
    const friends = user.friends;

    for (const post of posts.posts) {
        await postsServices.deletePost(post.id);
    }

    for (const friend of friends) {
        await friendsServices.updateFriendshipStatus(userId, friend.friendId, "not");
    }

    const postsWithComments = await Post.find({ "comments.author": userId });

    for (const post of postsWithComments) {
        const userComments = post.comments.filter(comment => comment.author.toString() === userId.toString());
        
        for (const comment of userComments) {
            await commentsServices.deleteComment(post.id, comment._id, userId);
        }
    }

    await User.findByIdAndDelete(userId);

    return true;

};

const updateUser = async (userId, image, name) => {


    if (!userId || !image || !name) {
        const error = new Error("Invalid input: userId, image, and name are required");
        error.code = 400; // Bad Request
        throw error;
    }
    let newName = name;
    if (name.length > 16) {
        newName = name.slice(0, 16);
    }

    const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: { image, name: newName } },
        { new: true, runValidators: true }
    );

    if (!updatedUser) {
        const error = new Error(`User not found`);
        error.code = 404;
        throw error;
    }

    return {
        id: updatedUser._id,
        email: updatedUser.email,
        name: updatedUser.name,
        image: updatedUser.image,
    };
}

export default {
    registerUser, 
    getUserByEmailOrId,
    deleteUser,
    updateUser
}
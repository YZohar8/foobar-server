import mongoose from "mongoose";
import dotenv from 'dotenv';
import User from "./models/user.js"; 
import Post from "./models/post.js"; 
import friendsServices from "./services/friendsServices.js"
import usersDataFile from './dataToReload/usersData.json' assert { type: "json" }
import firstFile from './dataToReload/posts/0.json' assert { type: "json" }
import secondFile from './dataToReload/posts/1.json' assert { type: "json" }
import thirdFile from './dataToReload/posts/2.json' assert { type: "json" }
import fourFile from './dataToReload/posts/3.json' assert { type: "json" }
import fiveFile from './dataToReload/posts/4.json' assert { type: "json" }
import sixFile from './dataToReload/posts/5.json' assert {type: "json"}


const postArray = [firstFile, secondFile, thirdFile, fourFile, fiveFile, sixFile];
let previouslySelectedUsers = [];
dotenv.config(); 


const connectDB = async () => {
    await mongoose.connect(process.env.CONNECTION_STRING)
        .then(() => {
            console.log('MongoDB connected');
        })
        .catch((err) => {
            console.error('MongoDB connection error:', err);
        });
}

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error disconnecting from MongoDB:', error);
    }
};



const getRandomUser = async () => {
    try {
        let users = await User.find({ _id: { $nin: previouslySelectedUsers.map(id => new mongoose.Types.ObjectId(id)) } }).lean();

        if (users.length === 0) {
            previouslySelectedUsers = [];
            users =  await User.find(); 
        }

        const randomIndex = Math.floor(Math.random() * users.length);
        const randomUser = users[randomIndex];
        previouslySelectedUsers.push(randomUser._id.toString());

        console.log("selected user: ", randomUser);

        return randomUser;
    } catch (error) {
        console.error("Error selecting random user:", error);
        throw error;
    }
};

const loadPostsFromJson = async (userId, i) => {
    try {
        const postsData = postArray[i];
        
        const posts = [];
        for (const post of postsData) {
            const comments = [];
            if (post.comments) {
                for (const comment of post.comments) {
                    const randomUser = await getRandomUser();
                    comments.push({
                        author: randomUser._id,
                        text: comment.text,
                        date: comment.date ? new Date(comment.date) : new Date(),
                    });
                }
            }

            posts.push({
                author: userId,
                text: post.text,
                image: post.image || null,
                comments: comments,
                likes: [],
                date: post.date ? new Date(post.date) : new Date(),
            });
        }

        return posts; 

    } catch (error) {
        console.error(`Error processing posts for user: ${userId}`, error);
        return [];
    }
};

const createInitialUsers = async () => {
    try {
        const usersData = usersDataFile;
        for (let i = 0; i < usersData.length; i++) {
            const userData = usersData[i];
            const user = new User(userData);
            await user.save();
            

            // בעיה עם זה בעצם בראשון יש רק user 1 לכן צריך להוציא את זה החוצה.
            const posts = await loadPostsFromJson(user._id, i);
            if (posts.length > 0) {
                await Post.insertMany(posts);
            }
        }
        console.log("succses to add users and post");
    } catch (error) {
        console.log("failed to add users and post: ", error);
    }
};

const checkIfDataExist = async () => {
    const count = await User.countDocuments();
    if (count > 0) {
        console.log(`database is not empty: you have ${count} users.`);
        return true;
    } else {
        console.log("database is empty");
        return false;
    }
};

const createFriendships = async () => {
    try {
        const users = await User.find();


        const usersToApprove = users.slice(0, 4);
        const userToRequest = users[4];
        const usersToIgnore = users.slice(5);

        for (let i = 0; i < usersToApprove.length; i++) {
            for (let j = i + 1; j < usersToApprove.length; j++) {
                await friendsServices.updateFriendshipStatus(usersToApprove[i]._id, usersToApprove[j]._id, "approved");
            }
        }

        for (let i = 0; i < users.length; i++) {
            if (users[i]._id.toString() !== userToRequest._id.toString()) {
                await friendsServices.updateFriendshipStatus(userToRequest._id, users[i]._id, "pending");
            }
        }

        for (let i = 0; i < usersToIgnore.length; i++) {
            for (let j = 0; j < users.length; j++) {
                if (usersToIgnore[i]._id.toString() !== users[j]._id.toString()) {
                    await friendsServices.updateFriendshipStatus(usersToIgnore[i]._id, users[j]._id, "not");
                }
            }
        }

        console.log("acsses defiend friendship");
    } catch (error) {
        console.log("error with defiend friendship", error);
    }
};

const populateDatabase = async () => {
    try {
        const dataExists = await checkIfDataExist();
        if (!dataExists) {
            await createInitialUsers();
            await createFriendships();
        }
    } catch (error) {
        console.log("failed in reload to the database: ", error);
    }
};


const start = async () => {
    try {
        await connectDB();
        await populateDatabase();
    } catch (error) {
        console.log("Error during population process:", error);
    } finally {
        await disconnectDB();
        console.log("run node app.js to start the server.");
    }
};

start();

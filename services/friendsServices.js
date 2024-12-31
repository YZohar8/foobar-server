import User from "../models/user.js";
import { ObjectId } from "mongodb";  

const updateFriendshipStatus = async (userId, friendId, status) => {
    try {
        const user = await User.findById(userId);
        const thisFriend = await User.findById(friendId);

        if (!user || !thisFriend) {
            throw new Error('User not found');
        }

        let newStatusUser = "";
        let newStatusFriend = "";



        if (status === "approved") {
            newStatusUser = "approved";
            newStatusFriend = "approved";
        } else if (status === "pending") {
            newStatusUser = "s-pending";
            newStatusFriend = "pending";
        } else if (status === "not") {
            newStatusUser = "not_friends";
            newStatusFriend = "not_friends";
        } else {
            throw new Error(`Status not found`);
        }

        let friendIndex = user.friends.findIndex(friend => 
            friend.friendId.equals(new ObjectId(friendId)));
        if (friendIndex === -1) {
            user.friends.push({ friendId, status: newStatusUser });
        } else {
            user.friends[friendIndex].status = newStatusUser;
        }
        await user.save(); 

        friendIndex = thisFriend.friends.findIndex(friend => 
            friend.friendId.equals(new ObjectId(userId)));
        if (friendIndex === -1) {
            thisFriend.friends.push({ friendId: userId, status: newStatusFriend });
        } else {
            thisFriend.friends[friendIndex].status = newStatusFriend;
        }
        await thisFriend.save(); 
        return { success: true, message: 'Friendship status updated successfully' };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getFriendshipStatus = async (userId, friendId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            return { status: 'not_found' };
        }

        const friend = user.friends.find(friend =>
            friend.friendId && friend.friendId.equals(new ObjectId(friendId)) // השתמש ב-new ObjectId
        );

        if (!friend) {
            return { status: 'not_friends' };
        }

        return { status: friend.status };
    } catch (error) {
        return { status: error.message };
    }
};

const getFriendsList = async (userId) => {
    try {
        const user = await User.findById(userId).populate('friends.friendId', 'name image _id');
        if (!user) {
            return { friends: [] };
        }

        const approvedFriends = user.friends.filter(friend => friend.status === 'approved');

        const approvedFriendsDetails = approvedFriends.map(friend => ({
            id: friend.friendId._id,
            name: friend.friendId.name,
            image: friend.friendId.image
        }));

        return { friends: approvedFriendsDetails };
    } catch (error) {
        console.error("Error fetching approved friends:", error);
        return { friends: [] };
    }
};

const getPendingFriends = async (userId) => {
    try {
        const user = await User.findById(userId).populate('friends.friendId', 'name image _id');
        if (!user) {
            return { friends: [] };
        }

        const pendingFriends = user.friends.filter(friend => friend.status === 'pending');

        const pendingFriendsDetails = pendingFriends.map(friend => ({
            id: friend.friendId._id,
            name: friend.friendId.name,
            image: friend.friendId.image
        }));

        return { friends: pendingFriendsDetails };
    } catch (error) {
        console.error("Error fetching pending friends:", error);
        return { friends: [] };
    }
};

export default {
    getFriendsList,
    getPendingFriends,
    getFriendshipStatus,
    updateFriendshipStatus
}

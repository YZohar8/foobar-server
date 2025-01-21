import friendsServices from "../services/friendsServices.js";
import { ObjectId } from "mongodb";  


const getFriendsList = async (req, res) => {
    let userId = req.params.userId;
    if (!userId) {
        userId = req.params.id;
    }

    try {
        const friends = await friendsServices.getFriendsList(userId);
        return res.status(200).json(friends);
    }
    catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
};

const getPendingFriends = async (req, res) => {
    const userId = req.user.id;

    try {
        const friends = await friendsServices.getPendingFriends(userId);
        return res.status(200).json(friends);
    } catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
};

const getFriendshipStatus = async (req, res) => {
    const userId = req.user.id;
    const { friendId } = req.params;

    try {
        const status = await friendsServices.getFriendshipStatus(userId, friendId);
        return res.status(200).json(status);
    } catch (error) {
        const status = error.code ? error.code : 500;
        return res.status(status).json({ message: error.message });
    }
};

const updateFriendshipStatus = async (req, res) => {
    const userId = req.user.id;
    const { friendId } = req.params;
    const { status } = req.body;

    try {
        await friendsServices.updateFriendshipStatus(userId, friendId, status);
        return res.status(200).json({message: 'done'});
    } catch (error) {
        const result = error.code ? error.code : 500;
        return res.status(result).json({ message: error.message });
    }
}

const delFriendshipStatus = async (req, res) => {
    const userId = req.user.id;
    const { fid, id } = req.params;

    try {
        if (id !== userId) {
            const error = new Error('Unauthorized: ID does not match user ID');
            error.status = 401;
            throw error;
        }

        await friendsServices.updateFriendshipStatus(userId, fid, "not");
        return res.status(200).json({message: 'done'});
    } catch (error) {
        const result = error.code ? error.code : 500;
        return res.status(result).json({ message: error.message });
    }
}

const newFriendshipStatus = async (req, res) => {
    const userId = req.user.id;
    const { fid, id } = req.params;

    try {

        if (id !== userId) {
            const error = new Error('Unauthorized: ID does not match user ID');
            error.status = 401;
            throw error;
        }

        await friendsServices.updateFriendshipStatus(userId, fid, "pending");
        return res.status(200).json({message: 'done'});
    } catch (error) {
        const result = error.code ? error.code : 500;
        return res.status(result).json({ message: error.message });
    }
}

const approvedFriendshipStatus = async (req, res) => {
    const userId = req.user.id;
    const { fid, id } = req.params;

    try {
        if (id !== userId) {
            const error = new Error('Unauthorized: ID does not match user ID');
            error.status = 401;
            throw error;
        }
        
        await friendsServices.updateFriendshipStatus(userId, fid, "approved");
        return res.status(200).json({message: 'done'});
    } catch (error) {
        const result = error.code ? error.code : 500;
        return res.status(result).json({ message: error.message });
    }
}



export default {
    getFriendsList,
    getPendingFriends,
    getFriendshipStatus,
    updateFriendshipStatus,
    delFriendshipStatus,
    newFriendshipStatus, 
    approvedFriendshipStatus
}
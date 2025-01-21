import User from '../models/user.js';
import friendsServices from '../services/friendsServices.js';
import { ObjectId } from "mongodb";  


const isMyFriend = async (req, res, next) => {
    let friendUser = req.params.id;
    const userId = req.user.id; 

    try {
        const user = await User.findById(userId).populate('friends.friendId');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const status = await friendsServices.getFriendshipStatus(userId, friendUser);
        
        if (friendUser.toString() === userId.toString() || status.status === "approved") {
            next(); 
        } else {
            res.status(201).json({ message: 'Not a friend', posts: []});
        }
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong with me', error: error.message });
    }
};

export default {
    isMyFriend
}

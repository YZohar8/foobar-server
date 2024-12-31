import express from 'express';
import friendsController from '../controllers/friendsController.js';
import authToken from '../middleware/tokenMiddleware.js';


const router = express.Router({ mergeParams: true });

router.route('/approved/:userId')
    .get(authToken.authenticateToken, friendsController.getFriendsList);

router.route('/pending')
    .get(authToken.authenticateToken, friendsController.getPendingFriends);

router.route('/status/:friendId')
    .get(authToken.authenticateToken, friendsController.getFriendshipStatus);

router.route('/:friendId')
    .patch(authToken.authenticateToken, friendsController.updateFriendshipStatus);


export default router;


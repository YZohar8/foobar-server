import express from 'express'
import userController from '../controllers/userController.js'
import middlewereToken from '../middleware/tokenMiddleware.js'
import postsMiddlewere from '../middleware/postsMiddlewere.js'
import friendsMiddlewere from '../middleware/friendsMiddlewere.js'
import postsController from '../controllers/postsController.js'
import friendsController from '../controllers/friendsController.js'

const router = express.Router();

router.route('/')
    .post(userController.registerUser)
    .delete(middlewereToken.authenticateToken, userController.deleteUser)
    .patch(middlewereToken.authenticateToken, userController.updateUser);

router.route('/:id')
    .get(middlewereToken.authenticateToken, userController.getUser)
    .delete(middlewereToken.authenticateToken, userController.deleteUser)
    .patch(middlewereToken.authenticateToken, userController.updateUser);

router.route('/:id/posts')
    .get(middlewereToken.authenticateToken, postsMiddlewere.isMyFriend, postsController.getPostsForOneUser);

router.route('/:id/posts/:pid')
    .delete(middlewereToken.authenticateToken, postsController.deletePost)
    .patch(middlewereToken.authenticateToken, postsController.updatePost);

router.route("/:id/friends")
    .get(middlewereToken.authenticateToken, friendsMiddlewere.isMyFriend , friendsController.getFriendsList);

router.route("/:id/friends/:fid")
    .post(middlewereToken.authenticateToken, friendsController.newFriendshipStatus)
    .patch(middlewereToken.authenticateToken, friendsController.approvedFriendshipStatus)
    .delete(middlewereToken.authenticateToken, friendsController.delFriendshipStatus);


export default router;
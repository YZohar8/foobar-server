import express from 'express';
import postController from '../controllers/postsController.js';
import commentsRouter from './commentsRouter.js'
import authToken from '../middleware/tokenMiddleware.js';
import authUser from '../middleware/userMiddleware.js';
import postsMiddlewere from '../middleware/postsMiddlewere.js';


const router = express.Router({ mergeParams: true });

router.route('/search')
    .post(authToken.authenticateToken, postController.getPostsForOneUserWithSearch);

router.route('/search/all')
    .post(authToken.authenticateToken, postController.getPostsWithSerch);

router.route('/all/:id')
    .get(authToken.authenticateToken, postController.getPosts);

router.route('/:id')
    .post(authToken.authenticateToken, authUser.isRealUser, postController.createPost)
    .get(authToken.authenticateToken, postsMiddlewere.isMyFriend,  postController.getPostsForOneUser);


router.route('/:postId')
    .patch(authToken.authenticateToken, authUser.verifyReqUserIsUser, postController.updatePost)
    .delete(authToken.authenticateToken, authUser.verifyReqUserIsUser, postController.deletePost);

router.use("/:postId/comments", commentsRouter);






export default router;
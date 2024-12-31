import express from 'express';
import authToken from '../middleware/tokenMiddleware.js';
import authUser from '../middleware/userMiddleware.js'
import commentsController from '../controllers/commentsController.js';


const router = express.Router({ mergeParams: true });

router.route('/:commentId')
    .delete(authToken.authenticateToken, authUser.userIsAuthorComments, commentsController.deleteComment)
    .patch(authToken.authenticateToken, authUser.userIsAuthorComments, commentsController.updateComment);

router.route('/')
            .post(authToken.authenticateToken, commentsController.createComment)
            .get(authToken.authenticateToken, commentsController.getComments);

export default router;
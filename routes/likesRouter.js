import express from 'express';
import authToken from '../middleware/tokenMiddleware.js';
import likesController from '../controllers/likesController.js';


const router = express.Router({ mergeParams: true });

router.route('/:postId')
            .patch(authToken.authenticateToken, likesController.updateLikes)
            .get(authToken.authenticateToken, likesController.checkUserLike);



export default router;
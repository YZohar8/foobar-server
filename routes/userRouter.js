import express from 'express';
import userController from '../controllers/userController.js'
import middlewereToken from '../middleware/tokenMiddleware.js'

const router = express.Router();

router.route('/')
    .post(userController.registerUser)
    .delete(middlewereToken.authenticateToken, userController.deleteUser)
    .patch(middlewereToken.authenticateToken, userController.updateUser);

router.route('/:id')
    .get(middlewereToken.authenticateToken, userController.getUser);
export default router;
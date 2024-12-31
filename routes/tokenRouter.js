import express from 'express';
import tokenController from '../controllers/tokenController.js'
import auth from '../middleware/tokenMiddleware.js'


const router = express.Router();

router.route('/')
    .post(tokenController.createToken);

router.route('/check')
    .get(auth.authenticateToken, tokenController.checkToken)


export default router;
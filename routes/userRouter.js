import express from 'express';
import userController from '../controllers/userController.js'

const router = express.Router();

router.route('/')
    .post(userController.registerUser);


export default router;
import express from 'express';
import userRouter from './userRouter.js'
import tokenRouter from './tokenRouter.js'
import postRouter from './postsRouter.js'
import friendsRouter from './friendsRouter.js'
import likesRouter from './likesRouter.js'
import commentsRouter from './commentsRouter.js'

const router = express.Router();

router.use("/users", userRouter);
router.use("/tokens", tokenRouter);
router.use("/posts", postRouter);
router.use("/friends", friendsRouter);
router.use("/likes", likesRouter);
router.use("/comments", commentsRouter);


export default router;
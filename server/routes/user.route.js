import {Router} from 'express';
import { getUser } from '../controllers/user.controller.js';
import isAuth from '../middlewares/isAuth.js';
const userRouter = Router()

userRouter.get('/current-user',isAuth,getUser);

export default userRouter;
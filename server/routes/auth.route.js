import {Router} from 'express';
import { googleAuth, logout } from '../controllers/auth.controller.js';
const authRouter = Router()

authRouter.post('/google',googleAuth);
authRouter.get('/logout',logout);

export default authRouter;
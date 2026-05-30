import { Router } from 'express';
import { analyzeResume, finishInterview, generateQuestions, submitAnswer } from '../controllers/interview.controller.js';
import isAuth from '../middlewares/isAuth.js';
import { upload } from '../middlewares/multer.js';

const interviewRouter = Router()

interviewRouter.post('/resume', isAuth, upload.single("resume"), analyzeResume);
interviewRouter.post('/generate-questions', isAuth, generateQuestions);
interviewRouter.post('/submit-answer', isAuth, submitAnswer);
interviewRouter.post('/finish', isAuth, finishInterview);

export default interviewRouter;
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDb from './config/connectDb.js';
import authRouter from './routes/auth.route.js';
import userRouter from './routes/user.route.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port : ${PORT}`);
  connectDb();
});
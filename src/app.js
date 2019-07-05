import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

// routes
import router from './routes/index';
import userRoutes from './routes/user.route';

dotenv.config();
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors('*'));

app.use('/', router);
app.use('/api/v1/users', userRoutes);

export default app;

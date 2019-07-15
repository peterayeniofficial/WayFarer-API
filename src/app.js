import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import Auth from './middleware/Authenticate';

// routes
import router from './routes/index';
import authRoutes from './routes/auth.route';
import tripRoutes from './routes/trip.route';
import bookingsRoutes from './routes/booking.route';
import busRoutes from './routes/bus.route';

dotenv.config();
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors('*'));

app.use('/', router);
app.use('/auth/', authRoutes);
app.use('/', Auth.checkToken, tripRoutes);
app.use('/', Auth.checkToken, bookingsRoutes);
app.use('/', Auth.checkToken, busRoutes);


export default app;

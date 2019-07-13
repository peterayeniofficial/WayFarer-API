import express from 'express';
import Booking from '../controllers/booking.controller';

const router = express.Router();

router.post('/api/v1/bookings', Booking.createBooking);
router.get('/api/v1/bookings/', Booking.getAllBookings);

export default router;

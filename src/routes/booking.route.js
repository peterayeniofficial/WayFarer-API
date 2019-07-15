import express from 'express';
import Booking from '../controllers/booking.controller';

const router = express.Router();

router.post('/bookings', Booking.createBooking);
router.get('/bookings/', Booking.getAllBookings);
router.delete('/bookings/:id', Booking.deleteBooking);

export default router;

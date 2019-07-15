import express from 'express';
import Trip from '../controllers/trip.controller';
// routes
const router = express.Router();

router.post('/trips', Trip.createTrip);
router.get('/trips', Trip.getAllTrips);
router.get('/trips/:id', Trip.getAtrip);
router.patch('/trips/:id', Trip.cancelTrip);

export default router;

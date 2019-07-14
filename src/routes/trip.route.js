import express from 'express';
import Trip from '../controllers/trip.controller';
// routes
const router = express.Router();

router.post('/api/v1/trips', Trip.createTrip);
router.get('/api/v1/trips', Trip.getAllTrips);
router.get('/api/v1/trips/:id', Trip.getAtrip);
router.patch('/api/v1/trips/:id', Trip.cancelTrip);

export default router;

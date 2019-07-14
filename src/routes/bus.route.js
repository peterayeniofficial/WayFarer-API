import express from 'express';
import Bus from '../controllers/bus.controller';
// routes
const router = express.Router();

router.post('/api/v1/bus', Bus.createBus);

export default router;

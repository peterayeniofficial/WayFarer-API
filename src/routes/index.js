import express from 'express';

// routes
const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: 'Welcome to Wayfarer API' });
});

router.post('/', (req, res) => {
    res.json({ message: 'I am here' });
});


export default router;

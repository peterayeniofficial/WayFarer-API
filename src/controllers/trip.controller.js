import moment from 'moment';
import db from '../db';

const Trip = {
    async createTrip(req, res) {
        if (!req.body.origin || !req.body.destination) {
            return res.status(400).json({ status: 'Some values are missing' });
        }
        const query = `INSERT INTO
            trips(bus_id, origin, destination, trip_date, fare, status, user_id)
            VALUES($1, $2, $3, $4, $5, $6, $7)
            returning *`;
        const values = [
            req.body.bus_id,
            req.body.origin,
            req.body.destination,
            moment(new Date()),
            req.body.fare,
            req.body.status,
            req.user.id,
        ];
        try {
            const { rows } = await db.query(query, values);
            return res.status(201).json({
                status: 'success',
                data: rows[0],
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                error,
            });
        }
    },

    async getAllTrips(req, res) {
        const query = 'SELECT * FROM trips WHERE user_id = $1';

        try {
            const { rows } = await db.query(query, [req.user.id]);
            return res.status(200).json({
                status: 'success',
                data: rows,
            });
        } catch (error) {
            return res.json({
                status: 'error',
                error,
            });
        }
    },

    async getAtrip(req, res) {
        const query = 'SELECT * FROM trips WHERE id = $1 AND user_id = $2';
        const values = [req.params.id, req.user.id];
        try {
            const { rows } = await db.query(query, values);
            if (!rows[0]) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Trip not found',
                });
            }
            return res.status(200).json({
                status: 'success',
                data: rows[0],
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                error,
            });
        }
    },
};

export default Trip;

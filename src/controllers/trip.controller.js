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
            return res.json(error);
        }
    },
};

export default Trip;

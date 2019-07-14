import moment from 'moment';
import db from '../config/connection.db';

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
                is_admin: req.user.is_admin,
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
                is_admin: req.user.is_admin,
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
                is_admin: req.user.is_admin,
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                error,
            });
        }
    },

    async cancelTrip(req, res) {
        const expectedStatus = ['cancelled', 'active'];
        if (!expectedStatus.includes(req.body.status)) {
            return res.status(400).json({
                status: 'error',
                message: 'You can only pass active or cancelled to status',
            });
        }
        if (!req.body.status) {
            return res.status(400).json({
                status: 'error',
                message: 'Please provide a Status',
            });
        }
        const tripToUpdate = 'SELECT * From trips WHERE id=$1 AND user_id=$2';
        const updateTrip = `UPDATE trips
            SET bus_id=$1, origin=$2, destination=$3, trip_date=$4, fare=$5,
            status=$6
            WHERE id=$7 AND user_id=$8 returning *`;
        const values = [req.params.id, req.user.id];
        try {
            const { rows } = await db.query(tripToUpdate, values);
            if (!rows[0]) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Trip not found',
                });
            }
            const updateValues = [
                req.body.bus_id || rows[0].bus_id,
                req.body.origin || rows[0].origin,
                req.body.destination || rows[0].destination,
                moment(new Date()),
                req.body.fare || rows[0].fare,
                req.body.status || rows[0].status,
                req.params.id,
                req.user.id,
            ];
            const response = await db.query(updateTrip, updateValues);
            return res.status(200).json({
                status: 'success',
                message: 'Trip cancelled successfully',
                data: response.rows[0],
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

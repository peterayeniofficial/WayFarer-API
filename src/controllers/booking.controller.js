import moment from 'moment';
import db from '../config/connection.db';

const Booking = {
    async createBooking(req, res) {
        if (!req.body.trip_id || !req.user.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Some value are missing',
            });
        }

        const query = `INSERT INTO
            bookings(trip_id, user_id, seat_number, created_on)
            values($1, $2, $3, $4)
            returning *`;

        const values = [
            req.body.trip_id,
            req.user.id,
            req.body.seat_number,
            moment(new Date()),
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

    async getAllBookings(req, res) {
        const allBookingAdmin = `
        SELECT bookings.id as booking_id, bookings.user_id, bookings.trip_id, 
        users.first_name, trips.trip_date, trips.bus_id, bookings.created_on,
        users.last_name, users.email, users.is_admin, bookings.seat_number 
        FROM users                                                                                                                       
        INNER JOIN bookings ON bookings.user_id = users.id                                                                               
        INNER JOIN trips ON bookings.trip_id = trips.id                                                                                  
        `;
        const isAdmin = [req.user.is_admin];

        const allBookingUser = `
        SELECT bookings.id as booking_id, bookings.user_id, bookings.trip_id, 
        users.first_name, trips.trip_date, trips.bus_id, bookings.created_on,
        users.last_name, users.email, users.is_admin, bookings.seat_number 
        FROM users                                                                                                                       
        INNER JOIN bookings ON bookings.user_id = users.id                                                                               
        INNER JOIN trips ON bookings.trip_id = trips.id
        WHERE booking.user_id = $1                                                                          
        `;

        const values = [req.user.id];

        try {
            if (isAdmin) {
                const { rows } = await db.query(allBookingAdmin);
                if (!rows) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Booking not found',
                    });
                }
                return res.status(200).json({
                    status: 'success',
                    data: rows,
                });
            }
            const { rows } = await db.query(allBookingUser, values);
            if (!rows) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Booking not found',
                });
            }
            return res.status(200).json({
                status: 'success',
                data: rows,
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                error,
            });
        }
    },

    async deleteBooking(req, res) {
        const isAdmin = [req.user.is_admin];
        let deleteQuery = '';
        let values = [];

        if (isAdmin) {
            deleteQuery = 'DELETE FROM bookings WHERE id = $1 returning *';
            values = [req.params.id];
        } else {
            deleteQuery = 'DELETE FROM bookings WHERE id = $1 AND bookings.user_id = $2 returning *';
            values = [req.params.id, req.user.id];
        }

        try {
            const { rows } = await db.query(deleteQuery, values);
            if (rows[0]) {
                return res.status(204).json({
                    status: 'success',
                    data: { message: 'Booking deleted successfully' },
                });
            }
            return res.status(400).json({
                status: 'error',
                message: 'Booking not found',
            });
        } catch (error) {
            return res.status(400).json({
                status: 'error',
                error,
            });
        }
    },

};

export default Booking;

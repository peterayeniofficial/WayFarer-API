import moment from 'moment';
import db from '../db';

const Booking = {
    async createBooking(req, res) {
        if (!req.body.trip_id || !req.user.id) {
            return res.status(400).json({
                status: 'error',
                message: 'Some value are missing',
            });
        }

        const query = `INSERT INTO
            bookings(trip_id, user_id, created_on)
            values($1, $2, $3)
            returning *`;

        const values = [
            req.body.trip_id,
            req.user.id,
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
        users.last_name, users.email, users.is_admin 
        FROM users                                                                                                                       
        INNER JOIN bookings ON bookings.user_id = users.id                                                                               
        INNER JOIN trips ON bookings.trip_id = trips.id                                                                                  
        `;
        const isAdmin = [req.user.is_admin];

        const allBookingUser = `
        SELECT bookings.id as booking_id, bookings.user_id, bookings.trip_id, 
        users.first_name, trips.trip_date, trips.bus_id, bookings.created_on,
        users.last_name, users.email, users.is_admin 
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

};

export default Booking;

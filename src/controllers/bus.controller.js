import db from '../config/connection.db';

const Bus = {
    async createBus(req, res) {
        if (!req.body.number_plate || !req.body.manufacturer) {
            return res.status(400).json({ status: 'Some values are missing' });
        }
        const query = `INSERT INTO
            buses(number_plate, manufacturer, model, capacity, year)
            VALUES($1, $2, $3, $4, $5)
            returning *`;
        const values = [
            req.body.number_plate,
            req.body.manufacturer,
            req.body.model,
            req.body.capacity,
            req.body.year,
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
};

export default Bus;

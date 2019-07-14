import jwt from 'jsonwebtoken';
import db from '../../config/connection.db';

const Authenticate = {
    async checkToken(req, res, next) {
        const token = req.headers['x-access-token'];
        if (!token) {
            return res.status(400).send({ status: 'No Token provided' });
        }

        try {
            const decodedToken = await jwt.verify(token, process.env.SECRET);
            const query = 'SELECT * FROM users WHERE id = $1';
            const { rows } = await db.query(query, [decodedToken.userId]);
            if (!rows[0]) {
                return res.status(400).send({
                    status: 'error',
                    message: 'The token provided is invalid',
                });
            }
            req.user = {
                id: decodedToken.userId,
                is_admin: rows[0].is_admin,
            };
            next();
        } catch (error) {
            return res.status(400).send(error);
        }
    },
};

export default Authenticate;

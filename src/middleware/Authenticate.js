import jwt from 'jsonwebtoken';
import db from '../db';

const Authenticate = {
    async checkToken(req, res, next) {
        const token = req.headers['x-access-token'];
        if (!token) {
            req.status(400).send({ status: 'No Token provided' });
        }

        try {
            const decodedToken = await jwt.verify(token, process.env.SECRET);
            const text = 'SELECT * FROM users WHERE id = $1';
            const { rows } = await db.query(text, [decodedToken.userId]);
            if (!rows[0]) {
                return res.status(400).send({ status: 'The token provided is invalid' });
            }
            req.user = { id: decodedToken.userId };
            next();
        } catch (error) {
            return res.status(400).send(error);
        }
    },
};

export default Authenticate;

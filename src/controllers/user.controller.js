import moment from 'moment';
import db from '../db';
import utils from '../utils';

const UserController = {

    async signup(req, res) {
        // check
        if (!req.body.email || !req.body.password) {
            return res.status(400).json({ message: 'Some values are missing' });
        }

        if (!utils.checkIsValidEmail(req.body.email)) {
            return res.status(400).json({ message: 'Please provide a valid email' });
        }
        const hashPassword = utils.hashPassword(req.body.password);

        const text = `INSERT INTO
            users(first_name, last_name, email, password, is_admin, created_on)
            VALUES($1, $2, $3, $4, $5, $6)
            returning *`;
        const values = [
            req.body.first_name,
            req.body.last_name,
            req.body.email,
            hashPassword,
            req.body.is_admin,
            moment(new Date()),
        ];
        console.log(values);
        try {
            const { rows } = await db.query(text, values);
            console.log(rows);
            const token = utils.generateToken(rows[0].id);
            return res.json({
                status: 'success',
                token,
                data: rows,
            }).status(201);
        } catch (error) {
            console.log(error);
            return res.status(400).json({
                error,
            });
        }
    },

};

export default UserController;

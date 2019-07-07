/* eslint-disable camelcase */
import moment from 'moment';
import db from '../db';
import utils from '../utils';

const UserController = {

    async signup(req, res) {
        // check
        const {
            first_name, last_name, email, is_admin,
        } = req.body;

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
            first_name,
            last_name,
            email,
            hashPassword,
            is_admin,
            moment(new Date()),
        ];

        try {
            const { rows } = await db.query(text, values);
            const token = utils.generateToken(rows[0].id);
            return res.status(201).send({
                message: 'success',
                token,
                data: rows[0],
            });
        } catch (error) {
            if (error.routine === '_bt_check_unique') {
                return res.status(400).send({ message: 'User with that EMAIL already exist' });
            }
            return res.status(400).send(error);
        }
    },

};

export default UserController;

/* eslint-disable camelcase */
import db from '../config/connection.db';
import utils from '../utils';

const UserAuth = {

    async signup(req, res) {
        const {
            first_name, last_name, email, is_admin, password,
        } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Some values are missing' });
        }

        if (!utils.checkIsValidEmail(email)) {
            return res.status(400).json({ message: 'Please provide a valid email' });
        }
        const hashPassword = utils.hashPassword(password);
        const text = `INSERT INTO
            users(first_name, last_name, email, password, is_admin)
            VALUES($1, $2, $3, $4, $5)
            returning *`;
        const values = [first_name, last_name, email, hashPassword, is_admin];

        try {
            const { rows } = await db.query(text, values);
            const token = utils.generateToken(rows[0].id);
            return res.status(201).send({
                status: 'success',
                data: rows[0],
                token,
            });
        } catch (error) {
            if (error.routine === '_bt_check_unique') {
                return res.status(400).send({ message: 'User with that EMAIL already exist' });
            }
            return res.status(400).send(error);
        }
    },

    async signin(req, res) {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ status: 'Some values are missing' });
        }

        if (!utils.checkIsValidEmail(email)) {
            return res.status(400).send({ status: 'Please provide a valid email' });
        }

        const text = 'SELECT * FROM users WHERE email = $1';
        try {
            const { rows } = await db.query(text, [email]);
            if (!rows[0]) {
                return res.status(400).send({ status: 'Email or Password is incorrect' });
            }
            if (!utils.comparePassword(rows[0].password, password)) {
                return res.status(400).send({ status: 'The Password is incorrect' });
            }
            const token = utils.generateToken(rows[0].id);
            return res.status(200).send({
                status: 'success',
                token,
                data: rows[0],
            });
        } catch (error) {
            return res.status(400).send(error);
        }
    },


};

export default UserAuth;

import db from '../db';
import utils from '../utils/'

const UserController = {

    async signup(req, res) {
        // check
        if (!req.body.email || !req.body.password) {
            return res.status(400).send({'message': 'Some values are missing'});
        }

        if (!utils.checkIsValidEmail(req.body.email)) {
            return res.status(400).send({'message': 'Please provide a valide email'});
        }
        const hashPassword = utils.hashPassword(req.body.password);

        const text = `INSERT INTO
            users(first_name, last_name, email, password, is_admin)
            VALUES($1, $2, $3, $4, $5)
            returning *`;
        const values = [
            req.body.first_name,
            req.body.last_name,
            req.body.email,
            hashPassword,
            req.body.is_admin,
        ];
        try {
            const { rows } = await db.query(text, values);
            const token = utils.generateToken(rows[0].id);
            return res.status(201).send({
                status: 'success',
                token,
            });
        } catch (error) {
            if (error.routine === '_bt_check_unique') {
                return res.status(400).send({'message': 'User with that EMAIL already exist'})
            }
            return res.status(400).send({
                error,
            });
        }
    },

};

export default UserController;

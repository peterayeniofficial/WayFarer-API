import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// database connection
const pool = new Pool({
    connectionString: process.env.DEV_DB,
});

export default {
    // Method to Query Database
    // to be used in the controller
    query(text, params) {
        return new Promise((resolve, reject) => {
            pool.query(text, params)
                .then((res) => {
                    resolve(res);
                })
                .catch((err) => {
                    reject(err);
                });
        });
    },
};

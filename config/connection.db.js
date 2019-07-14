import dotenv from 'dotenv';

const pg = require('pg');


dotenv.config();

// database connection
const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
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

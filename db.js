const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.on('connect', () => {
    console.log('connected to the db successfully');
});

/**
 * Create Tables
 */

const createTables = () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS
    users(
        id BIGSERIAL NOT NULL PRIMARY KEY,
        email VARCHAR(150) NOT NULL UNIQUE,
        first_name VARCHAR(120) NOT NULL,
        last_name VARCHAR(120) NOT NULL,
        password VARCHAR(250) NOT NULL,
        is_admin BOOLEAN

        )`;

    pool.query(queryText)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

const dropTables = () => {
    const queryText = 'DROP TABLE IF EXISTS users';
    pool.query(queryText)
        .then((res) => {
            console.log(res);
            pool.end();
        })
        .catch((err) => {
            console.log(err);
            pool.end();
        });
};

pool.on('remove', () => {
    console.log('client removed');
    process.exit(0);
});

module.exports = {
    createTables,
    dropTables,
};

require('make-runnable');

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

        ),
    buses(
        id BIGSERIAL NOT NULL,
        number_plate VARCHAR(12) NOT NULL UNIQUE,
        manufacturer VARCHAR(100) NOT NULL,
        model VARCHAR(25) NOT NULL,
        year DATE NOT NULL,
        capacity INTEGER NOT NULL,
        PRIMARY KEY (id)
    ),
    trips(
        id BIGSERIAL NOT NULL,
        bus_id int NOT NULL,
        origin VARCHAR(100) NOT NULL,
        destination VARCHAR(100) NOT NULL,
        trip_date timestamp DEFAULT CURRENT_TIMESTAMP,
        fare DECIMAL NOT NULL,
        status VARCHAR(9) CHECK ( status IN ('active', 'cancelled')) DEFAULT 'active'
        PRIMARY KEY (id),
        FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
    ),
    bookings(
        id BIGSERIAL NOT NULL,
        trip_id int NOT NULL,
        user_id int Not NULL,
        created_on timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
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
    const queryText = 'DROP TABLE IF EXISTS users, busses, trips, bookings';
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

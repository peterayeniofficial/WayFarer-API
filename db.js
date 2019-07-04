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
 * Create Tables #167097129
 */

const createUserTable = () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS
    users(
        id BIGSERIAL PRIMARY KEY,
        first_name VARCHAR(120) NOT NULL,
        last_name VARCHAR(120) NOT NULL,
        email VARCHAR(150) NOT NULL UNIQUE,
        password VARCHAR(250) NOT NULL,
        is_admin boolean,
        created_on timestamp
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

const createBusTable = () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS
    buses(
        id BIGSERIAL PRIMARY KEY,
        number_plate VARCHAR(12) NOT NULL UNIQUE,
        manufacturer VARCHAR(100) NOT NULL,
        model VARCHAR(25) NOT NULL,
        year date NOT NULL,
        capacity integer NOT NULL
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

const createTripTable = () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS
    trips(
        id BIGSERIAL PRIMARY KEY,
        bus_id integer NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
        origin VARCHAR(100) NOT NULL,
        destination VARCHAR(100) NOT NULL,
        trip_date timestamp,
        fare numeric NOT NULL,
        status VARCHAR(10) NOT NULL DEFAULT 'active'::VARCHAR CHECK (status::text = ANY (ARRAY['active'::character varying, 'cancelled'::character varying]::text[]))
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

const createBookingTable = () => {
    const queryText = `
    CREATE TABLE IF NOT EXISTS
    bookings(
        id BIGSERIAL PRIMARY KEY,
        trip_id integer NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
        user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_on timestamp
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

const createAllTables = () => {
    createUserTable();
    createBusTable();
    createTripTable();
    createBookingTable();
};


/**
 * Drop Tables #167097129
 */

const dropUserTable = () => {
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

const dropBusTable = () => {
    const queryText = 'DROP TABLE IF EXISTS buses';
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

const dropTripTable = () => {
    const queryText = 'DROP TABLE IF EXISTS trips';
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

const dropBookingTable = () => {
    const queryText = 'DROP TABLE IF EXISTS bookings';
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

const dropAllTables = () => {
    dropUserTable();
    dropBusTable();
    dropTripTable();
    dropBookingTable();
};

module.exports = {
    createAllTables,
    dropAllTables,
    createBookingTable,
};

require('make-runnable');

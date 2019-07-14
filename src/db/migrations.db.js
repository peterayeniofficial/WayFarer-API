const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DEV_DB,
});

pool.on('connect', () => {
    console.log('connected to the db');
});

const createUsersTable = () => {
    const queryText = `CREATE TABLE IF NOT EXISTS users(
        id BIGSERIAL PRIMARY KEY,
        first_name character varying(120) NOT NULL,
        last_name character varying(120) NOT NULL,
        email character varying(150) NOT NULL UNIQUE,
        password character varying(250) NOT NULL,
        is_admin boolean NOT NULL DEFAULT true
    );
    INSERT INTO users (first_name, last_name, email, password, is_admin)
    VALUES ('Peter', 'Ayeni', 'ayenicology@gmail.com', 
    '$2b$08$tfzZ8qabFdjhC7/pyw0ZsuabFVMNL2Nem7qWNLQyAm1uil2DjzAeS', true)`;

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
    const queryText = `CREATE TABLE IF NOT EXISTS buses(
        id BIGSERIAL PRIMARY KEY,
        number_plate character varying(12) NOT NULL UNIQUE,
        manufacturer character varying(100) NOT NULL,
        model character varying(25) NOT NULL,
        capacity integer NOT NULL,
        year integer NOT NULL
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
    const queryText = `CREATE TABLE IF NOT EXISTS trips(
        id BIGSERIAL PRIMARY KEY,
        bus_id integer NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
        origin character varying(100) NOT NULL,
        destination character varying(100) NOT NULL,
        trip_date timestamp without time zone,
        fare numeric NOT NULL,
        status character varying(10) NOT NULL DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying::text, 'cancelled'::character varying::text])),
        user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE
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
    const queryText = `CREATE TABLE IF NOT EXISTS bookings(
        id BIGSERIAL PRIMARY KEY,
        trip_id integer NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
        user_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        seat_number SMALLINT NOT NULL,
        created_on timestamp without time zone
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

/**
 * Drop Table
 */
const dropUserTable = () => {
    const queryText = 'DROP TABLE IF EXISTS users CASCADE';
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

const dropTripsTable = () => {
    const queryText = 'DROP TABLE IF EXISTS trips CASCADE';
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

const dropBusesTable = () => {
    const queryText = 'DROP TABLE IF EXISTS buses CASCADE';
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

const dropBookingsTable = () => {
    const queryText = 'DROP TABLE IF EXISTS bookings CASCADE';
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
    createUsersTable,
    createBusTable,
    createTripTable,
    createBookingTable,
    dropUserTable,
    dropTripsTable,
    dropBusesTable,
    dropBookingsTable,
};

require('make-runnable');

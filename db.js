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
        id BIGSERIAL PRIMARY KEY,
        email character varying(150) NOT NULL UNIQUE,
        first_name character varying(120) NOT NULL,
        last_name character varying(120) NOT NULL,
        password character varying(250) NOT NULL,
        is_admin boolean

        ),
    buses(
        id BIGSERIAL PRIMARY KEY,
        number_plate character varying(12) NOT NULL UNIQUE,
        manufacturer character varying(100) NOT NULL,
        model character varying(25) NOT NULL,
        year date NOT NULL,
        capacity integer NOT NULL
    ),
    trips(
        id SERIAL PRIMARY KEY,
        bus_id integer NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
        origin character varying(100) NOT NULL,
        destination character varying(100) NOT NULL,
        trip_date date NOT NULL DEFAULT '2019-07-04'::date,
        fare numeric NOT NULL,
        status character varying(10) NOT NULL DEFAULT 'active'::character varying CHECK (status::text = ANY (ARRAY['active'::character varying, 'cancelled'::character varying]::text[]))
    ),
    bookings(
        id BIGSERIAL PRIMARY KEY,
        email character varying(150) NOT NULL UNIQUE,
        first_name character varying(120) NOT NULL,
        last_name character varying(120) NOT NULL,
        password character varying(250) NOT NULL,
        is_admin boolean
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

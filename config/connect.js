import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const pool = new Pool({
    connectionString: process.env.DEV_DB,
});

export default pool;

// db.js
const { Pool } = require('pg');
require('dotenv').config();

// Create a new connection pool using environment variables
// This allows the Application to talk to PostgreSQL
const pool = new Pool({
  user: process.env.PORTFOLIO_DB_USER,
  password: process.env.PORTFOLIO_DB_PASSWORD,
  host: process.env.PORTFOLIO_DB_HOST,
  port: process.env.PORTFOLIO_DB_PORT,
  database: process.env.PORTFOLIO_DB_NAME,
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;

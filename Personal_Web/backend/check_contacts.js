const pool = require('./db');
pool.query('CREATE TABLE IF NOT EXISTS contacts (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL, message TEXT NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)', (err, res) => {
  if(err) console.error(err);
  else console.log('Contacts table ensured');
  process.exit(0);
});

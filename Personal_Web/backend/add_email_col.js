const pool = require('./db');

// Run a quick script to alter the existing table and inject your email 
pool.query('ALTER TABLE hero ADD COLUMN IF NOT EXISTS email VARCHAR(255);', (err, res) => {
  if(err) {
      console.error("Failed to alter table:", err);
  } else {
      console.log("Successfully added 'email' column to the 'hero' table!");
      
      // Seed an initial email address just so it's not null immediately
      pool.query(`UPDATE hero SET email = 'chalakasamith@gmail.com' WHERE id = 1`, (err2) => {
          if(err2) console.error("Failed to seed initial email:", err2);
          else console.log("Seeded initial email.");
          process.exit(0);
      });
  }
});

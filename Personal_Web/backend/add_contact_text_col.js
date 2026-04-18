const pool = require('./db');

const defaultText = "I'm currently seeking new opportunities as a Backend/DevOps Engineer. Whether you have a question or just want to say hi, I'll try my best to get back to you!";

// Run a quick script to alter the existing table and inject the contact text column
pool.query('ALTER TABLE hero ADD COLUMN IF NOT EXISTS contact_text TEXT;', (err, res) => {
  if(err) {
      console.error("Failed to alter table:", err);
  } else {
      console.log("Successfully added 'contact_text' column to the 'hero' table!");
      
      // Seed the initial paragraph text
      pool.query(`UPDATE hero SET contact_text = $1 WHERE id = 1`, [defaultText], (err2) => {
          if(err2) console.error("Failed to seed initial contact text:", err2);
          else console.log("Seeded initial contact text.");
          process.exit(0);
      });
  }
});

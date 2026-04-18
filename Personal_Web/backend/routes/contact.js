// routes/contact.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import our database connection

// POST request to save a new contact message
// Endpoint: /api/contact
router.post('/', async (req, res) => {
  try {
    // 1. Get data from the frontend request
    const { name, email, message } = req.body;

    // 2. Validate data
    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please provide all required fields' });
    }

    // 3. Insert data into PostgreSQL database
    // We use parameterization ($1, $2, $3) to prevent SQL Injection attacks
    const newContact = await pool.query(
      'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    );

    // 4. Send a success response back to the frontend
    res.status(201).json({ 
        message: 'Message sent successfully!',
        data: newContact.rows[0]
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error while saving contact message' });
  }
});

module.exports = router;

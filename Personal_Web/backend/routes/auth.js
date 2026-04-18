const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // 1. Check if user exists
        const userResult = await pool.query('SELECT * FROM admin_users WHERE username = $1', [username]);
        
        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const user = userResult.rows[0];

        // 2. Compare the provided password with the hashed password in the DB
        const validPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // 3. Generate a JWT Token
        // The token payload contains the user ID and username
        // The secret should be securely stored in .env
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET || 'fallback_secret_key', // Always use an env variable in production!
            { expiresIn: '12h' } // Token expires in 12 hours
        );

        // 4. Send token back to the frontend
        res.json({ 
            message: 'Login successful', 
            token 
        });

    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

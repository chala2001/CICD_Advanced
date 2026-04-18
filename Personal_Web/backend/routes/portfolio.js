// routes/portfolio.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Import our database connection

// GET request to fetch the entire portfolio data
// Endpoint: /api/portfolio
router.get('/', async (req, res) => {
  try {
    // We run multiple queries to get data from all our portfolio tables.
    // We use LIMIT 1 for hero and about since there is only one user profile.
    const heroResult = await pool.query('SELECT * FROM hero LIMIT 1');
    const aboutResult = await pool.query('SELECT * FROM about LIMIT 1');
    const skillsResult = await pool.query('SELECT * FROM skills');
    const projectsResult = await pool.query('SELECT * FROM projects');
    const experienceResult = await pool.query('SELECT * FROM experience');

    // Helper function to safely parse PostgreSQL text arrays
    const parseArray = (str) => {
        if (Array.isArray(str)) return str;
        if (!str) return [];
        if (typeof str === 'string') {
            // If it looks like a PG array string "{a,b}"
            if (str.startsWith('{') && str.endsWith('}')) {
                return str.slice(1, -1).split(',').map(s => s.replace(/(^"|"$)/g, '').trim());
            }
            // If it's just space separated (like what we saw in the terminal output)
            return str.split(' ').filter(Boolean); 
        }
        return [];
    };

    // Combine all the results into a single JSON object to send to the frontend.
    res.json({
        hero: heroResult.rows[0],
        about: {
            ...aboutResult.rows[0],
            interests: parseArray(aboutResult.rows[0]?.interests)
        },
        skills: skillsResult.rows.map(skill => ({
            ...skill,
            items: parseArray(skill.items)
        })),
        projects: projectsResult.rows.map(project => ({
            ...project,
            tech_stack: parseArray(project.tech_stack)
        })),
        experience: experienceResult.rows
    });

  } catch (err) {
    console.error('Error fetching portfolio data:', err.message);
    res.status(500).json({ error: 'Server error while fetching portfolio data' });
  }
});

module.exports = router;

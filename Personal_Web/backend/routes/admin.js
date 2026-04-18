const express = require('express');
const router = express.Router();
const pool = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// ALL routes in this file are protected by the authMiddleware!
router.use(authMiddleware); 

// POST /api/admin/projects
// Add a new project to the database
router.post('/projects', async (req, res) => {
    try {
        const { title, description, tech_stack, github_link, live_demo, architecture_image } = req.body;

        const newProject = await pool.query(
            `INSERT INTO projects (title, description, tech_stack, github_link, live_demo, architecture_image) 
             VALUES ($1, $2, $3, $4, $5, $6) 
             RETURNING *`,
            [title, description, tech_stack, github_link, live_demo, architecture_image]
        );

        res.json(newProject.rows[0]);
    } catch (err) {
        console.error('Error adding project:', err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE /api/admin/projects/:id
// Delete a project from the database
router.delete('/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        const deleteResult = await pool.query(
            'DELETE FROM projects WHERE id = $1 RETURNING *',
            [id]
        );

        if (deleteResult.rowCount === 0) {
            return res.status(404).json({ error: 'Project not found' });
        }

        res.json({ message: 'Project deleted successfully' });
    } catch (err) {
        console.error('Error deleting project:', err.message);
        res.status(500).send('Server Error');
    }
});

// ==========================================
// HERO SECTION
// ==========================================
router.put('/hero', async (req, res) => {
    try {
        // Now also receiving 'email' and 'contact_text' from the frontend Administrative form
        const { name, title, subtitle, github_link, linkedin_link, cv_link, email, contact_text } = req.body;
        // Assuming there is only ever one row with id = 1
        const updateResult = await pool.query(
            `UPDATE hero SET name = $1, title = $2, subtitle = $3, github_link = $4, linkedin_link = $5, cv_link = $6, email = $7, contact_text = $8 
             WHERE id = 1 RETURNING *`,
            [name, title, subtitle, github_link, linkedin_link, cv_link, email, contact_text]
        );
        res.json(updateResult.rows[0]);
    } catch (err) {
        console.error('Error updating hero:', err.message);
        res.status(500).send('Server Error');
    }
});

// ==========================================
// ABOUT SECTION
// ==========================================
router.put('/about', async (req, res) => {
    try {
        const { story, interests, profile_image } = req.body;
        // Assuming there is only ever one row with id = 1
        const updateResult = await pool.query(
            `UPDATE about SET story = $1, interests = $2, profile_image = $3 WHERE id = 1 RETURNING *`,
            [story, interests, profile_image] // interests should be an array
        );
        res.json(updateResult.rows[0]);
    } catch (err) {
        console.error('Error updating about:', err.message);
        res.status(500).send('Server Error');
    }
});

// ==========================================
// SKILLS SECTION
// ==========================================
router.post('/skills', async (req, res) => {
    try {
        const { category, items } = req.body;
        const newSkill = await pool.query(
            'INSERT INTO skills (category, items) VALUES ($1, $2) RETURNING *',
            [category, items] // items should be an array
        );
        res.json(newSkill.rows[0]);
    } catch (err) {
        console.error('Error adding skill:', err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/skills/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { category, items } = req.body;
        const updateResult = await pool.query(
            'UPDATE skills SET category = $1, items = $2 WHERE id = $3 RETURNING *',
            [category, items, id]
        );
        res.json(updateResult.rows[0]);
    } catch (err) {
        console.error('Error updating skill:', err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/skills/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM skills WHERE id = $1', [id]);
        res.json({ message: 'Skill deleted successfully' });
    } catch (err) {
        console.error('Error deleting skill:', err.message);
        res.status(500).send('Server Error');
    }
});

// ==========================================
// PROJECTS SECTION (Existing POST/DELETE, adding PUT)
// ==========================================
router.put('/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, tech_stack, github_link, live_demo, architecture_image } = req.body;
        const updateResult = await pool.query(
            `UPDATE projects SET title = $1, description = $2, tech_stack = $3, github_link = $4, live_demo = $5, architecture_image = $6 
             WHERE id = $7 RETURNING *`,
            [title, description, tech_stack, github_link, live_demo, architecture_image, id]
        );
        res.json(updateResult.rows[0]);
    } catch (err) {
        console.error('Error updating project:', err.message);
        res.status(500).send('Server Error');
    }
});

// ==========================================
// EXPERIENCE SECTION
// ==========================================
router.post('/experience', async (req, res) => {
    try {
        const { title, company, description, timeframe } = req.body;
        const newExp = await pool.query(
            'INSERT INTO experience (title, company, description, timeframe) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, company, description, timeframe]
        );
        res.json(newExp.rows[0]);
    } catch (err) {
        console.error('Error adding experience:', err.message);
        res.status(500).send('Server Error');
    }
});

router.put('/experience/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, company, description, timeframe } = req.body;
        const updateResult = await pool.query(
            'UPDATE experience SET title = $1, company = $2, description = $3, timeframe = $4 WHERE id = $5 RETURNING *',
            [title, company, description, timeframe, id]
        );
        res.json(updateResult.rows[0]);
    } catch (err) {
        console.error('Error updating experience:', err.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/experience/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM experience WHERE id = $1', [id]);
        res.json({ message: 'Experience deleted successfully' });
    } catch (err) {
        console.error('Error deleting experience:', err.message);
        res.status(500).send('Server Error');
    }
});

// ==========================================
// MESSAGES SECTION
// ==========================================
// GET /api/admin/messages
router.get('/messages', async (req, res) => {
    try {
        const messages = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
        res.json(messages.rows);
    } catch (err) {
        console.error('Error fetching messages:', err.message);
        res.status(500).send('Server Error');
    }
});

// DELETE /api/admin/messages/:id
router.delete('/messages/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM contacts WHERE id = $1', [id]);
        res.json({ message: 'Message deleted successfully' });
    } catch (err) {
        console.error('Error deleting message:', err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;

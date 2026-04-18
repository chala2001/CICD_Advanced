// routes/upload.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');

// 1. Configure Multer Storage
// This tells multer WHERE to save the file and WHAT to name it.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Save files to backend/uploads directory
    },
    filename: function (req, file, cb) {
        // Create a unique filename: fieldname-timestamp.extension (e.g. image-1678910123.jpg)
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Initialize multer with the storage configuration
const upload = multer({ storage: storage });

// 2. Define Upload Endpoint
// Endpoint: POST /api/upload
// It is protected by authMiddleware so only the admin can upload files.
// `upload.single('file')` means we expect a single file in a form-data field named 'file'.
router.post('/', authMiddleware, upload.single('file'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        // The file was successfully uploaded.
        // We create the URL that the frontend can use to access this file.
        // req.file.filename contains the unique name we generated above.
        const fileUrl = `/uploads/${req.file.filename}`;

        res.status(200).json({
            message: 'File uploaded successfully',
            fileUrl: fileUrl
        });
    } catch (error) {
        console.error('File upload error:', error);
        res.status(500).json({ error: 'Server error during file upload' });
    }
});

module.exports = router;

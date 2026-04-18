// server.js
// 1. Import necessary modules
const express = require('express'); // The web framework
const cors = require('cors');       // Allows frontend to connect to this API
require('dotenv').config();         // Loads environment variables from .env file

// 2. Initialize the Express application
const app = express();

// 3. Define middleware
// Middleware are functions that run before the final route handler
app.use(cors()); // Enable CORS for all routes (so your React app can fetch data)
app.use(express.json()); // Allow the server to read JSON data from incoming requests

// 4. Import Routes
const contactRoute = require('./routes/contact');
const portfolioRoute = require('./routes/portfolio');
const authRoute = require('./routes/auth');
const adminRoute = require('./routes/admin');
const uploadRoute = require('./routes/upload'); // NEW: Import Upload Route

// 4.1 Serve static files from the 'uploads' directory
// This allows the frontend to access uploaded images directly via URL (e.g. http://localhost:5000/uploads/my-image.jpg)
app.use('/uploads', express.static('uploads'));

app.use('/api/contact', contactRoute);
app.use('/api/portfolio', portfolioRoute);
app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);
app.use('/api/upload', uploadRoute); // NEW: Mount Upload API

// 5. Define a basic route for testing
// When someone visits the root URL ('/'), they will get this message.
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Portfolio Backend API!' });
});

// 6. Start the server
// Use the PORT from the .env file, or default to 5000 if not defined
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

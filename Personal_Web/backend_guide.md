# Complete Guide to Building Your Node.js Backend

Welcome to Phase 1 of your Portfolio Web Application! Since you want to learn Node.js from scratch, this guide will explain every single step, file, and line of code we write for the backend.

## 1. What is Node.js and Express?
* **Node.js** is a runtime environment that allows you to run JavaScript on the server (backend) instead of just in the browser (frontend).
* **Express.js** is a fast, minimalistic web framework for Node.js. It makes building APIs and web server logic much simpler by providing tools to handle HTTP requests (like GET and POST).

## 2. Setting Up the Project
We started by creating a folder for the backend and initializing a Node.js project.

### Commands Used:
```bash
mkdir backend
cd backend
npm init -y
```

**Explanation:**
* `mkdir backend` creates a new directory named `backend`.
* `cd backend` navigates into that directory.
* `npm init -y` initializes a new Node.js project. It creates a `package.json` file. `npm` stands for Node Package Manager, and the `-y` flag tells it to accept all default settings.

### What is `package.json`?
This file is the heart of any Node.js project. It keeps track of details like the project name, version, and most importantly, the **dependencies** (third-party libraries) your project needs to run.

## 3. Installing Dependencies
Next, we installed four packages that make our backend work:

### Command Used:
```bash
npm install express pg cors dotenv
```

**Explanation of Dependencies:**
* **`express`**: The primary web framework used to start the server and route URLs.
* **`pg`**: The PostgreSQL client for Node.js. This allows our backend to talk to the PostgreSQL database.
* **`cors`**: Cross-Origin Resource Sharing. This allows your React frontend (running on one port) to make requests to your Node.js backend (running on another port). Without it, browsers block the request.
* **`dotenv`**: A zero-dependency module that loads environment variables from a `.env` file into `process.env`. This keeps secrets like passwords safe.

## 4. Setting Up the Express Server (`server.js` and `.env`)
We created two files: `.env` and `server.js`.

### The `.env` file
A hidden file (starts with a dot) to store secrets. Right now, it just has one secret: `PORT=5000`. We shouldn't upload this to GitHub.

### The `server.js` file
This is the starting point of our server. Let's break down the code:

```javascript
// 1. Import modules
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 2. Initialize application
const app = express();

// 3. Middlewares
app.use(cors()); // Allow frontend to call the API
app.use(express.json()); // Automatically convert incoming request bodies (like form submissions) to JSON

// 4. Basic Route
// When a user makes a GET request to 'http://localhost:5000/', send back this message.
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Portfolio Backend API!' });
});

// 5. Start listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

To run this file, we use the command `node server.js`.

## 5. Setting up PostgreSQL Connection (`db.js`, `database.sql`, and `docker-compose.yml`)
Instead of installing PostgreSQL directly on your machine, we are using **Docker**. Docker allows you to run software inside isolated containers.

### `docker-compose.yml`
This file tells Docker how to set up our PostgreSQL database:
* It uses the `postgres:15-alpine` image (a lightweight version of Postgres).
* It sets the environment variables (like the username `postgres` and password `password123`).
* It creates a **volume** (`pgdata`), allowing the data to persist even if the container is stopped.
* It maps our local `database.sql` script into the container so it runs automatically when the database is created.

### `database.sql`
This contains the raw SQL code to create the `contacts` table. Since docker creates the `portfolio_db` automatically (based on `docker-compose.yml`), this script just creates the table inside it.

### `db.js`
This file establishes a **Connection Pool**. 
A pool is essentially a group of connections to the database that can be reused for different requests. This is faster and more efficient than creating a brand-new connection every time a user submits a form. We pass the Docker environment variables from `.env` to this pool.
*(Note: We used names like `PORTFOLIO_DB_USER` instead of just `DB_USER` to avoid colliding with any variables already installed on your computer).*

## 6. Creating the Contact API Endpoint (`routes/contact.js`)
We created a folder called `routes` and a file inside it called `contact.js`.
This file is responsible for handling the logic whenever someone tries to submit the "Contact Me" form on your frontend.

### The Code Breakdown:
```javascript
router.post('/', async (req, res) => { ... })
```
This listens for a `POST` request. `async` means the function will handle operations that take time, like talking to a database.

```javascript
const { name, email, message } = req.body;
```
When your frontend sends data (say, what the user typed in), it arrives in `req.body` (Request Body).

```javascript
const newContact = await pool.query(
  'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *',
  [name, email, message]
);
```
Here, we insert the user's data into the database using SQL syntax. 
**Why `$1, $2, $3`?** We use these placeholders instead of writing the variables directly to prevent **SQL Injection** attacks (where hackers insert malicious code into the form). The `pg` library replaces `$1` with `name`, `$2` with `email`, and so on.

### Connecting the Route to the Server
Finally, we updated `server.js` to actually USE this new route:
```javascript
const contactRoute = require('./routes/contact');
app.use('/api/contact', contactRoute);
```
Because of this, whenever someone makes a request to `http://localhost:5000/api/contact`, it will go to the logic written in `routes/contact.js`.

## 7. Serving Portfolio Data from the Database (`routes/portfolio.js`)
Instead of hardcoding your Hero, About, Skills, and Projects directly in React, we made your backend much more powerful by serving this data directly from PostgreSQL.

### What We Changed:
1.  **Updated `database.sql`:** We added new tables (`hero`, `about`, `skills`, `projects`, `experience`) and wrote `INSERT` statements to pre-fill them with your information (like your ESP32 and AWS IoT experience).
2.  **Created `routes/portfolio.js`:** We built a new route that executes five separate database queries at once to gather all your portfolio data.
3.  **Combined the JSON:** Instead of forcing the frontend to make 5 different API calls (which would slow down the website), we combined all the results into a single JSON object.

```javascript
// Excerpt from routes/portfolio.js
const heroResult = await pool.query('SELECT * FROM hero LIMIT 1');
const aboutResult = await pool.query('SELECT * FROM about LIMIT 1');
/* ... other queries ... */

res.json({
    hero: heroResult.rows[0],
    about: aboutResult.rows[0],
    /* ... */
});
```

Because of this, whenever your React app loads, it makes a single `GET` request to `http://localhost:5000/api/portfolio`, receives all the data, and renders the page instantly!

## Phase 1 Complete! 🎉
We successfully tested the API! The backend can now receive contact messages **and** serve all of your portfolio content dynamically. Next up, Phase 2: Frontend!

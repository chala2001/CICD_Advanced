# Modern Full-Stack Developer Portfolio

A premium, dynamic portfolio website built from the ground up to showcase projects, skills, and experience. This is not a static site template—it is a fully functional web application complete with a secure, JWT-authenticated Admin Dashboard to manage all content dynamically via a custom PostgreSQL database.

## ✨ Features

### Public Facing Portfolio
*   **Premium Glassmorphic Design:** Utilizing Tailwind CSS to provide stunning blur effects, translucent cards, subtle gradients, and custom scrollbars. 
*   **Dynamic Sections:** Hero, About, Skills, Experience, and Projects are entirely driven by the database.
*   **Interactive Contact Form:** Messages sent via the public portfolio are intercepted by the custom Node.js backend and saved securely to the database.
*   **Custom Animations:** Features keyframe animations like floating objects, slow pulses, and slide-in reveals.
*   **Responsive:** Fully mobile-friendly grid layouts.

### 🛡️ Secure Admin Dashboard
*   **JWT Authentication:** Protected routes ensure only authorized admins can access or modify the database.
*   **Full CRUD Operations:** Add, Edit, or Delete Skills, Projects, Experience Timeline, and overarching Hero information.
*   **File Upload Support:** Drag-and-drop support for Project architecture images, CV, and Profile Pictures powered by `multer`. All images are stored and served dynamically.
*   **Messages Viewer:** Intercepted web queries from the contact form can be read directly via the Admin dashboard.

## 🛠️ Tech Stack

### Frontend (React + Vite)
*   **React 18:** Functional components and Hooks.
*   **Vite:** Ultra-fast HMR and building.
*   **Tailwind CSS 3:** Utility-first framework heavily customized for "Glassmorphism" and advanced gradients.
*   **Lucide React:** Iconography.
*   **React Router Dom:** SPA Routing for the Admin Dashboard.
*   **Axios:** Easy promise-based HTTP requests to our API.

### Backend (Node.js + Express)
*   **Express.js:** Web server framework.
*   **PostgreSQL:** Relational database (`pg` driver).
*   **JWT (JSON Web Tokens) & Bcrypt:** Secure hashing for admin passwords and stateless session tokens.
*   **Multer:** Multipart/form-data middleware for processing file uploads.
*   **CORS & Dotenv:** Security and environment variable management.

### Deployment & DevOps
*   **Docker:** Full containerization via Docker Desktop.
*   **Docker Compose:** Network orchestration for PostgreSQL, Node API, and an NGINX static web server.
*   **NGINX:** Custom configuration to handle React Router 404 fallbacks gracefully in production.

## 🚀 Getting Started Locally

### Option 1: Using Docker (Easiest)
You can run this entire application locally with a single command if you have Docker Desktop installed.

1. Clone the repository: `git clone https://github.com/yourusername/Personal_Web.git`
2. Navigate to the root directory: `cd Personal_Web`
3. Run Docker Compose:
   ```bash
   docker-compose up --build -d
   ```
4. Visit `http://localhost` (The portfolio will be live!)
5. The Admin dashboard is at `http://localhost/admin/login`

*Note: The default database schemas (Tables) and Admin user are created automatically by the `backend/database.sql` script mounting into the Postgres container on first boot.*

### Option 2: Running Manually (Development)

**1. Database Initialization**
*   You must have PostgreSQL running on your machine.
*   Create a database called `portfolio_db`.
*   Run the schema commands located in `backend/database.sql` to generate the correct tables.

**2. Backend Setup**
```bash
cd backend
npm install
```
*   Create a `.env` file in the `/backend` folder. Ensure it contains:
    ```env
    PORT=5000
    PORTFOLIO_DB_USER=postgres
    PORTFOLIO_DB_PASSWORD=yourpassword
    PORTFOLIO_DB_HOST=127.0.0.1
    PORTFOLIO_DB_PORT=5432
    PORTFOLIO_DB_NAME=portfolio_db
    JWT_SECRET=supersecret123
    ```
*   Start the server: `npm start` (Runs on `localhost:5000`)

**3. Frontend Setup**
```bash
cd frontend
npm install
npm run dev
```
*   The Vite server will start on `localhost:5173`. Make sure your `.env` (if applicable) points to `localhost:5000` for the backend.

## ☁️ Deployment

Check out the included `DEPLOYMENT_GUIDE.md` for full instructions on deploying this stack to the cloud using either **Docker Compose** on Oracle Cloud or the 100% Free Split method (Vercel + Render + Neon).

## 📝 License
This project is completely open source under the MIT License. Feel free to use it for your own personal portfolio.

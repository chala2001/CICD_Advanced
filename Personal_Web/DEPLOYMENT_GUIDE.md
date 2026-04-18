# The Complete Deployment Guide: Personal Portfolio

This guide breaks down exactly how to deploy your Full-Stack React + Node.js + PostgreSQL Portfolio. We have structured this into two options based on our discussion:

1. **Option 1: Complete Docker Compose (All-in-One Server)**
2. **Option 2: The Split Free Tier Method (Vercel, Render, Neon)**

---

## What is Docker? (A Quick Refresher)
Docker allows us to package our application, along with all of its dependencies (Node.js versions, libraries, etc.), into a single standardized unit for software development. 
- **Image:** A blueprint for how to build your app (like a class in programming).
- **Container:** A running instance of an Image (like an object in programming).
- **Docker Compose:** A tool that allows us to run multiple containers (Frontend, Backend, Database) at the exact same time so they can talk to each other inside an isolated virtual network.

---

## 🏗️ 1. Dockerizing Your App (Step-by-Step)

I have created several files in your project to allow it to run in Docker.

### The Backend Dockerfile (`backend/Dockerfile`)
This file tells Docker how to build the Node.js API.
```dockerfile
# 1. Use the lightweight Alpine Linux version of Node.js 18
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy only the package.json files first (to cache dependencies)
COPY package*.json ./

# 4. Install the dependencies
RUN npm install

# 5. Copy the rest of the backend code into the container
COPY . .

# 6. Expose the port the Node API runs on
EXPOSE 5000

# 7. Start the server
CMD ["node", "server.js"]
```

### The Frontend Dockerfile (`frontend/Dockerfile`)
Frontend code needs to be "built" (compiled) in Vite, and then served as static HTML/CSS/JS files using a high-performance web server called Nginx. We use a **Multi-Stage Build** to do this in one file:
```dockerfile
# STAGE 1: Build the React Application
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# This compiles the Vite app into static files in the /dist folder
RUN npm run build

# STAGE 2: Serve using Nginx
FROM nginx:alpine
# Copy the compiled files from STAGE 1 into the Nginx server directory
COPY --from=build /app/dist /usr/share/nginx/html
# Replace default Nginx config with our custom one to fix React Router paths
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Nginx Configuration (`frontend/nginx.conf`)
React uses a "Single Page Architecture" where routing (`/admin`, `/projects`) is handled purely by Javascript. Nginx doesn't know this, so if someone hits refresh on `/admin`, Nginx tries to look for an `admin.html` file and throws a 404 error. This file forces Nginx to route all traffic back to `index.html` so React Router can handle it.

### Docker Compose (`docker-compose.yml`)
Located in the root of your project, this is the "orchestrator". It spins up 3 containers at once:
1. `db`: Runs the official `postgres:13` image, automatically creating a database, username, and password using environment variables. It also mounts your `database.sql` script into `/docker-entrypoint-initdb.d/` so the database automatically creates your tables the very first time it starts.
2. `api`: Builds your Node.js backend using the Dockerfile and connects to the Postgres container.
3. `web`: Builds your Vite frontend, mapping port 80 (standard HTTP) to port 80 inside the container.

### 🚀 How to Run it using Docker Compose (Option 1)
If you secure a virtual machine (like the **Oracle Cloud** or **AWS EC2**) or just want to run the whole finished site on your laptop:
1. Make sure you install Docker Desktop on your machine.
2. Open a terminal in the main `Personal_Web` folder.
3. Run: `docker-compose up --build -d`
4. Visit `http://localhost` (no port needed because Nginx runs on port 80).

---

## ☁️ 2. The Split Free Tier Method (Option 2 - Serverless)

If you don't want to manage Docker servers yourself, you can deploy the pieces to free hosting platforms. 

### Step 1: Database (Neon.tech or Supabase)
1. Create an account on Neon or Supabase.
2. Create a new Postgres Database.
3. Run the SQL commands found in your `backend/database.sql` file natively in their SQL editor to create the tables.
4. Copy the "Connection String" (URI) they give you. It looks like: `postgres://user:password@server.neon.tech/dbname`

### Step 2: Backend API (Render.com)
1. Push your entire `Personal_Web` project to a free GitHub repository.
2. Create an account on Render.com and create a new "Web Service".
3. Connect your GitHub repository.
4. Set the Root Directory to `backend`.
5. Environment Variables: You MUST add `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, and `DB_NAME` based on your Neon connection string, AND your `JWT_SECRET`.
6. Start Command: `node server.js`
7. Render will automatically install dependencies and run your code. They will give you an URL like: `https://your-api.onrender.com`.

### Step 3: Frontend Web App (Vercel.com or Netlify)
Before we deploy the frontend, we must configure it to talk to the new backend URL instead of `localhost:5000`.
1. In your frontend React code, everywhere we used `axios.get('http://localhost:5000/api/...')`, we need to swap `http://localhost:5000` with an Environment Variable (like `import.meta.env.VITE_API_URL`). (Note: We will do this in the code shortly so it is ready for deployment).
2. Go to Vercel.com, connect your GitHub repo, and import the project.
3. Set the Root Directory to `frontend`.
4. In Environment Variables, set `VITE_API_URL` to your new Render link: `https://your-api.onrender.com`.
5. Click Deploy. Vercel automatically detects Vite and builds it securely.

### Summary of Split Method
- Vercel (Frontend) calls Render (API) which securely talks to Neon (Database).
- High availability, excellent free tier limits.

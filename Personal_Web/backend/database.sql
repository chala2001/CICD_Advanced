-- database.sql
-- This script will run automatically when the PostgreSQL Docker container starts.

-- 1. Contact Table (Messages sent through the portfolio website)
CREATE TABLE contacts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Hero Section Table
CREATE TABLE hero (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle TEXT NOT NULL,
    github_link VARCHAR(255),
    linkedin_link VARCHAR(255),
    cv_link VARCHAR(255),
    email VARCHAR(255),
    contact_text TEXT
);

-- 3. About Section Table
CREATE TABLE about (
    id SERIAL PRIMARY KEY,
    story TEXT NOT NULL,
    interests TEXT[] NOT NULL
);

-- 4. Skills Section Table
CREATE TABLE skills (
    id SERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    items TEXT[] NOT NULL
);

-- 5. Projects Section Table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT[] NOT NULL,
    github_link VARCHAR(255),
    live_demo VARCHAR(255),
    architecture_image VARCHAR(255)
);

-- 6. Experience Section Table
CREATE TABLE experience (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    timeframe VARCHAR(100) 
);

-- 7. Admin Users Table (For Secure Dashboard)
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- INSERT INITIAL SEED DATA
-- ==========================================

-- Insert Default Admin (Password is 'admin123' - you should change this later!)
INSERT INTO admin_users (username, password_hash)
VALUES ('admin', '$2b$10$6.xcRdbtydYB.xuQ0q92qecJb5VZtLvKyijhX7IN8UBrhAv95fNei')
ON CONFLICT (username) DO NOTHING;

INSERT INTO hero (name, title, subtitle, github_link, linkedin_link, cv_link) 
VALUES (
    'Your Name', 
    'Computer Engineering Graduate | Backend & DevOps Enthusiast', 
    'I am a recent computer engineering graduate passionate about building robust backend systems, scalable cloud architectures, and efficient CI/CD pipelines.', 
    'https://github.com/yourusername', 
    'https://linkedin.com/in/yourusername', 
    '/cv.pdf'
);

INSERT INTO about (story, interests) 
VALUES (
    'As a computer engineering graduate, I have developed a deep interest in understanding how complex systems operate under the hood. My journey started with programming microcontrollers and has evolved into designing scalable backend applications and deploying them to the cloud. I have strong hands-on experience integrating hardware and cloud solutions, specifically using AWS IoT Core with ESP32 devices to build real-time monitoring systems.', 
    ARRAY['Backend systems', 'Cloud', 'IoT', 'DevOps']
);

INSERT INTO skills (category, items) VALUES 
('Programming', ARRAY['Java', 'Python', 'C', 'JavaScript']),
('Backend', ARRAY['Spring Boot', 'REST APIs', 'JWT Authentication', 'Node.js', 'Express']),
('Frontend', ARRAY['React', 'Tailwind', 'HTML', 'CSS']),
('DevOps', ARRAY['Docker', 'Docker Compose', 'EC2', 'Nginx', 'GitHub Actions']),
('Cloud / IoT', ARRAY['AWS IoT Core', 'MQTT', 'ESP32']);

INSERT INTO projects (title, description, tech_stack, github_link, live_demo, architecture_image) 
VALUES (
    'IoT Sleep Detection System', 
    'A machine-learning-based sleep detection system utilizing ESP32 microcontrollers and AWS IoT Core. Real-time sensor data is communicated via MQTT to a Dockerized backend for processing and analysis.', 
    ARRAY['ESP32', 'AWS IoT Core', 'MQTT', 'Docker', 'Node.js', 'Machine Learning'], 
    'https://github.com/yourusername/iot-sleep-detection', 
    '', 
    '/images/architecture.png'
);

INSERT INTO experience (title, company, description, timeframe)
VALUES (
    'Software Engineering Intern',
    'Tech Company Name',
    'Developed backend REST APIs using Node.js and improved database query performance by 20%. Containerized microservices using Docker for streamlined local development.',
    'May 2025 - Aug 2025'
);

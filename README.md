# CI/CD Pipeline with Jenkins + Docker + Kubernetes + GitHub Webhook

This project demonstrates a complete **CI/CD Pipeline** using:

- Jenkins
- Docker
- Docker Hub
- Kubernetes (Minikube)
- GitHub Webhooks
- Ngrok
- React Frontend
- Node.js / Express Backend
- PostgreSQL Database

The goal of this project is:

> Automatically build, push, and deploy the application to Kubernetes whenever code is pushed to the `main` branch.

---

# Project Architecture

GitHub Push → GitHub Webhook → Jenkins Pipeline → Docker Build → Docker Hub Push → Kubernetes Deployment → Application Live in Browser

---

# Technologies Used

## CI/CD Tools
- Jenkins
- GitHub Webhooks
- Ngrok

## Containerization
- Docker
- Docker Hub

## Orchestration
- Kubernetes
- Minikube
- kubectl

## Application Stack
- Frontend: React + Vite + Nginx
- Backend: Node.js + Express
- Database: PostgreSQL

---

# Project Structure

```bash
CICD_Advanced/
│
├── Jenkinsfile
│
├── Personal_Web/
│   ├── frontend/
│   │   ├── Dockerfile
│   │   ├── nginx.conf
│   │   └── source files
│   │
│   └── backend/
│       ├── Dockerfile
│       └── source files
│
├── k8s/
│   ├── frontend.yaml
│   ├── backend.yaml
│   └── postgres.yaml
│
└── README.md

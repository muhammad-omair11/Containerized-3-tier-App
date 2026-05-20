# ⚡ ShopNow — Dockerized 3-Tier E-Commerce Application

A full-stack e-commerce application built with **React, Node.js/Express, and PostgreSQL**, fully containerized using **Docker** and orchestrated with **Docker Compose**.

---

## 🚀 Tech Stack

- React
- Node.js / Express
- PostgreSQL
- Docker
- Docker Compose
- Nginx

---

## 🏗️ Architecture

Frontend (React + Nginx) → Backend API (Express) → PostgreSQL Database

---

## ✨ Features

- Multi-container Docker setup
- Docker Compose orchestration
- Multi-stage Docker builds
- Nginx reverse proxy
- JWT Authentication
- Persistent PostgreSQL storage
- Healthcheck-based startup sequencing

---

## 📁 Project Structure

```bash
frontend/
backend/
docker-compose.yml
README.md
```

---

## ▶️ Run the Application

```bash
docker compose up --build
```

Access the application:

- Frontend → http://localhost
- Backend API → http://localhost:5000
- PostgreSQL → localhost:5432

---

## 🔧 Useful Commands

```bash
docker compose up -d
docker compose down
docker compose logs -f
docker compose ps
```

---

Muhammad Omair

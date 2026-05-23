# Docker deployment for e-learning project

This repository contains Dockerfiles for the backend (Spring Boot) and frontend (Vite + React) and a `docker-compose.yml` that starts the frontend, backend, and a Postgres database.

Quick start

1. Copy environment variables from `.env.example` to `.env` and adjust if needed.

2. Build and start services:

   docker compose up --build -d

3. Open the frontend at http://localhost and backend at http://localhost:8080

Notes
- The frontend container serves the built SPA via nginx. It proxies /api/ to `http://backend:8080/api/` inside the compose network.
- The backend Dockerfile uses the Maven wrapper to build the Spring Boot fat JAR and runs it with OpenJDK 17.
- The compose file includes a Postgres DB. If your backend uses a different DB or requires other env vars, update `docker-compose.yml` and `.env` accordingly.
- Uploaded files are mounted from the host `./uploads` into the backend container at `/app/uploads`.

Troubleshooting
- If the backend cannot connect to the DB, double-check `.env` values and that the `db` service is healthy.
- To view logs:

  docker compose logs -f backend

  docker compose logs -f frontend

Advanced
- For production builds you may want to add a non-root nginx user, tune JVM options via the `JAVA_OPTS` env var, and enable HTTPS with a reverse proxy or with certbot in front of nginx.

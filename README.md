**Pet Care AI**

- **Project:** Full-stack pet-care assistant with reminders, billing, auth, and pet services.
- **Repo layout:** Monorepo containing `backend/`, `frontend/`, and shared `libs/`.

**Quick Start**

- **Prerequisites:**
  - Docker & Docker Compose installed
  - Node.js (16+ recommended) and `npm` or `pnpm`
  - Angular CLI (optional for local frontend dev): `npm i -g @angular/cli`

- **Start everything (recommended):**

```powershell
docker-compose up --build
```

This builds and runs the backend services and frontend (if configured) via `docker-compose.yml`.

**If you want to run pieces locally (dev):**

- Backend (run individual service):
  - Example: API Gateway
  ```powershell
  cd backend/api-gateway
  npm install
  # use either dev or start script (project has `npm run dev` or `npm start`)
  npm run dev
  ```
  - For other backend services, follow the same pattern under `backend/` or `reminders-service/`, `auth-services/`, `pet-services/`, `billing-service/` where present.

- Frontend (Angular dev server):
  ```powershell
  cd frontend
  npm install
  npm start
  # or
  ng serve --open
  ```

**Project Overview**

- **Backend:** Located under `backend/`, `auth-services/`, `pet-services/`, `reminders-service/`, etc. Key pieces:
  - `backend/api-gateway`: central gateway, middleware, and route registration.
  - `auth-services`: user auth, JWT, and DB connectivity.
  - `reminders-service`: scheduling and storage for reminders.
  - `billing-service`, `pet-services`: domain-specific microservices (where present).

- **Frontend:** An Angular single-page app in `frontend/` with the main application under `frontend/src/app` and environment files under `frontend/src/environments`.

- **Libraries:** Shared types and utilities in `libs/common` used by services and frontend.

**Environments & Config**

- Environment files: frontend uses `frontend/src/environments/environment.ts` and `environment.development.ts`.
- Backend services typically read config from `.env` or `process.env`. Check each service's `src/config.ts` or similar.
- The repo includes `scripts/generate-env.js` to help generate environment files for local work. Run it from the repo root if needed:

```powershell
node scripts/generate-env.js
```

**Running & Developing**

- Useful commands (PowerShell):
  - Build & run all services with Docker Compose: `docker-compose up --build`
  - Stop everything: `docker-compose down`
  - Run a backend service locally:
    ```powershell
    cd backend/api-gateway
    npm install
    npm run dev    # or npm start
    ```
  - Run frontend dev server:
    ```powershell
    cd frontend
    npm install
    npm start      # or ng serve --open
    ```

**Testing & Linting**

- Each package may include tests and lint scripts in its `package.json`. From a service folder run:

```powershell
npm test
npm run lint
```

**Logging & Observability**

- Backend uses lightweight logging utilities under `backend/.../utils/logger.ts`. Logs from Docker Compose are available in container stdout — use `docker-compose logs -f` to stream.

**Repository Structure (short)**

- `backend/` - API gateway and service glue
- `auth-services/` - authentication + DB models
- `pet-services/` - pet domain microservice(s)
- `reminders-service/` - reminders scheduler + storage
- `frontend/` - Angular application
- `libs/common` - shared types and utilities

**Deployment (Render & Vercel)**

- **Overview:** This repo includes `render.yaml` and Dockerfiles for backend services. You can deploy backend services to Render (or any container host) and the frontend to Vercel (recommended for Angular SPAs). Render can also host static frontends if you prefer a single provider.

- **Render — backend services (Docker or native builds):**
  - Connect your GitHub/GitLab repo to Render and create a **Web Service** for each backend service.
  - Choose **Docker** and point to the service folder `backend/api-gateway` (or other service folder) if you have a `Dockerfile` there. Alternatively choose the **Node** builder and provide the start command.
  - Set environment variables in the Render dashboard (matching each service's `.env` or `process.env` keys). Use the repo's `render.yaml` as a template for service settings if present.
  - Health checks: configure a health check path (e.g., `/health`) if your service exposes one.
  - Deploy steps (manual):

```text
# Example (local image build + push) - optional
docker build -t <registry>/myorg/api-gateway:latest backend/api-gateway
docker push <registry>/myorg/api-gateway:latest
# Update Render service to use the new image or let Render build from the repo on push
```

- **Vercel — frontend (Angular):**
  - Connect your GitHub/GitLab/Bitbucket repo to Vercel and create a new project.
  - In project settings set the **Root Directory** to `frontend`.
  - Set the **Build Command** to `npm run build` (or `ng build --configuration=production`).
  - Set the **Output Directory** to `dist/smart-pet-care-client` (this repo's Angular project name is `smart-pet-care-client`).
  - Add any required environment variables under the Vercel project settings (e.g., API base URL, keys).
  - Vercel will run the build and serve the static files; automatic preview deployments run for PRs by default.

- **Hosting frontend on Render (alternative):**
  - Create a **Static Site** on Render, set the repo and the build command (`npm install && npm run build`) and the publish directory to `dist/smart-pet-care-client`.
  - Or host frontend files in any static hosting (S3/CloudFront, Netlify, etc.).

- **Environment variables & secrets:**
  - Keep secrets out of repo — use Render and Vercel dashboards to store them.
  - For local testing, use `scripts/generate-env.js` or `.env` files per service.

- **CI/CD tips:**
  - Let Render/Vercel build from the repository on pushes to `main` for automated deploys.
  - For multi-service coordination, use a CI pipeline that builds backend images, pushes them to a registry, and updates Render services (or rely on Render's repo builds).


**Troubleshooting**

- If a service fails to start, check logs:

```powershell
docker-compose logs <service-name>
```

- If environment variables are missing, re-run `node scripts/generate-env.js` or create `.env` files per-service.

**Contributing**

- To add a service:
  - Create a new folder under the repo root with a `package.json`, `Dockerfile`, and `src/`.
  - Register routes with the API gateway or add a new compose service entry.

- Please open PRs against `main` with a short description and checklist for manual verification steps.

**Useful Links & Contacts**

- Project root: `c:/Users/msintnic/OneDrive - Unit4/RandD/pet-care-ai/`
- If you need help or access to services, contact the repo owner or the engineering team.

---

If you want, I can also:
- split this into `README-frontend.md` and `README-backend.md` (one-per-service style), or
- add per-service quickstart commands and exact `npm` script names after you confirm which scripts exist in each `package.json`.

File updated: `README.md` (repo root)

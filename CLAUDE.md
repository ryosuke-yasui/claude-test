# CLAUDE.md

## Architecture

Full-stack web application with three services:

- **Backend**: FastAPI (Python) — `backend/`
- **Frontend**: Next.js (TypeScript) — `frontend/`
- **Database**: PostgreSQL

All services are containerized with Docker and orchestrated via Docker Compose.

## Package & Dependency Management

- **Python**: Use `uv` for all package management (`uv add`, `uv run`, never `pip`)
- **Node.js**: Use `pnpm` for all package management (`pnpm add`, never `npm` or `yarn`)

## Frontend Tooling

- **Framework**: Next.js (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State management**: Zustand (client), TanStack Query (server state)
- **Forms**: React Hook Form + Zod
- **Linting/Formatting**: ESLint + Prettier (via `pnpm lint`, `pnpm format`)

## Backend Tooling

- **Linter/Formatter**: Ruff (`ruff check`, `ruff format`)
- **Type checker**: mypy
- **Testing**: pytest

## Docker

- Each service has its own `Dockerfile`
- `docker-compose.yml` at project root orchestrates all services
- Use named volumes for PostgreSQL data persistence
- Backend connects to Postgres (not SQLite — current SQLite usage is temporary)

## Git Hooks (pre-commit)

Linting and formatting run automatically before every commit via pre-commit hooks:

- **Backend**: `ruff format` then `ruff check --fix`
- **Frontend**: `prettier --write` then `eslint --fix`

Install hooks after cloning: `pre-commit install`

## Common Commands

```bash
# Start all services
docker compose up

# Backend (from backend/)
uv run uvicorn main:app --reload

# Frontend (from frontend/)
pnpm dev

# Lint & format backend
uv run ruff format .
uv run ruff check --fix .

# Lint & format frontend
pnpm format
pnpm lint
```

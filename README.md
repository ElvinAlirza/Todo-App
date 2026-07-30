# Advanced ToDo App

A full-stack ToDo application where users register, log in, and manage their own personal tasks with deadlines. Each user can only see, edit, and delete their own todos — full user data isolation is enforced on the backend.

## About the Project

The backend exposes a REST API for authentication (register/login with JWT) and full CRUD task management (create, read, update, delete), with deadline tracking on each todo. The frontend is a React (Vite) single-page app that consumes this API, providing login/register screens and a task dashboard with filtering (All / Active / Completed / Overdue), sorting, and visual deadline status indicators (🟢 on track, 🟡 due soon, 🔴 overdue).

## Tech Stack

**Backend** (`Backend/`)
- Node.js + Express 5
- PostgreSQL
- Prisma ORM (`@prisma/client`, `@prisma/adapter-pg`)
- Authentication: JWT (`jsonwebtoken`)
- Password hashing: `bcryptjs`
- Dev tooling: `nodemon`, `dotenv`

**Frontend** (`Frontend/`)
- React
- Vite
- React Router (`react-router-dom`)
- Plain `fetch` for API calls, JWT stored in `localStorage`

## Team Members & Roles

| Name  | Role     | Responsibilities                                   |
|-------|----------|-----------------------------------------------------|
| Elvin | Backend  | Database schema, Prisma setup, Auth (JWT/bcrypt), Todo CRUD API, API documentation |
| Omar  | Frontend | Login/Register UI, Task dashboard, Deadline indicators, API integration |

## Project Structure

```
Todo-App/
├── Backend/          # Express + Prisma REST API
├── Frontend/         # React + Vite client
├── API.md            # Full API reference
└── README.md          # This file
```

## Local Setup & Running Instructions

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL running locally (or accessible remotely)

### 2. Clone the repository
```bash
git clone https://github.com/ElvinAlirza/Todo-App.git
cd Todo-App
```

### 3. Backend setup

```bash
cd Backend
npm install
```

**Set up the database**

Create a PostgreSQL database (default name used in this project: `tododb`):
```bash
createdb tododb
```

You have two options to set up the tables:

**Option A — Using Prisma migrations (recommended)**
```bash
npx prisma migrate dev
```

**Option B — Using the raw SQL script**
```bash
psql -U <your_db_user> -d tododb -f init.sql
```
`init.sql` is kept in sync with the Prisma migration and creates the same schema directly.

**Environment variables**

Copy the example file and fill in your own values:
```bash
cp .env.example .env
```

`.env.example`:
```
DATABASE_URL="postgresql://<db_user>@localhost:5432/tododb?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
PORT=3000
```

**Generate the Prisma Client**
```bash
npx prisma generate
```

**Run the backend server**
```bash
npm run dev
```
The server starts on `http://localhost:3000` (or the `PORT` you set), with `nodemon` auto-restarting on file changes.

For production-style startup (no auto-restart):
```bash
npm run start
```

### 4. Frontend setup

Open a second terminal:

```bash
cd Frontend
npm install
```

**Environment variables**

Create a `.env` file in `Frontend/`:
```
VITE_API_URL=http://localhost:3000
```

**Run the frontend dev server**
```bash
npm run dev
```
Vite will start the app, by default at `http://localhost:5173`.

### 5. Using the app

1. Open `http://localhost:5173` in your browser.
2. Register a new account, then log in.
3. Create, edit, complete, and delete your todos with optional deadlines.
4. Use the filter tabs (All / Active / Completed / Overdue) and sorting to organize your list.

## API Documentation

See [API.md](./API.md) for the full list of endpoints, request/response formats, status codes, and error format.

Quick summary:

| Method     | Endpoint             | Description                  | Auth required |
|------------|-----------------------|-------------------------------|----------------|
| POST       | `/api/auth/register` | Register a new user           | No             |
| POST       | `/api/auth/login`    | Log in, returns a JWT          | No             |
| GET        | `/api/todos`         | Get all of the user's todos    | Yes (Bearer)   |
| POST       | `/api/todos`         | Create a new todo              | Yes (Bearer)   |
| PUT/PATCH  | `/api/todos/:id`     | Update a todo                  | Yes (Bearer)   |
| DELETE     | `/api/todos/:id`     | Delete a todo                  | Yes (Bearer)   |

## Git Workflow

- `main` — stable, tested version. No direct pushes.
- `dev` — main development branch.
- `feature/backend-*`, `feature/frontend-*` — individual feature branches, merged into `dev` via reviewed pull requests, then `dev` is merged into `main` when ready.

# Advanced ToDo App

A full-stack ToDo application where users register, log in, and manage their own personal tasks with deadlines. Each user can only see, edit, and delete their own todos — full user data isolation is enforced on the backend.

## About the Project

The backend exposes a REST API for authentication (register/login with JWT) and full CRUD task management (create, read, update, delete), with deadline tracking on each todo. The frontend (in progress) will consume this API to provide login/register screens and a task dashboard with filtering, sorting, and deadline status indicators (overdue / due soon / on track).

## Tech Stack

**Backend**
- Node.js + Express 5
- PostgreSQL
- Prisma ORM (`@prisma/client`, `@prisma/adapter-pg`)
- Authentication: JWT (`jsonwebtoken`)
- Password hashing: `bcryptjs`
- Dev tooling: `nodemon`, `dotenv`

**Frontend**
- In progress (not yet part of this repository)

## Team Members & Roles

| Name  | Role     | Responsibilities                                   |
|-------|----------|-----------------------------------------------------|
| Elvin | Backend  | Database schema, Prisma setup, Auth (JWT/bcrypt), Todo CRUD API, API documentation ``|``
| Omar  | Frontend | Login/Register UI, Task dashboard, Deadline indicators, API integration |

## Local Setup & Running Instructions

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL running locally (or accessible remotely)

### 2. Clone and install dependencies
```bash
git clone <repository-url>
cd Backend
npm install
```

### 3. Set up the database

Create a PostgreSQL database (default name used in this project: `tododb`):
```bash
createdb tododb
```

You have two options to set up the tables:

**Option A — Using Prisma migrations (recommended)**
```bash
npx prisma migrate dev
```
This applies the migration history in `prisma/migrations/` and creates the `User` and `Todo` tables automatically.

**Option B — Using the raw SQL script**
```bash
psql -U <your_db_user> -d tododb -f init.sql
```
`init.sql` is kept in sync with the Prisma migration and creates the same schema directly.

### 4. Environment variables

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

### 5. Generate the Prisma Client
```bash
npx prisma generate
```

### 6. Run the server
```bash
npm run dev
```
The server starts on `http://localhost:3000` (or the `PORT` you set), with `nodemon` auto-restarting on file changes.

For production-style startup (no auto-restart):
```bash
npm run start
```

## API Documentation

See [API.md](./API.md) for the full list of endpoints, request/response formats, status codes, and error format.

Quick summary:

| Method | Endpoint            | Description                  | Auth required |
|--------|---------------------|-------------------------------|----------------|
| POST   | `/api/auth/register`| Register a new user           | No             |
| POST   | `/api/auth/login`   | Log in, returns a JWT          | No             |
| GET    | `/api/todos`        | Get all of the user's todos    | Yes (Bearer)   |
| POST   | `/api/todos`        | Create a new todo              | Yes (Bearer)   |
| PUT    | `/api/todos/:id`    | Update a todo                  | Yes (Bearer)   |
| DELETE | `/api/todos/:id`    | Delete a todo                  | Yes (Bearer)   |

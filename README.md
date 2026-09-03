# Student Management System

A full-stack Student Management System for managing students, departments,
courses, and enrollments — built with React (Vite + Tailwind CSS) on the
frontend and Node.js/Express + MySQL on the backend.

## Features

- **Authentication** — JWT-based login with role-based access (Admin, Staff)
- **Dashboard** — student/department/course/enrollment counts, a status
  breakdown chart, and recent activity
- **Student management** — full CRUD, with search, filtering (department,
  status), sorting, and pagination
- **Department management** — full CRUD (Admin only for mutations)
- **Course management** — full CRUD, filterable by department
- **Enrollment management** — many-to-many student↔course enrollment, with
  duplicate-enrollment prevention
- **User management** — Admin-only account management (create, edit,
  delete, change role, activate/deactivate)
- **Consistent UX** — loading states, empty states, inline validation, and
  toast notifications across every screen

## Technology Stack

- **Frontend:** React, Vite, Tailwind CSS, React Router, Axios
- **Backend:** Node.js, Express, MySQL2, JWT, bcryptjs, dotenv, CORS
- **Database:** MySQL 8

## Project Structure

```
student-management-system/
│
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI (Button, Table, Modal, etc.)
│   │   ├── pages/          # One folder per resource (students, courses, …)
│   │   ├── layouts/        # MainLayout (sidebar+navbar), AuthLayout
│   │   ├── hooks/          # useAuth, useToast, useResourceList
│   │   ├── services/       # Axios wrappers per API resource
│   │   ├── context/        # AuthContext, ToastContext
│   │   └── utils/          # getErrorMessage
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/         # MySQL connection pool
│   │   ├── controllers/    # HTTP request/response per resource
│   │   ├── middleware/     # JWT auth, role-based authorization
│   │   ├── models/         # Parameterized SQL queries
│   │   ├── routes/         # Route → controller mapping
│   │   ├── services/       # Business logic and validation
│   │   ├── utils/          # AppError, catchAsync, query/db helpers
│   │   └── app.js          # Express app, middleware, error handler
│   └── package.json
│
├── database/
│   ├── schema.sql          # Tables, constraints, indexes
│   └── seed.sql            # Demo data
│
└── README.md
```

## Database Architecture

- **users** — Admin/Staff accounts with bcrypt-hashed passwords.
- **departments** — referenced by both `students` and `courses`.
- **students** — belongs to one department (`department_id`).
- **courses** — belongs to one department (`department_id`).
- **enrollments** — many-to-many join table between `students` and
  `courses`, with a `UNIQUE` constraint on
  `(student_id, course_id, semester, academic_year)` that prevents
  duplicate enrollments at the database level, not just in application code.

Deleting a department that still has students or courses is blocked
(`ON DELETE RESTRICT`) to avoid orphaned records. Deleting a student or
course cascades to remove their enrollment history (`ON DELETE CASCADE`),
since an enrollment record has no meaning without both sides of the
relationship.

## API Endpoints

All endpoints except `/api/auth/login` and `/api/auth/logout` require an
`Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|--------------|
| POST | `/api/auth/login` | Public | Log in, returns a JWT + user |
| POST | `/api/auth/logout` | Public | Stateless no-op for the client |
| GET | `/api/auth/me` | Authenticated | Returns the current user profile |

### Departments — `/api/departments`

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/`, `/:id` | Any logged-in user |
| POST | `/` | Admin only |
| PUT | `/:id` | Admin only |
| DELETE | `/:id` | Admin only |

Query params on `GET /`: `search`, `page`, `limit`, `sortBy` (`name`,
`created_at`, `updated_at`), `order` (`asc`/`desc`).

### Courses — `/api/courses`

Same access pattern as Departments. Additional query param:
`department_id` to filter by department.

### Students — `/api/students`

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/`, `/:id` | Any logged-in user |
| POST | `/` | Admin, Staff |
| PUT | `/:id` | Admin, Staff |
| DELETE | `/:id` | Admin only |

Query params on `GET /`: `search`, `department_id`, `status`
(`Active`/`Inactive`/`Graduated`), `page`, `limit`, `sortBy`, `order`.

### Enrollments — `/api/enrollments`

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | `/`, `/:id` | Any logged-in user |
| POST | `/` | Admin, Staff |
| PUT | `/:id` | Admin, Staff |
| DELETE | `/:id` | Admin, Staff |

Query params on `GET /`: `student_id`, `course_id`, `status`, `page`,
`limit`, `sortBy`, `order`. Duplicate enrollment for the same
student/course/semester/academic year returns `409 Conflict`.

### Users — `/api/users`

All routes require the **Admin** role — Staff cannot view or manage
system users.

### Dashboard — `/api/dashboard/stats`

`GET`, any logged-in user. Returns student counts by status,
department/course/enrollment totals, and the 5 most recent students and
enrollments.

## Prerequisites

- Node.js 18+
- npm 9+
- MySQL 8 running locally (or accessible remotely)

## Installation

### 1. Database setup

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql
```

`schema.sql` creates the `student_management` database and all five
tables with foreign keys, unique constraints, and indexes. `seed.sql`
adds realistic demo data (5 departments, 12 students, 11 courses, 17
enrollments, and 2 login accounts — see [Demo Credentials](#demo-credentials)).

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your MySQL credentials and a JWT secret
npm run dev
```

The API starts on `http://localhost:5000`. Verify it's running:

```bash
curl http://localhost:5000/api/health
```

A healthy response looks like:
`{"success":true,"message":"API is running","database":"connected"}`

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

The app starts on `http://localhost:5173`.

## Environment Variables

**`backend/.env`**

| Variable | Description |
|----------|--------------|
| `PORT` | Port the API listens on (default `5000`) |
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` | MySQL connection |
| `JWT_SECRET` | Secret used to sign JWTs — use a long, random value |
| `JWT_EXPIRES_IN` | Token lifetime (default `1d`) |
| `CORS_ORIGIN` | Allowed frontend origin (default `http://localhost:5173`) |

**`frontend/.env`**

| Variable | Description |
|----------|--------------|
| `VITE_API_URL` | Base URL of the backend API (default `http://localhost:5000/api`) |

Never commit a real `.env` file — both are already excluded via `.gitignore`.

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@school.edu` | `Admin@123` |
| Staff | `staff@school.edu` | `Staff@123` |

Admins have full access to every resource, including user management.
Staff can view everything and manage students/enrollments, but cannot
manage departments, courses, or system users, and cannot delete students.

## Troubleshooting

**Backend won't start / `ECONNREFUSED` to MySQL**
Confirm MySQL is running and the credentials in `backend/.env` are
correct. Test the connection directly: `mysql -u <DB_USER> -p -h <DB_HOST>`.

**`/api/health` returns `"database":"connected"` missing or a 500**
The server is up but can't reach MySQL — double-check `DB_NAME` matches
the database created by `schema.sql` (`student_management`), and that
the DB user has privileges on it
(`GRANT ALL PRIVILEGES ON student_management.* TO '<user>'@'%';`).

**Frontend shows "Unable to load data" everywhere**
Usually means the frontend can't reach the backend. Check
`VITE_API_URL` in `frontend/.env` and that the backend is actually
running on that port.

**Login succeeds but you're immediately redirected back to `/login`**
Check the backend's `CORS_ORIGIN` matches the frontend's actual origin
(`http://localhost:5173` by default) — a mismatch causes the browser to
block the response, which the frontend interprets as an auth failure.

**"A record with this value already exists" on create**
This means a unique field (department name, course code, student ID,
student email, or user email) is already taken — the message is
intentionally generic rather than naming the exact column, to keep the
error handler simple across all resources.

**Deleting a department or course fails with "cannot be deleted because
other records depend on it"**
This is intentional — departments/courses with students or courses
attached can't be deleted until those are reassigned or removed first.

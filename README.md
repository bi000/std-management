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



## Prerequisites

- Node.js 18+
- npm 9+
- MySQL 8 running locally (or accessible remotely)

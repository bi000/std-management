-- =============================================================
-- Student Management System — Database Schema
-- MySQL 8
--
-- Table creation order matters: a table can only reference (FK)
-- another table that already exists, so parent tables (users,
-- departments) are created before the tables that depend on them
-- (students, courses), and the many-to-many join table
-- (enrollments) is created last.
-- =============================================================

CREATE DATABASE IF NOT EXISTS student_management
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE student_management;

-- -------------------------------------------------------------
-- users
-- System accounts (Admin / Staff) that can log in to the app.
-- -------------------------------------------------------------
CREATE TABLE users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(150)  NOT NULL UNIQUE,
  -- Stores a bcrypt hash, never the plaintext password.
  password      VARCHAR(255)  NOT NULL,
  role          ENUM('Admin', 'Staff') NOT NULL DEFAULT 'Staff',
  status        ENUM('Active', 'Inactive') NOT NULL DEFAULT 'Active',
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Login looks users up by email, so an index here keeps
-- authentication fast as the table grows.
CREATE INDEX idx_users_email ON users (email);

-- -------------------------------------------------------------
-- departments
-- -------------------------------------------------------------
CREATE TABLE departments (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  name          VARCHAR(100)  NOT NULL UNIQUE,
  description   TEXT,
  created_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- -------------------------------------------------------------
-- students
-- -------------------------------------------------------------
CREATE TABLE students (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  -- Human-facing identifier (e.g. "STU-2024-001"), distinct from the
  -- internal auto-increment `id` used for foreign keys.
  student_id        VARCHAR(20)   NOT NULL UNIQUE,
  first_name        VARCHAR(100)  NOT NULL,
  last_name         VARCHAR(100)  NOT NULL,
  email             VARCHAR(150)  NOT NULL UNIQUE,
  phone             VARCHAR(20),
  date_of_birth     DATE,
  gender            ENUM('Male', 'Female', 'Other'),
  address           VARCHAR(255),
  department_id     INT,
  enrollment_date    DATE,
  status            ENUM('Active', 'Inactive', 'Graduated') NOT NULL DEFAULT 'Active',
  created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                  ON UPDATE CURRENT_TIMESTAMP,
  -- RESTRICT (the default) prevents deleting a department that still
  -- has students, avoiding orphaned records that silently lose their
  -- department context.
  CONSTRAINT fk_students_department
    FOREIGN KEY (department_id) REFERENCES departments (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_students_department_id ON students (department_id);
CREATE INDEX idx_students_status ON students (status);
-- Supports name-based search/sorting on the student list page.
CREATE INDEX idx_students_last_name ON students (last_name);

-- -------------------------------------------------------------
-- courses
-- -------------------------------------------------------------
CREATE TABLE courses (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  course_code     VARCHAR(20)   NOT NULL UNIQUE,
  course_name     VARCHAR(150)  NOT NULL,
  description     TEXT,
  credit_hours    TINYINT UNSIGNED NOT NULL,
  department_id   INT,
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_courses_department
    FOREIGN KEY (department_id) REFERENCES departments (id)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  -- Credit hours outside a realistic range almost always indicate a
  -- data-entry mistake rather than a legitimate course.
  CONSTRAINT chk_courses_credit_hours CHECK (credit_hours BETWEEN 1 AND 10)
) ENGINE=InnoDB;

CREATE INDEX idx_courses_department_id ON courses (department_id);

-- -------------------------------------------------------------
-- enrollments
-- Join table implementing the Student <-> Course many-to-many
-- relationship, with extra columns describing each enrollment.
-- -------------------------------------------------------------
CREATE TABLE enrollments (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  student_id        INT           NOT NULL,
  course_id         INT           NOT NULL,
  enrollment_date   DATE          NOT NULL,
  semester          ENUM('Fall', 'Spring', 'Summer') NOT NULL,
  academic_year     VARCHAR(9)    NOT NULL COMMENT 'e.g. 2024-2025',
  status            ENUM('Active', 'Completed', 'Dropped') NOT NULL DEFAULT 'Active',
  created_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                                  ON UPDATE CURRENT_TIMESTAMP,
  -- If a student or course record is deleted, its enrollment history
  -- is no longer meaningful on its own, so it cascades away with it.
  CONSTRAINT fk_enrollments_student
    FOREIGN KEY (student_id) REFERENCES students (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_enrollments_course
    FOREIGN KEY (course_id) REFERENCES courses (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  -- Enforces "no duplicate enrollment for the same student, course,
  -- semester, and academic year" at the database level, so this rule
  -- holds even if application-layer validation is ever bypassed.
  CONSTRAINT uq_enrollment_unique
    UNIQUE (student_id, course_id, semester, academic_year)
) ENGINE=InnoDB;

CREATE INDEX idx_enrollments_student_id ON enrollments (student_id);
CREATE INDEX idx_enrollments_course_id ON enrollments (course_id);
CREATE INDEX idx_enrollments_status ON enrollments (status);

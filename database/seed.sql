-- =============================================================
-- Student Management System — Seed Data
-- Realistic demo/development data for local testing.
--
-- Insert order follows the schema's foreign key dependencies:
-- users and departments first (no dependencies), then students
-- and courses (depend on departments), then enrollments
-- (depends on both students and courses).
-- =============================================================

USE student_management;

-- -------------------------------------------------------------
-- users
-- Passwords are bcrypt hashes (cost factor 10), generated ahead
-- of time — never store or seed plaintext passwords.
--   admin@school.edu / Admin@123
--   staff@school.edu / Staff@123
-- -------------------------------------------------------------
INSERT INTO users (name, email, password, role, status) VALUES
  ('Alice Morgan', 'admin@school.edu', '$2a$10$M6ACBYQUdQQayZpEN0AYM.WWJIFtNHhDiehHnwVGb/qRENkBCiRq2', 'Admin', 'Active'),
  ('Brian Chen', 'staff@school.edu', '$2a$10$j2sPEbl1cCQs4T38xySxaeoMVxYRc0irskgQNJTqqiy6OjsPG6ZtK', 'Staff', 'Active');

-- -------------------------------------------------------------
-- departments
-- -------------------------------------------------------------
INSERT INTO departments (name, description) VALUES
  ('Computer Science', 'Studies in software, algorithms, and computing systems'),
  ('Mathematics', 'Pure and applied mathematics'),
  ('Business Administration', 'Management, finance, and entrepreneurship'),
  ('Electrical Engineering', 'Circuits, electronics, and power systems'),
  ('Biology', 'Life sciences and biological research');

-- -------------------------------------------------------------
-- students
-- department_id references the insert order above:
-- 1=CS, 2=Math, 3=Business, 4=EE, 5=Biology
-- -------------------------------------------------------------
INSERT INTO students
  (student_id, first_name, last_name, email, phone, date_of_birth, gender, address, department_id, enrollment_date, status)
VALUES
  ('STU-2024-001', 'Emma', 'Johnson', 'emma.johnson@student.edu', '555-0101', '2003-04-12', 'Female', '12 Maple St, Springfield', 1, '2022-09-01', 'Active'),
  ('STU-2024-002', 'Liam', 'Smith', 'liam.smith@student.edu', '555-0102', '2002-11-30', 'Male', '45 Oak Ave, Springfield', 1, '2021-09-01', 'Active'),
  ('STU-2024-003', 'Olivia', 'Williams', 'olivia.williams@student.edu', '555-0103', '2003-07-19', 'Female', '78 Pine Rd, Springfield', 2, '2022-09-01', 'Active'),
  ('STU-2024-004', 'Noah', 'Brown', 'noah.brown@student.edu', '555-0104', '2001-02-25', 'Male', '23 Birch Ln, Springfield', 3, '2020-09-01', 'Graduated'),
  ('STU-2024-005', 'Ava', 'Jones', 'ava.jones@student.edu', '555-0105', '2003-09-08', 'Female', '89 Cedar Ct, Springfield', 4, '2022-09-01', 'Active'),
  ('STU-2024-006', 'Elijah', 'Garcia', 'elijah.garcia@student.edu', '555-0106', '2002-05-14', 'Male', '34 Elm St, Springfield', 5, '2021-09-01', 'Active'),
  ('STU-2024-007', 'Sophia', 'Martinez', 'sophia.martinez@student.edu', '555-0107', '2004-01-22', 'Female', '56 Walnut Ave, Springfield', 1, '2023-09-01', 'Active'),
  ('STU-2024-008', 'Lucas', 'Davis', 'lucas.davis@student.edu', '555-0108', '2003-12-03', 'Male', '67 Chestnut Rd, Springfield', 2, '2022-09-01', 'Inactive'),
  ('STU-2024-009', 'Mia', 'Rodriguez', 'mia.rodriguez@student.edu', '555-0109', '2002-08-17', 'Female', '90 Spruce Ln, Springfield', 3, '2021-09-01', 'Active'),
  ('STU-2024-010', 'Mason', 'Wilson', 'mason.wilson@student.edu', '555-0110', '2001-10-29', 'Male', '11 Aspen Ct, Springfield', 4, '2020-09-01', 'Graduated'),
  ('STU-2024-011', 'Isabella', 'Anderson', 'isabella.anderson@student.edu', '555-0111', '2004-03-11', 'Female', '22 Willow St, Springfield', 5, '2023-09-01', 'Active'),
  ('STU-2024-012', 'James', 'Taylor', 'james.taylor@student.edu', '555-0112', '2003-06-27', 'Male', '33 Poplar Ave, Springfield', 1, '2022-09-01', 'Active');

-- -------------------------------------------------------------
-- courses
-- -------------------------------------------------------------
INSERT INTO courses (course_code, course_name, description, credit_hours, department_id) VALUES
  ('CS101', 'Introduction to Programming', 'Fundamentals of programming using Python', 3, 1),
  ('CS201', 'Data Structures and Algorithms', 'Core data structures and algorithmic thinking', 4, 1),
  ('CS301', 'Database Systems', 'Relational database design and SQL', 3, 1),
  ('MATH101', 'Calculus I', 'Limits, derivatives, and integrals', 4, 2),
  ('MATH201', 'Linear Algebra', 'Vector spaces, matrices, and transformations', 3, 2),
  ('BUS101', 'Principles of Management', 'Foundations of organizational management', 3, 3),
  ('BUS201', 'Financial Accounting', 'Introduction to financial statements and accounting principles', 3, 3),
  ('EE101', 'Circuit Analysis', 'Fundamentals of electrical circuits', 4, 4),
  ('EE201', 'Digital Electronics', 'Logic gates, digital systems, and microcontrollers', 3, 4),
  ('BIO101', 'General Biology', 'Introduction to cellular and molecular biology', 3, 5),
  ('BIO201', 'Genetics', 'Principles of heredity and genetic variation', 3, 5);

-- -------------------------------------------------------------
-- enrollments
-- student_id / course_id reference insert order above (1-based).
-- -------------------------------------------------------------
INSERT INTO enrollments (student_id, course_id, enrollment_date, semester, academic_year, status) VALUES
  (1, 1, '2023-09-05', 'Fall', '2023-2024', 'Completed'),
  (1, 2, '2024-01-15', 'Spring', '2023-2024', 'Active'),
  (2, 1, '2021-09-05', 'Fall', '2021-2022', 'Completed'),
  (2, 3, '2024-01-15', 'Spring', '2023-2024', 'Active'),
  (3, 4, '2022-09-05', 'Fall', '2022-2023', 'Completed'),
  (3, 5, '2024-01-15', 'Spring', '2023-2024', 'Active'),
  (4, 6, '2020-09-05', 'Fall', '2020-2021', 'Completed'),
  (4, 7, '2021-01-15', 'Spring', '2020-2021', 'Completed'),
  (5, 8, '2022-09-05', 'Fall', '2022-2023', 'Active'),
  (6, 10, '2021-09-05', 'Fall', '2021-2022', 'Completed'),
  (6, 11, '2024-01-15', 'Spring', '2023-2024', 'Active'),
  (7, 1, '2023-09-05', 'Fall', '2023-2024', 'Active'),
  (8, 4, '2022-09-05', 'Fall', '2022-2023', 'Dropped'),
  (9, 6, '2021-09-05', 'Fall', '2021-2022', 'Completed'),
  (10, 9, '2020-09-05', 'Fall', '2020-2021', 'Completed'),
  (11, 10, '2023-09-05', 'Fall', '2023-2024', 'Active'),
  (12, 2, '2024-01-15', 'Spring', '2023-2024', 'Active');

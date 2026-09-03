import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

import StudentList from './pages/students/StudentList';
import StudentForm from './pages/students/StudentForm';
import StudentDetails from './pages/students/StudentDetails';

import DepartmentList from './pages/departments/DepartmentList';
import DepartmentForm from './pages/departments/DepartmentForm';
import DepartmentDetails from './pages/departments/DepartmentDetails';

import CourseList from './pages/courses/CourseList';
import CourseForm from './pages/courses/CourseForm';
import CourseDetails from './pages/courses/CourseDetails';

import EnrollmentList from './pages/enrollments/EnrollmentList';
import EnrollmentForm from './pages/enrollments/EnrollmentForm';
import EnrollmentDetails from './pages/enrollments/EnrollmentDetails';

import UserList from './pages/users/UserList';
import UserForm from './pages/users/UserForm';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/login" element={<Login />} />

            {/* Every route below requires a logged-in user; ProtectedRoute
                handles the redirect-to-login logic in one place. */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<Profile />} />

                {/* Static segments ("new") are declared before the
                    dynamic ":id" segment so "/students/new" doesn't
                    get swallowed by the details route. */}
                <Route path="/students" element={<StudentList />} />
                <Route path="/students/new" element={<StudentForm />} />
                <Route path="/students/:id/edit" element={<StudentForm />} />
                <Route path="/students/:id" element={<StudentDetails />} />

                <Route path="/departments" element={<DepartmentList />} />
                <Route path="/departments/new" element={<DepartmentForm />} />
                <Route path="/departments/:id/edit" element={<DepartmentForm />} />
                <Route path="/departments/:id" element={<DepartmentDetails />} />

                <Route path="/courses" element={<CourseList />} />
                <Route path="/courses/new" element={<CourseForm />} />
                <Route path="/courses/:id/edit" element={<CourseForm />} />
                <Route path="/courses/:id" element={<CourseDetails />} />

                <Route path="/enrollments" element={<EnrollmentList />} />
                <Route path="/enrollments/new" element={<EnrollmentForm />} />
                <Route path="/enrollments/:id" element={<EnrollmentDetails />} />

                {/* Nested role check: only an Admin session reaches
                    the Users pages, even by typing the URL directly. */}
                <Route element={<ProtectedRoute roles={['Admin']} />}>
                  <Route path="/users" element={<UserList />} />
                  <Route path="/users/new" element={<UserForm />} />
                  <Route path="/users/:id/edit" element={<UserForm />} />
                </Route>
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner';

// Used as a layout route: <Route element={<ProtectedRoute />}>...
// wraps every child route in one auth check instead of repeating the
// guard logic inside each page component.
//
// `roles`, if given, additionally restricts the route to specific
// user roles (e.g. ["Admin"] for the Users page) — a logged-in Staff
// user hitting an Admin-only URL is redirected rather than shown a
// broken page.
function ProtectedRoute({ roles }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner label="Checking your session…" className="min-h-screen" />;
  }

  if (!isAuthenticated) {
    // Remembers where the user was headed so login can send them
    // back there afterward, instead of always landing on /dashboard.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

export default ProtectedRoute;

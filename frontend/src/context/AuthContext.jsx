import { createContext, useState, useEffect } from 'react';
import authService from '../services/auth.service';

const AuthContext = createContext(undefined);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  // Starts true so ProtectedRoute waits for the /me check below
  // before deciding to redirect — otherwise a page refresh would
  // briefly bounce a logged-in user to /login before their token
  // finished being validated.
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function restoreSession() {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        // Re-validates the token against the server rather than
        // trusting whatever was last cached in localStorage, so a
        // token revoked or expired since the last visit is caught
        // immediately instead of after the first failed API call.
        const currentUser = await authService.getMe();
        setUser(currentUser);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function login(email, password) {
    const { token, user: loggedInUser } = await authService.login(email, password);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    return loggedInUser;
  }

  function logout() {
    // Clears local state immediately rather than waiting on the
    // logout API call — since JWTs are stateless, the client-side
    // token removal is what actually ends the session.
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    authService.logout().catch(() => {});
  }

  const value = { user, isLoading, login, logout, isAuthenticated: !!user };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export { AuthContext, AuthProvider };

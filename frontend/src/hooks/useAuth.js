import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

// Throws early with a clear message if used outside AuthProvider,
// rather than letting components silently receive `undefined` and
// fail later with a confusing "cannot read property of undefined".
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default useAuth;

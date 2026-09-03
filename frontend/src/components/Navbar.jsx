import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from './Button';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-ink-100 bg-white px-6">
      <div />
      <div className="flex items-center gap-4">
        <Link to="/profile" className="flex items-center gap-3 hover:opacity-80">
          <div className="text-right">
            <p className="text-sm font-medium text-ink-900">{user?.name}</p>
            <p className="text-xs text-ink-400">{user?.role}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-100 text-sm font-semibold text-gold-700">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </Link>
        <Button variant="ghost" onClick={handleLogout}>
          Log out
        </Button>
      </div>
    </header>
  );
}

export default Navbar;

import { NavLink } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/students', label: 'Students' },
  { to: '/departments', label: 'Departments' },
  { to: '/courses', label: 'Courses' },
  { to: '/enrollments', label: 'Enrollments' },
  // Admin-only; filtered out below for Staff so the link never even
  // appears rather than appearing and then failing authorization.
  { to: '/users', label: 'Users', roles: ['Admin'] },
];

function Sidebar() {
  const { user } = useAuth();
  const visibleItems = NAV_ITEMS.filter((item) => !item.roles || item.roles.includes(user?.role));

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col bg-ink-900 text-ink-100">
      <div className="px-6 py-6">
        <p className="font-display text-lg font-semibold text-white">Student Management</p>
        <p className="mt-0.5 text-xs uppercase tracking-wider text-ink-300">Registrar's office</p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-md border-l-2 px-3 py-2 text-sm transition-colors ${
                isActive
                  ? 'border-gold-400 bg-ink-800 text-white'
                  : 'border-transparent text-ink-200 hover:bg-ink-800 hover:text-white'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

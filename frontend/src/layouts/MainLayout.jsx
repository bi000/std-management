import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

// Only rendered inside ProtectedRoute, so every page nested under it
// can safely assume a logged-in user exists without re-checking.
function MainLayout() {
  return (
    <div className="flex h-screen bg-paper">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;

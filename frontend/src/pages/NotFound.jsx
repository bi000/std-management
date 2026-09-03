import { Link } from 'react-router-dom';
import Button from '../components/Button';

function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center">
      <p className="font-display text-6xl font-semibold text-ink-800">404</p>
      <p className="mt-2 text-ink-500">This page doesn't exist.</p>
      <Link to="/dashboard" className="mt-6">
        <Button variant="primary">Back to dashboard</Button>
      </Link>
    </div>
  );
}

export default NotFound;

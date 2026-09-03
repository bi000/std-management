import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import Input from '../components/Input';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import useAuth from '../hooks/useAuth';
import getErrorMessage from '../utils/getErrorMessage';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Enter both email and password.');
      return;
    }
    if (!EMAIL_PATTERN.test(email)) {
      setError('Enter a valid email address.');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      // Send the user back to whatever page they were trying to
      // reach before being redirected to login, defaulting to the
      // dashboard for a fresh login.
      const redirectTo = location.state?.from?.pathname || '/dashboard';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to log in. Please try again.'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout>
      <div className="mb-8 text-center">
        <p className="font-display text-3xl font-semibold text-white">Student Management</p>
        <div className="mx-auto mt-3 h-px w-12 bg-gold-400" />
        <p className="mt-3 text-sm text-ink-200">Sign in to manage students, courses, and enrollments.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
        <ErrorMessage message={error} />
        <Input
          id="email"
          label="Email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="admin@school.edu"
        />
        <Input
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <Button type="submit" variant="gold" className="w-full" isLoading={isSubmitting}>
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}

export default Login;

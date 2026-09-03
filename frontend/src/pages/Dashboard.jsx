import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import dashboardService from '../services/dashboard.service';
import useAuth from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import StatusBreakdownChart from '../components/StatusBreakdownChart';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import getErrorMessage from '../utils/getErrorMessage';

function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    dashboardService
      .getStats()
      .then(setStats)
      .catch((err) => setError(getErrorMessage(err, 'Unable to load dashboard data.')))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Welcome back, {user?.name}</h1>
        <p className="text-ink-500">Here's what's happening across the school.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Total students" value={stats.students.total} accent />
        <StatCard label="Active students" value={stats.students.active} />
        <StatCard label="Inactive students" value={stats.students.inactive} />
        <StatCard label="Graduated students" value={stats.students.graduated} />
        <StatCard label="Departments" value={stats.totalDepartments} />
        <StatCard label="Courses" value={stats.totalCourses} />
        <StatCard label="Enrollments" value={stats.totalEnrollments} />
      </div>

      <div className="mt-6">
        <StatusBreakdownChart students={stats.students} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-ink-100 bg-white p-5">
          <p className="mb-4 text-sm font-medium text-ink-700">Recent students</p>
          {stats.recentStudents.length === 0 ? (
            <p className="text-sm text-ink-400">No students yet.</p>
          ) : (
            <ul className="divide-y divide-ink-100">
              {stats.recentStudents.map((s) => (
                <li key={s.id} className="flex items-center justify-between py-2.5 text-sm">
                  <Link to={`/students/${s.id}`} className="text-ink-700 hover:text-ink-900">
                    {s.first_name} {s.last_name}
                  </Link>
                  <StatusBadge status={s.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-lg border border-ink-100 bg-white p-5">
          <p className="mb-4 text-sm font-medium text-ink-700">Recent enrollments</p>
          {stats.recentEnrollments.length === 0 ? (
            <p className="text-sm text-ink-400">No enrollments yet.</p>
          ) : (
            <ul className="divide-y divide-ink-100">
              {stats.recentEnrollments.map((e) => (
                <li key={e.id} className="flex items-center justify-between py-2.5 text-sm">
                  <Link to={`/enrollments/${e.id}`} className="text-ink-700 hover:text-ink-900">
                    {e.student_name} — {e.course_name}
                  </Link>
                  <StatusBadge status={e.status} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

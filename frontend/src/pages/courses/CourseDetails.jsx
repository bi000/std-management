import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import courseService from '../../services/course.service';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import getErrorMessage from '../../utils/getErrorMessage';

function CourseDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = user?.role === 'Admin';

  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    courseService
      .getById(id)
      .then(setCourse)
      .catch((err) => setError(getErrorMessage(err, 'Unable to load course.')))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await courseService.remove(id);
      showToast('Course deleted successfully');
      navigate('/courses');
    } catch (err) {
      showToast(getErrorMessage(err, 'Unable to delete course.'), 'error');
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="mx-auto max-w-lg">
      <Link to="/courses" className="text-sm text-ink-500 hover:text-ink-800">
        ← Back to courses
      </Link>

      <div className="mt-4 rounded-lg border border-ink-100 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gold-600">{course.course_code}</p>
            <h1 className="font-display text-2xl font-semibold text-ink-900">{course.course_name}</h1>
          </div>
          {isAdmin && (
            <div className="flex gap-3 text-sm">
              <Button variant="secondary" onClick={() => navigate(`/courses/${id}/edit`)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
                Delete
              </Button>
            </div>
          )}
        </div>
        <p className="mt-3 text-ink-600">{course.description || 'No description provided.'}</p>
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-ink-100 pt-4 text-sm">
          <div>
            <dt className="text-ink-400">Department</dt>
            <dd className="text-ink-700">{course.department_name || '—'}</dd>
          </div>
          <div>
            <dt className="text-ink-400">Credit hours</dt>
            <dd className="text-ink-700">{course.credit_hours}</dd>
          </div>
        </dl>
      </div>

      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isConfirming={isDeleting}
        title="Delete course"
        message={`Are you sure you want to delete "${course.course_name}"? This cannot be undone.`}
      />
    </div>
  );
}

export default CourseDetails;

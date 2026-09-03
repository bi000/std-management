import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import departmentService from '../../services/department.service';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import getErrorMessage from '../../utils/getErrorMessage';

function DepartmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const isAdmin = user?.role === 'Admin';

  const [department, setDepartment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    departmentService
      .getById(id)
      .then(setDepartment)
      .catch((err) => setError(getErrorMessage(err, 'Unable to load department.')))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await departmentService.remove(id);
      showToast('Department deleted successfully');
      navigate('/departments');
    } catch (err) {
      showToast(getErrorMessage(err, 'Unable to delete department.'), 'error');
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="mx-auto max-w-lg">
      <Link to="/departments" className="text-sm text-ink-500 hover:text-ink-800">
        ← Back to departments
      </Link>

      <div className="mt-4 rounded-lg border border-ink-100 bg-white p-6">
        <div className="flex items-start justify-between">
          <h1 className="font-display text-2xl font-semibold text-ink-900">{department.name}</h1>
          {isAdmin && (
            <div className="flex gap-3 text-sm">
              <Button variant="secondary" onClick={() => navigate(`/departments/${id}/edit`)}>
                Edit
              </Button>
              <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
                Delete
              </Button>
            </div>
          )}
        </div>
        <p className="mt-3 text-ink-600">{department.description || 'No description provided.'}</p>
        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-ink-100 pt-4 text-sm">
          <div>
            <dt className="text-ink-400">Created</dt>
            <dd className="text-ink-700">{new Date(department.created_at).toLocaleDateString()}</dd>
          </div>
          <div>
            <dt className="text-ink-400">Last updated</dt>
            <dd className="text-ink-700">{new Date(department.updated_at).toLocaleDateString()}</dd>
          </div>
        </dl>
      </div>

      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isConfirming={isDeleting}
        title="Delete department"
        message={`Are you sure you want to delete "${department.name}"? This cannot be undone.`}
      />
    </div>
  );
}

export default DepartmentDetails;

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import enrollmentService from '../../services/enrollment.service';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';
import Select from '../../components/Select';
import StatusBadge from '../../components/StatusBadge';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import getErrorMessage from '../../utils/getErrorMessage';

function EnrollmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const canManage = user?.role === 'Admin' || user?.role === 'Staff';

  const [enrollment, setEnrollment] = useState(null);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    enrollmentService
      .getById(id)
      .then((data) => {
        setEnrollment(data);
        setStatus(data.status);
      })
      .catch((err) => setError(getErrorMessage(err, 'Unable to load enrollment.')))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleStatusSave() {
    setIsSaving(true);
    try {
      const updated = await enrollmentService.update(id, {
        enrollment_date: enrollment.enrollment_date,
        semester: enrollment.semester,
        academic_year: enrollment.academic_year,
        status,
      });
      setEnrollment(updated);
      showToast('Enrollment status updated');
    } catch (err) {
      showToast(getErrorMessage(err, 'Unable to update enrollment.'), 'error');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await enrollmentService.remove(id);
      showToast('Enrollment deleted successfully');
      navigate('/enrollments');
    } catch (err) {
      showToast(getErrorMessage(err, 'Unable to delete enrollment.'), 'error');
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="mx-auto max-w-lg">
      <Link to="/enrollments" className="text-sm text-ink-500 hover:text-ink-800">
        ← Back to enrollments
      </Link>

      <div className="mt-4 rounded-lg border border-ink-100 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="font-display text-xl font-semibold text-ink-900">{enrollment.student_name}</h1>
            <p className="text-ink-500">{enrollment.course_name}</p>
          </div>
          <StatusBadge status={enrollment.status} />
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-ink-100 pt-4 text-sm">
          <div>
            <dt className="text-ink-400">Semester</dt>
            <dd className="text-ink-700">{enrollment.semester}</dd>
          </div>
          <div>
            <dt className="text-ink-400">Academic year</dt>
            <dd className="text-ink-700">{enrollment.academic_year}</dd>
          </div>
          <div>
            <dt className="text-ink-400">Enrollment date</dt>
            <dd className="text-ink-700">{new Date(enrollment.enrollment_date).toLocaleDateString()}</dd>
          </div>
        </dl>

        {canManage && (
          <div className="mt-6 border-t border-ink-100 pt-4">
            <div className="flex items-end gap-3">
              <Select
                id="status"
                label="Update status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="max-w-xs"
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Dropped">Dropped</option>
              </Select>
              <Button onClick={handleStatusSave} isLoading={isSaving} disabled={status === enrollment.status}>
                Save
              </Button>
            </div>
            <Button variant="danger" className="mt-4" onClick={() => setIsDeleteOpen(true)}>
              Delete enrollment
            </Button>
          </div>
        )}
      </div>

      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isConfirming={isDeleting}
        title="Delete enrollment"
        message="Are you sure you want to delete this enrollment? This cannot be undone."
      />
    </div>
  );
}

export default EnrollmentDetails;

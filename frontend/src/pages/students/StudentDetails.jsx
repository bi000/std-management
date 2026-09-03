import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import studentService from '../../services/student.service';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import Button from '../../components/Button';
import StatusBadge from '../../components/StatusBadge';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import getErrorMessage from '../../utils/getErrorMessage';

function DetailRow({ label, value }) {
  return (
    <div>
      <dt className="text-ink-400">{label}</dt>
      <dd className="text-ink-700">{value || '—'}</dd>
    </div>
  );
}

function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const canEdit = user?.role === 'Admin' || user?.role === 'Staff';
  const canDelete = user?.role === 'Admin';

  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    studentService
      .getById(id)
      .then(setStudent)
      .catch((err) => setError(getErrorMessage(err, 'Unable to load student.')))
      .finally(() => setIsLoading(false));
  }, [id]);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await studentService.remove(id);
      showToast('Student deleted successfully');
      navigate('/students');
    } catch (err) {
      showToast(getErrorMessage(err, 'Unable to delete student.'), 'error');
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/students" className="text-sm text-ink-500 hover:text-ink-800">
        ← Back to students
      </Link>

      <div className="mt-4 rounded-lg border border-ink-100 bg-white p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gold-600">{student.student_id}</p>
            <h1 className="font-display text-2xl font-semibold text-ink-900">
              {student.first_name} {student.last_name}
            </h1>
            <div className="mt-2">
              <StatusBadge status={student.status} />
            </div>
          </div>
          <div className="flex gap-3 text-sm">
            {canEdit && (
              <Button variant="secondary" onClick={() => navigate(`/students/${id}/edit`)}>
                Edit
              </Button>
            )}
            {canDelete && (
              <Button variant="danger" onClick={() => setIsDeleteOpen(true)}>
                Delete
              </Button>
            )}
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-ink-100 pt-4 text-sm">
          <DetailRow label="Email" value={student.email} />
          <DetailRow label="Phone" value={student.phone} />
          <DetailRow
            label="Date of birth"
            value={student.date_of_birth && new Date(student.date_of_birth).toLocaleDateString()}
          />
          <DetailRow label="Gender" value={student.gender} />
          <DetailRow label="Department" value={student.department_name} />
          <DetailRow
            label="Enrollment date"
            value={student.enrollment_date && new Date(student.enrollment_date).toLocaleDateString()}
          />
          <div className="col-span-2">
            <DetailRow label="Address" value={student.address} />
          </div>
        </dl>
      </div>

      <ConfirmationDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        isConfirming={isDeleting}
        title="Delete student"
        message={`Are you sure you want to delete "${student.first_name} ${student.last_name}"? This cannot be undone.`}
      />
    </div>
  );
}

export default StudentDetails;

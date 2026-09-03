import { Link, useNavigate } from 'react-router-dom';
import enrollmentService from '../../services/enrollment.service';
import useResourceList from '../../hooks/useResourceList';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import Select from '../../components/Select';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import Button from '../../components/Button';
import { useState } from 'react';
import getErrorMessage from '../../utils/getErrorMessage';

const COLUMNS = [
  { key: 'student_name', label: 'Student', sortable: false },
  { key: 'course_name', label: 'Course', sortable: false },
  { key: 'semester', label: 'Semester', sortable: true },
  { key: 'academic_year', label: 'Academic Year', sortable: true },
  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
];

function EnrollmentList() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  // Both Admin and Staff can fully manage enrollments per the spec.
  const canManage = user?.role === 'Admin' || user?.role === 'Staff';

  const { rows, pagination, isLoading, error, params, setPage, setSort, setFilter, refetch } = useResourceList(
    enrollmentService,
    { defaultSortBy: 'enrollment_date', defaultOrder: 'desc' }
  );

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await enrollmentService.remove(deleteTarget.id);
      showToast('Enrollment deleted successfully');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      showToast(getErrorMessage(err, 'Unable to delete enrollment.'), 'error');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Enrollments</h1>
        {canManage && <Button onClick={() => navigate('/enrollments/new')}>Add enrollment</Button>}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Select
          id="status-filter"
          value={params.status || ''}
          onChange={(e) => setFilter('status', e.target.value || undefined)}
          className="max-w-xs"
        >
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
          <option value="Dropped">Dropped</option>
        </Select>
      </div>

      <ErrorMessage message={error} className="mb-4" />

      {isLoading ? (
        <LoadingSpinner />
      ) : rows.length === 0 ? (
        <EmptyState
          message={params.status ? 'No enrollments match your filter.' : 'No enrollments found.'}
          actionLabel={canManage ? 'Add an enrollment' : undefined}
          onAction={canManage ? () => navigate('/enrollments/new') : undefined}
        />
      ) : (
        <>
          <Table
            columns={COLUMNS}
            rows={rows}
            sortBy={params.sortBy}
            order={params.order}
            onSort={setSort}
            renderActions={(row) => (
              <div className="flex justify-end gap-3 text-sm">
                <Link to={`/enrollments/${row.id}`} className="text-ink-600 hover:text-ink-900">
                  View
                </Link>
                {canManage && (
                  <button onClick={() => setDeleteTarget(row)} className="text-red-600 hover:text-red-800">
                    Delete
                  </button>
                )}
              </div>
            )}
          />
          <div className="rounded-b-lg border border-t-0 border-ink-100 bg-white">
            <Pagination pagination={pagination} onPageChange={setPage} />
          </div>
        </>
      )}

      <ConfirmationDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        isConfirming={isDeleting}
        title="Delete enrollment"
        message={`Remove ${deleteTarget?.student_name}'s enrollment in ${deleteTarget?.course_name}? This cannot be undone.`}
      />
    </div>
  );
}

export default EnrollmentList;

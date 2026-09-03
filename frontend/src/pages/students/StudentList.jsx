import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import studentService from '../../services/student.service';
import departmentService from '../../services/department.service';
import useResourceList from '../../hooks/useResourceList';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import Select from '../../components/Select';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import Button from '../../components/Button';
import getErrorMessage from '../../utils/getErrorMessage';

const COLUMNS = [
  { key: 'student_id', label: 'Student ID', sortable: true },
  {
    key: 'name',
    label: 'Name',
    sortable: true,
    render: (row) => `${row.first_name} ${row.last_name}`,
  },
  { key: 'department_name', label: 'Department' },
  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
];

function StudentList() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const canEdit = user?.role === 'Admin' || user?.role === 'Staff';
  const canDelete = user?.role === 'Admin';

  const { rows, pagination, isLoading, error, params, setSearch, setPage, setSort, setFilter, refetch } =
    useResourceList(studentService, { defaultSortBy: 'last_name' });

  const [departments, setDepartments] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    departmentService.getAll({ limit: 100 }).then((res) => setDepartments(res.data)).catch(() => {});
  }, []);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await studentService.remove(deleteTarget.id);
      showToast('Student deleted successfully');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      showToast(getErrorMessage(err, 'Unable to delete student.'), 'error');
    } finally {
      setIsDeleting(false);
    }
  }

  const hasActiveFilters = params.search || params.department_id || params.status;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Students</h1>
        {canEdit && <Button onClick={() => navigate('/students/new')}>Add student</Button>}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchBar onSearch={setSearch} placeholder="Search by name, ID, or email…" />
        <Select
          id="department-filter"
          value={params.department_id || ''}
          onChange={(e) => setFilter('department_id', e.target.value || undefined)}
          className="max-w-xs"
        >
          <option value="">All departments</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </Select>
        <Select
          id="status-filter"
          value={params.status || ''}
          onChange={(e) => setFilter('status', e.target.value || undefined)}
          className="max-w-xs"
        >
          <option value="">All statuses</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
          <option value="Graduated">Graduated</option>
        </Select>
      </div>

      <ErrorMessage message={error} className="mb-4" />

      {isLoading ? (
        <LoadingSpinner />
      ) : rows.length === 0 ? (
        <EmptyState
          message={hasActiveFilters ? 'No students match your filters.' : 'No students found.'}
          actionLabel={canEdit ? 'Add a student' : undefined}
          onAction={canEdit ? () => navigate('/students/new') : undefined}
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
                <Link to={`/students/${row.id}`} className="text-ink-600 hover:text-ink-900">
                  View
                </Link>
                {canEdit && (
                  <Link to={`/students/${row.id}/edit`} className="text-ink-600 hover:text-ink-900">
                    Edit
                  </Link>
                )}
                {canDelete && (
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
        title="Delete student"
        message={`Are you sure you want to delete "${deleteTarget?.first_name} ${deleteTarget?.last_name}"? This cannot be undone.`}
      />
    </div>
  );
}

export default StudentList;

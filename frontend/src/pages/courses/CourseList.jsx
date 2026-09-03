import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import courseService from '../../services/course.service';
import departmentService from '../../services/department.service';
import useResourceList from '../../hooks/useResourceList';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import Select from '../../components/Select';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import Button from '../../components/Button';
import getErrorMessage from '../../utils/getErrorMessage';

const COLUMNS = [
  { key: 'course_code', label: 'Code', sortable: true },
  { key: 'course_name', label: 'Name', sortable: true },
  { key: 'department_name', label: 'Department' },
  { key: 'credit_hours', label: 'Credits', sortable: true },
];

function CourseList() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'Admin';

  const { rows, pagination, isLoading, error, params, setSearch, setPage, setSort, setFilter, refetch } =
    useResourceList(courseService, { defaultSortBy: 'course_code' });

  const [departments, setDepartments] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Loaded once to populate the department filter dropdown — a
  // lightweight request compared to fetching it on every keystroke.
  useEffect(() => {
    departmentService.getAll({ limit: 100 }).then((res) => setDepartments(res.data)).catch(() => {});
  }, []);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await courseService.remove(deleteTarget.id);
      showToast('Course deleted successfully');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      showToast(getErrorMessage(err, 'Unable to delete course.'), 'error');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Courses</h1>
        {isAdmin && <Button onClick={() => navigate('/courses/new')}>Add course</Button>}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchBar onSearch={setSearch} placeholder="Search courses…" />
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
      </div>

      <ErrorMessage message={error} className="mb-4" />

      {isLoading ? (
        <LoadingSpinner />
      ) : rows.length === 0 ? (
        <EmptyState
          message={params.search || params.department_id ? 'No courses match your filters.' : 'No courses found.'}
          actionLabel={isAdmin ? 'Add a course' : undefined}
          onAction={isAdmin ? () => navigate('/courses/new') : undefined}
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
                <Link to={`/courses/${row.id}`} className="text-ink-600 hover:text-ink-900">
                  View
                </Link>
                {isAdmin && (
                  <>
                    <Link to={`/courses/${row.id}/edit`} className="text-ink-600 hover:text-ink-900">
                      Edit
                    </Link>
                    <button onClick={() => setDeleteTarget(row)} className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </>
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
        title="Delete course"
        message={`Are you sure you want to delete "${deleteTarget?.course_name}"? This cannot be undone.`}
      />
    </div>
  );
}

export default CourseList;

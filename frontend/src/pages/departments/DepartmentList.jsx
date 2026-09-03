import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import departmentService from '../../services/department.service';
import useResourceList from '../../hooks/useResourceList';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import Button from '../../components/Button';
import getErrorMessage from '../../utils/getErrorMessage';

const COLUMNS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'description', label: 'Description' },
];

function DepartmentList() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const isAdmin = user?.role === 'Admin';

  const { rows, pagination, isLoading, error, params, setSearch, setPage, setSort, refetch } =
    useResourceList(departmentService, { defaultSortBy: 'name' });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await departmentService.remove(deleteTarget.id);
      showToast('Department deleted successfully');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      showToast(getErrorMessage(err, 'Unable to delete department.'), 'error');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Departments</h1>
        {isAdmin && <Button onClick={() => navigate('/departments/new')}>Add department</Button>}
      </div>

      <div className="mb-4">
        <SearchBar onSearch={setSearch} placeholder="Search departments…" />
      </div>

      <ErrorMessage message={error} className="mb-4" />

      {isLoading ? (
        <LoadingSpinner />
      ) : rows.length === 0 ? (
        <EmptyState
          message={params.search ? 'No departments match your search.' : 'No departments found.'}
          actionLabel={isAdmin ? 'Add a department' : undefined}
          onAction={isAdmin ? () => navigate('/departments/new') : undefined}
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
                <Link to={`/departments/${row.id}`} className="text-ink-600 hover:text-ink-900">
                  View
                </Link>
                {isAdmin && (
                  <>
                    <Link to={`/departments/${row.id}/edit`} className="text-ink-600 hover:text-ink-900">
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
        title="Delete department"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
      />
    </div>
  );
}

export default DepartmentList;

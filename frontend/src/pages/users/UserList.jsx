import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import userService from '../../services/user.service';
import useResourceList from '../../hooks/useResourceList';
import useAuth from '../../hooks/useAuth';
import useToast from '../../hooks/useToast';
import Table from '../../components/Table';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import Button from '../../components/Button';
import getErrorMessage from '../../utils/getErrorMessage';

const COLUMNS = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  { key: 'status', label: 'Status', render: (row) => <StatusBadge status={row.status} /> },
];

function UserList() {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const { rows, pagination, isLoading, error, params, setSearch, setPage, setSort, refetch } = useResourceList(
    userService,
    { defaultSortBy: 'name' }
  );

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await userService.remove(deleteTarget.id);
      showToast('User deleted successfully');
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      showToast(getErrorMessage(err, 'Unable to delete user.'), 'error');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-ink-900">Users</h1>
        <Button onClick={() => navigate('/users/new')}>Add user</Button>
      </div>

      <div className="mb-4">
        <SearchBar onSearch={setSearch} placeholder="Search users…" />
      </div>

      <ErrorMessage message={error} className="mb-4" />

      {isLoading ? (
        <LoadingSpinner />
      ) : rows.length === 0 ? (
        <EmptyState
          message={params.search ? 'No users match your search.' : 'No users found.'}
          actionLabel="Add a user"
          onAction={() => navigate('/users/new')}
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
                <Link to={`/users/${row.id}/edit`} className="text-ink-600 hover:text-ink-900">
                  Edit
                </Link>
                {/* An admin can't delete their own account while
                    logged in — matches the backend rule, and avoids
                    a disabled-looking link that would still 400 on click. */}
                {row.id !== currentUser.id && (
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
        title="Delete user"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This cannot be undone.`}
      />
    </div>
  );
}

export default UserList;

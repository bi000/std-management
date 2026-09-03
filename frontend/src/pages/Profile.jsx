import useAuth from '../hooks/useAuth';
import StatusBadge from '../components/StatusBadge';

function Profile() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 font-display text-2xl font-semibold text-ink-900">My profile</h1>

      <div className="rounded-lg border border-ink-100 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-100 text-xl font-semibold text-gold-700">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-ink-900">{user?.name}</p>
            <p className="text-sm text-ink-500">{user?.email}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-ink-100 pt-4 text-sm">
          <div>
            <dt className="text-ink-400">Role</dt>
            <dd className="text-ink-700">{user?.role}</dd>
          </div>
          <div>
            <dt className="text-ink-400">Status</dt>
            <dd>
              <StatusBadge status={user?.status} />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

export default Profile;

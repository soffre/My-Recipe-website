import { Navigate, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function Account() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const displayName = user.name || user.email || 'Kitchen Member';
  const avatarInitial = displayName.charAt(0).toUpperCase();

  if (!user.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <main className="min-h-screen bg-tafach-light px-grid-2 py-grid-4 text-tafach-dark">
      <section className="mx-auto flex w-full max-w-3xl flex-col gap-grid-3">
        <div className="flex flex-col gap-grid-1">
          <p className="text-sm font-semibold uppercase text-tafach-orange">Account</p>
          <h1 className="text-3xl font-bold">Your Tafach profile</h1>
          <p className="text-tafach-muted">
            Review the authenticated profile decoded from your active session token.
          </p>
        </div>

        <section className="flex flex-col gap-grid-3 rounded-lg border border-tafach-border bg-white p-grid-3 shadow-sm">
          <div className="flex flex-col gap-grid-2 sm:flex-row sm:items-center">
            {user.avatarUrl ? (
              <img
                className="h-20 w-20 rounded-full border border-tafach-border object-cover"
                src={user.avatarUrl}
                alt=""
              />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-full bg-tafach-orange text-2xl font-bold text-white">
                {avatarInitial}
              </span>
            )}

            <div className="min-w-0">
              <h2 className="truncate text-xl font-bold">{displayName}</h2>
              <p className="text-sm text-tafach-muted">{user.email}</p>
              <p className="text-sm capitalize text-tafach-muted">{user.role}</p>
            </div>
          </div>

          <dl className="grid gap-grid-2 sm:grid-cols-2">
            <div className="rounded-md border border-tafach-border bg-tafach-light p-grid-2">
              <dt className="text-xs font-semibold uppercase text-tafach-muted">User ID</dt>
              <dd className="mt-1 break-words text-sm font-medium">{user.id}</dd>
            </div>
            <div className="rounded-md border border-tafach-border bg-tafach-light p-grid-2">
              <dt className="text-xs font-semibold uppercase text-tafach-muted">Session</dt>
              <dd className="mt-1 text-sm font-medium">Authenticated</dd>
            </div>
          </dl>

          <button
            className="inline-flex h-11 items-center justify-center rounded-md bg-tafach-dark px-grid-2 text-sm font-semibold text-white transition-transform active:scale-95 disabled:opacity-50"
            type="button"
            onClick={handleLogout}
          >
            Log out
          </button>
        </section>
      </section>
    </main>
  );
}

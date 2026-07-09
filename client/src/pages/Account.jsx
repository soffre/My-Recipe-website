import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// --- Placeholder for fallback avatar ---
const fallbackAvatar =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22%3E%3Ccircle cx=%2240%22 cy=%2240%22 r=%2240%22 fill=%22%23CBD5E1%22/%3E%3Cpath d=%22M40 45c-11 0-20 6.5-20 15v5h40v-5c0-8.5-9-15-20-15zm0-25a12 12 0 1 0 0 24 12 12 0 0 0 0-24z%22 fill=%22%23FFFFFF%22/%3E%3C/svg%3E';


// --- 1. Profile Settings Component ---
function ProfileSettings({ user }) {
  const [isSaving, setIsSaving] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setIsSaving(true);
    // Simulate API call to update profile
    setTimeout(() => setIsSaving(false), 1000);
  }

  return (
    <div className="flex flex-col gap-grid-3">
      <div>
        <h2 className="text-2xl font-bold text-tafach-dark">Public Profile</h2>
        <p className="text-sm text-tafach-muted">Update your public facing information and avatar.</p>
      </div>

      <div className="flex items-center gap-grid-3">
        <img
          className="h-24 w-24 rounded-full border border-tafach-border object-cover shadow-sm"
          src={user.avatarUrl || fallbackAvatar}
          alt="Avatar preview"
        />
        <div className="flex flex-col gap-2">
          <button className="rounded-md border border-tafach-border bg-white px-4 py-2 text-sm font-semibold text-tafach-dark transition hover:border-tafach-orange active:scale-95">
            Upload new avatar
          </button>
          <p className="text-xs text-tafach-muted">JPG, GIF or PNG. Max size of 2MB.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-grid-2">
        <div className="grid gap-grid-2 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-tafach-dark">Display Name</label>
            <input
              className="tafach-input"
              type="text"
              defaultValue={user.name || ''}
              placeholder="e.g. Master Chef"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-tafach-dark">Email Address</label>
            <input
              className="tafach-input bg-gray-50 text-gray-500 cursor-not-allowed"
              type="email"
              defaultValue={user.email}
              disabled
              title="Email cannot be changed here"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-tafach-dark">Bio</label>
          <textarea
            className="tafach-input min-h-[100px] resize-y"
            placeholder="Tell the community about your cooking style..."
            defaultValue={user.bio || ''}
          />
        </div>

        <div className="mt-grid-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-md bg-tafach-orange px-6 py-2 text-sm font-semibold text-white transition hover:bg-tafach-orange/90 active:scale-95 disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- 2. Security Settings Component ---
function SecuritySettings() {
  const [isUpdating, setIsUpdating] = useState(false);

  function handleUpdatePassword(e) {
    e.preventDefault();
    setIsUpdating(true);
    // Simulate API call to change password
    setTimeout(() => setIsUpdating(false), 1000);
  }

  return (
    <div className="flex flex-col gap-grid-3">
      <div>
        <h2 className="text-2xl font-bold text-tafach-dark">Security Settings</h2>
        <p className="text-sm text-tafach-muted">Manage your password and account security.</p>
      </div>

      <form onSubmit={handleUpdatePassword} className="flex max-w-md flex-col gap-grid-2">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-tafach-dark">Current Password</label>
          <input className="tafach-input" type="password" required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-tafach-dark">New Password</label>
          <input className="tafach-input" type="password" required />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm font-semibold text-tafach-dark">Confirm New Password</label>
          <input className="tafach-input" type="password" required />
        </div>

        <div className="mt-grid-2">
          <button
            type="submit"
            disabled={isUpdating}
            className="rounded-md bg-tafach-dark px-6 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 active:scale-95 disabled:opacity-50"
          >
            {isUpdating ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </form>
    </div>
  );
}

// --- 3. User Recipes Manager Component ---
function UserRecipesManager() {
  return (
    <div className="flex flex-col gap-grid-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-tafach-dark">My Recipes</h2>
          <p className="text-sm text-tafach-muted">Manage the recipes you have shared with the community.</p>
        </div>
        <Link 
          to="/recipes/new"
          className="inline-flex rounded-md bg-tafach-green px-4 py-2 text-sm font-bold text-white transition hover:bg-tafach-green/90 active:scale-95"
        >
          ➕ Create New Recipe
        </Link>
      </div>

      {/* Placeholder for when user has no recipes yet */}
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-tafach-border bg-white py-12 text-center">
        <div className="mb-2 text-4xl">🍳</div>
        <h3 className="text-lg font-bold text-tafach-dark">No recipes yet</h3>
        <p className="mt-1 max-w-sm text-sm text-tafach-muted">
          You haven't posted any recipes. Share your favorite dishes with the Tafach Kitchen community!
        </p>
      </div>
    </div>
  );
}


// --- 4. Main Account Page Layout ---

export default function Account() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  // Protect route
  if (!user?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'security', label: 'Security' },
    { id: 'recipes', label: 'My Recipes' },
    { id: 'bookmarks', label: 'Saved Bookmarks' },
  ];

  return (
    <main className="min-h-screen bg-tafach-light py-grid-4 text-tafach-dark">
      <div className="mx-auto flex max-w-6xl flex-col gap-grid-4 px-4 md:flex-row lg:px-8">
        
        {/* Sidebar Navigation */}
        <aside className="w-full shrink-0 md:w-64">
          <div className="sticky top-24 flex flex-col gap-1">
            <div className="mb-4 px-3">
              <p className="text-xs font-bold uppercase tracking-wider text-tafach-muted">Account Menu</p>
            </div>
            
            <nav className="flex flex-row overflow-x-auto pb-2 md:flex-col md:pb-0">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`whitespace-nowrap rounded-md px-3 py-2 text-left text-sm font-semibold transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'bg-orange-50 text-tafach-orange'
                      : 'text-tafach-dark hover:bg-gray-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>

            <div className="mt-4 border-t border-tafach-border pt-4 px-3">
              <button
                onClick={handleLogout}
                className="w-full text-left text-sm font-bold text-tafach-error transition hover:text-red-700"
              >
                Log Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 rounded-xl border border-tafach-border bg-white p-6 shadow-sm sm:p-8">
          {activeTab === 'profile' && <ProfileSettings user={user} />}
          {activeTab === 'security' && <SecuritySettings />}
          {activeTab === 'recipes' && <UserRecipesManager />}
          {activeTab === 'bookmarks' && (
            <div className="flex flex-col gap-grid-3">
              <h2 className="text-2xl font-bold text-tafach-dark">Saved Bookmarks</h2>
              <p className="text-sm text-tafach-muted">Recipes you have bookmarked for later will appear here.</p>
              {/* Add your bookmark grid component here later */}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
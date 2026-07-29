import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Lock, 
  Bell, 
  BookOpen, 
  Bookmark, 
  LogOut, 
  Upload, 
  Check, 
  ShieldAlert,
  ShieldCheck
} from 'lucide-react';

export default function Account() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState('profile');

  const [preferences, setPreferences] = useState({
    displayName: user?.name || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || '',
    emailNotifications: true,
    weeklyNewsletter: false,
    marketingUpdates: true
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [saveStatus, setSaveStatus] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  if (!user || user.role === 'anonymous') {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handlePreferencesSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);

    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus({ type: 'success', message: 'Profile preferences updated successfully!' });
      
      setTimeout(() => {
        setSaveStatus(null);
      }, 4000);
    }, 1200);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setSaveStatus({ type: 'error', message: 'New passwords do not match.' });
      return;
    }

    setIsSaving(true);
    setSaveStatus(null);

    setTimeout(() => {
      setIsSaving(false);
      setSaveStatus({ type: 'success', message: 'Account password updated successfully!' });
      setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
      
      setTimeout(() => {
        setSaveStatus(null);
      }, 4000);
    }, 1200);
  };

  const fallbackAvatar =
    'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22%3E%3Ccircle cx=%2240%22 cy=%2240%22 r=%2240%22 fill=%22%23CBD5E1%22/%3E%3Cpath d=%22M40 45c-11 0-20 6.5-20 15v5h40v-5c0-8.5-9-15-20-15zm0-25a12 12 0 1 0 0 24 12 12 0 0 0 0-24z%22 fill=%22%23FFFFFF%22/%3E%3C/svg%3E';

  return (
    <main className="font-brand min-h-screen bg-tafach-light py-6 md:py-8 text-tafach-dark">
      <div className="mx-auto max-w-6xl px-4 lg:px-8">
        
        <header className="mb-6 md:mb-8 border-b border-tafach-border pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-tafach-dark">Account Settings</h1>
            <p className="text-sm text-tafach-muted">Update your profile parameters, notifications and configurations.</p>
          </div>
          {saveStatus && (
            <div className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 animate-bounce self-start sm:self-auto ${
              saveStatus.type === 'success' ? 'bg-tafach-green/10 text-tafach-green' : 'bg-tafach-error/10 text-tafach-error'
            }`}>
              {saveStatus.type === 'success' ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
              {saveStatus.message}
            </div>
          )}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 items-start">
          
          <aside className="bg-white border border-tafach-border rounded-2xl p-4 md:sticky md:top-24 shadow-sm flex flex-col gap-4">
            
            <div className="flex items-center gap-3 md:border-b md:border-tafach-border md:pb-4">
              <img 
                src={preferences.avatarUrl || fallbackAvatar} 
                alt="Account User" 
                className="w-10 h-10 rounded-full object-cover border border-tafach-border shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-bold text-tafach-dark truncate">{preferences.displayName || 'Tafach User'}</p>
                <p className="text-[10px] text-tafach-muted truncate">{user.email}</p>
              </div>
            </div>

            {/* Scrollable Navigation Wrapper with Fade Indicator */}
            <div className="relative w-full">
              <nav className="flex overflow-x-auto md:flex-col gap-2 md:gap-1 pb-2 md:pb-0 pr-8 md:pr-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`shrink-0 whitespace-nowrap active:scale-95 transition-transform w-auto md:w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all duration-150 ${
                    activeTab === 'profile' ? 'bg-tafach-orange text-white shadow-sm' : 'text-tafach-muted hover:bg-slate-50 hover:text-tafach-dark'
                  }`}
                >
                  <User className="h-4 w-4" />
                  Profile Settings
                </button>

                <button
                  onClick={() => setActiveTab('security')}
                  className={`shrink-0 whitespace-nowrap active:scale-95 transition-transform w-auto md:w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all duration-150 ${
                    activeTab === 'security' ? 'bg-tafach-orange text-white shadow-sm' : 'text-tafach-muted hover:bg-slate-50 hover:text-tafach-dark'
                  }`}
                >
                  <Lock className="h-4 w-4" />
                  Security Settings
                </button>

                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`shrink-0 whitespace-nowrap active:scale-95 transition-transform w-auto md:w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all duration-150 ${
                    activeTab === 'notifications' ? 'bg-tafach-orange text-white shadow-sm' : 'text-tafach-muted hover:bg-slate-50 hover:text-tafach-dark'
                  }`}
                >
                  <Bell className="h-4 w-4" />
                  Email & Notifications
                </button>

                <button
                  onClick={() => setActiveTab('recipes')}
                  className={`shrink-0 whitespace-nowrap active:scale-95 transition-transform w-auto md:w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all duration-150 ${
                    activeTab === 'recipes' ? 'bg-tafach-orange text-white shadow-sm' : 'text-tafach-muted hover:bg-slate-50 hover:text-tafach-dark'
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  My Shared Recipes
                </button>

                <button
                  onClick={() => setActiveTab('bookmarks')}
                  className={`shrink-0 whitespace-nowrap active:scale-95 transition-transform w-auto md:w-full text-left px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all duration-150 ${
                    activeTab === 'bookmarks' ? 'bg-tafach-orange text-white shadow-sm' : 'text-tafach-muted hover:bg-slate-50 hover:text-tafach-dark'
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                  Saved Bookmarks
                </button>

                <button
                  onClick={handleLogout}
                  className="md:hidden shrink-0 whitespace-nowrap active:scale-95 transition-transform w-auto text-left px-3 py-2 rounded-lg text-xs font-bold text-tafach-error hover:bg-red-50 flex items-center gap-2.5"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </nav>

              {/* Visual Fade Indicator (Mobile Only) */}
              <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-white to-transparent md:hidden"></div>
            </div>

            <div className="hidden md:block pt-2 border-t border-tafach-border">
              <button
                onClick={handleLogout}
                className="active:scale-95 transition-transform w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-tafach-error hover:bg-red-50 flex items-center gap-2.5"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            </div>
          </aside>

          <section className="bg-white border border-tafach-border rounded-2xl p-6 md:p-8 shadow-sm min-h-[400px]">
            
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-tafach-dark">Public Profile</h2>
                  <p className="text-xs text-tafach-muted">Update your public facing information and identity.</p>
                </div>

                <div className="flex items-center gap-6">
                  <img
                    className="h-20 w-20 rounded-full border border-tafach-border object-cover shadow-sm shrink-0"
                    src={preferences.avatarUrl || fallbackAvatar}
                    alt="Avatar preview"
                  />
                  <div className="flex flex-col gap-1.5">
                    <button className="active:scale-95 transition-transform rounded-lg border border-tafach-border bg-white px-3 py-1.5 text-xs font-semibold text-tafach-dark hover:border-tafach-orange flex items-center gap-1.5 w-fit">
                      <Upload className="w-3.5 h-3.5" />
                      Upload new avatar
                    </button>
                    <p className="text-[10px] text-tafach-muted">JPG, GIF or PNG. Max size of 2MB.</p>
                  </div>
                </div>

                <form onSubmit={handlePreferencesSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-tafach-dark">Display Name</label>
                      <input
                        className="tafach-input w-full rounded-lg border border-tafach-border bg-white px-3 py-2 text-sm text-tafach-dark focus:border-tafach-orange focus:outline-none"
                        type="text"
                        value={preferences.displayName}
                        onChange={(e) => setPreferences({ ...preferences, displayName: e.target.value })}
                        placeholder="e.g. Master Chef"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold text-tafach-dark">Email Address</label>
                      <input
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 cursor-not-allowed"
                        type="email"
                        value={user.email}
                        disabled
                        title="Email address is synced to auth settings"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-tafach-dark">Bio description</label>
                    <textarea
                      rows="4"
                      className="w-full rounded-lg border border-tafach-border bg-white px-3 py-2 text-sm text-tafach-dark focus:border-tafach-orange focus:outline-none min-h-[100px] resize-y"
                      placeholder="Tell the community about your cooking style..."
                      value={preferences.bio}
                      onChange={(e) => setPreferences({ ...preferences, bio: e.target.value })}
                    />
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="active:scale-95 transition-transform bg-tafach-orange hover:bg-tafach-orange/95 text-white font-semibold text-xs px-5 py-2 rounded-lg shadow-sm disabled:opacity-50"
                    >
                      {isSaving ? 'Saving parameters...' : 'Save Profile'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-tafach-dark">Security Settings</h2>
                  <p className="text-xs text-tafach-muted">Manage your password and security credentials.</p>
                </div>

                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-tafach-dark">Current Password</label>
                    <input 
                      className="w-full rounded-lg border border-tafach-border bg-white px-3 py-2 text-sm focus:border-tafach-orange focus:outline-none" 
                      type="password" 
                      value={passwordState.currentPassword}
                      onChange={(e) => setPasswordState({ ...passwordState, currentPassword: e.target.value })}
                      required 
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-tafach-dark">New Password</label>
                    <input 
                      className="w-full rounded-lg border border-tafach-border bg-white px-3 py-2 text-sm focus:border-tafach-orange focus:outline-none" 
                      type="password" 
                      value={passwordState.newPassword}
                      onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                      required 
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold text-tafach-dark">Confirm New Password</label>
                    <input 
                      className="w-full rounded-lg border border-tafach-border bg-white px-3 py-2 text-sm focus:border-tafach-orange focus:outline-none" 
                      type="password" 
                      value={passwordState.confirmPassword}
                      onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                      required 
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="active:scale-95 transition-transform bg-tafach-dark hover:bg-black text-white font-semibold text-xs px-5 py-2 rounded-lg disabled:opacity-50"
                    >
                      {isSaving ? 'Updating password...' : 'Update Password'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-tafach-dark">Email & Notifications</h2>
                  <p className="text-xs text-tafach-muted">Customize how you receive alerts and communications from the team.</p>
                </div>

                <div className="divide-y divide-slate-100 space-y-4">
                  <div className="flex items-center justify-between pt-4 first:pt-0 gap-4">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-tafach-dark block">Recipe Activity Emails</span>
                      <span className="text-[11px] text-tafach-muted">Receive alerts when comments or ratings are posted on your recipes.</span>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setPreferences({ ...preferences, emailNotifications: !preferences.emailNotifications })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        preferences.emailNotifications ? 'bg-tafach-green' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          preferences.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-4 gap-4">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-tafach-dark block">Weekly Digest Newsletter</span>
                      <span className="text-[11px] text-tafach-muted">Get a curated email containing the week's best recipe submissions and editorial picks.</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPreferences({ ...preferences, weeklyNewsletter: !preferences.weeklyNewsletter })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        preferences.weeklyNewsletter ? 'bg-tafach-green' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          preferences.weeklyNewsletter ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-4 gap-4">
                    <div className="space-y-0.5">
                      <span className="text-xs font-semibold text-tafach-dark block">Marketing & Event Invites</span>
                      <span className="text-[11px] text-tafach-muted">Receive information about cooking competitions, discounts, and site features.</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setPreferences({ ...preferences, marketingUpdates: !preferences.marketingUpdates })}
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        preferences.marketingUpdates ? 'bg-tafach-green' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          preferences.marketingUpdates ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="pt-4 flex justify-end border-t border-slate-100">
                  <button
                    onClick={handlePreferencesSubmit}
                    disabled={isSaving}
                    className="active:scale-95 transition-transform bg-tafach-orange hover:bg-tafach-orange/95 text-white font-semibold text-xs px-5 py-2 rounded-lg shadow-sm disabled:opacity-50"
                  >
                    {isSaving ? 'Saving selections...' : 'Save Preferences'}
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'recipes' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-tafach-dark">My Contributed Recipes</h2>
                    <p className="text-xs text-tafach-muted">Manage the recipes you have shared with the community.</p>
                  </div>
                  <Link 
                    to="/create-recipe"
                    className="active:scale-95 transition-transform inline-flex w-fit rounded-lg bg-tafach-green px-4 py-2 text-xs font-bold text-white transition hover:bg-tafach-green/90"
                  >
                    ➕ Create New Recipe
                  </Link>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-tafach-border bg-slate-50/50 py-12 text-center">
                  <div className="mb-2 text-4xl">🍳</div>
                  <h3 className="text-sm font-bold text-tafach-dark">No contributed recipes yet</h3>
                  <p className="mt-1 max-w-sm text-xs text-tafach-muted px-4">
                    You haven't posted any recipe formulas yet. Share your signature dishes with the Tafach Kitchen community!
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'bookmarks' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-tafach-dark">Saved Bookmarks</h2>
                  <p className="text-xs text-tafach-muted">Recipes you have bookmarked for quick lookup later.</p>
                </div>

                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-tafach-border bg-slate-50/50 py-12 text-center">
                  <div className="mb-2 text-4xl">🔖</div>
                  <h3 className="text-sm font-bold text-tafach-dark">No bookmarked recipes</h3>
                  <p className="mt-1 max-w-sm text-xs text-tafach-muted px-4">
                    Bookmark your favorite recipes while browsing to quickly recall and prepare them from this viewport.
                  </p>
                </div>
              </div>
            )}

          </section>

        </div>
      </div>
    </main>
  );
}
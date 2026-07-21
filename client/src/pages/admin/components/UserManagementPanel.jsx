import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function UserManagementPanel() {
  // 1. Initial State Array (4 User Records)
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Abebe Kebede',
      email: 'abebe@tafach.com',
      registeredDate: '2026-01-10',
      role: 'admin',
      isBanned: false,
      isVerified: true
    },
    {
      id: 2,
      name: 'Sarah Jenkins',
      email: 'sarah.j@gmail.com',
      registeredDate: '2026-03-15',
      role: 'writer',
      isBanned: false,
      isVerified: true
    },
    {
      id: 3,
      name: 'Marcus Vance',
      email: 'marcus@bakingart.org',
      registeredDate: '2026-05-22',
      role: 'user',
      isBanned: true,
      isVerified: false
    },
    {
      id: 4,
      name: 'Elena Rostova',
      email: 'elena.r@cooking.ru',
      registeredDate: '2026-06-05',
      role: 'writer',
      isBanned: false,
      isVerified: false
    }
  ]);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Manual Email Verification Override State
  const [overrideEmail, setOverrideEmail] = useState('');
  const [overrideFeedback, setOverrideFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  // 3. Role Management Selection: Atomic local state modifier
  const handleRoleChange = (userId, newRole) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  // 4. Security Moderation Actions: Toggle ban status
  const handleToggleBanStatus = (userId) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isBanned: !user.isBanned } : user
    ));
  };

  // 5. Manual bypass handler: Force Email Verification Override
  const handleForceVerificationOverride = (e) => {
    e.preventDefault();
    const emailToFind = overrideEmail.trim().toLowerCase();
    if (!emailToFind) {
      setOverrideFeedback({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    const userExists = users.some(u => u.email.toLowerCase() === emailToFind);
    if (!userExists) {
      setOverrideFeedback({ 
        type: 'error', 
        message: `No user profile registered under the email address "${emailToFind}".` 
      });
      return;
    }

    setUsers(prev => prev.map(user => 
      user.email.toLowerCase() === emailToFind ? { ...user, isVerified: true } : user
    ));

    setOverrideFeedback({ 
      type: 'success', 
      message: `Successfully bypass-verified email address: ${emailToFind}` 
    });
    setOverrideEmail('');

    // Clear feedback message after 4 seconds
    setTimeout(() => {
      setOverrideFeedback(null);
    }, 4000);
  };

  // Filtered Users List
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-grid-3 animate-fadeIn">
      {/* 5. Manual Bypass Option Block */}
      <div className="bg-white p-grid-3 rounded-2xl border border-tafach-border shadow-sm space-y-grid-2">
        <div>
          <h4 className="font-bold text-sm text-tafach-dark">System Security Override Controls</h4>
          <p className="text-xs text-tafach-muted">
            Force manual email validation bypasses directly for users who failed confirmation link delivery.
          </p>
        </div>

        <form onSubmit={handleForceVerificationOverride} className="flex flex-col sm:flex-row gap-2 max-w-xl pt-1">
          <input
            type="email"
            placeholder="Enter unverified user email address..."
            value={overrideEmail}
            onChange={(e) => setOverrideEmail(e.target.value)}
            className="tafach-input flex-1"
          />
          <button
            type="submit"
            className="active:scale-95 transition-transform bg-tafach-dark hover:bg-black text-white text-xs font-semibold px-4 py-2 rounded-lg shrink-0"
          >
            ⚡ Force Manual Email Verification Verification Override
          </button>
        </form>

        {overrideFeedback && (
          <div className={`text-xs font-medium p-2 rounded-lg ${
            overrideFeedback.type === 'success' 
              ? 'bg-tafach-green/10 text-tafach-green' 
              : 'bg-tafach-error/10 text-tafach-error'
          }`}>
            {overrideFeedback.message}
          </div>
        )}
      </div>

      {/* Main Table Container */}
      <div className="bg-white p-grid-3 rounded-2xl border border-tafach-border shadow-sm space-y-grid-3">
        {/* Filters and Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-grid-2 border-b border-tafach-border">
          <div>
            <h3 className="font-bold text-sm text-tafach-dark">User Credentials & Security Moderation</h3>
            <p className="text-xs text-tafach-muted">Select user roles and lock statuses dynamically updated in state.</p>
          </div>

          {/* Interactive Search Filters */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-tafach-muted" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-tafach-border rounded-lg outline-none focus:border-tafach-orange focus:bg-white"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-slate-50 border border-tafach-border rounded-lg outline-none text-tafach-dark focus:border-tafach-orange focus:bg-white font-medium"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="writer">Writer</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        {/* 2. Responsive Table Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-tafach-border text-tafach-muted font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-2">Name</th>
                <th className="py-3 px-2">Email</th>
                <th className="py-3 px-2">Registered Date</th>
                <th className="py-3 px-2">Email Status</th>
                <th className="py-3 px-2">Role Authority</th>
                <th className="py-3 px-2 text-right">Moderation Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-tafach-muted text-xs">
                    No registered users found matching the filter query parameters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className={`transition-colors duration-150 ${
                      user.isBanned 
                        ? 'bg-slate-50 text-slate-400 opacity-60' 
                        : 'hover:bg-slate-50 text-tafach-dark'
                    }`}
                  >
                    {/* Name Info */}
                    <td className="py-3 px-2 font-medium">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${user.isBanned ? 'line-through text-slate-400' : ''}`}>
                          {user.name}
                        </span>
                        {user.isBanned && (
                          <span className="bg-tafach-error/10 text-tafach-error px-1.5 py-0.5 rounded text-[9px] font-bold">
                            BANNED
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Email Info */}
                    <td className="py-3 px-2 font-mono">{user.email}</td>

                    {/* Registered Date */}
                    <td className="py-3 px-2">{user.registeredDate}</td>

                    {/* Verification Status */}
                    <td className="py-3 px-2">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold ${
                        user.isVerified 
                          ? 'bg-tafach-green/10 text-tafach-green' 
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {user.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </td>

                    {/* 3. Role Management Selection */}
                    <td className="py-3 px-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={user.isBanned}
                        className="bg-white border border-tafach-border text-tafach-dark text-xs rounded-lg p-1.5 focus:outline-none focus:ring-1 focus:ring-tafach-orange focus:border-tafach-orange font-medium disabled:bg-slate-100 disabled:text-slate-400"
                      >
                        <option value="admin">admin</option>
                        <option value="writer">writer</option>
                        <option value="user">user</option>
                      </select>
                    </td>

                    {/* 4. Security Moderation Actions */}
                    <td className="py-3 px-2 text-right">
                      <button
                        onClick={() => handleToggleBanStatus(user.id)}
                        className="active:scale-95 transition-transform text-tafach-error border border-red-200 hover:bg-red-50 px-2 py-1 rounded text-xs font-semibold"
                      >
                        {user.isBanned ? '🔓 Toggle Ban/Lock Status' : '🔒 Toggle Ban/Lock Status'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Quick Summary Footer */}
        <div className="pt-2 border-t border-tafach-border flex items-center justify-between text-xs text-tafach-muted">
          <span>Displaying {filteredUsers.length} of {users.length} registered profiles</span>
          <span className="flex items-center gap-3">
            <span>Banned: {users.filter(u => u.isBanned).length}</span>
            <span>Verified: {users.filter(u => u.isVerified).length}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

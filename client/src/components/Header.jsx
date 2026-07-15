import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const fallbackAvatar =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22%3E%3Ccircle cx=%2240%22 cy=%2240%22 r=%2240%22 fill=%22%23CBD5E1%22/%3E%3Cpath d=%22M40 45c-11 0-20 6.5-20 15v5h40v-5c0-8.5-9-15-20-15zm0-25a12 12 0 1 0 0 24 12 12 0 0 0 0-24z%22 fill=%22%23FFFFFF%22/%3E%3C/svg%3E';

// --- Production-Grade Navigation Categories ---
const NAV_LINKS = [
  { label: 'Explore', path: '/explore' },
  { label: 'Dinners', path: '/dinners' },
  { label: 'Quick & Easy', path: '/quick-and-easy' },
  { label: 'Guides', path: '/guides' },
];

// --- Sub-components ---

function BrandLogo({ onClick }) {
  return (
    <Link
      className="inline-flex items-center text-xl font-bold transition-opacity duration-200 hover:opacity-80 active:scale-95"
      to="/"
      onClick={onClick}
    >
      <span className="text-tafach-dark">Recipe</span>
      <span className="ml-1 text-tafach-orange">Logo</span>
    </Link>
  );
}

function SearchForm({ searchQuery, onSearchChange, onSearchSubmit }) {
  return (
    <form className="flex w-full items-stretch sm:w-auto" onSubmit={onSearchSubmit}>
      <input
        className="tafach-input h-9 w-full min-w-[150px] rounded-l-md border border-r-0 border-tafach-border px-3 text-sm focus:border-tafach-orange focus:outline-none sm:w-48 lg:w-64"
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search recipes..."
        aria-label="Search recipes"
      />
      <button
        className="h-9 shrink-0 rounded-r-md border border-tafach-orange bg-tafach-orange px-3 text-sm font-semibold text-white transition duration-200 hover:bg-tafach-orange/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        type="submit"
        disabled={!searchQuery.trim()}
      >
        Search
      </button>
    </form>
  );
}

function UserDropdown({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center rounded-full outline-none transition duration-200 active:scale-95"
        aria-label="Open user menu"
      >
        {/* FIXED: Added a permanent soft orange ring that turns solid on hover */}
        <img
          className="h-9 w-9 rounded-full object-cover shadow-sm ring-2 ring-tafach-orange/60 transition-all duration-200 hover:ring-tafach-orange"
          src={user.avatarUrl || fallbackAvatar}
          alt="User avatar"
        />
      </button>

      {isOpen ? (
        <div className="absolute right-0 mt-3 w-48 z-50 rounded-md border border-tafach-border bg-white py-2 shadow-lg">
          <Link
            to="/account"
            className="block px-4 py-2 text-sm text-tafach-dark transition-colors hover:bg-tafach-light hover:text-tafach-orange"
            onClick={() => setIsOpen(false)}
          >
            My Account
          </Link>
          <Link
            to="/create-recipe"
            className="block px-4 py-2 text-sm text-tafach-dark transition-colors hover:bg-tafach-light hover:text-tafach-orange"
            onClick={() => setIsOpen(false)}
          >
            Create Recipe
          </Link>
          <Link
            to="/favorites"
            className="block px-4 py-2 text-sm text-tafach-dark transition-colors hover:bg-tafach-light hover:text-tafach-orange"
            onClick={() => setIsOpen(false)}
          >
            Saved Recipes
          </Link>
          <hr className="my-1 border-tafach-border" />
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="block w-full px-4 py-2 text-left text-sm font-semibold text-tafach-error transition-colors hover:bg-red-50"
          >
            Log Out
          </button>
        </div>
      ) : null}
    </div>
  );
}

// --- Main Header Component ---

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const isAnonymous = user?.role === 'anonymous' || !user;

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();
    const normalizedQuery = searchQuery.trim();
    if (!normalizedQuery) return;
    navigate(`/?search=${encodeURIComponent(normalizedQuery)}`);
    closeMobileMenu();
  }

  function handleLogout() {
    logout();
    closeMobileMenu();
    navigate('/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-[99] border-b border-tafach-border bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        
        {/* Left: Logo */}
        <div className="flex shrink-0 items-center">
          <BrandLogo onClick={closeMobileMenu} />
        </div>

        {/* Center: Main Navigation (Desktop) */}
        <div className="hidden flex-1 items-center justify-center gap-4 md:flex lg:gap-8">
          <Link className="text-sm font-semibold text-tafach-dark transition duration-200 hover:text-tafach-orange active:scale-95" to="/explore">Explore</Link>
          <Link className="text-sm font-semibold text-tafach-dark transition duration-200 hover:text-tafach-orange active:scale-95" to="/dinners">Dinners</Link>
          <Link className="text-sm font-semibold text-tafach-dark transition duration-200 hover:text-tafach-orange active:scale-95" to="/quick-and-easy">Quick & Easy</Link>
          <Link className="text-sm font-semibold text-tafach-dark transition duration-200 hover:text-tafach-orange active:scale-95" to="/guides">Guides</Link>
        </div>

        {/* Right: Search & Actions (Desktop) */}
        <div className="hidden shrink-0 items-center justify-end gap-4 md:flex">
          <SearchForm
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
          />
          
          {isAnonymous ? (
            <div className="flex shrink-0 items-center gap-3 border-l border-tafach-border pl-4">
              <Link
                className="text-sm font-semibold text-tafach-dark transition hover:text-tafach-orange"
                to="/login"
              >
                Log In
              </Link>
              <Link
                className="rounded-md bg-tafach-orange px-4 py-2 text-sm font-semibold text-white transition hover:bg-tafach-orange/90"
                to="/signup"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="border-l border-tafach-border pl-4">
              <UserDropdown user={user} onLogout={handleLogout} />
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-tafach-border text-2xl text-tafach-dark md:hidden"
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          ☰
        </button>
      </nav>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen ? (
        <button
          className="fixed inset-0 z-40 bg-black bg-opacity-30 backdrop-blur-sm md:hidden"
          type="button"
          onClick={closeMobileMenu}
          aria-label="Close menu"
        />
      ) : null}

      {/* Mobile Drawer Menu */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-72 transform flex-col border-l border-tafach-border bg-white transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-tafach-border p-4">
          <BrandLogo onClick={closeMobileMenu} />
          <button
            className="text-3xl text-tafach-muted hover:text-tafach-error"
            onClick={closeMobileMenu}
          >
            &times;
          </button>
        </div>

        <div className="flex flex-col overflow-y-auto p-4">
          {/* Mobile Search */}
          <div className="mb-6 flex">
            <SearchForm
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={handleSearchSubmit}
            />
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex flex-col gap-1 border-b border-tafach-border pb-6">
            <h3 className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-tafach-muted">
              Menu
            </h3>
            <Link className="block rounded-md px-3 py-2 text-sm text-tafach-dark transition-colors duration-200 hover:bg-tafach-light hover:text-tafach-orange" to="/explore" onClick={closeMobileMenu}>Explore</Link>
            <Link className="block rounded-md px-3 py-2 text-sm text-tafach-dark transition-colors duration-200 hover:bg-tafach-light hover:text-tafach-orange" to="/dinners" onClick={closeMobileMenu}>Dinners</Link>
            <Link className="block rounded-md px-3 py-2 text-sm text-tafach-dark transition-colors duration-200 hover:bg-tafach-light hover:text-tafach-orange" to="/quick-and-easy" onClick={closeMobileMenu}>Quick & Easy</Link>
            <Link className="block rounded-md px-3 py-2 text-sm text-tafach-dark transition-colors duration-200 hover:bg-tafach-light hover:text-tafach-orange" to="/guides" onClick={closeMobileMenu}>Guides</Link>
          </div>

          {/* Mobile Auth/User Menu */}
          <div className="mt-6 flex flex-col gap-2">
            {isAnonymous ? (
              <>
                <Link
                  className="rounded-md border border-tafach-orange px-4 py-2 text-center font-semibold text-tafach-orange"
                  to="/login"
                  onClick={closeMobileMenu}
                >
                  Log In
                </Link>
                <Link
                  className="rounded-md bg-tafach-orange px-4 py-2 text-center font-semibold text-white"
                  to="/signup"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                {/* FIXED: Built a dedicated profile block with avatar, name, and email */}
                <div className="mb-2 px-2 flex items-center gap-3">
                  <img
                    src={user.avatarUrl || fallbackAvatar}
                    alt="avatar"
                    className="w-10 h-10 shrink-0 rounded-full object-cover ring-2 ring-tafach-orange/60"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <span className="truncate text-sm font-bold text-tafach-dark">{user.name || 'Chef'}</span>
                    <span className="truncate text-xs text-tafach-muted">{user.email || 'user@example.com'}</span>
                  </div>
                </div>
                
                <hr className="my-2 border-tafach-border/50" />
                
                <Link 
                  className="block rounded-md px-3 py-2 text-sm text-tafach-dark transition-colors hover:bg-tafach-light hover:text-tafach-orange" 
                  to="/account" 
                  onClick={closeMobileMenu}
                >
                  Profile
                </Link>
                <Link 
                  className="block rounded-md px-3 py-2 text-sm text-tafach-dark transition-colors hover:bg-tafach-light hover:text-tafach-orange" 
                  to="/create-recipe" 
                  onClick={closeMobileMenu}
                >
                  Create Recipe
                </Link>
                <Link 
                  className="block rounded-md px-3 py-2 text-sm text-tafach-dark transition-colors hover:bg-tafach-light hover:text-tafach-orange" 
                  to="/favorites" 
                  onClick={closeMobileMenu}
                >
                  Saved Recipes
                </Link>
                <button
                  className="mt-2 block w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-tafach-error transition-colors hover:bg-red-50"
                  onClick={handleLogout}
                >
                  Log Out
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    </header>
  );
}
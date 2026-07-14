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
      className="inline-flex items-center text-xl font-extrabold tracking-tight transition-opacity duration-200 hover:opacity-80 active:scale-95"
      to="/"
      onClick={onClick}
    >
      <span className="text-tafach-dark">Recipe</span>
      <span className="text-tafach-orange">Logo</span>
    </Link>
  );
}

function SearchForm({ searchQuery, onSearchChange, onSearchSubmit }) {
  return (
    <form className="flex w-full items-center sm:w-auto" onSubmit={onSearchSubmit}>
      <div className="relative flex w-full items-center group">
        <input
          className="tafach-input h-9 w-full min-w-[150px] rounded-l-md border border-r-0 border-tafach-border bg-gray-50/50 px-4 text-sm transition-colors focus:border-tafach-orange focus:bg-white focus:outline-none sm:w-48 lg:w-64"
          type="search"
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search recipes..."
          aria-label="Search recipes"
        />
        <button
          className="h-9 shrink-0 rounded-r-md bg-tafach-orange px-4 text-sm font-semibold text-white transition-colors duration-200 hover:bg-tafach-orange/90 active:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
          disabled={!searchQuery.trim()}
        >
          Search
        </button>
      </div>
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
        className="flex items-center justify-center rounded-full border-2 border-transparent transition duration-200 hover:border-tafach-orange active:scale-95"
        aria-label="Open user menu"
      >
        <img
          className="h-9 w-9 rounded-full object-cover shadow-sm"
          src={user.avatarUrl || fallbackAvatar}
          alt="User avatar"
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-52 z-50 rounded-lg border border-tafach-border bg-white py-2 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 border-b border-tafach-border/60 mb-1">
            <p className="text-xs font-semibold text-tafach-dark truncate">Hello, {user.name || 'Chef'}</p>
          </div>
          
          <Link
            to="/account"
            className="block px-4 py-2 text-sm font-medium text-tafach-dark transition-colors hover:bg-tafach-light hover:text-tafach-orange"
            onClick={() => setIsOpen(false)}
          >
            My Profile
          </Link>
          <Link
            to="/favorites"
            className="block px-4 py-2 text-sm font-medium text-tafach-dark transition-colors hover:bg-tafach-light hover:text-tafach-orange"
            onClick={() => setIsOpen(false)}
          >
            Saved Recipes
          </Link>
          <Link
            to="/create-recipe"
            className="block px-4 py-2 text-sm font-medium text-tafach-dark transition-colors hover:bg-tafach-light hover:text-tafach-orange"
            onClick={() => setIsOpen(false)}
          >
            Create Recipe
          </Link>
          
          <hr className="my-1 border-tafach-border/60" />
          
          <button
            onClick={() => {
              setIsOpen(false);
              onLogout();
            }}
            className="block w-full px-4 py-2 text-left text-sm font-medium text-tafach-error transition-colors hover:bg-red-50"
          >
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

// --- Main Header Component ---

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const isAnonymous = user.role === 'anonymous' || !user;

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

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; }
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-tafach-border shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6 md:py-4">
        
        {/* Left: Logo */}
        <div className="flex shrink-0 items-center">
          <BrandLogo onClick={closeMobileMenu} />
        </div>

        {/* Center: Main Navigation (Desktop) */}
        <div className="hidden flex-1 items-center justify-center gap-6 md:flex lg:gap-8">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              className="group relative text-[15px] font-medium text-tafach-dark transition-colors hover:text-tafach-orange"
              to={link.path}
            >
              {link.label}
              {/* Animated underline effect for production feel */}
              <span className="absolute -bottom-1.5 left-0 h-[2px] w-0 rounded-full bg-tafach-orange transition-all duration-300 group-hover:w-full"></span>
            </Link>
          ))}
        </div>

        {/* Right: Search & Actions (Desktop) */}
        <div className="hidden shrink-0 items-center justify-end gap-5 md:flex">
          <SearchForm
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
          />
          
          <div className="flex items-center pl-2 border-l border-tafach-border">
            {isAnonymous ? (
              <div className="flex shrink-0 items-center gap-3 pl-2">
                <Link
                  className="text-sm font-semibold text-tafach-dark transition hover:text-tafach-orange"
                  to="/login"
                >
                  Log In
                </Link>
                <Link
                  className="rounded-md bg-tafach-orange px-4 py-2 text-sm font-semibold text-white transition hover:bg-tafach-orange/90 active:scale-95"
                  to="/signup"
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="pl-3">
                <UserDropdown user={user} onLogout={handleLogout} />
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-tafach-dark transition-colors hover:bg-tafach-light md:hidden"
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          {/* Hamburger Icon */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <button
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
          type="button"
          onClick={closeMobileMenu}
          aria-label="Close menu"
          tabIndex={-1}
        />
      )}

      {/* Mobile Drawer Menu */}
      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-[280px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-tafach-border p-4">
          <BrandLogo onClick={closeMobileMenu} />
          <button
            className="flex h-8 w-8 items-center justify-center rounded-md text-tafach-muted hover:bg-tafach-light hover:text-tafach-dark"
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {/* Mobile Search */}
          <div className="mb-8 flex">
            <SearchForm
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={handleSearchSubmit}
            />
          </div>

          {/* Mobile Navigation Links */}
          <div className="flex flex-col gap-1 pb-6">
            <h3 className="mb-3 px-2 text-[11px] font-bold uppercase tracking-widest text-tafach-muted">
              Discover
            </h3>
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.path}
                className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-tafach-dark transition-colors hover:bg-orange-50 hover:text-tafach-orange" 
                to={link.path} 
                onClick={closeMobileMenu}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <hr className="border-tafach-border mb-6" />

          {/* Mobile Auth/User Menu */}
          <div className="flex flex-col gap-1">
            {isAnonymous ? (
              <div className="flex flex-col gap-3 mt-2">
                <Link
                  className="rounded-lg border-2 border-tafach-orange py-2.5 text-center text-sm font-bold text-tafach-orange transition-colors hover:bg-orange-50"
                  to="/login"
                  onClick={closeMobileMenu}
                >
                  Log In
                </Link>
                <Link
                  className="rounded-lg bg-tafach-orange py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-tafach-orange/90"
                  to="/signup"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </div>
            ) : (
              <>
                <h3 className="mb-3 px-2 text-[11px] font-bold uppercase tracking-widest text-tafach-muted flex items-center gap-3">
                  <img src={user.avatarUrl || fallbackAvatar} alt="avatar" className="w-5 h-5 rounded-full" />
                  My Account
                </h3>
                
                <Link 
                  className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-tafach-dark transition-colors hover:bg-tafach-light hover:text-tafach-orange" 
                  to="/account" 
                  onClick={closeMobileMenu}
                >
                  Profile
                </Link>
                <Link 
                  className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-tafach-dark transition-colors hover:bg-tafach-light hover:text-tafach-orange" 
                  to="/favorites" 
                  onClick={closeMobileMenu}
                >
                  Saved Recipes
                </Link>
                <Link 
                  className="block rounded-lg px-3 py-2.5 text-[15px] font-medium text-tafach-dark transition-colors hover:bg-tafach-light hover:text-tafach-orange" 
                  to="/create-recipe" 
                  onClick={closeMobileMenu}
                >
                  Create Recipe
                </Link>
                
                <button
                  className="mt-4 block w-full rounded-lg px-3 py-2.5 text-left text-[15px] font-medium text-tafach-error transition-colors hover:bg-red-50"
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
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

const fallbackAvatar =
  'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 80 80%22%3E%3Crect width=%2280%22 height=%2280%22 rx=%2240%22 fill=%22%23FF5733%22/%3E%3Ctext x=%2240%22 y=%2248%22 text-anchor=%22middle%22 font-family=%22Arial%2C sans-serif%22 font-size=%2228%22 font-weight=%22700%22 fill=%22white%22%3ETK%3C/text%3E%3C/svg%3E';

function BrandLink({ onClick }) {
  return (
    <Link
      className="inline-flex items-center text-lg font-bold transition-opacity duration-200 hover:opacity-80 active:scale-95"
      to="/"
      onClick={onClick}
    >
      <span className="text-tafach-dark">Tafach</span>
      <span className="ml-1 text-tafach-orange">Kitchen</span>
    </Link>
  );
}

function SearchForm({ searchQuery, onSearchChange, onSearchSubmit }) {
  return (
    <form className="flex items-center gap-grid-1" onSubmit={onSearchSubmit}>
      <input
        className="tafach-input h-10"
        type="search"
        value={searchQuery}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search recipes"
        aria-label="Search recipes"
      />
      <button
        className="h-10 rounded-md bg-tafach-orange px-grid-2 text-sm font-semibold text-white transition duration-200 hover:bg-tafach-orange/90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        type="submit"
        disabled={!searchQuery.trim()}
      >
        Search
      </button>
    </form>
  );
}

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isAnonymous = user.role === 'anonymous';
  const drawerClass = [
    'w-64 fixed inset-y-0 right-0 z-50 bg-white border-l border-tafach-border transition-transform duration-300 md:hidden',
    isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full',
  ].join(' ');

  function closeMobileMenu() {
    setIsMobileMenuOpen(false);
  }

  function handleSearchSubmit(event) {
    event.preventDefault();

    const normalizedQuery = searchQuery.trim();

    if (!normalizedQuery) {
      return;
    }

    navigate(`/?search=${encodeURIComponent(normalizedQuery)}`);
    closeMobileMenu();
  }

  function handleLogout() {
    logout();
    closeMobileMenu();
    navigate('/login', { replace: true });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-tafach-border bg-white text-tafach-dark shadow-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-grid-2 px-grid-2 py-grid-2">
        <BrandLink onClick={closeMobileMenu} />

        <div className="hidden items-center gap-grid-2 md:flex">
          <Link
            className="rounded-md px-grid-2 py-grid-1 text-sm font-semibold text-tafach-dark transition duration-200 hover:text-tafach-orange active:scale-95"
            to="/"
          >
            Recipes
          </Link>

          {isAnonymous ? (
            <>
              <Link
                className="rounded-md px-grid-2 py-grid-1 text-sm font-semibold text-tafach-dark transition duration-200 hover:text-tafach-orange active:scale-95"
                to="/login"
              >
                Log In
              </Link>
              <Link
                className="rounded-md bg-tafach-orange px-grid-2 py-grid-1 text-sm font-semibold text-white transition duration-200 hover:bg-tafach-orange/90 active:scale-95"
                to="/signup"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                className="rounded-md px-grid-2 py-grid-1 text-sm font-bold text-tafach-green transition duration-200 hover:text-tafach-green/80 active:scale-95"
                to="/recipes/new"
              >
                ➕ Create Recipe
              </Link>
              <SearchForm
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                onSearchSubmit={handleSearchSubmit}
              />
              <Link
                className="rounded-full border border-tafach-border p-1 transition duration-200 hover:border-tafach-orange active:scale-95"
                to="/account"
                aria-label="Open account profile"
              >
                <img
                  className="h-9 w-9 rounded-full object-cover"
                  src={user.avatarUrl || fallbackAvatar}
                  alt=""
                />
              </Link>
              <button
                className="rounded-md px-grid-2 py-grid-1 text-sm font-bold text-tafach-dark transition duration-200 hover:text-tafach-error active:scale-95"
                type="button"
                onClick={handleLogout}
              >
                Log Out
              </button>
            </>
          )}
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-tafach-border text-tafach-dark transition duration-200 hover:border-tafach-orange hover:text-tafach-orange active:scale-95 md:hidden"
          type="button"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="text-xl leading-none">☰</span>
        </button>
      </nav>

      {isMobileMenuOpen ? (
        <button
          className="fixed inset-0 z-40 bg-black bg-opacity-20 md:hidden"
          type="button"
          onClick={closeMobileMenu}
          aria-label="Close navigation menu backdrop"
        />
      ) : null}

      <aside className={drawerClass} aria-label="Mobile navigation menu">
        <div className="flex h-full flex-col gap-grid-3 p-grid-3">
          <div className="flex items-center justify-between gap-grid-2">
            <BrandLink onClick={closeMobileMenu} />
            <button
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-tafach-border text-tafach-dark transition duration-200 hover:border-tafach-error hover:text-tafach-error active:scale-95"
              type="button"
              onClick={closeMobileMenu}
              aria-label="Close navigation menu"
            >
              <span className="text-xl leading-none">×</span>
            </button>
          </div>

          <div className="flex flex-col gap-grid-1">
            <Link
              className="rounded-md px-grid-2 py-grid-2 text-base font-semibold text-tafach-dark transition duration-200 hover:bg-tafach-orange/10 hover:text-tafach-orange active:scale-95"
              to="/"
              onClick={closeMobileMenu}
            >
              Recipes
            </Link>

            {isAnonymous ? (
              <>
                <Link
                  className="rounded-md px-grid-2 py-grid-2 text-base font-semibold text-tafach-dark transition duration-200 hover:bg-tafach-orange/10 hover:text-tafach-orange active:scale-95"
                  to="/login"
                  onClick={closeMobileMenu}
                >
                  Log In
                </Link>
                <Link
                  className="rounded-md bg-tafach-orange px-grid-2 py-grid-2 text-base font-semibold text-white transition duration-200 hover:bg-tafach-orange/90 active:scale-95"
                  to="/signup"
                  onClick={closeMobileMenu}
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  className="rounded-md px-grid-2 py-grid-2 text-base font-bold text-tafach-green transition duration-200 hover:bg-tafach-green/10 hover:text-tafach-green/80 active:scale-95"
                  to="/recipes/new"
                  onClick={closeMobileMenu}
                >
                  ➕ Create Recipe
                </Link>
                <Link
                  className="flex items-center gap-grid-2 rounded-md border border-tafach-border p-grid-2 transition duration-200 hover:border-tafach-orange active:scale-95"
                  to="/account"
                  onClick={closeMobileMenu}
                >
                  <img
                    className="h-10 w-10 rounded-full object-cover"
                    src={user.avatarUrl || fallbackAvatar}
                    alt=""
                  />
                  <span className="min-w-0 truncate text-sm font-semibold">
                    {user.name || user.email || 'Kitchen Member'}
                  </span>
                </Link>
                <SearchForm
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onSearchSubmit={handleSearchSubmit}
                />
              </>
            )}
          </div>

          {!isAnonymous ? (
            <button
              className="mt-auto rounded-md px-grid-2 py-grid-2 text-left text-base font-bold text-tafach-dark transition duration-200 hover:text-tafach-error active:scale-95"
              type="button"
              onClick={handleLogout}
            >
              Log Out
            </button>
          ) : null}
        </div>
      </aside>
    </header>
  );
}

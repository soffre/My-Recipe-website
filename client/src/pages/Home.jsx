import { useQuery } from '@apollo/client/react';
import { Link, useNavigate } from 'react-router-dom';

import { GET_RECIPES } from '../api/operations/recipes';
import RecipeActions from '../components/RecipeActions';
import { useAuth } from '../context/AuthContext';
import { getFriendlyErrorMessage } from '../utils/errorMessage';

function NavigationBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const displayName = user.name || user.email || 'Kitchen Member';
  const avatarInitial = displayName.charAt(0).toUpperCase();

  function handleLogout() {
    logout();
    navigate('/login', { replace: true });
  }

  return (
    <header className="border-b border-tafach-border bg-white">
      <nav className="mx-auto flex max-w-6xl flex-col gap-grid-2 px-grid-2 py-grid-2 sm:flex-row sm:items-center sm:justify-between">
        <Link className="text-lg font-bold text-tafach-dark" to="/">
          The Tafach Kitchen Team
        </Link>

        {user.role === 'anonymous' ? (
          <div className="flex flex-wrap gap-grid-1">
            <Link
              className="rounded-md border border-tafach-border px-grid-2 py-grid-1 text-sm font-semibold text-tafach-dark transition-transform hover:border-tafach-orange hover:text-tafach-orange active:scale-95"
              to="/signup"
            >
              Sign Up
            </Link>
            <Link
              className="rounded-md bg-tafach-orange px-grid-2 py-grid-1 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-95"
              to="/login"
            >
              Log In
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-grid-2">
            {user.avatarUrl ? (
              <img
                className="h-10 w-10 rounded-full border border-tafach-border object-cover"
                src={user.avatarUrl}
                alt=""
              />
            ) : (
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-tafach-orange text-sm font-bold text-white">
                {avatarInitial}
              </span>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{displayName}</p>
              <p className="text-xs capitalize text-tafach-muted">{user.role}</p>
            </div>
            <Link
              className="rounded-md border border-tafach-border px-grid-2 py-grid-1 text-sm font-semibold text-tafach-dark transition-transform hover:border-tafach-orange hover:text-tafach-orange active:scale-95"
              to="/account"
            >
              Account
            </Link>
            <button
              className="rounded-md border border-tafach-border px-grid-2 py-grid-1 text-sm font-semibold text-tafach-dark transition-transform hover:border-tafach-orange hover:text-tafach-orange active:scale-95 disabled:opacity-50"
              type="button"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

function RecipeSkeletonGrid() {
  return (
    <div className="grid grid-cols-1 gap-grid-3 md:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <div
          className="animate-pulse rounded-lg border border-tafach-border bg-white p-grid-2"
          key={item}
        >
          <div className="mb-grid-2 aspect-[4/3] rounded-md bg-tafach-border" />
          <div className="mb-grid-1 h-5 rounded bg-tafach-border" />
          <div className="h-4 w-2/3 rounded bg-tafach-border" />
        </div>
      ))}
    </div>
  );
}

function RecipeCard({ recipe }) {
  const authorName = recipe.author?.name || 'Tafach Kitchen';
  const imageUrl = recipe.image_url;

  return (
    <article className="group overflow-hidden rounded-lg border border-tafach-border bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-tafach-orange hover:shadow-md">
      {imageUrl ? (
        <img
          className="aspect-[4/3] w-full bg-tafach-light object-cover transition duration-200 group-hover:scale-[1.02]"
          src={imageUrl}
          alt=""
        />
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-tafach-light text-sm font-semibold text-tafach-muted">
          No image
        </div>
      )}

      <div className="flex flex-col gap-grid-2 p-grid-2">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase text-tafach-orange">{authorName}</p>
          <h2 className="line-clamp-2 text-lg font-bold text-tafach-dark">{recipe.title}</h2>
          <p className="mt-grid-1 line-clamp-3 text-sm text-tafach-muted">
            {recipe.description || 'A Tafach Kitchen recipe ready for your collection.'}
          </p>
        </div>

        <RecipeActions authorId={recipe.author_id} recipeId={recipe.id} />
      </div>
    </article>
  );
}

export default function Home() {
  const { data, loading, error } = useQuery(GET_RECIPES);
  const recipes = data?.recipes ?? [];
  const errorMessage = error
    ? getFriendlyErrorMessage(error, 'Unable to load recipes right now.')
    : '';

  return (
    <div className="min-h-screen bg-tafach-light text-tafach-dark">
      <NavigationBar />

      <main className="mx-auto flex max-w-6xl flex-col gap-grid-3 px-grid-2 py-grid-4">
        <section className="flex flex-col gap-grid-1">
          <p className="text-sm font-semibold uppercase text-tafach-orange">Recipe Dashboard</p>
          <h1 className="text-3xl font-bold">Browse the latest kitchen recipes</h1>
          <p className="max-w-2xl text-tafach-muted">
            Guests can browse recipes, while members can like, bookmark, and manage their own work.
          </p>
        </section>

        {errorMessage ? (
          <div
            className="rounded-md border border-red-200 bg-red-50 px-grid-2 py-grid-2 text-sm font-medium text-red-700 shadow-sm"
            role="alert"
          >
            {errorMessage}
          </div>
        ) : null}

        {loading ? <RecipeSkeletonGrid /> : null}

        {!loading && recipes.length === 0 && !errorMessage ? (
          <div className="rounded-lg border border-tafach-border bg-white p-grid-3 text-tafach-muted">
            No recipes have been published yet.
          </div>
        ) : null}

        {!loading && recipes.length > 0 ? (
          <section className="grid grid-cols-1 gap-grid-3 md:grid-cols-3">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </section>
        ) : null}
      </main>
    </div>
  );
}

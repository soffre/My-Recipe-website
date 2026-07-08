import { Link } from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

export default function RecipeActions({ authorId, recipeId }) {
  const { user } = useAuth();
  const isAnonymous = user.role === 'anonymous';
  const isAuthor = user.id && user.id === authorId;

  if (isAnonymous) {
    return (
      <div className="grid gap-grid-1 sm:grid-cols-2">
        <button
          className="rounded-md border border-tafach-border bg-tafach-light px-grid-2 py-grid-1 text-sm font-semibold text-tafach-muted"
          type="button"
          disabled
        >
          🔑 Log in to Like
        </button>
        <button
          className="rounded-md border border-tafach-border bg-tafach-light px-grid-2 py-grid-1 text-sm font-semibold text-tafach-muted"
          type="button"
          disabled
        >
          🔑 Log in to Bookmark
        </button>
      </div>
    );
  }

  if (isAuthor) {
    return (
      <Link
        className="inline-flex items-center justify-center rounded-md bg-tafach-dark px-grid-2 py-grid-1 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-95"
        to={`/recipes/${recipeId}/edit`}
      >
        ✏️ Edit Recipe
      </Link>
    );
  }

  return (
    <div className="grid gap-grid-1 sm:grid-cols-2">
      <button
        className="rounded-md border border-tafach-border bg-white px-grid-2 py-grid-1 text-sm font-semibold text-tafach-dark transition hover:border-tafach-orange hover:text-tafach-orange active:scale-95"
        type="button"
      >
        Like
      </button>
      <button
        className="rounded-md bg-tafach-green px-grid-2 py-grid-1 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-95"
        type="button"
      >
        Bookmark
      </button>
    </div>
  );
}

import { useQuery } from '@apollo/client/react';
import { Link } from 'react-router-dom';

import { GET_RECIPES } from '../api/operations/recipes';
import RecipeActions from '../components/RecipeActions';
import Header from '../components/Header'; // Imported the new Header
import { getFriendlyErrorMessage } from '../utils/errorMessage';

// --- Sub-components ---

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
    <article className="group flex h-full flex-col overflow-hidden rounded-lg border border-tafach-border bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:border-tafach-orange hover:shadow-md">
      {imageUrl ? (
        <img
          className="aspect-[4/3] w-full bg-tafach-light object-cover transition duration-200 group-hover:scale-[1.02]"
          src={imageUrl}
          alt={recipe.title}
        />
      ) : (
        <div className="flex aspect-[4/3] w-full items-center justify-center bg-tafach-light text-sm font-semibold text-tafach-muted">
          No image
        </div>
      )}

      <div className="flex flex-1 flex-col gap-grid-2 p-grid-2">
        <div className="flex-1">
          <p className="mb-1 text-xs font-semibold uppercase text-tafach-orange">{authorName}</p>
          <h2 className="line-clamp-2 text-lg font-bold text-tafach-dark">{recipe.title}</h2>
          <p className="mt-grid-1 line-clamp-3 text-sm text-tafach-muted">
            {recipe.description || 'A delicious recipe ready for your collection.'}
          </p>
        </div>

        <RecipeActions authorId={recipe.author_id} recipeId={recipe.id} />
      </div>
    </article>
  );
}

function Footer() {
  return (
    <footer className="mt-auto bg-tafach-dark pt-grid-4 pb-grid-2 text-tafach-light">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-grid-3 px-4 md:flex-row md:px-6">
        
        {/* Footer Logo & Tagline */}
        <div className="flex flex-col items-center md:items-start">
          <Link to="/" className="text-xl font-bold transition hover:opacity-80">
            <span className="text-white">Recipe</span>
            <span className="ml-1 text-tafach-orange">Logo</span>
          </Link>
          <p className="mt-grid-1 text-sm text-tafach-muted">
            Discover, cook, and share the best recipes.
          </p>
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-wrap justify-center gap-grid-3 text-sm font-semibold">
          <Link to="/" className="transition hover:text-tafach-orange">Recipes</Link>
          <Link to="/ingredients" className="transition hover:text-tafach-orange">Ingredients</Link>
          <Link to="/about" className="transition hover:text-tafach-orange">About Us</Link>
          <Link to="/contact" className="transition hover:text-tafach-orange">Contact</Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="mx-auto mt-grid-4 max-w-7xl border-t border-tafach-muted/30 px-4 pt-grid-2 text-center text-xs text-tafach-muted md:px-6">
        &copy; {new Date().getFullYear()} Recipe Logo. All rights reserved.
      </div>
    </footer>
  );
}

// --- Main Page Component ---

export default function Home() {
  const { data, loading, error } = useQuery(GET_RECIPES);
  const recipes = data?.recipes ?? [];
  const errorMessage = error
    ? getFriendlyErrorMessage(error, 'Unable to load recipes right now.')
    : '';

  return (
    <div className="flex min-h-screen flex-col bg-tafach-light text-tafach-dark">
      <Header />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-grid-3 px-4 py-grid-4 md:px-6">
        <section className="flex flex-col gap-grid-1">
          <p className="text-sm font-semibold uppercase tracking-wider text-tafach-orange">
            Recipe Dashboard
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">Browse the latest recipes</h1>
          <p className="max-w-2xl text-base text-tafach-muted">
            Guests can browse recipes, while members can like, bookmark, and manage their own culinary creations.
          </p>
        </section>

        {errorMessage ? (
          <div
            className="rounded-md border border-tafach-error/30 bg-red-50 px-grid-2 py-grid-2 text-sm font-medium text-tafach-error shadow-sm"
            role="alert"
          >
            {errorMessage}
          </div>
        ) : null}

        {loading ? <RecipeSkeletonGrid /> : null}

        {!loading && recipes.length === 0 && !errorMessage ? (
          <div className="rounded-lg border border-tafach-border bg-white p-grid-4 text-center text-tafach-muted shadow-sm">
            No recipes have been published yet. Be the first to create one!
          </div>
        ) : null}

        {!loading && recipes.length > 0 ? (
          <section className="grid grid-cols-1 gap-grid-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </section>
        ) : null}
      </main>

      <Footer />
    </div>
  );
}
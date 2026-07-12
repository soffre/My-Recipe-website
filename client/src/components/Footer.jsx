import { Link } from "react-router-dom";

export default function Footer() {
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

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, ArrowRight, Sparkles, ChefHat, Heart, Bookmark, Flame, BookOpen, ChevronRight } from 'lucide-react';

// --- MOCK DATA FOR EDITORIAL SECTIONS ---

const CATEGORIES = [
  { id: 'all', label: 'All Recipes', icon: Sparkles },
  { id: 'traditional', label: 'Traditional', icon: ChefHat },
  { id: 'quick', label: 'Quick Dinners', icon: Clock },
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: 'masterclasses', label: 'Masterclasses', icon: BookOpen },
];

const MOCK_TRENDING_RECIPES = [
  {
    id: "rec_1",
    title: "Authentic Ethiopian Doro Wat with Soft Eggs",
    description: "Slow-cooked chicken stew infused with hand-blended berbere and golden niter kibbeh.",
    image_url: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=800",
    author: { name: "Chef Amanuel", id: "auth_1" },
    cookTime: "90m",
    rating: 4.9,
    category: "traditional"
  },
  {
    id: "rec_2",
    title: "Spicy Red Lentil Misir Wat",
    description: "Velvety plant-based stew with garlic, ginger, and aromatic spices.",
    image_url: "https://images.unsplash.com/photo-1548943487-a2e4d43b4850?auto=format&fit=crop&q=80&w=800",
    author: { name: "Betty Tesfaye", id: "auth_2" },
    cookTime: "40m",
    rating: 4.8,
    category: "quick"
  },
  {
    id: "rec_3",
    title: "Pan-Roasted Awaze Beef Tibs",
    description: "Tender beef cubes tossed with red onions, fresh jalapeños, and rosemary glaze.",
    image_url: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=800",
    author: { name: "Chef Marcus", id: "auth_4" },
    cookTime: "25m",
    rating: 4.9,
    category: "trending"
  },
  {
    id: "rec_4",
    title: "Bubbling Shiro Tegamino Claypot",
    description: "Finely ground chickpea reduction simmered with garlic and kibbeh butter.",
    image_url: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&q=80&w=800",
    author: { name: "Tafach Kitchen", id: "auth_3" },
    cookTime: "30m",
    rating: 4.7,
    category: "traditional"
  }
];

const CURATED_COLLECTIONS = [
  {
    id: 'col_1',
    title: 'Weekend Feast Inspirations',
    chapter: 'Chapter 01',
    count: '12 Recipes',
    description: 'Slow-simmered centerpieces and communal platters crafted for memorable family gatherings.',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745a872f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'col_2',
    title: '15-Minute Weeknight Dinners',
    chapter: 'Chapter 02',
    count: '24 Recipes',
    description: 'High-flavor, low-effort meals engineered with smart pantry techniques.',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'col_3',
    title: 'Mastering Ancient Grains',
    chapter: 'Chapter 03',
    count: '8 Recipes',
    description: 'Technique guides for fermentation, teff sourdough flatbreads, and heirloom grains.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800'
  }
];

const FEATURED_CHEF = {
  name: "Chef Samuel Kassaye",
  title: "Executive Culinary Director",
  bio: "Bridging East African heirloom traditions with modern gastronomic finesse. Samuel leads the Tafach test kitchen with an uncompromising dedication to flavor integrity.",
  avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600",
  publishedCount: "48 Recipes"
};

// --- EDITORIAL RECIPE CARD SUB-COMPONENT ---
function RecipeCard({ recipe }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <article className="aspect-[4/5] rounded-xl overflow-hidden relative shadow-sm group bg-white hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-pointer border border-tafach-border/50">
      {/* Background Image */}
      <img
        className="w-full h-full object-cover group-hover:scale-105 duration-700 ease-out transition-transform"
        src={recipe.image_url}
        alt={recipe.title}
      />

      {/* Dark Gradient Overlay Mask */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-90 transition-opacity duration-300" />

      {/* Top Floating Actions (Like / Save) */}
      <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsLiked(!isLiked);
          }}
          className={`p-2 rounded-full backdrop-blur-md transition-all active:scale-95 transition-transform ${
            isLiked
              ? 'bg-tafach-orange text-white shadow-md'
              : 'bg-black/30 text-white/90 hover:bg-black/50 hover:text-white'
          }`}
          aria-label="Like recipe"
        >
          <Heart size={14} className={isLiked ? 'fill-white' : ''} />
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsSaved(!isSaved);
          }}
          className={`p-2 rounded-full backdrop-blur-md transition-all active:scale-95 transition-transform ${
            isSaved
              ? 'bg-tafach-orange text-white shadow-md'
              : 'bg-black/30 text-white/90 hover:bg-black/50 hover:text-white'
          }`}
          aria-label="Save recipe"
        >
          <Bookmark size={14} className={isSaved ? 'fill-white' : ''} />
        </button>
      </div>

      {/* Content Overlay directly ON TOP of the image */}
      <div className="absolute bottom-0 inset-x-0 p-grid-3 flex flex-col justify-end text-white z-10">
        <div className="flex items-center justify-between text-[11px] font-semibold tracking-wider uppercase text-white/70 mb-1.5">
          <span className="text-tafach-orange font-bold">{recipe.category}</span>
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {recipe.cookTime}
          </span>
        </div>

        <Link to={`/recipes/${recipe.id}`} className="group-hover:text-tafach-orange transition-colors">
          <h3 className="font-bold text-base md:text-lg text-white leading-snug line-clamp-2 tracking-tight">
            {recipe.title}
          </h3>
        </Link>

        {/* Bottom Author & Rating Overlay */}
        <div className="mt-3 pt-2.5 border-t border-white/20 flex items-center justify-between text-xs font-medium text-white/90">
          <span className="truncate max-w-[130px] font-normal text-white/80">{recipe.author.name}</span>
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/10 text-[11px]">
            <Star size={11} className="fill-tafach-orange text-tafach-orange" />
            <span className="font-bold">{recipe.rating}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

// --- MAIN EDITORIAL LANDING PAGE ---
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredRecipes = MOCK_TRENDING_RECIPES.filter((recipe) => {
    return selectedCategory === 'all' || recipe.category === selectedCategory;
  });

  return (
    <div className="min-h-screen bg-tafach-light text-tafach-dark font-brand selection:bg-tafach-orange selection:text-white">
      
      {/* 1. THE CINEMATIC ASYMMETRIC HERO SECTION */}
      <section className="max-w-7xl mx-auto px-grid-3 md:px-grid-4 pt-grid-3 md:pt-grid-4 pb-grid-2">
        <div className="bg-white rounded-3xl md:rounded-[2.5rem] border border-tafach-border py-grid-6 md:py-grid-8 px-grid-4 md:px-grid-6 shadow-sm overflow-hidden relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-grid-4 lg:gap-grid-6">
          
          {/* Left Side (60% width on desktop) */}
          <div className="w-full lg:w-[60%] flex flex-col justify-center items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tafach-orange/10 border border-tafach-orange/20 text-tafach-orange text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles size={13} /> The Culinary Journal
            </div>

            <h1 className="text-4xl md:text-7xl font-extrabold text-tafach-dark tracking-tighter leading-none">
              Cook with <br />
              confidence. <br />
              <span className="text-tafach-dark/80">Savor every bite.</span>
            </h1>

            <p className="text-sm md:text-base text-tafach-muted max-w-sm font-medium mt-4">
              Curated recipes and editorial culinary masterclasses crafted for the modern aesthetic kitchen.
            </p>

            <div className="mt-grid-3 md:mt-grid-4 flex items-center gap-grid-2">
              <Link
                to="/explore"
                className="bg-tafach-dark text-white rounded-full px-grid-4 py-3 font-semibold text-xs uppercase tracking-widest active:scale-95 transition-transform inline-flex items-center gap-2 hover:bg-tafach-dark/90 shadow-sm"
              >
                Explore Recipes
                <ArrowRight size={14} className="text-tafach-orange" />
              </Link>
            </div>
          </div>

          {/* Right Side (40% width on desktop) */}
          <div className="w-full lg:w-[40%] flex justify-center lg:justify-end">
            <div className="w-full aspect-[3/4] max-h-[500px] rounded-2xl overflow-hidden shadow-sm relative group bg-tafach-border">
              <img
                src="https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&q=80&w=1000"
                alt="Editorial Culinary Creation"
                className="w-full h-full object-cover group-hover:scale-105 duration-700 ease-out transition-transform"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
              
              <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md px-4 py-3 rounded-xl border border-white/40 shadow-sm flex items-center justify-between text-xs text-tafach-dark font-medium">
                <div>
                  <span className="block font-bold text-tafach-dark">Cover Story</span>
                  <span className="text-[11px] text-tafach-muted">Artisanal Flavor Profiles</span>
                </div>
                <span className="text-tafach-orange font-bold tracking-widest uppercase text-[10px] bg-tafach-orange/10 px-2 py-1 rounded">
                  Issue #14
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

      {/* 2. THE EDITORIAL TRENDING CAROUSEL FEED */}
      <section className="py-grid-6 md:py-grid-8 max-w-7xl mx-auto px-grid-3 md:px-grid-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-grid-2 mb-grid-4">
          <div>
            <h2 className="text-xl md:text-3xl font-black text-tafach-dark tracking-tight mb-2">
              Trending Inspirations
            </h2>
            <p className="text-xs md:text-sm text-tafach-muted font-medium">
              Hand-selected culinary creations tested and refined in our studio.
            </p>
          </div>

          {/* Minimal Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {CATEGORIES.map((cat) => {
              const IconComp = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all active:scale-95 transition-transform ${
                    isActive
                      ? 'bg-tafach-dark text-white shadow-sm'
                      : 'bg-white text-tafach-muted border border-tafach-border hover:border-tafach-dark/30 hover:text-tafach-dark'
                  }`}
                >
                  <IconComp size={13} className={isActive ? 'text-tafach-orange' : 'text-tafach-muted'} />
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Responsive Grid Feed */}
        {filteredRecipes.length === 0 ? (
          <div className="bg-white rounded-2xl border border-tafach-border p-grid-6 text-center">
            <p className="text-sm font-medium text-tafach-muted">No recipes found for this filter.</p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="mt-3 text-xs font-bold text-tafach-orange uppercase tracking-wider active:scale-95 transition-transform hover:underline"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-grid-3">
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </section>

      {/* 3. THE "EXPLORE COLLECTIONS" CURATED GRID SECTION */}
      <section className="py-grid-6 md:py-grid-8 max-w-7xl mx-auto px-grid-3 md:px-grid-4 border-t border-tafach-border">
        <div className="flex items-center justify-between mb-grid-4">
          <div>
            <h2 className="text-xl md:text-3xl font-black text-tafach-dark tracking-tight mb-1">
              Explore Collections
            </h2>
            <p className="text-xs md:text-sm text-tafach-muted font-medium">
              Expansive culinary chapters designed for every dining occasion.
            </p>
          </div>
          <Link
            to="/explore"
            className="hidden sm:inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-tafach-dark hover:text-tafach-orange active:scale-95 transition-transform"
          >
            View All <ChevronRight size={14} />
          </Link>
        </div>

        {/* 3 Wide, Horizontally Expansive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-grid-3">
          {CURATED_COLLECTIONS.map((col) => (
            <Link
              key={col.id}
              to="/explore"
              className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-tafach-border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 active:scale-95"
            >
              {/* Large Photography Window */}
              <div className="aspect-[16/10] relative overflow-hidden bg-tafach-light">
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-3 right-3">
                  <span className="bg-white/95 backdrop-blur-md text-tafach-orange font-bold text-xs px-3 py-1 rounded-full shadow-sm border border-tafach-border">
                    {col.count}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3">
                  <span className="bg-black/60 backdrop-blur-md text-white font-medium text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded">
                    {col.chapter}
                  </span>
                </div>
              </div>

              {/* Minimal Banner with Whitespace */}
              <div className="p-grid-3 flex flex-col justify-between flex-grow">
                <div>
                  <h3 className="text-lg font-bold text-tafach-dark group-hover:text-tafach-orange transition-colors">
                    {col.title}
                  </h3>
                  <p className="text-xs text-tafach-muted mt-1.5 font-medium leading-relaxed line-clamp-2">
                    {col.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-tafach-border/60 flex items-center justify-between text-xs font-bold text-tafach-dark group-hover:text-tafach-orange transition-colors">
                  <span>Browse Chapter</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. EDITORIAL CHEF SPOTLIGHT */}
      <section className="py-grid-6 md:py-grid-8 max-w-7xl mx-auto px-grid-3 md:px-grid-4 border-t border-tafach-border">
        <div className="bg-white rounded-3xl border border-tafach-border p-grid-4 md:p-grid-6 shadow-sm overflow-hidden relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-grid-4 items-center">
            
            <div className="lg:col-span-4 flex justify-center">
              <div className="relative aspect-square w-48 md:w-56 rounded-2xl overflow-hidden shadow-md border-2 border-white">
                <img
                  src={FEATURED_CHEF.avatar}
                  alt={FEATURED_CHEF.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col items-start">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-tafach-orange bg-tafach-orange/10 px-2.5 py-1 rounded-full mb-3">
                Culinary Director Spotlight
              </span>

              <h2 className="text-2xl md:text-4xl font-extrabold text-tafach-dark tracking-tight">
                {FEATURED_CHEF.name}
              </h2>
              <p className="text-xs md:text-sm font-semibold text-tafach-muted mt-1">
                {FEATURED_CHEF.title}
              </p>

              <blockquote className="mt-4 text-sm text-tafach-dark/80 italic font-medium leading-relaxed max-w-xl">
                &ldquo;{FEATURED_CHEF.bio}&rdquo;
              </blockquote>

              <div className="mt-6 flex items-center gap-grid-3">
                <Link
                  to="/explore"
                  className="bg-tafach-dark text-white rounded-full px-grid-4 py-2.5 font-semibold text-xs uppercase tracking-widest active:scale-95 transition-transform hover:bg-tafach-dark/90 inline-flex items-center gap-2"
                >
                  Read Masterclasses
                  <ArrowRight size={13} className="text-tafach-orange" />
                </Link>
                <span className="text-xs font-bold text-tafach-muted">
                  {FEATURED_CHEF.publishedCount}
                </span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. MINIMALIST DIGEST NEWSLETTER */}
      <section className="py-grid-6 md:py-grid-8 bg-white border-t border-tafach-border">
        <div className="max-w-3xl mx-auto text-center px-grid-3">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-tafach-orange block mb-2">
            Stay Inspired
          </span>
          <h2 className="text-2xl md:text-4xl font-extrabold text-tafach-dark tracking-tight mb-3">
            The Tafach Weekly Edition
          </h2>
          <p className="text-xs md:text-sm text-tafach-muted font-medium mb-grid-4 max-w-md mx-auto">
            Delivered every Sunday. Exclusive chef notes, seasonal pairings, and early access to new recipe modules.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full sm:flex-1 bg-tafach-light border border-tafach-border rounded-full px-grid-3 py-3 text-xs text-tafach-dark placeholder:text-tafach-muted focus:outline-none focus:border-tafach-orange transition-colors"
              required
            />
            <button
              type="submit"
              className="w-full sm:w-auto bg-tafach-dark text-white rounded-full px-grid-4 py-3 font-semibold text-xs uppercase tracking-widest active:scale-95 transition-transform hover:bg-tafach-dark/90 shrink-0"
            >
              Subscribe
            </button>
          </form>

          <p className="text-[10px] text-tafach-muted mt-3">
            No spam ever. Unsubscribe with a single click.
          </p>
        </div>
      </section>

    </div>
  );
}
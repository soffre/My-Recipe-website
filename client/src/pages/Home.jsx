import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Star, ArrowRight, BookOpen, Flame, Sparkles, ChefHat, Heart, Bookmark } from 'lucide-react';

// --- MOCK DATA FOR RICH SECTIONS ---

const CATEGORIES = [
  { id: 'all', label: 'All Recipes', icon: Sparkles },
  { id: 'quick', label: 'Quick & Easy', icon: Clock },
  { id: 'traditional', label: 'Traditional', icon: ChefHat },
  { id: 'trending', label: 'Trending', icon: Flame },
  { id: 'baking', label: 'Baking & Bread', icon: BookOpen },
];

const MOCK_TRENDING_RECIPES = [
  {
    id: "rec_1",
    title: "Authentic Ethiopian Doro Wat with Hard-Boiled Eggs",
    description: "A slow-cooked, rich chicken stew infused with hand-blended Berbere spices and aromatic niter kibbeh.",
    image_url: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=800",
    author: { name: "Chef Amanuel", id: "auth_1" },
    cookTime: "90m",
    rating: 4.9,
    category: "traditional"
  },
  {
    id: "rec_2",
    title: "Spicy Red Lentil Misir Wat",
    description: "A velvety plant-based stew made with split red lentils, garlic, ginger, and robust berbere seasoning.",
    image_url: "https://images.unsplash.com/photo-1548943487-a2e4d43b4850?auto=format&fit=crop&q=80&w=800",
    author: { name: "Betty Tesfaye", id: "auth_2" },
    cookTime: "40m",
    rating: 4.8,
    category: "quick"
  },
  {
    id: "rec_3",
    title: "Crispy Pan-Roasted Awaze Tibs",
    description: "Tender cubed beef tossed with red onions, fresh jalapeños, rosemary, and a spicy awaze glaze.",
    image_url: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=800",
    author: { name: "Chef Marcus", id: "auth_4" },
    cookTime: "25m",
    rating: 4.9,
    category: "trending"
  },
  {
    id: "rec_4",
    title: "Traditional Bubbling Shiro Tegamino",
    description: "Finely ground chickpea flour simmered with onions and garlic, served piping hot in a clay pot.",
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
    count: '12 Recipes',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745a872f?auto=format&fit=crop&q=80&w=800',
    tag: 'Popular'
  },
  {
    id: 'col_2',
    title: '15-Minute Weeknight Dinners',
    count: '24 Recipes',
    image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&q=80&w=800',
    tag: 'Fast'
  },
  {
    id: 'col_3',
    title: 'Mastering Ancient Grains & Teff',
    count: '8 Guides',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&q=80&w=800',
    tag: 'Expert'
  }
];

const FEATURED_CHEF = {
  name: "Chef Samuel Kassaye",
  role: "Executive Culinary Consultant",
  bio: "With over 15 years of experience bridging traditional East African flavor profiles with modern gastronomic techniques, Samuel leads our recipe testing kitchen.",
  avatar: "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600",
  recipesCount: 48
};

// --- Sub-components ---

function RecipeCard({ recipe }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-tafach-border/60 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-tafach-orange/30">
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          className="h-full w-full bg-tafach-light object-cover transition duration-700 group-hover:scale-105"
          src={recipe.image_url}
          alt={recipe.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-60" />
        
        {/* Rating Badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1 rounded-md bg-white/95 px-2 py-1 text-xs font-semibold text-tafach-dark backdrop-blur-sm shadow-sm">
          <Star size={12} className="fill-tafach-orange text-tafach-orange" />
          {recipe.rating}
        </div>

        {/* Quick Actions (Like/Save) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <button 
            onClick={() => setIsLiked(!isLiked)}
            className={`rounded-md p-1.5 backdrop-blur-sm transition active:scale-95 ${isLiked ? 'bg-tafach-orange text-white shadow-sm' : 'bg-white/90 text-tafach-dark hover:bg-white shadow-sm hover:text-tafach-orange'}`}
            aria-label="Like recipe"
          >
            <Heart size={14} className={isLiked ? 'fill-white' : ''} />
          </button>
          <button 
            onClick={() => setIsSaved(!isSaved)}
            className={`rounded-md p-1.5 backdrop-blur-sm transition active:scale-95 ${isSaved ? 'bg-tafach-orange text-white shadow-sm' : 'bg-white/90 text-tafach-dark hover:bg-white shadow-sm hover:text-tafach-orange'}`}
            aria-label="Bookmark recipe"
          >
            <Bookmark size={14} className={isSaved ? 'fill-white' : ''} />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-tafach-muted">
            <span className="text-tafach-orange">{recipe.author?.name}</span>
            <span className="flex items-center gap-1 lowercase">
              <Clock size={12} /> {recipe.cookTime}
            </span>
          </div>
          <h3 className="line-clamp-2 text-base font-bold leading-tight text-tafach-dark transition group-hover:text-tafach-orange">
            {recipe.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-sm text-tafach-muted leading-relaxed">
            {recipe.description}
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-tafach-border/40 pt-3">
          <Link 
            to={`/recipes/${recipe.id}`} 
            className="inline-flex items-center gap-1 text-xs font-semibold text-tafach-dark transition hover:text-tafach-orange"
          >
            View Recipe <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

// --- Main Page Component ---

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredRecipes = MOCK_TRENDING_RECIPES.filter(recipe => {
    return selectedCategory === 'all' || recipe.category === selectedCategory;
  });

  return (
    <div className="flex min-h-screen flex-col bg-white text-tafach-dark font-brand rounded-3xl">
      
      {/* PROFESSIONAL, CLEAN HERO SECTION */}
      <section className="relative border-b border-tafach-border/50 bg-white pt-10 pb-16 lg:pt-20 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            
            {/* Left Copy */}
            <div className="flex flex-col">
              <div className="inline-flex items-center gap-2 self-start rounded-full border border-tafach-orange/30 bg-tafach-orange/10 px-3 py-1 text-xs font-medium text-tafach-orange">
                <Sparkles size={14} /> Discover over 1,200+ Tested Recipes
              </div>
              <h1 className="mt-6 text-4xl font-bold tracking-tight text-tafach-dark sm:text-5xl lg:text-6xl leading-[1.15]">
                Cook with confidence. <br className="hidden lg:block" />
                <span className="text-tafach-muted">Savor every bite.</span>
              </h1>
              <p className="mt-5 text-base text-tafach-muted sm:text-lg max-w-lg leading-relaxed">
                Explore step-by-step masterclasses, organize your weekly dinner menus, and elevate your home cooking with professional guidance.
              </p>

              {/* Clean CTA Buttons using Primary Color */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 max-w-lg">
                <Link 
                  to="/explore"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-tafach-orange px-8 py-3.5 text-sm font-medium text-white transition hover:opacity-90 active:scale-95 shadow-sm"
                >
                  Explore Recipes
                </Link>
                <Link 
                  to="/guides"
                  className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg border border-tafach-orange/30 bg-white px-8 py-3.5 text-sm font-medium text-tafach-orange transition hover:bg-tafach-orange/5 active:scale-95"
                >
                  View Guides
                </Link>
              </div>
            </div>

            {/* Right Side: Clean Single Image Highlight */}
            <div className="hidden lg:block relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-tafach-border/50">
                <img 
                  src="https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=800" 
                  alt="Featured culinary dish"
                  className="h-full w-full object-cover"
                />
              </div>
              
              {/* Floating Clean Stat Card */}
              <div className="absolute -bottom-6 -left-6 rounded-xl border border-tafach-border/50 bg-white p-4 shadow-sm backdrop-blur-md max-w-[200px]">
                <div className="flex items-center gap-2 mb-1">
                  <Star size={14} className="fill-tafach-orange text-tafach-orange" />
                  <span className="text-sm font-bold text-tafach-dark">4.9/5 Rating</span>
                </div>
                <p className="text-xs text-tafach-muted leading-tight">Highly rated by our community of home cooks.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* MAIN CONTENT CONTAINER */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-20 px-4 py-16 md:px-6">
        
        {/* SECTION 1: CATEGORY TABS & TRENDING FEED */}
        <section>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-tafach-dark">Trending Recipes</h2>
              <p className="text-sm text-tafach-muted mt-1">Hand-selected culinary inspirations for you.</p>
            </div>

            {/* Category Filter Pills using Primary Color */}
            <div className="flex flex-wrap items-center gap-1.5">
              {CATEGORIES.map(cat => {
                const IconComponent = cat.icon;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-medium transition-all border ${
                      isActive 
                        ? 'border-tafach-orange bg-tafach-orange text-white shadow-sm' 
                        : 'border-tafach-border/60 bg-white text-tafach-muted hover:border-tafach-orange/40 hover:text-tafach-orange'
                    }`}
                  >
                    <IconComponent size={14} />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>

          {filteredRecipes.length === 0 ? (
            <div className="rounded-xl border border-tafach-border/50 bg-tafach-light/30 p-12 text-center">
              <p className="text-base font-medium text-tafach-dark">No recipes found for this category.</p>
              <button 
                onClick={() => setSelectedCategory('all')} 
                className="mt-3 text-sm text-tafach-orange hover:underline"
              >
                View all recipes
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          )}
        </section>

        {/* SECTION 2: CLEAN CURATED COLLECTIONS */}
        <section>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-tafach-dark">Explore Collections</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CURATED_COLLECTIONS.map(col => (
              <Link key={col.id} to="/explore" className="group block">
                <div className="overflow-hidden rounded-xl border border-tafach-border/50 aspect-[16/10]">
                  <img 
                    src={col.image} 
                    alt={col.title} 
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-tafach-dark group-hover:text-tafach-orange transition">
                    {col.title}
                  </h3>
                  <span className="text-xs font-medium text-tafach-orange bg-tafach-orange/10 px-2.5 py-1 rounded-md">
                    {col.count}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SECTION 3: REFINED FEATURED CHEF SPOTLIGHT */}
        <section className="rounded-2xl bg-tafach-orange/5 border border-tafach-orange/20 p-8 md:p-12">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            <div className="lg:col-span-3 flex justify-center lg:justify-start">
              <img 
                src={FEATURED_CHEF.avatar} 
                alt={FEATURED_CHEF.name} 
                className="h-40 w-40 rounded-full object-cover shadow-sm ring-4 ring-white"
              />
            </div>
            
            <div className="lg:col-span-9 flex flex-col justify-center text-center lg:text-left">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-tafach-orange mb-1">Featured Culinary Director</span>
              <h2 className="text-2xl font-bold text-tafach-dark">{FEATURED_CHEF.name}</h2>
              <p className="text-sm font-medium text-tafach-muted mt-0.5">{FEATURED_CHEF.role}</p>
              
              <p className="mt-4 text-tafach-dark/80 text-sm leading-relaxed max-w-2xl">
                "{FEATURED_CHEF.bio}"
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-xl font-bold text-tafach-dark">{FEATURED_CHEF.recipesCount}</span>
                  <span className="text-xs font-medium text-tafach-muted">Published Recipes</span>
                </div>
                
                <Link to="/explore" className="rounded-lg bg-white border border-tafach-orange/30 px-5 py-2 text-sm font-medium text-tafach-orange transition hover:bg-tafach-orange hover:text-white shadow-sm">
                  View Profile
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4: MINIMALIST NEWSLETTER */}
        <section className="rounded-2xl border border-tafach-border/50 bg-tafach-light/50 px-6 py-12 text-center md:px-12 md:py-16">
          <div className="mx-auto max-w-xl">
            <h2 className="text-2xl font-bold text-tafach-dark mb-2">Never miss a recipe.</h2>
            <p className="text-sm text-tafach-muted mb-6">
              Get hand-picked dinner concepts and exclusive chef advice sent directly to your inbox every week.
            </p>
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full rounded-lg border border-tafach-border bg-white px-4 py-2.5 text-sm text-tafach-dark focus:border-tafach-orange focus:outline-none focus:ring-1 focus:ring-tafach-orange transition shadow-inner"
                required
              />
              <button type="submit" className="shrink-0 rounded-lg bg-tafach-orange px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-90 shadow-sm">
                Subscribe
              </button>
            </form>
            <p className="mt-3 text-[11px] text-tafach-muted">We respect your inbox. Unsubscribe at any time.</p>
          </div>
        </section>

      </main>
    </div>
  );
}
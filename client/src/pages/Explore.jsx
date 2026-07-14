import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Star, Clock, Heart, SlidersHorizontal, RotateCcw, Search, ChevronLeft, ChevronRight } from 'lucide-react';

// 🍳 PRODUCTION MOCK CATALOGUE DATA DATASET
const mockCatalogueRecipes = [
  { id: "rec_1", title: "Authentic Ethiopian Doro Wat", cuisine: "Ethiopian", categories: ["Dinner", "Traditional", "Spicy"], prepTime: 30, cookTime: 90, avgRating: 4.9, likesCount: 142, creatorName: "Amanuel Fentahun", thumbnail: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=600" },
  { id: "rec_2", title: "Classic Italian Lasagna Bolognese", cuisine: "Italian", categories: ["Dinner", "Traditional"], prepTime: 20, cookTime: 60, avgRating: 4.8, likesCount: 98, creatorName: "Chef Betty", thumbnail: "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=600" },
  { id: "rec_3", title: "Traditional Kitfo with Ayibe", cuisine: "Ethiopian", categories: ["Lunch", "Traditional"], prepTime: 15, cookTime: 10, avgRating: 4.7, likesCount: 115, creatorName: "Amanuel Fentahun", thumbnail: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&q=80&w=600" },
  { id: "rec_4", title: "French Onion Soup Gratinée", cuisine: "French", categories: ["Dinner", "Lunch"], prepTime: 25, cookTime: 45, avgRating: 4.6, likesCount: 64, creatorName: "Chef Marcus", thumbnail: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=600" },
  { id: "rec_5", title: "Spicy Thai Green Curry", cuisine: "Asian Fusion", categories: ["Dinner", "Spicy"], prepTime: 15, cookTime: 20, avgRating: 4.5, likesCount: 82, creatorName: "Chef Betty", thumbnail: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=600" },
  { id: "rec_6", title: "Shiro Wot (Chickpea Stew)", cuisine: "Ethiopian", categories: ["Lunch", "Traditional", "Spicy"], prepTime: 10, cookTime: 25, avgRating: 4.8, likesCount: 210, creatorName: "Amanuel Fentahun", thumbnail: "https://images.unsplash.com/photo-1548943487-a2e4e43b4859?auto=format&fit=crop&q=80&w=600" },
  { id: "rec_7", title: "New York Style Cheesecake", cuisine: "American", categories: ["Breakfast"], prepTime: 30, cookTime: 60, avgRating: 4.9, likesCount: 305, creatorName: "Chef Marcus", thumbnail: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=600" },
  { id: "rec_8", title: "Tibs (Sautéed Beef)", cuisine: "Ethiopian", categories: ["Dinner", "Spicy"], prepTime: 15, cookTime: 15, avgRating: 4.7, likesCount: 189, creatorName: "Chef Betty", thumbnail: "https://images.unsplash.com/photo-1626804475297-41609ea004eb?auto=format&fit=crop&q=80&w=600" },
];

const AVAILABLE_CUISINES = ["Ethiopian", "Italian", "French", "American", "Asian Fusion"];
const AVAILABLE_CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Traditional", "Spicy"];
const POPULAR_INGREDIENTS = ["Berbere", "Onions", "Garlic", "Cheese", "Chicken", "Beef", "Butter"];
const ITEMS_PER_PAGE = 6;

export default function ExploreRecipes() {
  const { user } = useAuth();
  const isAnonymous = user?.role === 'anonymous' || !user;

  // --- UNIFIED EXPLORER FILTER STATE ---
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [maxTotalTime, setMaxTotalTime] = useState(120);
  const [minRating, setMinRating] = useState(0);
  const [creatorQuery, setCreatorQuery] = useState('');
  const [sortBy, setSortBy] = useState('likes');

  // --- PAGINATION & MOBILE STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // 1. Reset pagination to page 1 whenever a filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCuisines, selectedCategories, selectedIngredients, maxTotalTime, minRating, creatorQuery, sortBy]);

  // 2. Scroll to top smoothly whenever the current page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // --- FILTER STATE MODIFIERS ---
  const toggleCuisineFilter = (cuisine) => setSelectedCuisines(prev => prev.includes(cuisine) ? prev.filter(c => c !== cuisine) : [...prev, cuisine]);
  const toggleCategoryFilter = (category) => setSelectedCategories(prev => prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]);
  const toggleIngredientFilter = (ingredient) => setSelectedIngredients(prev => prev.includes(ingredient) ? prev.filter(i => i !== ingredient) : [...prev, ingredient]);

  const clearAllActiveFilters = () => {
    setSelectedCuisines([]);
    setSelectedCategories([]);
    setSelectedIngredients([]);
    setMaxTotalTime(120);
    setMinRating(0);
    setCreatorQuery('');
    setSortBy('likes');
  };

  // --- FILTER EXECUTION SIMULATION ENGINE ---
  const filteredRecipes = mockCatalogueRecipes.filter(recipe => {
    if (selectedCuisines.length > 0 && !selectedCuisines.includes(recipe.cuisine)) return false;
    if (selectedCategories.length > 0 && !selectedCategories.some(cat => recipe.categories.includes(cat))) return false;
    if (recipe.prepTime + recipe.cookTime > maxTotalTime) return false;
    if (recipe.avgRating < minRating) return false;
    if (creatorQuery.trim() && !recipe.creatorName.toLowerCase().includes(creatorQuery.toLowerCase().trim())) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'likes') return b.likesCount - a.likesCount;
    if (sortBy === 'rating') return b.avgRating - a.avgRating;
    if (sortBy === 'time') return (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime);
    return 0;
  });

  // --- PAGINATION LOGIC ---
  const totalPages = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentRecipes = filteredRecipes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="mx-auto w-full max-w-7xl font-brand grid grid-cols-1 md:grid-cols-[280px_1fr] gap-grid-4 fade-in items-start py-6">
      
      {/* ========================================================================= */}
      {/* LEFT COLUMN: INTERACTIVE FILTER SETTINGS PANEL                             */}
      {/* ========================================================================= */}
      {/* Container is always visible, but the content inside toggles on mobile */}
      <aside className="w-full bg-white border border-tafach-border rounded-lg p-grid-3 shadow-sm flex flex-col md:sticky md:top-20">
        
        {/* NEW: Clickable Header for Mobile */}
        <div 
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          className="flex items-center justify-between border-b border-tafach-border pb-grid-2 cursor-pointer md:cursor-auto select-none"
        >
          <h3 className="font-bold text-tafach-dark text-base flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-tafach-orange" />
            <span className="md:hidden">{isMobileFilterOpen ? 'Hide Filters' : 'Show Filters'}</span>
            <span className="hidden md:inline">Filters</span>
          </h3>
          <button 
            onClick={(e) => {
              e.stopPropagation(); // Stops the container from collapsing when clicking 'Clear All'
              clearAllActiveFilters();
            }} 
            className="text-xs font-bold text-tafach-orange hover:underline flex items-center gap-1"
          >
            <RotateCcw size={12} /> Clear All
          </button>
        </div>

        {/* Toggled Filter Content Container */}
        <div className={`flex-col gap-grid-3 pt-grid-3 ${isMobileFilterOpen ? 'flex' : 'hidden md:flex'}`}>
          {/* 1. Cuisine */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-tafach-muted">Cuisine</span>
            <div className="flex flex-col gap-1">
              {AVAILABLE_CUISINES.map((cuisine) => (
                <label key={cuisine} className="flex items-center gap-2 text-sm text-tafach-dark cursor-pointer select-none">
                  <input type="checkbox" checked={selectedCuisines.includes(cuisine)} onChange={() => toggleCuisineFilter(cuisine)} className="accent-tafach-orange w-4 h-4 rounded" />
                  <span>{cuisine}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 2. Categories/Tags */}
          <div className="flex flex-col gap-1.5 border-t border-tafach-border pt-grid-2">
            <span className="text-xs font-bold uppercase tracking-wider text-tafach-muted">Categories</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {AVAILABLE_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategoryFilter(cat)}
                  className={`text-xs px-2.5 py-1 border rounded-full font-semibold transition-all ${
                    selectedCategories.includes(cat) ? 'bg-tafach-orange border-orange-600 text-white shadow-sm' : 'bg-tafach-light border-tafach-border text-tafach-dark hover:border-tafach-orange'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Popular Ingredients */}
          <div className="flex flex-col gap-1.5 border-t border-tafach-border pt-grid-2">
            <span className="text-xs font-bold uppercase tracking-wider text-tafach-muted">Ingredients</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {POPULAR_INGREDIENTS.map((ing) => (
                <button
                  key={ing}
                  type="button"
                  onClick={() => toggleIngredientFilter(ing)}
                  className={`text-xs px-2 py-1 border rounded-full font-medium transition-all ${
                    selectedIngredients.includes(ing) ? 'bg-tafach-orange border-orange-600 text-white shadow-sm' : 'bg-tafach-light border-tafach-border text-tafach-dark hover:border-tafach-orange'
                  }`}
                >
                  {ing}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Slider Time */}
          <div className="flex flex-col gap-1.5 border-t border-tafach-border pt-grid-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold uppercase tracking-wider text-tafach-muted">Max Total Time</span>
              <span className="text-xs font-extrabold text-tafach-orange">{maxTotalTime} mins</span>
            </div>
            <input type="range" min="15" max="180" step="5" value={maxTotalTime} onChange={(e) => setMaxTotalTime(parseInt(e.target.value))} className="w-full accent-tafach-orange h-1.5 bg-tafach-light rounded-lg cursor-pointer mt-1" />
          </div>

          {/* 5. Rating Widget */}
          <div className="flex flex-col gap-1.5 border-t border-tafach-border pt-grid-2">
            <span className="text-xs font-bold uppercase tracking-wider text-tafach-muted">Minimum Rating</span>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setMinRating(minRating === star ? 0 : star)} className="transition-transform active:scale-95">
                  <Star size={20} className={star <= minRating ? "fill-tafach-orange text-tafach-orange" : "text-gray-300 hover:text-gray-400"} />
                </button>
              ))}
            </div>
          </div>

          {/* 6. Creator Filter */}
          <div className="flex flex-col gap-1.5 border-t border-tafach-border pt-grid-2">
            <span className="text-xs font-bold uppercase tracking-wider text-tafach-muted">Filter by Creator</span>
            <div className="relative">
              <input type="text" placeholder="Search chef name..." value={creatorQuery} onChange={(e) => setCreatorQuery(e.target.value)} className="tafach-input bg-tafach-light text-xs w-full pl-8" />
              <Search size={14} className="absolute left-2.5 top-2.5 text-tafach-muted" />
            </div>
          </div>
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* RIGHT COLUMN: SEARCH OVERVIEWS & INTERACTIVE CONTENT CARDS CATALOGUE GRID   */}
      {/* ========================================================================= */}
      <main className="flex flex-col gap-grid-3">
        
        {/* Sorting Toolbars Header Toolbar */}
        <div className="bg-white border border-tafach-border p-3 rounded-lg shadow-sm flex flex-col sm:flex-row items-center justify-between gap-grid-2">
          <span className="text-xs font-semibold text-tafach-muted">
            Showing <span className="font-extrabold text-tafach-dark">{filteredRecipes.length}</span> matches found
          </span>
          
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-tafach-dark whitespace-nowrap">Sort By:</span>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2 py-1 border border-tafach-border rounded bg-tafach-light text-xs font-medium focus:outline-none focus:border-tafach-orange cursor-pointer"
            >
              <option value="likes">Popularity (Most Likes)</option>
              <option value="rating">Highest Star Rating</option>
              <option value="time">Cooking Speed (Fastest)</option>
            </select>
          </div>
        </div>

        {/* Primary Product Card Presentation Feed Grid */}
        {filteredRecipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 border border-dashed border-tafach-border bg-white rounded-lg text-center">
            <Search size={36} className="text-tafach-muted mb-3" />
            <h3 className="font-bold text-tafach-dark text-base">No Matching Recipes Found</h3>
            <p className="text-xs text-tafach-muted mt-1 max-w-xs">
              Adjust your custom filter parameters above or clear selection criteria to start fresh.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-grid-3">
              {currentRecipes.map((recipe) => (
                <Link key={recipe.id} to={`/recipe/${recipe.id}`} className="group relative flex flex-col bg-white border border-tafach-border rounded-xl overflow-hidden shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
                  <div className="relative h-44 overflow-hidden">
                    <img src={recipe.thumbnail} alt={recipe.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm border border-tafach-border px-2 py-0.5 rounded text-[10px] font-extrabold tracking-wider uppercase text-tafach-dark">
                      {recipe.cuisine}
                    </div>
                  </div>

                  <div className="p-4 flex flex-col flex-grow">
                    <span className="text-[10px] text-tafach-muted uppercase tracking-wider">By {recipe.creatorName}</span>
                    <h4 className="font-bold text-sm text-tafach-dark mt-1 line-clamp-1 group-hover:text-tafach-orange transition-colors">{recipe.title}</h4>

                    <div className="flex flex-wrap gap-1 mt-2 mb-4">
                      {recipe.categories.map((cat) => (
                        <span key={cat} className="text-[9px] bg-tafach-light text-tafach-dark border border-tafach-border px-1.5 py-0.5 rounded">{cat}</span>
                      ))}
                    </div>

                    <div className="mt-auto pt-3 border-t border-tafach-border flex items-center justify-between text-xs text-tafach-dark font-semibold">
                      <div className="flex items-center gap-1"><Clock size={13} className="text-tafach-muted" /><span>{recipe.prepTime + recipe.cookTime}m</span></div>
                      <div className="flex items-center gap-1"><Star size={13} className="fill-tafach-orange text-tafach-orange" /><span>{recipe.avgRating}</span></div>
                      <div className={`flex items-center gap-1 ${isAnonymous ? 'text-tafach-muted' : 'text-red-500'}`}><Heart size={13} className={isAnonymous ? "text-tafach-muted" : "fill-current text-red-500"} /><span>{recipe.likesCount}</span></div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* --- BOTTOM PAGINATION CONTROLS --- */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-center gap-4">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 text-sm font-bold text-tafach-dark transition-colors hover:text-tafach-orange disabled:opacity-30 disabled:hover:text-tafach-dark"
                >
                  <ChevronLeft size={18} /> Prev
                </button>
                
                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-8 w-8 rounded-md text-sm font-bold transition-all ${
                          currentPage === pageNum 
                            ? 'bg-tafach-orange text-white shadow-sm' 
                            : 'bg-white border border-tafach-border text-tafach-dark hover:border-tafach-orange'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 text-sm font-bold text-tafach-dark transition-colors hover:text-tafach-orange disabled:opacity-30 disabled:hover:text-tafach-dark"
                >
                  Next <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
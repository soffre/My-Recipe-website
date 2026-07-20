import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Heart, Bookmark, Maximize2, Star, MessageSquare, Reply } from 'lucide-react';

// 🍳 PRECISE MOCK DATA PROFILE MODEL
const mockRecipeData = {
  id: "rec_982374",
  title: "Authentic Ethiopian Doro Wat",
  description: "A slow-cooked, rich and deeply flavorful chicken stew infused with hand-blended Berbere spices, caramelized onions, and traditional hard-boiled eggs. A hallmark celebratory dish of Ethiopian cuisine.",
  prepTime: 30,
  cookTime: 90,
  servings: 6,
  cuisine: "Ethiopian",
  categories: ["Dinner", "Traditional", "Spicy"],
  authorName: "Chef Amanuel Fentahun",
  authorAvatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=100&h=100",
  thumbnailUrl: "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&q=80&w=1000",
  imageGallery: [
    "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1574484284002-952d92456975?auto=format&fit=crop&q=80&w=1000"
  ],
  ingredients: [
    { name: "Chicken drumsticks (skinned)", amount: 1.5, unit: "kg" },
    { name: "Finely minced red onions", amount: 2, unit: "kg" },
    { name: "Pure Berbere spice blend", amount: 5, unit: "tbsp" },
    { name: "Niter Kibbeh (Ethiopian spiced butter)", amount: 150, unit: "grams" },
    { name: "Hard-boiled eggs", amount: 6, unit: "pcs" },
    { name: "Garlic and ginger paste", amount: 2, unit: "tbsp" }
  ],
  instructions: [
    { step_number: 1, message: "Slowly simmer the finely minced red onions in a dry, heavy pot over medium heat for 45 minutes, stirring continuously until fully caramelized without adding oil or butter." },
    { step_number: 2, message: "Add the Niter Kibbeh spiced butter alongside your pure Berbere spice blend, garlic, and ginger paste. Sauté the aromatic base for an additional 15 minutes to mature the spices." },
    { step_number: 3, message: "Incorporate the skinned chicken pieces into the seasoned sauce. Simmer low and slow for 30 minutes, adding warm water as needed to create a rich, thick consistency." },
    { step_number: 4, message: "Pierce the hard-boiled eggs gently with a fork and submerge them fully into the bubbling stew. Cover and cook for a final 10 minutes before serving hot with fresh Injera." }
  ],
  likesCount: 142,
  avgRating: 4.9,
  commentsCount: 3,
  initialComments: [
    { 
      id: "c1", 
      userName: "Betty Tesfaye", 
      userAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=50&h=50", 
      text: "This recipe is spot on! Waiting for the onions to dry-caramelize takes time but it makes all the difference.", 
      timestamp: "2 hours ago",
      replies: [
        {
          id: "r1",
          userName: "Chef Amanuel Fentahun",
          userAvatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=100&h=100",
          text: "Thank you, Betty! You are absolutely right, patience with the onions is the secret to a great Doro Wat. So glad you enjoyed it!",
          timestamp: "1 hour ago",
          isCreator: true
        }
      ]
    },
    { 
      id: "c2", 
      userName: "Marcus Vance", 
      userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=50&h=50", 
      text: "First time tasting Berbere butter sauce and my whole kitchen smells incredible. Can I use chicken breast instead of drumsticks?", 
      timestamp: "1 day ago",
      replies: []
    }
  ]
};

export default function RecipeDetail() {
  const { user } = useAuth();
  const isAnonymous = user?.role === 'anonymous' || !user;

  // --- IMAGE GALLERY LOGIC ---
  const allImages = [mockRecipeData.thumbnailUrl, ...mockRecipeData.imageGallery];
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // --- LOCAL INTERACTIVE UI STATES ---
  const [hasLiked, setHasLiked] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(mockRecipeData.likesCount);
  const [userRating, setUserRating] = useState(0);
  
  // Comments and Replies State
  const [commentsList, setCommentsList] = useState(mockRecipeData.initialComments);
  const [commentInput, setCommentInput] = useState('');
  const [replyingToId, setReplyingToId] = useState(null); 
  const [replyInput, setReplyInput] = useState('');

 useEffect(() => {
    // 1. Lock body scroll when lightbox is open to prevent mobile URL bar glitch
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowRight') handleNextImage(e);
      if (e.key === 'ArrowLeft') handlePrevImage(e);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    // 2. Cleanup function runs when lightbox closes or component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset'; // Always restore scrolling!
    };
  }, [isLightboxOpen]);

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handleLikeToggle = () => {
    if (isAnonymous) return;
    setHasLiked(!hasLiked);
    setLikesCount(hasLiked ? likesCount - 1 : likesCount + 1);
  };

  const handleBookmarkToggle = () => {
    if (isAnonymous) return;
    setHasBookmarked(!hasBookmarked);
  };

  const handleRatingSelection = (rating) => {
    if (isAnonymous) return;
    setUserRating(rating);
  };

  // Main Top-Level Comment Submission
  const handleCommentSubmission = (e) => {
    e.preventDefault();
    if (isAnonymous || !commentInput.trim()) return;

    const newCommentPayload = {
      id: `c_${Date.now()}`,
      userName: user?.name || "Active Member",
      userAvatar: user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=50&h=50",
      text: commentInput.trim(),
      timestamp: "Just now",
      replies: []
    };

    setCommentsList([newCommentPayload, ...commentsList]);
    setCommentInput('');
  };

  // Nested Thread Reply Submission
  const handleReplySubmission = (e, commentId) => {
    e.preventDefault();
    if (isAnonymous || !replyInput.trim()) return;

    const newReply = {
      id: `r_${Date.now()}`,
      userName: user?.name || "Active Member",
      userAvatar: user?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=50&h=50",
      text: replyInput.trim(),
      timestamp: "Just now",
      isCreator: false 
    };

    const updatedComments = commentsList.map((comm) => {
      if (comm.id === commentId) {
        return { ...comm, replies: [...(comm.replies || []), newReply] };
      }
      return comm;
    });

    setCommentsList(updatedComments);
    setReplyInput('');
    setReplyingToId(null);
  };

  return (
    <>
      {/* --- FULL SCREEN LIGHTBOX MODAL --- */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md transition-opacity">
          
          {/* Added z-10 here so the header is always on top of the image. Added bg-black/50 to buttons for mobile clarity */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between text-white sm:top-6 sm:left-6 sm:right-6">
            <div className="rounded-full bg-black/50 px-3 py-1 text-sm font-bold opacity-90 backdrop-blur-sm">
              {activeImageIndex + 1} / {allImages.length}
            </div>
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-3xl leading-none text-white transition hover:scale-110 hover:bg-tafach-orange focus:outline-none"
              aria-label="Close lightbox"
            >
              &times;
            </button>
          </div>

          <div className="relative z-0 flex h-3/4 w-full items-center justify-center px-4 sm:px-12">
            <button onClick={handlePrevImage} className="absolute left-2 sm:left-8 z-10 rounded-full bg-black/50 p-3 sm:p-4 text-white transition hover:bg-tafach-orange focus:outline-none">
              &#8249;
            </button>
            <img src={allImages[activeImageIndex]} alt="Gallery Fullscreen" className="max-h-full max-w-full rounded shadow-2xl object-contain fade-in" />
            <button onClick={handleNextImage} className="absolute right-2 sm:right-8 z-10 rounded-full bg-black/50 p-3 sm:p-4 text-white transition hover:bg-tafach-orange focus:outline-none">
              &#8250;
            </button>
          </div>

          <div className="absolute bottom-6 flex gap-2 overflow-x-auto px-4 py-2 w-full justify-center">
            {allImages.map((img, idx) => (
              <img 
                key={idx}
                src={img} 
                onClick={() => setActiveImageIndex(idx)}
                className={`h-14 w-20 sm:h-16 sm:w-24 shrink-0 cursor-pointer rounded border-2 object-cover transition-all hover:opacity-100 ${
                  activeImageIndex === idx ? 'border-tafach-orange opacity-100' : 'border-transparent opacity-40'
                }`}
                alt={`Thumbnail ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* --- MAIN PAGE CONTENT --- */}
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-grid-4 font-brand fade-in py-8">
        
        {/* 1. HERO HEADER IMAGE STRIP SCREEN BANNER */}
        <div 
          className="group relative h-64 w-full cursor-zoom-in overflow-hidden rounded-xl border border-tafach-border shadow-sm md:h-[400px]"
          onClick={() => setIsLightboxOpen(true)}
        >
          <img src={allImages[activeImageIndex]} alt={mockRecipeData.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity group-hover:opacity-90" />
          
          <div className="absolute top-4 right-4 flex items-center gap-2 rounded-full bg-black/50 px-3 py-2 text-sm font-medium text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
            <Maximize2 size={16} /> Expand
          </div>
          
          <div className="absolute bottom-grid-3 left-grid-3 right-grid-3 flex flex-col justify-between gap-grid-2 sm:flex-row sm:items-end text-white">
            <div>
              <div className="mb-3 flex flex-wrap gap-2">
                <span className="inline-block rounded bg-tafach-orange px-2 py-1 text-xs font-bold uppercase tracking-wider">
                  {mockRecipeData.cuisine} Cuisine
                </span>
                {mockRecipeData.categories.map((cat) => (
                  <span key={cat} className="inline-block rounded border border-white/30 bg-white/20 px-2 py-1 text-xs font-semibold backdrop-blur-sm">
                    {cat}
                  </span>
                ))}
              </div>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight drop-shadow-md md:text-4xl">
                {mockRecipeData.title}
              </h1>
            </div>
            
            <div className="flex shrink-0 gap-grid-1" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={handleLikeToggle}
                disabled={isAnonymous}
                className={`inline-flex items-center gap-2 rounded-full border p-2 shadow transition-all ${
                  isAnonymous 
                    ? 'cursor-not-allowed border-white/20 bg-white/40 text-white/50'
                    : hasLiked 
                      ? 'scale-110 border-red-600 bg-red-500 text-white' 
                      : 'border-tafach-border bg-white text-tafach-dark hover:bg-tafach-light active:scale-95'
                }`}
                title={isAnonymous ? "Log in required to like" : "Click to like"}
              >
                <Heart size={18} className={hasLiked ? "fill-current" : ""} />
                <span className="text-xs font-bold">{likesCount}</span>
              </button>

              <button 
                onClick={handleBookmarkToggle}
                disabled={isAnonymous}
                className={`inline-flex items-center justify-center rounded-full border p-2 shadow transition-all ${
                  isAnonymous 
                    ? 'cursor-not-allowed border-white/20 bg-white/40 text-white/50'
                    : hasBookmarked 
                      ? 'scale-110 border-orange-600 bg-tafach-orange text-white' 
                      : 'border-tafach-border bg-white text-tafach-dark hover:bg-tafach-light active:scale-95'
                }`}
                title={isAnonymous ? "Log in required to bookmark" : "Save recipe"}
              >
                <Bookmark size={18} className={hasBookmarked ? "fill-current" : ""} />
              </button>
            </div>
          </div>
        </div>

        {/* Mini Image Gallery Switcher Pool */}
        <div className="flex gap-grid-1 overflow-x-auto pb-1">
          {allImages.map((img, idx) => (
            <img 
              key={idx}
              src={img} 
              onClick={() => setActiveImageIndex(idx)}
              alt={`Thumbnail ${idx}`}
              className={`h-16 w-24 shrink-0 cursor-pointer rounded border object-cover transition-all hover:opacity-90 ${
                activeImageIndex === idx ? 'border-tafach-orange ring-2 ring-orange-200' : 'border-tafach-border'
              }`}
            />
          ))}
        </div>

        {/* 2. MAIN SPLIT COLUMNS INFRASTRUCTURE GRID */}
        <div className="grid items-start gap-grid-3 md:grid-cols-[1fr_320px] md:gap-grid-4">
          
          <div className="flex flex-col gap-grid-4 rounded-lg border border-tafach-border bg-white p-grid-3 shadow-sm md:p-6">
            <div className="flex items-center justify-between border-b border-tafach-border pb-grid-2">
              <div className="flex items-center gap-grid-2">
                <img src={mockRecipeData.authorAvatar} alt={mockRecipeData.authorName} className="h-12 w-12 rounded-full border object-cover shadow-sm" />
                <div>
                  <span className="block text-xs uppercase tracking-wider text-tafach-muted">Published by</span>
                  <span className="text-base font-bold text-tafach-dark">{mockRecipeData.authorName}</span>
                </div>
              </div>
              
              <div className="text-right flex flex-col items-end">
                <span className="block text-xs uppercase tracking-wider text-tafach-muted">Average Score</span>
                <span className="flex items-center gap-1 text-sm font-extrabold text-tafach-dark">
                  <Star size={14} className="fill-tafach-orange text-tafach-orange" />
                  {mockRecipeData.avgRating} / 5.0
                </span>
              </div>
            </div>

            <p className="text-base leading-relaxed text-tafach-dark">{mockRecipeData.description}</p>

            <div className="mt-4">
              <h3 className="mb-4 text-xl font-bold text-tafach-dark">🌿 Ingredients List ({mockRecipeData.ingredients.length} items)</h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {mockRecipeData.ingredients.map((ing, idx) => (
                  <li key={idx} className="flex items-center gap-2 rounded-md border border-tafach-border bg-tafach-light p-3 text-sm">
                    <span className="font-bold text-tafach-orange">{ing.amount} {ing.unit}</span>
                    <span className="text-tafach-dark">{ing.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 border-t border-tafach-border pt-6">
              <h3 className="mb-4 text-xl font-bold text-tafach-dark">👩‍🍳 Step-by-Step Instructions</h3>
              <div className="flex flex-col gap-4">
                {mockRecipeData.instructions.map((step, idx) => (
                  <div key={idx} className="flex gap-4 rounded-lg border border-tafach-border p-4 transition-colors hover:bg-tafach-light">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-tafach-orange font-bold text-white">
                      {step.step_number}
                    </div>
                    <p className="pt-1 text-sm leading-relaxed text-tafach-dark">{step.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-grid-4">
            <div className="rounded-lg border border-tafach-border bg-tafach-light p-grid-3 shadow-sm">
              <h3 className="mb-4 text-lg font-bold text-tafach-dark">Recipe Logistics</h3>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center justify-center rounded border border-tafach-border bg-white p-3 text-center">
                  <span className="text-xs font-semibold uppercase text-tafach-muted">Prep</span>
                  <span className="text-lg font-bold text-tafach-dark">{mockRecipeData.prepTime}m</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded border border-tafach-border bg-white p-3 text-center">
                  <span className="text-xs font-semibold uppercase text-tafach-muted">Cook</span>
                  <span className="text-lg font-bold text-tafach-dark">{mockRecipeData.cookTime}m</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded border border-tafach-border bg-white p-3 text-center">
                  <span className="text-xs font-semibold uppercase text-tafach-muted">Yields</span>
                  <span className="text-lg font-bold text-tafach-dark">{mockRecipeData.servings}</span>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-tafach-border bg-white p-grid-3 text-center shadow-sm">
              <h3 className="mb-2 text-lg font-bold text-tafach-dark">Rate this Recipe</h3>
              {isAnonymous ? (
                <p className="text-sm text-tafach-muted">🔒 Sign in to unlock rating submission.</p>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingSelection(star)}
                        className={`transition-transform active:scale-95 ${
                          star <= userRating 
                            ? 'scale-110 text-tafach-orange' 
                            : 'text-gray-300 hover:text-gray-400'
                        }`}
                      >
                        <Star size={24} className={star <= userRating ? "fill-current" : ""} />
                      </button>
                    ))}
                  </div>
                  {userRating > 0 && (
                    <span className="text-xs font-bold text-tafach-orange">Thanks! Rated {userRating} Stars</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 3. COMMENT FEED & THREADED REPLIES SECTION */}
        <div className="mt-4 rounded-lg border border-tafach-border bg-white p-grid-3 shadow-sm md:p-6">
          <h3 className="mb-6 flex items-center gap-2 text-xl font-bold text-tafach-dark">
            <MessageSquare size={20} />
            Member Notes & Comments ({commentsList.length})
          </h3>
          
          {/* Main Top-Level Comment Input */}
          <div className="mb-8 border-b border-tafach-border pb-8">
            {isAnonymous ? (
              <div className="rounded-lg border border-dashed border-tafach-border bg-tafach-light p-6 text-center">
                <p className="mb-2 text-sm font-semibold text-tafach-dark">Want to join the conversation?</p>
                <button className="rounded bg-tafach-dark px-4 py-2 text-sm font-bold text-white transition hover:bg-black">
                  🔑 Log In to Comment
                </button>
              </div>
            ) : (
              <form onSubmit={handleCommentSubmission} className="flex flex-col gap-3">
                <textarea
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Share your kitchen adjustments or tasting notes..."
                  className="tafach-input h-24 resize-y rounded-md border border-gray-300 p-3 text-sm focus:border-tafach-orange focus:ring-1 focus:ring-tafach-orange focus:outline-none"
                  maxLength={500}
                />
                <button 
                  type="submit"
                  disabled={!commentInput.trim()}
                  className="self-end rounded bg-tafach-orange px-6 py-2 text-sm font-bold text-white transition hover:bg-orange-600 disabled:opacity-50"
                >
                  Post Note 🚀
                </button>
              </form>
            )}
          </div>

          {/* Comments Feed Threading Render Pipeline */}
          <div className="flex flex-col gap-8">
            {commentsList.map((comm) => (
              <div key={comm.id} className="flex flex-col gap-3">
                
                {/* Parent Comment */}
                <div className="flex gap-4">
                  <img src={comm.userAvatar} alt={comm.userName} className="h-10 w-10 shrink-0 rounded-full border object-cover" />
                  <div className="flex w-full flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-bold text-tafach-dark">{comm.userName}</span>
                      <span className="text-xs text-tafach-muted">{comm.timestamp}</span>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">{comm.text}</p>
                    
                    {/* Reply Action Trigger */}
                    {!isAnonymous && (
                      <button 
                        onClick={() => setReplyingToId(replyingToId === comm.id ? null : comm.id)}
                        className="mt-2 flex w-max items-center gap-1 text-xs font-semibold text-tafach-orange transition hover:text-orange-700"
                      >
                        <Reply size={14} /> Reply
                      </button>
                    )}
                  </div>
                </div>

                {/* Inline Form for Nested Reply */}
                {replyingToId === comm.id && (
                  <form onSubmit={(e) => handleReplySubmission(e, comm.id)} className="ml-14 flex flex-col gap-2 rounded-md bg-tafach-light p-3">
                    <textarea
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      placeholder={`Replying to ${comm.userName}...`}
                      className="w-full resize-none rounded border border-gray-300 p-2 text-sm focus:border-tafach-orange focus:ring-1 focus:ring-tafach-orange focus:outline-none"
                      rows={2}
                      autoFocus
                    />
                    <div className="flex justify-end gap-2">
                      <button 
                        type="button" 
                        onClick={() => setReplyingToId(null)}
                        className="rounded px-3 py-1.5 text-xs font-bold text-gray-500 transition hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={!replyInput.trim()}
                        className="rounded bg-tafach-dark px-3 py-1.5 text-xs font-bold text-white transition hover:bg-black disabled:opacity-50"
                      >
                        Send Reply
                      </button>
                    </div>
                  </form>
                )}

                {/* Nested Replies Rendering Engine */}
                {comm.replies && comm.replies.length > 0 && (
                  <div className="ml-5 mt-2 flex flex-col gap-4 border-l-2 border-dashed border-gray-200 pl-4 sm:ml-12">
                    {comm.replies.map((reply) => (
                      <div key={reply.id} className="flex gap-3">
                        <img src={reply.userAvatar} alt={reply.userName} className="h-8 w-8 shrink-0 rounded-full border object-cover" />
                        <div className="flex flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-tafach-dark">{reply.userName}</span>
                            {reply.isCreator && (
                              <span className="flex items-center gap-1 rounded bg-tafach-orange px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                                👨‍🍳 Chef
                              </span>
                            )}
                            <span className="text-xs text-tafach-muted">{reply.timestamp}</span>
                          </div>
                          <p className="mt-1 text-sm text-gray-700">{reply.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}
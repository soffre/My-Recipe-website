import { Link } from 'react-router-dom';

// Mock Data
const featuredGuide = {
  id: 201,
  category: 'Technique',
  title: 'The Ultimate Guide to Knife Skills',
  description: 'Master the chop, dice, and julienne. Good knife skills are the foundation of fast and safe cooking.',
  img: 'https://images.unsplash.com/photo-1593488812616-86db4bce434c?auto=format&fit=crop&w=1200&q=80'
};

const guides = [
  { id: 202, category: 'Equipment', title: 'Essential Spices Every Kitchen Needs', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80' },
  { id: 203, category: 'Baking 101', title: 'How to Measure Flour Correctly', img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80' },
  { id: 204, category: 'Meal Prep', title: 'A Beginner’s Guide to Sunday Meal Prep', img: 'https://images.unsplash.com/photo-1543363136-3fdb62e11be5?auto=format&fit=crop&w=600&q=80' },
  { id: 205, category: 'Science', title: 'The Maillard Reaction: Why Brown Food Tastes Better', img: 'https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=600&q=80' },
];

export default function Guides() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-8 md:px-6">
        <h1 className="text-4xl md:text-5xl font-extrabold text-tafach-dark mb-4">
          Cooking Guides
        </h1>
        <p className="text-lg text-tafach-muted max-w-2xl">
          Elevate your culinary skills with expert tips, deep-dives into ingredients, and step-by-step technique tutorials.
        </p>
      </section>

      {/* Featured Guide */}
      <section className="max-w-7xl mx-auto px-4 pb-12 md:px-6">
        <Link to={`/guides/${featuredGuide.id}`} className="group relative block overflow-hidden rounded-2xl border border-tafach-border shadow-sm">
          <div className="aspect-video md:aspect-21/9 w-full bg-tafach-dark relative">
            <img 
              src={featuredGuide.img} 
              alt={featuredGuide.title} 
              className="absolute inset-0 w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent"></div>
            
            {/* Content positioned at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <span className="inline-block px-3 py-1 mb-3 text-xs font-bold text-tafach-dark bg-white rounded-md uppercase tracking-wider">
                {featuredGuide.category}
              </span>
              <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-2 md:w-2/3">
                {featuredGuide.title}
              </h2>
              <p className="text-gray-200 text-sm md:text-base md:w-1/2 line-clamp-2">
                {featuredGuide.description}
              </p>
            </div>
          </div>
        </Link>
      </section>

      {/* Standard Guides Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-20 md:px-6">
        <h3 className="text-2xl font-bold text-tafach-dark mb-6">Latest Articles</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guides.map((guide) => (
            <Link key={guide.id} to={`/guides/${guide.id}`} className="group flex flex-col">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-tafach-light mb-4 border border-tafach-border shadow-sm">
                <img 
                  src={guide.img} 
                  alt={guide.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <span className="text-xs font-bold text-tafach-orange uppercase tracking-wider mb-1">
                {guide.category}
              </span>
              <h4 className="text-lg font-bold text-tafach-dark group-hover:text-tafach-orange transition-colors">
                {guide.title}
              </h4>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
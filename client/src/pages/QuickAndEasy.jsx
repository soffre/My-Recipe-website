import { Link } from 'react-router-dom';

// Mock Data
const quickRecipes = [
  { id: 101, title: '15-Minute Garlic Noodles', time: '15 mins', calories: '450 kcal', img: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=600&q=80' },
  { id: 102, title: 'Avocado Toast with Poached Egg', time: '10 mins', calories: '320 kcal', img: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80' },
  { id: 103, title: 'One-Pan Lemon Butter Chicken', time: '20 mins', calories: '510 kcal', img: 'https://images.unsplash.com/photo-1598515320573-0498877b0d2b?auto=format&fit=crop&w=600&q=80' },
  { id: 104, title: 'Speedy Shrimp Tacos', time: '25 mins', calories: '400 kcal', img: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=600&q=80' },
  { id: 105, title: 'Caprese Pasta Salad', time: '15 mins', calories: '380 kcal', img: 'https://images.unsplash.com/photo-1621510456681-2330135e5871?auto=format&fit=crop&w=600&q=80' },
  { id: 106, title: 'Microwave Mug Mac & Cheese', time: '5 mins', calories: '420 kcal', img: 'https://images.unsplash.com/photo-1543339494-b4cd4f7ba686?auto=format&fit=crop&w=600&q=80' },
];

export default function QuickAndEasy() {
  return (
    <div className="min-h-screen bg-gray-50/30">
      <section className="bg-orange-50 px-4 py-12 md:py-16">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 text-center md:text-left">
            <span className="inline-block px-3 py-1 mb-4 text-xs font-bold text-white bg-tafach-orange rounded-full">Under 30 Minutes</span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-tafach-dark tracking-tight mb-4">
              Quick & Easy Meals
            </h1>
            <p className="text-lg text-tafach-muted">
              Short on time? These lightning-fast recipes are packed with flavor and ready before you could even wait for delivery.
            </p>
          </div>
          <div className="hidden md:block w-32 h-32 text-6xl text-center">
            ⏱️
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickRecipes.map((recipe) => (
            <Link key={recipe.id} to={`/recipe/${recipe.id}`} className="group flex flex-col bg-white rounded-xl border border-tafach-border overflow-hidden hover:border-tafach-orange transition-colors">
              <div className="relative h-48 overflow-hidden bg-tafach-light">
                <img 
                  src={recipe.img} 
                  alt={recipe.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Floating Time Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-md text-xs font-bold text-tafach-dark shadow-sm">
                  {recipe.time}
                </div>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-tafach-dark mb-1 line-clamp-2">
                  {recipe.title}
                </h3>
                <p className="text-sm text-tafach-muted mt-auto">
                  {recipe.calories}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:py-20">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-tafach-dark sm:text-5xl">
          About <span className="text-tafach-orange">RecipeLogo</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-tafach-muted">
          Your daily dose of culinary inspiration. We believe that cooking should be accessible, 
          fun, and incredibly delicious for everyone, regardless of skill level.
        </p>
      </div>

      {/* Content Grid */}
      <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="flex flex-col justify-center">
          <h2 className="mb-4 text-3xl font-bold text-tafach-dark">Our Mission</h2>
          <p className="mb-6 text-tafach-muted leading-relaxed">
            Founded in 2024, our platform was created with a simple goal: to bring people together 
            through the joy of food. Whether you are looking for a quick 15-minute weeknight dinner 
            or a complex weekend baking guide, we are here to provide reliable, tested, and 
            mouth-watering recipes.
          </p>
          <p className="mb-6 text-tafach-muted leading-relaxed">
            We are more than just a recipe database; we are a community of passionate home cooks and 
            professional chefs sharing our love for gastronomy.
          </p>
          <div>
            <Link 
              to="/explore" 
              className="inline-flex rounded-md bg-tafach-orange px-6 py-3 font-semibold text-white transition hover:bg-tafach-orange/90 active:scale-95"
            >
              Start Exploring Recipes
            </Link>
          </div>
        </div>

        {/* Image Placeholder - Replace src with your actual image */}
        <div className="relative h-64 overflow-hidden rounded-2xl sm:h-80 lg:h-full">
          <img 
            src="https://images.unsplash.com/photo-1556910103-1c02745a872f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="People cooking together" 
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl"></div>
        </div>
      </div>
    </div>
  );
}
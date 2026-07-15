import { Link, useParams } from 'react-router-dom';

// Mock Data - In a real app, you would fetch this based on the ID from useParams()
const mockGuide = {
  id: 201,
  category: 'Technique',
  title: 'The Ultimate Guide to Knife Skills',
  description: 'Master the chop, dice, and julienne. Good knife skills are the foundation of fast and safe cooking.',
  author: {
    name: 'Chef Marcus',
    role: 'Culinary Director',
    avatar: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=150&q=80',
  },
  publishedDate: 'Oct 12, 2023',
  readTime: '6 min read',
  heroImg: 'https://images.unsplash.com/photo-1593488812616-86db4bce434c?auto=format&fit=crop&w=1200&q=80',
};

const relatedGuides = [
  { id: 202, category: 'Equipment', title: 'Essential Spices Every Kitchen Needs', img: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=600&q=80' },
  { id: 203, category: 'Baking 101', title: 'How to Measure Flour Correctly', img: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=600&q=80' },
];

export default function GuideDetail() {
  const { id } = useParams();
  
  // Real app: fetch guide details using `id`
  // useEffect(() => { fetchGuide(id) }, [id]);

  return (
    <div className="min-h-screen bg-white">
      
      {/* Top Header & Breadcrumbs */}
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-6 md:px-6">
        <nav className="flex items-center text-sm text-tafach-muted mb-6">
          <Link to="/" className="hover:text-tafach-orange transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/guides" className="hover:text-tafach-orange transition-colors">Guides</Link>
          <span className="mx-2">/</span>
          <span className="text-tafach-dark font-medium">{mockGuide.category}</span>
        </nav>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-tafach-dark tracking-tight mb-6 leading-tight">
          {mockGuide.title}
        </h1>
        
        <p className="text-xl text-tafach-muted mb-8 leading-relaxed">
          {mockGuide.description}
        </p>

        {/* Author & Meta Data */}
        <div className="flex items-center justify-between border-y border-tafach-border py-4">
          <div className="flex items-center gap-3">
            <img 
              src={mockGuide.author.avatar} 
              alt={mockGuide.author.name} 
              className="w-12 h-12 rounded-full object-cover ring-2 ring-tafach-light"
            />
            <div>
              <p className="font-bold text-tafach-dark">{mockGuide.author.name}</p>
              <p className="text-xs text-tafach-muted">{mockGuide.author.role}</p>
            </div>
          </div>
          <div className="text-right text-sm text-tafach-muted">
            <p className="font-medium text-tafach-dark">{mockGuide.publishedDate}</p>
            <p>{mockGuide.readTime}</p>
          </div>
        </div>
      </div>

      {/* Hero Image */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 mb-12">
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-2xl overflow-hidden bg-tafach-light shadow-md">
          <img 
            src={mockGuide.heroImg} 
            alt={mockGuide.title} 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Article Content Area */}
      <article className="max-w-3xl mx-auto px-4 md:px-6 mb-20">
        
        {/* 
          NOTE: In a real app pulling from a CMS, this content would likely be injected via 
          a markdown parser or dangerouslySetInnerHTML. We are hardcoding styled HTML here 
          to show you exactly how to style the typography using your tafach design system.
        */}
        <div className="text-lg text-tafach-dark leading-relaxed space-y-6">
          <p className="first-letter:text-5xl first-letter:font-extrabold first-letter:text-tafach-orange first-letter:mr-1 first-letter:float-left">
            You don't need a 20-piece knife block to be a great cook. In fact, 95% of your kitchen tasks can be accomplished with just three knives: a Chef's knife, a Paring knife, and a Serrated bread knife. The real secret isn't the tools—it's how you use them.
          </p>

          <p>
            The biggest mistake beginners make is holding the handle like a hammer. This gives you very little control over the blade and tires out your wrist quickly. Instead, you want to use what professionals call the <strong>"Pinch Grip."</strong>
          </p>

          <h2 className="text-3xl font-extrabold text-tafach-dark mt-12 mb-4">1. The Pinch Grip</h2>
          <p>
            Pinch the base of the blade (right where it meets the handle) between your thumb and index finger. Wrap your remaining three fingers loosely around the handle. It might feel awkward at first, but this grip gives you absolute control over the blade's movement.
          </p>

          <blockquote className="border-l-4 border-tafach-orange pl-6 py-2 my-8 bg-orange-50/50 rounded-r-lg italic text-tafach-muted text-xl font-medium">
            "A sharp knife is a safe knife. A dull knife requires you to apply more pressure, which makes it far more likely to slip and cut you."
          </blockquote>

          <h2 className="text-3xl font-extrabold text-tafach-dark mt-12 mb-4">2. The Claw Hand</h2>
          <p>
            Your non-dominant hand has a crucial job: holding the food steady while keeping your fingertips attached to your hand. Curl your fingers inward like a bear claw. The knuckles of your index and middle fingers should rest against the flat side of the knife blade, guiding its movement.
          </p>
          
          <ul className="list-disc list-inside space-y-2 mt-4 ml-4 bg-tafach-light/30 p-6 rounded-xl border border-tafach-border">
            <li><strong>The Tip:</strong> Always keep the tip of the knife on the cutting board.</li>
            <li><strong>The Motion:</strong> Slice in a smooth, circular motion (like a locomotive wheel).</li>
            <li><strong>The Thumb:</strong> Keep your guiding hand's thumb tucked firmly behind your fingers!</li>
          </ul>

          <p className="mt-8">
            Practice these two techniques slowly. Speed will come naturally as your muscle memory develops. Start by practicing on softer vegetables like celery or cucumbers before moving on to harder items like carrots or onions.
          </p>
        </div>

        {/* Share / Tags section */}
        <div className="mt-12 pt-8 border-t border-tafach-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-tafach-muted uppercase">Prep</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-tafach-muted uppercase">Technique</span>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-xs font-bold text-tafach-muted uppercase">Basics</span>
          </div>
          <button className="flex items-center gap-2 font-bold text-tafach-orange hover:bg-orange-50 px-4 py-2 rounded-lg transition-colors border border-tafach-orange">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Share Guide
          </button>
        </div>

      </article>

      {/* Related Guides Section */}
      <div className="bg-gray-50/50 border-t border-tafach-border py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <h3 className="text-2xl font-bold text-tafach-dark mb-8">Keep Reading</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {relatedGuides.map((guide) => (
              <Link key={guide.id} to={`/guides/${guide.id}`} className="group flex flex-col bg-white rounded-xl overflow-hidden border border-tafach-border hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className="aspect-[16/9] overflow-hidden bg-tafach-light relative">
                  <img 
                    src={guide.img} 
                    alt={guide.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/95 px-2 py-1 rounded text-xs font-bold text-tafach-dark shadow-sm uppercase tracking-wider">
                    {guide.category}
                  </div>
                </div>
                <div className="p-5">
                  <h4 className="text-lg font-bold text-tafach-dark group-hover:text-tafach-orange transition-colors">
                    {guide.title}
                  </h4>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
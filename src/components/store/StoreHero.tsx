import { Link } from 'react-router-dom';

export function StoreHero() {
  return (
    <section className="w-full px-6 mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Item - Organic Forms */}
        <div className="group cursor-pointer">
          <div className="relative aspect-[4/5] overflow-hidden mb-3">
            <img
              src="/image1.png"
              alt="Organic Forms"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <Link to="/store?collection=organic" className="block text-left">
            <h3 className="text-sm text-gray-900 font-medium mb-1">Organic Forms</h3>
            <p className="text-xs text-gray-500 font-sans">Nature-inspired pieces with fluid, sculptural details</p>
          </Link>
        </div>

        {/* Right Item - Chain Collection */}
        <div className="group cursor-pointer hidden md:block">
          <div className="relative aspect-[4/5] overflow-hidden mb-3">
            <img
              src="https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=1200&auto=format&fit=crop&q=80"
              alt="Chain Collection"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
          <Link to="/store?collection=chains" className="block text-left">
            <h3 className="text-sm text-gray-900 font-medium mb-1">Chain Collection</h3>
            <p className="text-xs text-gray-500 font-sans">Refined links and connections in precious metals</p>
          </Link>
        </div>
      </div>
    </section>
  );
}

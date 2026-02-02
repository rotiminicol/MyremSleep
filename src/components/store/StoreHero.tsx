import { Link } from 'react-router-dom';

export function StoreHero() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Left Image */}
        <div className="relative aspect-[4/5] md:aspect-auto md:h-[80vh] overflow-hidden group cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200&auto=format&fit=crop&q=80"
            alt="Luxury bedding collection"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
          <div className="absolute bottom-8 left-8">
            <Link
              to="/store?category=bedding"
              className="inline-block bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-3 text-sm tracking-widest uppercase hover:bg-white transition-colors"
            >
              Shop Bedding
            </Link>
          </div>
        </div>

        {/* Right Image */}
        <div className="relative aspect-[4/5] md:aspect-auto md:h-[80vh] overflow-hidden group cursor-pointer">
          <img
            src="https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=1200&auto=format&fit=crop&q=80"
            alt="Premium fabric collection"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
          <div className="absolute bottom-8 left-8">
            <Link
              to="/store?category=sleepwear"
              className="inline-block bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-3 text-sm tracking-widest uppercase hover:bg-white transition-colors"
            >
              Shop Sleepwear
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

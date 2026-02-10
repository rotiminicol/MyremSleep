import { Link } from 'react-router-dom';

export function StoreHero() {
  return (
    <section className="w-full mb-6 md:mb-12">
      {/* Mobile Design (< md) */}
      <div className="md:hidden relative w-full h-[80vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/image1.png"
            alt="Organic Forms"
            className="w-full h-full object-cover object-center"
          />
          {/* Stronger light overlay to wash out the image for text clarity */}
          <div className="absolute inset-0 bg-white/40" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-6 text-center pt-10">
          <h1 className="text-[34px] md:text-5xl text-black leading-[1.15] mb-6 px-2">
            <span className="font-serif font-bold">Rest</span>
            <span className="font-sans font-normal text-[#1a1a1a]"> is not a routine. It is a </span>
            <span className="font-serif font-bold">ritual.</span>
          </h1>

          <p className="text-[15px] text-[#333333] font-sans max-w-[280px] mx-auto mb-10 leading-[1.6]">
            300 thread count Egyptian cotton sateen bedding bundles in modern, seasonless neutrals.
          </p>

          <div className="flex flex-row items-center justify-center gap-3">
            <Link
              to="/store?category=bundles"
              className="px-6 py-3 bg-gray-900 text-white font-sans text-xs font-medium hover:bg-gray-800 transition-colors duration-300"
            >
              Shop Bundles
            </Link>
            <Link
              to="/store?category=colours"
              className="px-6 py-3 bg-transparent border border-gray-900 text-gray-900 font-sans text-xs font-medium hover:bg-gray-50 transition-colors duration-300"
            >
              Explore Colours
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Design (>= md) - Original Implementation */}
      <div className="hidden md:grid grid-cols-2 gap-4 px-6">
        {/* Left Item - Organic Forms */}
        <div className="group cursor-pointer">
          <div className="relative aspect-[4/5] overflow-hidden mb-3">
            <img
              src="/image1.png"
              alt="Organic Forms"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

        </div>

        {/* Right Item - Chain Collection */}
        <div className="group cursor-pointer">
          <div className="relative aspect-[4/5] overflow-hidden mb-3">
            <img
              src="https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=1200&auto=format&fit=crop&q=80"
              alt="Chain Collection"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>

        </div>
      </div>
    </section>
  );
}

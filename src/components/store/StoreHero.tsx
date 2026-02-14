import { Link } from 'react-router-dom';

export function StoreHero() {
  return (
    <section className="w-full md:mb-12">
      {/* Mobile Design (< md) */}
      <div className="md:hidden w-full flex flex-col h-[calc(100svh-60px)] min-h-[500px] max-h-[700px]">
        {/* Image Section - ~65% height */}
        <div className="w-full relative flex-[1.85] overflow-hidden">
          <img
            src="/image1.png"
            alt="Rest is a ritual"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Content Section - ~35% height */}
        <div className="w-full bg-primary px-5 py-6 flex flex-col justify-center text-left flex-1 md:basis-auto">
          <h1 className="text-2xl min-[375px]:text-3xl font-display text-white mb-3 leading-tight">
            <span className="block">
              <span className="font-bold uppercase">REST</span>
              <span className="font-sans font-normal"> is not a routine.</span>
            </span>
            <span className="block">
              <span className="font-sans font-normal">It is a </span>
              <span className="font-bold uppercase">ritual.</span>
            </span>
          </h1>

          <p className="text-white/90 font-sans text-xs min-[375px]:text-sm leading-relaxed mb-4 max-w-[95%]">
            300 thread count Egyptian cotton sateen bedding bundles in modern, seasonless neutrals.
          </p>

          <div className="w-full">
            <Link
              to="/store?category=bundles"
              className="inline-block bg-white text-gray-900 px-8 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-gray-100 transition-all duration-300"
            >
              Shop Bedding
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

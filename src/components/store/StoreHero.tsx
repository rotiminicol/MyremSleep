import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import { useAllReviews } from '@/hooks/useProductReviews';

const fallbackReviews = [
  { name: "Amara Okafor", review: "The quality is absolutely incredible. I've never slept better!" },
  { name: "James Chen", review: "Worth every penny. The fabric feels like luxury hotel bedding." },
  { name: "Nia Johnson", review: "My sleep has improved dramatically since switching to Remsleep." },
  { name: "Kwame Asante", review: "The attention to detail is amazing. Best bedding purchase I've made." },
  { name: "Olivia Williams", review: "Silky smooth and so comfortable. I look forward to bedtime now!" },
  { name: "Zara Patel", review: "Exceptional quality and fast shipping. Highly recommend!" },
  { name: "Thabo Mbeki", review: "Transformed my bedroom into a luxury retreat. Love it!" },
  { name: "Ryan Foster", review: "The perfect investment for better sleep. Absolutely thrilled!" },
];

function ReviewSlider() {
  const { data } = useAllReviews(1, 20);

  const displayReviews = useMemo(() => {
    if (data?.reviews && data.reviews.length > 0) {
      return data.reviews.map(r => ({
        name: r.reviewer?.name || 'Customer',
        review: r.body || r.title || '',
      }));
    }
    return fallbackReviews;
  }, [data]);

  const duplicated = useMemo(() => [...displayReviews, ...displayReviews], [displayReviews]);

  return (
    <div className="w-full bg-[#f5f1ed] py-4 overflow-hidden">
      <div className="relative">
        <motion.div
          className="flex gap-6 px-4"
          animate={{
            x: [0, -40 * displayReviews.length]
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear"
            }
          }}
        >
          {duplicated.map((review, index) => (
            <div key={index} className="flex-shrink-0">
              <p className="text-gray-700 text-sm font-sans italic">
                "{review.review}" — <span className="font-semibold not-italic">{review.name}</span>
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export function StoreHero() {
  return (
    <section className="w-full md:mb-4">
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
              to="/product/winter-cloud"
              className="inline-block bg-white text-gray-900 px-8 py-3 text-[10px] font-semibold tracking-[0.2em] uppercase rounded-sm hover:bg-gray-100 transition-all duration-300"
            >
              Shop Bundle
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Design (>= md) - Original Implementation */}
      <div className="hidden md:grid grid-cols-2 gap-4 px-6">
        {/* Left Item - Organic Forms */}
        <Link to="/product/winter-cloud" className="group cursor-pointer">
          <div className="relative aspect-[4/5] overflow-hidden mb-3">
            <img
              src="/image1.png"
              alt="Organic Forms"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Right Item - Chain Collection */}
        <Link to="/product/winter-cloud" className="group cursor-pointer">
          <div className="relative aspect-[4/5] overflow-hidden mb-3">
            <img
              src="https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=1200&auto=format&fit=crop&q=80"
              alt="Chain Collection"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </Link>
      </div>

      {/* Review Slider Section */}
      <ReviewSlider />
    </section>
  );
}

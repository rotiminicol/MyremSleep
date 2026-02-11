// BlogPage.tsx - Elevated "Best of the Week" Design
import { motion, useScroll, useTransform } from 'framer-motion';
import { StoreNavbar } from '@/components/store/StoreNavbar';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { MOCK_PRODUCTS } from '@/lib/mock-products';

export const BLOG_POSTS = [
    {
        id: 1,
        slug: 'choose-care-organic-cotton-bedding',
        date: 'Sep 06, 2022',
        title: 'Get to your dream now destinations with Travel Pro',
        image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=90',
        category: 'Travel',
        excerpt: 'Master the art of preserving your organic cotton bedding with gentle care techniques that extend its lifespan and maintain its exceptional softness.',
        readTime: '6 min read',
        content: `Refined content placeholder...`
    },
    {
        id: 2,
        slug: 'perfect-bedding-skin-type',
        date: '01.27.26',
        title: 'How To Choose The Perfect Bedding For Your Skin Type',
        image: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&q=90',
        category: 'Wellness',
        excerpt: 'Discover how the right fabric choice can transform your sleep quality.',
        readTime: '5 min read',
        content: `Refined content placeholder...`
    },
    {
        id: 3,
        slug: 'organic-cotton-special',
        date: '01.22.26',
        title: 'What Makes Organic Cotton Bedding So Special',
        image: 'https://images.unsplash.com/photo-1505693419166-4192c39c56b2?auto=format&fit=crop&q=90',
        category: 'Sustainability',
        excerpt: 'Explore the meticulous journey of GOTS-certified organic cotton.',
        readTime: '7 min read',
        content: `Refined content placeholder...`
    }
];

export default function BlogPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    return (
        <div className="min-h-screen bg-[#FAF7F5]" ref={containerRef}>
            <StoreNavbar />

            {/* Refined "Best of the Week" Header */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 lg:pt-12 pb-4 flex items-baseline justify-between mb-4 sm:mb-8">
                <div className="flex items-baseline gap-2 sm:gap-6">
                    <h1 className="text-3xl sm:text-5xl lg:text-8xl font-black italic font-sans text-gray-900 tracking-tighter">
                        Best of the week
                    </h1>
                    <Link to="/blog" className="text-[10px] sm:text-xs font-bold text-gray-900 hover:opacity-70 transition-colors">
                        See all posts <span className="ml-0.5 sm:ml-1">→</span>
                    </Link>
                </div>
            </div>

            {/* Bento Grid Layout - "Best of the Week" Refined */}
            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 pb-20 lg:pb-32">
                <div className="grid grid-cols-12 gap-3 sm:gap-6 lg:gap-8">
                    {/* 1. Featured Product Container */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="col-span-8 group relative rounded-[1.5rem] sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden bg-gray-100 aspect-[4/3] sm:h-[600px] lg:h-[750px]"
                    >
                        <Link to={`/blog/${BLOG_POSTS[0].slug}`} className="block h-full relative">
                            <img
                                src={MOCK_PRODUCTS[0].node.images.edges[0].node.url}
                                alt={MOCK_PRODUCTS[0].node.title}
                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                            />

                            {/* Bottom Right Arrow Button */}
                            <div className="absolute bottom-4 right-4 sm:bottom-8 sm:right-8 z-30">
                                <div className="w-8 h-8 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center text-gray-900 shadow-xl group-hover:scale-110 transition-transform duration-500">
                                    <svg className="w-4 h-4 sm:w-8 sm:h-8 rotate-[-45deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    </motion.div>

                    {/* 2. Side Product Containers */}
                    <div className="col-span-4 flex flex-col gap-3 sm:gap-6 lg:gap-8">
                        {/* Top Side Product */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-[#b8d0d1] rounded-[1.5rem] sm:rounded-[2rem] p-4 sm:p-8 flex flex-col justify-between aspect-square sm:h-[300px] lg:h-[360px] relative group overflow-hidden"
                        >
                            <Link to={`/blog/${BLOG_POSTS[1].slug}`} className="absolute inset-0 z-0">
                                <img
                                    src={MOCK_PRODUCTS[1].node.images.edges[0].node.url}
                                    alt={MOCK_PRODUCTS[1].node.title}
                                    className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110"
                                />
                            </Link>

                            <div className="relative z-10 flex justify-between items-start">
                                <span className="px-2 py-0.5 sm:px-4 sm:py-1.5 bg-white/30 border border-white/20 rounded-full text-[6px] sm:text-[10px] font-bold text-gray-900 uppercase tracking-widest">
                                    HOT NOW
                                </span>
                            </div>

                            <div className="relative z-10">
                            </div>
                        </motion.div>

                        {/* Bottom Side Product */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden relative group aspect-square sm:h-[300px] lg:h-[360px]"
                        >
                            <Link to={`/blog/${BLOG_POSTS[2].slug}`} className="block h-full relative">
                                <img
                                    src={MOCK_PRODUCTS[2].node.images.edges[0].node.url}
                                    alt={MOCK_PRODUCTS[2].node.title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />

                                <div className="absolute top-3 right-3 sm:top-6 sm:right-6 w-fit h-fit px-2 py-1 sm:px-4 sm:py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white text-[8px] sm:text-xs font-bold">
                                    £{MOCK_PRODUCTS[2].node.priceRange.minVariantPrice.amount}
                                </div>
                            </Link>
                        </motion.div>
                    </div>


                </div>
            </main>
        </div>
    );
}
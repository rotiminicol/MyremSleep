// BlogPage.tsx - Elevated "Best of the Week" Design
import { motion, useScroll } from 'framer-motion';
import { SimpleBackButton } from '@/components/SimpleBackButton';
import { Link } from 'react-router-dom';
import { useRef } from 'react';
import { useBlogArticles } from '@/hooks/useBlogArticles';

export default function BlogPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const { data: posts = [], isLoading } = useBlogArticles(6);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#f5f1ed]">
                <SimpleBackButton />
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 sm:pt-2 lg:pt-4 pb-6 sm:pb-4 mb-6 sm:mb-8">
                    <h1 className="text-4xl sm:text-5xl lg:text-8xl font-black italic font-sans text-gray-900 tracking-tighter">
                        Best of the week
                    </h1>
                </div>
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
                        <div className="sm:col-span-8 rounded-[2rem] lg:rounded-[2.5rem] bg-gray-100 aspect-[3/4] sm:aspect-auto sm:h-[600px] lg:h-[750px] animate-pulse" />
                        <div className="sm:col-span-4 flex flex-col gap-4 sm:gap-6 lg:gap-8">
                            <div className="rounded-[2rem] bg-gray-100 aspect-[4/3] sm:aspect-auto sm:h-[300px] lg:h-[360px] animate-pulse" />
                            <div className="rounded-[2rem] bg-gray-100 aspect-[4/3] sm:aspect-auto sm:h-[300px] lg:h-[360px] animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="min-h-screen bg-[#f5f1ed]">
                <SimpleBackButton />
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 sm:pt-2 lg:pt-4 pb-6 sm:pb-4 mb-6 sm:mb-8">
                    <h1 className="text-4xl sm:text-5xl lg:text-8xl font-black italic font-sans text-gray-900 tracking-tighter">
                        Best of the week
                    </h1>
                </div>
                <main className="max-w-[1600px] mx-auto px-4 sm:px-6 pb-16 sm:pb-20 lg:pb-32">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
                        {/* Featured placeholder */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="sm:col-span-8 relative rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 aspect-[3/4] sm:aspect-auto sm:h-[600px] lg:h-[750px] flex flex-col items-center justify-center text-center p-8 sm:p-12"
                        >
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200/60 flex items-center justify-center mb-6 sm:mb-8">
                                <svg className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-gray-900 mb-3 sm:mb-4">
                                Stories are coming soon
                            </h2>
                            <p className="text-sm sm:text-base text-gray-400 max-w-md leading-relaxed">
                                We're crafting thoughtful articles about sleep, wellness, and sustainable living. Check back soon for fresh reads.
                            </p>
                        </motion.div>

                        {/* Side placeholders */}
                        <div className="sm:col-span-4 flex flex-col gap-4 sm:gap-6 lg:gap-8">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                className="rounded-[2rem] bg-gradient-to-br from-[#d5e3e4] to-[#b8d0d1] aspect-[4/3] sm:aspect-auto sm:h-[300px] lg:h-[360px] flex items-end p-6 sm:p-8"
                            >
                                <span className="px-3 py-1.5 sm:px-4 sm:py-1.5 bg-white/30 border border-white/20 rounded-full text-[9px] sm:text-[10px] font-bold text-gray-700 uppercase tracking-widest">
                                    Coming soon
                                </span>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="rounded-[2rem] bg-gradient-to-br from-gray-200 to-gray-100 aspect-[4/3] sm:aspect-auto sm:h-[300px] lg:h-[360px] flex items-end p-6 sm:p-8"
                            >
                                <span className="px-3 py-1.5 sm:px-4 sm:py-1.5 bg-white/40 border border-white/30 rounded-full text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                    Stay tuned
                                </span>
                            </motion.div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#f5f1ed]" ref={containerRef}>
            <SimpleBackButton />

            {/* Refined "Best of the Week" Header */}
            <div className="max-w-[1600px] mx-auto px-4 sm:px-6 pt-4 sm:pt-2 lg:pt-4 pb-6 sm:pb-4 flex flex-col sm:flex-row items-start sm:items-baseline justify-between gap-3 sm:gap-0 mb-6 sm:mb-8">
                <div className="flex items-baseline gap-3 sm:gap-6">
                    <h1 className="text-4xl sm:text-5xl lg:text-8xl font-black italic font-sans text-gray-900 tracking-tighter">
                        Best of the week
                    </h1>
                </div>
                <Link
                    to="/blog/all"
                    className="text-xs sm:text-xs font-bold text-gray-900 hover:opacity-70 transition-colors flex items-center gap-1 py-2 px-1"
                >
                    See all posts <span className="ml-1">→</span>
                </Link>
            </div>

            {/* Bento Grid Layout - "Best of the Week" Refined */}
            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 pb-16 sm:pb-20 lg:pb-32">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-6 lg:gap-8">
                    {/* 1. Featured Blog Post Container */}
                    {posts[0] && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="sm:col-span-8 group relative rounded-[2rem] sm:rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden bg-gray-100 aspect-[3/4] sm:aspect-auto sm:h-[600px] lg:h-[750px]"
                        >
                            <Link to={`/blog/${posts[0].slug}`} className="block h-full relative">
                                <img
                                    src={posts[0].image}
                                    alt={posts[0].title}
                                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent sm:from-transparent sm:via-transparent sm:to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-6 sm:hidden z-20">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1.5 bg-white text-[10px] font-bold text-gray-900 rounded-full uppercase tracking-wider shadow-sm">
                                                {posts[0].category}
                                            </span>
                                            <span className="text-[11px] font-semibold text-white drop-shadow-lg">
                                                {posts[0].readTime}
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-bold font-serif text-white leading-tight drop-shadow-lg">
                                            {posts[0].title}
                                        </h2>
                                    </div>
                                </div>
                                <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 z-30">
                                    <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center text-gray-900 shadow-xl group-hover:scale-110 transition-transform duration-500">
                                        <svg className="w-5 h-5 sm:w-8 sm:h-8 rotate-[-45deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    )}

                    {/* 2. Side Blog Post Containers */}
                    <div className="sm:col-span-4 flex flex-col gap-4 sm:gap-6 lg:gap-8">
                        {posts[1] && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="bg-[#b8d0d1] rounded-[2rem] sm:rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between aspect-[4/3] sm:aspect-auto sm:h-[300px] lg:h-[360px] relative group overflow-hidden"
                            >
                                <Link to={`/blog/${posts[1].slug}`} className="absolute inset-0 z-0">
                                    <img
                                        src={posts[1].image}
                                        alt={posts[1].title}
                                        className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110"
                                    />
                                </Link>
                                <div className="relative z-10 flex justify-between items-start">
                                    <span className="px-3 py-1.5 sm:px-4 sm:py-1.5 bg-white/30 border border-white/20 rounded-full text-[9px] sm:text-[10px] font-bold text-gray-900 uppercase tracking-widest">
                                        HOT NOW
                                    </span>
                                </div>
                                <div className="relative z-10 sm:hidden">
                                    <h3 className="text-xl font-bold font-serif text-white drop-shadow-lg leading-tight">
                                        {posts[1].title}
                                    </h3>
                                </div>
                            </motion.div>
                        )}

                        {posts[2] && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                className="rounded-[2rem] sm:rounded-[2rem] overflow-hidden relative group aspect-[4/3] sm:aspect-auto sm:h-[300px] lg:h-[360px]"
                            >
                                <Link to={`/blog/${posts[2].slug}`} className="block h-full relative">
                                    <img
                                        src={posts[2].image}
                                        alt={posts[2].title}
                                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent sm:bg-black/10 sm:group-hover:bg-black/20 transition-colors" />
                                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:hidden z-20">
                                        <h3 className="text-xl font-bold font-serif text-white leading-tight drop-shadow-lg">
                                            {posts[2].title}
                                        </h3>
                                    </div>
                                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6 w-fit h-fit px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white sm:bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-gray-900 sm:text-white text-[10px] sm:text-xs font-bold shadow-sm">
                                        {posts[2].readTime}
                                    </div>
                                </Link>
                            </motion.div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

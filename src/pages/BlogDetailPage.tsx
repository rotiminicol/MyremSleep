import { useRef, useEffect, useState } from 'react';

import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BLOG_POSTS } from './BlogPage';
import NotFound from './NotFound';

export default function BlogDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const navigate = useNavigate();
    const post = BLOG_POSTS.find((p) => p.slug === slug);
    const contentRef = useRef<HTMLDivElement>(null);
    const [readingProgress, setReadingProgress] = useState(0);

    const { scrollYProgress } = useScroll({
        target: contentRef,
        offset: ["start start", "end end"]
    });

    useEffect(() => {
        const unsubscribe = scrollYProgress.onChange(value => {
            setReadingProgress(Math.round(value * 100));
        });
        return () => unsubscribe();
    }, [scrollYProgress]);

    if (!post) {
        return <NotFound />;
    }

    return (
        <div className="h-screen overflow-hidden flex flex-col lg:flex-row bg-[#FAF7F5]">
            {/* Immersive Top Controls (Fixed on screen) */}
            <div className="fixed top-0 left-0 right-0 p-4 sm:p-6 lg:p-10 flex items-center justify-between z-50 pointer-events-none">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/blog')}
                    className="pointer-events-auto w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 flex items-center justify-center text-gray-900 hover:bg-gray-900 hover:text-white transition-all duration-500 shadow-lg group"
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </motion.button>
            </div>


            {/* Left Side: Hero Image (Fixed/Cover) */}
            <div className="w-full lg:w-1/2 h-[50vh] lg:h-full relative overflow-hidden shrink-0">
                <motion.img
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Right Side: Content Area (Scrollable) */}
            <main
                ref={contentRef}
                className="w-full lg:w-1/2 h-full overflow-y-auto relative scroll-smooth bg-[#FAF7F5]"
            >
                {/* Reading Progress Bar (attached to right column) */}
                <motion.div
                    className="absolute top-0 left-0 right-0 h-1 bg-gray-900/10 z-[60] origin-left"
                    style={{ scaleX: scrollYProgress }}
                />

                <div className="px-4 sm:px-6 lg:px-12 py-8 sm:py-12 lg:py-16">
                    {/* Header Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4 sm:space-y-6 mb-8 sm:mb-12"
                    >
                        <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                            <span className="px-3 py-1.5 sm:px-3 sm:py-1 bg-gray-900 text-[10px] sm:text-[11px] font-bold text-white rounded-full">
                                {post.category}
                            </span>
                            <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 uppercase tracking-wider sm:tracking-widest">
                                {post.readTime}
                            </span>
                        </div>

                        <h1 className="text-3xl sm:text-4xl lg:text-6xl font-serif text-gray-900 leading-[1.1] tracking-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-4 sm:gap-6 text-[10px] sm:text-[11px] font-mono text-gray-400 uppercase tracking-wider sm:tracking-widest flex-wrap">
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>By The Editor</span>
                        </div>
                    </motion.div>

                    {/* Article Content */}
                    <motion.article
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="prose prose-lg max-w-none"
                        style={{
                            fontSize: '16px',
                            lineHeight: '1.8',
                            color: '#374151'
                        }}
                    >
                        {post.content.split('\n\n').map((paragraph, idx) => (
                            <p key={idx} className="mb-6 sm:mb-8 text-[15px] sm:text-base leading-relaxed">
                                {paragraph}
                            </p>
                        ))}
                    </motion.article>

                    {/* Article Footer */}
                    <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-gray-200 flex justify-end">
                        <Link
                            to="/blog"
                            className="group inline-flex items-center gap-4 text-[10px] sm:text-[11px] font-bold text-gray-900 uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:gap-6 transition-all py-3 px-1"
                        >
                            <span className="w-6 sm:w-8 h-[1px] bg-gray-900 transition-all duration-500 group-hover:w-10 sm:group-hover:w-12" />
                            Back to Blog
                        </Link>
                    </div>

                    {/* Next Reads - Elevated Design */}
                    <div className="mt-20 sm:mt-32">
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-8 sm:mb-12">
                            Continue Reading
                        </h3>
                        <div className="grid grid-cols-1 gap-6 sm:gap-8">
                            {BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 2).map((recommended, idx) => (
                                <motion.div
                                    key={recommended.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                >
                                    <Link
                                        to={`/blog/${recommended.slug}`}
                                        className="group block relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] bg-gray-50 hover:shadow-2xl transition-all duration-500"
                                    >
                                        <div className="aspect-[16/9] overflow-hidden">
                                            <img
                                                src={recommended.image}
                                                alt={recommended.title}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="p-6 sm:p-8">
                                            <div className="flex items-center gap-3 mb-3 sm:mb-4 flex-wrap">
                                                <span className="px-3 py-1 bg-gray-900 text-[9px] sm:text-[10px] font-bold text-white rounded-full uppercase tracking-wider sm:tracking-widest">
                                                    {recommended.category}
                                                </span>
                                                <span className="text-[10px] sm:text-[11px] text-gray-400 font-medium">
                                                    {recommended.readTime}
                                                </span>
                                            </div>
                                            <h4 className="text-lg sm:text-xl lg:text-2xl font-bold font-serif text-gray-900 leading-tight group-hover:text-gray-600 transition-colors mb-2 sm:mb-3">
                                                {recommended.title}
                                            </h4>
                                            <p className="text-sm sm:text-base text-gray-500 line-clamp-2">
                                                {recommended.excerpt}
                                            </p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Vertical Scroll Progress Indicator */}
                <div className="fixed right-4 top-1/2 -translate-y-1/2 h-32 w-px bg-gray-200 hidden lg:block">
                    <motion.div
                        className="w-full bg-gray-900 origin-top"
                        style={{ height: '100%', scaleY: scrollYProgress }}
                    />
                </div>
            </main>
        </div>
    );
}

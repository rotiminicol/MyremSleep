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
            <div className="fixed top-0 left-0 right-0 p-6 lg:p-10 flex items-center justify-between z-50 pointer-events-none">
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate('/blog')}
                    className="pointer-events-auto w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all duration-500 shadow-xl group"
                >
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                </motion.button>

                <div className="w-12 h-12" /> {/* Spacer */}
            </div>


            {/* Left Side: Hero Image (Fixed/Cover) */}
            <div className="w-full lg:w-1/2 h-[40vh] lg:h-full relative overflow-hidden shrink-0">
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

                <div className="px-6 lg:px-16 pt-32 pb-24 max-w-2xl mx-auto lg:mx-0">
                    {/* Header Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6 mb-12"
                    >
                        <div className="flex items-center gap-4">
                            <span className="px-3 py-1 bg-gray-900 text-[10px] font-bold text-white rounded-full">
                                {post.category}
                            </span>
                            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest">
                                {post.readTime}
                            </span>
                        </div>

                        <h1 className="text-4xl lg:text-6xl font-serif text-gray-900 leading-[1.1] tracking-tight">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-6 text-[11px] font-mono text-gray-400 uppercase tracking-widest">
                            <span>{post.date}</span>
                            <span>•</span>
                            <span>By The Editor</span>
                        </div>
                    </motion.div>

                    {/* Article Body */}
                    <motion.article
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="prose prose-stone max-w-none"
                    >
                        <div className="space-y-8 text-gray-700 leading-relaxed">
                            <p className="text-xl font-light text-gray-500 italic border-l-4 border-gray-900 pl-6 py-2">
                                {post.excerpt}
                            </p>

                            <div className="text-base lg:text-lg leading-relaxed space-y-6">
                                {post.content.split('\n\n').map((paragraph, idx) => (
                                    <p key={idx} className={idx === 0 ? "first-letter:text-7xl first-letter:font-serif first-letter:mr-3 first-letter:float-left first-letter:text-gray-900 first-letter:leading-[0.8]" : ""}>
                                        {paragraph.trim()}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </motion.article>

                    {/* Article Footer */}
                    <div className="mt-16 pt-12 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em]">
                                    Share
                                </h4>
                                <div className="flex gap-6">
                                    {['Twitter', 'Facebook', 'Pinterest'].map((platform) => (
                                        <button
                                            key={platform}
                                            className="text-[10px] font-bold text-gray-900 hover:opacity-50 transition-opacity uppercase tracking-widest"
                                        >
                                            {platform}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <Link
                                to="/blog"
                                className="group inline-flex items-center gap-4 text-[11px] font-bold text-gray-900 uppercase tracking-[0.2em]"
                            >
                                <span className="w-8 h-[1px] bg-gray-900 transition-all duration-500 group-hover:w-12" />
                                Journal
                            </Link>
                        </div>
                    </div>

                    {/* Recommended Reading */}
                    <div className="mt-24">
                        <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em] mb-8">
                            Next Reads
                        </h3>
                        <div className="grid grid-cols-1 gap-6">
                            {BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 2).map((recommended, idx) => (
                                <motion.div
                                    key={recommended.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                >
                                    <Link
                                        to={`/blog/${recommended.slug}`}
                                        className="group flex gap-4 items-center bg-white p-4 rounded-3xl border border-gray-100 hover:border-gray-900/10 transition-colors shadow-sm"
                                    >
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                                            <img
                                                src={recommended.image}
                                                alt={recommended.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <span className="text-[9px] font-bold text-gray-400 tracking-widest uppercase block mb-1">
                                                {recommended.category}
                                            </span>
                                            <h4 className="text-sm font-bold font-serif text-gray-900 group-hover:text-gray-600 transition-colors">
                                                {recommended.title}
                                            </h4>
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

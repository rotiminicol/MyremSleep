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
        <div className="min-h-screen bg-[#FAF7F5]">
            {/* Immersive Top Controls (instead of Navbar) */}
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

                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="pointer-events-auto"
                >
                    <Link to="/" className="text-xl font-bold font-serif text-white tracking-widest hover:opacity-70 transition-opacity">
                        REMSLEEP
                    </Link>
                </motion.div>

                <div className="w-12 h-12" /> {/* Spacer */}
            </div>

            {/* Reading Progress Bar */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-white/40 to-white/10 z-50 origin-left"
                style={{ scaleX: scrollYProgress }}
            />

            {/* Floating Reading Indicator */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="fixed bottom-8 right-8 z-50 hidden lg:block"
            >
                <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2 shadow-lg">
                    <span className="text-xs font-mono text-gray-600">
                        {readingProgress}% read
                    </span>
                </div>
            </motion.div>

            <main ref={contentRef}>
                {/* Hero Section */}
                <div className="relative h-[70vh] lg:h-[80vh] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F5] via-transparent to-transparent z-10" />
                    <div className="absolute inset-0 bg-black/30 z-10" />

                    <motion.img
                        initial={{ scale: 1.2 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />

                    {/* Hero Content */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 px-6 lg:px-20 pb-16 lg:pb-24">
                        <div className="max-w-4xl mx-auto lg:mx-0">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold text-gray-900 rounded-full">
                                        {post.category}
                                    </span>
                                    <span className="text-[10px] font-medium text-white/90">
                                        {post.readTime}
                                    </span>
                                </div>
                                <h1 className="text-4xl lg:text-7xl font-serif text-white leading-[1.1] tracking-tight max-w-3xl">
                                    {post.title}
                                </h1>
                                <div className="flex items-center gap-6 text-sm text-white/80">
                                    <span>{post.date}</span>
                                    <span>•</span>
                                    <span>By The Editor</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* Article Content */}
                <div className="max-w-3xl mx-auto px-6 py-16 lg:py-24">
                    {/* Breadcrumbs */}
                    <motion.nav
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center gap-3 text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-12 pb-12 border-b border-gray-200"
                    >
                        <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
                        <span>/</span>
                        <Link to="/blog" className="hover:text-gray-900 transition-colors">Journal</Link>
                        <span>/</span>
                        <span className="text-gray-900 line-clamp-1">{post.title}</span>
                    </motion.nav>

                    {/* Article Body */}
                    <motion.article
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="prose prose-lg prose-stone max-w-none"
                    >
                        <div className="space-y-8 text-gray-700 leading-relaxed">
                            <p className="text-xl lg:text-2xl font-light text-gray-600 italic border-l-4 border-gray-900 pl-6 py-2">
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
                    <div className="mt-16 pt-16 border-t border-gray-200">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em]">
                                    Share this article
                                </h4>
                                <div className="flex gap-6">
                                    {['Twitter', 'Facebook', 'Pinterest', 'Email'].map((platform) => (
                                        <button
                                            key={platform}
                                            className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
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
                                <span className="w-10 h-[1px] bg-gray-900 transition-all duration-500 group-hover:w-16" />
                                Back to Journal
                            </Link>
                        </div>
                    </div>

                    {/* Recommended Reading - Bento Card Style */}
                    <div className="mt-24 pt-16 border-t border-gray-200">
                        <h3 className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em] mb-12">
                            Continue Reading
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 2).map((recommended, idx) => (
                                <motion.div
                                    key={recommended.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                >
                                    <Link
                                        to={`/blog/${recommended.slug}`}
                                        className="group block relative rounded-[2.5rem] overflow-hidden bg-[#EFE9E4] aspect-[4/3]"
                                    >
                                        <img
                                            src={recommended.image}
                                            alt={recommended.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                                        <div className="absolute bottom-6 left-6 right-6 z-20">
                                            <span className="text-[10px] font-bold text-white/80 tracking-widest uppercase mb-1 block">
                                                {recommended.category}
                                            </span>
                                            <h4 className="text-xl font-bold font-serif text-white leading-tight">
                                                {recommended.title}
                                            </h4>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
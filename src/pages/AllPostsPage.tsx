import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useBlogArticles } from '@/hooks/useBlogArticles';

export default function AllPostsPage() {
    const navigate = useNavigate();
    const { data: posts = [], isLoading } = useBlogArticles(50);

    return (
        <div className="min-h-screen bg-[#FAF7F5] pb-16 sm:pb-24">
            {/* Top Controls */}
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
                <div className="w-12 h-12" />
            </div>

            {/* Header Content */}
            <header className="pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-12 max-w-[1600px] mx-auto text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3 sm:space-y-4"
                >
                    <span className="text-[9px] sm:text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em] sm:tracking-[0.4em]">
                        Discover more
                    </span>
                    <h1 className="text-4xl sm:text-5xl lg:text-8xl font-black italic font-sans text-gray-900 tracking-tighter">
                        Our Blog
                    </h1>
                </motion.div>
            </header>

            {/* Content */}
            <main className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12">
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-8 gap-y-12 sm:gap-y-16">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="space-y-6">
                                <div className="aspect-[4/5] rounded-[2rem] bg-gray-100 animate-pulse" />
                                <div className="space-y-3 px-2">
                                    <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                                    <div className="h-6 w-3/4 bg-gray-100 rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : posts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col items-center justify-center py-24 sm:py-32 text-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-8">
                            <svg className="w-10 h-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-serif text-gray-900 mb-3">Stories are on their way</h2>
                        <p className="text-sm sm:text-base text-gray-400 max-w-sm leading-relaxed">
                            We're working on thoughtful articles about sleep, wellness, and sustainable living. Check back soon.
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 sm:gap-x-8 gap-y-12 sm:gap-y-16 lg:gap-y-24">
                        {posts.map((post, idx) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: (idx % 3) * 0.1 }}
                            >
                                <Link to={`/blog/${post.slug}`} className="group block space-y-6 sm:space-y-8">
                                    <div className="aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gray-100 shadow-xl sm:shadow-2xl transition-transform duration-700 group-hover:scale-[0.98] relative">
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
                                    </div>
                                    <div className="space-y-3 sm:space-y-4 px-1 sm:px-2">
                                        <div className="flex items-center gap-3 sm:gap-4">
                                            <span className="text-[10px] sm:text-[11px] font-bold text-gray-400 uppercase tracking-wider sm:tracking-widest">
                                                {post.category}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                                            <span className="text-[10px] sm:text-[11px] font-medium text-gray-400">
                                                {post.readTime}
                                            </span>
                                        </div>
                                        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif text-gray-900 leading-tight group-hover:text-gray-600 transition-colors">
                                            {post.title}
                                        </h2>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

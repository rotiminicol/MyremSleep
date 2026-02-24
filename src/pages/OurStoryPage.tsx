import { SimpleBackButton } from '@/components/SimpleBackButton';
import { StoreFooter } from '@/components/store/StoreFooter';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Moon, Star, ArrowRight } from 'lucide-react';

export default function OurStoryPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.98]);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#f5f1ed] flex flex-col">
            <SimpleBackButton />

            <main className="flex-grow pt-8 pb-16 relative">
                {/* Animated background elements */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <motion.div 
                        className="absolute top-40 left-20 w-72 h-72 bg-[#e8e3dc] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                        animate={{
                            x: [0, 100, 0],
                            y: [0, 50, 0],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                    <motion.div 
                        className="absolute bottom-40 right-20 w-96 h-96 bg-[#d8d1c8] rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                        animate={{
                            x: [0, -100, 0],
                            y: [0, -50, 0],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                    />
                </div>

                {/* Hero Section */}
                <motion.section 
                    style={{ opacity: heroOpacity, scale: heroScale }}
                    className="relative px-6 mb-32 max-w-[1000px] mx-auto text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10"
                    >
                        <span className="text-sm tracking-[0.3em] text-[#8f877d] mb-6 block">OUR STORY</span>
                        <h1 className="text-5xl md:text-7xl font-serif text-gray-900 mb-8 leading-tight">
                            REMsleep
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed mb-12">
                            Complete bedding sets designed for calm, considered bedrooms that feel effortlessly finished.
                        </p>
                    </motion.div>
                </motion.section>

                {/* The Beginning */}
                <section className="px-6 max-w-[1000px] mx-auto mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="space-y-12"
                    >
                        <div className="text-center">
                            <span className="text-sm tracking-[0.2em] text-[#8f877d] block mb-4">THE FRUSTRATION</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">
                                A Simple Problem
                            </h2>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="space-y-6">
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    REMsleep began with a simple frustration: "premium bedding" still felt like a piecemeal purchase. A duvet cover here, a fitted sheet there, pillowcases from somewhere else—never quite matching, never quite finished.
                                </p>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    We wanted one set that looked quiet, felt indulgent, and stayed polished night after night.
                                </p>
                            </div>
                            
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="aspect-[4/3] bg-gradient-to-br from-[#e8e3dc] to-[#d8d1c8] rounded-3xl overflow-hidden"
                            >
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="text-center space-y-4">
                                        <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto">
                                            <Heart className="w-8 h-8 text-gray-700" />
                                        </div>
                                        <p className="text-gray-700 font-medium">The Search for Perfection</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* The Solution */}
                <section className="px-6 max-w-[1000px] mx-auto mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="space-y-12"
                    >
                        <div className="text-center">
                            <span className="text-sm tracking-[0.2em] text-[#8f877d] block mb-4">THE SOLUTION</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">
                                Built Different
                            </h2>
                        </div>
                        
                        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-sm">
                            <p className="text-gray-600 leading-relaxed text-lg text-center mb-8">
                                So we built the set we could not find: complete bundle sets in calm, seasonless colours—crafted from 100% Egyptian cotton sateen for a smooth drape, a subtle sheen, and that instantly finished feel.
                            </p>
                            
                            <div className="grid md:grid-cols-3 gap-8 text-center">
                                {[
                                    { icon: "✓", title: "Complete Sets", desc: "Everything included, nothing missing" },
                                    { icon: "✓", title: "Seasonless Colors", desc: "Calm neutrals that work year-round" },
                                    { icon: "✓", title: "Premium Materials", desc: "100% Egyptian cotton sateen" }
                                ].map((feature, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="space-y-4"
                                    >
                                        <div className="text-3xl text-gray-700">{feature.icon}</div>
                                        <h3 className="font-serif text-lg text-gray-900">{feature.title}</h3>
                                        <p className="text-sm text-gray-600">{feature.desc}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* The Philosophy */}
                <section className="px-6 max-w-[1000px] mx-auto mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="space-y-12"
                    >
                        <div className="text-center">
                            <span className="text-sm tracking-[0.2em] text-[#8f877d] block mb-4">THE PHILOSOPHY</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">
                                Less Is More
                            </h2>
                        </div>
                        
                        <div className="bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a] rounded-3xl p-16 text-white text-center">
                            <p className="text-xl leading-relaxed mb-8 italic">
                                "The goal is not more. No chasing matching pieces. No extra decisions. Just a calm reset, on repeat."
                            </p>
                            <div className="w-24 h-px bg-white/30 mx-auto"></div>
                        </div>
                    </motion.div>
                </section>

                {/* The Deeper Root */}
                <section className="px-6 max-w-[1000px] mx-auto mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="space-y-12"
                    >
                        <div className="text-center">
                            <span className="text-sm tracking-[0.2em] text-[#8f877d] block mb-4">THE MEANING</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">
                                A Deeper Root
                            </h2>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: true }}
                                className="aspect-square bg-gradient-to-br from-[#e8e3dc] to-[#d8d1c8] rounded-3xl overflow-hidden flex items-center justify-center"
                            >
                                <div className="text-center space-y-4">
                                    <Moon className="w-16 h-16 text-gray-700 mx-auto" />
                                    <p className="text-gray-700 font-medium">Joel 2:28</p>
                                </div>
                            </motion.div>
                            
                            <div className="space-y-6">
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    REMsleep has a deeper root. The name is drawn from Joel 2:28— The Spirit of God poured out; dreams and visions stirred awake.
                                </p>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    We hold that as a quiet truth: rest is not passive. It is where you exhale and make space for what is next. The room settles. The mind clears. In the stillness, sleep becomes restoration—sometimes even a return to dreaming again.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* The Mission */}
                <section className="px-6 max-w-[1000px] mx-auto mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="space-y-12"
                    >
                        <div className="text-center">
                            <span className="text-sm tracking-[0.2em] text-[#8f877d] block mb-4">THE MISSION</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">
                                Intentional Rest
                            </h2>
                        </div>
                        
                        <div className="space-y-8">
                            <p className="text-gray-600 leading-relaxed text-lg text-center">
                                We believe better sleep starts with better rituals. The bed sits at the centre, so we obsess over feel, drape, and the quiet details that change the whole room. A made bed, without the fuss—effortless, every day.
                            </p>
                            
                            <p className="text-gray-600 leading-relaxed text-lg text-center">
                                That is why we make bedding sets designed for bedrooms that feel calm, clean, and considered.
                            </p>
                            
                            <div className="bg-[#e8e3dc] rounded-2xl p-8 text-center">
                                <p className="text-xl font-serif text-gray-900 italic">
                                    "Our mission is simple: to make rest feel more intentional—through quiet materials, grounded colours, and complete sets designed for real life."
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Availability */}
                <section className="px-6 max-w-[1000px] mx-auto mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center space-y-8"
                    >
                        <div className="space-y-4">
                            <span className="text-sm tracking-[0.2em] text-[#8f877d] block">AVAILABILITY</span>
                            <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
                                Available Exclusively Online
                            </h2>
                        </div>
                        
                        <p className="text-gray-600 leading-relaxed text-lg max-w-2xl mx-auto">
                            REMsleep ships across the EU, bringing calm, considered bedding directly to your door.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link 
                                to="/store"
                                className="bg-[#2c2c2c] text-white px-8 py-3 rounded-full text-sm tracking-widest uppercase hover:bg-[#1a1a1a] transition-colors inline-flex items-center gap-2"
                            >
                                Shop Collection
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                </section>

                {/* Final Tagline */}
                <section className="px-6 max-w-[1000px] mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <div className="flex items-center justify-center gap-4 mb-8">
                            <Star className="w-6 h-6 text-[#8f877d]" />
                            <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
                                Crafted for Nightly Ritual
                            </h2>
                            <Star className="w-6 h-6 text-[#8f877d]" />
                        </div>
                        
                        <div className="w-32 h-px bg-[#d8d1c8] mx-auto"></div>
                    </motion.div>
                </section>
            </main>

            <StoreFooter />
        </div>
    );
}

import { SimpleBackButton } from '@/components/SimpleBackButton';
import { StoreFooter } from '@/components/store/StoreFooter';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, ArrowRight, CheckCircle } from 'lucide-react';

export default function AboutRemsleepPage() {
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
                        <span className="text-sm tracking-[0.3em] text-[#8f877d] mb-6 block">ABOUT REMSLEEP</span>
                        <h1 className="text-5xl md:text-7xl font-serif text-gray-900 mb-8 leading-tight">
                            Quiet-Luxe Bedding
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed mb-12">
                            For people who treat the bed as essential, not an afterthought.
                        </p>
                    </motion.div>
                </motion.section>

                {/* Our Philosophy */}
                <section className="px-6 max-w-[1000px] mx-auto mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="space-y-12"
                    >
                        <div className="text-center">
                            <span className="text-sm tracking-[0.2em] text-[#8f877d] block mb-4">OUR PHILOSOPHY</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">
                                Essential Comfort
                            </h2>
                        </div>
                        
                        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-sm">
                            <p className="text-gray-600 leading-relaxed text-lg text-center mb-8">
                                We design for the feel, the drape, and the small details that make a room look instantly calmer. The bedroom is where your nervous system resets, your mind softens, and tomorrow starts quietly.
                            </p>
                            
                            <div className="bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a] rounded-2xl p-8 text-center">
                                <p className="text-xl leading-relaxed text-white italic">
                                    "We believe comfort is not 'extra'. It is essential."
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Our Materials */}
                <section className="px-6 max-w-[1000px] mx-auto mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="space-y-12"
                    >
                        <div className="text-center">
                            <span className="text-sm tracking-[0.2em] text-[#8f877d] block mb-4">OUR MATERIALS</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">
                                Premium Egyptian Cotton
                            </h2>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-16 items-center">
                            <div className="space-y-6">
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    We launch with 100% Egyptian cotton sateen in a 300 thread count sateen weave—smooth on skin, breathable through the night, with a refined, subtle sheen.
                                </p>
                                <p className="text-gray-600 leading-relaxed text-lg">
                                    Softer and more cocooning than crisp percale, with a finish that looks polished even when life is not.
                                </p>
                            </div>
                            
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                viewport={{ once: true }}
                                className="aspect-square bg-gradient-to-br from-[#e8e3dc] to-[#d8d1c8] rounded-3xl overflow-hidden flex items-center justify-center"
                            >
                                <div className="text-center space-y-4">
                                    <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center mx-auto">
                                        <Star className="w-8 h-8 text-gray-700" />
                                    </div>
                                    <p className="text-gray-700 font-medium">100% Egyptian Cotton</p>
                                    <p className="text-sm text-gray-600">300 Thread Count Sateen</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* Color Palette */}
                <section className="px-6 max-w-[1000px] mx-auto mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="space-y-12"
                    >
                        <div className="text-center">
                            <span className="text-sm tracking-[0.2em] text-[#8f877d] block mb-4">COLOR PALETTE</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">
                                Seasonless Neutrals
                            </h2>
                        </div>
                        
                        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-sm">
                            <p className="text-gray-600 leading-relaxed text-lg text-center mb-8">
                                Our palette is seasonless and designed to layer: modern neutrals and grounded tones that make the space feel considered, make your space feel calmer the moment you walk in.
                            </p>
                            
                            {/* Color swatches */}
                            <div className="flex justify-center gap-4 flex-wrap">
                                {[
                                    { name: 'Winter Cloud', hex: '#F5F5F7' },
                                    { name: 'Desert Whisperer', hex: '#E5DACE' },
                                    { name: 'Buttermilk', hex: '#FFF4D2' },
                                    { name: 'Clay', hex: '#D2C4B5' },
                                    { name: 'Clay Blush', hex: '#D9A891' },
                                    { name: 'Pebble Haze', hex: '#A3A3A3' },
                                    { name: 'Desert Sand', hex: '#E2CA9D' },
                                    { name: 'Cinnamon Bark', hex: '#8B4513' }
                                ].map((color, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                        className="text-center"
                                    >
                                        <div 
                                            className="w-16 h-16 rounded-full shadow-sm mb-2 border border-gray-200"
                                            style={{ backgroundColor: color.hex }}
                                        />
                                        <p className="text-xs text-gray-600">{color.name}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Bundle Sets */}
                <section className="px-6 max-w-[1000px] mx-auto mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="space-y-12"
                    >
                        <div className="text-center">
                            <span className="text-sm tracking-[0.2em] text-[#8f877d] block mb-4">COMPLETE SETS</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-8">
                                Actually Complete
                            </h2>
                        </div>
                        
                        <div className="bg-gradient-to-br from-[#2c2c2c] to-[#1a1a1a] rounded-3xl p-16 text-white text-center">
                            <p className="text-xl leading-relaxed mb-8">
                                That is why we are launching with bundle sets, that actually complete the bed: duvet cover, fitted sheet, and four pillowcases included.
                            </p>
                            
                            <div className="space-y-6 mb-8">
                                {[
                                    "You do not need to add extras to get the look you want.",
                                    "You do not need to chase matching whites.",
                                    "You do not need to build a set piece by piece."
                                ].map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.2 }}
                                        viewport={{ once: true }}
                                        className="flex items-center justify-center gap-3"
                                    >
                                        <CheckCircle className="w-5 h-5 text-green-400" />
                                        <span className="text-lg">{benefit}</span>
                                    </motion.div>
                                ))}
                            </div>
                            
                            <div className="w-32 h-px bg-white/30 mx-auto"></div>
                        </div>
                    </motion.div>
                </section>

                {/* One Click */}
                <section className="px-6 max-w-[1000px] mx-auto mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center space-y-8"
                    >
                        <div className="space-y-4">
                            <span className="text-sm tracking-[0.2em] text-[#8f877d] block">EFFORTLESS DESIGN</span>
                            <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
                                One Click, Done
                            </h2>
                        </div>
                        
                        <div className="space-y-6">
                            <p className="text-gray-600 leading-relaxed text-lg max-w-2xl mx-auto">
                                One click, and your bed is done. One set. A finished look.
                            </p>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                                <Link 
                                    to="/store"
                                    className="bg-[#2c2c2c] text-white px-8 py-3 rounded-full text-sm tracking-widest uppercase hover:bg-[#1a1a1a] transition-colors inline-flex items-center gap-2"
                                >
                                    Shop Bundle Sets
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
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
                            <Heart className="w-6 h-6 text-[#8f877d]" />
                            <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
                                Rest. Renew. Awaken New Dreams.
                            </h2>
                            <Heart className="w-6 h-6 text-[#8f877d]" />
                        </div>
                        
                        <div className="w-32 h-px bg-[#d8d1c8] mx-auto"></div>
                    </motion.div>
                </section>
            </main>

            <StoreFooter />
        </div>
    );
}

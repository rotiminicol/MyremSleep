import { SimpleBackButton } from '@/components/SimpleBackButton';
import { StoreFooter } from '@/components/store/StoreFooter';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Leaf } from 'lucide-react';

export default function MaterialsPage() {
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
                        <span className="text-sm tracking-[0.3em] text-[#8f877d] mb-6 block">MATERIALS</span>
                        <h1 className="text-5xl md:text-7xl font-serif text-gray-900 mb-8 leading-tight">
                            Materials +
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed mb-12">
                            Materials, kept simple and clean
                        </p>
                    </motion.div>
                </motion.section>

                {/* Main Content */}
                <section className="px-6 max-w-[1000px] mx-auto mb-32">
                    <div className="space-y-32">
                        {/* Main Materials Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-sm"
                        >
                            <p className="text-gray-600 leading-relaxed text-lg">
                                We start with what matters: natural fibres, a compact weave, and a finish that keeps its shape and look over time. REMsleep bundle sets are made from 100% Egyptian cotton in a 300 thread count sateen weave—smooth on skin, breathable through the night, with a subtle, quiet sheen. No fuss. No extras. Just clean materials that make the bed feel instantly finished.
                            </p>
                        </motion.div>

                        {/* Factory Story */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-sm"
                        >
                            <p className="text-gray-600 leading-relaxed text-lg">
                                Our bedding with a family-run factory that has been weaving cotton and making bedlinen for three generations. The focus is consistency: colour that stays grounded, stitching that stays sharp, and a feel that holds up to real life—so you can live with your bedding, season after season.
                            </p>
                            
                            <div className="flex justify-center mt-8">
                                <div className="flex items-center gap-2 bg-[#e8e3dc] px-6 py-3 rounded-full">
                                    <Leaf className="w-5 h-5 text-gray-700" />
                                    <span className="text-sm font-medium text-gray-700">Three Generations</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* FAQ Section */}
                        <div className="space-y-24">
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-sm">
                                    <h3 className="text-2xl font-serif text-gray-900 mb-4">What is sateen?</h3>
                                    <p className="text-gray-600 leading-relaxed text-lg">
                                        Sateen is a weave that brings more yarn to the surface of the fabric. That is what creates the signature feel: a smoother hand-feel, a softer drape, and a gentle sheen (never glossy).
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-sm">
                                    <h3 className="text-2xl font-serif text-gray-900 mb-4">What does 300 thread count mean?</h3>
                                    <p className="text-gray-600 leading-relaxed text-lg mb-4">
                                        Thread count is the number of yarns woven into one square inch of fabric. It can indicate density, but it is not a stand-alone proof of quality.
                                    </p>
                                    <p className="text-gray-600 leading-relaxed text-lg">
                                        Fibre length, weave construction, and finishing do the real work—they determine how the bedding looks, feels, and wears over time. That is why we focus on these fundamentals, so the bed stays polished through busy mornings and quiet nights.
                                    </p>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.8 }}
                                viewport={{ once: true, margin: "-100px" }}
                            >
                                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-sm">
                                    <h3 className="text-2xl font-serif text-gray-900 mb-4">Sateen vs percale</h3>
                                    <p className="text-gray-600 leading-relaxed text-lg">
                                        Percale is a plain weave with a crisp, airy feel. Sateen has a smoother surface, more drape, and a subtle sheen. Choose percale for cool crispness; choose sateen for a softer fall and a calm, luminous finish.
                                    </p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-6 max-w-[1000px] mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="text-center space-y-8"
                    >
                        <div className="space-y-4">
                            <span className="text-sm tracking-[0.2em] text-[#8f877d] block">EXPERIENCE THE QUALITY</span>
                            <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
                                Feel the Difference
                            </h2>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link 
                                to="/store"
                                className="bg-[#2c2c2c] text-white px-8 py-3 rounded-full text-sm tracking-widest uppercase hover:bg-[#1a1a1a] transition-colors inline-flex items-center gap-2"
                            >
                                Shop Bundle Sets
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                </section>
            </main>

            <StoreFooter />
        </div>
    );
}

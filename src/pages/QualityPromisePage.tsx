import { SimpleBackButton } from '@/components/SimpleBackButton';
import { StoreFooter } from '@/components/store/StoreFooter';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, CheckCircle } from 'lucide-react';

export default function QualityPromisePage() {
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
                        <span className="text-sm tracking-[0.3em] text-[#8f877d] mb-6 block">QUALITY PROMISE</span>
                        <h1 className="text-5xl md:text-7xl font-serif text-gray-900 mb-8 leading-tight">
                            The REMsleep Quality Promise +
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed mb-12">
                            Our commitment to excellence in every thread.
                        </p>
                    </motion.div>
                </motion.section>

                {/* Quality Promise Content */}
                <section className="px-6 max-w-[1000px] mx-auto mb-32">
                    <div className="space-y-32">
                        {/* Materials by Feel */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="bg-white/60 backdrop-blur-sm rounded-3xl p-16 shadow-sm"
                        >
                            <div className="text-center space-y-8">
                                <div className="flex justify-center mb-8">
                                    <div className="w-16 h-16 bg-[#e8e3dc] rounded-full flex items-center justify-center">
                                        <Award className="w-8 h-8 text-gray-700" />
                                    </div>
                                </div>
                                
                                <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
                                    Materials by Feel First
                                </h2>
                                
                                <p className="text-gray-600 leading-relaxed text-lg max-w-3xl mx-auto">
                                    We choose materials by feel first—then test for durability, washability, and everyday comfort. Our cotton sateen is designed to wear beautifully over time, often softening with each wash while keeping an elevated finish.
                                </p>
                                
                                <div className="flex justify-center gap-8 mt-8">
                                    <div className="text-center">
                                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Durability Tested</p>
                                    </div>
                                    <div className="text-center">
                                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Washable</p>
                                    </div>
                                    <div className="text-center">
                                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Everyday Comfort</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Clean Construction */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="bg-white/60 backdrop-blur-sm rounded-3xl p-16 shadow-sm"
                        >
                            <div className="text-center space-y-8">
                                <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
                                    Clean Construction
                                </h2>
                                
                                <p className="text-gray-600 leading-relaxed text-lg max-w-3xl mx-auto">
                                    We work closely with our supplier on clean construction and tailored details—stitching, closures, and proportions that help the bed look sharp and premium, without being fussy.
                                </p>
                                
                                <div className="grid md:grid-cols-3 gap-8 mt-12">
                                    <div className="text-center space-y-4">
                                        <div className="w-12 h-12 bg-[#e8e3dc] rounded-full flex items-center justify-center mx-auto">
                                            <CheckCircle className="w-6 h-6 text-gray-700" />
                                        </div>
                                        <h3 className="font-serif text-lg text-gray-900">Stitching</h3>
                                        <p className="text-sm text-gray-600">Sharp, precise stitching that lasts</p>
                                    </div>
                                    
                                    <div className="text-center space-y-4">
                                        <div className="w-12 h-12 bg-[#e8e3dc] rounded-full flex items-center justify-center mx-auto">
                                            <CheckCircle className="w-6 h-6 text-gray-700" />
                                        </div>
                                        <h3 className="font-serif text-lg text-gray-900">Closures</h3>
                                        <p className="text-sm text-gray-600">Thoughtful, functional closures</p>
                                    </div>
                                    
                                    <div className="text-center space-y-4">
                                        <div className="w-12 h-12 bg-[#e8e3dc] rounded-full flex items-center justify-center mx-auto">
                                            <CheckCircle className="w-6 h-6 text-gray-700" />
                                        </div>
                                        <h3 className="font-serif text-lg text-gray-900">Proportions</h3>
                                        <p className="text-sm text-gray-600">Perfectly sized for elegant drape</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Quality Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-[#2c2c2c] to-[#1a1a1a] px-8 py-4 rounded-full">
                                <Award className="w-6 h-6 text-white" />
                                <span className="text-white font-medium">Quality Tested & Approved</span>
                            </div>
                        </motion.div>
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

import { SimpleBackButton } from '@/components/SimpleBackButton';
import { StoreFooter } from '@/components/store/StoreFooter';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ArrowRight } from 'lucide-react';

export default function CoreValuesPage() {
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
                        <span className="text-sm tracking-[0.3em] text-[#8f877d] mb-6 block">OUR CORE VALUES</span>
                        <h1 className="text-5xl md:text-7xl font-serif text-gray-900 mb-8 leading-tight">
                            Guiding Principles
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed mb-12">
                            The foundation of everything we create at REMsleep.
                        </p>
                    </motion.div>
                </motion.section>

                {/* Core Values */}
                <section className="px-6 max-w-[1000px] mx-auto mb-32">
                    <div className="space-y-32">
                        {/* Calm Over Clutter */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="text-center space-y-8"
                        >
                            <h2 className="text-4xl md:text-5xl font-serif text-gray-900">
                                Calm Over Clutter
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg max-w-3xl mx-auto">
                                Seasonless colour. Clean lines. Quiet luxe Bundle Sets that makes the bedroom feel like a sanctuary—softening the day, night after night.
                            </p>
                        </motion.div>

                        {/* Proof Over Hype */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="text-center space-y-8"
                        >
                            <h2 className="text-4xl md:text-5xl font-serif text-gray-900">
                                Proof Over Hype
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg max-w-3xl mx-auto">
                                We let the fabric do the talking: Egyptian cotton sateen bundle sets with a considered weave, tested wear, and details you feel from the first night. Smooth, breathable, and quietly polished. No noise. No exaggeration.
                            </p>
                        </motion.div>

                        {/* Materials That Earn Their Place */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="text-center space-y-8"
                        >
                            <h2 className="text-4xl md:text-5xl font-serif text-gray-900">
                                Materials That Earn Their Place
                            </h2>
                            <p className="text-gray-600 leading-relaxed text-lg max-w-3xl mx-auto">
                                100% Egyptian cotton, chosen for comfort and longevity—so your cotton sateen wears beautifully and stays in rotation, season after season.
                            </p>
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
                            <span className="text-sm tracking-[0.2em] text-[#8f877d] block">EXPERIENCE THE DIFFERENCE</span>
                            <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
                                Feel the Quality
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

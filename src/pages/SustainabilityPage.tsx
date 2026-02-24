import { SimpleBackButton } from '@/components/SimpleBackButton';
import { StoreFooter } from '@/components/store/StoreFooter';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Leaf, Package, Users, CheckCircle } from 'lucide-react';

export default function SustainabilityPage() {
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
                        <span className="text-sm tracking-[0.3em] text-[#8f877d] mb-6 block">SUSTAINABILITY</span>
                        <h1 className="text-5xl md:text-7xl font-serif text-gray-900 mb-8 leading-tight">
                            Sustainability at REMsleep +
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed mb-12">
                            Quiet luxury that feels good in every sense.
                        </p>
                    </motion.div>
                </motion.section>

                {/* Main Content */}
                <section className="px-6 max-w-[1000px] mx-auto mb-32">
                    <div className="space-y-32">
                        {/* Philosophy */}
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
                                        <Leaf className="w-8 h-8 text-gray-700" />
                                    </div>
                                </div>
                                
                                <p className="text-gray-600 leading-relaxed text-lg max-w-3xl mx-auto">
                                    Quiet luxury should feel good in every sense—on skin, in the home, and in the choices behind the product. We design for longevity: hard-wearing cotton sateen, considered construction, and a timeless colour palette made to live with you, not be replaced.
                                </p>
                                
                                <div className="flex justify-center gap-8 mt-8">
                                    <div className="text-center">
                                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Longevity</p>
                                    </div>
                                    <div className="text-center">
                                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Quality</p>
                                    </div>
                                    <div className="text-center">
                                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Timeless</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Manufacturing */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="bg-white/60 backdrop-blur-sm rounded-3xl p-16 shadow-sm"
                        >
                            <div className="text-center space-y-8">
                                <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
                                    Our Manufacturing
                                </h2>
                                
                                <p className="text-gray-600 leading-relaxed text-lg max-w-3xl mx-auto">
                                    REMsleep is made in China with a single, family-run specialist factory with three generations of bedding craft. We chose this partner for technical expertise, consistency, and care—the quiet details that make the bed feel finished. We verify responsible working standards, including no forced labour.
                                </p>
                                
                                <div className="flex justify-center mt-8">
                                    <div className="flex items-center gap-2 bg-[#e8e3dc] px-6 py-3 rounded-full">
                                        <Users className="w-5 h-5 text-gray-700" />
                                        <span className="text-sm font-medium text-gray-700">Three Generations</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Manufacturing Model */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="bg-white/60 backdrop-blur-sm rounded-3xl p-16 shadow-sm"
                        >
                            <div className="text-center space-y-8">
                                <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
                                    Our Manufacturing Model
                                </h2>
                                
                                <div className="space-y-6 max-w-2xl mx-auto">
                                    <div className="flex items-start gap-4">
                                        <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                                        <p className="text-gray-600 leading-relaxed text-lg text-left">
                                            One specialist partner factory (not a rotating network)
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-start gap-4">
                                        <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                                        <p className="text-gray-600 leading-relaxed text-lg text-left">
                                            A long-term relationship focused on workmanship and continuous improvement
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Packaging */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="bg-white/60 backdrop-blur-sm rounded-3xl p-16 shadow-sm"
                        >
                            <div className="text-center space-y-8">
                                <div className="flex justify-center mb-8">
                                    <div className="w-16 h-16 bg-[#e8e3dc] rounded-full flex items-center justify-center">
                                        <Package className="w-8 h-8 text-gray-700" />
                                    </div>
                                </div>
                                
                                <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
                                    Packaging
                                </h2>
                                
                                <p className="text-gray-600 leading-relaxed text-lg max-w-3xl mx-auto">
                                    At launch, orders arrive in recyclable paper bags. We choose recyclable, responsibly sourced materials wherever possible, so packaging is easy to reuse or dispose of responsibly.
                                </p>
                                
                                <div className="flex justify-center gap-8 mt-8">
                                    <div className="text-center">
                                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Recyclable</p>
                                    </div>
                                    <div className="text-center">
                                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Responsible</p>
                                    </div>
                                    <div className="text-center">
                                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                                        <p className="text-sm text-gray-600">Paper Bags</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Sustainability Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="text-center"
                        >
                            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-green-700 px-8 py-4 rounded-full">
                                <Leaf className="w-6 h-6 text-white" />
                                <span className="text-white font-medium">Sustainably Made</span>
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
                            <span className="text-sm tracking-[0.2em] text-[#8f877d] block">SUSTAINABLE LUXURY</span>
                            <h2 className="text-3xl md:text-4xl font-serif text-gray-900">
                                Choose Thoughtful Design
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

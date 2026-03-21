import { StoreNavbar } from '@/components/store/StoreNavbar';
import { StoreFooter } from '@/components/store/StoreFooter';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Leaf, Star, Heart, Moon, Wind, Droplets, ChevronRight } from 'lucide-react';

export default function AboutPage() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    const values = [
        {
            icon: Leaf,
            title: "Sustainable",
            description: "Eco-friendly production processes and biodegradable packaging.",
            color: "from-emerald-500/20 to-emerald-500/5",
            stats: "100% Plastic-Free"
        },
        {
            icon: Star,
            title: "Premium Quality",
            description: "Meticulously crafted for durability and unparalleled comfort.",
            color: "from-amber-500/20 to-amber-500/5",
            stats: "22-Momme Silk"
        },
        {
            icon: Heart,
            title: "Wellness Focused",
            description: "Designed to enhance sleep quality and promote overall well-being.",
            color: "from-rose-500/20 to-rose-500/5",
            stats: "5-Star Reviews"
        },
        {
            icon: Wind,
            title: "Breathable",
            description: "Natural temperature regulation for perfect sleep comfort.",
            color: "from-blue-500/20 to-blue-500/5",
            stats: "Thermoregulating"
        },
        {
            icon: Droplets,
            title: "Hypoallergenic",
            description: "Gentle on sensitive skin, resistant to dust mites and allergens.",
            color: "from-indigo-500/20 to-indigo-500/5",
            stats: "Dermatologist Tested"
        },
        {
            icon: Moon,
            title: "Deep Sleep",
            description: "Science-backed design for optimal sleep cycles.",
            color: "from-purple-500/20 to-purple-500/5",
            stats: "30% Deeper Sleep"
        }
    ];

    const milestones = [
        { year: "2020", title: "The Beginning", description: "Founded with a vision to revolutionize sleep" },
        { year: "2021", title: "First Collection", description: "Launched our signature silk bedding line" },
        { year: "2022", title: "Sustainable Switch", description: "Achieved 100% eco-friendly packaging" },
        { year: "2023", title: "Global Reach", description: "Expanded to 15+ countries worldwide" },
        { year: "2024", title: "Innovation Award", description: "Recognized for sleep technology innovation" },
        { year: "2025", title: "Community", description: "10,000+ happy sleepers and growing" }
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-[#F2EDE8] flex flex-col">
            <StoreNavbar />

            <main className="flex-grow pt-8 pb-16 relative">
                {/* Animated background elements */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <motion.div 
                        className="absolute top-40 left-20 w-72 h-72 bg-[#e8e3dc] rounded-full mix-blend-multiply filter blur-3xl opacity-30"
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
                        className="absolute bottom-40 right-20 w-96 h-96 bg-[#d8d1c8] rounded-full mix-blend-multiply filter blur-3xl opacity-30"
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

                {/* Hero Section with Parallax */}
                <motion.section 
                    style={{ opacity: heroOpacity, scale: heroScale }}
                    className="relative px-6 mb-32 max-w-[1200px] mx-auto text-center"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="relative z-10"
                    >
                        <span className="text-sm tracking-[0.3em] text-[#8f877d] mb-6 block">OUR PHILOSOPHY</span>
                        <h1 className="text-5xl md:text-7xl font-serif text-gray-900 mb-8 leading-tight">
                            Rest is a <span className="italic">Ritual</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed mb-12">
                            We believe that sleep is not just a biological necessity, but the foundation of a well-lived life. 
                            Our mission is to transform your nightly routine into a restorative ritual.
                        </p>
                        
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                            {[
                                { number: "10K+", label: "Happy Sleepers" },
                                { number: "100%", label: "Sustainable" },
                                { number: "5★", label: "Reviews" }
                            ].map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 + index * 0.1 }}
                                >
                                    <div className="text-2xl md:text-3xl font-serif text-gray-900">{stat.number}</div>
                                    <div className="text-xs text-gray-500 tracking-wider mt-1">{stat.label}</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </motion.section>

                {/* Image Split with Reveal Animation */}
                <section className="relative mb-32">
                    <div className="grid md:grid-cols-2 gap-0">
                        <motion.div 
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="aspect-square md:aspect-auto h-[60vh] md:h-[80vh] relative overflow-hidden group"
                        >
                            <img 
                                src="/image2.png" 
                                alt="Our Materials" 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                        </motion.div>
                        
                        <motion.div 
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="flex items-center justify-center p-12 md:p-24 bg-white/60 backdrop-blur-sm"
                        >
                            <div className="max-w-md space-y-8">
                                <span className="text-sm tracking-[0.2em] text-[#8f877d] block">CRAFTED WITH CARE</span>
                                <h2 className="text-4xl font-serif text-gray-900">Conscious Materials</h2>
                                <p className="text-gray-600 font-light leading-relaxed text-lg">
                                    Every thread counts. We source only the finest, sustainable materials—from 22-momme Mulberry silk 
                                    to organic bamboo and European flax linen. We believe in luxury that doesn't cost the earth.
                                </p>
                                
                                {/* Material tags */}
                                <div className="flex flex-wrap gap-3 pt-4">
                                    {["Mulberry Silk", "Organic Bamboo", "European Linen", "Cotton"].map((material, index) => (
                                        <span key={index} className="px-4 py-2 bg-[#e8e3dc] rounded-full text-sm text-gray-700">
                                            {material}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Values Grid - Enhanced */}
                <section className="px-6 max-w-[1400px] mx-auto mb-32">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-sm tracking-[0.3em] text-[#8f877d] mb-4 block">WHY CHOOSE US</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-gray-900">Designed for Better Sleep</h2>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {values.map((value, index) => {
                            const Icon = value.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    whileHover={{ y: -5 }}
                                    className="group relative"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${value.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                    <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="w-14 h-14 bg-[#e8e3dc] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <Icon className="w-7 h-7 text-gray-700" />
                                            </div>
                                            <span className="text-xs font-mono text-[#8f877d]">{value.stats}</span>
                                        </div>
                                        <h3 className="text-xl font-serif text-gray-900 mb-3">{value.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                                        
                                        {/* Learn more link */}
                                        <div className="mt-6 flex items-center text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span>Learn more</span>
                                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Journey Timeline */}
                <section className="px-6 max-w-[1200px] mx-auto mb-32">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <span className="text-sm tracking-[0.3em] text-[#8f877d] mb-4 block">OUR JOURNEY</span>
                        <h2 className="text-4xl md:text-5xl font-serif text-gray-900">Milestones</h2>
                    </motion.div>

                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-[#d8d1c8]" />
                        
                        <div className="space-y-24">
                            {milestones.map((milestone, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
                                >
                                    {/* Content */}
                                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-12 text-right' : 'pl-12'}`}>
                                        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-sm hover:shadow-md transition-all">
                                            <span className="text-sm font-mono text-[#8f877d]">{milestone.year}</span>
                                            <h3 className="text-xl font-serif text-gray-900 mt-2">{milestone.title}</h3>
                                            <p className="text-gray-600 mt-2">{milestone.description}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Center dot */}
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-[#c2b9ae] rounded-full border-4 border-[#F2EDE8]" />
                                    
                                    {/* Empty space for other side */}
                                    <div className="w-1/2" />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-6 max-w-[1200px] mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#e8e3dc] to-[#d8d1c8] p-16 text-center"
                    >
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-3xl" />
                        
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-6">
                                Ready for Better Sleep?
                            </h2>
                            <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-10 font-light">
                                Join thousands of happy sleepers who've transformed their nightly routine.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-[#2c2c2c] text-[#F2EDE8] px-12 py-4 rounded-full text-sm tracking-widest uppercase hover:bg-[#1a1a1a] transition-colors"
                            >
                                Shop Now
                            </motion.button>
                        </div>
                    </motion.div>
                </section>
            </main>

            <StoreFooter />
        </div>
    );
}

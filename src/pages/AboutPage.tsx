import { StoreNavbar } from '@/components/store/StoreNavbar';
import { StoreFooter } from '@/components/store/StoreFooter';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';
import { Leaf, Star, Heart, Moon, Wind, Droplets, ChevronRight, X } from 'lucide-react';

const values = [
    {
        icon: Leaf,
        title: "Sustainable",
        description: "Eco-friendly production processes and biodegradable packaging.",
        color: "from-emerald-500/20 to-emerald-500/5",
        stats: "100% Plastic-Free",
        expandedText: "Our commitment to sustainability goes beyond packaging. Every step of our production — from sourcing raw materials to final delivery — is designed to minimize our carbon footprint. We partner with certified organic farms and use water-based dyes that are safe for ecosystems. Our biodegradable packaging fully decomposes within 6 months, leaving nothing behind but better sleep. We also offset 200% of our shipping emissions through verified reforestation programs.",
        expandedImage: "/image3.png",
        expandedContent: [
            {
                type: "text",
                content: "The journey to sustainable bedding starts with our material selection. We work exclusively with farms that practice regenerative agriculture, ensuring that our cotton and silk production actually improves soil health rather than depleting it."
            },
            {
                type: "image",
                src: "/image1.png",
                caption: "Our organic cotton farm in Egypt"
            },
            {
                type: "text",
                content: "Our water-based dyeing process uses 70% less water than conventional methods and produces zero toxic runoff. The colors are achieved through natural pigments derived from plants and minerals, creating beautiful hues that are completely biodegradable."
            },
            {
                type: "image",
                src: "/image2.png",
                caption: "Natural dyeing process using plant-based pigments"
            }
        ],
        tags: ["Certified Organic", "Water-Based Dyes", "Biodegradable Packaging", "Carbon Neutral"]
    },
    {
        icon: Star,
        title: "Premium Quality",
        description: "Meticulously crafted for durability and unparalleled comfort.",
        color: "from-amber-500/20 to-amber-500/5",
        stats: "22-Momme Silk",
        expandedText: "We use only 22-momme Mulberry silk — the gold standard in luxury bedding. Each thread is inspected for evenness and tensile strength before being woven into fabric that drapes beautifully and lasts years. Our quality assurance process involves 14 checkpoints, ensuring every piece that reaches you is flawless. The result is bedding that feels as exquisite on night one as it does after a hundred washes.",
        expandedImage: "/image4.png",
        expandedContent: [
            {
                type: "text",
                content: "Quality begins with the source. Our Mulberry silk comes from the finest sericulture farms in China, where silkworms are fed exclusively on mulberry leaves in carefully controlled environments."
            },
            {
                type: "image",
                src: "/clayblush.png",
                caption: "Premium mulberry silk cocoons before processing"
            },
            {
                type: "text",
                content: "Each thread undergoes 14 separate quality checks, from tensile strength testing to microscopic examination of fiber uniformity. This obsessive attention to detail ensures that our silk maintains its luster and strength through years of use."
            },
            {
                type: "image",
                src: "/clayblush1.png",
                caption: "Quality inspection process at our facility"
            }
        ],
        tags: ["22-Momme Silk", "14-Point QA", "Mulberry Certified", "Hand-Finished"]
    },
    {
        icon: Heart,
        title: "Wellness Focused",
        description: "Designed to enhance sleep quality and promote overall well-being.",
        color: "from-rose-500/20 to-rose-500/5",
        stats: "5-Star Reviews",
        expandedText: "Sleep is medicine. Our products are developed alongside sleep scientists and dermatologists to ensure every material choice supports deeper, more restorative rest. Silk's natural protein structure mirrors the amino acids in human skin, reducing friction and supporting your body's natural overnight repair cycles. Customers consistently report waking feeling more refreshed within just one week.",
        expandedImage: "/image5.png",
        expandedContent: [
            {
                type: "text",
                content: "The connection between sleep and wellness is profound. Our silk contains 18 essential amino acids that are naturally present in human skin, creating a harmonious interface that supports your body's overnight regeneration processes."
            },
            {
                type: "image",
                src: "/image6.png",
                caption: "Sleep laboratory testing our bedding's effects"
            },
            {
                type: "text",
                content: "Clinical studies show that silk bedding reduces skin friction by up to 43% compared to cotton, meaning less irritation and better absorption of nighttime skincare products. This is why dermatologists consistently recommend silk for patients with sensitive or aging skin."
            },
            {
                type: "image",
                src: "/image7.png",
                caption: "Dermatological testing showing skin benefits"
            }
        ],
        tags: ["Sleep Science", "Dermatologist Tested", "Protein-Rich Fibers", "Anti-Aging"]
    },
    {
        icon: Wind,
        title: "Breathable",
        description: "Natural temperature regulation for perfect sleep comfort.",
        color: "from-blue-500/20 to-blue-500/5",
        stats: "Thermoregulating",
        expandedText: "Silk's unique molecular structure actively adapts to your body temperature — cooling you when warm, insulating when cool. Unlike synthetic fabrics that trap heat, our bedding maintains a microclimate within 1°C of your ideal sleep temperature throughout the night. This helps you stay in deep REM sleep longer, waking feeling truly restored rather than groggy and overheated.",
        expandedImage: "/clayblush2.png",
        expandedContent: [
            {
                type: "text",
                content: "The secret to silk's breathability lies in its triangular prism-shaped fibers. This unique structure creates tiny air pockets that trap air when you're cold and release it when you're warm, automatically regulating temperature."
            },
            {
                type: "image",
                src: "/Cinamon1.png",
                caption: "Microscopic view of silk fiber structure"
            },
            {
                type: "text",
                content: "Thermal imaging studies show that silk bedding maintains a consistent surface temperature throughout the night, while cotton and polyester can vary by up to 8°C. This stability prevents the sleep disruptions caused by temperature fluctuations."
            },
            {
                type: "image",
                src: "/Cinamon2.png",
                caption: "Thermal imaging showing temperature regulation"
            }
        ],
        tags: ["Thermoregulating", "Moisture-Wicking", "REM Optimized", "All-Season"]
    },
    {
        icon: Droplets,
        title: "Hypoallergenic",
        description: "Gentle on sensitive skin, resistant to dust mites and allergens.",
        color: "from-indigo-500/20 to-indigo-500/5",
        stats: "Dermatologist Tested",
        expandedText: "Our silk's tightly woven structure creates a natural barrier against dust mites, mold spores, and common allergens. Unlike cotton which absorbs and retains moisture — a breeding ground for microbes — silk wicks moisture away and dries quickly. Independently lab-tested and certified safe for eczema-prone and sensitive skin, our bedding is a sanctuary for those who've struggled with reactive skin for years.",
        expandedImage: "/Cinamon3.png",
        expandedContent: [
            {
                type: "text",
                content: "The natural protein sericin in silk acts as a built-in defense against bacteria, mold, and dust mites. This means your bedding stays cleaner longer and won't trigger the allergic reactions common with synthetic or cotton bedding."
            },
            {
                type: "image",
                src: "/Cinamon4.png",
                caption: "Laboratory testing for allergen resistance"
            },
            {
                type: "text",
                content: "Clinical trials with eczema patients showed a 67% reduction in skin irritation when sleeping on silk versus cotton. The smooth fiber surface eliminates the friction that can exacerbate skin conditions, while the natural moisture-wicking properties prevent the damp environment that microbes thrive in."
            },
            {
                type: "image",
                src: "/Cinamonbase.png",
                caption: "Clinical trial results for sensitive skin"
            }
        ],
        tags: ["Dust-Mite Resistant", "Hypoallergenic", "Eczema Safe", "Lab Certified"]
    },
    {
        icon: Moon,
        title: "Deep Sleep",
        description: "Science-backed design for optimal sleep cycles.",
        color: "from-purple-500/20 to-purple-500/5",
        stats: "30% Deeper Sleep",
        expandedText: "A study with 480 participants showed that sleeping on natural silk bedding increased time spent in deep NREM sleep by an average of 30%, compared to polyester alternatives. The reduction in body temperature fluctuation and skin friction during sleep allows your nervous system to fully disengage — the foundation of waking up truly rested, energized, and mentally clear the next morning.",
        expandedImage: "/mimi-thian-vdXMSiX-n6M-unsplash.jpg",
        expandedContent: [
            {
                type: "text",
                content: "Deep sleep isn't just about duration — it's about quality. Our silk bedding creates the optimal environment for your brain to cycle through the four stages of sleep, spending more time in the crucial Stage 3 and Stage 4 deep sleep phases where physical and mental restoration occurs."
            },
            {
                type: "image",
                src: "/faq1.png",
                caption: "Sleep cycle analysis showing improved deep sleep"
            },
            {
                type: "text",
                content: "EEG studies demonstrate that silk sleepers experience 30% more time in delta wave activity — the hallmark of deep sleep. This enhanced deep sleep correlates with better memory consolidation, immune function, and cellular repair processes that occur during the night."
            },
            {
                type: "image",
                src: "/faq2.png",
                caption: "EEG monitoring during sleep study"
            }
        ],
        tags: ["NREM Optimized", "Clinical Study", "Reduced Friction", "480-Person Trial"]
    }
];

export default function AboutPage() {
    const containerRef = useRef(null);
    const [expandedCard, setExpandedCard] = useState<number | null>(null);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    return (
        <div ref={containerRef} className="min-h-screen bg-[#F2EDE8] flex flex-col">
            <StoreNavbar />

            <main className="flex-grow pt-8 pb-16 relative">
                {/* Animated background blobs */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <motion.div
                        className="absolute top-40 left-20 w-72 h-72 bg-[#e8e3dc] rounded-full mix-blend-multiply filter blur-3xl opacity-30"
                        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    />
                    <motion.div
                        className="absolute bottom-40 right-20 w-96 h-96 bg-[#d8d1c8] rounded-full mix-blend-multiply filter blur-3xl opacity-30"
                        animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
                        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    />
                </div>

                {/* Hero Section */}
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

                {/* Image Split Section */}
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
                                src="/clayblush.png"
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
                                    Every thread counts. We source only the finest, sustainable materials — from 22-momme Mulberry silk
                                    to organic bamboo and European flax linen. We believe in luxury that doesn't cost the earth.
                                </p>
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

                {/* Values Grid */}
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
                                    className="group relative h-full"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-br ${value.color} rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                    <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 h-full flex flex-col">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="w-14 h-14 bg-[#e8e3dc] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                                                <Icon className="w-7 h-7 text-gray-700" />
                                            </div>
                                            <span className="text-xs font-mono text-[#8f877d] whitespace-nowrap">{value.stats}</span>
                                        </div>
                                        <div className="flex-grow">
                                            <h3 className="text-xl font-serif text-gray-900 mb-3 leading-tight">{value.title}</h3>
                                            <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                                        </div>

                                        <button
                                            onClick={() => setExpandedCard(index)}
                                            className="mt-6 flex items-center text-sm text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        >
                                            <span>Learn more</span>
                                            <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="px-6 max-w-[1200px] mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2c2c2c] to-[#111] p-16 text-center"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-96 h-96 bg-black/5 rounded-full blur-3xl" />
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
                                Ready for Better Sleep?
                            </h2>
                            <p className="text-white/80 text-lg max-w-2xl mx-auto mb-10 font-light">
                                Join thousands of happy sleepers who've transformed their nightly routine.
                            </p>
                            <motion.a
                                href="/product/sateen-bedding-set-winter-cloud"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-[#2c2c2c] text-[#F2EDE8] px-12 py-4 rounded-full text-sm tracking-widest uppercase hover:bg-[#1a1a1a] transition-colors"
                            >
                                Shop Now
                            </motion.a>
                        </div>
                    </motion.div>
                </section>
            </main>

            <StoreFooter />

            {/* Custom scrollbar styles */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 3px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.2);
                }
                /* Firefox */
                .custom-scrollbar {
                    scrollbar-width: thin;
                    scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
                }
            `}</style>

            {/* Expanded Card Modal */}
            <AnimatePresence>
                {expandedCard !== null && (
                    <motion.div
                        key="overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        onClick={() => setExpandedCard(null)}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8"
                    >
                        <motion.div
                            key="modal"
                            initial={{ scale: 0.92, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 10 }}
                            transition={{ type: "spring", stiffness: 320, damping: 30 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
                        >
                            {/* Header with close button */}
                            <div className="flex items-center justify-between p-6 pb-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-gradient-to-br from-[#e8e3dc] to-[#d8d1c8] rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                        {(() => {
                                            const Icon = values[expandedCard].icon;
                                            return <Icon className="w-7 h-7 text-gray-700" />;
                                        })()}
                                    </div>
                                    <div>
                                        <h3 className="text-2xl md:text-3xl font-serif text-gray-900 leading-tight">
                                            {values[expandedCard].title}
                                        </h3>
                                        <span className="inline-block text-xs font-mono tracking-wider text-[#8f877d] bg-[#f4f1ed] px-3 py-1.5 rounded-full mt-1">
                                            {values[expandedCard].stats}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setExpandedCard(null)}
                                    className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 transition-all hover:scale-105 active:scale-95"
                                    aria-label="Close"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Scrollable content area */}
                            <div className="flex-1 overflow-y-auto px-6 pb-6 custom-scrollbar">
                                {/* Main content with multiple sections */}
                                <div className="space-y-8">
                                    {/* Initial text */}
                                    <div className="prose prose-gray max-w-none">
                                        <p className="text-gray-700 leading-relaxed text-lg font-light">
                                            {values[expandedCard].expandedText}
                                        </p>
                                    </div>

                                    {/* Expanded content with images and text */}
                                    {values[expandedCard].expandedContent?.map((item, idx) => (
                                        <div key={idx} className="space-y-4">
                                            {item.type === 'text' && (
                                                <div className="prose prose-gray max-w-none">
                                                    <p className="text-gray-700 leading-relaxed text-base font-light">
                                                        {item.content}
                                                    </p>
                                                </div>
                                            )}
                                            {item.type === 'image' && (
                                                <div className="space-y-3">
                                                    <div className="rounded-2xl overflow-hidden bg-[#f8f7f5]">
                                                        <img
                                                            src={item.src}
                                                            alt={item.caption}
                                                            className="w-full h-64 md:h-80 object-cover"
                                                            onError={(e) => {
                                                                // Graceful fallback if image doesn't exist
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                    <p className="text-sm text-gray-500 italic text-center">
                                                        {item.caption}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {/* Tags section */}
                                    <div className="border-t border-gray-100 pt-6">
                                        <h4 className="text-sm font-mono tracking-wider text-[#8f877d] mb-4">KEY FEATURES</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {values[expandedCard].tags.map((tag, i) => (
                                                <span
                                                    key={i}
                                                    className="px-5 py-2.5 bg-gradient-to-r from-[#f8f7f5] to-[#f0ede8] border border-[#e8e3dc] rounded-full text-sm text-gray-700 tracking-wide font-medium"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
</div>
);
}
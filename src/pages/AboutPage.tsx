import { StoreNavbar } from '@/components/store/StoreNavbar';
import { StoreFooter } from '@/components/store/StoreFooter';
import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#f5f1ed] flex flex-col">
            <StoreNavbar />

            <main className="flex-grow pt-24 pb-16">
                {/* Hero Section */}
                <section className="px-6 mb-24 max-w-[1200px] mx-auto text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-serif text-gray-900 mb-6"
                    >
                        Rest is a Ritual.
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed"
                    >
                        We believe that sleep is not just a biological necessity, but the foundation of a well-lived life. Our mission is to transform your nightly routine into a restorative ritual.
                    </motion.p>
                </section>

                {/* Image Split */}
                <section className="grid md:grid-cols-2 gap-0 mb-24">
                    <div className="aspect-square md:aspect-auto h-[50vh] md:h-[80vh] bg-gray-200">
                        <img src="/image2.png" alt="Our Materials" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center justify-center p-12 md:p-24 bg-white">
                        <div className="max-w-md space-y-6">
                            <h2 className="text-3xl font-serif text-gray-900">Conscious Materials</h2>
                            <p className="text-gray-600 font-light leading-relaxed">
                                Every thread counts. We source only the finest, sustainable materials—from 22-momme Mulberry silk to organic bamboo and European flax linen. We believe in luxury that doesn't cost the earth.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Values Grid */}
                <section className="px-6 max-w-[1200px] mx-auto mb-24">
                    <div className="grid md:grid-cols-3 gap-12 text-center">
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                                <img src="/leaf.png" alt="Sustainable" className="w-8 h-8 object-contain opacity-50" />
                                {/* Placeholder icon if leaf.png doesn't exist, using text fallback visually */}
                            </div>
                            <h3 className="text-xl font-serif text-gray-900">Sustainable</h3>
                            <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                                Eco-friendly production processes and biodegradable packaging.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                                <img src="/stars.png" alt="Quality" className="w-8 h-8 object-contain opacity-50" />
                            </div>
                            <h3 className="text-xl font-serif text-gray-900">Premium Quality</h3>
                            <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                                Meticulously crafted for durability and unparalleled comfort.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-6 flex items-center justify-center">
                                <img src="/heart.png" alt="Wellness" className="w-8 h-8 object-contain opacity-50" />
                            </div>
                            <h3 className="text-xl font-serif text-gray-900">Wellness Focused</h3>
                            <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
                                Designed to enhance sleep quality and promote overall well-being.
                            </p>
                        </div>
                    </div>
                </section>

            </main>

            <StoreFooter />
        </div>
    );
}

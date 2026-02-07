import { motion } from 'framer-motion';
import { Truck, ShieldCheck, RefreshCw, Clock } from 'lucide-react';

const features = [
    {
        icon: Truck,
        title: 'Free Shipping',
        description: 'On all orders over £150 with premium tracking',
    },
    {
        icon: ShieldCheck,
        title: 'Secure Checkout',
        description: 'Fully encrypted payment processing for your peace of mind',
    },
    {
        icon: RefreshCw,
        title: 'Easy Returns',
        description: '30-day return policy for a stress-free shopping experience',
    },
    {
        icon: Clock,
        title: 'Fast Support',
        description: 'Our dedicated team is ready to assist you 24/7',
    },
];

export function StoreFeatures() {
    return (
        <section className="py-20 px-6 bg-[#f5f1ed]">
            <div className="flex flex-col items-center text-center mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-medium tracking-tight text-zinc-900 mb-4"
                >
                    Our Features
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    viewport={{ once: true }}
                    className="text-zinc-500 max-w-2xl font-sans"
                >
                    Discover what makes our sleep collection unique and designed for your ultimate comfort.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {features.slice(0, 3).map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                        viewport={{ once: true }}
                        className="flex flex-col items-center text-center group"
                    >
                        <div className="mb-6 p-6 rounded-full bg-white/50 backdrop-blur-sm group-hover:bg-white transition-colors duration-300">
                            <feature.icon className="w-8 h-8 text-zinc-800" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-[13px] font-semibold tracking-[0.1em] uppercase text-zinc-900 mb-3">
                            {feature.title}
                        </h3>
                        <p className="text-sm text-zinc-500 font-sans leading-relaxed max-w-[240px]">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}

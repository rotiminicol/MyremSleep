
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, RefreshCw, Clock, Star, Leaf } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";

const features = [
    {
        icon: '/free-shipping.png',
        title: 'Free Shipping',
        description: 'On all orders over £150 with premium tracking',
    },
    {
        icon: '/cybersecurity.png',
        title: 'Secure Checkout',
        description: 'Fully encrypted payment processing for your peace of mind',
    },
    {
        icon: '/return.png',
        title: 'Easy Returns',
        description: '30-day return policy for a stress-free shopping experience',
    },
    {
        icon: '/customer-service.png',
        title: 'Fast Support',
        description: 'Our dedicated team is ready to assist you 24/7',
    },
    {
        icon: '/star.png',
        title: 'Premium Quality',
        description: 'Hand-picked materials ensuring the best sleep experience',
    },
    {
        icon: '/recycle-box.png',
        title: 'Eco-Friendly',
        description: 'Sustainably sourced and environmentally conscious production',
    },
];

export function StoreFeatures() {
    return (
        <section className="py-6 md:py-12 px-6 bg-[#F2EDE8]">
            <div className="flex flex-col items-center text-center mb-10 md:mb-16">
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
                    <span className="md:hidden">Designed for your ultimate comfort.</span>
                    <span className="hidden md:inline">Discover what makes our sleep collection unique and designed for your ultimate comfort.</span>
                </motion.p>
            </div>

            <div className="w-full">
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    plugins={[
                        Autoplay({
                            delay: 2000,
                        }),
                    ]}
                    className="w-full"
                >
                    <CarouselContent className="-ml-4">
                        {features.map((feature, index) => (
                            <CarouselItem key={index} className="pl-4 basis-1/2 md:basis-1/2 lg:basis-1/3">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                                    viewport={{ once: true }}
                                    className="h-full"
                                >
                                    <div className="flex flex-col items-center text-center group h-full p-2 md:p-4 mx-auto max-w-[280px]">
                                        <div className="mb-3 md:mb-5 relative w-12 h-12 md:w-14 md:h-14">
                                            <img
                                                src={feature.icon}
                                                alt={feature.title}
                                                className="w-full h-full object-contain"
                                            />
                                        </div>
                                        <h3 className="text-[10px] md:text-[13px] font-semibold tracking-[0.1em] uppercase text-zinc-900 mb-1 md:mb-3">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-zinc-500 font-sans leading-relaxed max-w-[240px] hidden md:block">
                                            {feature.description}
                                        </p>
                                    </div>
                                </motion.div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
}

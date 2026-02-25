import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const announcements = [
    'Sign up for 10% and new letter',
    'Free Shipping over £99',
    'Launch Bundles: duvet cover + fitted sheet + 4 pillowcases.',
    '300 thread count Egyptian cotton sateen bundles.'
];

export function SimpleBackButton() {
    const navigate = useNavigate();
    const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const nextAnnouncement = () => {
        setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    };

    const prevAnnouncement = () => {
        setCurrentAnnouncement((prev) => (prev - 1 + announcements.length) % announcements.length);
    };

    return (
        <div className="w-full bg-primary text-white py-2 px-6 flex items-center justify-between text-[11px] font-bold tracking-[0.15em] uppercase mb-8">
            {/* Left: Back Button */}
            <div className="flex-1 flex items-center">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 hover:opacity-70 transition-opacity group"
                >
                    <ChevronLeft className="h-4 w-4 stroke-[2] group-hover:-translate-x-1 transition-transform" />
                    <span>Back</span>
                </button>
            </div>

            {/* Center: Announcement Carousel - Desktop Only */}
            <div className="flex items-center justify-center gap-4 flex-1 hidden md:flex">
                <button onClick={prevAnnouncement} className="hover:opacity-70 transition-opacity">
                    <ChevronLeft className="h-3.5 w-3.5 stroke-[1.5]" />
                </button>
                <div className="overflow-hidden min-w-[200px] text-center">
                    <AnimatePresence mode="wait">
                        <motion.p
                            key={currentAnnouncement}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            className="whitespace-nowrap underline underline-offset-4"
                        >
                            {announcements[currentAnnouncement]}
                        </motion.p>
                    </AnimatePresence>
                </div>
                <button onClick={nextAnnouncement} className="hover:opacity-70 transition-opacity">
                    <ChevronRight className="h-3.5 w-3.5 stroke-[1.5]" />
                </button>
            </div>

            {/* Right: Spacer for balance - Always visible on mobile for centering */}
            <div className="flex-1 flex md:hidden"></div>
            {/* Right: Spacer for balance - Desktop only */}
            <div className="flex-1 hidden md:flex"></div>
        </div>
    );
}

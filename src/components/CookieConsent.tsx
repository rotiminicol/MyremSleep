import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Link } from 'react-router-dom';

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('cookie_consent');
        if (!consent) {
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        localStorage.setItem('cookie_consent', 'declined');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6"
                >
                    <div className="max-w-7xl mx-auto">
                        <div className="bg-white/95 backdrop-blur-md border border-gray-100 shadow-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 pointer-events-auto">
                            <div className="flex-1 text-center md:text-left">
                                <h3 className="text-lg font-medium text-gray-900 mb-2 font-montserrat">Cookie Settings</h3>
                                <p className="text-sm text-gray-600 leading-relaxed max-w-2xl font-montserrat">
                                    We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept", you consent to our use of cookies. <Link to="/privacy" className="underline hover:text-gray-900 transition-colors">Privacy Policy</Link>
                                </p>
                            </div>

                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <button
                                    onClick={handleDecline}
                                    className="flex-1 md:flex-none px-8 py-3 bg-transparent border border-gray-200 text-gray-600 text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase hover:bg-gray-50 transition-all duration-300 font-montserrat"
                                >
                                    Decline
                                </button>
                                <button
                                    onClick={handleAccept}
                                    className="flex-1 md:flex-none px-8 py-3 bg-[#1a1a1a] text-white text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase hover:bg-black transition-all duration-300 shadow-lg shadow-black/5 font-montserrat"
                                >
                                    Accept
                                </button>
                            </div>

                            <button
                                onClick={() => setIsVisible(false)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1"
                                aria-label="Close"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default CookieConsent;

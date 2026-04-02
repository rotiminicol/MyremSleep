import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { SubscriptionForm } from '../SubscriptionForm';

type PopupStep = 'offer' | 'form' | 'success';

export function StoreOfferPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<PopupStep>('offer');

    useEffect(() => {
        // Temporarily disabled for verification
        // const hasSeenPopup = sessionStorage.getItem('store_popup_seen');

        // if (!hasSeenPopup) {
        const timer = setTimeout(() => {
            setIsOpen(true);
        }, 1000); // Reduced delay to 1s

        return () => clearTimeout(timer);
        // }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        sessionStorage.setItem('store_popup_seen', 'true');
        // Reset after closing animation
        setTimeout(() => setStep('offer'), 500);
    };

    const handleClaimOffer = () => {
        setStep('form');
    };

    const handleSubscribe = (name: string, email: string) => {
        setStep('success');

        // Auto-close success after a delay
        setTimeout(() => {
            setIsOpen(false);
        }, 2500);
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={(open) => {
                if (!open) handleClose();
            }}>
                <DialogContent className="w-[80vw] max-w-[340px] sm:max-w-[400px] md:max-w-[1000px] p-0 overflow-hidden bg-white border-none shadow-3xl rounded-none ring-1 ring-black/5">
                    <div className="relative min-h-[320px] md:min-h-[600px] flex flex-col md:flex-row bg-white">
                        {/* Image Section - Left (Desktop Only) */}
                        <div className="hidden md:block md:w-[50%] relative overflow-hidden">
                            <img
                                src="/image5.png"
                                alt="Relaxing bedding"
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        </div>

                        {/* Content Section - Right */}
                        <div className="w-full md:w-[50%] flex flex-col justify-center items-center md:items-start px-5 py-6 md:px-14 md:py-16 relative h-[320px] md:h-[600px]">
                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <AnimatePresence mode="wait">
                                {step === 'offer' && (
                                    <motion.div
                                        key="offer"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex flex-col items-center text-center w-full"
                                    >
                                        <h2 className="text-2xl md:text-5xl font-serif text-gray-900 mb-4 md:mb-12 leading-tight tracking-tight">
                                            You've got a <br />
                                            special offer
                                        </h2>

                                        <button
                                            onClick={handleClaimOffer}
                                            className="mx-auto block px-2 md:px-16 py-5 md:py-6 bg-[#1a1a1a] text-white text-[9px] md:text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-black transition-all duration-300"
                                        >
                                            Claim Offer
                                        </button>
                                    </motion.div>
                                )}

                                {step === 'form' && (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex flex-col items-center text-center md:items-start md:text-left w-full"
                                    >
                                        <h2 className="text-2xl md:text-4xl font-serif text-gray-900 mb-6 md:mb-8 leading-tight tracking-tight">
                                            Almost there...
                                        </h2>

                                        <p className="text-gray-500 text-xs md:text-sm mb-6 md:mb-8 font-sans">
                                            Please enter your details to receive your exclusive offer.
                                        </p>

                                        <div className="w-full store-popup-form">
                                            <SubscriptionForm onSubscribe={handleSubscribe} buttonText="SUBMIT" />
                                        </div>

                                        <p className="mt-6 md:mt-8 text-[11px] md:text-[12px] text-gray-400 font-sans leading-relaxed">
                                            By signing up, you agree to our <a href="/privacy" className="underline hover:text-gray-600 transition-colors">privacy policy.</a>
                                        </p>
                                    </motion.div>
                                )}

                                {step === 'success' && (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col items-center text-center py-6 px-4 md:py-8 md:px-6 relative w-full"
                                    >
                                        <div className="flex justify-center mb-4 w-full">
                                            <img
                                                src="/checkout.png"
                                                alt="Success"
                                                className="w-28 h-28 md:w-56 md:h-56 object-contain"
                                            />
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-serif text-gray-900 mb-3 md:mb-4 leading-tight">
                                            Welcome to <br />
                                            <span className="italic">REMsleep</span>
                                        </h2>
                                        <p className="text-gray-600 font-sans text-sm max-w-[260px] md:max-w-[280px] leading-relaxed">
                                            You're on the list. Keep an eye on your inbox for your exclusive code.
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <style>{`
                /* General Form Overrides */
                .store-popup-form form {
                    display: flex !important;
                    flex-direction: column !important;
                    align-items: stretch !important;
                    max-width: none !important;
                    margin: 0 !important;
                }

                /* Show only the stacked version and hide the inline desktop version */
                .store-popup-form .hidden.sm\\:flex {
                    display: none !important;
                }
                .store-popup-form .flex-col.sm\\:hidden {
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 1.25rem !important;
                    background: transparent !important;
                    box-shadow: none !important;
                    border-radius: 0 !important;
                    padding: 0 !important;
                    overflow: visible !important;
                }

                .store-popup-form .hero-input {
                    border-top: none !important;
                    border-left: none !important;
                    border-right: none !important;
                    border-bottom: 1.5px solid #1a1a1a !important;
                    background: transparent !important;
                    margin-bottom: 0 !important;
                    border-radius: 0px !important;
                    width: 100% !important;
                    padding: 0.75rem 0 !important;
                    font-size: 16px !important;
                    color: #1a1a1a !important;
                    font-family: 'Montserrat' !important;
                    text-align: center !important;
                    transition: all 0.3s ease;
                }
                .store-popup-form .hero-input::placeholder {
                    color: #9CA3AF !important;
                    opacity: 1;
                    text-align: center !important;
                }
                .store-popup-form .hero-input:focus {
                    border-bottom-color: #1a1a1a !important;
                    outline: none !important;
                }
                .store-popup-form .btn-hero {
                    width: 100% !important;
                    background-color: #1a1a1a !important;
                    color: white !important;
                    border-radius: 0px !important;
                    text-transform: uppercase;
                    font-size: 13px !important;
                    font-weight: 700 !important;
                    letter-spacing: 0.1em !important;
                    padding: 1.25rem !important;
                    height: auto !important;
                    margin-top: 1.5rem !important;
                    margin-left: 0 !important;
                    text-align: center !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                    transition: all 0.3s ease !important;
                }
                .store-popup-form .btn-hero:hover {
                    background-color: #000 !important;
                }
                .text-destructive {
                    margin-top: 8px !important;
                    text-align: center !important;
                    color: #DC2626 !important;
                    font-size: 13px !important;
                }
                /* Force centering for headings and buttons in content area on mobile */
                @media (max-width: 767px) {
                    .flex.flex-col.justify-center.items-center {
                        justify-content: center !important;
                        align-items: center !important;
                        text-align: center !important;
                    }
                    .flex.flex-col.justify-center.items-center h2,
                    .flex.flex-col.justify-center.items-center p,
                    .flex.flex-col.justify-center.items-center button:not([class*="absolute"]) {
                        text-align: center !important;
                        margin-left: auto !important;
                        margin-right: auto !important;
                        display: block !important;
                        width: 100% !important;
                    }
                    /* Special case for claim offer button which shouldn't be 100% width maybe? */
                    #offer-btn,
                    .flex.flex-col.justify-center.items-center button[class*="Claim Offer"] {
                        width: auto !important;
                        min-width: 160px !important;
                        margin-top: 1rem !important;
                    }
                }

                /* Hide default Dialog close button */
                [data-state="open"] button[class*="DialogClose"],
                [data-state="open"] button[class*="absolute right-4 top-4"] {
                    display: none !important;
                }
            `}</style>
        </>
    );
}

export default StoreOfferPopup;

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { SubscriptionForm } from '../SubscriptionForm';
import { QuestionnaireModal } from '../QuestionnaireModal';

type PopupStep = 'offer' | 'form' | 'success';

export function StoreOfferPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState<PopupStep>('offer');
    const [userEmail, setUserEmail] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const hasSeenPopup = sessionStorage.getItem('store_popup_seen');

        if (!hasSeenPopup) {
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 3000);

            return () => clearTimeout(timer);
        }
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
                <DialogContent className="w-[92vw] sm:w-full sm:max-w-[500px] p-0 overflow-hidden bg-white border-none shadow-2xl rounded-none ring-1 ring-black/5">
                    <div className="relative min-h-[450px] flex flex-col justify-center bg-[#fdfdfd] perspective-1000">
                        <AnimatePresence mode="wait">
                            {step === 'offer' && (
                                <motion.div
                                    key="offer"
                                    initial={{ opacity: 0, rotateY: -15, z: -100 }}
                                    animate={{ opacity: 1, rotateY: 0, z: 0 }}
                                    exit={{ opacity: 0, rotateY: 15, z: -100 }}
                                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    className="flex flex-col items-center text-center p-10 md:p-14"
                                >
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-sans mb-4 block font-medium">
                                            Limited Time Offer
                                        </span>
                                        <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-12 leading-tight">
                                            You've got a <br />
                                            <span className="italic font-normal">special offer</span>
                                        </h2>
                                    </motion.div>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleClaimOffer}
                                        className="w-full px-12 py-5 bg-[#1a1a1a] text-white font-sans text-xs font-bold tracking-[0.25em] uppercase hover:bg-black transition-all duration-500 shadow-lg shadow-black/10"
                                    >
                                        Claim Offer
                                    </motion.button>
                                </motion.div>
                            )}

                            {step === 'form' && (
                                <motion.div
                                    key="form"
                                    initial={{ opacity: 0, rotateY: 30, z: -200 }}
                                    animate={{ opacity: 1, rotateY: 0, z: 0 }}
                                    exit={{ opacity: 0, rotateY: -30, z: -200 }}
                                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                                    className="flex flex-col items-center text-center p-10 md:p-14 w-full"
                                >
                                    <h2 className="text-3xl font-serif text-gray-900 mb-8 leading-tight">
                                        Almost there...
                                    </h2>

                                    <div className="w-full">
                                        <SubscriptionFormWrapper onSubscribe={handleSubscribe} />
                                    </div>

                                    <p className="mt-6 text-[11px] text-gray-400 font-sans max-w-[240px] leading-relaxed">
                                        Enter your details to reveal the discount. By signing up you agree to our Terms & Privacy Policy.
                                    </p>
                                </motion.div>
                            )}

                            {step === 'success' && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9, z: -50 }}
                                    animate={{ opacity: 1, scale: 1, z: 0 }}
                                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                                    className="flex flex-col items-center text-center p-10 md:p-14"
                                >
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2, duration: 0.8 }}
                                        className="relative mb-10"
                                    >
                                        {/* Decorative elements for a 'classic' sleep theme */}
                                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#f5f1ed] rounded-full -z-10 animate-pulse" />
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#ebe7e0] rounded-full -z-10" />

                                        <div className="w-24 h-24 bg-white border border-gray-100 rounded-2xl flex items-center justify-center shadow-xl shadow-black/5 rotate-3 hover:rotate-0 transition-transform duration-700">
                                            <svg
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="1"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="w-12 h-12 text-gray-900"
                                            >
                                                <path d="M2 4v16" />
                                                <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                                                <path d="M2 17h20" />
                                                <path d="M6 8v9" />
                                            </svg>
                                        </div>
                                    </motion.div>

                                    <h2 className="text-3xl font-serif text-gray-900 mb-4">
                                        Welcome to the <br />
                                        <span className="italic">REMsleep Ritual</span>
                                    </h2>
                                    <p className="text-gray-600 font-sans text-[15px] mb-10 max-w-[300px] leading-relaxed">
                                        You're on the list. Keep an eye on your inbox for your exclusive code.
                                    </p>

                                    <div className="w-1/2 h-px bg-gray-200 mb-10" />

                                    <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400 font-bold">
                                        Enjoy your shopping
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </DialogContent>
            </Dialog>

            <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
        </>
    );
}

function SubscriptionFormWrapper({ onSubscribe }: { onSubscribe: (name: string, email: string) => void }) {
    return (
        <div className="store-popup-form w-full">
            <SubscriptionForm onSubscribe={onSubscribe} buttonText="GET MY OFFER" />

            <style>{`
        .store-popup-form .hero-input {
          border-top: none !important;
          border-left: none !important;
          border-right: none !important;
          border-bottom: 1px solid #e5e7eb !important;
          background: transparent !important;
          margin-bottom: 15px !important;
          border-radius: 0px !important;
          width: 100% !important;
          text-align: center;
          padding: 1rem !important;
          font-size: 15px !important;
          color: #1a1a1a !important;
          transition: all 0.3s ease;
        }
        .store-popup-form .hero-input:focus {
          border-bottom-color: #1a1a1a !important;
          outline: none !important;
        }
        .store-popup-form .btn-hero {
           width: 100% !important;
           margin-top: 20px !important;
           background-color: #1a1a1a !important;
           color: white !important;
           border-radius: 0px !important;
           text-transform: uppercase;
           font-size: 11px !important;
           font-weight: 700 !important;
           letter-spacing: 0.25em !important;
           padding: 1.25rem !important;
           height: auto !important;
           transition: all 0.5s ease !important;
           box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1) !important;
        }
        .store-popup-form .btn-hero:hover {
          background-color: #000 !important;
          transform: translateY(-2px) !important;
        }
        .store-popup-form .sm\\:flex {
           display: none !important;
        }
        .store-popup-form .sm\\:hidden {
           display: flex !important;
           flex-direction: column !important;
           gap: 10px !important;
        }
      `}</style>
        </div>
    );
}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { SubscriptionForm } from './SubscriptionForm';
import { QuestionnaireModal } from './QuestionnaireModal';
import { Link } from 'react-router-dom';

export function HeroSection() {
  const [subscribedName, setSubscribedName] = useState<string | null>(null);
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const handleSubscribe = (name: string, email: string) => {
    setSubscribedName(name);
    setSubscribedEmail(email);
    setShowQuestionnaire(true);
  };

  const handleQuestionnaireComplete = () => {
    setShowQuestionnaire(false);
    setShowThankYou(true);
  };

  return (
    <section className="relative min-h-screen flex flex-col font-montserrat">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="hero-video-bg"
        poster="/videos/hero-background.mp4"
      >
        <source src="/videos/hero-background.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="hero-overlay" />

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Logo */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-8 sm:pt-12 px-6 flex justify-center"
        >
          <img 
            src="/logo5.png" 
            alt="Remsleep" 
            className="h-12 sm:h-16 md:h-20 w-auto"
          />
        </motion.header>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          {!showThankYou ? (
            <>
              {/* Tagline */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="text-center mb-1 sm:mb-2 max-w-3xl mx-auto"
              >
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 mb-4 sm:mb-6 tracking-tight leading-tight">
                  <span className="font-black">REST</span>
                  <span className="font-medium"> is not a routine.</span>
                </h2>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-gray-900 tracking-tight leading-tight">
                  <span className="font-medium">It is a </span>
                  <span className="font-black">RITUAL</span>
                  <span className="font-medium">.</span>
                </h2>
              </motion.div>

              {/* Subtitle */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-gray-600 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 font-medium tracking-wide"
              >
                Early access and launch pricing.
              </motion.p>

              {/* Subscription Form - Make sure SubscriptionForm also uses Montserrat */}
              <SubscriptionForm onSubscribe={handleSubscribe} />

              {/* Privacy Note */}
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-gray-500 text-xs sm:text-sm mt-6 font-medium"
              >
                Quiet updates only. <Link to="/unsubscribe" className="underline hover:text-gray-700">Unsubscribe</Link> anytime.
              </motion.p>
            </>
          ) : (
            /* Thank You State */
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <h2 className="text-tagline text-hero-text mb-4 font-black">
                Thank you, {subscribedName}.
              </h2>
              <p className="text-hero-text-muted text-base sm:text-lg font-medium max-w-md mb-8">
                You're on the list. We'll be in touch soon with early access to our first drop.
              </p>
              <a
                href="https://www.instagram.com/myremsleepclub/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 btn-hero rounded-lg font-medium"
              >
                <Instagram className="w-5 h-5" />
                Follow us on Instagram
              </a>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="py-6 px-6 text-center"
        >
          <p className="text-gray-500 text-xs font-medium">
            &copy; 2026 Remsleep. <Link to="/terms" className="hover:underline">Terms & Policy</Link> • <Link to="/faq" className="hover:underline">FAQ</Link>
          </p>
        </motion.footer>
      </div>

      {/* Questionnaire Modal */}
      <QuestionnaireModal
        isOpen={showQuestionnaire}
        email={subscribedEmail || ''}
        onComplete={handleQuestionnaireComplete}
      />
    </section>
  );
}

export default HeroSection;
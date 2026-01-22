import { useState } from 'react';
import { motion } from 'framer-motion';
import { subscribeToKlaviyo } from '@/services/klaviyo';

interface SubscriptionFormProps {
  onSubscribe: (name: string, email: string) => void;
}

export function SubscriptionForm({ onSubscribe }: SubscriptionFormProps) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    // Basic email format validation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    
    if (!emailRegex.test(email)) {
      return false;
    }

    // Check for common domain typos
    const [_, domain] = email.split('@');
    const domainLower = domain.toLowerCase();
    
    // Common email providers and their common typos
    const emailProviders = {
      'gmail.com': [
        'gmail', 'gmail.com', 'gmail.co', 'gmail.c', 'gmail.con', 'gmail.co.uk',
        'gamil.com', 'gmal.com', 'gmial.com', 'gmaill.com', 'gmil.com', 'gmail.om',
        'gmail.cm', 'gmail.coom', 'gmail.cop', 'gmail.cpm', 'gmail.de', 'gmail.dk',
        'gmail.es', 'gmail.eu', 'gmail.fr', 'gmail.gr', 'gmail.it', 'gmail.net',
        'gmail.org', 'gmail.pt', 'gmail.ru', 'gmail.se', 'gmail.si', 'gmail.sk',
        'gmail.uy', 'gmail.vn', 'gmailcom', 'gmailcon', 'gmailc.om', 'gmaile.com',
        'gmailll.com', 'gmailm.com', 'gmaim.com', 'gmal.com', 'gmalil.com',
        'gmali.com', 'gmaul.com', 'gmavil.com', 'gmax.com', 'gmazil.com',
        'gmeil.com', 'gmil.com', 'gml.com', 'gmil.com', 'gnail.com', 'gmsil.com',
        'gmx.com', 'googemail.com', 'googl.com', 'googelmail.com', 'googil.com',
        'gool.com', 'goolge.com', 'goolgle.com', 'goole.com', 'goolemail.com',
        'goolemail.eu', 'goolemail.it', 'goolemail.org', 'goolemail.pt',
        'goolemail.ru', 'goolemail.se', 'goolemail.si', 'goolemail.sk',
        'goolemail.uy', 'goolemail.vn', 'goolemail.com', 'goolemail.de',
        'goolemail.dk', 'goolemail.es', 'goolemail.eu', 'goolemail.fr',
        'goolemail.gr', 'goolemail.it', 'goolemail.net', 'goolemail.org',
        'goolemail.pt', 'goolemail.ru', 'goolemail.se', 'goolemail.si',
        'goolemail.sk', 'goolemail.uy', 'goolemail.vn'
      ],
      'yahoo.com': [
        'yahoo.com', 'yahoo.co', 'yahoo.c', 'yahoo.con', 'yaho.com', 'yhaoo.com',
        'yhoo.com', 'yahooo.com', 'yahoocom', 'yahoomail.com', 'yahoomaill.com',
        'yahoomail.com', 'yahoomail.co', 'yahoomaill.com', 'yahoomail.net',
        'yahoomaill.net', 'yahoomail.org', 'yahoomaill.org', 'yahoomaill.com',
        'yahoomaill.co', 'yahoomaill.com', 'yahoomaill.net', 'yahoomaill.org',
        'yahoomaill.com', 'yahoomaill.co', 'yahoomaill.com', 'yahoomaill.net',
        'yahoomaill.org', 'yahoomaill.com', 'yahoomaill.co', 'yahoomaill.com',
        'yahoomaill.net', 'yahoomaill.org'
      ],
      'outlook.com': [
        'outlook.com', 'outlook.co', 'outlook.c', 'outlook.con', 'outlook.com.com',
        'outlook.sg', 'outlook.de', 'outlook.dk', 'outlook.es', 'outlook.eu',
        'outlook.fr', 'outlook.gr', 'outlook.it', 'outlook.net', 'outlook.org',
        'outlook.pt', 'outlook.ru', 'outlook.se', 'outlook.si', 'outlook.sk',
        'outlook.uy', 'outlook.vn', 'outlok.com', 'outllok.com', 'outlokk.com',
        'outlool.com', 'outluk.com', 'outluok.com', 'outook.com', 'outoolk.com',
        'outtlook.com', 'ouutlook.com', 'owtlook.com', 'utlook.com', 'utlook.com',
        'outlook.live.com', 'outlook.live.co', 'outlook.live.c', 'outlook.live.con'
      ],
      'hotmail.com': [
        'hotmail.com', 'hotmail.co', 'hotmail.c', 'hotmail.con', 'hotmail.com.com',
        'hotmail.co.uk.com', 'hotmail.de', 'hotmail.dk', 'hotmail.es', 'hotmail.eu',
        'hotmail.fr', 'hotmail.gr', 'hotmail.it', 'hotmail.net', 'hotmail.org',
        'hotmail.pt', 'hotmail.ru', 'hotmail.se', 'hotmail.si', 'hotmail.sk',
        'hotmail.uy', 'hotmail.vn', 'hotmaill.com', 'hotmal.com', 'hotmali.com',
        'hotmaill.com', 'hotmial.com', 'hotmil.com', 'hotmsil.com', 'hotnail.com',
        'htmail.com', 'hotmail.com', 'hotmail.co', 'hotmail.c', 'hotmail.con'
      ]
    };

    // Check for common typos in popular domains
    for (const [correctDomain, typos] of Object.entries(emailProviders)) {
      // If it's a direct match with a correct domain, it's valid
      if (domainLower === correctDomain) {
        return true;
      }
      
      // If it's a known typo, reject it
      if (typos.includes(domainLower)) {
        return false;
      }
      
      // Check for close matches using Levenshtein distance (for catching typos like 'ghal.com')
      if (domainLower.length >= 4) { // Only check for domains with at least 4 characters
        const correctBase = correctDomain.split('.')[0];
        const inputBase = domainLower.split('.')[0];
        
        // If the base domain is similar to a known domain but not exactly the same, reject it
        if (inputBase.length >= 4 && 
            (correctBase.includes(inputBase) || inputBase.includes(correctBase)) &&
            domainLower !== correctDomain) {
          return false;
        }
      }
    }
    
    // Additional check for domains that are too short to be valid
    if (domainLower.split('.').some(part => part.length < 2)) {
      return false;
    }

    return true;
  };

  const validateName = (name: string): boolean => {
    // Name must be at least 2 characters and contain only letters, spaces, hyphens, apostrophes
    const nameRegex = /^[a-zA-Z][a-zA-Z\s'-]{1,49}$/;
    return nameRegex.test(name.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedName = firstName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    // Validation
    if (!trimmedName) {
      setError('Please enter your full name');
      return;
    }

    if (!validateName(trimmedName)) {
      setError('Please enter a valid name (2-50 letters)');
      return;
    }

    if (!trimmedEmail) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const success = await subscribeToKlaviyo({
        email: trimmedEmail,
        firstName: trimmedName,
      });

      if (success) {
        onSubscribe(trimmedName, trimmedEmail);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Mobile: Stacked Layout */}
      <div className="flex flex-col sm:hidden gap-3">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Full Name"
          className="hero-input rounded-lg"
          disabled={isLoading}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="hero-input rounded-lg"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="btn-hero rounded-lg font-body"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>

      {/* Desktop: Inline Layout */}
      <div className="hidden sm:flex items-stretch rounded-lg overflow-hidden shadow-xl">
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="Full Name"
          className="hero-input flex-1 min-w-0"
          disabled={isLoading}
        />
        <div className="w-px bg-border/30" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="hero-input flex-1 min-w-0"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="btn-hero font-body"
        >
          {isLoading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </div>

      {error && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-destructive text-sm mt-3 text-center font-body"
        >
          {error}
        </motion.p>
      )}
    </motion.form>
  );
}

export default SubscriptionForm;

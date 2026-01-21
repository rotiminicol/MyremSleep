import { useState } from 'react';
import { motion } from 'framer-motion';
import { subscribeToKlaviyo } from '@/services/klaviyo';

interface SubscriptionFormProps {
  onSubscribe: (email: string) => void;
}

export function SubscriptionForm({ onSubscribe }: SubscriptionFormProps) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!firstName.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!validateEmail(email.trim())) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);

    try {
      const success = await subscribeToKlaviyo({
        email: email.trim(),
        firstName: firstName.trim(),
      });

      if (success) {
        onSubscribe(email.trim());
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

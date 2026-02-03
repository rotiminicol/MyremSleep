import { useState } from 'react';
import { motion } from 'framer-motion';
import { subscribeToKlaviyo } from '@/services/klaviyo';
import { trackSubscription } from '@/components/FacebookPixel';
interface SubscriptionFormProps {
  onSubscribe: (name: string, email: string) => void;
}

export function SubscriptionForm({ onSubscribe }: SubscriptionFormProps) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    // RFC 5322 compliant email regex - accepts all valid email formats
    // Including regional domains like hotmail.co.uk, yahoo.co.jp, etc.
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    return emailRegex.test(email);
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
        // Track subscription event for Facebook Pixel
        trackSubscription(trimmedEmail);

        // Send Welcome Email
        try {
          await fetch('/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'welcome',
              email: trimmedEmail,
              name: trimmedName,
            }),
          });
        } catch (emailErr) {
          console.error('Failed to send welcome email:', emailErr);
          // Don't block user flow if email fails
        }

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

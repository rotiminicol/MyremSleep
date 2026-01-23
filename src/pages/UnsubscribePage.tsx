import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

export default function UnsubscribePage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      toast.error('Please enter your email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke('klaviyo-unsubscribe', {
        body: { email: trimmedEmail },
      });

      if (error) {
        throw error;
      }

      setIsUnsubscribed(true);
      toast.success('You have been unsubscribed');
    } catch (err) {
      console.error('Unsubscribe error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-[#f5f1ed]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center">
            <Link to="/" className="hover:opacity-80 transition-opacity">
              <img 
                src="/logo5.png" 
                alt="REMsleep Logo" 
                className="h-12 w-auto" 
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-md mx-auto px-6 pt-16 pb-20">
        <div className="bg-white rounded-sm shadow-sm px-8 py-12 text-center">
          {!isUnsubscribed ? (
            <>
              <h1 className="text-3xl md:text-4xl font-serif mb-4 text-gray-900">
                Unsubscribe
              </h1>
              <p className="text-gray-600 mb-8">
                Enter your email below to unsubscribe from our mailing list.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400 text-gray-900"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#e8e3dc] hover:bg-[#ddd8d1] text-gray-800 px-6 py-3 rounded-sm text-sm font-medium tracking-widest uppercase transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Processing...' : 'Unsubscribe'}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-serif mb-4 text-gray-900">
                You're Unsubscribed
              </h1>
              <p className="text-gray-600 mb-8">
                You will no longer receive emails from us. If you change your mind, you can always subscribe again.
              </p>
              <Link
                to="/"
                className="inline-block bg-[#e8e3dc] hover:bg-[#ddd8d1] text-gray-800 px-8 py-3 rounded-sm text-sm font-medium tracking-widest uppercase transition-colors"
              >
                Return Home
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { trackContactForm } from '@/services/klaviyo';

interface ContactFormProps {
  onClose: () => void;
}

export function ContactForm({ onClose }: ContactFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Length validation
    if (name.length > 100 || email.length > 255 || subject.length > 200 || message.length > 5000) {
      setError('One or more fields exceed the maximum length');
      return;
    }

    setIsSubmitting(true);

    try {
      // Send email via Vercel Function (api/send-email)
      // Note: This works when deployed to Vercel. Locally, ensure you run 'vercel dev'.
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      let data;
      const responseText = await response.text();
      try {
        data = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error('Failed to parse response as JSON:', responseText);
        throw new Error(`Server returned non-JSON response: ${responseText.substring(0, 100)}`);
      }

      if (!response.ok) {
        // Fallback for local development without API setup
        if (response.status === 404) {
          throw new Error("API endpoint not found. If running locally, please use 'vercel dev'.");
        }
        throw new Error(data.error || `Server error (${response.status})`);
      }

      // Track in Klaviyo for marketing flow
      // Await this to ensure it fires before closing
      console.log('Tracking contact form in Klaviyo...');
      await trackContactForm({
        name,
        email,
        subject,
        message
      });

      toast.success('Message sent successfully!', {
        description: 'We\'ll get back to you soon.',
      });
      onClose();
    } catch (err: any) {
      console.error('Error sending contact email:', err);
      // More helpful error message
      const errorMessage = err.message?.includes('API endpoint not found')
        ? 'Function unavailable locally. Please deploy to test or use "vercel dev".'
        : 'Failed to send message. Please try again.';

      setError(errorMessage);
      toast.error('Failed to send message', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <img src="/cancel.png" alt="Close" className="h-6 w-6 object-contain" />
        </button>

        <div className="p-6">
          <h3 className="text-2xl font-serif mb-6 text-gray-900">Contact Us</h3>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="How can we help?"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Message *
              </label>
              <textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                placeholder="Tell us more about your inquiry..."
                required
              />
            </div>

            {error && (
              <div className="mb-4 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#e8e3dc] hover:bg-[#ddd8d1] text-gray-800 px-6 py-2 rounded-sm text-sm font-medium transition-colors disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ContactForm;

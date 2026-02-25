import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export function StoreFooter() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      toast.success('Thanks for subscribing!', {
        position: 'top-center',
      });
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const footerSections = [
    {
      title: 'Online Support',
      links: [
        { label: 'Contact', href: '/faq' },
        { label: 'Help Center', href: '/help' },
      ],
    },
    {
      title: 'About Us',
      links: [
        { label: 'Our Story', href: '/our-story' },
        { label: 'About us at Remsleep', href: '/about-remsleep' },
        { label: 'Our Core Values', href: '/core-values' },
        { label: 'Materials', href: '/materials' },
        { label: 'The REMsleep Quality Promise', href: '/quality-promise' },
        { label: 'Sustainability at REMsleep', href: '/sustainability' },
        { label: 'Blogs', href: '/blog' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { label: 'Pinterest', href: '#', external: true },
        { label: 'Instagram', href: 'https://www.instagram.com/myremsleepclub/', external: true },
        { label: 'Tiktok', href: '#', external: true },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms & Conditions', href: '/terms' },
      ],
    },
  ];

  // Real payment method logos using official SVG assets from trusted CDN (svgrepo / official brand kits)
  const paymentMethods = [
    {
      name: 'Visa',
      src: 'https://cdn.svgporn.com/logos/visa.svg',
    },
    {
      name: 'Mastercard',
      src: 'https://cdn.svgporn.com/logos/mastercard.svg',
    },
    {
      name: 'PayPal',
      src: 'https://cdn.svgporn.com/logos/paypal.svg',
    },
    {
      name: 'Stripe',
      src: 'https://cdn.svgporn.com/logos/stripe.svg',
    },
    {
      name: 'Apple Pay',
      src: 'https://cdn.svgporn.com/logos/apple-pay.svg',
    },
    {
      name: 'Google Pay',
      src: 'https://cdn.svgporn.com/logos/google-pay.svg',
    },
    {
      name: 'American Express',
      src: 'https://cdn.svgporn.com/logos/amex.svg',
    },
    {
      name: 'Shop Pay',
      src: 'https://cdn.svgporn.com/logos/shopify.svg',
    },
  ];

  return (
    <footer className="bg-[#f5f1ed] border-t border-[#e0dbd5] pt-16 pb-8">
      <div className="max-w-[1400px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-16">
          {/* Newsletter Section */}
          <div className="lg:col-span-2">
            <h3 className="text-sm font-medium text-gray-800 mb-4 tracking-wide">
              Keep in touch
            </h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              Sign up to our newsletter and receive a 10% discount on your next order.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full max-w-xs px-4 py-3 border border-gray-300 bg-transparent text-sm focus:outline-none focus:border-gray-500 transition-colors"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-max text-sm text-gray-600 hover:text-gray-900 underline underline-offset-4 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </form>
          </div>

          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-medium text-gray-800 mb-4 tracking-wide">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright and Payment Methods */}
        <div className="pt-8 border-t border-[#e0dbd5] flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-500">
            © 2026 Remsleep.{' '}
            <Link to="/blog" className="hover:underline">
              Blog
            </Link>{' '}
            • All rights reserved.
          </p>

          {/* Real Payment Logos */}
          <div className="flex flex-wrap justify-center items-center gap-3">
            {paymentMethods.map((method) => (
              <div
                key={method.name}
                className="bg-white border border-gray-200 rounded px-2 py-1 h-8 flex items-center justify-center shadow-sm"
                title={method.name}
              >
                <img
                  src={method.src}
                  alt={method.name}
                  className="h-5 w-auto object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
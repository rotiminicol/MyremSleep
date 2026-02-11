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
      // Add to newsletter (you can integrate with Klaviyo here)
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
        { label: 'Shipping & Returns', href: '/faq' },
        { label: 'Size Guide', href: '/faq' },
        { label: 'Care Guide', href: '/faq' },
        { label: 'Help Center', href: '/faq' },
      ],
    },
    {
      title: 'About Us',
      links: [
        { label: 'About Remsleep', href: '/' },
        { label: 'Our Story', href: '/' },
        { label: 'Sustainability', href: '/' },
      ],
    },
    {
      title: 'Connect',
      links: [
        { label: 'Instagram', href: 'https://www.instagram.com/myremsleepclub/', external: true },
        { label: 'Pinterest', href: '#', external: true },
        { label: 'Facebook', href: '#', external: true },
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

        {/* Copyright */}
        <div className="pt-8 border-t border-[#e0dbd5]">
          <p className="text-xs text-gray-500">
            © 2026 Remsleep. <Link to="/blog" className="hover:underline">Blog</Link> • All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

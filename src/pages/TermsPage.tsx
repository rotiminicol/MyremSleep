import { useState } from 'react';
import { Plus, X } from 'lucide-react';

const terms = [
  {
    title: "1. Introduction",
    content: `Welcome to REMsleep. These Terms of Service ("Terms") govern your access to and use of our website, products, and services (collectively, "Services"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Services.`
  },
  {
    title: "2. Privacy Policy",
    content: `Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using our Services, you agree to our collection and use of information as described in the Privacy Policy.`
  },
  {
    title: "3. Intellectual Property",
    content: `All content included on our site, such as text, graphics, logos, and images, is the property of REMsleep or its content suppliers and protected by international copyright laws. You may not reproduce, distribute, modify, or create derivative works of any content without our prior written consent.`
  },
  {
    title: "4. Limitation of Liability",
    content: `REMsleep shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the Services. In no event shall our total liability to you for all damages exceed the amount you paid to us, if any, for accessing or using our Services.`
  },
  {
    title: "5. Changes to Terms",
    content: `We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of our Services after such modifications constitutes your acceptance of the revised Terms.`
  },
  {
    title: "6. Contact Us",
    content: `If you have any questions about these Terms, please contact us at hello@myremsleep.com. We will respond to your inquiry as soon as possible.`
  }
];

function TermItem({ title, content }: { title: string; content: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300">
      <button
        className="w-full flex justify-between items-center text-left py-6 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-sm font-medium text-gray-800 tracking-wide pr-4">{title}</h3>
        <Plus 
          className={`h-5 w-5 text-gray-600 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 pb-6' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600 leading-relaxed pr-8 whitespace-pre-line">{content}</p>
      </div>
    </div>
  );
}

function ContactForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
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
    
    // Prepare email body with name and email included
    const emailBody = `Name: ${name}%0D%0AEmail: ${email}%0D%0A%0D%0A${message}`;
    const mailtoLink = `mailto:hello@myremsleep.com?subject=${encodeURIComponent(subject)}&body=${emailBody}`;
    window.location.href = mailtoLink;
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-sm shadow-xl w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
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
                className="bg-[#e8e3dc] hover:bg-[#ddd8d1] text-gray-800 px-6 py-2 rounded-sm text-sm font-medium transition-colors"
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

export default function TermsPage() {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f1ed]">
      {/* Header */}
      <header className="border-b border-gray-200 bg-[#f5f1ed]">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center">
            <a href="/" className="hover:opacity-80 transition-opacity">
              <img 
                src="/logo5.png" 
                alt="REMsleep Logo" 
                className="h-12 w-auto" 
              />
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-serif mb-6 text-gray-900">
          Terms & Conditions
        </h1>
        <p className="text-gray-600 text-lg mb-2">
          Last updated: January 22, 2026
        </p>
      </div>

      {/* Terms Section */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="bg-white rounded-sm shadow-sm">
          <div className="px-8 md:px-20 py-2">
            {terms.map((term, index) => (
              <TermItem key={index} title={term.title} content={term.content} />
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-sm shadow-sm px-8 md:px-20 py-16 text-center">
          <p className="text-sm tracking-widest text-gray-500 mb-4 uppercase">Have questions about our terms?</p>
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-gray-900">
            Get in Touch
          </h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            We're here to help. Contact our friendly customer service team for personal support.
          </p>
          <button 
            onClick={() => setShowContactForm(true)}
            className="bg-[#e8e3dc] hover:bg-[#ddd8d1] text-gray-800 px-10 py-4 rounded-full text-sm tracking-widest uppercase transition-colors"
          >
            Contact Us
          </button>
          {showContactForm && <ContactForm onClose={() => setShowContactForm(false)} />}
        </div>
      </div>
    </div>
  );
}

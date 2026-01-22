import { useState } from 'react';
import { Plus, X } from 'lucide-react';

const faqs = [
  {
    question: "When will REMsleep launch?",
    answer: "We are preparing our first drop now and plan to launch in early 2026. Waiting list members receive first access, priority updates, and launch details first."
  },
  {
    question: "When will orders be delivered?",
    answer: "Orders will begin dispatching as soon as we go live. Most UK deliveries arrive within 2–5 working days after dispatch. You will receive a shipping confirmation email with tracking once your order ships."
  },
  {
    question: "Do you deliver internationally?",
    answer: "For our first drop, we are focused on UK delivery. We will share international delivery options with the waiting list as soon as they are confirmed."
  },
  {
    question: "What products are coming?",
    answer: "Our first drop is luxe bedding essentials in calm, grounding colours, including:\n\n• Duvet covers\n• Pillowcases\n• Bedding sets and bundles (limited quantities)"
  },
  {
    question: "Will there be early access or perks for the waiting list?",
    answer: "Yes. Waiting list subscribers receive early access, first notice of launch perks, and a chance to receive an exclusive gift."
  },
  {
    question: "How will I know when you launch?",
    answer: "We will email you as soon as the store opens. To make sure you receive it, add hello@myremsleep.com to your contacts."
  },
  {
    question: "Can I unsubscribe at any time?",
    answer: "Yes. Every email includes an unsubscribe link, and you can opt out whenever you like."
  }
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-300">
      <button
        className="w-full flex justify-between items-center text-left py-6 group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-sm font-medium text-gray-800 tracking-wide uppercase pr-4">{question}</h3>
        <Plus 
          className={`h-5 w-5 text-gray-600 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
        />
      </button>
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 pb-6' : 'max-h-0'
        }`}
      >
        <p className="text-gray-600 leading-relaxed pr-8">{answer}</p>
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

export default function FaqPage() {
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
          Frequently Asked Questions
        </h1>
        <p className="text-gray-600 text-lg mb-2">
          Everything you need to know about our upcoming launch and first drop.
        </p>
        <p className="text-gray-600 text-lg">
          Join the waiting list for first access and priority updates.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="max-w-6xl mx-auto px-6 pb-12">
        <div className="bg-white rounded-sm shadow-sm">
          <div className="px-8 md:px-20 py-2">
            {faqs.map((faq, index) => (
              <FaqItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>

{/* Contact Section */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <div className="bg-white rounded-sm shadow-sm px-8 md:px-20 py-16 text-center">
          <p className="text-sm tracking-widest text-gray-500 mb-4 uppercase">Have more questions?</p>
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
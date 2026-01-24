import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';

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
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'
          }`}
      >
        <p className="text-gray-600 leading-relaxed pr-8 whitespace-pre-line">{answer}</p>
      </div>
    </div>
  );
}

// ContactForm is now imported from @/components/ContactForm

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
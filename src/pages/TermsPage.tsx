import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ContactForm } from '@/components/ContactForm';
import { StoreNavbar } from '@/components/store/StoreNavbar';

const terms = [
  {
    title: "1. Introduction",
    content: `Welcome to REMsleep. These Terms of Service ("Terms") govern your access to and use of our website, products, and services (collectively, "Services"). By accessing or using our Services, you agree to be bound by these Terms.`
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
        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-6' : 'max-h-0'
          }`}
      >
        <p className="text-gray-600 leading-relaxed pr-8 whitespace-pre-line">{content}</p>
      </div>
    </div>
  );
}

export default function TermsPage() {
  const [showContactForm, setShowContactForm] = useState(false);

  return (
    <div className="min-h-screen bg-[#f2e9dc]">
      <StoreNavbar />

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

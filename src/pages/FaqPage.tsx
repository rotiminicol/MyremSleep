import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "What is Remsleep?",
    answer: "Remsleep is a premium sleep wellness brand dedicated to helping you achieve better rest through thoughtfully designed products and sleep solutions. We combine modern technology with natural elements to enhance your sleep quality."
  },
  {
    question: "How do I place an order?",
    answer: "You can place an order directly through our website. Simply browse our products, select your items, and proceed to checkout. We accept various payment methods including major credit cards and digital wallets."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for unused and unopened products. If you're not satisfied with your purchase, please contact our customer service team within 30 days of receiving your order to initiate a return."
  },
  {
    question: "How long does shipping take?",
    answer: "We process all orders within 1-2 business days. Standard shipping typically takes 3-5 business days within the US. International shipping times may vary depending on the destination."
  },
  {
    question: "Do you ship internationally?",
    answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by location. You'll see the exact shipping costs at checkout based on your delivery address."
  },
  {
    question: "How can I track my order?",
    answer: "Once your order has shipped, you'll receive a confirmation email with a tracking number. You can use this number to track your package directly with the shipping carrier."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay for your convenience."
  },
  {
    question: "How do I contact customer support?",
    answer: "Our customer support team is available Monday through Friday, 9 AM to 5 PM EST. You can reach us at support@remsleep.com or through the contact form on our website."
  }
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        className="w-full flex justify-between items-center text-left"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-medium text-gray-900">{question}</h3>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-2"
        >
          <p className="text-gray-600">{answer}</p>
        </motion.div>
      )}
    </div>
  );
}

export function FaqPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-montserrat">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/" className="inline-block">
            <img 
              src="/logo5.png" 
              alt="Remsleep" 
              className="h-10 w-auto brightness-0"
            />
          </Link>
        </div>
      </header>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600">Find answers to common questions about our products and services</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FaqItem key={index} question={faq.question} answer={faq.answer} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Still have questions?</h3>
            <p className="text-gray-600 mb-6">We're here to help! Contact our support team for more information.</p>
            <a
              href="mailto:support@remsleep.com"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </motion.main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500">
              &copy; 2026 Remsleep. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-700 mr-4">
                Terms & Policy
              </Link>
              <Link to="/" className="text-sm text-gray-500 hover:text-gray-700">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default FaqPage;

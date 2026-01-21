import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function TermsPage() {
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
          <h1 className="text-4xl font-bold mb-4">Terms & Policy</h1>
          <p className="text-gray-600">Last updated: January 21, 2026</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Welcome to Remsleep. These Terms of Service ("Terms") govern your access to and use of our website, products, and services (collectively, "Services").
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">2. Privacy Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using our Services, you agree to our collection and use of information as described in the Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All content included on our site, such as text, graphics, logos, and images, is the property of Remsleep or its content suppliers and protected by international copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">4. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Remsleep shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to access or use, the Services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">5. Changes to Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update these Terms from time to time. We will notify you of any changes by posting the new Terms on this page and updating the "Last updated" date.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms, please contact us at <a href="mailto:info@remsleep.com" className="text-blue-600 hover:underline">info@remsleep.com</a>.
            </p>
          </section>
        </div>
      </motion.main>

      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-500">
              &copy; 2026 Remsleep. All rights reserved.
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/faq" className="text-sm text-gray-500 hover:text-gray-700 mr-4">
                FAQ
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

export default TermsPage;

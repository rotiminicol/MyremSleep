import { StoreNavbar } from '@/components/store/StoreNavbar';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, User, MessageSquare, Feather } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      console.log('Contact form submitted:', formData);
      alert('Thank you for your message! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const inputClasses = (fieldName: string) => `
    w-full px-6 py-4 bg-[#e8e3dc] border-2 rounded-xl 
    transition-all duration-300 outline-none text-gray-800
    ${focusedField === fieldName
      ? 'border-[#c2b9ae] shadow-lg'
      : 'border-transparent hover:border-[#d8d1c8]'
    }
    placeholder:text-[#a89f94] placeholder:italic
  `;

  const iconClasses = "absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8f877d] transition-colors duration-300";

  return (
    <div className="min-h-screen bg-[#f2e9dc] flex flex-col relative overflow-x-hidden">
      <StoreNavbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row flex-grow w-full overflow-hidden"
      >
        {/* Left Side - Image - Half Screen */}
        <div className="relative w-full md:w-1/2 h-64 md:h-screen overflow-hidden">

          <motion.img
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src="/image5.png"
            alt="Contact us"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/60 via-[#1a1a1a]/20 to-transparent" />

          {/* Overlay text on image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="absolute bottom-12 left-12 text-white"
          >
            <p className="text-sm tracking-widest mb-2 opacity-90 font-light">HAVE QUESTIONS?</p>
            <h2 className="text-5xl font-serif mb-2">We're Here</h2>
            <h2 className="text-5xl font-serif">to Help</h2>
          </motion.div>

          {/* Decorative element */}
          <div className="absolute top-12 right-12 w-32 h-32 border border-white/20 rounded-full" />
        </div>

        {/* Right Side - Contact Form - Half Screen */}
        <div className="w-full md:w-1/2 h-screen overflow-y-auto bg-[#f2e9dc] relative scrollbar-hide">
          <style>{`
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
          
          {/* Decorative elements - using only neutral tones */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#e8e3dc] rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#d8d1c8] rounded-full blur-3xl opacity-30" />

          <div className="relative z-10 p-6 md:p-8 lg:p-12 min-h-full">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-lg mx-auto"
            >
              {/* Header with decorative line */}
              <div className="mb-12">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '80px' }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="h-0.5 bg-[#c2b9ae] mb-6"
                />
                <h1 className="text-4xl md:text-5xl font-serif text-[#2c2c2c] mb-4 leading-tight">
                  Get in Touch
                </h1>
                <p className="text-[#6b6258] text-lg leading-relaxed">
                  We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <label htmlFor="name" className="block text-sm font-medium text-[#5b544b] mb-2 ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className={`${iconClasses} ${focusedField === 'name' ? 'text-[#5b544b]' : ''}`} />
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('name')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`${inputClasses('name')} pl-12`}
                      placeholder="John Doe"
                    />
                  </div>
                </motion.div>

                {/* Email Field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <label htmlFor="email" className="block text-sm font-medium text-[#5b544b] mb-2 ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className={`${iconClasses} ${focusedField === 'email' ? 'text-[#5b544b]' : ''}`} />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('email')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`${inputClasses('email')} pl-12`}
                      placeholder="hello@example.com"
                    />
                  </div>
                </motion.div>

                {/* Subject Field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="relative"
                >
                  <label htmlFor="subject" className="block text-sm font-medium text-[#5b544b] mb-2 ml-1">
                    Subject
                  </label>
                  <div className="relative">
                    <MessageSquare className={`${iconClasses} ${focusedField === 'subject' ? 'text-[#5b544b]' : ''}`} />
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField('subject')}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`${inputClasses('subject')} pl-12`}
                      placeholder="How can we help?"
                    />
                  </div>
                </motion.div>

                {/* Message Field */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="relative"
                >
                  <label htmlFor="message" className="block text-sm font-medium text-[#5b544b] mb-2 ml-1">
                    Your Message
                  </label>
                  <div className="relative">
                    <Feather className={`absolute left-4 top-5 w-5 h-5 text-[#8f877d] transition-colors duration-300 ${focusedField === 'message' ? 'text-[#5b544b]' : ''}`} />
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleTextAreaChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={5}
                      className={`${inputClasses('message')} pl-12 pt-4 resize-none`}
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="pt-4"
                >
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#2c2c2c] text-[#f5f1ed] py-5 px-6 rounded-xl hover:bg-[#1a1a1a] transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-[#f5f1ed] border-t-transparent border-r-transparent animate-spin rounded-full" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          <span>Send Message</span>
                        </>
                      )}
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#3a3a3a] to-[#1a1a1a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </button>
                </motion.div>
              </form>

              {/* Contact Information - No white elements */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-16 pt-8 border-t border-[#d8d1c8]"
              >
                <div className="grid md:grid-cols-2 gap-10">
                  <div className="space-y-5">
                    <h3 className="text-sm font-semibold text-[#4a443d] tracking-wider uppercase">Contact</h3>
                    <div className="space-y-4">
                      <motion.a
                        whileHover={{ x: 5 }}
                        href="mailto:hello@remsleep.com"
                        className="flex items-center gap-4 text-[#6b6258] hover:text-[#2c2c2c] transition-colors group"
                      >
                        <div className="p-2 bg-[#e8e3dc] rounded-lg group-hover:bg-[#d8d1c8] transition-colors">
                          <Mail className="w-4 h-4" />
                        </div>
                        <span>hello@remsleep.com</span>
                      </motion.a>
                      <motion.a
                        whileHover={{ x: 5 }}
                        href="tel:+441242339161"
                        className="flex items-center gap-4 text-[#6b6258] hover:text-[#2c2c2c] transition-colors group"
                      >
                        <div className="p-2 bg-[#e8e3dc] rounded-lg group-hover:bg-[#d8d1c8] transition-colors">
                          <Phone className="w-4 h-4" />
                        </div>
                        <span>+44 1242 339 161</span>
                      </motion.a>
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-4 text-[#6b6258] group"
                      >
                        <div className="p-2 bg-[#e8e3dc] rounded-lg group-hover:bg-[#d8d1c8] transition-colors">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <span>London, UK</span>
                      </motion.div>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <h3 className="text-sm font-semibold text-[#4a443d] tracking-wider uppercase">Hours</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-[#6b6258]">
                        <span className="text-sm">Monday - Friday</span>
                        <span className="font-medium">9:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between items-center text-[#6b6258]">
                        <span className="text-sm">Saturday</span>
                        <span className="font-medium">10:00 - 16:00</span>
                      </div>
                      <div className="flex justify-between items-center text-[#6b6258]">
                        <span className="text-sm">Sunday</span>
                        <span className="font-medium text-[#a89f94]">Closed</span>
                      </div>
                    </div>

                    {/* Quick response badge - no white */}
                    <div className="mt-6 pt-4">
                      <div className="bg-[#e8e3dc] rounded-lg px-4 py-3 flex items-center gap-3">
                        <div className="w-2 h-2 bg-[#6b6258] rounded-full animate-pulse" />
                        <span className="text-sm text-[#5b544b]">Typically replies within 24 hours</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
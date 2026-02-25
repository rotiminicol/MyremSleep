import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ArrowRight, Truck, Shield, CreditCard, MapPin, Mail, Eye, EyeOff, Check, Lock } from 'lucide-react';
import { StoreFooter } from '@/components/store/StoreFooter';
import { SimpleBackButton } from '@/components/SimpleBackButton';

// ── Tilt Card ──────────────────────────────────────────────────────────────
function TiltCard({ children, className = '', intensity = 1 }) {
  const ref = useRef(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [4 * intensity, -4 * intensity]), { stiffness: 100, damping: 24 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-5 * intensity, 5 * intensity]), { stiffness: 100, damping: 24 });

  useEffect(() => {
    const check = () => setIsDesktop(window.matchMedia('(min-width: 1024px)').matches);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const onMove = (e) => {
    if (!isDesktop || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) / (r.width / 2));
    y.set((e.clientY - (r.top + r.height / 2)) / (r.height / 2));
  };

  return (
    <motion.div ref={ref} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: isDesktop ? rotateX : 0, rotateY: isDesktop ? rotateY : 0, transformStyle: 'preserve-3d', perspective: '1100px' }}
      className={`relative rounded-2xl overflow-hidden transition-shadow duration-500 ${className}`}
    >{children}</motion.div>
  );
}

// ── Form Field ─────────────────────────────────────────────────────────────
function Field({ label, children, optional = false }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {label}
        {optional && <span className="text-[11px] text-[#8f877d] font-normal tracking-wide">optional</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full px-4 py-3.5 bg-[#faf9f7] border border-[#e8e3dc] rounded-xl text-gray-900 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8f877d]/40 focus:border-[#8f877d] transition-all duration-200";

// ── Section Card ───────────────────────────────────────────────────────────
function FormSection({ icon, title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/70 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-sm border border-white/80"
    >
      <div className="flex items-center gap-3 mb-7 pb-5 border-b border-[#ede9e4]">
        <div className="w-9 h-9 rounded-full bg-[#ece8e2] flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <h2 className="text-lg md:text-xl font-serif text-gray-900">{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function CheckoutPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, -100]);

  const [formData, setFormData] = useState({
    email: '', firstName: '', lastName: '', address: '',
    apartment: '', city: '', postcode: '', phone: '',
    cardNumber: '', cardName: '', expiry: '', cvv: '',
    saveInfo: false, termsAccepted: false,
  });
  const [showCvv, setShowCvv] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const cartItems = [
    { id: 1, name: 'Winter Cloud Bundle Set', size: 'King', price: 299, quantity: 1, image: 'https://www.pureparima.com/cdn/shop/files/Silken_Sateen_Oyster_Q_Duvet_Set-side_1_59a7f1dd-756d-4cd9-8a06-22720ad6840a.png?v=1769722845' }
  ];

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal;

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f5f1ed] flex flex-col overflow-x-hidden font-['Georgia',serif]">

      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#e8e3dc] rounded-full blur-[110px] opacity-35" style={{ y: blob1Y }} animate={{ x: [0, 60, 0], scale: [1, 1.08, 1] }} transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#d4ccc3] rounded-full blur-[90px] opacity-30" style={{ y: blob2Y }} animate={{ x: [0, -70, 0], scale: [1, 1.06, 1] }} transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut', delay: 5 }} />
      </div>
        <SimpleBackButton/>
      <main className="flex-grow relative z-10 px-8 md:px-16 xl:px-24 pt-20 pb-24 max-w-[1400px] mx-auto w-full">

        {/* ── PAGE HEADER ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 md:mb-16"
        >
          <span className="text-xs tracking-[0.4em] text-[#8f877d] block mb-4 uppercase font-medium">Checkout</span>
          <h1 className="text-[clamp(36px,5vw,72px)] font-serif text-gray-900 leading-none tracking-tight">
            Complete Your Order
          </h1>
        </motion.div>

        {/* ── PROGRESS BAR ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-0 mb-12 md:mb-16"
        >
          {['Contact', 'Shipping', 'Payment'].map((step, i) => (
            <div key={step} className="flex items-center">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${i === 0 ? 'bg-gray-900 text-white' : 'bg-[#e8e3dc] text-gray-500'}`}>
                  {i + 1}
                </div>
                <span className={`text-sm ${i === 0 ? 'text-gray-900 font-medium' : 'text-gray-400'} hidden sm:block`}>{step}</span>
              </div>
              {i < 2 && <div className="w-12 md:w-20 h-px bg-[#d8d1c8] mx-3" />}
            </div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-[1.1fr_420px] xl:grid-cols-[1fr_440px] gap-8 xl:gap-12 items-start">

          {/* ══ LEFT: FORM ══════════════════════════════════════════ */}
          <div className="space-y-6">

            {/* Contact */}
            <FormSection icon={<Mail className="w-4 h-4 text-[#8f877d]" />} title="Contact Information" delay={0.1}>
              <div className="space-y-5">
                <Field label="Email address">
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} placeholder="your@email.com" />
                </Field>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${formData.saveInfo ? 'bg-gray-900 border-gray-900' : 'border-[#d8d1c8] group-hover:border-gray-400'}`}>
                    {formData.saveInfo && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <input type="checkbox" name="saveInfo" checked={formData.saveInfo} onChange={handleChange} className="sr-only" />
                  <span className="text-sm text-gray-600">Save my information for next time</span>
                </label>
              </div>
            </FormSection>

            {/* Shipping */}
            <FormSection icon={<MapPin className="w-4 h-4 text-[#8f877d]" />} title="Shipping Address" delay={0.15}>
              <div className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="First name">
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} placeholder="John" />
                  </Field>
                  <Field label="Last name">
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} placeholder="Doe" />
                  </Field>
                </div>
                <Field label="Street address">
                  <input type="text" name="address" value={formData.address} onChange={handleChange} className={inputClass} placeholder="123 Main Street" />
                </Field>
                <Field label="Apartment, suite, etc." optional>
                  <input type="text" name="apartment" value={formData.apartment} onChange={handleChange} className={inputClass} placeholder="Apt 4B" />
                </Field>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="City">
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputClass} placeholder="London" />
                  </Field>
                  <Field label="Postcode">
                    <input type="text" name="postcode" value={formData.postcode} onChange={handleChange} className={inputClass} placeholder="SW1A 0AA" />
                  </Field>
                </div>
                <Field label="Phone number">
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+44 20 1234 5678" />
                </Field>
              </div>
            </FormSection>

            {/* Payment */}
            <FormSection icon={<CreditCard className="w-4 h-4 text-[#8f877d]" />} title="Payment Information" delay={0.2}>
              {/* Secure badge */}
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-6">
                <Lock className="w-4 h-4 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-700">Your payment is encrypted and secure</p>
              </div>

              {/* Card type icons */}
              <div className="flex gap-2 mb-6">
                {['VISA', 'MC', 'AMEX', 'PP'].map((card) => (
                  <div key={card} className="px-3 py-1.5 bg-[#faf9f7] border border-[#e8e3dc] rounded-lg text-xs font-medium text-gray-500 tracking-wide">
                    {card}
                  </div>
                ))}
              </div>

              <div className="space-y-5">
                <Field label="Card number">
                  <div className="relative">
                    <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} className={`${inputClass} pr-12`} placeholder="1234 5678 9012 3456" />
                    <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </Field>
                <Field label="Name on card">
                  <input type="text" name="cardName" value={formData.cardName} onChange={handleChange} className={inputClass} placeholder="John Doe" />
                </Field>
                <div className="grid sm:grid-cols-2 gap-5">
                  <Field label="Expiry date">
                    <input type="text" name="expiry" value={formData.expiry} onChange={handleChange} className={inputClass} placeholder="MM / YY" />
                  </Field>
                  <Field label="CVV / CVC">
                    <div className="relative">
                      <input type={showCvv ? 'text' : 'password'} name="cvv" value={formData.cvv} onChange={handleChange} className={`${inputClass} pr-12`} placeholder="•••" />
                      <button type="button" onClick={() => setShowCvv(!showCvv)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </Field>
                </div>
              </div>
            </FormSection>

            {/* Terms */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25 }}
              className="bg-white/70 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-sm border border-white/80"
            >
              <label className="flex items-start gap-4 cursor-pointer group">
                <div className={`w-5 h-5 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${formData.termsAccepted ? 'bg-gray-900 border-gray-900' : 'border-[#d8d1c8] group-hover:border-gray-400'}`}>
                  {formData.termsAccepted && <Check className="w-3 h-3 text-white" />}
                </div>
                <input type="checkbox" name="termsAccepted" checked={formData.termsAccepted} onChange={handleChange} className="sr-only" />
                <span className="text-[14px] text-gray-600 leading-relaxed">
                  I agree to the{' '}
                  <a href="/terms" className="underline underline-offset-2 hover:text-gray-900 transition-colors">Terms and Conditions</a>
                  {' '}and{' '}
                  <a href="/privacy" className="underline underline-offset-2 hover:text-gray-900 transition-colors">Privacy Policy</a>.
                  I understand this order is subject to REMsleep's return policy.
                </span>
              </label>
            </motion.div>
          </div>

          {/* ══ RIGHT: ORDER SUMMARY ══════════════════════════════════ */}
          <div className="lg:sticky lg:top-8 self-start">
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <TiltCard className="bg-white/75 backdrop-blur-md shadow-lg border border-white/80" intensity={0.5}>
                <div className="p-7 md:p-8">
                  <h2 className="text-lg font-serif text-gray-900 mb-6 pb-4 border-b border-[#ede9e4]">Order Summary</h2>

                  {/* Cart items */}
                  <div className="space-y-5 mb-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-[#e8e3dc] flex-shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-serif text-gray-900 text-[15px] leading-snug mb-1">{item.name}</p>
                          <p className="text-xs text-gray-500 mb-2">Size: {item.size} · Qty: {item.quantity}</p>
                          <p className="text-[15px] font-medium text-gray-900">£{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Coupon */}
                  <div className="flex gap-2 mb-6">
                    <input type="text" className="flex-1 px-4 py-2.5 bg-[#faf9f7] border border-[#e8e3dc] rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8f877d]/40 focus:border-[#8f877d]" placeholder="Discount code" />
                    <button className="px-4 py-2.5 bg-[#ece8e2] text-gray-700 rounded-xl text-sm font-medium hover:bg-[#e2ddd7] transition-colors whitespace-nowrap">Apply</button>
                  </div>

                  {/* Totals */}
                  <div className="border-t border-[#ede9e4] pt-5 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal</span>
                      <span className="text-gray-900 font-medium">£{subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Shipping</span>
                      <span className="text-green-600 font-medium">Free</span>
                    </div>
                    <div className="flex justify-between text-[17px] font-serif pt-3 border-t border-[#ede9e4]">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">£{total}</span>
                    </div>
                  </div>

                  {/* Trust badges */}
                  <div className="mt-6 pt-5 border-t border-[#ede9e4] space-y-3">
                    {[
                      { icon: <Shield className="w-4 h-4 text-green-600" />, text: 'Secure & encrypted payment' },
                      { icon: <Truck className="w-4 h-4 text-[#8f877d]" />, text: 'Free delivery on this order' },
                      { icon: <Check className="w-4 h-4 text-[#8f877d]" />, text: '30-day hassle-free returns' },
                    ].map((badge, i) => (
                      <div key={i} className="flex items-center gap-3 text-sm text-gray-500">
                        {badge.icon}
                        {badge.text}
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    type="button"
                    disabled={!formData.termsAccepted}
                    whileHover={formData.termsAccepted ? { scale: 1.02 } : {}}
                    whileTap={formData.termsAccepted ? { scale: 0.98 } : {}}
                    className={`w-full mt-7 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm tracking-[0.15em] uppercase transition-all duration-200 ${formData.termsAccepted ? 'bg-gray-900 text-white shadow-lg hover:bg-[#111]' : 'bg-[#d8d1c8] text-gray-400 cursor-not-allowed'}`}
                  >
                    Place Order
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <p className="text-[11px] text-gray-400 text-center mt-4 leading-relaxed">
                    By placing your order you agree to our terms of service
                  </p>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </div>
      </main>

      {/* Footer stub */}
      <footer className="border-t border-[#e8e3dc] px-8 md:px-16 xl:px-24 py-10 bg-[#f5f1ed]">
        <p className="text-sm text-[#8f877d] tracking-[0.2em] uppercase">REMsleep — Crafted for Nightly Ritual</p>
      </footer>

      <StoreFooter/>
    </div>
  );
}
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import {
  ArrowRight, ArrowLeft, Truck, Shield, CreditCard, MapPin, Mail,
  Eye, EyeOff, Check, Lock, Package, ChevronDown, Zap
} from 'lucide-react';
import { SimpleBackButton } from '@/components/SimpleBackButton';
import { useCartStore } from '@/stores/cartStore';
import { useCurrency } from '@/hooks/useCurrency';
import { useOrderStore } from '@/stores/orderStore';

// Color descriptions for checkout display
const COLOR_DESCRIPTIONS: Record<string, { title: string; description: string }> = {
  'Winter Cloud': {
    title: 'Winter Cloud — Crisp white. Soft glow. Always polished.',
    description: 'A bright, clean white with a hotel-fresh finish. In sateen it looks luminous (never flat) and makes every room feel lighter.'
  },
  'Buttermilk': {
    title: 'Buttermilk — Warm cream. Quiet luxury.',
    description: 'A creamy off-white with a gentle warmth. Sateen makes it look rich and smooth—like classic white, upgraded.'
  },
  'Desert Whisperer': {
    title: 'Desert Whisperer — Sun-washed nude. Calm, not sweet.',
    description: 'A blush-sand neutral that warms a room without stealing focus. Sateen adds a refined, clean sheen.'
  },
  'Desert Sand': {
    title: 'Desert Sand — The anchor neutral. Effortlessly styled.',
    description: 'A modern beige with balance and depth—made for layering. Always looks intentional, even on low-effort days.'
  },
  'Clay Blush': {
    title: 'Clayblush Pink — Muted blush. Modern and grown.',
    description: 'A dusty rose-clay neutral—soft, earthy, quietly romantic. In sateen it reads smooth and elevated, not shiny.'
  },
  'Pebble Haze': {
    title: 'Pebble Haze — Cool grey. Clean calm.',
    description: 'A mid-grey with an architectural feel. Sateen gives it depth and softness—minimal, but never cold.'
  },
  'Cinnamon Bark': {
    title: 'Cinnamon Bark — Deep brown. Grounded. Inviting.',
    description: 'A rich, earthy brown that makes the room feel intentional. Sateen adds a soft sheen and tailored drape.'
  },
  'Clay': {
    title: 'Clay — Soft clay. Lightly sun-warmed. Calm and clean.',
    description: 'A pale clay with no pink in it—just a quiet warmth that feels natural and modern. It brightens the room without turning cold.'
  }
};

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
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        {label}
        {optional && <span className="text-[11px] text-[#8f877d] font-normal tracking-wide">optional</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass = "w-full px-4 py-3.5 bg-[#faf9f7] border border-[#e8e3dc] rounded-xl text-gray-900 text-[15px] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#8f877d]/40 focus:border-[#8f877d] transition-all duration-200";
const selectClass = `${inputClass} appearance-none cursor-pointer`;

// ── Section Card ───────────────────────────────────────────────────────────
function FormSection({ icon, title, children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/70 backdrop-blur-md rounded-2xl p-8 md:p-10 shadow-sm border border-white/80"
    >
      <div className="flex items-center gap-3 mb-7 pb-5 border-b border-[#ede9e4]">
        <div className="w-9 h-9 rounded-full bg-[#ece8e2] flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <h2 className="text-lg md:text-xl text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{title}</h2>
      </div>
      {children}
    </motion.div>
  );
}

// ── Completed Step Summary ─────────────────────────────────────────────────
function CompletedStep({ icon, title, summary, onEdit, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/50 backdrop-blur-md rounded-2xl px-8 py-5 shadow-sm border border-white/80 flex items-center justify-between gap-4"
    >
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
          <Check className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <p className="text-xs text-[#8f877d] uppercase tracking-widest mb-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>{title}</p>
          <p className="text-sm text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>{summary}</p>
        </div>
      </div>
      <button onClick={onEdit} className="text-xs text-[#8f877d] hover:text-gray-900 underline underline-offset-2 transition-colors whitespace-nowrap flex-shrink-0" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        Edit
      </button>
    </motion.div>
  );
}

// ── Express Checkout Button ────────────────────────────────────────────────
function ExpressCheckout({ onExpress }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-white/70 backdrop-blur-md rounded-2xl p-7 md:p-8 shadow-sm border border-white/80 mb-6"
    >
      <div className="flex items-center gap-2 mb-5">
        <Zap className="w-4 h-4 text-[#8f877d]" />
        <h2 className="text-sm font-medium text-gray-700 tracking-[0.08em] uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>Express Checkout</h2>
      </div>

      {/* Shop Pay */}
      <button
        onClick={() => onExpress('shop')}
        className="w-full mb-3 rounded-xl overflow-hidden h-12 flex items-center justify-center font-bold text-white text-sm tracking-wide transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
        style={{ background: 'linear-gradient(135deg, #5a31f4, #7c3aed)' }}
      >
        <svg width="45" height="18" viewBox="0 0 45 18" fill="none">
          <text x="0" y="14" fill="white" fontSize="14" fontFamily="Montserrat, sans-serif" fontWeight="bold" letterSpacing="1">shop</text>
        </svg>
      </button>

      {/* PayPal + Apple Pay + Google Pay */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {/* PayPal */}
        <button
          onClick={() => onExpress('paypal')}
          className="h-12 rounded-xl bg-[#ffc439] flex items-center justify-center transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
        >
          <svg viewBox="0 0 80 24" width="64" height="20" fill="none">
            <text x="0" y="17" fill="#003087" fontSize="13" fontFamily="Montserrat, sans-serif" fontWeight="bold">Pay</text>
            <text x="24" y="17" fill="#009cde" fontSize="13" fontFamily="Montserrat, sans-serif" fontWeight="bold">Pal</text>
          </svg>
        </button>

        {/* Apple Pay */}
        <button
          onClick={() => onExpress('apple')}
          className="h-12 rounded-xl bg-black flex items-center justify-center gap-1.5 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
        >
          <svg viewBox="0 0 18 22" width="13" height="16" fill="white">
            <path d="M14.5 11.8c0-3.2 2.6-4.7 2.7-4.8-1.5-2.1-3.7-2.4-4.5-2.4-1.9-.2-3.8 1.1-4.7 1.1-.9 0-2.4-1.1-4-1.1C1.8 4.7 0 6 0 9.5c0 2.1.4 4.3 1.2 5.7.8 1.3 1.7 2.5 2.9 2.5 1.1 0 1.6-.7 3-.7 1.5 0 1.9.7 3.1.7 1.3 0 2.1-1.1 2.9-2.4.4-.7.7-1.4.9-2.1-.1-.1-2.5-1-2.5-3.4z"/>
            <path d="M12.6 2.8c.7-.9 1.2-2.1 1-3.3-1 0-2.3.7-3 1.6-.7.8-1.2 2-1.1 3.1 1.1.1 2.3-.6 3.1-1.4z"/>
          </svg>
          <span className="text-white text-[13px] font-medium tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>Pay</span>
        </button>

        {/* Google Pay */}
        <button
          onClick={() => onExpress('google')}
          className="h-12 rounded-xl bg-white border border-[#e8e3dc] flex items-center justify-center gap-1 transition-all duration-200 hover:bg-gray-50 active:scale-[0.98]"
        >
          <svg viewBox="0 0 24 24" width="16" height="16">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span className="text-gray-800 text-[13px] font-medium tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>Pay</span>
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-[#e8e3dc]" />
        <span className="text-xs text-[#8f877d] tracking-[0.2em] uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>Or pay manually</span>
        <div className="flex-1 h-px bg-[#e8e3dc]" />
      </div>
    </motion.div>
  );
}

// ── Step 1: Contact ────────────────────────────────────────────────────────
function StepContact({ data, onChange, onNext }) {
  return (
    <div className="space-y-6">
      <FormSection icon={<Mail className="w-4 h-4 text-[#8f877d]" />} title="Contact Information" delay={0.05}>
        <div className="space-y-5">
          <Field label="Email address">
            <input type="email" name="email" value={data.email} onChange={onChange} className={inputClass} placeholder="your@email.com" />
          </Field>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${data.saveInfo ? 'bg-gray-900 border-gray-900' : 'border-[#d8d1c8] group-hover:border-gray-400'}`}>
              {data.saveInfo && <Check className="w-3 h-3 text-white" />}
            </div>
            <input type="checkbox" name="saveInfo" checked={data.saveInfo} onChange={onChange} className="sr-only" />
            <span className="text-sm text-gray-600" style={{ fontFamily: 'Montserrat, sans-serif' }}>Save my information for next time</span>
          </label>
        </div>
      </FormSection>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
        <button
          onClick={onNext}
          disabled={!data.email}
          className={`w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm tracking-[0.15em] uppercase font-medium transition-all duration-200 ${data.email ? 'bg-gray-900 text-white hover:bg-[#111] shadow-lg' : 'bg-[#d8d1c8] text-gray-400 cursor-not-allowed'}`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Continue to Shipping
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}

// ── Step 2: Shipping ───────────────────────────────────────────────────────
function StepShipping({ data, onChange, onNext, onBack }) {
  const countries = ['United Kingdom', 'United States', 'Canada', 'Australia', 'Germany', 'France', 'Netherlands', 'Sweden', 'Norway', 'Denmark'];
  const shippingMethods = [
    { id: 'standard', label: 'Standard Delivery', sub: '5–7 business days', price: 'Free' },
    { id: 'express', label: 'Express Delivery', sub: '2–3 business days', price: '£9.99' },
    { id: 'next', label: 'Next Day Delivery', sub: 'Order before 2pm', price: '£14.99' },
  ];
  const allFilled = data.firstName && data.lastName && data.address && data.city && data.postcode;

  return (
    <div className="space-y-6">
      <FormSection icon={<MapPin className="w-4 h-4 text-[#8f877d]" />} title="Shipping Address" delay={0.05}>
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="First name">
              <input type="text" name="firstName" value={data.firstName} onChange={onChange} className={inputClass} placeholder="John" />
            </Field>
            <Field label="Last name">
              <input type="text" name="lastName" value={data.lastName} onChange={onChange} className={inputClass} placeholder="Doe" />
            </Field>
          </div>
          <Field label="Country">
            <div className="relative">
              <select name="country" value={data.country} onChange={onChange} className={selectClass} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                {countries.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </Field>
          <Field label="Street address">
            <input type="text" name="address" value={data.address} onChange={onChange} className={inputClass} placeholder="123 Main Street" />
          </Field>
          <Field label="Apartment, suite, etc." optional>
            <input type="text" name="apartment" value={data.apartment} onChange={onChange} className={inputClass} placeholder="Apt 4B" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="City">
              <input type="text" name="city" value={data.city} onChange={onChange} className={inputClass} placeholder="London" />
            </Field>
            <Field label="Postcode">
              <input type="text" name="postcode" value={data.postcode} onChange={onChange} className={inputClass} placeholder="SW1A 0AA" />
            </Field>
          </div>
          <Field label="Phone number" optional>
            <input type="tel" name="phone" value={data.phone} onChange={onChange} className={inputClass} placeholder="+44 20 1234 5678" />
          </Field>
        </div>
      </FormSection>

      {/* Shipping method */}
      <FormSection icon={<Truck className="w-4 h-4 text-[#8f877d]" />} title="Delivery Method" delay={0.1}>
        <div className="space-y-3">
          {shippingMethods.map((method) => (
            <label key={method.id} className="flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 hover:border-[#8f877d]/40"
              style={{ borderColor: data.shippingMethod === method.id ? '#4b4540' : '#e8e3dc', background: data.shippingMethod === method.id ? '#faf9f7' : 'transparent' }}>
              <input type="radio" name="shippingMethod" value={method.id} checked={data.shippingMethod === method.id} onChange={onChange} className="sr-only" />
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${data.shippingMethod === method.id ? 'border-gray-900' : 'border-[#d8d1c8]'}`}>
                {data.shippingMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>{method.label}</p>
                <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: 'Montserrat, sans-serif' }}>{method.sub}</p>
              </div>
              <span className={`text-sm font-medium ${method.price === 'Free' ? 'text-green-600' : 'text-gray-900'}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>{method.price}</span>
            </label>
          ))}
        </div>
      </FormSection>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }} className="flex gap-3">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-4 rounded-full text-sm tracking-[0.12em] uppercase font-medium text-gray-600 border border-[#d8d1c8] hover:border-gray-400 transition-all duration-200" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!allFilled}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm tracking-[0.15em] uppercase font-medium transition-all duration-200 ${allFilled ? 'bg-gray-900 text-white hover:bg-[#111] shadow-lg' : 'bg-[#d8d1c8] text-gray-400 cursor-not-allowed'}`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Continue to Payment
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </div>
  );
}

// ── Step 3: Payment ────────────────────────────────────────────────────────
function StepPayment({ data, onChange, onBack, onSubmit, loading }) {
  const [showCvv, setShowCvv] = useState(false);
  const allFilled = data.cardNumber && data.cardName && data.expiry && data.cvv && data.termsAccepted;

  return (
    <div className="space-y-6">
      <FormSection icon={<CreditCard className="w-4 h-4 text-[#8f877d]" />} title="Payment Information" delay={0.05}>
        <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl px-4 py-3 mb-6">
          <Lock className="w-4 h-4 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>Your payment is encrypted and secure</p>
        </div>
        <div className="flex gap-2 mb-6">
          {['VISA', 'MC', 'AMEX', 'PP'].map((card) => (
            <div key={card} className="px-3 py-1.5 bg-[#faf9f7] border border-[#e8e3dc] rounded-lg text-xs font-medium text-gray-500 tracking-wide" style={{ fontFamily: 'Montserrat, sans-serif' }}>{card}</div>
          ))}
        </div>
        <div className="space-y-5">
          <Field label="Card number">
            <div className="relative">
              <input type="text" name="cardNumber" value={data.cardNumber} onChange={onChange} className={`${inputClass} pr-12`} placeholder="1234 5678 9012 3456" maxLength={19} />
              <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </Field>
          <Field label="Name on card">
            <input type="text" name="cardName" value={data.cardName} onChange={onChange} className={inputClass} placeholder="John Doe" />
          </Field>
          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Expiry date">
              <input type="text" name="expiry" value={data.expiry} onChange={onChange} className={inputClass} placeholder="MM / YY" maxLength={7} />
            </Field>
            <Field label="CVV / CVC">
              <div className="relative">
                <input type={showCvv ? 'text' : 'password'} name="cvv" value={data.cvv} onChange={onChange} className={`${inputClass} pr-12`} placeholder="•••" maxLength={4} />
                <button type="button" onClick={() => setShowCvv(!showCvv)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showCvv ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </Field>
          </div>
        </div>
      </FormSection>

      {/* Billing address toggle */}
      <FormSection icon={<MapPin className="w-4 h-4 text-[#8f877d]" />} title="Billing Address" delay={0.1}>
        <div className="space-y-3">
          {[
            { value: 'same', label: 'Same as shipping address' },
            { value: 'different', label: 'Use a different billing address' },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${data.billingAddress === opt.value ? 'border-gray-900' : 'border-[#d8d1c8] group-hover:border-gray-400'}`}>
                {data.billingAddress === opt.value && <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />}
              </div>
              <input type="radio" name="billingAddress" value={opt.value} checked={data.billingAddress === opt.value} onChange={onChange} className="sr-only" />
              <span className="text-sm text-gray-700" style={{ fontFamily: 'Montserrat, sans-serif' }}>{opt.label}</span>
            </label>
          ))}
        </div>
      </FormSection>

      {/* Terms */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.15 }}
        className="bg-white/70 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-sm border border-white/80">
        <label className="flex items-start gap-4 cursor-pointer group">
          <div className={`w-5 h-5 mt-0.5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all ${data.termsAccepted ? 'bg-gray-900 border-gray-900' : 'border-[#d8d1c8] group-hover:border-gray-400'}`}>
            {data.termsAccepted && <Check className="w-3 h-3 text-white" />}
          </div>
          <input type="checkbox" name="termsAccepted" checked={data.termsAccepted} onChange={onChange} className="sr-only" />
          <span className="text-[14px] text-gray-600 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            I agree to the{' '}
            <a href="/terms" className="underline underline-offset-2 hover:text-gray-900 transition-colors">Terms and Conditions</a>
            {' '}and{' '}
            <a href="/privacy" className="underline underline-offset-2 hover:text-gray-900 transition-colors">Privacy Policy</a>.
            I understand this order is subject to REMsleep's return policy.
          </span>
        </label>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2 }} className="flex gap-3">
        <button onClick={onBack} className="flex items-center gap-2 px-5 py-4 rounded-full text-sm tracking-[0.12em] uppercase font-medium text-gray-600 border border-[#d8d1c8] hover:border-gray-400 transition-all duration-200" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <motion.button
          onClick={onSubmit}
          disabled={!allFilled || loading}
          whileHover={allFilled ? { scale: 1.02 } : {}}
          whileTap={allFilled ? { scale: 0.98 } : {}}
          className={`flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm tracking-[0.15em] uppercase font-medium transition-all duration-200 ${allFilled && !loading ? 'bg-gray-900 text-white hover:bg-[#111] shadow-lg' : 'bg-[#d8d1c8] text-gray-400 cursor-not-allowed'}`}
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {loading ? (
            <motion.div className="flex items-center gap-2">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
              />
              Processing...
            </motion.div>
          ) : (
            <>Place Order · £299<ArrowRight className="w-4 h-4" /></>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
}

// ── Success Screen ─────────────────────────────────────────────────────────
function OrderSuccess({ email, onReset }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col items-center text-center py-16"
    >
      <motion.div
        initial={{ scale: 0, rotate: -30 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 200 }}
        className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mb-8"
      >
        <Check className="w-9 h-9 text-white" />
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
        <span className="text-xs tracking-[0.4em] text-[#8f877d] uppercase mb-4 block" style={{ fontFamily: 'Montserrat, sans-serif' }}>Order Confirmed</span>
        <h2 className="text-[clamp(28px,4vw,48px)] text-gray-900 leading-tight mb-4" style={{ fontFamily: 'Montserrat, sans-serif' }}>Thank you for<br />your order</h2>
        <p className="text-gray-500 text-[15px] mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>Order #REMsleep-28471</p>
        <p className="text-gray-500 text-sm mb-10" style={{ fontFamily: 'Montserrat, sans-serif' }}>A confirmation has been sent to <span className="text-gray-900 font-medium">{email || 'your email'}</span></p>
        <div className="grid sm:grid-cols-3 gap-4 mb-10 max-w-lg mx-auto">
          {[
            { icon: <Package className="w-5 h-5 text-[#8f877d]" />, title: 'Preparing', sub: 'We\'re getting your order ready' },
            { icon: <Truck className="w-5 h-5 text-[#8f877d]" />, title: 'Ships in 2 days', sub: 'Estimated 5–7 business days' },
            { icon: <Shield className="w-5 h-5 text-[#8f877d]" />, title: '30-day returns', sub: 'Hassle-free return policy' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
              className="bg-white/70 backdrop-blur-md rounded-xl p-5 border border-white/80 text-left">
              <div className="mb-3">{item.icon}</div>
              <p className="text-sm font-medium text-gray-900 mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{item.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>{item.sub}</p>
            </motion.div>
          ))}
        </div>
        <button onClick={onReset} className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gray-900 text-white text-sm tracking-[0.15em] uppercase hover:bg-[#111] transition-all duration-200 shadow-lg" style={{ fontFamily: 'Montserrat, sans-serif' }}>
          Continue Shopping
          <ArrowRight className="w-4 h-4" />
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
type StepType = 1 | 2 | 3 | 'success' | 'express';

export default function CheckoutPage() {
  const { items, clearCart } = useCartStore();
  const { addOrder } = useOrderStore();
  const { formatPrice } = useCurrency();
  const [step, setStep] = useState<StepType>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Contact
    email: '', saveInfo: false,
    // Shipping
    firstName: '', lastName: '', country: 'United Kingdom',
    address: '', apartment: '', city: '', postcode: '', phone: '',
    shippingMethod: 'standard',
    // Payment
    cardNumber: '', cardName: '', expiry: '', cvv: '',
    billingAddress: 'same', termsAccepted: false,
  });

  // Redirect to cart if empty
  useEffect(() => {
    if (items.length === 0) {
      window.location.href = '/store';
    }
  }, [items]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleExpress = (method) => {
    alert(`${method === 'shop' ? 'Shop Pay' : method === 'paypal' ? 'PayPal' : method === 'apple' ? 'Apple Pay' : method === 'google' ? 'Google Pay' : method} express checkout initiated`);
  };

  const handleSubmit = () => {
    setLoading(true);
    
    // Create order from cart data
    const subtotal = items.reduce((sum, item) => sum + parseFloat(item.price.amount) * item.quantity, 0);
    const shippingCost = formData.shippingMethod === 'express' ? 9.99 : formData.shippingMethod === 'next' ? 14.99 : 0;
    const total = subtotal + shippingCost;
    
    // Convert cart items to order items
    const orderItems = items.map(item => ({
      productId: item.product.node.id,
      productTitle: item.product.node.title,
      variantId: item.variantId,
      variantTitle: item.variantTitle,
      price: item.price,
      quantity: item.quantity,
      selectedOptions: item.selectedOptions,
      image: item.product.node.images?.edges?.[0]?.node?.url,
    }));
    
    // Create the order
    addOrder({
      status: 'processing', // New orders start as processing
      items: orderItems,
      subtotal,
      shippingCost,
      total,
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        city: formData.city,
        postcode: formData.postcode,
        country: formData.country,
      },
    });
    
    setTimeout(() => { 
      setLoading(false); 
      setStep('success'); 
      clearCart(); // Clear cart after successful order
    }, 2200);
  };

  // Calculate totals from real cart data
  const subtotal = items.reduce((sum, item) => sum + parseFloat(item.price.amount) * item.quantity, 0);
  const shippingCost = formData.shippingMethod === 'express' ? 9.99 : formData.shippingMethod === 'next' ? 14.99 : 0;
  const total = subtotal + shippingCost;

  const getContactSummary = () => formData.email || '—';
  const getShippingSummary = () => formData.firstName ? `${formData.firstName} ${formData.lastName}, ${formData.city || '—'}` : '—';

  const steps = ['Contact', 'Shipping', 'Payment'];

  return (
    <div className="min-h-screen bg-[#f5f1ed] flex flex-col overflow-x-hidden" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#e8e3dc] rounded-full blur-[110px] opacity-35"
          animate={{ x: [0, 60, 0], scale: [1, 1.08, 1] }} transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#d4ccc3] rounded-full blur-[90px] opacity-30"
          animate={{ x: [0, -70, 0], scale: [1, 1.06, 1] }} transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut', delay: 5 }} />
      </div>
      
      <SimpleBackButton />

      <main className="flex-grow relative z-10 px-6 md:px-12 xl:px-20 pt-14 pb-24 max-w-[1400px] mx-auto w-full">

        {step === 'success' ? (
          <OrderSuccess email={formData.email} onReset={() => { setStep(1); setFormData({ email: '', saveInfo: false, firstName: '', lastName: '', country: 'United Kingdom', address: '', apartment: '', city: '', postcode: '', phone: '', shippingMethod: 'standard', cardNumber: '', cardName: '', expiry: '', cvv: '', billingAddress: 'same', termsAccepted: false }); }} />
        ) : (
          <>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="mb-10 md:mb-12">
              <span className="text-xs tracking-[0.4em] text-[#8f877d] block mb-3 uppercase font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>REMsleep</span>
              <h1 className="text-[clamp(32px,4.5vw,64px)] text-gray-900 leading-none tracking-tight" style={{ fontFamily: 'Montserrat, sans-serif' }}>Complete Your Order</h1>
            </motion.div>

            {/* Progress */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.15 }} className="flex items-center gap-0 mb-10 md:mb-12">
              {steps.map((s, i) => {
                const stepNum = i + 1;
                const isActive = step === stepNum;
                const isDone = typeof step === 'number' && step > stepNum;
                return (
                  <div key={s} className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${isDone ? 'bg-gray-900 text-white' : isActive ? 'bg-gray-900 text-white ring-4 ring-gray-900/10' : 'bg-[#e8e3dc] text-gray-500'}`}>
                        {isDone ? <Check className="w-3.5 h-3.5" /> : stepNum}
                      </div>
                      <span className={`text-xs font-medium tracking-wide transition-all duration-300 ${isActive ? 'text-gray-900' : isDone ? 'text-gray-500' : 'text-gray-400'}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>{s}</span>
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`w-12 h-px mx-3 transition-all duration-300 ${isDone ? 'bg-gray-900' : 'bg-[#e8e3dc]'}`} />
                    )}
                  </div>
                );
              })}
            </motion.div>

            <div className="grid lg:grid-cols-[1.1fr_420px] xl:grid-cols-[1fr_440px] gap-8 xl:gap-12 items-start">

              {/* ── LEFT ── */}
              <div>
                <AnimatePresence mode="wait">
                  <motion.div key={step}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Express checkout only on step 1 */}
                    {step === 1 && <ExpressCheckout onExpress={handleExpress} />}

                    {/* Completed step summaries */}
                    <div className="space-y-3 mb-6">
                      {typeof step === 'number' && step >= 2 && (
                        <CompletedStep icon={<Mail />} title="Contact" summary={getContactSummary()} onEdit={() => setStep(1)} delay={0} />
                      )}
                      {typeof step === 'number' && step >= 3 && (
                        <CompletedStep icon={<MapPin />} title="Shipping" summary={getShippingSummary()} onEdit={() => setStep(2)} delay={0.05} />
                      )}
                    </div>

                    {step === 1 && <StepContact data={formData} onChange={handleChange} onNext={() => setStep(2)} />}
                    {step === 2 && <StepShipping data={formData} onChange={handleChange} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
                    {step === 3 && <StepPayment data={formData} onChange={handleChange} onBack={() => setStep(2)} onSubmit={handleSubmit} loading={loading} />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ── RIGHT: ORDER SUMMARY ── */}
              <div className="lg:sticky lg:top-8 self-start">
                <motion.div initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}>
                  <TiltCard className="bg-white/75 backdrop-blur-md shadow-lg border border-white/80" intensity={0.5}>
                    <div className="p-7 md:p-8">
                      <h2 className="text-lg text-gray-900 mb-6 pb-4 border-b border-[#ede9e4]" style={{ fontFamily: 'Montserrat, sans-serif' }}>Order Summary</h2>

                      {items.map((item) => {
                        // Get the selected color from the item's selected options
                        const selectedColor = item.selectedOptions.find(opt => 
                          opt.name.toLowerCase().includes('color') || opt.name.toLowerCase().includes('colour')
                        )?.value;
                        
                        // Get color-specific title
                        const colorTitle = selectedColor && COLOR_DESCRIPTIONS[selectedColor] 
                          ? COLOR_DESCRIPTIONS[selectedColor].title 
                          : item.product.node.title;
                        
                        // Get variant details
                        const size = item.selectedOptions.find(opt => 
                          opt.name.toLowerCase().includes('size')
                        )?.value || 'Standard';
                        
                        return (
                          <div key={item.variantId} className="flex gap-4 mb-6">
                            <div className="w-[72px] h-[72px] rounded-xl overflow-hidden bg-[#e8e3dc] flex-shrink-0">
                              <img 
                                src={item.product.node.images?.edges?.[0]?.node?.url || '/placeholder.png'} 
                                alt={colorTitle} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-900 text-[15px] leading-snug mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>{colorTitle}</p>
                              <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                {item.selectedOptions
                                  .filter(opt => opt.value !== 'Default Title' && opt.value !== 'Default')
                                  .map((opt) => opt.value)
                                  .join(' · ')} · Qty: {item.quantity}
                              </p>
                              <p className="text-[15px] font-medium text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                {formatPrice(parseFloat(item.price.amount))}
                              </p>
                            </div>
                          </div>
                        );
                      })}

                      {/* Coupon */}
                      <div className="flex gap-2 mb-6">
                        <input type="text" className="flex-1 px-4 py-2.5 bg-[#faf9f7] border border-[#e8e3dc] rounded-xl text-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8f877d]/40 focus:border-[#8f877d]" placeholder="Discount code" />
                        <button className="px-4 py-2.5 bg-[#ece8e2] text-gray-700 rounded-xl text-sm font-medium hover:bg-[#e2ddd7] transition-colors whitespace-nowrap" style={{ fontFamily: 'Montserrat, sans-serif' }}>Apply</button>
                      </div>

                      {/* Totals */}
                      <div className="border-t border-[#ede9e4] pt-5 space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>Subtotal</span>
                          <span className="text-gray-900 font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>{formatPrice(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500" style={{ fontFamily: 'Montserrat, sans-serif' }}>Shipping</span>
                          <AnimatePresence mode="wait">
                            <motion.span key={shippingCost} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }}
                              className={`font-medium ${shippingCost === 0 ? 'text-green-600' : 'text-gray-900'}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                        <div className="flex justify-between text-[17px] pt-3 border-t border-[#ede9e4]">
                          <span className="text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>Total</span>
                          <AnimatePresence mode="wait">
                            <motion.span key={total} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.2 }} className="text-gray-900" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              {formatPrice(total)}
                            </motion.span>
                          </AnimatePresence>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </main>

      <footer className="relative z-10 border-t border-[#e8e3dc] px-8 md:px-16 xl:px-24 py-10 bg-[#f5f1ed]">
        <p className="text-sm text-[#8f877d] tracking-[0.2em] uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>REMsleep — Crafted for Nightly Ritual</p>
      </footer>
    </div>
  );
}
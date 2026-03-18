import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ChevronDown, Package, Truck, RotateCcw, Heart, Shield } from 'lucide-react';
import { StoreFooter } from '@/components/store/StoreFooter';
import { StoreNavbar } from '@/components/store/StoreNavbar';

// ── Tilt Card ──────────────────────────────────────────────────────────────
function TiltCard({ children, className = '', intensity = 1 }) {
  const ref = useRef(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6 * intensity, -6 * intensity]), { stiffness: 100, damping: 24 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8 * intensity, 8 * intensity]), { stiffness: 100, damping: 24 });

  useEffect(() => {
    const check = () => setIsDesktop(window.matchMedia('(min-width: 1024px)').matches);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const onMove = (e) => {
    if (!isDesktop || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) / (r.width / 2));
    y.set((e.clientY - (r.top + r.height / 2)) / (r.height / 2));
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: isDesktop ? rotateX : 0, rotateY: isDesktop ? rotateY : 0, transformStyle: 'preserve-3d', perspective: '1100px' }}
      className={`relative rounded-2xl overflow-hidden transition-shadow duration-500 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ── Divider ────────────────────────────────────────────────────────────────
function Divider() {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      style={{ originX: 0 }}
      className="w-full h-px bg-[#d8d1c8]"
    />
  );
}

// ── FAQ Accordion ──────────────────────────────────────────────────────────
function FAQAccordion({ item, index }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.06 }}
      viewport={{ once: true }}
      className="border-b border-[#ede9e4] last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 md:py-6 text-left flex items-start justify-between gap-6 px-0 group"
      >
        <span className="text-[15px] md:text-[17px] font-serif text-gray-900 leading-snug flex-1 group-hover:text-gray-600 transition-colors">
          {item.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="flex-shrink-0 mt-0.5"
        >
          <ChevronDown className="w-5 h-5 text-[#8f877d]" />
        </motion.div>
      </button>

      <motion.div
        initial={false}
        animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden"
      >
        <div className="pb-6 md:pb-8 text-gray-600 leading-[1.85] text-[15px] md:text-[16px] whitespace-pre-line">
          {item.answer}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── FAQ Section ────────────────────────────────────────────────────────────
function FAQSection({ section, index }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      viewport={{ once: true, margin: '-80px' }}
      className="pt-16 md:pt-20"
    >
      <Divider />
      <div className="grid lg:grid-cols-[280px_1fr] gap-10 md:gap-16 pt-10 md:pt-14">

        {/* Sticky label column */}
        <div className="lg:sticky lg:top-28 self-start space-y-3">
          {section.icon && (
            <div className="w-10 h-10 bg-[#ece8e2] rounded-full flex items-center justify-center text-[#8f877d]">
              {section.icon}
            </div>
          )}
          <h2 className="text-2xl md:text-3xl font-serif text-gray-900 leading-tight">
            {section.title}
          </h2>
          <div className="w-8 h-px bg-[#d8d1c8]" />
        </div>

        {/* Accordion column */}
        <div className="divide-y-0">
          {section.items.map((item, i) => (
            <FAQAccordion key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function HelpCenterPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.18, 0.28], [1, 1, 0]);
  const heroScale  = useTransform(scrollYProgress, [0, 0.28], [1, 0.97]);
  const heroY      = useTransform(scrollYProgress, [0, 0.28], [0, -40]);
  const blob1Y     = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const blob2Y     = useTransform(scrollYProgress, [0, 1], [0, -120]);

  const faqSections = [
    {
      title: "FAQs & Support",
      items: [
        {
          question: "What is sateen?",
          answer: "Sateen is a cotton weave (not a fibre). It uses a structure that brings more yarn to the surface, giving bedding a smooth hand-feel, a soft drape, and a quiet sheen. It is the finish that makes the bed look instantly more polished."
        },
        {
          question: "Is 300 thread count good?",
          answer: "Yes — when it is done properly. Thread count is only one signal. What matters more is the quality of the cotton fibres, the weave, and the finishing. 300 thread count sateen is a sweet spot: smooth, breathable, and durable without feeling heavy. Long, well-spun fibres tend to wear better and pill less over time — that's why at REMsleep we focus on the thread count, the weave, and the length of fibres."
        },
        {
          question: "What is included in a REMsleep bundle set?",
          answer: "REMsleep bundle sets are designed to look complete from day one. Each bundle includes:\n• 1 duvet cover\n• 1 fitted sheet\n• Four pillowcases (Oxford and Regular)"
        },
        {
          question: "Do the fitted sheets fit deep mattresses?",
          answer: "They are designed for a secure, stays-put fit with full elastic and a deeper pocket than a standard fitted sheet. Our fitted sheet fits mattresses up to 35–40cm.\n\nBest practice: measure your mattress depth (top to underside, including any topper) and compare to the listed depth on the product page."
        },
        {
          question: "How do I wash sateen without losing the sheen?",
          answer: "Sateen keeps its sheen best with gentle washing and low heat.\n• Wash inside out on a cool/30°C gentle cycle\n• Use a mild liquid detergent\n• Avoid bleach and fabric softener (they can dull the finish)\n• Dry low (or line dry) and remove promptly\n• If you like a more polished look: iron on low/medium while slightly damp"
        },
        {
          question: "Does Egyptian cotton feel cool or warm?",
          answer: "Egyptian cotton is naturally breathable and temperature-balancing. In a sateen weave, it feels smooth and cosy at first touch, while still breathable through the night. If you want a softer, more draped feel, sateen is the one."
        },
        {
          question: "Are pillowcases Oxford or housewife?",
          answer: "Yes, we have four pillowcases, so your bedding comes in a complete set. Fuss free:\n• Standard pillowcases: clean edge, no border\n• Oxford pillowcases: a stitched border/flange\n\nIt is designed to look finished the moment it is made — no piecemeal shopping."
        },
        {
          question: "Is OEKO-TEX® certified?",
          answer: "We are OEKO-TEX® STANDARD 100 certified."
        }
      ]
    },
    {
      title: "Products & Materials",
      icon: <Package className="w-5 h-5" />,
      items: [
        {
          question: "What materials are your bundle sets made from?",
          answer: "REMsleep bedding is made from 100% Egyptian cotton sateen with a 300 thread count weave. Smooth on skin, breathable through the night, with a soft, quiet sheen."
        },
        {
          question: "What is sateen (and how does it feel)?",
          answer: "Sateen is a cotton weave with more yarn on the surface. That is what creates the smooth hand-feel, a clean drape, and that subtle sheen that looks 'hotel-finished' without trying."
        },
        {
          question: "Is sateen too warm for all seasons?",
          answer: "Our sateen is 100% cotton — so it stays breathable. If you sleep very hot, choose lighter layers and keep your room cool; the fabric will still ventilate well."
        },
        {
          question: "Do you sell pieces separately?",
          answer: "At launch we focus on Bundle Sets for the cleanest experience and best value."
        }
      ]
    },
    {
      title: "Sizes & Fit",
      items: [
        {
          question: "What sizes do you offer?",
          answer: "We offer standard UK sizes for Launch: Double and King.\n\nSize Guide (UK):\n\nDouble — Duvet Cover: 200×200cm | Fitted Sheet: 135×190×40cm | Oxford Pillowcase: 50×75cm +5cm | Regular Pillowcase: 50×75cm\n\nKing — Duvet Cover: 225×220cm | Fitted Sheet: 150×200×40cm | Oxford Pillowcase: 50×75cm +5cm | Regular Pillowcase: 50×75cm"
        },
        {
          question: "How deep are your fitted sheets?",
          answer: "Our fitted sheets are designed to fit most modern mattresses securely. If you use a topper or have an extra-deep mattress, check the Size Guide before ordering."
        },
        {
          question: "Will your cotton shrink?",
          answer: "All cotton can relax and shift slightly after the first wash. We allow for this in sizing. Follow the Care Guide to keep the fit consistent."
        }
      ]
    },
    {
      title: "Delivery",
      icon: <Truck className="w-5 h-5" />,
      items: [
        {
          question: "What are your delivery options?",
          answer: "Every REMsleep order is packed with care and shipped with trusted carriers.\n\nExpress Delivery (UK) — £6.95\nOrders placed before 12pm (Mon–Fri) are dispatched the same day via DPD (express, tracked). Limited to UK mainland addresses.\n\nStandard Delivery (UK) — Free on orders over £99\nPlease allow 3–5 working days. Ships via DPD, Royal Mail, or Evri. Most deliveries include tracking with advance notification.\n\nNorthern Ireland & Channel Islands — £9.95\n\nEU & International\nDelivery charge shown at checkout covers shipping plus local taxes and import duties. Typically within 5 days."
        }
      ]
    },
    {
      title: "Returns & Exchanges",
      icon: <RotateCcw className="w-5 h-5" />,
      items: [
        {
          question: "What is your returns policy?",
          answer: "If you change your mind, you can return your order within 30 days of purchase. We offer a refund, exchange, or store gift card, provided items are unused, unwashed, and returned in their original packaging."
        },
        {
          question: "How to return (UK)",
          answer: "Use our online returns portal to register your return, pay the return fee, and select either a refund to your original payment method or store credit (issued as a digital gift card). Drop your parcel at your chosen local drop-off point.\n\nOnce your return arrives with us, we process refunds within 5 working days. If you choose store credit, your digital gift card will be emailed to you."
        },
        {
          question: "Exchanges (UK)",
          answer: "For exchanges, email our Customer Care team with your request and order details, and we will help arrange it: Hello@myremsleep.com\n\nYour exchange will be processed once your return has been received."
        },
        {
          question: "Returns Policy – EU & Rest of World",
          answer: "You can return your order within 30 days of delivery for a refund, exchange, or store credit, as long as items are unused, unwashed, and in their original packaging.\n\nPlease note: You will need to arrange with your local courier to return the package."
        },
        {
          question: "I did not receive my order confirmation — what should I do?",
          answer: "Check your spam/junk folder first. If it is not there, contact us with your name and the email used at checkout."
        }
      ]
    },
    {
      title: "Care",
      icon: <Heart className="w-5 h-5" />,
      items: [
        {
          question: "How do I wash Egyptian cotton sateen bedding?",
          answer: "Keep it calm:\n• 30°C (preferred) on a gentle cycle\n• Wash inside out to protect the outer face\n• Avoid overloading the drum (less friction, less creasing)"
        },
        {
          question: "Can I tumble dry?",
          answer: "Yes, but use low heat and remove slightly damp. A quick shake and smooth by hand helps the sateen drape fall back into place."
        },
        {
          question: "Do I need to iron it?",
          answer: "Not required. If you like a sharper finish, iron on a medium setting while slightly damp."
        }
      ]
    },
    {
      title: "People & Planet",
      icon: <Shield className="w-5 h-5" />,
      items: [
        {
          question: "Where is REMsleep made?",
          answer: "Our bedding is made in China with a family-run factory that has been producing bedding for over three generations."
        },
        {
          question: "What is your stance on working standards?",
          answer: "We verify responsible working standards, including no forced labour, and we set clear expectations on safe working conditions and fair pay practices with suppliers."
        },
        {
          question: "What packaging do you use?",
          answer: "We are launching with packaging that is 100% recyclable and minimal."
        }
      ]
    }
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f2e9dc] flex flex-col overflow-x-hidden font-['Georgia',serif]">
      <StoreNavbar />

      {/* Ambient background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#e8e3dc] rounded-full blur-[100px] opacity-40"
          style={{ y: blob1Y }}
          animate={{ x: [0, 70, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#d4ccc3] rounded-full blur-[90px] opacity-30"
          style={{ y: blob2Y }}
          animate={{ x: [0, -80, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 34, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
        />
      </div>

      <main className="flex-grow relative z-10">

        {/* ══ HERO ══════════════════════════════════════ */}
        <motion.section
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="px-8 md:px-16 xl:px-24 pt-28 pb-24 md:pb-36 max-w-[1400px] mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-xs tracking-[0.4em] text-[#8f877d] block mb-5 uppercase font-medium">
              Help Centre
            </span>
            <h1 className="text-[clamp(48px,8vw,110px)] font-serif text-gray-900 leading-none tracking-tight mb-6">
              How can we help?
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 font-light leading-[1.7] max-w-[600px]">
              Quick answers about delivery, returns, sizing, care & materials for your REMsleep bedding.
            </p>
          </motion.div>
        </motion.section>

        {/* ══ HERO IMAGE ═════════════════════════════════ */}
        <div className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto mb-6 md:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <TiltCard className="shadow-xl" intensity={0.4}>
              <div className="aspect-[21/7] md:aspect-[21/6]">
                <img
                  src="https://m.media-amazon.com/images/I/81-EFZ-zW9L._AC_UF894,1000_QL80_.jpg"
                  alt="Luxury Egyptian cotton sateen bedding"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-end p-8 md:p-12">
                  <p className="text-white/80 text-sm tracking-[0.3em] uppercase">Egyptian Cotton Sateen — 300 Thread Count</p>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>

        {/* ══ FAQ SECTIONS ══════════════════════════════ */}
        <div className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto">
          {faqSections.map((section, idx) => (
            <FAQSection key={idx} section={section} index={idx} />
          ))}
        </div>

        {/* ══ CONTACT CTA ═══════════════════════════════ */}
        <div className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto mt-20 md:mt-28 mb-20 md:mb-28 pt-16 md:pt-20">
          <Divider />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
            viewport={{ once: true }}
            className="pt-16 md:pt-20"
          >
            <TiltCard className="shadow-2xl" intensity={0.4}>
              <div className="bg-gradient-to-br from-[#2c2c2c] to-[#111] p-12 md:p-16 lg:p-20">
                <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">
                  <div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white mb-5 leading-tight">
                      Still need help?
                    </h2>
                    <p className="text-lg text-gray-400 leading-relaxed max-w-xl">
                      Email us at hello@myremsleep.com or use the contact form. We usually reply within 1–2 working days.
                    </p>
                  </div>
                  <motion.a
                    href="/contact"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-shrink-0 bg-white text-gray-900 px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase shadow-lg inline-block whitespace-nowrap"
                  >
                    Contact Us
                  </motion.a>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>

      </main>

      {/* Footer stub */}
      <footer className="border-t border-[#e8e3dc] px-8 md:px-16 xl:px-24 py-10 bg-[#f2e9dc]">
        <p className="text-sm text-[#8f877d] tracking-[0.2em] uppercase">REMsleep — Crafted for Nightly Ritual</p>
      </footer>

      <StoreFooter/>
    </div>
  );
}
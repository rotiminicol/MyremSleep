import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Star, ArrowRight } from 'lucide-react';
import { StoreFooter } from '@/components/store/StoreFooter';
import { StoreNavbar } from '@/components/store/StoreNavbar';

// ── Tilt Card ──────────────────────────────────────────────────────────────
function TiltCard({ children, className = '', intensity = 1 }) {
  const ref = useRef(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8 * intensity, -8 * intensity]), { stiffness: 100, damping: 22 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-10 * intensity, 10 * intensity]), { stiffness: 100, damping: 22 });

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
      style={{ rotateX: isDesktop ? rotateX : 0, rotateY: isDesktop ? rotateY : 0, transformStyle: 'preserve-3d', perspective: '1200px' }}
      className={`relative rounded-2xl overflow-hidden transition-shadow duration-500 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ── Section Label ──────────────────────────────────────────────────────────
function Label({ children }) {
  return (
    <motion.span
      initial={{ opacity: 0, letterSpacing: '0.2em' }}
      whileInView={{ opacity: 1, letterSpacing: '0.4em' }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      className="text-xs tracking-[0.4em] text-[#8f877d] block font-medium uppercase"
    >
      {children}
    </motion.span>
  );
}

// ── Reveal Heading ─────────────────────────────────────────────────────────
function RevealHeading({ children, className = '' }) {
  return (
    <div className="overflow-hidden">
      <motion.h2
        initial={{ y: '110%', opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true }}
        className={className}
      >
        {children}
      </motion.h2>
    </div>
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
      className="w-full h-px bg-[#d8d1c8] my-0"
    />
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function OurStoryPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.18, 0.28], [1, 1, 0]);
  const heroScale  = useTransform(scrollYProgress, [0, 0.28], [1, 0.97]);
  const heroY      = useTransform(scrollYProgress, [0, 0.28], [0, -40]);
  const blob1Y     = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const blob2Y     = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F2EDE8] flex flex-col overflow-x-hidden font-['Georgia',serif]">
      <StoreNavbar />

      {/* ── Ambient Background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          className="absolute top-0 left-0 w-[700px] h-[700px] bg-[#e8e3dc] rounded-full blur-[120px] opacity-40"
          style={{ y: blob1Y }}
          animate={{ x: [0, 80, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#d4ccc3] rounded-full blur-[100px] opacity-35"
          style={{ y: blob2Y }}
          animate={{ x: [0, -100, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
        />
      </div>

      <main className="flex-grow relative z-10">

        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
        <motion.section
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative px-8 md:px-16 xl:px-24 pt-28 pb-40 md:pb-56 max-w-[1400px] mx-auto"
        >
          <div className="max-w-[900px]">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Label>Our Story</Label>
              <h1 className="mt-6 text-[clamp(56px,9vw,120px)] font-serif text-gray-900 leading-none tracking-tight">
                REMsleep
              </h1>
              <div className="mt-8 max-w-[600px]">
                <p className="text-xl md:text-2xl text-gray-500 font-light leading-[1.7]">
                  Complete bedding sets designed for calm, considered bedrooms that feel effortlessly finished.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Hero decorative number */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 0.06, x: 0 }}
            transition={{ duration: 1.4, delay: 0.4 }}
            className="absolute right-8 md:right-16 xl:right-24 top-24 text-[280px] md:text-[380px] font-serif text-gray-900 leading-none select-none pointer-events-none"
          >
            01
          </motion.div>
        </motion.section>

        {/* ══════════════════════════════════════════
            THE FRUSTRATION
        ══════════════════════════════════════════ */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto mb-32 md:mb-48">
          <Divider />
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 md:gap-24 items-center pt-16 md:pt-24">

            {/* Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                viewport={{ once: true }}
                className="space-y-3 mb-10"
              >
                <Label>The Frustration</Label>
                <RevealHeading className="text-[clamp(36px,5vw,64px)] font-serif text-gray-900 leading-tight">
                  A Simple Problem
                </RevealHeading>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-6 text-[17px] md:text-lg text-gray-600 leading-[1.85]"
              >
                <p>
                  REMsleep began with a simple frustration: "premium bedding" still felt like a piecemeal purchase. A duvet cover here, a fitted sheet there, pillowcases from somewhere else — never quite matching, never quite finished.
                </p>
                <p>
                  We wanted one set that looked quiet, felt indulgent, and stayed polished night after night.
                </p>
              </motion.div>
            </div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <TiltCard className="shadow-2xl" intensity={0.8}>
                <div className="aspect-[4/3] bg-[#e8e3dc]">
                  <img
                    src="https://www.pureparima.com/cdn/shop/files/Silken_Sateen_Oyster_Q_Duvet_Set-side_1_59a7f1dd-756d-4cd9-8a06-22720ad6840a.png?v=1769722845"
                    alt="Luxury Egyptian cotton sateen bedding set"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            THE SOLUTION
        ══════════════════════════════════════════ */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto mb-32 md:mb-48">
          <Divider />
          <div className="pt-16 md:pt-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: true }}
              className="space-y-3 mb-14"
            >
              <Label>The Solution</Label>
              <RevealHeading className="text-[clamp(36px,5vw,64px)] font-serif text-gray-900 leading-tight">
                Built Different
              </RevealHeading>
            </motion.div>

            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 md:gap-16 items-start">

              {/* Main text */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.15 }}
                viewport={{ once: true }}
              >
                <p className="text-[17px] md:text-lg text-gray-600 leading-[1.85] mb-12">
                  So we built the set we could not find: complete bundle sets in calm, seasonless colours — crafted from 100% Egyptian cotton sateen for a smooth drape, a subtle sheen, and that instantly finished feel.
                </p>

                {/* Feature list */}
                <div className="space-y-5">
                  {[
                    { title: 'Complete Sets', desc: 'Everything included, nothing missing. Duvet cover, fitted sheet, four pillowcases.' },
                    { title: 'Seasonless Colours', desc: 'Calm neutrals that work year-round, never trend-chasing.' },
                    { title: 'Premium Materials', desc: '100% Egyptian cotton sateen — smooth, breathable, quietly luxurious.' },
                  ].map((f, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.7, delay: i * 0.12 }}
                      viewport={{ once: true }}
                      className="flex gap-5 p-5 rounded-xl bg-white/60 backdrop-blur-sm border border-[#e8e3dc]"
                    >
                      <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-900 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" viewBox="0 0 16 16" fill="none">
                          <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <div>
                        <p className="font-serif text-gray-900 text-[17px] mb-1">{f.title}</p>
                        <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Quote pull-out */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
                viewport={{ once: true }}
              >
                <TiltCard className="bg-gradient-to-br from-[#2c2c2c] to-[#111] shadow-2xl" intensity={0.6}>
                  <div className="p-10 md:p-12 text-white">
                    <div className="text-6xl text-white/20 font-serif leading-none mb-4">"</div>
                    <p className="text-xl md:text-2xl font-serif leading-[1.6] mb-8">
                      The goal is not more. No chasing matching pieces. No extra decisions. Just a calm reset, on repeat.
                    </p>
                    <div className="w-12 h-px bg-white/30" />
                  </div>
                </TiltCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            THE DEEPER ROOT
        ══════════════════════════════════════════ */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto mb-32 md:mb-48">
          <Divider />
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 md:gap-24 items-center pt-16 md:pt-24">

            {/* Image with overlay */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
            >
              <TiltCard className="shadow-2xl" intensity={0.7}>
                <div className="aspect-square">
                  <img
                    src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80"
                    alt="Joel 2:28 — dreams and visions"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-8">
                    <div>
                      <p className="text-white/60 text-xs tracking-[0.3em] uppercase mb-1">The Root</p>
                      <p className="text-white text-2xl font-serif">Joel 2:28</p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.div>

            {/* Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                viewport={{ once: true }}
                className="space-y-3 mb-10"
              >
                <Label>The Meaning</Label>
                <RevealHeading className="text-[clamp(36px,5vw,64px)] font-serif text-gray-900 leading-tight">
                  A Deeper Root
                </RevealHeading>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-6 text-[17px] md:text-lg text-gray-600 leading-[1.85]"
              >
                <p>
                  REMsleep has a deeper root. The name is drawn from Joel 2:28 — The Spirit of God poured out; dreams and visions stirred awake.
                </p>
                <p>
                  We hold that as a quiet truth: rest is not passive. It is where you exhale and make space for what is next. The room settles. The mind clears. In the stillness, sleep becomes restoration — sometimes even a return to dreaming again.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            THE MISSION
        ══════════════════════════════════════════ */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto mb-32 md:mb-48">
          <Divider />
          <div className="pt-16 md:pt-24">
            <div className="grid lg:grid-cols-[1fr_1.6fr] gap-16 md:gap-24">

              {/* Left: label + heading */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                viewport={{ once: true }}
                className="space-y-3 lg:sticky lg:top-24 self-start"
              >
                <Label>The Mission</Label>
                <RevealHeading className="text-[clamp(36px,5vw,64px)] font-serif text-gray-900 leading-tight">
                  Intentional Rest
                </RevealHeading>
              </motion.div>

              {/* Right: paragraphs + blockquote */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.2 }}
                viewport={{ once: true }}
                className="space-y-8 text-[17px] md:text-lg text-gray-600 leading-[1.85]"
              >
                <p>
                  We believe better sleep starts with better rituals. The bed sits at the centre, so we obsess over feel, drape, and the quiet details that change the whole room.
                </p>
                <p>
                  A made bed, without the fuss — effortless, every day. That is why we make bedding sets designed for bedrooms that feel calm, clean, and considered.
                </p>

                <TiltCard className="!rounded-2xl shadow-md" intensity={0.5}>
                  <div className="bg-[#ece8e2] p-8 md:p-10">
                    <div className="text-5xl text-[#8f877d] font-serif leading-none mb-3">"</div>
                    <p className="text-xl md:text-2xl font-serif text-gray-900 leading-[1.6]">
                      Our mission is simple: to make rest feel more intentional — through quiet materials, grounded colours, and complete sets designed for real life.
                    </p>
                  </div>
                </TiltCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            AVAILABILITY
        ══════════════════════════════════════════ */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto mb-32 md:mb-40">
          <Divider />
          <div className="pt-16 md:pt-24">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: true }}
              className="grid lg:grid-cols-[1.2fr_1fr] gap-16 items-center"
            >
              <div className="space-y-6">
                <Label>Availability</Label>
                <RevealHeading className="text-[clamp(36px,5vw,64px)] font-serif text-gray-900 leading-tight">
                  Available Exclusively Online
                </RevealHeading>
                <p className="text-[17px] md:text-lg text-gray-600 leading-[1.85]">
                  REMsleep ships across the EU, bringing calm, considered bedding directly to your door.
                </p>

                <motion.a
                  href="/store"
                  whileHover={{ scale: 1.03, x: 4 }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase mt-4 shadow-lg"
                >
                  Shop Collection
                  <ArrowRight className="w-4 h-4" />
                </motion.a>
              </div>

              {/* Tagline card */}
              <TiltCard className="bg-white/60 backdrop-blur-sm border border-[#e8e3dc] shadow-lg" intensity={0.5}>
                <div className="p-10 flex flex-col items-center gap-4 text-center">
                  <Star className="w-6 h-6 text-[#8f877d]" />
                  <p className="text-2xl md:text-3xl font-serif text-gray-900 leading-tight">Crafted for Nightly Ritual</p>
                  <Star className="w-6 h-6 text-[#8f877d]" />
                  <div className="w-16 h-px bg-[#d8d1c8] mt-2" />
                  <p className="text-sm text-[#8f877d] tracking-[0.2em] uppercase">REMsleep</p>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </section>

      </main>

      {/* Footer stub — replace with <StoreFooter /> */}
      <footer className="border-t border-[#e8e3dc] px-8 md:px-16 xl:px-24 py-10 bg-[#F2EDE8]">
        <p className="text-sm text-[#8f877d] tracking-[0.2em] uppercase">REMsleep — Crafted for Nightly Ritual</p>
      </footer>

      <StoreFooter/>
    </div>
  );
}

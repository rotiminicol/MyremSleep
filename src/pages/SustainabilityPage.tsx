import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Leaf, Package, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { StoreFooter } from '@/components/store/StoreFooter';
import { SimpleBackButton } from '@/components/SimpleBackButton';


// ── Tilt Card ──────────────────────────────────────────────────────────────
function TiltCard({ children, className = '', intensity = 1 }) {
  const ref = useRef(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7 * intensity, -7 * intensity]), { stiffness: 100, damping: 22 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-9 * intensity, 9 * intensity]), { stiffness: 100, damping: 22 });

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

// ── Check Item ─────────────────────────────────────────────────────────────
function CheckItem({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay }}
      viewport={{ once: true }}
      className="flex items-start gap-4"
    >
      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-800/10 flex items-center justify-center mt-0.5">
        <CheckCircle className="w-4 h-4 text-green-700" />
      </div>
      <p className="text-[17px] md:text-lg text-gray-600 leading-[1.85]">{children}</p>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function SustainabilityPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.18, 0.28], [1, 1, 0]);
  const heroScale  = useTransform(scrollYProgress, [0, 0.28], [1, 0.97]);
  const heroY      = useTransform(scrollYProgress, [0, 0.28], [0, -40]);
  const blob1Y     = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const blob2Y     = useTransform(scrollYProgress, [0, 1], [0, -130]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f5f1ed] flex flex-col overflow-x-hidden font-['Georgia',serif]">

      {/* ── Ambient Background ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div
          className="absolute top-0 left-0 w-[700px] h-[700px] bg-[#dce8dc] rounded-full blur-[120px] opacity-30"
          style={{ y: blob1Y }}
          animate={{ x: [0, 80, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 32, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#d4ccc3] rounded-full blur-[100px] opacity-30"
          style={{ y: blob2Y }}
          animate={{ x: [0, -100, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 38, repeat: Infinity, ease: 'easeInOut', delay: 6 }}
        />
      </div>
      <SimpleBackButton/>
      <main className="flex-grow relative z-10">

        {/* ══════════════════════════════════════════
            HERO
        ══════════════════════════════════════════ */}
        <motion.section
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="px-8 md:px-16 xl:px-24 pt-28 pb-40 md:pb-56 max-w-[1400px] mx-auto relative"
        >
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[820px]"
          >
            <span className="text-xs tracking-[0.4em] text-[#8f877d] block mb-5 uppercase font-medium">
              Sustainability
            </span>
            <h1 className="text-[clamp(48px,8vw,110px)] font-serif text-gray-900 leading-none tracking-tight mb-8">
              Sustainability at REMsleep
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 font-light leading-[1.7]">
              Quiet luxury that feels good — on your skin, in your home, and for the world we share.
            </p>
          </motion.div>

          {/* Decorative leaf */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
            animate={{ opacity: 0.07, scale: 1, rotate: 0 }}
            transition={{ duration: 1.6, delay: 0.4 }}
            className="absolute right-8 md:right-24 top-20 pointer-events-none"
          >
            <Leaf className="w-64 h-64 md:w-96 md:h-96 text-green-900" />
          </motion.div>
        </motion.section>

        {/* ══════════════════════════════════════════
            PHILOSOPHY
        ══════════════════════════════════════════ */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto mb-0">
          <Divider />
          <div className="pt-16 md:pt-24 grid lg:grid-cols-[1fr_1.4fr] gap-16 md:gap-24 items-start">

            {/* Left: sticky label */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-28 self-start space-y-4"
            >
              <div className="w-12 h-12 bg-[#e2ebe2] rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-green-800" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight">
                Our Philosophy
              </h2>
              <div className="w-8 h-px bg-[#d8d1c8]" />
              <p className="text-sm text-[#8f877d] leading-relaxed">
                Built to last many years, not seasons.
              </p>
            </motion.div>

            {/* Right: content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8 pb-24 md:pb-32"
            >
              <p className="text-[17px] md:text-lg text-gray-600 leading-[1.85]">
                Quiet luxury should feel good in every sense — soft against the skin, calming in the bedroom, and responsible in its making. We focus on longevity: durable Egyptian cotton sateen, thoughtful construction, timeless neutrals built to last many years, not seasons.
              </p>

              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'Longevity', desc: 'Made to outlast trends and seasons.' },
                  { label: 'Quality', desc: 'Egyptian cotton sateen, done properly.' },
                  { label: 'Timeless', desc: 'Calm neutrals that never date.' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: i * 0.12 }}
                    viewport={{ once: true }}
                  >
                    <TiltCard className="bg-white/60 border border-[#e8e3dc] shadow-md" intensity={0.6}>
                      <div className="p-6">
                        <CheckCircle className="w-5 h-5 text-green-700 mb-3" />
                        <p className="font-serif text-gray-900 text-[17px] mb-2">{item.label}</p>
                        <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            HERO IMAGE — FULL WIDTH
        ══════════════════════════════════════════ */}
        <div className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto mb-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <TiltCard className="shadow-xl" intensity={0.3}>
              <div className="aspect-[21/8]">
                <img
                  src="https://www.pureparima.com/cdn/shop/files/Silken_Sateen_Oyster_Q_Duvet_Set-side_1_59a7f1dd-756d-4cd9-8a06-22720ad6840a.png?v=1769722845"
                  alt="Sustainable Egyptian cotton bedding"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/25 to-transparent" />
                <div className="absolute inset-0 flex items-end p-8 md:p-12">
                  <p className="text-white/80 text-sm tracking-[0.3em] uppercase">100% Egyptian Cotton Sateen</p>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>

        {/* ══════════════════════════════════════════
            MANUFACTURING
        ══════════════════════════════════════════ */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto mt-0">
          <div className="pt-16 md:pt-24">
            <Divider />
          </div>
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 md:gap-24 items-start pt-16 md:pt-24 pb-24 md:pb-32">

            {/* Left: sticky */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-28 self-start space-y-4"
            >
              <div className="w-12 h-12 bg-[#e2ebe2] rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-green-800" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight">
                Our Manufacturing
              </h2>
              <div className="w-8 h-px bg-[#d8d1c8]" />
              <div className="flex items-center gap-2 bg-[#ece8e2] px-4 py-3 rounded-full w-fit">
                <Users className="w-4 h-4 text-gray-700" />
                <span className="text-sm text-gray-700 font-medium">Three Generations of Craft</span>
              </div>
            </motion.div>

            {/* Right: content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <p className="text-[17px] md:text-lg text-gray-600 leading-[1.85]">
                REMsleep is produced in a single, family-run specialist factory in China with three generations of bedding expertise. We selected this partner for their consistent craftsmanship, attention to detail, and shared values around quality and responsibility.
              </p>

              <div className="space-y-4">
                <CheckItem delay={0}>One dedicated specialist partner factory — not a rotating network of suppliers.</CheckItem>
                <CheckItem delay={0.1}>Long-term partnership built on trust, continuous improvement, and consistent workmanship.</CheckItem>
                <CheckItem delay={0.2}>Regularly verified standards: fair working conditions and no forced labour.</CheckItem>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            PACKAGING
        ══════════════════════════════════════════ */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto">
          <Divider />
          <div className="grid lg:grid-cols-[1fr_1.4fr] gap-16 md:gap-24 items-start pt-16 md:pt-24 pb-24 md:pb-32">

            {/* Left: sticky */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-28 self-start space-y-4"
            >
              <div className="w-12 h-12 bg-[#e2ebe2] rounded-full flex items-center justify-center">
                <Package className="w-6 h-6 text-green-800" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight">
                Packaging
              </h2>
              <div className="w-8 h-px bg-[#d8d1c8]" />
            </motion.div>

            {/* Right: content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <p className="text-[17px] md:text-lg text-gray-600 leading-[1.85]">
                Orders ship in 100% recyclable paper bags made from responsibly sourced materials. We keep packaging minimal and practical — easy to reuse or recycle — so the focus stays on the product, not excess.
              </p>

              <div className="grid sm:grid-cols-3 gap-4">
                {['Recyclable', 'Responsible', 'Minimal'].map((label, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: i * 0.12 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-3 bg-white/60 border border-[#e8e3dc] rounded-xl px-5 py-4"
                  >
                    <CheckCircle className="w-4 h-4 text-green-700 flex-shrink-0" />
                    <span className="text-[15px] font-medium text-gray-700">{label}</span>
                  </motion.div>
                ))}
              </div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.3 }}
                viewport={{ once: true }}
                className="pt-4"
              >
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-800 to-green-900 px-8 py-4 rounded-full shadow-lg">
                  <Leaf className="w-5 h-5 text-white" />
                  <span className="text-white text-base font-medium tracking-wide">Thoughtfully Made</span>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════════
            CTA
        ══════════════════════════════════════════ */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto mb-20 md:mb-28">
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
                    <span className="text-xs tracking-[0.4em] text-gray-400 block mb-5 uppercase font-medium">
                      Sustainable Luxury
                    </span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-tight mb-5">
                      Choose Lasting Design
                    </h2>
                    <p className="text-lg text-gray-400 leading-relaxed max-w-lg">
                      Egyptian cotton sateen crafted to feel exceptional every night — and made to last.
                    </p>
                  </div>
                  <motion.a
                    href="/product/winter-cloud"
                    whileHover={{ scale: 1.05, x: 3 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex-shrink-0 inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase shadow-lg whitespace-nowrap"
                  >
                    Shop Bundle Sets
                    <ArrowRight className="w-4 h-4" />
                  </motion.a>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </section>
      </main>

      {/* Footer stub */}
      <footer className="border-t border-[#e8e3dc] px-8 md:px-16 xl:px-24 py-10 bg-[#f5f1ed]">
        <p className="text-sm text-[#8f877d] tracking-[0.2em] uppercase">REMsleep — Crafted for Nightly Ritual</p>
      </footer>
      <StoreFooter/>
    </div>
  );
}
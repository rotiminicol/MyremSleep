import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ArrowRight, Leaf, Feather } from 'lucide-react';
import { StoreFooter } from '@/components/store/StoreFooter';
import { SimpleBackButton } from '@/components/SimpleBackButton';

function TiltCard({ children, className = '', intensity = 1 }) {
  const ref = useRef(null);
  const [isDesktop, setIsDesktop] = useState(true);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [7 * intensity, -7 * intensity]), { stiffness: 100, damping: 22 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-9 * intensity, 9 * intensity]), { stiffness: 100, damping: 22 });

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

function Divider() {
  return (
    <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true }} style={{ originX: 0 }} className="w-full h-px bg-[#d8d1c8]" />
  );
}

const sections = [
  {
    label: 'What is sateen?',
    body: [
      'Sateen is a weave technique — not a fibre — that floats more yarns across the surface of the fabric. This creates the signature qualities: an exceptionally smooth hand-feel, a fluid drape, and a subtle, sophisticated sheen that looks quietly luxurious without ever feeling shiny or artificial.',
    ],
    image: { src: 'https://m.media-amazon.com/images/I/71OcIWVV0qL.jpg', alt: 'Close-up of smooth Egyptian cotton sateen fabric texture' },
  },
  {
    label: 'What does 300 thread count mean?',
    body: [
      'Thread count measures yarns per square inch — a higher number can suggest density, but it\'s far from the full story. True quality lives in fibre length (long-staple Egyptian cotton), precise weave construction, and careful finishing processes.',
      'At 300 thread count, we hit the ideal balance: luxurious smoothness and breathability without unnecessary weight or heat retention. The result is bedding that drapes beautifully, softens over time, and maintains its refined appearance wash after wash.',
    ],
  },
  {
    label: 'Sateen vs Percale',
    body: [
      'Percale uses a plain, one-over-one-under weave for a crisp, matte, highly breathable feel — perfect if you sleep hot and love that fresh, hotel-sheet snap.',
      'Sateen floats yarns across the surface for silkier smoothness, richer drape, and a gentle luminous finish that feels more enveloping and calm.',
    ],
    image: { src: 'https://bedroommood.com/media/bf/cf/65/1754477797/Bedroommood%20percale%20and%20sateen%20bedding%20comparison.webp', alt: 'Side-by-side comparison: percale vs sateen' },
  },
];

export default function MaterialsPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18, 0.28], [1, 1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.28], [1, 0.97]);
  const heroY = useTransform(scrollYProgress, [0, 0.28], [0, -40]);
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, -130]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f5f1ed] flex flex-col overflow-x-hidden font-['Georgia',serif]">
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div className="absolute top-0 left-0 w-[700px] h-[700px] bg-[#e8e3dc] rounded-full blur-[120px] opacity-35" style={{ y: blob1Y }} animate={{ x: [0, 80, 0], scale: [1, 1.1, 1] }} transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#d4ccc3] rounded-full blur-[100px] opacity-30" style={{ y: blob2Y }} animate={{ x: [0, -100, 0], scale: [1, 1.08, 1] }} transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut', delay: 5 }} />
      </div>
      <SimpleBackButton/>

      <main className="flex-grow relative z-10">

        {/* ── HERO ── */}
        <motion.section style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative px-8 md:px-16 xl:px-24 pt-28 pb-40 md:pb-56 max-w-[1400px] mx-auto overflow-hidden">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="max-w-[820px] relative z-10">
            <span className="text-xs tracking-[0.4em] text-[#8f877d] block mb-5 uppercase font-medium">Materials</span>
            <h1 className="text-[clamp(48px,8vw,110px)] font-serif text-gray-900 leading-none tracking-tight mb-8">Materials</h1>
            <p className="text-xl md:text-2xl text-gray-500 font-light leading-[1.7]">Clean, natural, considered — nothing more, nothing less.</p>
          </motion.div>
          {/* Decorative icon — consistent with other pages */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: 20 }}
            animate={{ opacity: 0.06, scale: 1, rotate: 0 }}
            transition={{ duration: 1.6, delay: 0.4 }}
            className="absolute right-8 md:right-24 top-16 pointer-events-none"
          >
            <Feather className="w-64 h-64 md:w-[380px] md:h-[380px] text-gray-900" />
          </motion.div>
        </motion.section>

        {/* ── INTRO ── */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto">
          <Divider />
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 md:gap-24 items-start pt-16 md:pt-24 pb-24 md:pb-32">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }} className="lg:sticky lg:top-28 self-start space-y-4">
              <div className="w-12 h-12 bg-[#ece8e2] rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-gray-800" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight">Our Material</h2>
              <div className="w-8 h-px bg-[#d8d1c8]" />
              <div className="flex items-center gap-2 bg-[#ece8e2] px-4 py-3 rounded-full w-fit">
                <Leaf className="w-4 h-4 text-gray-700" />
                <span className="text-sm text-gray-700 font-medium">Three Generations of Craft</span>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} viewport={{ once: true }} className="space-y-6">
              <p className="text-[17px] md:text-lg text-gray-600 leading-[1.85]">
                We begin with what truly matters: long-staple natural fibres, a balanced weave, and a finish engineered for lasting beauty. REMsleep bundle sets are crafted from 100% Egyptian cotton in a 300 thread count sateen weave — buttery smooth against the skin, naturally breathable night after night, with a quiet, elegant sheen that elevates the entire bed without effort.
              </p>
              <p className="text-[17px] md:text-lg text-gray-600 leading-[1.85]">
                Our bedding is produced by a single family-run specialist factory with three generations of cotton weaving expertise. The emphasis is unwavering consistency: colours that remain grounded season after season, stitching that holds sharp, and a hand-feel that improves gently with time — so your bed feels as considered on year three as it did on day one.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── HERO IMAGE ── */}
        <div className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
            <TiltCard className="shadow-xl" intensity={0.3}>
              <div className="aspect-[21/8]">
                <img src="https://cdn.mos.cms.futurecdn.net/HFBixW68LUUzvzNRRGM9hd.png" alt="Luxury Egyptian cotton sateen bedding in calm setting" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-end p-8 md:p-12">
                  <p className="text-white/80 text-sm tracking-[0.3em] uppercase">300 Thread Count Sateen Weave</p>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>

        {/* ── FAQ SECTIONS ── */}
        {sections.map((sec, idx) => (
          <section key={idx} className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto">
            <div className="pt-16 md:pt-20"><Divider /></div>
            <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 md:gap-24 items-start pt-16 md:pt-24 pb-24 md:pb-32">

              {/* Sticky label */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }} className="lg:sticky lg:top-28 self-start space-y-3">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-gray-900 leading-tight">{sec.label}</h2>
                <div className="w-8 h-px bg-[#d8d1c8]" />
              </motion.div>

              {/* Content */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} viewport={{ once: true }} className="space-y-6">
                {sec.body.map((p, i) => (
                  <p key={i} className="text-[17px] md:text-lg text-gray-600 leading-[1.85]">{p}</p>
                ))}
                {sec.image && (
                  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }} viewport={{ once: true }}>
                    <TiltCard className="shadow-lg mt-4" intensity={0.5}>
                      <div className="aspect-[16/10]">
                        <img src={sec.image.src} alt={sec.image.alt} className="w-full h-full object-cover" loading="lazy" />
                      </div>
                    </TiltCard>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </section>
        ))}

        {/* ── CTA ── */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto mb-20 md:mb-28">
          <Divider />
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }} className="pt-16 md:pt-20">
            <TiltCard className="shadow-2xl" intensity={0.4}>
              <div className="bg-gradient-to-br from-[#2c2c2c] to-[#111] p-12 md:p-16 lg:p-20">
                <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">
                  <div>
                    <span className="text-xs tracking-[0.4em] text-gray-400 block mb-5 uppercase font-medium">Experience the Materials</span>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-tight mb-5">Feel the Difference</h2>
                    <p className="text-lg text-gray-400 leading-relaxed max-w-lg">Egyptian cotton sateen that softens with every wash, drapes beautifully, and lasts for years.</p>
                  </div>
                  <motion.a href="/product/winter-cloud" whileHover={{ scale: 1.05, x: 3 }} whileTap={{ scale: 0.97 }}
                    className="flex-shrink-0 inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase shadow-lg whitespace-nowrap">
                    Shop Bundle Sets <ArrowRight className="w-4 h-4" />
                  </motion.a>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-[#e8e3dc] px-8 md:px-16 xl:px-24 py-10 bg-[#f5f1ed]">
        <p className="text-sm text-[#8f877d] tracking-[0.2em] uppercase">REMsleep — Crafted for Nightly Ritual</p>
      </footer>

      <StoreFooter/>
    </div>
  );
}
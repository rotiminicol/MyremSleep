import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { StoreFooter } from '@/components/store/StoreFooter';
import { StoreNavbar } from '@/components/store/StoreNavbar';

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

const values = [
  {
    number: '01',
    title: 'Calm Over Clutter',
    body: 'Seasonless colour. Clean lines. Quiet luxe Bundle Sets that make the bedroom feel like a sanctuary — softening the day, night after night. We design everything to reduce decisions, not multiply them.',
  },
  {
    number: '02',
    title: 'Proof Over Hype',
    body: 'We let the fabric do the talking: Egyptian cotton sateen bundle sets with a considered weave, tested wear, and details you feel from the first night. Smooth, breathable, and quietly polished. No noise. No exaggeration.',
  },
  {
    number: '03',
    title: 'Materials That Earn Their Place',
    body: '100% Egyptian cotton, chosen for comfort and longevity — so your sateen wears beautifully and stays in rotation, season after season. Every thread is there for a reason.',
  },
];

export default function CoreValuesPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18, 0.28], [1, 1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.28], [1, 0.97]);
  const heroY = useTransform(scrollYProgress, [0, 0.28], [0, -40]);
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, -130]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#f2e9dc] flex flex-col overflow-x-hidden font-['Georgia',serif]">
      <StoreNavbar />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <motion.div className="absolute top-0 left-0 w-[700px] h-[700px] bg-[#e8e3dc] rounded-full blur-[120px] opacity-35" style={{ y: blob1Y }} animate={{ x: [0, 80, 0], scale: [1, 1.1, 1] }} transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#d4ccc3] rounded-full blur-[100px] opacity-30" style={{ y: blob2Y }} animate={{ x: [0, -100, 0], scale: [1, 1.08, 1] }} transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut', delay: 5 }} />
      </div>

      <main className="flex-grow relative z-10">
        {/* ── HERO ── */}
        <motion.section style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="px-8 md:px-16 xl:px-24 pt-28 pb-40 md:pb-56 max-w-[1400px] mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="max-w-[820px]">
            <span className="text-xs tracking-[0.4em] text-[#8f877d] block mb-5 uppercase font-medium">Our Core Values</span>
            <h1 className="text-[clamp(48px,8vw,110px)] font-serif text-gray-900 leading-none tracking-tight mb-8">Guiding Principles</h1>
            <p className="text-xl md:text-2xl text-gray-500 font-light leading-[1.7]">The foundation of everything we create at REMsleep.</p>
          </motion.div>

          {/* Decorative large number */}
          <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 0.05, x: 0 }} transition={{ duration: 1.4, delay: 0.4 }}
            className="absolute right-8 md:right-24 top-20 text-[240px] md:text-[360px] font-serif text-gray-900 leading-none select-none pointer-events-none">
            ✦
          </motion.div>
        </motion.section>

        {/* ── VALUES ── */}
        {values.map((val, idx) => (
          <section key={idx} className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto">
            <Divider />
            <div className="grid lg:grid-cols-[280px_1fr] gap-12 md:gap-20 items-start pt-16 md:pt-20 pb-20 md:pb-28">

              {/* Left: number + title */}
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }} className="lg:sticky lg:top-28 self-start space-y-3">
                <span className="text-[80px] md:text-[100px] font-serif text-[#d8d1c8] leading-none block">{val.number}</span>
                <h2 className="text-2xl md:text-3xl font-serif text-gray-900 leading-tight -mt-2">{val.title}</h2>
                <div className="w-8 h-px bg-[#d8d1c8]" />
              </motion.div>

              {/* Right: body */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} viewport={{ once: true }} className="pt-4 lg:pt-10">
                <p className="text-[17px] md:text-xl text-gray-600 leading-[1.9]">{val.body}</p>
              </motion.div>
            </div>
          </section>
        ))}

        {/* ── CLOSING STATEMENT ── */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto">
          <Divider />
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }} className="pt-16 md:pt-20 pb-20 md:pb-24">
            <TiltCard className="shadow-md" intensity={0.4}>
              <div className="bg-gradient-to-br from-[#2c2c2c] to-[#111] p-12 md:p-16 lg:p-20 text-center">
                <div className="text-6xl text-white/15 font-serif leading-none mb-6">"</div>
                <p className="text-2xl md:text-3xl font-serif text-white leading-[1.6] max-w-3xl mx-auto mb-8">
                  We believe comfort is not "extra". It is essential.
                </p>
                <div className="w-24 h-px bg-white/20 mx-auto" />
              </div>
            </TiltCard>
          </motion.div>
        </section>

        {/* ── CTA ── */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto mb-20 md:mb-28">
          <Divider />
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }}
            className="pt-16 md:pt-20 grid lg:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <span className="text-xs tracking-[0.4em] text-[#8f877d] block mb-4 uppercase font-medium">Experience the Difference</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight">Feel the Quality</h2>
            </div>
            <motion.a href="/product/winter-cloud" whileHover={{ scale: 1.05, x: 3 }} whileTap={{ scale: 0.97 }}
              className="flex-shrink-0 inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase shadow-lg whitespace-nowrap">
              Shop Bundle Sets <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-[#e8e3dc] px-8 md:px-16 xl:px-24 py-10 bg-[#f2e9dc]">
        <p className="text-sm text-[#8f877d] tracking-[0.2em] uppercase">REMsleep — Crafted for Nightly Ritual</p>
      </footer>
      <StoreFooter/>
    </div>
  );
}
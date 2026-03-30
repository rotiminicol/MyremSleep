import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ArrowRight, Award, CheckCircle } from 'lucide-react';
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
    <motion.div
      ref={ref} onMouseMove={onMove} onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX: isDesktop ? rotateX : 0, rotateY: isDesktop ? rotateY : 0, transformStyle: 'preserve-3d', perspective: '1100px' }}
      className={`relative rounded-2xl overflow-hidden transition-shadow duration-500 ${className}`}
    >{children}</motion.div>
  );
}

function Divider() {
  return (
    <motion.div
      initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }} style={{ originX: 0 }}
      className="w-full h-px bg-[#d8d1c8]"
    />
  );
}

export default function QualityPromisePage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18, 0.28], [1, 1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.28], [1, 0.97]);
  const heroY = useTransform(scrollYProgress, [0, 0.28], [0, -40]);
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, -130]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F2EDE8] flex flex-col overflow-x-hidden font-['Georgia',serif]">
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
            <span className="text-xs tracking-[0.4em] text-[#8f877d] block mb-5 uppercase font-medium">Quality Promise</span>
            <h1 className="text-[clamp(48px,8vw,110px)] font-serif text-gray-900 leading-none tracking-tight mb-8">
              The REMsleep Quality Promise
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 font-light leading-[1.7]">
              Our commitment to excellence  in every thread, every stitch, every night.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 0.06, scale: 1 }} transition={{ duration: 1.6, delay: 0.5 }} className="absolute right-8 md:right-24 top-20 pointer-events-none">
            <Award className="w-64 h-64 md:w-96 md:h-96 text-gray-900" />
          </motion.div>
        </motion.section>

        {/* ── MATERIALS BY FEEL ── */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto">
          <Divider />
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 md:gap-24 items-start pt-16 md:pt-24 pb-24 md:pb-32">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }} className="lg:sticky lg:top-28 self-start space-y-4">
              <div className="w-12 h-12 bg-[#ece8e2] rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-gray-800" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight">Materials by Feel First</h2>
              <div className="w-8 h-px bg-[#d8d1c8]" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} viewport={{ once: true }} className="space-y-8">
              <p className="text-[17px] md:text-lg text-gray-600 leading-[1.85]">
                We prioritize how the fabric feels against skin  then rigorously test for long-term durability, wash performance, and nightly comfort. Our 100% Egyptian cotton sateen is crafted to improve with age: it softens gently over washes while retaining its smooth drape and subtle sheen.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { label: 'Durability Tested', desc: 'Engineered for repeated washing without degrading.' },
                  { label: 'Wash After Wash', desc: 'Softens and improves with every cycle.' },
                  { label: 'Everyday Comfort', desc: 'Breathable, smooth, and temperature-balanced.' },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: i * 0.1 }} viewport={{ once: true }}>
                    <TiltCard className="bg-white/60 border border-[#e8e3dc] shadow-md" intensity={0.6}>
                      <div className="p-6">
                        <CheckCircle className="w-5 h-5 text-green-700 mb-3" />
                        <p className="font-serif text-gray-900 text-[16px] mb-2">{item.label}</p>
                        <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── WIDE IMAGE ── */}
        <div className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} viewport={{ once: true }}>
            <TiltCard className="shadow-xl" intensity={0.3}>
              <div className="aspect-[21/8]">
                <img src="https://www.pureparima.com/cdn/shop/files/Triple_Luxe_Side_bde32881-e373-4acb-8c8f-caa30feba61e.jpg?v=1770341022" alt="Luxury Egyptian cotton sateen bedding  perfectly made neutral bed" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-end p-8 md:p-12">
                  <p className="text-white/80 text-sm tracking-[0.3em] uppercase">100% Egyptian Cotton Sateen</p>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>

        {/* ── CLEAN CONSTRUCTION ── */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto">
          <div className="pt-16 md:pt-20"><Divider /></div>
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 md:gap-24 items-start pt-16 md:pt-24 pb-24 md:pb-32">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }} className="lg:sticky lg:top-28 self-start space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight">Clean Construction</h2>
              <div className="w-8 h-px bg-[#d8d1c8]" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} viewport={{ once: true }} className="space-y-10">
              <p className="text-[17px] md:text-lg text-gray-600 leading-[1.85]">
                We collaborate closely with our makers on precise, intentional details  from reinforced stitching and thoughtful closures to balanced proportions that ensure elegant drape and a consistently polished look, night after night.
              </p>

              <div className="space-y-4">
                {[
                  { title: 'Stitching', desc: 'Sharp, reinforced seams built to endure  no fraying, no unravelling.' },
                  { title: 'Closures', desc: 'Secure, discreet, and easy to use every single night.' },
                  { title: 'Proportions', desc: 'Perfectly scaled for beautiful drape on every bed size.' },
                ].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: i * 0.1 }} viewport={{ once: true }}
                    className="flex gap-5 p-5 rounded-xl bg-white/60 border border-[#e8e3dc]">
                    <div className="w-8 h-8 flex-shrink-0 rounded-full bg-gray-900 flex items-center justify-center mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-serif text-gray-900 text-[17px] mb-1">{item.title}</p>
                      <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Close-up detail image */}
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.3 }} viewport={{ once: true }}>
                <TiltCard className="shadow-lg" intensity={0.5}>
                  <div className="aspect-[16/9]">
                    <img src="https://parachutehome.com/cdn/shop/files/sateen-pillowcase-set_white_studio_2834__1_7e729ab5-c8d7-4e28-a636-0a5e3bd3f515.jpg?v=1770757935" alt="Premium sateen pillowcase  close-up of clean stitching and quality finish" className="w-full h-full object-cover" loading="lazy" />
                  </div>
                </TiltCard>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto mb-20 md:mb-28">
          <Divider />
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }} className="pt-16 md:pt-20">
            <TiltCard className="shadow-2xl" intensity={0.4}>
              <div className="bg-gradient-to-br from-[#2c2c2c] to-[#111] p-12 md:p-16 lg:p-20">
                <div className="grid lg:grid-cols-[1fr_auto] gap-10 items-center">
                  <div>
                    <div className="inline-flex items-center gap-3 bg-white/10 px-5 py-2 rounded-full mb-6">
                      <Award className="w-4 h-4 text-white" />
                      <span className="text-white/80 text-xs tracking-[0.2em] uppercase">Quality Tested & Approved</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-white leading-tight mb-4">Feel the Difference</h2>
                    <p className="text-lg text-gray-400 leading-relaxed max-w-lg">Experience Egyptian cotton sateen crafted to feel exceptional from the very first night.</p>
                  </div>
                  <motion.a href="/product/sateen-bedding-set-winter-cloud" whileHover={{ scale: 1.05, x: 3 }} whileTap={{ scale: 0.97 }}
                    className="flex-shrink-0 inline-flex items-center gap-3 bg-white text-gray-900 px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase shadow-lg whitespace-nowrap">
                    Shop Bundle Sets <ArrowRight className="w-4 h-4" />
                  </motion.a>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-[#e8e3dc] px-8 md:px-16 xl:px-24 py-10 bg-[#F2EDE8]">
        <p className="text-sm text-[#8f877d] tracking-[0.2em] uppercase">REMsleep  Crafted for Nightly Ritual</p>
      </footer>

      <StoreFooter/>
    </div>
  );
}

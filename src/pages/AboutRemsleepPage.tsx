import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Heart, ArrowRight, CheckCircle, Moon } from 'lucide-react';
import { StoreFooter } from '@/components/store/StoreFooter';
import { StoreNavbar } from '@/components/store/StoreNavbar';
import { useNavigate } from 'react-router-dom';

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

const colors = [
  { name: 'Winter Cloud', hex: '#FFFFFF', handle: 'sateen-bedding-set-winter-cloud' },
  { name: 'Desert Whisperer', hex: '#E6C9A8', handle: 'sateen-bedding-set-desert-whisperer' },
  { name: 'Buttermilk', hex: '#FBF3DB', handle: 'sateen-bedding-set-buttermilk' },
  { name: 'Clay Blush', hex: '#AF8C82', handle: 'sateen-bedding-set-clay-blush' },
  { name: 'Pebble Haze', hex: '#9D9D9D', handle: 'sateen-bedding-set-pebble-haze' },
  { name: 'Desert Sand', hex: '#C3874D', handle: 'sateen-bedding-set-desert-sand' },
  { name: 'Cinnamon Bark', hex: '#875C32', handle: 'sateen-bedding-set-cinnamon-bark' },
];

const bundleBenefits = [
  'You do not need to add extras to get the look you want.',
  'You do not need to chase matching whites.',
  'You do not need to build a set piece by piece.',
];

export default function AboutRemsleepPage() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.18, 0.28], [1, 1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.28], [1, 0.97]);
  const heroY = useTransform(scrollYProgress, [0, 0.28], [0, -40]);
  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, -130]);

  const handleColorClick = (colorHandle: string) => {
    navigate(`/product/${colorHandle}`);
  };

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
          className="relative px-8 md:px-16 xl:px-24 pt-28 pb-40 md:pb-56 max-w-[1400px] mx-auto overflow-hidden">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="max-w-[820px] relative z-10">
            <span className="text-xs tracking-[0.4em] text-[#8f877d] block mb-5 uppercase font-medium">About REMsleep</span>
            <h1 className="text-[clamp(48px,8vw,110px)] font-serif text-gray-900 leading-none tracking-tight mb-8">Quiet-Luxe Bedding</h1>
            <p className="text-xl md:text-2xl text-gray-500 font-light leading-[1.7]">For people who treat the bed as essential, not an afterthought.</p>
          </motion.div>
          {/* Decorative icon  consistent with other pages */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
            animate={{ opacity: 0.06, scale: 1, rotate: 0 }}
            transition={{ duration: 1.6, delay: 0.4 }}
            className="absolute right-8 md:right-24 top-16 pointer-events-none"
          >
            <Moon className="w-64 h-64 md:w-[380px] md:h-[380px] text-gray-900" />
          </motion.div>
        </motion.section>

        {/* ── PHILOSOPHY ── */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto">
          <Divider />
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 md:gap-24 items-start pt-16 md:pt-24 pb-24 md:pb-32">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }} className="lg:sticky lg:top-28 self-start space-y-4">
              <span className="text-xs tracking-[0.4em] text-[#8f877d] uppercase font-medium">Our Philosophy</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight">Essential Comfort</h2>
              <div className="w-8 h-px bg-[#d8d1c8]" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} viewport={{ once: true }} className="space-y-8">
              <p className="text-[17px] md:text-lg text-gray-600 leading-[1.85]">
                We design for the feel, the drape, and the small details that make a room look instantly calmer. The bedroom is where your nervous system resets, your mind softens, and tomorrow starts quietly.
              </p>

              <TiltCard className="shadow-md" intensity={0.5}>
                <div className="bg-gradient-to-br from-[#2c2c2c] to-[#111] p-10 md:p-12">
                  <div className="text-5xl text-white/15 font-serif leading-none mb-4">"</div>
                  <p className="text-xl md:text-2xl font-serif text-white leading-[1.6]">We believe comfort is not "extra". It is essential.</p>
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </section>

        {/* ── MATERIALS ── */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto">
          <Divider />
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 md:gap-24 items-center pt-16 md:pt-24 pb-24 md:pb-32">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }} className="lg:sticky lg:top-28 self-start space-y-4">
              <span className="text-xs tracking-[0.4em] text-[#8f877d] uppercase font-medium">Our Materials</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight">Premium Egyptian Cotton</h2>
              <div className="w-8 h-px bg-[#d8d1c8]" />

              {/* Material badge card */}
              <TiltCard className="bg-[#ece8e2] shadow-md mt-6" intensity={0.6}>
                <div className="p-8 text-center space-y-2">
                  <div className="w-12 h-12 bg-white/60 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">✦</span>
                  </div>
                  <p className="font-serif text-gray-900 text-lg">100% Egyptian Cotton</p>
                  <p className="text-sm text-gray-500">300 Thread Count Sateen</p>
                </div>
              </TiltCard>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} viewport={{ once: true }} className="space-y-6">
              <p className="text-[17px] md:text-lg text-gray-600 leading-[1.85]">
                We launch with 100% Egyptian cotton sateen in a 300 thread count sateen weave  smooth on skin, breathable through the night, with a refined, subtle sheen.
              </p>
              <p className="text-[17px] md:text-lg text-gray-600 leading-[1.85]">
                Softer and more cocooning than crisp percale, with a finish that looks polished even when life is not.
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── COLOUR PALETTE ── */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto">
          <Divider />
          <div className="pt-16 md:pt-24 pb-24 md:pb-32">
            <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 md:gap-24 items-start">
              <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }} className="lg:sticky lg:top-28 self-start space-y-4">
                <span className="text-xs tracking-[0.4em] text-[#8f877d] uppercase font-medium">Colour Palette</span>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight">Seasonless Neutrals</h2>
                <div className="w-8 h-px bg-[#d8d1c8]" />
                <p className="text-[15px] text-gray-500 leading-relaxed">
                  Our palette is seasonless and designed to layer  modern neutrals and grounded tones that make the space feel considered the moment you walk in.
                </p>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} viewport={{ once: true }}>
                <div className="grid grid-cols-4 gap-4 md:gap-5">
                  {colors.map((color, i) => (
                    <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: i * 0.07 }} viewport={{ once: true }} className="text-center group">
                      <motion.div
                        whileHover={{ scale: 1.1, y: -4 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleColorClick(color.handle)}
                        className="w-full aspect-square rounded-xl shadow-md mb-3 border border-black/5 cursor-pointer"
                        style={{ backgroundColor: color.hex }}
                      />
                      <p className="text-xs text-gray-500 leading-tight">{color.name}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── BUNDLE SETS ── */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto">
          <Divider />
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-16 md:gap-24 items-start pt-16 md:pt-24 pb-24 md:pb-32">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }} className="lg:sticky lg:top-28 self-start space-y-4">
              <span className="text-xs tracking-[0.4em] text-[#8f877d] uppercase font-medium">Complete Sets</span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight">Actually Complete</h2>
              <div className="w-8 h-px bg-[#d8d1c8]" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }} viewport={{ once: true }} className="space-y-8">
              <p className="text-[17px] md:text-lg text-gray-600 leading-[1.85]">
                That is why we are launching with bundle sets that actually complete the bed: duvet cover, fitted sheet, and four pillowcases included. One click, and your bed is done. One set. A finished look.
              </p>

              <TiltCard className="shadow-md" intensity={0.4}>
                <div className="bg-gradient-to-br from-[#2c2c2c] to-[#111] p-10 md:p-12 space-y-5">
                  {bundleBenefits.map((b, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }} className="flex items-start gap-4">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300 text-[16px] leading-relaxed">{b}</p>
                    </motion.div>
                  ))}
                </div>
              </TiltCard>
            </motion.div>
          </div>
        </section>

        {/* ── CLOSING + CTA ── */}
        <section className="px-8 md:px-16 xl:px-24 max-w-[1400px] mx-auto mb-20 md:mb-28">
          <Divider />
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }} viewport={{ once: true }}
            className="pt-16 md:pt-20 grid lg:grid-cols-[1fr_auto] gap-10 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-5 h-5 text-[#8f877d]" />
                <span className="text-xs tracking-[0.4em] text-[#8f877d] uppercase font-medium">Rest. Renew. Awaken New Dreams.</span>
                <Heart className="w-5 h-5 text-[#8f877d]" />
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-900 leading-tight">One Click, Done.</h2>
            </div>
            <motion.a href="/product/sateen-bedding-set-winter-cloud" whileHover={{ scale: 1.05, x: 3 }} whileTap={{ scale: 0.97 }}
              className="flex-shrink-0 inline-flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase shadow-lg whitespace-nowrap">
              Shop Bundle Sets <ArrowRight className="w-4 h-4" />
            </motion.a>
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

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function StoreHero() {
  return (
    <section className="w-full">
      <div
        className="relative flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          height: '90vh',
          minHeight: '32rem',
          backgroundImage: 'url(/HeroImagebeigebedroom.png)',
          backgroundColor: '#E0D8CC',
        }}
      >
        {/* Minimal dark gradient overlay - soft and deep */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/5 via-black/20 to-black/60" />

        <motion.div
          className="relative z-10 text-center px-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Headline - dark, elegant */}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              fontWeight: 350,
              lineHeight: 1.2,
              color: '#1A1714',
              marginBottom: '1rem',
              letterSpacing: '-0.01em',
            }}
          >
            Rest is not a routine.
            <br />
            It is a ritual.
          </h1>

          {/* Sub-label - muted dark tone */}
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '0.7rem',
              fontWeight: 350,
              letterSpacing: '0.2rem',
              textTransform: 'uppercase',
              color: '#2C2824',
              marginBottom: '2.2rem',
            }}
          >
            300 thread count Egyptian cotton sateen bedding
          </p>

          {/* CTA - clean dark outline */}
          <Link
            to="/product/sateen-bedding-set-winter-cloud"
            style={{
              display: 'inline-block',
              fontFamily: "'Jost', sans-serif",
              fontSize: '0.6rem',
              fontWeight: 450,
              letterSpacing: '0.2rem',
              textTransform: 'uppercase',
              color: '#1A1714',
              textDecoration: 'none',
              padding: '0.85rem 2.8rem',
              border: '1px solid #1A1714',
              transition: 'all 0.4s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#1A1714';
              (e.currentTarget as HTMLAnchorElement).style.color = '#FAF8F5';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.color = '#1A1714';
            }}
          >
            Shop the Set
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
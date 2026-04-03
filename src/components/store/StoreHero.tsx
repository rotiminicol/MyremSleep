import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export function StoreHero() {
  return (
    <section className="w-full">
      {/* Hero  full viewport, background image, centred copy */}
      <div
        className="relative flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{
          height: '90vh',
          minHeight: '32rem',
          backgroundImage: 'url(/steven-ungermann-0dAXtVhtBgg-unsplash.jpg)',
          backgroundColor: '#E0D8CC', // fallback color
        }}
      >
        <div className="absolute inset-0 bg-black/10 z-0" /> {/* Slight overlay for text readability */}
        <motion.div
          className="text-center z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Headline */}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2rem, 4.5vw, 3.2rem)',
              fontWeight: 300,
              lineHeight: 1.3,
              color: '#1A1714',
              marginBottom: '1.25rem',
            }}
          >
            Rest is not a routine.
            <br />
            It is a ritual.
          </h1>

          {/* Sub-label */}
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: '0.75rem',
              fontWeight: 300,
              letterSpacing: '0.18rem',
              textTransform: 'uppercase',
              color: '#8A7E74',
              marginBottom: '2.5rem',
            }}
          >
            300 thread count Egyptian cotton sateen bedding
          </p>

          {/* CTA */}
          <Link
            to="/product/sateen-bedding-set-winter-cloud"
            style={{
              display: 'inline-block',
              fontFamily: "'Jost', sans-serif",
              fontSize: '0.625rem',
              fontWeight: 400,
              letterSpacing: '0.18rem',
              textTransform: 'uppercase',
              color: '#2C2824',
              textDecoration: 'none',
              padding: '0.9rem 2.5rem',
              border: '0.0625rem solid #2C2824',
              transition: 'all 0.35s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#2C2824';
              (e.currentTarget as HTMLAnchorElement).style.color = '#FAF8F5';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.color = '#2C2824';
            }}
          >
            Shop Bundle
          </Link>
        </motion.div>
      </div>

    </section>
  );
}
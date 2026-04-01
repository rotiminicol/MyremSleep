import { Link } from 'react-router-dom';

export function StoreBelief() {
  return (
    <section
      className="w-full flex items-center justify-center text-center"
      style={{ padding: 'clamp(3.5rem, 8vw, 7rem) clamp(1.5rem, 5vw, 3rem)' }}
    >
      <p
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(1.2rem, 2.2vw, 1.6rem)',
          fontWeight: 300,
          lineHeight: 1.85,
          color: '#2C2824',
          maxWidth: '34rem',
          margin: '0 auto',
        }}
      >
        We make one product, made well  sateen bedding designed to feel as intentional as the ritual around it.
      </p>
    </section>
  );
}

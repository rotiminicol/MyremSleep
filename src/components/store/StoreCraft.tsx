import { Link } from 'react-router-dom';

export function StoreCraft() {
  return (
    <section style={{ background: '#FAF8F5' }}>

      {/* ── Fabric Detail ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 20rem), 1fr))',
          minHeight: '32rem',
        }}
      >
        {/* Image */}
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: 'linear-gradient(155deg, #D8CFC2, #C8BBAB, #D2C8BA)',
            minHeight: '18rem',
          }}
        >
          <img
            src="/fabric-detail.png"
            alt="Close-up of sateen fabric texture"
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
          />
          <span
            style={{
              position: 'absolute',
              bottom: '1.25rem',
              left: '1.25rem',
              fontSize: '0.55rem',
              letterSpacing: '0.12rem',
              textTransform: 'uppercase',
              color: '#B8ADA2',
              fontFamily: "'Jost', sans-serif",
              fontWeight: 300,
            }}
          >
            Close-up fabric texture
          </span>
        </div>

        {/* Copy */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(2rem, 6vw, 5rem)',
            background: '#FAF8F5',
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
              fontWeight: 300,
              lineHeight: 1.35,
              color: '#1A1714',
              marginBottom: '1.75rem',
            }}
          >
            Sateen, not percale.
          </h2>
          <p
            style={{
              fontFamily: "'Jost', sans-serif",
              fontSize: 'clamp(0.8rem, 2vw, 0.875rem)',
              fontWeight: 300,
              lineHeight: 1.9,
              color: '#8A7E74',
              maxWidth: '24rem',
              marginBottom: '2.5rem',
            }}
          >
            A silky-smooth weave with a gentle lustre and real weight to it. Ours is 300 thread count, 100% cotton  structured enough to drape properly, soft enough to sleep in from night one. It only gets better with every wash.
          </p>
          <Link
            to="/collections/all"
            style={{
              alignSelf: 'flex-start',
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
            Shop the set
          </Link>
        </div>
      </div>

      {/* ── Divider ── */}
      <div style={{ height: '0.0625rem', background: '#E8E0D6', maxWidth: '60rem', margin: '0 auto' }} />

      {/* ── Three Qualities ── */}
      <div
        style={{
          padding: 'clamp(3rem, 8vw, 6rem) clamp(1.5rem, 5vw, 3rem)',
          maxWidth: '64rem',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 14rem), 1fr))',
          gap: 'clamp(2rem, 5vw, 3rem)',
        }}
      >
        {[
          {
            n: '01',
            title: 'The weave',
            body: 'Sateen has a four-over, one-under weave that creates a smooth surface with a subtle sheen. It feels heavier and more refined than percale  without the slippery feel of silk.',
          },
          {
            n: '02',
            title: 'The weight',
            body: '300 thread count, 100% cotton. Dense enough to drape with structure across the bed. Light enough to breathe through the night. No filler threads, no inflated counts.',
          },
          {
            n: '03',
            title: 'The long run',
            body: 'Sateen softens with every wash. The fabric relaxes, the hand feel deepens, and the lustre settles into something quieter. This bedding gets better the longer you sleep in it.',
          },
        ].map((q, i, arr) => (
          <div key={q.n}>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '0.875rem',
                fontWeight: 300,
                color: '#C4B8AA',
                marginBottom: '1.25rem',
              }}
            >
              {q.n}
            </p>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1.35rem',
                fontWeight: 300,
                color: '#1A1714',
                marginBottom: '0.875rem',
                lineHeight: 1.3,
              }}
            >
              {q.title}
            </h3>
            <p
              style={{
                fontFamily: "'Jost', sans-serif",
                fontSize: '0.8rem',
                fontWeight: 300,
                lineHeight: 1.85,
                color: '#8A7E74',
              }}
            >
              {q.body}
            </p>

            {/* Mobile-only divider between quality items */}
            {i < arr.length - 1 && (
              <div
                className="block sm:hidden"
                style={{
                  height: '0.0625rem',
                  background: '#E8E0D6',
                  marginTop: 'clamp(2rem, 5vw, 3rem)',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* ── Divider ── */}
      <div style={{ height: '0.0625rem', background: '#E8E0D6', maxWidth: '60rem', margin: '0 auto' }} />

      {/* ── Testimonial ── */}
      <div
        style={{
          padding: 'clamp(3rem, 8vw, 5.5rem) clamp(1.5rem, 5vw, 3rem)',
          background: '#F5F0EB',
          textAlign: 'center',
        }}
      >
        <blockquote
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            lineHeight: 1.8,
            color: '#2C2824',
            maxWidth: '32rem',
            margin: '0 auto 1.25rem',
          }}
        >
          "Simple design but very elegant. The quality is beautiful  I would recommend it to anyone."
        </blockquote>
        <cite
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '0.6rem',
            fontWeight: 400,
            letterSpacing: '0.18rem',
            textTransform: 'uppercase',
            color: '#C4B8AA',
            fontStyle: 'normal',
          }}
        >
          Sarah M. · Verified buyer
        </cite>
      </div>

    </section>
  );
}
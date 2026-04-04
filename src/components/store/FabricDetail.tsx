import { Link } from 'react-router-dom';

export function FabricDetail() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: 'auto',
      }}
    >
      {/* Images - Half Section with image0.png */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(155deg, #D8CFC2, #C8BBAB, #D2C8BA)',
          minHeight: '720px',
          maxHeight: '720px',
          margin: '0',
          padding: '0',
        }}
      >
        <img
          src="/image0.png"
          alt="Sateen fabric detail"
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'contain', 
            display: 'block' 
          }}
          onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
        />
      </div>

      {/* Copy - Other Half */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '3rem 2.5rem',
          background: '#FAF8F5',
          minHeight: '720px',
        }}
      >
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '2rem',
            fontWeight: 300,
            lineHeight: 1.2,
            color: '#1A1714',
            marginBottom: '0.85rem',
          }}
        >
          Sateen, not percale.
        </h2>
        <p
          style={{
            fontFamily: "'Jost', sans-serif",
            fontSize: '1rem',
            fontWeight: 300,
            lineHeight: 1.65,
            color: '#8A7E74',
            maxWidth: '24rem',
            marginBottom: '1.75rem',
          }}
        >
          A silky-smooth weave with a gentle lustre and real weight to it. Ours is 300 thread count, 100% cotton structured enough to drape properly, soft enough to sleep in from night one. It only gets better with every wash.
        </p>
        <Link
          to="/product/sateen-bedding-set-winter-cloud"
          style={{
            alignSelf: 'flex-start',
            display: 'inline-block',
            fontFamily: "'Jost', sans-serif",
            fontSize: '0.7rem',
            fontWeight: 400,
            letterSpacing: '0.18rem',
            textTransform: 'uppercase',
            color: '#2C2824',
            textDecoration: 'none',
            padding: '0.8rem 2.2rem',
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
  );
}
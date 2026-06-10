import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SPACEX_COLOR = '#005288';
const ANTHROPIC_COLOR = '#CC785C';

export default function Newsletter() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const menuRef = useRef(null);

  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
  };

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const handleSubmit = () => {
    if (!firstName.trim()) { setError('Please enter your first name.'); return; }
    if (!email.trim() || !email.includes('@')) { setError('Please enter a valid email address.'); return; }
    setError('');
    // TODO: replace with Mailchimp form action POST
    setSubmitted(true);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 28px', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 100,
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.3px' }}>
            ipo<span style={{ color: 'var(--accent)' }}>.</span>guide
          </div>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div onClick={toggleTheme} className={`theme-toggle ${dark ? 'dark' : ''}`}>
            <div className="theme-knob">{dark ? '🌙' : '☀️'}</div>
          </div>
          <button
            onMouseEnter={() => setMenuOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 5, padding: 4 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 22, height: 1.5, background: 'var(--text)' }} />
            ))}
          </button>
        </div>
      </nav>

      {/* ── DRAWER ── */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="drawer-slide"
          onMouseLeave={() => setMenuOpen(false)}
          style={{
            position: 'fixed', top: 0, right: 0, height: '100vh', width: 240,
            background: 'var(--bg)', borderLeft: '1px solid var(--border)',
            padding: '24px 20px', zIndex: 200, display: 'flex', flexDirection: 'column',
            overflowY: 'auto',
          }}>
          <button onClick={() => setMenuOpen(false)} style={{
            alignSelf: 'flex-end', background: 'none', border: 'none',
            fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)', marginBottom: 24,
          }}>✕</button>
          {[
            { label: 'Home', to: '/' },
            { label: 'Learn', to: '/learn' },
            { label: 'Risk', to: '/risk' },
            { label: 'Tools', to: '/tools' },
            { label: 'Newsletter', to: '/newsletter' },
          ].map(({ label, to }) => (
            <Link key={label} to={to} style={{
              padding: '12px 0', borderBottom: '1px solid var(--border)',
              color: label === 'Newsletter' ? 'var(--accent)' : 'var(--text-muted)',
              textDecoration: 'none', fontSize: 14,
              fontWeight: label === 'Newsletter' ? 600 : 400,
            }}>{label}</Link>
          ))}

          <div style={{ height: 1, background: 'var(--border)', margin: '20px 0' }} />
          <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1.2px', marginBottom: 12 }}>LATEST NEWS</div>
          {[
            { tag: 'SPACEX', tagBg: '#E6F1FB', tagColor: '#185FA5', title: 'SpaceX targets $1.77T valuation in historic June 12 IPO', date: 'Jun 9, 2026', url: 'https://capital.com/en-int/learn/ipo/spacex-ipo' },
            { tag: 'SPACEX', tagBg: '#E6F1FB', tagColor: '#185FA5', title: "SpaceX's historic IPO: billions in losses and Musk's massive ownership", date: 'May 20, 2026', url: 'https://www.cnbc.com/2026/05/20/spacex-ipo-live-updates.html' },
            { tag: 'ANTHROPIC', tagBg: '#FAF0EB', tagColor: '#8B4513', title: 'Anthropic files confidential IPO, targets $965B valuation', date: 'Jun 4, 2026', url: 'https://techcrunch.com/2026/06/04/ahead-of-its-ipo-anthropics-daniela-amodei-shrugs-off-doubts-about-ais-returns/' },
            { tag: 'ANTHROPIC', tagBg: '#FAF0EB', tagColor: '#8B4513', title: 'Anthropic leads IPO race against OpenAI amid AI competition', date: 'Jun 8, 2026', url: 'https://www.gurufocus.com/news/8904873/anthropic-leads-ipo-race-against-openai-amid-ai-market-competition' },
          ].map(({ tag, tagBg, tagColor, title, date, url }) => (
            <a key={title} href={url} target="_blank" rel="noreferrer" style={{
              display: 'block', marginBottom: 12, paddingBottom: 12,
              borderBottom: '1px solid var(--border)', textDecoration: 'none',
            }}>
              <div style={{ display: 'inline-block', fontSize: 8, fontWeight: 600, padding: '2px 6px', borderRadius: 4, marginBottom: 4, background: tagBg, color: tagColor }}>{tag}</div>
              <div style={{ fontSize: 11, fontWeight: 500, color: 'var(--text)', lineHeight: 1.4, marginBottom: 3 }}>{title}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)' }}>{date}</div>
            </a>
          ))}
        </div>
      )}

      {/* ── MOBILE STYLES ── */}
      <style>{`
        @media (max-width: 768px) {
          .nl-hero { padding: 32px 5% 24px !important; }
          .nl-main { padding: 24px 5% 48px !important; }
          .nl-form-row { grid-template-columns: 1fr !important; }
          .nl-cta { flex-direction: column !important; gap: 16px !important; }
          .nl-cta-btns { flex-direction: column !important; width: 100% !important; }
          .nl-cta-btns a { width: 100% !important; justify-content: center !important; }
          .nl-footer-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .nl-footer-bottom { flex-direction: column !important; gap: 8px !important; text-align: center !important; }
          nav { padding: 14px 16px !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="nl-hero" style={{ padding: '56px 8% 40px', borderBottom: '1px solid var(--border)' }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent)', letterSpacing: '1px', marginBottom: 12 }}>NEWSLETTER</p>
        <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 600, letterSpacing: '-0.5px', color: 'var(--text)', marginBottom: 10, lineHeight: 1.2 }}>
          Don't miss the moment.
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: 480 }}>
          SpaceX and Anthropic IPOs could happen any time. Get notified when it matters — no noise, just signal.
        </p>
      </section>

      {/* ── MAIN ── */}
      <main className="nl-main" style={{ padding: '48px 8% 64px' }}>

        {/* Value props */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 40 }}>
          {[
            { dot: SPACEX_COLOR, text: 'IPO date confirmed — you hear first' },
            { dot: ANTHROPIC_COLOR, text: 'Price range announced — we break it down' },
            { dot: 'var(--text-muted)', text: 'No spam, ever. Unsubscribe any time.' },
          ].map(({ dot, text }) => (
            <div key={text} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '7px 14px',
              border: '1px solid var(--border)',
              borderRadius: 20,
              background: 'var(--bg-secondary)',
            }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{text}</span>
            </div>
          ))}
        </div>

        {/* Signup form */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '32px',
          maxWidth: 560,
        }}>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: 20, marginBottom: 12 }}>✓</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>You're on the list, {firstName}.</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65 }}>
                We'll reach out when something worth knowing happens. Keep an eye on your inbox.
              </div>
            </div>
          ) : (
            <>
              <div className="nl-form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.8px', display: 'block', marginBottom: 8 }}>
                    FIRST NAME
                  </label>
                  <input
                    type="text"
                    placeholder="Henry"
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px',
                      border: '1px solid var(--border)', borderRadius: 8,
                      background: 'var(--bg)', color: 'var(--text)',
                      fontSize: 14, outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.8px', display: 'block', marginBottom: 8 }}>
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    placeholder="henry@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    style={{
                      width: '100%', padding: '10px 14px',
                      border: '1px solid var(--border)', borderRadius: 8,
                      background: 'var(--bg)', color: 'var(--text)',
                      fontSize: 14, outline: 'none',
                    }}
                  />
                </div>
              </div>

              {error && (
                <div style={{ fontSize: 12, color: '#dc2626', marginBottom: 12 }}>{error}</div>
              )}

              <button
                onClick={handleSubmit}
                className="cta-btn"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: 'var(--accent)', color: '#fff',
                  padding: '12px 22px', borderRadius: 8,
                  border: 'none', fontSize: 14, fontWeight: 500,
                  cursor: 'pointer', marginBottom: 12,
                }}
              >
                Notify me <span className="btn-arrow">→</span>
              </button>

              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                No spam. Unsubscribe any time.
              </div>
            </>
          )}
        </div>

      </main>

      {/* ── BOTTOM CTA ── */}
      <div className="nl-cta" style={{ borderTop: '1px solid var(--border)', padding: '40px 8%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>While you wait — revisit the research.</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Dig into the risk history or run the numbers again.</div>
        </div>
        <div className="nl-cta-btns" style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
          <Link to="/risk" className="cta-btn" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            border: '1px solid var(--border)', color: 'var(--text)',
            padding: '11px 18px', borderRadius: 8,
            textDecoration: 'none', fontSize: 13, fontWeight: 500,
            background: 'var(--bg)',
          }}>
            <span className="btn-arrow" style={{ display: 'inline-block' }}>←</span> Risk
          </Link>
          <Link to="/tools" className="cta-btn" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--accent)', color: '#fff',
            padding: '11px 18px', borderRadius: 8,
            textDecoration: 'none', fontSize: 13, fontWeight: 500,
          }}>
            Tools <span className="btn-arrow">→</span>
          </Link>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 8%', background: 'var(--bg)' }}>
        <div className="nl-footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr', gap: 40, marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.3px', marginBottom: 8 }}>
              ipo<span style={{ color: 'var(--accent)' }}>.</span>guide
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
              Making IPO investing less scary for first-time investors.
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { href: 'https://www.linkedin.com/in/henry-yeo-ba6408299/', label: 'LinkedIn', d: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
                { href: 'https://github.com/23bananasinmytummy', label: 'GitHub', d: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22' },
                { href: 'https://www.instagram.com/henry.ykd/', label: 'Instagram', d: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2z' },
              ].map(({ href, label, d }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} style={{
                  width: 32, height: 32, borderRadius: 8, border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'var(--bg)', textDecoration: 'none',
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={d} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: 14 }}>PAGES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[{ label: 'Home', to: '/' }, { label: 'Learn', to: '/learn' }, { label: 'Risk', to: '/risk' }, { label: 'Tools', to: '/tools' }, { label: 'Newsletter', to: '/newsletter' }].map(({ label, to }) => (
                <Link key={label} to={to} style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: 14 }}>DISCLAIMER</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.7 }}>
              This website is for informational purposes only and does not constitute financial advice. Always do your own research before making any investment decisions. Past performance is not indicative of future results.
            </div>
          </div>
        </div>
        <div className="nl-footer-bottom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>© 2026 ipo.guide · All rights reserved</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Not financial advice · Educational use only</div>
        </div>
      </footer>

    </div>
  );
}

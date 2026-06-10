import { useState, useRef } from 'react';
import { useEffect } from 'react';

const SPACEX_COLOR = '#005288';
const ANTHROPIC_COLOR = '#CC785C';
const UBER_COLOR = 'var(--accent)';
const AIRBNB_COLOR = 'var(--accent)';

// ── IPO Historical Data ───────────────────────────────────────────────────────

// Uber IPO: May 10, 2019 at $45
// Real monthly price data post-IPO (approximate closing prices)
const uberPostIPO = [
  { label: 'IPO Day', price: 41.57, note: 'Dropped 7.6% on debut — below $45 IPO price' },
  { label: 'Jun 2019', price: 44.15, note: 'Brief recovery toward IPO price' },
  { label: 'Jul 2019', price: 43.99, note: 'Volatile — lock-up expiry looms' },
  { label: 'Aug 2019', price: 33.97, note: 'Lock-up expiry: insider selling drives steep drop' },
  { label: 'Sep 2019', price: 32.96, note: 'Continued slide — profitability concerns mount' },
  { label: 'Oct 2019', price: 27.97, note: 'Hits new low — missed earnings expectations' },
  { label: 'Nov 2019', price: 26.94, note: 'Bottoms out below $27 — 40%+ below IPO price' },
  { label: 'Dec 2019', price: 29.72, note: 'Year-end recovery begins' },
  { label: 'Jan 2020', price: 37.37, note: 'Strong start to 2020' },
  { label: 'Feb 2020', price: 32.59, note: 'COVID fears begin to hit markets' },
  { label: 'Mar 2020', price: 14.82, note: 'COVID crash — Uber rides collapse to near zero' },
  { label: 'Apr 2020', price: 27.14, note: 'Recovery as Uber Eats surges during lockdowns' },
];

// Airbnb IPO: Dec 10, 2020 at $68
// Real monthly price data post-IPO (approximate closing prices)
const airbnbPostIPO = [
  { label: 'IPO Day', price: 144.71, note: 'Doubled on debut — opened at $146, closed $144.71' },
  { label: 'Jan 2021', price: 169.97, note: 'Continued surge — travel optimism post-vaccine news' },
  { label: 'Feb 2021', price: 191.83, note: 'Peak hype — analysts debate ceiling' },
  { label: 'Mar 2021', price: 164.30, note: 'Pullback — growth stocks broadly sold off' },
  { label: 'Apr 2021', price: 152.93, note: 'Sideways — market rotates to value' },
  { label: 'May 2021', price: 136.88, note: 'Further pullback amid rising rate expectations' },
  { label: 'Jun 2021', price: 148.36, note: 'Recovery as summer travel reopens' },
  { label: 'Jul 2021', price: 157.96, note: 'Strong bookings data lifts sentiment' },
  { label: 'Aug 2021', price: 148.62, note: 'Delta variant uncertainty' },
  { label: 'Sep 2021', price: 152.83, note: 'Stable — revenue beats expectations' },
  { label: 'Oct 2021', price: 168.67, note: 'Earnings beat — travel recovery solid' },
  { label: 'Nov 2021', price: 207.18, note: 'All-time high — Omicron not yet announced' },
];

// ── Mini Sparkline for Uber/Airbnb ───────────────────────────────────────────
function PostIPOChart({ data, color, ipoPrice }) {
  const svgRef = useRef(null);
  const hideTimer = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [activeIdx, setActiveIdx] = useState(null);

  const W = 600, H = 120;
  const prices = data.map(d => d.price);
  const minP = Math.min(...prices) * 0.95;
  const maxP = Math.max(...prices) * 1.05;

  const toY = (p) => H - ((p - minP) / (maxP - minP)) * (H - 10) - 5;
  const xs = data.map((_, i) => Math.round((i / (data.length - 1)) * W));
  const ys = prices.map(toY);

  const polyPts = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
  const fillPts = polyPts + ` ${W},${H} 0,${H}`;

  // IPO price line Y
  const ipoPriceY = toY(ipoPrice);

  const handleMouseMove = (e) => {
    clearTimeout(hideTimer.current);
    const rect = svgRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    let closest = 0, minD = Infinity;
    xs.forEach((x, i) => { const d = Math.abs(x - mx); if (d < minD) { minD = d; closest = i; } });
    setActiveIdx(closest);
    const relX = (xs[closest] / W) * rect.width;
    const tipW = 190;
    const left = Math.min(Math.max(relX - tipW / 2, 0), rect.width - tipW);
    const top = (ys[closest] / H) * rect.height - 20;
    setTooltip({ ...data[closest], left, top });
  };

  const scheduleHide = () => {
    hideTimer.current = setTimeout(() => { setTooltip(null); setActiveIdx(null); }, 100);
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        width="100%" height={H}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ display: 'block', cursor: 'crosshair' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={scheduleHide}
      >
        {/* IPO price reference line */}
        <line x1={0} y1={ipoPriceY} x2={W} y2={ipoPriceY}
          stroke="var(--text-muted)" strokeWidth="1" strokeDasharray="4,4" opacity="0.4" />

        <polyline points={fillPts} fill={color} opacity="0.07" />
        <polyline points={polyPts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />

        {xs.map((x, i) => (
          <circle key={i} cx={x} cy={ys[i]}
            r={activeIdx === i ? 5 : 3}
            fill={color}
            style={{ transition: 'r 0.15s ease' }}
          />
        ))}
      </svg>

      {/* IPO price label on the dashed line */}
      <div style={{
        position: 'absolute',
        right: 0,
        top: `${(ipoPriceY / H) * 100}%`,
        transform: 'translateY(-50%)',
        fontSize: '9px',
        color: 'var(--text-muted)',
        background: 'var(--bg)',
        padding: '1px 4px',
        borderRadius: 3,
        border: '1px solid var(--border)',
        pointerEvents: 'none',
      }}>
        IPO ${ipoPrice}
      </div>

      {tooltip && (
        <div
          onMouseEnter={() => clearTimeout(hideTimer.current)}
          onMouseLeave={() => { setTooltip(null); setActiveIdx(null); }}
          style={{
            position: 'absolute', left: tooltip.left, top: tooltip.top,
            background: 'var(--bg)', border: '1px solid var(--border)',
            borderRadius: '8px', padding: '9px 13px', fontSize: '11px',
            pointerEvents: 'auto', minWidth: '190px', zIndex: 10,
            lineHeight: 1.5,
          }}>
          <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{tooltip.label}</div>
          <div style={{ color: 'var(--accent)', marginBottom: 4, fontWeight: 600 }}>${tooltip.price.toFixed(2)}</div>
          <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{tooltip.note}</div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        {data.map((d, i) => (
          i % 3 === 0 || i === data.length - 1
            ? <span key={d.label} style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{d.label}</span>
            : <span key={d.label} />
        ))}
      </div>
      <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: 8 }}>
        Post-IPO price · First 12 months · Not live data
      </p>
    </div>
  );
}

// ── Historical IPO Card ───────────────────────────────────────────────────────
function HistoricalCard({ company }) {
  const isUber = company === 'uber';
  const color = isUber ? UBER_COLOR : AIRBNB_COLOR;
  const data = isUber ? uberPostIPO : airbnbPostIPO;

  const config = isUber ? {
    name: 'Uber',
    year: '2019',
    ipoPrice: 45,
    firstDay: '$41.57',
    firstDayDelta: '−7.6%',
    firstDayPositive: false,
    today: '~$75',
    todayDelta: '+67% from IPO',
    verdict: 'Recovered',
    verdictColor: '#16a34a',
    verdictBg: '#f0fdf4',
    verdictBgDark: 'rgba(22,163,74,0.1)',
    lesson: 'Hype alone doesn\'t guarantee a first-day pop. Uber dropped on day one — then took years of painful losses before it recovered above the IPO price. The lesson: a famous name is not the same as a good business yet.',
    sourceLabel: 'Wikipedia · Uber IPO',
    source: 'https://en.wikipedia.org/wiki/Uber_Technologies',
    relevance: 'SpaceX investors should note: a rocket company with a $1.75T valuation needs Starship to become commercially viable. If it doesn\'t, expect Uber-style post-IPO pain before any recovery.',
  } : {
    name: 'Airbnb',
    year: '2020',
    ipoPrice: 68,
    firstDay: '$144.71',
    firstDayDelta: '+113%',
    firstDayPositive: true,
    today: '~$155',
    todayDelta: '+128% from IPO',
    verdict: 'Thriving',
    verdictColor: '#16a34a',
    verdictBg: '#f0fdf4',
    verdictBgDark: 'rgba(22,163,74,0.1)',
    lesson: 'A clear revenue model + strong brand = sustained investor confidence. Airbnb doubled on day one and has stayed above IPO price. Not every IPO is Uber — when the business fundamentals are solid, the market rewards it.',
    sourceLabel: 'Wikipedia · Airbnb IPO',
    source: 'https://en.wikipedia.org/wiki/Airbnb',
    relevance: 'Anthropic has real revenue ($30B+ annualised run rate) and a clear business model selling AI access to enterprises. If that continues, it\'s closer to Airbnb than Uber.',
  };

  return (
    <div className="risk-historical-card" style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '28px',
      marginBottom: 24,
    }}>
      {/* Header */}
      <div className="risk-historical-card-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          {isUber
            ? <div style={{ fontFamily: "'Trebuchet MS', 'Arial Black', sans-serif", fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4, letterSpacing: '2px', textTransform: 'uppercase' }}>{config.name}</div>
            : <div style={{ fontFamily: "'Nunito', 'Helvetica Neue', sans-serif", fontSize: 24, fontWeight: 300, color: 'var(--text)', marginBottom: 4, letterSpacing: '0.5px' }}>{config.name}</div>
          }
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>IPO: {config.year} · NYSE</div>
        </div>
        <div className="risk-verdict-badge" style={{
          background: config.verdictBg,
          border: `1px solid ${config.verdictColor}`,
          borderRadius: 20,
          padding: '4px 12px',
          fontSize: 11,
          fontWeight: 600,
          color: config.verdictColor,
        }}>
          {config.verdict}
        </div>
      </div>

      {/* Stats row */}
      <div className="risk-stat-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'IPO PRICE', val: `$${config.ipoPrice}`, neutral: true },
          { label: 'FIRST DAY CLOSE', val: config.firstDay, delta: config.firstDayDelta, positive: config.firstDayPositive },
          { label: 'PRICE TODAY', val: config.today, delta: config.todayDelta, positive: true },
        ].map(({ label, val, delta, positive, neutral }) => (
          <div key={label} style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 10,
            padding: '12px 14px',
          }}>
            <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.8px', marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.5px' }}>{val}</div>
            {delta && (
              <div style={{ fontSize: 11, color: positive ? '#16a34a' : '#dc2626', marginTop: 3 }}>
                {positive ? '↑' : '↓'} {delta}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '16px 20px', background: 'var(--bg)', marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Post-IPO price — first 12 months</div>
        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 12 }}>
          Dashed line = IPO price · Hover for monthly detail
        </div>
        <PostIPOChart data={data} color={color} ipoPrice={config.ipoPrice} />
      </div>

      {/* Lesson */}
      <div style={{
        borderLeft: `3px solid ${color}`,
        paddingLeft: 14,
        marginBottom: 16,
      }}>
        <div style={{ fontSize: 10, fontWeight: 600, color, letterSpacing: '0.8px', marginBottom: 6 }}>KEY LESSON</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7 }}>{config.lesson}</div>
      </div>

      {/* Relevance */}
      <div style={{
        background: isUber ? 'rgba(0,82,136,0.04)' : 'rgba(204,120,92,0.04)',
        border: `1px solid ${isUber ? 'rgba(0,82,136,0.15)' : 'rgba(204,120,92,0.15)'}`,
        borderRadius: 10,
        padding: '12px 14px',
      }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: isUber ? SPACEX_COLOR : ANTHROPIC_COLOR, letterSpacing: '0.8px', marginBottom: 6 }}>
          {isUber ? '→ WHAT THIS MEANS FOR SPACEX' : '→ WHAT THIS MEANS FOR ANTHROPIC'}
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.65 }}>{config.relevance}</div>
      </div>

      <a href={config.source} target="_blank" rel="noreferrer"
        style={{ fontSize: 10, color: 'var(--text-muted)', display: 'block', marginTop: 12, textDecoration: 'underline', opacity: 0.7 }}>
        Source: {config.sourceLabel} →
      </a>
    </div>
  );
}

// ── Main Risk page ────────────────────────────────────────────────────────────

export default function Risk() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const menuRef = useRef(null);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 28px', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 100
      }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.3px' }}>
            ipo<span style={{ color: 'var(--accent)' }}>.</span>guide
          </div>
        </a>
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
            overflowY: 'auto'
          }}>
          <button onClick={() => setMenuOpen(false)} style={{
            alignSelf: 'flex-end', background: 'none', border: 'none',
            fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)', marginBottom: 24
          }}>✕</button>
          {[
            { label: 'Home', href: '/' },
            { label: 'Learn', href: '/learn' },
            { label: 'Risk', href: '/risk' },
            { label: 'Tools', href: '/tools' },
            { label: 'Newsletter', href: '/newsletter' },
          ].map(({ label, href }) => (
            <a key={label} href={href} style={{
              padding: '12px 0', borderBottom: '1px solid var(--border)',
              color: label === 'Risk' ? 'var(--accent)' : 'var(--text-muted)',
              textDecoration: 'none', fontSize: 14,
              fontWeight: label === 'Risk' ? 600 : 400
            }}>{label}</a>
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
              borderBottom: '1px solid var(--border)', textDecoration: 'none'
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
          .risk-hero { padding: 32px 5% 24px !important; }
          .risk-main { padding: 24px 5% 48px !important; }
          .risk-concept-grid { grid-template-columns: 1fr !important; }
          .risk-stat-row { grid-template-columns: 1fr !important; }
          .risk-historical-card { padding: 18px !important; }
          .risk-historical-card-header { flex-wrap: wrap !important; gap: 8px !important; }
          .risk-historical-card-header .risk-verdict-badge { align-self: flex-start !important; }
          .risk-table-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }
          .risk-table-wrap table { min-width: 560px; }
          .risk-cta { flex-direction: column !important; gap: 16px !important; }
          .risk-cta a { width: 100% !important; justify-content: center !important; }
          .risk-footer-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .risk-footer-bottom { flex-direction: column !important; gap: 8px !important; text-align: center !important; }
          nav { padding: 14px 16px !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="risk-hero" style={{ padding: '56px 8% 40px', borderBottom: '1px solid var(--border)' }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent)', letterSpacing: '1px', marginBottom: 12 }}>RISK & HISTORY</p>
        <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 600, letterSpacing: '-0.5px', color: 'var(--text)', marginBottom: 10, lineHeight: 1.2 }}>
          Every IPO carries risk.<br />Here's what history teaches us.
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: 520 }}>
          Before putting money in, understand the patterns. We look at Uber and Airbnb — two landmark IPOs — to show what can go right, what can go wrong, and what it means for SpaceX and Anthropic.
        </p>
      </section>

      {/* ── MAIN ── */}
      <main className="risk-main" style={{ padding: '40px 8% 64px' }}>

        {/* ── SECTION 1: CONCEPT CARDS ── */}
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', letterSpacing: '1px', marginBottom: 10 }}>THREE THINGS TO KNOW FIRST</p>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Key concepts, plain English</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.65 }}>
          Three terms you'll hear constantly around IPOs. Here's what they actually mean.
        </p>

        <div className="risk-concept-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 56 }}>
          {[
            {
              num: '01',
              term: 'Lock-up Period',
              plain: 'A rule that stops insiders (employees, early investors) from selling their shares for a set period — usually 90 to 180 days after the IPO.',
              why: 'When the lock-up expires, insiders often sell. That selling pressure can drop the stock price fast — like it did with Uber.',
            },
            {
              num: '02',
              term: 'First-Day Pop',
              plain: 'When a stock jumps way above its IPO price on the very first day of trading. Airbnb jumped 113% on day one. Uber actually dropped.',
              why: 'A big pop sounds exciting but can mean the bank set the price too low — leaving money on the table. No pop (or a drop) can signal weak demand.',
            },
            {
              num: '03',
              term: 'Post-IPO Slump',
              plain: 'Many stocks fall after their IPO once the hype fades and investors take profits. This can last months or years.',
              why: 'The post-IPO period is often the worst time to buy. Early enthusiasm cools, and the real business results start to matter more than the story.',
            },
          ].map(({ num, term, plain, why }) => (
            <div key={num} style={{
              background: 'var(--bg-secondary)',
              borderRadius: 12,
              padding: '20px',
              border: '1px solid var(--border)',
            }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', marginBottom: 10 }}>{num}</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>{term}</div>
              <div style={{ fontSize: 13, lineHeight: 1.65, color: 'var(--text-muted)', marginBottom: 12 }}>{plain}</div>
              <div style={{ fontSize: 12, lineHeight: 1.6, color: 'var(--text-muted)', paddingLeft: 10, borderLeft: '2px solid var(--accent)', opacity: 0.8 }}>
                <strong style={{ color: 'var(--text)', fontWeight: 600 }}>Why it matters: </strong>{why}
              </div>
            </div>
          ))}
        </div>

        {/* ── SECTION 2: HISTORICAL COMPARISONS ── */}
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', letterSpacing: '1px', marginBottom: 10 }}>HISTORICAL COMPARISONS</p>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>What happened to Uber & Airbnb</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.65, maxWidth: 600 }}>
          Both were hyped as revolutionary, both had millions of users — but their IPO stories played out very differently. Here's what the first 12 months looked like.
        </p>

        <HistoricalCard company="uber" />
        <HistoricalCard company="airbnb" />

        {/* ── SECTION 3: COMPARISON TABLE ── */}
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', letterSpacing: '1px', marginBottom: 10, marginTop: 40 }}>SIDE-BY-SIDE</p>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>All four companies compared</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.65 }}>
          How do SpaceX and Anthropic stack up against the historical playbook?
        </p>

        <div className="risk-table-wrap" style={{ marginBottom: 56 }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 13,
            background: 'var(--bg-secondary)',
            borderRadius: 12,
            overflow: 'hidden',
            border: '1px solid var(--border)',
          }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['', 'Uber', 'Airbnb', 'SpaceX', 'Anthropic'].map((h, i) => (
                  <th key={h} style={{
                    padding: '14px 16px',
                    textAlign: i === 0 ? 'left' : 'center',
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: '0.8px',
                    color: i === 0 ? 'var(--text-muted)'
                      : i === 3 ? SPACEX_COLOR
                        : i === 4 ? ANTHROPIC_COLOR
                          : 'var(--text)',
                    background: 'var(--bg)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                {
                  label: 'IPO Price / Valuation',
                  vals: ['$45/share', '$68/share', 'TBD — Est. $1.75T', 'TBD — Est. $965B'],
                },
                {
                  label: 'Revenue at IPO',
                  vals: ['$11.3B (2018)', '$2.5B (2019)', '$15B+ (2025)', '~$10B (2025)'],
                },
                {
                  label: 'Profitable at IPO?',
                  vals: ['No ✗', 'No ✗', 'Partial (Starlink ✓)', 'Near breakeven ~'],
                },
                {
                  label: 'Sector',
                  vals: ['Ride-hailing', 'Hospitality', 'Aerospace + Satellite', 'Artificial Intelligence'],
                },
                {
                  label: 'Hype Level',
                  vals: ['High', 'High', 'Extreme', 'Extreme'],
                  hype: true,
                },
              ].map(({ label, vals, hype }) => (
                <tr key={label} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{
                    padding: '13px 16px',
                    fontSize: 12,
                    fontWeight: 600,
                    color: 'var(--text-muted)',
                    background: 'var(--bg)',
                    whiteSpace: 'nowrap',
                  }}>{label}</td>
                  {vals.map((v, i) => {
                    const hypeColor = v === 'Extreme' ? '#dc2626'
                      : v === 'High' ? '#d97706'
                        : v === 'Medium' ? '#16a34a'
                          : 'var(--text-muted)';
                    return (
                      <td key={i} style={{
                        padding: '13px 16px',
                        textAlign: 'center',
                        color: hype ? hypeColor : 'var(--text-muted)',
                        fontWeight: hype ? 600 : 400,
                        fontSize: 12,
                      }}>{v}</td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 10 }}>
            SpaceX and Anthropic IPO prices TBD — estimated from latest private funding rounds · Not official · Subject to change
          </p>
        </div>

      </main>

      {/* ── BOTTOM CTA ── */}
      <div className="risk-cta" style={{ borderTop: '1px solid var(--border)', padding: '40px 8%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Ready to calculate your investment?</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Use our tools to model different scenarios before you put in a single dollar.</div>
        </div>
        <a href="/tools" className="cta-btn" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--accent)', color: '#fff', padding: '12px 22px',
          borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 500, flexShrink: 0
        }}>
          Open tools <span className="btn-arrow">→</span>
        </a>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 8%', background: 'var(--bg)' }}>
        <div className="risk-footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr', gap: 40, marginBottom: 32 }}>
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
                  background: 'var(--bg)', textDecoration: 'none'
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
              {[{ label: 'Home', href: '/' }, { label: 'Learn', href: '/learn' }, { label: 'Risk', href: '/risk' }, { label: 'Tools', href: '/tools' }, { label: 'Newsletter', href: '/newsletter' }].map(({ label, href }) => (
                <a key={label} href={href} style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>{label}</a>
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
        <div className="risk-footer-bottom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>© 2026 ipo.guide · All rights reserved</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Not financial advice · Educational use only</div>
        </div>
      </footer>

    </div>
  );
}

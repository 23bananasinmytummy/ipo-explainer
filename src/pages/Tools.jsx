import { useState, useRef, useEffect } from 'react';

const SPACEX_COLOR = '#005288';
const ANTHROPIC_COLOR = '#CC785C';

// ── Scenario data ────────────────────────────────────────────────────────────
const SCENARIOS = {
  spacex: {
    color: SPACEX_COLOR,
    estimatedIPOPrice: 45,
    estimatedValuation: '$1.75T',
    bear: {
      label: 'Bear case',
      rate1yr: -0.35,
      rate3yr: -0.20,
      rate5yr: 0.10,
      description: 'Starship fails to reach commercial scale. Regulatory delays pile up. Competition from Blue Origin intensifies. Investors reprice the stock sharply downward.',
      assumption: '−35% yr 1, slow 5yr recovery to +10%',
    },
    base: {
      label: 'Base case',
      rate1yr: 0.05,
      rate3yr: 0.40,
      rate5yr: 1.10,
      description: 'Starlink grows steadily. Starship achieves partial commercial success. Government contracts continue. Stock tracks roughly with revenue growth.',
      assumption: '+5% yr 1, +40% yr 3, +110% yr 5',
    },
    bull: {
      label: 'Bull case',
      rate1yr: 0.40,
      rate3yr: 1.50,
      rate5yr: 4.00,
      description: 'Starship becomes the backbone of global logistics and Moon/Mars missions. Starlink dominates satellite internet. SpaceX becomes the most valuable company on Earth.',
      assumption: '+40% yr 1, +150% yr 3, +400% yr 5',
    },
  },
  anthropic: {
    color: ANTHROPIC_COLOR,
    estimatedIPOPrice: 30,
    estimatedValuation: '$965B',
    bear: {
      label: 'Bear case',
      emoji: '🐻',
      rate1yr: -0.40,
      rate3yr: -0.15,
      rate5yr: 0.05,
      description: 'OpenAI or Google dominates the enterprise AI market. Commoditisation crushes margins. Anthropic struggles to differentiate Claude against free or cheaper rivals.',
      assumption: '−40% yr 1, slow recovery to +5% yr 5',
    },
    base: {
      label: 'Base case',
      emoji: '📊',
      rate1yr: 0.10,
      rate3yr: 0.60,
      rate5yr: 1.50,
      description: 'Claude maintains strong enterprise adoption. Revenue keeps compounding. Safety-first branding becomes a genuine differentiator as AI regulation tightens globally.',
      assumption: '+10% yr 1, +60% yr 3, +150% yr 5',
    },
    bull: {
      label: 'Bull case',
      emoji: '🚀',
      rate1yr: 0.50,
      rate3yr: 2.00,
      rate5yr: 5.00,
      description: 'Claude becomes the default AI layer for major enterprises worldwide. Anthropic wins government and healthcare contracts. Revenues 10× in 5 years.',
      assumption: '+50% yr 1, +200% yr 3, +500% yr 5',
    },
  },
};

// ── Quiz questions ───────────────────────────────────────────────────────────
const QUIZ_QUESTIONS = [
  {
    q: 'How long are you willing to hold this investment?',
    options: ['Less than 1 year', '1–3 years', '3–5 years', '5+ years'],
    scores: [0, 1, 2, 3],
  },
  {
    q: 'If the stock dropped 30% a month after IPO, what would you do?',
    options: ['Sell everything immediately', 'Sell half to reduce risk', 'Hold and wait', 'Buy more — it\'s on sale'],
    scores: [0, 1, 2, 3],
  },
  {
    q: 'How much of your total savings is this investment?',
    options: ['More than 50%', '20–50%', '5–20%', 'Less than 5%'],
    scores: [0, 1, 2, 3],
  },
  {
    q: 'What\'s your main goal here?',
    options: ['Quick profit — sell at first-day pop', 'Beat the market over 1–2 years', 'Long-term wealth building', 'Just learning — not investing real money yet'],
    scores: [0, 1, 3, 2],
  },
];

const RISK_RESULTS = [
  {
    min: 0, max: 3,
    label: 'Bear Case Investor',
    emoji: '🐻',
    color: '#dc2626',
    bg: '#fef2f2',
    bgDark: 'rgba(220,38,38,0.1)',
    borderColor: 'rgba(220,38,38,0.3)',
    desc: 'You prefer safety over big swings. IPO investing may not suit you — the lock-up period, first-day volatility, and post-IPO slumps are high-risk moments. If you do invest, keep it to a small slice of your portfolio.',
  },
  {
    min: 4, max: 7,
    label: 'Base Case Investor',
    emoji: '📊',
    color: '#2563eb',
    bg: '#eff6ff',
    bgDark: 'rgba(37,99,235,0.1)',
    borderColor: 'rgba(37,99,235,0.3)',
    desc: 'You\'re balanced — willing to take some risk but not betting the house. A measured position in SpaceX or Anthropic could fit your style, as long as you can stomach short-term dips without panicking.',
  },
  {
    min: 8, max: 12,
    label: 'Bull Case Investor',
    emoji: '🚀',
    color: '#16a34a',
    bg: '#f0fdf4',
    bgDark: 'rgba(22,163,74,0.1)',
    borderColor: 'rgba(22,163,74,0.3)',
    desc: 'You\'re comfortable with high risk for high reward. You\'re the type who holds through volatility and thinks long-term. IPOs like SpaceX and Anthropic are exactly the kind of bet that fits your profile — but always invest only what you can afford to lose.',
  },
];

// ── Scenario Cards ───────────────────────────────────────────────────────────
function ScenarioCards({ company }) {
  const data = SCENARIOS[company];
  const cases = [data.bear, data.base, data.bull];
  const amount = 1000;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <div style={{ width: 3, height: 18, background: data.color, borderRadius: 2 }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: data.color, letterSpacing: '1px' }}>
          {company === 'spacex' ? 'SPACEX' : 'ANTHROPIC'} · Est. valuation {data.estimatedValuation}
        </span>
      </div>
      <div className="tools-scenario-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 8 }}>
        {cases.map((c) => {
          const val1 = Math.round(amount * (1 + c.rate1yr));
          const val3 = Math.round(amount * (1 + c.rate3yr));
          const val5 = Math.round(amount * (1 + c.rate5yr));
          return (
            <div key={c.label} style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 14,
              padding: '18px 16px',
            }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{c.emoji}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>{c.label}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 14 }}>{c.description}</div>
              <div style={{ height: 1, background: 'var(--border)', marginBottom: 14 }} />
              <div style={{ fontSize: 9, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.8px', marginBottom: 10 }}>$1,000 BECOMES</div>
              {[
                { period: '1 year', val: val1, rate: c.rate1yr },
                { period: '3 years', val: val3, rate: c.rate3yr },
                { period: '5 years', val: val5, rate: c.rate5yr },
              ].map(({ period, val, rate }) => {
                const pos = rate >= 0;
                return (
                  <div key={period} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{period}</span>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: pos ? '#16a34a' : '#dc2626' }}>
                        ${val.toLocaleString()}
                      </span>
                      <span style={{ fontSize: 10, color: pos ? '#16a34a' : '#dc2626', marginLeft: 4 }}>
                        {pos ? '+' : ''}{Math.round(rate * 100)}%
                      </span>
                    </div>
                  </div>
                );
              })}
              <div style={{
                marginTop: 10,
                background: 'var(--bg)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '7px 10px',
                fontSize: 10,
                color: 'var(--text-muted)',
                lineHeight: 1.5,
              }}>
                📌 {c.assumption}
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.6 }}>
        Illustrative only · Assumes $1,000 invested at IPO · Not financial advice · Actual returns will differ
      </p>
    </div>
  );
}

// ── Risk Quiz ────────────────────────────────────────────────────────────────
function RiskQuiz() {
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const totalQ = QUIZ_QUESTIONS.length;
  const answered = Object.keys(answers).length;
  const allAnswered = answered === totalQ;

  const handleAnswer = (qIdx, score) => {
    setAnswers(prev => ({ ...prev, [qIdx]: score }));
    setResult(null);
  };

  const handleSubmit = () => {
    const total = Object.values(answers).reduce((a, b) => a + b, 0);
    const res = RISK_RESULTS.find(r => total >= r.min && total <= r.max);
    setResult(res);
  };

  const handleReset = () => {
    setAnswers({});
    setResult(null);
  };

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        {QUIZ_QUESTIONS.map((q, qi) => (
          <div key={qi} style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '18px 20px',
            marginBottom: 12,
          }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 14 }}>
              <span style={{ color: 'var(--accent)', marginRight: 8 }}>0{qi + 1}</span>{q.q}
            </div>
            <div className="tools-quiz-options" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
              {q.options.map((opt, oi) => {
                const selected = answers[qi] === q.scores[oi];
                return (
                  <button
                    key={oi}
                    onClick={() => handleAnswer(qi, q.scores[oi])}
                    style={{
                      padding: '9px 12px',
                      borderRadius: 8,
                      border: selected ? '1.5px solid var(--accent)' : '1px solid var(--border)',
                      background: selected ? 'var(--accent-light)' : 'var(--bg)',
                      color: selected ? 'var(--accent)' : 'var(--text-muted)',
                      fontSize: 12,
                      fontWeight: selected ? 600 : 400,
                      cursor: 'pointer',
                      textAlign: 'left',
                      lineHeight: 1.4,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!result && (
        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          style={{
            padding: '12px 24px',
            background: allAnswered ? 'var(--accent)' : 'var(--border)',
            color: allAnswered ? '#fff' : 'var(--text-muted)',
            border: 'none',
            borderRadius: 8,
            fontSize: 14,
            fontWeight: 500,
            cursor: allAnswered ? 'pointer' : 'not-allowed',
            transition: 'all 0.15s ease',
          }}
        >
          {allAnswered ? 'See my investor type →' : `Answer all ${totalQ - answered} remaining question${totalQ - answered !== 1 ? 's' : ''}`}
        </button>
      )}

      {result && (
        <div style={{
          background: result.bg,
          border: `1.5px solid ${result.borderColor}`,
          borderRadius: 16,
          padding: '24px',
          marginTop: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <span style={{ fontSize: 28 }}>{result.emoji}</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, color: result.color, letterSpacing: '0.8px', marginBottom: 3 }}>YOUR INVESTOR TYPE</div>
              <div style={{ fontSize: 18, fontWeight: 600, color: result.color }}>{result.label}</div>
            </div>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 16 }}>{result.desc}</p>
          <button
            onClick={handleReset}
            style={{
              padding: '8px 16px',
              background: 'none',
              border: `1px solid ${result.borderColor}`,
              borderRadius: 8,
              fontSize: 12,
              color: result.color,
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Retake quiz
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main Tools page ───────────────────────────────────────────────────────────
export default function Tools() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const menuRef = useRef(null);

  // Calculator state
  const [calcTab, setCalcTab] = useState('spacex');
  const [amount, setAmount] = useState(1000);
  const [spxPrice, setSpxPrice] = useState(45);
  const [antPrice, setAntPrice] = useState(30);

  // Scenario tab
  const [scenarioTab, setScenarioTab] = useState('spacex');

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

  // Calculator logic
  const ipoPrice = calcTab === 'spacex' ? spxPrice : antPrice;
  const shares = ipoPrice > 0 ? (amount / ipoPrice) : 0;
  const targets = [
    { label: '+25%', pct: 0.25 },
    { label: '+50%', pct: 0.50 },
    { label: '+100%', pct: 1.00 },
    { label: '−30%', pct: -0.30 },
    { label: '−50%', pct: -0.50 },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

      {/* ── NAVBAR ── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '18px 28px', borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 100,
      }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)', letterSpacing: '-0.3px' }}>
              ipo<span style={{ color: 'var(--accent)' }}>.</span>guide
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: 2, letterSpacing: '0.3px' }}>
              by henry yeo
            </div>
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
            overflowY: 'auto',
          }}>
          <button onClick={() => setMenuOpen(false)} style={{
            alignSelf: 'flex-end', background: 'none', border: 'none',
            fontSize: 20, cursor: 'pointer', color: 'var(--text-muted)', marginBottom: 24,
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
              color: label === 'Tools' ? 'var(--accent)' : 'var(--text-muted)',
              textDecoration: 'none', fontSize: 14,
              fontWeight: label === 'Tools' ? 600 : 400,
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
        .tools-tab-btn { position: relative; background: none; border: none; cursor: pointer; padding: 14px 24px; margin-bottom: -1px; transition: color 0.2s ease; }
        .tools-tab-btn::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 0%; height: 2px; transition: width 0.25s ease; }
        .tools-tab-btn:hover::after { width: 100%; }
        .tools-tab-spacex::after { background: ${SPACEX_COLOR}; }
        .tools-tab-anthropic::after { background: ${ANTHROPIC_COLOR}; }
        .tools-tab-btn.tools-active-tab::after { width: 100%; }

        @media (max-width: 768px) {
          .tools-tab-wrap { padding: 0 0 0 5% !important; overflow-x: auto; scrollbar-width: none; flex-wrap: nowrap !important; }
          .tools-tab-btn { padding: 10px 14px !important; font-size: 11px !important; white-space: nowrap; flex-shrink: 0; }
          .tools-hero { padding: 32px 5% 24px !important; }
          .tools-main { padding: 24px 5% 48px !important; }
          .tools-calc-inputs { grid-template-columns: 1fr !important; }
          .tools-calc-targets { grid-template-columns: repeat(2, 1fr) !important; }
          .tools-scenario-grid { grid-template-columns: 1fr !important; }
          .tools-quiz-options { grid-template-columns: 1fr !important; }
          .tools-cta { flex-direction: column !important; gap: 16px !important; }
          .tools-cta a { width: 100% !important; justify-content: center !important; }
          .tools-footer-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .tools-footer-bottom { flex-direction: column !important; gap: 8px !important; text-align: center !important; }
          nav { padding: 14px 16px !important; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section className="tools-hero" style={{ padding: '56px 8% 40px', borderBottom: '1px solid var(--border)' }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent)', letterSpacing: '1px', marginBottom: 12 }}>TOOLS</p>
        <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 600, letterSpacing: '-0.5px', color: 'var(--text)', marginBottom: 10, lineHeight: 1.2 }}>
          Run the numbers before you invest.
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: 520 }}>
          Model investment scenarios for SpaceX and Anthropic. See what different outcomes could mean for your money — before putting in a single dollar.
        </p>
      </section>

      {/* ── MAIN ── */}
      <main className="tools-main" style={{ padding: '40px 8% 64px' }}>

        {/* ── SECTION 1: INVESTMENT CALCULATOR ── */}
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', letterSpacing: '1px', marginBottom: 10 }}>INVESTMENT CALCULATOR</p>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>How much could your investment be worth?</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.65 }}>
          Enter an amount and IPO price to see estimated share count and what your position would be worth at different price targets. Pre-filled with analyst estimates — adjust freely.
        </p>

        {/* Tabs */}
        <div className="tools-tab-wrap" style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
          {[
            { key: 'spacex', label: 'SPACEX', color: SPACEX_COLOR, font: "'Arial Black', Arial, sans-serif", weight: 900, spacing: '1.5px', cls: 'tools-tab-spacex' },
            { key: 'anthropic', label: 'Anthropic', color: ANTHROPIC_COLOR, font: 'Georgia, serif', weight: 400, spacing: '0.3px', cls: 'tools-tab-anthropic' },
            { key: 'more', label: '+ More to come', color: 'var(--text-muted)', font: 'inherit', weight: 400, spacing: '0.2px', cls: 'tools-tab-more' },
          ].map(({ key, label, color, font, weight, spacing, cls }) => {
            const active = calcTab === key;
            return (
              <button
                key={key}
                onClick={() => setCalcTab(key)}
                className={`tools-tab-btn ${cls}${active ? ' tools-active-tab' : ''}`}
                style={{
                  fontSize: key === 'more' ? 13 : 14, fontFamily: font, fontWeight: weight,
                  letterSpacing: spacing,
                  color: active ? color : 'var(--text-muted)',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {calcTab === 'more' && (
          <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 16, padding: '40px 24px', textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>More companies coming soon</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65 }}>We're working on adding more IPOs to the calculator. Check back soon — or subscribe to the newsletter to get notified.</div>
          </div>
        )}

        {/* Inputs */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '24px',
          marginBottom: 24,
        }}>
          <div className="tools-calc-inputs" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginBottom: 24 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.8px', display: 'block', marginBottom: 8 }}>
                AMOUNT TO INVEST ($)
              </label>
              <input
                type="number"
                min="1"
                value={amount}
                onChange={e => setAmount(Math.max(1, Number(e.target.value)))}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  fontSize: 15,
                  fontWeight: 600,
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.8px', display: 'block', marginBottom: 8 }}>
                {calcTab === 'spacex' ? 'SPACEX' : 'ANTHROPIC'} IPO PRICE PER SHARE ($)
              </label>
              <input
                type="number"
                min="0.01"
                step="0.01"
                value={calcTab === 'spacex' ? spxPrice : antPrice}
                onChange={e => {
                  const val = Math.max(0.01, Number(e.target.value));
                  calcTab === 'spacex' ? setSpxPrice(val) : setAntPrice(val);
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  border: '1px solid var(--border)',
                  borderRadius: 8,
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  fontSize: 15,
                  fontWeight: 600,
                  outline: 'none',
                }}
              />
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 5 }}>
                Pre-filled: est. ${calcTab === 'spacex' ? '45' : '30'}/share · Adjust to any price you want to model
              </div>
            </div>
          </div>

          {/* Shares result */}
          <div style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '16px 20px',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.8px', marginBottom: 4 }}>ESTIMATED SHARES</div>
              <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--text)', letterSpacing: '-0.5px' }}>
                ~{ipoPrice > 0 ? Math.floor(shares).toLocaleString() : '—'}
              </div>
            </div>
            <div style={{ width: 1, height: 40, background: 'var(--border)' }} />
            <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.65 }}>
              At ${ipoPrice.toFixed(2)}/share · ${amount.toLocaleString()} invested
            </div>
          </div>

          {/* Price targets */}
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.8px', marginBottom: 12 }}>YOUR POSITION AT DIFFERENT PRICE TARGETS</div>
          <div className="tools-calc-targets" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
            {targets.map(({ label, pct }) => {
              const val = amount * (1 + pct);
              const pos = pct >= 0;
              return (
                <div key={label} style={{
                  background: pos ? 'rgba(22,163,74,0.05)' : 'rgba(220,38,38,0.05)',
                  border: `1px solid ${pos ? 'rgba(22,163,74,0.2)' : 'rgba(220,38,38,0.2)'}`,
                  borderRadius: 10,
                  padding: '12px 10px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: pos ? '#16a34a' : '#dc2626', marginBottom: 6 }}>{label}</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>${Math.round(val).toLocaleString()}</div>
                  <div style={{ fontSize: 10, color: pos ? '#16a34a' : '#dc2626', marginTop: 3 }}>
                    {pos ? '+' : ''}${Math.round(val - amount).toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <p style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 56, lineHeight: 1.6 }}>
          Estimates only · Does not account for brokerage fees, taxes, fractional shares, or currency conversion · Not financial advice
        </p>

        {/* ── SECTION 2: SCENARIO CARDS ── */}
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', letterSpacing: '1px', marginBottom: 10 }}>SCENARIO PLANNER</p>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>What could $1,000 become?</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8, lineHeight: 1.65 }}>
          Nobody knows what SpaceX or Anthropic will be worth after IPO. But we can model three plausible futures — Bear (things go badly), Base (things go roughly as expected), and Bull (things go really well).
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.65 }}>
          These are rough estimates based on analyst projections and historical IPO patterns — not predictions.
        </p>

        {/* Scenario tabs */}
        <div className="tools-tab-wrap" style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', marginBottom: 24 }}>
          {[
            { key: 'spacex', label: 'SPACEX', color: SPACEX_COLOR, font: "'Arial Black', Arial, sans-serif", weight: 900, spacing: '1.5px', cls: 'tools-tab-spacex' },
            { key: 'anthropic', label: 'Anthropic', color: ANTHROPIC_COLOR, font: 'Georgia, serif', weight: 400, spacing: '0.3px', cls: 'tools-tab-anthropic' },
            { key: 'more', label: '+ More to come', color: 'var(--text-muted)', font: 'inherit', weight: 400, spacing: '0.2px', cls: 'tools-tab-more' },
          ].map(({ key, label, color, font, weight, spacing, cls }) => {
            const active = scenarioTab === key;
            return (
              <button
                key={key}
                onClick={() => setScenarioTab(key)}
                className={`tools-tab-btn ${cls}${active ? ' tools-active-tab' : ''}`}
                style={{
                  fontSize: key === 'more' ? 13 : 14, fontFamily: font, fontWeight: weight,
                  letterSpacing: spacing,
                  color: active ? color : 'var(--text-muted)',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {scenarioTab === 'more'
          ? (
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: 16, padding: '40px 24px', textAlign: 'center' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>More companies coming soon</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65 }}>We're modelling more IPO scenarios. Check back soon — or subscribe to the newsletter to get notified.</div>
            </div>
          )
          : <ScenarioCards company={scenarioTab} />
        }

        {/* ── SECTION 3: RISK QUIZ ── */}
        <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--accent)', letterSpacing: '1px', marginBottom: 10, marginTop: 56 }}>RISK SCORE</p>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>What kind of investor are you?</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 28, lineHeight: 1.65 }}>
          Answer 4 quick questions. We'll match you to a Bear, Base, or Bull investor profile — so you know which scenarios above are actually relevant to you.
        </p>

        <RiskQuiz />

      </main>

      {/* ── BOTTOM CTA ── */}
      <div className="tools-cta" style={{ borderTop: '1px solid var(--border)', padding: '40px 8%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Want to know when these IPOs drop?</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Get notified the moment SpaceX or Anthropic sets an IPO date. No spam, ever.</div>
        </div>
        <a href="/newsletter" className="cta-btn" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--accent)', color: '#fff', padding: '12px 22px',
          borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 500, flexShrink: 0,
        }}>
          Subscribe <span className="btn-arrow">→</span>
        </a>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 8%', background: 'var(--bg)' }}>
        <div className="tools-footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr', gap: 40, marginBottom: 32 }}>
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
        <div className="tools-footer-bottom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>© 2026 ipo.guide · All rights reserved</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Not financial advice · Educational use only</div>
        </div>
      </footer>

    </div>
  );
}

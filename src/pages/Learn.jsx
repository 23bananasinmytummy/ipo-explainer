import { useState, useEffect, useRef } from 'react';

const SPACEX_COLOR = '#005288';
const ANTHROPIC_COLOR = '#CC785C';

// ── Shared chart data ─────────────────────────────────────────────────────────

const spacexData = [
  { year: '2002', val: '$0', note: 'Elon Musk seeds SpaceX with $100M of his own money', url: 'https://www.businessinsider.com/elon-musk-spacex-history-2016-9' },
  { year: '2015', val: '$12B', note: 'Google & Fidelity invest $1B — first major institutional round', url: 'https://techcrunch.com/2015/01/20/google-fidelity-invest-900-million-in-spacex/' },
  { year: '2020', val: '$46B', note: 'Series J — $1.9B raised as Starlink enters beta', url: 'https://www.cnbc.com/2020/08/04/spacex-raises-1point9-billion-in-equity-funding.html' },
  { year: '2021', val: '$74B', note: 'Sequoia & Fidelity back $1.16B round', url: 'https://techcrunch.com/2021/02/16/spacex-raises-1-16-billion/' },
  { year: '2022', val: '$127B', note: 'Starlink surpasses 1M subscribers — revenue inflects', url: 'https://www.reuters.com/technology/spacex-raises-2-bln-new-funding-round-wsj-2022-07-25/' },
  { year: '2023', val: '$137B', note: 'a16z leads $750M round', url: 'https://techcrunch.com/2023/01/17/spacex-raises-750-million/' },
  { year: '2025', val: '$800B', note: 'Insider share sale at $421/share — Starlink hits 9M users', url: 'https://sacra.com/c/spacex/' },
  { year: '2026', val: '$1.75T', note: 'IPO filing — targeting largest listing in history', url: 'https://tsginvest.com/spacex/' },
];

const anthropicData = [
  { year: '2021', val: '$124M', note: 'Series A — founded by ex-OpenAI researchers', url: 'https://techcrunch.com/2021/05/28/anthropic-raises-124m-to-build-safer-ai/' },
  { year: '2022', val: '~$1B', note: 'Google commits $300M; Spark Capital leads early round', url: 'https://techcrunch.com/2022/04/29/google-invests-300-million-in-ai-safety-startup-anthropic/' },
  { year: '2023', val: '$4.1B', note: 'Amazon invests $4B — largest AI infrastructure bet at time', url: 'https://techcrunch.com/2023/09/25/amazon-to-invest-up-to-4-billion-in-anthropic/' },
  { year: '2024', val: '$18.4B', note: 'Series E — $750M at $18.4B valuation', url: 'https://techcrunch.com/2024/05/21/anthropic-raises-new-funding-at-18-4-billion-valuation/' },
  { year: 'Oct 2025', val: '$183B', note: 'Series F — $13B led by ICONIQ, Fidelity & Lightspeed', url: 'https://www.mexc.com/news/147748' },
  { year: 'Jan 2026', val: '$350B', note: 'Series G tranche — $20B raised, GIC & Coatue lead', url: 'https://www.mexc.com/news/578493' },
  { year: 'Feb 2026', val: '$380B', note: 'Series G closes — $30B total, second-largest deal ever', url: 'https://www.cnbc.com/2026/02/12/anthropic-closes-30-billion-funding-round-at-380-billion-valuation.html' },
  { year: 'Apr 2026', val: '$965B', note: 'Series H — $65B raised, nears $1T pre-IPO', url: 'https://techcrunch.com/2026/05/28/anthropic-raises-65-billion-nears-1t-valuation-ahead-of-ipo/' },
];

// ── Sparkline with hover tooltip ─────────────────────────────────────────────

function Sparkline({ data, color }) {
  const svgRef = useRef(null);
  const tipRef = useRef(null);
  const hideTimer = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [activeIdx, setActiveIdx] = useState(null);

  const W = 600, H = 130;
  const xs = data.map((_, i) => Math.round((i / (data.length - 1)) * W));
  const ys = [118, 116, 112, 106, 96, 80, 52, 6].slice(0, data.length);
  const polyPts = xs.map((x, i) => `${x},${ys[i]}`).join(' ');
  const fillPts = polyPts + ` ${W},${H} 0,${H}`;

  const gridXs = xs.slice(1);
  const gridYs = [26, 52, 78, 104];

  const handleMouseMove = (e) => {
    clearTimeout(hideTimer.current);
    const rect = svgRef.current.getBoundingClientRect();
    const mx = (e.clientX - rect.left) * (W / rect.width);
    let closest = 0, minD = Infinity;
    xs.forEach((x, i) => { const d = Math.abs(x - mx); if (d < minD) { minD = d; closest = i; } });
    setActiveIdx(closest);
    const p = data[closest];
    const relX = (xs[closest] / W) * rect.width;
    const tipW = 200;
    const left = relX + tipW > rect.width ? relX - tipW - 10 : relX + 12;
    const top = (ys[closest] / H) * rect.height - 20;
    setTooltip({ ...p, left, top });
  };

  const scheduleHide = () => {
    hideTimer.current = setTimeout(() => { setTooltip(null); setActiveIdx(null); }, 100);
  };

  const handleMouseLeave = scheduleHide;
  const handleTipEnter = () => clearTimeout(hideTimer.current);
  const handleTipLeave = () => { setTooltip(null); setActiveIdx(null); };

  return (
    <div style={{ position: 'relative' }}>
      <svg
        ref={svgRef}
        width="100%" height={H}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={{ display: 'block', cursor: 'crosshair' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {gridXs.map(x => (
          <line key={x} x1={x} y1={0} x2={x} y2={120}
            stroke="var(--border)" strokeWidth="0.5" strokeDasharray="3,3" />
        ))}
        {gridYs.map(y => (
          <line key={y} x1={0} y1={y} x2={W} y2={y}
            stroke="var(--border)" strokeWidth="0.5" />
        ))}
        <polyline points={fillPts} fill={color} opacity="0.06" />
        <polyline points={polyPts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
        {xs.map((x, i) => (
          <circle key={i} cx={x} cy={ys[i]}
            r={activeIdx === i ? 5 : 3}
            fill={color}
            style={{ transition: 'r 0.15s ease' }}
          />
        ))}
      </svg>

      {tooltip && (
        <div
          ref={tipRef}
          onMouseEnter={handleTipEnter}
          onMouseLeave={handleTipLeave}
          style={{
            position: 'absolute', left: tooltip.left, top: tooltip.top,
            background: 'var(--bg)', border: '1px solid var(--border)',
            borderRadius: '8px', padding: '9px 13px', fontSize: '11px',
            pointerEvents: 'auto', minWidth: '190px', zIndex: 10,
            lineHeight: 1.5,
          }}>
          <div style={{ fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>{tooltip.year}</div>
          <div style={{ color, marginBottom: 4 }}>{tooltip.val}</div>
          <a href={tooltip.url} target="_blank" rel="noreferrer"
            style={{ color: 'var(--text-muted)', fontSize: '10px', textDecoration: 'underline', pointerEvents: 'auto' }}>
            {tooltip.note} →
          </a>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        {data.map(d => (
          <span key={d.year} style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{d.year}</span>
        ))}
      </div>
      <p style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: 10 }}>
        Based on funding rounds · Updated manually · Not live data
      </p>
    </div>
  );
}

// ── Company section ───────────────────────────────────────────────────────────

function CompanySection({ company }) {
  const isSpaceX = company === 'spacex';
  const color = isSpaceX ? SPACEX_COLOR : ANTHROPIC_COLOR;

  const nameEl = isSpaceX
    ? <div style={{ fontFamily: "'Arial Black', Arial, sans-serif", fontSize: '22px', fontWeight: 900, letterSpacing: '2px', textTransform: 'uppercase', color, marginBottom: 4 }}>SPACEX</div>
    : <div style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 400, letterSpacing: '0.5px', color, marginBottom: 4 }}>Anthropic</div>;

  const sector = isSpaceX ? 'Aerospace & Defence · Founded 2002 · Hawthorne, CA' : 'Artificial Intelligence · Founded 2021 · San Francisco, CA';

  const explainer = isSpaceX
    ? 'SpaceX designs, manufactures, and launches rockets and spacecraft — then lands and reuses them, dramatically reducing the cost of reaching orbit. Its Starlink satellite network now delivers broadband internet to over 10 million subscribers across 160 countries, representing the majority of the company\'s revenue and its primary path to profitability.'
    : 'Anthropic is an AI safety company that develops Claude — a large language model deployed across enterprise, developer, and consumer markets. Founded by former OpenAI researchers, the company\'s core thesis is that frontier AI systems require rigorous safety research alongside capability development. Revenue is primarily driven by API access and enterprise contracts.';

  const nums = isSpaceX
    ? [{ label: 'VALUATION', val: '$1.75T', colored: true }, { label: 'FOUNDED', val: '2002' }, { label: 'EMPLOYEES', val: '~22,000' }, { label: '2025 REVENUE', val: '$15B+' }]
    : [{ label: 'VALUATION', val: '$965B', colored: true }, { label: 'FOUNDED', val: '2021' }, { label: '2025 REVENUE', val: '~$10B' }, { label: 'TOTAL RAISED', val: '$132B' }];

  const chartData = isSpaceX ? spacexData : anthropicData;
  const chartLatest = isSpaceX ? '$1.75T' : '$965B';
  const chartSub = isSpaceX ? '↑ IPO target 2026' : '↑ Pre-IPO valuation';

  const risks = isSpaceX ? [
    {
      risk: 'Starship has experienced six major failures in 2025 alone, with each vehicle costing $90–100M. SpaceX has destroyed over $500M in Starship hardware since 2023.',
      counter: 'Falcon 9 — the revenue-generating workhorse — has a 99%+ success rate across 586 launches. Failures are largely confined to the experimental Starship programme, not the operational fleet.',
      source: 'https://www.rdworldonline.com/spacexs-starship-explosions-reveal-the-high-cost-of-fail-fast-rd/',
      sourceLabel: 'R&D World, 2025'
    },
    {
      risk: 'SpaceX\'s own IPO filing discloses it carries zero key-person life insurance on Musk, describing him as the "driving force behind growth, innovation, and operational success." He cannot be removed without Class B shareholder approval.',
      counter: 'Musk\'s track record across hardware companies — rockets, EVs, satellite internet — is historically unmatched. His involvement is a primary reason institutional investors are willing to back SpaceX at this scale.',
      source: 'https://247wallst.com/investing/2026/05/26/the-question-about-elon-musk-that-spacex-refuses-to-answer-before-its-ipo/',
      sourceLabel: '24/7 Wall St., May 2026'
    },
    {
      risk: 'SpaceX\'s own IPO filing confirms that roughly one-fifth of 2025 revenue came from US federal agencies — NASA, DoD, Space Force — whose budgets are subject to political cycles and policy shifts.',
      counter: 'These contracts are long-term and locked in: NASA Commercial Crew is secured at $4.93B through 2030, and NSSL Phase 3 adds another $5.9B through 2029. SpaceX is the primary launch provider for US national security — not easily replaced.',
      source: 'https://techcrunch.com/2026/05/29/spacex-awarded-6-45b-in-space-force-contracts-ahead-of-ipo/',
      sourceLabel: 'TechCrunch, May 2026'
    },
    {
      risk: 'The xAI merger folded a division that lost $6.4B from operations in 2025 on just $3.2B in revenue into SpaceX\'s balance sheet — adding a cash-burning AI unit to what was otherwise a tightening business.',
      counter: 'The merger also adds Grok and AI compute infrastructure to SpaceX\'s IPO pitch, which could expand the addressable market well beyond rockets and satellite internet if xAI stabilises under SpaceX management.',
      source: 'https://futurism.com/space/possible-spacex-collapse-spectacularly',
      sourceLabel: 'Futurism, Jun 2026'
    },
    {
      risk: 'At a $1.75T IPO valuation, significant future growth is already priced in. Starship must become commercially operational and Starlink must continue its subscriber trajectory for the stock to justify this price at listing.',
      counter: 'If Starlink reaches 20M+ subscribers and Starship enables point-to-point cargo or Mars logistics, the addressable market is orders of magnitude larger than what current models price in — making the valuation less extreme than it appears.',
      source: 'https://tsginvest.com/spacex/',
      sourceLabel: 'TSG Invest, 2026'
    },
  ] : [
    {
      risk: 'Anthropic\'s CFO has cited roughly $600B in five-year compute commitments against a revenue base that, while growing rapidly, has not yet produced a full-year operating profit.',
      counter: 'Anthropic projects its first quarterly operating profit of $559M in Q2 2026 — ahead of its own internal schedule. Revenue has grown from $9B at end-2025 to a $30B+ run rate by April 2026.',
      source: 'https://letsdatascience.com/blog/anthropic-first-operating-profit-q2-2026-559-million',
      sourceLabel: "Let's Data Science, May 2026"
    },
    {
      risk: 'Inference costs on Google and AWS rose ~23% more than Anthropic\'s internal forecast in 2025, compressing gross margins to ~40% — roughly 10 percentage points below the company\'s own projections.',
      counter: 'Anthropic has since locked in 10GW of dedicated compute across AWS and Google at pre-agreed terms, reducing its exposure to spot-market pricing fluctuations going forward.',
      source: 'https://fastly.tipranks.com/news/ai-startup-anthropic-warns-of-profit-margin-pressure-as-costs-surge',
      sourceLabel: 'TipRanks, 2025'
    },
    {
      risk: 'Anthropic\'s $965B valuation was predicated on earlier internal forecasts of $18B revenue in 2026 and $55B in 2027 — growth assumptions that would need to hold in an increasingly competitive market.',
      counter: 'Anthropic has already surpassed $30B in annualised run-rate revenue by April 2026, ahead of its own $18B full-year target. Enterprise demand — with 1,000+ customers spending $1M+ annually — is running materially ahead of forecast.',
      source: 'https://www.mexc.com/tr-CT/news/1010401',
      sourceLabel: 'MEXC News, Apr 2026'
    },
    {
      risk: 'Anthropic is operationally dependent on AWS and Google Cloud for model training and inference. A capacity crunch in late 2024 forced the company to throttle Claude access — directly impacting enterprise customers.',
      counter: 'Both AWS and Google are strategic equity investors, aligning their incentives with Anthropic\'s growth. Anthropic has also diversified across two independent supply chains — Google TPUs and AWS Trainium — reducing single-vendor risk.',
      source: 'https://aragonresearch.com/can-anthropic-survive-without-google-aws/',
      sourceLabel: 'Aragon Research, May 2026'
    },
    {
      risk: 'AI regulation is accelerating globally. The EU AI Act, US executive orders, and emerging APAC frameworks could increase compliance costs and restrict certain product capabilities.',
      counter: 'Anthropic\'s Constitutional AI methodology and proactive regulator engagement position it better than most peers. Safety is its founding thesis — which increasingly resonates with regulated enterprise buyers in finance, legal, and healthcare.',
      source: 'https://www.deepresearchglobal.com/p/anthropic-company-analysis-outlook-report',
      sourceLabel: 'Deep Research Global, 2026'
    },
  ];

  const whyTitle = isSpaceX ? 'THE CASE FOR WATCHING THIS IPO' : 'THE CASE FOR WATCHING THIS IPO';
  const whyText = isSpaceX
    ? 'SpaceX would be the largest IPO in history — surpassing Saudi Aramco\'s $29B listing in 2019. Starlink is already profitable, Falcon 9 is the world\'s most-launched rocket, and the company has grown from a $12B valuation to $1.75T in just over a decade. The central question for investors is not whether SpaceX is a serious business, but whether the public market price reflects a realistic ceiling — or the beginning of a much larger story.'
    : 'Anthropic is the only frontier AI lab outside OpenAI with a credible near-term IPO. It has $14B in annualised revenue, enterprise customers across regulated industries, and a differentiated positioning around AI safety that increasingly resonates with institutional buyers. At $965B, the investment case hinges on whether Claude can maintain its enterprise momentum as the AI infrastructure market matures — and whether safety becomes a genuine competitive moat.';

  return (
    <div>
      {/* Company name + sector */}
      {nameEl}
      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: 24 }}>{sector}</div>

      {/* What they do */}
      <p style={{ fontSize: '11px', fontWeight: 600, color, letterSpacing: '1px', marginBottom: 10 }}>WHAT THEY DO</p>
      <p style={{ fontSize: '14px', lineHeight: 1.75, color: 'var(--text-muted)', marginBottom: 28, maxWidth: 640 }}>{explainer}</p>

      {/* Key numbers */}
      <p style={{ fontSize: '11px', fontWeight: 600, color, letterSpacing: '1px', marginBottom: 10 }}>KEY NUMBERS</p>
      <div className="learn-num-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 28 }}>
        {nums.map(({ label, val, colored }) => (
          <div key={label} style={{ background: 'var(--bg-secondary)', borderRadius: 10, padding: '14px 16px', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.8px', marginBottom: 6 }}>{label}</div>
            <div style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '-0.5px', color: colored ? color : 'var(--text)' }}>{val}</div>
          </div>
        ))}
      </div>

      {/* Valuation chart */}
      <p style={{ fontSize: '11px', fontWeight: 600, color, letterSpacing: '1px', marginBottom: 10 }}>VALUATION GROWTH</p>
      <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: 20, marginBottom: 28, background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text)' }}>Valuation growth</div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: 2 }}>
              Private funding rounds · {isSpaceX ? '2002–2026' : '2021–2026'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '24px', fontWeight: 700, color, letterSpacing: '-1px' }}>{chartLatest}</div>
            <div style={{ fontSize: '11px', color: '#16a34a', marginTop: 2 }}>{chartSub}</div>
          </div>
        </div>
        <Sparkline data={chartData} color={color} />
      </div>

      {/* Key risks */}
      <p style={{ fontSize: '11px', fontWeight: 600, color, letterSpacing: '1px', marginBottom: 14 }}>KEY RISKS</p>
      <div style={{ marginBottom: 28 }}>
        {risks.map(({ risk, counter, source, sourceLabel }, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 0', borderBottom: i < risks.length - 1 ? '1px solid var(--border)' : 'none' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, marginTop: 6, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: 5 }}>
                {risk}{' '}
                <a href={source} target="_blank" rel="noreferrer" style={{ fontSize: '10px', color, opacity: 0.7, textDecoration: 'underline', whiteSpace: 'nowrap' }}>{sourceLabel}</a>
              </div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: 1.6, paddingLeft: 10, borderLeft: `2px solid ${color}`, opacity: 0.75 }}>
                {counter}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Why watch */}
      <div style={{
        background: isSpaceX ? 'rgba(0,82,136,0.04)' : 'rgba(204,120,92,0.04)',
        border: `1px solid ${isSpaceX ? 'rgba(0,82,136,0.15)' : 'rgba(204,120,92,0.15)'}`,
        borderRadius: 12, padding: '20px 22px'
      }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color, letterSpacing: '0.8px', marginBottom: 10 }}>{whyTitle}</div>
        <div style={{ fontSize: '13px', lineHeight: 1.75, color: 'var(--text-muted)' }}>{whyText}</div>
      </div>
    </div>
  );
}

// ── Main Learn page ───────────────────────────────────────────────────────────

export default function Learn() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [activeTab, setActiveTab] = useState('spacex');
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
              color: label === 'Learn' ? 'var(--accent)' : 'var(--text-muted)',
              textDecoration: 'none', fontSize: 14,
              fontWeight: label === 'Learn' ? 600 : 400
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

      {/* ── HERO ── */}
      <section className="learn-hero" style={{ padding: '56px 8% 40px', borderBottom: '1px solid var(--border)' }}>
        <p style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent)', letterSpacing: '1px', marginBottom: 12 }}>COMPANY DEEP-DIVE</p>
        <h1 style={{ fontSize: 'clamp(22px, 4vw, 32px)', fontWeight: 600, letterSpacing: '-0.5px', color: 'var(--text)', marginBottom: 10, lineHeight: 1.2 }}>
          Understand the companies<br />before you invest.
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, maxWidth: 520 }}>
          What they do, how they make money, where the risks lie, and why these IPOs are worth paying attention to.
        </p>
      </section>

      {/* ── TABS ── */}
      <style>{`
        .tab-btn { position: relative; }
        .tab-btn::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 0%;
          height: 2px;
          transition: width 0.25s ease;
        }
        .tab-btn:hover::after { width: 100%; }
        .tab-spacex::after { background: ${SPACEX_COLOR}; }
        .tab-anthropic::after { background: ${ANTHROPIC_COLOR}; }
        .tab-more::after { background: var(--text-muted); }
        .tab-btn.active-tab::after { width: 100%; }

        @media (max-width: 768px) {
          .learn-hero { padding: 32px 5% 24px !important; }
          .learn-tabs { padding: 0 0 0 5% !important; overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; flex-wrap: nowrap !important; }
          .learn-tabs::-webkit-scrollbar { display: none; }
          .tab-btn { padding: 10px 12px !important; font-size: 11px !important; white-space: nowrap; flex-shrink: 0; }
          .learn-main { padding: 24px 5% 48px !important; }
          .learn-num-grid { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
          .learn-cta { flex-direction: column !important; gap: 16px !important; }
          .learn-cta a { width: 100% !important; justify-content: center !important; }
          .learn-footer-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .learn-footer-bottom { flex-direction: column !important; gap: 8px !important; text-align: center !important; }
          nav { padding: 14px 16px !important; }
        }
      `}</style>

      <div className="learn-tabs" style={{ padding: '0 8%', borderBottom: '1px solid var(--border)', display: 'flex', gap: 0 }}>
        {[
          { key: 'spacex', label: 'SPACEX', color: SPACEX_COLOR, font: "'Arial Black', Arial, sans-serif", weight: 900, spacing: '1.5px', cls: 'tab-spacex' },
          { key: 'anthropic', label: 'Anthropic', color: ANTHROPIC_COLOR, font: 'Georgia, serif', weight: 400, spacing: '0.3px', cls: 'tab-anthropic' },
          { key: 'more', label: '+ More to come', color: 'var(--text-muted)', font: 'inherit', weight: 400, spacing: '0.2px', cls: 'tab-more' },
        ].map(({ key, label, color, font, weight, spacing, cls }) => {
          const active = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`tab-btn ${cls}${active ? ' active-tab' : ''}`}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '16px 24px', fontSize: key === 'more' ? 13 : 14,
                fontFamily: font, fontWeight: weight,
                color: active ? color : 'var(--text-muted)',
                borderBottom: 'none',
                marginBottom: -1,
                transition: 'color 0.2s ease',
                letterSpacing: spacing,
                opacity: key === 'more' ? 0.6 : 1,
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* ── CONTENT ── */}
      <main className="learn-main" style={{ padding: '40px 8% 64px' }}>
        {activeTab === 'more' ? (
          <div style={{ maxWidth: 480, margin: '40px auto', textAlign: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)', marginBottom: 10 }}>
              More companies on the way
            </div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75, marginBottom: 28 }}>
              We're tracking other high-profile IPO candidates — including Stripe, Reddit follow-ons, and others. Sign up to the newsletter to get notified when they drop.
            </div>
            <a href="/newsletter" className="cta-btn" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'var(--accent)', color: '#fff', padding: '12px 22px',
              borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 500
            }}>
              Get notified <span className="btn-arrow">→</span>
            </a>
          </div>
        ) : (
          <CompanySection key={activeTab} company={activeTab} />
        )}
      </main>

      {/* ── BOTTOM CTA ── */}
      <div className="learn-cta" style={{ borderTop: '1px solid var(--border)', padding: '40px 8%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-secondary)' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>Ready to think about risk?</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>See how these IPOs compare to historical listings — and what that means for you.</div>
        </div>
        <a href="/risk" className="cta-btn" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--accent)', color: '#fff', padding: '12px 22px',
          borderRadius: 8, textDecoration: 'none', fontSize: 14, fontWeight: 500, flexShrink: 0
        }}>
          Explore risks <span className="btn-arrow">→</span>
        </a>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '40px 8%', background: 'var(--bg)', marginTop: 0 }}>
        <div className="learn-footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr', gap: 40, marginBottom: 32 }}>
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
        <div className="learn-footer-bottom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 24, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>© 2026 ipo.guide · All rights reserved</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Not financial advice · Educational use only</div>
        </div>
      </footer>

    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');
    const [spacexTime, setSpacexTime] = useState({});
    const [anthropicTime, setAnthropic] = useState({});

    const toggleTheme = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.setAttribute('data-theme', !dark ? 'dark' : 'light');
        localStorage.setItem('theme', next ? 'dark' : 'light');
    };

    const calcTime = (target) => {
        const d = new Date(target) - new Date();
        if (d <= 0) return { d: 0, h: 0, m: 0, s: 0 };
        return {
            d: Math.floor(d / 86400000),
            h: Math.floor((d % 86400000) / 3600000),
            m: Math.floor((d % 3600000) / 60000),
            s: Math.floor((d % 60000) / 1000),
        };
    };

    useEffect(() => {
        const tick = () => {
            setSpacexTime(calcTime('2026-06-12T00:00:00'));
            setAnthropic(calcTime('2026-10-01T00:00:00'));
        };
        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const saved = localStorage.getItem('theme');
        if (saved) document.documentElement.setAttribute('data-theme', saved);
    }, []);



    const CountBlock = ({ val, lbl, color }) => (
        <div style={{
            background: 'var(--bg)', borderRadius: '8px', padding: '8px 4px',
            textAlign: 'center', border: '1px solid var(--border)', flex: 1
        }}>
            <div style={{ fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px', color }}>{val ?? '--'}</div>
            <div style={{ fontSize: '8px', color: 'var(--text-muted)', marginTop: '3px', letterSpacing: '0.5px' }}>{lbl}</div>
        </div>
    );

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>

            {/* NAVBAR */}
            <nav style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '18px 28px', borderBottom: '1px solid var(--border)',
                position: 'sticky', top: 0, background: 'var(--bg)', zIndex: 100
            }}>
                <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text)', letterSpacing: '-0.3px' }}>
                    ipo<span style={{ color: 'var(--accent)' }}>.</span>guide
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div
                        onClick={toggleTheme}
                        className={`theme-toggle ${dark ? 'dark' : ''}`}
                    >
                        <div className="theme-knob">
                            {dark ? '🌙' : '☀️'}
                        </div>
                    </div>
                    <button
                        onMouseEnter={() => setMenuOpen(true)}
                        style={{
                            background: 'none', border: 'none', cursor: 'pointer',
                            display: 'flex', flexDirection: 'column', gap: '5px', padding: '4px'
                        }}>
                        {[0, 1, 2].map(i => (
                            <div key={i} style={{ width: '22px', height: '1.5px', background: 'var(--text)' }} />
                        ))}
                    </button>
                </div>
            </nav>

            {/* DRAWER */}
            {menuOpen && (
                <div
                    ref={menuRef}
                    className="drawer-slide"
                    onMouseLeave={() => setMenuOpen(false)}
                    style={{
                        position: 'fixed', top: 0, right: 0, height: '100vh', width: '240px',
                        background: 'var(--bg)', borderLeft: '1px solid var(--border)',
                        padding: '24px 20px', zIndex: 200, display: 'flex', flexDirection: 'column',
                        overflowY: 'auto'
                    }}>
                    <button onClick={() => setMenuOpen(false)} style={{
                        alignSelf: 'flex-end', background: 'none', border: 'none',
                        fontSize: '20px', cursor: 'pointer', color: 'var(--text-muted)', marginBottom: '24px'
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
                            color: label === 'Home' ? 'var(--accent)' : 'var(--text-muted)',
                            textDecoration: 'none', fontSize: '14px',
                            fontWeight: label === 'Home' ? 600 : 400,
                        }}>{label}</Link>
                    ))}

                    <div style={{ height: '1px', background: 'var(--border)', margin: '20px 0' }} />

                    <div style={{ fontSize: '9px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '1.2px', marginBottom: '12px' }}>
                        LATEST NEWS
                    </div>

                    {[
                        { tag: 'SPACEX', tagBg: '#E6F1FB', tagColor: '#185FA5', title: 'SpaceX targets $1.77T valuation in historic June 12 IPO', date: 'Jun 9, 2026', url: 'https://capital.com/en-int/learn/ipo/spacex-ipo' },
                        { tag: 'SPACEX', tagBg: '#E6F1FB', tagColor: '#185FA5', title: "SpaceX's historic IPO: billions in losses and Musk's massive ownership", date: 'May 20, 2026', url: 'https://www.cnbc.com/2026/05/20/spacex-ipo-live-updates.html' },
                        { tag: 'ANTHROPIC', tagBg: '#FAF0EB', tagColor: '#8B4513', title: 'Anthropic files confidential IPO, targets $965B valuation', date: 'Jun 4, 2026', url: 'https://techcrunch.com/2026/06/04/ahead-of-its-ipo-anthropics-daniela-amodei-shrugs-off-doubts-about-ais-returns/' },
                        { tag: 'ANTHROPIC', tagBg: '#FAF0EB', tagColor: '#8B4513', title: 'Anthropic leads IPO race against OpenAI amid AI competition', date: 'Jun 8, 2026', url: 'https://www.gurufocus.com/news/8904873/anthropic-leads-ipo-race-against-openai-amid-ai-market-competition' },
                    ].map(({ tag, tagBg, tagColor, title, date, url }) => (
                        <a key={title} href={url} target="_blank" rel="noreferrer" style={{
                            display: 'block', marginBottom: '12px', paddingBottom: '12px',
                            borderBottom: '1px solid var(--border)', textDecoration: 'none'
                        }}>
                            <div style={{
                                display: 'inline-block', fontSize: '8px', fontWeight: '600',
                                padding: '2px 6px', borderRadius: '4px', marginBottom: '4px',
                                background: tagBg, color: tagColor
                            }}>{tag}</div>
                            <div style={{ fontSize: '11px', fontWeight: '500', color: 'var(--text)', lineHeight: '1.4', marginBottom: '3px' }}>{title}</div>
                            <div style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{date}</div>
                        </a>
                    ))}

                    <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0 16px' }} />

                    <div style={{ fontSize: '9px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '1.2px', marginBottom: '12px' }}>
                        DID YOU KNOW?
                    </div>
                    <div style={{
                        background: 'var(--bg-secondary)', borderRadius: '10px',
                        padding: '12px', border: '1px solid var(--border)'
                    }}>
                        <div style={{ fontSize: '8px', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '6px' }}>
                            {['🚀 SPACEX FACT', '🤖 ANTHROPIC FACT'][Math.floor(Math.random() * 2)]}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text)', lineHeight: '1.6' }}>
                            {[
                                "SpaceX has launched over 250 missions — more than any other company in history.",
                                "Anthropic was founded in 2021 by former OpenAI researchers including siblings Dario and Daniela Amodei.",
                                "Falcon 9 was the first orbital rocket to successfully land and be reused.",
                                "Claude is trained using Constitutional AI — a technique to make AI safer and more honest.",
                                "Elon Musk founded SpaceX in 2002 with $100M of his own money from the PayPal sale.",
                                "Anthropic's valuation grew from $4.1B in 2023 to $965B in 2026 — in just 3 years.",
                            ][Math.floor(Math.random() * 6)]}
                        </div>
                    </div>

                </div>
            )}

            {/* HERO */}
            <section style={{ padding: '72px 8% 56px', display: 'flex', alignItems: 'center', gap: '24px' }}>

                {/* HERO TEXT */}
                <div style={{ flex: 1 }}>
                    <div style={{
                        display: 'inline-block', fontSize: '11px', fontWeight: '500',
                        color: 'var(--accent)', background: 'var(--accent-light)',
                        padding: '4px 12px', borderRadius: '6px', marginBottom: '24px', letterSpacing: '0.4px'
                    }}>
                        SpaceX & Anthropic IPOs — What you need to know
                    </div>
                    <h1 style={{
                        fontSize: 'clamp(28px, 5vw, 42px)', fontWeight: '600',
                        lineHeight: '1.2', letterSpacing: '-0.8px', marginBottom: '20px', color: 'var(--text)'
                    }}>
                        Investing in the future<br />
                        shouldn't feel <span style={{ color: 'var(--accent)' }}>complicated.</span>
                    </h1>
                    <p style={{
                        fontSize: '16px', lineHeight: '1.75', color: 'var(--text-muted)',
                        marginBottom: '36px', maxWidth: '520px'
                    }}>
                        Two of the world's most talked-about companies are about to go public.
                        Here's everything a first-time investor needs to know. NO finance degree required.
                    </p>
                    <a href="/learn" className="cta-btn" style={{
                        display: 'inline-flex', alignItems: 'center', gap: '8px',
                        background: 'var(--accent)', color: '#fff', padding: '13px 24px',
                        borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500'
                    }}>
                        Start learning <span className="btn-arrow">→</span>
                    </a>
                </div>

                {/* COMPANY NAMES */}
                <div style={{
                    flexShrink: 0, display: 'flex', flexDirection: 'column',
                }}>
                    {[
                        { name: 'SPACEX', sector: 'Aerospace & Defence', color: '#005288', font: "'Arial Black', Arial, sans-serif", weight: 900, spacing: '2px', transform: 'uppercase' },
                        { name: 'Anthropic', sector: 'Artificial Intelligence', color: '#CC785C', font: "Georgia, serif", weight: 400, spacing: '0.5px', transform: 'none' },
                    ].map(({ name, sector, color, font, weight, spacing, transform }) => (
                        <div key={name} style={{
                            padding: '20px 28px', borderBottom: name === 'SPACEX' ? '1px solid var(--border)' : 'none',
                        }}>
                            <div style={{
                                fontFamily: font, fontSize: '20px', fontWeight: weight,
                                letterSpacing: spacing, textTransform: transform, color
                            }}>{name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{sector}</div>
                        </div>
                    ))}
                </div>

                {/* COUNTDOWN TIMER */}
                <div style={{
                    flexShrink: 0, width: '300px', border: '1px solid var(--border)',
                    borderRadius: '16px', padding: '24px', background: 'var(--bg-secondary)',
                    display: 'flex', flexDirection: 'column', alignSelf: 'stretch', justifyContent: 'space-between'
                }}>
                    <div style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '16px' }}>
                        ESTIMATED IPO WINDOW
                    </div>
                    {[
                        { name: 'SpaceX', sub: 'Target: June 12, 2026', color: '#005288', time: spacexTime },
                        { name: 'Anthropic', sub: 'Target: October 1, 2026', color: '#CC785C', time: anthropicTime },
                    ].map(({ name, sub, color, time }) => (
                        <div key={name} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text)' }}>{name}</div>
                                    <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{sub}</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <CountBlock val={time.d} lbl="DAYS" color={color} />
                                <CountBlock val={time.h} lbl="HRS" color={color} />
                                <CountBlock val={time.m} lbl="MIN" color={color} />
                                <CountBlock val={time.s} lbl="SEC" color={color} />
                            </div>
                        </div>
                    ))}
                    <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '14px', lineHeight: '1.5' }}>
                        Estimated dates only · Not official · Subject to change
                    </div>
                </div>

                {/* VALUATION TICKER */}
                <div style={{
                    flexShrink: 0, width: '320px', border: '1px solid var(--border)',
                    borderRadius: '16px', padding: '24px', background: 'var(--bg-secondary)',
                    alignSelf: 'stretch'
                }}>
                    <div style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '16px' }}>
                        PRIVATE VALUATIONS
                    </div>
                    {[
                        { name: 'SpaceX', sub: 'Aerospace & Defence', val: '$350B', change: '+12% this year', color: '#005288', points: '0,32 40,28 80,24 110,20 140,18 170,14 200,10 240,6 280,4', dot: '280,4' },
                        { name: 'Anthropic', sub: 'Artificial Intelligence', val: '$61B', change: '+83% this year', color: '#CC785C', points: '0,36 40,32 80,28 110,26 140,20 160,16 190,10 220,6 280,2', dot: '280,2' },
                    ].map(({ name, sub, val, change, color, points, dot }) => (
                        <div key={name} style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0 }} />
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--text)' }}>{name}</div>
                                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>{sub}</div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-1px', color }}>{val}</div>
                                    <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '2px' }}>↑ {change}</div>
                                </div>
                            </div>
                            <svg width="100%" height="40" viewBox="0 0 280 40">
                                <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
                                <polyline points={`${points} 280,40 0,40`} fill={color} opacity="0.08" />
                                <circle cx={dot.split(',')[0]} cy={dot.split(',')[1]} r="3" fill={color} />
                            </svg>
                        </div>
                    ))}
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '14px', lineHeight: '1.5' }}>
                        Based on latest funding rounds · Updated manually · Not live data
                    </div>
                </div>

            </section>

            {/* DIVIDER */}
            <div style={{ height: '1px', background: 'var(--border)', margin: '0 28px' }} />

            {/* IPO EXPLAINER */}
            <section id="learn" style={{ padding: '56px 8%' }}>
                <p style={{ fontSize: '11px', fontWeight: '500', color: 'var(--accent)', letterSpacing: '1px', marginBottom: '12px' }}>
                    THE BASICS
                </p>
                <h2 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '8px', color: 'var(--text)' }}>
                    Wait — what's an IPO?
                </h2>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '32px' }}>
                    Plain English. No jargon. Promise.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    {[
                        { num: '01', title: 'Company grows privately', body: "SpaceX and Anthropic have been funded by private investors — regular people like you can't buy shares yet." },
                        { num: '02', title: 'They go public (IPO)', body: 'An IPO is when a company lists on the stock market for the first time, opening up to everyday investors.' },
                        { num: '03', title: 'You can buy shares', body: 'Once public, anyone with a brokerage account can buy a piece of the company — even just $50 worth.' },
                        { num: '04', title: 'Price goes up or down', body: "Your shares are worth more if the company does well. And less if it doesn't. That's the risk." },
                    ].map(({ num, title, body }) => (
                        <div key={num} style={{
                            background: 'var(--bg-secondary)', borderRadius: '12px',
                            padding: '20px', border: '1px solid var(--border)'
                        }}>
                            <div style={{ fontSize: '11px', fontWeight: '600', color: 'var(--accent)', marginBottom: '10px' }}>{num}</div>
                            <div style={{ fontSize: '14px', fontWeight: '500', color: 'var(--text)', marginBottom: '8px' }}>{title}</div>
                            <div style={{ fontSize: '13px', lineHeight: '1.65', color: 'var(--text-muted)' }}>{body}</div>
                        </div>
                    ))}
                </div>
            </section>
            {/* FOOTER */}
            <footer style={{
                borderTop: '1px solid var(--border)', padding: '40px 8%',
                background: 'var(--bg)', marginTop: '40px'
            }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1.5fr', gap: '40px', marginBottom: '32px' }}>

                    {/* COL 1 — LOGO + SOCIALS */}
                    <div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: 'var(--text)', letterSpacing: '-0.3px', marginBottom: '8px' }}>
                            ipo<span style={{ color: 'var(--accent)' }}>.</span>guide
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '16px' }}>
                            Making IPO investing less scary for first-time investors.
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {[
                                { href: 'https://www.linkedin.com/in/henry-yeo-ba6408299/', label: 'LinkedIn', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
                                { href: 'https://github.com/23bananasinmytummy', label: 'GitHub', icon: 'M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22' },
                                { href: 'https://www.instagram.com/henry.ykd/', label: 'Instagram', icon: 'M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zM17.5 6.5h.01M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2z' },
                            ].map(({ href, label, icon }) => (
                                <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label} style={{
                                    width: '32px', height: '32px', borderRadius: '8px',
                                    border: '1px solid var(--border)', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    background: 'var(--bg)', textDecoration: 'none'
                                }}>
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d={icon} />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* COL 2 — PAGES */}
                    <div>
                        <div style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '14px' }}>
                            PAGES
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {['Home', 'Learn', 'Risk', 'Tools', 'Newsletter'].map(page => (
                                <a key={page} href="/" style={{
                                    fontSize: '13px', color: 'var(--text-muted)',
                                    textDecoration: 'none'
                                }}>{page}</a>
                            ))}
                        </div>
                    </div>

                    {/* COL 3 — DISCLAIMER */}
                    <div>
                        <div style={{ fontSize: '10px', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '14px' }}>
                            DISCLAIMER
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.7' }}>
                            This website is for informational purposes only and does not constitute financial advice. Always do your own research before making any investment decisions. Past performance is not indicative of future results.
                        </div>
                    </div>

                </div>

                {/* BOTTOM ROW */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    paddingTop: '24px', borderTop: '1px solid var(--border)'
                }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>© 2026 ipo.guide · All rights reserved</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Not financial advice · Educational use only</div>
                </div>

            </footer>
        </div>
    );
}
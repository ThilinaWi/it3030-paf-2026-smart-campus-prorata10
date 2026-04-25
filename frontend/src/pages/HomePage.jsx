import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// ─── Styles ───────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

  /* ── reset + root ── */
  .hp *, .hp *::before, .hp *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .hp a { color: inherit; text-decoration: none; }
  .hp button { font-family: inherit; cursor: pointer; border: none; background: none; }
  .hp ul { list-style: none; }

  .hp {
    /* ── palette: warm teal + slate ── */
    --white:       #ffffff;
    --bg:          #f8faf9;
    --bg-alt:      #f0f4f2;
    --border:      #dde5e1;
    --border-lt:   #eaf0ed;

    --text:        #0d1f19;
    --text-2:      #2e4a40;
    --text-3:      #5c7a70;
    --text-4:      #91ada6;

    --accent:      #0d9373;
    --accent-dk:   #0a7a5f;
    --accent-lt:   #e6f7f3;
    --accent-glow: rgba(13,147,115,.15);

    --teal-2:      #14b8a0;
    --sage:        #6ab89e;
    --green:       #22c55e;
    --green-bg:    #f0fdf4;

    --font:        'Plus Jakarta Sans', -apple-system, system-ui, sans-serif;
    --nav-h:       64px;
    --max-w:       1180px;
    --r:           16px;
    --r-sm:        10px;
    --r-xs:        6px;
    --sh-sm:       0 1px 3px rgba(0,0,0,.05);
    --sh:          0 4px 20px rgba(0,0,0,.06);
    --sh-lg:       0 16px 48px rgba(0,0,0,.08);
    --ease:        cubic-bezier(.4,0,.2,1);

    font-family: var(--font);
    color: var(--text);
    background: var(--bg);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
    margin-left: -272px;
    margin-top: -64px;
    width: calc(100% + 272px);
    position: relative;
  }
  @media (max-width: 1024px) {
    .hp { margin-left: 0; width: 100%; margin-top: -64px; }
  }

  /* ── keyframes ── */
  @keyframes hp-fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes hp-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes hp-float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-9px); }
  }
  @keyframes hp-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: .45; }
  }
  @keyframes hp-scaleIn {
    from { opacity: 0; transform: scale(.94); }
    to   { opacity: 1; transform: scale(1); }
  }
  /* FIX: shimmer uses opacity only — no background-clip animation (avoids Safari flicker) */
  @keyframes hp-shimmer {
    0%, 100% { opacity: 1; }
    50%       { opacity: .78; }
  }

  /* ── NAVBAR ── */
  .hp-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    height: var(--nav-h);
    background: rgba(248,250,249,.82);
    backdrop-filter: blur(20px) saturate(1.5);
    -webkit-backdrop-filter: blur(20px) saturate(1.5);
    border-bottom: 1px solid rgba(221,229,225,.7);
    transition: background .3s var(--ease), box-shadow .3s var(--ease);
  }
  .hp-nav.scrolled {
    background: rgba(255,255,255,.94);
    box-shadow: 0 1px 12px rgba(0,0,0,.06);
  }
  .hp-nav-inner {
    max-width: var(--max-w); margin: 0 auto; height: 100%;
    padding: 0 24px;
    display: flex; align-items: center; justify-content: space-between; gap: 16px;
  }
  .hp-brand { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
  .hp-brand-icon {
    width: 34px; height: 34px; border-radius: 10px;
    background: var(--accent);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; color: #fff; font-weight: 800; letter-spacing: -.02em;
    box-shadow: 0 2px 8px var(--accent-glow);
  }
  .hp-brand-name { font-weight: 700; font-size: .95rem; color: var(--text); letter-spacing: -.02em; }
  .hp-brand-name span { color: var(--accent); }

  .hp-nav-links { display: flex; align-items: center; gap: 2px; margin-left: auto; }
  .hp-nav-links a {
    font-size: .85rem; font-weight: 500; color: var(--text-3);
    padding: 6px 14px; border-radius: var(--r-xs);
    transition: color .18s var(--ease), background .18s var(--ease);
  }
  .hp-nav-links a:hover { color: var(--text); background: var(--bg-alt); }

  .hp-nav-cta { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }

  .hp-btn-ghost {
    font-size: .85rem; font-weight: 500; color: var(--text-2);
    padding: 7px 16px; border-radius: var(--r-xs);
    border: 1px solid var(--border); background: var(--white);
    transition: border-color .18s var(--ease), color .18s var(--ease);
    display: inline-flex; align-items: center; gap: 6px;
  }
  .hp-btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

  .hp-btn-primary {
    font-size: .85rem; font-weight: 600; color: #fff;
    padding: 7px 18px; border-radius: var(--r-xs);
    background: var(--accent);
    display: inline-flex; align-items: center; gap: 6px;
    transition: background .18s var(--ease), transform .18s var(--ease), box-shadow .18s var(--ease);
    box-shadow: 0 1px 4px var(--accent-glow);
  }
  .hp-btn-primary:hover {
    background: var(--accent-dk);
    transform: translateY(-1px);
    box-shadow: 0 4px 14px var(--accent-glow);
  }
  .hp-btn-primary:active { transform: translateY(0); }

  .hp-hamburger {
    display: none; width: 36px; height: 36px; border-radius: var(--r-xs);
    border: 1px solid var(--border); align-items: center; justify-content: center;
    font-size: 16px; color: var(--text); transition: background .18s;
  }
  .hp-hamburger:hover { background: var(--bg-alt); }

  .hp-mobile-menu {
    position: fixed; top: var(--nav-h); left: 0; right: 0; z-index: 99;
    background: var(--white); border-bottom: 1px solid var(--border);
    padding: 12px 24px 20px;
    display: flex; flex-direction: column; gap: 2px;
    box-shadow: var(--sh);
    animation: hp-fadeIn .15s var(--ease);
  }
  .hp-mobile-menu a {
    font-size: .9rem; font-weight: 500; color: var(--text-2);
    padding: 10px 12px; border-radius: var(--r-xs);
    transition: background .15s;
  }
  .hp-mobile-menu a:hover { background: var(--bg-alt); color: var(--text); }
  .hp-mobile-cta { margin-top: 12px; }
  .hp-mobile-cta .hp-btn-primary { width: 100%; justify-content: center; padding: 11px; }

  /* ── HERO ── */
  .hp-hero {
    padding: calc(var(--nav-h) + 80px) 24px 80px;
    max-width: var(--max-w); margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 56px; align-items: center;
    min-height: calc(100vh - 60px);
  }

  /* FIX: individual animation on each child — no single wrapper animation that fights layout */
  .hp-hero-left .hp-hero-badge { animation: hp-fadeUp .6s .05s var(--ease) both; }
  .hp-hero-left .hp-hero-h1    { animation: hp-fadeUp .6s .15s var(--ease) both; }
  .hp-hero-left .hp-hero-desc  { animation: hp-fadeUp .6s .25s var(--ease) both; }
  .hp-hero-left .hp-hero-btns  { animation: hp-fadeUp .6s .35s var(--ease) both; }
  .hp-hero-left .hp-hero-trust { animation: hp-fadeUp .6s .45s var(--ease) both; }

  .hp-hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 5px 14px 5px 8px; border-radius: 100px;
    background: var(--accent-lt); border: 1px solid rgba(13,147,115,.18);
    font-size: .78rem; font-weight: 600; color: var(--accent);
    letter-spacing: .02em; margin-bottom: 22px;
  }
  .hp-hero-badge-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--accent); animation: hp-pulse 2s infinite;
  }

  .hp-hero-h1 {
    font-size: clamp(2.4rem, 4.5vw, 3.6rem);
    font-weight: 800; line-height: 1.08; letter-spacing: -.045em;
    color: var(--text); margin-bottom: 20px;
  }
  /* FIX: solid colour accent — no animated background-clip trick */
  .hp-accent-text {
    color: var(--accent);
    display: inline-block;
    animation: hp-shimmer 3s ease-in-out infinite;
  }

  .hp-hero-desc {
    font-size: 1rem; color: var(--text-3);
    line-height: 1.75; max-width: 460px; margin-bottom: 30px;
  }

  .hp-hero-btns {
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
    margin-bottom: 32px;
  }
  .hp-hero-btns .hp-btn-primary { padding: 11px 24px; font-size: .9rem; border-radius: var(--r-sm); }
  .hp-hero-btns .hp-btn-ghost   { padding: 10px 22px; font-size: .9rem; border-radius: var(--r-sm); }

  .hp-hero-trust { display: flex; align-items: center; gap: 10px; }
  .hp-trust-avatars { display: flex; }
  .hp-trust-av {
    width: 28px; height: 28px; border-radius: 50%;
    border: 2px solid var(--white); margin-left: -6px;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; box-shadow: var(--sh-sm);
  }
  .hp-trust-av:first-child { margin-left: 0; }
  .hp-trust-text { font-size: .78rem; color: var(--text-4); }
  .hp-trust-text strong { color: var(--text-2); font-weight: 600; }

  /* ── HERO VISUAL ── */
  /* FIX: explicit position:relative so floats don't overflow to page root */
  .hp-hero-right {
    position: relative;
    animation: hp-scaleIn .7s .2s var(--ease) both;
    will-change: transform, opacity;
  }

  .hp-hero-card {
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--r); box-shadow: var(--sh-lg); overflow: hidden;
  }
  .hp-hero-card-bar {
    height: 3px;
    background: linear-gradient(90deg, var(--accent), var(--teal-2), var(--sage));
  }
  .hp-hero-card-head {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 20px; border-bottom: 1px solid var(--border-lt);
  }
  .hp-hero-card-title { font-size: .88rem; font-weight: 700; color: var(--text); }
  .hp-hero-card-live {
    font-size: .68rem; font-weight: 600; color: var(--green);
    background: var(--green-bg); border: 1px solid rgba(34,197,94,.15);
    padding: 2px 10px; border-radius: 100px;
    display: flex; align-items: center; gap: 5px;
  }
  .hp-live-dot {
    width: 5px; height: 5px; border-radius: 50%;
    background: var(--green); animation: hp-pulse 1.5s infinite;
  }
  .hp-hero-card-body { padding: 16px 20px; }

  .hp-card-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
  .hp-card-stat {
    padding: 14px; border-radius: var(--r-sm);
    background: var(--bg); border: 1px solid var(--border-lt);
    transition: transform .2s var(--ease), box-shadow .2s var(--ease);
  }
  .hp-card-stat:hover { transform: translateY(-2px); box-shadow: var(--sh-sm); }
  .hp-card-stat-val {
    font-size: 1.5rem; font-weight: 800; color: var(--text);
    line-height: 1; margin-bottom: 3px; letter-spacing: -.03em;
  }
  .hp-card-stat-lbl { font-size: .7rem; color: var(--text-4); font-weight: 500; }

  .hp-card-rows { display: flex; flex-direction: column; gap: 6px; }
  .hp-card-row {
    display: flex; align-items: center; gap: 10px;
    padding: 8px 12px; border-radius: var(--r-xs);
    background: var(--bg); border: 1px solid var(--border-lt); font-size: .8rem;
  }
  .hp-card-row-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
  .hp-card-row-title { flex: 1; color: var(--text-2); font-weight: 500; }
  .hp-card-row-tag {
    font-size: .65rem; font-weight: 700; padding: 1px 8px;
    border-radius: 100px; text-transform: uppercase; letter-spacing: .04em;
  }

  /* FIX: pointer-events:none prevents float cards blocking card interactions */
  .hp-float {
    position: absolute;
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--r-sm); padding: 10px 14px;
    box-shadow: var(--sh);
    display: flex; align-items: center; gap: 10px;
    font-size: .78rem; z-index: 2; pointer-events: none;
    animation: hp-float 4s ease-in-out infinite;
  }
  .hp-float-1 { top: -14px; right: -12px; animation-delay: 0s; }
  .hp-float-2 { bottom: 28px; left: -16px; animation-delay: 1.8s; }
  .hp-float-icon { font-size: 18px; line-height: 1; }
  .hp-float-label { font-weight: 600; color: var(--text); font-size: .78rem; }
  .hp-float-sub { font-size: .68rem; color: var(--text-4); margin-top: 1px; }

  /* ── SECTION ── */
  .hp-section { max-width: var(--max-w); margin: 0 auto; padding: 88px 24px; }
  .hp-section-tag {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: .72rem; font-weight: 700; letter-spacing: .08em;
    text-transform: uppercase; color: var(--accent); margin-bottom: 10px;
  }
  .hp-section-tag-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); }
  .hp-section-title {
    font-size: clamp(1.6rem, 3vw, 2.4rem);
    font-weight: 800; letter-spacing: -.04em;
    color: var(--text); line-height: 1.12; margin-bottom: 12px;
  }
  .hp-section-desc { font-size: .95rem; color: var(--text-3); max-width: 500px; line-height: 1.7; }
  .hp-section-head { margin-bottom: 48px; }

  /* ── FEATURES ── */
  .hp-features { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .hp-feature {
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--r); padding: 32px 28px;
    transition: box-shadow .25s var(--ease), transform .25s var(--ease), border-color .25s var(--ease);
    position: relative; overflow: hidden;
  }
  .hp-feature::after {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: var(--_fc, var(--accent)); opacity: 0;
    transition: opacity .25s var(--ease);
  }
  .hp-feature:hover { box-shadow: var(--sh-lg); transform: translateY(-4px); border-color: transparent; }
  .hp-feature:hover::after { opacity: 1; }
  .hp-feature-icon {
    width: 48px; height: 48px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin-bottom: 18px;
    transition: transform .25s var(--ease);
  }
  .hp-feature:hover .hp-feature-icon { transform: scale(1.08) rotate(-3deg); }
  .hp-feature-title { font-size: 1rem; font-weight: 700; color: var(--text); margin-bottom: 8px; letter-spacing: -.01em; }
  .hp-feature-desc { font-size: .85rem; color: var(--text-3); line-height: 1.65; }

  /* ── CTA ── */
  .hp-cta-wrap { padding: 0 24px 88px; max-width: var(--max-w); margin: 0 auto; }
  .hp-cta {
    background: var(--accent);
    border-radius: var(--r); padding: 56px 48px; text-align: center;
    position: relative; overflow: hidden;
  }
  .hp-cta::before {
    content: ''; position: absolute; top: -60px; right: -60px;
    width: 240px; height: 240px; border-radius: 50%;
    background: rgba(255,255,255,.07); pointer-events: none;
  }
  .hp-cta::after {
    content: ''; position: absolute; bottom: -40px; left: -40px;
    width: 180px; height: 180px; border-radius: 50%;
    background: rgba(255,255,255,.05); pointer-events: none;
  }
  .hp-cta-title {
    font-size: clamp(1.5rem, 2.5vw, 2rem); font-weight: 800;
    letter-spacing: -.04em; color: #fff;
    margin-bottom: 10px; position: relative; z-index: 1;
  }
  .hp-cta-desc {
    font-size: .9rem; color: rgba(255,255,255,.82); max-width: 420px;
    margin: 0 auto 26px; line-height: 1.7; position: relative; z-index: 1;
  }
  .hp-cta-btns { display: flex; align-items: center; gap: 12px; justify-content: center; position: relative; z-index: 1; }
  .hp-btn-cta {
    padding: 12px 28px; font-size: .9rem; border-radius: var(--r-sm);
    font-weight: 600; background: #fff; color: var(--accent-dk);
    display: inline-flex; align-items: center; gap: 6px;
    transition: transform .2s var(--ease), box-shadow .2s var(--ease);
    box-shadow: 0 2px 8px rgba(0,0,0,.1);
  }
  .hp-btn-cta:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(0,0,0,.14); }
  .hp-btn-cta:active { transform: translateY(0); }

  /* ── FOOTER ── */
  .hp-footer { background: #071410; color: rgba(255,255,255,.65); padding: 48px 24px 24px; }
  .hp-footer-inner { max-width: var(--max-w); margin: 0 auto; }
  .hp-footer-top {
    display: grid; grid-template-columns: 2fr 1fr 1fr;
    gap: 40px; padding-bottom: 32px;
    border-bottom: 1px solid rgba(255,255,255,.08); margin-bottom: 20px;
  }
  .hp-footer-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .hp-footer-brand-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--accent); display: flex; align-items: center; justify-content: center;
    font-size: 14px; box-shadow: 0 2px 8px rgba(13,147,115,.35);
  }
  .hp-footer-brand-name { font-weight: 700; font-size: .88rem; color: #fff; }
  .hp-footer-tagline { font-size: .78rem; line-height: 1.65; max-width: 260px; color: rgba(255,255,255,.42); }
  .hp-footer-col-title {
    font-weight: 700; font-size: .75rem; letter-spacing: .07em;
    text-transform: uppercase; color: rgba(255,255,255,.9); margin-bottom: 14px;
  }
  .hp-footer-links { display: flex; flex-direction: column; gap: 7px; }
  .hp-footer-links a { font-size: .78rem; color: rgba(255,255,255,.45); transition: color .18s; }
  .hp-footer-links a:hover { color: rgba(13,147,115,.9); }
  .hp-footer-bottom { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .hp-footer-copy { font-size: .72rem; color: rgba(255,255,255,.32); }

  /* ── RESPONSIVE ── */
  @media (max-width: 1024px) {
    .hp-features { grid-template-columns: repeat(2, 1fr); }
    .hp-footer-top { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 768px) {
    .hp-hero { grid-template-columns: 1fr; padding-top: calc(var(--nav-h) + 48px); min-height: auto; }
    .hp-hero-right { display: none; }
    .hp-features { grid-template-columns: 1fr; }
    .hp-cta { padding: 40px 24px; }
    .hp-footer-top { grid-template-columns: 1fr; gap: 24px; }
    .hp-nav-links, .hp-nav-cta .hp-btn-ghost { display: none; }
    .hp-hamburger { display: flex; }
  }
  @media (max-width: 480px) {
    .hp-hero-btns { flex-direction: column; align-items: stretch; }
    .hp-cta-btns { flex-direction: column; }
    .hp-footer-bottom { flex-direction: column; align-items: flex-start; }
  }
`;

// ─── Feature data ──────────────────────────────────────────────────────────────
const features = [
  {
    icon: '🚨', title: 'Incident Management',
    desc: 'Report campus maintenance issues, assign them to technicians, and track resolution progress in real-time with priority levels.',
    color: '#e05c3a', bg: '#fef3f0',
  },
  {
    icon: '📅', title: 'Smart Booking System',
    desc: 'Reserve rooms, labs, and equipment with real-time availability. Admins can approve or reject requests with a single click.',
    color: '#0d9373', bg: '#e6f7f3',
  },
  {
    icon: '🏢', title: 'Resource Management',
    desc: 'Browse and manage the full campus resource catalogue — classrooms, labs, equipment — with search, filtering, and status tracking.',
    color: '#0891b2', bg: '#ecfeff',
  },
  {
    icon: '🔔', title: 'Live Notifications',
    desc: 'Real-time alerts for booking approvals, incident updates, and role-based assignments. Stay informed across all campus operations.',
    color: '#e8941a', bg: '#fff8ed',
  },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <nav className={`hp-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="hp-nav-inner">
          <Link to="/" className="hp-brand">
            <div className="hp-brand-icon">SC</div>
            <span className="hp-brand-name">Smart<span>Campus</span></span>
          </Link>

          <ul className="hp-nav-links">
            <li><a href="#features">Features</a></li>
          </ul>

          <div className="hp-nav-cta">
            <Link to="/login" className="hp-btn-ghost">Sign In</Link>
            <button
              className="hp-hamburger"
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="hp-mobile-menu">
          <a href="#features" onClick={() => setMobileOpen(false)}>Features</a>
          <div className="hp-mobile-cta">
            <Link to="/login" className="hp-btn-primary" onClick={() => setMobileOpen(false)}>
              Sign In
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="hp-hero">
      {/* ── Left ── */}
      <div className="hp-hero-left">
        <div className="hp-hero-badge">
          <span className="hp-hero-badge-dot" />
          University Operations Platform
        </div>

        <h1 className="hp-hero-h1">
          Your campus,<br />
          <span className="hp-accent-text">one platform</span>
        </h1>

        <p className="hp-hero-desc">
          Manage incidents, bookings, resources and notifications — all unified
          in a single intelligent hub built for modern university campuses.
        </p>

        <div className="hp-hero-btns">
          <Link to="/login" className="hp-btn-primary">Sign In or Register →</Link>
          <a href="#features" className="hp-btn-ghost">See Features</a>
        </div>

        <div className="hp-hero-trust">
          <div className="hp-trust-avatars">
            {[
              { bg: '#0d9373', l: '👤' },
              { bg: '#0891b2', l: '🔧' },
              { bg: '#6ab89e', l: '⚙️' },
            ].map((a, i) => (
              <div className="hp-trust-av" key={i} style={{ background: a.bg }}>{a.l}</div>
            ))}
          </div>
          <span className="hp-trust-text">
            Built for <strong>Students, Technicians &amp; Admins</strong>
          </span>
        </div>
      </div>

      {/* ── Right ── */}
      <div className="hp-hero-right">
        <div className="hp-hero-card">
          <div className="hp-hero-card-bar" />
          <div className="hp-hero-card-head">
            <span className="hp-hero-card-title">Campus Dashboard</span>
            <span className="hp-hero-card-live">
              <span className="hp-live-dot" /> Live
            </span>
          </div>
          <div className="hp-hero-card-body">
            <div className="hp-card-stats">
              {[
                { v: '12', l: 'Open Incidents' },
                { v: '5',  l: 'Active Bookings' },
                { v: '3',  l: 'Pending Approvals' },
                { v: '48', l: 'Resources' },
              ].map((s, i) => (
                <div className="hp-card-stat" key={i}>
                  <div className="hp-card-stat-val">{s.v}</div>
                  <div className="hp-card-stat-lbl">{s.l}</div>
                </div>
              ))}
            </div>
            <div className="hp-card-rows">
              {[
                { t: 'Lecture Hall B — AC fault',     dot: '#ef4444', tag: 'HIGH',     tagBg: '#fef2f2', tagC: '#dc2626' },
                { t: 'Seminar Room 3 — Booking',       dot: '#0d9373', tag: 'APPROVED', tagBg: '#e6f7f3', tagC: '#0a7a5f' },
                { t: 'Library PC Lab — Network issue', dot: '#f59e0b', tag: 'PENDING',  tagBg: '#fff8ed', tagC: '#b45309' },
              ].map((r, i) => (
                <div className="hp-card-row" key={i}>
                  <div className="hp-card-row-dot" style={{ background: r.dot }} />
                  <span className="hp-card-row-title">{r.t}</span>
                  <span className="hp-card-row-tag" style={{ background: r.tagBg, color: r.tagC }}>{r.tag}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="hp">
      <style>{css}</style>
      <Nav />

      <main>
        <Hero />

        {/* Features */}
        <section className="hp-section" id="features">
          <div className="hp-section-head">
            <div className="hp-section-tag">
              <span className="hp-section-tag-dot" /> Core Modules
            </div>
            <h2 className="hp-section-title">Everything your campus needs</h2>
            <p className="hp-section-desc">
              Four integrated modules that cover every operational workflow —
              from incident reports to resource bookings.
            </p>
          </div>
          <div className="hp-features">
            {features.map(f => (
              <div
                className="hp-feature"
                key={f.title}
                style={{ '--_fc': f.color }}
              >
                <div className="hp-feature-icon" style={{ background: f.bg, color: f.color }}>
                  {f.icon}
                </div>
                <div className="hp-feature-title">{f.title}</div>
                <p className="hp-feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="hp-cta-wrap">
          <div className="hp-cta">
            <h2 className="hp-cta-title">Ready to get started?</h2>
            <p className="hp-cta-desc">
              Create an account with email and password, or continue with your
              university Google account.
            </p>
            <div className="hp-cta-btns">
              <Link to="/login" className="hp-btn-cta">Open Sign In Page →</Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="hp-footer">
        <div className="hp-footer-inner">
          <div className="hp-footer-top">
            <div>
              <div className="hp-footer-brand">
                <div className="hp-footer-brand-icon">🏫</div>
                <span className="hp-footer-brand-name">Smart Campus</span>
              </div>
              <p className="hp-footer-tagline">
                Centralized operations hub for modern university campuses —
                incidents, bookings, resources &amp; notifications.
              </p>
            </div>
            <div>
              <div className="hp-footer-col-title">Platform</div>
              <ul className="hp-footer-links">
                {['Incident Management', 'Smart Bookings', 'Resources', 'Notifications'].map(l => (
                  <li key={l}><Link to="/login">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <div className="hp-footer-col-title">Access</div>
              <ul className="hp-footer-links">
                {['Sign In', 'Student Portal', 'Technician Portal', 'Admin Dashboard'].map(l => (
                  <li key={l}><Link to="/login">{l}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="hp-footer-bottom">
            <span className="hp-footer-copy">
              © {new Date().getFullYear()} Smart Campus Operations Hub
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

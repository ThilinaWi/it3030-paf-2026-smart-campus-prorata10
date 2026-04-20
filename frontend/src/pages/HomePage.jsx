import { useState, useEffect } from 'react';

// ─── Inline Styles ────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --white: #ffffff;
    --bg: #f7f6f3;
    --bg-card: #ffffff;
    --border: #e8e5df;
    --border-light: #f0ede7;
    --text-primary: #1a1714;
    --text-secondary: #6b6560;
    --text-muted: #a09a93;
    --accent: #2563eb;
    --accent-light: #eff4ff;
    --accent-hover: #1d4ed8;
    --green: #16a34a;
    --green-bg: #f0fdf4;
    --amber: #d97706;
    --amber-bg: #fffbeb;
    --red: #dc2626;
    --red-bg: #fef2f2;
    --shadow-sm: 0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,.07), 0 2px 6px rgba(0,0,0,.04);
    --shadow-lg: 0 12px 40px rgba(0,0,0,.10), 0 4px 12px rgba(0,0,0,.06);
    --radius: 14px;
    --radius-sm: 8px;
    --radius-xl: 24px;
    --font-display: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    --font-body: 'DM Sans', 'Inter', sans-serif;
    --nav-h: 68px;
    --transition: 0.22s cubic-bezier(.4,0,.2,1);
  }

  /* ── HOMEPAGE WRAPPER — cancels parent .main-content margin/padding ── */
  .sc-homepage-wrap {
    margin-left: -272px;
    margin-top: calc(-1 * var(--navbar-height, 64px));
    padding-top: 0;
    width: calc(100% + 272px);
    position: relative;
    overflow-x: hidden;
  }
  @media (max-width: 1024px) {
    .sc-homepage-wrap {
      margin-left: 0;
      width: 100%;
    }
  }

  html { scroll-behavior: smooth; }

  body {
    font-family: var(--font-body);
    background: var(--bg);
    color: var(--text-primary);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  /* ── NAVBAR ───────────────────────────────────────────────────── */
  .sc-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    height: var(--nav-h);
    background: rgba(247,246,243,.88);
    backdrop-filter: blur(18px) saturate(1.4);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center;
    transition: box-shadow var(--transition);
  }
  .sc-nav.scrolled { box-shadow: var(--shadow-md); }
  .sc-nav-inner {
    max-width: 1200px; width: 100%; margin: 0 auto;
    padding: 0 24px;
    display: flex; align-items: center; justify-content: space-between; gap: 24px;
  }
  .sc-brand {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; flex-shrink: 0;
  }
  .sc-brand-logo {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--accent); display: flex; align-items: center; justify-content: center;
    font-size: 18px; box-shadow: 0 2px 8px rgba(37,99,235,.35);
  }
  .sc-brand-name {
    font-family: var(--font-display);
    font-weight: 700; font-size: 1.05rem;
    color: var(--text-primary); letter-spacing: -.02em;
  }
  .sc-brand-name span { color: var(--accent); }

  .sc-nav-links {
    display: flex; align-items: center; gap: 4px;
    list-style: none;
  }
  .sc-nav-links a {
    text-decoration: none;
    font-size: .875rem; font-weight: 500;
    color: var(--text-secondary);
    padding: 6px 14px; border-radius: 8px;
    transition: color var(--transition), background var(--transition);
  }
  .sc-nav-links a:hover { color: var(--text-primary); background: var(--border-light); }
  .sc-nav-links a.active { color: var(--accent); background: var(--accent-light); }

  .sc-nav-cta {
    display: flex; align-items: center; gap: 10px; flex-shrink: 0;
  }
  .btn-ghost {
    background: none; border: 1px solid var(--border);
    color: var(--text-primary); font-family: var(--font-body);
    font-size: .875rem; font-weight: 500;
    padding: 8px 18px; border-radius: var(--radius-sm);
    cursor: pointer; transition: all var(--transition);
    text-decoration: none; display: inline-flex; align-items: center;
  }
  .btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
  .btn-primary {
    background: var(--accent); border: none;
    color: #fff; font-family: var(--font-body);
    font-size: .875rem; font-weight: 600;
    padding: 8px 20px; border-radius: var(--radius-sm);
    cursor: pointer; transition: all var(--transition);
    text-decoration: none; display: inline-flex; align-items: center; gap: 6px;
    box-shadow: 0 2px 8px rgba(37,99,235,.3);
  }
  .btn-primary:hover { background: var(--accent-hover); box-shadow: 0 4px 14px rgba(37,99,235,.4); transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }

  .nav-hamburger {
    display: none; background: none; border: 1px solid var(--border);
    width: 38px; height: 38px; border-radius: var(--radius-sm);
    align-items: center; justify-content: center; cursor: pointer;
    color: var(--text-primary); font-size: 18px;
    transition: all var(--transition);
  }
  .nav-hamburger:hover { background: var(--border-light); }

  /* mobile menu */
  .sc-mobile-menu {
    position: fixed; top: var(--nav-h); left: 0; right: 0; z-index: 99;
    background: var(--white); border-bottom: 1px solid var(--border);
    padding: 16px 24px 24px;
    box-shadow: var(--shadow-md);
    display: flex; flex-direction: column; gap: 4px;
    animation: slideDown .2s ease;
  }
  @keyframes slideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }
  .sc-mobile-menu a {
    text-decoration: none; font-size: .95rem; font-weight: 500;
    color: var(--text-secondary); padding: 10px 14px;
    border-radius: var(--radius-sm);
    transition: all var(--transition);
  }
  .sc-mobile-menu a:hover { color: var(--text-primary); background: var(--bg); }
  .sc-mobile-menu .mobile-cta { margin-top: 12px; }
  .sc-mobile-menu .btn-primary { width: 100%; justify-content: center; padding: 12px; }

  /* ── HERO ─────────────────────────────────────────────────────── */
  .sc-hero {
    padding-top: calc(var(--nav-h) + 72px);
    padding-bottom: 80px;
    padding-left: 24px; padding-right: 24px;
    max-width: 1200px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr;
    gap: 64px; align-items: center;
  }
  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: var(--accent-light); color: var(--accent);
    border: 1px solid #bfdbfe;
    padding: 5px 14px; border-radius: 100px;
    font-size: .8rem; font-weight: 600; letter-spacing: .03em;
    text-transform: uppercase; margin-bottom: 20px;
    animation: fadeUp .6s ease both;
  }
  .hero-badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse 2s infinite; }
  @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:.4;} }

  .hero-title {
    font-family: var(--font-display);
    font-size: clamp(2.6rem, 5vw, 3.8rem);
    font-weight: 800; line-height: 1.08;
    letter-spacing: -.04em; color: var(--text-primary);
    margin-bottom: 20px;
    font-style: normal;
    animation: fadeUp .6s .1s ease both;
  }
  .hero-title .accent-word {
    color: var(--accent);
    position: relative; display: inline-block;
  }
  .hero-title .accent-word::after {
    content: ''; position: absolute;
    bottom: 4px; left: 0; right: 0; height: 3px;
    background: var(--accent); border-radius: 2px; opacity: .3;
  }

  .hero-desc {
    font-size: 1.05rem; color: var(--text-secondary);
    line-height: 1.7; margin-bottom: 36px; max-width: 480px;
    font-weight: 300;
    animation: fadeUp .6s .2s ease both;
  }

  .hero-actions {
    display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
    animation: fadeUp .6s .3s ease both;
  }
  .btn-hero {
    font-size: 1rem; padding: 13px 28px; border-radius: 10px;
    font-weight: 600;
  }
  .hero-trust {
    display: flex; align-items: center; gap: 8px;
    font-size: .8rem; color: var(--text-muted); margin-top: 32px;
    animation: fadeUp .6s .4s ease both;
  }
  .trust-icons { display: flex; gap: -4px; }
  .trust-avatar {
    width: 26px; height: 26px; border-radius: 50%;
    border: 2px solid var(--white); display: flex; align-items: center;
    justify-content: center; font-size: 12px;
    margin-left: -6px; background: var(--border-light);
  }
  .trust-avatar:first-child { margin-left: 0; }

  /* hero visual */
  .hero-visual {
    position: relative;
    animation: fadeUp .7s .2s ease both;
  }
  .hero-card {
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--radius-xl); padding: 24px;
    box-shadow: var(--shadow-lg);
    position: relative; overflow: hidden;
  }
  .hero-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 4px;
    background: linear-gradient(90deg, var(--accent), #60a5fa, #34d399);
  }
  .hero-card-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px;
  }
  .hero-card-title {
    font-family: var(--font-display); font-weight: 700;
    font-size: 1rem; color: var(--text-primary);
  }
  .hc-badge {
    font-size: .7rem; font-weight: 600; padding: 3px 10px;
    border-radius: 100px; background: var(--green-bg); color: var(--green);
  }
  .hc-stats {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
    margin-bottom: 20px;
  }
  .hc-stat {
    background: var(--bg); border-radius: var(--radius-sm);
    padding: 14px; border: 1px solid var(--border-light);
    transition: transform var(--transition);
  }
  .hc-stat:hover { transform: translateY(-2px); }
  .hc-stat-val {
    font-family: var(--font-display); font-size: 1.6rem;
    font-weight: 800; color: var(--text-primary); line-height: 1;
    margin-bottom: 4px;
  }
  .hc-stat-lbl { font-size: .75rem; color: var(--text-muted); }
  .hc-incidents { display: flex; flex-direction: column; gap: 8px; }
  .hc-incident {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 12px; border-radius: var(--radius-sm);
    border: 1px solid var(--border-light); background: var(--bg);
    font-size: .82rem;
  }
  .hc-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .hc-incident-title { flex: 1; color: var(--text-primary); font-weight: 500; }
  .hc-incident-tag {
    font-size: .7rem; font-weight: 600; padding: 2px 8px;
    border-radius: 100px;
  }

  /* floating cards */
  .float-card {
    position: absolute;
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 12px 16px;
    box-shadow: var(--shadow-md); font-size: .8rem;
    animation: float 4s ease-in-out infinite;
  }
  @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
  .float-card-1 {
    top: -18px; right: -16px;
    display: flex; align-items: center; gap: 8px;
    animation-delay: 0s;
  }
  .float-card-2 {
    bottom: 30px; left: -20px;
    display: flex; align-items: center; gap: 8px;
    animation-delay: 1.5s;
  }
  .float-icon { font-size: 20px; }
  .float-label { font-weight: 600; color: var(--text-primary); }
  .float-sub { color: var(--text-muted); font-size: .72rem; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── FEATURES STRIP ───────────────────────────────────────────── */
  .sc-strip {
    background: var(--accent);
    padding: 14px 24px;
    overflow: hidden;
  }
  .sc-strip-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; gap: 32px;
    justify-content: center; flex-wrap: wrap;
  }
  .strip-item {
    display: flex; align-items: center; gap: 8px;
    font-size: .82rem; font-weight: 500; color: rgba(255,255,255,.9);
    white-space: nowrap;
  }
  .strip-item svg { opacity: .8; }
  .strip-sep { color: rgba(255,255,255,.3); font-size: 1rem; }

  /* ── SECTION ──────────────────────────────────────────────────── */
  .sc-section {
    max-width: 1200px; margin: 0 auto;
    padding: 96px 24px;
  }
  .section-eyebrow {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: .75rem; font-weight: 700; letter-spacing: .08em;
    text-transform: uppercase; color: var(--accent);
    margin-bottom: 12px;
  }
  .section-title {
    font-family: var(--font-display);
    font-size: clamp(1.8rem, 3.5vw, 2.8rem);
    font-weight: 800; letter-spacing: -.04em;
    color: var(--text-primary); margin-bottom: 14px; line-height: 1.15;
    font-style: normal;
  }
  .section-desc {
    font-size: 1rem; color: var(--text-secondary);
    max-width: 520px; line-height: 1.7; font-weight: 300;
  }
  .section-header { margin-bottom: 52px; }
  .section-header-centered { text-align: center; }
  .section-header-centered .section-desc { margin: 0 auto; }

  /* ── FEATURES GRID ────────────────────────────────────────────── */
  .features-grid {
    display: grid; grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  .feature-card {
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 28px 24px;
    transition: all var(--transition);
    position: relative; overflow: hidden;
  }
  .feature-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: var(--fc-color, var(--accent)); opacity: 0;
    transition: opacity var(--transition);
  }
  .feature-card:hover { box-shadow: var(--shadow-lg); transform: translateY(-4px); border-color: transparent; }
  .feature-card:hover::before { opacity: 1; }
  .feature-icon {
    width: 48px; height: 48px; border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px; margin-bottom: 18px;
    background: var(--fi-bg, var(--accent-light));
    transition: transform var(--transition);
  }
  .feature-card:hover .feature-icon { transform: scale(1.1) rotate(-4deg); }
  .feature-title {
    font-family: var(--font-display);
    font-size: 1.05rem; font-weight: 700;
    color: var(--text-primary); margin-bottom: 8px;
    letter-spacing: -.02em;
    font-style: normal;
  }
  .feature-desc { font-size: .875rem; color: var(--text-secondary); line-height: 1.65; }
  .feature-link {
    display: inline-flex; align-items: center; gap: 4px;
    margin-top: 16px; font-size: .8rem; font-weight: 600;
    color: var(--accent); text-decoration: none;
    transition: gap var(--transition);
  }
  .feature-link:hover { gap: 8px; }

  /* ── ROLES SECTION ────────────────────────────────────────────── */
  .sc-roles { background: var(--white); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .roles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .role-card {
    border: 1px solid var(--border); border-radius: var(--radius);
    padding: 32px 28px; position: relative; overflow: hidden;
    transition: all var(--transition);
  }
  .role-card:hover { box-shadow: var(--shadow-md); border-color: var(--rc-color, var(--accent)); transform: translateY(-3px); }
  .role-top { display: flex; align-items: center; gap: 14px; margin-bottom: 18px; }
  .role-icon-wrap {
    width: 52px; height: 52px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center; font-size: 24px;
  }
  .role-name { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; letter-spacing: -.02em; font-style: normal; }
  .role-tag {
    display: inline-block; font-size: .68rem; font-weight: 700;
    letter-spacing: .06em; text-transform: uppercase;
    padding: 2px 8px; border-radius: 4px; margin-top: 3px;
  }
  .role-desc { font-size: .875rem; color: var(--text-secondary); line-height: 1.65; margin-bottom: 20px; }
  .role-perms { display: flex; flex-direction: column; gap: 8px; }
  .role-perm {
    display: flex; align-items: center; gap: 10px;
    font-size: .8rem; color: var(--text-secondary);
  }
  .perm-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

  /* ── STATS BAND ───────────────────────────────────────────────── */
  .sc-stats-band {
    background: linear-gradient(135deg, #1e3a8a 0%, var(--accent) 60%, #3b82f6 100%);
    position: relative; overflow: hidden;
  }
  .sc-stats-band::before {
    content: ''; position: absolute; inset: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='20'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  }
  .stats-band-inner {
    max-width: 1200px; margin: 0 auto; padding: 80px 24px;
    display: grid; grid-template-columns: 1fr auto;
    gap: 64px; align-items: center; position: relative;
  }
  .stats-band-text {}
  .stats-band-title {
    font-family: var(--font-display); font-size: clamp(1.8rem, 3vw, 2.6rem);
    font-weight: 800; color: #fff; letter-spacing: -.04em; line-height: 1.15;
    margin-bottom: 14px; font-style: normal;
  }
  .stats-band-desc { font-size: .975rem; color: rgba(255,255,255,.75); line-height: 1.7; max-width: 460px; font-weight: 300; }
  .stats-band-numbers {
    display: grid; grid-template-columns: 1fr 1fr; gap: 20px; flex-shrink: 0;
  }
  .stat-bubble {
    background: rgba(255,255,255,.1); border: 1px solid rgba(255,255,255,.15);
    backdrop-filter: blur(12px);
    border-radius: var(--radius); padding: 22px 24px;
    text-align: center;
  }
  .stat-bubble-val {
    font-family: var(--font-display); font-size: 2.2rem; font-weight: 800;
    color: #fff; line-height: 1; margin-bottom: 4px;
  }
  .stat-bubble-lbl { font-size: .78rem; color: rgba(255,255,255,.7); }

  /* ── HOW IT WORKS ─────────────────────────────────────────────── */
  .hiw-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .hiw-card {
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 28px 22px;
    position: relative; text-align: center;
    transition: all var(--transition);
  }
  .hiw-card:hover { box-shadow: var(--shadow-md); transform: translateY(-3px); }
  .hiw-num {
    font-family: var(--font-display); font-size: 3rem; font-weight: 900;
    color: var(--border); line-height: 1; margin-bottom: 12px;
    position: absolute; top: 16px; right: 18px;
  }
  .hiw-icon { font-size: 28px; margin-bottom: 14px; }
  .hiw-title {
    font-family: var(--font-display); font-size: .95rem; font-weight: 700;
    color: var(--text-primary); margin-bottom: 8px; letter-spacing: -.02em;
    font-style: normal;
  }
  .hiw-desc { font-size: .82rem; color: var(--text-secondary); line-height: 1.6; }
  .hiw-connector {
    position: absolute; top: 50%; right: -16px;
    transform: translateY(-50%);
    color: var(--text-muted); font-size: 1.2rem; z-index: 1;
    pointer-events: none;
  }

  /* ── CTA ──────────────────────────────────────────────────────── */
  .sc-cta-section {
    padding: 96px 24px;
    max-width: 1200px; margin: 0 auto;
  }
  .sc-cta-box {
    background: var(--white); border: 1px solid var(--border);
    border-radius: var(--radius-xl); padding: 64px 80px;
    text-align: center; position: relative; overflow: hidden;
    box-shadow: var(--shadow-lg);
  }
  .sc-cta-box::before {
    content: ''; position: absolute; top: -80px; right: -80px;
    width: 300px; height: 300px; border-radius: 50%;
    background: var(--accent-light); opacity: .6;
    pointer-events: none;
  }
  .sc-cta-box::after {
    content: ''; position: absolute; bottom: -60px; left: -60px;
    width: 200px; height: 200px; border-radius: 50%;
    background: var(--accent-light); opacity: .4;
    pointer-events: none;
  }
  .cta-title {
    font-family: var(--font-display); font-size: clamp(1.8rem, 3vw, 2.6rem);
    font-weight: 800; letter-spacing: -.04em; color: var(--text-primary);
    margin-bottom: 14px; position: relative; z-index: 1;
    font-style: normal;
  }
  .cta-desc {
    font-size: 1rem; color: var(--text-secondary); max-width: 480px;
    margin: 0 auto 36px; line-height: 1.7; font-weight: 300;
    position: relative; z-index: 1;
  }
  .cta-actions { display: flex; align-items: center; gap: 14px; justify-content: center; position: relative; z-index: 1; }
  .btn-cta { font-size: 1rem; padding: 14px 32px; border-radius: 10px; }

  /* ── FOOTER ───────────────────────────────────────────────────── */
  .sc-footer {
    background: var(--text-primary); color: rgba(255,255,255,.75);
    padding: 64px 24px 32px;
  }
  .sc-footer-inner { max-width: 1200px; margin: 0 auto; }
  .footer-top {
    display: grid; grid-template-columns: 2fr 1fr 1fr 1fr;
    gap: 48px; padding-bottom: 48px;
    border-bottom: 1px solid rgba(255,255,255,.1);
    margin-bottom: 32px;
  }
  .footer-brand-col {}
  .footer-brand {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; margin-bottom: 14px;
  }
  .footer-brand-logo {
    width: 34px; height: 34px; border-radius: 9px;
    background: var(--accent); display: flex; align-items: center;
    justify-content: center; font-size: 16px;
    box-shadow: 0 2px 8px rgba(37,99,235,.4);
  }
  .footer-brand-name {
    font-family: var(--font-display); font-weight: 700; font-size: .95rem;
    color: #fff; letter-spacing: -.02em;
  }
  .footer-tagline { font-size: .82rem; line-height: 1.65; margin-bottom: 20px; max-width: 260px; }
  .footer-socials { display: flex; gap: 8px; }
  .social-btn {
    width: 34px; height: 34px; border-radius: 8px;
    background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; cursor: pointer; transition: all var(--transition);
    text-decoration: none; color: rgba(255,255,255,.7);
  }
  .social-btn:hover { background: var(--accent); border-color: var(--accent); color: #fff; }

  .footer-col-title {
    font-family: var(--font-display); font-weight: 700;
    font-size: .82rem; letter-spacing: .06em; text-transform: uppercase;
    color: #fff; margin-bottom: 16px;
  }
  .footer-links { display: flex; flex-direction: column; gap: 8px; list-style: none; }
  .footer-links a {
    font-size: .82rem; color: rgba(255,255,255,.6);
    text-decoration: none; transition: color var(--transition);
  }
  .footer-links a:hover { color: #fff; }

  .footer-bottom {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
  }
  .footer-copy { font-size: .78rem; }
  .footer-legal { display: flex; gap: 16px; }
  .footer-legal a { font-size: .78rem; color: rgba(255,255,255,.5); text-decoration: none; transition: color var(--transition); }
  .footer-legal a:hover { color: rgba(255,255,255,.85); }

  /* ── RESPONSIVE ───────────────────────────────────────────────── */
  @media (max-width: 1024px) {
    .features-grid { grid-template-columns: repeat(2, 1fr); }
    .roles-grid { grid-template-columns: repeat(2, 1fr); }
    .hiw-grid { grid-template-columns: repeat(2, 1fr); }
    .hiw-connector { display: none; }
    .footer-top { grid-template-columns: 1fr 1fr; }
    .stats-band-inner { grid-template-columns: 1fr; }
  }
  @media (max-width: 768px) {
    .sc-hero { grid-template-columns: 1fr; padding-top: calc(var(--nav-h) + 48px); }
    .hero-visual { display: none; }
    .features-grid { grid-template-columns: 1fr; }
    .roles-grid { grid-template-columns: 1fr; }
    .hiw-grid { grid-template-columns: 1fr; }
    .sc-cta-box { padding: 40px 24px; }
    .footer-top { grid-template-columns: 1fr 1fr; gap: 32px; }
    .footer-brand-col { grid-column: 1 / -1; }
    .sc-nav-links, .sc-nav-cta .btn-ghost { display: none; }
    .nav-hamburger { display: flex; }
    .stats-band-numbers { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 480px) {
    .sc-strip-inner { flex-direction: column; gap: 10px; }
    .strip-sep { display: none; }
    .footer-top { grid-template-columns: 1fr; }
    .footer-bottom { flex-direction: column; align-items: flex-start; }
    .hero-actions { flex-direction: column; align-items: flex-start; }
    .cta-actions { flex-direction: column; }
  }
`;

// ─── Data ─────────────────────────────────────────────────────────────────────
const features = [
  { icon: '🚨', title: 'Incident Management', desc: 'Log, track, and resolve campus incidents from a single dashboard. Assign to technicians and monitor live progress.', color: '#ef4444', bg: '#fef2f2' },
  { icon: '📅', title: 'Smart Bookings', desc: 'Reserve rooms, labs, and equipment instantly. Get real-time availability and instant confirmation.', color: '#2563eb', bg: '#eff4ff' },
  { icon: '🏢', title: 'Resource Catalogue', desc: 'Browse and manage every campus resource — classrooms, labs, AV equipment — with status indicators.', color: '#16a34a', bg: '#f0fdf4' },
  { icon: '🔔', title: 'Live Notifications', desc: 'Never miss an update. Real-time push alerts keep every stakeholder informed across all roles.', color: '#d97706', bg: '#fffbeb' },
  { icon: '🛡️', title: 'Role-Based Access', desc: 'Granular permissions for Users, Technicians, and Admins — the right tools for the right person.', color: '#7c3aed', bg: '#f5f3ff' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Understand trends, workload distribution, and system health at a glance with rich visual insights.', color: '#0891b2', bg: '#ecfeff' },
];

const roles = [
  {
    icon: '👤', name: 'User', tag: 'STAFF / STUDENT',
    desc: 'Create and track incidents, book resources, and receive updates — everything you need to get campus support.',
    perms: ['Submit & track incidents', 'Book campus resources', 'Receive live notifications', 'View booking history'],
    color: '#2563eb', bg: '#eff4ff', tagBg: '#dbeafe', tagColor: '#1d4ed8',
  },
  {
    icon: '🔧', name: 'Technician', tag: 'SUPPORT STAFF',
    desc: 'View assigned incidents, update resolution status, and collaborate with the team to keep campus running.',
    perms: ['View assigned incidents', 'Update incident status', 'Manage booking schedules', 'Access technical logs'],
    color: '#16a34a', bg: '#f0fdf4', tagBg: '#dcfce7', tagColor: '#15803d',
  },
  {
    icon: '⚙️', name: 'Admin', tag: 'ADMINISTRATOR',
    desc: 'Full oversight: manage users, assign technicians, configure resources, and access system-wide reporting.',
    perms: ['Full incident oversight', 'Manage all bookings', 'User & role management', 'Resource configuration'],
    color: '#7c3aed', bg: '#f5f3ff', tagBg: '#ede9fe', tagColor: '#6d28d9',
  },
];

const steps = [
  { icon: '🔐', title: 'Sign In', desc: 'Authenticate securely via your university Google account.', n: '01' },
  { icon: '📋', title: 'Create Request', desc: 'Submit an incident or book a resource in under 60 seconds.', n: '02' },
  { icon: '🔔', title: 'Get Updates', desc: 'Track real-time status changes and receive instant notifications.', n: '03' },
  { icon: '✅', title: 'Resolved', desc: 'Issues get resolved, bookings confirmed — full audit trail kept.', n: '04' },
];

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Roles', href: '#roles' },
    { label: 'How it Works', href: '#how' },
    { label: 'About', href: '#about' },
  ];

  return (
    <>
      <nav className={`sc-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="sc-nav-inner">
          <a href="#" className="sc-brand">
            <div className="sc-brand-logo">🏫</div>
            <span className="sc-brand-name">Smart<span>Campus</span></span>
          </a>

          <ul className="sc-nav-links">
            {navLinks.map(l => (
              <li key={l.label}><a href={l.href}>{l.label}</a></li>
            ))}
          </ul>

          <div className="sc-nav-cta">
            <a href="/login" className="btn-ghost">Sign In</a>
            <a href="/login" className="btn-primary">
              Get Started
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <button className="nav-hamburger" onClick={() => setMobileOpen(o => !o)} aria-label="Toggle menu">
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </nav>

      {mobileOpen && (
        <div className="sc-mobile-menu">
          {navLinks.map(l => <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}>{l.label}</a>)}
          <div className="mobile-cta">
            <a href="/login" className="btn-primary btn-hero" onClick={() => setMobileOpen(false)}>Get Started →</a>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="sc-hero">
      <div className="hero-text">
        <div className="hero-badge">
          <span className="hero-badge-dot" />
          Smart Campus Operations Hub
        </div>
        <h1 className="hero-title">
          One platform for<br />
          <span className="accent-word">every campus</span><br />
          operation
        </h1>
        <p className="hero-desc">
          Incidents, bookings, resources and notifications — unified in a single intelligent platform built for modern university campuses.
        </p>
        <div className="hero-actions">
          <a href="/login" className="btn-primary btn-hero">
            Access Dashboard
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="#features" className="btn-ghost btn-hero">Explore Features</a>
        </div>
        <div className="hero-trust">
          <div className="trust-icons">
            {['🎓','👷','🛠️','📚'].map((e,i) => (
              <div className="trust-avatar" key={i}>{e}</div>
            ))}
          </div>
          <span>Trusted by 3 user roles across campus departments</span>
        </div>
      </div>

      <div className="hero-visual">
        <div className="float-card float-card-1">
          <span className="float-icon">✅</span>
          <div>
            <div className="float-label">Incident Resolved</div>
            <div className="float-sub">Lab A — Projector fixed</div>
          </div>
        </div>

        <div className="hero-card">
          <div className="hero-card-header">
            <span className="hero-card-title">Today's Overview</span>
            <span className="hc-badge">● Live</span>
          </div>
          <div className="hc-stats">
            {[
              { v: '24', l: 'Open Incidents' },
              { v: '8', l: 'Active Bookings' },
              { v: '3', l: 'Alerts Today' },
              { v: '97%', l: 'Resolution Rate' },
            ].map((s,i) => (
              <div className="hc-stat" key={i}>
                <div className="hc-stat-val">{s.v}</div>
                <div className="hc-stat-lbl">{s.l}</div>
              </div>
            ))}
          </div>
          <div className="hc-incidents">
            {[
              { title: 'Lecture Hall B — AC fault', dot: '#ef4444', tag: 'HIGH', tagBg: '#fef2f2', tagC: '#dc2626' },
              { title: 'Library PC Lab — Network', dot: '#d97706', tag: 'MED', tagBg: '#fffbeb', tagC: '#b45309' },
              { title: 'Parking Gate — Sensor', dot: '#16a34a', tag: 'LOW', tagBg: '#f0fdf4', tagC: '#15803d' },
            ].map((inc, i) => (
              <div className="hc-incident" key={i}>
                <div className="hc-dot" style={{ background: inc.dot }} />
                <span className="hc-incident-title">{inc.title}</span>
                <span className="hc-incident-tag" style={{ background: inc.tagBg, color: inc.tagC }}>{inc.tag}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="float-card float-card-2">
          <span className="float-icon">📅</span>
          <div>
            <div className="float-label">Booking Confirmed</div>
            <div className="float-sub">Seminar Room 3 · 2 PM</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Strip ────────────────────────────────────────────────────────────────────
function Strip() {
  const items = ['Secure Google Login', 'Role-Based Access', 'Real-Time Notifications', 'Resource Booking', 'Incident Tracking', 'Admin Controls'];
  return (
    <div className="sc-strip">
      <div className="sc-strip-inner">
        {items.map((item, i) => (
          <div key={item} style={{ display: 'contents' }}>
            <div className="strip-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
              {item}
            </div>
            {i < items.length - 1 && <span className="strip-sep">·</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
function Features() {
  return (
    <section className="sc-section" id="features">
      <div className="section-header">
        <div className="section-eyebrow">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg>
          Everything You Need
        </div>
        <h2 className="section-title">Built for how your<br />campus really works</h2>
        <p className="section-desc">Six powerful modules that cover every operational workflow — from the first report to final resolution.</p>
      </div>
      <div className="features-grid">
        {features.map((f) => (
          <div className="feature-card" key={f.title} style={{ '--fc-color': f.color }}>
            <div className="feature-icon" style={{ '--fi-bg': f.bg, color: f.color }}>{f.icon}</div>
            <div className="feature-title">{f.title}</div>
            <p className="feature-desc">{f.desc}</p>
            <a className="feature-link" href="/login">
              Explore
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── Roles ────────────────────────────────────────────────────────────────────
function Roles() {
  return (
    <section className="sc-roles" id="roles">
      <div className="sc-section" style={{ paddingTop: '80px', paddingBottom: '80px' }}>
        <div className="section-header section-header-centered">
          <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg>
            Role-Based Platform
          </div>
          <h2 className="section-title">The right tools for<br />every person on campus</h2>
          <p className="section-desc">Three distinct roles, one unified system. Everyone sees exactly what they need — nothing more, nothing less.</p>
        </div>
        <div className="roles-grid">
          {roles.map((r) => (
            <div className="role-card" key={r.name} style={{ '--rc-color': r.color }}>
              <div className="role-top">
                <div className="role-icon-wrap" style={{ background: r.bg, fontSize: '24px' }}>{r.icon}</div>
                <div>
                  <div className="role-name">{r.name}</div>
                  <div className="role-tag" style={{ background: r.tagBg, color: r.tagColor }}>{r.tag}</div>
                </div>
              </div>
              <p className="role-desc">{r.desc}</p>
              <div className="role-perms">
                {r.perms.map(p => (
                  <div className="role-perm" key={p}>
                    <div className="perm-dot" style={{ background: r.color }} />
                    {p}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Stats Band ───────────────────────────────────────────────────────────────
function StatsBand() {
  return (
    <div className="sc-stats-band" id="about">
      <div className="stats-band-inner">
        <div className="stats-band-text">
          <h2 className="stats-band-title">Operational excellence,<br />measurable results</h2>
          <p className="stats-band-desc">Smart Campus centralises every operational touchpoint, reducing response times and eliminating the friction of disconnected tools.</p>
        </div>
        <div className="stats-band-numbers">
          {[
            { v: '< 2min', l: 'Avg. booking time' },
            { v: '97%', l: 'Issue resolution rate' },
            { v: '3 Roles', l: 'Covered by one platform' },
            { v: '24 / 7', l: 'System availability' },
          ].map(s => (
            <div className="stat-bubble" key={s.l}>
              <div className="stat-bubble-val">{s.v}</div>
              <div className="stat-bubble-lbl">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── How it Works ─────────────────────────────────────────────────────────────
function HowItWorks() {
  return (
    <section className="sc-section" id="how">
      <div className="section-header section-header-centered">
        <div className="section-eyebrow" style={{ justifyContent: 'center' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="6"/></svg>
          Simple Process
        </div>
        <h2 className="section-title">Up and running<br />in four steps</h2>
        <p className="section-desc">No training required. The platform is intuitive by design — built around how campus staff and students actually think.</p>
      </div>
      <div className="hiw-grid">
        {steps.map((s, i) => (
          <div className="hiw-card" key={s.title} style={{ position: 'relative' }}>
            <div className="hiw-num">{s.n}</div>
            <div className="hiw-icon">{s.icon}</div>
            <div className="hiw-title">{s.title}</div>
            <p className="hiw-desc">{s.desc}</p>
            {i < steps.length - 1 && <span className="hiw-connector">→</span>}
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA() {
  return (
    <div className="sc-cta-section">
      <div className="sc-cta-box">
        <h2 className="cta-title">Ready to modernise<br />your campus operations?</h2>
        <p className="cta-desc">Sign in with your university Google account and get started immediately. No setup required.</p>
        <div className="cta-actions">
          <a href="/login" className="btn-primary btn-cta">
            Sign In with Google
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="#features" className="btn-ghost btn-cta">Learn More</a>
        </div>
      </div>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="sc-footer">
      <div className="sc-footer-inner">
        <div className="footer-top">
          <div className="footer-brand-col">
            <a href="#" className="footer-brand">
              <div className="footer-brand-logo">🏫</div>
              <span className="footer-brand-name">SmartCampus</span>
            </a>
            <p className="footer-tagline">A unified operations hub for modern university campuses — managing incidents, bookings, and resources seamlessly.</p>
            <div className="footer-socials">
              {['✉️', '🔗', '🐦', '💻'].map((s, i) => (
                <a key={i} href="#" className="social-btn">{s}</a>
              ))}
            </div>
          </div>
          <div>
            <div className="footer-col-title">Platform</div>
            <ul className="footer-links">
              {['Dashboard', 'Bookings', 'Incidents', 'Resources', 'Notifications'].map(l => (
                <li key={l}><a href="/login">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Roles</div>
            <ul className="footer-links">
              {['For Students', 'For Staff', 'For Technicians', 'For Admins', 'Access Control'].map(l => (
                <li key={l}><a href="/login">{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <div className="footer-col-title">Support</div>
            <ul className="footer-links">
              {['Help Center', 'User Guide', 'Contact IT', 'Report a Bug', 'System Status'].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© {new Date().getFullYear()} Smart Campus Operations Hub. All rights reserved.</span>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="sc-homepage-wrap">
      <style>{styles}</style>
      <Navbar />
      <main>
        <Hero />
        <Strip />
        <Features />
        <Roles />
        <StatsBand />
        <HowItWorks />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}

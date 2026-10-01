/**
 * Shared application shell distilled from the Incident Pulse React dashboard —
 * the canonical design reference for every DashLint-generated dashboard.
 *
 * Dashboard generation may adapt the content region, but not this frame.
 */
export const DASHBOARD_SHELL_CONTRACT = {
  shellVersion: "3.0",
  sourceReferences: [
    "Pulse React Dashboard/incident-pulse (canonical design reference)",
    "SLA-Pulse (foundational architecture reference)",
  ],
  sourceOfTruth:
    "The Incident Pulse React dashboard (Pulse React Dashboard/incident-pulse) is the authoritative design reference. Its CSS, component patterns, typography, spacing, animation choreography, and interaction patterns define the standard that every generated HTML dashboard must follow. When a user's project already has an existing shell, preserve that shell verbatim and adapt only content bindings.",

  /* ══════════════════════════════════════════════════════════════
     DESIGN TOKEN SYSTEM
     Every generated dashboard must declare these CSS custom properties.
     ══════════════════════════════════════════════════════════════ */
  designTokens: `/* ── Pulse Design Token System (Incident Pulse React canonical) ── */
:root {
  /* ─── Shell & Rail ─── */
  --rail-bg: #151515;
  --rail-border: #252930;

  /* ─── Neutral Accent ─── */
  --accent: #4B5563;
  --accent-dim: rgba(75, 85, 99, 0.10);
  --accent-line: rgba(75, 85, 99, 0.30);

  /* ─── Semantic Status (WCAG AA Compliant) ─── */
  --ok: #1A7A56;
  --ok-dim: rgba(26, 122, 86, 0.09);
  --warn: #B45309;
  --warn-dim: rgba(180, 83, 9, 0.09);
  --err: #C0392B;
  --err-dim: rgba(192, 57, 43, 0.06);

  /* ─── Surfaces & Ink ─── */
  --bg: #F2F4F7;
  --surface: #FFFFFF;
  --surface-2: #EEF0F4;
  --surface-3: #F8FAFC;
  --ink: #181C24;
  --muted: #6B7280;
  --line: #DDE1E9;
  --line-strong: #BCC2CE;

  /* ─── Typography ─── */
  --sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  --mono: 'IBM Plex Mono', 'Cascadia Code', 'Consolas', monospace;

  /* ─── Chart Palette ─── */
  --chart-blue: #181C24;
  --chart-indigo: #6366F1;
  --chart-purple: #8B5CF6;
  --chart-teal: #0D9488;
  --chart-cyan: #0891B2;
  --chart-green: #10B981;
  --chart-amber: #F59E0B;
  --chart-orange: #F97316;
  --chart-red: #EF4444;

  /* ─── Utility ─── */
  --focus-ring: #38BDF8;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
}`,

  /* ══════════════════════════════════════════════════════════════
     DARK OVERLAY TOKEN SCOPING
     When analytics overlays or slide drawers open, these scoped
     tokens automatically shift child panels into the dark theme
     without changing global CSS.
     ══════════════════════════════════════════════════════════════ */
  darkOverlayTokens: `/* ── Dark Overlay Token Scoping ── */
.analytics-overlay,
.location-overlay,
.flow-overlay {
  --surface: #1e232b;
  --surface-2: #252a33;
  --line: rgba(255, 255, 255, 0.08);
  --line-strong: rgba(255, 255, 255, 0.15);
  --ink: #f0f0f0;
  --muted: #9aa3af;
  background: var(--rail-bg);
}`,

  /* ══════════════════════════════════════════════════════════════
     FRAME CODE
     Fixed viewport shell with 4-edge border.
     ══════════════════════════════════════════════════════════════ */
  frameCode: `/* Fixed viewport shell: border the whole application on all four sides. */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

::selection { background: rgba(59, 130, 246, 0.22); color: inherit; }

html, body, #root { width: 100%; height: 100%; margin: 0; overflow: hidden; }
*, *::before, *::after { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
body { font-family: var(--sans); background: var(--bg); color: var(--ink); font-size: 13px; }
button, input, textarea, select { font: inherit; }

.app {
  position: relative;
  width: 100vw; height: 100vh; height: 100dvh;
  padding: 12px;
  display: grid; grid-template-columns: 268px minmax(0, 1fr);
  gap: 12px;
  overflow: hidden;
}

/* Keep overflow in designated content panes; never make the document scroll. */
.rail, .main, .dashboard-body { min-width: 0; min-height: 0; overflow: hidden; }
.dashboard-body { overflow: auto; overscroll-behavior: contain; }

/* ── UNIVERSAL SLEEK SCROLLBAR SYSTEM ── */
* { scrollbar-width: thin; scrollbar-color: rgba(24, 28, 36, 0.22) transparent; }
*::-webkit-scrollbar { width: 5px; height: 5px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb { background: rgba(24, 28, 36, 0.22); border-radius: 4px; }
*::-webkit-scrollbar-thumb:hover { background: rgba(24, 28, 36, 0.42); }
*::-webkit-scrollbar-corner { background: transparent; }

/* Dark scrollbar inside overlays and drawers */
.analytics-overlay *, .slide-drawer * { scrollbar-color: rgba(255, 255, 255, 0.22) transparent; }
.analytics-overlay *::-webkit-scrollbar-thumb, .slide-drawer *::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.22); border-radius: 4px;
}
.analytics-overlay *::-webkit-scrollbar-thumb:hover, .slide-drawer *::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.42);
}

/* ── MAIN WORKSPACE (4-Row Fixed Grid: Header, Filter, Tabs, Content) ── */
.main {
  min-width: 0; min-height: 0;
  display: grid;
  grid-template-rows: auto auto auto minmax(0, 1fr);
  gap: 8px;
  overflow: hidden;
}`,

  /* ══════════════════════════════════════════════════════════════
     SIDEBAR MARKUP TEMPLATE
     ══════════════════════════════════════════════════════════════ */
  sidebarMarkupTemplate: `<aside class="rail" aria-label="Application information">
  <div class="brand">
    <div class="logo" role="button" tabindex="0" title="{{BRAND_TOOLTIP}}" aria-label="{{BRAND_TOOLTIP}}">
      <span class="logo-letter">{{LOGO_L1}}</span><span class="logo-letter">{{LOGO_L2}}</span><span class="logo-letter">{{LOGO_L3}}</span>
    </div>
    <div class="brand-title">
      <h1>{{APP_TITLE}}</h1>
      <p>{{APP_SUBTITLE}}</p>
    </div>
  </div>
  <div class="scope-chip"><span class="live-pulse-dot"></span> {{DATASET_SCOPE_LABEL}}</div>
  <section class="side-metrics">
    <div class="side-head"><h2>{{SNAPSHOT_TITLE}}</h2></div>
    <div class="metric-list">{{DATA_BOUND_SIDEBAR_METRIC_CARDS}}</div>
  </section>
  <section class="credit">built by <b><a href="https://linkedin.com/in/tanmay-kalbande" target="_blank" rel="noopener noreferrer" class="credit-link" title="Connect on LinkedIn"><span class="name-letter">T</span><span class="name-letter">a</span><span class="name-letter">n</span><span class="name-letter">m</span><span class="name-letter">a</span><span class="name-letter">y</span><span class="name-space">&nbsp;</span><span class="name-letter">K</span><span class="name-letter">a</span><span class="name-letter">l</span><span class="name-letter">b</span><span class="name-letter">a</span><span class="name-letter">n</span><span class="name-letter">d</span><span class="name-letter">e</span></a></b></section>
</aside>`,

  /* ══════════════════════════════════════════════════════════════
     SIDEBAR CSS TEMPLATE
     ══════════════════════════════════════════════════════════════ */
  sidebarCssTemplate: `/* ── SIDEBAR / LEFT RAIL (Incident Pulse canonical) ── */
.rail {
  min-width: 0; min-height: 0;
  background: var(--rail-bg); color: #fff;
  border: 1px solid var(--rail-border); border-radius: 8px;
  padding: 18px 14px;
  display: grid; grid-template-rows: auto auto minmax(0, 1fr) auto;
  gap: 14px; overflow: hidden;
}

.brand { display: flex; align-items: center; gap: 11px; min-width: 0; }
.logo {
  width: 42px; height: 42px; border-radius: 6px;
  color: var(--rail-bg);
  display: flex; align-items: center; justify-content: center; flex: 0 0 auto;
  font-family: var(--mono); font-weight: 700; font-size: 13px;
  letter-spacing: .03em; position: relative;
  border: 1px solid rgba(255,255,255,.15);
  text-decoration: none; user-select: none;
  background: #F8FAFC;
  box-shadow: 0 4px 12px rgba(248, 250, 252, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}
.logo:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(248, 250, 252, 0.15); }
.logo-letter { display: inline-block; animation: letterColorWave 6s ease-in-out infinite; }
.logo-letter:nth-child(1) { animation-delay: 0s; }
.logo-letter:nth-child(2) { animation-delay: 0.3s; }
.logo-letter:nth-child(3) { animation-delay: 0.6s; }

@keyframes letterColorWave {
  0%, 30%, 100% { color: var(--rail-bg); }
  15%           { color: #EF4444; }
}

.live-pulse-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #4B5563;
  box-shadow: 0 0 0 3px rgba(75, 85, 99, 0.25);
  display: inline-block;
}

.brand-title { min-width: 0; }
.brand-title h1 { margin: 0; font-size: 15px; line-height: 1.1; color: #fff; font-weight: 700; letter-spacing: -.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.brand-title p { margin: 3px 0 0; color: #888; font-size: 11px; font-family: var(--mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.scope-chip { font-size: 9.5px; color: #888; font-family: var(--mono); font-weight: 600; display: flex; align-items: center; gap: 6px; }

.side-metrics { min-height: 0; display: grid; grid-template-rows: auto minmax(0, 1fr); gap: 8px; overflow: hidden; }
.side-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; border-bottom: 1px solid rgba(255,255,255,.07); padding-bottom: 6px; }
.side-head h2 { margin: 0; font-size: 11px; color: #888; font-family: var(--mono); font-weight: 600; letter-spacing: .07em; text-transform: uppercase; }

.metric-list {
  min-height: 0; display: flex; flex-direction: column; justify-content: space-between;
  overflow: hidden; background: transparent; border: none; padding: 2px 0;
}

.side-card {
  display: flex; justify-content: space-between; align-items: center;
  background: transparent; padding: 5px 4px; min-width: 0;
  border-bottom: 1px solid rgba(255,255,255,.04);
  transition: background .12s;
}
.side-card:last-child { border-bottom: none; }
.side-card:hover { background: rgba(255,255,255,.03); border-radius: 3px; }
.side-card label { font-size: 10px; color: #666; font-family: var(--mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.side-card strong { font-size: 13px; color: #e8e8e8; font-weight: 600; white-space: nowrap; font-family: var(--mono); }
.side-card.accent { background: rgba(75, 85, 99, 0.12); border-radius: 4px; }
.side-card.accent strong { color: #d0d5dd; }

.credit { border-top: 1px solid rgba(255,255,255,.07); padding-top: 10px; color: #444; font-size: 10px; font-family: var(--mono); line-height: 1.5; }
.credit b { display: block; font-size: 11px; margin-top: 2px; font-weight: 600; }
.credit-link {
  display: inline-flex; align-items: center; gap: 0; text-decoration: none;
  color: inherit; cursor: pointer; transition: color .15s ease;
}
.credit-link:hover .name-letter { color: #fff; text-decoration: underline; text-underline-offset: 2px; animation: none; }
.name-letter {
  display: inline-block; color: #8D96A3;
  animation: nameColorWave 6s ease-in-out infinite;
  transition: color .2s ease;
}
.name-space { display: inline-block; width: 4px; }
.name-letter:nth-of-type(1)  { animation-delay: 0s; }
.name-letter:nth-of-type(2)  { animation-delay: 0.14s; }
.name-letter:nth-of-type(3)  { animation-delay: 0.28s; }
.name-letter:nth-of-type(4)  { animation-delay: 0.42s; }
.name-letter:nth-of-type(5)  { animation-delay: 0.56s; }
.name-letter:nth-of-type(6)  { animation-delay: 0.70s; }
.name-letter:nth-of-type(7)  { animation-delay: 0.84s; }
.name-letter:nth-of-type(8)  { animation-delay: 0.98s; }
.name-letter:nth-of-type(9)  { animation-delay: 1.12s; }
.name-letter:nth-of-type(10) { animation-delay: 1.26s; }
.name-letter:nth-of-type(11) { animation-delay: 1.40s; }
.name-letter:nth-of-type(12) { animation-delay: 1.54s; }
.name-letter:nth-of-type(13) { animation-delay: 1.68s; }
.name-letter:nth-of-type(14) { animation-delay: 1.82s; }
.name-letter:nth-of-type(15) { animation-delay: 1.96s; }

@keyframes nameColorWave {
  0%, 30%, 100% { color: #8D96A3; }
  15%           { color: #EF4444; }
}
@media (prefers-reduced-motion: reduce) { .name-letter, .logo-letter { animation: none; } }`,

  /* ══════════════════════════════════════════════════════════════
     COMPONENT PATTERNS (Starter CSS for generated dashboards)
     ══════════════════════════════════════════════════════════════ */
  componentPatterns: {
    header: `/* ── Header Strip ── */
.header {
  min-width: 0; background: var(--surface); border: 1px solid var(--line); border-radius: 8px;
  display: grid; grid-template-columns: minmax(0, 1fr) 340px; align-items: center; gap: 14px;
  padding: 10px 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.02);
}
.header-info h1 { margin: 0; font-size: 18px; font-weight: 700; color: var(--ink); line-height: 1.1; letter-spacing: -.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.header-info p { margin: 3px 0 0; font-size: 11px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }`,

    uploadBox: `/* ── Upload Box ── */
.upload-box {
  height: 56px; display: grid; grid-template-columns: minmax(0, 1fr) 110px; grid-template-rows: 11px 18px 13px;
  align-items: center; column-gap: 10px; row-gap: 1px; border: 1.5px dashed var(--line-strong); background: var(--surface-2);
  border-radius: 6px; padding: 5px 10px; cursor: pointer; overflow: hidden; transition: border-color .15s, background .15s;
}
.upload-box:hover, .upload-box.dragging { border-color: var(--chart-blue); background: #F4F5F7; }
.upload-kicker { grid-column: 1/2; grid-row: 1/2; color: var(--accent); font-size: 8.5px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; font-family: var(--mono); }
.upload-title { grid-column: 1/2; grid-row: 2/3; font-size: 12.5px; font-weight: 600; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-name { grid-column: 1/2; grid-row: 3/4; font-size: 9.5px; color: var(--muted); font-family: var(--mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-btn {
  grid-column: 2/3; grid-row: 1/4; height: 28px; border: 1.5px solid var(--ink); border-radius: 4px;
  background: transparent; color: var(--ink); font-size: 10.5px; font-weight: 600;
  display: grid; place-items: center; font-family: var(--mono); transition: background .14s, color .14s;
}
.upload-box:hover .file-btn, .upload-box.dragging .file-btn { background: var(--ink); color: #fff; }`,

    navTabs: `/* ── Navigation Tabs (Segmented Track) ── */
.nav-tabs {
  display: flex; justify-content: space-between; align-items: center;
  background: var(--surface-2); border: 1px solid var(--line); border-radius: 6px;
  padding: 3px; flex-shrink: 0; z-index: 10; overflow-x: auto; width: 100%; gap: 4px;
  scrollbar-width: none; box-shadow: inset 0 1px 2px rgba(0,0,0,.02);
}
.nav-tabs::-webkit-scrollbar { display: none; }
.nav-tab {
  height: 28px; padding: 0 10px; border: 1px solid transparent; border-radius: 4px;
  background: transparent; color: var(--muted); font-size: 10.5px; font-weight: 600;
  font-family: var(--mono); cursor: pointer; transition: all .15s ease;
  white-space: nowrap; display: flex; align-items: center; justify-content: center;
  flex: 1 0 auto; text-align: center; gap: 5px;
}
.nav-tab:hover { color: var(--ink); background: rgba(255, 255, 255, 0.5); }
.nav-tab.active {
  color: var(--ink); font-weight: 700; background: #FFFFFF;
  border-color: rgba(0, 0, 0, 0.08);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07), 0 1px 1px rgba(0, 0, 0, 0.04);
}`,

    kpiCards: `/* ── KPI Cards ── */
.kpi {
  border: 1px solid var(--line); border-radius: 6px; background: var(--surface);
  padding: 12px 14px; display: grid; grid-template-rows: auto 1fr auto;
  min-width: 0; min-height: 0; overflow: hidden;
  transition: border-color .15s, box-shadow .15s; position: relative;
}
.kpi.clickable { cursor: pointer; }
.kpi.clickable:hover { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
.kpi-label {
  color: var(--muted); font-size: 9.5px; letter-spacing: .09em; text-transform: uppercase;
  font-weight: 600; font-family: var(--mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.kpi-value {
  color: var(--ink); font-size: clamp(20px, 2.2vw, 30px); font-weight: 700;
  font-family: var(--mono); line-height: 1.05; align-self: center; letter-spacing: -.02em;
  font-variant-numeric: tabular-nums;
}
.kpi-sub { color: var(--muted); font-size: 10px; font-family: var(--mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }`,

    panels: `/* ── White Surface Panels ── */
.panel {
  background: var(--surface); border: 1px solid var(--line); border-radius: 8px;
  padding: 14px 16px; color: var(--ink); display: flex; flex-direction: column;
  box-shadow: 0 1px 3px rgba(0,0,0,.02); min-width: 0; width: 100%;
}
.panel-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; min-width: 0; }
.panel-head h2, .panel-head h3, .panel-title {
  font-size: 10.5px; font-weight: 700; font-family: var(--mono); color: var(--muted);
  letter-spacing: .07em; text-transform: uppercase; margin: 0; padding: 0; line-height: 1.2;
}`,

    dataTables: `/* ── Data Tables ── */
.data-table { width: 100%; border-collapse: collapse; font-family: var(--mono); font-size: 11px; table-layout: fixed; }
.data-table th, .data-table td {
  padding: 7px 10px; border-bottom: 1px solid var(--surface-2); color: var(--ink);
  vertical-align: middle; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.data-table th {
  background: var(--surface-2); color: var(--muted); font-size: 8.5px; font-weight: 700;
  letter-spacing: .07em; text-transform: uppercase; border-bottom: 1px solid var(--line); text-align: left;
}
.data-table tr.clickable { cursor: pointer; transition: background .12s; }
.data-table tr.clickable:hover { background: rgba(24, 28, 36, 0.04); }`,

    overlays: `/* ── Clip-Path Overlay Expansion ── */
.analytics-overlay {
  position: fixed;
  left: calc(268px + 24px); right: 12px; top: 12px; bottom: 12px;
  z-index: 90;
  background: var(--rail-bg); border: 1px solid var(--rail-border); border-radius: 8px;
  padding: 12px; display: grid; grid-template-rows: auto minmax(0, 1fr); gap: 12px;
  overflow: hidden;
  opacity: 0; pointer-events: none;
  clip-path: inset(0 100% 0 0 round 8px);
  transform: translateZ(0);
  transition: opacity .18s ease, clip-path .62s cubic-bezier(0.16, 1, 0.3, 1);
}
.analytics-overlay.open {
  opacity: 1; pointer-events: auto;
  clip-path: inset(0 0 0 0 round 8px);
}`,

    drawers: `/* ── Slide-Over Drawers ── */
.drawer-backdrop {
  position: fixed; inset: 0; z-index: 199;
  background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(2px);
  opacity: 0; pointer-events: none;
  transition: opacity .2s ease;
}
.drawer-backdrop.open { opacity: 1; pointer-events: auto; }
.slide-drawer {
  position: fixed; top: 0; right: 0; bottom: 0;
  width: min(520px, 92vw); z-index: 200;
  background: var(--surface); border-left: 1px solid var(--line);
  box-shadow: -8px 0 30px rgba(15, 23, 42, 0.12);
  transform: translate3d(calc(100% + 50px), 0, 0);
  transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1);
  overflow-y: auto;
}
.slide-drawer.open { transform: translate3d(0, 0, 0); }`,

    validation: `/* ── Validation Checks ── */
.validation { margin-top: 4px; border-top: 1px solid var(--line); padding-top: 8px; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.check { min-width: 0; border: 1px solid var(--line); background: var(--surface-2); border-radius: 5px; padding: 7px 9px; }
.check span { display: block; color: var(--muted); font-size: 8.5px; font-weight: 600; font-family: var(--mono); letter-spacing: .07em; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.check strong { display: block; margin-top: 2px; color: var(--ink); font-size: 11px; font-family: var(--mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.check.ok { border-color: rgba(26, 122, 86, .3); background: var(--ok-dim); }
.check.ok strong { color: var(--ok); }
.check.err { border-color: rgba(192, 57, 43, .25); background: var(--err-dim); }
.check.err strong { color: var(--err); }`,

    buttons: `/* ── Action Buttons ── */
.btn {
  min-width: 0; height: 36px; border: 0; border-radius: 4px; background: var(--accent); color: #fff;
  font-size: 12px; font-weight: 600; cursor: pointer; font-family: var(--mono); letter-spacing: .02em;
  transition: opacity .14s, transform .1s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  display: inline-flex; align-items: center; justify-content: center; gap: 4px;
}
.btn:hover { opacity: .88; }
.btn:active { transform: scale(.98); }
.btn.info { background: var(--ink); color: #fff; }
.btn.secondary { background: #FFFFFF; color: var(--ink); border: 1px solid var(--line-strong); }
.btn.secondary:hover { background: var(--surface-2); }`,

    heatmap: `/* ── Heatmap Grid ── */
.heatmap-grid { display: grid; grid-template-columns: 54px repeat(24, minmax(0, 1fr)); gap: 2px; width: 100%; }
.hm-cell { display: flex; align-items: center; justify-content: center; font-size: 8.5px; font-family: var(--mono); color: var(--ink); height: 22px; border-radius: 2px; white-space: nowrap; }
.hm-data { cursor: default; transition: transform .1s, outline .1s; position: relative; font-weight: 600; }
.hm-data:hover { transform: scale(1.18); outline: 1.5px solid var(--ink); z-index: 2; }`,

    horizontalBars: `/* ── Horizontal Progress Bars ── */
.hbar-row { display: grid; grid-template-columns: 140px 1fr 44px; gap: 8px; align-items: center; margin-bottom: 2px; font-family: var(--mono); font-size: 10px; }
.hbar-lbl { color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }
.hbar-track { height: 8px; background: var(--surface-2); border-radius: 3px; overflow: hidden; border: 1px solid rgba(0,0,0,.03); }
.hbar-fill { height: 100%; border-radius: 3px; transition: width .4s cubic-bezier(.4,0,.2,1); }
.hbar-val { color: var(--muted); text-align: right; font-weight: 600; font-size: 10px; }`,

    badges: `/* ── Badges & Status Pills ── */
.badge { background: var(--surface-2); color: var(--muted); border: 1px solid var(--line); font-weight: 600; border-radius: 3px; padding: 3px 8px; font-size: 10px; font-family: var(--mono); }
.badge.ok { background: var(--ok-dim); color: var(--ok); border-color: rgba(26, 122, 86, .25); }
.badge.warn { background: var(--warn-dim); color: var(--warn); border-color: rgba(180, 83, 9, .25); }
.badge.err { background: var(--err-dim); color: var(--err); border-color: rgba(192, 57, 43, .25); }`,

    generatedOutput: `/* ── Generated Output Panel ── */
.gen-output {
  background: var(--surface); border: 1px solid var(--line); border-radius: 8px;
  padding: 14px 16px; display: flex; flex-direction: column; gap: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,.02); min-width: 0;
}
.gen-output .panel-head .badge { font-size: 9px; padding: 2px 8px; }
.output-area {
  background: var(--surface-2); border: 1px solid var(--line); border-radius: 6px;
  padding: 14px 16px; font-size: 12.5px; line-height: 1.65; color: var(--ink);
  min-height: 120px; max-height: 320px; overflow-y: auto; white-space: pre-wrap;
  font-family: var(--sans); position: relative;
}
.output-area .copy-btn {
  position: absolute; top: 8px; right: 8px; height: 24px; padding: 0 8px;
  border: 1px solid var(--line); border-radius: 3px; background: var(--surface);
  color: var(--muted); font-size: 9px; font-family: var(--mono); font-weight: 600;
  cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
  transition: background .12s, color .12s;
}
.output-area .copy-btn:hover { background: var(--ink); color: #fff; }
.calc-toggle { border-top: 1px solid var(--line); padding-top: 8px; }
.calc-toggle summary {
  font-size: 10px; font-family: var(--mono); font-weight: 600; color: var(--muted);
  letter-spacing: .05em; cursor: pointer; list-style: none;
  display: flex; align-items: center; gap: 4px;
}
.calc-toggle summary::before { content: '▸ '; }
.calc-toggle[open] summary::before { content: '▾ '; }
.calc-toggle .rules-body {
  margin-top: 8px; font-size: 11px; color: var(--muted); font-family: var(--mono);
  line-height: 1.6; white-space: pre-wrap;
}
.output-actions { display: flex; gap: 6px; flex-wrap: wrap; }
.output-actions .btn { height: 32px; font-size: 11px; padding: 0 14px; flex: 1 0 auto; }`,

    multiSelectFilter: `/* ── Multi-Select Filter Dropdown ── */
.scope-bar-btn {
  position: relative; height: 25px; padding: 0 8px; border-radius: 4px;
  background: #F8FAFC; border: 1px solid rgba(0,0,0,.08);
  font-size: 9.5px; font-family: var(--mono); font-weight: 600; color: var(--muted);
  cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
  transition: background .12s, color .12s;
  white-space: nowrap;
}
.scope-bar-btn::after { content: '▾'; font-size: 8px; opacity: .6; margin-left: 2px; }
.scope-bar-btn.active { background: var(--ink); color: #fff; border-color: var(--ink); }
.scope-bar-btn.active::after { opacity: .8; }
.scope-bar-btn.open { border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-dim); }
.filter-drop {
  position: absolute; top: calc(100% + 4px); left: 0; z-index: 50;
  background: var(--surface); border: 1px solid var(--line); border-radius: 6px;
  box-shadow: 0 8px 24px rgba(0,0,0,.08), 0 2px 6px rgba(0,0,0,.04);
  min-width: 200px; max-height: 280px; display: none;
}
.scope-bar-btn.open .filter-drop { display: block; }
.filter-drop-head {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 12px; border-bottom: 1px solid var(--line);
}
.filter-drop-head span {
  font-size: 8.5px; font-weight: 700; font-family: var(--mono);
  letter-spacing: .07em; text-transform: uppercase; color: var(--muted);
}
.filter-drop-head button {
  background: none; border: none; font-size: 10px; font-family: var(--mono);
  font-weight: 600; color: var(--muted); cursor: pointer; padding: 0 4px;
}
.filter-drop-head button:hover { color: var(--ink); text-decoration: underline; }
.filter-drop-body { overflow-y: auto; max-height: 220px; padding: 4px 0; }
.filter-opt {
  display: flex; align-items: center; gap: 8px; padding: 6px 12px;
  cursor: pointer; transition: background .1s; font-size: 12px; color: var(--ink);
}
.filter-opt:hover { background: var(--surface-2); }
.filter-opt input[type="checkbox"] {
  width: 14px; height: 14px; border-radius: 3px; accent-color: var(--ink); flex-shrink: 0; margin: 0;
}
.filter-opt .cnt {
  margin-left: auto; font-size: 10px; color: var(--muted);
  font-family: var(--mono); font-weight: 600;
}`,

    accessibility: `/* ── Focus & Accessibility ── */
.kpi.clickable:focus-visible, .btn:focus-visible, tr.clickable:focus-visible, .nav-tab:focus-visible,
.hbar-row.clickable:focus-visible, .scope-bar-btn:focus-visible {
  outline: 2px solid var(--focus-ring);
  outline-offset: 1px;
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}`,
  },

  /* ══════════════════════════════════════════════════════════════
     INVARIANTS
     ══════════════════════════════════════════════════════════════ */
  invariants: {
    viewport:
      "The app occupies exactly one viewport (100vw × 100dvh, with 100vh fallback); html/body/root and outer app have overflow:hidden. Never create document/page-level scrolling. Keep any necessary overflow inside the existing dashboard body, metric list, table, or open drawer; contain scroll chaining.",
    frame:
      "The full app grid, rail, header, and dashboard body remain within the viewport; use border-box sizing so border and padding do not cause overflow. The outer .app uses 12px padding and a 12px gap between rail and main.",
    sidebar:
      "The MCP returns sidebarMarkupTemplate and sidebarCssTemplate as concrete implementation code. When creating a new app, copy both as the sidebar baseline, replacing only the brand content (logo letters, title, subtitle), scope label, and data-bound metric-card slot; retain class names, layout, styling, responsive behavior, and exact credit markup. When a project already has a reference sidebar, preserve its actual HTML/component and CSS verbatim and change only metric data bindings. Persistent dark rail (#151515) with brand, dataset snapshot/metrics, and footer; on narrow screens it collapses to the reference hamburger-triggered overlay. The exact author credit stays at the very bottom: 'built by Tanmay Kalbande', linked to https://linkedin.com/in/tanmay-kalbande with target=_blank and rel=noopener noreferrer, in small muted IBM Plex Mono with the staggered name animation. Never omit or relocate it.",
    header:
      "Main viewport begins with the bordered header strip. Preserve its title/description area and right-hand upload column; reference header uses a 340px upload column on desktop with the 56px dashed upload box containing 8.5px uppercase mono kicker, 12.5px title, 9.5px mono filename, and a 28px action button.",
    upload:
      "Reuse the existing dashed upload/drop target and file picker in exactly its current header position. Reference target is 56px tall with 1.5px dashed border. Preserve its button, filename/status element, drag state, and file-input wiring; accept CSV (.csv) and Excel (.xlsx, .xls) while keeping the same control appearance. Never add a duplicate uploader or move it into the dashboard body.",
    navigation:
      "Keep the existing left-rail navigation, dataset summary, brand, and footer structure and destinations; update data labels/values as needed without changing the shell structure.",
    overlays:
      "Use clip-path: inset(0 100% 0 0 round 8px) → inset(0 0 0 0 round 8px) expansion animation with 0.62s cubic-bezier(0.16, 1, 0.3, 1) timing. Overlays are positioned at left: calc(268px + 24px), right: 12px, top: 12px, bottom: 12px — keeping the sidebar rail persistently visible. Use the dark overlay token scoping for analytics overlays.",
    drawers:
      "Slide-over drawers dock to the right viewport edge with width: min(520px, 92vw), animated via translate3d with 0.24s cubic-bezier(0.16, 1, 0.3, 1). Backdrop is rgba(15, 23, 42, 0.45) with backdrop-filter: blur(2px). Close via backdrop click, Escape key, and close button. Focus returns to opener.",
    visualLanguage:
      "Match the Incident Pulse React reference: dark #151515 rail, cool light-gray #F2F4F7 canvas, white #FFFFFF surfaces, fine #DDE1E9 borders, restrained #4B5563 gray shell controls, IBM Plex Mono for all technical labels/data/metrics with font-variant-numeric: tabular-nums, and Inter for body text. Keep richer colors exclusively for data visualization using the chart palette tokens. Preserve typography, border, spacing, control, focus, and surface hierarchy; do not reinterpret the shell as a new theme.",
    typography:
      "KPI values: clamp(20px, 2.2vw, 30px) mono 700 with -0.02em tracking. Panel kickers: 10.5px mono 700 uppercase with 0.07em tracking. Table headers: 8.5px mono 700 uppercase with 0.07em tracking. KPI labels: 9.5px mono 600 uppercase with 0.09em tracking. Body text: 13px sans. All numeric displays use font-variant-numeric: tabular-nums.",
    animations:
      "Number count-ups: 600ms with easeOutCubic (1 - Math.pow(1 - t, 3)). Typewriter effects for generated output: 20-55ms per character with 180ms pause at punctuation. All animations must respect prefers-reduced-motion by skipping to final state.",
    shellChangePolicy:
      "Do not rewrite or restyle the app root, rail, header, upload control, navigation, or shared overlay/drawer code. Make dataset-specific changes only below the fixed header inside the existing main content region, plus the data bindings and local CSV/Excel parsing needed for the existing sidebar snapshot and uploader.",
  },
  adaptiveRegion:
    "The main dashboard content below the header may be composed for any domain and dataset: KPIs, narratives, domain-specific analyses, custom visualizations, comparisons, filters, tables, and analytical sections. Adapt its layout freely while retaining the parent app grid and responsive behavior. There is no approved-domain list or fixed metric/chart catalogue.",
  guidance: [
    "Treat the shell as a stable host contract, not as part of the generated dashboard composition.",
    "The returned designTokens, frameCode, sidebarMarkupTemplate, sidebarCssTemplate, and componentPatterns are actual starter code, not illustrative prose. Use them verbatim when there is no existing shell; where a source shell exists, keep its actual frame/sidebar markup and CSS verbatim instead of substituting the starter code.",
    "Do not move, remove, or restyle the left rail, header, upload control, outer frame, navigation, or overlay behavior for an individual dataset.",
    "Use the available body area to tell the dataset's clearest analytical story; do not force a fixed chart count or section template.",
    "Keep the workflow domain-agnostic. Let the user's question and the actual fields determine the analysis; do not limit dashboards to SLA, call centers, incidents, or any predefined industry, metric pack, or chart family. Blueprint heuristics are optional starting suggestions, not a whitelist or required template.",
    "Every generated dashboard must keep the exact 'built by Tanmay Kalbande' credit linked to the supplied LinkedIn profile at the bottom of the sidebar, styled like the reference apps.",
    "Keep responsive behavior and accessible keyboard/focus semantics when adapting the content region.",
    "Use the complete component patterns (header, upload, nav tabs, KPI cards, panels, tables, overlays, drawers, heatmaps, horizontal bars, badges, generated output, multi-select filters, validation chips, buttons) provided in componentPatterns as the baseline for every generated dashboard. These are copy-ready CSS blocks.",
    "Pure SVG charts are strongly preferred over third-party charting libraries. Render lines, bars, areas, heatmaps, and distributions using procedural SVG with the design token palette. This ensures the dashboard works as a standalone HTML file with zero external dependencies.",
    "Every chart SVG element must use vector-effect: non-scaling-stroke for crisp rendering at any viewport size.",
  ],
} as const;

export function getDashboardShellContract(): string {
  return JSON.stringify(DASHBOARD_SHELL_CONTRACT, null, 2);
}

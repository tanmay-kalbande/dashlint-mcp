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

/* Keep overflow in designated content panes; rail width is strictly preserved. */
.main, .dashboard-body { min-width: 0; min-height: 0; overflow: hidden; }
.rail { width: 268px; min-width: 268px; max-width: 268px; flex-shrink: 0; min-height: 0; overflow: hidden; box-sizing: border-box; }
.dashboard-body { flex: 1; min-height: 0; overflow: auto; overscroll-behavior: contain; }

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

/* ── MAIN WORKSPACE (Flex Column: Header, Filter, Tabs, Content) ── */
.main {
  min-width: 0; min-height: 0;
  display: flex;
  flex-direction: column;
  flex: 1;
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
  width: 268px; min-width: 268px; max-width: 268px; flex-shrink: 0; box-sizing: border-box;
  min-height: 0;
  background: var(--rail-bg); color: #fff;
  border: 1px solid var(--rail-border); border-radius: 8px;
  padding: 16px 14px;
  display: grid; grid-template-rows: auto auto minmax(0, 1fr) auto;
  gap: 12px; overflow: hidden;
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
  flex-shrink: 0;
}

.brand-title { min-width: 0; overflow: hidden; }
.brand-title h1 { margin: 0; font-size: 15px; line-height: 1.1; color: #fff; font-weight: 700; letter-spacing: -.01em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.brand-title p { margin: 3px 0 0; color: #888; font-size: 11px; font-family: var(--mono); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.scope-chip { font-size: 9.5px; color: #888; font-family: var(--mono); font-weight: 600; display: flex; align-items: center; gap: 6px; min-width: 0; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; }

.side-metrics { min-height: 0; display: grid; grid-template-rows: auto minmax(0, 1fr); gap: 8px; overflow: hidden; }
.side-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; border-bottom: 1px solid rgba(255,255,255,.07); padding-bottom: 6px; }
.side-head h2 { margin: 0; font-size: 11px; color: #888; font-family: var(--mono); font-weight: 600; letter-spacing: .07em; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.metric-list {
  min-height: 0; display: flex; flex-direction: column; justify-content: space-between;
  overflow-y: auto; overflow-x: hidden; background: transparent; border: none; padding: 2px 0; gap: 2px;
}

.side-card {
  display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; align-items: center;
  background: transparent; padding: 5px 6px; min-width: 0;
  border-bottom: 1px solid rgba(255,255,255,.05); border-radius: 4px;
  transition: background .12s; box-sizing: border-box;
}
.side-card:last-child { border-bottom: none; }
.side-card:hover { background: rgba(255,255,255,.04); }
.side-card label {
  font-size: 10px; color: #888; font-family: var(--mono);
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0;
}
.side-card strong {
  font-size: 12.5px; color: #e8e8e8; font-weight: 600;
  white-space: nowrap; font-family: var(--mono); text-align: right;
  flex-shrink: 0; padding-left: 4px;
}
.side-card.accent { background: rgba(75, 85, 99, 0.14); }
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

    kpiCards: `/* ── KPI Cards & Summary Grid (Incident/SLA Canonical) ── */
.kpi-panel {
  display: grid; grid-template-rows: auto minmax(0, 1fr) auto auto; gap: 8px;
  height: 100%; min-height: 0; overflow: hidden;
}
.kpis {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(3, minmax(0, 1fr));
  gap: 8px; min-height: 0; flex: 1; overflow: hidden;
}
.kpi-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.kpi {
  border: 1px solid var(--line); border-radius: 6px; background: var(--surface);
  padding: 12px 14px; display: grid; grid-template-rows: auto 1fr auto;
  min-width: 0; min-height: 0; overflow: hidden;
  transition: border-color .15s, box-shadow .15s; position: relative;
}
.kpi.clickable { cursor: pointer; }
.kpi.clickable:hover { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }
.kpi.clickable .kpi-sub::after { content: ' · click to explore'; color: var(--accent); font-weight: 600; }
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

    overlays: `/* ── Clip-Path Overlay Expansion (Incident Pulse & SLA-Pulse Canonical) ── */
.analytics-overlay {
  position: fixed;
  left: calc(268px + 24px); right: 12px; top: 12px; bottom: 12px;
  z-index: 90;
  background: var(--rail-bg); border: 1px solid var(--rail-border); border-radius: 8px;
  padding: 14px; display: flex; flex-direction: column; gap: 8px;
  overflow: hidden;
  opacity: 0; pointer-events: none;
  clip-path: inset(0 100% 0 0 round 8px);
  transform: translateZ(0);
  transition: opacity .18s ease, clip-path .55s cubic-bezier(0.16, 1, 0.3, 1);
}
.analytics-overlay.open {
  opacity: 1; pointer-events: auto;
  clip-path: inset(0 0 0 0 round 8px);
}
.analytics-topbar {
  background: transparent; border: 1px solid rgba(255,255,255,.22);
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 0 16px; height: 50px; min-height: 50px; flex-shrink: 0; border-radius: 8px;
}
.analytics-topbar h2 { margin: 0; font-size: 14px; font-weight: 700; color: #fff; font-family: var(--mono); }
.analytics-close {
  height: 32px; background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.10);
  border-radius: 4px; color: #ccc; font-size: 11px; font-weight: 600; cursor: pointer;
  font-family: var(--mono); padding: 0 14px; transition: background .14s, color .14s;
}
.analytics-close:hover { background: rgba(255,255,255,.14); color: #fff; }
.analytics-tabs {
  background: rgba(255,255,255,.035); border-bottom: 1px solid rgba(255,255,255,.14);
  display: flex; gap: 4px; padding: 0 8px; flex-shrink: 0; border-radius: 6px 6px 0 0; overflow-x: auto;
}
.a-tab {
  height: 38px; border: 0; background: transparent; color: #8D96A3; font-size: 11.5px;
  font-weight: 600; cursor: pointer; font-family: var(--mono); padding: 0 14px;
  border-bottom: 2px solid transparent; transition: color .14s, border-bottom-color .14s;
  letter-spacing: .02em; white-space: nowrap;
}
.a-tab:hover { color: #F4F6F8; }
.a-tab.active { color: #F8FAFC; border-bottom-color: #F8FAFC; }
.analytics-body {
  min-height: 0; flex: 1; overflow-y: auto; padding: 16px 20px;
  background: transparent; border: 1px solid rgba(255,255,255,.22); border-radius: 8px;
}
.a-tab-pane { display: none; }
.a-tab-pane.active { display: block; animation: fadeInTab .24s cubic-bezier(0.16, 1, 0.3, 1) both; }
@keyframes fadeInTab { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
@media (max-width: 960px) {
  .analytics-overlay { left: 0; right: 0; top: 0; bottom: 0; border-radius: 0; z-index: 170; }
}`,

    drawers: `/* ── Slide-Over Drawers ── */
.drawer-backdrop, .drawer-overlay {
  position: fixed; inset: 0; z-index: 199;
  background: rgba(15, 23, 42, 0.45); backdrop-filter: blur(2px);
  opacity: 0; pointer-events: none;
  transition: opacity .2s ease;
}
.drawer-backdrop.open, .drawer-overlay.open { opacity: 1; pointer-events: auto; }
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

    healthBar: `/* ── Operational Health Bar Gauge (SLA-Pulse Canonical) ── */
.health-bar-wrap { margin-top: 6px; padding: 8px 10px; background: var(--surface-2); border: 1px solid var(--line); border-radius: 6px; }
.health-bar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.health-bar-label { font-size: 8.5px; font-weight: 700; font-family: var(--mono); letter-spacing: .07em; text-transform: uppercase; color: var(--muted); }
.health-bar-score { font-size: 11px; font-weight: 700; font-family: var(--mono); color: var(--ink); }
.health-bar-track { height: 7px; background: rgba(0,0,0,0.06); border: 1px solid var(--line); border-radius: 4px; overflow: hidden; margin-bottom: 6px; }
.health-bar-fill { height: 100%; border-radius: 3px; background: var(--ok); transition: width 0.6s cubic-bezier(.16, 1, .3, 1), background 0.3s ease; }
.health-bar-breakdown { display: flex; gap: 8px; flex-wrap: wrap; font-size: 9px; font-family: var(--mono); color: var(--muted); }
.health-bar-item { display: inline-flex; align-items: center; gap: 4px; }
.health-bar-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }`,

    dayDrawer: `/* ── Day Drilldown Drawer (Intraday Progression & Root Cause) ── */
.period-drawer, .agent-drawer, .day-drawer {
  position: fixed; top: 0; right: 0; height: 100%; width: min(720px, 50vw);
  background: var(--surface); z-index: 200; display: flex; flex-direction: column;
  transform: translateX(100%); box-shadow: -8px 0 32px rgba(0,0,0,.15);
  transition: transform .32s cubic-bezier(0.16, 1, 0.3, 1);
}
@media (max-width: 1180px) { .period-drawer, .agent-drawer, .day-drawer { width: min(720px, calc(100vw - 32px)); } }
@media (max-width: 520px) { .period-drawer, .agent-drawer, .day-drawer { width: 100vw; } }
.day-drawer.open, .agent-drawer.open, .period-drawer.open { transform: translateX(0); }
.drawer-header {
  background: var(--rail-bg); padding: 18px 20px 14px; flex-shrink: 0;
  position: relative; border-left: 1px solid var(--rail-border);
}
.drawer-back {
  background: rgba(255,255,255,.08); border: 1.5px solid rgba(255,255,255,.12);
  border-radius: 4px; color: #e8e8e8; font-size: 10px; font-weight: 600;
  padding: 4px 8px; cursor: pointer; font-family: var(--mono);
  display: inline-flex; align-items: center; transition: background .15s, transform .12s;
  letter-spacing: .03em; text-transform: uppercase; margin-bottom: 8px;
}
.drawer-back:hover { background: rgba(255,255,255,.16); transform: translateX(-2px); }
.drawer-close {
  position: absolute; top: 14px; right: 14px; background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.08); border-radius: 4px; color: #aaa;
  font-size: 16px; width: 28px; height: 28px; cursor: pointer; display: grid; place-items: center;
  line-height: 1; transition: background .15s, color .15s, transform .12s;
}
.drawer-close:hover { background: rgba(255,255,255,.12); color: #fff; transform: scale(1.05); }
.drawer-title-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding-right: 28px; }
.drawer-agent-name { font-size: 16px; font-weight: 700; color: #fff; font-family: var(--mono); margin-bottom: 2px; }
.drawer-agent-sub { font-size: 10px; color: #888; font-family: var(--mono); }
.drawer-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-top: 10px; }
@media (max-width: 520px) { .drawer-kpis { grid-template-columns: repeat(2, 1fr) !important; } }
.drawer-kpi { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); border-radius: 5px; padding: 7px 9px; }
.drawer-kpi:hover { background: rgba(255,255,255,.07); border-color: rgba(255,255,255,.14); }
.drawer-kpi-label { font-size: 8.5px; color: #888; font-family: var(--mono); font-weight: 600; letter-spacing: .07em; text-transform: uppercase; }
.drawer-kpi-value { font-size: 14px; font-weight: 700; color: #e8e8e8; font-family: var(--mono); margin-top: 2px; }
.drawer-kpi-sub { font-size: 8.5px; color: #666; font-family: var(--mono); margin-top: 1px; }
.drawer-body { flex: 1; overflow-y: auto; padding: 14px 18px; border-left: 1px solid var(--line); }
.drawer-section { margin-bottom: 16px; }
.drawer-section h4 { font-size: 9.5px; font-weight: 700; color: var(--muted); font-family: var(--mono); letter-spacing: .07em; text-transform: uppercase; margin: 0 0 8px; padding-bottom: 4px; border-bottom: 1px solid var(--line); }
.rc-card { background: var(--surface-2); border: 1px solid var(--line); border-radius: 6px; padding: 12px; margin-bottom: 14px; }
.rc-title { font-size: 10px; font-weight: 700; color: var(--muted); font-family: var(--mono); letter-spacing: .07em; text-transform: uppercase; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; }
.rc-meter-track { height: 16px; background: rgba(0,0,0,0.06); border: 1px solid var(--line); border-radius: 4px; overflow: hidden; display: flex; margin-bottom: 8px; }
.rc-meter-fill { height: 100%; transition: width 0.6s cubic-bezier(.16, 1, .3, 1); }
.rc-legend { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-family: var(--mono); font-size: 10.5px; }
.rc-legend-item { display: flex; align-items: center; gap: 6px; background: var(--surface); padding: 5px 8px; border-radius: 4px; border: 1px solid var(--line); }
.rc-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
.rc-val { margin-left: auto; font-weight: 700; color: var(--ink); }
.rc-takeaway { margin-top: 8px; font-size: 11px; font-family: var(--mono); line-height: 1.45; background: var(--surface); padding: 8px 10px; border-radius: 4px; border: 1px solid var(--line); }
.entity-pill, .clickable-agent-pill { cursor: pointer; background: var(--surface); transition: all .16s cubic-bezier(0.16, 1, 0.3, 1); display: inline-flex; align-items: center; gap: 6px; padding: 4px 8px; border: 1px solid var(--line); border-radius: 4px; font: 11px var(--mono); }
.entity-pill:hover, .clickable-agent-pill:hover { background: var(--surface-2) !important; border-color: var(--line-strong) !important; box-shadow: 0 3px 8px rgba(0,0,0,.08); transform: translateY(-1.5px); }
.bucket-chart, .hourly-gos-chart, .hourly-miss-chart { display: flex; align-items: flex-end; gap: 3px; height: 110px; padding: 20px 8px 6px; margin-bottom: 6px; background: var(--surface); border: 1px solid var(--line); border-radius: 6px; }
.bucket-col, .h-gos-col, .h-miss-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; position: relative; min-width: 0; cursor: pointer; }
.bucket-col:hover .bucket-bar, .h-gos-col:hover .h-gos-bar, .h-miss-col:hover .h-miss-stack { opacity: .85; transform: scaleY(1.04); transform-origin: bottom; }
.bucket-col.active .bucket-bar, .h-gos-col.active .h-gos-bar, .h-miss-col.active .h-miss-stack { box-shadow: 0 0 0 2px var(--ink); }
.bucket-bar, .h-gos-bar { width: 100%; max-width: 18px; border-radius: 3px 3px 0 0; min-height: 4px; transition: height 0.5s cubic-bezier(.16, 1, .3, 1), opacity .15s; }
.h-miss-stack { width: 100%; max-width: 18px; display: flex; flex-direction: column-reverse; border-radius: 3px 3px 0 0; overflow: hidden; }
.h-miss-seg { width: 100%; transition: height 0.5s cubic-bezier(.16, 1, .3, 1); }
.bucket-val, .h-gos-val, .h-miss-val { position: absolute; top: -16px; font-size: 8px; font-family: var(--mono); font-weight: 600; color: var(--ink); white-space: nowrap; }
.bucket-lbl, .h-gos-lbl { font-size: 8.5px; font-family: var(--mono); color: var(--muted); margin-top: 4px; }
.progress-wrap, .cum-gos-wrap { background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 10px; margin-bottom: 8px; }
.progress-svg, .cum-gos-svg { width: 100%; display: block; }
.progress-dot, .cum-gos-dot { transition: r .15s ease, stroke-width .15s ease; }
circle.progress-dot:hover, circle.cum-gos-dot:hover { r: 6px; stroke-width: 2.5px; }
.hour-detail { background: var(--surface-2); border: 1px solid var(--line); border-radius: 6px; padding: 0; margin-bottom: 12px; overflow: hidden; max-height: 0; opacity: 0; transition: max-height .3s ease, opacity .25s ease, padding .25s ease; }
.hour-detail.open { max-height: 500px; opacity: 1; padding: 12px; }
.hour-detail-title { font-size: 11.5px; font-weight: 700; color: var(--ink); font-family: var(--mono); margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; }
.hour-detail-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 8px; }
.hd-stat { background: var(--surface); border: 1px solid var(--line); border-radius: 4px; padding: 6px 8px; text-align: center; }
.hd-stat-label { font-size: 8px; color: var(--muted); font-family: var(--mono); font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
.hd-stat-value { font-size: 14px; font-weight: 700; color: var(--ink); font-family: var(--mono); margin-top: 2px; }
.hd-stat-sub { font-size: 8.5px; color: var(--muted); font-family: var(--mono); margin-top: 1px; }
.hd-narrative { font-size: 10.5px; font-family: var(--mono); line-height: 1.5; color: var(--ink); background: var(--surface); padding: 8px 10px; border-radius: 4px; border: 1px solid var(--line); }`,

    dayComparator: `/* ── Day Comparator (Side-by-side Day Comparison) ── */
.comparator-controls { display: flex; align-items: flex-end; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
.comp-select-group { display: flex; flex-direction: column; gap: 3px; }
.comp-select-group label { font-size: 8.5px; font-weight: 700; color: var(--muted); font-family: var(--mono); letter-spacing: .07em; text-transform: uppercase; }
.comp-select { height: 28px; border: 1px solid var(--line); border-radius: 4px; background: var(--surface); font: 10.5px var(--mono); padding: 0 8px; color: var(--ink); }
.comp-delta { display: inline-flex; align-items: center; gap: 4px; font: 600 10.5px var(--mono); padding: 2px 6px; border-radius: 3px; }
.comp-delta.improved { color: var(--ok); background: var(--ok-dim); }
.comp-delta.declined { color: var(--err); background: var(--err-dim); }
.comp-delta.neutral { color: var(--muted); background: var(--surface-2); }`,

    chartTooltip: `/* ── Floating Chart Tooltip ── */
#chartTooltip {
  position: fixed; display: none; background: rgba(22, 25, 31, 0.94);
  backdrop-filter: blur(4px); border: 1px solid rgba(255, 255, 255, 0.14);
  color: #e4e6eb; padding: 8px 12px; border-radius: 6px; font-family: var(--mono);
  font-size: 11px; z-index: 99999; pointer-events: none;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5); line-height: 1.4;
}`,

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
.btn.secondary:hover { background: var(--surface-2); }
.btn.ghost { background: transparent; color: var(--muted); border: 1px solid transparent; }
.btn.ghost:hover { background: var(--surface-2); color: var(--ink); }`,

    heatmap: `/* ── Heatmap Grid ── */
.heatmap-grid { display: grid; grid-template-columns: 54px repeat(24, minmax(0, 1fr)); gap: 2px; width: 100%; }
.hm-cell { display: flex; align-items: center; justify-content: center; font-size: 8.5px; font-family: var(--mono); color: var(--ink); height: 22px; border-radius: 2px; white-space: nowrap; }
.hm-data { cursor: default; transition: transform .1s, outline .1s; position: relative; font-weight: 600; }
.hm-data:hover { transform: scale(1.18); outline: 1.5px solid var(--ink); z-index: 2; }`,

    horizontalBars: `/* ── Horizontal Progress Bars ── */
.hbar-row { display: grid; grid-template-columns: minmax(110px, 38%) 1fr 66px; gap: 8px; align-items: center; margin-bottom: 2px; font-family: var(--mono); font-size: 10px; }
.hbar-lbl { color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; display: flex; align-items: center; gap: 4px; }
.hbar-lbl .sub { font-size: 9px; color: var(--muted); font-weight: normal; }
.hbar-track { height: 8px; background: var(--surface-2); border-radius: 3px; overflow: hidden; border: 1px solid rgba(0,0,0,.03); }
.hbar-fill { height: 100%; border-radius: 3px; transition: width .4s cubic-bezier(.4,0,.2,1); }
.hbar-val { color: var(--muted); text-align: right; font-weight: 600; font-size: 10px; font-variant-numeric: tabular-nums; white-space: nowrap; }`,

    badges: `/* ── Badges & Status Pills ── */
.badge { background: var(--surface-2); color: var(--muted); border: 1px solid var(--line); font-weight: 600; border-radius: 3px; padding: 3px 8px; font-size: 10px; font-family: var(--mono); }
.badge.ok { background: var(--ok-dim); color: var(--ok); border-color: rgba(26, 122, 86, .25); }
.badge.warn { background: var(--warn-dim); color: var(--warn); border-color: rgba(180, 83, 9, .25); }
.badge.err { background: var(--err-dim); color: var(--err); border-color: rgba(192, 57, 43, .25); }
.pill { display: inline-flex; align-items: center; gap: 4px; padding: 2px 7px; border-radius: 999px; font: 10px var(--mono); font-weight: 600; border: 1px solid var(--line); background: var(--surface-2); color: var(--muted); }
.pill.ok { background: var(--ok-dim); color: var(--ok); border-color: rgba(26, 122, 86, .25); }
.pill.warn { background: var(--warn-dim); color: var(--warn); border-color: rgba(180, 83, 9, .25); }
.pill.err { background: var(--err-dim); color: var(--err); border-color: rgba(192, 57, 43, .25); }
.pill.neutral { background: var(--surface-2); color: var(--ink); }
.date-filter-strip { display: flex; align-items: center; gap: 8px; font-family: var(--mono); font-size: 11px; }
.scope-bar-label { display: inline-flex; align-items: center; gap: 6px; font-size: 9px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
.period-pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ok); display: inline-block; box-shadow: 0 0 0 2px var(--ok-dim); animation: pulseDot 2s infinite; }
@keyframes pulseDot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .4; transform: scale(.85); } }`,

    generatedOutput: `/* ── Generated Output & Message Panel (Incident/SLA Canonical) ── */
.message-panel, .gen-output {
  background: var(--surface); border: 1px solid var(--line); border-radius: 8px;
  padding: 14px 16px; color: var(--ink); box-shadow: 0 1px 3px rgba(0,0,0,.02);
  min-width: 0; min-height: 0; height: 100%;
  display: grid; grid-template-rows: auto minmax(0, 1fr) auto auto; gap: 8px;
  overflow: hidden;
}
.message-panel .panel-head, .gen-output .panel-head { margin-bottom: 2px; }
.summary-textarea, textarea.summary-textarea, .output-area {
  width: 100%; height: 100%; min-height: 0; flex: 1;
  border: 1px solid var(--line); border-radius: 6px;
  background: var(--surface-2); color: var(--ink);
  padding: 12px 14px; font: 11.5px/1.55 var(--mono);
  resize: none; outline: none; white-space: pre-wrap; overflow-y: auto;
  box-sizing: border-box;
}
.summary-textarea:focus, textarea.summary-textarea:focus, .output-area:focus {
  border-color: var(--accent); background: var(--surface);
}
.rules, .calc-toggle {
  margin-top: 4px; border: 1px solid var(--line); border-radius: 5px;
  background: var(--surface-2); padding: 6px 10px; color: var(--muted);
  font-size: 10px; font-family: var(--mono);
}
.rules summary, .calc-toggle summary {
  cursor: pointer; color: var(--ink); font-weight: 600; list-style: none;
  display: flex; align-items: center; gap: 6px;
}
.rules summary::before, .calc-toggle summary::before { content: '▶'; font-size: 7.5px; color: var(--accent); }
details[open] summary::before, .calc-toggle[open] summary::before { content: '▼'; }
.rules div, .calc-toggle .rules-body { margin-top: 5px; display: grid; gap: 3px; line-height: 1.4; }
.actions, .output-actions {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px; align-items: center; margin-top: 4px; overflow: hidden;
}
.actions .btn, .output-actions .btn {
  height: 36px; font-size: 11.5px; padding: 0 8px; width: 100%;
}`,

    multiSelectFilter: `/* ── Multi-Select Filter Dropdown ── */
.filter-btn-wrap { position: relative; display: inline-block; }
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
.filter-drop.open, .scope-bar-btn.open .filter-drop { display: block; }
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
      "The MCP returns sidebarMarkupTemplate and sidebarCssTemplate as concrete implementation code. When creating a new app, copy both as the sidebar baseline, replacing only the brand content (logo letters, title, subtitle), scope label, and data-bound metric-card slot; retain class names, layout, styling, responsive behavior, and credit markup. When a project already has a reference sidebar, preserve its actual HTML/component and CSS verbatim and change only metric data bindings. Persistent dark rail (#151515) with brand, dataset snapshot/metrics, and footer; on narrow screens it collapses to the reference hamburger-triggered overlay. By default, the author credit stays at the very bottom: 'built by Tanmay Kalbande', linked to https://linkedin.com/in/tanmay-kalbande with target=_blank and rel=noopener noreferrer, in small muted IBM Plex Mono with the staggered name animation. The credit is configurable via credit option ('default', 'none', or custom { text, url }). When configured, it remains pinned at the bottom with zero cut-off.",
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
    noTextCardPiles:
      "STRICT ANTI-PATTERN: Never generate piles, stacks, or lists of text cards (such as repeated .finding-card blocks under 'Key Findings'). Executive summaries and written takeaways belong exclusively in the Generated Output panel (.gen-output). Data insights must be communicated visually through interactive KPI cards, horizontal bars, procedural SVG trend charts, heatmaps, and tables.",
    sidebarTextIntegrity:
      "STRICT INVARIANT — ZERO SIDEBAR TEXT CUT-OFF: The left rail (.rail) must have a guaranteed width: 268px with min-width: 268px on desktop and box-sizing: border-box. All metric rows (.side-card) must use grid-template-columns: minmax(0, 1fr) auto with gap: 8px. Metric labels in column 1 truncate with text-overflow: ellipsis, while metric values (strong) in column 2 remain flex-shrink: 0, text-align: right, and 100% visible. Never allow numbers, counts, dates, or currency figures in the sidebar snapshot to be clipped or truncated at the right edge.",
    canonicalDayDrawer:
      "STRICT INVARIANT — CANONICAL DRILLDOWN PERIOD DRAWER: When drilling down into any day, date, month, or batch, NEVER dump a plain HTML table into a basic white slide drawer. ALWAYS open the canonical PeriodDrawer (.period-drawer / .day-drawer, width: min(720px, 50vw)) featuring: (1) dark header (background: var(--rail-bg)) with back button ('← Back to List'), close button ('✕'), date/period title, subtitle, and 4-7 compact KPI metric chips (.drawer-kpis); (2) Root Cause / Segment Breakdown card (.rc-card) with proportional 2-tone meter track (.rc-meter-track) and operational takeaway callout; (3) Active entity chips (.entity-pill); (4) Cumulative/running progression SVG line chart (.progress-wrap / .cum-gos-wrap) with dataset baseline target guidelines and hover probe tooltips (#chartTooltip); (5) Bucket/time-slice clickable bar chart (.bucket-chart / .hourly-gos-chart); (6) Expandable detail panel (.hour-detail) displaying that bucket's statistics grid and dynamic operational narrative explanation.",
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
    "Generated dashboards include the configured credit (by default 'built by Tanmay Kalbande' linked to LinkedIn, or custom/none if configured) at the bottom of the sidebar, styled like the reference apps.",
    "Keep responsive behavior and accessible keyboard/focus semantics when adapting the content region.",
    "Use the complete component patterns (header, upload, nav tabs, KPI cards, panels, tables, overlays, drawers, heatmaps, horizontal bars, badges, generated output, multi-select filters, validation chips, buttons) provided in componentPatterns as the baseline for every generated dashboard. These are copy-ready CSS blocks.",
    "Pure SVG charts are strongly preferred over third-party charting libraries. Render lines, bars, areas, heatmaps, and distributions using procedural SVG with the design token palette. This ensures the dashboard works as a standalone HTML file with zero external dependencies.",
    "Every chart SVG element must use vector-effect: non-scaling-stroke for crisp rendering at any viewport size.",
    "When building a new dashboard, use the HTML_SNIPPETS templates to compose each section. Replace {{PLACEHOLDER}} markers with actual values. The snippets ensure correct HTML structure for each component pattern.",
    "Call getCompleteStylesheet() to get all CSS in a single paste-ready block. This is the recommended approach for new dashboards instead of manually concatenating the separate CSS properties.",
    "Use the section layout classes: .kpi-grid (3-column KPI row), .overview-split (asymmetric 2-column for findings + report), .seg-grid (auto-fit segment comparisons), .tab-panel/.tab-panel.active (tab panel visibility).",
  ],
} as const;

export const SECTION_LAYOUT_CSS = `
/* ── Section Layouts & 1-Screen Viewport Fitting (Incident-SLA Canonical) ── */
.tab-content-area, .dashboard-body {
  min-height: 0; flex: 1; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; height: 100%;
}
#tabPanels {
  min-height: 0; flex: 1; display: flex; flex-direction: column; height: 100%; width: 100%;
}
.tab-pane, .tab-panel {
  display: none; flex-direction: column; gap: 10px; min-height: 100%; height: 100%; width: 100%;
}
.tab-pane.active, .tab-panel.active {
  display: flex; flex: 1; min-height: 0;
}
.workspace, .overview-split {
  min-height: 0; height: 100%; flex: 1;
  display: grid; grid-template-columns: minmax(400px, .9fr) minmax(460px, 1.1fr);
  gap: 12px; overflow: hidden;
}
.kpi-panel {
  display: grid; grid-template-rows: auto minmax(0, 1fr) auto auto; gap: 8px;
  height: 100%; min-height: 0; overflow: hidden;
}
.kpis {
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(3, minmax(0, 1fr));
  gap: 8px; min-height: 0; flex: 1; overflow: hidden;
}
.kpi-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.message-panel, .gen-output {
  display: grid; grid-template-rows: auto minmax(0, 1fr) auto auto; gap: 8px;
  height: 100%; min-height: 0; overflow: hidden;
}
.summary-textarea, textarea.summary-textarea, .output-area {
  width: 100%; height: 100%; min-height: 0; flex: 1;
  border: 1px solid var(--line); border-radius: 6px; background: var(--surface-2); color: var(--ink);
  padding: 12px 14px; font: 11.5px/1.55 var(--mono); resize: none; outline: none; white-space: pre-wrap; overflow-y: auto;
  box-sizing: border-box;
}
.rules, .calc-toggle {
  margin-top: 4px; border: 1px solid var(--line); border-radius: 5px;
  background: var(--surface-2); padding: 6px 10px; color: var(--muted); font-size: 10px; font-family: var(--mono);
}
.rules summary, .calc-toggle summary {
  cursor: pointer; color: var(--ink); font-weight: 600; list-style: none; display: flex; align-items: center; gap: 6px;
}
.rules summary::before, .calc-toggle summary::before { content: '▶'; font-size: 7.5px; color: var(--accent); }
details[open] summary::before, .calc-toggle[open] summary::before { content: '▼'; }
.rules div, .calc-toggle .rules-body { margin-top: 5px; display: grid; gap: 3px; line-height: 1.4; }
.actions, .output-actions {
  display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; align-items: center; margin-top: 4px; overflow: hidden;
}
.actions .btn, .output-actions .btn { height: 36px; font-size: 11.5px; padding: 0 8px; width: 100%; }
.seg-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; }
.chart-container { min-height: 200px; }
.chart-container svg { width: 100%; height: 100%; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; color: var(--muted); font-family: var(--mono); font-size: 12px; text-align: center; gap: 8px; }
.filter-bar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-width: 0; position: relative; z-index: 20; }
.filter-label { font-family: var(--mono); font-size: 9.5px; color: var(--muted); letter-spacing: .07em; text-transform: uppercase; font-weight: 700; }
.store-search { height: 28px; padding: 0 10px; border: 1px solid var(--line); border-radius: 4px; background: var(--surface); font-family: var(--mono); font-size: 11px; color: var(--ink); min-width: 180px; }
.store-search:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 2px var(--accent-dim); }
.menu-btn { display: none; width: 32px; height: 32px; border: 1px solid var(--line-strong); border-radius: 4px; background: var(--surface); cursor: pointer; font-size: 15px; flex: 0 0 auto; }
@media (max-width: 960px) {
  .app { grid-template-columns: 1fr; }
  .rail { position: fixed; left: 12px; top: 12px; bottom: 12px; width: 268px; z-index: 150; transform: translate3d(-110%, 0, 0); transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 10px 30px rgba(0,0,0,.25); }
  .rail.open { transform: translate3d(0, 0, 0); }
  .menu-btn { display: grid; place-items: center; }
  .header { grid-template-columns: 1fr; }
  .upload-box { margin-top: 8px; }
  .workspace, .overview-split { grid-template-columns: 1fr; overflow: visible; height: auto; }
  .message-panel, .gen-output { min-height: 400px; }
  .actions, .output-actions { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .seg-grid { grid-template-columns: 1fr; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}
`;

export const HTML_SNIPPETS = {
  kpiCard: `<div class="kpi">
  <span class="kpi-label">{{LABEL}}</span>
  <span class="kpi-value" id="{{ID}}">—</span>
  <span class="kpi-sub">{{CONTEXT}}</span>
</div>`,
  kpiCardClickable: `<div class="kpi clickable" tabindex="0" role="button" aria-label="{{LABEL}} – click to explore">
  <span class="kpi-label">{{LABEL}}</span>
  <span class="kpi-value" id="{{ID}}">—</span>
  <span class="kpi-sub">{{CONTEXT}}</span>
</div>`,
  kpiGrid: `<div class="kpi-grid">
  <!-- Repeat kpi cards here -->
</div>`,
  panel: `<div class="panel">
  <div class="panel-head">
    <h2 class="panel-title">{{TITLE}}</h2>
  </div>
  <!-- Panel content -->
</div>`,
  panelWithBadge: `<div class="panel">
  <div class="panel-head">
    <h2 class="panel-title">{{TITLE}}</h2>
    <span class="badge">{{BADGE}}</span>
  </div>
  <!-- Panel content -->
</div>`,
  hbarRow: `<div class="hbar-row">
  <span class="hbar-lbl">{{LABEL}}</span>
  <div class="hbar-track"><div class="hbar-fill" style="width:{{PCT}}%;background:var(--chart-teal)"></div></div>
  <span class="hbar-val">{{VALUE}}</span>
</div>`,
  hbarRowClickable: `<div class="hbar-row clickable" tabindex="0" role="button" data-key="{{KEY}}" data-value="{{LABEL}}">
  <span class="hbar-lbl">{{LABEL}}</span>
  <div class="hbar-track"><div class="hbar-fill" style="width:{{PCT}}%;background:var(--chart-teal)"></div></div>
  <span class="hbar-val">{{VALUE}}</span>
</div>`,
  navTab: `<button class="nav-tab" role="tab" aria-selected="false" data-tab="{{TAB_ID}}">{{TAB_LABEL}}</button>`,
  navTabActive: `<button class="nav-tab active" role="tab" aria-selected="true" data-tab="{{TAB_ID}}">{{TAB_LABEL}}</button>`,
  validationCheck: `<div class="check {{STATUS}}">
  <span>{{LABEL}}</span>
  <strong>{{VALUE}}</strong>
</div>`,
  badge: `<span class="badge {{STATUS}}">{{TEXT}}</span>`,
  genOutput: `<div class="panel message-panel gen-output">
  <div class="panel-head" style="margin-bottom:4px;">
    <h2 class="panel-title">{{TITLE}}</h2>
    <span class="badge" id="{{BADGE_ID}}">Output</span>
  </div>
  <textarea id="{{TEXTAREA_ID}}" class="summary-textarea" readonly>{{PLACEHOLDER_TEXT}}</textarea>
  <details class="rules calc-toggle">
    <summary>Calculation rules</summary>
    <div class="rules-body" id="{{RULES_ID}}">
      <span>• Rate = events meeting threshold / total eligible volume.</span>
      <span>• Duration = average turnaround time for completed records.</span>
      <span>• Critical backlog = active uncompleted records exceeding threshold.</span>
    </div>
  </details>
  <div class="actions output-actions">
    <button class="btn" id="{{COPY_BTN}}">Copy msg</button>
    <button class="btn info" id="{{INSIGHTS_BTN}}">Insights</button>
    <button class="btn secondary" id="{{DOWNLOAD_BTN}}">.txt</button>
    <button class="btn secondary" id="{{ANALYZE_BTN}}">Analyze data ✦</button>
  </div>
</div>`,
  dataTable: `<div style="overflow:auto">
  <table class="data-table" id="{{TABLE_ID}}">
    <thead><tr id="{{HEAD_ID}}"><!-- th cells --></tr></thead>
    <tbody id="{{BODY_ID}}"><!-- tr rows --></tbody>
  </table>
</div>`,
  drawer: `<div class="drawer-backdrop" id="drawerBackdrop"></div>
<div class="slide-drawer" id="slideDrawer">
  <div style="padding:16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--line)">
    <h2 style="margin:0;font-size:14px;font-weight:700" id="drawerTitle">Details</h2>
    <button class="btn secondary" id="drawerClose" style="height:28px;padding:0 10px;font-size:11px">✕ Close</button>
  </div>
  <div style="padding:16px" id="drawerBody"></div>
</div>`,
  uploadBox: `<div class="upload-box" id="uploadBox">
  <span class="upload-kicker">DATASET · STAYS ON THIS DEVICE</span>
  <span class="upload-title">Drop a CSV or Excel file</span>
  <span class="file-name" id="fileName">No file loaded · .csv .xlsx .xls</span>
  <label class="file-btn" tabindex="0">Choose file<input type="file" id="fileInput" accept=".csv,.xlsx,.xls" hidden></label>
</div>`,
  filterButton: `<button class="scope-bar-btn" data-col="{{COLUMN}}">All {{COLUMN}}</button>`,
  chartSvgContainer: `<div class="panel">
  <div class="panel-head"><h2 class="panel-title">{{TITLE}}</h2></div>
  <div class="chart-container" style="min-height:{{HEIGHT}}px">
    <svg id="{{SVG_ID}}" viewBox="0 0 {{WIDTH}} {{HEIGHT}}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%"></svg>
  </div>
</div>`,
  kpis: `<div class="kpis">
  <!-- 6 KPI cards in 2x3 grid (repeats .kpi or .kpi.clickable) -->
</div>`,
  overviewSplit: `<div class="workspace overview-split">
  <!-- Left Column: KPI SUMMARY (Balanced Architecture) -->
  <div class="panel kpi-panel" id="execLeftPanel">
    <div class="panel-head">
      <div style="display:flex;align-items:center;gap:8px;">
        <h2 class="panel-title">KPI SUMMARY</h2>
        <span class="badge" id="kpiCountBadge">Waiting</span>
      </div>
    </div>
    <div class="kpis" id="execKpis">
      <!-- 6 KPI cards in 2x3 grid (repeats .kpi or .kpi.clickable) -->
    </div>
    <div class="health-bar-wrap" id="execHealthBar">
      <div class="health-bar-header">
        <span class="health-bar-label">Operational Health</span>
        <span class="health-bar-score" id="healthScoreValue">100/100</span>
      </div>
      <div class="health-bar-track">
        <div class="health-bar-fill" id="healthBarFill" style="width:100%;background:var(--ok)"></div>
      </div>
      <div class="health-bar-breakdown" id="healthBarBreakdown">
        <span class="health-bar-item"><span class="health-bar-dot" style="background:var(--ok)"></span> Primary Target (≥80%)</span>
        <span class="health-bar-item"><span class="health-bar-dot" style="background:var(--warn)"></span> Exceptions (≤5%)</span>
        <span class="health-bar-item"><span class="health-bar-dot" style="background:var(--chart-indigo)"></span> Turnaround</span>
      </div>
    </div>
    <div class="validation" id="execValidation">
      <!-- 3 Validation check cards (.check) -->
    </div>
  </div>

  <!-- Right Column: Generated Output Panel with Fixed Height & 4 Overlay Action Buttons -->
  <div class="panel message-panel gen-output" id="execRightPanel">
    <div class="panel-head">
      <h2 class="panel-title">GENERATED OUTPUT</h2>
      <span class="badge" id="outputBadge">Output</span>
    </div>
    <textarea id="message" class="summary-textarea" readonly>Upload CSV or Excel dataset to generate the operational update.</textarea>
    <details class="rules calc-toggle">
      <summary>Calculation rules</summary>
      <div class="rules-body" id="rulesBody">
        <span>• Rate = events meeting threshold / total eligible volume.</span>
        <span>• Duration = average turnaround time for completed records.</span>
        <span>• Critical backlog = active uncompleted records exceeding threshold.</span>
      </div>
    </details>
    <div class="actions output-actions">
      <button class="btn" id="copyBtn">Copy msg</button>
      <button class="btn info" id="insightsBtn">Insights</button>
      <button class="btn secondary" id="downloadBtn">.txt</button>
      <button class="btn secondary" id="analyzeBtn">Analyze data ✦</button>
    </div>
  </div>
</div>`,
  segGrid: `<div class="seg-grid">
  <!-- Segment comparison panels -->
</div>`,
  healthBar: `<div class="health-bar-wrap" id="{{HEALTH_ID}}">
  <div class="health-bar-header">
    <span class="health-bar-label">Operational Health</span>
    <span class="health-bar-score" id="{{SCORE_ID}}">100/100</span>
  </div>
  <div class="health-bar-track">
    <div class="health-bar-fill" id="{{FILL_ID}}" style="width:100%;background:var(--ok)"></div>
  </div>
  <div class="health-bar-breakdown">
    <span class="health-bar-item"><span class="health-bar-dot" style="background:var(--ok)"></span> Target (≥80%)</span>
    <span class="health-bar-item"><span class="health-bar-dot" style="background:var(--warn)"></span> Drops (≤5%)</span>
    <span class="health-bar-item"><span class="health-bar-dot" style="background:var(--chart-indigo)"></span> Performance</span>
  </div>
</div>`,
  dayDrawer: `<div class="drawer-overlay" id="dayDrawerOverlay"></div>
<aside class="agent-drawer day-drawer" id="dayDrawer" aria-label="Day Performance Detail">
  <div class="drawer-header">
    <button class="drawer-close" id="dayDrawerClose" aria-label="Close day detail">✕</button>
    <button class="drawer-back" id="dayDrawerBack">← Back to Daily List</button>
    <div class="drawer-title-row">
      <div class="drawer-agent-name" id="dayDrawerTitle">Date Detail</div>
      <button class="btn secondary" id="dlDayCsv" style="height:26px;padding:0 8px;font-size:10px">CSV</button>
    </div>
    <div class="drawer-agent-sub" id="dayDrawerSub">Intraday progression &amp; root cause breakdown</div>
    <div class="drawer-kpis" id="dayDrawerKpis">
      <div class="drawer-kpi"><div class="drawer-kpi-label">Volume</div><div class="drawer-kpi-value" id="ddVol">—</div><div class="drawer-kpi-sub">Total records</div></div>
      <div class="drawer-kpi"><div class="drawer-kpi-label">Completed</div><div class="drawer-kpi-value" id="ddHandled">—</div><div class="drawer-kpi-sub">Handled</div></div>
      <div class="drawer-kpi"><div class="drawer-kpi-label">Compliance</div><div class="drawer-kpi-value" id="ddCompliance" style="color:var(--ok)">—</div><div class="drawer-kpi-sub">Within SLA/target</div></div>
      <div class="drawer-kpi"><div class="drawer-kpi-label">Breaches / Drops</div><div class="drawer-kpi-value" id="ddBreaches" style="color:var(--err)">—</div><div class="drawer-kpi-sub">Out of SLA</div></div>
    </div>
  </div>
  <div class="drawer-body" id="dayDrawerBody">
    <div class="rc-card" id="dayRCA">
      <div class="rc-title"><span>Root Cause Breakdown</span><span class="badge" id="dayStatusBadge">Analyzing</span></div>
      <div class="rc-meter-track">
        <div class="rc-meter-fill" id="rcSegA" style="width:60%;background:var(--chart-amber)"></div>
        <div class="rc-meter-fill" id="rcSegB" style="width:40%;background:var(--chart-red)"></div>
      </div>
      <div class="rc-legend">
        <div class="rc-legend-item"><div class="rc-dot" style="background:var(--chart-amber)"></div><span>Primary Delay</span><span class="rc-val" id="rcValA">—</span></div>
        <div class="rc-legend-item"><div class="rc-dot" style="background:var(--chart-red)"></div><span>Secondary / Drop</span><span class="rc-val" id="rcValB">—</span></div>
      </div>
      <div class="rc-takeaway" id="dayTakeaway">Operational takeaway summary</div>
    </div>
    <div class="drawer-section" id="dayContribSection">
      <h4>Active Contributors / Entities</h4>
      <div id="dayContribList" style="display:flex;flex-wrap:wrap;gap:6px"></div>
    </div>
    <div class="drawer-section">
      <h4>Intraday Metric Progression</h4>
      <div class="cum-gos-wrap"><svg id="dayProgressionSvg" class="cum-gos-svg" viewBox="0 0 500 135" preserveAspectRatio="xMidYMid meet"></svg></div>
    </div>
    <div class="drawer-section">
      <h4>Hourly Breakdown — Click bar for detail</h4>
      <div class="hourly-gos-chart" id="dayHourlyBars"></div>
    </div>
    <div class="hour-detail" id="hourDetailPanel">
      <div class="hour-detail-title"><span id="hdTitle">Hour Detail</span><span class="badge" id="hdBadge">Selected</span></div>
      <div class="hour-detail-grid" id="hdGrid"></div>
      <div class="hd-narrative" id="hdNarrative">Select an hourly column above to inspect operational drivers.</div>
    </div>
  </div>
</aside>`,
  dayComparator: `<div class="panel">
  <div class="panel-head">
    <h3 class="panel-title">DAY-OVER-DAY COMPARATOR</h3>
    <span class="badge" id="compBadge">Comparison</span>
  </div>
  <div class="comparator-controls">
    <div class="comp-select-group"><label>Base Day (A)</label><select class="comp-select" id="compSelectA"></select></div>
    <div class="comp-select-group"><label>Comparison Day (B)</label><select class="comp-select" id="compSelectB"></select></div>
    <div style="margin-left:auto"><span class="comp-delta neutral" id="compDeltaSummary">Select two dates to compare</span></div>
  </div>
  <div id="compResultsGrid" style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:10px;"></div>
</div>`,
  analyticsOverlay: `<section class="analytics-overlay" id="analyticsOverlay" role="dialog" aria-modal="true">
  <div class="analytics-topbar">
    <div style="display:flex;align-items:center;gap:10px;">
      <h2>Analytics &amp; Operational Insights</h2>
      <span class="badge">DEEP DIVE</span>
    </div>
    <div class="date-filter-strip" id="overlayFilterStrip">
      <span class="scope-bar-label"><span class="period-pulse-dot"></span> LIVE DATASET</span>
    </div>
    <button class="analytics-close" id="analyticsClose">✕ Back to Dashboard</button>
  </div>
  <nav class="analytics-tabs" id="overlayTabs" aria-label="Analytics sections">
    <button class="a-tab active" data-otab="insights">Top Insights</button>
    <button class="a-tab" data-otab="daily">Daily Breakdown</button>
    <button class="a-tab" data-otab="distribution">Distribution &amp; Segments</button>
  </nav>
  <div class="analytics-body" id="overlayBody">
    <div class="a-tab-pane active" id="pane-overlay-insights"></div>
    <div class="a-tab-pane" id="pane-overlay-daily"></div>
    <div class="a-tab-pane" id="pane-overlay-distribution"></div>
  </div>
</section>`,
  analysisStudioOverlay: `<section class="analysis-studio-overlay" id="analysisStudioOverlay" role="dialog" aria-modal="true">
  <div class="analytics-topbar">
    <div><p>DATA LAB / INTERACTIVE</p><h2>Analysis Studio &middot; Pivot Table</h2></div>
    <span class="badge" id="pivotRecordBadge">0 RECORDS</span>
    <button class="analytics-close" id="analysisStudioClose">Back to Dashboard</button>
  </div>
  <div class="analysis-studio-body">
    <div class="analysis-workbench">
      <section class="analysis-header panel">
        <div><p class="analysis-kicker">FLEXIBLE DATA WORKBENCH</p><h2>Analysis Studio</h2><span>Build a pivot view &mdash; every control changes the data, not just the display.</span></div>
        <div class="studio-tabs">
          <button class="active">Pivot Workbench</button>
          <div class="analysis-scope"><b id="pivotScopeCount">0</b><span>records</span></div>
        </div>
      </section>
      <section class="analysis-builder panel">
        <div class="builder-heading"><div><p class="analysis-kicker">PIVOT BUILDER</p><h3>Drag-free, spreadsheet-style analysis</h3></div><span>Combine any row, column, and one or more measures</span></div>
        <div class="builder-shelves-wrap">
          <div class="field-shelves shelf-primary">
            <label><span>ROWS</span><select id="pivotRow"></select></label>
            <label><span>COLUMNS</span><select id="pivotCol"><option value="none">No split &mdash; compare metrics</option></select></label>
            <label><span>SHOW</span><select id="pivotLimit"><option value="10">Top 10</option><option value="5">Top 5</option><option value="25">Top 25</option><option value="0">All rows</option></select></label>
            <label><span>SEARCH ROWS</span><input id="pivotSearch" placeholder="Search..."></label>
          </div>
        </div>
        <div class="metric-chip-row" id="pivotMetricChips"><span class="metric-chip-label">METRICS</span></div>
      </section>
      <section class="analysis-result panel">
        <div class="analysis-result-head">
          <div><p class="analysis-kicker">LIVE PIVOT RESULT</p><h3 id="pivotResultTitle">&mdash;</h3></div>
          <div><button class="analysis-export" id="pivotExport">Export CSV</button><button class="analysis-sort" id="pivotSortBtn">&darr; High to low</button><span class="badge" id="pivotRowCount">0 rows</span></div>
        </div>
        <div class="pivot-wrap" id="pivotTableWrap"></div>
        <div class="analysis-footnote">Click any row or cell to investigate that segment in the detail drawer. Current global filters are always preserved.</div>
      </section>
    </div>
  </div>
</section>`,
} as const;

export function getCompleteStylesheet(): string {
  const shell = DASHBOARD_SHELL_CONTRACT;
  return [
    shell.designTokens,
    shell.darkOverlayTokens,
    shell.frameCode,
    shell.sidebarCssTemplate,
    ...Object.values(shell.componentPatterns),
    SECTION_LAYOUT_CSS,
  ].join('\n\n');
}

type ComponentPattern = { css: string; html: string; usage: string };

/**
 * Generic HTML/CSS patterns ported from the Incident Pulse and SLA Pulse
 * references. They contain no service- or SLA-specific fields or formulas.
 */
const EXTENDED_COMPONENT_PATTERNS: Record<string, ComponentPattern> = {
  trendCharts: {
    css: `.trend-panel { min-width:0; overflow:hidden; }
.trend-head,.trend-legend,.trend-summary { display:flex; align-items:center; justify-content:space-between; gap:10px; flex-wrap:wrap; }
.trend-visual { position:relative; min-height:180px; overflow:hidden; }
.trend-svg { display:block; width:100%; height:auto; min-height:150px; overflow:visible; }
.trend-grid-line { stroke:var(--line); stroke-width:1; vector-effect:non-scaling-stroke; }
.trend-series { fill:none; stroke:var(--series-color,var(--chart-blue)); stroke-width:2.25; stroke-linecap:round; stroke-linejoin:round; vector-effect:non-scaling-stroke; }
.trend-area { fill:var(--series-color,var(--chart-blue)); opacity:.12; }
.trend-point { fill:var(--series-color,var(--chart-blue)); stroke:var(--surface); stroke-width:2; cursor:pointer; vector-effect:non-scaling-stroke; }
.trend-axis-label,.trend-legend-item,.trend-summary-item { color:var(--muted); font:9px var(--mono); }
.trend-legend-swatch { display:inline-block; width:14px; height:3px; margin-right:5px; vertical-align:middle; background:var(--series-color,var(--chart-blue)); }
.trend-summary { justify-content:flex-start; border-top:1px solid var(--line); padding-top:8px; }
@media(max-width:640px){.trend-visual{min-height:145px}.trend-svg{min-height:125px}.trend-summary{gap:6px 12px}}`,
    html: `<section class="panel trend-panel">
  <div class="panel-head trend-head"><h3 class="panel-title">{{CHART_TITLE}}</h3><div class="trend-legend" aria-label="Chart series legend"></div></div>
  <figure class="trend-visual"><svg class="trend-svg" viewBox="0 0 720 220" role="img" aria-label="{{CHART_DESCRIPTION}}" preserveAspectRatio="xMidYMid meet"><g class="trend-grid"></g><g class="trend-series-layer"></g><g class="trend-axis"></g></svg><figcaption class="sr-only">{{CHART_DESCRIPTION}}</figcaption></figure>
  <div class="trend-summary" aria-live="polite"></div>
</section>`,
    usage: "Use for ordered time or sequence data (VolumeChart, MTTRTrend, and inflow/outflow velocity patterns). Map the dataset's own date/time field and one or more numeric measures; choose line, area, or bar encoding based on density. Generate SVG points/paths from the uploaded rows, use ResizeObserver for width, shared --chart-* tokens for colors, #chartTooltip for hover details, and clickable marks only when they can filter or drill. Do not assume calls, SLA, or resolution fields. Include a tabular data alternative and handle empty/invalid dates.",
  },
  flowDiagram: {
    css: `.flow-panel { min-width:0; overflow:hidden; }
.flow-toolbar { display:flex; align-items:end; gap:8px; flex-wrap:wrap; }
.flow-toolbar label { display:grid; gap:3px; color:var(--muted); font:700 8px var(--mono); letter-spacing:.07em; text-transform:uppercase; }
.flow-toolbar select { min-width:130px; height:30px; border:1px solid var(--line); border-radius:5px; padding:0 8px; color:var(--ink); background:var(--surface); font:10px var(--mono); }
.flow-canvas { min-height:220px; overflow:auto; }
.flow-svg { display:block; width:100%; min-width:560px; height:auto; }
.flow-link { fill:none; stroke:var(--flow-color,var(--chart-blue)); stroke-opacity:.2; stroke-width:var(--flow-width,2px); cursor:pointer; transition:stroke-opacity .15s ease; }
.flow-link:hover,.flow-link.active { stroke-opacity:.65; }
.flow-node { fill:var(--node-color,var(--chart-blue)); stroke:var(--surface); stroke-width:1; rx:3; cursor:pointer; }
.flow-node-label { fill:var(--ink); font:10px var(--mono); }
.flow-stage-label { fill:var(--muted); font:700 8px var(--mono); letter-spacing:.08em; text-transform:uppercase; }
.flow-legend { display:flex; flex-wrap:wrap; gap:6px 14px; padding-top:8px; border-top:1px solid var(--line); }
.flow-legend-item { display:inline-flex; align-items:center; gap:5px; color:var(--muted); font:9px var(--mono); }
.flow-legend-swatch { width:8px; height:8px; border-radius:2px; background:var(--node-color,var(--chart-blue)); }
@media(max-width:640px){.flow-canvas{min-height:180px}.flow-svg{min-width:480px}}`,
    html: `<section class="panel flow-panel"><div class="panel-head"><h3 class="panel-title">{{FLOW_TITLE}}</h3><div class="flow-toolbar"><label>{{STAGE_A_LABEL}}<select data-flow-stage="0"></select></label><label>{{STAGE_B_LABEL}}<select data-flow-stage="1"></select></label><label>{{STAGE_C_LABEL}}<select data-flow-stage="2"></select></label></div></div><div class="flow-canvas"><svg class="flow-svg" viewBox="0 0 900 360" role="img" aria-label="Three-stage category flow"><g class="flow-links"></g><g class="flow-nodes"></g><g class="flow-labels"></g></svg></div><div class="flow-legend"></div><div class="sr-only flow-table-alternative"></div></section>`,
    usage: "Use for transitions across three categorical dimensions (Sankey/alluvial flow), such as source → type → outcome. Populate the three selectors from categorical columns; field names and labels must come from the dataset. Aggregate link weights from row counts or a justified numeric measure, cap each stage to a readable top N plus Other, scale link width consistently, and provide hover tooltips, node/link highlighting, an accessible text/table alternative, and a graceful state for empty data. Do not hard-code incident or call categories.",
  },
  periodComparison: {
    css: `.period-compare { min-width:0; }
.period-controls { display:grid; grid-template-columns:minmax(0,1fr) auto minmax(0,1fr); align-items:end; gap:10px; padding:12px 14px; border-bottom:1px solid var(--line); }
.period-select { display:grid; gap:4px; color:var(--muted); font:700 8px var(--mono); letter-spacing:.08em; text-transform:uppercase; }
.period-select select { width:100%; min-width:0; height:32px; border:1px solid var(--line); border-radius:5px; padding:0 8px; color:var(--ink); background:var(--surface); font:10px var(--mono); }
.period-vs { color:var(--muted); font:700 9px var(--mono); }
.period-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(210px,1fr)); gap:8px; padding:12px; }
.period-metric { min-width:0; padding:10px 12px; border:1px solid var(--line); border-radius:6px; background:var(--surface); }
.period-metric-head,.period-values { display:flex; justify-content:space-between; align-items:center; gap:8px; }
.period-metric-label { color:var(--muted); font:700 8px var(--mono); letter-spacing:.07em; text-transform:uppercase; }
.period-value { color:var(--ink); font:700 14px var(--mono); font-variant-numeric:tabular-nums; }
.period-delta { padding:2px 6px; border-radius:4px; color:var(--ink); background:var(--surface-2); font:700 9px var(--mono); }
.period-delta.up { color:var(--ok); background:var(--ok-dim); }.period-delta.down { color:var(--err); background:var(--err-dim); }
.period-direction-neutral .period-delta { color:var(--muted); background:var(--surface-2); }
@media(max-width:520px){.period-controls{grid-template-columns:1fr}.period-vs{display:none}}`,
    html: `<section class="panel period-compare"><div class="panel-head"><h3 class="panel-title">{{COMPARISON_TITLE}}</h3><button class="btn btn-sm" type="button" data-export="period-comparison">Export CSV</button></div><div class="period-controls"><label class="period-select">{{PERIOD_A_LABEL}}<select data-period="a"></select></label><span class="period-vs" aria-hidden="true">VS</span><label class="period-select">{{PERIOD_B_LABEL}}<select data-period="b"></select></label></div><div class="period-grid" aria-live="polite"></div></section>`,
    usage: "Use for two dates, cohorts, regions, or user-selected scopes. Populate both selectors from available dataset groups and compare only measures with a defensible aggregation. Render each measure as A, B, absolute/relative delta, and a neutral/up/down state. Directionality is metric-specific and must be explicitly declared (higher-is-better, lower-is-better, or neutral); never imply improvement from arithmetic sign alone. Export the currently displayed comparison when an export action is present.",
  },
  scenarioLab: {
    css: `.scenario-lab { min-width:0; }
.scenario-intro { margin:0; color:var(--muted); font-size:10px; line-height:1.5; }
.scenario-grid { display:grid; grid-template-columns:minmax(220px,.8fr) minmax(0,1.2fr); gap:12px; padding:14px; }
.scenario-controls { display:grid; align-content:start; gap:10px; }
.scenario-control { display:grid; gap:5px; color:var(--muted); font:700 8px var(--mono); letter-spacing:.06em; text-transform:uppercase; }
.scenario-control input[type=range] { width:100%; accent-color:var(--chart-teal); }
.scenario-control output { color:var(--ink); font:600 10px var(--mono); letter-spacing:0; text-transform:none; }
.scenario-results { display:grid; grid-template-columns:repeat(auto-fit,minmax(130px,1fr)); gap:8px; align-content:start; }
.scenario-result { padding:10px; border:1px solid var(--line); border-radius:6px; background:var(--surface); }
.scenario-result-label { color:var(--muted); font:700 8px var(--mono); letter-spacing:.07em; text-transform:uppercase; }
.scenario-result-value { display:block; margin-top:5px; color:var(--ink); font:700 17px var(--mono); font-variant-numeric:tabular-nums; }
.scenario-result-delta { margin-top:4px; color:var(--muted); font:9px var(--mono); }
.scenario-note { grid-column:1/-1; padding-top:8px; border-top:1px solid var(--line); color:var(--muted); font:9px var(--mono); }
@media(max-width:680px){.scenario-grid{grid-template-columns:1fr}}`,
    html: `<section class="panel scenario-lab"><div class="panel-head"><div><h3 class="panel-title">{{SCENARIO_TITLE}}</h3><p class="scenario-intro">Adjust assumptions to compare modeled outcomes with the current baseline.</p></div><button class="btn btn-sm" type="button" data-scenario-reset>Reset</button></div><div class="scenario-grid"><div class="scenario-controls"></div><div class="scenario-results" aria-live="polite"><div class="scenario-result"><span class="scenario-result-label">Baseline</span><strong class="scenario-result-value" data-scenario-baseline>—</strong></div><div class="scenario-result"><span class="scenario-result-label">Scenario</span><strong class="scenario-result-value" data-scenario-value>—</strong></div><div class="scenario-result"><span class="scenario-result-label">Change</span><strong class="scenario-result-value" data-scenario-delta>—</strong></div><p class="scenario-note">{{MODEL_ASSUMPTIONS}}</p></div></div></section>`,
    usage: "Use for a user-controlled what-if analysis only when the dataset supports a clear baseline and formula. Build slider controls from explicit assumptions and recalculate outputs from the uploaded rows; show baseline, modeled result, and delta with the formula/assumptions visible. Do not invent staffing, capacity, cost, or causal effects from correlations. Keep the component useful outside operations dashboards by naming controls and outcomes from the user's data/domain.",
  },
  insightFeed: {
    css: `.insight-feed { min-width:0; }
.insight-toolbar { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
.insight-chip { min-height:26px; padding:3px 8px; border:1px solid var(--line); border-radius:5px; color:var(--muted); background:var(--surface); cursor:pointer; font:600 9px var(--mono); }
.insight-chip.active { border-color:var(--accent-line); color:var(--ink); background:var(--accent-dim); }
.insight-search { min-width:160px; height:29px; border:1px solid var(--line); border-radius:5px; padding:0 8px; color:var(--ink); background:var(--surface); font:10px var(--mono); }
.insight-list { display:grid; max-height:420px; overflow:auto; }
.insight-row { display:grid; grid-template-columns:68px minmax(0,1fr) auto; align-items:start; gap:9px; padding:9px 12px; border-bottom:1px solid var(--line); }
.insight-severity { color:var(--muted); font:700 8px var(--mono); letter-spacing:.07em; text-transform:uppercase; }
.insight-row[data-severity=high] .insight-severity { color:var(--err); }.insight-row[data-severity=medium] .insight-severity { color:var(--warn); }
.insight-title { color:var(--ink); font-size:10px; font-weight:700; }.insight-detail { margin-top:3px; color:var(--muted); font-size:9px; line-height:1.45; }
.insight-action { color:var(--accent); background:transparent; border:0; cursor:pointer; font:600 9px var(--mono); }
@media(max-width:520px){.insight-row{grid-template-columns:58px minmax(0,1fr)}.insight-action{grid-column:2;justify-self:start}.insight-search{flex:1}}`,
    html: `<section class="panel insight-feed"><div class="panel-head"><div><h3 class="panel-title">{{INSIGHT_TITLE}}</h3><span class="badge" data-insight-count>0</span></div><div class="insight-toolbar"><div class="insight-filters" role="group" aria-label="Filter insights"></div><input class="insight-search" type="search" placeholder="Search insights" aria-label="Search insights"></div></div><div class="insight-list" aria-live="polite"></div></section>`,
    usage: "Use for a short, ranked set of data-supported findings with severity, category, title, evidence, and an optional drill action. Derive findings from the uploaded rows and label the rule/threshold used; let users filter/search the list. Render compact rows rather than a vertical stack of text cards. If nothing qualifies, show a concise empty state; do not fabricate narrative or severity.",
  },
  leaderboard: {
    css: `.rank-panel { min-width:0; }
.rank-list { display:grid; gap:3px; }
.rank-row { display:grid; grid-template-columns:28px minmax(100px,1fr) minmax(80px,1.2fr) 74px; align-items:center; gap:8px; min-height:34px; padding:4px 8px; border-bottom:1px solid var(--line); }
.rank-position { color:var(--muted); font:700 9px var(--mono); text-align:center; }
.rank-name { min-width:0; overflow:hidden; color:var(--ink); font:600 10px var(--mono); text-overflow:ellipsis; white-space:nowrap; }
.rank-track { height:6px; overflow:hidden; border-radius:4px; background:var(--surface-2); }
.rank-fill { height:100%; width:var(--rank-width,0%); border-radius:inherit; background:var(--rank-color,var(--chart-teal)); }
.rank-value { color:var(--ink); font:700 10px var(--mono); text-align:right; font-variant-numeric:tabular-nums; }
.rank-row[tabindex],.rank-row[data-clickable=true] { cursor:pointer; }.rank-row[data-clickable=true]:hover { background:var(--surface-3); }
@media(max-width:480px){.rank-row{grid-template-columns:24px minmax(70px,1fr) 1fr 58px;gap:5px}.rank-name,.rank-value{font-size:9px}}`,
    html: `<section class="panel rank-panel"><div class="panel-head"><h3 class="panel-title">{{RANK_TITLE}}</h3><label class="sr-only">Rank by<select data-rank-metric></select></label></div><div class="rank-list" role="list"></div></section>`,
    usage: "Use to compare entities (teams, products, locations, people, or segments) against one selected metric. Aggregate using a defensible rule, disclose sample size/minimum-volume exclusions, and avoid combining metrics into an opaque score unless the user approved its formula. Label whether high or low ranks first; allow row drill-down only when it filters the dashboard or opens details.",
  },
  geoInsights: {
    css: `.geo-panel { min-width:0; }
.geo-layout { display:grid; grid-template-columns:minmax(0,1.4fr) minmax(200px,.8fr); gap:10px; min-height:220px; }
.geo-canvas { position:relative; min-height:220px; overflow:hidden; border:1px solid var(--line); border-radius:6px; background:var(--rail-bg); }
.geo-svg { display:block; width:100%; height:100%; min-height:220px; }
.geo-land { fill:#1b1b1a; stroke:#303236; stroke-width:1; }
.geo-marker { fill:var(--geo-color,var(--chart-blue)); stroke:#fff; stroke-width:1.5; opacity:.88; cursor:pointer; vector-effect:non-scaling-stroke; }
.geo-marker:hover { stroke-width:2.5; opacity:1; }
.geo-rank { min-width:0; max-height:300px; overflow:auto; }
.geo-row { display:grid; grid-template-columns:minmax(0,1fr) 54px; gap:8px; padding:7px 6px; border-bottom:1px solid var(--line); color:var(--ink); font:9px var(--mono); }
.geo-row-label { overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }.geo-row-value{text-align:right;font-weight:700;font-variant-numeric:tabular-nums}
.geo-legend { display:flex; flex-wrap:wrap; gap:8px 14px; padding-top:8px; color:var(--muted); font:9px var(--mono); }
@media(max-width:650px){.geo-layout{grid-template-columns:1fr}.geo-canvas,.geo-svg{min-height:180px}.geo-rank{max-height:180px}}`,
    html: `<section class="panel geo-panel"><div class="panel-head"><h3 class="panel-title">{{GEO_TITLE}}</h3><label class="rank-filter">Color by<select data-geo-measure></select></label></div><div class="geo-layout"><div class="geo-canvas"><svg class="geo-svg" viewBox="0 0 700 360" role="img" aria-label="Location overview"><g class="geo-background"></g><g class="geo-markers"></g></svg></div><div class="geo-rank" aria-label="Location ranking"></div></div><div class="geo-legend"></div></section>`,
    usage: "Use only when the data contains usable coordinates or a trustworthy precomputed geographic geometry. Map points/regions in SVG with a measure-driven size/color encoding and keep a ranked location list beside it. If the dataset has only place names without coordinates or boundaries, omit the map and use the ranked list or location-by-category heatmap instead; do not geocode or invent map positions. Map content stays in the browser and uses no external tile service.",
  },
  scopeFilters: {
    css: `.scope-filters { display:flex; align-items:end; gap:8px; flex-wrap:wrap; padding:8px 10px; border:1px solid var(--line); border-radius:6px; background:var(--surface); }
.scope-filter { display:grid; gap:3px; color:var(--muted); font:700 8px var(--mono); letter-spacing:.07em; text-transform:uppercase; }
.scope-filter input,.scope-filter select { min-width:120px; height:30px; border:1px solid var(--line); border-radius:4px; padding:0 7px; color:var(--ink); background:var(--surface); font:10px var(--mono); }
.scope-filter-actions { display:flex; gap:5px; margin-left:auto; }
@media(max-width:520px){.scope-filter{flex:1}.scope-filter input,.scope-filter select{width:100%;min-width:0}.scope-filter-actions{margin-left:0}}`,
    html: `<form class="scope-filters" aria-label="Dataset scope filters"><label class="scope-filter">{{FILTER_LABEL}}<select data-scope-field></select></label><label class="scope-filter">From<input type="date" data-scope-from></label><label class="scope-filter">To<input type="date" data-scope-to></label><div class="scope-filter-actions"><button class="btn btn-sm" type="submit">Apply</button><button class="btn btn-sm btn-ghost" type="reset">Clear</button></div></form>`,
    usage: "Use when time-window or scope filtering is central to the analysis. Populate field options from actual date/category columns and apply the controls to the same filtered data state used by charts, KPIs, tables, and comparisons. Respect local date parsing, validate from/to order, provide a clear/reset action, and never add a filter whose field cannot be mapped.",
  },
};

export function getComponentPatterns(componentNames: string[]): Record<string, { css: string; html: string; usage: string }> {
  const allComponents: Record<string, { css: string; html: string; usage: string }> = {
    kpiCards: {
      css: DASHBOARD_SHELL_CONTRACT.componentPatterns.kpiCards,
      html: HTML_SNIPPETS.kpiCard + '\n\n/* Clickable variant: */\n' + HTML_SNIPPETS.kpiCardClickable + '\n\n/* Grid container: */\n' + HTML_SNIPPETS.kpiGrid,
      usage: "Use .kpi-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px } as the container. Each card uses .kpi with .kpi-label (9.5px mono 600 uppercase, 0.09em tracking), .kpi-value (clamp(20px,2.2vw,30px) mono 700, tabular-nums, -0.02em tracking), and .kpi-sub (10px mono muted). Add .clickable + tabindex=0 + role=button for drill-down KPIs that open drawers or overlays. Animate values with countUp(el, target, {duration:600, prefix, suffix, decimals}) from JS utilities — uses easeOutCubic. Reference: ExecutiveOverview places KPI grid in a 2-column split with .gen-output using grid-template-columns: minmax(400px,.9fr) minmax(460px,1.1fr). KPIGrid component supports a view toggle (kpi vs breakdown distribution) using a segmented control in the header — the breakdown view shows horizontal bars for State, Priority, and Top Contacts. Always include a .validation strip (3-column grid of .check.ok/.check.err cards) below the KPI row for data quality signals."
    },
    panels: {
      css: DASHBOARD_SHELL_CONTRACT.componentPatterns.panels,
      html: HTML_SNIPPETS.panel + '\n\n/* With badge: */\n' + HTML_SNIPPETS.panelWithBadge,
      usage: "Wrap each chart, table, or content section in .panel (white surface, 1px solid var(--line), 8px radius, 14px 16px padding, flex column). Use .panel-head (flex row, space-between) with .panel-title (10.5px mono 700 uppercase, 0.07em tracking, var(--muted)). Add .badge in .panel-head for counts or status. Reference patterns: ClassificationGrid uses a 3x2 grid of panels with horizontal bars inside; GroupScorecards uses side-by-side panels (1.2fr 1fr grid) for volume vs backlog bars; SlaAging uses 2 equal columns + full-width bottom row. Panels can contain any combination of horizontal bars, data tables, SVG charts, or insight feeds. Box-shadow: 0 1px 3px rgba(0,0,0,.02)."
    },
    horizontalBars: {
      css: DASHBOARD_SHELL_CONTRACT.componentPatterns.horizontalBars,
      html: HTML_SNIPPETS.hbarRow + '\n\n/* Clickable variant for cross-filtering: */\n' + HTML_SNIPPETS.hbarRowClickable,
      usage: "For categorical comparisons and rankings. Grid layout: 140px label (.hbar-lbl, mono 500, ellipsis), 1fr track (.hbar-track, 8px height, var(--surface-2) bg, 3px radius), 44px value (.hbar-val, mono 600, right-aligned). Fill (.hbar-fill) transitions width over 0.4s cubic-bezier(.4,0,.2,1). Default fill: var(--chart-teal). Use progressive color coding for aging/priority bars — reference: AgingSpectrum shifts from grey→amber→red as age increases; SlaByPriority uses PRIO_SPECTRUM_COLORS (red for P1/Critical→grey for P5). CallerDistribution uses distinct palettes for locations vs channels. Add .clickable + tabindex=0 to bars for cross-filtering — clicking a bar should filter the dashboard to that category. Wrap multiple bar groups in .seg-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:12px } for side-by-side segment comparison panels. IntakeRadar renders a 24-column vertical histogram for hourly volume alongside day-of-week horizontal bars — both color-coded by density with red for peak."
    },
    dataTables: {
      css: DASHBOARD_SHELL_CONTRACT.componentPatterns.dataTables,
      html: HTML_SNIPPETS.dataTable,
      usage: "Use .data-table inside a scrollable container (overflow:auto, max-height bounded). Mandatory: table-layout:fixed, border-collapse:collapse, font-family:var(--mono), 11px body. Sticky thead: position:sticky; top:0; z-index:5; background:var(--surface-2). Headers: 8.5px uppercase mono 700, 0.07em tracking, var(--muted), text-align:left, 7px 10px padding. Body cells: 7px 10px padding, 1px var(--surface-2) bottom border, ellipsis overflow. Clickable rows: .clickable class, cursor:pointer, hover bg rgba(24,28,36,0.04). Reference: IncidentExplorer wraps table in a panel with search input + 'Export CSV' button in .panel-head, supports sorting (click headers for directional arrows), and pagination (page pills, rows-per-page dropdown, jump-to input). FrequentCallers uses .badge-pill.warn for count highlights. StaleBacklog uses color-coded .badge for aging (red >7d, amber >2d, green otherwise). ExplorerTable truncates long descriptions and shows template badges below. Always make rows clickable to open a slide drawer with record details."
    },
    validation: {
      css: DASHBOARD_SHELL_CONTRACT.componentPatterns.validation,
      html: HTML_SNIPPETS.validationCheck,
      usage: "Data quality and compliance checks strip. Place .validation below KPI grid — margin-top:4px, border-top:1px solid var(--line), padding-top:8px. 3-column grid (repeat(3,minmax(0,1fr)), gap 8px). Each .check: 1px solid var(--line) border, var(--surface-2) bg, 5px radius, 7px 9px padding. Label: 8.5px mono 600 uppercase, var(--muted). Value: 11px mono, var(--ink). Status: .check.ok = green border+bg (rgba(26,122,86,.3) / var(--ok-dim)), strong in var(--ok). .check.err = red border+bg (rgba(192,57,43,.25) / var(--err-dim)), strong in var(--err). Reference: ValidationChecks from SLA-Pulse checks Upload status, Column integrity, Date ranges. Also used as: AlertsBanner (dismissible operational alerts with .alert-red/.alert-amber color classes, lightning bolt icon, collapsible header). HealthBar uses .health-bar-track + .health-bar-fill as progress gauge with colored dot breakdown for sub-metrics (GOS, Abandon, AHT, Hold). ServiceLevel uses .bucket-grid of .bucket-card items for wait time intervals + .sensitivity-grid of .sens-card for threshold analysis."
    },
    badges: {
      css: DASHBOARD_SHELL_CONTRACT.componentPatterns.badges,
      html: HTML_SNIPPETS.badge,
      usage: "Status indicators and categorical labels. Base: .badge (var(--surface-2) bg, var(--muted) text, 1px solid var(--line), 600 weight, 3px radius, 3px 8px padding, 10px mono). Variants: .badge.ok (green — var(--ok-dim) bg, var(--ok) text, rgba(26,122,86,.25) border), .badge.warn (amber — var(--warn-dim) bg, var(--warn) text, rgba(180,83,9,.25) border), .badge.err (red — var(--err-dim) bg, var(--err) text, rgba(192,57,43,.25) border). Use in .panel-head for counts, in table cells for status (SLA compliance, priority, aging), and in .gen-output header for 'auto' tag. Reference: AgentsTab uses .pill.ok/.pill.warn for agent SLA status. StaleBacklog uses color-coded aging badges (red >7d, amber >2d, green). FrequentCallers uses .badge-pill.warn for incident count highlights. KpiStrip uses tone variants ('default', 'alert', 'accent') that alter text+bg colors. DayComparator uses .improved (green), .declined (red), .neutral (grey) classes for delta comparison badges with directional arrows."
    },
    buttons: {
      css: DASHBOARD_SHELL_CONTRACT.componentPatterns.buttons,
      html: '<button class="btn">Primary</button>\n<button class="btn info">Info Action</button>\n<button class="btn secondary">Secondary</button>\n<button class="btn ghost">Ghost</button>',
      usage: "Action buttons in 4 variants. .btn: primary dark fill (var(--accent) bg, #fff text, 36px height, 12px mono 600, 4px radius, inline-flex center). .btn.info: ink fill (var(--ink) bg, #fff text). .btn.secondary: outlined (white bg, var(--ink) text, 1px solid var(--line-strong), hover var(--surface-2)). .btn.ghost: minimal (no background, var(--muted) text). Hover: opacity .88, active: scale(.98). Smaller variant for .output-actions: height 32px, 11px font, 0 14px padding, flex:1 0 auto. Reference: ActionBar provides Copy, Insights, Improve, Download buttons — adapt to domain. Export CSV button pattern: .btn.secondary in .panel-head. Download buttons (.lb-dl-btn) for agent/group reports. ImprovementLab uses scenario comparison cards with button triggers. Always pair dangerous actions with secondary variant."
    },
    generatedOutput: {
      css: DASHBOARD_SHELL_CONTRACT.componentPatterns.generatedOutput,
      html: HTML_SNIPPETS.genOutput,
      usage: "For AI-generated text narrative panels (Executive briefings, operational updates). Place beside KPI summary in .workspace / .overview-split { display:grid; grid-template-columns:minmax(400px,.9fr) minmax(460px,1.1fr); gap:12px; height:100%; min-height:0; overflow:hidden; }. Structure: .message-panel / .gen-output is a grid (grid-template-rows: auto minmax(0,1fr) auto auto; gap:8px; height:100%; min-height:0;) containing: 1. .panel-head with .panel-title and .badge 'Output', 2. textarea.summary-textarea (width:100%; height:100%; min-height:0; flex:1; resize:none; overflow-y:auto; 11.5px/1.55 mono), 3. collapsible .rules / .calc-toggle (<details> with <summary>Calculation rules</summary> and formula bullets), 4. .actions / .output-actions grid of 4 buttons (repeat(4, minmax(0, 1fr))): 'Copy msg' (.btn), 'Insights' (.btn.info — opens Analytics/Insights overlay), '.txt' (.btn.secondary — downloads text file), and 'Analyze data ✦' (.btn.secondary — opens Analysis Studio pivot workbench for ad-hoc data exploration). Because textarea flexes with minmax(0,1fr), both left KPI panel and right Generated Output panel are the exact same height and fit within 100% of the screen without vertical scrollbars! Use typeText(el, text, callback) from JS utilities for human typing cadence into textarea."
    },
    multiSelectFilter: {
      css: DASHBOARD_SHELL_CONTRACT.componentPatterns.multiSelectFilter,
      html: HTML_SNIPPETS.filterButton,
      usage: "Scope filter dropdowns for categorical dimensions. .scope-bar-btn: 25px height, 0 8px padding, 4px radius, #F8FAFC bg, 1px solid rgba(0,0,0,.08) border, 9.5px mono 600, var(--muted) text. Pseudo ::after adds ▾ chevron. Active state (.active): var(--ink) bg, #fff text, var(--ink) border — applied when not all options are selected. Open state (.open): var(--accent) border with 2px accent-dim ring. Button label shows 'All {column}' when all selected, '{N} {column}' when filtered. Opens .filter-drop: absolute positioned below button (top:calc(100%+4px)), 200px min-width, 280px max-height, 6px radius, shadow. Contains .filter-drop-head (8.5px mono uppercase title + All/Clear buttons) and .filter-drop-body (scrollable checkbox list). Each .filter-opt: flex row with 14px checkbox, label text, and right-aligned .cnt count. Selecting/deselecting immediately updates dashboard. Use buildFilterButton(columnName, container) from JS utilities — handles all DOM creation and state management. Reference: ScopeFilterBar in reference dashboards provides Date Range, State, Priority, Location, Category filters. Close dropdown on outside click or Escape."
    },
    heatmap: {
      css: DASHBOARD_SHELL_CONTRACT.componentPatterns.heatmap,
      html: '<div class="heatmap-grid" id="{{HEATMAP_ID}}"><!-- Build grid cells with .hm-cell, color via volumeRamp function --></div>',
      usage: "For date×hour density, 2D intersection analysis, or cross-tabulation matrices. Grid: 54px label column + repeat(N, minmax(0,1fr)), gap 2px. Cells (.hm-cell): 22px height, 8.5px mono, 2px radius. Data cells (.hm-data): cursor pointer, hover scale(1.18) with 1.5px solid var(--ink) outline, z-index 2. Peak cell: .hm-peak with distinct outline. Color ramp function: map value 0→max to rgba(255,255,255,0.04) → #1e3a8a → #2563eb → #38bdf8 → #bae6fd. Text color flips to white on dark cells for contrast. Reference: StoresHeatmapMatrix uses stores (rows) × top issues (columns) with sticky headers and sticky first column for store names, alpha transparency based on cell value / matrix max. ReassignmentLoops uses a bounce-matrix-table for group-to-group transfer volumes with yellow→red color intensity. IntakeRadar can use heatmap for hour×day density. Always add row/column headers with the 8.5px mono uppercase style."
    },
    overlays: {
      css: DASHBOARD_SHELL_CONTRACT.componentPatterns.overlays,
      html: '<section class="analytics-overlay" id="{{OVERLAY_ID}}">\n  <div class="analytics-topbar">\n    <span style="font-family:var(--mono);font-size:10px;font-weight:700;letter-spacing:.07em;text-transform:uppercase;color:var(--muted)">{{OVERLAY_TITLE}}</span>\n    <button class="btn secondary" id="{{CLOSE_BTN}}">✕ Exit</button>\n  </div>\n  <div class="analytics-body" id="{{BODY_ID}}"><!-- overlay content --></div>\n</section>',
      usage: "Full-screen deep-dive overlays using clip-path wipe animation. Position: fixed, left calc(268px+24px), right/top/bottom 12px — sits over main content only, sidebar stays visible. Uses dark scoped tokens: --surface:#1e232b, --surface-2:#252a33, --ink:#f0f0f0, --muted:#9aa3af, background:var(--rail-bg). Open: clip-path inset(0 0 0 0 round 8px) with 0.62s cubic-bezier(0.16,1,0.3,1). Close: clip-path inset(0 100% 0 0 round 8px). Structure: .analytics-topbar (flex row with title + exit button) → .analytics-body (grid with sub-views). Reference: LocationOverlay orchestrates mosaic/map/issue/mapping sub-views with a KPI strip of metric cards, 2-column insight-panel layout, and full-screen expanded map mode (dark palette #111111, #151515). CategoriesRCA toggles between ClassificationGrid and SankeyFlow with segmented controls and preset dropdowns. AnalysisWorkbench builds pivot tables with row/column shelves and metric selectors. Use the dedicated .analysis-studio-overlay (openAnalysisStudio/closeAnalysisStudio) for the pivot workbench — it shares the same dark clip-path wipe animation but runs independently from the analytics overlay. Content inside overlays uses overflow-y:auto for scrolling. Always include dark scrollbar tokens."
    },
    drawers: {
      css: DASHBOARD_SHELL_CONTRACT.componentPatterns.drawers,
      html: HTML_SNIPPETS.drawer,
      usage: "Right slide-over for drill-down record details, date breakdowns, or agent/group analysis. Sizing: width min(520px, 92vw), full viewport height. Animation: translate3d from calc(100%+50px) to 0 over 0.24s cubic-bezier(0.16,1,0.3,1). Backdrop: fixed inset, rgba(15,23,42,0.45) with backdrop-filter blur(2px), 0.2s opacity transition. Structure: header row (16px padding, flex between title h2 14px 700 + '✕ Close' button), then scrollable body (16px padding, overflow-y auto). Focus: trap focus in drawer, restore to opener on close, Escape key closes. Use openDrawer(title, htmlContent) and closeDrawer() from JS utilities. Reference patterns: Table row click opens record detail drawer showing all field values. Chart click opens date drilldown drawer listing incidents for that period. KPI click opens segment breakdown drawer. Bar click opens filtered list. Always provide a clear close mechanism (button + backdrop click + Escape)."
    },
    header: {
      css: DASHBOARD_SHELL_CONTRACT.componentPatterns.header,
      html: HTML_SNIPPETS.uploadBox,
      usage: "Already included in wireframe. Only request this if you need the raw CSS for customization."
    },
    navTabs: {
      css: DASHBOARD_SHELL_CONTRACT.componentPatterns.navTabs,
      html: HTML_SNIPPETS.navTab + '\n\n/* Active variant: */\n' + HTML_SNIPPETS.navTabActive,
      usage: "Already included in wireframe. Segmented track tabs. 28px height, 10.5px mono. Active = white with shadow lift. ARIA: role=tablist/tab, aria-selected."
    },
    chartContainer: {
      css: `.chart-container { min-height: 200px; }\n.chart-container svg { width: 100%; height: 100%; }`,
      html: HTML_SNIPPETS.chartSvgContainer,
      usage: "Wrapper for pure procedural SVG charts inside .panel. Set min-height per chart type (200px minimum). SVG: viewBox='0 0 W H', preserveAspectRatio='xMidYMid meet', width/height 100%. Use --chart-* CSS variables for all colors. Reference chart patterns from Component_Designs: VolumeChart renders SVG area chart with linearGradient fill (opacity 0.14→0.00), interactive hover circles (r=6), and 'Peak' label on max point. MTTRTrend supports daily/cumulative toggle and line/bar modes — line mode uses area chart with gradient fill, bar mode uses rectangles, both with interactive tooltips. VelocityChart renders dual SVG paths (red=Logged, dark=Resolved) with summary footer showing Inflow, Outflow, Net Delta (color-coded), Burn-down ratio. SankeyFlow uses SVG rectangles for nodes and cubic bezier paths for links with linearGradient blending start/end node colors. All SVG charts must use vector-effect:non-scaling-stroke for crisp rendering at any scale. Responsive: use ResizeObserver or containerWidth state to redraw on resize. Interactive: hover circles/bars trigger floating HTML tooltips, clickable elements open detail drawers."
    },
    sectionLayouts: {
      css: SECTION_LAYOUT_CSS,
      html: HTML_SNIPPETS.overviewSplit + '\n\n' + HTML_SNIPPETS.segGrid + '\n\n' + HTML_SNIPPETS.kpiGrid,
      usage: "1-Screen Viewport Fitting & Grid Layouts. Crucial: Tab 1 (Executive Overview) must NEVER scroll vertically on desktop. Set .workspace / .overview-split to { height:100%; min-height:0; display:grid; grid-template-columns:minmax(400px,.9fr) minmax(460px,1.1fr); gap:12px; overflow:hidden; }. Inside Tab 1: left panel is .kpi-panel { display:grid; grid-template-rows:auto minmax(0,1fr) auto; gap:8px; height:100%; min-height:0; } containing .kpis (2-column x 3-row grid: repeat(2,minmax(0,1fr)) / repeat(3,minmax(0,1fr))) and .validation check strip. Right panel is .message-panel { display:grid; grid-template-rows:auto minmax(0,1fr) auto auto; gap:8px; height:100%; min-height:0; } containing textarea.summary-textarea, .rules, and 4-button .actions grid. Both sides match 100% height and fit the viewport perfectly. Other layouts: .seg-grid (auto-fit for segment comparison panels), .chart-container (min-height:200px SVG wrapper), .tab-content-area / .dashboard-body { height:100%; min-height:0; overflow-y:auto; }."
    },
    accessibility: {
      css: DASHBOARD_SHELL_CONTRACT.componentPatterns.accessibility,
      html: '<!-- Focus styles are applied automatically. Use role, aria-label, aria-selected, tabindex attributes. -->',
      usage: "Focus ring: --focus-ring:#38BDF8, 2px solid, 1px offset. Applied on :focus-visible to .kpi.clickable, .btn, tr.clickable, .nav-tab, .hbar-row.clickable, .scope-bar-btn. Reduced motion: @media (prefers-reduced-motion:reduce) forces all animation/transition durations to 0.01ms. Semantic roles: tablist/tab with aria-selected for nav, role=button + tabindex=0 for clickable KPI/bar elements, role=dialog for overlays/drawers. Keyboard: Escape closes drawers/overlays/dropdowns, Enter/Space activates buttons/clickable elements. Reference: ShortcutOverlay displays kbd keys with border+background styling resembling physical keys, full-screen blurred backdrop. FlowNetwork supports keyboard zoom/pan controls. AgentDrawer/IncidentDrawer trap focus when open. StoreRankList implements roving tabindex for list navigation. FilterStrip multi-select dropdowns support keyboard navigation with highlighted index. Always test tab order flows through the page logically."
    },
    healthBar: {
      css: DASHBOARD_SHELL_CONTRACT.componentPatterns.healthBar,
      html: HTML_SNIPPETS.healthBar,
      usage: "Operational Health Score gauge. Place inside .kpi-panel between the KPI card grid and the .validation check strip. Displays overall health score (e.g. 84/100), animated meter bar (.health-bar-fill), and dot breakdown tags for key dimensions (SLA Target ≥80%, Attrition/Drops ≤5%, Turnaround). Dynamically update with setHealthScore(score, breakdown) or data binding."
    },
    dayDrawer: {
      css: DASHBOARD_SHELL_CONTRACT.componentPatterns.dayDrawer,
      html: HTML_SNIPPETS.dayDrawer,
      usage: "Intraday deep-dive slide drawer (min(720px, 50vw)) modeled after SLA-Pulse. Triggered by clicking any date row in a daily table or date bar in a trend chart. Structure: 1. Header with '← Back to Daily List' (.drawer-back) + 4-7 KPI metrics (.drawer-kpis) + CSV export. 2. Root Cause Breakdown card (.rc-card) with dual-color meter track (.rc-meter-track) and operational takeaway callout. 3. Running metric progression SVG chart (.cum-gos-wrap) with threshold guidelines (80% / 60%), hover dots with floating tooltip (#chartTooltip), and ▼ drop badges. 4. 24-Hour column bar chart (.hourly-gos-chart) where clicking any hourly column opens the interactive Hour Detail panel (.hour-detail.open) displaying that hour's statistics and human narrative explanation."
    },
    dayComparator: {
      css: DASHBOARD_SHELL_CONTRACT.componentPatterns.dayComparator,
      html: HTML_SNIPPETS.dayComparator,
      usage: "Side-by-side day-over-day comparator panel. Provides two <select> dropdowns (Base Day A and Comparison Day B) and computes delta indicators (.comp-delta.improved / .declined / .neutral) with percentage changes across volume, compliance, and resolution turnaround."
    },
    chartTooltip: {
      css: DASHBOARD_SHELL_CONTRACT.componentPatterns.chartTooltip,
      html: '<div id="chartTooltip"></div>',
      usage: "Dark floating tooltip container with backdrop blur for procedural SVG charts, hourly bars, and heatmap matrices. Track mousemove over dots/bars and position at (e.clientX + 12, e.clientY - 10). Automatically hides on mouseleave."
    },
    analysisStudio: {
      css: DASHBOARD_SHELL_CONTRACT.componentPatterns.overlays + `\n/* ── Analysis Studio: dark dedicated pivot workspace ── */\n.analysis-studio-overlay { position:fixed; left:calc(268px + 24px); right:12px; top:12px; bottom:12px; z-index:106; padding:12px; display:grid; grid-template-rows:auto minmax(0,1fr); gap:12px; overflow:hidden; background:var(--rail-bg); border:1px solid var(--rail-border); border-radius:8px; opacity:0; pointer-events:none; clip-path:inset(0 100% 0 0 round 8px); transition:opacity .18s ease, clip-path .62s cubic-bezier(.16,1,.3,1); }\n.analysis-studio-overlay.open { opacity:1; pointer-events:all; clip-path:inset(0 0 0 0 round 8px); }\n.analysis-studio-overlay .analytics-topbar { background:transparent; border-color:rgba(255,255,255,.22); }\n.analysis-studio-overlay .analytics-topbar > div { min-width:0; flex:1; } .analysis-studio-overlay .analytics-topbar p { margin:0 0 3px; color:#8D96A3; font:700 8.5px var(--mono); letter-spacing:.09em; } .analysis-studio-overlay .analytics-topbar h2 { color:#fff; }\n.analysis-studio-body { min-height:0; overflow:auto; padding:14px; border:1px solid rgba(255,255,255,.22); border-radius:8px; }\n.analysis-studio-body .analysis-workbench { display:flex; flex-direction:column; gap:10px; min-height:100%; }\n.analysis-studio-overlay .panel { background:rgba(255,255,255,.03); border-color:rgba(255,255,255,.1); box-shadow:0 1px 2px rgba(0,0,0,.15); }\n.analysis-studio-overlay .analysis-header { display:flex; justify-content:space-between; align-items:center; gap:16px; flex-wrap:wrap; }\n.analysis-studio-overlay .analysis-kicker, .analysis-studio-overlay .builder-heading > span, .analysis-studio-overlay .analysis-header > div > span, .analysis-studio-overlay .analysis-footnote { color:#6B7280; }\n.analysis-studio-overlay .analysis-header h2, .analysis-studio-overlay .builder-heading h3, .analysis-studio-overlay .analysis-result-head h3 { color:#E8EAED; }\n.analysis-studio-overlay .analysis-scope { border:1px solid rgba(255,255,255,.15); background:rgba(255,255,255,.05); padding:5px 12px; border-radius:999px; display:flex; align-items:center; gap:6px; } .analysis-studio-overlay .analysis-scope b { color:#fff; font-size:11px; font-weight:700; } .analysis-studio-overlay .analysis-scope span { color:#8D96A3; font-size:10px; font-weight:600; text-transform:uppercase; }\n.analysis-studio-overlay .studio-tabs { display:flex; gap:4px; background:rgba(0,0,0,.22); border:1px solid rgba(255,255,255,.08); border-radius:6px; padding:3px; } .analysis-studio-overlay .studio-tabs button { border:0; background:transparent; color:#6B7280; font:600 10px var(--mono); padding:5px 12px; border-radius:5px; cursor:pointer; } .analysis-studio-overlay .studio-tabs button.active { background:rgba(255,255,255,.95); color:#151515; font-weight:700; }\n.analysis-studio-overlay .builder-shelves-wrap { display:flex; flex-direction:column; gap:8px; }\n.analysis-studio-overlay .field-shelves { display:grid; gap:8px; } .analysis-studio-overlay .shelf-primary { grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); }\n.analysis-studio-overlay .field-shelves label { min-width:0; display:flex; flex-direction:column; border:1px solid rgba(255,255,255,.12); background:rgba(0,0,0,.22); padding:5px 8px; border-radius:6px; transition:border-color .15s ease; } .analysis-studio-overlay .field-shelves label:hover { border-color:rgba(255,255,255,.24); }\n.analysis-studio-overlay .field-shelves label > span { display:block; margin-bottom:2px; color:#8D96A3; font:700 8px var(--mono); letter-spacing:.08em; text-transform:uppercase; }\n.analysis-studio-overlay .field-shelves select, .analysis-studio-overlay .field-shelves input { width:100%; color:#E5E7EB; background:transparent; border:0; outline:0; height:20px; font:600 10.5px var(--mono); padding:0; color-scheme:dark; } .analysis-studio-overlay .field-shelves select option { color:#181C24; background:#fff; }\n.analysis-studio-overlay .metric-chip-row { display:flex; flex-wrap:wrap; align-items:center; gap:6px; margin-top:10px; padding-top:10px; border-top:1px solid rgba(255,255,255,.06); } .analysis-studio-overlay .metric-chip-label { color:#6B7280; font:700 8px var(--mono); letter-spacing:.1em; margin-right:4px; }\n.analysis-studio-overlay .metric-chip { border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.025); color:#6B7280; font:600 9.5px var(--mono); padding:4px 10px; border-radius:999px; cursor:pointer; transition:all .15s ease; } .analysis-studio-overlay .metric-chip:hover { border-color:rgba(255,255,255,.22); color:#9CA3AF; } .analysis-studio-overlay .metric-chip.active { color:#151515; border-color:transparent; font-weight:700; background:#9CA3AF; }\n.analysis-studio-overlay .analysis-result-head { display:flex; justify-content:space-between; align-items:center; gap:12px; border-bottom:1px solid rgba(255,255,255,.08); } .analysis-studio-overlay .analysis-result-head > div:last-child { display:flex; align-items:center; gap:8px; }\n.analysis-studio-overlay .analysis-export, .analysis-studio-overlay .analysis-sort { border:1px solid rgba(255,255,255,.1); color:#9CA3AF; background:rgba(255,255,255,.035); font:600 9.5px var(--mono); padding:4px 10px; border-radius:5px; cursor:pointer; } .analysis-studio-overlay .analysis-export:hover, .analysis-studio-overlay .analysis-sort:hover { color:#E8EAED; border-color:rgba(255,255,255,.2); }\n.analysis-studio-overlay .pivot-wrap { border-top:0; background:#111111; border-radius:4px; overflow:auto; }\n.analysis-studio-overlay .pivot-table { width:100%; border-collapse:collapse; font-family:var(--mono); color:#D1D5DB; }\n.analysis-studio-overlay .pivot-table th, .analysis-studio-overlay .pivot-table td { border-color:rgba(255,255,255,.06); border-right:1px solid rgba(255,255,255,.06); border-bottom:1px solid rgba(255,255,255,.06); padding:8px 12px; text-align:right; font-size:11px; }\n.analysis-studio-overlay .pivot-table thead th { background:#111111; color:#8D96A3; font-size:8.5px; letter-spacing:.08em; text-transform:uppercase; border-bottom:1px solid rgba(255,255,255,.1); text-align:left; }\n.analysis-studio-overlay .pivot-table th:first-child { background:#151515; color:#E5E7EB; text-align:left; border-right:1px solid rgba(255,255,255,.08); }\n.analysis-studio-overlay .pivot-table thead th:first-child { background:#111111; color:#8D96A3; }\n.analysis-studio-overlay .pivot-table tbody tr { background:#151515; transition:background .12s ease; } .analysis-studio-overlay .pivot-table tbody tr:hover td { background:rgba(255,255,255,.04); }\n.analysis-studio-overlay .pivot-table tbody th button { color:#F3F4F6; font-size:11px; font-weight:600; text-align:left; background:transparent; border:none; cursor:pointer; padding:0; } .analysis-studio-overlay .pivot-table tbody th button:hover { color:#60A5FA; text-decoration:underline; }\n.analysis-studio-overlay .pivot-table td button { display:block; width:100%; height:100%; padding:8px 12px; text-align:right; background:transparent; border:none; color:#E5E7EB; font-weight:600; cursor:pointer; font-family:var(--mono); } .analysis-studio-overlay .pivot-table td button:hover { color:#FFFFFF; background:rgba(255,255,255,.05); }\n.analysis-studio-overlay .pivot-table th small { color:#6B7280; font-size:8.5px; display:block; margin-top:2px; }\n.analysis-studio-overlay .pivot-cell-metric { padding:0; } .analysis-studio-overlay .pivot-cell-metric button { position:relative; width:100%; min-height:38px; display:flex; align-items:center; justify-content:flex-end; padding:0 12px; border:0; background:transparent; cursor:pointer; overflow:hidden; }\n.analysis-studio-overlay .pivot-bar { position:absolute; left:0; top:0; bottom:0; opacity:.2; border-radius:0 2px 2px 0; transition:width .3s cubic-bezier(.16,1,.3,1); } .analysis-studio-overlay .pivot-bar.accent-neutral { background:#64748B; } .analysis-studio-overlay .pivot-bar.accent-positive { background:#10B981; } .analysis-studio-overlay .pivot-bar.accent-warning { background:#F59E0B; } .analysis-studio-overlay .pivot-bar.accent-critical { background:#EF4444; }\n.analysis-studio-overlay .pivot-value { position:relative; z-index:1; color:#E5E7EB; font-weight:600; font-variant-numeric:tabular-nums; }\n.analysis-studio-overlay .analysis-footnote { border-top:1px solid rgba(255,255,255,.06); background:#111111; color:#6B7280; padding:8px 12px; font-size:11px; }\n.analysis-studio-overlay .analysis-empty { color:#6B7280; padding:20px; text-align:center; }\n@media (max-width: 700px) { .analysis-studio-overlay { left:12px; } }`,
      html: HTML_SNIPPETS.analysisStudioOverlay,
      usage: "Full-screen Analysis Studio overlay for ad-hoc pivot table exploration. Opened by the 'Analyze data ✦' button in the Generated Output panel. Uses the same dark clip-path wipe animation as the analytics overlay but provides a dedicated interactive workbench. The AI should implement openAnalysisStudio() and closeAnalysisStudio() in its JS, dynamically populating the shelf selects from S.columns (auto-detecting categorical vs numeric fields). Row/Column shelves accept any categorical dimension. The metric chip row shows toggleable measures (Count plus any numeric columns with sum/average). The pivot table renders in-cell distribution bars (.pivot-bar with accent classes) for visual scanning. Every cell and row header is a clickable button that opens the detail drawer with the matching subset of records. Export CSV button downloads the current pivot view. The workbench respects all active global filters from S.filtered. This component is domain-agnostic — it works with any uploaded dataset."
    },
  };

  Object.assign(allComponents, EXTENDED_COMPONENT_PATTERNS);

  // Keep the npm/MCP pivot surface aligned with the Incident Pulse workbench.
  // The stronger table selectors prevent generic light-table rules from leaking
  // into this intentionally dark Analysis Studio surface.
  allComponents.analysisStudio.css += `
/* Incident Pulse Analysis Studio table surface */
.analysis-studio-overlay .pivot-table th, .analysis-studio-overlay .pivot-table td { border-color:rgba(255,255,255,.06) !important; border-right:1px solid rgba(255,255,255,.06) !important; border-bottom:1px solid rgba(255,255,255,.06) !important; }
.analysis-studio-overlay .pivot-table thead th { background:#111 !important; color:#8D96A3 !important; border-bottom:1px solid rgba(255,255,255,.1) !important; }
.analysis-studio-overlay .pivot-table th:first-child { background:#151515 !important; color:#E5E7EB !important; border-right:1px solid rgba(255,255,255,.08) !important; }
.analysis-studio-overlay .pivot-table thead th:first-child { background:#111 !important; color:#8D96A3 !important; }
.analysis-studio-overlay .pivot-table tbody tr { background:#151515; }
.analysis-studio-overlay .pivot-table tbody tr:hover td { background:rgba(255,255,255,.04) !important; }
.analysis-studio-overlay .pivot-table tbody tr:hover th:first-child { background:#212121 !important; }
.analysis-studio-overlay .pivot-table td { background:#1a1a1a; padding:0; }
.analysis-studio-overlay .pivot-table .pivot-total, .analysis-studio-overlay .pivot-table tfoot td, .analysis-studio-overlay .pivot-table tfoot th { background:#151515 !important; color:#F3F4F6 !important; font-weight:700; border-top:1px solid rgba(255,255,255,.12) !important; }
.analysis-studio-overlay .pivot-table-multi th[title] { cursor:pointer; user-select:none; }
.analysis-studio-overlay .pivot-table-multi th.active-sort { color:#fff !important; }
.analysis-studio-overlay .pivot-table-multi th.active-sort::after { content:' ▾'; }
`;

  const result: Record<string, { css: string; html: string; usage: string }> = {};
  for (const name of componentNames) {
    if (allComponents[name]) {
      result[name] = allComponents[name];
    }
  }
  return result;
}

export function getAvailableComponents(): string[] {
  return [
    'kpiCards', 'healthBar', 'panels', 'horizontalBars', 'dataTables', 'validation',
    'badges', 'buttons', 'generatedOutput', 'multiSelectFilter', 'heatmap',
    'overlays', 'analysisStudio', 'drawers', 'dayDrawer', 'dayComparator', 'header', 'navTabs',
    'chartContainer', 'chartTooltip', 'sectionLayouts', 'accessibility',
    'trendCharts', 'flowDiagram', 'periodComparison', 'scenarioLab', 'insightFeed',
    'leaderboard', 'geoInsights', 'scopeFilters'
  ];
}

export function getDashboardShellContract(): string {
  return JSON.stringify(DASHBOARD_SHELL_CONTRACT, null, 2);
}

export type CreditConfig = 'default' | 'none' | { text: string; url?: string };

export const DEFAULT_CREDIT_MARKUP = `<section class="credit">built by <b><a href="https://linkedin.com/in/tanmay-kalbande" target="_blank" rel="noopener noreferrer" class="credit-link" title="Connect on LinkedIn" aria-label="Tanmay Kalbande"><span class="name-letter">T</span><span class="name-letter">a</span><span class="name-letter">n</span><span class="name-letter">m</span><span class="name-letter">a</span><span class="name-letter">y</span><span class="name-space">&nbsp;</span><span class="name-letter">K</span><span class="name-letter">a</span><span class="name-letter">l</span><span class="name-letter">b</span><span class="name-letter">a</span><span class="name-letter">n</span><span class="name-letter">d</span><span class="name-letter">e</span></a></b></section>`;

export function renderCreditMarkup(credit?: CreditConfig): string {
  if (credit === 'none') {
    return '';
  }
  if (typeof credit === 'object' && credit !== null && credit.text) {
    const escText = credit.text.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m] || m));
    if (credit.url) {
      const escUrl = credit.url.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m] || m));
      return `<section class="credit"><a href="${escUrl}" target="_blank" rel="noopener noreferrer" class="credit-link"><b>${escText}</b></a></section>`;
    }
    return `<section class="credit"><b>${escText}</b></section>`;
  }
  return DEFAULT_CREDIT_MARKUP;
}


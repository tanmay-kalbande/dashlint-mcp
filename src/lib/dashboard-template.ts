/**
 * Dashboard wireframe template and JS utilities for DashLint MCP.
 * 
 * Architecture: The tool system splits into 3 focused responses:
 * 1. Wireframe (this file) — fixed shell: tokens + frame + sidebar + header + empty main
 * 2. Component patterns (shell-contract.ts) — AI picks only what it needs
 * 3. JS utilities (this file) — parser, animations, filters, drawer, upload
 */

export const SECTION_TEMPLATES = {
  kpiGrid: {
    description: "A 3-column responsive grid of KPI metric cards with animated count-up values and contextual subtitles.",
    html: `          <div class="kpi-grid" id="kpiGrid">
            <!-- {{KPI_CARDS}} - Generate KPI card divs -->
            <!--
            <div class="kpi">
              <span class="kpi-label">METRIC NAME</span>
              <span class="kpi-value" id="kpi-xxx">—</span>
              <span class="kpi-sub">context line</span>
            </div>
            -->
          </div>`,
    css: `.kpi-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
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
  },
  overviewSplit: {
    description: "The canonical Incident/SLA balanced workspace: 2x3 KPI grid + validation checks on the left, fixed-height Generated Output textarea with 4 overlay action buttons on the right. Fits 100% of screen height without vertical scrolling.",
    html: `        <div class="workspace overview-split">
          <div class="panel kpi-panel" id="execLeftPanel">
            <div class="panel-head">
              <div style="display:flex;align-items:center;gap:8px;">
                <h2 class="panel-title">KPI SUMMARY</h2>
                <span class="badge" id="kpiCountBadge">Waiting</span>
              </div>
            </div>
            <div class="kpis" id="execKpis">
              <!-- 6 KPI cards in 2x3 grid -->
            </div>
            <div class="validation" id="execValidation">
              <!-- 3 Validation checks -->
            </div>
          </div>
          <div class="panel message-panel gen-output" id="execRightPanel">
            <div class="panel-head">
              <h2 class="panel-title">GENERATED OUTPUT</h2>
              <span class="badge" id="outputBadge">Output</span>
            </div>
            <textarea id="message" class="summary-textarea" readonly>Upload dataset to generate the operational update.</textarea>
            <details class="rules calc-toggle">
              <summary>Calculation rules</summary>
              <div class="rules-body" id="rulesBody">
                <span>• SLA compliance = completed within target / total eligible.</span>
                <span>• MTTR = average duration for completed items.</span>
                <span>• Stale backlog = active items older than threshold.</span>
              </div>
            </details>
            <div class="actions output-actions">
              <button class="btn" id="copyBtn">Copy msg</button>
              <button class="btn info" id="insightsBtn">Insights</button>
              <button class="btn secondary" id="downloadBtn">.txt</button>
              <button class="btn ghost" id="overlayBtn">Deep Dive</button>
            </div>
          </div>
        </div>`,
    css: `.workspace, .overview-split { min-height: 0; height: 100%; flex: 1; display: grid; grid-template-columns: minmax(400px, .9fr) minmax(460px, 1.1fr); gap: 12px; overflow: hidden; }
.kpi-panel { display: grid; grid-template-rows: auto minmax(0, 1fr) auto; gap: 8px; height: 100%; min-height: 0; overflow: hidden; }
.kpis { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(3, minmax(0, 1fr)); gap: 8px; min-height: 0; flex: 1; overflow: hidden; }
.message-panel, .gen-output { display: grid; grid-template-rows: auto minmax(0, 1fr) auto auto; gap: 8px; height: 100%; min-height: 0; overflow: hidden; }
.summary-textarea, textarea.summary-textarea, .output-area { width: 100%; height: 100%; min-height: 0; flex: 1; border: 1px solid var(--line); border-radius: 6px; background: var(--surface-2); color: var(--ink); padding: 12px 14px; font: 11.5px/1.55 var(--mono); resize: none; outline: none; white-space: pre-wrap; overflow-y: auto; box-sizing: border-box; }
.rules, .calc-toggle { margin-top: 4px; border: 1px solid var(--line); border-radius: 5px; background: var(--surface-2); padding: 6px 10px; color: var(--muted); font-size: 10px; font-family: var(--mono); }
.rules summary, .calc-toggle summary { cursor: pointer; color: var(--ink); font-weight: 600; list-style: none; display: flex; align-items: center; gap: 6px; }
.rules summary::before, .calc-toggle summary::before { content: '▶'; font-size: 7.5px; color: var(--accent); }
details[open] summary::before, .calc-toggle[open] summary::before { content: '▼'; }
.rules div, .calc-toggle .rules-body { margin-top: 5px; display: grid; gap: 3px; line-height: 1.4; }
.actions, .output-actions { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; align-items: center; margin-top: 4px; overflow: hidden; }
.actions .btn, .output-actions .btn { height: 36px; font-size: 11.5px; padding: 0 8px; width: 100%; }`,
  }
} as const;

export const JS_UTILITIES = `/* ═══════════════════════════════════════════════════════
   DASHLINT DASHBOARD UTILITIES
   Copy-ready JS for every generated dashboard.
   ═══════════════════════════════════════════════════════ */

// ── Global State ──
const S = {
  raw: [],           // parsed rows (array of objects)
  filtered: [],      // after filters applied
  columns: [],       // column names
  fileName: '',
  filters: {},       // { columnName: [selectedValues] }
  activeTab: 'overview',
  drawerOpen: false,
  lastOpener: null,
};

// ── CSV Parser (hand-written, ~50 lines) ──
function parseCSV(text) {
  const lines = text.split(/\\r?\\n/).filter(l => l.trim());
  if (!lines.length) return { columns: [], rows: [] };
  const sep = (lines[0].match(/\\t/g) || []).length > (lines[0].match(/,/g) || []).length ? '\\t' : ',';
  function splitRow(line) {
    const cells = []; let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') { if (inQ && line[i+1] === '"') { cur += '"'; i++; } else { inQ = !inQ; } }
      else if (c === sep && !inQ) { cells.push(cur.trim()); cur = ''; }
      else { cur += c; }
    }
    cells.push(cur.trim());
    return cells;
  }
  const columns = splitRow(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const vals = splitRow(lines[i]);
    if (vals.length < 2) continue;
    const obj = {};
    columns.forEach((col, j) => { obj[col] = vals[j] ?? ''; });
    rows.push(obj);
  }
  return { columns, rows };
}

// ── Excel Parser (SheetJS CDN) ──
function parseExcel(buffer) {
  if (typeof XLSX === 'undefined') {
    alert('Excel support requires an internet connection. Please use CSV for offline.');
    return null;
  }
  const wb = XLSX.read(buffer, { type: 'array', cellDates: true });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  const columns = rows.length ? Object.keys(rows[0]) : [];
  return { columns, rows };
}

// ── Count-Up Animation (600ms easeOutCubic) ──
function countUp(el, target, opts = {}) {
  const { duration = 600, prefix = '', suffix = '', decimals = 0 } = opts;
  const prefersRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersRM) { el.textContent = prefix + (decimals ? target.toFixed(decimals) : Math.round(target).toLocaleString()) + suffix; return; }
  const start = performance.now();
  const from = parseFloat(el.textContent.replace(/[^0-9.-]/g, '')) || 0;
  function frame(now) {
    let t = Math.min((now - start) / duration, 1);
    t = 1 - Math.pow(1 - t, 3); // easeOutCubic
    const val = from + (target - from) * t;
    el.textContent = prefix + (decimals ? val.toFixed(decimals) : Math.round(val).toLocaleString()) + suffix;
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

// ── Typewriter Effect (20-55ms per char, 180ms pause at punctuation) ──
function typeText(el, text, cb) {
  if (!el) return;
  const isTA = el.tagName === 'TEXTAREA' || el.tagName === 'INPUT';
  const prefersRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersRM) {
    if (isTA) el.value = text; else el.textContent = text;
    if (cb) cb();
    return;
  }
  let i = 0;
  if (isTA) el.value = ''; else el.textContent = '';
  function next() {
    if (i >= text.length) { if (cb) cb(); return; }
    if (isTA) {
      el.value += text[i];
      el.scrollTop = el.scrollHeight;
    } else {
      el.textContent += text[i];
    }
    const c = text[i]; i++;
    const pause = /[.!?\\n]/.test(c) ? 180 : (20 + Math.random() * 35);
    setTimeout(next, pause);
  }
  next();
}

// ── Tab Switching ──
function switchTab(tabId) {
  S.activeTab = tabId;
  document.querySelectorAll('.nav-tab').forEach(t => {
    const isActive = t.dataset.tab === tabId;
    t.classList.toggle('active', isActive);
    t.setAttribute('aria-selected', isActive);
  });
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.toggle('active', p.id === 'panel-' + tabId);
  });
}
document.getElementById('navTabs').addEventListener('click', e => {
  const tab = e.target.closest('.nav-tab');
  if (tab && tab.dataset.tab) switchTab(tab.dataset.tab);
});

// ── Filter Engine ──
function applyFilters() {
  S.filtered = S.raw.filter(row => {
    for (const [col, selected] of Object.entries(S.filters)) {
      if (selected.length && !selected.includes(String(row[col]))) return false;
    }
    return true;
  });
  renderDashboard();
}

function buildFilterButton(col, container) {
  const values = [...new Set(S.raw.map(r => String(r[col])))].sort();
  if (values.length < 2 || values.length > 50) return;
  const wrap = document.createElement('div');
  wrap.style.position = 'relative'; wrap.style.display = 'inline-block';
  const btn = document.createElement('button');
  btn.className = 'scope-bar-btn';
  btn.textContent = 'All ' + col;
  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('open');
    document.querySelectorAll('.scope-bar-btn.open').forEach(b => { if (b !== btn) b.classList.remove('open'); });
  });
  const drop = document.createElement('div');
  drop.className = 'filter-drop';
  const head = document.createElement('div');
  head.className = 'filter-drop-head';
  head.innerHTML = \`<span>\${col}</span><div><button data-a="all">All</button> <button data-a="clear">Clear</button></div>\`;
  head.addEventListener('click', e => {
    const a = e.target.dataset.a;
    if (a === 'all') { drop.querySelectorAll('input').forEach(i => i.checked = true); S.filters[col] = []; }
    if (a === 'clear') { drop.querySelectorAll('input').forEach(i => i.checked = false); S.filters[col] = ['__none__']; }
    updateBtnLabel(); applyFilters();
  });
  const body = document.createElement('div');
  body.className = 'filter-drop-body';
  values.forEach(v => {
    const opt = document.createElement('label');
    opt.className = 'filter-opt';
    const cnt = S.raw.filter(r => String(r[col]) === v).length;
    opt.innerHTML = \`<input type="checkbox" checked value="\${v}"> \${v} <span class="cnt">\${cnt}</span>\`;
    opt.querySelector('input').addEventListener('change', () => {
      const checked = [...drop.querySelectorAll('input:checked')].map(i => i.value);
      S.filters[col] = checked.length === values.length ? [] : checked;
      updateBtnLabel(); applyFilters();
    });
    body.appendChild(opt);
  });
  drop.appendChild(head); drop.appendChild(body);
  wrap.appendChild(btn); wrap.appendChild(drop);
  container.appendChild(wrap);
  function updateBtnLabel() {
    const sel = S.filters[col] || [];
    if (!sel.length || sel.length === values.length) { btn.textContent = 'All ' + col; btn.classList.remove('active'); }
    else { btn.textContent = sel.length + ' ' + col; btn.classList.add('active'); }
  }
}

// Close dropdowns on outside click
document.addEventListener('click', e => {
  if (!e.target.closest('.scope-bar-btn') && !e.target.closest('.filter-drop')) {
    document.querySelectorAll('.scope-bar-btn.open').forEach(b => b.classList.remove('open'));
  }
});

// ── Drawer ──
function openDrawer(title, html) {
  S.lastOpener = document.activeElement;
  document.getElementById('drawerTitle').textContent = title;
  document.getElementById('drawerBody').innerHTML = html;
  document.getElementById('drawerBackdrop').classList.add('open');
  document.getElementById('slideDrawer').classList.add('open');
  S.drawerOpen = true;
  document.getElementById('drawerClose').focus();
}
function closeDrawer() {
  document.getElementById('drawerBackdrop').classList.remove('open');
  document.getElementById('slideDrawer').classList.remove('open');
  S.drawerOpen = false;
  if (S.lastOpener) S.lastOpener.focus();
}
document.getElementById('drawerBackdrop').addEventListener('click', closeDrawer);
document.getElementById('drawerClose').addEventListener('click', closeDrawer);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && S.drawerOpen) closeDrawer(); });

// ── File Upload Handler ──
function handleFile(file) {
  if (!file) return;
  S.fileName = file.name;
  document.getElementById('fileName').textContent = file.name;
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'csv') {
    const reader = new FileReader();
    reader.onload = e => {
      const result = parseCSV(e.target.result);
      if (result.rows.length) loadData(result.columns, result.rows);
      else { document.getElementById('fileName').textContent = 'Error: no data rows found'; document.getElementById('fileName').classList.add('error'); }
    };
    reader.readAsText(file);
  } else if (['xlsx', 'xls'].includes(ext)) {
    const reader = new FileReader();
    reader.onload = e => {
      const result = parseExcel(new Uint8Array(e.target.result));
      if (result && result.rows.length) loadData(result.columns, result.rows);
      else if (result) { document.getElementById('fileName').textContent = 'Error: no data rows found'; }
    };
    reader.readAsArrayBuffer(file);
  } else {
    document.getElementById('fileName').textContent = 'Unsupported file type';
    document.getElementById('fileName').classList.add('error');
  }
}

function loadData(columns, rows) {
  S.columns = columns;
  S.raw = rows;
  S.filters = {};
  S.filtered = [...rows];
  document.getElementById('fileName').classList.remove('error');
  document.getElementById('emptyState').hidden = true;
  document.getElementById('tabPanels').hidden = false;
  document.getElementById('filterBar').hidden = false;
  document.getElementById('headerSub').textContent = rows.length.toLocaleString() + ' rows · ' + S.fileName;
  document.getElementById('scopeLabel').textContent = rows.length.toLocaleString() + ' records · ' + S.fileName;
  // Build filters
  const fb = document.getElementById('filterButtons');
  fb.innerHTML = '';
  // {{BUILD_FILTERS}} - Add filter columns here
  // Example: buildFilterButton('Category', fb);
  renderDashboard();
}

// ── Drag and Drop ──
const uploadBox = document.getElementById('uploadBox');
uploadBox.addEventListener('dragenter', e => { e.preventDefault(); uploadBox.classList.add('dragging'); });
uploadBox.addEventListener('dragover', e => { e.preventDefault(); uploadBox.classList.add('dragging'); });
uploadBox.addEventListener('dragleave', () => uploadBox.classList.remove('dragging'));
uploadBox.addEventListener('drop', e => { e.preventDefault(); uploadBox.classList.remove('dragging'); handleFile(e.dataTransfer.files[0]); });
document.getElementById('fileInput').addEventListener('change', e => handleFile(e.target.files[0]));

// ── Mobile Menu Toggle ──
document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('rail').classList.toggle('open');
});

// ── Copy Message Button ──
const copyBtn = document.getElementById('copyBtn');
if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    const el = document.getElementById('message') || document.getElementById('outputArea');
    const text = el ? (el.value !== undefined ? el.value : el.textContent) : '';
    navigator.clipboard.writeText(text).then(() => {
      const orig = copyBtn.textContent;
      copyBtn.textContent = 'Copied';
      setTimeout(() => copyBtn.textContent = orig, 1500);
    });
  });
}

// ── Export .txt Button ──
const exportBtn = document.getElementById('downloadBtn') || document.getElementById('btnExport');
if (exportBtn) {
  exportBtn.addEventListener('click', () => {
    const el = document.getElementById('message') || document.getElementById('outputArea');
    const text = el ? (el.value !== undefined ? el.value : el.textContent) : '';
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
    a.download = (S.fileName.replace(/\\.[^.]+$/, '') || 'operational_update') + '_report.txt';
    a.click(); URL.revokeObjectURL(a.href);
  });
}

// ── Overlay Toggles (Insights / Locations / Deep Dive) ──
document.getElementById('insightsBtn')?.addEventListener('click', () => {
  const ov = document.getElementById('analyticsOverlay') || document.getElementById('insightsOverlay') || document.querySelector('.analytics-overlay');
  if (ov) ov.classList.add('open');
});
document.getElementById('overlayBtn')?.addEventListener('click', () => {
  const ov = document.getElementById('locationOverlay') || document.getElementById('labOverlay') || document.querySelector('.analytics-overlay');
  if (ov) ov.classList.add('open');
});
document.getElementById('closeOverlayBtn')?.addEventListener('click', () => {
  document.querySelectorAll('.analytics-overlay, .location-overlay').forEach(o => o.classList.remove('open'));
});

// ═══════════════════════════════════════════════════════
// {{RENDER_DASHBOARD}} - IMPLEMENT THIS FUNCTION
// This is where the AI model fills in the data bindings.
// ═══════════════════════════════════════════════════════
function renderDashboard() {
  const data = S.filtered;
  if (!data.length) return;

  // {{SIDEBAR_METRICS_UPDATE}} - Update sidebar metric values
  // Example: document.getElementById('side-records').textContent = data.length.toLocaleString();

  // {{KPI_CALCULATIONS}} - Calculate and animate KPIs
  // Example: countUp(document.getElementById('kpi-total'), data.length);

  // {{VALIDATION_CHECKS}} - Run data quality checks

  // {{FINDINGS}} - Generate insight cards

  // {{CHARTS}} - Draw SVG charts

  // {{GENERATED_REPORT}} - Generate text report

  // {{TABLES}} - Populate data tables
}
`;

export function getFullDashboardTemplate(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{{DASHBOARD_TITLE}}</title>
  <script src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"></script>
  <!--
    DASHLINT WIREFRAME TEMPLATE
    ─────────────────────────────
    This is the fixed application shell. To complete the dashboard:
    
    1. Replace {{PLACEHOLDER}} markers with your brand/dataset values
    2. Call get_component_patterns with the components you need:
       - kpiCards, panels, validation → for KPI summary
       - horizontalBars → for categorical comparisons  
       - dataTables → for detail/explorer views
       - heatmap → for date×hour density
       - generatedOutput → for text narrative panels
       - multiSelectFilter → for scope filter dropdowns
       - findingCards → for insight display
       - chartContainer → for SVG chart wrappers
       - badges, buttons → for status and actions
       - overlays → for full-screen deep-dive layers
    3. Call get_js_utilities for pre-wired JS (parser, animations, filters, drawer)
    4. Implement renderDashboard() with your data bindings
  -->
  <style>
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');

/* ── Pulse Design Token System (Incident Pulse React canonical) ── */
:root {
  --rail-bg: #151515;
  --rail-border: #252930;
  --accent: #4B5563;
  --accent-dim: rgba(75, 85, 99, 0.10);
  --accent-line: rgba(75, 85, 99, 0.30);
  --ok: #1A7A56;
  --ok-dim: rgba(26, 122, 86, 0.09);
  --warn: #B45309;
  --warn-dim: rgba(180, 83, 9, 0.09);
  --err: #C0392B;
  --err-dim: rgba(192, 57, 43, 0.06);
  --bg: #F2F4F7;
  --surface: #FFFFFF;
  --surface-2: #EEF0F4;
  --surface-3: #F8FAFC;
  --ink: #181C24;
  --muted: #6B7280;
  --line: #DDE1E9;
  --line-strong: #BCC2CE;
  --sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
  --mono: 'IBM Plex Mono', 'Cascadia Code', 'Consolas', monospace;
  --chart-blue: #181C24;
  --chart-indigo: #6366F1;
  --chart-purple: #8B5CF6;
  --chart-teal: #0D9488;
  --chart-cyan: #0891B2;
  --chart-green: #10B981;
  --chart-amber: #F59E0B;
  --chart-orange: #F97316;
  --chart-red: #EF4444;
  --focus-ring: #38BDF8;
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
}

::selection { background: rgba(59, 130, 246, 0.22); color: inherit; }
html, body, #root { width: 100%; height: 100%; margin: 0; overflow: hidden; }
*, *::before, *::after { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
body { font-family: var(--sans); background: var(--bg); color: var(--ink); font-size: 13px; }
button, input, textarea, select { font: inherit; }
[hidden] { display: none !important; }

.app {
  position: relative;
  width: 100vw; height: 100vh; height: 100dvh;
  padding: 12px;
  display: grid; grid-template-columns: 268px minmax(0, 1fr);
  gap: 12px;
  overflow: hidden;
}
.rail, .main, .dashboard-body { min-width: 0; min-height: 0; overflow: hidden; }
.dashboard-body { overflow: auto; overscroll-behavior: contain; }

* { scrollbar-width: thin; scrollbar-color: rgba(24, 28, 36, 0.22) transparent; }
*::-webkit-scrollbar { width: 5px; height: 5px; }
*::-webkit-scrollbar-track { background: transparent; }
*::-webkit-scrollbar-thumb { background: rgba(24, 28, 36, 0.22); border-radius: 4px; }
*::-webkit-scrollbar-thumb:hover { background: rgba(24, 28, 36, 0.42); }
*::-webkit-scrollbar-corner { background: transparent; }
.analytics-overlay *, .slide-drawer * { scrollbar-color: rgba(255,255,255,0.22) transparent; }
.analytics-overlay *::-webkit-scrollbar-thumb, .slide-drawer *::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.22); border-radius: 4px; }
.analytics-overlay *::-webkit-scrollbar-thumb:hover, .slide-drawer *::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.42); }

.main {
  min-width: 0; min-height: 0;
  display: grid;
  grid-template-rows: auto auto auto minmax(0, 1fr);
  gap: 8px;
  overflow: hidden;
}

/* ── SIDEBAR / LEFT RAIL (Incident Pulse canonical) ── */
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

/* ── Header Strip ── */
.header {
  min-width: 0; background: var(--surface); border: 1px solid var(--line); border-radius: 8px;
  display: grid; grid-template-columns: minmax(0, 1fr) 340px; align-items: center; gap: 14px;
  padding: 10px 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,.02);
}
.header-info h1 { margin: 0; font-size: 18px; font-weight: 700; color: var(--ink); line-height: 1.1; letter-spacing: -.02em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.header-info p { margin: 3px 0 0; font-size: 11px; color: var(--muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* ── Upload Box ── */
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
.upload-box:hover .file-btn, .upload-box.dragging .file-btn { background: var(--ink); color: #fff; }

/* ── Navigation Tabs (Segmented Track) ── */
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
}

/* ── Slide-Over Drawers ── */
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
.slide-drawer.open { transform: translate3d(0, 0, 0); }

/* Basic structural CSS & 1-Screen Viewport Fitting (Incident/SLA Canonical) */
.dashboard-body, .tab-content-area { min-height: 0; flex: 1; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; height: 100%; }
#tabPanels { min-height: 0; flex: 1; display: flex; flex-direction: column; height: 100%; width: 100%; }
.tab-pane, .tab-panel { display: none; flex-direction: column; gap: 10px; min-height: 100%; height: 100%; width: 100%; }
.tab-pane.active, .tab-panel.active { display: flex; flex: 1; min-height: 0; }
.workspace, .overview-split { min-height: 0; height: 100%; flex: 1; display: grid; grid-template-columns: minmax(400px, .9fr) minmax(460px, 1.1fr); gap: 12px; overflow: hidden; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; color: var(--muted); font-family: var(--mono); font-size: 12px; text-align: center; gap: 8px; }
.menu-btn { display: none; width: 32px; height: 32px; border: 1px solid var(--line-strong); border-radius: 4px; background: var(--surface); cursor: pointer; font-size: 15px; flex: 0 0 auto; }

@media (max-width: 960px) {
  .app { grid-template-columns: 1fr; }
  .rail { position: fixed; left: 12px; top: 12px; bottom: 12px; width: 268px; z-index: 150; transform: translate3d(-110%, 0, 0); transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1); box-shadow: 0 10px 30px rgba(0,0,0,.25); }
  .rail.open { transform: translate3d(0, 0, 0); }
  .menu-btn { display: grid; place-items: center; }
  .workspace, .overview-split { grid-template-columns: 1fr; overflow: visible; height: auto; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
}
  </style>
</head>
<body>
<div class="app" id="root">
  <!-- SIDEBAR -->
  <aside class="rail" id="rail" aria-label="Application information">
    <div class="brand">
      <div class="logo" role="button" tabindex="0" title="{{BRAND_TOOLTIP}}" aria-label="{{BRAND_TOOLTIP}}">
        <span class="logo-letter">{{LOGO_L1}}</span><span class="logo-letter">{{LOGO_L2}}</span><span class="logo-letter">{{LOGO_L3}}</span>
      </div>
      <div class="brand-title">
        <h1>{{APP_TITLE}}</h1>
        <p>{{APP_SUBTITLE}}</p>
      </div>
    </div>
    <div class="scope-chip"><span class="live-pulse-dot"></span> <span id="scopeLabel">No dataset loaded</span></div>
    <section class="side-metrics">
      <div class="side-head"><h2>SNAPSHOT</h2></div>
      <div class="metric-list" id="sideMetrics">
        <!-- {{SIDEBAR_METRICS}} - Generate side-card divs here -->
        <div class="side-card accent"><label>Records</label><strong id="side-records">—</strong></div>
        <!-- Add more side-card items as needed for the dataset -->
      </div>
    </section>
    <section class="credit">built by <b><a href="https://linkedin.com/in/tanmay-kalbande" target="_blank" rel="noopener noreferrer" class="credit-link" title="Connect on LinkedIn"><span class="name-letter">T</span><span class="name-letter">a</span><span class="name-letter">n</span><span class="name-letter">m</span><span class="name-letter">a</span><span class="name-letter">y</span><span class="name-space">&nbsp;</span><span class="name-letter">K</span><span class="name-letter">a</span><span class="name-letter">l</span><span class="name-letter">b</span><span class="name-letter">a</span><span class="name-letter">n</span><span class="name-letter">d</span><span class="name-letter">e</span></a></b></section>
  </aside>

  <!-- MAIN WORKSPACE -->
  <main class="main">
    <!-- Row 1: Header with Upload -->
    <header class="header">
      <div class="header-info">
        <button class="menu-btn" id="menuBtn" aria-label="Toggle sidebar">☰</button>
        <div class="header-info-text">
          <h1>{{HEADER_TITLE}}</h1>
          <p id="headerSub">Upload a dataset to begin analysis</p>
        </div>
      </div>
      <div class="upload-box" id="uploadBox">
        <span class="upload-kicker">DATASET · STAYS ON THIS DEVICE</span>
        <span class="upload-title">Drop a CSV or Excel file</span>
        <span class="file-name" id="fileName">No file loaded · .csv .xlsx .xls</span>
        <label class="file-btn" tabindex="0">Choose file<input type="file" id="fileInput" accept=".csv,.xlsx,.xls" hidden></label>
      </div>
    </header>

    <!-- Row 2: Filter Bar (hidden until data loaded) -->
    <div class="filter-bar" id="filterBar" hidden>
      <span class="filter-label">Scope</span>
      <div id="filterButtons"></div>
    </div>

    <!-- Row 3: Navigation Tabs -->
    <nav class="nav-tabs" id="navTabs" role="tablist">
      <!-- {{NAV_TABS}} - Generate nav tabs here -->
    </nav>

    <!-- Row 4: Dashboard Body (scrollable content area) -->
    <section class="dashboard-body" id="dashboardBody">
      <!-- Empty state shown before data upload -->
      <div id="emptyState" class="empty-state">
        <div style="font-size:32px;opacity:.3">📊</div>
        <div>Upload a CSV or Excel file to begin</div>
        <div style="font-size:10px;color:var(--accent)">Accepted: .csv · .xlsx · .xls</div>
      </div>

      <!-- Tab panels (hidden until data loaded) -->
      <div id="tabPanels" hidden>
        <!-- {{TAB_PANELS}} -->
      </div>
    </section>
  </main>
</div>

<!-- Drawer -->
<div class="drawer-backdrop" id="drawerBackdrop"></div>
<div class="slide-drawer" id="slideDrawer">
  <div style="padding:16px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--line)">
    <h2 style="margin:0;font-size:14px;font-weight:700" id="drawerTitle">Record Details</h2>
    <button class="btn secondary" id="drawerClose" style="height:28px;padding:0 10px;font-size:11px">✕ Close</button>
  </div>
  <div style="padding:16px" id="drawerBody"></div>
</div>

<script>
// ══════════════════════════════════════════════════════════
// Call get_js_utilities from DashLint MCP to get pre-wired
// JavaScript utilities for: CSV/Excel parsing, count-up
// animations, typewriter effects, tab switching, filter
// engine, drawer management, and file upload handling.
// Paste the JS_UTILITIES code here, then implement
// renderDashboard() with your dataset-specific logic.
// ══════════════════════════════════════════════════════════

// {{PASTE_JS_UTILITIES_HERE}}

// {{IMPLEMENT_RENDER_DASHBOARD}}
</script>
</body>
</html>`;
}

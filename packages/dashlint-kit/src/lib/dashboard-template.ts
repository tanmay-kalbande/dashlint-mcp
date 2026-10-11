import { CreditConfig, renderCreditMarkup } from "./shell-contract";


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
    description: "The canonical Incident/SLA balanced workspace: 2x3 KPI grid + Operational Health Bar + validation checks on the left, fixed-height Generated Output textarea with 4 overlay action buttons on the right. Fits 100% of screen height without vertical scrolling.",
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
            <div class="health-bar-wrap" id="execHealthBar">
              <div class="health-bar-header">
                <span class="health-bar-label">Operational Health Score</span>
                <span class="health-bar-score" id="healthScoreVal">88/100</span>
              </div>
              <div class="health-bar-track">
                <div class="health-bar-fill" id="healthScoreFill" style="width: 88%;"></div>
              </div>
              <div class="health-bar-breakdown">
                <span class="health-bar-item"><span class="health-bar-dot" style="background:var(--ok)"></span> SLA Compliant</span>
                <span class="health-bar-item"><span class="health-bar-dot" style="background:var(--warn)"></span> At Risk</span>
                <span class="health-bar-item"><span class="health-bar-dot" style="background:var(--err)"></span> Breached</span>
              </div>
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
              <button class="btn secondary" id="analyzeBtn">Analyze data ✦</button>
            </div>
          </div>
        </div>`,
    css: `.workspace, .overview-split { min-height: 0; height: 100%; flex: 1; display: grid; grid-template-columns: minmax(400px, .9fr) minmax(460px, 1.1fr); gap: 12px; overflow: hidden; }
.kpi-panel { display: grid; grid-template-rows: auto minmax(0, 1fr) auto auto; gap: 8px; height: 100%; min-height: 0; overflow: hidden; }
.kpis { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(3, minmax(0, 1fr)); gap: 8px; min-height: 0; flex: 1; overflow: hidden; }
.health-bar-wrap { margin-top: 6px; padding: 8px 10px; background: var(--surface-2); border: 1px solid var(--line); border-radius: 6px; }
.health-bar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.health-bar-label { font-size: 8.5px; font-weight: 700; font-family: var(--mono); letter-spacing: .07em; text-transform: uppercase; color: var(--muted); }
.health-bar-score { font-size: 11px; font-weight: 700; font-family: var(--mono); color: var(--ink); }
.health-bar-track { height: 7px; background: rgba(0,0,0,0.06); border: 1px solid var(--line); border-radius: 4px; overflow: hidden; margin-bottom: 6px; }
.health-bar-fill { height: 100%; border-radius: 3px; background: var(--ok); transition: width 0.6s cubic-bezier(.16, 1, .3, 1), background 0.3s ease; }
.health-bar-breakdown { display: flex; gap: 8px; flex-wrap: wrap; font-size: 9px; font-family: var(--mono); color: var(--muted); }
.health-bar-item { display: inline-flex; align-items: center; gap: 4px; }
.health-bar-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
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

export const JS_UTILITIES = `
/* ═══════════════════════════════════════════════════════
   DASHLINT DASHBOARD UTILITIES v2.0
   Copy-ready JS for every generated dashboard.
   ═══════════════════════════════════════════════════════ */

// ── HTML Escape Helper (A9) ──
function esc(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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

// ── Modal Accessibility & Inert Management (A16) ──
function setModalInert(isInert) {
  const appRoot = document.getElementById('appRoot') || document.querySelector('.shell') || document.querySelector('.main');
  if (appRoot) {
    if (isInert) {
      appRoot.setAttribute('inert', '');
      if ('inert' in appRoot) appRoot.inert = true;
    } else {
      appRoot.removeAttribute('inert');
      if ('inert' in appRoot) appRoot.inert = false;
    }
  }
}

// ── CSV Parser (A11: BOM strip \uFEFF, character state machine for quotes & newlines, delimiter detection) ──
function parseCSV(text) {
    if (!text) return { columns: [], headers: [], rows: [] };
    if (text.charCodeAt(0) === 0xFEFF || text.startsWith('\\uFEFF') || text.startsWith('\uFEFF')) {
        text = text.replace(/^(\\uFEFF|\uFEFF)/, '');
    }

    // Detect delimiter from first line
    const firstLineEnd = text.search(/\\r?\\n/);
    const sample = firstLineEnd === -1 ? text : text.slice(0, firstLineEnd);
    const commaCount = (sample.match(/,/g) || []).length;
    const semiCount = (sample.match(/;/g) || []).length;
    const tabCount = (sample.match(/\\t/g) || []).length;
    let sep = ',';
    if (tabCount > commaCount && tabCount > semiCount) sep = '\\t';
    else if (semiCount > commaCount) sep = ';';

    const rows = [];
    let curRow = [];
    let curCell = '';
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === '"') {
            if (inQuotes && text[i + 1] === '"') {
                curCell += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (ch === sep && !inQuotes) {
            curRow.push(curCell.trim());
            curCell = '';
        } else if ((ch === '\\r' || ch === '\\n') && !inQuotes) {
            if (ch === '\\r' && text[i + 1] === '\\n') i++;
            curRow.push(curCell.trim());
            curCell = '';
            if (curRow.length > 1 || (curRow.length === 1 && curRow[0] !== '')) {
                rows.push(curRow);
            }
            curRow = [];
        } else {
            curCell += ch;
        }
    }
    if (curCell !== '' || curRow.length > 0) {
        curRow.push(curCell.trim());
        if (curRow.length > 1 || (curRow.length === 1 && curRow[0] !== '')) {
            rows.push(curRow);
        }
    }

    if (rows.length === 0) return { columns: [], headers: [], rows: [] };
    const columns = rows[0];
    const dataRows = [];
    for (let r = 1; r < rows.length; r++) {
        const vals = rows[r];
        if (vals.length === 1 && vals[0] === '') continue;
        const obj = {};
        columns.forEach((col, j) => {
            obj[col] = vals[j] ?? '';
        });
        dataRows.push(obj);
    }
    return { columns, headers: columns, rows: dataRows };
  }

// ── Excel Parser (A12: First non-empty sheet, date shifts & serial numbers) ──
function parseExcel(buffer) {
  if (typeof XLSX === 'undefined') {
    alert('Excel support requires an internet connection. Please use CSV for offline.');
    return null;
  }
  const wb = XLSX.read(buffer, { type: 'array', cellDates: true });
  let sheet = null;
  let activeSheetName = '';
  for (const name of wb.SheetNames) {
    const s = wb.Sheets[name];
    if (s && s['!ref']) {
      sheet = s;
      activeSheetName = name;
      break;
    }
  }
  if (!sheet) {
    sheet = wb.Sheets[wb.SheetNames[0]];
    activeSheetName = wb.SheetNames[0];
  }
  const rawRows = XLSX.utils.sheet_to_json(sheet, { defval: '', raw: false });
  const rows = rawRows.map(row => {
    const clean = {};
    for (const [k, v] of Object.entries(row)) {
      if (v instanceof Date) {
        const shifted = new Date(v.getTime() + 12 * 3600 * 1000);
        clean[k] = shifted.toISOString().split('T')[0];
      } else {
        clean[k] = v;
      }
    }
    return clean;
  });
  const columns = rows.length ? Object.keys(rows[0]) : [];
  return { columns, rows, sheetName: activeSheetName, sheets: wb.SheetNames };
}

// ── Count-Up Animation (A14: unit preservation, value caching, reduced motion) ──
function countUp(el, target, opts = {}) {
  if (!el) return;
  const duration = opts.duration || 600;
  const prefix = opts.prefix || '';
  const suffix = opts.suffix || '';
  const decimals = opts.decimals || 0;
  const numTarget = typeof target === 'number' ? target : parseFloat(String(target).replace(/[^0-9.-]/g, '')) || 0;
  const prefersRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const formatVal = (v) => prefix + (decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString()) + suffix;
  if (prefersRM) {
    el.textContent = formatVal(numTarget);
    el._currentValue = numTarget;
    return;
  }
  const start = performance.now();
  const prevVal = el._currentValue ?? 0;
  el._currentValue = numTarget;
  function frame(now) {
    let t = Math.min((now - start) / duration, 1);
    t = 1 - Math.pow(1 - t, 3); // easeOutCubic
    const val = prevVal + (numTarget - prevVal) * t;
    el.textContent = formatVal(val);
    if (t < 1) requestAnimationFrame(frame);
    else el.textContent = formatVal(numTarget);
  }
  requestAnimationFrame(frame);
}

// ── Typewriter Effect (A15: capped duration, cancellation support) ──
function typeText(el, text, cb, opts = {}) {
  if (!el) return;
  el._typeGen = (el._typeGen || 0) + 1;
  const myGen = el._typeGen;
  if (typeText.activeTimer) {
    clearTimeout(typeText.activeTimer);
    typeText.activeTimer = null;
  }
  const maxDuration = opts.maxDuration || 1800;
  const leadSentenceOnly = opts.leadSentenceOnly || false;
  const content = leadSentenceOnly ? (text.split(/(?<=[.!?])\\s/)[0] || text) : text;
  const isTA = el.tagName === 'TEXTAREA' || el.tagName === 'INPUT';
  const prefersRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersRM) {
    if (isTA) el.value = content; else el.textContent = content;
    if (cb) cb();
    return;
  }
  let i = 0;
  if (isTA) el.value = ''; else el.textContent = '';
  const baseDelay = Math.min(30, Math.max(8, Math.floor(maxDuration / Math.max(content.length, 1))));
  function next() {
    if (el._typeGen !== myGen) return;
    if (i >= content.length) {
      typeText.activeTimer = null;
      if (cb) cb();
      return;
    }
    if (isTA) {
      el.value += content[i];
      el.scrollTop = el.scrollHeight;
    } else {
      el.textContent += content[i];
    }
    const c = content[i];
    i++;
    const pause = /[.!?\\n]/.test(c) ? Math.min(baseDelay * 3, 120) : baseDelay;
    typeText.activeTimer = setTimeout(next, pause);
  }
  next();
}

// ── Tab Switching (A6: aliases .tab-panel & .tab-pane) ──
function switchTab(tabId) {
  S.activeTab = tabId;
  document.querySelectorAll('.nav-tab').forEach(t => {
    const isActive = t.dataset.tab === tabId;
    t.classList.toggle('active', isActive);
    t.setAttribute('aria-selected', isActive);
  });
  document.querySelectorAll('.tab-panel, .tab-pane').forEach(p => {
    p.classList.toggle('active', p.id === 'panel-' + tabId || p.id === tabId);
  });
}
document.getElementById('navTabs')?.addEventListener('click', e => {
  const tab = e.target.closest('.nav-tab');
  if (tab && tab.dataset.tab) switchTab(tab.dataset.tab);
});

// ── Filter Engine (A13: empty result state handling) ──
function applyFilters() {
  S.filtered = S.raw.filter(row => {
    for (const [col, selected] of Object.entries(S.filters)) {
      if (selected.length && !selected.includes(String(row[col] ?? ''))) return false;
    }
    return true;
  });
  const emptyFilterMsg = document.getElementById('emptyFilterState');
  if (S.filtered.length === 0) {
    if (emptyFilterMsg) emptyFilterMsg.style.display = 'flex';
  } else {
    if (emptyFilterMsg) emptyFilterMsg.style.display = 'none';
  }
  renderDashboard();
}

// ── Filter Button Builder (A2: sibling model, A9: escaping, A10: empty-string handling) ──
function buildFilterButton(col, container) {
  const values = [...new Set(S.raw.map(r => String(r[col] ?? '')))].sort();
  if (values.length < 2 || values.length > 50) return;
  const wrap = document.createElement('div');
  wrap.style.position = 'relative'; wrap.style.display = 'inline-block';
  const btn = document.createElement('button');
  btn.className = 'scope-bar-btn';
  btn.textContent = 'All ' + col;
  const drop = document.createElement('div');
  drop.className = 'filter-drop';
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = btn.classList.toggle('open');
    drop.classList.toggle('open', isOpen);
    document.querySelectorAll('.scope-bar-btn.open').forEach(b => {
      if (b !== btn) {
        b.classList.remove('open');
        b.nextElementSibling?.classList.remove('open');
      }
    });
  });
  const head = document.createElement('div');
  head.className = 'filter-drop-head';
  head.innerHTML = '<span>' + esc(col) + '</span><div><button data-a=\"all\">All</button> <button data-a=\"clear\">Clear</button></div>';
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
    const cnt = S.raw.filter(r => String(r[col] ?? '') === v).length;
    const val = v;
    const displayLabel = val === '' ? '(none)' : val;
    opt.innerHTML = '<input type=\"checkbox\" checked value=\"' + esc(v) + '\"> <span>' + esc(displayLabel) + '</span> <span class=\"cnt\">' + cnt + '</span>';
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

// Close dropdowns on outside click (A2)
document.addEventListener('click', e => {
  if (!e.target.closest('.scope-bar-btn') && !e.target.closest('.filter-drop')) {
    document.querySelectorAll('.scope-bar-btn.open').forEach(b => b.classList.remove('open'));
    document.querySelectorAll('.filter-drop.open').forEach(d => d.classList.remove('open'));
  }
});

// ── Drawers & Focus/Inert Management (A16) ──
function openDrawer(title, html) {
  S.lastOpener = document.activeElement;
  setModalInert(true);
  const t = document.getElementById('drawerTitle'); if (t) t.textContent = title;
  const b = document.getElementById('drawerBody'); if (b) b.innerHTML = html;
  document.getElementById('drawerBackdrop')?.classList.add('open');
  document.getElementById('slideDrawer')?.classList.add('open');
  S.drawerOpen = true;
  document.getElementById('drawerClose')?.focus();
}
function closeDrawer() {
  document.getElementById('drawerBackdrop')?.classList.remove('open');
  document.getElementById('slideDrawer')?.classList.remove('open');
  S.drawerOpen = false;
  setModalInert(false);
  if (S.lastOpener && typeof S.lastOpener.focus === 'function') S.lastOpener.focus();
}
document.getElementById('drawerBackdrop')?.addEventListener('click', closeDrawer);
document.getElementById('drawerClose')?.addEventListener('click', closeDrawer);

// ── Period / Day Drilldown Drawer (F2: No fabricated defaults, A8: data-tip, A17: dynamic chips) ──
function openDayDrawer(dayTitle, config = {}) {
  const drawer = document.getElementById('dayDrawer') || document.querySelector('.day-drawer') || document.querySelector('.period-drawer');
  const backdrop = document.getElementById('dayDrawerOverlay') || document.querySelector('.drawer-backdrop');
  if (!drawer) return;

  S.lastOpener = document.activeElement;
  setModalInert(true);
  const rows = config.rows || [];
  const titleEl = document.getElementById('dayDrawerTitle') || drawer.querySelector('.drawer-agent-name');
  if (titleEl && dayTitle) titleEl.textContent = dayTitle;

  const subEl = document.getElementById('dayDrawerSub') || drawer.querySelector('.drawer-agent-sub');
  if (subEl) subEl.textContent = config.sub || (rows.length ? (rows.length + ' records · drilldown inspection') : '');

  // 1. KPI Chips (A17: supports config array of 4-7 chips or map)
  const chipsContainer = document.getElementById('drawerKpis') || drawer.querySelector('.drawer-kpis');
  if (chipsContainer && Array.isArray(config.kpis)) {
    chipsContainer.innerHTML = config.kpis.map(chip => 
      '<div class=\"drawer-kpi\"><span class=\"drawer-kpi-label\">' + esc(chip.label) + '</span><span class=\"drawer-kpi-val\"' + (chip.color ? (' style=\"color:' + esc(chip.color) + '\"') : '') + '>' + esc(chip.value) + '</span>' + (chip.sub ? ('<span class=\"drawer-kpi-sub\">' + esc(chip.sub) + '</span>') : '') + '</div>'
    ).join('');
  } else {
    // Backward compatibility with individual IDs if present
    const kpis = config.kpis || {};
    const ddVol = document.getElementById('ddVol'); if (ddVol) ddVol.textContent = kpis.volume != null ? String(kpis.volume) : String(rows.length || '—');
    const ddHandled = document.getElementById('ddHandled'); if (ddHandled) ddHandled.textContent = kpis.handled != null ? String(kpis.handled) : '—';
    const ddComp = document.getElementById('ddCompliance');
    if (ddComp) {
      const compVal = kpis.compliance ?? kpis.rate ?? (kpis.volume && kpis.handled ? ((kpis.handled / kpis.volume) * 100).toFixed(1) + '%' : '—');
      ddComp.textContent = String(compVal);
    }
    const ddBreaches = document.getElementById('ddBreaches');
    if (ddBreaches) ddBreaches.textContent = kpis.breaches != null ? String(kpis.breaches) : '—';
  }

  // 2. Root Cause Breakdown Card (F2: Hide if no data)
  const rcCard = document.getElementById('rcCard') || drawer.querySelector('.rc-card');
  if (config.rca && (config.rca.valA != null || config.rca.segAPct != null)) {
    if (rcCard) rcCard.style.display = 'block';
    const segAPct = config.rca.segAPct ?? 0;
    const segBPct = config.rca.segBPct ?? (100 - segAPct);
    const segAEl = document.getElementById('rcSegA'); if (segAEl) segAEl.style.width = segAPct + '%';
    const segBEl = document.getElementById('rcSegB'); if (segBEl) segBEl.style.width = segBPct + '%';
    const rcValA = document.getElementById('rcValA'); if (rcValA) rcValA.textContent = (config.rca.valA ?? '—') + (config.rca.pctA ? (' (' + config.rca.pctA + '%)') : '');
    const rcValB = document.getElementById('rcValB'); if (rcValB) rcValB.textContent = (config.rca.valB ?? '—') + (config.rca.pctB ? (' (' + config.rca.pctB + '%)') : '');
    const rcBadge = document.getElementById('dayStatusBadge');
    if (rcBadge) {
      rcBadge.textContent = config.rca.badgeText || 'Analyzed';
      rcBadge.className = 'pill ' + (config.rca.statusClass || 'neutral');
    }
  } else {
    if (rcCard) rcCard.style.display = 'none';
  }

  // Takeaway callout (F2: Hide if none supplied)
  const takeawayEl = document.getElementById('dayTakeaway');
  if (takeawayEl) {
    const text = config.takeaway || config.rca?.takeaway || '';
    if (text) { takeawayEl.textContent = text; takeawayEl.style.display = 'block'; }
    else { takeawayEl.style.display = 'none'; }
  }

  // 3. Active Contributors / Entities
  const contribEl = document.getElementById('dayContribList');
  const contribSection = document.getElementById('dayContribSection');
  if (config.contributors && config.contributors.length) {
    if (contribSection) contribSection.style.display = 'block';
    if (contribEl) {
      contribEl.innerHTML = config.contributors.map(c => 
        '<span class=\"pill neutral entity-pill clickable-agent-pill\" title=\"' + esc(c.name || c) + '\">👤 <strong>' + esc(c.name || c) + '</strong>' + (c.count ? (' <span style=\"opacity:0.7\">(' + c.count + ')</span>') : '') + '</span>'
      ).join('');
    }
  } else {
    if (contribSection) contribSection.style.display = 'none';
  }

  // 4. Running Progression Chart (F2: No hardcoded points/lines, A8: data-tip)
  const progWrap = document.getElementById('dayProgressionWrap') || drawer.querySelector('.progress-wrap') || drawer.querySelector('.cum-gos-wrap');
  const progSection = progWrap;
  const svgEl = document.getElementById('dayProgressionSvg');
  const points = config.progressionPoints || [];
  if (!points.length) {
    if (progSection) progSection.style.display = 'none';
  } else if (svgEl) {
    if (progWrap) progWrap.style.display = 'block';
    const W = 500, H = 135, padL = 36, padR = 14, padT = 20, padB = 24;
    const cW = W - padL - padR, cH = H - padT - padB;
    const stepX = points.length > 1 ? cW / (points.length - 1) : cW / 2;

    const targetLines = config.targets || (config.baseline != null ? [{ v: config.baseline, l: 'Baseline (' + config.baseline + '%)' }] : []);
    const gridLines = [
      { v: 100, l: '100%' },
      ...targetLines,
      { v: 0, l: '0%' }
    ].map(g => {
      const y = padT + cH - (g.v / 100) * cH;
      return '<line x1=\"' + padL + '\" y1=\"' + y + '\" x2=\"' + (W - padR) + '\" y2=\"' + y + '\" stroke=\"' + (g.color || 'var(--line)') + '\" stroke-width=\"' + (g.dash ? 1.4 : 0.7) + '\" stroke-dasharray=\"' + (g.dash || '2,4') + '\" opacity=\"0.4\"/>' +
        '<text x=\"' + (padL - 6) + '\" y=\"' + (y + 3) + '\" text-anchor=\"end\" fill=\"var(--muted)\" font-size=\"8\" font-family=\"var(--mono)\">' + esc(g.l) + '</text>';
    }).join('');

    const polyPts = points.map((p, i) => {
      const x = padL + i * stepX;
      const y = padT + cH - (p.run / 100) * cH;
      return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');

    const dots = points.map((p, i) => {
      const x = (padL + i * stepX).toFixed(1);
      const y = (padT + cH - (p.run / 100) * cH).toFixed(1);
      const dotColor = p.color || (p.run >= (config.baseline || 80) ? 'var(--chart-green)' : 'var(--chart-amber)');
      const tipText = (p.label || (p.h + ':00')) + ' — Rate: ' + p.rate + '%' + (p.run != null ? (' (Cum: ' + p.run + '%)') : '');
      return '<g tabindex=\"0\" role=\"button\" aria-label=\"' + esc(tipText) + '\" data-tip=\"' + esc(tipText) + '\">' +
        '<circle cx=\"' + x + '\" cy=\"' + y + '\" r=\"4.5\" fill=\"' + dotColor + '\" stroke=\"#fff\" stroke-width=\"1.8\" class=\"progress-dot cum-gos-dot\" style=\"cursor:pointer\" />' +
        '<text x=\"' + x + '\" y=\"' + (H - 4) + '\" text-anchor=\"middle\" fill=\"var(--muted)\" font-size=\"8\" font-family=\"var(--mono)\">' + esc(p.h || String(i + 1)) + '</text>' +
        '</g>';
    }).join('');

    svgEl.innerHTML = gridLines + '<polyline points=\"' + polyPts + '\" fill=\"none\" stroke=\"var(--chart-blue)\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" opacity=\"0.6\"/>' + dots;
  }

  // 5. Bucket / Hourly Bar Chart (F2: Hide if none supplied, A8: data-tip)
  const hourlyWrap = document.getElementById('dayHourlyWrap') || drawer.querySelector('.hourly-gos-chart') || drawer.querySelector('.bucket-chart');
  const hourlySection = hourlyWrap;
  const barsEl = document.getElementById('dayHourlyBars');
  const hours = config.hourlyData || [];
  if (!hours.length) {
    if (hourlySection) hourlySection.style.display = 'none';
    if (barsEl) barsEl.style.display = 'none';
  } else if (barsEl) {
    if (hourlyWrap) hourlyWrap.style.display = 'flex';
    barsEl.style.display = 'flex';
    barsEl.innerHTML = hours.map((hd, i) => {
      const barColor = hd.color || (hd.rate >= (config.baseline || 80) ? 'var(--chart-green)' : 'var(--chart-amber)');
      const tipContent = esc((hd.h != null ? (hd.h + ':00') : (hd.label || ('#' + (i+1)))) + ' — ' + hd.rate + '%' + (hd.count ? (' (' + hd.count + ' records)') : ''));
      return '<div class=\"bucket-col h-gos-col\" tabindex=\"0\" role=\"button\" data-tip=\"' + tipContent + '\" onclick=\"selectDayHour(' + i + ')\">' +
        '<span class=\"bucket-val h-gos-val\">' + esc(String(hd.rate)) + '%</span>' +
        '<div class=\"bucket-bar h-gos-bar\" style=\"height:' + Math.max(hd.rate, 6) + '%;background:' + barColor + '\"></div>' +
        '<span class=\"bucket-lbl h-gos-lbl\">' + esc(String(hd.h ?? hd.label ?? i)) + '</span>' +
        '</div>';
    }).join('');

    window.selectDayHour = function(idx) {
      document.querySelectorAll('#dayHourlyBars .bucket-col, #dayHourlyBars .h-gos-col').forEach((el, i) => {
        el.classList.toggle('active', i === idx);
      });
      const selected = hours[idx];
      const panel = document.getElementById('hourDetailPanel');
      if (panel && selected) {
        panel.classList.add('open');
        const t = document.getElementById('hdTitle'); if (t) t.textContent = '🕐 ' + (selected.h != null ? (selected.h + ':00') : selected.label) + ' — Detail';
        const b = document.getElementById('hdBadge'); if (b) b.textContent = selected.rate + '% Rate';
        const grid = document.getElementById('hdGrid');
        if (grid) {
          grid.innerHTML = 
            '<div class=\"hd-stat\"><div class=\"hd-stat-label\">Volume</div><div class=\"hd-stat-value\">' + (selected.count ?? '—') + '</div><div class=\"hd-stat-sub\">records</div></div>' +
            '<div class=\"hd-stat\"><div class=\"hd-stat-label\">Rate</div><div class=\"hd-stat-value\" style=\"color:var(--ok)\">' + selected.rate + '%</div><div class=\"hd-stat-sub\">fulfillment</div></div>' +
            '<div class=\"hd-stat\"><div class=\"hd-stat-label\">Variance</div><div class=\"hd-stat-value\" style=\"color:var(--chart-amber)\">' + (100 - selected.rate) + '%</div><div class=\"hd-stat-sub\">gap</div></div>';
        }
        const narr = document.getElementById('hdNarrative');
        if (narr) {
          narr.textContent = (selected.h != null ? (selected.h + ':00') : selected.label) + ' window processed ' + (selected.count || 0) + ' items at ' + selected.rate + '% rate.';
        }
      }
    };
  }

  // 6. CSV Download wiring (Newline escaping fixed)
  const dlBtn = document.getElementById('dlDayCsv');
  if (dlBtn && rows.length) {
    dlBtn.onclick = function() {
      const keys = Object.keys(rows[0]);
      let csv = keys.join(',') + '\\n';
      rows.forEach(r => {
        csv += keys.map(k => '\"' + String(r[k] ?? '').replace(/\"/g, '\"\"') + '\"').join(',') + '\\n';
      });
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = (dayTitle || 'detail-export').replace(/[^a-zA-Z0-9_-]/g, '_') + '.csv';
      a.click();
    };
  }

  if (backdrop) backdrop.classList.add('open');
  drawer.classList.add('open');
  S.drawerOpen = true;
  document.getElementById('dayDrawerClose')?.focus();
}

function closeDayDrawer() {
  const drawer = document.getElementById('dayDrawer') || document.querySelector('.day-drawer') || document.querySelector('.period-drawer');
  const backdrop = document.getElementById('dayDrawerOverlay') || document.querySelector('.drawer-backdrop');
  if (drawer) drawer.classList.remove('open');
  if (backdrop) backdrop.classList.remove('open');
  S.drawerOpen = false;
  setModalInert(false);
  if (S.lastOpener && typeof S.lastOpener.focus === 'function') S.lastOpener.focus();
}

document.getElementById('dayDrawerClose')?.addEventListener('click', closeDayDrawer);
document.getElementById('dayDrawerBack')?.addEventListener('click', closeDayDrawer);
document.getElementById('dayDrawerOverlay')?.addEventListener('click', closeDayDrawer);

// ── Floating Chart Tooltip & Delegated Handler (A8) ──
function showChartTooltip(x, y, html) {
  let tt = document.getElementById('chartTooltip');
  if (!tt) {
    tt = document.createElement('div');
    tt.id = 'chartTooltip';
    tt.style.position = 'fixed';
    tt.style.pointerEvents = 'none';
    tt.style.zIndex = '99999';
    document.body.appendChild(tt);
  }
  tt.innerHTML = html;
  tt.style.display = 'block';
  const pad = 12;
  const w = tt.offsetWidth || 120;
  const h = tt.offsetHeight || 30;
  let posX = x + pad;
  let posY = y - h - pad;
  if (posX + w > window.innerWidth) posX = x - w - pad;
  if (posY < 10) posY = y + pad;
  tt.style.left = Math.max(8, posX) + 'px';
  tt.style.top = Math.max(8, posY) + 'px';
}
function hideChartTooltip() {
  const tt = document.getElementById('chartTooltip');
  if (tt) tt.style.display = 'none';
}

// Delegated tooltip listeners
document.addEventListener('mousemove', e => {
  const target = e.target.closest('[data-tip]');
  if (target) {
    showChartTooltip(e.clientX, e.clientY, target.getAttribute('data-tip'));
  } else if (!e.target.closest('#chartTooltip')) {
    hideChartTooltip();
  }
});
document.addEventListener('focusin', e => {
  const target = e.target.closest('[data-tip]');
  if (target) {
    const rect = target.getBoundingClientRect();
    showChartTooltip(rect.left + rect.width / 2, rect.top - 8, target.getAttribute('data-tip'));
  }
});
document.addEventListener('focusout', e => {
  if (e.target.closest('[data-tip]')) hideChartTooltip();
});

// ── Reset All State (A13) ──
function resetAll() {
  closeDrawer();
  closeDayDrawer();
  closeAnalyticsOverlay();
  closeAnalysisStudio();
  hideChartTooltip();
  S.filters = {};
  S.filtered = [...S.raw];
  document.querySelectorAll('.scope-bar-btn').forEach(b => {
    b.classList.remove('active', 'open');
  });
  document.querySelectorAll('.filter-drop').forEach(d => {
    d.classList.remove('open');
    d.querySelectorAll('input').forEach(i => i.checked = true);
  });
}

// ── File Upload Handler ──
function handleFile(file) {
  if (!file) return;
  S.fileName = file.name;
  const fileNameEl = document.getElementById('fileName');
  if (fileNameEl) fileNameEl.textContent = file.name;
  const ext = file.name.split('.').pop().toLowerCase();
  if (ext === 'csv') {
    const reader = new FileReader();
    reader.onload = e => {
      const result = parseCSV(e.target.result);
      if (result.rows.length) loadData(result.columns, result.rows);
      else if (fileNameEl) { fileNameEl.textContent = 'Error: no data rows found'; fileNameEl.classList.add('error'); }
    };
    reader.readAsText(file);
  } else if (['xlsx', 'xls'].includes(ext)) {
    const reader = new FileReader();
    reader.onload = e => {
      const result = parseExcel(new Uint8Array(e.target.result));
      if (result && result.rows.length) loadData(result.columns, result.rows);
      else if (fileNameEl) { fileNameEl.textContent = 'Error: no data rows found'; fileNameEl.classList.add('error'); }
    };
    reader.readAsArrayBuffer(file);
  } else if (fileNameEl) {
    fileNameEl.textContent = 'Unsupported file type';
    fileNameEl.classList.add('error');
  }
}

function loadData(columns, rows) {
  resetAll();
  S.columns = columns;
  S.raw = rows;
  S.filters = {};
  S.filtered = [...rows];
  document.getElementById('fileName')?.classList.remove('error');
  const emptyState = document.getElementById('emptyState'); if (emptyState) emptyState.hidden = true;
  const tabPanels = document.getElementById('tabPanels'); if (tabPanels) tabPanels.hidden = false;
  const filterBar = document.getElementById('filterBar'); if (filterBar) filterBar.hidden = false;
  const headerSub = document.getElementById('headerSub');
  if (headerSub) headerSub.textContent = rows.length.toLocaleString() + ' rows · ' + S.fileName;
  const scopeLabel = document.getElementById('scopeLabel');
  if (scopeLabel) scopeLabel.textContent = rows.length.toLocaleString() + ' records · ' + S.fileName;

  const fb = document.getElementById('filterButtons');
  if (fb) fb.innerHTML = '';
  // {{BUILD_FILTERS}} - Add filter columns here
  renderDashboard();
}

// ── Drag and Drop ──
const uploadBox = document.getElementById('uploadBox');
if (uploadBox) {
  uploadBox.addEventListener('dragenter', e => { e.preventDefault(); uploadBox.classList.add('dragging'); });
  uploadBox.addEventListener('dragover', e => { e.preventDefault(); uploadBox.classList.add('dragging'); });
  uploadBox.addEventListener('dragleave', () => uploadBox.classList.remove('dragging'));
  uploadBox.addEventListener('drop', e => { e.preventDefault(); uploadBox.classList.remove('dragging'); handleFile(e.dataTransfer.files[0]); });
}
document.getElementById('fileInput')?.addEventListener('change', e => handleFile(e.target.files[0]));

// ── Mobile Menu Toggle ──
document.getElementById('menuBtn')?.addEventListener('click', () => {
  document.getElementById('rail')?.classList.toggle('open');
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

// ── Analytics Overlay & Sub-tab Switching (A16) ──
function openAnalyticsOverlay(subtabId) {
  S.lastOpener = document.activeElement;
  setModalInert(true);
  const ov = document.getElementById('analyticsOverlay') || document.getElementById('insightsOverlay') || document.querySelector('.analytics-overlay');
  if (ov) {
    ov.classList.add('open');
    if (subtabId) switchOverlayTab(subtabId);
    document.getElementById('analyticsClose')?.focus();
  }
}
function closeAnalyticsOverlay() {
  document.querySelectorAll('.analytics-overlay, .location-overlay').forEach(o => o.classList.remove('open'));
  setModalInert(false);
  if (S.lastOpener && typeof S.lastOpener.focus === 'function') S.lastOpener.focus();
}
function switchOverlayTab(tabId) {
  document.querySelectorAll('#overlayTabs .a-tab, .analytics-tabs .a-tab').forEach(t => {
    t.classList.toggle('active', t.dataset.atab === tabId);
  });
  document.querySelectorAll('.a-tab-pane').forEach(p => {
    p.classList.toggle('active', p.id === 'atab-' + tabId);
  });
}

document.getElementById('insightsBtn')?.addEventListener('click', () => openAnalyticsOverlay('trends'));
document.getElementById('analyzeBtn')?.addEventListener('click', () => openAnalysisStudio());
document.querySelectorAll('.analytics-close, #closeOverlayBtn').forEach(btn => {
  btn.addEventListener('click', closeAnalyticsOverlay);
});
document.getElementById('overlayTabs')?.addEventListener('click', e => {
  const tab = e.target.closest('.a-tab');
  if (tab && tab.dataset.atab) switchOverlayTab(tab.dataset.atab);
});

// ── Analysis Studio: Universal Pivot Workbench ──
function openAnalysisStudio() {
  S.lastOpener = document.activeElement;
  setModalInert(true);
  const ov = document.getElementById('analysisStudioOverlay');
  if (!ov) return;
  initAnalysisWorkbench();
  ov.classList.add('open');
  document.getElementById('analysisStudioClose')?.focus();
}
function closeAnalysisStudio() {
  const ov = document.getElementById('analysisStudioOverlay');
  if (ov) ov.classList.remove('open');
  setModalInert(false);
  if (S.lastOpener && typeof S.lastOpener.focus === 'function') S.lastOpener.focus();
}

function initAnalysisWorkbench() {
  if (!S.columns.length) return;
  const numericCols = []; const catCols = [];
  S.columns.forEach(col => {
    const sample = S.filtered.slice(0, 50);
    const numCount = sample.filter(r => r[col] !== '' && !isNaN(Number(r[col]))).length;
    if (numCount > sample.length * 0.6 && sample.length > 0) numericCols.push(col);
    else catCols.push(col);
  });
  const rowSel = document.getElementById('pivotRow');
  const colSel = document.getElementById('pivotCol');
  if (rowSel) {
    rowSel.innerHTML = catCols.map(c => '<option value="' + esc(c) + '">' + esc(c) + '</option>').join('');
    if (!catCols.length) rowSel.innerHTML = S.columns.map(c => '<option value="' + esc(c) + '">' + esc(c) + '</option>').join('');
  }
  if (colSel) {
    colSel.innerHTML = '<option value="none">No split \\u2014 compare metrics</option>' + catCols.filter(c => c !== (rowSel ? rowSel.value : '')).map(c => '<option value="' + esc(c) + '">' + esc(c) + '</option>').join('');
  }
  const chipRow = document.getElementById('pivotMetricChips');
  if (chipRow) {
    chipRow.innerHTML = '<span class="metric-chip-label">METRICS</span>';
    const defaultMetrics = [{key:'_count',label:'Count',active:true}];
    numericCols.slice(0,7).forEach(c => defaultMetrics.push({key:c,label:c,active:false}));
    defaultMetrics.forEach(m => {
      const btn = document.createElement('button');
      btn.className = 'metric-chip' + (m.active ? ' active' : '');
      btn.dataset.metric = m.key;
      btn.textContent = m.label;
      btn.addEventListener('click', () => { btn.classList.toggle('active'); buildPivotTable(); });
      chipRow.appendChild(btn);
    });
  }
  document.getElementById('pivotRecordBadge').textContent = S.filtered.length.toLocaleString() + ' RECORDS';
  document.getElementById('pivotScopeCount').textContent = S.filtered.length.toLocaleString();
  ['pivotRow','pivotCol','pivotLimit','pivotSearch'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(el.tagName === 'INPUT' ? 'input' : 'change', () => buildPivotTable());
  });
  document.getElementById('pivotSortBtn')?.addEventListener('click', function() {
    this.dataset.desc = this.dataset.desc === '1' ? '0' : '1';
    this.textContent = this.dataset.desc === '1' ? '\\u2193 High to low' : '\\u2191 Low to high';
    buildPivotTable();
  });
  document.getElementById('pivotExport')?.addEventListener('click', exportPivotCsv);
  buildPivotTable();
}

function buildPivotTable() {
  const data = S.filtered;
  const rowField = document.getElementById('pivotRow')?.value;
  const colField = document.getElementById('pivotCol')?.value || 'none';
  const limit = Number(document.getElementById('pivotLimit')?.value || 10);
  const search = (document.getElementById('pivotSearch')?.value || '').trim().toLowerCase();
  const desc = (document.getElementById('pivotSortBtn')?.dataset.desc || '1') === '1';
  if (!rowField) return;
  const activeChips = document.querySelectorAll('#pivotMetricChips .metric-chip.active');
  const metrics = Array.from(activeChips).map(b => b.dataset.metric);
  if (!metrics.length) return;
  const isMulti = colField === 'none';
  // Group by row field
  const groups = {};
  data.forEach(r => {
    const key = String(r[rowField] || '').trim() || 'Unspecified';
    if (!groups[key]) groups[key] = [];
    groups[key].push(r);
  });
  // Compute metric values
  function metricVal(rows, metric) {
    if (metric === '_count') return rows.length;
    const nums = rows.map(r => Number(r[metric])).filter(n => !isNaN(n));
    return nums.length ? nums.reduce((a,b) => a+b, 0) / nums.length : 0;
  }
  function fmtVal(v, metric) {
    if (metric === '_count') return v.toLocaleString();
    return Number.isInteger(v) ? v.toLocaleString() : v.toFixed(2);
  }
  let pivotRows = Object.entries(groups)
    .filter(([key]) => !search || key.toLowerCase().includes(search))
    .map(([key, rows]) => {
      const vals = {};
      metrics.forEach(m => { vals[m] = metricVal(rows, m); });
      return { label: key, rows, vals, sortVal: vals[metrics[0]] || 0 };
    })
    .sort((a, b) => desc ? b.sortVal - a.sortVal : a.sortVal - b.sortVal);
  const totalRows = pivotRows.length;
  if (limit > 0) pivotRows = pivotRows.slice(0, limit);
  // Compute column values for split mode
  let colValues = [];
  if (!isMulti) {
    const colCounts = {};
    data.forEach(r => { const v = String(r[colField] || '').trim() || 'Unspecified'; colCounts[v] = (colCounts[v]||0)+1; });
    colValues = Object.entries(colCounts).sort((a,b) => b[1]-a[1]).slice(0,8).map(e => e[0]);
  }
  // Compute max for bar widths
  const metricMax = {};
  metrics.forEach(m => { metricMax[m] = Math.max(1, ...pivotRows.map(r => r.vals[m])); });
  // Update header
  const sortMetricLabel = metrics.length ? (metrics[0] === '_count' ? 'Count' : metrics[0]) : '';
  document.getElementById('pivotResultTitle').textContent = (isMulti ? metrics.length + ' metrics' : sortMetricLabel) + ' by ' + rowField + (isMulti ? '' : ' × ' + colField);
  document.getElementById('pivotRowCount').textContent = totalRows.toLocaleString() + ' rows';
  // Render table
  const wrap = document.getElementById('pivotTableWrap');
  if (!wrap) return;
  if (!data.length) { wrap.innerHTML = '<div class="analysis-empty">No records match the current filters.</div>'; return; }
  let html = '<table class="pivot-table">';
  if (isMulti) {
    html += '<thead><tr><th>' + esc(rowField) + '</th>';
    metrics.forEach(m => { html += '<th>' + esc(m === '_count' ? 'Count' : m) + '</th>'; });
    html += '</tr></thead><tbody>';
    pivotRows.forEach(pr => {
      html += '<tr><th><button title="Open matching records">' + esc(pr.label) + '</button><small>' + pr.rows.length.toLocaleString() + ' records</small></th>';
      metrics.forEach(m => {
        const v = pr.vals[m];
        const w = Math.min(100, (v / metricMax[m]) * 100);
        html += '<td class="pivot-cell-metric"><button><span class="pivot-bar accent-neutral" style="width:' + w + '%"></span><span class="pivot-value">' + fmtVal(v, m) + '</span></button></td>';
      });
      html += '</tr>';
    });
    html += '</tbody>';
  } else {
    html += '<thead><tr><th>' + esc(rowField) + '</th>';
    colValues.forEach(cv => { html += '<th>' + esc(cv) + '</th>'; });
    html += '<th>Total</th></tr></thead><tbody>';
    pivotRows.forEach(pr => {
      html += '<tr><th><button title="Open matching records">' + esc(pr.label) + '</button><small>' + pr.rows.length.toLocaleString() + ' records</small></th>';
      const metric = metrics[0];
      colValues.forEach(cv => {
        const cell = pr.rows.filter(r => (String(r[colField]||'').trim()||'Unspecified') === cv);
        html += '<td><button>' + fmtVal(metricVal(cell, metric), metric) + '</button></td>';
      });
      html += '<td style="font-weight:700"><button>' + fmtVal(pr.vals[metrics[0]], metrics[0]) + '</button></td></tr>';
    });
    html += '</tbody>';
  }
  html += '</table>';
  wrap.innerHTML = html;
  // Wire cell click → openDrawer
  wrap.querySelectorAll('th button, td button').forEach(btn => {
    btn.addEventListener('click', () => {
      const label = btn.textContent.trim();
      const matching = data.filter(r => String(r[rowField]||'').includes(label.split(' ')[0]));
      if (typeof openDrawer === 'function' && matching.length) {
        const preview = matching.slice(0, 20);
        let drawerHtml = '<p style="color:var(--muted);font-size:10px;margin-bottom:8px">' + matching.length + ' matching records</p>';
        drawerHtml += '<div style="overflow:auto"><table class="data-table" style="font-size:10px"><thead><tr>';
        S.columns.slice(0,6).forEach(c => { drawerHtml += '<th>' + esc(c) + '</th>'; });
        drawerHtml += '</tr></thead><tbody>';
        preview.forEach(r => { drawerHtml += '<tr>'; S.columns.slice(0,6).forEach(c => { drawerHtml += '<td>' + esc(String(r[c]||'')) + '</td>'; }); drawerHtml += '</tr>'; });
        drawerHtml += '</tbody></table></div>';
        if (matching.length > 20) drawerHtml += '<p style="color:var(--muted);font-size:10px;margin-top:6px">Showing 20 of ' + matching.length + '</p>';
        openDrawer(label, drawerHtml);
      }
    });
  });
}

function exportPivotCsv() {
  const table = document.querySelector('#pivotTableWrap table');
  if (!table) return;
  const rows = [];
  table.querySelectorAll('tr').forEach(tr => {
    const cells = [];
    tr.querySelectorAll('th, td').forEach(cell => {
      let text = cell.textContent.trim().replace(/\\n.*/s, '');
      if (/[",\\n]/.test(text)) text = '"' + text.replace(/"/g, '""') + '"';
      cells.push(text);
    });
    rows.push(cells.join(','));
  });
  const csv = rows.join('\\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'analysis-studio-' + Date.now() + '.csv'; a.click();
  URL.revokeObjectURL(a.href);
}

document.getElementById('analysisStudioClose')?.addEventListener('click', closeAnalysisStudio);

// Escape key closes modals in stacking order (A16)
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    const studio = document.querySelector('.analysis-studio-overlay.open');
    if (studio) { closeAnalysisStudio(); return; }
    const overlay = document.querySelector('.analytics-overlay.open');
    if (overlay) { closeAnalyticsOverlay(); return; }
    const dayDrawer = document.querySelector('.day-drawer.open, .period-drawer.open');
    if (dayDrawer) { closeDayDrawer(); return; }
    if (S.drawerOpen) { closeDrawer(); return; }
    document.querySelectorAll('.scope-bar-btn.open').forEach(b => b.classList.remove('open'));
    document.querySelectorAll('.filter-drop.open').forEach(d => d.classList.remove('open'));
    hideChartTooltip();
  }
});

// ═══════════════════════════════════════════════════════
// {{RENDER_DASHBOARD}} - IMPLEMENT THIS FUNCTION
// ═══════════════════════════════════════════════════════
function renderDashboard() {
  const data = S.filtered;
  const emptyFilterMsg = document.getElementById('emptyFilterState');
  if (!data.length) {
    if (emptyFilterMsg) emptyFilterMsg.style.display = 'flex';
    document.querySelectorAll('.kpi-value').forEach(el => el.textContent = '0');
    return;
  }
  if (emptyFilterMsg) emptyFilterMsg.style.display = 'none';

  // {{SIDEBAR_METRICS_UPDATE}} - Update sidebar metric values
  // {{KPI_CALCULATIONS}} - Calculate and animate KPIs
  // {{VALIDATION_CHECKS}} - Run data quality checks
  // {{CHARTS_AND_VISUALS}} - Draw SVG charts and horizontal comparison bars
  // {{GENERATED_REPORT}} - Generate text report into textarea
  // {{TABLES}} - Populate data tables
}
`;

function escHtml(str: string): string {
  return str.replace(/[&<>"']/g, (m) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m] || m));
}

const CREDIT_STYLES = `
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
`;

export function getFullDashboardTemplate(options?: { brandTitle?: string; brandSubtitle?: string; credit?: CreditConfig }): string {
  const creditMarkup = renderCreditMarkup(options?.credit);
  const creditCss = options?.credit === 'none' ? '' : CREDIT_STYLES;
  const brandTitle = options?.brandTitle ? escHtml(options.brandTitle) : '{{APP_TITLE}}';
  const brandSubtitle = options?.brandSubtitle ? escHtml(options.brandSubtitle) : '{{APP_SUBTITLE}}';
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
       - healthBar → for operational score gauge
       - horizontalBars → for categorical comparisons
       - dataTables → for detail/explorer views
       - heatmap → for date×hour density
       - generatedOutput → for text narrative panels (all briefing text belongs here; NEVER generate piles of text cards)
       - multiSelectFilter → for scope filter dropdowns
       - chartContainer → for SVG chart wrappers
       - dayDrawer → for intraday breakdown & root cause
       - dayComparator → for day-over-day comparisons
       - chartTooltip → for interactive chart hover probe
       - badges, buttons → for status and actions
       - overlays → for full-screen deep-dive layers
       - analysisStudio → for Analysis Studio pivot workbench (Analyze data ✦)
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
.main, .dashboard-body { min-width: 0; min-height: 0; overflow: hidden; }
.rail { width: 268px; min-width: 268px; max-width: 268px; flex-shrink: 0; min-height: 0; overflow: hidden; box-sizing: border-box; }
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
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
}
.dashboard-body, .tab-content-area {
  flex: 1;
  min-height: 0;
}

/* ── Badges, Status Pills & Utility Classes (A5) ── */
.badge { background: var(--surface-2); color: var(--muted); border: 1px solid var(--line); font-weight: 600; border-radius: 3px; padding: 3px 8px; font-size: 10px; font-family: var(--mono); }
.badge.ok { background: var(--ok-dim); color: var(--ok); border-color: rgba(26, 122, 86, .25); }
.badge.warn { background: var(--warn-dim); color: var(--warn); border-color: rgba(180, 83, 9, .25); }
.badge.err { background: var(--err-dim); color: var(--err); border-color: rgba(192, 57, 43, .25); }
.pill { display: inline-flex; align-items: center; gap: 4px; padding: 2px 7px; border-radius: 999px; font: 10px var(--mono); font-weight: 600; border: 1px solid var(--line); background: var(--surface-2); color: var(--muted); }
.pill.ok { background: var(--ok-dim); color: var(--ok); border-color: rgba(26, 122, 86, .25); }
.pill.warn { background: var(--warn-dim); color: var(--warn); border-color: rgba(180, 83, 9, .25); }
.pill.err { background: var(--err-dim); color: var(--err); border-color: rgba(192, 57, 43, .25); }
.pill.neutral { background: var(--surface-2); color: var(--ink); }
.btn.ghost { background: transparent; color: var(--muted); border: 1px solid transparent; }
.btn.ghost:hover { background: var(--surface-2); color: var(--ink); }
.date-filter-strip { display: flex; align-items: center; gap: 8px; font-family: var(--mono); font-size: 11px; }
.scope-bar-label { display: inline-flex; align-items: center; gap: 6px; font-size: 9px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
.period-pulse-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ok); display: inline-block; box-shadow: 0 0 0 2px var(--ok-dim); animation: pulseDot 2s infinite; }
@keyframes pulseDot { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .4; transform: scale(.85); } }

/* ── SIDEBAR / LEFT RAIL (Incident Pulse canonical) ── */
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

${creditCss}

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

/* ── Slide-Over Drawers & Backdrops ── */
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
.slide-drawer.open { transform: translate3d(0, 0, 0); }

/* ── Analytics Overlay Layer (Clip-path wipe) ── */
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

/* ── Day Drilldown Drawer (Intraday Progression & Root Cause) ── */
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
.bucket-chart, .hourly-gos-chart { display: flex; align-items: flex-end; gap: 3px; height: 110px; padding: 20px 8px 6px; margin-bottom: 6px; background: var(--surface); border: 1px solid var(--line); border-radius: 6px; }
.bucket-col, .h-gos-col { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; justify-content: flex-end; position: relative; min-width: 0; cursor: pointer; }
.bucket-col:hover .bucket-bar, .h-gos-col:hover .h-gos-bar { opacity: .85; transform: scaleY(1.04); transform-origin: bottom; }
.bucket-col.active .bucket-bar, .h-gos-col.active .h-gos-bar { box-shadow: 0 0 0 2px var(--ink); }
.bucket-bar, .h-gos-bar { width: 100%; max-width: 18px; border-radius: 3px 3px 0 0; min-height: 4px; transition: height 0.5s cubic-bezier(.16, 1, .3, 1), opacity .15s; }
.bucket-val, .h-gos-val { position: absolute; top: -16px; font-size: 8px; font-family: var(--mono); font-weight: 600; color: var(--ink); white-space: nowrap; }
.bucket-lbl, .h-gos-lbl { font-size: 8.5px; font-family: var(--mono); color: var(--muted); margin-top: 4px; }
.progress-wrap, .cum-gos-wrap { background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 10px; margin-bottom: 8px; }
.progress-svg, .cum-gos-svg { width: 100%; display: block; }
.hour-detail { background: var(--surface-2); border: 1px solid var(--line); border-radius: 6px; padding: 0; margin-bottom: 12px; overflow: hidden; max-height: 0; opacity: 0; transition: max-height .3s ease, opacity .25s ease, padding .25s ease; }
.hour-detail.open { max-height: 500px; opacity: 1; padding: 12px; }
.hour-detail-title { font-size: 11.5px; font-weight: 700; color: var(--ink); font-family: var(--mono); margin-bottom: 8px; display: flex; align-items: center; justify-content: space-between; }
.hour-detail-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 6px; margin-bottom: 8px; }
.hd-stat { background: var(--surface); border: 1px solid var(--line); border-radius: 4px; padding: 6px 8px; text-align: center; }
.hd-stat-label { font-size: 8px; color: var(--muted); font-family: var(--mono); font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
.hd-stat-value { font-size: 14px; font-weight: 700; color: var(--ink); font-family: var(--mono); margin-top: 2px; }
.hd-stat-sub { font-size: 8.5px; color: var(--muted); font-family: var(--mono); margin-top: 1px; }
.hd-narrative { font-size: 10.5px; font-family: var(--mono); line-height: 1.5; color: var(--ink); background: var(--surface); padding: 8px 10px; border-radius: 4px; border: 1px solid var(--line); }

/* ── Operational Health Bar Gauge ── */
.health-bar-wrap { margin-top: 6px; padding: 8px 10px; background: var(--surface-2); border: 1px solid var(--line); border-radius: 6px; }
.health-bar-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.health-bar-label { font-size: 8.5px; font-weight: 700; font-family: var(--mono); letter-spacing: .07em; text-transform: uppercase; color: var(--muted); }
.health-bar-score { font-size: 11px; font-weight: 700; font-family: var(--mono); color: var(--ink); }
.health-bar-track { height: 7px; background: rgba(0,0,0,0.06); border: 1px solid var(--line); border-radius: 4px; overflow: hidden; margin-bottom: 6px; }
.health-bar-fill { height: 100%; border-radius: 3px; background: var(--ok); transition: width 0.6s cubic-bezier(.16, 1, .3, 1), background 0.3s ease; }
.health-bar-breakdown { display: flex; gap: 8px; flex-wrap: wrap; font-size: 9px; font-family: var(--mono); color: var(--muted); }
.health-bar-item { display: inline-flex; align-items: center; gap: 4px; }
.health-bar-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }

/* ── Day Comparator ── */
.comparator-controls { display: flex; align-items: flex-end; gap: 10px; margin-bottom: 12px; flex-wrap: wrap; }
.comp-select-group { display: flex; flex-direction: column; gap: 3px; }
.comp-select-group label { font-size: 8.5px; font-weight: 700; color: var(--muted); font-family: var(--mono); letter-spacing: .07em; text-transform: uppercase; }
.comp-select { height: 28px; border: 1px solid var(--line); border-radius: 4px; background: var(--surface); font: 10.5px var(--mono); padding: 0 8px; color: var(--ink); }
.comp-delta { display: inline-flex; align-items: center; gap: 4px; font: 600 10.5px var(--mono); padding: 2px 6px; border-radius: 3px; }
.comp-delta.improved { color: var(--ok); background: var(--ok-dim); }
.comp-delta.declined { color: var(--err); background: var(--err-dim); }
.comp-delta.neutral { color: var(--muted); background: var(--surface-2); }

/* ── Floating Chart Tooltip ── */
#chartTooltip {
  position: fixed; display: none; background: rgba(22, 25, 31, 0.94);
  backdrop-filter: blur(4px); border: 1px solid rgba(255, 255, 255, 0.14);
  color: #e4e6eb; padding: 8px 12px; border-radius: 6px; font-family: var(--mono);
  font-size: 11px; z-index: 99999; pointer-events: none;
  box-shadow: 0 8px 24px rgba(0,0,0,0.5); line-height: 1.4;
}

/* Basic structural CSS & 1-Screen Viewport Fitting (Incident/SLA Canonical) */
.dashboard-body, .tab-content-area { min-height: 0; flex: 1; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; height: 100%; }
#tabPanels { min-height: 0; flex: 1; display: flex; flex-direction: column; height: 100%; width: 100%; }
.tab-pane, .tab-panel { display: none; flex-direction: column; gap: 10px; min-height: 100%; height: 100%; width: 100%; }
.tab-pane.active, .tab-panel.active { display: flex; flex: 1; min-height: 0; }
.workspace, .overview-split { min-height: 0; height: 100%; flex: 1; display: grid; grid-template-columns: minmax(400px, .9fr) minmax(460px, 1.1fr); gap: 12px; overflow: hidden; }
.empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; color: var(--muted); font-family: var(--mono); font-size: 12px; text-align: center; gap: 8px; }
.menu-btn { display: none; width: 32px; height: 32px; border: 1px solid var(--line-strong); border-radius: 4px; background: var(--surface); cursor: pointer; font-size: 15px; flex: 0 0 auto; }

@media (max-width: 1180px) {
  .app { grid-template-columns: 248px minmax(0, 1fr); padding: 10px; gap: 10px; }
  .rail { width: 248px; min-width: 248px; max-width: 248px; padding: 14px 10px; }
  .workspace, .overview-split { grid-template-columns: 1fr 1fr; }
}

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
        <h1>${brandTitle}</h1>
        <p>${brandSubtitle}</p>
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
    ${creditMarkup}
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

<!-- Standard Record Detail Drawer -->
<div class="drawer-backdrop" id="drawerBackdrop"></div>
<div class="slide-drawer" id="slideDrawer">
  <div class="drawer-header" style="background:var(--rail-bg);color:#fff;padding:16px 20px;border-left:1px solid var(--rail-border);display:flex;justify-content:space-between;align-items:center;">
    <h2 style="margin:0;font-size:14px;font-weight:700;color:#fff;font-family:var(--mono);" id="drawerTitle">Record Details</h2>
    <button class="drawer-close" id="drawerClose" style="position:static;" aria-label="Close drawer">✕</button>
  </div>
  <div style="padding:16px;flex:1;overflow-y:auto;background:var(--surface);" id="drawerBody"></div>
</div>

<!-- Day Breakdown Drawer (Intraday Progression & Root Cause Laboratory) -->
<div class="drawer-overlay" id="dayDrawerOverlay"></div>
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
</aside>

<!-- Analytics Deep-Dive Overlay (Clip-Path Wipe) -->
<section class="analytics-overlay" id="analyticsOverlay" role="dialog" aria-modal="true">
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
    <button class="a-tab active" data-atab="trends">Top Trends</button>
    <button class="a-tab" data-atab="breakdown">Daily Breakdown</button>
    <button class="a-tab" data-atab="details">Distribution &amp; Segments</button>
  </nav>
  <div class="analytics-body" id="overlayBody">
    <div class="a-tab-pane active" id="atab-trends"></div>
    <div class="a-tab-pane" id="atab-breakdown"></div>
    <div class="a-tab-pane" id="atab-details"></div>
  </div>
</section>

<!-- Analysis Studio: Universal Pivot Workbench -->
<section class="analysis-studio-overlay" id="analysisStudioOverlay" role="dialog" aria-modal="true">
  <div class="analytics-topbar">
    <div style="display:flex;align-items:center;gap:10px;">
      <div><p style="margin:0 0 3px;color:#8D96A3;font:700 8.5px var(--mono);letter-spacing:.09em">DATA LAB / INTERACTIVE</p><h2>Analysis Studio &middot; Pivot Table</h2></div>
    </div>
    <span class="badge" id="pivotRecordBadge">0 RECORDS</span>
    <button class="analytics-close" id="analysisStudioClose">Back to Dashboard</button>
  </div>
  <div class="analysis-studio-body">
    <div class="analysis-workbench">
      <section class="analysis-header panel">
        <div><p class="analysis-kicker">FLEXIBLE DATA WORKBENCH</p><h2>Analysis Studio</h2><span>Build a pivot view &mdash; every control changes the data, not just the display.</span></div>
        <div class="studio-tabs"><button class="active">Pivot Workbench</button><div class="analysis-scope"><b id="pivotScopeCount">0</b><span>records</span></div></div>
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
          <div><button class="analysis-export" id="pivotExport">Export CSV</button><button class="analysis-sort" id="pivotSortBtn" data-desc="1">&darr; High to low</button><span class="badge" id="pivotRowCount">0 rows</span></div>
        </div>
        <div class="pivot-wrap" id="pivotTableWrap"></div>
        <div class="analysis-footnote">Click any row or cell to investigate that segment in the detail drawer. Current global filters are always preserved.</div>
      </section>
    </div>
  </div>
</section>

<!-- Floating Chart Tooltip -->
<div id="chartTooltip"></div>

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

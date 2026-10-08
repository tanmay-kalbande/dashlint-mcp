/* Shell contract is served by its own MCP tool (get_shell_preservation_spec). */

export const DASHBOARD_CREATION_WORKFLOW = {
  purpose: "DashLint is an open-ended orchestration and instruction layer for dashboards in any domain. The AI coding assistant inspects the user's supplied dataset locally, then creates a reusable, downloadable HTML dashboard whose metrics and insights are calculated from files uploaded when the dashboard is opened. The MCP does not ingest the dataset, calculate its findings, or generate project files. No domain, metric family, or visualization family is restricted by DashLint.",
  designPhilosophy: "Every generated dashboard must follow the Incident Pulse React design language: a dual-theme architecture with a clean, high-legibility light workspace (#F2F4F7 canvas, #FFFFFF panels, #181C24 ink) and a dark analytical overlay layer (#151515 base, scoped CSS variable overrides). The shell uses Inter for body text, IBM Plex Mono for all metrics/data/technical labels with tabular-nums, fluid clamp() sizing for KPI values, 8px border radii, 12px grid gaps, and restrained #4B5563 accent for controls. Richer colors are reserved exclusively for data visualization via the --chart-* token palette. Pure procedural SVG charts are strongly preferred over third-party charting libraries to ensure standalone HTML portability.",
  inputHandling: [
    "Read the supplied CSV, spreadsheet, JSON, or other dataset directly from the user's message or project using available local tools. Never ask the user to send dataset rows to a DashLint MCP tool.",
    "Use the user's active application shell code as the source of truth. When a shell or project is not available, use the concrete starter code from get_shell_preservation_spec — its designTokens, frameCode, sidebarMarkupTemplate, sidebarCssTemplate, and componentPatterns are copy-ready implementation code, not illustrative prose.",
    "Treat the supplied dataset as analysis input for designing and validating the dashboard, never as the dashboard's embedded data. The finished app must start without those rows and prompt its eventual user to upload a CSV or Excel workbook.",
    "Keep the analysis open to any subject area. Infer the domain from the user's goal, data dictionary, and locally inspected fields; do not apply an allowlist, force a known-domain template, or assume only operational metrics are useful.",
  ],
  sequence: [
    { step: 1, name: "Understand the task", action: "Identify the business question, intended audience, key decisions, date scope, and any requested filters or exports. Infer sensible defaults from the dataset where possible." },
    { step: 2, name: "Profile the data", action: "Read the data locally. Identify row grain, field types, units, time span, missingness, duplicates, cardinality, valid ranges, and data quality constraints. Check whether each row is an event, entity, snapshot, or aggregate before calculating metrics." },
    { step: 3, name: "Find defensible insights", action: "Calculate candidate KPIs, time changes, comparisons, segment rankings, distributions, outlier candidates, and relationships that answer the user's question. Check denominators and sample sizes; distinguish facts from hypotheses and never imply causation from correlation." },
    { step: 4, name: "Build a schema-aware blueprint", action: "After profiling locally, call build_dashboard_blueprint with the business question and column names, inferred types, and optional distinct/null counts only. Never include file rows, sample values, or identifiers from actual records. Treat field matches, metric recipes, warnings, and chart ideas as non-exhaustive heuristics, not requirements or limits; use any defensible domain-specific analysis or visualization that answers the user's question." },
    { step: 5, name: "Build a reusable HTML dashboard", action: "Start by calling get_full_dashboard_template to get the lightweight wireframe with the fixed application shell (design tokens, frame, sidebar, header, upload box, tabs, drawer). Then call get_component_patterns with the specific components your dataset needs (e.g. kpiCards, panels, horizontalBars, dataTables, findingCards, generatedOutput — only request what you'll actually use). Finally call get_js_utilities for pre-wired CSV/Excel parsing, animations, filters, and interactivity. Assemble by pasting component CSS into the wireframe's <style> block, JS utilities into the <script> block, and building tab panels using the HTML snippets. Apply the full Incident Pulse visual language throughout. If an existing project shell is available, reuse its markup verbatim instead." },
    { step: 6, name: "Bind every result to the uploaded file", action: "Implement local browser parsing for CSV and Excel workbooks (.xlsx and .xls). Recompute every KPI, chart series, comparison, table, validation status, and narrative insight from the currently uploaded rows and active filters. Keep data-derived values out of source constants and markup; only field mappings, formulas, labels, and insight-generation rules may be authored ahead of time." },
    { step: 7, name: "Make it interactive", action: "Implement working upload, filters, chart selections, cross-filtering, and detail drawers where they help the user's task. On each new file, clear stale selections and completely replace the previous dataset before recalculating every view. Every visible control must have a real action; don't add decorative controls. Use 600ms easeOutCubic count-up animations for KPI numbers and 20-55ms typewriter effects for generated text." },
    { step: 8, name: "Review the result", action: "Verify the downloaded HTML opens without the original dataset embedded, begins in an upload/empty state, parses CSV and Excel locally, and recalculates all outputs after uploading another file. Check malformed/unsupported files, workbook sheet choice when relevant, keyboard use, responsive layouts, prefers-reduced-motion support, and preservation of the shell and upload position." },
  ],
  guardrails: [
    "The shell is an invariant. Do not redesign, relocate, replace, simplify, or delete the app frame, sidebar, header, upload control, navigation structure, outer border, or drawer/overlay conventions for an individual dataset.",
    "Maintain a fixed viewport (100vw × 100dvh) with no document/page-level scrollbar. Constrain overflow to the source app's designated dashboard body, sidebar metric list, table, or drawer; never let generated content push the frame beyond the viewport.",
    "For a new app without source shell files, call get_full_dashboard_template for the wireframe, then get_component_patterns for the specific components needed, then get_js_utilities for interactivity. This 3-call flow gives you exactly the CSS, HTML, and JS you need without wasting tokens on unused components. Replace only the template's brand/scope content and data-bound sidebar metric cards. If actual source shell files are available, reuse their exact markup/component and CSS verbatim.",
    "The dashboard body is adaptive. There is no required number or fixed arrangement of KPI cards, charts, insight cards, filters, or tables.",
    "DashLint has no domain whitelist or fixed catalogue of permitted metrics, formulas, layouts, or chart types. Use all suitable analytical approaches for the user's domain; suggestions returned by the blueprint are optional and non-exhaustive. Derive novel metrics only when their formula is defensible from verified fields, and state assumptions or ask when meaning cannot be established.",
    "Never hardcode source rows, precomputed KPIs, chart points, dates, or data-dependent insight text from the dataset shared with the AI. The finished HTML must not need that original file to run; it must derive all displayed results from the user's later upload.",
    "The deliverable is a reusable HTML app. CSV parsing is lightweight and should be hand-written (~50 lines). For Excel support (.xlsx, .xls), load SheetJS from a CDN with a single script tag (e.g. \u003cscript src=\"https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js\"\u003e\u003c/script\u003e). Add a runtime check: if typeof XLSX is undefined after load, disable the Excel option and show a short message like 'Excel requires an internet connection — use CSV for offline.' Never inline or output the SheetJS library source; it is ~700 KB of minified code and must not be written into the HTML. Do not rely on a development server or backend for file parsing.",
    "Use raw data only in the user's project/runtime. Do not transmit it to DashLint or add a remote data service. Follow the source app's privacy behavior unless the user explicitly requests otherwise.",
    "Strongly prefer pure procedural SVG for all charts (lines, bars, areas, heatmaps, distributions, Sankey flows). This eliminates third-party charting library dependencies and ensures the dashboard works as a single self-contained HTML file. Use the --chart-* CSS variable tokens for all chart colors.",
    "Do the implementation, not just a plan or a code snippet, when a writable project is available. Explain blockers only when required source files or workspace access are genuinely missing.",
  ],
};

export const DATA_INSIGHT_PLAYBOOK = {
  workLocally: "The AI assistant performs all dataset inspection and calculations using the user's provided file or project. This tool returns instructions only; it accepts no data.",
  profiling: [
    "Establish dataset grain and what one row means before aggregation. Identify likely identifiers, measures, dimensions, time fields, units, currencies, percentages, status fields, and target/benchmark fields.",
    "Check row and column counts, missing and malformed values, duplicate keys/rows, date parsing, inconsistent categories, out-of-range values, and whether numeric-looking fields are actually IDs or codes.",
    "Keep original values intact for detail tables. Use cleaned/derived data for analysis and make transformations explicit and reproducible.",
  ],
  insightMethods: [
    "Metrics: use sums for additive measures, averages/medians for per-record measures, distinct counts for entities, and rates only with a clearly defined numerator and denominator. Avoid summing snapshots or percentages.",
    "Time: sort chronologically, choose a meaningful interval, show the covered period, compare like-for-like periods where possible, and account for partial periods or uneven sampling. Do not call a direction change seasonality without enough history.",
    "Segments: rank groups on an appropriate measure, show counts/denominators, avoid overinterpreting tiny groups, and combine a long tail only if 'Other' remains meaningful.",
    "Distribution: inspect spread, skew, quantiles, and outlier candidates. State the detection method and treat outliers as investigation candidates, not errors or anomalies by default.",
    "Relationships: check plausible pairs with appropriate summaries or plots. Describe association, not cause; call out confounders, small samples, and missingness when material.",
    "Derived measures: create only metrics with a clear business interpretation and a defensible formula from available fields. Label the formula and units near the result.",
  ],
  insightWriting: [
    "Give each insight a claim-style title, a one-sentence explanation, and direct supporting numbers: period, comparator/baseline, delta, denominator, and sample size as relevant.",
    "Prioritize by decision relevance, magnitude, confidence, and coverage. Separate observed finding, possible explanation, and suggested next question.",
    "Include a compact data-quality or limitations note when missingness, low volume, partial periods, or ambiguous field meanings could change the interpretation.",
    "Do not fabricate targets, business meaning, units, causality, anomaly labels, forecasts, or confidence. If the data cannot support a useful conclusion, state that plainly.",
  ],
};

export const DASHBOARD_COMPOSITION_PLAYBOOK = {
  scope: "Open to every domain. There is no fixed set of dashboard types, metric packs, or visualization families. The user's question and the locally inspected dataset decide what to build; the examples below are non-exhaustive prompts, not restrictions.",
  fixedVsAdaptive: {
    fixed: "The complete application shell described in shellContract, copied from the user's existing source app or the MCP's starter code.",
    adaptive: "Only the dashboard content region inside that shell: the narrative, section count, grids, cards, filters, charts, comparisons, summaries, and detail views.",
  },
  storyOrder: [
    "Decision-relevant title and date/scope in header",
    "Executive Overview 1-screen balanced workspace: Tab 1 must NEVER scroll vertically on desktop. Use .workspace / .overview-split { height: 100%; min-height: 0; display: grid; grid-template-columns: minmax(400px, .9fr) minmax(460px, 1.1fr); gap: 12px; overflow: hidden; }. Left column: .kpi-panel { display: grid; grid-template-rows: auto minmax(0, 1fr) auto; gap: 8px; height: 100%; min-height: 0; } with 6 KPI cards in a 2x3 grid (.kpis { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(3, minmax(0, 1fr)); gap: 8px; flex: 1; min-height: 0; }) and a 3-column .validation check strip. Each KPI card uses clamp(20px, 2.2vw, 30px) mono value, 9.5px uppercase label, and subtext with ' · click to explore'.",
    "Right column: .message-panel / .gen-output { display: grid; grid-template-rows: auto minmax(0, 1fr) auto auto; gap: 8px; height: 100%; min-height: 0; } with textarea.summary-textarea (flex: 1; min-height: 0; resize: none; overflow-y: auto; 11.5px mono), collapsible .rules (<details> with calculation formulas), and 4 overlay action buttons (.actions { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; } with 'Copy msg', 'Insights', '.txt', 'Deep Dive/Locations'). Both left and right panels match 100% height and fit the screen without scrolling.",
    "The strongest finding and its evidence: use .finding-card with colored left border (.positive/.caution/.note). Title in .finding-title (12px, 600 weight), body in .finding-body (11px, muted).",
    "Time, segment, distribution, or relationship views using pure SVG charts inside .panel containers. Use .chart-container (min-height: 200px) wrapper with responsive SVG (viewBox, preserveAspectRatio=xMidYMid meet). Segment comparisons use .seg-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; } with .hbar-row bars inside .panel cards.",
    "Optional searchable detail table using .data-table inside a .panel. Sticky thead (position: sticky; top: 0), 8.5px uppercase mono headers, 11px mono body cells. Add .store-search input (28px height, mono font) in the .panel-head for text filtering.",
  ],
  chartSelection: [
    { question: "How does a measure change over ordered time?", use: "Pure SVG line chart with cubic Bézier smoothing. Area fill via <linearGradient> with opacity 0.14→0.00. Dashed horizontal grid lines. Interactive hover circles (r=6) with floating HTML tooltips. Use --ink (#181C24) stroke with 2.5px width." },
    { question: "Which categories are larger or smaller?", use: "Sorted horizontal bar chart using the .hbar-row pattern: 140px label column, 1fr track (8px height, var(--surface-2) background, 3px radius), 44px value column. Fill transitions via width with 0.4s cubic-bezier(.4,0,.2,1)." },
    { question: "How are numeric values distributed?", use: "Histogram for shape/frequency; box plot for compact group distribution comparison; show units and explain bins where needed. Use vertical SVG bars with rx=2." },
    { question: "How do two ordered dimensions interact?", use: "Heatmap using the .heatmap-grid CSS pattern: 54px label column + repeat(24, minmax(0, 1fr)). Cells are 22px tall with 2px gap. Color ramp from rgba(255,255,255,0.04) through #1e3a8a → #2563eb → #38bdf8 → #bae6fd. Hover: scale(1.18) with 1.5px solid --ink outline." },
    { question: "What is the part-to-whole split?", use: "Stacked bar or a short bar ranking for comparisons. Donut only for a few mutually exclusive categories (≤4 segments) with explicit percentage labels. For donut: pure SVG arc calculation using cos/sin/Math.PI*2." },
    { question: "Which individual records need investigation?", use: "Searchable, sortable table using the .data-table pattern: sticky thead, 8.5px uppercase mono headers, 11px mono body cells, clickable rows with 0.04 ink hover background. Connect chart/KPI selections to filtered rows when useful." },
    { question: "Does one variable relate to another?", use: "Scatter plot for two numeric measures; show density or aggregation when overlapping points obscure the pattern." },
  ],
  visualPrinciples: [
    "Use the Incident Pulse React type scale, border treatment, spacing rhythm, control shapes, and surface hierarchy. Keep the reference neutral shell and preserve the 'built by Tanmay Kalbande' credit at the bottom of the sidebar; adapt the data visualization palette to the analysis.",
    "Choose any visual form that fits the data, including domain-specific or custom views. The chart examples above are common starting points, never an exhaustive menu.",
    "Give metrics tabular numerals (font-variant-numeric: tabular-nums), clear units, contextual labels, and stable loading/empty/error states. Do not rely on color alone.",
    "Favor direct labels and annotations for the key point. Legends should be compact and unambiguous; avoid decorative chart effects and needless animation.",
    "Use asymmetric layouts when evidence has different importance. Do not make every section the same card size or every chart a KPI grid.",
    "Keep the main finding visible early; place secondary diagnostics and dense tables lower or behind a relevant interaction.",
    "Render all charts using pure procedural SVG with vector-effect: non-scaling-stroke for crisp display. Use the --chart-* CSS variables for consistent coloring. Avoid canvas-based rendering and third-party charting libraries when the dashboard will be a standalone HTML file.",
    "Crucial 1-Screen Rule: Tab 1 (Executive Overview) must fit within 100% viewport height without vertical scrolling on desktop. Both the left KPI panel and right Generated Output panel must stretch identically (height: 100%; min-height: 0).",
  ],
  sectionLayoutCss: {
    overviewSplit: ".workspace, .overview-split { height: 100%; min-height: 0; flex: 1; display: grid; grid-template-columns: minmax(400px, .9fr) minmax(460px, 1.1fr); gap: 12px; overflow: hidden; }",
    kpiPanel: ".kpi-panel { display: grid; grid-template-rows: auto minmax(0, 1fr) auto; gap: 8px; height: 100%; min-height: 0; overflow: hidden; } .kpis { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); grid-template-rows: repeat(3, minmax(0, 1fr)); gap: 8px; min-height: 0; flex: 1; overflow: hidden; }",
    messagePanel: ".message-panel, .gen-output { display: grid; grid-template-rows: auto minmax(0, 1fr) auto auto; gap: 8px; height: 100%; min-height: 0; overflow: hidden; } .summary-textarea, textarea.summary-textarea { width: 100%; height: 100%; min-height: 0; flex: 1; border: 1px solid var(--line); border-radius: 6px; background: var(--surface-2); color: var(--ink); padding: 12px 14px; font: 11.5px/1.55 var(--mono); resize: none; outline: none; white-space: pre-wrap; overflow-y: auto; box-sizing: border-box; } .rules { margin-top: 4px; border: 1px solid var(--line); border-radius: 5px; background: var(--surface-2); padding: 6px 10px; color: var(--muted); font-size: 10px; font-family: var(--mono); } .actions { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px; align-items: center; margin-top: 4px; } .actions .btn { height: 36px; font-size: 11.5px; width: 100%; }",
    tabPanel: ".dashboard-body, .tab-content-area { min-height: 0; flex: 1; overflow-y: auto; overflow-x: hidden; display: flex; flex-direction: column; height: 100%; } #tabPanels { min-height: 0; flex: 1; display: flex; flex-direction: column; height: 100%; width: 100%; } .tab-pane, .tab-panel { display: none; flex-direction: column; gap: 10px; min-height: 100%; height: 100%; width: 100%; } .tab-pane.active, .tab-panel.active { display: flex; flex: 1; min-height: 0; }",
    kpiGrid: ".kpi-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }",
    segmentGrid: ".seg-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 12px; }",
    emptyState: ".empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; color: var(--muted); font-family: var(--mono); font-size: 12px; text-align: center; gap: 8px; }",
    findingCard: ".finding-card { background: var(--surface); border: 1px solid var(--line); border-radius: 6px; padding: 12px 14px; border-left: 3px solid var(--accent); margin-bottom: 8px; } .finding-card.positive { border-left-color: var(--ok); } .finding-card.caution { border-left-color: var(--warn); } .finding-card.note { border-left-color: var(--chart-indigo); }",
    filterBar: ".filter-bar { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; min-width: 0; position: relative; z-index: 20; } .filter-label { font-family: var(--mono); font-size: 9.5px; color: var(--muted); letter-spacing: .07em; text-transform: uppercase; font-weight: 700; }",
    responsive: "@media (max-width: 960px) { .app { grid-template-columns: 1fr; } .rail { position: fixed; left: 12px; top: 12px; bottom: 12px; width: 268px; z-index: 150; transform: translate3d(-110%, 0, 0); transition: transform 0.24s cubic-bezier(0.16, 1, 0.3, 1); } .rail.open { transform: translate3d(0, 0, 0); } .menu-btn { display: grid; place-items: center; } .workspace, .overview-split { grid-template-columns: 1fr; overflow: visible; height: auto; } .message-panel, .gen-output { min-height: 400px; } .actions { grid-template-columns: repeat(2, minmax(0, 1fr)); } .kpis { grid-template-columns: repeat(2, minmax(0, 1fr)); } .seg-grid { grid-template-columns: 1fr; } }",
  },
};

export const DASHBOARD_INTERACTION_PLAYBOOK = {
  upload: [
    "Preserve and reuse the existing upload/drop zone, exact position in the header, file-picker action, and filename/status display. The reference upload-box is 56px tall with 1.5px dashed var(--line-strong) border, var(--surface-2) background, 6px radius. On hover, border transitions to var(--chart-blue) and the action button inverts to white-on-ink. Keep the same visual control and position while accepting CSV (.csv) and Excel (.xlsx, .xls) files. Do not create a second uploader elsewhere.",
    "Support the same upload path from keyboard file selection and drag/drop if the source app does. Show drag-active (.dragging class), parsing, ready, and actionable error states in the existing visual language.",
    "Parse files entirely in the browser. CSV can be parsed with a lightweight hand-written parser. For Excel workbooks (.xlsx, .xls), load SheetJS via a CDN script tag — never inline the library source into the HTML. Add a runtime check: if the XLSX global is unavailable (offline or blocked), disable Excel upload and show a short message suggesting CSV. Never transmit uploaded contents to DashLint, a remote service, or an external spreadsheet API. For workbooks with multiple sheets, let the user choose a sheet and explain which sheet is active.",
    "When a new file or sheet is selected, discard all previous rows and derived results, reset filters/selections safely, then recompute the entire dashboard from the new data. Never leave stale KPIs, charts, insight copy, or table rows on screen.",
    "Handle a first-open empty state with no embedded source data and a clear prompt to upload a CSV or Excel file. If required fields are missing or the schema differs from the expected mapping, explain the mismatch and offer a mapping/recovery path instead of showing old or fabricated results.",
  ],
  filtersAndCharts: [
    "Provide only filters useful to the dataset and user question. Use the reference scope-bar-btn pattern: 25px height buttons with 4px radius, 9.5px mono font, #F8FAFC background, 1px solid rgba(0,0,0,.08) border. Active filter state inverts to --ink background with white text. Each filter shows the selected value or count in its label (e.g. 'All states ▾', '2 selected ▾').",
    "Filters should open as multi-select dropdown panels (.filter-drop) with checkboxes, item counts, and All/Clear header actions. Each option row shows a checkbox, label, and count. Selecting/deselecting an option immediately updates the dashboard. The filter button gets the .active class when not all options are selected. Clicking outside or pressing Escape closes the dropdown.",
    "Chart clicks should select/filter a meaningful category or open a real detail view. Cross-filter related views consistently; selected state must be visible and reversible.",
    "Every tooltip and interactive mark needs an accessible equivalent such as a label, table, or keyboard-operable control.",
  ],
  generatedOutput: [
    "When the dashboard generates a text narrative, report, or operational update from the uploaded data, present it in a Generated Output panel (.gen-output) positioned alongside the KPI summary. Use the .output-area for the scrollable text body with a Copy button in the top-right corner. Show a placeholder prompt ('Upload data to generate the report') in the empty state.",
    "Include a collapsible Calculation rules section (.calc-toggle, using a <details> element) below the output body that explains how the text was derived — what formulas, field mappings, and rules produced the output.",
    "Add action buttons (.output-actions) below the rules section. Reference buttons include: a primary Copy action (dark fill), an Insights action (dark fill), and secondary actions like Improve or .txt export (outlined). Adapt the button set to the dashboard's domain.",
    "Regenerate the output text every time the uploaded file changes or a filter is applied. Never leave stale output text from a previous file or filter state. Apply the same 20–55ms typewriter effect used for insight text if the output is generated line by line.",
  ],
  drawerAndOverlay: [
    "Use clip-path: inset(0 100% 0 0 round 8px) → inset(0 0 0 0 round 8px) expansion for overlays, positioned at left: calc(268px + 24px) to keep the sidebar visible. Timing: 0.62s cubic-bezier(0.16, 1, 0.3, 1) for clip-path, 0.18s for opacity.",
    "Drawers slide from right via translate3d with 0.24s cubic-bezier(0.16, 1, 0.3, 1). Default width: min(520px, 92vw). Wide drawers: min(840px, 64vw). Backdrop: rgba(15, 23, 42, 0.45) with backdrop-filter: blur(2px).",
    "Close through the existing close affordance and backdrop behavior; Escape closes when appropriate and focus returns to the opener.",
    "Prevent background interaction while modal overlays are active, keep dialog content scrollable, and provide an accessible dialog name.",
  ],
  responsiveAndAccessible: [
    "Keep the 100vh/100dvh app frame and no page-level scrolling. Contain necessary scrolling within the reference app's inner content panels, sidebar metric list, tables, and drawers.",
    "At narrow breakpoints (≤960px), collapse the sidebar to a hamburger-triggered overlay and reflow the content body to a single column.",
    "Use semantic headings, labels, buttons, visible focus (2px solid var(--focus-ring) outlines), sufficient contrast, reduced-motion support (@media (prefers-reduced-motion: reduce) disables all animations), and keyboard access for every control.",
  ],
};

export const DASHBOARD_COMPLETION_CHECKLIST = [
  "Is the deliverable a reusable HTML app that opens locally and does not contain the dataset shared with the AI, hardcoded KPI values, chart rows, or fixed findings?",
  "Does the first-open state ask the end user to upload a CSV or Excel workbook, and do both formats parse in the browser without sending data over the network?",
  "After replacing the file, are every KPI, chart, comparison, narrative insight, validation, and detail row recomputed from only the newly uploaded data?",
  "Did the implementation use the actual supplied dataset and confirm its row grain, fields, quality, and units?",
  "Does each highlighted insight trace to a calculation and show the needed date range, baseline, denominator, and sample size?",
  "Are the chosen charts rendered as pure procedural SVG (preferred) or with a bundled library, using the --chart-* CSS variable tokens for consistent coloring?",
  "Is the original shell intact, including sidebar (#151515 rail), header strip, upload box (56px dashed), navigation tabs, overlays, and responsive behavior? Does the sidebar end with the reference 'built by Tanmay Kalbande' LinkedIn credit with staggered nameColorWave animation?",
  "Does the full app fit inside one viewport (100vw × 100dvh) with overflow contained inside the intended panels?",
  "Did the design follow the user's domain and data instead of assuming a fixed dashboard type, metric pack, or chart catalogue?",
  "Is the original upload button/drop zone in the exact same position, styled the same (56px, dashed border, 8.5px mono kicker, 12.5px title, 28px action button), and does it load CSV and Excel files?",
  "Do filters, chart selections, cross-filtering, and drawers work and have clear reset/close behaviors?",
  "Are loading, empty, malformed-file, partial-data, and error states handled without collapsing the shell?",
  "Can the dashboard be operated by keyboard and does the layout remain usable on narrow screens?",
  "Does the dashboard respect prefers-reduced-motion by disabling all animations and showing final states immediately?",
  "Do all KPI values use font-variant-numeric: tabular-nums and clamp(20px, 2.2vw, 30px) fluid sizing? Do count-up animations use 600ms easeOutCubic?",
  "Was the app run and the uploaded data checked end-to-end when the workspace supports it?",
];

export function getDashboardGenerationGuide() {
  return {
    workflow: DASHBOARD_CREATION_WORKFLOW,
    toolMap: {
      note: "The wireframe, component patterns, and JS utilities are served by three focused tools to minimize token usage. Call them in order: wireframe → components → JS. The playbooks provide additional guidance at specific workflow steps.",
      tools: [
        { tool: "get_full_dashboard_template", callAt: "Step 5 — FIRST call for building any new dashboard", returns: "Lightweight HTML wireframe with the fixed shell: design tokens CSS, viewport frame, dark sidebar (brand + metrics + animated credit), header with upload box, nav tabs container, empty dashboard body, and drawer shell. Does NOT include component CSS or JavaScript — those come from the focused tools below." },
        { tool: "get_component_patterns", callAt: "Step 5 — SECOND call, after the wireframe", returns: "CSS + HTML snippets + usage notes for specific components chosen based on the dataset. Pass component names like kpiCards, panels, horizontalBars, dataTables, validation, heatmap, generatedOutput, multiSelectFilter, findingCards, chartContainer, overlays, drawers, badges, buttons, sectionLayouts, accessibility. Only request components you will actually use." },
        { tool: "get_js_utilities", callAt: "Step 5 — THIRD call, after components", returns: "Pre-wired JavaScript: global state, CSV parser, Excel parser (SheetJS CDN), countUp animation, typewriter effect, tab switching, multi-select filter engine, drawer with focus management, file upload with drag-and-drop. Paste into <script> block, then implement renderDashboard()." },
        { tool: "get_shell_preservation_spec", callAt: "Step 5 — alternative to the 3-call flow above when you need the complete raw shell contract", returns: "Complete design tokens, frame CSS, sidebar HTML/CSS templates, ALL component pattern CSS blocks, HTML snippets, and section layout CSS in one response. Larger but comprehensive. Use when you need full control or are extending an existing shell." },
        { tool: "build_dashboard_blueprint", callAt: "Step 4 — after profiling the data locally", returns: "Schema-aware field-role mappings, metric recipes, chart plans, and uncertainty warnings tailored to the dataset's columns. Send only column metadata, never rows." },
        { tool: "get_data_insight_playbook", callAt: "Steps 2–3 — while profiling data and finding insights", returns: "Instructions for local data inspection, defensible metric calculation methods, and communicating uncertainty." },
        { tool: "get_dashboard_composition_playbook", callAt: "Step 5 — while designing the dashboard layout", returns: "Adaptive story structure, chart-selection guidance keyed by analysis question, section layout CSS, and visual hierarchy principles." },
        { tool: "get_dashboard_interaction_playbook", callAt: "Steps 6–7 — while implementing upload, filters, and interactivity", returns: "Upload/drop-zone, local CSV and Excel parsing, filter patterns, cross-filtering, drawers, responsive breakpoints, and accessibility requirements." },
        { tool: "get_dashboard_completion_checklist", callAt: "Step 8 — final review before delivery", returns: "Checklist covering data correctness, shell preservation, working interactions, responsive layout, and accessibility." },
      ],
    },
  };
}

# Layout & Hierarchy Rules — DashLint Rulebook

> Information hierarchy — what goes where, how the eye should travel,
> and the structural patterns from production dashboard projects.

---

## Page-Level Hierarchy

Many dashboards benefit from an inverted-pyramid reading order: a useful
summary appears early, with supporting detail later in the page or available
through navigation. The example below is one common structure, not a required
shell; adapt it to the task and host application.

```
┌─────────────────────────────────────────────────────────────────┐
│  Sidebar / Nav Rail       │  Header (Title + Data Source)       │
│  (240–280px, persistent,  ├─────────────────────────────────────┤
│   visually distinct from  │  Filter Strip (date range, scope,   │
│   content area)           │  category selects, export action)   │
│                           ├─────────────────────────────────────┤
│  • Dataset snapshot       │  Tab Navigation (segmented track)   │
│  • Key metric stack       ├─────────────────────────────────────┤
│  • Navigation links       │  KPI Row (hero numbers, 4–6 cards)  │
│  • Settings / config      ├──────────────────┬──────────────────┤
│                           │  Primary chart   │  Secondary chart │
│                           │  (wider panel)   │  or table        │
│                           ├──────────────────┴──────────────────┤
│                           │  Detail / drill-down area           │
│                           │  (tables, ranked lists, expanded)   │
└───────────────────────────┴─────────────────────────────────────┘
```

---

## Rules

### Visual Weight & Reading Order

- **R-LAYOUT-01**: Put the decision-relevant summary before supporting detail when that order serves the task. KPIs often belong above charts, but a map, alert, or primary workflow may deserve the lead position.
- **R-LAYOUT-02**: When filters apply globally across tabs, place them where users can find them before or alongside navigation. Local filters belong with the view they affect.
- **R-LAYOUT-03**: Give the most critical metric or action the strongest and earliest visual position; do not require a KPI row when KPIs are not central.

### Sidebar / Nav Rail

- **R-LAYOUT-04**: Use persistent navigation when the number of views or need for persistent context justifies it. A header, top nav, or focused single-view layout may be more appropriate. If used, a rail around 240–280px is a reference range, not a requirement.
- **R-LAYOUT-05**: If a sidebar is used, distinguish it from the workspace with contrast, spacing, or a border. A dark background is one option, not the default mandate.

### Grid System

- **R-LAYOUT-06**: Use asymmetric columns when one view deserves more space; choose one- or multi-column layouts based on content and viewport.
- **R-LAYOUT-07**: Keep card gaps and canvas padding consistent with the active spacing scale. `12px` is a useful reference value.
- **R-LAYOUT-08**: Give charts enough space for their marks and labels to remain readable. Around 180–200px is a useful starting point for many charts, not a universal minimum; small sparklines and compact charts are valid when detail is not required.

### Responsive Behavior

- **R-LAYOUT-09**: Collapse columns when the actual content no longer fits comfortably. Around 900–960px is a useful starting range, not a fixed breakpoint.
- **R-LAYOUT-10**: When a sidebar cannot fit, reflow or collapse navigation accessibly. Do not strand users without access to needed views.
- **R-LAYOUT-11**: Charts below minimum readable width should switch to a simplified view (fewer tick marks, hidden axis labels) rather than simply scaling down.

### Drawers & Overlays

- **R-LAYOUT-12**: When a slide drawer fits the drill-down task, opening from the right with width near `min(520px, 92vw)` is a useful default.
- **R-LAYOUT-13**: **Full-screen overlays** are for spatial or sustained-focus tasks with their own toolbar — geographic maps, multi-view analysis studios, flow network visualizations. Use them for work that needs its own dedicated context.
- **R-LAYOUT-14**: **Slide drawers** are for quick drill-downs that shouldn't lose the surrounding dashboard context — clicking a data point to see its details, inspecting a specific incident or agent.
- **R-LAYOUT-15**: Keep overlays visually distinct and readable against the host theme. A dark backdrop with a light drawer is one reference pattern.

### Tab Navigation

- **R-LAYOUT-16**: When tabs are appropriate, a segmented track (around 34px high) is one compact option. Make the active view clear and keyboard accessible.
- **R-LAYOUT-17**: Keep tab state and scroll position stable where practical. Rendering all hidden panels is optional; lazily render expensive views when that improves performance and preserves expected behavior.

---

## Interaction Patterns

- **R-INTERACT-01**: **Cross-filtering** (clicking a chart element filters other charts) is strongly recommended for multi-chart analytical dashboards. Not mandatory for single-purpose status views.
- **R-INTERACT-02**: Charts should be **interactive entry points** — clicking data points opens a drawer or navigates to a filtered view. But don't make decorative elements clickable with no real destination behind them.
- **R-INTERACT-03**: **Keyboard shortcuts** for overlay access and tab switching are a power-user accessibility nicety worth implementing, but not a core requirement. Document them when present (e.g., `1`–`7` for tabs, `Escape` to dismiss).

---

## Viewport & Scroll Policy

- **R-LAYOUT-18**: Prevent accidental clipping and horizontal overflow, but allow natural page/content scrolling when needed for readable analysis. Contain scrolling inside tables, drawers, or panels only when it improves usability. A fixed 100vh × 100vw frame is an optional host-app pattern, not a universal dashboard rule.

---

## Empty, Loading & Error States

- **R-STATE-01 (Loading UI)**: Prefer a stable, task-shaped loading state over a long blocking spinner. Animate KPI changes only when useful and respect reduced-motion preferences.
- **R-STATE-02 (Empty States)**: Keep the chart shell (axes, grid, card frame) visible and centered, and overlay a short, specific message (e.g., "No incidents in this range") instead of a decorative illustration or collapsing the card. Layout stability across states is critical; big illustrations visually compete with surrounding data. Always hint at active filters in the copy if applicable.
- **R-STATE-03 (Error States)**: Show actionable errors without crashing unrelated views. Isolate a failed data source or panel when it can fail independently; for a local file parse failure, report the problem and keep the upload/recovery path available.
- **R-LAYOUT-19 (Sidebar Necessity)**: A full sidebar may be more chrome than this dashboard needs. If there are few views and no persistent context, a header or top bar may fit better. This is a recommendation, not a hard error.

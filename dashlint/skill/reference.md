# DashLint — Complete Rule Reference

> Combined reference copy of the rulebook sources. Keep this file synchronized with those sources.

---

# Design Tokens — DashLint Rulebook

> Single source of truth for color, spacing, and typography rules
> derived from production React dashboard projects.

---

## Color System

### Core Canvas & Surfaces

| Token            | Value     | Usage                                    |
|------------------|-----------|------------------------------------------|
| `--bg`           | `#F2F4F7` | Application outer background canvas      |
| `--surface`      | `#FFFFFF` | Cards, panels, active tab pills          |
| `--surface-2`    | `#EEF0F4` | Tab tracks, subtle row bands, secondary buttons |
| `--surface-3`    | `#F8FAFC` | Filter inputs, date segments, table headers |
| `--ink`          | `#181C24` | Primary high-contrast body text          |
| `--muted`        | `#6B7280` | Secondary text, axis labels, sub-labels  |
| `--line`         | `#DDE1E9` | Card outlines, structural borders        |
| `--line-strong`  | `#BCC2CE` | Focused inputs, dashed upload borders    |
| `--accent`       | `#4B5563` | Interactive highlights — deliberately neutral gray, not a brand hue. Prevents distraction from data. Note: if your project has a real brand color, replace this token but keep it subdued. |
| `--accent-dim`   | `rgba(75, 85, 99, 0.10)` | Accent background tints   |

### Status Colors (Semantic)

| Token        | Value     | Dim Variant                    | Usage                                      |
|--------------|-----------|--------------------------------|--------------------------------------------|
| `--ok`       | `#1A7A56` | `rgba(26, 122, 86, 0.09)`     | SLA met, resolved, FCR, positive KPIs      |
| `--warn`     | `#B45309` | `rgba(180, 83, 9, 0.09)`      | Approaching threshold, moderate priority   |
| `--err`      | `#C0392B` | `rgba(192, 57, 43, 0.06)`     | SLA breach, critical P1, errors            |

### Dark Overlay Theme (Scoped)

Use this palette **only** for immersive full-screen views (geographic maps,
focused analysis overlays, command-center modes) — not as a generic dark mode
for every dashboard.

| Token        | Value     | Usage                              |
|--------------|-----------|------------------------------------|
| `--surface`  | `#151515` | Overlay / command-center backdrop  |
| `--surface-2`| `#1a1a19` | Secondary dark surface             |
| `--line`     | `#20201f` | Dark-mode borders                  |
| `--ink`      | `#f0f0f0` | Light text on dark background      |
| `--muted`    | `#9aa3af` | De-emphasized text on dark         |

### Chart Color Sequences

**Ordered categorical palette** — the same category must map to the same
color everywhere it appears across the dashboard. Consistency builds trust.

| Position | Hex       | Name    |
|----------|-----------|---------|
| 1        | `#2563eb` | Blue    |
| 2        | `#0d9488` | Teal    |
| 3        | `#16a34a` | Green   |
| 4        | `#d97706` | Amber   |
| 5        | `#7c3aed` | Purple  |
| 6        | `#db2777` | Pink    |
| 7        | `#ea580c` | Orange  |
| 8        | `#0284c7` | Cyan    |
| 9        | `#4f46e5` | Indigo  |
| 10       | `#059669` | Emerald |
| 11       | `#65a30d` | Lime    |
| 12       | `#ca8a04` | Gold    |
| 13       | `#c026d3` | Fuchsia |
| 14       | `#e11d48` | Rose    |

**Sequential heatmap ramp** (intensity data):

| Tier     | Value                    | Range     |
|----------|--------------------------|-----------|
| Empty    | `rgba(255,255,255,0.04)` | 0%        |
| Low      | `#1e3a8a`                | 1–25%     |
| Mid      | `#2563eb`                | 26–50%    |
| High     | `#38bdf8`                | 51–75%    |
| Peak     | `#bae6fd`                | 76–100%   |

### Rules

- **R-COLOR-01**: Cap distinct hues at **6–8 when the viewer must cross-reference a legend**. Up to 14 colors is acceptable only when categories are directly labeled on or next to the chart, not legend-dependent.
- **R-COLOR-02**: Status colors (`--ok`, `--warn`, `--err`) must pass WCAG AA contrast (4.5:1) against `--surface`. Color is never decorative — red is reserved for critical/breach states, green for positive/met states, amber for warnings.
- **R-COLOR-03**: Chart backgrounds should be transparent or use the active system's canvas/surface token; avoid a hardcoded white background that conflicts with the surrounding theme.
- **R-COLOR-04**: The same category must map to the same palette position across every chart on the dashboard. Use the ordered categorical palette, not random color assignment.

---

## Spacing System

The spacing scale as observed across production projects. Not a strict 8px
grid — a practical scale built around content needs:

| Token         | Value    | Usage                                    |
|---------------|----------|------------------------------------------|
| `--space-2xs` | `4px`    | Micro-gaps, badge padding                |
| `--space-xs`  | `6px`    | Tight internal spacing                   |
| `--space-sm`  | `8px`    | Inline element gaps, icon margins        |
| `--space-md`  | `10px`   | Between related elements within a card   |
| `--space-base`| `12px`   | App canvas padding, grid gaps between cards |
| `--space-lg`  | `14px`   | Card internal padding (horizontal)       |
| `--space-xl`  | `16px`   | Panel/card internal padding, section spacing |

### Border Radius Scale

| Token           | Value   | Usage                                 |
|-----------------|---------|---------------------------------------|
| `--radius-micro`| `2–3px` | Heat map cells, badge tags, progress tracks |
| `--radius-sm`   | `4px`   | Buttons, form controls, tab pills     |
| `--radius-md`   | `5–6px` | Cards, KPI containers, input fields   |
| `--radius-lg`   | `8px`   | Panels, sidebar rail, header, overlays |
| `--radius-xl`   | `10px`  | Modals, lab/studio windows            |
| `--radius-full` | `99px`  | Status pills, floating toasts, chart dots |

### Component Height Standards

| Element                         | Height   |
|---------------------------------|----------|
| Primary action button           | `36px`   |
| Standard / filter button        | `32px`   |
| Compact select / filter input   | `28–30px`|
| Light-mode tabs                 | `34px`   |
| Dark-mode overlay tabs          | `38px`   |
| Header CSV dropzone             | `56–68px`|

### Rules

- **R-SPACE-01**: Card internal padding is `12–16px` — never zero, never more than `20px`.
- **R-SPACE-02**: Grid gap between dashboard cards is `12px`.
- **R-SPACE-03**: Minimum internal chart margin (space between card border and chart SVG/canvas) is `12px` on all sides. Chart-touching-card-edge is a common AI-generated-UI failure.
- **R-SPACE-04**: Custom scrollbars are `5px` wide with `4px` thumb radius. Don't use browser-default scrollbars in dashboard panels.

---

## Typography System

### Principle

Use a **dual-font pairing**: a sans-serif family for prose, labels, and
headings; a monospace or tabular-figure family for all numeric/data values.
This isn't about specific font names — it's about ensuring that KPI numbers,
table cells, and chart labels use tabular figures that align cleanly and don't
jitter during animations.

**Reference implementation**: `Inter` (sans) + `IBM Plex Mono` (data/numbers).

| Token            | Spec                                          | Usage                         |
|------------------|-----------------------------------------------|-------------------------------|
| `--font-sans`    | `'Inter', -apple-system, 'Segoe UI', sans-serif` | Headers, labels, prose     |
| `--font-mono`    | `'IBM Plex Mono', 'Consolas', monospace`       | KPI values, table data, axis labels |
| `--text-h1`      | `18–22px`, weight `700`, tracking `-0.02em`   | Page title                    |
| `--text-h2`      | `14–15px`, weight `700`                       | Overlay / section heading     |
| `--text-panel`   | `10.5px`, mono, weight `700`, tracking `0.07em`, uppercase | Panel/card title |
| `--text-kpi`     | `clamp(20px, 2.2vw, 30px)`, mono, weight `700`, tracking `-0.02em` | Hero KPI numbers |
| `--text-kpi-sub` | `10–11px`, mono, weight `500–600`             | Card sub-metrics              |
| `--text-body`    | `13px`, sans, weight `400`                    | Body copy                     |
| `--text-label`   | `8.5–9.5px`, mono, weight `600–700`, uppercase, tracking `0.08em` | Kickers, micro-labels |
| `--text-caption` | `9.5–10px`, mono                              | Axis labels, table cells      |

### Rules

- **R-TYPE-01**: All numeric data displays (KPI values, table cells, chart axis labels, badges) must use a monospace or tabular-figure font (`font-variant-numeric: tabular-nums`). This prevents digit-width jitter during animation and ensures columnar alignment.
- **R-TYPE-02**: Hero KPI numbers use fluid, clamped sizing (e.g., `clamp(20px, 2.2vw, 30px)`) — never a fixed `px` value. The exact clamp formula is a reference, not a mandate.
- **R-TYPE-03**: Chart axis labels use the caption size (`9.5–10px`), never bold. Axes are supporting context, not primary data.
- **R-TYPE-04**: Panel/card titles use uppercase mono at `10.5px` with wide letter-spacing (`0.07em`) — this creates visual separation from the data below without competing for attention.

---

# Chart Selection Rules — DashLint Rulebook

> Data shape → chart type mapping derived from production dashboards.
> These are **data-driven defaults, not hard bans** — document *why* each
> choice fits so the agent reasons about context, not a fixed lookup table.

---

## Decision Matrix

| Data Shape                                    | Default Chart             | Avoid (and why)                                    | Rationale                                                                                     |
|-----------------------------------------------|---------------------------|----------------------------------------------------|-----------------------------------------------------------------------------------------------|
| Single KPI value (e.g., MTTR, open count)     | Mono number in card with animated count-up | Gauge, dial, speedometer — adds chart chrome to a single number | A large typographic number is the fastest read. AnimatedNumber count-up provides transition context. |
| KPI value + trend over time                   | KPI card with inline SVG sparkline/area    | Full-size chart for a secondary trend              | The trend is supplementary to the number — keep it small, no axis labels needed.               |
| Categorical breakdown (≤ 8 categories)        | Horizontal bar chart                       | Vertical bars (unless categories are time-ordered) | Horizontal bars accommodate long text labels and are easier to compare by length.              |
| Categorical breakdown (> 8 categories)        | Horizontal bar, top 8 + "Other" group      | Showing all 12+ categories ungrouped               | Beyond ~8 categories, the cognitive load exceeds the insight. Group the tail into "Other".     |
| Time series – single metric                   | Line chart (or area for volume data)       | Bar chart for time data                            | Lines emphasize continuity and trend; bars imply discrete buckets.                             |
| Time series – multi-metric comparison         | Overlapping line/spline curves             | Stacked area (obscures individual trends)          | Overlapping lines allow direct comparison of each series against the same baseline.            |
| Part-to-whole (2–3 segments)                  | Stacked ratio bar (horizontal)             | Pie chart                                          | A single stacked bar shows proportions accurately with direct segment labels.                  |
| Part-to-whole (4–5 segments)                  | Stacked horizontal bar                     | Pie chart — comparison across >3 slices is unreliable on a circle | Length-based comparison is more accurate than angle-based for 4+ segments.       |
| Part-to-whole (> 5 segments)                  | Grouped or small-multiples bars            | Stacked anything — too many segments lose readability | When the total has many components, decompose into individual comparisons.                   |
| Distribution / histogram                      | Vertical bars (24-bar density)             | Line chart for binned data                         | Bars correctly represent discrete bins; vertical because the x-axis is naturally ordered.      |
| Ranked list (top N)                           | Horizontal bar chart, capped at top 8–10   | Table-only (loses visual comparison)               | Bars provide instant visual ranking; cap prevents information overload.                        |
| Geographic data                               | Choropleth + cluster bubbles               | Bar charts that lose spatial context               | Location data needs a map. Cluster bubbles handle point density.                              |
| SLA compliance (target vs actual)             | Horizontal fill bar with threshold marker  | Pie/donut for compliance %                         | A fill bar against a threshold line is the most intuitive "are we there?" read.                |
| Multi-stage flow / transitions                | Alluvial / Sankey diagram                  | Using it for non-flow data                         | High cognitive load — reserve for reassignment corridors, funnel movement, or stage transitions. Reach for it deliberately, not often. |
| Date × Hour intensity                         | CSS grid heatmap                           | Scatter plot, bubble chart                         | Grid heatmaps show 2D density patterns with position encoding; familiar calendar-like layout.  |
| Network relationships                         | Node-link graph with directed edges        | Table of connections                               | Relationship topology is invisible in tabular form.                                            |

---

## Hard Rules

- **R-CHART-01**: **Pie charts are a strong default-avoid, not a ban.** Comparison across slices is harder on a circle than on a length-based chart. The agent can reach for a pie in a genuinely fitting edge case (exactly 2 segments, binary split), but must justify it explicitly.
- **R-CHART-02**: Time-series data defaults to a line or area chart, not bars. Exception: when the x-axis represents discrete, non-continuous categories that happen to be time-ordered (e.g., "Q1 vs Q2" as categorical, not a continuous timeline).
- **R-CHART-03**: Horizontal bars are the default for categorical comparisons, especially with text labels. Vertical bars are acceptable when the categories are inherently time-ordered (months, quarters) where left-to-right reads as chronology.
- **R-CHART-04**: Group into "Other" above ~8 categories. Show all categories directly only when the total is ≤ 10.
- **R-CHART-05**: Every chart must have a **title**. Axis labels: required when the value isn't self-evident (a KPI sparkline doesn't need them). Tooltips: required whenever exact values matter and aren't already shown as direct on-chart labels.
- **R-CHART-06**: Stacking is appropriate only for true part-to-whole data with ≤ 5 segments where the total itself is meaningful. Prefer grouped bars or small-multiples layouts otherwise.
- **R-CHART-07**: Dual-axis charts are a default-avoid — they're one of the more reliably misleading chart patterns. Allow as a documented exception only when both series are directly labeled and the scales genuinely require separate axes.

---

## Animation Policy

- **R-CHART-08**: Animate on **initial load** and on **data change** — not on every re-render.
- **R-CHART-09**: Respect `prefers-reduced-motion`. When reduced motion is preferred, skip transitions and show the final state immediately.
- **R-CHART-10**: KPI count-up animations use exponential deceleration easing (e.g., `1 - Math.pow(2, -10 * progress)` via `requestAnimationFrame`).

---

## Charting Library Stance

**Library-agnostic.** DashLint does not prescribe a specific charting library.
The deeper principle: **don't ship a charting library's stock default look.**
Tune each chart to its actual dataset — axis ranges, tick counts, color
mapping, label formatting, tooltip content. The real reason production
dashboards often use custom SVG isn't "avoid Recharts" — it's that stock
defaults rarely match the data's needs without significant customization.

Use whatever library fits your stack, but:
- Override default padding, colors, and font sizes to match your design tokens
- Don't rely on auto-generated axis ranges — set explicit domains
- Custom tooltips are almost always necessary; default tooltips are rarely sufficient

---

## Anti-Patterns

1. **Pie chart for > 3 categories** — angles are harder to compare than lengths. Switch to horizontal bars.
2. **Vertical bars for text categories** — labels either rotate (unreadable) or truncate. Use horizontal bars.
3. **Stacked area for multi-series comparison** — earlier series obscure later ones. Use overlapping lines.
4. **Stock library defaults** — auto-generated axis ticks, default tooltips, and generic color palettes signal "no one designed this."
5. **Dual Y-axis without explicit labeling** — suggests a correlation that may not exist. Misleads more often than it informs.

---

# Chart Rendering Rules

> Visual geometry, stroke weights, corner radii, and element spacing should fit the active design system.
> These are practical defaults; use existing CSS tokens when available and do not depend on an unavailable design-system API.

---

## Rules

- **R-RENDER-01 (Line & Area Stroke and Endpoint Dot Rendering)**: Keep line weight and point markers legible at the chart's rendered size and consistent with the chosen visual system. Use existing border/radius tokens when available; avoid oversized markers that compete with the data.
- **R-RENDER-02 (Bar Corner Radius)**: Keep bar corners consistent with the active design system. Use crisp or modestly rounded ends; cap the radius at half the bar's thickness so bar lengths remain easy to compare.
- **R-RENDER-03 (Bar and Chart Gap Spacing)**: Use consistent gaps between bars, groups, and chart elements. Follow the active spacing scale when one exists; fixed values are acceptable when chosen for the specific chart and applied consistently.
- **R-RENDER-04 (KPI Sparkline Rendering)**: Inline KPI sparklines should remain subordinate to the KPI value. Omit axes and labels when they add no meaning; use subtle area fills and enough contrast to distinguish the trend.
- **R-RENDER-05 (Pictogram Square Styling)**: For pictogram/unit charts, keep cell size, gap, radius, and outline consistent and make the represented unit or denominator clear.
- **R-RENDER-06 (Small Multiples Fixed Axis Scale)**: Use comparable axis scales across small multiples when viewers are comparing magnitude. Independent scales are acceptable when the goal is to compare within-panel shape, but label this choice clearly and avoid implying direct magnitude comparison.

---

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

---

# Insight Presentation Rules — DashLint Rulebook

> How to frame data findings so the dashboard tells a story,
> not just displays numbers. These rules are structural and
> informational — they apply regardless of visual theme and
> don't reference any specific rendering library or color.

---

## Rules

- **R-INSIGHT-01**: **Chart and KPI titles must state a finding, not describe an axis.** "Claude now leads 26% of model R&D work" not "Model R&D Automation Over Time." If the title could apply to any dataset of that chart type without changing a word, it's failing this rule.
- **R-INSIGHT-02**: **When one specific data point is the reason the chart exists** (a headline stat, a threshold crossing), **annotate it directly on the chart** with a callout/leader line restating the number — don't rely solely on a legend or hover tooltip to convey it.
- **R-INSIGHT-03**: **When the underlying value is an estimate, forecast, or survey-based figure** (not a hard count), **show the uncertainty range** — error bars, a shaded band, or an explicit footnote of the interval — rather than presenting a single point value as exact.
- **R-INSIGHT-04**: **For "N out of every X" or share-of-total framing**, consider a unit/pictogram chart (a grid of repeated icons/squares, each a fixed quantum) instead of a percentage alone. This is a recommendation, not a hard validation rule.
- **R-INSIGHT-05**: **When comparing multiple scenarios/what-ifs against the same metric**, use small multiples (same chart type, same axis scale, one panel per scenario) rather than overlaying everything into one dense chart.

---

# Before / After Examples — DashLint Rulebook

> Illustrative scenarios showing common violations and context-aware fixes.
> Adapt them to the actual data and user's task.

---

## Example 1: Too many categories in a pie chart

### ❌ Before (R-CHART-01)

A pie chart shows twelve incident categories. Small slices are difficult to
compare, and the legend forces repeated eye travel.

### ✅ After

Use a sorted horizontal bar chart for the most important categories, with a
meaningful "Other" group when the long tail can be combined. Keep counts and
the denominator visible. If every category matters, use a searchable table.

**Rules applied**: `R-CHART-01`, `R-CHART-04`

---

## Example 2: A no-scroll rule makes charts unreadable

### ❌ Before (R-LAYOUT-18)

Several useful views are squeezed into one viewport. Charts become too small,
labels are truncated, and the detail table is hidden behind extra controls.

### ✅ After

Keep a concise summary near the top, then let the page scroll naturally. Use
tabs, drawers, or overlays only when they help users switch tasks or inspect
details. Do not remove useful evidence just to avoid scrolling.

**Rules applied**: `R-LAYOUT-06`, `R-LAYOUT-08`, `R-LAYOUT-18`

---

## Example 3: A date field triggers an unnecessary calendar suite

### ❌ Before (R-LAYOUT-18)

The source contains a date column, so the dashboard adds day/week/month
switches, monthly cards, a calendar, a date drawer, and multiple exports even
though the user only asked for an overall comparison.

### ✅ After

Check whether the date is meaningful, what its grain and coverage are, and
whether time patterns answer the question. If not, omit the temporal suite. If
time matters, add the simplest useful trend or period comparison first.

**Rules applied**: `R-CHART-02`, `R-LAYOUT-18`

---

> These scenarios illustrate tradeoffs, not rigid prescriptions. Apply the
> reasoning when the data and task match.

---

# Design Systems

This layer describes how to keep a selected visual identity internally consistent. DashLint MCP currently provides optional reference tokens and design guidance; it does not expose `list_design_systems`, `get_design_system`, or a design-system validator. Preserve an existing product system when available. For a new dashboard, use one coherent palette and type/spacing scale; selection can be made from the user's brief and references without a separate approval step.

## Rules

- **R-DESIGN-01 (Chart Colors Consistent)**: Keep chart colors within the chosen palette and map the same category consistently across views.
- **R-DESIGN-02 (Background/Surface Match)**: Use background and surface colors that belong to the same visual system, with enough contrast for text and chart marks.
- **R-DESIGN-03 (Typography Stack Match)**: Use a consistent type system for headings, labels, body copy, and numeric values; preserve the host app's fonts when present.
- **R-DESIGN-04 (Contextual Style Choice)**: Match an existing product style when extending it. In a new dashboard, choose a sensible coherent default and continue unless the user's preference is materially ambiguous; do not block implementation for routine token choices.

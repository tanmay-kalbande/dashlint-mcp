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

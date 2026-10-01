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

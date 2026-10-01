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

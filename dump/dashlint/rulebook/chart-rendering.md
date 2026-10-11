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

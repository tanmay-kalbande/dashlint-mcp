# React Component Analysis

## 1. AlertsBanner
- **Component Name**: AlertsBanner
- **Purpose & Use Case**: Displays a dismissible banner showing predictive operational alerts (like system issues or high call volumes) across the top of the UI.
- **Props & State**: Uses component state `isCollapsed` (boolean) to track its open/close status. Context: uses `useData` for `scopedRows` and `activeColumns`.
- **Visual/Design Details**: Container uses `.alerts-banner.has-alerts` classes and dynamically appends `.collapsed`. The header (`.alerts-banner-header`) contains a title with a lightning bolt icon `⚡`. The body shows individual alerts with conditional color classes like `alert-red` or `alert-amber`.

## 2. AnalyticsOverlay
- **Component Name**: AnalyticsOverlay
- **Purpose & Use Case**: Serves as the primary full-screen overlay for the analytics dashboard. Contains the top navigation and tab routing for different analysis views like Insights, Days, Agents, Queues, and Patterns.
- **Props & State**: Context: uses `useUI` for properties like `isAnalyticsOpen`, `activeAnalyticsTab`, and methods to toggle them. Uses `useRef` to auto-scroll to the top when a user changes tabs.
- **Visual/Design Details**: Uses `.analytics-overlay` with an `.open` modifier for visibility. The topbar contains the `ScopeFilterBar`, a logo, and a close button. Navigation uses `<nav className="analytics-tabs">` with `.a-tab` buttons (active state uses `.active`). Rendered tab content is placed in `.analytics-body`.

## 3. ScopeFilterBar
- **Component Name**: ScopeFilterBar
- **Purpose & Use Case**: Provides a dropdown filter for users to select reporting periods (specific months or all data) inside the analytics view.
- **Props & State**: Context: uses `useData` for `rows`, `scopeFilter`, `scopedRows`. Uses `useMemo` to extract and sort available months dynamically from the full dataset.
- **Visual/Design Details**: Uses a `.date-filter-strip` container. It features an SVG calendar icon, a native HTML `<select>` styled with `.scope-bar-select`, and a `.period-info-badge` that includes a `.period-pulse-dot` to indicate the current dataset size.

## 4. AgentDrawer
- **Component Name**: AgentDrawer
- **Purpose & Use Case**: A slide-out drawer providing detailed performance metrics for a specific agent. Includes KPI summaries, daily activity tables, queue distributions, and export capabilities.
- **Props & State**: Context: uses `useData` for active row data and `useUI` for `selectedAgentName`. Computes various metrics locally using `useMemo` (e.g. handle time, hold time, SLAs).
- **Visual/Design Details**: Features a dark `.drawer-overlay`. The main panel is `.agent-drawer.open`. The header includes the agent's name, download buttons (`.lb-dl-btn`), and a `.drawer-kpis` grid. The body (`.drawer-body`) breaks data into `.drawer-section` elements containing a `.day-table` and custom `.bar-row` distributions colored via `MULTI_PALETTE`.

## 5. AgentsTab
- **Component Name**: AgentsTab
- **Purpose & Use Case**: The main tab component for viewing aggregate agent performance. Displays an overview table of all agents alongside bar charts for Average Handle Time (AHT) and SLA Compliance.
- **Props & State**: Context: uses `useData` for dataset and `useUI` to trigger the `AgentDrawer`. No local state; all grouping metrics are derived.
- **Visual/Design Details**: Employs an `.insights-grid` layout wrapping multiple `.insight-panel` cards. Features a tabular list with `.clickable-row` classes and colored pill badges (`.pill.ok`, `.pill.warn`). Bar charts are constructed using `.bar-row`, `.bar-label`, `.bar-track`, and `.bar-fill` classes.

## 6. DailyGosPanel
- **Component Name**: DailyGosPanel
- **Purpose & Use Case**: A drill-down drawer panel focused on daily Grade of Service (GOS). It provides a Table view, a Calendar view, and a line chart to analyze day-by-day and month-to-date performance.
- **Props & State**: Component state: `currentMonthKey`, `viewMode` (table or calendar), and `showTrendLabels`. Context: uses `useData` and `useUI` (to open specific day drawers).
- **Visual/Design Details**: Structured as `.agent-drawer.day-drawer`. Features a view toggle (`.view-toggle`). The table uses `.day-table`. The calendar uses a custom `.cal-grid` and `.cal-cell` layout. The trend chart is a custom native `<svg>` plotting gridlines and a `polyline` for cumulative GOS.

## 7. DayComparator
- **Component Name**: DayComparator
- **Purpose & Use Case**: A utility widget allowing users to select two specific dates to compare key performance metrics side-by-side with calculated deltas. Used inside the Days tab.
- **Props & State**: Component state: `dayAKey`, `dayBKey` (string keys for the selected days). Context: uses `useData`.
- **Visual/Design Details**: Housed in a `.insight-panel.full`. Selectors are wrapped in `.comp-select-group` separated by a `.comp-vs` label. The data grid uses `.comp-grid` and `.comp-metric-row`, displaying the deltas using directional arrows and conditional classes like `.improved`, `.declined`, and `.neutral`.

## 8. DayDrawer
- **Component Name**: DayDrawer
- **Purpose & Use Case**: A highly detailed interactive intraday analysis panel for a single selected day. Shows KPIs, SLA misses breakdown, active agents, and an interactive hourly GOS progression chart.
- **Props & State**: Component state: `selectedHourIdx` (number | null) and `hoverTooltip` for the interactive chart. Context: `useData` and `useUI`.
- **Visual/Design Details**: Uses `.agent-drawer.day-drawer`. The header contains a large `.drawer-kpis` grid. Visualizes SLA root causes via a stacked meter `.rc-meter-track`. Features a complex native SVG chart (`.cum-gos-svg`) plotting cumulative GOS, alongside hourly bar charts (`.hourly-gos-chart`, `.hourly-miss-chart`). A highly detailed interactive intraday view.

## 9. DaysTab
- **Component Name**: DaysTab
- **Purpose & Use Case**: The primary tab for daily performance analysis. Shows a month overview summary, a table of all days with key metrics, and embeds the `DayComparator`.
- **Props & State**: Context: uses `useData` for data access and `useUI` to trigger the `openDayDrawer` function. Uses `useMemo` for day grouping.
- **Visual/Design Details**: Organized in an `.insights-grid`. Contains an overview summary `.insight-panel.full` and a `.day-table` listing performance per day. Uses `.clickable-row` for interactions and colored `.pill` badges for status indicators (e.g. SLA ok/warn/err).

## 10. AbandonPatience
- **Component Name**: AbandonPatience
- **Purpose & Use Case**: Analyzes caller abandonment behavior. Shows how long callers wait before hanging up (bucketed patience curve) and median patience per queue. Helps identify "rescuable" abandons.
- **Props & State**: Context: uses `useData`.
- **Visual/Design Details**: Wrapped in `.insight-panel.full`. Displays four `.mini-kpi` stats at the top. The "Patience Curve" is rendered using a custom `.patience-bars` container with `.patience-col` bars sized dynamically based on wait thresholds. Queue median patience uses horizontal `.bar-row` elements.

## 11. BreachRCA
- **Component Name**: BreachRCA
- **Purpose & Use Case**: Performs Root-Cause Analysis on SLA Breaches (Handled Late vs Abandoned Late). Provides deep-dives into breaches by Queue, Disconnect Reason, Agent, and Hour. Includes local time/date range filters.
- **Props & State**: Component state: `fromDate`, `fromTime`, `toDate`, `toTime`, and `appliedFilter` object. Context: uses `useData`.
- **Visual/Design Details**: Includes `.range-filter.rca-filter` for filtering. An `.rc-card` with `.rc-meter-track` shows the split between late answers and late abandons. Renders four `.insight-panel` widgets utilizing horizontal `.bar-row` components. Employs an `.hm-insight` callout explaining the primary breach driver.

## 12. Heatmap
- **Component Name**: Heatmap
- **Purpose & Use Case**: Visualizes call volume by Date/Day-of-Week versus Hour of Day using a colored grid (heatmap). Helps identify peak call times to optimize agent staffing.
- **Props & State**: Component state: date/time range filters (`fromDate`, `fromTime`, `toDate`, `toTime`, `appliedFilter`). Context: uses `useData`.
- **Visual/Design Details**: Renders a `.heatmap-grid` with `.hm-cell` grid items. Uses shades of blue for cell backgrounds (calculated via a `heatColor` helper function based on normalized volume). The highest volume slot is styled with `.hm-peak` and explained in an `.hm-insight` box.

## 13. InsightsTab
- **Component Name**: InsightsTab
- **Purpose & Use Case**: A top-level wrapper tab component inside the AnalyticsOverlay that renders the main insights views by mounting multiple components. It acts as the dashboard homepage.
- **Props & State**: None. Strictly a structural wrapper component.
- **Visual/Design Details**: Uses the `.insights-grid` layout to contain the other nested panels (Leaderboard, Heatmap, BreachRCA, AbandonPatience, TransferAnalysis, ServiceLevel).

## 14. Leaderboard
- **Component Name**: Leaderboard
- **Purpose & Use Case**: Displays top performing agents across three distinct categories: Most Calls Handled, Best All-Rounders, and Coaching Priorities. Gives actionable insights per agent and an expandable list to view a full agent report.
- **Props & State**: Component state: `showAll` boolean to toggle the full list. Context: uses `useData` and `useUI` to open agent drawers.
- **Visual/Design Details**: Contained in `.insight-panel.full`. Employs an `.lb-columns` grid that displays three columns (`.lb-col`). Uses `.lb-row` to display agent ranks (with medal emojis), names, and scores, along with tags (`.lb-tag`) for specific coaching needs. Expanding `showAll` reveals an `.all-agent-table`.

## 15. ServiceLevel
- **Component Name**: ServiceLevel
- **Purpose & Use Case**: Breaks down queue answer wait times into intervals (e.g., 0-5s, 5-10s) and analyzes SLA near-misses. Includes a sensitivity grid demonstrating hypothetical SLA threshold impacts.
- **Props & State**: Context: uses `useData`.
- **Visual/Design Details**: A full-width `.insight-panel.full`. Interval buckets are displayed using a `.bucket-grid` containing seven `.bucket-card` items. Near-miss callout is styled via `.hm-insight`. The sensitivity matrix uses a `.sensitivity-grid` showing `.sens-card` elements (with `.sens-active` for the current config).

## 16. TransferAnalysis
- **Component Name**: TransferAnalysis
- **Purpose & Use Case**: Detects and analyzes call transfers (using conversationId) and repeat callers (using phone numbers/remote). Shows transfer chain lengths and caller frequency to identify friction.
- **Props & State**: Context: uses `useData`.
- **Visual/Design Details**: Renders four `.mini-kpi` boxes for top-level stats. Displays distributions using horizontal bar charts (`.bar-row`) for chain length buckets (e.g. 2 agents, 3 agents, 4+ agents) and caller frequency buckets.

## 17. PatternsTab
- **Component Name**: PatternsTab
- **Purpose & Use Case**: Displays performance trends spanning across time and types: Calls by Hour, Handle Time Buckets, Media Mix, and Day-of-Week Patterns.
- **Props & State**: Context: uses `useData`.
- **Visual/Design Details**: Uses the standard `.insights-grid`. Features a custom bar chart layout `.hourly-wrap` with `.h-bar-col` columns, stacked for handled vs abandoned calls. Uses a `.bucket-grid` for handle time distribution and `.bar-row` for Media type mix. The Day-of-Week pattern table uses a custom `.dow-grid` with `.dow-cell` coloring.

## 18. QueuesTab
- **Component Name**: QueuesTab
- **Purpose & Use Case**: A comprehensive queue performance dashboard. Shows total volume, abandon rate, avg wait time, disconnect reasons, hold time intelligence, contacting (ring) time, and a final summary table.
- **Props & State**: Context: uses `useData`.
- **Visual/Design Details**: Housed in an `.insights-grid`. Contains multiple `.insight-panel` blocks. The Disconnect Reasons panel visualizes data using a custom SVG donut chart (`.donut-wrap` with `.donut-legend`). Other panels use standard horizontal `.bar-row` tracks. Concludes with a `.day-table` listing all queue metrics.

## 19. HealthBar
- **Component Name**: HealthBar
- **Purpose & Use Case**: A simple progress bar component displaying a single overarching Operational Health score out of 100, broken down by GOS, Abandon, AHT, and Hold compliance.
- **Props & State**: Context: uses `useData` (reads `summary.health`).
- **Visual/Design Details**: Uses `.health-bar-wrap` as the container. A header shows the numerical score. The bar itself is constructed using `.health-bar-track` and `.health-bar-fill`. The bottom legend (`.health-bar-breakdown`) lists individual sub-metrics using colored dots (`.health-bar-dot`).

## 20. KPICard
- **Component Name**: KPICard
- **Purpose & Use Case**: A reusable generic KPI card component used to display a metric, a label, and a sub-label. It implements an animated 'CountUp' effect for number transitions.
- **Props & State**: Props include `id`, `label`, `value`, `sub`, `clickable`, `onClick`, and `isDate`. Internally uses `useState` and `useEffect` with `requestAnimationFrame` for number interpolation.
- **Visual/Design Details**: Styled with the `.kpi` class, with an optional `.clickable` modifier for cursor styles. Inner elements include `.kpi-label`, `.kpi-value`, and `.kpi-sub`.

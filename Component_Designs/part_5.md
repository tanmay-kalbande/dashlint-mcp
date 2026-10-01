# Component Designs - Part 5

## 1. ClassificationGrid
- **Purpose & Use Case**: Displays top categorizations (categories, subcategories, channels, RCAs, resolution codes, CIs) to provide a high-level view of ticket classifications. Used in the Categories & RCA tab.
- **Props & State**: No props. Uses `useIncidentContext` to consume `filteredIncidents` and compute the top 8 items for each category (`topCats`, `topSubcats`, etc.).
- **Visual/Design**: A 3x2 grid layout containing 6 ranking panels. Data is visualized using horizontal bars with width relative to the max value, using specific color palettes (`AGING_PALETTE`, `AGING_CHANNEL_PALETTE`). Each row is clickable to filter incidents in the Explorer.

## 2. SankeyFlow
- **Purpose & Use Case**: Visualizes the flow of incidents through 3 customizable dimensions (e.g., Category → Group → Root Cause) using an interactive Sankey/alluvial flow diagram. Used in the Categories & RCA tab.
- **Props & State**: 
  - **Props**: `topN` (number), `activeKeys` (array of 3 dimension keys), `highlightNode` (string), `onHighlightNode` (callback), `currentPreset` (string).
  - **State**: `containerWidth` for responsive SVG sizing, `hoveredLink` for link highlighting, and `tooltip` for floating data labels.
- **Visual/Design**: A custom SVG-based Sankey chart with nodes (rectangles) and flowing links (cubic bezier paths). Links use linear gradients blending the start and end node colors. The UI includes a telemetry strip at the top, a floating tooltip, and a legend at the bottom. Colors are sourced from a predefined `SANKEY_PALETTE` and priority-specific colors.

## 3. TemplatesPanel
- **Purpose & Use Case**: Displays standard ticket templates and "Smart Master Clusters" (merged similar templates) to identify recurring issues. Used in the Categories & RCA tab.
- **Props & State**: No props. State includes `clusterMode` ('raw' or 'smart'), `isExpanded` (boolean for pagination), `selectedCluster` (for modal details), and `templateToAdd`.
- **Visual/Design**: Features a segmented toggle to switch between exact templates and smart clusters. Uses horizontal bar charts (`hbar-row-cluster`). Contains a detailed modal overlay when a cluster's "Linkage" is clicked, which presents 3 KPI cards (Total, Connected Templates, SLA Rate) and a data table of underlying templates.

## 4. ExecutiveOverview
- **Purpose & Use Case**: Container for the Executive Overview tab. Wraps the KPI grid and the AI-generated operational update.
- **Props & State**: No props.
- **Visual/Design**: Simple CSS grid layout with two columns (`grid-template-columns: minmax(400px, .9fr) minmax(460px, 1.1fr)`), filling the workspace height.

## 5. GeneratedOutput
- **Purpose & Use Case**: Auto-generates and displays a text-based executive summary (briefing) of the operational incident metrics. Used on the Executive Overview tab.
- **Props & State**: No props. State includes `displayText`, `isTyping`, and `copied`. Uses refs to manage typing/streaming timers and textarea scrolling.
- **Visual/Design**: Presents as a read-only `<textarea>` with an auto-typing animation effect that mimics human typing cadence (pauses at periods, commas, newlines). Includes a copy button, a "Calculation rules" details block, and bottom action buttons (Flow, Insights, Analyze data, Locations).

## 6. KPIGrid
- **Purpose & Use Case**: Displays high-level Key Performance Indicators (KPIs) and breakdowns (State, Priority, Callers). Used in the Executive Overview tab.
- **Props & State**: No props. State includes `view` ('kpi' or 'dist') to toggle between modes.
- **Visual/Design**: Header includes a segmented control. 
  - **KPI View**: Grid of clickable KPI tiles with `AnimatedNumber` values (Total, Open, MTTR, SLA, Unique Callers, Avg Age) and validation checkboxes at the bottom.
  - **Breakdown View**: A 3-section vertical layout containing horizontal bar charts for State Breakdown, Priority Spectrum, and Top Contact People (with breadcrumbs like Employee Number / Location).

## 7. GroupPerformance
- **Purpose & Use Case**: Container component for the Group Performance tab, enabling toggling between Group Scorecards and Reassignment Loops views.
- **Props & State**: No props. State includes `activeView` ('scorecards' or 'bounce') and `bounceDepth` (string for filtering reassignment hops).
- **Visual/Design**: A top header featuring a segmented control to switch views, and a select dropdown for "Bounce Depth" that only appears when the reassignment loops view is active.

## 8. GroupScorecards
- **Purpose & Use Case**: Shows volume and backlog metrics broken down by assignment group, alongside a detailed performance table. Used in the Group Performance tab.
- **Props & State**: No props. Derives `volDist` and `backlogDist` from context using `computeGroupPerformance`.
- **Visual/Design**: The top section displays two side-by-side panels containing horizontal bar charts for Top 5 Volume and Top 5 Backlog groups. The bottom section is a comprehensive data table listing Group, Volume, Open, MTTR, SLA (with color-coded badges for breaches), Reopened, and Reassignments.

## 9. ReassignmentLoops
- **Purpose & Use Case**: Analyzes ticket bounces and reassignment loops between support groups. Used in the Group Performance tab.
- **Props & State**: 
  - **Props**: `bounceDepth` (string). 
  - **State**: `bounceFilterCorridor` (for filtering to specific group-to-group transfers).
- **Visual/Design**: 
  - Top row: 4 KPI cards (Total Transfers, Loops, FCR, MTTR Multiplier). 
  - Bottom area (Grid): 
    - Left side: A heat-mapped grid (`bounce-matrix-table`) showing group-to-group transfer volumes, with color intensity scaling from yellow to red. Below it, top corridors are listed as pill buttons.
    - Right side: A list of high-hop bounced incidents, displayed as cards. Each card shows the ticket number, priority, state, hops count, and breadcrumbs of the queue transfer path.

## 10. ExplorerPagination
- **Purpose & Use Case**: Pagination controls for the Incident Explorer data table.
- **Props & State**: 
  - **Props**: `totalCount`, `filteredCount`, `pageSize`, `currentPage`, `onPageChange`, `onPageSizeChange`. 
  - **State**: `jumpInput` (string for the "Jump to" page input).
- **Visual/Design**: A horizontal bar containing:
  - Left: Summary text (e.g., "Showing 1–50 of 200 incidents").
  - Right: A "Rows per page" dropdown, a sliding window of page pills (buttons for first, prev, specific pages with ellipses, next, last), and a "Jump to" input field.

## 11. ExplorerTable
- **Purpose & Use Case**: Renders the detailed data table for incidents in the Incident Explorer tab.
- **Props & State**: 
  - **Props**: `data` (RawIncident array), `sortKey` (SortKey enum), `sortAsc` (boolean), `onSort` (callback).
- **Visual/Design**: Standard HTML `<table>`. Column headers are sortable (showing directional arrows). Cells feature customized formatting, including color-coded badges for Priority and State. Short descriptions are truncated, and if a template is applied, it is shown as a small badge below the description. Rows are clickable to open an incident detail drawer.

## 12. IncidentExplorer
- **Purpose & Use Case**: Container for the Incident Explorer tab, managing search filtering, sorting, and pagination logic.
- **Props & State**: No props. State manages `sortKey`, `sortAsc`, `page`, and `pageSize`.
- **Visual/Design**: Features a panel with a header holding a search input (or a drilldown context pill with a clear button if navigated from another chart) and an "Export CSV" button. It wraps `ExplorerTable` (flex layout with scrollable overflow) and `ExplorerPagination`.

## 13. AgingSpectrum
- **Purpose & Use Case**: Displays the open backlog broken down by age buckets (<2d, 2-7d, 7-14d, 14-30d, >30d). Used in the SLA & Aging tab.
- **Props & State**: No props. Consumes incidents from context.
- **Visual/Design**: A panel listing the buckets using horizontal bars (`hbar-row`). Colors shift progressively from dark grey to red as the ticket age bucket increases.

## 14. SlaAging
- **Purpose & Use Case**: Container for the SLA & Aging tab. Wraps the SLA, aging spectrum, and stale backlog views.
- **Props & State**: No props.
- **Visual/Design**: A CSS grid layout. The top row has two equal columns housing `SlaByPriority` and `AgingSpectrum`. The bottom row spans the full width and holds the `StaleBacklog` component.

## 15. SlaByPriority
- **Purpose & Use Case**: Displays SLA compliance rates grouped by ticket priority. Used in the SLA & Aging tab.
- **Props & State**: No props. Consumes `filteredIncidents`.
- **Visual/Design**: Displays horizontal bars representing the compliance percentage for each priority (P1 to P5). Uses `PRIO_SPECTRUM_COLORS` to tint the text and bars (e.g., red for Critical/P1).

## 16. StaleBacklog
- **Purpose & Use Case**: Lists open incidents sorted by age (oldest first) to highlight stale tickets. Used in the SLA & Aging tab.
- **Props & State**: No props. Derives `openIncs` array from context.
- **Visual/Design**: A data table with columns for Incident, Aging, Priority, State, Assigned To, Location, and Summary. The Aging column uses badges that are color-coded (red if >7d, amber if >2d, otherwise green). Includes an "Export Backlog CSV" button in the header.

## 17. IntakeRadar
- **Purpose & Use Case**: Visualizes intake volume density across a 24-hour period and days of the week to reveal peak staffing windows. Used in the Volume & Trends tab.
- **Props & State**: No props. Maps opened dates to hour arrays and weekday mappings.
- **Visual/Design**: Divided into two sections:
  - Left: A 24-hour histogram made of vertical bars, color-coded by density (red indicating the peak hour).
  - Right: Horizontal bars showing volume by day-of-week (Mon-Sun), similarly color-coded based on density relative to the max day. Includes a "Peak" badge in the header.

## 18. MTTRTrend
- **Purpose & Use Case**: Displays the Mean Time To Resolve (MTTR) trend over time (by resolved date), configurable as daily or cumulative MTD. Used in the Volume & Trends tab.
- **Props & State**: No props. State includes `mode` ('daily' | 'cumulative'), `graphType` ('line' | 'bar'), `containerWidth` for responsiveness, and `tooltip`.
- **Visual/Design**: Header contains toggle pills for Daily/Cumulative and Line/Bar. Renders a custom SVG chart:
  - Bar mode: A histogram of rectangles.
  - Line mode: An SVG area chart with an outline path and gradient fill.
  Interactive dots/bars trigger tooltips and are clickable to open a date drilldown drawer.

## 19. VelocityChart
- **Purpose & Use Case**: Displays resolution velocity (logged/inflow vs resolved/outflow tickets over time) to monitor burn-down rhythm. Used in the Volume & Trends tab.
- **Props & State**: No props. State includes `containerWidth` and `tooltip`.
- **Visual/Design**: A custom SVG multi-line chart featuring a red path for "Logged" and a dark slate path for "Resolved". Interactive circles show tooltips. The bottom of the panel displays a summary footer with stats for Inflow, Outflow, Net Delta (color-coded red/green), and Burn-down ratio.

## 20. VolumeChart
- **Purpose & Use Case**: Displays incident inflow volume over time (by opened date), configurable as daily or cumulative. Used in the Volume & Trends tab.
- **Props & State**: No props. State includes `mode` ('daily' | 'cumulative'), `containerWidth`, and `tooltip`.
- **Visual/Design**: Custom SVG area chart with a gradient fill. Interactive points show tooltips on hover. In daily mode, the highest volume point is highlighted as a distinct red dot with a "Peak" text label next to it.

## 21. VolumeTrends
- **Purpose & Use Case**: Container for the Volume & Trends tab, organizing all volume and velocity visualizers.
- **Props & State**: No props.
- **Visual/Design**: Stacked vertical layout containing panels: Top is `MTTRTrend`, middle is `VolumeChart`, and bottom is a 2-column grid holding `VelocityChart` and `IntakeRadar`.

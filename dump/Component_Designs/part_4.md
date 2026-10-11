# Component Designs (Part 4)

## 1. LocationIcons
- **Purpose & Use Case**: A collection of reusable SVG icons used consistently across the Location Intelligence area. Replaces emojis and unicode glyphs for a unified design language.
- **Props & State**: 
  - Props: `size` (number), `strokeWidth` (number), `style` (React.CSSProperties), `className` (string).
- **Visual/Design details**: Base SVG uses a 24x24 viewBox, `currentColor` for fill/stroke, and `round` stroke settings. Flexbox-friendly with `flexShrink: 0`. Includes specific exports like `IconSearch`, `IconMap`, `IconSparkle`, etc.

## 2. LocationOverlay
- **Purpose & Use Case**: The primary command-center overlay for Location Intelligence / Geo-Hotspots. It orchestrates sub-views such as a mosaic, map, stores by issue, and employee mapping.
- **Props & State**: 
  - State: `activeView` (mosaic/map/issue/mapping), `selectedLocation`, `hoveredLocation`, `activeIssueFilter`, `mapExpanded`, `focusRequest`, `panelWidth`.
- **Visual/Design details**: Renders a full-screen or modal overlay with a topbar (`analytics-topbar`). Features a KPI strip with metric cards (`LocKpi`). Main content is a 2-column layout (`insight-panel`). It includes a full-screen expanded map mode styled with a cohesive dark palette (`#111111`, `#151515`).

## 3. LocationTable
- **Purpose & Use Case**: A data table displaying location performance metrics (volume, open backlog, SLA %, MTTR, Health score, top issue).
- **Props & State**: 
  - Props: `locations`, `selectedLocation`, `onSelect`, `issueFilter`.
- **Visual/Design details**: Enclosed in an `insight-panel`. Renders a scrollable table (`dark-data-table`) using tabular mono-spaced fonts. Supports CSV export. Features health gauge bars and badge pills for SLA status. Selected rows are highlighted with `var(--surface-2)`.

## 4. MapHoverCard
- **Purpose & Use Case**: A floating tooltip card that appears when hovering over map markers, presenting detailed site telemetry (health, SLA, incidents) and issue concentration.
- **Props & State**: 
  - Props: `location`, `position`, `issueLabel`, `issueCount`, `totalIssueIncidents`, `threshold`.
- **Visual/Design details**: Absolutely positioned within the map viewport. Uses a dark, semi-transparent background (`rgba(21, 21, 21, 0.97)`) with backdrop blur and subtle shadow. Renders `SiteTypeChip` and displays warnings in red if the alert threshold is met.

## 5. MapLegend
- **Purpose & Use Case**: Provides a legend overlay on the map, explaining marker colors, alert halos, health bands, and sizing logic.
- **Props & State**: 
  - Props: `issueFilter`, `alertCount`, `unmappedAlertCount`, `totalMapped`, `maxStoreVolume`, `healthCounts`.
- **Visual/Design details**: Positioned at the bottom-left of the map. Styled as a blurred dark panel (`rgba(21, 21, 21, 0.94)`). Displays continuous color gradients (`volumeRampGradient`), alert circles with red box-shadows, and health status indicators.

## 6. MapMarker
- **Purpose & Use Case**: Renders an individual map marker for a store/location on the interactive map. Adapts its appearance based on mode (health vs. issue volume).
- **Props & State**: 
  - Props: `loc`, `coord`, `count`, `maxCount`, `threshold`, `mode`, `isSelected`, `isHovered`, `labelSide`, `unit`, `onSelect`, `onHover`.
- **Visual/Design details**: Uses SVG circles inside `react-simple-maps`. Generates concentric rings for alerts (pulsing red halo), selection (dashed blue), hover (white stroke), and focus. Sizes scale non-linearly (by area) with incident volume. Colors derive from `volumeRamp` or `healthColor`. Name tags are rendered dynamically to avoid collision.

## 7. SiteTypeChip
- **Purpose & Use Case**: A small visual badge that classifies a site's archetype (e.g., Retail Store, Distribution Centre, Head Office).
- **Props & State**: 
  - Props: `type` (string), `size` ('sm' | 'md'), `isDark` (boolean).
- **Visual/Design details**: A compact inline-flex span. Utilizes a predefined color palette (`ST` = blue, `DC` = amber, `HO` = purple). Theme-aware: dark mode uses luminous tints, light mode uses deeper tints with corresponding borders.

## 8. StoreRankList
- **Purpose & Use Case**: A ranked list displaying stores by incident volume for a selected issue. Includes filtering, sorting, and keyboard navigation.
- **Props & State**: 
  - Props: `stores`, `totalIssueIncidents`, `threshold`, `selectedLocation`, `hoveredLocation`, `onSelect`, `onHover`, `onLocate`, `isDark`.
  - State: `filterQuery`, `sortKey`, `canScrollMore`.
- **Visual/Design details**: Flex column layout with search input and sort dropdown. Scrollable list of `StoreRow` items. A visual fade gradient at the bottom indicates scrollability. Supports roving tab-index for accessibility.

## 9. StoreRow
- **Purpose & Use Case**: Represents an individual store row within `StoreRankList`, showing volume bars, percentage share, rank, and a button to locate the store on the map.
- **Props & State**: 
  - Props: `rank`, `storeName`, `count`, `totalIssueIncidents`, `maxCount`, `scaleMax`, `threshold`, `isSelected`, `isHovered`, `tabbable`, `onSelect`, `onHover`, `onLocate`, `isDark`.
- **Visual/Design details**: CSS Grid layout. Interactive states for hover, selection (blue background/border), and alert (red background). Renders a horizontal bar graph whose width and color map to the incident volume (`volumeRamp`), complete with a threshold tick mark.

## 10. StoresByIssue
- **Purpose & Use Case**: Container component for analyzing issue impact across stores. Switches between list, heatmap matrix, and map views. Includes controls for issue selection and alert thresholds.
- **Props & State**: 
  - Props: `locations`, `incidents`, `selectedLocation`, `hoveredLocation`, `onSelect`, `onHover`, `onIssueChange`, `initialIssue`, `onLocate`, `hideMapTab`, `isDark`.
  - State: `clusterMode` (raw vs smart), `selectedIssue`, `threshold`, `subView`, `internalHoveredLocation`, `localFocus`.
- **Visual/Design details**: Uses custom segmented controls for toggling views and clustering modes. Container has rounded borders. Composes combobox, threshold sliders, and KPI strips above the main content area.

## 11. StoresHeatmapMatrix
- **Purpose & Use Case**: Displays a cross-tabulated heatmap grid of stores (rows) versus top issues (columns), indicating incident concentration.
- **Props & State**: 
  - Props: `locations`, `incidents`, `selectedLocation`, `onSelectStore`, `onSelectIssue`, `isDark`.
  - State: `sort`, `hoverRow`.
- **Visual/Design details**: Scrollable table with sticky headers and a sticky first column for store names. Cells use background colors derived from `volumeRamp` with dynamic alpha transparency based on cell value relative to the matrix maximum. Text color flips for contrast on dark cells.

## 12. ThresholdControl
- **Purpose & Use Case**: A control widget allowing users to configure an alert threshold for incident volumes per store.
- **Props & State**: 
  - Props: `threshold`, `maxThreshold`, `alertedCount`, `onChange`, `isDark`.
  - State: `draft` (for typing in number input).
- **Visual/Design details**: Combines a stepper (minus/plus buttons with a numeric input) and a custom styled range slider (`loc-range`). Displays a dynamic pill badge indicating how many stores are flagged, styled in red if >0.

## 13. UnmappedPopover
- **Purpose & Use Case**: A popover dialog listing sites that have incident data but lack map coordinates, providing an option to view them in the explorer.
- **Props & State**: 
  - Props: `unmappedLocations`, `onClose`.
- **Visual/Design details**: Absolutely positioned popup with a dark, blurred background and box-shadow. Uses `SiteTypeChip` for each unmapped location. Includes a close icon and click-outside/escape-key detection logic.

## 14. AnalysisWorkbench
- **Purpose & Use Case**: A flexible, pivot-table building interface (Analysis Studio) that lets users group incident data by arbitrary rows and columns, apply local filters, and analyze various metrics (volume, SLA, MTTR, etc.).
- **Props & State**: 
  - State: `studioTab`, `row`, `column`, `selectedMetrics`, `splitMetric`, `sortMetric`, `rowFilter`, `limit`, `descending`, `filterField`, `filterValue`, `dateFrom`, `dateTo`, `dateBasis`.
- **Visual/Design details**: Organized into a header, a builder panel with dropdown "shelves", and a result panel rendering a pivot table. Table cells feature embedded horizontal bar charts (`pivot-bar`) visualizing metric proportions. Includes active filter badges and CSV export functionality.

## 15. InsightFeed
- **Purpose & Use Case**: Presents auto-generated, data-driven insights derived from the current scope of incidents. Supports searching and severity filtering.
- **Props & State**: 
  - Props: `insights`, `onDrill`.
  - State: `severityFilter`, `search`.
- **Visual/Design details**: Displays a filter bar with severity chips (Critical, Warning, Info, Positive). Insights are rendered as cards (`insight-card`) in a CSS grid (`insight-grid`). Card styles adapt based on the severity level, displaying icons, categories, titles, and metrics.

## 16. CallerContact
- **Purpose & Use Case**: Top-level tab pane component summarizing caller and requester metrics. Orchestrates KPIs, top callers list, and distribution charts.
- **Props & State**: 
  - State: None (computes derived metrics via useMemo from context).
- **Visual/Design details**: Acts as a standard tab pane container (`tab-pane active`). Uses CSS Grid (`grid-template-columns: 1.2fr 1fr`) to position the frequent callers table and distribution charts side-by-side.

## 17. CallerDistribution
- **Purpose & Use Case**: Renders horizontal bar charts detailing caller distribution across locations and contact channels.
- **Props & State**: 
  - State: None (computes distributions from context).
- **Visual/Design details**: Consists of two vertically stacked panels. Uses custom HTML/CSS horizontal bar charts (`.hbar-row`, `.hbar-track`, `.hbar-fill`). Employs distinct color palettes for locations (`AGING_PALETTE`) and channels (`AGING_CHANNEL_PALETTE`).

## 18. CallerKPIs
- **Purpose & Use Case**: Displays high-level metric cards for the Caller/Contact tab, such as Unique Callers, Repeat Callers, Top Caller, and Active Sites.
- **Props & State**: 
  - Props: Optional overrides for `uniqueCallers`, `repeatCallers`, `repeatRate`, `topCallerName`, `topCallerCount`, `activeLocations`. Falls back to computing them.
- **Visual/Design details**: A CSS grid containing four `.kpi` blocks. Each block features a small label, a large prominent value font (`22px` or `16px`), and contextual subtext.

## 19. FrequentCallers
- **Purpose & Use Case**: A table component listing the most frequent requesters/callers. Provides drill-down capabilities for individual users.
- **Props & State**: 
  - Props: `callerList` (array of caller metrics).
- **Visual/Design details**: Placed within a panel. Features a scrollable `.data-table` with fixed layout. Rows have a `.clickable` hover state. Incident counts are highlighted with a warning badge pill (`.badge-pill.warn`).

## 20. CategoriesRCA
- **Purpose & Use Case**: Root component for the Categorisation & Root Cause Analysis tab. It allows users to toggle between a standard "Classification Grid" and an interactive "Incident Flow (Sankey)" diagram.
- **Props & State**: 
  - State: `activeView` (grid/flow), `sankeyPreset`, `sankeyDensity`, `sankeyStage1`, `sankeyStage2`, `sankeyStage3`, `sankeyHighlightNode`.
- **Visual/Design details**: Features a unified toolbar header with a segmented control for view switching. In flow mode, reveals preset dropdowns and density buttons (`chart-type-pill-group`). A custom builder row appears for 3-stage flow customization. Designed to flex vertically, handling overflow behavior conditionally based on the active view.

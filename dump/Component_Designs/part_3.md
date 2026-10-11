# Incident Pulse - Component Designs & Use Cases (Part 3)

This document contains the analysis of 20 React components from the Incident Pulse dashboard, detailing their purpose, use cases, props/state, and visual/design details.

---

## 1. AgentMatrix
**Purpose & Use Case:** Renders a table matrix of agent performance within the Analytics Overlay. It provides a detailed breakdown of incidents assigned, resolved, average MTTR (Mean Time to Resolve), SLA compliance percentage, and reopens for each agent.
**Props & State:**
- **Props:** None.
- **State:** Derives data from `useIncidentContext()`. Uses `useMemo` to aggregate and sort incident data by agent.
**Visual & Design Details:** Features a dark aesthetic within an `.insight-panel` container. The data is presented in a `.dark-data-table` with sticky headers. Uses color-coded badge pills (`ok` / `err`) for SLA compliance to easily spot underperformers. Includes an "Export CSV" button.

## 2. AnalyticsOverlay
**Purpose & Use Case:** The main container for the Analytics & Insights overlay. It provides a people-focused layer above the standard tabs, offering executive-level insights on teams, top performers, and caller intelligence.
**Props & State:**
- **Props:** None.
- **State:** Uses `useIncidentContext()` to check `overlays.analytics` and control its visibility (`isOpen`).
**Visual & Design Details:** Functions as a full-screen or modal overlay with a semi-transparent dark background. It contains a top bar (`.analytics-topbar`) with an "INTERNAL / RESTRICTED" badge and an exit button. The body displays the `Leaderboard`, `WeeklyHeatmap`, `CallerIntelligence`, and `AgentMatrix` components in a vertical layout with gap spacing.

## 3. CallerIntelligence
**Purpose & Use Case:** Shows caller-related insights, identifying unique callers, repeat callers, repeat rate, and unique locations. Helps analysts determine whether incident demand is broad-based or driven by a few specific individuals (which usually indicates a single recurring issue). Used inside the AnalyticsOverlay.
**Props & State:**
- **Props:** None.
- **State:** Uses `useIncidentContext()` to access incidents. Uses `useMemo` to group incidents by caller and calculate metrics.
**Visual & Design Details:** Displays a grid of four summary KPI boxes at the top with uppercase monospace labels. Below, a `.dark-data-table` lists individual callers along with their incident counts, top categories, and primary groups. Uses colored badges (`info` or `warn`) for incident counts. Includes CSV export functionality.

## 4. Leaderboard
**Purpose & Use Case:** Displays the top-performing agents in three distinct categories: Top SLA Compliance, Most Resolved Cases, and Coaching Opportunities (agents with high reopens or low SLA). Used inside the AnalyticsOverlay.
**Props & State:**
- **Props:** None.
- **State:** Derives data from `useIncidentContext()` and uses `useMemo` to calculate the top 5 agents for each category.
**Visual & Design Details:** Uses a 3-column layout (`.lb-columns`). Renders ranks with emoji medals (🥇, 🥈, 🥉). Emphasizes values using CSS variables like `var(--ok)` for high SLA and `var(--warn)` for coaching flags. Text styling emphasizes mono fonts for numerical data.

## 5. WeeklyHeatmap
**Purpose & Use Case:** Renders a "Date vs Hour" heatmap to visualize incident intake volume over time. Helps in identifying peak intake windows for staffing and scheduling support coverage. Used inside the AnalyticsOverlay.
**Props & State:**
- **Props:** None.
- **State:** Derives data from `useIncidentContext()` and calculates hourly volume density across the selected date range.
**Visual & Design Details:** Displays a grid (`.heatmap-grid`) where cells (`.hm-cell`) are colored using a blue color scale indicating volume density. Includes a legend scale at the top. Peak hours are highlighted with a special class (`.hm-peak`). Provides a textual insight callout at the bottom summarizing the peak intake window.

## 6. FlowMatrix
**Purpose & Use Case:** Displays a transfer density matrix heatmap showing how incidents bounce (are reassigned) between different assignment groups. Helps identify routing loops and busy handoff corridors. Used within the FlowOverlay.
**Props & State:**
- **Props:** `matrix` (Record), `uniqueGroups` (string[]), `corridors` (FlowCorridor[]), `onSelectCorridor` (function), `selectedCorridor`, `onClearCorridor`.
- **State:** Uses local state for `hoveredCell`.
**Visual & Design Details:** A dark, dense matrix table (`.bounce-matrix-table`) with sticky row and column headers. Cells vary in background color from dark grey to bright red based on transfer volume. Active/hovered cells have glowing outlines. The top section displays buttons for the "Top Corridors" which are clickable.

## 7. FlowNetwork
**Purpose & Use Case:** An interactive network graph visualizing the flow of incidents between assignment groups. Nodes represent groups and edges represent transfers. Used to visually spot bottlenecks and ping-pong loops in the FlowOverlay.
**Props & State:**
- **Props:** `corridors`, `uniqueGroups`, `onSelectCorridor`, `onSelectGroup`, `selectedGroup`, `selectedCorridor`, `expandedJourney`, `isExpanded`, `onToggleExpand`, `focusMode`, `onToggleFocusMode`, `minCorridorVolume`, `onChangeMinCorridorVolume`.
- **State:** Local state for zoom, pan, search text, max nodes, and tooltips.
**Visual & Design Details:** Uses SVG to draw nodes arranged in concentric rings (hub, inner, mid, outer) based on activity. Uses a 24-color neon palette (`NEON_PALETTE`). Edges have gradients matching the connected nodes and thickness based on volume. Ping-pong pairs are highlighted as dashed red lines (`.fng-loop`). Includes controls for zooming, filtering, and searching.

## 8. FlowOverlay
**Purpose & Use Case:** The primary container for the "Assignment Group Flow" overlay. Allows users to upload an `incident_metric.csv` and switch between the Network graph and Journey paths to analyze incident handoffs.
**Props & State:**
- **Props:** None.
- **State:** Extensive local state for view mode ('network' | 'paths'), date ranges, selected groups/corridors, search query, and filters (priority, hops). Derives metrics using flowEngine utility functions.
**Visual & Design Details:** A full-screen overlay with a blurry, semi-transparent top bar. If no data is loaded, it shows a drag-and-drop empty state with instructions. Once loaded, it displays a command bar, KPI strips, view switchers, the diagram stage (FlowNetwork or FlowPaths), and a data table of "Incident journeys" at the bottom.

## 9. FlowPaths
**Purpose & Use Case:** Shows specific incident paths/journeys (sequences of assignment groups). Useful for finding FCR (First Contact Resolution), multi-hop paths, and loops (where tickets bounce back to a previous group).
**Props & State:**
- **Props:** `journeys`, `corridors`, `uniqueGroups`, `selectedPath`, `selectedGroup`, `selectedCorridor`, `onSelectPath`, `isExpanded`, `onToggleExpand`.
- **State:** Local state for sort order, category filtering ('all', 'top10', 'loops', 'fcr', 'multihop'), and hiding noise (paths with <2 tickets).
**Visual & Design Details:** Paths are visualized as a sequence of connected chips (`.fxp-chip`), colored by group. Long paths collapse middle hops into a "+N" chip. Rows show volume via a progress bar (`.fxp-track`). Uses traffic-light color coding (`TONES` - red, amber, green) based on hop count and loop presence.

## 10. flowStyles
**Purpose & Use Case:** A pure TypeScript file exporting a CSS-in-JS string (`FLOW_CSS`) that contains all scoped styles for the FlowOverlay and its child components.
**Props & State:** N/A (CSS string export).
**Visual & Design Details:** Defines CSS variables for dark mode colors (`--fx-s1`, `--fx-ink`, `--fx-blue`, etc.). Contains styles for buttons, segmented controls, inputs, KPI strips, journey list rows, and specific SVG animations (like the ping-pong dash animation).

## 11. GuideArticle
**Purpose & Use Case:** Renders the textual content for the Incident Pulse Guide/Documentation. Explains how to read the dashboard, what the metrics mean, and how to interpret the overlays.
**Props & State:**
- **Props:** None.
- **State:** None.
**Visual & Design Details:** Structured as a semantic HTML `<article>` with multiple `<section>` tags. Uses specific typographic styles, and custom callout boxes (`.g-callout.tip`, `.example`, `.watch`) to highlight tips, worked examples, and warnings. Includes formula blocks to explain metric calculations.

## 12. GuideOverlay
**Purpose & Use Case:** The main container for the Guide & Documentation overlay. It provides a split-pane layout to view the Table of Contents alongside the guide content.
**Props & State:**
- **Props:** None.
- **State:** Uses context to manage visibility (`overlays.guide`). Local state for the `searchQuery`.
**Visual & Design Details:** Full-screen overlay with a top bar containing a search input. The search input has a keyboard shortcut hint (`/`). The body uses a two-pane layout (`.guide-shell`) displaying the `GuideTOC` on the left and `GuideArticle` on the right.

## 13. GuideTOC
**Purpose & Use Case:** Renders the Table of Contents for the GuideOverlay. Allows users to navigate through sections and filter topics using the search query. It highlights the currently active section based on scroll position.
**Props & State:**
- **Props:** `searchQuery`.
- **State:** Local state for `activeSection` (tracks scroll position).
**Visual & Design Details:** A navigation sidebar (`.guide-toc`). Groups links by category. Links (`.guide-toc-link`) are highlighted when active or hovered. Hides non-matching items based on the search query, showing a "No results" message if needed.

## 14. ClusterBubble
**Purpose & Use Case:** Used in the GlobalMap to represent a clustered group of nearby geographic locations. Shows the total volume of incidents and the number of combined stores in that cluster.
**Props & State:**
- **Props:** `coord`, `locations`, `totalCount`, `peakFraction`, `hasAlert`, `ringColor`, `unit`, `onClusterClick`.
- **State:** None.
**Visual & Design Details:** Renders an SVG `<Marker>`. Displays a dark circle with a colored ring (based on volume or explicit health color). Shows a pulsating red ring behind it if `hasAlert` is true. Contains text for total volume and a small top-right badge for the number of stores included.

## 15. EmployeeMappingView
**Purpose & Use Case:** A utility configuration panel for uploading a CSV of employee names to map them to specific locations (Store, Support Hub, DC). It is used to backfill location data for incidents that only have caller names.
**Props & State:**
- **Props:** None.
- **State:** Local state for uploaded employee entries (`empEntries`), the selected location tag, optional location name, and status messages. Persists data to `localStorage`.
**Visual & Design Details:** Rendered with a light theme (white background, dark text), contrasting with the typically dark overlays. Uses standard forms, select dropdowns, and file inputs. Displays summary badge pills for mapped employees and provides a downloadable sample CSV.

## 16. FacilityModel
**Purpose & Use Case:** Renders a CSS-based 3D model of a facility (Store, Distribution Centre, or Head Office) based on the location's archetype. Provides a visual novelty representation in hover cards or details.
**Props & State:**
- **Props:** `archetype` ('store' | 'dc' | 'ho'), `healthScore`, `locationName`.
- **State:** None. Uses `useEffect` and `useRef` for raw DOM manipulation and animation loops.
**Visual & Design Details:** Builds a 3D scene using nested `div`s with CSS 3D transforms (`rotateX`, `rotateY`, `translateZ`). The model can be rotated via drag (pointer events). The facility's lighting/shade colors adapt based on the `healthScore`.

## 17. GlobalMap
**Purpose & Use Case:** An interactive world/country map visualizing locations. Used in the LocationOverlay to see the geographic distribution of incidents. Supports smart clustering, alerts, zooming, panning, and hovering.
**Props & State:**
- **Props:** `locations`, `selectedLocation`, `onSelect`, `hoveredLocation`, `onHover`, `issueFilter`, `isExpanded`, `onToggleExpand`, `clusterMode`, `focusRequest`.
- **State:** Local state for viewport sizing, map position (coordinates, zoom), and tooltip positioning.
**Visual & Design Details:** Powered by `react-simple-maps`. Uses a dark, low-glare palette (`#111111` water, `#151515` land). Shows subtle UK reference cities. Handles rendering individual markers (`MapMarker`) and clusters (`ClusterBubble`). Includes floating controls for zoom/fit and an unmapped items warning.

## 18. HealthMosaic
**Purpose & Use Case:** A grid (mosaic) visualization of location health scores. Provides an alternative, space-efficient view of store health in the LocationOverlay.
**Props & State:**
- **Props:** `locations`, `selectedLocation`, `onSelect`.
- **State:** None.
**Visual & Design Details:** Renders tiles (`.mosaic-tile`) in different sizes (large, medium, small) depending on the number of locations. Tiles use a CSS linear gradient based on the location's health score color. Highlights selected locations and adds specific box-shadows for inferred (approximate) locations.

## 19. IssueCombobox
**Purpose & Use Case:** A custom, searchable dropdown (combobox) used in the LocationOverlay to select a specific issue type from a large list.
**Props & State:**
- **Props:** `options` (IssueOption[]), `selectedIssue`, `onSelect`, `isDark`.
- **State:** Local state for dropdown visibility (`isOpen`), search string, and highlighted index for keyboard navigation.
**Visual & Design Details:** Supports both light and dark modes. Features a search input pinned inside the dropdown header. Renders options with a horizontal volume bar to indicate the relative frequency of that issue. Includes a numeric badge for the currently selected issue.

## 20. KpiStrip
**Purpose & Use Case:** Displays a responsive strip of Key Performance Indicators (KPIs) related to location and issue data (e.g., Stores affected, Total Incidents, Alerts, Top-5 share).
**Props & State:**
- **Props:** `totalStoresAffected`, `totalIncidents`, `alertedStoresCount`, `threshold`, `top5ConcentrationPct`, `isDark`.
- **State:** None.
**Visual & Design Details:** Uses CSS Grid (`grid-template-columns: repeat(auto-fit, minmax(64px, 1fr))`) for responsiveness. Each KPI box displays a small label, a large bold value, and a tooltip hint. Individual KPIs can have a tone ('default', 'alert', 'accent') which alters the text and background color (e.g., red for alerts). Supports light and dark modes.

---
*Generated by Component Analyzer Agent.*

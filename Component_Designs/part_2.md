# Component Designs - Part 2

## SLA-Pulse Components

### 1. KPIPanel
- **Purpose & Use Case**: Displays a high-level summary of Key Performance Indicators (KPIs) like Report Date, Volume, Call GOS, and Abandon rates based on the uploaded CSV data. It is the primary dashboard widget in the workspace.
- **Props & State**: No direct props. Consumes data (`summary`, `rows`) and UI state (`openDailyGosPanel`, `showToast`) via Context.
- **Visual/Design Details**: Wrapper uses `panel kpi-panel` classes. It features a header (`panel-head`) with a dynamic badge showing the row count. Metrics are rendered in a CSS grid (`kpis`) using `KPICard` components, followed by a `HealthBar` and `ValidationChecks`.

### 2. ValidationChecks
- **Purpose & Use Case**: Renders a data validation summary (Upload, Columns, Dates) to give users immediate feedback on data integrity and upload errors.
- **Props & State**: No props. Uses `validation` object from `useData` context.
- **Visual/Design Details**: Container uses the `validation` class. Individual checks are wrapped in `check` class divs. Conditionally applies `ok` or `err` classes based on validation status, coloring the visual indicators accordingly.

### 3. ImprovementLab
- **Purpose & Use Case**: Functions as a "DMAIC evidence workspace" that lets operations managers test staffing scenarios, plan shifts, and track hypotheses for SLA improvement. Operates as an overlay or dedicated lab mode.
- **Props & State**: No props. Local state includes `shifts`, `newShift`, `hypotheses` (for tracker), `simStart`, `simEnd`, and `simAgents`. Consumes global data and UI state via context.
- **Visual/Design Details**: Styled heavily with inline CSS and CSS variables (`var(--surface-2)`, `var(--mono)`, `var(--line)`). Uses a CSS grid (`lab-grid`) with modular cards (`lab-card`). Includes interactive elements like inputs, dropdowns, dynamic tables, and comparison cards (Current vs. Projected GOS).

### 4. AppShell
- **Purpose & Use Case**: The root layout wrapper for the SLA-Pulse application. It arranges the primary navigational and content areas.
- **Props & State**: None.
- **Visual/Design Details**: A `main` tag with class `app` housing the `Sidebar` and a `main` section. The main section vertically stacks the `Header` and `Workspace`.

### 5. Header (SLA-Pulse)
- **Purpose & Use Case**: Shows the app title and provides a drag-and-drop zone or file browser button for uploading the Interactions CSV.
- **Props & State**: No props. Local state `isDragging` for drag-and-drop feedback. Consumes `loadCSV` and `isLoading` from context.
- **Visual/Design Details**: Housed in a `header` tag. The upload area (`upload-box`) highlights dynamically (`dragging` class) when files hover over it.

### 6. Sidebar (SLA-Pulse)
- **Purpose & Use Case**: Serves as the left-hand rail. Displays branding, month-to-date (MTD) operational metrics, and houses a modal for application Settings and Data Import Guide.
- **Props & State**: No props. Local state manages `isModalOpen`, `activeTab` (guide vs. settings), and a `draft` copy of settings for editing. Consumes `summary` and settings from context.
- **Visual/Design Details**: Styled with `rail`, `side-metrics`, and `side-card` classes. Uses status coloring (`ok`, `warn`, `err`) for metric thresholds. The modal (`modal-overlay`) is styled with inline CSS, featuring tabbed navigation and structured form fields with mono fonts.

### 7. Workspace
- **Purpose & Use Case**: A layout component acting as the main content area container. Groups the `KPIPanel` and `MessagePanel`.
- **Props & State**: None.
- **Visual/Design Details**: A simple `<section className="workspace">` wrapper to handle layout alignment.

### 8. ActionBar
- **Purpose & Use Case**: Provides a row of action buttons for the generated message, allowing users to copy the text, open insights, open the improvement lab, or download it as a `.txt` file.
- **Props & State**: No props. Uses Context for data and UI triggers.
- **Visual/Design Details**: Wrapped in a `div` with class `actions`. Buttons have varied styling via utility classes: `btn`, `btn info`, `btn ghost`, and `btn secondary`.

### 9. MessagePanel
- **Purpose & Use Case**: Displays the finalized SLA update text with a simulated human typewriter effect. Also provides expandable calculation rules.
- **Props & State**: No props. Local state `typedMessage` manages the text animation.
- **Visual/Design Details**: Uses classes `panel message-panel`. Features a read-only `textarea` for the animated text and a native HTML `<details>`/`<summary>` block for calculation rules.

### 10. Toast (ToastContainer & ToastItem)
- **Purpose & Use Case**: Provides transient, non-blocking notification messages (toasts) across the application for successes, warnings, and errors.
- **Props & State**: `ToastItem` takes `toast` (object) and `onDismiss` (function). Uses local `show` state for enter transitions.
- **Visual/Design Details**: `ToastContainer` sits at a high z-index. `ToastItem` uses `toast` and `show` classes for animation. Contains structured text (`toast-title`, `toast-msg`) and an SVG dismiss button.

## Incident Pulse Components

### 11. AnimatedNumber
- **Purpose & Use Case**: A generic utility component used inside metric cards to smoothly animate a number counting up or down to a new value.
- **Props & State**: Props: `value` (target number), `duration` (animation length), `format` (formatting function). Local state: `displayValue`.
- **Visual/Design Details**: Returns a raw formatted string (fragment). Utilizes `requestAnimationFrame` with an ease-out-cubic easing function.

### 12. DateDrawer
- **Purpose & Use Case**: A slide-out panel showing deep telemetry for a specific day. Includes volume KPIs, hourly arrival distribution, priority breakdown, and a full table of incidents logged on that date.
- **Props & State**: No props. Consumes `drawerState`, `rawIncidents`, etc., from `useIncidentContext`.
- **Visual/Design Details**: A fixed position overlay (`slide-drawer`). Smoothly transforms from the right side. Styled largely with inline CSS leveraging CSS variables. Contains a hero banner, a 5-KPI grid strip, a dynamic 24-hour bar chart (custom div-based bars), horizontal progress bars for priorities, and a detailed data table (`data-table`).

### 13. DrawerOverlay
- **Purpose & Use Case**: A backdrop component that renders behind open drawers (DateDrawer, IncidentDrawer) to focus user attention and provide a click-away-to-close mechanic.
- **Props & State**: No props. Consumes `drawerState` to determine visibility.
- **Visual/Design Details**: Fixed `div` covering the viewport (`top: 0, left: 0...`). Features a black background with `0.5` opacity and z-index of 900.

### 14. IncidentDrawer
- **Purpose & Use Case**: A detailed slide-out inspector for a single incident. Displays scope, requester info, assignment details, RCA, work notes, and a collapsible raw data viewer.
- **Props & State**: No props. Local state `copied` for clipboard feedback. Consumes `drawerState` from context.
- **Visual/Design Details**: Slides in from the right (`slide-drawer`). Includes a header with KPI cards (`drawer-kpis`), segmented body sections (`drawer-section`), and formatted key-value tables (`drawer-kv-table`). Badges are used to highlight SLA status and vendor holds.

### 15. FilterStrip
- **Purpose & Use Case**: A complex global filtering bar allowing users to slice incident data by date range, priority, state, assignment group, and channel. Also provides reset and CSV export buttons.
- **Props & State**: Consists of `MultiSelect` and `DateSegment` sub-components which manage their own dropdown/focus states. Connects to `filterState` and `filterDispatch` via context.
- **Visual/Design Details**: Uses classes `date-filter-strip`, `scope-date-group`, `scope-right-group`. Custom multi-select dropdowns (`scope-ms-wrap`) replace native selects for a better UI. Employs crisp borders, mono fonts, and hover states.

### 16. Header (Incident Pulse)
- **Purpose & Use Case**: The top bar of the application containing the branding title and the file upload input for the incident dataset.
- **Props & State**: No props. Consumes `loadCSVFile` and `fileName` from context.
- **Visual/Design Details**: Structured with `header` class, `header-info`, and `upload-box`. Styled minimally. The file input is visually hidden (`display: 'none'`) and triggered via a stylized `<label>`.

### 17. NavTabs
- **Purpose & Use Case**: The main horizontal navigation menu for switching between the different analytical views (e.g., Executive Overview, Volume & Trends, Incident Explorer).
- **Props & State**: No props. Controls global `activeTab` state via context.
- **Visual/Design Details**: Uses `<nav className="nav-tabs">`. Buttons feature the `nav-tab` class and an `active` class for the selected state. Implements ARIA roles for accessibility (`role="tablist"`, `aria-selected`).

### 18. Sidebar (Incident Pulse)
- **Purpose & Use Case**: The left-hand rail providing a global "Live Dataset Snapshot". Summarizes key totals like Open vs. Resolved cases, SLA Compliance, MTTR, and backlog counts.
- **Props & State**: No props. Directly computes metrics using `computeMetrics(filteredIncidents)`.
- **Visual/Design Details**: Wrapped in `<aside className="rail">`. Uses `side-metrics` with `side-card` grids. Select cards use `accent` or `highlight` classes to stand out. Numbers animate on change via `AnimatedNumber`.

### 19. ShortcutOverlay
- **Purpose & Use Case**: A quick-reference modal displaying all global keyboard shortcuts available in the dashboard.
- **Props & State**: No props. Visibility controlled by `overlays.shortcuts` from context.
- **Visual/Design Details**: Full-screen blurred backdrop (`backdropFilter: 'blur(4px)'`). The modal content is a clean, dark-header card. Keyboard keys are styled using `<kbd>` tags with borders and background colors resembling physical keys.

### 20. AnalysisStudioOverlay
- **Purpose & Use Case**: A dedicated, full-screen overlay for advanced interactive data exploration (housing the pivot table / `AnalysisWorkbench`).
- **Props & State**: No props. Visibility controlled by `overlays.analysisStudio`.
- **Visual/Design Details**: Rendered as a `section` with class `analysis-studio-overlay` (and `open` conditionally). Features a distinct `analytics-topbar` and a content body (`analysis-studio-body`).

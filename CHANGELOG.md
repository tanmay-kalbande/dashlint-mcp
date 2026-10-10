# Changelog

All notable changes to the DashLint MCP server will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-10-10

### Added
- **`build_dashboard_blueprint` v2.0**:
  - Classifies every field to exactly one justified role (or `unknown` with an `askUser` question) with calibrated confidence and evidence.
  - Adds strict additivity classification (`additive`, `non_additive`, `snapshot`) and default aggregations (`sum`, `weighted_avg`, `avg`, `count_distinct`, `none`).
  - Unit prices, percentages/rates, ratings, and durations are never recommended as `SUM()`. Prices receive `weighted_avg` (`value / units`), percentages receive ratio recomputation with explicit numerator and denominator.
  - Grain detection (`grainGuess`) with candidate identifiers and cardinality checks.
  - Ratio recomputation formulas with explicit numerators and denominators.
  - Suggested local data validation checks and prioritised `askUser` clarifying questions.
  - Support for optional, opt-in privacy-preserving aggregate metadata (`rowCount`, `numericSummary`, `dateRange`).
- **`get_dashboard_kit` Tool**:
  - Primary dashboard generation tool supporting `cli` and `inline` modes.
  - `cli` mode outputs `npx dashlint-kit` commands (`init`, `build`, `profile`, `lint`) and runtime API reference under 10 KB.
  - `inline` mode outputs deduplicated wireframe, component patterns, domain packs, and JS utilities within a 35 KB budget.
- **`get_version` Tool**:
  - Returns server version (`2.0.0`), protocol version, supported features, and manifest location.
- **Domain Packs (`src/lib/domain-packs.ts`)**:
  - Domain-neutral copy maps for `generic` (default), `service-ops`, and `sales-distribution`.
  - Generic pack contains zero call-center or incident-specific terms (GOS, SLA, breach, agent, abandon, hourly).
- **Configurable Attribution (`CreditConfig`)**:
  - Sidebar attribution supports `default`, `none`, or custom `{ text, url }`.
- **Single Source of Truth (`src/lib/tools.manifest.json`)**:
  - Authoritative manifest of all 12 MCP tools with schemas and deprecation statuses.
- **Unit and Contract Test Suite (`test/`)**:
  - Comprehensive tests using Node.js built-in runner (`node --test`):
    - `phase0-baseline.test.mjs`
    - `phase1-correctness.test.mjs`
    - `phase2-defaults.test.mjs`
    - `phase4-blueprint.test.mjs`
    - `phase7-contract.test.mjs`

### Changed
- **A1. Workspace Layout**: `.main` converted to flex column layout (`display: flex; flex-direction: column; flex: 1`) with `.dashboard-body { flex: 1; min-height: 0; }` preventing row collision when filter bar is hidden.
- **A2. Filter Dropdown**: Standardized on sibling DOM model (`.filter-btn-wrap` + `.filter-drop.open`).
- **A3. KPI Panel Layout**: `.kpi-panel` updated to 4 rows (`grid-template-rows: auto minmax(0, 1fr) auto auto`) accommodating panel head, KPI grid, health bar, and validation strip.
- **A4. Component Hygiene**: Removed `.finding-card` and `findingCards` from all component patterns and template instructions.
- **A5. Missing CSS Classes**: Defined `.pill` (with `.ok`, `.warn`, `.err`, `.neutral`), `.btn.ghost`, `.date-filter-strip`, `.scope-bar-label`, and `.period-pulse-dot`.
- **A6. Tab Selectors**: Standardized `switchTab()` to support both `.tab-panel` and `.tab-pane`.
- **A7. Horizontal Bars**: Column grid changed to `minmax(110px, 38%) 1fr 66px` to prevent metric values and category labels from clipping.
- **A8. Tooltip Handlers**: Switched chart dots and bars from inline `onmouseenter` handlers to `data-tip` attributes with delegated `mousemove`/`focusin` listeners.
- **A9. HTML Escaping**: Added `esc()` HTML escaping across all DOM insertions and filter options.
- **A10. Filter Empty Values**: Empty category values render as `(none)` with real values preserved in dataset keys.
- **A11. CSV Parser**: Added UTF-8 BOM (`\uFEFF`) stripping, character state machine for quoted newlines and commas, and support for comma, semicolon, and tab delimiters.
- **A12. Excel Parser**: Reads first non-empty sheet, timezone-safe date conversion, and Excel serial number support.
- **A13. Empty State & File Reset**: Handled zero-result filter states cleanly; added `resetAll()` clearing open drawers, overlays, and stale charts on new file load.
- **A14. Animated Count-Up**: `countUp()` preserves scale and units across transitions.
- **A15. Typewriter Cadence**: `typeText()` duration capped with cancellation support on re-entry.
- **A16. Modal Accessibility**: Added `inert` attribute to background root when modal drawers and overlays are open, with reliable focus restoration on close.
- **A17. Period Drawer**: Replaced fixed 4-chip hardcoding with configurable 4–7 KPI chip arrays.
- **F2. Zero Fabricated Defaults**: Removed all hardcoded demo fallback numbers (`94.3%` compliance, fabricated progression array, hourly array, canned takeaway string, fixed 80/60 target lines) from drawer and template code. Sections hide cleanly if data is absent.

### Deprecated
- `get_shell_preservation_spec`: Deprecated in favor of `get_dashboard_kit`. Maintained for backwards compatibility in v2.x.
- `get_full_dashboard_template`: Deprecated in favor of `get_dashboard_kit`. Maintained for backwards compatibility in v2.x.
- `get_component_patterns`: Deprecated in favor of `get_dashboard_kit`. Maintained for backwards compatibility in v2.x.
- `get_js_utilities`: Deprecated in favor of `get_dashboard_kit`. Maintained for backwards compatibility in v2.x.

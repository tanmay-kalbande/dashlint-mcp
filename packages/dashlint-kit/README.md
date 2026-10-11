# dashlint-kit

Scaffold the reusable shell and browser utilities for a DashLint dashboard. The package creates files in the dashboard project so an AI coding agent can focus on dataset-specific calculations and rendering.

## Use

```bash
npx dashlint-kit components
npx dashlint-kit init
```

`components` prints a compact catalog. `init` creates `index.html`, `runtime.js`, `app.js`, `components.json`, `catalog.json`, `domain.json`, and `DASHLINT_KIT.md` in the current directory. It will stop rather than overwrite any of those files. `components.json` contains implementation details only for selected patterns; `catalog.json` is the short reference list.

To create a new directory and select a domain:

```bash
npx dashlint-kit init my-dashboard --domain service-ops
```

Choose optional visual patterns for the dataset; `core` selects the standard dashboard patterns:

```bash
npx dashlint-kit init my-dashboard --components core,analysisStudio,heatmap,dayComparator
```

Available patterns also include `trendCharts`, `flowDiagram`, `periodComparison`, `scenarioLab`, `insightFeed`, `leaderboard`, `geoInsights`, and `scopeFilters`, plus `analysisStudio`, `heatmap`, `overlays`, `drawers`, `dayDrawer`, and `dayComparator`. These are data-agnostic UI patterns: agents map labels, measures, and interactions to the uploaded dataset. `geoInsights` requires real coordinates/geographic shapes; `scenarioLab` requires an explicit, defensible model formula. The Analysis Studio pivot and new patterns share the MCP kit's design tokens and HTML/CSS source. The npm pack step syncs these canonical source files, so MCP inline output and npm-generated dashboards use the same implementation.

Supported domains are `generic`, `service-ops`, and `sales-distribution`. Domain packs provide labels and examples; they do not limit the analysis an agent can build.

Add dataset-specific calculations and `renderDashboard()` in `app.js`. The CSV and Excel parsers process uploads locally in the browser. The source dataset is not sent to DashLint.

Build and check the standalone output:

```bash
npx dashlint-kit build
npx dashlint-kit lint dashboard.html
```

`build` embeds the local runtime and dashboard code in `dashboard.html`. The generated HTML still loads SheetJS and fonts from their public CDNs.

## Publishing from this repository

The package source is synchronized from the MCP kit modules when npm packs it. From this directory:

```bash
npm whoami
npm pack --dry-run
npm publish --access public
```

The first successful public publish claims the unscoped `dashlint-kit` name. Update the package version in `package.json` before publishing a later release.

## License

MIT

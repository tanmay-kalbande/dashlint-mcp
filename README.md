# DashLint MCP Server

> Dashboard creation orchestration for AI coding assistants. The assistant reads the user's data and builds an interactive dashboard; DashLint supplies the detailed workflow and design instructions.

## Connect

```json
{
  "mcpServers": {
    "dashlint": {
      "url": "https://dashlint.tanmaysk.in/mcp"
    }
  }
}
```

No API keys or installation are required.

## Primary workflow

1. Call `get_dashboard_creation_workflow()` first.
2. The AI assistant reads the user's data directly from the message or project, profiles it, and calculates defensible insights locally. **Do not send the dataset to DashLint MCP.**
3. Call `build_dashboard_blueprint()` with only column names, inferred types, optional null/distinct counts, audience, and business question. **Never send rows or sample values.** Verify the returned suggestions locally.
4. Inspect the existing project and the SLA Pulse / Incident Pulse references. Use the supplied app shell code as the source of truth.
5. Call `get_dashboard_kit()` and try its default `npx dashlint-kit` setup path first. If npm is unavailable or the package cannot be installed or run, call `get_dashboard_kit(mode: "inline")` and use the returned kit directly through MCP.
6. Build a reusable downloadable HTML dashboard. Use the shared dataset to design defensible field mappings, formulas, and insight-generation rules, but never embed its rows or precomputed results. The opened app starts in an upload state and recalculates all views from the end user's local CSV or Excel upload.
7. Use the focused playbooks as needed and finish with `get_dashboard_completion_checklist()`.

The MCP is an orchestration layer with a schema-aware blueprint tool: it accepts only column metadata to tailor the implementation plan, never file rows. It does not calculate dataset findings or write project files. The AI coding assistant owns analysis and implementation. The generated downloadable HTML app parses CSV and Excel files locally in the browser and does not send their contents to DashLint or another service.

## MCP tools

| Tool | Status | Purpose |
|------|--------|---------|
| `get_dashboard_creation_workflow()` | Active | Start here; returns the end-to-end workflow and all playbooks in one response. |
| `build_dashboard_blueprint(fields, businessQuestion?, audience?, rowCount?)` | Active (v2.0) | Schema-aware implementation blueprint: single justified roles per field, additivity classes, default aggregations, grain detection, ratio formulas, local checks, and askUser questions. Accepts no row data or sample values. |
| `get_dashboard_kit(components?, domain?, brand?, credit?, mode?)` | Active (v2.0) | Defaults to the npm package workflow (`npx dashlint-kit`). If npm or the package is unavailable, request `mode: "inline"` for the regular MCP-only kit, targeted to a 35 KB budget. |
| `get_version()` | Active (v2.0) | Returns DashLint MCP server version (2.0.0), supported features, and compatibility matrix. |
| `get_data_insight_playbook()` | Active | Local data profiling, metric, insight, and uncertainty instructions. |
| `get_dashboard_composition_playbook()` | Active | Adaptive narrative, layout, chart selection, and visual hierarchy. |
| `get_dashboard_interaction_playbook()` | Active | Upload, filters, cross-filtering, drawers, responsive and accessibility behavior. |
| `get_dashboard_completion_checklist()` | Active | Final data, shell, interaction, and responsive review. |
| `get_shell_preservation_spec()` | Deprecated | Legacy shell contract. Prefer `get_dashboard_kit()`. |
| `get_full_dashboard_template()` | Deprecated | Legacy wireframe template. Prefer `get_dashboard_kit()`. |
| `get_component_patterns(components)` | Deprecated | Legacy component CSS/HTML snippets. Prefer `get_dashboard_kit()`. |
| `get_js_utilities()` | Deprecated | Legacy pre-wired JavaScript utilities. Prefer `get_dashboard_kit()`. |

No tool accepts raw rows, files, or datasets. The assistant creates and edits dashboard files in the user's project.

After a deployment, refresh or reconnect the MCP client so it discovers the current tool list. The retired design-system and dashboard-planning tools are no longer exposed.

## Try the sample data

The website includes two downloadable, fictional CSV datasets that demonstrate the intended use cases:

- `public/samples/contact-center-interactions.csv` — interaction-level contact center records for queue, service level, abandonment, agent, and demand patterns. Duration fields use milliseconds.
- `public/samples/incident-operations.csv` — incident-level service desk records for resolution time, SLA, backlog, priority, category, and assignment group.

Download a sample from the website and attach it directly to your AI coding assistant with the sample prompt. The assistant reads and analyzes it locally; DashLint never receives the CSV.

## The stable shell

The SLA Pulse and Incident Pulse HTML apps are the visual and interaction references. Preserve the viewport frame, dark left rail, brand and dataset snapshot, header structure, right-aligned upload/drop target, navigation, and fixed overlay/drawer patterns. The shell tool returns starter frame CSS, sidebar markup, and sidebar CSS when no existing shell is present; preserve actual project shell code verbatim when available. Keep a continuous border on all four outer edges, prevent document/page scrolling, and contain any needed overflow inside the dashboard body, sidebar metric list, tables, or drawers. Keep the reference `built by Tanmay Kalbande` LinkedIn credit at the very bottom of the sidebar. The main area below the header stays free for dataset-specific summaries, charts, insight cards, comparisons, and tables.

DashLint is domain-agnostic: there is no fixed set of supported dashboard types, metric packs, formulas, or chart families. The AI should follow the user's question and the data, using blueprint classifications and chart ideas only as non-exhaustive suggestions. It can build custom, domain-specific analysis when the fields support it.

The palette can follow the host app or be configured per request. The shell and its interaction model remain consistent.

## Local development

```bash
npm install
npm run dev
```

The MCP endpoint is served from `/api/mcp` and exposed at `/mcp` by the project routing configuration.

## Deployment

Deploy on Vercel or another compatible Next.js host. The optional usage counter uses Vercel KV/Upstash when configured. No LLM credentials or data-processing backend are needed for dashboard creation orchestration.

## License

MIT

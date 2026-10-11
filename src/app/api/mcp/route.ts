import { createMcpHandler } from "mcp-handler";
import { z } from "zod";
import {
  DASHBOARD_COMPOSITION_PLAYBOOK,
  DASHBOARD_COMPLETION_CHECKLIST,
  DASHBOARD_INTERACTION_PLAYBOOK,
  DATA_INSIGHT_PLAYBOOK,
  getDashboardGenerationGuide,
} from "@/lib/generation-guide";
import { DASHBOARD_SHELL_CONTRACT } from "@/lib/shell-contract";
import { getFullDashboardTemplate, JS_UTILITIES } from "@/lib/dashboard-template";
import { getComponentPatterns, getAvailableComponents } from "@/lib/shell-contract";
import { incrementCounter } from "@/lib/counter";
import { buildDashboardBlueprint } from "@/lib/blueprint";
import { buildDashboardKit } from "@/lib/dashboard-kit";

const noInput = z.object({}).strict();

const blueprintInput = z.object({
  datasetLabel: z.string().trim().max(100).optional(),
  businessQuestion: z.string().trim().max(500).optional(),
  audience: z.string().trim().max(120).optional(),
  rowCount: z.number().int().nonnegative().optional(),
  fields: z.array(z.object({
    name: z.string().trim().min(1).max(100),
    type: z.enum(["date", "datetime", "number", "currency", "percentage", "boolean", "category", "identifier", "text", "unknown"]),
    distinctCount: z.number().int().nonnegative().optional(),
    nullablePercent: z.number().min(0).max(100).optional(),
    numericSummary: z.object({
      min: z.number().optional(),
      max: z.number().optional(),
      mean: z.number().optional(),
    }).strict().optional(),
    dateRange: z.object({
      min: z.string().optional(),
      max: z.string().optional(),
    }).strict().optional(),
  }).strict()).min(1).max(100),
}).strict();

const dashboardKitInput = z.object({
  components: z.array(z.string().trim().min(1).max(50)).optional(),
  domain: z.enum(["generic", "service-ops", "sales-distribution"]).optional(),
  brand: z.object({
    title: z.string().trim().max(100).optional(),
    subtitle: z.string().trim().max(200).optional(),
    kicker: z.string().trim().max(50).optional(),
  }).strict().optional(),
  credit: z.union([
    z.enum(["default", "none"]),
    z.object({
      text: z.string().trim().min(1).max(100),
      url: z.string().url().max(300).optional(),
    }).strict(),
  ]).optional(),
  mode: z.enum(["cli", "inline"]).default("cli"),
}).strict();

const handler = createMcpHandler((server) => {
  server.registerTool(
    "get_dashboard_creation_workflow",
    {
      description:
        "Start here for every DashLint dashboard task. Returns the orchestrated workflow (steps, guardrails, input handling) and a tool map listing which focused playbooks to call at each step. Call the individual tools for detailed guidance; they are not bundled here. The AI assistant reads/analyzes the user's local data and implements the dashboard; do not pass dataset rows to MCP tools.",
      inputSchema: noInput,
    },
    async () => {
      await incrementCounter("get_dashboard_creation_workflow");
      return { content: [{ type: "text" as const, text: JSON.stringify(getDashboardGenerationGuide(), null, 2) }] };
    }
  );

  server.registerTool(
    "build_dashboard_blueprint",
    {
      description:
        "Create a schema-aware implementation blueprint (v2.0) from locally profiled column metadata. Send only field names, inferred types, distinct counts, nullable percents, row count, and opt-in summary metrics (never dataset rows, samples, or identifiers). Returns single justified roles per field, additivity classes, default aggregations, grain detection, ratio recomputation formulas, local data checks, and askUser questions.",
      inputSchema: blueprintInput,
    },
    async (input) => {
      await incrementCounter("build_dashboard_blueprint");
      return { content: [{ type: "text" as const, text: JSON.stringify(buildDashboardBlueprint(input), null, 2) }] };
    }
  );

  server.registerTool(
    "get_dashboard_kit",
    {
      description:
        "Primary dashboard assembly tool. Defaults to npm package instructions for npx dashlint-kit and runtime API docs. If npm is unavailable or package installation/commands fail, call again with mode 'inline' for the regular starter code, domain packs, and JS utilities. Inline output targets a 35 KB budget.",
      inputSchema: dashboardKitInput,
    },
    async (input) => {
      await incrementCounter("get_dashboard_kit");
      return { content: [{ type: "text" as const, text: JSON.stringify(buildDashboardKit(input), null, 2) }] };
    }
  );

  server.registerTool(
    "get_version",
    {
      description:
        "Returns the DashLint MCP server and dashboard-kit version, supported features, and compatibility matrix.",
      inputSchema: noInput,
    },
    async () => {
      await incrementCounter("get_version");
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            serverVersion: "2.0.0",
            minKitVersion: "2.0.0",
            protocolVersion: "2024-11-05",
            features: [
              "blueprint-v2",
              "dashboard-kit",
              "privacy-first",
              "domain-neutral",
              "configurable-credit",
              "single-screen-layout",
              "zero-fabricated-defaults",
            ],
            manifest: "src/lib/tools.manifest.json",
          }, null, 2),
        }],
      };
    }
  );

  server.registerTool(
    "get_shell_preservation_spec",
    {
      description:
        "[DEPRECATED: Prefer get_dashboard_kit] Returns the complete design system and shell contract derived from the Incident Pulse React dashboard (the canonical design reference). Includes: designTokens, darkOverlayTokens, frameCode, sidebarMarkupTemplate/sidebarCssTemplate, componentPatterns, and invariants. Use the returned code verbatim when building new dashboards.",
      inputSchema: noInput,
    },
    async () => {
      await incrementCounter("get_shell_preservation_spec");
      return { content: [{ type: "text" as const, text: JSON.stringify(DASHBOARD_SHELL_CONTRACT, null, 2) }] };
    }
  );

  server.registerTool(
    "get_data_insight_playbook",
    {
      description:
        "Returns instructions for the AI assistant to inspect user-provided data locally, verify row grain/data quality, calculate defensible business insights, and communicate uncertainty. It does not accept or analyze data itself.",
      inputSchema: noInput,
    },
    async () => {
      await incrementCounter("get_data_insight_playbook");
      return { content: [{ type: "text" as const, text: JSON.stringify(DATA_INSIGHT_PLAYBOOK, null, 2) }] };
    }
  );

  server.registerTool(
    "get_dashboard_composition_playbook",
    {
      description:
        "Returns adaptive story structure, chart-selection guidance, and visual hierarchy principles. Dashboard body can vary by dataset; the application shell remains fixed.",
      inputSchema: noInput,
    },
    async () => {
      await incrementCounter("get_dashboard_composition_playbook");
      return { content: [{ type: "text" as const, text: JSON.stringify(DASHBOARD_COMPOSITION_PLAYBOOK, null, 2) }] };
    }
  );

  server.registerTool(
    "get_dashboard_interaction_playbook",
    {
      description:
        "Returns concrete requirements for local CSV and Excel upload, live recalculation from each uploaded file, filters, chart selection/cross-filtering, detail drawers, responsive behavior, accessibility, and empty/error states. The reusable HTML dashboard must not hardcode the analyzed dataset's rows or results.",
      inputSchema: noInput,
    },
    async () => {
      await incrementCounter("get_dashboard_interaction_playbook");
      return { content: [{ type: "text" as const, text: JSON.stringify(DASHBOARD_INTERACTION_PLAYBOOK, null, 2) }] };
    }
  );

  server.registerTool(
    "get_dashboard_completion_checklist",
    {
      description:
        "Returns the final review checklist for data correctness, evidence, shell preservation, the upload control's original position, working interactions, responsive layout, and completion.",
      inputSchema: noInput,
    },
    async () => {
      await incrementCounter("get_dashboard_completion_checklist");
      return { content: [{ type: "text" as const, text: JSON.stringify(DASHBOARD_COMPLETION_CHECKLIST, null, 2) }] };
    }
  );

  server.registerTool(
    "get_full_dashboard_template",
    {
      description:
        "[DEPRECATED: Prefer get_dashboard_kit] Returns a lightweight HTML wireframe with ONLY the fixed application shell: design tokens CSS, viewport frame, dark sidebar (brand + metrics + animated credit), header with 56px dashed upload box, nav tabs container, empty dashboard body, and slide-drawer shell.",
      inputSchema: noInput,
    },
    async () => {
      await incrementCounter("get_full_dashboard_template");
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            wireframe: getFullDashboardTemplate(),
            availableComponents: getAvailableComponents(),
            nextSteps: [
              "1. Replace {{PLACEHOLDER}} markers with your brand/dataset values (title, logo letters, subtitle).",
              "2. Profile your dataset and decide which components you need.",
              "3. Call get_dashboard_kit or get_component_patterns with the component names you need.",
              "4. Call get_js_utilities for pre-wired CSV/Excel parser, animations, filter engine, drawer, and upload handler.",
              "5. Paste the component CSS into the <style> block and the JS utilities into the <script> block.",
              "6. Add your tab panels, KPI cards, charts, and tables using the HTML snippets.",
              "7. Implement renderDashboard() with your dataset-specific calculations and data bindings.",
            ],
          }, null, 2),
        }],
      };
    }
  );

  server.registerTool(
    "get_component_patterns",
    {
      description:
        "[DEPRECATED: Prefer get_dashboard_kit] Returns CSS, HTML snippets, and usage notes for specific dashboard components. Available components: kpiCards, panels, horizontalBars, dataTables, validation, badges, buttons, generatedOutput, multiSelectFilter, heatmap, overlays, drawers, chartContainer, sectionLayouts, accessibility, healthBar, dayDrawer, dayComparator, chartTooltip, trendCharts, flowDiagram, periodComparison, scenarioLab, insightFeed, leaderboard, geoInsights, scopeFilters. These are generic patterns: map labels and calculations to the dataset; geoInsights needs real coordinates/geography and scenarioLab needs a defensible formula. Never generate piles of text cards.",
      inputSchema: z.object({
        components: z.array(z.string().trim().min(1).max(50)).min(1).max(25).describe("Array of component names to retrieve."),
      }).strict(),
    },
    async (input) => {
      await incrementCounter("get_component_patterns");
      const patterns = getComponentPatterns(input.components);
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            components: patterns,
            integration: "Paste each component's CSS into the wireframe's <style> block. Use the HTML snippets as templates — replace {{PLACEHOLDER}} markers with actual values. Follow the usage notes for correct structure.",
          }, null, 2),
        }],
      };
    }
  );

  server.registerTool(
    "get_js_utilities",
    {
      description:
        "[DEPRECATED: Prefer get_dashboard_kit] Returns pre-wired JavaScript utilities for dashboard interactivity. Includes: global state management, CSV parser, SheetJS Excel parser, countUp(), typeText(), tab switching, filter engine, drawers, overlays, chart tooltips, and file upload.",
      inputSchema: noInput,
    },
    async () => {
      await incrementCounter("get_js_utilities");
      return {
        content: [{
          type: "text" as const,
          text: JSON.stringify({
            utilities: JS_UTILITIES,
            usage: [
              "Paste the utilities code into the <script> block of the wireframe template.",
              "The code provides a global state object S with raw[], filtered[], columns[], fileName, filters{}, activeTab, drawerOpen.",
              "Implement renderDashboard() — it's called automatically on file upload and filter changes.",
              "Use countUp(element, targetValue, {prefix, suffix, decimals, duration}) for animated KPI values.",
              "Use typeText(element, text, callback) for streaming text in generated output panels.",
              "Use buildFilterButton(columnName, containerElement) in loadData() for each filterable column.",
              "Use openDrawer(title, htmlContent) and closeDrawer() for detail drill-downs.",
              "Use openDayDrawer(dayTitle, stats) and closeDayDrawer() for intraday laboratory and root-cause breakdown.",
              "Use openAnalyticsOverlay(subtabId), closeAnalyticsOverlay(), and switchOverlayTab(tabId) for analytics layers.",
              "Use openAnalysisStudio() and closeAnalysisStudio() for the Analysis Studio pivot workbench overlay. It auto-detects categorical vs numeric columns from S.columns and builds an interactive pivot table with metric chips, shelf controls, in-cell distribution bars, CSV export, and cell-click drilldown.",
              "Use showChartTooltip(x, y, html) and hideChartTooltip() for interactive chart hover probes.",
              "All utilities respect prefers-reduced-motion automatically.",
            ],
          }, null, 2),
        }],
      };
    }
  );

});

export { handler as GET, handler as POST };

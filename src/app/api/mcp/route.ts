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
import { DASHBOARD_KIT_VERSION, SERVER_VERSION } from "@/lib/versions";
import toolsManifest from "@/lib/tools.manifest.json";
import { logger } from "@/lib/logger";
import { sanitizeObject } from "@/lib/sanitize";

// ---------------------------------------------------------------------------
// Response cache for static tool outputs
// ---------------------------------------------------------------------------
const responseCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string, compute: () => T): T {
  const cached = responseCache.get(key);
  const now = Date.now();
  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.data as T;
  }
  const data = compute();
  responseCache.set(key, { data, timestamp: now });
  return data;
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// MCP error response helper
// ---------------------------------------------------------------------------
function mcpError(toolOrError: string | unknown, maybeError?: unknown) {
  const toolName = typeof toolOrError === "string" ? toolOrError : "mcp_tool";
  const e = typeof toolOrError === "string" ? maybeError : toolOrError;
  logger.error(`MCP tool '${toolName}' threw an error`, {
    tool: toolName,
    error: e instanceof Error ? e : String(e),
  });
  return {
    content: [{
      type: "text" as const,
      text: JSON.stringify({
        error: "INTERNAL_ERROR",
        message: e instanceof Error ? e.message : "Unknown error",
      }),
    }],
    isError: true,
  };
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
const handler = createMcpHandler((server) => {

  // =========================================================================
  // Resources
  // =========================================================================

  server.registerResource(
    "sample-contact-center",
    "dashlint://samples/contact-center-interactions",
    {
      title: "Contact Center Interactions Sample",
      description: "Interaction-level contact center records for queue, service level, abandonment, agent, and demand patterns. Duration fields use milliseconds. Download from the DashLint website.",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify({
          name: "contact-center-interactions.csv",
          description: "Interaction-level contact center records for queue, service level, abandonment, agent, and demand patterns. Duration fields use milliseconds.",
          downloadUrl: "https://dashlint.tanmaysk.in/samples/contact-center-interactions.csv",
          domain: "service-ops",
          samplePrompt: "Inspect the attached data and build an interactive dashboard following the DashLint MCP workflow. Call the MCP tools step-by-step — do not skip any playbooks or the completion checklist. Keep all raw data rows on my machine.",
        }, null, 2),
      }],
    })
  );

  server.registerResource(
    "sample-incident-operations",
    "dashlint://samples/incident-operations",
    {
      title: "Incident Operations Sample",
      description: "Incident-level service desk records for resolution time, SLA, backlog, priority, category, and assignment group.",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [{
        uri: uri.href,
        mimeType: "application/json",
        text: JSON.stringify({
          name: "incident-operations.csv",
          description: "Incident-level service desk records for resolution time, SLA, backlog, priority, category, and assignment group.",
          downloadUrl: "https://dashlint.tanmaysk.in/samples/incident-operations.csv",
          domain: "service-ops",
          samplePrompt: "Inspect the attached data and build an interactive dashboard following the DashLint MCP workflow. Call the MCP tools step-by-step — do not skip any playbooks or the completion checklist. Keep all raw data rows on my machine.",
        }, null, 2),
      }],
    })
  );

  server.registerResource(
    "changelog",
    "dashlint://changelog",
    {
      title: "DashLint Changelog",
      description: "Version history and notable changes for the DashLint MCP server.",
      mimeType: "text/markdown",
    },
    async (uri) => ({
      contents: [{
        uri: uri.href,
        mimeType: "text/markdown",
        text: `# DashLint MCP Server v${SERVER_VERSION}\n\n## Key Features\n- Blueprint v2.0: Schema-aware field classification with additivity, grain detection, and ratio recomputation\n- Dashboard Kit: npm package (npx dashlint-kit) with inline fallback\n- Privacy-first: No dataset rows are ever sent or stored\n- Domain-neutral: Works with any dataset domain\n- Configurable credit/attribution system\n\nFull changelog: https://dashlint.tanmaysk.in`,
      }],
    })
  );

  server.registerResource(
    "tool-manifest",
    "dashlint://manifest",
    {
      title: "DashLint Tool Manifest",
      description: "Complete list of all DashLint MCP tools with schemas and deprecation status.",
      mimeType: "application/json",
    },
    async (uri) => {
      return {
        contents: [{
          uri: uri.href,
          mimeType: "application/json",
          text: JSON.stringify(toolsManifest, null, 2),
        }],
      };
    }
  );

  // =========================================================================
  // Prompts
  // =========================================================================

  server.registerPrompt(
    "create_dashboard",
    {
      title: "Create Dashboard",
      description: "Step-by-step prompt to create an interactive dashboard from user data using the DashLint MCP workflow.",
      argsSchema: z.object({
        dataDescription: z.string().optional().describe("Brief description of the dataset (e.g., 'sales transactions CSV with 5000 rows')"),
        businessQuestion: z.string().optional().describe("The primary question or decision this dashboard should answer"),
      }),
    },
    async ({ dataDescription, businessQuestion }) => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: `${dataDescription ? `I have the following data: ${dataDescription}. ` : ""}${businessQuestion ? `Key question: ${businessQuestion}. ` : ""}Inspect the attached data and build an interactive dashboard following the DashLint MCP workflow. Call the MCP tools step-by-step:\n\n1. Start with get_dashboard_creation_workflow()\n2. Profile the data locally and call build_dashboard_blueprint() with column metadata only\n3. Call get_dashboard_kit() for the app shell and components\n4. Use the playbooks (data insight, composition, interaction) as needed\n5. Finish with get_dashboard_completion_checklist()\n\nDo not skip any playbooks or the completion checklist. Keep all raw data rows on my machine.`,
          },
        },
      ],
    })
  );

  server.registerPrompt(
    "review_dashboard",
    {
      title: "Review Dashboard",
      description: "Review an existing DashLint dashboard against the completion checklist for data correctness, shell preservation, and interaction quality.",
    },
    async () => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: "Review the current dashboard against the DashLint completion checklist. Call get_dashboard_completion_checklist() and verify:\n\n1. Data correctness: All KPIs and metrics recompute from uploaded data, no hardcoded values\n2. Shell preservation: Viewport frame, sidebar, header, upload control, and navigation are intact\n3. Interactions: Upload, filters, chart selections, drawers, and cross-filtering work correctly\n4. Responsive layout: Dashboard works across viewport sizes without document scrolling\n5. Accessibility: Keyboard navigation, prefers-reduced-motion, and focus management\n\nReport any violations with specific fix instructions.",
          },
        },
      ],
    })
  );

  // =========================================================================
  // Tools
  // =========================================================================

  server.registerTool(
    "get_dashboard_creation_workflow",
    {
      description:
        "Start here for every DashLint dashboard task. Returns the orchestrated workflow (steps, guardrails, input handling) and a tool map listing which focused playbooks to call at each step. Call the individual tools for detailed guidance; they are not bundled here. The AI assistant reads/analyzes the user's local data and implements the dashboard; do not pass dataset rows to MCP tools.",
      inputSchema: noInput,
      annotations: {
        title: "Get Dashboard Creation Workflow",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        await incrementCounter("get_dashboard_creation_workflow");
        const data = getCached("get_dashboard_creation_workflow", () => getDashboardGenerationGuide());
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      } catch (e) {
        return mcpError(e);
      }
    }
  );

  server.registerTool(
    "build_dashboard_blueprint",
    {
      description:
        "Create a schema-aware implementation blueprint (v2.0) from locally profiled column metadata. Send only field names, inferred types, distinct counts, nullable percents, row count, and opt-in summary metrics (never dataset rows, samples, or identifiers). Returns single justified roles per field, additivity classes, default aggregations, grain detection, ratio recomputation formulas, local data checks, and askUser questions.",
      inputSchema: blueprintInput,
      annotations: {
        title: "Build Dashboard Blueprint",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (input) => {
      try {
        await incrementCounter("build_dashboard_blueprint");
        const cleanInput = sanitizeObject(input);
        return { content: [{ type: "text" as const, text: JSON.stringify(buildDashboardBlueprint(cleanInput), null, 2) }] };
      } catch (e) {
        return mcpError("build_dashboard_blueprint", e);
      }
    }
  );

  server.registerTool(
    "get_dashboard_kit",
    {
      description:
        "Primary dashboard assembly tool. Defaults to npm package instructions for npx dashlint-kit and runtime API docs. If npm is unavailable or package installation/commands fail, call again with mode 'inline' for the regular starter code, domain packs, and JS utilities. Inline output targets a 35 KB budget.",
      inputSchema: dashboardKitInput,
      annotations: {
        title: "Get Dashboard Kit",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (input) => {
      try {
        await incrementCounter("get_dashboard_kit");
        return { content: [{ type: "text" as const, text: JSON.stringify(buildDashboardKit(input), null, 2) }] };
      } catch (e) {
        return mcpError(e);
      }
    }
  );

  server.registerTool(
    "get_version",
    {
      description:
        "Returns the DashLint MCP server and dashboard-kit version, supported features, and compatibility matrix.",
      inputSchema: noInput,
      annotations: {
        title: "Get Version",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        await incrementCounter("get_version");
        const data = getCached("get_version", () => ({
          serverVersion: SERVER_VERSION,
          dashboardKitVersion: DASHBOARD_KIT_VERSION,
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
        }));
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify(data, null, 2),
          }],
        };
      } catch (e) {
        return mcpError(e);
      }
    }
  );

  server.registerTool(
    "get_shell_preservation_spec",
    {
      description:
        "[DEPRECATED: Prefer get_dashboard_kit] Returns the complete design system and shell contract derived from the Incident Pulse React dashboard (the canonical design reference). Includes: designTokens, darkOverlayTokens, frameCode, sidebarMarkupTemplate/sidebarCssTemplate, componentPatterns, and invariants. Use the returned code verbatim when building new dashboards.",
      inputSchema: noInput,
      annotations: {
        title: "[Deprecated] Shell Preservation Spec",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        await incrementCounter("get_shell_preservation_spec");
        const data = getCached("get_shell_preservation_spec", () => DASHBOARD_SHELL_CONTRACT);
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      } catch (e) {
        return mcpError(e);
      }
    }
  );

  server.registerTool(
    "get_data_insight_playbook",
    {
      description:
        "Returns instructions for the AI assistant to inspect user-provided data locally, verify row grain/data quality, calculate defensible business insights, and communicate uncertainty. It does not accept or analyze data itself.",
      inputSchema: noInput,
      annotations: {
        title: "Get Data Insight Playbook",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        await incrementCounter("get_data_insight_playbook");
        const data = getCached("get_data_insight_playbook", () => DATA_INSIGHT_PLAYBOOK);
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      } catch (e) {
        return mcpError(e);
      }
    }
  );

  server.registerTool(
    "get_dashboard_composition_playbook",
    {
      description:
        "Returns adaptive story structure, chart-selection guidance, and visual hierarchy principles. Dashboard body can vary by dataset; the application shell remains fixed.",
      inputSchema: noInput,
      annotations: {
        title: "Get Dashboard Composition Playbook",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        await incrementCounter("get_dashboard_composition_playbook");
        const data = getCached("get_dashboard_composition_playbook", () => DASHBOARD_COMPOSITION_PLAYBOOK);
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      } catch (e) {
        return mcpError(e);
      }
    }
  );

  server.registerTool(
    "get_dashboard_interaction_playbook",
    {
      description:
        "Returns concrete requirements for local CSV and Excel upload, live recalculation from each uploaded file, filters, chart selection/cross-filtering, detail drawers, responsive behavior, accessibility, and empty/error states. The reusable HTML dashboard must not hardcode the analyzed dataset's rows or results.",
      inputSchema: noInput,
      annotations: {
        title: "Get Dashboard Interaction Playbook",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        await incrementCounter("get_dashboard_interaction_playbook");
        const data = getCached("get_dashboard_interaction_playbook", () => DASHBOARD_INTERACTION_PLAYBOOK);
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      } catch (e) {
        return mcpError(e);
      }
    }
  );

  server.registerTool(
    "get_dashboard_completion_checklist",
    {
      description:
        "Returns the final review checklist for data correctness, evidence, shell preservation, the upload control's original position, working interactions, responsive layout, and completion.",
      inputSchema: noInput,
      annotations: {
        title: "Get Dashboard Completion Checklist",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        await incrementCounter("get_dashboard_completion_checklist");
        const data = getCached("get_dashboard_completion_checklist", () => DASHBOARD_COMPLETION_CHECKLIST);
        return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
      } catch (e) {
        return mcpError(e);
      }
    }
  );

  server.registerTool(
    "get_full_dashboard_template",
    {
      description:
        "[DEPRECATED: Prefer get_dashboard_kit] Returns a lightweight HTML wireframe with ONLY the fixed application shell: design tokens CSS, viewport frame, dark sidebar (brand + metrics + animated credit), header with 56px dashed upload box, nav tabs container, empty dashboard body, and slide-drawer shell.",
      inputSchema: noInput,
      annotations: {
        title: "[Deprecated] Full Dashboard Template",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        await incrementCounter("get_full_dashboard_template");
        const data = getCached("get_full_dashboard_template", () => ({
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
        }));
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify(data, null, 2),
          }],
        };
      } catch (e) {
        return mcpError(e);
      }
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
      annotations: {
        title: "[Deprecated] Component Patterns",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (input) => {
      try {
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
      } catch (e) {
        return mcpError(e);
      }
    }
  );

  server.registerTool(
    "get_js_utilities",
    {
      description:
        "[DEPRECATED: Prefer get_dashboard_kit] Returns pre-wired JavaScript utilities for dashboard interactivity. Includes: global state management, CSV parser, SheetJS Excel parser, countUp(), typeText(), tab switching, filter engine, drawers, overlays, chart tooltips, and file upload.",
      inputSchema: noInput,
      annotations: {
        title: "[Deprecated] JS Utilities",
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async () => {
      try {
        await incrementCounter("get_js_utilities");
        const data = getCached("get_js_utilities", () => ({
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
        }));
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify(data, null, 2),
          }],
        };
      } catch (e) {
        return mcpError(e);
      }
    }
  );

});

export { handler as GET, handler as POST };

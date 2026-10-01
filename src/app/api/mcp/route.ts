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
import { incrementCounter } from "@/lib/counter";
import { buildDashboardBlueprint } from "@/lib/blueprint";

const noInput = z.object({});
const blueprintInput = z.object({
  datasetLabel: z.string().trim().max(100).optional(),
  businessQuestion: z.string().trim().max(500).optional(),
  audience: z.string().trim().max(120).optional(),
  fields: z.array(z.object({
    name: z.string().trim().min(1).max(100),
    type: z.enum(["date", "datetime", "number", "currency", "percentage", "boolean", "category", "identifier", "text", "unknown"]),
    distinctCount: z.number().int().nonnegative().optional(),
    nullablePercent: z.number().min(0).max(100).optional(),
  }).strict()).min(1).max(100),
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
        "Create a schema-aware implementation blueprint from locally profiled column metadata. Send only field names, inferred types, optional distinct/null counts, the business question, and audience—never file rows or sample values. Returns candidate semantic mappings, metric formulas, chart plans, uncertainty warnings, and the reusable local HTML upload requirements.",
      inputSchema: blueprintInput,
    },
    async (input) => {
      await incrementCounter("build_dashboard_blueprint");
      return { content: [{ type: "text" as const, text: JSON.stringify(buildDashboardBlueprint(input), null, 2) }] };
    }
  );

  server.registerTool(
    "get_shell_preservation_spec",
    {
      description:
        "Returns the complete design system and shell contract derived from the Incident Pulse React dashboard (the canonical design reference). Includes: designTokens (full CSS variable palette), darkOverlayTokens (scoped dark theme), frameCode (viewport shell + scrollbar system), sidebarMarkupTemplate/sidebarCssTemplate (exact sidebar HTML/CSS), componentPatterns (header, upload, nav tabs, KPI cards, panels, tables, overlays, drawers, heatmaps, bars, badges, validation, buttons, accessibility), and invariants (viewport, typography, animation specs). Use the returned code verbatim when building new dashboards; preserve existing shell code when available.",
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

});

export { handler as GET, handler as POST };

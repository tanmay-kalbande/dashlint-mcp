import { getFullDashboardTemplate, JS_UTILITIES } from "./dashboard-template";
import { getComponentPatterns, CreditConfig } from "./shell-contract";
import { getDomainPack, DomainPack } from "./domain-packs";
import { DASHBOARD_KIT_VERSION } from "./versions";

export interface DashboardKitInput {
  components?: string[];
  domain?: "generic" | "service-ops" | "sales-distribution";
  brand?: {
    title?: string;
    subtitle?: string;
    kicker?: string;
  };
  credit?: CreditConfig;
  mode?: "cli" | "inline";
}

export interface DashboardKitOutput {
  version: string;
  mode: "cli" | "inline";
  stamp: string;
  cli?: {
    commands: Record<string, string>;
    runtimeApi: Record<string, unknown>;
    instructions: string;
  };
  inline?: {
    wireframe: string;
    components: Record<string, { css: string; html: string; usage: string }>;
    domainPack: DomainPack;
    utilities: string;
    budget: {
      totalBytes: number;
      totalKb: number;
      limitKb: number;
      status: "within_budget" | "exceeded_budget";
    };
  };
}

export function buildDashboardKit(input: DashboardKitInput): DashboardKitOutput {
  const version = DASHBOARD_KIT_VERSION;
  const stamp = `<!-- dashlint-kit v${version} -->`;
  const mode = input.mode || "cli";

  if (mode === "cli") {
    return {
      version,
      mode: "cli",
      stamp,
      cli: {
        commands: {
          components: "npx dashlint-kit components",
          init: `npx dashlint-kit init --domain ${input.domain || 'generic'} --components core`,
          build: "npx dashlint-kit build",
          lint: "npx dashlint-kit lint dashboard.html",
        },
        runtimeApi: {
          state: "window.S contains { raw[], filtered[], columns[], fileName, filters{}, activeTab, drawerOpen }",
          renderDashboard: "Implement renderDashboard() - invoked on data load and filter change",
          helpers: [
            "countUp(element, value, { prefix, suffix, decimals, duration })",
            "typeText(element, text, callback, { maxDuration })",
            "buildFilterButton(columnName, containerElement)",
            "openDrawer(title, htmlContent) / closeDrawer()",
            "openDayDrawer(title, stats) / closeDayDrawer()",
            "openAnalyticsOverlay(subtabId) / closeAnalyticsOverlay()",
            "openAnalysisStudio() / closeAnalysisStudio()",
            "showChartTooltip(x, y, html) / hideChartTooltip()",
            "applyFilters() / resetAll()",
          ],
        },
        instructions: "Use the npm package first. Run `npx dashlint-kit components` for the compact catalog, choose only patterns supported by the dataset, and scaffold with `npx dashlint-kit init --components core` plus selected names (for example, `--components core,analysisStudio,trendCharts,periodComparison`). Prefer data-driven generic patterns; include `geoInsights` only when valid coordinates/geography exist, and `scenarioLab` only when a defensible formula can be stated. These markup/CSS patterns come from the same canonical source used by MCP inline output; write the dataset-specific aggregation and interactions in app.js. Run `npx dashlint-kit build` to compile and `npx dashlint-kit lint` to verify invariants. If npm is unavailable, installation fails, or the package command is not recognized, call get_dashboard_kit again with mode `inline` and continue with the returned starter code.",
      },
    };
  }

  const requestedComponents = input.components && input.components.length > 0
    ? input.components
    : ['kpiCards', 'panels', 'horizontalBars', 'dataTables', 'validation', 'badges', 'buttons', 'generatedOutput', 'multiSelectFilter'];

  const componentsMap = getComponentPatterns(requestedComponents);
  const domainPack = getDomainPack(input.domain);
  const wireframe = getFullDashboardTemplate({
    brandTitle: input.brand?.title,
    brandSubtitle: input.brand?.subtitle,
    credit: input.credit,
  });

  let utilities = JS_UTILITIES;
  if (!requestedComponents.includes('dayDrawer')) {
    utilities = stripSection(utilities, 'dayDrawer');
  }
  if (!requestedComponents.includes('overlays')) {
    utilities = stripSection(utilities, 'overlays');
  }

  const cssSize = Object.values(componentsMap).reduce((sum, c) => sum + c.css.length, 0);
  const jsSize = utilities.length;
  const totalBytes = cssSize + jsSize;
  const totalKb = Math.round((totalBytes / 1024) * 10) / 10;
  const limitKb = 35;

  return {
    version,
    mode: "inline",
    stamp,
    inline: {
      wireframe: stamp + '\n' + wireframe,
      components: componentsMap,
      domainPack,
      utilities,
      budget: {
        totalBytes,
        totalKb,
        limitKb,
        status: totalKb <= limitKb ? "within_budget" : "exceeded_budget",
      },
    },
  };
}

function stripSection(source: string, name: string): string {
  const start = `// @section:${name}`;
  const end = `// @endsection:${name}`;
  const startIndex = source.indexOf(start);
  const endIndex = source.indexOf(end, startIndex + start.length);
  if (startIndex < 0 || endIndex < 0) {
    throw new Error(`Section markers for '${name}' not found`);
  }
  const afterEnd = endIndex + end.length;
  return source.slice(0, startIndex) + source.slice(afterEnd).replace(/^\r?\n/, '');
}

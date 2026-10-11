import { getFullDashboardTemplate, JS_UTILITIES } from "./dashboard-template";
import { getComponentPatterns, CreditConfig } from "./shell-contract";
import { getDomainPack, DomainPack } from "./domain-packs";

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
  const version = "2.0.0";
  const stamp = `<!-- dashlint-kit v${version} -->`;
  const mode = input.mode || "inline";

  if (mode === "cli") {
    return {
      version,
      mode: "cli",
      stamp,
      cli: {
        commands: {
          init: `npx dashlint-kit init [project-name] --domain ${input.domain || 'generic'}`,
          build: "npx dashlint-kit build",
          profile: "npx dashlint-kit profile dataset.csv",
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
        instructions: "Run `npx dashlint-kit init` to set up the project. You only need to write `app.js` with your dataset calculations and renderDashboard() logic. Run `npx dashlint-kit build` to compile the single-file dashboard, and `npx dashlint-kit lint` to verify invariants.",
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
    utilities = utilities.replace(/\/\/\s*──\s*Period \/ Day Drilldown Drawer[\s\S]*?(?=\/\/\s*──\s*Chart Hover Tooltip|$)/, '');
  }
  if (!requestedComponents.includes('overlays')) {
    utilities = utilities.replace(/\/\/\s*──\s*Analytics Overlay[\s\S]*?(?=\/\/\s*──|$)/, '');
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

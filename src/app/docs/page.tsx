"use client";

import { useState, useMemo, useEffect } from "react";
import manifest from "@/lib/tools.manifest.json";

const MCP_URL = "https://dashlint.tanmaysk.in/mcp";

type Prop = {
  type?: string;
  description?: string;
  items?: Record<string, unknown>;
  enum?: string[];
  properties?: Record<string, unknown>;
};

type Tool = {
  name: string;
  description: string;
  deprecated: boolean;
  inputSchema: {
    type?: string;
    properties?: Record<string, Prop>;
    required?: string[];
  };
};

const tools = (manifest as unknown as { tools: Tool[] }).tools;

const RESOURCES = [
  {
    uri: "dashlint://samples/contact-center-interactions.csv",
    name: "contact-center-interactions.csv",
    mimeType: "text/csv",
    description:
      "Sample contact center operational log: 50,000 interactions across voice, chat, email with handle times, CSAT scores, resolution rates, and agent metadata for testing KPI cards and breakdown charts.",
  },
  {
    uri: "dashlint://samples/incident-operations.csv",
    name: "incident-operations.csv",
    mimeType: "text/csv",
    description:
      "Sample DevOps / SRE incident stream: P1-P4 incidents with MTTA, MTTR, escalation flags, severity levels, affected microservices, and on-call response timelines.",
  },
  {
    uri: "dashlint://changelog",
    name: "changelog",
    mimeType: "text/markdown",
    description:
      "Release history, breaking changes, schema migrations, and version announcements for the DashLint MCP Server.",
  },
  {
    uri: "dashlint://manifest",
    name: "manifest",
    mimeType: "application/json",
    description:
      "Complete machine-readable JSON schema descriptor for all DashLint MCP tools, resources, annotations, and parameters.",
  },
];

const PROMPTS = [
  {
    name: "create_dashboard",
    title: "Create Interactive Dashboard",
    description:
      "End-to-end prompt template that guides any MCP-compatible AI assistant to inspect local data, call DashLint workflow tools, generate the blueprint, and output a complete single-file HTML dashboard.",
    arguments: [
      { name: "data_description", description: "Summary of columns, business questions, and target KPI metrics.", required: true },
      { name: "theme_preference", description: "Visual style: 'dark', 'light', or 'system'.", required: false },
    ],
    template: `Here is my data: {data_description}. Build an interactive, self-contained dashboard following the DashLint MCP workflow. Call the MCP tools step-by-step: first get the creation workflow, then generate the schema-aware blueprint, consult the playbooks, and verify against the completion checklist before delivering the HTML file. Keep all raw data rows on my machine.`,
  },
  {
    name: "review_dashboard",
    title: "Review Dashboard Against Checklist",
    description:
      "Audits an existing HTML dashboard against DashLint's 14-point production checklist (data accuracy, reactivity, filter state preservation, export fidelity, and accessibility).",
    arguments: [
      { name: "dashboard_code", description: "The complete HTML/JS code of the dashboard to inspect.", required: true },
    ],
    template: `Review the following dashboard code against DashLint's get_dashboard_completion_checklist: {dashboard_code}. Verify that zero data leaks off the host machine, KPI formulas use safe division, all charts respond to active cross-filters, and the export function works offline.`,
  },
];

type CodeTab = "claude" | "sdk" | "jsonrpc" | "schema";

function toolSnippet(tool: Tool, tab: CodeTab): string {
  const props = tool.inputSchema.properties ?? {};
  const hasProps = Object.keys(props).length > 0;
  const sample = hasProps
    ? Object.fromEntries(
        Object.entries(props).map(([k, v]) => [
          k,
          v.type === "string"
            ? `<${k}>`
            : v.type === "array"
            ? []
            : v.type === "number"
            ? 0
            : v.type === "boolean"
            ? false
            : {},
        ])
      )
    : {};
  const args = JSON.stringify(sample, null, 2);

  if (tab === "claude") return `// Assistant calls DashLint MCP tool\nawait mcp.callTool("${tool.name}", ${args});`;
  if (tab === "sdk")
    return `import { DashLint } from "dashlint-sdk";\n\nconst dl = new DashLint({ endpoint: "${MCP_URL}" });\nconst result = await dl.callTool("${tool.name}", ${args});`;
  if (tab === "jsonrpc")
    return JSON.stringify(
      { jsonrpc: "2.0", id: 1, method: "tools/call", params: { name: tool.name, arguments: sample } },
      null,
      2
    );
  return JSON.stringify(tool.inputSchema, null, 2);
}

const SDK_EXAMPLE = `import { DashLint } from "dashlint-sdk";

const dl = new DashLint({
  endpoint: "${MCP_URL}"
});

// 1. Get workflow orchestration
const workflow = await dl.getWorkflow();

// 2. Generate schema-aware blueprint
const blueprint = await dl.buildBlueprint({
  fields: [
    { name: "timestamp", type: "datetime" },
    { name: "csat_score", type: "number", min: 1, max: 5 },
    { name: "channel", type: "category", distinctCount: 4 }
  ],
  kpiIntent: "Maximize CSAT score and track volume"
});

console.log("Generated blueprint:", blueprint);`;

const CONFIG_JSON = `{
  "mcpServers": {
    "dashlint": {
      "url": "${MCP_URL}"
    }
  }
}`;

/* ---------- small pieces ---------- */

function Console({
  label,
  body,
  copied,
  onCopy,
  tabs,
}: {
  label?: string;
  body: string;
  copied: boolean;
  onCopy: () => void;
  tabs?: { value: string; label: string; active: boolean; onClick: () => void }[];
}) {
  return (
    <div className="dl-console">
      <div className="dl-console-head">
        <div className="dl-console-left">
          <span className="dl-dots">
            <i />
            <i />
            <i />
          </span>
          {tabs ? (
            <div className="dl-tabs">
              {tabs.map((t) => (
                <button key={t.value} className={`dl-tab ${t.active ? "on" : ""}`} onClick={t.onClick}>
                  {t.label}
                </button>
              ))}
            </div>
          ) : (
            <span className="dl-mono dl-console-label">{label}</span>
          )}
        </div>
        <button className="dl-btn dl-btn-sm" onClick={onCopy}>
          {copied ? "Copied \u2713" : "Copy"}
        </button>
      </div>
      <pre className="dl-code">{body}</pre>
    </div>
  );
}

export default function DocsPage() {
  const [selectedId, setSelectedId] = useState<string>("overview");
  const [search, setSearch] = useState<string>("");
  const [codeTab, setCodeTab] = useState<CodeTab>("claude");
  const [copied, setCopied] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    document.body.classList.add("subpage-body");
    return () => document.body.classList.remove("subpage-body");
  }, []);

  const q = search.trim().toLowerCase();
  const match = (s: string) => !q || s.toLowerCase().includes(q);

  const coreTools = useMemo(() => tools.filter((t) => !t.deprecated), []);
  const legacyTools = useMemo(() => tools.filter((t) => t.deprecated), []);
  const filteredCore = coreTools.filter((t) => match(t.name) || match(t.description));
  const filteredLegacy = legacyTools.filter((t) => match(t.name) || match(t.description));
  const filteredRes = RESOURCES.filter((r) => match(r.name) || match(r.description));
  const filteredPrompts = PROMPTS.filter((p) => match(p.name) || match(p.description));

  const activeTool = tools.find((t) => t.name === selectedId);
  const activeResource = RESOURCES.find((r) => r.name === selectedId);
  const activePrompt = PROMPTS.find((p) => p.name === selectedId);

  const copy = (key: string, text: string) => {
    try {
      navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
    setCopied(key);
    setTimeout(() => setCopied(""), 1800);
  };

  const go = (id: string) => {
    setSelectedId(id);
    setMenuOpen(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  };

  const NavBtn = ({ id, children, legacy }: { id: string; children: React.ReactNode; legacy?: boolean }) => (
    <button className={`dl-nav-item ${selectedId === id ? "on" : ""}`} onClick={() => go(id)}>
      <span className="dl-nav-dot" />
      <span className="dl-nav-text">{children}</span>
      {legacy && <span className="dl-legacy">legacy</span>}
    </button>
  );

  const crumb =
    selectedId === "overview"
      ? "overview"
      : selectedId === "quickstart"
      ? "quickstart"
      : selectedId === "sdk"
      ? "typescript sdk"
      : selectedId;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap');

        html, body {
          display: block !important;
          height: auto !important;
          min-height: 100vh !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          padding: 0 !important;
          margin: 0 !important;
          grid-template-columns: none !important;
        }

        .dl-root {
          --bg: #0b0b0c;
          --panel: #111113;
          --panel-2: #151518;
          --line: #232529;
          --line-2: #2e3138;
          --text: #f3f4f6;
          --muted: #8b8f98;
          --dim: #5b5f68;
          --accent: #8b93a7;
          --chip: #171a21;
          --chip-text: #9aa3b8;
          --primary-bg: #f3f4f6;
          --primary-text: #0b0b0c;
          --code-bg: #0d0d0f;
          --ok: #34d399;
          --warn: #fbbf24;
          --bad: #f87171;
          font-family: Inter, system-ui, sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
          padding: 24px;
          display: grid;
          grid-template-columns: 340px minmax(0, 1fr);
          gap: 24px;
          box-sizing: border-box;
        }
        .dl-root[data-theme="light"] {
          --bg: #f1f1ee;
          --panel: #fbfbf9;
          --panel-2: #f4f4f1;
          --line: #dcdcd6;
          --line-2: #c9c9c2;
          --text: #121214;
          --muted: #62666f;
          --dim: #8d9099;
          --accent: #5c6479;
          --chip: #ecece7;
          --chip-text: #4b5266;
          --primary-bg: #121214;
          --primary-text: #fbfbf9;
          --code-bg: #f4f4f1;
          --ok: #0f9d6b;
          --warn: #b7791f;
          --bad: #d1433f;
        }
        .dl-root *, .dl-root *::before, .dl-root *::after { box-sizing: border-box; }
        .dl-mono { font-family: 'IBM Plex Mono', ui-monospace, monospace; }

        /* ---------- panels ---------- */
        .dl-panel {
          background: var(--panel);
          border: 1px solid var(--line);
          border-radius: 16px;
        }

        /* ---------- sidebar ---------- */
        .dl-side {
          position: sticky;
          top: 24px;
          height: calc(100vh - 48px);
          display: flex;
          flex-direction: column;
          padding: 24px 20px 20px;
          overflow: hidden;
        }
        .dl-brand {
          display: flex; align-items: center; gap: 16px;
          text-decoration: none; color: inherit; margin-bottom: 22px;
        }
        .dl-logo {
          width: 52px; height: 52px; border-radius: 12px;
          border: 1px solid var(--line-2); background: var(--panel-2);
          display: grid; place-items: center;
          font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 18px;
        }
        .dl-brand-name {
          font-family: 'Barlow Condensed', Inter, sans-serif;
          font-weight: 800; font-size: 26px; letter-spacing: 0.14em; line-height: 1;
        }
        .dl-brand-sub {
          font-family: 'IBM Plex Mono', monospace; font-size: 12px;
          color: var(--dim); margin-top: 6px; letter-spacing: 0.04em;
        }
        .dl-label {
          font-family: 'IBM Plex Mono', monospace; font-size: 11px;
          letter-spacing: 0.2em; text-transform: uppercase; color: var(--dim);
          margin: 0 0 10px;
        }
        .dl-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 18px; }
        .dl-stat {
          border: 1px solid var(--line); background: var(--panel-2);
          border-radius: 10px; padding: 10px 12px;
        }
        .dl-stat b { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 20px; font-weight: 600; }
        .dl-stat span {
          font-family: 'IBM Plex Mono', monospace; font-size: 9.5px;
          letter-spacing: 0.14em; text-transform: uppercase; color: var(--dim);
        }
        .dl-search {
          width: 100%; background: var(--panel-2); border: 1px solid var(--line);
          border-radius: 10px; padding: 10px 12px; color: var(--text);
          font-size: 13px; outline: none; font-family: 'IBM Plex Mono', monospace;
          margin-bottom: 14px;
        }
        .dl-search::placeholder { color: var(--dim); }
        .dl-search:focus { border-color: var(--accent); }

        .dl-nav { flex: 1; overflow-y: auto; padding-right: 4px; margin-right: -4px; }
        .dl-nav::-webkit-scrollbar { width: 5px; }
        .dl-nav::-webkit-scrollbar-thumb { background: var(--line-2); border-radius: 4px; }
        .dl-group { margin-bottom: 18px; }
        .dl-nav-item {
          display: flex; align-items: center; gap: 12px; width: 100%;
          text-align: left; background: none; border: 1px solid transparent;
          color: var(--muted); padding: 7px 10px; border-radius: 8px;
          font-size: 13.5px; cursor: pointer; font-family: inherit;
          transition: background .15s, color .15s;
        }
        .dl-nav-item:hover { color: var(--text); background: var(--panel-2); }
        .dl-nav-item.on { color: var(--text); background: var(--panel-2); border-color: var(--line-2); }
        .dl-nav-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--line-2); flex-shrink: 0; }
        .dl-nav-item.on .dl-nav-dot { background: var(--text); }
        .dl-nav-text {
          flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
        }
        .dl-nav-item.code .dl-nav-text, .dl-nav-text.m { font-family: 'IBM Plex Mono', monospace; font-size: 12.5px; }
        .dl-legacy {
          font-family: 'IBM Plex Mono', monospace; font-size: 9px; letter-spacing: .08em;
          text-transform: uppercase; padding: 1px 5px; border-radius: 4px;
          color: var(--bad); border: 1px solid var(--line-2);
        }

        .dl-side-foot { padding-top: 14px; border-top: 1px solid var(--line); display: grid; gap: 10px; }
        .dl-primary {
          width: 100%; border: none; cursor: pointer;
          background: var(--primary-bg); color: var(--primary-text);
          border-radius: 10px; padding: 13px; font-size: 15px; font-weight: 600; font-family: inherit;
        }
        .dl-primary:hover { opacity: .9; }
        .dl-npm {
          display: flex; align-items: center; gap: 12px;
          border: 1px solid var(--line); background: var(--panel-2); border-radius: 10px; padding: 10px 14px;
        }
        .dl-npm-logo { font-family: 'IBM Plex Mono', monospace; font-weight: 700; color: #e0352b; font-size: 18px; letter-spacing: -.04em; }
        .dl-npm b { display: block; font-family: 'IBM Plex Mono', monospace; font-size: 12px; font-weight: 600; }
        .dl-npm span { font-family: 'IBM Plex Mono', monospace; font-size: 11px; color: var(--dim); }

        /* ---------- right column ---------- */
        .dl-col { display: flex; flex-direction: column; gap: 24px; min-width: 0; }
        .dl-top {
          display: flex; align-items: center; justify-content: space-between;
          gap: 16px; padding: 14px 18px 14px 28px; flex-wrap: wrap;
        }
        .dl-crumb { font-family: 'IBM Plex Mono', monospace; font-size: 16px; color: var(--muted); letter-spacing: .03em; display: flex; gap: 10px; align-items: center; min-width: 0; }
        .dl-crumb b { color: var(--text); font-weight: 500; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 46vw; }
        .dl-top-actions { display: flex; gap: 10px; align-items: center; flex-wrap: wrap; }
        .dl-btn {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1px solid var(--line-2); background: var(--panel-2); color: var(--text);
          border-radius: 8px; padding: 12px 20px; font-size: 15px; font-weight: 600;
          cursor: pointer; text-decoration: none; font-family: inherit; transition: background .15s;
        }
        .dl-btn:hover { background: var(--line); }
        .dl-btn.solid { background: var(--primary-bg); color: var(--primary-text); border-color: var(--primary-bg); }
        .dl-btn.solid:hover { opacity: .9; background: var(--primary-bg); }
        .dl-btn.icon { padding: 0; width: 44px; height: 44px; justify-content: center; font-size: 16px; }
        .dl-btn-sm { padding: 5px 10px; font-size: 11.5px; font-weight: 500; border-radius: 6px; color: var(--muted); }
        .dl-burger { display: none; }

        .dl-content { padding: 48px 56px 56px; min-height: 60vh; }
        .dl-chip {
          display: inline-block; font-family: 'IBM Plex Mono', monospace; font-size: 12px;
          letter-spacing: .18em; text-transform: uppercase; color: var(--chip-text);
          background: var(--chip); border: 1px solid var(--line); border-radius: 4px; padding: 7px 12px;
        }
        .dl-chip-row { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px; }
        .dl-chip.ok { color: var(--ok); }
        .dl-chip.warn { color: var(--warn); }
        .dl-chip.bad { color: var(--bad); }
        .dl-h1 {
          font-family: 'Barlow Condensed', Inter, sans-serif; font-weight: 800;
          text-transform: uppercase; line-height: .95; letter-spacing: -.005em;
          font-size: clamp(44px, 6.4vw, 96px); margin: 0 0 24px; word-break: break-word;
        }
        .dl-h1 .soft { color: var(--accent); display: block; }
        .dl-h1.tool { font-size: clamp(34px, 4.4vw, 64px); }
        .dl-lead { font-size: 18px; line-height: 1.65; color: var(--muted); max-width: 760px; margin: 0 0 32px; }
        .dl-lead b { color: var(--text); font-weight: 600; }

        .dl-steps { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 36px; }
        .dl-step {
          font-family: 'IBM Plex Mono', monospace; font-size: 14px; letter-spacing: .04em;
          border: 1px solid var(--line); background: var(--panel-2); border-radius: 8px; padding: 12px 16px;
        }
        .dl-step em { font-style: normal; color: var(--dim); margin: 0 6px; }

        .dl-split { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 24px; align-items: start; }
        .dl-stack { display: grid; gap: 16px; }
        .dl-card { border: 1px solid var(--line); background: var(--panel-2); border-radius: 12px; padding: 20px; }
        .dl-card-title {
          font-family: 'IBM Plex Mono', monospace; font-size: 11px; letter-spacing: .2em;
          text-transform: uppercase; color: var(--dim); margin: 0 0 14px;
        }
        .dl-card h3 { margin: 0 0 6px; font-size: 16px; font-weight: 600; }
        .dl-card p { margin: 0; font-size: 14px; line-height: 1.6; color: var(--muted); }
        .dl-card code, .dl-lead code {
          font-family: 'IBM Plex Mono', monospace; font-size: 12px;
          background: var(--chip); border: 1px solid var(--line); border-radius: 4px; padding: 1px 6px; color: var(--text);
        }
        .dl-grid2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .dl-inline-pre {
          margin: 12px 0 0; background: var(--code-bg); border: 1px solid var(--line);
          border-radius: 8px; padding: 12px 14px; font-family: 'IBM Plex Mono', monospace;
          font-size: 12.5px; color: var(--text); overflow-x: auto;
        }
        .dl-list { margin: 0; padding-left: 18px; color: var(--muted); font-size: 14px; line-height: 1.9; }

        .dl-param { padding: 14px 0; border-bottom: 1px solid var(--line); }
        .dl-param:first-of-type { padding-top: 0; }
        .dl-param:last-child { border-bottom: none; padding-bottom: 0; }
        .dl-param-name { font-family: 'IBM Plex Mono', monospace; font-weight: 600; font-size: 13.5px; }
        .dl-param-type { font-family: 'IBM Plex Mono', monospace; font-size: 11.5px; color: var(--dim); margin-left: 8px; }
        .dl-req {
          font-family: 'IBM Plex Mono', monospace; font-size: 9.5px; letter-spacing: .08em; text-transform: uppercase;
          color: var(--bad); border: 1px solid var(--line-2); border-radius: 4px; padding: 1px 5px; margin-left: 8px;
        }
        .dl-param-desc { margin-top: 6px; font-size: 13.5px; line-height: 1.55; color: var(--muted); }
        .dl-enums { display: flex; gap: 6px; flex-wrap: wrap; margin-top: 8px; }
        .dl-ann { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-family: 'IBM Plex Mono', monospace; font-size: 12px; color: var(--dim); }
        .dl-ann b { color: var(--ok); font-weight: 600; }
        .dl-empty { color: var(--dim); font-size: 13.5px; font-style: italic; }

        /* console */
        .dl-console { border: 1px solid var(--line); background: var(--code-bg); border-radius: 12px; overflow: hidden; position: sticky; top: 24px; }
        .dl-console-head {
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
          padding: 10px 12px; border-bottom: 1px solid var(--line); background: var(--panel-2); flex-wrap: wrap;
        }
        .dl-console-left { display: flex; align-items: center; gap: 12px; min-width: 0; }
        .dl-console-label { font-size: 12px; color: var(--muted); }
        .dl-dots { display: flex; gap: 5px; }
        .dl-dots i { width: 9px; height: 9px; border-radius: 50%; display: block; opacity: .85; }
        .dl-dots i:nth-child(1) { background: #ef4444; }
        .dl-dots i:nth-child(2) { background: #eab308; }
        .dl-dots i:nth-child(3) { background: #22c55e; }
        .dl-tabs { display: flex; gap: 2px; background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 3px; flex-wrap: wrap; }
        .dl-tab {
          background: none; border: none; color: var(--muted); font-size: 11.5px; font-weight: 500;
          padding: 5px 10px; border-radius: 5px; cursor: pointer; font-family: inherit;
        }
        .dl-tab:hover { color: var(--text); }
        .dl-tab.on { background: var(--line); color: var(--text); font-weight: 600; }
        .dl-code {
          margin: 0; padding: 16px; font-family: 'IBM Plex Mono', monospace; font-size: 12.5px;
          line-height: 1.65; color: var(--text); overflow: auto; max-height: 520px; white-space: pre;
        }

        .dl-foot {
          display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap;
          font-family: 'IBM Plex Mono', monospace; font-size: 13px; letter-spacing: .06em; color: var(--dim);
          padding: 0 8px 8px;
        }
        .dl-foot a { color: var(--dim); text-decoration: none; }
        .dl-foot a:hover { color: var(--text); }

        /* ---------- responsive ---------- */
        @media (max-width: 1280px) {
          .dl-root { grid-template-columns: 300px minmax(0, 1fr); }
          .dl-content { padding: 36px 32px 44px; }
        }
        @media (max-width: 1080px) {
          .dl-split { grid-template-columns: 1fr; }
          .dl-console { position: static; }
        }
        @media (max-width: 900px) {
          .dl-root { grid-template-columns: 1fr; padding: 14px; gap: 14px; }
          .dl-side {
            position: fixed; inset: 14px; z-index: 60; height: auto;
            display: none; box-shadow: 0 20px 60px rgba(0,0,0,.6);
          }
          .dl-side.open { display: flex; }
          .dl-burger { display: inline-flex; }
          .dl-top { padding: 12px 14px; }
          .dl-crumb { font-size: 14px; }
          .dl-content { padding: 28px 18px 36px; }
          .dl-lead { font-size: 16px; }
          .dl-hide-m { display: none; }
        }
      `}</style>

      <div className="dl-root" data-theme={theme} id="docs-root">
        {/* ---------------- SIDEBAR ---------------- */}
        <aside className={`dl-panel dl-side ${menuOpen ? "open" : ""}`}>
          <a href="/" className="dl-brand">
            <span className="dl-logo">D/</span>
            <span>
              <div className="dl-brand-name">DASHLINT</div>
              <div className="dl-brand-sub">{tools.length} tools · remote MCP</div>
            </span>
          </a>

          <div className="dl-label">At a glance</div>
          <div className="dl-stats">
            <div className="dl-stat">
              <b>{tools.length}</b>
              <span>Tools</span>
            </div>
            <div className="dl-stat">
              <b>{RESOURCES.length}</b>
              <span>Resources</span>
            </div>
            <div className="dl-stat">
              <b>{PROMPTS.length}</b>
              <span>Prompts</span>
            </div>
          </div>

          <input
            className="dl-search"
            type="text"
            placeholder="Search tools, prompts… (blueprint)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <nav className="dl-nav">
            <div className="dl-group">
              <div className="dl-label">Getting started</div>
              <NavBtn id="overview">Overview &amp; Architecture</NavBtn>
              <NavBtn id="quickstart">Quickstart &amp; AI Clients</NavBtn>
              <NavBtn id="sdk">TypeScript SDK</NavBtn>
            </div>

            {filteredCore.length > 0 && (
              <div className="dl-group">
                <div className="dl-label">Core workflow tools ({filteredCore.length})</div>
                {filteredCore.map((t) => (
                  <button key={t.name} className={`dl-nav-item code ${selectedId === t.name ? "on" : ""}`} onClick={() => go(t.name)}>
                    <span className="dl-nav-dot" />
                    <span className="dl-nav-text">{t.name}</span>
                  </button>
                ))}
              </div>
            )}

            {filteredRes.length > 0 && (
              <div className="dl-group">
                <div className="dl-label">MCP resources ({filteredRes.length})</div>
                {filteredRes.map((r) => (
                  <button key={r.name} className={`dl-nav-item code ${selectedId === r.name ? "on" : ""}`} onClick={() => go(r.name)}>
                    <span className="dl-nav-dot" />
                    <span className="dl-nav-text">{r.name}</span>
                  </button>
                ))}
              </div>
            )}

            {filteredPrompts.length > 0 && (
              <div className="dl-group">
                <div className="dl-label">MCP prompts ({filteredPrompts.length})</div>
                {filteredPrompts.map((p) => (
                  <button key={p.name} className={`dl-nav-item code ${selectedId === p.name ? "on" : ""}`} onClick={() => go(p.name)}>
                    <span className="dl-nav-dot" />
                    <span className="dl-nav-text">{p.name}</span>
                  </button>
                ))}
              </div>
            )}

            {filteredLegacy.length > 0 && (
              <div className="dl-group">
                <div className="dl-label">Playbooks &amp; utilities ({filteredLegacy.length})</div>
                {filteredLegacy.map((t) => (
                  <button key={t.name} className={`dl-nav-item code ${selectedId === t.name ? "on" : ""}`} onClick={() => go(t.name)}>
                    <span className="dl-nav-dot" />
                    <span className="dl-nav-text">{t.name}</span>
                    <span className="dl-legacy">legacy</span>
                  </button>
                ))}
              </div>
            )}
          </nav>

          <div className="dl-side-foot">
            <button className="dl-primary" onClick={() => copy("url", MCP_URL)}>
              {copied === "url" ? "Copied \u2713" : "Copy MCP URL"}
            </button>
            <a className="dl-npm" href="https://www.npmjs.com/package/dashlint-kit" target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "inherit" }}>
              <span className="dl-npm-logo">npm</span>
              <span>
                <b>Standalone kit</b>
                <span>npx dashlint-kit init</span>
              </span>
            </a>
          </div>
        </aside>

        {/* ---------------- RIGHT COLUMN ---------------- */}
        <div className="dl-col">
          <header className="dl-panel dl-top">
            <div className="dl-crumb">
              <span>dashlint</span>
              <span>/</span>
              <span>docs</span>
              <span>/</span>
              <b>{crumb}</b>
            </div>
            <div className="dl-top-actions">
              <button className="dl-btn dl-burger" onClick={() => setMenuOpen((v) => !v)} aria-label="Menu">
                {menuOpen ? "\u2715" : "\u2630"}
              </button>
              <button
                className="dl-btn icon"
                onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                aria-label="Toggle theme"
                title="Toggle theme"
              >
                {theme === "dark" ? "\u2600" : "\u263E"}
              </button>
              <a href="/" className="dl-btn solid dl-hide-m">How to use</a>
              <a href="/docs" className="dl-btn dl-hide-m">Docs</a>
              <a href="https://linkedin.com/in/tanmay-kalbande" target="_blank" rel="noopener noreferrer" className="dl-btn">
                {"LinkedIn \u2197"}
              </a>
            </div>
          </header>

          <main className="dl-panel dl-content">
            {/* ---------- OVERVIEW ---------- */}
            {selectedId === "overview" && (
              <div>
                <div className="dl-chip-row">
                  <span className="dl-chip">MCP server · v2.0.0 · API docs</span>
                </div>
                <h1 className="dl-h1">
                  Docs for the
                  <span className="soft">DashLint MCP.</span>
                </h1>
                <p className="dl-lead">
                  <b>DashLint</b> is an orchestration Model Context Protocol server that lets Claude, Cursor, ChatGPT, Windsurf and custom agents build <b>reusable, interactive single-file HTML dashboards</b> from your local data. Your rows stay on your machine.
                </p>

                <div className="dl-steps">
                  <span className="dl-step">1<em>·</em>Share data + question</span>
                  <span className="dl-step">2<em>·</em>AI calls DashLint</span>
                  <span className="dl-step">3<em>·</em>Reusable dashboard</span>
                </div>

                <div className="dl-grid2">
                  <div className="dl-card">
                    <h3>Zero data sent</h3>
                    <p>Raw rows, PII and files never leave your machine. The assistant profiles columns locally and passes only aggregate metadata to get design blueprints.</p>
                  </div>
                  <div className="dl-card">
                    <h3>{tools.length} schema-aware tools</h3>
                    <p>
                      Annotated with <code>readOnlyHint</code> and <code>idempotentHint</code> so assistants can cache calls and run safe autonomous loops.
                    </p>
                  </div>
                  <div className="dl-card">
                    <h3>Standalone HTML output</h3>
                    <p>Dashboards run in any modern browser with no node, python or server. CSV and Excel are parsed client-side, fully offline.</p>
                  </div>
                  <div className="dl-card">
                    <h3>Production hardened</h3>
                    <p>Token-bucket rate limiting (120 req/min), HMAC-verified webhooks, Redis circuit-breaker failover and sanitized payload handlers.</p>
                  </div>
                </div>

                <div className="dl-card">
                  <div className="dl-card-title">Endpoint configuration</div>
                  <pre className="dl-inline-pre" style={{ margin: 0 }}>{`MCP Transport: Streamable HTTP POST / Server-Sent Events (SSE)
MCP URL:       ${MCP_URL}
Protocol Spec: 2025-03-26 (Annotations, Prompts, Resources support)`}</pre>
                </div>
              </div>
            )}

            {/* ---------- QUICKSTART ---------- */}
            {selectedId === "quickstart" && (
              <div>
                <div className="dl-chip-row">
                  <span className="dl-chip">Getting started · no API key</span>
                </div>
                <h1 className="dl-h1">
                  Connect your
                  <span className="soft">AI assistant.</span>
                </h1>
                <p className="dl-lead">Connect DashLint to any MCP-compliant client in under 30 seconds. No API keys, no account.</p>

                <div className="dl-split">
                  <div className="dl-stack">
                    <div className="dl-card">
                      <h3>Claude Desktop / Claude Code</h3>
                      <p>
                        Go to <b>Settings → Connectors → Add custom connector</b> and paste the MCP URL.
                      </p>
                    </div>
                    <div className="dl-card">
                      <h3>Cursor IDE</h3>
                      <p>
                        Open Cursor Settings → Features → MCP Servers → Add new MCP server. Set the type to <code>command</code> or <code>sse</code> and use the URL.
                      </p>
                    </div>
                    <div className="dl-card">
                      <h3>Standalone CLI kit</h3>
                      <p>Scaffold the runtime and shell template on your machine without an MCP client:</p>
                      <pre className="dl-inline-pre">npx dashlint-kit init</pre>
                    </div>
                  </div>
                  <Console
                    label="claude_desktop_config.json"
                    body={CONFIG_JSON}
                    copied={copied === "cfg"}
                    onCopy={() => copy("cfg", CONFIG_JSON)}
                  />
                </div>
              </div>
            )}

            {/* ---------- SDK ---------- */}
            {selectedId === "sdk" && (
              <div>
                <div className="dl-chip-row">
                  <span className="dl-chip">SDK · TypeScript</span>
                </div>
                <h1 className="dl-h1 tool">dashlint-sdk</h1>
                <p className="dl-lead">Lightweight, zero-dependency TypeScript client for using DashLint orchestration from agents, pipelines and server backends.</p>

                <div className="dl-split">
                  <div className="dl-stack">
                    <div className="dl-card">
                      <div className="dl-card-title">Installation</div>
                      <pre className="dl-inline-pre" style={{ margin: 0 }}>npm install dashlint-sdk</pre>
                    </div>
                    <div className="dl-card">
                      <div className="dl-card-title">Client features</div>
                      <ul className="dl-list">
                        <li>Type-safe tool calls over native JSON-RPC 2.0</li>
                        <li>Automatic retry with exponential backoff &amp; circuit breakers</li>
                        <li>Local data profiling helpers</li>
                        <li>MCP Prompts and Resources support</li>
                      </ul>
                    </div>
                  </div>
                  <Console label="example.ts" body={SDK_EXAMPLE} copied={copied === "sdk"} onCopy={() => copy("sdk", SDK_EXAMPLE)} />
                </div>
              </div>
            )}

            {/* ---------- RESOURCE ---------- */}
            {activeResource && (
              <div>
                <div className="dl-chip-row">
                  <span className="dl-chip">Resource</span>
                  <span className="dl-chip ok">{activeResource.mimeType}</span>
                </div>
                <h1 className="dl-h1 tool">{activeResource.name}</h1>
                <p className="dl-lead">{activeResource.description}</p>

                <div className="dl-split">
                  <div className="dl-stack">
                    <div className="dl-card">
                      <div className="dl-card-title">URI descriptor</div>
                      <pre className="dl-inline-pre" style={{ margin: 0 }}>{activeResource.uri}</pre>
                    </div>
                    <div className="dl-card">
                      <div className="dl-card-title">Usage in assistant context</div>
                      <p>
                        Assistants read this resource through the MCP <code>resources/read</code> endpoint to test dashboard generation against realistic multi-column operational data.
                      </p>
                    </div>
                  </div>
                  {(() => {
                    const body = JSON.stringify(
                      { jsonrpc: "2.0", id: 1, method: "resources/read", params: { uri: activeResource.uri } },
                      null,
                      2
                    );
                    return <Console label="JSON-RPC request" body={body} copied={copied === "res"} onCopy={() => copy("res", body)} />;
                  })()}
                </div>
              </div>
            )}

            {/* ---------- PROMPT ---------- */}
            {activePrompt && (
              <div>
                <div className="dl-chip-row">
                  <span className="dl-chip">Prompt template</span>
                </div>
                <h1 className="dl-h1 tool">{activePrompt.name}</h1>
                <p className="dl-lead">{activePrompt.description}</p>

                <div className="dl-split">
                  <div className="dl-card">
                    <div className="dl-card-title">Template arguments</div>
                    {activePrompt.arguments.map((a) => (
                      <div key={a.name} className="dl-param">
                        <span className="dl-param-name">{a.name}</span>
                        {a.required && <span className="dl-req">required</span>}
                        <div className="dl-param-desc">{a.description}</div>
                      </div>
                    ))}
                  </div>
                  <Console
                    label="prompt template"
                    body={activePrompt.template}
                    copied={copied === "prompt"}
                    onCopy={() => copy("prompt", activePrompt.template)}
                  />
                </div>
              </div>
            )}

            {/* ---------- TOOL ---------- */}
            {activeTool && (
              <div>
                <div className="dl-chip-row">
                  <span className="dl-chip">Tool</span>
                  <span className="dl-chip ok">Read-only</span>
                  <span className="dl-chip warn">Idempotent</span>
                  {activeTool.deprecated && <span className="dl-chip bad">Deprecated</span>}
                </div>
                <h1 className="dl-h1 tool">{activeTool.name}()</h1>
                <p className="dl-lead">{activeTool.description}</p>

                <div className="dl-split">
                  <div className="dl-stack">
                    <div className="dl-card">
                      <div className="dl-card-title">Input parameters</div>
                      {activeTool.inputSchema.properties && Object.keys(activeTool.inputSchema.properties).length > 0 ? (
                        Object.entries(activeTool.inputSchema.properties).map(([key, prop]) => {
                          const isReq = activeTool.inputSchema.required?.includes(key);
                          return (
                            <div key={key} className="dl-param">
                              <span className="dl-param-name">{key}</span>
                              <span className="dl-param-type">{prop.type || (prop.enum ? "enum" : "object")}</span>
                              {isReq && <span className="dl-req">required</span>}
                              {prop.description && <div className="dl-param-desc">{prop.description}</div>}
                              {prop.enum && (
                                <div className="dl-enums">
                                  {prop.enum.map((e) => (
                                    <code key={e} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, background: "var(--chip)", border: "1px solid var(--line)", borderRadius: 4, padding: "1px 6px" }}>
                                      {e}
                                    </code>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div className="dl-empty">
                          This tool takes no parameters. Call it with an empty object: <code>{"{}"}</code>
                        </div>
                      )}
                    </div>

                    <div className="dl-card">
                      <div className="dl-card-title">Tool annotations</div>
                      <div className="dl-ann">
                        <div>readOnlyHint: <b>true</b></div>
                        <div>destructiveHint: <b>false</b></div>
                        <div>idempotentHint: <b>true</b></div>
                        <div>openWorldHint: <b>false</b></div>
                      </div>
                    </div>
                  </div>

                  {(() => {
                    const body = toolSnippet(activeTool, codeTab);
                    const mk = (value: CodeTab, label: string) => ({
                      value,
                      label,
                      active: codeTab === value,
                      onClick: () => setCodeTab(value),
                    });
                    return (
                      <Console
                        body={body}
                        copied={copied === "tool"}
                        onCopy={() => copy("tool", body)}
                        tabs={[mk("claude", "Claude Tool"), mk("sdk", "TypeScript SDK"), mk("jsonrpc", "JSON-RPC"), mk("schema", "Schema")]}
                      />
                    );
                  })()}
                </div>
              </div>
            )}
          </main>

          <footer className="dl-foot">
            <span>Free · open source · MIT</span>
            <span>
              <a href="/docs">Docs</a> · <a href="/terms">Terms</a> · <a href="/privacy">Privacy</a> · Built with DashLint
            </span>
          </footer>
        </div>
      </div>
    </>
  );
}

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
    <div style={{
      border: "1px solid var(--ln)",
      background: "#0c0d10",
      borderRadius: "8px",
      overflow: "hidden",
      position: "sticky",
      top: 0,
      zIndex: 10,
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        padding: "8px 12px",
        borderBottom: "1px solid var(--ln)",
        background: "var(--sf)",
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 5, paddingLeft: 2 }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444", opacity: 0.85, display: "inline-block" }} />
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#eab308", opacity: 0.85, display: "inline-block" }} />
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", opacity: 0.85, display: "inline-block" }} />
          </div>
          {tabs ? (
            <div style={{ display: "flex", gap: 2, background: "var(--bg)", border: "1px solid var(--ln)", borderRadius: 6, padding: 2 }}>
              {tabs.map((t) => (
                <button
                  key={t.value}
                  style={{
                    background: t.active ? "var(--sf)" : "none",
                    border: "none",
                    color: t.active ? "var(--ink)" : "var(--mu)",
                    fontSize: 11,
                    fontWeight: t.active ? 600 : 500,
                    padding: "4px 8px",
                    borderRadius: 4,
                    cursor: "pointer",
                    fontFamily: "var(--sans)",
                  }}
                  onClick={t.onClick}
                >
                  {t.label}
                </button>
              ))}
            </div>
          ) : (
            <span style={{ fontSize: 11, color: "var(--mu)", fontFamily: "var(--mono)" }}>{label}</span>
          )}
        </div>
        <button
          className="btn g sm"
          style={{ height: 26, padding: "0 8px", fontSize: 11 }}
          onClick={onCopy}
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <pre style={{
        margin: 0,
        padding: 14,
        fontFamily: "var(--mono)",
        fontSize: 11.5,
        lineHeight: 1.6,
        color: "var(--ink)",
        overflow: "auto",
        maxHeight: 460,
        whiteSpace: "pre",
      }}>{body}</pre>
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
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("dl-theme") as "dark" | "light" | null;
      if (stored === "light" || stored === "dark") {
        setTheme(stored);
        document.documentElement.dataset.theme = stored;
      }
    } catch {
      /* ignore */
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      localStorage.setItem("dl-theme", next);
      document.documentElement.dataset.theme = next;
    } catch {
      /* ignore */
    }
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(MCP_URL);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 1600);
    } catch {
      /* ignore */
    }
  };

  const copy = (key: string, text: string) => {
    try {
      navigator.clipboard.writeText(text);
    } catch {
      /* ignore */
    }
    setCopied(key);
    setTimeout(() => setCopied(""), 1800);
  };

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

  const go = (id: string) => {
    setSelectedId(id);
    setMenuOpen(false);
    const mainEl = document.querySelector(".doc-main-cluster");
    if (mainEl) mainEl.scrollTop = 0;
  };

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
      {/* ---------------- SIDEBAR (.rail - EXACT SIZE OF MAIN UI: 268px) ---------------- */}
      <aside className="rail doc-rail">
        <a href="/" className="logo" style={{ textDecoration: "none", color: "inherit" }}>
          <i>D/</i>
          <div>
            <b>DASHLINT</b>
            <small>{tools.length} tools · remote MCP</small>
          </div>
        </a>

        <div>
          <p className="lb">AT A GLANCE</p>
          <div className="sc" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
            <div>
              <b>{tools.length}</b>
              <span>TOOLS</span>
            </div>
            <div>
              <b>{RESOURCES.length}</b>
              <span>RES</span>
            </div>
            <div>
              <b>{PROMPTS.length}</b>
              <span>PROMPTS</span>
            </div>
          </div>
        </div>

        <div>
          <input
            className="doc-search-box"
            type="text"
            placeholder="Search tools, prompts… (blueprint)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Scrollable Navigation Tree within the Rail */}
        <nav className="doc-nav-tree">
          <div>
            <p className="lb">GETTING STARTED</p>
            <button className={`doc-nav-btn ${selectedId === "overview" ? "active" : ""}`} onClick={() => go("overview")}>
              <span className="dot" />
              <span>Overview &amp; Architecture</span>
            </button>
            <button className={`doc-nav-btn ${selectedId === "quickstart" ? "active" : ""}`} onClick={() => go("quickstart")}>
              <span className="dot" />
              <span>Quickstart &amp; AI Clients</span>
            </button>
            <button className={`doc-nav-btn ${selectedId === "sdk" ? "active" : ""}`} onClick={() => go("sdk")}>
              <span className="dot" />
              <span>TypeScript SDK</span>
            </button>
          </div>

          {filteredCore.length > 0 && (
            <div>
              <p className="lb">CORE WORKFLOW TOOLS ({filteredCore.length})</p>
              {filteredCore.map((t) => (
                <button key={t.name} className={`doc-nav-btn code ${selectedId === t.name ? "active" : ""}`} onClick={() => go(t.name)}>
                  <span className="dot" />
                  <span className="mono">{t.name}</span>
                </button>
              ))}
            </div>
          )}

          {filteredRes.length > 0 && (
            <div>
              <p className="lb">MCP RESOURCES ({filteredRes.length})</p>
              {filteredRes.map((r) => (
                <button key={r.name} className={`doc-nav-btn code ${selectedId === r.name ? "active" : ""}`} onClick={() => go(r.name)}>
                  <span className="dot" />
                  <span className="mono">{r.name}</span>
                </button>
              ))}
            </div>
          )}

          {filteredPrompts.length > 0 && (
            <div>
              <p className="lb">MCP PROMPTS ({filteredPrompts.length})</p>
              {filteredPrompts.map((p) => (
                <button key={p.name} className={`doc-nav-btn code ${selectedId === p.name ? "active" : ""}`} onClick={() => go(p.name)}>
                  <span className="dot" />
                  <span className="mono">{p.name}</span>
                </button>
              ))}
            </div>
          )}

          {filteredLegacy.length > 0 && (
            <div>
              <p className="lb">PLAYBOOKS &amp; LEGACY ({filteredLegacy.length})</p>
              {filteredLegacy.map((t) => (
                <button key={t.name} className={`doc-nav-btn code ${selectedId === t.name ? "active" : ""}`} onClick={() => go(t.name)}>
                  <span className="dot" />
                  <span className="mono">{t.name}</span>
                  <span className="dep-pill">legacy</span>
                </button>
              ))}
            </div>
          )}
        </nav>

        {/* Bottom Actions (Exact match to landing page rail) */}
        <div className="bt" style={{ marginTop: "auto" }}>
          <div className="st">
            <span>
              <span className="dot"></span>
              <b>reusable dashboard output · no API key</b>
            </span>
          </div>
          <button className="btn cp" onClick={handleCopyUrl}>
            {copiedUrl ? "Copied ✓" : "Copy MCP URL"}
          </button>
          <div className="npm-option">
            <a
              className="npm-option-link"
              href="https://www.npmjs.com/package/dashlint-kit"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="npm-option-mark"
                src="https://raw.githubusercontent.com/npm/logos/master/npm%20logo/npm-logo-red.svg"
                alt="npm"
                width="34"
                height="18"
              />
              <span className="npm-option-copy">
                <span className="npm-option-title">Standalone kit</span>
                <code className="npm-option-command">npx dashlint-kit init</code>
              </span>
              <svg className="npm-option-arrow" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M4 12 12 4M5 4h7v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </div>
      </aside>

      {/* ---------------- RIGHT VIEWPORT (.vp - EXACT SIZE AND GAP OF MAIN UI) ---------------- */}
      <div className="vp">
        {/* Top Header (.hs.mh - EXACT MATCH TO LANDING PAGE) */}
        <header className="hs mh">
          <div className="m-brand">
            <i>D/</i>
            <div>
              <b>DASHLINT</b>
              <small>{tools.length} tools · remote MCP</small>
            </div>
          </div>
          <span className="cr">
            dashlint / docs / <b>{crumb}</b>
          </span>
          <div className="hb">
            <button
              className="btn g sm tg"
              id="tg"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              title={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
              onClick={toggleTheme}
            >
              {theme === "dark" ? (
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                </svg>
              )}
            </button>
            <a href="/" className="btn sm d-only">
              How to use
            </a>
            <span
              className="btn-doc-tab d-only"
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                borderColor: "var(--ink)",
                color: "#fff",
              }}
            >
              <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 3h7a2 2 0 0 1 2 2v8a1.5 1.5 0 0 0-1.5-1.5H2.5V3z" />
                <path d="M2.5 11.5h7.5" />
              </svg>
              <span>Docs</span>
            </span>
            <a
              className="btn g sm d-only"
              href="https://linkedin.com/in/tanmay-kalbande"
              target="_blank"
              rel="noopener noreferrer"
            >
              {"LinkedIn ↗"}
            </a>
            <button
              className="menu-btn"
              id="menu-btn"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </header>

        {/* ---------------- MAIN CLUSTER PANEL (.pn) ---------------- */}
        {/* The scrolling effect is 100% inside this main cluster container! */}
        <div className="pn doc-main-cluster">
          {/* ---------- OVERVIEW ---------- */}
          {selectedId === "overview" && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <span className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mu)", background: "var(--s2)", padding: "4px 8px", borderRadius: 4, border: "1px solid var(--ln)" }}>
                  MCP SERVER · V2.0.0 · API DOCS
                </span>
              </div>
              <h1 style={{ font: "700 clamp(36px, 4.4vw, 64px)/.95 'Oswald', sans-serif", textTransform: "uppercase", margin: "0 0 16px" }}>
                DOCS FOR THE <span style={{ color: "var(--mu)" }}>DASHLINT MCP.</span>
              </h1>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--mu)", maxWidth: 760, margin: "0 0 24px" }}>
                <b style={{ color: "var(--ink)", fontWeight: 600 }}>DashLint</b> gives your AI assistant the workflow, app shell, analysis playbook and review checklist to build a complete, <b style={{ color: "var(--ink)", fontWeight: 600 }}>reusable interactive dashboard</b> from your data. Keep the code, run it anywhere, update it anytime—your rows stay on your machine.
              </p>

              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 28 }}>
                <span className="mono" style={{ fontSize: 13, background: "var(--s2)", border: "1px solid var(--ln)", borderRadius: 6, padding: "8px 14px", color: "var(--ink)" }}>
                  1 · Share data + question
                </span>
                <span className="mono" style={{ fontSize: 13, background: "var(--s2)", border: "1px solid var(--ln)", borderRadius: 6, padding: "8px 14px", color: "var(--ink)" }}>
                  2 · AI calls DashLint
                </span>
                <span className="mono" style={{ fontSize: 13, background: "var(--s2)", border: "1px solid var(--ln)", borderRadius: 6, padding: "8px 14px", color: "var(--ink)" }}>
                  3 · Reusable dashboard
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 24 }}>
                <div style={{ border: "1px solid var(--ln)", background: "var(--s2)", borderRadius: 8, padding: 16 }}>
                  <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600 }}>Zero data sent</h3>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--mu)" }}>
                    Raw rows, PII and files never leave your machine. The assistant profiles columns locally and passes only aggregate metadata to get design blueprints.
                  </p>
                </div>
                <div style={{ border: "1px solid var(--ln)", background: "var(--s2)", borderRadius: 8, padding: 16 }}>
                  <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600 }}>{tools.length} schema-aware tools</h3>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--mu)" }}>
                    Annotated with <code style={{ fontFamily: "var(--mono)", fontSize: 11 }}>readOnlyHint</code> and <code style={{ fontFamily: "var(--mono)", fontSize: 11 }}>idempotentHint</code> so assistants can cache calls and run safe autonomous loops.
                  </p>
                </div>
                <div style={{ border: "1px solid var(--ln)", background: "var(--s2)", borderRadius: 8, padding: 16 }}>
                  <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600 }}>Standalone HTML output</h3>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--mu)" }}>
                    Dashboards run in any modern browser with no node, python or server. CSV and Excel are parsed client-side, fully offline.
                  </p>
                </div>
                <div style={{ border: "1px solid var(--ln)", background: "var(--s2)", borderRadius: 8, padding: 16 }}>
                  <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600 }}>Production hardened</h3>
                  <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--mu)" }}>
                    Token-bucket rate limiting (120 req/min), HMAC-verified webhooks, Redis circuit-breaker failover and sanitized payload handlers.
                  </p>
                </div>
              </div>

              <div style={{ border: "1px solid var(--ln)", background: "var(--s2)", borderRadius: 8, padding: 16 }}>
                <p className="lb" style={{ margin: "0 0 8px" }}>ENDPOINT CONFIGURATION</p>
                <pre style={{ margin: 0, background: "var(--sf)", border: "1px solid var(--ln)", borderRadius: 6, padding: 12, fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink)", overflowX: "auto" }}>
{`MCP Transport: Streamable HTTP POST / Server-Sent Events (SSE)
MCP URL:       ${MCP_URL}
Protocol Spec: 2025-03-26 (Annotations, Prompts, Resources support)`}
                </pre>
              </div>
            </div>
          )}

          {/* ---------- QUICKSTART ---------- */}
          {selectedId === "quickstart" && (
            <div>
              <div style={{ marginBottom: 16 }}>
                <span className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mu)", background: "var(--s2)", padding: "4px 8px", borderRadius: 4, border: "1px solid var(--ln)" }}>
                  GETTING STARTED · NO API KEY
                </span>
              </div>
              <h1 style={{ font: "700 clamp(36px, 4.4vw, 64px)/.95 'Oswald', sans-serif", textTransform: "uppercase", margin: "0 0 16px" }}>
                CONNECT YOUR <span style={{ color: "var(--mu)" }}>AI ASSISTANT.</span>
              </h1>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--mu)", maxWidth: 760, margin: "0 0 24px" }}>
                Connect DashLint to any MCP-compliant client in under 30 seconds. No API keys, no account.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, alignItems: "start" }}>
                <div style={{ display: "grid", gap: 14 }}>
                  <div style={{ border: "1px solid var(--ln)", background: "var(--s2)", borderRadius: 8, padding: 16 }}>
                    <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600 }}>Claude Desktop / Claude Code</h3>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--mu)" }}>
                      Go to <b>Settings → Connectors → Add custom connector</b> and paste the MCP URL.
                    </p>
                  </div>
                  <div style={{ border: "1px solid var(--ln)", background: "var(--s2)", borderRadius: 8, padding: 16 }}>
                    <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600 }}>Cursor IDE</h3>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--mu)" }}>
                      Open Cursor Settings → Features → MCP Servers → Add new MCP server. Set the type to <code style={{ fontFamily: "var(--mono)", fontSize: 11 }}>command</code> or <code style={{ fontFamily: "var(--mono)", fontSize: 11 }}>sse</code> and use the URL.
                    </p>
                  </div>
                  <div style={{ border: "1px solid var(--ln)", background: "var(--s2)", borderRadius: 8, padding: 16 }}>
                    <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 600 }}>Standalone CLI kit</h3>
                    <p style={{ margin: "0 0 8px", fontSize: 13, lineHeight: 1.6, color: "var(--mu)" }}>
                      Scaffold the runtime and shell template on your machine without an MCP client:
                    </p>
                    <pre style={{ margin: 0, background: "var(--sf)", border: "1px solid var(--ln)", borderRadius: 6, padding: 10, fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink)" }}>
                      npx dashlint-kit init
                    </pre>
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
              <div style={{ marginBottom: 16 }}>
                <span className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mu)", background: "var(--s2)", padding: "4px 8px", borderRadius: 4, border: "1px solid var(--ln)" }}>
                  SDK · TYPESCRIPT
                </span>
              </div>
              <h1 style={{ font: "700 clamp(32px, 4vw, 54px)/.95 'Oswald', sans-serif", textTransform: "uppercase", margin: "0 0 16px" }}>
                dashlint-sdk
              </h1>
              <p style={{ fontSize: 16, lineHeight: 1.65, color: "var(--mu)", maxWidth: 760, margin: "0 0 24px" }}>
                Lightweight, zero-dependency TypeScript client for using DashLint orchestration from agents, pipelines and server backends.
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, alignItems: "start" }}>
                <div style={{ display: "grid", gap: 14 }}>
                  <div style={{ border: "1px solid var(--ln)", background: "var(--s2)", borderRadius: 8, padding: 16 }}>
                    <p className="lb" style={{ margin: "0 0 8px" }}>INSTALLATION</p>
                    <pre style={{ margin: 0, background: "var(--sf)", border: "1px solid var(--ln)", borderRadius: 6, padding: 10, fontFamily: "var(--mono)", fontSize: 12, color: "var(--ink)" }}>
                      npm install dashlint-sdk
                    </pre>
                  </div>
                  <div style={{ border: "1px solid var(--ln)", background: "var(--s2)", borderRadius: 8, padding: 16 }}>
                    <p className="lb" style={{ margin: "0 0 8px" }}>CLIENT FEATURES</p>
                    <ul style={{ margin: 0, paddingLeft: 18, color: "var(--mu)", fontSize: 13, lineHeight: 1.8 }}>
                      <li>Type-safe tool calls over native JSON-RPC 2.0</li>
                      <li>Automatic retry with exponential backoff &amp; circuit breakers</li>
                      <li>Local data profiling helpers</li>
                      <li>MCP Prompts and Resources support</li>
                    </ul>
                  </div>
                </div>
                <Console
                  label="example.ts"
                  body={SDK_EXAMPLE}
                  copied={copied === "sdk"}
                  onCopy={() => copy("sdk", SDK_EXAMPLE)}
                />
              </div>
            </div>
          )}

          {/* ---------- RESOURCE ---------- */}
          {activeResource && (
            <div>
              <div style={{ marginBottom: 16, display: "flex", gap: 8, alignItems: "center" }}>
                <span className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mu)", background: "var(--s2)", padding: "4px 8px", borderRadius: 4, border: "1px solid var(--ln)" }}>
                  RESOURCE
                </span>
                <span className="mono" style={{ fontSize: 11, color: "var(--ok)", background: "var(--okd)", padding: "4px 8px", borderRadius: 4 }}>
                  {activeResource.mimeType}
                </span>
              </div>
              <h1 style={{ font: "700 clamp(28px, 3.4vw, 48px)/1.05 'Oswald', sans-serif", textTransform: "uppercase", margin: "0 0 16px" }}>
                {activeResource.name}
              </h1>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--mu)", maxWidth: 760, margin: "0 0 24px" }}>
                {activeResource.description}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, alignItems: "start" }}>
                <div style={{ display: "grid", gap: 14 }}>
                  <div style={{ border: "1px solid var(--ln)", background: "var(--s2)", borderRadius: 8, padding: 16 }}>
                    <p className="lb" style={{ margin: "0 0 8px" }}>URI DESCRIPTOR</p>
                    <pre style={{ margin: 0, background: "var(--sf)", border: "1px solid var(--ln)", borderRadius: 6, padding: 10, fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--ink)", overflowX: "auto" }}>
                      {activeResource.uri}
                    </pre>
                  </div>
                  <div style={{ border: "1px solid var(--ln)", background: "var(--s2)", borderRadius: 8, padding: 16 }}>
                    <p className="lb" style={{ margin: "0 0 8px" }}>USAGE IN ASSISTANT CONTEXT</p>
                    <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6, color: "var(--mu)" }}>
                      Assistants read this resource through the MCP <code style={{ fontFamily: "var(--mono)", fontSize: 11 }}>resources/read</code> endpoint to test dashboard generation against realistic multi-column operational data.
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
              <div style={{ marginBottom: 16 }}>
                <span className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mu)", background: "var(--s2)", padding: "4px 8px", borderRadius: 4, border: "1px solid var(--ln)" }}>
                  PROMPT TEMPLATE
                </span>
              </div>
              <h1 style={{ font: "700 clamp(28px, 3.4vw, 48px)/1.05 'Oswald', sans-serif", textTransform: "uppercase", margin: "0 0 16px" }}>
                {activePrompt.name}
              </h1>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--mu)", maxWidth: 760, margin: "0 0 24px" }}>
                {activePrompt.description}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, alignItems: "start" }}>
                <div style={{ border: "1px solid var(--ln)", background: "var(--s2)", borderRadius: 8, padding: 16 }}>
                  <p className="lb" style={{ margin: "0 0 12px" }}>TEMPLATE ARGUMENTS</p>
                  {activePrompt.arguments.map((a) => (
                    <div key={a.name} style={{ padding: "10px 0", borderBottom: "1px solid var(--ln)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="mono" style={{ fontWeight: 600, fontSize: 13, color: "var(--ink)" }}>{a.name}</span>
                        {a.required && <span className="mono" style={{ fontSize: 10, color: "#f87171", border: "1px solid #7f1d1d", borderRadius: 3, padding: "1px 4px" }}>required</span>}
                      </div>
                      <div style={{ marginTop: 4, fontSize: 12.5, color: "var(--mu)", lineHeight: 1.5 }}>{a.description}</div>
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
              <div style={{ marginBottom: 16, display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <span className="mono" style={{ fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--mu)", background: "var(--s2)", padding: "4px 8px", borderRadius: 4, border: "1px solid var(--ln)" }}>
                  TOOL
                </span>
                <span className="mono" style={{ fontSize: 11, color: "var(--ok)", background: "var(--okd)", padding: "4px 8px", borderRadius: 4 }}>
                  Read-only
                </span>
                <span className="mono" style={{ fontSize: 11, color: "#fbbf24", background: "rgba(251, 191, 36, 0.08)", padding: "4px 8px", borderRadius: 4 }}>
                  Idempotent
                </span>
                {activeTool.deprecated && (
                  <span className="mono" style={{ fontSize: 11, color: "#f87171", background: "rgba(248, 113, 113, 0.12)", padding: "4px 8px", borderRadius: 4 }}>
                    Deprecated
                  </span>
                )}
              </div>
              <h1 style={{ font: "700 clamp(28px, 3.4vw, 48px)/1.05 'Oswald', sans-serif", textTransform: "uppercase", margin: "0 0 16px" }}>
                {activeTool.name}()
              </h1>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: "var(--mu)", maxWidth: 760, margin: "0 0 24px" }}>
                {activeTool.description}
              </p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 20, alignItems: "start" }}>
                <div style={{ display: "grid", gap: 14 }}>
                  <div style={{ border: "1px solid var(--ln)", background: "var(--s2)", borderRadius: 8, padding: 16 }}>
                    <p className="lb" style={{ margin: "0 0 12px" }}>INPUT PARAMETERS</p>
                    {activeTool.inputSchema.properties && Object.keys(activeTool.inputSchema.properties).length > 0 ? (
                      Object.entries(activeTool.inputSchema.properties).map(([key, prop]) => {
                        const isReq = activeTool.inputSchema.required?.includes(key);
                        return (
                          <div key={key} style={{ padding: "10px 0", borderBottom: "1px solid var(--ln)" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                              <span className="mono" style={{ fontWeight: 600, fontSize: 13, color: "var(--ink)" }}>{key}</span>
                              <span className="mono" style={{ fontSize: 11, color: "var(--mu)" }}>{prop.type || (prop.enum ? "enum" : "object")}</span>
                              {isReq && <span className="mono" style={{ fontSize: 10, color: "#f87171", border: "1px solid #7f1d1d", borderRadius: 3, padding: "1px 4px" }}>required</span>}
                            </div>
                            {prop.description && <div style={{ marginTop: 4, fontSize: 12.5, color: "var(--mu)", lineHeight: 1.5 }}>{prop.description}</div>}
                            {prop.enum && (
                              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 6 }}>
                                {prop.enum.map((e) => (
                                  <code key={e} style={{ fontFamily: "var(--mono)", fontSize: 11, background: "var(--sf)", border: "1px solid var(--ln)", borderRadius: 3, padding: "1px 5px", color: "var(--ink)" }}>
                                    {e}
                                  </code>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ color: "var(--mu)", fontSize: 13, fontStyle: "italic" }}>
                        This tool takes no parameters. Call it with an empty object: <code>{"{}"}</code>
                      </div>
                    )}
                  </div>

                  <div style={{ border: "1px solid var(--ln)", background: "var(--s2)", borderRadius: 8, padding: 16 }}>
                    <p className="lb" style={{ margin: "0 0 10px" }}>TOOL ANNOTATIONS</p>
                    <div className="mono" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 11.5, color: "var(--mu)" }}>
                      <div>readOnlyHint: <b style={{ color: "var(--ok)" }}>true</b></div>
                      <div>destructiveHint: <b style={{ color: "var(--ok)" }}>false</b></div>
                      <div>idempotentHint: <b style={{ color: "var(--ok)" }}>true</b></div>
                      <div>openWorldHint: <b style={{ color: "var(--ok)" }}>false</b></div>
                    </div>
                  </div>
                </div>

                {(() => {
                  const body = toolSnippet(activeTool, codeTab);
                  const mk = (value: CodeTab, tabLabel: string) => ({
                    value,
                    label: tabLabel,
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

          {/* Footer at the bottom of the scrollable cluster */}
          <footer className="mf" style={{ marginTop: "auto", paddingTop: "32px", borderTop: "1px solid var(--ln)" }}>
            <span>Free · open source · MIT</span>
            <span>
              <a href="/docs" style={{ color: "inherit", textDecoration: "none" }}>Docs</a> · <a href="/terms" style={{ color: "inherit", textDecoration: "none" }}>Terms</a> · <a href="/privacy" style={{ color: "inherit", textDecoration: "none" }}>Privacy</a> · Built with DashLint
            </span>
          </footer>
        </div>
      </div>

      {/* ---------------- MOBILE DRAWER (For screen <= 1100px) ---------------- */}
      <div className={`drawer ${menuOpen ? "open" : ""}`} id="drawer" style={{ display: menuOpen ? "block" : "none" }}>
        <div style={{ padding: "16px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div className="logo">
              <i>D/</i>
              <div>
                <b>DASHLINT</b>
                <small>{tools.length} tools · remote MCP</small>
              </div>
            </div>
            <button className="btn g sm" onClick={() => setMenuOpen(false)}>
              ✕
            </button>
          </div>

          <input
            className="doc-search-box"
            type="text"
            placeholder="Search tools, prompts…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ marginBottom: 16 }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: "calc(100vh - 160px)", overflowY: "auto" }}>
            <button className={`doc-nav-btn ${selectedId === "overview" ? "active" : ""}`} onClick={() => go("overview")}>
              Overview &amp; Architecture
            </button>
            <button className={`doc-nav-btn ${selectedId === "quickstart" ? "active" : ""}`} onClick={() => go("quickstart")}>
              Quickstart &amp; AI Clients
            </button>
            <button className={`doc-nav-btn ${selectedId === "sdk" ? "active" : ""}`} onClick={() => go("sdk")}>
              TypeScript SDK
            </button>
            <p className="lb" style={{ marginTop: 12 }}>TOOLS</p>
            {tools.map(t => (
              <button key={t.name} className={`doc-nav-btn code ${selectedId === t.name ? "active" : ""}`} onClick={() => go(t.name)}>
                <span className="mono">{t.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className={`scrim ${menuOpen ? "on" : ""}`} onClick={() => setMenuOpen(false)} />
    </>
  );
}

"use client";

import { useState, useMemo, useEffect } from "react";
import manifest from "@/lib/tools.manifest.json";

const MCP_URL = "https://dashlint.tanmaysk.in/mcp";

type Tool = {
  name: string;
  description: string;
  deprecated: boolean;
  inputSchema: {
    type?: string;
    properties?: Record<string, {
      type?: string;
      description?: string;
      items?: Record<string, unknown>;
      enum?: string[];
      properties?: Record<string, unknown>;
    }>;
    required?: string[];
  };
};

const tools = (manifest as { tools: Tool[] }).tools;

const RESOURCES = [
  {
    uri: "dashlint://samples/contact-center-interactions.csv",
    name: "contact-center-interactions.csv",
    mimeType: "text/csv",
    description: "Sample contact center operational log: 50,000 interactions across voice, chat, email with handle times, CSAT scores, resolution rates, and agent metadata for testing KPI cards and breakdown charts.",
  },
  {
    uri: "dashlint://samples/incident-operations.csv",
    name: "incident-operations.csv",
    mimeType: "text/csv",
    description: "Sample DevOps / SRE incident stream: P1-P4 incidents with MTTA, MTTR, escalation flags, severity levels, affected microservices, and on-call response timelines.",
  },
  {
    uri: "dashlint://changelog",
    name: "changelog",
    mimeType: "text/markdown",
    description: "Release history, breaking changes, schema migrations, and version announcements for the DashLint MCP Server.",
  },
  {
    uri: "dashlint://manifest",
    name: "manifest",
    mimeType: "application/json",
    description: "Complete machine-readable JSON schema descriptor for all DashLint MCP tools, resources, annotations, and parameters.",
  },
];

const PROMPTS = [
  {
    name: "create_dashboard",
    title: "Create Interactive Dashboard",
    description: "End-to-end prompt template that guides any MCP-compatible AI assistant to inspect local data, call DashLint workflow tools, generate the blueprint, and output a complete single-file HTML dashboard.",
    arguments: [
      { name: "data_description", description: "Summary of columns, business questions, and target KPI metrics.", required: true },
      { name: "theme_preference", description: "Visual style: 'dark', 'light', or 'system'.", required: false },
    ],
    template: `Here is my data: {data_description}. Build an interactive, self-contained dashboard following the DashLint MCP workflow. Call the MCP tools step-by-step: first get the creation workflow, then generate the schema-aware blueprint, consult the playbooks, and verify against the completion checklist before delivering the HTML file. Keep all raw data rows on my machine.`,
  },
  {
    name: "review_dashboard",
    title: "Review Dashboard Against Checklist",
    description: "Audits an existing HTML dashboard against DashLint's 14-point production checklist (data accuracy, reactivity, filter state preservation, export fidelity, and accessibility).",
    arguments: [
      { name: "dashboard_code", description: "The complete HTML/JS code of the dashboard to inspect.", required: true },
    ],
    template: `Review the following dashboard code against DashLint's get_dashboard_completion_checklist: {dashboard_code}. Verify that zero data leaks off the host machine, KPI formulas use safe division, all charts respond to active cross-filters, and the export function works offline.`,
  },
];

export default function DocsPage() {
  const [selectedId, setSelectedId] = useState<string>("overview");
  const [search, setSearch] = useState<string>("");
  const [codeTab, setCodeTab] = useState<"claude" | "sdk" | "jsonrpc" | "schema">("claude");
  const [copied, setCopied] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Force body styles so layout never squeezes or locks scrolling
  useEffect(() => {
    document.body.classList.add("subpage-body");
    return () => document.body.classList.remove("subpage-body");
  }, []);

  const coreTools = useMemo(() => tools.filter(t => !t.deprecated), []);
  const legacyTools = useMemo(() => tools.filter(t => t.deprecated), []);

  const activeTool = tools.find(t => t.name === selectedId);
  const activeResource = RESOURCES.find(r => r.name === selectedId || r.uri === selectedId);
  const activePrompt = PROMPTS.find(p => p.name === selectedId);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredCore = coreTools.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.description.toLowerCase().includes(search.toLowerCase())
  );
  const filteredLegacy = legacyTools.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        html, body {
          display: block !important;
          height: auto !important;
          min-height: 100vh !important;
          overflow-y: auto !important;
          overflow-x: hidden !important;
          padding: 0 !important;
          margin: 0 !important;
          grid-template-columns: none !important;
          background: #0d0f12 !important;
          color: #e5e7eb !important;
          font-family: var(--sans, Inter, sans-serif) !important;
        }

        .anthropic-docs {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background: #0d0f12;
          color: #e5e7eb;
        }

        /* Top Navigation Header */
        .ad-nav {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 60px;
          padding: 0 24px;
          background: rgba(13, 15, 18, 0.88);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid #1f242c;
        }

        .ad-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          color: inherit;
        }
        .ad-logo {
          font-weight: 700;
          letter-spacing: 0.08em;
          font-size: 14px;
          color: #f9fafb;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .ad-badge-docs {
          font-size: 11px;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 4px;
          background: #1f2937;
          color: #93c5fd;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .ad-badge-version {
          font-size: 11px;
          font-weight: 500;
          padding: 2px 6px;
          border-radius: 4px;
          background: #18202b;
          color: #9ca3af;
          border: 1px solid #283444;
        }

        .ad-nav-search {
          flex: 1;
          max-width: 440px;
          margin: 0 24px;
          position: relative;
        }
        .ad-search-input {
          width: 100%;
          background: #151921;
          border: 1px solid #262e3d;
          border-radius: 6px;
          padding: 7px 12px 7px 34px;
          color: #f3f4f6;
          font-size: 13px;
          outline: none;
          transition: border-color 0.15s;
          font-family: inherit;
        }
        .ad-search-input:focus {
          border-color: #3b82f6;
        }
        .ad-search-icon {
          position: absolute;
          left: 11px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 12px;
          color: #6b7280;
        }

        .ad-nav-links {
          display: flex;
          align-items: center;
          gap: 16px;
          font-size: 13px;
        }
        .ad-nav-link {
          color: #9ca3af;
          text-decoration: none;
          transition: color 0.15s;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ad-nav-link:hover {
          color: #f9fafb;
        }

        /* Documentation Layout Grid */
        .ad-layout {
          display: flex;
          flex: 1;
          max-width: 1540px;
          width: 100%;
          margin: 0 auto;
        }

        /* Left Sidebar */
        .ad-sidebar {
          width: 290px;
          flex-shrink: 0;
          border-right: 1px solid #1f242c;
          padding: 24px 16px 60px;
          height: calc(100vh - 60px);
          position: sticky;
          top: 60px;
          overflow-y: auto;
        }
        .ad-sidebar::-webkit-scrollbar {
          width: 5px;
        }
        .ad-sidebar::-webkit-scrollbar-thumb {
          background: #232a36;
          border-radius: 4px;
        }

        .ad-side-group {
          margin-bottom: 24px;
        }
        .ad-side-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6b7280;
          margin-bottom: 8px;
          padding-left: 10px;
        }
        .ad-side-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          text-align: left;
          padding: 7px 10px;
          border-radius: 6px;
          font-size: 13px;
          color: #9ca3af;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
        }
        .ad-side-item:hover {
          background: #171c24;
          color: #e5e7eb;
        }
        .ad-side-item.active {
          background: #1e293b;
          color: #60a5fa;
          font-weight: 600;
        }
        .ad-side-code {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .ad-badge-dep {
          font-size: 9px;
          font-weight: 600;
          padding: 1px 4px;
          border-radius: 3px;
          background: #451a1a;
          color: #f87171;
          text-transform: uppercase;
        }

        /* Main Content View */
        .ad-main {
          flex: 1;
          padding: 36px 48px 80px;
          min-width: 0;
          overflow-x: hidden;
        }

        .ad-breadcrumb {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: #6b7280;
          margin-bottom: 12px;
        }
        .ad-breadcrumb span {
          color: #9ca3af;
        }

        .ad-title-row {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 12px;
        }
        .ad-h1 {
          font-size: 28px;
          font-weight: 700;
          color: #f9fafb;
          margin: 0;
          font-family: 'IBM Plex Mono', monospace;
        }
        .ad-pill-type {
          font-size: 11px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          background: #1e3a5f;
          color: #60a5fa;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .ad-pill-readonly {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          background: #132e22;
          color: #34d399;
          border: 1px solid #1a4a34;
        }
        .ad-pill-idempotent {
          font-size: 11px;
          font-weight: 600;
          padding: 3px 8px;
          border-radius: 4px;
          background: #2a2212;
          color: #fbbf24;
          border: 1px solid #4a3c1c;
        }

        .ad-desc-lead {
          font-size: 15px;
          line-height: 1.7;
          color: #9ca3af;
          margin: 0 0 28px;
        }

        /* Split Screen (Left: Schema/Details, Right: Code Panel) */
        .ad-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
          align-items: flex-start;
        }

        .ad-panel-left {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .ad-card {
          background: #14171d;
          border: 1px solid #202632;
          border-radius: 8px;
          padding: 20px;
        }
        .ad-card-title {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: #9ca3af;
          margin: 0 0 14px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        /* Param Table */
        .ad-param-row {
          border-bottom: 1px solid #1f2530;
          padding: 12px 0;
        }
        .ad-param-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .ad-param-name {
          font-family: 'IBM Plex Mono', monospace;
          color: #93c5fd;
          font-size: 13px;
          font-weight: 600;
        }
        .ad-param-type {
          font-size: 11px;
          color: #6b7280;
          font-family: 'IBM Plex Mono', monospace;
          margin-left: 8px;
        }
        .ad-param-req {
          font-size: 10px;
          font-weight: 700;
          color: #f87171;
          background: #3f1515;
          padding: 1px 5px;
          border-radius: 3px;
          margin-left: 8px;
        }
        .ad-param-desc {
          font-size: 13px;
          color: #9ca3af;
          margin-top: 4px;
          line-height: 1.5;
        }

        /* Right Code Panel (Anthropic Dark Console) */
        .ad-panel-right {
          position: sticky;
          top: 84px;
          background: #101318;
          border: 1px solid #222936;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }
        .ad-code-tabs {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #141820;
          border-bottom: 1px solid #222936;
          padding: 0 12px;
        }
        .ad-tabs-left {
          display: flex;
          gap: 2px;
        }
        .ad-code-tab {
          background: none;
          border: none;
          padding: 10px 12px;
          font-size: 12px;
          color: #9ca3af;
          cursor: pointer;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          font-family: inherit;
        }
        .ad-code-tab:hover {
          color: #f3f4f6;
        }
        .ad-code-tab.active {
          color: #60a5fa;
          border-bottom-color: #3b82f6;
        }
        .ad-copy-btn {
          background: #1a202c;
          border: 1px solid #2d3748;
          border-radius: 4px;
          color: #9ca3af;
          font-size: 11px;
          padding: 4px 8px;
          cursor: pointer;
          transition: all 0.15s;
          font-family: inherit;
        }
        .ad-copy-btn:hover {
          color: #f9fafb;
          background: #2d3748;
        }
        .ad-code-body {
          padding: 16px;
          margin: 0;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 12px;
          line-height: 1.6;
          color: #e2e8f0;
          background: #101318;
          overflow-x: auto;
          max-height: 480px;
        }

        /* Overview Page Styling */
        .ad-overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 16px;
          margin: 24px 0 32px;
        }
        .ad-feature-card {
          background: #14171d;
          border: 1px solid #202632;
          border-radius: 8px;
          padding: 20px;
        }
        .ad-feature-title {
          font-size: 15px;
          font-weight: 600;
          color: #f9fafb;
          margin-bottom: 6px;
        }
        .ad-feature-text {
          font-size: 13px;
          color: #9ca3af;
          line-height: 1.6;
        }

        @media (max-width: 1040px) {
          .ad-split {
            grid-template-columns: 1fr;
          }
          .ad-panel-right {
            position: static;
          }
        }
        @media (max-width: 768px) {
          .ad-sidebar {
            display: none;
          }
          .ad-main {
            padding: 24px 16px;
          }
          .ad-nav-search {
            display: none;
          }
        }
      `}</style>

      <div className="anthropic-docs subpage" id="docs-root">
        {/* Navigation Bar */}
        <header className="ad-nav">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <a href="/" className="ad-brand">
              <span className="ad-logo">DASHLINT</span>
              <span className="ad-badge-docs">DOCS</span>
              <span className="ad-badge-version">v2.0.0</span>
            </a>
          </div>

          <div className="ad-nav-search">
            <span className="ad-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search 12 tools, prompts, schemas... (e.g. blueprint)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ad-search-input"
            />
          </div>

          <div className="ad-nav-links">
            <a href="/" className="ad-nav-link">
              {"\u2190"} Back to App
            </a>
            <a href="/terms" className="ad-nav-link">
              Terms
            </a>
            <a href="/privacy" className="ad-nav-link">
              Privacy
            </a>
            <a
              href="https://linkedin.com/in/tanmay-kalbande"
              target="_blank"
              rel="noopener noreferrer"
              className="ad-nav-link"
            >
              {"LinkedIn \u2197"}
            </a>
          </div>
        </header>

        {/* Documentation Content Layout */}
        <div className="ad-layout">
          {/* Left Sticky Sidebar */}
          <aside className="ad-sidebar">
            {/* Group: Overview */}
            <div className="ad-side-group">
              <div className="ad-side-title">Getting Started</div>
              <button
                className={`ad-side-item ${selectedId === "overview" ? "active" : ""}`}
                onClick={() => setSelectedId("overview")}
              >
                <span>Overview &amp; Architecture</span>
              </button>
              <button
                className={`ad-side-item ${selectedId === "quickstart" ? "active" : ""}`}
                onClick={() => setSelectedId("quickstart")}
              >
                <span>Quickstart &amp; AI Clients</span>
              </button>
              <button
                className={`ad-side-item ${selectedId === "sdk" ? "active" : ""}`}
                onClick={() => setSelectedId("sdk")}
              >
                <span>TypeScript SDK</span>
              </button>
            </div>

            {/* Group: Core Workflow Tools */}
            <div className="ad-side-group">
              <div className="ad-side-title">
                Core Workflow Tools ({filteredCore.length})
              </div>
              {filteredCore.map(tool => (
                <button
                  key={tool.name}
                  className={`ad-side-item ${selectedId === tool.name ? "active" : ""}`}
                  onClick={() => setSelectedId(tool.name)}
                >
                  <span className="ad-side-code">{tool.name}</span>
                </button>
              ))}
            </div>

            {/* Group: MCP Resources */}
            <div className="ad-side-group">
              <div className="ad-side-title">MCP Resources (4)</div>
              {RESOURCES.map(res => (
                <button
                  key={res.name}
                  className={`ad-side-item ${selectedId === res.name ? "active" : ""}`}
                  onClick={() => setSelectedId(res.name)}
                >
                  <span className="ad-side-code">{res.name}</span>
                </button>
              ))}
            </div>

            {/* Group: MCP Prompts */}
            <div className="ad-side-group">
              <div className="ad-side-title">MCP Prompts (2)</div>
              {PROMPTS.map(p => (
                <button
                  key={p.name}
                  className={`ad-side-item ${selectedId === p.name ? "active" : ""}`}
                  onClick={() => setSelectedId(p.name)}
                >
                  <span className="ad-side-code">{p.name}</span>
                </button>
              ))}
            </div>

            {/* Group: Legacy & Deprecated */}
            <div className="ad-side-group">
              <div className="ad-side-title">
                Playbooks &amp; Utilities ({filteredLegacy.length})
              </div>
              {filteredLegacy.map(tool => (
                <button
                  key={tool.name}
                  className={`ad-side-item ${selectedId === tool.name ? "active" : ""}`}
                  onClick={() => setSelectedId(tool.name)}
                >
                  <span className="ad-side-code">{tool.name}</span>
                  <span className="ad-badge-dep">legacy</span>
                </button>
              ))}
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="ad-main">
            {/* OVERVIEW TAB */}
            {selectedId === "overview" && (
              <div>
                <div className="ad-breadcrumb">
                  <span>Getting Started</span> / <span>Overview &amp; Architecture</span>
                </div>
                <h1 className="ad-h1" style={{ fontFamily: "var(--sans)", fontSize: 32, marginBottom: 12 }}>
                  DashLint MCP Server v2.0
                </h1>
                <p className="ad-desc-lead">
                  DashLint is an orchestration Model Context Protocol (MCP) server that empowers Claude, Cursor, ChatGPT, Windsurf, and custom AI agents to build production-grade, interactive, reusable single-page HTML dashboards directly from local user data.
                </p>

                <div className="ad-overview-grid">
                  <div className="ad-feature-card">
                    <div className="ad-feature-title">🔒 100% Zero-Data-Sent Architecture</div>
                    <div className="ad-feature-text">
                      Your raw dataset rows, PII, and files never leave your machine. The assistant profiles columns locally and only passes aggregate metadata to DashLint to receive design blueprints.
                    </div>
                  </div>
                  <div className="ad-feature-card">
                    <div className="ad-feature-title">⚡ 12 Schema-Aware MCP Tools</div>
                    <div className="ad-feature-text">
                      Annotated with <code>readOnlyHint: true</code> and <code>idempotentHint: true</code> for maximum assistant confidence, caching, and safe autonomous loops.
                    </div>
                  </div>
                  <div className="ad-feature-card">
                    <div className="ad-feature-title">📦 Standalone HTML Artifacts</div>
                    <div className="ad-feature-text">
                      Dashboards run in any modern browser without node, python, or external servers. They parse CSV and Excel files client-side with full offline support.
                    </div>
                  </div>
                  <div className="ad-feature-card">
                    <div className="ad-feature-title">🛡️ Enterprise Telemetry &amp; Circuit Breakers</div>
                    <div className="ad-feature-text">
                      Equipped with token-bucket rate limiting (120 req/min), HMAC-verified webhooks, Redis circuit breaker failover, and sanitized payload handlers.
                    </div>
                  </div>
                </div>

                <div className="ad-card" style={{ marginTop: 24 }}>
                  <div className="ad-card-title">Endpoint Configuration</div>
                  <pre style={{ background: "#0e1116", padding: 14, borderRadius: 6, fontSize: 13, fontFamily: "'IBM Plex Mono', monospace", color: "#93c5fd" }}>
{`MCP Transport: Streamable HTTP POST / Server-Sent Events (SSE)
MCP URL:       ${MCP_URL}
Protocol Spec: 2025-03-26 (Annotations, Prompts, Resources support)`}
                  </pre>
                </div>
              </div>
            )}

            {/* QUICKSTART TAB */}
            {selectedId === "quickstart" && (
              <div>
                <div className="ad-breadcrumb">
                  <span>Getting Started</span> / <span>Quickstart &amp; AI Clients</span>
                </div>
                <h1 className="ad-h1" style={{ fontFamily: "var(--sans)", fontSize: 32, marginBottom: 12 }}>
                  Connecting Your AI Assistant
                </h1>
                <p className="ad-desc-lead">
                  Connect DashLint to any MCP-compliant client in under 30 seconds. No API keys or account registrations required.
                </p>

                <div className="ad-split">
                  <div className="ad-panel-left">
                    <div className="ad-card">
                      <div className="ad-feature-title">Claude Desktop / Claude Code</div>
                      <p className="ad-feature-text">
                        Go to <strong>Settings → Connectors → Add Custom Connector</strong>, and paste the MCP URL.
                      </p>
                    </div>

                    <div className="ad-card">
                      <div className="ad-feature-title">Cursor IDE</div>
                      <p className="ad-feature-text">
                        Open Cursor Settings → Features → MCP Servers → Add new MCP server. Set type to <code>command</code> or <code>sse</code> with the URL.
                      </p>
                    </div>

                    <div className="ad-card">
                      <div className="ad-feature-title">Standalone CLI Kit</div>
                      <p className="ad-feature-text">
                        Scaffold the runtime and shell template directly on your machine without an MCP client:
                      </p>
                      <pre style={{ background: "#0c0e12", padding: 10, borderRadius: 4, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#34d399", marginTop: 8 }}>
npx dashlint-kit init
                      </pre>
                    </div>
                  </div>

                  <div className="ad-panel-right">
                    <div className="ad-code-tabs">
                      <div className="ad-tabs-left">
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", padding: "10px 0" }}>
                          claude_desktop_config.json
                        </span>
                      </div>
                      <button
                        className="ad-copy-btn"
                        onClick={() => handleCopy(`{\n  "mcpServers": {\n    "dashlint": {\n      "url": "${MCP_URL}"\n    }\n  }\n}`)}
                      >
                        {copied ? "Copied ✓" : "Copy JSON"}
                      </button>
                    </div>
                    <pre className="ad-code-body">
{`{
  "mcpServers": {
    "dashlint": {
      "url": "${MCP_URL}"
    }
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* SDK TAB */}
            {selectedId === "sdk" && (
              <div>
                <div className="ad-breadcrumb">
                  <span>SDK &amp; Client Libraries</span> / <span>TypeScript SDK</span>
                </div>
                <h1 className="ad-h1" style={{ fontFamily: "var(--sans)", fontSize: 32, marginBottom: 12 }}>
                  dashlint-sdk
                </h1>
                <p className="ad-desc-lead">
                  Lightweight, zero-dependency TypeScript client library for integrating DashLint MCP orchestration into autonomous agents, pipelines, and server backends.
                </p>

                <div className="ad-split">
                  <div className="ad-panel-left">
                    <div className="ad-card">
                      <div className="ad-card-title">Installation</div>
                      <pre style={{ background: "#0c0e12", padding: 12, borderRadius: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: "#38bdf8" }}>
npm install dashlint-sdk
                      </pre>
                    </div>

                    <div className="ad-card">
                      <div className="ad-card-title">Client Features</div>
                      <ul style={{ paddingLeft: 20, margin: 0, color: "#9ca3af", fontSize: 13, lineHeight: 1.8 }}>
                        <li>Type-safe tool calls via native JSON-RPC 2.0 protocol</li>
                        <li>Automated retry with exponential backoff &amp; circuit breakers</li>
                        <li>Local data profiling helper functions</li>
                        <li>Support for MCP Prompts and Resources subscription</li>
                      </ul>
                    </div>
                  </div>

                  <div className="ad-panel-right">
                    <div className="ad-code-tabs">
                      <div className="ad-tabs-left">
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", padding: "10px 0" }}>
                          example.ts
                        </span>
                      </div>
                      <button
                        className="ad-copy-btn"
                        onClick={() => handleCopy(`import { DashLint } from "dashlint-sdk";\n\nconst dl = new DashLint();\n\n// Generate blueprint from column metadata\nconst blueprint = await dl.buildBlueprint({\n  fields: [\n    { name: "timestamp", type: "datetime" },\n    { name: "csat_score", type: "number", min: 1, max: 5 },\n    { name: "channel", type: "category", distinctCount: 4 }\n  ]\n});`)}
                      >
                        {copied ? "Copied ✓" : "Copy"}
                      </button>
                    </div>
                    <pre className="ad-code-body">
{`import { DashLint } from "dashlint-sdk";

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

console.log("Generated blueprint:", blueprint);`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* RESOURCE TAB */}
            {activeResource && (
              <div>
                <div className="ad-breadcrumb">
                  <span>MCP Resources</span> / <span>{activeResource.name}</span>
                </div>
                <div className="ad-title-row">
                  <h1 className="ad-h1">{activeResource.name}</h1>
                  <span className="ad-pill-type">RESOURCE</span>
                  <span className="ad-pill-readonly">{activeResource.mimeType}</span>
                </div>
                <p className="ad-desc-lead">{activeResource.description}</p>

                <div className="ad-split">
                  <div className="ad-panel-left">
                    <div className="ad-card">
                      <div className="ad-card-title">URI Descriptor</div>
                      <pre style={{ background: "#0c0e12", padding: 12, borderRadius: 6, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: "#93c5fd" }}>
{activeResource.uri}
                      </pre>
                    </div>
                    <div className="ad-card">
                      <div className="ad-card-title">Usage in Assistant Context</div>
                      <p className="ad-feature-text">
                        Assistants can read this resource directly via the MCP <code>resources/read</code> endpoint to test dashboard generation against realistic multi-column operational datasets.
                      </p>
                    </div>
                  </div>

                  <div className="ad-panel-right">
                    <div className="ad-code-tabs">
                      <div className="ad-tabs-left">
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", padding: "10px 0" }}>
                          JSON-RPC Request
                        </span>
                      </div>
                      <button
                        className="ad-copy-btn"
                        onClick={() => handleCopy(`{\n  "jsonrpc": "2.0",\n  "id": 1,\n  "method": "resources/read",\n  "params": {\n    "uri": "${activeResource.uri}"\n  }\n}`)}
                      >
                        {copied ? "Copied ✓" : "Copy"}
                      </button>
                    </div>
                    <pre className="ad-code-body">
{`{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "resources/read",
  "params": {
    "uri": "${activeResource.uri}"
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* PROMPT TAB */}
            {activePrompt && (
              <div>
                <div className="ad-breadcrumb">
                  <span>MCP Prompts</span> / <span>{activePrompt.name}</span>
                </div>
                <div className="ad-title-row">
                  <h1 className="ad-h1">{activePrompt.name}</h1>
                  <span className="ad-pill-type">PROMPT TEMPLATE</span>
                </div>
                <p className="ad-desc-lead">{activePrompt.description}</p>

                <div className="ad-split">
                  <div className="ad-panel-left">
                    <div className="ad-card">
                      <div className="ad-card-title">Template Arguments</div>
                      {activePrompt.arguments.map(arg => (
                        <div key={arg.name} className="ad-param-row">
                          <span className="ad-param-name">{arg.name}</span>
                          {arg.required && <span className="ad-param-req">required</span>}
                          <div className="ad-param-desc">{arg.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="ad-panel-right">
                    <div className="ad-code-tabs">
                      <div className="ad-tabs-left">
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#9ca3af", padding: "10px 0" }}>
                          Prompt Template
                        </span>
                      </div>
                      <button
                        className="ad-copy-btn"
                        onClick={() => handleCopy(activePrompt.template)}
                      >
                        {copied ? "Copied ✓" : "Copy"}
                      </button>
                    </div>
                    <pre className="ad-code-body">
{activePrompt.template}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {/* TOOL VIEW */}
            {activeTool && (
              <div>
                <div className="ad-breadcrumb">
                  <span>Tools</span> / <span>{activeTool.deprecated ? "Playbooks & Legacy" : "Core Workflow"}</span> / <span>{activeTool.name}</span>
                </div>
                <div className="ad-title-row">
                  <h1 className="ad-h1">{activeTool.name}()</h1>
                  <span className="ad-pill-type">TOOL</span>
                  <span className="ad-pill-readonly">READ-ONLY</span>
                  <span className="ad-pill-idempotent">IDEMPOTENT</span>
                  {activeTool.deprecated && (
                    <span className="ad-badge-dep" style={{ padding: "4px 8px", fontSize: 11 }}>DEPRECATED</span>
                  )}
                </div>
                <p className="ad-desc-lead">{activeTool.description}</p>

                <div className="ad-split">
                  {/* Left Column: Input Schema Table */}
                  <div className="ad-panel-left">
                    <div className="ad-card">
                      <div className="ad-card-title">Input Parameters</div>
                      {activeTool.inputSchema.properties && Object.keys(activeTool.inputSchema.properties).length > 0 ? (
                        Object.entries(activeTool.inputSchema.properties).map(([key, prop]) => {
                          const isReq = activeTool.inputSchema.required?.includes(key);
                          return (
                            <div key={key} className="ad-param-row">
                              <span className="ad-param-name">{key}</span>
                              <span className="ad-param-type">{prop.type || (prop.enum ? "enum" : "object")}</span>
                              {isReq && <span className="ad-param-req">required</span>}
                              {prop.description && <div className="ad-param-desc">{prop.description}</div>}
                              {prop.enum && (
                                <div style={{ marginTop: 4, display: "flex", gap: 4, flexWrap: "wrap" }}>
                                  {prop.enum.map(e => (
                                    <code key={e} style={{ fontSize: 11, background: "#1f2633", padding: "1px 5px", borderRadius: 3, color: "#93c5fd" }}>
                                      {e}
                                    </code>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })
                      ) : (
                        <div style={{ color: "#6b7280", fontSize: 13, fontStyle: "italic" }}>
                          This tool takes no parameters. Call with an empty object: <code>{}</code>.
                        </div>
                      )}
                    </div>

                    <div className="ad-card">
                      <div className="ad-card-title">Tool Annotations</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, fontSize: 12 }}>
                        <div><span style={{ color: "#6b7280" }}>readOnlyHint:</span> <strong style={{ color: "#34d399" }}>true</strong></div>
                        <div><span style={{ color: "#6b7280" }}>destructiveHint:</span> <strong style={{ color: "#34d399" }}>false</strong></div>
                        <div><span style={{ color: "#6b7280" }}>idempotentHint:</span> <strong style={{ color: "#34d399" }}>true</strong></div>
                        <div><span style={{ color: "#6b7280" }}>openWorldHint:</span> <strong style={{ color: "#34d399" }}>false</strong></div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Interactive Code Console */}
                  <div className="ad-panel-right">
                    <div className="ad-code-tabs">
                      <div className="ad-tabs-left">
                        <button
                          className={`ad-code-tab ${codeTab === "claude" ? "active" : ""}`}
                          onClick={() => setCodeTab("claude")}
                        >
                          Claude Tool
                        </button>
                        <button
                          className={`ad-code-tab ${codeTab === "sdk" ? "active" : ""}`}
                          onClick={() => setCodeTab("sdk")}
                        >
                          TypeScript SDK
                        </button>
                        <button
                          className={`ad-code-tab ${codeTab === "jsonrpc" ? "active" : ""}`}
                          onClick={() => setCodeTab("jsonrpc")}
                        >
                          JSON-RPC
                        </button>
                        <button
                          className={`ad-code-tab ${codeTab === "schema" ? "active" : ""}`}
                          onClick={() => setCodeTab("schema")}
                        >
                          Schema
                        </button>
                      </div>
                      <button
                        className="ad-copy-btn"
                        onClick={() => {
                          const content = codeTab === "claude"
                            ? `await mcp.call("${activeTool.name}", {});`
                            : codeTab === "sdk"
                            ? `await dl.callTool("${activeTool.name}", {});`
                            : codeTab === "jsonrpc"
                            ? JSON.stringify({ jsonrpc: "2.0", method: "tools/call", params: { name: activeTool.name, arguments: {} } }, null, 2)
                            : JSON.stringify(activeTool.inputSchema, null, 2);
                          handleCopy(content);
                        }}
                      >
                        {copied ? "Copied ✓" : "Copy"}
                      </button>
                    </div>

                    <pre className="ad-code-body">
{codeTab === "claude" && `// Assistant calls DashLint MCP tool
await mcp.callTool("${activeTool.name}", ${
  activeTool.inputSchema.properties && Object.keys(activeTool.inputSchema.properties).length > 0
    ? JSON.stringify(
        Object.fromEntries(
          Object.entries(activeTool.inputSchema.properties).map(([k, v]) => [
            k,
            v.type === "string" ? `<${k}>` : v.type === "array" ? [] : v.type === "number" ? 0 : {}
          ])
        ),
        null,
        2
      )
    : "{}"
});`}

{codeTab === "sdk" && `import { DashLint } from "dashlint-sdk";

const dl = new DashLint();
const result = await dl.callTool("${activeTool.name}", {});`}

{codeTab === "jsonrpc" && JSON.stringify(
  {
    jsonrpc: "2.0",
    id: 1,
    method: "tools/call",
    params: {
      name: activeTool.name,
      arguments: activeTool.inputSchema.properties && Object.keys(activeTool.inputSchema.properties).length > 0
        ? Object.fromEntries(Object.keys(activeTool.inputSchema.properties).map(k => [k, "..."]))
        : {}
    }
  },
  null,
  2
)}

{codeTab === "schema" && JSON.stringify(activeTool.inputSchema, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </>
  );
}

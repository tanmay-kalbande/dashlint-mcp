"use client";

import { useState } from "react";
import manifest from "@/lib/tools.manifest.json";

const MCP_URL = "https://dashlint.tanmaysk.in/mcp";

type Tool = {
  name: string;
  description: string;
  deprecated: boolean;
  inputSchema: Record<string, unknown>;
};

const tools = (manifest as { tools: Tool[] }).tools;

function SchemaView({ schema, depth = 0 }: { schema: Record<string, unknown>; depth?: number }) {
  const props = schema.properties as Record<string, Record<string, unknown>> | undefined;
  const required = (schema.required as string[]) || [];
  if (!props) return <span className="docs-muted" style={{ fontSize: 13 }}>No parameters</span>;

  return (
    <div style={{ paddingLeft: depth > 0 ? 16 : 0 }}>
      {Object.entries(props).map(([key, val]) => {
        const isRequired = required.includes(key);
        const type = (val.type as string) || (val.enum ? "enum" : val.oneOf ? "union" : "object");
        const enumVals = val.enum as string[] | undefined;
        const nested = val.properties ? val : val.items && typeof val.items === "object" && (val.items as Record<string, unknown>).properties ? val.items : null;

        return (
          <div key={key} style={{ marginBottom: 10, borderLeft: "2px solid var(--ln)", paddingLeft: 12 }}>
            <div>
              <code className="docs-code-key">{key}</code>
              <span className="docs-muted" style={{ fontSize: 12, marginLeft: 8 }}>{type}{(val.type === "array") ? "[]" : ""}</span>
              {isRequired && <span className="docs-required">required</span>}
            </div>
            {enumVals && (
              <div style={{ fontSize: 12, color: "var(--mu)", marginTop: 2 }}>
                Values: {enumVals.map((v, i) => <code key={i} className="docs-enum-val">{v}</code>)}
              </div>
            )}
            {nested && <SchemaView schema={nested as Record<string, unknown>} depth={depth + 1} />}
          </div>
        );
      })}
    </div>
  );
}

export default function DocsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "deprecated">("all");

  const activeTools = tools.filter(t => !t.deprecated);
  const deprecatedTools = tools.filter(t => t.deprecated);
  const filtered = filter === "all" ? tools : filter === "active" ? activeTools : deprecatedTools;

  return (
    <>
      <style>{`
        .docs-page {
          max-width: 860px;
          margin: 0 auto;
          padding: 48px 24px 80px;
          font-family: var(--sans);
          color: var(--ink);
          min-height: 100vh;
        }
        .docs-back {
          color: var(--mu);
          text-decoration: none;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }
        .docs-back:hover { color: var(--ink); }
        .docs-header { margin-top: 24px; margin-bottom: 32px; }
        .docs-h1 {
          font-size: 28px;
          font-weight: 700;
          color: var(--ink);
          margin: 0 0 4px;
          font-family: var(--sans);
        }
        .docs-subtitle {
          color: var(--mu);
          font-size: 15px;
          line-height: 1.6;
          margin: 0;
        }
        .docs-subtitle code {
          background: var(--s2);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 13px;
          font-family: var(--mono);
          color: var(--ink);
        }
        .docs-filters {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }
        .docs-filter-btn {
          padding: 6px 14px;
          border-radius: 6px;
          border: 1px solid var(--ln);
          background: transparent;
          color: var(--mu);
          cursor: pointer;
          font-size: 13px;
          font-weight: 500;
          font-family: var(--sans);
          text-transform: capitalize;
          transition: all 0.2s;
        }
        .docs-filter-btn:hover { border-color: var(--ls); color: var(--ink); }
        .docs-filter-btn.active {
          border-color: var(--ls);
          background: var(--s2);
          color: var(--ink);
        }
        .docs-tool-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .docs-tool-card {
          border: 1px solid var(--ln);
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 0.2s;
        }
        .docs-tool-card:hover { border-color: var(--ls); }
        .docs-tool-card.open { background: var(--s2); }
        .docs-tool-btn {
          width: 100%;
          padding: 14px 16px;
          display: flex;
          align-items: flex-start;
          gap: 10px;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          color: var(--ink);
          font-family: var(--sans);
        }
        .docs-tool-btn:hover { background: var(--s2); }
        .docs-chevron {
          color: var(--mu);
          font-size: 14px;
          margin-top: 2px;
          flex-shrink: 0;
          transition: transform 0.2s;
        }
        .docs-chevron.open { transform: rotate(90deg); }
        .docs-tool-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--ac);
          font-family: var(--mono);
        }
        .docs-badge-deprecated {
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          background: #7f1d1d;
          color: #fca5a5;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .docs-badge-no-params {
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 4px;
          background: var(--s2);
          color: var(--ac);
        }
        .docs-tool-desc {
          font-size: 13px;
          color: var(--mu);
          margin-top: 4px;
          line-height: 1.5;
        }
        .docs-detail-panel {
          padding: 0 16px 16px 40px;
          border-top: 1px solid var(--ln);
        }
        .docs-section-label {
          font-size: 12px;
          font-weight: 600;
          color: var(--mu);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .docs-full-desc {
          font-size: 13px;
          color: var(--ink);
          line-height: 1.6;
          opacity: 0.85;
        }
        .docs-pre {
          background: var(--sf);
          border: 1px solid var(--ln);
          border-radius: 6px;
          padding: 12px;
          font-size: 12px;
          overflow-x: auto;
          color: var(--ink);
          font-family: var(--mono);
          line-height: 1.5;
        }
        .docs-deprecated-warn {
          margin-top: 12px;
          padding: 8px 12px;
          background: rgba(127, 29, 29, 0.13);
          border: 1px solid #7f1d1d;
          border-radius: 6px;
          font-size: 13px;
          color: #fca5a5;
        }
        .docs-code-key {
          color: var(--ac);
          font-size: 13px;
          font-family: var(--mono);
        }
        .docs-muted { color: var(--mu); }
        .docs-required {
          color: #f87171;
          font-size: 11px;
          margin-left: 6px;
          font-weight: 600;
        }
        .docs-enum-val {
          background: var(--s2);
          padding: 1px 5px;
          border-radius: 3px;
          margin-right: 4px;
          font-size: 11px;
          font-family: var(--mono);
        }
        .docs-footer {
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px solid var(--ln);
          text-align: center;
          font-size: 13px;
          color: var(--mu);
        }
        .docs-footer a {
          color: var(--ac);
          transition: color 0.2s;
        }
        .docs-footer a:hover { color: var(--ink); }
        @media (max-width: 640px) {
          .docs-page { padding: 24px 16px 64px; }
          .docs-h1 { font-size: 22px; }
          .docs-detail-panel { padding: 0 12px 12px 28px; }
        }
      `}</style>

      <main className="docs-page">
        <a href="/" className="docs-back">
          {"\u2190"} Back to DashLint
        </a>

        <div className="docs-header">
          <h1 className="docs-h1">API Documentation</h1>
          <p className="docs-subtitle">
            DashLint MCP Server {"\u2014"} {activeTools.length} active tools, {deprecatedTools.length} deprecated.
            Connect via <code>{MCP_URL}</code>
          </p>
        </div>

        <div className="docs-filters">
          {(["all", "active", "deprecated"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`docs-filter-btn ${filter === f ? "active" : ""}`}
            >
              {f} ({f === "all" ? tools.length : f === "active" ? activeTools.length : deprecatedTools.length})
            </button>
          ))}
        </div>

        <div className="docs-tool-list">
          {filtered.map(tool => {
            const isOpen = expanded === tool.name;
            const hasParams = tool.inputSchema.properties && Object.keys(tool.inputSchema.properties as object).length > 0;

            return (
              <div
                key={tool.name}
                className={`docs-tool-card ${isOpen ? "open" : ""}`}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : tool.name)}
                  className="docs-tool-btn"
                >
                  <span className={`docs-chevron ${isOpen ? "open" : ""}`}>{"\u25B6"}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <code className="docs-tool-name">{tool.name}()</code>
                      {tool.deprecated && (
                        <span className="docs-badge-deprecated">deprecated</span>
                      )}
                      {!hasParams && (
                        <span className="docs-badge-no-params">no params</span>
                      )}
                    </div>
                    <p className="docs-tool-desc">
                      {tool.description.length > 160 && !isOpen ? tool.description.slice(0, 160) + "\u2026" : tool.description}
                    </p>
                  </div>
                </button>

                {isOpen && (
                  <div className="docs-detail-panel">
                    <div style={{ marginTop: 12 }}>
                      <h4 className="docs-section-label">Full Description</h4>
                      <p className="docs-full-desc">{tool.description}</p>
                    </div>

                    <div style={{ marginTop: 16 }}>
                      <h4 className="docs-section-label">Input Schema</h4>
                      <SchemaView schema={tool.inputSchema} />
                    </div>

                    <div style={{ marginTop: 16 }}>
                      <h4 className="docs-section-label">Example Call</h4>
                      <pre className="docs-pre">
{hasParams
  ? `// MCP tool call\nawait client.callTool("${tool.name}", ${JSON.stringify(
      Object.fromEntries(
        Object.entries(tool.inputSchema.properties as Record<string, Record<string, unknown>>).map(([k, v]) => {
          if (v.type === "string") return [k, `<${k}>` ];
          if (v.type === "integer" || v.type === "number") return [k, 0];
          if (v.type === "array") return [k, ["..."]];
          if (v.type === "object") return [k, {}];
          return [k, null];
        })
      ), null, 2
    )});`
  : `// MCP tool call (no parameters)\nawait client.callTool("${tool.name}", {});`}
                      </pre>
                    </div>

                    {tool.deprecated && (
                      <div className="docs-deprecated-warn">
                        {"\u26A0\uFE0F"} This tool is deprecated. Use <code style={{ fontWeight: 600 }}>get_dashboard_kit()</code> instead.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <footer className="docs-footer">
          <p>DashLint MCP v{(manifest as { version: string }).version} {"\u00B7"} <a href="/terms">Terms</a> {"\u00B7"} <a href="/privacy">Privacy</a> {"\u00B7"} <a href="https://linkedin.com/in/tanmay-kalbande" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>
        </footer>
      </main>
    </>
  );
}

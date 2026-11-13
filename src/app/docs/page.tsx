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
  if (!props) return <span style={{ color: "#6b7280", fontSize: 13 }}>No parameters</span>;

  return (
    <div style={{ paddingLeft: depth > 0 ? 16 : 0 }}>
      {Object.entries(props).map(([key, val]) => {
        const isRequired = required.includes(key);
        const type = (val.type as string) || (val.enum ? "enum" : val.oneOf ? "union" : "object");
        const enumVals = val.enum as string[] | undefined;
        const nested = val.properties ? val : val.items && typeof val.items === "object" && (val.items as Record<string, unknown>).properties ? val.items : null;

        return (
          <div key={key} style={{ marginBottom: 10, borderLeft: "2px solid #2d3748", paddingLeft: 12 }}>
            <div>
              <code style={{ color: "#93c5fd", fontSize: 13 }}>{key}</code>
              <span style={{ color: "#6b7280", fontSize: 12, marginLeft: 8 }}>{type}{(val.type === "array") ? "[]" : ""}</span>
              {isRequired && <span style={{ color: "#f87171", fontSize: 11, marginLeft: 6, fontWeight: 600 }}>required</span>}
            </div>
            {enumVals && (
              <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>
                Values: {enumVals.map((v, i) => <code key={i} style={{ background: "#1f2937", padding: "1px 5px", borderRadius: 3, marginRight: 4, fontSize: 11 }}>{v}</code>)}
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
    <main style={{ maxWidth: 860, margin: "0 auto", padding: "48px 24px 80px", fontFamily: "Inter, system-ui, sans-serif", color: "#e5e7eb" }}>
      <a href="/" style={{ color: "#9ca3af", textDecoration: "none", fontSize: 14 }}>← Back to DashLint</a>

      <div style={{ marginTop: 24, marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: "#f9fafb", marginBottom: 4 }}>API Documentation</h1>
        <p style={{ color: "#9ca3af", fontSize: 15, lineHeight: 1.6 }}>
          DashLint MCP Server — {activeTools.length} active tools, {deprecatedTools.length} deprecated.
          Connect via <code style={{ background: "#1f2937", padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>{MCP_URL}</code>
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        {(["all", "active", "deprecated"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 14px",
              borderRadius: 6,
              border: "1px solid " + (filter === f ? "#4b5563" : "#2d3748"),
              background: filter === f ? "#1f2937" : "transparent",
              color: filter === f ? "#f9fafb" : "#9ca3af",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 500,
              textTransform: "capitalize",
            }}
          >
            {f} ({f === "all" ? tools.length : f === "active" ? activeTools.length : deprecatedTools.length})
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map(tool => {
          const isOpen = expanded === tool.name;
          const hasParams = tool.inputSchema.properties && Object.keys(tool.inputSchema.properties as object).length > 0;

          return (
            <div
              key={tool.name}
              style={{
                border: "1px solid #2d3748",
                borderRadius: 8,
                overflow: "hidden",
                background: isOpen ? "#111827" : "transparent",
              }}
            >
              <button
                onClick={() => setExpanded(isOpen ? null : tool.name)}
                style={{
                  width: "100%",
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                  color: "#e5e7eb",
                }}
              >
                <span style={{ color: "#6b7280", fontSize: 14, marginTop: 2, flexShrink: 0, transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "none" }}>▶</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <code style={{ fontSize: 14, fontWeight: 600, color: "#93c5fd", fontFamily: "'IBM Plex Mono', monospace" }}>{tool.name}()</code>
                    {tool.deprecated && (
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: "#7f1d1d", color: "#fca5a5", textTransform: "uppercase", letterSpacing: "0.5px" }}>deprecated</span>
                    )}
                    {!hasParams && (
                      <span style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "#1e3a5f", color: "#93c5fd" }}>no params</span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: "#9ca3af", marginTop: 4, lineHeight: 1.5 }}>
                    {tool.description.length > 160 && !isOpen ? tool.description.slice(0, 160) + "…" : tool.description}
                  </p>
                </div>
              </button>

              {isOpen && (
                <div style={{ padding: "0 16px 16px 40px", borderTop: "1px solid #1f2937" }}>
                  <div style={{ marginTop: 12 }}>
                    <h4 style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Full Description</h4>
                    <p style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.6 }}>{tool.description}</p>
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <h4 style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Input Schema</h4>
                    <SchemaView schema={tool.inputSchema} />
                  </div>

                  <div style={{ marginTop: 16 }}>
                    <h4 style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Example Call</h4>
                    <pre style={{ background: "#0d1117", border: "1px solid #2d3748", borderRadius: 6, padding: 12, fontSize: 12, overflowX: "auto", color: "#e5e7eb", fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1.5 }}>
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
                    <div style={{ marginTop: 12, padding: "8px 12px", background: "#7f1d1d22", border: "1px solid #7f1d1d", borderRadius: 6, fontSize: 13, color: "#fca5a5" }}>
                      ⚠️ This tool is deprecated. Use <code style={{ fontWeight: 600 }}>get_dashboard_kit()</code> instead.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <footer style={{ marginTop: 48, paddingTop: 24, borderTop: "1px solid #1f2937", textAlign: "center", fontSize: 13, color: "#6b7280" }}>
        <p>DashLint MCP v{(manifest as { version: string }).version} · <a href="/terms" style={{ color: "#60a5fa" }}>Terms</a> · <a href="/privacy" style={{ color: "#60a5fa" }}>Privacy</a> · <a href="https://linkedin.com/in/tanmay-kalbande" target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa" }}>LinkedIn</a></p>
      </footer>
    </main>
  );
}

"use client";

import { useState, useEffect } from "react";

interface HealthData {
  status: string;
  serverVersion: string;
  dashboardKitVersion: string;
  protocolVersion: string;
  timestamp: string;
  uptime: number;
  counter: {
    status: string;
    circuitState: string;
    consecutiveFailures: number;
    queuedIncrements: number;
    configured: boolean;
  };
}

interface StatsData {
  total: number;
  byTool?: Record<string, number>;
  raw?: Record<string, number>;
  counterVersion: string;
  error?: string;
}

interface WebhookItem {
  id: string;
  url: string;
  events: string[];
  label?: string;
  createdAt: string;
}

export default function AdminPage() {
  const [token, setToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [health, setHealth] = useState<HealthData | null>(null);
  const [stats, setStats] = useState<StatsData | null>(null);
  const [webhooks, setWebhooks] = useState<WebhookItem[]>([]);
  const [testWebhookUrl, setTestWebhookUrl] = useState("");
  const [testStatus, setTestStatus] = useState<string | null>(null);

  // Auto-login from session storage if previously entered
  useEffect(() => {
    document.body.classList.add("standalone-body");
    const saved = sessionStorage.getItem("dl_admin_token");
    if (saved) {
      setToken(saved);
      loadDashboard(saved);
    } else {
      // Fetch public health info even without auth
      fetch("/api/health")
        .then((r) => r.json())
        .then(setHealth)
        .catch(() => {});
    }
    return () => {
      document.body.classList.remove("standalone-body");
    };
  }, []);

  async function loadDashboard(authToken: string) {
    setLoading(true);
    setErrorMsg(null);

    try {
      // 1. Fetch Health
      const hRes = await fetch("/api/health");
      if (hRes.ok) setHealth(await hRes.json());

      // 2. Fetch Authenticated Stats
      const sRes = await fetch("/api/stats", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const sData: StatsData = await sRes.json();

      if (!sData.byTool) {
        setErrorMsg("Authentication failed. Invalid STATS_API_TOKEN.");
        setAuthenticated(false);
        setLoading(false);
        return;
      }

      setStats(sData);
      setAuthenticated(true);
      sessionStorage.setItem("dl_admin_token", authToken);

      // 3. Fetch Webhooks
      const wRes = await fetch("/api/webhooks", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (wRes.ok) {
        const wData = await wRes.json();
        setWebhooks(wData.webhooks || []);
      }
    } catch {
      setErrorMsg("Network error connecting to DashLint API.");
    } finally {
      setLoading(false);
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!token.trim()) return;
    loadDashboard(token.trim());
  }

  function handleLogout() {
    sessionStorage.removeItem("dl_admin_token");
    setAuthenticated(false);
    setToken("");
    setStats(null);
  }

  async function handleDeleteWebhook(id: string) {
    if (!confirm(`Delete webhook ${id}?`)) return;
    try {
      const res = await fetch(`/api/webhooks?id=${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setWebhooks((prev) => prev.filter((w) => w.id !== id));
      }
    } catch {
      alert("Failed to delete webhook.");
    }
  }

  async function handleRegisterTestWebhook(e: React.FormEvent) {
    e.preventDefault();
    if (!testWebhookUrl.trim()) return;
    setTestStatus("Registering...");

    try {
      const res = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: testWebhookUrl.trim(),
          events: ["new_feature", "server_status"],
          label: "Admin Test",
        }),
      });

      if (res.ok) {
        setTestStatus("Registered successfully!");
        setTestWebhookUrl("");
        loadDashboard(token);
      } else {
        const err = await res.json();
        setTestStatus(`Error: ${err.error || "Failed"}`);
      }
    } catch {
      setTestStatus("Failed to send request.");
    }
  }

  // Calculate tool shares
  const toolList = stats?.byTool
    ? Object.entries(stats.byTool).sort((a, b) => b[1] - a[1])
    : [];
  const maxCalls = toolList.length > 0 ? toolList[0][1] : 1;

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
          grid-template-columns: none !important;
        }
      `}</style>
      <main
        className="subpage admin-page standalone-page"
      style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "40px 24px 80px",
        fontFamily: "var(--sans)",
        color: "var(--ink)",
      }}
    >
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 32,
          borderBottom: "1px solid #1f2937",
          paddingBottom: 20,
        }}
      >
        <div>
          <a
            href="/"
            style={{ color: "#9ca3af", textDecoration: "none", fontSize: 13 }}
          >
            ← Back to DashLint
          </a>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#f9fafb",
              marginTop: 6,
            }}
          >
            MCP Admin Console
          </h1>
        </div>

        {authenticated && (
          <button
            onClick={handleLogout}
            style={{
              padding: "6px 14px",
              background: "#1f2937",
              border: "1px solid #374151",
              borderRadius: 6,
              color: "#9ca3af",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            Disconnect
          </button>
        )}
      </div>

      {/* Authentication Form if not logged in */}
      {!authenticated ? (
        <div
          style={{
            maxWidth: 440,
            margin: "60px auto",
            padding: 32,
            background: "#111827",
            border: "1px solid #1f2937",
            borderRadius: 12,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "#1f2937",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              color: "#93c5fd",
              fontSize: 20,
            }}
          >
            🔒
          </div>
          <h2 style={{ fontSize: 18, fontWeight: 600, color: "#f9fafb", marginBottom: 8 }}>
            Admin Authentication
          </h2>
          <p style={{ color: "#9ca3af", fontSize: 13, marginBottom: 24, lineHeight: 1.5 }}>
            Enter your configured <code style={{ color: "#93c5fd" }}>STATS_API_TOKEN</code> to access metrics, circuit breaker controls, and webhooks.
          </p>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="password"
              placeholder="Paste STATS_API_TOKEN"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              style={{
                padding: "10px 14px",
                background: "#0b0f17",
                border: "1px solid #374151",
                borderRadius: 8,
                color: "#f9fafb",
                fontSize: 14,
                outline: "none",
                fontFamily: "'IBM Plex Mono', monospace",
              }}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "10px",
                background: "#2563eb",
                border: "none",
                borderRadius: 8,
                color: "#fff",
                fontWeight: 600,
                fontSize: 14,
                cursor: loading ? "wait" : "pointer",
              }}
            >
              {loading ? "Authenticating..." : "Unlock Console"}
            </button>
          </form>

          {errorMsg && (
            <p style={{ color: "#f87171", fontSize: 13, marginTop: 16 }}>
              {errorMsg}
            </p>
          )}
        </div>
      ) : (
        /* Authenticated Dashboard View */
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* 1. Health & System Status Grid */}
          <section>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
              Runtime Status &amp; Telemetry
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14 }}>
              {/* Server State */}
              <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 8, padding: "16px 20px" }}>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>Server State</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: health?.status === "healthy" ? "#10b981" : "#f59e0b",
                    }}
                  />
                  <b style={{ fontSize: 16, color: "#f9fafb", textTransform: "uppercase" }}>
                    {health?.status || "Unknown"}
                  </b>
                </div>
              </div>

              {/* Version Info */}
              <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 8, padding: "16px 20px" }}>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>Server / Kit Version</span>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#93c5fd", marginTop: 6, fontFamily: "'IBM Plex Mono', monospace" }}>
                  v{health?.serverVersion} / {health?.dashboardKitVersion}
                </div>
              </div>

              {/* Circuit Breaker */}
              <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 8, padding: "16px 20px" }}>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>Circuit Breaker</span>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: health?.counter?.circuitState === "closed" ? "#10b981" : "#ef4444",
                    }}
                  />
                  <b style={{ fontSize: 15, color: "#f9fafb", fontFamily: "'IBM Plex Mono', monospace" }}>
                    {health?.counter?.circuitState || "closed"}
                  </b>
                  <small style={{ color: "#6b7280", fontSize: 11 }}>
                    ({health?.counter?.queuedIncrements ?? 0} queued)
                  </small>
                </div>
              </div>

              {/* Total Calls */}
              <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 8, padding: "16px 20px" }}>
                <span style={{ fontSize: 12, color: "#9ca3af" }}>Total Tool Calls</span>
                <div style={{ fontSize: 20, fontWeight: 700, color: "#f9fafb", marginTop: 4, fontFamily: "'IBM Plex Mono', monospace" }}>
                  {(stats?.total ?? 0).toLocaleString()}
                </div>
              </div>
            </div>
          </section>

          {/* 2. Tool Breakdown Visualizer */}
          <section>
            <h2 style={{ fontSize: 14, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>
              Tool Usage Distribution (v2)
            </h2>
            <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 8, padding: 20 }}>
              {toolList.length === 0 ? (
                <p style={{ color: "#6b7280", fontSize: 13 }}>No calls recorded yet for v2.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {toolList.map(([toolName, count]) => {
                    const percent = Math.round((count / (stats?.total || 1)) * 100);
                    const barWidth = Math.max(4, Math.round((count / maxCalls) * 100));

                    return (
                      <div key={toolName}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 13 }}>
                          <code style={{ color: "#93c5fd", fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace" }}>
                            {toolName}
                          </code>
                          <span style={{ color: "#9ca3af", fontFamily: "'IBM Plex Mono', monospace" }}>
                            {count.toLocaleString()} <span style={{ color: "#6b7280", fontSize: 11 }}>({percent}%)</span>
                          </span>
                        </div>
                        <div style={{ height: 6, background: "#1f2937", borderRadius: 3, overflow: "hidden" }}>
                          <div
                            style={{
                              height: "100%",
                              width: `${barWidth}%`,
                              background: "#3b82f6",
                              borderRadius: 3,
                              transition: "width 0.4s ease",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* 3. Webhook Subscriptions Management */}
          <section>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 1 }}>
                Webhook Subscribers ({webhooks.length})
              </h2>
            </div>

            <div style={{ background: "#111827", border: "1px solid #1f2937", borderRadius: 8, overflow: "hidden" }}>
              {webhooks.length === 0 ? (
                <div style={{ padding: 24, textAlign: "center", color: "#6b7280", fontSize: 13 }}>
                  No webhooks registered yet. You can register endpoints to receive notifications for new domain packs, version updates, and outages.
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, textAlign: "left" }}>
                    <thead>
                      <tr style={{ background: "#1a2234", color: "#9ca3af", borderBottom: "1px solid #1f2937" }}>
                        <th style={{ padding: "10px 16px" }}>ID &amp; Label</th>
                        <th style={{ padding: "10px 16px" }}>Endpoint URL</th>
                        <th style={{ padding: "10px 16px" }}>Events</th>
                        <th style={{ padding: "10px 16px" }}>Subscribed</th>
                        <th style={{ padding: "10px 16px", textAlign: "right" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {webhooks.map((w) => (
                        <tr key={w.id} style={{ borderBottom: "1px solid #1f2937" }}>
                          <td style={{ padding: "12px 16px" }}>
                            <code style={{ color: "#93c5fd", fontSize: 12 }}>{w.id}</code>
                            {w.label && <div style={{ fontSize: 11, color: "#6b7280" }}>{w.label}</div>}
                          </td>
                          <td style={{ padding: "12px 16px", maxWidth: 260, wordBreak: "break-all" }}>
                            {w.url}
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            {w.events.map((e) => (
                              <span
                                key={e}
                                style={{
                                  display: "inline-block",
                                  padding: "2px 6px",
                                  background: "#1f2937",
                                  borderRadius: 4,
                                  fontSize: 11,
                                  marginRight: 4,
                                  marginBottom: 2,
                                  color: "#9ca3af",
                                }}
                              >
                                {e}
                              </span>
                            ))}
                          </td>
                          <td style={{ padding: "12px 16px", color: "#6b7280", fontSize: 12 }}>
                            {new Date(w.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "right" }}>
                            <button
                              onClick={() => handleDeleteWebhook(w.id)}
                              style={{
                                padding: "4px 8px",
                                background: "#7f1d1d33",
                                border: "1px solid #7f1d1d",
                                borderRadius: 4,
                                color: "#fca5a5",
                                cursor: "pointer",
                                fontSize: 11,
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Quick Add Webhook Form */}
              <div style={{ padding: 16, borderTop: "1px solid #1f2937", background: "#0e131f" }}>
                <form
                  onSubmit={handleRegisterTestWebhook}
                  style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}
                >
                  <input
                    type="url"
                    placeholder="https://your-webhook-endpoint.com"
                    value={testWebhookUrl}
                    onChange={(e) => setTestWebhookUrl(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: 260,
                      padding: "8px 12px",
                      background: "#111827",
                      border: "1px solid #374151",
                      borderRadius: 6,
                      color: "#f9fafb",
                      fontSize: 13,
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      padding: "8px 16px",
                      background: "#2563eb",
                      border: "none",
                      borderRadius: 6,
                      color: "#fff",
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Add Webhook
                  </button>
                  {testStatus && (
                    <span style={{ fontSize: 12, color: "#9ca3af", marginLeft: 8 }}>
                      {testStatus}
                    </span>
                  )}
                </form>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Footer */}
      <footer
        style={{
          marginTop: 60,
          paddingTop: 24,
          borderTop: "1px solid #1f2937",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 13,
          color: "#6b7280",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span>DashLint MCP Admin · Strict Metadata Orchestration</span>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="/docs" style={{ color: "#60a5fa", textDecoration: "none" }}>API Docs</a>
          <a href="/terms" style={{ color: "#60a5fa", textDecoration: "none" }}>Terms</a>
          <a href="/privacy" style={{ color: "#60a5fa", textDecoration: "none" }}>Privacy</a>
        </div>
      </footer>
    </main>
    </>
  );
}

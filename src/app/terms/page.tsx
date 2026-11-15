"use client";

import { useState, useEffect } from "react";

const MCP_URL = "https://dashlint.tanmaysk.in/mcp";

export default function TermsPage() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const saved =
      (typeof localStorage !== "undefined" &&
        localStorage.getItem("dl-theme")) ||
      "dark";
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      document.title = "Terms of Service — DashLint";
      document.documentElement.dataset.theme = saved;
    }
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("dl-theme", next);
    } catch {}
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(MCP_URL);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 1600);
    } catch {}
  };

  return (
    <>
      {/* ---------------- SIDEBAR (.rail - EXACT 268px MATCHING LANDING PAGE) ---------------- */}
      <aside className="rail doc-rail">
        <a href="/" className="logo" style={{ textDecoration: "none", color: "inherit" }}>
          <i>D/</i>
          <div>
            <b>DASHLINT</b>
            <small>legal &amp; compliance</small>
          </div>
        </a>

        <div>
          <p className="lb">NAVIGATION</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span
              className="doc-nav-btn active"
              style={{ cursor: "default" }}
            >
              <span className="dot" />
              <span>Terms of Service</span>
            </span>
            <a href="/privacy" className="doc-nav-btn">
              <span className="dot" />
              <span>Privacy Policy</span>
            </a>
            <a href="/docs" className="doc-nav-btn">
              <span className="dot" />
              <span>API Documentation</span>
            </a>
            <a href="/" className="doc-nav-btn">
              <span className="dot" />
              <span>DashLint MCP Home</span>
            </a>
          </div>
        </div>

        <div>
          <p className="lb">TRUST &amp; ARCHITECTURE</p>
          <ul className="wl" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "#9CA3AF" }}>
            <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "var(--ok)" }}>✓</span> Zero dataset rows collected
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "var(--ok)" }}>✓</span> 100% Client-side execution
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "var(--ok)" }}>✓</span> Open Source (MIT License)
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "var(--ok)" }}>✓</span> Standalone portable HTML
            </li>
          </ul>
        </div>

        <div>
          <p className="lb">WORKS WITH</p>
          <ul className="wl" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 5, fontSize: 12, color: "#9CA3AF" }}>
            <li>• Claude</li>
            <li>• Cursor</li>
            <li>• ChatGPT</li>
            <li>• Windsurf</li>
            <li>• Any MCP client</li>
          </ul>
        </div>

        <div className="bt" style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: 10 }}>
          <div className="st">
            <span>
              <span className="dot"></span>
              <b>reusable dashboard output · no API key</b>
            </span>
          </div>
          <button className="btn cp" onClick={handleCopyUrl} style={{ width: "100%", justifyContent: "center" }}>
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

      {/* ---------------- VIEWPORT (.vp) ---------------- */}
      <div className="vp">
        {/* Top Header Bar */}
        <header className="hs mh">
          <div className="m-brand">
            <i>D/</i>
            <div>
              <b>DASHLINT</b>
              <small>legal &amp; compliance</small>
            </div>
          </div>
          <span className="cr">
            dashlint / legal / <b>terms of service</b>
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
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                </svg>
              )}
            </button>
            <a href="/" className="btn sm d-only">
              How to use
            </a>
            <a href="/docs" className="btn-doc-tab d-only" title="DashLint MCP Documentation">
              <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 3h7a2 2 0 0 1 2 2v8a1.5 1.5 0 0 0-1.5-1.5H2.5V3z" />
                <path d="M2.5 11.5h7.5" />
              </svg>
              <span>Docs</span>
            </a>
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
        {/* Sits within the 2-column grid and scrolls strictly INSIDE the panel */}
        <div className="pn doc-main-cluster">
          <div style={{ maxWidth: 840 }}>
            <div style={{ marginBottom: 16 }}>
              <span
                className="mono"
                style={{
                  fontSize: 11,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "var(--mu)",
                  background: "var(--s2)",
                  padding: "4px 8px",
                  borderRadius: 4,
                  border: "1px solid var(--ln)",
                }}
              >
                MCP SERVER · LEGAL COMPLIANCE · MIT OPEN SOURCE
              </span>
            </div>

            <h1
              style={{
                font: "700 clamp(36px, 4.4vw, 56px)/.95 Oswald, sans-serif",
                textTransform: "uppercase",
                margin: "0 0 12px",
                color: "var(--ink)",
              }}
            >
              TERMS OF SERVICE
            </h1>

            <p style={{ fontSize: 14, color: "var(--mu)", margin: "0 0 28px" }}>
              Last updated: November 2026 · DashLint open-source Model Context Protocol server
            </p>

            <div className="legal-card">
              <h2>1. Service Description</h2>
              <p>
                DashLint is a free, open-source MCP (Model Context Protocol) server that provides dashboard creation orchestration for AI coding assistants. It supplies workflow instructions, design patterns, and schema-aware blueprints — it does not receive, store, or process your data.
              </p>
            </div>

            <div className="legal-card">
              <h2>2. No Data Collection</h2>
              <p>
                DashLint operates on a strict privacy-first model. The MCP server accepts only aggregate column metadata (field names, types, cardinality) through the <code>build_dashboard_blueprint</code> tool. No dataset rows, sample values, personally identifiable information, or file contents are ever sent to or stored by DashLint.
              </p>
            </div>

            <div className="legal-card">
              <h2>3. Acceptable Use</h2>
              <p>You may use DashLint for any lawful purpose. You agree not to:</p>
              <ul>
                <li>Attempt to overload, disrupt, or abuse the hosted MCP endpoint</li>
                <li>Reverse-engineer the server to extract proprietary logic beyond what is openly available in the source code</li>
                <li>Misrepresent DashLint-generated outputs as your own proprietary software without attribution</li>
              </ul>
            </div>

            <div className="legal-card">
              <h2>4. Generated Dashboards</h2>
              <p>
                Dashboards created using DashLint are yours. The generated HTML files run entirely in your browser with no server dependency. You may use, modify, and distribute them freely. The default sidebar credit (&quot;built by Tanmay Kalbande&quot;) is a courtesy attribution and can be removed or replaced via the <code>credit</code> configuration.
              </p>
            </div>

            <div className="legal-card">
              <h2>5. Availability &amp; Warranties</h2>
              <p>
                DashLint is provided &quot;as is&quot; without warranty of any kind, express or implied. The service may experience downtime for maintenance or updates. We do not guarantee uninterrupted availability.
              </p>
            </div>

            <div className="legal-card">
              <h2>6. Open Source License</h2>
              <p>
                DashLint is released under the <strong>MIT License</strong>. You are free to fork, modify, and self-host the server. See the project repository for the full license text.
              </p>
            </div>

            <div className="legal-card">
              <h2>7. Changes to These Terms</h2>
              <p>
                We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </div>

            <div className="legal-card">
              <h2>8. Contact &amp; Privacy</h2>
              <p>
                For questions about these terms or custom integration, reach out via{" "}
                <a href="https://linkedin.com/in/tanmay-kalbande" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                .
              </p>
              <p style={{ marginTop: 12 }}>
                Want to learn more about our local-first security architecture?{" "}
                <a href="/privacy">Read the DashLint Privacy Policy →</a>
              </p>
            </div>

            <div
              style={{
                marginTop: 32,
                padding: "16px 20px",
                background: "var(--s2)",
                borderRadius: 8,
                border: "1px solid var(--ln)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: 12,
              }}
            >
              <div style={{ fontSize: 13, color: "var(--mu)" }}>
                Need full technical documentation? Explore tool schemas, prompts, and code samples.
              </div>
              <a href="/docs" className="btn sm">
                Explore Documentation →
              </a>
            </div>
          </div>

          <footer className="mf" style={{ marginTop: "auto", paddingTop: 32 }}>
            <span>Free · open source · MIT</span>
            <span>
              <a href="/docs" style={{ color: "inherit", textDecoration: "none" }}>Docs</a>
              {" · "}
              <a href="/terms" style={{ color: "inherit", textDecoration: "none", fontWeight: 600 }}>Terms</a>
              {" · "}
              <a href="/privacy" style={{ color: "inherit", textDecoration: "none" }}>Privacy</a>
              {" · "}
              Built with DashLint
            </span>
          </footer>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {menuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.7)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "flex-end",
          }}
          onClick={() => setMenuOpen(false)}
        >
          <div
            style={{
              width: 280,
              height: "100%",
              background: "var(--rail)",
              borderLeft: "1px solid var(--rb)",
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div className="logo">
                <i>D/</i>
                <div>
                  <b>DASHLINT</b>
                  <small>legal</small>
                </div>
              </div>
              <button
                className="btn g sm"
                onClick={() => setMenuOpen(false)}
                style={{ padding: "4px 8px" }}
              >
                ✕
              </button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }}>
              <a href="/" className="doc-nav-btn">
                <span>DashLint MCP Home</span>
              </a>
              <a href="/docs" className="doc-nav-btn">
                <span>API Documentation</span>
              </a>
              <a href="/terms" className="doc-nav-btn active">
                <span>Terms of Service</span>
              </a>
              <a href="/privacy" className="doc-nav-btn">
                <span>Privacy Policy</span>
              </a>
              <a
                href="https://linkedin.com/in/tanmay-kalbande"
                target="_blank"
                rel="noopener noreferrer"
                className="doc-nav-btn"
              >
                <span>{"LinkedIn ↗"}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

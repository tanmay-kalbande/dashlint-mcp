"use client";

import { useState, useEffect } from "react";

const MCP_URL = "https://dashlint.tanmaysk.in/mcp";

export default function PrivacyPage() {
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
      document.title = "Privacy Policy — DashLint";
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
            <small>privacy &amp; security</small>
          </div>
        </a>

        <div>
          <p className="lb">NAVIGATION</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <a href="/terms" className="doc-nav-btn">
              <span className="dot" />
              <span>Terms of Service</span>
            </a>
            <span
              className="doc-nav-btn active"
              style={{ cursor: "default" }}
            >
              <span className="dot" />
              <span>Privacy Policy</span>
            </span>
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
          <p className="lb">PRIVACY GUARANTEES</p>
          <ul className="wl" style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6, fontSize: 12, color: "#9CA3AF" }}>
            <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "var(--ok)" }}>✓</span> Zero data rows sent to server
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "var(--ok)" }}>✓</span> No PII, cookies, or user tracking
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "var(--ok)" }}>✓</span> Local in-browser parsing
            </li>
            <li style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: "var(--ok)" }}>✓</span> Offline-capable output HTML
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
              <small>privacy &amp; security</small>
            </div>
          </div>
          <span className="cr">
            dashlint / legal / <b>privacy policy</b>
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
                MCP SERVER · PRIVACY ARCHITECTURE · ZERO DATA RETENTION
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
              PRIVACY POLICY
            </h1>

            <p style={{ fontSize: 14, color: "var(--mu)", margin: "0 0 28px" }}>
              Last updated: November 2026 · DashLint open-source Model Context Protocol server
            </p>

            <div className="legal-card">
              <h2>Summary</h2>
              <p>
                <strong>Your data never leaves your machine.</strong> DashLint is designed from the ground up to be privacy-first. The MCP server is an instruction layer — it tells AI assistants <em>how</em> to build dashboards, but never sees <em>what</em> data you have.
              </p>
            </div>

            <div className="legal-card">
              <h2>What We Do NOT Collect</h2>
              <ul>
                <li>Dataset rows, records, or sample values</li>
                <li>File contents (CSV, Excel, JSON, or any other format)</li>
                <li>Personally identifiable information (PII)</li>
                <li>Business-sensitive metrics or financial data</li>
                <li>User accounts, passwords, or authentication tokens</li>
                <li>IP addresses for tracking purposes</li>
              </ul>
            </div>

            <div className="legal-card">
              <h2>What We Do Collect</h2>
              <p>The following minimal, non-identifying data is collected for service improvement:</p>
              <ul>
                <li>
                  <strong>Tool call counts:</strong> Anonymous aggregate counters tracking how many times each MCP tool is called per day (e.g., &quot;build_dashboard_blueprint was called 42 times on 2026-11-08&quot;). No request content or metadata is stored.
                </li>
                <li>
                  <strong>Column metadata (opt-in):</strong> When you call <code>build_dashboard_blueprint</code>, you send only field names, inferred types, distinct counts, and nullable percentages. This metadata is processed in-memory to generate the blueprint response and is <strong>never stored</strong>.
                </li>
                <li>
                  <strong>Vercel Analytics:</strong> Basic, anonymous page-view analytics on the website (dashlint.tanmaysk.in) provided by Vercel. No cookies are used.
                </li>
              </ul>
            </div>

            <div className="legal-card">
              <h2>How Generated Dashboards Handle Data</h2>
              <p>Dashboards generated with DashLint are standalone HTML files that:</p>
              <ul>
                <li>
                  Parse uploaded CSV and Excel files <strong>entirely in the browser</strong> using client-side JavaScript
                </li>
                <li>Never transmit file contents to any server (including DashLint)</li>
                <li>Can be used fully offline after initial download</li>
                <li>Store no data in cookies, localStorage, or external databases</li>
              </ul>
            </div>

            <div className="legal-card">
              <h2>Third-Party Services</h2>
              <ul>
                <li>
                  <strong>Vercel:</strong> Hosting and edge delivery. Subject to{" "}
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                    Vercel&apos;s Privacy Policy
                  </a>
                  .
                </li>
                <li>
                  <strong>Upstash Redis:</strong> Stores anonymous tool call counters only. No user data.
                </li>
                <li>
                  <strong>SheetJS CDN:</strong> Generated dashboards may load the SheetJS library from <code>cdn.sheetjs.com</code> for Excel parsing. This is a client-side library; no data is sent to SheetJS.
                </li>
              </ul>
            </div>

            <div className="legal-card">
              <h2>Data Retention</h2>
              <p>
                Tool call counters are stored indefinitely as aggregate daily counts. No other data is retained. Column metadata sent to <code>build_dashboard_blueprint</code> exists only in memory during request processing and is discarded immediately after the response is sent.
              </p>
            </div>

            <div className="legal-card">
              <h2>Your Rights &amp; Contact</h2>
              <p>
                Since DashLint does not collect personal data, there is nothing to access, correct, or delete. If you have concerns, please contact us via{" "}
                <a href="https://linkedin.com/in/tanmay-kalbande" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
                .
              </p>
              <p style={{ marginTop: 12 }}>
                Looking for our terms of use?{" "}
                <a href="/terms">← Read the DashLint Terms of Service</a>
              </p>
            </div>

            <div className="legal-card">
              <h2>Changes to This Policy</h2>
              <p>
                We may update this policy as the service evolves. Material changes will be noted in the public changelog and repository release notes.
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
              <a href="/terms" style={{ color: "inherit", textDecoration: "none" }}>Terms</a>
              {" · "}
              <a href="/privacy" style={{ color: "inherit", textDecoration: "none", fontWeight: 600 }}>Privacy</a>
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
                  <small>privacy</small>
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
              <a href="/terms" className="doc-nav-btn">
                <span>Terms of Service</span>
              </a>
              <a href="/privacy" className="doc-nav-btn active">
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

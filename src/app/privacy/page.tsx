import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — DashLint",
  description: "Privacy Policy for the DashLint MCP server. Your data stays on your machine.",
};

export default function PrivacyPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px", fontFamily: "Inter, system-ui, sans-serif", color: "#e5e7eb", lineHeight: 1.7 }}>
      <a href="/" style={{ color: "#9ca3af", textDecoration: "none", fontSize: 14 }}>← Back to DashLint</a>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 24, marginBottom: 8, color: "#f9fafb" }}>Privacy Policy</h1>
      <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 32 }}>Last updated: November 2026</p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#f9fafb" }}>Summary</h2>
        <p><strong>Your data never leaves your machine.</strong> DashLint is designed from the ground up to be privacy-first. The MCP server is an instruction layer — it tells AI assistants <em>how</em> to build dashboards, but never sees <em>what</em> data you have.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#f9fafb" }}>What We Do NOT Collect</h2>
        <ul style={{ paddingLeft: 24, marginTop: 8 }}>
          <li>Dataset rows, records, or sample values</li>
          <li>File contents (CSV, Excel, JSON, or any other format)</li>
          <li>Personally identifiable information (PII)</li>
          <li>Business-sensitive metrics or financial data</li>
          <li>User accounts, passwords, or authentication tokens</li>
          <li>IP addresses for tracking purposes</li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#f9fafb" }}>What We Do Collect</h2>
        <p>The following minimal, non-identifying data is collected for service improvement:</p>
        <ul style={{ paddingLeft: 24, marginTop: 8 }}>
          <li><strong>Tool call counts:</strong> Anonymous aggregate counters tracking how many times each MCP tool is called per day (e.g., &quot;build_dashboard_blueprint was called 42 times on 2026-11-08&quot;). No request content or metadata is stored.</li>
          <li><strong>Column metadata (opt-in):</strong> When you call <code style={{ background: "#1f2937", padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>build_dashboard_blueprint</code>, you send only field names, inferred types, distinct counts, and nullable percentages. This metadata is processed in-memory to generate the blueprint response and is <strong>never stored</strong>.</li>
          <li><strong>Vercel Analytics:</strong> Basic, anonymous page-view analytics on the website (dashlint.tanmaysk.in) provided by Vercel. No cookies are used.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#f9fafb" }}>How Generated Dashboards Handle Data</h2>
        <p>Dashboards generated with DashLint are standalone HTML files that:</p>
        <ul style={{ paddingLeft: 24, marginTop: 8 }}>
          <li>Parse uploaded CSV and Excel files <strong>entirely in the browser</strong> using client-side JavaScript</li>
          <li>Never transmit file contents to any server (including DashLint)</li>
          <li>Can be used fully offline after initial download</li>
          <li>Store no data in cookies, localStorage, or external databases</li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#f9fafb" }}>Third-Party Services</h2>
        <ul style={{ paddingLeft: 24, marginTop: 8 }}>
          <li><strong>Vercel:</strong> Hosting and edge delivery. Subject to <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa" }}>Vercel&apos;s Privacy Policy</a>.</li>
          <li><strong>Upstash Redis:</strong> Stores anonymous tool call counters only. No user data.</li>
          <li><strong>SheetJS CDN:</strong> Generated dashboards may load the SheetJS library from <code style={{ background: "#1f2937", padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>cdn.sheetjs.com</code> for Excel parsing. This is a client-side library; no data is sent to SheetJS.</li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#f9fafb" }}>Data Retention</h2>
        <p>Tool call counters are stored indefinitely as aggregate daily counts. No other data is retained. Column metadata sent to <code style={{ background: "#1f2937", padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>build_dashboard_blueprint</code> exists only in memory during request processing and is discarded immediately after the response is sent.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#f9fafb" }}>Your Rights</h2>
        <p>Since DashLint does not collect personal data, there is nothing to access, correct, or delete. If you have concerns, please contact us via <a href="https://linkedin.com/in/tanmay-kalbande" target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa" }}>LinkedIn</a>.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#f9fafb" }}>Changes</h2>
        <p>We may update this policy as the service evolves. Material changes will be noted in the changelog.</p>
      </section>
    </main>
  );
}

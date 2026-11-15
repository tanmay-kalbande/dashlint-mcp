import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy \u2014 DashLint",
  description: "Privacy Policy for the DashLint MCP server. Your data stays on your machine.",
};

export default function PrivacyPage() {
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
        .legal-page {
          max-width: 720px;
          margin: 0 auto;
          padding: 48px 24px;
          font-family: var(--sans);
          color: var(--ink);
          line-height: 1.7;
        }
        .legal-back {
          color: var(--mu);
          text-decoration: none;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: color 0.2s;
        }
        .legal-back:hover { color: var(--ink); }
        .legal-h1 {
          font-size: 28px;
          font-weight: 700;
          margin-top: 24px;
          margin-bottom: 8px;
          color: var(--ink);
          font-family: var(--sans);
        }
        .legal-date {
          color: var(--mu);
          font-size: 14px;
          margin-bottom: 32px;
        }
        .legal-section { margin-bottom: 28px; }
        .legal-h2 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--ink);
          font-family: var(--sans);
        }
        .legal-page code {
          background: var(--s2);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 13px;
          font-family: var(--mono);
        }
        .legal-page ul { padding-left: 24px; margin-top: 8px; }
        .legal-page a { color: var(--ac); transition: color 0.2s; }
        .legal-page a:hover { color: var(--ink); }
        @media (max-width: 640px) {
          .legal-page { padding: 24px 16px; }
          .legal-h1 { font-size: 22px; }
        }
      `}</style>
      <main className="legal-page subpage">
        <a href="/" className="legal-back">{"\u2190"} Back to DashLint</a>
        <h1 className="legal-h1">Privacy Policy</h1>
        <p className="legal-date">Last updated: November 2026</p>

        <section className="legal-section">
          <h2 className="legal-h2">Summary</h2>
          <p><strong>Your data never leaves your machine.</strong> DashLint is designed from the ground up to be privacy-first. The MCP server is an instruction layer {"\u2014"} it tells AI assistants <em>how</em> to build dashboards, but never sees <em>what</em> data you have.</p>
        </section>

        <section className="legal-section">
          <h2 className="legal-h2">What We Do NOT Collect</h2>
          <ul>
            <li>Dataset rows, records, or sample values</li>
            <li>File contents (CSV, Excel, JSON, or any other format)</li>
            <li>Personally identifiable information (PII)</li>
            <li>Business-sensitive metrics or financial data</li>
            <li>User accounts, passwords, or authentication tokens</li>
            <li>IP addresses for tracking purposes</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2 className="legal-h2">What We Do Collect</h2>
          <p>The following minimal, non-identifying data is collected for service improvement:</p>
          <ul>
            <li><strong>Tool call counts:</strong> Anonymous aggregate counters tracking how many times each MCP tool is called per day (e.g., &quot;build_dashboard_blueprint was called 42 times on 2026-11-08&quot;). No request content or metadata is stored.</li>
            <li><strong>Column metadata (opt-in):</strong> When you call <code>build_dashboard_blueprint</code>, you send only field names, inferred types, distinct counts, and nullable percentages. This metadata is processed in-memory to generate the blueprint response and is <strong>never stored</strong>.</li>
            <li><strong>Vercel Analytics:</strong> Basic, anonymous page-view analytics on the website (dashlint.tanmaysk.in) provided by Vercel. No cookies are used.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2 className="legal-h2">How Generated Dashboards Handle Data</h2>
          <p>Dashboards generated with DashLint are standalone HTML files that:</p>
          <ul>
            <li>Parse uploaded CSV and Excel files <strong>entirely in the browser</strong> using client-side JavaScript</li>
            <li>Never transmit file contents to any server (including DashLint)</li>
            <li>Can be used fully offline after initial download</li>
            <li>Store no data in cookies, localStorage, or external databases</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2 className="legal-h2">Third-Party Services</h2>
          <ul>
            <li><strong>Vercel:</strong> Hosting and edge delivery. Subject to <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">Vercel&apos;s Privacy Policy</a>.</li>
            <li><strong>Upstash Redis:</strong> Stores anonymous tool call counters only. No user data.</li>
            <li><strong>SheetJS CDN:</strong> Generated dashboards may load the SheetJS library from <code>cdn.sheetjs.com</code> for Excel parsing. This is a client-side library; no data is sent to SheetJS.</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2 className="legal-h2">Data Retention</h2>
          <p>Tool call counters are stored indefinitely as aggregate daily counts. No other data is retained. Column metadata sent to <code>build_dashboard_blueprint</code> exists only in memory during request processing and is discarded immediately after the response is sent.</p>
        </section>

        <section className="legal-section">
          <h2 className="legal-h2">Your Rights</h2>
          <p>Since DashLint does not collect personal data, there is nothing to access, correct, or delete. If you have concerns, please contact us via <a href="https://linkedin.com/in/tanmay-kalbande" target="_blank" rel="noopener noreferrer">LinkedIn</a>.</p>
        </section>

        <section className="legal-section">
          <h2 className="legal-h2">Changes</h2>
          <p>We may update this policy as the service evolves. Material changes will be noted in the changelog.</p>
        </section>
      </main>
    </>
  );
}

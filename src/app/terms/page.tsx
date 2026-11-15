import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service \u2014 DashLint",
  description: "Terms of Service for the DashLint MCP server.",
};

export default function TermsPage() {
  return (
    <>
      <style>{`
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
        <h1 className="legal-h1">Terms of Service</h1>
        <p className="legal-date">Last updated: November 2026</p>

        <section className="legal-section">
          <h2 className="legal-h2">1. Service Description</h2>
          <p>DashLint is a free, open-source MCP (Model Context Protocol) server that provides dashboard creation orchestration for AI coding assistants. It supplies workflow instructions, design patterns, and schema-aware blueprints {"\u2014"} it does not receive, store, or process your data.</p>
        </section>

        <section className="legal-section">
          <h2 className="legal-h2">2. No Data Collection</h2>
          <p>DashLint operates on a strict privacy-first model. The MCP server accepts only aggregate column metadata (field names, types, cardinality) through the <code>build_dashboard_blueprint</code> tool. No dataset rows, sample values, personally identifiable information, or file contents are ever sent to or stored by DashLint.</p>
        </section>

        <section className="legal-section">
          <h2 className="legal-h2">3. Acceptable Use</h2>
          <p>You may use DashLint for any lawful purpose. You agree not to:</p>
          <ul>
            <li>Attempt to overload, disrupt, or abuse the hosted MCP endpoint</li>
            <li>Reverse-engineer the server to extract proprietary logic beyond what is openly available in the source code</li>
            <li>Misrepresent DashLint-generated outputs as your own proprietary software without attribution</li>
          </ul>
        </section>

        <section className="legal-section">
          <h2 className="legal-h2">4. Generated Dashboards</h2>
          <p>Dashboards created using DashLint are yours. The generated HTML files run entirely in your browser with no server dependency. You may use, modify, and distribute them freely. The default sidebar credit (&quot;built by Tanmay Kalbande&quot;) is a courtesy attribution and can be removed or replaced via the <code>credit</code> configuration.</p>
        </section>

        <section className="legal-section">
          <h2 className="legal-h2">5. Availability &amp; Warranties</h2>
          <p>DashLint is provided &quot;as is&quot; without warranty of any kind, express or implied. The service may experience downtime for maintenance or updates. We do not guarantee uninterrupted availability.</p>
        </section>

        <section className="legal-section">
          <h2 className="legal-h2">6. Open Source License</h2>
          <p>DashLint is released under the <strong>MIT License</strong>. You are free to fork, modify, and self-host the server. See the project repository for the full license text.</p>
        </section>

        <section className="legal-section">
          <h2 className="legal-h2">7. Changes to These Terms</h2>
          <p>We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
        </section>

        <section className="legal-section">
          <h2 className="legal-h2">8. Contact</h2>
          <p>For questions about these terms, reach out via <a href="https://linkedin.com/in/tanmay-kalbande" target="_blank" rel="noopener noreferrer">LinkedIn</a>.</p>
        </section>
      </main>
    </>
  );
}

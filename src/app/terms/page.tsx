import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — DashLint",
  description: "Terms of Service for the DashLint MCP server.",
};

export default function TermsPage() {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "48px 24px", fontFamily: "Inter, system-ui, sans-serif", color: "#e5e7eb", lineHeight: 1.7 }}>
      <a href="/" style={{ color: "#9ca3af", textDecoration: "none", fontSize: 14 }}>← Back to DashLint</a>
      <h1 style={{ fontSize: 28, fontWeight: 700, marginTop: 24, marginBottom: 8, color: "#f9fafb" }}>Terms of Service</h1>
      <p style={{ color: "#9ca3af", fontSize: 14, marginBottom: 32 }}>Last updated: November 2026</p>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#f9fafb" }}>1. Service Description</h2>
        <p>DashLint is a free, open-source MCP (Model Context Protocol) server that provides dashboard creation orchestration for AI coding assistants. It supplies workflow instructions, design patterns, and schema-aware blueprints — it does not receive, store, or process your data.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#f9fafb" }}>2. No Data Collection</h2>
        <p>DashLint operates on a strict privacy-first model. The MCP server accepts only aggregate column metadata (field names, types, cardinality) through the <code style={{ background: "#1f2937", padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>build_dashboard_blueprint</code> tool. No dataset rows, sample values, personally identifiable information, or file contents are ever sent to or stored by DashLint.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#f9fafb" }}>3. Acceptable Use</h2>
        <p>You may use DashLint for any lawful purpose. You agree not to:</p>
        <ul style={{ paddingLeft: 24, marginTop: 8 }}>
          <li>Attempt to overload, disrupt, or abuse the hosted MCP endpoint</li>
          <li>Reverse-engineer the server to extract proprietary logic beyond what is openly available in the source code</li>
          <li>Misrepresent DashLint-generated outputs as your own proprietary software without attribution</li>
        </ul>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#f9fafb" }}>4. Generated Dashboards</h2>
        <p>Dashboards created using DashLint are yours. The generated HTML files run entirely in your browser with no server dependency. You may use, modify, and distribute them freely. The default sidebar credit (&quot;built by Tanmay Kalbande&quot;) is a courtesy attribution and can be removed or replaced via the <code style={{ background: "#1f2937", padding: "2px 6px", borderRadius: 4, fontSize: 13 }}>credit</code> configuration.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#f9fafb" }}>5. Availability &amp; Warranties</h2>
        <p>DashLint is provided &quot;as is&quot; without warranty of any kind, express or implied. The service may experience downtime for maintenance or updates. We do not guarantee uninterrupted availability.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#f9fafb" }}>6. Open Source License</h2>
        <p>DashLint is released under the <strong>MIT License</strong>. You are free to fork, modify, and self-host the server. See the project repository for the full license text.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#f9fafb" }}>7. Changes to These Terms</h2>
        <p>We may update these terms from time to time. Continued use of the service after changes constitutes acceptance of the new terms.</p>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "#f9fafb" }}>8. Contact</h2>
        <p>For questions about these terms, reach out via <a href="https://linkedin.com/in/tanmay-kalbande" target="_blank" rel="noopener noreferrer" style={{ color: "#60a5fa" }}>LinkedIn</a>.</p>
      </section>
    </main>
  );
}

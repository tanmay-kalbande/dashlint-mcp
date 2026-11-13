/**
 * DashLint SDK — lightweight TypeScript client for the DashLint MCP server.
 *
 * Provides a typed interface to call DashLint tools programmatically
 * without requiring an MCP client. Uses the standard MCP HTTP transport.
 *
 * @example
 * ```typescript
 * import { DashLint } from 'dashlint-sdk';
 *
 * const dl = new DashLint();
 * const workflow = await dl.getWorkflow();
 * const blueprint = await dl.buildBlueprint({
 *   fields: [
 *     { name: 'order_id', type: 'identifier' },
 *     { name: 'revenue', type: 'currency' },
 *   ],
 *   businessQuestion: 'How is revenue trending?',
 * });
 * ```
 */

// ── Types ───────────────────────────────────────────────────────────────────

export type FieldType =
  | "date" | "datetime" | "number" | "currency" | "percentage"
  | "boolean" | "category" | "identifier" | "text" | "unknown";

export interface FieldInput {
  name: string;
  type: FieldType;
  distinctCount?: number;
  nullablePercent?: number;
  numericSummary?: { min?: number; max?: number; mean?: number };
  dateRange?: { min?: string; max?: string };
}

export interface BlueprintInput {
  datasetLabel?: string;
  businessQuestion?: string;
  audience?: string;
  rowCount?: number;
  fields: FieldInput[];
}

export interface DashboardKitInput {
  components?: string[];
  domain?: "generic" | "service-ops" | "sales-distribution";
  brand?: { title?: string; subtitle?: string; kicker?: string };
  credit?: "default" | "none" | { text: string; url?: string };
  mode?: "cli" | "inline";
}

export interface VersionInfo {
  serverVersion: string;
  dashboardKitVersion: string;
  minKitVersion: string;
  protocolVersion: string;
  features: string[];
  manifest: string;
}

export interface McpToolResult {
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}

export interface DashLintOptions {
  /** MCP server URL. Defaults to the hosted endpoint. */
  url?: string;
  /** Request timeout in milliseconds. Defaults to 30000. */
  timeout?: number;
}

// ── MCP JSON-RPC helpers ────────────────────────────────────────────────────

interface JsonRpcRequest {
  jsonrpc: "2.0";
  id: number;
  method: string;
  params?: Record<string, unknown>;
}

interface JsonRpcResponse {
  jsonrpc: "2.0";
  id: number;
  result?: unknown;
  error?: { code: number; message: string; data?: unknown };
}

let requestId = 0;

function makeRequest(method: string, params?: Record<string, unknown>): JsonRpcRequest {
  return {
    jsonrpc: "2.0",
    id: ++requestId,
    method,
    params,
  };
}

// ── Client ──────────────────────────────────────────────────────────────────

export class DashLint {
  private readonly url: string;
  private readonly timeout: number;
  private sessionId: string | null = null;

  constructor(options: DashLintOptions = {}) {
    this.url = options.url || "https://dashlint.tanmaysk.in/mcp";
    this.timeout = options.timeout || 30_000;
  }

  /**
   * Low-level: send a JSON-RPC request to the MCP server.
   */
  private async rpc(method: string, params?: Record<string, unknown>): Promise<unknown> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      if (this.sessionId) {
        headers["Mcp-Session-Id"] = this.sessionId;
      }

      const res = await fetch(this.url, {
        method: "POST",
        headers,
        body: JSON.stringify(makeRequest(method, params)),
        signal: controller.signal,
      });

      // Capture session ID from response
      const sid = res.headers.get("Mcp-Session-Id");
      if (sid) this.sessionId = sid;

      if (!res.ok) {
        throw new Error(`DashLint MCP request failed: ${res.status} ${res.statusText}`);
      }

      const json = (await res.json()) as JsonRpcResponse;
      if (json.error) {
        throw new Error(`MCP error ${json.error.code}: ${json.error.message}`);
      }

      return json.result;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * Call an MCP tool by name and return the parsed result.
   */
  private async callTool<T = unknown>(name: string, args: Record<string, unknown> = {}): Promise<T> {
    // First ensure we have initialized
    if (!this.sessionId) {
      await this.rpc("initialize", {
        protocolVersion: "2024-11-05",
        clientInfo: { name: "dashlint-sdk", version: "1.0.0" },
        capabilities: {},
      });
    }

    const result = (await this.rpc("tools/call", { name, arguments: args })) as McpToolResult;
    if (result.isError) {
      const text = result.content?.[0]?.text || "Unknown error";
      throw new Error(`Tool ${name} failed: ${text}`);
    }

    const text = result.content?.[0]?.text;
    if (!text) throw new Error(`Tool ${name} returned empty response`);

    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  }

  // ── High-level API ──────────────────────────────────────────────────────

  /** Get the complete dashboard creation workflow and tool map. */
  async getWorkflow(): Promise<unknown> {
    return this.callTool("get_dashboard_creation_workflow");
  }

  /** Build a schema-aware implementation blueprint from column metadata. */
  async buildBlueprint(input: BlueprintInput): Promise<unknown> {
    return this.callTool("build_dashboard_blueprint", input as unknown as Record<string, unknown>);
  }

  /** Get the dashboard kit (npm instructions or inline code). */
  async getDashboardKit(input: DashboardKitInput = {}): Promise<unknown> {
    return this.callTool("get_dashboard_kit", input as unknown as Record<string, unknown>);
  }

  /** Get server and kit version info. */
  async getVersion(): Promise<VersionInfo> {
    return this.callTool<VersionInfo>("get_version");
  }

  /** Get the data insight playbook. */
  async getDataInsightPlaybook(): Promise<unknown> {
    return this.callTool("get_data_insight_playbook");
  }

  /** Get the dashboard composition playbook. */
  async getCompositionPlaybook(): Promise<unknown> {
    return this.callTool("get_dashboard_composition_playbook");
  }

  /** Get the dashboard interaction playbook. */
  async getInteractionPlaybook(): Promise<unknown> {
    return this.callTool("get_dashboard_interaction_playbook");
  }

  /** Get the final dashboard completion checklist. */
  async getCompletionChecklist(): Promise<unknown> {
    return this.callTool("get_dashboard_completion_checklist");
  }
}

export default DashLint;

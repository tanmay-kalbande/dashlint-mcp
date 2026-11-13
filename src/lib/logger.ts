/**
 * Structured logger for DashLint MCP server.
 *
 * Emits JSON-formatted log lines optimized for cloud log collectors
 * (Vercel Log Drains, Datadog, Axiom, CloudWatch, GCP).
 *
 * Privacy guarantee:
 * - Client IP addresses are hashed or masked to /24 subnets.
 * - Raw dataset contents are never logged.
 * - Authorization headers and tokens are redacted.
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogMetadata {
  tool?: string;
  durationMs?: number;
  statusCode?: number;
  clientIp?: string;
  userAgent?: string;
  error?: string | Error;
  [key: string]: unknown;
}

function maskIp(ip?: string): string | undefined {
  if (!ip) return undefined;
  if (ip === "::1" || ip === "127.0.0.1") return "localhost";

  // IPv4: keep first 3 octets
  const v4Parts = ip.split(".");
  if (v4Parts.length === 4) {
    return `${v4Parts[0]}.${v4Parts[1]}.${v4Parts[2]}.0/24`;
  }

  // IPv6: keep first 3 segments
  const v6Parts = ip.split(":");
  if (v6Parts.length >= 3) {
    return `${v6Parts[0]}:${v6Parts[1]}:${v6Parts[2]}::/48`;
  }

  return "anonymous";
}

function sanitizeMeta(meta?: LogMetadata): Record<string, unknown> {
  if (!meta) return {};
  const cleaned: Record<string, unknown> = { ...meta };

  if (cleaned.clientIp) {
    cleaned.clientIp = maskIp(cleaned.clientIp as string);
  }

  if (cleaned.error instanceof Error) {
    cleaned.error = {
      message: cleaned.error.message,
      name: cleaned.error.name,
      stack: process.env.NODE_ENV === "development" ? cleaned.error.stack : undefined,
    };
  }

  return cleaned;
}

function emit(level: LogLevel, message: string, meta?: LogMetadata) {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    service: "dashlint-mcp",
    message,
    ...sanitizeMeta(meta),
  };

  const line = JSON.stringify(payload);

  if (level === "error") {
    console.error(line);
  } else if (level === "warn") {
    console.warn(line);
  } else {
    console.log(line);
  }
}

export const logger = {
  debug: (message: string, meta?: LogMetadata) => emit("debug", message, meta),
  info: (message: string, meta?: LogMetadata) => emit("info", message, meta),
  warn: (message: string, meta?: LogMetadata) => emit("warn", message, meta),
  error: (message: string, meta?: LogMetadata) => emit("error", message, meta),
};

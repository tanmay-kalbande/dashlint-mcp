/**
 * Input sanitization and safety utilities.
 *
 * Protects against:
 * 1. Prototype pollution attacks (__proto__, constructor, prototype)
 * 2. HTML/XSS injection attempts in strings (e.g. injected into blueprint output)
 * 3. Control character abuse and abnormal payload flooding
 */

/**
 * Sanitize a user-provided string:
 * - Strips <script>...</script> blocks and <style>...</style> blocks completely
 * - Strips all remaining HTML tags (<tag>, <iframe>, etc.)
 * - Strips unprintable control characters (except common whitespace)
 * - Truncates to max length
 */
export function sanitizeString(val: string, maxLength: number = 500): string {
  if (typeof val !== "string") return "";

  // 1. Strip <script> and <style> tags along with their contents
  let cleaned = val.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");

  // 2. Strip remaining HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, "");

  // 3. Strip dangerous control characters (keep \n, \r, \t)
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // 4. Trim and truncate
  return cleaned.trim().slice(0, maxLength);
}

/**
 * Check and block prototype pollution keys in object structures.
 */
export function isSafeKey(key: string): boolean {
  return key !== "__proto__" && key !== "constructor" && key !== "prototype";
}

/**
 * Recursively deep sanitize an object by stripping prototype pollution keys.
 */
export function sanitizeObject<T>(obj: T): T {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject) as unknown as T;
  }

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    if (isSafeKey(key)) {
      result[key] = typeof value === "string" ? sanitizeString(value, 1000) : sanitizeObject(value);
    }
  }

  return result as T;
}

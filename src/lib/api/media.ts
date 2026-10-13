import { API_BASE_URL } from "./client";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

/**
 * Backend `/storage/...` paths → absolute URL.
 * Absolute localhost/127.0.0.1 URLs (backend APP_URL misconfig) are rewritten
 * to the API origin so they work outside the local machine (e.g. Vercel).
 */
export function mediaUrl(path?: string | null): string {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) {
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?\//.test(path)) {
      return path.replace(/^https?:\/\/[^/]+/, API_ORIGIN);
    }
    return path;
  }
  if (path.startsWith("/storage/")) return `${API_ORIGIN}${path}`;
  return path;
}

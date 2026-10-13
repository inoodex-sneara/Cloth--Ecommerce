import { API_BASE_URL } from "./client";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

/**
 * Backend image paths → absolute URL on the API origin.
 *
 * - `/storage/...` → `{API_ORIGIN}/storage/...`
 * - Any absolute URL (backend APP_URL may be localhost or a dead host on the
 *   deployed backend) → rewritten onto the API origin, keeping the path.
 *   The API host is the one that actually serves `/storage`.
 */
export function mediaUrl(path?: string | null): string {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) {
    try {
      const url = new URL(path);
      return `${API_ORIGIN}${url.pathname}${url.search}${url.hash}`;
    } catch {
      return path;
    }
  }
  if (path.startsWith("/storage/")) return `${API_ORIGIN}${path}`;
  return path;
}

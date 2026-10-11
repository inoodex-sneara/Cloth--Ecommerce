import { API_BASE_URL } from "./client";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/v1\/?$/, "");

/** Backend `/storage/...` paths → absolute URL; local `/images`, `/hero` etc. unchanged. */
export function mediaUrl(path?: string | null): string {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  if (path.startsWith("/storage/")) return `${API_ORIGIN}${path}`;
  return path;
}

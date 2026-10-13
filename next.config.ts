import type { NextConfig } from "next";

/** Accepts either `https://host/api/v1` or `https://host/api/v1/` */
function originOfEnv(value: string | undefined): URL | null {
  if (!value) return null;
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

// Backend base the app actually calls, e.g. `https://api.example.com/api/v1`.
// Falls back to local Laravel so dev keeps working with no env set.
const apiBase =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";
const apiOrigin = originOfEnv(apiBase);

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    // Needed while the backend still advertises http://localhost:8000 URLs.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      // Backend on the same host (Vercel rewrites /api/*), any path.
      ...(apiOrigin
        ? [
            {
              protocol: apiOrigin.protocol.replace(":", "") as "http" | "https",
              hostname: apiOrigin.hostname,
              ...(apiOrigin.port ? { port: apiOrigin.port } : {}),
              pathname: "/**",
            },
          ]
        : []),
      // Absolute /storage URLs pointing straight at the local backend.
      { protocol: "http", hostname: "localhost", port: "8000", pathname: "/storage/**" },
      { protocol: "http", hostname: "127.0.0.1", port: "8000", pathname: "/storage/**" },
      // Dev servers on other ports (Next on 3001 etc) can't be predicted;
      // allow any localhost port so a stray absolute URL still renders.
      { protocol: "http", hostname: "localhost", pathname: "/**" },
      { protocol: "https", hostname: "localhost", pathname: "/**" },
    ],
  },
};

export default nextConfig;

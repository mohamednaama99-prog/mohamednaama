import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
/* Vercel preview deployments load the comments toolbar from vercel.live. */
const isPreview = process.env.VERCEL_ENV === "preview";
const vercelLive = isPreview ? " https://vercel.live" : "";

/**
 * Content Security Policy.
 *
 * Everything the site loads is its own: fonts are self-hosted by next/font,
 * images are local and served through /_next/image, and the only network call
 * the browser makes is the server action back to this origin.
 *
 * script-src keeps 'unsafe-inline' because Next.js streams its page data as
 * inline scripts, and the layout has a one-line boot script. Replacing it with
 * per-request nonces would force every page to render dynamically, giving up
 * the static, cached pages. 'unsafe-eval' and the websocket are for the dev
 * server's hot reload only.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}${vercelLive}`,
  `style-src 'self' 'unsafe-inline'${vercelLive}`,
  `img-src 'self' data: blob:${vercelLive}`,
  `font-src 'self'${vercelLive}`,
  `connect-src 'self'${isDev ? " ws: wss:" : ""}${vercelLive}`,
  `frame-src ${isPreview ? "https://vercel.live" : "'none'"}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "manifest-src 'self'",
  "worker-src 'self' blob:",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  /* Two years. Add "; preload" only after deciding to submit the domain to
     hstspreload.org, which is hard to undo. */
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  /* For browsers that predate frame-ancestors. */
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

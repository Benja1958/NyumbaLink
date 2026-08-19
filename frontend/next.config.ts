import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const backendUrl =
  process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000"
    : "https://nyumbalink-api.onrender.com";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend-api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

export default withSentryConfig(
  nextConfig,
  {
    org: "nyumbalink",
    project: "javascript-nextjs",

    silent: !process.env.CI,

    widenClientFileUpload: true,

    tunnelRoute: "/monitoring",

    webpack: {
      automaticVercelMonitors: true,

      treeshake: {
        removeDebugLogging: true,
      },
    },
  }
);
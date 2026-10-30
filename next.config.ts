import type { NextConfig } from "next";

// Hostinger is a static upload. `npm run export` sets STATIC_EXPORT so Next
// writes the public_html folder. The ChatGPT Sites / vinext build does not
// set this variable, and then this config stays empty, as before.
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = {
  ...(isStaticExport
    ? {
        output: "export" as const,
        trailingSlash: true,
        images: {
          unoptimized: true,
        },
        // db/ and worker/ import Cloudflare runtime types that exist only in
        // the ChatGPT Sites build. The static site does not use them.
        typescript: {
          ignoreBuildErrors: true,
        },
      }
    : {}),
};

export default nextConfig;

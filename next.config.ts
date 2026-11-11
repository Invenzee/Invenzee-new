import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      // The Tailwind loader must not rewrite CSS modules as plain CSS.
      // `as: "*.css"` drops the module export map, so `styles.x` is undefined
      // and every section class fails to attach.
      "*.css": [
        {
          condition: { path: /\.module\.css$/ },
          loaders: ["@tailwindcss/turbopack"],
          as: "*.module.css",
        },
        {
          condition: { not: { path: /\.module\.css$/ } },
          loaders: ["@tailwindcss/turbopack"],
          as: "*.css",
        },
      ],
    },
  },
};

export default nextConfig;

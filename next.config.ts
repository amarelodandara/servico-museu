import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

// Turbopack can't accept plugin functions directly (JS functions can't cross
// into Rust) — plugin names must be passed as strings instead.
const withMDX = createMDX({
  options: {
    rehypePlugins: ["rehype-slug"],
  },
});
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(withMDX(nextConfig));

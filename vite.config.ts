import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), cloudflare(), sentryVitePlugin({
    org: "kolenka-inc",
    project: "inventory",
    authToken: process.env.SENTRY_AUTH_TOKEN,
  })],

  build: {
    sourcemap: true
  }
});

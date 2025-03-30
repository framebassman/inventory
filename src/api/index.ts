import { Hono } from "hono";
import { withSentry } from "@sentry/cloudflare";
import { log } from "./logger";

// const app = new Hono<{ Bindings: Env }>();
const app = new Hono();

app.get("/api/", (c) => {
  log.info("Hello world");
  return c.json({ name: "Cloudflare" })
});

// app.get("*", (c) => {
//   return c.env.ASSETS.fetch(c.req.raw);
// });

// export default Sentry.withSentry(
//   (env) => ({
//     dsn: "https://9b631feb01da428b471ac1cbd160173f@o164625.ingest.us.sentry.io/4509063427653632",
//     // Set tracesSampleRate to 1.0 to capture 100% of spans for tracing.
//     // Learn more at
//     // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
//     tracesSampleRate: 1.0,
//   }),
//   app satisfies ExportedHandler<Env>,
// );

export default withSentry(
  () => ({
    dsn: `https://9b631feb01da428b471ac1cbd160173f@o164625.ingest.us.sentry.io/4509063427653632`,
    // Set tracesSampleRate to 1.0 to capture 100% of spans for tracing.
    // Learn more at
    // https://docs.sentry.io/platforms/javascript/configuration/options/#traces-sample-rate
    tracesSampleRate: 1.0,
  }),
  app
);


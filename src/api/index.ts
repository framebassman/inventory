import { Hono } from "hono";
import { withSentry } from "@sentry/cloudflare";
import { log } from "./logger";
import axios from "axios";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/", async (c) => {
  log.info("Hello world from Cloudflare and ElasticSearch");
  console.log("Hello world from Cloudflare");
  // const fetchAxios = axios.create({
  //   adapter: 'fetch'
  // });
  
  // const { data } = await fetchAxios.get("https://NX4jPVtxmC:QNw5bzyHoXC9YFkr@kolenka-inc-4135333449.apps.bonsaisearch.net/_cluster/health?pretty");
  // const { data } = await fetchAxios.get("https://fmtucerc0m:g1zbfbj8ly@kolenka-inc-4135333449.eu-central-1.bonsaisearch.net/_aliases?pretty=true");
  // console.log("Successfully get health for elasticsearch");
  return c.json("ok");
});

app.get("*", (c: any) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default withSentry(
  //@ts-expect-error it should be here
  (env: any) => {
    return ({
      dsn: "https://9b631feb01da428b471ac1cbd160173f@o164625.ingest.us.sentry.io/4509063427653632",
    });
  },
  app
);

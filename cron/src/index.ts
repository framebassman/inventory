import 'reflect-metadata';
import { sentry } from '@hono/sentry';
import { Context, type Env, Hono } from 'hono';
import { logger as loggerMiddleware } from 'hono/logger';

const app = new Hono<{ Bindings: Env }>();
app.use(
  sentry(),
  loggerMiddleware(),
);

app.get('/healthcheck', async (c: Context) => {
  console.log('Hello world from Cloudflare and ElasticSearch');
  return c.json('ok');
});

app.get('*', (c: Context) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default {
  fetch: app.fetch,
  // eslint-disable-next-line no-restricted-syntax
  scheduled: async (controller: ScheduledController, env: Env, ctx: ExecutionContext,) => {
    console.log(`it works: ${env}`);
  },
}

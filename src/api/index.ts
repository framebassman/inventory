import { type Context, type Env, Hono } from 'hono';
import { withSentry } from '@sentry/cloudflare';
import { log } from './logger';
import { logger as loggerMiddleware } from 'hono/logger';
import d1 from './routers/d1';
import pg from './routers/pg';
import 'reflect-metadata';

const app = new Hono<{ Bindings: Env }>();
app.use(loggerMiddleware());

app.get('/api/', async (c: Context) => {
  log.info('Hello world from Cloudflare and ElasticSearch');
  return c.json('ok');
});

app.route('/d1', d1);
app.route('/pg', pg);

app.get('/json', async () => {
  return fetch(
    'https://microsoftedge.github.io/Demos/json-dummy-data/64KB.json'
  );
});

app.get('*', (c: Context) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default withSentry(
  //@ts-expect-error it should be here
  (env: Env) => {
    return {
      dsn: 'https://9b631feb01da428b471ac1cbd160173f@o164625.ingest.us.sentry.io/4509063427653632'
    };
  },
  app
);

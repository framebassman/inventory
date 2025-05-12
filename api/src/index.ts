import { withSentry } from '@sentry/cloudflare';
import { default as crossFetch } from 'cross-fetch';
import { type Context, type Env, Hono } from 'hono';
import { logger as loggerMiddleware } from 'hono/logger';
import 'reflect-metadata';

import { applicationContextMiddleware } from './application-context-middleware';
import { elasticsearchLogsMiddleware } from './elasticsearch-logs-middleware';
import d1 from './routers/d1';
import pg from './routers/pg';

const app = new Hono<{ Bindings: Env }>();
app.use(
  loggerMiddleware(),
  applicationContextMiddleware(),
  elasticsearchLogsMiddleware()
);

app.get('/api/', async (c: Context) => {
  console.log('Hello world from Cloudflare and ElasticSearch');
  return c.json('ok');
});

app.route('/d1', d1);
app.route('/pg', pg);

app.get('/secret', async (context: Context) => {
  return Response.json(context.env.ELASTICSEARCH_LOGIN);
});

// Middleware to handle error logging
app.get('/log', async () => {
  throw Error('Expected error');
});

app.get('/fetch', async () => {
  return fetch(
    'https://microsoftedge.github.io/Demos/json-dummy-data/64KB.json'
  );
});

app.get('/cross', async () => {
  return crossFetch(
    'https://microsoftedge.github.io/Demos/json-dummy-data/64KB.json'
  );
});

// app.get('*', (c: Context) => {
//   return c.env.ASSETS.fetch(c.req.raw);
// });

export default withSentry(
  //@ts-expect-error it should be here
  (env: Env) => {
    return {
      dsn: 'https://9b631feb01da428b471ac1cbd160173f@o164625.ingest.us.sentry.io/4509063427653632'
    };
  },
  app
);

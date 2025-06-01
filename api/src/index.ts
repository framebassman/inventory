import 'reflect-metadata';
import { withSentry } from '@sentry/cloudflare';
import { sentry } from '@hono/sentry';
import { default as crossFetch } from 'cross-fetch';
import { type Context, type Env, Hono } from 'hono';
import { logger as loggerMiddleware } from 'hono/logger';
import { applicationContextMiddleware } from './application-context-middleware';
import { elasticsearchLogsMiddleware } from './elasticsearch-logs-middleware';
import warehouse from './controllers/warehouse';
import movement from './controllers/movement';
import { swaggerUI } from '@hono/swagger-ui';
import { cors } from 'hono/cors';

const app = new Hono<{ Bindings: Env }>();
app.use(
  sentry(),
  loggerMiddleware(),
  applicationContextMiddleware(),
  elasticsearchLogsMiddleware()
);
app.use(
  '/*',
  cors({
    origin: [
      'http://localhost:5173',
      'https://inventory.romashov.tech',
      'https://m.inventory.romashov.tech'
    ]
  })
);

app.get('/healthcheck', async (c: Context) => {
  console.log('Hello world from Cloudflare and ElasticSearch');
  return c.json('ok');
});

app.route('/warehouse', warehouse);
app.route('/movement', movement);

// Middleware to handle error logging
app.get('/error', async () => {
  throw Error('Expected error');
});

app.get('/', swaggerUI({ url: '/swagger.yml' }));

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

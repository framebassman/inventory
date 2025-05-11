import 'reflect-metadata';
import { type Context, type Env, Hono } from 'hono';
import { withSentry } from '@sentry/cloudflare';
import { logger as loggerMiddleware } from 'hono/logger';
import d1 from './routers/d1';
import pg from './routers/pg';
import { applicationContextMiddleware } from './application-context-middleware';
import { default as crossFetch } from 'cross-fetch';

const app = new Hono<{ Bindings: Env }>();
app.use(loggerMiddleware(), applicationContextMiddleware());

app.get('/api/', async (c: Context) => {
  console.log('Hello world from Cloudflare and ElasticSearch');
  return c.json('ok');
});

app.route('/d1', d1);
app.route('/pg', pg);

app.get('/log', async (context: Context) => {
  const data = {
    message: 'Hello from CloudflareElasticsearchTransport',
    level: 'info',
    '@timestamp': new Date().toISOString()
  };
  return await fetch(
    'https://kolenka-inc-4135333449.eu-central-1.bonsaisearch.net:443/filebeat-7.10.2-2025.05.11/_doc/',
    {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${btoa(context.env.ELASTICSEARCH_LOGIN + ':' + context.env.ELASTICSEARCH_PASSWORD)}`
      },
      body: JSON.stringify(data)
    }
  );
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

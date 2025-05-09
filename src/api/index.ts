import { Hono } from 'hono';
import { withSentry } from '@sentry/cloudflare';
import { log } from './logger';

const app = new Hono<{ Bindings: Env }>();

app.get('/api/', async (c) => {
  log.info('Hello world from Cloudflare and ElasticSearch');
  return c.json('ok');
});

app.get('*', (c: any) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default withSentry(
  //@ts-expect-error it should be here
  (env: any) => {
    return {
      dsn: 'https://9b631feb01da428b471ac1cbd160173f@o164625.ingest.us.sentry.io/4509063427653632'
    };
  },
  app
);

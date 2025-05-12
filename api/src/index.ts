import { withSentry } from '@sentry/cloudflare';
import { default as crossFetch } from 'cross-fetch';
import { type Context, type Env, Hono } from 'hono';
import { logger as loggerMiddleware } from 'hono/logger';
import 'reflect-metadata';
import { applicationContextMiddleware } from './application-context-middleware';
import d1 from './routers/d1';
import pg from './routers/pg';

const app = new Hono<{ Bindings: Env }>();
app.use(loggerMiddleware(), applicationContextMiddleware());

app.get('/api/', async (c: Context) => {
  console.log('Hello world from Cloudflare and ElasticSearch');
  return c.json('ok');
});

app.route('/d1', d1);
app.route('/pg', pg);

app.get('/secret', async (context: Context) => {
  return Response.json(context.env.ELASTICSEARCH_LOGIN);
});

// Function to post logs to an external service
async function postLog(message: string, login: string, password: string) {
  const data = {
    message: message,
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
        Authorization: `Basic ${btoa(login + ':' + password)}`
      },
      body: JSON.stringify(data)
    }
  );
}

// app.get('/log', async (context: Context) => {
//   const data = {
//     message: 'Hello from CloudflareElasticsearchTransport',
//     level: 'info',
//     '@timestamp': new Date().toISOString()
//   };
//   return await fetch(
//     'https://kolenka-inc-4135333449.eu-central-1.bonsaisearch.net:443/filebeat-7.10.2-2025.05.11/_doc/',
//     {
//       method: 'POST', // *GET, POST, PUT, DELETE, etc.
//       headers: {
//         'Content-Type': 'application/json',
//         // 'Content-Type': 'application/x-www-form-urlencoded',
//         Authorization: `Basic ${btoa(context.env.ELASTICSEARCH_LOGIN + ':' + context.env.ELASTICSEARCH_PASSWORD)}`
//       },
//       body: JSON.stringify(data)
//     }
//   );
// });

// Middleware to handle error logging
app.use('/log', async (context: Context, next) => {
  try {
    // Process the request with the next handler
    await next();

    // After processing, check if the response indicates an error
    const body = await context.res.clone().text();
    throw new Error(
      'Bad response at origin. Status: ' +
        context.res.status +
        ' Body: ' +
        // Ensure the string is small enough to be a header
        body.trim().substring(0, 10)
    );
  } catch (error) {
    const err = error as Error;
    // Without waitUntil, the fetch to the logging service may not complete
    context.executionCtx.waitUntil(
      postLog(
        err.toString(),
        context.env.ELASTICSEARCH_LOGIN,
        context.env.ELASTICSEARCH_PASSWORD
      )
    );

    // Get the error stack or error itself
    const stack = JSON.stringify(err.stack) || err.toString();

    // Create a new response with the error information
    const response = context.res
      ? new Response(stack, {
          status: context.res.status,
          headers: context.res.headers
        })
      : new Response(stack, { status: 500 });

    // Add debug headers
    response.headers.set('X-Debug-stack', stack);
    response.headers.set('X-Debug-err', err.toString());

    // Set the modified response
    context.res = response;
  }
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

import { env } from 'cloudflare:workers';
import type { Context, MiddlewareHandler } from 'hono';
import { createMiddleware } from 'hono/factory';

export const applicationCxt = 'applicationContext';

let dateString = new Date(new Date()).toISOString().split('T')[0];
dateString = dateString.replaceAll('-', '.');

// Function to post logs to an external service
export async function postLogAsync(log: string) {
  const data = {
    message: log,
    level: 'info',
    '@timestamp': new Date().toISOString()
  };
  return await fetch(
    `https://kolenka-inc-4135333449.eu-central-1.bonsaisearch.net:443/filebeat-7.10.2-${dateString}/_doc/`,
    {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${btoa((env as any).ELASTICSEARCH_LOGIN + ':' + (env as any).ELASTICSEARCH_PASSWORD)}`
      },
      body: JSON.stringify(data)
    }
  );
}

export const elasticsearchLogsMiddleware = (): MiddlewareHandler =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createMiddleware(async (context: Context, next: any) => {
    try {
      // Process the request with the next handler
      await next();

      // After processing, check if the response indicates an error
      if (context.res && !context.res.ok && !context.res.redirected) {
        const body = await context.res.clone().text();
        throw new Error(
          `Bad response at origin. Status: ${context.res.status} Body: ${body}`
        );
      }
    } catch (error) {
      const err = error as Error;

      // Get the error stack or error itself
      let stack: string = JSON.stringify(err.stack) || err.toString();
      stack = stack.replace(/^"(.*)"$/, '$1');
      stack = stack.split('\\n').join('\n');
      // Without waitUntil, the fetch to the logging service may not complete
      context.executionCtx.waitUntil(postLogAsync(stack));

      // Create a new response with the error information
      const response = context.res
        ? new Response(stack, {
            status: context.res.status,
            headers: context.res.headers
          })
        : new Response(stack, { status: 500 });

      // Add debug headers
      response.headers.set('X-Debug-err', err.toString());

      // Set the modified response
      context.res = response;
    }
  });

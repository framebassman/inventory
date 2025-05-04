import { type Context, Hono } from 'hono';
import postgres from 'postgres';
import { log } from '../logger';

const app = new Hono();

app.get('/', async (context: Context) => {
  log.info('Going to connect to postgres');
  // Create a connection using the Postgres.js driver (or any supported driver, ORM or query builder)
  // with the Hyperdrive credentials. These credentials are only accessible from your Worker.
  const sql = postgres(context.env.HYPERDRIVE.connectionString, {
    // Workers limit the number of concurrent external connections, so be sure to limit
    // the size of the local connection pool that postgres.js may establish.
    max: 5,

    // If you are not using array types in your Postgres schema,
    // disabling this will save you an extra round-trip every time you connect.
    fetch_types: false
  });

  try {
    // Sample query
    const results = await sql`SELECT * FROM pg_tables`;

    // Clean up the client after the response is returned, before the Worker is killed
    context.executionCtx.waitUntil(sql.end());

    // Return result rows as JSON
    return Response.json(results);
  } catch (e) {
    console.error(e);
    return Response.json(
      { error: e instanceof Error ? e.message : e },
      { status: 500 }
    );
  }
});

export default app;

import { type Context, Hono } from 'hono';
import { withSentry } from '@sentry/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { log } from './logger';
import { logger as loggerMiddleware } from 'hono/logger';
import postgres from 'postgres';
import 'reflect-metadata';

const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull()
});

const app = new Hono<{ Bindings: Env }>();
app.use(loggerMiddleware());

app.get('/api/', async (c: any) => {
  log.info('Hello world from Cloudflare and ElasticSearch');
  const db = drizzle(c.env.DB);
  return c.json('ok');
});

app.get('/setup', async (context: Context) => {
  log.info('Going to setup database');
  const db = drizzle(context.env.DB);
  await db.run(sql`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);
  return new Response('Table created or already exists!');
});

app.get('/add', async (context: Context) => {
  log.info('Going to add a new user into database');
  const db = drizzle(context.env.DB);
  const newUser = await db
    .insert(users)
    .values({ name: 'Test User' })
    .returning()
    .get();

  return Response.json(newUser);
});

app.get('/users', async (context: Context) => {
  log.info('Going to get all users from database');
  const db = drizzle(context.env.DB);
  const allUsers = await db.select().from(users).all();
  return Response.json(allUsers);
});

app.get('/pg', async (context: Context) => {
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

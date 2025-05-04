import { Hono } from 'hono';
import { withSentry } from '@sentry/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import { log } from './logger';
import { logger as loggerMiddleware } from 'hono/logger';
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

app.get('/setup', async (context: any) => {
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

app.get('/add', async (context: any) => {
  log.info('Going to add a new user into database');
  const db = drizzle(context.env.DB);
  const newUser = await db
    .insert(users)
    .values({ name: 'Test User' })
    .returning()
    .get();

  return Response.json(newUser);
});

app.get('/users', async (context: any) => {
  log.info('Going to get all users from database');
  const db = drizzle(context.env.DB);
  const allUsers = await db.select().from(users).all();
  return Response.json(allUsers);
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

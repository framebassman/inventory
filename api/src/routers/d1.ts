import { type Context, type Env, Hono } from 'hono';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

const app = new Hono();

const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull()
});

app.get('/setup', async (context: Context) => {
  console.log('Going to setup database');
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
  console.log('Going to add a new user into database');
  const db = drizzle(context.env.DB);
  const newUser = await db
    .insert(users)
    .values({ name: 'Test User' })
    .returning()
    .get();

  return Response.json(newUser);
});

app.get('/users', async (context: Context) => {
  console.log('Going to get all users from database');
  const db = drizzle(context.env.DB);
  const allUsers = await db.select().from(users).all();
  return Response.json(allUsers);
});

export default app;

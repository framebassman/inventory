import { type Context, Hono } from 'hono';
import postgres from 'postgres';
import { applicationCxt } from '../application-context-middleware';
import { DependencyContainer } from 'tsyringe';
import { TenantManagementStore } from '../model/tenant-management-store';

const app = new Hono();

app.get('/', async (context: Context) => {
  console.log('Going to connect to postgres');
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
    const results = await sql`SELECT * FROM tenants`;

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

app.get('/di', async (context: Context) => {
  console.log('Going to connect to postgres');
  const appContext = context.get(applicationCxt) as DependencyContainer;
  console.log('Get appContext');
  const store = appContext.resolve(TenantManagementStore);
  console.log('Get store');
  try {
    const results = await store.getAllTenants();
    return Response.json(results);
  } catch (err) {
    console.error(err);
  } finally {
    context.executionCtx.waitUntil(store.close());
  }
});

export default app;

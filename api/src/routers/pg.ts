import { type Context, Hono } from 'hono';
import postgres from 'postgres';
import { applicationCxt } from '../application-context-middleware';
import { DependencyContainer } from 'tsyringe';
import { TenantManagementStore } from '../model/tenant-management-store';

const app = new Hono();

app.get('/', async (context: Context) => {
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

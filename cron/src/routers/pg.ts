import { type Context, Hono } from 'hono';
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
  const results = await store.getAllTenantsAsync();
  return Response.json(results);
});

export default app;

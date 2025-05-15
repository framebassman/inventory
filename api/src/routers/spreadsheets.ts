import { type Context, Hono } from 'hono';
import { applicationCxt } from '../application-context-middleware';
import { DependencyContainer } from 'tsyringe';
import { InventoryManagementStore } from '../model/inventory-management-store';

const app = new Hono();

app.get('/', async (context: Context) => {
  console.log('Going to connect to spreadsheet');
  const appContext = context.get(applicationCxt) as DependencyContainer;
  console.log('Get appContext');
  const store = appContext.resolve(InventoryManagementStore);
  console.log('Get store');
  await store.saveDataAsync();
  return Response.json('ok');
});

app.post('/lib', async (context: Context) => {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const store = appContext.resolve(InventoryManagementStore);
  await store.workWithSheetsAsync();
  await store.workWithRowsAsync();
  return Response.json('ok');
});

export default app;

import { type Context, Hono } from 'hono';
import { applicationCxt } from '../application-context-middleware';
import { DependencyContainer } from 'tsyringe';
import { InventoryManagementStore } from '../model/inventory-management-store';
import { CreateItemRequest } from '../views/warehouse';
import { WarehouseItem } from '../model/warehouse-item';

const app = new Hono();

app.post('/', async (context: Context) => {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const store = appContext.resolve(InventoryManagementStore);
  const body = (await context.req.json()) as CreateItemRequest;
  const warehouseItem = body as WarehouseItem;
  console.log(warehouseItem);
  return Response.json('ok');
});

export default app;

import { type Context, Hono } from 'hono';
import { applicationCxt } from '../application-context-middleware';
import { CreateItemRequest } from '../views/warehouse';
import { WarehouseItem } from '../model/warehouse-item';
import { WarehouseService } from '../services/warehouse-service';
import { DependencyContainer } from 'tsyringe';

const app = new Hono();

app.post('/assign', async (context: Context) => {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(WarehouseService);
  const body = (await context.req.json()) as CreateItemRequest;
  const item = body as WarehouseItem;
  console.log(item);
  await service.addItemToWarehouseAsync(item);
  return Response.json('ok');
});

export default app;

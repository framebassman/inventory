import { type Context, Hono } from 'hono';
import { applicationCxt } from '../application-context-middleware';
import { CreateItemRequest } from '../views';
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
  const addedItem = await service.addItemToWarehouseAsync(item);
  return Response.json(addedItem);
});

app.post('/item/:code', async (context: Context) => {
  const id = context.req.param('code');
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(WarehouseService);
  console.log('Info about item');
  const item = await service.getInfoAboutItemAsync(id);
  return Response.json(item);
});

export default app;

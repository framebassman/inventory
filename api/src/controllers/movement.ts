import { type Context, Hono } from 'hono';
import { applicationCxt } from '../application-context-middleware';
import { CreateItemRequest } from '../views/warehouse';
import { WarehouseItem } from '../model/warehouse-item';
import { WarehouseService } from '../services/warehouse-service';
import { DependencyContainer } from 'tsyringe';

const app = new Hono();

app.post('/start', async (context: Context) => {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(WarehouseService);
  await service.createNewMovementAsync();
  return Response.json('ok');
});

app.post('/item', async (context: Context) => {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(WarehouseService);
  await service.createNewMovementAsync();
  return Response.json('ok');
});

app.delete('/item', async (context: Context) => {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(WarehouseService);
  return Response.json('ok');
});

export default app;

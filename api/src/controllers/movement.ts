import { type Context, Hono } from 'hono';
import { applicationCxt } from '../application-context-middleware';
import { DependencyContainer } from 'tsyringe';
import { MovementService } from '../services/movement-service';
import { MovementItem } from '../model/movement-item';

const app = new Hono();

app.post('/start', async (context: Context) => {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(MovementService);
  await service.createNewMovementAsync();
  return Response.json('ok');
});

app.post('/item', async (context: Context) => {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(MovementService);
  const item = (await context.req.json()) as MovementItem;
  const result = await service.addItemToDeparturesAsync(item);
  return Response.json(result);
});

app.delete('/item', async (context: Context) => {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(MovementService);
  const item = (await context.req.json()) as MovementItem;
  const result = await service.addItemToDeparturesAsync(item);
  return Response.json(result);
});

export default app;

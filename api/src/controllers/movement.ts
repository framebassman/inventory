import { type Context, Hono } from 'hono';
import { applicationCxt } from '../application-context-middleware';
import { DependencyContainer } from 'tsyringe';
import { MovementService } from '../services/movement-service';
import { MovementItem, MovementStatus } from '../views';

const app = new Hono();

app.get('/current', async (context: Context) => {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(MovementService);
  try {
    const status = await service.getCurrentMovementStatusAsync();
    return context.json(status);
  } catch {
    return context.json({ hasBeenStarted: false } as MovementStatus);
  }
});

app.delete('/current', async (context: Context) => {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(MovementService);
  try {
    const status = await service.closeCurrentMovementAsync();
    return context.json(status);
  } catch {
    return context.json({ hasBeenStarted: false } as MovementStatus);
  }
});

app.post('/current', async (context: Context) => {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(MovementService);
  await service.createNewMovementAsync();
  return context.json('ok');
});

app.post('/item', async (context: Context) => {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(MovementService);
  const item = (await context.req.json()) as MovementItem;
  const result = await service.addItemToDeparturesAsync(item);
  return context.json(result);
});

app.delete('/item', async (context: Context) => {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(MovementService);
  const item = (await context.req.json()) as MovementItem;
  const result = await service.addItemToArrivalsAsync(item);
  return context.json(result);
});

export default app;

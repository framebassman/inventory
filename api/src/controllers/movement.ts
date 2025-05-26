import { type Context, Hono } from 'hono';
import { applicationCxt } from '../application-context-middleware';
import { DependencyContainer } from 'tsyringe';
import { MovementService } from '../services/movement-service';

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
  await service.createNewMovementAsync();
  return Response.json('ok');
});

app.delete('/item', async (context: Context) => {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(MovementService);
  return Response.json('ok');
});

export default app;

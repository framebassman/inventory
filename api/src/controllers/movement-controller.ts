import { type Context, Hono } from 'hono';
import { applicationCxt } from '../application-context-middleware';
import { DependencyContainer } from 'tsyringe';
import { MovementService } from '../services/movement-service';
import { MovementItem, MovementStatus } from '../views';
import { ItemNotFoundError } from '../model/error-causes';

const app = new Hono();

export async function getCurrentMovementAsync(context: Context) {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(MovementService);
  try {
    const status = await service.getCurrentMovementStatusAsync();
    return context.json(status);
  } catch {
    return context.json({ hasBeenStarted: false } as MovementStatus);
  }
}

app.get('/current', getCurrentMovementAsync);

export async function deleteCurrentMovementAsync(context: Context) {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(MovementService);
  try {
    const existentStatus = await service.getCurrentMovementStatusAsync();
    if (!existentStatus.hasBeenStarted) {
      return context.json(existentStatus);
    }
    const status = await service.closeCurrentMovementAsync();
    return context.json(status);
  } catch {
    return context.json({ hasBeenStarted: false } as MovementStatus);
  }
}

app.delete('/current', deleteCurrentMovementAsync);

export async function createMovementAsync(context: Context) {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(MovementService);
  try {
    const existentStatus = await service.getCurrentMovementStatusAsync();
    if (existentStatus.hasBeenStarted) {
      return context.json(existentStatus);
    }
    const status = await service.startNewMovementAsync();
    return context.json(status);
  } catch {
    return context.json('ok');
  }
}

app.post('/current', createMovementAsync);

export async function createItemAsync(context: Context) {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(MovementService);
  const item = (await context.req.json()) as MovementItem;
  try {
    const result = await service.addItemToDeparturesAsync(item);
    return context.json(result);
  } catch (error) {
    if (error instanceof ItemNotFoundError) {
      return context.json(item, 404);
    }
    return context.json(item, 500);
  }
}

app.post('/item', createItemAsync);

export async function deleteItemAsync(context: Context) {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(MovementService);
  const item = (await context.req.json()) as MovementItem;
  try {
    const result = await service.addItemToArrivalsAsync(item);
    return context.json(result);
  } catch (error) {
    if (error instanceof ItemNotFoundError) {
      return context.json(item, 404);
    }
    return context.json(item, 500);
  }
}

app.delete('/item', deleteItemAsync);

export default app;

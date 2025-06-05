import { type Context, Hono } from 'hono';
import { applicationCxt } from '../application-context-middleware';
import { CreateItemRequest } from '../views';
import { WarehouseItem } from '../views';
import { WarehouseService } from '../services/warehouse-service';
import { DependencyContainer } from 'tsyringe';
import { ItemNotFoundError } from '../model/error-causes';

const app = new Hono();

export async function assignHandlerAsync(context: Context) {
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(WarehouseService);
  const body = (await context.req.json()) as CreateItemRequest;
  const item = body as WarehouseItem;
  console.log(item);
  try {
    const existentItem = await service.getInfoAboutItemAsync(item.code);
    console.log('Item has been added before, lets skip the assignition');
    return context.json(existentItem);
  } catch {
    const addedItem = await service.addItemToWarehouseAsync(item);
    return context.json(addedItem);
  }
}

app.post('/assign', assignHandlerAsync);

export async function getItemHandlerAsync(context: Context) {
  console.log('Info about item from controller');
  const code = context.req.param('code');
  const appContext = context.get(applicationCxt) as DependencyContainer;
  const service = appContext.resolve(WarehouseService);
  try {
    console.log('Info about item');
    const item = await service.getInfoAboutItemAsync(code);
    return context.json(item);
  } catch (error) {
    if (error instanceof ItemNotFoundError) {
      return context.json({ code: code }, 404);
    }

    return context.json({ code: code }, 500);
  }
}

app.get('/item/:code', getItemHandlerAsync);

export default app;

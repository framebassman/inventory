import type { Context, MiddlewareHandler } from 'hono';
import { createMiddleware } from 'hono/factory';
import { container } from 'tsyringe';
import { TenantManagementStore } from './model/tenant-management-store';

export const applicationCxt = 'applicationContext';

export const applicationContextMiddleware = (): MiddlewareHandler =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createMiddleware(async (ctx: Context, next: any) => {
    if (!ctx.get(applicationCxt)) {
      container.register<TenantManagementStore>(TenantManagementStore, {
        useValue: new TenantManagementStore(ctx.env.HYPERDRIVE.connectionString)
      });
      ctx.set(applicationCxt, container);
    }
    await next();
  });

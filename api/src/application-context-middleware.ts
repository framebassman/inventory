import type { Context, MiddlewareHandler } from 'hono';
import { createMiddleware } from 'hono/factory';
import { container } from 'tsyringe';
import { TenantManagementStore } from './model/tenant-management-store';
import { InventoryManagementStore } from './model/inventory-management-store';

export const applicationCxt = 'applicationContext';

const googleConfig = {}

export const applicationContextMiddleware = (): MiddlewareHandler =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createMiddleware(async (ctx: Context, next: any) => {
    if (!ctx.get(applicationCxt)) {
      container.register<TenantManagementStore>(TenantManagementStore, {
        useValue: new TenantManagementStore(ctx.env.HYPERDRIVE.connectionString)
      });
      container.register<InventoryManagementStore>(InventoryManagementStore, {
        useValue: new InventoryManagementStore(
          googleConfig,
          '14lLXX19aRQ9aCKbCIaLRPEqzx7HMyPGhUn29ULnAWPs'
        )
      });
      ctx.set(applicationCxt, container);
    }
    await next();
  });

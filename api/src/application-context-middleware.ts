import type { Context, MiddlewareHandler } from 'hono';
import { createMiddleware } from 'hono/factory';
import { container } from 'tsyringe';
import { TenantManagementStore } from './model/tenant-management-store';
import { InventoryManagementStore } from './model/inventory-management-store';
import type { GoogleServiceAccountCredentials } from './model/google-objects';

export const applicationCxt = 'applicationContext';

const combineGoogleCredentials = (
  private_key_id: string,
  private_key: string
): GoogleServiceAccountCredentials => {
  return {
    type: 'service_account',
    project_id: 'inventory-459416',
    private_key_id: private_key_id,
    private_key: private_key,
    client_email: 'inventory@inventory-459416.iam.gserviceaccount.com',
    client_id: '116981449173930617132',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
      'https://www.googleapis.com/robot/v1/metadata/x509/inventory%40inventory-459416.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com'
  } as GoogleServiceAccountCredentials;
};

export const applicationContextMiddleware = (): MiddlewareHandler =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createMiddleware(async (ctx: Context, next: any) => {
    if (!ctx.get(applicationCxt)) {
      container.register<TenantManagementStore>(TenantManagementStore, {
        useValue: new TenantManagementStore(ctx.env.HYPERDRIVE.connectionString)
      });
      container.register<InventoryManagementStore>(InventoryManagementStore, {
        useValue: new InventoryManagementStore(
          combineGoogleCredentials(
            ctx.env.GOOGLE_SERVICEACCOUNT_PRIVATE_KEY_ID,
            ctx.env.GOOGLE_SERVICEACCOUNT_PRIVATE_KEY
          ),
          ctx.env.INVENTORY_MANAGEMENT_DATABASE
        )
      });
      ctx.set(applicationCxt, container);
    }
    await next();
  });

import { container } from 'tsyringe';
import type { Context, MiddlewareHandler } from 'hono';
import { createMiddleware } from 'hono/factory';
import { TenantManagementStore } from './model/tenant-management-store';
import { InventoryManagementStore } from './model/inventory-management-store';
import type { GoogleServiceAccountCredentials } from './model/google-objects';
import { WarehouseService } from './services/warehouse-service';

export const applicationCxt = 'applicationContext';

const combineGoogleCredentialsAsync = async (
  private_key_id: string,
  private_key: string
): Promise<GoogleServiceAccountCredentials> => {
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

      const tenantManagementStore = container.resolve(TenantManagementStore);
      const secrets =
        await tenantManagementStore.getSecretsForTenantAsync('test@test.test');
      console.log(`Successfully got the secrets for 'test@test.test' tenant`);
      const creds = await combineGoogleCredentialsAsync(
        String(secrets.get('private_key_id')),
        String(secrets.get('private_key'))
      );
      container.register<InventoryManagementStore>(InventoryManagementStore, {
        useValue: new InventoryManagementStore(
          creds,
          String(secrets.get('inventory_management_database'))
        )
      });
      container.register<WarehouseService>(WarehouseService, {
        useValue: new WarehouseService(
          container.resolve(InventoryManagementStore)
        )
      });
      ctx.set(applicationCxt, container);
    }
    await next();
  });

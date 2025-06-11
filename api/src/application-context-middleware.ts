import { container, DependencyContainer } from 'tsyringe';
import type { Context, MiddlewareHandler } from 'hono';
import { createMiddleware } from 'hono/factory';
import { TenantManagementStore } from './model/tenant-management-store';
import { InventoryManagementStore } from './model/inventory-management-store';
import type { GoogleServiceAccountCredentials } from './model/google-objects';
import { WarehouseService } from './services/warehouse-service';
import { MovementService } from './services/movement-service';

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

export async function containerBuilderAsync(
  env: any
): Promise<DependencyContainer> {
  container.register<TenantManagementStore>(TenantManagementStore, {
    useValue: new TenantManagementStore(env.HYPERDRIVE.connectionString)
  });

  const tenantManagementStore = container.resolve(TenantManagementStore);
  const appSettings = await tenantManagementStore.getAppSettingsAsync();
  console.log(`Successfully got the app settings`);
  const creds = await combineGoogleCredentialsAsync(
    String(appSettings.get('private_key_id')),
    String(appSettings.get('private_key'))
  );
  const secrets = await tenantManagementStore.getSecretsForTenantAsync(
    'constatura@gmail.com'
  );
  console.log(`Successfully got the secrets for constatura@gmail.com`);
  container.register<InventoryManagementStore>(InventoryManagementStore, {
    useValue: new InventoryManagementStore(
      creds,
      String(secrets.get('inventory_management_database'))
    )
  });
  container.register<WarehouseService>(WarehouseService, {
    useValue: new WarehouseService(container.resolve(InventoryManagementStore))
  });
  container.register<MovementService>(MovementService, {
    useValue: new MovementService(container.resolve(InventoryManagementStore))
  });
  return container;
}

export const applicationContextMiddleware = (): MiddlewareHandler =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createMiddleware(async (ctx: Context, next: any) => {
    if (!ctx.get(applicationCxt)) {
      const container = await containerBuilderAsync(ctx.env);
      ctx.set(applicationCxt, container);
    }
    await next();
  });

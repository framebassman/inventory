import postgres from 'postgres';
import { Tenant } from './tenant';
import { injectable } from 'tsyringe';
import { log } from '../logger';

@injectable()
export class TenantManagementStore {
  private client: postgres.Sql;

  constructor(connectionString: string) {
    this.client = postgres(connectionString, {
      // Workers limit the number of concurrent external connections, so be sure to limit
      // the size of the local connection pool that postgres.js may establish.
      max: 5,

      // If you are not using array types in your Postgres schema,
      // disabling this will save you an extra round-trip every time you connect.
      fetch_types: false
    });
  }

  public async close(): Promise<void> {
    return this.client.end();
  }

  public async getAllTenants(): Promise<Tenant[]> {
    const result = [] as Tenant[];
    const queryResult = await this.client`SELECT * FROM tenants;`;

    for (const row of queryResult.entries()) {
      log.info('row: ', row);
      const tenant = row[1] as Tenant;
      result.push(tenant);
    }
    log.info('result', result);
    return result;
  }
}

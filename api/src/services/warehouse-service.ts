import { InventoryManagementStore } from '../model/inventory-management-store';
import { WarehouseItem } from '../model/warehouse-item';

export class WarehouseService {
  private store: InventoryManagementStore;

  constructor(store: InventoryManagementStore) {
    this.store = store;
  }

  public async addItemToWarehouseAsync(item: WarehouseItem): Promise<boolean> {
    console.log(item);
    await this.store.verifyTenantSheetIsPresentedAsync('test@test.test');
    return true;
  }
}

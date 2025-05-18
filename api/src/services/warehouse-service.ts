import { InventoryManagementStore } from '../model/inventory-management-store';
import { WarehouseItem } from '../model/warehouse-item';

export class WarehouseService {
  private store: InventoryManagementStore;

  constructor(store: InventoryManagementStore) {
    this.store = store;
  }

  public async addItemToWarehouseAsync(item: WarehouseItem): Promise<boolean> {
    console.log(item);
    // const warehouseSheetName = await this.store.getLastSheetNameAsync();
    await this.store.addToLastSheetAsync(item.name, item.code);
    return true;
  }
}

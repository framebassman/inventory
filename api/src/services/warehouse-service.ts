import { InventoryManagementStore } from '../model/inventory-management-store';
import { WarehouseItem } from '../model/warehouse-item';

export class WarehouseService {
  private store: InventoryManagementStore;

  constructor(store: InventoryManagementStore) {
    this.store = store;
  }

  public async addItemToWarehouseAsync(item: WarehouseItem): Promise<boolean> {
    await this.store.startSessionAsync();
    await this.store.addToLastSheetAsync(item.name, item.code);
    return true;
  }

  public async getInfoAboutItemAsync(code: string): Promise<WarehouseItem> {
    await this.store.startSessionAsync();
    const name = await this.store.getNameOfItemAsync(code);
    return { code, name } as WarehouseItem;
  }
}

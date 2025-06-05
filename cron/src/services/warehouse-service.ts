import { InventoryManagementStore } from '../model/inventory-management-store';
import { WarehouseItem } from '../views';

export class WarehouseService {
  private store: InventoryManagementStore;

  constructor(store: InventoryManagementStore) {
    this.store = store;
  }

  public async addItemToWarehouseAsync(
    item: WarehouseItem
  ): Promise<WarehouseItem> {
    await this.store.startSessionAsync();
    await this.store.addToLastSheetAsync(item.name, item.code);
    return item;
  }

  public async getInfoAboutItemAsync(code: string): Promise<WarehouseItem> {
    await this.store.startSessionAsync();
    console.log('Get item name');
    const name = await this.store.getNameOfItemAsync(code);
    return { code, name } as WarehouseItem;
  }
}

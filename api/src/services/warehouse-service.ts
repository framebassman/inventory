import { InventoryManagementStore } from '../model/inventory-management-store';
import { WarehouseItem } from '../model/warehouse-item';

export class WarehouseService {
  private store: InventoryManagementStore;

  constructor(store: InventoryManagementStore) {
    this.store = store;
  }

  public async createNewMovementAsync(): Promise<boolean> {
    // const rubicon = new Date(`2025-05-24T15:00:00.000Z`);
    // const rubicon = new Date(
    //   `${new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })}T15:00:00.000Z`
    // );
    // const now = new Date(nowIsoString);
    // 25.05.2025
    const name = new Date().toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    await this.store.createOrUpdateNewSheetAsync(name);
    return true;
  }

  public async addItemToWarehouseAsync(item: WarehouseItem): Promise<boolean> {
    await this.store.addToLastSheetAsync(item.name, item.code);
    return true;
  }

  public async startNewMovementAsync(): Promise<boolean> {
    const existentListDate = await this.store.getDateOfFirstListAsync();
    return true;
  }
}

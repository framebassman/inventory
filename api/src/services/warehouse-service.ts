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
    console.log(new Date().toISOString());
    const name = new Date().toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    await this.store.startSessionAsync();
    const nameParts = name.split('.');
    // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
    // January - 0, February - 1, etc.
    const nameDate = new Date(
      Number(nameParts[2]),
      Number(nameParts[1]) - 1,
      Number(nameParts[0])
    );
    if ((await this.store.getSheetsCountAsync()) - 1 != 0) {
      console.log('There is a movement for the today - skip the creation');
      return true;
    }

    const titleParts = this.store.getSheetsByIndex(0).title.split('.');
    const titleDate = new Date(
      Number(titleParts[2]),
      Number(titleParts[1]) - 1,
      Number(titleParts[0])
    );
    if (titleDate < nameDate) {
      console.log('There is a movement for the today - skip the creation');
    }
    await this.store.createNewMovementSheetAsync(name);
    console.log(
      `Lets try to create a new movement for today with name: ${name}`
    );

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

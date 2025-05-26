import { it } from 'node:test';
import { InventoryManagementStore } from '../model/inventory-management-store';
import { MovementItem } from '../model/movement-item';

export class MovementService {
  private store: InventoryManagementStore;

  constructor(store: InventoryManagementStore) {
    this.store = store;
  }

  // const rubicon = new Date(`2025-05-24T15:00:00.000Z`);
  // const rubicon = new Date(
  //   `${new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })}T15:00:00.000Z`
  // );
  public async createNewMovementAsync(): Promise<boolean> {
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
    try {
      const sheetsLength = await this.store.getSheetsCountAsync();
      if (sheetsLength === 1) {
        throw Error('It is a first time. The movement should be created');
      }
      const titleParts = this.store.getSheetsByIndex(0).title.split('.');
      const titleDate = new Date(
        Number(titleParts[2]),
        Number(titleParts[1]) - 1,
        Number(titleParts[0])
      );

      if (nameDate > titleDate) {
        throw Error(
          'There are no movements for the today. The movement should be created'
        );
      }

      console.log('There is a movement for the today - skip the creation');
    } catch (error) {
      await this.store.createNewMovementSheetAsync(name);
      console.log(
        `Lets try to create a new movement for today with name: ${name}`
      );
    }

    return true;
  }

  // public async processMovementItemAsync(item: MovementItem): Promise<boolean> {
  //   await this.store.startSessionAsync();
  //   // const rubicon = new Date(`2025-05-24T15:00:00.000Z`);
  //   const rubicon = new Date(
  //     `${new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })}T15:00:00.000Z`
  //   );
  //   const now = new Date();
  //   if (now < rubicon) {
  //     await this.store.addItemToDeparturesAsync(item.code, '');
  //   } else {
  //     await this.store.addItemToArrivalsAsync(item.code, '');
  //   }
  //   return true;
  // }

  public async addItemToDeparturesAsync(item: MovementItem): Promise<boolean> {
    return await this.store.addItemToArrivalsAsync(item.code, '21:00');
  }

  public async addItemToArrivalsAsync(item: MovementItem): Promise<boolean> {
    return await this.store.addItemToArrivalsAsync(item.code, '21:00');
  }
}

import { InventoryManagementStore } from '../model/inventory-management-store';
import { MovementItem, MovementStatus } from '../views';

export class MovementService {
  private store: InventoryManagementStore;

  constructor(store: InventoryManagementStore) {
    this.store = store;
  }

  public async getCurrentMovementStatusAsync(): Promise<MovementStatus> {
    await this.store.startSessionAsync();
    const title = await this.store.getFirstSheetNameAsync();
    return { hasBeenStarted: title.includes('Запланированный') };
  }
  // // const rubicon = new Date(`2025-05-24T15:00:00.000Z`);
  // // const rubicon = new Date(
  // //   `${new Date().toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' })}T15:00:00.000Z`
  // // );
  // public async createNewMovement1Async(): Promise<boolean> {
  //   // const now = new Date(nowIsoString);
  //   // 25.05.2025
  //   console.log(new Date().toISOString());
  //   const name = new Date().toLocaleDateString('ru-RU', {
  //     year: 'numeric',
  //     month: '2-digit',
  //     day: '2-digit'
  //   });
  //   await this.store.startSessionAsync();
  //   const nameParts = name.split('.');
  //   // Please pay attention to the month (parts[1]); JavaScript counts months from 0:
  //   // January - 0, February - 1, etc.
  //   const nameDate = new Date(
  //     Number(nameParts[2]),
  //     Number(nameParts[1]) - 1,
  //     Number(nameParts[0])
  //   );
  //   try {
  //     const sheetsLength = await this.store.getSheetsCountAsync();
  //     if (sheetsLength === 1) {
  //       throw Error('It is a first time. The movement should be created');
  //     }
  //     const titleParts = this.store.getSheetsByIndex(0).title.split('.');
  //     const titleDate = new Date(
  //       Number(titleParts[2]),
  //       Number(titleParts[1]) - 1,
  //       Number(titleParts[0])
  //     );

  //     if (nameDate > titleDate) {
  //       throw Error(
  //         'There are no movements for the today. The movement should be created'
  //       );
  //     }

  //     console.log('There is a movement for the today - skip the creation');
  //   } catch (error) {
  //     await this.store.createNewMovementSheetAsync(name);
  //     console.log(
  //       `Lets try to create a new movement for today with name: ${name}`
  //     );
  //   }

  //   return true;
  // }

  public async createNewMovementAsync(): Promise<MovementStatus> {
    await this.store.startSessionAsync();
    const candidate = await this.getCurrentMovementStatusAsync();
    if (candidate.hasBeenStarted) {
      console.warn('Please close the current one');
      return candidate;
    }

    const dateTime = new Date().toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    await this.store.createNewMovementSheetAsync(
      `Запланированный - ${dateTime}`
    );
    return { hasBeenStarted: true } as MovementStatus;
  }

  public async closeCurrentMovementAsync(): Promise<MovementStatus> {
    await this.store.startSessionAsync();
    try {
      const candidate = await this.getCurrentMovementStatusAsync();
      if (candidate.hasBeenStarted) {
        const status = await this.store.closeMovementAsync();
        return { hasBeenStarted: status } as MovementStatus;
      } else {
        console.warn('Please start the new movement before the closing');
        throw Error('Please start the new movement before the closing');
      }
    } catch {
      return { hasBeenStarted: true } as MovementStatus;
    }
  }

  public async addItemToDeparturesAsync(item: MovementItem): Promise<MovementItem> {
    await this.store.startSessionAsync();
    const name = await this.store.addItemToDeparturesAsync(
      item.code,
      new Date().toISOString().split('T')[1]
    );
    return { code: item.code, name: name } as MovementItem;
  }

  public async addItemToArrivalsAsync(item: MovementItem): Promise<MovementItem> {
    await this.store.startSessionAsync();
    const name = await this.store.addItemToArrivalsAsync(
      item.code,
      new Date().toISOString().split('T')[1]
    );
    return { code: item.code, name: name } as MovementItem;
  }
}

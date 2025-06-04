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
      const status = await this.store.closeMovementAsync();
      return { hasBeenStarted: status } as MovementStatus;
    } catch {
      return { hasBeenStarted: true } as MovementStatus;
    }
  }

  public async addItemToDeparturesAsync(
    item: MovementItem
  ): Promise<MovementItem> {
    await this.store.startSessionAsync();
    const name = await this.store.addItemToDeparturesAsync(
      item.code,
      this.getFormattedTime(new Date())
    );
    return { code: item.code, name: name } as MovementItem;
  }

  public async addItemToArrivalsAsync(
    item: MovementItem
  ): Promise<MovementItem> {
    await this.store.startSessionAsync();
    const name = await this.store.addItemToArrivalsAsync(
      item.code,
      this.getFormattedTime(new Date())
    );
    return { code: item.code, name: name } as MovementItem;
  }

  private getFormattedTime(now: Date): string {
    const timeStringWithZ = now.toISOString().split('T')[1];
    return timeStringWithZ.split('.')[0];
  }
}

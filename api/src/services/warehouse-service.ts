import { injectable } from 'tsyringe';
import { InventoryManagementStore } from '../model/inventory-management-store';

@injectable()
export class WarehouseService {
  private store: InventoryManagementStore;

  constructor(store: InventoryManagementStore) {
    this.store = store;
  }
}

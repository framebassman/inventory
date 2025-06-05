import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WarehouseService } from '../../src/services/warehouse-service';
import { InventoryManagementStore } from '../../src/model/inventory-management-store';
import { WarehouseItem } from '../../src/views';

describe('WarehouseService', () => {
  let store: InventoryManagementStore;
  let service: WarehouseService;

  beforeEach(() => {
    store = new InventoryManagementStore({ client_email: '', private_key: '' } as any, '');
    service = new WarehouseService(store);
    vi.restoreAllMocks();
  });

  describe('addItemToWarehouseAsync', () => {
    it('should add item to warehouse and return the item', async () => {
      vi.spyOn(store, 'startSessionAsync').mockResolvedValue(true);
      const addToLastSheetAsync = vi.spyOn(store, 'addToLastSheetAsync').mockResolvedValue(true);

      const item: WarehouseItem = { code: 'A1', name: 'Widget' };
      const result = await service.addItemToWarehouseAsync(item);

      expect(addToLastSheetAsync).toHaveBeenCalledWith('Widget', 'A1');
      expect(result).toEqual(item);
    });
  });

  describe('getInfoAboutItemAsync', () => {
    it('should get item name by code and return WarehouseItem', async () => {
      vi.spyOn(store, 'startSessionAsync').mockResolvedValue(true);
      vi.spyOn(store, 'getNameOfItemAsync').mockResolvedValue('Gadget');

      const code = 'B2';
      const result = await service.getInfoAboutItemAsync(code);

      expect(store.getNameOfItemAsync).toHaveBeenCalledWith('B2');
      expect(result).toEqual({ code: 'B2', name: 'Gadget' });
    });
  });
});
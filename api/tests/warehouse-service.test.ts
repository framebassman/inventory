import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WarehouseService } from '../src/services/warehouse-service';
import { InventoryManagementStore } from '../src/model/inventory-management-store';
import { GoogleServiceAccountCredentials } from '../src/model/google-objects';
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';

class MockStore extends InventoryManagementStore {
  constructor() {
    super(
      {
        client_email: 'test@test.test',
        private_key: 'key'
      } as GoogleServiceAccountCredentials,
      ''
    );
  }
}

describe('Warehouse service', () => {
  it('should process date', async () => {
    expect(!isNaN(new Date('Warehouse').getTime())).toBeFalsy();
    expect(!isNaN(new Date('01-May-2025').getTime())).toBeTruthy();
  });

  describe('movements', () => {
    beforeEach(() => {
      // tell vitest we use mocked time
      vi.useFakeTimers();
    });

    afterEach(() => {
      // restoring date after each test run
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    it('can create a new movement for the first time', async () => {
      const store = new MockStore();
      store.startSessionAsync = vi.fn(async () => true);
      store.getSheetsCountAsync = vi.fn(async () => 1);
      store.getSheetsByIndex = vi.fn((_: number) => {
        return { title: 'Warehouse' } as GoogleSpreadsheetWorksheet;
      });
      store.createNewMovementSheetAsync = vi.fn(async () => true);
      const service = new WarehouseService(store);

      await service.createNewMovementAsync();

      expect(store.createNewMovementSheetAsync).toHaveBeenCalledOnce();
    });
  });
});

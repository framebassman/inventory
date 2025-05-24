import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WarehouseService } from '../src/services/warehouse-service';
import { InventoryManagementStore } from '../src/model/inventory-management-store';
import { GoogleServiceAccountCredentials } from '../src/model/google-objects';

class MockStore extends InventoryManagementStore {
  constructor() {
    super({} as GoogleServiceAccountCredentials, '');
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

    it('can create a new movement', async () => {
      const service = new WarehouseService(new MockStore());
      const res = await service.createNewMovementAsync(
        new Date().toISOString()
      );
      expect(res).toEqual(true);
    });
  });
});

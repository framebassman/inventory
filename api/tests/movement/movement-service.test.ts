import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MovementService } from '../../src/services/movement-service.ts';
import { InventoryManagementStore } from '../../src/model/inventory-management-store.ts';
import { MovementItem } from '../../src/views.ts';

describe('MovementService', () => {
  let store: InventoryManagementStore;
  let service: MovementService;

  beforeEach(() => {
    store = new InventoryManagementStore({ client_email: '', private_key: '' } as any, '');
    service = new MovementService(store);

    // Reset all mocks before each test
    vi.restoreAllMocks();
  });

  describe('getCurrentMovementStatusAsync', () => {
    it('should return hasBeenStarted true if sheet name includes "Запланированный"', async () => {
      vi.spyOn(store, 'startSessionAsync').mockResolvedValue(true);
      vi.spyOn(store, 'getFirstSheetNameAsync').mockResolvedValue('Запланированный - 31.01.2025');
      const result = await service.getCurrentMovementStatusAsync();
      expect(result).toEqual({ hasBeenStarted: true });
    });

    it('should return hasBeenStarted false if sheet name does not include "Запланированный"', async () => {
      vi.spyOn(store, 'startSessionAsync').mockResolvedValue(true);
      vi.spyOn(store, 'getFirstSheetNameAsync').mockResolvedValue('Some Other Sheet');
      const result = await service.getCurrentMovementStatusAsync();
      expect(result).toEqual({ hasBeenStarted: false });
    });
  });

  describe('startNewMovementAsync', () => {
    it('should not start new movement if one is already started', async () => {
      vi.spyOn(store, 'startSessionAsync').mockResolvedValue(true);
      const getCurrentMovementStatusAsync = vi
        .spyOn(service, 'getCurrentMovementStatusAsync')
        .mockResolvedValue({ hasBeenStarted: true });
      const result = await service.startNewMovementAsync();
      expect(getCurrentMovementStatusAsync).toHaveBeenCalled();
      expect(result).toEqual({ hasBeenStarted: true });
    });

    it('should start new movement if none is started', async () => {
      vi.spyOn(store, 'startSessionAsync').mockResolvedValue(true);
      vi.spyOn(service, 'getCurrentMovementStatusAsync').mockResolvedValue({ hasBeenStarted: false });
      const startNewMovementSheetAsync = vi
        .spyOn(store, 'startNewMovementSheetAsync')
        .mockResolvedValue(true);

      const result = await service.startNewMovementAsync();
      expect(startNewMovementSheetAsync).toHaveBeenCalled();
      expect(result).toEqual({ hasBeenStarted: true });
    });
  });

  describe('closeCurrentMovementAsync', () => {
    it('should return hasBeenStarted as returned by store.closeMovementAsync', async () => {
      vi.spyOn(store, 'startSessionAsync').mockResolvedValue(true);
      vi.spyOn(store, 'closeMovementAsync').mockResolvedValue(false);
      const result = await service.closeCurrentMovementAsync();
      expect(result).toEqual({ hasBeenStarted: false });
    });

    it('should return hasBeenStarted: true if store.closeMovementAsync throws', async () => {
      vi.spyOn(store, 'startSessionAsync').mockResolvedValue(true);
      vi.spyOn(store, 'closeMovementAsync').mockRejectedValue(new Error('fail'));
      const result = await service.closeCurrentMovementAsync();
      expect(result).toEqual({ hasBeenStarted: true });
    });
  });

  describe('addItemToDeparturesAsync', () => {
    it('should add item to departures and return MovementItem', async () => {
      vi.spyOn(store, 'startSessionAsync').mockResolvedValue(true);
      vi.spyOn(store, 'addItemToDeparturesAsync').mockResolvedValue('Item Name');
      const item: MovementItem = { code: '123' };
      const result = await service.addItemToDeparturesAsync(item);
      expect(result).toEqual({ code: '123', name: 'Item Name' });
    });
  });

  describe('addItemToArrivalsAsync', () => {
    it('should add item to arrivals and return MovementItem', async () => {
      vi.spyOn(store, 'startSessionAsync').mockResolvedValue(true);
      vi.spyOn(store, 'addItemToArrivalsAsync').mockResolvedValue('Arrived Item');
      const item: MovementItem = { code: '456' };
      const result = await service.addItemToArrivalsAsync(item);
      expect(result).toEqual({ code: '456', name: 'Arrived Item' });
    });
  });
});

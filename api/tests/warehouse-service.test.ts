import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MockStore } from './mock-store';
import { WarehouseService } from '../src/services/warehouse-service';
import { WarehouseItem } from '../src/views';

describe('Warehouse service', () => {
  let store: MockStore;
  let service: WarehouseService;

  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers();
    store = new MockStore();
    service = new WarehouseService(store);
    store.startSessionAsync = vi.fn(async () => true);
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should process date', async () => {
    expect(!isNaN(new Date('Warehouse').getTime())).toBeFalsy();
    expect(!isNaN(new Date('01-May-2025').getTime())).toBeTruthy();
  });

  it('can return the item info', async () => {
    store.getNameOfItemAsync = vi.fn(async () => 'test');
    const info = await service.getInfoAboutItemAsync('1');

    expect(info).toStrictEqual({ code: '1', name: 'test' } as WarehouseItem);
    expect(store.getNameOfItemAsync).toHaveBeenCalledExactlyOnceWith('1');
  });
});

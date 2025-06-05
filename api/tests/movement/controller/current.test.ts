import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { MovementService } from '../../../src/services/movement-service';
import { MockStore } from '../../mock-store';
import { InventoryManagementStore } from '../../../src/model/inventory-management-store';
import { MovementStatus } from '../../../src/views';

describe('Start movement', () => {
  let store: InventoryManagementStore;
  let service: MovementService;
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers();
    const now = new Date(2000, 0, 30);
    vi.setSystemTime(now);
    store = new MockStore();
    service = new MovementService(store);
    store.startSessionAsync = vi.fn(async () => true);
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('will return No Movement if there is no "Запланированный" sheet', async () => {
    store.getFirstSheetNameAsync = vi.fn(async () => '30.01.2000');

    const status = await service.getCurrentMovementStatusAsync();

    expect(status).toStrictEqual({ hasBeenStarted: false } as MovementStatus);
  });

  it('will return Movement Status if there is a "Запланированный" sheet', async () => {
    store.getFirstSheetNameAsync = vi.fn(async () => 'Запланированный');

    const status = await service.getCurrentMovementStatusAsync();

    expect(status).toStrictEqual({ hasBeenStarted: true } as MovementStatus);
  });

  it('can create a new movement for the first time', async () => {
    store.getSheetsCountAsync = vi.fn(async () => 1);
    store.startNewMovementSheetAsync = vi.fn(async () => true);
    store.getFirstSheetNameAsync = vi.fn(async () => '30.01.2000');
    vi.setSystemTime(new Date(2000, 0, 31));

    await service.startNewMovementAsync();

    expect(store.startNewMovementSheetAsync).toHaveBeenCalledExactlyOnceWith(
      'Запланированный - 31.01.2000'
    );
  });

  it('can create a new movement for the next time', async () => {
    store.getSheetsCountAsync = vi.fn(async () => 2);
    store.getSheetsByIndex = vi.fn((_: number) => {
      return { title: '30.01.2000' } as GoogleSpreadsheetWorksheet;
    });
    store.startNewMovementSheetAsync = vi.fn(async () => true);
    store.getFirstSheetNameAsync = vi.fn(async () => '30.01.2000');
    vi.setSystemTime(new Date(2000, 0, 31));

    await service.startNewMovementAsync();

    expect(store.startNewMovementSheetAsync).toHaveBeenCalledExactlyOnceWith(
      'Запланированный - 31.01.2000'
    );
  });

  it('wont create a new movement if it has already been created', async () => {
    store.getSheetsCountAsync = vi.fn(async () => 2);
    store.getSheetsByIndex = vi.fn((_: number) => {
      return { title: '30.01.2000' } as GoogleSpreadsheetWorksheet;
    });
    store.startNewMovementSheetAsync = vi.fn(async () => true);
    store.getFirstSheetNameAsync = vi.fn(
      async () => 'Запланированный - 30.01.2000'
    );
    vi.setSystemTime(new Date(2000, 0, 31));

    await service.startNewMovementAsync();

    expect(store.startNewMovementSheetAsync).toHaveBeenCalledTimes(0);
  });
});

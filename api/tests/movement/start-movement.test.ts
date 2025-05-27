import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { MovementService } from '../../src/services/movement-service';
import { MockStore } from '../mock-store';

describe('Start movement', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers();
    const now = new Date(2000, 0, 2);
    vi.setSystemTime(now);
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
    store.createNewMovementSheetAsync = vi.fn(async () => true);
    const service = new MovementService(store);

    await service.createNewMovementAsync();

    expect(store.createNewMovementSheetAsync).toHaveBeenCalledExactlyOnceWith(
      '02.01.2000'
    );
  });

  it('can create a new movement for the next time', async () => {
    const store = new MockStore();
    store.startSessionAsync = vi.fn(async () => true);
    store.getSheetsCountAsync = vi.fn(async () => 2);
    store.getSheetsByIndex = vi.fn((_: number) => {
      return { title: '01.01.2000' } as GoogleSpreadsheetWorksheet;
    });
    store.createNewMovementSheetAsync = vi.fn(async () => true);
    const service = new MovementService(store);

    await service.createNewMovementAsync();

    expect(store.createNewMovementSheetAsync).toHaveBeenCalledExactlyOnceWith(
      '02.01.2000'
    );
  });

  it('wont create a new movement if it has already been created', async () => {
    const store = new MockStore();
    store.startSessionAsync = vi.fn(async () => true);
    store.getSheetsCountAsync = vi.fn(async () => 2);
    store.getSheetsByIndex = vi.fn((_: number) => {
      return { title: '02.01.2000' } as GoogleSpreadsheetWorksheet;
    });
    store.createNewMovementSheetAsync = vi.fn(async () => true);
    const service = new MovementService(store);

    await service.createNewMovementAsync();

    expect(store.createNewMovementSheetAsync).toHaveBeenCalledTimes(0);
  });
});

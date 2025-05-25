import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { MovementService } from '../../src/services/movement-service';
import { MockStore } from './mock-store';
import { MovementItem } from '../../src/model/movement-item';

describe('Movement item', () => {
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

    await service.processMovementItemAsync({} as MovementItem);

    expect(store.createNewMovementSheetAsync).toHaveBeenCalledExactlyOnceWith(
      '02.01.2000'
    );
  });
});

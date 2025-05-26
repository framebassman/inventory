import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MovementService } from '../../src/services/movement-service';
import { MockStore } from './mock-store';
import { MovementItem } from '../../src/views';

describe('Movement item', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers();
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('can add item to departures if current time is earlier than 15:00', async () => {
    const now = new Date(2000, 0, 2, 13, 0, 0);
    vi.setSystemTime(now);
    const store = new MockStore();
    store.startSessionAsync = vi.fn(async () => true);
    store.getSheetsCountAsync = vi.fn(async () => 1);
    store.addItemToDeparturesAsync = vi.fn(async () => true);
    const service = new MovementService(store);

    await service.addItemToDeparturesAsync({
      code: '123'
    } as MovementItem);

    expect(store.addItemToDeparturesAsync).toHaveBeenCalledExactlyOnceWith(
      '123',
      now.toISOString().split('T')[1]
    );
  });

  it('can add item to arrivals if current time is earlier than 15:00', async () => {
    const now = new Date(2000, 0, 2, 16, 0, 0);
    vi.setSystemTime(now);
    const store = new MockStore();
    store.startSessionAsync = vi.fn(async () => true);
    store.getSheetsCountAsync = vi.fn(async () => 1);
    store.addItemToArrivalsAsync = vi.fn(async () => true);
    const service = new MovementService(store);

    await service.addItemToArrivalsAsync({
      code: '123'
    } as MovementItem);

    expect(store.addItemToArrivalsAsync).toHaveBeenCalledExactlyOnceWith(
      '123',
      now.toISOString().split('T')[1]
    );
  });
});

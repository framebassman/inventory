import {
  afterEach,
  beforeEach,
  beforeAll,
  describe,
  expect,
  it,
  vi
} from 'vitest';
import { MovementService } from '../../../src/services/movement-service';
import { MockStore } from '../../mock-store';
import { MovementItem } from '../../../src/views';

describe('Movement item', () => {
  let store: MockStore;
  const now = new Date('2016-11-22T15:00:00.000Z');

  beforeAll(() => {
    store = new MockStore();
    store.startSessionAsync = vi.fn(async () => true);
    store.getSheetsCountAsync = vi.fn(async () => 1);
    store.addItemToDeparturesAsync = vi.fn(async () => '');
    store.addItemToArrivalsAsync = vi.fn(async () => '');
  });

  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers();
  });

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe('Departures', () => {
    it('can add item to departures', async () => {
      vi.setSystemTime(now);
      const service = new MovementService(store);

      await service.addItemToDeparturesAsync({
        code: '123'
      } as MovementItem);

      expect(store.addItemToDeparturesAsync).toHaveBeenCalledExactlyOnceWith(
        '123',
        '15:00:00'
      );
    });
  });

  describe('Arrivals', () => {
    it('can add item to arrivals', async () => {
      vi.setSystemTime(now);
      const service = new MovementService(store);

      await service.addItemToArrivalsAsync({
        code: '123'
      } as MovementItem);

      expect(store.addItemToArrivalsAsync).toHaveBeenCalledExactlyOnceWith(
        '123',
        '15:00:00'
      );
    });
  });
});

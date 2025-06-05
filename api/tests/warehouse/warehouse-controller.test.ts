import "reflect-metadata";
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DependencyContainer } from 'tsyringe';
import { WarehouseService } from '../../src/services/warehouse-service';
import { applicationCxt } from '../../src/application-context-middleware';
import { assignHandlerAsync, getItemHandlerAsync } from '../../src/controllers/warehouse-controller';
import type { Context } from 'hono';
import { ItemNotFoundError } from "../../src/model/error-causes";

describe('Warehouse Controller Handlers', () => {
  let mockService: WarehouseService;
  let mockContainer: DependencyContainer;
  let mockContext: Partial<Context>;

  beforeEach(() => {
    mockService = {
      getInfoAboutItemAsync: vi.fn(),
      addItemToWarehouseAsync: vi.fn(),
    } as unknown as WarehouseService;

    mockContainer = {
      resolve: vi.fn().mockImplementation((service) => {
        if (service === WarehouseService) return mockService;
        throw new Error('Unknown service');
      }),
    } as unknown as DependencyContainer;

    mockContext = {
      get: vi.fn().mockImplementation((key) => {
        if (key === applicationCxt) return mockContainer;
        return undefined;
      }),
      json: vi.fn() as any,
      req: {
        json: vi.fn(),
        param: vi.fn(),
      } as any,
    };
  });

  describe('assignHandlerAsync', () => {
    it('should return existent item if already assigned', async () => {
      const item = { code: '123', name: 'Widget' };
      (mockService.getInfoAboutItemAsync as any).mockResolvedValue(item);
      (mockContext.req!.json as any).mockResolvedValue(item);

      await assignHandlerAsync(mockContext as Context);

      expect(mockService.getInfoAboutItemAsync).toHaveBeenCalledWith('123');
      expect(mockService.addItemToWarehouseAsync).not.toHaveBeenCalled();
      expect(mockContext.json).toHaveBeenCalledWith(item);
    });

    it('should add item if not already assigned', async () => {
      const item = { code: '123', name: 'Gadget' };
      (mockService.getInfoAboutItemAsync as any).mockRejectedValue(new ItemNotFoundError('Not found'));
      (mockService.addItemToWarehouseAsync as any).mockResolvedValue(item);
      (mockContext.req!.json as any).mockResolvedValue(item);

      await assignHandlerAsync(mockContext as Context);

      expect(mockService.getInfoAboutItemAsync).toHaveBeenCalledWith('123');
      expect(mockService.addItemToWarehouseAsync).toHaveBeenCalledWith(item);
      expect(mockContext.json).toHaveBeenCalledWith(item);
    });
  });

  describe('getItemHandlerAsync', () => {
    it('should return item info if found', async () => {
      const item = { code: '123', name: 'Thing' };
      (mockService.getInfoAboutItemAsync as any).mockResolvedValue(item);
      (mockContext.req!.param as any).mockReturnValue('123');

      await getItemHandlerAsync(mockContext as Context);

      expect(mockService.getInfoAboutItemAsync).toHaveBeenCalledWith('123');
      expect(mockContext.json).toHaveBeenCalledWith(item);
    });

    it('should return 404 if item not found', async () => {
      (mockService.getInfoAboutItemAsync as any).mockRejectedValue(new ItemNotFoundError('Not found'));
      (mockContext.req!.param as any).mockReturnValue('123');

      await getItemHandlerAsync(mockContext as Context);

      expect(mockService.getInfoAboutItemAsync).toHaveBeenCalledWith('123');
      expect(mockContext.json).toHaveBeenCalledWith({ code: '123' }, 404);
    });
  });
});

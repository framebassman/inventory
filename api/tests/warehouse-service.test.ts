import { describe, expect, it } from 'vitest';

describe('Warehouse service', () => {
  it('should process date', async () => {
    expect(!isNaN(new Date('Warehouse').getTime())).toBeFalsy();
    expect(!isNaN(new Date('01-May-2025').getTime())).toBeTruthy();
  });
});

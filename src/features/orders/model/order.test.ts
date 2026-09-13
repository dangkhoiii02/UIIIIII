import { describe, expect, it } from 'vitest';
import { billableWeight, filterOrders, validateOrder } from './order';
import { defaultOrderInput, emptyFilters } from './types';
import { createMemoryOrderRepository } from '../data/order-repository';
const valid = {
  ...defaultOrderInput,
  name: 'Khách mẫu',
  phone: '0901234567',
  address: '1 Đường mẫu',
  region: 'Hà Nội',
  product: 'Áo',
};
describe('order domain', () => {
  it('rejects invalid numbers and phones, permits zero COD', () => {
    expect(validateOrder(valid)).toEqual([]);
    expect(validateOrder({ ...valid, phone: '123', cod: NaN, weight: 0 })).toHaveLength(3);
  });
  it('uses volumetric weight when it exceeds actual weight', () => {
    expect(billableWeight({ ...valid, length: 20, width: 20, height: 20 })).toBe(1600);
  });
  it('validates the entire batch before writing', () => {
    const repository = createMemoryOrderRepository([]);
    expect(() => repository.create([valid, { ...valid, phone: '' }])).toThrow();
    expect(repository.list()).toEqual([]);
  });
  it('updates an existing order without creating a duplicate', () => {
    const repository = createMemoryOrderRepository([]);
    const [order] = repository.create([valid]);
    repository.update(order!.id, { ...valid, cod: 50000 });
    expect(repository.list()).toHaveLength(1);
    expect(repository.list()[0]?.cod).toBe(50000);
  });
  it('treats both payer selections as all and applies date filters', () => {
    const repository = createMemoryOrderRepository([]);
    const [order] = repository.create([valid]);
    const sample = { ...order!, createdAt: '2026-09-12T12:00:00+07:00' };
    expect(filterOrders([sample], { ...emptyFilters, sender: true, recipient: true })).toHaveLength(
      1,
    );
    expect(
      filterOrders([sample], { ...emptyFilters, days: '1' }, new Date('2026-09-13T12:00:00+07:00')),
    ).toEqual([]);
  });
});

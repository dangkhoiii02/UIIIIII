import type { Order, OrderFilters, OrderInput } from './types';
export function validateOrder(input: OrderInput): string[] {
  const errors: string[] = [];
  if (![input.name, input.address, input.region, input.product].every((value) => value.trim()))
    errors.push('Điền đầy đủ thông tin người nhận, khu vực và sản phẩm.');
  if (!/^0\d{9}$/.test(input.phone))
    errors.push('Số điện thoại phải gồm 10 chữ số, bắt đầu bằng 0.');
  if (!Number.isFinite(input.weight) || input.weight <= 0)
    errors.push('Khối lượng phải lớn hơn 0.');
  if (
    ![input.value, input.cod, input.length, input.width, input.height].every(
      (n) => Number.isFinite(n) && n >= 0,
    )
  )
    errors.push('Giá trị, thu hộ và kích thước phải là số không âm.');
  if (input.note.length > 120) errors.push('Ghi chú không quá 120 ký tự.');
  return errors;
}
export function billableWeight(input: Pick<OrderInput, 'weight' | 'length' | 'width' | 'height'>) {
  return Math.max(input.weight, Math.ceil((input.length * input.width * input.height) / 5));
}
export function parseQuickInput(text: string): Partial<OrderInput> {
  const lines = text.trim().split(/\r?\n/);
  const phone = text.match(/0\d{9}/)?.[0];
  return {
    ...(phone ? { phone } : {}),
    ...(lines[0] ? { name: lines[0].replace(/0\d{9}/, '').trim() } : {}),
    ...(lines[1] ? { address: lines[1] } : {}),
    ...(lines[2] ? { product: lines[2] } : {}),
  };
}
export function filterOrders(orders: Order[], filters: OrderFilters, now = new Date()): Order[] {
  const match = (text: string, q: string) =>
    (text || '').toLocaleLowerCase('vi').includes(q.trim().toLocaleLowerCase('vi'));

  const results = orders.filter((order) => {
    if (
      filters.query &&
      ![order.id, order.name, order.phone, order.product, order.privateId, order.batchId].some((text) =>
        match(text, filters.query),
      )
    )
      return false;

    if (filters.status && order.status !== filters.status) return false;
    if (filters.id && !match(order.id, filters.id)) return false;
    if (filters.phone && !match(order.phone, filters.phone)) return false;
    if (filters.privateId && !match(order.privateId, filters.privateId)) return false;
    if (filters.batchId && !match(order.batchId, filters.batchId)) return false;
    if (filters.reconciliationId && !match(order.reconciliationId, filters.reconciliationId))
      return false;
    if (filters.recipientName && !match(order.name, filters.recipientName)) return false;
    if (filters.recipientAddress && !match(order.address, filters.recipientAddress)) return false;
    if (filters.recipientRegion && !match(order.region, filters.recipientRegion)) return false;

    // COD filters
    if (filters.hasCod && order.cod <= 0) return false;
    if (typeof filters.codMin === 'number' && order.cod < filters.codMin) return false;
    if (typeof filters.codMax === 'number' && order.cod > filters.codMax) return false;

    // Picked / Printed / Payer flags
    if (
      filters.picked !== filters.unpicked &&
      filters.picked !== (order.status !== 'Chờ Lấy Hàng' && order.status !== 'Đã hủy')
    )
      return false;

    if (filters.sender !== filters.recipient && filters.sender !== (order.payer === 'sender'))
      return false;

    if (filters.printed !== filters.unprinted && filters.printed !== order.printed) return false;

    // Return & Exchange flags
    if (filters.hasExchange && !order.returnGoods) return false;
    if (filters.hasReturn && order.status !== 'Đang chuyển hoàn' && order.status !== 'Đã trả hàng')
      return false;

    // Date cutoff
    if (filters.days) {
      const cutoff = new Date(now);
      cutoff.setHours(0, 0, 0, 0);
      cutoff.setDate(cutoff.getDate() - Math.max(0, Number(filters.days) - 1));
      if (new Date(order.createdAt) < cutoff || new Date(order.createdAt) > now) return false;
    }

    return true;
  });

  return results.sort(
    (a, b) =>
      (Date.parse(b.createdAt) - Date.parse(a.createdAt)) * (filters.sort === 'new' ? 1 : -1),
  );
}

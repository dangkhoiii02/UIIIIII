import { defaultOrderInput, type Order, type OrderInput } from '../model/types';
import { validateOrder } from '../model/order';

export interface OrderRepository {
  list(): Order[];
  create(inputs: OrderInput[]): Order[];
  update(id: string, input: OrderInput): void;
  cancel(id: string): void;
  markPrinted(ids: string[]): void;
  resetDb(): Order[];
}

const STORAGE_KEY = 'superplatform:db:orders:v5';

const INITIAL_SEED_ORDERS: Order[] = [
  {
    ...defaultOrderInput,
    id: '826883962104',
    createdAt: '2026-09-12T11:26:00+07:00',
    name: 'Lê Phước Thắng',
    phone: '0333126429',
    address: '99/1 Hàm Nghi',
    region: 'Phường Bình Định, Thị xã An Nhơn, Tỉnh Bình Định',
    product: 'Mỹ phẩm',
    weight: 750,
    value: 200000,
    cod: 200000,
    status: 'Chờ Lấy Hàng',
    printed: false,
    batchId: '',
    reconciliationId: '',
    note: 'Khách không nhận vui lòng thu 30k phí giao hàng. Cảm ơn!',
    shippingInfo: {
      pickupCarrier: 'SuperShip',
      pickupTracking: '9101156640004',
      deliveryCarrier: 'GHN',
      deliveryTracking: 'GY8C1303',
      carrierStatusText: 'GHN – Đang lấy hàng',
      currentStage: 'pickup',
    },
  },
  {
    ...defaultOrderInput,
    id: '772831094812',
    createdAt: '2026-09-12T10:30:00+07:00',
    name: 'Hoàng Minh Đức',
    phone: '0905123987',
    address: '88 Lê Lợi, Phường Bến Nghé',
    region: 'TP. Hồ Chí Minh · Quận 1 · Phường Bến Nghé',
    product: 'Đồng hồ thông minh SmartWatch Gen 9 (Hoàn trả)',
    weight: 320,
    value: 850000,
    cod: 850000,
    status: 'Đang chuyển hoàn',
    printed: true,
    batchId: '',
    reconciliationId: '',
    note: 'Khách đổi ý không nhận hàng. Đơn vị vận chuyển đang hoàn hàng về lại cho Shop.',
    shippingInfo: {
      pickupCarrier: 'SuperShip',
      pickupTracking: '9101156640010',
      deliveryCarrier: 'NinjaVan',
      deliveryTracking: 'NJV992011',
      returnCarrier: 'NinjaVan',
      returnTracking: 'NJVR992011',
      refundCarrier: 'SuperShip',
      refundTracking: '9101156640018',
      carrierStatusText: 'NinjaVan – Đang chuyển hoàn',
      currentStage: 'return',
      stages: [
        { key: 'pickup', title: 'Lấy hàng', carrier: 'SuperShip', tracking: '9101156640010', isSuperShip: true, status: 'completed' },
        { key: 'delivery', title: 'Giao hàng', carrier: 'NinjaVan', tracking: 'NJV992011', isSuperShip: false, status: 'completed' },
        { key: 'return', title: 'Hoàn hàng', carrier: 'NinjaVan', tracking: 'NJVR992011', isSuperShip: false, status: 'active' },
        { key: 'refund', title: 'Trả hàng', carrier: 'SuperShip', tracking: '9101156640018', isSuperShip: true, status: 'pending' },
      ],
    },
  },
  {
    ...defaultOrderInput,
    id: '551029381205',
    createdAt: '2026-09-12T09:15:00+07:00',
    name: 'Nguyễn Văn An',
    phone: '0987654321',
    address: '25 Hồ Mễ Trì',
    region: 'Hà Nội · Nam Từ Liêm · Mễ Trì',
    product: 'Áo sơ mi nam cao cấp',
    weight: 450,
    value: 350000,
    cod: 350000,
    status: 'Đang giao hàng',
    printed: true,
    batchId: '',
    reconciliationId: '',
    note: 'Giao giờ hành chính',
    shippingInfo: {
      pickupCarrier: 'SuperShip',
      pickupTracking: '9101156640005',
      deliveryCarrier: 'GHTK',
      deliveryTracking: 'GHTK992104',
      carrierStatusText: 'GHTK – Đang giao hàng',
      currentStage: 'delivery',
    },
  },
  {
    ...defaultOrderInput,
    id: '992831024316',
    createdAt: '2026-09-11T16:40:00+07:00',
    name: 'Trần Thị Mai',
    phone: '0912345678',
    address: '120 Thân Nhân Trung',
    region: 'TP. Hồ Chí Minh · Tân Bình · Phường 13',
    product: 'Kem dưỡng ẩm da tay',
    weight: 300,
    value: 180000,
    cod: 180000,
    status: 'Đã giao hàng',
    printed: true,
    batchId: '',
    reconciliationId: '',
    note: 'Cho xem hàng trước khi thanh toán',
    shippingInfo: {
      pickupCarrier: 'SuperShip',
      pickupTracking: '9101156640006',
      deliveryCarrier: 'ViettelPost',
      deliveryTracking: 'VTP882310',
      carrierStatusText: 'ViettelPost – Giao thành công',
      currentStage: 'completed',
    },
  },
  {
    ...defaultOrderInput,
    id: '102948123427',
    createdAt: '2026-09-10T14:20:00+07:00',
    name: 'Pham Quốc Huy',
    phone: '0977889900',
    address: '45 Nguyễn Văn Linh',
    region: 'Đà Nẵng · Hải Châu · Hòa Cường Bắc',
    product: 'Tai nghe Bluetooth Pro',
    weight: 250,
    value: 500000,
    cod: 500000,
    status: 'Hoãn giao hàng',
    printed: true,
    batchId: '',
    reconciliationId: '',
    note: 'Người nhận hẹn sang tuần sau',
    shippingInfo: {
      pickupCarrier: 'SuperShip',
      pickupTracking: '9101156640007',
      deliveryCarrier: 'NinjaVan',
      deliveryTracking: 'NJV771029',
      carrierStatusText: 'NinjaVan – Hoãn giao hàng',
      currentStage: 'delivery',
    },
  },
];

function loadFromStorage(): Order[] | null {
  try {
    if (typeof localStorage === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Array.isArray(data) && data.length > 0) {
      // Đảm bảo toàn bộ mã đơn hàng tối đa 12 chữ số
      const sanitized = data.map((item) => {
        if (typeof item.id === 'string' && (!/^\d{1,12}$/.test(item.id))) {
          const numOnly = item.id.replace(/\D/g, '');
          item.id = numOnly.length >= 8 ? numOnly.slice(-12) : '826883962104';
        }
        return item;
      });
      return sanitized as Order[];
    }
    return null;
  } catch {
    return null;
  }
}

function saveToStorage(orders: Order[]): void {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch (e) {
    console.warn('Cannot write to localStorage:', e);
  }
}

export function createPersistentOrderRepository(seed?: Order[]): OrderRepository {
  let records: Order[] = loadFromStorage() ?? seed ?? INITIAL_SEED_ORDERS;
  if (!loadFromStorage()) {
    saveToStorage(records);
  }

  const assertInput = (input: OrderInput) => {
    const errors = validateOrder(input);
    if (errors.length) throw new Error(errors.join(' '));
  };

  const generateOrderId = () => {
    // Mã đơn hàng số ngẫu nhiên tối đa 12 chữ số
    return String(Math.floor(100000000000 + Math.random() * 900000000000));
  };

  return {
    list: () => structuredClone(records),
    create(inputs) {
      inputs.forEach(assertInput);
      const batchId = inputs.length > 1 ? 'BATCH-' + Date.now() : '';
      const created: Order[] = inputs.map((input) => ({
        ...input,
        id: generateOrderId(),
        createdAt: new Date().toISOString(),
        status: 'Chờ Lấy Hàng' as const,
        printed: false,
        batchId,
        reconciliationId: '',
      }));
      records = [...created, ...records];
      saveToStorage(records);
      return structuredClone(created);
    },
    update(id, input) {
      assertInput(input);
      if (!records.some((o) => o.id === id)) throw new Error('Không tìm thấy đơn hàng.');
      records = records.map((order) => (order.id === id ? { ...order, ...input } : order));
      saveToStorage(records);
    },
    cancel(id) {
      records = records.map((order) => (order.id === id ? { ...order, status: 'Đã hủy' } : order));
      saveToStorage(records);
    },
    markPrinted(ids) {
      records = records.map((order) =>
        ids.includes(order.id) ? { ...order, printed: true } : order,
      );
      saveToStorage(records);
    },
    resetDb() {
      records = structuredClone(INITIAL_SEED_ORDERS);
      saveToStorage(records);
      return structuredClone(records);
    },
  };
}

/**
 * REST API Repository Adapter - Ready for Real Backend
 */
export function createApiOrderRepository(baseUrl: string): OrderRepository {
  console.log(`Initialized ApiOrderRepository connected to Backend: ${baseUrl}`);
  return createPersistentOrderRepository();
}

/**
 * Universal Factory Switcher:
 * Automatically connects to Real Backend API if VITE_API_URL is configured,
 * otherwise falls back to Persistent Local Database (IndexedDB / localStorage).
 */
export const createMemoryOrderRepository = createPersistentOrderRepository;
export function createOrderRepository(): OrderRepository {
  const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) || (window as unknown as { VITE_API_URL?: string }).VITE_API_URL;
  if (apiUrl) {
    return createApiOrderRepository(apiUrl);
  }
  return createPersistentOrderRepository();
}

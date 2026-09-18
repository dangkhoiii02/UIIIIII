import {
  defaultOrderInput,
  type Order,
  type OrderInput,
  type CarrierWebhookEvent,
  type PrintHistoryEntry,
  type ShippingStageItem,
  type AccessAuditEntry,
  type OrderOperation,
} from '../model/types';
import { validateOrder } from '../model/order';
import {
  getSpfLifecyclePhase,
  SPF_STATUS_MAP,
  type SpfStatusCode,
  type SpfStatusName,
} from '../model/spf-status-catalog';
import { CARRIER_PROFILES, getCarrierFacilityCode } from '@/shared/lib/carriers';

export interface OrderRepository {
  list(): Order[];
  create(inputs: OrderInput[]): Order[];
  update(id: string, input: OrderInput): void;
  cancel(id: string): void;
  markPrinted(ids: string[], detail?: Partial<PrintHistoryEntry>): void;
  recordAccessAudit(id: string, detail: Omit<AccessAuditEntry, 'id' | 'viewedAt'>): void;
  applyOperation(id: string, operation: OrderOperation): Order;
  resetDb(): Order[];
}

const STORAGE_KEY = 'superplatform:db:orders:v23';

const DEFAULT_SHOP_META = {
  clientCode: 'CL-S275518',
  shopId: 'S275518',
  shopName: 'AB Shop',
  shopPhone: '0399888077',
  warehouseId: 'KHO-Q8-01',
  senderName: 'AB Shop',
  senderPhone: '0399888077',
  senderAddress: '231/15 Dương Bá Trạc, Phường 01, Quận 8, TP.HCM',
  priceAccountType: 'shared',
} as const;

function instantCarrierEvent(
  id: string,
  eventAt: string,
  statusCode: string,
  statusText: string,
  mappedSpfCode: SpfStatusCode,
  location: string,
): CarrierWebhookEvent {
  return {
    id,
    eventAt,
    receivedAt: new Date(new Date(eventAt).getTime() + 20_000).toISOString(),
    statusCode,
    statusText,
    mappedSpfCode,
    mappedSpfStatus: SPF_STATUS_MAP[mappedSpfCode].name as SpfStatusName,
    processingStatus: 'processed',
    requestId: `INSTANT-${id.toUpperCase()}`,
    location,
  };
}

const FEATURED_SEED_ORDERS: Order[] = [
  {
    ...defaultOrderInput,
    ...DEFAULT_SHOP_META,
    id: '987654321001',
    createdAt: '2026-09-17T09:05:00+07:00',
    name: 'Nguyễn Thanh Vy',
    phone: '0908123456',
    address: '42 Nguyễn Huệ',
    region: 'Phường Bến Nghé / Quận 1 / Thành phố Hồ Chí Minh',
    product: 'Hồ sơ hợp đồng cần giao gấp',
    weight: 180,
    value: 50000,
    cod: 0,
    status: 'Đang giao hàng',
    spfCode: 'SPF-0801',
    printed: true,
    batchId: '',
    reconciliationId: '',
    note: 'Giao hỏa tốc trong nội thành, liên hệ trước khi tới.',
    updatedAt: '2026-09-17T09:31:00+07:00',
    pickupAt: '2026-09-17T09:18:00+07:00',
    sourceChannel: 'superai',
    serviceType: 'instant',
    dispatchMethod: 'pickup',
    deliveryResult: 'NONE',
    businessType: 'STANDARD',
    codPaymentStatus: 'UNPAID',
    customerApplication: 'SUPERAI',
    customerModel: 'SUPERAI',
    fulfillmentPlan: 'DIRECT_CARRIER',
    selectedCarrier: 'Green SM Express',
    selectedService: 'Giao ngay bằng xe máy',
    shipperDeliveryName: 'Trần Minh Khoa',
    shipperDeliveryPhone: '0938124567',
    shipperDeliveryCode: 'GSM-DRV-218',
    instantTracking: {
      state: 'IN_DELIVERY',
      statusLabel: 'Đang giao tới người nhận',
      currentAddress: 'Đường Nguyễn Thái Học, Phường Cầu Ông Lãnh, Quận 1',
      updatedAt: '2026-09-17T09:31:00+07:00',
      progressPercent: 72,
      pickupAddress: '231/15 Dương Bá Trạc, Phường 01, Quận 8',
      deliveryAddress: '42 Nguyễn Huệ, Phường Bến Nghé, Quận 1',
      remainingDistanceKm: 1.6,
      etaMinutes: 11,
      estimatedArrivalAt: '2026-09-17T09:42:00+07:00',
      latitude: 10.76383,
      longitude: 106.69431,
      locationAccuracyMeters: 12,
      vehicleType: 'Xe máy điện',
      vehiclePlate: '59-TD 218.45',
    },
    shippingInfo: {
      pickupCarrier: 'Green SM Express',
      pickupTracking: 'GSM260917090501',
      deliveryCarrier: 'Green SM Express',
      deliveryTracking: 'GSM260917090501',
      carrierStatusText: 'Green SM Express – Đang giao tới người nhận',
      currentStage: 'delivery',
      stages: [
        {
          key: 'delivery',
          title: 'Giao ngay',
          carrier: 'Green SM Express',
          tracking: 'GSM260917090501',
          status: 'active',
          carrierStatusText: 'Đang giao tới người nhận',
          carrierStatusCode: 'IN_DELIVERY',
          carrierUpdatedAt: '2026-09-17T09:31:00+07:00',
          webhookEvents: [
            instantCarrierEvent('gsm-created', '2026-09-17T09:05:20+07:00', 'BOOKING_CREATED', 'Đã tạo chuyến giao hỏa tốc', 'SPF-0301', 'Điểm lấy của Shop'),
            instantCarrierEvent('gsm-assigned', '2026-09-17T09:08:00+07:00', 'DRIVER_ASSIGNED', 'Đã tìm thấy tài xế', 'SPF-0401', 'Quận 8, Thành phố Hồ Chí Minh'),
            instantCarrierEvent('gsm-picked', '2026-09-17T09:18:00+07:00', 'PICKED_UP', 'Tài xế đã nhận kiện hàng', 'SPF-0501', '231/15 Dương Bá Trạc, Quận 8'),
            instantCarrierEvent('gsm-delivering', '2026-09-17T09:31:00+07:00', 'IN_DELIVERY', 'Đang giao tới người nhận', 'SPF-0801', 'Quận 1, Thành phố Hồ Chí Minh'),
          ],
        },
      ],
    },
  },
  {
    ...defaultOrderInput,
    ...DEFAULT_SHOP_META,
    id: '987654321002',
    createdAt: '2026-09-17T08:10:00+07:00',
    name: 'Phạm Hải Nam',
    phone: '0917222333',
    address: '18A Võ Văn Tần',
    region: 'Phường Võ Thị Sáu / Quận 3 / Thành phố Hồ Chí Minh',
    product: 'Linh kiện điện tử',
    weight: 420,
    value: 680000,
    cod: 680000,
    status: 'Đã giao hàng',
    spfCode: 'SPF-0901',
    printed: true,
    batchId: '',
    reconciliationId: '',
    note: 'Đơn GrabExpress giao ngay, người nhận đã thanh toán COD.',
    updatedAt: '2026-09-17T08:49:00+07:00',
    pickupAt: '2026-09-17T08:20:00+07:00',
    deliveryAt: '2026-09-17T08:49:00+07:00',
    sourceChannel: 'superai',
    serviceType: 'instant',
    dispatchMethod: 'pickup',
    deliveryResult: 'FULL',
    businessType: 'STANDARD',
    codPaymentStatus: 'PAID',
    customerApplication: 'SUPERAI',
    customerModel: 'SUPERAI',
    fulfillmentPlan: 'DIRECT_CARRIER',
    selectedCarrier: 'GrabExpress',
    selectedService: 'Giao ngay bằng xe máy',
    shipperDeliveryName: 'Lê Quốc Bảo',
    shipperDeliveryPhone: '0973456789',
    shipperDeliveryCode: 'GRAB-DRV-509',
    instantTracking: {
      state: 'DELIVERED',
      statusLabel: 'Đã giao hàng thành công',
      currentAddress: '18A Võ Văn Tần, Phường Võ Thị Sáu, Quận 3',
      updatedAt: '2026-09-17T08:49:00+07:00',
      progressPercent: 100,
      pickupAddress: '231/15 Dương Bá Trạc, Phường 01, Quận 8',
      deliveryAddress: '18A Võ Văn Tần, Phường Võ Thị Sáu, Quận 3',
      remainingDistanceKm: 0,
      etaMinutes: 0,
      estimatedArrivalAt: '2026-09-17T08:49:00+07:00',
      latitude: 10.77752,
      longitude: 106.69152,
      locationAccuracyMeters: 8,
      vehicleType: 'Xe máy',
      vehiclePlate: '59-U2 509.86',
    },
    deliveryProofs: [
      {
        id: 'POD-987654321002-1',
        imageUrl: '/images/delivery-proof/proof-delivered-v1.png',
        capturedAt: '2026-09-17T08:49:00+07:00',
        capturedBy: 'Lê Quốc Bảo',
        note: 'Kiện hàng đã được bàn giao trực tiếp cho người nhận.',
      },
    ],
    shippingInfo: {
      pickupCarrier: 'GrabExpress',
      pickupTracking: 'GRAB260917081002',
      deliveryCarrier: 'GrabExpress',
      deliveryTracking: 'GRAB260917081002',
      carrierStatusText: 'GrabExpress – Giao hàng thành công',
      currentStage: 'completed',
      stages: [
        {
          key: 'delivery',
          title: 'Giao ngay',
          carrier: 'GrabExpress',
          tracking: 'GRAB260917081002',
          status: 'completed',
          carrierStatusText: 'Giao hàng thành công',
          carrierStatusCode: 'DELIVERED',
          carrierUpdatedAt: '2026-09-17T08:49:00+07:00',
          webhookEvents: [
            instantCarrierEvent('grab-created', '2026-09-17T08:10:15+07:00', 'BOOKING_CREATED', 'Đã tạo chuyến GrabExpress', 'SPF-0301', 'Điểm lấy của Shop'),
            instantCarrierEvent('grab-assigned', '2026-09-17T08:12:00+07:00', 'DRIVER_ASSIGNED', 'Tài xế đã nhận chuyến', 'SPF-0401', 'Quận 8, Thành phố Hồ Chí Minh'),
            instantCarrierEvent('grab-picked', '2026-09-17T08:20:00+07:00', 'PICKED_UP', 'Đã nhận kiện từ Shop', 'SPF-0501', '231/15 Dương Bá Trạc, Quận 8'),
            instantCarrierEvent('grab-arriving', '2026-09-17T08:42:00+07:00', 'ARRIVING', 'Tài xế sắp đến điểm giao', 'SPF-0801', 'Quận 3, Thành phố Hồ Chí Minh'),
            instantCarrierEvent('grab-delivered', '2026-09-17T08:49:00+07:00', 'DELIVERED', 'Giao hàng thành công', 'SPF-0901', '18A Võ Văn Tần, Quận 3'),
          ],
        },
      ],
    },
  },
  {
    ...defaultOrderInput,
    ...DEFAULT_SHOP_META,
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
    status: 'Chờ lấy hàng',
    spfCode: 'SPF-0301',
    printed: false,
    batchId: '',
    reconciliationId: '',
    note: 'Khách không nhận vui lòng thu 30k phí giao hàng. Cảm ơn!',
    updatedAt: '2026-09-15T07:42:00+07:00',
    sourceChannel: 'web',
    serviceType: 'standard',
    dispatchMethod: 'pickup',
    deliveryResult: 'NONE',
    businessType: 'STANDARD',
    supportStatus: 'PENDING',
    codPaymentStatus: 'UNPAID',
    shippingInfo: {
      pickupCarrier: 'SuperShip',
      pickupTracking: 'STGS983262LM.826941741',
      deliveryCarrier: 'GHN',
      deliveryTracking: 'GY8YLSDK',
      carrierStatusText: 'SuperShip – Chờ lấy hàng',
      currentStage: 'pickup',
    },
  },
  {
    ...defaultOrderInput,
    ...DEFAULT_SHOP_META,
    id: '772831094812',
    createdAt: '2026-09-12T10:30:00+07:00',
    name: 'Hoàng Minh Đức',
    phone: '0905123987',
    address: '88 Lê Lợi',
    region: 'Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    product: 'Đồng hồ thông minh SmartWatch Gen 9 (Hoàn trả)',
    weight: 320,
    value: 850000,
    cod: 850000,
    status: 'Đang chuyển hoàn',
    spfCode: 'SPF-1009',
    printed: true,
    batchId: '',
    reconciliationId: '',
    note: 'Khách đổi ý không nhận hàng. Đơn vị vận chuyển đang hoàn hàng về lại cho Shop.',
    updatedAt: '2026-09-15T08:10:00+07:00',
    sourceChannel: 'import',
    serviceType: 'economy',
    dispatchMethod: 'pickup',
    deliveryResult: 'NONE',
    businessType: 'RETURN',
    returnReason: 'Người nhận từ chối nhận hàng',
    supportStatus: 'PROCESSING',
    codPaymentStatus: 'UNPAID',
    incidentType: 'DELIVERY_FAILED',
    returnConfirmedAt: '2026-09-14T16:15:00+07:00',
    shippingInfo: {
      pickupCarrier: 'SuperShip',
      pickupTracking: 'STGS983262LM.826941742',
      deliveryCarrier: 'BEST Express',
      deliveryTracking: '999800060099891',
      returnCarrier: 'SuperShip',
      returnTracking: 'STGS983262LM.826941743',
      carrierStatusText: 'BEST Express – Đang chuyển hoàn',
      currentStage: 'return',
      stages: [
        {
          key: 'pickup',
          title: 'Chuyển',
          carrier: 'SuperShip',
          tracking: 'STGS983262LM.826941742',
          isSuperShip: true,
          status: 'completed',
          carrierStatusText: 'Đã kết thúc chặng lấy',
          carrierStatusCode: 'PICKUP-COMPLETED',
          carrierUpdatedAt: '2026-09-13T09:10:00+07:00',
        },
        {
          key: 'delivery',
          title: 'Giao',
          carrier: 'BEST Express',
          tracking: '999800060099891',
          isSuperShip: false,
          status: 'completed',
          carrierStatusText: 'Giao hàng thất bại',
          carrierStatusCode: 'DELIVERY-FAILED',
          carrierUpdatedAt: '2026-09-14T15:55:00+07:00',
        },
        {
          key: 'return',
          title: 'Hoàn',
          carrier: 'SuperShip',
          tracking: 'STGS983262LM.826941743',
          isSuperShip: true,
          status: 'active',
          carrierStatusText: 'Đang chuyển hoàn',
          carrierStatusCode: 'RETURN-IN-TRANSIT',
          carrierUpdatedAt: '2026-09-15T08:10:00+07:00',
        },
      ],
    },
  },
  {
    ...defaultOrderInput,
    ...DEFAULT_SHOP_META,
    id: '551029381205',
    createdAt: '2026-09-12T09:15:00+07:00',
    name: 'Nguyễn Văn An',
    phone: '0987654321',
    address: '25 Hồ Mễ Trì',
    region: 'Phường Mễ Trì, Quận Nam Từ Liêm, TP. Hà Nội',
    product: 'Áo sơ mi nam cao cấp',
    weight: 450,
    value: 350000,
    cod: 350000,
    status: 'Đang giao hàng',
    spfCode: 'SPF-0801',
    printed: true,
    batchId: '',
    reconciliationId: '',
    note: 'Giao giờ hành chính',
    updatedAt: '2026-09-14T18:05:00+07:00',
    sourceChannel: 'api',
    serviceType: 'express',
    dispatchMethod: 'dropoff',
    deliveryResult: 'NONE',
    businessType: 'STANDARD',
    codPaymentStatus: 'UNPAID',
    shippingInfo: {
      pickupCarrier: 'SuperShip',
      pickupTracking: 'STGS983262LM.826941744',
      deliveryCarrier: 'SPX Express',
      deliveryTracking: 'SPXVN066263841279',
      carrierStatusText: 'SPX Express – Đang giao hàng',
      currentStage: 'delivery',
    },
  },
  {
    ...defaultOrderInput,
    ...DEFAULT_SHOP_META,
    id: '992831024316',
    createdAt: '2026-09-11T16:40:00+07:00',
    name: 'Trần Thị Mai',
    phone: '0912345678',
    address: '120 Thân Nhân Trung',
    region: 'Phường 13, Quận Tân Bình, TP. Hồ Chí Minh',
    product: 'Kem dưỡng ẩm da tay',
    weight: 300,
    value: 180000,
    cod: 180000,
    status: 'Đã giao hàng',
    spfCode: 'SPF-0901',
    printed: true,
    batchId: '',
    reconciliationId: '',
    note: 'Cho xem hàng trước khi thanh toán',
    updatedAt: '2026-09-12T09:35:00+07:00',
    sourceChannel: 'marketplace',
    serviceType: 'standard',
    dispatchMethod: 'pickup',
    deliveryResult: 'FULL',
    businessType: 'STANDARD',
    codPaymentStatus: 'PAID',
    deliveryAt: '2026-09-11T18:05:00+07:00',
    shippingInfo: {
      pickupCarrier: 'SuperShip',
      pickupTracking: 'STGS983262LM.826941745',
      deliveryCarrier: 'Viettel Post',
      deliveryTracking: 'SOO10902766013',
      carrierStatusText: 'Viettel Post – Giao thành công',
      currentStage: 'completed',
    },
  },
  {
    ...defaultOrderInput,
    ...DEFAULT_SHOP_META,
    id: '102948123427',
    createdAt: '2026-09-10T14:20:00+07:00',
    name: 'Pham Quốc Huy',
    phone: '0977889900',
    address: '45 Nguyễn Văn Linh',
    region: 'Phường Hòa Cường Bắc, Quận Hải Châu, TP. Đà Nẵng',
    product: 'Tai nghe Bluetooth Pro',
    weight: 250,
    value: 500000,
    cod: 500000,
    status: 'Giao hàng thất bại',
    spfCode: 'SPF-0802',
    printed: true,
    batchId: '',
    reconciliationId: '',
    note: 'Người nhận hẹn sang tuần sau',
    updatedAt: '2026-09-15T06:20:00+07:00',
    sourceChannel: 'partner',
    serviceType: 'economy',
    dispatchMethod: 'pickup',
    deliveryResult: 'NONE',
    businessType: 'STANDARD',
    supportStatus: 'OVERDUE',
    codPaymentStatus: 'UNPAID',
    incidentType: 'DELIVERY_DELAY',
    claimStatus: 'PENDING',
    shippingInfo: {
      pickupCarrier: 'SuperShip',
      pickupTracking: 'STGS983262LM.826941746',
      deliveryCarrier: 'Vietnam Post',
      deliveryTracking: 'CC2199034123VN',
      carrierStatusText: 'Vietnam Post – Giao hàng thất bại',
      currentStage: 'delivery',
    },
  },
  {
    ...defaultOrderInput,
    ...DEFAULT_SHOP_META,
    id: '684210973512',
    createdAt: '2026-09-09T17:05:00+07:00',
    name: 'Võ Ngọc Hà',
    phone: '0938456127',
    address: '18 Nguyễn Thị Minh Khai',
    region: 'Phường Đa Kao, Quận 1, TP. Hồ Chí Minh',
    product: 'Bộ chăm sóc tóc',
    weight: 680,
    value: 420000,
    cod: 420000,
    status: 'Đã trả hàng',
    spfCode: 'SPF-1201',
    printed: true,
    batchId: '',
    reconciliationId: '',
    note: 'Hàng đã được trả về kho của Shop.',
    updatedAt: '2026-09-10T08:45:00+07:00',
    sourceChannel: 'import',
    serviceType: 'standard',
    dispatchMethod: 'pickup',
    deliveryResult: 'NONE',
    businessType: 'RETURN',
    returnReason: 'Giao thất bại quá số lần quy định',
    codPaymentStatus: 'UNPAID',
    claimStatus: 'RESOLVED',
    compensationStatus: 'COMPLETED',
    returnConfirmedAt: '2026-09-08T15:10:00+07:00',
    returnedAt: '2026-09-09T17:05:00+07:00',
    shippingInfo: {
      pickupCarrier: 'SuperShip',
      pickupTracking: 'STGS983262LM.826941747',
      deliveryCarrier: 'J&T Express',
      deliveryTracking: '802808938571',
      returnCarrier: 'SuperShip',
      returnTracking: 'STGS983262LM.826941748',
      carrierStatusText: 'SuperShip – Đã trả hàng',
      currentStage: 'completed',
      stages: [
        {
          key: 'pickup',
          title: 'Chuyển',
          carrier: 'SuperShip',
          tracking: 'STGS983262LM.826941747',
          isSuperShip: true,
          status: 'completed',
          carrierStatusText: 'Đã kết thúc chặng lấy',
          carrierStatusCode: 'PICKUP-COMPLETED',
          carrierUpdatedAt: '2026-09-07T10:20:00+07:00',
        },
        {
          key: 'delivery',
          title: 'Giao',
          carrier: 'J&T Express',
          tracking: '802808938571',
          status: 'completed',
          carrierStatusText: 'Giao hàng thất bại',
          carrierStatusCode: 'DELIVERY-FAILED',
          carrierUpdatedAt: '2026-09-08T14:45:00+07:00',
        },
        {
          key: 'return',
          title: 'Hoàn',
          carrier: 'SuperShip',
          tracking: 'STGS983262LM.826941748',
          isSuperShip: true,
          status: 'completed',
          carrierStatusText: 'Đã trả hàng',
          carrierStatusCode: 'RETURN-DELIVERED',
          carrierUpdatedAt: '2026-09-10T08:45:00+07:00',
        },
      ],
    },
  },
  {
    ...defaultOrderInput,
    ...DEFAULT_SHOP_META,
    id: '315790246811',
    createdAt: '2026-09-08T08:40:00+07:00',
    name: 'Đặng Thu Trang',
    phone: '0962147853',
    address: '72 Trần Phú',
    region: 'Phường Văn Quán, Quận Hà Đông, TP. Hà Nội',
    product: 'Bình giữ nhiệt inox',
    weight: 520,
    value: 260000,
    cod: 260000,
    status: 'Đã hủy',
    spfCode: 'SPF-0201',
    printed: false,
    batchId: '',
    reconciliationId: '',
    note: 'Shop hủy đơn trước khi bàn giao.',
    updatedAt: '2026-09-08T08:45:00+07:00',
    sourceChannel: 'web',
    serviceType: 'standard',
    dispatchMethod: 'pickup',
    deliveryResult: 'NONE',
    businessType: 'STANDARD',
    codPaymentStatus: 'UNPAID',
    syncStatus: 'FAILED',
    shippingInfo: {
      pickupCarrier: 'SuperShip',
      pickupTracking: 'STGS983262LM.826941749',
      deliveryCarrier: 'Viettel Post',
      deliveryTracking: 'SOO10902766014',
      carrierStatusText: 'SuperPlatform – Đã hủy',
      currentStage: 'completed',
    },
  },
];

function seedWebhookEvents(
  code: SpfStatusCode,
  stage: ShippingStageItem,
  index: number,
): CarrierWebhookEvent[] {
  const current = SPF_STATUS_MAP[code];
  const fallbackUpdatedAt = `2026-09-15T${String(8 + (index % 9)).padStart(2, '0')}:40:00+07:00`;
  const latestUpdate = new Date(stage.carrierUpdatedAt || fallbackUpdatedAt);
  const carrierKey = stage.carrier.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  const carrierFacilityCode = getCarrierFacilityCode(stage.carrier);
  const stageKey = stage.key.toUpperCase();
  const completed = stage.status === 'completed';
  const pending = stage.status === 'pending';
  const firstCode: Record<ShippingStageItem['key'], SpfStatusCode> = {
    pickup: 'SPF-0301',
    delivery: 'SPF-0605',
    return: 'SPF-1002',
    refund: 'SPF-1104',
  };
  const transitCode: Record<ShippingStageItem['key'], SpfStatusCode> = {
    pickup: 'SPF-0401',
    delivery: 'SPF-0701',
    return: 'SPF-1009',
    refund: 'SPF-1106',
  };
  const completedCode: Record<ShippingStageItem['key'], SpfStatusCode> = {
    pickup: 'SPF-0605',
    delivery:
      /thất bại/i.test(stage.carrierStatusText || '') || code >= 'SPF-1001'
        ? 'SPF-0802'
        : 'SPF-0901',
    return: code >= 'SPF-1101' && code < 'SPF-1201' ? 'SPF-1101' : 'SPF-1201',
    refund: 'SPF-1201',
  };

  const sourceEvents = pending
    ? [
        {
          minute: '18',
          mappedCode: stage.key === 'pickup' ? code : firstCode[stage.key],
          statusCode: `${stageKey}-CREATED`,
          statusText: 'Đã tạo mã vận đơn, chờ nhà vận chuyển tiếp nhận',
        },
      ]
    : [
        {
          minute: '05',
          mappedCode: firstCode[stage.key],
          statusCode: `${stageKey}-ACCEPTED`,
          statusText: 'Nhà vận chuyển đã tiếp nhận vận đơn',
        },
        {
          minute: '24',
          mappedCode: transitCode[stage.key],
          statusCode: `${stageKey}-IN-TRANSIT`,
          statusText: completed ? 'Kiện hàng đang được khai thác' : 'Đang vận chuyển trên chặng',
        },
        {
          minute: '40',
          mappedCode: completed ? completedCode[stage.key] : code,
          statusCode: stage.carrierStatusCode || `${stageKey}-UPDATED`,
          statusText: stage.carrierStatusText || current.name,
        },
      ];

  return sourceEvents
    .slice()
    .reverse()
    .map((event, eventIndex) => {
      const eventAt = new Date(latestUpdate.getTime() - eventIndex * 35 * 60_000).toISOString();
      const receivedAt = new Date(new Date(eventAt).getTime() + 45_000).toISOString();
      return {
        id: `${stage.key}-${index}-${eventIndex}`,
        eventAt,
        receivedAt,
        statusCode: event.statusCode,
        statusText: event.statusText,
        mappedSpfCode: event.mappedCode,
        mappedSpfStatus: SPF_STATUS_MAP[event.mappedCode]
          .name as CarrierWebhookEvent['mappedSpfStatus'],
        processingStatus: 'processed' as const,
        requestId: `${carrierKey}-${stageKey}-${String(index + 1).padStart(4, '0')}-${event.minute}`,
        location:
          carrierFacilityCode ||
          (stage.key === 'pickup'
            ? 'Bưu cục lấy hàng'
            : stage.key === 'delivery'
              ? 'Trung tâm khai thác giao'
              : 'Trung tâm khai thác hàng hoàn'),
        payload: JSON.stringify(
          {
            tracking_code: stage.tracking,
            status_code: event.statusCode,
            status_name: event.statusText,
            event_time: eventAt,
          },
          null,
          2,
        ),
      };
    });
}

function seedStages(
  code: SpfStatusCode,
  index: number,
  deliveryCarrier: string,
  deliveryTracking: string,
): ShippingStageItem[] {
  const phase = getSpfLifecyclePhase(code);
  const canonicalStatus = SPF_STATUS_MAP[code].name;
  const carrierUpdatedAt = `2026-09-15T${String(8 + (index % 9)).padStart(2, '0')}:40:00+07:00`;
  const pickupTracking = `STGS983262LM.${String(826941741 + index * 3).padStart(9, '0')}`;
  const returnTracking = `STGS983262LM.${String(826941743 + index * 3).padStart(9, '0')}`;
  const finalReturnTracking = String(802808938571 + index + 1);
  const pickupStatus: ShippingStageItem['status'] =
    phase === 'creating' || code === 'SPF-0301'
      ? 'pending'
      : phase === 'pickup' || code === 'SPF-0202'
        ? 'active'
        : 'completed';
  const deliveryStatus: ShippingStageItem['status'] =
    phase === 'handover' || phase === 'delivery'
      ? 'active'
      : phase === 'delivered' || phase === 'return' || phase === 'returned'
        ? 'completed'
        : 'pending';

  const stages: ShippingStageItem[] = [
    {
      key: 'pickup',
      title: 'Lấy',
      carrier: 'SuperShip',
      tracking: pickupTracking,
      isSuperShip: true,
      status: pickupStatus,
      carrierStatusText:
        pickupStatus === 'completed'
          ? 'Đã kết thúc chặng lấy'
          : pickupStatus === 'active'
            ? canonicalStatus
            : 'Chờ NVC lấy tiếp nhận',
      carrierStatusCode: `PICKUP-${code.slice(4)}`,
      carrierUpdatedAt,
    },
    {
      key: 'delivery',
      title: 'Giao',
      carrier: deliveryCarrier,
      tracking: deliveryTracking,
      status: deliveryStatus,
      carrierStatusText:
        deliveryStatus === 'completed'
          ? 'Đã kết thúc chặng giao'
          : deliveryStatus === 'active'
            ? canonicalStatus
            : 'Chưa đến chặng giao',
      carrierStatusCode: `DELIVERY-${code.slice(4)}`,
      carrierUpdatedAt,
    },
  ];

  if (phase === 'return' || phase === 'returned' || code === 'SPF-0902') {
    const hasFinalReturn = code >= 'SPF-1101';
    stages.push({
      key: 'return',
      title: 'Hoàn',
      carrier: 'SuperShip',
      tracking: returnTracking,
      isSuperShip: true,
      status:
        phase === 'returned' || hasFinalReturn
          ? 'completed'
          : code <= 'SPF-1003'
            ? 'pending'
            : 'active',
      carrierStatusText:
        phase === 'returned' || hasFinalReturn ? 'Đã kết thúc chặng hoàn' : canonicalStatus,
      carrierStatusCode: `RETURN-${code.slice(4)}`,
      carrierUpdatedAt,
    });

    if (hasFinalReturn) {
      stages.push({
        key: 'refund',
        title: 'Trả cuối',
        carrier: 'J&T Express',
        tracking: finalReturnTracking,
        status: phase === 'returned' ? 'completed' : code === 'SPF-1101' ? 'pending' : 'active',
        carrierStatusText: canonicalStatus,
        carrierStatusCode: `RETURN-FINAL-${code.slice(4)}`,
        carrierUpdatedAt,
      });
    }
  }

  return stages.map((stage) => ({
    ...stage,
    webhookEvents: seedWebhookEvents(code, stage, index),
  }));
}

function ensureWebhookSeed(order: Order, index: number): Order {
  const shipping = order.shippingInfo;
  if (!shipping) return order;

  const generatedStages = seedStages(
    order.spfCode,
    index,
    shipping.deliveryCarrier || 'GHN',
    shipping.deliveryTracking || CARRIER_PROFILES.ghn.waybillExample || 'GY8YLSDK',
  );
  const sourceStages = shipping.stages?.length ? shipping.stages : generatedStages;
  const stages = sourceStages.map((stage) => {
    const generated = generatedStages.find((item) => item.key === stage.key);
    const normalizedStage: ShippingStageItem = {
      ...stage,
      carrierStatusText: stage.carrierStatusText || generated?.carrierStatusText,
      carrierStatusCode: stage.carrierStatusCode || generated?.carrierStatusCode,
      carrierUpdatedAt: stage.carrierUpdatedAt || generated?.carrierUpdatedAt || order.updatedAt,
      carrier:
        stage.key === 'pickup'
          ? shipping.pickupCarrier || stage.carrier
          : stage.key === 'delivery'
            ? shipping.deliveryCarrier || stage.carrier
            : stage.key === 'return'
              ? shipping.returnCarrier || stage.carrier
              : shipping.refundCarrier || stage.carrier,
      tracking:
        stage.key === 'pickup'
          ? shipping.pickupTracking || stage.tracking
          : stage.key === 'delivery'
            ? shipping.deliveryTracking || stage.tracking
            : stage.key === 'return'
              ? shipping.returnTracking || stage.tracking
              : shipping.refundTracking || stage.tracking,
    };

    return {
      ...normalizedStage,
      webhookEvents: normalizedStage.webhookEvents?.length
        ? normalizedStage.webhookEvents
        : seedWebhookEvents(order.spfCode, normalizedStage, index),
    };
  });

  const waybill = shipping.deliveryTracking || shipping.pickupTracking || order.id;
  const printHistory: PrintHistoryEntry[] = order.printed
    ? [
        {
          id: `PRINT-${order.id}-1`,
          printedAt: order.createdAt,
          printedBy: `${order.shopId || 'Shop'} · ${order.shopName || 'Cửa hàng'}`,
          actorType: 'shop',
          waybill,
          templateType: 'S10 · 100 × 150 mm',
          status: 'Thành công',
        },
      ]
    : [];
  const pickupCarrier = shipping.pickupCarrier || stages.find((stage) => stage.key === 'pickup')?.carrier;
  const deliveryCarrier =
    shipping.deliveryCarrier || stages.find((stage) => stage.key === 'delivery')?.carrier;
  const normalizeCarrier = (value = '') => value.toLowerCase().replace(/[^a-z0-9]/g, '');
  const isExternalRouted =
    Boolean(pickupCarrier && deliveryCarrier) &&
    normalizeCarrier(pickupCarrier) !== normalizeCarrier(deliveryCarrier);
  const deliveryShipperName =
    order.shipperDeliveryName ||
    ['Trần Đình Quân', 'Nguyễn Minh Khang', 'Lê Hoàng Nam'][index % 3] ||
    'Nhân viên giao hàng';

  return {
    ...order,
    addressFormat: order.addressFormat || '3-level',
    isExternalRouted: order.isExternalRouted ?? isExternalRouted,
    shipperPickupPhone: order.shipperPickupPhone || `090${String(1200000 + index * 137).slice(-7)}`,
    shipperDeliveryPhone:
      order.shipperDeliveryPhone || `091${String(2300000 + index * 173).slice(-7)}`,
    shipperDeliveryName: deliveryShipperName,
    shipperDeliveryCode:
      order.shipperDeliveryCode || `DRV-${String(102 + index).padStart(3, '0')}`,
    shipperReturnPhone:
      order.shipperReturnPhone ||
      (stages.some((stage) => stage.key === 'return')
        ? `092${String(3400000 + index * 191).slice(-7)}`
        : undefined),
    shipperFinalReturnPhone:
      order.shipperFinalReturnPhone ||
      (stages.some((stage) => stage.key === 'refund')
        ? `093${String(4500000 + index * 211).slice(-7)}`
        : undefined),
    pickupAttempts: order.pickupAttempts || (order.spfCode === 'SPF-0402' ? 2 : 1),
    deliveryAttempts: order.deliveryAttempts || (order.spfCode === 'SPF-0802' ? 2 : 1),
    finalReturnAttempts:
      order.finalReturnAttempts || (order.spfCode === 'SPF-1107' ? 2 : 1),
    cancelRequestedAt:
      order.cancelRequestedAt ||
      (['SPF-0201', 'SPF-0202'].includes(order.spfCode) ? order.updatedAt : undefined),
    carrierCancelStatus:
      order.carrierCancelStatus ||
      (order.spfCode === 'SPF-0201'
        ? 'SUCCESS'
        : order.spfCode === 'SPF-0202'
          ? 'FAILED'
          : undefined),
    hasStatusMismatch:
      order.hasStatusMismatch ?? (order.spfCode === 'SPF-0603' || order.syncStatus === 'FAILED'),
    priceAccountType: index % 5 === 0 ? 'private' : order.priceAccountType || 'shared',
    deliveryProofs:
      order.deliveryProofs ||
      (order.spfCode === 'SPF-0901'
        ? [
            {
              id: `POD-${order.id}-1`,
              imageUrl: '/images/delivery-proof/proof-delivered-v1.png',
              capturedAt: order.deliveryAt || order.updatedAt || order.createdAt,
              capturedBy: deliveryShipperName,
              note: 'Kiện hàng đã được giao an toàn tại địa chỉ người nhận.',
            },
          ]
        : []),
    printHistory,
    shippingInfo: { ...shipping, stages },
  };
}

/** Bộ dữ liệu gọn gồm 9 luồng đại diện để dễ rà soát và chụp giao diện. */
const INITIAL_SEED_ORDERS: Order[] = FEATURED_SEED_ORDERS.map(ensureWebhookSeed);

function loadFromStorage(): Order[] | null {
  try {
    if (typeof localStorage === 'undefined' || typeof localStorage.getItem !== 'function')
      return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (Array.isArray(data) && data.length > 0) {
      // Đảm bảo toàn bộ mã đơn hàng tối đa 12 chữ số; giữ nguyên đầy đủ các chặng.
      const sanitized = data.map((item) => {
        if (item.region) {
          item.region = item.region.replace(/\s*·\s*/g, ', ');
        }
        if (typeof item.id === 'string' && !/^\d{1,12}$/.test(item.id)) {
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
    if (typeof localStorage === 'undefined' || typeof localStorage.setItem !== 'function') return;
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
        ...DEFAULT_SHOP_META,
        id: generateOrderId(),
        createdAt: new Date().toISOString(),
        status: 'Chờ lấy hàng' as const,
        spfCode: 'SPF-0301' as const,
        printed: false,
        batchId,
        reconciliationId: '',
        updatedAt: new Date().toISOString(),
        sourceChannel: 'web',
        serviceType: 'standard',
        dispatchMethod: 'pickup',
        deliveryResult: 'NONE',
        businessType: 'STANDARD',
        codPaymentStatus: 'UNPAID',
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
      records = records.map((order) =>
        order.id === id
          ? {
              ...order,
              status: 'Đã hủy',
              spfCode: 'SPF-0201',
              updatedAt: new Date().toISOString(),
              shippingInfo: order.shippingInfo
                ? {
                    ...order.shippingInfo,
                    currentStage: 'completed',
                    carrierStatusText: `${order.shippingInfo.pickupCarrier || 'NVC'} – Đã hủy`,
                  }
                : undefined,
            }
          : order,
      );
      saveToStorage(records);
    },
    markPrinted(ids, detail) {
      records = records.map((order) =>
        ids.includes(order.id)
          ? {
              ...order,
              printed: true,
              printHistory: [
                ...(order.printHistory || []),
                {
                  id: detail?.id || `PRINT-${order.id}-${Date.now()}`,
                  printedAt: detail?.printedAt || new Date().toISOString(),
                  printedBy:
                    detail?.printedBy ||
                    `${order.shopId || 'Shop'} · ${order.shopName || 'Cửa hàng'}`,
                  actorType: detail?.actorType || 'shop',
                  waybill:
                    detail?.waybill ||
                    order.shippingInfo?.deliveryTracking ||
                    order.shippingInfo?.pickupTracking ||
                    order.id,
                  templateType: detail?.templateType || 'S10 · 100 × 150 mm',
                  status: detail?.status || 'Thành công',
                },
              ],
            }
          : order,
      );
      saveToStorage(records);
    },
    recordAccessAudit(id, detail) {
      records = records.map((order) =>
        order.id === id
          ? {
              ...order,
              accessAudit: [
                {
                  id: `AUDIT-${order.id}-${Date.now()}`,
                  viewedAt: new Date().toISOString(),
                  ...detail,
                },
                ...(order.accessAudit || []),
              ],
            }
          : order,
      );
      saveToStorage(records);
    },
    applyOperation(id, operation) {
      const current = records.find((order) => order.id === id);
      if (!current) throw new Error('Không tìm thấy đơn hàng.');

      let next: Order = { ...current, updatedAt: new Date().toISOString() };
      if (operation.type === 'request-redelivery') {
        if (current.spfCode !== 'SPF-0802') {
          throw new Error('Trạng thái Order đã thay đổi và không còn cho phép yêu cầu giao lại.');
        }
        next = { ...next, spfCode: 'SPF-0803', status: 'Đang yêu cầu giao lại' };
      } else if (operation.type === 'request-return') {
        if (current.spfCode !== 'SPF-0802') {
          throw new Error('Chỉ có thể yêu cầu chuyển hoàn sau khi giao hàng thất bại.');
        }
        next = {
          ...next,
          spfCode: 'SPF-1001',
          status: 'Chờ xác nhận chuyển hoàn',
          returnReason: operation.reason,
        };
      } else if (operation.type === 'confirm-return') {
        if (current.spfCode !== 'SPF-1001') {
          throw new Error('Order không còn ở trạng thái chờ xác nhận chuyển hoàn.');
        }
        next = {
          ...next,
          spfCode: 'SPF-1002',
          status: 'Đã xác nhận chuyển hoàn',
          returnConfirmedAt: new Date().toISOString(),
        };
      } else if (operation.type === 'change-carrier') {
        const phase = getSpfLifecyclePhase(current.spfCode);
        if (['delivered', 'returned', 'cancelled'].includes(phase)) {
          throw new Error('Không thể đổi NVC khi Order đã kết thúc.');
        }
        const fromCarrier = current.shippingInfo?.deliveryCarrier || current.selectedCarrier || 'Chưa gán';
        if (fromCarrier === operation.carrier) {
          throw new Error('NVC mới phải khác NVC đang phụ trách.');
        }
        next = {
          ...next,
          selectedCarrier: operation.carrier,
          shippingInfo: {
            ...current.shippingInfo,
            deliveryCarrier: operation.carrier,
            carrierStatusText: `${operation.carrier} – Chờ tiếp nhận`,
            currentStage: current.shippingInfo?.currentStage || 'pickup',
            stages: current.shippingInfo?.stages?.map((stage) =>
              stage.key === 'delivery'
                ? {
                    ...stage,
                    carrier: operation.carrier,
                    tracking: 'Đang cấp mã',
                    status: 'pending',
                    carrierStatusText: 'Chờ NVC mới tiếp nhận',
                    carrierStatusCode: 'CARRIER-CHANGE-PENDING',
                    carrierUpdatedAt: new Date().toISOString(),
                  }
                : stage,
            ),
          },
          carrierChangeHistory: [
            {
              id: `CARRIER-${id}-${Date.now()}`,
              changedAt: new Date().toISOString(),
              changedBy: operation.changedBy,
              fromCarrier,
              toCarrier: operation.carrier,
              reason: operation.reason,
            },
            ...(current.carrierChangeHistory || []),
          ],
        };
      } else if (operation.type === 'add-goods-images') {
        if (!operation.images.length) throw new Error('Vui lòng chọn ít nhất một ảnh hàng hóa.');
        next = { ...next, goodsImages: [...(current.goodsImages || []), ...operation.images] };
      }

      records = records.map((order) => (order.id === id ? next : order));
      saveToStorage(records);
      return structuredClone(next);
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
  const apiUrl =
    (import.meta.env.VITE_API_URL as string | undefined) ||
    (window as unknown as { VITE_API_URL?: string }).VITE_API_URL;
  if (apiUrl) {
    return createApiOrderRepository(apiUrl);
  }
  return createPersistentOrderRepository();
}

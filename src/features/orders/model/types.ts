import type { SpfStatusCode, SpfStatusName } from './spf-status-catalog';

export type OrderStatus = SpfStatusName;

export type ActorRole = 'shop' | 'cskh' | 'ops' | 'sales' | 'finance' | 'admin';

export interface OrderInput {
  name: string;
  phone: string;
  address: string;
  region: string;
  product: string;
  weight: number;
  value: number;
  cod: number;
  length: number;
  width: number;
  height: number;
  privateId: string;
  note: string;
  payer: 'sender' | 'recipient';
  inspection: 'view' | 'try' | 'none';
  returnGoods: boolean;
  businessType?: 'STANDARD' | 'PARTIAL' | 'EXCHANGE' | 'RETURN';
  /** Ứng dụng/mô hình khách hàng dùng khi tạo đơn. */
  customerApplication?: 'SUPERSHIP' | 'SUPERAI';
  customerModel?: 'LOCAL_LEGACY' | 'LOCAL_NEW' | 'NATIONAL' | 'SUPERAI';
  fulfillmentPlan?: 'LOCAL_SUPERSHIP' | 'LOCAL_PARTNER' | 'DIRECT_CARRIER';
  selectedCarrier?: string;
  selectedService?: string;
  /** Phí giao hàng đã báo giá cho phương án vận chuyển đang chọn. */
  shippingFee?: number;
  carrierSelectionMode?: string;
  pickupAddressOverride?: string;
  returnAddressOverride?: string;
}

export type { SpfStatusCode } from './spf-status-catalog';

export interface CarrierWebhookEvent {
  id: string;
  receivedAt: string;
  eventAt: string;
  statusCode: string;
  statusText: string;
  mappedSpfCode: SpfStatusCode;
  mappedSpfStatus: SpfStatusName;
  processingStatus: 'processed' | 'duplicate' | 'failed';
  requestId: string;
  location?: string;
  note?: string;
  payload?: string;
}

export interface OrderStatusHistoryEntry {
  fromStatusCode?: SpfStatusCode;
  statusCode: SpfStatusCode;
  statusName: string;
  reasonCode?: string;
  reason?: string;
  changedAt: string;
}

export interface PrintHistoryEntry {
  id: string;
  printedAt: string;
  printedBy: string;
  actorType: 'shop' | 'internal';
  waybill: string;
  templateType: string;
  status: 'Thành công' | 'Thất bại';
}

export interface AccessAuditEntry {
  id: string;
  viewedAt: string;
  viewedBy: string;
  field: 'shipper_delivery_phone';
  reason: string;
}

export interface DeliveryProof {
  id: string;
  imageUrl: string;
  capturedAt: string;
  capturedBy: string;
  note: string;
}

export interface GoodsImage {
  id: string;
  imageUrl: string;
  fileName: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface CarrierChangeRecord {
  id: string;
  changedAt: string;
  changedBy: string;
  fromCarrier: string;
  toCarrier: string;
  reason: string;
}

export type OrderOperation =
  | { type: 'retry-create-waybill' }
  | { type: 'request-pickup-retry' }
  | { type: 'request-redelivery' }
  | { type: 'request-return'; reason: string }
  | { type: 'confirm-return' }
  | { type: 'change-carrier'; carrier: string; reason: string; changedBy: string }
  | { type: 'add-goods-images'; images: GoodsImage[] };

export interface InstantDeliveryTracking {
  state:
    | 'CREATED'
    | 'DRIVER_NOT_FOUND'
    | 'DRIVER_ASSIGNED'
    | 'DRIVER_TO_PICKUP'
    | 'PICKED_UP'
    | 'IN_DELIVERY'
    | 'ARRIVING'
    | 'DELIVERED';
  statusLabel: string;
  currentAddress: string;
  updatedAt: string;
  progressPercent: number;
  pickupAddress: string;
  deliveryAddress: string;
  remainingDistanceKm?: number;
  etaMinutes?: number;
  estimatedArrivalAt?: string;
  latitude?: number;
  longitude?: number;
  locationAccuracyMeters?: number;
  vehicleType?: string;
  vehiclePlate?: string;
}

export interface ShippingStageItem {
  key: 'pickup' | 'delivery' | 'return' | 'refund';
  title: string; // 'Lấy' | 'Giao' | 'Hoàn' | 'Trả cuối'
  /** Mã chặng chuẩn từ order_legs, ví dụ STG-DELIVERY-0001. */
  stageCode?: string;
  stageNo?: number;
  legType?: 1 | 2 | 3 | 4;
  carrier: string;
  tracking: string;
  isSuperShip?: boolean;
  status?: 'completed' | 'active' | 'pending';
  /** Trạng thái riêng do NVC của chặng trả về, không thay thế trạng thái SPF của Order. */
  carrierStatusText?: string;
  carrierStatusCode?: string;
  carrierUpdatedAt?: string;
  /** Nhật ký webhook gốc chỉ hiển thị cho người dùng nội bộ theo đúng chặng/NVC. */
  webhookEvents?: CarrierWebhookEvent[];
}

export interface ShippingRoutingInfo {
  pickupCarrier?: string;
  pickupTracking?: string;
  deliveryCarrier?: string;
  deliveryTracking?: string;
  returnCarrier?: string;
  returnTracking?: string;
  refundCarrier?: string;
  refundTracking?: string;
  currentStage?: 'pickup' | 'delivery' | 'return' | 'refund' | 'completed';
  carrierStatusText?: string;
  stages?: ShippingStageItem[];
}

export interface Order extends OrderInput {
  id: string;
  createdAt: string;
  status: OrderStatus;
  /** Mã trạng thái chuẩn SuperPlatform; bắt buộc để không suy diễn từ nhãn NVC. */
  spfCode: SpfStatusCode;
  /** Lịch sử trạng thái chuẩn SPF theo thứ tự thời gian, tách biệt trạng thái riêng của NVC. */
  statusHistory?: OrderStatusHistoryEntry[];
  printed: boolean;
  printHistory?: PrintHistoryEntry[];
  batchId: string;
  reconciliationId: string;
  shippingInfo?: ShippingRoutingInfo;
  updatedAt?: string;
  clientCode?: string;
  shopId?: string;
  shopName?: string;
  shopPhone?: string;
  sourceChannel?: string;
  serviceType?: string;
  dispatchMethod?: 'pickup' | 'dropoff';
  warehouseId?: string;
  addressFormat?: '2-level' | '3-level';
  senderName?: string;
  senderPhone?: string;
  senderAddress?: string;
  /** Dữ liệu chuyển ngoài do nghiệp vụ ghi nhận; không suy diễn từ số lượng NVC. */
  isExternalRouted?: boolean;
  shipperPickupPhone?: string;
  shipperDeliveryPhone?: string;
  shipperDeliveryName?: string;
  shipperDeliveryCode?: string;
  shipperReturnPhone?: string;
  shipperFinalReturnPhone?: string;
  pickupAttempts?: number;
  deliveryAttempts?: number;
  finalReturnAttempts?: number;
  cancelRequestedAt?: string;
  carrierCancelStatus?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REJECTED' | 'UNKNOWN';
  hasStatusMismatch?: boolean;
  accessAudit?: AccessAuditEntry[];
  deliveryProofs?: DeliveryProof[];
  goodsImages?: GoodsImage[];
  carrierChangeHistory?: CarrierChangeRecord[];
  /** Vị trí gần nhất của tài xế cho đơn hỏa tốc nội thành. */
  instantTracking?: InstantDeliveryTracking;
  deliveryResult?: 'NONE' | 'PARTIAL' | 'FULL';
  returnReason?: string;
  supportStatus?: string;
  codPaymentStatus?: string;
  /** Current projection COD/Finance lấy trực tiếp từ bảng orders. */
  collectedAmount?: number;
  codCollectionStatus?: number;
  settledAmount?: number;
  codSettlementStatus?: number;
  compensationAmount?: number;
  priceAccountType?: string;
  codChanged?: boolean;
  incidentType?: string;
  claimStatus?: string;
  compensationStatus?: number | string;
  syncStatus?: string;
  pickupAt?: string;
  deliveryAt?: string;
  returnConfirmedAt?: string;
  returnedAt?: string;
}

export interface OrderFilters {
  role: ActorRole;
  query: string;
  phone: string;
  id: string;
  carrierWaybill: string;
  privateId: string;
  clientCode: string;
  batchId: string;
  reconciliationId: string;
  shopId: string;
  sourceChannel: string;
  serviceType: string;
  dispatchMethod: string;
  deliveryResult: string;
  businessType: string;
  timeField: string;
  supportStatus: string;
  codPaymentStatus: string;
  returnReason: string;
  recipientName: string;
  warehouseId: string;
  senderAddress: string;
  recipientAddress: string;
  recipientRegion: string;
  addressFormat: string;
  carrierAny: string;
  carrierPickup: string;
  carrierDelivery: string;
  carrierReturn: string;
  carrierFinalReturn: string;
  isExternalRouted: boolean;
  status: string;
  statusGroup: string;
  statusAgeHours: string;
  carrierStatusPickup: string;
  carrierStatusDelivery: string;
  carrierStatusReturn: string;
  carrierStatusFinalReturn: string;
  shipperPickupPhone: string;
  shipperDeliveryPhone: string;
  shipperReturnPhone: string;
  shipperFinalReturnPhone: string;
  picked: boolean;
  unpicked: boolean;
  pickupFailed: boolean;
  handoverDone: boolean;
  handoverFailed: boolean;
  delivered: boolean;
  deliveryFailed: boolean;
  hasCancelRequest: boolean;
  cancelCarrierFailed: boolean;
  priceAccountType: string;
  printed: boolean;
  unprinted: boolean;
  hasReturn: boolean;
  hasPartialDelivery: boolean;
  hasExchange: boolean;
  hasCod: boolean;
  codMin: number | '';
  codMax: number | '';
  codChanged: boolean;
  hasSupportRequest: boolean;
  supportSlaExceeded: boolean;
  hasIncident: boolean;
  incidentType: string;
  hasClaim: boolean;
  claimStatus: string;
  hasCompensation: boolean;
  syncError: boolean;
  hasOpsAnomaly: boolean;
  anomalyNoUpdateHours: string;
  anomalyStatusMismatch: boolean;
  anomalyPendingAction: boolean;
  anomalyBusinessError: boolean;
  days: string;
  sender: boolean;
  recipient: boolean;
  sort: 'new' | 'old';
}

export const emptyFilters: OrderFilters = {
  role: 'shop',
  query: '',
  phone: '',
  id: '',
  carrierWaybill: '',
  privateId: '',
  clientCode: '',
  batchId: '',
  reconciliationId: '',
  shopId: '',
  sourceChannel: '',
  serviceType: '',
  dispatchMethod: '',
  deliveryResult: '',
  businessType: '',
  timeField: 'createdAt',
  supportStatus: '',
  codPaymentStatus: '',
  returnReason: '',
  recipientName: '',
  warehouseId: '',
  senderAddress: '',
  recipientAddress: '',
  recipientRegion: '',
  addressFormat: '',
  carrierAny: '',
  carrierPickup: '',
  carrierDelivery: '',
  carrierReturn: '',
  carrierFinalReturn: '',
  isExternalRouted: false,
  status: '',
  statusGroup: '',
  statusAgeHours: '',
  carrierStatusPickup: '',
  carrierStatusDelivery: '',
  carrierStatusReturn: '',
  carrierStatusFinalReturn: '',
  shipperPickupPhone: '',
  shipperDeliveryPhone: '',
  shipperReturnPhone: '',
  shipperFinalReturnPhone: '',
  picked: false,
  unpicked: false,
  pickupFailed: false,
  handoverDone: false,
  handoverFailed: false,
  delivered: false,
  deliveryFailed: false,
  hasCancelRequest: false,
  cancelCarrierFailed: false,
  priceAccountType: '',
  printed: false,
  unprinted: false,
  hasReturn: false,
  hasPartialDelivery: false,
  hasExchange: false,
  hasCod: false,
  codMin: '',
  codMax: '',
  codChanged: false,
  hasSupportRequest: false,
  supportSlaExceeded: false,
  hasIncident: false,
  incidentType: '',
  hasClaim: false,
  claimStatus: '',
  hasCompensation: false,
  syncError: false,
  hasOpsAnomaly: false,
  anomalyNoUpdateHours: '',
  anomalyStatusMismatch: false,
  anomalyPendingAction: false,
  anomalyBusinessError: false,
  days: '',
  sender: false,
  recipient: false,
  sort: 'new',
};

export const defaultOrderInput: OrderInput = {
  name: '',
  phone: '',
  address: '',
  region: '',
  product: 'Mỹ phẩm',
  weight: 750,
  value: 0,
  cod: 0,
  length: 0,
  width: 0,
  height: 0,
  privateId: '',
  note: 'Khách không nhận vui lòng thu 30k phí giao hàng. Cảm ơn!',
  payer: 'sender',
  inspection: 'view',
  returnGoods: false,
};

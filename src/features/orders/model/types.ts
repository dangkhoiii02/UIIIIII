export type OrderStatus =
  | 'Chờ Lấy Hàng'
  | 'Đang giao hàng'
  | 'Hoãn giao hàng'
  | 'Đã giao hàng'
  | 'Đang chuyển hoàn'
  | 'Đã trả hàng'
  | 'Đã hủy';

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
}

import type { SpfStatusCode } from './spf-status-catalog';
export type { SpfStatusCode } from './spf-status-catalog';

export interface ShippingStageItem {
  key: 'pickup' | 'delivery' | 'return' | 'refund';
  title: string;
  carrier: string;
  tracking: string;
  isSuperShip?: boolean;
  status?: 'completed' | 'active' | 'pending';
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
  spfCode?: SpfStatusCode;
  printed: boolean;
  batchId: string;
  reconciliationId: string;
  shippingInfo?: ShippingRoutingInfo;
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
  shipperPickupPhone: string;
  shipperDeliveryPhone: string;
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
  shipperPickupPhone: '',
  shipperDeliveryPhone: '',
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

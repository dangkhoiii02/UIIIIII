import type { InstantDeliveryTracking } from './types';

const DRIVER_JOURNEY_AVAILABLE_STATES = new Set<InstantDeliveryTracking['state']>([
  'PICKED_UP',
  'IN_DELIVERY',
  'ARRIVING',
  'DELIVERED',
]);

/**
 * Shop chỉ được mở live tracking sau khi tài xế đã nhận kiện.
 * DRIVER_ASSIGNED/DRIVER_TO_PICKUP mới chỉ là tài xế đang trên đường tới Shop.
 */
export function canViewInstantDriverJourney(
  tracking?: Pick<InstantDeliveryTracking, 'state'>,
): boolean {
  return Boolean(tracking && DRIVER_JOURNEY_AVAILABLE_STATES.has(tracking.state));
}

export function formatInstantEta(value?: number): string {
  return typeof value === 'number' && Number.isFinite(value) ? `${value} phút` : '';
}

export function formatInstantDistance(value?: number): string {
  return typeof value === 'number' && Number.isFinite(value) ? `${value} km` : '';
}

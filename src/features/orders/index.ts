export { OrdersProvider } from './components/OrdersProvider';
export { useOrders } from './model/orders-context';
export { defaultOrderInput, emptyFilters } from './model/types';
export type {
  Order,
  OrderInput,
  OrderFilters,
  OrderStatus,
  ShippingStageItem,
  CarrierWebhookEvent,
  InstantDeliveryTracking,
} from './model/types';
export * from './model/spf-status-catalog';
export { validateOrder } from './model/order';
export { getOrderPermission } from './model/order-permissions';
import { lazy } from 'react';
export const CreateOrderPage = lazy(() => import('./pages/CreateOrderPage'));
export const OrdersPage = lazy(() => import('./pages/OrdersPage'));
export const OrderDetailPage = lazy(() => import('./pages/OrderDetailPage'));
export const OrderPrintPage = lazy(() => import('./pages/OrderPrintPage'));
export const InstantTrackingPage = lazy(() => import('./pages/InstantTrackingPage'));

import { createBrowserRouter, Navigate } from 'react-router-dom';
import {
  CreateOrderPage,
  OrdersPage,
  OrderDetailPage,
  OrderPrintPage,
  InstantTrackingPage,
} from '@/features/orders';
import { BulkOrdersPage, OrderBatchesPage } from '@/features/bulk-orders';
import { RequestsPage } from '@/features/support';
import { PrintTemplatesPage } from '@/features/print-templates';
import { PublicTrackingPage } from '@/features/public-tracking';
import {
  CarrierOperationsPage,
  InternalPrintCenterPage,
  InternalReportsPage,
} from '@/features/internal-operations';
import { AppLayout } from './layouts/AppLayout';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { RouteErrorPage } from './pages/RouteErrorPage';
import { AccessDeniedPage } from './pages/AccessDeniedPage';
import { navigation } from './config/navigation';

const implemented = new Set([
  '/create',
  '/orders',
  '/sheet2',
  '/sheet3',
  '/order-batches',
  '/requests',
  '/print-templates',
  '/carrier-operations',
  '/internal-print',
  '/statistics',
]);

export const router = createBrowserRouter([
  {
    path: '/tracking',
    element: <PublicTrackingPage />,
  },
  {
    path: '/tracking/:id',
    element: <PublicTrackingPage />,
  },
  {
    path: '/orders/:id/print',
    element: <OrderPrintPage />,
  },
  {
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="/create" replace /> },
      { path: '/create', element: <CreateOrderPage /> },
      { path: '/orders', element: <OrdersPage /> },
      { path: '/orders/:id', element: <OrderDetailPage /> },
      { path: '/orders/:id/live-tracking', element: <InstantTrackingPage /> },
      { path: '/sheet2', element: <BulkOrdersPage key="2" level={2} /> },
      { path: '/sheet3', element: <BulkOrdersPage key="3" level={3} /> },
      { path: '/order-batches', element: <OrderBatchesPage /> },
      { path: '/requests', element: <RequestsPage /> },
      { path: '/print-templates', element: <PrintTemplatesPage /> },
      { path: '/carrier-operations', element: <CarrierOperationsPage /> },
      { path: '/internal-print', element: <InternalPrintCenterPage /> },
      { path: '/statistics', element: <InternalReportsPage /> },
      { path: '/403', element: <AccessDeniedPage /> },
      ...navigation
        .filter((item) => !implemented.has(item.path))
        .map((item) => ({ path: item.path, element: <PlaceholderPage /> })),
      { path: '*', element: <PlaceholderPage /> },
    ],
  },
]);

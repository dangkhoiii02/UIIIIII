import { createBrowserRouter, Navigate } from 'react-router-dom';
import { CreateOrderPage, OrdersPage, OrderDetailPage } from '@/features/orders';
import { BulkOrdersPage } from '@/features/bulk-orders';
import { RequestsPage } from '@/features/support';
import { PrintTemplatesPage } from '@/features/print-templates';
import PublicTrackingPage from '@/features/public-tracking/pages/PublicTrackingPage';
import { AppLayout } from './layouts/AppLayout';
import { PlaceholderPage } from './pages/PlaceholderPage';
import { RouteErrorPage } from './pages/RouteErrorPage';
import { navigation } from './config/navigation';

const implemented = new Set(['/create', '/orders', '/sheet2', '/sheet3', '/requests', '/print-templates']);

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
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Navigate to="/create" replace /> },
      { path: '/create', element: <CreateOrderPage /> },
      { path: '/orders', element: <OrdersPage /> },
      { path: '/orders/:id', element: <OrderDetailPage /> },
      { path: '/sheet2', element: <BulkOrdersPage key="2" level={2} /> },
      { path: '/sheet3', element: <BulkOrdersPage key="3" level={3} /> },
      { path: '/requests', element: <RequestsPage /> },
      { path: '/print-templates', element: <PrintTemplatesPage /> },
      ...navigation
        .filter((item) => !implemented.has(item.path))
        .map((item) => ({ path: item.path, element: <PlaceholderPage /> })),
      { path: '*', element: <PlaceholderPage /> },
    ],
  },
]);


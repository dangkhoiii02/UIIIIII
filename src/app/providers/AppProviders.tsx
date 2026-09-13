import type { ReactNode } from 'react';
import { OrdersProvider } from '@/features/orders';
import { PickupProvider } from '@/features/pickup';
import { SupportProvider } from '@/features/support';
import { ToastProvider } from '@/shared/ui/ToastProvider';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <OrdersProvider>
          <PickupProvider>
            <SupportProvider>{children}</SupportProvider>
          </PickupProvider>
        </OrdersProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

import { useMemo, useState, type ReactNode } from 'react';
import { createOrderRepository, type OrderRepository } from '../data/order-repository';
import { OrdersContext } from '../model/orders-context';
import type { OrderInput } from '../model/types';

export function OrdersProvider({
  children,
  repository,
}: {
  children: ReactNode;
  repository?: OrderRepository;
}) {
  const [service] = useState(() => repository ?? createOrderRepository());
  const [orders, setOrders] = useState(() => service.list());

  const value = useMemo(
    () => ({
      orders,
      createOrders: (inputs: OrderInput[]) => {
        service.create(inputs);
        setOrders(service.list());
      },
      updateOrder: (id: string, input: OrderInput) => {
        service.update(id, input);
        setOrders(service.list());
      },
      cancelOrder: (id: string) => {
        service.cancel(id);
        setOrders(service.list());
      },
      markPrinted: (ids: string[]) => {
        service.markPrinted(ids);
        setOrders(service.list());
      },
      resetDb: () => {
        const fresh = service.resetDb();
        setOrders(fresh);
      },
    }),
    [orders, service],
  );

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}


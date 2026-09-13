import { createContext, useContext } from 'react';
import type { Order, OrderInput } from './types';
export interface OrdersContextValue {
  orders: Order[];
  createOrders: (inputs: OrderInput[]) => void;
  updateOrder: (id: string, input: OrderInput) => void;
  cancelOrder: (id: string) => void;
  markPrinted: (ids: string[]) => void;
  resetDb: () => void;
}
export const OrdersContext = createContext<OrdersContextValue | null>(null);
export function useOrders() {
  const value = useContext(OrdersContext);
  if (!value) throw new Error('useOrders requires OrdersProvider');
  return value;
}

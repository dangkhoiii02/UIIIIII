import { createContext, useContext } from 'react';
export interface Ticket {
  id: string;
  orderId: string;
  category: string;
  content: string;
  createdAt: string;
}
export const SupportContext = createContext<{
  tickets: Ticket[];
  addTicket: (input: Omit<Ticket, 'id' | 'createdAt'>) => void;
} | null>(null);
export function useSupport() {
  const value = useContext(SupportContext);
  if (!value) throw new Error('useSupport requires SupportProvider');
  return value;
}

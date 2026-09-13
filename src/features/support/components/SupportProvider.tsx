import { useMemo, useState, type ReactNode } from 'react';
import { SupportContext, type Ticket } from '../model/support-context';
export function SupportProvider({ children }: { children: ReactNode }) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const value = useMemo(
    () => ({
      tickets,
      addTicket: (input: Omit<Ticket, 'id' | 'createdAt'>) => {
        setTickets((current) => [
          ...current,
          { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
        ]);
      },
    }),
    [tickets],
  );
  return <SupportContext.Provider value={value}>{children}</SupportContext.Provider>;
}

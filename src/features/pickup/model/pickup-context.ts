import { createContext, useContext } from 'react';
export const PickupContext = createContext<{
  address: string;
  setAddress: (address: string) => void;
} | null>(null);
export function usePickup() {
  const value = useContext(PickupContext);
  if (!value) throw new Error('usePickup requires PickupProvider');
  return value;
}

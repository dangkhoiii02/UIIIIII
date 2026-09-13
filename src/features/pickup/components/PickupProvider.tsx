import { useMemo, useState, type ReactNode } from 'react';
import { PickupContext } from '../model/pickup-context';
export function PickupProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState(
    '25 Hồ Mễ Trì, Phường Mễ Trì, Quận Nam Từ Liêm, Thành phố Hà Nội',
  );
  const value = useMemo(() => ({ address, setAddress }), [address]);
  return <PickupContext.Provider value={value}>{children}</PickupContext.Provider>;
}

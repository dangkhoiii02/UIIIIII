import { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { money } from '@/shared/lib/format';
import { SupportDialog } from '@/features/support';
import { useOrders } from '../model/orders-context';
import type { Order } from '../model/types';
import { OrderTimeline } from './OrderTimeline';
import { PrintHistoryDrawer } from './PrintHistoryDrawer';

export type OrderDialogState =
  | { type: 'detail' | 'support' | 'cancel'; order: Order }
  | { type: 'print'; orders: Order[] };

export function OrderDialogs({ state, onClose }: { state: OrderDialogState; onClose: () => void }) {
  const { cancelOrder, markPrinted } = useOrders();
  const [showPrintHistory, setShowPrintHistory] = useState(false);

  if (state.type === 'support') return <SupportDialog order={state.order} onClose={onClose} />;
  if (state.type === 'cancel')
    return (
      <Modal
        title="Hủy đơn hàng"
        onClose={onClose}
        footer={
          <>
            <Button onClick={onClose}>Quay lại</Button>
            <Button
              variant="primary"
              onClick={() => {
                cancelOrder(state.order.id);
                onClose();
              }}
            >
              Hủy đơn
            </Button>
          </>
        }
      >
        Bạn muốn hủy đơn <b>{state.order.id}</b>?
      </Modal>
    );

  if (state.type === 'print')
    return (
      <Modal
        title="In tem đơn hàng (K46 / A6)"
        onClose={onClose}
        footer={
          <>
            <Button onClick={onClose}>Đóng</Button>
            <Button
              variant="primary"
              onClick={() => {
                window.print();
                markPrinted(state.orders.map((order) => order.id));
              }}
            >
              In tem
            </Button>
          </>
        }
      >
        <div id="print-content">
          {state.orders.map((order) => (
            <section className="step" key={order.id}>
              <h3>{order.id}</h3>
              <p>
                {order.name} · {order.phone}
                <br />
                {order.address}, {order.region}
              </p>
              <b>
                {order.product} · {order.weight} gr
              </b>
              <p>Thu hộ: {money(order.cod)}</p>
            </section>
          ))}
        </div>
      </Modal>
    );

  const { order } = state;

  return (
    <>
      <Modal
        title="Chi tiết đơn hàng"
        onClose={onClose}
        footer={
          <>
            <Button onClick={() => setShowPrintHistory(true)}>Lịch sử in tem</Button>
            <Button variant="primary" onClick={onClose}>
              Đóng
            </Button>
          </>
        }
      >
        <div className="order-detail-modal-body">
          <div className="order-detail-top-bar">
            <b>{order.id}</b>
            <span className="status-badge-inline">{order.status}</span>
          </div>

          <div className="order-detail-info-box">
            <p>
              <strong>Người nhận:</strong> {order.name} · {order.phone}
              <br />
              <strong>Địa chỉ:</strong> {order.address}, {order.region}
            </p>
            <div className="step">
              Hàng hóa: <b>{order.product}</b> · {order.weight} gr
              <br />
              Thu hộ (COD): <b>{money(order.cod)}</b> · Giá trị khai báo: {money(order.value)}
            </div>
            {order.note && <p className="order-detail-note">Ghi chú: {order.note}</p>}
          </div>

          <OrderTimeline order={order} />
        </div>
      </Modal>

      {showPrintHistory && (
        <PrintHistoryDrawer order={order} onClose={() => setShowPrintHistory(false)} />
      )}
    </>
  );
}


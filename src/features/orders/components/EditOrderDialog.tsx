import { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/toast-context';
import { useOrders } from '../model/orders-context';
import type { Order } from '../model/types';
import { getSpfStatusTone } from '../model/spf-status-catalog';
import { getOrderPermission } from '../model/order-permissions';

export function EditOrderDialog({ order, onClose }: { order: Order; onClose: () => void }) {
  const { updateOrder } = useOrders();
  const notify = useToast();
  const [error, setError] = useState('');
  const formId = `edit-order-form-${order.id}`;
  const viewer = { kind: 'shop' as const, shopId: order.shopId || 'S275518' };
  const canEditGoods = getOrderPermission(viewer, order, 'edit_goods').allowed;
  const canEditWeight = getOrderPermission(viewer, order, 'edit_declared_weight').allowed;
  const canEditPickupAddress = getOrderPermission(viewer, order, 'edit_pickup_address').allowed;

  return (
    <Modal
      title="Sửa thông tin đơn hàng"
      onClose={onClose}
      footer={
        <>
          <Button type="button" onClick={onClose}>
            Đóng
          </Button>
          <Button type="submit" form={formId} variant="primary">
            Lưu thay đổi
          </Button>
        </>
      }
    >
      <form
        id={formId}
        className="edit-order-dialog-form"
        onSubmit={(event) => {
          event.preventDefault();
          setError('');
          const data = new FormData(event.currentTarget);
          try {
            updateOrder(order.id, {
              ...order,
              name: String(data.get('name') || '').trim(),
              phone: String(data.get('phone') || '').trim(),
              address: String(data.get('address') || '').trim(),
              region: String(data.get('region') || '').trim(),
              note: String(data.get('note') || '').trim(),
              product: canEditGoods
                ? String(data.get('product') || '').trim()
                : order.product,
              weight: canEditWeight ? Number(data.get('weight')) : order.weight,
              length: canEditWeight ? Number(data.get('length')) : order.length,
              width: canEditWeight ? Number(data.get('width')) : order.width,
              height: canEditWeight ? Number(data.get('height')) : order.height,
              pickupAddressOverride: canEditPickupAddress
                ? String(data.get('pickupAddressOverride') || '').trim()
                : order.pickupAddressOverride,
            });
            notify(`Đã cập nhật thông tin đơn hàng ${order.id}.`);
            onClose();
          } catch (submitError) {
            setError(
              submitError instanceof Error
                ? submitError.message
                : 'Không thể cập nhật đơn hàng. Vui lòng thử lại.',
            );
          }
        }}
      >
        <div className="edit-order-dialog-summary">
          <span>Mã đơn hàng</span>
          <strong>{order.id}</strong>
          <span className={`order-status-pill status-${getSpfStatusTone(order.spfCode)}`}>
            {order.status}
          </span>
        </div>

        <div className="edit-order-dialog-grid">
          <label className="field">
            <span>
              Tên người nhận <b className="red">*</b>
            </span>
            <input name="name" required defaultValue={order.name} />
          </label>
          <label className="field">
            <span>
              Số điện thoại <b className="red">*</b>
            </span>
            <input
              name="phone"
              required
              inputMode="tel"
              pattern="[0-9]{9,11}"
              defaultValue={order.phone}
            />
          </label>
        </div>

        <label className="field">
          <span>
            Địa chỉ nhận hàng <b className="red">*</b>
          </span>
          <input name="address" required defaultValue={order.address} />
        </label>

        {canEditGoods && (
          <label className="field">
            <span>
              Hàng hóa <b className="red">*</b>
            </span>
            <input name="product" required defaultValue={order.product} />
          </label>
        )}

        {canEditWeight && (
          <div className="edit-order-dialog-grid">
            <label className="field">
              <span>Khối lượng khai báo (gram)</span>
              <input name="weight" type="number" min="1" required defaultValue={order.weight} />
            </label>
            <label className="field">
              <span>Kích thước D × R × C (cm)</span>
              <div className="dimension-input-row">
                <input name="length" type="number" min="1" defaultValue={order.length} aria-label="Chiều dài" />
                <input name="width" type="number" min="1" defaultValue={order.width} aria-label="Chiều rộng" />
                <input name="height" type="number" min="1" defaultValue={order.height} aria-label="Chiều cao" />
              </div>
            </label>
          </div>
        )}

        {canEditPickupAddress && (
          <label className="field">
            <span>Địa chỉ lấy hàng thay thế</span>
            <input
              name="pickupAddressOverride"
              defaultValue={order.pickupAddressOverride || order.senderAddress || ''}
            />
          </label>
        )}

        <label className="field">
          <span>
            Khu vực <b className="red">*</b>
          </span>
          <input name="region" required defaultValue={order.region} />
        </label>

        <label className="field">
          <span>Ghi chú giao hàng</span>
          <textarea name="note" rows={3} maxLength={500} defaultValue={order.note} />
        </label>

        {error && <div className="operation-inline-error">{error}</div>}
      </form>
    </Modal>
  );
}

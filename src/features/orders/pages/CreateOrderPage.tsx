import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BookOpen } from 'lucide-react';
import { HelpDialog } from '@/shared/ui/HelpDialog';
import { useToast } from '@/shared/ui/toast-context';
import { RecipientFields } from '../components/RecipientFields';
import { ParcelFields } from '../components/ParcelFields';
import { FeeSummary } from '../components/FeeSummary';
import { defaultOrderInput, type OrderInput } from '../model/types';
import { validateOrder } from '../model/order';
import { useOrders } from '../model/orders-context';
import { EditOrderView } from '../components/EditOrderView';
function OrderForm({ initial, editId }: { initial: OrderInput; editId?: string }) {
  const [value, setValue] = useState<OrderInput>(initial);
  const [agreed, setAgreed] = useState(true);
  const [help, setHelp] = useState(false);
  const { createOrders, updateOrder } = useOrders();
  const navigate = useNavigate();
  const notify = useToast();
  const update = (patch: Partial<OrderInput>) => setValue((current) => ({ ...current, ...patch }));
  const errors = validateOrder(value);
  return (
    <>
      <h1>
        {editId ? 'Chỉnh sửa đơn hàng' : 'Tạo đơn hàng'}{' '}
        <button
          type="button"
          className="badge-blue"
          aria-label="Hướng dẫn tạo đơn"
          onClick={() => setHelp(true)}
        >
          <BookOpen size={20} />
        </button>
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (errors.length || !agreed) {
            notify(errors[0] ?? 'Vui lòng đồng ý điều khoản.');
            return;
          }
          try {
            if (editId) updateOrder(editId, value);
            else createOrders([value]);
            navigate('/orders');
            notify(editId ? 'Đã cập nhật đơn mẫu.' : 'Đã tạo đơn mẫu trong phiên làm việc local.');
          } catch (error) {
            notify(error instanceof Error ? error.message : 'Không thể lưu đơn.');
          }
        }}
      >
        <div className="create-layout">
          <div>
            <RecipientFields value={value} onChange={update} />
            <ParcelFields value={value} onChange={update} />
          </div>
          <FeeSummary
            value={value}
            onChange={update}
            agreed={agreed}
            setAgreed={setAgreed}
            valid={!errors.length}
            editing={!!editId}
          />
        </div>
      </form>
      {help && <HelpDialog onClose={() => setHelp(false)} />}
    </>
  );
}

export default function CreateOrderPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { orders, updateOrder } = useOrders();
  const editId = params.get('edit') ?? undefined;
  const sourceId = editId ?? params.get('copy');
  const source = orders.find((order) => order.id === sourceId);

  if (editId && source) {
    return (
      <EditOrderView
        order={source}
        onSave={(updated) => updateOrder(editId, updated)}
        onBack={() => navigate('/orders')}
      />
    );
  }

  if (sourceId && !source)
    return (
      <div className="empty" role="alert">
        Không tìm thấy đơn hàng. Dữ liệu mẫu được đặt lại khi tải lại trang.
      </div>
    );

  return (
    <OrderForm
      key={sourceId ?? 'new'}
      initial={source ?? { ...defaultOrderInput }}
      editId={editId}
    />
  );
}


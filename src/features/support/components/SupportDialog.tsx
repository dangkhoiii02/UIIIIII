import { useState } from 'react';
import { ClipboardList, Info, Package } from 'lucide-react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { CustomSelect } from '@/shared/ui/CustomSelect';
import { useToast } from '@/shared/ui/toast-context';
import { getOrderPermission, type Order } from '@/features/orders';
import { useSupport } from '../model/support-context';

const COMMON_CATEGORIES = [
  { value: 'COD', label: 'COD / Tiền thu hộ' },
  { value: 'Nhà Vận Chuyển', label: 'Nhà vận chuyển / Mã vận đơn' },
  { value: 'Đối Soát', label: 'Đối soát' },
  { value: 'Đơn Hàng', label: 'Thông tin đơn hàng' },
];

function getLifecycleCategories(order: Order) {
  const code = order.spfCode;
  const categories: Array<{ value: string; label: string }> = [];
  const add = (value: string, label: string) => {
    if (!categories.some((category) => category.value === value)) categories.push({ value, label });
  };

  if (['SPF-0101', 'SPF-0102', 'SPF-0301', 'SPF-0401', 'SPF-0402', 'SPF-0403'].includes(code)) {
    add('Lấy Hàng', 'Lấy hàng');
  }
  if (['SPF-0102', 'SPF-0201', 'SPF-0202', 'SPF-0301', 'SPF-0401', 'SPF-0402', 'SPF-0403'].includes(code)) {
    add('Hủy Đơn', 'Hủy đơn');
  }
  if (code >= 'SPF-0501' && code <= 'SPF-0901') add('Giao Hàng', 'Giao hàng');
  if (code === 'SPF-0802' || code === 'SPF-0803') add('Giao Lại', 'Giao lại');
  if (code >= 'SPF-0501' && code <= 'SPF-0901') {
    add('Đổi / Thu Hồi', 'Đổi hàng / Thu hồi hàng');
  }
  if (
    ['SPF-0702', 'SPF-0801', 'SPF-0802', 'SPF-0803', 'SPF-0902'].includes(code) ||
    (code >= 'SPF-1001' && code <= 'SPF-1108')
  ) {
    add('Chuyển Hoàn', 'Chuyển hoàn');
  }
  if (code >= 'SPF-1001' && code <= 'SPF-1009') {
    add('Lấy Hàng Hoàn', 'Lấy hàng hoàn');
  }
  if (code >= 'SPF-1101' && code <= 'SPF-1104') {
    add('Bàn Giao Hàng Hoàn', 'Bàn giao hàng hoàn');
  }
  if (code >= 'SPF-1105' && code <= 'SPF-1203') {
    add('Trả Hàng Cuối', 'Trả hàng cuối');
  }

  return categories;
}

export function SupportDialog({
  order,
  onClose,
  initialCategory = '',
  initialContent = '',
}: {
  order: Order;
  onClose: () => void;
  initialCategory?: string;
  initialContent?: string;
}) {
  const lifecycleCategories = getLifecycleCategories(order);
  const [category, setCategory] = useState(
    initialCategory || lifecycleCategories[0]?.value || 'Đơn Hàng',
  );
  const [content, setContent] = useState(initialContent);
  const { addTicket } = useSupport();
  const notify = useToast();
  const viewer = { kind: 'shop' as const, shopId: order.shopId || 'S275518' };
  const categoryOptions = [
    ...lifecycleCategories,
    ...COMMON_CATEGORIES,
    ...(getOrderPermission(viewer, order, 'report_incident').allowed
      ? [{ value: 'Sự Cố', label: 'Báo sự cố' }]
      : []),
    ...(getOrderPermission(viewer, order, 'submit_claim').allowed
      ? [{ value: 'Khiếu Nại', label: 'Khiếu nại' }]
      : []),
    ...(getOrderPermission(viewer, order, 'request_compensation').allowed
      ? [{ value: 'Bồi Thường', label: 'Yêu cầu bồi thường' }]
      : []),
  ];
  if (initialCategory && !categoryOptions.some((option) => option.value === initialCategory)) {
    categoryOptions.push({ value: initialCategory, label: initialCategory });
  }
  return (
    <Modal
      title="Gửi Yêu Cầu Hỗ Trợ"
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Đóng</Button>
          <Button
            type="submit"
            form="support-form"
            variant="primary"
            disabled={!category || !content.trim()}
          >
            Gửi yêu cầu
          </Button>
        </>
      }
    >
      <form
        id="support-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!category || !content.trim()) return;
          addTicket({ orderId: order.id, category, content: content.trim() });
          notify('Đã lưu yêu cầu mẫu trong phiên làm việc local.');
          onClose();
        }}
      >
        <div className="support-modal-content">
          <div className="support-modal-notice">
            <span className="support-modal-notice-icon">
              <Info size={21} />
            </span>
            <div>
              <strong>Các thông tin dưới đây cần lưu ý:</strong>
              <ul>
                <li>
                  <b>Danh mục:</b> Chọn phân loại cho yêu cầu
                </li>
                <li>
                  <b>Nội dung chi tiết:</b> Chỉ rõ chi tiết vấn đề
                </li>
              </ul>
            </div>
          </div>

          <fieldset className="support-order-summary">
            <legend>Đơn hàng</legend>
            <Package size={23} />
            <div>
              <strong>
                {order.phone} - {order.name}
              </strong>
              <span>{order.id}</span>
              <span>
                {order.address}, {order.region}
              </span>
            </div>
          </fieldset>

          <CustomSelect
            label={
              <span>
                Danh mục <b className="red">*</b>
              </span>
            }
            options={categoryOptions}
            value={category}
            onChange={setCategory}
            placeholder="Chọn danh mục"
            icon={ClipboardList}
            className="support-category-select"
          />
          <label className="field support-detail-field">
            <span>
              Nội dung chi tiết <b className="red">*</b>
            </span>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              required
              maxLength={500}
              placeholder="Mô tả chi tiết vấn đề cần hỗ trợ"
            />
            <small className="support-character-count">{content.length}/500 ký tự</small>
          </label>
        </div>
      </form>
    </Modal>
  );
}

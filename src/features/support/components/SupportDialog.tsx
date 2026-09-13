import { useState } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { SelectField } from '@/shared/ui/Field';
import { useToast } from '@/shared/ui/toast-context';
import { useSupport } from '../model/support-context';
export function SupportDialog({
  order,
  onClose,
}: {
  order: { id: string; name: string; phone: string; address: string; region: string };
  onClose: () => void;
}) {
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const { addTicket } = useSupport();
  const notify = useToast();
  return (
    <Modal
      title="Gửi Yêu Cầu Hỗ Trợ"
      onClose={onClose}
      footer={
        <>
          <Button onClick={onClose}>Đóng</Button>
          <Button type="submit" form="support-form" variant="primary">
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
        <div className="step">
          {order.phone} - {order.name}
          <br />
          {order.id}
          <br />
          {order.address}, {order.region}
        </div>
        <SelectField
          label="Danh mục"
          options={['Lấy Hàng', 'Giao Hàng', 'Trả Hàng', 'Đối Soát', 'Đơn Hàng']}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <label className="field">
          <span>
            Nội dung <b className="red">*</b>
          </span>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            required
            maxLength={2000}
          />
        </label>
      </form>
    </Modal>
  );
}

import { CircleDollarSign, Settings, Wallet } from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { money } from '@/shared/lib/format';
import type { OrderInput } from '../model/types';
import { billableWeight } from '../model/order';
export function FeeSummary({
  value,
  onChange,
  agreed,
  setAgreed,
  valid,
  editing,
}: {
  value: OrderInput;
  onChange: (patch: Partial<OrderInput>) => void;
  agreed: boolean;
  setAgreed: (value: boolean) => void;
  valid: boolean;
  editing: boolean;
}) {
  return (
    <div className="summary">
      <Card title="Người trả phí *" icon={<Wallet size={18} />}>
        <div className="radios">
          {(['sender', 'recipient'] as const).map((key) => (
            <label className="choice" key={key}>
              <input
                type="radio"
                name="payer"
                checked={value.payer === key}
                onChange={() => onChange({ payer: key })}
              />
              {key === 'sender' ? 'Người gửi' : 'Người nhận'}
            </label>
          ))}
        </div>
      </Card>
      <Card title="Dịch vụ thêm" icon={<Settings size={18} />}>
        <label className="choice">
          <input
            type="checkbox"
            checked={value.returnGoods}
            onChange={(e) => onChange({ returnGoods: e.target.checked })}
          />
          Đổi / Lấy hàng về
        </label>
      </Card>
      <Card title="Cước phí" icon={<CircleDollarSign size={18} />}>
        <div className="fee-row">
          <span>Giá trị hàng hóa</span>
          <b>{money(value.value || 0)}</b>
        </div>
        <div className="fee-row">
          <span>Khối lượng tính cước</span>
          <b>{billableWeight(value) || 0} gr</b>
        </div>
        {['Phí giao hàng', 'Phí bảo hiểm', 'Phí hàng đổi', 'Phí thu hộ'].map((label) => (
          <div className="fee-row" key={label}>
            <span>{label}</span>
            <b>0 đ</b>
          </div>
        ))}
        <div className="fee-row total">
          <span>Tổng phí vận chuyển</span>
          <b className="green">0 đ</b>
        </div>
        <div className="fee-row">
          <span>Tiền thu hộ</span>
          <b>{money(value.cod || 0)}</b>
        </div>
        <div className="fee-row">
          <strong>Tiền thu người nhận</strong>
          <b className="red">{money(value.cod || 0)}</b>
        </div>
      </Card>
      <label className="choice">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
        Tôi đã đọc và đồng ý với Điều khoản & quy định
      </label>
      <Button type="submit" className="wide" variant="primary" disabled={!valid || !agreed}>
        {editing ? 'Lưu thay đổi' : 'Tạo đơn'}
      </Button>
    </div>
  );
}

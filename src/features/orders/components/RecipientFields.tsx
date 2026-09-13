import { UserRound, MapPin } from 'lucide-react';
import { useState } from 'react';
import { PickupCard } from '@/features/pickup';
import { Field, SelectField } from '@/shared/ui/Field';
import type { OrderInput } from '../model/types';
import { parseQuickInput } from '../model/order';
export function RecipientFields({
  value,
  onChange,
}: {
  value: OrderInput;
  onChange: (patch: Partial<OrderInput>) => void;
}) {
  const [newAddress, setNewAddress] = useState(false);
  const regions = newAddress
    ? [
        'Hà Nội · Phường Từ Liêm',
        'TP. Hồ Chí Minh · Phường Tân Sơn Hòa',
        'Gia Lai · Phường Bình Định',
      ]
    : [
        'Hà Nội · Nam Từ Liêm · Mễ Trì',
        'TP. Hồ Chí Minh · Tân Bình · Phường 13',
        'Bình Định · An Nhơn · Bình Định',
        'Đà Nẵng · Hải Châu · Hòa Cường Bắc',
      ];
  const options =
    value.region && !regions.includes(value.region) ? [value.region, ...regions] : regions;
  return (
    <section className="card">
      <PickupCard />
      <div className="card-title">
        <span className="card-symbol">
          <UserRound size={18} />
        </span>
        <h3>Thông tin người nhận</h3>
      </div>
      <div className="body">
        <label className="field">
          <span>
            Điền nhanh thông tin <span className="red">(Không bắt buộc)</span>
          </span>
          <textarea
            className="quick"
            placeholder={
              'Dán tên người nhận, số điện thoại, địa chỉ và sản phẩm.\nThảo Lê 0987686868\n32 Thân Nhân Trung, Phường 13, Tân Bình, TPHCM\n2 áo sơ mi kiểu'
            }
            onBlur={(e) => {
              if (e.target.value.trim()) onChange(parseQuickInput(e.target.value));
            }}
          />
        </label>
        <p className="hint">
          Dán thông tin rồi chuyển sang ô khác để điền nhanh. Vui lòng kiểm tra lại kết quả.
        </p>
        <div className="grid2">
          <Field
            label="Số điện thoại"
            type="tel"
            value={value.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="Số điện thoại"
            required
          />
          <Field
            label="Tên người nhận"
            value={value.name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="Tên người nhận"
            required
          />
        </div>
        <div className="switches">
          <label>
            <input
              type="checkbox"
              checked={newAddress}
              onChange={(e) => {
                setNewAddress(e.target.checked);
                onChange({ region: '' });
              }}
            />
            Địa chỉ mới
          </label>
        </div>
        <Field
          label="Địa chỉ chi tiết"
          icon={MapPin}
          showInfo={true}
          infoTooltip="Nhập địa chỉ chi tiết nơi giao hàng"
          value={value.address}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="Địa chỉ chi tiết"
          error={!value.address.trim() && (value.name || value.phone) ? 'Địa chỉ chi tiết không được để trống.' : undefined}
          required
        />
        <SelectField
          label="Khu vực"
          options={options}
          value={value.region}
          onChange={(e) => onChange({ region: e.target.value })}
          required
        />
      </div>
    </section>
  );
}

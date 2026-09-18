import { Building2, Info, MapPin, UserRound } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PickupCard } from '@/features/pickup';
import { Field } from '@/shared/ui/Field';
import { CustomSelect } from '@/shared/ui/CustomSelect';
import type { OrderInput } from '../model/types';
import { parseQuickInput } from '../model/order';

const normalizeAdministrativePart = (part: string, level: 'ward' | 'district' | 'city') => {
  const clean = part.trim().replace(/^TP\.\s*/i, 'Thành phố ');
  if (/^(Phường|Xã|Thị trấn|Quận|Huyện|Thị xã|Thành phố|Tỉnh)\s/i.test(clean)) return clean;
  if (level === 'ward') {
    if (clean === 'Chi Đông') return `Thị trấn ${clean}`;
    return `Phường ${clean}`;
  }
  if (level === 'district') {
    if (clean === 'An Nhơn') return `Thị xã ${clean}`;
    if (clean === 'Mê Linh') return `Huyện ${clean}`;
    return `Quận ${clean}`;
  }
  if (['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng'].includes(clean)) return `Thành phố ${clean}`;
  return `Tỉnh ${clean}`;
};

const normalizeRegion = (region: string) => {
  const value = region.trim();
  if (!value) return '';

  const legacyParts = value.split(/\s*[·•]\s*/).filter(Boolean);
  if (legacyParts.length === 3) {
    const city = legacyParts[0]!;
    const district = legacyParts[1]!;
    const ward = legacyParts[2]!;
    return [
      normalizeAdministrativePart(ward, 'ward'),
      normalizeAdministrativePart(district, 'district'),
      normalizeAdministrativePart(city, 'city'),
    ].join(' / ');
  }

  return value
    .split(/\s*\/\s*|\s*,\s*/)
    .filter(Boolean)
    .map((part) => part.replace(/^TP\.\s*/i, 'Thành phố ').trim())
    .join(' / ');
};

export function RecipientFields({
  value,
  onChange,
}: {
  value: OrderInput;
  onChange: (patch: Partial<OrderInput>) => void;
}) {
  const [newAddress, setNewAddress] = useState(false);
  const [autoConvertAddress, setAutoConvertAddress] = useState(false);
  const normalizedRegion = normalizeRegion(value.region);
  const regions = newAddress
    ? [
        'Phường Từ Liêm / Thành phố Hà Nội',
        'Phường Tân Sơn Hòa / Thành phố Hồ Chí Minh',
        'Phường Bình Định / Tỉnh Gia Lai',
      ]
    : [
        'Phường Mễ Trì / Quận Nam Từ Liêm / Thành phố Hà Nội',
        'Phường 13 / Quận Tân Bình / Thành phố Hồ Chí Minh',
        'Phường Bình Định / Thị xã An Nhơn / Tỉnh Bình Định',
        'Phường Hòa Cường Bắc / Quận Hải Châu / Thành phố Đà Nẵng',
      ];
  const options =
    normalizedRegion && !regions.includes(normalizedRegion)
      ? [normalizedRegion, ...regions]
      : regions;

  useEffect(() => {
    if (value.region && normalizedRegion !== value.region) {
      onChange({ region: normalizedRegion });
    }
  }, [normalizedRegion, onChange, value.region]);
  return (
    <section className="card recipient-card">
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
        <div className="switches recipient-address-switches">
          <label>
            <input
              type="checkbox"
              checked={autoConvertAddress}
              onChange={(e) => setAutoConvertAddress(e.target.checked)}
            />
            Tự chuyển 2/3 cấp
            <Info size={14} />
          </label>
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
            <Info size={14} />
          </label>
        </div>
        <label className="recipient-address-detail-field">
          <MapPin size={19} />
          <input
            value={value.address}
            onChange={(e) => onChange({ address: e.target.value })}
            aria-label="Địa chỉ chi tiết"
            required
          />
          {!value.address && (
            <span className="recipient-address-placeholder">
              Địa chỉ chi tiết <b>*</b>
            </span>
          )}
          <span className="recipient-address-info" title="Nhập số nhà, tên đường hoặc tên tòa nhà">
            <Info size={17} />
          </span>
        </label>
        {!value.address.trim() && (value.name || value.phone) ? (
          <span className="field-error-text recipient-address-error">
            Địa chỉ chi tiết không được để trống.
          </span>
        ) : null}
        <CustomSelect
          className="recipient-region-select"
          label={<>Khu vực <b className="required">*</b></>}
          options={[
            { value: '', label: 'Chọn khu vực' },
            ...options.map((option) => ({ value: option, label: option })),
          ]}
          value={normalizedRegion}
          onChange={(region) => onChange({ region })}
          placeholder="Chọn khu vực"
          icon={Building2}
        />
      </div>
    </section>
  );
}

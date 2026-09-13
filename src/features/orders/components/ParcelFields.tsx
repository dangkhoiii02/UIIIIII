import { useEffect, useState } from 'react';
import { Camera, Package } from 'lucide-react';
import { Card } from '@/shared/ui/Card';
import { Field } from '@/shared/ui/Field';
import { Button } from '@/shared/ui/Button';
import type { OrderInput } from '../model/types';
export function ParcelFields({
  value,
  onChange,
}: {
  value: OrderInput;
  onChange: (patch: Partial<OrderInput>) => void;
}) {
  const [mode, setMode] = useState('manual');
  const [query, setQuery] = useState('');
  const [file, setFile] = useState<File>();
  const [imageUrl, setImageUrl] = useState('');
  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  return (
    <Card title="Chi tiết hàng gửi" icon={<Package size={18} />}>
      <div className="radios">
        {[
          ['manual', 'Nhập liệu thủ công'],
          ['list', 'Chọn từ danh sách'],
        ].map(([key, label]) => (
          <label className="choice" key={key}>
            <input
              type="radio"
              name="productMode"
              value={key}
              checked={mode === key}
              onChange={(e) => setMode(e.target.value)}
            />
            {label}
          </label>
        ))}
      </div>
      {mode === 'list' && (
        <div className="product-table">
          <Field
            label="Chọn sản phẩm"
            value={query}
            placeholder="Tìm sản phẩm"
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && 'mỹ phẩm'.includes(query.toLocaleLowerCase('vi')) ? (
            <Button onClick={() => onChange({ product: 'Mỹ phẩm', value: 200000, cod: 200000 })}>
              Mỹ phẩm · 200.000 đ · Chọn sản phẩm
            </Button>
          ) : (
            <div className="empty">Chưa có sản phẩm</div>
          )}
        </div>
      )}
      <div className="grid2">
        <Field
          label="Tên sản phẩm"
          value={value.product}
          onChange={(e) => onChange({ product: e.target.value })}
          required
        />
        <Field
          label="Khối lượng (gr)"
          type="number"
          min={1}
          value={value.weight}
          onChange={(e) => onChange({ weight: e.target.valueAsNumber })}
          required
        />
        <Field
          label="Giá trị (đ)"
          type="number"
          min={0}
          value={value.value}
          onChange={(e) => onChange({ value: e.target.valueAsNumber })}
          required
        />
        <Field
          label="Thu hộ (đ)"
          type="number"
          min={0}
          value={value.cod}
          onChange={(e) => onChange({ cod: e.target.valueAsNumber })}
          required
        />
      </div>
      <div className="section-label">
        Kích thước <span className="red">(Không bắt buộc)</span>
        <span className="pull-right">
          Khối lượng quy đổi: {Math.ceil((value.length * value.width * value.height) / 5) || 0} gr
        </span>
      </div>
      <div className="grid3">
        {(['length', 'width', 'height'] as const).map((key, i) => (
          <Field
            key={key}
            label={['Chiều dài (cm)', 'Chiều rộng (cm)', 'Chiều cao (cm)'][i]!}
            type="number"
            min={0}
            value={value[key]}
            onChange={(e) => onChange({ [key]: e.target.valueAsNumber })}
          />
        ))}
      </div>
      <div className="section-label">
        Xem/thử hàng <span className="red">*</span>
      </div>
      <div className="stack">
        {(
          [
            ['view', 'Cho Xem Hàng Nhưng Không Cho Thử'],
            ['try', 'Cho Thử Hàng'],
            ['none', 'Không Cho Xem Hàng'],
          ] as const
        ).map(([key, label]) => (
          <label className="choice" key={key}>
            <input
              type="radio"
              name="inspection"
              checked={value.inspection === key}
              onChange={() => onChange({ inspection: key })}
            />
            {label}
          </label>
        ))}
      </div>
      <div className="grid2">
        <Field
          label="Mã đơn riêng"
          value={value.privateId}
          onChange={(e) => onChange({ privateId: e.target.value })}
        />
        <label className="choice">
          <input
            type="checkbox"
            checked={value.returnGoods}
            onChange={(e) => onChange({ returnGoods: e.target.checked })}
          />
          Đổi / Lấy hàng về
        </label>
      </div>
      <label className="field">
        <span>Ghi chú khi giao</span>
        <textarea
          value={value.note}
          onChange={(e) => onChange({ note: e.target.value })}
          rows={3}
          maxLength={120}
        />
      </label>
      <p className="hint text-right">{value.note.length} / 120 ký tự</p>
      <div className="section-label">
        Ảnh hàng hóa <span className="red">(Không bắt buộc)</span>
      </div>
      <label className="upload" title="Chọn ảnh hàng hóa">
        {imageUrl ? <img src={imageUrl} alt="Ảnh hàng hóa" /> : <Camera />}
        <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0])} />
      </label>
    </Card>
  );
}

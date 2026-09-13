import { useState } from 'react';
import { readPreference, writePreference } from '../lib/storage';
import { Modal } from './Modal';
export function HelpDialog({ onClose }: { onClose: () => void }) {
  const [hidden, setHidden] = useState(readPreference('hide-help') === '1');
  return (
    <Modal title="Hướng Dẫn Sử Dụng" onClose={onClose} wide>
      <label className="choice red">
        <input
          type="checkbox"
          checked={hidden}
          onChange={(e) => {
            setHidden(e.target.checked);
            writePreference('hide-help', e.target.checked ? '1' : '0');
          }}
        />
        Ẩn hướng dẫn cho những lần tải trang sau
      </label>
      <div className="step-title">Bước 1</div>
      <div className="step pink">
        Nhập các trường bắt buộc:{' '}
        <b>
          Tên Người Nhận, SĐT Người Nhận, Địa Chỉ Chi Tiết, Sản Phẩm, Khối Lượng, Thu Hộ, Giá Trị.
        </b>
        <p>Chọn Đổi / Lấy hàng về nếu có nhu cầu và thêm ghi chú giao hàng.</p>
        <span className="green">Các trường có dấu hoa thị [*] là các trường bắt buộc.</span>
      </div>
      <div className="step-title">Bước 2</div>
      <div className="step">
        Chọn chính xác tỉnh/thành phố và phường/xã theo địa chỉ người nhận.
        <p className="red">Vui lòng kiểm tra lại dữ liệu trước khi tạo đơn.</p>
      </div>
      <div className="step-title">Bước 3</div>
      <div className="step">
        Chọn <b>Kiểm tra dữ liệu</b>. Dòng hợp lệ sẽ có nền xanh.
        <p>
          Nhấn <b>Tạo nhiều đơn</b> để tạo đơn mẫu trong bản UI local.
        </p>
      </div>
    </Modal>
  );
}

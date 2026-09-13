import { useState } from 'react';
import { MapPin } from 'lucide-react';
import { usePickup } from '../model/pickup-context';
import { Modal } from '@/shared/ui/Modal';
import { Field } from '@/shared/ui/Field';
import { Button } from '@/shared/ui/Button';
export function PickupCard() {
  const { address, setAddress } = usePickup();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(address);
  return (
    <>
      <div className="pickup">
        <MapPin className="red" size={24} />
        <div>
          <strong>Địa chỉ lấy hàng</strong>
          <br />
          {address}
          <br />
          <b>Raspberry Pi VN - 092****688</b>
        </div>
        <Button
          onClick={() => {
            setDraft(address);
            setEditing(true);
          }}
        >
          Thay đổi
        </Button>
      </div>
      {editing && (
        <Modal
          title="Thay đổi địa chỉ lấy hàng"
          onClose={() => setEditing(false)}
          footer={
            <>
              <Button onClick={() => setEditing(false)}>Đóng</Button>
              <Button variant="primary" form="pickup-form" type="submit">
                Lưu địa chỉ
              </Button>
            </>
          }
        >
          <form
            id="pickup-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (draft.trim()) {
                setAddress(draft.trim());
                setEditing(false);
              }
            }}
          >
            <Field
              label="Địa chỉ lấy hàng"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              required
            />
          </form>
        </Modal>
      )}
    </>
  );
}

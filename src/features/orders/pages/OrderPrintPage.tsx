import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft } from 'lucide-react';
import { useOrders } from '../model/orders-context';
import { money } from '@/shared/lib/format';
import { BarcodeSvg, QrCodeSvg } from '@/shared/ui/BarcodeAndQr';
import type { Order } from '../model/types';

interface TemplateOption {
  key: string;
  label: string;
  dimensions: string;
  aspect: string;
}

const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    key: 'A6',
    label: 'IN A6',
    dimensions: '105 mm x 148 mm (4.1 in x 5.8 in)',
    aspect: '4.1 / 5.8',
  },
  {
    key: 'A7',
    label: 'IN A7',
    dimensions: '75 mm x 100 mm (3.0 in x 3.9 in)',
    aspect: '3.0 / 3.9',
  },
  { key: 'S8', label: 'IN S8', dimensions: '9 cm x 6 cm (3.5 in x 2.4 in)', aspect: '3.5 / 2.4' },
  { key: 'S9', label: 'IN S9', dimensions: '9 cm x 6 cm (3.5 in x 2.4 in)', aspect: '3.5 / 2.4' },
  { key: 'S10', label: 'IN S10', dimensions: '4 in x 6 in', aspect: '4 / 6' },
  { key: 'S11', label: 'IN S11', dimensions: '100 mm x 180 mm (4 in x 7 in)', aspect: '4 / 7' },
  {
    key: 'S12',
    label: 'IN S12',
    dimensions: '75 mm x 50 mm (3.0 in x 2.0 in)',
    aspect: '3.0 / 2.0',
  },
  { key: 'S13', label: 'IN S13', dimensions: '50 mm x 50 mm (2.0 in x 2.0 in)', aspect: '1 / 1' },
];

export default function OrderPrintPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { orders, markPrinted } = useOrders();

  const [activeTemplate, setActiveTemplate] = useState<string>('S10');

  // Find order or fallback matching mock
  const order: Order = orders.find((o) => o.id === id) || {
    id: id || '826923696',
    name: 'Bùi Duy Khang',
    phone: '034****352',
    address: 'Khu Phố Vạn Phước',
    region: 'Phường Xuân Thành, Thị xã Sông Cầu, Tỉnh Phú Yên',
    product: 'Sách',
    weight: 350,
    value: 0,
    cod: 0,
    length: 10,
    width: 10,
    height: 10,
    privateId: '',
    note: '',
    payer: 'sender' as const,
    inspection: 'view' as const,
    returnGoods: false,
    createdAt: '14/09/2026',
    status: 'Chờ lấy hàng' as const,
    spfCode: 'SPF-0301' as const,
    printed: false,
    batchId: '',
    reconciliationId: '',
    shippingInfo: {
      pickupCarrier: 'SuperShip',
      deliveryCarrier: 'SPX',
      deliveryTracking: 'SPXVN066263841279',
      carrierStatusText: 'SPX – Chuẩn bị giao',
    },
  };

  const trackingCode = order.shippingInfo?.deliveryTracking || 'SPXVN066263841279';
  const carrierName = order.shippingInfo?.deliveryCarrier || 'SPX';
  const currentTemplate: TemplateOption =
    TEMPLATE_OPTIONS.find((t) => t.key === activeTemplate) || TEMPLATE_OPTIONS[4]!;

  const handlePrint = () => {
    const isInternal = localStorage.getItem('superplatform:view_mode') === 'internal';
    markPrinted([order.id], {
      printedBy: isInternal
        ? 'Nhân viên nội bộ SuperPlatform'
        : `${order.shopId || 'Shop'} · ${order.shopName || 'Cửa hàng'}`,
      actorType: isInternal ? 'internal' : 'shop',
      waybill: trackingCode,
      templateType: `${activeTemplate} · ${currentTemplate.dimensions}`,
      status: 'Thành công',
    });
    window.print();
  };

  const createdDateStr = (order.createdAt || '').split('•')[0]?.trim() || '14/09/2026';

  return (
    <div className="print-preview-page-wrapper">
      {/* Top Controls Bar (hidden during physical print) */}
      <header className="print-controls-top-bar no-print">
        <div className="print-controls-inner">
          <button
            type="button"
            className="btn-print-back"
            onClick={() => navigate(`/orders/${order.id}`)}
            title="Quay lại trang chi tiết đơn hàng"
          >
            <ArrowLeft size={16} />
            <span>Quay lại</span>
          </button>

          <div className="print-template-pills-row">
            {TEMPLATE_OPTIONS.map((tmpl) => (
              <button
                key={tmpl.key}
                type="button"
                className={`btn-print-pill ${activeTemplate === tmpl.key ? 'active' : ''}`}
                onClick={() => setActiveTemplate(tmpl.key)}
              >
                <Printer size={13} />
                <span>{tmpl.label}</span>
              </button>
            ))}

            <button type="button" className="btn-do-print" onClick={handlePrint}>
              <Printer size={14} />
              <span>IN TEM</span>
            </button>
          </div>
        </div>

        <div className="print-dimension-hint">
          Kích thước tem in: <strong>{currentTemplate.dimensions}</strong>
        </div>
      </header>

      {/* Main Print Stage / Centered Thermal Label Sheet */}
      <main className="print-stage-canvas">
        <div className="thermal-print-paper-sheet">
          {/* 1. Header Row */}
          <div className="thermal-label-header">
            <div className="thermal-order-id">{order.id}</div>
            <div className="thermal-date-carrier">
              {createdDateStr} | <strong>{carrierName}</strong>
            </div>
          </div>

          {/* 2. Barcode & Tracking Number */}
          <div className="thermal-barcode-section">
            <BarcodeSvg value={trackingCode} width="100%" height={52} />
            <div className="thermal-tracking-text">{trackingCode}</div>
          </div>

          {/* 3. 3-Cell Box: Mã Phân Loại | Tiền Thu | QR Code */}
          <div className="thermal-routing-box">
            <div className="routing-cell cell-sort-code">
              <div className="routing-cell-label">Mã Phân Loại</div>
              <div className="routing-cell-val-bold">
                MTA-40-02-
                <br />
                SC09 | XT-01
              </div>
            </div>

            <div className="routing-cell cell-cod-value">
              <div className="routing-cell-label">Tiền thu người nhận</div>
              <div className="routing-cell-val-cod">{order.cod > 0 ? money(order.cod) : '0 đ'}</div>
            </div>

            <div className="routing-cell cell-qr-code">
              <QrCodeSvg value={trackingCode} size={64} />
            </div>
          </div>

          {/* 4. Destination / Recipient Address */}
          <div className="thermal-recipient-section">
            <div className="recipient-street-bold-italic">{order.address}</div>
            <div className="recipient-region-line">
              {order.region ? order.region.replace(/\s*·\s*/g, ', ') : ''}
            </div>
            <div className="recipient-contact-line">
              {order.phone}, {order.name}
            </div>
          </div>

          {/* 5. Dashed Divider */}
          <div className="thermal-dashed-divider" />

          {/* 6. Sender Info */}
          <div className="thermal-sender-row">
            <span>
              Người gửi: <strong>AB</strong>
            </span>
          </div>

          {/* 7. Notes & Items Content */}
          <div className="thermal-notes-section">
            <div className="thermal-notes-heading">Ghi Chú:</div>
            {order.note && <div className="thermal-note-desc">{order.note}</div>}
            <div className="thermal-goods-content-label">NỘI DUNG HÀNG GỬI</div>
            <div className="thermal-goods-content-items">{order.product || 'Sách'}</div>
          </div>
        </div>
      </main>
    </div>
  );
}

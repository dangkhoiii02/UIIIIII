import { useMemo, useState } from 'react';
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { RotateCcw, FileText, Printer, ChevronDown } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { useToast } from '@/shared/ui/toast-context';
import { downloadCsv } from '@/shared/lib/format';
import { OrderFilters } from '../components/OrderFilters';
import { OrderTable, type OrderAction } from '../components/OrderTable';
import { OrderDialogs, type OrderDialogState } from '../components/OrderDialogs';
import { useOrders } from '../model/orders-context';
import { emptyFilters, type Order } from '../model/types';
import { filterOrders } from '../model/order';

const tabs = [
  ['Tất cả', ''],
  ['Chưa lấy hàng', 'Chờ Lấy Hàng'],
  ['Đã lấy hàng - Đang giao hàng', 'Đang giao hàng'],
  ['Hoãn giao hàng', 'Hoãn giao hàng'],
  ['Đã giao hàng', 'Đã giao hàng'],
  ['Đang chuyển hoàn', 'Đang chuyển hoàn'],
  ['Đã trả hàng', 'Đã trả hàng'],
  ['Đã hủy', 'Đã hủy'],
];

const PRINT_TEMPLATES = [
  { id: 'A7', label: 'A7 (75 mm x 100 mm)' },
  { id: 'A5', label: 'A5 (148 mm x 210 mm)' },
  { id: 'K46', label: 'K46 (4 in x 6 in)' },
  { id: 'K50', label: 'K50 (50 mm x 50 mm)' },
  { id: 'K75', label: 'K75 (75 mm x 50 mm)' },
  { id: 'K80', label: 'K80 (80 mm x 80 mm)' },
  { id: 'SPE', label: 'SPE (105 mm x 35 mm)' },
  { id: 'T2', label: 'T2 (210 mm x 280 mm)' },
  { id: 'S8', label: 'S8 (9 cm x 6 cm)' },
  { id: 'S9', label: 'S9 (9 cm x 6 cm)' },
];

export default function OrdersPage() {
  const { orders, resetDb } = useOrders();
  const navigate = useNavigate();
  const notify = useToast();
  const [params] = useSearchParams();
  const outletCtx = useOutletContext<{ isInternal?: boolean }>();
  const isInternal = outletCtx?.isInternal ?? false;

  const [filters, setFilters] = useState({ ...emptyFilters });
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [dialog, setDialog] = useState<OrderDialogState>();

  const [printType, setPrintType] = useState('K46');
  const [showPrintPopover, setShowPrintPopover] = useState(false);

  const query = params.get('q') ?? '';
  const list = useMemo(
    () => filterOrders(orders, { ...filters, query, status: status || filters.status }),
    [orders, filters, query, status],
  );

  const handleAction = (action: OrderAction, order: Order) => {
    if (action === 'detail') navigate(`/orders/${encodeURIComponent(order.id)}`);
    else if (action === 'edit' || action === 'copy')
      navigate('/create?' + action + '=' + encodeURIComponent(order.id));
    else if (action === 'print') setDialog({ type: 'print', orders: [order] });
    else setDialog({ type: action, order });
  };

  const hasSelected = selected.length > 0;

  return (
    <>
      <div className="title-row">
        <h1>
          Đơn hàng <span className="badge-blue">{orders.length}</span>
        </h1>
        <div className="actions">
          <Button
            className="btn-soft-grey"
            onClick={() => {
              if (window.confirm('Bạn có chắc muốn đặt lại dữ liệu DB mẫu? Tất cả đơn hàng tự tạo sẽ được khởi tạo lại.')) {
                resetDb();
                notify('Đã đặt lại dữ liệu DB mẫu thành công!');
              }
            }}
          >
            <RotateCcw size={15} />
            <span>Reset DB</span>
          </Button>

          <Button
            className={hasSelected ? 'btn-soft-grey btn-excel-active' : 'btn-soft-grey'}
            onClick={() =>
              downloadCsv('superplatform-orders.csv', [
                ['Mã đơn', 'Người nhận', 'Điện thoại', 'Sản phẩm', 'Thu hộ', 'Trạng thái'],
                ...list
                  .filter((o) => (!hasSelected || selected.includes(o.id)))
                  .map((o) => [o.id, o.name, o.phone, o.product, o.cod, o.status]),
              ])
            }
          >
            <FileText size={15} />
            <span>Xuất EXCEL{hasSelected ? ` [${selected.length}]` : ''}</span>
          </Button>

          <div className="print-dropdown-wrapper">
            <div className="btn-split-group">
              <button
                type="button"
                className={`btn-split-main ${hasSelected ? 'btn-soft-grey btn-print-active' : 'btn-soft-grey'}`}
                onClick={() => {
                  const items = list.filter((o) => selected.includes(o.id));
                  if (!items.length) notify('Vui lòng chọn đơn cần in.');
                  else setDialog({ type: 'print', orders: items });
                }}
              >
                <Printer size={15} />
                <span>
                  In tem ({printType}){hasSelected ? ` [${selected.length}]` : ''}
                </span>
              </button>

              <button
                type="button"
                className={`btn-split-chevron ${hasSelected ? 'btn-soft-grey btn-print-active' : 'btn-soft-grey'}`}
                onClick={() => setShowPrintPopover(!showPrintPopover)}
                aria-label="Chọn loại tem in"
              >
                <ChevronDown size={14} />
              </button>
            </div>

            {showPrintPopover && (
              <div className="print-template-popover">
                {PRINT_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className={`print-template-item ${printType === tmpl.id ? 'selected' : ''}`}
                    onClick={() => {
                      setPrintType(tmpl.id);
                      setShowPrintPopover(false);
                      notify(`Đã chọn loại tem: ${tmpl.label}`);
                    }}
                  >
                    <span className={`radio-dot-icon ${printType === tmpl.id ? 'checked' : ''}`} />
                    <span>{tmpl.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="tabs" role="group" aria-label="Trạng thái đơn hàng">
        {tabs.map(([title, value]) => (
          <button
            key={title}
            className={'tab ' + (status === value ? 'active' : '')}
            aria-pressed={status === value}
            onClick={() => {
              setStatus(value!);
              setSelected([]);
            }}
          >
            {title} ({value ? orders.filter((o) => o.status === value).length : orders.length})
          </button>
        ))}
      </div>
      {query && (
        <p>
          Kết quả tra cứu: <b>{query}</b>
        </p>
      )}
      <OrderFilters
        initial={filters}
        isInternal={isInternal}
        onApply={(value) => {
          setFilters(value);
          setSelected([]);
        }}
      />
      <OrderTable
        orders={list}
        selected={selected}
        onSelect={setSelected}
        onAction={handleAction}
      />
      {dialog && <OrderDialogs state={dialog} onClose={() => setDialog(undefined)} />}
    </>
  );
}


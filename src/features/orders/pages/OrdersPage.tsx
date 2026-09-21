import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useOutletContext, useSearchParams } from 'react-router-dom';
import { RotateCcw, FileDown, Printer, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { AsyncStatePanel } from '@/shared/ui/AsyncStatePanel';
import { useToast } from '@/shared/ui/toast-context';
import { downloadCsv } from '@/shared/lib/format';
import { OrderFilters } from '../components/OrderFilters';
import { OrderTable, type OrderAction } from '../components/OrderTable';
import { OrderDialogs, type OrderDialogState } from '../components/OrderDialogs';
import { useOrders } from '../model/orders-context';
import { emptyFilters, type Order } from '../model/types';
import { filterOrders } from '../model/order';
import { getSpfLifecyclePhase, isSpfFailureStatus } from '../model/spf-status-catalog';
import { getOrderPermission, type OrderViewer } from '../model/order-permissions';

type QuickFilterId =
  | 'all'
  | 'unpicked'
  | 'shipping'
  | 'delivery_failed'
  | 'delivered'
  | 'returning'
  | 'returned'
  | 'cancelled'
  | 'needs_response'
  | 'needs_processing'
  | 'incident'
  | 'return_cancel'
  | 'sync_error';

const PAGE_SIZE = 10;

const SHOP_TABS: Array<[string, QuickFilterId]> = [
  ['Tất cả', 'all'],
  ['Chưa lấy hàng', 'unpicked'],
  ['Đang vận chuyển', 'shipping'],
  ['Giao thất bại', 'delivery_failed'],
  ['Đã giao hàng', 'delivered'],
  ['Đang hoàn', 'returning'],
  ['Đã trả hàng', 'returned'],
  ['Đã hủy', 'cancelled'],
  ['Cần phản hồi', 'needs_response'],
];

const INTERNAL_TABS: Array<[string, QuickFilterId]> = [
  ['Tất cả', 'all'],
  ['Chờ xử lý', 'needs_processing'],
  ['Đang vận chuyển', 'shipping'],
  ['Có sự cố', 'incident'],
  ['Hoàn - Hủy', 'return_cancel'],
  ['Đồng bộ lỗi', 'sync_error'],
];

function matchesQuickFilter(order: Order, filter: QuickFilterId): boolean {
  const phase = getSpfLifecyclePhase(order.spfCode);
  if (filter === 'all') return true;
  if (filter === 'unpicked')
    return ['creating', 'pickup'].includes(phase) && order.spfCode < 'SPF-0501';
  if (filter === 'shipping') return ['handover', 'delivery'].includes(phase);
  if (filter === 'delivery_failed') return order.spfCode === 'SPF-0802';
  if (filter === 'delivered') return order.spfCode === 'SPF-0901';
  if (filter === 'returning') return phase === 'return' || order.spfCode === 'SPF-0902';
  if (filter === 'returned') return phase === 'returned';
  if (filter === 'cancelled') return order.spfCode === 'SPF-0201';
  if (filter === 'needs_response')
    return order.supportStatus === 'PENDING' || order.supportStatus === 'PROCESSING';
  if (filter === 'needs_processing')
    return (
      Boolean(order.supportStatus) || Boolean(order.incidentType) || order.syncStatus === 'FAILED'
    );
  if (filter === 'incident')
    return Boolean(order.incidentType) || isSpfFailureStatus(order.spfCode);
  if (filter === 'return_cancel')
    return phase === 'return' || phase === 'returned' || phase === 'cancelled';
  return order.syncStatus === 'FAILED';
}

export default function OrdersPage() {
  const { orders, resetDb } = useOrders();
  const navigate = useNavigate();
  const notify = useToast();
  const [params] = useSearchParams();
  const outletCtx = useOutletContext<{ isInternal?: boolean }>();
  const isInternal = outletCtx?.isInternal ?? false;
  const viewerForOrder = (order: Order): OrderViewer =>
    isInternal
      ? { kind: 'internal' }
      : { kind: 'shop', shopId: order.shopId || 'S275518' };

  const [filters, setFilters] = useState({ ...emptyFilters });
  const [quickFilter, setQuickFilter] = useState<QuickFilterId>('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [dialog, setDialog] = useState<OrderDialogState>();
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const tabsRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);
  const hasMovedRef = useRef(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tabsRef.current) return;
    isDraggingRef.current = true;
    hasMovedRef.current = false;
    startXRef.current = e.pageX - tabsRef.current.offsetLeft;
    scrollLeftRef.current = tabsRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !tabsRef.current) return;
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = x - startXRef.current;
    if (Math.abs(walk) > 3) {
      hasMovedRef.current = true;
    }
    tabsRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDraggingRef.current = false;
  };

  const query = params.get('q') ?? '';
  const tabs = isInternal ? INTERNAL_TABS : SHOP_TABS;
  const list = useMemo(
    () =>
      filterOrders(orders, { ...filters, query: query || filters.query }).filter((order) =>
        matchesQuickFilter(order, quickFilter),
      ),
    [orders, filters, query, quickFilter],
  );
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const paginatedList = useMemo(() => {
    const offset = (currentPage - 1) * PAGE_SIZE;
    return list.slice(offset, offset + PAGE_SIZE);
  }, [list, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, query, quickFilter, isInternal]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  useEffect(() => {
    setQuickFilter('all');
    setSelected([]);
  }, [isInternal]);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 320);
    return () => window.clearTimeout(timer);
  }, []);

  const handleAction = (action: OrderAction, order: Order) => {
    if (action === 'detail') navigate(`/orders/${encodeURIComponent(order.id)}`);
    else if (action === 'carrier')
      navigate(`/carrier-operations?orderId=${encodeURIComponent(order.id)}`);
    else if (action === 'support' && isInternal)
      navigate(`/requests?orderId=${encodeURIComponent(order.id)}`);
    else if (action === 'copy') navigate(`/create?copy=${encodeURIComponent(order.id)}`);
    else if (action === 'edit') {
      const decision = getOrderPermission(viewerForOrder(order), order, 'edit_order');
      if (decision.mode === 'request_support') {
        setDialog({
          type: 'support',
          order,
          initialCategory: 'Đơn Hàng',
          initialContent: `Yêu cầu sửa thông tin đơn hàng ${order.id}. ${decision.reason || ''}`.trim(),
        });
      } else if (decision.allowed) setDialog({ type: 'edit', order });
    }
    else if (action === 'print') setDialog({ type: 'print', orders: [order] });
    else if (action === 'cancel') {
      const decision = getOrderPermission(viewerForOrder(order), order, 'cancel_order');
      if (decision.mode === 'request_support') {
        setDialog({
          type: 'support',
          order,
          initialCategory: 'Đơn Hàng',
          initialContent: `Yêu cầu hủy đơn hàng ${order.id}. ${decision.reason || ''}`.trim(),
        });
      } else if (decision.allowed) setDialog({ type: 'cancel', order });
    } else setDialog({ type: action, order });
  };

  const hasSelected = selected.length > 0;

  return (
    <>
      <div className="orders-header-row">
        <div className="orders-title-wrap">
          <button
            type="button"
            className="btn-round-back"
            onClick={() => navigate(-1)}
            aria-label="Quay lại"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="orders-page-title">
            Đơn Hàng <span className="orders-count-text">({orders.length})</span>
          </h1>
        </div>
        <div className="orders-header-aux">
          <Button
            className="btn-soft-grey"
            onClick={() => {
              if (
                window.confirm(
                  'Bạn có chắc muốn đặt lại dữ liệu DB mẫu? Tất cả đơn hàng tự tạo sẽ được khởi tạo lại.',
                )
              ) {
                resetDb();
                notify('Đã đặt lại dữ liệu DB mẫu thành công!');
              }
            }}
          >
            <RotateCcw size={14} />
            <span>Reset DB</span>
          </Button>
        </div>
      </div>

      <div className="orders-tabs-bar">
        <div
          ref={tabsRef}
          className="status-tabs-list"
          role="group"
          aria-label="Trạng thái đơn hàng"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          {tabs.map(([title, value]) => {
            const count = orders.filter((order) => matchesQuickFilter(order, value)).length;
            return (
              <button
                key={title}
                className={'status-tab-pill ' + (quickFilter === value ? 'active' : '')}
                aria-pressed={quickFilter === value}
                onClick={() => {
                  if (hasMovedRef.current) return;
                  setQuickFilter(value);
                  setSelected([]);
                }}
              >
                {title} ({count})
              </button>
            );
          })}
        </div>

        <div className="orders-batch-actions">
          <button
            type="button"
            className={`btn-order-action ${hasSelected ? 'btn-excel-active' : ''}`}
            onClick={() => {
              if (!hasSelected) {
                notify('Vui lòng chọn ít nhất 1 đơn hàng để xuất Excel.');
                return;
              }
              const selectedOrders = list.filter((o) => selected.includes(o.id));
              const exportableOrders = selectedOrders.filter((order) =>
                getOrderPermission(viewerForOrder(order), order, 'export_order').allowed,
              );
              if (!exportableOrders.length) {
                notify('Các đơn đã chọn chưa đủ điều kiện xuất dữ liệu.');
                return;
              }
              if (exportableOrders.length < selectedOrders.length) {
                notify(`Đã bỏ qua ${selectedOrders.length - exportableOrders.length} đơn chưa đủ điều kiện xuất.`);
              }
              downloadCsv('superplatform-orders.csv', [
                ['Mã đơn', 'Người nhận', 'Điện thoại', 'Sản phẩm', 'Thu hộ', 'Trạng thái'],
                ...exportableOrders.map((o) => [o.id, o.name, o.phone, o.product, o.cod, o.status]),
              ]);
            }}
          >
            <FileDown size={17} />
            <span>XUẤT EXCEL{hasSelected ? ` (${selected.length})` : ''}</span>
          </button>

          <button
            type="button"
            className={`btn-order-action ${hasSelected ? 'btn-print-active' : ''}`}
            onClick={() => {
              const items = list.filter((o) => selected.includes(o.id));
              if (!items.length) {
                notify('Vui lòng chọn ít nhất 1 đơn hàng để in tem.');
              } else {
                setDialog({ type: 'print', orders: items });
              }
            }}
          >
            <Printer size={17} />
            <span>IN TEM{hasSelected ? ` (${selected.length})` : ''}</span>
          </button>
        </div>
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
      {isLoading ? (
        <AsyncStatePanel state="loading" />
      ) : list.length ? (
        <OrderTable
          orders={paginatedList}
          totalCount={list.length}
          currentPage={currentPage}
          pageSize={PAGE_SIZE}
          selected={selected}
          onSelect={setSelected}
          onAction={handleAction}
          onPageChange={(page) => {
            setCurrentPage(Math.min(totalPages, Math.max(1, page)));
            setSelected([]);
          }}
          isInternal={isInternal}
        />
      ) : (
        <AsyncStatePanel
          state="empty"
          title={query ? 'Không tìm thấy Order phù hợp' : undefined}
          description={
            query
              ? `Không có kết quả cho “${query}”. Hãy kiểm tra lại mã đơn, mã vận đơn hoặc số điện thoại.`
              : 'Không có Order phù hợp với bộ lọc và trạng thái đang chọn.'
          }
          actionLabel="Xóa bộ lọc"
          onAction={() => {
            setFilters({ ...emptyFilters });
            setQuickFilter('all');
          }}
        />
      )}
      {dialog && <OrderDialogs state={dialog} onClose={() => setDialog(undefined)} />}
    </>
  );
}

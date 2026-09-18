import { useMemo, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  BarChart3,
  CheckCircle2,
  Clock3,
  Download,
  PackageCheck,
  RotateCcw,
  TrendingUp,
  Truck,
} from 'lucide-react';
import { getSpfLifecyclePhase, isSpfFailureStatus, useOrders, type Order } from '@/features/orders';
import { downloadCsv } from '@/shared/lib/format';
import { CustomSelect, type SelectOption } from '@/shared/ui/CustomSelect';

type Metric = 'all' | 'delivered' | 'return' | 'aging';

const PERIOD_OPTIONS: SelectOption[] = [
  { value: '7', label: '7 ngày gần nhất' },
  { value: '30', label: '30 ngày gần nhất' },
  { value: '90', label: '90 ngày gần nhất' },
];

function carrierOf(order: Order) {
  return (
    order.shippingInfo?.deliveryCarrier || order.shippingInfo?.pickupCarrier || 'Chưa phân tuyến'
  );
}

export default function InternalReportsPage() {
  const { orders } = useOrders();
  const { isInternal = false } = useOutletContext<{ isInternal?: boolean }>();
  const [metric, setMetric] = useState<Metric>('all');
  const [carrier, setCarrier] = useState('');
  const [period, setPeriod] = useState('30');

  const delivered = orders.filter((order) => order.spfCode === 'SPF-0901');
  const returned = orders.filter((order) =>
    ['return', 'returned'].includes(getSpfLifecyclePhase(order.spfCode)),
  );
  const aging = orders.filter(
    (order) =>
      ['creating', 'pickup'].includes(getSpfLifecyclePhase(order.spfCode)) ||
      isSpfFailureStatus(order.spfCode),
  );
  const carriers = useMemo(() => [...new Set(orders.map(carrierOf))], [orders]);
  const carrierOptions = useMemo<SelectOption[]>(
    () => [
      { value: '', label: 'Tất cả nhà vận chuyển' },
      ...carriers.map((name) => ({ value: name, label: name })),
    ],
    [carriers],
  );

  const benchmark = useMemo(
    () =>
      carriers.map((name) => {
        const carrierOrders = orders.filter((order) => carrierOf(order) === name);
        const success = carrierOrders.filter((order) => order.spfCode === 'SPF-0901').length;
        const exceptions = carrierOrders.filter(
          (order) => isSpfFailureStatus(order.spfCode) || order.incidentType,
        ).length;
        return {
          name,
          total: carrierOrders.length,
          successRate: carrierOrders.length
            ? Math.round((success / carrierOrders.length) * 100)
            : 0,
          exceptionRate: carrierOrders.length
            ? Math.round((exceptions / carrierOrders.length) * 100)
            : 0,
        };
      }),
    [carriers, orders],
  );

  const detailRows = orders.filter((order) => {
    if (carrier && carrierOf(order) !== carrier) return false;
    if (metric === 'delivered') return order.spfCode === 'SPF-0901';
    if (metric === 'return')
      return ['return', 'returned'].includes(getSpfLifecyclePhase(order.spfCode));
    if (metric === 'aging')
      return (
        ['creating', 'pickup'].includes(getSpfLifecyclePhase(order.spfCode)) ||
        isSpfFailureStatus(order.spfCode)
      );
    return true;
  });

  const successRate = orders.length ? Math.round((delivered.length / orders.length) * 100) : 0;
  const returnRate = orders.length ? Math.round((returned.length / orders.length) * 100) : 0;

  return (
    <div className="internal-page">
      <div className="internal-page-heading">
        <div>
          <span className="internal-kicker">
            {isInternal ? 'I05 · BÁO CÁO NỘI BỘ' : 'BÁO CÁO SHOP'}
          </span>
          <h1>{isInternal ? 'Báo cáo đơn hàng — Nội bộ' : 'Thống kê đơn hàng'}</h1>
          <p>
            {isInternal
              ? 'Theo dõi hạn xử lý, hiệu quả nhà vận chuyển và xem chi tiết đơn tồn đọng.'
              : 'Tổng quan hiệu quả giao nhận của Shop theo dữ liệu hiện tại.'}
          </p>
        </div>
        <button
          className="internal-secondary-btn"
          onClick={() =>
            downloadCsv('bao-cao-order.csv', [
              ['Đơn hàng', 'Nhà vận chuyển', 'Trạng thái', 'Tiền thu hộ'],
              ...detailRows.map((order) => [order.id, carrierOf(order), order.status, order.cod]),
            ])
          }
        >
          <Download size={15} /> Xuất báo cáo
        </button>
      </div>

      <div className="internal-report-filters">
        <CustomSelect
          label="Thời gian"
          value={period}
          onChange={setPeriod}
          options={PERIOD_OPTIONS}
        />
        <CustomSelect
          label="Nhà vận chuyển"
          value={carrier}
          onChange={setCarrier}
          options={carrierOptions}
        />
        <span>Dữ liệu cập nhật theo đơn hàng hiện có</span>
      </div>

      <div className="internal-metric-grid four report">
        <button
          className={metric === 'all' ? 'internal-metric-card active' : 'internal-metric-card'}
          onClick={() => setMetric('all')}
        >
          <BarChart3 size={19} />
          <span>Tổng đơn hàng</span>
          <strong>{orders.length}</strong>
          <small>Toàn bộ dữ liệu</small>
        </button>
        <button
          className={
            metric === 'delivered'
              ? 'internal-metric-card green active'
              : 'internal-metric-card green'
          }
          onClick={() => setMetric('delivered')}
        >
          <PackageCheck size={19} />
          <span>Tỷ lệ giao thành công</span>
          <strong>{successRate}%</strong>
          <small>{delivered.length} đơn thành công</small>
        </button>
        <button
          className={
            metric === 'return' ? 'internal-metric-card amber active' : 'internal-metric-card amber'
          }
          onClick={() => setMetric('return')}
        >
          <RotateCcw size={19} />
          <span>Tỷ lệ hoàn</span>
          <strong>{returnRate}%</strong>
          <small>{returned.length} đơn hoàn/trả</small>
        </button>
        <button
          className={
            metric === 'aging' ? 'internal-metric-card red active' : 'internal-metric-card red'
          }
          onClick={() => setMetric('aging')}
        >
          <Clock3 size={19} />
          <span>Đơn cần theo dõi</span>
          <strong>{aging.length}</strong>
          <small>Chờ lấy, hoãn giao</small>
        </button>
      </div>

      <div className="internal-report-grid">
        <section className="internal-workspace-card report-panel">
          <div className="internal-section-title">
            <div>
              <TrendingUp size={17} />
              <strong>So sánh nhà vận chuyển</strong>
            </div>
            <span>Tỷ lệ theo dữ liệu mẫu</span>
          </div>
          <div className="carrier-benchmark-list">
            {benchmark.map((item) => (
              <button
                key={item.name}
                onClick={() => setCarrier(item.name)}
                className={carrier === item.name ? 'selected' : ''}
              >
                <div>
                  <Truck size={15} />
                  <strong>{item.name}</strong>
                  <span>{item.total} đơn hàng</span>
                </div>
                <div className="benchmark-value">
                  <b>{item.successRate}%</b>
                  <span>thành công</span>
                </div>
                <div className="benchmark-bar">
                  <i style={{ width: `${item.successRate}%` }} />
                </div>
                <small>Ngoại lệ: {item.exceptionRate}%</small>
              </button>
            ))}
          </div>
        </section>

        <section className="internal-workspace-card report-panel">
          <div className="internal-section-title">
            <div>
              <Clock3 size={17} />
              <strong>Danh sách chi tiết</strong>
            </div>
            <span>{detailRows.length} đơn hàng</span>
          </div>
          <div className="report-drill-list">
            {detailRows.map((order) => (
              <div key={order.id}>
                <span
                  className={`report-state ${order.spfCode === 'SPF-0901' ? 'done' : isSpfFailureStatus(order.spfCode) ? 'error' : ''}`}
                >
                  {order.spfCode === 'SPF-0901' ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}
                </span>
                <div>
                  <strong>{order.id}</strong>
                  <small>
                    {order.name} · {carrierOf(order)}
                  </small>
                </div>
                <b>{order.cod.toLocaleString('vi-VN')}đ</b>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

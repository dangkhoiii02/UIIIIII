import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  PackageSearch,
  RefreshCw,
  Route,
  Scale,
  Search,
  TriangleAlert,
  History,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Truck,
} from 'lucide-react';
import {
  isSpfFailureStatus,
  useOrders,
  type Order,
  type ShippingStageItem,
} from '@/features/orders';
import { useToast } from '@/shared/ui/toast-context';

type OpsTab = 'all' | 'handover' | 'attempt' | 'reweigh';

interface LegRow {
  id: string;
  order: Order;
  stage: ShippingStageItem;
  nextCarrier?: string;
  attempt: number;
  exception?: string;
  carrierStatusText: string;
  carrierStatusCode: string;
  carrierUpdatedAt: string;
}

function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return '14/09/2026 • 11:21';
  if (dateStr.includes(' • ')) return dateStr;
  if (dateStr.includes(' - ')) return dateStr.replace(' - ', ' • ');
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} • ${hours}:${minutes}`;
  } catch {
    return dateStr;
  }
}

function displayDateParts(value: string) {
  const [date, time] = formatDisplayDate(value).split(' • ');
  return { date, time: time || '' };
}

function renderCarrierLogo(carrier: string) {
  const name = (carrier || '').toLowerCase();
  if (name.includes('super')) {
    return (
      <div className="carrier-brand-logo supership" title="SuperShip">
        <img src="/carriers/supership.jpg" alt="SuperShip" className="carrier-brand-img" />
      </div>
    );
  }
  if (name.includes('green sm') || name.includes('greensm')) {
    return (
      <div className="carrier-brand-logo green-sm" title="Green SM Express">
        <img src="/carriers/xanhsm.jpg" alt="Green SM Express" className="carrier-brand-img" />
      </div>
    );
  }
  if (name.includes('grab')) {
    return (
      <div className="carrier-brand-logo grab" title="GrabExpress">
        <img src="/carriers/grab.jpg" alt="GrabExpress" className="carrier-brand-img" />
      </div>
    );
  }
  if (name.includes('spx') || name.includes('shopee')) {
    return (
      <div className="carrier-brand-logo spx" title="SPX Express">
        <img src="/carriers/spx_official.svg" alt="SPX Express" className="carrier-brand-img" />
      </div>
    );
  }
  if (name.includes('j&t') || name.includes('jnt')) {
    return (
      <div className="carrier-brand-logo jt" title="J&amp;T Express">
        <img src="/carriers/jt_official.webp" alt="J&amp;T Express" className="carrier-brand-img" />
      </div>
    );
  }
  if (name.includes('best')) {
    return (
      <div className="carrier-brand-logo best" title="BEST Express">
        <img src="/carriers/BEST.jpg" alt="BEST Express" className="carrier-brand-img" />
      </div>
    );
  }
  if (name.includes('ghn') || name.includes('nhanh')) {
    return (
      <div className="carrier-brand-logo ghn" title="Giao Hàng Nhanh (GHN)">
        <img src="/carriers/ghn.jpg" alt="GHN" className="carrier-brand-img" />
      </div>
    );
  }
  if (name.includes('ghtk') || name.includes('tiết kiệm')) {
    return (
      <div className="carrier-brand-logo ghtk" title="Giao Hàng Tiết Kiệm (GHTK)">
        <img src="/carriers/ghtk_emblem.svg" alt="GHTK" className="carrier-brand-img" />
      </div>
    );
  }
  if (name.includes('viettel') || name.includes('vtp')) {
    return (
      <div className="carrier-brand-logo viettelpost" title="Viettel Post">
        <img src="/carriers/viettel_emblem.png" alt="Viettel Post" className="carrier-brand-img" />
      </div>
    );
  }
  if (name.includes('vietnam post') || name.includes('vietnampost') || name.includes('vnpost')) {
    return (
      <div className="carrier-brand-logo vnpost" title="Vietnam Post">
        <img src="/carriers/vnp.jpg" alt="Vietnam Post" className="carrier-brand-img" />
      </div>
    );
  }
  return (
    <div className="carrier-brand-logo fallback" title={carrier}>
      <Truck size={14} />
    </div>
  );
}

function stagesOf(order: Order): ShippingStageItem[] {
  const shipping = order.shippingInfo;
  if (!shipping) return [];
  if (shipping.stages?.length) return shipping.stages;

  const fallbackStages: Array<ShippingStageItem | null> = [
    shipping.pickupTracking
      ? {
          key: 'pickup' as const,
          title: 'Lấy',
          carrier: shipping.pickupCarrier || 'SuperShip',
          tracking: shipping.pickupTracking,
          status: shipping.currentStage === 'pickup' ? ('active' as const) : ('completed' as const),
          carrierStatusText:
            shipping.currentStage === 'pickup'
              ? 'Đang thực hiện lấy hàng'
              : 'Đã kết thúc chặng lấy',
          carrierStatusCode:
            shipping.currentStage === 'pickup' ? 'PICKUP-IN-PROGRESS' : 'PICKUP-COMPLETED',
          carrierUpdatedAt: order.pickupAt || order.createdAt,
        }
      : null,
    shipping.deliveryTracking
      ? {
          key: 'delivery' as const,
          title: 'Giao',
          carrier: shipping.deliveryCarrier || 'BEST Express',
          tracking: shipping.deliveryTracking,
          status:
            shipping.currentStage === 'delivery' ? ('active' as const) : ('completed' as const),
          carrierStatusText:
            shipping.currentStage === 'delivery'
              ? order.status
              : order.spfCode === 'SPF-0901'
                ? 'Giao hàng thành công'
                : 'Đã kết thúc chặng giao',
          carrierStatusCode:
            order.spfCode === 'SPF-0901'
              ? 'DELIVERED_SUCCESS'
              : order.spfCode === 'SPF-0802'
                ? 'DELIVERY-FAILED'
                : 'OUT_FOR_DELIVERY',
          carrierUpdatedAt: order.deliveryAt || order.updatedAt || order.createdAt,
        }
      : null,
    shipping.returnTracking
      ? {
          key: 'return' as const,
          title: 'Hoàn',
          carrier: shipping.returnCarrier || 'SuperShip',
          tracking: shipping.returnTracking,
          status: shipping.currentStage === 'return' ? ('active' as const) : ('pending' as const),
          carrierStatusText:
            shipping.currentStage === 'return' ? 'Đang chuyển hoàn' : 'Chờ tiếp nhận hoàn',
          carrierStatusCode:
            shipping.currentStage === 'return' ? 'RETURN-IN-TRANSIT' : 'RETURN-PENDING',
          carrierUpdatedAt: order.returnConfirmedAt || order.updatedAt || order.createdAt,
        }
      : null,
  ];
  return fallbackStages.filter((stage): stage is ShippingStageItem => stage !== null);
}

interface GanttEvent {
  id: string;
  timestamp: number;
  time: string;
  carrierStatus: string;
  carrierCode: string;
  spfStatus: string;
  spfCode: string;
  location: string;
  result: 'processed' | 'duplicate' | 'failed';
}

interface GanttLeg {
  id: string;
  stage: ShippingStageItem;
  startedAt: number;
  endedAt: number;
  events: GanttEvent[];
}

function timestampOf(value?: string, fallback = Date.now()) {
  if (!value) return fallback;
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : fallback;
}

function buildGanttLegs(order: Order): GanttLeg[] {
  const orderCreatedAt = timestampOf(order.createdAt);
  return stagesOf(order).map((stage, index) => {
    const rawEvents = [...(stage.webhookEvents || [])].sort(
      (a, b) => timestampOf(a.eventAt || a.receivedAt) - timestampOf(b.eventAt || b.receivedAt),
    );
    const fallbackStart =
      stage.key === 'delivery'
        ? timestampOf(order.pickupAt, orderCreatedAt + (index + 1) * 30 * 60_000)
        : stage.key === 'return' || stage.key === 'refund'
          ? timestampOf(order.returnConfirmedAt, orderCreatedAt + (index + 1) * 60 * 60_000)
          : orderCreatedAt + index * 15 * 60_000;
    const startedAt = rawEvents.length
      ? Math.min(fallbackStart, timestampOf(rawEvents[0]?.eventAt || rawEvents[0]?.receivedAt))
      : fallbackStart;
    const createdEvent: GanttEvent = {
      id: `${order.id}-${stage.key}-created`,
      timestamp: startedAt,
      time: new Date(startedAt).toISOString(),
      carrierStatus: `Bắt đầu tạo mã vận đơn tại ${stage.carrier}`,
      carrierCode: 'WAYBILL_CREATED',
      spfStatus: 'Đã khởi tạo chặng vận chuyển',
      spfCode: 'SPF-0101',
      location: order.senderAddress || 'Hệ thống SuperPlatform',
      result: 'processed',
    };
    const carrierEvents: GanttEvent[] = rawEvents.map((event) => ({
      id: event.id,
      timestamp: timestampOf(event.eventAt || event.receivedAt, startedAt),
      time: event.eventAt || event.receivedAt,
      carrierStatus: event.statusText,
      carrierCode: event.statusCode,
      spfStatus: event.mappedSpfStatus,
      spfCode: event.mappedSpfCode,
      location: event.location || 'Nhà vận chuyển không cung cấp vị trí',
      result: event.processingStatus,
    }));
    if (!carrierEvents.length) {
      const updatedAt = timestampOf(
        stage.carrierUpdatedAt || order.updatedAt,
        startedAt + 30 * 60_000,
      );
      carrierEvents.push({
        id: `${order.id}-${stage.key}-latest`,
        timestamp: updatedAt,
        time: stage.carrierUpdatedAt || order.updatedAt || order.createdAt,
        carrierStatus: stage.carrierStatusText || 'Chưa có cập nhật mới từ nhà vận chuyển',
        carrierCode: stage.carrierStatusCode || `${stage.key.toUpperCase()}_PENDING`,
        spfStatus: order.status,
        spfCode: order.spfCode,
        location: 'Chưa có dữ liệu vị trí',
        result: 'processed',
      });
    }
    const events = [createdEvent, ...carrierEvents].sort((a, b) => a.timestamp - b.timestamp);
    return {
      id: `${order.id}-${stage.key}`,
      stage,
      startedAt,
      endedAt: Math.max(...events.map((event) => event.timestamp), startedAt + 10 * 60_000),
      events,
    };
  });
}

function CarrierJourneyGantt({ order }: { order: Order }) {
  const legs = useMemo(() => buildGanttLegs(order), [order]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(legs.map((leg) => [leg.id, true])),
  );
  const times = legs.flatMap((leg) => leg.events.map((event) => event.timestamp));
  const rangeStart = times.length ? Math.min(...times) : timestampOf(order.createdAt);
  const rawRangeEnd = times.length ? Math.max(...times) : rangeStart;
  const rangeEnd = Math.max(rawRangeEnd, rangeStart + 60 * 60_000);
  const range = rangeEnd - rangeStart;
  const position = (time: number) =>
    Math.min(100, Math.max(0, ((time - rangeStart) / range) * 100));
  const ticks = [0, 0.25, 0.5, 0.75, 1];

  return (
    <section className="carrier-gantt-card">
      <div className="carrier-gantt-heading">
        <div>
          <span>TOÀN BỘ QUÁ TRÌNH NHIỀU NHÀ VẬN CHUYỂN</span>
          <h2>Sơ đồ thời gian vận chuyển</h2>
          <p>Từ lúc tạo mã vận đơn tại từng NVC đến trạng thái cuối cùng nền tảng đã tiếp nhận.</p>
        </div>
        <div className="carrier-gantt-order-meta">
          <span>Đơn hàng</span>
          <strong>{order.id}</strong>
          <small>Tạo lúc {formatDisplayDate(order.createdAt)}</small>
        </div>
      </div>

      <div className="carrier-gantt-legend">
        <span>
          <i className="created" /> Tạo mã vận đơn
        </span>
        <span>
          <i className="processed" /> NVC cập nhật
        </span>
        <span>
          <i className="failed" /> Cập nhật lỗi/ngoại lệ
        </span>
      </div>

      <div className="carrier-gantt-scroll">
        <div className="carrier-gantt-board">
          <div className="carrier-gantt-scale">
            <strong>Chặng / Nhà vận chuyển</strong>
            <div className="carrier-gantt-ticks">
              {ticks.map((tick) => (
                <span key={tick} style={{ left: `${tick * 100}%` }}>
                  <strong>
                    {displayDateParts(new Date(rangeStart + range * tick).toISOString()).date}
                  </strong>
                  <time>
                    {displayDateParts(new Date(rangeStart + range * tick).toISOString()).time}
                  </time>
                </span>
              ))}
            </div>
          </div>

          {legs.map((leg) => {
            const isExpanded = expanded[leg.id];
            const start = position(leg.startedAt);
            const end = position(leg.endedAt);
            return (
              <div className="carrier-gantt-leg" key={leg.id}>
                <button
                  type="button"
                  className="carrier-gantt-row"
                  onClick={() =>
                    setExpanded((current) => ({ ...current, [leg.id]: !current[leg.id] }))
                  }
                >
                  <span className="carrier-gantt-identity">
                    <span className={`internal-stage stage-${leg.stage.key}`}>
                      {leg.stage.title}
                    </span>
                    <span className="carrier-gantt-logo">
                      {renderCarrierLogo(leg.stage.carrier)}
                    </span>
                    <span>
                      <strong>{leg.stage.carrier}</strong>
                      <code>{leg.stage.tracking || 'Chưa cấp mã vận đơn'}</code>
                      <small>
                        Bắt đầu {formatDisplayDate(new Date(leg.startedAt).toISOString())}
                      </small>
                    </span>
                    {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                  </span>
                  <span className="carrier-gantt-track">
                    <i
                      className="carrier-gantt-bar"
                      style={{ left: `${start}%`, width: `${Math.max(2, end - start)}%` }}
                    />
                    {leg.events.map((event, eventIndex) => (
                      <i
                        key={event.id}
                        className={`carrier-gantt-marker ${eventIndex === 0 ? 'created' : event.result}`}
                        style={{ left: `${position(event.timestamp)}%` }}
                        title={`${formatDisplayDate(event.time)} · ${event.carrierStatus} → ${event.spfStatus}`}
                      />
                    ))}
                  </span>
                </button>

                {isExpanded && (
                  <div className="carrier-gantt-events">
                    <div className="carrier-gantt-events-head">
                      <span>Thời điểm</span>
                      <span>Trạng thái nhà vận chuyển</span>
                      <span>SuperPlatform tiếp nhận</span>
                      <span>Vị trí / Kết quả</span>
                    </div>
                    {leg.events.map((event, eventIndex) => (
                      <div
                        className={`carrier-gantt-event${eventIndex === 0 ? ' first' : ''}${eventIndex === leg.events.length - 1 ? ' last' : ''}`}
                        key={event.id}
                      >
                        <span>
                          <b>{eventIndex + 1}</b>
                          <time>{formatDisplayDate(event.time)}</time>
                        </span>
                        <span>
                          <strong>{event.carrierStatus}</strong>
                          <code>{event.carrierCode}</code>
                        </span>
                        <span>
                          <strong>{event.spfStatus}</strong>
                          <code>{event.spfCode}</code>
                        </span>
                        <span>
                          <strong>{event.location}</strong>
                          <small className={`carrier-gantt-result ${event.result}`}>
                            {event.result === 'failed'
                              ? 'Cần kiểm tra'
                              : event.result === 'duplicate'
                                ? 'Bản tin trùng'
                                : 'Đã xử lý'}
                          </small>
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function CarrierOperationsPage() {
  const { orders } = useOrders();
  const navigate = useNavigate();
  const notify = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [tab, setTab] = useState<OpsTab>('all');
  const [query, setQuery] = useState(searchParams.get('orderId') || '');
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const [reweighed, setReweighed] = useState<string[]>([]);
  const [copiedTracking, setCopiedTracking] = useState<string | null>(null);

  const legs = useMemo<LegRow[]>(
    () =>
      orders.flatMap((order) => {
        const stages = stagesOf(order);
        return stages.map((stage, index) => {
          const defaultCarrierStatus =
            stage.carrierStatusText ||
            (stage.status === 'completed'
              ? 'Đã hoàn tất'
              : stage.status === 'active'
                ? order.status
                : 'Chờ tiếp nhận');
          const defaultStatusCode =
            stage.carrierStatusCode ||
            `${stage.key.toUpperCase()}-${(stage.status || 'pending').toUpperCase()}`;
          const defaultUpdatedAt = stage.carrierUpdatedAt || order.updatedAt || order.createdAt;

          return {
            id: `${order.id}-${stage.key}`,
            order,
            stage,
            nextCarrier: stages[index + 1]?.carrier,
            attempt: isSpfFailureStatus(order.spfCode) ? 2 : 1,
            exception:
              order.incidentType ||
              (isSpfFailureStatus(order.spfCode)
                ? `${order.status} chưa được xử lý xong`
                : undefined),
            carrierStatusText: defaultCarrierStatus,
            carrierStatusCode: defaultStatusCode,
            carrierUpdatedAt: defaultUpdatedAt,
          };
        });
      }),
    [orders],
  );

  const focusedOrderId = searchParams.get('orderId');
  const focusedOrder = focusedOrderId
    ? orders.find((order) => order.id === focusedOrderId)
    : undefined;

  const filtered = legs.filter((leg) => {
    const searchable = [
      leg.order.id,
      leg.stage.tracking,
      leg.stage.carrier,
      leg.order.shopName,
      leg.order.name,
      leg.carrierStatusText,
      leg.carrierStatusCode,
      leg.order.status,
      leg.order.spfCode,
    ]
      .join(' ')
      .toLowerCase();
    if (query && !searchable.includes(query.toLowerCase())) return false;
    if (tab === 'handover')
      return Boolean(leg.nextCarrier && leg.nextCarrier !== leg.stage.carrier);
    if (tab === 'attempt') return leg.attempt > 1 || Boolean(leg.exception);
    if (tab === 'reweigh') return reweighed.includes(leg.id) || leg.order.weight >= 500;
    return true;
  });

  const handoverCount = legs.filter(
    (leg) => leg.nextCarrier && leg.nextCarrier !== leg.stage.carrier,
  ).length;
  const exceptionCount = legs.filter((leg) => leg.exception).length;

  const handleCopyWaybill = (tracking: string) => {
    navigator.clipboard.writeText(tracking);
    setCopiedTracking(tracking);
    notify(`Đã sao chép mã vận đơn: ${tracking}`);
    setTimeout(() => setCopiedTracking(null), 2000);
  };

  const handleOpenJourney = (leg: LegRow) => {
    setQuery(leg.order.id);
    setSearchParams({ orderId: leg.order.id });
  };

  const handleCloseJourney = () => {
    setQuery('');
    setSearchParams({});
  };

  return (
    <div className="internal-page">
      <div className="internal-page-heading">
        <div>
          <span className="internal-kicker">I04 · ĐIỀU PHỐI NỘI BỘ</span>
          <h1>Quản lý chặng và vận tải</h1>
          <p>
            Theo dõi chi tiết trạng thái nhà vận chuyển, dòng thời gian từ lúc tạo mã đơn và sai
            lệch cân đo trên cùng một lưới.
          </p>
        </div>
        <button
          className="internal-secondary-btn"
          onClick={() => notify('Dữ liệu nhà vận chuyển đã được đồng bộ lại.')}
        >
          <RefreshCw size={15} /> Đồng bộ nhà vận chuyển
        </button>
      </div>

      <div className="internal-metric-grid four">
        <div className="internal-metric-card">
          <Route size={19} />
          <span>Tổng chặng</span>
          <strong>{legs.length}</strong>
        </div>
        <div className="internal-metric-card amber">
          <ArrowRight size={19} />
          <span>Chờ bàn giao</span>
          <strong>{handoverCount}</strong>
        </div>
        <div className="internal-metric-card red">
          <TriangleAlert size={19} />
          <span>Có ngoại lệ</span>
          <strong>{exceptionCount}</strong>
        </div>
        <div className="internal-metric-card green">
          <ClipboardCheck size={19} />
          <span>Đã xác nhận</span>
          <strong>{confirmed.length}</strong>
        </div>
      </div>

      {focusedOrder ? (
        <div className="carrier-journey-workspace">
          <div className="carrier-journey-actions">
            <button type="button" onClick={handleCloseJourney}>
              <ArrowRight size={14} /> Quay lại danh sách chặng
            </button>
            <button type="button" onClick={() => navigate(`/orders/${focusedOrder.id}`)}>
              <PackageSearch size={14} /> Xem chi tiết đơn hàng
            </button>
          </div>
          <CarrierJourneyGantt order={focusedOrder} />
        </div>
      ) : (
        <section className="internal-workspace-card">
          <div className="internal-toolbar">
            <div className="internal-tabs">
              {(
                [
                  ['all', 'Tất cả chặng'],
                  ['handover', 'Bàn giao nhà vận chuyển'],
                  ['attempt', 'Lần thực hiện thất bại'],
                  ['reweigh', 'Cân đo lại'],
                ] as Array<[OpsTab, string]>
              ).map(([value, label]) => (
                <button
                  key={value}
                  className={tab === value ? 'active' : ''}
                  onClick={() => setTab(value)}
                >
                  {label}
                </button>
              ))}
            </div>
            <label className="internal-search">
              <Search size={16} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Đơn hàng, mã vận đơn, cửa hàng hoặc nhà vận chuyển"
              />
            </label>
          </div>

          <div className="internal-table-wrap">
            <table className="internal-table">
              <thead>
                <tr>
                  <th>Đơn hàng / Cửa hàng</th>
                  <th>Chặng & Mã vận đơn</th>
                  <th>Nhà vận chuyển</th>
                  <th>Trạng thái Nhà vận chuyển</th>
                  <th>Trạng thái SuperPlatform</th>
                  <th>Lần thực hiện</th>
                  <th>Cân nặng</th>
                  <th>Tác vụ</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((leg) => (
                  <tr key={leg.id}>
                    <td>
                      <button
                        className="internal-link"
                        onClick={() => handleOpenJourney(leg)}
                        title="Xem lịch sử trạng thái NVC từ lúc tạo mã đơn"
                      >
                        {leg.order.id}
                      </button>
                      <small>{leg.order.shopName || 'Shop Gia Dụng Việt'}</small>
                      <small style={{ color: '#94a3b8' }}>
                        {formatDisplayDate(leg.order.createdAt)}
                      </small>
                    </td>

                    <td>
                      <span className={`internal-stage stage-${leg.stage.key}`}>
                        {leg.stage.title}
                      </span>
                      <div className="waybill-inline-wrap" style={{ marginTop: 4 }}>
                        <code>{leg.stage.tracking}</code>
                        <button
                          type="button"
                          className="btn-mini-copy"
                          onClick={() => handleCopyWaybill(leg.stage.tracking)}
                          title="Sao chép mã vận đơn"
                        >
                          {copiedTracking === leg.stage.tracking ? (
                            <Check size={12} className="text-success" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </div>
                    </td>

                    <td>
                      <div className="carrier-cell-flex">
                        {renderCarrierLogo(leg.stage.carrier)}
                        <div>
                          <strong>{leg.stage.carrier}</strong>
                          {leg.nextCarrier && leg.nextCarrier !== leg.stage.carrier && (
                            <small>
                              {leg.stage.carrier} <ArrowRight size={10} /> {leg.nextCarrier}
                            </small>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Trạng thái NVC hiển thị rõ ràng */}
                    <td>
                      <div className="carrier-status-cell">
                        <span className="carrier-status-name">{leg.carrierStatusText}</span>
                        <div className="carrier-status-cell-sub">
                          <span className="carrier-code-pill">{leg.carrierStatusCode}</span>
                          <span className="carrier-time-info">
                            <Clock size={10} /> {formatDisplayDate(leg.carrierUpdatedAt)}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Trạng thái SuperPlatform */}
                    <td>
                      <div className="spf-status-cell">
                        <span className="spf-status-text">{leg.order.status}</span>
                        <span className="spf-code-pill">{leg.order.spfCode}</span>
                      </div>
                    </td>

                    <td>
                      Lần {leg.attempt}
                      {leg.exception && <small className="text-danger">{leg.exception}</small>}
                    </td>

                    <td>
                      {leg.order.weight} gr
                      {reweighed.includes(leg.id) && (
                        <small className="text-success">Đã cân đối chiếu</small>
                      )}
                    </td>

                    <td>
                      <div className="internal-row-actions">
                        <button
                          className="btn-view-journey"
                          title="Xem toàn bộ trạng thái NVC từ lúc tạo mã đơn"
                          onClick={() => handleOpenJourney(leg)}
                        >
                          <History size={15} />
                        </button>
                        <button
                          title="Xem chi tiết đơn hàng"
                          onClick={() => navigate(`/orders/${leg.order.id}`)}
                        >
                          <PackageSearch size={15} />
                        </button>
                        <button
                          title="Xác nhận bàn giao"
                          onClick={() => {
                            setConfirmed((current) =>
                              current.includes(leg.id) ? current : [...current, leg.id],
                            );
                            notify(
                              `Đã xác nhận chặng ${leg.stage.title} của đơn hàng ${leg.order.id}.`,
                            );
                          }}
                        >
                          <CheckCircle2 size={15} />
                        </button>
                        <button
                          title="Ghi nhận cân đo lại"
                          onClick={() => {
                            setReweighed((current) =>
                              current.includes(leg.id) ? current : [...current, leg.id],
                            );
                            notify(`Đã ghi nhận cân đo lại ${leg.order.weight} gr.`);
                          }}
                        >
                          <Scale size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

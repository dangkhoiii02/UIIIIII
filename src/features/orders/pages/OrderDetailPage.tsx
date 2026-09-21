import { useEffect, useState } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Copy,
  Check,
  Package,
  MapPin,
  Receipt,
  RotateCcw,
  Pencil,
  DollarSign,
  Printer,
  Info,
  Truck,
  Eye,
  EyeOff,
  Send,
  Clock,
  CircleDot,
  ChevronDown,
  ChevronUp,
  X,
  Compass,
  Star,
  QrCode,
  History,
  CheckCircle2,
  Camera,
  ShieldCheck,
  UserRound,
  ImagePlus,
  AlertTriangle,
} from 'lucide-react';
import { money } from '@/shared/lib/format';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { AsyncStatePanel } from '@/shared/ui/AsyncStatePanel';
import { CustomSelect } from '@/shared/ui/CustomSelect';
import { useToast } from '@/shared/ui/toast-context';
import { useOrders } from '../model/orders-context';
import { SupportDialog } from '@/features/support';
import { BarcodeSvg, QrCodeSvg } from '@/shared/ui/BarcodeAndQr';
import { PrintHistoryDrawer } from '../components/PrintHistoryDrawer';
import { EditOrderDialog } from '../components/EditOrderDialog';
import type { Order, ShippingStageItem } from '../model/types';
import type { CarrierWebhookEvent } from '../model/types';
import {
  getSpfLifecyclePhase,
  getSpfStatusTone,
  isSpfFailureStatus,
} from '../model/spf-status-catalog';
import {
  getOrderPermission,
  type OrderCapability,
  type OrderViewer,
} from '../model/order-permissions';
import {
  canViewInstantDriverJourney,
  formatInstantDistance,
  formatInstantEta,
} from '../model/instant-tracking';

interface TransportLeg {
  key: ShippingStageItem['key'];
  role: string;
  stageCode?: string;
  carrier: string;
  code: string;
  statusText: string;
  carrierStatusText: string;
  state: 'active' | 'passed' | 'upcoming';
  carrierStatusCode?: string;
  carrierUpdatedAt?: string;
  webhookEvents: CarrierWebhookEvent[];
}

interface JourneyEvent {
  time: string;
  label: string;
  carrier: string;
  visibility: 'shop' | 'internal';
  rawCode?: string;
}

interface JourneyStage {
  flow: string;
  name: string;
  carrier: string;
  code: string;
  status: string;
  state: 'done' | 'current' | 'warn' | 'error' | 'pending';
  flowNote?: string;
  events: JourneyEvent[];
}

const COD_COLLECTION_LABELS: Record<number, string> = {
  1: 'Không có COD',
  2: 'Chờ thu',
  3: 'Đã thu',
  4: 'Thu một phần',
  5: 'Không thu được',
};

const COD_SETTLEMENT_LABELS: Record<number, string> = {
  1: 'Không áp dụng',
  2: 'Chờ đối soát',
  3: 'Đang xử lý',
  4: 'Đã chuyển một phần',
  5: 'Đã chuyển đủ',
  6: 'Đang tạm giữ',
};

const COMPENSATION_LABELS: Record<number, string> = {
  1: 'Không phát sinh',
  2: 'Đang xem xét',
  3: 'Đã phê duyệt',
  4: 'Đã chi trả',
  5: 'Bị từ chối',
};

interface ActionHistoryItem {
  id: number;
  actor: string;
  stageTag?: string;
  message: string;
  time: string;
  visibility: 'shop' | 'internal';
  rawMeta?: string;
}

const CHANGE_CARRIER_OPTIONS = [
  { value: 'GHN', label: 'GHN', subLabel: '32.000đ · 1–2 ngày' },
  { value: 'Viettel Post', label: 'Viettel Post', subLabel: '34.500đ · 2–3 ngày' },
  { value: 'SPX Express', label: 'SPX Express', subLabel: '29.000đ · 2–4 ngày' },
  { value: 'J&T Express', label: 'J&T Express', subLabel: '31.500đ · 2–3 ngày' },
];

function isSameCarrier(first: string, second: string): boolean {
  return first.trim().toLocaleLowerCase('vi') === second.trim().toLocaleLowerCase('vi');
}

function renderCarrierLogoDetail(carrier: string) {
  const name = (carrier || '').toLowerCase();

  if (name.includes('super')) {
    return (
      <div className="carrier-brand-logo supership" title="SuperShip (Đơn vị chủ quản)">
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
  return null;
}

function hasCarrierIconDetail(carrier: string) {
  const name = (carrier || '').toLowerCase();
  return Boolean(
    name.includes('super') ||
    name.includes('green sm') ||
    name.includes('greensm') ||
    name.includes('grab') ||
    name.includes('spx') ||
    name.includes('shopee') ||
    name.includes('j&t') ||
    name.includes('jnt') ||
    name.includes('best') ||
    name.includes('ghn') ||
    name.includes('nhanh') ||
    name.includes('ghtk') ||
    name.includes('tiết kiệm') ||
    name.includes('viettel') ||
    name.includes('vtp') ||
    name.includes('vietnam post') ||
    name.includes('vietnampost') ||
    name.includes('vnpost'),
  );
}

function getDetailTransportLegs(order: Order): TransportLeg[] {
  const shipping = order.shippingInfo;
  if (!shipping) return [];

  const fallbackStages: Array<ShippingStageItem | null> = [
    shipping.pickupCarrier || shipping.pickupTracking
      ? {
          key: 'pickup' as const,
          title: 'Lấy',
          carrier: shipping.pickupCarrier || 'SuperShip',
          tracking: shipping.pickupTracking || '',
          status: shipping.currentStage === 'pickup' ? ('active' as const) : ('completed' as const),
        }
      : null,
    shipping.deliveryCarrier || shipping.deliveryTracking
      ? {
          key: 'delivery' as const,
          title: 'Giao',
          carrier: shipping.deliveryCarrier || '',
          tracking: shipping.deliveryTracking || '',
          status:
            shipping.currentStage === 'delivery'
              ? ('active' as const)
              : shipping.currentStage === 'pickup'
                ? ('pending' as const)
                : ('completed' as const),
        }
      : null,
    shipping.returnCarrier || shipping.returnTracking
      ? {
          key: 'return' as const,
          title: 'Hoàn',
          carrier: shipping.returnCarrier || '',
          tracking: shipping.returnTracking || '',
          status:
            shipping.currentStage === 'return'
              ? ('active' as const)
              : shipping.currentStage === 'completed'
                ? ('completed' as const)
                : ('pending' as const),
        }
      : null,
  ];
  const stages: ShippingStageItem[] = shipping.stages?.length
    ? shipping.stages
    : fallbackStages.filter((stage): stage is ShippingStageItem => stage !== null);

  const roleByKey: Record<ShippingStageItem['key'], string> = {
    pickup: 'Lấy hàng',
    delivery: 'Giao hàng',
    return: 'Hoàn hàng',
    refund: 'Trả hàng',
  };

  return stages.map((stage) => {
    const state: TransportLeg['state'] =
      stage.status === 'completed' ? 'passed' : stage.status === 'active' ? 'active' : 'upcoming';
    const defaultStatusText =
      order.spfCode === 'SPF-0201'
        ? 'Đã hủy'
        : stage.status === 'completed'
          ? 'Đã hoàn tất'
          : stage.status === 'active'
            ? isSpfFailureStatus(order.spfCode)
              ? order.status
              : 'Đang xử lý'
            : 'Chưa bắt đầu';
    const statusText =
      order.spfCode === 'SPF-0201' ? 'Đã hủy' : stage.carrierStatusText || defaultStatusText;
    const fallbackCarrierStatus: Record<
      ShippingStageItem['key'],
      Record<'completed' | 'active' | 'pending', string>
    > = {
      pickup: {
        completed: 'Đã hoàn tất chặng lấy hàng',
        active: 'Đang thực hiện lấy hàng',
        pending: 'Chờ tiếp nhận lấy hàng',
      },
      delivery: {
        completed: 'Đã kết thúc chặng giao hàng',
        active: 'Đang thực hiện giao hàng',
        pending: 'Chờ tiếp nhận giao hàng',
      },
      return: {
        completed: 'Đã hoàn tất chặng hoàn hàng',
        active: 'Đang thực hiện hoàn hàng',
        pending: 'Chờ tiếp nhận hoàn hàng',
      },
      refund: {
        completed: 'Đã trả hàng về điểm cuối',
        active: 'Đang trả hàng về điểm cuối',
        pending: 'Chờ thực hiện trả hàng cuối',
      },
    };
    const stageState = stage.status || 'pending';
    const resolvedCarrierStatus =
      stage.carrierStatusText ||
      (stageState === 'active' ? order.status : fallbackCarrierStatus[stage.key][stageState]);
    const normalizedStage: ShippingStageItem = {
      ...stage,
      carrierStatusText: resolvedCarrierStatus,
      carrierStatusCode:
        stage.carrierStatusCode || `${stage.key.toUpperCase()}-${stageState.toUpperCase()}`,
      carrierUpdatedAt: stage.carrierUpdatedAt || order.updatedAt || order.createdAt,
    };
    const carrierEvents = stage.webhookEvents?.length
      ? stage.webhookEvents
      : buildFallbackWebhookEvents(order, normalizedStage, resolvedCarrierStatus);
    const latestCarrierEvent = carrierEvents[0];

    return {
      key: stage.key,
      role: roleByKey[stage.key],
      stageCode: stage.stageCode,
      carrier: stage.carrier,
      code: stage.tracking,
      statusText,
      carrierStatusText: latestCarrierEvent?.statusText || resolvedCarrierStatus,
      state,
      carrierStatusCode: latestCarrierEvent?.statusCode || normalizedStage.carrierStatusCode,
      carrierUpdatedAt: latestCarrierEvent?.eventAt || normalizedStage.carrierUpdatedAt,
      webhookEvents: carrierEvents,
    };
  });
}

function buildFallbackWebhookEvents(
  order: Order,
  stage: ShippingStageItem,
  statusText: string,
): CarrierWebhookEvent[] {
  const updatedAt = stage.carrierUpdatedAt || order.updatedAt || order.createdAt;
  const carrierCode = stage.carrierStatusCode || `${stage.key.toUpperCase()}-STATUS`;
  const rawStatus = stage.carrierStatusText || statusText;
  const requestPrefix = `${stage.carrier.replace(/[^A-Za-z0-9]/g, '').toUpperCase()}-${stage.key.toUpperCase()}`;
  const progressByStage: Record<
    ShippingStageItem['key'],
    Array<
      Pick<CarrierWebhookEvent, 'statusCode' | 'statusText' | 'mappedSpfCode' | 'mappedSpfStatus'>
    >
  > = {
    pickup: [
      {
        statusCode: 'PICKUP-ACCEPTED',
        statusText: 'Đã tiếp nhận yêu cầu lấy hàng',
        mappedSpfCode: 'SPF-0301',
        mappedSpfStatus: 'Chờ lấy hàng',
      },
      {
        statusCode: 'PICKUP-IN-PROGRESS',
        statusText: 'Tài xế đang đến điểm lấy',
        mappedSpfCode: 'SPF-0401',
        mappedSpfStatus: 'Đang lấy hàng',
      },
    ],
    delivery: [
      {
        statusCode: 'DELIVERY-RECEIVED',
        statusText: 'Đã nhận kiện từ NVC lấy',
        mappedSpfCode: 'SPF-0605',
        mappedSpfStatus: 'NVC giao đã nhận hàng',
      },
      {
        statusCode: 'DELIVERY-IN-TRANSIT',
        statusText: 'Đang luân chuyển đến bưu cục giao',
        mappedSpfCode: 'SPF-0701',
        mappedSpfStatus: 'Đang trung chuyển',
      },
    ],
    return: [
      {
        statusCode: 'RETURN-CONFIRMED',
        statusText: 'Đã xác nhận yêu cầu chuyển hoàn',
        mappedSpfCode: 'SPF-1002',
        mappedSpfStatus: 'Đã xác nhận chuyển hoàn',
      },
      {
        statusCode: 'RETURN-PICKED',
        statusText: 'Đã lấy kiện hàng hoàn',
        mappedSpfCode: 'SPF-1007',
        mappedSpfStatus: 'Đã lấy hàng hoàn',
      },
    ],
    refund: [
      {
        statusCode: 'FINAL-RETURN-ACCEPTED',
        statusText: 'NVC hoàn cuối đã nhận kiện',
        mappedSpfCode: 'SPF-1104',
        mappedSpfStatus: 'Đã trả cho NVC hoàn cuối',
      },
      {
        statusCode: 'FINAL-RETURN-AT-HUB',
        statusText: 'Kiện đã đến kho trả cuối',
        mappedSpfCode: 'SPF-1105',
        mappedSpfStatus: 'Đã đến kho trả cuối',
      },
    ],
  };

  const history =
    stage.status === 'pending'
      ? progressByStage[stage.key].slice(0, 1)
      : [
          ...progressByStage[stage.key],
          {
            statusCode: carrierCode,
            statusText: rawStatus,
            mappedSpfCode: order.spfCode,
            mappedSpfStatus: order.status,
          },
        ];
  const baseTime = new Date(updatedAt);

  return history
    .map((event, index) => {
      const minutesBefore = (history.length - index - 1) * 35;
      const eventTime = Number.isNaN(baseTime.getTime())
        ? updatedAt
        : new Date(baseTime.getTime() - minutesBefore * 60_000).toISOString();
      const receivedTime = Number.isNaN(baseTime.getTime())
        ? updatedAt
        : new Date(new Date(eventTime).getTime() + 45_000).toISOString();

      return {
        id: `${stage.key}-${index}`,
        receivedAt: receivedTime,
        eventAt: eventTime,
        statusCode: event.statusCode,
        statusText: event.statusText,
        mappedSpfCode: event.mappedSpfCode,
        mappedSpfStatus: event.mappedSpfStatus,
        processingStatus:
          index === history.length - 1 && order.syncStatus === 'FAILED'
            ? ('failed' as const)
            : ('processed' as const),
        requestId: `${requestPrefix}-${order.id.slice(-6)}-${index + 1}`,
        location: stage.status === 'pending' ? undefined : 'Bưu cục khai thác của nhà vận chuyển',
        note:
          index === history.length - 1 && order.syncStatus === 'FAILED'
            ? 'Bản cập nhật đã nhận nhưng chưa đồng bộ thành công vào trạng thái đơn.'
            : undefined,
        payload: JSON.stringify(
          {
            tracking_code: stage.tracking,
            status_code: event.statusCode,
            status_name: event.statusText,
            event_time: eventTime,
          },
          null,
          2,
        ),
      };
    })
    .reverse();
}

function getDetailJourneyStages(order: Order): JourneyStage[] {
  const phase = getSpfLifecyclePhase(order.spfCode);
  const isReturn =
    phase === 'return' ||
    phase === 'returned' ||
    order.spfCode === 'SPF-0902' ||
    Boolean(order.shippingInfo?.returnTracking);

  const deliveryCarrier = order.shippingInfo?.deliveryCarrier || 'BEST Express';
  const pickupCode = order.shippingInfo?.pickupTracking || 'STGS983262LM.826941741';
  const deliveryCode = order.shippingInfo?.deliveryTracking || '999800060099891';
  const returnCarrier = order.shippingInfo?.returnCarrier || 'SuperShip';
  const returnCode = order.shippingInfo?.returnTracking || 'STGS983262LM.826941743';

  if (order.serviceType === 'instant') {
    const instantStage =
      order.shippingInfo?.stages?.find((stage) => stage.status === 'active') ||
      order.shippingInfo?.stages?.find((stage) => stage.key === 'delivery') ||
      order.shippingInfo?.stages?.[0];
    const instantEvents = (
      order.shippingInfo?.stages?.length
        ? order.shippingInfo.stages.flatMap((stage) => stage.webhookEvents || [])
        : instantStage?.webhookEvents || []
    ).sort((a, b) => new Date(a.eventAt).getTime() - new Date(b.eventAt).getTime());
    const isDelivered = order.instantTracking?.state === 'DELIVERED';
    const isDriverNotFound = order.instantTracking?.state === 'DRIVER_NOT_FOUND';
    const isPickedUp =
      instantEvents.some(
        (event) =>
          event.statusCode === 'PICKED_UP' ||
          event.statusCode === 'SPF-0501' ||
          event.statusCode === 'PICKUP_COMPLETED' ||
          event.statusCode === 'PENDING_DROP_OFF',
      ) || order.spfCode >= 'SPF-0501';
    const pickupStage = order.shippingInfo?.stages?.find((stage) => stage.key === 'pickup');
    const pickupEventIds = new Set(pickupStage?.webhookEvents?.map((event) => event.id) || []);
    const pickupStatusCodes = new Set([
      'BOOKING_CREATED',
      'DRIVER_ALLOCATING',
      'DRIVER_ASSIGNED',
      'DRIVER_TO_PICKUP',
      'PICKED_UP',
      'PICKUP_COMPLETED',
      'PENDING_DROP_OFF',
      'PENDING_PICKUP',
      'PICKING_UP',
      'ARRIVING',
      'ALLOCATING',
      'ASSIGNED',
      'FINDING',
      'CREATING',
      'SPF-0101',
      'SPF-0301',
      'SPF-0302',
      'SPF-0303',
      'SPF-0401',
      'SPF-0501',
    ]);
    const toJourneyEvent = (event: CarrierWebhookEvent): JourneyEvent => ({
      time: new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(event.eventAt)),
      carrier: instantStage?.carrier || deliveryCarrier,
      label: event.statusText,
      visibility: 'shop',
    });
    const pickupEvents = instantEvents.filter(
      (event) => pickupEventIds.has(event.id) || pickupStatusCodes.has(event.statusCode),
    );
    const deliveryEvents = instantEvents.filter(
      (event) => !pickupEventIds.has(event.id) && !pickupStatusCodes.has(event.statusCode),
    );

    const instantJourney: JourneyStage[] = [
      {
        flow: 'LẤY HÀNG',
        name: 'Lấy hàng tại Shop',
        carrier: instantStage?.carrier || deliveryCarrier,
        code: instantStage?.tracking || deliveryCode,
        status: isDriverNotFound
          ? 'Không tìm được tài xế'
          : isPickedUp
            ? 'Đã lấy hàng'
            : 'Đang lấy hàng',
        state: isDriverNotFound ? 'error' : isPickedUp ? 'done' : 'current',
        flowNote: 'NVC hỏa tốc lấy trực tiếp tại Shop',
        events: pickupEvents.map(toJourneyEvent),
      },
      {
        flow: 'GIAO HÀNG',
        name: 'Giao hàng đến người nhận',
        carrier: instantStage?.carrier || deliveryCarrier,
        code: instantStage?.tracking || deliveryCode,
        status: isDelivered
          ? 'Đã giao hàng'
          : isDriverNotFound
            ? 'Chưa bắt đầu'
            : isPickedUp
              ? order.instantTracking?.statusLabel || 'Đang giao hàng'
              : 'Chưa bắt đầu',
        state: isDelivered ? 'done' : isPickedUp ? 'current' : 'pending',
        events: deliveryEvents.map(toJourneyEvent),
      },
    ];

    const returnStage = order.shippingInfo?.stages?.find(
      (stage) => stage.key === 'return' || stage.key === 'refund',
    );
    if (returnStage || order.shippingInfo?.returnTracking || order.shippingInfo?.refundTracking) {
      instantJourney.push({
        flow: 'HOÀN HÀNG',
        name: 'Hoàn hàng về Shop',
        carrier: returnStage?.carrier || instantStage?.carrier || deliveryCarrier,
        code:
          returnStage?.tracking ||
          order.shippingInfo?.returnTracking ||
          order.shippingInfo?.refundTracking ||
          '',
        status: returnStage?.carrierStatusText || 'Đang hoàn hàng',
        state: returnStage?.status === 'completed' ? 'done' : 'current',
        flowNote: 'Phát sinh do giao không thành công',
        events: [...(returnStage?.webhookEvents || [])]
          .sort((a, b) => new Date(a.eventAt).getTime() - new Date(b.eventAt).getTime())
          .map((event) => ({
            ...toJourneyEvent(event),
            carrier: returnStage?.carrier || instantStage?.carrier || deliveryCarrier,
          })),
      });
    }

    return instantJourney;
  }

  const persistedStages = order.shippingInfo?.stages || [];
  if (persistedStages.length) {
    return persistedStages.map((stage) => ({
      flow:
        stage.key === 'pickup'
          ? 'LẤY HÀNG'
          : stage.key === 'delivery'
            ? 'GIAO HÀNG'
            : stage.key === 'return'
              ? 'HOÀN HÀNG'
              : 'TRẢ HÀNG CUỐI',
      name: stage.title,
      carrier: stage.carrier,
      code: stage.tracking || 'NVC chưa cấp mã vận đơn',
      status: stage.carrierStatusText || order.status,
      state:
        stage.status === 'completed'
          ? 'done'
          : stage.status === 'active'
            ? isSpfFailureStatus(order.spfCode)
              ? 'error'
              : 'current'
            : 'pending',
      events: [...(stage.webhookEvents || [])]
        .sort((left, right) => new Date(left.eventAt).getTime() - new Date(right.eventAt).getTime())
        .map((event) => ({
          time: formatDisplayDate(event.eventAt),
          carrier: stage.carrier,
          label: event.statusText,
          visibility: 'shop' as const,
          rawCode: event.statusCode,
        })),
    }));
  }

  if (phase === 'creating' && order.selectedCarrier) {
    return [
      {
        flow: 'KHỞI TẠO VẬN ĐƠN',
        name: 'Tạo vận đơn tại NVC',
        carrier: order.selectedCarrier,
        code: 'NVC chưa cấp mã vận đơn',
        status: order.status,
        state: isSpfFailureStatus(order.spfCode) ? 'error' : 'current',
        events: (order.statusHistory || []).map((entry) => ({
          time: formatDisplayDate(entry.changedAt),
          carrier: 'SuperPlatform',
          label: `${entry.statusName}${entry.reason ? ` · ${entry.reason}` : ''}`,
          visibility: 'shop' as const,
          rawCode: entry.statusCode,
        })),
      },
    ];
  }

  if (isReturn) {
    return [
      {
        flow: 'LẤY HÀNG',
        name: 'Lấy hàng',
        carrier: 'SuperShip',
        code: pickupCode,
        status: 'Đã bàn giao nhà vận chuyển khác',
        state: 'done',
        events: [
          { time: '07:30', carrier: 'SuperShip', label: 'Chờ lấy hàng', visibility: 'shop' },
          {
            time: '07:35',
            carrier: 'SuperPlatform',
            label: 'SuperPlatform: Phân bổ tài xế lấy hàng khu vực Nam Từ Liêm',
            visibility: 'internal',
            rawCode: 'AI-ROUTE-01',
          },
          { time: '07:40', carrier: 'SuperShip', label: 'Đang lấy hàng', visibility: 'shop' },
          {
            time: '07:55',
            carrier: 'SuperShip',
            label: 'Lấy hàng thành công tại địa chỉ Shop',
            visibility: 'shop',
          },
          {
            time: '08:05',
            carrier: 'SuperShip',
            label: 'Nhập kho SuperShip Mễ Trì',
            visibility: 'shop',
          },
          {
            time: '08:08',
            carrier: 'SuperShip',
            label: 'Băng chuyền chia chọn Sort-HN01: Quét mã luồng liên tỉnh',
            visibility: 'internal',
            rawCode: 'SORT-B1-SCAN',
          },
          {
            time: '08:10',
            carrier: 'SuperShip',
            label: 'Chờ bàn giao cho NVC giao (Lập biên bản BB-SPS-2608)',
            visibility: 'internal',
            rawCode: 'BB-SPS-2608',
          },
          {
            time: '08:31',
            carrier: 'SuperShip',
            label: 'Đã bàn giao nhà vận chuyển khác',
            visibility: 'shop',
          },
          {
            time: '08:32',
            carrier: 'SuperPlatform',
            label: `Giao thức SPF: Gửi gói tin Handshake sang Gateway ${deliveryCarrier} (HTTP 200)`,
            visibility: 'internal',
            rawCode: 'SPF-SYNC-OK',
          },
        ],
      },
      {
        flow: 'GIAO HÀNG',
        name: 'Giao hàng',
        carrier: deliveryCarrier,
        code: deliveryCode,
        status: 'Giao hàng không thành công',
        state: 'warn',
        events: [
          {
            time: '08:20',
            carrier: deliveryCarrier,
            label: 'Đang đi lấy hàng (Trung chuyển nhận kiện)',
            visibility: 'shop',
          },
          {
            time: '08:30',
            carrier: deliveryCarrier,
            label: 'Lấy hàng thành công từ SuperShip',
            visibility: 'shop',
          },
          {
            time: '08:45',
            carrier: deliveryCarrier,
            label: `Nhận hàng vào bưu cục Nguồn (${deliveryCarrier} Hub HN)`,
            visibility: 'shop',
          },
          {
            time: '08:50',
            carrier: deliveryCarrier,
            label: 'Đóng bao tải liên tỉnh (Mã tải: BAG-BDI-9921)',
            visibility: 'internal',
            rawCode: 'BAG-BDI-9921',
          },
          {
            time: '09:10',
            carrier: deliveryCarrier,
            label: 'Xuất hàng đến trung tâm khai thác (trung tâm chia chọn)',
            visibility: 'shop',
          },
          {
            time: '10:20',
            carrier: deliveryCarrier,
            label: 'Nhận hàng vào trung tâm khai thác (trung tâm chia chọn)',
            visibility: 'shop',
          },
          {
            time: '11:05',
            carrier: deliveryCarrier,
            label: 'Xuất hàng khỏi trung tâm khai thác (trung tâm chia chọn)',
            visibility: 'shop',
          },
          {
            time: '13:20',
            carrier: deliveryCarrier,
            label: 'Nhận hàng vào bưu cục phát hàng (An Nhơn - Bình Định)',
            visibility: 'shop',
          },
          {
            time: '13:30',
            carrier: deliveryCarrier,
            label: 'Điều phối shipper phát hàng: Trần Đình Quân (Mã NV: DRV-102)',
            visibility: 'internal',
            rawCode: 'DISPATCH-DRV-102',
          },
          {
            time: '14:05',
            carrier: deliveryCarrier,
            label: 'Xuất hàng để đi giao',
            visibility: 'shop',
          },
          {
            time: '15:30',
            carrier: deliveryCarrier,
            label: 'Giao hàng không thành công (Khách hẹn lại)',
            visibility: 'shop',
          },
          {
            time: '15:35',
            carrier: deliveryCarrier,
            label: 'Shipper log: Gọi 3 cuộc 033****429 không nhấc máy (Lý do F02)',
            visibility: 'internal',
            rawCode: 'FAIL-REASON-F02',
          },
          {
            time: '15:40',
            carrier: 'SuperPlatform',
            label: 'CS SuperPlatform: Gửi cảnh báo giao không thành công tới tài khoản Shop',
            visibility: 'internal',
            rawCode: 'CS-ALERT-09',
          },
        ],
      },
      {
        flow: 'HOÀN HÀNG',
        name: 'Hoàn hàng',
        carrier: returnCarrier,
        code: returnCode,
        status: 'Xuất hàng khỏi trung tâm khai thác để trả về',
        state: 'warn',
        flowNote: '· Lấy hàng → Giao hàng',
        events: [
          {
            time: '15:45',
            carrier: 'Shop',
            label: 'Shop xác nhận yêu cầu hoàn hàng qua hệ thống',
            visibility: 'shop',
          },
          {
            time: '15:48',
            carrier: 'SuperPlatform',
            label: 'SuperPlatform: Phê duyệt chuyển hoàn tự động (Auto-Return SLA 48h)',
            visibility: 'internal',
            rawCode: 'AUTO-RET-APPR',
          },
          {
            time: '15:50',
            carrier: returnCarrier,
            label: 'Xác nhận chuyển hoàn',
            visibility: 'shop',
          },
          {
            time: '16:10',
            carrier: returnCarrier,
            label: 'Xuất hàng khỏi bưu cục phát để trả về',
            visibility: 'shop',
          },
          {
            time: '16:20',
            carrier: returnCarrier,
            label: 'Niêm phong túi hàng hoàn (Mã seal: RET-SEAL-0881)',
            visibility: 'internal',
            rawCode: 'SEAL-0881',
          },
          {
            time: '17:00',
            carrier: returnCarrier,
            label: 'Nhận hàng vào trung tâm khai thác để trả về',
            visibility: 'shop',
          },
          {
            time: '18:00',
            carrier: returnCarrier,
            label: 'Xuất hàng khỏi trung tâm khai thác để trả về',
            visibility: 'shop',
          },
          {
            time: '18:05',
            carrier: 'SuperPlatform',
            label: 'Kế toán SuperPlatform: Cấn trừ phí hoàn 5.000đ vào kỳ đối soát',
            visibility: 'internal',
            rawCode: 'FIN-AUDIT-RET',
          },
        ],
      },
    ];
  }

  if (phase === 'handover' || phase === 'delivery' || order.spfCode === 'SPF-0901') {
    return [
      {
        flow: 'LẤY HÀNG',
        name: 'Lấy hàng',
        carrier: 'SuperShip',
        code: pickupCode,
        status: 'Đã bàn giao nhà vận chuyển khác',
        state: 'done',
        events: [
          { time: '08:00', carrier: 'SuperShip', label: 'Chờ lấy hàng', visibility: 'shop' },
          {
            time: '08:15',
            carrier: 'SuperPlatform',
            label: 'Điều phối lấy hàng HUB-HN02',
            visibility: 'internal',
            rawCode: 'DISPATCH-PICKUP',
          },
          { time: '08:40', carrier: 'SuperShip', label: 'Lấy hàng thành công', visibility: 'shop' },
          {
            time: '09:15',
            carrier: 'SuperShip',
            label: 'Nhập kho trung chuyển',
            visibility: 'shop',
          },
          {
            time: '09:45',
            carrier: 'SuperShip',
            label: 'Đã bàn giao nhà vận chuyển khác',
            visibility: 'shop',
          },
        ],
      },
      {
        flow: 'GIAO HÀNG',
        name: 'Giao hàng',
        carrier: deliveryCarrier,
        code: deliveryCode,
        status: order.status,
        state: order.spfCode === 'SPF-0901' ? 'done' : 'current',
        events: [
          {
            time: '10:15',
            carrier: deliveryCarrier,
            label: 'Nhận hàng vào bưu cục phát hàng',
            visibility: 'shop',
          },
          {
            time: '10:30',
            carrier: deliveryCarrier,
            label: 'Phân tuyến shipper giao hàng',
            visibility: 'internal',
            rawCode: 'ROUTE-DELIVERY',
          },
          {
            time: '10:45',
            carrier: deliveryCarrier,
            label: 'Xuất hàng để đi giao',
            visibility: 'shop',
          },
        ],
      },
    ];
  }

  if (phase === 'cancelled') {
    return [
      {
        flow: 'LẤY HÀNG',
        name: 'Lấy hàng',
        carrier: 'SuperShip',
        code: pickupCode,
        status: 'Đã hủy',
        state: 'error',
        events: [
          { time: '11:21', carrier: 'SuperShip', label: 'Chờ lấy hàng', visibility: 'shop' },
          {
            time: '11:22',
            carrier: 'SuperShip',
            label: 'Đơn vị vận chuyển thông báo đơn hàng đã bị hủy',
            visibility: 'shop',
          },
          {
            time: '11:23',
            carrier: 'SuperPlatform',
            label: 'SuperPlatform Audit: Giải phóng mã vận đơn và hoàn hạn mức công nợ',
            visibility: 'internal',
            rawCode: 'AUDIT-RELEASE-LIMIT',
          },
        ],
      },
    ];
  }

  return [
    {
      flow: 'LẤY HÀNG',
      name: 'Lấy hàng',
      carrier: 'SuperShip',
      code: pickupCode,
      status: 'Chờ lấy hàng',
      state: 'current',
      events: [
        { time: '09:00', carrier: 'SuperShip', label: 'Chờ lấy hàng', visibility: 'shop' },
        {
          time: '09:15',
          carrier: 'SuperPlatform',
          label: 'Hệ thống đã tiếp nhận và điều phối tài xế lấy hàng',
          visibility: 'shop',
        },
        {
          time: '09:20',
          carrier: 'SuperPlatform',
          label: 'SuperPlatform Engine: Tối ưu hoá chặng ghép đơn nội đô',
          visibility: 'internal',
          rawCode: 'AI-OPTIMIZE-LOCAL',
        },
      ],
    },
  ];
}

type DetailActionHistoryRecord = {
  item: Omit<ActionHistoryItem, 'id'>;
  occurredAt: number;
  sequence: number;
};

function getActionHistoryTimestamp(value?: string): number {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isFinite(timestamp) ? timestamp : 0;
}

function buildDetailActionHistory(order: Order): ActionHistoryItem[] {
  const records: DetailActionHistoryRecord[] = [];
  let sequence = 0;
  const addRecord = (
    item: Omit<ActionHistoryItem, 'id'>,
    occurredAt: string | undefined,
  ) => {
    records.push({
      item,
      occurredAt: getActionHistoryTimestamp(occurredAt),
      sequence: sequence++,
    });
  };

  const stages = order.shippingInfo?.stages || [];
  const statusHistory = order.statusHistory || [];
  const stageEvents = stages.flatMap((stage) =>
    (stage.webhookEvents || []).map((event) => ({ stage, event })),
  );
  const consumedStatusEntries = new Set<number>();

  const findMatchingStatusEntry = (event: CarrierWebhookEvent) => {
    const eventTime = getActionHistoryTimestamp(event.eventAt);
    let bestIndex = -1;
    let bestDistance = Number.POSITIVE_INFINITY;

    statusHistory.forEach((entry, index) => {
      if (consumedStatusEntries.has(index) || entry.statusCode !== event.mappedSpfCode) {
        return;
      }
      const distance = Math.abs(getActionHistoryTimestamp(entry.changedAt) - eventTime);
      if (distance <= 90_000 && distance < bestDistance) {
        bestIndex = index;
        bestDistance = distance;
      }
    });

    return bestIndex;
  };

  addRecord(
    {
      actor: order.shopName || 'Shop',
      message: `đã tạo đơn hàng ${order.id} trên SuperPlatform.`,
      time: formatDisplayDate(order.createdAt),
      visibility: 'shop',
    },
    order.createdAt,
  );

  const createdWaybills = new Set<string>();
  for (const stage of stages) {
    if (!stage.tracking || createdWaybills.has(stage.tracking)) continue;
    createdWaybills.add(stage.tracking);

    const stageLabel =
      stage.key === 'pickup'
        ? 'lấy hàng'
        : stage.key === 'delivery'
          ? 'giao hàng'
          : stage.key === 'return'
            ? 'hoàn hàng'
            : 'trả hàng cuối';

    if (stage.requestSentAt) {
      addRecord(
        {
          actor: 'SuperPlatform',
          message: `đã gửi yêu cầu tạo vận đơn ${stageLabel} tới ${stage.carrier}.`,
          time: formatDisplayDate(stage.requestSentAt),
          visibility: 'shop',
        },
        stage.requestSentAt,
      );
    }
    if (stage.carrierAcceptedAt) {
      addRecord(
        {
          actor: stage.carrier,
          message: `đã tạo vận đơn thành công với mã ${stage.tracking}.`,
          time: formatDisplayDate(stage.carrierAcceptedAt),
          visibility: 'shop',
        },
        stage.carrierAcceptedAt,
      );
    }
  }

  for (const { stage, event } of stageEvents) {
    const matchedStatusIndex = findMatchingStatusEntry(event);
    const isPlatformEvent = event.statusCode.startsWith('SPF-');
    if (isPlatformEvent && matchedStatusIndex >= 0) {
      consumedStatusEntries.add(matchedStatusIndex);
    }

    const isTechnicalEvent = event.processingStatus !== 'processed';
    const statusLabel = event.statusText || event.mappedSpfStatus;
    const processingNote =
      event.processingStatus === 'duplicate'
        ? ' Sự kiện trùng đã được bỏ qua.'
        : event.processingStatus === 'failed'
          ? ' Sự kiện đã nhận nhưng chưa đồng bộ thành công.'
          : '';

    if (isPlatformEvent) {
      addRecord(
        {
          actor: 'SuperPlatform',
          message: isTechnicalEvent
            ? `đã nhận sự kiện trạng thái tổng “${statusLabel}”.${processingNote}`
            : `đã cập nhật trạng thái tổng sang “${statusLabel}”.`,
          time: formatDisplayDate(event.eventAt),
          visibility: isTechnicalEvent ? 'internal' : 'shop',
          rawMeta: `${event.statusCode} · ${event.requestId}`,
        },
        event.eventAt,
      );
      continue;
    }

    addRecord(
      {
        actor: stage.carrier,
        stageTag: `${stage.title} · ${stage.carrier}`,
        message: isTechnicalEvent
          ? `đã gửi trạng thái vận đơn ${stage.tracking} “${statusLabel}”.${processingNote}`
          : `đã cập nhật vận đơn ${stage.tracking} sang “${statusLabel}”${event.location ? ` tại ${event.location}` : ''}.`,
        time: formatDisplayDate(event.eventAt),
        visibility: isTechnicalEvent ? 'internal' : 'shop',
        rawMeta: `${event.statusCode} · ${event.requestId}`,
      },
      event.eventAt,
    );
  }

  statusHistory.forEach((entry, index) => {
    if (consumedStatusEntries.has(index)) return;

    const matchingCarrierEvent = stageEvents
      .filter(({ event }) => {
        if (event.processingStatus !== 'processed' || event.statusCode.startsWith('SPF-')) {
          return false;
        }
        const distance = Math.abs(
          getActionHistoryTimestamp(event.eventAt) - getActionHistoryTimestamp(entry.changedAt),
        );
        return event.mappedSpfCode === entry.statusCode && distance <= 90_000;
      })
      .sort(
        (left, right) =>
          Math.abs(getActionHistoryTimestamp(left.event.eventAt) - getActionHistoryTimestamp(entry.changedAt)) -
          Math.abs(getActionHistoryTimestamp(right.event.eventAt) - getActionHistoryTimestamp(entry.changedAt)),
      )[0];

    const reason = entry.reason && entry.reasonCode !== 'UI_CURRENT_STATE' ? ` ${entry.reason}` : '';
    addRecord(
      {
        actor: 'SuperPlatform',
        message: matchingCarrierEvent
          ? `đã nhận trạng thái NVC “${matchingCarrierEvent.event.statusText}” từ ${matchingCarrierEvent.stage.carrier} và cập nhật trạng thái tổng của đơn sang “${entry.statusName}”.`
          : `đã cập nhật trạng thái tổng của đơn sang “${entry.statusName}”.${reason}`,
        time: formatDisplayDate(entry.changedAt),
        visibility: 'shop',
        rawMeta: `${entry.statusCode}${entry.reasonCode ? ` · ${entry.reasonCode}` : ''}`,
      },
      entry.changedAt,
    );
  });

  return records
    .sort((left, right) => right.occurredAt - left.occurredAt || right.sequence - left.sequence)
    .map((record, index) => ({ id: 20_000 + index, ...record.item }));
}

function getDetailActionHistory(order: Order): ActionHistoryItem[] {
  return buildDetailActionHistory(order);
}

function formatDisplayDate(dateStr?: string): string {
  if (!dateStr) return '—';
  if (dateStr.includes(' - ') || dateStr.includes(' • ')) return dateStr;
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  } catch {
    return dateStr;
  }
}

function maskPhone(phone: string): string {
  if (phone.length >= 10) {
    return phone.slice(0, 3) + '****' + phone.slice(-3);
  }
  return phone;
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const notify = useToast();
  const { orders, cancelOrder, markPrinted, recordAccessAudit, applyOperation, updateOrder } =
    useOrders();

  const [showPhoneReceiver, setShowPhoneReceiver] = useState(false);
  const [showPhoneSender, setShowPhoneSender] = useState(false);
  const [showDeliveryShipperPhone, setShowDeliveryShipperPhone] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportPreset, setSupportPreset] = useState({ category: '', content: '' });
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [showEditCodModal, setShowEditCodModal] = useState(false);
  const [editCodValue, setEditCodValue] = useState('');
  const [isPartialReturn, setIsPartialReturn] = useState(false);
  const [editCodNote, setEditCodNote] = useState('');
  const [showEditInfoModal, setShowEditInfoModal] = useState(false);
  const [showPrintHistory, setShowPrintHistory] = useState(false);
  const [isDeliveryProofExpanded, setIsDeliveryProofExpanded] = useState(false);
  const [operationModal, setOperationModal] = useState<
    | 'retry-create'
    | 'pickup-retry'
    | 'redelivery'
    | 'confirm-return'
    | 'change-carrier'
    | 'images'
    | null
  >(null);
  const [operationError, setOperationError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [operationReason, setOperationReason] = useState('');
  const [pendingImages, setPendingImages] = useState<
    Array<{
      id: string;
      imageUrl: string;
      fileName: string;
      uploadedAt: string;
      uploadedBy: string;
    }>
  >([]);
  const [isStale, setIsStale] = useState(false);

  const outletContext = useOutletContext<{ isInternal: boolean }>();
  const isInternal = outletContext?.isInternal ?? false;

  // Mặc định tất cả các chặng trong hành trình sẽ đóng (theo yêu cầu người dùng)
  const [expandedStages, setExpandedStages] = useState<Record<number, boolean>>({});
  const [showAllLogs, setShowAllLogs] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  const order = orders.find((o) => o.id === id);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (!event.key?.startsWith('superplatform:db:orders') || !event.newValue) return;
      try {
        const updatedOrders = JSON.parse(event.newValue) as Order[];
        const updated = updatedOrders.find((item) => item.id === id);
        if (updated && updated.updatedAt !== order?.updatedAt) setIsStale(true);
      } catch {
        // Ignore malformed external storage events and keep the current safe snapshot.
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [id, order?.updatedAt]);
  const viewer: OrderViewer = isInternal
    ? { kind: 'internal' }
    : { kind: 'shop', shopId: order?.shopId || 'S275518' };

  if (!order) {
    return (
      <div className="order-detail-page-wrapper">
        <AsyncStatePanel
          state="not-found"
          actionLabel="Về danh sách Order"
          onAction={() => navigate('/orders')}
        />
      </div>
    );
  }

  const viewDecision = getOrderPermission(viewer, order, 'view_order');
  if (!viewDecision.allowed) {
    return (
      <div className="order-detail-page-wrapper">
        <AsyncStatePanel
          state="forbidden"
          description={viewDecision.reason}
          actionLabel="Về danh sách Order"
          onAction={() => navigate('/orders')}
        />
      </div>
    );
  }

  const permission = (capability: OrderCapability) => getOrderPermission(viewer, order, capability);
  const shopShippingFee = order.shippingFee ?? 0;
  const shopRecipientAmount = order.payer === 'sender' ? order.cod : order.cod + shopShippingFee;

  const openSupportRequest = (category = 'Đơn Hàng', content = '') => {
    setSupportPreset({ category, content });
    setShowSupportModal(true);
  };

  const currentDeliveryCarrier =
    order.shippingInfo?.deliveryCarrier || order.selectedCarrier || 'Chưa gán';
  const availableCarrierOptions = CHANGE_CARRIER_OPTIONS.filter(
    (option) => !isSameCarrier(option.value, currentDeliveryCarrier),
  );

  const openOperation = (type: typeof operationModal) => {
    setOperationError('');
    setOperationReason('');
    setPendingImages([]);
    if (type === 'change-carrier') {
      setSelectedCarrier(availableCarrierOptions[0]?.value || '');
    }
    setOperationModal(type);
  };

  const submitOperation = async (run: () => void, successMessage: string) => {
    if (isSubmitting) return;
    setOperationError('');
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 450));
      run();
      setOperationModal(null);
      notify(successMessage);
    } catch (error) {
      setOperationError(
        error instanceof Error ? error.message : 'Thao tác thất bại. Vui lòng thử lại.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageFiles = (files: FileList | null) => {
    if (!files?.length) return;
    const selected = Array.from(files).slice(0, Math.max(0, 5 - pendingImages.length));
    selected.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setOperationError(`${file.name} không phải là tệp ảnh hợp lệ.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setOperationError(`${file.name} vượt quá dung lượng tối đa 5 MB.`);
        return;
      }
      const reader = new FileReader();
      reader.onload = () =>
        setPendingImages((current) => [
          ...current,
          {
            id: `GOODS-${order.id}-${Date.now()}-${file.name}`,
            imageUrl: String(reader.result),
            fileName: file.name,
            uploadedAt: new Date().toISOString(),
            uploadedBy: isInternal ? 'Nội bộ SuperPlatform' : order.shopName || 'Shop',
          },
        ]);
      reader.readAsDataURL(file);
    });
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(order.id);
    notify('Đã sao chép mã đơn hàng!');
  };

  const handleCopyWaybill = (waybill: string) => {
    navigator.clipboard.writeText(waybill);
    setCopiedCode(waybill);
    notify('Đã sao chép mã vận đơn: ' + waybill);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleStage = (index: number) => {
    setExpandedStages((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const transportLegs = getDetailTransportLegs(order).filter((leg) =>
    hasCarrierIconDetail(leg.carrier),
  );
  const deliveryStage = order.shippingInfo?.stages?.find((stage) => stage.key === 'delivery');
  const activeDeliveryStage =
    deliveryStage &&
    (deliveryStage.status === 'active' || order.shippingInfo?.currentStage === 'delivery')
      ? deliveryStage
      : undefined;
  const deliveryShipperStage =
    deliveryStage &&
    deliveryStage.status !== 'pending' &&
    order.shipperDeliveryName &&
    order.shipperDeliveryPhone
      ? deliveryStage
      : undefined;
  const deliveryShipperBadge = activeDeliveryStage
    ? 'Đang phụ trách'
    : order.spfCode === 'SPF-0901'
      ? 'Đã giao thành công'
      : 'Đã kết thúc lượt giao';
  const deliveryProofs =
    order.deliveryProofs?.length || order.spfCode !== 'SPF-0901'
      ? order.deliveryProofs || []
      : [
          {
            id: `POD-${order.id}-fallback`,
            imageUrl: '/images/delivery-proof/proof-delivered-v1.png',
            capturedAt: order.deliveryAt || order.updatedAt || order.createdAt,
            capturedBy: order.shipperDeliveryName || 'Nhân viên giao hàng',
            note: 'Kiện hàng đã được giao an toàn tại địa chỉ người nhận.',
          },
        ];
  const journeyStages = getDetailJourneyStages(order).filter(
    (stage) => stage.state !== 'pending' && stage.status !== 'Chưa bắt đầu',
  );
  const printActions: ActionHistoryItem[] = [...(order.printHistory || [])]
    .reverse()
    .map((record, index) => ({
      id: -(index + 1),
      actor: record.printedBy,
      message: `đã in nhãn lần ${order.printHistory!.length - index} bằng mẫu ${record.templateType}, mã vận đơn ${record.waybill}.`,
      time: formatDisplayDate(record.printedAt),
      visibility: 'shop',
    }));
  const accessAuditActions: ActionHistoryItem[] = (order.accessAudit || []).map(
    (record, index) => ({
      id: -(1000 + index),
      actor: record.viewedBy,
      message: `đã xem SĐT shipper đang phụ trách lượt giao. Lý do: ${record.reason}.`,
      time: formatDisplayDate(record.viewedAt),
      visibility: 'internal',
    }),
  );
  const carrierChangeActions: ActionHistoryItem[] = (order.carrierChangeHistory || []).map(
    (record, index) => ({
      id: -(2000 + index),
      actor: record.changedBy,
      message: `đã đổi NVC giao từ ${record.fromCarrier} sang ${record.toCarrier}. Lý do: ${record.reason}.`,
      time: formatDisplayDate(record.changedAt),
      visibility: 'internal',
    }),
  );
  const goodsImageActions: ActionHistoryItem[] = (order.goodsImages || []).map((record, index) => ({
    id: -(3000 + index),
    actor: record.uploadedBy,
    message: `đã thêm ảnh hàng hóa “${record.fileName}”.`,
    time: formatDisplayDate(record.uploadedAt),
    visibility: 'shop',
  }));
  const actionHistory = [
    ...carrierChangeActions,
    ...goodsImageActions,
    ...accessAuditActions,
    ...printActions,
    ...getDetailActionHistory(order),
  ];

  return (
    <div className={`order-detail-page-wrapper ${isInternal ? 'internal-order-detail' : ''}`}>
      <div className="order-detail-container">
        {/* Top Header / Title Bar */}
        <div className="order-detail-header">
          <div className="order-detail-header-left">
            <button
              type="button"
              className="order-back-btn"
              onClick={() => navigate('/orders')}
              title="Quay lại danh sách đơn hàng"
            >
              <ArrowLeft size={18} />
            </button>
            <h1 className="order-detail-title">
              Chi Tiết Đơn Hàng <span className="order-id-bold">{order.id}</span>
              <button
                type="button"
                className="order-copy-btn"
                onClick={handleCopyId}
                title="Sao chép mã đơn"
              >
                <Copy size={16} />
              </button>
            </h1>
          </div>

          <div className="order-detail-header-right">
            <span className={`order-status-pill status-${getSpfStatusTone(order.spfCode)}`}>
              {order.status}
            </span>
            <span className="order-header-created-date">
              Ngày tạo đơn: {formatDisplayDate(order.createdAt)}
            </span>
          </div>
        </div>

        {order.syncStatus === 'FAILED' && (
          <AsyncStatePanel
            state="error"
            compact
            title="Đồng bộ Order đang gặp lỗi"
            description="Một số trạng thái từ nhà vận chuyển có thể chưa phải dữ liệu mới nhất. Bạn vẫn có thể xem thông tin đã đồng bộ gần nhất."
            actionLabel={isInternal ? 'Mở vận hành NVC' : 'Gửi yêu cầu hỗ trợ'}
            onAction={() =>
              isInternal
                ? navigate(`/carrier-operations?orderId=${order.id}`)
                : openSupportRequest(
                    'Đối Soát',
                    `Yêu cầu kiểm tra lỗi đồng bộ trạng thái của đơn ${order.id}.`,
                  )
            }
          />
        )}

        {isStale && (
          <AsyncStatePanel
            state="stale"
            compact
            actionLabel="Tải dữ liệu mới"
            onAction={() => window.location.reload()}
          />
        )}

        {/* Main 2-Column Grid Layout */}
        <div className="order-detail-grid">
          {/* Left Column (~62% width) */}
          <div className="order-col-left">
            {/* Card 1: Thông tin người nhận */}
            <div className="order-card">
              <div className="order-card-header">
                <div className="card-header-icon-box green">
                  <MapPin size={16} />
                </div>
                <h3 className="order-card-header-title">Thông tin người nhận</h3>
              </div>
              <div className="order-card-body">
                <div className="order-address-line">
                  {order.address}, {order.region}
                </div>
                <div className="order-contact-row">
                  <span className="order-contact-text">
                    <b>{order.name}</b> -{' '}
                    {showPhoneReceiver
                      ? order.phone.length > 9
                        ? order.phone
                        : '0341234352'
                      : maskPhone(order.phone)}
                  </span>
                  <button
                    type="button"
                    className="order-icon-badge-btn"
                    onClick={() => setShowPhoneReceiver(!showPhoneReceiver)}
                    title={showPhoneReceiver ? 'Ẩn số điện thoại' : 'Xem đầy đủ số điện thoại'}
                  >
                    {showPhoneReceiver ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Chi tiết hàng gửi (Enriched from supership-order-mockui) */}
            <div className="order-card">
              <div className="order-card-header">
                <div className="card-header-icon-box slate">
                  <Package size={16} />
                </div>
                <h3 className="order-card-header-title">Chi tiết hàng gửi</h3>
              </div>
              <div className="order-card-body">
                <div className="product-summary-box">
                  <div className="product-name-title">
                    Tên sản phẩm: <b>{order.product || 'Sách'}</b>
                  </div>
                  <div className="product-specs-grid">
                    <div className="spec-item">
                      <span className="spec-label">Khối lượng:</span>
                      <span className="spec-val">
                        <b>{order.weight || 334} gr</b>
                      </span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Kích thước (DxRxC):</span>
                      <span className="spec-val">
                        <b>
                          {order.length || 15} x {order.width || 10} x {order.height || 5} cm
                        </b>
                      </span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Trị giá khai giá:</span>
                      <span className="spec-val">
                        <b>{money(order.value || 100000)}</b>
                      </span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-label">Mã đơn riêng:</span>
                      <span className="spec-val font-mono">
                        <b>{order.privateId || 'SPAI-TEST-882'}</b>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="order-note-box">
                  <span className="note-title">Ghi chú giao hàng:</span>
                  <span className="note-text">
                    {order.note || 'Khách không nhận vui lòng thu 30k phí giao hàng. Cảm ơn!'}
                  </span>
                </div>
                {!!order.goodsImages?.length && (
                  <div className="saved-goods-images">
                    <div className="saved-goods-images-heading">
                      <ImagePlus size={15} />
                      <strong>Ảnh hàng hóa ({order.goodsImages.length})</strong>
                    </div>
                    <div className="goods-image-preview-grid">
                      {order.goodsImages.map((image) => (
                        <a
                          key={image.id}
                          className="goods-image-preview saved"
                          href={image.imageUrl}
                          target="_blank"
                          rel="noreferrer"
                          title={`Mở ảnh ${image.fileName}`}
                        >
                          <img src={image.imageUrl} alt={image.fileName} />
                          <span>{image.fileName}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card 3: Lịch sử hành động (Exact style of media_1789450641010.png) */}
            <div className="order-card action-history-card">
              <div className="history-card-header">
                <Clock size={16} className="history-card-clock-icon" />
                <h3 className="history-card-title">Lịch sử hành động</h3>
              </div>
              <div className="order-card-body history-card-body">
                {(() => {
                  const filtered = actionHistory.filter(
                    (a) => isInternal || a.visibility === 'shop',
                  );
                  const displayList = showAllLogs ? filtered : filtered.slice(0, 8);

                  if (filtered.length === 0) {
                    return (
                      <div className="activity-empty-state">
                        Không có lịch sử hành động nào được ghi nhận.
                      </div>
                    );
                  }

                  return (
                    <div className="history-flow-container">
                      <div className="history-list-streamlined">
                        {displayList.map((item) => (
                          <div key={item.id} className="history-row-item">
                            <div className="history-row-text">
                              <b>{item.actor}</b> {item.message}
                            </div>
                            <div className="history-row-time">{item.time}</div>
                          </div>
                        ))}
                      </div>

                      {filtered.length > 8 && (
                        <div className="history-footer-wrap">
                          <button
                            type="button"
                            className="btn-history-more"
                            onClick={() => setShowAllLogs(!showAllLogs)}
                          >
                            {showAllLogs ? 'Thu gọn' : 'Xem thêm'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Card 4: Thông tin người gửi */}
            <div className="order-card">
              <div className="order-card-header">
                <div className="card-header-icon-box red">
                  <CircleDot size={16} />
                </div>
                <h3 className="order-card-header-title">Thông tin người gửi</h3>
              </div>
              <div className="order-card-body">
                <div className="order-address-line">
                  231/15 Dương Bá Trạc, Phường 01, Quận 8, Thành phố Hồ Chí Minh
                </div>
                <div className="order-contact-row">
                  <span className="order-contact-text">
                    <b>
                      {isInternal
                        ? order.shopName || 'Cửa hàng'
                        : 'S275518 - SPAI - CÔNG TY TEST 1'}
                    </b>{' '}
                    | Bùi Duy Kha -{' '}
                    {showPhoneSender ? '0399888077' : '039****077'}
                  </span>
                  <button
                    type="button"
                    className="order-icon-badge-btn"
                    onClick={() => setShowPhoneSender(!showPhoneSender)}
                    title={showPhoneSender ? 'Ẩn số điện thoại' : 'Xem đầy đủ số điện thoại'}
                  >
                    {showPhoneSender ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              </div>
            </div>

            {isInternal && (
              <div className="order-card internal-operations-card">
                <div className="order-card-header">
                  <div className="card-header-icon-box slate">
                    <Info size={16} />
                  </div>
                  <div>
                    <h3 className="order-card-header-title">Thông tin vận hành nội bộ</h3>
                    <span className="order-card-header-sub">
                      Dữ liệu quản trị và đồng bộ trên SuperPlatform
                    </span>
                  </div>
                </div>
                <div className="order-card-body">
                  <div className="internal-ops-list">
                    <div className="internal-ops-row">
                      <span className="ops-row-label">TRẠNG THÁI CHUẨN</span>
                      <div className="ops-row-val">
                        <strong>{order.status}</strong>
                      </div>
                    </div>
                    <div className="internal-ops-row">
                      <span className="ops-row-label">SHOP SỞ HỮU</span>
                      <div className="ops-row-val">
                        <strong>{order.shopName || 'AB Shop'}</strong>
                      </div>
                    </div>
                    <div className="internal-ops-row">
                      <span className="ops-row-label">NGUỒN TẠO VÀ DỊCH VỤ</span>
                      <div className="ops-row-val">
                        <strong>{order.sourceChannel || 'marketplace'}</strong>
                        <small>
                          {order.serviceType === 'instant'
                            ? 'Hỏa tốc · Giao nội thành'
                            : order.serviceType || 'Tiêu chuẩn'}
                        </small>
                      </div>
                    </div>
                    <div className="internal-ops-row">
                      <span className="ops-row-label">TÌNH TRẠNG ĐỒNG BỘ</span>
                      <div className="ops-row-val">
                        <strong
                          className={order.syncStatus === 'FAILED' ? 'text-alert' : 'text-ok'}
                        >
                          {order.syncStatus === 'FAILED' ? 'Có lỗi đồng bộ' : 'Đã đồng bộ'}
                        </strong>
                        <small>
                          {order.updatedAt
                            ? formatDisplayDate(order.updatedAt)
                            : '12/09/2026 - 09:35'}
                        </small>
                      </div>
                    </div>
                    <div className="internal-ops-row">
                      <span className="ops-row-label">SỰ CỐ VẬN HÀNH</span>
                      <div className="ops-row-val">
                        <strong className={order.incidentType ? 'text-alert' : 'text-ok'}>
                          {order.incidentType || 'Không ghi nhận'}
                        </strong>
                        <small>{order.supportStatus || 'Không có yêu cầu chờ xử lý'}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {isInternal && deliveryShipperStage && permission('view_shipper').allowed && (
              <div className="order-card shipper-delivery-card">
                <div className="order-card-header">
                  <div className="card-header-icon-box blue">
                    <UserRound size={16} />
                  </div>
                  <div>
                    <h3 className="order-card-header-title">Shipper giao kiện</h3>
                    <span className="order-card-header-sub">Thông tin lượt giao gần nhất</span>
                  </div>
                  <span
                    className={`active-shipper-live-badge ${activeDeliveryStage ? '' : 'is-completed'}`}
                    style={{ marginLeft: 'auto' }}
                  >
                    {deliveryShipperBadge}
                  </span>
                </div>
                <div
                  className="order-card-body"
                  style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  {/* Box Shipper */}
                  <div className="shipper-info-box">
                    <div className="shipper-avatar">
                      {order.shipperDeliveryName
                        ? order.shipperDeliveryName
                            .trim()
                            .split(/\s+/)
                            .slice(-2)
                            .map((w) => w[0])
                            .join('')
                            .toUpperCase()
                        : 'ĐQ'}
                    </div>
                    <div className="shipper-meta">
                      <strong>{order.shipperDeliveryName || 'Trần Đình Quân'}</strong>
                      <span>
                        {order.shipperDeliveryCode
                          ? `${order.shipperDeliveryCode} · `
                          : 'DRV-105 · '}
                        {deliveryShipperStage?.carrier || 'Viettel Post'}
                      </span>
                    </div>
                    <div className="shipper-phone-col">
                      <span className="phone-label">Số điện thoại</span>
                      <div className="phone-val-row">
                        <strong>
                          {showDeliveryShipperPhone
                            ? order.shipperDeliveryPhone || '0912345519'
                            : maskPhone(order.shipperDeliveryPhone || '0912345519')}
                        </strong>
                        <button
                          type="button"
                          className="order-icon-badge-btn"
                          onClick={() => {
                            if (!showDeliveryShipperPhone) {
                              recordAccessAudit(order.id, {
                                viewedBy: 'Nhân viên nội bộ SuperPlatform',
                                field: 'shipper_delivery_phone',
                                reason: 'Tra cứu phục vụ vận hành đơn hàng',
                              });
                              notify('Đã mở SĐT shipper và ghi nhận vào lịch sử truy cập.');
                            }
                            setShowDeliveryShipperPhone((current) => !current);
                          }}
                          title={
                            showDeliveryShipperPhone
                              ? 'Ẩn số điện thoại'
                              : 'Xem số điện thoại (Chỉ người dùng nội bộ được phân quyền, có ghi log)'
                          }
                          aria-label={
                            showDeliveryShipperPhone ? 'Ẩn số điện thoại' : 'Xem số điện thoại'
                          }
                        >
                          {showDeliveryShipperPhone ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dòng thông báo bảo mật */}
                  <div className="shipper-security-note">
                    <ShieldCheck
                      size={14}
                      style={{ color: '#16a34a', flexShrink: 0, marginTop: 1 }}
                    />
                    <span>
                      Chỉ người dùng nội bộ được phân quyền mới có thể xem. Mỗi lần mở SĐT đều được
                      ghi vào lịch sử hành động.
                    </span>
                  </div>

                  {/* Bằng chứng giao hàng (POD) */}
                  {deliveryProofs.length > 0 && (
                    <div className="delivery-proof-accordion-box">
                      <button
                        type="button"
                        className="delivery-proof-trigger"
                        onClick={() => setIsDeliveryProofExpanded((prev) => !prev)}
                        aria-expanded={isDeliveryProofExpanded}
                      >
                        <div className="proof-trigger-left">
                          <div className="proof-icon-box">
                            <Camera size={16} />
                          </div>
                          <div className="proof-title-box">
                            <strong>Bằng chứng giao hàng (POD)</strong>
                            <span>Ảnh xác nhận từ nhà vận chuyển</span>
                          </div>
                        </div>
                        <div className="proof-trigger-right">
                          <span className="delivery-proof-verified">
                            <ShieldCheck size={12} /> Đã xác thực
                          </span>
                          <span className="proof-count-text">{deliveryProofs.length} ảnh</span>
                          {isDeliveryProofExpanded ? (
                            <ChevronUp size={15} />
                          ) : (
                            <ChevronDown size={15} />
                          )}
                        </div>
                      </button>

                      {isDeliveryProofExpanded && (
                        <div className="delivery-proof-content">
                          <div className="delivery-proof-body">
                            {deliveryProofs.map((proof) => (
                              <a
                                key={proof.id}
                                className="delivery-proof-item"
                                href={proof.imageUrl}
                                target="_blank"
                                rel="noreferrer"
                                title="Mở ảnh bằng chứng giao hàng"
                              >
                                <img
                                  src={proof.imageUrl}
                                  alt="Ảnh bằng chứng giao hàng thành công"
                                />
                                <div className="delivery-proof-meta">
                                  <strong>{proof.note}</strong>
                                  <span>
                                    {formatDisplayDate(proof.capturedAt)} · {proof.capturedBy}
                                  </span>
                                </div>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (~38% width) */}
          <div className="order-col-right">
            {/* Card 1: Quan hệ chặng, NVC và mã vận đơn (Harmonized match media_1789532965240.png) */}
            <div className="order-card transport-card-shell">
              <div className="order-card-header">
                <div className="card-header-icon-box red">
                  <Truck size={16} />
                </div>
                <h3 className="order-card-header-title">
                  {isInternal ? 'Quan hệ chặng, NVC và mã vận đơn' : 'Thông tin vận chuyển'}
                </h3>
              </div>
              <div className="order-card-body">
                <div
                  className="transport-legs-list"
                  style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
                >
                  {transportLegs.map((leg) => {
                    const borderClass =
                      leg.state === 'passed'
                        ? 'border-status-done'
                        : leg.state === 'active'
                          ? 'border-status-active'
                          : 'border-status-warn';

                    return (
                      <div
                        key={leg.key}
                        className={`route-leg-card-sync ${borderClass} ${isInternal ? 'internal-view' : 'shop-view'}`}
                      >
                        <div className="route-leg-left">
                          <span className="route-leg-tag-pill">{leg.role.toUpperCase()}</span>
                          <div className="route-leg-logo-frame">
                            {renderCarrierLogoDetail(leg.carrier)}
                          </div>
                          <div className="route-leg-info">
                            <strong className="route-leg-carrier-name">{leg.carrier}</strong>
                            {isInternal && leg.stageCode && (
                              <small>Mã chặng: {leg.stageCode}</small>
                            )}
                            <div className="route-leg-waybill-wrap">
                              <code>{leg.code || 'NVC chưa cấp mã vận đơn'}</code>
                              {leg.code && (
                                <button
                                  type="button"
                                  className="btn-mini-copy"
                                  onClick={() => handleCopyWaybill(leg.code)}
                                  title="Sao chép mã vận đơn"
                                >
                                  {copiedCode === leg.code ? (
                                    <Check size={11} className="text-success" />
                                  ) : (
                                    <Copy size={11} />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="route-leg-right">
                          <span className={`route-leg-status-badge ${leg.state}`}>
                            {leg.statusText}
                          </span>
                          <span className="route-leg-time-sub">
                            Cập nhật{' '}
                            {formatDisplayDate(
                              leg.carrierUpdatedAt || order.updatedAt || order.createdAt,
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {order.serviceType === 'instant' && order.instantTracking && (
                  <div className="instant-transport-summary">
                    <div className="instant-transport-status-row">
                      <span>
                        <Truck size={14} />
                        {order.instantTracking.statusLabel}
                      </span>
                    </div>

                    <div className="instant-transport-eta-row">
                      <span>
                        <Clock size={14} />
                        <small>
                          {order.instantTracking.state === 'DELIVERED'
                            ? 'Trạng thái'
                            : order.instantTracking.state === 'DRIVER_NOT_FOUND'
                              ? 'Phân bổ tài xế'
                              : 'Dự kiến tới'}
                        </small>
                        <strong>
                          {order.instantTracking.state === 'DELIVERED'
                            ? 'Đã giao hàng'
                            : order.instantTracking.state === 'DRIVER_NOT_FOUND'
                              ? 'Thất bại'
                              : formatInstantEta(order.instantTracking.etaMinutes)}
                        </strong>
                      </span>
                      <span>
                        <MapPin size={14} />
                        <small>Quãng đường còn lại</small>
                        <strong>
                          {order.instantTracking.state === 'DELIVERED'
                            ? '0 km'
                            : order.instantTracking.state === 'DRIVER_NOT_FOUND'
                              ? 'Chưa bắt đầu'
                              : formatInstantDistance(order.instantTracking.remainingDistanceKm)}
                        </strong>
                      </span>
                    </div>

                    {canViewInstantDriverJourney(order.instantTracking) && (
                      <button
                        type="button"
                        className="instant-transport-open-button"
                        onClick={() => navigate(`/orders/${order.id}/live-tracking`)}
                      >
                        Xem vị trí và hành trình tài xế <ArrowRight size={14} />
                      </button>
                    )}
                  </div>
                )}

                {isInternal && (
                  <div
                    className="carrier-operations-link-box"
                    style={{
                      marginTop: 12,
                      paddingTop: 10,
                      borderTop: '1px dashed #e2e8f0',
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => navigate(`/carrier-operations?orderId=${order.id}`)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        fontSize: '12px',
                        fontWeight: 650,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 0',
                      }}
                      title="Xem sơ đồ thời gian và trạng thái của từng nhà vận chuyển"
                    >
                      Xem sơ đồ thời gian các nhà vận chuyển <ArrowRight size={13} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Card 2: Hành trình đơn hàng theo từng chặng */}
            {journeyStages.length > 0 && (
            <div className="order-card">
              <div className="order-card-header">
                <div className="card-header-left-title">
                  <div className="card-header-icon-box blue">
                    <Compass size={16} />
                  </div>
                  <h3 className="order-card-header-title">Hành trình đơn hàng theo từng chặng</h3>
                </div>
              </div>
              <div className="order-card-body">
                <div className="stage-journey-wrapper">
                  {journeyStages.map((stage, sIdx) => {
                    const isExpanded = Boolean(expandedStages[sIdx]);
                    const isLastStage = sIdx === journeyStages.length - 1;
                    // Timeline chuẩn hoá phải giống giao diện Shop. Dữ liệu trạng thái gốc
                    // được tách riêng ở phần chi tiết NVC phía trên.
                    const visibleEvents = stage.events.filter((evt) => evt.visibility === 'shop');

                    return (
                      <div key={sIdx} className="stage-section-block">
                        {/* Flow Divider Banner */}
                        <div className="flow-label-banner">
                          <span>{stage.flow}</span>
                          {stage.flowNote && (
                            <span className="flow-note-text">{stage.flowNote}</span>
                          )}
                        </div>

                        {/* Stage Row with Timeline Column */}
                        <div className="stage-flow-row">
                          <div className="stage-timeline-col">
                            <div className={`stage-status-circle ${stage.state}`}>
                              {stage.state === 'done'
                                ? '✓'
                                : stage.state === 'error'
                                  ? '✕'
                                  : stage.state === 'warn'
                                    ? '!'
                                    : '•'}
                            </div>
                            {!isLastStage && <div className="stage-line-connector" />}
                          </div>

                          <div
                            className={`stage-cardlet ${isExpanded ? 'is-expanded' : 'is-collapsed'}`}
                          >
                            <div
                              className="stage-cardlet-header"
                              onClick={() => toggleStage(sIdx)}
                              title="Bấm để mở rộng / thu gọn danh sách sự kiện chặng"
                              role="button"
                              tabIndex={0}
                            >
                              <div className="stage-header-main">
                                <div className="stage-header-top-row">
                                  <span className="stage-title-text">
                                    Chặng {sIdx + 1}: {stage.name}
                                  </span>
                                  <span className="stage-chevron-btn">
                                    {isExpanded ? (
                                      <ChevronUp size={16} />
                                    ) : (
                                      <ChevronDown size={16} />
                                    )}
                                  </span>
                                </div>
                                <div className="stage-header-bottom-row">
                                  <span className="stage-carrier-tag">NVC: {stage.carrier}</span>
                                  <span
                                    className={`stage-status-badge ${stage.state}`}
                                    title={stage.status}
                                  >
                                    {stage.status}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="stage-cardlet-events">
                                {visibleEvents.length > 0 ? (
                                  visibleEvents.map((evt, eIdx) => {
                                    const isLastEvent = eIdx === visibleEvents.length - 1;
                                    const dotClass =
                                      isLastEvent &&
                                      (stage.state === 'warn' || stage.state === 'error')
                                        ? 'dot-warn'
                                        : 'dot-normal';

                                    return (
                                      <div
                                        key={eIdx}
                                        className={`stage-event-line ${evt.visibility === 'internal' ? 'internal-event' : ''}`}
                                      >
                                        <div className="stage-event-left">
                                          <span className={`stage-event-dot ${dotClass}`} />
                                          <div className="stage-event-details">
                                            <span className="stage-event-label">
                                              <b>{evt.carrier}</b> — {evt.label}
                                            </span>
                                          </div>
                                        </div>
                                        <time className="stage-event-time">{evt.time}</time>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="stage-no-events-muted">
                                    Không có sự kiện nào ở chặng này.
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            )}

            {/* Card 3: Phí và tiền thu hộ */}
            <div className="order-card">
              <div className="order-card-header">
                <div className="card-header-icon-box slate">
                  <Receipt size={16} />
                </div>
                <h3 className="order-card-header-title">Phí và tiền thu hộ</h3>
              </div>
              <div className="order-card-body">
                {isInternal ? (
                  <div className="fee-breakdown-table">
                    <div className="fee-item-row">
                      <span className="fee-item-label">
                        Trị giá hàng <Info size={12} className="fee-info-icon" />
                      </span>
                      <span className="fee-item-val-bold">{money(order.value)}</span>
                    </div>

                    <div className="fee-item-row">
                      <span className="fee-item-label">Khối lượng</span>
                      <span className="fee-item-val-bold">{order.weight} gr</span>
                    </div>

                    <div className="fee-item-divider" />

                    <div className="fee-item-row">
                      <span className="fee-item-label">Tiền COD cần thu</span>
                      <span className="fee-item-val-bold">{money(order.cod)}</span>
                    </div>

                    <div className="fee-item-row">
                      <span className="fee-item-label">Đã thực thu từ người nhận</span>
                      <span className="fee-item-val-green">
                        {money(order.collectedAmount ?? 0)}
                      </span>
                    </div>

                    <div className="fee-item-row">
                      <span className="fee-item-label">Trạng thái thu COD</span>
                      <span className="fee-item-val-bold">
                        {COD_COLLECTION_LABELS[order.codCollectionStatus ?? 1]}
                      </span>
                    </div>

                    <div className="fee-item-row">
                      <span className="fee-item-label">Đã đối soát cho Shop</span>
                      <span className="fee-item-val-green">{money(order.settledAmount ?? 0)}</span>
                    </div>

                    <div className="fee-item-row">
                      <span className="fee-item-label">Trạng thái đối soát COD</span>
                      <span className="fee-item-val-bold">
                        {COD_SETTLEMENT_LABELS[order.codSettlementStatus ?? 1]}
                      </span>
                    </div>

                    <div className="fee-item-divider" />

                    <div className="fee-item-row">
                      <span className="fee-item-label">Tiền bồi thường được phê duyệt</span>
                      <span className="fee-item-val-green">
                        {money(order.compensationAmount ?? 0)}
                      </span>
                    </div>

                    <div className="fee-item-row">
                      <span className="fee-item-label">Trạng thái bồi thường</span>
                      <span className="fee-item-val-bold">
                        {typeof order.compensationStatus === 'number'
                          ? COMPENSATION_LABELS[order.compensationStatus]
                          : order.compensationStatus || 'Không phát sinh'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="fee-breakdown-table">
                    <div className="fee-item-row">
                      <span className="fee-item-label">Trị giá hàng</span>
                      <span className="fee-item-val-bold">{money(order.value)}</span>
                    </div>

                    <div className="fee-item-row">
                      <span className="fee-item-label">Khối lượng</span>
                      <span className="fee-item-val-bold">{order.weight} gr</span>
                    </div>

                    <div className="fee-item-row">
                      <span className="fee-item-label">
                        Phí giao hàng ({order.payer === 'sender' ? 'Cấn trừ COD' : 'Người nhận trả'}
                        )
                      </span>
                      <span className="fee-item-val-bold">{money(shopShippingFee)}</span>
                    </div>

                    <div className="fee-item-row">
                      <span className="fee-item-label">Phí bảo hiểm</span>
                      <span className="fee-item-val-bold">{money(0)}</span>
                    </div>

                    <div className="fee-item-row">
                      <span className="fee-item-label">Phí trả hàng</span>
                      <span className="fee-item-val-bold">{money(0)}</span>
                    </div>

                    <div className="fee-item-row">
                      <span className="fee-item-label">Phí hàng đổi</span>
                      <span className="fee-item-val-bold">{money(0)}</span>
                    </div>

                    <div className="fee-item-row">
                      <span className="fee-item-label">Phí đổi địa chỉ</span>
                      <span className="fee-item-val-bold">{money(0)}</span>
                    </div>

                    <div className="fee-item-row">
                      <span className="fee-item-label">Phí thu hộ</span>
                      <span className="fee-item-val-bold">{money(0)}</span>
                    </div>

                    <div className="fee-item-row">
                      <span className="fee-item-label">Tổng phí vận chuyển</span>
                      <span className="fee-item-val-bold">{money(shopShippingFee)}</span>
                    </div>

                    <div className="fee-item-row">
                      <span className="fee-item-label">Tiền thu hộ</span>
                      <span className="fee-item-val-bold">{money(order.cod)}</span>
                    </div>

                    <div className="fee-item-row">
                      <span className="fee-item-label">Tiền thu người nhận</span>
                      <span className="fee-item-val-bold">{money(shopRecipientAmount)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card 4: Đánh giá trải nghiệm (matching Screenshot 1) */}
            <div className="order-card">
              <div className="order-card-header">
                <div className="card-header-icon-box red">
                  <Star size={16} fill="#e11d48" color="#e11d48" />
                </div>
                <h3 className="order-card-header-title">Đánh giá trải nghiệm</h3>
              </div>
              <div className="order-card-body experience-rating-body">
                <div className="rating-stars-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`btn-star-rating ${star <= (hoverRating || rating) ? 'active' : ''}`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => {
                        setRating(star);
                        notify(`Cảm ơn bạn đã đánh giá ${star} sao cho đơn hàng ${order.id}!`);
                      }}
                      title={`Đánh giá ${star} sao`}
                      aria-label={`Đánh giá ${star} sao`}
                    >
                      <Star size={28} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Card 5: Mã QR / Mã Vạch (matching Screenshot 1) */}
            <div className="order-card">
              <div className="order-card-header">
                <div className="card-header-icon-box red">
                  <QrCode size={16} color="#e11d48" />
                </div>
                <h3 className="order-card-header-title">Mã QR / Mã Vạch</h3>
                <button
                  type="button"
                  className="print-history-summary-btn"
                  onClick={() => setShowPrintHistory(true)}
                >
                  <History size={14} /> Đã in {order.printHistory?.length || 0} lần · Xem lịch sử
                </button>
              </div>
              <div className="order-card-body qr-barcode-card-body">
                <div className="qr-barcode-center">
                  <QrCodeSvg
                    value={order.shippingInfo?.deliveryTracking || 'SPXVN066263841279'}
                    size={140}
                  />
                  <div className="qr-barcode-divider" />
                  <BarcodeSvg
                    value={order.shippingInfo?.deliveryTracking || 'SPXVN066263841279'}
                    width={220}
                    height={48}
                  />
                  <div className="barcode-code-text">
                    {order.shippingInfo?.deliveryTracking || 'SPXVN066263841279'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isInternal ? (
        <div className="detail-bottom-toolbar internal-detail-toolbar">
          {permission('confirm_return').allowed && (
            <button
              type="button"
              className="btn-toolbar-red-primary"
              onClick={() => openOperation('confirm-return')}
            >
              <CheckCircle2 size={16} />
              <span>XÁC NHẬN CHUYỂN HOÀN</span>
            </button>
          )}

          {order.supportStatus && (
            <button
              type="button"
              className="btn-toolbar-red-primary"
              onClick={() => navigate(`/requests?orderId=${order.id}`)}
            >
              <CheckCircle2 size={16} />
              <span>XỬ LÝ YÊU CẦU</span>
            </button>
          )}

          {permission('reconcile_carrier').allowed && (
            <button
              type="button"
              className="btn-toolbar-muted"
              onClick={() => navigate(`/carrier-operations?orderId=${order.id}`)}
            >
              <Compass size={16} />
              <span>{order.syncStatus === 'FAILED' ? 'TRA SOÁT ĐỒNG BỘ' : 'VẬN HÀNH NVC'}</span>
            </button>
          )}

          {permission('change_carrier').allowed && (
            <button
              type="button"
              className="btn-toolbar-muted"
              onClick={() => openOperation('change-carrier')}
            >
              <Truck size={16} />
              <span>ĐỔI NHÀ VẬN CHUYỂN</span>
            </button>
          )}

          {permission('print_label').allowed && (
            <button
              type="button"
              className="btn-toolbar-blue-primary"
              onClick={() => navigate(`/orders/${order.id}/print`)}
            >
              <Printer size={16} />
              <span>IN NHÃN</span>
            </button>
          )}
        </div>
      ) : (
        <div className="detail-bottom-toolbar">
          <button
            type="button"
            className="btn-toolbar-red-primary"
            onClick={() => navigate(`/create?copy=${order.id}`)}
          >
            <RotateCcw size={16} />
            <span>TẠO LẠI ĐƠN</span>
          </button>

          {permission('request_support').allowed && (
            <button
              type="button"
              className="btn-toolbar-red-outline"
              onClick={() => openSupportRequest()}
            >
              <Send size={15} />
              <span>GỬI YÊU CẦU</span>
            </button>
          )}

          {permission('retry_create_waybill').allowed && (
            <button
              type="button"
              className="btn-toolbar-red-primary"
              onClick={() => openOperation('retry-create')}
            >
              <RotateCcw size={16} />
              <span>THỬ TẠO LẠI VẬN ĐƠN</span>
            </button>
          )}

          {permission('request_pickup_retry').allowed && (
            <button
              type="button"
              className="btn-toolbar-red-primary"
              onClick={() =>
                permission('request_pickup_retry').mode === 'direct'
                  ? openOperation('pickup-retry')
                  : openSupportRequest('Lấy Hàng', `Yêu cầu lấy lại hàng cho đơn ${order.id}.`)
              }
            >
              <RotateCcw size={16} />
              <span>YÊU CẦU LẤY LẠI</span>
            </button>
          )}

          {permission('request_handover_retry').allowed && (
            <button
              type="button"
              className="btn-toolbar-red-outline"
              onClick={() =>
                openSupportRequest(
                  'Giao Hàng',
                  `Yêu cầu bàn giao lại đơn ${order.id} cho NVC giao.`,
                )
              }
            >
              <RotateCcw size={16} />
              <span>YÊU CẦU BÀN GIAO LẠI</span>
            </button>
          )}

          {permission('request_redelivery').allowed && (
            <button
              type="button"
              className="btn-toolbar-red-primary"
              onClick={() =>
                permission('request_redelivery').mode === 'direct'
                  ? openOperation('redelivery')
                  : openSupportRequest('Giao Hàng', `Yêu cầu giao lại đơn ${order.id}.`)
              }
            >
              <RotateCcw size={16} />
              <span>YÊU CẦU GIAO LẠI</span>
            </button>
          )}

          {permission('request_return_pickup_retry').allowed && (
            <button
              type="button"
              className="btn-toolbar-red-outline"
              onClick={() =>
                openSupportRequest(
                  'Lấy Hàng Hoàn',
                  `Yêu cầu lấy lại hàng hoàn cho đơn ${order.id}.`,
                )
              }
            >
              <RotateCcw size={15} />
              <span>YÊU CẦU LẤY LẠI HÀNG HOÀN</span>
            </button>
          )}

          {permission('request_return_handover_retry').allowed && (
            <button
              type="button"
              className="btn-toolbar-red-outline"
              onClick={() =>
                openSupportRequest(
                  'Bàn Giao Hàng Hoàn',
                  `Yêu cầu bàn giao lại hàng hoàn cuối cho đơn ${order.id}.`,
                )
              }
            >
              <RotateCcw size={15} />
              <span>BÀN GIAO LẠI HÀNG HOÀN</span>
            </button>
          )}

          {permission('request_final_return_retry').allowed && (
            <button
              type="button"
              className="btn-toolbar-red-outline"
              onClick={() =>
                openSupportRequest('Trả Hàng Cuối', `Yêu cầu trả lại hàng cho đơn ${order.id}.`)
              }
            >
              <RotateCcw size={15} />
              <span>YÊU CẦU TRẢ LẠI</span>
            </button>
          )}

          {permission('edit_cod').allowed && (
            <button
              type="button"
              className="btn-toolbar-muted"
              onClick={() => {
                const decision = permission('edit_cod');
                if (decision.mode === 'request_support') {
                  openSupportRequest(
                    'Đơn Hàng',
                    `Yêu cầu sửa COD cho đơn ${order.id}. ${decision.reason || ''}`.trim(),
                  );
                  return;
                }
                setEditCodValue(String(order.cod));
                setIsPartialReturn(false);
                setEditCodNote('');
                setShowEditCodModal(true);
              }}
            >
              <DollarSign size={15} />
              <span>
                {permission('edit_cod').mode === 'request_support' ? 'YÊU CẦU SỬA COD' : 'SỬA COD'}
              </span>
            </button>
          )}

          {permission('cancel_order').allowed && (
            <button
              type="button"
              className="btn-toolbar-muted"
              onClick={() => {
                if (permission('cancel_order').mode === 'request_support') {
                  openSupportRequest('Đơn Hàng', `Yêu cầu hủy đơn ${order.id}.`);
                } else {
                  setOperationError('');
                  setShowCancelModal(true);
                }
              }}
            >
              <X size={15} />
              <span>
                {permission('cancel_order').mode === 'request_support'
                  ? 'YÊU CẦU HỦY ĐƠN'
                  : 'HỦY ĐƠN'}
              </span>
            </button>
          )}

          {permission('edit_order').allowed && (
            <button
              type="button"
              className="btn-toolbar-muted"
              onClick={() =>
                permission('edit_order').mode === 'request_support'
                  ? openSupportRequest('Đơn Hàng', `Yêu cầu sửa thông tin đơn ${order.id}.`)
                  : setShowEditInfoModal(true)
              }
            >
              <Pencil size={15} />
              <span>
                {permission('edit_order').mode === 'request_support'
                  ? 'YÊU CẦU SỬA THÔNG TIN'
                  : 'THAY ĐỔI THÔNG TIN'}
              </span>
            </button>
          )}

          {permission('edit_return_address').allowed &&
            permission('edit_return_address').mode !== 'new_waybill' && (
              <button
                type="button"
                className="btn-toolbar-muted"
                onClick={() =>
                  openSupportRequest(
                    'Chuyển Hoàn',
                    `Yêu cầu đổi địa chỉ trả hàng cho đơn ${order.id}. ${permission('edit_return_address').reason || ''}`.trim(),
                  )
                }
              >
                <MapPin size={15} />
                <span>ĐỔI ĐỊA CHỈ TRẢ</span>
              </button>
            )}

          {permission('add_goods_images').allowed && (
            <button
              type="button"
              className="btn-toolbar-muted"
              onClick={() => openOperation('images')}
            >
              <ImagePlus size={15} />
              <span>THÊM ẢNH HÀNG</span>
            </button>
          )}

          {permission('print_label').allowed && (
            <button
              type="button"
              className="btn-toolbar-blue-primary"
              onClick={() => navigate(`/orders/${order.id}/print`)}
            >
              <Printer size={16} />
              <span>IN NHÃN</span>
            </button>
          )}
        </div>
      )}
      {/* Support Dialog */}
      {showPrintHistory && (
        <PrintHistoryDrawer order={order} onClose={() => setShowPrintHistory(false)} />
      )}

      {showSupportModal && (
        <SupportDialog
          order={order}
          initialCategory={supportPreset.category}
          initialContent={supportPreset.content}
          onClose={() => setShowSupportModal(false)}
        />
      )}

      {/* Cancel Order Dialog */}
      {showCancelModal && (
        <Modal
          title="Hủy đơn hàng"
          onClose={() => setShowCancelModal(false)}
          footer={
            <>
              <Button onClick={() => setShowCancelModal(false)}>Quay lại</Button>
              <Button
                variant="primary"
                onClick={() => {
                  setOperationError('');
                  try {
                    cancelOrder(order.id);
                    setShowCancelModal(false);
                    notify(`Đã hủy đơn hàng ${order.id}.`);
                  } catch (cancelError) {
                    setOperationError(
                      cancelError instanceof Error
                        ? cancelError.message
                        : 'Không thể hủy đơn hàng. Vui lòng tải lại dữ liệu và thử lại.',
                    );
                  }
                }}
              >
                Xác nhận hủy đơn
              </Button>
            </>
          }
        >
          <div className="order-operation-content">
            <p>
              Bạn có chắc chắn muốn hủy đơn hàng <b>{order.id}</b>?
            </p>
            {operationError && <div className="operation-inline-error">{operationError}</div>}
          </div>
        </Modal>
      )}

      {/* Print Template Modal */}
      {showPrintModal && (
        <Modal
          title={`In tem dán đơn hàng: ${order.id}`}
          onClose={() => setShowPrintModal(false)}
          footer={
            <>
              <Button onClick={() => setShowPrintModal(false)}>Đóng</Button>
              <Button
                variant="primary"
                onClick={() => {
                  window.print();
                  markPrinted([order.id]);
                  setShowPrintModal(false);
                }}
              >
                In tem ngay
              </Button>
            </>
          }
        >
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <p>
              Chuẩn bị in tem khổ <b>K46 (4 in x 6 in)</b> cho đơn hàng {order.id}
            </p>
          </div>
        </Modal>
      )}

      {/* Edit COD Modal */}
      {showEditCodModal && (
        <Modal
          title="Sửa COD"
          onClose={() => setShowEditCodModal(false)}
          footer={
            <>
              <Button type="button" onClick={() => setShowEditCodModal(false)}>
                Đóng
              </Button>
              <Button
                type="submit"
                form="edit-order-cod-form"
                variant="primary"
                disabled={
                  editCodValue === '' ||
                  Number(editCodValue) > 100_000_000 ||
                  Number(editCodValue) === order.cod ||
                  (isPartialReturn && !editCodNote.trim())
                }
              >
                Cập nhật
              </Button>
            </>
          }
        >
          <form
            id="edit-order-cod-form"
            className="edit-cod-form"
            onSubmit={(e) => {
              e.preventDefault();
              const nextCod = Number(editCodValue);
              if (!Number.isFinite(nextCod) || nextCod < 0 || nextCod > 100_000_000) {
                notify('Tiền COD mới không hợp lệ.');
                return;
              }
              updateOrder(order.id, {
                ...order,
                cod: nextCod,
                businessType: isPartialReturn ? 'PARTIAL' : order.businessType,
                note: isPartialReturn
                  ? `${order.note ? `${order.note}\n` : ''}Thu hồi: ${editCodNote.trim()}`
                  : order.note,
              });
              setShowEditCodModal(false);
              notify('Đã cập nhật tiền COD thành công!');
            }}
          >
            <div className="edit-cod-order-summary">
              <span className="edit-cod-order-icon">
                <QrCode size={20} />
              </span>
              <div>
                <small>Mã Order</small>
                <strong>{order.id}</strong>
              </div>
              <button type="button" onClick={handleCopyId} aria-label="Sao chép mã Order">
                <Copy size={16} />
              </button>
            </div>

            <label className="edit-cod-field">
              <span>
                Tiền thu hộ mới <b>*</b>
              </span>
              <div className="edit-cod-input-wrap">
                <input
                  name="cod"
                  inputMode="numeric"
                  autoFocus
                  value={editCodValue ? Number(editCodValue).toLocaleString('vi-VN') : ''}
                  onChange={(event) =>
                    setEditCodValue(event.target.value.replace(/\D/g, '').replace(/^0+(?=\d)/, ''))
                  }
                  placeholder="Nhập số tiền COD mới"
                  aria-describedby="edit-cod-hint"
                />
                {editCodValue && (
                  <button
                    type="button"
                    className="edit-cod-clear"
                    onClick={() => setEditCodValue('')}
                    aria-label="Xóa số tiền"
                  >
                    <X size={17} />
                  </button>
                )}
                <span className="edit-cod-currency">₫</span>
              </div>
              <small id="edit-cod-hint">Số tiền từ 0 ₫ đến 100.000.000 ₫</small>
            </label>

            <label className="edit-cod-partial-option">
              <input
                type="checkbox"
                checked={isPartialReturn}
                onChange={(event) => setIsPartialReturn(event.target.checked)}
              />
              <span>
                <b>Giao một phần / Thu hồi</b>
                <small>Tạo yêu cầu thu hồi một phần hàng hóa sau khi giao.</small>
              </span>
            </label>

            {isPartialReturn && (
              <div className="edit-cod-partial-panel">
                <div className="edit-cod-notice">
                  <Info size={18} />
                  <p>
                    Khi yêu cầu tạo mã thu hồi, vui lòng điền đầy đủ{' '}
                    <b>tên sản phẩm thu hồi, trị giá, số lượng và khối lượng</b> tại phần ghi chú.
                  </p>
                </div>
                <label className="edit-cod-note">
                  <span>
                    Ghi chú <b>*</b>
                  </span>
                  <textarea
                    maxLength={120}
                    value={editCodNote}
                    onChange={(event) => setEditCodNote(event.target.value)}
                    placeholder="Nhập thông tin sản phẩm cần thu hồi..."
                  />
                  <small>{editCodNote.length}/120 ký tự</small>
                </label>
              </div>
            )}

            <div className="edit-cod-money-summary">
              <div className="edit-cod-summary-title">
                <DollarSign size={17} />
                <strong>Thông tin tiền hàng</strong>
              </div>
              <div>
                <span>COD hiện tại</span>
                <b>{money(order.cod)}</b>
              </div>
              <div className="is-total">
                <span>COD sau cập nhật</span>
                <b>{editCodValue === '' ? '—' : money(Number(editCodValue))}</b>
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Edit Info Modal */}
      {showEditInfoModal && (
        <EditOrderDialog order={order} onClose={() => setShowEditInfoModal(false)} />
      )}

      {operationModal === 'retry-create' && (
        <Modal
          title="Thử tạo lại vận đơn"
          onClose={() => !isSubmitting && setOperationModal(null)}
          footer={
            <>
              <Button disabled={isSubmitting} onClick={() => setOperationModal(null)}>
                Quay lại
              </Button>
              <Button
                variant="primary"
                disabled={isSubmitting}
                onClick={() =>
                  submitOperation(
                    () => applyOperation(order.id, { type: 'retry-create-waybill' }),
                    'Đã tạo lại vận đơn thành công. Order chuyển sang Chờ lấy hàng.',
                  )
                }
              >
                {isSubmitting ? 'Đang tạo…' : 'Tạo lại vận đơn'}
              </Button>
            </>
          }
        >
          <div className="operation-callout warning">
            <AlertTriangle size={18} />
            <div>
              <strong>Hệ thống sẽ gửi lại dữ liệu sang NVC</strong>
              <span>
                Chỉ thực hiện khi thông tin đơn đã được kiểm tra và lỗi trước đó có thể thử lại.
              </span>
            </div>
          </div>
          {operationError && <div className="operation-inline-error">{operationError}</div>}
        </Modal>
      )}

      {operationModal === 'pickup-retry' && (
        <Modal
          title="Yêu cầu lấy lại hàng"
          onClose={() => !isSubmitting && setOperationModal(null)}
          footer={
            <>
              <Button disabled={isSubmitting} onClick={() => setOperationModal(null)}>
                Quay lại
              </Button>
              <Button
                variant="primary"
                disabled={isSubmitting}
                onClick={() =>
                  submitOperation(
                    () => applyOperation(order.id, { type: 'request-pickup-retry' }),
                    'Đã gửi yêu cầu lấy lại hàng tới NVC.',
                  )
                }
              >
                {isSubmitting ? 'Đang gửi…' : 'Xác nhận lấy lại'}
              </Button>
            </>
          }
        >
          <div className="operation-callout warning">
            <AlertTriangle size={18} />
            <div>
              <strong>NVC sẽ thực hiện thêm một lượt lấy hàng</strong>
              <span>Shop cần bảo đảm kiện hàng đã sẵn sàng tại địa chỉ lấy.</span>
            </div>
          </div>
          {operationError && <div className="operation-inline-error">{operationError}</div>}
        </Modal>
      )}

      {operationModal === 'redelivery' && (
        <Modal
          title="Yêu cầu giao lại"
          onClose={() => !isSubmitting && setOperationModal(null)}
          footer={
            <>
              <Button disabled={isSubmitting} onClick={() => setOperationModal(null)}>
                Quay lại
              </Button>
              <Button
                variant="primary"
                disabled={isSubmitting}
                onClick={() =>
                  submitOperation(
                    () => applyOperation(order.id, { type: 'request-redelivery' }),
                    'Đã gửi yêu cầu giao lại. Trạng thái Order đã được cập nhật.',
                  )
                }
              >
                {isSubmitting ? 'Đang gửi…' : 'Xác nhận giao lại'}
              </Button>
            </>
          }
        >
          <div className="order-operation-content">
            <div className="operation-callout warning">
              <AlertTriangle size={18} />
              <div>
                <strong>NVC sẽ thực hiện thêm một lượt giao</strong>
                <span>
                  Hãy chắc chắn người nhận có thể nhận hàng và số điện thoại còn liên lạc được.
                </span>
              </div>
            </div>
            {isSubmitting && <AsyncStatePanel state="processing" compact />}
            {operationError && <div className="operation-inline-error">{operationError}</div>}
          </div>
        </Modal>
      )}

      {operationModal === 'confirm-return' && (
        <Modal
          title="Xác nhận chuyển hoàn"
          onClose={() => !isSubmitting && setOperationModal(null)}
          footer={
            <>
              <Button disabled={isSubmitting} onClick={() => setOperationModal(null)}>
                Quay lại
              </Button>
              <Button
                variant="primary"
                disabled={isSubmitting}
                onClick={() =>
                  submitOperation(
                    () => applyOperation(order.id, { type: 'confirm-return' }),
                    'Đã xác nhận chuyển hoàn cho Order.',
                  )
                }
              >
                {isSubmitting ? 'Đang xác nhận…' : 'Xác nhận chuyển hoàn'}
              </Button>
            </>
          }
        >
          <div className="operation-callout warning">
            <AlertTriangle size={18} />
            <div>
              <strong>Đây là thao tác nghiệp vụ nội bộ</strong>
              <span>Order sẽ đi vào luồng hoàn và Shop chỉ có thể theo dõi tiến trình.</span>
            </div>
          </div>
          {isSubmitting && <AsyncStatePanel state="processing" compact />}
          {operationError && <div className="operation-inline-error">{operationError}</div>}
        </Modal>
      )}

      {operationModal === 'change-carrier' && (
        <Modal
          title="Đổi nhà vận chuyển"
          onClose={() => !isSubmitting && setOperationModal(null)}
          footer={
            <>
              <Button disabled={isSubmitting} onClick={() => setOperationModal(null)}>
                Hủy
              </Button>
              <Button
                variant="primary"
                disabled={isSubmitting || !operationReason.trim()}
                onClick={() =>
                  submitOperation(
                    () =>
                      applyOperation(order.id, {
                        type: 'change-carrier',
                        carrier: selectedCarrier,
                        reason: operationReason.trim(),
                        changedBy: 'Nội bộ SuperPlatform',
                      }),
                    `Đã chuyển Order sang ${selectedCarrier}. Đang chờ NVC tiếp nhận.`,
                  )
                }
              >
                {isSubmitting ? 'Đang đổi NVC…' : 'Xác nhận đổi NVC'}
              </Button>
            </>
          }
        >
          <div className="order-operation-content">
            <div className="carrier-change-summary">
              <span>NVC hiện tại</span>
              <strong>{currentDeliveryCarrier}</strong>
              <ArrowRight size={18} />
              <span>NVC mới</span>
              <strong>{selectedCarrier}</strong>
            </div>
            <CustomSelect
              label={
                <span>
                  Chọn NVC mới <b className="red">*</b>
                </span>
              }
              value={selectedCarrier}
              onChange={setSelectedCarrier}
              options={availableCarrierOptions}
              icon={Truck}
            />
            <label className="field">
              <span>Lý do đổi NVC *</span>
              <textarea
                rows={3}
                value={operationReason}
                onChange={(event) => setOperationReason(event.target.value)}
                placeholder="Nhập lý do để lưu vào lịch sử kiểm soát"
              />
            </label>
            <div className="operation-callout warning">
              <AlertTriangle size={18} />
              <div>
                <strong>Mã vận đơn cũ có thể không còn hiệu lực</strong>
                <span>
                  Phí và thời gian giao dự kiến sẽ được tính lại sau khi NVC mới tiếp nhận.
                </span>
              </div>
            </div>
            {isSubmitting && <AsyncStatePanel state="processing" compact />}
            {operationError && <div className="operation-inline-error">{operationError}</div>}
          </div>
        </Modal>
      )}

      {operationModal === 'images' && (
        <Modal
          title="Thêm ảnh hàng hóa"
          onClose={() => !isSubmitting && setOperationModal(null)}
          footer={
            <>
              <Button disabled={isSubmitting} onClick={() => setOperationModal(null)}>
                Hủy
              </Button>
              <Button
                variant="primary"
                disabled={isSubmitting || pendingImages.length === 0}
                onClick={() =>
                  submitOperation(
                    () =>
                      applyOperation(order.id, { type: 'add-goods-images', images: pendingImages }),
                    `Đã thêm ${pendingImages.length} ảnh hàng hóa.`,
                  )
                }
              >
                {isSubmitting ? 'Đang tải lên…' : `Lưu ${pendingImages.length || ''} ảnh`}
              </Button>
            </>
          }
        >
          <div className="order-operation-content">
            <label className="goods-image-dropzone">
              <ImagePlus size={24} />
              <strong>Chọn ảnh hàng hóa</strong>
              <span>PNG, JPG hoặc WEBP · tối đa 5 ảnh · 5 MB/ảnh</span>
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                onChange={(event) => handleImageFiles(event.target.files)}
              />
            </label>
            {pendingImages.length > 0 && (
              <div className="goods-image-preview-grid">
                {pendingImages.map((image) => (
                  <div key={image.id} className="goods-image-preview">
                    <img src={image.imageUrl} alt={image.fileName} />
                    <span>{image.fileName}</span>
                    <button
                      type="button"
                      aria-label={`Xóa ${image.fileName}`}
                      onClick={() =>
                        setPendingImages((current) =>
                          current.filter((item) => item.id !== image.id),
                        )
                      }
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {isSubmitting && <AsyncStatePanel state="processing" compact />}
            {operationError && <div className="operation-inline-error">{operationError}</div>}
          </div>
        </Modal>
      )}
    </div>
  );
}

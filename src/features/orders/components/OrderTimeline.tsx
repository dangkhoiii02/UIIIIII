import { CheckCircle2, Clock, AlertTriangle, Truck, Package, MapPin } from 'lucide-react';
import type { Order } from '../model/types';

interface TimelineEvent {
  id: string;
  stage: 'created' | 'pickup' | 'transit' | 'delivery' | 'return';
  title: string;
  subtitle: string;
  time: string;
  status: 'done' | 'current' | 'pending' | 'failed';
  location?: string;
  carrier?: string;
}

export function OrderTimeline({ order }: { order: Order }) {
  const getTimelineEvents = (ord: Order): TimelineEvent[] => {
    const events: TimelineEvent[] = [
      {
        id: '1',
        stage: 'created',
        title: 'Khởi tạo đơn hàng',
        subtitle: 'Đơn hàng đã được tạo thành công trên hệ thống',
        time: ord.createdAt || '12/09/2026 11:26',
        status: 'done',
        carrier: 'SuperPlatform',
      },
    ];

    if (ord.status === 'Đã hủy') {
      events.push({
        id: '2',
        stage: 'pickup',
        title: 'Đơn hàng đã bị hủy',
        subtitle: 'Yêu cầu vận chuyển đã ngừng',
        time: '12/09/2026 11:45',
        status: 'failed',
      });
      return events;
    }

    // Pickup stage
    const isPicked = ord.status !== 'Chờ Lấy Hàng';
    events.push({
      id: '2',
      stage: 'pickup',
      title: isPicked ? 'Đã lấy hàng thành công' : 'Chờ lấy hàng',
      subtitle: isPicked
        ? 'Shipper SuperShip đã nhận kiện tại kho gửi'
        : 'Đã phân công Shipper lấy hàng tại kho gửi',
      time: isPicked ? '12/09/2026 14:10' : 'Dự kiến: 12/09/2026 15:00',
      status: isPicked ? 'done' : 'current',
      location: 'Kho Hồ Mễ Trì, Nam Từ Liêm, Hà Nội',
      carrier: 'SuperShip Express',
    });

    // Transit stage
    if (isPicked) {
      const inTransit = ord.status === 'Đang giao hàng' || ord.status === 'Đã giao hàng';
      events.push({
        id: '3',
        stage: 'transit',
        title: inTransit ? 'Đã nhập kho trung chuyển' : 'Đang luân chuyển kho',
        subtitle: 'Kiện hàng đang được phân loại tại Trung tâm khai thác',
        time: '12/09/2026 18:30',
        status: inTransit ? 'done' : 'current',
        location: 'Trung tâm Khai thác Hà Nội',
        carrier: 'SuperShip Logistics',
      });
    }

    // Delivery stage
    if (ord.status === 'Đang giao hàng' || ord.status === 'Hoãn giao hàng') {
      events.push({
        id: '4',
        stage: 'delivery',
        title: ord.status === 'Hoãn giao hàng' ? 'Hoãn giao hàng' : 'Đang giao hàng',
        subtitle:
          ord.status === 'Hoãn giao hàng'
            ? 'Người nhận hẹn lại thời gian giao'
            : 'Shipper đang trên đường giao kiện cho Người nhận',
        time: '13/09/2026 09:15',
        status: ord.status === 'Hoãn giao hàng' ? 'failed' : 'current',
        location: ord.address,
        carrier: 'SuperShip Express',
      });
    } else if (ord.status === 'Đã giao hàng') {
      events.push({
        id: '4',
        stage: 'delivery',
        title: 'Giao hàng thành công',
        subtitle: `Người nhận: ${ord.name} đã ký nhận kiện hàng`,
        time: '13/09/2026 10:45',
        status: 'done',
        location: ord.address,
        carrier: 'SuperShip Express',
      });
    } else if (ord.status === 'Đang chuyển hoàn' || ord.status === 'Đã trả hàng') {
      events.push({
        id: '4',
        stage: 'return',
        title: ord.status === 'Đã trả hàng' ? 'Đã trả hàng hoàn về Shop' : 'Đang chuyển hoàn',
        subtitle: 'Hàng được quay đầu trả lại điểm gửi ban đầu',
        time: '13/09/2026 11:00',
        status: ord.status === 'Đã trả hàng' ? 'done' : 'current',
        location: 'Kho Hồ Mễ Trì',
        carrier: 'SuperShip Express',
      });
    }

    return events;
  };

  const timelineEvents = getTimelineEvents(order);

  return (
    <div className="order-timeline-container">
      <h3 className="timeline-heading">Hành trình vận chuyển</h3>
      <div className="timeline-list">
        {timelineEvents.map((evt, idx) => {
          const isLast = idx === timelineEvents.length - 1;
          return (
            <div key={evt.id} className={`timeline-item ${evt.status}`}>
              <div className="timeline-left">
                <div className={`timeline-icon-circle ${evt.status}`}>
                  {evt.status === 'done' && <CheckCircle2 size={16} />}
                  {evt.status === 'current' && <Truck size={16} />}
                  {evt.status === 'pending' && <Clock size={16} />}
                  {evt.status === 'failed' && <AlertTriangle size={16} />}
                </div>
                {!isLast && <div className="timeline-line" />}
              </div>

              <div className="timeline-content">
                <div className="timeline-header-row">
                  <span className="timeline-title">{evt.title}</span>
                  <span className="timeline-time">{evt.time}</span>
                </div>
                <p className="timeline-subtitle">{evt.subtitle}</p>
                {evt.location && (
                  <div className="timeline-meta-item">
                    <MapPin size={12} /> {evt.location}
                  </div>
                )}
                {evt.carrier && (
                  <div className="timeline-meta-item carrier">
                    <Package size={12} /> NVC: {evt.carrier}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

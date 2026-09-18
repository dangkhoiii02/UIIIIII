import {
  Home,
  PackagePlus,
  Table2,
  Layers3,
  Package,
  Receipt,
  BarChart3,
  MessageSquare,
  Star,
  FolderTree,
  LayoutGrid,
  Settings,
  Users,
  Route,
  PrinterCheck,
} from 'lucide-react';

export const navigation = [
  { path: '/home', label: 'Trang chủ', icon: Home },
  { path: '/create', label: 'Tạo đơn', icon: PackagePlus },
  { path: '/sheet3', label: 'Bảng tính 3 cấp', icon: Table2 },
  { path: '/sheet2', label: 'Bảng tính 2 cấp', icon: Table2 },
  { path: '/order-batches', label: 'Đơn hàng loạt', icon: Layers3 },
  { path: '/orders', label: 'Đơn hàng', icon: Package },
  { path: '/reconciliation', label: 'Đối soát', icon: Receipt },
  { path: '/statistics', label: 'Thống kê', icon: BarChart3 },
  { path: '/requests', label: 'Yêu cầu', icon: MessageSquare },
  { path: '/reviews', label: 'Đánh giá', icon: Star },
  { path: '/management', label: 'Quản lý', icon: FolderTree },
  { path: '/utilities', label: 'Tiện ích', icon: LayoutGrid },
  { path: '/settings', label: 'Cài đặt', icon: Settings },
  { path: '/referrals', label: 'Giới thiệu khách', icon: Users },
];

export const internalNavigation = [
  { path: '/carrier-operations', label: 'Vận hành vận chuyển', icon: Route },
  { path: '/internal-print', label: 'Lịch sử in nhãn', icon: PrinterCheck },
];

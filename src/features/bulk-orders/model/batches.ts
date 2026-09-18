export type BatchStatus = 'COMPLETED' | 'PARTIAL' | 'PROCESSING' | 'FAILED';
export type BatchItemStatus = 'SUCCESS' | 'FAILED' | 'PROCESSING';

export interface OrderBatchItem {
  line: number;
  clientOrderCode: string;
  orderId?: string;
  receiverName: string;
  receiverPhone: string;
  status: BatchItemStatus;
  errorCode?: string;
  errorMessage?: string;
  sourceData?: Record<string, string>;
}

export interface OrderBatch {
  id: string;
  sourceFile: string;
  addressLevel: 2 | 3;
  createdAt: string;
  createdBy: string;
  status: BatchStatus;
  total: number;
  success: number;
  failed: number;
  processing: number;
  items: OrderBatchItem[];
}

export interface RetryBatchPayload {
  batchId: string;
  sourceFile: string;
  addressLevel: 2 | 3;
  items: OrderBatchItem[];
}

function sourceData(
  clientOrderCode: string,
  receiverName: string,
  receiverPhone: string,
  number: number,
): Record<string, string> {
  return {
    privateId: clientOrderCode,
    name: receiverName,
    phone: receiverPhone,
    address: `${number} Nguyễn Văn Linh`,
    province: 'Thành phố Hồ Chí Minh',
    district: 'Quận Tân Bình',
    ward: 'Phường 13',
    product: `Sản phẩm dòng ${number}`,
    weight: String(450 + number * 10),
    cod: String(180000 + number * 10000),
    value: String(220000 + number * 10000),
    note: 'Cho khách kiểm tra hàng khi nhận.',
  };
}

function generatedItems(
  prefix: string,
  firstLine: number,
  count: number,
  status: BatchItemStatus,
  errorCode?: string,
): OrderBatchItem[] {
  return Array.from({ length: count }, (_, index) => {
    const number = firstLine + index;
    const clientOrderCode = `${prefix}-${String(number - 1).padStart(3, '0')}`;
    const receiverName = `Người nhận dòng ${number}`;
    const receiverPhone = `09${String(10000000 + number).slice(-8)}`;
    return {
      line: number,
      clientOrderCode,
      ...(status === 'SUCCESS' ? { orderId: `90${prefix.replace(/\D/g, '')}${number}001` } : {}),
      receiverName,
      receiverPhone,
      status,
      ...(errorCode
        ? {
            errorCode,
            errorMessage: 'Dữ liệu dòng chưa đáp ứng điều kiện tạo đơn hàng.',
            sourceData: sourceData(clientOrderCode, receiverName, receiverPhone, number),
          }
        : {}),
    };
  });
}

export const ORDER_BATCH_SEED: OrderBatch[] = [
  {
    id: 'BAT-20260915-0004',
    sourceFile: 'don_hang_thang_09_dot_4.xlsx',
    addressLevel: 3,
    createdAt: '2026-09-15T09:42:18+07:00',
    createdBy: 'S275518 - AB',
    status: 'PROCESSING',
    total: 18,
    success: 12,
    failed: 1,
    processing: 5,
    items: [
      {
        line: 2,
        clientOrderCode: 'SHOP-0915-001',
        orderId: '826883962104',
        receiverName: 'Lê Phước Thắng',
        receiverPhone: '0333126429',
        status: 'SUCCESS',
      },
      {
        line: 3,
        clientOrderCode: 'SHOP-0915-002',
        receiverName: 'Nguyễn Minh Anh',
        receiverPhone: '0905123001',
        status: 'PROCESSING',
      },
      ...generatedItems('SHOP-0915', 6, 11, 'SUCCESS'),
      ...generatedItems('SHOP-0915', 17, 3, 'PROCESSING'),
      {
        line: 4,
        clientOrderCode: 'SHOP-0915-003',
        receiverName: 'Trần Quốc Bảo',
        receiverPhone: '0912456002',
        status: 'FAILED',
        errorCode: 'INVALID_COMMUNE_CODE',
        errorMessage: 'Mã Phường/Xã không thuộc Tỉnh/Thành phố đã chọn.',
        sourceData: {
          ...sourceData('SHOP-0915-003', 'Trần Quốc Bảo', '0912456002', 4),
          ward: 'Phường không thuộc khu vực',
        },
      },
      {
        line: 5,
        clientOrderCode: 'SHOP-0915-004',
        receiverName: 'Phạm Thu Hương',
        receiverPhone: '0987333004',
        status: 'PROCESSING',
      },
    ],
  },
  {
    id: 'BAT-20260914-0003',
    sourceFile: 'import_don_hang_3_cap.xlsx',
    addressLevel: 3,
    createdAt: '2026-09-14T14:25:06+07:00',
    createdBy: 'S275518 - AB',
    status: 'PARTIAL',
    total: 12,
    success: 9,
    failed: 3,
    processing: 0,
    items: [
      {
        line: 2,
        clientOrderCode: 'SHOP-0914-011',
        orderId: '551029381205',
        receiverName: 'Nguyễn Văn An',
        receiverPhone: '0987654321',
        status: 'SUCCESS',
      },
      ...generatedItems('SHOP-0914', 6, 7, 'SUCCESS'),
      ...generatedItems('SHOP-0914', 13, 1, 'FAILED', 'INVALID_ORDER_ROW'),
      {
        line: 3,
        clientOrderCode: 'SHOP-0914-012',
        receiverName: 'Hoàng Lan Chi',
        receiverPhone: '0908111222',
        status: 'FAILED',
        errorCode: 'INVALID_RECEIVER_PHONE',
        errorMessage: 'Số điện thoại người nhận không đúng định dạng.',
        sourceData: {
          ...sourceData('SHOP-0914-012', 'Hoàng Lan Chi', '0908ABC222', 3),
          phone: '0908ABC222',
        },
      },
      {
        line: 4,
        clientOrderCode: 'SHOP-0914-013',
        receiverName: 'Lưu Đức Minh',
        receiverPhone: '0935222444',
        status: 'FAILED',
        errorCode: 'SHIPPING_OPTION_UNAVAILABLE',
        errorMessage: 'Không có phương án vận chuyển phù hợp với kiện hàng.',
        sourceData: sourceData('SHOP-0914-013', 'Lưu Đức Minh', '0935222444', 4),
      },
      {
        line: 5,
        clientOrderCode: 'SHOP-0914-014',
        orderId: '992831024316',
        receiverName: 'Trần Thị Mai',
        receiverPhone: '0912345678',
        status: 'SUCCESS',
      },
    ],
  },
  {
    id: 'BAT-20260913-0002',
    sourceFile: 'bang_tinh_2_cap_1309.xlsx',
    addressLevel: 2,
    createdAt: '2026-09-13T10:08:44+07:00',
    createdBy: 'S275518 - AB',
    status: 'COMPLETED',
    total: 25,
    success: 25,
    failed: 0,
    processing: 0,
    items: [
      {
        line: 2,
        clientOrderCode: 'SHOP-0913-021',
        orderId: '102948123427',
        receiverName: 'Phạm Quốc Huy',
        receiverPhone: '0977889900',
        status: 'SUCCESS',
      },
      {
        line: 3,
        clientOrderCode: 'SHOP-0913-022',
        orderId: '684210973512',
        receiverName: 'Võ Ngọc Hà',
        receiverPhone: '0938456127',
        status: 'SUCCESS',
      },
      ...generatedItems('SHOP-0913', 4, 23, 'SUCCESS'),
    ],
  },
  {
    id: 'BAT-20260912-0001',
    sourceFile: 'don_hang_doi_tac_1209.xlsx',
    addressLevel: 3,
    createdAt: '2026-09-12T08:15:30+07:00',
    createdBy: 'S275518 - AB',
    status: 'FAILED',
    total: 8,
    success: 0,
    failed: 8,
    processing: 0,
    items: [
      {
        line: 2,
        clientOrderCode: 'PARTNER-1209-001',
        receiverName: 'Đỗ Hải Nam',
        receiverPhone: '0909000001',
        status: 'FAILED',
        errorCode: 'UNSUPPORTED_TEMPLATE_VERSION',
        errorMessage: 'File sử dụng phiên bản mẫu không còn được hỗ trợ.',
        sourceData: sourceData('PARTNER-1209-001', 'Đỗ Hải Nam', '0909000001', 2),
      },
      ...generatedItems('PARTNER-1209', 4, 6, 'FAILED', 'UNSUPPORTED_TEMPLATE_VERSION'),
      {
        line: 3,
        clientOrderCode: 'PARTNER-1209-002',
        receiverName: 'Mai Thanh Hà',
        receiverPhone: '0909000002',
        status: 'FAILED',
        errorCode: 'UNSUPPORTED_TEMPLATE_VERSION',
        errorMessage: 'File sử dụng phiên bản mẫu không còn được hỗ trợ.',
        sourceData: sourceData('PARTNER-1209-002', 'Mai Thanh Hà', '0909000002', 3),
      },
    ],
  },
];

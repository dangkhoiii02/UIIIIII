import { defaultOrderInput, validateOrder, type OrderInput } from '@/features/orders';
export type AddressLevel = 2 | 3;
export type SheetRow = Record<string, string>;
export interface Column {
  key: string;
  label: string;
  required?: boolean;
}
export function sheetColumns(level: AddressLevel): Column[] {
  return [
    { key: 'privateId', label: 'Mã Đơn Của Shop' },
    { key: 'name', label: 'Tên Người Nhận', required: true },
    { key: 'phone', label: 'SĐT Người Nhận', required: true },
    { key: 'address', label: 'Địa Chỉ Chi Tiết', required: true },
    { key: 'province', label: 'Tỉnh/Thành Phố', required: true },
    ...(level === 3 ? [{ key: 'district', label: 'Quận/Huyện/Thị Xã', required: true }] : []),
    { key: 'ward', label: 'Phường/Xã/Thị Trấn', required: true },
    { key: 'product', label: 'Hàng Hóa Cần Giao', required: true },
    { key: 'weight', label: 'Khối Lượng (gr)', required: true },
    { key: 'cod', label: 'Thu Hộ (đ)', required: true },
    { key: 'value', label: 'Giá Trị (đ)', required: true },
    { key: 'note', label: 'Ghi Chú' },
  ];
}
export const PROVINCES = [
  'Thành phố Hà Nội',
  'Thành phố Hồ Chí Minh',
  'Tỉnh Bình Định',
  'Thành phố Đà Nẵng',
  'Tỉnh Gia Lai',
];
export const DISTRICTS = [
  'Quận Nam Từ Liêm',
  'Quận Tân Bình',
  'Thị xã An Nhơn',
  'Quận Hải Châu',
];
export const WARDS = [
  'Phường Mễ Trì',
  'Phường 13',
  'Phường Bình Định',
  'Phường Hòa Cường Bắc',
];

export const emptySheet = (): SheetRow[] => Array.from({ length: 25 }, () => ({}));
export const appendRows = (current: SheetRow[], count = 5): SheetRow[] => [
  ...current,
  ...Array.from({ length: count }, () => ({})),
];
export function rowToOrder(row: SheetRow, level: AddressLevel): OrderInput {
  return {
    ...defaultOrderInput,
    name: row.name ?? '',
    phone: row.phone ?? '',
    address: row.address ?? '',
    region: [row.province, level === 3 ? row.district : '', row.ward].filter(Boolean).join(' · '),
    product: row.product ?? '',
    weight: Number(row.weight),
    cod: Number(row.cod),
    value: Number(row.value),
    privateId: row.privateId ?? '',
    note: row.note ?? '',
  };
}
export function validateRow(row: SheetRow, level: AddressLevel): 'empty' | 'valid' | 'invalid' {
  if (!Object.values(row).some((value) => value.trim())) return 'empty';
  if (sheetColumns(level).some((column) => column.required && !row[column.key]?.trim()))
    return 'invalid';
  return validateOrder(rowToOrder(row, level)).length ? 'invalid' : 'valid';
}
export function pasteCells(
  rows: SheetRow[],
  level: AddressLevel,
  startRow: number,
  startColumn: number,
  text: string,
): SheetRow[] {
  const next = rows.map((row) => ({ ...row }));
  const columns = sheetColumns(level);
  text
    .replace(/\r\n/g, '\n')
    .replace(/\n$/, '')
    .split('\n')
    .forEach((line, rowIndex) =>
      line.split('\t').forEach((value, columnIndex) => {
        const row = next[startRow + rowIndex];
        const column = columns[startColumn + columnIndex];
        if (row && column) row[column.key] = value;
      }),
    );
  return next;
}
export function decodeDraft(raw: string | null): SheetRow[] | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (
      !Array.isArray(value) ||
      value.length !== 25 ||
      value.some(
        (row) =>
          !row ||
          typeof row !== 'object' ||
          Array.isArray(row) ||
          Object.values(row).some((cell) => typeof cell !== 'string'),
      )
    )
      return null;
    return value as SheetRow[];
  } catch {
    return null;
  }
}

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
      value.length === 0 ||
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
export function generateTemplateCsv(level: AddressLevel): string {
  const cols = sheetColumns(level);
  const headers = cols.map((c) => (c.required ? `${c.label} [*]` : c.label)).join(',');

  const sample1 =
    level === 2
      ? 'SHOP001,Nguyễn Văn An,0901234567,123 Nguyễn Huệ,Thành phố Hồ Chí Minh,Phường Bến Nghé,Áo thun cotton cao cấp,500,250000,250000,Cho xem hàng không cho thử'
      : 'SHOP001,Nguyễn Văn An,0901234567,123 Nguyễn Huệ,Thành phố Hồ Chí Minh,Quận 1,Phường Bến Nghé,Áo thun cotton cao cấp,500,250000,250000,Cho xem hàng không cho thử';

  const sample2 =
    level === 2
      ? 'SHOP002,Trần Thị Bích,0987654321,45 Cầu Giấy,Thành phố Hà Nội,Phường Dịch Vọng,Bộ mỹ phẩm dưỡng da,350,450000,450000,Giao giờ hành chính'
      : 'SHOP002,Trần Thị Bích,0987654321,45 Cầu Giấy,Thành phố Hà Nội,Quận Cầu Giấy,Phường Dịch Vọng,Bộ mỹ phẩm dưỡng da,350,450000,450000,Giao giờ hành chính';

  return `\uFEFF${headers}\n${sample1}\n${sample2}\n`;
}

export function parseImportedSpreadsheet(content: string, level: AddressLevel): SheetRow[] {
  const clean = content.replace(/^\uFEFF/, '').trim();
  if (!clean) return [];

  const lines: string[][] = [];
  const rawLines = clean.split(/\r?\n/);

  for (const rawLine of rawLines) {
    if (!rawLine.trim()) continue;
    const delimiter = rawLine.includes('\t') ? '\t' : rawLine.includes(';') ? ';' : ',';

    const cells: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < rawLine.length; i++) {
      const char = rawLine[i];
      if (char === '"') {
        if (inQuotes && rawLine[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        cells.push(cur.trim());
        cur = '';
      } else {
        cur += char;
      }
    }
    cells.push(cur.trim());
    lines.push(cells);
  }

  if (lines.length === 0) return [];

  const firstLineJoined = (lines[0] ?? []).join(' ').toLowerCase();
  const hasHeader =
    firstLineJoined.includes('người nhận') ||
    firstLineJoined.includes('sđt') ||
    firstLineJoined.includes('mã đơn') ||
    firstLineJoined.includes('địa chỉ') ||
    firstLineJoined.includes('hàng hóa');

  const dataLines = hasHeader ? lines.slice(1) : lines;
  const cols = sheetColumns(level);

  return dataLines.map((cells) => {
    const row: SheetRow = {};
    cols.forEach((col, idx) => {
      row[col.key] = cells[idx] ?? '';
    });
    return row;
  });
}

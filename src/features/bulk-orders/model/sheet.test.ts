import { describe, expect, it } from 'vitest';
import {
  decodeDraft,
  emptySheet,
  generateTemplateCsv,
  parseImportedSpreadsheet,
  pasteCells,
  rowToOrder,
  validateRow,
} from './sheet';
describe('bulk order sheet', () => {
  it('maps pasted 2-level rows into orders', () => {
    const rows = pasteCells(
      emptySheet(),
      2,
      0,
      0,
      'SHOP1\tKhách mẫu\t0901234567\t1 Đường mẫu\tHà Nội\tMễ Trì\tÁo\t750\t0\t100000\tGọi trước',
    );
    expect(validateRow(rows[0]!, 2)).toBe('valid');
    expect(rowToOrder(rows[0]!, 2).region).toBe('Hà Nội · Mễ Trì');
    expect(validateRow(rows[0]!, 3)).toBe('invalid');
  });
  it('rejects blank money fields and malformed drafts', () => {
    expect(validateRow({ name: 'Khách', cod: '' }, 2)).toBe('invalid');
    expect(decodeDraft('{broken')).toBeNull();
    expect(decodeDraft('[1]')).toBeNull();
  });
  it('does not mutate rows and bounds pasted data to the grid', () => {
    const source = emptySheet();
    const next = pasteCells(source, 3, 24, 0, 'A\nB');
    expect(source[24]).toEqual({});
    expect(next).toHaveLength(25);
    expect(next[24]?.privateId).toBe('A');
  });
  it('generates CSV template and parses imported spreadsheets correctly', () => {
    const csv2 = generateTemplateCsv(2);
    expect(csv2).toContain('Mã Đơn Của Shop');
    expect(csv2).toContain('Phường/Xã/Thị Trấn');
    expect(csv2).not.toContain('Quận/Huyện/Thị Xã');

    const csv3 = generateTemplateCsv(3);
    expect(csv3).toContain('Quận/Huyện/Thị Xã');

    const parsed = parseImportedSpreadsheet(csv2, 2);
    expect(parsed.length).toBe(2);
    expect(parsed[0]?.name).toBe('Nguyễn Văn An');
    expect(parsed[0]?.phone).toBe('0901234567');
  });
});

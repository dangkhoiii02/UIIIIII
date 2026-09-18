import type { ClipboardEvent } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  pasteCells,
  sheetColumns,
  validateRow,
  PROVINCES,
  DISTRICTS,
  WARDS,
  type AddressLevel,
  type SheetRow,
} from '../model/sheet';

export function SheetGrid({
  rows,
  level,
  checked,
  onChange,
}: {
  rows: SheetRow[];
  level: AddressLevel;
  checked: boolean;
  onChange: (rows: SheetRow[]) => void;
}) {
  const columns = sheetColumns(level);
  const hasRetryErrors = rows.some((row) => row._errorMessage);

  function paste(event: ClipboardEvent<HTMLInputElement | HTMLSelectElement>, row: number, col: number) {
    const text = event.clipboardData.getData('text');
    if (!/[\t\n]/.test(text)) return;
    event.preventDefault();
    onChange(pasteCells(rows, level, row, col, text));
  }

  const getOptions = (key: string) => {
    if (key === 'province') return PROVINCES;
    if (key === 'district') return DISTRICTS;
    if (key === 'ward') return WARDS;
    return null;
  };

  return (
    <div className="sheet">
      <table>
        <thead>
          <tr>
            <th>STT</th>
            {hasRetryErrors && <th className="sheet-error-heading">Lỗi cần sửa</th>}
            {columns.map((column) => (
              <th key={column.key}>
                {column.label}
                {column.required && <span className="red"> [*]</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className={checked ? validateRow(row, level) : ''} id={`row-${index + 1}`}>
              <td>{row._sourceLine || index + 1}</td>
              {hasRetryErrors && (
                <td className="sheet-error-cell">
                  {row._errorMessage ? (
                    <div className="sheet-row-error">
                      <strong>{row._errorCode}</strong>
                      <span>{row._errorMessage}</span>
                    </div>
                  ) : (
                    <span className="sheet-row-error-empty">—</span>
                  )}
                </td>
              )}
              {columns.map((column, col) => {
                const options = getOptions(column.key);
                const cellValue = row[column.key] ?? '';
                return (
                  <td key={column.key} className={options ? 'select-cell' : ''}>
                    {options ? (
                      <div className="sheet-select-wrapper">
                        <select
                          aria-label={'Dòng ' + (index + 1) + ', ' + column.label}
                          value={cellValue}
                          onChange={(e) =>
                            onChange(
                              rows.map((item, i) =>
                                i === index ? { ...item, [column.key]: e.target.value } : item,
                              ),
                            )
                          }
                        >
                          <option value="">Chọn {column.label.toLowerCase()}</option>
                          {cellValue && !options.includes(cellValue) && (
                            <option value={cellValue}>{cellValue}</option>
                          )}
                          {options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        <ChevronDown size={12} className="select-arrow" />
                      </div>
                    ) : (
                      <input
                        aria-label={'Dòng ' + (index + 1) + ', ' + column.label}
                        value={cellValue}
                        onChange={(e) =>
                          onChange(
                            rows.map((item, i) =>
                              i === index ? { ...item, [column.key]: e.target.value } : item,
                            ),
                          )
                        }
                        onPaste={(e) => paste(e, index, col)}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

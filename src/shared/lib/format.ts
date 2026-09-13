export const money = (value: number) => value.toLocaleString('vi-VN') + ' đ';
export const dateTime = (value: string) => new Date(value).toLocaleString('vi-VN');
export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const csv =
    '\ufeff' +
    rows
      .map((row) =>
        row
          .map((cell) => {
            const text = String(cell).replace(/^[=+@\-\t\r]/, (c) => "'" + c);
            return '"' + text.replaceAll('"', '""') + '"';
          })
          .join(','),
      )
      .join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

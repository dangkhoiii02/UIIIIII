# SuperPlatform UI

Ứng dụng React chạy local, mô phỏng giao diện tạo và quản lý đơn hàng SuperShip.

## Công nghệ

- React 19 + TypeScript strict + Vite.
- React Router: URL riêng cho từng màn hình, tải màn hình theo nhu cầu.
- Context theo tính năng, repository dữ liệu mẫu có thể thay thế.
- Lucide React cho icon; CSS theo design tokens.
- ESLint, Prettier, Vitest; npm lockfile để cài đặt nhất quán.

## Chạy local

Yêu cầu Node.js >= 22.12 và npm.

```bash
npm ci
npm run dev
```

Mở http://127.0.0.1:5173. Server chỉ lắng nghe loopback.
Không có cấu hình hosting, tự động publish hay SDK Sites.

## Kiểm tra

```bash
npm run typecheck
npm run lint
npm test
npm run build
npm run format:check
```

`npm run check` chạy typecheck, lint, test và build.
`npm run preview` xem bản build tại http://127.0.0.1:4173.
`dist/` là đầu ra build, không sửa trực tiếp và không đưa vào Git.

## Cấu trúc

```text
public/                     # Tài nguyên tĩnh
src/
  app/
    config/                 # Cấu hình điều hướng
    layouts/                # Khung ứng dụng
    pages/                  # Trang hệ thống/chưa triển khai
    providers/              # Ghép các provider cấp ứng dụng
    App.tsx
    router.tsx
  features/
    orders/
      components/           # Form, bảng, bộ lọc, dialog
      data/                 # Interface và repository dữ liệu mẫu
      model/                # Types, nghiệp vụ, context và unit tests
      pages/                # Màn hình tạo/sửa và danh sách
      index.ts              # Public API của feature
    bulk-orders/
      components/
      model/                # Parse, validate, paste, draft; tests
      pages/
      index.ts
    pickup/                 # Địa chỉ lấy hàng
    support/                # Yêu cầu hỗ trợ mẫu
  shared/
    lib/                    # Format tiền, CSV, browser storage
    styles/                 # Design tokens và CSS nền
    ui/                     # Button, Field, Card, Modal, Toast...
  main.tsx
docs/
  architecture.md
```

## Phạm vi và dữ liệu

- Giữ màn hình tạo đơn thủ công/chọn sản phẩm mẫu, đơn hàng, bảng tính 2/3 cấp, hỗ trợ và hướng dẫn.
- Tạo, sửa, hủy, lọc và in đơn chạy bằng dữ liệu trong bộ nhớ. Tải lại trang đặt lại dữ liệu mẫu.
- Bản nháp bảng tính và tùy chọn ẩn hướng dẫn được lưu localStorage trên thiết bị.
- Cước phí và danh mục khu vực/sản phẩm chưa kết nối backend.
- Các module ngoài ảnh tham chiếu giữ trang chờ triển khai.
- Ảnh chỉ xem trong form, không tải lên server.
- Trạng thái đã in được ghi nhận khi gọi chức năng in, không xác nhận máy in vật lý.

Đọc `docs/architecture.md` trước khi thêm module hoặc tích hợp API.

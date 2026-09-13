# Quy ước kiến trúc

## Nguyên tắc

Luồng phụ thuộc: app → features → shared. Module shared không nhập app hay features.
Feature khác chỉ nhập public API từ `@/features/<name>`; ESLint chặn deep import qua alias.
Bên trong một feature dùng import tương đối. Tránh barrel export toàn bộ cây thư mục.

## Phân chia trách nhiệm

- Page điều phối hành vi và trạng thái của màn hình.
- Component chứa JSX và tương tác cục bộ.
- Model chứa types và hàm nghiệp vụ thuần, độc lập với DOM.
- Data chứa repository; UI không đọc/ghi trực tiếp kho dữ liệu.
- Provider sở hữu trạng thái chia sẻ trong feature, không có một store tổng chứa mọi thứ.
- Shared UI chỉ nhận props, không biết đơn hàng hay backend.

Repository hiện tại là đồng bộ trong bộ nhớ, được inject vào OrdersProvider.
Khi thêm backend, đổi contract sang bất đồng bộ và bổ sung trạng thái loading/error,
hủy request, xử lý lỗi xác thực và kiểm tra schema response tại data layer.
Không giả định UI demo có sẵn bảo mật, phân quyền hay persistence production.
Chưa cần thêm Redux hoặc query cache khi chưa có yêu cầu dữ liệu server.

## Routing

Dùng BrowserRouter với các đường dẫn /create, /orders, /sheet2, /sheet3, /requests.
Tạo mới, sửa và sao chép dùng /create, /create?edit=<id>, /create?copy=<id>.
Màn hình đơn và bảng tính tải qua React.lazy. Khi đổi bảng tính, key tách state theo cấp.
Lỗi render có ErrorBoundary và router error page.

## State

State biểu mẫu được giữ tại form. Bộ lọc đã áp dụng và bộ lọc đang chỉnh tách biệt.
Tạo hàng loạt validate toàn bộ lô trước khi ghi; không ghi dở một phần.
Sửa giữ id và metadata của đơn gốc.
localStorage chỉ dùng cho nháp/tùy chọn thiết bị; đọc dữ liệu nháp có kiểm tra cấu trúc.
Không chứa credential hay API key trong mã client.

## UI và an toàn dữ liệu

Dùng JSX để React escape nội dung người dùng; không dùng innerHTML hoặc DOM event binding thủ công.
Modal dùng native dialog, quản lý focus/keyboard qua trình duyệt và đóng khi unmount.
Object URL của ảnh/CSV được thu hồi. CSV escape dấu nháy và chặn công thức bảng tính.
Layout giữ màu sắc và bố cục SuperShip; design tokens dùng chung trong shared/styles.
Không coi cước phí mẫu là kết quả tính phí thật.

## Kiểm tra trước khi tích hợp thay đổi

1. npm run format
2. npm run check
3. Kiểm tra thủ công tạo/sửa đơn, bộ lọc, modal, bảng tính ở desktop và chiều rộng nhỏ.
4. Commit package-lock.json khi thay đổi dependency.
5. Không commit node_modules, dist, .env hoặc file chứa dữ liệu cá nhân.

Không thêm tầng hoặc thư viện chỉ để tăng số thư mục. Tách module khi có trách nhiệm nghiệp vụ rõ ràng.

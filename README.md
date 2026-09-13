# SuperPlatform UI

Bản UI tham chiếu SuperShip, dùng HTML/CSS/JavaScript, không cần cài thư viện.

Chạy `npm run dev`, mở http://127.0.0.1:5173. Kiểm tra cú pháp: `npm run check`.

## Phạm vi

- Tạo đơn: nhập thủ công/chọn sản phẩm mẫu, tách thông tin dán, xem ảnh, kiểm tra dữ liệu.
- Đơn hàng: bộ lọc, trạng thái, chi tiết, hỗ trợ mẫu, tạo lại, hủy, xuất CSV, xem tem.
- Bảng tính 2/3 cấp: 25 dòng, dán bảng, kiểm tra và tạo nhiều đơn mẫu, lưu nháp trên thiết bị.
- Các mục khác giữ vị trí điều hướng để phát triển UI sau.

Đơn hàng và yêu cầu hỗ trợ chỉ tồn tại trong bộ nhớ của trang; tải lại sẽ đặt lại dữ liệu mẫu. Cước phí chưa tích hợp API. Danh sách khu vực/sản phẩm là dữ liệu minh họa, chưa phải danh mục đầy đủ. Lưu nháp và tùy chọn ẩn hướng dẫn sử dụng localStorage.

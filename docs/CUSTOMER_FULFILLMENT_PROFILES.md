# Chuẩn loại khách hàng và mô hình vận chuyển khi tạo đơn

## Mục đích

Tài liệu này là baseline giao diện và nghiệp vụ cho màn tạo đơn SuperShip/SuperAI. Khi thay đổi UI, dữ liệu hoặc luồng tạo vận đơn, phải đối chiếu tài liệu này cùng tài liệu kiến trúc tích hợp GrabExpress và Green SM Express.

## Ma trận loại khách hàng đã chốt

| Loại khách hàng | Ai lấy hàng tại Shop | Trung gian | Ai giao tới người nhận | Nhánh | Khi hoàn | Ghi chú đặc thù | Trạng thái |
|---|---|---|---|---|---|---|---|
| Địa phương cũ — TH1: SuperShip giao | SuperShip | Kho SuperShip | SuperShip | 1a | Hoàn thẳng về Shop | Một chuỗi vận hành của SuperShip | Đã chốt |
| Địa phương cũ — TH2: NVC khác giao | SuperShip | Kho SuperShip | NVC khác lấy tại kho SuperShip | 1b | NVC giao hoàn về kho SuperShip, sau đó SuperShip trả về Shop | Địa chỉ gửi trên vận đơn giao là kho SuperShip | Đã chốt |
| Địa phương mới — TH1: SuperShip giao | SuperShip | Kho SuperShip | SuperShip | 1a | Hoàn thẳng về Shop | Một chuỗi vận hành của SuperShip | Đã chốt |
| Địa phương mới — TH2: NVC khác giao | SuperShip | Kho SuperShip; hai vận đơn được tạo song song ngay từ đầu | NVC khác lấy tại kho SuperShip | 1b | NVC giao hoàn về kho SuperShip, sau đó SuperShip trả về Shop | Tương tự Địa phương cũ TH2 nhưng chuẩn bị hai vận đơn song song | Đã chốt |
| Toàn quốc | NVC lấy tại Shop | Không qua kho SuperShip | Cùng NVC giao xuyên suốt | 2 | Hoàn thẳng về địa chỉ lấy | SuperPlatform cấu hình trước các NVC Shop được phép dùng; SuperShip không tham gia vận hành | Đã chốt |
| SuperAI | NVC lấy tại Shop | Không qua kho SuperShip | Cùng NVC giao xuyên suốt | 2 | Hoàn thẳng về địa chỉ lấy | Người dùng tự chọn NVC khi tạo đơn; không phụ thuộc danh sách NVC mặc định của SuperShip | Đã chốt |

## Trường hợp địa chỉ lấy riêng theo NVC

- Mặc định mỗi NVC sử dụng địa chỉ kho/điểm lấy đang chọn của Shop.
- Shop có thể bật địa chỉ lấy riêng cho từng NVC, ví dụ GrabExpress dùng bưu cục A còn Green SM Express dùng điểm lấy B.
- Địa chỉ riêng chỉ ghi đè cấu hình của đúng NVC; không thay đổi địa chỉ kho mặc định hoặc cấu hình NVC khác.
- Mọi địa chỉ phải được chuẩn hóa và có tọa độ trước khi kiểm tra khả dụng hoặc lấy báo giá.

## Quy tắc hiển thị trên màn tạo đơn

### SuperShip

- Shop chọn mô hình `Địa phương cũ`, `Địa phương mới` hoặc `Toàn quốc`.
- Với khách hàng địa phương, Shop chọn `SuperShip giao` (nhánh 1a) hoặc `NVC khác giao` (nhánh 1b).
- Địa phương mới nhánh 1b phải thể hiện rõ hai vận đơn được chuẩn bị song song.
- Toàn quốc chỉ hiển thị NVC/dịch vụ đã được SuperPlatform cấp cho Shop và vượt qua kiểm tra khả dụng.

### SuperAI

- Người dùng chủ động chọn NVC trong các phương án thực tế đang khả dụng.
- Luồng vật lý là NVC lấy tại Shop và giao thẳng tới người nhận; SuperShip không tham gia vận hành.
- Chế độ AI chỉ xếp hạng/chọn trong tập phương án hợp lệ, không được bỏ qua quyền Shop, điểm lấy, vùng phục vụ, capability hoặc hạn báo giá.

### GrabExpress và Green SM Express

- Không tạo màn hoặc loại Order riêng cho Grab/Green SM.
- Hai NVC nằm trong nhóm `Giao nội thành` của cùng màn tạo đơn và không thay thế nhóm NVC vận chuyển thông thường.
- Nhóm vận chuyển thông thường tiếp tục gồm các NVC mạng lưới được Shop cấp như SPX Express, GHN, J&T Express, Viettel Post, BEST Express và Vietnam Post.
- Grab/Green SM chỉ được xét khi điểm lấy và điểm giao thuộc cùng thành phố/vùng phục vụ của dịch vụ; cấu hình theo tỉnh không đủ để kết luận tuyến chắc chắn khả dụng.
- Chỉ lấy phương án khi đã đủ điểm lấy, địa chỉ và tọa độ người nhận, kiện hàng, COD và thời gian mong muốn.
- Thẻ phương án phải có NVC, dịch vụ/phương tiện, giá bán, ETA tới lấy, ETA giao và hạn báo giá.
- Giá hoặc dữ liệu đầu vào thay đổi làm phương án hết hiệu lực và phải báo giá lại.
- Tạo chuyến thành công chưa đồng nghĩa đã có tài xế; trạng thái tiếp theo có thể là `Đang tìm tài xế`.
- Không tự động chuyển NVC khi booking cũ đang timeout/chưa xác định. Chỉ fallback sau khi thất bại cuối, hủy thành công hoặc đối soát xác nhận booking cũ không tồn tại.

## Chế độ cấu hình nhà vận chuyển

1. AI chọn một phương án hiệu quả nhất.
2. Một nhà vận chuyển mặc định.
3. AI xếp hạng nhiều phương án để Shop xác nhận.
4. Ưu tiên chi phí thấp nhất.
5. Ưu tiên giao nhanh nhất.
6. Nhà vận chuyển mặc định và phương án dự phòng an toàn.

Các chế độ trên là chính sách chọn phương án, không phải bằng chứng NVC chắc chắn nhận chuyến. Kết quả cuối vẫn phụ thuộc cấu hình ứng dụng, mô hình khách hàng, Shop, điểm lấy, tài khoản NVC, khu vực, serviceability và báo giá runtime.

## Nguồn đối chiếu

- `SuperShip – PHÂN TÍCH KIẾN TRÚC TÍCH HỢP GRABEXPRESS VÀ GREEN SM EXPRESS VÀO SUPERPLATFORM.md`, phiên bản 2.11.0.
- Bảng phân loại khách hàng do Product cung cấp ngày 17/09/2026.

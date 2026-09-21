# Trạng thái coverage DataSeed

Mốc kiểm tra: 19/09/2026, PostgreSQL 16, API Contract `1.3.0` và Database
Dictionary `v0.25.0`.

## Kết quả bắt buộc

- 37/37 bảng trong schema `order_mgmt` có ít nhất một record hợp lệ.
- 45/45 `status_code` xuất hiện trong `order_status_history`.
- 45/45 `status_code` có ít nhất một Order mang trạng thái hiện tại để kiểm tra UI.
- Current status của mỗi Order khớp Status History cuối.
- Sáu trạng thái Request Step đã được phủ: `PENDING`, `PROCESSING`, `SUCCESS`,
  `FAILED`, `UNKNOWN`, `CANCELLED`.
- Tám loại Request Target và năm loại Operational Assignment đã được phủ.
- Sáu kết quả Waybill SLA đã được phủ.
- Sáu loại ảnh và bốn loại ghi chú đã được phủ.
- Năm trạng thái thu COD, sáu trạng thái đối soát COD và năm trạng thái bồi
  thường trên current projection của Order đã được phủ đầy đủ.
- Luồng mạng lưới chỉ dùng Carrier code đã xác nhận: `1, 2, 3, 4, 6, 10, 13`.
- Carrier code thiết kế `15/16` phủ toàn diện NVC tức thời: tìm tài xế (`SPF-0302`), không tìm được tài xế (`SPF-0303`), đang giao hàng (`SPF-0801` — Green SM Express `9209190000008`), và đã giao hàng thành công (`SPF-0901` — GrabExpress `9209190000009`).

Strict validator sẽ dừng bằng lỗi nếu thiếu bất kỳ bảng, trạng thái hoặc ma trận
bắt buộc nào ở trên.

## Coverage sáu trường tài chính mới

| Nhóm | Status được phủ | Order đại diện |
|---|---|---|
| Thu COD | `1` không COD, `2` chờ thu, `3` đã thu, `4` thu một phần, `5` không thu được | `9100000000002`, `9100000000001`, `9100000000003`, `9100000000004`, `9209190000003` |
| Đối soát COD | `1` không áp dụng, `2` chờ đối soát, `3` đang xử lý, `4` chuyển một phần, `5` chuyển đủ, `6` tạm giữ | `9100000000002`, `9100000000001`, `9209190000004`, `9100000000004`, `9100000000003`, `9209190000006` |
| Bồi thường | `1` không phát sinh, `2` đang xem xét, `3` đã phê duyệt, `4` đã chi trả, `5` bị từ chối | `9100000000001`, `9100000000004`, `9209190000006`, `9209190000005`, `9209190000002` |

Validator còn kiểm tra `0 <= settled_amount <= collected_amount <= cod_amount`,
số tiền khớp ý nghĩa từng trạng thái và toàn bộ 16 Order scenario đều được cập
nhật projection.

## Số lượng trên database kiểm tra

| Hạng mục | Số lượng |
|---|---:|
| Order | 53 |
| Waybill | 114 |
| Tracking Event | 153 |
| Status History | 165 |
| Trạng thái hiện tại được phủ | 45/45 |
| Trạng thái lịch sử được phủ | 45/45 |
| Bảng có dữ liệu | 37/37 |

## Workflow chính

## Lưu ý khi đối chiếu UI

- `9100000000004` có chặng nguồn `LẤY -> GIAO`; chặng `HOÀN` được UI dựng ở
  trạng thái kế tiếp từ `PARTIAL_DELIVERY.remaining_action = RETURN`, vì tại
  thời điểm giao một phần NVC chưa được xác nhận nhận kiện hoàn. Các kịch bản
  đã có NVC hoàn thực tế nằm trong nhóm D2.
- Hỏa tốc đã có Order hiện tại cho `SPF-0302`, `SPF-0303`, `SPF-0801` và
  `SPF-0901`; event history của hai đơn đang/đã giao bao phủ thêm phân tài xế,
  tài xế đến lấy và đã lấy hàng. Nếu cần kiểm thử dạng danh sách riêng cho từng
  trạng thái trung gian `DRIVER_ASSIGNED`, `DRIVER_TO_PICKUP`, `PICKED_UP`,
  `ARRIVING`, cần bổ sung các Order showcase riêng; mapper UI đã hỗ trợ các trạng
  thái này.

- Tạo Order và booking đang xử lý.
- Giao hàng thành công toàn bộ.
- Bàn giao giữa hai NVC.
- Giao một phần.
- Batch và dữ liệu kỹ thuật.
- Booking bị NVC từ chối.
- Hủy lỗi rồi retry thành công.
- NVC tức thời đang tìm tài xế và không tìm được tài xế; không áp dụng hai trạng
  thái này cho đơn mạng lưới thông thường.
- Lấy hàng thất bại, retry, bàn giao thất bại, retry và giao lại.
- Chuyển hoàn qua điểm trung gian thành công.
- Lấy hoàn/trả hàng thất bại rồi retry, kết thúc trả một phần.
- Đổi hàng thành công sau khi NVC xác nhận điều chỉnh COD.
- Projection tài chính gồm không COD, chờ thu, đã thu, thu một phần, không thu
  được; chờ/đang xử lý/chuyển một phần/chuyển đủ/tạm giữ; bồi thường đang xem
  xét/đã duyệt/đã chi trả/bị từ chối.
- API fixture bổ sung snapshot PATCH, Carrier reject, cancel processing/unknown/
  rejected, retry theo Attempt/Handover, tracking late/correction, multi-image
  remove, Print boundary, đủ activity group, Batch failed-all, Idempotency/
  Outbox state, terminal failure result và Request/Step cho toàn bộ API nội bộ.

## Phân biệt dữ liệu xác nhận và fixture

Bảy mã Waybill do Business cung cấp được giữ nguyên trong seed. Mã Green SM và
GrabExpress dùng cho test hỏa tốc là fixture giả định theo API Contract, chưa
phải mã được Carrier Registry xác nhận production. Các Waybill bổ
sung để dựng workflow là dữ liệu giả lập deterministic, không phải vận đơn
production; chúng tuân theo đúng format đã xác nhận của từng NVC, không dùng PII,
credential hoặc token thật.

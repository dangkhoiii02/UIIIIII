# API Contract 1.3.0 — DataSeed Coverage

Nguồn đối chiếu: `SuperShip - API CONTRACT MODULE ORDER (3).md`.
DataSeed bao phủ dữ liệu nguồn trong 37 bảng Order DB; không giả lập ownership
của Print, Finance, File, Support hoặc Security Module.

## Fixture chạy thêm

Các biến thể API bổ sung nằm tại:

```text
database_seed/test_data/004_api_contract_coverage.sql
```

File này chạy sau toàn bộ scenario D1/D2 và trước projection tài chính trong
`run_all.sql`/`run_with_docker.sh`.

## API có dữ liệu nguồn để đọc/kiểm thử

| Nhóm API | Coverage | Dữ liệu chính |
|---|---|---|
| Tạo, danh sách, search, filter, detail Order | Đủ fixture đọc | `orders`, Party, Address, Goods, Item, Waybill, SOC, phone, status, COD, carrier |
| Actions | Đủ trạng thái đầu vào đại diện | Order chưa có Waybill, đang xử lý, đã giao, giao một phần, hủy, chuyển hoàn, đổi hàng |
| PATCH Order | Đủ thành công trước Waybill | Snapshot version 1/2, `valid_to`, `order_adjustments`, Request, Step, Activity |
| Change sau Waybill | Đủ thành công và Carrier từ chối | Request/Step failed, Support Ticket external reference, giữ snapshot cũ |
| Cancel | Đủ processing, unknown, rejected và thành công | `order_requests`, `request_steps`, Status History của scenario hủy |
| Retry | Đủ delivery, handover và return | Request, Target Attempt/Handover, Step mới; Attempt cũ không bị ghi đè |
| API nội bộ thay đổi/nghiệp vụ | Đủ `changes/check`, `changes`, `partial`, `exchange`, `return`, `return/confirm`, `carrier` | Request/Step/Target, Adjustment, Activity, chặng và trạng thái lịch sử |
| Stages, Stage detail, Waybill history | Đủ | Nhiều Stage, nhiều NVC, Waybill thay thế, Handover, snapshot service |
| Tracking | Đủ applied, late/history-only và correction | `tracking_events.apply_result`, `received_at > occurred_at`, `corrects_event_id` |
| Shipper/shippers | Đủ dữ liệu hiện hành và lịch sử | `operational_assignments`, nhiều Attempt/Stage, assignment cũ và mới |
| SLA | Đủ kết quả Waybill SLA và Order SLA | `waybill_slas`, `order_slas`, overdue, late, reference-only, not-applicable |
| Activities | Đủ activity group 1–12 | `activity_logs`, references tới Request, Ticket, Image, Waybill, Print, Finance |
| Notes | Đủ 4 loại và visibility Shop/internal | `order_notes` |
| Images | Đủ 6 loại, attached/removed, multi-remove | `order_images`, Request/Step và Activity gỡ nhiều ảnh |
| Finance | Đủ snapshot API theo Order | 6 trường COD/settlement/compensation, phí Stage, `FIN` external reference |
| Batch history/result | Đủ success, partial và failed-all | `order_batches`, `batch_items`, `batch_item_attempts` |
| Idempotency/Outbox | Đủ trạng thái chính | Idempotency processing/success/failed; Outbox pending/claimed/sent/retry/dead-letter |
| Terminal results | Đủ delivery và return failure đại diện | `order_results.result_code = 3`, phân biệt Attempt retry với Result kết luận |

## API không thể hoàn tất chỉ bằng Order DataSeed

Các API sau vẫn cần integration test hoặc seed ở module sở hữu tương ứng:

- `GET /v1/order-filters`: danh mục filter là response/configuration theo quyền,
  không có bảng nguồn trong Order DB.
- `GET /v1/order-labels/types`, `POST /v1/order-labels/tokens` và
  `GET /v1/order-labels/print`: label template, token, Print Job, render và file
  thuộc Print Module. Order chỉ seed `activity_logs` group 7 và
  `external_refs.module_code = 'PRT'`.
- `GET /v1/order-batches/template`, `POST /v1/order-batches/parse`,
  `GET .../export` và `POST /v1/orders/export`: XLSX/binary/file export thuộc
  File/Workflow layer; Order DB chỉ giữ snapshot/result/reference.
- `POST /v1/public/orders/tracking`: CAPTCHA, authentication-free access,
  masking và rate limit thuộc Security/API Gateway; database có dữ liệu hành
  trình để test phần read model.
- Permission, Data Scope, actor masking, HTTP error mapping, idempotency race,
  validation token TTL/consume-once và atomicity cần integration/concurrency
  test, không đưa record vi phạm constraint vào seed thành công.

## Kết luận

Sau khi chạy `run_all.sql`, bộ seed có đủ dữ liệu nguồn để exercise các API
Order có persistence trong baseline. Các API boundary ở trên không bị coi là
thiếu dữ liệu Order; chúng cần fixture/mock của module sở hữu và test runtime.

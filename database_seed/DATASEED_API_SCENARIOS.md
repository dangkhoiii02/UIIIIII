# DataSeed và API — Ma trận kịch bản Module Order

> Tài liệu hợp nhất toàn bộ kịch bản hiện có trong bộ DataSeed Module Order.
> Mỗi kịch bản gồm mã đơn, trạng thái hiện tại, dữ liệu được seed, luồng nghiệp
> vụ và nhóm API dùng để đọc/kiểm thử.

- **Ngày đối chiếu:** 19/09/2026
- **API Contract:** `1.3.0` — [SuperShip - API CONTRACT MODULE ORDER (3).md](../../SuperShip%20-%20API%20CONTRACT%20MODULE%20ORDER%20(3).md)
- **Database Dictionary:** `v0.25.0` — [SuperShip - MODULE ORDER - DATABASE DICTIONARY - BASELINE v0.25.0.md](../../SuperShip%20-%20MODULE%20ORDER%20-%20DATABASE%20DICTIONARY%20-%20BASELINE%20v0.25.0.md)
- **Database schema:** `order_mgmt`
- **Số liệu kiểm tra:** 53 Order, 114 Waybill, 125 Order Leg, 153 Tracking Event, 165 Status History, 4 Order Note, 37/37 bảng có dữ liệu.

## 1. Quy ước đọc tài liệu

### 1.1. Mã NVC, mã vận đơn và mã phân loại

| Dữ liệu | Ý nghĩa | Ví dụ |
|---|---|---|
| `carrier_code` | Mã NVC trong Carrier Registry | `2` = GHN, `10` = SPX Express |
| `carrier_waybill_code` | Mã vận đơn do NVC cấp | `GY8YLSDK`, `SPXVN066263841279` |
| `carrier_sorting_code` | Mã chia chọn/kho/tuyến do NVC cấp | `HCA-51-172-Q5P8-N`, `100-A2-09-00` |
| `stage_code` | Mã chặng nội bộ của Order | `STG-PICKUP-0001`, `STG-DELIVERY-0001` |

Mã chia chọn không được hiển thị hoặc dùng thay cho mã vận đơn. Các mã NVC
`15` — Green SM Express và `16` — GrabExpress chỉ là fixture thiết kế cho luồng
hỏa tốc, chưa phải mã Registry production.

### 1.2. Quy tắc hiển thị hỏa tốc

- `SPF-0302`: đang tìm tài xế — chưa có nút xem vị trí tài xế.
- `SPF-0303`: không tìm được tài xế — không có chặng giao thực tế.
- `SPF-0301`/`SPF-0401`: đã phân tài xế hoặc tài xế đang đến lấy — chưa cho xem hành trình live.
- Từ `PICKED_UP` trở đi ( `SPF-0501`, `SPF-0801`, `SPF-0901` ): được hiển thị **Xem vị trí và hành trình tài xế** nếu có driver assignment.

### 1.3. API seed và API runtime

`DataSeed` tạo snapshot trong Order DB để API có dữ liệu trả về. Seed không tự
thực thi HTTP request và không thay thế các kiểm tra runtime như permission,
Data Scope, CAPTCHA, race condition, token TTL hoặc binary file rendering.

Trong các bảng dưới đây:

- **Read API** là API có thể gọi để đọc snapshot đã seed.
- **Action API** là API nghiệp vụ mà dữ liệu request/result/history đã được seed để kiểm thử trạng thái tương ứng.
- **Boundary** là phần phải mock/integration test ở module sở hữu, không coi là thiếu dữ liệu Order.
### 1.4. Format chèn ảnh

Mỗi kịch bản có một thư mục evidence riêng dưới `./scenario_images/<order_code>/`.
Đặt ảnh vào đó theo quy ước:

| Tên file | Nội dung |
|---|---|
| `ui-list.png` | Ảnh dòng Order trên màn hình danh sách |
| `ui-detail.png` | Ảnh trang chi tiết Order |
| `api-response.png` | Response hoặc ảnh Postman/Swagger |
| `db-query.png` | Kết quả truy vấn kiểm tra trên DBeaver |
| `tracking.png` | Hành trình/chặng/tracking nếu kịch bản có |

Trong phần evidence của từng kịch bản, chỉ cần bỏ comment các dòng ảnh sau khi
đã đặt file đúng tên. Ảnh được đặt ngoài bảng để không bị co chiều rộng hoặc
vỡ layout khi render Markdown.

## 2. File DataSeed và thứ tự chạy

| Nhóm dữ liệu | File seed |
|---|---|
| DDL và reference status | `database_ddl/order_mgmt_ddl.sql`, `database_seed/reference_data/order_statuses.sql` |
| D1 — luồng thành công | `database_seed/test_data/designer_1/001_order_creating.sql` đến `005_batch_reliability.sql` |
| D1 — NVC đã đối chiếu | `database_seed/test_data/designer_1/000_verified_carrier_contracts.sql` |
| D2 — lỗi, hủy, hoàn, đổi | `database_seed/test_data/designer_2/001_failure_return_coverage.sql` |
| API contract persistence | `database_seed/test_data/004_api_contract_coverage.sql` |
| UI current status showcase | `database_seed/test_data/006_ui_current_status_showcase.sql` |
| Sửa chặng lấy trực tiếp từ NVC | `database_seed/test_data/007_direct_carrier_pickup_stage_repair.sql` |
| Hỏa tốc đang giao/đã giao | `database_seed/test_data/008_instant_delivery_active_completed_coverage.sql` |
| Sửa phân tài xế hỏa tốc | `database_seed/test_data/005b_instant_driver_allocation_repair.sql` |
| Projection tài chính | `database_seed/test_data/003_financial_projection_coverage.sql` |

File tổng hợp để chạy một lần: [ALL_DATASEED.sql](./ALL_DATASEED.sql).

~~~bash
ORDER_DB_CONTAINER=order-local-postgres-1 \
ORDER_DB_NAME=supership-superplatform-order-db \
ORDER_DB_USER=order_admin \
./run_with_docker.sh
~~~

## 3. Ma trận API Contract

### 3.1. Core Order API

| API | Dữ liệu seed sử dụng | Kịch bản đại diện |
|---|---|---|
| `POST /v1/orders` | Sender, receiver, address, goods, item, measure, COD, service, selection và pickup method | `9100000000001`, `9100000000007`, `9209190000008` |
| `GET /v1/orders` | 53 Order, current status, carrier, pagination input | Toàn bộ bộ seed |
| `GET /v1/orders/search` | `order_code`, SOC, waybill, receiver name/phone | `9100000000002`, `9100000000003`, `9100000000008` |
| `GET /v1/order-filters` | Cấu hình filter theo quyền/Data Scope | Boundary — response config, không lưu trong Order DB |
| `POST /v1/orders/filter` | Status, carrier, pickup method, COD, stage, incident, date và financial projection | `9100000000007`–`9100000000009`, toàn bộ UI showcase |
| `GET /v1/orders/{order_code}` | Full order detail, receiver, goods, stages, waybills, status, COD, images, notes | Tất cả mã đơn |
| `GET /v1/orders/{order_code}/actions` | Trạng thái và điều kiện thao tác hiện tại | `9100000000001`, `9209190000002`, `9209190000005`, `9299999900004` |
| `PATCH /v1/orders/{order_code}` | Snapshot version, before/after adjustment, request, step, activity | `004_api_contract_coverage.sql`, đại diện `9100000000001` |
| `POST /v1/orders/{order_code}/cancel` | Cancel processing/unknown/rejected/success và status history | `9209190000002`, `9299999900004` |

### 3.2. Hành trình và vận chuyển

| API | Dữ liệu seed sử dụng | Kịch bản đại diện |
|---|---|---|
| `GET /v1/orders/{order_code}/stages` | Chuỗi `PICKUP`, `DELIVERY`, `RETURN`, `FINAL-RETURN`; carrier và waybill hiện hành | `9100000000003`, `9100000000004`, `9209190000005`, `9209190000006` |
| `GET /v1/orders/{order_code}/stages/{stage_code}` | Leg detail, endpoint, service, attempt và events của một chặng | Mọi Order có `STG-*` |
| `GET /v1/orders/{order_code}/stages/{stage_code}/waybills` | Waybill hiện hành, cũ, thay thế, `replaces_waybill_id`, sequence | `004_api_contract_coverage.sql`, `9100000000003` |
| `GET /v1/orders/{order_code}/tracking` | Timeline theo Order/Leg, event applied, late event, correction | `9100000000002`, `9100000000003`, `9209190000008`, `9209190000009` |
| `GET /v1/orders/{order_code}/shipper` | Driver/vehicle hiện hành, assignment, attempt và masking | `9209190000008`, `9209190000009`, `9299999900006` |
| `GET /v1/orders/{order_code}/shippers` | Lịch sử người phụ trách theo chặng/NVC/waybill | `9100000000003`, `9209190000004`, `9209190000005` |
| `GET /v1/orders/{order_code}/sla` | `order_slas`, `waybill_slas`, on-time, late, overdue, reference-only, not-applicable | `004_api_contract_coverage.sql`, D1 success |

### 3.3. Lịch sử, tài chính, ghi chú, hình ảnh và in nhãn

| API | Dữ liệu seed sử dụng | Kịch bản đại diện |
|---|---|---|
| `GET /v1/orders/{order_code}/activities` | Activity group 1–12, request/ticket/image/print/finance references | `004_api_contract_coverage.sql` |
| `GET /v1/orders/{order_code}/finance` | `collected_amount`, `cod_collection_status`, `settled_amount`, `cod_settlement_status`, `compensation_amount`, `compensation_status`, fee stage | `9100000000002`, `9100000000004`, `9209190000006` |
| `GET /v1/orders/{order_code}/notes` | 4 loại note và Shop/internal visibility | Order có note trong `004_api_contract_coverage.sql` |
| `POST /v1/orders/{order_code}/notes` | Request thêm note và activity tương ứng | Fixture note/API coverage |
| `GET /v1/orders/{order_code}/images` | Goods, pickup, delivery, return, attached/removed, POD | `9209190000009`, `004_api_contract_coverage.sql` |
| `POST /v1/orders/{order_code}/images` | Image attached trước khi lấy hàng | `004_api_contract_coverage.sql` |
| `POST /v1/orders/{order_code}/images/remove` | Gỡ một/nhiều ảnh, giữ audit và history | `004_api_contract_coverage.sql` |
| `GET /v1/orders/{order_code}/prints` | Print reference và activity group 7 | `004_api_contract_coverage.sql` |
| `GET /v1/order-labels/types` | Label template/format | Boundary — Print Module |
| `POST /v1/order-labels/tokens` | Print token và permission/condition | Boundary — Print Module |
| `GET /v1/order-labels/print` | Render/download binary label | Boundary — Print/File Module |

### 3.4. Workflow, public và API nội bộ

| API | Dữ liệu seed sử dụng | Kịch bản đại diện |
|---|---|---|
| `GET /v1/order-batches/template` | Template metadata | Boundary — File/Workflow layer |
| `POST /v1/order-batches/parse` | Input file parse result | Boundary — File/Workflow layer |
| `POST /v1/order-batches/validate` | Validation snapshot/token và dòng lỗi | Batch success/partial/failed-all |
| `POST /v1/order-batches` | Batch, batch item, attempt, counter | `005_batch_reliability.sql` |
| `GET /v1/order-batches` | Batch history và thống kê | Batch success/partial/failed-all |
| `GET /v1/order-batches/{batch_code}` | Batch detail/progress | Batch fixtures |
| `GET /v1/order-batches/{batch_code}/results` | Kết quả từng dòng, order code hoặc lỗi | Batch fixtures |
| `GET /v1/order-batches/{batch_code}/export` | Excel result binary | Boundary — File/Workflow layer |
| `POST /v1/orders/export` | Order selection/filter snapshot | Boundary — File/Workflow layer |
| `POST /v1/public/orders/tracking` | Public timeline, masked sender/receiver, current carrier/stage | `9100000000002`, `9209190000009`; CAPTCHA/rate limit là Boundary |
| `POST /v1/orders/{order_code}/retry` | Request/target/attempt mới, attempt lỗi cũ, retry state | `9209190000004`, `9209190000006`, UI `0403/0604/0803/1006/1108` |
| `POST /v1/orders/{order_code}/changes/check` | Eligibility và current version trước thay đổi | API coverage |
| `POST /v1/orders/{order_code}/changes` | Before/after snapshot, adjustment, ticket reference, activity | API coverage |
| `POST /v1/orders/{order_code}/partial` | Partial request, result item, remaining action, COD projection | `9100000000004`, `9209190000006` |
| `POST /v1/orders/{order_code}/exchange` | Exchange request, return leg, replacement delivery leg, adjustment | `9209190000007` |
| `POST /v1/orders/{order_code}/return` | Return request và trạng thái `SPF-1001` | `9299999900024`, `9209190000005` |
| `POST /v1/orders/{order_code}/return/confirm` | Carrier confirmation và trạng thái `SPF-1002` | `9299999900025`, `9209190000005` |
| `POST /v1/orders/{order_code}/carrier` | Carrier decision, stage/waybill history và carrier change | `9100000000003`, API coverage |

## 4. Kịch bản D1 — Đơn thường, NVC và luồng thành công

### D1-01 — Đang tạo đơn NVC

| Trường | Giá trị |
|---|---|
| Mã đơn | `9100000000001` |
| Trạng thái | `SPF-0101` — Đang tạo đơn NVC |
| NVC dự kiến | J&T Express ( `carrier_code=3` ) |
| Waybill | Chưa có — booking chưa được NVC cấp mã |
| Chặng | `STG-DELIVERY-0001` ở trạng thái tạo vận đơn |
| DataSeed | `designer_1/001_order_creating.sql`; bổ sung projection/API tại `004_api_contract_coverage.sql` |
| Bảng chính | `orders`, party, address, goods, items, measures, `order_legs`, services, `order_requests`, `request_steps`, history |
| Read API | Detail, actions, stages, tracking, activities, finance |
| Action API | `POST /orders`, `PATCH /orders/{code}` trước Waybill, `GET /actions` |
| UI cần thấy | Có người nhận, hàng hóa, trạng thái tạo NVC; không hiển thị mã vận đơn giả |

### D1-02 — GHN giao thành công, cùng NVC lấy và giao

| Trường | Giá trị |
|---|---|
| Mã đơn | `9100000000002` |
| Trạng thái | `SPF-0901` — Đã giao hàng |
| NVC | GHN ( `carrier_code=2` ) |
| Waybill | `GY8YLSDK` |
| Sorting code | `100-A2-09-00` |
| Chặng | `PICKUP -> DELIVERY`, cùng GHN; lấy thành công và giao thành công |
| DataSeed | `designer_1/002_delivery_success.sql`; carrier repair/projection chạy sau |
| Bảng chính | `orders`, sender/receiver/address, goods/items/measure, legs, waybill, attempts, tracking, result, SLA, finance |
| Read API | Detail, stages, stage detail, waybills, tracking, shipper/shippers, SLA, activities, finance, images |
| Action API | `GET /actions`, public tracking; retry không được phép khi đã terminal |
| UI cần thấy | Có người nhận, block NVC GHN, mã vận đơn và toàn bộ chặng lấy/giao |

### D1-03 — Bàn giao SuperShip sang J&T Express

| Trường | Giá trị |
|---|---|
| Mã đơn | `9100000000003` |
| Trạng thái | `SPF-0901` — Đã giao hàng |
| NVC | SuperShip ( `1` ) -> J&T Express ( `3` ) |
| Waybill | `STGS983262LM.826941741` -> `802808938571` |
| Sorting code | J&T: `470-024C33-` |
| Chặng | `PICKUP` SuperShip, handover, `DELIVERY` J&T |
| DataSeed | `designer_1/003_multi_carrier_delivery.sql` |
| Bảng chính | `order_legs`, `leg_waybills`, `handovers`, handover attempts, transport attempts, assignments, tracking, status history |
| Read API | Stages, stage detail, waybill history, tracking, shipper, shippers, SLA, activities |
| Action API | `POST /carrier`, `POST /retry` cho handover nếu cần; `GET /actions` |
| UI cần thấy | 2 chặng và 2 NVC, không gộp thành chỉ một block giao |

### D1-04 — SPX giao một phần, phát sinh hoàn

| Trường | Giá trị |
|---|---|
| Mã đơn | `9100000000004` |
| Trạng thái | `SPF-0902` — Đã giao một phần |
| NVC | SPX Express ( `carrier_code=10` ) |
| Waybill | `SPXVN066263841279` |
| Sorting code | `HCA-51-172-Q5P8-N` |
| Chặng nguồn | `PICKUP -> DELIVERY`, status `PARTIALLY_DELIVERED`, `remaining_action=RETURN` |
| DataSeed | `designer_1/004_partial_delivery.sql`; pickup stage repair nếu chạy trên DB cũ |
| Bảng chính | `request_items`, result items, partial request, order result, legs, waybill, tracking, finance |
| Read API | Detail, stages, tracking, finance, images, activities |
| Action API | `POST /partial`, `POST /return`, `POST /return/confirm`, `GET /actions` |
| UI cần thấy | Khối giao và ý định hoàn. NVC chưa xác nhận nhận kiện hoàn nên chặng hoàn được UI dựng từ `remaining_action`; chặng hoàn thực tế nằm ở D2 |

### D1-05 — Batch và dữ liệu kỹ thuật

| Trường | Giá trị |
|---|---|
| Mã đơn | `9100000000005` và `9100000000006` |
| Trạng thái | `SPF-0101` — Đang tạo đơn NVC |
| NVC dự kiến | SuperShip ( `1` ) và BEST Express ( `6` ) |
| Waybill | Chưa có trên snapshot booking |
| DataSeed | `designer_1/005_batch_reliability.sql` |
| Bảng chính | `order_batches`, `batch_items`, `batch_item_attempts`, idempotency records, outbox events, request/step |
| Read API | Detail, actions, batch list/detail/results |
| Action API | Batch parse/validate/create, retry item, export boundary |
| UI cần thấy | Order được tạo từ batch nhưng booking NVC vẫn đang xử lý, không tự dựng waybill |

### D1-06 — NVC thật và phương thức lấy hàng

| Mã đơn | NVC / phương thức | Trạng thái | Waybill | Điểm cần kiểm thử |
|---|---|---|---|---|
| `9100000000007` | Viettel Post ( `4` ), NVC tới lấy ( `pickup_method=1` ) | `SPF-0301` | `SOO10902766013` | Có chặng `PICKUP -> DELIVERY`, không chỉ có block giao |
| `9100000000008` | Vietnam Post ( `13` ), shop mang ra bưu cục ( `pickup_method=2` ) | `SPF-0301` | `CC2199034123VN` | Chỉ delivery leg là đúng nghiệp vụ drop-off; không dựng pickup attempt giả |
| `9100000000009` | BEST Express ( `6` ), NVC tới lấy ( `pickup_method=1` ) | `SPF-0301` | `999800060099891` | Có sorting `OO012-00-003-02`, có chặng lấy đang chờ |

DataSeed: `designer_1/000_verified_carrier_contracts.sql` và
`007_direct_carrier_pickup_stage_repair.sql`. API: stages, stage detail,
tracking, waybills, shipper, actions, finance.

## 5. Kịch bản D2 — Lỗi, hủy, hỏa tốc, hoàn và đổi

| Mã đơn | Trạng thái cuối | Kịch bản nghiệp vụ | Dữ liệu DB chính | API chính |
|---|---|---|---|---|
| `9209190000001` | `SPF-0102` | NVC từ chối tạo Waybill | Request/step `CREATE_WAYBILL=FAILED`, error code; không có Waybill/transport attempt | Detail, actions, stages, activities, `POST /cancel` nếu đủ điều kiện |
| `9209190000002` | `SPF-0201` | Hủy lần đầu lỗi, retry thành công | Cancel request/steps, status history và terminal result | `POST /cancel`, `GET /actions`, activities |
| `9209190000003` | `SPF-0303` | Green SM không tìm được tài xế | Carrier `15`, allocation request/steps `SPF-0302 -> SPF-0303`; không có driver/waybill thật | Detail, stages, tracking, shipper, actions |
| `9209190000004` | `SPF-0901` | Lấy hàng, handover và giao hàng lỗi rồi retry thành công | Failed attempts cũ, retry request/targets, attempts mới, final result | `POST /retry`, stages, waybill history, tracking, shipper/shippers |
| `9209190000005` | `SPF-1201` | Hoàn hàng qua NVC/hub trung gian thành công | Pickup/delivery/return/final-return legs, return waybill, hub events, result | `POST /return`, `/return/confirm`, stages, tracking, finance |
| `9209190000006` | `SPF-1203` | Lấy hoàn và giao hoàn lỗi/retry, kết thúc hoàn một phần | Return attempts, retry, partial result item, compensation/settlement projection | `POST /retry`, `/partial`, `/return`, stages, finance |
| `9209190000007` | `SPF-1202` | Đổi hàng thành công sau điều chỉnh COD | Exchange request, adjustment, hàng cũ thu hồi, delivery leg thay thế | `POST /exchange`, stages, tracking, finance, activities |

### D2-08 — Hỏa tốc đang giao và đã giao

| Mã đơn | NVC | Trạng thái | Hành trình/tài xế | UI/API |
|---|---|---|---|---|
| `9209190000008` | Green SM Express ( `15` ) | `SPF-0801` — Đang giao hàng | Có pickup completed, delivery active, driver Trần Minh Khoa, vehicle ref `GSM-DRV-218` | Hiển thị NVC lấy/giao, driver và nút xem vị trí/hành trình |
| `9209190000009` | GrabExpress ( `16` ) | `SPF-0901` — Đã giao hàng | Pickup/delivery complete, driver Lê Quốc Bảo, vehicle ref `GRAB-DRV-509`, POD `POD-9209190000009-01` | Có POD, shipper history, finance và nút xem hành trình |

DataSeed: `008_instant_delivery_active_completed_coverage.sql` và
`005b_instant_driver_allocation_repair.sql`. Tracking history của hai mã trên
bao phủ `SPF-0302 -> SPF-0301 -> SPF-0401 -> SPF-0501 -> SPF-0801` và trường
hợp hoàn tất thêm `SPF-0901`.

## 6. Kịch bản UI current-status showcase

Các mã dưới đây được tạo riêng để mỗi trạng thái có một Order hiện tại cho UI.
`source` chung là `test_data/006_ui_current_status_showcase.sql`. Riêng các
timeline hỏa tốc chi tiết của `9209190000003`, `9209190000008` và
`9209190000009` được sửa/bổ sung bởi các fixture hỏa tốc tương ứng. Mỗi Order có tối thiểu
`orders`, sender/receiver, address, goods, measure, leg, waybill, tracking và
status history phù hợp; các trạng thái cần retry/return có thêm request,
attempt, handover hoặc result tương ứng.

| Mã đơn | Status | Ý nghĩa hiển thị |
|---|---|---|
| `9299999900004` | `SPF-0202` | Hủy đơn NVC lỗi |
| `9299999900006` | `SPF-0401` | Đang lấy hàng |
| `9299999900007` | `SPF-0402` | Lấy hàng thất bại |
| `9299999900008` | `SPF-0403` | Đang yêu cầu lấy lại |
| `9299999900009` | `SPF-0501` | Đã lấy hàng |
| `9299999900010` | `SPF-0502` | Đã nhập kho/bưu cục lấy |
| `9299999900011` | `SPF-0601` | Chờ bàn giao |
| `9299999900012` | `SPF-0602` | NVC giao đang nhận hàng |
| `9299999900013` | `SPF-0603` | Bàn giao thất bại |
| `9299999900014` | `SPF-0604` | Đang yêu cầu bàn giao lại |
| `9299999900015` | `SPF-0605` | NVC giao đã nhận hàng |
| `9299999900016` | `SPF-0606` | Đã nhập kho NVC giao |
| `9299999900017` | `SPF-0701` | Đang trung chuyển |
| `9299999900018` | `SPF-0702` | Đã đến kho/bưu cục giao |
| `9299999900019` | `SPF-0801` | Đang giao hàng |
| `9299999900020` | `SPF-0802` | Giao hàng thất bại |
| `9299999900021` | `SPF-0803` | Đang yêu cầu giao lại |
| `9299999900024` | `SPF-1001` | Chờ xác nhận chuyển hoàn |
| `9299999900025` | `SPF-1002` | Đã xác nhận chuyển hoàn |
| `9299999900026` | `SPF-1003` | Chờ lấy hàng hoàn |
| `9299999900027` | `SPF-1004` | Đang lấy hàng hoàn |
| `9299999900028` | `SPF-1005` | Lấy hàng hoàn thất bại |
| `9299999900029` | `SPF-1006` | Đang yêu cầu lấy lại hàng hoàn |
| `9299999900030` | `SPF-1007` | Đã lấy hàng hoàn |
| `9299999900031` | `SPF-1008` | Đã nhập kho NVC hoàn |
| `9299999900032` | `SPF-1009` | Đang chuyển hoàn |
| `9299999900033` | `SPF-1101` | Đã đến kho trả trung gian |
| `9299999900034` | `SPF-1102` | Đang trả cho NVC hoàn cuối |
| `9299999900035` | `SPF-1103` | Trả NVC hoàn cuối thất bại |
| `9299999900036` | `SPF-1104` | Đã trả cho NVC hoàn cuối |
| `9299999900037` | `SPF-1105` | Đã đến kho trả cuối |
| `9299999900038` | `SPF-1106` | Đang trả hàng |
| `9299999900039` | `SPF-1107` | Trả hàng thất bại |
| `9299999900040` | `SPF-1108` | Đang yêu cầu trả lại |
| `9299999900044` | `SPF-0302` | Đang tìm tài xế hỏa tốc |

API dùng cho toàn bộ UI showcase:

- `GET /v1/orders` và `POST /v1/orders/filter`: danh sách, phân trang, lọc trạng thái.
- `GET /v1/orders/{order_code}`: detail có receiver, goods, current stage và carrier.
- `GET /v1/orders/{order_code}/stages`: kiểm tra đủ block lấy/giao/hoàn.
- `GET /v1/orders/{order_code}/tracking`: kiểm tra timeline theo từng chặng.
- `GET /v1/orders/{order_code}/actions`: kiểm tra nút retry, return, cancel, change carrier.
- `GET /v1/orders/{order_code}/shipper` và `/shippers`: kiểm tra người phụ trách hiện tại/lịch sử.
- `GET /v1/orders/{order_code}/sla`, `/activities`, `/finance`, `/notes`, `/images`: kiểm tra các panel phụ trợ.

## 6.1. Evidence ảnh theo từng kịch bản

Phần này là format dành cho screenshot. Nội dung nghiệp vụ, DataSeed và API
chi tiết vẫn nằm ở mục 4, 5 và 6; tại đây chỉ gom vị trí ảnh để dễ chèn và
review từng Order trên UI/DBeaver.

### 9100000000001 — SPF-0101 — Đang tạo đơn NVC

**Thư mục evidence:** `./scenario_images/9100000000001/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9100000000001/ui-list.png)
![UI — chi tiết](./scenario_images/9100000000001/ui-detail.png)
![API — response](./scenario_images/9100000000001/api-response.png)
![DB — kiểm tra](./scenario_images/9100000000001/db-query.png)
![Tracking — hành trình](./scenario_images/9100000000001/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9100000000002 — SPF-0901 — GHN đã giao hàng

**Thư mục evidence:** `./scenario_images/9100000000002/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9100000000002/ui-list.png)
![UI — chi tiết](./scenario_images/9100000000002/ui-detail.png)
![API — response](./scenario_images/9100000000002/api-response.png)
![DB — kiểm tra](./scenario_images/9100000000002/db-query.png)
![Tracking — hành trình](./scenario_images/9100000000002/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9100000000003 — SPF-0901 — Bàn giao SuperShip sang J&T

**Thư mục evidence:** `./scenario_images/9100000000003/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9100000000003/ui-list.png)
![UI — chi tiết](./scenario_images/9100000000003/ui-detail.png)
![API — response](./scenario_images/9100000000003/api-response.png)
![DB — kiểm tra](./scenario_images/9100000000003/db-query.png)
![Tracking — hành trình](./scenario_images/9100000000003/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9100000000004 — SPF-0902 — SPX giao một phần, phát sinh hoàn

**Thư mục evidence:** `./scenario_images/9100000000004/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9100000000004/ui-list.png)
![UI — chi tiết](./scenario_images/9100000000004/ui-detail.png)
![API — response](./scenario_images/9100000000004/api-response.png)
![DB — kiểm tra](./scenario_images/9100000000004/db-query.png)
![Tracking — hành trình](./scenario_images/9100000000004/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9100000000005 — SPF-0101 — Batch, SuperShip đang tạo NVC

**Thư mục evidence:** `./scenario_images/9100000000005/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9100000000005/ui-list.png)
![UI — chi tiết](./scenario_images/9100000000005/ui-detail.png)
![API — response](./scenario_images/9100000000005/api-response.png)
![DB — kiểm tra](./scenario_images/9100000000005/db-query.png)
![Tracking — hành trình](./scenario_images/9100000000005/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9100000000006 — SPF-0101 — Batch, BEST Express đang tạo NVC

**Thư mục evidence:** `./scenario_images/9100000000006/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9100000000006/ui-list.png)
![UI — chi tiết](./scenario_images/9100000000006/ui-detail.png)
![API — response](./scenario_images/9100000000006/api-response.png)
![DB — kiểm tra](./scenario_images/9100000000006/db-query.png)
![Tracking — hành trình](./scenario_images/9100000000006/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9100000000007 — SPF-0301 — Viettel Post chờ lấy hàng

**Thư mục evidence:** `./scenario_images/9100000000007/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9100000000007/ui-list.png)
![UI — chi tiết](./scenario_images/9100000000007/ui-detail.png)
![API — response](./scenario_images/9100000000007/api-response.png)
![DB — kiểm tra](./scenario_images/9100000000007/db-query.png)
![Tracking — hành trình](./scenario_images/9100000000007/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9100000000008 — SPF-0301 — Vietnam Post, shop drop-off

**Thư mục evidence:** `./scenario_images/9100000000008/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9100000000008/ui-list.png)
![UI — chi tiết](./scenario_images/9100000000008/ui-detail.png)
![API — response](./scenario_images/9100000000008/api-response.png)
![DB — kiểm tra](./scenario_images/9100000000008/db-query.png)
![Tracking — hành trình](./scenario_images/9100000000008/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9100000000009 — SPF-0301 — BEST Express chờ lấy hàng

**Thư mục evidence:** `./scenario_images/9100000000009/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9100000000009/ui-list.png)
![UI — chi tiết](./scenario_images/9100000000009/ui-detail.png)
![API — response](./scenario_images/9100000000009/api-response.png)
![DB — kiểm tra](./scenario_images/9100000000009/db-query.png)
![Tracking — hành trình](./scenario_images/9100000000009/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9209190000001 — SPF-0102 — NVC từ chối tạo Waybill

**Thư mục evidence:** `./scenario_images/9209190000001/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9209190000001/ui-list.png)
![UI — chi tiết](./scenario_images/9209190000001/ui-detail.png)
![API — response](./scenario_images/9209190000001/api-response.png)
![DB — kiểm tra](./scenario_images/9209190000001/db-query.png)
![Tracking — hành trình](./scenario_images/9209190000001/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9209190000002 — SPF-0201 — Hủy thành công sau retry

**Thư mục evidence:** `./scenario_images/9209190000002/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9209190000002/ui-list.png)
![UI — chi tiết](./scenario_images/9209190000002/ui-detail.png)
![API — response](./scenario_images/9209190000002/api-response.png)
![DB — kiểm tra](./scenario_images/9209190000002/db-query.png)
![Tracking — hành trình](./scenario_images/9209190000002/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9209190000003 — SPF-0303 — Hỏa tốc không tìm được tài xế

**Thư mục evidence:** `./scenario_images/9209190000003/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9209190000003/ui-list.png)
![UI — chi tiết](./scenario_images/9209190000003/ui-detail.png)
![API — response](./scenario_images/9209190000003/api-response.png)
![DB — kiểm tra](./scenario_images/9209190000003/db-query.png)
![Tracking — hành trình](./scenario_images/9209190000003/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9209190000004 — SPF-0901 — Retry lấy/bàn giao/giao thành công

**Thư mục evidence:** `./scenario_images/9209190000004/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9209190000004/ui-list.png)
![UI — chi tiết](./scenario_images/9209190000004/ui-detail.png)
![API — response](./scenario_images/9209190000004/api-response.png)
![DB — kiểm tra](./scenario_images/9209190000004/db-query.png)
![Tracking — hành trình](./scenario_images/9209190000004/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9209190000005 — SPF-1201 — Hoàn qua hub trung gian

**Thư mục evidence:** `./scenario_images/9209190000005/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9209190000005/ui-list.png)
![UI — chi tiết](./scenario_images/9209190000005/ui-detail.png)
![API — response](./scenario_images/9209190000005/api-response.png)
![DB — kiểm tra](./scenario_images/9209190000005/db-query.png)
![Tracking — hành trình](./scenario_images/9209190000005/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9209190000006 — SPF-1203 — Hoàn một phần sau retry

**Thư mục evidence:** `./scenario_images/9209190000006/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9209190000006/ui-list.png)
![UI — chi tiết](./scenario_images/9209190000006/ui-detail.png)
![API — response](./scenario_images/9209190000006/api-response.png)
![DB — kiểm tra](./scenario_images/9209190000006/db-query.png)
![Tracking — hành trình](./scenario_images/9209190000006/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9209190000007 — SPF-1202 — Đổi hàng thành công

**Thư mục evidence:** `./scenario_images/9209190000007/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9209190000007/ui-list.png)
![UI — chi tiết](./scenario_images/9209190000007/ui-detail.png)
![API — response](./scenario_images/9209190000007/api-response.png)
![DB — kiểm tra](./scenario_images/9209190000007/db-query.png)
![Tracking — hành trình](./scenario_images/9209190000007/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9209190000008 — SPF-0801 — Green SM đang giao

**Thư mục evidence:** `./scenario_images/9209190000008/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9209190000008/ui-list.png)
![UI — chi tiết](./scenario_images/9209190000008/ui-detail.png)
![API — response](./scenario_images/9209190000008/api-response.png)
![DB — kiểm tra](./scenario_images/9209190000008/db-query.png)
![Tracking — hành trình](./scenario_images/9209190000008/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9209190000009 — SPF-0901 — GrabExpress đã giao

**Thư mục evidence:** `./scenario_images/9209190000009/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9209190000009/ui-list.png)
![UI — chi tiết](./scenario_images/9209190000009/ui-detail.png)
![API — response](./scenario_images/9209190000009/api-response.png)
![DB — kiểm tra](./scenario_images/9209190000009/db-query.png)
![Tracking — hành trình](./scenario_images/9209190000009/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900004 — SPF-0202 — Hủy đơn NVC lỗi

**Thư mục evidence:** `./scenario_images/9299999900004/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900004/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900004/ui-detail.png)
![API — response](./scenario_images/9299999900004/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900004/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900004/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900006 — SPF-0401 — Đang lấy hàng

**Thư mục evidence:** `./scenario_images/9299999900006/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900006/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900006/ui-detail.png)
![API — response](./scenario_images/9299999900006/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900006/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900006/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900007 — SPF-0402 — Lấy hàng thất bại

**Thư mục evidence:** `./scenario_images/9299999900007/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900007/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900007/ui-detail.png)
![API — response](./scenario_images/9299999900007/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900007/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900007/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900008 — SPF-0403 — Đang yêu cầu lấy lại

**Thư mục evidence:** `./scenario_images/9299999900008/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900008/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900008/ui-detail.png)
![API — response](./scenario_images/9299999900008/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900008/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900008/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900009 — SPF-0501 — Đã lấy hàng

**Thư mục evidence:** `./scenario_images/9299999900009/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900009/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900009/ui-detail.png)
![API — response](./scenario_images/9299999900009/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900009/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900009/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900010 — SPF-0502 — Đã nhập kho/bưu cục lấy

**Thư mục evidence:** `./scenario_images/9299999900010/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900010/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900010/ui-detail.png)
![API — response](./scenario_images/9299999900010/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900010/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900010/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900011 — SPF-0601 — Chờ bàn giao

**Thư mục evidence:** `./scenario_images/9299999900011/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900011/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900011/ui-detail.png)
![API — response](./scenario_images/9299999900011/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900011/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900011/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900012 — SPF-0602 — NVC giao đang nhận hàng

**Thư mục evidence:** `./scenario_images/9299999900012/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900012/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900012/ui-detail.png)
![API — response](./scenario_images/9299999900012/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900012/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900012/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900013 — SPF-0603 — Bàn giao thất bại

**Thư mục evidence:** `./scenario_images/9299999900013/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900013/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900013/ui-detail.png)
![API — response](./scenario_images/9299999900013/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900013/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900013/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900014 — SPF-0604 — Đang yêu cầu bàn giao lại

**Thư mục evidence:** `./scenario_images/9299999900014/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900014/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900014/ui-detail.png)
![API — response](./scenario_images/9299999900014/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900014/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900014/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900015 — SPF-0605 — NVC giao đã nhận hàng

**Thư mục evidence:** `./scenario_images/9299999900015/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900015/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900015/ui-detail.png)
![API — response](./scenario_images/9299999900015/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900015/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900015/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900016 — SPF-0606 — Đã nhập kho NVC giao

**Thư mục evidence:** `./scenario_images/9299999900016/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900016/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900016/ui-detail.png)
![API — response](./scenario_images/9299999900016/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900016/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900016/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900017 — SPF-0701 — Đang trung chuyển

**Thư mục evidence:** `./scenario_images/9299999900017/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900017/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900017/ui-detail.png)
![API — response](./scenario_images/9299999900017/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900017/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900017/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900018 — SPF-0702 — Đã đến kho/bưu cục giao

**Thư mục evidence:** `./scenario_images/9299999900018/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900018/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900018/ui-detail.png)
![API — response](./scenario_images/9299999900018/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900018/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900018/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900019 — SPF-0801 — Đang giao hàng

**Thư mục evidence:** `./scenario_images/9299999900019/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900019/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900019/ui-detail.png)
![API — response](./scenario_images/9299999900019/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900019/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900019/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900020 — SPF-0802 — Giao hàng thất bại

**Thư mục evidence:** `./scenario_images/9299999900020/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900020/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900020/ui-detail.png)
![API — response](./scenario_images/9299999900020/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900020/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900020/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900021 — SPF-0803 — Đang yêu cầu giao lại

**Thư mục evidence:** `./scenario_images/9299999900021/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900021/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900021/ui-detail.png)
![API — response](./scenario_images/9299999900021/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900021/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900021/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900024 — SPF-1001 — Chờ xác nhận chuyển hoàn

**Thư mục evidence:** `./scenario_images/9299999900024/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900024/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900024/ui-detail.png)
![API — response](./scenario_images/9299999900024/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900024/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900024/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900025 — SPF-1002 — Đã xác nhận chuyển hoàn

**Thư mục evidence:** `./scenario_images/9299999900025/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900025/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900025/ui-detail.png)
![API — response](./scenario_images/9299999900025/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900025/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900025/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900026 — SPF-1003 — Chờ lấy hàng hoàn

**Thư mục evidence:** `./scenario_images/9299999900026/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900026/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900026/ui-detail.png)
![API — response](./scenario_images/9299999900026/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900026/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900026/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900027 — SPF-1004 — Đang lấy hàng hoàn

**Thư mục evidence:** `./scenario_images/9299999900027/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900027/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900027/ui-detail.png)
![API — response](./scenario_images/9299999900027/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900027/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900027/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900028 — SPF-1005 — Lấy hàng hoàn thất bại

**Thư mục evidence:** `./scenario_images/9299999900028/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900028/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900028/ui-detail.png)
![API — response](./scenario_images/9299999900028/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900028/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900028/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900029 — SPF-1006 — Đang yêu cầu lấy lại hàng hoàn

**Thư mục evidence:** `./scenario_images/9299999900029/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900029/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900029/ui-detail.png)
![API — response](./scenario_images/9299999900029/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900029/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900029/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900030 — SPF-1007 — Đã lấy hàng hoàn

**Thư mục evidence:** `./scenario_images/9299999900030/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900030/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900030/ui-detail.png)
![API — response](./scenario_images/9299999900030/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900030/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900030/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900031 — SPF-1008 — Đã nhập kho NVC hoàn

**Thư mục evidence:** `./scenario_images/9299999900031/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900031/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900031/ui-detail.png)
![API — response](./scenario_images/9299999900031/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900031/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900031/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900032 — SPF-1009 — Đang chuyển hoàn

**Thư mục evidence:** `./scenario_images/9299999900032/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900032/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900032/ui-detail.png)
![API — response](./scenario_images/9299999900032/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900032/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900032/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900033 — SPF-1101 — Đã đến kho trả trung gian

**Thư mục evidence:** `./scenario_images/9299999900033/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900033/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900033/ui-detail.png)
![API — response](./scenario_images/9299999900033/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900033/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900033/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900034 — SPF-1102 — Đang trả cho NVC hoàn cuối

**Thư mục evidence:** `./scenario_images/9299999900034/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900034/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900034/ui-detail.png)
![API — response](./scenario_images/9299999900034/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900034/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900034/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900035 — SPF-1103 — Trả NVC hoàn cuối thất bại

**Thư mục evidence:** `./scenario_images/9299999900035/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900035/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900035/ui-detail.png)
![API — response](./scenario_images/9299999900035/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900035/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900035/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900036 — SPF-1104 — Đã trả cho NVC hoàn cuối

**Thư mục evidence:** `./scenario_images/9299999900036/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900036/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900036/ui-detail.png)
![API — response](./scenario_images/9299999900036/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900036/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900036/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900037 — SPF-1105 — Đã đến kho trả cuối

**Thư mục evidence:** `./scenario_images/9299999900037/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900037/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900037/ui-detail.png)
![API — response](./scenario_images/9299999900037/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900037/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900037/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900038 — SPF-1106 — Đang trả hàng

**Thư mục evidence:** `./scenario_images/9299999900038/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900038/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900038/ui-detail.png)
![API — response](./scenario_images/9299999900038/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900038/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900038/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900039 — SPF-1107 — Trả hàng thất bại

**Thư mục evidence:** `./scenario_images/9299999900039/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900039/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900039/ui-detail.png)
![API — response](./scenario_images/9299999900039/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900039/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900039/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900040 — SPF-1108 — Đang yêu cầu trả lại

**Thư mục evidence:** `./scenario_images/9299999900040/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900040/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900040/ui-detail.png)
![API — response](./scenario_images/9299999900040/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900040/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900040/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.


### 9299999900044 — SPF-0302 — Hỏa tốc đang tìm tài xế

**Thư mục evidence:** `./scenario_images/9299999900044/`

<details>
<summary>Ảnh minh họa</summary>

<!-- Đặt ảnh đúng tên rồi bỏ comment các dòng bên dưới.
![UI — danh sách](./scenario_images/9299999900044/ui-list.png)
![UI — chi tiết](./scenario_images/9299999900044/ui-detail.png)
![API — response](./scenario_images/9299999900044/api-response.png)
![DB — kiểm tra](./scenario_images/9299999900044/db-query.png)
![Tracking — hành trình](./scenario_images/9299999900044/tracking.png)
-->

</details>

**API đối chiếu:** dùng nhóm API ở mục 3; tối thiểu kiểm tra
`GET /v1/orders/{order_code}`, `GET /v1/orders/{order_code}/stages`,
`GET /v1/orders/{order_code}/tracking` và `GET /v1/orders/{order_code}/actions`.

## 7. Ma trận đủ 45 trạng thái Order

| Status | Order đại diện | Nhóm |
|---|---|---|
| `SPF-0101` | `9100000000001` | Booking đang tạo |
| `SPF-0102` | `9209190000001` | Booking lỗi |
| `SPF-0201` | `9209190000002` | Hủy thành công |
| `SPF-0202` | `9299999900004` | Hủy NVC lỗi |
| `SPF-0301` | `9100000000007` | Chờ lấy hàng |
| `SPF-0302` | `9299999900044` | Đang tìm tài xế |
| `SPF-0303` | `9209190000003` | Không tìm được tài xế |
| `SPF-0401` | `9299999900006` | Đang lấy hàng |
| `SPF-0402` | `9299999900007` | Lấy hàng thất bại |
| `SPF-0403` | `9299999900008` | Yêu cầu lấy lại |
| `SPF-0501` | `9299999900009` | Đã lấy hàng |
| `SPF-0502` | `9299999900010` | Kho lấy hàng |
| `SPF-0601`–`SPF-0606` | `9299999900011`–`9299999900016` | Bàn giao |
| `SPF-0701`–`SPF-0702` | `9299999900017`–`9299999900018` | Trung chuyển/kho giao |
| `SPF-0801`–`SPF-0803` | `9209190000008`, `9299999900019`–`9299999900021` | Giao hàng |
| `SPF-0901` | `9100000000002` | Giao thành công |
| `SPF-0902` | `9100000000004` | Giao một phần |
| `SPF-1001`–`SPF-1009` | `9299999900024`–`9299999900032` | Xác nhận/lấy/chuyển hoàn |
| `SPF-1101`–`SPF-1108` | `9299999900033`–`9299999900040` | Trả về NVC/shop |
| `SPF-1201` | `9209190000005` | Đã trả hàng |
| `SPF-1202` | `9209190000007` | Đổi trả thành công |
| `SPF-1203` | `9209190000006` | Đã trả một phần |

## 8. Coverage dữ liệu UI quan trọng

### 8.1. Người nhận và hàng hóa

Tất cả 53 Order đều có sender, receiver, pickup address, delivery address,
goods và measure. Các fixture hỏa tốc có thêm driver/vehicle khi đã phân tài
xế. Vì vậy UI không được fallback thành “Chưa có người nhận” hoặc “Chưa có
thông tin hàng hóa” khi gọi detail từ fixture này.

### 8.2. Block vận chuyển

- Đơn mạng lưới có `order_legs` theo đúng phương thức lấy hàng.
- `pickup_method=1`: có pickup leg và pickup attempt/event.
- `pickup_method=2`: shop drop-off; không dựng NVC pickup attempt giả.
- Multi-carrier có ít nhất hai block, mỗi block gắn đúng carrier/waybill.
- Return/exchange có các leg hoàn tương ứng, không chỉ đổi nhãn trạng thái Order.
- `9100000000004` là ngoại lệ nghiệp vụ có return intent nhưng chưa có return carrier confirmation; không dùng nó để đại diện cho luồng hoàn đã nhận kiện.

### 8.3. Sáu projection tài chính mới

| Trường | Nguồn nghiệp vụ | API đọc |
|---|---|---|
| `collected_amount` | Carrier webhook xác nhận đã thu người nhận | `/finance`, order detail |
| `cod_collection_status` | Tình trạng thu COD | `/finance`, filter |
| `settled_amount` | Finance xác nhận đã chuyển cho Shop | `/finance`, order detail |
| `cod_settlement_status` | Tình trạng đối soát/chuyển tiền | `/finance`, filter |
| `compensation_amount` | Finance phê duyệt bồi thường | `/finance`, order detail |
| `compensation_status` | Trạng thái bồi thường | `/finance`, order detail |

Coverage đầy đủ các status tài chính được ghi tại [COVERAGE.md](./COVERAGE.md).

## 9. Kiểm tra kết quả sau khi seed

~~~sql
SELECT COUNT(*) FROM order_mgmt.orders;
SELECT status_code, COUNT(*) FROM order_mgmt.orders GROUP BY status_code ORDER BY status_code;
SELECT order_code, stage_code, leg_type, stage_no, carrier_code, stage_status_code
FROM order_mgmt.orders o
JOIN order_mgmt.order_legs l USING (order_id)
ORDER BY o.order_code, l.stage_no;
~~~

Các kiểm tra bắt buộc:

- 37/37 bảng có dữ liệu hợp lệ.
- 45/45 status xuất hiện trong `order_status_history`.
- 45/45 status có ít nhất một Order ở trạng thái hiện tại.
- Current Order status trùng status history cuối.
- Receiver/goods/address có mặt trên mọi Order UI.
- `stage_code` theo quy luật `STG-{LEG_TYPE}-{TYPE_SEQUENCE_4_DIGITS}`.
- Waybill và sorting code không bị dùng lẫn.
- Hỏa tốc chỉ bật live driver journey sau khi đã `PICKED_UP`.
- Không có pickup leg giả cho Order `pickup_method=2`.
- Không có Waybill/transport attempt giả ở booking chưa thành công.

Validator đầy đủ: `validate_test_data.sql`. File tổng hợp chạy thành công phải
được kiểm tra trên database rỗng bằng `run_with_docker.sh`.

## 10. Các giới hạn cần nhớ

- Print label, file Excel, CAPTCHA/rate-limit public tracking, permission/Data Scope và HTTP error mapping cần integration test ở module sở hữu.
- Mã Green SM/GrabExpress là fixture thiết kế, không khẳng định mã Carrier Registry production.
- Mã vận đơn bổ sung ngoài danh sách Business cung cấp là deterministic test data; chỉ giữ format theo NVC, không phải vận đơn production.
- `ALL_DATASEED.sql` là nguồn chạy gộp; tài liệu này là ma trận đối chiếu, không thay thế SQL seed.

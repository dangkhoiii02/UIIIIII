# SuperShip - MODULE ORDER - DATABASE DICTIONARY

---

# THÔNG TIN TÀI LIỆU

## Thông tin chung

|Thuộc tính|Nội dung|
|---|---|
|Mã tài liệu|`DD-ORDER`|
|Tên tài liệu|Data Dictionary - Module Order|
|Module / Phạm vi|Order - SuperPlatform|
|Phiên bản|`0.25.0`|
|Trạng thái|Hoàn thành|
|Người phụ trách|Lê Phước Thắng|
|Người rà soát||
|Người phê duyệt||
|Cập nhật lần cuối|18/09/2026|

## Lịch sử thay đổi

Tài liệu áp dụng **Semantic Versioning 2.0.0** theo định dạng `MAJOR.MINOR.PATCH`:

- `MAJOR`: thay đổi không tương thích với baseline đã duyệt, như đổi ownership, loại bỏ/thay thế cấu trúc chính hoặc yêu cầu migration phá vỡ tương thích.
- `MINOR`: bổ sung nghiệp vụ, bảng/cột/constraint hoặc hoàn thiện thiết kế theo hướng tương thích với baseline hiện tại.
- `PATCH`: sửa lỗi tài liệu, diễn đạt, chính tả hoặc làm rõ nội dung mà không thay đổi mô hình dữ liệu.

|Version|Ngày|Thay đổi chính|Tác giả|
|---|---|---|---|
|**0.25.0**|18/09/2026|Chuyển ownership Print Job sang Print Module; loại `print_jobs` và `print_job_orders` khỏi Order Database, baseline còn 37 bảng.|Lê Phước Thắng|
|**0.24.0**|18/09/2026|Hoàn thiện invariant Handover giữa hai NVC khác nhau, uniqueness cặp Stage và kiểm tra Waybill thực tế của từng Attempt.|Lê Phước Thắng|
|**0.23.0**|18/09/2026|Gộp snapshot giá theo Stage vào `leg_services`; bỏ bảng `leg_quotes`, baseline còn 39 bảng.|Lê Phước Thắng|
|**0.22.0**|18/09/2026|Chuẩn hóa `source_module`/`module_code` theo shared module-code contract; File Service dùng namespace `PLATFORM_STORAGE`.|Lê Phước Thắng|
|**0.21.1**|18/09/2026|Viết lại Change Log ngắn gọn, dễ tra cứu; không thay đổi thiết kế database.|Lê Phước Thắng|
|**0.21.0**|18/09/2026|Tách lỗi Outbox còn retry (`RETRY_WAIT`) khỏi lỗi đã dừng retry (`DEAD_LETTER`); thêm thời điểm vào Dead Letter.|Lê Phước Thắng|
|**0.20.0**|18/09/2026|Chốt `order_results` là kết quả tổng hợp có phiên bản của toàn Order; phân biệt với Tracking Event và từng Transport Attempt.|Lê Phước Thắng|
|**0.19.0**|18/09/2026|Tách thứ tự Tracking thành thứ tự toàn Order và thứ tự trong từng Stage.|Lê Phước Thắng|
|**0.18.0**|18/09/2026|Bảo đảm mỗi Stage và vai trò chỉ có một người thực hiện hiện hành.|Lê Phước Thắng|
|**0.17.0**|18/09/2026|Cho phép ảnh tham chiếu đúng Stage, Waybill, Attempt và Result.|Lê Phước Thắng|
|**0.16.0**|18/09/2026|Chuyển trạng thái gốc hiện tại của NVC từ Stage về Waybill; Tracking Event tiếp tục giữ lịch sử.|Lê Phước Thắng|
|**0.15.0**|18/09/2026|Đơn giản hóa dữ liệu liên hệ: mỗi số điện thoại/email dùng một cột; masking thực hiện ở API.|Lê Phước Thắng|
|**0.14.0**|18/09/2026|Bổ sung mô hình khách hàng, nhánh vận chuyển và quyết định cấu hình đã áp dụng cho Order.|Lê Phước Thắng|
|**0.13.0**|18/09/2026|Bổ sung snapshot Access Context khi tạo Order: Identity, Membership, Actor, Application, Client và Correlation ID.|Lê Phước Thắng|
|**0.12.0**|18/09/2026|Đổi mã Tỉnh/Quận/Phường sang chuỗi để hỗ trợ cả mã hành chính cũ và mới.|Lê Phước Thắng|
|**0.11.0**|18/09/2026|Chuẩn hóa quy tắc datatype: tập nhỏ dùng số; tập từ sáu giá trị ổn định dùng named ENUM; business code mở rộng dùng chuỗi/reference.|Lê Phước Thắng|
|**0.10.1**|18/09/2026|Chuẩn hóa khối lượng theo gram nguyên và kích thước kiện theo centimet nguyên.|Lê Phước Thắng|
|**0.10.0**|18/09/2026|Hoàn tất rà soát 40 bảng; làm rõ Waybill bất đồng bộ, SLA, Batch, Idempotency và Outbox.|Lê Phước Thắng|
|**0.9.0**|18/09/2026|Chốt baseline 40 bảng; hoàn thiện Waybill snapshot, Batch, Print Job và boundary Finance/Integration.|Lê Phước Thắng|
|**0.8.0**|17/09/2026|Giảm baseline từ 46 xuống 41 bảng; chuẩn hóa Stage/Waybill, SLA, địa chỉ và boundary module.|Lê Phước Thắng|
|**0.7.0**|16/09/2026|Thiết lập baseline 46 bảng để đối chiếu với API Contract 1.2.0.|Lê Phước Thắng|
|**0.1.0–0.6.0**|16/09/2026|Các bản khởi tạo: xây dựng Order Core, item snapshot, history, Carrier/Waybill, endpoint và quote.|Lê Phước Thắng|

## Tài liệu tham chiếu

|Tài liệu|Mốc áp dụng|Vai trò|
|---|---|---|
|API Contract Module Order|`1.2.0` - 17/09/2026|Nguồn contract dữ liệu API hiện hành|
|Các điểm cần sửa trong Database - Module Order|`REV-DB-ORDER 1.2.0`|Nguồn reconcile responsibility/API/DB|
|Database Dictionary - Module Order|`0.7.0`|Baseline cũ để đối chiếu và bảo toàn các dữ liệu history/technical còn đúng|
|SAD / Domain Model / Use Case / Business Rule Module Order|Baseline Project|Nguồn ownership, snapshot, history, state và transaction boundary|

> **Baseline v0.25.0:** Database Order dùng schema `order_mgmt` và chốt **37 bảng vật lý**. Print Job, render và file kết quả thuộc Print Module; Order chỉ lưu Activity và external reference khi cần. Snapshot giá của Stage được lưu trong `leg_services`; Handover chỉ ghi nhận việc chuyển giao thực tế giữa hai Stage liền kề do hai NVC khác nhau thực hiện.

---

# 1. MỤC ĐÍCH VÀ PHẠM VI

## 1.1. Mục đích

Tài liệu định nghĩa dữ liệu **thực tế được lưu** trong Database của Module Order: Table, Column, kiểu dữ liệu, nullability, khóa, ràng buộc, index và ý nghĩa nghiệp vụ. Mục tiêu là để Backend, Database, QA và Architect có thể đọc cùng một tài liệu và triển khai thống nhất.

## 1.2. Phạm vi

- Schema PostgreSQL: `order_mgmt`.
- 37 bảng vật lý của Order Service.
- Current projection, snapshot, history, audit, batch, idempotency và transactional outbox thuộc ownership của Order.
- Reference logic sang User/Organization, Address, Product, Carrier, Pricing, Finance, File, Support/Claim và module ngoài khi cần.

## 1.3. Ngoài phạm vi

- Master Product/SKU/Inventory.
- Master Carrier, credential hoặc raw adapter payload của NVC.
- Lifecycle Ticket Support/Claim/Incident.
- Ledger, công nợ, đối soát và bút toán Finance.
- Inbound/outbound replay/sync của Integration & Webhook (`source_requests`, `source_syncs`).
- Binary file và signed URL của File Service.
- SQL migration hoàn chỉnh; migration phải được sinh từ Dictionary/DBDS đã duyệt.

---

# 2. QUY ƯỚC DATABASE

## 2.1. Quy ước kiểu dữ liệu

|Loại dữ liệu|Kiểu PostgreSQL|Quy tắc|
|---|---|---|
|ID nội bộ Order DB|`uuid`|Dùng cho PK/FK vật lý trong cùng schema.|
|Reference module khác|Theo datatype thực tế của domain nguồn|Không ép mọi reference về `varchar`; ví dụ Shop ID có thể là `uuid`, Carrier Code là `integer`, Pricing/Client/Application code là `varchar`. Không tạo cross-service FK vật lý.|
|Carrier Code|`integer`|Mã số từ Carrier Registry.|
|Tập giá trị đóng nhỏ, tối đa 5 lựa chọn|`smallint`|Dùng mã số từ `1`, có `CHECK` và mô tả mapping ngay tại cột. Có thể dùng `0` riêng cho trạng thái chưa có kết quả khi contract yêu cầu.|
|Tập giá trị đóng lớn, từ 6 lựa chọn|PostgreSQL named `ENUM`|Tên value phải tự mô tả; chỉ dùng khi tập giá trị ổn định và thuộc ownership Order.|
|Business code|`varchar(n)`|Ví dụ `order_code`, `stage_code`, `request_code`, `carrier_waybill_code`.|
|Tiền VND|`bigint`|Số nguyên VND, không lưu số lẻ.|
|Khối lượng gram|`integer`|Số nguyên gram trong phạm vi kiện hàng Order.|
|Kích thước kiện cm|`integer`|Lưu số centimet nguyên dương; API và adapter phải chuẩn hóa về cm trước khi ghi.|
|Ngày SLA|`numeric(6,2)`|Hỗ trợ giá trị như `0.5` ngày.|
|Tọa độ|`numeric(10,7)`|WGS84.|
|Version counter nội bộ đã rà soát|`integer`|Bắt đầu từ `1`, tăng dần; không dùng `bigint` nếu miền giá trị thực tế không cần.|
|Timestamp|`timestamptz`|Lưu time zone đầy đủ.|
|IP|`inet`|PostgreSQL native type.|
|Dữ liệu biến đổi có kiểm soát|`jsonb`|Chỉ dùng cho audit envelope/payload/response có schema version hoặc cấu trúc thực sự biến đổi.|
|Danh sách enum đóng nhỏ|`smallint[]`|Dùng khi dữ liệu là tập code nhỏ, không có lifecycle riêng, ví dụ `orders.service_codes`, `order_goods.tag_codes`.|

### 2.1.1. Named ENUM thuộc Order schema

|ENUM type|Giá trị|
|---|---|
|`order_created_channel`|`WEB`, `MOBILE`, `PARTNER_API`, `INTERNAL`, `BATCH`, `SYSTEM`|
|`request_target_type`|`PARTY`, `ADDRESS`, `GOODS`, `LEG`, `WAYBILL`, `ATTEMPT`, `HANDOVER`, `EXTERNAL_REF`|
|`request_step_status`|`PENDING`, `PROCESSING`, `SUCCESS`, `FAILED`, `UNKNOWN`, `CANCELLED`|
|`activity_actor_type`|`SHOP`, `INTERNAL`, `SYSTEM`, `CARRIER`, `SHIPPER`, `INTEGRATION_APP`|
|`activity_source_type`|`WEB`, `APP`, `INTEGRATION_API`, `CARRIER_WEBHOOK`, `SYSTEM_PROCESS`, `INTERNAL_TOOL`|
|`order_image_type`|`GOODS`, `PICKUP`, `DELIVERY`, `RETURN`, `DAMAGE_INCIDENT`, `OTHER`|
|`waybill_sla_result`|`WITHIN_DUE`, `OVERDUE`, `COMPLETED_ON_TIME`, `COMPLETED_LATE`, `REFERENCE_ONLY`, `NOT_APPLICABLE`|

Không dùng PostgreSQL ENUM cho mã có thể mở rộng theo cấu hình/tích hợp như `request_type`, `step_type`, `event_type`, `adjustment_type`, `ref_type`, `resource_type`, `aggregate_type`, status code chuẩn hoặc raw code của NVC. Các trường này tiếp tục dùng business code hoặc bảng tham chiếu.

## 2.2. Quy ước khóa và ownership

- FK vật lý chỉ tạo giữa các bảng thuộc `order_mgmt`.
- Dữ liệu module khác dùng `REF` logic, không cross-database FK.
- Business history không dùng `ON DELETE CASCADE`; baseline mặc định `RESTRICT` và không hard-delete Order.
- Snapshot/history không cập nhật ngược từ master data hiện tại.
- `created_at`, `updated_at`, `occurred_at`, `received_at`, `valid_from`, `valid_to` phải giữ đúng nghĩa; không dùng một timestamp cho nhiều ý nghĩa.

## 2.3. Shared Module-Code Contract

Các cột `source_module` và `module_code` dùng `varchar(40)` nhưng không nhận chuỗi tùy ý. Backend phải kiểm tra giá trị theo shared module-code contract của SuperPlatform.

|Mã|Module / Namespace|
|---|---|
|`USR`|User / Identity / Organization|
|`ADR`|Address|
|`PRD`|Product|
|`CAR`|Carrier|
|`SHP`|Shipping Configuration|
|`PRC`|Pricing|
|`ORD`|Order|
|`RTG`|Rating|
|`CFG`|Configuration dùng chung|
|`INT`|Integration & Webhook|
|`NTF`|Notification|
|`SUP`|Support|
|`CLM`|Claim|
|`FIN`|Finance / COD / Reconciliation|
|`RPT`|Reporting / Search Read Model|
|`PRT`|Print|
|`PLATFORM_STORAGE`|Năng lực lưu file/binary dùng chung; không phải business module|
|`PLATFORM_SECURITY`|Năng lực bảo mật/xác thực dùng chung; không phải business module|
|`PLATFORM_AUDIT`|Năng lực audit dùng chung; không phải business module|

Quy tắc:

- Không dùng PostgreSQL ENUM hoặc CHECK hard-code danh sách này trong Order DB vì module/namespace có thể được bổ sung.
- Không lưu tên hiển thị như `File Service`, `Carrier Registry`, `SLA Module` vào cột module code.
- Mã mới phải được thêm vào shared contract trước khi Order ghi dữ liệu; không tự phát minh code trong từng workflow.
- `source_module` cho biết nguồn authoritative/phát sinh dữ liệu; `module_code` trong `external_refs` cho biết module sở hữu đối tượng được tham chiếu.

## 2.4. Các cấu trúc đã loại khỏi baseline 0.25.0

|Bảng cũ|Xử lý mới|Lý do|
|---|---|---|
|`goods_features`|Bỏ; dùng `order_goods.tag_codes`|Tag là danh mục đóng nhỏ, không có lifecycle riêng|
|`order_services`|Bỏ; dùng `orders.service_codes`|Dịch vụ bổ sung là tập code đóng nhỏ ở cấp Order, không cần lifecycle/relation riêng|
|`note_links`|Bỏ|Order Note hiện thuộc cấp toàn Order|
|`order_files`|Thay bằng `order_images`|API baseline chỉ quản lý ảnh Order; binary thuộc File Service|
|`file_links`|Bỏ khỏi baseline|Ảnh chỉ giữ Waybill/NVC context cần thiết; không cần relation generic|
|`leg_quotes`|Bỏ; chuyển snapshot giá đã áp dụng vào `leg_services`|Không lưu nhiều quote ứng viên và không có lifecycle quote độc lập; ETA cam kết nằm tại `waybill_slas`|
|`label_templates`, `label_versions`, `label_prints`|Chuyển sang Print Module|Print Module sở hữu cấu hình nhãn, render và lịch sử in|
|`print_jobs`, `print_job_orders`|Chuyển sang Print Module|Print Module sở hữu toàn bộ lifecycle Print Job và file kết quả; Order chỉ giữ Activity/external reference khi cần|
|`source_requests`|Chuyển ownership sang Integration & Webhook|Inbound replay/dedupe integration không thuộc Order business DB|
|`source_syncs`|Chuyển ownership sang Integration & Webhook|Outbound sync/retry không thuộc Order business DB|
|`financial_components`|Bỏ khỏi Order Database|Finance/Reconciliation sở hữu dữ liệu thu hộ, đối soát, bồi thường và giá vốn; API Order đọc dữ liệu hiện hành từ module sở hữu, không duy trì local finance projection|

---

# 3. TỔNG QUAN DATABASE

## 3.1. Schema

|Schema|Module|Mục đích|
|---|---|---|
|`order_mgmt`|Order|OLTP cho Order lifecycle, Stage/Waybill/Journey, Request/Result, history, audit và dữ liệu kỹ thuật thuộc ownership Order|

## 3.2. Danh sách 37 Table

|#|Table|Đối tượng|Nhóm|Mục đích|
|---|---|---|---|---|
|1|`order_statuses`|Trạng thái chuẩn của Order|`REFERENCE`|Danh mục trạng thái SPF mà Module Order sử dụng.|
|2|`orders`|Đơn hàng|`CORE`|Lưu định danh, current projection, nguồn tạo và các thuộc tính nghiệp vụ cấp Order.|
|3|`order_addresses`|Snapshot địa chỉ của Order|`HISTORY`|Lưu lịch sử địa chỉ đã áp dụng; hỗ trợ địa chỉ hành chính 3 cấp và 2 cấp.|
|4|`order_parties`|Snapshot người gửi/người nhận|`HISTORY`|Lưu thông tin liên hệ đã áp dụng tại từng thời điểm.|
|5|`order_goods`|Snapshot khai báo hàng hóa|`HISTORY`|Lưu từng phiên bản khai báo hàng hóa/kiện đã áp dụng cho Order.|
|6|`order_items`|Dòng sản phẩm của snapshot hàng hóa|`CORE/HISTORY`|Lưu snapshot tối thiểu của item; Product Module vẫn sở hữu master Product.|
|7|`parcel_measures`|Lịch sử cân/đo kiện|`HISTORY`|Lưu khối lượng/kích thước khai báo hoặc thực tế; mỗi lần đo hợp lệ là một record riêng.|
|8|`order_legs`|Chặng/Stage vận chuyển|`CORE`|Lưu danh sách Stage của Order; một Order có thể có nhiều Stage cùng `leg_type`.|
|9|`leg_endpoints`|Điểm đầu/cuối của Stage|`HISTORY`|Lưu snapshot endpoint theo từng phiên bản kế hoạch vận chuyển.|
|10|`leg_items`|Phạm vi item của Stage|`RELATION`|Lưu item và số lượng thuộc một Stage khi nghiệp vụ tách hàng theo chặng.|
|11|`leg_services`|Dịch vụ và giá đã áp dụng cho Stage|`HISTORY`|Lưu snapshot service/account/mode/policy và giá thực tế áp dụng cho Stage.|
|12|`waybills`|Carrier Waybill|`CORE`|Lưu Waybill do NVC cấp và reference đúng snapshot đã dùng khi tạo vận đơn.|
|13|`leg_waybills`|Lịch sử gắn Stage - Waybill|`HISTORY`|Lưu thời gian một Waybill được dùng cho Stage; một Waybill có thể phục vụ nhiều Stage.|
|14|`tracking_events`|Sự kiện hành trình|`HISTORY`|Lưu event vận chuyển lịch sử; tách biệt current Order/Stage status.|
|15|`transport_attempts`|Transport Attempt|`HISTORY`|Lưu từng lần thực tế thực hiện lấy/giao/hoàn/trả.|
|16|`handovers`|Bàn giao giữa NVC/Stage|`CORE`|Lưu một quá trình bàn giao kiện giữa hai Stage/NVC liền kề.|
|17|`handover_attempts`|Lượt bàn giao thực tế|`HISTORY`|Lưu từng lần thử bàn giao, không ghi đè Attempt cũ.|
|18|`operational_assignments`|Phân công người thực hiện/phương tiện|`HISTORY`|Lưu lịch sử shipper/nhân sự và phương tiện phụ trách Stage.|
|19|`order_results`|Kết quả vận chuyển thực tế|`HISTORY`|Lưu business result độc lập với Order Status và Tracking.|
|20|`result_items`|Chi tiết item của kết quả thực tế|`RELATION`|Lưu item/quantity thực tế của business result.|
|21|`order_status_history`|Lịch sử trạng thái toàn Order|`HISTORY`|Lưu từng lần Order Status có hiệu lực.|
|22|`order_requests`|Business request của Order|`CORE`|Lưu yêu cầu nghiệp vụ thuộc Order.|
|23|`request_targets`|Target của business request|`RELATION`|Lưu đối tượng cụ thể mà request tác động.|
|24|`request_items`|Item scope của business request|`RELATION`|Lưu item/quantity được yêu cầu cho nghiệp vụ item-level.|
|25|`request_steps`|Bước xử lý durable của request|`CORE/TECHNICAL`|Lưu các bước cần retry/tra soát độc lập của request nhiều bước.|
|26|`order_adjustments`|Thay đổi đã áp dụng|`HISTORY`|Lưu before/after của thay đổi business đã thực tế áp dụng.|
|27|`order_notes`|Ghi chú Order|`AUDIT`|Lưu ghi chú cộng tác cấp toàn Order.|
|28|`activity_logs`|Activity Log của Order|`AUDIT`|Timeline/audit thao tác; tách biệt Tracking Event.|
|29|`order_images`|Ảnh nghiệp vụ của Order|`CORE/HISTORY`|Lưu metadata/reference ảnh; binary thuộc File Service.|
|30|`external_refs`|Reference sang module ngoài|`RELATION`|Lưu tham chiếu tới các object ngoài Order mà Order không sở hữu.|
|31|`order_batches`|Batch tạo Order hàng loạt|`CORE`|Lưu một lô tạo Order sau parse/validate.|
|32|`batch_items`|Dòng xử lý trong Batch|`TECHNICAL`|Lưu dữ liệu đầu vào đã validate và current result của từng dòng.|
|33|`batch_item_attempts`|Lịch sử retry Batch Item|`HISTORY`|Lưu từng lần worker xử lý một Batch Item.|
|34|`order_slas`|SLA toàn Order|`CORE/PROJECTION`|Lưu snapshot SLA SuperPlatform cam kết với Shop trên toàn Order.|
|35|`waybill_slas`|SLA NVC theo Waybill|`CORE/PROJECTION`|Lưu SLA/đối chiếu giữa NVC và SuperPlatform theo Carrier Waybill.|
|36|`idempotency_records`|Idempotency API/Command|`TECHNICAL`|Chống cùng request hợp lệ tạo business effect trùng.|
|37|`outbox_events`|Transactional Outbox|`TECHNICAL`|Lưu event cần phát sau commit để state và event được ghi atomically.|

---

# 4. ĐẶC TẢ TỪNG TABLE

## 4.1. `order_statuses`

**Mục đích:** Danh mục trạng thái SPF mà Module Order sử dụng.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`status_code`|`varchar(20), PK, not null`|Mã trạng thái chuẩn của SuperPlatform, ví dụ `SPF-0301`.|
|`status_name`|`varchar(120), not null`|Tên tiếng Việt dùng để hiển thị.|
|`status_group`|`varchar(40), not null`|Nhóm trạng thái phục vụ lọc và trình bày.|
|`sort_no`|`integer, not null`|Thứ tự trình bày.|
|`is_terminal`|`boolean, not null, default false`|Đánh dấu trạng thái kết thúc vòng đời vận chuyển chính.|
|`is_active`|`boolean, not null, default true`|Cho biết mã còn được dùng cho dữ liệu mới.|
|`description`|`text, nullable`|Mô tả thêm khi tên trạng thái chưa đủ rõ.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm tạo bản ghi danh mục.|
|`updated_at`|`timestamptz, not null, default now()`|Thời điểm cập nhật gần nhất.|

### Ràng buộc chính

- `sort_no >= 0`.

### Chỉ mục chính

- `idx_order_statuses_group_active (status_group, is_active, sort_no)`.

---

## 4.2. `orders`

**Mục đích:** Lưu định danh, current projection, nguồn tạo và các thuộc tính nghiệp vụ cấp Order.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`order_id`|`uuid, PK, not null`|ID nội bộ của Order.|
|`order_code`|`varchar(13), not null, UK`|Mã Order SuperPlatform, đúng 13 chữ số.|
|`shop_id`|`uuid, not null, REF -> Shop`|Shop sở hữu Order và là căn cứ Data Scope.|
|`soc`|`varchar(100), nullable`|Mã đơn riêng của Shop/hệ thống nguồn để đối chiếu.|
|`status_code`|`varchar(20), not null, FK -> order_statuses.status_code`|Trạng thái hiện tại của toàn Order.|
|`current_leg_id`|`uuid, nullable, FK -> order_legs.leg_id`|Stage hiện hành khi Order đang trong hành trình.|
|`custodian_carrier_code`|`integer, nullable, REF -> Carrier Registry`|NVC hiện được ghi nhận giữ kiện; không suy ra chỉ từ Stage.|
|`customer_model`|`smallint, not null`|Mô hình khách hàng áp dụng khi lập kế hoạch: `1` — địa phương cũ; `2` — địa phương mới; `3` — toàn quốc; `4` — SuperAI.|
|`transport_model`|`smallint, not null`|Nhánh vận chuyển đã quyết định: `1` — SuperShip lấy và giao toàn trình; `2` — SuperShip lấy rồi bàn giao NVC khác giao; `3` — NVC toàn quốc trực tiếp lấy và giao; `4` — SuperAI chọn NVC theo từng Order.|
|`selection_mode`|`smallint, not null`|Phương thức chọn NVC: `1` — cấu hình cố định/ưu tiên; `2` — hệ thống hoặc SuperAI tự động tối ưu; `3` — người dùng chọn thủ công theo quyền cấu hình.|
|`shipping_config_ref`|`varchar(150), nullable, REF -> Shipping Configuration`|Reference cấu hình Shop/Application đã được dùng để lập kế hoạch; đi cùng `shipping_config_version`.|
|`shipping_config_version`|`varchar(50), nullable`|Phiên bản opaque của cấu hình đã áp dụng; không giả định nguồn dùng version số.|
|`configuration_decision_ref`|`varchar(150), not null, REF -> Shipping Configuration Decision`|Reference quyết định cấu hình đã xác định mô hình khách hàng, nhánh vận chuyển và cách chọn NVC cho Order.|
|`pricing_code`|`varchar(64), not null, REF -> Pricing`|Mã/phương án Pricing đã áp dụng cho Order.|
|`cod_amount`|`bigint, not null, default 0`|COD yêu cầu thu, đơn vị VND.|
|`inspection_type`|`smallint, not null`|1 không xem; 2 xem không thử; 3 được thử khi dịch vụ hỗ trợ.|
|`fee_payer`|`smallint, not null`|1 Shop/người gửi trả phí; 2 người nhận trả phí.|
|`pickup_method`|`smallint, not null`|1 NVC đến lấy; 2 Shop mang tới điểm tiếp nhận.|
|`service_codes`|`smallint[], not null, default '{}'`|Dịch vụ bổ sung cấp Order: 1 giao một phần; 2 giao hàng mới kết hợp thu hồi hàng cũ.|
|`pickup_scheduled_from`|`timestamptz, nullable`|Bắt đầu khung lấy hàng mong muốn ở cấp Order.|
|`pickup_scheduled_to`|`timestamptz, nullable`|Kết thúc khung lấy hàng mong muốn ở cấp Order.|
|`delivery_note`|`varchar(120), nullable`|Hướng dẫn giao hàng gửi NVC; khác Order Note.|
|`delivery_result`|`smallint, not null, default 0`|0 chưa có kết quả cuối; 1 giao toàn bộ; 2 giao một phần; 3 giao thất bại.|
|`exchange_result`|`smallint, not null, default 0`|0 không áp dụng/chưa có; 1 thành công; 2 một phần; 3 thất bại.|
|`created_by_identity_id`|`varchar(100), nullable, REF -> User Module Identity`|Identity đã tạo Order; được để `NULL` khi Actor là Service Account hoặc tiến trình System hợp lệ.|
|`created_by_membership_id`|`varchar(100), nullable, REF -> User Module Membership`|Membership mà Identity đang sử dụng khi tạo Order; được để `NULL` với Partner Application, Service Account hoặc System không có Membership.|
|`created_actor_type`|`smallint, not null`|Loại Actor tạo Order: `1` — USER; `2` — PARTNER_APPLICATION; `3` — SERVICE_ACCOUNT; `4` — SYSTEM.|
|`created_actor_ref`|`varchar(100), not null`|Reference ổn định của Actor thực tế tạo Order; là Identity, Partner Application, Service Account hoặc System process tương ứng với `created_actor_type`.|
|`created_actor_name`|`varchar(200), not null`|Tên hiển thị snapshot của Actor tại thời điểm tạo; không đọc ngược từ hồ sơ hiện tại để sửa lịch sử.|
|`created_application_id`|`varchar(100), not null, REF -> User Module Application`|Application phát sinh Order, dùng đúng identifier do User Module/Application Registry cung cấp.|
|`created_client_id`|`varchar(100), not null, REF -> User Module Client`|Client thực tế gửi request, dùng đúng identifier do User Module/Client Registry cung cấp.|
|`created_channel`|`order_created_channel, not null`|Kênh tạo Order do Backend suy ra từ Client Registry.|
|`correlation_id`|`varchar(100), not null`|Mã truy vết request tạo Order xuyên các module.|
|`version_no`|`integer, not null, default 1`|Version optimistic locking của current Order projection.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm tạo Order.|
|`updated_at`|`timestamptz, not null, default now()`|Thời điểm current projection được cập nhật gần nhất.|
|`updated_by`|`varchar(100), nullable`|Actor/hệ thống cập nhật current projection gần nhất.|

### Ràng buộc chính

- `order_code ~ '^[0-9]{13}$'`.
- `cod_amount >= 0`.
- `inspection_type IN (1,2,3)`; `fee_payer IN (1,2)`; `pickup_method IN (1,2)`.
- `service_codes <@ ARRAY[1,2]::smallint[]`; không chứa phần tử `NULL`; Backend chuẩn hóa không lặp code.
- `customer_model IN (1,2,3,4)`; `transport_model IN (1,2,3,4)`; `selection_mode IN (1,2,3)`.
- `shipping_config_ref` và `shipping_config_version` phải cùng có giá trị hoặc cùng `NULL`; khi có không được là chuỗi rỗng.
- `configuration_decision_ref` không được là chuỗi rỗng.
- `selection_mode = 3` chỉ hợp lệ khi Access Context/Application/Shop được Shipping Configuration cho phép chọn NVC thủ công; Carrier được chọn vẫn phải qua kiểm tra khả năng phục vụ.
- `created_actor_type IN (1,2,3,4)`.
- `created_actor_type = 1` yêu cầu `created_by_identity_id IS NOT NULL`; các Actor không phải USER không bị bắt buộc có Identity hoặc Membership.
- `created_by_membership_id` khi có phải thuộc `created_by_identity_id` và đúng Shop/ngữ cảnh ủy quyền đã được Gateway/User Module xác thực tại thời điểm tạo.
- `created_actor_ref`, `created_actor_name`, `created_application_id`, `created_client_id` và `correlation_id` không được là chuỗi rỗng.
- `delivery_result IN (0,1,2,3)`; `exchange_result IN (0,1,2,3)`.
- `version_no > 0`.
- Nếu cả hai mốc pickup schedule có giá trị thì `pickup_scheduled_to >= pickup_scheduled_from`.
- `current_leg_id` nếu có phải thuộc cùng `order_id`; enforce bằng composite FK sau khi tạo `order_legs`.

### Chỉ mục chính

- `uq_orders_order_code (order_code)`.
- `idx_orders_shop_created (shop_id, created_at DESC)`.
- `idx_orders_shop_status (shop_id, status_code, updated_at DESC)`.
- `idx_orders_soc (shop_id, soc) WHERE soc IS NOT NULL`.
- `idx_orders_current_leg (current_leg_id) WHERE current_leg_id IS NOT NULL`.
- `idx_orders_transport_model (customer_model, transport_model, selection_mode, created_at DESC)`.
- `idx_orders_configuration_decision (configuration_decision_ref)`.
- `idx_orders_created_identity (created_by_identity_id, created_at DESC) WHERE created_by_identity_id IS NOT NULL`.
- `idx_orders_created_membership (created_by_membership_id, created_at DESC) WHERE created_by_membership_id IS NOT NULL`.
- `idx_orders_correlation (correlation_id)`.

### Ghi chú

- Không còn bảng `order_services`; `{}` biểu diễn Order không dùng dịch vụ bổ sung.
- `service_codes` là dịch vụ bổ sung cấp Order; khác `leg_services.service_code` là dịch vụ vận chuyển thực tế của Stage.
- `delivery_result` và `exchange_result` là current projection; business fact/history chi tiết nằm ở `order_results`.
- `customer_model`, `transport_model`, `selection_mode` và các reference cấu hình là snapshot quyết định tại thời điểm tạo Order; không cập nhật ngược khi cấu hình Shop/Application thay đổi.
- Không suy luận ngược mô hình khách hàng hoặc quyết định vận chuyển từ số lượng/loại Stage và Waybill. Stage/Waybill là dữ liệu thực thi; trường hợp hai Waybill được tạo song song phải được giải thích bởi Configuration Decision và workflow/request tương ứng.
- Không sao chép User/Application/Client master; chỉ giữ logical reference và tên Actor snapshot cần truy vết.
- `created_actor_ref` là reference thống nhất cho mọi loại Actor; không dùng nó thay cho `created_by_identity_id` hoặc `created_by_membership_id` khi Actor là USER.
- Các trường Access Context do Backend lấy từ trusted context của Gateway/User Module, không nhận từ Request Body của Consumer.

## 4.3. `order_addresses`

**Mục đích:** Lưu lịch sử địa chỉ đã áp dụng cho Order; hỗ trợ mô hình hành chính 3 cấp và 2 cấp.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`address_id`|`uuid, PK, not null`|ID của một phiên bản địa chỉ.|
|`order_id`|`uuid, not null, FK -> orders.order_id`|Order sở hữu snapshot.|
|`address_type`|`smallint, not null`|1 lấy hàng; 2 giao hàng; 3 hoàn/trả về.|
|`address_model`|`smallint, not null`|1 địa chỉ 3 cấp; 2 địa chỉ 2 cấp.|
|`source_type`|`smallint, not null`|Nguồn snapshot: 1 request trực tiếp; 2 Shipping Configuration; 3 vận hành điều chỉnh.|
|`source_code`|`varchar(100), nullable`|Mã điểm/kho/địa chỉ tại nguồn khi có.|
|`source_name`|`varchar(200), nullable`|Tên snapshot của điểm/kho nguồn khi có.|
|`address_detail`|`varchar(500), not null`|Số nhà, đường, tòa nhà hoặc phần địa chỉ chi tiết.|
|`full_address`|`varchar(1000), not null`|Địa chỉ đầy đủ snapshot để hiển thị/tra soát.|
|`province_code`|`varchar(20), not null, REF -> Address`|Mã Tỉnh/Thành phố; hỗ trợ mã cũ dạng chuỗi số và mã hai cấp mới như `P01`.|
|`district_code`|`varchar(20), nullable, REF -> Address`|Mã Quận/Huyện; chỉ có với mô hình 3 cấp.|
|`commune_code`|`varchar(20), not null, REF -> Address`|Mã Phường/Xã.|
|`latitude`|`numeric(10,7), nullable`|Vĩ độ WGS84.|
|`longitude`|`numeric(10,7), nullable`|Kinh độ WGS84.|
|`valid_from`|`timestamptz, not null`|Thời điểm snapshot bắt đầu có hiệu lực.|
|`valid_to`|`timestamptz, nullable`|Thời điểm hết hiệu lực; `null` là bản hiện hành.|
|`version_no`|`integer, not null`|Phiên bản tăng dần theo `order_id + address_type`.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm ghi snapshot.|
|`created_by`|`varchar(100), nullable`|Actor/hệ thống tạo snapshot.|

### Ràng buộc chính

- `address_type IN (1,2,3)`; `source_type IN (1,2,3)`; `address_model IN (1,2)`.
- `province_code`, `district_code`, `commune_code` khi có giá trị không được là chuỗi rỗng.
- `address_model = 1` yêu cầu `district_code IS NOT NULL`; `address_model = 2` yêu cầu `district_code IS NULL`.
- `latitude` và `longitude` phải cùng có hoặc cùng `NULL`; latitude `[-90,90]`, longitude `[-180,180]`.
- `valid_to IS NULL OR valid_to >= valid_from`; `version_no > 0`.
- `UNIQUE (order_id, address_type, version_no)`.
- `UNIQUE (order_id, address_id)` để child table có thể composite FK cùng Order.
- Partial `UNIQUE (order_id, address_type) WHERE valid_to IS NULL`.

### Chỉ mục chính

- `idx_order_addresses_order_type_current (order_id, address_type, valid_to)`.
- `idx_order_addresses_source (source_type, source_code) WHERE source_code IS NOT NULL`.
- `idx_order_addresses_area (province_code, district_code, commune_code) WHERE valid_to IS NULL`.

### Ghi chú

- `source_code/source_name` giữ lineage tới điểm/kho nguồn; các cột địa chỉ là snapshot thực tế đã áp dụng.
- Không lưu `carrier_code` trên address snapshot.

## 4.4. `order_parties`

**Mục đích:** Lưu thông tin liên hệ đã áp dụng tại từng thời điểm, không phụ thuộc master hiện tại.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`party_id`|`uuid, PK, not null`|ID snapshot chủ thể.|
|`order_id`|`uuid, not null, FK -> orders.order_id`|Order sở hữu snapshot.|
|`party_type`|`smallint, not null`|Vai trò: 1 người gửi; 2 người nhận; 3 người nhận hoàn/trả.|
|`name`|`varchar(200), not null`|Tên chủ thể/người nhận hiển thị.|
|`contact_name`|`varchar(200), nullable`|Tên người liên hệ khi khác `name`.|
|`phone`|`varchar(32), nullable`|Số điện thoại snapshot; dữ liệu nhạy cảm.|
|`email`|`varchar(254), nullable`|Email snapshot; dữ liệu nhạy cảm.|
|`valid_from`|`timestamptz, not null`|Thời điểm bắt đầu hiệu lực.|
|`valid_to`|`timestamptz, nullable`|Thời điểm hết hiệu lực; `null` là bản hiện hành.|
|`version_no`|`integer, not null`|Phiên bản tăng dần theo vai trò.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm ghi snapshot.|
|`created_by`|`varchar(100), nullable`|Actor/hệ thống tạo snapshot.|

### Ràng buộc chính

- `party_type IN (1,2,3)`.
- `valid_to IS NULL OR valid_to >= valid_from`.
- `UNIQUE (order_id, party_type, version_no)`.
- `UNIQUE (order_id, party_id)` để child table có thể composite FK cùng Order.
- `version_no > 0`.
- Partial `UNIQUE (order_id, party_type) WHERE valid_to IS NULL`.

### Chỉ mục chính

- `idx_order_parties_order_type_current (order_id, party_type, valid_to)`.

### Ghi chú

- Không tạo index plaintext riêng cho `phone`/`email` trừ khi có yêu cầu bảo mật và tìm kiếm đã được duyệt.

---

## 4.5. `order_goods`

**Mục đích:** Lưu từng phiên bản khai báo hàng hóa/kiện đã áp dụng cho Order.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`goods_id`|`uuid, PK, not null`|ID phiên bản hàng hóa.|
|`order_id`|`uuid, not null, FK -> orders.order_id`|Order sở hữu snapshot.|
|`content_type`|`smallint, not null`|1 chỉ tên hàng; 2 danh sách sản phẩm.|
|`product_name`|`varchar(255), nullable`|Tên hàng chung khi `content_type = 1`.|
|`declared_value`|`bigint, not null, default 0`|Giá trị khai báo, VND.|
|`currency_code`|`char(3), not null, default 'VND'`|Tiền tệ của giá trị khai báo/đơn giá item; baseline hiện tại là VND.|
|`tag_codes`|`smallint[], not null, default '{}'`|Các đặc tính hàng hóa: 1 dễ vỡ; 2 chất lỏng; 3 giá trị cao; 4 có pin; 5 cồng kềnh.|
|`valid_from`|`timestamptz, not null`|Thời điểm bắt đầu áp dụng.|
|`valid_to`|`timestamptz, nullable`|Thời điểm hết hiệu lực; `null` là snapshot hiện hành.|
|`version_no`|`integer, not null`|Phiên bản tăng dần của khai báo hàng hóa.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm ghi snapshot.|
|`created_by`|`varchar(100), nullable`|Actor/hệ thống tạo snapshot.|

### Ràng buộc chính

- `content_type IN (1,2)`.
- `declared_value >= 0`.
- `currency_code = 'VND'`.
- `content_type = 1` yêu cầu `product_name IS NOT NULL`; với `content_type = 2`, sản phẩm nằm ở `order_items`.
- `tag_codes` chỉ chứa 1..5; Backend bảo đảm không lặp code.
- `UNIQUE (order_id, version_no)`.
- `UNIQUE (order_id, goods_id)` để child table có thể composite FK cùng Order.
- `version_no > 0`.
- Partial `UNIQUE (order_id) WHERE valid_to IS NULL`.
- `valid_to IS NULL OR valid_to >= valid_from`.

### Chỉ mục chính

- `idx_order_goods_order_current (order_id, valid_to)`.

### Ghi chú

- Bỏ bảng `goods_features`; tập tag nhỏ, đóng và không có lifecycle riêng được lưu trực tiếp bằng `smallint[]`.

---

## 4.6. `order_items`

**Mục đích:** Lưu snapshot tối thiểu của các item đã áp dụng cho một phiên bản hàng hóa; Product Module vẫn sở hữu master Product.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`item_id`|`uuid, PK, not null`|ID nội bộ của dòng hàng.|
|`order_id`|`uuid, not null`|Order sở hữu dòng hàng; lặp có chủ đích để bảo vệ quan hệ cùng Order.|
|`goods_id`|`uuid, not null, FK -> order_goods.goods_id`|Phiên bản hàng hóa chứa dòng này.|
|`item_code`|`varchar(40), not null`|Mã dòng hàng ổn định do Order cấp; là định danh item nghiệp vụ trong Order.|
|`product_ref`|`varchar(100), nullable, REF -> Product`|Reference Product nguồn nếu có.|
|`sku`|`varchar(100), nullable`|SKU snapshot; không bắt buộc.|
|`item_name`|`varchar(255), not null`|Tên sản phẩm snapshot.|
|`unit_price`|`bigint, nullable`|Đơn giá snapshot, VND.|
|`unit_weight_g`|`integer, nullable`|Khối lượng một đơn vị snapshot, gram.|
|`quantity`|`integer, not null`|Số lượng sản phẩm trong snapshot.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm tạo dòng snapshot.|

### Ràng buộc chính

- `quantity > 0`; `unit_price IS NULL OR unit_price >= 0`; `unit_weight_g IS NULL OR unit_weight_g > 0`.
- `item_code` và `item_name` không rỗng; `product_ref/sku` nếu có không được là chuỗi rỗng.
- Composite FK `(order_id, goods_id) -> order_goods(order_id, goods_id)`.
- `UNIQUE (order_id, item_id)` để child table có thể composite FK cùng Order.
- `UNIQUE (goods_id, item_code)`.

### Chỉ mục chính

- `idx_order_items_goods (goods_id)`.
- `idx_order_items_order_item_code (order_id, item_code)`.

### Ghi chú

- `item_code` là định danh dùng cho nghiệp vụ item-level; không bắt buộc SKU.
- Không sao chép category, stock, supplier hoặc toàn bộ Product master.

## 4.7. `parcel_measures`

**Mục đích:** Lưu lịch sử khối lượng/kích thước khai báo hoặc thực tế; mỗi lần đo hợp lệ là một record riêng.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`measure_id`|`uuid, PK, not null`|ID lần cân/đo.|
|`order_id`|`uuid, not null, FK -> orders.order_id`|Order liên quan.|
|`leg_id`|`uuid, nullable, FK -> order_legs.leg_id`|Stage liên quan khi xác định được.|
|`waybill_id`|`uuid, nullable, FK -> waybills.waybill_id`|Waybill liên quan khi xác định được.|
|`carrier_code`|`integer, nullable, REF -> Carrier Registry`|NVC cung cấp kết quả khi nguồn là Carrier.|
|`measure_kind`|`smallint, not null`|1 DECLARED; 2 ACTUAL; 3 VOLUMETRIC; 4 CHARGEABLE.|
|`source_type`|`smallint, not null`|Nguồn đo: 1 Shop khai báo; 2 NVC đo; 3 vận hành SuperPlatform đo.|
|`weight_g`|`integer, nullable`|Khối lượng gram.|
|`length_cm`|`integer, nullable`|Chiều dài, số centimet nguyên.|
|`width_cm`|`integer, nullable`|Chiều rộng, số centimet nguyên.|
|`height_cm`|`integer, nullable`|Chiều cao, số centimet nguyên.|
|`measured_at`|`timestamptz, not null`|Thời điểm giá trị được xác định tại nguồn.|
|`source_ref`|`varchar(150), nullable`|Reference của bản đo/sự kiện nguồn để tra soát/dedupe khi có.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm SuperPlatform ghi nhận.|

### Ràng buộc chính

- `measure_kind IN (1,2,3,4)`.
- `source_type IN (1,2,3)`.
- `weight_g IS NULL OR weight_g > 0`.
- Ba kích thước phải cùng có hoặc cùng `NULL`; khi có đều `> 0`.
- Ít nhất `weight_g` hoặc bộ ba kích thước phải có giá trị.
- `measure_kind IN (3,4)` yêu cầu `weight_g IS NOT NULL`.
- `source_type = 'CARRIER'` yêu cầu `carrier_code IS NOT NULL`; có `waybill_id` thì phải xác định được `carrier_code`.
- Leg/Waybill nếu có phải thuộc cùng Order; Backend xác minh quan hệ Leg-Waybill khi cả hai cùng có.
- `UNIQUE (order_id, measure_id)` để child table có thể composite FK cùng Order.
- Khi `source_ref` có giá trị, chống trùng theo `(order_id, source_type, source_ref, measure_kind)`.

### Chỉ mục chính

- `idx_parcel_measures_order_time (order_id, measured_at DESC)`.
- `idx_parcel_measures_waybill_time (waybill_id, measured_at DESC) WHERE waybill_id IS NOT NULL`.
- `idx_parcel_measures_leg_time (leg_id, measured_at DESC) WHERE leg_id IS NOT NULL`.
- `idx_parcel_measures_carrier_time (carrier_code, measured_at DESC) WHERE carrier_code IS NOT NULL`.

### Ghi chú

- Không dùng `is_current`; lịch sử cân/đo là append-oriented.
- Order không tự tính VOLUMETRIC/CHARGEABLE khi nguồn nghiệp vụ chưa cung cấp kết quả.

## 4.8. `order_legs`

**Mục đích:** Lưu danh sách Stage và current projection của từng Stage; một Order có thể có nhiều Stage cùng `leg_type`.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`leg_id`|`uuid, PK, not null`|ID nội bộ của Stage.|
|`order_id`|`uuid, not null, FK -> orders.order_id`|Order sở hữu Stage.|
|`stage_code`|`varchar(40), not null`|Mã Stage ổn định để API/nghiệp vụ tham chiếu.|
|`stage_no`|`smallint, not null`|Thứ tự Stage trong Order, bắt đầu từ 1.|
|`leg_type`|`smallint, not null`|1 lấy; 2 giao; 3 hoàn; 4 trả cuối.|
|`stage_status_code`|`varchar(50), not null`|Trạng thái hiện tại chuẩn hóa riêng của Stage.|
|`carrier_code`|`integer, nullable, REF -> Carrier Registry`|NVC hiện được gán cho Stage.|
|`carrier_client_code`|`varchar(100), nullable`|Mã khách hàng/tài khoản thực tế tại NVC cho Stage.|
|`started_at`|`timestamptz, nullable`|Thời điểm Stage thực tế bắt đầu.|
|`completed_at`|`timestamptz, nullable`|Thời điểm Stage thực tế hoàn tất.|
|`version_no`|`integer, not null, default 1`|Optimistic lock của current Stage projection.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm tạo Stage.|
|`updated_at`|`timestamptz, not null, default now()`|Thời điểm cập nhật gần nhất.|

### Ràng buộc chính

- `stage_no > 0`; `leg_type IN (1,2,3,4)`; `stage_code` và `stage_status_code` không rỗng.
- `UNIQUE (order_id, stage_code)`; `UNIQUE (order_id, stage_no)`.
- `UNIQUE (order_id, leg_id)` để child/current-leg composite FK cùng Order.
- **Không có** `UNIQUE (order_id, leg_type)`.
- `carrier_client_code` nếu có yêu cầu `carrier_code IS NOT NULL`.
- Nếu cả hai mốc thực tế có giá trị thì `completed_at >= started_at`.
- `version_no > 0`.

### Chỉ mục chính

- `uq_order_legs_order_stage_code (order_id, stage_code)`.
- `uq_order_legs_order_stage_no (order_id, stage_no)`.
- `idx_order_legs_carrier_status (carrier_code, stage_status_code) WHERE carrier_code IS NOT NULL`.

### Ghi chú

- Không lưu `scheduled_from/scheduled_to` ở Stage; khung pickup thuộc `orders.pickup_scheduled_from/to`.
- `order_legs` chỉ giữ current status chuẩn hóa của Stage qua `stage_status_code`; current raw status NVC thuộc `waybills`, còn event/history vận chuyển nằm ở `tracking_events`.
- Khi API Stage cần trả raw carrier status, Backend lấy từ Waybill hiện hành được liên kết qua `leg_waybills`; không sao chép raw status ngược lại Stage.
- Không cần `is_current`; Stage hiện hành được tham chiếu bởi `orders.current_leg_id`.

## 4.9. `leg_endpoints`

**Mục đích:** Lưu snapshot endpoint của Fulfillment Plan cho từng Stage; endpoint có thể là địa chỉ Order, Hub hoặc cơ sở NVC.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`leg_endpoint_id`|`uuid, PK, not null`|ID snapshot endpoint.|
|`order_id`|`uuid, not null`|Order chung của Stage và endpoint.|
|`leg_id`|`uuid, not null, FK -> order_legs.leg_id`|Stage sở hữu endpoint.|
|`endpoint_role`|`smallint, not null`|1 origin; 2 destination.|
|`location_type`|`smallint, not null`|1 địa chỉ Order; 2 Hub; 3 cơ sở NVC; 4 khác.|
|`order_address_id`|`uuid, nullable, FK -> order_addresses.address_id`|Address snapshot nguồn khi endpoint lấy từ Order.|
|`source_module`|`varchar(40), nullable`|Mã nguồn cung cấp điểm ngoài Order theo shared module-code contract.|
|`source_code`|`varchar(150), nullable`|Mã điểm/Hub/cơ sở tại nguồn.|
|`location_name`|`varchar(200), nullable`|Tên điểm/Hub/cơ sở để hiển thị.|
|`address_model`|`smallint, nullable`|1 ba cấp; 2 hai cấp; `null` nếu endpoint không có địa chỉ hành chính.|
|`address_detail`|`varchar(500), nullable`|Phần địa chỉ chi tiết snapshot.|
|`full_address`|`varchar(1000), nullable`|Địa chỉ đầy đủ snapshot.|
|`province_code`|`varchar(20), nullable, REF -> Address`|Mã Tỉnh/Thành nếu có địa chỉ hành chính; hỗ trợ mã cũ dạng chuỗi số và mã hai cấp mới như `P01`.|
|`district_code`|`varchar(20), nullable, REF -> Address`|Mã Quận/Huyện với model 1.|
|`commune_code`|`varchar(20), nullable, REF -> Address`|Mã Phường/Xã.|
|`latitude`|`numeric(10,7), nullable`|Vĩ độ WGS84.|
|`longitude`|`numeric(10,7), nullable`|Kinh độ WGS84.|
|`valid_from`|`timestamptz, not null`|Thời điểm bắt đầu áp dụng endpoint.|
|`valid_to`|`timestamptz, nullable`|Thời điểm hết hiệu lực; `null` là endpoint hiện hành theo role.|
|`version_no`|`integer, not null`|Version theo `leg_id + endpoint_role`.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm ghi snapshot.|

### Ràng buộc chính

- `endpoint_role IN (1,2)`; `location_type IN (1,2,3,4)`.
- `address_model IS NULL OR address_model IN (1,2)`.
- Khi `address_model` có giá trị thì `province_code` và `commune_code` phải có; model 1 yêu cầu `district_code`, model 2 yêu cầu `district_code IS NULL`.
- `location_type = 'ORDER_ADDRESS'` yêu cầu `order_address_id IS NOT NULL`.
- `latitude` và `longitude` phải cùng có/cùng `NULL`; kiểm tra miền giá trị WGS84.
- `valid_to IS NULL OR valid_to >= valid_from`; `version_no > 0`.
- Composite FK `(order_id, leg_id) -> order_legs(order_id, leg_id)`.
- `order_address_id` nếu có phải thuộc cùng Order; ưu tiên composite FK `(order_id, order_address_id)`.
- `UNIQUE (leg_id, endpoint_role, version_no)`.
- Partial `UNIQUE (leg_id, endpoint_role) WHERE valid_to IS NULL`.

### Chỉ mục chính

- `idx_leg_endpoints_leg_history (leg_id, endpoint_role, valid_from DESC)`.

### Ghi chú

- Đây là snapshot kế hoạch vận chuyển, không phải Hub/Carrier Facility master.
- `order_address_id` giữ lineage; các cột location/address là snapshot thực tế đã áp dụng.

## 4.10. `leg_items`

**Mục đích:** Lưu item và số lượng thuộc một Stage khi nghiệp vụ tách hàng theo chặng.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`order_id`|`uuid, not null`|Order chung của Stage và item.|
|`leg_id`|`uuid, PK, not null, FK -> order_legs.leg_id`|Stage.|
|`item_id`|`uuid, PK, not null, FK -> order_items.item_id`|Dòng hàng.|
|`quantity`|`integer, not null`|Số lượng item thuộc Stage.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm gắn item vào Stage.|

### Ràng buộc chính

- `quantity > 0`.
- Composite FK `(order_id, leg_id) -> order_legs(order_id, leg_id)`.
- Composite FK `(order_id, item_id) -> order_items(order_id, item_id)`.

### Chỉ mục chính

- `idx_leg_items_item (item_id, leg_id)`.

---

## 4.11. `leg_services`

**Mục đích:** Lưu snapshot lịch sử dịch vụ vận chuyển, tài khoản NVC, loại hình thực hiện, policy và mức giá đã thực tế áp dụng cho từng Stage.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`leg_service_id`|`uuid, PK, not null`|ID snapshot dịch vụ.|
|`order_id`|`uuid, not null`|Order chung.|
|`leg_id`|`uuid, not null, FK -> order_legs.leg_id`|Stage được áp dụng.|
|`carrier_code`|`integer, not null, REF -> Carrier Registry`|NVC cung cấp dịch vụ.|
|`service_code`|`varchar(50), not null`|Mã dịch vụ thực tế tại NVC/Carrier.|
|`service_name`|`varchar(150), not null`|Tên dịch vụ snapshot.|
|`fulfillment_mode`|`smallint, not null`|1 `NETWORK_PARCEL`; 2 `ON_DEMAND_DIRECT`.|
|`carrier_client_code`|`varchar(100), nullable`|Tài khoản khách hàng NVC thực tế được dùng.|
|`vehicle_type_code`|`varchar(50), nullable`|Mã loại phương tiện/service variant dùng khi booking nếu nguồn cung cấp.|
|`policy_ref`|`varchar(100), nullable`|Reference policy/capability đã thực tế áp dụng.|
|`policy_version`|`varchar(50), nullable`|Version policy nguồn đã áp dụng.|
|`pricing_result_ref`|`varchar(150), nullable, REF -> Pricing`|Reference kết quả tính giá đã áp dụng cho Stage.|
|`carrier_fee_amount`|`bigint, nullable`|Phí NVC tính cho SuperPlatform trên Stage, đơn vị VND.|
|`shop_shipping_fee_amount`|`bigint, nullable`|Phí vận chuyển SuperPlatform áp dụng cho Shop trên Stage, đơn vị VND.|
|`priced_at`|`timestamptz, nullable`|Thời điểm mức giá áp dụng cho Stage được xác định.|
|`valid_from`|`timestamptz, not null`|Bắt đầu hiệu lực snapshot.|
|`valid_to`|`timestamptz, nullable`|Kết thúc hiệu lực; `null` là snapshot hiện hành.|
|`version_no`|`integer, not null`|Version snapshot theo Stage.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm ghi snapshot.|

### Ràng buộc chính

- Composite FK `(order_id, leg_id) -> order_legs(order_id, leg_id)`.
- `fulfillment_mode IN (1,2)`.
- `service_code` và `service_name` không rỗng; các code/ref nullable nếu có không được là chuỗi rỗng.
- `carrier_fee_amount IS NULL OR carrier_fee_amount >= 0`; `shop_shipping_fee_amount IS NULL OR shop_shipping_fee_amount >= 0`.
- Nếu có `pricing_result_ref`, `carrier_fee_amount` hoặc `shop_shipping_fee_amount` thì `priced_at IS NOT NULL`.
- `valid_to IS NULL OR valid_to >= valid_from`; `version_no > 0`.
- `UNIQUE (leg_id, version_no)`.
- Partial `UNIQUE (leg_id) WHERE valid_to IS NULL`.
- `UNIQUE (order_id, leg_id, leg_service_id)` để Waybill và các bảng liên quan kiểm tra cùng Order/Stage.

### Chỉ mục chính

- `uq_leg_services_leg_version (leg_id, version_no)`.
- `uq_leg_services_leg_current (leg_id) WHERE valid_to IS NULL`.
- `uq_leg_services_order_leg_service (order_id, leg_id, leg_service_id)`.

### Ghi chú

- `leg_services.service_code` là dịch vụ vận chuyển đã áp dụng cho Stage; khác `orders.service_codes` là dịch vụ bổ sung cấp Order.
- `vehicle_type_code` là mã variant/vehicle dùng khi booking, không phải bằng chứng phương tiện thực tế đang chạy.
- `carrier_fee_amount` và `shop_shipping_fee_amount` là snapshot giá theo Stage, không phải Finance ledger hoặc số tiền đối soát thực tế.
- Không lưu ETA tại đây; SLA cam kết theo Carrier Waybill nằm trong `waybill_slas`.
- Khi đổi dịch vụ, đóng row cũ bằng `valid_to` và tạo version mới; không ghi đè lịch sử.

## 4.12. `waybills`

**Mục đích:** Lưu Waybill do NVC cấp và reference đúng snapshot đã dùng khi tạo vận đơn.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`waybill_id`|`uuid, PK, not null`|ID nội bộ Waybill.|
|`order_id`|`uuid, not null, FK -> orders.order_id`|Order sở hữu Waybill.|
|`carrier_code`|`integer, not null, REF -> Carrier Registry`|NVC phát hành Waybill.|
|`carrier_waybill_code`|`varchar(150), not null`|Mã vận đơn nguyên bản do NVC cấp; canonical field trong Order.|
|`carrier_client_code`|`varchar(100), nullable`|Tài khoản khách hàng NVC thực tế dùng để tạo Waybill.|
|`origin_request_id`|`uuid, nullable, FK -> order_requests.request_id`|Business request làm phát sinh Waybill khi có.|
|`sender_party_id`|`uuid, not null, FK -> order_parties.party_id`|Snapshot người gửi đã dùng khi tạo Waybill.|
|`receiver_party_id`|`uuid, not null, FK -> order_parties.party_id`|Snapshot người nhận/điểm nhận đã dùng.|
|`pickup_address_id`|`uuid, not null, FK -> order_addresses.address_id`|Snapshot địa chỉ lấy đã dùng.|
|`delivery_address_id`|`uuid, not null, FK -> order_addresses.address_id`|Snapshot địa chỉ giao/trả đã dùng.|
|`goods_id`|`uuid, not null, FK -> order_goods.goods_id`|Snapshot hàng hóa đã dùng.|
|`measure_id`|`uuid, not null, FK -> parcel_measures.measure_id`|Snapshot cân/đo đã dùng.|
|`leg_service_id`|`uuid, not null, FK -> leg_services.leg_service_id`|Snapshot dịch vụ/tài khoản đã dùng.|
|`pickup_method`|`smallint, not null`|Phương thức gửi đã thực tế áp dụng khi tạo Waybill: `1` — NVC đến lấy; `2` — Shop hoặc SuperShip gửi tại điểm tiếp nhận của NVC. Đây là snapshot theo Waybill, không đọc ngược từ giá trị hiện hành trên Order.|
|`fee_payer`|`smallint, not null`|Bên trả phí đã gửi NVC khi tạo Waybill: `1` — Shop/người gửi; `2` — người nhận.|
|`inspection_type`|`smallint, not null`|Chính sách xem/thử hàng đã gửi NVC: `1` — không xem; `2` — xem nhưng không thử; `3` — được thử khi dịch vụ hỗ trợ.|
|`cod_amount`|`bigint, not null, default 0`|Số tiền COD NVC cần thu theo snapshot Waybill, đơn vị VND; `0` là không thu COD.|
|`collection_amount`|`bigint, not null, default 0`|Tổng tiền NVC cần thu người nhận theo snapshot Waybill, gồm COD và khoản người nhận trả nếu có, đơn vị VND.|
|`declared_value`|`bigint, not null, default 0`|Giá trị hàng đã khai báo với NVC để áp dụng giới hạn trách nhiệm/bảo hiểm, đơn vị VND; `0` là không khai giá.|
|`delivery_note`|`varchar(120), nullable`|Ghi chú/yêu cầu giao hàng an toàn đã thực tế gửi NVC; không đọc ngược từ ghi chú hiện hành của Order.|
|`carrier_options`|`jsonb, not null, default '[]'`|Danh sách tham số nghiệp vụ riêng, không nhạy cảm của NVC đã dùng khi tạo Waybill; mỗi phần tử gồm `key`, `value`, `name`. Không lưu credential hoặc raw HTTP payload.|
|`snapshot_schema_version`|`integer, not null, default 1`|Phiên bản cấu trúc snapshot nghiệp vụ của Waybill để đọc và kiểm tra tương thích.|
|`snapshot_hash`|`varchar(128), not null`|Hash của snapshot canonical đã dùng để tạo Waybill, phục vụ phát hiện thay đổi sai và đối chiếu.|
|`carrier_sorting_code`|`varchar(100), nullable`|Mã phân loại/chia chọn NVC trả về.|
|`waybill_status`|`smallint, not null`|1 hiện hành; 2 đã hoàn tất; 3 bị thay thế; 4 đã hủy.|
|`carrier_status_code`|`varchar(100), nullable`|Raw/current status code gần nhất mà NVC ghi nhận cho Waybill; giữ nguyên mã nguồn.|
|`carrier_status_name`|`varchar(200), nullable`|Tên raw/current status gần nhất do NVC cung cấp.|
|`carrier_status_at`|`timestamptz, nullable`|Thời điểm raw/current carrier status thực tế phát sinh tại NVC.|
|`replaces_waybill_id`|`uuid, nullable, FK -> waybills.waybill_id`|Waybill bị bản ghi này thay thế trực tiếp.|
|`reason_code`|`smallint, nullable`|Mã lý do thay/hủy/kết thúc hiệu lực: `1` — NVC từ chối hoặc không thể tiếp tục; `2` — NVC không còn phục vụ tuyến; `3` — quá thời gian vận hành cho phép; `4` — vận hành chủ động đổi NVC; `99` — lý do khác.|
|`reason`|`text, nullable`|Diễn giải lý do.|
|`request_sent_at`|`timestamptz, not null`|Thời điểm Order gửi yêu cầu tạo Waybill sang Carrier. Booking chưa được cấp mã nằm tại Attempt/Request Step, không tạo Waybill giả.|
|`carrier_accepted_at`|`timestamptz, not null`|Thời điểm NVC/Carrier chấp nhận và cấp mã Waybill.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm SuperPlatform ghi nhận Waybill.|
|`ended_at`|`timestamptz, nullable`|Thời điểm Waybill hết hiệu lực.|
|`updated_at`|`timestamptz, not null, default now()`|Thời điểm cập nhật lifecycle gần nhất.|

### Ràng buộc chính

- `waybill_status IN (1,2,3,4)`.
- `pickup_method IN (1,2)`; `fee_payer IN (1,2)`; `inspection_type IN (1,2,3)`.
- `cod_amount >= 0`; `collection_amount >= 0`; `declared_value >= 0`.
- `carrier_options` phải là JSON array; mỗi phần tử là object có ba chuỗi không rỗng `key`, `value`, `name`; không chứa access token, secret, signature, credential, Carrier Account ID nhạy cảm hoặc raw HTTP request/response.
- `snapshot_schema_version > 0`; `snapshot_hash` không được là chuỗi rỗng.
- Nếu có `carrier_status_code` hoặc `carrier_status_name` thì `carrier_status_at IS NOT NULL`; nếu cả code và name đều `NULL` thì `carrier_status_at IS NULL`.
- `reason_code IS NULL OR reason_code IN (1,2,3,4,99)`; `reason_code = 99` yêu cầu `reason` khác rỗng.
- `carrier_accepted_at >= request_sent_at`.
- `replaces_waybill_id IS NULL OR replaces_waybill_id <> waybill_id`.
- `UNIQUE (carrier_code, carrier_waybill_code)`.
- `UNIQUE (order_id, waybill_id)` để child table có thể composite FK cùng Order.
- `origin_request_id` và tất cả snapshot FK phải thuộc cùng `order_id`; enforce bằng composite FK/validation trong migration.
- Không còn `ref_type + carrier_ref`; `carrier_waybill_code` là canonical field của Order.

### Chỉ mục chính

- `idx_waybills_order_created (order_id, created_at DESC)`.
- `idx_waybills_carrier_code (carrier_code, carrier_waybill_code)`.
- `idx_waybills_carrier_status (carrier_code, carrier_status_code, carrier_status_at DESC) WHERE carrier_status_code IS NOT NULL`.

### Ghi chú

- Các FK snapshot tới Party, Address, Goods, Measure và Leg Service cùng các cột snapshot trực tiếp trên `waybills` hợp thành bằng chứng nghiệp vụ về dữ liệu đã thực tế áp dụng khi tạo vận đơn; không cập nhật ngược theo dữ liệu Order hiện hành.
- `waybills.carrier_status_*` là current raw projection theo Waybill và chỉ được cập nhật từ Carrier Module/event NVC hợp lệ. Lịch sử từng thay đổi vẫn nằm ở `tracking_events`; không dùng current raw status thay lịch sử.
- `carrier_options` chỉ lưu tham số nghiệp vụ an toàn cần tái hiện/đối chiếu, ví dụ `[{"key":"service_type_id","value":"2","name":"Loại dịch vụ"}]`.
- Không lưu access token, secret, signature, credential, Carrier Account ID nhạy cảm hoặc raw HTTP request/response trong `carrier_options` hay các cột snapshot Waybill.
- Booking Attempt chưa được NVC cấp `carrier_waybill_code` được theo dõi bằng `request_steps` và reference nghiệp vụ từ Carrier khi có; không tạo record trong `transport_attempts` hoặc `waybills`.

---

## 4.13. `leg_waybills`

**Mục đích:** Lưu thời gian một Waybill được dùng cho Stage; một Waybill có thể phục vụ nhiều Stage.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`leg_waybill_id`|`uuid, PK, not null`|ID quan hệ lịch sử.|
|`order_id`|`uuid, not null`|Order chung.|
|`leg_id`|`uuid, not null, FK -> order_legs.leg_id`|Stage.|
|`waybill_id`|`uuid, not null, FK -> waybills.waybill_id`|Waybill.|
|`sequence_no`|`integer, not null`|Thứ tự Waybill ổn định trong lịch sử của Stage, bắt đầu từ `1`; không suy ra động chỉ bằng `ROW_NUMBER()` theo thời gian.|
|`active_from`|`timestamptz, not null`|Bắt đầu sử dụng Waybill cho Stage.|
|`active_to`|`timestamptz, nullable`|Kết thúc sử dụng; `null` là Waybill hiện hành của Stage.|
|`reason_code`|`varchar(50), nullable`|Mã lý do gắn/tháo/thay.|
|`reason`|`text, nullable`|Diễn giải.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm ghi quan hệ.|

### Ràng buộc chính

- `active_to IS NULL OR active_to >= active_from`.
- `sequence_no > 0`.
- Composite FK `(order_id, leg_id) -> order_legs(order_id, leg_id)`.
- Composite FK `(order_id, waybill_id) -> waybills(order_id, waybill_id)`.
- Partial `UNIQUE (leg_id) WHERE active_to IS NULL`.
- `UNIQUE (leg_id, sequence_no)`.
- `UNIQUE (leg_id, waybill_id, active_from)`.

### Chỉ mục chính

- `idx_leg_waybills_leg_active (leg_id, active_to)`.
- `uq_leg_waybills_leg_sequence (leg_id, sequence_no)`.
- `idx_leg_waybills_waybill (waybill_id, active_from DESC)`.

---

## 4.14. `tracking_events`

**Mục đích:** Lưu sự kiện vận chuyển lịch sử đã chuẩn hóa, raw Carrier status và location snapshot; tách biệt current Order/Stage status và Activity Log.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`event_id`|`uuid, PK, not null`|ID nội bộ của Tracking Event.|
|`order_id`|`uuid, not null, FK -> orders.order_id`|Order liên quan.|
|`leg_id`|`uuid, nullable, FK -> order_legs.leg_id`|Stage liên quan khi xác định chắc chắn được.|
|`waybill_id`|`uuid, nullable, FK -> waybills.waybill_id`|Waybill liên quan khi xác định được.|
|`attempt_id`|`uuid, nullable, FK -> transport_attempts.attempt_id`|Transport Attempt liên quan khi xác định được.|
|`event_source`|`smallint, not null`|1 NVC/Carrier; 2 SuperPlatform business event; 3 Warehouse/Hub event đã xác nhận.|
|`source_namespace`|`varchar(100), not null`|Namespace nguồn để chống đụng định danh event.|
|`dedupe_key`|`varchar(200), not null`|Khóa chống trùng ổn định trong namespace.|
|`source_module`|`varchar(40), not null`|Mã module/namespace thực tế cung cấp event theo shared module-code contract.|
|`source_event_ref`|`varchar(150), nullable`|Event ID gốc nếu nguồn có.|
|`event_fingerprint`|`varchar(128), nullable`|Fingerprint khi nguồn không có event ID ổn định.|
|`payload_hash`|`varchar(128), nullable`|Hash payload chuẩn hóa để phát hiện cùng key nhưng dữ liệu khác.|
|`event_type`|`varchar(50), not null`|Loại Tracking Event chuẩn hóa nội bộ.|
|`event_code`|`varchar(50), nullable`|Mã event chi tiết khi có.|
|`event_name`|`varchar(150), nullable`|Tên event snapshot để hiển thị/tra soát.|
|`stage_status_code`|`varchar(50), nullable`|Stage Status chuẩn hóa tương ứng khi event xác định được trạng thái Stage.|
|`carrier_status_code`|`varchar(100), nullable`|Raw Carrier status code tại event.|
|`carrier_status_name`|`varchar(200), nullable`|Tên raw Carrier status tại event.|
|`reason_code`|`varchar(50), nullable`|Mã nguyên nhân chuẩn hóa khi có.|
|`reason`|`text, nullable`|Diễn giải nguyên nhân.|
|`province_code`|`varchar(20), nullable, REF -> Address`|Mã Tỉnh/Thành tại event khi đã đối chiếu được; giữ nguyên mã chuỗi do Address Module chuẩn hóa.|
|`province_name`|`varchar(150), nullable`|Tên Tỉnh/Thành snapshot.|
|`district_code`|`varchar(20), nullable, REF -> Address`|Mã Quận/Huyện snapshot nếu mô hình có cấp này.|
|`district_name`|`varchar(150), nullable`|Tên Quận/Huyện snapshot.|
|`commune_code`|`varchar(20), nullable, REF -> Address`|Mã Phường/Xã snapshot.|
|`commune_name`|`varchar(150), nullable`|Tên Phường/Xã snapshot.|
|`facility_code`|`varchar(100), nullable`|Mã bưu cục/Hub tại event nếu nguồn cung cấp.|
|`facility_name`|`varchar(200), nullable`|Tên bưu cục/Hub tại event nếu nguồn cung cấp.|
|`occurred_at`|`timestamptz, not null`|Thời điểm event thực tế xảy ra tại nguồn.|
|`received_at`|`timestamptz, not null`|Thời điểm SuperPlatform tiếp nhận/ghi nhận event.|
|`order_sequence_no`|`bigint, not null`|Số thứ tự tăng dần và duy nhất của event trong toàn Order; dùng cho timeline toàn Order kể cả khi chưa xác định được Stage.|
|`leg_sequence_no`|`integer, nullable`|Số thứ tự tăng dần của event trong Stage; bắt buộc khi `leg_id` có giá trị và phải `NULL` khi chưa xác định Stage.|
|`source_sequence_ref`|`varchar(100), nullable`|Sequence/ref của nguồn nếu có; không dùng thay sequence nội bộ.|
|`apply_result`|`smallint, not null`|1 đã áp dụng; 2 chỉ lưu lịch sử; 3 bị từ chối ảnh hưởng current state.|
|`corrects_event_id`|`uuid, nullable, FK -> tracking_events.event_id`|Event gốc bị hiệu chỉnh khi đây là correction.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm ghi record.|

### Ràng buộc chính

- `event_source IN (1,2,3)`; `apply_result IN (1,2,3)`; `order_sequence_no > 0`.
- `leg_id IS NOT NULL` yêu cầu `leg_sequence_no > 0`; `leg_id IS NULL` yêu cầu `leg_sequence_no IS NULL`.
- `UNIQUE (source_namespace, dedupe_key)`.
- `UNIQUE (order_id, event_id)` để correction/child relation có thể bảo vệ cùng Order.
- `UNIQUE (order_id, order_sequence_no)`.
- Partial `UNIQUE (leg_id, leg_sequence_no) WHERE leg_id IS NOT NULL`.
- `corrects_event_id IS NULL OR corrects_event_id <> event_id`; event được correction phải thuộc cùng Order.
- Leg/Waybill/Attempt nếu có phải thuộc cùng Order; không tự suy đoán relation khi nguồn/ngữ cảnh chưa đủ chắc chắn.
- `event_source = 1` mới được kỳ vọng có raw `carrier_status_code/name`; không bắt buộc nếu NVC không cung cấp mã/tên.

### Chỉ mục chính

- `uq_tracking_order_sequence (order_id, order_sequence_no)`.
- `uq_tracking_leg_sequence (leg_id, leg_sequence_no) WHERE leg_id IS NOT NULL`.
- `idx_tracking_order_time (order_id, occurred_at DESC, order_sequence_no DESC)`.
- `idx_tracking_leg_time (leg_id, occurred_at DESC, leg_sequence_no DESC) WHERE leg_id IS NOT NULL`.
- `idx_tracking_waybill_time (waybill_id, occurred_at DESC) WHERE waybill_id IS NOT NULL`.

### Ghi chú

- Tracking Event là history fact; không dùng thay current `orders.status_code`, `order_legs.stage_status_code` hoặc `order_results`.
- Timeline toàn Order sắp xếp ổn định theo `order_sequence_no`; timeline một Stage dùng `leg_sequence_no`. `occurred_at` vẫn là thời gian nghiệp vụ nhưng không dùng một mình để phân xử các event cùng thời điểm hoặc đến trễ.
- Sự kiện đến muộn vẫn được lưu lịch sử nhưng không được làm current state quay ngược trái State Transition Matrix.
- Không lưu raw HTTP/webhook payload nhạy cảm của NVC trong Order DB.

> **Trạng thái baseline review:** toàn bộ 37 bảng đã được rà soát về ownership, cùng-Order/cùng-Shop, lifecycle, PII, projection version, idempotency và outbox. Dictionary vẫn cần được chuyển thành migration và kiểm thử constraint trước khi production.

## 4.15. `transport_attempts`

**Mục đích:** Lưu từng lần thực tế thực hiện lấy/giao/hoàn/trả; request retry không tự tạo attempt.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`attempt_id`|`uuid, PK, not null`|ID Attempt.|
|`order_id`|`uuid, not null`|Order chung.|
|`leg_id`|`uuid, not null, FK -> order_legs.leg_id`|Stage được thực hiện.|
|`waybill_id`|`uuid, nullable, FK -> waybills.waybill_id`|Waybill thực hiện Attempt khi có.|
|`carrier_code`|`integer, not null, REF -> Carrier Registry`|NVC thực hiện.|
|`trigger_request_id`|`uuid, nullable, FK -> order_requests.request_id`|Request nghiệp vụ dẫn tới Attempt nếu là lần thực hiện lại.|
|`attempt_code`|`varchar(50), not null`|Mã Attempt ổn định trong Order.|
|`attempt_type`|`smallint, not null`|1 lấy; 2 giao; 3 lấy hàng hoàn; 4 trả hàng.|
|`attempt_no`|`integer, not null`|Số thứ tự Attempt cùng Stage/type.|
|`status`|`smallint, not null`|1 đang thực hiện; 2 thành công; 3 thất bại; 4 hủy.|
|`failure_code`|`varchar(50), nullable`|Mã lỗi/thất bại khi có.|
|`failure_reason`|`text, nullable`|Diễn giải thất bại.|
|`received_by_name`|`varchar(200), nullable`|Tên người thực tế nhận kiện khi nguồn cung cấp.|
|`received_by_relation`|`varchar(100), nullable`|Quan hệ người nhận thực tế với người nhận chính khi có.|
|`source_ref`|`varchar(150), nullable`|Attempt/task ref tại nguồn.|
|`started_at`|`timestamptz, not null`|Thời điểm bắt đầu thực tế.|
|`ended_at`|`timestamptz, nullable`|Thời điểm kết thúc.|
|`version_no`|`integer, not null, default 1`|Optimistic lock của Transport Attempt, bắt đầu từ `1`.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm ghi Attempt.|
|`updated_at`|`timestamptz, not null, default now()`|Thời điểm cập nhật gần nhất.|

### Ràng buộc chính

- `attempt_type IN (1,2,3,4)`.
- `status IN (1,2,3,4)`.
- `attempt_no > 0`.
- `version_no > 0`.
- `ended_at IS NULL OR ended_at >= started_at`.
- `UNIQUE (leg_id, attempt_type, attempt_no)`.
- `UNIQUE (order_id, attempt_code)`.
- `status = 1` yêu cầu `ended_at`, `failure_code`, `failure_reason` đều `NULL`; `status = 2` yêu cầu `ended_at IS NOT NULL` và các trường failure đều `NULL`; `status = 3` yêu cầu `ended_at IS NOT NULL`, `failure_code` khác rỗng; `status = 4` yêu cầu `ended_at IS NOT NULL`.
- `leg_id`, `waybill_id` và `trigger_request_id` nếu có phải thuộc cùng `order_id`; enforce bằng các composite FK tới candidate key cùng-Order tương ứng.

### Chỉ mục chính

- `idx_transport_attempts_order_started (order_id, started_at DESC)`.
- `idx_transport_attempts_leg_type_no (leg_id, attempt_type, attempt_no DESC)`.

---

## 4.16. `handovers`

**Mục đích:** Lưu một quá trình chuyển giao kiện hàng và trách nhiệm vận chuyển giữa hai Stage liền kề do hai NVC khác nhau thực hiện. Handover kết nối hai Stage, không phải một Stage.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`handover_id`|`uuid, PK, not null`|ID Handover.|
|`order_id`|`uuid, not null, FK -> orders.order_id`|Order liên quan.|
|`from_leg_id`|`uuid, not null, FK -> order_legs.leg_id`|Stage bàn giao đi.|
|`to_leg_id`|`uuid, not null, FK -> order_legs.leg_id`|Stage nhận bàn giao.|
|`from_carrier_code`|`integer, not null, REF -> Carrier Registry`|NVC bàn giao.|
|`to_carrier_code`|`integer, not null, REF -> Carrier Registry`|NVC nhận.|
|`status`|`smallint, not null`|1 chờ; 2 đang bàn giao; 3 hoàn tất; 4 thất bại; 5 hủy.|
|`started_at`|`timestamptz, nullable`|Thời điểm bắt đầu.|
|`completed_at`|`timestamptz, nullable`|Thời điểm hoàn tất.|
|`version_no`|`integer, not null, default 1`|Optimistic lock, bắt đầu từ `1`.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm tạo Handover.|
|`updated_at`|`timestamptz, not null, default now()`|Cập nhật gần nhất.|

### Ràng buộc chính

- `from_leg_id <> to_leg_id`.
- `from_carrier_code <> to_carrier_code`; cùng NVC không tạo Handover, kể cả khi đổi Waybill.
- `status IN (1,2,3,4,5)`.
- `version_no > 0`; `UNIQUE (order_id, handover_id)`.
- `UNIQUE (from_leg_id, to_leg_id)`: một cặp Stage có tối đa một Handover; các lần thử nằm trong `handover_attempts`.
- `completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at`.
- `status = 1` yêu cầu `started_at IS NULL`, `completed_at IS NULL`; `status = 2` yêu cầu `started_at IS NOT NULL`, `completed_at IS NULL`; `status IN (3,4,5)` yêu cầu `completed_at IS NOT NULL`.
- Hai Stage phải cùng Order; enforce bằng composite FK `(order_id, from_leg_id)` và `(order_id, to_leg_id)` tới `order_legs(order_id, leg_id)`.
- Khi tạo Handover, `from_carrier_code` phải khớp Carrier của `leg_services` hiện hành trên `from_leg_id`; `to_carrier_code` phải khớp Carrier của `leg_services` hiện hành trên `to_leg_id`. Đây là invariant giao dịch, kiểm tra trong service/transaction hoặc trigger vì phụ thuộc snapshot có hiệu lực theo thời gian.
- `status = 3` chỉ hợp lệ khi Handover có ít nhất một `handover_attempts.status = 2` hợp lệ.

### Chỉ mục chính

- `idx_handovers_order_created (order_id, created_at DESC)`.
- `uq_handovers_from_to (from_leg_id, to_leg_id)`.

---

## 4.17. `handover_attempts`

**Mục đích:** Lưu từng lần thử bàn giao, không ghi đè Attempt cũ.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`handover_attempt_id`|`uuid, PK, not null`|ID lượt bàn giao.|
|`order_id`|`uuid, not null`|Order chung.|
|`handover_id`|`uuid, not null, FK -> handovers.handover_id`|Handover cha.|
|`trigger_request_id`|`uuid, nullable, FK -> order_requests.request_id`|Request bàn giao lại nếu có.|
|`from_waybill_id`|`uuid, nullable, FK -> waybills.waybill_id`|Waybill phía bàn giao khi xác định được.|
|`to_waybill_id`|`uuid, nullable, FK -> waybills.waybill_id`|Waybill phía nhận khi xác định được.|
|`attempt_no`|`integer, not null`|Số lần thử bàn giao.|
|`status`|`smallint, not null`|1 đang thực hiện; 2 thành công; 3 thất bại; 4 hủy.|
|`failure_code`|`varchar(50), nullable`|Mã thất bại.|
|`failure_reason`|`text, nullable`|Diễn giải thất bại.|
|`source_ref`|`varchar(150), nullable`|Reference tại nguồn.|
|`started_at`|`timestamptz, not null`|Thời điểm bắt đầu.|
|`ended_at`|`timestamptz, nullable`|Thời điểm kết thúc.|
|`version_no`|`integer, not null, default 1`|Optimistic lock của lượt bàn giao, bắt đầu từ `1`.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm ghi lượt.|
|`updated_at`|`timestamptz, not null, default now()`|Cập nhật gần nhất.|

### Ràng buộc chính

- `attempt_no > 0`.
- `status IN (1,2,3,4)`.
- `version_no > 0`.
- `UNIQUE (handover_id, attempt_no)`.
- `ended_at IS NULL OR ended_at >= started_at`.
- `status = 1` yêu cầu `ended_at IS NULL`; `status IN (2,3,4)` yêu cầu `ended_at IS NOT NULL`.
- `status = 3` yêu cầu `failure_code` khác rỗng; `status <> 3` yêu cầu `failure_code IS NULL` và `failure_reason IS NULL`.
- Handover, Request và hai Waybill nếu có phải thuộc cùng Order; enforce bằng composite FK/cùng-Order validation trong migration.
- `status = 2` bắt buộc cả `from_waybill_id` và `to_waybill_id` khác `NULL`, đồng thời `from_waybill_id <> to_waybill_id`.
- Tại `started_at` của Attempt, `from_waybill_id` phải có quan hệ `leg_waybills` hiệu lực với `handovers.from_leg_id`; `to_waybill_id` phải có quan hệ `leg_waybills` hiệu lực với `handovers.to_leg_id`: `active_from <= started_at` và `active_to IS NULL OR active_to >= started_at`.
- Carrier của `from_waybill_id` phải bằng `handovers.from_carrier_code`; Carrier của `to_waybill_id` phải bằng `handovers.to_carrier_code`.
- Attempt đang thực hiện, thất bại hoặc bị hủy được phép thiếu Waybill chưa xác định; Attempt thành công không được thiếu Waybill hoặc dùng Waybill không còn gắn hiệu lực với đúng Stage.

### Chỉ mục chính

- `idx_handover_attempts_handover_no (handover_id, attempt_no DESC)`.

---

## 4.18. `operational_assignments`

**Mục đích:** Lưu lịch sử shipper/nhân sự và phương tiện đang hoặc đã phụ trách Stage.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`assignment_id`|`uuid, PK, not null`|ID assignment.|
|`order_id`|`uuid, not null`|Order chung.|
|`assignment_no`|`integer, not null`|Số thứ tự phân công ổn định trong toàn Order, bắt đầu từ `1`.|
|`leg_id`|`uuid, not null, FK -> order_legs.leg_id`|Stage được phân công.|
|`waybill_id`|`uuid, nullable, FK -> waybills.waybill_id`|Waybill liên quan khi có.|
|`attempt_id`|`uuid, nullable, FK -> transport_attempts.attempt_id`|Transport Attempt liên quan khi có.|
|`handover_id`|`uuid, nullable, FK -> handovers.handover_id`|Handover liên quan khi `role_type = 5` và xác định được.|
|`handover_attempt_id`|`uuid, nullable, FK -> handover_attempts.handover_attempt_id`|Lượt bàn giao liên quan khi `role_type = 5` và xác định được.|
|`carrier_code`|`integer, not null, REF -> Carrier Registry`|NVC quản lý người thực hiện.|
|`role_type`|`smallint, not null`|1 lấy; 2 giao; 3 lấy hàng hoàn; 4 trả hàng hoàn; 5 bàn giao giữa NVC.|
|`carrier_shipper_code`|`varchar(100), nullable`|Mã người thực hiện nguyên bản do NVC cung cấp.|
|`assignee_name`|`varchar(200), not null`|Tên hiển thị của người thực hiện.|
|`assignee_phone`|`varchar(32), nullable`|Số điện thoại người thực hiện khi nguồn cung cấp; masking và phân quyền đọc thực hiện tại tầng API/application.|
|`shipper_image_ref`|`varchar(150), nullable, REF -> PLATFORM_STORAGE`|Reference ảnh người thực hiện nếu NVC cho phép.|
|`vehicle_ref`|`varchar(100), nullable`|Mã phương tiện tại nguồn khi có.|
|`vehicle_type_code`|`smallint, nullable`|Loại phương tiện: 1 xe máy; 2 ô tô; 3 xe tải; 4 xe đạp; 99 khác.|
|`vehicle_plate_encrypted`|`text, nullable`|Biển số/định danh phương tiện được mã hóa khi policy cho phép lưu.|
|`end_type`|`smallint, nullable`|Lý do kết thúc: `1` — hoàn thành; `2` — được thay thế; `3` — NVC hủy phân công. Bỏ khi còn hiệu lực.|
|`end_reason`|`text, nullable`|Diễn giải lý do kết thúc/thay thế khi nguồn cung cấp.|
|`source_module`|`varchar(40), not null`|Mã nguồn authoritative của assignment theo shared module-code contract.|
|`source_ref`|`varchar(150), nullable`|ID assignment tại nguồn.|
|`valid_from`|`timestamptz, not null`|Bắt đầu hiệu lực.|
|`valid_to`|`timestamptz, nullable`|Kết thúc hiệu lực; `null` là còn hiệu lực.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm ghi nhận.|
|`updated_at`|`timestamptz, not null, default now()`|Cập nhật gần nhất.|

### Ràng buộc chính

- `role_type IN (1,2,3,4,5)`.
- `assignment_no > 0`; `UNIQUE (order_id, assignment_no)`.
- `vehicle_type_code IS NULL OR vehicle_type_code IN (1,2,3,4,99)`.
- `valid_to IS NULL OR valid_to >= valid_from`.
- `valid_to IS NULL` yêu cầu `end_type IS NULL` và `end_reason IS NULL`; `valid_to IS NOT NULL` yêu cầu `end_type IN (1,2,3)`.
- Mỗi cặp `(leg_id, role_type)` chỉ có tối đa một assignment hiện hành với `valid_to IS NULL`; khi đổi người thực hiện phải đóng assignment cũ và tạo/kích hoạt assignment mới trong cùng transaction.
- `assignee_phone` nếu có không được là chuỗi rỗng và phải được Backend chuẩn hóa trước khi lưu.
- Leg, Waybill, Transport Attempt, Handover và Handover Attempt nếu có phải thuộc cùng Order; `handover_attempt_id` nếu có phải thuộc đúng `handover_id`.

### Chỉ mục chính

- `idx_assignments_order_current (order_id, valid_to) WHERE valid_to IS NULL`.
- `uq_assignments_leg_role_current (leg_id, role_type) WHERE valid_to IS NULL`.
- `idx_assignments_leg_history (leg_id, role_type, valid_from DESC)`.
- `uq_assignments_order_no (order_id, assignment_no)`.

### Ghi chú

- API `/shipper` lấy assignment hiện hành của Stage hiện hành theo `role_type` phù hợp; partial unique index bảo đảm không có hai kết quả cùng vai trò.
- API `/shippers` đọc toàn bộ lịch sử theo `order_id`, `assignment_no` hoặc `valid_from`; assignment đã kết thúc không bị ghi đè hay xóa.

---

## 4.19. `order_results`

**Mục đích:** Lưu kết quả nghiệp vụ tổng hợp, có version, của toàn Order theo DELIVERY/RETURN/EXCHANGE; độc lập với Order Status, Tracking Event và kết quả từng Transport Attempt.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`result_id`|`uuid, PK, not null`|ID kết quả.|
|`order_id`|`uuid, not null, FK -> orders.order_id`|Order liên quan.|
|`leg_id`|`uuid, nullable, FK -> order_legs.leg_id`|Stage context làm phát sinh version kết quả tổng hợp khi xác định được; không thay đổi scope toàn Order của Result.|
|`waybill_id`|`uuid, nullable, FK -> waybills.waybill_id`|Waybill context cung cấp/xác nhận kết quả khi xác định được.|
|`attempt_id`|`uuid, nullable, FK -> transport_attempts.attempt_id`|Transport Attempt làm thay đổi kết quả tổng hợp khi xác định được; kết quả riêng từng lần vẫn nằm ở `transport_attempts`.|
|`request_id`|`uuid, nullable, FK -> order_requests.request_id`|Request nguồn nếu kết quả phát sinh từ request.|
|`result_type`|`smallint, not null`|1 DELIVERY; 2 RETURN; 3 EXCHANGE.|
|`result_code`|`smallint, not null`|Kết quả tổng hợp: `1` — toàn bộ/thành công; `2` — một phần; `3` — thất bại cuối cùng.|
|`reason_code`|`varchar(50), nullable`|Mã nguyên nhân khi có.|
|`reason`|`text, nullable`|Diễn giải.|
|`source_module`|`varchar(40), not null`|Mã nguồn xác nhận business result theo shared module-code contract.|
|`source_ref`|`varchar(150), nullable`|Reference result tại nguồn.|
|`occurred_at`|`timestamptz, not null`|Thời điểm kết quả thực tế xảy ra.|
|`valid_from`|`timestamptz, not null`|Thời điểm result version bắt đầu có hiệu lực.|
|`valid_to`|`timestamptz, nullable`|Hết hiệu lực khi có correction; `null` là bản hiện hành.|
|`version_no`|`integer, not null`|Phiên bản kết quả tăng dần theo `order_id + result_type`.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm ghi result.|

### Ràng buộc chính

- `result_type IN (1,2,3)`.
- `result_code IN (1,2,3)`.
- `version_no > 0`; `UNIQUE (order_id, result_type, version_no)`.
- `valid_to IS NULL OR valid_to >= valid_from`.
- Partial `UNIQUE (order_id, result_type) WHERE valid_to IS NULL`: mỗi Order có đúng tối đa một version hiện hành cho từng loại DELIVERY/RETURN/EXCHANGE.
- Leg, Waybill, Transport Attempt và Request nếu có phải thuộc cùng Order; enforce bằng composite FK/cùng-Order validation.
- Khi tạo version mới, transaction phải đóng version hiện hành cũ bằng `valid_to`, tạo version tăng dần và ghi toàn bộ `result_items` snapshot tương ứng nếu kết quả có item-level outcome.

### Chỉ mục chính

- `idx_order_results_order_type (order_id, result_type, occurred_at DESC)`.

### Quy tắc ghi nhận kết quả

- Tạo version mới khi xác nhận giao/hoàn/đổi toàn bộ, xác nhận một phần hoặc kết luận thất bại cuối cùng.
- Một lần thực hiện thất bại nhưng còn được retry chỉ cập nhật `transport_attempts`/`tracking_events`, chưa tạo `result_code = 3`.
- Không tạo version chỉ vì NVC đổi trạng thái, đổi shipper, tạo/thay Waybill hoặc nhận event đến trễ.
- `result_code = 2` yêu cầu có `result_items` thể hiện phần đã hoàn thành và phần còn lại/thu hồi/trả tương ứng.
- `orders.delivery_result` và `orders.exchange_result` là current projection được đồng bộ từ version hiện hành của `order_results`; chúng không thay thế lịch sử version.

---

## 4.20. `result_items`

**Mục đích:** Lưu item/quantity thực tế đã giao, còn lại, thu hồi hoặc trả trong một business result.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`order_id`|`uuid, not null`|Order chung.|
|`result_id`|`uuid, PK, not null, FK -> order_results.result_id`|Kết quả thực tế.|
|`item_id`|`uuid, PK, not null, FK -> order_items.item_id`|Dòng sản phẩm của Order.|
|`item_role`|`smallint, PK, not null`|Vai trò trong kết quả: 1 đã giao; 2 còn lại; 3 trả về; 4 đã thu hồi.|
|`request_id`|`uuid, nullable, FK -> order_requests.request_id`|Request nguồn để trace requested -> actual khi có.|
|`request_item_id`|`uuid, nullable, FK -> request_items.request_item_id`|Dòng request nguồn khi có.|
|`quantity`|`integer, not null`|Số lượng thực tế được xác nhận.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm ghi chi tiết.|

### Ràng buộc chính

- `quantity > 0`.
- Result, Item và Request nếu có phải cùng Order.
- `request_item_id IS NULL OR request_id IS NOT NULL`.
- Khi có `request_item_id`, dòng đó phải thuộc đúng `request_id` và tham chiếu cùng `item_id`.

### Chỉ mục chính

- `idx_result_items_item (item_id, result_id)`.
- `idx_result_items_request (request_id, request_item_id) WHERE request_id IS NOT NULL`.

---

## 4.21. `order_status_history`

**Mục đích:** Lưu từng lần Order Status có hiệu lực; không ghi đè lịch sử cũ.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`status_history_id`|`uuid, PK, not null`|ID history.|
|`order_id`|`uuid, not null, FK -> orders.order_id`|Order đổi trạng thái.|
|`from_status_code`|`varchar(20), nullable, FK -> order_statuses.status_code`|Trạng thái trước transition; `NULL` chỉ cho history đầu tiên khi Order mới được tạo.|
|`status_code`|`varchar(20), not null, FK -> order_statuses.status_code`|Trạng thái được ghi.|
|`version_no`|`integer, not null`|Version trạng thái tăng dần theo Order, bắt đầu từ `1`.|
|`tracking_event_id`|`uuid, nullable, FK -> tracking_events.event_id`|Tracking event dẫn tới transition khi có.|
|`request_id`|`uuid, nullable, FK -> order_requests.request_id`|Business request dẫn tới transition khi có.|
|`reason_code`|`varchar(50), nullable`|Mã nguyên nhân.|
|`reason`|`text, nullable`|Diễn giải.|
|`changed_by_actor_type`|`smallint, not null`|Actor áp dụng transition: `1` — Shop; `2` — nội bộ; `3` — hệ thống; `4` — NVC/integration.|
|`changed_by_actor_ref`|`varchar(100), nullable`|Mã actor/hệ thống áp dụng transition khi có.|
|`changed_at`|`timestamptz, not null`|Thời điểm trạng thái bắt đầu có hiệu lực.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm ghi lịch sử.|

### Ràng buộc chính

- `UNIQUE (order_id, version_no)`.
- `version_no > 0`; `changed_by_actor_type IN (1,2,3,4)`.
- `version_no = 1` yêu cầu `from_status_code IS NULL`; `version_no > 1` yêu cầu `from_status_code IS NOT NULL` và khác `status_code`.
- `tracking_event_id` và `request_id` nếu có phải thuộc cùng Order.

### Chỉ mục chính

- `idx_order_status_history_order_time (order_id, changed_at DESC, version_no DESC)`.
- `idx_order_status_history_status (status_code, changed_at DESC)`.

---

## 4.22. `order_requests`

**Mục đích:** Lưu yêu cầu nghiệp vụ thuộc Order như retry, partial, return, carrier change; không quản lý lifecycle Ticket Support.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`request_id`|`uuid, PK, not null`|ID request.|
|`order_id`|`uuid, not null, FK -> orders.order_id`|Order nhận request.|
|`request_code`|`varchar(50), not null`|Mã request nghiệp vụ để API/tra soát.|
|`request_type`|`varchar(40), not null`|Business key của loại request, ví dụ `WAYBILL_BOOKING`, `TRANSPORT_RETRY`, `PARTIAL`, `RETURN`, `CARRIER_CHANGE`. `WAYBILL_BOOKING` có thể do System tạo để theo dõi booking tự động lúc tạo Order.|
|`request_status`|`smallint, not null`|1 tiếp nhận; 2 đang xử lý; 3 thành công; 4 thất bại; 5 hủy.|
|`payload_version`|`integer, not null, default 1`|Version schema của `request_payload`.|
|`request_payload`|`jsonb, not null`|Payload business đã chuẩn hóa; chỉ chứa dữ liệu request thực sự biến đổi theo loại.|
|`reason_code`|`varchar(50), nullable`|Mã lý do request.|
|`reason`|`text, nullable`|Lý do/ghi chú nghiệp vụ.|
|`source_type`|`smallint, not null`|Nguồn request: 1 Web; 2 App; 3 API; 4 nội bộ; 5 hệ thống.|
|`requested_by_actor_type`|`smallint, not null`|1 Shop; 2 nội bộ; 3 hệ thống; 4 integration.|
|`requested_by_actor_ref`|`varchar(100), nullable`|Mã actor nguồn.|
|`requested_by_display_name`|`varchar(200), not null`|Tên snapshot của actor.|
|`requested_at`|`timestamptz, not null`|Thời điểm request được tạo.|
|`result_code`|`varchar(50), nullable`|Kết quả cuối của request khi có.|
|`result_reason_code`|`varchar(50), nullable`|Mã nguyên nhân kết quả.|
|`result_reason`|`text, nullable`|Diễn giải kết quả.|
|`completed_at`|`timestamptz, nullable`|Thời điểm request kết thúc.|
|`correlation_id`|`varchar(100), not null`|Correlation ID của request.|
|`version_no`|`integer, not null, default 1`|Optimistic lock của Request, bắt đầu từ `1`.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm ghi record.|
|`updated_at`|`timestamptz, not null, default now()`|Cập nhật gần nhất.|

### Ràng buộc chính

- `request_status IN (1,2,3,4,5)`.
- `payload_version > 0`; `version_no > 0`; `requested_by_actor_type IN (1,2,3,4)`.
- `source_type IN (1,2,3,4,5)`.
- `request_payload` phải là JSON object.
- `UNIQUE (order_id, request_code)`.
- `completed_at IS NULL OR completed_at >= requested_at`.
- `request_status IN (1,2)` yêu cầu `completed_at IS NULL`; `request_status IN (3,4,5)` yêu cầu `completed_at IS NOT NULL`.
- `request_status = 3` yêu cầu `result_code` khác rỗng; `request_status = 4` yêu cầu `result_reason_code` hoặc `result_reason` có giá trị.

### Chỉ mục chính

- `idx_order_requests_order_type_status (order_id, request_type, request_status, requested_at DESC)`.
- `idx_order_requests_correlation (correlation_id)`.

---

## 4.23. `request_targets`

**Mục đích:** Lưu đối tượng cụ thể mà request tác động; dùng FK typed thay vì một `target_id` mơ hồ.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`request_target_id`|`uuid, PK, not null`|ID target.|
|`order_id`|`uuid, not null`|Order chung.|
|`request_id`|`uuid, not null, FK -> order_requests.request_id`|Request cha.|
|`target_type`|`request_target_type, not null`|Loại đối tượng đích của request.|
|`party_id`|`uuid, nullable, FK -> order_parties.party_id`|Party target.|
|`address_id`|`uuid, nullable, FK -> order_addresses.address_id`|Address target.|
|`goods_id`|`uuid, nullable, FK -> order_goods.goods_id`|Goods snapshot target.|
|`leg_id`|`uuid, nullable, FK -> order_legs.leg_id`|Stage target.|
|`waybill_id`|`uuid, nullable, FK -> waybills.waybill_id`|Waybill target.|
|`attempt_id`|`uuid, nullable, FK -> transport_attempts.attempt_id`|Transport Attempt target.|
|`handover_id`|`uuid, nullable, FK -> handovers.handover_id`|Handover target.|
|`external_ref_id`|`uuid, nullable, FK -> external_refs.external_ref_id`|Reference module ngoài target.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm ghi target.|

### Ràng buộc chính

- Đúng **một** cột target FK phải có giá trị theo `target_type`.
- Target và Request phải cùng Order.
- Không dùng một UNIQUE nhiều cột nullable để chống trùng. Migration tạo partial UNIQUE riêng theo từng `target_type`, ví dụ `(request_id, leg_id) WHERE target_type = 'LEG'::request_target_type`, `(request_id, waybill_id) WHERE target_type = 'WAYBILL'::request_target_type` và tương tự cho các loại còn lại.

### Chỉ mục chính

- `idx_request_targets_request (request_id)`.
- `idx_request_targets_leg (leg_id) WHERE leg_id IS NOT NULL`.
- `idx_request_targets_waybill (waybill_id) WHERE waybill_id IS NOT NULL`.

---

## 4.24. `request_items`

**Mục đích:** Lưu item/quantity được yêu cầu cho partial/return/exchange khi request cần chi tiết theo sản phẩm.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`request_item_id`|`uuid, PK, not null`|ID dòng request item.|
|`order_id`|`uuid, not null`|Order chung.|
|`request_id`|`uuid, not null, FK -> order_requests.request_id`|Request cha.|
|`item_id`|`uuid, not null, FK -> order_items.item_id`|Item của Order được yêu cầu.|
|`item_role`|`smallint, not null`|Vai trò item trong request: 1 đã giao; 2 còn lại; 3 trả về; 4 đã thu hồi.|
|`quantity`|`integer, not null`|Số lượng được yêu cầu.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm ghi dòng.|

### Ràng buộc chính

- `quantity > 0`.
- `item_role IN (1,2,3,4)`.
- Item và Request phải cùng Order.
- `UNIQUE (request_id, item_id, item_role)`.
- Tổng quantity theo Item/vai trò trong Request không được vượt quantity của snapshot `order_items`; enforce trong transaction/domain validation.

### Chỉ mục chính

- `idx_request_items_request (request_id)`.
- `idx_request_items_item (item_id)`.

### Ghi chú

- Đã bỏ các field hàng thay thế mới (`product_ref`, `sku`, `item_name`...) khỏi baseline vì API hiện tại không còn nhận danh sách replacement/pickup-back item mới.

---

## 4.25. `request_steps`

**Mục đích:** Lưu các bước cần retry/tra soát độc lập trong một business request nhiều bước.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`request_step_id`|`uuid, PK, not null`|ID step.|
|`order_id`|`uuid, not null`|Order chung.|
|`request_id`|`uuid, not null, FK -> order_requests.request_id`|Request cha.|
|`request_target_id`|`uuid, nullable, FK -> request_targets.request_target_id`|Target cụ thể của step khi có.|
|`step_no`|`integer, not null`|Thứ tự step trong request.|
|`step_type`|`varchar(50), not null`|Business/technical key của step.|
|`step_status`|`request_step_status, not null`|Trạng thái Step: `PENDING`, `PROCESSING`, `SUCCESS`, `FAILED`, `UNKNOWN`, `CANCELLED`.|
|`carrier_code`|`integer, nullable, REF -> Carrier Registry`|NVC được gọi ở step; bắt buộc với `CREATE_WAYBILL`.|
|`result_waybill_id`|`uuid, nullable, FK -> waybills.waybill_id`|Waybill được cấp khi step `CREATE_WAYBILL` thành công; không tạo Waybill nếu chưa có mã NVC.|
|`correlation_id`|`varchar(100), nullable`|Correlation ID khi step gọi dependency.|
|`external_ref`|`varchar(150), nullable`|Reference request/operation tại dependency.|
|`request_hash`|`char(64), nullable`|Hash request gửi dependency để tra soát idempotency.|
|`result_code`|`varchar(50), nullable`|Mã kết quả xác định gần nhất.|
|`attempt_count`|`integer, not null, default 0`|Số lần worker/flow đã thử xử lý step.|
|`next_retry_at`|`timestamptz, nullable`|Thời điểm sớm nhất được retry nếu policy cho phép.|
|`last_error_code`|`varchar(50), nullable`|Mã lỗi gần nhất.|
|`last_error`|`text, nullable`|Chi tiết lỗi gần nhất.|
|`started_at`|`timestamptz, nullable`|Thời điểm bắt đầu xử lý.|
|`completed_at`|`timestamptz, nullable`|Thời điểm kết thúc xác định.|
|`version_no`|`integer, not null, default 1`|Optimistic lock của step, bắt đầu từ `1`.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm tạo step.|
|`updated_at`|`timestamptz, not null, default now()`|Cập nhật gần nhất.|

### Ràng buộc chính

- `step_no > 0`.
- `attempt_count >= 0`; `version_no > 0`.
- `UNIQUE (request_id, step_no)`.
- `completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at`.
- `step_status = 'PENDING'` yêu cầu `started_at IS NULL`, `completed_at IS NULL`; `step_status = 'PROCESSING'` yêu cầu `started_at IS NOT NULL`, `completed_at IS NULL`.
- `step_status IN ('SUCCESS','FAILED','CANCELLED')` yêu cầu `completed_at IS NOT NULL`; `step_status = 'UNKNOWN'` có thể chưa có `completed_at` khi đang chờ tra soát.
- `step_type = 'CREATE_WAYBILL'` yêu cầu `carrier_code IS NOT NULL`.
- `step_type = 'CREATE_WAYBILL' AND step_status = 'SUCCESS'` yêu cầu `result_waybill_id IS NOT NULL`; các trạng thái khác yêu cầu `result_waybill_id IS NULL`.
- `step_type = 'CREATE_WAYBILL' AND step_status = 'FAILED'` yêu cầu `last_error_code` khác rỗng.
- `result_waybill_id` nếu có phải thuộc cùng `order_id`; enforce bằng composite FK `(order_id, result_waybill_id) -> waybills(order_id, waybill_id)`.

### Chỉ mục chính

- `idx_request_steps_status_retry (step_status, next_retry_at) WHERE step_status IN ('PENDING','FAILED','UNKNOWN')`.
- `idx_request_steps_request (request_id, step_no)`.
- `idx_request_steps_waybill_creation (order_id, step_status, updated_at DESC) WHERE step_type = 'CREATE_WAYBILL'`.
- `idx_request_steps_result_waybill (result_waybill_id) WHERE result_waybill_id IS NOT NULL`.

### Ghi chú

- Mapping bộ lọc `waybill.creation_results`: `PENDING/PROCESSING` → đang xử lý; `SUCCESS` → thành công; `FAILED` → lỗi; `UNKNOWN` → chưa xác định. `CANCELLED` không được tính là lần tạo Waybill thành công.
- Booking tự động khi tạo Order phải có `order_requests.request_type = 'WAYBILL_BOOKING'` do System tạo; retry/đổi NVC/hoàn dùng request nghiệp vụ tương ứng nhưng đều tạo step `CREATE_WAYBILL`.
- Chỉ tạo record `waybills` và gán `result_waybill_id` sau khi NVC đã cấp `carrier_waybill_code`. Timeout/failed/unknown chỉ tồn tại tại `request_steps` cùng reference Carrier, không tạo Waybill giả.

---

## 4.26. `order_adjustments`

**Mục đích:** Lưu history before/after của thay đổi business đã thực sự áp dụng lên Order.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`adjustment_id`|`uuid, PK, not null`|ID adjustment.|
|`order_id`|`uuid, not null, FK -> orders.order_id`|Order bị thay đổi.|
|`request_id`|`uuid, nullable, FK -> order_requests.request_id`|Business request nguồn khi có.|
|`external_ref_id`|`uuid, nullable, FK -> external_refs.external_ref_id`|Ticket/đối tượng module khác làm nguồn khi có.|
|`leg_id`|`uuid, nullable, FK -> order_legs.leg_id`|Stage bị tác động khi có.|
|`waybill_id`|`uuid, nullable, FK -> waybills.waybill_id`|Waybill bị tác động khi có.|
|`adjustment_type`|`varchar(50), not null`|Loại thay đổi, ví dụ ADDRESS_CHANGED, COD_CHANGED, CARRIER_CHANGED.|
|`before_data`|`jsonb, nullable`|Giá trị trước thay đổi ở các field liên quan.|
|`after_data`|`jsonb, not null`|Giá trị sau thay đổi.|
|`reason_code`|`varchar(50), nullable`|Mã lý do.|
|`reason`|`text, nullable`|Lý do.|
|`applied_by_actor_type`|`smallint, not null`|Actor áp dụng: `1` — Shop; `2` — nội bộ; `3` — hệ thống; `4` — integration/Support.|
|`applied_by_actor_ref`|`varchar(100), nullable`|Mã actor/hệ thống áp dụng khi có.|
|`applied_by_display_name`|`varchar(200), not null`|Tên snapshot actor/hệ thống áp dụng.|
|`applied_at`|`timestamptz, not null`|Thời điểm thay đổi có hiệu lực.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm ghi history.|

### Ràng buộc chính

- `applied_by_actor_type IN (1,2,3,4)`.
- `before_data IS NULL OR jsonb_typeof(before_data) = 'object'`; `jsonb_typeof(after_data) = 'object'` và `after_data <> '{}'`.
- Request, External Ref, Leg và Waybill nếu có phải thuộc cùng Order.
- Record là immutable business audit; không UPDATE `before_data`, `after_data`, actor hoặc thời điểm sau khi tạo.

### Chỉ mục chính

- `idx_adjustments_order_time (order_id, applied_at DESC)`.
- `idx_adjustments_request (request_id) WHERE request_id IS NOT NULL`.
- `idx_adjustments_external_ref (external_ref_id) WHERE external_ref_id IS NOT NULL`.

---

## 4.27. `order_notes`

**Mục đích:** Lưu ghi chú cộng tác cấp toàn Order; không gắn Note trực tiếp với Leg/Waybill/Ticket.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`note_id`|`uuid, PK, not null`|ID nội bộ.|
|`note_code`|`varchar(50), not null, UK`|Mã Note trả qua API.|
|`order_id`|`uuid, not null, FK -> orders.order_id`|Order chứa Note.|
|`note_type`|`smallint, not null`|1 chung; 2 lấy hàng; 3 giao hàng; 4 hoàn/trả.|
|`visibility_scope`|`smallint, not null`|1 Shop và nội bộ được phép; 2 chỉ nội bộ. Field này không public trong API.|
|`content`|`text, not null`|Nội dung ghi chú.|
|`created_actor_type`|`smallint, not null`|1 người dùng Shop; 2 nội bộ; 3 hệ thống.|
|`created_actor_code`|`varchar(100), not null`|Mã người/hệ thống tạo.|
|`created_display_name`|`varchar(200), not null`|Tên snapshot của người/hệ thống tạo.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm tạo Note.|

### Ràng buộc chính

- `note_type IN (1,2,3,4)`.
- `visibility_scope IN (1,2)`.
- `created_actor_type IN (1,2,3)`.
- `length(trim(content)) > 0`.

### Chỉ mục chính

- `uq_order_notes_note_code (note_code)`.
- `idx_order_notes_order_time (order_id, created_at DESC)`.
- `idx_order_notes_order_type (order_id, note_type, created_at DESC)`.

### Ghi chú

- API hiện tại không hỗ trợ sửa/xóa Note; record là append-only.

---

## 4.28. `activity_logs`

**Mục đích:** Timeline/audit tổng hợp; dùng một envelope chung cho mọi nhóm hoạt động.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`activity_id`|`uuid, PK, not null`|ID activity ổn định.|
|`order_id`|`uuid, not null, FK -> orders.order_id`|Order liên quan.|
|`sequence_no`|`bigint, not null`|Số thứ tự tăng dần trong Order để phân xử cùng timestamp.|
|`activity_group`|`smallint, not null`|Nhóm activity 1..12 theo API.|
|`activity_key`|`varchar(80), not null`|Khóa hành động ổn định, ví dụ `ORDER_STATUS_CHANGED`.|
|`activity_name`|`varchar(150), not null`|Tên loại hoạt động.|
|`title`|`varchar(250), not null`|Tiêu đề ngắn trên timeline.|
|`description`|`text, not null`|Diễn giải dễ hiểu.|
|`result`|`smallint, not null`|1 success; 2 failed; 3 processing; 4 informational.|
|`actor_type`|`activity_actor_type, not null`|Chủ thể tạo activity.|
|`actor_code`|`varchar(100), nullable`|Mã actor nếu có.|
|`actor_name`|`varchar(200), not null`|Tên snapshot actor.|
|`source_type`|`activity_source_type, not null`|Kênh/nguồn phát sinh activity.|
|`source_application_name`|`varchar(150), nullable`|Tên application nguồn.|
|`source_application_version`|`varchar(50), nullable`|Version application nguồn khi có.|
|`source_ip`|`inet, nullable`|IP nguồn nếu được phép lưu.|
|`changes`|`jsonb, not null, default '[]'`|Danh sách field/value trước-sau theo Activity API.|
|`references`|`jsonb, not null, default '[]'`|Danh sách Ticket/Request/Image/Print/Waybill/Stage... liên quan.|
|`correlation_id`|`varchar(100), nullable`|Correlation ID phục vụ trace.|
|`occurred_at`|`timestamptz, not null`|Thời điểm activity thực tế xảy ra.|
|`recorded_at`|`timestamptz, not null, default now()`|Thời điểm SuperPlatform ghi nhận.|

### Ràng buộc chính

- `UNIQUE (order_id, sequence_no)`.
- `sequence_no > 0`.
- `activity_group BETWEEN 1 AND 12`.
- `result IN (1,2,3,4)`.
- `changes` và `references` phải là JSON array. Mỗi phần tử `changes` phải có field/key cùng before/after theo schema version của Activity; mỗi reference phải có `ref_type` và `ref_code` khác rỗng.
- Activity là append-only; không cập nhật ngược nội dung timeline sau khi ghi, correction được biểu diễn bằng Activity mới.

### Chỉ mục chính

- `idx_activity_logs_order_time (order_id, occurred_at DESC, sequence_no DESC)`.
- `idx_activity_logs_order_group (order_id, activity_group, occurred_at DESC)`.
- `idx_activity_logs_correlation (correlation_id) WHERE correlation_id IS NOT NULL`.

### Ghi chú

- Không tách `activity_changes`/`activity_references` thành bảng riêng ở baseline này; hai danh sách là audit envelope và không có lifecycle độc lập.

---

## 4.29. `order_images`

**Mục đích:** Lưu metadata/reference ảnh thuộc Order; binary và signed URL thuộc File Service.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`image_id`|`uuid, PK, not null`|ID nội bộ ảnh gắn Order.|
|`image_code`|`varchar(50), not null, UK`|Mã ảnh ổn định dùng trong API.|
|`order_id`|`uuid, not null, FK -> orders.order_id`|Order chứa ảnh.|
|`file_ref`|`varchar(150), not null, REF -> PLATFORM_STORAGE`|Reference binary tại nền tảng lưu trữ file dùng chung.|
|`image_type`|`order_image_type, not null`|Mục đích nghiệp vụ của ảnh.|
|`description`|`varchar(500), nullable`|Mô tả ảnh.|
|`visibility_scope`|`smallint, not null`|1 Shop và nội bộ được phép; 2 chỉ nội bộ.|
|`source_type`|`smallint, not null`|1 Shop; 2 nội bộ; 3 NVC/shipper; 4 integration.|
|`source_name`|`varchar(200), not null`|Tên snapshot của nguồn cung cấp ảnh.|
|`carrier_code`|`integer, nullable, REF -> Carrier Registry`|NVC nguồn khi ảnh do NVC/shipper cung cấp.|
|`leg_id`|`uuid, nullable, FK -> order_legs.leg_id`|Stage mà ảnh phát sinh hoặc làm bằng chứng khi xác định được.|
|`waybill_id`|`uuid, nullable, FK -> waybills.waybill_id`|Waybill liên quan khi xác định được.|
|`attempt_id`|`uuid, nullable, FK -> transport_attempts.attempt_id`|Lần thực hiện lấy/giao/hoàn/trả mà ảnh thuộc về khi xác định được.|
|`result_id`|`uuid, nullable, FK -> order_results.result_id`|Kết quả nghiệp vụ mà ảnh làm bằng chứng khi xác định được.|
|`status`|`smallint, not null, default 1`|1 ATTACHED; 2 REMOVED.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm Order ghi nhận ảnh.|
|`removed_at`|`timestamptz, nullable`|Thời điểm gỡ ảnh khỏi hiển thị khi có.|
|`removed_by_actor_type`|`smallint, nullable`|Actor gỡ ảnh: `1` — Shop; `2` — nội bộ; `3` — hệ thống.|
|`removed_by_actor_ref`|`varchar(100), nullable`|Mã actor gỡ ảnh khi có.|

### Ràng buộc chính

- `visibility_scope IN (1,2)`.
- `source_type BETWEEN 1 AND 4`.
- `status IN (1,2)`.
- `source_type = 3` yêu cầu `carrier_code IS NOT NULL`.
- `status = 1` yêu cầu `removed_at IS NULL`, `removed_by_actor_type IS NULL`, `removed_by_actor_ref IS NULL`.
- `status = 2` yêu cầu `removed_at IS NOT NULL` và `removed_by_actor_type IN (1,2,3)`.
- Chỉ ảnh `source_type = 1` do Shop thêm mới được gỡ qua API Shop; ảnh nguồn khác chỉ thay đổi bởi workflow có quyền tương ứng.
- Leg, Waybill, Transport Attempt và Result nếu có phải thuộc cùng Order; enforce bằng composite FK/cùng-Order validation trong migration.
- `attempt_id` nếu có phải thuộc `leg_id` khi cả hai được khai báo; `result_id` nếu có phải nhất quán với `leg_id`, `waybill_id`, `attempt_id` context được khai báo trên ảnh.

### Chỉ mục chính

- `uq_order_images_image_code (image_code)`.
- `idx_order_images_order_status_time (order_id, status, created_at DESC)`.
- `idx_order_images_leg (leg_id, created_at DESC) WHERE leg_id IS NOT NULL`.
- `idx_order_images_waybill (waybill_id) WHERE waybill_id IS NOT NULL`.
- `idx_order_images_attempt (attempt_id, created_at DESC) WHERE attempt_id IS NOT NULL`.
- `idx_order_images_result (result_id, created_at DESC) WHERE result_id IS NOT NULL`.

### Ghi chú

- Không lưu `image_url`; URL có thời hạn được lấy từ File Service.
- Ảnh có thể chỉ thuộc Order hoặc đồng thời mang context Stage/Waybill/Attempt/Result. Không bắt buộc tạo context giả khi nguồn chưa xác định chắc chắn được đối tượng chi tiết.

---

## 4.30. `external_refs`

**Mục đích:** Lưu tham chiếu Order tới Support/Incident/Claim/Rating/Booking Attempt/Operational object mà Order không sở hữu.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`external_ref_id`|`uuid, PK, not null`|ID reference nội bộ.|
|`order_id`|`uuid, not null, FK -> orders.order_id`|Order liên quan.|
|`module_code`|`varchar(40), not null`|Mã module sở hữu đối tượng ngoài theo shared module-code contract.|
|`ref_type`|`varchar(50), not null`|Loại reference, ví dụ SUPPORT_TICKET, CLAIM, INCIDENT, BOOKING_ATTEMPT.|
|`external_id`|`varchar(150), not null`|ID/code tại module sở hữu.|
|`parent_external_ref_id`|`uuid, nullable, FK -> external_refs.external_ref_id`|Reference cha/nguồn khi cần thể hiện lineage.|
|`leg_id`|`uuid, nullable, FK -> order_legs.leg_id`|Stage context nếu có.|
|`waybill_id`|`uuid, nullable, FK -> waybills.waybill_id`|Waybill context nếu có.|
|`carrier_code`|`integer, nullable, REF -> Carrier Registry`|NVC context nếu có.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm ghi reference.|

### Ràng buộc chính

- `UNIQUE (order_id, module_code, ref_type, external_id)`.
- `parent_external_ref_id IS NULL OR parent_external_ref_id <> external_ref_id`.
- Parent External Ref, Leg và Waybill nếu có phải thuộc cùng Order.
- `module_code`, `ref_type`, `external_id` không được là chuỗi rỗng; `module_code` phải hợp lệ theo shared module-code contract. Bảng chỉ giữ reference/lineage, không sao chép lifecycle đối tượng ngoài Order.

### Chỉ mục chính

- `idx_external_refs_order_type (order_id, ref_type)`.
- `idx_external_refs_external (module_code, ref_type, external_id)`.

---

## 4.31. `order_batches`

**Mục đích:** Lưu một lô tạo Order sau bước parse/validate; không lưu file nguồn/kết quả.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`batch_id`|`uuid, PK, not null`|ID nội bộ Batch.|
|`batch_code`|`varchar(50), not null, UK`|Mã Batch công khai để tra cứu.|
|`shop_id`|`uuid, not null, REF -> Shop`|Shop sở hữu Batch; cùng datatype với `orders.shop_id` và là căn cứ Data Scope.|
|`status`|`smallint, not null, default 1`|Trạng thái Batch theo API: `1` — đang xử lý, gồm dòng chờ/đang chạy; `2` — hoàn tất; `3` — hoàn tất có dòng lỗi; `4` — thất bại toàn Batch.|
|`total_rows`|`integer, not null`|Tổng số dòng trong validation snapshot được tiếp nhận; bắt buộc lớn hơn `0`.|
|`success_rows`|`integer, not null, default 0`|Số dòng tạo Order thành công.|
|`failed_rows`|`integer, not null, default 0`|Số dòng thất bại.|
|`processing_rows`|`integer, not null`|Số dòng đang chờ hoặc đang được xử lý; khi vừa tạo bằng `total_rows`.|
|`failure_code`|`varchar(50), nullable`|Mã lỗi cấp Batch khi `status = 4`; khác lỗi riêng của từng Batch Item.|
|`failure_reason`|`text, nullable`|Diễn giải lỗi cấp Batch khi không thể tiếp tục xử lý toàn lô.|
|`created_by_actor_type`|`smallint, not null`|Loại actor tạo Batch: `1` — người dùng Shop; `2` — nhân viên nội bộ; `3` — ứng dụng đối tác; `4` — hệ thống SuperPlatform.|
|`created_by_actor_ref`|`varchar(100), nullable`|Mã actor.|
|`created_by_display_name`|`varchar(200), not null`|Tên snapshot người/hệ thống tạo.|
|`created_application_id`|`varchar(100), not null, REF -> User Module Application`|Application tạo Batch; cùng datatype/reference với `orders.created_application_id`.|
|`created_client_id`|`varchar(100), not null, REF -> User Module Client`|Client tạo Batch; cùng datatype/reference với `orders.created_client_id`.|
|`correlation_id`|`varchar(100), not null`|Correlation ID của thao tác tạo Batch.|
|`version_no`|`integer, not null, default 1`|Optimistic lock của Batch, bắt đầu từ `1`.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm tạo Batch.|
|`started_at`|`timestamptz, nullable`|Thời điểm bắt đầu xử lý.|
|`completed_at`|`timestamptz, nullable`|Thời điểm kết thúc.|
|`updated_at`|`timestamptz, not null, default now()`|Cập nhật gần nhất.|

### Ràng buộc chính

- `status IN (1,2,3,4)`; `created_by_actor_type IN (1,2,3,4)`; `version_no > 0`.
- `total_rows > 0`; các counter `>= 0`.
- `success_rows + failed_rows + processing_rows = total_rows`.
- `status = 2` yêu cầu `success_rows = total_rows`, `failed_rows = 0`, `processing_rows = 0`.
- `status = 3` yêu cầu `failed_rows > 0` và `processing_rows = 0`.
- `status = 4` yêu cầu `failed_rows = total_rows`, `processing_rows = 0` và `failure_code` khác rỗng.
- `status <> 4` yêu cầu `failure_code IS NULL` và `failure_reason IS NULL`.
- `completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at`.
- `status IN (2,3,4)` yêu cầu `completed_at IS NOT NULL`; `status = 1` yêu cầu `completed_at IS NULL`.

### Chỉ mục chính

- `uq_order_batches_batch_code (batch_code)`.
- `idx_order_batches_shop_created (shop_id, created_at DESC)`.
- `idx_order_batches_status_updated (status, updated_at DESC)`.

### Ghi chú

- Bỏ `batch_type`, `template_version`, `source_file_ref`, `result_file_ref`, `params` khỏi baseline API hiện tại.
- API parse và validate không tạo Batch. Khi toàn bộ dòng hợp lệ, Validation Token đại diện đúng Shop, Actor, `address_model` và snapshot toàn bộ dòng đã kiểm tra.
- Validation Token không lưu plaintext trong PostgreSQL Order DB. Orchestration store/Redis phải lưu token hash, Shop/Actor binding, `address_model`, snapshot rows, `input_schema_version`, snapshot hash, `expires_at` và trạng thái consume; bắt buộc TTL, consume-once và atomic consume cùng transaction tạo `order_batches`/`batch_items`.
- Khi tạo Batch thành công, toàn bộ validation snapshot được copy bền vững vào `batch_items`; token đã consume không được sử dụng lại.

---

## 4.32. `batch_items`

**Mục đích:** Lưu dữ liệu đầu vào đã validate và current result của từng dòng tạo Order.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`batch_item_id`|`uuid, PK, not null`|ID dòng Batch.|
|`batch_id`|`uuid, not null, FK -> order_batches.batch_id`|Batch cha.|
|`row_number`|`integer, not null`|Số dòng gốc trong file/bảng dữ liệu nguồn, lớn hơn `1` vì dòng đầu là header.|
|`order_id`|`uuid, nullable, FK -> orders.order_id`|Order đã tạo khi thành công.|
|`soc`|`varchar(100), nullable`|Mã đơn riêng của Shop dùng nhận diện, tìm kiếm và xuất kết quả dòng.|
|`receiver_name`|`varchar(200), not null`|Tên người nhận snapshot dùng nhận diện dòng.|
|`receiver_phone`|`varchar(32), not null`|Số điện thoại người nhận trong snapshot dòng Batch; masking và phân quyền đọc thực hiện tại tầng API/application.|
|`status`|`smallint, not null, default 1`|Kết quả dòng theo API: `1` — đang xử lý, gồm pending/claimed; `2` — thành công; `3` — thất bại.|
|`input_data`|`jsonb, not null`|Dữ liệu create-order cuối cùng đã validate cho dòng.|
|`input_schema_version`|`integer, not null, default 1`|Phiên bản schema của `input_data`.|
|`input_hash`|`varchar(128), not null`|Hash của input canonical đã validate để kiểm tra tính toàn vẹn snapshot.|
|`result_data`|`jsonb, nullable`|Kết quả trả về cần cho Batch API khi thành công.|
|`errors`|`jsonb, not null, default '[]'`|Danh sách lỗi của dòng theo schema `column_code` nullable, `code` và `message` bắt buộc; `[]` khi đang xử lý hoặc thành công.|
|`attempt_count`|`integer, not null, default 0`|Số lần worker thử xử lý.|
|`available_at`|`timestamptz, not null, default now()`|Thời điểm sớm nhất được claim/retry.|
|`claimed_by`|`varchar(100), nullable`|Worker đang claim.|
|`claim_until`|`timestamptz, nullable`|Hạn lease.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm tạo item.|
|`updated_at`|`timestamptz, not null, default now()`|Cập nhật gần nhất.|

### Ràng buộc chính

- `row_number > 1`.
- `status IN (1,2,3)`; `input_schema_version > 0`; `input_hash` không rỗng.
- `attempt_count >= 0`.
- `UNIQUE (batch_id, row_number)`.
- Partial `UNIQUE (order_id) WHERE order_id IS NOT NULL`: một Order chỉ là kết quả của một Batch Item.
- `receiver_phone` không được là chuỗi rỗng và phải được Backend chuẩn hóa trước khi lưu.
- `input_data` phải là JSON object; `errors` phải là JSON array. Mỗi phần tử lỗi là object có `code`, `message` khác rỗng và `column_code` nullable.
- `status = 1` yêu cầu `order_id IS NULL` và `errors = '[]'`.
- `status = 2` yêu cầu `order_id IS NOT NULL` và `errors = '[]'`.
- `status = 3` yêu cầu `order_id IS NULL` và `jsonb_array_length(errors) > 0`.
- Order được tạo thành công phải có cùng `shop_id` với Batch; enforce trong transaction/service và migration trigger nếu profile triển khai cho phép.

### Chỉ mục chính

- `idx_batch_items_batch_status (batch_id, status, row_number)`.
- `idx_batch_items_worker (status, available_at, claim_until)`.
- `idx_batch_items_order (order_id) WHERE order_id IS NOT NULL`.
- `idx_batch_items_soc (batch_id, soc) WHERE soc IS NOT NULL`.

---

## 4.33. `batch_item_attempts`

**Mục đích:** Lưu từng lần worker xử lý một Batch Item để không ghi đè attempt cũ.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`batch_item_attempt_id`|`uuid, PK, not null`|ID attempt.|
|`batch_item_id`|`uuid, not null, FK -> batch_items.batch_item_id`|Batch Item cha.|
|`attempt_no`|`integer, not null`|Số lần xử lý.|
|`status`|`smallint, not null`|1 processing; 2 success; 3 failed.|
|`result_data`|`jsonb, nullable`|Kết quả riêng của attempt khi cần tra soát.|
|`errors`|`jsonb, not null, default '[]'`|Lỗi của attempt theo cùng JSON schema với `batch_items.errors`; `[]` khi đang xử lý hoặc thành công.|
|`worker_ref`|`varchar(100), nullable`|Worker thực hiện.|
|`started_at`|`timestamptz, not null`|Thời điểm bắt đầu.|
|`completed_at`|`timestamptz, nullable`|Thời điểm kết thúc.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm ghi attempt.|

### Ràng buộc chính

- `attempt_no > 0`.
- `status IN (1,2,3)`.
- `UNIQUE (batch_item_id, attempt_no)`.
- `completed_at IS NULL OR completed_at >= started_at`.
- `errors` phải là JSON array; mỗi phần tử là object có `code`, `message` khác rỗng và `column_code` nullable.
- `status = 1` yêu cầu `completed_at IS NULL` và `errors = '[]'`.
- `status = 2` yêu cầu `completed_at IS NOT NULL` và `errors = '[]'`.
- `status = 3` yêu cầu `completed_at IS NOT NULL` và `jsonb_array_length(errors) > 0`.

### Chỉ mục chính

- `idx_batch_attempts_item_no (batch_item_id, attempt_no DESC)`.

---

## 4.34. `order_slas`

**Mục đích:** Lưu current projection SLA SuperPlatform cam kết với Shop trên toàn Order; có thể dựng lại từ policy/source event và không có SLA theo Leg/Milestone.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`sla_id`|`uuid, PK, not null`|ID SLA record.|
|`order_id`|`uuid, not null, FK -> orders.order_id, UK`|Order được đánh giá SLA.|
|`is_applicable`|`boolean, not null`|`true` nếu Order áp dụng SLA; `false` khi policy xác định không áp dụng.|
|`not_applicable_reason_code`|`smallint, nullable`|Lý do không áp dụng; baseline 1 = policy không áp dụng SLA.|
|`not_applicable_reason`|`varchar(255), nullable`|Diễn giải khi `is_applicable = false`.|
|`sla_code`|`varchar(50), nullable`|Mã snapshot SLA do SuperPlatform tạo; có khi áp dụng SLA.|
|`sla_name`|`varchar(150), nullable`|Tên SLA hiển thị.|
|`policy_code`|`varchar(100), not null`|Mã policy SLA đã áp dụng/đánh giá.|
|`policy_version`|`integer, not null`|Phiên bản policy.|
|`source_module`|`varchar(40), not null`|Mã module phát nguồn dữ liệu/policy SLA theo shared module-code contract.|
|`source_ref`|`varchar(150), nullable`|Reference event/request nguồn gần nhất.|
|`source_version`|`bigint, not null`|Version nguồn đã áp dụng để chống event đến trễ ghi đè projection mới.|
|`route_type`|`smallint, not null`|1 nội tỉnh; 2 nội miền; 3 liên miền; 4 liên vùng; 5 tuyến khác.|
|`started_at`|`timestamptz, nullable`|Thời điểm bắt đầu tính SLA.|
|`expected_from`|`timestamptz, nullable`|Thời điểm hoàn thành sớm nhất.|
|`expected_to`|`timestamptz, nullable`|Thời điểm hoàn thành muộn nhất.|
|`completed_at`|`timestamptz, nullable`|Thời điểm Order hoàn thành theo rule SLA.|
|`result`|`smallint, nullable`|1 trong hạn; 2 quá hạn; 3 hoàn thành đúng hạn; 4 hoàn thành quá hạn.|
|`difference_minutes`|`integer, nullable`|Phút lệch so với `expected_to`; âm còn thời gian, dương quá hạn.|
|`version_no`|`integer, not null, default 1`|Optimistic lock của current projection.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm tạo snapshot SLA.|
|`updated_at`|`timestamptz, not null, default now()`|Thời điểm đánh giá/cập nhật gần nhất.|

### Ràng buộc chính

- `route_type IN (1,2,3,4,5)`.
- `policy_version > 0`.
- `source_version > 0`; `version_no > 0`; bỏ qua source event có version không lớn hơn version đã áp dụng.
- `result IS NULL OR result IN (1,2,3,4)`.
- `is_applicable = false` yêu cầu `not_applicable_reason_code`, `not_applicable_reason` khác rỗng và `sla_code`, `sla_name`, `started_at`, `expected_from`, `expected_to`, `completed_at`, `result`, `difference_minutes` đều `NULL`.
- `is_applicable = true` yêu cầu `sla_code`, `sla_name`, `started_at`, `expected_from`, `expected_to`, `result` không `NULL`.
- `expected_to IS NULL OR expected_from IS NULL OR expected_to >= expected_from`.
- Projection chỉ nhận update theo `source_version` tăng dần và phải có khả năng rebuild từ nguồn chuẩn.

### Chỉ mục chính

- `uq_order_slas_order (order_id)`.
- `idx_order_slas_result_expected (result, expected_to) WHERE is_applicable = true`.

---

## 4.35. `waybill_slas`

**Mục đích:** Lưu SLA/đối chiếu giữa NVC và SuperPlatform theo từng Carrier Waybill; không suy ra từ Stage.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`waybill_sla_id`|`uuid, PK, not null`|ID SLA Waybill.|
|`order_id`|`uuid, not null`|Order chung.|
|`waybill_id`|`uuid, not null, FK -> waybills.waybill_id, UK`|Waybill được đánh giá.|
|`carrier_code`|`integer, not null, REF -> Carrier Registry`|NVC sở hữu Waybill.|
|`carrier_client_code`|`varchar(100), nullable`|Tài khoản NVC được dùng.|
|`service_flow`|`smallint, not null`|1 giao hàng; 2 hoàn/trả.|
|`route_type`|`smallint, not null`|1 nội tỉnh; 2 nội miền; 3 liên miền; 4 liên vùng; 5 tuyến khác.|
|`commitment_level`|`smallint, not null`|1 cam kết; 2 tham khảo; 3 không tính SLA.|
|`source_module`|`varchar(40), not null`|Mã module phát nguồn dữ liệu/policy SLA Waybill theo shared module-code contract.|
|`source_ref`|`varchar(150), nullable`|Reference event/request nguồn gần nhất.|
|`source_version`|`bigint, not null`|Version nguồn đã áp dụng để chống ghi đè bởi event đến trễ.|
|`standard_min_days`|`numeric(6,2), not null`|Số ngày tối thiểu theo policy; hỗ trợ 0.5 ngày.|
|`standard_max_days`|`numeric(6,2), not null`|Số ngày tối đa theo policy trước điều chỉnh.|
|`additional_days`|`numeric(6,2), not null, default 0`|Tổng ngày cộng thêm đã áp dụng.|
|`time_basis`|`smallint, not null`|1 ngày lịch; 2 ngày làm việc; 3 giờ liên tục; 4 lịch vận hành NVC.|
|`started_at`|`timestamptz, not null`|Thời điểm bắt đầu tính.|
|`expected_from`|`timestamptz, not null`|Mốc hoàn thành sớm nhất.|
|`expected_to`|`timestamptz, not null`|Mốc hoàn thành muộn nhất.|
|`completed_at`|`timestamptz, nullable`|Thời điểm kết thúc thực tế để đối chiếu.|
|`result`|`waybill_sla_result, not null`|Kết quả SLA Waybill bằng named ENUM.|
|`difference_minutes`|`integer, nullable`|Phút lệch so với `expected_to`; bỏ khi không có ý nghĩa.|
|`adjustments`|`jsonb, not null, default '[]'`|Danh sách adjustment đã áp dụng: type, additional_days, reason, effective_from/to.|
|`version_no`|`integer, not null, default 1`|Optimistic lock của projection SLA.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm tạo.|
|`updated_at`|`timestamptz, not null, default now()`|Cập nhật gần nhất.|

### Ràng buộc chính

- `service_flow IN (1,2)`.
- `route_type IN (1,2,3,4,5)`.
- `commitment_level IN (1,2,3)`.
- `time_basis IN (1,2,3,4)`.
- `source_version > 0`; `version_no > 0`; bỏ qua source event có version không lớn hơn version đã áp dụng.
- `standard_min_days >= 0 AND standard_max_days >= standard_min_days AND additional_days >= 0`.
- `expected_to >= expected_from`.
- `order_id` và `waybill_id` phải cùng Order; enforce bằng composite FK `(order_id, waybill_id) -> waybills(order_id, waybill_id)`.
- `adjustments` là JSON array; mỗi phần tử có `type`, `additional_days >= 0`, `reason`, `effective_from`, `effective_to`; tổng `additional_days` của các phần tử bằng cột `additional_days`.
- `commitment_level = 2` yêu cầu `result = 'REFERENCE_ONLY'`; `commitment_level = 3` yêu cầu `result = 'NOT_APPLICABLE'`; `commitment_level = 1` chỉ dùng `result IN ('WITHIN_DUE','OVERDUE','COMPLETED_ON_TIME','COMPLETED_LATE')`.

### Chỉ mục chính

- `uq_waybill_slas_waybill (waybill_id)`.
- `idx_waybill_slas_carrier_result (carrier_code, result, expected_to)`.

### Ghi chú

- Giữ `adjustments` trong `jsonb` ở baseline 37 bảng vì adjustment chỉ là snapshot giải thích SLA, chưa có lifecycle/query độc lập đủ để tạo thêm bảng.

---

## 4.36. `idempotency_records`

**Mục đích:** Chống cùng request hợp lệ tạo business effect trùng.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`idempotency_id`|`uuid, PK, not null`|ID record.|
|`scope_key`|`varchar(150), not null`|Phạm vi áp dụng key, ví dụ operation + shop/client.|
|`idempotency_key`|`varchar(200), not null`|Key do consumer/gateway cung cấp.|
|`request_hash`|`char(64), not null`|Hash request canonical để phát hiện cùng key nhưng payload khác.|
|`status`|`smallint, not null`|1 processing; 2 completed; 3 failed.|
|`resource_type`|`varchar(40), nullable`|Loại resource đã tạo, ví dụ ORDER/BATCH/REQUEST.|
|`resource_ref`|`varchar(100), nullable`|ID/code resource đã tạo.|
|`http_status`|`smallint, nullable`|HTTP status của kết quả đã cache.|
|`result_code`|`varchar(50), nullable`|Business result/error code.|
|`response_meta`|`jsonb, nullable`|Metadata tối thiểu cần để trả lại kết quả cũ; không lưu secret.|
|`lease_until`|`timestamptz, nullable`|Lease khi request đang được xử lý.|
|`expires_at`|`timestamptz, not null`|Thời điểm record được phép hết hạn theo policy.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm tạo.|
|`updated_at`|`timestamptz, not null, default now()`|Cập nhật gần nhất.|

### Ràng buộc chính

- `status IN (1,2,3)`.
- `UNIQUE (scope_key, idempotency_key)`.
- `expires_at > created_at`.
- `request_hash ~ '^[0-9a-f]{64}$'`; `scope_key` và `idempotency_key` không rỗng.
- `response_meta IS NULL OR jsonb_typeof(response_meta) = 'object'`; không lưu secret, credential hoặc raw payload nhạy cảm.
- `status = 1` yêu cầu `lease_until IS NOT NULL`, `http_status IS NULL`; `status IN (2,3)` yêu cầu `lease_until IS NULL`, `http_status IS NOT NULL`, `result_code` khác rỗng.
- `resource_type` và `resource_ref` phải cùng có hoặc cùng `NULL`; chỉ gán khi business resource thực sự đã được tạo.

### Chỉ mục chính

- `idx_idempotency_expiry (expires_at)`.
- `idx_idempotency_status_lease (status, lease_until)`.

---

## 4.37. `outbox_events`

**Mục đích:** Lưu event cần phát sau commit để business state và event được ghi atomically trong Order DB.

|Cột|Kiểu / Ràng buộc|Ý nghĩa|
|---|---|---|
|`outbox_event_id`|`uuid, PK, not null`|ID event outbox.|
|`order_id`|`uuid, nullable, FK -> orders.order_id`|Order liên quan khi aggregate thuộc một Order.|
|`aggregate_type`|`varchar(40), not null`|Loại aggregate phát event.|
|`aggregate_id`|`uuid, not null`|ID aggregate.|
|`aggregate_version`|`bigint, nullable`|Business version của aggregate khi có.|
|`event_type`|`varchar(60), not null`|Loại business event.|
|`event_key`|`varchar(220), not null, UK`|Business event identity ổn định chống tạo event trùng.|
|`schema_version`|`integer, not null, default 1`|Version schema payload.|
|`payload`|`jsonb, not null`|Business event payload.|
|`headers`|`jsonb, nullable`|Transport metadata không nhạy cảm.|
|`correlation_id`|`varchar(100), nullable`|Correlation ID để trace xuyên module.|
|`status`|`smallint, not null, default 1`|`1` PENDING; `2` SENDING; `3` SENT; `4` RETRY_WAIT; `5` DEAD_LETTER.|
|`attempt_count`|`integer, not null, default 0`|Số lần worker đã bắt đầu gửi thực tế; tăng khi chuyển PENDING/RETRY_WAIT sang SENDING.|
|`available_at`|`timestamptz, not null, default now()`|Thời điểm sớm nhất được gửi/retry.|
|`claimed_by`|`varchar(100), nullable`|Worker đang claim.|
|`claim_until`|`timestamptz, nullable`|Hạn lease.|
|`last_error`|`text, nullable`|Lỗi gần nhất.|
|`sent_at`|`timestamptz, nullable`|Thời điểm gửi thành công.|
|`dead_lettered_at`|`timestamptz, nullable`|Thời điểm event bị dừng retry và chuyển vào Dead Letter.|
|`created_at`|`timestamptz, not null, default now()`|Thời điểm event được ghi trong business transaction.|

### Ràng buộc chính

- `schema_version > 0`.
- `status IN (1,2,3,4,5)`.
- `attempt_count >= 0`.
- `UNIQUE (event_key)`.
- `aggregate_version IS NULL OR aggregate_version > 0`; `aggregate_type`, `event_type`, `event_key` không rỗng.
- `jsonb_typeof(payload) = 'object'`; `headers IS NULL OR jsonb_typeof(headers) = 'object'`; không ghi secret/credential vào payload hoặc headers.
- `status = 1` (PENDING) yêu cầu `claimed_by`, `claim_until`, `sent_at`, `dead_lettered_at` đều `NULL`.
- `status = 2` (SENDING) yêu cầu `claimed_by`, `claim_until` khác `NULL`; `sent_at`, `dead_lettered_at` phải `NULL`.
- `status = 3` (SENT) yêu cầu `sent_at IS NOT NULL`; lease đã giải phóng và `dead_lettered_at IS NULL`.
- `status = 4` (RETRY_WAIT) yêu cầu `last_error` khác rỗng, `available_at` là thời điểm retry tiếp theo; lease đã giải phóng, `sent_at` và `dead_lettered_at` phải `NULL`.
- `status = 5` (DEAD_LETTER) yêu cầu `last_error` khác rỗng, `dead_lettered_at IS NOT NULL`; lease đã giải phóng và `sent_at IS NULL`.
- `claim_until IS NULL OR claim_until > created_at`; `sent_at IS NULL OR sent_at >= created_at`; `dead_lettered_at IS NULL OR dead_lettered_at >= created_at`.

### Chỉ mục chính

- `idx_outbox_status_available (status, available_at)`.
- `idx_outbox_claim (status, claim_until)`.
- `idx_outbox_dead_letter (dead_lettered_at DESC) WHERE status = 5`.
- `idx_outbox_order_created (order_id, created_at DESC) WHERE order_id IS NOT NULL`.

### Ghi chú

- Outbox dùng at-least-once; consumer phải idempotent theo `outbox_event_id` hoặc business event identity/version.
- Worker chỉ tự động claim event `PENDING` hoặc `RETRY_WAIT` có `available_at <= now()`; `DEAD_LETTER` là terminal đối với worker tự động.
- Lỗi tạm thời chuyển `SENDING -> RETRY_WAIT`; lỗi terminal hoặc vượt giới hạn retry chuyển `SENDING -> DEAD_LETTER`; gửi thành công chuyển `SENDING -> SENT`.
- Event `SENDING` hết lease được recovery về `RETRY_WAIT` theo policy, không chuyển thẳng thành `DEAD_LETTER` chỉ vì worker mất lease.
- Requeue `DEAD_LETTER -> RETRY_WAIT` chỉ được thực hiện bởi thao tác vận hành có quyền và phải ghi audit/activity phù hợp.
- `payload`, `headers`, `event_type`, `event_key` và identity aggregate của event đã commit là bất biến. Nếu nội dung sai, phát correction/replacement event mới thay vì sửa payload cũ.

---

# 5. REFERENCE DATA / ENUM QUAN TRỌNG

## 5.1. Address Model

|Code|Ý nghĩa|
|---:|---|
|1|Địa chỉ 3 cấp: Tỉnh/Thành - Quận/Huyện - Phường/Xã|
|2|Địa chỉ 2 cấp: Tỉnh/Thành - Phường/Xã; `district_code` phải `NULL`|

## 5.2. Order Goods

|Field|Code|Ý nghĩa|
|---|---:|---|
|`content_type`|1|Chỉ khai một tên hàng bằng `product_name`|
|`content_type`|2|Khai danh sách sản phẩm trong `order_items`|
|`tag_codes`|1|Dễ vỡ|
|`tag_codes`|2|Chất lỏng|
|`tag_codes`|3|Giá trị cao|
|`tag_codes`|4|Có pin|
|`tag_codes`|5|Cồng kềnh|

## 5.3. Order Service Codes

|Code|Ý nghĩa|
|---:|---|
|1|Cho phép giao một phần|
|2|Giao hàng mới kết hợp thu hồi hàng cũ|

## 5.4. Leg Type

|Code|Ý nghĩa|
|---:|---|
|1|Lấy hàng|
|2|Giao hàng|
|3|Chuyển hoàn / lấy hàng hoàn|
|4|Trả hàng cuối về Shop/điểm nhận hoàn|

> Một Order có thể có nhiều Stage cùng `leg_type`. `stage_code` và `stage_no` mới là định danh/thứ tự Stage trong Order.

## 5.5. Carrier Code

`carrier_code` luôn là `integer` và là **reference logic** sang Carrier Registry. Order DB không tạo enum/FK vật lý cố định vì danh mục NVC có thể thay đổi. API hiện hành sử dụng các mã như 1, 2, 3, 4, 6, 10, 13... nhưng Dictionary không hard-code danh mục Carrier thành CHECK constraint.

## 5.6. Customer Model và Transport Decision

|Field|Code|Ý nghĩa|
|---|---:|---|
|`customer_model`|1|Mô hình khách hàng địa phương cũ|
|`customer_model`|2|Mô hình khách hàng địa phương mới|
|`customer_model`|3|Mô hình khách hàng toàn quốc|
|`customer_model`|4|Mô hình SuperAI|
|`transport_model`|1|SuperShip lấy và giao toàn trình|
|`transport_model`|2|SuperShip lấy, sau đó bàn giao NVC khác giao|
|`transport_model`|3|NVC toàn quốc trực tiếp lấy và giao|
|`transport_model`|4|SuperAI chọn NVC theo từng Order|
|`selection_mode`|1|Chọn theo cấu hình cố định/ưu tiên/fallback|
|`selection_mode`|2|Hệ thống hoặc SuperAI tự động tối ưu|
|`selection_mode`|3|Người dùng chọn NVC thủ công theo quyền cấu hình|

Các code trên mô tả quyết định đã áp dụng khi tạo Order. Chi tiết tiêu chí, NVC ứng viên, lý do chọn/fallback và trường hợp booking song song thuộc Configuration Decision được tham chiếu bằng `configuration_decision_ref`.

## 5.7. Order Result

|Field|Code|Ý nghĩa|
|---|---:|---|
|`result_type`|1|DELIVERY — kết quả giao hàng tổng hợp của toàn Order|
|`result_type`|2|RETURN — kết quả hoàn/trả tổng hợp của toàn Order|
|`result_type`|3|EXCHANGE — kết quả đổi/thu hồi hàng tổng hợp của toàn Order|
|`result_code`|1|Hoàn thành toàn bộ/thành công|
|`result_code`|2|Hoàn thành một phần|
|`result_code`|3|Thất bại cuối cùng; không còn retry hoặc workflow đã kết luận thất bại|

`result_code` có cùng ý nghĩa tổng quát trong ba `result_type`; chi tiết item-level nằm ở `result_items`, còn lý do nghiệp vụ chi tiết nằm ở `reason_code`/`reason`.

## 5.8. SLA

- `order_slas`: SLA SuperPlatform cam kết với Shop, đánh giá **toàn Order**.
- `waybill_slas`: SLA NVC đối với SuperPlatform, đánh giá **từng Carrier Waybill**.
- Không có SLA theo Leg/Milestone trong baseline này.

---

# 6. QUAN HỆ DỮ LIỆU CHÍNH

```text
orders
├── order_addresses
├── order_parties
├── order_goods
│   └── order_items
├── parcel_measures
├── order_legs
│   ├── leg_endpoints
│   ├── leg_items
│   ├── leg_services
│   └── leg_waybills ────── waybills
│                            └── waybill_slas
├── tracking_events
├── transport_attempts
├── handovers
│   └── handover_attempts
├── operational_assignments
├── order_results
│   └── result_items
├── order_status_history
├── order_requests
│   ├── request_targets
│   ├── request_items
│   └── request_steps
├── order_adjustments
├── order_notes
├── activity_logs
├── order_images
├── external_refs
└── order_slas

order_batches
└── batch_items
    └── batch_item_attempts

idempotency_records
outbox_events
```

---

# 7. QUY TẮC KIỂM TRA TRƯỚC KHI TẠO MIGRATION

- [ ] Tổng số bảng trong schema Order đúng **37**.
- [ ] `carrier_code` ở mọi bảng dùng `integer`.
- [ ] `orders.order_code` đúng 13 chữ số.
- [ ] `orders` lưu đủ snapshot Access Context gồm Shop sở hữu, Identity, Membership, Actor Type/Ref/Name, Application, Client, Channel và Correlation ID; các trường này chỉ lấy từ trusted context.
- [ ] `orders` lưu `customer_model`, `transport_model`, `selection_mode`, Shipping Configuration ref/version và Configuration Decision ref; không suy luận ngược các giá trị này từ Stage/Waybill.
- [ ] Khối lượng kiện dùng gram nguyên (`integer`); chiều dài/rộng/cao dùng centimet nguyên (`integer`) và được chuẩn hóa trước khi ghi.
- [ ] Tập giá trị đóng tối đa 5 lựa chọn dùng `smallint` + `CHECK`; tập đóng từ 6 lựa chọn dùng named `ENUM`; business code/danh mục mở rộng không bị khóa cứng bằng ENUM.
- [ ] Không còn `orders.additional_service` hoặc bảng `order_services`; dùng `orders.service_codes`.
- [ ] Không còn bảng `leg_quotes`; `leg_services` lưu `pricing_result_ref`, `carrier_fee_amount`, `shop_shipping_fee_amount` và `priced_at` theo Stage.
- [ ] Không còn `UNIQUE(order_id, leg_type)`.
- [ ] Address model 2 không yêu cầu District.
- [ ] Waybill tham chiếu đúng snapshot party/address/goods/measure/service đã dùng.
- [ ] Current raw Carrier status chỉ lưu trên `waybills`; `order_legs` chỉ giữ `stage_status_code` chuẩn hóa và `tracking_events` giữ lịch sử sự kiện.
- [ ] `tracking_events.order_sequence_no` duy nhất trong Order; `leg_sequence_no` chỉ có và duy nhất khi event thuộc một Stage.
- [ ] Mỗi `leg_id + role_type` chỉ có tối đa một `operational_assignments` hiện hành; đổi người thực hiện phải đóng dòng cũ trước khi kích hoạt dòng mới.
- [ ] Waybill lưu bất biến `pickup_method`, `fee_payer`, `inspection_type`, các giá trị tiền, delivery note, carrier options an toàn, snapshot schema version và snapshot hash đã dùng khi tạo vận đơn.
- [ ] Không tạo Waybill hoặc Transport Attempt khi NVC chưa cấp `carrier_waybill_code`; Booking Attempt chưa thành công được theo dõi tại `request_steps` và reference Carrier khi có.
- [ ] `request_steps` của `CREATE_WAYBILL` map ổn định sang API: pending/processing → processing, success → success, failed → error, unknown → unknown; success phải trỏ đúng Waybill kết quả, failed phải có error code.
- [ ] `leg_waybills.sequence_no` ổn định và duy nhất trong từng Stage; không suy ra thứ tự API chỉ bằng timestamp.
- [ ] `waybills.carrier_options` không chứa token, secret, signature, credential, Carrier Account ID nhạy cảm hoặc raw HTTP payload.
- [ ] Tracking Event không được dùng thay current Order Status hoặc actual Result.
- [ ] Request không được dùng thay actual Attempt/Result.
- [ ] Không còn bảng `attempts`; dùng `transport_attempts` cho lượt thực hiện vận chuyển lấy/giao/hoàn/trả.
- [ ] `result_items` chỉ dùng khi cần item-level actual outcome; `order_items` vẫn là nội dung/snapshot hàng của Order.
- [ ] `order_results` là aggregate result có version của toàn Order theo DELIVERY/RETURN/EXCHANGE; mỗi loại chỉ có tối đa một version hiện hành và thất bại còn retry không được ghi là thất bại cuối cùng.
- [ ] Note chỉ thuộc Order; không còn `note_links`.
- [ ] Ảnh dùng `order_images`; binary/URL thuộc File Service.
- [ ] `order_images` có thể tham chiếu Stage/Waybill/Attempt/Result; mọi reference nếu có phải thuộc cùng Order và nhất quán context.
- [ ] `label_templates`, `label_versions`, `label_prints`, `print_jobs` và `print_job_orders` không thuộc Order Database; toàn bộ lifecycle in thuộc Print Module (`PRT`).
- [ ] Khi cần tra cứu lịch sử in từ Order, chỉ lưu Activity `LABEL_PRINTED` và/hoặc `external_refs.module_code = 'PRT'`; không sao chép lifecycle hoặc file kết quả Print Job vào Order.
- [ ] `order_batches.status` và `batch_items.status` dùng đúng domain API; ba counter Batch luôn có tổng bằng `total_rows`.
- [ ] `order_batches.shop_id` cùng datatype với `orders.shop_id`; mọi Order tạo từ Batch phải thuộc đúng Shop của Batch.
- [ ] `batch_items.row_number` giữ số dòng nguồn lớn hơn `1`; không dùng số thứ tự mảng thay số dòng file.
- [ ] Batch Item thành công có đúng một `order_id` và `errors = []`; dòng thất bại không có `order_id` và phải có lỗi theo JSON schema.
- [ ] Các cột `phone`/`email` được chuẩn hóa trước khi lưu; API masking theo quyền và không ghi dữ liệu liên hệ vào log kỹ thuật không cần thiết.
- [ ] Validation Token lưu tại temporary orchestration store/Redis với token hash, Shop/Actor binding, snapshot hash, TTL và consume-once; consume atomically khi tạo Batch và Batch Items.
- [ ] Không có bảng Finance projection/ledger trong Order Database; API tài chính lấy dữ liệu hiện hành từ Finance/Reconciliation theo contract tích hợp.
- [ ] SLA chỉ còn Order SLA và Waybill SLA.
- [ ] Order SLA và Waybill SLA lưu hai projection độc lập, có `source_version` chống event đến trễ ghi đè dữ liệu mới và có thể rebuild từ module/policy nguồn.
- [ ] `source_requests/source_syncs` không còn trong Order schema.
- [ ] Idempotency và Outbox vẫn thuộc Order Service.
- [ ] Mọi `source_module`/`module_code` hợp lệ theo shared module-code contract; file/binary dùng namespace `PLATFORM_STORAGE`, không dùng tên tự do như `File Service`.
- [ ] Outbox phân biệt `RETRY_WAIT` và `DEAD_LETTER`; worker không tự động claim Dead Letter, requeue phải có quyền/audit và payload đã commit không được sửa.
- [ ] Migration đặt tên PK/FK/UK/CHECK/Index ổn định theo convention và chạy được trên PostgreSQL profile đã chọn.

---

# 8. KẾT LUẬN BASELINE 0.25.0

Baseline làm việc này chốt **37 bảng** cho `order_mgmt`; toàn bộ bảng 1–37 đã được review chi tiết ở mức Dictionary. Print Module sở hữu cấu hình nhãn, Print Job, render và file kết quả; Order chỉ giữ Activity/external reference khi cần. Snapshot dịch vụ và giá đã áp dụng theo Stage được thống nhất trong `leg_services`, không duy trì `leg_quotes` riêng. Order không lưu Finance ledger hoặc local finance projection; API tài chính đọc dữ liệu hiện hành từ Finance/Reconciliation theo contract tích hợp.

# BACKLOG SEED DATA — MODULE ORDER

## 1. Mục tiêu

Hai người cùng tạo dữ liệu mẫu cho schema `order_mgmt` mà không sửa chung file, không trùng ID và vẫn tuân thủ Database Dictionary `v0.25.0`.

## 2. Quy ước chung

- Mỗi người chỉ sửa file trong thư mục của mình.
- Mỗi kịch bản dùng Order riêng, không tham chiếu dữ liệu của người còn lại.
- Người 1 dùng `order_code` bắt đầu bằng `91`; Người 2 dùng `order_code` bắt đầu bằng `92`.
- Mọi `order_code` phải gồm đúng 13 chữ số, khớp `^[0-9]{13}$`; không chứa chữ, dấu cách, dấu phân cách hoặc ký tự đặc biệt.
- Người 1 dùng UUID bắt đầu bằng `1`; Người 2 dùng UUID bắt đầu bằng `2`.
- UUID phải đúng chuẩn Platform; nếu dùng UUIDv7 thì nibble version phải là `7`.
- Timestamp dùng giá trị UTC cố định, không dùng `now()` trong test data.
- Dùng đúng 45 mã trạng thái SuperPlatform.
- History, Tracking và Attempt chỉ thêm mới, không ghi đè bản ghi cũ.
- Mọi Leg, Waybill, Item, Request, Attempt và Result phải thuộc cùng Order.
- Không sử dụng PII, credential hoặc token thật.
- Dữ liệu phải là dữ liệu nghiệp vụ hợp lệ, khả tín và bám theo danh mục/định dạng thực tế đã được xác nhận; “dữ liệu thật” không có nghĩa là sử dụng PII, credential, token, số điện thoại hoặc thông tin nhận diện của người thật.
- Quy tắc “như dữ liệu thật” áp dụng cho mọi cột, không chỉ Order Code và Waybill: giá trị phải đúng kiểu, đúng format, đúng ngữ nghĩa, đúng ngôn ngữ hiển thị và hợp lý trong toàn bộ quan hệ nghiệp vụ.
- Không dùng placeholder hoặc chuỗi mang dấu hiệu dữ liệu sinh sơ sài như `Test User`, `User 1`, `Nguyen Van A`, `abc`, `xyz`, `foo`, `bar`, `dummy`, `sample`, `lorem ipsum`, `N/A`, `0000000000`, `1234567890`, `test@test.com`, `WB001` hoặc nội dung lặp bằng cách chỉ đổi số thứ tự.
- Không một `order_code`, UUID, Waybill Code, Request Code, Batch Code, Note Code, Image Code, dedupe key, idempotency key hoặc business code nào được trùng trong toàn bộ test seed.
- `carrier_waybill_code` phải đúng định dạng thực tế của NVC tương ứng; không dùng chuỗi giả chung như `WB001`, `TEST123` hoặc cùng một format cho mọi NVC.
- Ngoài ràng buộc DB `UNIQUE (carrier_code, carrier_waybill_code)`, test seed áp dụng quy tắc chặt hơn: một `carrier_waybill_code` không được tái sử dụng ở bất kỳ NVC hoặc Order nào.
- Dữ liệu ngoài Order Module chỉ lưu reference, không tạo FK sang module khác.
- Test seed không dùng `ON CONFLICT DO UPDATE`; trùng dữ liệu phải báo lỗi.

## 3. Cấu trúc thư mục

```text
database_seed/
├── reference_data/
│   └── order_statuses.sql
└── test_data/
    ├── designer_1/
    └── designer_2/
```

## 4. Công việc dùng chung

### COMMON-01 — Hoàn thiện 45 trạng thái

**Người làm:** Người 1  
**Người kiểm tra:** Người 2

- Kiểm tra đủ 45 `status_code` và `status_name`.
- Giữ đúng thứ tự danh sách đã cung cấp.
- `description` để `NULL` nếu chưa có nội dung chính thức.
- `status_group`, `is_terminal`, `is_active` phải được xác nhận trước khi xem là dữ liệu chính thức.
- Seed phải chạy lại được mà không tạo thêm record.

### COMMON-02 — Chốt bộ ID dùng cho test

**Người làm:** Người 2  
**Người kiểm tra:** Người 1

- Chốt Shop ID test.
- Chỉ dùng Carrier Code trong danh sách NVC đã xác nhận dưới đây.
- Chốt range UUID, Order Code, Waybill Code và Request Code.
- Không dùng dữ liệu nhận diện người thật.
- Lập registry dùng chung cho toàn bộ `order_code` và `carrier_waybill_code` trước khi chia việc để hai người không cấp trùng mã.
- Ví dụ mã vận đơn trong bảng chỉ dùng để xác nhận kiểu định dạng; không sao chép nguyên ví dụ làm dữ liệu seed và không tái sử dụng một mã cho nhiều record.

| `carrier_code` | NVC | Ví dụ `carrier_waybill_code` đã xác nhận | Quy tắc seed |
|---:|---|---|---|
| `1` | SuperShip | `STGS983262LM.826941741` | Giữ đúng cấu trúc chữ hoa, chữ số và dấu chấm như mã SuperShip thực tế. |
| `2` | GHN | `GY8YLSDK` | Giữ đúng kiểu mã chữ và số viết hoa của GHN. |
| `3` | J&T Express | `802808938571` | Mã chỉ gồm chữ số theo định dạng J&T Express đã xác nhận. |
| `4` | Viettel Post | `SOO10902766013` | Giữ đúng tiền tố chữ hoa và phần số của Viettel Post. |
| `6` | BEST Express | `999800060099891` | Mã chỉ gồm chữ số theo định dạng BEST Express đã xác nhận. |
| `10` | SPX Express | `SPXVN066263841279` | Giữ đúng tiền tố `SPXVN` và phần số. |
| `13` | Vietnam Post | `CC2199034123VN` | Giữ đúng tiền tố/hậu tố chữ hoa và phần số ở giữa. |
| `15` | Green SM Express | `GSM240819-8921473` | Giữ đúng tiền tố `GSM`, phần số và dấu gạch ngang. |
| `16` | GrabExpress | `DELV-1708923451-A8B9C` | Giữ đúng các nhóm chữ/số viết hoa và dấu gạch ngang. |

Không tự suy diễn Carrier Code mới hoặc thay đổi format từ một ví dụ đơn lẻ. Nếu cần một biến thể mã chưa được contract NVC xác nhận, phải xác nhận bổ sung trước khi seed.

### COMMON-02A — Chuẩn dữ liệu thực tế cho mọi trường

Áp dụng cho toàn bộ reference data và test data:

- **Tên người:** dùng họ tên tiếng Việt tự nhiên, đầy đủ dấu và có cấu trúc họ–tên đệm–tên hợp lý. Các tổ hợp tên phải là danh tính giả lập, không sao chép một hồ sơ người thật và không dùng tên placeholder. Tên của sender, receiver, shipper và actor phải khác nhau khi là các chủ thể khác nhau.
- **Số điện thoại:** đúng 10 chữ số, khớp `^0[0-9]{9}$`, dùng đầu số di động Việt Nam hợp lệ theo danh mục đã xác nhận. Mỗi chủ thể độc lập dùng một số riêng. Chỉ dùng số thuộc allowlist/dải test do dự án kiểm soát; không tự lấy số đang sử dụng của người thật.
- **Email:** đúng cú pháp, local-part tự nhiên và unique khi nghiệp vụ yêu cầu; dùng domain dành cho test hoặc domain do dự án kiểm soát, không dùng mailbox thật của cá nhân.
- **Địa chỉ:** tên tỉnh/thành, quận/huyện, phường/xã, mã hành chính, mô hình hai cấp/ba cấp và `full_address` phải khớp nhau. `address_detail` phải giống địa chỉ Việt Nam có thể hiển thị, không dùng `Địa chỉ 1`, `Test Address` hoặc chuỗi vô nghĩa. Chỉ dùng bộ địa chỉ test đã được xác nhận, không gắn với danh tính người thật.
- **Tọa độ:** latitude/longitude phải nằm trong miền hợp lệ và phù hợp tương đối với tỉnh/thành của địa chỉ; không dùng `(0, 0)` hoặc lặp một tọa độ cho mọi địa chỉ.
- **Tên hàng và SKU:** dùng tên sản phẩm tự nhiên, đơn vị, khối lượng, kích thước, giá trị và tag phù hợp nhau. Không dùng `Sản phẩm A`, `Item 1`, SKU tùy tiện hoặc hàng hóa mâu thuẫn với tag/measure.
- **Tiền:** dùng VND, là số nguyên không âm và có giá trị hợp lý với hàng hóa/dịch vụ. COD, declared value, collection amount, phí NVC và phí Shop phải liên hệ hợp lý; không rải cùng một số tròn cho mọi Order.
- **Khối lượng và kích thước:** dùng số đo khả tín cho loại hàng; length/width/height và weight không được bằng 0 khi nghiệp vụ yêu cầu đo kiện. Số đo lại của NVC có thể khác Shop nhưng phải nằm trong biên hợp lý.
- **Mã nghiệp vụ:** `order_code`, SOC, stage code, request code, attempt code, batch code, note code, image code, correlation ID, external ID và dedupe key phải theo convention ổn định, unique đúng phạm vi và có thể truy vết; không ghép chuỗi ngẫu nhiên thiếu quy ước.
- **Nội dung ghi chú và lý do:** viết tiếng Việt tự nhiên, cụ thể theo tình huống và nhất quán với reason code, trạng thái, attempt hoặc request. Không dùng một nội dung chung cho mọi record.
- **Trạng thái và lịch sử:** trạng thái hiện hành, lịch sử, request, step, attempt, result và activity phải kể cùng một câu chuyện nghiệp vụ; không tạo record chỉ để đủ enum nhưng mâu thuẫn timeline.
- **Thời gian:** dùng UTC cố định nhưng phải có thứ tự khả tín: tạo Order trước Request, Request trước Step/Waybill, `occurred_at <= received_at`, started trước completed, valid_from trước valid_to. Thời lượng lấy/giao/hoàn phải hợp lý, không tăng đều máy móc cho mọi kịch bản.
- **Nguồn và actor:** actor type, actor name, application, client, channel, source module và correlation ID phải khớp nhau; Carrier event không được mang actor/source của Shop và ngược lại.
- **JSON payload:** phải có cấu trúc và nội dung nghiệp vụ thực, khớp các cột canonical; không dùng `{}`, dữ liệu lorem hoặc copy nguyên một payload cho các workflow khác nhau trừ khi field cho phép rỗng.
- **Dữ liệu nhạy cảm:** dữ liệu phải thực tế về hình thức nhưng không được là PII thật, credential thật, token thật, biển số thật hoặc secret. Nếu cần dữ liệu có format hợp lệ, lấy từ fixture allowlist do dự án sở hữu và ghi rõ nguồn fixture.

Mỗi giá trị phải vượt qua validator tương ứng của API/Database và review thủ công về tính hợp lý. Đúng kiểu dữ liệu nhưng sai ngữ nghĩa vẫn được xem là seed không đạt.

### COMMON-03 — Ma trận coverage trạng thái, enum và bảng

**Người làm:** Người 1  
**Người kiểm tra:** Người 2

Tạo file `database_seed/validate_test_data.sql` và tài liệu ma trận coverage đi kèm.

- Mỗi một trong 45 `status_code` phải xuất hiện ít nhất một lần trong `order_status_history` của test data.
- Mỗi trạng thái phải có ít nhất một Order dùng làm current status hoặc một bước lịch sử có thể truy vết.
- Bắt buộc bao phủ các trạng thái trung gian thường dễ bị bỏ sót: `SPF-0301`, `SPF-0502`, toàn bộ `SPF-0601` đến `SPF-0606`, `SPF-0701`, `SPF-0702`, `SPF-1001` đến `SPF-1004`, `SPF-1007` đến `SPF-1009`, `SPF-1101`, `SPF-1102`, và `SPF-1104` đến `SPF-1106`.
- Ma trận phải ánh xạ từng trạng thái, enum quan trọng và mỗi table sang ít nhất một file seed hoặc ghi rõ lý do không áp dụng.
- Validation phải báo danh sách trạng thái chưa được sử dụng, không chỉ trả tổng số.
- Validation phải kiểm tra current status khớp Status History cuối, sequence/version tăng đúng và không có reference chéo sai Order.
- Validation phải kiểm tra mọi `order_code` đúng 13 chữ số và không trùng.
- Validation phải từ chối mọi `carrier_code` ngoài tập `1, 2, 3, 4, 6, 10, 13, 15, 16` tại tất cả bảng có Carrier context.
- Validation phải phát hiện `carrier_waybill_code` trùng trên toàn bảng `waybills`, kể cả khi hai record có `carrier_code` khác nhau.
- Validation phải đối chiếu format Waybill với contract/validator của đúng NVC; không dùng một regex chung cho tất cả NVC.
- Validation phải kiểm tra phone đúng 10 chữ số, email đúng cú pháp, mã hành chính phù hợp Address Model và các trường thời gian không đảo thứ tự.
- Validation phải có truy vấn phát hiện placeholder cấm, giá trị mẫu lặp quá mức và các subject độc lập dùng trùng phone/email ngoài chủ đích.
- Ma trận coverage phải chỉ rõ fixture allowlist dùng cho tên giả lập, phone, email, địa chỉ, tọa độ, mã NVC và các mã nghiệp vụ.
- Các ca cố ý vi phạm constraint phải nằm trong integration test hoặc file validation âm riêng, không nằm trong bộ seed chạy thành công.

## 5. Người 1 — Luồng thành công

Thư mục làm việc:

```text
database_seed/test_data/designer_1/
```

### D1-01 — Order đang tạo vận đơn

Tạo file `001_order_creating.sql`.

- Order ở `SPF-0101`.
- Có sender, receiver, address, goods, item, measure, leg và service.
- Có Request/Step tạo Waybill đang xử lý.
- Chưa có Waybill khi NVC chưa cấp mã.

### D1-02 — Giao hàng thành công

Tạo file `002_delivery_success.sql`.

- Có Waybill hợp lệ.
- Có Tracking từ chờ lấy đến giao thành công.
- Có Attempt lấy và giao.
- Có Status History.
- Có Result giao toàn bộ.
- Trạng thái cuối `SPF-0901`.

### D1-03 — Bàn giao hai NVC

Tạo file `003_multi_carrier_delivery.sql`.

- Có Stage lấy và Stage giao.
- Hai Stage dùng NVC phù hợp.
- Có Handover và Handover Attempt thành công.
- Có hành trình bàn giao, trung chuyển và giao hàng.
- Trạng thái cuối `SPF-0901`.

### D1-04 — Giao một phần

Tạo file `004_partial_delivery.sql`.

- Order có nhiều Item hoặc quantity lớn hơn một.
- Có Request và Request Item giao một phần.
- Có Result Item cho phần đã giao và phần còn lại.
- `orders.delivery_result = 2`.
- Trạng thái cuối `SPF-0902`.

### D1-05 — Batch và dữ liệu kỹ thuật

Tạo file `005_batch_reliability.sql`.

- Có Batch thành công và Batch có dòng lỗi.
- Có Batch Item Attempt.
- Có Idempotency Record hợp lệ.
- Có Outbox Event ở các trạng thái cần kiểm thử.

### D1-06 — Cập nhật thông tin Order

Tạo file `006_update_order.sql`.

- Thay đổi người nhận, địa chỉ, hàng hóa hoặc COD.
- Đóng snapshot cũ bằng `valid_to`.
- Tạo snapshot mới với `version_no` tăng.
- Có `order_adjustments` lưu before/after.
- Không sửa đè lịch sử cũ.

### D1-07 — Đổi NVC và thay Waybill

Tạo file `007_change_carrier.sql`.

- Waybill cũ được kết thúc hiệu lực.
- Waybill mới dùng `replaces_waybill_id`.
- `leg_waybills.sequence_no` tăng đúng.
- Một Stage chỉ có một Waybill hiện hành.
- Request đổi NVC truy vết được.

### D1-08 — Tracking trùng, đến muộn và correction

Tạo file `008_tracking_edge_cases.sql`.

- Có event trùng để kiểm tra dedupe.
- Có event đến muộn nhưng không làm lùi current status.
- Có correction tham chiếu event cũ.
- `order_sequence_no` và `leg_sequence_no` vẫn hợp lệ.

Lưu ý: record vi phạm unique không đưa vào seed chạy thành công; đặt câu lệnh kiểm thử lỗi trong file validation riêng.

### D1-09 — Các trường hợp SLA

Tạo file `009_sla_cases.sql`.

- SLA đúng hạn.
- SLA hoàn thành trễ.
- SLA đang quá hạn.
- SLA chỉ tham khảo.
- SLA không áp dụng và có đầy đủ lý do.
- Phân biệt rõ SLA cam kết với Shop ở `order_slas` và SLA NVC ở `waybill_slas`.
- Bao phủ đủ `waybill_sla_result`: `WITHIN_DUE`, `OVERDUE`, `COMPLETED_ON_TIME`, `COMPLETED_LATE`, `REFERENCE_ONLY`, `NOT_APPLICABLE`.
- Có một Order chứa nhiều Waybill với kết quả SLA khác nhau và vẫn giữ SLA của Waybill đã bị thay thế.
- Có trường hợp phát sinh `additional_days` và `adjustments`.

### D1-10 — Biến thể kế hoạch vận chuyển

Tạo file `010_transport_variants.sql`.

- Shop tự mang hàng tới điểm tiếp nhận với `pickup_method = 2`.
- Một Waybill phục vụ nhiều Stage của cùng Order.
- Có trường hợp địa chỉ hành chính 3 cấp.
- Có trường hợp địa chỉ hành chính 2 cấp.
- Không tạo Handover nếu nghiệp vụ không phát sinh bàn giao thực tế.

### D1-11 — Ngữ cảnh tạo Order và mô hình khách hàng

Tạo file `011_creation_contexts.sql`.

- Có Order bao phủ đủ `created_channel`: `WEB`, `MOBILE`, `PARTNER_API`, `INTERNAL`, `BATCH`, `SYSTEM`.
- Nguồn Marketplace phải được ánh xạ theo contract đã chốt; không tự thêm enum ngoài DDL.
- Lưu đúng Shop, Actor, Application, Client và correlation ID.
- Có đủ mô hình khách hàng: địa phương cũ, địa phương mới, toàn quốc và SuperAI.
- Có các cách chọn NVC: cấu hình cố định, hệ thống tự chọn và người dùng chọn.
- Lưu configuration decision, configuration version và pricing reference đã áp dụng.

### D1-12 — Ba cấp trạng thái và vị trí hành trình

Tạo file `012_status_levels_and_locations.sql`.

- Order Status, Stage Status và raw Carrier Status có giá trị riêng, không dùng lẫn nhau.
- Waybill lưu raw status code, raw status name và thời điểm NVC phát sinh.
- Tracking lưu `occurred_at` và `received_at` khác nhau khi event đến trễ.
- Có tỉnh/thành, phường/xã, Hub hoặc bưu cục khi nguồn cung cấp.
- Current Order/Stage Status không bị lùi bởi raw event đến muộn.

### D1-13 — Ghi chú và Activity Log

Tạo file `013_notes_and_activities.sql`.

- Có đủ `note_type`: chung, lấy hàng, giao hàng và hoàn/trả.
- Ghi chú vận hành nội bộ dùng `visibility_scope = 2`, không tạo thêm loại Note ngoài Dictionary.
- Có visibility phù hợp cho Shop và nội bộ.
- Activity bao phủ tạo Order, cập nhật, đổi NVC, retry, thay đổi COD, thêm/gỡ ảnh và thêm ghi chú.
- Có external reference tới Print Job khi cần thể hiện hoạt động in; không tạo bảng Print trong Order DB.
- Activity sequence tăng đúng và không thay thế Tracking Event.

### D1-14 — Pricing, phí và tham chiếu Finance

Tạo file `014_pricing_finance_refs.sql`.

- Order có `pricing_code` đã áp dụng.
- Leg Service có phí NVC, phí bán cho Shop và thời điểm định giá phù hợp.
- Có external reference tới Finance cho COD, đối soát hoặc bồi thường.
- Không seed ledger, bút toán hoặc giao dịch thanh toán vào Order DB.
- Không đưa dữ liệu tài chính ngoài các cột/reference mà Database Dictionary cho phép.

### D1-15 — Ma trận hàng hóa và lựa chọn giao nhận

Tạo file `015_goods_and_delivery_options.sql`.

- Có `content_type = 1` chỉ dùng `product_name` và không tạo `order_items`.
- Có `content_type = 2` dùng danh sách `order_items`, gồm trường hợp có và không có Product/SKU reference.
- Bao phủ các tag hàng hóa: dễ vỡ, chất lỏng, giá trị cao, có pin và cồng kềnh.
- Bao phủ `pickup_method` NVC đến lấy và Shop tự gửi tại điểm tiếp nhận.
- Bao phủ đủ `fee_payer` và ba giá trị `inspection_type`.
- Có COD bằng 0, COD dương, giá trị khai giá bằng 0 và giá trị khai giá dương.
- Có Order có và không có lịch lấy hàng; có địa chỉ có và không có tọa độ.
- Có số đo do Shop khai báo và số đo NVC đo lại ở cấp Order, Leg hoặc Waybill mà không ghi đè dữ liệu cũ.

### D1-16 — Dữ liệu tìm kiếm, lọc và response rỗng

Tạo file `016_search_filter_read_models.sql`.

- Có dữ liệu tra cứu được bằng Order Code, SOC, Waybill Code và số điện thoại test.
- Có nhiều Order cùng Shop và khác Shop để kiểm tra Data Scope.
- Có nhiều record cùng `created_at` để kiểm tra phân trang và sắp xếp ổn định bằng khóa phụ.
- Có Order nhiều Stage để lọc theo đồng thời nhiều điều kiện Stage.
- Có carrier hiện hành khác carrier lịch sử và raw carrier status khác trạng thái chuẩn.
- Có dữ liệu lọc theo địa chỉ hai cấp/ba cấp, nguồn tạo, dịch vụ, COD, sự cố và external reference Support/Claim.
- Có Order hợp lệ nhưng không có shipper, note, image hoặc SLA để kiểm tra empty response.
- Chỉ seed dữ liệu nguồn thuộc Order; không tạo bảng projection tìm kiếm ngoài baseline.

## 6. Người 2 — Luồng lỗi và hoàn

Thư mục làm việc:

```text
database_seed/test_data/designer_2/
```

### D2-01 — Tạo Waybill lỗi

Tạo file `001_waybill_failed.sql`.

- Order ở `SPF-0102`.
- Step tạo Waybill thất bại và có error code.
- Không tạo Waybill giả.

### D2-02 — Không tìm được tài xế

Tạo file `002_driver_not_found.sql`.

- Có `SPF-0302` trước `SPF-0303`.
- Có các lần thử tìm tài xế phù hợp.
- Trạng thái cuối `SPF-0303`.

### D2-03 — Lấy hàng thất bại và retry

Tạo file `003_pickup_retry.sql`.

- Đi qua `SPF-0401`, `SPF-0402`, `SPF-0403`.
- Có ít nhất hai Pickup Attempt.
- Attempt cũ được giữ lại.
- Trạng thái cuối `SPF-0501`.

### D2-04 — Giao hàng thất bại và retry

Tạo file `004_delivery_retry.sql`.

- Đi qua `SPF-0801`, `SPF-0802`, `SPF-0803`.
- Có Request giao lại và Attempt mới.
- Trạng thái cuối `SPF-0901`.

### D2-05 — Hủy Order

Tạo file `005_cancel_order.sql`.

- Một Order hủy thành công ở `SPF-0201`.
- Một Order hủy NVC lỗi ở `SPF-0202`.
- Có hủy trước khi tạo Waybill và hủy sau khi đã có Waybill.
- Có hủy đang chờ NVC và hủy có Step `UNKNOWN` sau timeout; không kết luận hủy thành công khi kết quả chưa xác định.
- Có kết quả tra soát sau `UNKNOWN` trên Order riêng.
- Có hủy bị từ chối do trạng thái không cho phép và trường hợp lý do khác có nội dung bắt buộc.
- Có actor Shop và actor System/Internal để kiểm tra nguồn thao tác.
- Không xóa Waybill hoặc lịch sử cũ.

### D2-06 — Chuyển hoàn thành công

Tạo file `006_return_success.sql`.

- Có Request chuyển hoàn và xác nhận chuyển hoàn.
- Có Return Leg và Waybill chiều hoàn.
- Có Tracking/Attempt chiều hoàn.
- Có Result hoàn/trả.
- Timeline đầy đủ đi qua các trạng thái phù hợp từ `SPF-1001`, `SPF-1002`, `SPF-1003`, `SPF-1004`, `SPF-1007`, `SPF-1008`, `SPF-1009` đến nhóm `SPF-1101`, `SPF-1102`, `SPF-1104`, `SPF-1105`, `SPF-1106`.
- Có một luồng hoàn trực tiếp và một luồng hoàn qua NVC/điểm trung gian nếu mô hình vận chuyển áp dụng.
- Trạng thái cuối `SPF-1201`.

### D2-07 — Kết quả tạo Waybill chưa xác định

Tạo file `007_waybill_unknown.sql`.

- Request Step ở trạng thái `UNKNOWN`.
- Chưa tạo Waybill khi chưa chắc NVC đã cấp mã.
- Có dữ liệu correlation và external reference để tra soát.
- Có kết quả sau tra soát ở một Order riêng: thành công hoặc thất bại.
- Không tạo hai Waybill do retry mù quáng.

### D2-08 — Thay đổi shipper hoặc phương tiện

Tạo file `008_reassign_shipper.sql`.

- Đóng assignment cũ bằng `valid_to`.
- Tạo assignment mới.
- Giữ lịch sử shipper và phương tiện cũ.
- Không có hai assignment hiện hành cùng `leg_id + role_type`.

### D2-09 — Chuyển hoàn thất bại và retry

Tạo file `009_return_retry.sql`.

- Có trường hợp lấy hàng hoàn thất bại `SPF-1005`.
- Có yêu cầu lấy lại hàng hoàn `SPF-1006`.
- Có trường hợp trả NVC hoàn cuối thất bại `SPF-1103`.
- Có trường hợp trả hàng thất bại và yêu cầu trả lại `SPF-1107`, `SPF-1108`.
- Mỗi lần retry tạo Attempt mới, không ghi đè Attempt cũ.

### D2-10 — Đổi trả và trả một phần

Tạo file `010_exchange_partial_return.sql`.

- Một Order đổi trả thành công ở `SPF-1202`.
- Một Order trả một phần ở `SPF-1203`.
- Request Item và Result Item có quantity hợp lệ.
- Tổng quantity không vượt quantity của Order Item.
- `delivery_result` và `exchange_result` khớp kết quả thực tế.

### D2-11 — Ảnh và external reference

Tạo file `011_images_external_refs.sql`.

- Bao phủ đủ `image_type`: `GOODS`, `PICKUP`, `DELIVERY`, `RETURN`, `DAMAGE_INCIDENT`, `OTHER`.
- Có ảnh do Shop tải lên, ảnh do Carrier cung cấp, ảnh Shop-visible và ảnh internal-only.
- Ảnh có thể tham chiếu đúng Leg, Waybill, Attempt hoặc Result.
- Có trường hợp ảnh đã được gỡ hợp lệ.
- Có nhiều ảnh được gỡ trong cùng một yêu cầu; tính nguyên tử khi một mã ảnh không hợp lệ được kiểm tra bằng integration test.
- Có external reference tới Support, Claim hoặc Finance.
- Không tạo FK vật lý sang module ngoài.

### D2-12 — Trạng thái kỹ thuật nâng cao

Tạo file `012_technical_states.sql`.

- Idempotency ở trạng thái đang xử lý, thành công và thất bại.
- Có idempotency hết hạn.
- Outbox có `PENDING`, `SENDING`, `SENT`, `RETRY_WAIT`, `DEAD_LETTER`.
- Lease, thời gian gửi và dead-letter phù hợp từng trạng thái.

Các trường hợp cùng idempotency key nhưng khác request hash và cập nhật đồng thời cùng `version_no` phải được kiểm tra bằng integration test; không đưa record cố ý vi phạm constraint vào seed chạy thành công.

### D2-13 — Cập nhật Order cần NVC xác nhận

Tạo file `013_update_with_carrier_confirmation.sql`.

- Có yêu cầu đổi địa chỉ, người nhận hoặc COD sau khi đã có Waybill.
- Khi NVC chưa xác nhận, snapshot chính thức chưa bị thay đổi.
- Khi NVC xác nhận thành công, tạo snapshot/version mới và ghi Adjustment.
- Khi NVC trả lỗi, giữ dữ liệu cũ và lưu kết quả request.
- Có external reference tới Support Ticket khi cần CS xử lý; Support vẫn sở hữu lifecycle Ticket.

### D2-14 — Đổi hàng theo hướng dẫn

Tạo file `014_exchange_instruction.sql`.

- Ghi hướng dẫn đổi hàng bằng Note hoặc Request payload phù hợp.
- Có COD mới nếu nghiệp vụ yêu cầu.
- Không tạo danh sách sản phẩm đổi mới ngoài baseline.
- Theo dõi kết quả đổi hàng trên Order.
- Trạng thái hoàn tất là `SPF-1202` khi đổi trả thành công.

### D2-15 — Batch validation nhiều loại kết quả

Tạo file `015_batch_validation_cases.sql`.

- Có dòng hợp lệ và dòng lỗi.
- Có dữ liệu địa chỉ hai cấp và ba cấp.
- Có Batch thành công toàn bộ, thành công một phần và thất bại toàn bộ.
- Counter của Batch khớp số Batch Item.
- Retry tạo Batch Item Attempt mới, không ghi đè lần cũ.
- File XLSX và file kết quả chỉ lưu reference nếu Dictionary có cột phù hợp; không lưu binary.

### D2-16 — Bàn giao thất bại, hủy và retry

Tạo file `016_handover_failure_retry.sql`.

- Có Handover đang thực hiện và Handover Attempt đầu tiên thất bại với error code/reason.
- Order đi qua `SPF-0601`, `SPF-0602`, `SPF-0603`, `SPF-0604`, sau đó retry thành công qua `SPF-0605` và `SPF-0606`.
- Retry tạo Handover Attempt mới, không ghi đè Attempt cũ.
- Có một Handover bị hủy hợp lệ và giữ nguyên dữ liệu hai Leg/Waybill liên quan.
- Attempt thành công phải tham chiếu hai Waybill khác nhau của hai NVC.
- Handover, Attempt, Request và Tracking đều thuộc cùng Order.

### D2-17 — Trạng thái Request, Step, Target và Assignment

Tạo file `017_request_assignment_matrix.sql`.

- Bao phủ đủ trạng thái Request theo Dictionary và đủ Step: `PENDING`, `PROCESSING`, `SUCCESS`, `FAILED`, `UNKNOWN`, `CANCELLED`.
- Có Request nhiều Step; Step lỗi/unknown có `attempt_count` và `next_retry_at` phù hợp.
- Bao phủ đủ `request_targets`: `PARTY`, `ADDRESS`, `GOODS`, `LEG`, `WAYBILL`, `ATTEMPT`, `HANDOVER`, `EXTERNAL_REF`.
- Bao phủ đủ năm `operational_assignments.role_type` và các kiểu kết thúc hoàn thành, thay thế hoặc hủy.
- Có Assignment liên kết Waybill/Attempt và Assignment liên kết Handover/Handover Attempt khi phù hợp.
- Có NVC không cung cấp thông tin shipper; trường hợp này không tạo Assignment giả.
- Dữ liệu liên hệ phải là dữ liệu test đã che; không lưu biển số thật hoặc plaintext nhạy cảm.

### D2-18 — Kết quả nghiệp vụ thất bại cuối cùng

Tạo file `018_terminal_failure_results.sql`.

- Có `order_results.result_code = 3` cho giao hàng thất bại cuối cùng và không còn retry.
- Có `order_results.result_code = 3` cho hoàn/trả thất bại cuối cùng.
- Có `order_results.result_code = 3` cho đổi/thu hồi thất bại cuối cùng.
- Phân biệt rõ Attempt thất bại còn được retry với Result thất bại đã kết luận workflow.
- Result có reason/source phù hợp, liên kết đúng Leg, Waybill, Attempt hoặc Request.
- Nếu có Result Item, tổng quantity theo vai trò không vượt quantity của Order Item.

## 7. Kiểm tra sau khi hoàn thành

Mỗi người tự kiểm tra:

- SQL chạy thành công trên PostgreSQL 16.
- Không trùng UUID hoặc business code.
- Order Code nằm đúng phạm vi được giao, gồm đúng 13 chữ số và unique toàn bộ dataset.
- Chỉ sử dụng `carrier_code` thuộc danh sách NVC đã xác nhận.
- Mọi `carrier_waybill_code` đúng format của NVC tương ứng và unique toàn bộ dataset, không chỉ unique trong từng NVC.
- Current status khớp Status History cuối.
- Sequence và Version tăng đúng.
- Không có hai snapshot hiện hành cùng loại.
- Không có reference sang sai Order.
- Không có PII hoặc secret thật.
- Không có placeholder, chuỗi vô nghĩa hoặc dữ liệu chỉ thay số thứ tự; tên, địa chỉ, hàng hóa, ghi chú và lý do phải tự nhiên, có dấu và đúng ngữ cảnh.
- Mọi số điện thoại đúng 10 chữ số, thuộc fixture allowlist và unique theo chủ thể; email/địa chỉ/tọa độ vượt qua validator tương ứng.
- Tiền, COD, phí, khối lượng, kích thước và thời gian hợp lý với kịch bản, không chỉ thỏa CHECK constraint.
- Đủ 45/45 trạng thái trong `order_status_history`; validation in rõ mã còn thiếu nếu chưa đủ.
- Các enum/check-list quan trọng có coverage theo ma trận hoặc có lý do không áp dụng.
- Các table trong baseline có ít nhất một record hợp lệ, trừ table được ghi rõ không cần cho bộ scenario đang chạy.
- Không có hai Waybill hoặc Assignment hiện hành vi phạm phạm vi unique nghiệp vụ.
- Request/Result Item không vượt quantity của Order Item.
- Batch counter khớp số Batch Item và trạng thái từng dòng.
- Tracking correction, Waybill replacement và External Ref parent không tự tham chiếu hoặc tạo chuỗi sai Order.
- Có dữ liệu đủ để kiểm tra public tracking nhưng việc che tên, điện thoại và địa chỉ phải được kiểm tra ở API/integration test.
- Search, filter, export, Print render, Support lifecycle và Finance ledger không được giả lập như dữ liệu thuộc quyền sở hữu Order.

Sau đó hai người review chéo file của nhau và chạy toàn bộ seed trên một database rỗng.

Các kiểm thử âm sau phải đặt trong integration test hoặc script validation riêng và chạy trong transaction có rollback:

- Trùng UUID, business code, tracking dedupe key hoặc outbox event key.
- Order Code không đủ 13 chữ số, chứa ký tự không phải số hoặc nằm ngoài range người tạo được giao.
- Carrier Code ngoài danh sách đã xác nhận, Waybill sai format NVC hoặc Waybill Code trùng giữa hai NVC khác nhau.
- Tên hoặc nội dung placeholder; phone không đủ 10 chữ số, sai đầu số, không thuộc allowlist hoặc bị dùng lại cho các chủ thể độc lập.
- Địa chỉ/mã hành chính/tọa độ không khớp; hàng hóa, số đo, COD hoặc phí phi thực tế và mâu thuẫn nhau.
- Timeline đảo thứ tự, actor/source không khớp workflow hoặc JSON payload mâu thuẫn với các cột canonical.
- Hai snapshot, Waybill hoặc Assignment cùng hiện hành trong phạm vi không được phép.
- Reference giữa hai Order khác nhau hoặc correction/replacement sai Order.
- Request/Result Item vượt quantity của Order Item.
- Handover có cùng Leg hoặc cùng NVC ở hai phía.
- Idempotency key giống nhau nhưng request hash khác.
- Hai cập nhật đồng thời dùng cùng `version_no`.
- Gỡ nhiều ảnh có một mã không hợp lệ nhưng lại commit một phần.
- Batch counter không khớp số dòng thực tế.

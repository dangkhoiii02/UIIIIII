# Order DataSeed

Nguồn chuẩn và quyết định áp dụng được ghi tại `DATASEED_SOURCES.md`; registry
NVC nằm tại `CARRIER_FIXTURES.md`; trạng thái hoàn thành nằm tại `COVERAGE.md`;
ma trận endpoint nằm tại `API_COVERAGE.md`.

Chạy trên một PostgreSQL 16 database rỗng qua Docker:

```bash
ORDER_DB_CONTAINER=order-local-postgres-1 \
ORDER_DB_NAME=supership-superplatform-order-db \
ORDER_DB_USER=order_admin \
./database_seed/run_with_docker.sh
```

Script bật `ON_ERROR_STOP`, lần lượt chạy DDL, 45 reference statuses, các
scenario D1/D2, UI showcase, batch validator và strict global validator. Một lần chạy đầy đủ
phải đạt 37/37 bảng có dữ liệu, 45/45 trạng thái trong Status History và 45/45
trạng thái hiện tại trên 51 Order để kiểm tra danh sách UI. DDL
không được thiết kế để chạy lặp trên cùng schema đã tồn tại; muốn kiểm tra lại
toàn bộ cần dùng database rỗng mới.

Nếu cần một file SQL duy nhất để chạy trên schema đã có, dùng
[`ALL_DATASEED.sql`](./ALL_DATASEED.sql). File này đã gộp reference data, toàn
bộ scenario D1/D2, API coverage, financial projection và validator; không còn
phụ thuộc lệnh include của psql hay file ngoài. File vẫn yêu cầu chạy
`database_ddl/order_mgmt_ddl.sql` trước trên database rỗng.

File `test_data/003_financial_projection_coverage.sql` cập nhật current
projection COD, đối soát và bồi thường sau khi toàn bộ Order scenario D1/D2 đã
được tạo. Vì vậy đây là bước hợp nhất, không thuộc riêng batch của Designer 1
hay Designer 2.

File `test_data/004_api_contract_coverage.sql` bổ sung các biến thể API có
persistence trong Order DB: snapshot update, Carrier reject, cancel/retry,
tracking late/correction, multi-image remove, Print reference, đủ activity
groups, batch failed-all, idempotency/outbox và terminal result.

File `test_data/006_ui_current_status_showcase.sql` bổ sung một Order đầy đủ cho
mỗi trạng thái chưa có current projection. `SPF-0302/SPF-0303` chỉ dùng NVC tức
thời GrabExpress/Green SM; các Order này có đủ party, address, goods, measure,
Stage, service, Waybill, request và tracking event để UI không cần dữ liệu giả.
Mọi Order showcase luôn có đủ hai chặng `PICKUP` và `DELIVERY`; chặng
`RETURN`/`FINAL-RETURN` chỉ được sinh khi Order thực sự đi vào luồng hoàn.

## Quy luật Stage Code

`order_legs.stage_code` được sinh thống nhất theo công thức
`STG-{LEG_TYPE}-{TYPE_SEQUENCE_4_DIGITS}`. `LEG_TYPE` lần lượt là `PICKUP`,
`DELIVERY`, `RETURN`, `FINAL-RETURN` tương ứng `leg_type` từ 1 đến 4. Phần số
là thứ tự của chặng trong cùng `(order_id, leg_type)`, sắp theo `stage_no`, bắt
đầu từ `0001`. Ví dụ: `STG-PICKUP-0001`, `STG-DELIVERY-0001`,
`STG-DELIVERY-0002`, `STG-RETURN-0001`.

Global validator kiểm tra lại công thức này trên toàn bộ `order_legs`; mã tự
đặt theo scenario hoặc theo NVC sẽ làm quá trình seed thất bại.

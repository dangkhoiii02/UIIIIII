# Nguồn chuẩn dùng cho DataSeed

Thứ tự ưu tiên khi tài liệu mâu thuẫn:

1. `/Users/dangkhoii/module_order/SuperShip - API CONTRACT MODULE ORDER (3).md`
   — API Contract baseline `1.3.0`.
2. `/Users/dangkhoii/module_order/SuperShip - MODULE ORDER - DATABASE DICTIONARY - BASELINE v0.25.0.md`
   — schema, datatype, nullability, FK, CHECK và ý nghĩa lưu trữ.
3. `database_seed/CARRIER_FIXTURES.md`
   — các mã Waybill và sorting code được Business xác nhận cho fixture.
4. `database_seed/SEED_DATA_BACKLOG.md`
   — danh sách scenario và tiêu chí coverage.

File `SUPERSHIP - API CONTRACT MODULE ORDER.md` đang nằm trong repository là
bản context cũ hơn. Không dùng file đó để ghi đè quyết định mới trong API Contract
`1.3.0`.

Các quyết định áp dụng cho seed hiện tại:

- Dùng Carrier code đã xác nhận `1, 2, 3, 4, 6, 10, 13` cho luồng mạng lưới.
- Chỉ dùng mã giả định `15` — Green SM và `16` — GrabExpress cho scenario NVC
  tức thời `SPF-0302/SPF-0303`; không dùng hai mã này cho đơn thường và luôn
  ghi rõ đây là fixture thiết kế chưa được Carrier Registry xác nhận production.
- Booking chưa được NVC cấp Waybill chỉ nằm ở Request/Step.
- `waybill_status = 3` chỉ dùng khi có Waybill mới trỏ `replaces_waybill_id` tới Waybill cũ.
- Mã chia chọn chỉ nằm ở `carrier_sorting_code`.
- Carrier option phải gồm ba chuỗi không rỗng `key`, `value`, `name`.
- Raw Carrier Status chỉ xuất hiện trên Tracking Event có `event_source = 1`.
- Hash dùng giá trị SHA-256 deterministic từ canonical fixture, không dùng chuỗi lặp.
- Sáu trường tài chính trên `orders` là current projection, không phải sổ cái của
  Order. `collected_amount` đến từ kết quả thu thực tế của Carrier;
  `settled_amount` và projection bồi thường đến từ Finance.
- `waybills.collection_amount` là số yêu cầu NVC thu tại thời điểm tạo Waybill,
  không được dùng thay cho `orders.collected_amount`.
- Projection tài chính được seed sau khi toàn bộ lifecycle D1/D2 đã tồn tại để
  mô phỏng đúng thứ tự Carrier webhook rồi Finance webhook.

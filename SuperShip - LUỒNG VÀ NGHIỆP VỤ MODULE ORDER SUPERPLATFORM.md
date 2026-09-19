# SuperShip - LUỒNG VÀ NGHIỆP VỤ MODULE ORDER SUPERPLATFORM

## 1. Mục đích

Tài liệu liệt kê các luồng và nghiệp vụ mà Module Order của SuperPlatform phải bao quát, bao gồm cả việc phối hợp với các module khác để lấy dữ liệu, thực hiện nghiệp vụ và lưu thông tin cần thiết cho vòng đời Đơn hàng.

Module Order sở hữu dữ liệu nghiệp vụ Đơn hàng. Dữ liệu chuyên ngành như tài chính, Ticket hỗ trợ, file, cấu hình vận chuyển hoặc credential NVC vẫn do module chuyên trách quản lý.

## 2. Các luồng nghiệp vụ Module Order phải thực hiện

### 2.1. Tiếp nhận và xác định ngữ cảnh tạo đơn

- Xác định người gọi, Shop sở hữu, Application và Client.
- Xác định mô hình khách hàng: địa phương cũ, địa phương mới, toàn quốc hoặc SuperAI.
- Xác định nguồn tạo: Web, API, Marketplace, bảng tính hoặc nội bộ.
- Kiểm tra quyền tạo Order và phạm vi dữ liệu.
- Lưu Shop, Application, Client, nguồn tạo và người tạo.

### 2.2. Tạo và quản lý dữ liệu gốc của Order

- Sinh mã Order SuperPlatform.
- Lưu mã đơn riêng của Shop hoặc hệ thống nguồn.
- Lưu người gửi, người nhận và địa chỉ đã chuẩn hóa.
- Lưu điểm lấy hàng và điểm hoàn hàng.
- Lưu sản phẩm hoặc tên hàng, khối lượng, kích thước, giá trị khai giá và COD.
- Lưu phương thức gửi, người trả phí, ghi chú lấy/giao và chính sách xem hàng.
- Lưu các ảnh hàng hóa được Shop gắn khi tạo đơn.

Các thông tin quan trọng phải được lưu thành snapshot để Order không bị thay đổi khi Shop, địa chỉ hoặc sản phẩm gốc được chỉnh sửa sau này.

### 2.3. Xây dựng kế hoạch vận chuyển

Order phải xác định một hoặc nhiều chặng:

- Chặng lấy hàng.
- Chặng giao hàng.
- Chặng chuyển hoàn.
- Chặng trả hàng cuối về Shop.
- Chặng bàn giao qua Hub hoặc giữa các NVC.

Kế hoạch phụ thuộc mô hình khách hàng:

- SuperShip lấy và giao toàn trình.
- SuperShip lấy về Hub rồi bàn giao NVC khác giao.
- NVC mạng lưới trực tiếp lấy và giao.
- SuperAI lựa chọn NVC theo từng Order.
- NVC tức thời như Green SM hoặc Grab thực hiện chặng phù hợp.

### 2.4. Kiểm tra khả năng phục vụ và lựa chọn NVC

- Kiểm tra địa chỉ, tuyến, khối lượng, kích thước, COD và loại hàng.
- Lấy NVC mặc định từ Shipping Configuration.
- Cho phép SuperAI lựa chọn NVC khi Shop được cấu hình quyền.
- Kiểm tra dịch vụ tức thời, tọa độ và khả năng tìm tài xế.
- Lưu NVC, dịch vụ và cấu hình đã được chọn cho từng chặng.

### 2.5. Tạo Waybill và gửi đơn sang NVC

- Chuẩn bị dữ liệu theo contract riêng của từng NVC.
- Gửi yêu cầu tạo vận đơn hoặc booking.
- Nhận mã vận đơn, mã phân loại và mã khách hàng tại NVC.
- Gắn một Waybill vào một hoặc nhiều Stage khi nghiệp vụ cho phép.
- Không tạo Waybill trùng khi timeout hoặc retry.
- Lưu trạng thái chưa gửi, đang gửi, đã tạo hoặc tạo lỗi.

Waybill phải được tự động tạo khi tạo Order, đổi NVC hoặc tạo chặng hoàn; không thiết kế nghiệp vụ nhân viên tự tạo chặng rời rạc.

### 2.6. Quản lý Stage và Waybill

- Một Order có nhiều Stage.
- Một loại Stage có thể xuất hiện nhiều lần.
- Một Stage có thể thay nhiều Waybill theo lịch sử.
- Một Waybill có thể phục vụ nhiều Stage.
- Giữ lịch sử Waybill cũ khi đổi NVC.
- Xác định Stage và Waybill đang thực hiện hiện tại.
- Không xóa dữ liệu cũ khi điều phối lại vận chuyển.

### 2.7. Tiếp nhận và chuẩn hóa trạng thái NVC

- Nhận webhook hoặc kết quả đồng bộ từ Carrier Module.
- Lưu mã và tên trạng thái gốc của NVC.
- Ánh xạ trạng thái gốc sang trạng thái chuẩn SuperPlatform.
- Cập nhật trạng thái Waybill, Stage và Order đúng cấp.
- Xử lý sự kiện trùng, đến muộn hoặc sai thứ tự.
- Lưu thời điểm xảy ra tại NVC và thời điểm SuperPlatform tiếp nhận.

Ba cấp trạng thái phải được phân biệt:

- Trạng thái Order: kết quả tổng thể của Đơn hàng.
- Trạng thái Stage: tình trạng của một chặng.
- Trạng thái Carrier: trạng thái gốc của Waybill tại NVC.

### 2.8. Quản lý hành trình, vị trí, shipper và phương tiện

- Tổng hợp timeline từ tất cả Stage và Waybill.
- Lưu tỉnh/thành, quận/huyện hoặc phường/xã tại từng mốc khi có.
- Lưu bưu cục, Hub hoặc điểm khai thác khi NVC cung cấp.
- Xác định vị trí mới nhất của Order.
- Lưu người đang lấy, giao hoặc trả hàng nếu NVC cung cấp.
- Lưu tên, số điện thoại đã che, phương tiện và biển số nếu có.
- Lưu lịch sử phân công theo Stage/Waybill.
- Không bắt buộc mã tài xế vì không phải NVC nào cũng cung cấp.

### 2.9. Cập nhật thông tin Order

- Cho phép cập nhật trực tiếp các trường còn được phép thay đổi.
- Sau khi có Waybill, chỉ thay đổi các trường mà trạng thái và NVC cho phép.
- Gửi yêu cầu thay đổi sang NVC nếu cần.
- Chỉ cập nhật dữ liệu chính thức khi NVC thay đổi thành công.
- Tự tạo Ticket Support nếu thay đổi cần CS xử lý hoặc NVC trả lỗi.
- Lưu giá trị trước, giá trị sau và kết quả thay đổi vào lịch sử.

### 2.10. Hủy Order

- Chọn mã lý do hủy; nhập nội dung khi chọn lý do khác.
- Kiểm tra khả năng hủy theo trạng thái Order và Waybill.
- Gửi hủy sang NVC nếu Waybill đã tồn tại.
- Không đánh dấu hủy thành công khi kết quả hủy tại NVC chưa xác định.
- Lưu người thực hiện, lý do và kết quả.

### 2.11. Yêu cầu NVC thực hiện lại

Nghiệp vụ retry phục vụ nội bộ yêu cầu NVC thực hiện lại việc lấy, giao, bàn giao, chuyển hoàn hoặc trả hàng. Order phải ghi nhận lần yêu cầu, loại nghiệp vụ, Waybill/Stage liên quan, trạng thái yêu cầu và kết quả NVC.

### 2.12. Giao hàng một phần

- Cách 1: chỉ ghi chú hoặc xác nhận nghiệp vụ.
- Cách 2: khai báo hàng đã giao, hàng còn lại và COD sau điều chỉnh.
- Cập nhật kết quả giao, COD, số lượng còn lại và lịch sử thay đổi.

### 2.13. Đổi hàng

- Nhận hướng dẫn đổi hàng bằng ghi chú.
- Nhận COD mới nếu có.
- Không nhận danh sách hàng đổi chi tiết trong nghiệp vụ này.
- Theo dõi kết quả đổi hàng trên Order.

### 2.14. Yêu cầu và xác nhận chuyển hoàn

1. Shop tạo yêu cầu, Order chuyển sang `SPF-1001 — Chờ xác nhận chuyển hoàn`.
2. Nội bộ xác nhận qua API NVC hoặc xác nhận thủ công sau khi NVC đồng ý, Order chuyển sang `SPF-1002 — Đã xác nhận chuyển hoàn`.
3. Hệ thống tạo hoặc kích hoạt Stage hoàn phù hợp.

### 2.15. Điều phối NVC

- Đổi NVC đang thực hiện một Stage.
- Bổ sung NVC hỗ trợ tiếp tục luồng vận chuyển.
- Tạo NVC mới cho chiều hoàn hoặc trả hàng.
- Cung cấp đủ dữ liệu để tạo Waybill mới: NVC, địa chỉ lấy/nhận, liên hệ, hàng hóa, COD và thông tin chặng.
- Ghi nhận NVC/Waybill cũ và mới, Stage thay đổi hoặc tạo mới, giá trước/sau, chênh lệch phí và trạng thái Order.

### 2.16. Tài chính, phí và COD

- Tách giá bán cho Shop ở cấp Order và giá vốn NVC ở cấp Waybill.
- Theo dõi phí vận chuyển, bảo hiểm, hoàn, đổi địa chỉ và phụ phí.
- Theo dõi COD, tiền người nhận trả và tiền phải thanh toán cho Shop.
- Lưu mã giá Order, mã giá và chi phí của từng NVC.
- Hiển thị trạng thái thu hộ, điều chỉnh COD, bồi thường và đối soát.
- Order chỉ lưu snapshot/projection; sổ cái và đối soát chính thức thuộc Finance Module.

### 2.17. SLA

- SLA với Shop được đánh giá ở cấp Order.
- SLA với NVC được đánh giá theo từng Waybill, không theo Stage.
- SLA phụ thuộc tuyến, dịch vụ, chính sách đối tác và lịch vận hành.
- Lưu mã chính sách, ngày bắt đầu, hạn cam kết, ngày cộng thêm, kết quả và độ lệch.

### 2.18. Ghi chú nghiệp vụ

- Ghi chú chung.
- Ghi chú lấy hàng.
- Ghi chú giao hàng.
- Ghi chú chuyển hoàn.
- Ghi chú trả hàng.
- Ghi chú vận hành nội bộ.

Ghi chú có thể liên kết Order, Stage, NVC hoặc Waybill nhưng dữ liệu trả về phải dễ hiển thị, không để FE tự ghép nghiệp vụ.

### 2.19. Hình ảnh nghiệp vụ

- Shop thêm hoặc gỡ một hay nhiều ảnh của Order.
- Shop có thể cập nhật ảnh trước khi NVC lấy hàng.
- Tiếp nhận ảnh lấy hàng, giao hàng, hoàn hàng hoặc POD từ NVC.
- Lưu loại ảnh, nguồn ảnh, Stage/Waybill liên quan và thời điểm phát sinh.
- Binary thuộc File Service; Order chỉ lưu mã file và metadata cần thiết.

### 2.20. Lịch sử hoạt động

Phải ghi nhận việc tạo/cập nhật Order; thay đổi trạng thái; trạng thái gốc NVC; tạo, hủy hoặc thay Waybill; đổi NVC; thay đổi COD và người nhận; retry; giao một phần; đổi hàng; chuyển hoàn; thêm/gỡ ảnh; thêm ghi chú; in nhãn; thao tác nội bộ và truy cập dữ liệu nhạy cảm khi cần audit.

Mỗi activity cần có format chung: loại hoạt động, mã hành động, nội dung hiển thị, người thực hiện, thời gian và tham chiếu liên quan.

### 2.21. In nhãn giao hàng

- Lấy loại và kích thước nhãn được phép in.
- Tạo token in cho một hoặc nhiều Order.
- Render nhãn theo loại tem được chọn.
- Lưu lịch sử từng lần in: người in, kênh, kích thước, số lượng, IP và thời gian.
- Giữ mã template/version để hỗ trợ tùy biến tem sau này.

### 2.22. Tạo Order hàng loạt

- Đọc file XLSX theo mẫu địa chỉ hai cấp hoặc ba cấp.
- Trả dữ liệu từng dòng để FE hiển thị và chỉnh sửa.
- Kiểm tra dữ liệu, trả dòng hợp lệ và dòng lỗi.
- Cấp validation token.
- Tạo batch từ dữ liệu đã xác thực.
- Theo dõi tổng quan và kết quả từng dòng.
- Xuất kết quả batch.

### 2.23. Danh sách, tìm kiếm và bộ lọc

- Tra cứu nhanh theo Order, mã Shop, số điện thoại hoặc Waybill.
- Lọc theo trạng thái Order, NVC, Stage, trạng thái gốc NVC, khu vực, thời gian, nguồn tạo, dịch vụ, COD, sự cố và yêu cầu hỗ trợ.
- Cho phép điều kiện nhiều Stage trên cùng một Order.
- Trả cấu hình bộ lọc theo quyền và dữ liệu khả dụng.
- Xuất kết quả ra Excel.

### 2.24. Tracking công khai

- Hiển thị trạng thái, Stage và các mốc hành trình phù hợp.
- Che tên, số điện thoại và địa chỉ người gửi/người nhận.
- Không trả giá vốn, thông tin nội bộ, mã tài khoản NVC hoặc dữ liệu kỹ thuật.

## 3. Tương tác với các module khác

Phần này chỉ liệt kê các module có tương tác trực tiếp với Order thông qua API, Domain Event hoặc mã tham chiếu nghiệp vụ. Module không trao đổi trực tiếp với Order không được liệt kê.

| Mã | Module | Tương tác với Order | Dữ liệu Order lưu |
|---|---|---|---|
| `USR` | User | Cung cấp Person, Identity, Organization/Shop, Membership, Role, Permission, Data Scope, Application, Entitlement và API Client của người gọi. | ID tham chiếu của Shop, actor, Application, Client; snapshot tên/mã chủ thể cần cho lịch sử Order. Order không sao chép credential hay toàn bộ hồ sơ User. |
| `ADR` | Address | Chuẩn hóa địa chỉ 2 cấp/3 cấp, tra cứu mã hành chính, alias, mapping mã NVC và suy luận Route Type. | Snapshot địa chỉ người gửi, người nhận, điểm lấy/hoàn; mã địa giới, model địa chỉ và Route Type đã áp dụng. |
| `PRD` | Product | Cung cấp catalog, SKU, tên hàng, giá trị, khối lượng, kích thước, loại hàng và Package Profile. | Snapshot hàng hóa tại thời điểm tạo Order; không phụ thuộc dữ liệu catalog hiện hành sau này. |
| `CAR` | Carrier | Kiểm tra serviceability/capability; quản lý Carrier Account; tạo, hủy, tra cứu Waybill; nhận webhook; chuẩn hóa raw status/error; cung cấp tracking, shipper và POD nếu NVC có. | Carrier code, service, account reference, Waybill, mã phân loại, raw status, kết quả thao tác và snapshot payload cần đối chiếu; không lưu credential NVC. |
| `SHP` | Shipping Configuration | Cung cấp điểm lấy, liên hệ, giờ làm việc, địa chỉ thay thế theo NVC, mô hình khách hàng, NVC cố định/ưu tiên/fallback, Carrier Account và Configuration Decision. | Mã điểm lấy, snapshot liên hệ/địa chỉ, mã và version cấu hình, quyết định chọn NVC và lý do áp dụng. |
| `PRC` | Pricing | Tạo Quote, tính giá bán cho Shop, giá mua NVC, phụ phí, chiết khấu và giải thích rule giá. | Mã Quote/bảng giá, version, thành phần phí và Pricing Snapshot đã chấp nhận; không sở hữu bảng giá nguồn. |
| `RTG` | Rating & Feedback | Kiểm tra Order đủ điều kiện đánh giá và gắn phản hồi vào đúng Order/NVC/dịch vụ. | Chỉ lưu mã tham chiếu hoặc projection tổng hợp khi màn hình Order cần hiển thị; Rating sở hữu nội dung đánh giá. |
| `CFG` | System Configuration | Cung cấp feature/capability theo Application, Organization, Shop hoặc cohort; kill switch và failure policy. | Mã capability và version/snapshot cấu hình đã áp dụng nếu cần giải thích hành vi Order. |
| `INT` | Integration & Webhook | Cung cấp Public API, API version, connector, mapping dữ liệu, rate limit; phát webhook Order ra đối tác và quản lý retry/replay/DLQ. | Connector/client reference, external source reference, idempotency reference và trạng thái công bố event cần thiết; không lưu credential integration. |
| `NTF` | Notification | Nhận Domain Event của Order để gửi thông báo đúng người, kênh và preference. | Order chỉ lưu activity nghiệp vụ hoặc mã tham chiếu khi cần; Notification sở hữu template và delivery attempt/result. |
| `SUP` | Support | Tự động hoặc thủ công tạo Ticket khi Order cần CS/NVC hỗ trợ; cung cấp ngữ cảnh Order–Stage–Waybill cho Support Workspace. | Mã Ticket, loại vấn đề và trạng thái tổng hợp cần hiển thị; Support sở hữu queue, assignment, conversation và lifecycle Ticket. |
| `CLM` | Claims & Compensation | Tạo Claim từ incident/Support; lấy Order, Stage, Waybill và bằng chứng để điều tra trách nhiệm và bồi thường. | Mã Claim và projection trạng thái cần hiển thị; Claims sở hữu policy, liability, phê duyệt và Compensation Obligation. |
| `FIN` | Finance | Nhận Order/Carrier Event/Pricing Snapshot để ghi COD, phí, công nợ, ledger và đối soát; cung cấp kết quả tài chính cho màn hình Order. | Projection COD, phí, đối soát, bồi thường và mã tham chiếu cần hiển thị; không lưu ledger/bút toán trong Order. |
| `RPT` | Reporting | Nhận Domain Event/API của Order để lập read model, dashboard, drill-through, export và data quality. | Order không sao chép dataset báo cáo; chỉ phát dữ liệu nguồn đáng tin cậy và giữ tham chiếu export nếu cần. |
| `PRT` | Print | Quản lý loại nhãn, kích thước, template/version, token in, render một hoặc nhiều Order và kết quả in. | Mã Print Token/Print Job, template/version và snapshot lần in cần cho lịch sử; Print sở hữu template và quá trình render. |

### 3.1. Năng lực dùng chung không tách thành module

- Lưu trữ file/bằng chứng: Order chỉ lưu mã tham chiếu và metadata của ảnh, file XLSX hoặc kết quả xuất; không gọi đây là `File Module` khi danh mục chính thức chưa có module này.
- Audit, Security, Search, Observability, Transactional Outbox và AI/Rule là năng lực dùng chung hoặc pattern nền tảng, không tự định danh thành business module.
- SLA của Order và Waybill là dữ liệu nghiệp vụ được đánh giá từ policy/version phù hợp; chưa tách thành `SLA Module` trong baseline hiện tại.

## 4. Phân loại dữ liệu Module Order cần lưu

### 4.1. Dữ liệu Order sở hữu

- Order và trạng thái Order.
- Snapshot người gửi, người nhận, địa chỉ và hàng hóa.
- Stage và quan hệ giữa các Stage.
- Waybill và quan hệ Stage–Waybill.
- Trạng thái chuẩn hóa và trạng thái gốc NVC.
- Timeline, vị trí và hành trình.
- Kế hoạch vận chuyển và kết quả điều phối.
- Yêu cầu hủy, retry, giao một phần, đổi hàng và chuyển hoàn.
- Lịch sử hoạt động.
- Ghi chú và liên kết hình ảnh.
- Batch tạo Order và kết quả từng dòng.
- Lịch sử in nhãn.
- Snapshot giá và SLA đã áp dụng.

### 4.2. Snapshot bất biến cần giữ

- Access Context và nguồn tạo tại thời điểm tạo Order.
- Người gửi, người nhận, địa chỉ, liên hệ và hàng hóa đã xác nhận.
- Dữ liệu đã gửi sang từng NVC khi tạo Waybill.
- Phương án vận chuyển và mã/version cấu hình đã chọn.
- Báo giá và bảng giá đã chấp nhận.
- Chính sách SLA đã áp dụng.
- Template/version và thông tin của từng lần in.

### 4.3. Dữ liệu projection hoặc tham chiếu

- Trạng thái COD, thanh toán, đối soát và bồi thường từ Finance.
- Giá vốn của NVC và giá bán cho Shop.
- Kết quả SLA Order và Waybill.
- Mã Ticket, Claim, Rating hoặc Incident của module khác.
- Mã file ảnh, XLSX, nhãn và file xuất.
- Thông tin shipper hoặc phương tiện do NVC cung cấp.

### 4.4. Dữ liệu không thuộc quyền sở hữu của Order

- Credential, access token, secret hoặc tài khoản kết nối NVC.
- Binary file hoặc signed URL dài hạn.
- Sổ cái, bút toán và giao dịch thanh toán.
- Toàn bộ vòng đời Ticket Support.
- Lịch sử gửi Notification.
- Master data hiện hành của Shop, sản phẩm, địa chỉ hoặc NVC.
- Log kỹ thuật hạ tầng như stack trace, request secret hoặc credential.

## 5. Các nguyên tắc bắt buộc

1. Order, Stage và Waybill là ba cấp nghiệp vụ khác nhau; không gộp trạng thái của ba cấp thành một.
2. Không xóa Stage hoặc Waybill cũ khi đổi NVC; phải giữ lịch sử và quan hệ thay thế.
3. Sự kiện gốc từ NVC phải được lưu bất biến và xử lý an toàn khi trùng hoặc sai thứ tự.
4. Retry không được làm tạo trùng Order, Stage, Booking hoặc Waybill.
5. Tạo Waybill bất đồng bộ bị lỗi không được làm mất Order đã tạo hợp lệ.
6. Mọi dữ liệu phải được giới hạn theo Shop, Access Context, quyền và Data Scope.
7. Shop và nội bộ có thể nhận mức chi tiết khác nhau nhưng phải dựa trên cùng một nguồn dữ liệu nghiệp vụ.
8. Order chỉ lưu tham chiếu, snapshot hoặc projection của dữ liệu thuộc module khác; không chiếm quyền sở hữu dữ liệu chuyên ngành.
9. Mọi thao tác thay đổi Order phải sinh lịch sử nghiệp vụ có thể truy vết.
10. Public tracking phải ưu tiên hành trình và hạn chế tối đa việc lộ dữ liệu cá nhân.

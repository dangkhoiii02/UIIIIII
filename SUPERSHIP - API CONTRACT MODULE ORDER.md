# SUPERSHIP \- API CONTRACT MODULE ORDER

## THÔNG TIN TÀI LIỆU

|Thuộc tính|Giá trị|
|---|---|
|Tên tài liệu|API Contract Module Order|
|Module sở hữu|Order|
|Tác giả|Lê Đào Nhân Sâm|
|Phiên bản|1\.2\.0|
|Trạng thái|Baseline|
|Ngày cập nhật|17/09/2026|
|Nguồn danh mục API|`API - Order - SPF.md`|

## LỊCH SỬ THAY ĐỔI

Change log phải chỉ rõ mục bị tác động và nội dung thay đổi để người đọc có thể hiểu nhanh mà không cần so sánh toàn bộ tài liệu\.

|Phiên bản|Ngày|Mục thay đổi|Tên mục|Nội dung thay đổi|
|---|---|---|---|---|
|1\.2\.0|17/09/2026|Mục 1, 3 và 5\.3\.1|Public Tracking bảo vệ dữ liệu cá nhân|Đổi Public Tracking sang POST, Request nhận `tracking_code`, bốn số cuối điện thoại Người nhận và CAPTCHA\. Thiết kế lại Response ưu tiên hành trình; bổ sung Người gửi/Người nhận với tên, điện thoại, địa chỉ đã masking; thêm thời gian dự kiến, NVC/chặng hiện tại, vị trí công khai và timeline; loại dữ liệu gốc, hàng hóa, COD, shipper, ảnh và raw status NVC\.|
|1\.2\.0|17/09/2026|Mục 1, 3, 5\.1\.8 và 5\.2\.1|Xuất Excel trực tiếp|Loại mô hình tác vụ xuất, `task_code`, API xem tiến độ, `download_url` và metadata file\. API xuất kết quả Batch dùng GET với phạm vi kết quả; API xuất danh sách Order dùng POST với Order được chọn hoặc bộ lọc; cả hai trả trực tiếp file Excel binary\. Giảm Workflow API từ 11 xuống 10, còn 44 API bắt buộc và 45 API khi tính API công khai tùy chọn\.|
|1\.2\.0|17/09/2026|Mục 5\.1\.6 và 5\.1\.7|Tổng quan Batch và kết quả từng dòng|Đổi 5\.1\.6 thành API tổng quan một Batch, chuẩn hóa trạng thái số, bộ đếm và `updated_at`; thiết kế lại 5\.1\.7 với Summary toàn Batch, `rows[]` phân trang, bộ lọc kết quả dạng số, dữ liệu nhận diện dòng, Order đã tạo và lỗi không dùng giá trị `null`; bỏ Carrier Waybill khỏi kết quả tạo Order\.|
|1\.2\.0|17/09/2026|Mục 5\.1\.5|Tổng quan lịch sử tạo Đơn hàng loạt|Bổ sung `data.summary` gồm tổng Batch, tổng dòng, số dòng thành công, thất bại và đang xử lý; quy định Summary tính trên toàn bộ dữ liệu thỏa bộ lọc trước phân trang; bổ sung tìm kiếm theo `batch_code` và không tìm theo tên file\.|
|1\.2\.0|17/09/2026|Mục 5\.1\.5 và 5\.1\.6|Nguồn dữ liệu người tạo Batch|Thay `created_by_name` hoặc chuỗi `created_by` bằng object `created_by` gồm `actor_type` và `display_name`; làm rõ dữ liệu do Backend lấy từ Access Context/User Module và lưu snapshot khi tạo Batch, không nhận từ Request Body\.|
|1\.2\.0|17/09/2026|Mục 3, 5\.1\.5 và 5\.1\.6|Lịch sử và chi tiết Batch tạo Đơn hàng loạt|Xóa `source_file_name` và `template_version` vì Order Module không lưu file Excel theo Batch; chuẩn hóa lịch sử chỉ gồm mã Batch, trạng thái, bộ đếm tiến độ, người tạo và thời gian; bổ sung giới hạn phân trang và quan hệ giữa các bộ đếm\.|
|1\.2\.0|17/09/2026|Mục 5\.1\.2 và 5\.1\.3|Bỏ mã lần đọc file khỏi bước kiểm tra|Loại `parse_code` khỏi Response đọc file và Request kiểm tra vì API kiểm tra đã nhận toàn bộ dữ liệu cuối cùng từ FE; bổ sung `address_model` để xác định rõ cấu trúc địa chỉ hai cấp hoặc ba cấp; xóa các lỗi tra cứu và hết hạn lần parse\.|
|1\.2\.0|17/09/2026|Mục 3 và 5\.1\.4|Tạo lô Đơn hàng loạt|Chốt API chỉ nhận `validation_token` và xử lý bất đồng bộ toàn bộ snapshot đã kiểm tra; Response trả mã Batch, trạng thái cùng số dòng thành công, thất bại và đang xử lý; chuẩn hóa lỗi token không còn sử dụng được\.|
|1\.2\.0|17/09/2026|Mục 5\.1\.3 và 5\.1\.4|Kiểm tra và tạo Đơn hàng loạt bằng Validation Token|API kiểm tra nhận toàn bộ dòng sau chỉnh sửa, chỉ trả thống kê cùng danh sách dòng không hợp lệ; chỉ cấp `validation_token` khi toàn bộ dòng hợp lệ\. API tạo lô nhận token này, yêu cầu snapshot không có dòng lỗi và tiếp nhận toàn bộ dòng đã kiểm tra\.|
|1\.2\.0|17/09/2026|Mục 5\.1\.2 và 5\.1\.3|Dữ liệu đọc và kiểm tra file tạo Đơn hàng loạt|Chuẩn hóa ví dụ thành hai dòng hợp lệ; dùng tên Tỉnh/Thành và Phường/Xã thay cho mã hành chính, dùng số nguyên cho COD, bổ sung đủ kích thước và lựa chọn nghiệp vụ; xóa `pickup_point_code` khỏi dữ liệu kiểm tra vì điểm lấy được Backend xác định theo cấu hình Shop\.|
|1\.0\.0|15/09/2026|Toàn bộ tài liệu|Khởi tạo API Contract Module Order|Thiết lập baseline 45 API bắt buộc và 1 API tùy chọn cho các nhóm Order, yêu cầu nghiệp vụ, hành trình, ghi chú/hình ảnh, in nhãn, danh sách, tạo đơn loạt, xuất dữ liệu và tra cứu công khai\.|
|1\.1\.0|16/09/2026|Mục 2\.4|Quyền và dữ liệu nhạy cảm|Làm rõ Backend phải xác định người gọi, Membership, Organization/Shop, Application, Client và Data Scope từ ngữ cảnh đã được xác thực; không tin các trường do Client tự khai báo để mở rộng quyền\.|
|1\.1\.0|16/09/2026|Mục 2\.5\.1|Ngữ cảnh truy cập dùng để làm gì?|Bổ sung sáu câu hỏi bắt buộc mà mỗi request Order phải trả lời: ai gọi, đang dùng tư cách nào, đại diện tổ chức nào, từ ứng dụng/Client nào và được thao tác trên dữ liệu nào\.|
|1\.1\.0|16/09/2026|Mục 2\.5\.2|Các thành phần của ngữ cảnh truy cập|Bổ sung định nghĩa và ý nghĩa của Identity, Membership, Organization, Shop, Application, Client, Actor Type, Session và Data Scope\.|
|1\.1\.0|16/09/2026|Mục 2\.5\.3|Ví dụ Access Token của người dùng Shop|Bổ sung Access Token mẫu và giải thích cách Module Order hiểu từng claim\.|
|1\.1\.0|16/09/2026|Mục 2\.5\.4|Cách xác định Shop trong từng trường hợp|Chốt cách xác định Shop khi Shop tự thao tác, nhân viên nội bộ thao tác, đối tác thao tác thay Shop và module hệ thống gọi nội bộ\.|
|1\.1\.0|16/09/2026|Mục 2\.5\.5|Phân biệt Application và Client|Làm rõ Application là sản phẩm/ngữ cảnh nghiệp vụ, còn Client là thành phần kỹ thuật như Web, Mobile, Partner API hoặc Backend Service\.|
|1\.1\.0|16/09/2026|Mục 2\.5\.6|Trusted Access Context mà Module Order sử dụng|Bổ sung cấu trúc ngữ cảnh nội bộ đáng tin cậy được Gateway/User Module chuyển cho Order; Consumer không được tự gửi cấu trúc này\.|
|1\.1\.0|16/09/2026|Mục 2\.5\.7|Dữ liệu nguồn tạo phải được lưu trên Order|Bổ sung các trường snapshot Shop sở hữu, người tạo, Membership, Application, Client, Actor Type, Channel, thời điểm và Correlation ID\.|
|1\.1\.0|16/09/2026|Mục 2\.5\.8|Quy tắc bắt buộc|Chốt Shop không truyền `shop_id`; nguồn tạo không lấy từ Request Body; nội bộ/đối tác phải qua Data Scope hoặc ủy quyền; hệ thống không mặc định cho phép khi thiếu ngữ cảnh\.|
|1\.2\.0|16/09/2026|Mục 3|Danh mục Endpoint|Cập nhật danh mục API theo đúng ranh giới Order–Support–Carrier; tách cột Method, rút gọn endpoint, phân biệt API dùng chung và API chỉ cấp quyền nội bộ\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.1|Tạo Đơn hàng|Thiết kế lại Request/Response tạo Order: xác định Shop và nguồn tạo từ Access Context; hỗ trợ địa chỉ hành chính cũ/mới, tọa độ, điểm lấy tham chiếu hoặc nhập trực tiếp, chọn NVC theo cấu hình hoặc lựa chọn thủ công được cấp quyền, ảnh đã upload và Order nhiều chặng; phân biệt NVC mạng lưới với NVC tức thời qua `delivery_model`, thời điểm lấy và trạng thái tìm tài xế; bổ sung idempotency, xử lý bất đồng bộ, retry/fallback và bảng lỗi\.|
|1\.2\.0|16/09/2026|Mục 2\.6 và 4\.1\.1|Quy ước tham số và Request tạo Đơn hàng|Chuẩn hóa cột Bắt buộc thành `Có`, `Không`, `Có điều kiện`; đưa điều kiện sang phần Ý nghĩa; chỉ hiển thị đúng loại tham số endpoint thực sự có; giải thích rõ cặp tọa độ và các trường địa chỉ nhập trực tiếp\.|
|1\.2\.0|16/09/2026|Mục 2\.6 và 4\.1\.1|Quy ước enum, số và giá trị thời gian|Bổ sung quy tắc phải liệt kê đầy đủ enum; với trường số phải ghi đơn vị, số nguyên/số thập phân, giá trị nhỏ nhất và nguồn xác định giới hạn lớn nhất; chuẩn hóa các ràng buộc này trong API tạo Đơn hàng\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.1|Request tạo Đơn hàng|Xóa khối “Quy tắc loại trừ”; chuyển điều kiện của điểm lấy, phương án vận chuyển và hình ảnh vào đúng trường Request tương ứng; giữ xử lý kỹ thuật tại phần Quy tắc xử lý\.|
|1\.2\.0|16/09/2026|Mục 2\.1, 2\.6 và 4\.1\.1|Địa chỉ và cách khai báo hàng hóa|Chuẩn hóa mã Phường/Xã thành `commune_code`, không dùng `ward_code`; bổ sung `parcel.content_type` để chọn khai báo một tên hàng bằng `product_name` hoặc danh sách sản phẩm bằng `products[]`\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.1|Cách xác định NVC khi tạo Order|Bỏ `shipping.mode` và `shipping.option_code` khỏi Request; mặc định chọn NVC theo Application, loại khách hàng và cấu hình Shop; chỉ SuperAI được truyền `carrier_code` khi Shop chọn NVC thủ công\.|
|1\.2\.0|16/09/2026|Mục 2\.6, 2\.7 và 4\.1\.1|Mã lựa chọn, mã NVC và mã vận đơn|Chuyển các lựa chọn do SuperPlatform quản lý sang mã số; cập nhật mã NVC đã xác nhận; quy định Order Code là 13 chữ số và Carrier Waybill phải giữ nguyên định dạng do từng NVC cấp\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.1|Kiện hàng và trạng thái sau tạo Order|Chuẩn hóa `parcel.dimensions`, `products[].unit_weight` và tổng `parcel.weight`; sửa tên/trạng thái Response theo bộ 43 trạng thái gốc cộng `SPF-0302`, `SPF-0303` cho NVC tức thời\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.1|Response tạo Đơn hàng|Đưa `cod_amount`, `collection_amount`, `declared_value` và `weight` ra trực tiếp trong `data`; bổ sung chi tiết `fee_items`; đổi danh sách chặng sang `shipping_stages` với loại chặng, NVC, mã vận đơn và mã chia chọn\.|
|1\.2\.0|16/09/2026|Mục 2\.7 và 4\.1\.1|Mã SuperShip và vận đơn trong Response|Chốt `carrier_code = 1` cho SuperShip; cập nhật ví dụ tạo thành công bằng mã vận đơn SuperShip/GHN và mã chia chọn GHN; chuyển Order sang `SPF-0301 — Chờ lấy hàng`; không trả `carrier_sorting_code = null` khi NVC chưa cung cấp\.|
|1\.2\.0|16/09/2026|Mục 2\.7 và 4\.1\.1|Mã giả định NVC tức thời|Tạm quy ước `15` cho Green SM Express và `16` cho GrabExpress phục vụ thiết kế; điền dữ liệu vận đơn/mã chia chọn giả định trong Response Green SM và yêu cầu xác nhận Carrier Registry trước production\.|
|1\.2\.0|16/09/2026|Mục 2\.6 và 4\.1\.1|Phạm vi trình bày API Contract|Bổ sung quy ước endpoint chỉ mô tả giao kèo bên ngoài; xóa mục “Quy tắc xử lý” khỏi API tạo Đơn hàng vì transaction, adapter, outbox, retry và mapping nội bộ thuộc SRS/SAD/Business Rule\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.6|Lấy chi tiết Đơn hàng|Chuẩn hóa một endpoint dùng chung cho Shop, nội bộ và đối tác theo Access Context; đồng bộ cấu trúc địa chỉ, kiện hàng, COD, phí, ảnh và chặng với API tạo Order; bổ sung mức dữ liệu, Shop sở hữu, thao tác được phép và ngữ cảnh chỉ dành cho nội bộ\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.1 và 4\.1\.6|Địa chỉ và Response chi tiết|Bỏ `landmark`, chỉ dùng `address.detail`; bỏ `access_view`, `allowed_actions`, `editable_fields` khỏi Response chi tiết vì đây không phải dữ liệu nghiệp vụ của Order; thay dữ liệu che/mẫu chung bằng dữ liệu kiểm thử đầy đủ, đúng định dạng thực tế\.|
|1\.2\.0|16/09/2026|Mục 2\.7, 4\.1\.1 và 4\.1\.6|Mã phân loại NVC|Bổ sung ví dụ mã phân loại đã xác nhận của SPX, GHN, BEST Express và J\&T Express; thay mã chia chọn GHN cũ trong các Response bằng `100-A2-09-00`\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.1 và 4\.1\.6|Địa chỉ đầy đủ|Bổ sung `address.full_address` do Address Module chuẩn hóa và ghép từ địa chỉ chi tiết cùng đơn vị hành chính; API tạo Order trả lại địa chỉ lấy và địa chỉ nhận để Consumer xác nhận dữ liệu đã lưu\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.6|Trạng thái Order và từng chặng vận chuyển|Bổ sung chặng hiện tại; số thứ tự, tên và dấu hiệu chặng đang thực hiện; trạng thái nguyên bản của NVC; trạng thái đã chuẩn hóa của SuperPlatform; thời điểm cập nhật; thông tin tài xế và ngữ cảnh vận hành chỉ dành cho nội bộ\.|
|1\.2\.0|16/09/2026|Mục 3\.1 và 4\.1\.7|Thao tác khả dụng trên từng Order|Bổ sung API lấy các chức năng người gọi được phép sử dụng trên một Order tại thời điểm kiểm tra; hỗ trợ FE/ứng dụng Shop hiển thị, ẩn hoặc vô hiệu hóa nút mà không công khai cách Backend phân loại người gọi\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.7|Rút gọn Response thao tác khả dụng|Bỏ `method`, `endpoint` và `requires_confirmation` vì API chỉ trả kết quả quyền/điều kiện để FE điều khiển chức năng, không đóng vai trò danh mục hướng dẫn gọi API động\.|
|1\.2\.0|16/09/2026|Mục 3\.1 và 4\.1\.8|Cập nhật trực tiếp và yêu cầu thay đổi Order|Giới hạn `PATCH /orders/{order_code}` cho dữ liệu được sửa trực tiếp; chuẩn hóa field theo API tạo Order; bổ sung loại thay đổi, giá trị trước/sau và mã Activity; loại hai API `change-requests` khỏi Order vì Support Module tự tạo Ticket và chỉ yêu cầu Order áp dụng dữ liệu sau khi NVC xác nhận thành công\.|
|1\.2\.0|16/09/2026|Mục 3\.1 và 4\.1\.2–4\.1\.5|Danh sách, tra cứu nhanh và lọc Đơn hàng|Giữ `GET /v1/orders/search` cho tra cứu nhanh; bổ sung API cấu hình bộ lọc; dùng duy nhất `POST /v1/orders/filter` để kết hợp bộ lọc cơ bản và nâng cao trong cùng request; giới hạn `GET /v1/orders` cho danh sách mặc định, sắp xếp và phân trang\.|
|1\.2\.0|16/09/2026|Mục 4 và 5|Sắp xếp cấu trúc API Contract|Di chuyển và đánh lại số mục thiết kế chi tiết theo đúng thứ tự endpoint tại mục 3: nhóm danh sách/tra cứu nằm ngay sau API tạo Order; các nhóm Workflow được đánh lại số liên tục\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.2|Response danh sách Đơn hàng|Bổ sung nguồn/kênh tạo, điểm và lịch lấy cấp Order, mã giá cùng phí bán tóm tắt và `carrier_client_code` để dựng bảng danh sách đầy đủ nhưng không trả payload kỹ thuật nặng\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.6|Response chi tiết Đơn hàng|Bổ sung snapshot nguồn tạo, mã giá đã áp dụng, mã điểm lấy gốc, `carrier_client_code`, vị trí và chủ thể đang giữ kiện phục vụ Shop và vận hành nội bộ\. Không công bố cấu trúc nội bộ của bảng giá khi chưa có contract xác nhận\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.1, 4\.1\.2 và 4\.1\.6|Điểm lấy, mã khách hàng NVC và lịch lấy|Đồng bộ điểm lấy theo `point_code`, `point_name` giữa API tạo, danh sách và chi tiết; bổ sung `carrier_client_code` cho từng chặng/vận đơn; chuẩn hóa lịch lấy bằng `scheduled_from` và `scheduled_to`\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.3|Response tra cứu nhanh|Đồng bộ mỗi kết quả tra cứu nhanh với đầy đủ cấu trúc dòng danh sách tại mục 4\.1\.2; bổ sung sắp xếp, phân trang và metadata để FE dùng chung component bảng Order\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.2, 4\.1\.3 và 4\.1\.6|Thu gọn dữ liệu từng chặng|Loại `route`, lịch lấy cấp chặng, `service_code`, `service_name` và tên điểm đầu–cuối chưa có nguồn dữ liệu được xác nhận; giữ lịch lấy tại `pickup` cấp Order và các trường chặng đã chốt\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.3|Đặc tả Response tra cứu nhanh|Thay các dòng tham chiếu sang API danh sách bằng toàn bộ schema `data.items[]` và `data.meta`; mục tra cứu nhanh hiện có thể được đọc và tích hợp độc lập mà không cần tra cứu mục API khác\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.4|Cấu hình bộ lọc Đơn hàng|Bổ sung cấu trúc mô tả đầy đủ từng bộ lọc, kiểu giá trị, chế độ chọn và nguồn lựa chọn; công bố toàn bộ nhóm bộ lọc theo UC-ORD-004, phân biệt giá trị cố định với danh mục động theo quyền và Data Scope\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.5|Ví dụ Request lọc Đơn hàng|Thay Request minh họa rút gọn bằng Request đầy đủ dành cho nội bộ, bao phủ toàn bộ nhóm điều kiện cơ bản, định danh, người gửi/nhận, chặng NVC, vận hành, hủy, vận đơn, nhãn, hoàn/trả, COD, hỗ trợ, sự cố, khiếu nại, đồng bộ, bất thường, thời gian, sắp xếp và phân trang\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.6|Thông tin giá trong chi tiết Đơn hàng|Chỉ giữ `pricing_code` đã được xác nhận; loại tên bảng giá, phiên bản, tài khoản giá, phí gốc, giảm giá, phụ phí, phí cuối và thời điểm tính giá vì chưa có contract nguồn xác nhận các trường này\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.2, 4\.1\.3 và 4\.1\.6|Mã khách hàng NVC của từng chặng|Xóa `external_transfer_code`; thống nhất giá trị trước đây gọi là mã chuyển ngoài được biểu diễn bằng `carrier_client_code` của chặng NVC tương ứng, không duy trì hai field trùng ý nghĩa\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.5|Response lọc Đơn hàng|Thay câu tham chiếu sang API danh sách bằng toàn bộ schema `data.items[]`, `data.meta` và JSON Response của chính API lọc để endpoint có thể được đọc và tích hợp độc lập\.|
|1\.2\.0|16/09/2026|Mục 4\.1\.6|Vị trí hiện tại của kiện hàng|Loại mô tả suy đoán “đang trên phương tiện”; đưa `current_location` ra dữ liệu chi tiết dùng chung và chuẩn hóa thành Tỉnh/Thành, Quận/Huyện, Phường/Xã, bưu cục hiện tại cùng thời điểm NVC ghi nhận\. Trường không được NVC cung cấp sẽ bị bỏ khỏi Response\.|
|1\.2\.0|16/09/2026|Mục 4\.2\.1|Hủy Đơn hàng|Chuẩn hóa API hủy trực tiếp: bổ sung danh mục `reason_code` dạng số và chỉ bắt buộc `reason` khi chọn `99` — Lý do khác; loại `request_code`, `allowed_actions`, giá trị `null` và khối quy tắc xử lý nội bộ; bổ sung kết quả số, hai Response đồng bộ/bất đồng bộ và bảng lỗi theo UC-ORD-014\.|
|1\.2\.0|16/09/2026|Mục 4\.2\.2|Thực hiện lại vận chuyển|Thay endpoint dài bằng `/retry`; giới hạn cho nhân viên/dịch vụ nội bộ; chuẩn hóa sáu loại retry và State Gate theo UC-ORD-015–020; loại dữ liệu quản lý Ticket, `allowed_actions`, giá trị `null` và khối quy tắc xử lý khỏi contract\.|
|1\.2\.0|16/09/2026|Mục 2\.6 và 4\.2\.3|Áp dụng giao một phần|Bổ sung `partial_type = 1` để xác nhận bằng ghi chú và `partial_type = 2` để chọn chi tiết hàng đã giao, hàng cần hoàn cùng COD; đưa điều kiện từng trường vào nguyên tắc chung và bảng Request; không tạo mục Quy tắc xử lý trong endpoint\.|
|1\.2\.0|16/09/2026|Mục 2\.6 và 4\.2\.4|Tạo yêu cầu đổi hàng|Loại toàn bộ `replacement_items[]`, `pickup_back_items[]` và `instruction`; Request chỉ nhận `note` bắt buộc cùng `requested_cod_amount` khi cần thay đổi COD; loại dữ liệu quản lý Ticket, `allowed_actions`, giá trị `null` và khối Quy tắc xử lý; bổ sung Response và bảng lỗi độc lập\.|
|1\.2\.0|16/09/2026|Mục 2\.6, 3\.3 và 4\.2\.5|Yêu cầu và xác nhận chuyển hoàn|Tách nghiệp vụ thành hai API: Shop/nội bộ tạo yêu cầu để chuyển sang `SPF-1001`, sau đó nội bộ xác nhận qua API NVC hoặc xác nhận thủ công để chuyển sang `SPF-1002`; NVC tiếp nhận yêu cầu qua API được xem là đã xác nhận chuyển hoàn; loại `return_type`, dữ liệu quản lý yêu cầu và nghiệp vụ thu hồi sau giao khỏi API chuyển hoàn\.|
|1\.2\.0|16/09/2026|Mục 1, 3\.1 và 4\.1\.7|Loại API hẹn lại lịch lấy và hối giao|Xóa `/v1/orders/{order_code}/reschedule` và `/v1/orders/{order_code}/urge` khỏi danh mục vì hai chức năng chưa thuộc API Module Order hiện hành; đồng thời loại `RESCHEDULE_PICKUP`, `URGE_DELIVERY` khỏi danh sách thao tác khả dụng và cập nhật tổng số API\.|
|1\.2\.0|16/09/2026|Mục 4\.3 và 4\.4|Sắp xếp API Chặng và hành trình|Sắp xếp phần thiết kế chi tiết đúng thứ tự danh mục endpoint: danh sách chặng, chi tiết chặng, lịch sử Waybill, tạo Waybill, tracking, người/tài xế và SLA; thống nhất endpoint dùng `stages/{stage_code}`, chuyển SLA về nhóm Hành trình và bổ sung contract chi tiết chặng\.|
|1\.2\.0|16/09/2026|Mục 4\.2\.7 và 4\.2\.8|Loại API tra cứu yêu cầu khỏi Module Order|Xóa API danh sách và chi tiết yêu cầu tổng hợp của Order vì vòng đời yêu cầu, Ticket, trạng thái xử lý và kết quả hỗ trợ thuộc Support Module\. Order chỉ lưu kết quả đã tác động lên đơn và Activity tham chiếu khi cần\.|
|1\.2\.0|16/09/2026|Mục 3\.3 và 4\.2\.6|Đổi đơn vị vận chuyển|Đổi API từ mô hình tạo yêu cầu/Ticket sang thao tác nội bộ trực tiếp tại `/v1/orders/{order_code}/carrier`; dùng `stage_code`, mã NVC mới và mã lý do; bảo toàn Waybill cũ, chỉ kích hoạt NVC mới khi đổi thành công và trả rõ trạng thái hoàn tất, đang xử lý hoặc chờ đối soát\.|
|1\.2\.0|16/09/2026|Mục 3\.3 và 4\.2\.6|Thiết lập NVC cho chặng|Mở rộng API để hỗ trợ hai trường hợp độc lập: đổi NVC trên chặng đã tồn tại và tạo chặng `RETURN` mới rồi gán NVC khi NVC giao không hỗ trợ chiều hoàn; bổ sung `operation_type`, contract Request/Response và lỗi tương ứng\.|
|1\.2\.0|16/09/2026|Mục 4\.2\.6|Request/Response tạo chặng hoàn|Backend sử dụng thông tin chuyển hoàn đã được xác nhận trên Order; Response trả tóm tắt chặng nguồn, phạm vi hàng, điểm lấy, điểm trả và COD chiều hoàn\. Bổ sung trường hợp NVC pending/unknown giữ nguyên `SPF-0901`; chỉ chuyển `SPF-1003` hoặc `SPF-1007` khi NVC xác nhận kết quả tương ứng\.|
|1\.2\.0|16/09/2026|Mục 3\.3 và 4\.2\.6|Điều phối NVC tự nhận diện chặng|Không nhận `stage_code` trong Request vì Backend phải tự xác định hoặc tạo chặng; Request chỉ nhận loại điều phối, NVC mục tiêu và lý do\.|
|1\.2\.0|16/09/2026|Mục 3\.3 và 4\.2\.6|Loại phương án NVC hỗ trợ|Xóa `operation_type = 3`, ví dụ bàn giao sang NVC hỗ trợ và mã lỗi liên quan vì nghiệp vụ này không tồn tại trong phạm vi Module Order hiện hành\.|
|1\.2\.0|16/09/2026|Mục 4\.2\.6|Giá và tài chính sau điều phối NVC|Bổ sung kết quả tính giá gồm mã giá cũ/mới, bên trả phí, COD, tiền người nhận phải thanh toán, phí trước/sau, chênh lệch, chi tiết phí và khoản thu thêm/hoàn lại\. Khi giá chưa xác định, Response chỉ trả trạng thái đang tính và không kích hoạt NVC mới\.|
|1\.2\.0|16/09/2026|Mục 1 và 3|Số lượng API Module Order|Đối chiếu lại danh mục hiện hành: 35 Core API, 11 Workflow API; tổng 45 API bắt buộc và 46 API khi tính thêm API tra cứu công khai tùy chọn\.|
|1\.2\.0|17/09/2026|Mục 4\.2\.6|Loại mã phương án hoàn chưa được xác nhận|Xóa `return_plan_code` và giá trị minh họa `RTP-*` khỏi schema và Response vì hệ thống SuperShip chưa có mã nghiệp vụ này; Backend dùng trực tiếp dữ liệu chuyển hoàn đã được xác nhận trên Order\.|
|1\.2\.0|17/09/2026|Mục 4\.2\.5|Thời điểm xác nhận chuyển hoàn|Xóa `confirmed_at` khỏi Response vì trùng ý nghĩa và giá trị với `updated_at`; dùng `updated_at` làm thời điểm Order được cập nhật sau khi xác nhận chuyển hoàn\.|
|1\.2\.0|17/09/2026|Mục 4\.2\.6|Chuẩn hóa Response điều phối NVC|Thống nhất một cấu trúc Response cho cả đổi NVC và gán NVC chiều hoàn; các trường chung giữ nguyên tên và thứ tự, chỉ bổ sung `previous_carrier` cho đổi NVC\. Mở rộng `active_carrier_code` cho mọi trường hợp đã có NVC thực tế chịu trách nhiệm\.|
|1\.2\.0|17/09/2026|Mục 4\.2\.6|Dữ liệu tạo chặng và Waybill mới|Thiết kế lại Request để nhận đầy đủ điểm lấy, điểm giao, kiện hàng, COD và yêu cầu dịch vụ của chặng; Response trả lại cùng snapshot đã dùng để tạo Waybill\. Xóa `return_summary`, `total_return_items` và `total_return_quantity` vì không có nguồn dữ liệu trực tiếp từ Request\.|
|1\.2\.0|17/09/2026|Mục 2\.6 và 4\.2\.6|Mã địa chỉ hành chính hai cấp|Chuẩn hóa dữ liệu mẫu `model = 2` sang mã Tỉnh/Thành dạng `P01` và mã Phường/Xã dạng `P01Cxxxx`; không dùng mã số của mô hình ba cấp cho địa chỉ hai cấp\.|
|1\.2\.0|17/09/2026|Mục 1, 3\.1 và 4\.3|Loại API tạo Waybill thủ công|Xóa `POST /v1/orders/{order_code}/stages/{stage_code}/waybills` vì SuperPlatform không có nghiệp vụ người dùng tự tạo Waybill\. Waybill được tạo tự động khi tạo Order, điều phối NVC hoặc retry; giữ API GET để tra cứu lịch sử Waybill\. Cập nhật tổng số API và đánh lại số thứ tự nhóm hành trình\.|
|1\.2\.0|17/09/2026|Mục 4\.3\.1–4\.3\.7|Chuẩn hóa API chặng và hành trình|Tách rõ danh sách chặng, snapshot chi tiết, lịch sử Waybill, timeline Tracking, người đang thực hiện, lịch sử người phụ trách và SLA; bỏ giới hạn bốn chặng, dữ liệu `null`, profile phân quyền công khai và milestones trùng lặp; bổ sung trạng thái chuẩn hóa, raw status theo quyền, vị trí hiện tại, tài xế/phương tiện và enum số\.|
|1\.2\.0|17/09/2026|Toàn bộ đặc tả API|Endpoint tự chứa đầy đủ contract|Thay toàn bộ câu “dùng header chung” bằng bảng Headers đầy đủ tại từng endpoint; bổ sung nguyên tắc không tham chiếu contract của mục/API khác và loại các câu tham chiếu còn lại trong nội dung hiện hành\.|
|1\.2\.0|17/09/2026|Mục 2\.7 và 4\.3\.1–4\.3\.4|Mã vận đơn và trạng thái gốc NVC|Thay mã vận đơn minh họa không đúng định dạng bằng mẫu đã xác nhận; tách raw status thành `carrier_status_code` và `carrier_status_name`; loại các trạng thái tiếng Anh tự đặt; làm rõ trạng thái Order, trạng thái chặng và trạng thái gốc NVC là ba lớp dữ liệu khác nhau\.|
|1\.2\.0|17/09/2026|Mục 4\.3\.1, 4\.3\.2 và 4\.3\.4|Tên trường trạng thái gốc NVC|Chuẩn hóa toàn bộ tên trường trạng thái gốc thành `carrier_status_code` và `carrier_status_name` để thống nhất với nhóm trường `carrier_*` của NVC và giúp người đọc dễ hiểu hơn\.|
|1\.2\.0|17/09/2026|Mục 2\.7 và các Response có vận đơn SuperShip|Mã vận đơn SuperShip|Khôi phục đúng mã vận đơn SuperShip `STGS983262LM.826941741` đã được nghiệp vụ cung cấp; loại mã minh họa không thuộc dữ liệu dự án\.|
|1\.2\.0|17/09/2026|Mục 4\.3\.1 và 4\.3\.2|Vị trí hiện tại của kiện hàng|Chuyển `current_location` lên cấp Order trong API danh sách chặng vì kiện chỉ có một vị trí hiện tại tại một thời điểm; chặng đã hoàn tất không mang vị trí hiện tại\. API chi tiết chặng chỉ trả vị trí này khi chính chặng được truy vấn đang thực hiện và nguồn NVC/kho có dữ liệu đáng tin cậy\.|
|1\.2\.0|17/09/2026|Mục 4\.3\.1|Trạng thái NVC của từng chặng|Bắt buộc bảo toàn trạng thái NVC cuối cùng trên cả chặng đã hoàn tất và chặng hiện hành; bổ sung trạng thái toàn Order để phân biệt với trạng thái từng chặng; mở rộng ví dụ nhiều NVC thành hành trình ba chặng gồm SuperShip lấy hàng, GHN giao thất bại và BEST đang chuyển hoàn\.|
|1\.2\.0|17/09/2026|Mục 4\.3\.1|Một NVC và một Waybill xuyên suốt nhiều chặng|Bổ sung Response riêng cho trường hợp SuperShip dùng cùng một Waybill thực hiện ba chặng lấy hàng, giao hàng và hoàn về Shop; mỗi chặng vẫn lưu trạng thái SuperPlatform và Carrier Status cuối cùng riêng\.|
|1\.2\.0|17/09/2026|Mục 4\.3\.2|Chi tiết chặng vận chuyển|Bổ sung thời điểm Carrier Status, vị trí hiện tại đầy đủ và hành trình `events[]` của riêng chặng\.|
|1\.2\.0|17/09/2026|Mục 4\.3 và 4\.3\.2|Phân biệt API chặng, hành trình và lịch sử Waybill|Bổ sung bảng mục đích của sáu API trong nhóm; mở rộng API chi tiết chặng để trả `events[]` của riêng chặng; làm rõ ảnh hành trình nhiều chặng thuộc API Tracking, còn lịch sử Waybill chỉ phản ánh các vận đơn từng gắn với chặng\.|
|1\.2\.0|17/09/2026|Mục 4\.3\.2 và 4\.3\.4|Vị trí tại từng mốc hành trình|Thay `location_name` đơn lẻ bằng snapshot `location` tại từng event, gồm Tỉnh/Thành, Quận/Huyện, Phường/Xã và bưu cục/Hub khi nguồn cung cấp; phân biệt vị trí lịch sử của mốc với `current_location` hiện tại của kiện\.|
|1\.2\.0|17/09/2026|Mục 4\.3\.2|Đơn giản hóa trạng thái trong chi tiết chặng|Loại chặng hiện hành và danh sách chặng dùng chung Waybill khỏi Response; đổi trạng thái chuẩn hóa thành `stage_status_code`/`stage_status_name` để phân biệt rõ với trạng thái toàn Order và `carrier_status_code`/`carrier_status_name` của NVC\.|
|1\.2\.0|17/09/2026|Mục 4\.3\.2|Trạng thái hiện tại của Order|Bổ sung `order_status` và `order_status_name` ngay sau `order_code` để cung cấp ngữ cảnh trạng thái tổng thể khi xem chi tiết một chặng\.|
|1\.2\.0|17/09/2026|Mục 4\.3\.3|Lịch sử vận đơn của chặng|Mở rộng mỗi Waybill thành snapshot đầy đủ của dữ liệu đã dùng để tạo vận đơn: dịch vụ, người gửi/nhận, địa chỉ, sản phẩm, khối lượng/kích thước, COD, khai giá, yêu cầu giao hàng và tham số riêng của NVC; giữ quan hệ Waybill cũ–mới, trạng thái cuối và thời gian hiệu lực; không công khai credential hoặc raw HTTP payload nhạy cảm\.|
|1\.2\.0|17/09/2026|Mục 4\.3\.4|Hành trình toàn Đơn hàng|Mở rộng Response theo toàn bộ chặng; bổ sung trạng thái Order, chặng hiện hành, vị trí hiện tại, NVC/Waybill từng chặng, trạng thái gốc NVC, thời gian chặng và vị trí từng mốc\. Ví dụ nội bộ thể hiện đầy đủ hành trình SuperShip lấy hàng và Viettel Post giao hàng; dữ liệu kỹ thuật được lọc khỏi phạm vi Shop khi cần\.|
|1\.2\.0|17/09/2026|Mục 4\.3\.5|Người/tài xế đang thực hiện|Đổi Response sang `assignments[]` để hỗ trợ nhiều chặng hoạt động; bổ sung chặng, trạng thái, NVC, Waybill, vai trò thực hiện, ảnh, số điện thoại, phương tiện và thời gian nguồn cập nhật\. Khẳng định Shop được xem ảnh/thông tin do NVC cho phép, còn nội bộ xem dữ liệu đầy đủ theo quyền và được ghi Audit\.|
|1\.2\.0|17/09/2026|Mục 1, 3 và 4\.3\.6–4\.3\.7|Lịch sử người phụ trách Đơn hàng|Bổ sung `GET /v1/orders/{order_code}/shippers` để trả toàn bộ người từng phụ trách theo chặng, NVC, Waybill, vai trò và thời gian; phân biệt với API `/shipper` chỉ trả người đang thực hiện\. Đánh lại số mục SLA và tăng tổng danh mục lên 45 API bắt buộc, 46 API khi tính API công khai tùy chọn\.|
|1\.2\.0|17/09/2026|Mục 4\.3\.5–4\.3\.6|Mã người thực hiện do NVC cung cấp|Giữ `carrier_shipper_code` dưới dạng tùy chọn dành cho nội bộ tra cứu/đối soát; Green SM ánh xạ trực tiếp từ `data.driver.id` khi yêu cầu component `driver`\. NVC không cung cấp thì bỏ trường, không trả `null` và không tự sinh mã thay thế\.|
|1\.2\.0|17/09/2026|Mục 4\.3\.5–4\.3\.6|Thời điểm cập nhật phân công|Đổi `source_updated_at` thành `updated_at` để diễn đạt đơn giản, thống nhất; trường cho biết thông tin phân công được cập nhật gần nhất trên SuperPlatform\.|
|1\.2\.0|17/09/2026|Mục 4\.3\.7|SLA của Đơn hàng|Tách rõ hai quan hệ SLA: SuperPlatform cam kết với Shop được đánh giá trên toàn Đơn hàng; SuperPlatform đối chiếu với NVC theo từng Waybill\. Loại bỏ hoàn toàn SLA theo chặng; bổ sung Response riêng theo phạm vi Shop/nội bộ và trường hợp chính sách không áp dụng SLA\.|
|1\.2\.0|17/09/2026|Mục 4\.3\.7|Đối chiếu SLA với SuperShip Helpdocs|Bổ sung khoảng thời gian theo NVC và loại tuyến, chiều giao/hoàn, mức cam kết hoặc tham khảo, lịch tính thời gian, ngày cộng thêm, điều chỉnh vùng sâu/đảo/lễ/Tết/bất khả kháng và ngưỡng khiếu nại theo từng Waybill\. Tách SLA vận chuyển khỏi SLA xử lý Ticket của Support Module\.|
|1\.2\.0|17/09/2026|Mục 4\.3\.7|Tên trường SLA toàn Đơn hàng|Đổi `shop_sla` thành `order_sla`, đồng thời đổi các trường `available` và `reason` liên quan để phản ánh đúng đây là SLA của toàn Đơn hàng; Shop là đối tượng nhận cam kết, không phải cấp dữ liệu SLA\.|
|1\.2\.0|17/09/2026|Mục 4\.3\.7|Xác định SLA theo chính sách và tuyến Order|Loại bỏ trường hợp “chưa đủ dữ liệu đánh giá”\. SLA của Order được xác định từ chính sách áp dụng cho đối tác/Shop và `route_type` tính từ điểm đi–điểm đến; dữ liệu không hợp lệ phải được xử lý ở lúc tạo Order hoặc báo lỗi hệ thống, không trở thành kết quả SLA nghiệp vụ\.|
|1\.2\.0|17/09/2026|Mục 4\.3\.7|Tinh gọn SLA theo Waybill|Bỏ `sla_code` và `sla_name` tự giả định ở cấp Waybill; dùng NVC và mã Waybill để định danh\. Loại `claim_assessment` khỏi Order API vì điều kiện khiếu nại/bồi thường thuộc Support Module\.|
|1\.2\.0|17/09/2026|Mục 4\.4\.1|Lịch sử hoạt động của Đơn hàng|Mở rộng Activity Log để bao quát tạo/sửa Order, trạng thái Order và NVC, yêu cầu vận hành/hỗ trợ, in nhãn, ảnh, COD, đổi NVC/Waybill, đồng bộ và xem dữ liệu nhạy cảm\. Bổ sung chủ thể, nguồn, dữ liệu trước–sau, NVC/Waybill, tham chiếu liên quan, phân trang và phạm vi hiển thị Shop/nội bộ\.|
|1\.2\.0|17/09/2026|Mục 4\.4\.1|Chuẩn hóa một format Activity Log|Mọi loại lịch sử dùng chung một Activity Envelope; bỏ các object riêng theo loại như `carrier`, `stage` và trạng thái trước–sau ở cấp trên\. Chuẩn hóa dữ liệu thay đổi vào `changes[]`, đối tượng liên quan vào `references[]`; bổ sung `activity_key`, `sequence_no`, `recorded_at` và giá trị hiển thị để FE dùng một component timeline duy nhất\.|
|1\.2\.0|17/09/2026|Mục 2\.6 và 4\.4\.1|Vị trí giải thích trong API Contract|Bổ sung quy ước: mô tả nghiệp vụ, phạm vi dữ liệu và phân quyền phải đặt trước Endpoint; từ Endpoint đến Error chỉ chứa contract tích hợp\. Chuyển nội dung giải thích quyền xem Activity Log lên phần mô tả đầu API\.|
|1\.2\.0|17/09/2026|Mục 4\.4\.1|Phân biệt nhóm và hành động lịch sử|Đổi `activity_type` thành `activity_group` và `activity_types` thành `activity_groups` để thể hiện đây là nhóm dùng lọc/chọn giao diện; giữ `activity_key` làm khóa nhận diện hành động cụ thể\.|
|1\.2\.0|17/09/2026|Mục 4\.4\.2|Phí và tiền thu hộ của Đơn hàng|Đổi tên “Tổng quan tài chính” thành “Phí và tiền thu hộ”, dùng endpoint ngắn `/finance`\. Chuẩn hóa mã giá, phí theo từng khoản/Waybill, bên trả phí, COD, tiền phải thu, tiền đã thu và tình trạng chuyển tiền; khẳng định API không thay thế sổ cái hoặc chứng từ đối soát\.|
|1\.2\.0|17/09/2026|Mục 4\.4\.2|Tách giá bán Order và giá vốn NVC|Đổi `fee_items[]` thành `order_fee_items[]` và bỏ Waybill khỏi phí bán cho Shop\. Bổ sung `carrier_costs[]` theo từng Waybill và `internal_summary` gồm doanh thu Order, tổng giá vốn NVC và chênh lệch; hai trường nội bộ không trả cho Shop\.|
|1\.2\.0|17/09/2026|Mục 4\.5\.1–4\.5\.2|Ghi chú Đơn hàng|Chuẩn hóa API lấy và tạo ghi chú theo phạm vi chia sẻ với Shop hoặc chỉ nội bộ; bổ sung người tạo, tham chiếu tới ghi chú/chặng/Waybill/ảnh, phân trang, idempotency và đầy đủ mã lỗi\. Ghi chú không sửa đè, không xóa và không thay thế hướng dẫn giao hàng hoặc Ticket hỗ trợ\.|
|1\.2\.0|17/09/2026|Mục 4\.5\.3–4\.5\.5|Hình ảnh Đơn hàng|Chuẩn hóa danh mục ảnh hàng hóa, đóng gói, niêm phong, lấy/bàn giao/giao/trả hàng, hư hỏng; bổ sung nguồn ảnh, phạm vi hiển thị, chặng/Waybill liên quan, thời điểm chụp, URL có hạn và quyền gỡ\. Đổi API thêm ảnh sang nhận `file_code` đã tải lên File Service, không nhận binary/Base64 tại Module Order; không cho gỡ bằng chứng nghiệp vụ được bảo vệ\.|
|1\.2\.0|17/09/2026|Mục 4\.6\.1|Lịch sử in nhãn giao hàng|Chuẩn hóa mỗi phần tử thành một lần yêu cầu in hoàn chỉnh dùng chung cho kết quả thành công và thất bại: thứ tự, in lần đầu/in lại, in riêng/in hàng loạt, số Order trong file, snapshot NVC–Waybill–mã phân loại, khổ/định dạng nhãn, kênh, kết quả, người thao tác, IP và thời điểm yêu cầu/kết thúc\. Bổ sung số liệu tổng hợp cấp Order; không phân trang hoặc lọc\.|
|1\.2\.0|17/09/2026|Mục 4\.6|Loại API quản trị Template khỏi Module Order|Không đưa API tạo, sửa hoặc xóa Template nhãn vào phase hiện tại vì đây là cấu hình nội dung tem trong tương lai\. Nhóm 4\.6 hiện chỉ gồm lịch sử in, loại tem khả dụng, tạo token và nhận file in\.|
|1\.2\.0|17/09/2026|Mục 2\.1, 2\.3, 4\.5 và 4\.6|Tên mảng Response theo đối tượng nghiệp vụ|Bổ sung quy ước không dùng `items` khi đã biết loại đối tượng\. Đổi danh sách ghi chú thành `notes`, hình ảnh thành `images`, lịch sử in thành `prints`; đồng thời đổi tổng số tương ứng thành `total_notes`, `total_images` và `total_prints` để FE đọc contract trực tiếp\.|
|1\.2\.0|17/09/2026|Mục 4\.5\.1–4\.5\.4|Ngữ cảnh nghiệp vụ của ghi chú và hình ảnh|Xác định rõ đối tượng `OrderNote` và `OrderImage`, mục đích của từng endpoint và loại nghiệp vụ áp dụng\. Bổ sung `note_type`, `business_context`, chặng/Waybill, ghi chú đính chính và ảnh thuộc ghi chú; các API hình ảnh tiếp tục bắt buộc phân loại mục đích ảnh và liên kết đúng chặng/Waybill khi có\.|
|1\.2\.0|17/09/2026|Mục 4\.5\.1–4\.5\.2|Tinh gọn `OrderNote` theo đúng nơi sử dụng|Xác định ghi chú chỉ hiển thị tại khối Ghi chú đơn hàng và thuộc cấp toàn Order\. Loại `business_context`, chặng, Waybill và ảnh khỏi API ghi chú để tránh trùng tracking/API hình ảnh; chỉ giữ loại ghi chú, nội dung, người tạo và thời điểm tạo\.|
|1\.2\.0|17/09/2026|Mục 4\.5\.1–4\.5\.2|Ẩn phạm vi hiển thị của ghi chú|Xóa `visibility` khỏi Request và Response của API ghi chú\. Backend tự xác định ghi chú người gọi được phép tạo hoặc xem theo Access Context, quyền và Data Scope; FE không gửi và không nhận trường phân loại quyền này\.|
|1\.2\.0|17/09/2026|Mục 4\.5\.1–4\.5\.2|Phân loại ghi chú theo nghiệp vụ|Bổ sung `note_type` để phân biệt ghi chú chung, lấy hàng, giao hàng và hoàn/trả hàng; bổ sung bộ lọc `note_types` cho API danh sách\. Ghi chú vẫn thuộc cấp toàn Order, không yêu cầu `stage_code`, Waybill hoặc khối ngữ cảnh nghiệp vụ\.|
|1\.2\.0|17/09/2026|Mục 4\.5\.2|Trường hợp sử dụng API tạo ghi chú|Bổ sung mục đích sử dụng cụ thể cho từng loại ghi chú chung, lấy hàng, giao hàng và hoàn/trả hàng; làm rõ ghi chú chỉ phục vụ theo dõi trên Order, không tự gửi yêu cầu sang NVC hoặc thay thế API nghiệp vụ\.|
|1\.2\.0|17/09/2026|Mục 4\.5\.1–4\.5\.2|Loại trường đính chính ghi chú|Xóa `corrects_note_code` khỏi API lấy và tạo ghi chú, đồng thời xóa lỗi `INVALID_CORRECTED_NOTE` vì nghiệp vụ hiện tại không có chức năng đính chính hoặc liên kết ghi chú cũ\.|
|1\.2\.0|17/09/2026|Mục 4\.5\.3|Lấy hình ảnh nghiệp vụ của Đơn hàng|Rút gọn API theo quy mô ảnh thực tế của một Order: trả toàn bộ ảnh, không phân trang và không dùng bộ lọc\. Bổ sung Request mẫu; bỏ thumbnail, thời hạn URL, Actor chi tiết, quyền xóa và metadata; giữ loại ảnh, URL, nguồn cung cấp, NVC/Waybill khi có và thời điểm ghi nhận\. Xóa `visibility` vì Backend tự lọc dữ liệu theo quyền\.|
|1\.2\.0|17/09/2026|Mục 4\.5\.4|Shop thêm hình ảnh vào Đơn hàng|Giới hạn endpoint thêm ảnh cho Shop sở hữu Order và chỉ cho bổ sung ảnh hàng hóa trước khi NVC lấy hàng thành công\. Rút gọn Request còn `file_code`, mô tả; đồng bộ Response với API lấy ảnh\. Làm rõ ảnh NVC đi qua webhook/tra cứu của Carrier Module, được xác thực, lưu File Service và đồng bộ sang Order thay vì gọi API của Shop\.|
|1\.2\.0|17/09/2026|Mục 4\.5\.5|Shop gỡ hình ảnh khỏi Đơn hàng|Đổi tên và nội dung API từ “ngừng hiển thị” thành Shop gỡ ảnh hàng hóa đã thêm khỏi Order\. Giới hạn cho Shop sở hữu Order, chỉ áp dụng với ảnh nguồn Shop trước khi NVC lấy hàng thành công; ảnh NVC/hệ thống không thuộc phạm vi API này\. Bổ sung Request mẫu và đổi thời điểm kết quả thành `updated_at`\.|
|1\.2\.0|17/09/2026|Mục 3 và 4\.5\.5|Gỡ một hoặc nhiều hình ảnh khỏi Đơn hàng|Đổi endpoint sang `POST /v1/orders/{order_code}/images/remove` và bổ sung `image_codes[]` để Shop gỡ một hoặc nhiều ảnh trong cùng request\. Toàn bộ danh sách phải hợp lệ trước khi thực hiện để không phát sinh kết quả gỡ một phần\.|
|1\.2\.0|17/09/2026|Mục 3, 4\.6 và 5\.3|Danh mục API in Nhãn Giao Hàng|Chốt bốn API: xem lịch sử in của một Order, lấy loại nhãn, tạo token cho một hoặc nhiều Order và dùng token nhận file nhãn\. Chuẩn hóa endpoint Workflow thành `/types`, `/tokens`, `/print`\.|
|1\.2\.0|17/09/2026|Mục 4\.6\.1|Snapshot loại tem đã in|Bổ sung `label_code`, `label_name`, `label_version` và `paper_size` vào từng lần in để lịch sử giữ chính xác loại tem cùng phiên bản nội dung đã sử dụng\. Chưa bổ sung API tạo/sửa/xóa mẫu tem vì quản trị nội dung tem không thuộc phase hiện tại\.|
|1\.2\.0|17/09/2026|Mục 3, 4\.6 và 5|Gom nhóm API In Nhãn Giao Hàng|Chuyển ba API loại tem, tạo token và nhận file in từ nhóm 5\.3 về ngay sau lịch sử in tại mục 4\.6\.2–4\.6\.4\. Đồng bộ thứ tự danh mục endpoint, chuyển ba API sang Core và đánh lại nhóm Tra cứu công khai thành mục 5\.3\.|
|1\.2\.0|17/09/2026|Mục 4\.6\.2|Kích thước thực tế của loại tem|Bổ sung `width_mm`, `height_mm` và `display_size` để FE hiển thị chính xác kích thước tem như `74 × 105 mm` hoặc `100 × 100 mm`; dùng milimét làm đơn vị chuẩn của contract\.|
|1\.2\.0|17/09/2026|Mục 3, 4\.6\.2–4\.6\.4|Tạo Token in theo Order SuperPlatform|Request tạo Token chỉ nhận `order_codes[]`, không nhận loại nhãn, chặng, NVC hoặc mã vận đơn\. Response thành công chỉ trả `print_token` khoảng 32 ký tự; không trả danh sách kết quả, số lượng hoặc thời hạn\. Token chỉ đại diện cho danh sách Order; `label_code` được chọn khi gọi API in\.|
|1\.2\.0|17/09/2026|Mục 3 và 5\.1\.1|Tải mẫu tạo Đơn hàng loạt|Bỏ Response JSON và `download_url`; API thành công trả trực tiếp file Excel binary\. Bổ sung `address_model = 1` cho mẫu địa chỉ ba cấp và `address_model = 2` cho mẫu địa chỉ hai cấp\.|
|1\.2\.0|17/09/2026|Mục 3 và 5\.1\.2–5\.1\.8|Luồng tạo Đơn hàng loạt|Bổ sung API parse file còn thiếu và đánh lại thứ tự nhóm; API parse nhận trực tiếp file `.xlsx` qua `multipart/form-data`, không yêu cầu `file_code`; trả dữ liệu từng dòng để kiểm tra/chỉnh sửa rồi validate trước khi tạo batch\.|
|1\.2\.0|17/09/2026|Mục 5\.1\.2|Response đọc file tạo Đơn hàng loạt|Tách Response thành `summary` tổng quát, `columns[]` để FE dựng header và `rows[]` để nạp dữ liệu vào sheet\. Mỗi dòng có kết quả đọc, giá trị theo `column_code` và lỗi ô nếu có; phân biệt rõ lỗi đọc file với lỗi nghiệp vụ ở bước validate\.|
|1\.2\.0|17/09/2026|Mục 4\.1\.1 và 5\.1\.2|Cột dữ liệu tạo Order trong file loạt|Đồng bộ `columns[]` và `rows[].values` với dữ liệu tạo Order đơn: người nhận, địa chỉ hai/ba cấp, hàng hóa, khối lượng/kích thước, khai giá, COD, xem hàng, bên trả phí, dịch vụ, ghi chú và ảnh\. Loại toàn bộ thông tin điểm lấy và NVC khỏi file theo quyết định nghiệp vụ\.|
|1\.2\.0|17/09/2026|Mục 5\.1\.2|Giới hạn dữ liệu phẳng trong file Excel|Loại `products`, `image_codes`, `parcel_tags`, `services` và `parcel_content_type` khỏi `columns[]`/`rows[].values` vì một ô Excel không lưu object hoặc array theo contract này\. Tạo đơn loạt chỉ nhận tên hàng qua `product_name` và các giá trị phẳng khác\.|
|1\.2\.0|17/09/2026|Mục 5\.1\.2|Tên địa chỉ trong file tạo Đơn hàng loạt|Thay cột mã Tỉnh/Thành, Quận/Huyện, Phường/Xã bằng cột tên dễ nhập; xóa vĩ độ và kinh độ\. Backend dùng Address Module nhận diện tên địa chỉ và chuẩn hóa sang mã hệ thống; mẫu hai cấp không có Quận/Huyện\.|

## BẢNG THUẬT NGỮ

|Thuật ngữ / Trường|Tên tiếng Việt dễ hiểu|Giải thích trong tài liệu này|
|---|---|---|
|Access Context|Ngữ cảnh truy cập|Tập thông tin đã được xác thực cho biết ai đang gọi API, đang đại diện cho tổ chức nào, dùng ứng dụng nào và được thao tác trong phạm vi nào\.|
|Access Token|Mã xác thực truy cập|Chuỗi được User Module phát hành và ký để chứng minh danh tính/ngữ cảnh của người hoặc ứng dụng gọi API\. Client không được tự sửa nội dung Token\.|
|Actor|Chủ thể thực hiện|Người dùng, ứng dụng đối tác, Service Account hoặc tiến trình hệ thống thực hiện một hành động\.|
|`actor_type`|Loại chủ thể|Cho biết Actor là `USER`, `PARTNER_APPLICATION`, `SERVICE_ACCOUNT` hay `SYSTEM`\.|
|Identity / `identity_id`|Danh tính|Định danh ổn định của người hoặc danh tính máy thực sự thực hiện request\. Trong Token, Identity thường được biểu diễn bằng claim `sub`\.|
|Membership / `membership_id`|Tư cách thành viên|Quan hệ giữa một Identity và một Organization\. Một người có thể có nhiều Membership nhưng mỗi request chỉ sử dụng một Membership hiện hành\.|
|Active Membership|Tư cách đang sử dụng|Membership người dùng đã chọn cho phiên làm việc hiện tại; quyết định người đó đang đại diện cho tổ chức nào\.|
|Organization / `organization_id`|Tổ chức|Chủ thể tổ chức mà người dùng đang đại diện, ví dụ Shop hoặc tổ chức nội bộ SuperShip\.|
|`organization_type`|Loại tổ chức|Phân loại Organization như `SHOP`, nội bộ SuperShip, NVC hoặc đối tác\.|
|Shop / `shop_id`|Shop sở hữu dữ liệu|Shop sở hữu Order và là căn cứ kiểm soát phạm vi dữ liệu\. Khi Shop tự thao tác, Backend suy ra Shop từ Membership, không nhận `shop_id` từ body\.|
|Application / `application_id`|Ứng dụng nghiệp vụ|Sản phẩm/ngữ cảnh phát sinh request, ví dụ SuperShip, SuperAI hoặc SuperPlatform Admin\. Application quyết định một số chính sách nghiệp vụ được áp dụng\.|
|Client / `client_id`|Thành phần gọi API|Thành phần kỹ thuật cụ thể như Web, Mobile, Partner API Client hoặc Backend Service\. Một Application có thể có nhiều Client\.|
|`azp`|Client được cấp quyền|Claim chuẩn thường dùng trong Access Token để chỉ Client đã được cấp Token và đang gọi API\. Module Order quy đổi giá trị này thành `client_id` trong Trusted Access Context\.|
|Session / `session_id`|Phiên đăng nhập|Phiên xác thực cụ thể của người dùng, dùng để thu hồi truy cập, điều tra bảo mật và Audit\.|
|Data Scope|Phạm vi dữ liệu|Giới hạn Shop, tổ chức hoặc dữ liệu mà Actor được phép xem/thao tác\. Data Scope do Backend kiểm tra, không do Frontend tự gửi\.|
|Permission|Quyền hành động|Quyền thực hiện một hành động cụ thể, ví dụ tạo, xem, sửa hoặc hủy Order\.|
|Role|Vai trò|Tập hợp Permission được cấp cho Membership để phục vụ một chức năng công việc\.|
|Entitlement|Quyền sử dụng ứng dụng của tổ chức|Cho biết Organization có được sử dụng một Application hay không; không thay thế Permission của người dùng\.|
|Trusted Access Context|Ngữ cảnh truy cập đáng tin cậy|Đối tượng nội bộ do Gateway/User Module tạo sau khi xác thực Token và chuyển cho Module Order\. Consumer không tự khai báo đối tượng này\.|
|Service Account|Tài khoản hệ thống|Danh tính máy dùng cho giao tiếp module với module hoặc hệ thống với hệ thống; không phải tài khoản đăng nhập của con người\.|
|Partner Application|Ứng dụng đối tác|Ứng dụng bên ngoài gọi API theo Credential, capability, Scope và liên kết với Shop đã được phê duyệt\.|
|Data Snapshot|Bản chụp dữ liệu|Giá trị được lưu tại thời điểm nghiệp vụ xảy ra để về sau vẫn biết chính xác thông tin nào đã được áp dụng\.|
|`owner_shop_id`|Shop sở hữu Order|Shop được xác định là chủ dữ liệu của Order tại thời điểm tạo\.|
|`created_application_id`|Ứng dụng tạo Order|Application phát sinh Order, ví dụ SuperShip hoặc SuperAI\.|
|`created_client_id`|Client tạo Order|Web, Mobile, Partner API hoặc Backend Service đã gửi request tạo Order\.|
|`created_channel`|Kênh tạo Order|Kênh được Backend suy ra từ Client Registry: `WEB`, `MOBILE`, `PARTNER_API`, `INTERNAL`, `BATCH` hoặc `SYSTEM`\.|
|Client Registry|Danh mục Client|Nơi đăng ký Client, Application sở hữu, loại kênh, Credential và chính sách được phép sử dụng\.|
|Consumer|Bên sử dụng API|Frontend, ứng dụng đối tác hoặc module khác gửi request đến API\.|
|API Gateway|Cổng tiếp nhận API|Thành phần kiểm tra Token, bảo mật request và chuyển ngữ cảnh đã xác thực tới module phía sau\.|
|Request Body|Nội dung yêu cầu|Phần dữ liệu nghiệp vụ Consumer gửi trong request\. Không dùng để tự khai báo quyền, danh tính hoặc nguồn tạo đáng tin cậy\.|
|Claim|Trường trong Token|Một thông tin được lưu trong Access Token đã ký, ví dụ `sub`, `membership_id`, `application_id` hoặc `azp`\.|
|Correlation ID / `correlation_id`|Mã truy vết|Mã dùng để nối log và quá trình xử lý của cùng một request xuyên qua nhiều module\.|
|Idempotency Key|Khóa chống xử lý trùng|Mã do Consumer gửi cho command có thể retry; cùng một khóa và cùng payload không được tạo thêm kết quả nghiệp vụ trùng\.|
|Audit|Nhật ký kiểm toán|Lịch sử ghi nhận ai thực hiện hành động gì, trên đối tượng nào, vào thời điểm nào và kết quả ra sao\.|
|Masking|Che dữ liệu nhạy cảm|Chỉ hiển thị một phần dữ liệu như số điện thoại tùy theo quyền của Actor\.|
|`soc`|Mã đơn riêng của Shop|Mã do Shop/hệ thống nguồn đặt để đối chiếu\. `soc` không phải mã Order SuperPlatform, mã vận đơn hoặc bằng chứng xác định Shop/người tạo\.|
|Order|Đơn hàng SuperPlatform|Bản ghi nghiệp vụ trung tâm do Shop hoặc chủ thể được ủy quyền tạo trên SuperPlatform\.|
|Waybill|Vận đơn NVC|Định danh vận chuyển do NVC phát hành cho một chặng; một Order có thể có nhiều Waybill\.|
|Shipping Stage / Leg|Chặng vận chuyển|Một phần của hành trình như lấy hàng, giao hàng, hoàn hàng hoặc trả hàng cuối\.|
|Carrier / NVC|Nhà vận chuyển|Đơn vị thực hiện một chặng vận chuyển như SuperShip, GHN, JNT, BEST, VNP, GrabExpress hoặc Green SM\.|
|Cấu hình chọn NVC|Quy tắc xác định NVC|Cấu hình đã lưu của Shop/Application cho biết hệ thống chọn NVC theo mô hình khách hàng, dùng tiêu chí tối ưu của SuperAI hoặc cho phép Shop chọn NVC thủ công\. Consumer không truyền lại cấu hình này trong từng request tạo Order\.|
|Booking|Lần yêu cầu NVC tạo chuyến|Quá trình Carrier Module gửi dữ liệu một chặng tới NVC để xin tạo vận đơn/chuyến; có thể đang xử lý, đang tìm tài xế, thành công hoặc thất bại\.|

## 1\. MỤC ĐÍCH VÀ PHẠM VI

Tài liệu đặc tả **45** API của Module Order theo hướng Contract\-First, gồm **44 API bắt buộc** và **1 API tùy chọn**\. Danh mục được chia thành Core API và Workflow API; Core API bao gồm cả các contract tích hợp nội bộ trực tiếp cập nhật Order\.

|Loại|Số lượng|
|---|---|
|Core API|35|
|Workflow API|10|
|Tổng API bắt buộc|**44**|
|Tổng gồm API tùy chọn|**45**|

API tùy chọn là `POST /v1/public/orders/tracking`, chỉ triển khai khi SuperPlatform cung cấp chức năng tra cứu hành trình cho người chưa đăng nhập\.

## 2\. QUY ƯỚC DÙNG CHUNG

### 2\.1\. Đặt tên

Field JSON dùng `snake_case`\. Dùng `order_code`, `soc`, `order_status`, `status_name`, `carrier_waybill_code`; không trả ID database, `client_order_code` hoặc `canonical_status`\. Mã Phường/Xã trong toàn bộ API SuperPlatform phải dùng tên `commune_code`; không dùng `ward_code`, kể cả khi tích hợp NVC gọi cấp hành chính này là ward\.

Tên mảng phải thể hiện đúng đối tượng nghiệp vụ, ưu tiên danh từ số nhiều như `orders`, `notes`, `images`, `stages`, `waybills`, `activities` hoặc `prints`\. Không dùng tên chung `items` khi đã xác định được loại đối tượng\. Trường tổng số trong `data.meta` cũng dùng tên tương ứng như `total_orders`, `total_notes` hoặc `total_images`; không dùng `total_items` cho contract mới hoặc contract đang được chuẩn hóa lại\.

### 2\.2\. Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization`|Có điều kiện|Bắt buộc với API cần xác thực; không truyền với API được đặc tả rõ là công khai\. Dùng để xác định Actor, quyền và Data Scope\.|
|`Content-Type`|Có điều kiện|Bắt buộc khi request có body; dùng `application/json`, trừ endpoint upload hình ảnh quy định định dạng khác\.|
|`Idempotency-Key`|Có điều kiện|Bắt buộc với API tạo mới hoặc hành động có thể được Consumer gửi lại; dùng để chống xử lý trùng\.|
|`X-Correlation-Id`|Không|Mã truy vết; Backend tự tạo nếu thiếu\.|

### 2\.3\. Response chuẩn

Mọi response JSON có đúng ba field cấp cao nhất: `error`, `message`, `data`\. Danh sách đặt trong trường mang tên đúng đối tượng nghiệp vụ bên dưới `data`, ví dụ `data.orders`, `data.notes` hoặc `data.images`; thông tin phân trang đặt tại `data.meta`\.

```JSON
{"error":false,"message":"Thành công.","data":{}}
```

```JSON
{"error":true,"message":"Không tìm thấy Đơn hàng.","data":{"code":"ORDER_NOT_FOUND","details":[]}}
```

### 2\.4\. Quyền và dữ liệu nhạy cảm

Backend tự xác định người hoặc hệ thống đang gọi, tư cách thành viên đang sử dụng, tổ chức/Shop đang đại diện, ứng dụng, Client và Data Scope từ ngữ cảnh truy cập đã được xác thực\. Client không được tự khai báo các thông tin này trong Request Body để mở rộng quyền hoặc giả mạo nguồn tạo Order\.

Tracking tự lọc theo quyền, không trả `detail_level` hoặc `visibility_level`\. `customer_type` và dữ liệu nội bộ chỉ trả cho Actor có quyền\. SĐT được masking theo quyền\.

### 2\.5\. Ngữ cảnh truy cập của một request

#### 2\.5\.1\. Ngữ cảnh truy cập dùng để làm gì?

Mỗi request gửi tới Module Order phải giúp hệ thống trả lời được các câu hỏi sau:

1. **Ai đang thực hiện?** Ví dụ: Chủ Shop, nhân viên Shop, nhân viên nội bộ SuperShip, ứng dụng đối tác hoặc một module khác\.
2. **Người đó đang làm việc với tư cách nào?** Một người có thể vừa là Chủ Shop A, vừa là nhân viên Shop B hoặc nhân viên nội bộ SuperShip\.
3. **Người đó đang đại diện cho tổ chức/Shop nào?** Đây là cơ sở xác định Shop sở hữu Order và phạm vi dữ liệu được phép xem hoặc thao tác\.
4. **Request đến từ ứng dụng nào?** Ví dụ: SuperShip, SuperAI, SuperPlatform Admin hoặc ứng dụng đối tác\.
5. **Thành phần kỹ thuật nào đang gọi API?** Ví dụ: Web, Mobile, API đối tác hoặc một Backend Service\.
6. **Chủ thể được phép làm gì và trên dữ liệu nào?** Ví dụ: chỉ xem Order của một Shop, hoặc nhân viên nội bộ được xem nhiều Shop trong khu vực phụ trách\.

Ngữ cảnh này được User Module phát hành trong Access Token và được API Gateway xác thực trước khi request đến Module Order\. Frontend không được tự tạo ngữ cảnh bằng cách gửi `shop_id`, `application_id`, `created_by` hoặc nguồn tạo trong Request Body\.

#### 2\.5\.2\. Các thành phần của ngữ cảnh truy cập

|Thành phần|Trường kỹ thuật|Ý nghĩa dễ hiểu|
|---|---|---|
|Danh tính|`identity_id`|Người hoặc danh tính máy thực sự thực hiện request\. Đối với người dùng, đây là tài khoản đã đăng nhập\.|
|Tư cách thành viên|`membership_id`|Cho biết người dùng đang tham gia và làm việc trong tổ chức nào với tư cách nào\. Một người có nhiều Membership nhưng mỗi request chỉ sử dụng một Membership hiện hành\.|
|Tổ chức|`organization_id`|Tổ chức mà người dùng đang đại diện tại thời điểm thực hiện request\. Có thể là Shop hoặc tổ chức nội bộ SuperShip\.|
|Loại tổ chức|`organization_type`|Giúp hệ thống phân biệt tổ chức hiện hành là Shop, tổ chức nội bộ, NVC hay loại đối tác khác\.|
|Shop sở hữu Order|`shop_id`|Shop sở hữu dữ liệu Order\. Nếu Organization hiện hành có loại `SHOP`, Backend suy ra `shop_id` từ `organization_id`; Shop không tự gửi trường này khi tạo Order\.|
|Ứng dụng|`application_id`|Ứng dụng nghiệp vụ phát sinh request, ví dụ `SUPERSHIP`, `SUPER_AI`, `SUPERPLATFORM_ADMIN` hoặc ứng dụng đối tác\.|
|Client|`client_id`|Thành phần kỹ thuật gọi API, ví dụ Web, Mobile, Partner API Client hoặc Backend Service\. Trong Access Token, giá trị này có thể được biểu diễn bằng claim chuẩn `azp`\.|
|Loại chủ thể|`actor_type`|Phân biệt người dùng, ứng dụng đối tác, Service Account hoặc hệ thống tự động\.|
|Phiên đăng nhập|`session_id`|Phiên đăng nhập đang sử dụng; phục vụ thu hồi phiên, điều tra bảo mật và Audit\. Không bắt buộc đối với một số giao tiếp hệ thống với hệ thống\.|
|Phạm vi dữ liệu|Data Scope|Giới hạn tổ chức/Shop và dữ liệu mà chủ thể được phép xem hoặc thao tác\. Data Scope được Backend kiểm tra, không nhận trực tiếp từ Client\.|

`actor_type` tối thiểu hỗ trợ:

|Giá trị|Ý nghĩa|
|---|---|
|`USER`|Một người dùng đã đăng nhập, có thể là người của Shop hoặc nhân viên nội bộ SuperShip\.|
|`PARTNER_APPLICATION`|Ứng dụng đối tác gọi API theo quyền đã được cấp và liên kết với Shop\.|
|`SERVICE_ACCOUNT`|Danh tính máy dùng cho giao tiếp hệ thống với hệ thống; không phải tài khoản con người\.|
|`SYSTEM`|Tiến trình nội bộ hoặc sự kiện hệ thống được tin cậy theo contract đã đăng ký\.|

#### 2\.5\.3\. Ví dụ Access Token của người dùng Shop

```JSON
{
  "sub": "identity-123",
  "membership_id": "membership-456",
  "organization_id": "organization-789",
  "organization_type": "SHOP",
  "application_id": "SUPER_AI",
  "azp": "superai-web",
  "actor_type": "USER",
  "session_id": "session-001"
}
```

Ý nghĩa của ví dụ:

- Người có danh tính `identity-123` đang đăng nhập\.
- Người đó đang sử dụng Membership `membership-456` tại Shop `organization-789`\.
- Request phát sinh từ ứng dụng SuperAI trên Client Web `superai-web`\.
- Module Order dùng `organization-789` làm Shop sở hữu Order nếu các kiểm tra quyền đều hợp lệ\.

Access Token không nên chứa toàn bộ danh sách Permission và Data Scope dài hạn\. Quyền có thể bị thu hồi khi Token vẫn còn thời hạn; Backend phải kiểm tra quyền hiệu lực theo cơ chế Authorization đã thống nhất với User Module\.

#### 2\.5\.4\. Cách xác định Shop trong từng trường hợp

**Shop tự thao tác**

```text
Identity → Membership hiện hành → Organization loại SHOP → Shop sở hữu Order
```

- Shop không truyền `shop_id` trong Request Body\.
- Backend lấy Shop từ Membership đã được xác thực\.
- Người dùng không thể thay `shop_id` để tạo hoặc xem Order của Shop khác\.

**Nhân viên nội bộ SuperShip thao tác**

- Membership hiện hành thuộc tổ chức nội bộ SuperShip, không phải Shop\.
- Khi tra cứu, nhân viên có thể chọn `shop_code` làm điều kiện lọc; Backend chỉ chấp nhận các Shop nằm trong Data Scope của nhân viên\.
- Khi tạo Order thay Shop, Shop mục tiêu phải được chỉ định theo contract nội bộ riêng và được kiểm tra quyền trước khi tạo\.
- Việc chọn Shop mục tiêu chỉ xác định đối tượng cần thao tác, không tự tạo thêm quyền cho nhân viên\.

**Ứng dụng đối tác thao tác thay Shop**

- Access Token xác định ứng dụng đối tác và Client đang gọi\.
- Request phải xác định Shop mục tiêu theo contract dành cho đối tác\.
- Backend chỉ chấp nhận khi tồn tại liên kết đối tác-Shop còn hiệu lực, đúng Application, capability và Scope đã được Shop chấp thuận\.
- Nếu liên kết hết hạn hoặc bị thu hồi, request phải bị từ chối dù Credential của đối tác vẫn còn hiệu lực\.

**Module khác hoặc tiến trình hệ thống**

- Sử dụng `SERVICE_ACCOUNT` hoặc `SYSTEM`, không giả làm tài khoản Shop\.
- Không bắt buộc có Membership của con người\.
- Chỉ được gọi các contract nội bộ đã đăng ký và đúng Permission/Scope của Service Account\.

#### 2\.5\.5\. Phân biệt Application và Client

Application là sản phẩm/ngữ cảnh nghiệp vụ mà người dùng đang sử dụng\. Client là thành phần kỹ thuật cụ thể kết nối tới API\.

Ví dụ:

```text
Application: SUPER_AI
├── Client: superai-web
├── Client: superai-mobile
└── Client: superai-partner-api
```

Module Order dùng:

- `application_id` để biết Order phát sinh từ SuperShip, SuperAI, SuperPlatform Admin hay ứng dụng đối tác và áp dụng đúng chính sách nghiệp vụ\.
- `client_id` để biết request đến từ Web, Mobile, Partner API hoặc Backend Service, phục vụ bảo mật, giới hạn request và Audit\.

Hai giá trị này phải lấy từ Access Token/Application Client đã đăng ký; Client không tự gửi trong Request Body\.

#### 2\.5\.6\. Trusted Access Context mà Module Order sử dụng

Sau khi Token được xác thực, Gateway/User Module cung cấp cho Module Order một ngữ cảnh tin cậy tương đương:

```JSON
{
  "identity_id": "identity-123",
  "membership_id": "membership-456",
  "organization_id": "organization-789",
  "organization_type": "SHOP",
  "shop_id": "organization-789",
  "application_id": "SUPER_AI",
  "client_id": "superai-web",
  "actor_type": "USER",
  "session_id": "session-001"
}
```

Đây là ngữ cảnh nội bộ đáng tin cậy\. Consumer không gửi nguyên đối tượng này trong Request Body và Module Order không tin một đối tượng cùng cấu trúc do Consumer tự khai báo\.

#### 2\.5\.7\. Dữ liệu nguồn tạo phải được lưu trên Order

Khi tạo Order, Module Order lưu snapshot tối thiểu:

|Trường|Ý nghĩa|
|---|---|
|`owner_shop_id`|Shop sở hữu Order và là căn cứ chính để kiểm soát Data Scope\.|
|`created_by_identity_id`|Người tạo Order; có thể `null` nếu do tiến trình hệ thống hợp lệ tạo\.|
|`created_by_membership_id`|Membership người tạo đang sử dụng; có thể `null` với Service Account/System\.|
|`created_application_id`|Ứng dụng phát sinh Order, ví dụ SuperShip hoặc SuperAI\.|
|`created_client_id`|Web, Mobile, Partner API Client hoặc Backend Service đã gửi request\.|
|`created_actor_type`|Loại chủ thể đã tạo Order\.|
|`created_channel`|Kênh tạo được Backend suy ra từ Client Registry: `WEB`, `MOBILE`, `PARTNER_API`, `INTERNAL`, `BATCH` hoặc `SYSTEM`\.|
|`created_at`|Thời điểm Order được tạo\.|
|`correlation_id`|Mã truy vết request xuyên các module\.|

`created_channel` không do Client tự gửi\. Backend suy ra từ Client đã đăng ký để tránh giả mạo nguồn tạo\.

`soc` trong Request Body vẫn là mã đơn riêng do Shop/hệ thống nguồn cung cấp để đối chiếu\. `soc` không thay thế `owner_shop_id`, Application, Client hoặc danh tính người tạo\.

#### 2\.5\.8\. Quy tắc bắt buộc

1. Shop tự tạo Order không truyền `shop_id`\.
2. Consumer không truyền `created_by`, `application_id`, `client_id`, `actor_type` hoặc `created_channel` trong Request Body\.
3. Application và Client được xác định từ Access Token đã xác thực\.
4. Shop sở hữu Order được suy ra từ Membership hiện hành khi Organization có loại `SHOP`\.
5. Nhân viên nội bộ chỉ thao tác trên Shop nằm trong Data Scope được cấp\.
6. Ứng dụng đối tác chỉ thao tác thay Shop khi liên kết ủy quyền còn hiệu lực và đúng capability/Scope\.
7. Service Account/System không được giả lập Membership của con người\.
8. Module Order phải lưu snapshot nguồn tạo để phục vụ Audit, hỗ trợ khách hàng và phân tích nghiệp vụ\.
9. Việc đổi Active Membership phải tạo ngữ cảnh truy cập mới; request không được tiếp tục dùng ngữ cảnh cũ đã mất hiệu lực\.
10. Module Order không mặc định cho phép khi không xác định được ngữ cảnh truy cập hoặc dịch vụ kiểm tra quyền bắt buộc không khả dụng\.

### 2\.6\. Quy ước trình bày tham số API

- Cột **Bắt buộc** chỉ sử dụng ba giá trị: `Có`, `Không` hoặc `Có điều kiện`\.
- Với `Có điều kiện`, điều kiện bắt buộc phải được viết đầy đủ trong cột **Ý nghĩa**; không dùng các cách ghi mơ hồ như “Theo điều kiện”, “Có theo địa chỉ”, “Có theo phần tử” hoặc “Khi có body”\.
- Trường không bắt buộc được phép không truyền\. Chỉ ghi kiểu `null` khi API thực sự cho phép Consumer gửi giá trị JSON `null`; không dùng `null` để thay cho việc bỏ trường\.
- Chỉ hiển thị mục **Path Parameters**, **Query Parameters** hoặc **Request Body** khi endpoint thực sự có loại dữ liệu đó\. Không tạo bảng “Không có” và không gộp Query Parameters với Request Body\.
- Với object hoặc array, trường con phải ghi `Có điều kiện` và nêu rõ trường cha hoặc phần tử nào làm phát sinh điều kiện bắt buộc\.
- Trường enum phải liệt kê đầy đủ từng giá trị Consumer được phép gửi và giải thích ý nghĩa của từng giá trị\. Không chỉ ghi “theo enum dùng chung” nếu tài liệu hiện tại không dẫn chiếu chính xác tới bảng enum đó\.
- Trường số phải ghi rõ số nguyên hay số thập phân, đơn vị, giá trị nhỏ nhất và giới hạn lớn nhất\. Nếu giới hạn lớn nhất phụ thuộc NVC/dịch vụ thì phải ghi rõ Backend lấy giới hạn từ capability của phương án vận chuyển đã chọn, không tự đặt một con số cố định trong API Order\.
- Với địa chỉ `model = 2`, dữ liệu mẫu phải dùng mã Tỉnh/Thành dạng `Pxx` và mã Phường/Xã dạng `PxxCxxxx`, ví dụ `province_code = P01`, `commune_code = P01C0001`\. Không dùng mã hành chính dạng số của mô hình ba cấp trong cùng một địa chỉ hai cấp\.
- Mỗi endpoint phải tự mô tả đầy đủ Headers, Parameters, Request Body, Response và Error của chính nó\. Không viết “dùng chung”, “cùng cấu trúc”, “xem mục” hoặc yêu cầu người tích hợp đọc một endpoint khác để hoàn thành contract\.
- Trường ngày giờ phải ghi định dạng và múi giờ\. API Order sử dụng ISO 8601 có độ lệch múi giờ, ví dụ `2026-09-16T14:30:00+07:00`; không nhận thời gian không có múi giờ\.
- Hàng hóa hỗ trợ hai cách khai báo và phải được phân biệt bằng `parcel.content_type`: `1` chỉ truyền `parcel.product_name`; `2` chỉ truyền `parcel.products[]`\. Không truyền đồng thời hai dạng trong cùng một Order\.
- Nghiệp vụ giao một phần hỗ trợ hai cách khai báo và phải phân biệt bằng `partial_type`: `1` chỉ xác nhận bằng `note`; `2` khai báo chi tiết `requested_delivered_items[]`, `requested_remaining_items[]` và `requested_cod_amount`\. Consumer chỉ được gửi các trường thuộc đúng loại đã chọn\.
- Nghiệp vụ đổi hàng chỉ nhận `note` để mô tả nội dung/hướng dẫn đổi hàng và `requested_cod_amount` khi cần thay đổi COD\. API Order không nhận danh sách hàng thay thế hoặc danh sách hàng thu hồi cho nghiệp vụ này\.
- Nghiệp vụ chuyển hoàn gồm hai bước độc lập: tạo yêu cầu chuyển Order sang `SPF-1001 — Chờ xác nhận chuyển hoàn`, sau đó nhân viên nội bộ xác nhận qua NVC hoặc xác nhận thủ công sau khi NVC đã đồng ý để chuyển sang `SPF-1002 — Đã xác nhận chuyển hoàn`\. Nghiệp vụ này không bao gồm thu hồi hàng sau khi giao thành công\.
- Trường lựa chọn do SuperPlatform quản lý ưu tiên dùng số nguyên (`integer`) và phải giải thích ý nghĩa từng giá trị\. Mã trạng thái nghiệp vụ hoặc mã gốc do NVC phát hành vẫn giữ nguyên chuỗi khi cần đối chiếu; không chuyển chúng thành số chỉ để đồng nhất hình thức\.
- Mỗi endpoint trong API Contract chỉ trình bày giao kèo mà Consumer cần biết: mục đích, Method, Endpoint, quyền truy cập, Headers, tham số, Request, Response, ví dụ và Error\. Không đặt mục **Quy tắc xử lý** hoặc mô tả transaction, adapter, outbox, retry, fallback, mapping nội bộ và cách các module triển khai bên trong endpoint\. Các nội dung này thuộc SRS, SAD, Business Rule Catalog hoặc tài liệu luồng nghiệp vụ tương ứng\.
- Mọi giải thích về mục đích, phạm vi dữ liệu, phân quyền hiển thị, sự khác nhau giữa Shop và nội bộ hoặc quan hệ với API/module khác phải đặt trong phần mô tả ngay dưới tên API và trước mục **Endpoint**\. Từ **Endpoint** đến hết **Error** chỉ trình bày contract cần tích hợp; không chèn đoạn giải thích nghiệp vụ sau Request, Response hoặc ví dụ\.

### 2\.7\. Quy ước mã Order, NVC và vận đơn

Ba loại mã sau không được dùng thay thế cho nhau:

|Loại mã|Kiểu|Quy tắc|Ví dụ|
|---|---|---|---|
|`order_code`|string|Mã Order do SuperPlatform cấp, gồm đúng 13 chữ số\. Đây là mã nghiệp vụ trung tâm của toàn Order\.|`9001156990401`|
|`carrier_code`|integer|Mã số NVC trong Carrier Registry của SuperPlatform\. Dùng để chọn/lọc NVC; không phải mã vận đơn\.|`2` — GHN|
|`carrier_waybill_code`|string|Mã vận đơn do NVC cấp\. Phải lưu và trả nguyên chuỗi, gồm cả chữ, số, dấu chấm hoặc tiền tố/hậu tố nếu có\.|`GY8YLSDK`|

Mã NVC hiện đã xác nhận:

|`carrier_code`|NVC|
|---:|---|
|`1`|SuperShip|
|`2`|GHN|
|`3`|J\&T Express|
|`4`|Viettel Post|
|`6`|BEST Express|
|`10`|SPX Express|
|`13`|Vietnam Post|
|`15`|Green SM Express — mã giả định phục vụ thiết kế|
|`16`|GrabExpress — mã giả định phục vụ thiết kế|

Theo quyết định thiết kế hiện tại, SuperShip sử dụng `carrier_code = 1`\. Trong giai đoạn thiết kế, SuperPlatform tạm giả định Green SM Express dùng mã `15` và GrabExpress dùng mã `16`\. Hai mã giả định này phải được xác nhận trong Carrier Registry trước khi triển khai production\.

Ví dụ định dạng vận đơn phải được lưu nguyên văn:

|NVC|Ví dụ `carrier_waybill_code`|
|---|---|
|SuperShip|`STGS983262LM.826941741`|
|GHN|`GY8YLSDK`|
|Viettel Post|`SOOHNIS671931LM826375229`|
|Vietnam Post|`CC219903498VN`|
|BEST Express|`999800060087994`|
|J\&T Express|`802806938571`|
|SPX Express|`SPXVN066263841279`|

Ví dụ mã phân loại/chia chọn do từng NVC cấp và phải được lưu nguyên văn:

|NVC|Ví dụ `carrier_sorting_code`|
|---|---|
|SPX Express|`HCA-51-172-Q5P8-N` hoặc `Q5-P8-03`|
|GHN|`100-A2-09-00`|
|BEST Express|`OO012-00-003-02`|
|J\&T Express|`470-024C33-`|

Mã phân loại không phải mã vận đơn và không được dùng thay `carrier_waybill_code`\. NVC có thể thay đổi cấu trúc mã theo tuyến hoặc hệ thống khai thác; SuperPlatform không tự tách chuỗi để suy diễn tỉnh, kho hoặc tuyến nếu chưa có contract chính thức từ NVC\.

## 3\. DANH MỤC ENDPOINT

### 3\.1\. Core API

|Nhóm|Method|Endpoint|Mục đích sử dụng|
|---|:---:|---|---|
|Đơn hàng|`POST`|`/v1/orders`|Ghi nhận Đơn hàng cùng thông tin người gửi, người nhận, hàng hóa, dịch vụ và COD; đồng thời khởi tạo các chặng vận chuyển cần thiết\.|
|Đơn hàng|`GET`|`/v1/orders`|Lấy danh sách Đơn hàng mặc định theo sắp xếp và phân trang; dữ liệu được giới hạn theo Access Context, quyền và Data Scope của người gọi\.|
|Đơn hàng|`GET`|`/v1/orders/search`|Tra cứu nhanh theo mã Order, mã đơn của Shop, mã nguồn, mã vận đơn, tên hoặc số điện thoại người nhận; trả dữ liệu rút gọn để chọn đúng Đơn hàng\.|
|Đơn hàng|`GET`|`/v1/order-filters`|Lấy các nhóm bộ lọc, lựa chọn và giá trị mà người gọi được phép sử dụng trên màn hình danh sách Đơn hàng\.|
|Đơn hàng|`POST`|`/v1/orders/filter`|Lọc Đơn hàng bằng toàn bộ điều kiện cơ bản và nâng cao trong cùng một request; hỗ trợ điều kiện theo từng chặng, NVC, kết quả vận hành, COD, hỗ trợ, sự cố và các mốc thời gian\.|
|Đơn hàng|`GET`|`/v1/orders/{order_code}`|Lấy chi tiết Đơn hàng theo mức dữ liệu Shop hoặc nội bộ mà người gọi được phép xem\.|
|Đơn hàng|`GET`|`/v1/orders/{order_code}/actions`|Lấy các thao tác người gọi được phép sử dụng trên Order tại thời điểm kiểm tra để FE/ứng dụng tích hợp hiển thị, ẩn hoặc vô hiệu hóa chức năng phù hợp\.|
|Đơn hàng|`PATCH`|`/v1/orders/{order_code}`|Cập nhật trực tiếp dữ liệu chỉ thuộc Order hoặc sửa dữ liệu đầu vào khi chưa có vận đơn NVC hợp lệ; thay đổi sau khi đã có vận đơn được tiếp nhận bằng Ticket của Support Module\.|
|Đơn hàng|`POST`|`/v1/orders/{order_code}/cancel`|Hủy trực tiếp Đơn hàng khi còn đủ điều kiện; nếu không thể hủy trực tiếp, người dùng phải tạo Ticket tại Support Module\.|
|Hành trình|`GET`|`/v1/orders/{order_code}/stages`|Lấy chuỗi chặng lấy hàng, giao hàng, chuyển hoàn và thu hồi, gồm NVC, vận đơn và trạng thái của từng chặng\.|
|Hành trình|`GET`|`/v1/orders/{order_code}/stages/{stage_code}`|Lấy chi tiết một chặng, NVC phụ trách, vận đơn, trạng thái chuẩn hóa và các mốc vận chuyển liên quan\.|
|Hành trình|`GET`|`/v1/orders/{order_code}/stages/{stage_code}/waybills`|Lấy lịch sử các Waybill đã phát sinh trên một chặng, bao gồm Waybill cũ, hiện hành, thay thế và quan hệ giữa chúng\.|
|Hành trình|`GET`|`/v1/orders/{order_code}/tracking`|Lấy hành trình toàn bộ Đơn hàng đã tổng hợp từ tất cả chặng; Shop xem hành trình nghiệp vụ, nội bộ được xem thêm dữ liệu kỹ thuật theo quyền\.|
|Hành trình|`GET`|`/v1/orders/{order_code}/shipper`|Lấy người và phương tiện đang thực hiện lấy, giao hoặc trả hàng nếu NVC cung cấp; áp dụng che dữ liệu theo đối tượng xem\.|
|Hành trình|`GET`|`/v1/orders/{order_code}/shippers`|Lấy toàn bộ người từng được phân công thực hiện các chặng của Order, gồm chặng, NVC, Waybill, vai trò và thời gian phụ trách\.|
|Hành trình|`GET`|`/v1/orders/{order_code}/sla`|Lấy thời hạn cam kết, mốc dự kiến, thời điểm thực tế và tình trạng đúng hạn hoặc quá hạn của Đơn hàng/chặng\.|
|Lịch sử|`GET`|`/v1/orders/{order_code}/activities`|Lấy lịch sử nghiệp vụ thống nhất của Đơn hàng, gồm tạo đơn, thay đổi dữ liệu, vận chuyển, Ticket hỗ trợ liên quan, hình ảnh, in nhãn và các sự kiện khác theo quyền xem\.|
|Tài chính|`GET`|`/v1/orders/{order_code}/finance`|Lấy bản tổng hợp COD, tiền thu khách, phí, bồi thường và tình trạng đối soát liên quan trực tiếp tới Đơn hàng; không thay thế sổ cái của Finance Module\.|
|Ghi chú|`GET`|`/v1/orders/{order_code}/notes`|Lấy các ghi chú nghiệp vụ gắn với Đơn hàng mà người gọi được phép xem\.|
|Ghi chú|`POST`|`/v1/orders/{order_code}/notes`|Thêm ghi chú nghiệp vụ trực tiếp cho Đơn hàng; trao đổi CSKH và ghi chú xử lý Ticket thuộc Support Module\.|
|Hình ảnh|`GET`|`/v1/orders/{order_code}/images`|Lấy hình ảnh hàng hóa, lấy hàng, giao hàng, trả hàng và bằng chứng liên quan mà người gọi được phép xem\.|
|Hình ảnh|`POST`|`/v1/orders/{order_code}/images`|Shop gắn một ảnh hàng hóa đã tải lên File Service vào Order trước khi NVC lấy hàng thành công\.|
|Hình ảnh|`POST`|`/v1/orders/{order_code}/images/remove`|Shop gỡ một hoặc nhiều ảnh hàng hóa đã thêm khỏi Order trước khi NVC lấy hàng thành công; không áp dụng cho ảnh do NVC, nội bộ hoặc hệ thống cung cấp\.|
|In nhãn|`GET`|`/v1/orders/{order_code}/prints`|Tra cứu loại nhãn, người in, thời điểm và kết quả của từng lần in Nhãn Giao Hàng cho Đơn hàng\.|
|In nhãn|`GET`|`/v1/order-labels/types`|Lấy các loại, khổ và định dạng Nhãn Giao Hàng người gọi có thể lựa chọn\.|
|In nhãn|`POST`|`/v1/order-labels/tokens`|Kiểm tra quyền và điều kiện in của một hoặc nhiều Order, sau đó tạo Token in\.|
|In nhãn|`GET`|`/v1/order-labels/print`|Dùng `print_token` còn hiệu lực để nhận file nhãn đã render và ghi nhận lịch sử in trên từng Order\.|

### 3\.2\. Workflow API

|Nhóm|Method|Endpoint|Mục đích sử dụng|
|---|:---:|---|---|
|Hàng loạt|`GET`|`/v1/order-batches/template`|Tải trực tiếp file Excel mẫu tạo Đơn hàng loạt theo mô hình địa chỉ hai cấp hoặc ba cấp\.|
|Hàng loạt|`POST`|`/v1/order-batches/parse`|Tiếp nhận trực tiếp file Excel, đọc và chuyển thành dữ liệu bảng để người dùng kiểm tra hoặc chỉnh sửa; chưa tạo Order\.|
|Hàng loạt|`POST`|`/v1/order-batches/validate`|Kiểm tra toàn bộ dữ liệu trước khi tạo lô; trả kết quả hợp lệ hoặc lỗi theo từng dòng và từng trường nhưng không tạo Đơn hàng\.|
|Hàng loạt|`POST`|`/v1/order-batches`|Tạo lô xử lý bất đồng bộ từ toàn bộ snapshot đã được kiểm tra bằng `validation_token`; mỗi dòng tạo một Order độc lập và lỗi xử lý một dòng không làm hủy toàn bộ lô\.|
|Hàng loạt|`GET`|`/v1/order-batches`|Lấy lịch sử các lô mà người gọi được phép xem, gồm trạng thái xử lý và thống kê tổng số dòng, thành công, thất bại hoặc đang xử lý\.|
|Hàng loạt|`GET`|`/v1/order-batches/{batch_code}`|Lấy thông tin tổng quan, người tạo, tiến độ và số liệu xử lý của một lô Đơn hàng\.|
|Hàng loạt|`GET`|`/v1/order-batches/{batch_code}/results`|Lấy kết quả theo từng dòng của lô, gồm mã Order khi tạo thành công hoặc mã lỗi và lý do khi không thành công\.|
|Hàng loạt|`GET`|`/v1/order-batches/{batch_code}/export`|Tải trực tiếp file Excel chứa toàn bộ kết quả, các dòng thành công hoặc các dòng thất bại của một Batch\.|
|Xuất dữ liệu|`POST`|`/v1/orders/export`|Tải trực tiếp file Excel của các Order được chọn hoặc toàn bộ Order thỏa bộ lọc hiện tại; dữ liệu xuất tuân thủ Data Scope của người gọi\.|
|Công khai \(tùy chọn\)|`POST`|`/v1/public/orders/tracking`|Cho người không đăng nhập tra cứu hành trình bằng mã tra cứu, bốn số cuối điện thoại Người nhận và CAPTCHA; chỉ trả dữ liệu hành trình cùng thông tin Người gửi, Người nhận đã masking\.|

### 3\.3\. API nội bộ

Các API trong nhóm này không quản lý Ticket, tiếp nhận hỗ trợ, phân công CSKH hoặc phê duyệt yêu cầu\. Những nghiệp vụ đó thuộc Support Module\. Nhóm này chỉ được gọi bởi module/dịch vụ nội bộ có quyền sau khi yêu cầu đã được xác minh; mỗi API phải kiểm tra lại điều kiện và thực sự cập nhật Order, chặng hoặc kế hoạch vận chuyển\.

|Nhóm|Method|Endpoint|Mục đích sử dụng|
|---|:---:|---|---|
|Thử lại|`POST`|`/v1/orders/{order_code}/retry`|Cho phép nhân viên hoặc dịch vụ nội bộ yêu cầu NVC thực hiện lại việc lấy, giao, bàn giao, hoàn hoặc trả hàng sau lần thất bại; Order ghi nhận trạng thái đang yêu cầu NVC xử lý và phối hợp Carrier Module\.|
|Thay đổi|`POST`|`/v1/orders/{order_code}/changes/check`|Để Support Module kiểm tra Order còn cho phép áp dụng nội dung thay đổi đã đề nghị hay không; không tạo Ticket và không thay đổi dữ liệu\.|
|Thay đổi|`POST`|`/v1/orders/{order_code}/changes`|Áp dụng thay đổi đã được xác minh vào Order, lưu giá trị trước/sau, tham chiếu Ticket nguồn và ghi Activity/Audit\.|
|Giao một phần|`POST`|`/v1/orders/{order_code}/partial`|Áp dụng phương án giao một phần đã được xác minh, cập nhật kết quả, phần hàng còn lại và COD liên quan trên Order\.|
|Đổi hàng|`POST`|`/v1/orders/{order_code}/exchange`|Khởi tạo luồng giao hàng thay thế và thu hồi hàng cũ đã được phê duyệt, đồng thời bổ sung các chặng cần thiết vào Order\.|
|Hoàn hàng|`POST`|`/v1/orders/{order_code}/return`|Để Shop hoặc nhân viên được phân quyền tạo yêu cầu chuyển hoàn; Order chuyển sang `SPF-1001 — Chờ xác nhận chuyển hoàn`\.|
|Hoàn hàng|`POST`|`/v1/orders/{order_code}/return/confirm`|Để nhân viên nội bộ xác nhận chuyển hoàn qua API NVC hoặc xác nhận thủ công sau khi NVC đã đồng ý; khi xác nhận thành công, Order chuyển sang `SPF-1002 — Đã xác nhận chuyển hoàn`\.|
|Điều phối NVC|`POST`|`/v1/orders/{order_code}/carrier`|Đổi NVC trước khi nhận hàng hoặc gán NVC cho chiều hoàn; Backend tự xác định hoặc tạo chặng và giữ nguyên lịch sử Waybill\.|

## 4\. CORE API

## 4\.1\. Nhóm Đơn hàng

### 4\.1\.1\. Tạo Đơn hàng

Tạo một Order SuperPlatform cho một kiện hàng\. API dùng chung cho Shop, ứng dụng đối tác và nhân viên nội bộ được ủy quyền\. Backend xác định Shop sở hữu, nguồn tạo, Application, Client và người thực hiện từ Access Context; Consumer không tự khai báo các dữ liệu này trong Request Body\.

Người dùng SuperShip chỉ gửi thông tin Order; Backend tự xác định cách vận chuyển theo loại khách hàng và cấu hình Shop\. SuperAI cũng dùng cấu hình đã lưu để tự chọn NVC; chỉ khi Shop được phép chọn NVC thủ công thì request mới truyền `carrier_code`\. API lưu snapshot dữ liệu đã áp dụng, tạo kế hoạch vận chuyển và đưa việc tạo Waybill vào xử lý\. Order được coi là tạo thành công khi đã được lưu bền vững; việc NVC chưa cấp mã vận đơn hoặc đang tìm tài xế không làm mất Order vừa tạo\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`POST`|
|Endpoint / Event|`/v1/orders`|
|Thành công|`201 Created`|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization`|Có|Xác định Actor, Membership, Application, Client, quyền và Data Scope\.|
|`Content-Type: application/json`|Có|Định dạng Request Body\.|
|`Idempotency-Key`|Có|Chống tạo trùng Order khi Consumer gửi lại request\. Cùng key và cùng payload trả lại cùng kết quả; cùng key nhưng khác payload trả `IDEMPOTENCY_CONFLICT`\.|
|`X-Correlation-Id`|Không|Mã truy vết xuyên các module; Backend tự tạo nếu thiếu\.|
|`X-Target-Shop-Code`|Có điều kiện|Bắt buộc khi nhân viên nội bộ hoặc ứng dụng đối tác tạo Order thay một Shop\. Shop tự tạo Order không truyền header này\. Backend vẫn kiểm tra Data Scope hoặc quan hệ ủy quyền\.|

##### Request Body

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`soc`|string|Không|Mã đơn riêng do Shop/hệ thống nguồn đặt để đối chiếu; không phải mã Order hoặc mã vận đơn NVC\.|
|`pickup`|object|Có|Thông tin điểm lấy\. Chọn một trong hai cách: tham chiếu điểm lấy đã lưu hoặc nhập trực tiếp đầy đủ\.|
|`pickup.point_code`|string|Có điều kiện|Bắt buộc khi Consumer chọn một kho/điểm lấy đã lưu\. Nếu không dùng điểm đã lưu thì bỏ trường này và truyền đầy đủ người liên hệ cùng địa chỉ lấy hàng\. Khi có trường này, Backend lấy snapshot và không nhận các trường nhập trực tiếp trong `pickup`\.|
|`pickup.name`|string|Không|Tên gợi nhớ của điểm lấy, ví dụ `Kho Quận 8`\. Chỉ dùng khi nhập trực tiếp; không truyền khi đã có `pickup.point_code`\.|
|`pickup.contact_name`|string|Có điều kiện|Bắt buộc khi không có `pickup.point_code`; là tên người bàn giao hàng cho NVC tại điểm lấy\.|
|`pickup.phone`|string|Có điều kiện|Bắt buộc khi không có `pickup.point_code`; là SĐT để NVC liên hệ khi đến lấy hàng\.|
|`pickup.note`|string|Không|Hướng dẫn thêm cho NVC khi đến lấy hàng, ví dụ `Gọi trước 5 phút`\. Bỏ trường nếu không có ghi chú\.|
|`pickup.address`|object|Có điều kiện|Bắt buộc khi không có `pickup.point_code`; chứa địa chỉ NVC đến lấy hàng\.|
|`pickup.address.model`|integer|Có điều kiện|Bắt buộc khi truyền `pickup.address`\. Giá trị: `1` — địa chỉ ba cấp Tỉnh/Quận-Huyện/Phường-Xã; `2` — địa chỉ hai cấp Tỉnh/Phường-Xã theo danh mục hành chính mới\.|
|`pickup.address.detail`|string|Có điều kiện|Bắt buộc khi truyền `pickup.address`; ghi số nhà, tên đường, tên tòa nhà hoặc phần địa chỉ chi tiết chưa thể hiện bằng mã hành chính\.|
|`pickup.address.province_code`|string|Có điều kiện|Bắt buộc khi truyền `pickup.address`; là mã Tỉnh/Thành phố do Address Module cung cấp\.|
|`pickup.address.district_code`|string|Có điều kiện|Bắt buộc khi `pickup.address.model = 1`; không truyền khi `pickup.address.model = 2`\.|
|`pickup.address.commune_code`|string|Có điều kiện|Bắt buộc khi truyền `pickup.address`; là mã Phường/Xã do Address Module cung cấp\.|
|`pickup.address.latitude`|number|Có điều kiện|Vĩ độ dạng số thập phân theo WGS84, từ `-90` đến `90`\. Nếu Consumer truyền tọa độ thì phải truyền đồng thời cả `latitude` và `longitude`; Backend xác minh lại trước khi dùng\. Consumer có thể bỏ cả hai để Address Module chuẩn hóa, nhưng phương án NVC tức thời chỉ được tạo khi Backend đã xác định đủ tọa độ chuẩn\.|
|`pickup.address.longitude`|number|Có điều kiện|Kinh độ dạng số thập phân theo WGS84, từ `-180` đến `180`\. Nếu Consumer truyền tọa độ thì phải truyền đồng thời cả `latitude` và `longitude`; không được chỉ truyền một trường\.|
|`receiver.name`|string|Có|Tên người nhận hàng\.|
|`receiver.phone`|string|Có|SĐT người nhận dùng để giao hàng và liên hệ nghiệp vụ\.|
|`receiver.email`|string/null|Không|Email người nhận; `null` hoặc không truyền nghĩa là chưa cung cấp\.|
|`receiver.address`|object|Có|Địa chỉ giao hàng của người nhận\.|
|`receiver.address.model`|integer|Có|Giá trị: `1` — địa chỉ ba cấp Tỉnh/Quận-Huyện/Phường-Xã; `2` — địa chỉ hai cấp Tỉnh/Phường-Xã theo danh mục hành chính mới\. Backend chuyển đổi sang schema NVC yêu cầu\.|
|`receiver.address.detail`|string|Có|Số nhà, tên đường và địa chỉ giao hàng chi tiết\.|
|`receiver.address.province_code`|string|Có|Mã Tỉnh/Thành phố giao hàng\.|
|`receiver.address.district_code`|string|Có điều kiện|Bắt buộc khi `receiver.address.model = 1`; không truyền khi `receiver.address.model = 2`\.|
|`receiver.address.commune_code`|string|Có|Mã Phường/Xã giao hàng do Address Module cung cấp\.|
|`receiver.address.latitude`|number|Có điều kiện|Vĩ độ dạng số thập phân theo WGS84, từ `-90` đến `90`\. Nếu Consumer truyền tọa độ thì phải truyền đồng thời cả `latitude` và `longitude`; Backend xác minh lại trước khi dùng\. Consumer có thể bỏ cả hai để Address Module chuẩn hóa, nhưng phương án NVC tức thời chỉ được tạo khi Backend đã xác định đủ tọa độ chuẩn\.|
|`receiver.address.longitude`|number|Có điều kiện|Kinh độ dạng số thập phân theo WGS84, từ `-180` đến `180`\. Nếu Consumer truyền tọa độ thì phải truyền đồng thời cả `latitude` và `longitude`; không được chỉ truyền một trường\.|
|`parcel`|object|Có|Thông tin kiện hàng được giao\. Phiên bản hiện tại quản lý một kiện cho mỗi Order\.|
|`parcel.content_type`|integer|Có|Cách khai báo hàng hóa: `1` — chỉ khai báo một tên hàng bằng `parcel.product_name`; `2` — khai báo danh sách sản phẩm bằng `parcel.products[]`\. Không truyền đồng thời hai dạng\.|
|`parcel.product_name`|string|Có điều kiện|Bắt buộc khi `parcel.content_type = 1`; là tên hàng hóa/sản phẩm hiển thị trên Order, ví dụ `Mỹ phẩm`\. Không truyền khi `content_type = 2`\. Đây là tên hàng, không phải ghi chú giao hàng\.|
|`parcel.products`|array\(object\)|Có điều kiện|Bắt buộc khi `parcel.content_type = 2`; phải có ít nhất một phần tử\. Không truyền khi `content_type = 1`\.|
|`parcel.products[].sku`|string|Không|Mã/SKU của Shop\. Bỏ trường nếu Shop không quản lý SKU\.|
|`parcel.products[].name`|string|Có điều kiện|Bắt buộc với mỗi phần tử trong `parcel.products`; là tên sản phẩm\.|
|`parcel.products[].quantity`|integer|Có điều kiện|Bắt buộc với mỗi phần tử trong `parcel.products`; là số nguyên từ `1` trở lên\. Giới hạn lớn nhất áp dụng theo cấu hình số lượng sản phẩm của Order\.|
|`parcel.products[].unit_price`|integer|Không|Giá một đơn vị bằng VND, là số nguyên từ `0` trở lên\. Bỏ trường nếu không khai báo giá theo từng sản phẩm; giá trị tối đa không được làm tổng giá trị hàng vượt giới hạn của Order/phương án vận chuyển\.|
|`parcel.products[].unit_weight`|integer|Không|Khối lượng một đơn vị sản phẩm bằng gram, là số nguyên từ `1` trở lên\. Bỏ trường nếu chỉ khai báo tổng khối lượng kiện; giá trị tối đa theo capability của phương án vận chuyển\.|
|`parcel.weight`|integer|Có|Tổng khối lượng khai báo của cả kiện bằng gram, là số nguyên từ `1` trở lên\. Giá trị tối đa lấy theo capability của NVC, dịch vụ và loại phương tiện\. Không tính trường này bằng kilogram\.|
|`parcel.dimensions`|object|Không|Kích thước kiện hàng theo centimet\. Nếu truyền object này thì phải truyền đủ `length`, `width`, `height`; bỏ toàn bộ object nếu nghiệp vụ không yêu cầu kích thước\.|
|`parcel.dimensions.length`|number|Có điều kiện|Bắt buộc khi truyền `parcel.dimensions`; là chiều dài theo centimet, lớn hơn `0`, cho phép số thập phân và không vượt capability của NVC/dịch vụ\.|
|`parcel.dimensions.width`|number|Có điều kiện|Bắt buộc khi truyền `parcel.dimensions`; là chiều rộng theo centimet, lớn hơn `0`, cho phép số thập phân và không vượt capability của NVC/dịch vụ\.|
|`parcel.dimensions.height`|number|Có điều kiện|Bắt buộc khi truyền `parcel.dimensions`; là chiều cao theo centimet, lớn hơn `0`, cho phép số thập phân và không vượt capability của NVC/dịch vụ\.|
|`parcel.declared_value`|integer|Có|Giá trị khai báo bằng VND, là số nguyên từ `0` trở lên và độc lập với COD\. Giá trị tối đa lấy theo capability bảo hiểm/khai giá của phương án vận chuyển\.|
|`parcel.tags`|array\(integer\)|Không|Danh sách đặc tính hàng hóa; mặc định `[]`\. Giá trị: `1` — hàng dễ vỡ; `2` — chất lỏng; `3` — hàng giá trị cao; `4` — hàng có pin; `5` — hàng cồng kềnh\. Có thể truyền nhiều giá trị nhưng không được lặp\.|
|`cod_amount`|integer|Không|Tiền thu hộ bằng VND, là số nguyên từ `0` trở lên; mặc định `0` là không thu COD\. Giá trị tối đa lấy theo capability COD của phương án vận chuyển\.|
|`inspection`|integer|Có|Giá trị: `1` — người nhận không được xem hàng; `2` — người nhận được xem hàng nhưng không dùng thử; `3` — người nhận được thử hàng nếu NVC/dịch vụ hỗ trợ\.|
|`fee_payer`|integer|Có|Giá trị: `1` — Shop/người gửi trả phí; `2` — người nhận trả phí\.|
|`pickup_method`|integer|Có|Giá trị: `1` — NVC đến địa chỉ lấy hàng; `2` — Shop tự mang hàng đến điểm tiếp nhận\. Giá trị `2` không có nghĩa NVC đã nhận hàng\.|
|`services`|array\(integer\)|Không|Danh sách dịch vụ bổ sung; mặc định `[]`\. Giá trị: `1` — cho phép giao một phần; `2` — giao hàng mới kết hợp thu hồi hàng cũ\. Chỉ được gửi mã dịch vụ được cấu hình cho Shop và NVC/dịch vụ vận chuyển hỗ trợ\.|
|`delivery_note`|string|Không|Hướng dẫn giao hàng, tối đa 120 ký tự; không dùng làm ghi chú nội bộ\.|
|`carrier_code`|integer|Không|Chỉ truyền khi Order được tạo từ SuperAI, cấu hình Shop cho phép chọn NVC thủ công và người dùng đã chọn NVC trên giao diện\. Giá trị lấy từ Carrier Registry/API danh mục NVC: `1` — SuperShip; `2` — GHN; `3` — J\&T Express; `4` — Viettel Post; `6` — BEST Express; `10` — SPX Express; `13` — Vietnam Post; `15` — Green SM Express \(giả định\); `16` — GrabExpress \(giả định\)\. Không truyền khi SuperAI dùng cấu hình AI tự chọn NVC hoặc khi hệ thống phải tự xác định NVC theo loại khách hàng/cấu hình Shop\. Backend vẫn kiểm tra NVC có được phép phục vụ Shop, tuyến đường và kiện hàng hay không\.|
|`pickup_at`|datetime|null|Không|Thời điểm mong muốn bắt đầu lấy hàng theo ISO 8601 có độ lệch múi giờ, ví dụ `2026-09-16T14:30:00+07:00`\. `null` hoặc không truyền nghĩa là lấy sớm nhất có thể\. Không nhận thời điểm đã qua; Backend kiểm tra NVC/dịch vụ được chọn có hỗ trợ thời điểm này hay không\.|
|`image_codes`|array\(string\)|Không|Danh sách mã ảnh hàng hóa đã tải lên File Service trước khi tạo Order; mặc định `[]`\. Chỉ truyền mã tham chiếu file, không truyền binary hoặc base64 trong JSON\. Backend kiểm tra quyền sở hữu và gắn ảnh vào Order\.|

##### Ví dụ Request — SuperShip tự xác định NVC theo cấu hình

Request không truyền `carrier_code`\. Backend nhận biết đây là Application SuperShip từ Access Context, sau đó dùng loại khách hàng và cấu hình Shop để xác định các chặng cùng NVC thực hiện\.

```JSON
{
  "soc": "SHOP-2026-0001",
  "pickup": {
    "point_code": "KHO-Q8-01"
  },
  "receiver": {
    "name": "Nguyễn Văn A",
    "phone": "0901234567",
    "email": null,
    "address": {
      "model": 1,
      "detail": "123 Đường B",
      "province_code": "79",
      "district_code": "760",
      "commune_code": "26734"
    }
  },
  "parcel": {
    "content_type": 2,
    "products": [
      {
        "sku": "MP-001",
        "name": "Bộ chăm sóc da",
        "unit_price": 200000,
        "unit_weight": 750,
        "quantity": 1
      }
    ],
    "weight": 750,
    "dimensions": {
      "length": 20,
      "width": 15,
      "height": 10
    },
    "declared_value": 200000,
    "tags": []
  },
  "cod_amount": 200000,
  "inspection": 2,
  "fee_payer": 2,
  "pickup_method": 1,
  "services": [],
  "delivery_note": "Gọi người nhận trước khi giao",
  "image_codes": [
    "IMG-20260916-000001"
  ]
}
```

##### Ví dụ bổ sung — SuperAI chọn NVC thủ công

Các trường Order giữ nguyên như ví dụ trên và chỉ bổ sung mã NVC người dùng đã chọn:

```JSON
{
  "carrier_code": 2
}
```

Nếu SuperAI đang dùng cấu hình AI tự chọn NVC thì cũng không truyền `carrier_code`\. Backend đọc tiêu chí tối ưu đã lưu của Shop, ví dụ ưu tiên chi phí, tốc độ hoặc tỷ lệ giao thành công; Consumer không gửi lại tiêu chí này trong từng Order\.

##### Ví dụ cURL

```bash
curl --request POST '{{base_url}}/v1/orders' \
  --header 'Authorization: Bearer {{access_token}}' \
  --header 'Content-Type: application/json' \
  --header 'Idempotency-Key: create-order-shop-2026-0001' \
  --header 'X-Correlation-Id: req-20260916-create-0001' \
  --data '{{request_body}}'
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|`false` khi API xử lý thành công\.|
|`message`|string|Có|Thông báo ngắn gọn bằng tiếng Việt\.|
|`data`|object|Có|Kết quả tạo Order\.|
|`data.order_code`|string|Có|Mã Order SuperPlatform gồm đúng 13 chữ số, dùng để hiển thị và tra cứu\. Đây không phải mã vận đơn của NVC\.|
|`data.soc`|string/null|Có|Mã đơn riêng của Shop; `null` nếu không cung cấp\.|
|`data.order_status`|string|Có|Mã trạng thái tổng thể của Order, bắt buộc lấy từ danh mục 45 trạng thái đã chốt của SuperPlatform \(43 trạng thái nền tảng cộng `SPF-0302`, `SPF-0303` cho quá trình tìm tài xế\)\. Không tự tạo mã/trạng thái riêng trong API\.|
|`data.status_name`|string|Có|Tên chính thức tương ứng chính xác với `data.order_status` trong danh mục trạng thái\. Ví dụ: `SPF-0101` phải là `Đang tạo đơn NVC`; `SPF-0302` phải là `Đang tìm tài xế`; `SPF-0303` phải là `Không tìm được tài xế`\. Không dùng tên diễn giải tự phát như `Đang khởi tạo vận chuyển`\.|
|`data.pickup`|object|Có|Thông tin điểm lấy đã được chuẩn hóa và lưu trên Order để Consumer xác nhận\.|
|`data.pickup.point_code`|string|Không|Mã điểm lấy đã lưu mà Consumer truyền trong `pickup.point_code`; bỏ trường nếu Request dùng địa chỉ lấy nhập trực tiếp\.|
|`data.pickup.point_name`|string|Có|Tên điểm lấy/Kho đã được lưu trên Order\.|
|`data.pickup.address`|object|Có điều kiện|Bắt buộc xuất hiện trong `data.pickup`; là địa chỉ lấy hàng đã áp dụng\.|
|`data.pickup.address.model`|integer|Có điều kiện|Bắt buộc khi có `data.pickup.address`: `1` — hành chính ba cấp cũ; `2` — hành chính hai cấp mới\.|
|`data.pickup.address.detail`|string|Có điều kiện|Bắt buộc khi có `data.pickup.address`; là số nhà, tên đường hoặc tên Kho\.|
|`data.pickup.address.full_address`|string|Có điều kiện|Bắt buộc khi có `data.pickup.address`; là địa chỉ đầy đủ do Address Module ghép từ `detail` và tên các đơn vị hành chính đã chuẩn hóa\. Đây là trường chỉ đọc dùng để hiển thị/xác nhận\.|
|`data.pickup.address.province_code`|string|Có điều kiện|Bắt buộc khi có `data.pickup.address`; là mã Tỉnh/Thành phố\.|
|`data.pickup.address.district_code`|string|Có điều kiện|Bắt buộc khi `model = 1`; bỏ trường khi `model = 2`\.|
|`data.pickup.address.commune_code`|string|Có điều kiện|Bắt buộc khi có `data.pickup.address`; là mã Phường/Xã\.|
|`data.receiver`|object|Có|Thông tin người nhận đã được lưu trên Order để Consumer xác nhận\.|
|`data.receiver.address`|object|Có điều kiện|Bắt buộc xuất hiện trong `data.receiver`; là địa chỉ nhận hàng đã áp dụng\.|
|`data.receiver.address.model`|integer|Có điều kiện|Bắt buộc khi có `data.receiver.address`: `1` — hành chính ba cấp cũ; `2` — hành chính hai cấp mới\.|
|`data.receiver.address.detail`|string|Có điều kiện|Bắt buộc khi có `data.receiver.address`; là số nhà và tên đường\.|
|`data.receiver.address.full_address`|string|Có điều kiện|Bắt buộc khi có `data.receiver.address`; là địa chỉ đầy đủ do Address Module ghép từ `detail` và tên các đơn vị hành chính đã chuẩn hóa\. Đây là trường chỉ đọc dùng để hiển thị/xác nhận\.|
|`data.receiver.address.province_code`|string|Có điều kiện|Bắt buộc khi có `data.receiver.address`; là mã Tỉnh/Thành phố\.|
|`data.receiver.address.district_code`|string|Có điều kiện|Bắt buộc khi `model = 1`; bỏ trường khi `model = 2`\.|
|`data.receiver.address.commune_code`|string|Có điều kiện|Bắt buộc khi có `data.receiver.address`; là mã Phường/Xã\.|
|`data.cod_amount`|integer|Có|Số tiền COD yêu cầu NVC thu từ người nhận, đơn vị VND\. Giá trị `0` nghĩa là không thu COD\.|
|`data.collection_amount`|integer|Có|Tổng số tiền dự kiến thu trực tiếp từ người nhận\. Nếu Shop trả phí thì bằng `cod_amount`; nếu người nhận trả phí thì bằng `cod_amount` cộng các khoản phí người nhận chịu trong `fee_items`\.|
|`data.declared_value`|integer|Có|Giá trị hàng hóa đã khai báo, đơn vị VND; dùng để kiểm tra giới hạn khai giá và tính phí bảo hiểm nếu có\. Không đồng nghĩa với COD\.|
|`data.weight`|integer|Có|Tổng khối lượng kiện đã được ghi nhận cho Order, đơn vị gram\.|
|`data.fee_items`|array\(object\)|Có|Chi tiết các khoản phí áp dụng tại thời điểm tạo Order; trả `[]` nếu chưa xác định được phí\. Tổng các khoản người nhận chịu được dùng để tính `collection_amount`\.|
|`data.fee_items[].fee_type`|string|Có theo phần tử|Mã loại phí\. Giá trị hiện hành: `SHIPPING` — phí vận chuyển; `INSURANCE` — phí bảo hiểm\. Chỉ bổ sung loại mới sau khi có trong danh mục phí dùng chung\.|
|`data.fee_items[].fee_name`|string|Có theo phần tử|Tên khoản phí bằng tiếng Việt để Consumer hiển thị\.|
|`data.fee_items[].amount`|integer|Có theo phần tử|Số tiền của khoản phí, đơn vị VND; là số nguyên từ `0` trở lên\.|
|`data.shipping_stages`|array\(object\)|Có|Danh sách chặng vận chuyển được xác định khi tạo Order\. Một Order có thể có nhiều chặng và mỗi chặng chỉ gắn với một NVC tại một thời điểm\.|
|`data.shipping_stages[].leg_type`|integer|Có theo phần tử|Loại chặng: `1` — lấy hàng từ Shop/điểm gửi; `2` — giao đến người nhận; `3` — chuyển hoàn; `4` — trả hàng cuối về Shop/điểm nhận hoàn\.|
|`data.shipping_stages[].carrier_code`|integer/null|Có theo phần tử|Mã số NVC trong Carrier Registry; `null` khi chưa xác định NVC hoặc NVC chưa được cấp mã số nội bộ\. Không trả mã viết tắt như `GHN` trong trường này\.|
|`data.shipping_stages[].carrier_name`|string/null|Có theo phần tử|Tên NVC thực hiện chặng; `null` khi chưa xác định\.|
|`data.shipping_stages[].carrier_client_code`|string|Có theo phần tử|Mã khách hàng/tài khoản được sử dụng để tạo vận đơn tại NVC của chặng này\. Không phải Client kỹ thuật đã gọi API\.|
|`data.shipping_stages[].carrier_waybill_code`|string/null|Có theo phần tử|Mã vận đơn nguyên bản do NVC cấp; `null` khi NVC chưa cấp vận đơn\.|
|`data.shipping_stages[].carrier_sorting_code`|string|Không|Mã phân loại/chia chọn nguyên bản do NVC trả về\. Chỉ trả trường này khi NVC đã cung cấp; bỏ trường nếu NVC không có hoặc chưa cấp, không trả `null` trong JSON thành công\.|
|`data.images`|array\(object\)|Có|Các ảnh đã gắn thành công vào Order; trả `[]` nếu không có ảnh\.|
|`data.images[].image_code`|string|Có điều kiện|Bắt buộc trong mỗi phần tử được trả về của `data.images`; là mã ảnh\.|
|`data.images[].status`|string|Có điều kiện|Bắt buộc trong mỗi phần tử được trả về của `data.images`; là trạng thái gắn ảnh, ví dụ `ATTACHED`\.|
|`data.created_at`|datetime|Có|Thời điểm tạo Order theo ISO 8601\.|

##### Ví dụ Response — NVC mạng lưới

Ví dụ này mô tả trường hợp cả vận đơn lấy và vận đơn giao đều đã được NVC tạo thành công\. Vì vậy Order đã chuyển sang `SPF-0301 — Chờ lấy hàng`, `carrier_waybill_code` phải có giá trị thực tế và SuperShip sử dụng `carrier_code = 1`\.

```JSON
{
  "error": false,
  "message": "Tạo Đơn hàng và vận đơn thành công.",
  "data": {
    "order_code": "9001156990401",
    "soc": "SHOP-2026-0001",
    "order_status": "SPF-0301",
    "status_name": "Chờ lấy hàng",
    "pickup": {
      "point_code": "KHO-Q8-01",
      "point_name": "Kho Quận 8",
      "address": {
        "model": 1,
        "detail": "231/15 Dương Bá Trạc",
        "full_address": "231/15 Dương Bá Trạc, Phường 1, Quận 8, Thành phố Hồ Chí Minh",
        "province_code": "79",
        "district_code": "776",
        "commune_code": "27301"
      }
    },
    "receiver": {
      "address": {
        "model": 1,
        "detail": "120 Trần Hưng Đạo",
        "full_address": "120 Trần Hưng Đạo, Phường Cầu Ông Lãnh, Quận 1, Thành phố Hồ Chí Minh",
        "province_code": "79",
        "district_code": "760",
        "commune_code": "26734"
      }
    },
    "cod_amount": 200000,
    "collection_amount": 219000,
    "declared_value": 200000,
    "weight": 750,
    "fee_items": [
      {
        "fee_type": "SHIPPING",
        "fee_name": "Phí vận chuyển",
        "amount": 19000
      },
      {
        "fee_type": "INSURANCE",
        "fee_name": "Phí bảo hiểm",
        "amount": 0
      }
    ],
    "shipping_stages": [
      {
        "leg_type": 1,
        "carrier_code": 1,
        "carrier_name": "SuperShip",
        "carrier_client_code": "S983262",
        "carrier_waybill_code": "STGS983262LM.826941741"
      },
      {
        "leg_type": 2,
        "carrier_code": 2,
        "carrier_name": "Giao Hàng Nhanh",
        "carrier_client_code": "R9012150",
        "carrier_waybill_code": "GY8YLSDK",
        "carrier_sorting_code": "100-A2-09-00"
      }
    ],
    "images": [
      {
        "image_code": "IMG-20260916-000001",
        "status": "ATTACHED"
      }
    ],
    "created_at": "2026-09-16T08:20:00+07:00"
  }
}
```

##### Ví dụ Response — NVC tức thời đang tìm tài xế

Ví dụ tạm dùng `carrier_code = 15` cho Green SM Express\. `carrier_waybill_code` và `carrier_sorting_code` bên dưới là dữ liệu giả định để mô tả đầy đủ Response, không phải mã mẫu chính thức do Green SM công bố; khi chạy thật phải trả nguyên giá trị do Green SM cung cấp\.

```JSON
{
  "error": false,
  "message": "Tạo Đơn hàng thành công, NVC đang tìm tài xế.",
  "data": {
    "order_code": "9001156990402",
    "soc": "SHOP-2026-0002",
    "order_status": "SPF-0302",
    "status_name": "Đang tìm tài xế",
    "pickup": {
      "point_code": "KHO-Q8-01",
      "point_name": "Kho Quận 8",
      "address": {
        "model": 1,
        "detail": "231/15 Dương Bá Trạc",
        "full_address": "231/15 Dương Bá Trạc, Phường 1, Quận 8, Thành phố Hồ Chí Minh",
        "province_code": "79",
        "district_code": "776",
        "commune_code": "27301"
      }
    },
    "receiver": {
      "address": {
        "model": 1,
        "detail": "120 Trần Hưng Đạo",
        "full_address": "120 Trần Hưng Đạo, Phường Cầu Ông Lãnh, Quận 1, Thành phố Hồ Chí Minh",
        "province_code": "79",
        "district_code": "760",
        "commune_code": "26734"
      }
    },
    "cod_amount": 200000,
    "collection_amount": 233000,
    "declared_value": 200000,
    "weight": 750,
    "fee_items": [
      {
        "fee_type": "SHIPPING",
        "fee_name": "Phí vận chuyển tức thời",
        "amount": 33000
      },
      {
        "fee_type": "INSURANCE",
        "fee_name": "Phí bảo hiểm",
        "amount": 0
      }
    ],
    "shipping_stages": [
      {
        "leg_type": 1,
        "carrier_code": 15,
        "carrier_name": "Green SM Express",
        "carrier_client_code": "GSM-S983262",
        "carrier_waybill_code": "GSM-EXP-20260916-000001",
        "carrier_sorting_code": "GSM-HCM-01"
      },
      {
        "leg_type": 2,
        "carrier_code": 15,
        "carrier_name": "Green SM Express",
        "carrier_client_code": "GSM-S983262",
        "carrier_waybill_code": "GSM-EXP-20260916-000001",
        "carrier_sorting_code": "GSM-HCM-01"
      }
    ],
    "images": [],
    "created_at": "2026-09-16T08:58:00+07:00"
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`400 Bad Request`|`INVALID_ORDER_DATA`|Request thiếu trường, sai định dạng, enum, số tiền, khối lượng hoặc kích thước\.|
|`401 Unauthorized`|`UNAUTHENTICATED`|Thiếu hoặc Access Token không hợp lệ\.|
|`403 Forbidden`|`ORDER_CREATE_FORBIDDEN`|Actor không có quyền tạo Order hoặc Shop mục tiêu nằm ngoài Data Scope/ủy quyền\.|
|`404 Not Found`|`PICKUP_POINT_NOT_FOUND`|Điểm lấy không tồn tại hoặc không thuộc Shop\.|
|`404 Not Found`|`CARRIER_NOT_FOUND`|`carrier_code` được truyền nhưng không tồn tại trong danh mục NVC của SuperPlatform\.|
|`409 Conflict`|`IDEMPOTENCY_CONFLICT`|Cùng `Idempotency-Key` nhưng payload khác request ban đầu\.|
|`409 Conflict`|`SOC_DUPLICATED`|`soc` đã tồn tại trong phạm vi Shop và chính sách không cho phép trùng\.|
|`422 Unprocessable Entity`|`ADDRESS_UNSERVICEABLE`|Địa chỉ không chuẩn hóa được hoặc không có phương án phục vụ phù hợp\.|
|`422 Unprocessable Entity`|`CARRIER_SELECTION_NOT_ALLOWED`|Request truyền `carrier_code` nhưng Application/Shop không được phép chọn NVC thủ công hoặc mã NVC nằm ngoài cấu hình cho phép\.|
|`422 Unprocessable Entity`|`CARRIER_UNAVAILABLE`|NVC được cấu hình/chọn không phục vụ tuyến đường, thời điểm, kiện hàng hoặc dịch vụ của Order\.|
|`422 Unprocessable Entity`|`CARRIER_QUOTE_UNAVAILABLE`|NVC tức thời không trả được báo giá hợp lệ để tạo chuyến tại thời điểm xử lý\.|
|`422 Unprocessable Entity`|`LOCATION_REQUIRED`|Phương án NVC tức thời cần tọa độ chuẩn nhưng một trong hai đầu tuyến chưa xác định được tọa độ hợp lệ\.|
|`422 Unprocessable Entity`|`PARCEL_NOT_SUPPORTED`|Kiện hàng vượt giới hạn hoặc thuộc loại NVC/dịch vụ không nhận\.|
|`422 Unprocessable Entity`|`COD_NOT_SUPPORTED`|COD vượt giới hạn hoặc phương án không hỗ trợ thu hộ\.|
|`422 Unprocessable Entity`|`IMAGE_NOT_ACCESSIBLE`|Ảnh không tồn tại, không đúng quyền hoặc không đạt kiểm tra nội dung\.|
|`503 Service Unavailable`|`ORDER_CREATE_UNAVAILABLE`|Không thể xác thực dữ liệu hoặc lưu Order an toàn tại thời điểm yêu cầu\. Không trả lỗi này chỉ vì NVC đang xử lý tạo Waybill bất đồng bộ\.|

### 4\.1\.2\. Dựng bảng danh sách đơn

Dùng cho màn hình danh sách Đơn hàng của Shop, đối tác và nội bộ SuperPlatform\. Mỗi Order chỉ xuất hiện một lần dù có nhiều chặng hoặc nhiều vận đơn\.

#### Endpoint

|**Thuộc tính**|**Nội dung**|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/orders`|
|Thành công|`200 OK`|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định người gọi, quyền và Data Scope được phép truy cập.|
|`X-Correlation-Id`|Không|Mã truy vết do Consumer truyền; Backend tự tạo nếu không có.|

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`Authorization`|header|Có<br>|Xác định Actor, quyền và Data Scope\.|
|`X-Correlation-Id`|header|Không|Mã truy vết; Backend tự tạo nếu Consumer không truyền\.|

##### Query Parameters

**Sắp xếp và phân trang**

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`sort_by`|integer|Không|`1` — thời điểm tạo; `2` — thời điểm cập nhật gần nhất\. Mặc định `1`\.|
|`sort_direction`|integer|Không|`1` — mới nhất trước; `2` — cũ nhất trước\. Mặc định `1`\.|
|`page`|integer|Không|Trang cần lấy, số nguyên từ `1`; mặc định `1`\.|
|`page_size`|integer|Không|Số Order trên trang, số nguyên từ `1` đến `100`; mặc định `20`\.|

#### Response

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`error`|boolean|Có|`false` khi API xử lý thành công\.|
|`message`|string|Có|Thông báo kết quả bằng tiếng Việt\.|
|`data`|object|Có|Kết quả danh sách\.|
|`data.items`|array\(object\)|Có|Danh sách Order; trả `[]` khi không có kết quả\.|
|`data.items[].order_code`|string|Có|Mã Order SuperPlatform\.|
|`data.items[].soc`|string/null|Có|Mã đơn Shop/Hệ thống nguồn; `null` nếu không có\.|
|`data.items[].shop`|object|Có điều kiện|Thông tin Shop sở hữu Order; chỉ trả khi người gọi được phép xem\.|
|`data.items[].shop.shop_code`|string|Có điều kiện|Mã Shop\.|
|`data.items[].shop.shop_name`|string|Có điều kiện|Tên Shop\.|
|`data.items[].source`|object|Có|Nguồn tạo Order dùng để hiển thị nhanh\.|
|`data.items[].source.channel_code`|integer|Có|Kênh tạo: `1` — Web; `2` — Mobile; `3` — API; `4` — tạo loạt; `5` — nội bộ; `6` — hệ thống\.|
|`data.items[].source.channel_name`|string|Có|Tên kênh tạo bằng tiếng Việt\.|
|`data.items[].pickup`|object|Có|Điểm lấy và lịch lấy đã áp dụng cho Order\.|
|`data.items[].pickup.point_code`|string|Không|Mã điểm lấy theo cùng quy ước `pickup.point_code` của API tạo Order; bỏ trường nếu Order dùng địa chỉ lấy nhập trực tiếp\.|
|`data.items[].pickup.point_name`|string|Có|Tên Kho hoặc tên điểm lấy\.|
|`data.items[].pickup.full_address`|string|Có|Địa chỉ lấy đầy đủ đã lưu trên Order\.|
|`data.items[].pickup.scheduled_from`|datetime|Không|Thời điểm bắt đầu khung lấy hàng dự kiến; bỏ trường nếu Order không hẹn lịch lấy\.|
|`data.items[].pickup.scheduled_to`|datetime|Không|Thời điểm kết thúc khung lấy hàng dự kiến; phải không nhỏ hơn `scheduled_from` và bỏ trường nếu Order không hẹn lịch lấy\.|
|`data.items[].receiver`|object|Có|Thông tin người nhận dùng cho danh sách\.|
|`data.items[].receiver.name`|string|Có|Tên người nhận theo quyền hiển thị\.|
|`data.items[].receiver.phone`|string|Có|SĐT đầy đủ hoặc đã masking theo quyền Actor\.|
|`data.items[].receiver.full_address`|string|Có|Địa chỉ nhận đầy đủ đã chuẩn hóa; có thể được che một phần theo quyền\.|
|`data.items[].parcel`|object|Có|Thông tin hàng hóa tóm tắt\.|
|`data.items[].parcel.product_name`|string/null|Có|Tên hàng hóa/sản phẩm khi Order dùng `content_type = 1`; trả `null` khi Order khai báo danh sách sản phẩm bằng `content_type = 2`\.|
|`data.items[].parcel.weight`|integer|Có|Khối lượng khai báo, gram\.|
|`data.items[].cod_amount`|integer|Có|COD yêu cầu thu, VND\.|
|`data.items[].collection_amount`|integer|Có|Số tiền dự kiến cần thu của người nhận, VND\.|
|`data.items[].pricing`|object|Có|Thông tin giá tóm tắt đã áp dụng cho Order\.|
|`data.items[].pricing.pricing_code`|string|Có|Mã phương án/bảng giá đã áp dụng\.|
|`data.items[].pricing.shipping_fee`|integer|Có|Tổng phí vận chuyển bán cho Shop, VND\.|
|`data.items[].order_status`|string|Có|Mã trạng thái chuẩn SuperPlatform hiện tại\.|
|`data.items[].status_name`|string|Có|Tên trạng thái hiện tại dùng để hiển thị\.|
|`data.items[].shipping_stages`|array\(object\)|Có|Tóm tắt các Chặng đã phát sinh; trả `[]` khi chưa có\.|
|`data.items[].shipping_stages[].leg_type`|integer|Có theo phần tử|`1` — Lấy; `2` — Giao; `3` — Hoàn; `4` — Trả cuối\.|
|`data.items[].shipping_stages[].carrier_code`|integer/null|Có theo phần tử|Mã số NVC thực hiện Chặng; `null` khi chưa xác định\.|
|`data.items[].shipping_stages[].carrier_name`|string/null|Có theo phần tử|Tên NVC hiển thị\.|
|`data.items[].shipping_stages[].carrier_client_code`|string|Có theo phần tử|Mã khách hàng/tài khoản được sử dụng để tạo vận đơn tại NVC của riêng chặng này\. Không phải `source.client_code` của ứng dụng tạo Order\.|
|`data.items[].shipping_stages[].carrier_waybill_code`|string/null|Có theo phần tử|Carrier Waybill của Chặng khi đã có\.|
|`data.items[].shipping_stages[].status_code`|string|Có theo phần tử|Mã trạng thái chặng đã chuẩn hóa của SuperPlatform\.|
|`data.items[].shipping_stages[].status_name`|string|Có theo phần tử|Tên trạng thái chặng dùng để hiển thị\.|
|`data.items[].shipping_stages[].is_current`|boolean|Có theo phần tử|`true` khi đây là chặng đang thực hiện\.|
|`data.items[].flags`|array\(integer\)|Có|Các cờ tóm tắt được phép hiển thị; trả `[]` khi không có\.|
|`data.items[].created_at`|datetime|Có|Thời điểm tạo Order\.|
|`data.items[].updated_at`|datetime|Có|Thời điểm cập nhật gần nhất của Order\.|
|`data.meta`|object|Có|Thông tin phân trang\.|
|`data.meta.page`|integer|Có|Trang hiện tại\.|
|`data.meta.page_size`|integer|Có|Kích thước trang\.|
|`data.meta.total_items`|integer|Có|Tổng số Order phù hợp với điều kiện\.|
|`data.meta.total_pages`|integer|Có|Tổng số trang\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Lấy danh sách Đơn hàng thành công.",
  "data": {
    "items": [
      {
        "order_code": "9001156990401",
        "soc": "AB-16092026-001",
        "shop": {
          "shop_code": "S275518",
          "shop_name": "AB Shop"
        },
        "source": {
          "channel_code": 3,
          "channel_name": "API"
        },
        "pickup": {
          "point_code": "KHO-Q8-01",
          "point_name": "Kho AB Shop Quận 8",
          "full_address": "231/15 Dương Bá Trạc, Phường Chánh Hưng, Thành phố Hồ Chí Minh",
          "scheduled_from": "2026-09-16T13:00:00+07:00",
          "scheduled_to": "2026-09-16T17:00:00+07:00"
        },
        "receiver": {
          "name": "Lê Phước Thắng",
          "phone": "0338488429",
          "full_address": "99/1 Hàm Nghi, Phường Bình Định, Tỉnh Gia Lai"
        },
        "parcel": {
          "product_name": "Máy ép chậm hoa quả",
          "weight": 2500
        },
        "cod_amount": 200000,
        "collection_amount": 219000,
        "pricing": {
          "pricing_code": "PRC-S275518-GHN-202609",
          "shipping_fee": 19000
        },
        "order_status": "SPF-0801",
        "status_name": "Đang giao hàng",
        "shipping_stages": [
          {
            "leg_type": 1,
            "carrier_code": 1,
            "carrier_name": "SuperShip",
            "carrier_client_code": "S275518",
            "carrier_waybill_code": "STGS983262LM.826941741",
            "status_code": "SPF-0501",
            "status_name": "Đã lấy hàng",
            "is_current": false
          },
          {
            "leg_type": 2,
            "carrier_code": 2,
            "carrier_name": "Giao Hàng Nhanh",
            "carrier_client_code": "R9012150",
            "carrier_waybill_code": "GY8YLSDK",
            "status_code": "SPF-0801",
            "status_name": "Đang giao hàng",
            "is_current": true
          }
        ],
        "flags": [],
        "created_at": "2026-09-14T10:00:00+07:00",
        "updated_at": "2026-09-15T07:30:00+07:00"
      }
    ],
    "meta": {
      "page": 1,
      "page_size": 20,
      "total_items": 128,
      "total_pages": 7
    }
  }
}
```

#### Error

|**HTTP Status**|**Error Code**|**Khi nào xảy ra**|
|---|---|---|
|`400 Bad Request`|`INVALID_ORDER_QUERY`|Giá trị sắp xếp hoặc phân trang không hợp lệ\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`503 Service Unavailable`|`ORDER_QUERY_UNAVAILABLE`|Dữ liệu cần thiết cho danh sách tạm thời không thể truy vấn\.|

### 4\.1\.3\. Hiển thị kết quả tra cứu nhanh

Tra cứu nhanh và trả danh sách Order khớp từ khóa trong phạm vi dữ liệu người gọi được phép xem\. API bắt buộc có `keyword`; mỗi kết quả chứa đầy đủ dữ liệu cần thiết để dựng một dòng trong bảng danh sách Đơn hàng\.

#### Endpoint

|**Thuộc tính**|**Nội dung**|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/orders/search`|
|Thành công|`200 OK`|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định người gọi, quyền và Data Scope được phép truy cập.|
|`X-Correlation-Id`|Không|Mã truy vết do Consumer truyền; Backend tự tạo nếu không có.|

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`Authorization`|header|Có|Xác định Actor, quyền và Data Scope\.|
|`X-Correlation-Id`|header|Không|Mã truy vết\.|

##### Query Parameters

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`keyword`|string|Có|Chuỗi tra cứu theo mã Order, mã đơn Shop, mã nguồn, mã vận đơn, tên hoặc SĐT người nhận\. Từ `2` đến `100` ký tự\.|
|`sort_by`|integer|Không|`1` — thời điểm tạo; `2` — thời điểm cập nhật gần nhất\. Mặc định `1`\.|
|`sort_direction`|integer|Không|`1` — mới nhất trước; `2` — cũ nhất trước\. Mặc định `1`\.|
|`page`|integer|Không|Trang cần lấy, số nguyên từ `1`; mặc định `1`\.|
|`page_size`|integer|Không|Số Order trên trang, số nguyên từ `1` đến `100`; mặc định `20`\.|

#### Response

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`error`|boolean|Có|`false` khi API xử lý thành công\.|
|`message`|string|Có|Thông báo kết quả bằng tiếng Việt\.|
|`data`|object|Có|Kết quả tra cứu nhanh\.|
|`data.items`|array\(object\)|Có|Danh sách Order khớp `keyword` trong Data Scope; trả `[]` nếu không có kết quả\.|
|`data.items[].order_code`|string|Có|Mã Order SuperPlatform\.|
|`data.items[].soc`|string/null|Có|Mã đơn Shop/Hệ thống nguồn; `null` nếu không có\.|
|`data.items[].shop`|object|Có điều kiện|Thông tin Shop sở hữu Order; chỉ trả khi người gọi được phép xem\.|
|`data.items[].shop.shop_code`|string|Có điều kiện|Mã Shop\.|
|`data.items[].shop.shop_name`|string|Có điều kiện|Tên Shop\.|
|`data.items[].source`|object|Có|Nguồn tạo Order dùng để hiển thị nhanh\.|
|`data.items[].source.channel_code`|integer|Có|Kênh tạo: `1` — Web; `2` — Mobile; `3` — API; `4` — tạo loạt; `5` — nội bộ; `6` — hệ thống\.|
|`data.items[].source.channel_name`|string|Có|Tên kênh tạo bằng tiếng Việt\.|
|`data.items[].pickup`|object|Có|Điểm lấy và lịch lấy đã áp dụng cho Order\.|
|`data.items[].pickup.point_code`|string|Không|Mã điểm lấy; bỏ trường nếu Order dùng địa chỉ lấy nhập trực tiếp\.|
|`data.items[].pickup.point_name`|string|Có|Tên Kho hoặc tên điểm lấy\.|
|`data.items[].pickup.full_address`|string|Có|Địa chỉ lấy đầy đủ đã lưu trên Order\.|
|`data.items[].pickup.scheduled_from`|datetime|Không|Thời điểm bắt đầu khung lấy hàng dự kiến; bỏ trường nếu Order không hẹn lịch lấy\.|
|`data.items[].pickup.scheduled_to`|datetime|Không|Thời điểm kết thúc khung lấy hàng dự kiến; phải không nhỏ hơn `scheduled_from`; bỏ trường nếu Order không hẹn lịch lấy\.|
|`data.items[].receiver`|object|Có|Thông tin người nhận dùng cho danh sách\.|
|`data.items[].receiver.name`|string|Có|Tên người nhận theo quyền hiển thị\.|
|`data.items[].receiver.phone`|string|Có|SĐT đầy đủ hoặc đã che một phần theo quyền của người gọi\.|
|`data.items[].receiver.full_address`|string|Có|Địa chỉ nhận đầy đủ đã chuẩn hóa; có thể được che một phần theo quyền\.|
|`data.items[].parcel`|object|Có|Thông tin hàng hóa tóm tắt\.|
|`data.items[].parcel.product_name`|string/null|Có|Tên hàng hóa khi Order khai báo một tên sản phẩm; trả `null` khi Order khai báo danh sách sản phẩm\.|
|`data.items[].parcel.weight`|integer|Có|Khối lượng khai báo, đơn vị gram\.|
|`data.items[].cod_amount`|integer|Có|Tiền thu hộ yêu cầu thu, đơn vị VND\.|
|`data.items[].collection_amount`|integer|Có|Tổng số tiền dự kiến cần thu của người nhận, đơn vị VND\.|
|`data.items[].pricing`|object|Có|Thông tin giá tóm tắt đã áp dụng cho Order\.|
|`data.items[].pricing.pricing_code`|string|Có|Mã phương án hoặc bảng giá đã áp dụng\.|
|`data.items[].pricing.shipping_fee`|integer|Có|Tổng phí vận chuyển bán cho Shop, đơn vị VND\.|
|`data.items[].order_status`|string|Có|Mã trạng thái Order chuẩn của SuperPlatform tại thời điểm trả Response\.|
|`data.items[].status_name`|string|Có|Tên trạng thái Order dùng để hiển thị\.|
|`data.items[].shipping_stages`|array\(object\)|Có|Tóm tắt các chặng vận chuyển đã phát sinh; trả `[]` khi chưa có chặng\.|
|`data.items[].shipping_stages[].leg_type`|integer|Có theo phần tử|Loại chặng: `1` — Lấy; `2` — Giao; `3` — Hoàn; `4` — Trả cuối\.|
|`data.items[].shipping_stages[].carrier_code`|integer/null|Có theo phần tử|Mã số NVC thực hiện chặng; `null` khi chưa xác định NVC\.|
|`data.items[].shipping_stages[].carrier_name`|string/null|Có theo phần tử|Tên NVC hiển thị; `null` khi chưa xác định NVC\.|
|`data.items[].shipping_stages[].carrier_client_code`|string|Có theo phần tử|Mã khách hàng/tài khoản được dùng để tạo vận đơn tại NVC của chặng; không phải mã Client kỹ thuật tạo Order\.|
|`data.items[].shipping_stages[].carrier_waybill_code`|string/null|Có theo phần tử|Mã vận đơn nguyên bản do NVC cấp; `null` khi NVC chưa cấp vận đơn\.|
|`data.items[].shipping_stages[].status_code`|string|Có theo phần tử|Mã trạng thái chặng đã chuẩn hóa của SuperPlatform\.|
|`data.items[].shipping_stages[].status_name`|string|Có theo phần tử|Tên trạng thái chặng dùng để hiển thị\.|
|`data.items[].shipping_stages[].is_current`|boolean|Có theo phần tử|`true` khi đây là chặng đang được thực hiện; `false` khi không phải chặng hiện tại\.|
|`data.items[].flags`|array\(integer\)|Có|Các cờ tóm tắt mà người gọi được phép xem; trả `[]` khi không có\.|
|`data.items[].created_at`|datetime|Có|Thời điểm tạo Order theo ISO 8601\.|
|`data.items[].updated_at`|datetime|Có|Thời điểm cập nhật gần nhất của Order theo ISO 8601\.|
|`data.meta`|object|Có|Thông tin phân trang của kết quả tra cứu\.|
|`data.meta.page`|integer|Có|Trang hiện tại\.|
|`data.meta.page_size`|integer|Có|Số Order tối đa trên một trang\.|
|`data.meta.total_items`|integer|Có|Tổng số Order khớp `keyword` trong Data Scope\.|
|`data.meta.total_pages`|integer|Có|Tổng số trang kết quả\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Tra cứu Đơn hàng thành công.",
  "data": {
    "items": [
      {
        "order_code": "9001156990401",
        "soc": "AB-16092026-001",
        "shop": {
          "shop_code": "S275518",
          "shop_name": "AB Shop"
        },
        "source": {
          "channel_code": 3,
          "channel_name": "API"
        },
        "pickup": {
          "point_code": "KHO-Q8-01",
          "point_name": "Kho AB Shop Quận 8",
          "full_address": "231/15 Dương Bá Trạc, Phường Chánh Hưng, Thành phố Hồ Chí Minh",
          "scheduled_from": "2026-09-16T13:00:00+07:00",
          "scheduled_to": "2026-09-16T17:00:00+07:00"
        },
        "receiver": {
          "name": "Lê Phước Thắng",
          "phone": "0338488429",
          "full_address": "99/1 Hàm Nghi, Phường Bình Định, Tỉnh Gia Lai"
        },
        "parcel": {
          "product_name": "Máy ép chậm hoa quả",
          "weight": 2500
        },
        "cod_amount": 200000,
        "collection_amount": 219000,
        "pricing": {
          "pricing_code": "PRC-S275518-GHN-202609",
          "shipping_fee": 19000
        },
        "order_status": "SPF-0801",
        "status_name": "Đang giao hàng",
        "shipping_stages": [
          {
            "leg_type": 1,
            "carrier_code": 1,
            "carrier_name": "SuperShip",
            "carrier_client_code": "S275518",
            "carrier_waybill_code": "STGS983262LM.826941741",
            "status_code": "SPF-0501",
            "status_name": "Đã lấy hàng",
            "is_current": false
          },
          {
            "leg_type": 2,
            "carrier_code": 2,
            "carrier_name": "Giao Hàng Nhanh",
            "carrier_client_code": "R9012150",
            "carrier_waybill_code": "GY8YLSDK",
            "status_code": "SPF-0801",
            "status_name": "Đang giao hàng",
            "is_current": true
          }
        ],
        "flags": [],
        "created_at": "2026-09-14T10:00:00+07:00",
        "updated_at": "2026-09-15T07:30:00+07:00"
      }
    ],
    "meta": {
      "page": 1,
      "page_size": 20,
      "total_items": 1,
      "total_pages": 1
    }
  }
}
```

#### Error

|**HTTP Status**|**Error Code**|**Khi nào xảy ra**|
|---|---|---|
|`400 Bad Request`|`INVALID_ORDER_SEARCH`|`keyword`, sắp xếp hoặc phân trang không hợp lệ\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`503 Service Unavailable`|`ORDER_SEARCH_UNAVAILABLE`|Tạm thời không thể thực hiện tra cứu nhanh\.|

### 4\.1\.4\. Lấy cấu hình bộ lọc Đơn hàng

API này không lọc dữ liệu\. API chỉ trả những nhóm bộ lọc, giá trị lựa chọn và thứ tự hiển thị mà người gọi được phép sử dụng\. Vì vậy Shop, đối tác và nội bộ có thể dùng cùng màn hình nhưng không nhìn thấy các bộ lọc ngoài quyền của mình\.

#### Endpoint

|**Thuộc tính**|**Nội dung**|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/order-filters`|
|Thành công|`200 OK`|

#### Request

##### Headers

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`Authorization`|header|Có|Xác định Actor, quyền và Data Scope để trả đúng các bộ lọc được phép sử dụng\.|
|`X-Correlation-Id`|header|Không|Mã truy vết; Backend tự tạo nếu Consumer không truyền\.|

#### Response

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`error`|boolean|Có|`false` khi API xử lý thành công\.|
|`message`|string|Có|Thông báo kết quả bằng tiếng Việt\.|
|`data.groups`|array\(object\)|Có|Các nhóm bộ lọc được phép sử dụng, theo đúng thứ tự hiển thị\.|
|`data.groups[].group_code`|integer|Có|Mã nhóm ổn định\.|
|`data.groups[].group_name`|string|Có|Tên nhóm hiển thị\.|
|`data.groups[].display_level`|integer|Có|Vị trí UI: `1` — cơ bản; `2` — nâng cao\. Đây chỉ là cách trình bày; cả hai cùng gửi vào `POST /v1/orders/filter`\.|
|`data.groups[].filters`|array\(object\)|Có|Các bộ lọc trong nhóm\.|
|`data.groups[].filters[].filter_key`|string|Có|Tên field dùng trong Request lọc\.|
|`data.groups[].filters[].name`|string|Có|Tên hiển thị của bộ lọc\.|
|`data.groups[].filters[].description`|string|Có|Giải thích ngắn gọn dữ liệu được lọc để người dùng không nhầm trạng thái hiện tại với cờ lịch sử/lũy kế\.|
|`data.groups[].filters[].control_type`|integer|Có|Kiểu nhập: `1` — chữ; `2` — số; `3` — một lựa chọn; `4` — nhiều lựa chọn; `5` — đúng/sai; `6` — khoảng số; `7` — khoảng thời gian\.|
|`data.groups[].filters[].value_type`|string|Có|Kiểu dữ liệu FE phải gửi: `STRING`, `INTEGER`, `BOOLEAN`, `DATETIME`, `STRING_ARRAY`, `INTEGER_ARRAY`, `NUMBER_RANGE` hoặc `DATETIME_RANGE`\.|
|`data.groups[].filters[].selection_mode`|integer|Có|Số lượng lựa chọn: `1` — một giá trị; `2` — nhiều giá trị; `3` — nhập khoảng từ/đến\.|
|`data.groups[].filters[].option_source`|integer|Có|Nguồn lựa chọn: `1` — danh mục cố định trả ngay trong `options`; `2` — danh mục động đã giới hạn theo quyền và Data Scope; `3` — người dùng nhập, không có `options`\.|
|`data.groups[].filters[].options`|array\(object\)|Có điều kiện|Danh sách lựa chọn khi `control_type` là `3` hoặc `4`\. Không trả field với kiểu nhập khác\.|
|`data.groups[].filters[].options[].value`|string/integer/boolean|Có|Giá trị gửi vào API lọc\.|
|`data.groups[].filters[].options[].label`|string|Có|Tên lựa chọn hiển thị\.|

##### Danh mục đầy đủ các nhóm bộ lọc có thể được trả về

Response chỉ trả những nhóm Actor được phép dùng\. Shop không nhận nhóm Shop vì phạm vi đã cố định vào chính Shop; nội bộ chỉ nhận các Shop thuộc Data Scope\. Danh mục dưới đây là toàn bộ khả năng của API, được đối chiếu với UC\-ORD\-004\. Tất cả `filter_key` được gửi nguyên tên sang `POST /v1/orders/filter`\.

|**Mã nhóm**|**Tên nhóm**|**Các bộ lọc được trả về**|**Giá trị / nguồn giá trị**|
|---|---|---|---|
|`1`|Bộ lọc chung|`basic.keyword`, `basic.order_statuses`, `basic.status_groups`, `basic.carrier_codes`, `basic.service_codes`, `basic.pickup_methods`|Từ khóa do người dùng nhập; trạng thái Order lấy từ danh mục trạng thái SPF; NVC và dịch vụ là danh mục động theo quyền\. `pickup_methods`: `1` — NVC đến lấy, `2` — Shop gửi tại điểm tiếp nhận\. Nguồn tạo thuộc nhóm `4`; khu vực nhận thuộc nhóm `5` để mỗi `filter_key` chỉ xuất hiện một lần trong Response\.|
|`2`|Quản lý nhanh|`basic.attention_codes`|Danh mục cố định: `1` — đồng bộ lỗi; `2` — có chuyển ngoài; `3` — chưa in nhãn; `4` — có sự cố; `5` — có yêu cầu hỗ trợ; `6` — có hành động đang chờ kết quả\.|
|`3`|Định danh Đơn hàng|`identifiers.order_codes`, `identifiers.socs`, `identifiers.carrier_waybill_codes`, `identifiers.client_codes`, `identifiers.batch_codes`|Người dùng nhập mã Order, mã đơn Shop, mã vận đơn NVC, Client Code hoặc mã lần tạo đơn loạt\. Không trả danh sách mã Order để tránh tải dữ liệu lớn\.|
|`4`|Shop và nguồn tạo|`basic.shop_codes`, `basic.source_codes`|Shop và nguồn tạo được trả từ danh mục động đã giới hạn theo Data Scope\. Shop tự đăng nhập không nhận `basic.shop_codes`\.|
|`5`|Người nhận|`receiver.names`, `receiver.phones`, `receiver.address_keyword`, `basic.delivery_province_codes`, `basic.delivery_district_codes`, `basic.delivery_commune_codes`|Tên, SĐT và địa chỉ chi tiết do người dùng nhập; Tỉnh/Thành, Quận/Huyện và Phường/Xã lấy từ Address Module\. Quận/Huyện chỉ dùng cho địa chỉ ba cấp\.|
|`6`|Người gửi và Kho gửi|`sender.warehouse_codes`, `sender.names`, `sender.phones`, `sender.address_keyword`, `sender.address_models`, `sender.differs_from_default_warehouse`|Kho/điểm lấy là danh mục động của Shop; `address_models`: `1` — địa chỉ ba cấp, `2` — địa chỉ hai cấp; cờ khác Kho mặc định nhận `true` hoặc `false`\.|
|`7`|NVC theo từng chặng|`stage_conditions[].leg_types`, `stage_conditions[].carrier_codes`, `stage_conditions[].mapped_statuses`, `stage_conditions[].raw_statuses`, `stage_conditions[].shipper_phones`, `stage_conditions[].is_current`, `stage_conditions[].updated_from`, `stage_conditions[].updated_to`|`leg_types`: `1` — Lấy, `2` — Giao, `3` — Hoàn, `4` — Trả cuối; NVC và trạng thái là danh mục động\. Raw status và SĐT nhân sự NVC chỉ trả cho Actor nội bộ có quyền\.|
|`8`|Lấy, bàn giao, giao và kết quả nghiệp vụ|`operations.pickup_results`, `operations.handover_results`, `operations.delivery_results`, `operations.return_results`, `operations.pickup_attempts`, `operations.delivery_attempts`, `operations.return_attempts`, `operations.failure_reason_codes`, `operations.has_retry_request`, `operations.has_external_transfer`, `operations.has_partial_delivery`, `operations.has_exchange`, `operations.current_status_age_hours`|Kết quả và lý do lấy từ danh mục nghiệp vụ động; số lần và số giờ là khoảng số; các tiêu chí Có/Không nhận `true` hoặc `false`\. Kết quả gồm thành công, thất bại hoặc một phần khi nghiệp vụ tương ứng hỗ trợ\.|
|`9`|Hủy Đơn hàng|`operations.has_cancel_request`, `cancellation.requested`, `cancellation.carrier_error`, `cancellation.rejected`, `cancellation.pending_or_unknown`, `cancellation.after_pickup`|Tất cả là lựa chọn Có/Không: `true` — có phát sinh điều kiện; `false` — không phát sinh\. Đây là dữ liệu của yêu cầu hủy, không đồng nghĩa trạng thái Order hiện tại là Đã hủy\.|
|`10`|Tạo vận đơn NVC|`waybill.has_active_waybill`, `waybill.creation_results`, `waybill.has_multiple_waybills`|Có/Không cho vận đơn hiện hành và nhiều vận đơn\. `creation_results`: `1` — tạo thành công; `2` — tạo lỗi; `3` — đang chờ/chưa xác định kết quả\.|
|`11`|Nhãn vận chuyển|`label.printed`, `label.reprinted`, `label.print_count`, `label.printed_from`, `label.printed_to`, `label.has_error`|Có/Không cho đã in, in lại và lỗi; số lần in là khoảng số; thời gian in là khoảng thời gian ISO 8601\.|
|`12`|Hoàn hàng|`return_flow.has_return`, `return_flow.confirmed`, `return_flow.pickup_failed`, `return_flow.picked_up`, `return_flow.missing_waybill`|Lựa chọn Có/Không cho từng cờ lũy kế của luồng Hoàn\. Trạng thái đang ở bước Hoàn nào vẫn lọc bằng `basic.order_statuses`\.|
|`13`|Trả hàng cuối|`return_final.handover_failed`, `return_final.delivery_failed`, `return_final.retry_requested`, `return_final.attempts`|Có/Không cho thất bại và yêu cầu trả lại; số lần trả cuối là khoảng số\.|
|`14`|COD và tiền thu hộ|`cod.has_cod`, `cod.amount`, `cod.changed`, `cod.change_failed`, `cod.actual_collected`, `cod.actual_differs_from_expected`|Có/Không cho các cờ COD; `amount` và `actual_collected` là khoảng tiền nguyên không âm, đơn vị VND\.|
|`15`|Tài khoản giá|`pricing_account_codes`|Danh mục động các tài khoản giá người gọi được phép xem; mỗi option phải có mã tài khoản và tên hiển thị, trong đó tên cho biết tài khoản chung hay tài khoản riêng của Shop\.|
|`16`|Yêu cầu hỗ trợ|`support.has_ticket`, `support.ticket_types`, `support.ticket_statuses`, `support.assignee_codes`, `support.overdue`|Có/Không cho Ticket và quá hạn; loại, trạng thái và người/nhóm xử lý lấy động từ Support Module theo quyền\.|
|`17`|Sự cố|`incident.exists`, `incident.types`, `incident.carrier_codes`, `incident.leg_types`|Có/Không cho sự cố; loại sự cố lấy từ danh mục Incident; NVC động; `leg_types`: `1` — Lấy, `2` — Giao, `3` — Hoàn, `4` — Trả cuối\.|
|`18`|Khiếu nại và bồi thường|`claim.exists`, `claim.statuses`, `claim.compensated`|Có/Không cho khiếu nại và bồi thường; trạng thái lấy động từ Claim Module theo quyền\.|
|`19`|Đồng bộ|`sync.source_results`, `sync.carrier_error`, `sync.pending_or_unknown`, `sync.last_synced_from`, `sync.last_synced_to`|`source_results`: `1` — thành công; `2` — lỗi; `3` — đang chờ/chưa xác định; các cờ còn lại là Có/Không; thời gian đồng bộ là ISO 8601\. Chỉ trả cho nội bộ có quyền\.|
|`20`|Bất thường vận hành|`anomalies.no_update_hours`, `anomalies.status_mismatch`, `anomalies.pending_action_overdue`|Số giờ không cập nhật là khoảng số; sai lệch trạng thái và tác vụ chờ quá hạn là Có/Không\. Chỉ trả cho nội bộ có quyền\.|
|`21`|Mốc thời gian|`basic.time_type`, `basic.time_from`, `basic.time_to`, `time_ranges[].time_type`, `time_ranges[].from`, `time_ranges[].to`|`time_type`: `1` — tạo Order; `2` — lấy thành công; `3` — bàn giao; `4` — cập nhật giao gần nhất; `5` — giao thành công; `6` — bắt đầu hoàn; `7` — trả thành công; `8` — cập nhật gần nhất\. Khoảng thời gian dùng ISO 8601 có múi giờ\.|

##### Quy tắc trả danh mục lựa chọn

- `option_source = 1`: Response phải trả đủ `options`; FE gửi đúng `value`, không gửi `label`\.
- `option_source = 2`: Backend chỉ trả các option còn hiệu lực và nằm trong quyền/Data Scope, ví dụ Shop, Kho gửi, NVC, trạng thái NVC, tài khoản giá, người xử lý Ticket\. Nếu không có option hợp lệ thì trả `options: []`\.
- `option_source = 3`: người dùng nhập giá trị; Response không trả field `options`\.
- Một filter không được phép dùng phải bị loại khỏi `groups[].filters`, không trả filter ở trạng thái ẩn rồi để FE tự quyết định quyền\.
- Các giá trị danh mục động trong Response là giá trị có thể dùng ngay tại thời điểm gọi; Backend vẫn kiểm tra lại quyền và tính hợp lệ khi nhận `POST /v1/orders/filter`\.

##### Ví dụ Response đầy đủ — Actor Admin

Ví dụ dưới đây sử dụng toàn bộ `filter_key` mà API có thể trả\. Trong thực tế, Shop hoặc Actor bị giới hạn quyền sẽ chỉ nhận các nhóm và option được phép sử dụng\.

```JSON
{
  "error": false,
  "message": "Lấy cấu hình bộ lọc Đơn hàng thành công.",
  "data": {
    "groups": [
      {
        "group_code": 1,
        "group_name": "Bộ lọc chung",
        "display_level": 1,
        "filters": [
          {
            "filter_key": "basic.keyword",
            "name": "Tra cứu toàn hệ thống",
            "description": "Cấu hình bộ lọc Tra cứu toàn hệ thống.",
            "control_type": 1,
            "value_type": "STRING",
            "selection_mode": 1,
            "option_source": 3
          },
          {
            "filter_key": "basic.order_statuses",
            "name": "Trạng thái Đơn hàng",
            "description": "Cấu hình bộ lọc Trạng thái Đơn hàng.",
            "control_type": 4,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "basic.status_groups",
            "name": "Nhóm trạng thái",
            "description": "Cấu hình bộ lọc Nhóm trạng thái.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "basic.carrier_codes",
            "name": "NVC tham gia",
            "description": "Cấu hình bộ lọc NVC tham gia.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "basic.service_codes",
            "name": "Dịch vụ",
            "description": "Cấu hình bộ lọc Dịch vụ.",
            "control_type": 4,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "basic.pickup_methods",
            "name": "Phương thức gửi",
            "description": "Cấu hình bộ lọc Phương thức gửi.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 1,
            "options": [
              {
                "value": 1,
                "label": "NVC đến lấy"
              },
              {
                "value": 2,
                "label": "Shop gửi tại điểm tiếp nhận"
              }
            ]
          }
        ]
      },
      {
        "group_code": 2,
        "group_name": "Quản lý nhanh",
        "display_level": 1,
        "filters": [
          {
            "filter_key": "basic.attention_codes",
            "name": "Cần theo dõi nhanh",
            "description": "Cấu hình bộ lọc Cần theo dõi nhanh.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 1,
            "options": [
              {
                "value": 1,
                "label": "Đồng bộ lỗi"
              },
              {
                "value": 2,
                "label": "Có chuyển ngoài"
              },
              {
                "value": 3,
                "label": "Chưa in nhãn"
              },
              {
                "value": 4,
                "label": "Có sự cố"
              },
              {
                "value": 5,
                "label": "Có yêu cầu hỗ trợ"
              },
              {
                "value": 6,
                "label": "Có hành động đang chờ kết quả"
              }
            ]
          }
        ]
      },
      {
        "group_code": 3,
        "group_name": "Định danh Đơn hàng",
        "display_level": 2,
        "filters": [
          {
            "filter_key": "identifiers.order_codes",
            "name": "Mã Order SuperPlatform",
            "description": "Cấu hình bộ lọc Mã Order SuperPlatform.",
            "control_type": 1,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 3
          },
          {
            "filter_key": "identifiers.socs",
            "name": "Mã đơn của Shop",
            "description": "Cấu hình bộ lọc Mã đơn của Shop.",
            "control_type": 1,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 3
          },
          {
            "filter_key": "identifiers.carrier_waybill_codes",
            "name": "Mã vận đơn NVC",
            "description": "Cấu hình bộ lọc Mã vận đơn NVC.",
            "control_type": 1,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 3
          },
          {
            "filter_key": "identifiers.client_codes",
            "name": "Client Code",
            "description": "Cấu hình bộ lọc Client Code.",
            "control_type": 1,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 3
          },
          {
            "filter_key": "identifiers.batch_codes",
            "name": "Mã tạo đơn loạt",
            "description": "Cấu hình bộ lọc Mã tạo đơn loạt.",
            "control_type": 1,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 3
          }
        ]
      },
      {
        "group_code": 4,
        "group_name": "Shop và nguồn tạo",
        "display_level": 2,
        "filters": [
          {
            "filter_key": "basic.shop_codes",
            "name": "shop_codes",
            "description": "Cấu hình bộ lọc basic.shop_codes.",
            "control_type": 4,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "basic.source_codes",
            "name": "Nguồn tạo",
            "description": "Cấu hình bộ lọc Nguồn tạo.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          }
        ]
      },
      {
        "group_code": 5,
        "group_name": "Người nhận",
        "display_level": 2,
        "filters": [
          {
            "filter_key": "receiver.names",
            "name": "Tên người nhận",
            "description": "Cấu hình bộ lọc Tên người nhận.",
            "control_type": 1,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 3
          },
          {
            "filter_key": "receiver.phones",
            "name": "SĐT người nhận",
            "description": "Cấu hình bộ lọc SĐT người nhận.",
            "control_type": 1,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 3
          },
          {
            "filter_key": "receiver.address_keyword",
            "name": "Địa chỉ nhận",
            "description": "Cấu hình bộ lọc Địa chỉ nhận.",
            "control_type": 1,
            "value_type": "STRING",
            "selection_mode": 1,
            "option_source": 3
          },
          {
            "filter_key": "basic.delivery_province_codes",
            "name": "Tỉnh/Thành nhận",
            "description": "Cấu hình bộ lọc Tỉnh/Thành nhận.",
            "control_type": 4,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "basic.delivery_district_codes",
            "name": "Quận/Huyện nhận",
            "description": "Cấu hình bộ lọc Quận/Huyện nhận.",
            "control_type": 4,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "basic.delivery_commune_codes",
            "name": "Phường/Xã nhận",
            "description": "Cấu hình bộ lọc Phường/Xã nhận.",
            "control_type": 4,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          }
        ]
      },
      {
        "group_code": 6,
        "group_name": "Người gửi và Kho gửi",
        "display_level": 2,
        "filters": [
          {
            "filter_key": "sender.warehouse_codes",
            "name": "Kho gửi",
            "description": "Cấu hình bộ lọc Kho gửi.",
            "control_type": 4,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "sender.names",
            "name": "Tên người gửi",
            "description": "Cấu hình bộ lọc Tên người gửi.",
            "control_type": 1,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 3
          },
          {
            "filter_key": "sender.phones",
            "name": "SĐT người gửi",
            "description": "Cấu hình bộ lọc SĐT người gửi.",
            "control_type": 1,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 3
          },
          {
            "filter_key": "sender.address_keyword",
            "name": "Địa chỉ gửi",
            "description": "Cấu hình bộ lọc Địa chỉ gửi.",
            "control_type": 1,
            "value_type": "STRING",
            "selection_mode": 1,
            "option_source": 3
          },
          {
            "filter_key": "sender.address_models",
            "name": "Định dạng địa chỉ gửi",
            "description": "Cấu hình bộ lọc Định dạng địa chỉ gửi.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 1,
            "options": [
              {
                "value": 1,
                "label": "Địa chỉ ba cấp"
              },
              {
                "value": 2,
                "label": "Địa chỉ hai cấp"
              }
            ]
          },
          {
            "filter_key": "sender.differs_from_default_warehouse",
            "name": "Khác Kho mặc định",
            "description": "Cấu hình bộ lọc Khác Kho mặc định.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          }
        ]
      },
      {
        "group_code": 7,
        "group_name": "NVC theo từng chặng",
        "display_level": 2,
        "filters": [
          {
            "filter_key": "stage_conditions[].leg_types",
            "name": "Loại chặng",
            "description": "Cấu hình bộ lọc Loại chặng.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 1,
            "options": [
              {
                "value": 1,
                "label": "Lấy"
              },
              {
                "value": 2,
                "label": "Giao"
              },
              {
                "value": 3,
                "label": "Hoàn"
              },
              {
                "value": 4,
                "label": "Trả cuối"
              }
            ]
          },
          {
            "filter_key": "stage_conditions[].carrier_codes",
            "name": "NVC theo chặng",
            "description": "Cấu hình bộ lọc NVC theo chặng.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "stage_conditions[].mapped_statuses",
            "name": "Trạng thái chuẩn theo chặng",
            "description": "Cấu hình bộ lọc Trạng thái chuẩn theo chặng.",
            "control_type": 4,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "stage_conditions[].raw_statuses",
            "name": "Trạng thái gốc NVC",
            "description": "Cấu hình bộ lọc Trạng thái gốc NVC.",
            "control_type": 4,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "stage_conditions[].shipper_phones",
            "name": "SĐT Shipper",
            "description": "Cấu hình bộ lọc SĐT Shipper.",
            "control_type": 1,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 3
          },
          {
            "filter_key": "stage_conditions[].is_current",
            "name": "Chặng hiện tại",
            "description": "Cấu hình bộ lọc Chặng hiện tại.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "stage_conditions[].updated_from",
            "name": "Cập nhật chặng từ",
            "description": "Cấu hình bộ lọc Cập nhật chặng từ.",
            "control_type": 7,
            "value_type": "DATETIME",
            "selection_mode": 1,
            "option_source": 3
          },
          {
            "filter_key": "stage_conditions[].updated_to",
            "name": "Cập nhật chặng đến",
            "description": "Cấu hình bộ lọc Cập nhật chặng đến.",
            "control_type": 7,
            "value_type": "DATETIME",
            "selection_mode": 1,
            "option_source": 3
          }
        ]
      },
      {
        "group_code": 8,
        "group_name": "Kết quả nghiệp vụ",
        "display_level": 2,
        "filters": [
          {
            "filter_key": "operations.pickup_results",
            "name": "pickup_results",
            "description": "Cấu hình bộ lọc operations.pickup_results.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "operations.handover_results",
            "name": "handover_results",
            "description": "Cấu hình bộ lọc operations.handover_results.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "operations.delivery_results",
            "name": "delivery_results",
            "description": "Cấu hình bộ lọc operations.delivery_results.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "operations.return_results",
            "name": "return_results",
            "description": "Cấu hình bộ lọc operations.return_results.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "operations.pickup_attempts",
            "name": "pickup_attempts",
            "description": "Cấu hình bộ lọc operations.pickup_attempts.",
            "control_type": 6,
            "value_type": "NUMBER_RANGE",
            "selection_mode": 3,
            "option_source": 3
          },
          {
            "filter_key": "operations.delivery_attempts",
            "name": "delivery_attempts",
            "description": "Cấu hình bộ lọc operations.delivery_attempts.",
            "control_type": 6,
            "value_type": "NUMBER_RANGE",
            "selection_mode": 3,
            "option_source": 3
          },
          {
            "filter_key": "operations.return_attempts",
            "name": "return_attempts",
            "description": "Cấu hình bộ lọc operations.return_attempts.",
            "control_type": 6,
            "value_type": "NUMBER_RANGE",
            "selection_mode": 3,
            "option_source": 3
          },
          {
            "filter_key": "operations.failure_reason_codes",
            "name": "failure_reason_codes",
            "description": "Cấu hình bộ lọc operations.failure_reason_codes.",
            "control_type": 4,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "operations.has_retry_request",
            "name": "has_retry_request",
            "description": "Cấu hình bộ lọc operations.has_retry_request.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "operations.has_external_transfer",
            "name": "has_external_transfer",
            "description": "Cấu hình bộ lọc operations.has_external_transfer.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "operations.has_partial_delivery",
            "name": "has_partial_delivery",
            "description": "Cấu hình bộ lọc operations.has_partial_delivery.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "operations.has_exchange",
            "name": "has_exchange",
            "description": "Cấu hình bộ lọc operations.has_exchange.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "operations.current_status_age_hours",
            "name": "current_status_age_hours",
            "description": "Cấu hình bộ lọc operations.current_status_age_hours.",
            "control_type": 6,
            "value_type": "NUMBER_RANGE",
            "selection_mode": 3,
            "option_source": 3
          }
        ]
      },
      {
        "group_code": 9,
        "group_name": "Hủy Đơn hàng",
        "display_level": 2,
        "filters": [
          {
            "filter_key": "operations.has_cancel_request",
            "name": "has_cancel_request",
            "description": "Cấu hình bộ lọc operations.has_cancel_request.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "cancellation.requested",
            "name": "requested",
            "description": "Cấu hình bộ lọc cancellation.requested.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "cancellation.carrier_error",
            "name": "carrier_error",
            "description": "Cấu hình bộ lọc cancellation.carrier_error.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "cancellation.rejected",
            "name": "rejected",
            "description": "Cấu hình bộ lọc cancellation.rejected.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "cancellation.pending_or_unknown",
            "name": "pending_or_unknown",
            "description": "Cấu hình bộ lọc cancellation.pending_or_unknown.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "cancellation.after_pickup",
            "name": "after_pickup",
            "description": "Cấu hình bộ lọc cancellation.after_pickup.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          }
        ]
      },
      {
        "group_code": 10,
        "group_name": "Tạo vận đơn NVC",
        "display_level": 2,
        "filters": [
          {
            "filter_key": "waybill.has_active_waybill",
            "name": "has_active_waybill",
            "description": "Cấu hình bộ lọc waybill.has_active_waybill.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "waybill.creation_results",
            "name": "creation_results",
            "description": "Cấu hình bộ lọc waybill.creation_results.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 1,
            "options": [
              {
                "value": 1,
                "label": "Thành công"
              },
              {
                "value": 2,
                "label": "Lỗi"
              },
              {
                "value": 3,
                "label": "Đang chờ hoặc chưa xác định"
              }
            ]
          },
          {
            "filter_key": "waybill.has_multiple_waybills",
            "name": "has_multiple_waybills",
            "description": "Cấu hình bộ lọc waybill.has_multiple_waybills.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          }
        ]
      },
      {
        "group_code": 11,
        "group_name": "Nhãn vận chuyển",
        "display_level": 2,
        "filters": [
          {
            "filter_key": "label.printed",
            "name": "printed",
            "description": "Cấu hình bộ lọc label.printed.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "label.reprinted",
            "name": "reprinted",
            "description": "Cấu hình bộ lọc label.reprinted.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "label.print_count",
            "name": "print_count",
            "description": "Cấu hình bộ lọc label.print_count.",
            "control_type": 6,
            "value_type": "NUMBER_RANGE",
            "selection_mode": 3,
            "option_source": 3
          },
          {
            "filter_key": "label.printed_from",
            "name": "printed_from",
            "description": "Cấu hình bộ lọc label.printed_from.",
            "control_type": 7,
            "value_type": "DATETIME",
            "selection_mode": 1,
            "option_source": 3
          },
          {
            "filter_key": "label.printed_to",
            "name": "printed_to",
            "description": "Cấu hình bộ lọc label.printed_to.",
            "control_type": 7,
            "value_type": "DATETIME",
            "selection_mode": 1,
            "option_source": 3
          },
          {
            "filter_key": "label.has_error",
            "name": "has_error",
            "description": "Cấu hình bộ lọc label.has_error.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          }
        ]
      },
      {
        "group_code": 12,
        "group_name": "Hoàn hàng",
        "display_level": 2,
        "filters": [
          {
            "filter_key": "return_flow.has_return",
            "name": "has_return",
            "description": "Cấu hình bộ lọc return_flow.has_return.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "return_flow.confirmed",
            "name": "confirmed",
            "description": "Cấu hình bộ lọc return_flow.confirmed.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "return_flow.pickup_failed",
            "name": "pickup_failed",
            "description": "Cấu hình bộ lọc return_flow.pickup_failed.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "return_flow.picked_up",
            "name": "picked_up",
            "description": "Cấu hình bộ lọc return_flow.picked_up.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "return_flow.missing_waybill",
            "name": "missing_waybill",
            "description": "Cấu hình bộ lọc return_flow.missing_waybill.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          }
        ]
      },
      {
        "group_code": 13,
        "group_name": "Trả hàng cuối",
        "display_level": 2,
        "filters": [
          {
            "filter_key": "return_final.handover_failed",
            "name": "handover_failed",
            "description": "Cấu hình bộ lọc return_final.handover_failed.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "return_final.delivery_failed",
            "name": "delivery_failed",
            "description": "Cấu hình bộ lọc return_final.delivery_failed.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "return_final.retry_requested",
            "name": "retry_requested",
            "description": "Cấu hình bộ lọc return_final.retry_requested.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "return_final.attempts",
            "name": "attempts",
            "description": "Cấu hình bộ lọc return_final.attempts.",
            "control_type": 6,
            "value_type": "NUMBER_RANGE",
            "selection_mode": 3,
            "option_source": 3
          }
        ]
      },
      {
        "group_code": 14,
        "group_name": "COD và tiền thu hộ",
        "display_level": 2,
        "filters": [
          {
            "filter_key": "cod.has_cod",
            "name": "has_cod",
            "description": "Cấu hình bộ lọc cod.has_cod.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "cod.amount",
            "name": "amount",
            "description": "Cấu hình bộ lọc cod.amount.",
            "control_type": 6,
            "value_type": "NUMBER_RANGE",
            "selection_mode": 3,
            "option_source": 3
          },
          {
            "filter_key": "cod.changed",
            "name": "changed",
            "description": "Cấu hình bộ lọc cod.changed.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "cod.change_failed",
            "name": "change_failed",
            "description": "Cấu hình bộ lọc cod.change_failed.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "cod.actual_collected",
            "name": "actual_collected",
            "description": "Cấu hình bộ lọc cod.actual_collected.",
            "control_type": 6,
            "value_type": "NUMBER_RANGE",
            "selection_mode": 3,
            "option_source": 3
          },
          {
            "filter_key": "cod.actual_differs_from_expected",
            "name": "actual_differs_from_expected",
            "description": "Cấu hình bộ lọc cod.actual_differs_from_expected.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          }
        ]
      },
      {
        "group_code": 15,
        "group_name": "Tài khoản giá",
        "display_level": 2,
        "filters": [
          {
            "filter_key": "pricing_account_codes",
            "name": "pricing_account_codes",
            "description": "Cấu hình bộ lọc pricing_account_codes.",
            "control_type": 4,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          }
        ]
      },
      {
        "group_code": 16,
        "group_name": "Yêu cầu hỗ trợ",
        "display_level": 2,
        "filters": [
          {
            "filter_key": "support.has_ticket",
            "name": "has_ticket",
            "description": "Cấu hình bộ lọc support.has_ticket.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "support.ticket_types",
            "name": "ticket_types",
            "description": "Cấu hình bộ lọc support.ticket_types.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "support.ticket_statuses",
            "name": "ticket_statuses",
            "description": "Cấu hình bộ lọc support.ticket_statuses.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "support.assignee_codes",
            "name": "assignee_codes",
            "description": "Cấu hình bộ lọc support.assignee_codes.",
            "control_type": 4,
            "value_type": "STRING_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "support.overdue",
            "name": "overdue",
            "description": "Cấu hình bộ lọc support.overdue.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          }
        ]
      },
      {
        "group_code": 17,
        "group_name": "Sự cố",
        "display_level": 2,
        "filters": [
          {
            "filter_key": "incident.exists",
            "name": "exists",
            "description": "Cấu hình bộ lọc incident.exists.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "incident.types",
            "name": "types",
            "description": "Cấu hình bộ lọc incident.types.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "incident.carrier_codes",
            "name": "carrier_codes",
            "description": "Cấu hình bộ lọc incident.carrier_codes.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "incident.leg_types",
            "name": "leg_types",
            "description": "Cấu hình bộ lọc incident.leg_types.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 1,
            "options": [
              {
                "value": 1,
                "label": "Lấy"
              },
              {
                "value": 2,
                "label": "Giao"
              },
              {
                "value": 3,
                "label": "Hoàn"
              },
              {
                "value": 4,
                "label": "Trả cuối"
              }
            ]
          }
        ]
      },
      {
        "group_code": 18,
        "group_name": "Khiếu nại và bồi thường",
        "display_level": 2,
        "filters": [
          {
            "filter_key": "claim.exists",
            "name": "exists",
            "description": "Cấu hình bộ lọc claim.exists.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "claim.statuses",
            "name": "statuses",
            "description": "Cấu hình bộ lọc claim.statuses.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 2,
            "options": []
          },
          {
            "filter_key": "claim.compensated",
            "name": "compensated",
            "description": "Cấu hình bộ lọc claim.compensated.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          }
        ]
      },
      {
        "group_code": 19,
        "group_name": "Đồng bộ",
        "display_level": 2,
        "filters": [
          {
            "filter_key": "sync.source_results",
            "name": "source_results",
            "description": "Cấu hình bộ lọc sync.source_results.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 1,
            "options": [
              {
                "value": 1,
                "label": "Thành công"
              },
              {
                "value": 2,
                "label": "Lỗi"
              },
              {
                "value": 3,
                "label": "Đang chờ hoặc chưa xác định"
              }
            ]
          },
          {
            "filter_key": "sync.carrier_error",
            "name": "carrier_error",
            "description": "Cấu hình bộ lọc sync.carrier_error.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "sync.pending_or_unknown",
            "name": "pending_or_unknown",
            "description": "Cấu hình bộ lọc sync.pending_or_unknown.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "sync.last_synced_from",
            "name": "last_synced_from",
            "description": "Cấu hình bộ lọc sync.last_synced_from.",
            "control_type": 7,
            "value_type": "DATETIME",
            "selection_mode": 1,
            "option_source": 3
          },
          {
            "filter_key": "sync.last_synced_to",
            "name": "last_synced_to",
            "description": "Cấu hình bộ lọc sync.last_synced_to.",
            "control_type": 7,
            "value_type": "DATETIME",
            "selection_mode": 1,
            "option_source": 3
          }
        ]
      },
      {
        "group_code": 20,
        "group_name": "Bất thường vận hành",
        "display_level": 2,
        "filters": [
          {
            "filter_key": "anomalies.no_update_hours",
            "name": "no_update_hours",
            "description": "Cấu hình bộ lọc anomalies.no_update_hours.",
            "control_type": 6,
            "value_type": "NUMBER_RANGE",
            "selection_mode": 3,
            "option_source": 3
          },
          {
            "filter_key": "anomalies.status_mismatch",
            "name": "status_mismatch",
            "description": "Cấu hình bộ lọc anomalies.status_mismatch.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          },
          {
            "filter_key": "anomalies.pending_action_overdue",
            "name": "pending_action_overdue",
            "description": "Cấu hình bộ lọc anomalies.pending_action_overdue.",
            "control_type": 5,
            "value_type": "BOOLEAN",
            "selection_mode": 1,
            "option_source": 1
          }
        ]
      },
      {
        "group_code": 21,
        "group_name": "Mốc thời gian",
        "display_level": 2,
        "filters": [
          {
            "filter_key": "basic.time_type",
            "name": "time_type",
            "description": "Cấu hình bộ lọc basic.time_type.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 1,
            "options": [
              {
                "value": 1,
                "label": "Ngày tạo Order"
              },
              {
                "value": 2,
                "label": "Ngày lấy thành công"
              },
              {
                "value": 3,
                "label": "Ngày bàn giao"
              },
              {
                "value": 4,
                "label": "Ngày cập nhật giao gần nhất"
              },
              {
                "value": 5,
                "label": "Ngày giao thành công"
              },
              {
                "value": 6,
                "label": "Ngày bắt đầu hoàn"
              },
              {
                "value": 7,
                "label": "Ngày trả thành công"
              },
              {
                "value": 8,
                "label": "Ngày cập nhật gần nhất"
              }
            ]
          },
          {
            "filter_key": "basic.time_from",
            "name": "time_from",
            "description": "Cấu hình bộ lọc basic.time_from.",
            "control_type": 7,
            "value_type": "DATETIME",
            "selection_mode": 1,
            "option_source": 3
          },
          {
            "filter_key": "basic.time_to",
            "name": "time_to",
            "description": "Cấu hình bộ lọc basic.time_to.",
            "control_type": 7,
            "value_type": "DATETIME",
            "selection_mode": 1,
            "option_source": 3
          },
          {
            "filter_key": "time_ranges[].time_type",
            "name": "time_type",
            "description": "Cấu hình bộ lọc time_ranges[].time_type.",
            "control_type": 4,
            "value_type": "INTEGER_ARRAY",
            "selection_mode": 2,
            "option_source": 1,
            "options": [
              {
                "value": 1,
                "label": "Ngày tạo Order"
              },
              {
                "value": 2,
                "label": "Ngày lấy thành công"
              },
              {
                "value": 3,
                "label": "Ngày bàn giao"
              },
              {
                "value": 4,
                "label": "Ngày cập nhật giao gần nhất"
              },
              {
                "value": 5,
                "label": "Ngày giao thành công"
              },
              {
                "value": 6,
                "label": "Ngày bắt đầu hoàn"
              },
              {
                "value": 7,
                "label": "Ngày trả thành công"
              },
              {
                "value": 8,
                "label": "Ngày cập nhật gần nhất"
              }
            ]
          },
          {
            "filter_key": "time_ranges[].from",
            "name": "from",
            "description": "Cấu hình bộ lọc time_ranges[].from.",
            "control_type": 7,
            "value_type": "DATETIME",
            "selection_mode": 1,
            "option_source": 3
          },
          {
            "filter_key": "time_ranges[].to",
            "name": "to",
            "description": "Cấu hình bộ lọc time_ranges[].to.",
            "control_type": 7,
            "value_type": "DATETIME",
            "selection_mode": 1,
            "option_source": 3
          }
        ]
      }
    ]
  }
}
```

#### Error

|**HTTP Status**|**Error Code**|**Khi nào xảy ra**|
|---|---|---|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`503 Service Unavailable`|`ORDER_FILTER_CONFIG_UNAVAILABLE`|Tạm thời không thể tải cấu hình bộ lọc\.|

### 4\.1\.5\. Lọc Đơn hàng

Đây là API duy nhất thực thi bộ lọc trên màn hình danh sách\. Các điều kiện ở phần cơ bản và phần nâng cao của giao diện được gửi chung trong một Request, vì vậy có thể kết hợp Shop, trạng thái, NVC theo chặng, COD, Ticket hỗ trợ và mốc thời gian trong cùng lần lọc\. Toàn bộ schema kết quả được mô tả đầy đủ ngay trong endpoint này\.

#### Endpoint

|**Thuộc tính**|**Nội dung**|
|---|---|
|Phương thức HTTP|`POST`|
|Endpoint / Event|`/v1/orders/filter`|
|Thành công|`200 OK`|

#### Request

##### Headers

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`Authorization`|header|Có|Xác định Actor, quyền và Data Scope\.|
|`X-Correlation-Id`|header|Không|Mã truy vết; Backend tự tạo nếu Consumer không truyền\.|

##### Request Body

Các giá trị trong cùng một mảng áp dụng điều kiện **OR**\. Các field và nhóm khác nhau áp dụng điều kiện **AND**\. Riêng `stage_conditions`: field trong cùng một phần tử áp dụng **AND**; nhiều phần tử áp dụng **OR**\.

**Bộ lọc cơ bản**

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`basic.keyword`|string|Không|Tìm trong phạm vi được phép theo mã Order, mã nguồn, mã vận đơn, Shop, người gửi hoặc người nhận\. Tối đa `100` ký tự\.|
|`basic.shop_codes`|array\(string\)|Không|Shop thuộc Data Scope; Shop tự đăng nhập không dùng field này để mở rộng phạm vi\.|
|`basic.order_statuses`|array\(string\)|Không|Mã trạng thái Order chuẩn SuperPlatform\.|
|`basic.status_groups`|array\(integer\)|Không|Nhóm trạng thái dùng cho tab nhanh\.|
|`basic.carrier_codes`|array\(integer\)|Không|Order có ít nhất một chặng do NVC được chọn thực hiện\.|
|`basic.source_codes`|array\(integer\)|Không|Nguồn tạo Order\.|
|`basic.service_codes`|array\(string\)|Không|Dịch vụ vận chuyển đã áp dụng\.|
|`basic.pickup_methods`|array\(integer\)|Không|Phương thức gửi: `1` — NVC đến lấy; `2` — Shop gửi tại điểm tiếp nhận\.|
|`basic.delivery_province_codes`|array\(string\)|Không|Tỉnh/Thành của địa chỉ nhận\.|
|`basic.delivery_district_codes`|array\(string\)|Không|Quận/Huyện của địa chỉ ba cấp\.|
|`basic.delivery_commune_codes`|array\(string\)|Không|Phường/Xã của địa chỉ nhận\.|
|`basic.attention_codes`|array\(integer\)|Không|Nhóm cần theo dõi nhanh như đồng bộ lỗi, chuyển ngoài, chưa in nhãn hoặc có sự cố\.|
|`basic.time_type`|integer|Không|Mốc thời gian: `1` — tạo; `2` — lấy thành công; `3` — bàn giao; `4` — cập nhật giao gần nhất; `5` — giao thành công; `6` — bắt đầu hoàn; `7` — trả thành công; `8` — cập nhật gần nhất\.|
|`basic.time_from`|datetime|Có điều kiện|Bắt đầu khoảng thời gian; bắt buộc khi có `basic.time_to`\.|
|`basic.time_to`|datetime|Có điều kiện|Kết thúc khoảng thời gian; bắt buộc khi có `basic.time_from` và không nhỏ hơn thời điểm bắt đầu\.|
|`time_ranges`|array\(object\)|Không|Nhiều khoảng thời gian theo các mốc nghiệp vụ khác nhau; dùng khi một mốc thời gian cơ bản không đủ\.|
|`time_ranges[].time_type`|integer|Có theo phần tử|`1` — tạo; `2` — lấy thành công; `3` — bàn giao; `4` — cập nhật giao gần nhất; `5` — giao thành công; `6` — bắt đầu hoàn; `7` — trả thành công; `8` — cập nhật gần nhất\.|
|`time_ranges[].from`|datetime|Có theo phần tử|Thời điểm bắt đầu, ISO 8601 có múi giờ\.|
|`time_ranges[].to`|datetime|Có theo phần tử|Thời điểm kết thúc, ISO 8601 có múi giờ và không nhỏ hơn `from`\.|

**Định danh và đối tượng**

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`identifiers.order_codes`|array\(string\)|Không|Mã Order SuperPlatform\.|
|`identifiers.socs`|array\(string\)|Không|Mã đơn riêng của Shop hoặc hệ thống nguồn\.|
|`identifiers.carrier_waybill_codes`|array\(string\)|Không|Mã vận đơn của bất kỳ chặng nào\.|
|`identifiers.client_codes`|array\(string\)|Không|Mã khách hàng nguồn mà Actor được phép tra cứu\.|
|`identifiers.batch_codes`|array\(string\)|Không|Mã lần tạo Order loạt/import\.|
|`receiver.names`|array\(string\)|Không|Tên người nhận\.|
|`receiver.phones`|array\(string\)|Không|SĐT người nhận\.|
|`receiver.address_keyword`|string|Không|Từ khóa trong địa chỉ nhận đầy đủ\.|
|`sender.warehouse_codes`|array\(string\)|Không|Kho hoặc điểm gửi đã áp dụng\.|
|`sender.names`|array\(string\)|Không|Tên người gửi\.|
|`sender.phones`|array\(string\)|Không|SĐT người gửi\.|
|`sender.address_keyword`|string|Không|Từ khóa trong địa chỉ lấy đầy đủ\.|
|`sender.address_models`|array\(integer\)|Không|`1` — địa chỉ ba cấp; `2` — địa chỉ hai cấp\.|
|`sender.differs_from_default_warehouse`|boolean|Không|Địa chỉ lấy đã áp dụng có khác địa chỉ mặc định của kho hay không\.|

**Nhà vận chuyển theo từng chặng**

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`stage_conditions`|array\(object\)|Không|Các bộ điều kiện theo từng chặng; Order phù hợp vẫn chỉ xuất hiện một lần\.|
|`stage_conditions[].leg_types`|array\(integer\)|Không|`1` — Lấy; `2` — Giao; `3` — Hoàn; `4` — Trả cuối\.|
|`stage_conditions[].carrier_codes`|array\(integer\)|Không|Mã NVC thực hiện chặng\.|
|`stage_conditions[].mapped_statuses`|array\(string\)|Không|Mã trạng thái chặng đã chuẩn hóa của SuperPlatform\.|
|`stage_conditions[].raw_statuses`|array\(string\)|Không|Trạng thái nguyên bản của NVC; chỉ Actor nội bộ được cấp quyền\.|
|`stage_conditions[].shipper_phones`|array\(string\)|Không|SĐT nhân viên/tài xế theo đúng chặng; chỉ dùng khi được cấp quyền\.|
|`stage_conditions[].is_current`|boolean|Không|Chặng có đang được thực hiện hay không\.|
|`stage_conditions[].updated_from`|datetime|Không|NVC cập nhật chặng từ thời điểm này\.|
|`stage_conditions[].updated_to`|datetime|Không|NVC cập nhật chặng đến thời điểm này\.|

**Kết quả và tiến trình vận hành**

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`operations.pickup_results`|array\(integer\)|Không|Kết quả lấy hàng theo danh mục cấu hình\.|
|`operations.handover_results`|array\(integer\)|Không|Kết quả bàn giao giữa các NVC\.|
|`operations.delivery_results`|array\(integer\)|Không|Kết quả giao toàn bộ, giao một phần hoặc thất bại\.|
|`operations.return_results`|array\(integer\)|Không|Kết quả hoàn/trả hàng\.|
|`operations.pickup_attempts`|object|Không|Khoảng số lần lấy hàng; dùng `from` và `to`\.|
|`operations.delivery_attempts`|object|Không|Khoảng số lần giao hàng; dùng `from` và `to`\.|
|`operations.return_attempts`|object|Không|Khoảng số lần trả hàng; dùng `from` và `to`\.|
|`operations.failure_reason_codes`|array\(string\)|Không|Mã lý do thất bại chuẩn hóa\.|
|`operations.has_retry_request`|boolean|Không|Có yêu cầu NVC lấy/giao/hoàn/trả lại hay không\.|
|`operations.has_cancel_request`|boolean|Không|Có yêu cầu hủy hay không\.|
|`operations.has_external_transfer`|boolean|Không|Có phát sinh chuyển ngoài giữa SuperShip và NVC khác hay không\.|
|`operations.has_partial_delivery`|boolean|Không|Có giao một phần hay không\.|
|`operations.has_exchange`|boolean|Không|Có đổi hàng/lấy hàng cũ hay không\.|
|`operations.current_status_age_hours`|object|Không|Khoảng số giờ Order đã ở trạng thái hiện tại; dùng `from` và `to`\.|
|`cancellation.requested`|boolean|Không|Đã phát sinh yêu cầu hủy hay chưa\.|
|`cancellation.carrier_error`|boolean|Không|NVC báo lỗi khi hủy hay chưa\.|
|`cancellation.rejected`|boolean|Không|Yêu cầu hủy bị từ chối hay chưa\.|
|`cancellation.pending_or_unknown`|boolean|Không|Kết quả hủy đang chờ hoặc chưa xác định hay không\.|
|`cancellation.after_pickup`|boolean|Không|Yêu cầu hủy phát sinh sau khi NVC đã lấy hàng hay không\.|
|`return_flow.has_return`|boolean|Không|Order có phát sinh hoàn hàng hay không\.|
|`return_flow.confirmed`|boolean|Không|Đã xác nhận chuyển hoàn hay chưa\.|
|`return_flow.pickup_failed`|boolean|Không|NVC lấy hàng hoàn thất bại hay chưa\.|
|`return_flow.picked_up`|boolean|Không|NVC đã lấy hàng hoàn hay chưa\.|
|`return_flow.missing_waybill`|boolean|Không|Chặng hoàn cần vận đơn nhưng chưa có vận đơn hợp lệ hay không\.|
|`return_final.handover_failed`|boolean|Không|Bàn giao để trả Shop thất bại hay chưa\.|
|`return_final.delivery_failed`|boolean|Không|Lần trả hàng cuối về Shop thất bại hay chưa\.|
|`return_final.retry_requested`|boolean|Không|Đã yêu cầu thực hiện lại việc trả hàng hay chưa\.|
|`return_final.attempts`|object|Không|Khoảng số lần trả cuối; dùng `from` và `to`\.|

**Vận đơn, in nhãn, COD và nghiệp vụ liên quan**

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`waybill.has_active_waybill`|boolean|Không|Có vận đơn hiện hành hay không\.|
|`waybill.creation_results`|array\(integer\)|Không|Kết quả tạo vận đơn: thành công, lỗi hoặc chưa xác định theo danh mục cấu hình\.|
|`waybill.has_multiple_waybills`|boolean|Không|Có nhiều vận đơn hay không\.|
|`label.printed`|boolean|Không|Đã từng in nhãn hay chưa\.|
|`label.reprinted`|boolean|Không|Đã in lại nhãn hay chưa\.|
|`label.print_count`|object|Không|Khoảng số lần in; dùng `from` và `to`\.|
|`label.printed_from`|datetime|Không|Đã in nhãn từ thời điểm này\.|
|`label.printed_to`|datetime|Không|Đã in nhãn đến thời điểm này\.|
|`label.has_error`|boolean|Không|Có lần in nhãn lỗi hay không\.|
|`cod.has_cod`|boolean|Không|Order có COD hay không\.|
|`cod.amount`|object|Không|Khoảng COD yêu cầu thu, VND; dùng `from` và `to`\.|
|`cod.changed`|boolean|Không|COD đã từng thay đổi hay chưa\.|
|`cod.change_failed`|boolean|Không|Có yêu cầu đổi COD thất bại hay chưa\.|
|`cod.actual_collected`|object|Không|Khoảng tiền thực thu, VND; dùng `from` và `to`\.|
|`cod.actual_differs_from_expected`|boolean|Không|Tiền thực thu có khác số phải thu hay không\.|
|`pricing_account_codes`|array\(string\)|Không|Tài khoản giá dùng chung hoặc riêng mà Actor được phép tra cứu\.|

**Hỗ trợ, sự cố, khiếu nại và đồng bộ**

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`support.has_ticket`|boolean|Không|Có Ticket Support liên quan Order hay không\.|
|`support.ticket_types`|array\(integer\)|Không|Loại Ticket\.|
|`support.ticket_statuses`|array\(integer\)|Không|Trạng thái Ticket\.|
|`support.assignee_codes`|array\(string\)|Không|Người hoặc nhóm phụ trách\.|
|`support.overdue`|boolean|Không|Ticket quá thời hạn xử lý hay chưa\.|
|`incident.exists`|boolean|Không|Có sự cố liên quan Order/chặng hay không\.|
|`incident.types`|array\(integer\)|Không|Loại sự cố\.|
|`incident.carrier_codes`|array\(integer\)|Không|NVC liên quan sự cố\.|
|`incident.leg_types`|array\(integer\)|Không|Loại chặng xảy ra sự cố\.|
|`claim.exists`|boolean|Không|Có khiếu nại/bồi thường hay không\.|
|`claim.statuses`|array\(integer\)|Không|Trạng thái khiếu nại\.|
|`claim.compensated`|boolean|Không|Đã ghi nhận bồi thường hay chưa\.|
|`sync.source_results`|array\(integer\)|Không|Kết quả đồng bộ từ nguồn tạo; chỉ nội bộ được cấp quyền\.|
|`sync.carrier_error`|boolean|Không|Có lỗi đồng bộ NVC hay không\.|
|`sync.pending_or_unknown`|boolean|Không|Có xử lý đang chờ hoặc chưa xác định kết quả hay không\.|
|`sync.last_synced_from`|datetime|Không|Đồng bộ gần nhất từ thời điểm này\.|
|`sync.last_synced_to`|datetime|Không|Đồng bộ gần nhất đến thời điểm này\.|
|`anomalies.no_update_hours`|object|Không|Khoảng số giờ chưa có cập nhật mới; chỉ nội bộ được cấp quyền\.|
|`anomalies.status_mismatch`|boolean|Không|Trạng thái NVC và trạng thái chuẩn có dấu hiệu không khớp\.|
|`anomalies.pending_action_overdue`|boolean|Không|Tác vụ nghiệp vụ đang chờ quá thời hạn\.|

**Sắp xếp và phân trang**

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`sort_by`|integer|Không|`1` — thời điểm tạo; `2` — cập nhật gần nhất\. Mặc định `1`\.|
|`sort_direction`|integer|Không|`1` — mới nhất trước; `2` — cũ nhất trước\. Mặc định `1`\.|
|`page`|integer|Không|Số trang từ `1`; mặc định `1`\.|
|`page_size`|integer|Không|Số Order trên trang từ `1` đến `100`; mặc định `20`\.|

##### Ví dụ Request đầy đủ — Actor nội bộ

Ví dụ này sử dụng toàn bộ field lọc mà API hỗ trợ để thể hiện chính xác cấu trúc Request\. Khi sử dụng thực tế, Consumer chỉ gửi những điều kiện người dùng đã chọn; việc gửi quá nhiều điều kiện `AND` cùng lúc có thể làm kết quả rỗng\.

```JSON
{
  "basic": {
    "keyword": "GY8YLSDK",
    "shop_codes": ["S275518"],
    "order_statuses": ["SPF-0801"],
    "status_groups": [6],
    "carrier_codes": [1, 2],
    "source_codes": [3],
    "service_codes": ["STANDARD"],
    "pickup_methods": [1],
    "delivery_province_codes": ["79"],
    "delivery_district_codes": ["760"],
    "delivery_commune_codes": ["26734"],
    "attention_codes": [2, 4],
    "time_type": 8,
    "time_from": "2026-09-01T00:00:00+07:00",
    "time_to": "2026-09-16T23:59:59+07:00"
  },
  "time_ranges": [
    {
      "time_type": 2,
      "from": "2026-09-01T00:00:00+07:00",
      "to": "2026-09-16T23:59:59+07:00"
    }
  ],
  "identifiers": {
    "order_codes": ["9001156990401"],
    "socs": ["AB-16092026-001"],
    "carrier_waybill_codes": ["GY8YLSDK"],
    "client_codes": ["S275518"],
    "batch_codes": ["BAT-ORDER-20260916-0001"]
  },
  "receiver": {
    "names": ["Lê Phước Thắng"],
    "phones": ["0338488429"],
    "address_keyword": "99/1 Hàm Nghi"
  },
  "sender": {
    "warehouse_codes": ["KHO-Q8-01"],
    "names": ["Nguyễn Minh Hậu"],
    "phones": ["0399888077"],
    "address_keyword": "231/15 Dương Bá Trạc",
    "address_models": [1],
    "differs_from_default_warehouse": false
  },
  "stage_conditions": [
    {
      "leg_types": [2],
      "carrier_codes": [2],
      "mapped_statuses": ["SPF-0801"],
      "raw_statuses": ["DELIVERING"],
      "shipper_phones": ["0908123456"],
      "is_current": true,
      "updated_from": "2026-09-16T00:00:00+07:00",
      "updated_to": "2026-09-16T23:59:59+07:00"
    }
  ],
  "operations": {
    "pickup_results": [1],
    "handover_results": [1],
    "delivery_results": [2],
    "return_results": [1],
    "pickup_attempts": {
      "from": 1,
      "to": 2
    },
    "delivery_attempts": {
      "from": 1,
      "to": 3
    },
    "return_attempts": {
      "from": 0,
      "to": 1
    },
    "failure_reason_codes": ["RECEIVER_UNREACHABLE"],
    "has_retry_request": true,
    "has_cancel_request": false,
    "has_external_transfer": true,
    "has_partial_delivery": false,
    "has_exchange": false,
    "current_status_age_hours": {
      "from": 2,
      "to": 24
    }
  },
  "cancellation": {
    "requested": false,
    "carrier_error": false,
    "rejected": false,
    "pending_or_unknown": false,
    "after_pickup": false
  },
  "return_flow": {
    "has_return": false,
    "confirmed": false,
    "pickup_failed": false,
    "picked_up": false,
    "missing_waybill": false
  },
  "return_final": {
    "handover_failed": false,
    "delivery_failed": false,
    "retry_requested": false,
    "attempts": {
      "from": 0,
      "to": 1
    }
  },
  "waybill": {
    "has_active_waybill": true,
    "creation_results": [1],
    "has_multiple_waybills": true
  },
  "label": {
    "printed": true,
    "reprinted": false,
    "print_count": {
      "from": 1,
      "to": 2
    },
    "printed_from": "2026-09-01T00:00:00+07:00",
    "printed_to": "2026-09-16T23:59:59+07:00",
    "has_error": false
  },
  "cod": {
    "has_cod": true,
    "amount": {
      "from": 100000,
      "to": 1000000
    },
    "changed": true,
    "change_failed": false,
    "actual_collected": {
      "from": 100000,
      "to": 1000000
    },
    "actual_differs_from_expected": false
  },
  "pricing_account_codes": ["PRICE-S275518-GHN"],
  "support": {
    "has_ticket": true,
    "ticket_types": [3],
    "ticket_statuses": [2],
    "assignee_codes": ["CSKH-HCM-01"],
    "overdue": false
  },
  "incident": {
    "exists": true,
    "types": [2],
    "carrier_codes": [2],
    "leg_types": [2]
  },
  "claim": {
    "exists": false,
    "statuses": [1],
    "compensated": false
  },
  "sync": {
    "source_results": [1],
    "carrier_error": false,
    "pending_or_unknown": false,
    "last_synced_from": "2026-09-16T00:00:00+07:00",
    "last_synced_to": "2026-09-16T23:59:59+07:00"
  },
  "anomalies": {
    "no_update_hours": {
      "from": 2,
      "to": 24
    },
    "status_mismatch": false,
    "pending_action_overdue": false
  },
  "sort_by": 2,
  "sort_direction": 1,
  "page": 1,
  "page_size": 20
}
```

#### Response


|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`error`|boolean|Có|`false` khi API xử lý thành công\.|
|`message`|string|Có|Thông báo kết quả bằng tiếng Việt\.|
|`data`|object|Có|Kết quả lọc Đơn hàng\.|
|`data.items`|array\(object\)|Có|Danh sách Order phù hợp toàn bộ điều kiện lọc và Data Scope; trả `[]` khi không có kết quả\.|
|`data.items[].order_code`|string|Có|Mã Order SuperPlatform\.|
|`data.items[].soc`|string/null|Có|Mã đơn Shop/Hệ thống nguồn; `null` nếu không có\.|
|`data.items[].shop`|object|Có điều kiện|Thông tin Shop sở hữu Order; chỉ trả khi người gọi được phép xem\.|
|`data.items[].shop.shop_code`|string|Có điều kiện|Mã Shop\.|
|`data.items[].shop.shop_name`|string|Có điều kiện|Tên Shop\.|
|`data.items[].source`|object|Có|Nguồn tạo Order dùng để hiển thị nhanh\.|
|`data.items[].source.channel_code`|integer|Có|Kênh tạo: `1` — Web; `2` — Mobile; `3` — API; `4` — tạo loạt; `5` — nội bộ; `6` — hệ thống\.|
|`data.items[].source.channel_name`|string|Có|Tên kênh tạo bằng tiếng Việt\.|
|`data.items[].pickup`|object|Có|Điểm lấy và lịch lấy đã áp dụng cho Order\.|
|`data.items[].pickup.point_code`|string|Không|Mã điểm lấy theo cùng quy ước `pickup.point_code` của API tạo Order; bỏ trường nếu Order dùng địa chỉ lấy nhập trực tiếp\.|
|`data.items[].pickup.point_name`|string|Có|Tên Kho hoặc tên điểm lấy\.|
|`data.items[].pickup.full_address`|string|Có|Địa chỉ lấy đầy đủ đã lưu trên Order\.|
|`data.items[].pickup.scheduled_from`|datetime|Không|Thời điểm bắt đầu khung lấy hàng dự kiến; bỏ trường nếu Order không hẹn lịch lấy\.|
|`data.items[].pickup.scheduled_to`|datetime|Không|Thời điểm kết thúc khung lấy hàng dự kiến; phải không nhỏ hơn `scheduled_from` và bỏ trường nếu Order không hẹn lịch lấy\.|
|`data.items[].receiver`|object|Có|Thông tin người nhận dùng cho danh sách\.|
|`data.items[].receiver.name`|string|Có|Tên người nhận theo quyền hiển thị\.|
|`data.items[].receiver.phone`|string|Có|SĐT đầy đủ hoặc đã masking theo quyền Actor\.|
|`data.items[].receiver.full_address`|string|Có|Địa chỉ nhận đầy đủ đã chuẩn hóa; có thể được che một phần theo quyền\.|
|`data.items[].parcel`|object|Có|Thông tin hàng hóa tóm tắt\.|
|`data.items[].parcel.product_name`|string/null|Có|Tên hàng hóa/sản phẩm khi Order dùng `content_type = 1`; trả `null` khi Order khai báo danh sách sản phẩm bằng `content_type = 2`\.|
|`data.items[].parcel.weight`|integer|Có|Khối lượng khai báo, gram\.|
|`data.items[].cod_amount`|integer|Có|COD yêu cầu thu, VND\.|
|`data.items[].collection_amount`|integer|Có|Số tiền dự kiến cần thu của người nhận, VND\.|
|`data.items[].pricing`|object|Có|Thông tin giá tóm tắt đã áp dụng cho Order\.|
|`data.items[].pricing.pricing_code`|string|Có|Mã phương án/bảng giá đã áp dụng\.|
|`data.items[].pricing.shipping_fee`|integer|Có|Tổng phí vận chuyển bán cho Shop, VND\.|
|`data.items[].order_status`|string|Có|Mã trạng thái chuẩn SuperPlatform hiện tại\.|
|`data.items[].status_name`|string|Có|Tên trạng thái hiện tại dùng để hiển thị\.|
|`data.items[].shipping_stages`|array\(object\)|Có|Tóm tắt các Chặng đã phát sinh; trả `[]` khi chưa có\.|
|`data.items[].shipping_stages[].leg_type`|integer|Có theo phần tử|`1` — Lấy; `2` — Giao; `3` — Hoàn; `4` — Trả cuối\.|
|`data.items[].shipping_stages[].carrier_code`|integer/null|Có theo phần tử|Mã số NVC thực hiện Chặng; `null` khi chưa xác định\.|
|`data.items[].shipping_stages[].carrier_name`|string/null|Có theo phần tử|Tên NVC hiển thị\.|
|`data.items[].shipping_stages[].carrier_client_code`|string|Có theo phần tử|Mã khách hàng/tài khoản được sử dụng để tạo vận đơn tại NVC của riêng chặng này\. Không phải `source.client_code` của ứng dụng tạo Order\.|
|`data.items[].shipping_stages[].carrier_waybill_code`|string/null|Có theo phần tử|Carrier Waybill của Chặng khi đã có\.|
|`data.items[].shipping_stages[].status_code`|string|Có theo phần tử|Mã trạng thái chặng đã chuẩn hóa của SuperPlatform\.|
|`data.items[].shipping_stages[].status_name`|string|Có theo phần tử|Tên trạng thái chặng dùng để hiển thị\.|
|`data.items[].shipping_stages[].is_current`|boolean|Có theo phần tử|`true` khi đây là chặng đang thực hiện\.|
|`data.items[].flags`|array\(integer\)|Có|Các cờ tóm tắt được phép hiển thị; trả `[]` khi không có\.|
|`data.items[].created_at`|datetime|Có|Thời điểm tạo Order\.|
|`data.items[].updated_at`|datetime|Có|Thời điểm cập nhật gần nhất của Order\.|
|`data.meta`|object|Có|Thông tin phân trang\.|
|`data.meta.page`|integer|Có|Trang hiện tại\.|
|`data.meta.page_size`|integer|Có|Kích thước trang\.|
|`data.meta.total_items`|integer|Có|Tổng số Order phù hợp với điều kiện\.|
|`data.meta.total_pages`|integer|Có|Tổng số trang\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Lọc Đơn hàng thành công.",
  "data": {
    "items": [
      {
        "order_code": "9001156990401",
        "soc": "AB-16092026-001",
        "shop": {
          "shop_code": "S275518",
          "shop_name": "AB Shop"
        },
        "source": {
          "channel_code": 3,
          "channel_name": "API"
        },
        "pickup": {
          "point_code": "KHO-Q8-01",
          "point_name": "Kho AB Shop Quận 8",
          "full_address": "231/15 Dương Bá Trạc, Phường Chánh Hưng, Thành phố Hồ Chí Minh",
          "scheduled_from": "2026-09-16T13:00:00+07:00",
          "scheduled_to": "2026-09-16T17:00:00+07:00"
        },
        "receiver": {
          "name": "Lê Phước Thắng",
          "phone": "0338488429",
          "full_address": "99/1 Hàm Nghi, Phường Bình Định, Tỉnh Gia Lai"
        },
        "parcel": {
          "product_name": "Máy ép chậm hoa quả",
          "weight": 2500
        },
        "cod_amount": 200000,
        "collection_amount": 219000,
        "pricing": {
          "pricing_code": "PRC-S275518-GHN-202609",
          "shipping_fee": 19000
        },
        "order_status": "SPF-0801",
        "status_name": "Đang giao hàng",
        "shipping_stages": [
          {
            "leg_type": 1,
            "carrier_code": 1,
            "carrier_name": "SuperShip",
            "carrier_client_code": "S275518",
            "carrier_waybill_code": "STGS983262LM.826941741",
            "status_code": "SPF-0501",
            "status_name": "Đã lấy hàng",
            "is_current": false
          },
          {
            "leg_type": 2,
            "carrier_code": 2,
            "carrier_name": "Giao Hàng Nhanh",
            "carrier_client_code": "R9012150",
            "carrier_waybill_code": "GY8YLSDK",
            "status_code": "SPF-0801",
            "status_name": "Đang giao hàng",
            "is_current": true
          }
        ],
        "flags": [],
        "created_at": "2026-09-14T10:00:00+07:00",
        "updated_at": "2026-09-15T07:30:00+07:00"
      }
    ],
    "meta": {
      "page": 1,
      "page_size": 20,
      "total_items": 1,
      "total_pages": 1
    }
  }
}
```


#### Error

|**HTTP Status**|**Error Code**|**Khi nào xảy ra**|
|---|---|---|
|`400 Bad Request`|`INVALID_ORDER_FILTER`|Cấu trúc, kiểu dữ liệu, khoảng giá trị hoặc tổ hợp điều kiện không hợp lệ\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_FILTER_FORBIDDEN`|Người gọi sử dụng nhóm hoặc field lọc không được cấp quyền\.|
|`503 Service Unavailable`|`ORDER_FILTER_UNAVAILABLE`|Tạm thời không thể lọc Đơn hàng\.|

### 4\.1\.6\. Lấy chi tiết Đơn hàng

Lấy thông tin hiện tại của một Order để dựng màn hình chi tiết cho Shop hoặc nhân viên nội bộ\. Hai đối tượng dùng chung endpoint; Backend căn cứ Access Context, quyền và Data Scope để trả đúng mức dữ liệu\. Shop chỉ xem dữ liệu thuộc Order của mình; nội bộ có thể xem thêm nguồn tạo và ngữ cảnh vận hành khi có quyền\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/orders/{order_code}`|
|Thành công|`200 OK`|
|Quyền truy cập|Shop sở hữu Order hoặc Actor nội bộ/đối tác có quyền và Data Scope hợp lệ\.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định Actor, quyền và Data Scope được phép xem Order\.|
|`X-Correlation-Id`|Không|Mã truy vết do client truyền; Backend tự tạo nếu không có\.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order SuperPlatform gồm đúng 13 chữ số; ví dụ `9001156990401`\. Không dùng ID database hoặc mã vận đơn NVC thay thế\.|

##### Ví dụ cURL

```Bash
curl --request GET '{{base_url}}/v1/orders/9001156990401' \
  --header 'Authorization: Bearer {{access_token}}' \
  --header 'X-Correlation-Id: req-20260914-000001'
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|Thành công trả `false`\.|
|`message`|string|Có|Thông báo kết quả bằng tiếng Việt\.|
|`data`|object|Có|Thông tin chi tiết của đúng một Order\.|
|`data.order_code`|string|Có|Mã Order SuperPlatform gồm đúng 13 chữ số\.|
|`data.soc`|string|Không|Mã đơn riêng của Shop; bỏ trường nếu Shop không cung cấp\.|
|`data.order_status`|string|Có|Mã trạng thái Order thuộc danh mục trạng thái SuperPlatform\.|
|`data.status_name`|string|Có|Tên tiếng Việt chính thức tương ứng với `order_status`\.|
|`data.delivery_result`|integer|Có|Kết quả giao: `0` — chưa có kết quả cuối; `1` — giao toàn bộ; `2` — giao một phần; `3` — giao thất bại\.|
|`data.exchange_result`|integer|Có|Kết quả đổi/lấy hàng: `0` — không áp dụng hoặc chưa có kết quả; `1` — thành công; `2` — một phần; `3` — thất bại\.|
|`data.source`|object|Có|Nguồn phát sinh Order đã được lưu tại thời điểm tạo\.|
|`data.source.application_code`|string|Có|Mã ứng dụng tạo Order, ví dụ `SUPERSHIP` hoặc `SUPERAI`\.|
|`data.source.client_code`|string|Có|Mã Client đã gửi request tạo Order\.|
|`data.source.channel_code`|integer|Có|`1` — Web; `2` — Mobile; `3` — API; `4` — tạo loạt; `5` — nội bộ; `6` — hệ thống\.|
|`data.source.channel_name`|string|Có|Tên kênh tạo bằng tiếng Việt\.|
|`data.shop`|object|Có|Shop sở hữu Order\. Shop xem thông tin của chính mình; nội bộ dùng để nhận diện và hỗ trợ đúng Shop\.|
|`data.shop.shop_code`|string|Có điều kiện|Bắt buộc xuất hiện trong `data.shop`; là mã nghiệp vụ của Shop\.|
|`data.shop.shop_name`|string|Có điều kiện|Bắt buộc xuất hiện trong `data.shop`; là tên Shop tại thời điểm tra cứu\.|
|`data.sender`|object|Có|Thông tin người gửi/điểm lấy đã lưu trên Order\.|
|`data.sender.name`|string|Có điều kiện|Bắt buộc xuất hiện trong `data.sender`; là tên điểm gửi hoặc Kho\.|
|`data.sender.point_code`|string|Không|Mã điểm lấy gốc theo cùng quy ước `pickup.point_code` của API tạo Order; bỏ trường nếu dùng địa chỉ nhập trực tiếp\.|
|`data.sender.contact_name`|string|Không|Người liên hệ tại điểm gửi; bỏ trường nếu không có dữ liệu\.|
|`data.sender.phone`|string|Có điều kiện|Bắt buộc xuất hiện trong `data.sender`; được trả đầy đủ hoặc che bớt theo quyền xem\.|
|`data.sender.address`|object|Có điều kiện|Bắt buộc xuất hiện trong `data.sender`; là địa chỉ lấy hàng đã lưu trên Order\.|
|`data.sender.address.model`|integer|Có điều kiện|Bắt buộc khi có `data.sender.address`: `1` — hành chính ba cấp cũ; `2` — hành chính hai cấp mới\.|
|`data.sender.address.detail`|string|Có điều kiện|Bắt buộc khi có `data.sender.address`; là số nhà, tên đường hoặc tên Kho\.|
|`data.sender.address.full_address`|string|Có điều kiện|Bắt buộc khi có `data.sender.address`; là địa chỉ lấy đầy đủ do Address Module chuẩn hóa và ghép để hiển thị\.|
|`data.sender.address.province_code`|string|Có điều kiện|Bắt buộc khi có `data.sender.address`; là mã Tỉnh/Thành phố\.|
|`data.sender.address.district_code`|string|Có điều kiện|Bắt buộc khi `model = 1`; bỏ trường khi `model = 2`\.|
|`data.sender.address.commune_code`|string|Có điều kiện|Bắt buộc khi có `data.sender.address`; là mã Phường/Xã\.|
|`data.receiver`|object|Có|Thông tin người nhận đã lưu trên Order\.|
|`data.receiver.name`|string|Có điều kiện|Bắt buộc xuất hiện trong `data.receiver`; là tên người nhận\.|
|`data.receiver.phone`|string|Có điều kiện|Bắt buộc xuất hiện trong `data.receiver`; được trả đầy đủ hoặc che bớt theo quyền xem\.|
|`data.receiver.email`|string|Không|Email người nhận; bỏ trường nếu không được cung cấp hoặc người gọi không có quyền xem\.|
|`data.receiver.address`|object|Có điều kiện|Bắt buộc xuất hiện trong `data.receiver`; là địa chỉ giao hàng đã lưu trên Order\.|
|`data.receiver.address.model`|integer|Có điều kiện|Bắt buộc khi có `data.receiver.address`: `1` — hành chính ba cấp cũ; `2` — hành chính hai cấp mới\.|
|`data.receiver.address.detail`|string|Có điều kiện|Bắt buộc khi có `data.receiver.address`; là địa chỉ chi tiết\.|
|`data.receiver.address.full_address`|string|Có điều kiện|Bắt buộc khi có `data.receiver.address`; là địa chỉ nhận đầy đủ do Address Module chuẩn hóa và ghép để hiển thị\.|
|`data.receiver.address.province_code`|string|Có điều kiện|Bắt buộc khi có `data.receiver.address`; là mã Tỉnh/Thành phố\.|
|`data.receiver.address.district_code`|string|Có điều kiện|Bắt buộc khi `model = 1`; bỏ trường khi `model = 2`\.|
|`data.receiver.address.commune_code`|string|Có điều kiện|Bắt buộc khi có `data.receiver.address`; là mã Phường/Xã\.|
|`data.parcel`|object|Có|Thông tin kiện hàng đã lưu trên Order\. Các trường con được mô tả đầy đủ ngay bên dưới\.|
|`data.parcel.content_type`|integer|Có điều kiện|Bắt buộc trong `data.parcel`: `1` — một tên hàng; `2` — danh sách sản phẩm\.|
|`data.parcel.product_name`|string|Có điều kiện|Bắt buộc khi `content_type = 1`; bỏ trường khi `content_type = 2`\.|
|`data.parcel.products`|array\(object\)|Có điều kiện|Bắt buộc và có ít nhất một phần tử khi `content_type = 2`; bỏ trường khi `content_type = 1`\.|
|`data.parcel.products[].sku`|string|Không|SKU của Shop; bỏ trường trong phần tử không có SKU\.|
|`data.parcel.products[].name`|string|Có điều kiện|Bắt buộc trong mỗi phần tử của `products`\.|
|`data.parcel.products[].unit_price`|integer|Không|Giá một đơn vị, VND; bỏ trường nếu không khai báo theo sản phẩm\.|
|`data.parcel.products[].unit_weight`|integer|Không|Khối lượng một đơn vị, gram; bỏ trường nếu không khai báo theo sản phẩm\.|
|`data.parcel.products[].quantity`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử của `products`; là số nguyên từ `1` trở lên\.|
|`data.parcel.weight`|integer|Có điều kiện|Bắt buộc trong `data.parcel`; là tổng khối lượng kiện, đơn vị gram\.|
|`data.parcel.dimensions`|object|Không|Kích thước centimet; nếu xuất hiện phải có đủ `length`, `width`, `height`\.|
|`data.parcel.dimensions.length`|number|Có điều kiện|Bắt buộc khi có `dimensions`; là chiều dài centimet\.|
|`data.parcel.dimensions.width`|number|Có điều kiện|Bắt buộc khi có `dimensions`; là chiều rộng centimet\.|
|`data.parcel.dimensions.height`|number|Có điều kiện|Bắt buộc khi có `dimensions`; là chiều cao centimet\.|
|`data.parcel.declared_value`|integer|Có điều kiện|Bắt buộc trong `data.parcel`; là giá trị khai báo, đơn vị VND\.|
|`data.parcel.tags`|array\(integer\)|Có điều kiện|Bắt buộc trong `data.parcel`; trả `[]` nếu không có\. Giá trị: `1` — hàng dễ vỡ; `2` — chất lỏng; `3` — hàng giá trị cao; `4` — hàng có pin; `5` — hàng cồng kềnh\.|
|`data.cod_amount`|integer|Có|Số COD yêu cầu thu, đơn vị VND\.|
|`data.collection_amount`|integer|Có|Tổng số tiền dự kiến thu trực tiếp từ người nhận\.|
|`data.fee_payer`|integer|Có|Người trả phí: `1` — Shop/người gửi; `2` — người nhận\.|
|`data.pricing`|object|Có|Thông tin tham chiếu tới mã giá đã áp dụng cho Order\.|
|`data.pricing.pricing_code`|string|Có|Mã bảng giá/phương án giá đã áp dụng\.|
|`data.fee_items`|array\(object\)|Có|Chi tiết các khoản phí; trả `[]` nếu chưa có phí\.|
|`data.fee_items[].fee_type`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; ví dụ `SHIPPING`, `INSURANCE`\.|
|`data.fee_items[].fee_name`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; là tên phí tiếng Việt\.|
|`data.fee_items[].amount`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử; là số tiền VND từ `0` trở lên\.|
|`data.inspection`|integer|Có|Quyền kiểm hàng: `1` — không xem; `2` — xem nhưng không thử; `3` — được thử nếu dịch vụ hỗ trợ\.|
|`data.pickup_method`|integer|Có|Phương thức gửi: `1` — NVC đến lấy; `2` — Shop gửi tại điểm tiếp nhận\.|
|`data.services`|array\(integer\)|Có|Dịch vụ bổ sung: `1` — giao một phần; `2` — giao hàng mới kết hợp thu hồi hàng cũ; trả `[]` nếu không dùng\.|
|`data.delivery_note`|string|Không|Hướng dẫn giao hàng; bỏ trường nếu không có\.|
|`data.images`|array\(object\)|Có|Ảnh Shop và NVC đã gắn với Order mà người gọi được phép xem; trả `[]` nếu không có\.|
|`data.images[].image_code`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; là mã ảnh từ File Service\.|
|`data.images[].image_type`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử: `1` — ảnh hàng hóa của Shop; `2` — bằng chứng lấy; `3` — bằng chứng giao; `4` — bằng chứng hoàn/trả\.|
|`data.images[].url`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; là URL xem ảnh có thời hạn và đúng quyền\.|
|`data.current_stage`|object|Không|Chặng đang được thực hiện tại thời điểm lấy chi tiết Order; bỏ trường nếu Order chưa bắt đầu vận chuyển hoặc đã kết thúc toàn bộ hành trình\.|
|`data.current_stage.stage_no`|integer|Có điều kiện|Bắt buộc khi có `current_stage`; là số thứ tự chặng, bắt đầu từ `1`\.|
|`data.current_stage.leg_type`|integer|Có điều kiện|Bắt buộc khi có `current_stage`: `1` — lấy; `2` — giao; `3` — hoàn; `4` — trả cuối\.|
|`data.current_stage.leg_name`|string|Có điều kiện|Bắt buộc khi có `current_stage`; là tên tiếng Việt dễ hiểu của chặng hiện tại\.|
|`data.shipping_stages`|array\(object\)|Có|Snapshot trạng thái hiện tại của toàn bộ chặng theo đúng thứ tự thực hiện; trả `[]` khi chưa hình thành chặng\. Lịch sử đầy đủ của từng chặng lấy qua API `/v1/orders/{order_code}/tracking`\.|
|`data.shipping_stages[].stage_no`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử; là số thứ tự chặng, bắt đầu từ `1` và không trùng trong cùng Order\.|
|`data.shipping_stages[].leg_type`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử: `1` — lấy; `2` — giao; `3` — hoàn; `4` — trả cuối\.|
|`data.shipping_stages[].leg_name`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; là tên tiếng Việt của chặng\.|
|`data.shipping_stages[].is_current`|boolean|Có điều kiện|Bắt buộc trong mỗi phần tử; `true` khi đây là chặng đang thực hiện, ngược lại là `false`\. Tại một thời điểm chỉ tối đa một chặng có giá trị `true`\.|
|`data.shipping_stages[].carrier_code`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử khi đã xác định NVC\.|
|`data.shipping_stages[].carrier_name`|string|Có điều kiện|Bắt buộc trong mỗi phần tử khi đã xác định NVC\.|
|`data.shipping_stages[].carrier_client_code`|string|Có điều kiện|Bắt buộc khi chặng được tạo bằng một tài khoản khách hàng tại NVC; là mã khách hàng/tài khoản NVC đã thực sự áp dụng cho chặng\. Không phải `data.source.client_code`\.|
|`data.shipping_stages[].carrier_waybill_code`|string|Có điều kiện|Bắt buộc khi NVC đã cấp vận đơn; bỏ trường khi chưa được cấp\.|
|`data.shipping_stages[].carrier_sorting_code`|string|Không|Mã chia chọn nguyên bản của NVC; bỏ trường nếu NVC không cung cấp\.|
|`data.shipping_stages[].carrier_status`|object|Có điều kiện|Bắt buộc khi NVC đã trả trạng thái; là trạng thái nguyên bản của riêng NVC, giúp Shop và hệ thống tích hợp đối chiếu đúng hành trình\.|
|`data.shipping_stages[].carrier_status.code`|string|Có điều kiện|Bắt buộc khi có `carrier_status`; giữ nguyên mã trạng thái do NVC cung cấp, không đổi sang mã SuperPlatform\.|
|`data.shipping_stages[].carrier_status.name`|string|Có điều kiện|Bắt buộc khi có `carrier_status`; là tên tiếng Việt tương ứng với trạng thái nguyên bản của NVC\.|
|`data.shipping_stages[].mapped_status`|object|Có điều kiện|Bắt buộc trong mỗi phần tử khi chặng đã có trạng thái; là trạng thái chuẩn của SuperPlatform sau khi ánh xạ từ trạng thái NVC hoặc sự kiện nội bộ\. Consumer nên dùng trạng thái này để xây giao diện thống nhất giữa các NVC\.|
|`data.shipping_stages[].mapped_status.code`|string|Có điều kiện|Bắt buộc khi có `mapped_status`; là mã trạng thái chuẩn thuộc danh mục SuperPlatform\.|
|`data.shipping_stages[].mapped_status.name`|string|Có điều kiện|Bắt buộc khi có `mapped_status`; là tên tiếng Việt chính thức tương ứng với mã trạng thái chuẩn\.|
|`data.shipping_stages[].status_updated_at`|datetime|Có điều kiện|Bắt buộc khi chặng đã có trạng thái; là thời điểm trạng thái hiện tại của chặng được ghi nhận, theo ISO 8601 có múi giờ\.|
|`data.shipping_stages[].driver`|object|Không|Tài xế/người thực hiện hiện tại do NVC cung cấp và người gọi được phép xem; bỏ trường khi chưa có tài xế hoặc NVC không cung cấp\.|
|`data.shipping_stages[].driver.name`|string|Có điều kiện|Bắt buộc khi có `driver`; là tên tài xế/người thực hiện\.|
|`data.shipping_stages[].driver.phone`|string|Không|Số điện thoại tài xế, được trả đầy đủ hoặc che bớt theo quyền và chính sách NVC\.|
|`data.shipping_stages[].driver.avatar_url`|string|Không|URL ảnh đại diện có thời hạn; bỏ trường khi không có ảnh\.|
|`data.shipping_stages[].driver.vehicle_type`|string|Không|Loại phương tiện do NVC cung cấp, ví dụ `Xe máy` hoặc `Ô tô`\.|
|`data.shipping_stages[].driver.license_plate`|string|Không|Biển số phương tiện; bỏ trường khi NVC không cung cấp hoặc người gọi không có quyền xem\.|
|`data.current_location`|object|Không|Vị trí gần nhất của kiện hàng được xác định từ tracking NVC hoặc sự kiện kho đã xác nhận; bỏ object nếu chưa có dữ liệu vị trí đáng tin cậy\. Không tự tạo mô tả như “đang trên phương tiện”\.|
|`data.current_location.province_code`|string|Không|Mã Tỉnh/Thành hiện tại đã đối chiếu với Address Module; bỏ trường nếu NVC chỉ cung cấp tên hoặc chưa xác định được mã\.|
|`data.current_location.province_name`|string|Không|Tên Tỉnh/Thành hiện tại do NVC/sự kiện kho cung cấp và hệ thống ghi nhận\.|
|`data.current_location.district_code`|string|Không|Mã Quận/Huyện hiện tại đối với dữ liệu hành chính ba cấp; bỏ trường với địa chỉ hai cấp hoặc khi không xác định được\.|
|`data.current_location.district_name`|string|Không|Tên Quận/Huyện hiện tại; bỏ trường khi không có dữ liệu\.|
|`data.current_location.commune_code`|string|Không|Mã Phường/Xã hiện tại đã đối chiếu; không dùng `ward_code`\.|
|`data.current_location.commune_name`|string|Không|Tên Phường/Xã hiện tại; bỏ trường khi NVC không cung cấp hoặc không xác định được\.|
|`data.current_location.post_office_code`|string|Không|Mã bưu cục/Hub/điểm khai thác hiện đang giữ hoặc vừa xử lý kiện; bỏ trường nếu NVC không cung cấp mã\.|
|`data.current_location.post_office_name`|string|Không|Tên bưu cục/Hub/điểm khai thác hiện tại; bỏ trường nếu kiện không ở một điểm NVC xác định\.|
|`data.current_location.recorded_at`|datetime|Có điều kiện|Bắt buộc khi có `current_location`; là thời điểm vị trí được NVC hoặc sự kiện kho ghi nhận, theo ISO 8601 có múi giờ\.|
|`data.internal_context`|object|Có điều kiện|Chỉ trả khi Actor là nhân viên nội bộ và có quyền xem dữ liệu nguồn tạo\. Shop và đối tác không nhận object này\.|
|`data.internal_context.customer_type`|integer|Có điều kiện|Bắt buộc khi có `internal_context`: `1` — địa phương cũ; `2` — địa phương mới; `3` — toàn quốc; `4` — SuperAI\.|
|`data.internal_context.created_application`|string|Có điều kiện|Bắt buộc khi có `internal_context`; là ứng dụng phát sinh Order\.|
|`data.internal_context.created_client`|string|Có điều kiện|Bắt buộc khi có `internal_context`; là Web, Mobile, Partner API hoặc Backend Service đã tạo Order\.|
|`data.internal_context.operations`|object|Có điều kiện|Bắt buộc với nhân viên nội bộ có quyền vận hành; Shop và đối tác không nhận object này\.|
|`data.internal_context.operations.custody_holder_type`|integer|Có điều kiện|Bắt buộc khi có `operations`: `1` — Shop; `2` — SuperShip; `3` — NVC khác; `4` — Người nhận; `5` — chưa xác định\.|
|`data.internal_context.operations.custody_carrier_code`|integer|Không|Mã NVC đang giữ hàng; chỉ trả khi `custody_holder_type = 2` hoặc `3`\.|
|`data.internal_context.operations.carrier_sync_status`|integer|Có điều kiện|Bắt buộc khi có `operations`: `1` — đã đồng bộ; `2` — đang chờ đồng bộ; `3` — đồng bộ lỗi; `4` — chưa xác định kết quả\.|
|`data.internal_context.operations.last_carrier_synced_at`|datetime|Không|Thời điểm gần nhất đồng bộ thành công với NVC; bỏ trường nếu chưa từng đồng bộ thành công\.|
|`data.internal_context.operations.requires_action`|boolean|Có điều kiện|Bắt buộc khi có `operations`; cho biết Order hiện có cần nhân viên nội bộ xử lý hay không\.|
|`data.created_at`|datetime|Có|Thời điểm tạo Order theo ISO 8601 có múi giờ\.|
|`data.updated_at`|datetime|Có|Thời điểm cập nhật gần nhất theo ISO 8601 có múi giờ\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Lấy thông tin Đơn hàng thành công.",
  "data": {
    "order_code": "9001156990401",
    "soc": "SHOP-UC04-001",
    "order_status": "SPF-0801",
    "status_name": "Đang giao hàng",
    "delivery_result": 0,
    "exchange_result": 0,
    "source": {
      "application_code": "SUPERSHIP",
      "client_code": "supership-partner-api",
      "channel_code": 3,
      "channel_name": "API"
    },
    "shop": {
      "shop_code": "S983262",
      "shop_name": "Shop Minh Hậu"
    },
    "sender": {
      "name": "Kho Shop Minh Hậu",
      "point_code": "KHO-Q7-02",
      "contact_name": "Lê Minh Hậu",
      "phone": "0903123554",
      "address": {
        "model": 1,
        "detail": "25 Đường Số 8",
        "full_address": "25 Đường Số 8, Phường Tân Quy, Quận 7, Thành phố Hồ Chí Minh",
        "province_code": "79",
        "district_code": "778",
        "commune_code": "26740"
      }
    },
    "receiver": {
      "name": "Nguyễn Minh Anh",
      "phone": "0948123404",
      "email": "nguyenminhanh@example.com",
      "address": {
        "model": 1,
        "detail": "120 Trần Hưng Đạo",
        "full_address": "120 Trần Hưng Đạo, Phường Cầu Ông Lãnh, Quận 1, Thành phố Hồ Chí Minh",
        "province_code": "79",
        "district_code": "760",
        "commune_code": "26734"
      }
    },
    "parcel": {
      "content_type": 2,
      "products": [
        {
          "sku": "SP-UC04-001",
          "name": "Máy ép chậm hoa quả",
          "unit_price": 1850000,
          "unit_weight": 2500,
          "quantity": 1
        }
      ],
      "weight": 2500,
      "dimensions": {
        "length": 35,
        "width": 25,
        "height": 30
      },
      "declared_value": 1850000,
      "tags": [
        3
      ]
    },
    "cod_amount": 200000,
    "collection_amount": 219000,
    "fee_payer": 2,
    "pricing": {
      "pricing_code": "PRC-S983262-GHN-202609"
    },
    "fee_items": [
      {
        "fee_type": "SHIPPING",
        "fee_name": "Phí vận chuyển",
        "amount": 19000
      },
      {
        "fee_type": "INSURANCE",
        "fee_name": "Phí bảo hiểm",
        "amount": 0
      }
    ],
    "inspection": 2,
    "pickup_method": 1,
    "services": [],
    "delivery_note": "Cho xem hàng trước khi thanh toán",
    "images": [
      {
        "image_code": "IMG-20260916-000001",
        "image_type": 1,
        "url": "https://files.superplatform.vn/orders/9001156990401/product-01.jpg"
      },
      {
        "image_code": "IMG-20260916-000002",
        "image_type": 2,
        "url": "https://files.superplatform.vn/orders/9001156990401/pickup-proof-01.jpg"
      }
    ],
    "current_stage": {
      "stage_no": 2,
      "leg_type": 2,
      "leg_name": "Giao hàng"
    },
    "shipping_stages": [
      {
        "stage_no": 1,
        "leg_type": 1,
        "leg_name": "Lấy hàng",
        "is_current": false,
        "carrier_code": 1,
        "carrier_name": "SuperShip",
        "carrier_client_code": "S983262",
        "carrier_waybill_code": "STGS983262LM.826941741",
        "carrier_status": {
          "code": "SPS-201",
          "name": "Lấy hàng thành công"
        },
        "mapped_status": {
          "code": "SPF-0501",
          "name": "Đã lấy hàng"
        },
        "status_updated_at": "2026-09-16T10:05:00+07:00"
      },
      {
        "stage_no": 2,
        "leg_type": 2,
        "leg_name": "Giao hàng",
        "is_current": true,
        "carrier_code": 2,
        "carrier_name": "Giao Hàng Nhanh",
        "carrier_client_code": "R9012150",
        "carrier_waybill_code": "GY8YLSDK",
        "carrier_sorting_code": "100-A2-09-00",
        "carrier_status": {
          "code": "delivering",
          "name": "Đang giao hàng"
        },
        "mapped_status": {
          "code": "SPF-0801",
          "name": "Đang giao hàng"
        },
        "status_updated_at": "2026-09-16T14:05:00+07:00",
        "driver": {
          "name": "Trần Quốc Huy",
          "phone": "0908345672",
          "avatar_url": "https://files.superplatform.vn/drivers/ghn/driver-748219.jpg",
          "vehicle_type": "Xe máy",
          "license_plate": "59X3-284.16"
        }
      }
    ],
    "current_location": {
      "province_name": "Tỉnh Bình Định",
      "district_name": "Thị xã An Nhơn",
      "post_office_name": "Bưu cục phát hàng An Nhơn",
      "recorded_at": "2026-09-16T07:55:00+07:00"
    },
    "created_at": "2026-09-16T08:20:00+07:00",
    "updated_at": "2026-09-16T14:05:00+07:00"
  }
}
```

Với nhân viên nội bộ có quyền, cấu trúc Response giữ nguyên và bổ sung:

```JSON
{
  "internal_context": {
    "customer_type": 2,
    "created_application": "SUPERSHIP",
    "created_client": "supership-web",
    "operations": {
      "custody_holder_type": 3,
      "custody_carrier_code": 2,
      "carrier_sync_status": 1,
      "last_carrier_synced_at": "2026-09-16T14:05:03+07:00",
      "requires_action": false
    }
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`401 Unauthorized`|`UNAUTHENTICATED`|Thiếu hoặc Access Token không hợp lệ\.|
|`403 Forbidden`|`ORDER_VIEW_FORBIDDEN`|Actor không có quyền xem hoặc Order nằm ngoài Data Scope được cấp\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tồn tại Order tương ứng với `order_code` trong phạm vi người gọi được phép tra cứu\.|

### 4\.1\.7\. Lấy thao tác khả dụng của Đơn hàng

Trả danh sách chức năng người gọi được phép sử dụng trên một Order tại thời điểm kiểm tra\. API dùng chung cho Web/App SuperPlatform, hệ thống của Shop và nhân viên nội bộ; kết quả khác nhau theo quyền, Data Scope, trạng thái Order, trạng thái từng chặng, khả năng của NVC và cấu hình đang có hiệu lực\.

API này không trả `access_view` và không công khai cách Backend phân loại người gọi\. FE dùng kết quả để hiển thị, ẩn hoặc vô hiệu hóa nút\. Khi người dùng thực hiện thao tác thật, endpoint tương ứng vẫn kiểm tra lại quyền và điều kiện vì trạng thái Order có thể đã thay đổi sau lần kiểm tra này\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/orders/{order_code}/actions`|
|Thành công|`200 OK`|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định người gọi, quyền và Data Scope được phép truy cập.|
|`X-Correlation-Id`|Không|Mã truy vết do Consumer truyền; Backend tự tạo nếu không có.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order SuperPlatform gồm đúng 13 chữ số\.|

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|Thành công trả `false`\.|
|`message`|string|Có|Thông báo kết quả bằng tiếng Việt\.|
|`data`|object|Có|Kết quả đánh giá thao tác trên đúng một Order\.|
|`data.order_code`|string|Có|Mã Order đã được kiểm tra\.|
|`data.order_status`|string|Có|Trạng thái hiện tại của Order tại thời điểm đánh giá\.|
|`data.actions`|array\(object\)|Có|Các thao tác thuộc phạm vi quyền của người gọi; trả `[]` nếu người gọi được xem Order nhưng không có thao tác nào\. Hành động người gọi hoàn toàn không có quyền sử dụng sẽ không xuất hiện trong mảng\.|
|`data.actions[].action_code`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử\. Giá trị: `1` — cập nhật Order; `2` — hủy Order; `3` — thêm ảnh; `4` — xóa ảnh; `5` — in nhãn; `8` — xem tài xế; `9` — yêu cầu NVC thực hiện lại; `10` — đổi NVC\. Mã `9` và `10` chỉ trả cho nội bộ có quyền\.|
|`data.actions[].action_key`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; tên kỹ thuật ổn định giúp Developer đọc và ánh xạ chức năng, tương ứng: `UPDATE_ORDER`, `CANCEL_ORDER`, `ADD_IMAGE`, `DELETE_IMAGE`, `PRINT_LABEL`, `VIEW_SHIPPER`, `RETRY_OPERATION`, `CHANGE_CARRIER`\.|
|`data.actions[].name`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; tên tiếng Việt dùng để hiển thị\.|
|`data.actions[].enabled`|boolean|Có điều kiện|Bắt buộc trong mỗi phần tử; `true` khi có thể thực hiện tại thời điểm đánh giá, `false` khi người gọi có quyền sử dụng chức năng nhưng Order hiện chưa đủ điều kiện\.|
|`data.actions[].disabled_reason_code`|string|Không|Mã lý do ổn định để FE xử lý khi `enabled = false`; bỏ trường khi thao tác đang được phép\.|
|`data.actions[].disabled_reason`|string|Không|Lý do tiếng Việt để hiển thị khi `enabled = false`; bỏ trường khi thao tác đang được phép\.|
|`data.actions[].editable_fields`|array\(string\)|Không|Chỉ dùng cho `UPDATE_ORDER`; liệt kê đúng các JSON field path còn được sửa, ví dụ `receiver.phone` hoặc `delivery_note`\. Bỏ trường với thao tác khác hoặc khi không còn trường nào được sửa\.|
|`data.evaluated_at`|datetime|Có|Thời điểm Backend đánh giá danh sách thao tác, theo ISO 8601 có múi giờ\.|

##### Ví dụ Response — Shop

```JSON
{
  "error": false,
  "message": "Lấy thao tác Đơn hàng thành công.",
  "data": {
    "order_code": "9001156990401",
    "order_status": "SPF-0801",
    "actions": [
      {
        "action_code": 1,
        "action_key": "UPDATE_ORDER",
        "name": "Thay đổi thông tin",
        "enabled": true,
        "editable_fields": [
          "delivery_note"
        ]
      },
      {
        "action_code": 2,
        "action_key": "CANCEL_ORDER",
        "name": "Hủy đơn",
        "enabled": false,
        "disabled_reason_code": "ORDER_ALREADY_PICKED_UP",
        "disabled_reason": "Không thể hủy vì Nhà vận chuyển đã lấy hàng."
      },
      {
        "action_code": 3,
        "action_key": "ADD_IMAGE",
        "name": "Thêm ảnh",
        "enabled": true
      },
      {
        "action_code": 5,
        "action_key": "PRINT_LABEL",
        "name": "In nhãn",
        "enabled": true
      },
      {
        "action_code": 8,
        "action_key": "VIEW_SHIPPER",
        "name": "Xem tài xế",
        "enabled": true
      }
    ],
    "evaluated_at": "2026-09-16T14:06:00+07:00"
  }
}
```

Nhân viên nội bộ có quyền vận hành có thể nhận thêm `RETRY_OPERATION` hoặc `CHANGE_CARRIER`\. Shop và đối tác không có các quyền này sẽ không nhận hai hành động đó trong `actions`\.

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`401 Unauthorized`|`UNAUTHENTICATED`|Thiếu hoặc Access Token không hợp lệ\.|
|`403 Forbidden`|`ORDER_VIEW_FORBIDDEN`|Người gọi không có quyền xem Order hoặc Order nằm ngoài Data Scope\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tồn tại Order tương ứng trong phạm vi người gọi được phép tra cứu\.|

### 4\.1\.8\. Cập nhật thông tin Đơn hàng

Cập nhật trực tiếp dữ liệu đang thuộc quyền kiểm soát của Order và không cần NVC xác nhận\. `soc` được sửa khi người gọi có quyền và Order chưa kết thúc\. Các trường ảnh hưởng vận chuyển chỉ được sửa trực tiếp khi Order đang `SPF-0102 — Tạo đơn NVC lỗi` và chưa có Carrier Waybill hợp lệ; dữ liệu mới sẽ được dùng cho lần tạo lại vận đơn\.

Khi Order đã có Carrier Waybill, thao tác sửa trên giao diện phải tự động tạo Ticket tại Support Module\. Order giữ nguyên dữ liệu đang áp dụng trong thời gian xử lý\. Support Module phối hợp Carrier Module yêu cầu NVC thay đổi; chỉ khi NVC xác nhận thành công, Support Module mới gọi API nội bộ `/v1/orders/{order_code}/changes` để cập nhật Order\. Nếu NVC trả lỗi, Order không đổi nhưng Ticket vẫn được giữ cùng kết quả thất bại để Shop và CSKH tiếp tục theo dõi\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`PATCH`|
|Endpoint / Event|`/v1/orders/{order_code}`|
|Thành công|`200 OK`|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định Actor, quyền và Data Scope được phép chỉnh sửa Order\.|
|`Content-Type: application/json`|Có|Request Body sử dụng JSON\.|
|`Idempotency-Key`|Có|Chống áp dụng lặp cùng một lần cập nhật khi Consumer gửi lại request\. Cùng key và cùng payload trả lại cùng kết quả; cùng key nhưng khác payload trả `IDEMPOTENCY_CONFLICT`\.|
|`X-Correlation-Id`|Không|Mã truy vết do client truyền; Backend tự tạo nếu không có\.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order SuperPlatform cần chỉnh sửa; ví dụ: `9001156990401`\.|

##### Request Body

Body phải có ít nhất một field thực sự thay đổi\. Không gửi lại toàn bộ Order nếu chỉ sửa một phần dữ liệu\.

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`soc`|string/null|Không|Mã đơn riêng mới của Shop\. Đây là loại thay đổi `1 — Mã đơn của Shop` và không gửi sang NVC\. Truyền `null` để xóa khi Order chưa kết thúc và người gọi có quyền\.|
|`receiver`|object|Không|Thông tin người nhận mới\. Chỉ được sửa trực tiếp khi chưa có Carrier Waybill hợp lệ; tên, điện thoại và email thuộc loại thay đổi `2 — Người nhận`, còn địa chỉ thuộc loại `3 — Địa chỉ giao`\.|
|`receiver.name`|string|Không|Tên người nhận mới\. Bỏ trường nếu không thay đổi\.|
|`receiver.phone`|string|Không|Số điện thoại người nhận mới\. Bỏ trường nếu không thay đổi\.|
|`receiver.email`|string/null|Không|Email mới; truyền `null` để xóa email\.|
|`receiver.address`|object|Không|Địa chỉ giao mới\. Khi truyền phải gửi đủ `model`, `detail`, `province_code`, `commune_code` và `district_code` khi dùng mô hình ba cấp\.|
|`receiver.address.model`|integer|Có điều kiện|Bắt buộc khi có `receiver.address`: `1` — địa chỉ ba cấp; `2` — địa chỉ hai cấp\.|
|`receiver.address.detail`|string|Có điều kiện|Bắt buộc khi có `receiver.address`; là số nhà, tên đường và địa chỉ chi tiết\.|
|`receiver.address.province_code`|string|Có điều kiện|Bắt buộc khi có `receiver.address`; là mã Tỉnh/Thành phố\.|
|`receiver.address.district_code`|string|Có điều kiện|Bắt buộc khi `receiver.address.model = 1`; không truyền khi `model = 2`\.|
|`receiver.address.commune_code`|string|Có điều kiện|Bắt buộc khi có `receiver.address`; là mã Phường/Xã\. Không dùng `ward_code`\.|
|`parcel`|object|Không|Snapshot kiện hàng mới, thuộc loại thay đổi `4 — Hàng hóa` và/hoặc `5 — Khối lượng, kích thước`\. Chỉ được sửa trực tiếp khi chưa có Carrier Waybill hợp lệ; khi truyền phải gửi toàn bộ snapshot hợp lệ\.|
|`parcel.content_type`|integer|Có điều kiện|Bắt buộc khi có `parcel`: `1` — một tên hàng bằng `product_name`; `2` — danh sách sản phẩm bằng `products[]`\.|
|`parcel.product_name`|string|Có điều kiện|Bắt buộc khi `parcel.content_type = 1`; là tên hàng hóa/sản phẩm và không gửi khi `content_type = 2`\. Ví dụ: `Mỹ phẩm và phụ kiện`\.|
|`parcel.products`|array\(object\)|Có điều kiện|Bắt buộc và có ít nhất một phần tử khi `content_type = 2`; không gửi khi bằng `1`\.|
|`parcel.products[].sku`|string|Không|Mã/SKU; bỏ trường nếu Shop không quản lý SKU\.|
|`parcel.products[].name`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; là tên sản phẩm\.|
|`parcel.products[].unit_price`|integer|Không|Giá một đơn vị, VND; ví dụ: `1850000`\.|
|`parcel.products[].unit_weight`|integer|Không|Khối lượng một đơn vị, gram; ví dụ: `2500`\.|
|`parcel.products[].quantity`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử; là số nguyên từ `1` trở lên\.|
|`parcel.weight`|integer|Có điều kiện|Bắt buộc khi có `parcel`; là tổng khối lượng kiện bằng gram, số nguyên từ `1` trở lên\.|
|`parcel.dimensions`|object/null|Không|Kích thước mới, centimet; khi truyền object phải gửi đủ `length`, `width`, `height`; truyền `null` để bỏ kích thước khi được phép\.|
|`parcel.dimensions.length`|number|Có điều kiện|Bắt buộc khi có `dimensions`; là chiều dài centimet, lớn hơn `0`\.|
|`parcel.dimensions.width`|number|Có điều kiện|Bắt buộc khi có `dimensions`; là chiều rộng centimet, lớn hơn `0`\.|
|`parcel.dimensions.height`|number|Có điều kiện|Bắt buộc khi có `dimensions`; là chiều cao centimet, lớn hơn `0`\.|
|`parcel.declared_value`|integer|Có điều kiện|Bắt buộc khi có `parcel`; là trị giá khai báo bằng VND, số nguyên từ `0` trở lên\.|
|`parcel.tags`|array\(integer\)|Không|Đặc tính hàng hóa: `1` — dễ vỡ; `2` — chất lỏng; `3` — giá trị cao; `4` — có pin; `5` — cồng kềnh\. Dùng `[]` để bỏ toàn bộ đặc tính\.|
|`cod_amount`|integer|Không|COD mới, thuộc loại thay đổi `6 — Tiền thu hộ`; là số nguyên VND từ `0` trở lên\. Chỉ được sửa trực tiếp khi chưa có Carrier Waybill hợp lệ\.|
|`delivery_note`|string/null|Không|Hướng dẫn giao hàng mới, thuộc loại thay đổi `7 — Ghi chú giao hàng`, tối đa 120 ký tự; truyền `null` để xóa\. Chỉ được sửa trực tiếp khi chưa có Carrier Waybill hợp lệ\.|
|`inspection`|integer|Không|Quyền kiểm hàng mới, thuộc loại thay đổi `8 — Kiểm hàng`: `1` — không xem; `2` — xem nhưng không thử; `3` — được thử nếu dịch vụ hỗ trợ\. Chỉ được sửa trực tiếp khi chưa có Carrier Waybill hợp lệ\.|
|`fee_payer`|integer|Không|Người trả phí mới, thuộc loại thay đổi `9 — Người trả phí`: `1` — Shop/người gửi; `2` — người nhận\. Chỉ được sửa trực tiếp khi chưa có Carrier Waybill hợp lệ\.|
|`services`|array\(integer\)|Không|Dịch vụ bổ sung mới, thuộc loại thay đổi `10 — Dịch vụ bổ sung`: `1` — giao một phần; `2` — giao hàng mới kết hợp thu hồi hàng cũ\. Dùng `[]` để bỏ toàn bộ dịch vụ; chỉ được sửa trực tiếp khi chưa có Carrier Waybill hợp lệ\.|
|`reason`|string|Có|Lý do sửa trực tiếp, dùng để ghi lịch sử; không được để trống\.|

##### Ví dụ Request

```JSON
{
  "receiver": {
    "phone": "0908123456"
  },
  "delivery_note": "Gọi người nhận trước khi giao",
  "reason": "Shop nhập sai số điện thoại và thiếu ghi chú"
}
```

##### Ví dụ cURL

```Bash
curl --request PATCH '{{base_url}}/v1/orders/9001156990401' \
  --header 'Authorization: Bearer {{access_token}}' \
  --header 'Content-Type: application/json' \
  --header 'Idempotency-Key: upd-order-9001156990401-001' \
  --header 'X-Correlation-Id: req-20260914-000002' \
  --data '{"receiver":{"phone":"0908123456"},"delivery_note":"Gọi người nhận trước khi giao","reason":"Shop nhập sai số điện thoại và thiếu ghi chú"}'
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|Cho biết request có lỗi hay không\. Chỉnh sửa thành công luôn trả `false`; ví dụ: `false`\.|
|`message`|string|Có|Thông báo ngắn gọn để UI hiển thị; ví dụ: `Chỉnh sửa thông tin Đơn hàng thành công.`|
|`data`|object|Có|Kết quả cập nhật trực tiếp\. Không trả lại toàn bộ Order và không trả danh sách quyền thao tác\.|
|`data.order_code`|string|Có|Mã Order vừa được chỉnh sửa; ví dụ: `9001156990401`\.|
|`data.activity_code`|string|Có|Mã Activity ghi nhận lần cập nhật; dùng để đối chiếu lịch sử hành động của Order\.|
|`data.changed_fields`|array\(object\)|Có|Các field thực sự đã thay đổi sau khi chuẩn hóa; mỗi phần tử ghi rõ loại thay đổi và giá trị trước/sau\.|
|`data.changed_fields[].change_type`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử: `1` — mã đơn của Shop; `2` — người nhận; `3` — địa chỉ giao; `4` — hàng hóa; `5` — khối lượng/kích thước; `6` — COD; `7` — ghi chú giao; `8` — kiểm hàng; `9` — người trả phí; `10` — dịch vụ bổ sung\.|
|`data.changed_fields[].field`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; là JSON field path đã thay đổi, ví dụ `receiver.phone`\.|
|`data.changed_fields[].previous_value`|any|Có điều kiện|Bắt buộc trong mỗi phần tử; là giá trị đã áp dụng ngay trước lần cập nhật\. Có thể là `null` nếu trước đó chưa có dữ liệu\.|
|`data.changed_fields[].current_value`|any|Có điều kiện|Bắt buộc trong mỗi phần tử; là giá trị thực tế đang áp dụng sau khi chuẩn hóa\. Có thể là `null` khi field được xóa\.|
|`data.order_status`|string|Có|Mã trạng thái Order sau khi chỉnh sửa; ví dụ: `SPF-0301`\. Sửa trực tiếp thông thường không đổi trạng thái nhưng response vẫn trả để UI đồng bộ\.|
|`data.status_name`|string|Có|Tên trạng thái tương ứng để hiển thị; ví dụ: `Chờ lấy hàng`\.|
|`data.updated_at`|datetime|Có|Thời điểm cập nhật được áp dụng theo ISO 8601; ví dụ: `2026-09-14T10:15:00+07:00`\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Chỉnh sửa thông tin Đơn hàng thành công.",
  "data": {
    "order_code": "9001156990401",
    "activity_code": "ACT-ORD-20260916-000128",
    "changed_fields": [
      {
        "change_type": 2,
        "field": "receiver.phone",
        "previous_value": "0908123455",
        "current_value": "0908123456"
      },
      {
        "change_type": 7,
        "field": "delivery_note",
        "previous_value": null,
        "current_value": "Gọi người nhận trước khi giao"
      }
    ],
    "order_status": "SPF-0102",
    "status_name": "Tạo đơn NVC lỗi",
    "updated_at": "2026-09-16T14:15:00+07:00"
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`400 Bad Request`|`EMPTY_UPDATE`|Body không có field thay đổi hoặc giá trị mới giống hoàn toàn giá trị hiện tại\.|
|`400 Bad Request`|`FIELD_NOT_EDITABLE`|Request chứa field không được phép sửa trực tiếp qua API này\.|
|`400 Bad Request`|`ADDRESS_INVALID`|Địa chỉ nhận không đầy đủ hoặc không hợp lệ\.|
|`400 Bad Request`|`PARCEL_INVALID`|Snapshot hàng hóa, khối lượng hoặc kích thước không hợp lệ\.|
|`400 Bad Request`|`COD_LIMIT_EXCEEDED`|COD mới vượt giới hạn được phép\.|
|`401 Unauthorized`|`UNAUTHENTICATED`|Thiếu hoặc Access Token không hợp lệ\.|
|`403 Forbidden`|`ORDER_UPDATE_FORBIDDEN`|Người gọi không có quyền sửa hoặc Order nằm ngoài Data Scope\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tồn tại Order trong phạm vi người gọi được phép truy cập\.|
|`409 Conflict`|`ORDER_CREATION_RESULT_UNKNOWN`|Order đang `SPF-0101`; kết quả tạo vận đơn chưa xác định nên chưa được sửa dữ liệu ảnh hưởng NVC\.|
|`409 Conflict`|`CARRIER_WAYBILL_ALREADY_EXISTS`|Order đã có Carrier Waybill hợp lệ; thay đổi phải được tiếp nhận bằng Ticket của Support Module\.|
|`409 Conflict`|`ORDER_UPDATE_NOT_ALLOWED`|Trạng thái hiện tại không cho phép cập nhật trực tiếp\.|
|`409 Conflict`|`IDEMPOTENCY_CONFLICT`|Cùng `Idempotency-Key` đã được dùng với payload khác\.|

**Ranh giới với Support Module:** Khi Shop sửa thông tin sau khi Order đã có Carrier Waybill, Support Module tự tạo Ticket và điều phối yêu cầu thay đổi với NVC. Hai API tạo/kiểm tra `change-requests` không thuộc Module Order. Module Order chỉ cung cấp API nội bộ `/v1/orders/{order_code}/changes/check` và `/v1/orders/{order_code}/changes` để Support Module kiểm tra rồi áp dụng dữ liệu sau khi NVC xác nhận thành công.

Nếu NVC từ chối hoặc xử lý lỗi, dữ liệu Order đang áp dụng không thay đổi; Ticket vẫn lưu yêu cầu, kết quả và nguyên nhân để Shop/CSKH theo dõi.

## 4\.2\. Nhóm Yêu cầu nghiệp vụ

### 4\.2\.1\. Hủy Đơn hàng

Hủy trực tiếp một Order trước khi NVC lấy hàng thành công\. Shop và CSKH dùng cùng endpoint; Backend xác định quyền, Data Scope và toàn bộ Carrier Waybill đang hiệu lực từ Access Context cùng dữ liệu Order\. Nếu Order không còn đủ điều kiện hủy trực tiếp, Consumer phải chuyển sang Support Module để tạo Ticket hỗ trợ thay vì gọi API này\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`POST`|
|Endpoint / Event|`/v1/orders/{order_code}/cancel`|
|Thành công|`200 OK` khi Order được hủy ngay; `202 Accepted` khi đã tiếp nhận và đang chờ NVC xử lý\.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định Shop/CSKH, quyền hủy và Data Scope đối với Order\.|
|`Content-Type: application/json`|Có|Request Body sử dụng JSON\.|
|`Idempotency-Key`|Có|Khóa chống gửi lặp thao tác hủy\. Gửi lại cùng khóa và cùng nội dung phải nhận lại cùng kết quả; cùng khóa nhưng khác nội dung trả `IDEMPOTENCY_CONFLICT`\.|
|`X-Correlation-Id`|Không|Mã truy vết; Backend tự tạo nếu Consumer không truyền\.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order SuperPlatform gồm đúng 13 chữ số cần hủy; ví dụ `9001156990401`\. Không gửi lại trong Request Body\.|

##### Request Body

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`reason_code`|integer|Có|Mã lý do hủy: `1` — Shop không còn nhu cầu giao hàng; `2` — tạo trùng Đơn hàng; `3` — thông tin Đơn hàng không chính xác; `4` — Shop chưa thể chuẩn bị hàng; `5` — Shop chọn phương án vận chuyển khác; `99` — lý do khác\.|
|`reason`|string|Có khi `reason_code = 99`|Nội dung lý do khác do Shop/CSKH nhập\. Khi gửi phải có nội dung thực, không được rỗng hoặc chỉ gồm khoảng trắng\. Không gửi trường này khi `reason_code` thuộc `1`–`5`\.|

##### Ví dụ Request

```JSON
{
  "reason_code": 1
}
```

##### Ví dụ Request — lý do khác

```JSON
{
  "reason_code": 99,
  "reason": "Người nhận đã mua trực tiếp tại cửa hàng"
}
```

##### Ví dụ cURL

```Bash
curl --request POST '{{base_url}}/v1/orders/9001156990401/cancel' \
  --header 'Authorization: Bearer {{access_token}}' \
  --header 'Content-Type: application/json' \
  --header 'Idempotency-Key: cancel-9001156990401-20260916-001' \
  --header 'X-Correlation-Id: req-20260916-000003' \
  --data '{"reason_code":1}'
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|`false` khi thao tác được áp dụng hoặc được tiếp nhận hợp lệ\.|
|`message`|string|Có|Thông báo kết quả bằng tiếng Việt\.|
|`data`|object|Có|Kết quả hủy trực tiếp của Order\.|
|`data.order_code`|string|Có|Mã Order được hủy\.|
|`data.reason_code`|integer|Có|Mã lý do hủy đã ghi nhận; nhận một trong các giá trị `1`, `2`, `3`, `4`, `5` hoặc `99`\.|
|`data.reason_name`|string|Có|Tên lý do hủy tương ứng với `reason_code`; khi `reason_code = 99`, giá trị là `Lý do khác`\.|
|`data.reason`|string|Không|Nội dung lý do do người dùng nhập; chỉ trả khi `reason_code = 99`\. Không trả `null` trong các trường hợp còn lại\.|
|`data.result_code`|integer|Có|Kết quả tại thời điểm trả Response: `1` — đã hủy thành công; `2` — đã tiếp nhận và đang chờ kết quả hủy từ một hoặc nhiều NVC\.|
|`data.order_status`|string|Có|Trạng thái Order tại thời điểm trả Response\. Khi `result_code = 1`, giá trị là `SPF-0201`; khi `result_code = 2`, Order giữ trạng thái vận chuyển hiện tại cho tới khi có kết quả xác định\.|
|`data.status_name`|string|Có|Tên tiếng Việt của `order_status`\.|
|`data.cancel_requested_at`|datetime|Có|Thời điểm Backend ghi nhận thao tác hủy theo ISO 8601 có múi giờ\.|
|`data.cancelled_at`|datetime|Không|Thời điểm Order thực sự chuyển sang `SPF-0201 — Đã hủy`; chỉ trả khi đã hủy thành công, không trả `null` khi còn chờ\.|
|`data.updated_at`|datetime|Có|Thời điểm Order được cập nhật gần nhất\.|

##### Ví dụ Response — đang chờ NVC xử lý (`202 Accepted`)

```JSON
{
  "error": false,
  "message": "Đã tiếp nhận thao tác hủy Đơn hàng.",
  "data": {
    "order_code": "9001156990401",
    "reason_code": 1,
    "reason_name": "Shop không còn nhu cầu giao hàng",
    "result_code": 2,
    "order_status": "SPF-0401",
    "status_name": "Đang lấy hàng",
    "cancel_requested_at": "2026-09-16T10:30:00+07:00",
    "updated_at": "2026-09-16T10:30:00+07:00"
  }
}
```

##### Ví dụ Response — đã hủy thành công (`200 OK`)

```JSON
{
  "error": false,
  "message": "Hủy Đơn hàng thành công.",
  "data": {
    "order_code": "9001156990401",
    "reason_code": 1,
    "reason_name": "Shop không còn nhu cầu giao hàng",
    "result_code": 1,
    "order_status": "SPF-0201",
    "status_name": "Đã hủy",
    "cancel_requested_at": "2026-09-16T10:35:00+07:00",
    "cancelled_at": "2026-09-16T10:35:00+07:00",
    "updated_at": "2026-09-16T10:35:00+07:00"
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`400 Bad Request`|`INVALID_CANCEL_DATA`|Thiếu `reason_code`, mã không thuộc danh mục hỗ trợ, thiếu `reason` khi `reason_code = 99`, `reason` rỗng/chỉ gồm khoảng trắng, hoặc gửi `reason` khi đã chọn mã `1`–`5`\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_CANCEL_FORBIDDEN`|Actor không có quyền hủy hoặc Order nằm ngoài Data Scope\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi người gọi được phép xem\.|
|`409 Conflict`|`IDEMPOTENCY_CONFLICT`|Cùng `Idempotency-Key` nhưng Request Body khác lần gọi đầu\.|
|`409 Conflict`|`ORDER_CANCEL_IN_PROGRESS`|Order đã có thao tác hủy đang chờ kết quả; không tạo thêm thao tác hủy trùng\.|
|`422 Unprocessable Entity`|`ORDER_CANCEL_NOT_ALLOWED`|Order không ở một trong các trạng thái cho phép hủy trực tiếp: `SPF-0102`, `SPF-0301`, `SPF-0401`, `SPF-0402`, `SPF-0403`; gồm trường hợp đang `SPF-0101`, đã lấy hàng từ `SPF-0501` trở đi hoặc đã kết thúc\.|
|`503 Service Unavailable`|`ORDER_CANCEL_UNAVAILABLE`|Tạm thời không thể ghi nhận thao tác hủy an toàn\.|

### 4\.2\.2\. Thực hiện lại vận chuyển

Cho phép nhân viên hoặc dịch vụ nội bộ yêu cầu NVC thực hiện lại đúng công việc đã thất bại: lấy hàng, bàn giao, giao hàng, lấy hàng hoàn hoặc trả hàng\. Shop không gọi trực tiếp API này; khi Shop cần hỗ trợ, Support Module tiếp nhận Ticket và nhân viên được phân quyền thực hiện thao tác trên Order\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`POST`|
|Endpoint / Event|`/v1/orders/{order_code}/retry`|
|Thành công|`202 Accepted`|
|Quyền truy cập|Nhân viên hoặc dịch vụ nội bộ được phân quyền; áp dụng Data Scope của người gọi\.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định nhân viên hoặc dịch vụ nội bộ, quyền thao tác và Data Scope\.|
|`Content-Type: application/json`|Có|Request Body sử dụng JSON\.|
|`Idempotency-Key`|Có|Chống tạo hoặc gửi lặp yêu cầu\. Gửi lại cùng key và cùng payload phải trả lại cùng kết quả nghiệp vụ; cùng key nhưng khác payload trả `IDEMPOTENCY_CONFLICT`\.|
|`X-Correlation-Id`|Không|Mã truy vết do client truyền; Backend tự tạo nếu không có\.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order SuperPlatform cần yêu cầu thực hiện lại; ví dụ: `9001156990401`\. Không gửi lại field này trong body\.|

##### Request Body

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`retry_type`|integer|Có|Công việc cần NVC thực hiện lại: `1` — lấy hàng từ Shop; `2` — bàn giao từ NVC Lấy sang NVC Giao; `3` — giao hàng cho Người nhận; `4` — lấy hàng để bắt đầu chặng Hoàn; `5` — bàn giao từ NVC Hoàn sang NVC Trả cuối; `6` — trả hàng về Shop hoặc điểm trả cuối\.|
|`reason`|string|Không|Lý do hoặc thông tin cần chuyển cho bộ phận xử lý; nếu gửi thì không được rỗng hoặc chỉ gồm khoảng trắng\. Ví dụ: `Người nhận hẹn giao lại vào ngày 17/09/2026`\.|

Ý nghĩa và State Gate của `retry_type`:

|`retry_type`|Nghiệp vụ|Actor được phép|Trạng thái đầu vào|Trạng thái sau khi tiếp nhận|
|---|---|---|---|---|
|`1`|Lấy lại hàng từ Shop|CSKH/Vận hành|`SPF-0402` — Lấy hàng thất bại|`SPF-0403` — Đang yêu cầu lấy lại|
|`2`|Bàn giao lại Lấy → Giao|Hệ thống vận hành SuperShip khi SuperShip là NVC Lấy|`SPF-0603` — Bàn giao thất bại|`SPF-0604` — Đang yêu cầu bàn giao lại|
|`3`|Giao lại cho Người nhận|CSKH/Vận hành|`SPF-0802` — Giao hàng thất bại|`SPF-0803` — Đang yêu cầu giao lại|
|`4`|Lấy lại hàng hoàn|CSKH/Vận hành|`SPF-1005` — Lấy hàng hoàn thất bại|`SPF-1006` — Đang yêu cầu lấy lại hàng hoàn|
|`5`|Bàn giao lại Hoàn → Trả cuối|Vận hành|`SPF-1103` — Trả NVC hoàn cuối thất bại|Giữ `SPF-1103`; bộ trạng thái hiện hành chưa có mã riêng cho bước đang yêu cầu này|
|`6`|Trả lại hàng về Shop/điểm trả cuối|CSKH/Vận hành|`SPF-1107` — Trả hàng thất bại|`SPF-1108` — Đang yêu cầu trả lại|

##### Ví dụ Request

```JSON
{
  "retry_type": 3,
  "reason": "Người nhận hẹn giao lại vào ngày hôm sau"
}
```

##### Ví dụ cURL

```Bash
curl --request POST '{{base_url}}/v1/orders/9001156990401/retry' \
  --header 'Authorization: Bearer {{access_token}}' \
  --header 'Content-Type: application/json' \
  --header 'Idempotency-Key: retry-delivery-9001156990401-20260914-001' \
  --header 'X-Correlation-Id: req-20260914-000004' \
  --data '{"retry_type":3,"reason":"Người nhận hẹn giao lại vào ngày hôm sau"}'
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|Cho biết request có lỗi hay không\. Tiếp nhận thành công luôn trả `false`\.|
|`message`|string|Có|Thông báo ngắn gọn để UI hiển thị\.|
|`data`|object|Có|Kết quả ghi nhận thao tác thực hiện lại\.|
|`data.order_code`|string|Có|Mã Order liên quan; ví dụ: `9001156990401`\.|
|`data.retry_type`|integer|Có|Mã công việc đã được ghi nhận; nhận một trong các giá trị từ `1` đến `6` như bảng Request\.|
|`data.result_code`|integer|Có|Kết quả tại thời điểm trả response: `1` — đã ghi nhận và đang chờ NVC thực hiện\. Không có nghĩa NVC đã bắt đầu hoặc sẽ xử lý thành công\.|
|`data.order_status`|string|Có|Trạng thái hiện tại của Order sau khi ghi nhận thao tác\. Với `retry_type = 5`, giá trị vẫn là `SPF-1103`\.|
|`data.status_name`|string|Có|Tên trạng thái Order tương ứng để UI hiển thị\.|
|`data.accepted_at`|datetime|Có|Thời điểm hệ thống ghi nhận thao tác theo ISO 8601\.|
|`data.updated_at`|datetime|Có|Thời điểm Order được cập nhật gần nhất theo ISO 8601\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Đã tiếp nhận yêu cầu giao lại.",
  "data": {
    "order_code": "9001156990401",
    "retry_type": 3,
    "result_code": 1,
    "order_status": "SPF-0803",
    "status_name": "Đang yêu cầu giao lại",
    "accepted_at": "2026-09-16T15:20:00+07:00",
    "updated_at": "2026-09-16T15:20:00+07:00"
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`400 Bad Request`|`INVALID_RETRY_DATA`|`retry_type` không thuộc `1` đến `6`, hoặc `reason` được gửi nhưng rỗng/chỉ gồm khoảng trắng\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_RETRY_FORBIDDEN`|Người gọi không có quyền thực hiện loại thao tác này hoặc Order nằm ngoài Data Scope\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi người gọi được phép xem\.|
|`409 Conflict`|`IDEMPOTENCY_CONFLICT`|Cùng `Idempotency-Key` nhưng Request Body khác lần gọi đầu\.|
|`409 Conflict`|`ORDER_RETRY_IN_PROGRESS`|Đã có thao tác thực hiện lại cùng loại đang được xử lý trên cùng chặng\.|
|`422 Unprocessable Entity`|`ORDER_RETRY_NOT_ALLOWED`|Trạng thái hiện tại không đúng trạng thái đầu vào của `retry_type`, hàng không còn do NVC phù hợp giữ, hoặc Order đã chuyển sang luồng khác\.|
|`422 Unprocessable Entity`|`ORDER_RETRY_TARGET_NOT_FOUND`|Không xác định được đúng chặng, Carrier Waybill hoặc lần thất bại cần thực hiện lại\.|
|`422 Unprocessable Entity`|`ORDER_RETRY_UNSUPPORTED`|NVC hoặc dịch vụ không hỗ trợ thao tác được yêu cầu\.|
|`503 Service Unavailable`|`ORDER_RETRY_UNAVAILABLE`|Tạm thời không thể ghi nhận thao tác một cách an toàn\.|

### 4\.2\.3\. Áp dụng giao một phần

Áp dụng phương án giao một phần đã được xác minh\. Consumer có thể chọn xác nhận bằng ghi chú hoặc chọn chi tiết phần hàng giao, phần hàng cần hoàn và COD đề nghị áp dụng\. API dành cho nhân viên nội bộ được phân quyền sau khi Support Module đã tiếp nhận và xác minh nhu cầu của Shop\. NVC chấp nhận phương án không đồng nghĩa hàng đã được giao một phần; `SPF-0902` chỉ được cập nhật từ kết quả giao thực tế\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`POST`|
|Endpoint / Event|`/v1/orders/{order_code}/partial`|
|Thành công|`202 Accepted`|
|Quyền truy cập|Nhân viên nội bộ được phân quyền; áp dụng Data Scope của người gọi\.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định nhân viên, quyền thao tác và Data Scope\.|
|`Content-Type: application/json`|Có|Request Body sử dụng JSON\.|
|`Idempotency-Key`|Có|Chống tạo yêu cầu trùng\. Gửi lại cùng key và cùng payload phải trả lại cùng kết quả nghiệp vụ; cùng key nhưng khác payload trả `IDEMPOTENCY_CONFLICT`\.|
|`X-Correlation-Id`|Không|Mã truy vết do client truyền; Backend tự tạo nếu không có\.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order SuperPlatform cần áp dụng giao một phần; ví dụ: `9001156990401`\. Không gửi lại field này trong body\.|

##### Request Body

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`partial_type`|integer|Có|Cách khai báo giao một phần: `1` — xác nhận bằng ghi chú, không chọn chi tiết từng sản phẩm; `2` — chọn rõ sản phẩm/số lượng đã giao và sản phẩm/số lượng cần hoàn\.|
|`note`|string|Có điều kiện|Bắt buộc khi `partial_type = 1`; đây là nội dung xác nhận phần hàng đã giao và phần hàng cần hoàn\. Khi `partial_type = 2`, trường này không bắt buộc và chỉ dùng để bổ sung thông tin\. Nếu gửi thì không được rỗng hoặc chỉ gồm khoảng trắng\.|
|`requested_delivered_items`|array\(object\)|Có điều kiện|Bắt buộc và phải có ít nhất một phần tử khi `partial_type = 2`; không gửi khi `partial_type = 1`\. Danh sách xác định phần hàng giao cho Người nhận\.|
|`requested_delivered_items[].sku`|string|Có điều kiện|Bắt buộc trong mỗi phần tử của `requested_delivered_items`; SKU phải thuộc snapshot hàng hóa của Order\.|
|`requested_delivered_items[].quantity`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử của `requested_delivered_items`; số nguyên lớn hơn `0` và không vượt quá số lượng sản phẩm của Order\.|
|`requested_remaining_items`|array\(object\)|Có điều kiện|Bắt buộc và phải có ít nhất một phần tử khi `partial_type = 2`; không gửi khi `partial_type = 1`\. Danh sách xác định phần hàng không giao và cần tiếp tục xử lý theo chiều Hoàn\.|
|`requested_remaining_items[].sku`|string|Có điều kiện|Bắt buộc trong mỗi phần tử của `requested_remaining_items`; SKU phải thuộc snapshot hàng hóa của Order\.|
|`requested_remaining_items[].quantity`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử của `requested_remaining_items`; số nguyên lớn hơn `0` và không vượt quá số lượng sản phẩm của Order\.|
|`requested_cod_amount`|integer|Có điều kiện|Bắt buộc khi `partial_type = 2`; không gửi khi `partial_type = 1`\. COD đề nghị áp dụng cho phần hàng giao, là số nguyên VND từ `0` trở lên và không vượt giới hạn COD của NVC/dịch vụ hiện tại\.|

##### Ví dụ Request — xác nhận bằng ghi chú (`partial_type = 1`)

```JSON
{
  "partial_type": 1,
  "note": "Người nhận đã nhận 1 áo thun; quần kaki còn lại cần chuyển hoàn"
}
```

##### Ví dụ Request — chọn sản phẩm giao và sản phẩm hoàn (`partial_type = 2`)

```JSON
{
  "partial_type": 2,
  "requested_delivered_items": [
    {
      "sku": "AO-THUN-DEN-M",
      "quantity": 1
    }
  ],
  "requested_remaining_items": [
    {
      "sku": "QUAN-KAKI-32",
      "quantity": 1
    }
  ],
  "requested_cod_amount": 100000,
  "note": "Người nhận chỉ nhận áo thun; phần còn lại chuyển hoàn"
}
```

##### Ví dụ cURL

```Bash
curl --request POST '{{base_url}}/v1/orders/9001156990401/partial' \
  --header 'Authorization: Bearer {{access_token}}' \
  --header 'Content-Type: application/json' \
  --header 'Idempotency-Key: partial-delivery-9001156990401-20260914-001' \
  --header 'X-Correlation-Id: req-20260914-000005' \
  --data '{"partial_type":2,"requested_delivered_items":[{"sku":"AO-THUN-DEN-M","quantity":1}],"requested_remaining_items":[{"sku":"QUAN-KAKI-32","quantity":1}],"requested_cod_amount":100000,"note":"Người nhận chỉ nhận áo thun; phần còn lại chuyển hoàn"}'
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|Cho biết request có lỗi hay không\. Tiếp nhận thành công luôn trả `false`\.|
|`message`|string|Có|Thông báo ngắn gọn để UI hiển thị\.|
|`data`|object|Có|Kết quả ghi nhận phương án giao một phần\.|
|`data.order_code`|string|Có|Mã Order liên quan; ví dụ: `9001156990401`\.|
|`data.partial_type`|integer|Có|Cách khai báo đã được ghi nhận: `1` — bằng ghi chú; `2` — theo danh sách sản phẩm giao và sản phẩm hoàn\.|
|`data.result_code`|integer|Có|Kết quả tại thời điểm trả response: `1` — đã ghi nhận và đang chờ NVC xử lý\.|
|`data.requested_cod_amount`|integer|Không|COD đề nghị áp dụng; chỉ trả khi `partial_type = 2`, không trả `null` khi `partial_type = 1`\.|
|`data.order_status`|string|Có|Trạng thái Order hiện tại\. Việc tạo yêu cầu không tự chuyển Order sang `SPF-0902`\.|
|`data.status_name`|string|Có|Tên trạng thái Order tương ứng để UI hiển thị\.|
|`data.accepted_at`|datetime|Có|Thời điểm hệ thống ghi nhận phương án theo ISO 8601\.|
|`data.updated_at`|datetime|Có|Thời điểm Order được cập nhật gần nhất theo ISO 8601\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Đã tiếp nhận yêu cầu giao một phần.",
  "data": {
    "order_code": "9001156990401",
    "partial_type": 2,
    "result_code": 1,
    "requested_cod_amount": 100000,
    "order_status": "SPF-0801",
    "status_name": "Đang giao hàng",
    "accepted_at": "2026-09-16T15:30:00+07:00",
    "updated_at": "2026-09-16T15:30:00+07:00"
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`400 Bad Request`|`INVALID_PARTIAL_DATA`|`partial_type` không thuộc `1`–`2`; loại `1` thiếu `note` hoặc gửi các trường danh sách/COD; loại `2` thiếu danh sách hàng giao, danh sách hàng hoàn hoặc COD; số lượng, COD hay ghi chú không hợp lệ\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_PARTIAL_FORBIDDEN`|Người gọi không có quyền hoặc Order nằm ngoài Data Scope\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi được phép xem\.|
|`409 Conflict`|`IDEMPOTENCY_CONFLICT`|Cùng `Idempotency-Key` nhưng Request Body khác lần gọi đầu\.|
|`409 Conflict`|`ORDER_PARTIAL_IN_PROGRESS`|Đã có một thao tác giao một phần đang được xử lý trên Order\.|
|`422 Unprocessable Entity`|`ORDER_PARTIAL_NOT_ALLOWED`|Order đã có kết quả giao cuối hoặc đã chuyển sang luồng không còn cho phép giao một phần\.|
|`422 Unprocessable Entity`|`ORDER_PARTIAL_ITEMS_MISMATCH`|Với `partial_type = 2`, SKU không thuộc Order, bị lặp, hoặc tổng số lượng hàng giao và hàng hoàn không khớp snapshot hàng hóa\.|
|`422 Unprocessable Entity`|`ORDER_PARTIAL_UNSUPPORTED`|NVC hoặc dịch vụ hiện tại không hỗ trợ giao một phần\.|
|`503 Service Unavailable`|`ORDER_PARTIAL_UNAVAILABLE`|Tạm thời không thể ghi nhận thao tác an toàn\.|

### 4\.2\.4\. Tạo yêu cầu đổi hàng

Ghi nhận nội dung hướng dẫn/yêu cầu đổi hàng trên Order và COD mới nếu nghiệp vụ đổi hàng làm thay đổi số tiền cần thu\. API không nhận danh sách hàng giao thay thế hoặc danh sách hàng thu hồi; chi tiết hàng đổi được mô tả trong `note`\. NVC tiếp nhận yêu cầu không đồng nghĩa nghiệp vụ đổi hàng đã hoàn tất\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`POST`|
|Endpoint / Event|`/v1/orders/{order_code}/exchange`|
|Thành công|`202 Accepted`|
|Quyền truy cập|Nhân viên nội bộ được phân quyền; áp dụng Data Scope của người gọi\.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định nhân viên, quyền thao tác và Data Scope\.|
|`Content-Type: application/json`|Có|Request Body sử dụng JSON\.|
|`Idempotency-Key`|Có|Chống tạo yêu cầu trùng\. Gửi lại cùng key và cùng payload phải trả lại cùng kết quả nghiệp vụ; cùng key nhưng khác payload trả `IDEMPOTENCY_CONFLICT`\.|
|`X-Correlation-Id`|Không|Mã truy vết do client truyền; Backend tự tạo nếu không có\.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order SuperPlatform phát sinh yêu cầu đổi hàng; ví dụ: `9001156990401`\. Không gửi lại trường này trong Request Body\.|

##### Request Body

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`note`|string|Có|Nội dung hướng dẫn/yêu cầu đổi hàng, ví dụ hàng cần giao thay thế, hàng cần thu hồi và cách thức thực hiện\. Giá trị không được rỗng hoặc chỉ gồm khoảng trắng\.|
|`requested_cod_amount`|integer|Không|COD đề nghị áp dụng sau khi đổi hàng; là số nguyên VND từ `0` trở lên và không vượt giới hạn COD của NVC/dịch vụ hiện tại\. Không gửi trường này khi COD không thay đổi\.|

##### Ví dụ Request

```JSON
{
  "note": "Giao áo thun đen size L và thu hồi áo thun đen size M trong cùng lần phục vụ",
  "requested_cod_amount": 200000
}
```

##### Ví dụ cURL

```Bash
curl --request POST '{{base_url}}/v1/orders/9001156990401/exchange' \
  --header 'Authorization: Bearer {{access_token}}' \
  --header 'Content-Type: application/json' \
  --header 'Idempotency-Key: exchange-9001156990401-20260914-001' \
  --header 'X-Correlation-Id: req-20260914-000006' \
  --data '{"note":"Giao áo thun đen size L và thu hồi áo thun đen size M trong cùng lần phục vụ","requested_cod_amount":200000}'
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|Cho biết request có lỗi hay không\. Tiếp nhận thành công luôn trả `false`\.|
|`message`|string|Có|Thông báo ngắn gọn để UI hiển thị\.|
|`data`|object|Có|Kết quả tiếp nhận yêu cầu đổi hàng\.|
|`data.order_code`|string|Có|Mã Order liên quan; ví dụ: `9001156990401`\.|
|`data.result_code`|integer|Có|Kết quả tại thời điểm trả Response: `1` — đã ghi nhận và đang chờ NVC xử lý\.|
|`data.requested_cod_amount`|integer|Không|COD mới đã được đề nghị; chỉ trả khi Request có truyền trường này, không trả `null` khi COD không thay đổi\.|
|`data.order_status`|string|Có|Trạng thái Order tại thời điểm ghi nhận yêu cầu\. Tạo yêu cầu không mặc định làm thay đổi trạng thái vận chuyển\.|
|`data.status_name`|string|Có|Tên trạng thái Order tương ứng để UI hiển thị\.|
|`data.accepted_at`|datetime|Có|Thời điểm hệ thống ghi nhận yêu cầu theo ISO 8601\.|
|`data.updated_at`|datetime|Có|Thời điểm Order được cập nhật gần nhất theo ISO 8601\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Đã tiếp nhận yêu cầu đổi hàng.",
  "data": {
    "order_code": "9001156990401",
    "result_code": 1,
    "requested_cod_amount": 200000,
    "order_status": "SPF-0801",
    "status_name": "Đang giao hàng",
    "accepted_at": "2026-09-16T16:00:00+07:00",
    "updated_at": "2026-09-16T16:00:00+07:00"
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`400 Bad Request`|`INVALID_EXCHANGE_DATA`|Thiếu `note`, `note` rỗng/chỉ gồm khoảng trắng, hoặc `requested_cod_amount` không phải số nguyên VND hợp lệ\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_EXCHANGE_FORBIDDEN`|Người gọi không có quyền hoặc Order nằm ngoài Data Scope\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi được phép xem\.|
|`409 Conflict`|`IDEMPOTENCY_CONFLICT`|Cùng `Idempotency-Key` nhưng Request Body khác lần gọi đầu\.|
|`409 Conflict`|`ORDER_EXCHANGE_IN_PROGRESS`|Đã có một yêu cầu đổi hàng đang được xử lý trên Order\.|
|`422 Unprocessable Entity`|`ORDER_EXCHANGE_NOT_ALLOWED`|Trạng thái Order hiện tại không còn cho phép đổi hàng\.|
|`422 Unprocessable Entity`|`ORDER_EXCHANGE_UNSUPPORTED`|NVC hoặc dịch vụ hiện tại không hỗ trợ nghiệp vụ đổi hàng hoặc thay đổi COD kèm theo\.|
|`503 Service Unavailable`|`ORDER_EXCHANGE_UNAVAILABLE`|Tạm thời không thể ghi nhận yêu cầu an toàn\.|

### 4\.2\.5\. Yêu cầu và xác nhận chuyển hoàn

Nghiệp vụ chuyển hoàn gồm hai thao tác tách biệt: Shop tạo yêu cầu để chuyển Order sang `SPF-1001 — Chờ xác nhận chuyển hoàn`; sau đó nhân viên nội bộ xác nhận chuyển hoàn qua NVC hoặc xác nhận thủ công sau khi CS đã liên hệ và được NVC đồng ý\. Chỉ khi đã có xác nhận hợp lệ, Order mới chuyển sang `SPF-1002 — Đã xác nhận chuyển hoàn`\.

#### 4\.2\.5\.1\. Tạo yêu cầu chuyển hoàn

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`POST`|
|Endpoint / Event|`/v1/orders/{order_code}/return`|
|Thành công|`200 OK`|
|Quyền truy cập|Shop hoặc nhân viên nội bộ được phân quyền; áp dụng Data Scope của người gọi\.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định Actor, quyền và Data Scope được phép tạo yêu cầu\.|
|`Content-Type: application/json`|Có|Request Body sử dụng JSON\.|
|`Idempotency-Key`|Có|Chống tạo yêu cầu trùng\. Gửi lại cùng key và cùng payload phải trả lại cùng kết quả nghiệp vụ; cùng key nhưng khác payload trả `IDEMPOTENCY_CONFLICT`\.|
|`X-Correlation-Id`|Không|Mã truy vết do client truyền; Backend tự tạo nếu không có\.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order SuperPlatform cần chuyển hoàn; ví dụ: `9001156990401`\. Không gửi lại trường này trong Request Body\.|

##### Request Body

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`note`|string|Không|Ghi chú của Shop hoặc nhân viên khi tạo yêu cầu chuyển hoàn\. Nếu gửi thì không được rỗng hoặc chỉ gồm khoảng trắng\.|

##### Ví dụ Request

```JSON
{
  "note": "Người nhận từ chối nhận hàng, Shop yêu cầu chuyển hoàn"
}
```

##### Ví dụ cURL

```Bash
curl --request POST '{{base_url}}/v1/orders/9001156990401/return' \
  --header 'Authorization: Bearer {{access_token}}' \
  --header 'Content-Type: application/json' \
  --header 'Idempotency-Key: return-9001156990401-20260914-001' \
  --header 'X-Correlation-Id: req-20260914-000007' \
  --data '{"note":"Người nhận từ chối nhận hàng, Shop yêu cầu chuyển hoàn"}'
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|Cho biết request có lỗi hay không\. Thành công luôn trả `false`\.|
|`message`|string|Có|Thông báo ngắn gọn để UI hiển thị\.|
|`data`|object|Có|Kết quả tạo yêu cầu chuyển hoàn\.|
|`data.order_code`|string|Có|Mã Order liên quan; ví dụ: `9001156990401`\.|
|`data.order_status`|string|Có|Luôn là `SPF-1001` sau khi tạo yêu cầu thành công\.|
|`data.status_name`|string|Có|Luôn là `Chờ xác nhận chuyển hoàn` sau khi tạo yêu cầu thành công\.|
|`data.requested_at`|datetime|Có|Thời điểm yêu cầu chuyển hoàn được tạo theo ISO 8601 có múi giờ\.|
|`data.updated_at`|datetime|Có|Thời điểm Order được cập nhật gần nhất theo ISO 8601 có múi giờ\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Đã tạo yêu cầu chuyển hoàn.",
  "data": {
    "order_code": "9001156990401",
    "order_status": "SPF-1001",
    "status_name": "Chờ xác nhận chuyển hoàn",
    "requested_at": "2026-09-16T16:20:00+07:00",
    "updated_at": "2026-09-16T16:20:00+07:00"
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`400 Bad Request`|`INVALID_RETURN_REQUEST_DATA`|`note` được truyền nhưng rỗng hoặc chỉ gồm khoảng trắng\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_RETURN_REQUEST_FORBIDDEN`|Người gọi không có quyền hoặc Order nằm ngoài Data Scope\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi được phép xem\.|
|`409 Conflict`|`IDEMPOTENCY_CONFLICT`|Cùng `Idempotency-Key` nhưng Request Body khác lần gọi đầu\.|
|`409 Conflict`|`ORDER_RETURN_REQUEST_EXISTS`|Order đã có yêu cầu chuyển hoàn đang chờ xác nhận\.|
|`422 Unprocessable Entity`|`ORDER_RETURN_REQUEST_NOT_ALLOWED`|Order đã giao thành công, đã hủy, đã ở luồng chuyển hoàn/trả hàng hoặc trạng thái hiện tại không cho phép tạo yêu cầu chuyển hoàn\.|
|`503 Service Unavailable`|`ORDER_RETURN_REQUEST_UNAVAILABLE`|Tạm thời không thể tạo yêu cầu chuyển hoàn an toàn\.|

#### 4\.2\.5\.2\. Xác nhận chuyển hoàn

API dành cho nhân viên nội bộ xác nhận yêu cầu chuyển hoàn đang ở `SPF-1001 — Chờ xác nhận chuyển hoàn`\. Có hai hình thức: gửi yêu cầu tới NVC qua hệ thống hoặc xác nhận thủ công sau khi CS đã liên hệ và được NVC đồng ý\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`POST`|
|Endpoint / Event|`/v1/orders/{order_code}/return/confirm`|
|Thành công|`200 OK` khi NVC đã tiếp nhận yêu cầu qua API hoặc CS đã xác nhận thủ công sau khi NVC đồng ý\. Cả hai trường hợp đều chuyển Order sang `SPF-1002 — Đã xác nhận chuyển hoàn`\.|
|Quyền truy cập|Chỉ nhân viên hoặc dịch vụ nội bộ được cấp quyền xác nhận chuyển hoàn; áp dụng Data Scope của người gọi\.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định nhân viên/dịch vụ nội bộ, quyền và Data Scope được phép xác nhận\.|
|`Content-Type: application/json`|Có|Request Body sử dụng JSON\.|
|`Idempotency-Key`|Có|Chống xác nhận hoặc gửi yêu cầu tới NVC trùng lặp\. Cùng key và cùng payload trả lại cùng kết quả nghiệp vụ; cùng key nhưng khác payload trả `IDEMPOTENCY_CONFLICT`\.|
|`X-Correlation-Id`|Không|Mã truy vết do client truyền; Backend tự tạo nếu không có\.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order SuperPlatform đang chờ xác nhận chuyển hoàn; ví dụ: `9001156990401`\. Không gửi lại trường này trong Request Body\.|

##### Request Body

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`confirmation_type`|integer|Có|Hình thức xác nhận: `1` — gửi yêu cầu chuyển hoàn tới NVC qua Carrier Module/API; `2` — CS xác nhận thủ công sau khi đã liên hệ và được NVC đồng ý\.|
|`note`|string|Không|Ghi chú bổ sung về việc xác nhận\. Nếu gửi thì không được rỗng hoặc chỉ gồm khoảng trắng\. Với `confirmation_type = 2`, nên ghi kênh liên hệ hoặc nội dung NVC đã xác nhận để phục vụ lịch sử nghiệp vụ\.|

##### Ví dụ Request — gửi yêu cầu qua API NVC

```JSON
{
  "confirmation_type": 1,
  "note": "Gửi yêu cầu chuyển hoàn tới NVC đang giữ kiện"
}
```

##### Ví dụ Request — CS xác nhận thủ công

```JSON
{
  "confirmation_type": 2,
  "note": "CS đã liên hệ NVC và được xác nhận chuyển hoàn"
}
```

##### Ví dụ cURL

```Bash
curl --request POST '{{base_url}}/v1/orders/9001156990401/return/confirm' \
  --header 'Authorization: Bearer {{access_token}}' \
  --header 'Content-Type: application/json' \
  --header 'Idempotency-Key: confirm-return-9001156990401-20260916-001' \
  --header 'X-Correlation-Id: req-20260916-000008' \
  --data '{"confirmation_type":1,"note":"Gửi yêu cầu chuyển hoàn tới NVC đang giữ kiện"}'
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|Cho biết request có lỗi hay không\. Thành công luôn trả `false`\.|
|`message`|string|Có|Thông báo ngắn gọn để UI hiển thị\.|
|`data`|object|Có|Kết quả xác nhận chuyển hoàn\.|
|`data.order_code`|string|Có|Mã Order được xác nhận chuyển hoàn\.|
|`data.confirmation_type`|integer|Có|Hình thức đã sử dụng: `1` — qua API NVC; `2` — CS xác nhận thủ công\.|
|`data.order_status`|string|Có|Luôn là `SPF-1002` sau khi API thành công\. NVC tiếp nhận yêu cầu qua API được xem là đã xác nhận chuyển hoàn\.|
|`data.status_name`|string|Có|Luôn là `Đã xác nhận chuyển hoàn` sau khi API thành công\.|
|`data.updated_at`|datetime|Có|Thời điểm Order được cập nhật gần nhất theo ISO 8601 có múi giờ\.|

##### Ví dụ Response — đã xác nhận

```JSON
{
  "error": false,
  "message": "Đã xác nhận chuyển hoàn.",
  "data": {
    "order_code": "9001156990401",
    "confirmation_type": 2,
    "order_status": "SPF-1002",
    "status_name": "Đã xác nhận chuyển hoàn",
    "updated_at": "2026-09-16T16:40:00+07:00"
  }
}
```

##### Ví dụ Response — NVC tiếp nhận qua API

```JSON
{
  "error": false,
  "message": "NVC đã tiếp nhận và xác nhận yêu cầu chuyển hoàn.",
  "data": {
    "order_code": "9001156990401",
    "confirmation_type": 1,
    "order_status": "SPF-1002",
    "status_name": "Đã xác nhận chuyển hoàn",
    "updated_at": "2026-09-16T16:35:00+07:00"
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`400 Bad Request`|`INVALID_RETURN_CONFIRMATION_DATA`|`confirmation_type` không thuộc `1`, `2`; hoặc `note` được truyền nhưng rỗng/chỉ gồm khoảng trắng\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_RETURN_CONFIRMATION_FORBIDDEN`|Người gọi không có quyền nội bộ hoặc Order nằm ngoài Data Scope\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi được phép xem\.|
|`409 Conflict`|`IDEMPOTENCY_CONFLICT`|Cùng `Idempotency-Key` nhưng Request Body khác lần gọi đầu\.|
|`409 Conflict`|`ORDER_RETURN_CONFIRMATION_IN_PROGRESS`|Đã có một lần xác nhận qua NVC đang được xử lý trên Order\.|
|`422 Unprocessable Entity`|`ORDER_NOT_WAITING_RETURN_CONFIRMATION`|Order không ở `SPF-1001 — Chờ xác nhận chuyển hoàn`\.|
|`422 Unprocessable Entity`|`CARRIER_RETURN_UNSUPPORTED`|NVC hiện tại không hỗ trợ xác nhận chuyển hoàn qua API khi dùng `confirmation_type = 1`\. Nhân viên cần liên hệ NVC và chỉ dùng loại `2` sau khi NVC đã đồng ý\.|
|`503 Service Unavailable`|`ORDER_RETURN_CONFIRMATION_UNAVAILABLE`|Tạm thời không thể xác nhận hoặc gửi yêu cầu tới NVC an toàn\.|

### 4\.2\.6\. Điều phối đơn vị vận chuyển

API hỗ trợ hai nghiệp vụ nội bộ trên kế hoạch vận chuyển của Order:

1. **Đổi NVC trước khi NVC hiện tại nhận hàng:** Backend tự xác định chặng đang chờ thực hiện, hủy/thay thế Waybill cũ an toàn và dùng dữ liệu chặng trong Request để tạo Waybill mới\.
2. **Gán NVC cho chiều hoàn:** Backend tạo chặng `RETURN` và dùng dữ liệu điểm lấy, điểm giao, kiện hàng trong Request để tạo Waybill cho NVC đến lấy hàng hoàn\.
Ví dụ: SuperShip thực hiện chặng lấy, sau đó chuyển GHN thực hiện chặng giao\. Khi cần phát sinh chiều hoàn nhưng GHN không hỗ trợ, vận hành có thể tạo chặng hoàn mới và gán J&T Express thực hiện\. Chặng giao của GHN vẫn được giữ nguyên trong lịch sử; J&T Express chỉ phụ trách chặng hoàn mới\.

Đây là thao tác trực tiếp lên chặng và Waybill của Order, không tạo Ticket hoặc yêu cầu hỗ trợ\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`POST`|
|Endpoint / Event|`/v1/orders/{order_code}/carrier`|
|Thành công|`200 OK` khi đã thiết lập xong; `202 Accepted` khi thao tác đang xử lý hoặc đang đối soát Waybill\.|
|Quyền truy cập|Chỉ nhân viên hoặc dịch vụ nội bộ được cấp quyền thiết lập NVC; áp dụng Data Scope của người gọi\.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định nhân viên/dịch vụ nội bộ, quyền và Data Scope được phép thao tác\.|
|`Content-Type: application/json`|Có|Request Body sử dụng JSON\.|
|`Idempotency-Key`|Có|Chống hủy Waybill, tạo chặng hoàn hoặc tạo Waybill thay thế trùng khi request được gửi lại\. Cùng key và cùng payload trả lại cùng kết quả; cùng key nhưng khác payload trả `IDEMPOTENCY_CONFLICT`\.|
|`X-Correlation-Id`|Không|Mã truy vết do Consumer truyền; Backend tự tạo nếu không có\.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order SuperPlatform gồm đúng 13 chữ số cần thiết lập NVC\.|

##### Request Body

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`operation_type`|integer|Có|Loại điều phối: `1` — đổi NVC trước khi NVC hiện tại nhận hàng; `2` — tạo chặng hoàn và gán NVC\. Backend tự xác định chặng cần thay hoặc tạo mã chặng mới; Consumer không truyền mã chặng hay mã Waybill\.|
|`carrier_code`|integer|Có|Mã NVC được điều phối thực hiện tiếp\. Giá trị hiện hỗ trợ: `1` — SuperShip; `2` — GHN; `3` — J&T Express; `4` — Viettel Post; `6` — BEST Express; `10` — SPX Express; `13` — Vietnam Post; `15` — Green SM Express; `16` — GrabExpress\. Với loại `1`, mã này không được trùng NVC hiện tại\.|
|`pickup`|object|Có|Điểm NVC mới đến nhận kiện cho chặng được tạo hoặc thay thế\. Dữ liệu này là snapshot của chặng, không tự sửa điểm lấy gốc của Order\.|
|`pickup.contact_name`|string|Có|Tên người bàn giao kiện cho NVC tại điểm lấy của chặng\.|
|`pickup.phone`|string|Có|Số điện thoại để NVC liên hệ khi lấy kiện\.|
|`pickup.note`|string|Không|Hướng dẫn lấy hàng; bỏ trường nếu không có\.|
|`pickup.address`|object|Có|Địa chỉ lấy hàng của chặng\.|
|`pickup.address.model`|integer|Có|Mô hình địa chỉ: `1` — ba cấp Tỉnh/Quận-Huyện/Phường-Xã; `2` — hai cấp Tỉnh/Phường-Xã\.|
|`pickup.address.detail`|string|Có|Số nhà, tên đường, tòa nhà hoặc phần địa chỉ chi tiết\.|
|`pickup.address.province_code`|string|Có|Mã Tỉnh/Thành phố do Address Module cung cấp\.|
|`pickup.address.district_code`|string|Có điều kiện|Bắt buộc khi `pickup.address.model = 1`; không truyền khi mô hình bằng `2`\.|
|`pickup.address.commune_code`|string|Có|Mã Phường/Xã do Address Module cung cấp\.|
|`pickup.address.latitude`|number|Có điều kiện|Nếu truyền tọa độ thì phải truyền cùng `longitude`; vĩ độ WGS84 từ `-90` đến `90`\. NVC tức thời chỉ được tạo khi Backend xác định được đủ tọa độ chuẩn\.|
|`pickup.address.longitude`|number|Có điều kiện|Nếu truyền tọa độ thì phải truyền cùng `latitude`; kinh độ WGS84 từ `-180` đến `180`\.|
|`delivery`|object|Có|Điểm NVC mới giao kiện của chặng\. Với chiều hoàn, đây là Shop, kho hoặc điểm nhận hàng hoàn\. Dữ liệu này không tự sửa người nhận gốc của Order\.|
|`delivery.contact_name`|string|Có|Tên người nhận kiện tại điểm giao của chặng\.|
|`delivery.phone`|string|Có|Số điện thoại để NVC liên hệ khi giao kiện\.|
|`delivery.note`|string|Không|Hướng dẫn giao tại điểm nhận; bỏ trường nếu không có\.|
|`delivery.address`|object|Có|Địa chỉ giao hàng của chặng\.|
|`delivery.address.model`|integer|Có|Mô hình địa chỉ: `1` — ba cấp Tỉnh/Quận-Huyện/Phường-Xã; `2` — hai cấp Tỉnh/Phường-Xã\.|
|`delivery.address.detail`|string|Có|Số nhà, tên đường, tòa nhà hoặc phần địa chỉ chi tiết\.|
|`delivery.address.province_code`|string|Có|Mã Tỉnh/Thành phố do Address Module cung cấp\.|
|`delivery.address.district_code`|string|Có điều kiện|Bắt buộc khi `delivery.address.model = 1`; không truyền khi mô hình bằng `2`\.|
|`delivery.address.commune_code`|string|Có|Mã Phường/Xã do Address Module cung cấp\.|
|`delivery.address.latitude`|number|Có điều kiện|Nếu truyền tọa độ thì phải truyền cùng `longitude`; vĩ độ WGS84 từ `-90` đến `90`\. NVC tức thời chỉ được tạo khi Backend xác định được đủ tọa độ chuẩn\.|
|`delivery.address.longitude`|number|Có điều kiện|Nếu truyền tọa độ thì phải truyền cùng `latitude`; kinh độ WGS84 từ `-180` đến `180`\.|
|`parcel`|object|Có|Thông tin kiện thực tế được giao cho NVC mới ở chặng này\.|
|`parcel.content_type`|integer|Có|Cách khai báo hàng: `1` — một tên hàng trong `product_name`; `2` — danh sách sản phẩm trong `products[]`\.|
|`parcel.product_name`|string|Có điều kiện|Bắt buộc khi `content_type = 1`; không truyền khi bằng `2`\.|
|`parcel.products`|array\(object\)|Có điều kiện|Bắt buộc khi `content_type = 2` và phải có ít nhất một phần tử; không truyền khi bằng `1`\.|
|`parcel.products[].sku`|string|Không|Mã sản phẩm của Shop; bỏ trường nếu không có\.|
|`parcel.products[].name`|string|Có điều kiện|Bắt buộc trong mỗi phần tử `products[]`; tên sản phẩm\.|
|`parcel.products[].quantity`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử `products[]`; số nguyên từ `1` trở lên\.|
|`parcel.products[].unit_price`|integer|Không|Giá một sản phẩm bằng VND, số nguyên từ `0` trở lên; bỏ trường nếu không khai báo theo sản phẩm\.|
|`parcel.products[].unit_weight`|integer|Không|Khối lượng một sản phẩm bằng gram, số nguyên từ `1` trở lên; bỏ trường nếu không khai báo theo sản phẩm\.|
|`parcel.weight`|integer|Có|Tổng khối lượng kiện bằng gram, số nguyên từ `1` trở lên\.|
|`parcel.dimensions`|object|Không|Kích thước kiện theo centimet; nếu truyền phải có đủ `length`, `width`, `height`\.|
|`parcel.dimensions.length`|number|Có điều kiện|Bắt buộc khi có `dimensions`; chiều dài lớn hơn `0`\.|
|`parcel.dimensions.width`|number|Có điều kiện|Bắt buộc khi có `dimensions`; chiều rộng lớn hơn `0`\.|
|`parcel.dimensions.height`|number|Có điều kiện|Bắt buộc khi có `dimensions`; chiều cao lớn hơn `0`\.|
|`parcel.declared_value`|integer|Có|Giá trị khai báo của kiện bằng VND, số nguyên từ `0` trở lên\.|
|`cod_amount`|integer|Có|Số tiền NVC phải thu tại điểm giao của chặng, đơn vị VND, số nguyên từ `0` trở lên; `0` là không thu COD\.|
|`fee_payer`|integer|Có|Bên trả phí: `1` — Shop/người gửi; `2` — người nhận tại điểm giao\.|
|`inspection`|integer|Có|Chính sách xem hàng: `1` — không xem; `2` — được xem nhưng không thử; `3` — được thử nếu NVC hỗ trợ\.|
|`pickup_method`|integer|Có|Cách gửi kiện: `1` — NVC đến lấy; `2` — mang kiện tới điểm tiếp nhận của NVC\.|
|`pickup_at`|datetime|Không|Thời điểm mong muốn lấy hàng theo ISO 8601 có múi giờ; bỏ trường để lấy sớm nhất có thể\.|
|`services`|array\(integer\)|Không|Dịch vụ bổ sung được áp dụng cho chặng; mặc định `[]`\. Giá trị: `1` — cho phép giao một phần; `2` — giao hàng mới kết hợp thu hồi hàng cũ\.|
|`reason_code`|integer|Có|Lý do thiết lập NVC: `1` — NVC từ chối hoặc không nhận được đơn; `2` — không tìm được tài xế sau số lần cho phép; `3` — NVC ngừng/gián đoạn phục vụ tuyến; `4` — NVC hiện tại không hỗ trợ chiều hoàn; `5` — điều phối vận hành chuyển sang NVC khác; `99` — lý do khác\.|
|`reason`|string|Có điều kiện|Bắt buộc khi `reason_code = 99`; không bắt buộc với các mã còn lại\. Nếu gửi thì không được rỗng hoặc chỉ gồm khoảng trắng\.|

##### Ví dụ Request — đổi NVC trên chặng giao

```JSON
{
  "operation_type": 1,
  "carrier_code": 1,
  "pickup": {
    "contact_name": "Nguyễn Minh Hậu",
    "phone": "0908123456",
    "address": {
      "model": 2,
      "detail": "48 Trường Sơn",
      "province_code": "P01",
      "commune_code": "P01C0001"
    }
  },
  "delivery": {
    "contact_name": "Nguyễn Minh Anh",
    "phone": "0948123404",
    "address": {
      "model": 2,
      "detail": "120 Thân Nhân Trung",
      "province_code": "P01",
      "commune_code": "P01C0002"
    }
  },
  "parcel": {
    "content_type": 1,
    "product_name": "Bộ chăm sóc tóc",
    "weight": 680,
    "declared_value": 420000
  },
  "cod_amount": 420000,
  "fee_payer": 1,
  "inspection": 2,
  "pickup_method": 1,
  "services": [],
  "reason_code": 5,
  "reason": "Điều phối SuperShip tự thực hiện chặng giao hàng"
}
```

##### Ví dụ Request — tạo chặng hoàn mới và gán J&T Express

```JSON
{
  "operation_type": 2,
  "carrier_code": 3,
  "pickup": {
    "contact_name": "Nguyễn Minh Anh",
    "phone": "0948123404",
    "note": "Gọi trước khi đến lấy hàng hoàn",
    "address": {
      "model": 2,
      "detail": "120 Thân Nhân Trung",
      "province_code": "P01",
      "commune_code": "P01C0002"
    }
  },
  "delivery": {
    "contact_name": "Nguyễn Minh Hậu",
    "phone": "0908123456",
    "address": {
      "model": 2,
      "detail": "231/15 Dương Bá Trạc",
      "province_code": "P01",
      "commune_code": "P01C0003"
    }
  },
  "parcel": {
    "content_type": 1,
    "product_name": "Bộ chăm sóc tóc",
    "weight": 680,
    "declared_value": 420000
  },
  "cod_amount": 0,
  "fee_payer": 1,
  "inspection": 1,
  "pickup_method": 1,
  "services": [],
  "reason_code": 4,
  "reason": "NVC giao hàng không hỗ trợ chiều hoàn"
}
```

##### Ví dụ cURL

```Bash
curl --request POST '{{base_url}}/v1/orders/9001156990401/carrier' \
  --header 'Authorization: Bearer {{access_token}}' \
  --header 'Content-Type: application/json' \
  --header 'Idempotency-Key: carrier-9001156990401-return-001' \
  --header 'X-Correlation-Id: req-20260916-carrier-001' \
  --data @carrier-return-request.json
```

#### Response

Hai giá trị `operation_type` sử dụng cùng một cấu trúc Response\. Các trường chung luôn giữ nguyên tên và ý nghĩa; `operation_type = 1` chỉ bổ sung `previous_carrier` để thể hiện NVC bị thay thế\. Trường không phát sinh theo nghiệp vụ được bỏ khỏi JSON và không trả giá trị `null`\.

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|Cho biết request có lỗi hay không\. Thành công hoặc đã tiếp nhận xử lý trả `false`\.|
|`message`|string|Có|Thông báo kết quả bằng tiếng Việt\.|
|`data`|object|Có|Kết quả thiết lập NVC cho chặng\.|
|`data.order_code`|string|Có|Mã Order đã thao tác\.|
|`data.operation_type`|integer|Có|Loại điều phối đã thực hiện: `1` — đổi NVC trước khi nhận hàng; `2` — gán NVC cho chiều hoàn\.|
|`data.stage_code`|string|Có|Mã chặng do Backend tự xác định hoặc tự tạo\. Consumer không truyền trường này trong Request\.|
|`data.operation_status`|integer|Có|Trạng thái thao tác: `1` — NVC đã tiếp nhận và thao tác hoàn tất; `2` — đang gửi, tạo hoặc liên kết Waybill và chưa có kết quả xác định; `3` — đang đối soát việc hủy Waybill cũ, NVC mới chưa có hiệu lực\. Với loại `2`, chỉ được cập nhật `SPF-1003` hoặc `SPF-1007` khi `operation_status = 1` và kết quả NVC tương ứng đã được xác nhận\.|
|`data.stage`|object|Có|Snapshot chặng đã dùng để kiểm tra khả dụng, tính giá và tạo Waybill\. Cùng cấu trúc cho cả đổi NVC và tạo chặng hoàn\.|
|`data.stage.pickup`|object|Có|Điểm lấy thực tế đã áp dụng cho chặng\.|
|`data.stage.pickup.contact_name`|string|Có|Tên người bàn giao kiện tại điểm lấy\.|
|`data.stage.pickup.phone`|string|Có|Số điện thoại liên hệ lấy hàng; được che theo quyền người gọi\.|
|`data.stage.pickup.note`|string|Không|Hướng dẫn lấy hàng đã áp dụng; bỏ trường nếu không có\.|
|`data.stage.pickup.address`|object|Có|Địa chỉ lấy đã được Address Module chuẩn hóa\.|
|`data.stage.pickup.address.model`|integer|Có|Mô hình địa chỉ đã áp dụng: `1` — ba cấp; `2` — hai cấp\.|
|`data.stage.pickup.address.detail`|string|Có|Phần địa chỉ chi tiết\.|
|`data.stage.pickup.address.full_address`|string|Có|Địa chỉ lấy đầy đủ đã ghép từ chi tiết và danh mục hành chính\.|
|`data.stage.pickup.address.province_code`|string|Có|Mã Tỉnh/Thành phố\.|
|`data.stage.pickup.address.district_code`|string|Có điều kiện|Trả khi địa chỉ dùng mô hình `1`; bỏ trường khi mô hình `2`\.|
|`data.stage.pickup.address.commune_code`|string|Có|Mã Phường/Xã\.|
|`data.stage.delivery`|object|Có|Điểm giao thực tế đã áp dụng cho chặng\.|
|`data.stage.delivery.contact_name`|string|Có|Tên người nhận kiện tại điểm giao\.|
|`data.stage.delivery.phone`|string|Có|Số điện thoại liên hệ giao hàng; được che theo quyền người gọi\.|
|`data.stage.delivery.note`|string|Không|Hướng dẫn giao hàng đã áp dụng; bỏ trường nếu không có\.|
|`data.stage.delivery.address`|object|Có|Địa chỉ giao đã được Address Module chuẩn hóa\.|
|`data.stage.delivery.address.model`|integer|Có|Mô hình địa chỉ đã áp dụng: `1` — ba cấp; `2` — hai cấp\.|
|`data.stage.delivery.address.detail`|string|Có|Phần địa chỉ chi tiết\.|
|`data.stage.delivery.address.full_address`|string|Có|Địa chỉ giao đầy đủ đã ghép từ chi tiết và danh mục hành chính\.|
|`data.stage.delivery.address.province_code`|string|Có|Mã Tỉnh/Thành phố\.|
|`data.stage.delivery.address.district_code`|string|Có điều kiện|Trả khi địa chỉ dùng mô hình `1`; bỏ trường khi mô hình `2`\.|
|`data.stage.delivery.address.commune_code`|string|Có|Mã Phường/Xã\.|
|`data.stage.parcel`|object|Có|Snapshot kiện hàng đã gửi sang NVC\.|
|`data.stage.parcel.content_type`|integer|Có|Cách khai báo hàng hóa: `1` — một tên hàng; `2` — danh sách sản phẩm\.|
|`data.stage.parcel.product_name`|string|Có điều kiện|Trả khi `content_type = 1`\.|
|`data.stage.parcel.products`|array\(object\)|Có điều kiện|Trả khi `content_type = 2`; mỗi phần tử gồm dữ liệu sản phẩm đã áp dụng\.|
|`data.stage.parcel.products[].sku`|string|Không|Mã sản phẩm của Shop; bỏ trường nếu không có\.|
|`data.stage.parcel.products[].name`|string|Có điều kiện|Bắt buộc trong mỗi phần tử `products[]`\.|
|`data.stage.parcel.products[].quantity`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử `products[]`\.|
|`data.stage.parcel.products[].unit_price`|integer|Không|Giá một sản phẩm bằng VND; bỏ trường nếu không khai báo\.|
|`data.stage.parcel.products[].unit_weight`|integer|Không|Khối lượng một sản phẩm bằng gram; bỏ trường nếu không khai báo\.|
|`data.stage.parcel.weight`|integer|Có|Tổng khối lượng kiện bằng gram\.|
|`data.stage.parcel.dimensions`|object|Không|Kích thước kiện đã áp dụng; bỏ object nếu Request không truyền và NVC không yêu cầu\.|
|`data.stage.parcel.dimensions.length`|number|Có điều kiện|Bắt buộc trong `dimensions`; chiều dài centimet\.|
|`data.stage.parcel.dimensions.width`|number|Có điều kiện|Bắt buộc trong `dimensions`; chiều rộng centimet\.|
|`data.stage.parcel.dimensions.height`|number|Có điều kiện|Bắt buộc trong `dimensions`; chiều cao centimet\.|
|`data.stage.parcel.declared_value`|integer|Có|Giá trị khai báo bằng VND\.|
|`data.stage.cod_amount`|integer|Có|COD của riêng chặng, đơn vị VND\.|
|`data.stage.fee_payer`|integer|Có|Bên trả phí: `1` — Shop/người gửi; `2` — người nhận\.|
|`data.stage.inspection`|integer|Có|Chính sách xem hàng đã áp dụng: `1`, `2` hoặc `3` như Request\.|
|`data.stage.pickup_method`|integer|Có|Cách gửi kiện đã áp dụng: `1` — NVC đến lấy; `2` — gửi tại điểm tiếp nhận\.|
|`data.stage.pickup_at`|datetime|Không|Thời điểm lấy mong muốn đã áp dụng; bỏ trường khi lấy sớm nhất có thể\.|
|`data.stage.services`|array\(integer\)|Có|Danh sách dịch vụ bổ sung đã áp dụng; trả `[]` nếu không có\.|
|`data.previous_carrier`|object|Có điều kiện|Chỉ trả khi `operation_type = 1`; NVC được gán cho chặng trước khi đổi\. Không trả khi tạo chặng hoàn mới\.|
|`data.previous_carrier.carrier_code`|integer|Có điều kiện|Bắt buộc trong `previous_carrier`; mã NVC cũ\.|
|`data.previous_carrier.carrier_name`|string|Có điều kiện|Bắt buộc trong `previous_carrier`; tên NVC cũ\.|
|`data.previous_carrier.carrier_waybill_code`|string|Không|Waybill cũ; bỏ trường nếu NVC cũ chưa cấp Waybill\.|
|`data.carrier`|object|Có|NVC được thiết lập cho chặng\.|
|`data.carrier.carrier_code`|integer|Có|Mã NVC được thiết lập\.|
|`data.carrier.carrier_name`|string|Có|Tên NVC được thiết lập\.|
|`data.carrier.carrier_waybill_code`|string|Có điều kiện|Chỉ trả khi NVC đã cấp Waybill; bỏ trường khi thao tác chưa hoàn tất\.|
|`data.active_carrier_code`|integer|Có điều kiện|Mã NVC đang thực tế chịu trách nhiệm cho chặng tại thời điểm Response\. Trả khi đã xác định được NVC đang hiệu lực; với đổi NVC đang đối soát Waybill cũ thì trả mã NVC cũ\. Bỏ trường nếu chặng hoàn mới chưa được NVC tiếp nhận và chưa có NVC nào đang hiệu lực\.|
|`data.pricing`|object|Có|Kết quả tính lại giá bán của Order sau khi điều phối NVC\. Không trả giá vốn NVC hoặc cấu trúc markup nội bộ trong object này\.|
|`data.pricing.status`|integer|Có|Trạng thái giá: `1` — đã tính và áp dụng; `2` — đang tính/chưa có kết quả xác định; `3` — tính giá thất bại và thao tác chưa được hoàn tất\.|
|`data.pricing.previous_pricing_code`|string|Có điều kiện|Trả khi trước điều phối Order đã có mã giá đang áp dụng\. Bỏ trường nếu chưa từng có mã giá\.|
|`data.pricing.pricing_code`|string|Có điều kiện|Trả khi `pricing.status = 1`; mã giá mới đã áp dụng cho Order/chặng\.|
|`data.pricing.currency`|string|Có điều kiện|Trả khi `pricing.status = 1`; mã tiền tệ, hiện tại là `VND`\.|
|`data.pricing.fee_payer`|integer|Có điều kiện|Trả khi `pricing.status = 1`: `1` — Shop/người gửi trả phí; `2` — người nhận trả phí\.|
|`data.pricing.cod_amount`|integer|Có điều kiện|Trả khi `pricing.status = 1`; tiền thu hộ hàng hóa của Order sau điều phối, số nguyên VND từ `0` trở lên\. Việc đổi NVC không tự thay đổi COD hàng hóa\.|
|`data.pricing.collection_amount`|integer|Có điều kiện|Trả khi `pricing.status = 1`; tổng số tiền người nhận phải thanh toán theo phí và COD đang áp dụng sau điều phối, số nguyên VND từ `0` trở lên\.|
|`data.pricing.previous_shipping_fee`|integer|Có điều kiện|Trả khi `pricing.status = 1`; tổng phí vận chuyển trước điều phối, số nguyên VND từ `0` trở lên\.|
|`data.pricing.shipping_fee`|integer|Có điều kiện|Trả khi `pricing.status = 1`; tổng phí vận chuyển mới đã áp dụng, số nguyên VND từ `0` trở lên\.|
|`data.pricing.fee_difference`|integer|Có điều kiện|Trả khi `pricing.status = 1`; chênh lệch bằng phí mới trừ phí cũ\. Số dương là tăng phí, `0` là không đổi, số âm là giảm phí\.|
|`data.pricing.fee_items`|array\(object\)|Có điều kiện|Trả khi `pricing.status = 1`; chi tiết các khoản cấu thành phí mới\. Trả `[]` nếu không có khoản phí chi tiết\.|
|`data.pricing.fee_items[].fee_type`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; loại phí như `SHIPPING`, `INSURANCE`, `RETURN`, `REMOTE_AREA` hoặc `OTHER`\.|
|`data.pricing.fee_items[].fee_name`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; tên phí bằng tiếng Việt\.|
|`data.pricing.fee_items[].amount`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử; số tiền của khoản phí, đơn vị VND, từ `0` trở lên\.|
|`data.pricing.adjustment`|object|Có điều kiện|Chỉ trả khi `fee_difference` khác `0`; khoản cần thu thêm hoặc hoàn lại do thay đổi NVC\.|
|`data.pricing.adjustment.adjustment_type`|integer|Có điều kiện|Bắt buộc trong `adjustment`: `1` — cần thu thêm; `2` — cần hoàn/khấu trừ lại\.|
|`data.pricing.adjustment.amount`|integer|Có điều kiện|Bắt buộc trong `adjustment`; giá trị tuyệt đối của chênh lệch phí, số nguyên VND lớn hơn `0`\.|
|`data.pricing.adjustment.status`|integer|Có điều kiện|Bắt buộc trong `adjustment`: `1` — đang chờ xử lý; `2` — đã hoàn tất; `3` — xử lý thất bại\. Đây là trạng thái khoản điều chỉnh, không phải trạng thái Order\.|
|`data.pricing.priced_at`|datetime|Có điều kiện|Trả khi `pricing.status = 1`; thời điểm giá mới được tính và áp dụng theo ISO 8601 có múi giờ\.|
|`data.order_status`|string|Có|Trạng thái thực tế của Order sau thao tác\.|
|`data.status_name`|string|Có|Tên tiếng Việt của trạng thái Order thực tế\.|
|`data.updated_at`|datetime|Có|Thời điểm cập nhật gần nhất theo ISO 8601 có múi giờ\.|

##### Ví dụ Response — đổi thành công từ J&T Express sang SuperShip

```JSON
{
  "error": false,
  "message": "Đã đổi đơn vị vận chuyển thành công.",
  "data": {
    "order_code": "9001156990401",
    "operation_type": 1,
    "stage_code": "STG-DELIVERY-0001",
    "operation_status": 1,
    "stage": {
      "pickup": {
        "contact_name": "Nguyễn Minh Hậu",
        "phone": "0908123456",
        "address": {
          "model": 2,
          "detail": "48 Trường Sơn",
          "full_address": "48 Trường Sơn, Phường Tân Sơn Hòa, Thành phố Hồ Chí Minh",
          "province_code": "P01",
          "commune_code": "P01C0001"
        }
      },
      "delivery": {
        "contact_name": "Nguyễn Minh Anh",
        "phone": "0948123404",
        "address": {
          "model": 2,
          "detail": "120 Thân Nhân Trung",
          "full_address": "120 Thân Nhân Trung, Phường Tân Sơn, Thành phố Hồ Chí Minh",
          "province_code": "P01",
          "commune_code": "P01C0002"
        }
      },
      "parcel": {
        "content_type": 1,
        "product_name": "Bộ chăm sóc tóc",
        "weight": 680,
        "declared_value": 420000
      },
      "cod_amount": 420000,
      "fee_payer": 1,
      "inspection": 2,
      "pickup_method": 1,
      "services": []
    },
    "previous_carrier": {
      "carrier_code": 3,
      "carrier_name": "J&T Express",
      "carrier_waybill_code": "802808938571"
    },
    "carrier": {
      "carrier_code": 1,
      "carrier_name": "SuperShip",
      "carrier_waybill_code": "STGS983262LM.826941741"
    },
    "active_carrier_code": 1,
    "pricing": {
      "status": 1,
      "previous_pricing_code": "PRC-S983262-JNT-202609",
      "pricing_code": "PRC-S983262-SPS-202609",
      "currency": "VND",
      "fee_payer": 1,
      "cod_amount": 200000,
      "collection_amount": 200000,
      "previous_shipping_fee": 24000,
      "shipping_fee": 28000,
      "fee_difference": 4000,
      "fee_items": [
        {
          "fee_type": "SHIPPING",
          "fee_name": "Phí vận chuyển",
          "amount": 28000
        }
      ],
      "adjustment": {
        "adjustment_type": 1,
        "amount": 4000,
        "status": 1
      },
      "priced_at": "2026-09-16T17:09:58+07:00"
    },
    "order_status": "SPF-0601",
    "status_name": "Chờ bàn giao",
    "updated_at": "2026-09-16T17:10:00+07:00"
  }
}
```

##### Ví dụ Response — tạo chặng hoàn mới và gán J&T Express

```JSON
{
  "error": false,
  "message": "Đã tạo chặng hoàn và thiết lập đơn vị vận chuyển thành công.",
  "data": {
    "order_code": "9001156990401",
    "operation_type": 2,
    "stage_code": "STG-RETURN-0001",
    "operation_status": 1,
    "stage": {
      "pickup": {
        "contact_name": "Nguyễn Minh Anh",
        "phone": "0948123404",
        "note": "Gọi trước khi đến lấy hàng hoàn",
        "address": {
          "model": 2,
          "detail": "120 Thân Nhân Trung",
          "full_address": "120 Thân Nhân Trung, Phường Tân Sơn, Thành phố Hồ Chí Minh",
          "province_code": "P01",
          "commune_code": "P01C0002"
        }
      },
      "delivery": {
        "contact_name": "Nguyễn Minh Hậu",
        "phone": "0908123456",
        "address": {
          "model": 2,
          "detail": "231/15 Dương Bá Trạc",
          "full_address": "231/15 Dương Bá Trạc, Phường Chánh Hưng, Thành phố Hồ Chí Minh",
          "province_code": "P01",
          "commune_code": "P01C0003"
        }
      },
      "parcel": {
        "content_type": 1,
        "product_name": "Bộ chăm sóc tóc",
        "weight": 680,
        "declared_value": 420000
      },
      "cod_amount": 0,
      "fee_payer": 1,
      "inspection": 1,
      "pickup_method": 1,
      "services": []
    },
    "carrier": {
      "carrier_code": 3,
      "carrier_name": "J&T Express",
      "carrier_waybill_code": "802808938572"
    },
    "active_carrier_code": 3,
    "pricing": {
      "status": 1,
      "previous_pricing_code": "PRC-S983262-GHN-202609",
      "pricing_code": "PRC-S983262-JNT-RETURN-202609",
      "currency": "VND",
      "fee_payer": 1,
      "cod_amount": 200000,
      "collection_amount": 200000,
      "previous_shipping_fee": 19000,
      "shipping_fee": 49000,
      "fee_difference": 30000,
      "fee_items": [
        {
          "fee_type": "SHIPPING",
          "fee_name": "Phí giao hàng",
          "amount": 19000
        },
        {
          "fee_type": "RETURN",
          "fee_name": "Phí lấy và vận chuyển hàng hoàn",
          "amount": 30000
        }
      ],
      "adjustment": {
        "adjustment_type": 1,
        "amount": 30000,
        "status": 1
      },
      "priced_at": "2026-09-16T17:19:58+07:00"
    },
    "order_status": "SPF-1003",
    "status_name": "Chờ lấy hàng hoàn",
    "updated_at": "2026-09-16T17:20:00+07:00"
  }
}
```

##### Ví dụ Response — chưa xác định kết quả Waybill cũ

```JSON
{
  "error": false,
  "message": "Đang đối soát kết quả vận đơn cũ; chưa chuyển sang đơn vị vận chuyển mới.",
  "data": {
    "order_code": "9001156990401",
    "operation_type": 1,
    "stage_code": "STG-DELIVERY-0001",
    "operation_status": 3,
    "stage": {
      "pickup": {
        "contact_name": "Nguyễn Minh Hậu",
        "phone": "0908123456",
        "address": {
          "model": 2,
          "detail": "48 Trường Sơn",
          "full_address": "48 Trường Sơn, Phường Tân Sơn Hòa, Thành phố Hồ Chí Minh",
          "province_code": "P01",
          "commune_code": "P01C0001"
        }
      },
      "delivery": {
        "contact_name": "Nguyễn Minh Anh",
        "phone": "0948123404",
        "address": {
          "model": 2,
          "detail": "120 Thân Nhân Trung",
          "full_address": "120 Thân Nhân Trung, Phường Tân Sơn, Thành phố Hồ Chí Minh",
          "province_code": "P01",
          "commune_code": "P01C0002"
        }
      },
      "parcel": {
        "content_type": 1,
        "product_name": "Bộ chăm sóc tóc",
        "weight": 680,
        "declared_value": 420000
      },
      "cod_amount": 420000,
      "fee_payer": 1,
      "inspection": 2,
      "pickup_method": 1,
      "services": []
    },
    "previous_carrier": {
      "carrier_code": 3,
      "carrier_name": "J&T Express",
      "carrier_waybill_code": "802808938571"
    },
    "carrier": {
      "carrier_code": 1,
      "carrier_name": "SuperShip"
    },
    "active_carrier_code": 3,
    "pricing": {
      "status": 2
    },
    "order_status": "SPF-0601",
    "status_name": "Chờ bàn giao",
    "updated_at": "2026-09-16T17:10:00+07:00"
  }
}
```

##### Ví dụ Response — NVC hoàn chưa trả kết quả xác định

```JSON
{
  "error": false,
  "message": "Đang chờ kết quả tiếp nhận chặng hoàn từ đơn vị vận chuyển.",
  "data": {
    "order_code": "9001156990401",
    "operation_type": 2,
    "stage_code": "STG-RETURN-0001",
    "operation_status": 2,
    "stage": {
      "pickup": {
        "contact_name": "Nguyễn Minh Anh",
        "phone": "0948123404",
        "note": "Gọi trước khi đến lấy hàng hoàn",
        "address": {
          "model": 2,
          "detail": "120 Thân Nhân Trung",
          "full_address": "120 Thân Nhân Trung, Phường Tân Sơn, Thành phố Hồ Chí Minh",
          "province_code": "P01",
          "commune_code": "P01C0002"
        }
      },
      "delivery": {
        "contact_name": "Nguyễn Minh Hậu",
        "phone": "0908123456",
        "address": {
          "model": 2,
          "detail": "231/15 Dương Bá Trạc",
          "full_address": "231/15 Dương Bá Trạc, Phường Chánh Hưng, Thành phố Hồ Chí Minh",
          "province_code": "P01",
          "commune_code": "P01C0003"
        }
      },
      "parcel": {
        "content_type": 1,
        "product_name": "Bộ chăm sóc tóc",
        "weight": 680,
        "declared_value": 420000
      },
      "cod_amount": 0,
      "fee_payer": 1,
      "inspection": 1,
      "pickup_method": 1,
      "services": []
    },
    "carrier": {
      "carrier_code": 3,
      "carrier_name": "J&T Express"
    },
    "pricing": {
      "status": 2
    },
    "order_status": "SPF-0901",
    "status_name": "Đã giao hàng",
    "updated_at": "2026-09-16T17:20:00+07:00"
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`400 Bad Request`|`INVALID_CARRIER_OPERATION_DATA`|Thiếu trường bắt buộc, gửi sai tổ hợp trường theo `operation_type`, mã NVC/lý do không hợp lệ hoặc `reason_code = 99` nhưng thiếu `reason`\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_CARRIER_OPERATION_FORBIDDEN`|Người gọi không có quyền nội bộ hoặc Order nằm ngoài Data Scope\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi được phép thao tác\.|
|`422 Unprocessable Entity`|`ACTIVE_STAGE_NOT_FOUND`|Backend không xác định được duy nhất chặng hiện tại phù hợp với loại điều phối đã chọn\. Consumer không cần truyền mã chặng để sửa lỗi này\.|
|`422 Unprocessable Entity`|`INVALID_STAGE_ROUTE`|Điểm lấy hoặc điểm giao không hợp lệ, không chuẩn hóa được địa chỉ, hai đầu tuyến không phù hợp với nghiệp vụ đã chọn hoặc thiếu tọa độ chuẩn đối với NVC tức thời\.|
|`422 Unprocessable Entity`|`INVALID_STAGE_PARCEL`|Thông tin kiện, khối lượng, kích thước, giá trị khai báo hoặc COD không hợp lệ hay vượt capability của NVC mục tiêu\.|
|`409 Conflict`|`IDEMPOTENCY_CONFLICT`|Cùng `Idempotency-Key` nhưng Request Body khác lần gọi đầu\.|
|`409 Conflict`|`CARRIER_OPERATION_IN_PROGRESS`|Chặng đang có thao tác thiết lập NVC chưa hoàn tất\.|
|`409 Conflict`|`RETURN_STAGE_ALREADY_EXISTS`|Order đã có chặng hoàn đang hoạt động nên không được tạo thêm chặng hoàn trùng\.|
|`422 Unprocessable Entity`|`SAME_CARRIER_NOT_ALLOWED`|Với `operation_type = 1`, `carrier_code` trùng NVC hiện tại\.|
|`422 Unprocessable Entity`|`CARRIER_CHANGE_NOT_ALLOWED`|Chặng cần đổi đã hoàn thành, NVC hiện tại đã giữ hàng hoặc trạng thái chặng không cho phép đổi trực tiếp\.|
|`422 Unprocessable Entity`|`RETURN_STAGE_NOT_ALLOWED`|Order chưa đủ điều kiện phát sinh chặng hoàn mới hoặc phạm vi hàng, điểm lấy hay điểm trả đã xác nhận trên Order không còn hợp lệ\.|
|`422 Unprocessable Entity`|`TARGET_CARRIER_NOT_ELIGIBLE`|NVC mới không được bật cho Shop/Application, không phục vụ tuyến, không hỗ trợ loại hàng/COD hoặc không đủ điều kiện thực hiện chặng\.|
|`422 Unprocessable Entity`|`PRICE_CHANGE_NOT_ALLOWED`|Giá mới vượt ngưỡng điều chỉnh hoặc chính sách giá hiện tại không cho phép tự áp dụng; NVC mới chưa được kích hoạt\.|
|`422 Unprocessable Entity`|`RETURN_CARRIER_REJECTED`|NVC được chọn đã từ chối tiếp nhận chặng hoàn; Order không chuyển sang `SPF-1003` hoặc `SPF-1007`\.|
|`409 Conflict`|`CURRENT_WAYBILL_RESULT_UNKNOWN`|Chưa xác định được Waybill cũ đã hủy thành công hay chưa; chưa được tạo Waybill mới để tránh hai NVC cùng thực hiện một chặng\.|
|`503 Service Unavailable`|`PRICING_UNAVAILABLE`|Không thể tính hoặc xác nhận giá mới; thao tác chưa được hoàn tất và không âm thầm áp dụng mức phí chưa xác định\.|
|`503 Service Unavailable`|`CARRIER_OPERATION_UNAVAILABLE`|Tạm thời không thể thiết lập NVC an toàn\.|

## 4\.3\. Nhóm Chặng và hành trình vận chuyển

Các API trong nhóm này phục vụ những mức thông tin khác nhau và không thay thế lẫn nhau:

|Mục|API|Dữ liệu trả về|Mục đích sử dụng|
|---|---|---|---|
|4\.3\.1|`GET /v1/orders/{order_code}/stages`|Danh sách và snapshot cuối của tất cả chặng|Dựng danh sách chặng, xác định chặng hiện hành, NVC/Waybill của từng chặng và vị trí hiện tại của toàn kiện\. Không trả toàn bộ sự kiện từng chặng\.|
|4\.3\.2|`GET /v1/orders/{order_code}/stages/{stage_code}`|Toàn bộ thông tin của một chặng và `events[]` thuộc chặng đó|Dùng khi mở rộng hoặc mở trang chi tiết một chặng để xem diễn biến từ đầu đến trạng thái cuối/hiện tại\.|
|4\.3\.3|`GET /v1/orders/{order_code}/stages/{stage_code}/waybills`|Các Waybill cũ, hiện hành, bị hủy hoặc bị thay thế của một chặng|Phục vụ điều tra đổi NVC, tạo lại vận đơn hoặc Waybill bị thay thế\. Không phải hành trình trạng thái hàng hóa\.|
|4\.3\.4|`GET /v1/orders/{order_code}/tracking`|Hành trình của toàn Order, nhóm `events[]` theo tất cả chặng|Dựng toàn bộ khối “Hành trình đơn hàng theo từng chặng” giống giao diện minh họa\. Đây là API phù hợp với ảnh có đồng thời Chặng 1 và Chặng 2\.|
|4\.3\.5|`GET /v1/orders/{order_code}/shipper`|Người và phương tiện đang thực hiện chặng hiện hành|Hiển thị nhanh người đang lấy, giao hoặc trả hàng khi NVC có cung cấp dữ liệu\. Không trả lịch sử người đã hoàn thành hoặc bị thay thế\.|
|4\.3\.6|`GET /v1/orders/{order_code}/shippers`|Toàn bộ người từng được phân công trên tất cả chặng|Shop và nội bộ xem ai đã phụ trách từng phần của Order; nội bộ được xem thêm dữ liệu liên hệ và lý do kết thúc/thay thế theo quyền\.|
|4\.3\.7|`GET /v1/orders/{order_code}/sla`|Mốc dự kiến, thực tế và tình trạng đúng hạn của Order/chặng|Phục vụ theo dõi cam kết thời gian; không trả trạng thái hay lịch sử Waybill\.|

### 4\.3\.1\. Lấy danh sách chặng vận chuyển

Lấy toàn bộ chặng vận chuyển của Order theo đúng thứ tự thực hiện\. Một Order có thể có nhiều chặng cùng loại khi đổi hàng, thu hồi, giao lại hoặc hoàn qua nhiều NVC; API không giới hạn số chặng và không gộp các chặng chỉ vì cùng NVC\.

Trạng thái toàn Order, trạng thái chặng và trạng thái gốc NVC là ba lớp dữ liệu độc lập\. `status_code`/`status_name` trong từng phần tử chỉ mô tả chặng đó và có thể khác trạng thái hiện tại của toàn Order\. `carrier_status_code`/`carrier_status_name` giữ nguyên dữ liệu NVC cung cấp và không được tự đặt để thay thế trạng thái chặng\.

Mục tiêu của API là giúp Shop và nhân viên nội bộ nhìn được Order đã đi qua những chặng nào, NVC và vận đơn nào phụ trách từng chặng, chặng nào đang thực hiện và kiện hiện đang ở đâu\. API này không thay thế timeline chi tiết: danh sách chỉ trả snapshot hiện tại của từng chặng; các mốc vị trí/trạng thái trong quá khứ thuộc API Tracking\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/orders/{order_code}/stages`|
|Thành công|`200 OK`|
|Quyền truy cập|Shop, đối tác được ủy quyền hoặc nhân viên nội bộ có quyền xem Order; trường kỹ thuật được lọc theo quyền và Data Scope\.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định người gọi, quyền và Data Scope được phép truy cập.|
|`X-Correlation-Id`|Không|Mã truy vết do Consumer truyền; Backend tự tạo nếu không có.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order SuperPlatform gồm đúng 13 chữ số\.|

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|`false` khi API xử lý thành công\.|
|`message`|string|Có|Thông báo ngắn gọn bằng tiếng Việt\.|
|`data`|object|Có|Danh sách chặng theo phạm vi người gọi được phép xem\.|
|`data.order_code`|string|Có|Mã Order\.|
|`data.order_status`|string|Có|Mã trạng thái hiện tại của toàn Order, được tổng hợp từ toàn bộ các chặng\. Giá trị này không thay thế trạng thái riêng trong từng phần tử `items[]`\.|
|`data.order_status_name`|string|Có|Tên trạng thái hiện tại của toàn Order bằng tiếng Việt\.|
|`data.total_stages`|integer|Có|Tổng số chặng của Order, là số nguyên từ `0` trở lên\.|
|`data.current_stage_code`|string|Không|Mã chặng đang thực hiện; bỏ trường nếu không có chặng hiện hành\.|
|`data.current_location`|object|Không|Vị trí hiện tại đáng tin cậy của kiện hàng trên toàn Order, thuộc chặng đang thực hiện\. Chỉ trả khi NVC hoặc sự kiện kho đã cung cấp vị trí; không suy ra từ trạng thái và không gắn vào chặng cũ đã hoàn tất\.|
|`data.current_location.province_name`|string|Không|Tên Tỉnh/Thành phố hiện tại nếu xác định được\.|
|`data.current_location.district_name`|string|Không|Tên Quận/Huyện hiện tại nếu nguồn sử dụng mô hình hành chính ba cấp và có cung cấp dữ liệu\.|
|`data.current_location.commune_name`|string|Không|Tên Phường/Xã hiện tại nếu xác định được\.|
|`data.current_location.facility_name`|string|Không|Tên bưu cục, Hub hoặc điểm khai thác hiện đang giữ hoặc vừa ghi nhận kiện\.|
|`data.current_location.recorded_at`|datetime|Có điều kiện|Bắt buộc khi có `current_location`; thời điểm vị trí được NVC hoặc sự kiện kho ghi nhận\.|
|`data.items`|array\(object\)|Có|Các chặng sắp xếp tăng dần theo `stage_no`; trả `[]` nếu chưa phát sinh chặng\.|
|`data.items[].stage_code`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; mã chặng dùng cho API chi tiết chặng và lịch sử Waybill\.|
|`data.items[].stage_no`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử; số thứ tự thực hiện chặng, bắt đầu từ `1`\.|
|`data.items[].leg_type`|integer|Có|Loại chặng: `1` — Lấy hàng; `2` — Giao hàng; `3` — Hoàn hàng; `4` — Trả hàng cuối\.|
|`data.items[].leg_name`|string|Có|Tên chặng\.|
|`data.items[].is_current`|boolean|Có|`true` nếu là chặng đang được thực hiện; tại một thời điểm chỉ có tối đa một chặng tuần tự mang giá trị `true`\.|
|`data.items[].carrier_code`|integer|Không|Mã NVC hiện hành; bỏ trường nếu chặng chưa được gán NVC\.|
|`data.items[].carrier_name`|string|Không|Tên NVC hiện hành; bỏ trường nếu chặng chưa được gán NVC\.|
|`data.items[].carrier_client_code`|string|Không|Mã khách hàng áp dụng tại NVC; bỏ trường nếu chưa có hoặc người gọi không được xem\.|
|`data.items[].carrier_waybill_code`|string|Không|Waybill hiện hành; bỏ trường nếu NVC chưa cấp\.|
|`data.items[].carrier_sorting_code`|string|Không|Mã phân loại của Waybill; bỏ trường nếu NVC không cung cấp\.|
|`data.items[].status_code`|string|Có|Mã trạng thái chuẩn hóa SuperPlatform hiện tại của chặng\.|
|`data.items[].status_name`|string|Có|Tên tiếng Việt của trạng thái chuẩn hóa\.|
|`data.items[].carrier_status_code`|string|Không|Mã trạng thái cuối cùng gần nhất của NVC trên chính chặng này, giữ nguyên giá trị và biểu diễn dưới dạng chuỗi\. Chặng đã kết thúc vẫn giữ mã cuối cùng; bỏ trường nếu NVC chỉ cung cấp tên mà không có mã đã xác nhận\. Chỉ người gọi nội bộ có quyền mới được xem\.|
|`data.items[].carrier_status_name`|string|Không|Tên trạng thái cuối cùng gần nhất của NVC trên chính chặng này\. Chặng cũ vẫn giữ tên trạng thái cuối cùng để biết NVC đã kết thúc chặng ở bước nào\. Có thể xuất hiện không kèm mã khi nguồn NVC chỉ có tên trạng thái; không tự đặt mã thay thế\. Chỉ người gọi nội bộ có quyền mới được xem\.|
|`data.items[].started_at`|datetime|Không|Thời điểm chặng thực tế bắt đầu; bỏ trường nếu chưa bắt đầu\.|
|`data.items[].completed_at`|datetime|Không|Thời điểm chặng hoàn tất; bỏ trường nếu chưa hoàn tất\.|
|`data.items[].updated_at`|datetime|Có|Thời điểm chặng được cập nhật gần nhất\.|

##### Ví dụ Response — nhiều NVC thực hiện các chặng khác nhau

```JSON
{
  "error": false,
  "message": "Lấy danh sách chặng thành công.",
  "data": {
    "order_code": "9001156990401",
    "order_status": "SPF-1009",
    "order_status_name": "Đang chuyển hoàn",
    "total_stages": 3,
    "current_stage_code": "STG-RETURN-0001",
    "current_location": {
      "province_name": "Thành phố Hồ Chí Minh",
      "recorded_at": "2026-09-17T09:20:00+07:00"
    },
    "items": [
      {
        "stage_code": "STG-PICKUP-0001",
        "stage_no": 1,
        "leg_type": 1,
        "leg_name": "Lấy hàng",
        "is_current": false,
        "carrier_code": 1,
        "carrier_name": "SuperShip",
        "carrier_client_code": "S275518",
        "carrier_waybill_code": "STGS983262LM.826941741",
        "status_code": "SPF-0501",
        "status_name": "Đã lấy hàng",
        "carrier_status_code": "SPS-201",
        "carrier_status_name": "Lấy hàng thành công",
        "started_at": "2026-09-15T08:00:00+07:00",
        "completed_at": "2026-09-15T09:45:00+07:00",
        "updated_at": "2026-09-15T09:45:00+07:00"
      },
      {
        "stage_code": "STG-DELIVERY-0001",
        "stage_no": 2,
        "leg_type": 2,
        "leg_name": "Giao hàng",
        "is_current": false,
        "carrier_code": 2,
        "carrier_name": "Giao Hàng Nhanh",
        "carrier_client_code": "S275518",
        "carrier_waybill_code": "GY8YLSDK",
        "carrier_sorting_code": "100-A2-09-00",
        "status_code": "SPF-0802",
        "status_name": "Giao hàng thất bại",
        "carrier_status_code": "delivery_fail",
        "carrier_status_name": "Giao hàng không thành công",
        "started_at": "2026-09-15T10:15:00+07:00",
        "completed_at": "2026-09-16T16:10:00+07:00",
        "updated_at": "2026-09-16T16:10:00+07:00"
      },
      {
        "stage_code": "STG-RETURN-0001",
        "stage_no": 3,
        "leg_type": 3,
        "leg_name": "Hoàn hàng",
        "is_current": true,
        "carrier_code": 6,
        "carrier_name": "BEST Express",
        "carrier_client_code": "S275518",
        "carrier_waybill_code": "999800060087994",
        "status_code": "SPF-1009",
        "status_name": "Đang chuyển hoàn",
        "carrier_status_code": "705",
        "carrier_status_name": "Xuất hàng để trả về",
        "started_at": "2026-09-17T08:15:00+07:00",
        "updated_at": "2026-09-17T09:20:00+07:00"
      }
    ]
  }
}
```

Ví dụ này thể hiện ba NVC khác nhau lần lượt phụ trách lấy hàng, giao hàng và hoàn hàng\. Mỗi chặng có Waybill và trạng thái NVC riêng; chặng cũ vẫn giữ trạng thái cuối cùng dù không còn là chặng hiện hành\.

##### Ví dụ Response — một NVC và một Waybill thực hiện xuyên suốt ba chặng

```JSON
{
  "error": false,
  "message": "Lấy danh sách chặng thành công.",
  "data": {
    "order_code": "9001156990401",
    "order_status": "SPF-1009",
    "order_status_name": "Đang chuyển hoàn",
    "total_stages": 3,
    "current_stage_code": "STG-RETURN-0001",
    "current_location": {
      "province_name": "Thành phố Hồ Chí Minh",
      "recorded_at": "2026-09-17T09:20:00+07:00"
    },
    "items": [
      {
        "stage_code": "STG-PICKUP-0001",
        "stage_no": 1,
        "leg_type": 1,
        "leg_name": "Lấy hàng",
        "is_current": false,
        "carrier_code": 1,
        "carrier_name": "SuperShip",
        "carrier_client_code": "S275518",
        "carrier_waybill_code": "STGS983262LM.826941741",
        "status_code": "SPF-0501",
        "status_name": "Đã lấy hàng",
        "carrier_status_code": "SPS-201",
        "carrier_status_name": "Lấy hàng thành công",
        "started_at": "2026-09-15T08:00:00+07:00",
        "completed_at": "2026-09-15T09:45:00+07:00",
        "updated_at": "2026-09-15T09:45:00+07:00"
      },
      {
        "stage_code": "STG-DELIVERY-0001",
        "stage_no": 2,
        "leg_type": 2,
        "leg_name": "Giao hàng",
        "is_current": false,
        "carrier_code": 1,
        "carrier_name": "SuperShip",
        "carrier_client_code": "S275518",
        "carrier_waybill_code": "STGS983262LM.826941741",
        "status_code": "SPF-0802",
        "status_name": "Giao hàng thất bại",
        "carrier_status_code": "SPS-402",
        "carrier_status_name": "Không giao được",
        "started_at": "2026-09-15T10:15:00+07:00",
        "completed_at": "2026-09-16T16:10:00+07:00",
        "updated_at": "2026-09-16T16:10:00+07:00"
      },
      {
        "stage_code": "STG-RETURN-0001",
        "stage_no": 3,
        "leg_type": 3,
        "leg_name": "Hoàn hàng",
        "is_current": true,
        "carrier_code": 1,
        "carrier_name": "SuperShip",
        "carrier_client_code": "S275518",
        "carrier_waybill_code": "STGS983262LM.826941741",
        "status_code": "SPF-1009",
        "status_name": "Đang chuyển hoàn",
        "carrier_status_code": "SPS-604",
        "carrier_status_name": "Đang trả hàng",
        "started_at": "2026-09-17T08:15:00+07:00",
        "updated_at": "2026-09-17T09:20:00+07:00"
      }
    ]
  }
}
```

Trong ví dụ trên, SuperShip thực hiện xuyên suốt ba chặng bằng cùng Waybill `STGS983262LM.826941741`\. Chặng lấy giữ trạng thái cuối `SPS-201 — Lấy hàng thành công`; chặng giao giữ kết quả `SPS-402 — Không giao được`; chặng hoàn hiện hành mang `SPS-604 — Đang trả hàng`\. Toàn Order đang ở `SPF-1009 — Đang chuyển hoàn`, không bị ghi đè bởi trạng thái đã kết thúc của hai chặng trước\.

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_STAGES_FORBIDDEN`|Người gọi không có quyền xem Order hoặc nằm ngoài Data Scope\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi được phép xem\.|
|`503 Service Unavailable`|`ORDER_STAGES_UNAVAILABLE`|Tạm thời không thể tải danh sách chặng\.|

### 4\.3\.2\. Lấy chi tiết chặng vận chuyển

Lấy đầy đủ thông tin và hành trình của đúng một chặng thuộc Order\. API giúp Shop hoặc nhân viên nội bộ biết chặng làm nhiệm vụ gì, NVC và Waybill nào phụ trách, trạng thái hiện tại hoặc kết quả cuối của chặng và kiện đã đi qua những mốc nào trong chặng\.

API này phục vụ màn hình mở rộng chi tiết một chặng\. Nó trả `events[]` của riêng chặng được chọn, không trả sự kiện thuộc chặng khác\. Lịch sử vận đơn là dữ liệu khác: lịch sử vận đơn cho biết chặng từng sử dụng những Waybill nào và Waybill nào bị thay thế, còn hành trình chặng cho biết kiện hàng đã diễn biến như thế nào theo thời gian\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/orders/{order_code}/stages/{stage_code}`|
|Thành công|`200 OK`|
|Quyền truy cập|Shop, đối tác được ủy quyền hoặc nhân viên nội bộ có quyền xem Order; dữ liệu được giới hạn theo Data Scope và phạm vi hiển thị của người gọi\.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định người gọi, quyền và Data Scope\.|
|`X-Correlation-Id`|Không|Mã truy vết do Consumer truyền; Backend tự tạo nếu không có\.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order SuperPlatform gồm đúng 13 chữ số\.|
|`stage_code`|string|Có|Mã chặng lấy từ API danh sách chặng và phải thuộc đúng Order\.|

##### Ví dụ cURL

```Bash
curl --request GET '{{base_url}}/v1/orders/9001156990401/stages/STG-PICKUP-0001' \
  --header 'Authorization: Bearer {{access_token}}' \
  --header 'X-Correlation-Id: 8bf43ce2-a7fd-4d83-9404-c10be8958f61'
```

#### Response

Response phân biệt rõ ba lớp trạng thái:

- `order_status`/`order_status_name`: trạng thái tổng thể hiện tại của toàn Order, chỉ dùng làm ngữ cảnh\.
- `stage_status_code`/`stage_status_name`: trạng thái riêng của chặng sau khi SuperPlatform chuẩn hóa, dùng để hiển thị nghiệp vụ\.
- `carrier_status_code`/`carrier_status_name`: trạng thái gốc của NVC, dùng để đối chiếu và hỗ trợ vận hành\. Đây không phải một trạng thái Order khác\.

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|Thành công trả `false`\.|
|`message`|string|Có|Thông báo kết quả bằng tiếng Việt\.|
|`data`|object|Có|Chi tiết chặng được phép hiển thị\.|
|`data.order_code`|string|Có|Mã Order SuperPlatform\.|
|`data.order_status`|string|Có|Mã trạng thái tổng thể hiện tại của toàn Order\. Trường này chỉ cung cấp ngữ cảnh và không thay thế `stage_status_code` của chặng đang xem\.|
|`data.order_status_name`|string|Có|Tên trạng thái tổng thể hiện tại của toàn Order bằng tiếng Việt\.|
|`data.stage_code`|string|Có|Mã chặng\.|
|`data.stage_no`|integer|Có|Số thứ tự thực hiện chặng, bắt đầu từ `1`\.|
|`data.leg_type`|integer|Có|Loại chặng: `1` — lấy hàng; `2` — giao hàng; `3` — hoàn hàng; `4` — trả hàng cuối\.|
|`data.leg_name`|string|Có|Tên chặng bằng tiếng Việt\.|
|`data.is_current`|boolean|Có|Cho biết đây có phải chặng hiện tại của Order hay không\.|
|`data.carrier_code`|integer|Không|Mã NVC trong Carrier Registry; bỏ trường nếu chưa gán NVC\.|
|`data.carrier_name`|string|Không|Tên NVC thực hiện chặng; bỏ trường nếu chưa gán NVC\.|
|`data.carrier_client_code`|string|Không|Mã khách hàng/Shop tương ứng tại NVC; bỏ trường nếu chưa có hoặc người gọi không được xem\.|
|`data.carrier_waybill_code`|string|Không|Mã vận đơn hiện hành; bỏ trường nếu NVC chưa cấp\.|
|`data.carrier_sorting_code`|string|Không|Mã phân loại do NVC cấp; bỏ trường nếu NVC không cung cấp\.|
|`data.carrier_status_code`|string|Không|Mã trạng thái cuối cùng gần nhất của NVC trên chặng, giữ nguyên giá trị và biểu diễn dưới dạng chuỗi\. Chỉ trả cho người gọi nội bộ có quyền; bỏ trường nếu chưa có sự kiện NVC hoặc mã chưa được xác nhận\.|
|`data.carrier_status_name`|string|Không|Tên trạng thái cuối cùng gần nhất của NVC trên chặng\. Chặng cũ vẫn giữ trạng thái cuối cùng; không lấy trạng thái hiện tại của Waybill dùng chung để ghi đè kết quả lịch sử của chặng cũ\. Có thể trả cho Shop dưới dạng phù hợp với chính sách hiển thị\.|
|`data.carrier_status_at`|datetime|Có điều kiện|Bắt buộc khi có `carrier_status_code` hoặc `carrier_status_name`; thời điểm trạng thái NVC này thực tế phát sinh, theo ISO 8601 có múi giờ\.|
|`data.stage_status_code`|string|Có|Mã trạng thái hiện tại hoặc kết quả cuối của riêng chặng, đã chuẩn hóa theo bộ trạng thái SuperPlatform\. Không phải trạng thái toàn Order\.|
|`data.stage_status_name`|string|Có|Tên tiếng Việt của trạng thái hiện tại hoặc kết quả cuối của riêng chặng\.|
|`data.current_location`|object|Không|Vị trí hiện tại của kiện, chỉ trả khi `is_current = true` và NVC hoặc sự kiện kho của chặng này cung cấp dữ liệu đáng tin cậy\. Bỏ object khi chặng đã hoàn tất, chưa bắt đầu hoặc không có dữ liệu vị trí\.|
|`data.current_location.province_name`|string|Không|Tên Tỉnh/Thành phố hiện tại nếu xác định được\.|
|`data.current_location.district_name`|string|Không|Tên Quận/Huyện hiện tại nếu nguồn còn sử dụng địa chỉ ba cấp và có cung cấp dữ liệu\.|
|`data.current_location.commune_name`|string|Không|Tên Phường/Xã hiện tại nếu xác định được\.|
|`data.current_location.facility_name`|string|Không|Tên bưu cục, Hub hoặc điểm khai thác hiện tại nếu NVC cung cấp\.|
|`data.current_location.recorded_at`|datetime|Có điều kiện|Bắt buộc khi có `current_location`; thời điểm vị trí được ghi nhận, theo ISO 8601 có múi giờ\.|
|`data.events`|array\(object\)|Có|Toàn bộ mốc hành trình thuộc đúng chặng, sắp xếp tăng dần theo `sequence_no`; trả `[]` nếu chặng chưa phát sinh sự kiện\. Không chứa lịch sử thao tác người dùng như in nhãn hoặc sửa thông tin Order\.|
|`data.events[].sequence_no`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử; số thứ tự của mốc trong chặng, bắt đầu từ `1`\.|
|`data.events[].event_source`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử: `1` — sự kiện do NVC cung cấp; `2` — sự kiện nghiệp vụ do SuperPlatform ghi nhận; `3` — sự kiện kho/Hub được xác nhận\.|
|`data.events[].stage_status_code`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; mã trạng thái SuperPlatform của chặng tại thời điểm xảy ra mốc\.|
|`data.events[].stage_status_name`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; tên trạng thái chặng bằng tiếng Việt dùng để hiển thị hành trình\.|
|`data.events[].carrier_status_code`|string|Không|Mã trạng thái gốc của NVC tại mốc; giữ nguyên giá trị và bỏ trường nếu `event_source` khác `1` hoặc NVC không cung cấp mã đã xác nhận\.|
|`data.events[].carrier_status_name`|string|Không|Tên trạng thái gốc của NVC tại mốc; bỏ trường nếu đây không phải sự kiện NVC\.|
|`data.events[].location`|object|Không|Snapshot vị trí của kiện tại đúng thời điểm mốc xảy ra; bỏ object nếu nguồn sự kiện không cung cấp dữ liệu vị trí\. Đây là vị trí tại mốc lịch sử, không phải `current_location` của Order\.|
|`data.events[].location.province_code`|string|Không|Mã Tỉnh/Thành tại mốc nếu đã đối chiếu được với Address Module\.|
|`data.events[].location.province_name`|string|Không|Tên Tỉnh/Thành tại mốc nếu nguồn cung cấp\.|
|`data.events[].location.district_code`|string|Không|Mã Quận/Huyện tại mốc đối với dữ liệu hành chính ba cấp; bỏ trường với dữ liệu hai cấp hoặc khi không xác định được\.|
|`data.events[].location.district_name`|string|Không|Tên Quận/Huyện tại mốc nếu nguồn cung cấp\.|
|`data.events[].location.commune_code`|string|Không|Mã Phường/Xã tại mốc nếu xác định được; không dùng `ward_code`\.|
|`data.events[].location.commune_name`|string|Không|Tên Phường/Xã tại mốc nếu nguồn cung cấp\.|
|`data.events[].location.facility_code`|string|Không|Mã bưu cục, Hub hoặc điểm khai thác tại mốc nếu NVC cung cấp\.|
|`data.events[].location.facility_name`|string|Không|Tên bưu cục, Hub hoặc điểm khai thác tại mốc nếu nguồn cung cấp\.|
|`data.events[].reason`|string|Không|Lý do nghiệp vụ của mốc thất bại, hoãn hoặc ngoại lệ; bỏ trường nếu không có\.|
|`data.events[].occurred_at`|datetime|Có điều kiện|Bắt buộc trong mỗi phần tử; thời điểm mốc thực tế xảy ra, theo ISO 8601 có múi giờ\.|
|`data.started_at`|datetime|Không|Thời điểm chặng bắt đầu thực tế; bỏ trường nếu chưa bắt đầu\.|
|`data.completed_at`|datetime|Không|Thời điểm chặng hoàn tất; bỏ trường nếu chưa hoàn tất\.|
|`data.updated_at`|datetime|Có|Thời điểm chặng được cập nhật gần nhất theo ISO 8601 có múi giờ\.|

##### Ví dụ Response — chi tiết hành trình chặng lấy hàng

```JSON
{
  "error": false,
  "message": "Lấy chi tiết chặng thành công.",
  "data": {
    "order_code": "9001156990401",
    "order_status": "SPF-0901",
    "order_status_name": "Đã giao hàng",
    "stage_code": "STG-PICKUP-0001",
    "stage_no": 1,
    "leg_type": 1,
    "leg_name": "Lấy hàng",
    "is_current": false,
    "carrier_code": 1,
    "carrier_name": "SuperShip",
    "carrier_client_code": "S275518",
    "carrier_waybill_code": "STGS983262LM.826941741",
    "carrier_status_code": "SPS-303",
    "carrier_status_name": "Đã bàn giao nhà vận chuyển khác",
    "carrier_status_at": "2026-09-15T09:45:00+07:00",
    "stage_status_code": "SPF-0605",
    "stage_status_name": "NVC giao đã nhận hàng",
    "events": [
      {
        "sequence_no": 1,
        "event_source": 1,
        "stage_status_code": "SPF-0301",
        "stage_status_name": "Chờ lấy hàng",
        "carrier_status_code": "SPS-101",
        "carrier_status_name": "Chờ lấy hàng",
        "location": {
          "province_name": "Thành phố Hồ Chí Minh",
          "district_name": "Quận 8",
          "commune_name": "Phường Chánh Hưng",
          "facility_name": "Kho AB Shop Quận 8"
        },
        "occurred_at": "2026-09-15T08:00:00+07:00"
      },
      {
        "sequence_no": 2,
        "event_source": 1,
        "stage_status_code": "SPF-0501",
        "stage_status_name": "Đã lấy hàng",
        "carrier_status_code": "SPS-201",
        "carrier_status_name": "Lấy hàng thành công",
        "location": {
          "province_name": "Thành phố Hồ Chí Minh",
          "district_name": "Quận 8",
          "commune_name": "Phường Chánh Hưng",
          "facility_name": "Kho AB Shop Quận 8"
        },
        "occurred_at": "2026-09-15T08:40:00+07:00"
      },
      {
        "sequence_no": 3,
        "event_source": 1,
        "stage_status_code": "SPF-0502",
        "stage_status_name": "Đã nhập kho/bưu cục lấy",
        "carrier_status_code": "SPS-202",
        "carrier_status_name": "Nhập kho",
        "location": {
          "province_name": "Thành phố Hồ Chí Minh",
          "district_name": "Quận Tân Bình",
          "commune_name": "Phường Tân Sơn",
          "facility_name": "Hub SuperShip Tân Bình"
        },
        "occurred_at": "2026-09-15T09:15:00+07:00"
      },
      {
        "sequence_no": 4,
        "event_source": 1,
        "stage_status_code": "SPF-0605",
        "stage_status_name": "NVC giao đã nhận hàng",
        "carrier_status_code": "SPS-303",
        "carrier_status_name": "Đã bàn giao nhà vận chuyển khác",
        "location": {
          "province_name": "Thành phố Hồ Chí Minh",
          "district_name": "Quận Tân Bình",
          "commune_name": "Phường Tân Sơn",
          "facility_name": "Hub SuperShip Tân Bình"
        },
        "occurred_at": "2026-09-15T09:45:00+07:00"
      }
    ],
    "started_at": "2026-09-15T08:00:00+07:00",
    "completed_at": "2026-09-15T09:45:00+07:00",
    "updated_at": "2026-09-15T09:45:00+07:00"
  }
}
```

Response trên chính là dữ liệu để hiển thị phần mở rộng “Chặng 1: Lấy hàng” trong giao diện: thông tin NVC/Waybill nằm ở phần đầu, còn bốn dòng hành trình được dựng từ `events[]`\. Vì chặng đã hoàn tất nên `is_current = false`, có `completed_at` và không trả `current_location`; vị trí hiện tại của toàn kiện thuộc chặng đang thực hiện hoặc đã kết thúc ở cấp Order\.

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_STAGE_FORBIDDEN`|Người gọi không có quyền xem Order hoặc chặng nằm ngoài Data Scope\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi được phép xem\.|
|`404 Not Found`|`ORDER_STAGE_NOT_FOUND`|Không tìm thấy `stage_code` thuộc Order\.|
|`503 Service Unavailable`|`ORDER_STAGE_UNAVAILABLE`|Tạm thời không thể tải chi tiết chặng\.|


### 4\.3\.3\. Lấy lịch sử vận đơn của chặng

Lấy toàn bộ Waybill đã thực sự được NVC cấp và từng gắn với đúng một chặng\. API giúp vận hành biết chặng đã từng dùng NVC/Waybill nào, Waybill nào đang được sử dụng, Waybill nào bị hủy hoặc thay thế và Waybill mới thay thế Waybill cũ nào\.

Mỗi phần tử Waybill là một **snapshot bất biến của thông tin đã dùng để tạo vận đơn tại NVC**: dịch vụ, người gửi, người nhận, địa chỉ, kiện hàng, tiền thu hộ, khai giá, ghi chú và các tham số riêng của NVC\. Nhờ đó Shop và nhân viên nội bộ có thể đối chiếu đơn đã được gửi sang từng NVC như thế nào, kể cả sau khi Waybill bị hủy hoặc thay thế\.

API không trả hành trình trạng thái của kiện hàng và không trả lần tạo Waybill thất bại khi NVC chưa cấp mã\. Trường hợp chưa có mã Waybill chỉ là Booking Attempt và được theo dõi trong nghiệp vụ tạo/retry NVC, không được giả lập thành một phần tử lịch sử Waybill\. API cũng không trả access token, secret, chữ ký, Carrier Account nội bộ hoặc toàn bộ raw HTTP payload; các dữ liệu nhạy cảm này thuộc Carrier Module\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/orders/{order_code}/stages/{stage_code}/waybills`|
|Thành công|`200 OK`|
|Quyền truy cập|Shop, đối tác được ủy quyền hoặc nhân viên nội bộ có quyền xem Order; dữ liệu kỹ thuật và lý do vận hành được lọc theo quyền và Data Scope\.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định người gọi, quyền và Data Scope được phép truy cập.|
|`X-Correlation-Id`|Không|Mã truy vết do Consumer truyền; Backend tự tạo nếu không có.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order SuperPlatform\.|
|`stage_code`|string|Có|Mã chặng lấy từ API danh sách chặng và phải thuộc đúng Order\.|

##### Ví dụ cURL

```Bash
curl --request GET '{{base_url}}/v1/orders/9001156990401/stages/STG-DELIVERY-0001/waybills' \
  --header 'Authorization: Bearer {{access_token}}' \
  --header 'X-Correlation-Id: 45f8c783-456a-4bd5-972a-ab509b014a88'
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|`false` khi lấy dữ liệu thành công\.|
|`message`|string|Có|Thông báo ngắn gọn bằng tiếng Việt\.|
|`data`|object|Có|Lịch sử Waybill của đúng một chặng\.|
|`data.order_code`|string|Có|Mã Order\.|
|`data.stage_code`|string|Có|Mã chặng đã truy vấn\.|
|`data.leg_type`|integer|Có|Loại chặng: `1` — lấy hàng; `2` — giao hàng; `3` — hoàn hàng; `4` — trả hàng cuối\.|
|`data.leg_name`|string|Có|Tên chặng bằng tiếng Việt\.|
|`data.current_waybill_code`|string|Không|Waybill hiện đang được liên kết với chặng; bỏ trường nếu chặng chưa có Waybill hiện hành\. Giá trị phải trùng đúng một phần tử có `is_current = true`\.|
|`data.items`|array\(object\)|Có|Các Waybill theo thời điểm phát sinh tăng dần; trả `[]` nếu chặng chưa có Waybill\.|
|`data.items[].sequence_no`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử; thứ tự Waybill được liên kết với chặng, bắt đầu từ `1`\.|
|`data.items[].carrier_code`|integer|Có|Mã số NVC sở hữu Waybill trong Carrier Registry\.|
|`data.items[].carrier_name`|string|Có|Tên NVC sở hữu Waybill\.|
|`data.items[].carrier_client_code`|string|Không|Mã khách hàng/tài khoản dùng để tạo Waybill tại NVC; bỏ trường nếu chưa có hoặc người gọi không được xem\.|
|`data.items[].carrier_waybill_code`|string|Có|Mã Waybill nguyên bản do NVC cấp\. Phần tử chỉ tồn tại khi đã có mã này\.|
|`data.items[].carrier_sorting_code`|string|Không|Mã phân loại/chia chọn của Waybill nếu NVC cung cấp\.|
|`data.items[].waybill_status`|integer|Có|Tình trạng liên kết Waybill với chặng: `1` — hiện hành; `2` — đã hoàn tất chặng; `3` — đã được Waybill khác thay thế; `4` — đã hủy\. Không dùng giá trị này cho lần tạo Waybill chưa được NVC cấp mã\.|
|`data.items[].is_current`|boolean|Có|`true` nếu là Waybill hiện hành của chặng; tối đa một phần tử có giá trị `true`\.|
|`data.items[].replaces_waybill_code`|string|Không|Waybill bị thay thế trực tiếp; bỏ trường nếu không phải Waybill thay thế\.|
|`data.items[].replaced_by_waybill_code`|string|Không|Waybill đã thay thế phần tử này; chỉ trả trên Waybill có `waybill_status = 3`\.|
|`data.items[].carrier_status_code`|string|Không|Mã trạng thái gốc cuối cùng đã ghi nhận từ NVC cho Waybill này; giữ nguyên giá trị và bỏ trường nếu chưa có mã được xác nhận\.|
|`data.items[].carrier_status_name`|string|Không|Tên trạng thái gốc cuối cùng của NVC cho Waybill này\. Không dùng trạng thái của Waybill mới để ghi đè Waybill cũ\.|
|`data.items[].carrier_status_at`|datetime|Có điều kiện|Bắt buộc khi có Carrier Status; thời điểm trạng thái gốc cuối cùng phát sinh\.|
|`data.items[].service`|object|Có|Snapshot dịch vụ đã dùng để tạo Waybill tại NVC\.|
|`data.items[].service.service_code`|string|Có|Mã dịch vụ thực tế đã gửi sang NVC hoặc mã dịch vụ mà NVC trả về\. Không tự chuyển thành mã dịch vụ SuperPlatform\.|
|`data.items[].service.service_name`|string|Có|Tên dịch vụ tại thời điểm tạo Waybill\.|
|`data.items[].service.pickup_method`|integer|Có|Phương thức gửi hàng: `1` — NVC đến lấy; `2` — Shop hoặc SuperShip gửi tại điểm tiếp nhận của NVC\.|
|`data.items[].service.fee_payer`|integer|Có|Bên trả phí: `1` — Shop/người gửi; `2` — người nhận\.|
|`data.items[].sender`|object|Có|Snapshot người gửi mà SuperPlatform đã dùng khi tạo Waybill\. Đây có thể là Shop, kho Shop hoặc Hub SuperShip tùy chặng\.|
|`data.items[].sender.name`|string|Có|Tên người gửi đã gửi sang NVC\.|
|`data.items[].sender.phone`|string|Có|Số điện thoại người gửi đã gửi sang NVC; response được che theo quyền người gọi\.|
|`data.items[].sender.point_code`|string|Không|Mã điểm lấy trong SuperPlatform; bỏ trường nếu Waybill dùng địa chỉ nhập trực tiếp\.|
|`data.items[].sender.point_name`|string|Không|Tên điểm lấy, kho hoặc Hub tại thời điểm tạo Waybill\.|
|`data.items[].sender.address`|object|Có|Snapshot địa chỉ lấy hàng đã gửi sang NVC\.|
|`data.items[].sender.address.model`|integer|Có|Mô hình địa chỉ: `1` — hành chính ba cấp; `2` — hành chính hai cấp\.|
|`data.items[].sender.address.detail`|string|Có|Số nhà, tên đường và phần địa chỉ chi tiết\.|
|`data.items[].sender.address.full_address`|string|Có|Địa chỉ đầy đủ đã được ghép và xác nhận tại thời điểm tạo Waybill\.|
|`data.items[].sender.address.province_code`|string|Có|Mã Tỉnh/Thành theo Address Module\.|
|`data.items[].sender.address.district_code`|string|Có điều kiện|Bắt buộc khi `model = 1`; không trả khi `model = 2`\.|
|`data.items[].sender.address.commune_code`|string|Có|Mã Phường/Xã; không sử dụng `ward_code` trong contract SuperPlatform\.|
|`data.items[].receiver`|object|Có|Snapshot người nhận mà SuperPlatform đã dùng khi tạo Waybill\. Với chặng hoàn, đây là người/điểm nhận hàng hoàn\.|
|`data.items[].receiver.name`|string|Có|Tên người nhận đã gửi sang NVC\.|
|`data.items[].receiver.phone`|string|Có|Số điện thoại người nhận; response được che theo quyền người gọi\.|
|`data.items[].receiver.address`|object|Có|Snapshot địa chỉ nhận hàng đã gửi sang NVC\.|
|`data.items[].receiver.address.model`|integer|Có|Mô hình địa chỉ: `1` — hành chính ba cấp; `2` — hành chính hai cấp\.|
|`data.items[].receiver.address.detail`|string|Có|Số nhà, tên đường và phần địa chỉ chi tiết\.|
|`data.items[].receiver.address.full_address`|string|Có|Địa chỉ nhận đầy đủ đã được ghép và xác nhận tại thời điểm tạo Waybill\.|
|`data.items[].receiver.address.province_code`|string|Có|Mã Tỉnh/Thành theo Address Module\.|
|`data.items[].receiver.address.district_code`|string|Có điều kiện|Bắt buộc khi `model = 1`; không trả khi `model = 2`\.|
|`data.items[].receiver.address.commune_code`|string|Có|Mã Phường/Xã; không sử dụng `ward_code` trong contract SuperPlatform\.|
|`data.items[].parcel`|object|Có|Snapshot kiện hàng dùng để tạo Waybill\.|
|`data.items[].parcel.product_type`|integer|Có|Cách khai báo hàng: `1` — một tên hàng tổng quát; `2` — danh sách sản phẩm chi tiết\.|
|`data.items[].parcel.product_name`|string|Có điều kiện|Bắt buộc khi `product_type = 1`; tên/nội dung kiện hàng đã gửi sang NVC\.|
|`data.items[].parcel.products`|array\(object\)|Có điều kiện|Bắt buộc khi `product_type = 2`; danh sách sản phẩm đã gửi sang NVC\.|
|`data.items[].parcel.products[].sku`|string|Không|Mã sản phẩm của Shop nếu có\.|
|`data.items[].parcel.products[].name`|string|Có điều kiện|Bắt buộc trong mỗi phần tử `products[]`; tên sản phẩm\.|
|`data.items[].parcel.products[].unit_price`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử; đơn giá sản phẩm, đơn vị VND\.|
|`data.items[].parcel.products[].unit_weight`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử; khối lượng một sản phẩm, đơn vị gram\.|
|`data.items[].parcel.products[].quantity`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử; số lượng sản phẩm\.|
|`data.items[].parcel.weight`|integer|Có|Tổng khối lượng khai báo với NVC, đơn vị gram\.|
|`data.items[].parcel.dimensions`|object|Có|Kích thước kiện hàng đã khai báo, đơn vị centimet\.|
|`data.items[].parcel.dimensions.length`|integer|Có|Chiều dài\.|
|`data.items[].parcel.dimensions.width`|integer|Có|Chiều rộng\.|
|`data.items[].parcel.dimensions.height`|integer|Có|Chiều cao\.|
|`data.items[].amounts`|object|Có|Các giá trị tiền đã dùng khi tạo Waybill; đơn vị VND\.|
|`data.items[].amounts.cod_amount`|integer|Có|Số tiền NVC cần thu hộ\. Trả `0` nếu không thu hộ\.|
|`data.items[].amounts.collection_amount`|integer|Có|Tổng tiền cần thu người nhận theo snapshot của Waybill, gồm COD và khoản người nhận phải trả nếu có\.|
|`data.items[].amounts.declared_value`|integer|Có|Giá trị hàng khai báo với NVC để phục vụ giới hạn trách nhiệm/bảo hiểm\. Trả `0` nếu không khai giá\.|
|`data.items[].delivery_instruction`|object|Có|Yêu cầu giao hàng đã gửi sang NVC\.|
|`data.items[].delivery_instruction.view_policy`|integer|Có|Quyền xem hàng: `1` — không xem; `2` — xem nhưng không thử; `3` — được thử nếu dịch vụ hỗ trợ\.|
|`data.items[].delivery_instruction.note`|string|Không|Ghi chú giao hàng; bỏ trường nếu không có\.|
|`data.items[].carrier_options`|array\(object\)|Có|Các tham số nghiệp vụ riêng của NVC đã dùng khi tạo Waybill; trả `[]` nếu không có\. Chỉ trả tham số an toàn, không trả token, ShopId/Account ID bí mật hoặc chữ ký\.|
|`data.items[].carrier_options[].key`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; đúng tên tham số của API NVC, ví dụ GHN có `service_type_id`, `payment_type_id`, `required_note`, `pick_shift`\.|
|`data.items[].carrier_options[].value`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; giá trị đã gửi, biểu diễn dưới dạng chuỗi để dùng chung cho số, chữ hoặc mảng\.|
|`data.items[].carrier_options[].name`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; ý nghĩa tiếng Việt của tham số\.|
|`data.items[].request_sent_at`|datetime|Có|Thời điểm SuperPlatform gửi yêu cầu tạo Waybill sang NVC\.|
|`data.items[].carrier_accepted_at`|datetime|Có|Thời điểm NVC cấp mã Waybill/chấp nhận đơn\.|
|`data.items[].reason_code`|integer|Không|Mã lý do kết thúc/thay thế Waybill do SuperPlatform quản lý: `1` — NVC từ chối hoặc không thể tiếp tục; `2` — NVC không còn phục vụ tuyến; `3` — quá thời gian vận hành cho phép; `4` — vận hành chủ động đổi NVC; `99` — lý do khác\. Bỏ trường nếu Waybill vẫn hiện hành hoặc hoàn tất bình thường\.|
|`data.items[].reason`|string|Không|Diễn giải lý do hủy hoặc thay thế; bắt buộc khi `reason_code = 99`, các trường hợp khác trả khi có thông tin cần hiển thị\.|
|`data.items[].linked_at`|datetime|Có|Thời điểm Waybill được liên kết với chặng, theo ISO 8601 có múi giờ\.|
|`data.items[].unlinked_at`|datetime|Không|Thời điểm Waybill ngừng là Waybill hiện hành của chặng; bỏ trường nếu `is_current = true` hoặc chưa xác định được kết quả\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Lấy lịch sử Waybill thành công.",
  "data": {
    "order_code": "9001156990401",
    "stage_code": "STG-DELIVERY-0001",
    "leg_type": 2,
    "leg_name": "Giao hàng",
    "current_waybill_code": "STGS983262LM.826941741",
    "items": [
      {
        "sequence_no": 1,
        "carrier_code": 2,
        "carrier_name": "Giao Hàng Nhanh",
        "carrier_client_code": "S275518",
        "carrier_waybill_code": "GY8YLSDK",
        "carrier_sorting_code": "100-A2-09-00",
        "waybill_status": 3,
        "is_current": false,
        "replaced_by_waybill_code": "STGS983262LM.826941741",
        "carrier_status_code": "cancel",
        "carrier_status_name": "Đơn huỷ",
        "carrier_status_at": "2026-09-16T16:55:00+07:00",
        "service": {
          "service_code": "2",
          "service_name": "Tiêu chuẩn",
          "pickup_method": 1,
          "fee_payer": 1
        },
        "sender": {
          "name": "AB Shop",
          "phone": "0399888077",
          "point_code": "KHO-Q8-01",
          "point_name": "Kho AB Shop Quận 8",
          "address": {
            "model": 2,
            "detail": "231/15 Dương Bá Trạc",
            "full_address": "231/15 Dương Bá Trạc, Phường Chánh Hưng, Thành phố Hồ Chí Minh",
            "province_code": "P01",
            "commune_code": "P01C0002"
          }
        },
        "receiver": {
          "name": "Nguyễn Minh Anh",
          "phone": "0948123404",
          "address": {
            "model": 2,
            "detail": "120 Thân Nhân Trung",
            "full_address": "120 Thân Nhân Trung, Phường Tân Sơn, Thành phố Hồ Chí Minh",
            "province_code": "P01",
            "commune_code": "P01C0001"
          }
        },
        "parcel": {
          "product_type": 2,
          "products": [
            {
              "sku": "SP-UC04-001",
              "name": "Máy ép chậm hoa quả",
              "unit_price": 1850000,
              "unit_weight": 2500,
              "quantity": 1
            }
          ],
          "weight": 2500,
          "dimensions": {
            "length": 35,
            "width": 25,
            "height": 30
          }
        },
        "amounts": {
          "cod_amount": 200000,
          "collection_amount": 200000,
          "declared_value": 1850000
        },
        "delivery_instruction": {
          "view_policy": 2,
          "note": "Gọi người nhận trước khi giao"
        },
        "carrier_options": [
          {
            "key": "service_type_id",
            "value": "2",
            "name": "Loại dịch vụ GHN"
          },
          {
            "key": "payment_type_id",
            "value": "1",
            "name": "Shop trả phí vận chuyển"
          },
          {
            "key": "required_note",
            "value": "CHOXEMHANGKHONGTHU",
            "name": "Cho xem hàng nhưng không cho thử"
          },
          {
            "key": "pick_shift",
            "value": "[2]",
            "name": "Ca lấy hàng GHN"
          }
        ],
        "request_sent_at": "2026-09-15T10:14:58+07:00",
        "carrier_accepted_at": "2026-09-15T10:15:00+07:00",
        "reason_code": 4,
        "reason": "Vận hành đổi sang SuperShip để tiếp tục giao hàng",
        "linked_at": "2026-09-15T10:15:00+07:00",
        "unlinked_at": "2026-09-16T17:00:00+07:00"
      },
      {
        "sequence_no": 2,
        "carrier_code": 1,
        "carrier_name": "SuperShip",
        "carrier_client_code": "S275518",
        "carrier_waybill_code": "STGS983262LM.826941741",
        "waybill_status": 1,
        "is_current": true,
        "replaces_waybill_code": "GY8YLSDK",
        "carrier_status_code": "SPS-101",
        "carrier_status_name": "Chờ lấy hàng",
        "carrier_status_at": "2026-09-16T17:05:00+07:00",
        "service": {
          "service_code": "SPS",
          "service_name": "SuperShip",
          "pickup_method": 1,
          "fee_payer": 1
        },
        "sender": {
          "name": "AB Shop",
          "phone": "0399888077",
          "point_code": "KHO-Q8-01",
          "point_name": "Kho AB Shop Quận 8",
          "address": {
            "model": 2,
            "detail": "231/15 Dương Bá Trạc",
            "full_address": "231/15 Dương Bá Trạc, Phường Chánh Hưng, Thành phố Hồ Chí Minh",
            "province_code": "P01",
            "commune_code": "P01C0002"
          }
        },
        "receiver": {
          "name": "Nguyễn Minh Anh",
          "phone": "0948123404",
          "address": {
            "model": 2,
            "detail": "120 Thân Nhân Trung",
            "full_address": "120 Thân Nhân Trung, Phường Tân Sơn, Thành phố Hồ Chí Minh",
            "province_code": "P01",
            "commune_code": "P01C0001"
          }
        },
        "parcel": {
          "product_type": 2,
          "products": [
            {
              "sku": "SP-UC04-001",
              "name": "Máy ép chậm hoa quả",
              "unit_price": 1850000,
              "unit_weight": 2500,
              "quantity": 1
            }
          ],
          "weight": 2500,
          "dimensions": {
            "length": 35,
            "width": 25,
            "height": 30
          }
        },
        "amounts": {
          "cod_amount": 200000,
          "collection_amount": 200000,
          "declared_value": 1850000
        },
        "delivery_instruction": {
          "view_policy": 2,
          "note": "Gọi người nhận trước khi giao"
        },
        "carrier_options": [],
        "request_sent_at": "2026-09-16T17:04:58+07:00",
        "carrier_accepted_at": "2026-09-16T17:05:00+07:00",
        "linked_at": "2026-09-16T17:05:00+07:00"
      }
    ]
  }
}
```

Response trên cho biết chặng giao ban đầu dùng Waybill GHN `GY8YLSDK`, sau đó Waybill này bị SuperShip `STGS983262LM.826941741` thay thế\. Mỗi phần tử giữ nguyên snapshot dữ liệu đã dùng để tạo đúng Waybill đó; vì vậy có thể đối chiếu việc đổi NVC có làm thay đổi dịch vụ, địa chỉ, kiện hàng, COD hoặc yêu cầu giao hàng hay không\. Các mốc kiện hàng di chuyển vẫn thuộc API hành trình chặng, không lặp lại trong API này\.

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_STAGE_WAYBILLS_FORBIDDEN`|Người gọi không có quyền xem Order, chặng hoặc lịch sử Waybill theo Data Scope\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi được phép xem\.|
|`404 Not Found`|`ORDER_STAGE_NOT_FOUND`|Không tìm thấy `stage_code` thuộc Order\.|
|`503 Service Unavailable`|`ORDER_STAGE_WAYBILLS_UNAVAILABLE`|Tạm thời không thể tải lịch sử Waybill của chặng\.|

### 4\.3\.4\. Lấy thông tin hành trình Đơn hàng

Lấy toàn bộ hành trình vận chuyển của một Order, nhóm đúng theo từng chặng lấy hàng, giao hàng, hoàn hàng và trả hàng cuối\. API phục vụ khối “Hành trình đơn hàng theo từng chặng” trên trang chi tiết và cho phép xác định kiện đang ở chặng nào, NVC nào đang giữ hàng, trạng thái hiện tại và các vị trí kiện đã đi qua\.

Shop được xem đầy đủ các mốc nghiệp vụ thuộc Order của mình, tên NVC, mã vận đơn, trạng thái dễ hiểu và vị trí/bưu cục khi NVC cung cấp\. Nhân viên nội bộ có quyền được xem thêm mã trạng thái gốc của NVC, Client Code, mã phân loại, nguồn sự kiện, thời điểm hệ thống tiếp nhận sự kiện và lý do vận hành\. Backend tự lọc trường theo Access Context; Response không trả `access_view` hoặc tên profile phân quyền\.

API này không trả lịch sử in nhãn, sửa COD, thay đổi thông tin, người dùng thao tác hoặc Ticket hỗ trợ; các nội dung đó thuộc API lịch sử hành động\. API cũng không thay thế API chi tiết một chặng: endpoint này tổng hợp tất cả chặng để dựng hành trình toàn Order, còn API chi tiết chặng dùng khi mở sâu một chặng cụ thể\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/orders/{order_code}/tracking`|
|Thành công|`200 OK`|
|Quyền truy cập|Shop sở hữu Order, đối tác được ủy quyền hoặc nhân viên nội bộ có quyền và Data Scope phù hợp\.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định người gọi, quyền và Data Scope được phép truy cập.|
|`X-Correlation-Id`|Không|Mã truy vết do Consumer truyền; Backend tự tạo nếu không có.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Định danh lấy từ URL\.|

##### Ví dụ cURL

```Bash
curl --request GET '{{base_url}}/v1/orders/9001156990401/tracking' \
  --header 'Authorization: Bearer {{access_token}}' \
  --header 'X-Correlation-Id: 0e942a37-cfe7-46ad-a065-cc820621cd44'
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|`false` khi API xử lý thành công\.|
|`message`|string|Có|Thông báo ngắn gọn bằng tiếng Việt\.|
|`data`|object|Có|Hành trình toàn Order đã được lọc theo quyền và Data Scope\.|
|`data.order_code`|string|Có|Mã Order\.|
|`data.order_status`|string|Có|Mã trạng thái hiện tại của toàn Order\. Không dùng trường này thay cho trạng thái riêng của từng chặng\.|
|`data.order_status_name`|string|Có|Tên tiếng Việt của trạng thái hiện tại toàn Order\.|
|`data.current_stage_code`|string|Không|Mã chặng hiện đang thực hiện; bỏ trường khi Order chưa có chặng hoặc toàn bộ hành trình đã kết thúc\.|
|`data.current_location`|object|Không|Vị trí mới nhất đã xác nhận của kiện trên toàn Order; bỏ object nếu chưa có dữ liệu đáng tin cậy\. Không suy diễn vị trí chỉ từ tên trạng thái\.|
|`data.current_location.province_code`|string|Không|Mã Tỉnh/Thành hiện tại nếu đã đối chiếu được với Address Module\.|
|`data.current_location.province_name`|string|Không|Tên Tỉnh/Thành hiện tại\.|
|`data.current_location.district_code`|string|Không|Mã Quận/Huyện đối với dữ liệu hành chính ba cấp\.|
|`data.current_location.district_name`|string|Không|Tên Quận/Huyện hiện tại nếu nguồn cung cấp\.|
|`data.current_location.commune_code`|string|Không|Mã Phường/Xã hiện tại; không sử dụng `ward_code`\.|
|`data.current_location.commune_name`|string|Không|Tên Phường/Xã hiện tại nếu nguồn cung cấp\.|
|`data.current_location.facility_code`|string|Không|Mã bưu cục, Hub hoặc điểm khai thác hiện tại nếu NVC cung cấp\.|
|`data.current_location.facility_name`|string|Không|Tên bưu cục, Hub hoặc điểm khai thác hiện tại\.|
|`data.current_location.recorded_at`|datetime|Có điều kiện|Bắt buộc trong `current_location`; thời điểm vị trí được ghi nhận\.|
|`data.stages`|array\(object\)|Có|Tất cả chặng theo `stage_no` tăng dần; trả `[]` nếu Order chưa phát sinh chặng\. Một NVC hoặc một Waybill có thể xuất hiện ở nhiều chặng; không được gộp mất chặng nghiệp vụ\.|
|`data.stages[].stage_code`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; mã chặng\.|
|`data.stages[].stage_no`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử; thứ tự thực hiện chặng\.|
|`data.stages[].leg_type`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử: `1` — lấy hàng; `2` — giao hàng; `3` — hoàn hàng; `4` — trả hàng cuối\.|
|`data.stages[].leg_name`|string|Có|Tên chặng\.|
|`data.stages[].is_current`|boolean|Có|`true` khi đây là chặng đang thực hiện\. Tối đa một chặng có giá trị `true` tại cùng thời điểm\.|
|`data.stages[].carrier_code`|integer|Không|Mã NVC; bỏ trường nếu chặng chưa được gán NVC\.|
|`data.stages[].carrier_name`|string|Không|Tên NVC; bỏ trường nếu chưa được gán NVC\.|
|`data.stages[].carrier_client_code`|string|Không|Mã khách hàng/tài khoản hiển thị của Shop tại NVC; chỉ trả khi có dữ liệu và người gọi được phép xem\. Không phải mã chuyển ngoài\.|
|`data.stages[].carrier_waybill_code`|string|Không|Waybill hiện hành; bỏ trường nếu chưa được cấp\.|
|`data.stages[].carrier_sorting_code`|string|Không|Mã phân loại/chia chọn hiện hành nếu NVC cung cấp\.|
|`data.stages[].carrier_status_code`|string|Không|Mã trạng thái gốc mới nhất của NVC trên chặng; giữ nguyên giá trị và chỉ trả cho nội bộ có quyền\.|
|`data.stages[].carrier_status_name`|string|Không|Tên trạng thái gốc mới nhất của NVC trên chặng\. Chặng đã kết thúc giữ trạng thái cuối của chính chặng, không bị chặng sau ghi đè\.|
|`data.stages[].carrier_status_at`|datetime|Có điều kiện|Bắt buộc khi có Carrier Status; thời điểm trạng thái NVC mới nhất thực tế phát sinh\.|
|`data.stages[].stage_status_code`|string|Có|Mã trạng thái hiện tại hoặc kết quả cuối của riêng chặng, đã chuẩn hóa theo SuperPlatform\.|
|`data.stages[].stage_status_name`|string|Có|Tên tiếng Việt của trạng thái riêng của chặng\.|
|`data.stages[].started_at`|datetime|Không|Thời điểm chặng thực tế bắt đầu; bỏ trường nếu chặng chưa bắt đầu\.|
|`data.stages[].completed_at`|datetime|Không|Thời điểm chặng hoàn tất; bỏ trường nếu chưa hoàn tất\.|
|`data.stages[].updated_at`|datetime|Có|Thời điểm dữ liệu chặng được cập nhật gần nhất\.|
|`data.stages[].events`|array\(object\)|Có|Các mốc thuộc đúng chặng, sắp xếp theo `sequence_no` tăng dần; trả `[]` khi chưa có mốc\.|
|`data.stages[].events[].sequence_no`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử; số thứ tự mốc trong chặng, bắt đầu từ `1`\.|
|`data.stages[].events[].event_source`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử: `1` — NVC cung cấp; `2` — SuperPlatform ghi nhận; `3` — kho/Hub xác nhận\.|
|`data.stages[].events[].stage_status_code`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; trạng thái chặng đã chuẩn hóa tại thời điểm xảy ra mốc\.|
|`data.stages[].events[].stage_status_name`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; nội dung tiếng Việt dùng để hiển thị hành trình\.|
|`data.stages[].events[].carrier_status_code`|string|Không|Mã trạng thái gốc tại mốc; giữ nguyên giá trị do NVC cung cấp và chỉ trả cho nội bộ có quyền\. Bỏ trường nếu sự kiện không đến từ NVC hoặc mã raw chưa được xác nhận\.|
|`data.stages[].events[].carrier_status_name`|string|Không|Tên trạng thái gốc tại mốc do NVC công bố hoặc trả về\. Shop có thể nhận tên trạng thái phù hợp chính sách hiển thị nhưng không nhận dữ liệu kỹ thuật bị giới hạn\.|
|`data.stages[].events[].location`|object|Không|Snapshot vị trí tại đúng thời điểm sự kiện; bỏ object nếu nguồn không cung cấp vị trí\. Không dùng giá trị này như vị trí hiện tại của Order nếu đây là mốc lịch sử\.|
|`data.stages[].events[].location.province_code`|string|Không|Mã Tỉnh/Thành tại mốc nếu đã đối chiếu được\.|
|`data.stages[].events[].location.province_name`|string|Không|Tên Tỉnh/Thành tại mốc nếu nguồn cung cấp\.|
|`data.stages[].events[].location.district_code`|string|Không|Mã Quận/Huyện tại mốc đối với dữ liệu hành chính ba cấp\.|
|`data.stages[].events[].location.district_name`|string|Không|Tên Quận/Huyện tại mốc nếu nguồn cung cấp\.|
|`data.stages[].events[].location.commune_code`|string|Không|Mã Phường/Xã tại mốc nếu xác định được; không dùng `ward_code`\.|
|`data.stages[].events[].location.commune_name`|string|Không|Tên Phường/Xã tại mốc nếu nguồn cung cấp\.|
|`data.stages[].events[].location.facility_code`|string|Không|Mã bưu cục, Hub hoặc điểm khai thác tại mốc nếu NVC cung cấp\.|
|`data.stages[].events[].location.facility_name`|string|Không|Tên bưu cục, Hub hoặc điểm khai thác tại mốc nếu nguồn cung cấp\.|
|`data.stages[].events[].reason`|string|Không|Lý do thất bại, hoãn hoặc ngoại lệ tại mốc; bỏ trường nếu không có\.|
|`data.stages[].events[].occurred_at`|datetime|Có điều kiện|Bắt buộc trong mỗi phần tử; thời điểm xảy ra\.|
|`data.stages[].events[].received_at`|datetime|Không|Thời điểm SuperPlatform tiếp nhận sự kiện; chỉ trả cho nội bộ có quyền để kiểm tra sự kiện đến trễ hoặc sai thứ tự\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Lấy hành trình thành công.",
  "data": {
    "order_code": "9001156990401",
    "order_status": "SPF-0801",
    "order_status_name": "Đang giao hàng",
    "current_stage_code": "STG-DELIVERY-0001",
    "current_location": {
      "province_code": "P01",
      "province_name": "Thành phố Hồ Chí Minh",
      "district_name": "Quận Tân Bình",
      "commune_code": "P01C0001",
      "commune_name": "Phường Tân Sơn",
      "facility_code": "VTP-TB-01",
      "facility_name": "Bưu cục phát Tân Bình",
      "recorded_at": "2026-09-16T10:45:00+07:00"
    },
    "stages": [
      {
        "stage_code": "STG-PICKUP-0001",
        "stage_no": 1,
        "leg_type": 1,
        "leg_name": "Lấy hàng",
        "is_current": false,
        "carrier_code": 1,
        "carrier_name": "SuperShip",
        "carrier_client_code": "S275518",
        "carrier_waybill_code": "STGS983262LM.826941741",
        "carrier_status_code": "SPS-303",
        "carrier_status_name": "Đã bàn giao nhà vận chuyển khác",
        "carrier_status_at": "2026-09-15T09:45:00+07:00",
        "stage_status_code": "SPF-0605",
        "stage_status_name": "NVC giao đã nhận hàng",
        "started_at": "2026-09-15T08:00:00+07:00",
        "completed_at": "2026-09-15T09:45:00+07:00",
        "updated_at": "2026-09-15T09:45:02+07:00",
        "events": [
          {
            "sequence_no": 1,
            "event_source": 1,
            "stage_status_code": "SPF-0301",
            "stage_status_name": "Chờ lấy hàng",
            "carrier_status_code": "SPS-101",
            "carrier_status_name": "Chờ lấy hàng",
            "location": {
              "province_code": "P01",
              "province_name": "Thành phố Hồ Chí Minh",
              "commune_code": "P01C0002",
              "commune_name": "Phường Chánh Hưng",
              "facility_name": "Kho AB Shop Quận 8"
            },
            "occurred_at": "2026-09-15T08:00:00+07:00",
            "received_at": "2026-09-15T08:00:02+07:00"
          },
          {
            "sequence_no": 2,
            "event_source": 1,
            "stage_status_code": "SPF-0501",
            "stage_status_name": "Đã lấy hàng",
            "carrier_status_code": "SPS-201",
            "carrier_status_name": "Lấy hàng thành công",
            "location": {
              "province_code": "P01",
              "province_name": "Thành phố Hồ Chí Minh",
              "commune_code": "P01C0002",
              "commune_name": "Phường Chánh Hưng"
            },
            "occurred_at": "2026-09-15T08:40:00+07:00",
            "received_at": "2026-09-15T08:40:03+07:00"
          },
          {
            "sequence_no": 3,
            "event_source": 1,
            "stage_status_code": "SPF-0605",
            "stage_status_name": "NVC giao đã nhận hàng",
            "carrier_status_code": "SPS-303",
            "carrier_status_name": "Đã bàn giao nhà vận chuyển khác",
            "location": {
              "province_code": "P01",
              "province_name": "Thành phố Hồ Chí Minh",
              "district_name": "Quận Tân Bình",
              "commune_code": "P01C0001",
              "commune_name": "Phường Tân Sơn",
              "facility_code": "HUB-TB-01",
              "facility_name": "Hub SuperShip Tân Bình"
            },
            "occurred_at": "2026-09-15T09:45:00+07:00",
            "received_at": "2026-09-15T09:45:02+07:00"
          }
        ]
      },
      {
        "stage_code": "STG-DELIVERY-0001",
        "stage_no": 2,
        "leg_type": 2,
        "leg_name": "Giao hàng",
        "is_current": true,
        "carrier_code": 4,
        "carrier_name": "Viettel Post",
        "carrier_client_code": "S275518",
        "carrier_waybill_code": "SOO10902766013",
        "carrier_status_code": "500",
        "carrier_status_name": "Giao bưu tá đi phát",
        "carrier_status_at": "2026-09-16T10:45:00+07:00",
        "stage_status_code": "SPF-0801",
        "stage_status_name": "Đang giao hàng",
        "started_at": "2026-09-15T09:45:00+07:00",
        "updated_at": "2026-09-16T10:45:04+07:00",
        "events": [
          {
            "sequence_no": 1,
            "event_source": 1,
            "stage_status_code": "SPF-0605",
            "stage_status_name": "NVC giao đã nhận hàng",
            "carrier_status_code": "105",
            "carrier_status_name": "Bưu tá đã nhận hàng",
            "location": {
              "province_code": "P01",
              "province_name": "Thành phố Hồ Chí Minh",
              "district_name": "Quận Tân Bình",
              "commune_code": "P01C0001",
              "commune_name": "Phường Tân Sơn",
              "facility_code": "HUB-TB-01",
              "facility_name": "Hub SuperShip Tân Bình"
            },
            "occurred_at": "2026-09-15T09:45:00+07:00",
            "received_at": "2026-09-15T09:45:03+07:00"
          },
          {
            "sequence_no": 2,
            "event_source": 1,
            "stage_status_code": "SPF-0701",
            "stage_status_name": "Đang trung chuyển",
            "carrier_status_code": "400",
            "carrier_status_name": "Nhận bảng kê đến \"Nhận tại\"",
            "location": {
              "province_code": "P01",
              "province_name": "Thành phố Hồ Chí Minh",
              "district_name": "Quận Tân Bình",
              "commune_code": "P01C0001",
              "commune_name": "Phường Tân Sơn",
              "facility_code": "VTP-TB-01",
              "facility_name": "Bưu cục phát Tân Bình"
            },
            "occurred_at": "2026-09-16T10:15:00+07:00",
            "received_at": "2026-09-16T10:15:03+07:00"
          },
          {
            "sequence_no": 3,
            "event_source": 1,
            "stage_status_code": "SPF-0801",
            "stage_status_name": "Đang giao hàng",
            "carrier_status_code": "500",
            "carrier_status_name": "Giao bưu tá đi phát",
            "location": {
              "province_code": "P01",
              "province_name": "Thành phố Hồ Chí Minh",
              "district_name": "Quận Tân Bình",
              "commune_code": "P01C0001",
              "commune_name": "Phường Tân Sơn",
              "facility_code": "VTP-TB-01",
              "facility_name": "Bưu cục phát Tân Bình"
            },
            "occurred_at": "2026-09-16T10:45:00+07:00",
            "received_at": "2026-09-16T10:45:04+07:00"
          }
        ]
      }
    ]
  }
}
```

Response trên là góc nhìn nội bộ: hai chặng được trả trong cùng một hành trình; chặng SuperShip giữ kết quả cuối của chính nó, còn Viettel Post là chặng hiện hành\. `current_location` cho biết vị trí mới nhất của toàn kiện; từng `events[].location` giữ vị trí lịch sử của đúng mốc\. Khi Shop gọi cùng endpoint, Backend vẫn trả các chặng và mốc nghiệp vụ nhưng có thể che dữ liệu cá nhân và bỏ `carrier_status_code`, `received_at` hoặc dữ liệu kỹ thuật không thuộc phạm vi Shop\.

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_TRACKING_FORBIDDEN`|Người gọi không có quyền xem hành trình Order theo Data Scope\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi được phép xem\.|
|`503 Service Unavailable`|`ORDER_TRACKING_UNAVAILABLE`|Tạm thời không thể tải hành trình đã tổng hợp của Order\.|

### 4\.3\.5\. Lấy thông tin người/tài xế đang thực hiện

Lấy người và phương tiện đang được phân công thực hiện một hoặc nhiều chặng đang hoạt động của Order\. Shop được xem tên, số điện thoại, ảnh và phương tiện khi SuperShip/NVC có cung cấp và cho phép hiển thị; nhân viên nội bộ có quyền được xem dữ liệu đầy đủ hơn để liên hệ và hỗ trợ vận hành\.

API chỉ trả phân công hiện đang có hiệu lực, không trả người từng thực hiện nhưng đã kết thúc nhiệm vụ\. Dữ liệu phải đến từ SuperShip hoặc NVC, không suy ra từ trạng thái Order\. Nếu nguồn không cung cấp ảnh, phương tiện hoặc mã người thực hiện thì bỏ đúng trường đó, không tạo dữ liệu giả\. Mã người thực hiện của NVC là dữ liệu tùy chọn dành cho nội bộ tra cứu/đối soát; Shop không cần nhận trường này\. Việc nhân viên nội bộ xem số điện thoại đầy đủ phải được ghi vào lịch sử Audit\.

#### Chức năng, thời điểm và trường hợp sử dụng

|Trường hợp sử dụng|Thời điểm gọi API|Kết quả mong đợi|
|---|---|---|
|Hiển thị tài xế trên trang chi tiết Order|Khi mở trang chi tiết hoặc khi trạng thái/chặng hiện hành thay đổi|Hiện tên, điện thoại, ảnh, NVC và phương tiện nếu có phân công hợp lệ\.|
|Theo dõi người đến lấy hàng|Các trạng thái như `SPF-0301 — Chờ lấy hàng`, `SPF-0302 — Đang tìm tài xế`, `SPF-0401 — Đang lấy hàng`|Có thể chưa có tài xế ở bước tìm kiếm; Frontend căn cứ `available`, không tự suy ra từ trạng thái\.|
|Theo dõi người nhận bàn giao hoặc giao hàng|Các trạng thái `SPF-0601 — Chờ bàn giao`, `SPF-0602 — NVC giao đang nhận hàng`, `SPF-0801 — Đang giao hàng`|Trả người đang nhận bàn giao hoặc đang giao nếu NVC cung cấp\.|
|Theo dõi người lấy/trả hàng hoàn|Các trạng thái `SPF-1003 — Chờ lấy hàng hoàn`, `SPF-1004 — Đang lấy hàng hoàn`, `SPF-1102 — Đang trả cho NVC hoàn cuối`, `SPF-1106 — Đang trả hàng`|Trả đúng người thực hiện chặng hoàn/trả hiện hành, không lấy tài xế cũ của chiều giao\.|
|CSKH/Vận hành liên hệ NVC hoặc tài xế|Khi hỗ trợ lấy, giao, hoàn, trả hoặc xác minh sự cố|Nội bộ có quyền nhận số điện thoại đầy đủ và việc xem được ghi Audit\.|
|Frontend làm mới thông tin đang hiển thị|Khi nhận event thay đổi phân công hoặc người dùng chủ động tải lại|Dùng `updated_at` để biết thông tin phân công được cập nhật gần nhất lúc nào; không gọi liên tục nếu không có nhu cầu hiển thị\.|

API có thể được gọi ở mọi trạng thái chưa kết thúc để giao diện không phải tự duy trì danh sách trạng thái cho phép\. Ở trạng thái không cần hoặc chưa có tài xế, API vẫn trả `200 OK`, `available = false` và lý do nghiệp vụ tương ứng\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/orders/{order_code}/shipper`|
|Thành công|`200 OK`|
|Quyền truy cập|Shop sở hữu Order, đối tác được ủy quyền hoặc nhân viên nội bộ có quyền và Data Scope phù hợp\.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định người gọi, quyền và Data Scope được phép truy cập.|
|`X-Correlation-Id`|Không|Mã truy vết do Consumer truyền; Backend tự tạo nếu không có\.|

Người gọi nội bộ phải có quyền xem dữ liệu vận hành nhạy cảm; Backend ghi Audit khi trả số điện thoại đầy đủ\.

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order cần tra cứu người đang thực hiện chặng lấy, giao, hoàn hoặc trả hàng cuối\.|

##### Ví dụ cURL

```Bash
curl --request GET '{{base_url}}/v1/orders/9001156990401/shipper' \
  --header 'Authorization: Bearer {{access_token}}' \
  --header 'X-Correlation-Id: req-20260915-shipper-001'
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|`false` khi truy vấn hoàn tất\.|
|`message`|string|Có|Thông báo ngắn gọn bằng tiếng Việt\.|
|`data`|object|Có|Thông tin phân công đang còn hiệu lực của Order\.|
|`data.order_code`|string|Có|Mã Order\.|
|`data.available`|boolean|Có|`true` khi có ít nhất một người hiện đang được phân công và được phép hiển thị; `false` khi chưa có người đang thực hiện hoặc NVC không cung cấp dữ liệu\.|
|`data.assignments`|array\(object\)|Có|Danh sách người hiện đang được phân công; trả `[]` khi `available = false`\. Thông thường có một phần tử nhưng vẫn dùng mảng để hỗ trợ nhiều chặng hoạt động đồng thời\. Không trả tài xế cũ đã bị thay thế hoặc đã hoàn thành nhiệm vụ\.|
|`data.assignments[].stage_code`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; mã chặng đang được thực hiện\.|
|`data.assignments[].leg_type`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử: `1` — lấy hàng; `2` — giao hàng; `3` — hoàn hàng; `4` — trả hàng cuối\.|
|`data.assignments[].leg_name`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; tên chặng bằng tiếng Việt\.|
|`data.assignments[].stage_status_code`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; trạng thái hiện tại đã chuẩn hóa của chặng\.|
|`data.assignments[].stage_status_name`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; tên trạng thái hiện tại của chặng\.|
|`data.assignments[].carrier_code`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử; mã NVC quản lý người thực hiện\.|
|`data.assignments[].carrier_name`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; tên NVC\.|
|`data.assignments[].carrier_waybill_code`|string|Có điều kiện|Bắt buộc khi chặng đã có Waybill; mã vận đơn người này đang thực hiện\.|
|`data.assignments[].role_type`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử: `1` — lấy hàng; `2` — giao hàng; `3` — lấy hàng hoàn; `4` — trả hàng hoàn; `5` — bàn giao giữa NVC\.|
|`data.assignments[].shipper`|object|Có điều kiện|Bắt buộc trong mỗi phần tử `assignments[]`; thông tin người đang thực hiện\.|
|`data.assignments[].shipper.carrier_shipper_code`|string|Không|Mã người thực hiện nguyên bản do NVC cung cấp, chỉ trả cho nội bộ có quyền để tra cứu/đối soát\. Với Green SM, ánh xạ trực tiếp từ `data.driver.id`\. NVC không cung cấp thì bỏ trường, không trả `null` và không tự sinh mã\.|
|`data.assignments[].shipper.name`|string|Có điều kiện|Bắt buộc trong `shipper`; tên được phép hiển thị\.|
|`data.assignments[].shipper.phone`|string|Không|Số điện thoại đầy đủ hoặc đã che theo quyền và chính sách NVC; bỏ trường nếu nguồn không cho phép cung cấp\.|
|`data.assignments[].shipper.image_url`|string|Không|URL ảnh có thời hạn nếu NVC cung cấp; Shop vẫn được xem ảnh thuộc Order của mình khi chính sách cho phép\.|
|`data.assignments[].vehicle`|object|Không|Phương tiện đang sử dụng nếu NVC cung cấp\.|
|`data.assignments[].vehicle.type_code`|integer|Không|Loại phương tiện: `1` — xe máy; `2` — ô tô; `3` — xe tải; `4` — xe đạp; `99` — loại khác\.|
|`data.assignments[].vehicle.type_name`|string|Không|Tên loại phương tiện bằng tiếng Việt\.|
|`data.assignments[].vehicle.plate_number`|string|Không|Biển số đầy đủ hoặc đã che theo quyền và chính sách NVC\.|
|`data.assignments[].effective_from`|datetime|Có điều kiện|Bắt buộc trong mỗi phần tử; thời điểm phân công bắt đầu hiệu lực\.|
|`data.assignments[].updated_at`|datetime|Có điều kiện|Bắt buộc trong mỗi phần tử; thời điểm thông tin phân công được cập nhật gần nhất trên SuperPlatform\.|
|`data.reason_code`|integer|Có điều kiện|Chỉ trả khi `available = false`: `1` — hiện chưa có người được phân công; `2` — NVC không cung cấp thông tin người thực hiện\.|
|`data.reason`|string|Có điều kiện|Bắt buộc khi `available = false`; giải thích ngắn gọn bằng tiếng Việt\.|
|`data.checked_at`|datetime|Có|Thời điểm truy vấn\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Lấy shipper đang phụ trách thành công.",
  "data": {
    "order_code": "9001156990401",
    "available": true,
    "assignments": [
      {
        "stage_code": "STG-DELIVERY-0001",
        "leg_type": 2,
        "leg_name": "Giao hàng",
        "stage_status_code": "SPF-0801",
        "stage_status_name": "Đang giao hàng",
        "carrier_code": 4,
        "carrier_name": "Viettel Post",
        "carrier_waybill_code": "SOO10902766013",
        "role_type": 2,
        "shipper": {
          "name": "Trần Đình Quân",
          "phone": "0912345519",
          "image_url": "https://files.superplatform.vn/temporary/driver/DRV-105.jpg"
        },
        "vehicle": {
          "type_code": 1,
          "type_name": "Xe máy",
          "plate_number": "59X3-482.16"
        },
        "effective_from": "2026-09-16T10:40:00+07:00",
        "updated_at": "2026-09-16T10:45:00+07:00"
      }
    ],
    "checked_at": "2026-09-16T10:46:00+07:00"
  }
}
```

Ví dụ trên là Response dành cho nội bộ có quyền xem số điện thoại đầy đủ\. Khi Shop gọi cùng endpoint, cấu trúc không đổi nhưng số điện thoại/biển số có thể được che theo chính sách của NVC; ảnh vẫn được trả nếu NVC cung cấp và cho phép hiển thị\. Nếu chưa có người thực hiện, API trả `200 OK`, `available = false`, `assignments = []`, kèm `reason_code` và `reason`; đây không phải lỗi hệ thống\.

##### Response — chưa được phân công

Dùng khi chặng đã chờ xử lý nhưng SuperShip/NVC chưa gán người thực hiện, bao gồm thời gian đầu của `SPF-0301`, `SPF-0601` hoặc `SPF-1003`\.

```JSON
{
  "error": false,
  "message": "Chưa có người được phân công thực hiện.",
  "data": {
    "order_code": "9001156990401",
    "available": false,
    "assignments": [],
    "reason_code": 1,
    "reason": "Nhà vận chuyển chưa phân công người thực hiện cho chặng hiện tại.",
    "checked_at": "2026-09-16T10:46:00+07:00"
  }
}
```

##### Response — NVC không cung cấp thông tin tài xế

Dùng khi chặng vẫn đang được NVC thực hiện nhưng contract/webhook của NVC không trả dữ liệu người thực hiện\. Trường hợp này không có nghĩa là đơn chưa được vận chuyển\.

```JSON
{
  "error": false,
  "message": "Nhà vận chuyển không cung cấp thông tin người thực hiện.",
  "data": {
    "order_code": "9001156990401",
    "available": false,
    "assignments": [],
    "reason_code": 2,
    "reason": "Viettel Post đang thực hiện chặng giao nhưng không cung cấp thông tin tài xế cho SuperPlatform.",
    "checked_at": "2026-09-16T10:46:00+07:00"
  }
}
```

Ba Response nghiệp vụ của API gồm: có người đang được phân công (`available = true`), hiện chưa có người được phân công (`reason_code = 1`) và NVC không cung cấp thông tin người thực hiện (`reason_code = 2`)\. Tài xế cũ đã bị thay thế hoặc đã hoàn thành nhiệm vụ không được trả trong API này; nếu chưa có người mới thì dùng `reason_code = 1`\. Các lỗi xác thực, phân quyền, không tìm thấy Order hoặc lỗi hệ thống dùng HTTP status và Error Code tại bảng bên dưới, không trả dưới dạng `available = false`\.

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_SHIPPER_FORBIDDEN`|Người gọi không có quyền xem Order hoặc thông tin người thực hiện theo Data Scope\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi được phép xem\.|
|`503 Service Unavailable`|`ORDER_SHIPPER_UNAVAILABLE`|Tạm thời không thể đọc thông tin phân công đã đồng bộ\. Không dùng lỗi này khi NVC chỉ đơn giản chưa phân công tài xế\.|

### 4\.3\.6\. Lấy danh sách người từng phụ trách Đơn hàng

Lấy toàn bộ người/tài xế đã từng hoặc đang được phân công thực hiện các chặng của một Order\. API giúp Shop biết ai đã lấy, giao hoặc trả hàng của mình; giúp nội bộ tra cứu người phụ trách theo từng NVC, Waybill và khoảng thời gian khi cần hỗ trợ hoặc xác minh vận hành\.

API trả lịch sử phân công, không phải lịch sử trạng thái vận chuyển\. Một người phụ trách nhiều chặng được trả thành nhiều phần tử vì vai trò, Waybill và thời gian thực hiện khác nhau\. Một chặng thay tài xế có nhiều phần tử cùng `stage_code`, sắp xếp theo thời điểm phân công\.

Shop được xem tên, ảnh, NVC, vai trò, chặng và khoảng thời gian phụ trách; số điện thoại và biển số được trả đầy đủ hoặc che theo chính sách\. Nhân viên nội bộ có quyền được xem thêm mã người thực hiện do NVC cung cấp, số điện thoại đầy đủ và lý do người đó kết thúc nhiệm vụ hoặc bị thay thế\. Mã này chỉ phục vụ tra cứu/đối soát, không phải định danh người dùng của SuperPlatform\. Việc nội bộ xem dữ liệu liên hệ đầy đủ phải được ghi Audit\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/orders/{order_code}/shippers`|
|Thành công|`200 OK`|
|Quyền truy cập|Shop sở hữu Order, đối tác được ủy quyền hoặc nhân viên nội bộ có quyền và Data Scope phù hợp\.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định người gọi, quyền, phạm vi dữ liệu và mức che thông tin cá nhân\.|
|`X-Correlation-Id`|Không|Mã truy vết do Consumer truyền; Backend tự tạo nếu không có\.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order cần lấy danh sách người từng phụ trách\.|

##### Ví dụ cURL

```Bash
curl --request GET '{{base_url}}/v1/orders/9001156990401/shippers' \
  --header 'Authorization: Bearer {{access_token}}' \
  --header 'X-Correlation-Id: 84dd5dbf-d1f4-47ea-9760-27667283a64f'
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|`false` khi API xử lý thành công\.|
|`message`|string|Có|Thông báo ngắn gọn bằng tiếng Việt\.|
|`data`|object|Có|Danh sách phân công thuộc Order\.|
|`data.order_code`|string|Có|Mã Order\.|
|`data.total_assignments`|integer|Có|Tổng số lần phân công được phép hiển thị; từ `0` trở lên\.|
|`data.items`|array\(object\)|Có|Danh sách phân công sắp xếp theo `assigned_at` tăng dần; trả `[]` khi chưa nhận được thông tin người thực hiện từ bất kỳ NVC nào\.|
|`data.items[].assignment_no`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử; số thứ tự lần phân công trong toàn Order, bắt đầu từ `1`\.|
|`data.items[].stage_code`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; chặng người này được phân công thực hiện\.|
|`data.items[].stage_no`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử; thứ tự chặng trong hành trình Order\.|
|`data.items[].leg_type`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử: `1` — lấy hàng; `2` — giao hàng; `3` — hoàn hàng; `4` — trả hàng cuối\.|
|`data.items[].leg_name`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; tên chặng bằng tiếng Việt\.|
|`data.items[].role_type`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử: `1` — lấy hàng; `2` — giao hàng; `3` — lấy hàng hoàn; `4` — trả hàng hoàn; `5` — bàn giao giữa NVC\.|
|`data.items[].carrier_code`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử; mã NVC quản lý người thực hiện\.|
|`data.items[].carrier_name`|string|Có điều kiện|Bắt buộc trong mỗi phần tử; tên NVC\.|
|`data.items[].carrier_waybill_code`|string|Không|Mã Waybill người này thực hiện; bỏ trường nếu tại thời điểm phân công chưa được NVC cấp mã\.|
|`data.items[].is_current`|boolean|Có|`true` khi người này hiện vẫn đang phụ trách chặng; `false` khi nhiệm vụ đã kết thúc hoặc đã được người khác thay thế\.|
|`data.items[].shipper`|object|Có điều kiện|Bắt buộc trong mỗi phần tử; snapshot người thực hiện tại thời điểm phân công\.|
|`data.items[].shipper.carrier_shipper_code`|string|Không|Mã người thực hiện nguyên bản do NVC cung cấp, chỉ trả cho nội bộ có quyền\. Với Green SM, ánh xạ trực tiếp từ `data.driver.id`\. NVC không cung cấp thì bỏ trường, không trả `null` và không tự sinh mã\.|
|`data.items[].shipper.name`|string|Có điều kiện|Bắt buộc trong `shipper`; tên người thực hiện\.|
|`data.items[].shipper.phone`|string|Không|Số điện thoại đầy đủ hoặc đã che theo quyền và chính sách NVC\.|
|`data.items[].shipper.image_url`|string|Không|URL ảnh có thời hạn nếu NVC cung cấp và cho phép hiển thị\.|
|`data.items[].vehicle`|object|Không|Snapshot phương tiện tại thời điểm thực hiện nếu NVC cung cấp\.|
|`data.items[].vehicle.type_code`|integer|Không|Loại phương tiện: `1` — xe máy; `2` — ô tô; `3` — xe tải; `4` — xe đạp; `99` — loại khác\.|
|`data.items[].vehicle.type_name`|string|Không|Tên loại phương tiện bằng tiếng Việt\.|
|`data.items[].vehicle.plate_number`|string|Không|Biển số đầy đủ hoặc đã che theo quyền và chính sách NVC\.|
|`data.items[].assigned_at`|datetime|Có điều kiện|Bắt buộc trong mỗi phần tử; thời điểm người này bắt đầu được phân công\.|
|`data.items[].ended_at`|datetime|Không|Thời điểm kết thúc nhiệm vụ; bỏ trường khi `is_current = true`\.|
|`data.items[].end_type`|integer|Không|Lý do kết thúc: `1` — hoàn thành nhiệm vụ; `2` — được người khác thay thế; `3` — NVC hủy phân công\. Bỏ trường khi `is_current = true`\.|
|`data.items[].end_reason`|string|Không|Diễn giải lý do kết thúc/thay thế nếu NVC hoặc vận hành có cung cấp; dữ liệu nội bộ được lọc theo quyền\.|
|`data.items[].updated_at`|datetime|Có điều kiện|Bắt buộc trong mỗi phần tử; thời điểm thông tin phân công được cập nhật gần nhất trên SuperPlatform\.|

##### Ví dụ Response — Order có nhiều người từng phụ trách

```JSON
{
  "error": false,
  "message": "Lấy danh sách người từng phụ trách Đơn hàng thành công.",
  "data": {
    "order_code": "9001156990401",
    "total_assignments": 3,
    "items": [
      {
        "assignment_no": 1,
        "stage_code": "STG-PICKUP-0001",
        "stage_no": 1,
        "leg_type": 1,
        "leg_name": "Lấy hàng",
        "role_type": 1,
        "carrier_code": 1,
        "carrier_name": "SuperShip",
        "carrier_waybill_code": "STGS983262LM.826941741",
        "is_current": false,
        "shipper": {
          "name": "Lê Hoàng Nam",
          "phone": "0908123456",
          "image_url": "https://files.superplatform.vn/temporary/driver/SPS-DRV-2041.jpg"
        },
        "vehicle": {
          "type_code": 1,
          "type_name": "Xe máy",
          "plate_number": "59F1-825.41"
        },
        "assigned_at": "2026-09-15T07:55:00+07:00",
        "ended_at": "2026-09-15T09:45:00+07:00",
        "end_type": 1,
        "end_reason": "Đã hoàn thành lấy hàng và bàn giao tại Hub SuperShip.",
        "updated_at": "2026-09-15T09:45:02+07:00"
      },
      {
        "assignment_no": 2,
        "stage_code": "STG-DELIVERY-0001",
        "stage_no": 2,
        "leg_type": 2,
        "leg_name": "Giao hàng",
        "role_type": 2,
        "carrier_code": 4,
        "carrier_name": "Viettel Post",
        "carrier_waybill_code": "SOO10902766013",
        "is_current": false,
        "shipper": {
          "name": "Phạm Quốc Huy",
          "phone": "0987123900"
        },
        "vehicle": {
          "type_code": 1,
          "type_name": "Xe máy",
          "plate_number": "59P2-317.86"
        },
        "assigned_at": "2026-09-16T08:20:00+07:00",
        "ended_at": "2026-09-16T10:30:00+07:00",
        "end_type": 2,
        "end_reason": "Viettel Post thay đổi bưu tá phụ trách lượt giao.",
        "updated_at": "2026-09-16T10:30:03+07:00"
      },
      {
        "assignment_no": 3,
        "stage_code": "STG-DELIVERY-0001",
        "stage_no": 2,
        "leg_type": 2,
        "leg_name": "Giao hàng",
        "role_type": 2,
        "carrier_code": 4,
        "carrier_name": "Viettel Post",
        "carrier_waybill_code": "SOO10902766013",
        "is_current": true,
        "shipper": {
          "name": "Trần Đình Quân",
          "phone": "0912345519",
          "image_url": "https://files.superplatform.vn/temporary/driver/DRV-105.jpg"
        },
        "vehicle": {
          "type_code": 1,
          "type_name": "Xe máy",
          "plate_number": "59X3-482.16"
        },
        "assigned_at": "2026-09-16T10:40:00+07:00",
        "updated_at": "2026-09-16T10:45:00+07:00"
      }
    ]
  }
}
```

Response trên là góc nhìn nội bộ có quyền xem thông tin đầy đủ\. Khi Shop gọi cùng API, cấu trúc danh sách và quan hệ chặng không đổi; số điện thoại, biển số và lý do nội bộ có thể được che hoặc bỏ theo chính sách\.

##### Ví dụ Response — chưa có dữ liệu người phụ trách

Áp dụng khi Order chưa từng được phân công người thực hiện hoặc các NVC tham gia chưa từng cung cấp dữ liệu này\. Đây là kết quả danh sách rỗng hợp lệ, không phải lỗi hệ thống\.

```JSON
{
  "error": false,
  "message": "Chưa có thông tin người từng phụ trách Đơn hàng.",
  "data": {
    "order_code": "9001156990401",
    "total_assignments": 0,
    "items": []
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_SHIPPERS_FORBIDDEN`|Người gọi không có quyền xem Order hoặc danh sách người phụ trách theo Data Scope\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi được phép xem\.|
|`503 Service Unavailable`|`ORDER_SHIPPERS_UNAVAILABLE`|Tạm thời không thể tải lịch sử phân công đã đồng bộ\. Không dùng lỗi này khi danh sách hợp lệ nhưng chưa có dữ liệu\.|

### 4\.3\.7\. Lấy thông tin SLA của Đơn hàng

Lấy thông tin cam kết thời gian của Đơn hàng và kết quả đối chiếu với từng NVC\. API phân biệt rõ hai quan hệ:

1. **SLA với Shop:** SuperPlatform cam kết với Shop và đánh giá trên **toàn bộ Đơn hàng**\.
2. **SLA với NVC:** SuperPlatform đối chiếu với NVC theo **từng Waybill** mà NVC đã cấp\.

Không đánh giá SLA theo chặng\. Một Waybill có thể thực hiện nhiều chặng và một Đơn hàng có thể phát sinh nhiều Waybill\. Khi đổi NVC hoặc thay Waybill, kết quả SLA của Waybill cũ vẫn được giữ để đối chiếu; Waybill mới có kết quả SLA riêng\.

SLA không phải trạng thái Order và không thay thế hành trình vận chuyển\. Quá hạn SLA không tự chuyển trạng thái Order sang giao thất bại, có sự cố hoặc hoàn hàng\.

#### Căn cứ nghiệp vụ từ SuperShip Helpdocs

|Nội dung đã công bố|Ảnh hưởng đến API|
|---|---|
|Thời gian giao được công bố theo NVC và loại tuyến: nội tỉnh, nội miền, liên miền hoặc liên vùng|SLA Waybill phải lưu loại tuyến và khoảng thời gian tối thiểu–tối đa đã áp dụng; không dùng một thời hạn chung cho mọi NVC\.|
|Tuyến huyện/xã vùng sâu và tuyến đảo có thể được cộng thêm ngày|Phải trả riêng số ngày cộng thêm và nguyên nhân điều chỉnh; không sửa mất thời gian chuẩn ban đầu\.|
|Lễ, Tết, thiên tai, thời tiết, sự cố vận hành có thể cộng ngày hoặc không tính SLA|Phải lưu bản chụp từng điều chỉnh, thời gian hiệu lực và nguồn phê duyệt\. Không lấy thông báo hiện tại để sửa ngược dữ liệu cũ\.|
|Thời gian trả hàng được công bố riêng và một số tài liệu xác định đây là thời gian tham khảo|Waybill chiều hoàn phải có loại nghiệp vụ và mức cam kết riêng; không dùng SLA giao hàng cho chiều hoàn\.|
|Ngưỡng chốt quá hạn/đền bù có thể là 15 ngày từ lần cập nhật cuối hoặc 30 ngày làm việc từ lúc tạo, tùy NVC|Ngưỡng xử lý khiếu nại phải tách khỏi hạn giao thông thường; Waybill quá hạn giao chưa mặc nhiên đủ điều kiện đền bù\.|
|SLA xử lý Ticket như hối giao, log ảo hoặc thay đổi thông tin thuộc quy trình hỗ trợ|Không trả SLA Ticket trong API Order này\. SLA Ticket thuộc Support Module và được truy vấn theo Ticket\.|

Các khoảng thời gian trong Helpdocs là chính sách tham khảo hiện hành, không được viết cứng vào Order Module\. Khi Order/Waybill phát sinh, hệ thống phải lưu bản chụp chính sách và các điều chỉnh thực tế đã áp dụng để kết quả lịch sử không thay đổi khi tài liệu hoặc hợp đồng được cập nhật\.

#### Chức năng và thời điểm sử dụng

|Trường hợp sử dụng|Thời điểm gọi API|Thông tin cần hiển thị|
|---|---|---|
|Shop theo dõi cam kết của SuperPlatform|Khi mở chi tiết Order|Hạn hoàn thành toàn Đơn hàng, thời gian còn lại hoặc số phút quá hạn và kết quả thực tế khi Order đã hoàn thành\.|
|CSKH giải thích cam kết với Shop|Khi Shop hỏi về thời gian hoàn thành Order|SLA toàn Order đã được chốt tại thời điểm áp dụng; không dùng cấu hình hiện tại để sửa ngược dữ liệu cũ\.|
|Nội bộ đối chiếu NVC|Trong vận hành, báo cáo hoặc đối soát|Kết quả SLA riêng của từng Waybill, kể cả Waybill đã bị thay thế hoặc thuộc cùng một NVC\.|
|Nội bộ phát hiện chậm trễ|Khi Order hoặc Waybill sắp đến hạn/quá hạn|Quan hệ nào đang quá hạn: cam kết của SuperPlatform với Shop hay cam kết của NVC với SuperPlatform\.|

API có thể được gọi ở mọi trạng thái Order\. Shop chỉ nhận phần SLA của toàn Order\. Nhân viên nội bộ có quyền nhận thêm `carrier_slas` để đối chiếu từng Waybill\. Backend tự giới hạn dữ liệu theo Access Context, quyền và Data Scope; Response không công khai loại người gọi\.

Khi tạo Order, hệ thống đã có điểm đi, điểm đến và đối tác/Shop sở hữu nên phải xác định được `route_type`, chính sách SLA hiệu lực và lưu bản chụp kết quả\. Nếu không thể xác định tuyến hoặc chính sách dù Order yêu cầu áp dụng SLA, đó là lỗi dữ liệu/cấu hình cần xử lý tại thời điểm tạo Order hoặc trả lỗi hệ thống; không trả thành một kết quả nghiệp vụ “chưa đủ dữ liệu SLA”\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/orders/{order_code}/sla`|
|Thành công|`200 OK`|
|Quyền truy cập|Shop sở hữu Order, đối tác được ủy quyền hoặc nhân viên nội bộ có quyền và Data Scope phù hợp\.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định người gọi, quyền và Data Scope được phép truy cập.|
|`X-Correlation-Id`|Không|Mã truy vết do Consumer truyền; Backend tự tạo nếu không có.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order cần lấy thông tin SLA\.|

##### Ví dụ cURL

```Bash
curl --request GET '{{base_url}}/v1/orders/9001156990401/sla' \
  --header 'Authorization: Bearer {{access_token}}' \
  --header 'X-Correlation-Id: 6d70f5f9-ad3a-4e95-89ac-bd73bdd88c98'
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|`false` khi lấy dữ liệu thành công\.|
|`message`|string|Có|Thông báo ngắn gọn bằng tiếng Việt\.|
|`data`|object|Có|Thông tin SLA của Order\.|
|`data.order_code`|string|Có|Mã Order\.|
|`data.order_status`|string|Có|Mã trạng thái hiện tại của toàn Order, chỉ dùng làm ngữ cảnh\.|
|`data.order_status_name`|string|Có|Tên trạng thái hiện tại của toàn Order\.|
|`data.order_sla_available`|boolean|Có|`true` khi chính sách hiệu lực của đối tác/Shop áp dụng SLA cho Order; `false` chỉ khi chính sách xác định Order không áp dụng SLA\.|
|`data.order_sla`|object|Có điều kiện|SLA của toàn Đơn hàng trong cam kết giữa SuperPlatform và Shop\. Trả khi `order_sla_available = true`; bỏ trường khi bằng `false`\.|
|`data.order_sla.sla_code`|string|Có điều kiện|Mã bản chụp SLA của toàn Order do SuperPlatform tạo để truy vết\.|
|`data.order_sla.sla_name`|string|Có điều kiện|Tên cam kết hoàn thành Đơn hàng hiển thị cho Shop và nội bộ\.|
|`data.order_sla.policy_code`|string|Có điều kiện|Mã chính sách SLA của đối tác/Shop được áp dụng và lưu cùng Order\.|
|`data.order_sla.policy_version`|integer|Có điều kiện|Phiên bản chính sách SLA đã áp dụng tại thời điểm tạo Order; không thay đổi theo cấu hình mới\.|
|`data.order_sla.route_type`|integer|Có điều kiện|Loại tuyến được xác định từ điểm đi và điểm đến của Order: `1` — nội tỉnh; `2` — nội miền; `3` — liên miền; `4` — liên vùng; `5` — tuyến khác theo chính sách\.|
|`data.order_sla.started_at`|datetime|Có điều kiện|Thời điểm bắt đầu tính SLA của toàn Order theo chính sách đã áp dụng\.|
|`data.order_sla.expected_from`|datetime|Có điều kiện|Thời điểm sớm nhất dự kiến hoàn thành toàn Order theo cam kết với Shop\.|
|`data.order_sla.expected_to`|datetime|Có điều kiện|Thời điểm muộn nhất dự kiến hoàn thành toàn Order theo cam kết với Shop; đây là mốc dùng để xác định đúng hạn hoặc quá hạn\.|
|`data.order_sla.completed_at`|datetime|Không|Thời điểm toàn Order hoàn thành theo kết quả cuối cùng của nghiệp vụ\. Bỏ trường nếu Order chưa hoàn thành\.|
|`data.order_sla.result`|integer|Có điều kiện|`1` — đang trong hạn; `2` — đang quá hạn; `3` — hoàn thành đúng hạn; `4` — hoàn thành quá hạn\.|
|`data.order_sla.difference_minutes`|integer|Có điều kiện|Chênh lệch phút giữa thời điểm đánh giá/hoàn thành và `expected_to`\. Số âm là còn thời gian, `0` là đúng hạn, số dương là quá hạn\.|
|`data.order_sla.updated_at`|datetime|Có điều kiện|Thời điểm gần nhất kết quả SLA toàn Order được cập nhật\.|
|`data.order_sla_reason_code`|integer|Có điều kiện|Chỉ trả khi `order_sla_available = false`: `1` — chính sách hiệu lực xác định Order không áp dụng SLA\.|
|`data.order_sla_reason`|string|Có điều kiện|Giải thích bằng tiếng Việt vì sao chính sách không áp dụng SLA cho Order\.|
|`data.carrier_slas`|array\(object\)|Có điều kiện|Danh sách SLA giữa SuperPlatform và NVC theo từng Waybill; chỉ trả cho nội bộ có quyền\. Shop không nhận trường này\.|
|`data.carrier_slas[].carrier_code`|integer|Có điều kiện|Mã NVC sở hữu Waybill\.|
|`data.carrier_slas[].carrier_name`|string|Có điều kiện|Tên NVC sở hữu Waybill\.|
|`data.carrier_slas[].carrier_client_code`|string|Không|Mã khách hàng của Shop/SuperPlatform tại NVC nếu dữ liệu đối soát có cung cấp\.|
|`data.carrier_slas[].carrier_waybill_code`|string|Có điều kiện|Mã vận đơn NVC được dùng làm đơn vị đánh giá SLA\.|
|`data.carrier_slas[].service_flow`|integer|Có điều kiện|Chiều vận chuyển của Waybill: `1` — giao hàng; `2` — hoàn/trả hàng\. Không suy ra trường này từ một chặng riêng lẻ\.|
|`data.carrier_slas[].route_type`|integer|Có điều kiện|Loại tuyến đã dùng để chọn chính sách: `1` — nội tỉnh; `2` — nội miền; `3` — liên miền; `4` — liên vùng; `5` — tuyến khác theo cấu hình\.|
|`data.carrier_slas[].commitment_level`|integer|Có điều kiện|Mức áp dụng: `1` — thời gian cam kết; `2` — thời gian tham khảo; `3` — không tính SLA trong khoảng áp dụng\.|
|`data.carrier_slas[].standard_min_days`|number|Có điều kiện|Số ngày tối thiểu theo chính sách chuẩn của NVC và tuyến tại thời điểm tạo Waybill\. Hỗ trợ số thập phân như `0.5` ngày\.|
|`data.carrier_slas[].standard_max_days`|number|Có điều kiện|Số ngày tối đa theo chính sách chuẩn trước khi cộng các điều chỉnh\.|
|`data.carrier_slas[].additional_days`|number|Có điều kiện|Tổng số ngày được cộng thêm do vùng sâu, tuyến đảo, nghỉ lễ hoặc điều chỉnh đã được phê duyệt; trả `0` nếu không cộng thêm\.|
|`data.carrier_slas[].time_basis`|integer|Có điều kiện|Cách tính thời gian: `1` — ngày theo lịch; `2` — ngày làm việc; `3` — giờ liên tục; `4` — lịch vận hành riêng của NVC\.|
|`data.carrier_slas[].started_at`|datetime|Có điều kiện|Thời điểm bắt đầu tính SLA của Waybill theo cam kết với NVC\.|
|`data.carrier_slas[].expected_from`|datetime|Có điều kiện|Thời điểm sớm nhất dự kiến hoàn thành Waybill sau khi áp dụng lịch tính và các điều chỉnh\.|
|`data.carrier_slas[].expected_to`|datetime|Có điều kiện|Thời điểm muộn nhất dự kiến hoàn thành Waybill; dùng để đánh giá SLA vận chuyển khi `commitment_level = 1` hoặc cảnh báo tham khảo khi bằng `2`\.|
|`data.carrier_slas[].completed_at`|datetime|Không|Thời điểm Waybill đạt kết quả kết thúc được dùng để đối chiếu\. Bỏ trường nếu Waybill chưa kết thúc\.|
|`data.carrier_slas[].result`|integer|Có điều kiện|`1` — đang trong hạn; `2` — đang quá hạn; `3` — hoàn thành đúng hạn; `4` — hoàn thành quá hạn; `5` — chỉ theo dõi tham khảo; `6` — không tính SLA\.|
|`data.carrier_slas[].difference_minutes`|integer|Không|Chênh lệch phút giữa thời điểm đánh giá/hoàn thành Waybill và `expected_to`\. Bỏ trường khi không đủ dữ liệu hoặc `commitment_level = 3`\.|
|`data.carrier_slas[].adjustments`|array\(object\)|Có điều kiện|Các điều chỉnh đã áp dụng cho Waybill; trả `[]` khi không có điều chỉnh\.|
|`data.carrier_slas[].adjustments[].adjustment_type`|integer|Có điều kiện|`1` — vùng sâu/vùng xa; `2` — tuyến đảo; `3` — nghỉ lễ/Tết; `4` — thiên tai/thời tiết; `5` — sự cố vận hành; `6` — điều chỉnh được phê duyệt khác\.|
|`data.carrier_slas[].adjustments[].additional_days`|number|Có điều kiện|Số ngày được cộng bởi điều chỉnh; có thể bằng `0` khi điều chỉnh chỉ đánh dấu không tính SLA\.|
|`data.carrier_slas[].adjustments[].reason`|string|Có điều kiện|Lý do điều chỉnh bằng tiếng Việt\.|
|`data.carrier_slas[].adjustments[].effective_from`|datetime|Có điều kiện|Thời điểm điều chỉnh bắt đầu có hiệu lực\.|
|`data.carrier_slas[].adjustments[].effective_to`|datetime|Không|Thời điểm điều chỉnh hết hiệu lực; bỏ trường nếu chưa xác định\.|
|`data.carrier_slas[].updated_at`|datetime|Có điều kiện|Thời điểm gần nhất kết quả SLA của Waybill được cập nhật\.|
|`data.evaluated_at`|datetime|Có|Thời điểm gần nhất SuperPlatform đánh giá kết quả SLA\.|

##### Ví dụ Response — nhân viên nội bộ

```JSON
{
  "error": false,
  "message": "Lấy thông tin SLA thành công.",
  "data": {
    "order_code": "9001156990401",
    "order_status": "SPF-0801",
    "order_status_name": "Đang giao hàng",
    "order_sla_available": true,
    "order_sla": {
      "sla_code": "SLA-ORD-9001156990401",
      "sla_name": "Cam kết hoàn thành Đơn hàng với Shop",
      "policy_code": "SLA-S275518-202609",
      "policy_version": 3,
      "route_type": 3,
      "started_at": "2026-09-15T07:55:00+07:00",
      "expected_from": "2026-09-16T18:00:00+07:00",
      "expected_to": "2026-09-17T18:00:00+07:00",
      "result": 1,
      "difference_minutes": -1875,
      "updated_at": "2026-09-16T10:45:00+07:00"
    },
    "carrier_slas": [
      {
        "carrier_code": 1,
        "carrier_name": "SuperShip",
        "carrier_client_code": "S275518",
        "carrier_waybill_code": "STGS983262LM.826941741",
        "service_flow": 1,
        "route_type": 1,
        "commitment_level": 1,
        "standard_min_days": 0.5,
        "standard_max_days": 1,
        "additional_days": 0,
        "time_basis": 4,
        "started_at": "2026-09-15T07:55:00+07:00",
        "expected_from": "2026-09-15T08:30:00+07:00",
        "expected_to": "2026-09-15T09:00:00+07:00",
        "completed_at": "2026-09-15T08:40:00+07:00",
        "result": 3,
        "difference_minutes": -20,
        "adjustments": [],
        "updated_at": "2026-09-15T08:40:00+07:00"
      },
      {
        "carrier_code": 4,
        "carrier_name": "Viettel Post",
        "carrier_client_code": "S275518",
        "carrier_waybill_code": "SOO10902766013",
        "service_flow": 1,
        "route_type": 3,
        "commitment_level": 1,
        "standard_min_days": 2,
        "standard_max_days": 4,
        "additional_days": 2,
        "time_basis": 4,
        "started_at": "2026-09-15T09:45:00+07:00",
        "expected_from": "2026-09-17T18:00:00+07:00",
        "expected_to": "2026-09-21T18:00:00+07:00",
        "result": 1,
        "difference_minutes": -7635,
        "adjustments": [
          {
            "adjustment_type": 3,
            "additional_days": 2,
            "reason": "Chỉ tiêu toàn trình được cộng thêm 2 ngày theo lịch vận hành dịp lễ đã công bố.",
            "effective_from": "2026-09-16T00:00:00+07:00",
            "effective_to": "2026-09-17T23:59:59+07:00"
          }
        ],
        "updated_at": "2026-09-16T10:45:00+07:00"
      }
    ],
    "evaluated_at": "2026-09-16T10:45:00+07:00"
  }
}
```

Response trên cho biết toàn Order vẫn đang trong hạn cam kết với Shop\. Waybill SuperShip đã hoàn thành đúng hạn\. Waybill Viettel Post đang trong hạn sau khi áp dụng khoảng thời gian của tuyến và cộng thêm 2 ngày theo lịch vận hành dịp lễ\. Điều kiện khiếu nại và bồi thường được quản lý trong Support Module, không trả trong API SLA của Order\.

##### Ví dụ Response — Shop

Shop chỉ nhận SLA của toàn Order; không nhận `carrier_slas` hoặc điều khoản đối chiếu riêng giữa SuperPlatform và NVC\.

```JSON
{
  "error": false,
  "message": "Lấy thông tin SLA thành công.",
  "data": {
    "order_code": "9001156990401",
    "order_status": "SPF-0801",
    "order_status_name": "Đang giao hàng",
    "order_sla_available": true,
    "order_sla": {
      "sla_code": "SLA-ORD-9001156990401",
      "sla_name": "Cam kết hoàn thành Đơn hàng với Shop",
      "policy_code": "SLA-S275518-202609",
      "policy_version": 3,
      "route_type": 3,
      "started_at": "2026-09-15T07:55:00+07:00",
      "expected_from": "2026-09-16T18:00:00+07:00",
      "expected_to": "2026-09-17T18:00:00+07:00",
      "result": 1,
      "difference_minutes": -1875,
      "updated_at": "2026-09-16T10:45:00+07:00"
    },
    "evaluated_at": "2026-09-16T10:45:00+07:00"
  }
}
```

##### Ví dụ Response — không áp dụng SLA

Dùng khi dịch vụ/NVC của Order không có thời hạn cam kết được xác nhận\. Frontend hiển thị “Không áp dụng SLA” hoặc ẩn khối SLA theo thiết kế giao diện\.

```JSON
{
  "error": false,
  "message": "Đơn hàng không áp dụng SLA.",
  "data": {
    "order_code": "9001156990401",
    "order_status": "SPF-0801",
    "order_status_name": "Đang giao hàng",
    "order_sla_available": false,
    "order_sla_reason_code": 1,
    "order_sla_reason": "Đơn hàng không áp dụng SLA.",
    "carrier_slas": [],
    "evaluated_at": "2026-09-16T10:45:00+07:00"
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_SLA_FORBIDDEN`|Người gọi không có quyền xem Order hoặc SLA theo Data Scope\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi được phép xem\.|
|`503 Service Unavailable`|`ORDER_SLA_UNAVAILABLE`|Tạm thời không thể đọc chính sách/bản chụp SLA đã lưu hoặc đánh giá kết quả\. Không chuyển lỗi này thành `order_sla_available = false`\.|


## 4\.4\. Nhóm Lịch sử và tài chính

### 4\.4\.1\. Lấy lịch sử hoạt động của Đơn hàng

Lấy toàn bộ nhật ký nghiệp vụ đã phát sinh với một Order: tạo Order, thay đổi thông tin, đổi trạng thái, cập nhật từ NVC, tạo/đổi Waybill, yêu cầu lấy–giao–hoàn lại, sửa COD, in nhãn, thêm ảnh, liên kết yêu cầu hỗ trợ và thao tác xem dữ liệu nhạy cảm\.

Đây là lịch sử giải thích **ai đã làm gì, dữ liệu thay đổi thế nào và kết quả ra sao**\. API không thay thế `/tracking`: tracking mô tả kiện hàng đã di chuyển qua đâu, còn activities ghi nhận hành động của Shop, nội bộ, hệ thống và NVC liên quan đến Order\.

Shop được xem đầy đủ lịch sử thuộc Order của mình, gồm trạng thái NVC và các thao tác do Shop thực hiện\. Backend loại bỏ chi tiết kỹ thuật nội bộ, dữ liệu nhạy cảm và hoạt động không thuộc phạm vi Shop\. Nhân viên nội bộ được xem dữ liệu sâu hơn theo quyền và Data Scope\.

Trường `ip_address` chỉ được trả khi chính sách cho phép\. Nội bộ có thể nhận thêm trạng thái gốc NVC, Booking Attempt, thao tác hệ thống và nhật ký xem dữ liệu nhạy cảm\. API không trả raw webhook, access token, credential hoặc lỗi kỹ thuật nhạy cảm\.

Mỗi hoạt động phải có nội dung tiếng Việt sẵn để FE hiển thị và đồng thời có mã/thuộc tính có cấu trúc để FE chọn biểu tượng, màu sắc, bộ lọc và màn hình chi tiết\. FE không tự ghép câu từ raw event của NVC và không tự suy luận trạng thái Order từ lịch sử\.

Tất cả `data.items[]` sử dụng đúng một cấu trúc chung, không thay Response model theo `activity_group`\. Khác biệt giữa các nhóm hoạt động chỉ nằm trong giá trị `activity_key`, các phần tử `changes[]` và `references[]`\. FE có thể dựng timeline cơ bản chỉ bằng `title`, `description`, `occurred_at`, `actor` và `result`; phần chi tiết dùng chung hai danh sách `changes[]` và `references[]`\.

Danh sách được sắp xếp cố định theo `occurred_at` giảm dần, sau đó `sequence_no` giảm dần\. Vì Activity Log chỉ được ghi thêm và không sửa/xóa nội dung lịch sử, cùng một bộ lọc phải cho thứ tự ổn định khi phân trang\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/orders/{order_code}/activities`|
|Thành công|`200 OK`|
|Quyền truy cập|Shop sở hữu Order, đối tác được ủy quyền hoặc nhân viên nội bộ có quyền và Data Scope phù hợp\.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định người gọi, quyền và Data Scope được phép truy cập.|
|`X-Correlation-Id`|Không|Mã truy vết do Consumer truyền; Backend tự tạo nếu không có.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Định danh lấy từ URL\.|

##### Query Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`activity_groups`|array\(integer\)|Không|Lọc một hoặc nhiều nhóm hoạt động: `1` — tạo Order; `2` — thay đổi thông tin; `3` — thay đổi trạng thái Order; `4` — cập nhật trạng thái NVC/Waybill; `5` — yêu cầu vận hành lấy, giao, bàn giao hoặc hoàn; `6` — yêu cầu hỗ trợ liên quan Order; `7` — in nhãn; `8` — thêm hoặc xóa ảnh; `9` — thay đổi COD/tài chính; `10` — thay đổi NVC, chặng hoặc Waybill; `11` — đồng bộ/xử lý hệ thống; `12` — xem dữ liệu nhạy cảm\. Truyền dạng lặp hoặc danh sách phân tách bằng dấu phẩy theo chuẩn Gateway\.|
|`actor_types`|array\(integer\)|Không|Lọc chủ thể thực hiện: `1` — Shop/người dùng Shop; `2` — nhân viên nội bộ; `3` — hệ thống SuperPlatform; `4` — NVC; `5` — người/tài xế thực hiện; `6` — ứng dụng tích hợp được ủy quyền\.|
|`occurred_from`|datetime|Không|Chỉ lấy hoạt động xảy ra từ thời điểm này, bao gồm giá trị biên\.|
|`occurred_to`|datetime|Không|Chỉ lấy hoạt động xảy ra đến thời điểm này, bao gồm giá trị biên\.|
|`page`|integer|Không|Trang cần lấy, mặc định `1`\.|
|`page_size`|integer|Không|Số hoạt động mỗi trang, mặc định `20`, tối đa `100`\.|

Không có Request Body\.

##### Ví dụ cURL

```Bash
curl --request GET '{{base_url}}/v1/orders/9001156990401/activities?activity_groups=3,4,7,9&page=1&page_size=20' \
  --header 'Authorization: Bearer {{access_token}}' \
  --header 'X-Correlation-Id: b5367826-dc45-4b58-96e1-d03477ca6b85'
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|`false` khi API xử lý thành công\.|
|`message`|string|Có|Thông báo ngắn gọn bằng tiếng Việt\.|
|`data`|object|Có|Lịch sử hoạt động của Order\.|
|`data.order_code`|string|Có|Mã Order được tra cứu\.|
|`data.items`|array\(object\)|Có|Danh sách hoạt động theo `occurred_at` giảm dần; trả `[]` nếu chưa có dữ liệu trong phạm vi được xem\.|
|`data.items[].activity_id`|string|Có|Định danh duy nhất, không đổi của bản ghi lịch sử; FE dùng làm `key` và chống hiển thị trùng\. Không suy ra nghiệp vụ từ định dạng mã\.|
|`data.items[].sequence_no`|integer|Có|Số thứ tự tăng dần trong phạm vi Order, dùng phân xử khi nhiều hoạt động có cùng `occurred_at`\.|
|`data.items[].activity_group`|integer|Có|Nhóm hoạt động, nhận một trong các giá trị từ `1` đến `12` đã mô tả tại Query Parameters; FE dùng để lọc và chọn cách trình bày chung\.|
|`data.items[].activity_key`|string|Có|Khóa nghiệp vụ ổn định để FE hoặc hệ thống tích hợp nhận diện hành động, ví dụ `ORDER_STATUS_CHANGED`, `CARRIER_STATUS_RECEIVED`, `COD_CHANGED`, `LABEL_PRINTED`\. Không dùng nội dung `title` để xử lý logic\.|
|`data.items[].activity_name`|string|Có|Tên loại hoạt động bằng tiếng Việt\.|
|`data.items[].title`|string|Có|Nội dung ngắn để hiển thị trên dòng thời gian\.|
|`data.items[].description`|string|Có|Diễn giải đầy đủ, dễ hiểu về hành động và kết quả\.|
|`data.items[].result`|integer|Có|Kết quả: `1` — thành công; `2` — thất bại; `3` — đang xử lý; `4` — ghi nhận thông tin, không có khái niệm thành công/thất bại\.|
|`data.items[].occurred_at`|datetime|Có|Thời điểm hoạt động thực tế xảy ra tại nguồn nghiệp vụ\. Đây là thời gian chính FE hiển thị\.|
|`data.items[].recorded_at`|datetime|Có|Thời điểm SuperPlatform ghi nhận hoạt động\. Có thể khác `occurred_at` khi webhook NVC đến trễ hoặc dữ liệu được đồng bộ lại\.|
|`data.items[].actor`|object|Có|Chủ thể đã tạo ra hoạt động\.|
|`data.items[].actor.actor_type`|integer|Có|Loại chủ thể: `1` — Shop; `2` — nội bộ; `3` — hệ thống; `4` — NVC; `5` — người/tài xế thực hiện; `6` — ứng dụng tích hợp\.|
|`data.items[].actor.actor_code`|string|Không|Mã tài khoản, nhân viên, NVC hoặc Application nếu được phép hiển thị; bỏ trường nếu nguồn không cung cấp hoặc người gọi không có quyền\.|
|`data.items[].actor.actor_name`|string|Có|Tên hiển thị của người, hệ thống hoặc NVC thực hiện\.|
|`data.items[].source`|object|Có|Nguồn tiếp nhận hoạt động\.|
|`data.items[].source.source_type`|integer|Có|`1` — SuperPlatform Web; `2` — SuperPlatform App; `3` — API tích hợp; `4` — webhook NVC; `5` — tiến trình hệ thống; `6` — công cụ nội bộ\.|
|`data.items[].source.application_name`|string|Không|Tên Application/kênh tạo hoạt động nếu có\.|
|`data.items[].source.application_version`|string|Không|Phiên bản ứng dụng nếu nguồn gửi có cung cấp\.|
|`data.items[].source.ip_address`|string|Không|Địa chỉ IP của thao tác người dùng; chỉ trả khi người gọi được phép xem\.|
|`data.items[].changes`|array\(object\)|Có|Các giá trị đã thay đổi; trả `[]` nếu hoạt động không thay đổi trường dữ liệu\.|
|`data.items[].changes[].field`|string|Có điều kiện|Đường dẫn trường ổn định, ví dụ `cod_amount`, `receiver.phone` hoặc `order_status`\.|
|`data.items[].changes[].field_name`|string|Có điều kiện|Tên tiếng Việt của trường thay đổi\.|
|`data.items[].changes[].value_type`|integer|Có điều kiện|Kiểu giá trị: `1` — văn bản; `2` — số; `3` — tiền; `4` — ngày giờ; `5` — đúng/sai; `6` — đối tượng hoặc danh sách\.|
|`data.items[].changes[].old_value`|any JSON|Không|Giá trị trước thay đổi ở dạng máy đọc được; bỏ trường nếu không có hoặc không được phép xem\.|
|`data.items[].changes[].new_value`|any JSON|Không|Giá trị sau thay đổi ở dạng máy đọc được; bỏ trường nếu không có hoặc không được phép xem\.|
|`data.items[].changes[].old_display_value`|string|Không|Giá trị cũ đã định dạng để FE hiển thị, ví dụ `1.000.000 ₫`; bỏ trường nếu không có giá trị cũ\.|
|`data.items[].changes[].new_display_value`|string|Không|Giá trị mới đã định dạng để FE hiển thị\.|
|`data.items[].changes[].currency`|string|Không|Mã tiền tệ ISO 4217, ví dụ `VND`; chỉ trả khi `value_type = 3`\.|
|`data.items[].references`|array\(object\)|Có|Các đối tượng liên quan; trả `[]` nếu không có\. Dùng mảng vì một hoạt động có thể đồng thời liên quan Ticket, Waybill và yêu cầu vận hành\.|
|`data.items[].references[].reference_type`|integer|Có điều kiện|`1` — Ticket hỗ trợ; `2` — yêu cầu vận hành; `3` — ảnh/tệp; `4` — lần in nhãn; `5` — Booking Attempt; `6` — Waybill; `7` — chặng; `8` — NVC; `9` — đối tượng liên quan khác\.|
|`data.items[].references[].reference_code`|string|Có điều kiện|Mã tham chiếu dùng để tra cứu đối tượng liên quan\.|
|`data.items[].references[].reference_name`|string|Không|Tên tiếng Việt của đối tượng tham chiếu để FE hiển thị\.|
|`data.meta`|object|Có|Thông tin phân trang\.|
|`data.meta.page`|integer|Có|Trang hiện tại\.|
|`data.meta.page_size`|integer|Có|Số hoạt động tối đa trên trang\.|
|`data.meta.total_items`|integer|Có|Tổng số hoạt động phù hợp bộ lọc và quyền xem\.|
|`data.meta.total_pages`|integer|Có|Tổng số trang\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Lấy lịch sử hành động thành công.",
  "data": {
    "items": [
      {
        "activity_id": "ACT-9001156990401-00018",
        "sequence_no": 18,
        "activity_group": 3,
        "activity_key": "ORDER_STATUS_CHANGED",
        "activity_name": "Thay đổi trạng thái Đơn hàng",
        "title": "Đơn hàng đã được cập nhật sang Đã giao hàng",
        "description": "SuperPlatform đã cập nhật trạng thái Đơn hàng sau khi Viettel Post xác nhận giao hàng thành công.",
        "result": 1,
        "occurred_at": "2026-09-16T08:48:00+07:00",
        "recorded_at": "2026-09-16T08:48:01+07:00",
        "actor": {
          "actor_type": 3,
          "actor_name": "SuperPlatform"
        },
        "source": {
          "source_type": 5
        },
        "changes": [
          {
            "field": "order_status",
            "field_name": "Trạng thái Đơn hàng",
            "value_type": 1,
            "old_value": "SPF-0801",
            "new_value": "SPF-0901",
            "old_display_value": "Đang giao hàng",
            "new_display_value": "Đã giao hàng"
          },
          {
            "field": "carrier_status",
            "field_name": "Trạng thái Viettel Post",
            "value_type": 1,
            "new_display_value": "Giao hàng thành công"
          }
        ],
        "references": [
          {
            "reference_type": 6,
            "reference_code": "SOO10902766013",
            "reference_name": "Vận đơn Viettel Post"
          },
          {
            "reference_type": 8,
            "reference_code": "4",
            "reference_name": "Viettel Post"
          }
        ]
      },
      {
        "activity_id": "ACT-9001156990401-00012",
        "sequence_no": 12,
        "activity_group": 9,
        "activity_key": "COD_CHANGED",
        "activity_name": "Thay đổi COD",
        "title": "Tiền thu hộ đã được thay đổi",
        "description": "Shop đã yêu cầu thay đổi tiền thu hộ từ 1.000.000 ₫ sang 100.000 ₫ và yêu cầu đã được xử lý thành công.",
        "result": 1,
        "occurred_at": "2026-09-15T14:59:00+07:00",
        "recorded_at": "2026-09-15T14:59:02+07:00",
        "actor": {
          "actor_type": 1,
          "actor_code": "S983262",
          "actor_name": "SUPERSHIP TEST"
        },
        "source": {
          "source_type": 1,
          "application_name": "SuperPlatform Web"
        },
        "changes": [
          {
            "field": "cod_amount",
            "field_name": "Tiền thu hộ",
            "value_type": 3,
            "old_value": 1000000,
            "new_value": 100000,
            "old_display_value": "1.000.000 ₫",
            "new_display_value": "100.000 ₫",
            "currency": "VND"
          }
        ],
        "references": [
          {
            "reference_type": 1,
            "reference_code": "4581236655799939",
            "reference_name": "Yêu cầu hỗ trợ sửa COD"
          }
        ]
      },
      {
        "activity_id": "ACT-9001156990401-00005",
        "sequence_no": 5,
        "activity_group": 7,
        "activity_key": "LABEL_PRINTED",
        "activity_name": "In nhãn",
        "title": "Nhãn giao hàng đã được in",
        "description": "Tuấn (Libe) đã in nhãn giao hàng khổ A7.",
        "result": 1,
        "occurred_at": "2026-09-13T10:15:00+07:00",
        "recorded_at": "2026-09-13T10:15:00+07:00",
        "actor": {
          "actor_type": 1,
          "actor_code": "S947167",
          "actor_name": "Tuấn (Libe)"
        },
        "source": {
          "source_type": 1,
          "application_name": "SuperPlatform Web",
          "application_version": "1.0.48",
          "ip_address": "42.112.207.148"
        },
        "changes": [],
        "references": [
          {
            "reference_type": 4,
            "reference_code": "PRINT-9001156990401-00002",
            "reference_name": "Lần in nhãn A7"
          }
        ]
      }
    ],
    "meta": {
      "page": 1,
      "page_size": 20,
      "total_items": 18,
      "total_pages": 1
    }
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`400 Bad Request`|`ACTIVITY_FILTER_INVALID`|Bộ lọc thời gian, loại hoạt động hoặc phân trang không hợp lệ\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_ACTIVITIES_FORBIDDEN`|Người gọi không có quyền xem Order hoặc lịch sử theo Data Scope\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi được phép xem\.|
|`503 Service Unavailable`|`ORDER_ACTIVITIES_UNAVAILABLE`|Tạm thời không thể đọc nhật ký hoạt động đã lưu\.|

### 4\.4\.2\. Lấy phí và tiền thu hộ của Đơn hàng

Lấy snapshot các khoản tiền đang gắn với Order để hiển thị cho Shop và nhân viên nội bộ: trị giá khai báo, mã giá đã áp dụng, từng khoản phí, bên trả phí, tiền thu hộ, tổng tiền cần thu Người nhận và tình trạng thu/chuyển tiền thu hộ\.

API phân biệt hai lớp tiền độc lập:

1. `order_fee_items[]` là **giá bán của SuperPlatform áp dụng cho toàn Order** và dùng để thu Shop/Người nhận\. Khoản tiền này không gắn trực tiếp với một Carrier Waybill\.
2. `carrier_costs[]` là **giá vốn từng NVC tính cho SuperPlatform**, được đối chiếu riêng theo từng Waybill\. Chỉ nhân viên nội bộ có quyền được nhận trường này\.

Một Order có thể có nhiều Waybill nên tổng giá bán Order không được suy ra bằng cách lấy phí của một Waybill, và phí của NVC không được trả cho Shop như phí SuperPlatform thu Shop\. Response dành cho Shop không có `carrier_costs` và `internal_summary`; Response nội bộ có thể nhận thêm hai trường này theo quyền\.

API chỉ cung cấp số liệu hiện hành của một Order, không phải sổ cái, chứng từ đối soát hoặc lịch sử biến động tiền\. Lịch sử thay đổi COD/phí được xem tại API activities; chi tiết phiên đối soát, công nợ và bút toán thuộc module tài chính tương ứng\. Backend trả dữ liệu theo quyền của người gọi; Shop không nhận giá vốn NVC hoặc dữ liệu kế toán nội bộ\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/orders/{order_code}/finance`|
|Thành công|`200 OK`|
|Quyền truy cập|Shop sở hữu Order, đối tác được ủy quyền hoặc nhân viên nội bộ có quyền và Data Scope phù hợp\.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định người gọi, quyền và Data Scope được phép truy cập.|
|`X-Correlation-Id`|Không|Mã truy vết do Consumer truyền; Backend tự tạo nếu không có.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Định danh lấy từ URL\.|

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|`false` khi API xử lý thành công\.|
|`message`|string|Có|Thông báo ngắn gọn bằng tiếng Việt\.|
|`data`|object|Có|Snapshot phí và tiền thu hộ hiện hành của Order\.|
|`data.order_code`|string|Có|Mã Order\.|
|`data.pricing_code`|string|Có|Mã giá đã áp dụng cho Order\. Không trả tên, cấu hình hoặc công thức nội bộ của bảng giá\.|
|`data.declared_value`|integer|Có|Trị giá khai báo, VND\.|
|`data.fee_payer`|integer|Có|`1` — Shop; `2` — Người nhận\.|
|`data.order_fee_items`|array\(object\)|Có|Các khoản phí/giảm trừ trong giá bán SuperPlatform áp dụng cho Order; trả `[]` khi chưa phát sinh khoản phí\. Không chứa mã Waybill\.|
|`data.order_fee_items[].fee_type`|integer|Có điều kiện|Loại khoản tiền: `1` — phí vận chuyển; `2` — phí bảo hiểm; `3` — phí hoàn/trả; `4` — phí chuyển tiếp; `5` — phí đổi địa chỉ; `6` — phí thu hộ; `7` — phụ phí khác; `8` — giảm trừ/ưu đãi\.|
|`data.order_fee_items[].fee_name`|string|Có điều kiện|Tên khoản tiền bằng tiếng Việt\.|
|`data.order_fee_items[].amount`|integer|Có điều kiện|Số tiền nguyên theo `currency`, không âm\. Với `fee_type = 8`, số tiền được trừ khỏi tổng phí\.|
|`data.order_fee_items[].payer`|integer|Có điều kiện|Bên chịu khoản tiền: `1` — Shop; `2` — Người nhận; `3` — SuperPlatform/NVC chịu theo chính sách\.|
|`data.shipping_fee`|integer|Có|Tổng phí vận chuyển sau giảm trừ đang áp dụng cho Order, VND\.|
|`data.total_fee`|integer|Có|Tổng tất cả khoản phí Shop/Người nhận phải trả sau giảm trừ, VND\.|
|`data.cod_amount`|integer|Có|Tiền hàng yêu cầu NVC thu hộ từ Người nhận; bằng `0` nếu Order không thu hộ\.|
|`data.collection_amount`|integer|Có|Tổng tiền dự kiến thu Người nhận, gồm COD và khoản phí Người nhận phải trả\.|
|`data.collected_amount`|integer|Có|Số tiền NVC/SuperPlatform đã xác nhận thực thu từ Người nhận\. Bằng `0` khi chưa thu\.|
|`data.cod_collection_status`|integer|Có|Tình trạng thu tiền Người nhận: `1` — không có COD; `2` — chờ thu; `3` — đã thu; `4` — thu một phần; `5` — không thu được\.|
|`data.settled_amount`|integer|Có|Số tiền thu hộ đã được xác nhận chuyển/đối soát cho Shop trong phạm vi Order\. Bằng `0` khi chưa chuyển\.|
|`data.cod_settlement_status`|integer|Có|Tình trạng chuyển tiền thu hộ: `1` — không áp dụng; `2` — chưa đến kỳ/chờ đối soát; `3` — đang xử lý; `4` — đã chuyển một phần; `5` — đã chuyển đủ; `6` — đang tạm giữ\.|
|`data.compensation_amount`|integer|Có|Số tiền bồi thường đã được phê duyệt cho Order; bằng `0` khi chưa có khoản bồi thường được phê duyệt\.|
|`data.compensation_status`|integer|Có|Tình trạng bồi thường: `1` — không phát sinh; `2` — đang xem xét; `3` — đã phê duyệt; `4` — đã chi trả; `5` — bị từ chối\. Đây chỉ là snapshot kết quả do module sở hữu nghiệp vụ cung cấp\.|
|`data.carrier_costs`|array\(object\)|Có điều kiện|Giá vốn theo từng Waybill; chỉ trả cho nội bộ có quyền\. Mỗi Waybill có một phần tử, kể cả nhiều Waybill thuộc cùng NVC\.|
|`data.carrier_costs[].carrier_code`|integer|Có điều kiện|Mã NVC phát hành Waybill\.|
|`data.carrier_costs[].carrier_name`|string|Có điều kiện|Tên NVC\.|
|`data.carrier_costs[].carrier_client_code`|string|Không|Mã khách hàng/tài khoản dùng với NVC nếu được phép đối chiếu nội bộ\.|
|`data.carrier_costs[].carrier_waybill_code`|string|Có điều kiện|Mã Waybill được NVC tính phí\.|
|`data.carrier_costs[].cost_status`|integer|Có điều kiện|Mức xác nhận giá vốn: `1` — tạm tính/báo giá; `2` — NVC đã xác nhận; `3` — đã điều chỉnh; `4` — đang chờ đối soát\.|
|`data.carrier_costs[].fee_items`|array\(object\)|Có điều kiện|Chi tiết giá vốn NVC của Waybill; trả `[]` khi NVC chưa cung cấp chi tiết\.|
|`data.carrier_costs[].fee_items[].fee_type`|integer|Có điều kiện|Loại giá vốn dùng cùng danh mục `fee_type` của `order_fee_items[]`\.|
|`data.carrier_costs[].fee_items[].fee_name`|string|Có điều kiện|Tên khoản giá vốn bằng tiếng Việt\.|
|`data.carrier_costs[].fee_items[].amount`|integer|Có điều kiện|Số tiền NVC tính cho SuperPlatform, không âm, theo `currency`\.|
|`data.carrier_costs[].total_cost`|integer|Có điều kiện|Tổng giá vốn của Waybill sau điều chỉnh/giảm trừ hiện hành\.|
|`data.carrier_costs[].updated_at`|datetime|Có điều kiện|Thời điểm giá vốn Waybill được cập nhật gần nhất\.|
|`data.internal_summary`|object|Có điều kiện|Tổng hợp giá bán và giá vốn của Order; chỉ trả cho nội bộ có quyền\.|
|`data.internal_summary.order_revenue`|integer|Có điều kiện|Tổng phí SuperPlatform ghi nhận thu từ Shop/Người nhận cho Order\.|
|`data.internal_summary.total_carrier_cost`|integer|Có điều kiện|Tổng `total_cost` của các Waybill hiện có trong `carrier_costs[]`\.|
|`data.internal_summary.gross_margin`|integer|Có điều kiện|Chênh lệch `order_revenue - total_carrier_cost`; có thể âm\. Chưa bao gồm các khoản ngoài phạm vi Order nếu module tài chính chưa phân bổ\.|
|`data.currency`|string|Có|Luôn `VND`\.|
|`data.updated_at`|datetime|Có|Thời điểm snapshot phí và tiền thu hộ được cập nhật gần nhất\.|

##### Ví dụ Response — nội bộ

```JSON
{
  "error": false,
  "message": "Lấy phí và tiền thu hộ của Đơn hàng thành công.",
  "data": {
    "order_code": "9001156990401",
    "pricing_code": "PRC-S983262-GHN-202609",
    "declared_value": 200000,
    "fee_payer": 2,
    "order_fee_items": [
      {
        "fee_type": 1,
        "fee_name": "Phí vận chuyển",
        "amount": 19000,
        "payer": 2
      },
      {
        "fee_type": 2,
        "fee_name": "Phí bảo hiểm",
        "amount": 0,
        "payer": 1
      }
    ],
    "shipping_fee": 19000,
    "total_fee": 19000,
    "cod_amount": 200000,
    "collection_amount": 219000,
    "collected_amount": 0,
    "cod_collection_status": 2,
    "settled_amount": 0,
    "cod_settlement_status": 2,
    "compensation_amount": 0,
    "compensation_status": 1,
    "carrier_costs": [
      {
        "carrier_code": 1,
        "carrier_name": "SuperShip",
        "carrier_client_code": "S983262",
        "carrier_waybill_code": "STGS983262LM.826941741",
        "cost_status": 2,
        "fee_items": [
          {
            "fee_type": 1,
            "fee_name": "Giá vốn lấy hàng về Hub",
            "amount": 5000
          }
        ],
        "total_cost": 5000,
        "updated_at": "2026-09-15T09:45:00+07:00"
      },
      {
        "carrier_code": 2,
        "carrier_name": "Giao Hàng Nhanh",
        "carrier_client_code": "S983262",
        "carrier_waybill_code": "GY8YLSDK",
        "cost_status": 2,
        "fee_items": [
          {
            "fee_type": 1,
            "fee_name": "Giá vốn giao hàng",
            "amount": 11000
          },
          {
            "fee_type": 2,
            "fee_name": "Giá vốn bảo hiểm",
            "amount": 0
          }
        ],
        "total_cost": 11000,
        "updated_at": "2026-09-16T10:45:00+07:00"
      }
    ],
    "internal_summary": {
      "order_revenue": 19000,
      "total_carrier_cost": 16000,
      "gross_margin": 3000
    },
    "currency": "VND",
    "updated_at": "2026-09-16T10:45:00+07:00"
  }
}
```

##### Ví dụ Response — Shop

```JSON
{
  "error": false,
  "message": "Lấy phí và tiền thu hộ của Đơn hàng thành công.",
  "data": {
    "order_code": "9001156990401",
    "pricing_code": "PRC-S983262-GHN-202609",
    "declared_value": 200000,
    "fee_payer": 2,
    "order_fee_items": [
      {
        "fee_type": 1,
        "fee_name": "Phí vận chuyển",
        "amount": 19000,
        "payer": 2
      },
      {
        "fee_type": 2,
        "fee_name": "Phí bảo hiểm",
        "amount": 0,
        "payer": 1
      }
    ],
    "shipping_fee": 19000,
    "total_fee": 19000,
    "cod_amount": 200000,
    "collection_amount": 219000,
    "collected_amount": 0,
    "cod_collection_status": 2,
    "settled_amount": 0,
    "cod_settlement_status": 2,
    "compensation_amount": 0,
    "compensation_status": 1,
    "currency": "VND",
    "updated_at": "2026-09-16T10:45:00+07:00"
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_FINANCE_FORBIDDEN`|Người gọi không có quyền xem Order hoặc dữ liệu tiền theo Data Scope\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi được phép xem\.|
|`503 Service Unavailable`|`ORDER_FINANCE_UNAVAILABLE`|Tạm thời không thể đọc snapshot phí và tiền thu hộ của Order\.|


## 4\.5\. Nhóm Ghi chú và hình ảnh

### 4\.5\.1\. Lấy ghi chú của Đơn hàng

Lấy các `OrderNote` để hiển thị tại khối **Ghi chú đơn hàng** trên trang chi tiết Order. Mỗi ghi chú được phân loại theo nghiệp vụ chung, lấy hàng, giao hàng hoặc hoàn/trả hàng để người dùng và FE dễ theo dõi. Ghi chú vẫn thuộc cấp toàn Order, không phải bản ghi riêng của chặng, Carrier Waybill hoặc NVC.

API không trả tracking, ảnh/POD, hướng dẫn giao hàng gửi NVC hoặc nội dung Ticket hỗ trợ. Những dữ liệu đó được truy vấn bằng API nghiệp vụ tương ứng. Nếu tương lai phát sinh chức năng ghi chú riêng theo chặng thì phải thiết kế endpoint cấp chặng, không mở rộng `OrderNote` bằng một khối ngữ cảnh khó hiểu.

Backend tự xác định các ghi chú người gọi được phép xem từ Access Context, quyền và Data Scope. Shop không thể yêu cầu xem ghi chú nội bộ; Response không công khai trường phân loại quyền và không làm lộ số lượng ghi chú ngoài phạm vi.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/orders/{order_code}/notes`|
|Đối tượng nghiệp vụ|`OrderNote` — ghi chú cộng tác ở cấp toàn Order.|
|Nơi sử dụng|Khối **Ghi chú đơn hàng** trên trang chi tiết Order của Shop và nội bộ.|
|Mục đích sử dụng|Tra cứu nội dung ghi chú, người tạo và thời điểm tạo mà người gọi được phép xem.|
|Thành công|`200 OK`|
|Quyền truy cập|Shop sở hữu Order hoặc nhân viên nội bộ có quyền xem ghi chú trong Data Scope được cấp.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định người gọi, quyền và Data Scope được phép truy cập.|
|`X-Correlation-Id`|Không|Mã truy vết do Consumer truyền; Backend tự tạo nếu không có.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order cần lấy ghi chú.|

##### Query Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`page`|integer|Không|Trang cần lấy; mặc định `1`, nhỏ nhất `1`.|
|`page_size`|integer|Không|Số ghi chú trên một trang; mặc định `20`, từ `1` đến `100`.|
|`note_types`|array(integer)|Không|Lọc theo một hoặc nhiều loại ghi chú: `1` — ghi chú chung của Order; `2` — ghi chú lấy hàng; `3` — ghi chú giao hàng; `4` — ghi chú hoàn/trả hàng. Không truyền thì lấy tất cả loại người gọi được phép xem.|
|`sort_direction`|integer|Không|Thứ tự theo thời điểm tạo: `1` — mới nhất trước; `2` — cũ nhất trước. Mặc định `1`.|

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|`false` khi API xử lý thành công.|
|`message`|string|Có|Thông báo kết quả bằng tiếng Việt.|
|`data`|object|Có|Danh sách ghi chú của Order.|
|`data.order_code`|string|Có|Mã Order.|
|`data.notes`|array(object)|Có|Các ghi chú người gọi được phép xem; trả `[]` nếu chưa có ghi chú.|
|`data.notes[].note_code`|string|Có|Mã ghi chú.|
|`data.notes[].note_type`|integer|Có|Loại ghi chú: `1` — ghi chú chung của Order; `2` — ghi chú lấy hàng; `3` — ghi chú giao hàng; `4` — ghi chú hoàn/trả hàng.|
|`data.notes[].note_type_name`|string|Có|Tên tiếng Việt tương ứng với `note_type` để FE hiển thị.|
|`data.notes[].content`|string|Có|Nội dung ghi chú.|
|`data.notes[].created_by`|object|Có|Người hoặc hệ thống tạo ghi chú.|
|`data.notes[].created_by.actor_type`|integer|Có|`1` — người dùng Shop; `2` — nhân viên nội bộ; `3` — hệ thống.|
|`data.notes[].created_by.actor_code`|string|Có|Mã người dùng hoặc hệ thống tạo ghi chú.|
|`data.notes[].created_by.display_name`|string|Có|Tên hiển thị của người hoặc hệ thống tạo ghi chú.|
|`data.notes[].created_at`|datetime|Có|Thời điểm tạo ghi chú.|
|`data.meta`|object|Có|Thông tin phân trang.|
|`data.meta.page`|integer|Có|Trang hiện tại.|
|`data.meta.page_size`|integer|Có|Số phần tử tối đa trên trang.|
|`data.meta.total_notes`|integer|Có|Tổng số ghi chú người gọi được phép xem.|
|`data.meta.total_pages`|integer|Có|Tổng số trang.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Lấy ghi chú của Đơn hàng thành công.",
  "data": {
    "order_code": "9001156990401",
    "notes": [
      {
        "note_code": "NOTE-9001156990401-0002",
        "note_type": 3,
        "note_type_name": "Ghi chú giao hàng",
        "content": "Người nhận xác nhận chỉ có thể nhận kiện sau 17:00.",
        "created_by": {
          "actor_type": 1,
          "actor_code": "S983262-U018",
          "display_name": "Nguyễn Minh Hậu"
        },
        "created_at": "2026-09-16T14:59:00+07:00"
      }
    ],
    "meta": {
      "page": 1,
      "page_size": 20,
      "total_notes": 1,
      "total_pages": 1
    }
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`400 Bad Request`|`INVALID_NOTE_TYPE`|`note_types` chứa loại ghi chú không được hỗ trợ.|
|`400 Bad Request`|`INVALID_PAGINATION`|`page`, `page_size` hoặc `sort_direction` không hợp lệ.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực.|
|`403 Forbidden`|`ORDER_NOTES_FORBIDDEN`|Người gọi không có quyền xem ghi chú của Order.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi được phép truy cập.|

### 4\.5\.2\. Tạo ghi chú cho Đơn hàng

Tạo một `OrderNote` mới và xác định loại nghiệp vụ của ghi chú để hiển thị tại khối **Ghi chú đơn hàng**. Ghi chú đã tạo được giữ như lịch sử và API hiện tại không hỗ trợ sửa hoặc xóa ghi chú.

Backend xác định phạm vi sử dụng của ghi chú từ Access Context và chính sách áp dụng cho chức năng đang gọi; Consumer không truyền hoặc nhận trường phân loại quyền. Thao tác không gửi nội dung sang NVC, không tạo Ticket, không thay đổi trạng thái, tracking, COD, phí hoặc ảnh của Order.

API được sử dụng trong các trường hợp sau:

|Loại ghi chú|Khi sử dụng|Ví dụ nghiệp vụ|
|---|---|---|
|`1` — Ghi chú chung|Thông tin cần lưu để Shop và nhân viên được phép xem hiểu thêm về toàn bộ Order nhưng không thuộc riêng quá trình lấy, giao hoặc hoàn/trả hàng.|“Đơn gồm hai kiện nhưng được đóng chung trong một bao.”|
|`2` — Ghi chú lấy hàng|Thông tin phục vụ theo dõi việc chuẩn bị kiện, liên hệ Shop, vị trí nhận kiện hoặc tình huống phát sinh trong quá trình NVC đến lấy hàng.|“Kiện để tại quầy bảo vệ; liên hệ nhân viên kho trước khi lấy.”|
|`3` — Ghi chú giao hàng|Thông tin phục vụ theo dõi việc liên hệ người nhận, thời gian có thể nhận, hướng dẫn tiếp cận địa chỉ hoặc tình huống phát sinh trong quá trình giao.|“Người nhận xác nhận chỉ có thể nhận kiện sau 17:00.”|
|`4` — Ghi chú hoàn/trả hàng|Thông tin phục vụ theo dõi quá trình thu hồi, chuyển hoàn, địa điểm Shop nhận lại kiện hoặc tình trạng kiện khi trả hàng.|“Shop nhận hàng hoàn tại kho Quận 8 trong giờ hành chính.”|

Nếu nội dung cần làm NVC thay đổi COD, địa chỉ, lịch trình, trạng thái hoặc thực hiện lại việc lấy/giao/hoàn thì Consumer phải gọi API nghiệp vụ tương ứng. Việc tạo ghi chú chỉ lưu nội dung theo dõi trên Order và không được xem là NVC đã tiếp nhận yêu cầu.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`POST`|
|Endpoint / Event|`/v1/orders/{order_code}/notes`|
|Đối tượng nghiệp vụ|`OrderNote` — ghi chú cộng tác ở cấp toàn Order.|
|Nơi sử dụng|Chức năng **Thêm ghi chú** trong khối Ghi chú đơn hàng.|
|Mục đích sử dụng|Lưu ghi chú theo đúng nhóm nghiệp vụ để Shop và nhân viên nội bộ theo dõi Order thống nhất.|
|Thành công|`201 Created`|
|Quyền truy cập|Shop sở hữu Order hoặc nhân viên nội bộ có quyền tạo ghi chú trong Data Scope được cấp.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định người gọi, quyền và Data Scope được phép thao tác.|
|`Content-Type: application/json`|Có|Request Body sử dụng JSON.|
|`Idempotency-Key`|Có|Chống tạo trùng khi request được gửi lại. Cùng key và cùng payload trả cùng kết quả; cùng key nhưng khác payload trả `IDEMPOTENCY_CONFLICT`.|
|`X-Correlation-Id`|Không|Mã truy vết do Consumer truyền; Backend tự tạo nếu không có.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order được thêm ghi chú.|

##### Request Body

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`note_type`|integer|Có|Loại nghiệp vụ của ghi chú: `1` — thông tin chung của toàn Order; `2` — thông tin liên quan đến lấy hàng; `3` — thông tin liên quan đến giao hàng; `4` — thông tin liên quan đến hoàn hoặc trả hàng. Trường này dùng để phân nhóm hiển thị, không tạo hoặc lựa chọn chặng vận chuyển.|
|`content`|string|Có|Nội dung ghi chú, từ `1` đến `2000` ký tự sau khi loại khoảng trắng thừa.|

##### Ví dụ Request

```JSON
{
  "note_type": 3,
  "content": "Người nhận xác nhận chỉ có thể nhận kiện sau 17:00."
}
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|`false` khi API xử lý thành công.|
|`message`|string|Có|Thông báo kết quả bằng tiếng Việt.|
|`data`|object|Có|Ghi chú vừa được tạo.|
|`data.order_code`|string|Có|Mã Order.|
|`data.note_code`|string|Có|Mã ghi chú mới.|
|`data.note_type`|integer|Có|Loại ghi chú đã lưu: `1` — ghi chú chung của Order; `2` — ghi chú lấy hàng; `3` — ghi chú giao hàng; `4` — ghi chú hoàn/trả hàng.|
|`data.note_type_name`|string|Có|Tên tiếng Việt tương ứng với `note_type`.|
|`data.content`|string|Có|Nội dung ghi chú.|
|`data.created_by`|object|Có|Người hoặc hệ thống tạo ghi chú.|
|`data.created_by.actor_type`|integer|Có|`1` — người dùng Shop; `2` — nhân viên nội bộ; `3` — hệ thống.|
|`data.created_by.actor_code`|string|Có|Mã người hoặc hệ thống tạo.|
|`data.created_by.display_name`|string|Có|Tên hiển thị.|
|`data.created_at`|datetime|Có|Thời điểm tạo.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Tạo ghi chú cho Đơn hàng thành công.",
  "data": {
    "order_code": "9001156990401",
    "note_code": "NOTE-9001156990401-0002",
    "note_type": 3,
    "note_type_name": "Ghi chú giao hàng",
    "content": "Người nhận xác nhận chỉ có thể nhận kiện sau 17:00.",
    "created_by": {
      "actor_type": 1,
      "actor_code": "S983262-U018",
      "display_name": "Nguyễn Minh Hậu"
    },
    "created_at": "2026-09-16T14:59:00+07:00"
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`400 Bad Request`|`INVALID_NOTE_TYPE`|`note_type` không thuộc danh mục được hỗ trợ.|
|`400 Bad Request`|`INVALID_NOTE_CONTENT`|Nội dung rỗng, vượt giới hạn hoặc không hợp lệ.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực.|
|`403 Forbidden`|`ORDER_NOTE_CREATE_FORBIDDEN`|Người gọi không có quyền tạo ghi chú cho Order.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi được phép truy cập.|
|`409 Conflict`|`IDEMPOTENCY_CONFLICT`|`Idempotency-Key` đã được dùng với nội dung Request khác.|

### 4\.5\.3\. Lấy hình ảnh nghiệp vụ của Đơn hàng

Lấy toàn bộ ảnh hiện có của một Order để hiển thị trên trang chi tiết đơn hàng\. Một Order chỉ có số lượng ảnh nhỏ nên API trả toàn bộ danh sách, không phân trang và không yêu cầu bộ lọc\.

Ảnh có thể do Shop tải lên hoặc được SuperPlatform tiếp nhận từ nhân viên nội bộ, NVC/shipper hay hệ thống tích hợp\. Mỗi ảnh phải cho biết loại ảnh và nguồn cung cấp; nếu ảnh đến từ NVC thì trả thêm NVC và mã vận đơn liên quan\. Backend tự giới hạn các ảnh người gọi được phép xem và không trả trường phân loại quyền\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/orders/{order_code}/images`|
|Đối tượng nghiệp vụ|`OrderImage` — ảnh được gắn với Order\.|
|Nơi sử dụng|Khu vực **Hình ảnh đơn hàng** và **Bằng chứng vận chuyển** trên trang chi tiết Order\.|
|Mục đích sử dụng|Hiển thị ảnh hàng hóa do Shop cung cấp và ảnh lấy/giao/hoàn hoặc sự cố do NVC hay SuperPlatform ghi nhận\.|
|Thành công|`200 OK`|
|Quyền truy cập|Shop sở hữu Order hoặc nhân viên nội bộ có quyền xem hình ảnh trong Data Scope được cấp\.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định người gọi, quyền và Data Scope được phép truy cập.|
|`X-Correlation-Id`|Không|Mã truy vết do Consumer truyền; Backend tự tạo nếu không có.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order cần lấy hình ảnh\.|

##### Ví dụ Request

```HTTP
GET /v1/orders/9001156990401/images HTTP/1.1
Authorization: Bearer {access_token}
X-Correlation-Id: 01K5C7B8KX2Y9N6T4M3Q1R0S8V
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|`false` khi API xử lý thành công\.|
|`message`|string|Có|Thông báo ngắn gọn bằng tiếng Việt\.|
|`data`|object|Có|Thông tin Order và toàn bộ ảnh người gọi được phép xem\.|
|`data.order_code`|string|Có|Mã Order được lấy hình ảnh\.|
|`data.images`|array\(object\)|Có|Hình ảnh người gọi được phép xem; trả `[]` nếu chưa có ảnh\.|
|`data.images[].image_code`|string|Có|Mã hình ảnh\.|
|`data.images[].image_type`|integer|Có|Loại ảnh: `1` — hàng hóa; `2` — lấy hàng; `3` — giao hàng; `4` — hoàn/trả hàng; `5` — hư hỏng hoặc sự cố; `6` — khác\.|
|`data.images[].image_type_name`|string|Có|Tên loại ảnh bằng tiếng Việt\.|
|`data.images[].description`|string|Có điều kiện|Mô tả ảnh; bỏ trường nếu không có\.|
|`data.images[].image_url`|string|Có|URL dùng để hiển thị ảnh\. Không dùng URL làm mã định danh ảnh\.|
|`data.images[].source_type`|integer|Có|Nguồn cung cấp ảnh: `1` — Shop; `2` — nhân viên nội bộ SuperPlatform; `3` — NVC/shipper; `4` — hệ thống tích hợp\.|
|`data.images[].source_name`|string|Có|Tên Shop, nhân viên, NVC hoặc hệ thống đã cung cấp ảnh\.|
|`data.images[].carrier_code`|integer|Có điều kiện|Mã NVC; chỉ trả khi ảnh được tiếp nhận từ NVC/shipper\.|
|`data.images[].carrier_waybill_code`|string|Có điều kiện|Mã vận đơn của NVC; chỉ trả khi ảnh gắn với một vận đơn xác định\.|
|`data.images[].created_at`|datetime|Có|Thời điểm SuperPlatform ghi nhận ảnh vào Order\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Lấy danh sách hình ảnh thành công.",
  "data": {
    "order_code": "9001156990401",
    "images": [
      {
        "image_code": "IMG-9001156990401-0003",
        "image_type": 3,
        "image_type_name": "Ảnh giao hàng",
        "description": "Kiện hàng đã được giao tại địa chỉ người nhận.",
        "image_url": "https://files.superplatform.vn/orders/9001156990401/images/IMG-9001156990401-0003",
        "source_type": 3,
        "source_name": "Giao Hàng Nhanh",
        "carrier_code": 2,
        "carrier_waybill_code": "GY8YLSDK",
        "created_at": "2026-09-16T18:05:03+07:00"
      },
      {
        "image_code": "IMG-9001156990401-0001",
        "image_type": 1,
        "image_type_name": "Ảnh hàng hóa",
        "description": "Ảnh kiện hàng do Shop chụp trước khi bàn giao cho Nhà vận chuyển.",
        "image_url": "https://files.superplatform.vn/orders/9001156990401/images/IMG-9001156990401-0001",
        "source_type": 1,
        "source_name": "Shop Minh Hậu",
        "created_at": "2026-09-15T07:49:12+07:00"
      }
    ]
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`400 Bad Request`|`INVALID_ORDER_CODE`|`order_code` không đúng định dạng\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_IMAGES_FORBIDDEN`|Người gọi không có quyền xem hình ảnh của Order\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi được phép truy cập\.|

### 4\.5\.4\. Thêm hình ảnh vào Đơn hàng

API này chỉ dành cho Shop gắn ảnh hàng hóa của chính Order\. Shop sử dụng khi tạo Order chưa có đủ ảnh hoặc cần bổ sung/thay thế cách thể hiện kiện hàng trước khi NVC lấy hàng thành công\. Ảnh đã gắn được lưu thành từng bản ghi riêng; ảnh mới không sửa đè ảnh cũ\.

Shop phải tải tệp lên File Service trước và truyền `file_code` vào API này\. Module Order không nhận binary hoặc Base64\. Khi NVC đã lấy hàng thành công, Shop không được bổ sung ảnh bằng endpoint này\.

**Ảnh do NVC cung cấp:** NVC không gọi endpoint của Shop\. Webhook hoặc kết quả tra cứu từ NVC được Carrier Module xác thực, đối chiếu mã vận đơn, chuẩn hóa loại ảnh và chuyển tệp vào File Service\. Sau đó Carrier Module đồng bộ tham chiếu ảnh đã chuẩn hóa sang Order\. Order lưu ảnh với nguồn NVC cùng `carrier_code` và `carrier_waybill_code` để API 4\.5\.3 trả về cho Shop hoặc nội bộ theo quyền\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`POST`|
|Endpoint / Event|`/v1/orders/{order_code}/images`|
|Đối tượng nghiệp vụ|`OrderImage` — ảnh hàng hóa do Shop cung cấp\.|
|Nơi sử dụng|Chức năng **Thêm ảnh hàng hóa** trên trang tạo hoặc chi tiết Order\.|
|Mục đích sử dụng|Gắn một ảnh hàng hóa đã tải lên File Service vào Order trước khi NVC lấy hàng thành công\.|
|Thành công|`201 Created`|
|Quyền truy cập|Người dùng Shop sở hữu Order và có quyền cập nhật ảnh hàng hóa\. Nhân viên nội bộ, NVC và hệ thống tích hợp không sử dụng endpoint này\.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định người gọi, quyền và Data Scope được phép thao tác.|
|`Content-Type: application/json`|Có|Request Body sử dụng JSON\. Tệp ảnh đã được tải riêng lên File Service\.|
|`Idempotency-Key`|Có|Chống xử lý trùng khi request được gửi lại. Cùng key và cùng payload trả lại cùng kết quả; cùng key nhưng khác payload trả `IDEMPOTENCY_CONFLICT`.|
|`X-Correlation-Id`|Không|Mã truy vết do Consumer truyền; Backend tự tạo nếu không có.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order của Shop cần thêm ảnh\.|

##### Request Body

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`file_code`|string|Có|Mã ảnh Shop đã tải lên File Service\. File phải còn hiệu lực, thuộc Shop đang gọi API và chưa được gắn vào Order này\.|
|`description`|string|Không|Mô tả ảnh, tối đa `500` ký tự\.|

##### Ví dụ Request

```JSON
{
  "file_code": "FILE-20260916-008521",
  "description": "Ảnh kiện hàng sau khi đóng gói và dán băng keo."
}
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|`false` khi API xử lý thành công\.|
|`message`|string|Có|Thông báo ngắn gọn bằng tiếng Việt\.|
|`data`|object|Có|Hình ảnh đã lưu\.|
|`data.order_code`|string|Có|Mã Order được thêm ảnh\.|
|`data.image_code`|string|Có|Mã hình ảnh\.|
|`data.image_type`|integer|Có|Luôn trả `1` — ảnh hàng hóa do Shop cung cấp\.|
|`data.image_type_name`|string|Có|Luôn trả `Ảnh hàng hóa`\.|
|`data.description`|string|Có điều kiện|Mô tả ảnh; bỏ trường nếu Request không có\.|
|`data.image_url`|string|Có|URL dùng để hiển thị ảnh\. Không dùng URL làm mã định danh ảnh\.|
|`data.source_type`|integer|Có|Luôn trả `1` — Shop\.|
|`data.source_name`|string|Có|Tên Shop cung cấp ảnh\.|
|`data.created_at`|datetime|Có|Thời điểm SuperPlatform ghi nhận ảnh vào Order\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Thêm hình ảnh vào Đơn hàng thành công.",
  "data": {
    "order_code": "9001156990401",
    "image_code": "IMG-9001156990401-0004",
    "image_type": 1,
    "image_type_name": "Ảnh hàng hóa",
    "description": "Ảnh kiện hàng sau khi đóng gói và dán băng keo.",
    "image_url": "https://files.superplatform.vn/orders/9001156990401/images/IMG-9001156990401-0004",
    "source_type": 1,
    "source_name": "Shop Minh Hậu",
    "created_at": "2026-09-16T08:13:12+07:00"
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`400 Bad Request`|`INVALID_IMAGE_DATA`|`file_code` hoặc mô tả ảnh không hợp lệ\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_IMAGE_CREATE_FORBIDDEN`|Người gọi không phải Shop sở hữu Order hoặc không có quyền thêm ảnh\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi được phép truy cập\.|
|`404 Not Found`|`FILE_NOT_FOUND`|Không tìm thấy `file_code` còn hiệu lực trong File Service\.|
|`409 Conflict`|`IMAGE_ALREADY_ATTACHED`|File đã được gắn vào Order và không được phép tạo liên kết trùng\.|
|`409 Conflict`|`ORDER_IMAGE_UPLOAD_CLOSED`|NVC đã lấy hàng thành công nên Shop không còn được bổ sung ảnh bằng API này\.|
|`409 Conflict`|`IDEMPOTENCY_CONFLICT`|`Idempotency-Key` đã được dùng với nội dung Request khác\.|

### 4\.5\.5\. Gỡ một hoặc nhiều hình ảnh khỏi Đơn hàng

Shop sử dụng API này để gỡ một hoặc nhiều ảnh hàng hóa mà Shop đã thêm khỏi Order\. Mỗi ảnh phải thuộc chính Order, có nguồn là Shop và Order chưa được NVC lấy hàng thành công\.

API xóa liên kết ảnh khỏi Order; vòng đời tệp vật lý do File Service quản lý\. Ảnh do NVC/shipper, nhân viên nội bộ hoặc hệ thống tích hợp cung cấp không được gỡ bằng API của Shop\. Danh sách `image_codes` được kiểm tra toàn bộ trước khi thực hiện; nếu một ảnh không hợp lệ thì không ảnh nào bị gỡ\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`POST`|
|Endpoint / Event|`/v1/orders/{order_code}/images/remove`|
|Đối tượng nghiệp vụ|`OrderImage` — ảnh hàng hóa do Shop đã gắn với Order\.|
|Nơi sử dụng|Nút **Gỡ ảnh** hoặc **Gỡ các ảnh đã chọn** tại khu vực ảnh hàng hóa trên trang tạo hoặc chi tiết Order\.|
|Mục đích sử dụng|Gỡ một hoặc nhiều ảnh hàng hóa do Shop đã thêm khỏi Order trước khi NVC lấy hàng thành công\.|
|Thành công|`200 OK`|
|Quyền truy cập|Người dùng thuộc Shop sở hữu Order và có quyền cập nhật ảnh hàng hóa\. Nhân viên nội bộ, NVC và hệ thống tích hợp không sử dụng endpoint này\.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định người gọi, quyền và Data Scope được phép thao tác.|
|`Content-Type: application/json`|Có|Request Body sử dụng JSON\.|
|`Idempotency-Key`|Có|Chống xử lý trùng khi request được gửi lại\. Cùng key và cùng payload trả lại cùng kết quả; cùng key nhưng khác payload trả `IDEMPOTENCY_CONFLICT`\.|
|`X-Correlation-Id`|Không|Mã truy vết do Consumer truyền; Backend tự tạo nếu không có.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order của Shop cần gỡ ảnh\.|

##### Request Body

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`image_codes`|array\(string\)|Có|Danh sách mã ảnh cần gỡ khỏi Order, tối thiểu một phần tử và không được chứa mã trùng nhau\. Mỗi ảnh phải thuộc Order và có nguồn là Shop\.|

##### Ví dụ Request

```JSON
{
  "image_codes": [
    "IMG-9001156990401-0001",
    "IMG-9001156990401-0004"
  ]
}
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|`false` khi API xử lý thành công\.|
|`message`|string|Có|Thông báo ngắn gọn bằng tiếng Việt\.|
|`data`|object|Có|Kết quả gỡ ảnh khỏi Order\.|
|`data.order_code`|string|Có|Mã Order\.|
|`data.removed_image_codes`|array\(string\)|Có|Danh sách mã ảnh đã được gỡ khỏi Order\.|
|`data.removed_count`|integer|Có|Số lượng ảnh đã được gỡ thành công\.|
|`data.updated_at`|datetime|Có|Thời điểm Order được cập nhật sau khi gỡ ảnh\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Gỡ hình ảnh khỏi Đơn hàng thành công.",
  "data": {
    "order_code": "9001156990401",
    "removed_image_codes": [
      "IMG-9001156990401-0001",
      "IMG-9001156990401-0004"
    ],
    "removed_count": 2,
    "updated_at": "2026-09-16T08:20:00+07:00"
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`400 Bad Request`|`INVALID_IMAGE_CODES`|`image_codes` rỗng, sai định dạng hoặc chứa mã trùng nhau\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_IMAGE_REMOVE_FORBIDDEN`|Người gọi không thuộc Shop sở hữu Order hoặc không có quyền cập nhật ảnh\.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi được phép truy cập\.|
|`404 Not Found`|`ORDER_IMAGE_NOT_FOUND`|Có ít nhất một mã trong `image_codes` không được gắn với Order\. Không ảnh nào bị gỡ\.|
|`409 Conflict`|`IMAGE_SOURCE_NOT_SHOP`|Có ít nhất một ảnh do NVC/shipper, nhân viên nội bộ hoặc hệ thống tích hợp cung cấp\. Không ảnh nào bị gỡ\.|
|`409 Conflict`|`ORDER_IMAGE_REMOVE_CLOSED`|NVC đã lấy hàng thành công nên Shop không còn được gỡ ảnh khỏi Order\.|
|`409 Conflict`|`IDEMPOTENCY_CONFLICT`|`Idempotency-Key` đã được dùng với nội dung Request khác\.|

## 4\.6\. Nhóm Nhãn giao hàng

Các API liên quan đến in Nhãn Giao Hàng gồm:

|API|Mục đích|
|---|---|
|`GET /v1/orders/{order_code}/prints`|Xem các lần đã in hoặc in lại nhãn của một Order\.|
|`GET /v1/order-labels/types`|Lấy các loại/khổ nhãn người gọi có thể lựa chọn\.|
|`POST /v1/order-labels/tokens`|Kiểm tra điều kiện và tạo token in cho một hoặc nhiều Order\. Một Order cũng được gửi dưới dạng danh sách có một phần tử\.|
|`GET /v1/order-labels/print?print_token={token}`|Dùng token còn hiệu lực để nhận file nhãn đã render\.|

Luồng in: giao diện lấy loại nhãn → gửi một hoặc nhiều mã Order để tạo token → dùng token nhận file nhãn → SuperPlatform ghi nhận lịch sử in cho từng Order/Waybill có trong file\.

### 4\.6\.1\. Lấy lịch sử in nhãn giao hàng

Lấy toàn bộ các lần in hoặc in lại nhãn vận chuyển của một Order để Shop và nhân viên nội bộ biết ai đã in, in lúc nào, dùng khổ nhãn nào và nhãn thuộc NVC/Waybill nào\.

Mỗi lần yêu cầu tạo file nhãn, dù thành công hay thất bại, được ghi thành một bản ghi riêng\. Một Order thường chỉ có ít lần in nên API trả toàn bộ lịch sử, không phân trang và không cần bộ lọc\. Với Order có nhiều Carrier Waybill, mỗi bản ghi phải xác định đúng NVC và Waybill đã được chọn tại thời điểm in\.

Việc xem lịch sử không tạo file nhãn mới và không thay đổi trạng thái Order\. Mỗi lần in giữ snapshot mã loại tem, tên loại tem, phiên bản nội dung và khổ giấy đã dùng để lịch sử không thay đổi khi cấu hình tem được tùy chỉnh trong tương lai\. Phase hiện tại chưa cung cấp chức năng quản trị nội dung mẫu tem\. Địa chỉ IP chỉ được trả khi hệ thống có ghi nhận và người gọi được phép xem dữ liệu Audit\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/orders/{order_code}/prints`|
|Đối tượng nghiệp vụ|`OrderPrint` — một lần tạo file nhãn cho Order/Carrier Waybill\.|
|Nơi sử dụng|Chức năng **Xem lịch sử in** trên trang chi tiết Order\.|
|Mục đích sử dụng|Tra cứu lần in đầu, các lần in lại, người thực hiện và kết quả tạo file nhãn\.|
|Thành công|`200 OK`|
|Quyền truy cập|Shop sở hữu Order hoặc nhân viên nội bộ có quyền xem lịch sử in trong Data Scope được cấp.|

#### Request

##### Headers

|Header|Bắt buộc|Ý nghĩa|
|---|---|---|
|`Authorization: Bearer {access_token}`|Có|Xác định người gọi, quyền và Data Scope được phép truy cập.|
|`X-Correlation-Id`|Không|Mã truy vết do Consumer truyền; Backend tự tạo nếu không có.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`order_code`|string|Có|Mã Order cần lấy lịch sử in nhãn.|

##### Ví dụ Request

```HTTP
GET /v1/orders/9001156990401/prints HTTP/1.1
Authorization: Bearer {access_token}
X-Correlation-Id: 01K5C7B8KX2Y9N6T4M3Q1R0S8V
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|`false` khi API xử lý thành công.|
|`message`|string|Có|Thông báo kết quả bằng tiếng Việt.|
|`data`|object|Có|Lịch sử in nhãn của Order.|
|`data.order_code`|string|Có|Mã Order.|
|`data.total_prints`|integer|Có|Tổng số lần yêu cầu in đã được ghi nhận, gồm cả thành công và thất bại\.|
|`data.successful_prints`|integer|Có|Số lần tạo file nhãn thành công\.|
|`data.failed_prints`|integer|Có|Số lần tạo file nhãn thất bại\.|
|`data.reprints`|integer|Có|Số lần yêu cầu in lại sau lần tạo nhãn thành công đầu tiên, gồm cả yêu cầu thành công và thất bại\.|
|`data.prints`|array(object)|Có|Danh sách các lần yêu cầu in, sắp xếp mới nhất trước; trả `[]` nếu chưa từng yêu cầu in nhãn\.|
|`data.prints[].print_code`|string|Có|Mã định danh duy nhất của lần in.|
|`data.prints[].sequence_no`|integer|Có|Số thứ tự yêu cầu in của Order, bắt đầu từ `1`\.|
|`data.prints[].print_type`|integer|Có|Loại lần in: `1` — in lần đầu; `2` — in lại\.|
|`data.prints[].print_type_name`|string|Có|Tên loại lần in để FE hiển thị: `In lần đầu` hoặc `In lại`\.|
|`data.prints[].print_scope`|integer|Có|Phạm vi file nhãn: `1` — chỉ có Order này; `2` — in cùng nhiều Order\.|
|`data.prints[].print_scope_name`|string|Có|Tên phạm vi in: `In riêng` hoặc `In hàng loạt`\.|
|`data.prints[].orders_in_file`|integer|Có|Tổng số Order được đưa vào cùng file nhãn của lần in\.|
|`data.prints[].carrier_code`|integer|Có|Mã NVC phát hành Carrier Waybill.|
|`data.prints[].carrier_name`|string|Có|Tên NVC.|
|`data.prints[].carrier_waybill_code`|string|Có|Mã Carrier Waybill được in trên nhãn.|
|`data.prints[].carrier_sorting_code`|string|Có điều kiện|Mã phân loại đã được dùng trên nhãn tại thời điểm in; bỏ trường nếu NVC không cung cấp\.|
|`data.prints[].label_code`|string|Có|Mã loại tem đã dùng, ví dụ `A7`\. Đây là mã ổn định để đối chiếu loại tem, không phải mã lần in\.|
|`data.prints[].label_name`|string|Có|Tên loại tem tại thời điểm in, ví dụ `Nhãn giao hàng A7`\.|
|`data.prints[].label_version`|integer|Có|Phiên bản nội dung của loại tem tại thời điểm in, bắt đầu từ `1`\. Khi nội dung tem được tùy chỉnh trong tương lai, lịch sử vẫn giữ phiên bản cũ đã sử dụng\.|
|`data.prints[].paper_size`|string|Có|Khổ giấy thực tế của tem, ví dụ `A7`, `A6`, `100x100` hoặc `S10-100x150`\. Tách khỏi `label_code` để tương lai có thể có nhiều loại tem dùng chung một khổ giấy\.|
|`data.prints[].output_format`|integer|Có|Định dạng file: `1` — PDF; `2` — PNG; `3` — ZPL\.|
|`data.prints[].output_format_name`|string|Có|Tên định dạng file: `PDF`, `PNG` hoặc `ZPL`\.|
|`data.prints[].print_channel`|integer|Có|Kênh thực hiện: `1` — SuperPlatform Web; `2` — ứng dụng di động; `3` — Partner API; `4` — nội bộ SuperPlatform\.|
|`data.prints[].print_channel_name`|string|Có|Tên kênh thực hiện để FE hiển thị\.|
|`data.prints[].print_result`|integer|Có|Kết quả: `1` — thành công; `2` — thất bại.|
|`data.prints[].print_result_name`|string|Có|Tên kết quả: `Thành công` hoặc `Thất bại`\.|
|`data.prints[].failure_code`|string|Có điều kiện|Mã lỗi chuẩn hóa; chỉ trả khi `print_result = 2`.|
|`data.prints[].failure_reason`|string|Có điều kiện|Lý do in thất bại bằng tiếng Việt; chỉ trả khi `print_result = 2`.|
|`data.prints[].requested_by`|object|Có|Người, ứng dụng hoặc hệ thống yêu cầu in\.|
|`data.prints[].requested_by.actor_type`|integer|Có|`1` — người dùng Shop; `2` — nhân viên nội bộ; `3` — ứng dụng đối tác; `4` — hệ thống\.|
|`data.prints[].requested_by.actor_code`|string|Có|Mã người dùng, ứng dụng hoặc hệ thống yêu cầu in\.|
|`data.prints[].requested_by.display_name`|string|Có|Tên hiển thị của người hoặc nguồn yêu cầu in\.|
|`data.prints[].ip_address`|string|Có điều kiện|Địa chỉ IP ghi nhận khi in; chỉ trả cho nhân viên nội bộ có quyền Audit và khi hệ thống có dữ liệu.|
|`data.prints[].requested_at`|datetime|Có|Thời điểm người dùng hoặc hệ thống gửi yêu cầu tạo file nhãn\.|
|`data.prints[].completed_at`|datetime|Có|Thời điểm SuperPlatform kết thúc tạo file hoặc ghi nhận thất bại\.|

##### Ví dụ Response — nội bộ

```JSON
{
  "error": false,
  "message": "Lấy lịch sử in nhãn giao hàng thành công.",
  "data": {
    "order_code": "9001156990401",
    "total_prints": 3,
    "successful_prints": 2,
    "failed_prints": 1,
    "reprints": 2,
    "prints": [
      {
        "print_code": "PRT-9001156990401-0003",
        "sequence_no": 3,
        "print_type": 2,
        "print_type_name": "In lại",
        "print_scope": 2,
        "print_scope_name": "In hàng loạt",
        "orders_in_file": 5,
        "carrier_code": 6,
        "carrier_name": "BEST Express",
        "carrier_waybill_code": "999800060098412",
        "carrier_sorting_code": "OO012-00-003-02",
        "label_code": "A7",
        "label_name": "Nhãn giao hàng A7",
        "label_version": 1,
        "paper_size": "A7",
        "output_format": 1,
        "output_format_name": "PDF",
        "print_channel": 1,
        "print_channel_name": "SuperPlatform Web",
        "print_result": 2,
        "print_result_name": "Thất bại",
        "failure_code": "LABEL_RENDER_FAILED",
        "failure_reason": "Không thể tạo file nhãn tại thời điểm yêu cầu.",
        "requested_by": {
          "actor_type": 1,
          "actor_code": "S947167-U012",
          "display_name": "Tuấn (Libe)"
        },
        "ip_address": "42.112.207.148",
        "requested_at": "2026-09-13T10:20:00+07:00",
        "completed_at": "2026-09-13T10:20:02+07:00"
      },
      {
        "print_code": "PRT-9001156990401-0002",
        "sequence_no": 2,
        "print_type": 2,
        "print_type_name": "In lại",
        "print_scope": 2,
        "print_scope_name": "In hàng loạt",
        "orders_in_file": 5,
        "carrier_code": 6,
        "carrier_name": "BEST Express",
        "carrier_waybill_code": "999800060098412",
        "carrier_sorting_code": "OO012-00-003-02",
        "label_code": "A7",
        "label_name": "Nhãn giao hàng A7",
        "label_version": 1,
        "paper_size": "A7",
        "output_format": 1,
        "output_format_name": "PDF",
        "print_channel": 1,
        "print_channel_name": "SuperPlatform Web",
        "print_result": 1,
        "print_result_name": "Thành công",
        "requested_by": {
          "actor_type": 1,
          "actor_code": "S947167-U012",
          "display_name": "Tuấn (Libe)"
        },
        "ip_address": "42.112.207.148",
        "requested_at": "2026-09-13T10:15:00+07:00",
        "completed_at": "2026-09-13T10:15:03+07:00"
      },
      {
        "print_code": "PRT-9001156990401-0001",
        "sequence_no": 1,
        "print_type": 1,
        "print_type_name": "In lần đầu",
        "print_scope": 1,
        "print_scope_name": "In riêng",
        "orders_in_file": 1,
        "carrier_code": 6,
        "carrier_name": "BEST Express",
        "carrier_waybill_code": "999800060098412",
        "carrier_sorting_code": "OO012-00-003-02",
        "label_code": "A7",
        "label_name": "Nhãn giao hàng A7",
        "label_version": 1,
        "paper_size": "A7",
        "output_format": 1,
        "output_format_name": "PDF",
        "print_channel": 1,
        "print_channel_name": "SuperPlatform Web",
        "print_result": 1,
        "print_result_name": "Thành công",
        "requested_by": {
          "actor_type": 1,
          "actor_code": "S947167-U012",
          "display_name": "Tuấn (Libe)"
        },
        "ip_address": "171.242.198.215",
        "requested_at": "2026-09-13T00:21:00+07:00",
        "completed_at": "2026-09-13T00:21:04+07:00"
      }
    ]
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`400 Bad Request`|`INVALID_ORDER_CODE`|`order_code` không đúng định dạng\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực.|
|`403 Forbidden`|`ORDER_PRINT_HISTORY_FORBIDDEN`|Người gọi không có quyền xem lịch sử in của Order.|
|`404 Not Found`|`ORDER_NOT_FOUND`|Không tìm thấy Order trong phạm vi được phép truy cập.|

### 4\.6\.2\. Lấy danh sách loại Nhãn Giao Hàng có thể in

Lấy danh sách loại Nhãn Giao Hàng có thể in\.

#### Endpoint

|**Thuộc tính**|**Nội dung**|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/order-labels/types`|
|Thành công|`200 OK`|

#### Request

##### Headers

Dùng header chung tại mục 2\.2\. `Idempotency-Key` bắt buộc với API tạo hoặc thực hiện hành vi có thể gửi lặp\.

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`Authorization`|header|Có|Thông tin xác thực; Backend xác định Actor, quyền và Data Scope\.|
|`X-Correlation-Id`|header|Không|Correlation ID phục vụ truy vết; Backend tự tạo nếu Consumer không truyền\.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|Không có|—|—|Endpoint không có Path Parameter\.|

##### Query Parameters / Request Body

Không có Request Body\. Path Parameters lấy từ URL; Actor và Data Scope lấy từ token\.

#### Response

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`error`|boolean|Có|`false` khi API xử lý thành công\.|
|`message`|string|Có|Thông báo kết quả bằng tiếng Việt\.|
|`data`|object|Có|Dữ liệu các loại Nhãn Giao Hàng có thể lựa chọn\.|
|`data.label_types`|array\(object\)|Có|Danh sách loại/khổ in SuperPlatform đang hỗ trợ; có thể rỗng nếu hiện không có loại in khả dụng\.|
|`data.label_types[].label_code`|string|Có theo phần tử|Mã loại Nhãn Giao Hàng dùng khi tạo Token in\.|
|`data.label_types[].label_name`|string|Có theo phần tử|Tên loại Nhãn Giao Hàng dùng để hiển thị trên UI\.|
|`data.label_types[].paper_size`|string|Có theo phần tử|Tên khổ giấy chuẩn hoặc mã kích thước, ví dụ `A7`, `A6`, `100X100` hoặc `S10`\.|
|`data.label_types[].width_mm`|integer|Có theo phần tử|Chiều rộng tem theo milimét, lớn hơn `0`\.|
|`data.label_types[].height_mm`|integer|Có theo phần tử|Chiều cao tem theo milimét, lớn hơn `0`\.|
|`data.label_types[].display_size`|string|Có theo phần tử|Kích thước đã định dạng để FE hiển thị, theo mẫu `{width} × {height} mm`\.|
|`data.label_types[].is_default`|boolean|Có theo phần tử|`true` nếu đây là loại in mặc định mà UI nên chọn ban đầu\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Lấy danh sách loại Nhãn Giao Hàng thành công.",
  "data": {
    "label_types": [
      {
        "label_code": "A7",
        "label_name": "Nhãn giao hàng A7",
        "paper_size": "A7",
        "width_mm": 74,
        "height_mm": 105,
        "display_size": "74 × 105 mm",
        "is_default": true
      },
      {
        "label_code": "100X100",
        "label_name": "Nhãn giao hàng 100 × 100 mm",
        "paper_size": "100X100",
        "width_mm": 100,
        "height_mm": 100,
        "display_size": "100 × 100 mm",
        "is_default": false
      }
    ]
  }
}
```

#### Error

|**HTTP Status**|**Error Code**|**Khi nào xảy ra**|
|---|---|---|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`LABEL_PRINT_FORBIDDEN`|Actor không có quyền sử dụng chức năng In Nhãn Giao Hàng\.|
|`503 Service Unavailable`|`LABEL_TYPE_UNAVAILABLE`|Tạm thời không thể cung cấp danh sách loại Nhãn Giao Hàng\.|

### 4\.6\.3\. Tạo Token in Nhãn Giao Hàng cho một hoặc nhiều Order

Tạo Token đại diện cho một hoặc nhiều Order cần in Nhãn Giao Hàng\. Consumer chỉ truyền mã Order SuperPlatform; không chọn loại nhãn và không truyền chặng, NVC hoặc mã vận đơn\. Loại nhãn được chọn khi dùng Token để in\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`POST`|
|Endpoint / Event|`/v1/order-labels/tokens`|
|Thành công|`201 Created`|

#### Request

##### Headers

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`Authorization`|header|Có|Xác định Actor, quyền và Data Scope\.|
|`Content-Type`|header|Có|`application/json`\.|
|`Idempotency-Key`|header|Có|Chống tạo lặp Token do retry cùng một request\.|
|`X-Correlation-Id`|header|Không|Mã truy vết; Backend tự tạo nếu thiếu\.|

##### Request Body

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`order_codes`|array\(string\)|Có|Danh sách mã Order SuperPlatform cần in; có ít nhất một mã và không lặp\. In một Order bằng mảng có một phần tử\. Consumer không truyền mã vận đơn\.|

##### Ví dụ Request

```JSON
{
  "order_codes": [
    "9001156990401",
    "9001156990402"
  ]
}
```

#### Response

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`error`|boolean|Có|`false` khi request được xử lý thành công\.|
|`message`|string|Có|Thông báo kết quả bằng tiếng Việt\.|
|`data`|object|Có|Kết quả tạo Token\.|
|`data.print_token`|string|Có|Token ngẫu nhiên khoảng 32 ký tự, đại diện cho toàn bộ `order_codes` trong Request và được dùng khi gọi API in Nhãn Giao Hàng\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Đã tạo Token in Nhãn Giao Hàng.",
  "data": {
    "print_token": "pT8k2Lm9Qa4Ws7Xe1Rc6Vb3Ny5Hj0GfD"
  }
}
```

#### Error

|**HTTP Status**|**Error Code**|**Khi nào xảy ra**|
|---|---|---|
|`400 Bad Request`|`INVALID_LABEL_PRINT_REQUEST`|`order_codes` rỗng, có giá trị trùng hoặc có mã Order không đúng định dạng\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`LABEL_PRINT_FORBIDDEN`|Actor không có quyền sử dụng chức năng in\.|
|`409 Conflict`|`IDEMPOTENCY_CONFLICT`|Cùng `Idempotency-Key` nhưng payload khác request trước\.|
|`422 Unprocessable Content`|`ORDER_LABEL_NOT_READY`|Có ít nhất một Order trong Request chưa đủ dữ liệu để in nhãn; không tạo Token cho một phần danh sách\.|

### 4\.6\.4\. In Nhãn Giao Hàng

Chọn loại nhãn và in Nhãn Giao Hàng cho các Order đã gắn với Token\.

#### Endpoint

|**Thuộc tính**|**Nội dung**|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/order-labels/print`|
|Thành công|`200 OK`|

#### Request

##### Headers

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`Authorization`|header|Có|Thông tin xác thực của Actor thực hiện in\.|
|`X-Correlation-Id`|header|Không|Mã truy vết; Backend tự tạo nếu thiếu\.|

##### Query Parameters

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`print_token`|string|Có|Token một lần đại diện cho danh sách Order cần in\. Không truyền lại `order_codes`\.|
|`label_code`|string|Có|Mã loại Nhãn Giao Hàng áp dụng cho lần in, ví dụ `A7` hoặc `100X100`\.|

##### Ví dụ Request

```Plain Text
GET /v1/order-labels/print?print_token=pT8k2Lm9Qa4Ws7Xe1Rc6Vb3Ny5Hj0GfD&label_code=A7
```

#### Response

Khi thành công, API trả trực tiếp nội dung Nhãn Giao Hàng đã được render theo `label_code` cho các Order gắn với `print_token`\. Backend tự lấy dữ liệu NVC và Waybill cần hiển thị trên nhãn\.

|**Thành phần**|**Giá trị / Ý nghĩa**|
|---|---|
|HTTP Status|`200 OK`|
|`Content-Type`|Kiểu nội dung của tệp nhãn được render, ví dụ `application/pdf` khi định dạng đầu ra là PDF\.|
|`Content-Disposition`|Xác định tên tệp và cách trình duyệt hiển thị/tải tệp\.|
|Response Body|Nội dung binary của tệp Nhãn Giao Hàng\.|

##### Ví dụ Response HTTP

```Plain Text
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Disposition: inline; filename="shipping-labels-20260914.pdf"

<binary content>
```

#### Error

Response lỗi vẫn theo convention chung của tài liệu:

```JSON
{
  "error": true,
  "message": "Token in Nhãn Giao Hàng đã hết hạn.",
  "data": {
    "code": "PRINT_TOKEN_EXPIRED",
    "details": []
  }
}
```

Ví dụ:

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`400 Bad Request`|`INVALID_PRINT_TOKEN`|Thiếu hoặc Token không hợp lệ\.|
|`400 Bad Request`|`INVALID_LABEL_CODE`|Thiếu `label_code` hoặc loại nhãn không được hỗ trợ\.|
|`403 Forbidden`|`LABEL_PRINT_FORBIDDEN`|Actor không có quyền sử dụng Token\.|
|`410 Gone`|`PRINT_TOKEN_EXPIRED`|Token đã hết hạn\.|
|`410 Gone`|`PRINT_TOKEN_ALREADY_USED`|Token đã được mở trước đó\.|
|`503 Service Unavailable`|`LABEL_RENDER_FAILED`|Không thể render tệp nhãn\.|

## 5\. WORKFLOW API CONTRACT

## 5\.1\. Nhóm Đơn hàng loạt

### 5\.1\.1\. Tải mẫu tạo Đơn hàng loạt

Tải trực tiếp file Excel mẫu tạo Đơn hàng loạt theo mô hình địa chỉ hai cấp hoặc ba cấp\. API thành công trả file binary, không trả JSON hoặc `download_url`\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/order-batches/template`|
|Thành công|`200 OK`|

#### Request

##### Headers

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`Authorization`|header|Có|Xác định Actor, Shop và quyền truy cập\.|
|`X-Correlation-Id`|header|Không|Mã truy vết; Backend tự tạo nếu Consumer không truyền\.|

##### Query Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`address_model`|integer|Có|Loại file mẫu: `1` — địa chỉ ba cấp gồm Tỉnh/Thành, Quận/Huyện, Phường/Xã; `2` — địa chỉ hai cấp gồm Tỉnh/Thành, Phường/Xã\.|

##### Ví dụ Request

```Plain Text
GET /v1/order-batches/template?address_model=2
```

#### Response

Khi thành công, API trả trực tiếp file Excel đúng mô hình địa chỉ đã chọn\.

|Thành phần|Giá trị / Ý nghĩa|
|---|---|
|HTTP Status|`200 OK`|
|`Content-Type`|`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`|
|`Content-Disposition`|Tên file tải xuống, phân biệt mẫu hai cấp và ba cấp\.|
|Response Body|Nội dung binary của file Excel\.|

##### Ví dụ Response HTTP — mẫu hai cấp

```Plain Text
HTTP/1.1 200 OK
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="mau-tao-don-hang-loat-2-cap-v1.0.0.xlsx"

<binary content>
```

#### Error

|**HTTP Status**|**Error Code**|**Khi nào xảy ra**|
|---|---|---|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_BATCH_FORBIDDEN`|Actor không có quyền sử dụng chức năng tạo Đơn hàng loạt\.|
|`400 Bad Request`|`INVALID_ADDRESS_MODEL`|`address_model` không phải `1` hoặc `2`\.|
|`503 Service Unavailable`<br>|`ORDER_BATCH_TEMPLATE_UNAVAILABLE`|Không thể cung cấp file mẫu tại thời điểm yêu cầu\.|

### 5\.1\.2\. Đọc file tạo Đơn hàng loạt

Tiếp nhận trực tiếp file Excel do Shop tải lên và chuyển từng dòng thành dữ liệu có thể hiển thị, kiểm tra hoặc chỉnh sửa trên giao diện\. API này chưa kiểm tra đầy đủ quy tắc nghiệp vụ và chưa tạo Order\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`POST`|
|Endpoint / Event|`/v1/order-batches/parse`|
|Thành công|`200 OK`|

#### Request

##### Headers

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`Authorization`|header|Có|Xác thực Actor, Shop, quyền và Data Scope\.|
|`Content-Type`|header|Có|`multipart/form-data`\.|
|`X-Correlation-Id`|header|Không|Mã truy vết; Backend tự tạo nếu Consumer không truyền\.|

##### Request Body

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`file`|file|Có|File Excel `.xlsx` theo mẫu hai cấp hoặc ba cấp do SuperPlatform cung cấp\. File được gửi trực tiếp trong multipart request; không chuyển thành Base64\.|

##### Ví dụ Request

```Plain Text
POST /v1/order-batches/parse
Content-Type: multipart/form-data

file=@don-hang-ngay-17-09.xlsx
```

#### Response

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`error`|boolean|Có|`false` khi file được đọc thành công\.|
|`message`|string|Có|Thông báo kết quả bằng tiếng Việt\.|
|`data`|object|Có|Dữ liệu đã đọc từ file\.|
|`data.file_name`|string|Có|Tên file nguồn\.|
|`data.template_version`|string|Có|Phiên bản mẫu được nhận diện trong file\.|
|`data.address_model`|integer|Có|Mô hình địa chỉ của file: `1` — ba cấp; `2` — hai cấp\.|
|`data.summary`|object|Có|Kết quả tổng quát của lần đọc file\.|
|`data.summary.total_rows`|integer|Có|Tổng số dòng dữ liệu, không tính dòng tiêu đề\.|
|`data.summary.readable_rows`|integer|Có|Số dòng đã đọc được toàn bộ giá trị\.|
|`data.summary.error_rows`|integer|Có|Số dòng có ít nhất một ô không thể chuyển đổi theo kiểu dữ liệu của cột\.|
|`data.columns`|array\(object\)|Có|Danh sách cột theo đúng thứ tự để FE dựng header của sheet\.|
|`data.columns[].column_code`|string|Có|Khóa cột dùng trong `rows[].values`\.|
|`data.columns[].column_name`|string|Có|Tên cột hiển thị trên sheet\.|
|`data.columns[].data_type`|integer|Có|Kiểu dữ liệu của một ô Excel: `1` — chuỗi; `2` — số nguyên; `3` — số tiền VND; `4` — ngày; `5` — ngày giờ; `6` — lựa chọn; `8` — số thập phân\. Không dùng array hoặc object trong một ô\.|
|`data.columns[].required`|boolean|Có|Cho biết cột có bắt buộc nhập hay không\.|
|`data.columns[].editable`|boolean|Có|Cho biết FE có cho phép Shop chỉnh sửa giá trị cột sau khi đọc file hay không\.|
|`data.rows`|array\(object\)|Có|Danh sách dòng theo đúng thứ tự trong file để FE nạp vào sheet\.|
|`data.rows[].row_number`|integer|Có|Số dòng trong file nguồn\.|
|`data.rows[].read_result`|integer|Có|Kết quả đọc dòng: `1` — đọc thành công; `2` — có lỗi đọc dữ liệu\.|
|`data.rows[].read_result_name`|string|Có|Tên kết quả đọc bằng tiếng Việt\.|
|`data.rows[].values`|object|Có|Cặp `column_code: value` của từng ô; thứ tự hiển thị lấy từ `columns[]`\.|
|`data.rows[].errors`|array\(object\)|Có|Lỗi đọc ô của dòng; trả `[]` khi dòng đọc thành công\. Đây chưa phải lỗi nghiệp vụ tạo Order\.|
|`data.rows[].errors[].column_code`|string|Có theo lỗi|Mã cột có giá trị không đọc được\.|
|`data.rows[].errors[].error_code`|string|Có theo lỗi|Mã lỗi đọc dữ liệu\.|
|`data.rows[].errors[].error_message`|string|Có theo lỗi|Nội dung lỗi để FE hiển thị tại ô tương ứng\.|

`columns[]` và `rows[].values` chỉ chứa dữ liệu phẳng mà một ô Excel có thể lưu trực tiếp: mã đơn riêng, người nhận, tên đơn vị hành chính, địa chỉ chi tiết, tên hàng, khối lượng, kích thước, khai giá, COD, xem/thử hàng, người trả phí và ghi chú\. Người dùng không nhập mã hành chính hoặc tọa độ; Backend dùng Address Module nhận diện tên địa chỉ và chuẩn hóa sang mã hệ thống\. Không trả cột điểm lấy, NVC, danh sách sản phẩm, ảnh, tag hoặc dịch vụ dạng danh sách\. Với `address_model = 1`, Response có thêm `receiver_district_name`; với `address_model = 2`, không trả cột Quận/Huyện\.

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Đọc file tạo Đơn hàng loạt thành công.",
  "data": {
    "file_name": "don-hang-ngay-17-09.xlsx",
    "template_version": "1.0.0",
    "address_model": 2,
    "summary": {
      "total_rows": 2,
      "readable_rows": 2,
      "error_rows": 0
    },
    "columns": [
      {
        "column_code": "soc",
        "column_name": "Mã đơn riêng",
        "data_type": 1,
        "required": false,
        "editable": true
      },
      {
        "column_code": "receiver_name",
        "column_name": "Tên người nhận",
        "data_type": 1,
        "required": true,
        "editable": true
      },
      {
        "column_code": "receiver_phone",
        "column_name": "Số điện thoại người nhận",
        "data_type": 1,
        "required": true,
        "editable": true
      },
      {
        "column_code": "receiver_email",
        "column_name": "Email người nhận",
        "data_type": 1,
        "required": false,
        "editable": true
      },
      {
        "column_code": "receiver_address_detail",
        "column_name": "Địa chỉ chi tiết người nhận",
        "data_type": 1,
        "required": true,
        "editable": true
      },
      {
        "column_code": "receiver_province_name",
        "column_name": "Tỉnh/Thành người nhận",
        "data_type": 1,
        "required": true,
        "editable": true
      },
      {
        "column_code": "receiver_commune_name",
        "column_name": "Phường/Xã người nhận",
        "data_type": 1,
        "required": true,
        "editable": true
      },
      {
        "column_code": "product_name",
        "column_name": "Tên hàng hóa",
        "data_type": 1,
        "required": false,
        "editable": true
      },
      {
        "column_code": "weight",
        "column_name": "Khối lượng kiện (gram)",
        "data_type": 2,
        "required": true,
        "editable": true
      },
      {
        "column_code": "length",
        "column_name": "Chiều dài (cm)",
        "data_type": 8,
        "required": false,
        "editable": true
      },
      {
        "column_code": "width",
        "column_name": "Chiều rộng (cm)",
        "data_type": 8,
        "required": false,
        "editable": true
      },
      {
        "column_code": "height",
        "column_name": "Chiều cao (cm)",
        "data_type": 8,
        "required": false,
        "editable": true
      },
      {
        "column_code": "declared_value",
        "column_name": "Giá trị khai báo",
        "data_type": 3,
        "required": true,
        "editable": true
      },
      {
        "column_code": "cod_amount",
        "column_name": "Tiền thu hộ",
        "data_type": 3,
        "required": true,
        "editable": true
      },
      {
        "column_code": "inspection",
        "column_name": "Quyền xem/thử hàng",
        "data_type": 6,
        "required": true,
        "editable": true
      },
      {
        "column_code": "fee_payer",
        "column_name": "Người trả phí",
        "data_type": 6,
        "required": true,
        "editable": true
      },
      {
        "column_code": "delivery_note",
        "column_name": "Ghi chú giao hàng",
        "data_type": 1,
        "required": false,
        "editable": true
      }
    ],
    "rows": [
      {
        "row_number": 2,
        "read_result": 1,
        "read_result_name": "Đọc thành công",
        "values": {
          "soc": "SPAI-TEST-882",
          "receiver_name": "Nguyễn Minh Anh",
          "receiver_phone": "0948123404",
          "receiver_email": "nguyenminhanh@example.com",
          "receiver_address_detail": "120 Thân Nhân Trung",
          "receiver_province_name": "Thành phố Hồ Chí Minh",
          "receiver_commune_name": "Phường Tân Sơn",
          "product_name": "Bộ chăm sóc tóc",
          "weight": 680,
          "length": 20,
          "width": 15,
          "height": 10,
          "declared_value": 420000,
          "cod_amount": 420000,
          "inspection": 2,
          "fee_payer": 1,
          "delivery_note": "Gọi người nhận trước khi giao"
        },
        "errors": []
      },
      {
        "row_number": 3,
        "read_result": 1,
        "read_result_name": "Đọc thành công",
        "values": {
          "soc": "SPAI-TEST-883",
          "receiver_name": "Trần Thị Mai",
          "receiver_phone": "0912345678",
          "receiver_email": "tranthimai@example.com",
          "receiver_address_detail": "88 Lê Lợi",
          "receiver_province_name": "Thành phố Hồ Chí Minh",
          "receiver_commune_name": "Phường Bến Thành",
          "product_name": "Áo sơ mi nam cao cấp",
          "weight": 450,
          "length": 30,
          "width": 20,
          "height": 5,
          "declared_value": 350000,
          "cod_amount": 350000,
          "inspection": 1,
          "fee_payer": 1,
          "delivery_note": "Gọi người nhận trước khi giao"
        },
        "errors": []
      }
    ]
  }
}
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`400 Bad Request`|`INVALID_BATCH_PARSE_REQUEST`|Request không có file hoặc field multipart không đúng tên `file`\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_BATCH_FORBIDDEN`|Actor không có quyền tạo Đơn hàng loạt trong Shop hiện tại\.|
|`413 Payload Too Large`|`ORDER_BATCH_FILE_TOO_LARGE`|File vượt giới hạn được công bố trong file mẫu\.|
|`422 Unprocessable Content`|`ORDER_BATCH_FILE_NOT_SUPPORTED`|File sai định dạng, sai phiên bản, hỏng hoặc không đọc được\.|

### 5\.1\.3\. Kiểm tra dữ liệu tạo Đơn hàng loạt

Kiểm tra toàn bộ dữ liệu hiện có trên bảng tạo Đơn hàng loạt sau khi Shop đã đọc file và chỉnh sửa trên giao diện\. API không tạo Order\. Khi tất cả dòng đều hợp lệ, Backend cấp `validation_token` đại diện cho đúng snapshot dữ liệu đã kiểm tra để sử dụng tại bước tạo lô\.

#### Endpoint

|**Thuộc tính**|**Nội dung**|
|---|---|
|Phương thức HTTP|`POST`|
|Endpoint / Event|`/v1/order-batches/validate`|
|Thành công|`200 OK`|

#### Request

##### Headers

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`Authorization`|header|Có|Xác định Actor, Shop và quyền truy cập\.|
|`Content-Type`|header|Có|`application/json`\.|
|`X-Correlation-Id`|header|Không|Mã truy vết; Backend tự tạo nếu Consumer không truyền\.|

##### Request Body

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`address_model`|integer|Có|Mô hình địa chỉ áp dụng cho toàn bộ dòng: `1` — ba cấp, gồm Tỉnh/Thành, Quận/Huyện và Phường/Xã; `2` — hai cấp, gồm Tỉnh/Thành và Phường/Xã\.|
|`rows`|array\(object\)|Có|Toàn bộ dòng hiện có trên bảng sau khi Shop chỉnh sửa; không chỉ gửi dòng lỗi hoặc ô đã thay đổi\. Mảng phải có ít nhất một phần tử\.|
|`rows[].row_number`|integer|Có|Số dòng gốc trong file; số nguyên lớn hơn `1` và không lặp trong Request\.|
|`rows[].values`|object|Có|Dữ liệu cuối cùng của dòng cần tạo Order\. Các trường địa chỉ phải phù hợp với `address_model` của Request\.|
|`rows[].values.soc`|string|Không|Mã đơn riêng của Shop; nếu có phải không trùng trong Request và không trùng Order hiện có của Shop theo chính sách chống trùng\.|
|`rows[].values.receiver_name`|string|Có|Tên người nhận\.|
|`rows[].values.receiver_phone`|string|Có|Số điện thoại người nhận\.|
|`rows[].values.receiver_email`|string|Không|Email người nhận\.|
|`rows[].values.receiver_address_detail`|string|Có|Số nhà, tên đường và phần địa chỉ chi tiết\.|
|`rows[].values.receiver_province_name`|string|Có|Tên Tỉnh/Thành của người nhận theo danh mục địa chỉ\. Người dùng không phải nhập mã hành chính\.|
|`rows[].values.receiver_district_name`|string|Có điều kiện|Bắt buộc khi file sử dụng mô hình địa chỉ ba cấp; không gửi với mô hình hai cấp\.|
|`rows[].values.receiver_commune_name`|string|Có|Tên Phường/Xã của người nhận theo danh mục địa chỉ\. Backend nhận diện và chuẩn hóa sang mã của Address Module\.|
|`rows[].values.product_name`|string|Có|Tên hàng hóa hiển thị trên Order và nhãn giao hàng\.|
|`rows[].values.weight`|integer|Có|Khối lượng kiện hàng, đơn vị gram; phải lớn hơn `0`\.|
|`rows[].values.length`|integer|Có|Chiều dài kiện hàng, đơn vị centimet; phải lớn hơn `0`\.|
|`rows[].values.width`|integer|Có|Chiều rộng kiện hàng, đơn vị centimet; phải lớn hơn `0`\.|
|`rows[].values.height`|integer|Có|Chiều cao kiện hàng, đơn vị centimet; phải lớn hơn `0`\.|
|`rows[].values.declared_value`|integer|Có|Trị giá khai báo, đơn vị VND; là số nguyên không âm\.|
|`rows[].values.cod_amount`|integer|Có|Tiền thu hộ, đơn vị VND; là số nguyên không âm\.|
|`rows[].values.inspection`|integer|Có|Quyền kiểm hàng: `1` — không xem hàng; `2` — được xem nhưng không thử; `3` — được thử nếu dịch vụ hỗ trợ\.|
|`rows[].values.fee_payer`|integer|Có|Người trả phí: `1` — Shop/người gửi; `2` — người nhận\.|
|`rows[].values.delivery_note`|string|Không|Ghi chú giao hàng dành cho người thực hiện giao hàng\.|

##### Ví dụ Request

```JSON
{
  "address_model": 2,
  "rows": [
    {
      "row_number": 2,
      "values": {
        "soc": "SPAI-TEST-882",
        "receiver_name": "Nguyễn Minh Anh",
        "receiver_phone": "0948123404",
        "receiver_address_detail": "120 Thân Nhân Trung",
        "receiver_province_name": "Thành phố Hồ Chí Minh",
        "receiver_commune_name": "Phường Tân Sơn",
        "product_name": "Bộ chăm sóc tóc",
        "weight": 680,
        "length": 20,
        "width": 15,
        "height": 10,
        "declared_value": 420000,
        "cod_amount": 420000,
        "inspection": 2,
        "fee_payer": 1,
        "delivery_note": "Gọi người nhận trước khi giao"
      }
    },
    {
      "row_number": 3,
      "values": {
        "soc": "SPAI-TEST-883",
        "receiver_name": "Trần Thị Mai",
        "receiver_phone": "0912345678",
        "receiver_address_detail": "88 Lê Lợi",
        "receiver_province_name": "Thành phố Hồ Chí Minh",
        "receiver_commune_name": "Phường Bến Thành",
        "product_name": "Áo sơ mi nam cao cấp",
        "weight": 450,
        "length": 30,
        "width": 20,
        "height": 5,
        "declared_value": 350000,
        "cod_amount": 350000,
        "inspection": 1,
        "fee_payer": 1,
        "delivery_note": "Gọi người nhận trước khi giao"
      }
    }
  ]
}
```

#### Response

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`error`|boolean|Có|`false` khi file được kiểm tra thành công\.|
|`message`|string|Có|Thông báo kết quả bằng tiếng Việt\.|
|`data`|object|Có|Kết quả kiểm tra file\.|
|`data.total_rows`|integer|Có|Tổng số dòng dữ liệu cần xử lý\.|
|`data.valid_rows`|integer|Có|Số dòng đủ điều kiện tạo Order tại thời điểm kiểm tra\.|
|`data.invalid_row_count`|integer|Có|Số dòng không đủ điều kiện tạo Order\.|
|`data.invalid_rows`|array\(object\)|Có|Chỉ chứa các dòng không hợp lệ để FE đánh dấu và yêu cầu Shop sửa; trả `[]` khi toàn bộ dòng hợp lệ\.|
|`data.invalid_rows[].row_number`|integer|Có điều kiện|Bắt buộc trong mỗi phần tử; số dòng trong file nguồn\.|
|`data.invalid_rows[].errors`|array\(object\)|Có điều kiện|Bắt buộc trong mỗi phần tử và có ít nhất một lỗi\.|
|`data.invalid_rows[].errors[].column_code`|string|Có điều kiện|Mã cột cần sửa; bỏ trường nếu lỗi áp dụng cho toàn dòng\.|
|`data.invalid_rows[].errors[].code`|string|Có điều kiện|Mã lỗi ổn định để FE nhận diện\.|
|`data.invalid_rows[].errors[].message`|string|Có điều kiện|Nội dung lỗi bằng tiếng Việt để hiển thị cho Shop\.|
|`data.validation_token`|string|Có điều kiện|Chỉ trả khi `invalid_row_count = 0`\. Token đại diện cho đúng Shop, Actor và snapshot toàn bộ dòng đã kiểm tra; dùng tại API tạo lô và không cho phép Consumer sửa nội dung bên trong\.|
|`data.expires_at`|datetime|Có điều kiện|Chỉ trả cùng `validation_token`; thời điểm token hết hiệu lực theo ISO 8601 có múi giờ\.|

##### Ví dụ Response — còn dòng không hợp lệ

```JSON
{
  "error": false,
  "message": "Kiểm tra dữ liệu tạo Đơn hàng loạt hoàn tất.",
  "data": {
    "total_rows": 2,
    "valid_rows": 1,
    "invalid_row_count": 1,
    "invalid_rows": [
      {
        "row_number": 3,
        "errors": [
          {
            "column_code": "receiver_phone",
            "code": "INVALID_RECEIVER_PHONE",
            "message": "Số điện thoại người nhận không hợp lệ."
          }
        ]
      }
    ]
  }
}
```

##### Ví dụ Response — toàn bộ dòng hợp lệ

```JSON
{
  "error": false,
  "message": "Dữ liệu tạo Đơn hàng loạt hợp lệ.",
  "data": {
    "total_rows": 2,
    "valid_rows": 2,
    "invalid_row_count": 0,
    "invalid_rows": [],
    "validation_token": "vld_7F3kN8pQ2mR6xT9cL4wB1yH5sD0a",
    "expires_at": "2026-09-17T16:45:00+07:00"
  }
}
```

#### Error

|**HTTP Status**|**Error Code**|**Khi nào xảy ra**|
|---|---|---|
|`400 Bad Request`|`INVALID_BATCH_VALIDATION_REQUEST`|Thiếu `address_model`, danh sách dòng rỗng hoặc cấu trúc dữ liệu không hợp lệ\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_BATCH_FORBIDDEN`|Actor không có quyền tạo Đơn hàng loạt\.|
|`503 Service Unavailable`|`REQUIRED_DEPENDENCY_UNAVAILABLE`|Dependency bắt buộc để kiểm tra dữ liệu tạm thời không khả dụng\.|

### 5\.1\.4\. Tạo lô Đơn hàng loạt

Tiếp nhận toàn bộ snapshot đã được API kiểm tra dữ liệu xác nhận hợp lệ và tạo một lô xử lý bất đồng bộ\. Request chỉ nhận `validation_token`, không nhận lại file hoặc dữ liệu từng dòng\. Khi API trả `202 Accepted`, Batch đã được tạo nhưng các Order có thể vẫn đang xử lý; kết quả từng dòng được tra cứu bằng API kết quả của Batch\.

#### Endpoint

|**Thuộc tính**|**Nội dung**|
|---|---|
|Phương thức HTTP|`POST`|
|Endpoint / Event|`/v1/order-batches`|
|Thành công|`202 Accepted`|

#### Request

##### Headers

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`Authorization`|header|Có|Xác định Actor và Shop\.|
|`Content-Type`|header|Có|`application/json`\.|
|`Idempotency-Key`|header|Có|Chống tạo trùng batch/Order khi request được retry\.|
|`X-Correlation-Id`|header|Không|Mã truy vết\.|

##### Request Body

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`validation_token`|string|Có|Token do API kiểm tra dữ liệu cấp khi toàn bộ dòng hợp lệ\. Token phải còn hiệu lực, chưa được dùng để tạo lô và thuộc đúng Shop cùng snapshot dữ liệu đã kiểm tra\.|

##### Ví dụ Request

```JSON
{
  "validation_token": "vld_7F3kN8pQ2mR6xT9cL4wB1yH5sD0a"
}
```

#### Response

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`error`|boolean|Có|`false` khi Batch đã được tiếp nhận\.|
|`message`|string|Có|Thông báo kết quả\.|
|`data`|object|Có|Thông tin Batch vừa được tiếp nhận\.|
|`data.batch_code`|string|Có|Mã Batch dùng để tra cứu tiến độ và kết quả từng dòng\.|
|`data.batch_status`|integer|Có|Trạng thái Batch: `1` — đang xử lý; `2` — hoàn tất; `3` — hoàn tất có dòng lỗi; `4` — thất bại\. Khi vừa tiếp nhận luôn trả `1`\.|
|`data.batch_status_name`|string|Có|Tên trạng thái Batch bằng tiếng Việt\.|
|`data.total_rows`|integer|Có|Tổng số dòng thuộc snapshot đã kiểm tra và được đưa vào Batch\.|
|`data.success_rows`|integer|Có|Số dòng đã tạo Order thành công; khi vừa tiếp nhận trả `0`\.|
|`data.failed_rows`|integer|Có|Số dòng xử lý thất bại; khi vừa tiếp nhận trả `0`\.|
|`data.processing_rows`|integer|Có|Số dòng đang chờ hoặc đang được xử lý; khi vừa tiếp nhận bằng `total_rows`\.|
|`data.created_at`|datetime|Có|Thời điểm tạo Batch\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Đã tiếp nhận yêu cầu tạo Đơn hàng loạt.",
  "data": {
    "batch_code": "BAT-20260917-000128",
    "batch_status": 1,
    "batch_status_name": "Đang xử lý",
    "total_rows": 2,
    "success_rows": 0,
    "failed_rows": 0,
    "processing_rows": 2,
    "created_at": "2026-09-17T16:20:00+07:00"
  }
}
```

#### Error

|**HTTP Status**|**Error Code**|**Khi nào xảy ra**|
|---|---|---|
|`400 Bad Request`|`INVALID_ORDER_BATCH_REQUEST`|Thiếu `validation_token`, token sai định dạng hoặc Request có field không được hỗ trợ\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_BATCH_FORBIDDEN`|Actor không có quyền tạo Batch trong Shop hiện tại\.|
|`409 Conflict`|`IDEMPOTENCY_CONFLICT`|Cùng Idempotency\-Key nhưng nội dung request khác\.|
|`409 Conflict`|`VALIDATION_TOKEN_NOT_USABLE`|`validation_token` đã hết hạn, đã được sử dụng, không thuộc Shop hiện tại hoặc snapshot được tham chiếu không còn hợp lệ để tạo Batch\.|
|`503 Service Unavailable`|`REQUIRED_DEPENDENCY_UNAVAILABLE`|Dependency bắt buộc tạm thời không khả dụng\.|

### 5\.1\.5\. Xem lịch sử tạo Đơn hàng loạt

Lấy danh sách các lần Shop hoặc người được phân quyền đã yêu cầu tạo Đơn hàng loạt\. Lịch sử được quản lý theo Batch và kết quả xử lý, không lưu hoặc trả lại file Excel đã dùng để nhập dữ liệu\.

#### Endpoint

|**Thuộc tính**|**Nội dung**|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/order-batches`|
|Thành công|`200 OK`|

#### Request

##### Headers

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`Authorization`|header|Có|Xác thực Actor, Shop, quyền và Data Scope\.|
|`X-Correlation-Id`|header|Không|Mã truy vết; Backend tự tạo nếu Consumer không truyền\.|

##### Query Parameters

Query chỉ gồm điều kiện lọc và phân trang mà màn hình đang sử dụng\. Không có Request Body\.

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`keyword`|string|Không|Tìm theo `batch_code`; không tìm theo tên file vì Batch không lưu file nguồn\.|
|`batch_status`|integer|Không|Lọc theo trạng thái: `1` — đang xử lý; `2` — hoàn tất; `3` — hoàn tất có dòng lỗi; `4` — thất bại\.|
|`created_from`|datetime|Không|Lọc Batch được tạo từ thời điểm này, theo ISO 8601 có múi giờ\.|
|`created_to`|datetime|Không|Lọc Batch được tạo đến thời điểm này, theo ISO 8601 có múi giờ; phải lớn hơn hoặc bằng `created_from`\.|
|`page`|integer|Không|Trang cần lấy, từ `1`; mặc định `1`\.|
|`page_size`|integer|Không|Số Batch trên một trang, từ `1` đến `100`; mặc định `20`\.|
|`sort`|integer|Không|Sắp xếp: `1` — mới nhất; `2` — cũ nhất\. Mặc định `1`\.|

#### Response

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`error`|boolean|Có|`false` khi thành công\.|
|`message`|string|Có|Thông báo kết quả\.|
|`data`|object|Có|Dữ liệu lịch sử tạo Đơn hàng loạt\.|
|`data.summary`|object|Có|Tổng quan của toàn bộ Batch thỏa điều kiện lọc, được tính trước khi phân trang\.|
|`data.summary.total_batches`|integer|Có|Tổng số Batch thỏa điều kiện lọc\.|
|`data.summary.total_rows`|integer|Có|Tổng số dòng đã được tiếp nhận trong các Batch thỏa điều kiện lọc\.|
|`data.summary.success_rows`|integer|Có|Tổng số dòng đã tạo Order thành công\.|
|`data.summary.failed_rows`|integer|Có|Tổng số dòng xử lý thất bại\.|
|`data.summary.processing_rows`|integer|Có|Tổng số dòng đang chờ hoặc đang được xử lý\. Tổng ba trường `success_rows`, `failed_rows` và `processing_rows` bằng `total_rows`\.|
|`data.batches`|array\(object\)|Có|Danh sách lần tạo Đơn hàng loạt\.|
|`data.batches[].batch_code`|string|Có|Mã lần tạo loạt\.|
|`data.batches[].batch_status`|integer|Có|Trạng thái Batch: `1` — đang xử lý; `2` — hoàn tất; `3` — hoàn tất có dòng lỗi; `4` — thất bại\.|
|`data.batches[].batch_status_name`|string|Có|Tên trạng thái Batch bằng tiếng Việt\.|
|`data.batches[].total_rows`|integer|Có|Tổng số dòng được tiếp nhận trong Batch\.|
|`data.batches[].success_rows`|integer|Có|Số dòng đã tạo Order\.|
|`data.batches[].failed_rows`|integer|Có|Số dòng xử lý thất bại\.|
|`data.batches[].processing_rows`|integer|Có|Số dòng đang chờ hoặc đang được xử lý\. Tổng ba trường `success_rows`, `failed_rows` và `processing_rows` phải bằng `total_rows`\.|
|`data.batches[].created_by`|object|Có|Chủ thể đã tạo Batch, được Backend xác định từ Access Context đã xác thực và lưu snapshot tại thời điểm tạo; Consumer không truyền dữ liệu này\.|
|`data.batches[].created_by.actor_type`|integer|Có|Loại chủ thể: `1` — người dùng Shop; `2` — nhân viên nội bộ; `3` — ứng dụng đối tác; `4` — hệ thống SuperPlatform\.|
|`data.batches[].created_by.display_name`|string|Có|Tên hiển thị do User Module cung cấp cho danh tính đã xác thực tại thời điểm tạo Batch\.|
|`data.batches[].created_at`|datetime|Có|Thời điểm tạo Batch\.|
|`data.batches[].completed_at`|datetime|Không|Thời điểm Batch hoàn tất; bỏ trường khi Batch đang xử lý\.|
|`data.meta`|object|Có|Thông tin phân trang\.|
|`data.meta.page`|integer|Có|Trang hiện tại\.|
|`data.meta.page_size`|integer|Có|Số phần tử mỗi trang\.|
|`data.meta.total_items`|integer|Có|Tổng số batch thỏa điều kiện\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Lấy lịch sử tạo Đơn hàng loạt thành công.",
  "data": {
    "summary": {
      "total_batches": 4,
      "total_rows": 63,
      "success_rows": 46,
      "failed_rows": 12,
      "processing_rows": 5
    },
    "batches": [
      {
        "batch_code": "BAT-20260914-000001",
        "batch_status": 3,
        "batch_status_name": "Hoàn tất có dòng lỗi",
        "total_rows": 10,
        "success_rows": 7,
        "failed_rows": 3,
        "processing_rows": 0,
        "created_by": {
          "actor_type": 1,
          "display_name": "Nguyễn Minh Anh"
        },
        "created_at": "2026-09-14T18:30:00+07:00",
        "completed_at": "2026-09-14T18:32:15+07:00"
      }
    ],
    "meta": {
      "page": 1,
      "page_size": 20,
      "total_items": 4
    }
  }
}
```

#### Error

|**HTTP Status**|**Error Code**|**Khi nào xảy ra**|
|---|---|---|
|`400 Bad Request`|`INVALID_ORDER_BATCH_QUERY`|Query Parameter không hợp lệ\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_BATCH_FORBIDDEN`|Actor không có quyền xem lịch sử\.|

### 5\.1\.6\. Lấy tổng quan Batch tạo Đơn hàng loạt

Lấy trạng thái, tiến độ, người tạo và thời gian xử lý của đúng một Batch\. API này phục vụ phần đầu trang chi tiết và việc cập nhật tiến độ; kết quả từng dòng được lấy riêng để có thể lọc và phân trang\.

#### Endpoint

|**Thuộc tính**|**Nội dung**|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/order-batches/{batch_code}`|
|Thành công|`200 OK`|

#### Request

##### Headers

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`Authorization`|header|Có|Xác định Actor và Shop\.|
|`X-Correlation-Id`|header|Không|Mã truy vết\.|

##### Path Parameters

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`batch_code`|string|Có|Mã lần tạo Đơn hàng loạt\.|

#### Response

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`error`|boolean|Có|`false` khi thành công\.|
|`message`|string|Có|Thông báo kết quả\.|
|`data`|object|Có|Thông tin tổng quan của Batch\.|
|`data.batch_code`|string|Có|Mã Batch\.|
|`data.batch_status`|integer|Có|Trạng thái Batch: `1` — đang xử lý; `2` — hoàn tất; `3` — hoàn tất có dòng lỗi; `4` — thất bại\.|
|`data.batch_status_name`|string|Có|Tên trạng thái Batch bằng tiếng Việt\.|
|`data.total_rows`|integer|Có|Tổng số dòng được tiếp nhận trong Batch\.|
|`data.success_rows`|integer|Có|Số dòng đã tạo Order thành công\.|
|`data.failed_rows`|integer|Có|Số dòng xử lý thất bại\.|
|`data.processing_rows`|integer|Có|Số dòng đang chờ hoặc đang xử lý\. Tổng ba bộ đếm phải bằng `total_rows`\.|
|`data.created_by`|object|Có|Chủ thể đã tạo Batch, lấy từ snapshot Access Context tại thời điểm tạo\.|
|`data.created_by.actor_type`|integer|Có|Loại chủ thể: `1` — người dùng Shop; `2` — nhân viên nội bộ; `3` — ứng dụng đối tác; `4` — hệ thống SuperPlatform\.|
|`data.created_by.display_name`|string|Có|Tên hiển thị do User Module cung cấp tại thời điểm tạo Batch\.|
|`data.created_at`|datetime|Có|Thời điểm tạo Batch\.|
|`data.updated_at`|datetime|Có|Thời điểm gần nhất tiến độ hoặc trạng thái Batch được cập nhật\.|
|`data.completed_at`|datetime|Không|Thời điểm Batch hoàn tất; bỏ trường khi Batch đang xử lý\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Lấy tổng quan Batch tạo Đơn hàng loạt thành công.",
  "data": {
    "batch_code": "BAT-20260914-000001",
    "batch_status": 3,
    "batch_status_name": "Hoàn tất có dòng lỗi",
    "total_rows": 10,
    "success_rows": 7,
    "failed_rows": 3,
    "processing_rows": 0,
    "created_by": {
      "actor_type": 1,
      "display_name": "Nguyễn Minh Anh"
    },
    "created_at": "2026-09-14T18:30:00+07:00",
    "updated_at": "2026-09-14T18:32:15+07:00",
    "completed_at": "2026-09-14T18:32:15+07:00"
  }
}
```

#### Error

|**HTTP Status**|**Error Code**|**Khi nào xảy ra**|
|---|---|---|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_BATCH_FORBIDDEN`|Actor không có quyền xem batch\.|
|`404 Not Found`|`ORDER_BATCH_NOT_FOUND`|Không tìm thấy batch trong phạm vi được phép\.|

### 5\.1\.7\. Lấy kết quả từng dòng của Batch

Lấy kết quả xử lý từng dòng thuộc một Batch\. API trả thông tin đủ để FE nhận diện dòng nguồn, mở Order đã tạo hoặc hiển thị lỗi cần xử lý; danh sách được lọc và phân trang độc lập với tổng quan Batch\.

#### Endpoint

|**Thuộc tính**|**Nội dung**|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/order-batches/{batch_code}/results`|
|Thành công|`200 OK`|

#### Request

##### Headers

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`Authorization`|header|Có|Xác định Actor và Shop\.|
|`X-Correlation-Id`|header|Không|Mã truy vết\.|

##### Path Parameters

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`batch_code`|string|Có|Mã batch cần xem kết quả\.|

##### Query Parameters

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`keyword`|string|Không|Tìm theo số dòng, mã đơn riêng của Shop, tên/SĐT người nhận hoặc mã Order đã tạo\.|
|`result`|integer|Không|Lọc kết quả: `1` — đang xử lý; `2` — thành công; `3` — thất bại\.|
|`page`|integer|Không|Trang cần lấy, từ `1`; mặc định `1`\.|
|`page_size`|integer|Không|Số dòng trên một trang, từ `1` đến `100`; mặc định `20`\.|
|`sort`|integer|Không|Sắp xếp theo số dòng: `1` — tăng dần; `2` — giảm dần\. Mặc định `1`\.|

#### Response

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`error`|boolean|Có|`false` khi thành công\.|
|`message`|string|Có|Thông báo kết quả\.|
|`data`|object|Có|Kết quả xử lý từng dòng của Batch\.|
|`data.batch_code`|string|Có|Mã Batch đang tra cứu\.|
|`data.batch_status`|integer|Có|Trạng thái Batch: `1` — đang xử lý; `2` — hoàn tất; `3` — hoàn tất có dòng lỗi; `4` — thất bại\.|
|`data.batch_status_name`|string|Có|Tên trạng thái Batch bằng tiếng Việt\.|
|`data.summary`|object|Có|Tổng quan kết quả của toàn bộ Batch, không bị giới hạn bởi bộ lọc dòng hoặc phân trang\.|
|`data.summary.total_rows`|integer|Có|Tổng số dòng trong Batch\.|
|`data.summary.success_rows`|integer|Có|Tổng số dòng đã tạo Order thành công\.|
|`data.summary.failed_rows`|integer|Có|Tổng số dòng xử lý thất bại\.|
|`data.summary.processing_rows`|integer|Có|Tổng số dòng đang chờ hoặc đang xử lý\.|
|`data.rows`|array\(object\)|Có|Danh sách kết quả dòng thỏa bộ lọc của trang hiện tại\.|
|`data.rows[].row_number`|integer|Có|Số dòng trên bảng dữ liệu nguồn\.|
|`data.rows[].soc`|string|Không|Mã đơn riêng của Shop; bỏ trường nếu dòng không khai báo\.|
|`data.rows[].receiver_name`|string|Có|Tên người nhận dùng để nhận diện dòng\.|
|`data.rows[].receiver_phone`|string|Có|Số điện thoại người nhận dùng để nhận diện dòng\.|
|`data.rows[].result`|integer|Có|Kết quả xử lý: `1` — đang xử lý; `2` — thành công; `3` — thất bại\.|
|`data.rows[].result_name`|string|Có|Tên kết quả xử lý bằng tiếng Việt\.|
|`data.rows[].order_code`|string|Có điều kiện|Mã Order SuperPlatform; chỉ trả khi dòng đã tạo được Order\.|
|`data.rows[].order_status`|string|Có điều kiện|Mã trạng thái chuẩn hiện tại; chỉ trả khi đã có Order\.|
|`data.rows[].order_status_name`|string|Có điều kiện|Tên trạng thái chuẩn hiện tại; chỉ trả khi đã có Order\.|
|`data.rows[].errors`|array\(object\)|Có|Danh sách lỗi của dòng; trả `[]` nếu dòng đang xử lý hoặc đã thành công\.|
|`data.rows[].errors[].column_code`|string|Có điều kiện|Mã cột liên quan; bỏ trường nếu lỗi áp dụng cho toàn dòng\.|
|`data.rows[].errors[].code`|string|Có điều kiện|Mã lỗi ổn định để FE nhận diện\.|
|`data.rows[].errors[].message`|string|Có điều kiện|Nội dung lỗi bằng tiếng Việt\.|
|`data.rows[].updated_at`|datetime|Có|Thời điểm kết quả dòng được cập nhật gần nhất\.|
|`data.meta`|object|Có|Phân trang\.|
|`data.meta.page`|integer|Có|Trang hiện tại\.|
|`data.meta.page_size`|integer|Có|Số phần tử mỗi trang\.|
|`data.meta.total_items`|integer|Có|Tổng số dòng thỏa điều kiện\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Lấy kết quả từng dòng thành công.",
  "data": {
    "batch_code": "BAT-20260914-000001",
    "batch_status": 1,
    "batch_status_name": "Đang xử lý",
    "summary": {
      "total_rows": 10,
      "success_rows": 6,
      "failed_rows": 3,
      "processing_rows": 1
    },
    "rows": [
      {
        "row_number": 2,
        "soc": "SPAI-TEST-882",
        "receiver_name": "Nguyễn Minh Anh",
        "receiver_phone": "0948123404",
        "result": 2,
        "result_name": "Thành công",
        "order_code": "9001156990411",
        "order_status": "SPF-0301",
        "order_status_name": "Chờ lấy hàng",
        "errors": [],
        "updated_at": "2026-09-14T18:30:20+07:00"
      },
      {
        "row_number": 3,
        "soc": "SPAI-TEST-883",
        "receiver_name": "Trần Thị Mai",
        "receiver_phone": "0912345678",
        "result": 3,
        "result_name": "Thất bại",
        "errors": [
          {
            "column_code": "soc",
            "code": "SOC_ALREADY_EXISTS",
            "message": "Mã đơn riêng đã được sử dụng bởi một Order khác của Shop."
          }
        ],
        "updated_at": "2026-09-14T18:30:22+07:00"
      },
      {
        "row_number": 4,
        "receiver_name": "Lê Phước Thắng",
        "receiver_phone": "0338888429",
        "result": 1,
        "result_name": "Đang xử lý",
        "errors": [],
        "updated_at": "2026-09-14T18:30:23+07:00"
      }
    ],
    "meta": {
      "page": 1,
      "page_size": 3,
      "total_items": 10
    }
  }
}
```

#### Error

|**HTTP Status**|**Error Code**|**Khi nào xảy ra**|
|---|---|---|
|`400 Bad Request`|`INVALID_ORDER_BATCH_RESULT_QUERY`|Query không hợp lệ\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_BATCH_FORBIDDEN`|Actor không có quyền xem batch\.|
|`404 Not Found`|`ORDER_BATCH_NOT_FOUND`|Không tìm thấy batch trong phạm vi được phép\.|

### 5\.1\.8\. Xuất kết quả Batch ra Excel

Tải trực tiếp file Excel chứa kết quả xử lý từng dòng của một Batch\. API không tạo tác vụ xuất, không lưu file và không trả JSON hoặc URL tải file\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`GET`|
|Endpoint / Event|`/v1/order-batches/{batch_code}/export`|
|Thành công|`200 OK`|

#### Request

##### Headers

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`Authorization`|header|Có|Xác định Actor, Shop, quyền và Data Scope\.|
|`X-Correlation-Id`|header|Không|Mã truy vết; Backend tự tạo nếu Consumer không truyền\.|

##### Path Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`batch_code`|string|Có|Mã Batch cần xuất kết quả\.|

##### Query Parameters

|Trường|Kiểu dữ liệu|Bắt buộc|Ý nghĩa|
|---|---|---|---|
|`result`|integer|Không|Phạm vi dòng cần xuất: `1` — toàn bộ; `2` — chỉ dòng thành công; `3` — chỉ dòng thất bại\. Mặc định `1`\. Dòng đang xử lý chỉ có trong phạm vi toàn bộ\.|

##### Ví dụ Request

```Plain Text
GET /v1/order-batches/BAT-20260914-000001/export?result=3
```

#### Response

Khi thành công, API trả trực tiếp file Excel; không trả JSON\.

|Thành phần|Giá trị / Ý nghĩa|
|---|---|
|HTTP Status|`200 OK`|
|`Content-Type`|`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`|
|`Content-Disposition`|Tên file tải xuống chứa mã Batch và phạm vi kết quả\.|
|Response Body|Nội dung binary của file Excel\.|

##### Ví dụ Response HTTP

```Plain Text
HTTP/1.1 200 OK
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="ket-qua-BAT-20260914-000001-that-bai.xlsx"

<binary content>
```

#### Error

|HTTP Status|Error Code|Khi nào xảy ra|
|---|---|---|
|`400 Bad Request`|`INVALID_BATCH_EXPORT_REQUEST`|`result` không phải giá trị được hỗ trợ\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`BATCH_EXPORT_FORBIDDEN`|Người gọi không có quyền xuất kết quả Batch hoặc Batch nằm ngoài Data Scope\.|
|`404 Not Found`|`ORDER_BATCH_NOT_FOUND`|Không tìm thấy Batch trong phạm vi được phép xem\.|
|`422 Unprocessable Content`|`NO_BATCH_RESULT_TO_EXPORT`|Batch không có dòng thuộc phạm vi kết quả đã chọn\.|
|`500 Internal Server Error`|`BATCH_EXPORT_FAILED`|Không thể tạo file Excel hoàn chỉnh\.|

## 5\.2\. Nhóm Xuất dữ liệu

### 5\.2\.1\. Xuất danh sách đơn ra Excel

Tải trực tiếp file Excel của các Order được chọn hoặc toàn bộ Order thỏa bộ lọc hiện tại\. API không tạo tác vụ xuất, không lưu file và không trả JSON hoặc URL tải file\.

#### Endpoint

|Thuộc tính|Nội dung|
|---|---|
|Phương thức HTTP|`POST`|
|Endpoint / Event|`/v1/orders/export`|
|Thành công|`200 OK`|

#### Request

##### Headers

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`Authorization`|header|Có|Xác định Actor, quyền và Data Scope\.|
|`Content-Type`|header|Có|`application/json`\.|
|`X-Correlation-Id`|header|Không|Mã truy vết; Backend tự tạo nếu Consumer không truyền\.|

##### Request Body

Body chỉ chứa phạm vi cần xuất hoặc bộ lọc hiện tại\.

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`scope_type`|integer|Có|Phạm vi xuất: `1` — các Order được chọn; `2` — toàn bộ Order thỏa điều kiện lọc hiện tại\.|
|`order_codes`|array\(string\)|Có điều kiện|Danh sách mã Order cần xuất; bắt buộc khi `scope_type = 1` và không gửi khi `scope_type = 2`\.|
|`filters`|object|Có điều kiện|Toàn bộ điều kiện lọc hiện tại của màn hình danh sách; bắt buộc khi `scope_type = 2` và không gửi khi `scope_type = 1`\. Không gửi `page` hoặc `page_size` vì API xuất toàn bộ Order thỏa bộ lọc\.|
|`columns`|array\(string\)|Không|Danh sách trường cần xuất nếu UI hỗ trợ lựa chọn cột\. Backend chỉ xuất các trường Actor có quyền; nếu không truyền thì áp dụng cấu hình xuất mặc định\.|

##### Ví dụ Request — Xuất các Order được chọn

```JSON
{
  "scope_type": 1,
  "order_codes": [
    "9001156990401",
    "9001156990402"
  ],
  "columns": [
    "order_code",
    "soc",
    "order_status",
    "status_name",
    "carrier_waybill_code",
    "created_at"
  ]
}
```

##### Ví dụ Request — Xuất theo điều kiện lọc hiện tại

```JSON
{
  "scope_type": 2,
  "filters": {
    "basic": {
      "keyword": "GY8YLSDK",
      "order_statuses": ["SPF-0801"],
      "time_type": 1,
      "time_from": "2026-09-01T00:00:00+07:00",
      "time_to": "2026-09-17T23:59:59+07:00"
    },
    "stage_conditions": [
      {
        "leg_types": [2],
        "carrier_codes": [2],
        "is_current": true
      }
    ]
  },
  "columns": [
    "order_code",
    "soc",
    "order_status",
    "status_name",
    "carrier_waybill_code",
    "created_at"
  ]
}
```

#### Response

Khi thành công, API trả trực tiếp file Excel; không trả JSON\.

|Thành phần|Giá trị / Ý nghĩa|
|---|---|
|HTTP Status|`200 OK`|
|`Content-Type`|`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`|
|`Content-Disposition`|Tên file tải xuống\.|
|Response Body|Nội dung binary của file Excel\.|

##### Ví dụ Response HTTP

```Plain Text
HTTP/1.1 200 OK
Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
Content-Disposition: attachment; filename="danh-sach-don-hang-20260917-163000.xlsx"

<binary content>
```

#### Error

|**HTTP Status**|**Error Code**|**Khi nào xảy ra**|
|---|---|---|
|`400 Bad Request`|`INVALID_EXPORT_REQUEST`|Request thiếu hoặc sai `scope_type`, `order_codes`, `filters` hoặc cấu hình cột không hợp lệ\.|
|`401 Unauthorized`|`UNAUTHORIZED`|Thiếu hoặc sai thông tin xác thực\.|
|`403 Forbidden`|`ORDER_EXPORT_FORBIDDEN`|Actor không có quyền sử dụng chức năng xuất dữ liệu\.|
|`422 Unprocessable Content`|`NO_EXPORTABLE_ORDER`|Không có Order nào thuộc phạm vi và đủ điều kiện để xuất\.|
|`500 Internal Server Error`|`ORDER_EXPORT_FAILED`|Không thể tạo hoặc kiểm tra file Excel hoàn chỉnh\.|

## 5\.3\. Nhóm Tra cứu công khai

### 5\.3\.1\. Tra cứu hành trình Đơn hàng công khai

Cho Người nhận tra cứu trạng thái và timeline vận chuyển mà không cần đăng nhập\. Response ưu tiên hành trình; tên, điện thoại và địa chỉ Người gửi/Người nhận luôn được Backend masking trước khi trả\. API không trả dữ liệu gốc, thông tin hàng hóa, COD, shipper, ảnh giao hàng, raw status NVC hoặc dữ liệu vận hành nội bộ\.

#### Endpoint

|**Thuộc tính**|**Nội dung**|
|---|---|
|Phương thức HTTP|`POST`|
|Endpoint / Event|`/v1/public/orders/tracking`|
|Thành công|`200 OK`|

#### Request

##### Headers

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`Content-Type`|header|Có|`application/json`\.|
|`X-Correlation-Id`|header|Không|Mã truy vết; Backend tự tạo nếu không truyền\.|

##### Request Body

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`tracking_code`|string|Có|Mã dùng để tra cứu: mã Order SuperPlatform, mã đơn riêng được phép công khai hoặc mã vận đơn NVC\. Tối đa `50` ký tự\.|
|`receiver_phone_last4`|string|Có|Đúng bốn chữ số cuối của điện thoại Người nhận; chỉ nhận chuỗi gồm bốn chữ số\.|
|`captcha_token`|string|Có|Token CAPTCHA còn hiệu lực do dịch vụ chống bot được cấu hình cho Public Tracking cấp\.|

##### Ví dụ Request

```JSON
{
  "tracking_code": "9001156990401",
  "receiver_phone_last4": "3404",
  "captcha_token": "captcha_7F3kN8pQ2mR6xT9cL4wB"
}
```

#### Response

|**Trường**|**Kiểu dữ liệu**|**Bắt buộc**|**Ý nghĩa**|
|---|---|---|---|
|`error`|boolean|Có|`false` khi tra cứu thành công\.|
|`message`|string|Có|Thông báo kết quả bằng tiếng Việt\.|
|`data`|object|Có|Dữ liệu hành trình công khai đã được giới hạn\.|
|`data.order_code`|string|Có|Mã Order SuperPlatform\.|
|`data.status_name`|string|Có|Tên trạng thái hiện tại bằng nội dung dễ hiểu với Người nhận\.|
|`data.status_description`|string|Có|Mô tả ngắn trạng thái hiện tại và điều Người nhận cần biết\.|
|`data.sender`|object|Có|Thông tin Người gửi đã được Backend masking; không trả dữ liệu gốc trong cùng Response\.|
|`data.sender.name_masked`|string|Có|Tên Người gửi đã che một phần\.|
|`data.sender.phone_masked`|string|Có|Số điện thoại Người gửi đã che và chỉ hiển thị bốn số cuối\.|
|`data.sender.address_masked`|string|Có|Địa chỉ Người gửi đã che số nhà và phần chi tiết nhạy cảm; giữ khu vực cần thiết để nhận biết hành trình\.|
|`data.receiver`|object|Có|Thông tin Người nhận đã được Backend masking; không trả dữ liệu gốc trong cùng Response\.|
|`data.receiver.name_masked`|string|Có|Tên Người nhận đã che một phần\.|
|`data.receiver.phone_masked`|string|Có|Số điện thoại chỉ hiển thị bốn số cuối, ví dụ `******3404`\.|
|`data.receiver.address_masked`|string|Có|Địa chỉ Người nhận đã che số nhà và phần chi tiết nhạy cảm; không trả cấu trúc địa chỉ gốc\.|
|`data.estimated_delivery`|object|Không|Khoảng thời gian dự kiến giao; bỏ object khi chưa xác định được\.|
|`data.estimated_delivery.from`|datetime|Có điều kiện|Thời điểm bắt đầu khoảng giao dự kiến\.|
|`data.estimated_delivery.to`|datetime|Có điều kiện|Thời điểm kết thúc khoảng giao dự kiến và không nhỏ hơn `from`\.|
|`data.current_delivery`|object|Không|NVC và chặng đang thực hiện; bỏ object khi chưa có NVC đang xử lý\.|
|`data.current_delivery.carrier_code`|integer|Có điều kiện|Mã NVC trong Carrier Registry\.|
|`data.current_delivery.carrier_name`|string|Có điều kiện|Tên NVC đang thực hiện\.|
|`data.current_delivery.carrier_waybill_code`|string|Có điều kiện|Mã vận đơn đang được NVC sử dụng\.|
|`data.current_delivery.leg_type`|integer|Có điều kiện|Loại chặng: `1` — lấy hàng; `2` — giao hàng; `3` — hoàn hàng; `4` — trả hàng cuối\.|
|`data.current_delivery.leg_name`|string|Có điều kiện|Tên chặng bằng tiếng Việt\.|
|`data.current_location`|object|Không|Vị trí vận hành gần nhất được phép công khai; bỏ object khi NVC không cung cấp\.|
|`data.current_location.location_name`|string|Có điều kiện|Tên khu vực hoặc bưu cục; không trả địa chỉ cá nhân chi tiết\.|
|`data.current_location.updated_at`|datetime|Có điều kiện|Thời điểm vị trí này được cập nhật\.|
|`data.tracking_events`|array\(object\)|Có|Timeline công khai theo thứ tự mới nhất trước; trả `[]` nếu chưa phát sinh mốc vận chuyển\.|
|`data.tracking_events[].event_name`|string|Có điều kiện|Tên mốc vận chuyển dễ hiểu\.|
|`data.tracking_events[].description`|string|Có điều kiện|Mô tả mốc đã được chuẩn hóa cho Người nhận\.|
|`data.tracking_events[].carrier_name`|string|Không|Tên NVC tại mốc; bỏ trường nếu mốc không gắn với NVC cụ thể\.|
|`data.tracking_events[].location_name`|string|Không|Khu vực hoặc bưu cục được phép công khai; bỏ trường nếu nguồn không cung cấp\.|
|`data.tracking_events[].reason`|string|Không|Lý do đã chuẩn hóa; chỉ trả tại mốc thất bại hoặc ngoại lệ cần giải thích\.|
|`data.tracking_events[].occurred_at`|datetime|Có điều kiện|Thời điểm nghiệp vụ thực tế xảy ra\.|
|`data.tracking_events[].is_current`|boolean|Có điều kiện|`true` nếu đây là mốc hiện tại của hành trình\.|
|`data.updated_at`|datetime|Có|Thời điểm dữ liệu Public Tracking được cập nhật gần nhất\.|

##### Ví dụ Response

```JSON
{
  "error": false,
  "message": "Tra cứu hành trình Đơn hàng thành công.",
  "data": {
    "order_code": "9001156990401",
    "status_name": "Đang giao hàng",
    "status_description": "Đơn hàng đang được giao đến Người nhận.",
    "sender": {
      "name_masked": "AB S***",
      "phone_masked": "******8077",
      "address_masked": "*** Dương Bá Trạc, Phường Chánh Hưng, Thành phố Hồ Chí Minh"
    },
    "receiver": {
      "name_masked": "Nguyễn M*** A**",
      "phone_masked": "******3404",
      "address_masked": "*** Thân Nhân Trung, Phường Tân Sơn, Thành phố Hồ Chí Minh"
    },
    "estimated_delivery": {
      "from": "2026-09-17T14:30:00+07:00",
      "to": "2026-09-17T17:30:00+07:00"
    },
    "current_delivery": {
      "carrier_code": 4,
      "carrier_name": "Viettel Post",
      "carrier_waybill_code": "SOO10902766013",
      "leg_type": 2,
      "leg_name": "Giao hàng"
    },
    "current_location": {
      "location_name": "Khu vực phát Tân Bình, Thành phố Hồ Chí Minh",
      "updated_at": "2026-09-17T13:55:00+07:00"
    },
    "tracking_events": [
      {
        "event_name": "Đang giao hàng",
        "description": "Đơn hàng đang được giao đến Người nhận.",
        "carrier_name": "Viettel Post",
        "location_name": "Khu vực phát Tân Bình, Thành phố Hồ Chí Minh",
        "occurred_at": "2026-09-17T14:05:00+07:00",
        "is_current": true
      },
      {
        "event_name": "Đã đến khu vực giao hàng",
        "description": "Đơn hàng đã đến khu vực giao cuối.",
        "carrier_name": "Viettel Post",
        "location_name": "Thành phố Hồ Chí Minh",
        "occurred_at": "2026-09-17T09:15:00+07:00",
        "is_current": false
      },
      {
        "event_name": "Đã lấy hàng",
        "description": "Đơn hàng đã được tiếp nhận để vận chuyển.",
        "carrier_name": "SuperShip",
        "location_name": "Thành phố Hồ Chí Minh",
        "occurred_at": "2026-09-16T10:05:00+07:00",
        "is_current": false
      }
    ],
    "updated_at": "2026-09-17T14:05:00+07:00"
  }
}
```

#### Error

|**HTTP Status**|**Error Code**|**Khi nào xảy ra**|
|---|---|---|
|`400 Bad Request`|`INVALID_PUBLIC_TRACKING_REQUEST`|Thiếu hoặc sai cấu trúc dữ liệu tra cứu\.|
|`400 Bad Request`|`INVALID_CAPTCHA`|Thiếu CAPTCHA, CAPTCHA không hợp lệ hoặc đã hết hiệu lực\.|
|`404 Not Found`|`PUBLIC_TRACKING_NOT_AVAILABLE`|Không thể xác thực yêu cầu hoặc không có dữ liệu Public Tracking được phép trả\.|
|`429 Too Many Requests`|`PUBLIC_TRACKING_RATE_LIMIT_EXCEEDED`|Vượt giới hạn request của Public Tracking\.|
|`503 Service Unavailable`|`PUBLIC_TRACKING_UNAVAILABLE`|Tạm thời không thể tải dữ liệu Public Tracking\.|

## 6\. MÃ LỖI DÙNG CHUNG

|Mã lỗi|HTTP status|Ý nghĩa|
|---|---|---|
|`VALIDATION_ERROR`|400|Request sai cấu trúc hoặc giá trị\.|
|`UNAUTHENTICATED`|401|Chưa xác thực\.|
|`FORBIDDEN`|403|Không có quyền\.|
|`DATA_SCOPE_DENIED`|403|Ngoài phạm vi dữ liệu\.|
|`ORDER_NOT_FOUND`|404|Không tìm thấy Đơn hàng\.|
|`RESOURCE_NOT_FOUND`|404|Không tìm thấy tài nguyên con\.|
|`IDEMPOTENCY_CONFLICT`|409|Idempotency key xung đột\.|
|`VERSION_CONFLICT`|409|Phiên bản dữ liệu xung đột\.|
|`ACTION_NOT_ALLOWED`|422|Trạng thái không cho phép thao tác\.|
|`FIELD_NOT_EDITABLE`|422|Field không được sửa trực tiếp\.|
|`REQUEST_ALREADY_ACTIVE`|409|Đã có yêu cầu cùng loại đang xử lý\.|
|`INTERNAL_ERROR`|500|Lỗi hệ thống chưa xác định\.|

## 7\. CHECKLIST NGHIỆM THU

* [ ] Đủ  Core API và  Workflow API\.

* [ ] Mỗi API có mô tả, Endpoint, Request, Response và Error\.

* [ ] Response có error, message, data\.

* [ ] Field JSON dùng snake\_case\.

* [ ] Không trả ID database hoặc dữ liệu nhạy cảm\.

* [ ] PATCH không tự chuyển thành yêu cầu thay đổi\.

* [ ] Order chỉ quản lý hình ảnh, không quản lý tệp đính kèm thông thường\.

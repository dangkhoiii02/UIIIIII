\set ON_ERROR_STOP on

BEGIN;
SET LOCAL search_path TO order_mgmt, public;

-- API coverage additions for API Contract 1.3.0.
-- Các fixture này chỉ bổ sung trạng thái/biến thể cho Order đã có; không tạo
-- bảng Print vì Print Module sở hữu Print Job, render và file kết quả.

-- D1-06 / PATCH Order: đóng snapshot cũ, mở snapshot mới cho Party, Address,
-- Goods và Endpoint; lưu Request, Adjustment và Activity before/after.
UPDATE order_addresses
   SET valid_to = '2026-09-19 08:30:00+00'
 WHERE address_id IN (
    '11000000-0000-7000-8000-000000000011',
    '11000000-0000-7000-8000-000000000012'
 );

INSERT INTO order_addresses (
    address_id,order_id,address_type,address_model,source_type,source_code,source_name,
    address_detail,full_address,province_code,district_code,commune_code,latitude,longitude,
    valid_from,version_no,created_at,created_by
) VALUES
('11000000-0000-7000-8000-000000000101','11000000-0000-7000-8000-000000000001',1,1,1,
 'SHOP-WH-HN-0184-V2','Kho hàng Cầu Giấy - địa chỉ cập nhật','Số 22 ngõ 76 phố Duy Tân',
 'Số 22 ngõ 76 phố Duy Tân, phường Dịch Vọng Hậu, quận Cầu Giấy, Hà Nội',
 '01','001','00007',21.0317000,105.7819000,'2026-09-19 08:30:00+00',2,
 '2026-09-19 08:30:00+00','order-api'),
('11000000-0000-7000-8000-000000000102','11000000-0000-7000-8000-000000000001',2,1,2,
 'ADR-HCM-000921-V2','Địa chỉ giao hàng - địa chỉ cập nhật','Số 55 đường Nguyễn Văn Thương',
 'Số 55 đường Nguyễn Văn Thương, phường 25, quận Bình Thạnh, Thành phố Hồ Chí Minh',
 '79','765','26965',10.8039000,106.7160000,'2026-09-19 08:30:00+00',2,
 '2026-09-19 08:30:00+00','order-api');

UPDATE order_parties
   SET valid_to = '2026-09-19 08:30:00+00'
 WHERE party_id IN (
    '11000000-0000-7000-8000-000000000021',
    '11000000-0000-7000-8000-000000000022'
 );

INSERT INTO order_parties (
    party_id,order_id,party_type,name,contact_name,phone,email,
    valid_from,version_no,created_at,created_by
) VALUES
('11000000-0000-7000-8000-000000000121','11000000-0000-7000-8000-000000000001',1,
 'Cửa hàng Gia Dụng An Nhiên','Phạm Thu Hằng','0326001001','hang.pham.0184@example.com',
 '2026-09-19 08:30:00+00',2,'2026-09-19 08:30:00+00','order-api'),
('11000000-0000-7000-8000-000000000122','11000000-0000-7000-8000-000000000001',2,
 'Lê Hoàng Nam','Lê Hoàng Nam','0326001002','nam.le.0921@example.net',
 '2026-09-19 08:30:00+00',2,'2026-09-19 08:30:00+00','order-api');

UPDATE order_goods
   SET valid_to = '2026-09-19 08:30:00+00'
 WHERE goods_id = '11000000-0000-7000-8000-000000000031';

INSERT INTO order_goods (
    goods_id,order_id,content_type,product_name,declared_value,currency_code,tag_codes,
    valid_from,version_no,created_at,created_by
) VALUES (
 '11000000-0000-7000-8000-000000000131','11000000-0000-7000-8000-000000000001',2,
 'Bộ 6 ly thủy tinh chịu nhiệt 350 ml - snapshot cập nhật',680000,'VND',ARRAY[1]::smallint[],
 '2026-09-19 08:30:00+00',2,'2026-09-19 08:30:00+00','order-api');

INSERT INTO order_items (
    item_id,order_id,goods_id,item_code,product_ref,sku,item_name,unit_price,unit_weight_g,quantity,created_at
) VALUES (
 '11000000-0000-7000-8000-000000000141','11000000-0000-7000-8000-000000000001',
 '11000000-0000-7000-8000-000000000131','ITEM-D101-01-V2','PRD-GLASS-SET-06','AN-GD-LY06',
 'Bộ 6 ly thủy tinh chịu nhiệt 350 ml - snapshot cập nhật',340000,1250,2,
 '2026-09-19 08:30:00+00');

UPDATE leg_endpoints
   SET valid_to = '2026-09-19 08:30:00+00'
 WHERE leg_id = '11000000-0000-7000-8000-000000000061';

INSERT INTO leg_endpoints (
    leg_endpoint_id,order_id,leg_id,endpoint_role,location_type,order_address_id,
    location_name,valid_from,version_no,created_at
) VALUES
('11000000-0000-7000-8000-000000000181','11000000-0000-7000-8000-000000000001',
 '11000000-0000-7000-8000-000000000061',1,1,'11000000-0000-7000-8000-000000000101',
 'Kho hàng Cầu Giấy - địa chỉ cập nhật','2026-09-19 08:30:00+00',2,'2026-09-19 08:30:00+00'),
('11000000-0000-7000-8000-000000000182','11000000-0000-7000-8000-000000000001',
 '11000000-0000-7000-8000-000000000061',2,1,'11000000-0000-7000-8000-000000000102',
 'Địa chỉ nhận Bình Thạnh - địa chỉ cập nhật','2026-09-19 08:30:00+00',2,'2026-09-19 08:30:00+00');

UPDATE orders
   SET cod_amount = 495000,
       delivery_note = 'Đã cập nhật địa chỉ và ghi chú giao hàng trước khi NVC cấp Waybill.',
       version_no = 2,
       updated_at = '2026-09-19 08:31:00+00',
       updated_by = 'order-api'
 WHERE order_id = '11000000-0000-7000-8000-000000000001';

INSERT INTO order_requests (
    request_id,order_id,request_code,request_type,request_status,payload_version,
    request_payload,source_type,requested_by_actor_type,requested_by_actor_ref,
    requested_by_display_name,requested_at,result_code,completed_at,correlation_id,
    version_no,created_at,updated_at
) VALUES (
 '11000000-0000-7000-8000-000000000151','11000000-0000-7000-8000-000000000001',
 'REQ-D106-DIRECT-PATCH','UPDATE_ORDER',3,1,
 '{"changed_fields":["receiver_name","delivery_address","cod_amount","goods"],"cod_amount":{"before":485000,"after":495000}}'::jsonb,
 1,1,'shop-user-000184','Trần Minh Khôi','2026-09-19 08:30:00+00','ORDER_UPDATED',
 '2026-09-19 08:31:00+00','corr-d106-direct-patch-000001',1,
 '2026-09-19 08:30:00+00','2026-09-19 08:31:00+00');

INSERT INTO request_targets (request_target_id,order_id,request_id,target_type,address_id,created_at) VALUES
('11000000-0000-7000-8000-000000000152','11000000-0000-7000-8000-000000000001','11000000-0000-7000-8000-000000000151','ADDRESS','11000000-0000-7000-8000-000000000102','2026-09-19 08:30:00+00');
INSERT INTO request_targets (request_target_id,order_id,request_id,target_type,party_id,created_at) VALUES
('11000000-0000-7000-8000-000000000153','11000000-0000-7000-8000-000000000001','11000000-0000-7000-8000-000000000151','PARTY','11000000-0000-7000-8000-000000000122','2026-09-19 08:30:00+00');
INSERT INTO request_targets (request_target_id,order_id,request_id,target_type,goods_id,created_at) VALUES
('11000000-0000-7000-8000-000000000154','11000000-0000-7000-8000-000000000001','11000000-0000-7000-8000-000000000151','GOODS','11000000-0000-7000-8000-000000000131','2026-09-19 08:30:00+00');

INSERT INTO request_steps (
    request_step_id,order_id,request_id,request_target_id,step_no,step_type,step_status,
    correlation_id,external_ref,request_hash,result_code,attempt_count,started_at,
    completed_at,version_no,created_at,updated_at
) VALUES (
 '11000000-0000-7000-8000-000000000155','11000000-0000-7000-8000-000000000001',
 '11000000-0000-7000-8000-000000000151','11000000-0000-7000-8000-000000000152',1,
 'UPDATE_ORDER','SUCCESS','corr-d106-direct-patch-000001','ORD-PATCH-000001',
 '5f2d4b63d0f4b3e78a7cbb45c2e2bf0fd66c8f2fcf91c9d8e6d8b0b7d0a0a11c',
 'ORDER_UPDATED',1,'2026-09-19 08:30:00+00','2026-09-19 08:31:00+00',1,
 '2026-09-19 08:30:00+00','2026-09-19 08:31:00+00');

INSERT INTO order_adjustments (
    adjustment_id,order_id,request_id,adjustment_type,before_data,after_data,reason_code,
    reason,applied_by_actor_type,applied_by_actor_ref,applied_by_display_name,applied_at,created_at
) VALUES (
 '11000000-0000-7000-8000-000000000161','11000000-0000-7000-8000-000000000001',
 '11000000-0000-7000-8000-000000000151','ORDER_INPUT_UPDATED',
 '{"receiver_name":"Lê Hoàng Nam","cod_amount":485000,"address_id":"11000000-0000-7000-8000-000000000012","goods_id":"11000000-0000-7000-8000-000000000031"}'::jsonb,
 '{"receiver_name":"Lê Hoàng Nam","cod_amount":495000,"address_id":"11000000-0000-7000-8000-000000000102","goods_id":"11000000-0000-7000-8000-000000000131"}'::jsonb,
 'SHOP_REQUESTED','Shop cập nhật thông tin trước khi có Waybill hợp lệ.',1,'shop-user-000184','Trần Minh Khôi',
 '2026-09-19 08:31:00+00','2026-09-19 08:31:00+00');

INSERT INTO activity_logs (
    activity_id,order_id,sequence_no,activity_group,activity_key,activity_name,title,description,
    result,actor_type,actor_code,actor_name,source_type,changes,"references",correlation_id,occurred_at,recorded_at
) VALUES (
 '11000000-0000-7000-8000-000000000171','11000000-0000-7000-8000-000000000001',1,2,
 'ORDER_UPDATED','Cập nhật thông tin Order','Đã cập nhật thông tin Order',
 'Shop cập nhật địa chỉ, hàng hóa và COD trước khi NVC cấp Waybill.',1,'SHOP','shop-user-000184',
 'Trần Minh Khôi','WEB','[{"field":"cod_amount","before":485000,"after":495000}]'::jsonb,
 '[{"ref_type":"REQUEST","ref_code":"REQ-D106-DIRECT-PATCH"}]'::jsonb,
 'corr-d106-direct-patch-000001','2026-09-19 08:31:00+00','2026-09-19 08:31:05+00');

-- D2-13: thay đổi sau khi có Waybill bị Carrier từ chối; snapshot chính thức
-- không đổi, chỉ lưu Request/Step thất bại và Ticket tham chiếu.
INSERT INTO external_refs (
    external_ref_id,order_id,module_code,ref_type,external_id,parent_external_ref_id,
    leg_id,waybill_id,carrier_code,created_at
) VALUES (
 '17000000-0000-7000-8000-000000000201','20000004-0001-7001-8004-000000004001',
 'SUPPORT','TICKET','SUP-260921-00512',NULL,
 '20000004-0062-7062-8004-000000004062','20000004-0092-7092-8004-000000004092',3,
 '2026-09-21 12:00:00+00');

INSERT INTO order_requests (
    request_id,order_id,request_code,request_type,request_status,payload_version,request_payload,
    reason_code,reason,source_type,requested_by_actor_type,requested_by_actor_ref,
    requested_by_display_name,requested_at,result_code,result_reason_code,result_reason,
    completed_at,correlation_id,version_no,created_at,updated_at
) VALUES (
 '17000000-0000-7000-8000-000000000202','20000004-0001-7001-8004-000000004001',
 'REQ-D213-CARRIER-CHANGE-REJECTED','UPDATE_ORDER',4,1,
 '{"changed_fields":["delivery_address","receiver_phone"],"carrier_confirmation_required":true}'::jsonb,
 'CARRIER_CONFIRMATION_REQUIRED','Thay đổi sau khi đã có Waybill cần NVC xác nhận.',2,2,'support-user-0512',
 'Nhân viên Support','2026-09-21 12:00:00+00',NULL,'CARRIER_REJECTED',
 'NVC từ chối thay đổi địa chỉ sau khi kiện đã vào hành trình.',
 '2026-09-21 12:10:00+00','corr-d213-carrier-rejected-000004',1,
 '2026-09-21 12:00:00+00','2026-09-21 12:10:00+00');

INSERT INTO request_targets (request_target_id,order_id,request_id,target_type,external_ref_id,created_at) VALUES (
 '17000000-0000-7000-8000-000000000203','20000004-0001-7001-8004-000000004001',
 '17000000-0000-7000-8000-000000000202','EXTERNAL_REF','17000000-0000-7000-8000-000000000201','2026-09-21 12:00:00+00');

INSERT INTO request_steps (
    request_step_id,order_id,request_id,request_target_id,step_no,step_type,step_status,carrier_code,
    correlation_id,external_ref,request_hash,result_code,attempt_count,last_error_code,last_error,
    started_at,completed_at,version_no,created_at,updated_at
) VALUES (
 '17000000-0000-7000-8000-000000000204','20000004-0001-7001-8004-000000004001',
 '17000000-0000-7000-8000-000000000202','17000000-0000-7000-8000-000000000203',1,
 'UPDATE_ORDER','FAILED',3,'corr-d213-carrier-rejected-000004','CAR-UPDATE-REJECTED-000004',
 'bbf1e0e568bf4ae18c5ee7dc3e34fb2ce5a5a8c2870e6a0a3d6f4c52f4c6e6a1',NULL,1,
 'CARRIER_REJECTED','Carrier không chấp nhận cập nhật sau khi đã nhận kiện.',
 '2026-09-21 12:00:02+00','2026-09-21 12:10:00+00',1,
 '2026-09-21 12:00:02+00','2026-09-21 12:10:00+00');

INSERT INTO activity_logs (
    activity_id,order_id,sequence_no,activity_group,activity_key,activity_name,title,description,
    result,actor_type,actor_code,actor_name,source_type,changes,"references",correlation_id,occurred_at,recorded_at
) VALUES (
 '17000000-0000-7000-8000-000000000205','20000004-0001-7001-8004-000000004001',2,6,
 'ORDER_CHANGE_REJECTED','Từ chối thay đổi Order','NVC từ chối thay đổi sau khi nhận kiện',
 'Dữ liệu chính thức được giữ nguyên; Support Ticket đã nhận kết quả từ Carrier.',2,'CARRIER',
 'carrier-jnt','J&T Express','CARRIER_WEBHOOK','[]'::jsonb,
 '[{"ref_type":"REQUEST","ref_code":"REQ-D213-CARRIER-CHANGE-REJECTED"},{"ref_type":"TICKET","ref_code":"SUP-260921-00512"}]'::jsonb,
 'corr-d213-carrier-rejected-000004','2026-09-21 12:10:00+00','2026-09-21 12:10:05+00');

-- Cancel và Retry API: giữ riêng trạng thái processing, unknown và failed;
-- Retry luôn trỏ tới Attempt/Handover cũ, không ghi đè lịch sử.
INSERT INTO order_requests (
    request_id,order_id,request_code,request_type,request_status,payload_version,request_payload,
    source_type,requested_by_actor_type,requested_by_actor_ref,requested_by_display_name,
    requested_at,result_code,result_reason_code,result_reason,completed_at,correlation_id,
    version_no,created_at,updated_at
) VALUES
('17000000-0000-7000-8000-000000000901','15000000-0000-7000-8000-000000000001',
 'REQ-D205-CANCEL-PROCESSING','CANCEL_ORDER',2,1,'{"reason_code":"SHOP_CHANGED_MIND"}'::jsonb,
 1,1,'shop-user-001205','Ngô Phương Thảo','2026-09-19 10:00:00+00',NULL,NULL,NULL,NULL,
 'corr-d205-cancel-processing-000005',1,'2026-09-19 10:00:00+00','2026-09-19 10:00:00+00'),
('17000000-0000-7000-8000-000000000902','16100000-0000-7000-8000-000000000001',
 'REQ-D205-CANCEL-UNKNOWN','CANCEL_ORDER',5,1,'{"reason_code":"SHOP_CHANGED_MIND"}'::jsonb,
 2,2,'order-worker-unknown','Order Workflow','2026-09-19 10:05:00+00',NULL,NULL,NULL,'2026-09-19 10:06:00+00',
 'corr-d205-cancel-unknown-000008',1,'2026-09-19 10:05:00+00','2026-09-19 10:06:00+00'),
('17000000-0000-7000-8000-000000000903','16000000-0000-7000-8000-000000000001',
 'REQ-D205-CANCEL-REJECTED','CANCEL_ORDER',4,1,'{"reason_code":"OTHER","reason":"Khách yêu cầu giữ đơn sau khi NVC đã nhận kiện."}'::jsonb,
 2,2,'order-worker-cancel','Order Workflow','2026-09-19 10:10:00+00',NULL,'ORDER_NOT_CANCELLABLE',
 'Không thể hủy Order sau khi NVC đã nhận kiện.','2026-09-19 10:11:00+00',
 'corr-d205-cancel-rejected-000007',1,'2026-09-19 10:10:00+00','2026-09-19 10:11:00+00');

INSERT INTO request_steps (
    request_step_id,order_id,request_id,step_no,step_type,step_status,correlation_id,
    request_hash,attempt_count,started_at,completed_at,version_no,created_at,updated_at,
    last_error_code,last_error
) VALUES
('17000000-0000-7000-8000-000000000904','15000000-0000-7000-8000-000000000001',
 '17000000-0000-7000-8000-000000000901',1,'CANCEL_ORDER','PROCESSING',
 'corr-d205-cancel-processing-000005',md5('cancel-processing-000005')||md5('cancel-processing-000005'),1,
 '2026-09-19 10:00:02+00',NULL,1,'2026-09-19 10:00:02+00','2026-09-19 10:00:02+00',NULL,NULL),
('17000000-0000-7000-8000-000000000905','16100000-0000-7000-8000-000000000001',
 '17000000-0000-7000-8000-000000000902',1,'CANCEL_ORDER','UNKNOWN',
 'corr-d205-cancel-unknown-000008',md5('cancel-unknown-000008')||md5('cancel-unknown-000008'),1,
 '2026-09-19 10:05:02+00',NULL,1,'2026-09-19 10:05:02+00','2026-09-19 10:06:00+00',
 'CARRIER_TIMEOUT','NVC chưa xác định đã hủy hay chưa sau thời gian chờ.'),
('17000000-0000-7000-8000-000000000906','16000000-0000-7000-8000-000000000001',
 '17000000-0000-7000-8000-000000000903',1,'CANCEL_ORDER','FAILED',
 'corr-d205-cancel-rejected-000007',md5('cancel-rejected-000007')||md5('cancel-rejected-000007'),1,
 '2026-09-19 10:10:02+00','2026-09-19 10:11:00+00',1,'2026-09-19 10:10:02+00','2026-09-19 10:11:00+00',
 'ORDER_NOT_CANCELLABLE','NVC đã nhận kiện nên không thể hủy trực tiếp.');

INSERT INTO order_requests (
    request_id,order_id,request_code,request_type,request_status,payload_version,request_payload,
    source_type,requested_by_actor_type,requested_by_actor_ref,requested_by_display_name,
    requested_at,result_code,completed_at,correlation_id,version_no,created_at,updated_at
) VALUES
('17000000-0000-7000-8000-000000000911','20000004-0001-7001-8004-000000004001',
 'REQ-D204-RETRY-DELIVERY','RETRY_OPERATION',3,1,'{"operation":"DELIVERY","attempt_no":2}'::jsonb,
 2,2,'ops-user-hn-0042','Lê Thị Bích Ngọc','2026-09-20 09:30:00+00','RETRY_ACCEPTED',
 '2026-09-20 09:31:00+00','corr-d204-retry-delivery-000004',1,'2026-09-20 09:30:00+00','2026-09-20 09:31:00+00'),
('17000000-0000-7000-8000-000000000912','20000004-0001-7001-8004-000000004001',
 'REQ-D216-RETRY-HANDOVER','RETRY_OPERATION',3,1,'{"operation":"HANDOVER","attempt_no":2}'::jsonb,
 2,2,'handover-worker-04','Tiến trình bàn giao','2026-09-20 05:30:00+00','RETRY_ACCEPTED',
 '2026-09-20 05:31:00+00','corr-d216-retry-handover-000004',1,'2026-09-20 05:30:00+00','2026-09-20 05:31:00+00'),
('17000000-0000-7000-8000-000000000913','20000006-0001-7001-8006-000000006001',
 'REQ-D209-RETRY-RETURN','RETRY_OPERATION',3,1,'{"operation":"RETURN_PICKUP","attempt_no":2}'::jsonb,
 2,2,'return-worker-06','Tiến trình chuyển hoàn','2026-09-20 07:30:00+00','RETRY_ACCEPTED',
 '2026-09-20 07:31:00+00','corr-d209-retry-return-000006',1,'2026-09-20 07:30:00+00','2026-09-20 07:31:00+00');

INSERT INTO request_targets (request_target_id,order_id,request_id,target_type,attempt_id,created_at) VALUES
('17000000-0000-7000-8000-000000000914','20000004-0001-7001-8004-000000004001',
 '17000000-0000-7000-8000-000000000911','ATTEMPT','20000004-0403-7403-8004-000000004403','2026-09-20 09:30:00+00'),
('17000000-0000-7000-8000-000000000915','20000006-0001-7001-8006-000000006001',
 '17000000-0000-7000-8000-000000000913','ATTEMPT','20000006-0401-7401-8006-000000006401','2026-09-20 07:30:00+00');
INSERT INTO request_targets (request_target_id,order_id,request_id,target_type,handover_id,created_at) VALUES (
 '17000000-0000-7000-8000-000000000916','20000004-0001-7001-8004-000000004001',
 '17000000-0000-7000-8000-000000000912','HANDOVER','20000004-0420-7420-8004-000000004420','2026-09-20 05:30:00+00');

INSERT INTO request_steps (
    request_step_id,order_id,request_id,request_target_id,step_no,step_type,step_status,
    correlation_id,request_hash,result_code,attempt_count,started_at,completed_at,version_no,created_at,updated_at
) VALUES
('17000000-0000-7000-8000-000000000917','20000004-0001-7001-8004-000000004001','17000000-0000-7000-8000-000000000911','17000000-0000-7000-8000-000000000914',1,'RETRY_DELIVERY','SUCCESS','corr-d204-retry-delivery-000004',md5('retry-delivery-000004')||md5('retry-delivery-000004'),'RETRY_ACCEPTED',1,'2026-09-20 09:30:00+00','2026-09-20 09:31:00+00',1,'2026-09-20 09:30:00+00','2026-09-20 09:31:00+00'),
('17000000-0000-7000-8000-000000000918','20000004-0001-7001-8004-000000004001','17000000-0000-7000-8000-000000000912','17000000-0000-7000-8000-000000000916',1,'RETRY_HANDOVER','SUCCESS','corr-d216-retry-handover-000004',md5('retry-handover-000004')||md5('retry-handover-000004'),'RETRY_ACCEPTED',1,'2026-09-20 05:30:00+00','2026-09-20 05:31:00+00',1,'2026-09-20 05:30:00+00','2026-09-20 05:31:00+00'),
('17000000-0000-7000-8000-000000000919','20000006-0001-7001-8006-000000006001','17000000-0000-7000-8000-000000000913','17000000-0000-7000-8000-000000000915',1,'RETRY_RETURN','SUCCESS','corr-d209-retry-return-000006',md5('retry-return-000006')||md5('retry-return-000006'),'RETRY_ACCEPTED',1,'2026-09-20 07:30:00+00','2026-09-20 07:31:00+00',1,'2026-09-20 07:30:00+00','2026-09-20 07:31:00+00');

-- D1-08: event đến muộn chỉ lưu lịch sử và event correction không lùi current state.
INSERT INTO tracking_events (
    event_id,order_id,leg_id,waybill_id,attempt_id,event_source,source_namespace,dedupe_key,
    source_module,source_event_ref,event_type,event_code,event_name,stage_status_code,
    carrier_status_code,carrier_status_name,province_code,province_name,district_code,district_name,
    commune_code,commune_name,facility_code,facility_name,occurred_at,received_at,
    order_sequence_no,leg_sequence_no,source_sequence_ref,apply_result,corrects_event_id,created_at
) VALUES
('12000000-0000-7000-8000-0000000000b6','12000000-0000-7000-8000-000000000001',
 '12000000-0000-7000-8000-000000000061','12000000-0000-7000-8000-000000000091',NULL,1,'GHN',
 'D102-LATE-003','CAR','GHN-EVT-327002-LATE-003','TRANSIT','TRANSPORTING_LATE',
 'Event trung chuyển đến muộn','IN_TRANSIT','transporting','Đang trung chuyển','46','Thừa Thiên Huế','474',
 'Thành phố Huế','19815','Xuân Phú','GHN-HUE-HUB-01','Kho trung chuyển Huế',
 '2026-09-12 05:00:00+00','2026-09-13 10:00:00+00',6,6,'3',2,NULL,'2026-09-13 10:00:05+00'),
('12000000-0000-7000-8000-0000000000b7','12000000-0000-7000-8000-000000000001',
 '12000000-0000-7000-8000-000000000061','12000000-0000-7000-8000-000000000091',NULL,1,'GHN',
 'D102-CORRECTION-005','CAR','GHN-EVT-327002-CORRECTION-005','CORRECTION','DELIVERED_CORRECTION',
 'Carrier gửi correction sau giao hàng','DELIVERED','delivered','Giao hàng thành công','46','Thừa Thiên Huế','474',
 'Thành phố Huế','19815','Xuân Phú',NULL,NULL,
 '2026-09-13 09:30:00+00','2026-09-13 09:30:05+00',7,7,'5',3,
 '12000000-0000-7000-8000-0000000000b5','2026-09-13 09:30:05+00');

-- D2-11 / image add-remove: hai ảnh Shop được gỡ trong một Request, một ảnh
-- vẫn attached để API GET trả cả trạng thái ATTACHED và REMOVED.
INSERT INTO order_images (
    image_id,image_code,order_id,file_ref,image_type,description,visibility_scope,source_type,
    source_name,carrier_code,leg_id,waybill_id,attempt_id,result_id,status,created_at,
    removed_at,removed_by_actor_type,removed_by_actor_ref
) VALUES
('17000000-0000-7000-8000-000000000301','IMG-D106-GOODS-REMOVED-01','11000000-0000-7000-8000-000000000001',
 'FILE-D106-GOODS-REMOVED-01','GOODS','Ảnh sản phẩm cũ được gỡ theo yêu cầu Shop.',1,1,
 'Cửa hàng Gia Dụng An Nhiên',NULL,NULL,NULL,NULL,NULL,2,'2026-09-19 08:20:00+00',
 '2026-09-19 08:35:00+00',1,'shop-user-000184'),
('17000000-0000-7000-8000-000000000302','IMG-D106-GOODS-REMOVED-02','11000000-0000-7000-8000-000000000001',
 'FILE-D106-GOODS-REMOVED-02','GOODS','Ảnh đóng gói cũ được gỡ theo yêu cầu Shop.',1,1,
 'Cửa hàng Gia Dụng An Nhiên',NULL,NULL,NULL,NULL,NULL,2,'2026-09-19 08:21:00+00',
 '2026-09-19 08:35:00+00',1,'shop-user-000184'),
('17000000-0000-7000-8000-000000000303','IMG-D106-GOODS-ATTACHED-01','11000000-0000-7000-8000-000000000001',
 'FILE-D106-GOODS-ATTACHED-01','GOODS','Ảnh sản phẩm hiện hành còn gắn trên Order.',1,1,
 'Cửa hàng Gia Dụng An Nhiên',NULL,NULL,NULL,NULL,NULL,1,'2026-09-19 08:36:00+00',
 NULL,NULL,NULL);

INSERT INTO order_images (
    image_id,image_code,order_id,file_ref,image_type,description,visibility_scope,source_type,
    source_name,carrier_code,leg_id,waybill_id,attempt_id,result_id,status,created_at,
    removed_at,removed_by_actor_type,removed_by_actor_ref
) VALUES (
 '17000000-0000-7000-8000-000000000307','IMG-D102-DELIVERY','12000000-0000-7000-8000-000000000001',
 'FILE-D102-DELIVERY','DELIVERY','Ảnh giao hàng do GHN cung cấp.',1,3,
 'GHN',2,'12000000-0000-7000-8000-000000000061',
 '12000000-0000-7000-8000-000000000091','12000000-0000-7000-8000-0000000000a2',
 '12000000-0000-7000-8000-0000000000d1',1,'2026-09-13 09:15:06+00',NULL,NULL,NULL);

INSERT INTO order_requests (
    request_id,order_id,request_code,request_type,request_status,payload_version,request_payload,
    source_type,requested_by_actor_type,requested_by_actor_ref,requested_by_display_name,requested_at,
    result_code,completed_at,correlation_id,version_no,created_at,updated_at
) VALUES (
 '17000000-0000-7000-8000-000000000304','11000000-0000-7000-8000-000000000001',
 'REQ-D211-REMOVE-MULTIPLE-IMAGES','REMOVE_IMAGE',3,1,
 '{"image_codes":["IMG-D106-GOODS-REMOVED-01","IMG-D106-GOODS-REMOVED-02"]}'::jsonb,
 1,1,'shop-user-000184','Trần Minh Khôi','2026-09-19 08:35:00+00','IMAGES_REMOVED',
 '2026-09-19 08:35:05+00','corr-d211-remove-images-000001',1,
 '2026-09-19 08:35:00+00','2026-09-19 08:35:05+00');

INSERT INTO request_steps (
    request_step_id,order_id,request_id,step_no,step_type,step_status,correlation_id,
    request_hash,result_code,attempt_count,started_at,completed_at,version_no,created_at,updated_at
) VALUES (
 '17000000-0000-7000-8000-000000000305','11000000-0000-7000-8000-000000000001',
 '17000000-0000-7000-8000-000000000304',1,'REMOVE_IMAGE','SUCCESS',
 'corr-d211-remove-images-000001','5a80f48aa8b6233a3c1f7c97d8a56fbf60d193cf1d67599b93d5a4e868f93c2e',
 'IMAGES_REMOVED',1,'2026-09-19 08:35:00+00','2026-09-19 08:35:05+00',1,
 '2026-09-19 08:35:00+00','2026-09-19 08:35:05+00');

INSERT INTO activity_logs (
    activity_id,order_id,sequence_no,activity_group,activity_key,activity_name,title,description,
    result,actor_type,actor_code,actor_name,source_type,changes,"references",correlation_id,occurred_at,recorded_at
) VALUES (
 '17000000-0000-7000-8000-000000000306','11000000-0000-7000-8000-000000000001',2,8,
 'IMAGES_REMOVED','Gỡ hình ảnh','Đã gỡ hai hình ảnh khỏi Order',
 'Shop gỡ hai ảnh hàng hóa trong cùng một yêu cầu trước khi NVC lấy hàng.',1,'SHOP','shop-user-000184',
 'Trần Minh Khôi','WEB','[]'::jsonb,
 '[{"ref_type":"REQUEST","ref_code":"REQ-D211-REMOVE-MULTIPLE-IMAGES"},{"ref_type":"IMAGE","ref_code":"IMG-D106-GOODS-REMOVED-01"},{"ref_type":"IMAGE","ref_code":"IMG-D106-GOODS-REMOVED-02"}]'::jsonb,
 'corr-d211-remove-images-000001','2026-09-19 08:35:05+00','2026-09-19 08:35:10+00');

-- D1-13 / D1-14 / Print boundary: activity đủ nhóm 1..12 và PRT external refs.
INSERT INTO external_refs (
    external_ref_id,order_id,module_code,ref_type,external_id,parent_external_ref_id,
    leg_id,waybill_id,carrier_code,created_at
) VALUES
('17000000-0000-7000-8000-000000000401','12000000-0000-7000-8000-000000000001','PRT','PRINT_JOB',
 'PRT-9100000000002-00001',NULL,'12000000-0000-7000-8000-000000000061',
 '12000000-0000-7000-8000-000000000091',2,'2026-09-13 09:30:00+00'),
('17000000-0000-7000-8000-000000000402','12000000-0000-7000-8000-000000000001','PRT','PRINT_JOB',
 'PRT-9100000000002-00002',NULL,'12000000-0000-7000-8000-000000000061',
 '12000000-0000-7000-8000-000000000091',2,'2026-09-13 09:35:00+00'),
('17000000-0000-7000-8000-000000000403','12000000-0000-7000-8000-000000000001','PRT','PRINT_JOB',
 'PRT-9100000000002-00003',NULL,'12000000-0000-7000-8000-000000000061',
 '12000000-0000-7000-8000-000000000091',2,'2026-09-13 09:40:00+00');

INSERT INTO activity_logs (
    activity_id,order_id,sequence_no,activity_group,activity_key,activity_name,title,description,
    result,actor_type,actor_code,actor_name,source_type,changes,"references",correlation_id,occurred_at,recorded_at
) VALUES
('17000000-0000-7000-8000-000000000411','12000000-0000-7000-8000-000000000001',1,1,'ORDER_CREATED','Tạo Order','Order được tạo','Order được tạo từ kênh Web.',1,'SHOP','shop-user-000327','Nguyễn Thảo Vy','WEB','[]'::jsonb,'[]'::jsonb,'act-d1-api-0001','2026-09-10 09:00:00+00','2026-09-10 09:00:01+00'),
('17000000-0000-7000-8000-000000000412','12000000-0000-7000-8000-000000000001',2,2,'ORDER_UPDATED','Cập nhật Order','Order được bổ sung ghi chú giao','Ghi chú giao hàng được cập nhật trước khi giao.',1,'SHOP','shop-user-000327','Nguyễn Thảo Vy','WEB','[{"field":"delivery_note","before":null,"after":"Giao trong giờ hành chính"}]'::jsonb,'[]'::jsonb,'act-d1-api-0002','2026-09-10 09:01:00+00','2026-09-10 09:01:01+00'),
('17000000-0000-7000-8000-000000000413','12000000-0000-7000-8000-000000000001',3,3,'ORDER_STATUS_CHANGED','Đổi trạng thái Order','Order chuyển sang chờ lấy hàng','GHN đã tiếp nhận yêu cầu tạo vận đơn.',1,'SYSTEM','order-orchestrator','Tiến trình điều phối','SYSTEM_PROCESS','[]'::jsonb,'[{"ref_type":"REQUEST","ref_code":"REQ-D102-CREATE-WAYBILL"}]'::jsonb,'act-d1-api-0003','2026-09-10 09:03:06+00','2026-09-10 09:03:07+00'),
('17000000-0000-7000-8000-000000000414','12000000-0000-7000-8000-000000000001',4,4,'CARRIER_STATUS_RECEIVED','Nhận trạng thái NVC','GHN gửi trạng thái đang trung chuyển','Raw Carrier Status được nhận từ webhook GHN.',1,'CARRIER','carrier-ghn','GHN','CARRIER_WEBHOOK','[]'::jsonb,'[{"ref_type":"WAYBILL","ref_code":"GY8YLSDK"}]'::jsonb,'act-d1-api-0004','2026-09-12 04:10:14+00','2026-09-12 04:10:15+00'),
('17000000-0000-7000-8000-000000000415','12000000-0000-7000-8000-000000000001',5,5,'DELIVERY_REQUESTED','Yêu cầu vận hành giao','GHN nhận yêu cầu giao hàng','Order đã đủ điều kiện để giao tới người nhận.',1,'SYSTEM','delivery-worker','Tiến trình giao hàng','SYSTEM_PROCESS','[]'::jsonb,'[{"ref_type":"STAGE","ref_code":"STG-DELIVERY-0001"}]'::jsonb,'act-d1-api-0005','2026-09-13 08:35:08+00','2026-09-13 08:35:09+00'),
('17000000-0000-7000-8000-000000000416','12000000-0000-7000-8000-000000000001',6,6,'SUPPORT_TICKET_LINKED','Liên kết hỗ trợ','Ticket hỗ trợ được liên kết','Ticket vận hành liên quan được tham chiếu từ Order.',4,'INTERNAL','support-user-0327','Nhân viên Support','INTERNAL_TOOL','[]'::jsonb,'[{"ref_type":"TICKET","ref_code":"SUP-260913-00327"}]'::jsonb,'act-d1-api-0006','2026-09-13 08:40:00+00','2026-09-13 08:40:05+00'),
('17000000-0000-7000-8000-000000000417','12000000-0000-7000-8000-000000000001',7,7,'LABEL_PRINTED','In nhãn','Tạo file nhãn lần đầu','Print Module tạo file nhãn A7 thành công.',1,'INTERNAL','print-worker','Print Module','SYSTEM_PROCESS','[]'::jsonb,'[{"ref_type":"PRINT","ref_code":"PRT-9100000000002-00001"}]'::jsonb,'act-d1-api-0007','2026-09-13 09:30:00+00','2026-09-13 09:30:05+00'),
('17000000-0000-7000-8000-000000000418','12000000-0000-7000-8000-000000000001',8,8,'IMAGE_ATTACHED','Thêm hình ảnh','Ảnh bằng chứng được gắn','Ảnh giao hàng được gắn vào Order.',1,'CARRIER','carrier-ghn','GHN','CARRIER_WEBHOOK','[]'::jsonb,'[{"ref_type":"IMAGE","ref_code":"IMG-D102-DELIVERY"}]'::jsonb,'act-d1-api-0008','2026-09-13 09:15:05+00','2026-09-13 09:15:06+00'),
('17000000-0000-7000-8000-000000000419','12000000-0000-7000-8000-000000000001',9,9,'COD_SETTLED','Đối soát COD','Finance xác nhận Order không có COD','Projection Finance xác nhận không phát sinh khoản COD.',1,'INTERNAL','finance-sync','Finance Sync','INTEGRATION_API','[]'::jsonb,'[{"ref_type":"FINANCE","ref_code":"FIN-COD-9100000000002"}]'::jsonb,'act-d1-api-0009','2026-09-13 09:20:00+00','2026-09-13 09:20:05+00'),
('17000000-0000-7000-8000-000000000420','12000000-0000-7000-8000-000000000001',10,11,'SYSTEM_RECONCILED','Đồng bộ hệ thống','Đã đồng bộ trạng thái Order','Consumer hoàn tất cập nhật projection hiện hành.',1,'SYSTEM','tracking-consumer','Tracking Consumer','SYSTEM_PROCESS','[]'::jsonb,'[{"ref_type":"WAYBILL","ref_code":"GY8YLSDK"}]'::jsonb,'act-d1-api-0011','2026-09-13 09:20:10+00','2026-09-13 09:20:11+00'),
('17000000-0000-7000-8000-000000000421','12000000-0000-7000-8000-000000000001',11,12,'SENSITIVE_DATA_VIEWED','Xem dữ liệu nhạy cảm','Audit xem dữ liệu nhạy cảm','Nhân viên nội bộ xem dữ liệu liên hệ theo quyền Audit.',4,'INTERNAL','audit-user-0327','Nhân viên Audit','INTERNAL_TOOL','[]'::jsonb,'[{"ref_type":"ORDER","ref_code":"9100000000002"}]'::jsonb,'act-d1-api-0012','2026-09-13 09:21:00+00','2026-09-13 09:21:05+00'),
('17000000-0000-7000-8000-000000000422','13000000-0000-7000-8000-000000000001',1,10,'CARRIER_CHANGED','Đổi NVC','Order đã đổi NVC giữa các chặng','SuperShip đã bàn giao cho J&T Express.',1,'SYSTEM','handover-workflow','Tiến trình bàn giao','SYSTEM_PROCESS','[{"field":"custodian_carrier_code","before":1,"after":3}]'::jsonb,'[{"ref_type":"HANDOVER","ref_code":"HANDOVER-HCM-HUB-20260908-003"}]'::jsonb,'act-d1-api-0010','2026-09-08 07:35:00+00','2026-09-08 07:35:05+00');

-- API nội bộ: check change, exchange, return/confirm và đổi Carrier.
-- API changes dùng REQ-D2-07-UPDATE + order_adjustments đã có ở D2-07;
-- Partial Delivery dùng fixture nghiệp vụ riêng tại D1-04.
INSERT INTO order_requests (
    request_id,order_id,request_code,request_type,request_status,payload_version,request_payload,
    reason_code,reason,source_type,requested_by_actor_type,requested_by_actor_ref,
    requested_by_display_name,requested_at,result_code,result_reason_code,result_reason,
    completed_at,correlation_id,version_no,created_at,updated_at
) VALUES
('17000000-0000-7000-8000-000000001001','20000007-0001-7001-8007-000000007001',
 'REQ-D217-CHANGE-CHECK','CHANGE_CHECK',3,1,
 '{"changed_fields":["cod_amount","delivery_note"],"ticket_code":"SUP-260919-00471"}'::jsonb,
 'CHANGE_ALLOWED','Order đủ điều kiện để áp dụng thay đổi đã được Support xác minh.',2,2,
 'support-exchange-071','Support Exchange','2026-09-20 08:05:00+00','CHANGE_ALLOWED',NULL,NULL,
 '2026-09-20 08:06:00+00','corr-d217-change-check-000007',1,
 '2026-09-20 08:05:00+00','2026-09-20 08:06:00+00'),
('17000000-0000-7000-8000-000000001002','20000007-0001-7001-8007-000000007001',
 'REQ-D217-EXCHANGE','EXCHANGE_ORDER',3,1,
 '{"note":"Đổi sang màu xanh than, giữ nguyên kích cỡ.","requested_cod_amount":120000}'::jsonb,
 'EXCHANGE_CONFIRMED','Khởi tạo luồng giao sản phẩm thay thế và thu hồi hàng cũ.',2,2,
 'ops-exchange-071','Lê Thu Hà','2026-09-20 08:21:00+00','EXCHANGE_CREATED',NULL,NULL,
 '2026-09-20 08:22:00+00','corr-d217-exchange-000007',1,
 '2026-09-20 08:21:00+00','2026-09-20 08:22:00+00'),
('17000000-0000-7000-8000-000000001003','20000005-0001-7001-8005-000000005001',
 'REQ-D218-RETURN','RETURN_ORDER',3,1,
 '{"note":"Người nhận không có nhu cầu sử dụng, đề nghị chuyển hoàn."}'::jsonb,
 'RETURN_REQUESTED','Shop tạo yêu cầu chuyển hoàn.',1,1,
 'shop-user-d2-05','Xưởng Da thủ công Mộc Lam','2026-09-20 04:05:00+00','RETURN_REQUESTED',NULL,NULL,
 '2026-09-20 04:06:00+00','corr-d218-return-000005',1,
 '2026-09-20 04:05:00+00','2026-09-20 04:06:00+00'),
('17000000-0000-7000-8000-000000001004','20000005-0001-7001-8005-000000005001',
 'REQ-D218-RETURN-CONFIRM','RETURN_CONFIRM',3,1,
 '{"confirmation_type":2,"note":"NVC đã đồng ý nhận hoàn thủ công."}'::jsonb,
 'CARRIER_CONFIRMED','Nhân viên nội bộ xác nhận chuyển hoàn sau khi NVC đồng ý.',2,2,
 'ops-return-0501','Nguyễn Gia Huy','2026-09-20 04:35:00+00','RETURN_CONFIRMED',NULL,NULL,
 '2026-09-20 04:36:00+00','corr-d218-return-confirm-000005',1,
 '2026-09-20 04:35:00+00','2026-09-20 04:36:00+00'),
('17000000-0000-7000-8000-000000001005','13000000-0000-7000-8000-000000000001',
 'REQ-D219-CHANGE-CARRIER','CHANGE_CARRIER',3,1,
 '{"stage_code":"STG-DELIVERY-0001","from_carrier_code":1,"to_carrier_code":3,"reason_code":"CARRIER_CAPACITY"}'::jsonb,
 'CARRIER_CAPACITY','Điều phối đổi NVC cho chặng giao sau khi SuperShip hoàn tất lấy hàng.',2,2,
 'ops-carrier-103','Điều phối vận hành','2026-09-08 07:30:00+00','CARRIER_CHANGED',NULL,NULL,
 '2026-09-08 07:35:00+00','corr-d219-change-carrier-000003',1,
 '2026-09-08 07:30:00+00','2026-09-08 07:35:00+00');

INSERT INTO request_targets (request_target_id,order_id,request_id,target_type,goods_id,leg_id,created_at) VALUES
('17000000-0000-7000-8000-000000001011','20000007-0001-7001-8007-000000007001','17000000-0000-7000-8000-000000001001','GOODS','20000007-0031-7031-8007-000000007031',NULL,'2026-09-20 08:05:00+00'),
('17000000-0000-7000-8000-000000001012','20000007-0001-7001-8007-000000007001','17000000-0000-7000-8000-000000001002','GOODS','20000007-0031-7031-8007-000000007031',NULL,'2026-09-20 08:21:00+00'),
('17000000-0000-7000-8000-000000001013','20000005-0001-7001-8005-000000005001','17000000-0000-7000-8000-000000001003','LEG',NULL,'20000005-0063-7063-8005-000000005063','2026-09-20 04:05:00+00'),
('17000000-0000-7000-8000-000000001014','20000005-0001-7001-8005-000000005001','17000000-0000-7000-8000-000000001004','LEG',NULL,'20000005-0063-7063-8005-000000005063','2026-09-20 04:35:00+00'),
('17000000-0000-7000-8000-000000001015','13000000-0000-7000-8000-000000000001','17000000-0000-7000-8000-000000001005','LEG',NULL,'13000000-0000-7000-8000-000000000052','2026-09-08 07:30:00+00');

INSERT INTO request_steps (
    request_step_id,order_id,request_id,request_target_id,step_no,step_type,step_status,
    correlation_id,request_hash,result_code,attempt_count,started_at,completed_at,
    version_no,created_at,updated_at
) VALUES
('17000000-0000-7000-8000-000000001021','20000007-0001-7001-8007-000000007001','17000000-0000-7000-8000-000000001001','17000000-0000-7000-8000-000000001011',1,'CHANGE_CHECK','SUCCESS','corr-d217-change-check-000007',md5('d217-change-check-1')||md5('d217-change-check-2'),'CHANGE_ALLOWED',1,'2026-09-20 08:05:00+00','2026-09-20 08:06:00+00',1,'2026-09-20 08:05:00+00','2026-09-20 08:06:00+00'),
('17000000-0000-7000-8000-000000001022','20000007-0001-7001-8007-000000007001','17000000-0000-7000-8000-000000001002','17000000-0000-7000-8000-000000001012',1,'EXCHANGE_ORDER','SUCCESS','corr-d217-exchange-000007',md5('d217-exchange-1')||md5('d217-exchange-2'),'EXCHANGE_CREATED',1,'2026-09-20 08:21:00+00','2026-09-20 08:22:00+00',1,'2026-09-20 08:21:00+00','2026-09-20 08:22:00+00'),
('17000000-0000-7000-8000-000000001023','20000005-0001-7001-8005-000000005001','17000000-0000-7000-8000-000000001003','17000000-0000-7000-8000-000000001013',1,'RETURN_ORDER','SUCCESS','corr-d218-return-000005',md5('d218-return-1')||md5('d218-return-2'),'RETURN_REQUESTED',1,'2026-09-20 04:05:00+00','2026-09-20 04:06:00+00',1,'2026-09-20 04:05:00+00','2026-09-20 04:06:00+00'),
('17000000-0000-7000-8000-000000001024','20000005-0001-7001-8005-000000005001','17000000-0000-7000-8000-000000001004','17000000-0000-7000-8000-000000001014',1,'RETURN_CONFIRM','SUCCESS','corr-d218-return-confirm-000005',md5('d218-return-confirm-1')||md5('d218-return-confirm-2'),'RETURN_CONFIRMED',1,'2026-09-20 04:35:00+00','2026-09-20 04:36:00+00',1,'2026-09-20 04:35:00+00','2026-09-20 04:36:00+00'),
('17000000-0000-7000-8000-000000001025','13000000-0000-7000-8000-000000000001','17000000-0000-7000-8000-000000001005','17000000-0000-7000-8000-000000001015',1,'CHANGE_CARRIER','SUCCESS','corr-d219-change-carrier-000003',md5('d219-change-carrier-1')||md5('d219-change-carrier-2'),'CARRIER_CHANGED',1,'2026-09-08 07:30:00+00','2026-09-08 07:35:00+00',1,'2026-09-08 07:30:00+00','2026-09-08 07:35:00+00');

INSERT INTO activity_logs (
    activity_id,order_id,sequence_no,activity_group,activity_key,activity_name,title,description,
    result,actor_type,actor_code,actor_name,source_type,changes,"references",correlation_id,occurred_at,recorded_at
) VALUES
('17000000-0000-7000-8000-000000001031','20000005-0001-7001-8005-000000005001',1,5,'RETURN_REQUESTED','Yêu cầu chuyển hoàn','Đã tạo yêu cầu chuyển hoàn','Shop tạo yêu cầu chuyển hoàn sau khi đơn giao không thành công.',1,'SHOP','shop-user-d2-05','Xưởng Da thủ công Mộc Lam','WEB','[]'::jsonb,'[{"ref_type":"REQUEST","ref_code":"REQ-D218-RETURN"}]'::jsonb,'corr-d218-return-000005','2026-09-20 04:06:00+00','2026-09-20 04:06:05+00'),
('17000000-0000-7000-8000-000000001032','20000005-0001-7001-8005-000000005001',2,5,'RETURN_CONFIRMED','Xác nhận chuyển hoàn','Đã xác nhận chuyển hoàn','Nhân viên nội bộ xác nhận sau khi NVC đồng ý nhận hoàn.',1,'INTERNAL','ops-return-0501','Nguyễn Gia Huy','INTERNAL_TOOL','[]'::jsonb,'[{"ref_type":"REQUEST","ref_code":"REQ-D218-RETURN-CONFIRM"}]'::jsonb,'corr-d218-return-confirm-000005','2026-09-20 04:36:00+00','2026-09-20 04:36:05+00'),
('17000000-0000-7000-8000-000000001033','20000007-0001-7001-8007-000000007001',2,5,'EXCHANGE_CREATED','Đổi hàng','Đã khởi tạo luồng đổi hàng','Order được tạo chặng giao sản phẩm thay thế và thu hồi hàng cũ.',1,'INTERNAL','ops-exchange-071','Lê Thu Hà','INTERNAL_TOOL','[]'::jsonb,'[{"ref_type":"REQUEST","ref_code":"REQ-D217-EXCHANGE"}]'::jsonb,'corr-d217-exchange-000007','2026-09-20 08:22:00+00','2026-09-20 08:22:05+00'),
('17000000-0000-7000-8000-000000001034','13000000-0000-7000-8000-000000000001',2,10,'CARRIER_CHANGED','Đổi NVC','Đã đổi NVC cho chặng giao','Order giữ nguyên lịch sử Waybill cũ và kích hoạt NVC mới cho chặng giao.',1,'INTERNAL','ops-carrier-103','Điều phối vận hành','INTERNAL_TOOL','[{"field":"carrier_code","before":1,"after":3}]'::jsonb,'[{"ref_type":"REQUEST","ref_code":"REQ-D219-CHANGE-CARRIER"}]'::jsonb,'corr-d219-change-carrier-000003','2026-09-08 07:35:00+00','2026-09-08 07:35:05+00');

-- D1-11 / D1-15: mở rộng context enum, pickup method, fee payer, tag và đo lại.
UPDATE orders
   SET created_channel='MOBILE', selection_mode=2,
       created_application_id='supership-mobile', created_client_id='mobile-ios-shop-000327'
 WHERE order_code='9100000000002';
UPDATE orders
   SET created_channel='PARTNER_API', created_actor_type=4,
       created_actor_ref='partner-api-client-0641', created_actor_name='Partner API',
       created_application_id='partner-order-api', created_client_id='partner-client-0641'
 WHERE order_code='9100000000003';
UPDATE orders
   SET created_channel='INTERNAL', created_actor_type=2,
       created_actor_ref='ops-user-hn-0042', created_actor_name='Lê Thị Bích Ngọc',
       created_application_id='supership-ops', created_client_id='ops-web'
 WHERE order_code='9100000000004';
UPDATE orders
   SET created_channel='SYSTEM', created_actor_type=3,
       created_by_identity_id=NULL, created_by_membership_id=NULL,
       created_actor_ref='order-system', created_actor_name='Order System',
       created_application_id='supership-worker', created_client_id='worker-batch-01'
 WHERE order_code='9100000000006';
UPDATE orders SET customer_model=1, transport_model=1 WHERE order_code='9100000000005';
UPDATE orders SET customer_model=4, transport_model=4, selection_mode=3 WHERE order_code='9100000000006';
UPDATE orders SET pickup_method=2 WHERE order_code='9100000000008';
UPDATE waybills SET pickup_method=2 WHERE waybill_id='16100000-0000-7000-8000-000000000081';
UPDATE orders SET fee_payer=2 WHERE order_code='9100000000009';
UPDATE waybills SET fee_payer=2 WHERE waybill_id='16200000-0000-7000-8000-000000000081';
UPDATE order_goods SET tag_codes=ARRAY[2]::smallint[] WHERE goods_id='12000000-0000-7000-8000-000000000031';

INSERT INTO parcel_measures (
    measure_id,order_id,leg_id,waybill_id,carrier_code,measure_kind,source_type,weight_g,
    length_cm,width_cm,height_cm,measured_at,source_ref,created_at
) VALUES (
 '17000000-0000-7000-8000-000000000501','12000000-0000-7000-8000-000000000001',
 '12000000-0000-7000-8000-000000000061','12000000-0000-7000-8000-000000000091',2,2,2,
 1020,29,21,17,'2026-09-11 01:45:00+00','GHN-REMEASURE-D102-327002','2026-09-11 01:45:05+00');

INSERT INTO external_refs (external_ref_id,order_id,module_code,ref_type,external_id,leg_id,waybill_id,carrier_code,created_at) VALUES (
 '17000000-0000-7000-8000-000000000502','13000000-0000-7000-8000-000000000001','FINANCE','COD_SETTLEMENT',
 'FIN-COD-260912-00641','13000000-0000-7000-8000-000000000052','13000000-0000-7000-8000-000000000072',3,
 '2026-09-12 08:00:00+00');

-- D2-12: đủ trạng thái Idempotency và Outbox trong database Order.
INSERT INTO idempotency_records (
    idempotency_id,scope_key,idempotency_key,request_hash,status,resource_type,resource_ref,
    http_status,result_code,response_meta,lease_until,expires_at,created_at,updated_at
) VALUES
('17000000-0000-7000-8000-000000000601','order:9100000000001','idem-d212-processing-000001',
 '8b6d5f3c1e9a7b4d2f6c8e0a1b3d5f7a9c2e4b6d8f0a1c3e5b7d9f1a3c5e7b9d',1,NULL,NULL,NULL,NULL,NULL,
 '2026-09-19 08:40:00+00','2026-09-20 08:40:00+00','2026-09-19 08:39:00+00','2026-09-19 08:39:00+00'),
('17000000-0000-7000-8000-000000000602','order:9209190000003','idem-d212-failed-000003',
 '7c5e3a1f9d2b4c6e8a0f1b3d5e7c9a2f4b6d8e0c1a3f5b7d9e1c3a5f7b9d2e4c',3,NULL,NULL,409,
 'ORDER_RETRY_NOT_ALLOWED','{"code":"ORDER_RETRY_NOT_ALLOWED"}'::jsonb,NULL,
 '2026-09-21 10:00:00+00','2026-09-19 10:00:00+00','2026-09-19 10:01:00+00');

INSERT INTO outbox_events (
    outbox_event_id,order_id,aggregate_type,aggregate_id,aggregate_version,event_type,event_key,
    schema_version,payload,headers,correlation_id,status,attempt_count,available_at,claimed_by,
    claim_until,last_error,sent_at,dead_lettered_at,created_at
) VALUES
('17000000-0000-7000-8000-000000000603','11000000-0000-7000-8000-000000000001','ORDER',
 '11000000-0000-7000-8000-000000000001',2,'OrderUpdated','order:9100000000001:v2:updated',1,
 '{"order_code":"9100000000001","change":"DIRECT_PATCH"}'::jsonb,'{"trace_id":"corr-d106-direct-patch-000001"}'::jsonb,
 'corr-d106-direct-patch-000001',2,1,'2026-09-19 08:31:00+00','order-worker-01','2026-09-19 08:32:00+00',NULL,NULL,NULL,
 '2026-09-19 08:31:00+00'),
('17000000-0000-7000-8000-000000000604','20000003-0001-7001-8003-000000003001','ORDER',
 '20000003-0001-7001-8003-000000003001',3,'OrderWorkflowFailed','order:9209190000003:v3:failed',1,
 '{"order_code":"9209190000003","failure":"DRIVER_ALLOCATION_EXHAUSTED"}'::jsonb,'{"trace_id":"corr-d2-9209190000003"}'::jsonb,
 'corr-d2-9209190000003',5,3,'2026-09-19 23:55:00+00',NULL,NULL,
 'Carrier không còn retry khả dụng.',NULL,'2026-09-21 18:00:00+00','2026-09-19 23:55:00+00');

-- D2-18: kết quả thất bại cuối cùng cho giao và hoàn/trả; Attempt trước đó
-- vẫn được giữ để phân biệt với terminal Result.
UPDATE order_results
   SET valid_to = '2026-09-21 18:05:00+00'
 WHERE result_id = '20000006-0440-7440-8006-000000006440';

INSERT INTO order_results (
    result_id,order_id,leg_id,waybill_id,attempt_id,request_id,result_type,result_code,
    reason_code,reason,source_module,source_ref,occurred_at,valid_from,version_no,created_at
) VALUES (
 '17000000-0000-7000-8000-000000000701','20000003-0001-7001-8003-000000003001',
 '20000003-0061-7061-8003-000000003061',NULL,NULL,'20000003-0080-7080-8003-000000003080',1,3,
 'DRIVER_ALLOCATION_EXHAUSTED','Không tìm được tài xế sau các lần phân bổ.',
 'ORD','RESULT-D2-03-TERMINAL-FAILURE','2026-09-21 18:00:00+00','2026-09-21 18:00:00+00',1,
 '2026-09-21 18:00:05+00'),
('17000000-0000-7000-8000-000000000702','20000006-0001-7001-8006-000000006001',
 '20000006-0064-7064-8006-000000006064','20000006-0094-7094-8006-000000006094',NULL,NULL,2,3,
 'RETURN_FAILED_FINAL','Không thể trả phần hàng còn lại sau khi retry.',
 'ORD','RESULT-D2-06-RETURN-TERMINAL-FAILURE','2026-09-21 18:05:00+00','2026-09-21 18:05:00+00',2,
 '2026-09-21 18:05:05+00');

-- D2-15: Batch thất bại toàn bộ và kết quả theo dòng.
INSERT INTO order_batches (
    batch_id,batch_code,shop_id,status,total_rows,success_rows,failed_rows,processing_rows,
    failure_code,failure_reason,created_by_actor_type,created_by_actor_ref,created_by_display_name,
    created_application_id,created_client_id,correlation_id,version_no,created_at,started_at,completed_at,updated_at
) VALUES (
 '17000000-0000-7000-8000-000000000801','BAT-20260919-FAILED-001',
 '10000000-0000-7000-8000-000000000001',4,1,0,1,0,'BATCH_VALIDATION_FAILED',
 'Toàn bộ dòng không đạt kiểm tra dữ liệu đầu vào.',1,'shop-user-000184','Trần Minh Khôi','supership-web',
 'web-batch-shop-000184','corr-batch-failed-000001',1,'2026-09-19 09:00:00+00','2026-09-19 09:01:00+00',
 '2026-09-19 09:02:00+00','2026-09-19 09:02:00+00');

INSERT INTO batch_items (
    batch_item_id,batch_id,row_number,order_id,soc,receiver_name,receiver_phone,status,input_data,
    input_schema_version,input_hash,result_data,errors,attempt_count,available_at,created_at,updated_at
) VALUES (
 '17000000-0000-7000-8000-000000000802','17000000-0000-7000-8000-000000000801',2,NULL,
 'BATCH-FAILED-001','Người nhận kiểm thử','0326009001',3,
 '{"receiver_name":"Người nhận kiểm thử","receiver_phone":"0326009001","province_code":"79","district_code":"999","commune_code":"INVALID"}'::jsonb,
 1,'9f2e6d4c8b0a1e3f5d7c9b2a4e6f8d0c1b3a5e7d9f2c4b6a8e0d1f3c5b7a9e2d',NULL,
 '[{"field":"district_code","code":"ADDRESS_CODE_NOT_FOUND","message":"Mã quận/huyện không hợp lệ."}]'::jsonb,1,
 '2026-09-19 09:01:00+00','2026-09-19 09:00:00+00','2026-09-19 09:02:00+00');

INSERT INTO batch_item_attempts (
    batch_item_attempt_id,batch_item_id,attempt_no,status,result_data,errors,worker_ref,started_at,completed_at,created_at
) VALUES (
 '17000000-0000-7000-8000-000000000803','17000000-0000-7000-8000-000000000802',1,3,NULL,
 '[{"field":"district_code","code":"ADDRESS_CODE_NOT_FOUND","message":"Mã quận/huyện không hợp lệ."}]'::jsonb,
 'batch-validator-01','2026-09-19 09:01:30+00','2026-09-19 09:01:45+00','2026-09-19 09:01:45+00');

COMMIT;

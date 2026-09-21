\set ON_ERROR_STOP on

BEGIN;
SET LOCAL search_path TO order_mgmt, public;

-- Mỗi trạng thái chưa có Order hiện tại được cấp một Order showcase đầy đủ.
-- Mục đích là kiểm tra trực tiếp badge/action/Thông Tin Vận Chuyển trên UI;
-- không dùng lịch sử của một Order kết thúc để giả lập trạng thái hiện tại.
CREATE FUNCTION pg_temp.ui_uuid(status_no integer, entity_no integer)
RETURNS uuid
LANGUAGE sql
IMMUTABLE
STRICT
AS $$
  SELECT (
    '29' || lpad(status_no::text,6,'0') || '-' ||
    lpad(entity_no::text,4,'0') || '-7' ||
    lpad(entity_no::text,3,'0') || '-8' ||
    lpad(status_no::text,3,'0') || '-' ||
    lpad((status_no*10000+entity_no)::text,12,'0')
  )::uuid
$$;

CREATE TEMP TABLE ui_status_scenarios ON COMMIT DROP AS
SELECT s.sort_no AS status_no,s.status_code,s.status_name,
       (ARRAY[
         'Cửa hàng Gia dụng Minh Khang','Nhà sách Hương Đọc','Nội thất Mộc Nhiên',
         'Thời trang An Phúc','Mỹ phẩm Thiên Lam','Điện máy Hoàng Gia',
         'Mẹ và Bé Mộc Miên','Linh kiện Hưng Phát','Nông sản Xanh Miền Tây',
         'Đặc sản Nhà Làm Quê Việt','Phụ kiện Điện thoại Nhật Minh','Hoa tươi An Nhiên',
         'Giày dép Thanh Xuân','Đồ gia dụng Bếp Việt','Thực phẩm sạch Tâm An',
         'Đồ chơi Trẻ Thơ','Nội thất An Gia','Thời trang Hạ Vy',
         'Mỹ phẩm Hương Tràm','Sữa và Đồ dùng Bé Thơ','Vườn cây Cát Tường',
         'Cà phê Bình Minh','Thiết bị văn phòng Phúc Long','Đồ thể thao Thành Công',
         'Quà tặng Mộc Lan','Đồ dùng nhà bếp Hạnh Nguyên','Bách hóa Phương Nam',
         'Hạt giống Vườn Việt','Điện tử Sao Mai','Chăn ga Hoàng Anh',
         'Túi xách Ngọc Lan','Đồ da thủ công Mộc Lam','Văn phòng phẩm Thanh Hà',
         'Thời trang Gió Mới','Mẹ và Bé Mầm Xanh','Đặc sản Cốm Vòng',
         'Hoa Ban Mai','Đồ chơi Mặt Trời Nhỏ','Thiết bị âm thanh Minh Tân',
         'Đồ gia dụng Phúc Khang','Thực phẩm hữu cơ An Lành','Phụ kiện xe máy Hoàng Nam',
         'Nhà cửa và Đời sống Gia Hân','Đặc sản Việt','Quà quê Hương Việt'
       ]::text[])[s.sort_no] AS shop_name,
       (ARRAY[
         'Nguyễn Minh Anh','Trần Khánh An','Lê Hoàng Nam','Phạm Ngọc Hân','Đỗ Anh Khoa',
         'Võ Thùy Dương','Bùi Thanh Trúc','Hoàng Gia Bảo','Phan Minh Khang','Nguyễn Thảo Vy',
         'Trương Quốc Huy','Đặng Hải Yến','Hồ Ngọc Mai','Dương Tuấn Kiệt','Mai Phương Thảo',
         'Cao Nhật Minh','Lý Khánh Linh','Tạ Minh Quân','Nguyễn Gia Huy','Trần Ngọc Diệp',
         'Lê Đức Thành','Phạm Hoài Nam','Võ Minh Châu','Bùi Ngọc Anh','Hoàng Thùy Linh',
         'Phan Đức Anh','Đinh Khánh Toàn','Nguyễn Quỳnh Chi','Trần Anh Tuấn','Lê Phương Uyên',
         'Phạm Quốc Việt','Đỗ Ngọc Hà','Vũ Minh Nhật','Nguyễn Khánh Vy','Hoàng Anh Duy',
         'Trần Minh Khoa','Lê Khánh Linh','Phạm Gia Hân','Võ Quốc Bảo','Đặng Thu Trang',
         'Nguyễn Hoài Thương','Dương Anh Đức','Phan Ngọc Huyền','Lê Quang Huy','Hồ Minh Tâm'
       ]::text[])[s.sort_no] AS shop_contact_name,
       (ARRAY[
         'Nguyễn Hoàng Phúc','Trần Minh Châu','Lê Khánh Linh','Phạm Tuấn Anh','Đỗ Thùy Trang',
         'Võ Minh Nhật','Bùi Ngọc Mai','Hoàng Anh Duy','Phan Gia Hân','Nguyễn Đức Thành',
         'Trương Minh Quân','Đặng Phương Thảo','Hồ Quốc Bảo','Dương Ngọc Hà','Mai Hoàng Nam',
         'Cao Thanh Tùng','Lý Ngọc Anh','Tạ Hoài An','Nguyễn Quang Huy','Trần Thùy Dương',
         'Lê Minh Khoa','Phạm Khánh Vy','Võ Anh Tuấn','Bùi Hải Yến','Hoàng Minh Đức',
         'Phan Thảo Nguyên','Đinh Hoàng Long','Nguyễn Mai Chi','Trần Quốc Khánh','Lê Ngọc Diệp',
         'Phạm Minh Tâm','Đỗ Khánh Hòa','Vũ Anh Khoa','Nguyễn Hà My','Hoàng Ngọc Lan',
         'Trần Gia Bảo','Lê Minh Anh','Phạm Quốc Huy','Võ Thanh Hà','Đặng Minh Tuấn',
         'Nguyễn Phương Linh','Dương Quốc Anh','Phan Thùy Linh','Lê Thành Đạt','Hồ Ngọc Hân'
       ]::text[])[s.sort_no] AS receiver_name,
       (ARRAY[
         'Lê Thu Hà','Nguyễn Gia Huy','Trần Hoài Nam','Phạm Minh Quân','Đỗ Ngọc Anh',
         'Võ Thanh Tâm','Bùi Hoàng Yến','Hoàng Minh Khoa','Phan Ngọc Lan','Nguyễn Khánh Toàn',
         'Trương Hải Đăng','Đặng Minh Châu','Hồ Thanh Vân','Dương Hoài Phong','Mai Ngọc Hân',
         'Cao Phương Anh','Lý Minh Đức','Tạ Ngọc Diệp','Nguyễn Thanh Hà','Trần Gia Khánh',
         'Lê Hoàng Phúc','Phạm Ngọc Duy','Võ Khánh An','Bùi Quốc Huy','Hoàng Thùy Dương',
         'Phan Minh Anh','Đinh Ngọc Tâm','Nguyễn Đức Huy','Trần Phương Mai','Lê Hải Nam',
         'Phạm Thanh Bình','Đỗ Minh Khang','Vũ Ngọc Hạnh','Nguyễn Quốc Việt','Hoàng Gia Minh',
         'Trần Ngọc Bích','Lê Tuấn Anh','Phạm Hà My','Võ Minh Quân','Đặng Ngọc Mai',
         'Nguyễn Hoàng Anh','Dương Khánh Linh','Phan Minh Đức','Lê Thu Trang','Hồ Quốc Nam'
       ]::text[])[s.sort_no] AS return_contact_name,
       (ARRAY[
         'Bộ ly thủy tinh chịu nhiệt 350 ml','Bộ sản phẩm chăm sóc da trà xanh','Nồi chiên không dầu 6 lít',
         'Máy xay sinh tố đa năng 1,5 lít','Bộ ga giường cotton 1,6 m','Đèn bàn LED chống cận',
         'Bộ nồi inox ba món dùng cho bếp từ','Hộp trà ô long túi lọc 40 gói','Máy hút bụi cầm tay không dây',
         'Bộ hộp bảo quản thực phẩm thủy tinh','Bộ sách kỹ năng học tập','Giỏ hoa chúc mừng phối màu cam',
         'Bàn phím cơ không dây chống sốc','Túi đeo chéo da bò màu nâu','Máy hâm sữa điện tử kèm bình giữ nhiệt',
         'Áo khoác chống nắng sợi tre','Bánh kem sinh nhật vị vani','Bộ vi điều khiển Arduino Uno',
         'Máy sấy tóc ion âm','Bình giữ nhiệt inox 500 ml','Kệ sách gỗ lắp ráp 5 tầng','Kem chống nắng SPF50+',
         'Tai nghe Bluetooth chống ồn','Bộ khăn mặt cotton 6 chiếc','Cặp sách học sinh tiểu học',
         'Máy pha cà phê mini','Chảo chống dính đáy từ 28 cm','Đèn ngủ cảm biến ánh sáng','Bộ ga gối cotton 4 món',
         'Quạt mini để bàn','Giày thể thao nam cổ thấp','Túi tote canvas dáng đứng','Hạt giống rau củ trồng tại nhà',
         'Mật ong hoa cà phê 500 ml','Máy lọc không khí mini','Bình sữa em bé 240 ml','Bộ xếp hình gỗ cho bé',
         'Váy nữ linen cổ vuông','Cà phê rang xay nguyên chất 500 g','Set hộp cơm giữ nhiệt inox',
         'Camera an ninh IP trong nhà','Bộ tua vít sửa chữa 24 món','Nồi lẩu điện đa năng 3 lít',
         'Bộ hồ sơ giấy tờ hành chính','Bộ tài liệu văn phòng phẩm'
       ]::text[])[s.sort_no] AS product_name,
       substring(s.status_code,5,2)::integer AS phase_no,
       CASE
         WHEN s.status_code='SPF-0302' THEN 2
         WHEN substring(s.status_code,5,2)::integer <= 5 THEN 1
         WHEN substring(s.status_code,5,2)::integer <= 9 THEN 2
         WHEN substring(s.status_code,5,2)::integer = 10 THEN 3
         ELSE 4
       END AS leg_count,
       CASE
         WHEN s.status_code='SPF-0302' THEN 1
         WHEN substring(s.status_code,5,2)::integer <= 5 THEN 1
         WHEN substring(s.status_code,5,2)::integer <= 9 THEN 2
         WHEN substring(s.status_code,5,2)::integer = 10 THEN 3
         ELSE 4
       END AS current_leg_no,
       CASE
         WHEN s.status_code='SPF-0302' THEN 16
         ELSE (ARRAY[2,3,4,6,10,13])[(s.sort_no % 6)+1]
       END AS primary_carrier_code
  FROM order_statuses s
 WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.status_code=s.status_code)
 ORDER BY s.sort_no;

INSERT INTO orders (
  order_id,order_code,shop_id,soc,status_code,custodian_carrier_code,
  customer_model,transport_model,selection_mode,shipping_config_ref,
  shipping_config_version,configuration_decision_ref,pricing_code,cod_amount,
  collected_amount,cod_collection_status,settled_amount,cod_settlement_status,
  compensation_amount,compensation_status,inspection_type,fee_payer,pickup_method,
  service_codes,pickup_scheduled_from,pickup_scheduled_to,delivery_note,
  delivery_result,exchange_result,created_by_identity_id,created_by_membership_id,
  created_actor_type,created_actor_ref,created_actor_name,created_application_id,
  created_client_id,created_channel,correlation_id,version_no,created_at,updated_at,
  updated_by
)
SELECT pg_temp.ui_uuid(status_no,1),'92999999'||lpad(status_no::text,5,'0'),
       pg_temp.ui_uuid(status_no,2),'SOC-UI-'||status_code,status_code,
       CASE WHEN status_code LIKE 'SPF-11%' THEN 1 ELSE primary_carrier_code END,
       CASE WHEN status_code='SPF-0302' THEN 4 ELSE 2 END,
       CASE WHEN status_code='SPF-0302' THEN 4 WHEN leg_count>1 THEN 2 ELSE 3 END,
       CASE WHEN status_code='SPF-0302' THEN 2 ELSE 1 END,
       'SHP-CONFIG-UI-'||status_code,'1','CFG-UI-'||status_code,
       CASE WHEN status_code='SPF-0302' THEN 'PRC-HCM-GRAB-INSTANT-2026-09' ELSE 'PRC-UI-'||status_code END,
       CASE WHEN status_no%3=0 THEN 390000+status_no*1000 ELSE 0 END,
       CASE WHEN phase_no>=9 AND status_no%3=0 THEN 390000+status_no*1000 ELSE 0 END,
       CASE WHEN status_no%3<>0 THEN 1 WHEN phase_no>=9 THEN 3 ELSE 2 END,
       CASE WHEN phase_no>=12 AND status_no%3=0 THEN 390000+status_no*1000 ELSE 0 END,
       CASE WHEN status_no%3<>0 THEN 1 WHEN phase_no>=12 THEN 5 ELSE 2 END,
       0,
       CASE WHEN status_code IN ('SPF-1005','SPF-1107') THEN 2 ELSE 1 END,
       2,1,1,ARRAY[]::smallint[],
       '2026-09-22 01:00:00+00','2026-09-22 04:00:00+00',
       CASE WHEN status_code='SPF-0302' THEN 'Đơn hỏa tốc nội thành, đang chờ NVC phân bổ tài xế.' ELSE 'Dữ liệu kiểm thử giao diện cho '||status_name||'.' END,
       CASE WHEN status_code='SPF-0901' THEN 1 WHEN status_code='SPF-0902' THEN 2 ELSE 0 END,
       CASE WHEN status_code='SPF-1202' THEN 1 ELSE 0 END,
       'identity-ui-'||status_code,'membership-ui-'||status_code,1,
       'shop-user-ui-'||status_no,shop_name,
       CASE WHEN status_code='SPF-0302' THEN 'superai-web' ELSE 'supership-web' END,
       'web-order-ui','WEB','corr-ui-'||status_code,1,
       '2026-09-22 00:00:00+00'::timestamptz+status_no*interval '2 minutes',
       '2026-09-22 00:01:00+00'::timestamptz+status_no*interval '2 minutes',
       'ui-status-showcase'
  FROM ui_status_scenarios;

INSERT INTO order_addresses (
  address_id,order_id,address_type,address_model,source_type,source_code,source_name,
  address_detail,full_address,province_code,district_code,commune_code,latitude,
  longitude,valid_from,version_no,created_at,created_by
)
SELECT pg_temp.ui_uuid(s.status_no,10+a.address_type),pg_temp.ui_uuid(s.status_no,1),
       a.address_type,1,1,'ADR-UI-'||s.status_no||'-'||a.address_type,a.source_name,
       a.address_detail,a.full_address,'79','760',a.commune_code,a.latitude,a.longitude,
       '2026-09-22 00:00:00+00',1,'2026-09-22 00:00:00+00','ui-status-showcase'
  FROM ui_status_scenarios s
 CROSS JOIN (VALUES
   (1,'Kho gửi Quận 8','231/15 Dương Bá Trạc','231/15 Dương Bá Trạc, Phường 1, Quận 8, Thành phố Hồ Chí Minh','27301',10.7431000,106.6897000),
   (2,'Địa chỉ nhận Quận 1','120 Trần Hưng Đạo','120 Trần Hưng Đạo, Phường Cầu Ông Lãnh, Quận 1, Thành phố Hồ Chí Minh','26734',10.7653000,106.6941000),
   (3,'Điểm nhận hoàn Quận 3','48 Võ Văn Tần','48 Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí Minh','27139',10.7786000,106.6892000)
 ) AS a(address_type,source_name,address_detail,full_address,commune_code,latitude,longitude);

INSERT INTO order_parties (
  party_id,order_id,party_type,name,contact_name,phone,email,valid_from,version_no,
  created_at,created_by
)
SELECT pg_temp.ui_uuid(s.status_no,20+p.party_type),pg_temp.ui_uuid(s.status_no,1),
       p.party_type,
       CASE p.party_type WHEN 1 THEN s.shop_name WHEN 2 THEN s.receiver_name ELSE 'Kho nhận hoàn SuperShip' END,
       CASE p.party_type WHEN 1 THEN s.shop_contact_name WHEN 2 THEN s.receiver_name ELSE s.return_contact_name END,
       '09'||lpad((70000000+s.status_no*10+p.party_type)::text,8,'0'),
       'ui.'||s.status_no||'.'||p.party_type||'@example.com','2026-09-22 00:00:00+00',1,
       '2026-09-22 00:00:00+00','ui-status-showcase'
  FROM ui_status_scenarios s CROSS JOIN (VALUES (1),(2),(3)) AS p(party_type);

INSERT INTO order_goods (
  goods_id,order_id,content_type,product_name,declared_value,currency_code,tag_codes,
  valid_from,version_no,created_at,created_by
)
SELECT pg_temp.ui_uuid(status_no,31),pg_temp.ui_uuid(status_no,1),2,
       product_name,
       450000+status_no*1000,'VND',ARRAY[]::smallint[],
       '2026-09-22 00:00:00+00',1,'2026-09-22 00:00:00+00','ui-status-showcase'
  FROM ui_status_scenarios;

INSERT INTO order_items (
  item_id,order_id,goods_id,item_code,product_ref,sku,item_name,unit_price,
  unit_weight_g,quantity,created_at
)
SELECT pg_temp.ui_uuid(status_no,41),pg_temp.ui_uuid(status_no,1),
       pg_temp.ui_uuid(status_no,31),'ITEM-UI-'||status_no,'PRD-UI-'||status_no,
       'SKU-UI-'||status_no,
       product_name,
       450000+status_no*1000,650+status_no*10,1,'2026-09-22 00:00:00+00'
  FROM ui_status_scenarios;

INSERT INTO parcel_measures (
  measure_id,order_id,measure_kind,source_type,weight_g,length_cm,width_cm,height_cm,
  measured_at,source_ref,created_at
)
SELECT pg_temp.ui_uuid(status_no,51),pg_temp.ui_uuid(status_no,1),1,1,
       650+status_no*10,28,20,12,'2026-09-21 23:59:00+00',
       'SHOP-MEASURE-UI-'||status_no,'2026-09-22 00:00:00+00'
  FROM ui_status_scenarios;

CREATE TEMP TABLE ui_legs ON COMMIT DROP AS
SELECT s.*,g.leg_no,
       CASE
         WHEN s.status_code='SPF-0302' THEN 16
         WHEN g.leg_no=1 AND s.leg_count>1 THEN 1
         WHEN g.leg_no=2 THEN s.primary_carrier_code
         WHEN g.leg_no=4 AND s.status_code LIKE 'SPF-11%' THEN 1
         WHEN g.leg_no=3 THEN s.primary_carrier_code
         ELSE s.primary_carrier_code
       END AS carrier_code
  FROM ui_status_scenarios s
 CROSS JOIN LATERAL generate_series(1,s.leg_count) AS g(leg_no);

INSERT INTO order_legs (
  leg_id,order_id,stage_code,stage_no,leg_type,stage_status_code,carrier_code,
  carrier_client_code,started_at,completed_at,version_no,created_at,updated_at
)
SELECT pg_temp.ui_uuid(status_no,60+leg_no),pg_temp.ui_uuid(status_no,1),
       'STG-'||CASE leg_no WHEN 1 THEN 'PICKUP' WHEN 2 THEN 'DELIVERY' WHEN 3 THEN 'RETURN' ELSE 'FINAL-RETURN' END||'-0001',
       leg_no,leg_no,
       CASE WHEN leg_no<current_leg_no THEN 'COMPLETED' WHEN leg_no=current_leg_no THEN status_code ELSE 'PENDING' END,
       carrier_code,'CLIENT-UI-'||status_no||'-'||leg_no,
       CASE WHEN leg_no<=current_leg_no THEN '2026-09-22 00:10:00+00'::timestamptz+status_no*interval '2 minutes' END,
       CASE WHEN leg_no<current_leg_no THEN '2026-09-22 00:20:00+00'::timestamptz+status_no*interval '2 minutes' END,
       1,'2026-09-22 00:05:00+00','2026-09-22 00:30:00+00'
  FROM ui_legs;

UPDATE orders o
   SET current_leg_id=pg_temp.ui_uuid(s.status_no,60+s.current_leg_no)
  FROM ui_status_scenarios s
 WHERE o.order_id=pg_temp.ui_uuid(s.status_no,1);

INSERT INTO leg_endpoints (
  leg_endpoint_id,order_id,leg_id,endpoint_role,location_type,order_address_id,
  location_name,valid_from,version_no,created_at
)
SELECT pg_temp.ui_uuid(l.status_no,100+l.leg_no*2+e.endpoint_role),
       pg_temp.ui_uuid(l.status_no,1),pg_temp.ui_uuid(l.status_no,60+l.leg_no),
       e.endpoint_role,1,
       pg_temp.ui_uuid(l.status_no,
         CASE WHEN l.leg_no>=3 THEN CASE WHEN e.endpoint_role=1 THEN 12 ELSE 13 END
              ELSE CASE WHEN e.endpoint_role=1 THEN 11 ELSE 12 END END),
       CASE WHEN e.endpoint_role=1 THEN 'Điểm đầu chặng' ELSE 'Điểm cuối chặng' END,
       '2026-09-22 00:05:00+00',1,'2026-09-22 00:05:00+00'
  FROM ui_legs l CROSS JOIN (VALUES (1),(2)) AS e(endpoint_role);

INSERT INTO leg_items (order_id,leg_id,item_id,quantity,created_at)
SELECT pg_temp.ui_uuid(status_no,1),pg_temp.ui_uuid(status_no,60+leg_no),
       pg_temp.ui_uuid(status_no,41),1,'2026-09-22 00:05:00+00'
  FROM ui_legs;

INSERT INTO leg_services (
  leg_service_id,order_id,leg_id,carrier_code,service_code,service_name,
  fulfillment_mode,carrier_client_code,vehicle_type_code,policy_ref,policy_version,
  pricing_result_ref,carrier_fee_amount,shop_shipping_fee_amount,priced_at,
  valid_from,version_no,created_at
)
SELECT pg_temp.ui_uuid(status_no,70+leg_no),pg_temp.ui_uuid(status_no,1),
       pg_temp.ui_uuid(status_no,60+leg_no),carrier_code,
       CASE WHEN status_code='SPF-0302' THEN 'GRAB-INSTANT-BIKE' WHEN leg_no>=3 THEN 'RETURN-STANDARD' ELSE 'PARCEL-STANDARD' END,
       CASE WHEN status_code='SPF-0302' THEN 'GrabExpress giao hỏa tốc bằng xe máy' WHEN leg_no>=3 THEN 'Chuyển hoàn tiêu chuẩn' ELSE 'Giao bưu kiện tiêu chuẩn' END,
       CASE WHEN status_code='SPF-0302' THEN 2 ELSE 1 END,
       'CLIENT-UI-'||status_no||'-'||leg_no,
       CASE WHEN status_code='SPF-0302' THEN 'MOTORBIKE' END,
       CASE WHEN status_code='SPF-0302' THEN 'GRAB-INSTANT-HCM-2026' ELSE 'CARRIER-POLICY-UI-2026' END,
       '1','PRC-RESULT-UI-'||status_no||'-'||leg_no,18000+leg_no*4000,
       CASE WHEN status_code='SPF-0302' THEN 33000 ELSE 22000+leg_no*4500 END,
       '2026-09-22 00:06:00+00','2026-09-22 00:06:00+00',1,
       '2026-09-22 00:06:00+00'
  FROM ui_legs;

INSERT INTO order_requests (
  request_id,order_id,request_code,request_type,request_status,payload_version,
  request_payload,source_type,requested_by_actor_type,requested_by_actor_ref,
  requested_by_display_name,requested_at,result_code,completed_at,correlation_id,
  version_no,created_at,updated_at
)
SELECT pg_temp.ui_uuid(status_no,80),pg_temp.ui_uuid(status_no,1),
       'REQ-UI-'||status_code||'-CREATE','CREATE_WAYBILL',3,1,
       jsonb_build_object('carrier_code',primary_carrier_code,'status_showcase',status_code),
       5,3,'order-orchestrator','Tiến trình điều phối vận đơn',
       '2026-09-22 00:07:00+00','WAYBILL_CREATED','2026-09-22 00:08:00+00',
       'corr-ui-waybill-'||status_no,1,'2026-09-22 00:07:00+00','2026-09-22 00:08:00+00'
  FROM ui_status_scenarios;

CREATE TEMP TABLE ui_waybills ON COMMIT DROP AS
SELECT l.*,
       CASE l.carrier_code
         WHEN 1 THEN 'STGS'||lpad((900000+l.status_no)::text,6,'0')||'LM.'||lpad((820000000+l.status_no*10+l.leg_no)::text,9,'0')
         WHEN 2 THEN 'G'||lpad((1000000+l.status_no*10+l.leg_no)::text,7,'0')
         WHEN 3 THEN lpad((802900000000+l.status_no*10+l.leg_no)::text,12,'0')
         WHEN 4 THEN 'SOO'||lpad((10910000000+l.status_no*10+l.leg_no)::text,11,'0')
         WHEN 6 THEN lpad((999810000000000+l.status_no*10+l.leg_no)::text,15,'0')
         WHEN 10 THEN 'SPXVN'||lpad((661000000000+l.status_no*10+l.leg_no)::text,12,'0')
         WHEN 13 THEN 'CC'||lpad((2200000000+l.status_no*10+l.leg_no)::text,10,'0')||'VN'
         WHEN 16 THEN 'DELV-1708923451-A8B9C'
       END AS waybill_code,
       CASE l.carrier_code
         WHEN 2 THEN '100-A2-'||lpad(l.status_no::text,2,'0')||'-01'
         WHEN 3 THEN '470-'||lpad(l.status_no::text,3,'0')||'C33-'
         WHEN 6 THEN 'OO'||lpad(l.status_no::text,3,'0')||'-00-003-02'
         WHEN 10 THEN 'Q5-P8-'||lpad(l.status_no::text,2,'0')
         WHEN 16 THEN 'GRAB-HCM-01'
       END AS sorting_code
  FROM ui_legs l
 WHERE l.status_code<>'SPF-0302' OR l.leg_no=1;

INSERT INTO waybills (
  waybill_id,order_id,carrier_code,carrier_waybill_code,carrier_client_code,
  origin_request_id,sender_party_id,receiver_party_id,pickup_address_id,
  delivery_address_id,goods_id,measure_id,leg_service_id,pickup_method,fee_payer,
  inspection_type,cod_amount,collection_amount,declared_value,delivery_note,
  carrier_options,snapshot_schema_version,snapshot_hash,carrier_sorting_code,
  waybill_status,carrier_status_code,carrier_status_name,carrier_status_at,
  request_sent_at,carrier_accepted_at,created_at,updated_at
)
SELECT pg_temp.ui_uuid(status_no,90+leg_no),pg_temp.ui_uuid(status_no,1),
       carrier_code,waybill_code,'CLIENT-UI-'||status_no||'-'||leg_no,
       pg_temp.ui_uuid(status_no,80),
       pg_temp.ui_uuid(status_no,CASE WHEN leg_no>=3 THEN 22 ELSE 21 END),
       pg_temp.ui_uuid(status_no,CASE WHEN leg_no>=3 THEN 23 ELSE 22 END),
       pg_temp.ui_uuid(status_no,CASE WHEN leg_no>=3 THEN 12 ELSE 11 END),
       pg_temp.ui_uuid(status_no,CASE WHEN leg_no>=3 THEN 13 ELSE 12 END),
       pg_temp.ui_uuid(status_no,31),pg_temp.ui_uuid(status_no,51),
       pg_temp.ui_uuid(status_no,70+leg_no),1,1,2,
       CASE WHEN status_no%3=0 AND leg_no<3 THEN 390000+status_no*1000 ELSE 0 END,
       CASE WHEN status_no%3=0 AND leg_no<3 THEN 390000+status_no*1000 ELSE 0 END,
       450000+status_no*1000,'Dữ liệu Waybill phục vụ kiểm thử trạng thái UI.',
       '[]'::jsonb,1,encode(sha256(convert_to(waybill_code||':ui:v1','UTF8')),'hex'),
       sorting_code,1,status_code,status_name,
       '2026-09-22 00:30:00+00'::timestamptz+status_no*interval '2 minutes',
       '2026-09-22 00:07:00+00','2026-09-22 00:08:00+00',
       '2026-09-22 00:08:00+00','2026-09-22 00:30:00+00'
  FROM ui_waybills;

INSERT INTO leg_waybills (
  leg_waybill_id,order_id,leg_id,waybill_id,sequence_no,active_from,active_to,created_at
)
SELECT pg_temp.ui_uuid(l.status_no,140+l.leg_no),pg_temp.ui_uuid(l.status_no,1),
       pg_temp.ui_uuid(l.status_no,60+l.leg_no),
       pg_temp.ui_uuid(l.status_no,90+CASE WHEN l.status_code='SPF-0302' THEN 1 ELSE l.leg_no END),
       1,'2026-09-22 00:08:00+00',
       CASE WHEN l.leg_no<l.current_leg_no THEN '2026-09-22 00:20:00+00'::timestamptz END,
       '2026-09-22 00:08:00+00'
  FROM ui_legs l;

INSERT INTO request_targets (
  request_target_id,order_id,request_id,target_type,leg_id,created_at
)
SELECT pg_temp.ui_uuid(status_no,150),pg_temp.ui_uuid(status_no,1),
       pg_temp.ui_uuid(status_no,80),'LEG',pg_temp.ui_uuid(status_no,60+current_leg_no),
       '2026-09-22 00:07:00+00'
  FROM ui_status_scenarios;

INSERT INTO request_steps (
  request_step_id,order_id,request_id,request_target_id,step_no,step_type,
  step_status,carrier_code,result_waybill_id,correlation_id,external_ref,request_hash,
  result_code,attempt_count,started_at,completed_at,version_no,created_at,updated_at
)
SELECT pg_temp.ui_uuid(status_no,151),pg_temp.ui_uuid(status_no,1),
       pg_temp.ui_uuid(status_no,80),pg_temp.ui_uuid(status_no,150),1,
       'CREATE_WAYBILL','SUCCESS',primary_carrier_code,
       pg_temp.ui_uuid(status_no,90+CASE WHEN status_code='SPF-0302' THEN 1 ELSE current_leg_no END),
       'corr-ui-waybill-'||status_no,'CAR-BOOK-UI-'||status_no,
       md5(status_code||':ui:request:1')||md5(status_code||':ui:request:2'),
       'WAYBILL_CREATED',1,'2026-09-22 00:07:00+00','2026-09-22 00:08:00+00',1,
       '2026-09-22 00:07:00+00','2026-09-22 00:08:00+00'
  FROM ui_status_scenarios;

INSERT INTO tracking_events (
  event_id,order_id,leg_id,waybill_id,event_source,source_namespace,dedupe_key,
  source_module,source_event_ref,event_type,event_code,event_name,stage_status_code,
  carrier_status_code,carrier_status_name,reason_code,reason,province_code,
  province_name,occurred_at,received_at,order_sequence_no,leg_sequence_no,
  apply_result,created_at
)
SELECT pg_temp.ui_uuid(status_no,200),pg_temp.ui_uuid(status_no,1),
       pg_temp.ui_uuid(status_no,60+current_leg_no),
       pg_temp.ui_uuid(status_no,90+CASE WHEN status_code='SPF-0302' THEN 1 ELSE current_leg_no END),
       1,'UI-STATUS-SHOWCASE','UI-'||status_code,'CAR','UI-EVENT-'||status_code,
       'ORDER_STATUS',status_code,status_name,status_code,status_code,status_name,
       'UI_CURRENT_STATE','Sự kiện hiện tại phục vụ kiểm tra UI trạng thái '||status_name||'.',
       '79','Thành phố Hồ Chí Minh',
       '2026-09-22 00:30:00+00'::timestamptz+status_no*interval '2 minutes',
       '2026-09-22 00:30:05+00'::timestamptz+status_no*interval '2 minutes',
       1,1,1,'2026-09-22 00:30:05+00'::timestamptz+status_no*interval '2 minutes'
  FROM ui_status_scenarios;

INSERT INTO order_status_history (
  status_history_id,order_id,status_code,version_no,tracking_event_id,reason_code,
  reason,changed_by_actor_type,changed_by_actor_ref,changed_at,created_at
)
SELECT pg_temp.ui_uuid(status_no,300),pg_temp.ui_uuid(status_no,1),status_code,1,
       pg_temp.ui_uuid(status_no,200),'UI_CURRENT_STATE',
       'Snapshot hiện tại dùng để kiểm tra cách UI hiển thị '||status_name||'.',
       3,'ui-status-showcase',
       '2026-09-22 00:30:05+00'::timestamptz+status_no*interval '2 minutes',
       '2026-09-22 00:30:05+00'::timestamptz+status_no*interval '2 minutes'
  FROM ui_status_scenarios;

DO $$
DECLARE current_status_count integer;
BEGIN
  SELECT count(DISTINCT status_code) INTO current_status_count FROM orders;
  IF current_status_count <> 45 THEN
    RAISE EXCEPTION 'UI current-state coverage phải đủ 45 trạng thái, hiện có %',current_status_count;
  END IF;

  IF EXISTS (
    SELECT 1 FROM orders o
    WHERE o.status_code IN ('SPF-0302','SPF-0303')
      AND NOT EXISTS (
        SELECT 1 FROM order_legs l
        WHERE l.order_id=o.order_id AND l.carrier_code IN (15,16)
      )
  ) THEN
    RAISE EXCEPTION 'SPF-0302/SPF-0303 chỉ được seed cho NVC tức thời 15/16';
  END IF;
END
$$;

COMMIT;

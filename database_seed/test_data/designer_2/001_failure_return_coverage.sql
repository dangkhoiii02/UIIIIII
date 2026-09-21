\set ON_ERROR_STOP on
BEGIN;
SET LOCAL search_path TO order_mgmt, public;

-- D2 coverage: các workflow lỗi, retry, hủy, chuyển hoàn và đổi trả.
-- UUID bắt đầu bằng 2, version nibble 7; toàn bộ timestamp là UTC cố định.
CREATE FUNCTION pg_temp.seed_uuid(scenario_no integer, entity_no integer)
RETURNS uuid
LANGUAGE sql
IMMUTABLE
STRICT
AS $$
    SELECT (
        '2' || lpad(scenario_no::text, 7, '0') || '-' ||
        lpad(entity_no::text, 4, '0') || '-7' ||
        lpad(entity_no::text, 3, '0') || '-8' ||
        lpad(scenario_no::text, 3, '0') || '-' ||
        lpad((scenario_no * 1000 + entity_no)::text, 12, '0')
    )::uuid
$$;

CREATE TEMP TABLE seed_scenarios (
    scenario_no integer PRIMARY KEY,
    order_code varchar(13) NOT NULL,
    soc varchar(100) NOT NULL,
    title text NOT NULL,
    final_status varchar(20) NOT NULL,
    status_path varchar(20)[] NOT NULL,
    leg_count integer NOT NULL,
    carrier_codes integer[] NOT NULL,
    sender_name varchar(200) NOT NULL,
    receiver_name varchar(200) NOT NULL,
    product_name varchar(200) NOT NULL,
    declared_value bigint NOT NULL,
    cod_amount bigint NOT NULL
) ON COMMIT DROP;

-- Với đơn 4 chặng, carrier_codes theo thứ tự PICKUP, DELIVERY, RETURN, FINAL-RETURN.
-- Scenario 5 là ngoại lệ SPS lấy hàng và trả cuối; scenario 6/7 dùng NVC giao cho toàn bộ chặng hoàn.
INSERT INTO seed_scenarios VALUES
(1,'9209190000001','SOC-260919-BOOKING-FAIL','NVC từ chối tạo vận đơn','SPF-0102',ARRAY['SPF-0101','SPF-0102'],1,ARRAY[4],'Cửa hàng Đồ gia dụng An Nhiên','Nguyễn Hoài Thương','Bộ hộp bảo quản thực phẩm thủy tinh',468000,0),
(2,'9209190000002','SOC-260919-CANCEL-RETRY','Hủy lần đầu lỗi và retry thành công','SPF-0201',ARRAY['SPF-0101','SPF-0301','SPF-0202','SPF-0201'],1,ARRAY[13],'Nhà sách Mây Trắng','Trần Đức Thành','Bộ sách kỹ năng học tập',325000,0),
(3,'9209190000003','SOC-260919-DRIVER-NOT-FOUND','Green SM Express không tìm được tài xế hỏa tốc sau thời gian allocation','SPF-0303',ARRAY['SPF-0101','SPF-0302','SPF-0303'],2,ARRAY[15,15],'Tiệm hoa Ban Mai','Lê Khánh Linh','Giỏ hoa chúc mừng phối màu cam',650000,650000),
(4,'9209190000004','SOC-260919-PICKUP-HANDOVER','Retry lấy hàng, bàn giao và giao lại thành công','SPF-0901',ARRAY['SPF-0101','SPF-0301','SPF-0401','SPF-0402','SPF-0403','SPF-0401','SPF-0501','SPF-0502','SPF-0601','SPF-0602','SPF-0603','SPF-0604','SPF-0602','SPF-0605','SPF-0606','SPF-0701','SPF-0702','SPF-0801','SPF-0802','SPF-0803','SPF-0801','SPF-0901'],2,ARRAY[1,3],'Cửa hàng Thiết bị Minh Quang','Phạm Ngọc Hân','Bàn phím cơ không dây chống sốc',1390000,1390000),
(5,'9209190000005','SOC-260919-RETURN-SUCCESS','Chuyển hoàn qua điểm trung gian thành công','SPF-1201',ARRAY['SPF-0101','SPF-0301','SPF-0401','SPF-0501','SPF-0701','SPF-0801','SPF-0802','SPF-1001','SPF-1002','SPF-1003','SPF-1004','SPF-1007','SPF-1008','SPF-1009','SPF-1101','SPF-1102','SPF-1104','SPF-1105','SPF-1106','SPF-1201'],4,ARRAY[1,2,6,1],'Xưởng Da thủ công Mộc Lam','Vũ Minh Nhật','Túi đeo chéo da bò màu nâu',1780000,1780000),
(6,'9209190000006','SOC-260919-RETURN-RETRY','Lấy hoàn và trả hàng thất bại rồi retry','SPF-1203',ARRAY['SPF-0101','SPF-0301','SPF-0401','SPF-0501','SPF-0701','SPF-0801','SPF-0802','SPF-1001','SPF-1002','SPF-1003','SPF-1004','SPF-1005','SPF-1006','SPF-1004','SPF-1007','SPF-1008','SPF-1009','SPF-1101','SPF-1102','SPF-1103','SPF-1102','SPF-1104','SPF-1105','SPF-1106','SPF-1107','SPF-1108','SPF-1106','SPF-1203'],4,ARRAY[10,10,10,10],'Cửa hàng Mẹ và Bé Mầm Xanh','Đỗ Anh Khoa','Máy hâm sữa điện tử kèm bình giữ nhiệt',1120000,1120000),
(7,'9209190000007','SOC-260919-EXCHANGE','Đổi hàng theo hướng dẫn hoàn tất','SPF-1202',ARRAY['SPF-0101','SPF-0301','SPF-0401','SPF-0501','SPF-0701','SPF-0801','SPF-0901','SPF-1003','SPF-1004','SPF-1007','SPF-1008','SPF-1009','SPF-1105','SPF-1106','SPF-1202'],4,ARRAY[3,3,3,3],'Cửa hàng Thời trang Gió Mới','Bùi Thanh Trúc','Áo khoác chống nắng sợi tre',590000,120000);

INSERT INTO orders (
    order_id,order_code,shop_id,soc,status_code,customer_model,transport_model,
    selection_mode,shipping_config_ref,shipping_config_version,
    configuration_decision_ref,pricing_code,cod_amount,inspection_type,fee_payer,
    pickup_method,service_codes,pickup_scheduled_from,pickup_scheduled_to,
    delivery_note,delivery_result,exchange_result,created_by_identity_id,
    created_by_membership_id,created_actor_type,created_actor_ref,
    created_actor_name,created_application_id,created_client_id,created_channel,
    correlation_id,version_no,created_at,updated_at,updated_by
)
SELECT pg_temp.seed_uuid(scenario_no,1),order_code,pg_temp.seed_uuid(scenario_no,2),soc,
       final_status,CASE WHEN scenario_no=3 THEN 4 WHEN leg_count=1 THEN 3 ELSE 2 END,
       CASE WHEN scenario_no=3 THEN 4 WHEN leg_count=1 THEN 3 ELSE 2 END,
       CASE WHEN scenario_no=3 THEN 2 ELSE 1 END,
       'SHP-CONFIG-'||order_code,'12','CFG-DECISION-'||order_code,
       CASE WHEN scenario_no=3 THEN 'PRC-HCM-GREEN-SM-INSTANT-2026-09' ELSE 'PRC-ORDER-2026-09' END,
       cod_amount,2,1,1,ARRAY[]::smallint[],
       '2026-09-20 01:00:00+00','2026-09-20 04:00:00+00',
       CASE scenario_no WHEN 4 THEN 'Kiện điện tử chống sốc, không xếp dưới hàng nặng.'
                        WHEN 7 THEN 'Thu sản phẩm cũ nguyên phụ kiện khi giao sản phẩm đổi.'
                        ELSE 'Gọi người nhận trước khi giao hoặc hoàn hàng.' END,
       CASE WHEN final_status='SPF-0901' THEN 1 WHEN final_status='SPF-1203' THEN 2 ELSE 0 END,
       CASE WHEN final_status='SPF-1202' THEN 1 ELSE 0 END,
       'identity-d2-'||lpad(scenario_no::text,2,'0'),
       'membership-d2-'||lpad(scenario_no::text,2,'0'),1,
       'shop-user-d2-'||lpad(scenario_no::text,2,'0'),sender_name,
       'supership-web','web-order-d2','WEB','corr-d2-'||order_code,
       cardinality(status_path),'2026-09-19 23:30:00+00',
       '2026-09-21 18:00:00+00','order-workflow'
  FROM seed_scenarios;

INSERT INTO order_addresses (
    address_id,order_id,address_type,address_model,source_type,source_code,source_name,
    address_detail,full_address,province_code,district_code,commune_code,
    latitude,longitude,valid_from,version_no,created_at,created_by
)
SELECT pg_temp.seed_uuid(s.scenario_no,10+a.address_type),pg_temp.seed_uuid(s.scenario_no,1),
       a.address_type,a.address_model,a.source_type,
       'ADR-D2-'||s.scenario_no||'-'||a.address_type,a.source_name,a.address_detail,
       a.full_address,a.province_code,a.district_code,a.commune_code,
       a.latitude,a.longitude,'2026-09-19 23:30:00+00',1,
       '2026-09-19 23:30:00+00','order-api'
  FROM seed_scenarios s
 CROSS JOIN (VALUES
   (1,1,2,'Điểm lấy hàng Quận 3','Số 48 đường Võ Văn Tần','Số 48 đường Võ Văn Tần, phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí Minh','79','770','27139',10.7786400,106.6892400),
   (2,2,1,'Địa chỉ giao hàng Cầu Giấy','Tầng 5, số 82 phố Duy Tân','Tầng 5, số 82 phố Duy Tân, phường Cầu Giấy, Thành phố Hà Nội','P01',NULL,'P01C00031',21.0302500,105.7826100),
   (3,1,1,'Điểm nhận hàng hoàn Tân Bình','Số 19 đường Cộng Hòa','Số 19 đường Cộng Hòa, phường 4, quận Tân Bình, Thành phố Hồ Chí Minh','79','766','26995',10.8007800,106.6589700)
 ) AS a(address_type,address_model,source_type,source_name,address_detail,full_address,province_code,district_code,commune_code,latitude,longitude);

INSERT INTO order_parties (
    party_id,order_id,party_type,name,contact_name,phone,email,valid_from,version_no,created_at,created_by
)
SELECT pg_temp.seed_uuid(s.scenario_no,20+p.party_type),pg_temp.seed_uuid(s.scenario_no,1),p.party_type,
       CASE p.party_type WHEN 1 THEN s.sender_name WHEN 2 THEN s.receiver_name ELSE 'Kho nhận hoàn SuperShip' END,
       CASE p.party_type WHEN 1 THEN s.sender_name WHEN 2 THEN s.receiver_name ELSE 'Nguyễn Gia Huy' END,
       '0911'||lpad((s.scenario_no*10+p.party_type)::text,6,'0'),
       'd2.'||s.scenario_no||'.'||p.party_type||'@example.com',
       '2026-09-19 23:30:00+00',1,'2026-09-19 23:30:00+00','order-api'
  FROM seed_scenarios s CROSS JOIN (VALUES (1),(2),(3)) AS p(party_type);

INSERT INTO order_goods (
    goods_id,order_id,content_type,product_name,declared_value,currency_code,tag_codes,
    valid_from,version_no,created_at,created_by
)
SELECT pg_temp.seed_uuid(scenario_no,31),pg_temp.seed_uuid(scenario_no,1),2,product_name,
       declared_value,'VND',
       CASE scenario_no WHEN 4 THEN ARRAY[1,4]::smallint[] WHEN 5 THEN ARRAY[3]::smallint[] ELSE ARRAY[]::smallint[] END,
       '2026-09-19 23:30:00+00',1,'2026-09-19 23:30:00+00','order-api'
  FROM seed_scenarios;

INSERT INTO order_items (
    item_id,order_id,goods_id,item_code,product_ref,sku,item_name,unit_price,unit_weight_g,quantity,created_at
)
SELECT pg_temp.seed_uuid(scenario_no,41),pg_temp.seed_uuid(scenario_no,1),pg_temp.seed_uuid(scenario_no,31),
       'ITEM-D2-'||lpad(scenario_no::text,2,'0')||'-01','PRD-D2-'||lpad(scenario_no::text,2,'0'),
       'SKU-D2-'||lpad(scenario_no::text,2,'0'),product_name,declared_value,
       450+scenario_no*70,CASE WHEN scenario_no IN (6,7) THEN 2 ELSE 1 END,'2026-09-19 23:30:00+00'
  FROM seed_scenarios;

INSERT INTO parcel_measures (
    measure_id,order_id,measure_kind,source_type,weight_g,length_cm,width_cm,height_cm,measured_at,source_ref,created_at
)
SELECT pg_temp.seed_uuid(scenario_no,51),pg_temp.seed_uuid(scenario_no,1),1,1,
       620+scenario_no*90,24+scenario_no,18+scenario_no,10+scenario_no,
       '2026-09-19 23:25:00+00','SHOP-MEASURE-D2-'||scenario_no,'2026-09-19 23:30:00+00'
  FROM seed_scenarios;

INSERT INTO order_legs (
    leg_id,order_id,stage_code,stage_no,leg_type,stage_status_code,carrier_code,
    carrier_client_code,started_at,completed_at,version_no,created_at,updated_at
)
SELECT pg_temp.seed_uuid(s.scenario_no,60+g.leg_no),pg_temp.seed_uuid(s.scenario_no,1),
       'STG-'||CASE g.leg_no
           WHEN 1 THEN 'PICKUP'
           WHEN 2 THEN 'DELIVERY'
           WHEN 3 THEN 'RETURN'
           WHEN 4 THEN 'FINAL-RETURN'
       END||'-0001',g.leg_no,g.leg_no,
       CASE
         WHEN s.scenario_no=3 AND g.leg_no=1 THEN 'SPF-0303'
         WHEN s.scenario_no=3 THEN 'PENDING'
         WHEN s.final_status IN ('SPF-0102','SPF-0201') THEN s.final_status
         ELSE 'COMPLETED'
       END,
       s.carrier_codes[g.leg_no],
       'CLIENT-D2-'||s.scenario_no||'-'||g.leg_no,
       CASE WHEN s.final_status IN ('SPF-0102','SPF-0303') THEN NULL ELSE '2026-09-20 01:00:00+00'::timestamptz END,
       CASE WHEN s.final_status IN ('SPF-0102','SPF-0303') THEN NULL ELSE '2026-09-21 17:30:00+00'::timestamptz END,
       1,'2026-09-19 23:35:00+00','2026-09-21 18:00:00+00'
  FROM seed_scenarios s
 CROSS JOIN LATERAL generate_series(1,s.leg_count) AS g(leg_no);

UPDATE orders o
   SET current_leg_id=pg_temp.seed_uuid(s.scenario_no,CASE WHEN s.scenario_no=3 THEN 61 ELSE 60+s.leg_count END),
       custodian_carrier_code=CASE WHEN s.final_status IN ('SPF-0102','SPF-0201','SPF-0303','SPF-0901','SPF-1201','SPF-1202','SPF-1203') THEN NULL ELSE s.carrier_codes[s.leg_count] END
  FROM seed_scenarios s
 WHERE o.order_id=pg_temp.seed_uuid(s.scenario_no,1);

INSERT INTO leg_endpoints (
    leg_endpoint_id,order_id,leg_id,endpoint_role,location_type,order_address_id,
    source_module,source_code,location_name,address_model,address_detail,full_address,
    province_code,district_code,commune_code,latitude,longitude,valid_from,version_no,created_at
)
SELECT pg_temp.seed_uuid(s.scenario_no,100+g.leg_no*2+r.endpoint_role),
       pg_temp.seed_uuid(s.scenario_no,1),pg_temp.seed_uuid(s.scenario_no,60+g.leg_no),
       r.endpoint_role,1,
       pg_temp.seed_uuid(s.scenario_no,CASE WHEN r.endpoint_role=1 THEN CASE WHEN g.leg_no>=3 THEN 12 ELSE 11 END ELSE CASE WHEN g.leg_no>=3 THEN 13 ELSE 12 END END),
       'ORD','ENDPOINT-D2-'||s.scenario_no||'-'||g.leg_no||'-'||r.endpoint_role,
       CASE WHEN r.endpoint_role=1 THEN 'Điểm bắt đầu chặng' ELSE 'Điểm kết thúc chặng' END,
       CASE WHEN (r.endpoint_role=1 AND g.leg_no<3) THEN 1 WHEN (r.endpoint_role=2 AND g.leg_no>=3) THEN 1 ELSE 2 END,
       CASE WHEN (r.endpoint_role=1 AND g.leg_no<3) OR (r.endpoint_role=2 AND g.leg_no>=3) THEN 'Số 48 đường Võ Văn Tần' ELSE 'Tầng 5, số 82 phố Duy Tân' END,
       CASE WHEN (r.endpoint_role=1 AND g.leg_no<3) OR (r.endpoint_role=2 AND g.leg_no>=3) THEN 'Số 48 đường Võ Văn Tần, phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí Minh' ELSE 'Tầng 5, số 82 phố Duy Tân, phường Cầu Giấy, Thành phố Hà Nội' END,
       CASE WHEN (r.endpoint_role=1 AND g.leg_no<3) OR (r.endpoint_role=2 AND g.leg_no>=3) THEN '79' ELSE 'P01' END,
       CASE WHEN (r.endpoint_role=1 AND g.leg_no<3) OR (r.endpoint_role=2 AND g.leg_no>=3) THEN '770' ELSE NULL END,
       CASE WHEN (r.endpoint_role=1 AND g.leg_no<3) OR (r.endpoint_role=2 AND g.leg_no>=3) THEN '27139' ELSE 'P01C00031' END,
       CASE WHEN (r.endpoint_role=1 AND g.leg_no<3) OR (r.endpoint_role=2 AND g.leg_no>=3) THEN 10.7786400 ELSE 21.0302500 END,
       CASE WHEN (r.endpoint_role=1 AND g.leg_no<3) OR (r.endpoint_role=2 AND g.leg_no>=3) THEN 106.6892400 ELSE 105.7826100 END,
       '2026-09-19 23:35:00+00',1,'2026-09-19 23:35:00+00'
  FROM seed_scenarios s
 CROSS JOIN LATERAL generate_series(1,s.leg_count) AS g(leg_no)
 CROSS JOIN (VALUES (1),(2)) AS r(endpoint_role);

INSERT INTO leg_items (order_id,leg_id,item_id,quantity,created_at)
SELECT pg_temp.seed_uuid(s.scenario_no,1),pg_temp.seed_uuid(s.scenario_no,60+g.leg_no),
       pg_temp.seed_uuid(s.scenario_no,41),CASE WHEN s.scenario_no IN (6,7) THEN 2 ELSE 1 END,
       '2026-09-19 23:35:00+00'
  FROM seed_scenarios s CROSS JOIN LATERAL generate_series(1,s.leg_count) AS g(leg_no);

INSERT INTO leg_services (
    leg_service_id,order_id,leg_id,carrier_code,service_code,service_name,fulfillment_mode,
    carrier_client_code,policy_ref,policy_version,pricing_result_ref,carrier_fee_amount,
    shop_shipping_fee_amount,priced_at,valid_from,version_no,created_at
)
SELECT pg_temp.seed_uuid(s.scenario_no,70+g.leg_no),pg_temp.seed_uuid(s.scenario_no,1),
       pg_temp.seed_uuid(s.scenario_no,60+g.leg_no),s.carrier_codes[g.leg_no],
       CASE WHEN s.scenario_no=3 THEN 'GSM-INSTANT-BIKE' WHEN g.leg_no>=3 THEN 'RETURN-STANDARD' ELSE 'PARCEL-STANDARD' END,
       CASE WHEN s.scenario_no=3 THEN 'Green SM Express giao hỏa tốc bằng xe máy điện' WHEN g.leg_no>=3 THEN 'Chuyển hoàn tiêu chuẩn' ELSE 'Giao bưu kiện tiêu chuẩn' END,
       CASE WHEN s.scenario_no=3 THEN 2 ELSE 1 END,'CLIENT-D2-'||s.scenario_no||'-'||g.leg_no,
       CASE WHEN s.scenario_no=3 THEN 'GSM-INSTANT-HCM-2026' ELSE 'CARRIER-POLICY-2026' END,'3',
       'PRC-D2-'||s.scenario_no||'-'||g.leg_no,18000+g.leg_no*3500,22000+g.leg_no*4000,
       '2026-09-19 23:36:00+00','2026-09-19 23:36:00+00',1,'2026-09-19 23:36:00+00'
  FROM seed_scenarios s CROSS JOIN LATERAL generate_series(1,s.leg_count) AS g(leg_no);

INSERT INTO order_requests (
    request_id,order_id,request_code,request_type,request_status,payload_version,
    request_payload,source_type,requested_by_actor_type,requested_by_actor_ref,
    requested_by_display_name,requested_at,result_code,result_reason_code,result_reason,
    completed_at,correlation_id,version_no,created_at,updated_at
)
SELECT pg_temp.seed_uuid(scenario_no,80),pg_temp.seed_uuid(scenario_no,1),
       'REQ-D2-'||scenario_no||'-BOOK','WAYBILL_BOOKING',
       CASE WHEN scenario_no=1 THEN 4 ELSE 3 END,1,
       jsonb_build_object('carrier_code',carrier_codes[1],'scenario',title),5,3,
       'order-orchestrator','Tiến trình điều phối vận đơn','2026-09-19 23:40:00+00',
       CASE WHEN scenario_no=1 THEN NULL ELSE 'ACCEPTED' END,
       CASE WHEN scenario_no=1 THEN 'CARRIER_SERVICE_UNAVAILABLE' END,
       CASE WHEN scenario_no=1 THEN 'NVC tạm ngừng nhận đơn tại khu vực lấy hàng.' END,
       '2026-09-19 23:55:00+00','corr-d2-book-'||scenario_no,1,
       '2026-09-19 23:40:00+00','2026-09-19 23:55:00+00'
  FROM seed_scenarios;

CREATE TEMP TABLE seed_waybills (
    scenario_no integer, leg_no integer, carrier_code integer,
    waybill_code varchar(150), sorting_code varchar(100)
) ON COMMIT DROP;

INSERT INTO seed_waybills VALUES
(2,1,13,'CP2199034124VN',NULL),
(3,1,15,'GSM-EXP-20260920-000003','GSM-HCM-01'),(3,2,15,'GSM-EXP-20260920-000003-D','GSM-HCM-01'),
(4,1,1,'STGS983263RT.826941742',NULL),(4,2,3,'802808938572','471-025D34-'),
(5,1,1,'STGS983266RT.826941745',NULL),(5,2,2,'N8P4R6TZ','101-B3-10-01'),(5,3,6,'999800060099892','OO013-01-004-03'),(5,4,1,'STGS983264RT.826941743',NULL),
(6,1,10,'SPXVN066263841280','Q5-P8-03'),(6,2,10,'SPXVN066263841281',NULL),(6,3,10,'SPXVN066263841282',NULL),(6,4,10,'SPXVN066263841283',NULL),
(7,1,3,'802808938573',NULL),(7,2,3,'802808938574',NULL),(7,3,3,'802808938575',NULL),(7,4,3,'802808938576',NULL);

INSERT INTO waybills (
    waybill_id,order_id,carrier_code,carrier_waybill_code,carrier_client_code,
    origin_request_id,sender_party_id,receiver_party_id,pickup_address_id,
    delivery_address_id,goods_id,measure_id,leg_service_id,pickup_method,fee_payer,
    inspection_type,cod_amount,collection_amount,declared_value,delivery_note,
    carrier_options,snapshot_schema_version,snapshot_hash,carrier_sorting_code,
    waybill_status,request_sent_at,carrier_accepted_at,created_at,ended_at,updated_at
)
SELECT pg_temp.seed_uuid(w.scenario_no,90+w.leg_no),pg_temp.seed_uuid(w.scenario_no,1),
       w.carrier_code,w.waybill_code,'CLIENT-D2-'||w.scenario_no||'-'||w.leg_no,
       CASE WHEN w.leg_no=1 THEN pg_temp.seed_uuid(w.scenario_no,80) ELSE NULL END,
       pg_temp.seed_uuid(w.scenario_no,CASE WHEN w.leg_no>=3 THEN 22 ELSE 21 END),
       pg_temp.seed_uuid(w.scenario_no,CASE WHEN w.leg_no>=3 THEN 23 ELSE 22 END),
       pg_temp.seed_uuid(w.scenario_no,CASE WHEN w.leg_no>=3 THEN 12 ELSE 11 END),
       pg_temp.seed_uuid(w.scenario_no,CASE WHEN w.leg_no>=3 THEN 13 ELSE 12 END),
       pg_temp.seed_uuid(w.scenario_no,31),pg_temp.seed_uuid(w.scenario_no,51),
       pg_temp.seed_uuid(w.scenario_no,70+w.leg_no),1,1,2,
       CASE WHEN w.leg_no>=3 THEN 0 ELSE s.cod_amount END,
       CASE WHEN w.leg_no>=3 THEN 0 ELSE s.cod_amount END,
       s.declared_value,'Gọi người liên hệ trước khi đến điểm nhận.',
       '[]'::jsonb,1,encode(sha256(convert_to(w.waybill_code||':snapshot:v1','UTF8')),'hex'),
       w.sorting_code,CASE WHEN w.scenario_no=2 THEN 4 WHEN w.scenario_no=3 THEN 1 ELSE 2 END,
       '2026-09-19 23:41:00+00','2026-09-19 23:42:00+00','2026-09-19 23:42:00+00',
       CASE WHEN w.scenario_no=3 THEN NULL ELSE '2026-09-21 17:30:00+00'::timestamptz END,
       '2026-09-21 18:00:00+00'
  FROM seed_waybills w JOIN seed_scenarios s USING (scenario_no);

INSERT INTO leg_waybills (leg_waybill_id,order_id,leg_id,waybill_id,sequence_no,active_from,active_to,created_at)
SELECT pg_temp.seed_uuid(scenario_no,140+leg_no),pg_temp.seed_uuid(scenario_no,1),
       pg_temp.seed_uuid(scenario_no,60+leg_no),pg_temp.seed_uuid(scenario_no,90+leg_no),1,
       '2026-09-19 23:42:00+00','2026-09-21 17:30:00+00','2026-09-19 23:42:00+00'
  FROM seed_waybills;

INSERT INTO request_steps (
    request_step_id,order_id,request_id,step_no,step_type,step_status,carrier_code,
    result_waybill_id,correlation_id,external_ref,request_hash,result_code,attempt_count,
    started_at,completed_at,version_no,created_at,updated_at,last_error_code,last_error
)
SELECT pg_temp.seed_uuid(s.scenario_no,150),pg_temp.seed_uuid(s.scenario_no,1),
       pg_temp.seed_uuid(s.scenario_no,80),1,'CREATE_WAYBILL',
       CASE WHEN s.scenario_no=1 THEN 'FAILED'::request_step_status ELSE 'SUCCESS'::request_step_status END,
       s.carrier_codes[1],CASE WHEN s.scenario_no=1 THEN NULL ELSE pg_temp.seed_uuid(s.scenario_no,91) END,
       'corr-d2-book-'||s.scenario_no,'CAR-BOOK-D2-'||s.scenario_no,
       md5(s.order_code||':request:1')||md5(s.order_code||':request:2'),
       CASE WHEN s.scenario_no=1 THEN NULL ELSE 'WAYBILL_CREATED' END,1,
       '2026-09-19 23:40:00+00','2026-09-19 23:55:00+00',
       1,'2026-09-19 23:40:00+00','2026-09-19 23:55:00+00',
       CASE WHEN s.scenario_no=1 THEN 'CARRIER_SERVICE_UNAVAILABLE' END,
       CASE WHEN s.scenario_no=1 THEN 'NVC từ chối nhận đơn tại thời điểm booking.' END
  FROM seed_scenarios s;

-- SPF-0303 chỉ dùng cho NVC tức thời: booking/Waybill đã thành công nhưng bước
-- phân bổ tài xế của Green SM Express thất bại sau khi hết thời gian retry.
INSERT INTO order_requests (
    request_id,order_id,request_code,request_type,request_status,payload_version,
    request_payload,reason_code,reason,source_type,requested_by_actor_type,
    requested_by_actor_ref,requested_by_display_name,requested_at,result_reason_code,
    result_reason,completed_at,correlation_id,version_no,created_at,updated_at
) VALUES (
    pg_temp.seed_uuid(3,151),pg_temp.seed_uuid(3,1),'REQ-D2-03-ALLOCATE-DRIVER',
    'ALLOCATE_DRIVER',4,1,
    '{"carrier_code":15,"delivery_model":"INSTANT","max_allocation_attempts":3}'::jsonb,
    'DRIVER_ALLOCATION_REQUIRED','Waybill hỏa tốc đã được tạo và đang cần tài xế.',
    5,3,'order-orchestrator','Tiến trình điều phối tài xế',
    '2026-09-20 00:35:00+00','DRIVER_ALLOCATION_EXHAUSTED',
    'Green SM Express không tìm được tài xế sau ba lần phân bổ.',
    '2026-09-20 01:30:00+00','corr-d2-driver-allocation-3',1,
    '2026-09-20 00:35:00+00','2026-09-20 01:30:00+00'
);

INSERT INTO request_targets (
    request_target_id,order_id,request_id,target_type,leg_id,created_at
) VALUES (
    pg_temp.seed_uuid(3,152),pg_temp.seed_uuid(3,1),pg_temp.seed_uuid(3,151),
    'LEG',pg_temp.seed_uuid(3,61),'2026-09-20 00:35:00+00'
);

INSERT INTO request_steps (
    request_step_id,order_id,request_id,request_target_id,step_no,step_type,
    step_status,carrier_code,correlation_id,external_ref,request_hash,result_code,
    attempt_count,last_error_code,last_error,started_at,completed_at,version_no,
    created_at,updated_at
) VALUES (
    pg_temp.seed_uuid(3,153),pg_temp.seed_uuid(3,1),pg_temp.seed_uuid(3,151),
    pg_temp.seed_uuid(3,152),1,'ALLOCATE_DRIVER','FAILED',15,
    'corr-d2-driver-allocation-3','GSM-ALLOCATE-20260920-000003',
    md5('9209190000003:allocate:1')||md5('9209190000003:allocate:2'),
    NULL,3,'DRIVER_ALLOCATION_EXHAUSTED',
    'Không tìm được tài xế hỏa tốc sau ba lần phân bổ.',
    '2026-09-20 00:35:00+00','2026-09-20 01:30:00+00',1,
    '2026-09-20 00:35:00+00','2026-09-20 01:30:00+00'
);

WITH expanded AS (
    SELECT s.scenario_no,s.status_path,u.status_code,u.ord::integer,
           CASE
             WHEN substring(u.status_code,5,2)::integer <= 5 THEN 1
             WHEN substring(u.status_code,5,2)::integer <= 9 THEN least(2,s.leg_count)
             WHEN substring(u.status_code,5,2)::integer = 10 THEN least(3,s.leg_count)
             ELSE least(4,s.leg_count)
           END AS leg_no
      FROM seed_scenarios s
     CROSS JOIN LATERAL unnest(s.status_path) WITH ORDINALITY AS u(status_code,ord)
), sequenced AS (
    SELECT e.*,row_number() OVER (PARTITION BY scenario_no,leg_no ORDER BY ord)::integer AS leg_seq
      FROM expanded e
)
INSERT INTO tracking_events (
    event_id,order_id,leg_id,event_source,source_namespace,dedupe_key,source_module,
    source_event_ref,event_type,event_code,event_name,stage_status_code,reason_code,
    reason,occurred_at,received_at,order_sequence_no,leg_sequence_no,apply_result,created_at
)
SELECT pg_temp.seed_uuid(e.scenario_no,200+e.ord),pg_temp.seed_uuid(e.scenario_no,1),
       pg_temp.seed_uuid(e.scenario_no,60+e.leg_no),2,'ORDER-WORKFLOW',
       'D2-'||e.scenario_no||'-STATUS-'||lpad(e.ord::text,2,'0'),'ORD',
       'ORD-EVENT-D2-'||e.scenario_no||'-'||e.ord,'ORDER_STATUS',e.status_code,
       os.status_name,e.status_code,'WORKFLOW_TRANSITION',
       'Chuyển trạng thái theo workflow '||s.title||'.',
       '2026-09-20 00:00:00+00'::timestamptz + e.ord*interval '30 minutes',
       '2026-09-20 00:00:05+00'::timestamptz + e.ord*interval '30 minutes',
       e.ord,e.leg_seq,1,
       '2026-09-20 00:00:05+00'::timestamptz + e.ord*interval '30 minutes'
  FROM sequenced e
  JOIN seed_scenarios s USING (scenario_no)
  JOIN order_statuses os ON os.status_code=e.status_code;

WITH expanded AS (
    SELECT s.scenario_no,u.status_code,u.ord::integer,
           lag(u.status_code) OVER (PARTITION BY s.scenario_no ORDER BY u.ord) AS from_status
      FROM seed_scenarios s
     CROSS JOIN LATERAL unnest(s.status_path) WITH ORDINALITY AS u(status_code,ord)
)
INSERT INTO order_status_history (
    status_history_id,order_id,from_status_code,status_code,version_no,tracking_event_id,
    reason_code,reason,changed_by_actor_type,changed_by_actor_ref,changed_at,created_at
)
SELECT pg_temp.seed_uuid(scenario_no,300+ord),pg_temp.seed_uuid(scenario_no,1),
       from_status,status_code,ord,pg_temp.seed_uuid(scenario_no,200+ord),
       'WORKFLOW_TRANSITION','Trạng thái được áp dụng từ sự kiện chuẩn hóa của Order.',
       3,'order-workflow','2026-09-20 00:00:05+00'::timestamptz+ord*interval '30 minutes',
       '2026-09-20 00:00:05+00'::timestamptz+ord*interval '30 minutes'
  FROM expanded;

-- Attempts thất bại và retry được giữ riêng, không ghi đè lịch sử.
INSERT INTO transport_attempts (
    attempt_id,order_id,leg_id,waybill_id,carrier_code,attempt_code,attempt_type,
    attempt_no,status,failure_code,failure_reason,received_by_name,received_by_relation,
    source_ref,started_at,ended_at,version_no,created_at,updated_at
) VALUES
(pg_temp.seed_uuid(4,401),pg_temp.seed_uuid(4,1),pg_temp.seed_uuid(4,61),pg_temp.seed_uuid(4,91),1,'ATT-D2-04-PICKUP-01',1,1,3,'SHOP_NOT_READY','Shop chưa hoàn tất đóng gói tại lần lấy đầu tiên.',NULL,NULL,'SS-PICKUP-D2-04-01','2026-09-20 01:30:00+00','2026-09-20 02:00:00+00',1,'2026-09-20 01:30:00+00','2026-09-20 02:00:00+00'),
(pg_temp.seed_uuid(4,402),pg_temp.seed_uuid(4,1),pg_temp.seed_uuid(4,61),pg_temp.seed_uuid(4,91),1,'ATT-D2-04-PICKUP-02',1,2,2,NULL,NULL,'Cửa hàng Thiết bị Minh Quang','Người gửi','SS-PICKUP-D2-04-02','2026-09-20 03:00:00+00','2026-09-20 03:25:00+00',1,'2026-09-20 03:00:00+00','2026-09-20 03:25:00+00'),
(pg_temp.seed_uuid(4,403),pg_temp.seed_uuid(4,1),pg_temp.seed_uuid(4,62),pg_temp.seed_uuid(4,92),3,'ATT-D2-04-DELIVERY-01',2,1,3,'RECIPIENT_UNAVAILABLE','Người nhận không có mặt tại địa chỉ giao.',NULL,NULL,'JNT-DELIVERY-D2-04-01','2026-09-20 09:00:00+00','2026-09-20 09:25:00+00',1,'2026-09-20 09:00:00+00','2026-09-20 09:25:00+00'),
(pg_temp.seed_uuid(4,404),pg_temp.seed_uuid(4,1),pg_temp.seed_uuid(4,62),pg_temp.seed_uuid(4,92),3,'ATT-D2-04-DELIVERY-02',2,2,2,NULL,NULL,'Phạm Ngọc Hân','Người nhận','JNT-DELIVERY-D2-04-02','2026-09-20 10:30:00+00','2026-09-20 11:05:00+00',1,'2026-09-20 10:30:00+00','2026-09-20 11:05:00+00'),
(pg_temp.seed_uuid(6,401),pg_temp.seed_uuid(6,1),pg_temp.seed_uuid(6,63),pg_temp.seed_uuid(6,93),10,'ATT-D2-06-RETURN-PICKUP-01',3,1,3,'PARCEL_NOT_READY','Kiện hoàn chưa sẵn sàng tại điểm tập kết.',NULL,NULL,'SPX-RETURN-D2-06-01','2026-09-20 07:00:00+00','2026-09-20 07:20:00+00',1,'2026-09-20 07:00:00+00','2026-09-20 07:20:00+00'),
(pg_temp.seed_uuid(6,402),pg_temp.seed_uuid(6,1),pg_temp.seed_uuid(6,63),pg_temp.seed_uuid(6,93),10,'ATT-D2-06-RETURN-PICKUP-02',3,2,2,NULL,NULL,'Nhân viên điểm tập kết','Bàn giao hàng hoàn','SPX-RETURN-D2-06-02','2026-09-20 08:00:00+00','2026-09-20 08:30:00+00',1,'2026-09-20 08:00:00+00','2026-09-20 08:30:00+00');

INSERT INTO handovers (
    handover_id,order_id,from_leg_id,to_leg_id,from_carrier_code,to_carrier_code,
    status,started_at,completed_at,version_no,created_at,updated_at
) VALUES
(pg_temp.seed_uuid(4,420),pg_temp.seed_uuid(4,1),pg_temp.seed_uuid(4,61),pg_temp.seed_uuid(4,62),1,3,3,'2026-09-20 05:00:00+00','2026-09-20 06:20:00+00',2,'2026-09-20 04:50:00+00','2026-09-20 06:20:00+00'),
(pg_temp.seed_uuid(5,420),pg_temp.seed_uuid(5,1),pg_temp.seed_uuid(5,63),pg_temp.seed_uuid(5,64),6,1,3,'2026-09-20 12:00:00+00','2026-09-20 12:35:00+00',1,'2026-09-20 11:50:00+00','2026-09-20 12:35:00+00'),
(pg_temp.seed_uuid(5,423),pg_temp.seed_uuid(5,1),pg_temp.seed_uuid(5,61),pg_temp.seed_uuid(5,62),1,2,3,'2026-09-20 04:30:00+00','2026-09-20 05:00:00+00',1,'2026-09-20 04:25:00+00','2026-09-20 05:00:00+00');

INSERT INTO handover_attempts (
    handover_attempt_id,order_id,handover_id,from_waybill_id,to_waybill_id,attempt_no,
    status,failure_code,failure_reason,source_ref,started_at,ended_at,version_no,created_at,updated_at
) VALUES
(pg_temp.seed_uuid(4,421),pg_temp.seed_uuid(4,1),pg_temp.seed_uuid(4,420),pg_temp.seed_uuid(4,91),pg_temp.seed_uuid(4,92),1,3,'SEAL_MISMATCH','Mã niêm phong chưa khớp biên bản bàn giao.','HANDOVER-D2-04-01','2026-09-20 05:00:00+00','2026-09-20 05:15:00+00',1,'2026-09-20 05:00:00+00','2026-09-20 05:15:00+00'),
(pg_temp.seed_uuid(4,422),pg_temp.seed_uuid(4,1),pg_temp.seed_uuid(4,420),pg_temp.seed_uuid(4,91),pg_temp.seed_uuid(4,92),2,2,NULL,NULL,'HANDOVER-D2-04-02','2026-09-20 06:00:00+00','2026-09-20 06:20:00+00',1,'2026-09-20 06:00:00+00','2026-09-20 06:20:00+00'),
(pg_temp.seed_uuid(5,421),pg_temp.seed_uuid(5,1),pg_temp.seed_uuid(5,420),pg_temp.seed_uuid(5,93),pg_temp.seed_uuid(5,94),1,2,NULL,NULL,'HANDOVER-D2-05-01','2026-09-20 12:00:00+00','2026-09-20 12:35:00+00',1,'2026-09-20 12:00:00+00','2026-09-20 12:35:00+00'),
(pg_temp.seed_uuid(5,424),pg_temp.seed_uuid(5,1),pg_temp.seed_uuid(5,423),pg_temp.seed_uuid(5,91),pg_temp.seed_uuid(5,92),1,2,NULL,NULL,'HANDOVER-D2-05-00','2026-09-20 04:30:00+00','2026-09-20 05:00:00+00',1,'2026-09-20 04:30:00+00','2026-09-20 05:00:00+00');

INSERT INTO operational_assignments (
    assignment_id,order_id,assignment_no,leg_id,waybill_id,attempt_id,handover_id,
    handover_attempt_id,carrier_code,role_type,carrier_shipper_code,assignee_name,
    assignee_phone,shipper_image_ref,vehicle_ref,vehicle_type_code,end_type,end_reason,
    source_module,source_ref,valid_from,valid_to,created_at,updated_at
) VALUES
(pg_temp.seed_uuid(4,430),pg_temp.seed_uuid(4,1),1,pg_temp.seed_uuid(4,61),pg_temp.seed_uuid(4,91),pg_temp.seed_uuid(4,401),NULL,NULL,1,1,'SS-SHP-D2-0401','Nguyễn Quốc Vinh','0911880401','FILE-SHIPPER-D2-0401','VEH-D2-0401',1,2,'Thay tài xế sau lần lấy không thành công.','CAR','ASSIGN-D2-0401','2026-09-20 01:25:00+00','2026-09-20 02:05:00+00','2026-09-20 01:25:00+00','2026-09-20 02:05:00+00'),
(pg_temp.seed_uuid(4,431),pg_temp.seed_uuid(4,1),2,pg_temp.seed_uuid(4,62),pg_temp.seed_uuid(4,92),pg_temp.seed_uuid(4,404),NULL,NULL,3,2,'JNT-SHP-D2-0402','Trần Hoàng Phúc','0911880402','FILE-SHIPPER-D2-0402','VEH-D2-0402',1,1,NULL,'CAR','ASSIGN-D2-0402','2026-09-20 10:25:00+00','2026-09-20 11:10:00+00','2026-09-20 10:25:00+00','2026-09-20 11:10:00+00'),
(pg_temp.seed_uuid(6,430),pg_temp.seed_uuid(6,1),1,pg_temp.seed_uuid(6,63),pg_temp.seed_uuid(6,93),pg_temp.seed_uuid(6,402),NULL,NULL,10,3,'SPX-SHP-D2-0603','Lương Anh Tuấn','0911880603',NULL,'VEH-D2-0603',2,1,NULL,'CAR','ASSIGN-D2-0603','2026-09-20 07:55:00+00','2026-09-20 08:35:00+00','2026-09-20 07:55:00+00','2026-09-20 08:35:00+00'),
(pg_temp.seed_uuid(5,430),pg_temp.seed_uuid(5,1),1,pg_temp.seed_uuid(5,64),pg_temp.seed_uuid(5,94),NULL,NULL,NULL,1,4,'SS-SHP-D2-0504','Đặng Hải Nam','0911880504',NULL,'VEH-D2-0504',3,1,NULL,'CAR','ASSIGN-D2-0504','2026-09-20 12:35:00+00','2026-09-21 17:30:00+00','2026-09-20 12:35:00+00','2026-09-21 17:30:00+00'),
(pg_temp.seed_uuid(4,432),pg_temp.seed_uuid(4,1),3,pg_temp.seed_uuid(4,62),pg_temp.seed_uuid(4,92),NULL,pg_temp.seed_uuid(4,420),pg_temp.seed_uuid(4,422),3,5,NULL,'Điều phối viên bàn giao Nguyễn Hà My',NULL,NULL,NULL,NULL,1,NULL,'CAR','ASSIGN-D2-04-HANDOVER','2026-09-20 06:00:00+00','2026-09-20 06:25:00+00','2026-09-20 06:00:00+00','2026-09-20 06:25:00+00'),
(pg_temp.seed_uuid(5,433),pg_temp.seed_uuid(5,1),2,pg_temp.seed_uuid(5,62),pg_temp.seed_uuid(5,92),NULL,pg_temp.seed_uuid(5,423),pg_temp.seed_uuid(5,424),2,5,NULL,'Điều phối viên bàn giao Nguyễn Hà My',NULL,NULL,NULL,NULL,1,NULL,'CAR','ASSIGN-D2-05-HANDOVER','2026-09-20 04:30:00+00','2026-09-20 05:05:00+00','2026-09-20 04:30:00+00','2026-09-20 05:05:00+00');

INSERT INTO order_results (
    result_id,order_id,leg_id,waybill_id,attempt_id,result_type,result_code,
    reason_code,reason,source_module,source_ref,occurred_at,valid_from,version_no,created_at
) VALUES
(pg_temp.seed_uuid(4,440),pg_temp.seed_uuid(4,1),pg_temp.seed_uuid(4,62),pg_temp.seed_uuid(4,92),pg_temp.seed_uuid(4,404),1,1,'DELIVERED','Đã giao nguyên kiện cho người nhận.','CAR','JNT-RESULT-D2-04','2026-09-20 11:05:00+00','2026-09-20 11:05:00+00',1,'2026-09-20 11:05:05+00'),
(pg_temp.seed_uuid(5,440),pg_temp.seed_uuid(5,1),pg_temp.seed_uuid(5,64),pg_temp.seed_uuid(5,94),NULL,2,1,'RETURNED','Đã trả nguyên kiện về điểm nhận hoàn.','CAR','SS-RESULT-D2-05','2026-09-21 17:30:00+00','2026-09-21 17:30:00+00',1,'2026-09-21 17:30:05+00'),
(pg_temp.seed_uuid(6,440),pg_temp.seed_uuid(6,1),pg_temp.seed_uuid(6,64),pg_temp.seed_uuid(6,94),NULL,2,2,'PARTIAL_RETURN','Một sản phẩm đã trả, một sản phẩm chuyển xử lý bồi hoàn.','CAR','SPX-RESULT-D2-06','2026-09-21 17:30:00+00','2026-09-21 17:30:00+00',1,'2026-09-21 17:30:05+00'),
(pg_temp.seed_uuid(7,440),pg_temp.seed_uuid(7,1),pg_temp.seed_uuid(7,64),pg_temp.seed_uuid(7,94),NULL,3,1,'EXCHANGED','Đã thu sản phẩm cũ và giao sản phẩm đổi.','CAR','JNT-RESULT-D2-07','2026-09-21 17:30:00+00','2026-09-21 17:30:00+00',1,'2026-09-21 17:30:05+00');

-- Reference ngoài Order, ghi chú, activity, ảnh và SLA để phủ đầy đủ các bảng còn trống.
INSERT INTO external_refs (external_ref_id,order_id,module_code,ref_type,external_id,parent_external_ref_id,leg_id,waybill_id,carrier_code,created_at) VALUES
(pg_temp.seed_uuid(7,450),pg_temp.seed_uuid(7,1),'SUPPORT','TICKET','SUP-260919-00471',NULL,NULL,NULL,NULL,'2026-09-20 08:00:00+00'),
(pg_temp.seed_uuid(7,451),pg_temp.seed_uuid(7,1),'CLAIM','EXCHANGE_CASE','CLM-260919-00128',pg_temp.seed_uuid(7,450),pg_temp.seed_uuid(7,64),pg_temp.seed_uuid(7,94),3,'2026-09-20 08:05:00+00'),
(pg_temp.seed_uuid(5,450),pg_temp.seed_uuid(5,1),'FINANCE','COD_RECONCILIATION','FIN-COD-260921-00952',NULL,pg_temp.seed_uuid(5,62),pg_temp.seed_uuid(5,92),2,'2026-09-21 18:00:00+00');

INSERT INTO order_requests (request_id,order_id,request_code,request_type,request_status,payload_version,request_payload,reason_code,reason,source_type,requested_by_actor_type,requested_by_actor_ref,requested_by_display_name,requested_at,result_code,completed_at,correlation_id,version_no,created_at,updated_at) VALUES
(pg_temp.seed_uuid(7,460),pg_temp.seed_uuid(7,1),'REQ-D2-07-UPDATE','UPDATE_ORDER',3,1,'{"cod_amount":120000,"receiver_note":"Thu sản phẩm cũ nguyên phụ kiện"}'::jsonb,'EXCHANGE_CONFIRMED','NVC đã xác nhận thay đổi COD và hướng dẫn đổi hàng.',2,2,'ops-exchange-071','Lê Thu Hà','2026-09-20 08:10:00+00','APPLIED','2026-09-20 08:20:00+00','corr-d2-update-07',1,'2026-09-20 08:10:00+00','2026-09-20 08:20:00+00'),
(pg_temp.seed_uuid(2,460),pg_temp.seed_uuid(2,1),'REQ-D2-02-CANCELLED','CANCEL_ORDER',5,1,'{"reason_code":"SHOP_CHANGED_MIND"}'::jsonb,'REQUEST_WITHDRAWN','Shop rút yêu cầu hủy trước khi worker xử lý.',1,1,'shop-user-d2-02','Nhà sách Mây Trắng','2026-09-20 00:10:00+00',NULL,'2026-09-20 00:12:00+00','corr-d2-cancelled-02',1,'2026-09-20 00:10:00+00','2026-09-20 00:12:00+00'),
(pg_temp.seed_uuid(7,461),pg_temp.seed_uuid(7,1),'REQ-D2-07-PENDING','ADD_IMAGE',1,1,'{"image_code":"IMG-D2-07-OTHER"}'::jsonb,NULL,NULL,1,1,'shop-user-d2-07','Cửa hàng Thời trang Gió Mới','2026-09-20 08:30:00+00',NULL,NULL,'corr-d2-pending-07',1,'2026-09-20 08:30:00+00','2026-09-20 08:30:00+00');

INSERT INTO request_steps (request_step_id,order_id,request_id,step_no,step_type,step_status,correlation_id,attempt_count,started_at,completed_at,version_no,created_at,updated_at) VALUES
(pg_temp.seed_uuid(2,470),pg_temp.seed_uuid(2,1),pg_temp.seed_uuid(2,460),1,'CANCEL_ORDER','CANCELLED','corr-d2-cancelled-02',0,NULL,'2026-09-20 00:12:00+00',1,'2026-09-20 00:10:00+00','2026-09-20 00:12:00+00'),
(pg_temp.seed_uuid(7,470),pg_temp.seed_uuid(7,1),pg_temp.seed_uuid(7,461),1,'ADD_IMAGE','PENDING','corr-d2-pending-07',0,NULL,NULL,1,'2026-09-20 08:30:00+00','2026-09-20 08:30:00+00');

INSERT INTO request_targets (request_target_id,order_id,request_id,target_type,party_id,address_id,goods_id,leg_id,waybill_id,attempt_id,handover_id,external_ref_id,created_at) VALUES
(pg_temp.seed_uuid(7,480),pg_temp.seed_uuid(7,1),pg_temp.seed_uuid(7,460),'PARTY',pg_temp.seed_uuid(7,22),NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2026-09-20 08:10:00+00'),
(pg_temp.seed_uuid(7,481),pg_temp.seed_uuid(7,1),pg_temp.seed_uuid(7,460),'ADDRESS',NULL,pg_temp.seed_uuid(7,12),NULL,NULL,NULL,NULL,NULL,NULL,'2026-09-20 08:10:00+00'),
(pg_temp.seed_uuid(7,482),pg_temp.seed_uuid(7,1),pg_temp.seed_uuid(7,460),'GOODS',NULL,NULL,pg_temp.seed_uuid(7,31),NULL,NULL,NULL,NULL,NULL,'2026-09-20 08:10:00+00'),
(pg_temp.seed_uuid(7,483),pg_temp.seed_uuid(7,1),pg_temp.seed_uuid(7,460),'LEG',NULL,NULL,NULL,pg_temp.seed_uuid(7,64),NULL,NULL,NULL,NULL,'2026-09-20 08:10:00+00'),
(pg_temp.seed_uuid(7,484),pg_temp.seed_uuid(7,1),pg_temp.seed_uuid(7,460),'WAYBILL',NULL,NULL,NULL,NULL,pg_temp.seed_uuid(7,94),NULL,NULL,NULL,'2026-09-20 08:10:00+00'),
(pg_temp.seed_uuid(7,485),pg_temp.seed_uuid(7,1),pg_temp.seed_uuid(7,460),'EXTERNAL_REF',NULL,NULL,NULL,NULL,NULL,NULL,NULL,pg_temp.seed_uuid(7,451),'2026-09-20 08:10:00+00'),
(pg_temp.seed_uuid(4,480),pg_temp.seed_uuid(4,1),pg_temp.seed_uuid(4,80),'ATTEMPT',NULL,NULL,NULL,NULL,NULL,pg_temp.seed_uuid(4,404),NULL,NULL,'2026-09-20 10:30:00+00'),
(pg_temp.seed_uuid(4,481),pg_temp.seed_uuid(4,1),pg_temp.seed_uuid(4,80),'HANDOVER',NULL,NULL,NULL,NULL,NULL,NULL,pg_temp.seed_uuid(4,420),NULL,'2026-09-20 06:00:00+00');

INSERT INTO order_adjustments (adjustment_id,order_id,request_id,external_ref_id,leg_id,waybill_id,adjustment_type,before_data,after_data,reason_code,reason,applied_by_actor_type,applied_by_actor_ref,applied_by_display_name,applied_at,created_at) VALUES
(pg_temp.seed_uuid(7,490),pg_temp.seed_uuid(7,1),pg_temp.seed_uuid(7,460),pg_temp.seed_uuid(7,451),pg_temp.seed_uuid(7,64),pg_temp.seed_uuid(7,94),'COD_AND_EXCHANGE_NOTE',
 '{"cod_amount":590000,"delivery_note":"Giao sản phẩm mới"}'::jsonb,
 '{"cod_amount":120000,"delivery_note":"Thu sản phẩm cũ nguyên phụ kiện khi giao sản phẩm đổi"}'::jsonb,
 'CARRIER_CONFIRMED','NVC đã xác nhận thay đổi trước khi áp dụng snapshot mới.',2,'ops-exchange-071','Lê Thu Hà','2026-09-20 08:20:00+00','2026-09-20 08:20:00+00');

INSERT INTO order_notes (note_id,note_code,order_id,note_type,visibility_scope,content,created_actor_type,created_actor_code,created_display_name,created_at) VALUES
(pg_temp.seed_uuid(7,500),'NOTE-D2-07-GENERAL',pg_temp.seed_uuid(7,1),1,1,'Khách đã xác nhận đổi sang màu xanh than, giữ nguyên kích cỡ.',1,'shop-user-d2-07','Cửa hàng Thời trang Gió Mới','2026-09-20 08:22:00+00'),
(pg_temp.seed_uuid(4,500),'NOTE-D2-04-PICKUP',pg_temp.seed_uuid(4,1),2,2,'Lần lấy đầu shop chưa đóng gói xong; lần hai nhận kiện có niêm phong đầy đủ.',2,'ops-hcm-041','Nguyễn Hà My','2026-09-20 03:30:00+00'),
(pg_temp.seed_uuid(4,501),'NOTE-D2-04-DELIVERY',pg_temp.seed_uuid(4,1),3,1,'Người nhận hẹn giao lại sau 10 giờ 30 và đã nhận nguyên kiện.',2,'ops-hn-042','Trần Hoàng Phúc','2026-09-20 11:10:00+00'),
(pg_temp.seed_uuid(6,500),'NOTE-D2-06-RETURN',pg_temp.seed_uuid(6,1),4,2,'Một sản phẩm hư hỏng bao bì được tách sang hồ sơ bồi hoàn.',3,'return-workflow','Tiến trình xử lý hoàn','2026-09-21 17:40:00+00');

INSERT INTO activity_logs (activity_id,order_id,sequence_no,activity_group,activity_key,activity_name,title,description,result,actor_type,actor_code,actor_name,source_type,changes,"references",correlation_id,occurred_at,recorded_at) VALUES
(pg_temp.seed_uuid(7,510),pg_temp.seed_uuid(7,1),1,3,'ORDER_UPDATED','Cập nhật đơn hàng','Đã cập nhật COD cho đơn đổi hàng','COD được đổi từ 590.000 đồng còn 120.000 đồng sau khi NVC xác nhận.',1,'INTERNAL','ops-exchange-071','Lê Thu Hà','INTERNAL_TOOL','[{"field":"cod_amount","before":590000,"after":120000}]'::jsonb,'[{"ref_type":"REQUEST","ref_code":"REQ-D2-07-UPDATE"}]'::jsonb,'corr-d2-update-07','2026-09-20 08:20:00+00','2026-09-20 08:20:05+00'),
(pg_temp.seed_uuid(4,510),pg_temp.seed_uuid(4,1),1,6,'CARRIER_CHANGED','Đổi nhà vận chuyển','Đã bàn giao sang J&T Express','SuperShip hoàn tất lấy hàng và bàn giao kiện cho J&T Express để giao chặng cuối.',1,'SYSTEM','handover-workflow','Tiến trình bàn giao','SYSTEM_PROCESS','[{"field":"custodian_carrier_code","before":1,"after":3}]'::jsonb,'[{"ref_type":"HANDOVER","ref_code":"HANDOVER-D2-04-02"}]'::jsonb,'corr-d2-handover-04','2026-09-20 06:20:00+00','2026-09-20 06:20:05+00');

INSERT INTO order_images (image_id,image_code,order_id,file_ref,image_type,description,visibility_scope,source_type,source_name,carrier_code,leg_id,waybill_id,attempt_id,result_id,status,created_at,removed_at,removed_by_actor_type,removed_by_actor_ref) VALUES
(pg_temp.seed_uuid(4,520),'IMG-D2-04-GOODS',pg_temp.seed_uuid(4,1),'FILE-D2-04-GOODS','GOODS','Ảnh kiện bàn phím sau khi đóng gói chống sốc.',1,1,'Cửa hàng Thiết bị Minh Quang',NULL,NULL,NULL,NULL,NULL,1,'2026-09-20 00:20:00+00',NULL,NULL,NULL),
(pg_temp.seed_uuid(4,521),'IMG-D2-04-PICKUP',pg_temp.seed_uuid(4,1),'FILE-D2-04-PICKUP','PICKUP','Ảnh niêm phong khi lấy hàng lần hai.',2,3,'SuperShip',1,pg_temp.seed_uuid(4,61),pg_temp.seed_uuid(4,91),pg_temp.seed_uuid(4,402),NULL,1,'2026-09-20 03:25:00+00',NULL,NULL,NULL),
(pg_temp.seed_uuid(4,522),'IMG-D2-04-DELIVERY',pg_temp.seed_uuid(4,1),'FILE-D2-04-DELIVERY','DELIVERY','Ảnh xác nhận giao nguyên kiện.',1,3,'J&T Express',3,pg_temp.seed_uuid(4,62),pg_temp.seed_uuid(4,92),pg_temp.seed_uuid(4,404),pg_temp.seed_uuid(4,440),1,'2026-09-20 11:05:00+00',NULL,NULL,NULL),
(pg_temp.seed_uuid(5,520),'IMG-D2-05-RETURN',pg_temp.seed_uuid(5,1),'FILE-D2-05-RETURN','RETURN','Ảnh kiện đã trả về điểm nhận hoàn.',1,3,'SuperShip',1,pg_temp.seed_uuid(5,64),pg_temp.seed_uuid(5,94),NULL,pg_temp.seed_uuid(5,440),1,'2026-09-21 17:30:00+00',NULL,NULL,NULL),
(pg_temp.seed_uuid(6,520),'IMG-D2-06-DAMAGE',pg_temp.seed_uuid(6,1),'FILE-D2-06-DAMAGE','DAMAGE_INCIDENT','Ảnh bao bì móp góc được gắn vào hồ sơ bồi hoàn.',2,2,'Bộ phận vận hành hoàn',NULL,pg_temp.seed_uuid(6,64),pg_temp.seed_uuid(6,94),NULL,pg_temp.seed_uuid(6,440),1,'2026-09-21 17:35:00+00',NULL,NULL,NULL),
(pg_temp.seed_uuid(7,520),'IMG-D2-07-OTHER',pg_temp.seed_uuid(7,1),'FILE-D2-07-EXCHANGE-INSTRUCTION','OTHER','Ảnh hướng dẫn đóng gói sản phẩm đổi đã được thay bằng phiên bản mới.',2,1,'Cửa hàng Thời trang Gió Mới',NULL,NULL,NULL,NULL,NULL,2,'2026-09-20 08:25:00+00','2026-09-20 08:28:00+00',1,'shop-user-d2-07');

INSERT INTO order_slas (sla_id,order_id,is_applicable,not_applicable_reason_code,not_applicable_reason,sla_code,sla_name,policy_code,policy_version,source_module,source_ref,source_version,route_type,started_at,expected_from,expected_to,completed_at,result,difference_minutes,version_no,created_at,updated_at)
SELECT pg_temp.seed_uuid(scenario_no,530),pg_temp.seed_uuid(scenario_no,1),scenario_no<>3,
       CASE WHEN scenario_no=3 THEN 2 END,CASE WHEN scenario_no=3 THEN 'Không áp dụng SLA giao hàng khi chưa phân bổ được tài xế.' END,
       CASE WHEN scenario_no<>3 THEN 'ORDER-SLA-D2-'||scenario_no END,
       CASE WHEN scenario_no<>3 THEN 'Cam kết xử lý đơn hàng' END,
       'SHP-SLA-POLICY-2026',2,'SHP','SHP-SLA-D2-'||scenario_no,1,
       least(leg_count,5),
       CASE WHEN scenario_no<>3 THEN '2026-09-20 00:00:00+00'::timestamptz END,
       CASE WHEN scenario_no<>3 THEN '2026-09-20 12:00:00+00'::timestamptz END,
       CASE WHEN scenario_no<>3 THEN '2026-09-22 12:00:00+00'::timestamptz END,
       CASE WHEN scenario_no IN (4,5,6,7) THEN '2026-09-21 18:00:00+00'::timestamptz END,
       CASE WHEN scenario_no=3 THEN NULL WHEN scenario_no IN (4,5,7) THEN 3 WHEN scenario_no=6 THEN 4 WHEN scenario_no%2=0 THEN 1 ELSE 2 END,
       CASE WHEN scenario_no=3 THEN NULL WHEN scenario_no IN (4,5,7) THEN -1080 WHEN scenario_no=6 THEN 360 ELSE 0 END,
       1,'2026-09-20 00:00:00+00','2026-09-21 18:00:00+00'
  FROM seed_scenarios;

WITH numbered AS (
    SELECT w.*,row_number() OVER (ORDER BY scenario_no,leg_no) AS rn
      FROM seed_waybills w
)
INSERT INTO waybill_slas (waybill_sla_id,order_id,waybill_id,carrier_code,carrier_client_code,service_flow,route_type,commitment_level,source_module,source_ref,source_version,standard_min_days,standard_max_days,additional_days,time_basis,started_at,expected_from,expected_to,completed_at,result,difference_minutes,adjustments,version_no,created_at,updated_at)
SELECT pg_temp.seed_uuid(scenario_no,540+leg_no),pg_temp.seed_uuid(scenario_no,1),pg_temp.seed_uuid(scenario_no,90+leg_no),carrier_code,
       'CLIENT-D2-'||scenario_no||'-'||leg_no,CASE WHEN leg_no>=3 THEN 2 ELSE 1 END,least(leg_no,5),
       CASE WHEN rn=5 THEN 2 WHEN rn=6 THEN 3 ELSE 1 END,'CAR','CAR-SLA-D2-'||scenario_no||'-'||leg_no,1,
       1,3,CASE WHEN rn%4=0 THEN 0.5 ELSE 0 END,1,
       '2026-09-19 23:42:00+00','2026-09-20 23:42:00+00','2026-09-22 23:42:00+00',
       CASE WHEN rn IN (1,2) THEN NULL ELSE '2026-09-21 17:30:00+00'::timestamptz END,
       CASE WHEN rn=1 THEN 'WITHIN_DUE'::waybill_sla_result
            WHEN rn=2 THEN 'OVERDUE'::waybill_sla_result
            WHEN rn=3 THEN 'COMPLETED_ON_TIME'::waybill_sla_result
            WHEN rn=4 THEN 'COMPLETED_LATE'::waybill_sla_result
            WHEN rn=5 THEN 'REFERENCE_ONLY'::waybill_sla_result
            WHEN rn=6 THEN 'NOT_APPLICABLE'::waybill_sla_result
            ELSE 'COMPLETED_ON_TIME'::waybill_sla_result END,
       CASE WHEN rn IN (1,2,5,6) THEN NULL WHEN rn=4 THEN 180 ELSE -1812 END,
       CASE WHEN rn%4=0 THEN '[{"type":"HOLIDAY","additional_days":0.5,"reason":"Ngày nghỉ theo lịch vận hành NVC"}]'::jsonb ELSE '[]'::jsonb END,
       1,'2026-09-19 23:42:00+00','2026-09-21 18:00:00+00'
  FROM numbered;

COMMIT;

\set ON_ERROR_STOP on

BEGIN;
SET LOCAL search_path TO order_mgmt, public;

-- Tương thích database đã seed bằng bản cũ: SPF-0303 không được gắn SuperShip
-- hoặc NVC mạng lưới. Chuyển scenario sang Green SM Express hỏa tốc.
UPDATE orders
   SET customer_model=4,transport_model=4,selection_mode=2,
       pricing_code='PRC-HCM-GREEN-SM-INSTANT-2026-09',
       current_leg_id='20000003-0061-7061-8003-000000003061'::uuid,
       custodian_carrier_code=NULL,updated_by='instant-scenario-repair'
 WHERE order_code='9209190000003';

UPDATE order_legs
   SET carrier_code=15,carrier_client_code='GSM-HCM-INSTANT-D2-03',
       stage_status_code='SPF-0303',started_at=NULL,completed_at=NULL,
       updated_at='2026-09-20 01:30:00+00'
 WHERE leg_id='20000003-0061-7061-8003-000000003061';

UPDATE leg_services
   SET carrier_code=15,service_code='GSM-INSTANT-BIKE',
       service_name='Green SM Express giao hỏa tốc bằng xe máy điện',
       fulfillment_mode=2,carrier_client_code='GSM-HCM-INSTANT-D2-03',
       vehicle_type_code='ELECTRIC_MOTORBIKE',policy_ref='GSM-INSTANT-HCM-2026'
 WHERE leg_service_id='20000003-0071-7071-8003-000000003071';

INSERT INTO order_legs (
  leg_id,order_id,stage_code,stage_no,leg_type,stage_status_code,carrier_code,
  carrier_client_code,version_no,created_at,updated_at
) VALUES (
  '20000003-0062-7062-8003-000000003062','20000003-0001-7001-8003-000000003001',
  'STG-DELIVERY-0001',2,2,'PENDING',15,'GSM-HCM-INSTANT-D2-03',1,
  '2026-09-19 23:35:00+00','2026-09-20 01:30:00+00'
) ON CONFLICT (leg_id) DO UPDATE
SET stage_status_code='PENDING',carrier_code=15,
    carrier_client_code='GSM-HCM-INSTANT-D2-03',started_at=NULL,completed_at=NULL,
    updated_at=EXCLUDED.updated_at;

INSERT INTO leg_endpoints (
  leg_endpoint_id,order_id,leg_id,endpoint_role,location_type,order_address_id,
  source_module,source_code,location_name,address_model,address_detail,full_address,
  province_code,district_code,commune_code,latitude,longitude,valid_from,version_no,
  created_at
) VALUES
('20000003-0105-7105-8003-000000003105','20000003-0001-7001-8003-000000003001','20000003-0062-7062-8003-000000003062',1,1,'20000003-0011-7011-8003-000000003011','ORD','ENDPOINT-D2-3-2-1','Điểm lấy hỏa tốc',1,'Số 48 đường Võ Văn Tần','Số 48 đường Võ Văn Tần, phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí Minh','79','770','27139',10.7786400,106.6892400,'2026-09-19 23:35:00+00',1,'2026-09-19 23:35:00+00'),
('20000003-0106-7106-8003-000000003106','20000003-0001-7001-8003-000000003001','20000003-0062-7062-8003-000000003062',2,1,'20000003-0012-7012-8003-000000003012','ORD','ENDPOINT-D2-3-2-2','Điểm giao hỏa tốc',2,'Tầng 5, số 82 phố Duy Tân','Tầng 5, số 82 phố Duy Tân, phường Cầu Giấy, Thành phố Hà Nội','P01',NULL,'P01C00031',21.0302500,105.7826100,'2026-09-19 23:35:00+00',1,'2026-09-19 23:35:00+00')
ON CONFLICT (leg_endpoint_id) DO NOTHING;

INSERT INTO leg_items (order_id,leg_id,item_id,quantity,created_at) VALUES (
  '20000003-0001-7001-8003-000000003001','20000003-0062-7062-8003-000000003062',
  '20000003-0041-7041-8003-000000003041',1,'2026-09-19 23:35:00+00'
) ON CONFLICT DO NOTHING;

INSERT INTO leg_services (
  leg_service_id,order_id,leg_id,carrier_code,service_code,service_name,
  fulfillment_mode,carrier_client_code,vehicle_type_code,policy_ref,policy_version,
  pricing_result_ref,carrier_fee_amount,shop_shipping_fee_amount,priced_at,
  valid_from,version_no,created_at
) VALUES (
  '20000003-0072-7072-8003-000000003072','20000003-0001-7001-8003-000000003001',
  '20000003-0062-7062-8003-000000003062',15,'GSM-INSTANT-BIKE',
  'Green SM Express giao hỏa tốc bằng xe máy điện',2,'GSM-HCM-INSTANT-D2-03',
  'ELECTRIC_MOTORBIKE','GSM-INSTANT-HCM-2026','3','PRC-D2-3-2',25000,33000,
  '2026-09-19 23:36:00+00','2026-09-19 23:36:00+00',1,'2026-09-19 23:36:00+00'
) ON CONFLICT (leg_service_id) DO UPDATE
SET carrier_code=15,service_code='GSM-INSTANT-BIKE',
    service_name='Green SM Express giao hỏa tốc bằng xe máy điện',fulfillment_mode=2,
    carrier_client_code='GSM-HCM-INSTANT-D2-03',vehicle_type_code='ELECTRIC_MOTORBIKE',
    policy_ref='GSM-INSTANT-HCM-2026';

UPDATE order_requests
   SET request_status=3,result_code='ACCEPTED',result_reason_code=NULL,
       result_reason=NULL,completed_at='2026-09-19 23:55:00+00',
       request_payload='{"carrier_code":15,"delivery_model":"INSTANT","scenario":"Green SM Express không tìm được tài xế hỏa tốc sau thời gian allocation"}'::jsonb
 WHERE request_id='20000003-0080-7080-8003-000000003080';

INSERT INTO waybills (
  waybill_id,order_id,carrier_code,carrier_waybill_code,carrier_client_code,
  origin_request_id,sender_party_id,receiver_party_id,pickup_address_id,
  delivery_address_id,goods_id,measure_id,leg_service_id,pickup_method,fee_payer,
  inspection_type,cod_amount,collection_amount,declared_value,delivery_note,
  carrier_options,snapshot_schema_version,snapshot_hash,carrier_sorting_code,
  waybill_status,request_sent_at,carrier_accepted_at,created_at,updated_at
) VALUES
('20000003-0091-7091-8003-000000003091','20000003-0001-7001-8003-000000003001',15,'GSM-EXP-20260920-000003','GSM-HCM-INSTANT-D2-03','20000003-0080-7080-8003-000000003080','20000003-0021-7021-8003-000000003021','20000003-0022-7022-8003-000000003022','20000003-0011-7011-8003-000000003011','20000003-0012-7012-8003-000000003012','20000003-0031-7031-8003-000000003031','20000003-0051-7051-8003-000000003051','20000003-0071-7071-8003-000000003071',1,1,2,650000,650000,650000,'Đơn hỏa tốc đang phân bổ tài xế.','[]'::jsonb,1,encode(sha256(convert_to('GSM-EXP-20260920-000003:snapshot:v1','UTF8')),'hex'),'GSM-HCM-01',1,'2026-09-19 23:41:00+00','2026-09-19 23:42:00+00','2026-09-19 23:42:00+00','2026-09-20 01:30:00+00'),
('20000003-0092-7092-8003-000000003092','20000003-0001-7001-8003-000000003001',15,'GSM-EXP-20260920-000003-D','GSM-HCM-INSTANT-D2-03',NULL,'20000003-0021-7021-8003-000000003021','20000003-0022-7022-8003-000000003022','20000003-0011-7011-8003-000000003011','20000003-0012-7012-8003-000000003012','20000003-0031-7031-8003-000000003031','20000003-0051-7051-8003-000000003051','20000003-0072-7072-8003-000000003072',1,1,2,650000,650000,650000,'Đơn hỏa tốc đang phân bổ tài xế.','[]'::jsonb,1,encode(sha256(convert_to('GSM-EXP-20260920-000003-D:snapshot:v1','UTF8')),'hex'),'GSM-HCM-01',1,'2026-09-19 23:41:00+00','2026-09-19 23:42:00+00','2026-09-19 23:42:00+00','2026-09-20 01:30:00+00')
ON CONFLICT (waybill_id) DO NOTHING;

INSERT INTO leg_waybills (
  leg_waybill_id,order_id,leg_id,waybill_id,sequence_no,active_from,created_at
) VALUES
('20000003-0141-7141-8003-000000003141','20000003-0001-7001-8003-000000003001','20000003-0061-7061-8003-000000003061','20000003-0091-7091-8003-000000003091',1,'2026-09-19 23:42:00+00','2026-09-19 23:42:00+00'),
('20000003-0142-7142-8003-000000003142','20000003-0001-7001-8003-000000003001','20000003-0062-7062-8003-000000003062','20000003-0092-7092-8003-000000003092',1,'2026-09-19 23:42:00+00','2026-09-19 23:42:00+00')
ON CONFLICT (leg_waybill_id) DO NOTHING;

UPDATE request_steps
   SET step_status='SUCCESS',carrier_code=15,
       result_waybill_id='20000003-0091-7091-8003-000000003091',
       result_code='WAYBILL_CREATED',last_error_code=NULL,last_error=NULL,
       completed_at='2026-09-19 23:55:00+00',updated_at='2026-09-19 23:55:00+00'
 WHERE request_step_id='20000003-0150-7150-8003-000000003150';

INSERT INTO order_requests (
  request_id,order_id,request_code,request_type,request_status,payload_version,
  request_payload,reason_code,reason,source_type,requested_by_actor_type,
  requested_by_actor_ref,requested_by_display_name,requested_at,result_reason_code,
  result_reason,completed_at,correlation_id,version_no,created_at,updated_at
) VALUES (
  '20000003-0151-7151-8003-000000003151','20000003-0001-7001-8003-000000003001',
  'REQ-D2-03-ALLOCATE-DRIVER','ALLOCATE_DRIVER',4,1,
  '{"carrier_code":15,"delivery_model":"INSTANT","max_allocation_attempts":3}'::jsonb,
  'DRIVER_ALLOCATION_REQUIRED','Waybill hỏa tốc đã được tạo và đang cần tài xế.',5,3,
  'order-orchestrator','Tiến trình điều phối tài xế','2026-09-20 00:35:00+00',
  'DRIVER_ALLOCATION_EXHAUSTED','Green SM Express không tìm được tài xế sau ba lần phân bổ.',
  '2026-09-20 01:30:00+00','corr-d2-driver-allocation-3',1,
  '2026-09-20 00:35:00+00','2026-09-20 01:30:00+00'
) ON CONFLICT (request_id) DO NOTHING;

INSERT INTO request_targets (
  request_target_id,order_id,request_id,target_type,leg_id,created_at
) VALUES (
  '20000003-0152-7152-8003-000000003152','20000003-0001-7001-8003-000000003001',
  '20000003-0151-7151-8003-000000003151','LEG','20000003-0061-7061-8003-000000003061',
  '2026-09-20 00:35:00+00'
) ON CONFLICT (request_target_id) DO NOTHING;

INSERT INTO request_steps (
  request_step_id,order_id,request_id,request_target_id,step_no,step_type,
  step_status,carrier_code,correlation_id,external_ref,request_hash,attempt_count,
  last_error_code,last_error,started_at,completed_at,version_no,created_at,updated_at
) VALUES (
  '20000003-0153-7153-8003-000000003153','20000003-0001-7001-8003-000000003001',
  '20000003-0151-7151-8003-000000003151','20000003-0152-7152-8003-000000003152',
  1,'ALLOCATE_DRIVER','FAILED',15,'corr-d2-driver-allocation-3',
  'GSM-ALLOCATE-20260920-000003',md5('9209190000003:allocate:1')||md5('9209190000003:allocate:2'),
  3,'DRIVER_ALLOCATION_EXHAUSTED','Không tìm được tài xế hỏa tốc sau ba lần phân bổ.',
  '2026-09-20 00:35:00+00','2026-09-20 01:30:00+00',1,
  '2026-09-20 00:35:00+00','2026-09-20 01:30:00+00'
) ON CONFLICT (request_step_id) DO NOTHING;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM orders o
    WHERE o.order_code='9209190000003'
      AND (o.customer_model<>4 OR o.transport_model<>4 OR NOT EXISTS (
        SELECT 1 FROM order_legs l WHERE l.order_id=o.order_id AND l.carrier_code=15
      ))
  ) THEN
    RAISE EXCEPTION 'Scenario SPF-0303 chưa được chuyển đúng sang NVC tức thời';
  END IF;
END
$$;

COMMIT;

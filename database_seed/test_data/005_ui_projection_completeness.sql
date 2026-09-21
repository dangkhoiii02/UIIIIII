\set ON_ERROR_STOP on

BEGIN;
SET LOCAL search_path TO order_mgmt, public;

-- Hai Order của scenario batch đã được tạo thành công nên phải có đủ snapshot
-- tối thiểu cho API list/detail và chặng NVC đang tạo Waybill.
UPDATE orders
   SET pricing_code = CASE order_code
       WHEN '9100000000005' THEN 'PRC-HCM-SUPERSHIP-2026-09'
       ELSE pricing_code
   END
 WHERE order_code IN ('9100000000005', '9100000000006');

INSERT INTO order_parties (
    party_id, order_id, party_type, name, contact_name, phone, email,
    valid_from, version_no, created_at, created_by
) VALUES
('15000000-0000-7000-8000-000000000071','15000000-0000-7000-8000-000000000001',1,'Cửa hàng Nội Thất Mộc Nhiên','Ngô Phương Thảo','0326005091','shop.batch.1205@example.com','2026-09-15 02:05:00+00',1,'2026-09-15 02:05:00+00','batch-worker-01'),
('15000000-0000-7000-8000-000000000072','15000000-0000-7000-8000-000000000001',2,'Dương Minh Quân','Dương Minh Quân','0326005001',NULL,'2026-09-15 02:05:00+00',1,'2026-09-15 02:05:00+00','batch-worker-01'),
('15000000-0000-7000-8000-000000000081','15000000-0000-7000-8000-000000000002',1,'Cửa hàng Nội Thất Mộc Nhiên','Ngô Phương Thảo','0326005091','shop.batch.1205@example.com','2026-09-15 03:12:00+00',1,'2026-09-15 03:12:00+00','batch-worker-02'),
('15000000-0000-7000-8000-000000000082','15000000-0000-7000-8000-000000000002',2,'Mai Khánh Linh','Mai Khánh Linh','0326005002',NULL,'2026-09-15 03:12:00+00',1,'2026-09-15 03:12:00+00','batch-worker-02')
ON CONFLICT (party_id) DO NOTHING;

INSERT INTO order_addresses (
    address_id, order_id, address_type, address_model, source_type, source_code, source_name,
    address_detail, full_address, province_code, district_code, commune_code,
    latitude, longitude, valid_from, version_no, created_at, created_by
) VALUES
('15000000-0000-7000-8000-000000000073','15000000-0000-7000-8000-000000000001',1,1,1,'SHOP-WH-HCM-1205','Kho Thủ Đức','Số 16 đường Võ Văn Ngân','Số 16 đường Võ Văn Ngân, phường Linh Chiểu, thành phố Thủ Đức, Thành phố Hồ Chí Minh','79','769','26812',10.8505000,106.7719000,'2026-09-15 02:05:00+00',1,'2026-09-15 02:05:00+00','batch-worker-01'),
('15000000-0000-7000-8000-000000000074','15000000-0000-7000-8000-000000000001',2,1,2,'ADR-BATCH-1205','Địa chỉ giao hàng','Số 28 đường Nguyễn Cơ Thạch','Số 28 đường Nguyễn Cơ Thạch, phường An Lợi Đông, thành phố Thủ Đức, Thành phố Hồ Chí Minh','79','769','26815',10.7868000,106.7229000,'2026-09-15 02:05:00+00',1,'2026-09-15 02:05:00+00','batch-worker-01'),
('15000000-0000-7000-8000-000000000083','15000000-0000-7000-8000-000000000002',1,1,1,'SHOP-WH-HCM-1205','Kho Thủ Đức','Số 16 đường Võ Văn Ngân','Số 16 đường Võ Văn Ngân, phường Linh Chiểu, thành phố Thủ Đức, Thành phố Hồ Chí Minh','79','769','26812',10.8505000,106.7719000,'2026-09-15 03:12:00+00',1,'2026-09-15 03:12:00+00','batch-worker-02'),
('15000000-0000-7000-8000-000000000084','15000000-0000-7000-8000-000000000002',2,1,2,'ADR-BATCH-1206','Địa chỉ giao hàng','Số 73 đường Số 9','Số 73 đường Số 9, phường Linh Tây, thành phố Thủ Đức, Thành phố Hồ Chí Minh','79','769','26797',10.8568000,106.7541000,'2026-09-15 03:12:00+00',1,'2026-09-15 03:12:00+00','batch-worker-02')
ON CONFLICT (address_id) DO NOTHING;

INSERT INTO order_goods (
    goods_id, order_id, content_type, product_name, declared_value, currency_code, tag_codes,
    valid_from, version_no, created_at, created_by
) VALUES
('15000000-0000-7000-8000-000000000075','15000000-0000-7000-8000-000000000001',2,'Bộ ga giường cotton 1,6 m',540000,'VND',ARRAY[]::smallint[],'2026-09-15 02:05:00+00',1,'2026-09-15 02:05:00+00','batch-worker-01'),
('15000000-0000-7000-8000-000000000085','15000000-0000-7000-8000-000000000002',2,'Đèn bàn LED chống cận',320000,'VND',ARRAY[]::smallint[],'2026-09-15 03:12:00+00',1,'2026-09-15 03:12:00+00','batch-worker-02')
ON CONFLICT (goods_id) DO NOTHING;

INSERT INTO order_items (
    item_id, order_id, goods_id, item_code, product_ref, sku, item_name,
    unit_price, unit_weight_g, quantity, created_at
) VALUES
('15000000-0000-7000-8000-000000000076','15000000-0000-7000-8000-000000000001','15000000-0000-7000-8000-000000000075','ITEM-D105-01','PRD-BEDDING-160','MN-GG-160','Bộ ga giường cotton 1,6 m',540000,1850,1,'2026-09-15 02:05:00+00'),
('15000000-0000-7000-8000-000000000086','15000000-0000-7000-8000-000000000002','15000000-0000-7000-8000-000000000085','ITEM-D105-02','PRD-LAMP-LED','MN-LAMP-LED','Đèn bàn LED chống cận',320000,920,1,'2026-09-15 03:12:00+00')
ON CONFLICT (item_id) DO NOTHING;

INSERT INTO parcel_measures (
    measure_id, order_id, measure_kind, source_type, weight_g, length_cm, width_cm,
    height_cm, measured_at, source_ref, created_at
) VALUES
('15000000-0000-7000-8000-000000000077','15000000-0000-7000-8000-000000000001',1,1,1950,42,32,18,'2026-09-15 02:04:00+00','BATCH-ROW-MEASURE-1205','2026-09-15 02:05:00+00'),
('15000000-0000-7000-8000-000000000087','15000000-0000-7000-8000-000000000002',1,1,1050,30,22,18,'2026-09-15 03:11:00+00','BATCH-ROW-MEASURE-1206','2026-09-15 03:12:00+00')
ON CONFLICT (measure_id) DO NOTHING;

INSERT INTO order_legs (
    leg_id, order_id, stage_code, stage_no, leg_type, stage_status_code, carrier_code,
    carrier_client_code, version_no, created_at, updated_at
) VALUES
('15000000-0000-7000-8000-000000000078','15000000-0000-7000-8000-000000000001','STG-DELIVERY-0001',1,2,'CREATING_WAYBILL',1,'SUPERSHIP-HCM-BATCH-1205',1,'2026-09-15 02:05:05+00','2026-09-15 02:05:20+00'),
('15000000-0000-7000-8000-000000000088','15000000-0000-7000-8000-000000000002','STG-DELIVERY-0001',1,2,'CREATING_WAYBILL',6,'BEST-HCM-BATCH-1206',1,'2026-09-15 03:12:05+00','2026-09-15 03:12:20+00')
ON CONFLICT (leg_id) DO NOTHING;

UPDATE orders
   SET current_leg_id = CASE order_code
       WHEN '9100000000005' THEN '15000000-0000-7000-8000-000000000078'::uuid
       WHEN '9100000000006' THEN '15000000-0000-7000-8000-000000000088'::uuid
   END
 WHERE order_code IN ('9100000000005', '9100000000006');

INSERT INTO leg_endpoints (
    leg_endpoint_id, order_id, leg_id, endpoint_role, location_type, order_address_id,
    location_name, valid_from, version_no, created_at
) VALUES
('15000000-0000-7000-8000-000000000079','15000000-0000-7000-8000-000000000001','15000000-0000-7000-8000-000000000078',1,1,'15000000-0000-7000-8000-000000000073','Kho Thủ Đức','2026-09-15 02:05:05+00',1,'2026-09-15 02:05:05+00'),
('15000000-0000-7000-8000-00000000007a','15000000-0000-7000-8000-000000000001','15000000-0000-7000-8000-000000000078',2,1,'15000000-0000-7000-8000-000000000074','Địa chỉ nhận An Lợi Đông','2026-09-15 02:05:05+00',1,'2026-09-15 02:05:05+00'),
('15000000-0000-7000-8000-000000000089','15000000-0000-7000-8000-000000000002','15000000-0000-7000-8000-000000000088',1,1,'15000000-0000-7000-8000-000000000083','Kho Thủ Đức','2026-09-15 03:12:05+00',1,'2026-09-15 03:12:05+00'),
('15000000-0000-7000-8000-00000000008a','15000000-0000-7000-8000-000000000002','15000000-0000-7000-8000-000000000088',2,1,'15000000-0000-7000-8000-000000000084','Địa chỉ nhận Linh Tây','2026-09-15 03:12:05+00',1,'2026-09-15 03:12:05+00')
ON CONFLICT (leg_endpoint_id) DO NOTHING;

INSERT INTO leg_items (order_id, leg_id, item_id, quantity, created_at) VALUES
('15000000-0000-7000-8000-000000000001','15000000-0000-7000-8000-000000000078','15000000-0000-7000-8000-000000000076',1,'2026-09-15 02:05:05+00'),
('15000000-0000-7000-8000-000000000002','15000000-0000-7000-8000-000000000088','15000000-0000-7000-8000-000000000086',1,'2026-09-15 03:12:05+00')
ON CONFLICT DO NOTHING;

INSERT INTO leg_services (
    leg_service_id, order_id, leg_id, carrier_code, service_code, service_name,
    fulfillment_mode, carrier_client_code, policy_ref, policy_version, pricing_result_ref,
    carrier_fee_amount, shop_shipping_fee_amount, priced_at, valid_from, version_no, created_at
) VALUES
('15000000-0000-7000-8000-0000000000b1','15000000-0000-7000-8000-000000000001','15000000-0000-7000-8000-000000000078',1,'SUPERSHIP-STANDARD','SuperShip giao hàng tiêu chuẩn',2,'SUPERSHIP-HCM-BATCH-1205','SHP-POLICY-SUPERSHIP-HCM','1','PRC-RESULT-BATCH-1205',18000,22000,'2026-09-15 02:05:10+00','2026-09-15 02:05:10+00',1,'2026-09-15 02:05:10+00'),
('15000000-0000-7000-8000-0000000000c1','15000000-0000-7000-8000-000000000002','15000000-0000-7000-8000-000000000088',6,'BEST-STANDARD','BEST Express giao hàng tiêu chuẩn',2,'BEST-HCM-BATCH-1206','SHP-POLICY-BEST-HCM','1','PRC-RESULT-BATCH-1206',19500,24000,'2026-09-15 03:12:10+00','2026-09-15 03:12:10+00',1,'2026-09-15 03:12:10+00')
ON CONFLICT (leg_service_id) DO NOTHING;

INSERT INTO order_requests (
    request_id, order_id, request_code, request_type, request_status, payload_version,
    request_payload, source_type, requested_by_actor_type, requested_by_actor_ref,
    requested_by_display_name, requested_at, correlation_id, version_no, created_at, updated_at
) VALUES
('15000000-0000-7000-8000-0000000000b2','15000000-0000-7000-8000-000000000001','REQ-BATCH-1205-CREATE-WAYBILL','CREATE_WAYBILL',2,1,'{"carrier_code":1,"service_code":"SUPERSHIP-STANDARD","stage_code":"STG-DELIVERY-0001","cod_amount":365000}'::jsonb,4,3,'order-orchestrator','Tiến trình điều phối vận đơn','2026-09-15 02:05:12+00','corr-batch-1205-create-waybill',1,'2026-09-15 02:05:12+00','2026-09-15 02:05:20+00'),
('15000000-0000-7000-8000-0000000000c2','15000000-0000-7000-8000-000000000002','REQ-BATCH-1206-CREATE-WAYBILL','CREATE_WAYBILL',2,1,'{"carrier_code":6,"service_code":"BEST-STANDARD","stage_code":"STG-DELIVERY-0001","cod_amount":0}'::jsonb,4,3,'order-orchestrator','Tiến trình điều phối vận đơn','2026-09-15 03:12:12+00','corr-batch-1206-create-waybill',1,'2026-09-15 03:12:12+00','2026-09-15 03:12:20+00')
ON CONFLICT (request_id) DO NOTHING;

INSERT INTO request_targets (
    request_target_id, order_id, request_id, target_type, leg_id, created_at
) VALUES
('15000000-0000-7000-8000-0000000000b3','15000000-0000-7000-8000-000000000001','15000000-0000-7000-8000-0000000000b2','LEG','15000000-0000-7000-8000-000000000078','2026-09-15 02:05:12+00'),
('15000000-0000-7000-8000-0000000000c3','15000000-0000-7000-8000-000000000002','15000000-0000-7000-8000-0000000000c2','LEG','15000000-0000-7000-8000-000000000088','2026-09-15 03:12:12+00')
ON CONFLICT (request_target_id) DO NOTHING;

INSERT INTO request_steps (
    request_step_id, order_id, request_id, request_target_id, step_no, step_type,
    step_status, carrier_code, correlation_id, external_ref, request_hash,
    attempt_count, started_at, version_no, created_at, updated_at
) VALUES
('15000000-0000-7000-8000-0000000000b4','15000000-0000-7000-8000-000000000001','15000000-0000-7000-8000-0000000000b2','15000000-0000-7000-8000-0000000000b3',1,'CREATE_WAYBILL','PROCESSING',1,'corr-batch-1205-create-waybill','SUPERSHIP-BATCH-1205-REQUEST','f19ca2ba3ce859fb29ca2ba3ce859fb2f19ca2ba3ce859fb29ca2ba3ce859fb2',1,'2026-09-15 02:05:15+00',1,'2026-09-15 02:05:15+00','2026-09-15 02:05:20+00'),
('15000000-0000-7000-8000-0000000000c4','15000000-0000-7000-8000-000000000002','15000000-0000-7000-8000-0000000000c2','15000000-0000-7000-8000-0000000000c3',1,'CREATE_WAYBILL','PROCESSING',6,'corr-batch-1206-create-waybill','BEST-BATCH-1206-REQUEST','3b78e211f7cb9e703b78e211f7cb9e703b78e211f7cb9e703b78e211f7cb9e70',1,'2026-09-15 03:12:15+00',1,'2026-09-15 03:12:15+00','2026-09-15 03:12:20+00')
ON CONFLICT (request_step_id) DO NOTHING;

UPDATE order_status_history h
   SET reason_code = 'WAYBILL_CREATING',
       request_id = CASE o.order_code
           WHEN '9100000000005' THEN '15000000-0000-7000-8000-0000000000b2'::uuid
           WHEN '9100000000006' THEN '15000000-0000-7000-8000-0000000000c2'::uuid
       END,
       reason = CASE o.order_code
           WHEN '9100000000005' THEN 'Đang gửi yêu cầu tạo vận đơn đến SuperShip.'
           WHEN '9100000000006' THEN 'Đang gửi yêu cầu tạo vận đơn đến BEST Express.'
       END
  FROM orders o
 WHERE h.order_id = o.order_id
   AND o.order_code IN ('9100000000005', '9100000000006')
   AND h.status_code = 'SPF-0101';

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
      FROM orders o
     WHERE o.order_code IN ('9100000000005', '9100000000006')
       AND (
         o.current_leg_id IS NULL
         OR NOT EXISTS (SELECT 1 FROM order_parties p WHERE p.order_id=o.order_id AND p.party_type=2 AND p.valid_to IS NULL)
         OR NOT EXISTS (SELECT 1 FROM order_goods g WHERE g.order_id=o.order_id AND g.valid_to IS NULL)
         OR NOT EXISTS (SELECT 1 FROM parcel_measures m WHERE m.order_id=o.order_id)
         OR NOT EXISTS (SELECT 1 FROM leg_services s WHERE s.order_id=o.order_id AND s.valid_to IS NULL)
         OR NOT EXISTS (SELECT 1 FROM order_requests r WHERE r.order_id=o.order_id AND r.request_type='CREATE_WAYBILL')
       )
  ) THEN
    RAISE EXCEPTION 'Order batch hiển thị UI còn thiếu snapshot hoặc NVC/chặng';
  END IF;
END
$$;

COMMIT;

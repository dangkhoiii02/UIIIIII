\set ON_ERROR_STOP on
BEGIN;
SET LOCAL search_path TO order_mgmt, public;

-- ============================================================================
-- 008_instant_delivery_active_completed_coverage.sql
-- Bổ sung 2 kịch bản NVC tức thời hoàn chỉnh:
-- 1. Order 9209190000008: Green SM Express (15) — SPF-0801 Đang giao hàng
-- 2. Order 9209190000009: GrabExpress (16) — SPF-0901 Đã giao hàng thành công
-- ============================================================================

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

-- 1. ORDERS
INSERT INTO orders (
    order_id, order_code, shop_id, soc, status_code, customer_model, transport_model,
    selection_mode, shipping_config_ref, shipping_config_version, configuration_decision_ref,
    pricing_code, cod_amount, collected_amount, cod_collection_status, settled_amount,
    cod_settlement_status, compensation_amount, compensation_status, inspection_type,
    fee_payer, pickup_method, service_codes, pickup_scheduled_from, pickup_scheduled_to,
    delivery_note, delivery_result, exchange_result, created_by_identity_id,
    created_by_membership_id, created_actor_type, created_actor_ref, created_actor_name,
    created_application_id, created_client_id, created_channel, correlation_id,
    version_no, created_at, updated_at, updated_by, current_leg_id, custodian_carrier_code
) VALUES
(
    pg_temp.seed_uuid(8, 1), '9209190000008', pg_temp.seed_uuid(8, 2), 'SOC-260919-GSM-DELIVERING',
    'SPF-0801', 4, 4, 2, 'SHP-CFG-GSM-08', '1', 'DEC-GSM-08',
    'PRC-HCM-GREEN-SM-INSTANT-2026-09', 450000, 0, 1, 0, 1, 0, 1, 2,
    1, 1, ARRAY[1]::smallint[], '2026-09-20 01:00:00+00', '2026-09-20 02:00:00+00',
    'Bánh kem dễ vỡ, vận chuyển nhẹ tay, liên hệ trước khi tới.', 0, 0,
    pg_temp.seed_uuid(8, 70), pg_temp.seed_uuid(8, 71), 1, 'shop-user-08', 'Tiệm Bánh Mật Ngọt',
    pg_temp.seed_uuid(8, 72), pg_temp.seed_uuid(8, 73), 'WEB', 'corr-instant-08',
    6, '2026-09-20 01:00:00+00', '2026-09-20 01:45:00+00', 'instant-workflow',
    NULL, 15
),
(
    pg_temp.seed_uuid(9, 1), '9209190000009', pg_temp.seed_uuid(9, 2), 'SOC-260919-GRAB-DELIVERED',
    'SPF-0901', 4, 4, 2, 'SHP-CFG-GRAB-09', '1', 'DEC-GRAB-09',
    'PRC-HCM-GRAB-INSTANT-2026-09', 680000, 680000, 3, 0, 3, 0, 1, 2,
    2, 1, ARRAY[1]::smallint[], '2026-09-20 01:10:00+00', '2026-09-20 02:00:00+00',
    'Giao giờ hành chính, gọi trước khi đến.', 1, 0,
    pg_temp.seed_uuid(9, 70), pg_temp.seed_uuid(9, 71), 1, 'shop-user-09', 'Linh Kiện Điện Tử Sài Gòn',
    pg_temp.seed_uuid(9, 72), pg_temp.seed_uuid(9, 73), 'WEB', 'corr-instant-09',
    7, '2026-09-20 01:10:00+00', '2026-09-20 01:49:00+00', 'instant-workflow',
    NULL, NULL
)
ON CONFLICT (order_id) DO NOTHING;

-- 2. ADDRESSES
INSERT INTO order_addresses (
    address_id, order_id, address_type, address_model, source_type, source_code, source_name,
    address_detail, full_address, province_code, district_code, commune_code,
    latitude, longitude, valid_from, version_no, created_at, created_by
) VALUES
-- Order 8: Võ Văn Tần -> Nguyễn Huệ
(
    pg_temp.seed_uuid(8, 11), pg_temp.seed_uuid(8, 1), 1, 1, 2, 'ADR-GSM-PICKUP-08', 'Điểm lấy Quận 3',
    'Số 48 đường Võ Văn Tần', 'Số 48 đường Võ Văn Tần, phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí Minh',
    '79', '770', '27139', 10.7786400, 106.6892400, '2026-09-20 01:00:00+00', 1, '2026-09-20 01:00:00+00', 'order-api'
),
(
    pg_temp.seed_uuid(8, 12), pg_temp.seed_uuid(8, 1), 2, 1, 2, 'ADR-GSM-DELIV-08', 'Điểm giao Quận 1',
    '42 Nguyễn Huệ', '42 Nguyễn Huệ, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh',
    '79', '760', '26734', 10.7745000, 106.7032000, '2026-09-20 01:00:00+00', 1, '2026-09-20 01:00:00+00', 'order-api'
),
-- Order 9: Dương Bá Trạc -> Võ Văn Tần
(
    pg_temp.seed_uuid(9, 11), pg_temp.seed_uuid(9, 1), 1, 1, 2, 'ADR-GRAB-PICKUP-09', 'Kho Quận 8',
    '231/15 Dương Bá Trạc', '231/15 Dương Bá Trạc, Phường 1, Quận 8, Thành phố Hồ Chí Minh',
    '79', '776', '27301', 10.7485000, 106.6841000, '2026-09-20 01:10:00+00', 1, '2026-09-20 01:10:00+00', 'order-api'
),
(
    pg_temp.seed_uuid(9, 12), pg_temp.seed_uuid(9, 1), 2, 1, 2, 'ADR-GRAB-DELIV-09', 'Điểm nhận Quận 3',
    '18A Võ Văn Tần', '18A Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí Minh',
    '79', '770', '27139', 10.7775200, 106.6915200, '2026-09-20 01:10:00+00', 1, '2026-09-20 01:10:00+00', 'order-api'
)
ON CONFLICT (address_id) DO NOTHING;

-- 3. PARTIES
INSERT INTO order_parties (
    party_id, order_id, party_type, name, contact_name, phone, email,
    valid_from, version_no, created_at, created_by
) VALUES
(pg_temp.seed_uuid(8, 21), pg_temp.seed_uuid(8, 1), 1, 'Tiệm Bánh Mật Ngọt', 'Nguyễn Hồng Diệp', '0908124567', 'matngot.bakery@example.com', '2026-09-20 01:00:00+00', 1, '2026-09-20 01:00:00+00', 'order-api'),
(pg_temp.seed_uuid(8, 22), pg_temp.seed_uuid(8, 1), 2, 'Trần Minh Trí', 'Trần Minh Trí', '0912345678', 'minhtri@example.com', '2026-09-20 01:00:00+00', 1, '2026-09-20 01:00:00+00', 'order-api'),
(pg_temp.seed_uuid(9, 21), pg_temp.seed_uuid(9, 1), 1, 'Linh Kiện Điện Tử Sài Gòn', 'Phạm Hải Nam', '0917222333', 'linhkien.sg@example.com', '2026-09-20 01:10:00+00', 1, '2026-09-20 01:10:00+00', 'order-api'),
(pg_temp.seed_uuid(9, 22), pg_temp.seed_uuid(9, 1), 2, 'Hoàng Quốc Việt', 'Hoàng Quốc Việt', '0978654321', 'quocviet@example.com', '2026-09-20 01:10:00+00', 1, '2026-09-20 01:10:00+00', 'order-api')
ON CONFLICT (party_id) DO NOTHING;

-- 4. GOODS & ITEMS
INSERT INTO order_goods (
    goods_id, order_id, content_type, product_name, declared_value, currency_code,
    tag_codes, valid_from, version_no, created_at, created_by
) VALUES
(pg_temp.seed_uuid(8, 31), pg_temp.seed_uuid(8, 1), 1, 'Bánh kem sinh nhật cao cấp kèm nến', 450000, 'VND', ARRAY[]::smallint[], '2026-09-20 01:00:00+00', 1, '2026-09-20 01:00:00+00', 'order-api'),
(pg_temp.seed_uuid(9, 31), pg_temp.seed_uuid(9, 1), 1, 'Bộ vi điều khiển và mạch lập trình', 680000, 'VND', ARRAY[]::smallint[], '2026-09-20 01:10:00+00', 1, '2026-09-20 01:10:00+00', 'order-api')
ON CONFLICT (goods_id) DO NOTHING;

INSERT INTO order_items (
    item_id, order_id, goods_id, item_code, product_ref, sku, item_name,
    unit_price, unit_weight_g, quantity, created_at
) VALUES
(pg_temp.seed_uuid(8, 41), pg_temp.seed_uuid(8, 1), pg_temp.seed_uuid(8, 31), 'ITEM-CAKE-01', 'PRD-CAKE-01', 'SKU-CAKE-01', 'Bánh kem sinh nhật cao cấp kèm nến', 450000, 850, 1, '2026-09-20 01:00:00+00'),
(pg_temp.seed_uuid(9, 41), pg_temp.seed_uuid(9, 1), pg_temp.seed_uuid(9, 31), 'ITEM-MCU-01', 'PRD-MCU-01', 'SKU-MCU-01', 'Bộ vi điều khiển và mạch lập trình', 680000, 420, 1, '2026-09-20 01:10:00+00')
ON CONFLICT (item_id) DO NOTHING;

-- 5. MEASURES
INSERT INTO parcel_measures (
    measure_id, order_id, measure_kind, source_type, weight_g, length_cm, width_cm, height_cm,
    measured_at, source_ref, created_at
) VALUES
(pg_temp.seed_uuid(8, 51), pg_temp.seed_uuid(8, 1), 1, 1, 850, 25, 25, 20, '2026-09-20 00:55:00+00', 'SHOP-MEASURE-08', '2026-09-20 01:00:00+00'),
(pg_temp.seed_uuid(9, 51), pg_temp.seed_uuid(9, 1), 1, 1, 420, 15, 10, 5, '2026-09-20 01:05:00+00', 'SHOP-MEASURE-09', '2026-09-20 01:10:00+00')
ON CONFLICT (measure_id) DO NOTHING;

-- 6. ORDER LEGS (Leg 1: PICKUP, Leg 2: DELIVERY)
INSERT INTO order_legs (
    leg_id, order_id, stage_code, stage_no, leg_type, stage_status_code, carrier_code,
    carrier_client_code, started_at, completed_at, version_no, created_at, updated_at
) VALUES
-- Order 8 (Green SM Express: Chặng lấy hoàn tất, chặng giao đang chạy)
(pg_temp.seed_uuid(8, 61), pg_temp.seed_uuid(8, 1), 'STG-PICKUP-0001', 1, 1, 'SPF-0501', 15, 'GSM-HCM-INSTANT-08', '2026-09-20 01:05:00+00', '2026-09-20 01:35:00+00', 1, '2026-09-20 01:00:00+00', '2026-09-20 01:35:00+00'),
(pg_temp.seed_uuid(8, 62), pg_temp.seed_uuid(8, 1), 'STG-DELIVERY-0001', 2, 2, 'SPF-0801', 15, 'GSM-HCM-INSTANT-08', '2026-09-20 01:35:00+00', NULL, 1, '2026-09-20 01:00:00+00', '2026-09-20 01:45:00+00'),
-- Order 9 (GrabExpress: Cả chặng lấy và chặng giao đã hoàn tất)
(pg_temp.seed_uuid(9, 61), pg_temp.seed_uuid(9, 1), 'STG-PICKUP-0001', 1, 1, 'SPF-0501', 16, 'GRAB-HCM-INSTANT-09', '2026-09-20 01:10:00+00', '2026-09-20 01:20:00+00', 1, '2026-09-20 01:10:00+00', '2026-09-20 01:20:00+00'),
(pg_temp.seed_uuid(9, 62), pg_temp.seed_uuid(9, 1), 'STG-DELIVERY-0001', 2, 2, 'SPF-0901', 16, 'GRAB-HCM-INSTANT-09', '2026-09-20 01:20:00+00', '2026-09-20 01:49:00+00', 1, '2026-09-20 01:10:00+00', '2026-09-20 01:49:00+00')
ON CONFLICT (leg_id) DO NOTHING;

UPDATE orders
   SET current_leg_id=pg_temp.seed_uuid(8, 62)
 WHERE order_code='9209190000008';

UPDATE orders
   SET current_leg_id=pg_temp.seed_uuid(9, 62)
 WHERE order_code='9209190000009';

-- 7. LEG ENDPOINTS
INSERT INTO leg_endpoints (
    leg_endpoint_id, order_id, leg_id, endpoint_role, location_type, order_address_id,
    source_module, source_code, location_name, address_model, address_detail, full_address,
    province_code, district_code, commune_code, latitude, longitude, valid_from, version_no, created_at
) VALUES
-- Order 8 Leg 1
(pg_temp.seed_uuid(8, 101), pg_temp.seed_uuid(8, 1), pg_temp.seed_uuid(8, 61), 1, 1, pg_temp.seed_uuid(8, 11), 'ORD', 'EP-08-1-1', 'Điểm lấy hàng', 1, 'Số 48 đường Võ Văn Tần', 'Số 48 đường Võ Văn Tần, phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí Minh', '79', '770', '27139', 10.7786400, 106.6892400, '2026-09-20 01:00:00+00', 1, '2026-09-20 01:00:00+00'),
(pg_temp.seed_uuid(8, 102), pg_temp.seed_uuid(8, 1), pg_temp.seed_uuid(8, 61), 2, 1, pg_temp.seed_uuid(8, 12), 'ORD', 'EP-08-1-2', 'Điểm bàn giao', 1, '42 Nguyễn Huệ', '42 Nguyễn Huệ, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh', '79', '760', '26734', 10.7745000, 106.7032000, '2026-09-20 01:00:00+00', 1, '2026-09-20 01:00:00+00'),
-- Order 8 Leg 2
(pg_temp.seed_uuid(8, 103), pg_temp.seed_uuid(8, 1), pg_temp.seed_uuid(8, 62), 1, 1, pg_temp.seed_uuid(8, 11), 'ORD', 'EP-08-2-1', 'Điểm bắt đầu giao', 1, 'Số 48 đường Võ Văn Tần', 'Số 48 đường Võ Văn Tần, phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí Minh', '79', '770', '27139', 10.7786400, 106.6892400, '2026-09-20 01:00:00+00', 1, '2026-09-20 01:00:00+00'),
(pg_temp.seed_uuid(8, 104), pg_temp.seed_uuid(8, 1), pg_temp.seed_uuid(8, 62), 2, 1, pg_temp.seed_uuid(8, 12), 'ORD', 'EP-08-2-2', 'Điểm giao người nhận', 1, '42 Nguyễn Huệ', '42 Nguyễn Huệ, Phường Bến Nghé, Quận 1, Thành phố Hồ Chí Minh', '79', '760', '26734', 10.7745000, 106.7032000, '2026-09-20 01:00:00+00', 1, '2026-09-20 01:00:00+00'),
-- Order 9 Leg 1
(pg_temp.seed_uuid(9, 101), pg_temp.seed_uuid(9, 1), pg_temp.seed_uuid(9, 61), 1, 1, pg_temp.seed_uuid(9, 11), 'ORD', 'EP-09-1-1', 'Điểm lấy hàng', 1, '231/15 Dương Bá Trạc', '231/15 Dương Bá Trạc, Phường 1, Quận 8, Thành phố Hồ Chí Minh', '79', '776', '27301', 10.7485000, 106.6841000, '2026-09-20 01:10:00+00', 1, '2026-09-20 01:10:00+00'),
(pg_temp.seed_uuid(9, 102), pg_temp.seed_uuid(9, 1), pg_temp.seed_uuid(9, 61), 2, 1, pg_temp.seed_uuid(9, 12), 'ORD', 'EP-09-1-2', 'Điểm bàn giao', 1, '18A Võ Văn Tần', '18A Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí Minh', '79', '770', '27139', 10.7775200, 106.6915200, '2026-09-20 01:10:00+00', 1, '2026-09-20 01:10:00+00'),
-- Order 9 Leg 2
(pg_temp.seed_uuid(9, 103), pg_temp.seed_uuid(9, 1), pg_temp.seed_uuid(9, 62), 1, 1, pg_temp.seed_uuid(9, 11), 'ORD', 'EP-09-2-1', 'Điểm bắt đầu giao', 1, '231/15 Dương Bá Trạc', '231/15 Dương Bá Trạc, Phường 1, Quận 8, Thành phố Hồ Chí Minh', '79', '776', '27301', 10.7485000, 106.6841000, '2026-09-20 01:10:00+00', 1, '2026-09-20 01:10:00+00'),
(pg_temp.seed_uuid(9, 104), pg_temp.seed_uuid(9, 1), pg_temp.seed_uuid(9, 62), 2, 1, pg_temp.seed_uuid(9, 12), 'ORD', 'EP-09-2-2', 'Điểm giao người nhận', 1, '18A Võ Văn Tần', '18A Võ Văn Tần, Phường Võ Thị Sáu, Quận 3, Thành phố Hồ Chí Minh', '79', '770', '27139', 10.7775200, 106.6915200, '2026-09-20 01:10:00+00', 1, '2026-09-20 01:10:00+00')
ON CONFLICT (leg_endpoint_id) DO NOTHING;

-- 8. LEG ITEMS
INSERT INTO leg_items (order_id, leg_id, item_id, quantity, created_at) VALUES
(pg_temp.seed_uuid(8, 1), pg_temp.seed_uuid(8, 61), pg_temp.seed_uuid(8, 41), 1, '2026-09-20 01:00:00+00'),
(pg_temp.seed_uuid(8, 1), pg_temp.seed_uuid(8, 62), pg_temp.seed_uuid(8, 41), 1, '2026-09-20 01:00:00+00'),
(pg_temp.seed_uuid(9, 1), pg_temp.seed_uuid(9, 61), pg_temp.seed_uuid(9, 41), 1, '2026-09-20 01:10:00+00'),
(pg_temp.seed_uuid(9, 1), pg_temp.seed_uuid(9, 62), pg_temp.seed_uuid(9, 41), 1, '2026-09-20 01:10:00+00')
ON CONFLICT DO NOTHING;

-- 9. LEG SERVICES
INSERT INTO leg_services (
    leg_service_id, order_id, leg_id, carrier_code, service_code, service_name,
    fulfillment_mode, carrier_client_code, vehicle_type_code, policy_ref, policy_version,
    pricing_result_ref, carrier_fee_amount, shop_shipping_fee_amount, priced_at,
    valid_from, version_no, created_at
) VALUES
(
    pg_temp.seed_uuid(8, 71), pg_temp.seed_uuid(8, 1), pg_temp.seed_uuid(8, 61), 15,
    'GSM-INSTANT-BIKE', 'Green SM Express giao hỏa tốc bằng xe máy điện', 2, 'GSM-HCM-INSTANT-08',
    'ELECTRIC_MOTORBIKE', 'GSM-INSTANT-HCM-2026', '1', 'PRC-GSM-08-1', 25000, 32000,
    '2026-09-20 01:00:00+00', '2026-09-20 01:00:00+00', 1, '2026-09-20 01:00:00+00'
),
(
    pg_temp.seed_uuid(8, 72), pg_temp.seed_uuid(8, 1), pg_temp.seed_uuid(8, 62), 15,
    'GSM-INSTANT-BIKE', 'Green SM Express giao hỏa tốc bằng xe máy điện', 2, 'GSM-HCM-INSTANT-08',
    'ELECTRIC_MOTORBIKE', 'GSM-INSTANT-HCM-2026', '1', 'PRC-GSM-08-2', 25000, 32000,
    '2026-09-20 01:00:00+00', '2026-09-20 01:00:00+00', 1, '2026-09-20 01:00:00+00'
),
(
    pg_temp.seed_uuid(9, 71), pg_temp.seed_uuid(9, 1), pg_temp.seed_uuid(9, 61), 16,
    'GRAB-INSTANT-BIKE', 'GrabExpress giao hỏa tốc bằng xe máy', 2, 'GRAB-HCM-INSTANT-09',
    'MOTORBIKE', 'GRAB-INSTANT-HCM-2026', '1', 'PRC-GRAB-09-1', 22000, 29000,
    '2026-09-20 01:10:00+00', '2026-09-20 01:10:00+00', 1, '2026-09-20 01:10:00+00'
),
(
    pg_temp.seed_uuid(9, 72), pg_temp.seed_uuid(9, 1), pg_temp.seed_uuid(9, 62), 16,
    'GRAB-INSTANT-BIKE', 'GrabExpress giao hỏa tốc bằng xe máy', 2, 'GRAB-HCM-INSTANT-09',
    'MOTORBIKE', 'GRAB-INSTANT-HCM-2026', '1', 'PRC-GRAB-09-2', 22000, 29000,
    '2026-09-20 01:10:00+00', '2026-09-20 01:10:00+00', 1, '2026-09-20 01:10:00+00'
)
ON CONFLICT (leg_service_id) DO NOTHING;

-- 10. ORDER REQUESTS
INSERT INTO order_requests (
    request_id, order_id, request_code, request_type, request_status,
    request_payload, source_type, requested_by_actor_type, requested_by_actor_ref,
    requested_by_display_name, requested_at, completed_at, result_code, correlation_id,
    created_at, updated_at
) VALUES
(
    pg_temp.seed_uuid(8, 80), pg_temp.seed_uuid(8, 1), 'REQ-GSM-BOOKING-08', 2, 3,
    '{"carrier_code":15,"service":"GSM-INSTANT-BIKE","model":"INSTANT"}'::jsonb, 1, 1,
    'shop-user-08', 'Tiệm Bánh Mật Ngọt', '2026-09-20 01:00:00+00', '2026-09-20 01:02:00+00',
    'SUCCESS', 'corr-gsm-book-08', '2026-09-20 01:00:00+00', '2026-09-20 01:02:00+00'
),
(
    pg_temp.seed_uuid(9, 80), pg_temp.seed_uuid(9, 1), 'REQ-GRAB-BOOKING-09', 2, 3,
    '{"carrier_code":16,"service":"GRAB-INSTANT-BIKE","model":"INSTANT"}'::jsonb, 1, 1,
    'shop-user-09', 'Linh Kiện Điện Tử Sài Gòn', '2026-09-20 01:10:00+00', '2026-09-20 01:11:00+00',
    'SUCCESS', 'corr-grab-book-09', '2026-09-20 01:10:00+00', '2026-09-20 01:11:00+00'
)
ON CONFLICT (request_id) DO NOTHING;

-- 11. WAYBILLS
-- Lưu ý: Format GSM phải khớp ^GSM(-EXP)?-[0-9]{8}-[0-9]{6}(-D)?$
--        Format GRAB phải khớp ^DELV-[0-9]{10}-[A-Z0-9]{5}$
--        Waybill status = 1 (Active) thì ended_at = NULL
--        Waybill status = 2 (Completed) thì ended_at NOT NULL
INSERT INTO waybills (
    waybill_id, order_id, carrier_code, carrier_waybill_code, carrier_client_code,
    origin_request_id, sender_party_id, receiver_party_id, pickup_address_id,
    delivery_address_id, goods_id, measure_id, leg_service_id, pickup_method, fee_payer,
    inspection_type, cod_amount, collection_amount, declared_value, delivery_note,
    carrier_options, snapshot_schema_version, snapshot_hash, carrier_sorting_code,
    waybill_status, request_sent_at, carrier_accepted_at, ended_at,
    carrier_status_code, carrier_status_name, carrier_status_at, created_at, updated_at
) VALUES
(
    pg_temp.seed_uuid(8, 91), pg_temp.seed_uuid(8, 1), 15, 'GSM-EXP-20260920-000008', 'GSM-HCM-INSTANT-08',
    pg_temp.seed_uuid(8, 80), pg_temp.seed_uuid(8, 21), pg_temp.seed_uuid(8, 22), pg_temp.seed_uuid(8, 11),
    pg_temp.seed_uuid(8, 12), pg_temp.seed_uuid(8, 31), pg_temp.seed_uuid(8, 51), pg_temp.seed_uuid(8, 72),
    1, 1, 2, 450000, 482000, 450000, 'Bánh kem dễ vỡ, vận chuyển nhẹ tay, liên hệ trước khi tới.',
    '[]'::jsonb, 1, encode(sha256(convert_to('GSM-EXP-20260920-000008:snapshot:v1','UTF8')),'hex'),
    'GSM-HCM-01', 1, '2026-09-20 01:01:00+00', '2026-09-20 01:02:00+00', NULL,
    'IN_DELIVERY', 'Đang giao tới người nhận', '2026-09-20 01:45:00+00',
    '2026-09-20 01:02:00+00', '2026-09-20 01:45:00+00'
),
(
    pg_temp.seed_uuid(9, 91), pg_temp.seed_uuid(9, 1), 16, 'DELV-1708923452-B9C0D', 'GRAB-HCM-INSTANT-09',
    pg_temp.seed_uuid(9, 80), pg_temp.seed_uuid(9, 21), pg_temp.seed_uuid(9, 22), pg_temp.seed_uuid(9, 11),
    pg_temp.seed_uuid(9, 12), pg_temp.seed_uuid(9, 31), pg_temp.seed_uuid(9, 51), pg_temp.seed_uuid(9, 72),
    1, 2, 2, 680000, 709000, 680000, 'Giao giờ hành chính, gọi trước khi đến.',
    '[]'::jsonb, 1, encode(sha256(convert_to('DELV-1708923452-B9C0D:snapshot:v1','UTF8')),'hex'),
    'GRAB-HCM-01', 2, '2026-09-20 01:10:00+00', '2026-09-20 01:11:00+00', '2026-09-20 01:49:00+00',
    'COMPLETED', 'Giao hàng thành công', '2026-09-20 01:49:00+00',
    '2026-09-20 01:11:00+00', '2026-09-20 01:49:00+00'
)
ON CONFLICT (waybill_id) DO NOTHING;

-- 12. LEG WAYBILLS (Cùng NVC & Waybill cho cả 2 chặng Lấy và Giao)
INSERT INTO leg_waybills (
    leg_waybill_id, order_id, leg_id, waybill_id, sequence_no, active_from, active_to, created_at
) VALUES
-- Order 8
(pg_temp.seed_uuid(8, 141), pg_temp.seed_uuid(8, 1), pg_temp.seed_uuid(8, 61), pg_temp.seed_uuid(8, 91), 1, '2026-09-20 01:02:00+00', '2026-09-20 01:35:00+00', '2026-09-20 01:02:00+00'),
(pg_temp.seed_uuid(8, 142), pg_temp.seed_uuid(8, 1), pg_temp.seed_uuid(8, 62), pg_temp.seed_uuid(8, 91), 1, '2026-09-20 01:35:00+00', NULL, '2026-09-20 01:35:00+00'),
-- Order 9
(pg_temp.seed_uuid(9, 141), pg_temp.seed_uuid(9, 1), pg_temp.seed_uuid(9, 61), pg_temp.seed_uuid(9, 91), 1, '2026-09-20 01:11:00+00', '2026-09-20 01:20:00+00', '2026-09-20 01:11:00+00'),
(pg_temp.seed_uuid(9, 142), pg_temp.seed_uuid(9, 1), pg_temp.seed_uuid(9, 62), pg_temp.seed_uuid(9, 91), 1, '2026-09-20 01:20:00+00', '2026-09-20 01:49:00+00', '2026-09-20 01:20:00+00')
ON CONFLICT (leg_waybill_id) DO NOTHING;

-- 13. REQUEST STEPS
INSERT INTO request_steps (
    request_step_id, order_id, request_id, step_no, step_type, step_status,
    carrier_code, result_waybill_id, correlation_id, external_ref, request_hash,
    result_code, attempt_count, started_at, completed_at, created_at, updated_at
) VALUES
(
    pg_temp.seed_uuid(8, 151), pg_temp.seed_uuid(8, 1), pg_temp.seed_uuid(8, 80), 1,
    'BOOKING', 'SUCCESS', 15, NULL, 'corr-step-gsm-08', 'GSM-EXT-08',
    'hash-gsm-08', 'SUCCESS', 1, '2026-09-20 01:01:00+00', '2026-09-20 01:02:00+00',
    '2026-09-20 01:01:00+00', '2026-09-20 01:02:00+00'
),
(
    pg_temp.seed_uuid(9, 151), pg_temp.seed_uuid(9, 1), pg_temp.seed_uuid(9, 80), 1,
    'BOOKING', 'SUCCESS', 16, NULL, 'corr-step-grab-09', 'GRAB-EXT-09',
    'hash-grab-09', 'SUCCESS', 1, '2026-09-20 01:10:00+00', '2026-09-20 01:11:00+00',
    '2026-09-20 01:10:00+00', '2026-09-20 01:11:00+00'
)
ON CONFLICT (request_step_id) DO NOTHING;

-- 14. OPERATIONAL ASSIGNMENTS (Tài xế & Phương tiện)
INSERT INTO operational_assignments (
    assignment_id, order_id, assignment_no, leg_id, waybill_id, carrier_code,
    role_type, carrier_shipper_code, assignee_name, assignee_phone, vehicle_ref,
    vehicle_type_code, source_module, source_ref, valid_from, valid_to, end_type,
    created_at, updated_at
) VALUES
(
    pg_temp.seed_uuid(8, 161), pg_temp.seed_uuid(8, 1), 1, pg_temp.seed_uuid(8, 62),
    pg_temp.seed_uuid(8, 91), 15, 2, 'GSM-DRV-218', 'Trần Minh Khoa', '0938124567',
    '59-TD 218.45', 2, 'CAR', 'GSM-ASSIGN-08', '2026-09-20 01:05:00+00', NULL, NULL,
    '2026-09-20 01:05:00+00', '2026-09-20 01:45:00+00'
),
(
    pg_temp.seed_uuid(9, 161), pg_temp.seed_uuid(9, 1), 1, pg_temp.seed_uuid(9, 62),
    pg_temp.seed_uuid(9, 91), 16, 2, 'GRAB-DRV-509', 'Lê Quốc Bảo', '0973456789',
    '59-U2 509.86', 1, 'CAR', 'GRAB-ASSIGN-09', '2026-09-20 01:15:00+00', '2026-09-20 01:49:00+00', 1,
    '2026-09-20 01:15:00+00', '2026-09-20 01:49:00+00'
)
ON CONFLICT (assignment_id) DO NOTHING;

-- 15. TRACKING EVENTS
INSERT INTO tracking_events (
    event_id, order_id, leg_id, waybill_id, event_source, source_namespace, dedupe_key,
    source_module, source_event_ref, event_type, event_code, event_name, stage_status_code,
    carrier_status_code, carrier_status_name, occurred_at, received_at, order_sequence_no,
    apply_result, created_at
) VALUES
-- Order 8 events
(pg_temp.seed_uuid(8, 201), pg_temp.seed_uuid(8, 1), NULL, NULL, 2, 'ORD', 'GSM-08-01', 'ORD', 'REF-08-01', 'STATUS_OBSERVED', 'SPF-0101', 'Đang tạo đơn NVC', NULL, NULL, NULL, '2026-09-20 01:00:00+00', '2026-09-20 01:00:05+00', 1, 1, '2026-09-20 01:00:05+00'),
(pg_temp.seed_uuid(8, 202), pg_temp.seed_uuid(8, 1), pg_temp.seed_uuid(8, 61), pg_temp.seed_uuid(8, 91), 1, 'CAR', 'GSM-08-02', 'CAR', 'REF-08-02', 'STATUS_OBSERVED', 'SPF-0302', 'Đang tìm tài xế', 'SPF-0302', 'FINDING', 'Đang tìm tài xế', '2026-09-20 01:02:00+00', '2026-09-20 01:02:05+00', 2, 1, '2026-09-20 01:02:05+00'),
(pg_temp.seed_uuid(8, 203), pg_temp.seed_uuid(8, 1), pg_temp.seed_uuid(8, 61), pg_temp.seed_uuid(8, 91), 1, 'CAR', 'GSM-08-03', 'CAR', 'REF-08-03', 'STATUS_OBSERVED', 'SPF-0301', 'Chờ lấy hàng', 'SPF-0301', 'ASSIGNED', 'Đã phân tài xế', '2026-09-20 01:05:00+00', '2026-09-20 01:05:05+00', 3, 1, '2026-09-20 01:05:05+00'),
(pg_temp.seed_uuid(8, 204), pg_temp.seed_uuid(8, 1), pg_temp.seed_uuid(8, 61), pg_temp.seed_uuid(8, 91), 1, 'CAR', 'GSM-08-04', 'CAR', 'REF-08-04', 'STATUS_OBSERVED', 'SPF-0401', 'Đang lấy hàng', 'SPF-0401', 'ARRIVING', 'Tài xế đang đến điểm lấy', '2026-09-20 01:15:00+00', '2026-09-20 01:15:05+00', 4, 1, '2026-09-20 01:15:05+00'),
(pg_temp.seed_uuid(8, 205), pg_temp.seed_uuid(8, 1), pg_temp.seed_uuid(8, 61), pg_temp.seed_uuid(8, 91), 1, 'CAR', 'GSM-08-05', 'CAR', 'REF-08-05', 'STATUS_OBSERVED', 'SPF-0501', 'Đã lấy hàng', 'SPF-0501', 'PICKUP_COMPLETED', 'Đã nhận hàng từ Shop', '2026-09-20 01:35:00+00', '2026-09-20 01:35:05+00', 5, 1, '2026-09-20 01:35:05+00'),
(pg_temp.seed_uuid(8, 206), pg_temp.seed_uuid(8, 1), pg_temp.seed_uuid(8, 62), pg_temp.seed_uuid(8, 91), 1, 'CAR', 'GSM-08-06', 'CAR', 'REF-08-06', 'STATUS_OBSERVED', 'SPF-0801', 'Đang giao hàng', 'SPF-0801', 'IN_DELIVERY', 'Đang giao tới người nhận', '2026-09-20 01:45:00+00', '2026-09-20 01:45:05+00', 6, 1, '2026-09-20 01:45:05+00'),
-- Order 9 events
(pg_temp.seed_uuid(9, 201), pg_temp.seed_uuid(9, 1), NULL, NULL, 2, 'ORD', 'GRAB-09-01', 'ORD', 'REF-09-01', 'STATUS_OBSERVED', 'SPF-0101', 'Đang tạo đơn NVC', NULL, NULL, NULL, '2026-09-20 01:10:00+00', '2026-09-20 01:10:05+00', 1, 1, '2026-09-20 01:10:05+00'),
(pg_temp.seed_uuid(9, 202), pg_temp.seed_uuid(9, 1), pg_temp.seed_uuid(9, 61), pg_temp.seed_uuid(9, 91), 1, 'CAR', 'GRAB-09-02', 'CAR', 'REF-09-02', 'STATUS_OBSERVED', 'SPF-0302', 'Đang tìm tài xế', 'SPF-0302', 'ALLOCATING', 'Đang tìm tài xế', '2026-09-20 01:11:00+00', '2026-09-20 01:11:05+00', 2, 1, '2026-09-20 01:11:05+00'),
(pg_temp.seed_uuid(9, 203), pg_temp.seed_uuid(9, 1), pg_temp.seed_uuid(9, 61), pg_temp.seed_uuid(9, 91), 1, 'CAR', 'GRAB-09-03', 'CAR', 'REF-09-03', 'STATUS_OBSERVED', 'SPF-0301', 'Chờ lấy hàng', 'SPF-0301', 'PENDING_PICKUP', 'Đã có tài xế nhận chuyến', '2026-09-20 01:12:00+00', '2026-09-20 01:12:05+00', 3, 1, '2026-09-20 01:12:05+00'),
(pg_temp.seed_uuid(9, 204), pg_temp.seed_uuid(9, 1), pg_temp.seed_uuid(9, 61), pg_temp.seed_uuid(9, 91), 1, 'CAR', 'GRAB-09-04', 'CAR', 'REF-09-04', 'STATUS_OBSERVED', 'SPF-0401', 'Đang lấy hàng', 'SPF-0401', 'PICKING_UP', 'Tài xế đang đến lấy kiện', '2026-09-20 01:15:00+00', '2026-09-20 01:15:05+00', 4, 1, '2026-09-20 01:15:05+00'),
(pg_temp.seed_uuid(9, 205), pg_temp.seed_uuid(9, 1), pg_temp.seed_uuid(9, 61), pg_temp.seed_uuid(9, 91), 1, 'CAR', 'GRAB-09-05', 'CAR', 'REF-09-05', 'STATUS_OBSERVED', 'SPF-0501', 'Đã lấy hàng', 'SPF-0501', 'PENDING_DROP_OFF', 'Đã lấy kiện', '2026-09-20 01:20:00+00', '2026-09-20 01:20:05+00', 5, 1, '2026-09-20 01:20:05+00'),
(pg_temp.seed_uuid(9, 206), pg_temp.seed_uuid(9, 1), pg_temp.seed_uuid(9, 62), pg_temp.seed_uuid(9, 91), 1, 'CAR', 'GRAB-09-06', 'CAR', 'REF-09-06', 'STATUS_OBSERVED', 'SPF-0801', 'Đang giao hàng', 'SPF-0801', 'IN_DELIVERY', 'Tài xế đang đi giao', '2026-09-20 01:25:00+00', '2026-09-20 01:25:05+00', 6, 1, '2026-09-20 01:25:05+00'),
(pg_temp.seed_uuid(9, 207), pg_temp.seed_uuid(9, 1), pg_temp.seed_uuid(9, 62), pg_temp.seed_uuid(9, 91), 1, 'CAR', 'GRAB-09-07', 'CAR', 'REF-09-07', 'STATUS_OBSERVED', 'SPF-0901', 'Đã giao hàng', 'SPF-0901', 'COMPLETED', 'Giao thành công', '2026-09-20 01:49:00+00', '2026-09-20 01:49:05+00', 7, 1, '2026-09-20 01:49:05+00')
ON CONFLICT (event_id) DO NOTHING;

-- 16. ORDER STATUS HISTORY
INSERT INTO order_status_history (
    status_history_id, order_id, from_status_code, status_code, version_no,
    reason_code, reason, changed_by_actor_type, changed_by_actor_ref, changed_at, created_at
) VALUES
-- Order 8 history
(pg_temp.seed_uuid(8, 251), pg_temp.seed_uuid(8, 1), NULL, 'SPF-0101', 1, 'ORDER_CREATED', 'Tạo đơn hỏa tốc thành công.', 1, 'shop-user-08', '2026-09-20 01:00:00+00', '2026-09-20 01:00:00+00'),
(pg_temp.seed_uuid(8, 252), pg_temp.seed_uuid(8, 1), 'SPF-0101', 'SPF-0302', 2, 'ALLOCATING', 'Green SM Express bắt đầu tìm tài xế.', 3, 'carrier-gsm', '2026-09-20 01:02:00+00', '2026-09-20 01:02:00+00'),
(pg_temp.seed_uuid(8, 253), pg_temp.seed_uuid(8, 1), 'SPF-0302', 'SPF-0301', 3, 'DRIVER_ASSIGNED', 'Tài xế nhận chuyến, chờ lấy hàng.', 3, 'carrier-gsm', '2026-09-20 01:05:00+00', '2026-09-20 01:05:00+00'),
(pg_temp.seed_uuid(8, 254), pg_temp.seed_uuid(8, 1), 'SPF-0301', 'SPF-0401', 4, 'PICKING_UP', 'Tài xế đang di chuyển tới điểm lấy.', 3, 'carrier-gsm', '2026-09-20 01:15:00+00', '2026-09-20 01:15:00+00'),
(pg_temp.seed_uuid(8, 255), pg_temp.seed_uuid(8, 1), 'SPF-0401', 'SPF-0501', 5, 'PICKED_UP', 'Shop đã bàn giao kiện cho tài xế.', 3, 'carrier-gsm', '2026-09-20 01:35:00+00', '2026-09-20 01:35:00+00'),
(pg_temp.seed_uuid(8, 256), pg_temp.seed_uuid(8, 1), 'SPF-0501', 'SPF-0801', 6, 'IN_DELIVERY', 'Tài xế đang trên đường giao tới người nhận.', 3, 'carrier-gsm', '2026-09-20 01:45:00+00', '2026-09-20 01:45:00+00'),
-- Order 9 history
(pg_temp.seed_uuid(9, 251), pg_temp.seed_uuid(9, 1), NULL, 'SPF-0101', 1, 'ORDER_CREATED', 'Tạo đơn GrabExpress thành công.', 1, 'shop-user-09', '2026-09-20 01:10:00+00', '2026-09-20 01:10:00+00'),
(pg_temp.seed_uuid(9, 252), pg_temp.seed_uuid(9, 1), 'SPF-0101', 'SPF-0302', 2, 'ALLOCATING', 'GrabExpress đang phân bổ tài xế.', 3, 'carrier-grab', '2026-09-20 01:11:00+00', '2026-09-20 01:11:00+00'),
(pg_temp.seed_uuid(9, 253), pg_temp.seed_uuid(9, 1), 'SPF-0302', 'SPF-0301', 3, 'DRIVER_ASSIGNED', 'Đã tìm được tài xế.', 3, 'carrier-grab', '2026-09-20 01:12:00+00', '2026-09-20 01:12:00+00'),
(pg_temp.seed_uuid(9, 254), pg_temp.seed_uuid(9, 1), 'SPF-0301', 'SPF-0401', 4, 'PICKING_UP', 'Tài xế đến lấy hàng.', 3, 'carrier-grab', '2026-09-20 01:15:00+00', '2026-09-20 01:15:00+00'),
(pg_temp.seed_uuid(9, 255), pg_temp.seed_uuid(9, 1), 'SPF-0401', 'SPF-0501', 5, 'PICKED_UP', 'Đã lấy hàng thành công.', 3, 'carrier-grab', '2026-09-20 01:20:00+00', '2026-09-20 01:20:00+00'),
(pg_temp.seed_uuid(9, 256), pg_temp.seed_uuid(9, 1), 'SPF-0501', 'SPF-0801', 6, 'IN_DELIVERY', 'Tài xế đang đi giao.', 3, 'carrier-grab', '2026-09-20 01:25:00+00', '2026-09-20 01:25:00+00'),
(pg_temp.seed_uuid(9, 257), pg_temp.seed_uuid(9, 1), 'SPF-0801', 'SPF-0901', 7, 'DELIVERED', 'Đã giao hàng thành công tận tay người nhận.', 3, 'carrier-grab', '2026-09-20 01:49:00+00', '2026-09-20 01:49:00+00')
ON CONFLICT (status_history_id) DO NOTHING;

-- 17. ORDER RESULTS (Order 9 đã giao thành công)
INSERT INTO order_results (
    result_id, order_id, leg_id, waybill_id, result_type, result_code,
    source_module, source_ref, occurred_at, valid_from, version_no, created_at
) VALUES
(
    pg_temp.seed_uuid(9, 281), pg_temp.seed_uuid(9, 1), pg_temp.seed_uuid(9, 62),
    pg_temp.seed_uuid(9, 91), 1, 1, 'CAR', 'GRAB-DELIV-PROOF-09',
    '2026-09-20 01:49:00+00', '2026-09-20 01:49:00+00', 1, '2026-09-20 01:49:00+00'
)
ON CONFLICT (result_id) DO NOTHING;

-- 18. ORDER IMAGES (Bằng chứng giao hàng POD cho Order 9)
INSERT INTO order_images (
    image_id, order_id, image_code, file_ref, image_type, description,
    visibility_scope, source_type, source_name, carrier_code, leg_id, waybill_id,
    result_id, status, created_at
) VALUES
(
    pg_temp.seed_uuid(9, 291), pg_temp.seed_uuid(9, 1), 'POD-9209190000009-01',
    '/images/delivery-proof/proof-delivered-v1.png', 'DELIVERY',
    'Ảnh chụp bàn giao kiện hàng cho người nhận', 1, 3, 'GrabExpress', 16,
    pg_temp.seed_uuid(9, 62), pg_temp.seed_uuid(9, 91), pg_temp.seed_uuid(9, 281), 1,
    '2026-09-20 01:49:00+00'
)
ON CONFLICT (image_id) DO NOTHING;

COMMIT;

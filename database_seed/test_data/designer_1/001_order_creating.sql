\set ON_ERROR_STOP on

BEGIN;
SET LOCAL search_path TO order_mgmt, public;

-- D1-01: Order đang chờ J&T Express cấp mã vận đơn.
INSERT INTO orders (
    order_id, order_code, shop_id, soc, status_code, customer_model, transport_model,
    selection_mode, shipping_config_ref, shipping_config_version, configuration_decision_ref,
    pricing_code, cod_amount, inspection_type, fee_payer, pickup_method, service_codes,
    pickup_scheduled_from, pickup_scheduled_to, delivery_note, created_by_identity_id,
    created_by_membership_id, created_actor_type, created_actor_ref, created_actor_name,
    created_application_id, created_client_id, created_channel, correlation_id,
    version_no, created_at, updated_at, updated_by
) VALUES (
    '11000000-0000-7000-8000-000000000001', '9100000000001',
    '10000000-0000-7000-8000-000000000001', 'SHOP-HN-2026-000184', 'SPF-0101',
    3, 3, 1, 'SHP-CONFIG-HN-000184', '12', 'SHP-DECISION-20260919-000001',
    'PRC-HN-JNT-2026-09', 485000, 2, 1, 1, ARRAY[1]::smallint[],
    '2026-09-20 01:00:00+00', '2026-09-20 04:00:00+00',
    'Gọi người nhận trước khi giao khoảng 15 phút.', 'identity-shop-000184',
    'membership-shop-000184-owner', 1, 'shop-user-000184', 'Trần Minh Khôi',
    'supership-web', 'web-chrome-shop-000184', 'WEB', 'corr-d101-create-20260919-000001',
    1, '2026-09-19 08:00:00+00', '2026-09-19 08:03:00+00', 'order-api'
);

INSERT INTO order_addresses (
    address_id, order_id, address_type, address_model, source_type, source_code, source_name,
    address_detail, full_address, province_code, district_code, commune_code, latitude, longitude,
    valid_from, version_no, created_at, created_by
) VALUES
    ('11000000-0000-7000-8000-000000000011', '11000000-0000-7000-8000-000000000001', 1, 1, 1,
     'SHOP-WH-HN-0184', 'Kho hàng Cầu Giấy', 'Số 18 ngõ 76 phố Duy Tân',
     'Số 18 ngõ 76 phố Duy Tân, phường Dịch Vọng Hậu, quận Cầu Giấy, Hà Nội',
     '01', '001', '00007', 21.0312150, 105.7815400,
     '2026-09-19 08:00:00+00', 1, '2026-09-19 08:00:00+00', 'order-api'),
    ('11000000-0000-7000-8000-000000000012', '11000000-0000-7000-8000-000000000001', 2, 1, 2,
     'ADR-HCM-000921', 'Địa chỉ giao hàng', 'Số 42 đường Nguyễn Văn Thương',
     'Số 42 đường Nguyễn Văn Thương, phường 25, quận Bình Thạnh, Thành phố Hồ Chí Minh',
     '79', '765', '26965', 10.8034100, 106.7163200,
     '2026-09-19 08:00:00+00', 1, '2026-09-19 08:00:00+00', 'order-api');

INSERT INTO order_parties (
    party_id, order_id, party_type, name, contact_name, phone, email,
    valid_from, version_no, created_at, created_by
) VALUES
    ('11000000-0000-7000-8000-000000000021', '11000000-0000-7000-8000-000000000001', 1,
     'Cửa hàng Gia Dụng An Nhiên', 'Phạm Thu Hằng', '0326001001', 'hang.pham.0184@example.com',
     '2026-09-19 08:00:00+00', 1, '2026-09-19 08:00:00+00', 'order-api'),
    ('11000000-0000-7000-8000-000000000022', '11000000-0000-7000-8000-000000000001', 2,
     'Lê Hoàng Nam', 'Lê Hoàng Nam', '0326001002', 'nam.le.0921@example.net',
     '2026-09-19 08:00:00+00', 1, '2026-09-19 08:00:00+00', 'order-api');

INSERT INTO order_goods (
    goods_id, order_id, content_type, declared_value, currency_code, tag_codes,
    valid_from, version_no, created_at, created_by
) VALUES (
    '11000000-0000-7000-8000-000000000031', '11000000-0000-7000-8000-000000000001',
    2, 620000, 'VND', ARRAY[1]::smallint[], '2026-09-19 08:00:00+00', 1,
    '2026-09-19 08:00:00+00', 'order-api'
);

INSERT INTO order_items (
    item_id, order_id, goods_id, item_code, product_ref, sku, item_name,
    unit_price, unit_weight_g, quantity, created_at
) VALUES (
    '11000000-0000-7000-8000-000000000041', '11000000-0000-7000-8000-000000000001',
    '11000000-0000-7000-8000-000000000031', 'ITEM-D101-01', 'PRD-GLASS-SET-06',
    'AN-GD-LY06', 'Bộ 6 ly thủy tinh chịu nhiệt 350 ml', 310000, 1200, 2,
    '2026-09-19 08:00:00+00'
);

INSERT INTO parcel_measures (
    measure_id, order_id, measure_kind, source_type, weight_g, length_cm, width_cm,
    height_cm, measured_at, source_ref, created_at
) VALUES (
    '11000000-0000-7000-8000-000000000051', '11000000-0000-7000-8000-000000000001',
    1, 1, 2650, 34, 26, 22, '2026-09-19 07:55:00+00', 'SHOP-MEASURE-D101',
    '2026-09-19 08:00:00+00'
);

INSERT INTO order_legs (
    leg_id, order_id, stage_code, stage_no, leg_type, stage_status_code, carrier_code,
    carrier_client_code, version_no, created_at, updated_at
) VALUES (
    '11000000-0000-7000-8000-000000000061', '11000000-0000-7000-8000-000000000001',
    'STG-D101-DELIVERY', 1, 2, 'CREATING_WAYBILL', 3, 'JNT-HN-SHOP-0184', 1,
    '2026-09-19 08:01:00+00', '2026-09-19 08:03:00+00'
);

UPDATE orders
   SET current_leg_id = '11000000-0000-7000-8000-000000000061'
 WHERE order_id = '11000000-0000-7000-8000-000000000001';

INSERT INTO leg_endpoints (
    leg_endpoint_id, order_id, leg_id, endpoint_role, location_type, order_address_id,
    location_name, valid_from, version_no, created_at
) VALUES
    ('11000000-0000-7000-8000-000000000071', '11000000-0000-7000-8000-000000000001',
     '11000000-0000-7000-8000-000000000061', 1, 1, '11000000-0000-7000-8000-000000000011',
     'Kho hàng Cầu Giấy', '2026-09-19 08:01:00+00', 1, '2026-09-19 08:01:00+00'),
    ('11000000-0000-7000-8000-000000000072', '11000000-0000-7000-8000-000000000001',
     '11000000-0000-7000-8000-000000000061', 2, 1, '11000000-0000-7000-8000-000000000012',
     'Địa chỉ nhận Bình Thạnh', '2026-09-19 08:01:00+00', 1, '2026-09-19 08:01:00+00');

INSERT INTO leg_items (order_id, leg_id, item_id, quantity, created_at) VALUES (
    '11000000-0000-7000-8000-000000000001', '11000000-0000-7000-8000-000000000061',
    '11000000-0000-7000-8000-000000000041', 2, '2026-09-19 08:01:00+00'
);

INSERT INTO leg_services (
    leg_service_id, order_id, leg_id, carrier_code, service_code, service_name,
    fulfillment_mode, carrier_client_code, policy_ref, policy_version, pricing_result_ref,
    carrier_fee_amount, shop_shipping_fee_amount, priced_at, valid_from, version_no, created_at
) VALUES (
    '11000000-0000-7000-8000-000000000081', '11000000-0000-7000-8000-000000000001',
    '11000000-0000-7000-8000-000000000061', 3, 'JNT-STANDARD', 'Chuyển phát tiêu chuẩn',
    2, 'JNT-HN-SHOP-0184', 'SHP-POLICY-JNT-NATIONWIDE', '8', 'PRC-RESULT-D101-001',
    31500, 36000, '2026-09-19 08:01:30+00', '2026-09-19 08:01:30+00', 1,
    '2026-09-19 08:01:30+00'
);

INSERT INTO order_requests (
    request_id, order_id, request_code, request_type, request_status, payload_version,
    request_payload, source_type, requested_by_actor_type, requested_by_actor_ref,
    requested_by_display_name, requested_at, correlation_id, version_no, created_at, updated_at
) VALUES (
    '11000000-0000-7000-8000-000000000091', '11000000-0000-7000-8000-000000000001',
    'REQ-D101-CREATE-WAYBILL', 'CREATE_WAYBILL', 2, 1,
    '{"carrier_code":3,"service_code":"JNT-STANDARD","stage_code":"STG-D101-DELIVERY","cod_amount":485000}'::jsonb,
    4, 3, 'order-orchestrator', 'Tiến trình điều phối vận đơn', '2026-09-19 08:02:00+00',
    'corr-d101-waybill-20260919-000001', 1, '2026-09-19 08:02:00+00', '2026-09-19 08:03:00+00'
);

INSERT INTO request_targets (
    request_target_id, order_id, request_id, target_type, leg_id, created_at
) VALUES (
    '11000000-0000-7000-8000-000000000092', '11000000-0000-7000-8000-000000000001',
    '11000000-0000-7000-8000-000000000091', 'LEG',
    '11000000-0000-7000-8000-000000000061', '2026-09-19 08:02:00+00'
);

INSERT INTO request_steps (
    request_step_id, order_id, request_id, request_target_id, step_no, step_type,
    step_status, carrier_code, correlation_id, external_ref, request_hash,
    attempt_count, started_at, version_no, created_at, updated_at
) VALUES (
    '11000000-0000-7000-8000-000000000093', '11000000-0000-7000-8000-000000000001',
    '11000000-0000-7000-8000-000000000091', '11000000-0000-7000-8000-000000000092',
    1, 'CREATE_WAYBILL', 'PROCESSING', 3, 'corr-d101-waybill-20260919-000001',
    'CAR-JNT-REQUEST-20260919-810001', repeat('1', 64), 1, '2026-09-19 08:02:05+00', 1,
    '2026-09-19 08:02:05+00', '2026-09-19 08:03:00+00'
);

INSERT INTO order_status_history (
    status_history_id, order_id, status_code, version_no, request_id, reason_code,
    reason, changed_by_actor_type, changed_by_actor_ref, changed_at, created_at
) VALUES (
    '11000000-0000-7000-8000-0000000000a1', '11000000-0000-7000-8000-000000000001',
    'SPF-0101', 1, '11000000-0000-7000-8000-000000000091', 'WAYBILL_CREATING',
    'Đã gửi yêu cầu tạo vận đơn đến J&T Express và đang chờ phản hồi.', 3,
    'order-orchestrator', '2026-09-19 08:02:05+00', '2026-09-19 08:02:05+00'
);

COMMIT;

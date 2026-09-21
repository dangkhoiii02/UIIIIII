-- SuperShip Module Order - consolidated DataSeed
-- Pure SQL: no \ir dependencies; execute after database_ddl/order_mgmt_ddl.sql.
-- Order: reference -> D1 -> D2 -> UI completeness -> API coverage -> finance -> validation.


-- ===== SOURCE: reference_data/order_statuses.sql =====
SET search_path TO order_mgmt, public;

INSERT INTO order_statuses (
    status_code,
    status_name,
    status_group,
    sort_no,
    is_terminal,
    is_active,
    description,
    created_at,
    updated_at
)
VALUES
    ('SPF-0101', 'Đang tạo đơn NVC',                 'CREATION',             1,  false, true, 'Đang gửi hoặc chờ kết quả tạo đơn từ nhà vận chuyển.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0102', 'Tạo đơn NVC lỗi',                 'CREATION',             2,  false, true, 'Tạo đơn nhà vận chuyển không thành công và có thể cần xử lý lại.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0201', 'Đã hủy',                          'CANCELLATION',         3,  true,  true, 'Đơn hàng đã được hủy thành công.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0202', 'Hủy đơn NVC lỗi',                 'CANCELLATION',         4,  false, true, 'Yêu cầu hủy tại nhà vận chuyển không thành công hoặc cần tra soát.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0301', 'Chờ lấy hàng',                    'PICKUP_WAITING',       5,  false, true, 'Đơn hàng đã sẵn sàng và đang chờ được lấy.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0401', 'Đang lấy hàng',                   'PICKUP',               6,  false, true, 'Nhà vận chuyển đang thực hiện lấy hàng.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0402', 'Lấy hàng thất bại',               'PICKUP',               7,  false, true, 'Lần lấy hàng không thành công.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0403', 'Đang yêu cầu lấy lại',            'PICKUP',               8,  false, true, 'Đang xử lý yêu cầu lấy lại hàng.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0501', 'Đã lấy hàng',                     'PICKUP_COMPLETED',      9,  false, true, 'Hàng đã được lấy khỏi điểm gửi.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0502', 'Đã nhập kho/bưu cục lấy',         'PICKUP_COMPLETED',      10, false, true, 'Hàng đã được nhập tại kho hoặc bưu cục lấy.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0601', 'Chờ bàn giao',                    'HANDOVER',              11, false, true, 'Hàng đang chờ bàn giao sang chặng hoặc nhà vận chuyển tiếp theo.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0602', 'NVC giao đang nhận hàng',         'HANDOVER',              12, false, true, 'Nhà vận chuyển giao đang thực hiện nhận bàn giao.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0603', 'Bàn giao thất bại',               'HANDOVER',              13, false, true, 'Lần bàn giao hàng không thành công.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0604', 'Đang yêu cầu bàn giao lại',       'HANDOVER',              14, false, true, 'Đang xử lý yêu cầu bàn giao lại.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0605', 'NVC giao đã nhận hàng',           'HANDOVER',              15, false, true, 'Nhà vận chuyển giao đã nhận bàn giao hàng.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0606', 'Đã nhập kho NVC giao',            'HANDOVER',              16, false, true, 'Hàng đã được nhập kho của nhà vận chuyển giao.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0701', 'Đang trung chuyển',                'TRANSIT',               17, false, true, 'Hàng đang được trung chuyển giữa các điểm khai thác.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0702', 'Đã đến kho/bưu cục giao',         'TRANSIT',               18, false, true, 'Hàng đã đến kho hoặc bưu cục phục vụ giao hàng.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0801', 'Đang giao hàng',                  'DELIVERY',              19, false, true, 'Nhà vận chuyển đang giao hàng tới người nhận.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0802', 'Giao hàng thất bại',              'DELIVERY',              20, false, true, 'Lần giao hàng không thành công.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0803', 'Đang yêu cầu giao lại',           'DELIVERY',              21, false, true, 'Đang xử lý yêu cầu giao lại hàng.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0901', 'Đã giao hàng',                    'DELIVERY_COMPLETED',    22, true,  true, 'Hàng đã được giao đầy đủ thành công.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0902', 'Đã giao một phần',                'DELIVERY_COMPLETED',    23, false, true, 'Một phần hàng đã được giao; phần còn lại tiếp tục được xử lý.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-1001', 'Chờ xác nhận chuyển hoàn',        'RETURN',                24, false, true, 'Đang chờ xác nhận yêu cầu chuyển hoàn.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-1002', 'Đã xác nhận chuyển hoàn',         'RETURN',                25, false, true, 'Yêu cầu chuyển hoàn đã được xác nhận.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-1003', 'Chờ lấy hàng hoàn',               'RETURN',                26, false, true, 'Đang chờ lấy hàng để thực hiện chiều hoàn.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-1004', 'Đang lấy hàng hoàn',              'RETURN',                27, false, true, 'Nhà vận chuyển đang lấy hàng cho chiều hoàn.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-1005', 'Lấy hàng hoàn thất bại',          'RETURN',                28, false, true, 'Lần lấy hàng hoàn không thành công.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-1006', 'Đang yêu cầu lấy lại hàng hoàn',  'RETURN',                29, false, true, 'Đang xử lý yêu cầu lấy lại hàng hoàn.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-1007', 'Đã lấy hàng hoàn',                'RETURN',                30, false, true, 'Hàng hoàn đã được lấy thành công.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-1008', 'Đã nhập kho NVC hoàn',            'RETURN',                31, false, true, 'Hàng hoàn đã được nhập kho nhà vận chuyển hoàn.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-1009', 'Đang chuyển hoàn',                'RETURN',                32, false, true, 'Hàng đang được vận chuyển theo chiều hoàn.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-1101', 'Đã đến kho trả trung gian',       'RETURN_DELIVERY',       33, false, true, 'Hàng hoàn đã đến kho trả trung gian.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-1102', 'Đang trả cho NVC hoàn cuối',      'RETURN_DELIVERY',       34, false, true, 'Đang bàn giao hàng cho nhà vận chuyển thực hiện chặng hoàn cuối.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-1103', 'Trả NVC hoàn cuối thất bại',      'RETURN_DELIVERY',       35, false, true, 'Lần bàn giao cho nhà vận chuyển hoàn cuối không thành công.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-1104', 'Đã trả cho NVC hoàn cuối',        'RETURN_DELIVERY',       36, false, true, 'Đã bàn giao hàng cho nhà vận chuyển hoàn cuối.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-1105', 'Đã đến kho trả cuối',             'RETURN_DELIVERY',       37, false, true, 'Hàng đã đến kho phục vụ trả cuối.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-1106', 'Đang trả hàng',                   'RETURN_DELIVERY',       38, false, true, 'Nhà vận chuyển đang trả hàng về điểm nhận hoàn.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-1107', 'Trả hàng thất bại',               'RETURN_DELIVERY',       39, false, true, 'Lần trả hàng không thành công.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-1108', 'Đang yêu cầu trả lại',            'RETURN_DELIVERY',       40, false, true, 'Đang xử lý yêu cầu trả lại hàng.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-1201', 'Đã trả hàng',                     'COMPLETED',             41, true,  true, 'Hàng đã được trả đầy đủ thành công.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-1202', 'Đổi trả thành công',              'COMPLETED',             42, true,  true, 'Nghiệp vụ đổi trả đã hoàn tất thành công.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-1203', 'Đã trả một phần',                 'COMPLETED',             43, true,  true, 'Nghiệp vụ trả một phần đã hoàn tất theo kết quả xác nhận.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0302', 'Đang tìm tài xế',                 'DRIVER_ALLOCATION',     44, false, true, 'Nhà vận chuyển tức thời đang tìm tài xế.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00'),
    ('SPF-0303', 'Không tìm được tài xế',           'DRIVER_ALLOCATION',     45, false, true, 'Không còn phương án tìm tài xế tự động; cần retry, đổi phương án hoặc hủy.', '2026-09-19 00:00:00+00', '2026-09-19 00:00:00+00')
ON CONFLICT (status_code) DO UPDATE
SET status_name = EXCLUDED.status_name,
    status_group = EXCLUDED.status_group,
    sort_no = EXCLUDED.sort_no,
    is_terminal = EXCLUDED.is_terminal,
    is_active = EXCLUDED.is_active,
    description = EXCLUDED.description,
    updated_at = '2026-09-19 00:00:00+00';

-- ===== SOURCE: validate_reference.sql =====

SET search_path TO order_mgmt, public;

DO $$
DECLARE
    expected_count integer := 45;
    actual_count integer;
BEGIN
    SELECT count(*)
      INTO actual_count
      FROM order_statuses
     WHERE status_code = ANY (ARRAY[
        'SPF-0101','SPF-0102','SPF-0201','SPF-0202','SPF-0301',
        'SPF-0401','SPF-0402','SPF-0403','SPF-0501','SPF-0502',
        'SPF-0601','SPF-0602','SPF-0603','SPF-0604','SPF-0605',
        'SPF-0606','SPF-0701','SPF-0702','SPF-0801','SPF-0802',
        'SPF-0803','SPF-0901','SPF-0902','SPF-1001','SPF-1002',
        'SPF-1003','SPF-1004','SPF-1005','SPF-1006','SPF-1007',
        'SPF-1008','SPF-1009','SPF-1101','SPF-1102','SPF-1103',
        'SPF-1104','SPF-1105','SPF-1106','SPF-1107','SPF-1108',
        'SPF-1201','SPF-1202','SPF-1203','SPF-0302','SPF-0303'
     ]::varchar[]);

    IF actual_count <> expected_count THEN
        RAISE EXCEPTION 'Order status seed is incomplete: expected %, found %', expected_count, actual_count;
    END IF;

    IF (SELECT count(*) FROM order_statuses WHERE status_code LIKE 'SPF-%') <> expected_count THEN
        RAISE EXCEPTION 'Order status seed có mã SPF dư ngoài baseline 45 trạng thái';
    END IF;

    IF EXISTS (
        SELECT sort_no
          FROM order_statuses
         WHERE status_code LIKE 'SPF-%'
         GROUP BY sort_no
        HAVING count(*) > 1
    ) OR (SELECT min(sort_no) FROM order_statuses WHERE status_code LIKE 'SPF-%') <> 1
       OR (SELECT max(sort_no) FROM order_statuses WHERE status_code LIKE 'SPF-%') <> 45 THEN
        RAISE EXCEPTION 'Order status seed có sort_no trùng hoặc không liên tục từ 1 đến 45';
    END IF;

    IF EXISTS (
        SELECT 1
          FROM order_statuses
         WHERE status_code LIKE 'SPF-%'
           AND is_terminal IS DISTINCT FROM (
                status_code = ANY (ARRAY['SPF-0201','SPF-0901','SPF-1201','SPF-1202','SPF-1203']::varchar[])
           )
    ) THEN
        RAISE EXCEPTION 'is_terminal không khớp baseline trạng thái Order';
    END IF;

    IF EXISTS (
        SELECT 1
          FROM order_statuses
         WHERE status_code LIKE 'SPF-%'
           AND (status_name = '' OR status_group = '' OR sort_no < 1)
    ) THEN
        RAISE EXCEPTION 'Order status seed contains an empty name/group or invalid sort number';
    END IF;
END
$$;

SELECT status_code, status_name, status_group, sort_no, is_terminal, is_active
  FROM order_statuses
 WHERE status_code LIKE 'SPF-%'
 ORDER BY sort_no;

-- ===== SOURCE: test_data/designer_1/001_order_creating.sql =====

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
    'STG-DELIVERY-0001', 1, 2, 'CREATING_WAYBILL', 3, 'JNT-HN-SHOP-0184', 1,
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
    '{"carrier_code":3,"service_code":"JNT-STANDARD","stage_code":"STG-DELIVERY-0001","cod_amount":485000}'::jsonb,
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
    'CAR-JNT-REQUEST-20260919-810001', 'a3a363552b00924769e2f4a7c642599d8be79f308bcc5a515cdcb4b1ca106460', 1, '2026-09-19 08:02:05+00', 1,
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

-- ===== SOURCE: test_data/designer_1/002_delivery_success.sql =====
BEGIN;
SET LOCAL search_path TO order_mgmt, public;

-- D1-02: GHN lấy và giao hàng thành công toàn bộ.
INSERT INTO orders (order_id,order_code,shop_id,soc,status_code,customer_model,transport_model,selection_mode,shipping_config_ref,shipping_config_version,configuration_decision_ref,pricing_code,cod_amount,inspection_type,fee_payer,pickup_method,service_codes,pickup_scheduled_from,pickup_scheduled_to,delivery_note,delivery_result,created_by_identity_id,created_by_membership_id,created_actor_type,created_actor_ref,created_actor_name,created_application_id,created_client_id,created_channel,correlation_id,version_no,created_at,updated_at,updated_by)
VALUES ('12000000-0000-7000-8000-000000000001','9100000000002','10000000-0000-7000-8000-000000000001','SHOP-DN-2026-000327','SPF-0901',3,3,1,'SHP-CONFIG-DN-000327','9','SHP-DECISION-20260910-000002','PRC-DN-GHN-2026-09',0,1,1,1,ARRAY[]::smallint[],'2026-09-11 01:00:00+00','2026-09-11 03:00:00+00','Giao trong giờ hành chính, bảo vệ tòa nhà nhận giúp.',1,'identity-shop-000327','membership-shop-000327-owner',1,'shop-user-000327','Nguyễn Thảo Vy','supership-web','web-edge-shop-000327','WEB','corr-d102-create-20260910-000002',8,'2026-09-10 09:00:00+00','2026-09-13 09:20:00+00','tracking-consumer');

INSERT INTO order_addresses (address_id,order_id,address_type,address_model,source_type,source_code,source_name,address_detail,full_address,province_code,district_code,commune_code,latitude,longitude,valid_from,version_no,created_at,created_by) VALUES
('12000000-0000-7000-8000-000000000011','12000000-0000-7000-8000-000000000001',1,1,1,'SHOP-WH-DN-0327','Kho hàng Hải Châu','Số 126 đường Hoàng Diệu','Số 126 đường Hoàng Diệu, phường Phước Ninh, quận Hải Châu, Đà Nẵng','48','492','20242',16.0609100,108.2177200,'2026-09-10 09:00:00+00',1,'2026-09-10 09:00:00+00','order-api'),
('12000000-0000-7000-8000-000000000012','12000000-0000-7000-8000-000000000001',2,1,2,'ADR-HUE-000512','Địa chỉ giao hàng','Căn hộ 1206, số 25 đường Tố Hữu','Căn hộ 1206, số 25 đường Tố Hữu, phường Xuân Phú, thành phố Huế, Thừa Thiên Huế','46','474','19815',16.4579200,107.6081700,'2026-09-10 09:00:00+00',1,'2026-09-10 09:00:00+00','order-api');

INSERT INTO order_parties (party_id,order_id,party_type,name,contact_name,phone,email,valid_from,version_no,created_at,created_by) VALUES
('12000000-0000-7000-8000-000000000021','12000000-0000-7000-8000-000000000001',1,'Cửa hàng Mỹ phẩm Mộc Nhiên','Võ Ngọc Diễm','0326002001','diem.vo.0327@example.com','2026-09-10 09:00:00+00',1,'2026-09-10 09:00:00+00','order-api'),
('12000000-0000-7000-8000-000000000022','12000000-0000-7000-8000-000000000001',2,'Đặng Quốc Bảo','Đặng Quốc Bảo','0326002002','bao.dang.0512@example.net','2026-09-10 09:00:00+00',1,'2026-09-10 09:00:00+00','order-api');

INSERT INTO order_goods (goods_id,order_id,content_type,product_name,declared_value,currency_code,tag_codes,valid_from,version_no,created_at,created_by)
VALUES ('12000000-0000-7000-8000-000000000031','12000000-0000-7000-8000-000000000001',1,'Bộ sản phẩm chăm sóc da trà xanh',780000,'VND',ARRAY[]::smallint[],'2026-09-10 09:00:00+00',1,'2026-09-10 09:00:00+00','order-api');
INSERT INTO order_items (item_id,order_id,goods_id,item_code,product_ref,sku,item_name,unit_price,unit_weight_g,quantity,created_at)
VALUES ('12000000-0000-7000-8000-000000000041','12000000-0000-7000-8000-000000000001','12000000-0000-7000-8000-000000000031','ITEM-D102-01','PRD-SKIN-GT-04','MN-CS-TRAXANH','Bộ chăm sóc da trà xanh bốn món',780000,850,1,'2026-09-10 09:00:00+00');
INSERT INTO parcel_measures (measure_id,order_id,measure_kind,source_type,weight_g,length_cm,width_cm,height_cm,measured_at,source_ref,created_at)
VALUES ('12000000-0000-7000-8000-000000000051','12000000-0000-7000-8000-000000000001',1,1,980,28,20,16,'2026-09-10 08:55:00+00','SHOP-MEASURE-D102','2026-09-10 09:00:00+00');
INSERT INTO order_legs (leg_id,order_id,stage_code,stage_no,leg_type,stage_status_code,carrier_code,carrier_client_code,started_at,completed_at,version_no,created_at,updated_at)
VALUES ('12000000-0000-7000-8000-000000000061','12000000-0000-7000-8000-000000000001','STG-DELIVERY-0001',1,2,'DELIVERED',2,'GHN-DN-SHOP-0327','2026-09-11 01:20:00+00','2026-09-13 09:15:00+00',5,'2026-09-10 09:01:00+00','2026-09-13 09:20:00+00');
UPDATE orders SET current_leg_id='12000000-0000-7000-8000-000000000061',custodian_carrier_code=2 WHERE order_id='12000000-0000-7000-8000-000000000001';
INSERT INTO leg_items (order_id,leg_id,item_id,quantity,created_at) VALUES ('12000000-0000-7000-8000-000000000001','12000000-0000-7000-8000-000000000061','12000000-0000-7000-8000-000000000041',1,'2026-09-10 09:01:00+00');
INSERT INTO leg_services (leg_service_id,order_id,leg_id,carrier_code,service_code,service_name,fulfillment_mode,carrier_client_code,policy_ref,policy_version,pricing_result_ref,carrier_fee_amount,shop_shipping_fee_amount,priced_at,valid_from,version_no,created_at)
VALUES ('12000000-0000-7000-8000-000000000071','12000000-0000-7000-8000-000000000001','12000000-0000-7000-8000-000000000061',2,'GHN-STANDARD','Giao hàng tiêu chuẩn',2,'GHN-DN-SHOP-0327','SHP-POLICY-GHN-CENTRAL','6','PRC-RESULT-D102-001',22500,27000,'2026-09-10 09:01:30+00','2026-09-10 09:01:30+00',1,'2026-09-10 09:01:30+00');

INSERT INTO order_requests (request_id,order_id,request_code,request_type,request_status,payload_version,request_payload,source_type,requested_by_actor_type,requested_by_actor_ref,requested_by_display_name,requested_at,result_code,completed_at,correlation_id,version_no,created_at,updated_at)
VALUES ('12000000-0000-7000-8000-000000000081','12000000-0000-7000-8000-000000000001','REQ-D102-CREATE-WAYBILL','CREATE_WAYBILL',3,1,'{"carrier_code":2,"service_code":"GHN-STANDARD","cod_amount":0}'::jsonb,4,3,'order-orchestrator','Tiến trình điều phối vận đơn','2026-09-10 09:02:00+00','WAYBILL_CREATED','2026-09-10 09:02:18+00','corr-d102-waybill-20260910-000002',1,'2026-09-10 09:02:00+00','2026-09-10 09:02:18+00');
INSERT INTO waybills (waybill_id,order_id,carrier_code,carrier_waybill_code,carrier_client_code,origin_request_id,sender_party_id,receiver_party_id,pickup_address_id,delivery_address_id,goods_id,measure_id,leg_service_id,pickup_method,fee_payer,inspection_type,cod_amount,collection_amount,declared_value,delivery_note,carrier_options,snapshot_schema_version,snapshot_hash,carrier_sorting_code,waybill_status,carrier_status_code,carrier_status_name,carrier_status_at,request_sent_at,carrier_accepted_at,created_at,ended_at,updated_at)
VALUES ('12000000-0000-7000-8000-000000000091','12000000-0000-7000-8000-000000000001',2,'GY8YLSDK','GHN-DN-SHOP-0327','12000000-0000-7000-8000-000000000081','12000000-0000-7000-8000-000000000021','12000000-0000-7000-8000-000000000022','12000000-0000-7000-8000-000000000011','12000000-0000-7000-8000-000000000012','12000000-0000-7000-8000-000000000031','12000000-0000-7000-8000-000000000051','12000000-0000-7000-8000-000000000071',1,1,1,0,0,780000,'Giao trong giờ hành chính, bảo vệ tòa nhà nhận giúp.','[{"key":"service_type_id","value":"2","name":"Loại dịch vụ GHN"},{"key":"payment_type_id","value":"1","name":"Shop trả phí vận chuyển"},{"key":"required_note","value":"KHONGCHOXEMHANG","name":"Không cho xem hàng"},{"key":"pick_shift","value":"[2]","name":"Ca lấy hàng GHN"}]'::jsonb,1,'da5e066e5c5770fcf63b9ea3b07307a9889ab51606efae917b63a1826e292a01','100-A2-09-00',2,'delivered','Giao hàng thành công','2026-09-13 09:15:00+00','2026-09-10 09:02:02+00','2026-09-10 09:02:18+00','2026-09-10 09:02:18+00','2026-09-13 09:15:00+00','2026-09-13 09:20:00+00');
INSERT INTO leg_waybills (leg_waybill_id,order_id,leg_id,waybill_id,sequence_no,active_from,created_at) VALUES ('12000000-0000-7000-8000-000000000092','12000000-0000-7000-8000-000000000001','12000000-0000-7000-8000-000000000061','12000000-0000-7000-8000-000000000091',1,'2026-09-10 09:02:18+00','2026-09-10 09:02:18+00');
INSERT INTO request_steps (request_step_id,order_id,request_id,step_no,step_type,step_status,carrier_code,result_waybill_id,correlation_id,external_ref,request_hash,result_code,attempt_count,started_at,completed_at,version_no,created_at,updated_at)
VALUES ('12000000-0000-7000-8000-000000000093','12000000-0000-7000-8000-000000000001','12000000-0000-7000-8000-000000000081',1,'CREATE_WAYBILL','SUCCESS',2,'12000000-0000-7000-8000-000000000091','corr-d102-waybill-20260910-000002','GHN-BOOKING-20260910-327002','04ced387b9c0efce2641a7ffd3152823441d4f1a2937e03ee778c012b04e3912','WAYBILL_CREATED',1,'2026-09-10 09:02:02+00','2026-09-10 09:02:18+00',1,'2026-09-10 09:02:02+00','2026-09-10 09:02:18+00');

INSERT INTO transport_attempts (attempt_id,order_id,leg_id,waybill_id,carrier_code,attempt_code,attempt_type,attempt_no,status,received_by_name,received_by_relation,source_ref,started_at,ended_at,version_no,created_at,updated_at) VALUES
('12000000-0000-7000-8000-0000000000a1','12000000-0000-7000-8000-000000000001','12000000-0000-7000-8000-000000000061','12000000-0000-7000-8000-000000000091',2,'ATT-D102-PICKUP-01',1,1,2,'Võ Ngọc Diễm','Người gửi','GHN-PICKUP-327002','2026-09-11 01:20:00+00','2026-09-11 01:42:00+00',1,'2026-09-11 01:20:00+00','2026-09-11 01:42:00+00'),
('12000000-0000-7000-8000-0000000000a2','12000000-0000-7000-8000-000000000001','12000000-0000-7000-8000-000000000061','12000000-0000-7000-8000-000000000091',2,'ATT-D102-DELIVERY-01',2,1,2,'Phan Minh Tuấn','Bảo vệ tòa nhà','GHN-DELIVERY-512002','2026-09-13 08:35:00+00','2026-09-13 09:15:00+00',1,'2026-09-13 08:35:00+00','2026-09-13 09:15:00+00');

INSERT INTO tracking_events (event_id,order_id,leg_id,waybill_id,attempt_id,event_source,source_namespace,dedupe_key,source_module,source_event_ref,event_fingerprint,payload_hash,event_type,event_code,event_name,stage_status_code,carrier_status_code,carrier_status_name,province_code,province_name,district_code,district_name,commune_code,commune_name,facility_code,facility_name,occurred_at,received_at,order_sequence_no,leg_sequence_no,source_sequence_ref,apply_result,created_at) VALUES
('12000000-0000-7000-8000-0000000000b1','12000000-0000-7000-8000-000000000001','12000000-0000-7000-8000-000000000061','12000000-0000-7000-8000-000000000091',NULL,1,'GHN','D102-READY-001','CAR','GHN-EVT-327002-01','6f8b775b7c487288f3bda1eb205524b486d2b64c93809d8ade173dbe3718d563','fcf434742bcca2bda5e29b13f8103b84e142a0cf163014f7395d443b954d87c2','ORDER_STATUS','READY_TO_PICK','Chờ lấy hàng','WAITING_PICKUP','ready_to_pick','Chờ lấy hàng','48','Đà Nẵng','492','Hải Châu','20242','Phước Ninh',NULL,NULL,'2026-09-10 09:03:00+00','2026-09-10 09:03:06+00',1,1,'1',1,'2026-09-10 09:03:06+00'),
('12000000-0000-7000-8000-0000000000b2','12000000-0000-7000-8000-000000000001','12000000-0000-7000-8000-000000000061','12000000-0000-7000-8000-000000000091','12000000-0000-7000-8000-0000000000a1',1,'GHN','D102-PICKED-002','CAR','GHN-EVT-327002-02','dcfb275209fa4592fcaa4ba8412cdc3736a757159d85a65a304b63dc48992b76','31fc81cdc547c866faacb244acf99beb18c684e31c10ff8fdd3a65699744c99f','PICKUP','PICKED','Đã lấy hàng','PICKED_UP','picked','Đã lấy hàng','48','Đà Nẵng','492','Hải Châu','20242','Phước Ninh','GHN-DN-HC-01','Bưu cục Hải Châu','2026-09-11 01:42:00+00','2026-09-11 01:42:09+00',2,2,'2',1,'2026-09-11 01:42:09+00'),
('12000000-0000-7000-8000-0000000000b3','12000000-0000-7000-8000-000000000001','12000000-0000-7000-8000-000000000061','12000000-0000-7000-8000-000000000091',NULL,1,'GHN','D102-TRANSIT-003','CAR','GHN-EVT-327002-03','6379cb3e6c1e5df7146824c773243032852af8c38ccfc802b872187c056988a1','88daed48ee519857b3510c52f4441a6b6f98e95de16e13eb550842811193c16e','TRANSIT','TRANSPORTING','Đang trung chuyển','IN_TRANSIT','transporting','Đang trung chuyển','46','Thừa Thiên Huế','474','Thành phố Huế','19815','Xuân Phú','GHN-HUE-HUB-01','Kho trung chuyển Huế','2026-09-12 04:10:00+00','2026-09-12 04:10:14+00',3,3,'3',1,'2026-09-12 04:10:14+00'),
('12000000-0000-7000-8000-0000000000b4','12000000-0000-7000-8000-000000000001','12000000-0000-7000-8000-000000000061','12000000-0000-7000-8000-000000000091','12000000-0000-7000-8000-0000000000a2',1,'GHN','D102-DELIVERING-004','CAR','GHN-EVT-327002-04','39cd5b28635e195a8470bc2c21d1fd6e81d49736146f6ca1b6c1cfd821d63ce3','f01d01bb71a2f8361979ff012b00ddd761cdfd5809f818b44cd88a352dc34ce7','DELIVERY','DELIVERING','Đang giao hàng','DELIVERING','delivering','Đang giao hàng','46','Thừa Thiên Huế','474','Thành phố Huế','19815','Xuân Phú',NULL,NULL,'2026-09-13 08:35:00+00','2026-09-13 08:35:08+00',4,4,'4',1,'2026-09-13 08:35:08+00'),
('12000000-0000-7000-8000-0000000000b5','12000000-0000-7000-8000-000000000001','12000000-0000-7000-8000-000000000061','12000000-0000-7000-8000-000000000091','12000000-0000-7000-8000-0000000000a2',1,'GHN','D102-DELIVERED-005','CAR','GHN-EVT-327002-05','159f451553d89f2eb3a3eb0630064e0f18b8ddfeb235044c35b0ff8fbc89e164','6af2931c6e1d2c9692369e2229c3d8c6c19bf57b3cddf0a8a805ede4830272e5','DELIVERY','DELIVERED','Giao hàng thành công','DELIVERED','delivered','Giao hàng thành công','46','Thừa Thiên Huế','474','Thành phố Huế','19815','Xuân Phú',NULL,NULL,'2026-09-13 09:15:00+00','2026-09-13 09:15:05+00',5,5,'5',1,'2026-09-13 09:15:05+00');

INSERT INTO order_status_history (status_history_id,order_id,from_status_code,status_code,version_no,tracking_event_id,request_id,reason_code,reason,changed_by_actor_type,changed_by_actor_ref,changed_at,created_at) VALUES
('12000000-0000-7000-8000-0000000000c1','12000000-0000-7000-8000-000000000001',NULL,'SPF-0101',1,NULL,'12000000-0000-7000-8000-000000000081','WAYBILL_CREATING','Đang tạo vận đơn GHN.',3,'order-orchestrator','2026-09-10 09:02:02+00','2026-09-10 09:02:02+00'),
('12000000-0000-7000-8000-0000000000c2','12000000-0000-7000-8000-000000000001','SPF-0101','SPF-0301',2,'12000000-0000-7000-8000-0000000000b1',NULL,'READY_TO_PICK','GHN đã tiếp nhận, chờ lấy hàng.',4,'carrier-ghn','2026-09-10 09:03:06+00','2026-09-10 09:03:06+00'),
('12000000-0000-7000-8000-0000000000c3','12000000-0000-7000-8000-000000000001','SPF-0301','SPF-0501',3,'12000000-0000-7000-8000-0000000000b2',NULL,'PICKED','GHN đã lấy kiện hàng.',4,'carrier-ghn','2026-09-11 01:42:09+00','2026-09-11 01:42:09+00'),
('12000000-0000-7000-8000-0000000000c4','12000000-0000-7000-8000-000000000001','SPF-0501','SPF-0701',4,'12000000-0000-7000-8000-0000000000b3',NULL,'IN_TRANSIT','Kiện hàng đang trung chuyển đến Huế.',4,'carrier-ghn','2026-09-12 04:10:14+00','2026-09-12 04:10:14+00'),
('12000000-0000-7000-8000-0000000000c5','12000000-0000-7000-8000-000000000001','SPF-0701','SPF-0801',5,'12000000-0000-7000-8000-0000000000b4',NULL,'DELIVERING','Nhân viên GHN đang giao kiện hàng.',4,'carrier-ghn','2026-09-13 08:35:08+00','2026-09-13 08:35:08+00'),
('12000000-0000-7000-8000-0000000000c6','12000000-0000-7000-8000-000000000001','SPF-0801','SPF-0901',6,'12000000-0000-7000-8000-0000000000b5',NULL,'DELIVERED','Kiện hàng đã giao thành công.',4,'carrier-ghn','2026-09-13 09:15:05+00','2026-09-13 09:15:05+00');

INSERT INTO order_results (result_id,order_id,leg_id,waybill_id,attempt_id,result_type,result_code,source_module,source_ref,occurred_at,valid_from,version_no,created_at)
VALUES ('12000000-0000-7000-8000-0000000000d1','12000000-0000-7000-8000-000000000001','12000000-0000-7000-8000-000000000061','12000000-0000-7000-8000-000000000091','12000000-0000-7000-8000-0000000000a2',1,1,'CAR','GHN-EVT-327002-05','2026-09-13 09:15:00+00','2026-09-13 09:15:00+00',1,'2026-09-13 09:15:05+00');
INSERT INTO result_items (order_id,result_id,item_id,item_role,quantity,created_at)
VALUES ('12000000-0000-7000-8000-000000000001','12000000-0000-7000-8000-0000000000d1','12000000-0000-7000-8000-000000000041',1,1,'2026-09-13 09:15:05+00');

COMMIT;

-- ===== SOURCE: test_data/designer_1/003_multi_carrier_delivery.sql =====
BEGIN;
SET LOCAL search_path TO order_mgmt, public;

-- D1-03: SuperShip lấy hàng, bàn giao J&T Express giao liên tỉnh.
INSERT INTO orders (order_id,order_code,shop_id,soc,status_code,customer_model,transport_model,selection_mode,shipping_config_ref,shipping_config_version,configuration_decision_ref,pricing_code,cod_amount,inspection_type,fee_payer,pickup_method,service_codes,delivery_note,delivery_result,created_by_identity_id,created_by_membership_id,created_actor_type,created_actor_ref,created_actor_name,created_application_id,created_client_id,created_channel,correlation_id,version_no,created_at,updated_at,updated_by)
VALUES ('13000000-0000-7000-8000-000000000001','9100000000003','10000000-0000-7000-8000-000000000001','SHOP-HCM-2026-000641','SPF-0901',2,2,1,'SHP-CONFIG-HCM-000641','15','SHP-DECISION-20260908-000003','PRC-HCM-JNT-2026-09',1290000,2,1,1,ARRAY[]::smallint[],'Không để kiện hàng dưới mưa; gọi người nhận trước khi giao.',1,'identity-shop-000641','membership-shop-000641-owner',1,'shop-user-000641','Hoàng Gia Hân','supership-web','web-safari-shop-000641','WEB','corr-d103-create-20260908-000003',9,'2026-09-08 02:10:00+00','2026-09-12 07:45:00+00','tracking-consumer');

INSERT INTO order_addresses (address_id,order_id,address_type,address_model,source_type,source_code,source_name,address_detail,full_address,province_code,district_code,commune_code,latitude,longitude,valid_from,version_no,created_at,created_by) VALUES
('13000000-0000-7000-8000-000000000011','13000000-0000-7000-8000-000000000001',1,1,1,'SHOP-WH-HCM-0641','Kho hàng Tân Phú','Số 87 đường Tân Kỳ Tân Quý','Số 87 đường Tân Kỳ Tân Quý, phường Tân Sơn Nhì, quận Tân Phú, Thành phố Hồ Chí Minh','79','767','27058',10.8012600,106.6304800,'2026-09-08 02:10:00+00',1,'2026-09-08 02:10:00+00','order-api'),
('13000000-0000-7000-8000-000000000012','13000000-0000-7000-8000-000000000001',2,1,2,'ADR-CT-000773','Địa chỉ giao hàng','Số 31 đường Nguyễn Việt Hồng','Số 31 đường Nguyễn Việt Hồng, phường An Phú, quận Ninh Kiều, Cần Thơ','92','916','31135',10.0328700,105.7764200,'2026-09-08 02:10:00+00',1,'2026-09-08 02:10:00+00','order-api');
INSERT INTO order_parties (party_id,order_id,party_type,name,contact_name,phone,email,valid_from,version_no,created_at,created_by) VALUES
('13000000-0000-7000-8000-000000000021','13000000-0000-7000-8000-000000000001',1,'Cửa hàng Thiết bị Bếp Lam Anh','Bùi Mỹ Linh','0326003001','linh.bui.0641@example.com','2026-09-08 02:10:00+00',1,'2026-09-08 02:10:00+00','order-api'),
('13000000-0000-7000-8000-000000000022','13000000-0000-7000-8000-000000000001',2,'Trương Nhật Minh','Trương Nhật Minh','0326003002','minh.truong.0773@example.net','2026-09-08 02:10:00+00',1,'2026-09-08 02:10:00+00','order-api');
INSERT INTO order_goods (goods_id,order_id,content_type,product_name,declared_value,currency_code,tag_codes,valid_from,version_no,created_at,created_by)
VALUES ('13000000-0000-7000-8000-000000000031','13000000-0000-7000-8000-000000000001',1,'Nồi chiên không dầu dung tích 6 lít',1890000,'VND',ARRAY[3,5]::smallint[],'2026-09-08 02:10:00+00',1,'2026-09-08 02:10:00+00','order-api');
INSERT INTO parcel_measures (measure_id,order_id,measure_kind,source_type,weight_g,length_cm,width_cm,height_cm,measured_at,source_ref,created_at)
VALUES ('13000000-0000-7000-8000-000000000041','13000000-0000-7000-8000-000000000001',1,1,7200,46,41,43,'2026-09-08 02:05:00+00','SHOP-MEASURE-D103','2026-09-08 02:10:00+00');

INSERT INTO order_legs (leg_id,order_id,stage_code,stage_no,leg_type,stage_status_code,carrier_code,carrier_client_code,started_at,completed_at,version_no,created_at,updated_at) VALUES
('13000000-0000-7000-8000-000000000051','13000000-0000-7000-8000-000000000001','STG-PICKUP-0001',1,1,'HANDOVER_COMPLETED',1,'SS-HCM-SHOP-0641','2026-09-08 03:00:00+00','2026-09-08 07:35:00+00',4,'2026-09-08 02:11:00+00','2026-09-08 07:35:00+00'),
('13000000-0000-7000-8000-000000000052','13000000-0000-7000-8000-000000000001','STG-DELIVERY-0001',2,2,'DELIVERED',3,'JNT-CT-SHOP-0641','2026-09-08 07:35:00+00','2026-09-12 07:40:00+00',6,'2026-09-08 02:11:00+00','2026-09-12 07:40:00+00');
UPDATE orders SET current_leg_id='13000000-0000-7000-8000-000000000052',custodian_carrier_code=3 WHERE order_id='13000000-0000-7000-8000-000000000001';
INSERT INTO leg_services (leg_service_id,order_id,leg_id,carrier_code,service_code,service_name,fulfillment_mode,carrier_client_code,policy_ref,policy_version,pricing_result_ref,carrier_fee_amount,shop_shipping_fee_amount,priced_at,valid_from,version_no,created_at) VALUES
('13000000-0000-7000-8000-000000000061','13000000-0000-7000-8000-000000000001','13000000-0000-7000-8000-000000000051',1,'SS-PICKUP-HUB','SuperShip lấy hàng về Hub',1,'SS-HCM-SHOP-0641','SHP-POLICY-SS-PICKUP','11','PRC-RESULT-D103-PICKUP',18000,22000,'2026-09-08 02:12:00+00','2026-09-08 02:12:00+00',1,'2026-09-08 02:12:00+00'),
('13000000-0000-7000-8000-000000000062','13000000-0000-7000-8000-000000000001','13000000-0000-7000-8000-000000000052',3,'JNT-STANDARD','Chuyển phát tiêu chuẩn',2,'JNT-CT-SHOP-0641','SHP-POLICY-JNT-SOUTH','8','PRC-RESULT-D103-DELIVERY',37500,43000,'2026-09-08 02:12:00+00','2026-09-08 02:12:00+00',1,'2026-09-08 02:12:00+00');

INSERT INTO waybills (waybill_id,order_id,carrier_code,carrier_waybill_code,carrier_client_code,sender_party_id,receiver_party_id,pickup_address_id,delivery_address_id,goods_id,measure_id,leg_service_id,pickup_method,fee_payer,inspection_type,cod_amount,collection_amount,declared_value,delivery_note,carrier_options,snapshot_schema_version,snapshot_hash,carrier_sorting_code,waybill_status,carrier_status_code,carrier_status_name,carrier_status_at,request_sent_at,carrier_accepted_at,created_at,ended_at,updated_at) VALUES
('13000000-0000-7000-8000-000000000071','13000000-0000-7000-8000-000000000001',1,'STGS983262LM.826941741','SS-HCM-SHOP-0641','13000000-0000-7000-8000-000000000021','13000000-0000-7000-8000-000000000022','13000000-0000-7000-8000-000000000011','13000000-0000-7000-8000-000000000012','13000000-0000-7000-8000-000000000031','13000000-0000-7000-8000-000000000041','13000000-0000-7000-8000-000000000061',1,1,2,1290000,1290000,1890000,'Không để kiện hàng dưới mưa.','[]'::jsonb,1,'1605731bc87144e63cd01c3fe67a147367f8e5e674d0ffeaa7e84e27b473c5a4',NULL,2,'SPS-303','Đã bàn giao nhà vận chuyển khác','2026-09-08 07:35:00+00','2026-09-08 02:13:00+00','2026-09-08 02:13:12+00','2026-09-08 02:13:12+00','2026-09-08 07:35:00+00','2026-09-08 07:35:00+00'),
('13000000-0000-7000-8000-000000000072','13000000-0000-7000-8000-000000000001',3,'802808938571','JNT-CT-SHOP-0641','13000000-0000-7000-8000-000000000021','13000000-0000-7000-8000-000000000022','13000000-0000-7000-8000-000000000011','13000000-0000-7000-8000-000000000012','13000000-0000-7000-8000-000000000031','13000000-0000-7000-8000-000000000041','13000000-0000-7000-8000-000000000062',1,1,2,1290000,1290000,1890000,'Gọi người nhận trước khi giao.','[]'::jsonb,1,'309924671383a2b34a50e63312c26d62b731e17c409666c147ee6de442efe860','470-024C33-',2,'DELIVERED','Giao hàng thành công','2026-09-12 07:40:00+00','2026-09-08 02:13:20+00','2026-09-08 02:13:35+00','2026-09-08 02:13:35+00','2026-09-12 07:40:00+00','2026-09-12 07:40:00+00');
INSERT INTO leg_waybills (leg_waybill_id,order_id,leg_id,waybill_id,sequence_no,active_from,created_at) VALUES
('13000000-0000-7000-8000-000000000081','13000000-0000-7000-8000-000000000001','13000000-0000-7000-8000-000000000051','13000000-0000-7000-8000-000000000071',1,'2026-09-08 02:13:12+00','2026-09-08 02:13:12+00'),
('13000000-0000-7000-8000-000000000082','13000000-0000-7000-8000-000000000001','13000000-0000-7000-8000-000000000052','13000000-0000-7000-8000-000000000072',1,'2026-09-08 02:13:35+00','2026-09-08 02:13:35+00');

INSERT INTO handovers (handover_id,order_id,from_leg_id,to_leg_id,from_carrier_code,to_carrier_code,status,started_at,completed_at,version_no,created_at,updated_at)
VALUES ('13000000-0000-7000-8000-000000000091','13000000-0000-7000-8000-000000000001','13000000-0000-7000-8000-000000000051','13000000-0000-7000-8000-000000000052',1,3,3,'2026-09-08 07:10:00+00','2026-09-08 07:35:00+00',2,'2026-09-08 07:05:00+00','2026-09-08 07:35:00+00');
INSERT INTO handover_attempts (handover_attempt_id,order_id,handover_id,from_waybill_id,to_waybill_id,attempt_no,status,source_ref,started_at,ended_at,version_no,created_at,updated_at)
VALUES ('13000000-0000-7000-8000-000000000092','13000000-0000-7000-8000-000000000001','13000000-0000-7000-8000-000000000091','13000000-0000-7000-8000-000000000071','13000000-0000-7000-8000-000000000072',1,2,'HANDOVER-HCM-HUB-20260908-003','2026-09-08 07:10:00+00','2026-09-08 07:35:00+00',1,'2026-09-08 07:10:00+00','2026-09-08 07:35:00+00');

INSERT INTO transport_attempts (attempt_id,order_id,leg_id,waybill_id,carrier_code,attempt_code,attempt_type,attempt_no,status,received_by_name,received_by_relation,source_ref,started_at,ended_at,version_no,created_at,updated_at) VALUES
('13000000-0000-7000-8000-0000000000a1','13000000-0000-7000-8000-000000000001','13000000-0000-7000-8000-000000000051','13000000-0000-7000-8000-000000000071',1,'ATT-D103-PICKUP-01',1,1,2,'Bùi Mỹ Linh','Người gửi','SS-PICKUP-0641-003','2026-09-08 03:00:00+00','2026-09-08 03:25:00+00',1,'2026-09-08 03:00:00+00','2026-09-08 03:25:00+00'),
('13000000-0000-7000-8000-0000000000a2','13000000-0000-7000-8000-000000000001','13000000-0000-7000-8000-000000000052','13000000-0000-7000-8000-000000000072',3,'ATT-D103-DELIVERY-01',2,1,2,'Trương Nhật Minh','Người nhận','JNT-DELIVERY-0773-003','2026-09-12 07:05:00+00','2026-09-12 07:40:00+00',1,'2026-09-12 07:05:00+00','2026-09-12 07:40:00+00');

INSERT INTO tracking_events (event_id,order_id,leg_id,waybill_id,attempt_id,event_source,source_namespace,dedupe_key,source_module,source_event_ref,event_type,event_code,event_name,stage_status_code,carrier_status_code,carrier_status_name,province_code,province_name,facility_code,facility_name,occurred_at,received_at,order_sequence_no,leg_sequence_no,apply_result,created_at) VALUES
('13000000-0000-7000-8000-0000000000b1','13000000-0000-7000-8000-000000000001','13000000-0000-7000-8000-000000000051','13000000-0000-7000-8000-000000000071','13000000-0000-7000-8000-0000000000a1',1,'SUPERSHIP','D103-PICKED-001','CAR','SS-EVT-0641-01','PICKUP','PICKED','SuperShip đã lấy hàng','PICKED_UP','PICKED','Đã lấy hàng','79','Thành phố Hồ Chí Minh','SS-HCM-TP-HUB','Hub Tân Phú','2026-09-08 03:25:00+00','2026-09-08 03:25:04+00',1,1,1,'2026-09-08 03:25:04+00'),
('13000000-0000-7000-8000-0000000000b2','13000000-0000-7000-8000-000000000001','13000000-0000-7000-8000-000000000052','13000000-0000-7000-8000-000000000072',NULL,1,'JNT','D103-HANDOVER-002','CAR','JNT-EVT-0773-02','HANDOVER','RECEIVED','J&T Express đã nhận bàn giao','HANDOVER_RECEIVED','RECEIVED','Đã nhận hàng bàn giao','79','Thành phố Hồ Chí Minh','JNT-HCM-HUB','Trung tâm khai thác J&T Tân Bình','2026-09-08 07:35:00+00','2026-09-08 07:35:10+00',2,1,1,'2026-09-08 07:35:10+00'),
('13000000-0000-7000-8000-0000000000b3','13000000-0000-7000-8000-000000000001','13000000-0000-7000-8000-000000000052','13000000-0000-7000-8000-000000000072',NULL,1,'JNT','D103-TRANSIT-003','CAR','JNT-EVT-0773-03','TRANSIT','IN_TRANSIT','Đang trung chuyển đến Cần Thơ','IN_TRANSIT','IN_TRANSIT','Đang trung chuyển','92','Cần Thơ','JNT-CT-HUB','Trung tâm khai thác Cần Thơ','2026-09-10 03:20:00+00','2026-09-10 03:20:12+00',3,2,1,'2026-09-10 03:20:12+00'),
('13000000-0000-7000-8000-0000000000b4','13000000-0000-7000-8000-000000000001','13000000-0000-7000-8000-000000000052','13000000-0000-7000-8000-000000000072','13000000-0000-7000-8000-0000000000a2',1,'JNT','D103-DELIVERED-004','CAR','JNT-EVT-0773-04','DELIVERY','DELIVERED','Giao hàng thành công','DELIVERED','DELIVERED','Giao hàng thành công','92','Cần Thơ',NULL,NULL,'2026-09-12 07:40:00+00','2026-09-12 07:40:07+00',4,3,1,'2026-09-12 07:40:07+00');

INSERT INTO order_status_history (status_history_id,order_id,from_status_code,status_code,version_no,tracking_event_id,reason_code,reason,changed_by_actor_type,changed_by_actor_ref,changed_at,created_at) VALUES
('13000000-0000-7000-8000-0000000000c1','13000000-0000-7000-8000-000000000001',NULL,'SPF-0301',1,NULL,'READY_TO_PICK','Chờ SuperShip đến lấy hàng.',3,'order-orchestrator','2026-09-08 02:13:35+00','2026-09-08 02:13:35+00'),
('13000000-0000-7000-8000-0000000000c2','13000000-0000-7000-8000-000000000001','SPF-0301','SPF-0501',2,'13000000-0000-7000-8000-0000000000b1','PICKED','SuperShip đã lấy kiện hàng.',4,'carrier-supership','2026-09-08 03:25:04+00','2026-09-08 03:25:04+00'),
('13000000-0000-7000-8000-0000000000c3','13000000-0000-7000-8000-000000000001','SPF-0501','SPF-0605',3,'13000000-0000-7000-8000-0000000000b2','HANDOVER_COMPLETED','J&T Express đã nhận hàng tại Hub.',4,'carrier-jnt','2026-09-08 07:35:10+00','2026-09-08 07:35:10+00'),
('13000000-0000-7000-8000-0000000000c4','13000000-0000-7000-8000-000000000001','SPF-0605','SPF-0701',4,'13000000-0000-7000-8000-0000000000b3','IN_TRANSIT','Kiện hàng đang trung chuyển đến Cần Thơ.',4,'carrier-jnt','2026-09-10 03:20:12+00','2026-09-10 03:20:12+00'),
('13000000-0000-7000-8000-0000000000c5','13000000-0000-7000-8000-000000000001','SPF-0701','SPF-0901',5,'13000000-0000-7000-8000-0000000000b4','DELIVERED','J&T Express đã giao hàng thành công.',4,'carrier-jnt','2026-09-12 07:40:07+00','2026-09-12 07:40:07+00');
INSERT INTO order_results (result_id,order_id,leg_id,waybill_id,attempt_id,result_type,result_code,source_module,source_ref,occurred_at,valid_from,version_no,created_at)
VALUES ('13000000-0000-7000-8000-0000000000d1','13000000-0000-7000-8000-000000000001','13000000-0000-7000-8000-000000000052','13000000-0000-7000-8000-000000000072','13000000-0000-7000-8000-0000000000a2',1,1,'CAR','JNT-EVT-0773-04','2026-09-12 07:40:00+00','2026-09-12 07:40:00+00',1,'2026-09-12 07:40:07+00');

COMMIT;

-- ===== SOURCE: test_data/designer_1/004_partial_delivery.sql =====
BEGIN;
SET LOCAL search_path TO order_mgmt, public;

-- D1-04: SPX Express giao một phần, một sản phẩm được giao và một sản phẩm chuyển hoàn.
INSERT INTO orders (order_id,order_code,shop_id,soc,status_code,customer_model,transport_model,selection_mode,shipping_config_ref,shipping_config_version,configuration_decision_ref,pricing_code,cod_amount,inspection_type,fee_payer,pickup_method,service_codes,delivery_note,delivery_result,created_by_identity_id,created_by_membership_id,created_actor_type,created_actor_ref,created_actor_name,created_application_id,created_client_id,created_channel,correlation_id,version_no,created_at,updated_at,updated_by)
VALUES ('14000000-0000-7000-8000-000000000001','9100000000004','10000000-0000-7000-8000-000000000001','SHOP-HN-2026-000908','SPF-0902',3,3,1,'SHP-CONFIG-HN-000908','5','SHP-DECISION-20260906-000004','PRC-HN-SPX-2026-09',420000,2,1,1,ARRAY[1]::smallint[],'Cho phép kiểm tra ngoại quan; giao đúng số lượng người nhận xác nhận.',2,'identity-shop-000908','membership-shop-000908-owner',1,'shop-user-000908','Đỗ Thanh Tâm','supership-web','web-firefox-shop-000908','WEB','corr-d104-create-20260906-000004',7,'2026-09-06 03:00:00+00','2026-09-09 10:20:00+00','order-workflow');
INSERT INTO order_addresses (address_id,order_id,address_type,address_model,source_type,source_code,source_name,address_detail,full_address,province_code,district_code,commune_code,latitude,longitude,valid_from,version_no,created_at,created_by) VALUES
('14000000-0000-7000-8000-000000000011','14000000-0000-7000-8000-000000000001',1,1,1,'SHOP-WH-HN-0908','Kho hàng Hoàng Mai','Số 56 phố Linh Đường','Số 56 phố Linh Đường, phường Hoàng Liệt, quận Hoàng Mai, Hà Nội','01','008','00322',20.9642700,105.8264600,'2026-09-06 03:00:00+00',1,'2026-09-06 03:00:00+00','order-api'),
('14000000-0000-7000-8000-000000000012','14000000-0000-7000-8000-000000000001',2,1,2,'ADR-BN-000462','Địa chỉ giao hàng','Số 19 đường Lý Thái Tổ','Số 19 đường Lý Thái Tổ, phường Suối Hoa, thành phố Bắc Ninh, Bắc Ninh','27','256','09166',21.1843100,106.0765200,'2026-09-06 03:00:00+00',1,'2026-09-06 03:00:00+00','order-api');
INSERT INTO order_parties (party_id,order_id,party_type,name,contact_name,phone,email,valid_from,version_no,created_at,created_by) VALUES
('14000000-0000-7000-8000-000000000021','14000000-0000-7000-8000-000000000001',1,'Cửa hàng Văn phòng phẩm Hải Đăng','Lương Thu Hà','0326004001','ha.luong.0908@example.com','2026-09-06 03:00:00+00',1,'2026-09-06 03:00:00+00','order-api'),
('14000000-0000-7000-8000-000000000022','14000000-0000-7000-8000-000000000001',2,'Phan Đức Anh','Phan Đức Anh','0326004002','anh.phan.0462@example.net','2026-09-06 03:00:00+00',1,'2026-09-06 03:00:00+00','order-api');
INSERT INTO order_goods (goods_id,order_id,content_type,declared_value,currency_code,tag_codes,valid_from,version_no,created_at,created_by)
VALUES ('14000000-0000-7000-8000-000000000031','14000000-0000-7000-8000-000000000001',2,560000,'VND',ARRAY[]::smallint[],'2026-09-06 03:00:00+00',1,'2026-09-06 03:00:00+00','order-api');
INSERT INTO order_items (item_id,order_id,goods_id,item_code,product_ref,sku,item_name,unit_price,unit_weight_g,quantity,created_at) VALUES
('14000000-0000-7000-8000-000000000041','14000000-0000-7000-8000-000000000001','14000000-0000-7000-8000-000000000031','ITEM-D104-01','PRD-NOTE-A5-05','HD-SOTAY-A5-XANH','Sổ tay bìa da A5 màu xanh rêu',140000,420,2,'2026-09-06 03:00:00+00'),
('14000000-0000-7000-8000-000000000042','14000000-0000-7000-8000-000000000001','14000000-0000-7000-8000-000000000031','ITEM-D104-02','PRD-PEN-GEL-10','HD-BUTGEL-10DEN','Hộp 10 bút gel mực đen 0,5 mm',70000,180,4,'2026-09-06 03:00:00+00');
INSERT INTO parcel_measures (measure_id,order_id,measure_kind,source_type,weight_g,length_cm,width_cm,height_cm,measured_at,source_ref,created_at)
VALUES ('14000000-0000-7000-8000-000000000051','14000000-0000-7000-8000-000000000001',1,1,1680,32,24,18,'2026-09-06 02:55:00+00','SHOP-MEASURE-D104','2026-09-06 03:00:00+00');
INSERT INTO order_legs (leg_id,order_id,stage_code,stage_no,leg_type,stage_status_code,carrier_code,carrier_client_code,started_at,completed_at,version_no,created_at,updated_at)
VALUES ('14000000-0000-7000-8000-000000000061','14000000-0000-7000-8000-000000000001','STG-DELIVERY-0001',1,2,'PARTIALLY_DELIVERED',10,'SPX-HN-SHOP-0908','2026-09-07 01:15:00+00','2026-09-09 10:00:00+00',6,'2026-09-06 03:01:00+00','2026-09-09 10:20:00+00');
UPDATE orders SET current_leg_id='14000000-0000-7000-8000-000000000061',custodian_carrier_code=10 WHERE order_id='14000000-0000-7000-8000-000000000001';
INSERT INTO leg_items (order_id,leg_id,item_id,quantity,created_at) VALUES
('14000000-0000-7000-8000-000000000001','14000000-0000-7000-8000-000000000061','14000000-0000-7000-8000-000000000041',2,'2026-09-06 03:01:00+00'),
('14000000-0000-7000-8000-000000000001','14000000-0000-7000-8000-000000000061','14000000-0000-7000-8000-000000000042',4,'2026-09-06 03:01:00+00');
INSERT INTO leg_services (leg_service_id,order_id,leg_id,carrier_code,service_code,service_name,fulfillment_mode,carrier_client_code,policy_ref,policy_version,pricing_result_ref,carrier_fee_amount,shop_shipping_fee_amount,priced_at,valid_from,version_no,created_at)
VALUES ('14000000-0000-7000-8000-000000000071','14000000-0000-7000-8000-000000000001','14000000-0000-7000-8000-000000000061',10,'SPX-STANDARD','SPX giao hàng tiêu chuẩn',2,'SPX-HN-SHOP-0908','SHP-POLICY-SPX-NORTH','4','PRC-RESULT-D104-001',24500,29000,'2026-09-06 03:01:30+00','2026-09-06 03:01:30+00',1,'2026-09-06 03:01:30+00');
INSERT INTO waybills (waybill_id,order_id,carrier_code,carrier_waybill_code,carrier_client_code,sender_party_id,receiver_party_id,pickup_address_id,delivery_address_id,goods_id,measure_id,leg_service_id,pickup_method,fee_payer,inspection_type,cod_amount,collection_amount,declared_value,delivery_note,carrier_options,snapshot_schema_version,snapshot_hash,carrier_sorting_code,waybill_status,carrier_status_code,carrier_status_name,carrier_status_at,request_sent_at,carrier_accepted_at,created_at,ended_at,updated_at)
VALUES ('14000000-0000-7000-8000-000000000081','14000000-0000-7000-8000-000000000001',10,'SPXVN066263841279','SPX-HN-SHOP-0908','14000000-0000-7000-8000-000000000021','14000000-0000-7000-8000-000000000022','14000000-0000-7000-8000-000000000011','14000000-0000-7000-8000-000000000012','14000000-0000-7000-8000-000000000031','14000000-0000-7000-8000-000000000051','14000000-0000-7000-8000-000000000071',1,1,2,420000,280000,560000,'Cho phép kiểm tra ngoại quan; giao đúng số lượng người nhận xác nhận.','[]'::jsonb,1,'e0d674339f35694ecd2fe2f2d78d042cefe2d8dae93cd5a8a5442a9169ea0d7f','HCA-51-172-Q5P8-N',2,'PARTIAL_DELIVERED','Giao thành công một phần','2026-09-09 10:00:00+00','2026-09-06 03:02:00+00','2026-09-06 03:02:11+00','2026-09-06 03:02:11+00','2026-09-09 10:00:00+00','2026-09-09 10:20:00+00');
INSERT INTO leg_waybills (leg_waybill_id,order_id,leg_id,waybill_id,sequence_no,active_from,created_at)
VALUES ('14000000-0000-7000-8000-000000000082','14000000-0000-7000-8000-000000000001','14000000-0000-7000-8000-000000000061','14000000-0000-7000-8000-000000000081',1,'2026-09-06 03:02:11+00','2026-09-06 03:02:11+00');

INSERT INTO order_requests (request_id,order_id,request_code,request_type,request_status,payload_version,request_payload,reason_code,reason,source_type,requested_by_actor_type,requested_by_actor_ref,requested_by_display_name,requested_at,result_code,completed_at,correlation_id,version_no,created_at,updated_at)
VALUES ('14000000-0000-7000-8000-000000000091','14000000-0000-7000-8000-000000000001','REQ-D104-PARTIAL-DELIVERY','PARTIAL_DELIVERY',3,1,'{"partial_type":2,"delivered_cod_amount":280000,"remaining_action":"RETURN","items":[{"item_code":"ITEM-D104-01","delivered_quantity":2,"remaining_quantity":0},{"item_code":"ITEM-D104-02","delivered_quantity":0,"remaining_quantity":4}]}'::jsonb,'RECEIVER_ACCEPTED_PART','Người nhận chỉ nhận hai sổ tay; hộp bút được chuyển hoàn nguyên kiện.',2,2,'ops-user-hn-0042','Lê Thị Bích Ngọc','2026-09-09 10:05:00+00','PARTIAL_APPLIED','2026-09-09 10:12:00+00','corr-d104-partial-20260909-000004',1,'2026-09-09 10:05:00+00','2026-09-09 10:12:00+00');
INSERT INTO request_items (request_item_id,order_id,request_id,item_id,item_role,quantity,created_at) VALUES
('14000000-0000-7000-8000-0000000000a1','14000000-0000-7000-8000-000000000001','14000000-0000-7000-8000-000000000091','14000000-0000-7000-8000-000000000041',1,2,'2026-09-09 10:05:00+00'),
('14000000-0000-7000-8000-0000000000a2','14000000-0000-7000-8000-000000000001','14000000-0000-7000-8000-000000000091','14000000-0000-7000-8000-000000000042',2,4,'2026-09-09 10:05:00+00');
INSERT INTO transport_attempts (attempt_id,order_id,leg_id,waybill_id,carrier_code,trigger_request_id,attempt_code,attempt_type,attempt_no,status,received_by_name,received_by_relation,source_ref,started_at,ended_at,version_no,created_at,updated_at)
VALUES ('14000000-0000-7000-8000-0000000000b1','14000000-0000-7000-8000-000000000001','14000000-0000-7000-8000-000000000061','14000000-0000-7000-8000-000000000081',10,'14000000-0000-7000-8000-000000000091','ATT-D104-DELIVERY-01',2,1,2,'Phan Đức Anh','Người nhận','SPX-DELIVERY-0462-004','2026-09-09 09:25:00+00','2026-09-09 10:00:00+00',1,'2026-09-09 09:25:00+00','2026-09-09 10:00:00+00');
INSERT INTO order_results (result_id,order_id,leg_id,waybill_id,attempt_id,request_id,result_type,result_code,reason_code,reason,source_module,source_ref,occurred_at,valid_from,version_no,created_at)
VALUES ('14000000-0000-7000-8000-0000000000c1','14000000-0000-7000-8000-000000000001','14000000-0000-7000-8000-000000000061','14000000-0000-7000-8000-000000000081','14000000-0000-7000-8000-0000000000b1','14000000-0000-7000-8000-000000000091',1,2,'RECEIVER_ACCEPTED_PART','Đã giao hai sổ tay; bốn hộp bút chờ chuyển hoàn.','ORD','REQ-D104-PARTIAL-DELIVERY','2026-09-09 10:12:00+00','2026-09-09 10:12:00+00',1,'2026-09-09 10:12:00+00');
INSERT INTO result_items (order_id,result_id,item_id,item_role,request_id,request_item_id,quantity,created_at) VALUES
('14000000-0000-7000-8000-000000000001','14000000-0000-7000-8000-0000000000c1','14000000-0000-7000-8000-000000000041',1,'14000000-0000-7000-8000-000000000091','14000000-0000-7000-8000-0000000000a1',2,'2026-09-09 10:12:00+00'),
('14000000-0000-7000-8000-000000000001','14000000-0000-7000-8000-0000000000c1','14000000-0000-7000-8000-000000000042',2,'14000000-0000-7000-8000-000000000091','14000000-0000-7000-8000-0000000000a2',4,'2026-09-09 10:12:00+00');
INSERT INTO order_status_history (status_history_id,order_id,from_status_code,status_code,version_no,request_id,reason_code,reason,changed_by_actor_type,changed_by_actor_ref,changed_at,created_at) VALUES
('14000000-0000-7000-8000-0000000000d1','14000000-0000-7000-8000-000000000001',NULL,'SPF-0301',1,NULL,'READY_TO_PICK','Chờ SPX Express lấy hàng.',3,'order-orchestrator','2026-09-06 03:02:11+00','2026-09-06 03:02:11+00'),
('14000000-0000-7000-8000-0000000000d2','14000000-0000-7000-8000-000000000001','SPF-0301','SPF-0801',2,NULL,'DELIVERING','SPX Express đang giao kiện hàng.',4,'carrier-spx','2026-09-09 09:25:00+00','2026-09-09 09:25:00+00'),
('14000000-0000-7000-8000-0000000000d3','14000000-0000-7000-8000-000000000001','SPF-0801','SPF-0902',3,'14000000-0000-7000-8000-000000000091','PARTIAL_DELIVERY','Đã xác nhận giao một phần và điều chỉnh COD còn 280.000 VND.',2,'ops-user-hn-0042','2026-09-09 10:12:00+00','2026-09-09 10:12:00+00');

COMMIT;

-- ===== SOURCE: test_data/designer_1/005_batch_reliability.sql =====
BEGIN;
SET LOCAL search_path TO order_mgmt, public;

-- D1-05: một batch thành công, một batch thành công một phần, attempt bất biến,
-- idempotency hoàn tất và Outbox ở PENDING/SENT/RETRY_WAIT.
INSERT INTO orders (order_id,order_code,shop_id,soc,status_code,customer_model,transport_model,selection_mode,shipping_config_ref,shipping_config_version,configuration_decision_ref,pricing_code,cod_amount,inspection_type,fee_payer,pickup_method,service_codes,delivery_note,created_by_identity_id,created_by_membership_id,created_actor_type,created_actor_ref,created_actor_name,created_application_id,created_client_id,created_channel,correlation_id,version_no,created_at,updated_at,updated_by) VALUES
('15000000-0000-7000-8000-000000000001','9100000000005','10000000-0000-7000-8000-000000000001','BATCH-HCM-2026-001205','SPF-0101',3,3,1,'SHP-CONFIG-HCM-001205','7','SHP-DECISION-20260915-000005','PRC-HCM-BEST-2026-09',365000,1,1,1,ARRAY[]::smallint[],'Giao tại quầy lễ tân trong giờ hành chính.','identity-shop-001205','membership-shop-001205-operator',1,'shop-user-001205','Ngô Phương Thảo','supership-web','web-batch-shop-001205','BATCH','corr-d105-order-20260915-000005',1,'2026-09-15 02:05:00+00','2026-09-15 02:05:00+00','batch-worker-01'),
('15000000-0000-7000-8000-000000000002','9100000000006','10000000-0000-7000-8000-000000000001','BATCH-HCM-2026-001206','SPF-0101',3,3,1,'SHP-CONFIG-HCM-001205','7','SHP-DECISION-20260915-000006','PRC-HCM-BEST-2026-09',0,1,1,1,ARRAY[]::smallint[],'Liên hệ người nhận khi đến cổng khu dân cư.','identity-shop-001205','membership-shop-001205-operator',1,'shop-user-001205','Ngô Phương Thảo','supership-web','web-batch-shop-001205','BATCH','corr-d105-order-20260915-000006',1,'2026-09-15 03:12:00+00','2026-09-15 03:12:00+00','batch-worker-02');

INSERT INTO order_status_history (status_history_id,order_id,status_code,version_no,reason_code,reason,changed_by_actor_type,changed_by_actor_ref,changed_at,created_at) VALUES
('15000000-0000-7000-8000-000000000011','15000000-0000-7000-8000-000000000001','SPF-0101',1,'BATCH_ORDER_CREATED','Order được tạo từ dòng hợp lệ của batch.',3,'batch-worker-01','2026-09-15 02:05:00+00','2026-09-15 02:05:00+00'),
('15000000-0000-7000-8000-000000000012','15000000-0000-7000-8000-000000000002','SPF-0101',1,'BATCH_ORDER_CREATED','Order được tạo từ dòng hợp lệ của batch thành công một phần.',3,'batch-worker-02','2026-09-15 03:12:00+00','2026-09-15 03:12:00+00');

INSERT INTO order_batches (batch_id,batch_code,shop_id,status,total_rows,success_rows,failed_rows,processing_rows,created_by_actor_type,created_by_actor_ref,created_by_display_name,created_application_id,created_client_id,correlation_id,version_no,created_at,started_at,completed_at,updated_at) VALUES
('15000000-0000-7000-8000-000000000021','BAT-20260915-001205','10000000-0000-7000-8000-000000000001',2,1,1,0,0,1,'shop-user-001205','Ngô Phương Thảo','supership-web','web-batch-shop-001205','corr-d105-batch-20260915-001205',2,'2026-09-15 02:00:00+00','2026-09-15 02:01:00+00','2026-09-15 02:05:30+00','2026-09-15 02:05:30+00'),
('15000000-0000-7000-8000-000000000022','BAT-20260915-001206','10000000-0000-7000-8000-000000000001',3,2,1,1,0,1,'shop-user-001205','Ngô Phương Thảo','supership-web','web-batch-shop-001205','corr-d105-batch-20260915-001206',2,'2026-09-15 03:00:00+00','2026-09-15 03:01:00+00','2026-09-15 03:13:00+00','2026-09-15 03:13:00+00');

INSERT INTO batch_items (batch_item_id,batch_id,row_number,order_id,soc,receiver_name,receiver_phone,status,input_data,input_schema_version,input_hash,result_data,errors,attempt_count,available_at,created_at,updated_at) VALUES
('15000000-0000-7000-8000-000000000031','15000000-0000-7000-8000-000000000021',2,'15000000-0000-7000-8000-000000000001','BATCH-HCM-2026-001205','Dương Minh Quân','0326005001',2,'{"receiver_name":"Dương Minh Quân","receiver_phone":"0326005001","address":"Số 28 đường Nguyễn Cơ Thạch, phường An Lợi Đông, thành phố Thủ Đức, Thành phố Hồ Chí Minh","product_name":"Bộ ga giường cotton 1,6 m","cod_amount":365000}'::jsonb,1,'42d3406adcbdcb6aa36f067b22796a5497b549a2e560fd22676387a6295b9bbc','{"order_code":"9100000000005","status":"CREATED"}'::jsonb,'[]'::jsonb,1,'2026-09-15 02:01:00+00','2026-09-15 02:00:00+00','2026-09-15 02:05:30+00'),
('15000000-0000-7000-8000-000000000032','15000000-0000-7000-8000-000000000022',2,'15000000-0000-7000-8000-000000000002','BATCH-HCM-2026-001206','Mai Khánh Linh','0326005002',2,'{"receiver_name":"Mai Khánh Linh","receiver_phone":"0326005002","address":"Số 73 đường Số 9, phường Linh Tây, thành phố Thủ Đức, Thành phố Hồ Chí Minh","product_name":"Đèn bàn LED chống cận","cod_amount":0}'::jsonb,1,'a2a1acc812b9e267e0bf4efd936e3c6147ad7efd92897e0260f27f15780deee0','{"order_code":"9100000000006","status":"CREATED"}'::jsonb,'[]'::jsonb,1,'2026-09-15 03:01:00+00','2026-09-15 03:00:00+00','2026-09-15 03:12:30+00'),
('15000000-0000-7000-8000-000000000033','15000000-0000-7000-8000-000000000022',3,NULL,'BATCH-HCM-2026-001207','Vũ Hải Yến','0326005003',3,'{"receiver_name":"Vũ Hải Yến","receiver_phone":"0326005003","province_code":"79","district_code":"769","commune_code":"INVALID","product_name":"Bình giữ nhiệt inox 750 ml","cod_amount":215000}'::jsonb,1,'87a189ce401062a93e89c6049aa765d72183635f3f51e1b2db9754315ee03419',NULL,'[{"field":"commune_code","code":"ADDRESS_CODE_NOT_FOUND","message":"Mã phường/xã không thuộc quận và tỉnh đã chọn."}]'::jsonb,1,'2026-09-15 03:01:00+00','2026-09-15 03:00:00+00','2026-09-15 03:12:30+00');

INSERT INTO batch_item_attempts (batch_item_attempt_id,batch_item_id,attempt_no,status,result_data,errors,worker_ref,started_at,completed_at,created_at) VALUES
('15000000-0000-7000-8000-000000000041','15000000-0000-7000-8000-000000000031',1,2,'{"order_code":"9100000000005","duration_ms":842}'::jsonb,'[]'::jsonb,'batch-worker-01','2026-09-15 02:04:40+00','2026-09-15 02:05:00+00','2026-09-15 02:05:00+00'),
('15000000-0000-7000-8000-000000000042','15000000-0000-7000-8000-000000000032',1,2,'{"order_code":"9100000000006","duration_ms":917}'::jsonb,'[]'::jsonb,'batch-worker-02','2026-09-15 03:11:40+00','2026-09-15 03:12:00+00','2026-09-15 03:12:00+00'),
('15000000-0000-7000-8000-000000000043','15000000-0000-7000-8000-000000000033',1,3,NULL,'[{"field":"commune_code","code":"ADDRESS_CODE_NOT_FOUND","message":"Mã phường/xã không thuộc quận và tỉnh đã chọn."}]'::jsonb,'batch-worker-02','2026-09-15 03:11:45+00','2026-09-15 03:12:05+00','2026-09-15 03:12:05+00');

INSERT INTO idempotency_records (idempotency_id,scope_key,idempotency_key,request_hash,status,resource_type,resource_ref,http_status,result_code,response_meta,expires_at,created_at,updated_at)
VALUES ('15000000-0000-7000-8000-000000000051','shop:10000000-0000-7000-8000-000000000001:batch','idem-d105-batch-20260915-001205','61e3c1055e821a4b59600ead955615a0395ae495a43d27a55ff8de15db680fac',2,'ORDER_BATCH','BAT-20260915-001205',201,'BATCH_CREATED','{"batch_code":"BAT-20260915-001205","total_rows":1}'::jsonb,'2026-09-16 02:00:00+00','2026-09-15 02:00:00+00','2026-09-15 02:05:30+00');

INSERT INTO outbox_events (outbox_event_id,order_id,aggregate_type,aggregate_id,aggregate_version,event_type,event_key,schema_version,payload,headers,correlation_id,status,attempt_count,available_at,claimed_by,claim_until,last_error,sent_at,dead_lettered_at,created_at) VALUES
('15000000-0000-7000-8000-000000000061','15000000-0000-7000-8000-000000000001','ORDER','15000000-0000-7000-8000-000000000001',1,'OrderCreated','order:9100000000005:v1:created',1,'{"order_code":"9100000000005","shop_id":"10000000-0000-7000-8000-000000000001","source":"BATCH"}'::jsonb,'{"trace_id":"corr-d105-order-20260915-000005"}'::jsonb,'corr-d105-order-20260915-000005',1,0,'2026-09-15 02:05:00+00',NULL,NULL,NULL,NULL,NULL,'2026-09-15 02:05:00+00'),
('15000000-0000-7000-8000-000000000062','15000000-0000-7000-8000-000000000002','ORDER','15000000-0000-7000-8000-000000000002',1,'OrderCreated','order:9100000000006:v1:created',1,'{"order_code":"9100000000006","shop_id":"10000000-0000-7000-8000-000000000001","source":"BATCH"}'::jsonb,'{"trace_id":"corr-d105-order-20260915-000006"}'::jsonb,'corr-d105-order-20260915-000006',3,1,'2026-09-15 03:12:00+00',NULL,NULL,NULL,'2026-09-15 03:12:18+00',NULL,'2026-09-15 03:12:00+00'),
('15000000-0000-7000-8000-000000000063',NULL,'ORDER_BATCH','15000000-0000-7000-8000-000000000022',2,'OrderBatchPartiallyCompleted','batch:BAT-20260915-001206:v2:partial',1,'{"batch_code":"BAT-20260915-001206","success_rows":1,"failed_rows":1}'::jsonb,'{"trace_id":"corr-d105-batch-20260915-001206"}'::jsonb,'corr-d105-batch-20260915-001206',4,2,'2026-09-15 03:18:00+00',NULL,NULL,'Broker tạm thời từ chối kết nối; chờ lần gửi tiếp theo.',NULL,NULL,'2026-09-15 03:13:00+00');

COMMIT;

-- ===== SOURCE: test_data/designer_1/000_verified_carrier_contracts.sql =====

BEGIN;
SET LOCAL search_path TO order_mgmt, public;

-- COMMON-CARRIER: Ba Order đã được NVC cấp Waybill, đang chờ lấy hàng.
-- Mục tiêu của fixture này là khóa các mã/format đã được xác nhận cho
-- Viettel Post, Vietnam Post và BEST Express mà không tự suy diễn raw status.
-- File này là fixture hợp đồng NVC, không thay thế scenario D1-06 update Order.

INSERT INTO orders (
    order_id, order_code, shop_id, soc, status_code, customer_model, transport_model,
    selection_mode, shipping_config_ref, shipping_config_version, configuration_decision_ref,
    pricing_code, cod_amount, inspection_type, fee_payer, pickup_method, service_codes,
    pickup_scheduled_from, pickup_scheduled_to, delivery_note, created_by_identity_id,
    created_by_membership_id, created_actor_type, created_actor_ref, created_actor_name,
    created_application_id, created_client_id, created_channel, correlation_id,
    version_no, created_at, updated_at, updated_by
) VALUES
('16000000-0000-7000-8000-000000000001','9100000000007','10000000-0000-7000-8000-000000000001','SHOP-HN-2026-001407','SPF-0301',3,3,1,'SHP-CONFIG-HN-001407','3','SHP-DECISION-20260919-000007','PRC-HN-VTP-2026-09',690000,2,1,1,ARRAY[]::smallint[],'2026-09-20 02:00:00+00','2026-09-20 05:00:00+00','Gọi kho gửi trước khi đến lấy hàng.','identity-shop-001407','membership-shop-001407-owner',1,'shop-user-001407','Nguyễn Hà My','supership-web','web-chrome-shop-001407','WEB','corr-d106-vtp-20260919-000007',2,'2026-09-19 09:00:00+00','2026-09-19 09:03:12+00','order-orchestrator'),
('16100000-0000-7000-8000-000000000001','9100000000008','10000000-0000-7000-8000-000000000001','SHOP-DN-2026-001408','SPF-0301',3,3,1,'SHP-CONFIG-DN-001408','4','SHP-DECISION-20260919-000008','PRC-DN-VNP-2026-09',0,1,1,1,ARRAY[]::smallint[],'2026-09-20 03:00:00+00','2026-09-20 06:00:00+00','Giao tại quầy tiếp nhận của tòa nhà.','identity-shop-001408','membership-shop-001408-owner',1,'shop-user-001408','Phạm Minh Châu','supership-web','web-edge-shop-001408','WEB','corr-d106-vnp-20260919-000008',2,'2026-09-19 09:10:00+00','2026-09-19 09:13:15+00','order-orchestrator'),
('16200000-0000-7000-8000-000000000001','9100000000009','10000000-0000-7000-8000-000000000001','SHOP-HCM-2026-001409','SPF-0301',3,3,1,'SHP-CONFIG-HCM-001409','6','SHP-DECISION-20260919-000009','PRC-HCM-BEST-2026-09',1180000,3,1,1,ARRAY[]::smallint[],'2026-09-20 01:00:00+00','2026-09-20 04:00:00+00','Cho người nhận kiểm tra sản phẩm theo chính sách đã chọn.','identity-shop-001409','membership-shop-001409-owner',1,'shop-user-001409','Lê Quốc Khánh','supership-web','web-safari-shop-001409','WEB','corr-d106-best-20260919-000009',2,'2026-09-19 09:20:00+00','2026-09-19 09:23:18+00','order-orchestrator');

INSERT INTO order_addresses (
    address_id,order_id,address_type,address_model,source_type,source_code,source_name,
    address_detail,full_address,province_code,district_code,commune_code,latitude,longitude,
    valid_from,version_no,created_at,created_by
) VALUES
('16000000-0000-7000-8000-000000000011','16000000-0000-7000-8000-000000000001',1,1,1,'SHOP-WH-HN-1407','Kho hàng Cầu Giấy','Số 38 phố Duy Tân','Số 38 phố Duy Tân, phường Dịch Vọng Hậu, quận Cầu Giấy, Hà Nội','01','001','00007',21.0296100,105.7824500,'2026-09-19 09:00:00+00',1,'2026-09-19 09:00:00+00','order-api'),
('16000000-0000-7000-8000-000000000012','16000000-0000-7000-8000-000000000001',2,1,2,'ADR-HCM-001407','Địa chỉ giao hàng','Số 15 đường Nguyễn Văn Thương','Số 15 đường Nguyễn Văn Thương, phường 25, quận Bình Thạnh, Thành phố Hồ Chí Minh','79','765','26965',10.8041100,106.7158700,'2026-09-19 09:00:00+00',1,'2026-09-19 09:00:00+00','order-api'),
('16100000-0000-7000-8000-000000000011','16100000-0000-7000-8000-000000000001',1,1,1,'SHOP-WH-DN-1408','Kho hàng Hải Châu','Số 84 đường Hoàng Diệu','Số 84 đường Hoàng Diệu, phường Phước Ninh, quận Hải Châu, Đà Nẵng','48','492','20242',16.0615200,108.2181300,'2026-09-19 09:10:00+00',1,'2026-09-19 09:10:00+00','order-api'),
('16100000-0000-7000-8000-000000000012','16100000-0000-7000-8000-000000000001',2,1,2,'ADR-HUE-001408','Địa chỉ giao hàng','Số 43 đường Tố Hữu','Số 43 đường Tố Hữu, phường Xuân Phú, thành phố Huế, Thừa Thiên Huế','46','474','19815',16.4584100,107.6077500,'2026-09-19 09:10:00+00',1,'2026-09-19 09:10:00+00','order-api'),
('16200000-0000-7000-8000-000000000011','16200000-0000-7000-8000-000000000001',1,1,1,'SHOP-WH-HCM-1409','Kho hàng Tân Phú','Số 116 đường Tân Kỳ Tân Quý','Số 116 đường Tân Kỳ Tân Quý, phường Tân Sơn Nhì, quận Tân Phú, Thành phố Hồ Chí Minh','79','767','27058',10.8018700,106.6299400,'2026-09-19 09:20:00+00',1,'2026-09-19 09:20:00+00','order-api'),
('16200000-0000-7000-8000-000000000012','16200000-0000-7000-8000-000000000001',2,1,2,'ADR-CT-001409','Địa chỉ giao hàng','Số 52 đường Nguyễn Việt Hồng','Số 52 đường Nguyễn Việt Hồng, phường An Phú, quận Ninh Kiều, Cần Thơ','92','916','31135',10.0334200,105.7759100,'2026-09-19 09:20:00+00',1,'2026-09-19 09:20:00+00','order-api');

INSERT INTO order_parties (party_id,order_id,party_type,name,contact_name,phone,email,valid_from,version_no,created_at,created_by) VALUES
('16000000-0000-7000-8000-000000000021','16000000-0000-7000-8000-000000000001',1,'Cửa hàng Gia Dụng Mộc Lam','Đặng Thu Hiền','0326006001','hien.dang.1407@example.com','2026-09-19 09:00:00+00',1,'2026-09-19 09:00:00+00','order-api'),
('16000000-0000-7000-8000-000000000022','16000000-0000-7000-8000-000000000001',2,'Vũ Đức Thành','Vũ Đức Thành','0326006002','thanh.vu.1407@example.net','2026-09-19 09:00:00+00',1,'2026-09-19 09:00:00+00','order-api'),
('16100000-0000-7000-8000-000000000021','16100000-0000-7000-8000-000000000001',1,'Cửa hàng Trà Việt An','Trần Ngọc Hương','0326006003','huong.tran.1408@example.com','2026-09-19 09:10:00+00',1,'2026-09-19 09:10:00+00','order-api'),
('16100000-0000-7000-8000-000000000022','16100000-0000-7000-8000-000000000001',2,'Bùi Anh Khoa','Bùi Anh Khoa','0326006004','khoa.bui.1408@example.net','2026-09-19 09:10:00+00',1,'2026-09-19 09:10:00+00','order-api'),
('16200000-0000-7000-8000-000000000021','16200000-0000-7000-8000-000000000001',1,'Cửa hàng Thiết bị Minh Tâm','Nguyễn Thanh Trúc','0326006005','truc.nguyen.1409@example.com','2026-09-19 09:20:00+00',1,'2026-09-19 09:20:00+00','order-api'),
('16200000-0000-7000-8000-000000000022','16200000-0000-7000-8000-000000000001',2,'Đỗ Hoàng Phúc','Đỗ Hoàng Phúc','0326006006','phuc.do.1409@example.net','2026-09-19 09:20:00+00',1,'2026-09-19 09:20:00+00','order-api');

INSERT INTO order_goods (goods_id,order_id,content_type,product_name,declared_value,currency_code,tag_codes,valid_from,version_no,created_at,created_by) VALUES
('16000000-0000-7000-8000-000000000031','16000000-0000-7000-8000-000000000001',1,'Bộ nồi inox ba món dùng cho bếp từ',920000,'VND',ARRAY[]::smallint[],'2026-09-19 09:00:00+00',1,'2026-09-19 09:00:00+00','order-api'),
('16100000-0000-7000-8000-000000000031','16100000-0000-7000-8000-000000000001',1,'Hộp trà ô long túi lọc 40 gói',360000,'VND',ARRAY[]::smallint[],'2026-09-19 09:10:00+00',1,'2026-09-19 09:10:00+00','order-api'),
('16200000-0000-7000-8000-000000000031','16200000-0000-7000-8000-000000000001',1,'Máy hút bụi cầm tay không dây',1680000,'VND',ARRAY[5]::smallint[],'2026-09-19 09:20:00+00',1,'2026-09-19 09:20:00+00','order-api');

INSERT INTO parcel_measures (measure_id,order_id,measure_kind,source_type,weight_g,length_cm,width_cm,height_cm,measured_at,source_ref,created_at) VALUES
('16000000-0000-7000-8000-000000000041','16000000-0000-7000-8000-000000000001',1,1,5200,42,34,28,'2026-09-19 08:55:00+00','SHOP-MEASURE-D106-VTP','2026-09-19 09:00:00+00'),
('16100000-0000-7000-8000-000000000041','16100000-0000-7000-8000-000000000001',1,1,680,28,22,16,'2026-09-19 09:05:00+00','SHOP-MEASURE-D106-VNP','2026-09-19 09:10:00+00'),
('16200000-0000-7000-8000-000000000041','16200000-0000-7000-8000-000000000001',1,1,3100,48,19,18,'2026-09-19 09:15:00+00','SHOP-MEASURE-D106-BEST','2026-09-19 09:20:00+00');

INSERT INTO order_legs (leg_id,order_id,stage_code,stage_no,leg_type,stage_status_code,carrier_code,carrier_client_code,version_no,created_at,updated_at) VALUES
('16000000-0000-7000-8000-000000000051','16000000-0000-7000-8000-000000000001','STG-DELIVERY-0001',1,2,'WAITING_PICKUP',4,'VTP-HN-SHOP-1407',2,'2026-09-19 09:01:00+00','2026-09-19 09:03:12+00'),
('16100000-0000-7000-8000-000000000051','16100000-0000-7000-8000-000000000001','STG-DELIVERY-0001',1,2,'WAITING_PICKUP',13,'VNP-DN-SHOP-1408',2,'2026-09-19 09:11:00+00','2026-09-19 09:13:15+00'),
('16200000-0000-7000-8000-000000000051','16200000-0000-7000-8000-000000000001','STG-DELIVERY-0001',1,2,'WAITING_PICKUP',6,'BEST-HCM-SHOP-1409',2,'2026-09-19 09:21:00+00','2026-09-19 09:23:18+00');

UPDATE orders SET current_leg_id='16000000-0000-7000-8000-000000000051',custodian_carrier_code=4 WHERE order_id='16000000-0000-7000-8000-000000000001';
UPDATE orders SET current_leg_id='16100000-0000-7000-8000-000000000051',custodian_carrier_code=13 WHERE order_id='16100000-0000-7000-8000-000000000001';
UPDATE orders SET current_leg_id='16200000-0000-7000-8000-000000000051',custodian_carrier_code=6 WHERE order_id='16200000-0000-7000-8000-000000000001';

INSERT INTO leg_endpoints (leg_endpoint_id,order_id,leg_id,endpoint_role,location_type,order_address_id,location_name,valid_from,version_no,created_at) VALUES
('16000000-0000-7000-8000-000000000052','16000000-0000-7000-8000-000000000001','16000000-0000-7000-8000-000000000051',1,1,'16000000-0000-7000-8000-000000000011','Kho hàng Cầu Giấy','2026-09-19 09:01:00+00',1,'2026-09-19 09:01:00+00'),
('16000000-0000-7000-8000-000000000053','16000000-0000-7000-8000-000000000001','16000000-0000-7000-8000-000000000051',2,1,'16000000-0000-7000-8000-000000000012','Địa chỉ nhận Bình Thạnh','2026-09-19 09:01:00+00',1,'2026-09-19 09:01:00+00'),
('16100000-0000-7000-8000-000000000052','16100000-0000-7000-8000-000000000001','16100000-0000-7000-8000-000000000051',1,1,'16100000-0000-7000-8000-000000000011','Kho hàng Hải Châu','2026-09-19 09:11:00+00',1,'2026-09-19 09:11:00+00'),
('16100000-0000-7000-8000-000000000053','16100000-0000-7000-8000-000000000001','16100000-0000-7000-8000-000000000051',2,1,'16100000-0000-7000-8000-000000000012','Địa chỉ nhận Xuân Phú','2026-09-19 09:11:00+00',1,'2026-09-19 09:11:00+00'),
('16200000-0000-7000-8000-000000000052','16200000-0000-7000-8000-000000000001','16200000-0000-7000-8000-000000000051',1,1,'16200000-0000-7000-8000-000000000011','Kho hàng Tân Phú','2026-09-19 09:21:00+00',1,'2026-09-19 09:21:00+00'),
('16200000-0000-7000-8000-000000000053','16200000-0000-7000-8000-000000000001','16200000-0000-7000-8000-000000000051',2,1,'16200000-0000-7000-8000-000000000012','Địa chỉ nhận Ninh Kiều','2026-09-19 09:21:00+00',1,'2026-09-19 09:21:00+00');

INSERT INTO leg_services (leg_service_id,order_id,leg_id,carrier_code,service_code,service_name,fulfillment_mode,carrier_client_code,policy_ref,policy_version,pricing_result_ref,carrier_fee_amount,shop_shipping_fee_amount,priced_at,valid_from,version_no,created_at) VALUES
('16000000-0000-7000-8000-000000000061','16000000-0000-7000-8000-000000000001','16000000-0000-7000-8000-000000000051',4,'VTP-STANDARD','Viettel Post tiêu chuẩn',2,'VTP-HN-SHOP-1407','SHP-POLICY-VTP-NATIONWIDE','5','PRC-RESULT-D106-VTP',38500,44000,'2026-09-19 09:01:30+00','2026-09-19 09:01:30+00',1,'2026-09-19 09:01:30+00'),
('16100000-0000-7000-8000-000000000061','16100000-0000-7000-8000-000000000001','16100000-0000-7000-8000-000000000051',13,'VNP-ECONOMY','Vietnam Post tiết kiệm',2,'VNP-DN-SHOP-1408','SHP-POLICY-VNP-CENTRAL','3','PRC-RESULT-D106-VNP',21000,25000,'2026-09-19 09:11:30+00','2026-09-19 09:11:30+00',1,'2026-09-19 09:11:30+00'),
('16200000-0000-7000-8000-000000000061','16200000-0000-7000-8000-000000000001','16200000-0000-7000-8000-000000000051',6,'BEST-STANDARD','BEST Express tiêu chuẩn',2,'BEST-HCM-SHOP-1409','SHP-POLICY-BEST-SOUTH','4','PRC-RESULT-D106-BEST',29500,34000,'2026-09-19 09:21:30+00','2026-09-19 09:21:30+00',1,'2026-09-19 09:21:30+00');

INSERT INTO order_requests (request_id,order_id,request_code,request_type,request_status,payload_version,request_payload,source_type,requested_by_actor_type,requested_by_actor_ref,requested_by_display_name,requested_at,result_code,completed_at,correlation_id,version_no,created_at,updated_at) VALUES
('16000000-0000-7000-8000-000000000071','16000000-0000-7000-8000-000000000001','REQ-D106-VTP-CREATE-WAYBILL','CREATE_WAYBILL',3,1,'{"carrier_code":4,"service_code":"VTP-STANDARD","cod_amount":690000}'::jsonb,4,3,'order-orchestrator','Tiến trình điều phối vận đơn','2026-09-19 09:02:00+00','WAYBILL_CREATED','2026-09-19 09:02:12+00','corr-d106-vtp-waybill-20260919-000007',1,'2026-09-19 09:02:00+00','2026-09-19 09:02:12+00'),
('16100000-0000-7000-8000-000000000071','16100000-0000-7000-8000-000000000001','REQ-D106-VNP-CREATE-WAYBILL','CREATE_WAYBILL',3,1,'{"carrier_code":13,"service_code":"VNP-ECONOMY","cod_amount":0}'::jsonb,4,3,'order-orchestrator','Tiến trình điều phối vận đơn','2026-09-19 09:12:00+00','WAYBILL_CREATED','2026-09-19 09:12:15+00','corr-d106-vnp-waybill-20260919-000008',1,'2026-09-19 09:12:00+00','2026-09-19 09:12:15+00'),
('16200000-0000-7000-8000-000000000071','16200000-0000-7000-8000-000000000001','REQ-D106-BEST-CREATE-WAYBILL','CREATE_WAYBILL',3,1,'{"carrier_code":6,"service_code":"BEST-STANDARD","cod_amount":1180000}'::jsonb,4,3,'order-orchestrator','Tiến trình điều phối vận đơn','2026-09-19 09:22:00+00','WAYBILL_CREATED','2026-09-19 09:22:18+00','corr-d106-best-waybill-20260919-000009',1,'2026-09-19 09:22:00+00','2026-09-19 09:22:18+00');

INSERT INTO request_targets (request_target_id,order_id,request_id,target_type,leg_id,created_at) VALUES
('16000000-0000-7000-8000-000000000072','16000000-0000-7000-8000-000000000001','16000000-0000-7000-8000-000000000071','LEG','16000000-0000-7000-8000-000000000051','2026-09-19 09:02:00+00'),
('16100000-0000-7000-8000-000000000072','16100000-0000-7000-8000-000000000001','16100000-0000-7000-8000-000000000071','LEG','16100000-0000-7000-8000-000000000051','2026-09-19 09:12:00+00'),
('16200000-0000-7000-8000-000000000072','16200000-0000-7000-8000-000000000001','16200000-0000-7000-8000-000000000071','LEG','16200000-0000-7000-8000-000000000051','2026-09-19 09:22:00+00');

INSERT INTO waybills (waybill_id,order_id,carrier_code,carrier_waybill_code,carrier_client_code,origin_request_id,sender_party_id,receiver_party_id,pickup_address_id,delivery_address_id,goods_id,measure_id,leg_service_id,pickup_method,fee_payer,inspection_type,cod_amount,collection_amount,declared_value,delivery_note,carrier_options,snapshot_schema_version,snapshot_hash,carrier_sorting_code,waybill_status,request_sent_at,carrier_accepted_at,created_at,updated_at) VALUES
('16000000-0000-7000-8000-000000000081','16000000-0000-7000-8000-000000000001',4,'SOO10902766013','VTP-HN-SHOP-1407','16000000-0000-7000-8000-000000000071','16000000-0000-7000-8000-000000000021','16000000-0000-7000-8000-000000000022','16000000-0000-7000-8000-000000000011','16000000-0000-7000-8000-000000000012','16000000-0000-7000-8000-000000000031','16000000-0000-7000-8000-000000000041','16000000-0000-7000-8000-000000000061',1,1,2,690000,690000,920000,'Gọi kho gửi trước khi đến lấy hàng.','[]'::jsonb,1,'0ab531c53ec8047ca19b3b8fc190ab8a564c795db83ccf112bbd0c4df10621ec',NULL,1,'2026-09-19 09:02:00+00','2026-09-19 09:02:12+00','2026-09-19 09:02:12+00','2026-09-19 09:03:12+00'),
('16100000-0000-7000-8000-000000000081','16100000-0000-7000-8000-000000000001',13,'CC2199034123VN','VNP-DN-SHOP-1408','16100000-0000-7000-8000-000000000071','16100000-0000-7000-8000-000000000021','16100000-0000-7000-8000-000000000022','16100000-0000-7000-8000-000000000011','16100000-0000-7000-8000-000000000012','16100000-0000-7000-8000-000000000031','16100000-0000-7000-8000-000000000041','16100000-0000-7000-8000-000000000061',1,1,1,0,0,360000,'Giao tại quầy tiếp nhận của tòa nhà.','[]'::jsonb,1,'e3e9b55af53862495c75bd3fccebf46f1fc562968bb8243588a12717ffd5db4c',NULL,1,'2026-09-19 09:12:00+00','2026-09-19 09:12:15+00','2026-09-19 09:12:15+00','2026-09-19 09:13:15+00'),
('16200000-0000-7000-8000-000000000081','16200000-0000-7000-8000-000000000001',6,'999800060099891','BEST-HCM-SHOP-1409','16200000-0000-7000-8000-000000000071','16200000-0000-7000-8000-000000000021','16200000-0000-7000-8000-000000000022','16200000-0000-7000-8000-000000000011','16200000-0000-7000-8000-000000000012','16200000-0000-7000-8000-000000000031','16200000-0000-7000-8000-000000000041','16200000-0000-7000-8000-000000000061',1,1,3,1180000,1180000,1680000,'Cho người nhận kiểm tra sản phẩm theo chính sách đã chọn.','[]'::jsonb,1,'4a9d92348658db31fadec6529dc091667d213725cf8d796b482e192f43e73ce5','OO012-00-003-02',1,'2026-09-19 09:22:00+00','2026-09-19 09:22:18+00','2026-09-19 09:22:18+00','2026-09-19 09:23:18+00');

INSERT INTO leg_waybills (leg_waybill_id,order_id,leg_id,waybill_id,sequence_no,active_from,created_at) VALUES
('16000000-0000-7000-8000-000000000082','16000000-0000-7000-8000-000000000001','16000000-0000-7000-8000-000000000051','16000000-0000-7000-8000-000000000081',1,'2026-09-19 09:02:12+00','2026-09-19 09:02:12+00'),
('16100000-0000-7000-8000-000000000082','16100000-0000-7000-8000-000000000001','16100000-0000-7000-8000-000000000051','16100000-0000-7000-8000-000000000081',1,'2026-09-19 09:12:15+00','2026-09-19 09:12:15+00'),
('16200000-0000-7000-8000-000000000082','16200000-0000-7000-8000-000000000001','16200000-0000-7000-8000-000000000051','16200000-0000-7000-8000-000000000081',1,'2026-09-19 09:22:18+00','2026-09-19 09:22:18+00');

INSERT INTO request_steps (request_step_id,order_id,request_id,request_target_id,step_no,step_type,step_status,carrier_code,result_waybill_id,correlation_id,external_ref,request_hash,result_code,attempt_count,started_at,completed_at,version_no,created_at,updated_at) VALUES
('16000000-0000-7000-8000-000000000083','16000000-0000-7000-8000-000000000001','16000000-0000-7000-8000-000000000071','16000000-0000-7000-8000-000000000072',1,'CREATE_WAYBILL','SUCCESS',4,'16000000-0000-7000-8000-000000000081','corr-d106-vtp-waybill-20260919-000007','VTP-BOOKING-20260919-1407','ef8c9812348090c2bc62f9153c17affa62eac318e4eac504fab63e1f95754976','WAYBILL_CREATED',1,'2026-09-19 09:02:00+00','2026-09-19 09:02:12+00',1,'2026-09-19 09:02:00+00','2026-09-19 09:02:12+00'),
('16100000-0000-7000-8000-000000000083','16100000-0000-7000-8000-000000000001','16100000-0000-7000-8000-000000000071','16100000-0000-7000-8000-000000000072',1,'CREATE_WAYBILL','SUCCESS',13,'16100000-0000-7000-8000-000000000081','corr-d106-vnp-waybill-20260919-000008','VNP-BOOKING-20260919-1408','6f060acb80341e0ecb92d3a706ba6830b37a908af17d262b1ae08e9e04f73fa8','WAYBILL_CREATED',1,'2026-09-19 09:12:00+00','2026-09-19 09:12:15+00',1,'2026-09-19 09:12:00+00','2026-09-19 09:12:15+00'),
('16200000-0000-7000-8000-000000000083','16200000-0000-7000-8000-000000000001','16200000-0000-7000-8000-000000000071','16200000-0000-7000-8000-000000000072',1,'CREATE_WAYBILL','SUCCESS',6,'16200000-0000-7000-8000-000000000081','corr-d106-best-waybill-20260919-000009','BEST-BOOKING-20260919-1409','404887a4c2b52cee7fc89bab4f4a3ac6c43e3de0735e2b1f3174b25da2a15ac8','WAYBILL_CREATED',1,'2026-09-19 09:22:00+00','2026-09-19 09:22:18+00',1,'2026-09-19 09:22:00+00','2026-09-19 09:22:18+00');

INSERT INTO order_status_history (status_history_id,order_id,from_status_code,status_code,version_no,request_id,reason_code,reason,changed_by_actor_type,changed_by_actor_ref,changed_at,created_at) VALUES
('16000000-0000-7000-8000-000000000091','16000000-0000-7000-8000-000000000001',NULL,'SPF-0101',1,'16000000-0000-7000-8000-000000000071','WAYBILL_CREATING','Đang gửi yêu cầu tạo vận đơn Viettel Post.',3,'order-orchestrator','2026-09-19 09:02:00+00','2026-09-19 09:02:00+00'),
('16000000-0000-7000-8000-000000000092','16000000-0000-7000-8000-000000000001','SPF-0101','SPF-0301',2,'16000000-0000-7000-8000-000000000071','WAYBILL_CREATED','Viettel Post đã cấp mã vận đơn; Order chờ lấy hàng.',3,'order-orchestrator','2026-09-19 09:02:12+00','2026-09-19 09:02:12+00'),
('16100000-0000-7000-8000-000000000091','16100000-0000-7000-8000-000000000001',NULL,'SPF-0101',1,'16100000-0000-7000-8000-000000000071','WAYBILL_CREATING','Đang gửi yêu cầu tạo vận đơn Vietnam Post.',3,'order-orchestrator','2026-09-19 09:12:00+00','2026-09-19 09:12:00+00'),
('16100000-0000-7000-8000-000000000092','16100000-0000-7000-8000-000000000001','SPF-0101','SPF-0301',2,'16100000-0000-7000-8000-000000000071','WAYBILL_CREATED','Vietnam Post đã cấp mã vận đơn; Order chờ lấy hàng.',3,'order-orchestrator','2026-09-19 09:12:15+00','2026-09-19 09:12:15+00'),
('16200000-0000-7000-8000-000000000091','16200000-0000-7000-8000-000000000001',NULL,'SPF-0101',1,'16200000-0000-7000-8000-000000000071','WAYBILL_CREATING','Đang gửi yêu cầu tạo vận đơn BEST Express.',3,'order-orchestrator','2026-09-19 09:22:00+00','2026-09-19 09:22:00+00'),
('16200000-0000-7000-8000-000000000092','16200000-0000-7000-8000-000000000001','SPF-0101','SPF-0301',2,'16200000-0000-7000-8000-000000000071','WAYBILL_CREATED','BEST Express đã cấp mã vận đơn; Order chờ lấy hàng.',3,'order-orchestrator','2026-09-19 09:22:18+00','2026-09-19 09:22:18+00');

COMMIT;

-- ===== SOURCE: test_data/007_direct_carrier_pickup_stage_repair.sql =====
BEGIN;
SET LOCAL search_path TO order_mgmt, public;

-- Direct-carrier orders with pickup_method = 1 still have a PICKUP leg.
-- The carrier may use the same Waybill for PICKUP and DELIVERY, but the two
-- operational stages must remain visible to the Shop journey UI.

-- `stage_no` is unique per Order, so move the existing DELIVERY stage first;
-- otherwise inserting PICKUP as stage 1 would violate the unique constraint.
UPDATE order_legs
   SET stage_no=2
 WHERE leg_id IN (
   '12000000-0000-7000-8000-000000000061',
   '14000000-0000-7000-8000-000000000061',
   '16000000-0000-7000-8000-000000000051',
   '16200000-0000-7000-8000-000000000051'
 );

INSERT INTO order_legs (
  leg_id, order_id, stage_code, stage_no, leg_type, stage_status_code,
  carrier_code, carrier_client_code, started_at, completed_at, version_no,
  created_at, updated_at
) VALUES
('12000000-0000-7000-8000-000000000060','12000000-0000-7000-8000-000000000001','STG-PICKUP-0001',1,1,'PICKED_UP',2,'GHN-DN-SHOP-0327','2026-09-11 01:20:00+00','2026-09-11 01:42:00+00',1,'2026-09-10 09:01:00+00','2026-09-11 01:42:00+00'),
('14000000-0000-7000-8000-000000000060','14000000-0000-7000-8000-000000000001','STG-PICKUP-0001',1,1,'PICKED_UP',10,'SPX-HN-SHOP-0908','2026-09-07 01:15:00+00','2026-09-07 01:45:00+00',1,'2026-09-06 03:01:00+00','2026-09-07 01:45:00+00'),
('16000000-0000-7000-8000-000000000050','16000000-0000-7000-8000-000000000001','STG-PICKUP-0001',1,1,'WAITING_PICKUP',4,'VTP-HN-SHOP-1407','2026-09-19 09:03:12+00',NULL,1,'2026-09-19 09:01:00+00','2026-09-19 09:03:12+00'),
('16200000-0000-7000-8000-000000000050','16200000-0000-7000-8000-000000000001','STG-PICKUP-0001',1,1,'WAITING_PICKUP',6,'BEST-HCM-SHOP-1409','2026-09-19 09:23:18+00',NULL,1,'2026-09-19 09:21:00+00','2026-09-19 09:23:18+00');

-- DELIVERY is the second stage for NVC pickup orders. For the two waiting
-- orders it remains pending until the pickup stage is completed.
UPDATE order_legs
   SET stage_status_code='PENDING', started_at=NULL, completed_at=NULL
 WHERE leg_id IN (
   '16000000-0000-7000-8000-000000000051',
   '16200000-0000-7000-8000-000000000051'
 );

UPDATE orders
   SET current_leg_id='16000000-0000-7000-8000-000000000050'
 WHERE order_code='9100000000007';

UPDATE orders
   SET current_leg_id='16200000-0000-7000-8000-000000000050'
 WHERE order_code='9100000000009';

-- D1-02 was authored before the explicit PICKUP leg existed. Reattach its
-- pickup attempt/events to that leg and restart the per-leg event sequence;
-- the order-level sequence remains unchanged.
UPDATE transport_attempts
   SET leg_id='12000000-0000-7000-8000-000000000060'
 WHERE attempt_id='12000000-0000-7000-8000-0000000000a1';

UPDATE tracking_events
   SET leg_id='12000000-0000-7000-8000-000000000060',
       leg_sequence_no=CASE event_id
         WHEN '12000000-0000-7000-8000-0000000000b1' THEN 1
         WHEN '12000000-0000-7000-8000-0000000000b2' THEN 2
       END
 WHERE event_id IN (
   '12000000-0000-7000-8000-0000000000b1',
   '12000000-0000-7000-8000-0000000000b2'
 );

UPDATE tracking_events
   SET leg_sequence_no=CASE event_id
     WHEN '12000000-0000-7000-8000-0000000000b3' THEN 1
     WHEN '12000000-0000-7000-8000-0000000000b4' THEN 2
     WHEN '12000000-0000-7000-8000-0000000000b5' THEN 3
   END
 WHERE event_id IN (
   '12000000-0000-7000-8000-0000000000b3',
   '12000000-0000-7000-8000-0000000000b4',
   '12000000-0000-7000-8000-0000000000b5'
 );

-- Keep both legs connected to the same parcel items and the same carrier
-- service/Waybill snapshot. This is the direct-carrier equivalent of the
-- multi-carrier PICKUP -> DELIVERY route already present in the seed.
INSERT INTO leg_items (order_id,leg_id,item_id,quantity,created_at)
SELECT li.order_id,'12000000-0000-7000-8000-000000000060',li.item_id,li.quantity,'2026-09-11 01:20:00+00'
  FROM leg_items li WHERE li.leg_id='12000000-0000-7000-8000-000000000061';
INSERT INTO leg_items (order_id,leg_id,item_id,quantity,created_at)
SELECT li.order_id,'14000000-0000-7000-8000-000000000060',li.item_id,li.quantity,'2026-09-07 01:15:00+00'
  FROM leg_items li WHERE li.leg_id='14000000-0000-7000-8000-000000000061';
INSERT INTO leg_items (order_id,leg_id,item_id,quantity,created_at)
SELECT li.order_id,'16000000-0000-7000-8000-000000000050',li.item_id,li.quantity,'2026-09-19 09:03:12+00'
  FROM leg_items li WHERE li.leg_id='16000000-0000-7000-8000-000000000051';
INSERT INTO leg_items (order_id,leg_id,item_id,quantity,created_at)
SELECT li.order_id,'16200000-0000-7000-8000-000000000050',li.item_id,li.quantity,'2026-09-19 09:23:18+00'
  FROM leg_items li WHERE li.leg_id='16200000-0000-7000-8000-000000000051';

INSERT INTO leg_services (
  leg_service_id,order_id,leg_id,carrier_code,service_code,service_name,
  fulfillment_mode,carrier_client_code,policy_ref,policy_version,
  pricing_result_ref,carrier_fee_amount,shop_shipping_fee_amount,priced_at,
  valid_from,version_no,created_at
)
SELECT '12000000-0000-7000-8000-000000000070',ls.order_id,'12000000-0000-7000-8000-000000000060',ls.carrier_code,ls.service_code,ls.service_name,ls.fulfillment_mode,ls.carrier_client_code,ls.policy_ref,ls.policy_version,ls.pricing_result_ref,ls.carrier_fee_amount,ls.shop_shipping_fee_amount,ls.priced_at,ls.valid_from,1,'2026-09-11 01:20:00+00'
  FROM leg_services ls WHERE ls.leg_id='12000000-0000-7000-8000-000000000061';
INSERT INTO leg_services (
  leg_service_id,order_id,leg_id,carrier_code,service_code,service_name,
  fulfillment_mode,carrier_client_code,policy_ref,policy_version,
  pricing_result_ref,carrier_fee_amount,shop_shipping_fee_amount,priced_at,
  valid_from,version_no,created_at
)
SELECT '14000000-0000-7000-8000-000000000070',ls.order_id,'14000000-0000-7000-8000-000000000060',ls.carrier_code,ls.service_code,ls.service_name,ls.fulfillment_mode,ls.carrier_client_code,ls.policy_ref,ls.policy_version,ls.pricing_result_ref,ls.carrier_fee_amount,ls.shop_shipping_fee_amount,ls.priced_at,ls.valid_from,1,'2026-09-07 01:15:00+00'
  FROM leg_services ls WHERE ls.leg_id='14000000-0000-7000-8000-000000000061';
INSERT INTO leg_services (
  leg_service_id,order_id,leg_id,carrier_code,service_code,service_name,
  fulfillment_mode,carrier_client_code,policy_ref,policy_version,
  pricing_result_ref,carrier_fee_amount,shop_shipping_fee_amount,priced_at,
  valid_from,version_no,created_at
)
SELECT '16000000-0000-7000-8000-000000000060',ls.order_id,'16000000-0000-7000-8000-000000000050',ls.carrier_code,ls.service_code,ls.service_name,ls.fulfillment_mode,ls.carrier_client_code,ls.policy_ref,ls.policy_version,ls.pricing_result_ref,ls.carrier_fee_amount,ls.shop_shipping_fee_amount,ls.priced_at,ls.valid_from,1,'2026-09-19 09:03:12+00'
  FROM leg_services ls WHERE ls.leg_id='16000000-0000-7000-8000-000000000051';
INSERT INTO leg_services (
  leg_service_id,order_id,leg_id,carrier_code,service_code,service_name,
  fulfillment_mode,carrier_client_code,policy_ref,policy_version,
  pricing_result_ref,carrier_fee_amount,shop_shipping_fee_amount,priced_at,
  valid_from,version_no,created_at
)
SELECT '16200000-0000-7000-8000-000000000060',ls.order_id,'16200000-0000-7000-8000-000000000050',ls.carrier_code,ls.service_code,ls.service_name,ls.fulfillment_mode,ls.carrier_client_code,ls.policy_ref,ls.policy_version,ls.pricing_result_ref,ls.carrier_fee_amount,ls.shop_shipping_fee_amount,ls.priced_at,ls.valid_from,1,'2026-09-19 09:23:18+00'
  FROM leg_services ls WHERE ls.leg_id='16200000-0000-7000-8000-000000000051';

INSERT INTO leg_waybills (leg_waybill_id,order_id,leg_id,waybill_id,sequence_no,active_from,created_at) VALUES
('12000000-0000-7000-8000-000000000094','12000000-0000-7000-8000-000000000001','12000000-0000-7000-8000-000000000060','12000000-0000-7000-8000-000000000091',1,'2026-09-11 01:20:00+00','2026-09-11 01:20:00+00'),
('14000000-0000-7000-8000-000000000083','14000000-0000-7000-8000-000000000001','14000000-0000-7000-8000-000000000060','14000000-0000-7000-8000-000000000081',1,'2026-09-07 01:15:00+00','2026-09-07 01:15:00+00'),
('16000000-0000-7000-8000-000000000083','16000000-0000-7000-8000-000000000001','16000000-0000-7000-8000-000000000050','16000000-0000-7000-8000-000000000081',1,'2026-09-19 09:03:12+00','2026-09-19 09:03:12+00'),
('16200000-0000-7000-8000-000000000083','16200000-0000-7000-8000-000000000001','16200000-0000-7000-8000-000000000050','16200000-0000-7000-8000-000000000081',1,'2026-09-19 09:23:18+00','2026-09-19 09:23:18+00');

INSERT INTO leg_endpoints (
  leg_endpoint_id,order_id,leg_id,endpoint_role,location_type,order_address_id,
  source_module,source_code,location_name,address_model,address_detail,full_address,
  province_code,district_code,commune_code,latitude,longitude,valid_from,version_no,created_at
)
SELECT (CASE le.endpoint_role WHEN 1 THEN '12000000-0000-7000-8000-000000000062' ELSE '12000000-0000-7000-8000-000000000063' END)::uuid,le.order_id,'12000000-0000-7000-8000-000000000060',le.endpoint_role,le.location_type,le.order_address_id,le.source_module,'PICKUP-'||le.source_code,le.location_name,le.address_model,le.address_detail,le.full_address,le.province_code,le.district_code,le.commune_code,le.latitude,le.longitude,le.valid_from,1,'2026-09-11 01:20:00+00'
  FROM leg_endpoints le WHERE le.leg_id='12000000-0000-7000-8000-000000000061';
INSERT INTO leg_endpoints (
  leg_endpoint_id,order_id,leg_id,endpoint_role,location_type,order_address_id,
  source_module,source_code,location_name,address_model,address_detail,full_address,
  province_code,district_code,commune_code,latitude,longitude,valid_from,version_no,created_at
)
SELECT (CASE le.endpoint_role WHEN 1 THEN '14000000-0000-7000-8000-000000000062' ELSE '14000000-0000-7000-8000-000000000063' END)::uuid,le.order_id,'14000000-0000-7000-8000-000000000060',le.endpoint_role,le.location_type,le.order_address_id,le.source_module,'PICKUP-'||le.source_code,le.location_name,le.address_model,le.address_detail,le.full_address,le.province_code,le.district_code,le.commune_code,le.latitude,le.longitude,le.valid_from,1,'2026-09-07 01:15:00+00'
  FROM leg_endpoints le WHERE le.leg_id='14000000-0000-7000-8000-000000000061';
INSERT INTO leg_endpoints (
  leg_endpoint_id,order_id,leg_id,endpoint_role,location_type,order_address_id,
  source_module,source_code,location_name,address_model,address_detail,full_address,
  province_code,district_code,commune_code,latitude,longitude,valid_from,version_no,created_at
)
SELECT (CASE le.endpoint_role WHEN 1 THEN '16000000-0000-7000-8000-000000000054' ELSE '16000000-0000-7000-8000-000000000055' END)::uuid,le.order_id,'16000000-0000-7000-8000-000000000050',le.endpoint_role,le.location_type,le.order_address_id,le.source_module,'PICKUP-'||le.source_code,le.location_name,le.address_model,le.address_detail,le.full_address,le.province_code,le.district_code,le.commune_code,le.latitude,le.longitude,le.valid_from,1,'2026-09-19 09:03:12+00'
  FROM leg_endpoints le WHERE le.leg_id='16000000-0000-7000-8000-000000000051';
INSERT INTO leg_endpoints (
  leg_endpoint_id,order_id,leg_id,endpoint_role,location_type,order_address_id,
  source_module,source_code,location_name,address_model,address_detail,full_address,
  province_code,district_code,commune_code,latitude,longitude,valid_from,version_no,created_at
)
SELECT (CASE le.endpoint_role WHEN 1 THEN '16200000-0000-7000-8000-000000000054' ELSE '16200000-0000-7000-8000-000000000055' END)::uuid,le.order_id,'16200000-0000-7000-8000-000000000050',le.endpoint_role,le.location_type,le.order_address_id,le.source_module,'PICKUP-'||le.source_code,le.location_name,le.address_model,le.address_detail,le.full_address,le.province_code,le.district_code,le.commune_code,le.latitude,le.longitude,le.valid_from,1,'2026-09-19 09:23:18+00'
  FROM leg_endpoints le WHERE le.leg_id='16200000-0000-7000-8000-000000000051';

COMMIT;

-- ===== SOURCE: test_data/designer_1/validate_batch_01.sql =====
SET search_path TO order_mgmt, public;

DO $$
DECLARE
    scenario_order_codes constant varchar[] := ARRAY[
        '9100000000001','9100000000002','9100000000003',
        '9100000000004','9100000000005','9100000000006'
    ];
BEGIN
    IF (SELECT count(*) FROM orders WHERE order_code = ANY (scenario_order_codes)) <> 6 THEN
        RAISE EXCEPTION 'Batch 01 phải có đúng 6 Order cho 5 scenario';
    END IF;

    IF EXISTS (
        SELECT 1 FROM orders
         WHERE order_code = ANY (scenario_order_codes)
           AND order_code !~ '^[0-9]{13}$'
    ) THEN
        RAISE EXCEPTION 'Batch 01 có Order Code không đúng 13 chữ số';
    END IF;

    IF EXISTS (
        SELECT order_code FROM orders
         WHERE order_code = ANY (scenario_order_codes)
         GROUP BY order_code HAVING count(*) > 1
    ) THEN
        RAISE EXCEPTION 'Batch 01 có Order Code trùng';
    END IF;

    IF EXISTS (
        SELECT carrier_waybill_code FROM waybills
         WHERE order_id IN (SELECT order_id FROM orders WHERE order_code = ANY (scenario_order_codes))
         GROUP BY carrier_waybill_code HAVING count(*) > 1
    ) THEN
        RAISE EXCEPTION 'Batch 01 có carrier_waybill_code trùng toàn dataset';
    END IF;

    IF EXISTS (
        SELECT 1 FROM waybills
         WHERE order_id IN (SELECT order_id FROM orders WHERE order_code = ANY (scenario_order_codes))
           AND carrier_code <> ALL (ARRAY[1,2,3,4,6,10,13,15,16])
    ) THEN
        RAISE EXCEPTION 'Batch 01 dùng Carrier Code chưa được xác nhận';
    END IF;

    IF EXISTS (
        SELECT 1 FROM order_parties
         WHERE order_id IN (SELECT order_id FROM orders WHERE order_code = ANY (scenario_order_codes))
           AND phone IS NOT NULL AND phone !~ '^0[0-9]{9}$'
    ) OR EXISTS (
        SELECT 1 FROM batch_items bi
        JOIN order_batches b ON b.batch_id = bi.batch_id
         WHERE b.batch_code IN ('BAT-20260915-001205','BAT-20260915-001206')
           AND bi.receiver_phone !~ '^0[0-9]{9}$'
    ) THEN
        RAISE EXCEPTION 'Batch 01 có số điện thoại không đúng 10 chữ số';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM request_steps rs
        JOIN orders o ON o.order_id = rs.order_id
         WHERE o.order_code = '9100000000001'
           AND rs.step_type = 'CREATE_WAYBILL'
           AND rs.step_status = 'PROCESSING'
    ) OR EXISTS (
        SELECT 1 FROM waybills w JOIN orders o ON o.order_id = w.order_id
         WHERE o.order_code = '9100000000001'
    ) THEN
        RAISE EXCEPTION 'D1-01 không đúng trạng thái đang tạo Waybill';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM order_results r JOIN orders o ON o.order_id = r.order_id
         WHERE o.order_code = '9100000000002' AND r.result_type = 1 AND r.result_code = 1
    ) THEN
        RAISE EXCEPTION 'D1-02 thiếu kết quả giao toàn bộ';
    END IF;

    IF (SELECT count(DISTINCT w.carrier_code) FROM waybills w JOIN orders o ON o.order_id=w.order_id
         WHERE o.order_code='9100000000003') <> 2
       OR NOT EXISTS (
          SELECT 1 FROM handover_attempts ha JOIN orders o ON o.order_id=ha.order_id
           WHERE o.order_code='9100000000003' AND ha.status=2
       ) THEN
        RAISE EXCEPTION 'D1-03 thiếu hai NVC hoặc Handover Attempt thành công';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM orders WHERE order_code='9100000000004'
          AND status_code='SPF-0902' AND delivery_result=2
    ) OR (SELECT count(*) FROM result_items ri JOIN orders o ON o.order_id=ri.order_id
           WHERE o.order_code='9100000000004') < 2 THEN
        RAISE EXCEPTION 'D1-04 thiếu kết quả giao một phần theo Item';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM order_batches WHERE batch_code='BAT-20260915-001205' AND status=2)
       OR NOT EXISTS (SELECT 1 FROM order_batches WHERE batch_code='BAT-20260915-001206' AND status=3)
       OR (SELECT count(*) FROM batch_item_attempts bia JOIN batch_items bi ON bi.batch_item_id=bia.batch_item_id
            JOIN order_batches b ON b.batch_id=bi.batch_id
            WHERE b.batch_code IN ('BAT-20260915-001205','BAT-20260915-001206')) <> 3 THEN
        RAISE EXCEPTION 'D1-05 thiếu Batch hoặc Batch Item Attempt';
    END IF;
END
$$;

SELECT o.order_code, o.status_code,
       count(DISTINCT w.waybill_id) AS waybills,
       count(DISTINCT te.event_id) AS tracking_events,
       count(DISTINCT ta.attempt_id) AS transport_attempts,
       count(DISTINCT r.result_id) AS results
  FROM orders o
  LEFT JOIN waybills w ON w.order_id=o.order_id
  LEFT JOIN tracking_events te ON te.order_id=o.order_id
  LEFT JOIN transport_attempts ta ON ta.order_id=o.order_id
  LEFT JOIN order_results r ON r.order_id=o.order_id
 WHERE o.order_code BETWEEN '9100000000001' AND '9100000000006'
 GROUP BY o.order_code,o.status_code
 ORDER BY o.order_code;

-- ===== SOURCE: test_data/designer_2/001_failure_return_coverage.sql =====
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

-- ===== SOURCE: test_data/005_ui_projection_completeness.sql =====

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

-- ===== SOURCE: test_data/005b_instant_driver_allocation_repair.sql =====

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

-- ===== SOURCE: test_data/006_ui_current_status_showcase.sql =====

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
         WHEN substring(s.status_code,5,2)::integer <= 5 THEN 2
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
       CASE
         WHEN status_code='SPF-0302' THEN 4
         WHEN phase_no<=5 THEN 3
         WHEN leg_count>1 THEN 2
         ELSE 3
       END,
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
         WHEN g.leg_no=1 AND s.leg_count>1 AND s.phase_no>5 THEN 1
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

  IF EXISTS (
    SELECT 1
      FROM ui_status_scenarios s
     WHERE NOT EXISTS (
             SELECT 1 FROM order_legs l
              WHERE l.order_id=pg_temp.ui_uuid(s.status_no,1) AND l.leg_type=1
           )
        OR NOT EXISTS (
             SELECT 1 FROM order_legs l
              WHERE l.order_id=pg_temp.ui_uuid(s.status_no,1) AND l.leg_type=2
           )
  ) THEN
    RAISE EXCEPTION 'Mỗi Order showcase phải luôn có đủ chặng PICKUP và DELIVERY';
  END IF;

  IF EXISTS (
    SELECT 1
      FROM ui_status_scenarios s
      JOIN order_legs l ON l.order_id=pg_temp.ui_uuid(s.status_no,1)
     WHERE s.phase_no<10 AND l.leg_type IN (3,4)
  ) THEN
    RAISE EXCEPTION 'Chặng RETURN/FINAL_RETURN chỉ được xuất hiện khi Order vào luồng hoàn';
  END IF;
END
$$;

COMMIT;

-- ===== SOURCE: test_data/004_api_contract_coverage.sql =====

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

-- ===== SOURCE: test_data/003_financial_projection_coverage.sql =====

BEGIN;
SET LOCAL search_path TO order_mgmt, public;

-- Current projection hợp nhất cho toàn bộ Order scenario D1 và D2, nhận từ
-- Carrier/Finance webhook sau khi các lifecycle tương ứng đã được tạo.
-- Không dùng collection_amount trên Waybill thay cho số thực thu: cột đó là số
-- tiền yêu cầu NVC thu khi tạo Waybill, còn collected_amount là kết quả thực tế.
WITH financial_projection (
    order_code,
    collected_amount,
    cod_collection_status,
    settled_amount,
    cod_settlement_status,
    compensation_amount,
    compensation_status
) AS (
    VALUES
        -- Đang tạo/chờ lấy hàng: COD chưa được thu, chưa đến kỳ đối soát.
        ('9100000000001',      0::bigint, 2::smallint,       0::bigint, 2::smallint,      0::bigint, 1::smallint),
        -- Giao thành công, không COD.
        ('9100000000002',      0::bigint, 1::smallint,       0::bigint, 1::smallint,      0::bigint, 1::smallint),
        -- Giao đủ COD; Finance đã chuyển đủ cho Shop.
        ('9100000000003',1290000::bigint, 3::smallint, 1290000::bigint, 5::smallint,      0::bigint, 1::smallint),
        -- Giao một phần: thực thu 280.000, mới đối soát 140.000; phần giao thiếu đang được xem xét.
        ('9100000000004', 280000::bigint, 4::smallint,  140000::bigint, 4::smallint,      0::bigint, 2::smallint),
        ('9100000000005',      0::bigint, 2::smallint,       0::bigint, 2::smallint,      0::bigint, 1::smallint),
        ('9100000000006',      0::bigint, 1::smallint,       0::bigint, 1::smallint,      0::bigint, 1::smallint),
        ('9100000000007',      0::bigint, 2::smallint,       0::bigint, 2::smallint,      0::bigint, 1::smallint),
        ('9100000000008',      0::bigint, 1::smallint,       0::bigint, 1::smallint,      0::bigint, 1::smallint),
        ('9100000000009',      0::bigint, 2::smallint,       0::bigint, 2::smallint,      0::bigint, 1::smallint),
        -- Không COD; booking thất bại nên không phát sinh projection tài chính.
        ('9209190000001',      0::bigint, 1::smallint,       0::bigint, 1::smallint,      0::bigint, 1::smallint),
        -- Shop hủy trước khi NVC nhận hàng; yêu cầu bồi thường bị từ chối vì chưa phát sinh custody.
        ('9209190000002',      0::bigint, 1::smallint,       0::bigint, 1::smallint,      0::bigint, 5::smallint),
        -- Không tìm được tài xế: COD không thu được và không phát sinh đối soát.
        ('9209190000003',      0::bigint, 5::smallint,       0::bigint, 1::smallint,      0::bigint, 1::smallint),
        -- Giao lại thành công: đã thu đủ, Finance đang xử lý kỳ đối soát.
        ('9209190000004',1390000::bigint, 3::smallint,       0::bigint, 3::smallint,      0::bigint, 1::smallint),
        -- Chuyển hoàn thành công, không thu COD; Finance đã chi bồi thường SLA trễ.
        ('9209190000005',      0::bigint, 5::smallint,       0::bigint, 1::smallint,  80000::bigint, 4::smallint),
        -- Từng giao một phần rồi trả một phần: tiền thực thu đang tạm giữ; bồi thường hư hỏng đã duyệt.
        ('9209190000006', 560000::bigint, 4::smallint,       0::bigint, 6::smallint, 280000::bigint, 3::smallint),
        -- Đổi hàng hoàn tất, COD điều chỉnh đã thu và chuyển đủ cho Shop.
        ('9209190000007', 120000::bigint, 3::smallint,  120000::bigint, 5::smallint,      0::bigint, 1::smallint)
)
UPDATE orders AS o
   SET collected_amount = p.collected_amount,
       cod_collection_status = p.cod_collection_status,
       settled_amount = p.settled_amount,
       cod_settlement_status = p.cod_settlement_status,
       compensation_amount = p.compensation_amount,
       compensation_status = p.compensation_status
  FROM financial_projection AS p
 WHERE o.order_code = p.order_code;

DO $$
DECLARE
    expected_order_codes constant varchar[] := ARRAY[
        '9100000000001','9100000000002','9100000000003','9100000000004',
        '9100000000005','9100000000006','9100000000007','9100000000008',
        '9100000000009','9209190000001','9209190000002','9209190000003',
        '9209190000004','9209190000005','9209190000006','9209190000007'
    ];
BEGIN
    IF (
        SELECT array_agg(order_code ORDER BY order_code)
          FROM orders
         WHERE order_code = ANY (expected_order_codes)
    ) IS DISTINCT FROM expected_order_codes THEN
        RAISE EXCEPTION 'Financial projection chưa cập nhật đúng và đủ 16 Order nghiệp vụ nền';
    END IF;

    IF EXISTS (
        SELECT 1 FROM orders
         WHERE (cod_collection_status = 1 AND collected_amount <> 0)
            OR (cod_collection_status = 2 AND (cod_amount <= 0 OR collected_amount <> 0))
            OR (cod_collection_status = 3 AND (cod_amount <= 0 OR collected_amount <> cod_amount))
            OR (cod_collection_status = 4 AND (collected_amount <= 0 OR collected_amount >= cod_amount))
            OR (cod_collection_status = 5 AND (cod_amount <= 0 OR collected_amount <> 0))
    ) THEN
        RAISE EXCEPTION 'Financial projection có số thực thu không khớp trạng thái thu COD';
    END IF;

    IF EXISTS (
        SELECT 1 FROM orders
         WHERE settled_amount < 0
            OR settled_amount > collected_amount
            OR (cod_settlement_status = 1 AND settled_amount <> 0)
            OR (cod_settlement_status = 2 AND settled_amount <> 0)
            OR (cod_settlement_status = 3 AND (collected_amount <= 0 OR settled_amount >= collected_amount))
            OR (cod_settlement_status = 4 AND (settled_amount <= 0 OR settled_amount >= collected_amount))
            OR (cod_settlement_status = 5 AND (settled_amount <= 0 OR settled_amount <> collected_amount))
            OR (cod_settlement_status = 6 AND (collected_amount <= 0 OR settled_amount >= collected_amount))
    ) THEN
        RAISE EXCEPTION 'Financial projection có số đối soát không khớp trạng thái chuyển COD';
    END IF;

    IF EXISTS (
        SELECT 1 FROM orders
         WHERE compensation_amount < 0
            OR (compensation_status IN (1,2,5) AND compensation_amount <> 0)
            OR (compensation_status IN (3,4) AND compensation_amount <= 0)
    ) THEN
        RAISE EXCEPTION 'Financial projection có số bồi thường không khớp trạng thái bồi thường';
    END IF;
END
$$;

COMMIT;

-- ===== SOURCE: test_data/008_instant_delivery_active_completed_coverage.sql =====
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

-- ===== SOURCE: validate_test_data.sql =====

SET search_path TO order_mgmt, public;

DO $$
DECLARE
    actual_carriers integer[];
    missing_statuses text;
    empty_tables text := '';
    inspected_table record;
    table_has_rows boolean;
BEGIN
    IF EXISTS (
        SELECT 1 FROM orders
        WHERE order_code !~ '^(91|92)[0-9]{11}$'
    ) THEN
        RAISE EXCEPTION 'Order Code phải có 13 chữ số và thuộc range 91/92 của test seed';
    END IF;

    IF EXISTS (
        SELECT 1 FROM orders
        WHERE order_id::text !~ '^[12][0-9a-f]{7}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
    ) THEN
        RAISE EXCEPTION 'Order UUID không thuộc range Designer hoặc không có version nibble 7';
    END IF;

    SELECT array_agg(DISTINCT carrier_code ORDER BY carrier_code)
      INTO actual_carriers
      FROM waybills;

    IF actual_carriers IS DISTINCT FROM ARRAY[1,2,3,4,6,10,13,15,16] THEN
        RAISE EXCEPTION 'Bộ Waybill phải dùng đúng 7 NVC mạng lưới và 2 NVC tức thời theo API; thực tế: %', actual_carriers;
    END IF;

    IF EXISTS (
        SELECT 1 FROM waybills
        WHERE carrier_code NOT IN (1,2,3,4,6,10,13,15,16)
    ) OR EXISTS (
        SELECT 1 FROM order_legs
        WHERE carrier_code IS NOT NULL AND carrier_code NOT IN (1,2,3,4,6,10,13,15,16)
    ) OR EXISTS (
        SELECT 1 FROM leg_services
        WHERE carrier_code NOT IN (1,2,3,4,6,10,13,15,16)
    ) OR EXISTS (
        SELECT 1 FROM request_steps
        WHERE carrier_code IS NOT NULL AND carrier_code NOT IN (1,2,3,4,6,10,13,15,16)
    ) OR EXISTS (
        SELECT 1 FROM transport_attempts
        WHERE carrier_code NOT IN (1,2,3,4,6,10,13,15,16)
    ) OR EXISTS (
        SELECT 1 FROM handovers
        WHERE from_carrier_code NOT IN (1,2,3,4,6,10,13,15,16)
           OR to_carrier_code NOT IN (1,2,3,4,6,10,13,15,16)
    ) THEN
        RAISE EXCEPTION 'Phát hiện Carrier Code chưa được xác nhận';
    END IF;

    IF EXISTS (
        SELECT 1 FROM waybills
        WHERE CASE carrier_code
            WHEN 1  THEN carrier_waybill_code !~ '^STGS[0-9]{6}[A-Z]{2}\.[0-9]{9}$'
            WHEN 2  THEN carrier_waybill_code !~ '^[A-Z0-9]{8}$'
            WHEN 3  THEN carrier_waybill_code !~ '^[0-9]{12}$'
            WHEN 4  THEN carrier_waybill_code !~ '^SOO[0-9]{11}$'
            WHEN 6  THEN carrier_waybill_code !~ '^[0-9]{15}$'
            WHEN 10 THEN carrier_waybill_code !~ '^SPXVN[0-9]{12}$'
            WHEN 13 THEN carrier_waybill_code !~ '^[A-Z]{2}[0-9]{10}VN$'
            WHEN 15 THEN carrier_waybill_code !~ '^GSM(-EXP)?-[0-9]{8}-[0-9]{6}(-D)?$'
            WHEN 16 THEN carrier_waybill_code !~ '^DELV-[0-9]{10}-[A-Z0-9]{5}$'
            ELSE true
        END
    ) THEN
        RAISE EXCEPTION 'Carrier Waybill Code không đúng format NVC đã xác nhận';
    END IF;

    IF EXISTS (
        SELECT carrier_waybill_code
          FROM waybills
         GROUP BY carrier_waybill_code
        HAVING count(*) > 1
    ) THEN
        RAISE EXCEPTION 'Carrier Waybill Code bị dùng lại trên toàn dataset';
    END IF;

    IF EXISTS (
        SELECT 1 FROM waybills
        WHERE carrier_sorting_code IS NOT NULL
          AND CASE carrier_code
            WHEN 2 THEN carrier_sorting_code !~ '^[0-9]{3}-[A-Z][0-9]-[0-9]{2}-[0-9]{2}$'
            WHEN 3 THEN carrier_sorting_code !~ '^[0-9]{3}-[0-9]{3}[A-Z][0-9]{2}-$'
            WHEN 6 THEN carrier_sorting_code !~ '^[A-Z]{2}[0-9]{3}-[0-9]{2}-[0-9]{3}-[0-9]{2}$'
            WHEN 10 THEN carrier_sorting_code !~ '^(HCA-[0-9]{2}-[0-9]{3}-[A-Z0-9]+-[A-Z]|Q[0-9]-P[0-9]-[0-9]{2})$'
            WHEN 15 THEN carrier_sorting_code !~ '^GSM-[A-Z]{3}-[0-9]{2}$'
            WHEN 16 THEN carrier_sorting_code !~ '^GRAB-[A-Z]{3}-[0-9]{2}$'
            ELSE true
          END
    ) THEN
        RAISE EXCEPTION 'Carrier Sorting Code không đúng format NVC đã xác nhận';
    END IF;

    IF EXISTS (
        SELECT 1 FROM waybills w
        WHERE (w.waybill_status = 1 AND w.ended_at IS NOT NULL)
           OR (w.waybill_status IN (2,3,4) AND w.ended_at IS NULL)
           OR (
                w.waybill_status = 3
                AND NOT EXISTS (
                    SELECT 1 FROM waybills replacement
                    WHERE replacement.replaces_waybill_id = w.waybill_id
                )
           )
    ) THEN
        RAISE EXCEPTION 'Waybill status/ended_at/replacement không kể đúng lifecycle';
    END IF;

    IF EXISTS (
        SELECT 1
          FROM waybills w
          CROSS JOIN LATERAL jsonb_array_elements(w.carrier_options) option_item
         WHERE jsonb_typeof(option_item) <> 'object'
            OR coalesce(jsonb_typeof(option_item -> 'key'), '') <> 'string'
            OR coalesce(jsonb_typeof(option_item -> 'value'), '') <> 'string'
            OR coalesce(jsonb_typeof(option_item -> 'name'), '') <> 'string'
            OR nullif(btrim(option_item ->> 'key'), '') IS NULL
            OR nullif(btrim(option_item ->> 'value'), '') IS NULL
            OR nullif(btrim(option_item ->> 'name'), '') IS NULL
    ) THEN
        RAISE EXCEPTION 'carrier_options phải gồm object có key/value/name là chuỗi không rỗng';
    END IF;

    IF EXISTS (
        SELECT 1 FROM tracking_events
        WHERE event_source <> 1
          AND (carrier_status_code IS NOT NULL OR carrier_status_name IS NOT NULL)
    ) THEN
        RAISE EXCEPTION 'Chỉ Carrier event_source=1 được mang raw Carrier Status';
    END IF;

    IF EXISTS (
        SELECT 1 FROM orders o
        WHERE o.status_code IS DISTINCT FROM (
            SELECT h.status_code
              FROM order_status_history h
             WHERE h.order_id = o.order_id
             ORDER BY h.version_no DESC
             LIMIT 1
        )
    ) THEN
        RAISE EXCEPTION 'Current Order Status không khớp Status History cuối';
    END IF;

    IF EXISTS (
        SELECT 1
          FROM (
            SELECT order_id, version_no,
                   row_number() OVER (PARTITION BY order_id ORDER BY version_no) AS expected_version,
                   lag(status_code) OVER (PARTITION BY order_id ORDER BY version_no) AS expected_from,
                   from_status_code
              FROM order_status_history
          ) h
         WHERE h.version_no <> h.expected_version
            OR (h.version_no > 1 AND h.from_status_code IS DISTINCT FROM h.expected_from)
    ) THEN
        RAISE EXCEPTION 'Status History bị đứt version hoặc from_status_code';
    END IF;

    IF EXISTS (
        WITH ranked_stages AS (
            SELECT stage_code,
                   leg_type,
                   row_number() OVER (
                       PARTITION BY order_id, leg_type
                       ORDER BY stage_no
                   ) AS type_sequence_no
              FROM order_legs
        )
        SELECT 1
          FROM ranked_stages
         WHERE stage_code <> 'STG-' ||
               CASE leg_type
                   WHEN 1 THEN 'PICKUP'
                   WHEN 2 THEN 'DELIVERY'
                   WHEN 3 THEN 'RETURN'
                   WHEN 4 THEN 'FINAL-RETURN'
               END || '-' || lpad(type_sequence_no::text, 4, '0')
    ) THEN
        RAISE EXCEPTION 'Stage Code không đúng quy luật STG-{LEG_TYPE}-{TYPE_SEQUENCE_4_DIGITS}';
    END IF;

    -- Chính sách carrier cho các chặng hoàn:
    -- * tuyến thường: NVC giao cũng là NVC lấy/trả hoàn;
    -- * tuyến ngoại lệ: chỉ SPS (carrier 1) được lấy hàng và trả cuối,
    --   có thể đi qua một NVC trung gian ở chặng RETURN.
    IF EXISTS (
        WITH topology AS (
            SELECT order_id,
                   max(carrier_code) FILTER (WHERE leg_type = 1) AS pickup_carrier_code,
                   max(carrier_code) FILTER (WHERE leg_type = 2) AS delivery_carrier_code,
                   max(carrier_code) FILTER (WHERE leg_type = 4) AS final_return_carrier_code
              FROM order_legs
             GROUP BY order_id
        )
        SELECT 1
          FROM order_legs l
          JOIN topology t USING (order_id)
         WHERE l.leg_type IN (3,4)
           AND NOT (t.pickup_carrier_code = 1 AND t.final_return_carrier_code = 1)
           AND l.carrier_code IS DISTINCT FROM t.delivery_carrier_code
    ) OR EXISTS (
        SELECT 1
          FROM (
              SELECT order_id,
                     max(carrier_code) FILTER (WHERE leg_type = 1) AS pickup_carrier_code,
                     max(carrier_code) FILTER (WHERE leg_type = 4) AS final_return_carrier_code
                FROM order_legs
               GROUP BY order_id
          ) t
         WHERE t.final_return_carrier_code = 1
           AND t.pickup_carrier_code IS DISTINCT FROM 1
    ) THEN
        RAISE EXCEPTION 'Carrier hoàn không phù hợp: tuyến thường phải dùng NVC giao; ngoại lệ chỉ SPS được lấy hàng và trả cuối';
    END IF;

    IF EXISTS (
        SELECT 1 FROM order_parties
        WHERE phone IS NOT NULL AND phone !~ '^0[0-9]{9}$'
    ) OR EXISTS (
        -- Một Shop/người nhận có thể xuất hiện ở nhiều Order. Chỉ cấm dùng cùng
        -- một số cho nhiều vai trò khác nhau trong chính một Order test.
        SELECT order_id, phone FROM order_parties
        WHERE phone IS NOT NULL
        GROUP BY order_id, phone
        HAVING count(DISTINCT party_type) > 1
    ) THEN
        RAISE EXCEPTION 'Phone không đúng 10 chữ số hoặc bị dùng lại cho nhiều vai trò trong cùng Order';
    END IF;

    IF EXISTS (
        SELECT 1 FROM waybills
        WHERE carrier_accepted_at < request_sent_at
    ) OR EXISTS (
        SELECT 1 FROM tracking_events
        WHERE received_at < occurred_at
    ) OR EXISTS (
        SELECT 1 FROM transport_attempts
        WHERE ended_at IS NOT NULL AND ended_at < started_at
    ) THEN
        RAISE EXCEPTION 'Timeline nghiệp vụ bị đảo thứ tự';
    END IF;

    IF EXISTS (
        SELECT 1 FROM waybills
        WHERE length(snapshot_hash) < 32
           OR snapshot_hash = repeat(left(snapshot_hash, 1), length(snapshot_hash))
    ) OR EXISTS (
        SELECT 1 FROM request_steps
        WHERE request_hash IS NOT NULL
          AND request_hash = repeat(left(request_hash, 1), length(request_hash))
    ) OR EXISTS (
        SELECT 1 FROM tracking_events
        WHERE (event_fingerprint IS NOT NULL AND event_fingerprint = repeat(left(event_fingerprint, 1), length(event_fingerprint)))
           OR (payload_hash IS NOT NULL AND payload_hash = repeat(left(payload_hash, 1), length(payload_hash)))
    ) OR EXISTS (
        SELECT 1 FROM batch_items
        WHERE input_hash = repeat(left(input_hash, 1), length(input_hash))
    ) OR EXISTS (
        SELECT 1 FROM idempotency_records
        WHERE request_hash = repeat(left(request_hash, 1), length(request_hash))
    ) THEN
        RAISE EXCEPTION 'Hash giả dạng lặp ký tự được phát hiện';
    END IF;

    SELECT string_agg(s.status_code, ', ' ORDER BY s.sort_no)
      INTO missing_statuses
      FROM order_statuses s
     WHERE NOT EXISTS (
        SELECT 1 FROM order_status_history h WHERE h.status_code = s.status_code
     );

    IF missing_statuses IS NOT NULL THEN
        RAISE EXCEPTION 'Coverage trạng thái chưa hoàn tất. Còn thiếu: %', missing_statuses;
    END IF;

    FOR inspected_table IN
        SELECT table_name
          FROM information_schema.tables
         WHERE table_schema = 'order_mgmt'
           AND table_type = 'BASE TABLE'
         ORDER BY table_name
    LOOP
        EXECUTE format('SELECT EXISTS (SELECT 1 FROM order_mgmt.%I)', inspected_table.table_name)
           INTO table_has_rows;
        IF NOT table_has_rows THEN
            empty_tables := empty_tables || CASE WHEN empty_tables = '' THEN '' ELSE ', ' END || inspected_table.table_name;
        END IF;
    END LOOP;

    IF empty_tables <> '' THEN
        RAISE EXCEPTION 'Các bảng chưa có DataSeed: %', empty_tables;
    END IF;

    IF EXISTS (
        SELECT required_status
          FROM unnest(ARRAY['PENDING','PROCESSING','SUCCESS','FAILED','UNKNOWN','CANCELLED']) required_status
        EXCEPT
        SELECT step_status::text FROM request_steps
    ) THEN
        RAISE EXCEPTION 'Chưa bao phủ đủ sáu trạng thái Request Step';
    END IF;

    IF EXISTS (
        SELECT required_target
          FROM unnest(ARRAY['PARTY','ADDRESS','GOODS','LEG','WAYBILL','ATTEMPT','HANDOVER','EXTERNAL_REF']) required_target
        EXCEPT
        SELECT target_type::text FROM request_targets
    ) THEN
        RAISE EXCEPTION 'Chưa bao phủ đủ tám loại Request Target';
    END IF;

    IF EXISTS (
        SELECT required_role FROM generate_series(1,5) required_role
        EXCEPT
        SELECT role_type::integer FROM operational_assignments
    ) THEN
        RAISE EXCEPTION 'Chưa bao phủ đủ năm role_type của Operational Assignment';
    END IF;

    IF EXISTS (
        SELECT required_result
          FROM unnest(ARRAY['WITHIN_DUE','OVERDUE','COMPLETED_ON_TIME','COMPLETED_LATE','REFERENCE_ONLY','NOT_APPLICABLE']) required_result
        EXCEPT
        SELECT result::text FROM waybill_slas
    ) THEN
        RAISE EXCEPTION 'Chưa bao phủ đủ sáu kết quả Waybill SLA';
    END IF;

    IF EXISTS (
        SELECT required_channel
          FROM unnest(ARRAY['WEB','MOBILE','PARTNER_API','INTERNAL','BATCH','SYSTEM']) required_channel
        EXCEPT
        SELECT created_channel::text FROM orders
    ) THEN
        RAISE EXCEPTION 'Chưa bao phủ đủ sáu created_channel của API tạo Order';
    END IF;

    IF EXISTS (
        SELECT required_group FROM generate_series(1,12) required_group
        EXCEPT
        SELECT activity_group::integer FROM activity_logs
    ) THEN
        RAISE EXCEPTION 'Chưa bao phủ đủ 12 activity_group của API Activity';
    END IF;

    IF EXISTS (
        SELECT required_result FROM generate_series(1,3) required_result
        EXCEPT
        SELECT apply_result::integer FROM tracking_events
    ) OR NOT EXISTS (
        SELECT 1 FROM tracking_events WHERE corrects_event_id IS NOT NULL
    ) THEN
        RAISE EXCEPTION 'Chưa bao phủ đủ applied/history-only/correction Tracking Event';
    END IF;

    IF EXISTS (
        SELECT required_status FROM unnest(ARRAY[1,2,3]) required_status
        EXCEPT
        SELECT status FROM idempotency_records
    ) THEN
        RAISE EXCEPTION 'Chưa bao phủ đủ trạng thái Idempotency';
    END IF;

    IF EXISTS (
        SELECT required_status FROM generate_series(1,5) required_status
        EXCEPT
        SELECT status FROM outbox_events
    ) THEN
        RAISE EXCEPTION 'Chưa bao phủ đủ trạng thái Outbox';
    END IF;

    IF EXISTS (
        SELECT required_status FROM unnest(ARRAY[2,3,4]) required_status
        EXCEPT
        SELECT status FROM order_batches
    ) THEN
        RAISE EXCEPTION 'Chưa bao phủ đủ Batch success/partial/failed-all';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM order_requests
         WHERE request_type = 'CANCEL_ORDER' AND request_status IN (2,4,5)
    ) OR NOT EXISTS (
        SELECT 1 FROM order_requests
         WHERE request_type = 'RETRY_OPERATION' AND request_status = 3
    ) OR NOT EXISTS (
        SELECT 1 FROM request_steps
         WHERE step_type IN ('RETRY_DELIVERY','RETRY_HANDOVER','RETRY_RETURN')
           AND step_status = 'SUCCESS'
    ) THEN
        RAISE EXCEPTION 'Chưa bao phủ Cancel processing/failed/unknown và Retry Delivery/Handover/Return';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM order_requests
         WHERE request_type = 'UPDATE_ORDER' AND request_status = 3
           AND request_code = 'REQ-D106-DIRECT-PATCH'
    ) OR NOT EXISTS (
        SELECT 1 FROM order_requests
         WHERE request_type = 'UPDATE_ORDER' AND request_status = 4
           AND result_reason_code = 'CARRIER_REJECTED'
    ) THEN
        RAISE EXCEPTION 'Chưa bao phủ PATCH trực tiếp và PATCH bị Carrier từ chối';
    END IF;

    IF EXISTS (
        SELECT required_type
          FROM unnest(ARRAY['CHANGE_CHECK','PARTIAL_DELIVERY','EXCHANGE_ORDER','RETURN_ORDER','RETURN_CONFIRM','CHANGE_CARRIER']) required_type
        EXCEPT
        SELECT request_type FROM order_requests
    ) THEN
        RAISE EXCEPTION 'Chưa bao phủ đủ Request cho changes/check, changes, partial, exchange, return, return/confirm và carrier';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM external_refs
         WHERE module_code = 'PRT' AND ref_type = 'PRINT_JOB'
    ) OR NOT EXISTS (
        SELECT 1 FROM activity_logs WHERE activity_group = 7 AND activity_key = 'LABEL_PRINTED'
    ) THEN
        RAISE EXCEPTION 'Chưa có boundary fixture cho Print Module';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM order_addresses
         WHERE order_id = (SELECT order_id FROM orders WHERE order_code = '9100000000001')
           AND version_no = 2 AND valid_to IS NULL
    ) OR NOT EXISTS (
        SELECT 1 FROM order_parties
         WHERE order_id = (SELECT order_id FROM orders WHERE order_code = '9100000000001')
           AND version_no = 2 AND valid_to IS NULL
    ) OR NOT EXISTS (
        SELECT 1 FROM order_goods
         WHERE order_id = (SELECT order_id FROM orders WHERE order_code = '9100000000001')
           AND version_no = 2 AND valid_to IS NULL
    ) THEN
        RAISE EXCEPTION 'Chưa có snapshot version 2 cho PATCH Order';
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM order_images
         WHERE order_id = (SELECT order_id FROM orders WHERE order_code = '9100000000001')
           AND status = 2
         GROUP BY order_id HAVING count(*) >= 2
    ) OR NOT EXISTS (
        SELECT 1 FROM order_requests
         WHERE request_type = 'REMOVE_IMAGE' AND request_status = 3
    ) THEN
        RAISE EXCEPTION 'Chưa bao phủ multi-image remove';
    END IF;

    IF EXISTS (
        SELECT required_result_type FROM unnest(ARRAY[1,2]) required_result_type
        EXCEPT
        SELECT result_type FROM order_results WHERE result_code = 3
    ) THEN
        RAISE EXCEPTION 'Chưa bao phủ terminal failure Result cho Delivery và Return';
    END IF;

    IF EXISTS (
        SELECT required_status FROM generate_series(1,5) required_status
        EXCEPT
        SELECT cod_collection_status::integer FROM orders
    ) THEN
        RAISE EXCEPTION 'Chưa bao phủ đủ năm trạng thái thu COD';
    END IF;

    IF EXISTS (
        SELECT required_status FROM generate_series(1,6) required_status
        EXCEPT
        SELECT cod_settlement_status::integer FROM orders
    ) THEN
        RAISE EXCEPTION 'Chưa bao phủ đủ sáu trạng thái đối soát COD';
    END IF;

    IF EXISTS (
        SELECT required_status FROM generate_series(1,5) required_status
        EXCEPT
        SELECT compensation_status::integer FROM orders
    ) THEN
        RAISE EXCEPTION 'Chưa bao phủ đủ năm trạng thái bồi thường';
    END IF;

    IF EXISTS (
        SELECT cod_collection_status::integer FROM orders
        EXCEPT
        SELECT allowed_status FROM generate_series(1,5) allowed_status
    ) OR EXISTS (
        SELECT cod_settlement_status::integer FROM orders
        EXCEPT
        SELECT allowed_status FROM generate_series(1,6) allowed_status
    ) OR EXISTS (
        SELECT compensation_status::integer FROM orders
        EXCEPT
        SELECT allowed_status FROM generate_series(1,5) allowed_status
    ) THEN
        RAISE EXCEPTION 'Projection tài chính chứa status ngoài domain cho phép';
    END IF;

    IF EXISTS (
        SELECT 1 FROM orders
         WHERE collected_amount < 0
            OR collected_amount > cod_amount
            OR settled_amount < 0
            OR settled_amount > collected_amount
            OR compensation_amount < 0
            OR (cod_collection_status = 1 AND collected_amount <> 0)
            OR (cod_collection_status = 2 AND (cod_amount <= 0 OR collected_amount <> 0))
            OR (cod_collection_status = 3 AND (cod_amount <= 0 OR collected_amount <> cod_amount))
            OR (cod_collection_status = 4 AND (collected_amount <= 0 OR collected_amount >= cod_amount))
            OR (cod_collection_status = 5 AND (cod_amount <= 0 OR collected_amount <> 0))
            OR (cod_settlement_status = 1 AND settled_amount <> 0)
            OR (cod_settlement_status = 2 AND settled_amount <> 0)
            OR (cod_settlement_status = 3 AND (collected_amount <= 0 OR settled_amount >= collected_amount))
            OR (cod_settlement_status = 4 AND (settled_amount <= 0 OR settled_amount >= collected_amount))
            OR (cod_settlement_status = 5 AND (settled_amount <= 0 OR settled_amount <> collected_amount))
            OR (cod_settlement_status = 6 AND (collected_amount <= 0 OR settled_amount >= collected_amount))
            OR (compensation_status IN (1,2,5) AND compensation_amount <> 0)
            OR (compensation_status IN (3,4) AND compensation_amount <= 0)
    ) THEN
        RAISE EXCEPTION 'Projection COD/đối soát/bồi thường không nhất quán';
    END IF;
END
$$;

SELECT o.order_code,
       o.status_code,
       o.cod_amount,
       o.collected_amount,
       o.cod_collection_status,
       o.settled_amount,
       o.cod_settlement_status,
       o.compensation_amount,
       o.compensation_status,
       w.carrier_code,
       w.carrier_waybill_code,
       w.carrier_sorting_code,
       w.waybill_status
  FROM orders o
  LEFT JOIN waybills w ON w.order_id = o.order_id
 ORDER BY o.order_code, w.created_at;

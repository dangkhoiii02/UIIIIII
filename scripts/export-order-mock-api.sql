\set QUIET 1
\pset tuples_only on
\pset format unaligned
SET search_path TO order_mgmt;
\set QUIET 0

WITH carrier_catalog(carrier_code, carrier_name) AS (
  VALUES
    (1::smallint, 'SuperShip'::text),
    (2::smallint, 'GHN'::text),
    (3::smallint, 'J&T Express'::text),
    (4::smallint, 'Viettel Post'::text),
    (6::smallint, 'BEST Express'::text),
    (10::smallint, 'SPX Express'::text),
    (13::smallint, 'Vietnam Post'::text),
    (15::smallint, 'Green SM Express'::text),
    (16::smallint, 'GrabExpress'::text)
), api_orders AS (
  SELECT jsonb_build_object(
    'order_code', o.order_code,
    'shop_id', o.shop_id,
    'soc', o.soc,
    'status_code', o.status_code,
    'status_name', os.status_name,
    'customer_model', o.customer_model,
    'transport_model', o.transport_model,
    'selection_mode', o.selection_mode,
    'pricing_code', o.pricing_code,
    'planned_carrier_code', CASE
      WHEN o.transport_model = 1 THEN 1
      WHEN o.pricing_code ILIKE '%GHN%' THEN 2
      WHEN o.pricing_code ILIKE '%JNT%' OR o.pricing_code ILIKE '%J&T%' THEN 3
      WHEN o.pricing_code ILIKE '%VTP%' THEN 4
      WHEN o.pricing_code ILIKE '%BEST%' THEN 6
      WHEN o.pricing_code ILIKE '%SPX%' THEN 10
      WHEN o.pricing_code ILIKE '%VNP%' THEN 13
      WHEN o.pricing_code ILIKE '%GREEN-SM%' OR o.pricing_code ILIKE '%GSM%' THEN 15
      WHEN o.pricing_code ILIKE '%GRAB%' THEN 16
      ELSE NULL
    END,
    'planned_carrier_name', CASE
      WHEN o.transport_model = 1 THEN 'SuperShip'
      WHEN o.pricing_code ILIKE '%GHN%' THEN 'GHN'
      WHEN o.pricing_code ILIKE '%JNT%' OR o.pricing_code ILIKE '%J&T%' THEN 'J&T Express'
      WHEN o.pricing_code ILIKE '%VTP%' THEN 'Viettel Post'
      WHEN o.pricing_code ILIKE '%BEST%' THEN 'BEST Express'
      WHEN o.pricing_code ILIKE '%SPX%' THEN 'SPX Express'
      WHEN o.pricing_code ILIKE '%VNP%' THEN 'Vietnam Post'
      WHEN o.pricing_code ILIKE '%GREEN-SM%' OR o.pricing_code ILIKE '%GSM%' THEN 'Green SM Express'
      WHEN o.pricing_code ILIKE '%GRAB%' THEN 'GrabExpress'
      ELSE NULL
    END,
    'cod_amount', o.cod_amount,
    'collected_amount', o.collected_amount,
    'cod_collection_status', o.cod_collection_status,
    'settled_amount', o.settled_amount,
    'cod_settlement_status', o.cod_settlement_status,
    'compensation_amount', o.compensation_amount,
    'compensation_status', o.compensation_status,
    'inspection_type', o.inspection_type,
    'fee_payer', o.fee_payer,
    'pickup_method', o.pickup_method,
    'service_codes', o.service_codes,
    'delivery_note', o.delivery_note,
    'delivery_result', o.delivery_result,
    'created_channel', o.created_channel,
    'created_at', o.created_at,
    'updated_at', o.updated_at,
    'sender', (
      SELECT jsonb_build_object('name', p.name, 'contact_name', p.contact_name, 'phone', p.phone, 'email', p.email)
      FROM order_parties p
      WHERE p.order_id = o.order_id AND p.party_type = 1 AND p.valid_to IS NULL
      ORDER BY p.version_no DESC LIMIT 1
    ),
    'receiver', COALESCE(
      (
        SELECT jsonb_build_object('name', p.name, 'contact_name', p.contact_name, 'phone', p.phone, 'email', p.email)
        FROM order_parties p
        WHERE p.order_id = o.order_id AND p.party_type = 2 AND p.valid_to IS NULL
        ORDER BY p.version_no DESC LIMIT 1
      ),
      (
        SELECT jsonb_build_object(
          'name', COALESCE(bi.input_data->>'receiver_name', bi.receiver_name),
          'contact_name', COALESCE(bi.input_data->>'receiver_name', bi.receiver_name),
          'phone', COALESCE(bi.input_data->>'receiver_phone', bi.receiver_phone),
          'email', NULL
        )
        FROM batch_items bi
        WHERE bi.order_id = o.order_id
        ORDER BY bi.row_number LIMIT 1
      )
    ),
    'pickup_address', (
      SELECT jsonb_build_object(
        'address_detail', a.address_detail, 'full_address', a.full_address,
        'province_code', a.province_code, 'district_code', a.district_code,
        'commune_code', a.commune_code, 'latitude', a.latitude, 'longitude', a.longitude
      )
      FROM order_addresses a
      WHERE a.order_id = o.order_id AND a.address_type = 1 AND a.valid_to IS NULL
      ORDER BY a.version_no DESC LIMIT 1
    ),
    'delivery_address', COALESCE(
      (
        SELECT jsonb_build_object(
          'address_detail', a.address_detail, 'full_address', a.full_address,
          'province_code', a.province_code, 'district_code', a.district_code,
          'commune_code', a.commune_code, 'latitude', a.latitude, 'longitude', a.longitude
        )
        FROM order_addresses a
        WHERE a.order_id = o.order_id AND a.address_type = 2 AND a.valid_to IS NULL
        ORDER BY a.version_no DESC LIMIT 1
      ),
      (
        SELECT jsonb_build_object(
          'address_detail', bi.input_data->>'address',
          'full_address', bi.input_data->>'address',
          'province_code', bi.input_data->>'province_code',
          'district_code', bi.input_data->>'district_code',
          'commune_code', bi.input_data->>'commune_code',
          'latitude', NULL,
          'longitude', NULL
        )
        FROM batch_items bi
        WHERE bi.order_id = o.order_id
        ORDER BY bi.row_number LIMIT 1
      )
    ),
    'goods', COALESCE(
      (
        SELECT jsonb_build_object(
          'content_type', g.content_type, 'product_name', g.product_name,
          'declared_value', g.declared_value, 'currency_code', g.currency_code,
          'tag_codes', g.tag_codes
        )
        FROM order_goods g
        WHERE g.order_id = o.order_id AND g.valid_to IS NULL
        ORDER BY g.version_no DESC LIMIT 1
      ),
      (
        SELECT jsonb_build_object(
          'content_type', 2,
          'product_name', bi.input_data->>'product_name',
          'declared_value', COALESCE((bi.input_data->>'declared_value')::bigint, o.cod_amount),
          'currency_code', 'VND',
          'tag_codes', '[]'::jsonb
        )
        FROM batch_items bi
        WHERE bi.order_id = o.order_id
        ORDER BY bi.row_number LIMIT 1
      )
    ),
    'measure', (
      SELECT jsonb_build_object(
        'weight_g', m.weight_g, 'length_cm', m.length_cm,
        'width_cm', m.width_cm, 'height_cm', m.height_cm
      )
      FROM parcel_measures m
      WHERE m.order_id = o.order_id
      ORDER BY (m.leg_id IS NULL) DESC, m.created_at LIMIT 1
    ),
    'notes', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'note_code', n.note_code, 'note_type', n.note_type,
        'visibility_scope', n.visibility_scope, 'content', n.content,
        'created_display_name', n.created_display_name, 'created_at', n.created_at
      ) ORDER BY n.created_at)
      FROM order_notes n WHERE n.order_id = o.order_id
    ), '[]'::jsonb),
    'requests', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'request_code', r.request_code, 'request_type', r.request_type,
        'request_status', r.request_status, 'reason_code', r.reason_code,
        'reason', r.reason, 'requested_by_display_name', r.requested_by_display_name,
        'requested_at', r.requested_at, 'completed_at', r.completed_at,
        'result_code', r.result_code, 'result_reason', r.result_reason
      ) ORDER BY r.requested_at)
      FROM order_requests r WHERE r.order_id = o.order_id
    ), '[]'::jsonb),
    'status_history', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'from_status_code', h.from_status_code, 'status_code', h.status_code,
        'status_name', hs.status_name, 'reason_code', h.reason_code,
        'reason', h.reason, 'changed_at', h.changed_at
      ) ORDER BY h.changed_at)
      FROM order_status_history h
      LEFT JOIN order_statuses hs ON hs.status_code = h.status_code
      WHERE h.order_id = o.order_id
    ), '[]'::jsonb),
    'images', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'image_code', img.image_code,
        'image_type', CASE img.image_type
          WHEN 'GOODS' THEN 1
          WHEN 'PICKUP' THEN 2
          WHEN 'DELIVERY' THEN 2
          WHEN 'RETURN' THEN 3
          WHEN 'DAMAGE_INCIDENT' THEN 4
          ELSE 5
        END,
        'url', img.file_ref,
        'description', img.description
      ) ORDER BY img.created_at)
      FROM order_images img WHERE img.order_id = o.order_id
    ), '[]'::jsonb),
    'stages', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'stage_code', l.stage_code,
        'stage_no', l.stage_no,
        'leg_type', l.leg_type,
        'stage_status_code', l.stage_status_code,
        'stage_status_name', ls.status_name,
        'carrier_code', l.carrier_code,
        'carrier_name', cc.carrier_name,
        'started_at', l.started_at,
        'completed_at', l.completed_at,
        'driver', (
          SELECT jsonb_build_object(
            'name', a.assignee_name,
            'phone', a.assignee_phone,
            'carrier_shipper_code', a.carrier_shipper_code,
            'vehicle_type', CASE WHEN a.vehicle_type_code = 2 THEN 'Xe máy điện' ELSE 'Xe máy' END,
            'license_plate', COALESCE(a.vehicle_ref, a.vehicle_plate_encrypted)
          )
          FROM operational_assignments a
          WHERE a.leg_id = l.leg_id
          ORDER BY a.valid_from DESC
          LIMIT 1
        ),
        'waybill', (
          SELECT jsonb_build_object(
            'carrier_waybill_code', w.carrier_waybill_code,
            'carrier_sorting_code', w.carrier_sorting_code,
            'waybill_status', w.waybill_status,
            'carrier_status_code', w.carrier_status_code,
            'carrier_status_name', w.carrier_status_name,
            'carrier_status_at', w.carrier_status_at,
            'request_sent_at', w.request_sent_at,
            'carrier_accepted_at', w.carrier_accepted_at
          )
          FROM leg_waybills lw
          JOIN waybills w ON w.waybill_id = lw.waybill_id
          -- Chặng đã hoàn tất có active_to; API detail vẫn phải trả Waybill cuối cùng
          -- để UI hiển thị đúng NVC/mã vận đơn của lịch sử lấy-giao-hoàn.
          WHERE lw.leg_id = l.leg_id
          ORDER BY (lw.active_to IS NULL) DESC, lw.sequence_no DESC, lw.active_from DESC
          LIMIT 1
        ),
        'tracking_events', COALESCE((
          SELECT jsonb_agg(jsonb_build_object(
            'event_id', e.event_id,
            'event_code', e.event_code,
            'event_name', e.event_name,
            'carrier_status_code', e.carrier_status_code,
            'carrier_status_name', e.carrier_status_name,
            'stage_status_code', e.stage_status_code,
            'location', concat_ws(', ', e.facility_name, e.commune_name, e.district_name, e.province_name),
            'reason_code', e.reason_code,
            'reason', e.reason,
            'occurred_at', e.occurred_at,
            'received_at', e.received_at,
            'order_sequence_no', e.order_sequence_no,
            'apply_result', e.apply_result,
            'dedupe_key', e.dedupe_key
          ) ORDER BY e.order_sequence_no, e.occurred_at)
          FROM tracking_events e WHERE e.leg_id = l.leg_id
        ), '[]'::jsonb)
      ) ORDER BY l.stage_no)
      FROM order_legs l
      LEFT JOIN order_statuses ls ON ls.status_code = l.stage_status_code
      LEFT JOIN carrier_catalog cc ON cc.carrier_code = l.carrier_code
      WHERE l.order_id = o.order_id
    ), '[]'::jsonb)
  ) AS payload,
  o.order_code
  FROM orders o
  JOIN order_statuses os ON os.status_code = o.status_code
)
SELECT jsonb_pretty(jsonb_build_object(
  'meta', jsonb_build_object(
    'mock_api', '/mock-api/v1',
    'database', 'supership-superplatform-order-db',
    'schema', 'order_mgmt',
    'generated_from', 'database_seed/SuperShip - DATASEED MODULE ORDER.sql',
    'total', count(*)
  ),
  'data', jsonb_agg(payload ORDER BY order_code)
))
FROM api_orders;

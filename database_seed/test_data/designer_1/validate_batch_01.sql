\set ON_ERROR_STOP on
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

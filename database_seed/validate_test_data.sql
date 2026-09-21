\set ON_ERROR_STOP on

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

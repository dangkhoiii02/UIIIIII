\set ON_ERROR_STOP on

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


\set ON_ERROR_STOP on

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

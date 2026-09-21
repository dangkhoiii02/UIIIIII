\set ON_ERROR_STOP on
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

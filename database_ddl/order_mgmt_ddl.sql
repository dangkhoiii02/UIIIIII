-- Generated from Database Dictionary baseline v0.25.0.
-- PostgreSQL 16+. Execute as a role allowed to create schemas and types.
BEGIN;

CREATE SCHEMA IF NOT EXISTS order_mgmt;
SET search_path TO order_mgmt, public;

CREATE TYPE order_created_channel AS ENUM ('WEB', 'MOBILE', 'PARTNER_API', 'INTERNAL', 'BATCH', 'SYSTEM');
CREATE TYPE request_target_type AS ENUM ('PARTY', 'ADDRESS', 'GOODS', 'LEG', 'WAYBILL', 'ATTEMPT', 'HANDOVER', 'EXTERNAL_REF');
CREATE TYPE request_step_status AS ENUM ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED', 'UNKNOWN', 'CANCELLED');
CREATE TYPE activity_actor_type AS ENUM ('SHOP', 'INTERNAL', 'SYSTEM', 'CARRIER', 'SHIPPER', 'INTEGRATION_APP');
CREATE TYPE activity_source_type AS ENUM ('WEB', 'APP', 'INTEGRATION_API', 'CARRIER_WEBHOOK', 'SYSTEM_PROCESS', 'INTERNAL_TOOL');
CREATE TYPE order_image_type AS ENUM ('GOODS', 'PICKUP', 'DELIVERY', 'RETURN', 'DAMAGE_INCIDENT', 'OTHER');
CREATE TYPE waybill_sla_result AS ENUM ('WITHIN_DUE', 'OVERDUE', 'COMPLETED_ON_TIME', 'COMPLETED_LATE', 'REFERENCE_ONLY', 'NOT_APPLICABLE');

CREATE TABLE order_statuses (
    "status_code" varchar(20) NOT NULL PRIMARY KEY,
    "status_name" varchar(120) NOT NULL,
    "status_group" varchar(40) NOT NULL,
    "sort_no" integer NOT NULL,
    "is_terminal" boolean DEFAULT false NOT NULL,
    "is_active" boolean DEFAULT true NOT NULL,
    "description" text,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE orders (
    "order_id" uuid NOT NULL PRIMARY KEY,
    "order_code" varchar(13) NOT NULL UNIQUE,
    "shop_id" uuid NOT NULL,
    "soc" varchar(100),
    "status_code" varchar(20) NOT NULL,
    "current_leg_id" uuid,
    "custodian_carrier_code" integer,
    "customer_model" smallint NOT NULL,
    "transport_model" smallint NOT NULL,
    "selection_mode" smallint NOT NULL,
    "shipping_config_ref" varchar(150),
    "shipping_config_version" varchar(50),
    "configuration_decision_ref" varchar(150) NOT NULL,
    "pricing_code" varchar(64) NOT NULL,
    "cod_amount" bigint DEFAULT 0 NOT NULL,
    "inspection_type" smallint NOT NULL,
    "fee_payer" smallint NOT NULL,
    "pickup_method" smallint NOT NULL,
    "service_codes" smallint[] DEFAULT '{}' NOT NULL,
    "pickup_scheduled_from" timestamptz,
    "pickup_scheduled_to" timestamptz,
    "delivery_note" varchar(120),
    "delivery_result" smallint DEFAULT 0 NOT NULL,
    "exchange_result" smallint DEFAULT 0 NOT NULL,
    "created_by_identity_id" varchar(100),
    "created_by_membership_id" varchar(100),
    "created_actor_type" smallint NOT NULL,
    "created_actor_ref" varchar(100) NOT NULL,
    "created_actor_name" varchar(200) NOT NULL,
    "created_application_id" varchar(100) NOT NULL,
    "created_client_id" varchar(100) NOT NULL,
    "created_channel" order_created_channel NOT NULL,
    "correlation_id" varchar(100) NOT NULL,
    "version_no" integer DEFAULT 1 NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL,
    "updated_by" varchar(100)
);

CREATE TABLE order_addresses (
    "address_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "address_type" smallint NOT NULL,
    "address_model" smallint NOT NULL,
    "source_type" smallint NOT NULL,
    "source_code" varchar(100),
    "source_name" varchar(200),
    "address_detail" varchar(500) NOT NULL,
    "full_address" varchar(1000) NOT NULL,
    "province_code" varchar(20) NOT NULL,
    "district_code" varchar(20),
    "commune_code" varchar(20) NOT NULL,
    "latitude" numeric(10,7),
    "longitude" numeric(10,7),
    "valid_from" timestamptz NOT NULL,
    "valid_to" timestamptz,
    "version_no" integer NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "created_by" varchar(100)
);

CREATE TABLE order_parties (
    "party_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "party_type" smallint NOT NULL,
    "name" varchar(200) NOT NULL,
    "contact_name" varchar(200),
    "phone" varchar(32),
    "email" varchar(254),
    "valid_from" timestamptz NOT NULL,
    "valid_to" timestamptz,
    "version_no" integer NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "created_by" varchar(100)
);

CREATE TABLE order_goods (
    "goods_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "content_type" smallint NOT NULL,
    "product_name" varchar(255),
    "declared_value" bigint DEFAULT 0 NOT NULL,
    "currency_code" char(3) DEFAULT 'VND' NOT NULL,
    "tag_codes" smallint[] DEFAULT '{}' NOT NULL,
    "valid_from" timestamptz NOT NULL,
    "valid_to" timestamptz,
    "version_no" integer NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "created_by" varchar(100)
);

CREATE TABLE order_items (
    "item_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "goods_id" uuid NOT NULL,
    "item_code" varchar(40) NOT NULL,
    "product_ref" varchar(100),
    "sku" varchar(100),
    "item_name" varchar(255) NOT NULL,
    "unit_price" bigint,
    "unit_weight_g" integer,
    "quantity" integer NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE parcel_measures (
    "measure_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "leg_id" uuid,
    "waybill_id" uuid,
    "carrier_code" integer,
    "measure_kind" smallint NOT NULL,
    "source_type" smallint NOT NULL,
    "weight_g" integer,
    "length_cm" integer,
    "width_cm" integer,
    "height_cm" integer,
    "measured_at" timestamptz NOT NULL,
    "source_ref" varchar(150),
    "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE order_legs (
    "leg_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "stage_code" varchar(40) NOT NULL,
    "stage_no" smallint NOT NULL,
    "leg_type" smallint NOT NULL,
    "stage_status_code" varchar(50) NOT NULL,
    "carrier_code" integer,
    "carrier_client_code" varchar(100),
    "started_at" timestamptz,
    "completed_at" timestamptz,
    "version_no" integer DEFAULT 1 NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE leg_endpoints (
    "leg_endpoint_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "leg_id" uuid NOT NULL,
    "endpoint_role" smallint NOT NULL,
    "location_type" smallint NOT NULL,
    "order_address_id" uuid,
    "source_module" varchar(40),
    "source_code" varchar(150),
    "location_name" varchar(200),
    "address_model" smallint,
    "address_detail" varchar(500),
    "full_address" varchar(1000),
    "province_code" varchar(20),
    "district_code" varchar(20),
    "commune_code" varchar(20),
    "latitude" numeric(10,7),
    "longitude" numeric(10,7),
    "valid_from" timestamptz NOT NULL,
    "valid_to" timestamptz,
    "version_no" integer NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE leg_items (
    "order_id" uuid NOT NULL,
    "leg_id" uuid NOT NULL,
    "item_id" uuid NOT NULL,
    "quantity" integer NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT pk_leg_items PRIMARY KEY (leg_id, item_id)
);

CREATE TABLE leg_services (
    "leg_service_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "leg_id" uuid NOT NULL,
    "carrier_code" integer NOT NULL,
    "service_code" varchar(50) NOT NULL,
    "service_name" varchar(150) NOT NULL,
    "fulfillment_mode" smallint NOT NULL,
    "carrier_client_code" varchar(100),
    "vehicle_type_code" varchar(50),
    "policy_ref" varchar(100),
    "policy_version" varchar(50),
    "pricing_result_ref" varchar(150),
    "carrier_fee_amount" bigint,
    "shop_shipping_fee_amount" bigint,
    "priced_at" timestamptz,
    "valid_from" timestamptz NOT NULL,
    "valid_to" timestamptz,
    "version_no" integer NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE waybills (
    "waybill_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "carrier_code" integer NOT NULL,
    "carrier_waybill_code" varchar(150) NOT NULL,
    "carrier_client_code" varchar(100),
    "origin_request_id" uuid,
    "sender_party_id" uuid NOT NULL,
    "receiver_party_id" uuid NOT NULL,
    "pickup_address_id" uuid NOT NULL,
    "delivery_address_id" uuid NOT NULL,
    "goods_id" uuid NOT NULL,
    "measure_id" uuid NOT NULL,
    "leg_service_id" uuid NOT NULL,
    "pickup_method" smallint NOT NULL,
    "fee_payer" smallint NOT NULL,
    "inspection_type" smallint NOT NULL,
    "cod_amount" bigint DEFAULT 0 NOT NULL,
    "collection_amount" bigint DEFAULT 0 NOT NULL,
    "declared_value" bigint DEFAULT 0 NOT NULL,
    "delivery_note" varchar(120),
    "carrier_options" jsonb DEFAULT '[]' NOT NULL,
    "snapshot_schema_version" integer DEFAULT 1 NOT NULL,
    "snapshot_hash" varchar(128) NOT NULL,
    "carrier_sorting_code" varchar(100),
    "waybill_status" smallint NOT NULL,
    "carrier_status_code" varchar(100),
    "carrier_status_name" varchar(200),
    "carrier_status_at" timestamptz,
    "replaces_waybill_id" uuid,
    "reason_code" smallint,
    "reason" text,
    "request_sent_at" timestamptz NOT NULL,
    "carrier_accepted_at" timestamptz NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "ended_at" timestamptz,
    "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE leg_waybills (
    "leg_waybill_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "leg_id" uuid NOT NULL,
    "waybill_id" uuid NOT NULL,
    "sequence_no" integer NOT NULL,
    "active_from" timestamptz NOT NULL,
    "active_to" timestamptz,
    "reason_code" varchar(50),
    "reason" text,
    "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE tracking_events (
    "event_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "leg_id" uuid,
    "waybill_id" uuid,
    "attempt_id" uuid,
    "event_source" smallint NOT NULL,
    "source_namespace" varchar(100) NOT NULL,
    "dedupe_key" varchar(200) NOT NULL,
    "source_module" varchar(40) NOT NULL,
    "source_event_ref" varchar(150),
    "event_fingerprint" varchar(128),
    "payload_hash" varchar(128),
    "event_type" varchar(50) NOT NULL,
    "event_code" varchar(50),
    "event_name" varchar(150),
    "stage_status_code" varchar(50),
    "carrier_status_code" varchar(100),
    "carrier_status_name" varchar(200),
    "reason_code" varchar(50),
    "reason" text,
    "province_code" varchar(20),
    "province_name" varchar(150),
    "district_code" varchar(20),
    "district_name" varchar(150),
    "commune_code" varchar(20),
    "commune_name" varchar(150),
    "facility_code" varchar(100),
    "facility_name" varchar(200),
    "occurred_at" timestamptz NOT NULL,
    "received_at" timestamptz NOT NULL,
    "order_sequence_no" bigint NOT NULL,
    "leg_sequence_no" integer,
    "source_sequence_ref" varchar(100),
    "apply_result" smallint NOT NULL,
    "corrects_event_id" uuid,
    "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE transport_attempts (
    "attempt_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "leg_id" uuid NOT NULL,
    "waybill_id" uuid,
    "carrier_code" integer NOT NULL,
    "trigger_request_id" uuid,
    "attempt_code" varchar(50) NOT NULL,
    "attempt_type" smallint NOT NULL,
    "attempt_no" integer NOT NULL,
    "status" smallint NOT NULL,
    "failure_code" varchar(50),
    "failure_reason" text,
    "received_by_name" varchar(200),
    "received_by_relation" varchar(100),
    "source_ref" varchar(150),
    "started_at" timestamptz NOT NULL,
    "ended_at" timestamptz,
    "version_no" integer DEFAULT 1 NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE handovers (
    "handover_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "from_leg_id" uuid NOT NULL,
    "to_leg_id" uuid NOT NULL,
    "from_carrier_code" integer NOT NULL,
    "to_carrier_code" integer NOT NULL,
    "status" smallint NOT NULL,
    "started_at" timestamptz,
    "completed_at" timestamptz,
    "version_no" integer DEFAULT 1 NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE handover_attempts (
    "handover_attempt_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "handover_id" uuid NOT NULL,
    "trigger_request_id" uuid,
    "from_waybill_id" uuid,
    "to_waybill_id" uuid,
    "attempt_no" integer NOT NULL,
    "status" smallint NOT NULL,
    "failure_code" varchar(50),
    "failure_reason" text,
    "source_ref" varchar(150),
    "started_at" timestamptz NOT NULL,
    "ended_at" timestamptz,
    "version_no" integer DEFAULT 1 NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE operational_assignments (
    "assignment_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "assignment_no" integer NOT NULL,
    "leg_id" uuid NOT NULL,
    "waybill_id" uuid,
    "attempt_id" uuid,
    "handover_id" uuid,
    "handover_attempt_id" uuid,
    "carrier_code" integer NOT NULL,
    "role_type" smallint NOT NULL,
    "carrier_shipper_code" varchar(100),
    "assignee_name" varchar(200) NOT NULL,
    "assignee_phone" varchar(32),
    "shipper_image_ref" varchar(150),
    "vehicle_ref" varchar(100),
    "vehicle_type_code" smallint,
    "vehicle_plate_encrypted" text,
    "end_type" smallint,
    "end_reason" text,
    "source_module" varchar(40) NOT NULL,
    "source_ref" varchar(150),
    "valid_from" timestamptz NOT NULL,
    "valid_to" timestamptz,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE order_results (
    "result_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "leg_id" uuid,
    "waybill_id" uuid,
    "attempt_id" uuid,
    "request_id" uuid,
    "result_type" smallint NOT NULL,
    "result_code" smallint NOT NULL,
    "reason_code" varchar(50),
    "reason" text,
    "source_module" varchar(40) NOT NULL,
    "source_ref" varchar(150),
    "occurred_at" timestamptz NOT NULL,
    "valid_from" timestamptz NOT NULL,
    "valid_to" timestamptz,
    "version_no" integer NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE result_items (
    "order_id" uuid NOT NULL,
    "result_id" uuid NOT NULL,
    "item_id" uuid NOT NULL,
    "item_role" smallint NOT NULL,
    "request_id" uuid,
    "request_item_id" uuid,
    "quantity" integer NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    CONSTRAINT pk_result_items PRIMARY KEY (result_id, item_id, item_role)
);

CREATE TABLE order_status_history (
    "status_history_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "from_status_code" varchar(20),
    "status_code" varchar(20) NOT NULL,
    "version_no" integer NOT NULL,
    "tracking_event_id" uuid,
    "request_id" uuid,
    "reason_code" varchar(50),
    "reason" text,
    "changed_by_actor_type" smallint NOT NULL,
    "changed_by_actor_ref" varchar(100),
    "changed_at" timestamptz NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE order_requests (
    "request_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "request_code" varchar(50) NOT NULL,
    "request_type" varchar(40) NOT NULL,
    "request_status" smallint NOT NULL,
    "payload_version" integer DEFAULT 1 NOT NULL,
    "request_payload" jsonb NOT NULL,
    "reason_code" varchar(50),
    "reason" text,
    "source_type" smallint NOT NULL,
    "requested_by_actor_type" smallint NOT NULL,
    "requested_by_actor_ref" varchar(100),
    "requested_by_display_name" varchar(200) NOT NULL,
    "requested_at" timestamptz NOT NULL,
    "result_code" varchar(50),
    "result_reason_code" varchar(50),
    "result_reason" text,
    "completed_at" timestamptz,
    "correlation_id" varchar(100) NOT NULL,
    "version_no" integer DEFAULT 1 NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE request_targets (
    "request_target_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "request_id" uuid NOT NULL,
    "target_type" request_target_type NOT NULL,
    "party_id" uuid,
    "address_id" uuid,
    "goods_id" uuid,
    "leg_id" uuid,
    "waybill_id" uuid,
    "attempt_id" uuid,
    "handover_id" uuid,
    "external_ref_id" uuid,
    "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE request_items (
    "request_item_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "request_id" uuid NOT NULL,
    "item_id" uuid NOT NULL,
    "item_role" smallint NOT NULL,
    "quantity" integer NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE request_steps (
    "request_step_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "request_id" uuid NOT NULL,
    "request_target_id" uuid,
    "step_no" integer NOT NULL,
    "step_type" varchar(50) NOT NULL,
    "step_status" request_step_status NOT NULL,
    "carrier_code" integer,
    "result_waybill_id" uuid,
    "correlation_id" varchar(100),
    "external_ref" varchar(150),
    "request_hash" char(64),
    "result_code" varchar(50),
    "attempt_count" integer DEFAULT 0 NOT NULL,
    "next_retry_at" timestamptz,
    "last_error_code" varchar(50),
    "last_error" text,
    "started_at" timestamptz,
    "completed_at" timestamptz,
    "version_no" integer DEFAULT 1 NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE order_adjustments (
    "adjustment_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "request_id" uuid,
    "external_ref_id" uuid,
    "leg_id" uuid,
    "waybill_id" uuid,
    "adjustment_type" varchar(50) NOT NULL,
    "before_data" jsonb,
    "after_data" jsonb NOT NULL,
    "reason_code" varchar(50),
    "reason" text,
    "applied_by_actor_type" smallint NOT NULL,
    "applied_by_actor_ref" varchar(100),
    "applied_by_display_name" varchar(200) NOT NULL,
    "applied_at" timestamptz NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE order_notes (
    "note_id" uuid NOT NULL PRIMARY KEY,
    "note_code" varchar(50) NOT NULL UNIQUE,
    "order_id" uuid NOT NULL,
    "note_type" smallint NOT NULL,
    "visibility_scope" smallint NOT NULL,
    "content" text NOT NULL,
    "created_actor_type" smallint NOT NULL,
    "created_actor_code" varchar(100) NOT NULL,
    "created_display_name" varchar(200) NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE activity_logs (
    "activity_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "sequence_no" bigint NOT NULL,
    "activity_group" smallint NOT NULL,
    "activity_key" varchar(80) NOT NULL,
    "activity_name" varchar(150) NOT NULL,
    "title" varchar(250) NOT NULL,
    "description" text NOT NULL,
    "result" smallint NOT NULL,
    "actor_type" activity_actor_type NOT NULL,
    "actor_code" varchar(100),
    "actor_name" varchar(200) NOT NULL,
    "source_type" activity_source_type NOT NULL,
    "source_application_name" varchar(150),
    "source_application_version" varchar(50),
    "source_ip" inet,
    "changes" jsonb DEFAULT '[]' NOT NULL,
    "references" jsonb DEFAULT '[]' NOT NULL,
    "correlation_id" varchar(100),
    "occurred_at" timestamptz NOT NULL,
    "recorded_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE order_images (
    "image_id" uuid NOT NULL PRIMARY KEY,
    "image_code" varchar(50) NOT NULL UNIQUE,
    "order_id" uuid NOT NULL,
    "file_ref" varchar(150) NOT NULL,
    "image_type" order_image_type NOT NULL,
    "description" varchar(500),
    "visibility_scope" smallint NOT NULL,
    "source_type" smallint NOT NULL,
    "source_name" varchar(200) NOT NULL,
    "carrier_code" integer,
    "leg_id" uuid,
    "waybill_id" uuid,
    "attempt_id" uuid,
    "result_id" uuid,
    "status" smallint DEFAULT 1 NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "removed_at" timestamptz,
    "removed_by_actor_type" smallint,
    "removed_by_actor_ref" varchar(100)
);

CREATE TABLE external_refs (
    "external_ref_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "module_code" varchar(40) NOT NULL,
    "ref_type" varchar(50) NOT NULL,
    "external_id" varchar(150) NOT NULL,
    "parent_external_ref_id" uuid,
    "leg_id" uuid,
    "waybill_id" uuid,
    "carrier_code" integer,
    "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE order_batches (
    "batch_id" uuid NOT NULL PRIMARY KEY,
    "batch_code" varchar(50) NOT NULL UNIQUE,
    "shop_id" uuid NOT NULL,
    "status" smallint DEFAULT 1 NOT NULL,
    "total_rows" integer NOT NULL,
    "success_rows" integer DEFAULT 0 NOT NULL,
    "failed_rows" integer DEFAULT 0 NOT NULL,
    "processing_rows" integer NOT NULL,
    "failure_code" varchar(50),
    "failure_reason" text,
    "created_by_actor_type" smallint NOT NULL,
    "created_by_actor_ref" varchar(100),
    "created_by_display_name" varchar(200) NOT NULL,
    "created_application_id" varchar(100) NOT NULL,
    "created_client_id" varchar(100) NOT NULL,
    "correlation_id" varchar(100) NOT NULL,
    "version_no" integer DEFAULT 1 NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "started_at" timestamptz,
    "completed_at" timestamptz,
    "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE batch_items (
    "batch_item_id" uuid NOT NULL PRIMARY KEY,
    "batch_id" uuid NOT NULL,
    "row_number" integer NOT NULL,
    "order_id" uuid,
    "soc" varchar(100),
    "receiver_name" varchar(200) NOT NULL,
    "receiver_phone" varchar(32) NOT NULL,
    "status" smallint DEFAULT 1 NOT NULL,
    "input_data" jsonb NOT NULL,
    "input_schema_version" integer DEFAULT 1 NOT NULL,
    "input_hash" varchar(128) NOT NULL,
    "result_data" jsonb,
    "errors" jsonb DEFAULT '[]' NOT NULL,
    "attempt_count" integer DEFAULT 0 NOT NULL,
    "available_at" timestamptz DEFAULT now() NOT NULL,
    "claimed_by" varchar(100),
    "claim_until" timestamptz,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE batch_item_attempts (
    "batch_item_attempt_id" uuid NOT NULL PRIMARY KEY,
    "batch_item_id" uuid NOT NULL,
    "attempt_no" integer NOT NULL,
    "status" smallint NOT NULL,
    "result_data" jsonb,
    "errors" jsonb DEFAULT '[]' NOT NULL,
    "worker_ref" varchar(100),
    "started_at" timestamptz NOT NULL,
    "completed_at" timestamptz,
    "created_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE order_slas (
    "sla_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL UNIQUE,
    "is_applicable" boolean NOT NULL,
    "not_applicable_reason_code" smallint,
    "not_applicable_reason" varchar(255),
    "sla_code" varchar(50),
    "sla_name" varchar(150),
    "policy_code" varchar(100) NOT NULL,
    "policy_version" integer NOT NULL,
    "source_module" varchar(40) NOT NULL,
    "source_ref" varchar(150),
    "source_version" bigint NOT NULL,
    "route_type" smallint NOT NULL,
    "started_at" timestamptz,
    "expected_from" timestamptz,
    "expected_to" timestamptz,
    "completed_at" timestamptz,
    "result" smallint,
    "difference_minutes" integer,
    "version_no" integer DEFAULT 1 NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE waybill_slas (
    "waybill_sla_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid NOT NULL,
    "waybill_id" uuid NOT NULL UNIQUE,
    "carrier_code" integer NOT NULL,
    "carrier_client_code" varchar(100),
    "service_flow" smallint NOT NULL,
    "route_type" smallint NOT NULL,
    "commitment_level" smallint NOT NULL,
    "source_module" varchar(40) NOT NULL,
    "source_ref" varchar(150),
    "source_version" bigint NOT NULL,
    "standard_min_days" numeric(6,2) NOT NULL,
    "standard_max_days" numeric(6,2) NOT NULL,
    "additional_days" numeric(6,2) DEFAULT 0 NOT NULL,
    "time_basis" smallint NOT NULL,
    "started_at" timestamptz NOT NULL,
    "expected_from" timestamptz NOT NULL,
    "expected_to" timestamptz NOT NULL,
    "completed_at" timestamptz,
    "result" waybill_sla_result NOT NULL,
    "difference_minutes" integer,
    "adjustments" jsonb DEFAULT '[]' NOT NULL,
    "version_no" integer DEFAULT 1 NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE idempotency_records (
    "idempotency_id" uuid NOT NULL PRIMARY KEY,
    "scope_key" varchar(150) NOT NULL,
    "idempotency_key" varchar(200) NOT NULL,
    "request_hash" char(64) NOT NULL,
    "status" smallint NOT NULL,
    "resource_type" varchar(40),
    "resource_ref" varchar(100),
    "http_status" smallint,
    "result_code" varchar(50),
    "response_meta" jsonb,
    "lease_until" timestamptz,
    "expires_at" timestamptz NOT NULL,
    "created_at" timestamptz DEFAULT now() NOT NULL,
    "updated_at" timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE outbox_events (
    "outbox_event_id" uuid NOT NULL PRIMARY KEY,
    "order_id" uuid,
    "aggregate_type" varchar(40) NOT NULL,
    "aggregate_id" uuid NOT NULL,
    "aggregate_version" bigint,
    "event_type" varchar(60) NOT NULL,
    "event_key" varchar(220) NOT NULL UNIQUE,
    "schema_version" integer DEFAULT 1 NOT NULL,
    "payload" jsonb NOT NULL,
    "headers" jsonb,
    "correlation_id" varchar(100),
    "status" smallint DEFAULT 1 NOT NULL,
    "attempt_count" integer DEFAULT 0 NOT NULL,
    "available_at" timestamptz DEFAULT now() NOT NULL,
    "claimed_by" varchar(100),
    "claim_until" timestamptz,
    "last_error" text,
    "sent_at" timestamptz,
    "dead_lettered_at" timestamptz,
    "created_at" timestamptz DEFAULT now() NOT NULL
);

-- Domain checks and candidate keys from Database Dictionary v0.25.0.
ALTER TABLE order_statuses ADD CONSTRAINT chk_order_statuses_sort_no CHECK (sort_no >= 0);

ALTER TABLE orders
    ADD CONSTRAINT chk_orders_order_code CHECK (order_code ~ '^[0-9]{13}$'),
    ADD CONSTRAINT chk_orders_cod_amount CHECK (cod_amount >= 0),
    ADD CONSTRAINT chk_orders_options CHECK (inspection_type IN (1,2,3) AND fee_payer IN (1,2) AND pickup_method IN (1,2)),
    ADD CONSTRAINT chk_orders_service_codes CHECK (service_codes <@ ARRAY[1,2]::smallint[] AND array_position(service_codes, NULL) IS NULL),
    ADD CONSTRAINT chk_orders_models CHECK (customer_model IN (1,2,3,4) AND transport_model IN (1,2,3,4) AND selection_mode IN (1,2,3)),
    ADD CONSTRAINT chk_orders_shipping_config_pair CHECK ((shipping_config_ref IS NULL) = (shipping_config_version IS NULL) AND nullif(btrim(shipping_config_ref), '') IS NOT NULL OR shipping_config_ref IS NULL),
    ADD CONSTRAINT chk_orders_configuration_decision CHECK (btrim(configuration_decision_ref) <> ''),
    ADD CONSTRAINT chk_orders_created_actor CHECK (created_actor_type IN (1,2,3,4) AND (created_actor_type <> 1 OR created_by_identity_id IS NOT NULL)),
    ADD CONSTRAINT chk_orders_actor_fields CHECK (btrim(created_actor_ref) <> '' AND btrim(created_actor_name) <> '' AND btrim(created_application_id) <> '' AND btrim(created_client_id) <> '' AND btrim(correlation_id) <> ''),
    ADD CONSTRAINT chk_orders_results CHECK (delivery_result IN (0,1,2,3) AND exchange_result IN (0,1,2,3)),
    ADD CONSTRAINT chk_orders_version CHECK (version_no > 0),
    ADD CONSTRAINT chk_orders_pickup_schedule CHECK (pickup_scheduled_to IS NULL OR pickup_scheduled_from IS NULL OR pickup_scheduled_to >= pickup_scheduled_from);

ALTER TABLE order_addresses
    ADD CONSTRAINT chk_order_addresses_codes CHECK (btrim(province_code) <> '' AND btrim(commune_code) <> '' AND (district_code IS NULL OR btrim(district_code) <> '')),
    ADD CONSTRAINT chk_order_addresses_types CHECK (address_type IN (1,2,3) AND source_type IN (1,2,3) AND address_model IN (1,2)),
    ADD CONSTRAINT chk_order_addresses_model CHECK ((address_model = 1 AND district_code IS NOT NULL) OR (address_model = 2 AND district_code IS NULL)),
    ADD CONSTRAINT chk_order_addresses_coordinates CHECK ((latitude IS NULL) = (longitude IS NULL) AND (latitude IS NULL OR (latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180))),
    ADD CONSTRAINT chk_order_addresses_validity CHECK (valid_to IS NULL OR valid_to >= valid_from),
    ADD CONSTRAINT chk_order_addresses_version CHECK (version_no > 0),
    ADD CONSTRAINT uq_order_addresses_order_type_version UNIQUE (order_id, address_type, version_no),
    ADD CONSTRAINT uq_order_addresses_order_address UNIQUE (order_id, address_id);

ALTER TABLE order_parties
    ADD CONSTRAINT chk_order_parties_type CHECK (party_type IN (1,2,3)),
    ADD CONSTRAINT chk_order_parties_validity CHECK (valid_to IS NULL OR valid_to >= valid_from),
    ADD CONSTRAINT chk_order_parties_version CHECK (version_no > 0),
    ADD CONSTRAINT uq_order_parties_order_type_version UNIQUE (order_id, party_type, version_no),
    ADD CONSTRAINT uq_order_parties_order_party UNIQUE (order_id, party_id);

ALTER TABLE order_goods
    ADD CONSTRAINT chk_order_goods_content CHECK (content_type IN (1,2) AND (content_type <> 1 OR nullif(btrim(product_name), '') IS NOT NULL)),
    ADD CONSTRAINT chk_order_goods_value CHECK (declared_value >= 0 AND currency_code = 'VND'),
    ADD CONSTRAINT chk_order_goods_tags CHECK (tag_codes <@ ARRAY[1,2,3,4,5]::smallint[] AND array_position(tag_codes, NULL) IS NULL),
    ADD CONSTRAINT chk_order_goods_version CHECK (version_no > 0),
    ADD CONSTRAINT chk_order_goods_validity CHECK (valid_to IS NULL OR valid_to >= valid_from),
    ADD CONSTRAINT uq_order_goods_order_version UNIQUE (order_id, version_no),
    ADD CONSTRAINT uq_order_goods_order_goods UNIQUE (order_id, goods_id);

ALTER TABLE order_items
    ADD CONSTRAINT chk_order_items_quantity CHECK (quantity > 0),
    ADD CONSTRAINT chk_order_items_prices CHECK ((unit_price IS NULL OR unit_price >= 0) AND (unit_weight_g IS NULL OR unit_weight_g > 0)),
    ADD CONSTRAINT chk_order_items_text CHECK (btrim(item_code) <> '' AND btrim(item_name) <> '' AND (product_ref IS NULL OR btrim(product_ref) <> '') AND (sku IS NULL OR btrim(sku) <> '')),
    ADD CONSTRAINT uq_order_items_order_item UNIQUE (order_id, item_id),
    ADD CONSTRAINT uq_order_items_goods_code UNIQUE (goods_id, item_code);

ALTER TABLE parcel_measures
    ADD CONSTRAINT chk_parcel_measures_types CHECK (measure_kind IN (1,2,3,4) AND source_type IN (1,2,3)),
    ADD CONSTRAINT chk_parcel_measures_weight CHECK (weight_g IS NULL OR weight_g > 0),
    ADD CONSTRAINT chk_parcel_measures_dimensions CHECK ((length_cm IS NULL AND width_cm IS NULL AND height_cm IS NULL) OR (length_cm > 0 AND width_cm > 0 AND height_cm > 0)),
    ADD CONSTRAINT chk_parcel_measures_has_measure CHECK (weight_g IS NOT NULL OR length_cm IS NOT NULL),
    ADD CONSTRAINT chk_parcel_measures_actual_weight CHECK (measure_kind NOT IN (3,4) OR weight_g IS NOT NULL),
    ADD CONSTRAINT uq_parcel_measures_order_measure UNIQUE (order_id, measure_id);

ALTER TABLE order_legs
    ADD CONSTRAINT chk_order_legs_values CHECK (stage_no > 0 AND leg_type IN (1,2,3,4) AND btrim(stage_code) <> '' AND btrim(stage_status_code) <> ''),
    ADD CONSTRAINT chk_order_legs_carrier_client CHECK (carrier_client_code IS NULL OR carrier_code IS NOT NULL),
    ADD CONSTRAINT chk_order_legs_time CHECK (completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at),
    ADD CONSTRAINT chk_order_legs_version CHECK (version_no > 0),
    ADD CONSTRAINT uq_order_legs_order_leg UNIQUE (order_id, leg_id);

ALTER TABLE leg_endpoints
    ADD CONSTRAINT chk_leg_endpoints_types CHECK (endpoint_role IN (1,2) AND location_type IN (1,2,3,4) AND (address_model IS NULL OR address_model IN (1,2))),
    ADD CONSTRAINT chk_leg_endpoints_address_model CHECK (address_model IS NULL OR (province_code IS NOT NULL AND btrim(province_code) <> '' AND commune_code IS NOT NULL AND btrim(commune_code) <> '' AND ((address_model = 1 AND district_code IS NOT NULL) OR (address_model = 2 AND district_code IS NULL)))),
    ADD CONSTRAINT chk_leg_endpoints_order_address CHECK (location_type <> 1 OR order_address_id IS NOT NULL),
    ADD CONSTRAINT chk_leg_endpoints_coordinates CHECK ((latitude IS NULL) = (longitude IS NULL) AND (latitude IS NULL OR (latitude BETWEEN -90 AND 90 AND longitude BETWEEN -180 AND 180))),
    ADD CONSTRAINT chk_leg_endpoints_validity CHECK (valid_to IS NULL OR valid_to >= valid_from),
    ADD CONSTRAINT chk_leg_endpoints_version CHECK (version_no > 0),
    ADD CONSTRAINT uq_leg_endpoints_role_version UNIQUE (leg_id, endpoint_role, version_no);

ALTER TABLE leg_items ADD CONSTRAINT chk_leg_items_quantity CHECK (quantity > 0);

ALTER TABLE leg_services
    ADD CONSTRAINT chk_leg_services_mode CHECK (fulfillment_mode IN (1,2)),
    ADD CONSTRAINT chk_leg_services_text CHECK (btrim(service_code) <> '' AND btrim(service_name) <> ''),
    ADD CONSTRAINT chk_leg_services_amounts CHECK ((carrier_fee_amount IS NULL OR carrier_fee_amount >= 0) AND (shop_shipping_fee_amount IS NULL OR shop_shipping_fee_amount >= 0)),
    ADD CONSTRAINT chk_leg_services_priced_at CHECK ((pricing_result_ref IS NULL AND carrier_fee_amount IS NULL AND shop_shipping_fee_amount IS NULL) OR priced_at IS NOT NULL),
    ADD CONSTRAINT chk_leg_services_validity CHECK (valid_to IS NULL OR valid_to >= valid_from),
    ADD CONSTRAINT chk_leg_services_version CHECK (version_no > 0),
    ADD CONSTRAINT uq_leg_services_order_service UNIQUE (order_id, leg_id, leg_service_id);

ALTER TABLE waybills
    ADD CONSTRAINT chk_waybills_values CHECK (waybill_status IN (1,2,3,4) AND pickup_method IN (1,2) AND fee_payer IN (1,2) AND inspection_type IN (1,2,3)),
    ADD CONSTRAINT chk_waybills_amounts CHECK (cod_amount >= 0 AND collection_amount >= 0 AND declared_value >= 0),
    ADD CONSTRAINT chk_waybills_options CHECK (jsonb_typeof(carrier_options) = 'array'),
    ADD CONSTRAINT chk_waybills_snapshot CHECK (snapshot_schema_version > 0 AND btrim(snapshot_hash) <> ''),
    ADD CONSTRAINT chk_waybills_carrier_status CHECK (((carrier_status_code IS NULL AND carrier_status_name IS NULL) AND carrier_status_at IS NULL) OR ((carrier_status_code IS NOT NULL OR carrier_status_name IS NOT NULL) AND carrier_status_at IS NOT NULL)),
    ADD CONSTRAINT chk_waybills_reason CHECK ((reason_code IS NULL OR reason_code IN (1,2,3,4,99)) AND (reason_code <> 99 OR nullif(btrim(reason), '') IS NOT NULL)),
    ADD CONSTRAINT chk_waybills_accepted_at CHECK (carrier_accepted_at IS NULL OR request_sent_at IS NULL OR carrier_accepted_at >= request_sent_at),
    ADD CONSTRAINT chk_waybills_replacement CHECK (replaces_waybill_id IS NULL OR replaces_waybill_id <> waybill_id),
    ADD CONSTRAINT uq_waybills_carrier_code UNIQUE (carrier_code, carrier_waybill_code),
    ADD CONSTRAINT uq_waybills_order_waybill UNIQUE (order_id, waybill_id);

ALTER TABLE leg_waybills
    ADD CONSTRAINT chk_leg_waybills_validity CHECK (active_to IS NULL OR active_to >= active_from),
    ADD CONSTRAINT chk_leg_waybills_sequence CHECK (sequence_no > 0),
    ADD CONSTRAINT uq_leg_waybills_leg_waybill_from UNIQUE (leg_id, waybill_id, active_from);

ALTER TABLE tracking_events
    ADD CONSTRAINT chk_tracking_events_values CHECK (event_source IN (1,2,3) AND apply_result IN (1,2,3) AND order_sequence_no > 0),
    ADD CONSTRAINT chk_tracking_events_leg_sequence CHECK ((leg_id IS NULL AND leg_sequence_no IS NULL) OR (leg_id IS NOT NULL AND leg_sequence_no > 0)),
    ADD CONSTRAINT chk_tracking_events_correction CHECK (corrects_event_id IS NULL OR corrects_event_id <> event_id),
    ADD CONSTRAINT uq_tracking_events_source_dedupe UNIQUE (source_namespace, dedupe_key),
    ADD CONSTRAINT uq_tracking_events_order_event UNIQUE (order_id, event_id);

ALTER TABLE transport_attempts
    ADD CONSTRAINT chk_transport_attempts_values CHECK (attempt_type IN (1,2,3,4) AND status IN (1,2,3,4) AND attempt_no > 0 AND version_no > 0),
    ADD CONSTRAINT chk_transport_attempts_time CHECK (ended_at IS NULL OR ended_at >= started_at),
    ADD CONSTRAINT chk_transport_attempts_status CHECK ((status = 1 AND ended_at IS NULL AND failure_code IS NULL AND failure_reason IS NULL) OR (status = 2 AND ended_at IS NOT NULL AND failure_code IS NULL AND failure_reason IS NULL) OR (status = 3 AND ended_at IS NOT NULL AND nullif(btrim(failure_code), '') IS NOT NULL) OR (status = 4 AND ended_at IS NOT NULL)),
    ADD CONSTRAINT uq_transport_attempts_leg_type_no UNIQUE (leg_id, attempt_type, attempt_no),
    ADD CONSTRAINT uq_transport_attempts_order_code UNIQUE (order_id, attempt_code),
    ADD CONSTRAINT uq_transport_attempts_order_attempt UNIQUE (order_id, attempt_id);

ALTER TABLE handovers
    ADD CONSTRAINT chk_handovers_legs CHECK (from_leg_id <> to_leg_id),
    ADD CONSTRAINT chk_handovers_carriers CHECK (from_carrier_code <> to_carrier_code),
    ADD CONSTRAINT chk_handovers_status CHECK (status IN (1,2,3,4,5)),
    ADD CONSTRAINT chk_handovers_version CHECK (version_no > 0),
    ADD CONSTRAINT chk_handovers_time CHECK (completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at),
    ADD CONSTRAINT chk_handovers_status_time CHECK ((status = 1 AND started_at IS NULL AND completed_at IS NULL) OR (status = 2 AND started_at IS NOT NULL AND completed_at IS NULL) OR (status IN (3,4,5) AND completed_at IS NOT NULL)),
    ADD CONSTRAINT uq_handovers_order_handover UNIQUE (order_id, handover_id);

ALTER TABLE handover_attempts
    ADD CONSTRAINT chk_handover_attempts_values CHECK (attempt_no > 0 AND status IN (1,2,3,4) AND version_no > 0),
    ADD CONSTRAINT chk_handover_attempts_time CHECK (ended_at IS NULL OR ended_at >= started_at),
    ADD CONSTRAINT chk_handover_attempts_status_time CHECK ((status = 1 AND ended_at IS NULL) OR (status IN (2,3,4) AND ended_at IS NOT NULL)),
    ADD CONSTRAINT chk_handover_attempts_failure CHECK ((status = 3 AND nullif(btrim(failure_code), '') IS NOT NULL) OR (status <> 3 AND failure_code IS NULL AND failure_reason IS NULL)),
    ADD CONSTRAINT chk_handover_attempts_success_waybills CHECK (status <> 2 OR (from_waybill_id IS NOT NULL AND to_waybill_id IS NOT NULL AND from_waybill_id <> to_waybill_id)),
    ADD CONSTRAINT uq_handover_attempts_handover_no UNIQUE (handover_id, attempt_no),
    ADD CONSTRAINT uq_handover_attempts_order_attempt UNIQUE (order_id, handover_attempt_id);

ALTER TABLE operational_assignments
    ADD CONSTRAINT chk_operational_assignments_role CHECK (role_type IN (1,2,3,4,5)),
    ADD CONSTRAINT chk_operational_assignments_no CHECK (assignment_no > 0),
    ADD CONSTRAINT chk_operational_assignments_vehicle CHECK (vehicle_type_code IS NULL OR vehicle_type_code IN (1,2,3,4,99)),
    ADD CONSTRAINT chk_operational_assignments_validity CHECK (valid_to IS NULL OR valid_to >= valid_from),
    ADD CONSTRAINT chk_operational_assignments_end CHECK ((valid_to IS NULL AND end_type IS NULL AND end_reason IS NULL) OR (valid_to IS NOT NULL AND end_type IN (1,2,3))),
    ADD CONSTRAINT chk_operational_assignments_phone CHECK (assignee_phone IS NULL OR btrim(assignee_phone) <> '');

ALTER TABLE order_results
    ADD CONSTRAINT chk_order_results_values CHECK (result_type IN (1,2,3) AND result_code IN (1,2,3) AND version_no > 0),
    ADD CONSTRAINT chk_order_results_validity CHECK (valid_to IS NULL OR valid_to >= valid_from),
    ADD CONSTRAINT uq_order_results_order_type_version UNIQUE (order_id, result_type, version_no),
    ADD CONSTRAINT uq_order_results_order_result UNIQUE (order_id, result_id);

ALTER TABLE result_items
    ADD CONSTRAINT chk_result_items_quantity CHECK (quantity > 0),
    ADD CONSTRAINT chk_result_items_request_pair CHECK (request_item_id IS NULL OR request_id IS NOT NULL);

ALTER TABLE order_status_history
    ADD CONSTRAINT chk_order_status_history_version CHECK (version_no > 0),
    ADD CONSTRAINT chk_order_status_history_actor CHECK (changed_by_actor_type IN (1,2,3,4)),
    ADD CONSTRAINT chk_order_status_history_transition CHECK ((version_no = 1 AND from_status_code IS NULL) OR (version_no > 1 AND from_status_code IS NOT NULL AND from_status_code <> status_code)),
    ADD CONSTRAINT uq_order_status_history_order_version UNIQUE (order_id, version_no);

ALTER TABLE order_requests
    ADD CONSTRAINT chk_order_requests_values CHECK (request_status IN (1,2,3,4,5) AND payload_version > 0 AND version_no > 0 AND requested_by_actor_type IN (1,2,3,4) AND source_type IN (1,2,3,4,5)),
    ADD CONSTRAINT chk_order_requests_payload CHECK (jsonb_typeof(request_payload) = 'object'),
    ADD CONSTRAINT chk_order_requests_time CHECK (completed_at IS NULL OR completed_at >= requested_at),
    ADD CONSTRAINT chk_order_requests_status_time CHECK ((request_status IN (1,2) AND completed_at IS NULL) OR (request_status IN (3,4,5) AND completed_at IS NOT NULL)),
    ADD CONSTRAINT chk_order_requests_result CHECK ((request_status <> 3 OR nullif(btrim(result_code), '') IS NOT NULL) AND (request_status <> 4 OR nullif(btrim(result_reason_code), '') IS NOT NULL OR nullif(btrim(result_reason), '') IS NOT NULL)),
    ADD CONSTRAINT uq_order_requests_order_code UNIQUE (order_id, request_code),
    ADD CONSTRAINT uq_order_requests_order_request UNIQUE (order_id, request_id);

ALTER TABLE request_targets
    ADD CONSTRAINT chk_request_targets_exactly_one CHECK (num_nonnulls(party_id, address_id, goods_id, leg_id, waybill_id, attempt_id, handover_id, external_ref_id) = 1),
    ADD CONSTRAINT chk_request_targets_type CHECK ((target_type = 'PARTY' AND party_id IS NOT NULL) OR (target_type = 'ADDRESS' AND address_id IS NOT NULL) OR (target_type = 'GOODS' AND goods_id IS NOT NULL) OR (target_type = 'LEG' AND leg_id IS NOT NULL) OR (target_type = 'WAYBILL' AND waybill_id IS NOT NULL) OR (target_type = 'ATTEMPT' AND attempt_id IS NOT NULL) OR (target_type = 'HANDOVER' AND handover_id IS NOT NULL) OR (target_type = 'EXTERNAL_REF' AND external_ref_id IS NOT NULL)),
    ADD CONSTRAINT uq_request_targets_order_target UNIQUE (order_id, request_target_id);

ALTER TABLE request_items
    ADD CONSTRAINT chk_request_items_values CHECK (quantity > 0 AND item_role IN (1,2,3,4)),
    ADD CONSTRAINT uq_request_items_request_item_role UNIQUE (request_id, item_id, item_role),
    ADD CONSTRAINT uq_request_items_request_item_id UNIQUE (request_id, request_item_id);

ALTER TABLE request_steps
    ADD CONSTRAINT chk_request_steps_values CHECK (step_no > 0 AND attempt_count >= 0 AND version_no > 0),
    ADD CONSTRAINT chk_request_steps_time CHECK (completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at),
    ADD CONSTRAINT chk_request_steps_status_time CHECK ((step_status = 'PENDING' AND started_at IS NULL AND completed_at IS NULL) OR (step_status = 'PROCESSING' AND started_at IS NOT NULL AND completed_at IS NULL) OR (step_status IN ('SUCCESS','FAILED','CANCELLED') AND completed_at IS NOT NULL) OR step_status = 'UNKNOWN'),
    ADD CONSTRAINT chk_request_steps_waybill_carrier CHECK (step_type <> 'CREATE_WAYBILL' OR carrier_code IS NOT NULL),
    ADD CONSTRAINT chk_request_steps_waybill_result CHECK ((step_type = 'CREATE_WAYBILL' AND step_status = 'SUCCESS' AND result_waybill_id IS NOT NULL) OR (NOT (step_type = 'CREATE_WAYBILL' AND step_status = 'SUCCESS') AND result_waybill_id IS NULL)),
    ADD CONSTRAINT chk_request_steps_waybill_failure CHECK (NOT (step_type = 'CREATE_WAYBILL' AND step_status = 'FAILED') OR nullif(btrim(last_error_code), '') IS NOT NULL),
    ADD CONSTRAINT uq_request_steps_request_no UNIQUE (request_id, step_no);

ALTER TABLE order_adjustments
    ADD CONSTRAINT chk_order_adjustments_actor CHECK (applied_by_actor_type IN (1,2,3,4)),
    ADD CONSTRAINT chk_order_adjustments_json CHECK ((before_data IS NULL OR jsonb_typeof(before_data) = 'object') AND jsonb_typeof(after_data) = 'object' AND after_data <> '{}'::jsonb);

ALTER TABLE order_notes
    ADD CONSTRAINT chk_order_notes_values CHECK (note_type IN (1,2,3,4) AND visibility_scope IN (1,2) AND created_actor_type IN (1,2,3)),
    ADD CONSTRAINT chk_order_notes_content CHECK (length(btrim(content)) > 0);

ALTER TABLE activity_logs
    ADD CONSTRAINT chk_activity_logs_values CHECK (sequence_no > 0 AND activity_group BETWEEN 1 AND 12 AND result IN (1,2,3,4)),
    ADD CONSTRAINT chk_activity_logs_json CHECK (jsonb_typeof(changes) = 'array' AND jsonb_typeof("references") = 'array'),
    ADD CONSTRAINT uq_activity_logs_order_sequence UNIQUE (order_id, sequence_no);

ALTER TABLE order_images
    ADD CONSTRAINT chk_order_images_values CHECK (visibility_scope IN (1,2) AND source_type BETWEEN 1 AND 4 AND status IN (1,2)),
    ADD CONSTRAINT chk_order_images_carrier CHECK (source_type <> 3 OR carrier_code IS NOT NULL),
    ADD CONSTRAINT chk_order_images_removal CHECK ((status = 1 AND removed_at IS NULL AND removed_by_actor_type IS NULL AND removed_by_actor_ref IS NULL) OR (status = 2 AND removed_at IS NOT NULL AND removed_by_actor_type IN (1,2,3)));

ALTER TABLE external_refs
    ADD CONSTRAINT chk_external_refs_parent CHECK (parent_external_ref_id IS NULL OR parent_external_ref_id <> external_ref_id),
    ADD CONSTRAINT chk_external_refs_text CHECK (btrim(module_code) <> '' AND btrim(ref_type) <> '' AND btrim(external_id) <> ''),
    ADD CONSTRAINT uq_external_refs_business UNIQUE (order_id, module_code, ref_type, external_id),
    ADD CONSTRAINT uq_external_refs_order_ref UNIQUE (order_id, external_ref_id);

ALTER TABLE order_batches
    ADD CONSTRAINT chk_order_batches_values CHECK (status IN (1,2,3,4) AND created_by_actor_type IN (1,2,3,4) AND version_no > 0 AND total_rows > 0 AND success_rows >= 0 AND failed_rows >= 0 AND processing_rows >= 0),
    ADD CONSTRAINT chk_order_batches_counters CHECK (success_rows + failed_rows + processing_rows = total_rows),
    ADD CONSTRAINT chk_order_batches_status CHECK ((status = 1 AND completed_at IS NULL) OR (status = 2 AND success_rows = total_rows AND failed_rows = 0 AND processing_rows = 0 AND completed_at IS NOT NULL) OR (status = 3 AND failed_rows > 0 AND processing_rows = 0 AND completed_at IS NOT NULL) OR (status = 4 AND failed_rows = total_rows AND processing_rows = 0 AND nullif(btrim(failure_code), '') IS NOT NULL AND completed_at IS NOT NULL)),
    ADD CONSTRAINT chk_order_batches_failure CHECK (status = 4 OR (failure_code IS NULL AND failure_reason IS NULL)),
    ADD CONSTRAINT chk_order_batches_time CHECK (completed_at IS NULL OR started_at IS NULL OR completed_at >= started_at);

ALTER TABLE batch_items
    ADD CONSTRAINT chk_batch_items_values CHECK (row_number > 1 AND status IN (1,2,3) AND input_schema_version > 0 AND btrim(input_hash) <> '' AND attempt_count >= 0),
    ADD CONSTRAINT chk_batch_items_phone CHECK (btrim(receiver_phone) <> ''),
    ADD CONSTRAINT chk_batch_items_json CHECK (jsonb_typeof(input_data) = 'object' AND jsonb_typeof(errors) = 'array'),
    ADD CONSTRAINT chk_batch_items_status CHECK ((status = 1 AND order_id IS NULL AND errors = '[]'::jsonb) OR (status = 2 AND order_id IS NOT NULL AND errors = '[]'::jsonb) OR (status = 3 AND order_id IS NULL AND jsonb_array_length(errors) > 0)),
    ADD CONSTRAINT uq_batch_items_batch_row UNIQUE (batch_id, row_number);

ALTER TABLE batch_item_attempts
    ADD CONSTRAINT chk_batch_item_attempts_values CHECK (attempt_no > 0 AND status IN (1,2,3)),
    ADD CONSTRAINT chk_batch_item_attempts_time CHECK (completed_at IS NULL OR completed_at >= started_at),
    ADD CONSTRAINT chk_batch_item_attempts_json CHECK (jsonb_typeof(errors) = 'array'),
    ADD CONSTRAINT chk_batch_item_attempts_status CHECK ((status = 1 AND completed_at IS NULL AND errors = '[]'::jsonb) OR (status = 2 AND completed_at IS NOT NULL AND errors = '[]'::jsonb) OR (status = 3 AND completed_at IS NOT NULL AND jsonb_array_length(errors) > 0)),
    ADD CONSTRAINT uq_batch_item_attempts_item_no UNIQUE (batch_item_id, attempt_no);

ALTER TABLE order_slas
    ADD CONSTRAINT chk_order_slas_values CHECK (route_type IN (1,2,3,4,5) AND policy_version > 0 AND source_version > 0 AND version_no > 0 AND (result IS NULL OR result IN (1,2,3,4))),
    ADD CONSTRAINT chk_order_slas_expected CHECK (expected_to IS NULL OR expected_from IS NULL OR expected_to >= expected_from),
    ADD CONSTRAINT chk_order_slas_applicability CHECK ((is_applicable = false AND not_applicable_reason_code IS NOT NULL AND nullif(btrim(not_applicable_reason), '') IS NOT NULL AND sla_code IS NULL AND sla_name IS NULL AND started_at IS NULL AND expected_from IS NULL AND expected_to IS NULL AND completed_at IS NULL AND result IS NULL AND difference_minutes IS NULL) OR (is_applicable = true AND sla_code IS NOT NULL AND sla_name IS NOT NULL AND started_at IS NOT NULL AND expected_from IS NOT NULL AND expected_to IS NOT NULL AND result IS NOT NULL));

ALTER TABLE waybill_slas
    ADD CONSTRAINT chk_waybill_slas_values CHECK (service_flow IN (1,2) AND route_type IN (1,2,3,4,5) AND commitment_level IN (1,2,3) AND time_basis IN (1,2,3,4) AND source_version > 0 AND version_no > 0),
    ADD CONSTRAINT chk_waybill_slas_days CHECK (standard_min_days >= 0 AND standard_max_days >= standard_min_days AND additional_days >= 0),
    ADD CONSTRAINT chk_waybill_slas_expected CHECK (expected_to >= expected_from),
    ADD CONSTRAINT chk_waybill_slas_adjustments CHECK (jsonb_typeof(adjustments) = 'array'),
    ADD CONSTRAINT chk_waybill_slas_result CHECK ((commitment_level = 2 AND result = 'REFERENCE_ONLY') OR (commitment_level = 3 AND result = 'NOT_APPLICABLE') OR (commitment_level = 1 AND result IN ('WITHIN_DUE','OVERDUE','COMPLETED_ON_TIME','COMPLETED_LATE')));

ALTER TABLE idempotency_records
    ADD CONSTRAINT chk_idempotency_records_status CHECK (status IN (1,2,3)),
    ADD CONSTRAINT chk_idempotency_records_expiry CHECK (expires_at > created_at),
    ADD CONSTRAINT chk_idempotency_records_hash CHECK (request_hash ~ '^[0-9a-f]{64}$' AND btrim(scope_key) <> '' AND btrim(idempotency_key) <> ''),
    ADD CONSTRAINT chk_idempotency_records_response CHECK (response_meta IS NULL OR jsonb_typeof(response_meta) = 'object'),
    ADD CONSTRAINT chk_idempotency_records_state CHECK ((status = 1 AND lease_until IS NOT NULL AND http_status IS NULL) OR (status IN (2,3) AND lease_until IS NULL AND http_status IS NOT NULL AND nullif(btrim(result_code), '') IS NOT NULL)),
    ADD CONSTRAINT chk_idempotency_records_resource CHECK ((resource_type IS NULL) = (resource_ref IS NULL)),
    ADD CONSTRAINT uq_idempotency_records_scope_key UNIQUE (scope_key, idempotency_key);

ALTER TABLE outbox_events
    ADD CONSTRAINT chk_outbox_events_values CHECK (schema_version > 0 AND status IN (1,2,3,4,5) AND attempt_count >= 0 AND (aggregate_version IS NULL OR aggregate_version > 0)),
    ADD CONSTRAINT chk_outbox_events_text CHECK (btrim(aggregate_type) <> '' AND btrim(event_type) <> '' AND btrim(event_key) <> ''),
    ADD CONSTRAINT chk_outbox_events_json CHECK (jsonb_typeof(payload) = 'object' AND (headers IS NULL OR jsonb_typeof(headers) = 'object')),
    ADD CONSTRAINT chk_outbox_events_state CHECK ((status = 1 AND claimed_by IS NULL AND claim_until IS NULL AND sent_at IS NULL AND dead_lettered_at IS NULL) OR (status = 2 AND claimed_by IS NOT NULL AND claim_until IS NOT NULL AND sent_at IS NULL AND dead_lettered_at IS NULL) OR (status = 3 AND claimed_by IS NULL AND claim_until IS NULL AND sent_at IS NOT NULL AND dead_lettered_at IS NULL) OR (status = 4 AND claimed_by IS NULL AND claim_until IS NULL AND nullif(btrim(last_error), '') IS NOT NULL AND sent_at IS NULL AND dead_lettered_at IS NULL) OR (status = 5 AND claimed_by IS NULL AND claim_until IS NULL AND nullif(btrim(last_error), '') IS NOT NULL AND dead_lettered_at IS NOT NULL AND sent_at IS NULL)),
    ADD CONSTRAINT chk_outbox_events_time CHECK ((claim_until IS NULL OR claim_until > created_at) AND (sent_at IS NULL OR sent_at >= created_at) AND (dead_lettered_at IS NULL OR dead_lettered_at >= created_at));

-- Partial unique indexes declared as database constraints in the Dictionary.
CREATE UNIQUE INDEX uq_order_addresses_current ON order_addresses (order_id, address_type) WHERE valid_to IS NULL;
CREATE UNIQUE INDEX uq_order_parties_current ON order_parties (order_id, party_type) WHERE valid_to IS NULL;
CREATE UNIQUE INDEX uq_order_goods_current ON order_goods (order_id) WHERE valid_to IS NULL;
CREATE UNIQUE INDEX uq_parcel_measures_source ON parcel_measures (order_id, source_type, source_ref, measure_kind) WHERE source_ref IS NOT NULL;
CREATE UNIQUE INDEX uq_leg_endpoints_current ON leg_endpoints (leg_id, endpoint_role) WHERE valid_to IS NULL;
CREATE UNIQUE INDEX uq_leg_waybills_current ON leg_waybills (leg_id) WHERE active_to IS NULL;
CREATE UNIQUE INDEX uq_order_results_current ON order_results (order_id, result_type) WHERE valid_to IS NULL;
CREATE UNIQUE INDEX uq_batch_items_order ON batch_items (order_id) WHERE order_id IS NOT NULL;
CREATE UNIQUE INDEX uq_request_targets_party ON request_targets (request_id, party_id) WHERE target_type = 'PARTY';
CREATE UNIQUE INDEX uq_request_targets_address ON request_targets (request_id, address_id) WHERE target_type = 'ADDRESS';
CREATE UNIQUE INDEX uq_request_targets_goods ON request_targets (request_id, goods_id) WHERE target_type = 'GOODS';
CREATE UNIQUE INDEX uq_request_targets_leg ON request_targets (request_id, leg_id) WHERE target_type = 'LEG';
CREATE UNIQUE INDEX uq_request_targets_waybill ON request_targets (request_id, waybill_id) WHERE target_type = 'WAYBILL';
CREATE UNIQUE INDEX uq_request_targets_attempt ON request_targets (request_id, attempt_id) WHERE target_type = 'ATTEMPT';
CREATE UNIQUE INDEX uq_request_targets_handover ON request_targets (request_id, handover_id) WHERE target_type = 'HANDOVER';
CREATE UNIQUE INDEX uq_request_targets_external_ref ON request_targets (request_id, external_ref_id) WHERE target_type = 'EXTERNAL_REF';

ALTER TABLE orders ADD CONSTRAINT fk_orders_status_code FOREIGN KEY (status_code) REFERENCES order_statuses (status_code) ON DELETE RESTRICT;
ALTER TABLE orders ADD CONSTRAINT fk_orders_current_leg_id FOREIGN KEY (current_leg_id) REFERENCES order_legs (leg_id) ON DELETE RESTRICT;
ALTER TABLE order_addresses ADD CONSTRAINT fk_order_addresses_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE RESTRICT;
ALTER TABLE order_parties ADD CONSTRAINT fk_order_parties_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE RESTRICT;
ALTER TABLE order_goods ADD CONSTRAINT fk_order_goods_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE RESTRICT;
ALTER TABLE order_items ADD CONSTRAINT fk_order_items_goods_id FOREIGN KEY (goods_id) REFERENCES order_goods (goods_id) ON DELETE RESTRICT;
ALTER TABLE parcel_measures ADD CONSTRAINT fk_parcel_measures_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE RESTRICT;
ALTER TABLE parcel_measures ADD CONSTRAINT fk_parcel_measures_leg_id FOREIGN KEY (leg_id) REFERENCES order_legs (leg_id) ON DELETE RESTRICT;
ALTER TABLE parcel_measures ADD CONSTRAINT fk_parcel_measures_waybill_id FOREIGN KEY (waybill_id) REFERENCES waybills (waybill_id) ON DELETE RESTRICT;
ALTER TABLE order_legs ADD CONSTRAINT fk_order_legs_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE RESTRICT;
ALTER TABLE leg_endpoints ADD CONSTRAINT fk_leg_endpoints_leg_id FOREIGN KEY (leg_id) REFERENCES order_legs (leg_id) ON DELETE RESTRICT;
ALTER TABLE leg_endpoints ADD CONSTRAINT fk_leg_endpoints_order_address_id FOREIGN KEY (order_address_id) REFERENCES order_addresses (address_id) ON DELETE RESTRICT;
ALTER TABLE leg_items ADD CONSTRAINT fk_leg_items_leg_id FOREIGN KEY (leg_id) REFERENCES order_legs (leg_id) ON DELETE RESTRICT;
ALTER TABLE leg_items ADD CONSTRAINT fk_leg_items_item_id FOREIGN KEY (item_id) REFERENCES order_items (item_id) ON DELETE RESTRICT;
ALTER TABLE leg_services ADD CONSTRAINT fk_leg_services_leg_id FOREIGN KEY (leg_id) REFERENCES order_legs (leg_id) ON DELETE RESTRICT;
ALTER TABLE waybills ADD CONSTRAINT fk_waybills_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE RESTRICT;
ALTER TABLE waybills ADD CONSTRAINT fk_waybills_origin_request_id FOREIGN KEY (origin_request_id) REFERENCES order_requests (request_id) ON DELETE RESTRICT;
ALTER TABLE waybills ADD CONSTRAINT fk_waybills_sender_party_id FOREIGN KEY (sender_party_id) REFERENCES order_parties (party_id) ON DELETE RESTRICT;
ALTER TABLE waybills ADD CONSTRAINT fk_waybills_receiver_party_id FOREIGN KEY (receiver_party_id) REFERENCES order_parties (party_id) ON DELETE RESTRICT;
ALTER TABLE waybills ADD CONSTRAINT fk_waybills_pickup_address_id FOREIGN KEY (pickup_address_id) REFERENCES order_addresses (address_id) ON DELETE RESTRICT;
ALTER TABLE waybills ADD CONSTRAINT fk_waybills_delivery_address_id FOREIGN KEY (delivery_address_id) REFERENCES order_addresses (address_id) ON DELETE RESTRICT;
ALTER TABLE waybills ADD CONSTRAINT fk_waybills_goods_id FOREIGN KEY (goods_id) REFERENCES order_goods (goods_id) ON DELETE RESTRICT;
ALTER TABLE waybills ADD CONSTRAINT fk_waybills_measure_id FOREIGN KEY (measure_id) REFERENCES parcel_measures (measure_id) ON DELETE RESTRICT;
ALTER TABLE waybills ADD CONSTRAINT fk_waybills_leg_service_id FOREIGN KEY (leg_service_id) REFERENCES leg_services (leg_service_id) ON DELETE RESTRICT;
ALTER TABLE waybills ADD CONSTRAINT fk_waybills_replaces_waybill_id FOREIGN KEY (replaces_waybill_id) REFERENCES waybills (waybill_id) ON DELETE RESTRICT;
ALTER TABLE leg_waybills ADD CONSTRAINT fk_leg_waybills_leg_id FOREIGN KEY (leg_id) REFERENCES order_legs (leg_id) ON DELETE RESTRICT;
ALTER TABLE leg_waybills ADD CONSTRAINT fk_leg_waybills_waybill_id FOREIGN KEY (waybill_id) REFERENCES waybills (waybill_id) ON DELETE RESTRICT;
ALTER TABLE tracking_events ADD CONSTRAINT fk_tracking_events_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE RESTRICT;
ALTER TABLE tracking_events ADD CONSTRAINT fk_tracking_events_leg_id FOREIGN KEY (leg_id) REFERENCES order_legs (leg_id) ON DELETE RESTRICT;
ALTER TABLE tracking_events ADD CONSTRAINT fk_tracking_events_waybill_id FOREIGN KEY (waybill_id) REFERENCES waybills (waybill_id) ON DELETE RESTRICT;
ALTER TABLE tracking_events ADD CONSTRAINT fk_tracking_events_attempt_id FOREIGN KEY (attempt_id) REFERENCES transport_attempts (attempt_id) ON DELETE RESTRICT;
ALTER TABLE tracking_events ADD CONSTRAINT fk_tracking_events_corrects_event_id FOREIGN KEY (corrects_event_id) REFERENCES tracking_events (event_id) ON DELETE RESTRICT;
ALTER TABLE transport_attempts ADD CONSTRAINT fk_transport_attempts_leg_id FOREIGN KEY (leg_id) REFERENCES order_legs (leg_id) ON DELETE RESTRICT;
ALTER TABLE transport_attempts ADD CONSTRAINT fk_transport_attempts_waybill_id FOREIGN KEY (waybill_id) REFERENCES waybills (waybill_id) ON DELETE RESTRICT;
ALTER TABLE transport_attempts ADD CONSTRAINT fk_transport_attempts_trigger_request_id FOREIGN KEY (trigger_request_id) REFERENCES order_requests (request_id) ON DELETE RESTRICT;
ALTER TABLE handovers ADD CONSTRAINT fk_handovers_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE RESTRICT;
ALTER TABLE handovers ADD CONSTRAINT fk_handovers_from_leg_id FOREIGN KEY (from_leg_id) REFERENCES order_legs (leg_id) ON DELETE RESTRICT;
ALTER TABLE handovers ADD CONSTRAINT fk_handovers_to_leg_id FOREIGN KEY (to_leg_id) REFERENCES order_legs (leg_id) ON DELETE RESTRICT;
ALTER TABLE handover_attempts ADD CONSTRAINT fk_handover_attempts_handover_id FOREIGN KEY (handover_id) REFERENCES handovers (handover_id) ON DELETE RESTRICT;
ALTER TABLE handover_attempts ADD CONSTRAINT fk_handover_attempts_trigger_request_id FOREIGN KEY (trigger_request_id) REFERENCES order_requests (request_id) ON DELETE RESTRICT;
ALTER TABLE handover_attempts ADD CONSTRAINT fk_handover_attempts_from_waybill_id FOREIGN KEY (from_waybill_id) REFERENCES waybills (waybill_id) ON DELETE RESTRICT;
ALTER TABLE handover_attempts ADD CONSTRAINT fk_handover_attempts_to_waybill_id FOREIGN KEY (to_waybill_id) REFERENCES waybills (waybill_id) ON DELETE RESTRICT;
ALTER TABLE operational_assignments ADD CONSTRAINT fk_operational_assignments_leg_id FOREIGN KEY (leg_id) REFERENCES order_legs (leg_id) ON DELETE RESTRICT;
ALTER TABLE operational_assignments ADD CONSTRAINT fk_operational_assignments_waybill_id FOREIGN KEY (waybill_id) REFERENCES waybills (waybill_id) ON DELETE RESTRICT;
ALTER TABLE operational_assignments ADD CONSTRAINT fk_operational_assignments_attempt_id FOREIGN KEY (attempt_id) REFERENCES transport_attempts (attempt_id) ON DELETE RESTRICT;
ALTER TABLE operational_assignments ADD CONSTRAINT fk_operational_assignments_handover_id FOREIGN KEY (handover_id) REFERENCES handovers (handover_id) ON DELETE RESTRICT;
ALTER TABLE operational_assignments ADD CONSTRAINT fk_operational_assignments_handover_attempt_id FOREIGN KEY (handover_attempt_id) REFERENCES handover_attempts (handover_attempt_id) ON DELETE RESTRICT;
ALTER TABLE order_results ADD CONSTRAINT fk_order_results_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE RESTRICT;
ALTER TABLE order_results ADD CONSTRAINT fk_order_results_leg_id FOREIGN KEY (leg_id) REFERENCES order_legs (leg_id) ON DELETE RESTRICT;
ALTER TABLE order_results ADD CONSTRAINT fk_order_results_waybill_id FOREIGN KEY (waybill_id) REFERENCES waybills (waybill_id) ON DELETE RESTRICT;
ALTER TABLE order_results ADD CONSTRAINT fk_order_results_attempt_id FOREIGN KEY (attempt_id) REFERENCES transport_attempts (attempt_id) ON DELETE RESTRICT;
ALTER TABLE order_results ADD CONSTRAINT fk_order_results_request_id FOREIGN KEY (request_id) REFERENCES order_requests (request_id) ON DELETE RESTRICT;
ALTER TABLE result_items ADD CONSTRAINT fk_result_items_result_id FOREIGN KEY (result_id) REFERENCES order_results (result_id) ON DELETE RESTRICT;
ALTER TABLE result_items ADD CONSTRAINT fk_result_items_item_id FOREIGN KEY (item_id) REFERENCES order_items (item_id) ON DELETE RESTRICT;
ALTER TABLE result_items ADD CONSTRAINT fk_result_items_request_id FOREIGN KEY (request_id) REFERENCES order_requests (request_id) ON DELETE RESTRICT;
ALTER TABLE result_items ADD CONSTRAINT fk_result_items_request_item_id FOREIGN KEY (request_item_id) REFERENCES request_items (request_item_id) ON DELETE RESTRICT;
ALTER TABLE order_status_history ADD CONSTRAINT fk_order_status_history_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE RESTRICT;
ALTER TABLE order_status_history ADD CONSTRAINT fk_order_status_history_from_status_code FOREIGN KEY (from_status_code) REFERENCES order_statuses (status_code) ON DELETE RESTRICT;
ALTER TABLE order_status_history ADD CONSTRAINT fk_order_status_history_status_code FOREIGN KEY (status_code) REFERENCES order_statuses (status_code) ON DELETE RESTRICT;
ALTER TABLE order_status_history ADD CONSTRAINT fk_order_status_history_tracking_event_id FOREIGN KEY (tracking_event_id) REFERENCES tracking_events (event_id) ON DELETE RESTRICT;
ALTER TABLE order_status_history ADD CONSTRAINT fk_order_status_history_request_id FOREIGN KEY (request_id) REFERENCES order_requests (request_id) ON DELETE RESTRICT;
ALTER TABLE order_requests ADD CONSTRAINT fk_order_requests_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE RESTRICT;
ALTER TABLE request_targets ADD CONSTRAINT fk_request_targets_request_id FOREIGN KEY (request_id) REFERENCES order_requests (request_id) ON DELETE RESTRICT;
ALTER TABLE request_targets ADD CONSTRAINT fk_request_targets_party_id FOREIGN KEY (party_id) REFERENCES order_parties (party_id) ON DELETE RESTRICT;
ALTER TABLE request_targets ADD CONSTRAINT fk_request_targets_address_id FOREIGN KEY (address_id) REFERENCES order_addresses (address_id) ON DELETE RESTRICT;
ALTER TABLE request_targets ADD CONSTRAINT fk_request_targets_goods_id FOREIGN KEY (goods_id) REFERENCES order_goods (goods_id) ON DELETE RESTRICT;
ALTER TABLE request_targets ADD CONSTRAINT fk_request_targets_leg_id FOREIGN KEY (leg_id) REFERENCES order_legs (leg_id) ON DELETE RESTRICT;
ALTER TABLE request_targets ADD CONSTRAINT fk_request_targets_waybill_id FOREIGN KEY (waybill_id) REFERENCES waybills (waybill_id) ON DELETE RESTRICT;
ALTER TABLE request_targets ADD CONSTRAINT fk_request_targets_attempt_id FOREIGN KEY (attempt_id) REFERENCES transport_attempts (attempt_id) ON DELETE RESTRICT;
ALTER TABLE request_targets ADD CONSTRAINT fk_request_targets_handover_id FOREIGN KEY (handover_id) REFERENCES handovers (handover_id) ON DELETE RESTRICT;
ALTER TABLE request_targets ADD CONSTRAINT fk_request_targets_external_ref_id FOREIGN KEY (external_ref_id) REFERENCES external_refs (external_ref_id) ON DELETE RESTRICT;
ALTER TABLE request_items ADD CONSTRAINT fk_request_items_request_id FOREIGN KEY (request_id) REFERENCES order_requests (request_id) ON DELETE RESTRICT;
ALTER TABLE request_items ADD CONSTRAINT fk_request_items_item_id FOREIGN KEY (item_id) REFERENCES order_items (item_id) ON DELETE RESTRICT;
ALTER TABLE request_steps ADD CONSTRAINT fk_request_steps_request_id FOREIGN KEY (request_id) REFERENCES order_requests (request_id) ON DELETE RESTRICT;
ALTER TABLE request_steps ADD CONSTRAINT fk_request_steps_request_target_id FOREIGN KEY (request_target_id) REFERENCES request_targets (request_target_id) ON DELETE RESTRICT;
ALTER TABLE request_steps ADD CONSTRAINT fk_request_steps_result_waybill_id FOREIGN KEY (result_waybill_id) REFERENCES waybills (waybill_id) ON DELETE RESTRICT;
ALTER TABLE order_adjustments ADD CONSTRAINT fk_order_adjustments_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE RESTRICT;
ALTER TABLE order_adjustments ADD CONSTRAINT fk_order_adjustments_request_id FOREIGN KEY (request_id) REFERENCES order_requests (request_id) ON DELETE RESTRICT;
ALTER TABLE order_adjustments ADD CONSTRAINT fk_order_adjustments_external_ref_id FOREIGN KEY (external_ref_id) REFERENCES external_refs (external_ref_id) ON DELETE RESTRICT;
ALTER TABLE order_adjustments ADD CONSTRAINT fk_order_adjustments_leg_id FOREIGN KEY (leg_id) REFERENCES order_legs (leg_id) ON DELETE RESTRICT;
ALTER TABLE order_adjustments ADD CONSTRAINT fk_order_adjustments_waybill_id FOREIGN KEY (waybill_id) REFERENCES waybills (waybill_id) ON DELETE RESTRICT;
ALTER TABLE order_notes ADD CONSTRAINT fk_order_notes_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE RESTRICT;
ALTER TABLE activity_logs ADD CONSTRAINT fk_activity_logs_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE RESTRICT;
ALTER TABLE order_images ADD CONSTRAINT fk_order_images_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE RESTRICT;
ALTER TABLE order_images ADD CONSTRAINT fk_order_images_leg_id FOREIGN KEY (leg_id) REFERENCES order_legs (leg_id) ON DELETE RESTRICT;
ALTER TABLE order_images ADD CONSTRAINT fk_order_images_waybill_id FOREIGN KEY (waybill_id) REFERENCES waybills (waybill_id) ON DELETE RESTRICT;
ALTER TABLE order_images ADD CONSTRAINT fk_order_images_attempt_id FOREIGN KEY (attempt_id) REFERENCES transport_attempts (attempt_id) ON DELETE RESTRICT;
ALTER TABLE order_images ADD CONSTRAINT fk_order_images_result_id FOREIGN KEY (result_id) REFERENCES order_results (result_id) ON DELETE RESTRICT;
ALTER TABLE external_refs ADD CONSTRAINT fk_external_refs_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE RESTRICT;
ALTER TABLE external_refs ADD CONSTRAINT fk_external_refs_parent_external_ref_id FOREIGN KEY (parent_external_ref_id) REFERENCES external_refs (external_ref_id) ON DELETE RESTRICT;
ALTER TABLE external_refs ADD CONSTRAINT fk_external_refs_leg_id FOREIGN KEY (leg_id) REFERENCES order_legs (leg_id) ON DELETE RESTRICT;
ALTER TABLE external_refs ADD CONSTRAINT fk_external_refs_waybill_id FOREIGN KEY (waybill_id) REFERENCES waybills (waybill_id) ON DELETE RESTRICT;
ALTER TABLE batch_items ADD CONSTRAINT fk_batch_items_batch_id FOREIGN KEY (batch_id) REFERENCES order_batches (batch_id) ON DELETE RESTRICT;
ALTER TABLE batch_items ADD CONSTRAINT fk_batch_items_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE RESTRICT;
ALTER TABLE batch_item_attempts ADD CONSTRAINT fk_batch_item_attempts_batch_item_id FOREIGN KEY (batch_item_id) REFERENCES batch_items (batch_item_id) ON DELETE RESTRICT;
ALTER TABLE order_slas ADD CONSTRAINT fk_order_slas_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE RESTRICT;
ALTER TABLE waybill_slas ADD CONSTRAINT fk_waybill_slas_waybill_id FOREIGN KEY (waybill_id) REFERENCES waybills (waybill_id) ON DELETE RESTRICT;
ALTER TABLE outbox_events ADD CONSTRAINT fk_outbox_events_order_id FOREIGN KEY (order_id) REFERENCES orders (order_id) ON DELETE RESTRICT;

-- Same-Order composite keys prevent cross-Order references.
ALTER TABLE leg_services ADD CONSTRAINT uq_leg_services_order_service_id UNIQUE (order_id, leg_service_id);
ALTER TABLE request_items ADD CONSTRAINT uq_request_items_order_request_item UNIQUE (order_id, request_item_id);

ALTER TABLE orders ADD CONSTRAINT fk_orders_current_leg_order FOREIGN KEY (order_id, current_leg_id) REFERENCES order_legs (order_id, leg_id) ON DELETE RESTRICT;
ALTER TABLE order_items ADD CONSTRAINT fk_order_items_goods_order FOREIGN KEY (order_id, goods_id) REFERENCES order_goods (order_id, goods_id) ON DELETE RESTRICT;
ALTER TABLE leg_endpoints ADD CONSTRAINT fk_leg_endpoints_leg_order FOREIGN KEY (order_id, leg_id) REFERENCES order_legs (order_id, leg_id) ON DELETE RESTRICT;
ALTER TABLE leg_endpoints ADD CONSTRAINT fk_leg_endpoints_address_order FOREIGN KEY (order_id, order_address_id) REFERENCES order_addresses (order_id, address_id) ON DELETE RESTRICT;
ALTER TABLE leg_items ADD CONSTRAINT fk_leg_items_leg_order FOREIGN KEY (order_id, leg_id) REFERENCES order_legs (order_id, leg_id) ON DELETE RESTRICT;
ALTER TABLE leg_items ADD CONSTRAINT fk_leg_items_item_order FOREIGN KEY (order_id, item_id) REFERENCES order_items (order_id, item_id) ON DELETE RESTRICT;
ALTER TABLE leg_services ADD CONSTRAINT fk_leg_services_leg_order FOREIGN KEY (order_id, leg_id) REFERENCES order_legs (order_id, leg_id) ON DELETE RESTRICT;

ALTER TABLE waybills ADD CONSTRAINT fk_waybills_request_order FOREIGN KEY (order_id, origin_request_id) REFERENCES order_requests (order_id, request_id) ON DELETE RESTRICT;
ALTER TABLE waybills ADD CONSTRAINT fk_waybills_sender_order FOREIGN KEY (order_id, sender_party_id) REFERENCES order_parties (order_id, party_id) ON DELETE RESTRICT;
ALTER TABLE waybills ADD CONSTRAINT fk_waybills_receiver_order FOREIGN KEY (order_id, receiver_party_id) REFERENCES order_parties (order_id, party_id) ON DELETE RESTRICT;
ALTER TABLE waybills ADD CONSTRAINT fk_waybills_pickup_address_order FOREIGN KEY (order_id, pickup_address_id) REFERENCES order_addresses (order_id, address_id) ON DELETE RESTRICT;
ALTER TABLE waybills ADD CONSTRAINT fk_waybills_delivery_address_order FOREIGN KEY (order_id, delivery_address_id) REFERENCES order_addresses (order_id, address_id) ON DELETE RESTRICT;
ALTER TABLE waybills ADD CONSTRAINT fk_waybills_goods_order FOREIGN KEY (order_id, goods_id) REFERENCES order_goods (order_id, goods_id) ON DELETE RESTRICT;
ALTER TABLE waybills ADD CONSTRAINT fk_waybills_measure_order FOREIGN KEY (order_id, measure_id) REFERENCES parcel_measures (order_id, measure_id) ON DELETE RESTRICT;
ALTER TABLE waybills ADD CONSTRAINT fk_waybills_service_order FOREIGN KEY (order_id, leg_service_id) REFERENCES leg_services (order_id, leg_service_id) ON DELETE RESTRICT;
ALTER TABLE waybills ADD CONSTRAINT fk_waybills_replacement_order FOREIGN KEY (order_id, replaces_waybill_id) REFERENCES waybills (order_id, waybill_id) ON DELETE RESTRICT;

ALTER TABLE leg_waybills ADD CONSTRAINT fk_leg_waybills_leg_order FOREIGN KEY (order_id, leg_id) REFERENCES order_legs (order_id, leg_id) ON DELETE RESTRICT;
ALTER TABLE leg_waybills ADD CONSTRAINT fk_leg_waybills_waybill_order FOREIGN KEY (order_id, waybill_id) REFERENCES waybills (order_id, waybill_id) ON DELETE RESTRICT;
ALTER TABLE tracking_events ADD CONSTRAINT fk_tracking_events_leg_order FOREIGN KEY (order_id, leg_id) REFERENCES order_legs (order_id, leg_id) ON DELETE RESTRICT;
ALTER TABLE tracking_events ADD CONSTRAINT fk_tracking_events_waybill_order FOREIGN KEY (order_id, waybill_id) REFERENCES waybills (order_id, waybill_id) ON DELETE RESTRICT;
ALTER TABLE tracking_events ADD CONSTRAINT fk_tracking_events_attempt_order FOREIGN KEY (order_id, attempt_id) REFERENCES transport_attempts (order_id, attempt_id) ON DELETE RESTRICT;
ALTER TABLE tracking_events ADD CONSTRAINT fk_tracking_events_correction_order FOREIGN KEY (order_id, corrects_event_id) REFERENCES tracking_events (order_id, event_id) ON DELETE RESTRICT;
ALTER TABLE transport_attempts ADD CONSTRAINT fk_transport_attempts_leg_order FOREIGN KEY (order_id, leg_id) REFERENCES order_legs (order_id, leg_id) ON DELETE RESTRICT;
ALTER TABLE transport_attempts ADD CONSTRAINT fk_transport_attempts_waybill_order FOREIGN KEY (order_id, waybill_id) REFERENCES waybills (order_id, waybill_id) ON DELETE RESTRICT;
ALTER TABLE transport_attempts ADD CONSTRAINT fk_transport_attempts_request_order FOREIGN KEY (order_id, trigger_request_id) REFERENCES order_requests (order_id, request_id) ON DELETE RESTRICT;

ALTER TABLE handovers ADD CONSTRAINT fk_handovers_from_leg_order FOREIGN KEY (order_id, from_leg_id) REFERENCES order_legs (order_id, leg_id) ON DELETE RESTRICT;
ALTER TABLE handovers ADD CONSTRAINT fk_handovers_to_leg_order FOREIGN KEY (order_id, to_leg_id) REFERENCES order_legs (order_id, leg_id) ON DELETE RESTRICT;
ALTER TABLE handover_attempts ADD CONSTRAINT fk_handover_attempts_handover_order FOREIGN KEY (order_id, handover_id) REFERENCES handovers (order_id, handover_id) ON DELETE RESTRICT;
ALTER TABLE handover_attempts ADD CONSTRAINT fk_handover_attempts_request_order FOREIGN KEY (order_id, trigger_request_id) REFERENCES order_requests (order_id, request_id) ON DELETE RESTRICT;
ALTER TABLE handover_attempts ADD CONSTRAINT fk_handover_attempts_from_waybill_order FOREIGN KEY (order_id, from_waybill_id) REFERENCES waybills (order_id, waybill_id) ON DELETE RESTRICT;
ALTER TABLE handover_attempts ADD CONSTRAINT fk_handover_attempts_to_waybill_order FOREIGN KEY (order_id, to_waybill_id) REFERENCES waybills (order_id, waybill_id) ON DELETE RESTRICT;

ALTER TABLE operational_assignments ADD CONSTRAINT fk_assignments_leg_order FOREIGN KEY (order_id, leg_id) REFERENCES order_legs (order_id, leg_id) ON DELETE RESTRICT;
ALTER TABLE operational_assignments ADD CONSTRAINT fk_assignments_waybill_order FOREIGN KEY (order_id, waybill_id) REFERENCES waybills (order_id, waybill_id) ON DELETE RESTRICT;
ALTER TABLE operational_assignments ADD CONSTRAINT fk_assignments_attempt_order FOREIGN KEY (order_id, attempt_id) REFERENCES transport_attempts (order_id, attempt_id) ON DELETE RESTRICT;
ALTER TABLE operational_assignments ADD CONSTRAINT fk_assignments_handover_order FOREIGN KEY (order_id, handover_id) REFERENCES handovers (order_id, handover_id) ON DELETE RESTRICT;
ALTER TABLE operational_assignments ADD CONSTRAINT fk_assignments_handover_attempt_order FOREIGN KEY (order_id, handover_attempt_id) REFERENCES handover_attempts (order_id, handover_attempt_id) ON DELETE RESTRICT;

ALTER TABLE order_results ADD CONSTRAINT fk_order_results_leg_order FOREIGN KEY (order_id, leg_id) REFERENCES order_legs (order_id, leg_id) ON DELETE RESTRICT;
ALTER TABLE order_results ADD CONSTRAINT fk_order_results_waybill_order FOREIGN KEY (order_id, waybill_id) REFERENCES waybills (order_id, waybill_id) ON DELETE RESTRICT;
ALTER TABLE order_results ADD CONSTRAINT fk_order_results_attempt_order FOREIGN KEY (order_id, attempt_id) REFERENCES transport_attempts (order_id, attempt_id) ON DELETE RESTRICT;
ALTER TABLE order_results ADD CONSTRAINT fk_order_results_request_order FOREIGN KEY (order_id, request_id) REFERENCES order_requests (order_id, request_id) ON DELETE RESTRICT;
ALTER TABLE result_items ADD CONSTRAINT fk_result_items_result_order FOREIGN KEY (order_id, result_id) REFERENCES order_results (order_id, result_id) ON DELETE RESTRICT;
ALTER TABLE result_items ADD CONSTRAINT fk_result_items_item_order FOREIGN KEY (order_id, item_id) REFERENCES order_items (order_id, item_id) ON DELETE RESTRICT;
ALTER TABLE result_items ADD CONSTRAINT fk_result_items_request_order FOREIGN KEY (order_id, request_id) REFERENCES order_requests (order_id, request_id) ON DELETE RESTRICT;
ALTER TABLE result_items ADD CONSTRAINT fk_result_items_request_item_order FOREIGN KEY (order_id, request_item_id) REFERENCES request_items (order_id, request_item_id) ON DELETE RESTRICT;

ALTER TABLE order_status_history ADD CONSTRAINT fk_status_history_event_order FOREIGN KEY (order_id, tracking_event_id) REFERENCES tracking_events (order_id, event_id) ON DELETE RESTRICT;
ALTER TABLE order_status_history ADD CONSTRAINT fk_status_history_request_order FOREIGN KEY (order_id, request_id) REFERENCES order_requests (order_id, request_id) ON DELETE RESTRICT;
ALTER TABLE request_targets ADD CONSTRAINT fk_request_targets_request_order FOREIGN KEY (order_id, request_id) REFERENCES order_requests (order_id, request_id) ON DELETE RESTRICT;
ALTER TABLE request_items ADD CONSTRAINT fk_request_items_request_order FOREIGN KEY (order_id, request_id) REFERENCES order_requests (order_id, request_id) ON DELETE RESTRICT;
ALTER TABLE request_items ADD CONSTRAINT fk_request_items_item_order FOREIGN KEY (order_id, item_id) REFERENCES order_items (order_id, item_id) ON DELETE RESTRICT;
ALTER TABLE request_steps ADD CONSTRAINT fk_request_steps_request_order FOREIGN KEY (order_id, request_id) REFERENCES order_requests (order_id, request_id) ON DELETE RESTRICT;
ALTER TABLE request_steps ADD CONSTRAINT fk_request_steps_target_order FOREIGN KEY (order_id, request_target_id) REFERENCES request_targets (order_id, request_target_id) ON DELETE RESTRICT;
ALTER TABLE request_steps ADD CONSTRAINT fk_request_steps_waybill_order FOREIGN KEY (order_id, result_waybill_id) REFERENCES waybills (order_id, waybill_id) ON DELETE RESTRICT;

ALTER TABLE order_adjustments ADD CONSTRAINT fk_adjustments_request_order FOREIGN KEY (order_id, request_id) REFERENCES order_requests (order_id, request_id) ON DELETE RESTRICT;
ALTER TABLE order_adjustments ADD CONSTRAINT fk_adjustments_external_ref_order FOREIGN KEY (order_id, external_ref_id) REFERENCES external_refs (order_id, external_ref_id) ON DELETE RESTRICT;
ALTER TABLE order_adjustments ADD CONSTRAINT fk_adjustments_leg_order FOREIGN KEY (order_id, leg_id) REFERENCES order_legs (order_id, leg_id) ON DELETE RESTRICT;
ALTER TABLE order_adjustments ADD CONSTRAINT fk_adjustments_waybill_order FOREIGN KEY (order_id, waybill_id) REFERENCES waybills (order_id, waybill_id) ON DELETE RESTRICT;
ALTER TABLE order_images ADD CONSTRAINT fk_order_images_leg_order FOREIGN KEY (order_id, leg_id) REFERENCES order_legs (order_id, leg_id) ON DELETE RESTRICT;
ALTER TABLE order_images ADD CONSTRAINT fk_order_images_waybill_order FOREIGN KEY (order_id, waybill_id) REFERENCES waybills (order_id, waybill_id) ON DELETE RESTRICT;
ALTER TABLE order_images ADD CONSTRAINT fk_order_images_attempt_order FOREIGN KEY (order_id, attempt_id) REFERENCES transport_attempts (order_id, attempt_id) ON DELETE RESTRICT;
ALTER TABLE order_images ADD CONSTRAINT fk_order_images_result_order FOREIGN KEY (order_id, result_id) REFERENCES order_results (order_id, result_id) ON DELETE RESTRICT;
ALTER TABLE external_refs ADD CONSTRAINT fk_external_refs_parent_order FOREIGN KEY (order_id, parent_external_ref_id) REFERENCES external_refs (order_id, external_ref_id) ON DELETE RESTRICT;
ALTER TABLE external_refs ADD CONSTRAINT fk_external_refs_leg_order FOREIGN KEY (order_id, leg_id) REFERENCES order_legs (order_id, leg_id) ON DELETE RESTRICT;
ALTER TABLE external_refs ADD CONSTRAINT fk_external_refs_waybill_order FOREIGN KEY (order_id, waybill_id) REFERENCES waybills (order_id, waybill_id) ON DELETE RESTRICT;
ALTER TABLE waybill_slas ADD CONSTRAINT fk_waybill_slas_waybill_order FOREIGN KEY (order_id, waybill_id) REFERENCES waybills (order_id, waybill_id) ON DELETE RESTRICT;

CREATE INDEX idx_order_statuses_group_active ON order_statuses (status_group, is_active, sort_no);
CREATE UNIQUE INDEX uq_orders_order_code ON orders (order_code);
CREATE INDEX idx_orders_shop_created ON orders (shop_id, created_at DESC);
CREATE INDEX idx_orders_shop_status ON orders (shop_id, status_code, updated_at DESC);
CREATE INDEX idx_orders_soc ON orders (shop_id, soc) WHERE soc IS NOT NULL;
CREATE INDEX idx_orders_current_leg ON orders (current_leg_id) WHERE current_leg_id IS NOT NULL;
CREATE INDEX idx_orders_transport_model ON orders (customer_model, transport_model, selection_mode, created_at DESC);
CREATE INDEX idx_orders_configuration_decision ON orders (configuration_decision_ref);
CREATE INDEX idx_orders_created_identity ON orders (created_by_identity_id, created_at DESC) WHERE created_by_identity_id IS NOT NULL;
CREATE INDEX idx_orders_created_membership ON orders (created_by_membership_id, created_at DESC) WHERE created_by_membership_id IS NOT NULL;
CREATE INDEX idx_orders_correlation ON orders (correlation_id);
CREATE INDEX idx_order_addresses_order_type_current ON order_addresses (order_id, address_type, valid_to);
CREATE INDEX idx_order_addresses_source ON order_addresses (source_type, source_code) WHERE source_code IS NOT NULL;
CREATE INDEX idx_order_addresses_area ON order_addresses (province_code, district_code, commune_code) WHERE valid_to IS NULL;
CREATE INDEX idx_order_parties_order_type_current ON order_parties (order_id, party_type, valid_to);
CREATE INDEX idx_order_goods_order_current ON order_goods (order_id, valid_to);
CREATE INDEX idx_order_items_goods ON order_items (goods_id);
CREATE INDEX idx_order_items_order_item_code ON order_items (order_id, item_code);
CREATE INDEX idx_parcel_measures_order_time ON parcel_measures (order_id, measured_at DESC);
CREATE INDEX idx_parcel_measures_waybill_time ON parcel_measures (waybill_id, measured_at DESC) WHERE waybill_id IS NOT NULL;
CREATE INDEX idx_parcel_measures_leg_time ON parcel_measures (leg_id, measured_at DESC) WHERE leg_id IS NOT NULL;
CREATE INDEX idx_parcel_measures_carrier_time ON parcel_measures (carrier_code, measured_at DESC) WHERE carrier_code IS NOT NULL;
CREATE UNIQUE INDEX uq_order_legs_order_stage_code ON order_legs (order_id, stage_code);
CREATE UNIQUE INDEX uq_order_legs_order_stage_no ON order_legs (order_id, stage_no);
CREATE INDEX idx_order_legs_carrier_status ON order_legs (carrier_code, stage_status_code) WHERE carrier_code IS NOT NULL;
CREATE INDEX idx_leg_endpoints_leg_history ON leg_endpoints (leg_id, endpoint_role, valid_from DESC);
CREATE INDEX idx_leg_items_item ON leg_items (item_id, leg_id);
CREATE UNIQUE INDEX uq_leg_services_leg_version ON leg_services (leg_id, version_no);
CREATE UNIQUE INDEX uq_leg_services_leg_current ON leg_services (leg_id) WHERE valid_to IS NULL;
CREATE UNIQUE INDEX uq_leg_services_order_leg_service ON leg_services (order_id, leg_id, leg_service_id);
CREATE INDEX idx_waybills_order_created ON waybills (order_id, created_at DESC);
CREATE INDEX idx_waybills_carrier_code ON waybills (carrier_code, carrier_waybill_code);
CREATE INDEX idx_waybills_carrier_status ON waybills (carrier_code, carrier_status_code, carrier_status_at DESC) WHERE carrier_status_code IS NOT NULL;
CREATE INDEX idx_leg_waybills_leg_active ON leg_waybills (leg_id, active_to);
CREATE UNIQUE INDEX uq_leg_waybills_leg_sequence ON leg_waybills (leg_id, sequence_no);
CREATE INDEX idx_leg_waybills_waybill ON leg_waybills (waybill_id, active_from DESC);
CREATE UNIQUE INDEX uq_tracking_order_sequence ON tracking_events (order_id, order_sequence_no);
CREATE UNIQUE INDEX uq_tracking_leg_sequence ON tracking_events (leg_id, leg_sequence_no) WHERE leg_id IS NOT NULL;
CREATE INDEX idx_tracking_order_time ON tracking_events (order_id, occurred_at DESC, order_sequence_no DESC);
CREATE INDEX idx_tracking_leg_time ON tracking_events (leg_id, occurred_at DESC, leg_sequence_no DESC) WHERE leg_id IS NOT NULL;
CREATE INDEX idx_tracking_waybill_time ON tracking_events (waybill_id, occurred_at DESC) WHERE waybill_id IS NOT NULL;
CREATE INDEX idx_transport_attempts_order_started ON transport_attempts (order_id, started_at DESC);
CREATE INDEX idx_transport_attempts_leg_type_no ON transport_attempts (leg_id, attempt_type, attempt_no DESC);
CREATE INDEX idx_handovers_order_created ON handovers (order_id, created_at DESC);
CREATE UNIQUE INDEX uq_handovers_from_to ON handovers (from_leg_id, to_leg_id);
CREATE INDEX idx_handover_attempts_handover_no ON handover_attempts (handover_id, attempt_no DESC);
CREATE INDEX idx_assignments_order_current ON operational_assignments (order_id, valid_to) WHERE valid_to IS NULL;
CREATE UNIQUE INDEX uq_assignments_leg_role_current ON operational_assignments (leg_id, role_type) WHERE valid_to IS NULL;
CREATE INDEX idx_assignments_leg_history ON operational_assignments (leg_id, role_type, valid_from DESC);
CREATE UNIQUE INDEX uq_assignments_order_no ON operational_assignments (order_id, assignment_no);
CREATE INDEX idx_order_results_order_type ON order_results (order_id, result_type, occurred_at DESC);
CREATE INDEX idx_result_items_item ON result_items (item_id, result_id);
CREATE INDEX idx_result_items_request ON result_items (request_id, request_item_id) WHERE request_id IS NOT NULL;
CREATE INDEX idx_order_status_history_order_time ON order_status_history (order_id, changed_at DESC, version_no DESC);
CREATE INDEX idx_order_status_history_status ON order_status_history (status_code, changed_at DESC);
CREATE INDEX idx_order_requests_order_type_status ON order_requests (order_id, request_type, request_status, requested_at DESC);
CREATE INDEX idx_order_requests_correlation ON order_requests (correlation_id);
CREATE INDEX idx_request_targets_request ON request_targets (request_id);
CREATE INDEX idx_request_targets_leg ON request_targets (leg_id) WHERE leg_id IS NOT NULL;
CREATE INDEX idx_request_targets_waybill ON request_targets (waybill_id) WHERE waybill_id IS NOT NULL;
CREATE INDEX idx_request_items_request ON request_items (request_id);
CREATE INDEX idx_request_items_item ON request_items (item_id);
CREATE INDEX idx_request_steps_status_retry ON request_steps (step_status, next_retry_at) WHERE step_status IN ('PENDING','FAILED','UNKNOWN');
CREATE INDEX idx_request_steps_request ON request_steps (request_id, step_no);
CREATE INDEX idx_request_steps_waybill_creation ON request_steps (order_id, step_status, updated_at DESC) WHERE step_type = 'CREATE_WAYBILL';
CREATE INDEX idx_request_steps_result_waybill ON request_steps (result_waybill_id) WHERE result_waybill_id IS NOT NULL;
CREATE INDEX idx_adjustments_order_time ON order_adjustments (order_id, applied_at DESC);
CREATE INDEX idx_adjustments_request ON order_adjustments (request_id) WHERE request_id IS NOT NULL;
CREATE INDEX idx_adjustments_external_ref ON order_adjustments (external_ref_id) WHERE external_ref_id IS NOT NULL;
CREATE UNIQUE INDEX uq_order_notes_note_code ON order_notes (note_code);
CREATE INDEX idx_order_notes_order_time ON order_notes (order_id, created_at DESC);
CREATE INDEX idx_order_notes_order_type ON order_notes (order_id, note_type, created_at DESC);
CREATE INDEX idx_activity_logs_order_time ON activity_logs (order_id, occurred_at DESC, sequence_no DESC);
CREATE INDEX idx_activity_logs_order_group ON activity_logs (order_id, activity_group, occurred_at DESC);
CREATE INDEX idx_activity_logs_correlation ON activity_logs (correlation_id) WHERE correlation_id IS NOT NULL;
CREATE UNIQUE INDEX uq_order_images_image_code ON order_images (image_code);
CREATE INDEX idx_order_images_order_status_time ON order_images (order_id, status, created_at DESC);
CREATE INDEX idx_order_images_leg ON order_images (leg_id, created_at DESC) WHERE leg_id IS NOT NULL;
CREATE INDEX idx_order_images_waybill ON order_images (waybill_id) WHERE waybill_id IS NOT NULL;
CREATE INDEX idx_order_images_attempt ON order_images (attempt_id, created_at DESC) WHERE attempt_id IS NOT NULL;
CREATE INDEX idx_order_images_result ON order_images (result_id, created_at DESC) WHERE result_id IS NOT NULL;
CREATE INDEX idx_external_refs_order_type ON external_refs (order_id, ref_type);
CREATE INDEX idx_external_refs_external ON external_refs (module_code, ref_type, external_id);
CREATE UNIQUE INDEX uq_order_batches_batch_code ON order_batches (batch_code);
CREATE INDEX idx_order_batches_shop_created ON order_batches (shop_id, created_at DESC);
CREATE INDEX idx_order_batches_status_updated ON order_batches (status, updated_at DESC);
CREATE INDEX idx_batch_items_batch_status ON batch_items (batch_id, status, row_number);
CREATE INDEX idx_batch_items_worker ON batch_items (status, available_at, claim_until);
CREATE INDEX idx_batch_items_order ON batch_items (order_id) WHERE order_id IS NOT NULL;
CREATE INDEX idx_batch_items_soc ON batch_items (batch_id, soc) WHERE soc IS NOT NULL;
CREATE INDEX idx_batch_attempts_item_no ON batch_item_attempts (batch_item_id, attempt_no DESC);
CREATE UNIQUE INDEX uq_order_slas_order ON order_slas (order_id);
CREATE INDEX idx_order_slas_result_expected ON order_slas (result, expected_to) WHERE is_applicable = true;
CREATE UNIQUE INDEX uq_waybill_slas_waybill ON waybill_slas (waybill_id);
CREATE INDEX idx_waybill_slas_carrier_result ON waybill_slas (carrier_code, result, expected_to);
CREATE INDEX idx_idempotency_expiry ON idempotency_records (expires_at);
CREATE INDEX idx_idempotency_status_lease ON idempotency_records (status, lease_until);
CREATE INDEX idx_outbox_status_available ON outbox_events (status, available_at);
CREATE INDEX idx_outbox_claim ON outbox_events (status, claim_until);
CREATE INDEX idx_outbox_dead_letter ON outbox_events (dead_lettered_at DESC) WHERE status = 5;
CREATE INDEX idx_outbox_order_created ON outbox_events (order_id, created_at DESC) WHERE order_id IS NOT NULL;

COMMIT;

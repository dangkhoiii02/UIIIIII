\set ON_ERROR_STOP on

BEGIN;

\ir reference_data/order_statuses.sql

COMMIT;

\ir validate_reference.sql

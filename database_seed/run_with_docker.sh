#!/usr/bin/env bash
set -euo pipefail

seed_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
db_container="${ORDER_DB_CONTAINER:-order-local-postgres-1}"
db_name="${ORDER_DB_NAME:-supership-superplatform-order-db}"
db_user="${ORDER_DB_USER:-order_admin}"

files=(
  "$seed_dir/../database_ddl/order_mgmt_ddl.sql"
  "$seed_dir/reference_data/order_statuses.sql"
  "$seed_dir/validate_reference.sql"
  "$seed_dir/test_data/designer_1/001_order_creating.sql"
  "$seed_dir/test_data/designer_1/002_delivery_success.sql"
  "$seed_dir/test_data/designer_1/003_multi_carrier_delivery.sql"
  "$seed_dir/test_data/designer_1/004_partial_delivery.sql"
  "$seed_dir/test_data/designer_1/005_batch_reliability.sql"
  "$seed_dir/test_data/designer_1/000_verified_carrier_contracts.sql"
  "$seed_dir/test_data/007_direct_carrier_pickup_stage_repair.sql"
  "$seed_dir/test_data/designer_1/validate_batch_01.sql"
  "$seed_dir/test_data/designer_2/001_failure_return_coverage.sql"
  "$seed_dir/test_data/005_ui_projection_completeness.sql"
  "$seed_dir/test_data/005b_instant_driver_allocation_repair.sql"
  "$seed_dir/test_data/006_ui_current_status_showcase.sql"
  "$seed_dir/test_data/004_api_contract_coverage.sql"
  "$seed_dir/test_data/003_financial_projection_coverage.sql"
  "$seed_dir/test_data/008_instant_delivery_active_completed_coverage.sql"
  "$seed_dir/validate_test_data.sql"
)

for sql_file in "${files[@]}"; do
  echo "Applying ${sql_file#$seed_dir/}"
  docker exec -i "$db_container" \
    psql -X -U "$db_user" -d "$db_name" -v ON_ERROR_STOP=1 < "$sql_file"
done

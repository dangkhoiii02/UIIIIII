#!/usr/bin/env bash
set -euo pipefail

seed_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
output_file="$seed_dir/ALL_DATASEED.sql"
canonical_file="$seed_dir/SuperShip - DATASEED MODULE ORDER.sql"
temp_file="$(mktemp "${TMPDIR:-/tmp}/order-dataseed.XXXXXX")"
trap 'rm -f "$temp_file"' EXIT

sources=(
  "reference_data/order_statuses.sql"
  "validate_reference.sql"
  "test_data/designer_1/001_order_creating.sql"
  "test_data/designer_1/002_delivery_success.sql"
  "test_data/designer_1/003_multi_carrier_delivery.sql"
  "test_data/designer_1/004_partial_delivery.sql"
  "test_data/designer_1/005_batch_reliability.sql"
  "test_data/designer_1/000_verified_carrier_contracts.sql"
  "test_data/007_direct_carrier_pickup_stage_repair.sql"
  "test_data/designer_1/validate_batch_01.sql"
  "test_data/designer_2/001_failure_return_coverage.sql"
  "test_data/005_ui_projection_completeness.sql"
  "test_data/005b_instant_driver_allocation_repair.sql"
  "test_data/006_ui_current_status_showcase.sql"
  "test_data/004_api_contract_coverage.sql"
  "test_data/003_financial_projection_coverage.sql"
  "test_data/008_instant_delivery_active_completed_coverage.sql"
  "validate_test_data.sql"
)

{
  printf '%s\n' '-- SuperShip Module Order - consolidated DataSeed'
  printf '%s\n' '-- Pure SQL: no \ir dependencies; execute after database_ddl/order_mgmt_ddl.sql.'
  printf '%s\n\n' '-- Order: reference -> D1 -> D2 -> UI completeness -> API coverage -> finance -> validation.'

  for source in "${sources[@]}"; do
    printf '\n-- ===== SOURCE: %s =====\n' "$source"
    sed '/^\\set ON_ERROR_STOP on$/d' "$seed_dir/$source"
  done
} > "$temp_file"

cp "$temp_file" "$output_file"
cp "$temp_file" "$canonical_file"

printf 'Built %s and %s\n' "$output_file" "$canonical_file"

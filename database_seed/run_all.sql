\set ON_ERROR_STOP on

\ir run_reference.sql
\ir test_data/designer_1/run_batch_01.sql
\ir test_data/designer_2/run_batch_02.sql
\ir test_data/005_ui_projection_completeness.sql
\ir test_data/005b_instant_driver_allocation_repair.sql
\ir test_data/006_ui_current_status_showcase.sql
\ir test_data/004_api_contract_coverage.sql
\ir test_data/003_financial_projection_coverage.sql
\ir test_data/007_direct_carrier_pickup_stage_repair.sql
\ir test_data/008_instant_delivery_active_completed_coverage.sql
\ir validate_test_data.sql

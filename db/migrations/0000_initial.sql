CREATE TABLE IF NOT EXISTS tenants (
  id text PRIMARY KEY,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agents (
  id text PRIMARY KEY,
  tenant_id text NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  external_key text NOT NULL,
  company_name text NOT NULL,
  status text NOT NULL,
  location text NOT NULL,
  languages text[] NOT NULL,
  supported_services text[] NOT NULL,
  cargo_capability_tags text[] NOT NULL,
  issue_flags text[] NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_coverages (
  id text PRIMARY KEY,
  tenant_id text NOT NULL,
  agent_id text NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  side text NOT NULL,
  country text NOT NULL,
  city text NOT NULL,
  port text NOT NULL,
  transport_mode text NOT NULL,
  service_type text NOT NULL
);

CREATE TABLE IF NOT EXISTS agent_metrics (
  id text PRIMARY KEY,
  tenant_id text NOT NULL,
  agent_id text NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  response_rate integer NOT NULL,
  median_response_minutes integer NOT NULL,
  quote_completeness_rate integer NOT NULL,
  manager_selected_count integer NOT NULL,
  sample_size integer NOT NULL,
  last_observed_at timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS rfq_scenarios (
  id text PRIMARY KEY,
  tenant_id text NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  scenario_key text NOT NULL,
  title text NOT NULL,
  route_label text NOT NULL,
  purpose text[] NOT NULL,
  initial_status text NOT NULL
);

CREATE TABLE IF NOT EXISTS rfq_inputs (
  id text PRIMARY KEY,
  tenant_id text NOT NULL,
  scenario_id text NOT NULL REFERENCES rfq_scenarios(id) ON DELETE CASCADE,
  source_type text NOT NULL,
  raw_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rfq_cases (
  id text PRIMARY KEY,
  tenant_id text NOT NULL,
  scenario_id text NOT NULL REFERENCES rfq_scenarios(id) ON DELETE CASCADE,
  input_id text REFERENCES rfq_inputs(id) ON DELETE SET NULL,
  request_number text NOT NULL,
  source_type text NOT NULL,
  status text NOT NULL,
  origin_country text,
  origin_city text,
  origin_port text,
  destination_country text,
  destination_city text,
  destination_port text,
  container_type text,
  container_quantity integer,
  cargo_description text,
  packaging text,
  gross_weight text,
  volume text,
  incoterms text,
  service_scope text,
  cargo_ready_info text,
  cargo_ready_date text,
  quotation_deadline text,
  response_cutoff text,
  special_requirements text,
  cargo_flags text[] NOT NULL,
  risk_flags text[] NOT NULL,
  manual_review_reason text,
  clarification_draft text,
  selected_rate_option_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rfq_field_assertions (
  id text PRIMARY KEY,
  tenant_id text NOT NULL,
  case_id text NOT NULL REFERENCES rfq_cases(id) ON DELETE CASCADE,
  field_name text NOT NULL,
  value text,
  verification_status text NOT NULL,
  confidence text NOT NULL,
  evidence text NOT NULL,
  source_order integer NOT NULL
);

CREATE TABLE IF NOT EXISTS rfq_rounds (
  id text PRIMARY KEY,
  tenant_id text NOT NULL,
  case_id text NOT NULL REFERENCES rfq_cases(id) ON DELETE CASCADE,
  status text NOT NULL,
  response_cutoff text NOT NULL,
  selected_agent_ids text[] NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS agent_requests (
  id text PRIMARY KEY,
  tenant_id text NOT NULL,
  round_id text NOT NULL REFERENCES rfq_rounds(id) ON DELETE CASCADE,
  case_id text NOT NULL REFERENCES rfq_cases(id) ON DELETE CASCADE,
  agent_id text NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  status text NOT NULL,
  sent_at timestamptz
);

CREATE TABLE IF NOT EXISTS attachments (
  id text PRIMARY KEY,
  tenant_id text NOT NULL,
  storage_bucket text NOT NULL,
  object_key text NOT NULL,
  file_name text NOT NULL,
  mime_type text NOT NULL,
  source_kind text NOT NULL,
  local_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reply_plans (
  id text PRIMARY KEY,
  tenant_id text NOT NULL,
  scenario_id text NOT NULL REFERENCES rfq_scenarios(id) ON DELETE CASCADE,
  case_id text NOT NULL REFERENCES rfq_cases(id) ON DELETE CASCADE,
  agent_id text NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  delay_seconds integer NOT NULL,
  source_type text NOT NULL,
  attachment_id text REFERENCES attachments(id) ON DELETE SET NULL,
  raw_source_reference text NOT NULL,
  behavior text NOT NULL,
  status_after_processing text NOT NULL
);

CREATE TABLE IF NOT EXISTS rate_replies (
  id text PRIMARY KEY,
  tenant_id text NOT NULL,
  case_id text NOT NULL REFERENCES rfq_cases(id) ON DELETE CASCADE,
  agent_id text NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  source_type text NOT NULL,
  raw_text text NOT NULL,
  processing_result text NOT NULL,
  attachment_id text REFERENCES attachments(id) ON DELETE SET NULL,
  received_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS rate_options (
  id text PRIMARY KEY,
  tenant_id text NOT NULL,
  case_id text NOT NULL REFERENCES rfq_cases(id) ON DELETE CASCADE,
  agent_id text NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  reply_id text REFERENCES rate_replies(id) ON DELETE SET NULL,
  source_type text NOT NULL,
  ocean_freight numeric(12,2) NOT NULL,
  currency text NOT NULL,
  rate_unit text NOT NULL,
  origin_charges numeric(12,2) NOT NULL,
  documentation_fee numeric(12,2) NOT NULL,
  destination_charges numeric(12,2) NOT NULL,
  shipping_line text NOT NULL,
  transit_days integer NOT NULL,
  route text NOT NULL,
  validity_date text NOT NULL,
  free_days integer NOT NULL,
  inclusions jsonb NOT NULL,
  exclusions jsonb NOT NULL,
  conditions jsonb NOT NULL,
  known_total numeric(12,2) NOT NULL,
  completeness_score integer NOT NULL,
  review_required boolean NOT NULL,
  status text NOT NULL,
  source_evidence text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quotes (
  id text PRIMARY KEY,
  tenant_id text NOT NULL,
  case_id text NOT NULL REFERENCES rfq_cases(id) ON DELETE CASCADE,
  selected_rate_option_id text NOT NULL,
  current_version integer NOT NULL,
  status text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS quote_versions (
  id text PRIMARY KEY,
  tenant_id text NOT NULL,
  quote_id text NOT NULL REFERENCES quotes(id) ON DELETE CASCADE,
  case_id text NOT NULL REFERENCES rfq_cases(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  selected_rate_option_id text NOT NULL,
  commercial_adjustment numeric(12,2) NOT NULL,
  final_customer_price numeric(12,2) NOT NULL,
  draft_text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS activity_events (
  id text PRIMARY KEY,
  tenant_id text NOT NULL,
  case_id text NOT NULL REFERENCES rfq_cases(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agents_tenant ON agents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cases_tenant_status ON rfq_cases(tenant_id, status);
CREATE INDEX IF NOT EXISTS idx_rate_options_case ON rate_options(case_id);
CREATE INDEX IF NOT EXISTS idx_activity_case ON activity_events(case_id, created_at);

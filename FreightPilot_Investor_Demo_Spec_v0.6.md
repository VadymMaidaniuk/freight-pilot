# FreightPilot — Investor Demo Specification v0.6

> **Working product name:** FreightPilot  
> **Product descriptor:** AI Quote Desk for Freight Forwarders  
> **Document status:** Canonical execution specification  
> **Replaces:** Previous investor-demo specs and Chile-only guided implementation assumptions  
> **Target:** Investor-grade online demo on Vercel, with a reproducible local development environment  
> **Data policy:** All companies, contacts, documents, rates, messages, metrics and files are synthetic.

---

## 1. Product definition

FreightPilot is an AI-powered quote workspace for quotation managers in international freight forwarding.

It supports the workflow:

```text
Customer inquiry from email, chat or call notes
→ structured RFQ
→ clarification of missing or contradictory data
→ agent shortlist
→ human approval of RFQs
→ asynchronous rate collection
→ normalization of rate replies
→ comparison and recommendation
→ customer quote draft
→ late-rate review and quote versioning
```

FreightPilot is **not**:

- a TMS;
- a booking system;
- a shipment-tracking system;
- an email client;
- a carrier-rate database;
- an autonomous pricing engine;
- a system that sends final quotes or chooses suppliers without manager approval.

It is a controlled, explainable decision workspace that reduces manual coordination while keeping the quotation manager responsible for external actions and commercial decisions.

---

## 2. Primary demo goal

Within the first 90 seconds, an investor must understand that FreightPilot can:

1. Turn fragmented customer input into a structured RFQ.
2. Distinguish confirmed, missing and conflicting information without silently inventing facts.
3. Match the request with suitable agents from a permissioned agent network.
4. Normalize replies that arrive at different times and in different formats.
5. Help the manager make a controlled decision before every agent has replied.

The product must feel like a small, real operations system — not a slideshow, a linear wizard, or a Chile-only hardcoded demo.

---

## 3. Core implementation principle: data-driven, not route-driven UI

The product must be driven by structured data and domain services.

### Forbidden implementation pattern

Do **not** place route-specific business logic inside page or React components.

```ts
// Forbidden examples
if (route === "Valparaíso → Gdańsk") return chileAgents;
if (scenario === "hero") showAndesLink();
if (source === "chat") stillRenderEmailPreview();
```

### Required implementation pattern

```text
Synthetic seed data
+ Supabase Postgres records
+ generic RFQ Case model
+ generic agent matching service
+ generic state machine
+ scenario-specific input and reply-plan records
= one reusable quote workspace
```

Hardcoded content is allowed only as seed data, cached Guided Demo results, or synthetic documents. It must not be embedded as decision logic in JSX.

---

## 4. Platform architecture

### 4.1 Production / online investor demo

```text
Vercel
  └─ Next.js application
       ├─ UI routes and Server Components
       ├─ server-side API routes / Server Actions
       ├─ deterministic workflow services
       └─ optional hosted LLM calls for Live Proof

Supabase
  ├─ Postgres: operational data
  ├─ Storage: synthetic Excel files and future attachments
  └─ Auth: not enabled for users in v0.6, but reserved for future use

Hosted LLM
  ├─ OpenRouter: optional Live Proof mode
  └─ LM Studio: local development only
```

### 4.2 Local development

```text
Next.js application
  ├─ npm run dev, or Docker app container
  ├─ local PostgreSQL via Docker Compose
  ├─ Drizzle migrations and seed scripts
  └─ local fixtures / synthetic .xlsx files
```

### 4.3 Deployment policy

- **Vercel** hosts the Next.js demo.
- **Supabase Postgres** is the primary database from day one.
- **Supabase Storage** stores controlled `.xlsx` rate sheets and future uploaded attachments.
- **SQLite is not used as deployed runtime storage.** It is allowed only for isolated local tests if needed.
- **Docker Compose is for local reproducibility, not for Vercel deployment.**

---

## 5. Technology choices

### Required stack

```text
Next.js (App Router)
TypeScript
Tailwind CSS
shadcn/ui
Supabase Postgres
Supabase Storage
Drizzle ORM
Zod
Zustand or React Context
Vitest
Playwright
Docker Compose
```

### AI provider abstraction

```text
AI_PROVIDER=fixture
AI_PROVIDER=claude
AI_PROVIDER=openrouter
AI_PROVIDER=lmstudio
```

Rules:

- `fixture` is the default for Guided Demo.
- `claude` or `openrouter` can power Live Proof on Vercel.
- `lmstudio` is local-development-only. A Vercel deployment cannot reach LM Studio running on a developer’s laptop.
- All AI outputs must pass Zod validation before entering domain logic.

---

## 6. Environments and demo modes

### 6.1 Guided Demo — default investor mode

Purpose: guaranteed, rehearsed investor presentation.

Characteristics:

```text
Deterministic
Uses seeded scenarios and cached extraction/normalization outputs
Uses real database records and real state transitions
Uses simulated asynchronous timings
Does not require a hosted LLM
Works on Vercel as long as the app itself is reachable
```

Guided Demo is not a fake UI. It must write and read normal operational records in the demo tenant, then reset them safely.

### 6.2 Live Proof — optional presenter mode

Purpose: prove that the product is not only scripted.

Supported input:

```text
Pasted customer email
Pasted chat conversation
Pasted call notes
Pasted rate reply
Controlled synthetic .xlsx upload
```

Rules:

- Live Proof is shown after the guided hero-flow or when an investor asks whether the process is scripted.
- It must be clearly labeled as experimental / live extraction.
- It must have safe validation and a graceful fallback.

Fallback message:

```text
Live extraction could not be safely validated.
Demo-safe fallback used.
```

### 6.3 Local Safe Offline mode

Purpose: complete no-network fallback for rehearsals on a developer machine.

Characteristics:

```text
Runs locally
Uses local PostgreSQL or a pre-seeded local database
Uses fixture AI outputs
Uses local synthetic files
No hosted LLM required
```

Do not market Vercel-hosted demo mode as “offline”. Online Vercel deployment still requires a browser connection to Vercel.

---

## 7. Application routes and product shell

### 7.1 Public landing

Route:

```text
/
```

Purpose: concise external entry page.

Required content:

```text
Headline:
Turn freight inquiries into ready-to-send quotes — faster, with full control.

Value areas:
RFQ Intake
Agent Intelligence
Rate Comparison

CTA:
Open Demo Workspace

Disclosure:
Interactive demonstration using synthetic data.
```

Do not add pricing, testimonials, customer logos, blog, fake ROI claims or fake connected integrations.

### 7.2 Workspace

Route:

```text
/workspace
```

The demo opens directly as a seeded `Quotation Manager`. Do not build password login, OAuth or password reset for v0.6.

### 7.3 Navigation

```text
RFQ Inbox
Active Quotes
Approvals
Agent Network
```

Every sidebar item must open a distinct functional view. Do not create navigation items that merely switch visual tabs inside one static mock screen.

### 7.4 Presenter controls

Keep technical demo controls out of the normal manager navigation.

A small presenter-only control may include:

```text
Guided Demo
Live Proof
Reset Workspace
```

---

## 8. Workspace UX model

The core screen is an RFQ Case Workspace, not a multi-step wizard.

```text
┌───────────────────────────────────────────────────────────────┐
│ RFQ-2026-041 · Valparaíso → Gdańsk · Deadline today 16:00     │
│ Status: Collecting rates · 2/3 responses received              │
├────────────────┬─────────────────────────────┬─────────────────┤
│ RFQ details    │ Activity and rate replies   │ Decision panel  │
│                │                             │                 │
│ Route          │ Customer request            │ Missing fields  │
│ Cargo          │ Clarification               │ Next action     │
│ Containers     │ RFQs approved               │ Recommendation  │
│ Dates          │ Agent replies               │ Quote action    │
│ Risks          │ Follow-ups                  │ Quote history   │
└────────────────┴─────────────────────────────┴─────────────────┘
```

The manager must be able to understand at a glance:

- what is known;
- what is missing or risky;
- what has happened;
- what rates have arrived;
- what can be compared;
- what action is recommended next.

Avoid a large `Step 1 → Step 2 → Step 3` visual wizard.

---

## 9. Supabase data design

### 9.1 Tenant-ready design

Even though v0.6 is a single demo workspace, operational tables must include `tenant_id` from day one.

For the demo, all records belong to:

```text
tenant_id = demo_freightpilot
```

This avoids a schema rewrite when real customer tenants and Row Level Security are introduced.

### 9.2 Core tables

```text
tenants
agents
agent_coverages
agent_metrics
rfq_scenarios
rfq_inputs
rfq_cases
rfq_field_assertions
rfq_rounds
agent_requests
reply_plans
rate_replies
rate_options
quotes
quote_versions
activity_events
attachments
```

### 9.3 Minimum entity responsibilities

| Entity | Responsibility |
|---|---|
| `agents` | Company-level fictional agent profile and status. |
| `agent_coverages` | Port, country, route, side and service coverage. |
| `agent_metrics` | Response, completeness and selection history. |
| `rfq_scenarios` | Seeded demo scenario metadata. |
| `rfq_inputs` | Raw email, chat or call-note input. |
| `rfq_cases` | Main operational quote case. |
| `rfq_field_assertions` | Extracted field values, evidence, source order and verification status. |
| `rfq_rounds` | A quote request sent to multiple agents. |
| `agent_requests` | Per-agent RFQ request and response state. |
| `reply_plans` | Guided Demo timing and synthetic replies. |
| `rate_replies` | Raw reply source and processing result. |
| `rate_options` | Normalized/comparable rate data. |
| `quotes` | Customer quote record. |
| `quote_versions` | Quote v1, v2 and manager-controlled revisions. |
| `activity_events` | Chronological operational history. |
| `attachments` | Supabase Storage object metadata. |

### 9.4 Storage buckets

Use Supabase Storage buckets:

```text
synthetic-rate-sheets
live-proof-uploads
```

Rules:

- Seeded `.xlsx` hero files live in `synthetic-rate-sheets`.
- Live Proof uploads go to `live-proof-uploads`.
- Storage objects are private by default.
- Access uses signed URLs generated server-side.
- Do not expose Supabase service role keys to the browser.

---

## 10. Seeded agent network

Seed at least 12 fictional agents.

| Region | Count | Coverage examples |
|---|---:|---|
| China | 5 | Shanghai, Ningbo, Shenzhen |
| Chile | 3 | Valparaíso, San Antonio |
| South Africa | 4 | Durban, Cape Town |

Each agent must include:

```text
id
external_key
company_name
status
location
languages
supported_services
cargo_capability_tags
response_rate
median_response_time
quote_completeness_rate
manager_selected_count
issue_flags
sample_size
last_observed_at
```

Coverage is stored separately:

```text
agent_id
side: origin | destination | route
country
city
port
transport_mode
service_type
```

Example:

```text
Andes Link Freight
- origin / Chile / Valparaíso / ocean_fcl
- origin / Chile / San Antonio / ocean_fcl
```

Do not use an opaque reliability score. Show transparent indicators instead:

```text
Response rate: 94%
Median response time: 35 min
Complete-rate history: 88%
Selected by managers: 14 times
Recent issue flags: none
Observed sample: 31 RFQs
```

---

## 11. Data-driven demo scenarios

All scenarios must use the same RFQ Case model, matching engine, state machine and workspace components.

### 11.1 CL-001 — Hero scenario

```text
Route: Valparaíso, Chile → Gdańsk, Poland
Input source: Email
Cargo: Green coffee beans
Incoterms: FOB
Containers: 2 x 40HC
```

Purpose:

```text
Email extraction
Missing-data clarification
Chile agent matching
Human RFQ approval
Asynchronous replies
Partial comparison
Quote v1
Late Excel rate
Quote v2 decision
```

### 11.2 CN-001 — Chat conflict scenario

```text
Route: Ningbo, China → Hamburg, Germany
Input source: Conversation paste
```

Purpose:

```text
Latest-message resolution
Conflict detection
China agent matching
```

Example:

```text
Message 1: 1 x 40HC
Message 3: Please revise to 2 x 40HC

Resolved value:
2 x 40HC

Status:
Confirmed from latest explicit customer message
```

If two explicit values cannot be resolved by sequence or context:

```text
Conflict detected
Customer confirmation required
```

### 11.3 ZA-001 — Quick capture scenario

```text
Route: Durban, South Africa → Constanța, Romania
Input source: Call notes
```

Purpose:

```text
Manual call-note capture
Missing-field detection
South Africa matching
Clarification draft
```

Example note:

```text
Customer called:
2 x 20DC from Durban to Constanța.
FOB.
Automotive spare parts.
Cargo expected next month.
```

### 11.4 ZA-002 — Manual Review scenario

```text
Route: Cape Town, South Africa → Gdańsk, Poland
Input source: Email
Cargo: Temperature-controlled products
```

Purpose:

```text
Manual Review triggers
Risk retention
Manager override
```

Missing requirements:

```text
Temperature range
Reefer container type
Ventilation requirements
Cargo classification
Cargo-ready date
```

---

## 12. RFQ intake

`New RFQ` provides three real input methods.

### 12.1 Import email

Input: pasted customer email.

System behavior:

```text
Create RFQ input record
Extract RFQ fields
Store source evidence
Detect missing fields
Detect risks
Create clarification draft
```

### 12.2 Paste conversation

Input: Teams, WhatsApp or generic chat conversation.

System behavior:

```text
Create field assertions for statements
Keep source message order / timestamp
Choose latest explicit customer confirmation when safe
Mark unresolved values as Conflict detected
Never silently pick ambiguous values
```

### 12.3 Quick capture

Input: free-form notes after a call or meeting.

System behavior:

```text
Extract available RFQ data
Mark absent fields as Missing
Generate clarification draft
Show supporting source excerpts from the note
```

All three paths must create the same normalized RFQ Case structure.

---

## 13. RFQ field model and validation

Core fields:

```text
request_number
incoterms
origin_country
origin_city
origin_port
destination_country
destination_city
destination_port
container_type
container_quantity
cargo_description
packaging
gross_weight
volume
cargo_ready_date
quotation_deadline
special_requirements
cargo_flags
```

Cargo flags:

```text
dangerous_goods
temperature_controlled
reefer
out_of_gauge
special_handling
```

Each displayed field includes:

```text
Value
Verification status
Confidence level
Source evidence
```

Verification statuses:

```text
Confirmed
Needs confirmation
Missing
Conflict detected
```

Confidence levels:

```text
High
Medium
Low
```

Confidence must remain secondary information. The primary operational message is the verification status and next action.

---

## 14. Field rules and Manual Review

### 14.1 Required to send RFQ

These block agent RFQ generation:

```text
Origin
Destination
Container type
Container quantity
Cargo description
Service scope
Sufficient cargo-ready information
Basic Incoterm interpretation
```

### 14.2 Required to create customer quote

These block quote creation:

```text
Selected rate
Currency
Known or explicitly excluded major charges
Validity
Commercial adjustment
Conditions and exclusions
```

### 14.3 Useful but non-blocking

```text
Preferred shipping line
Preferred transit time
Optional customer comments
Non-critical documentation preferences
```

### 14.4 Manual Review triggers

```text
reefer
temperature-controlled cargo
dangerous goods
unknown container type
unclear Incoterm
missing origin or destination
critical contradiction
multimodal route
complex transshipment
unsupported document source
low-confidence critical extraction
```

Manual Review screen:

```text
Manual review required

Reason:
This RFQ requires operational validation before agent requests can be sent.

Required actions:
- confirm cargo requirements;
- verify service scope;
- resolve critical data conflicts;
- approve continuation manually.
```

A manager may override and continue, but the case keeps its risk flags and override event in the activity history.

---

## 15. Deterministic agent matching

### 15.1 LLM responsibilities

```text
Extract RFQ data
Detect missing and conflicting data
Generate clarification drafts
Generate RFQ drafts
Normalize free-text rate replies
Draft customer quote text
Explain outcomes in plain language
```

### 15.2 Code responsibilities

```text
Agent eligibility
Coverage filtering
Cargo/service filtering
Ranking
Issue penalties
Manual review triggers
Workflow state transitions
Known totals
Commercial adjustment
Final price
Recommendation ranking
```

### 15.3 Eligibility

```text
Agent is active
AND supports ocean_fcl
AND has relevant origin, destination or route coverage
AND has no hard exclusion for cargo or route
```

### 15.4 Ranking factors

Suggested configurable scoring:

```text
Coverage match:              +40
Service/cargo capability:    +20
Response speed:              +15
Quote completeness history:  +15
Recent activity:             +5
Manager-selected history:    +5
Recent issue flag:           -20
```

The system returns five candidates. The manager selects three for the RFQ Round.

Incoterms influence service scope and matching bias, but do not independently determine the selected agent.

---

## 16. RFQ Round and asynchronous state machine

The state machine must live in a domain service, not in React boolean flags.

### 16.1 RFQ Case states

```text
draft
clarification_required
ready_for_routing
approval_pending
collecting
decision_ready
quote_draft_created
closed
manual_review
```

### 16.2 RFQ Round states

```text
draft
sent
collecting
enough_responses
deadline_reached
quote_draft_created
closed
```

### 16.3 Agent request states

```text
Draft
Sent
Awaiting response
Rate received
Incomplete rate
Clarification requested
Declined
Overdue
Late response
```

The workspace must show:

```text
Customer quotation deadline
Response cutoff
Requests sent
Responses received
Comparable rates
Incomplete rates
Overdue agents
Recommended next action
```

The manager must never be forced to wait for every reply.

---

## 17. Reply plans and asynchronous demo behavior

Reply timing is simulated but data-driven.

A `reply_plan` record includes:

```text
scenario_id
agent_id
delay_seconds
source_type
attachment_id (optional)
raw_source_reference
behavior
status_after_processing
```

### CL-001 reply plan

| Agent | Delay | Source | Expected result |
|---|---:|---|---|
| Andes Link Freight | 10 sec | Structured email body | Complete, comparable rate |
| Pacific Axis Logistics | 25 sec | Messy free-text reply | Incomplete rate, follow-up needed |
| Southern Gate Forwarding | 75 sec | Synthetic `.xlsx` rate sheet | Late rate after Quote v1 |

Show a visible note:

```text
Demo timeline accelerated
```

The decision panel must allow a provisional quote before the last reply arrives.

---

## 18. Rate ingestion and normalization

### 18.1 Supported Guided Demo inputs

```text
Structured email body
Messy plain-text reply
Manual copy-paste
Synthetic Excel rate sheet
```

### 18.2 Delayed Excel rate

The Chile late reply must use a real synthetic `.xlsx` file.

Ingestion path:

```text
Load file from Supabase Storage or local fixture
→ read workbook
→ convert selected sheet to text/table representation
→ normalize into RateOption
→ validate with Zod
→ calculate totals in code
```

Safe mode may use a cached normalized result when live parsing is unavailable, but the visible activity timeline must still represent it as an Excel-originated rate.

### 18.3 Live Proof support

```text
Pasted email
Pasted chat
Pasted call notes
Pasted rate reply
Controlled .xlsx upload
```

For uploads:

1. Server creates a signed upload path.
2. Browser uploads directly to Supabase Storage.
3. Server reads the object by signed URL or server-side storage client.
4. Normalization result is validated with Zod.

This avoids routing larger file contents through Vercel request bodies.

### 18.4 Explicitly out of scope

```text
OCR
Scanned PDF
Image-only PDF
Complex multi-sheet carrier rate books
External rate databases
Carrier APIs
```

Unsupported source response:

```text
Manual review required

This source cannot be confidently normalized in the current demo workflow.
```

---

## 19. Rate comparison and recommendation

Normalized `RateOption` fields:

```text
agent_id
source_type
ocean_freight
currency
rate_unit
origin_charges
documentation_fee
destination_charges
shipping_line
transit_days
route
validity_date
free_days
inclusions
exclusions
conditions
known_total
completeness_score
review_required
source_evidence
```

Comparison columns:

```text
Agent
Known total
Currency
Completeness
Transit time
Free days
Validity
Major exclusions
Response speed
Issue flags
Recommendation status
```

Statuses:

```text
Recommended
Comparable
Needs review
Incomplete
Late response
Not selected
```

Recommendation logic is deterministic and transparent. It must never mean “lowest number wins.”

Example output:

```text
Recommended: Andes Link Freight

Why:
- Lowest comparable known total;
- Major charges disclosed;
- Transit time meets customer preference;
- Validity covers the customer deadline;
- Includes 14 free days;
- Strong response history.
```

---

## 20. Customer quote and versioning

A customer quote draft is created only after the manager selects a rate manually.

Quote content:

```text
Route
Container type and quantity
Cargo summary
Selected freight option
Transit time
Free days
Validity
Inclusions
Exclusions
Conditions
Editable commercial adjustment
Final customer price
Disclaimer
```

Formula:

```text
Final customer price = known total + commercial adjustment
```

All totals and prices are calculated by code. The LLM must never invent or calculate final pricing.

Quote status:

```text
Draft — commercial approval required
```

When a late rate arrives after Quote v1:

```text
New rate received after Quote v1

Potential improvement:
-$320 compared with current selected option

Actions:
Review rate
Create Quote v2
Dismiss
```

Quote v1 must never change automatically.

---

## 21. Functional product views

### 21.1 RFQ Inbox

A live list of seeded RFQ Cases.

| RFQ | Route | Source | Deadline | Status |
|---|---|---|---|---|
| CL-001 | Valparaíso → Gdańsk | Email | Today 16:00 | Collecting rates |
| CN-001 | Ningbo → Hamburg | Chat | Tomorrow | Needs clarification |
| ZA-001 | Durban → Constanța | Call notes | Friday | Ready for routing |
| ZA-002 | Cape Town → Gdańsk | Email | Pending | Manual review |

### 21.2 Approvals

Shows actual RFQ drafts awaiting manager action.

```text
Review
Edit
Approve & simulate sending
```

### 21.3 Active Quotes

Shows:

```text
Quote v1
Quote v2
Late-rate alerts
Selected rate
Current quote status
```

### 21.4 Agent Network

Read-only but functional seeded directory.

Capabilities:

```text
Filter by country
Filter by port
Filter by service
Open agent profile
View coverage and metrics
```

---

## 22. AI service contract

```ts
interface AIService {
  extractRFQ(input: {
    sourceType: "email" | "conversation" | "call_notes";
    rawText: string;
  }): Promise<RFQExtraction>;

  normalizeRateReply(input: {
    rawText: string;
    sourceType: "email" | "messy_text" | "xlsx";
  }): Promise<RateExtraction>;

  generateClarificationDraft(rfqCaseId: string): Promise<string>;
  generateRFQDraft(rfqCaseId: string, agentId: string): Promise<string>;
  generateCustomerQuoteDraft(quoteId: string): Promise<string>;
}
```

All responses must pass Zod validation before persistence.

Invalid output behavior:

```text
Live extraction could not be safely validated.
Demo-safe fallback used.
```

---

## 23. Security and Supabase readiness

### v0.6 demo rules

- No real end-user authentication.
- No real customer data.
- No real contact data.
- No real external email sending.
- Supabase service role key is server-only.
- Browser uses only Supabase anon key, where required.
- Storage objects are private by default.

### Future-ready design

- Every business table includes `tenant_id`.
- Add `user_id` / actor fields where actions will later need auditability.
- Design migrations so RLS can be introduced without schema replacement.
- Do not expose data across tenants when real users are added.

RLS itself may remain disabled for the single demo tenant, but schema and repository boundaries must support enabling it later.

---

## 24. Docker local development

### 24.1 Purpose

Docker provides reproducible local development. It does not replace Vercel deployment.

### 24.2 Required files

```text
Dockerfile
docker-compose.yml
.env.example
db/migrations/
db/seed/
```

### 24.3 Docker Compose services

```text
app        Next.js application
postgres   Local PostgreSQL database
```

Optional later services:

```text
mailhog    Only if email preview testing is needed
minio      Only if local object-storage parity becomes necessary
```

Do not add optional services until the core workflow needs them.

### 24.4 Local commands

```bash
# Start database only; preferred daily development workflow
docker compose up -d postgres
npm install
npm run db:migrate
npm run db:seed
npm run dev

# Fully containerized local run
docker compose up --build
```

---

## 25. Vercel deployment

### 25.1 Deployment model

```text
Git repository
→ Vercel project
→ Preview deployment per branch / pull request
→ Production deployment from main branch
```

### 25.2 Cloud dependencies

```text
Vercel: Next.js deployment
Supabase Postgres: primary data store
Supabase Storage: synthetic .xlsx and controlled uploads
Hosted LLM: only for Live Proof
```

### 25.3 Environment variables

```bash
# Public Supabase configuration
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Server-only Supabase configuration
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=

# AI configuration
AI_PROVIDER=fixture
ANTHROPIC_API_KEY=
OPENROUTER_API_KEY=
LMSTUDIO_BASE_URL=http://127.0.0.1:1234/v1

# Demo configuration
DEMO_TENANT_ID=demo_freightpilot
DEMO_MODE=guided
```

Never commit `.env.local`, Supabase service-role keys or hosted LLM keys.

### 25.4 Seed behavior in cloud

- Database migrations run through a controlled CI/manual migration command, not on every page request.
- Seed data is idempotent.
- A dedicated seed script can restore the demo tenant when needed.
- `Reset Workspace` resets operational case data, not the entire database schema or agent network.

---

## 26. Reset Workspace

A visible `Reset workspace` action is mandatory.

It must reset:

```text
RFQ Case state
Field edits
Agent selections
Approval status
Simulated sends
Async timeline
Received replies
Follow-ups
Rate comparison
Quotes and quote versions
Notifications
```

It must preserve:

```text
Seeded agents
Seeded coverage data
Scenario definitions
System configuration
```

Implementation recommendation:

```text
Delete/recreate operational records for the selected scenario in the demo tenant
from a canonical scenario template.
```

Do not reset the full Supabase database from the browser.

---

## 27. Testing requirements

### 27.1 Unit tests

Must cover:

```text
Chile route returns Chile-capable agents
China route returns China-capable agents
South Africa route returns South Africa-capable agents
Inactive agents are excluded
Coverage mismatch excludes agents
Issue flags apply penalties
Latest chat message resolves explicit field values
Unresolved chat contradictions create Conflict detected
Reefer scenario creates Manual Review
Quote cannot be created without required rate data
Late rate never modifies Quote v1 automatically
Reset restores initial scenario state
```

### 27.2 Integration tests

Must cover:

```text
Seed database loads correctly
Repository layer reads/writes expected records
Reply scheduler advances a scenario correctly
Excel ingestion creates a normalized RateOption
Zod-invalid AI output triggers fallback
```

### 27.3 End-to-end tests

Playwright must cover:

```text
Open CL-001 from RFQ Inbox
Review extracted fields
Process clarification reply
Select agents
Approve and simulate RFQs
Receive first and second replies
Create Quote v1 before third reply
Receive late Excel rate
Review and create Quote v2
Reset workspace
Open CN-001 and verify chat conflict handling
Open ZA-002 and verify Manual Review
```

---

## 28. Acceptance criteria

The prototype is complete when:

1. It launches locally with one documented command sequence.
2. It deploys to Vercel without using SQLite as runtime storage.
3. Supabase Postgres is the primary database.
4. Supabase Storage holds synthetic Excel rate sheets and controlled uploads.
5. It has a polished landing page and direct workspace entry.
6. It includes at least 12 synthetic agents across China, Chile and South Africa.
7. Agent selection is calculated from coverage and metrics in the database.
8. No route-specific business logic is embedded in React UI components.
9. Email, chat and call-note intake create different real payloads.
10. Chat intake supports latest-message resolution and conflict detection.
11. Quick capture creates missing-data and clarification behavior.
12. Temperature-controlled cargo triggers Manual Review.
13. Chile hero-flow reaches Quote v1 and a late-rate Quote v2 decision.
14. The delayed Chile reply is a real synthetic `.xlsx` file.
15. Async workflow states use a domain state machine.
16. A provisional quote can be created before every agent replies.
17. A late rate never modifies an existing quote automatically.
18. Totals, commercial adjustment, final price and ranking are deterministic code-driven calculations.
19. LLM output is validated with Zod.
20. Guided Demo does not require a hosted LLM.
21. Live Proof supports pasted text and controlled `.xlsx` upload when configured.
22. Reset Workspace fully restores a selected demo scenario.
23. RFQ Inbox, Approvals, Active Quotes and Agent Network are distinct functional views.
24. No real company data, contacts, rates, emails or integrations are included.
25. Typecheck, lint, unit tests, E2E smoke tests and production build pass.

---

## 29. Delivery order

### Phase 1 — Platform and data foundation

```text
Supabase project
Postgres schema
Drizzle migrations
Seed script
Docker Compose with local Postgres
Repository layer
Tenant-ready table structure
```

### Phase 2 — Refactor current guided prototype

```text
Move fixture data from UI into repositories
Generic RFQ Case model
Generic agent matching
Generic async state machine
Reset Workspace
```

### Phase 3 — Scenario realism

```text
Email scenario
Chat conflict scenario
Call-note scenario
Manual Review scenario
Inbox and operational views
```

### Phase 4 — Quote flow

```text
Approvals
RFQ Round
Reply scheduler
Complete and incomplete replies
Synthetic Excel late reply
Comparison
Quote v1 and Quote v2
```

### Phase 5 — Vercel and Live Proof

```text
Supabase Storage upload flow
Vercel environment variables
Hosted LLM provider
Zod fallback
Preview deployment
```

### Phase 6 — Investor polish

```text
Landing page
Source evidence UI
Activity timeline
Micro-interactions
Guided Demo rehearsal
Live Proof rehearsal
```

---

## 30. Scope guardrail

The prototype succeeds when it proves one thing exceptionally well:

> FreightPilot turns fragmented incoming freight requests and asynchronous agent replies into a controlled, explainable quote workflow.

Do not add functionality that does not strengthen this proof.

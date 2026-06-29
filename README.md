# FreightPilot

Investor-grade demo for an AI Quote Desk for freight forwarders.

## Local Run

```bash
docker compose up -d postgres
npm install
npm run db:migrate
npm run db:reset
npm run fixtures:xlsx
npm run dev
```

Open:

```text
http://127.0.0.1:3000
http://127.0.0.1:3000/workspace
```

## Environment

Copy `.env.example` to `.env.local` and adjust if needed.

Default local LLM configuration:

```bash
AI_PROVIDER=lmstudio
LMSTUDIO_BASE_URL=http://192.168.50.232:1234/v1
LMSTUDIO_MODEL=google/gemma-4-12b-qat
LMSTUDIO_TIMEOUT_MS=10000
LMSTUDIO_MAX_TOKENS=700
LMSTUDIO_TEMPERATURE=0
LMSTUDIO_TOP_P=0.1
LMSTUDIO_STRUCTURED_OUTPUT=true
```

Guided Demo does not need an LLM. Live Proof uses the configured provider and falls back to validated fixture output if the response cannot pass Zod validation.

If a local reasoning model is slow, prefer:

```bash
LMSTUDIO_TIMEOUT_MS=7000
LMSTUDIO_MAX_TOKENS=500
LMSTUDIO_TEMPERATURE=0
LMSTUDIO_TOP_P=0.1
LMSTUDIO_STRUCTURED_OUTPUT=true
```

Leave `LMSTUDIO_REASONING_EFFORT` empty unless the loaded model/server accepts that parameter. If LM Studio rejects it, the app will fall back after the configured timeout.

## Supabase vs Postgres

Supabase Postgres is PostgreSQL hosted by Supabase. The app uses Drizzle against `DATABASE_URL`, so local development can run a plain Docker Postgres, while Vercel production should point `DATABASE_URL` to Supabase Postgres.

Supabase Storage is represented by attachment metadata and the `synthetic-rate-sheets` bucket convention. The generated local fixture is:

```text
fixtures/synthetic-rate-sheets/southern-gate-late-rate.xlsx
```

## Verification

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run test:e2e
npm audit --omit=dev
```

## User Flow

Open `http://127.0.0.1:3000/workspace/new` or click **New RFQ** in the inbox.

1. Choose Email, Chat / Messenger, or Call notes.
2. Paste synthetic customer input.
3. Click **Create RFQ and match agents**.
4. Review extracted fields, evidence, risks, and the calculated agent shortlist.
5. Click **Approve & simulate sending**.
6. Click **Process simulated replies**.
7. Review normalized rates and create Quote v1.

No real external emails are sent. Simulated sends create internal agent request records and activity events.

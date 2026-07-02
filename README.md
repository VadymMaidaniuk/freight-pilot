# FreightPilot

Демо AI Quote Desk для экспедиторов, подготовленное для показа инвестору.

## Локальный запуск

```bash
docker compose up -d postgres
npm install
npm run db:migrate
npm run db:reset
npm run fixtures:xlsx
npm run dev
```

Открыть:

```text
http://127.0.0.1:3000
http://127.0.0.1:3000/workspace
```

## Окружение

Скопируйте `.env.example` в `.env.local` и при необходимости измените параметры.

Локальная конфигурация LLM по умолчанию:

```bash
AI_PROVIDER=lmstudio
LMSTUDIO_BASE_URL=http://192.168.50.232:1234/v1
LMSTUDIO_MODEL=google/gemma-4-12b-qat
LMSTUDIO_TIMEOUT_MS=60000
LMSTUDIO_MAX_TOKENS=1800
LMSTUDIO_TEMPERATURE=0
LMSTUDIO_TOP_P=0.1
LMSTUDIO_STRUCTURED_OUTPUT=true
```

Для Vercel используйте OpenRouter:

```bash
AI_PROVIDER=openrouter
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=google/gemma-4-26b-a4b-it:free
OPENROUTER_PROVIDER_SLUG=google-ai-studio
OPENROUTER_PROVIDER_ORDER=google-ai-studio
OPENROUTER_PROVIDER_ONLY=google-ai-studio
OPENROUTER_ALLOW_FALLBACKS=false
OPENROUTER_REQUIRE_PARAMETERS=true
OPENROUTER_RESPONSE_FORMAT=json_object
OPENROUTER_TIMEOUT_MS=70000
OPENROUTER_MAX_TOKENS=1800
OPENROUTER_TEMPERATURE=0
OPENROUTER_TOP_P=0.1
OPENROUTER_APP_TITLE=FreightPilot
```

`google-ai-studio` - это provider slug OpenRouter для Google AI Studio. `PROVIDER_ONLY` и `ALLOW_FALLBACKS=false` фиксируют запросы на этом endpoint, а не на Darkbloom.

Управляемое демо не требует LLM. Проверка AI использует настроенного провайдера и откатывается к валидированному результату фикстуры, если ответ не проходит Zod-валидацию.

Если локальная reasoning-модель работает медленно, уменьшайте `LMSTUDIO_MAX_TOKENS`, но оставьте таймаут достаточно высоким:

```bash
LMSTUDIO_TIMEOUT_MS=60000
LMSTUDIO_MAX_TOKENS=1200
LMSTUDIO_TEMPERATURE=0
LMSTUDIO_TOP_P=0.1
LMSTUDIO_STRUCTURED_OUTPUT=true
```

Оставьте `LMSTUDIO_REASONING_EFFORT` пустым, если загруженная модель или сервер не поддерживает этот параметр. Если LM Studio отклонит его, приложение перейдет в резервный режим после настроенного таймаута.

## Supabase vs Postgres

Supabase Postgres - это PostgreSQL, размещенный в Supabase. Приложение использует Drizzle поверх `DATABASE_URL`, поэтому локально можно запускать обычный Docker Postgres, а продакшен на Vercel должен указывать `DATABASE_URL` на Supabase Postgres.

Supabase Storage представлен метаданными вложений и соглашением bucket `synthetic-rate-sheets`. Локально генерируется фикстура:

```text
fixtures/synthetic-rate-sheets/southern-gate-late-rate.xlsx
```

## Проверка

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run test:e2e
npm audit --omit=dev
```

## Инвесторский демо-сценарий

Откройте `http://127.0.0.1:3000/workspace/new` или нажмите **Новый RFQ** во входящих.

1. Покажите, что почта и мессенджеры являются интеграционными каналами: **Проверить почту** / **Проверить мессенджеры**.
2. Вставьте синтетический текст клиента в **Ручная вставка запроса** и нажмите **Создать RFQ из текста**.
3. В кейсе покажите бейдж **LLM extracted**, исходный текст клиента, извлеченные поля, evidence, missing fields и короткий список агентов.
4. Откройте **Черновики RFQ агентам**, затем нажмите **Согласовать и имитировать отправку**.
5. Нажмите **Обработать имитированные ответы** и покажите блок **Raw ответы агентов в normalized rates**: raw text превращается в структурированные ставки.
6. Покажите **Рекомендовано**: LLM нормализует хаос, а система ранжирует ставки проверяемыми правилами.
7. Нажмите **Создать Quote v1** и покажите **Письмо клиенту** - готовый черновик с ценой, условиями, inclusions/exclusions и сроком действия.

`/workspace/live-proof` - техническая проверка LLM и Zod-схемы. Для инвесторского показа основной сценарий идет через `/workspace/new`.

Реальные внешние письма не отправляются. Имитированные отправки создают внутренние записи запросов агентам, события активности и демонстрационные raw replies.

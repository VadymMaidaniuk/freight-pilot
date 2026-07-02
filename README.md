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

## Пользовательский сценарий

Откройте `http://127.0.0.1:3000/workspace/new` или нажмите **Новый RFQ** во входящих.

1. Для почты или мессенджеров нажмите **Проверить почту** / **Проверить мессенджеры**.
2. Для ручного сценария вставьте синтетический текст клиента в **Ручная вставка запроса**.
3. Нажмите **Создать RFQ из текста**.
4. Проверьте извлеченные поля, доказательства, риски и рассчитанный короткий список агентов.
5. Нажмите **Согласовать и имитировать отправку**.
6. Нажмите **Обработать имитированные ответы**.
7. Проверьте нормализованные ставки и создайте Quote v1.

Реальные внешние письма не отправляются. Имитированные отправки создают внутренние записи запросов агентам и события активности.

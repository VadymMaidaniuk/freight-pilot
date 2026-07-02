import { ClipboardPaste, Mail, MessageSquareText, RefreshCw, Send } from "lucide-react";
import { checkIntakeIntegrationAction, createRFQFromInputAction } from "@/app/workspace/actions";
import { Button } from "@/components/ui/button";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";

export const dynamic = "force-dynamic";

const sampleChat = `09:12 Клиент: Нужно Ningbo - Hamburg, 2 x 40HC, электроника.
09:18 Деск: Подтвердите Incoterms и дату готовности груза.
09:24 Клиент: FOB Ningbo. Груз будет готов на следующей неделе. Нужна ставка ocean FCL.`;

const checkedMessages: Record<string, string> = {
  email: "Почтовая интеграция пока не подключена. Здесь будет проверка новых писем с RFQ.",
  messenger: "Интеграция мессенджеров пока не подключена. Здесь будет проверка новых сообщений с RFQ."
};

export default async function NewRFQPage({ searchParams }: { searchParams: Promise<{ error?: string; checked?: string }> }) {
  const params = await searchParams;
  const checkedMessage = params.checked ? checkedMessages[params.checked] : null;

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <p className="text-label-caps uppercase tracking-wide text-primary">Живой ввод</p>
        <h1 className="mt-1 text-display-lg font-semibold text-ink-text">Новый RFQ</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-text">
          Почта и мессенджеры проверяются через интеграции. Для разового запроса вставьте текст клиента вручную.
        </p>
      </div>

      <Panel>
        <PanelHeader title="Интеграции входящих каналов" eyebrow="Проверка новых запросов" />
        <PanelBody className="space-y-4">
          {checkedMessage ? (
            <div className="rounded-md border border-secondary-container bg-secondary-container/30 p-3 text-sm text-on-secondary-container">
              {checkedMessage}
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-md border border-border-hairline bg-surface-container-lowest p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-ink-text">
                    <Mail className="h-4 w-4 text-primary" aria-hidden />
                    Почта
                  </div>
                  <p className="mt-1 text-sm leading-5 text-muted-text">Входящие RFQ из почтового ящика.</p>
                </div>
                <span className="rounded-md bg-secondary-container px-2 py-1 text-xs font-semibold text-on-secondary-container">
                  Интеграция
                </span>
              </div>
              <form action={checkIntakeIntegrationAction} className="mt-4">
                <input type="hidden" name="channel" value="email" />
                <Button type="submit" variant="secondary">
                  <RefreshCw className="h-4 w-4" aria-hidden />
                  Проверить почту
                </Button>
              </form>
            </div>

            <div className="rounded-md border border-border-hairline bg-surface-container-lowest p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 font-semibold text-ink-text">
                    <MessageSquareText className="h-4 w-4 text-primary" aria-hidden />
                    Мессенджеры
                  </div>
                  <p className="mt-1 text-sm leading-5 text-muted-text">Входящие RFQ из подключенных чатов.</p>
                </div>
                <span className="rounded-md bg-secondary-container px-2 py-1 text-xs font-semibold text-on-secondary-container">
                  Интеграция
                </span>
              </div>
              <form action={checkIntakeIntegrationAction} className="mt-4">
                <input type="hidden" name="channel" value="messenger" />
                <Button type="submit" variant="secondary">
                  <RefreshCw className="h-4 w-4" aria-hidden />
                  Проверить мессенджеры
                </Button>
              </form>
            </div>
          </div>
        </PanelBody>
      </Panel>

      <Panel>
        <PanelHeader title="Ручная вставка запроса" eyebrow="Копипаст текста клиента" />
        <PanelBody>
          {params.error === "missing-input" ? (
            <div className="mb-4 rounded-md border border-error/20 bg-error-container p-3 text-sm text-on-error-container">
              Вставьте текст клиента перед созданием RFQ.
            </div>
          ) : null}

          <form action={createRFQFromInputAction} className="space-y-5">
            <input type="hidden" name="sourceType" value="manual_paste" />

            <div className="flex items-center gap-2 text-sm font-semibold text-ink-text">
              <ClipboardPaste className="h-4 w-4 text-primary" aria-hidden />
              Текст запроса клиента
            </div>

            <label className="block text-sm font-semibold text-ink-text">
              <textarea
                name="rawText"
                rows={14}
                className="mt-2 w-full resize-y rounded-md border border-border-hairline bg-white p-4 text-sm leading-6 outline-none focus:border-primary-container"
                defaultValue={sampleChat}
                aria-label="Текст запроса клиента"
              />
            </label>

            <div className="rounded-md border border-secondary-container bg-secondary-container/30 p-4 text-sm leading-6 text-on-secondary-container">
              После создания откройте кейс, проверьте извлеченные поля и короткий список, затем согласуйте имитацию отправки выбранным агентам.
            </div>

            <Button type="submit">
              <Send className="h-4 w-4" aria-hidden />
              Создать RFQ из текста
            </Button>
          </form>
        </PanelBody>
      </Panel>
    </div>
  );
}

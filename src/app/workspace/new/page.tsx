import { MessageSquareText, Mail, Mic, Send } from "lucide-react";
import { createRFQFromInputAction } from "@/app/workspace/actions";
import { Button } from "@/components/ui/button";
import { Panel, PanelBody, PanelHeader } from "@/components/ui/panel";

export const dynamic = "force-dynamic";

const sampleChat = `09:12 Клиент: Нужно Ningbo - Hamburg, 2 x 40HC, электроника.
09:18 Деск: Подтвердите Incoterms и дату готовности груза.
09:24 Клиент: FOB Ningbo. Груз будет готов на следующей неделе. Нужна ставка ocean FCL.`;

export default async function NewRFQPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <p className="text-label-caps uppercase tracking-wide text-primary">Живой ввод</p>
        <h1 className="mt-1 text-display-lg font-semibold text-ink-text">Новый RFQ</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-text">
          Вставьте письмо клиента, чат или заметки звонка. FreightPilot извлечет RFQ, сохранит обычный кейс, рассчитает подбор агентов из базы и даст менеджеру согласовать имитацию отправки.
        </p>
      </div>

      <Panel>
        <PanelHeader title="Создание RFQ-кейса" eyebrow="LLM-извлечение с проверенным резервным режимом" />
        <PanelBody>
          {params.error === "missing-input" ? (
            <div className="mb-4 rounded-md border border-error/20 bg-error-container p-3 text-sm text-on-error-container">
              Вставьте текст клиента перед созданием RFQ.
            </div>
          ) : null}

          <form action={createRFQFromInputAction} className="space-y-5">
            <div className="grid gap-3 md:grid-cols-3">
              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border-hairline bg-white p-4 has-[:checked]:border-primary-container has-[:checked]:bg-primary-container/10">
                <input className="mt-1" type="radio" name="sourceType" value="email" defaultChecked />
                <span>
                  <span className="flex items-center gap-2 font-semibold text-ink-text">
                    <Mail className="h-4 w-4 text-primary" aria-hidden />
                    Письмо
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-muted-text">Вставленное письмо клиента.</span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border-hairline bg-white p-4 has-[:checked]:border-primary-container has-[:checked]:bg-primary-container/10">
                <input className="mt-1" type="radio" name="sourceType" value="conversation" />
                <span>
                  <span className="flex items-center gap-2 font-semibold text-ink-text">
                    <MessageSquareText className="h-4 w-4 text-primary" aria-hidden />
                    Чат / мессенджер
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-muted-text">Вставка из Teams, WhatsApp или другого мессенджера.</span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border-hairline bg-white p-4 has-[:checked]:border-primary-container has-[:checked]:bg-primary-container/10">
                <input className="mt-1" type="radio" name="sourceType" value="call_notes" />
                <span>
                  <span className="flex items-center gap-2 font-semibold text-ink-text">
                    <Mic className="h-4 w-4 text-primary" aria-hidden />
                    Заметки звонка
                  </span>
                  <span className="mt-1 block text-sm leading-5 text-muted-text">Свободные заметки после звонка.</span>
                </span>
              </label>
            </div>

            <label className="block text-sm font-semibold text-ink-text">
              Текст клиента
              <textarea
                name="rawText"
                rows={14}
                className="mt-2 w-full resize-y rounded-md border border-border-hairline bg-white p-4 text-sm leading-6 outline-none focus:border-primary-container"
                defaultValue={sampleChat}
              />
            </label>

            <div className="rounded-md border border-secondary-container bg-secondary-container/30 p-4 text-sm leading-6 text-on-secondary-container">
              После создания откройте кейс, проверьте извлеченные поля и короткий список, затем согласуйте имитацию отправки выбранным агентам.
            </div>

            <Button type="submit">
              <Send className="h-4 w-4" aria-hidden />
              Создать RFQ и подобрать агентов
            </Button>
          </form>
        </PanelBody>
      </Panel>
    </div>
  );
}

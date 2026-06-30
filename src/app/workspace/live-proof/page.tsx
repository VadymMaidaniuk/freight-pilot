import { LiveProofClient } from "./live-proof-client";

export const dynamic = "force-dynamic";

export default function LiveProofPage() {
  return (
    <div className="space-y-6 pb-20 md:pb-0">
      <div>
        <p className="text-label-caps uppercase tracking-wide text-primary">Контроль презентующего</p>
        <h1 className="mt-1 text-display-lg font-semibold text-ink-text">Проверка AI</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-text">
          Экспериментальное оперативное извлечение из вставленного синтетического текста. Управляемое демо остается детерминированным и не требует запущенной LLM.
        </p>
      </div>
      <LiveProofClient />
    </div>
  );
}

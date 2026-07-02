"use client";

import { useFormStatus } from "react-dom";
import { Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CreateRFQSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <Button type="submit" disabled={pending}>
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
        {pending ? "LLM извлекает RFQ..." : "Создать RFQ из текста"}
      </Button>
      {pending ? (
        <p className="text-sm leading-5 text-muted-text" aria-live="polite">
          Анализируем текст клиента, проверяем JSON-схему и готовим короткий список агентов.
        </p>
      ) : null}
    </div>
  );
}

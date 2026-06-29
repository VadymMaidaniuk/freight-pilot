import { NextResponse } from "next/server";
import { AIValidationFallbackError, createAIService } from "@/lib/ai";

export async function POST(request: Request) {
  const formData = await request.formData();
  const mode = String(formData.get("mode") ?? "rfq");
  const sourceType = String(formData.get("sourceType") ?? "email");
  const rawText = String(formData.get("rawText") ?? "");

  if (!rawText.trim()) {
    return NextResponse.json({ ok: false, message: "Input text is required." }, { status: 400 });
  }

  const ai = createAIService();

  try {
    if (mode === "rate") {
      const result = await ai.normalizeRateReply({
        rawText,
        sourceType: sourceType === "xlsx" ? "xlsx" : sourceType === "messy_text" ? "messy_text" : "email"
      });
      return NextResponse.json({ ok: true, fallback: false, result });
    }

    const result = await ai.extractRFQ({
      rawText,
      sourceType: sourceType === "conversation" ? "conversation" : sourceType === "call_notes" ? "call_notes" : "email"
    });
    return NextResponse.json({ ok: true, fallback: false, result });
  } catch (error) {
    if (error instanceof AIValidationFallbackError) {
      return NextResponse.json({
        ok: true,
        fallback: true,
        message: error.message,
        result: error.fallbackPayload
      });
    }

    return NextResponse.json(
      {
        ok: false,
        message: "Live Proof failed before validation. Check LM Studio availability or use fixture mode."
      },
      { status: 500 }
    );
  }
}

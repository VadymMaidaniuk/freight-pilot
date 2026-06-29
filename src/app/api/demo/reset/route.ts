import { NextResponse } from "next/server";
import { resetWorkspace } from "@/lib/repositories/workspace-repository";

export async function POST() {
  await resetWorkspace();
  return NextResponse.json({ ok: true });
}

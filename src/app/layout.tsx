import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FreightPilot",
  description: "AI Quote Desk для экспедиторов"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

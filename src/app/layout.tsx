import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Solus Command | Amalgamo.us ChatPlayground",
  description: "Multi-model AI command center with intelligent routing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-void-base min-h-screen">
        <div className="noise-overlay" />
        <div className="grid-bg fixed inset-0 pointer-events-none" />
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}

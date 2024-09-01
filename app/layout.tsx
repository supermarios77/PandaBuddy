import type { Metadata } from "next";
import { Providers } from "./providers";
import "@/styles/globals.css";
import NotificationHandler from "@/components/NotificationHandler";

export const metadata: Metadata = {
  title: "Panda Buddy",
  description: "Panda Buddy - Your friendly AI study companion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
          <NotificationHandler />
        </Providers>
      </body>
    </html>
  );
}
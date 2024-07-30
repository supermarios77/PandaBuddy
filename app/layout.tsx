import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Panda Pal",
  description: "Panda Pal - Your friendly AI study companion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from "next";

import Navbar from "@/components/Navbar";

import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Home Page",
  description: "Panda Buddy - Your friendly AI study companion.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body>
          <Navbar />
          {children}
        </body>
    </html>
  );
}

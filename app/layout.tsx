import type { Metadata } from "next";
import { Providers } from "./providers";
import "@/styles/globals.css";
import NotificationHandler from "@/components/NotificationHandler";
import PrelineScript from "@/components/PrelineScript";

export const metadata: Metadata = {
  title: "Panda Buddy - AI-Powered Learning Companion",
  description: "Panda Buddy is an AI-powered learning platform designed to enhance your study experience with interactive quizzes, gamification, and adaptive learning paths. Features include a Pomodoro timer, notes section, creative workspace, and more.",
  keywords: "Panda Buddy, AI learning, interactive quizzes, gamification, study companion, educational app, Pomodoro timer, notes section, creative workspace",
  author: "Your Name or Company",
  openGraph: {
    title: "Panda Buddy - AI-Powered Learning Companion",
    description: "Panda Buddy is an AI-powered learning platform designed to enhance your study experience with interactive quizzes, gamification, and adaptive learning paths.",
    url: "panda-buddy.vercel.app",
    // @ts-ignore
    image: "https://panda-buddy.vercel.app/site-preview.png",
    siteName: "Panda Buddy",
    type: "website",
  }
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
          <PrelineScript />
        </Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { ReactNode, Suspense } from "react";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Panda Buddy - Lets Study!",
  description: "Panda Buddy - Your friendly AI study companion.",
};

const HomeLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="dark:bg-black flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </Suspense>
  );
};

export default HomeLayout;

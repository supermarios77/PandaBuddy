"use client";
import { ReactNode, Suspense } from "react";
import { usePathname } from "next/navigation"; // Import usePathname hook
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import Footer from "@/components/Footer";

const HomeLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className="dark:bg-black flex flex-col min-h-screen"
        suppressHydrationWarning
      >
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </Suspense>
  );
};

export default HomeLayout;

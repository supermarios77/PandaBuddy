"use client";
import { ReactNode, Suspense } from "react";
import { usePathname } from "next/navigation"; // Import usePathname hook
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import Footer from "@/components/Footer";

const HomeLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  const pathname = usePathname();

  const hideNavAndFooter = /\/courses\/.*\/.*\/challenge/.test(pathname);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div
        className="dark:bg-black flex flex-col min-h-screen"
        suppressHydrationWarning
      >
        {!hideNavAndFooter && <Navbar />}
        <main className="flex-grow">{children}</main>
        {!hideNavAndFooter && <Footer />}
      </div>
    </Suspense>
  );
};

export default HomeLayout;

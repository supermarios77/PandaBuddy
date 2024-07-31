import type { Metadata } from "next";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Home Page",
  description: "Panda Buddy - Your friendly AI study companion.",
};

const HomeLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="dark:bg-black flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
};

export default HomeLayout;

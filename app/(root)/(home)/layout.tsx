import type { Metadata } from "next";
import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Home Page",
  description: "Panda Buddy - Your friendly AI study companion.",
};

const HomeLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
  return (
    <div className="dark:bg-black">
      <Navbar />
      {children}
    </div>
  );
};

export default HomeLayout;

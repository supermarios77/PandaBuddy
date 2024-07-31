"use client";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import React from "react";
import ThemeSwitch from "./ThemeSwitch";

const Navbar = () => {
  const { user } = useUser();

  return (
    <header className="flex items-center justify-between w-full pt-5 md:pr-[500px] md:pl-[500px] pl-5 pr-5 bg-white dark:bg-black">
      <div className="flex items-center space-x-4">
        <h1 className="text-xl font-semibold">
          Hello, <span className="font-bold">{user?.username}</span>
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        <ThemeSwitch />
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </header>
  );
};

export default Navbar;
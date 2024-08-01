"use client";
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import React from "react";
import ThemeSwitch from "./ThemeSwitch";

const Navbar = () => {
  const { user } = useUser();

  return (
    <header className="flex items-center justify-between w-full pt-5 lg:pr-[500px] lg:pl-[500px] bg-white dark:bg-black pr-5 pl-5">
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
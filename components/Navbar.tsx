"use client"
import { SignedIn, UserButton, useUser } from "@clerk/nextjs";
import React from "react";

const Navbar = () => {
  const {user} = useUser();

  return (
    <header className="flex items-center justify-between w-full pt-5 md:pr-[500px] md:pl-[500px] pl-5 pr-5">
      <h1 className="text-2xl font-bold">Hello, {user?.username}</h1>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
};

export default Navbar;

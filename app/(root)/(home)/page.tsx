"use client";
import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";

import UFOPanda from "./Animations/PandaInUFO.json";

import Mascot from "./Components/Mascot";
import Cards from "@/components/Card";
import { ActivityIcon, BookIcon, ShoppingCart } from "lucide-react";

const HomePage = () => {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"pass" | "fail">("pass");

  useEffect(() => {
    const now = new Date();

    setTime(
      now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
    setDate(
      new Intl.DateTimeFormat("en-US", { dateStyle: "full" }).format(now)
    );
  }, []);

  return (
    <section className="flex items-center flex-col justify-center p-5 mt-10 text-black dark:text-white ">

      <div className="flex items-center justify-between w-full max-w-4xl p-6 bg-[#9570FF] rounded-[30px]">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Pick Your Subject For Today
          </h1>
          <p className="mt-2 text-white">
            {time} {date}
          </p>
        </div>
        <Lottie animationData={UFOPanda} loop={true} />
      </div>

      <div className="mb-[150px]">
        <Mascot status={status} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-4xl mb-[50px]">
        <Cards link="/shop" icon={<ShoppingCart />} title="Shop" description="Buy Hearts"/>
        <Cards link="/notes" icon={<BookIcon />} title="Notes" description="Manage your notes"/>
        <Cards link="/progress" icon={<ActivityIcon />} title="Progress" description="Track your progress"/>
      </div>

    </section>
  );
};

export default HomePage;

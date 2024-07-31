"use client";
import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import UFOPanda from "./Animations/PandaInUFO.json";

const HomePage = () => {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

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
    <section className="flex items-center justify-center p-5 mt-10 text-black dark:text-white ">

      <div className="flex items-center justify-between w-full max-w-4xl p-6 bg-[#9570FF] rounded-[30px]">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Pick Your Subject For Today
          </h1>
          <p className="mt-2 text-white">{time} {date}</p>
        </div>
        <Lottie animationData={UFOPanda} loop={true} />
      </div>
    </section>
  );
};

export default HomePage;

"use client";
import React, { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { DotLoader } from "react-spinners";

import UFOPanda from "./Animations/PandaInUFO.json";

import Mascot from "./Components/Mascot";
import Cards from "@/components/Card";
import {
  ActivityIcon,
  BookIcon,
  Palette,
  Pencil,
  ShoppingCart,
} from "lucide-react";

const HomePage = () => {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState<"pass" | "fail">("pass");
  const [advice, setAdvice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body: `Generate a 5 word learning advice for this time ${time} of the day`,
          }),
        });
        const data = await response.json();
        const cleanedAdvice = data.output
          .split("\n")
          .map((advice: string) => advice.replace(/[*-]/g, "").trim())
          .filter((advice: string | any[]) => advice.length > 0)
          .sort();
        setAdvice(cleanedAdvice);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching advice", error);
      }
    };

    fetchAdvice();
  }, [date]);

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

  if (loading)
    return (
      <div className="flex justify-center align-middle mt-[200px]">
        <DotLoader />
      </div>
    );

  return (
    <section className="flex items-center flex-col justify-center p-5 mt-10 text-black dark:text-white ">
      <div className="flex items-center justify-between w-full max-w-4xl p-6 bg-[#9570FF] rounded-[30px]">
        <div>
          <h1 className="text-2xl font-bold text-white">
            {advice || `Pick Your Subject For Today`}
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full max-w-4xl mb-[50px]">
        <Cards
          link="/shop"
          icon={<ShoppingCart />}
          title="Shop"
          description="Buy some stickers."
        />
        <Cards
          link="/notes"
          icon={<BookIcon />}
          title="Notes"
          description="Manage your notes."
        />
        <Cards
          link="/courses"
          icon={<Pencil />}
          title="Study"
          description="Earn points now!"
        />
        <Cards
          link="/workbench"
          icon={<Palette />}
          title="Workbench"
          description="Create cool art!"
        />
      </div>
    </section>
  );
};

export default HomePage;

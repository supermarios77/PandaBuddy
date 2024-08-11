import { useState, useEffect } from "react";
import Lottie from "lottie-react";
import passAnimation from "../Animations/PandaPassed.json";
import failAnimation from "../Animations/PandaFailed.json";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface MascotProps {
  status: "pass" | "fail";
}

const Mascot: React.FC<MascotProps> = ({ status }) => {
  const [animationData, setAnimationData] = useState<any>(null);
  const [motivation, setMotivation] = useState("");

  useEffect(() => {
    switch (status) {
      case "pass":
        setAnimationData(passAnimation);
        break;
      case "fail":
        setAnimationData(failAnimation);
        break;
      default:
        setAnimationData(null);
    }
    const fetchMotivation = async () => {
      try {
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body: `Generate a beautiful message from pandy our mascot to motivate the user to learn now and earn points it should be no more than 7 words long`,
          }),
        });
        const data = await response.json();
        const cleanedMotivation = data.output
          .split("\n")
          .map((advice: string) => advice.replace(/[*]/g, "").trim())
          .filter((advice: string | any[]) => advice.length > 0)
          .sort();
        setMotivation(cleanedMotivation);
      } catch (error) {
        console.error("Error fetching advice", error);
      }
    };

    fetchMotivation()
  }, [status]);

  return (
    <div className="h-[300px] w-[300px] mt-12 text-center">
      {animationData && <Lottie animationData={animationData} loop={true} />}
      <p>{motivation || "Pandy can't wait to study!"}</p>
      <Link href="/courses">
        <Button className="mt-4 bg-[#FF7878] text-white hover:bg-[#fc5c5c]">
          Start Studying
        </Button>
      </Link>
    </div>
  );
};

export default Mascot;

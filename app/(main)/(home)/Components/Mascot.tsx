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
  }, [status]);

  return (
    <div className="h-[300px] w-[300px] mt-12 text-center">
      {animationData && <Lottie animationData={animationData} loop={true} />}
      <p>Pandy can't wait to study with you!</p>
      <Link href="/courses">
        <Button className="mt-4 bg-[#FF7878] text-white hover:bg-[#fc5c5c]">
          Start Studying
        </Button>
      </Link>
    </div>
  );
};

export default Mascot;

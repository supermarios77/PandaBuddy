"use client";

import { useKey, useMedia } from "react-use";
import { CheckCircle, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

type ChallengeFooterProps = {
  onCheck: () => void;
  status: "correct" | "wrong" | "none" | "completed";
  disabled?: boolean;
  lessonId?: boolean;
};

const ChallengeFooter: React.FC<ChallengeFooterProps> = ({
  onCheck,
  status,
  disabled,
  lessonId,
}) => {
  useKey("Enter", onCheck, {}, [onCheck]);
  const isMobile = useMedia("(max-width: 1024px)");

  return (
    <footer
      className={cn(
        "lg:h-[140px] h-[100px] border-t-2",
        status === "correct" && "border-transparent bg-green-200",
        status === "wrong" && "border-transparent bg-rose-200"
      )}
    >
      <div className="max-w-[1140px] h-full mx-auto flex items-center justify-between px-6 lg:px-10">
        {status === "correct" && (
          <div className="text-green-500 font-bold text-base lg:text-2xl flex items-center">
            <CheckCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
            Nicely Done!
          </div>
        )}
        {status === "wrong" && (
          <div className="text-rose-500 font-bold text-base lg:text-2xl flex items-center">
            <XCircle className="h-6 w-6 lg:h-10 lg:w-10 mr-4" />
            Try Again!
          </div>
        )}
        {status === "completed" && (
          <div className="text-green-500 font-bold text-base lg:text-2xl flex items-center">
            <Button
              variant="default"
              size={isMobile ? "sm" : "lg"}
              onClick={() => (window.location.href = "/courses")}
            >
              Practice Again
            </Button>
          </div>
        )}
        <Button
          disabled={disabled}
          className={cn(
            "ml-auto text-white",
            status === "wrong" ? "bg-red-500 hover:bg-red-400" : "bg-green-500 hover:bg-green-400"
          )}
          onClick={onCheck}
          size={isMobile ? "sm" : "lg"}
        >
          {status === "none" && "Check"}
          {status === "correct" && "Next"}
          {status === "wrong" && "Retry"}
          {status === "completed" && "Continue"}
        </Button>
      </div>
    </footer>
  );
};

export default ChallengeFooter;
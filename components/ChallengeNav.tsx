"use client"
import { XIcon, HeartIcon } from "lucide-react";
import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";

interface ChallengeNavProps {
  score: number;
  numberOfHearts: any;
}

const ChallengeNav: React.FC<ChallengeNavProps> = ({
  score,
  numberOfHearts,
}) => {
  const router = useRouter();

  const handleClose = () => {
    router.push('/courses');
  };

  return (
    <header className="flex w-full items-center justify-between gap-6 rounded-lg p-2 sm:p-6">
      <Button variant="ghost" size="sm" className="rounded-full sm:size-lg" onClick={handleClose}>
        <XIcon className="h-5 w-5 text-muted-foreground sm:h-7 sm:w-7" />
        <span className="sr-only">Close</span>
      </Button>
      <div className="w-full max-w-md">
        <Progress value={score} className="h-4" />
      </div>
      <div className="flex items-center gap-4 text-lg font-medium">
        <HeartIcon className="h-6 w-6 text-red-500" />
        <span>{numberOfHearts}</span>
      </div>
    </header>
  );
};

export default ChallengeNav;